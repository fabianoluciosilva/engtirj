'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAdminConfig, passwordMatches } from '@/lib/admin-auth'
import {
  clientKey,
  endSession,
  loginWaitSeconds,
  registerLoginFailure,
  registerLoginSuccess,
  requireAdmin,
  startSession,
} from '@/lib/admin-session'
import { runGeneration } from '@/lib/blog/pipeline'
import { revalidateBlog } from '@/lib/blog/revalidate'
import * as repo from '@/lib/blog/repo'
import { discoverTopics } from '@/lib/blog/topic-discovery'
import { slugify } from '@/lib/blog/text'
import { countWords } from '@/lib/blog/quality-gates'
import type { PostFaq, PostSource, PostStatus } from '@/lib/supabase'


const text = (f: FormData, k: string) => String(f.get(k) ?? '').trim()

// ── sessão ─────────────────────────────────────────────────────────────────
export async function loginAction(formData: FormData) {
  const config = getAdminConfig()
  if (!config) redirect('/admin/login?erro=config')

  const key = await clientKey()
  const wait = loginWaitSeconds(key)
  if (wait > 0) redirect(`/admin/login?erro=espera&s=${wait}`)

  if (!(await passwordMatches(text(formData, 'senha'), config.password))) {
    registerLoginFailure(key)
    redirect('/admin/login?erro=senha')
  }
  registerLoginSuccess(key)
  await startSession(config.secret)
  redirect('/admin')
}

export async function logoutAction() {
  await endSession()
  redirect('/admin/login')
}

// ── artigos ────────────────────────────────────────────────────────────────
function parseSources(raw: string): PostSource[] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [a, ...rest] = l.split('|').map((s) => s.trim())
      const url = rest.length > 0 ? rest.join('|') : a
      return { title: rest.length > 0 ? a : url, url }
    })
    .filter((s) => /^https?:\/\//i.test(s.url))
}

function parseFaq(raw: string): PostFaq[] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [q, ...rest] = l.split('|').map((s) => s.trim())
      return { question: q, answer: rest.join('|') }
    })
    .filter((f) => f.question && f.answer)
}

export async function savePostAction(formData: FormData) {
  await requireAdmin()
  const id = text(formData, 'id')
  const title = text(formData, 'title')
  const content = String(formData.get('content_md') ?? '')
  if (!id || !title) redirect(`/admin/artigos/${id}?erro=campos`)

  const status = text(formData, 'status') as PostStatus
  const post = await repo.updatePost(id, {
    title,
    slug: slugify(text(formData, 'slug')) || slugify(title),
    meta_description: text(formData, 'meta_description') || null,
    category: text(formData, 'category') || null,
    cover_url: text(formData, 'cover_url') || null,
    content_md: content,
    status: ['draft', 'published', 'archived'].includes(status) ? status : 'draft',
    sources: parseSources(text(formData, 'sources')),
    faq: parseFaq(text(formData, 'faq')),
    keywords: text(formData, 'keywords').split(',').map((k) => k.trim()).filter(Boolean),
    reading_minutes: Math.max(1, Math.ceil(countWords(content) / 200)),
  })
  revalidateBlog(post.slug)
  revalidatePath('/admin', 'layout')
  redirect(`/admin/artigos/${id}?ok=1`)
}

export async function setPostStatusAction(formData: FormData) {
  await requireAdmin()
  const id = text(formData, 'id')
  const status = text(formData, 'status') as PostStatus
  if (!id || !['draft', 'published', 'archived'].includes(status)) return
  const post = await repo.updatePost(id, { status })
  revalidateBlog(post.slug)
  revalidatePath('/admin', 'layout')
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin()
  const id = text(formData, 'id')
  const post = await repo.getPostById(id)
  if (!post) return
  await repo.deletePost(id)
  revalidateBlog(post.slug)
  revalidatePath('/admin', 'layout')
  redirect('/admin/artigos')
}

// ── geração ────────────────────────────────────────────────────────────────
export async function generateNowAction(formData: FormData) {
  await requireAdmin()
  const topicId = text(formData, 'topic') || undefined
  const report = await runGeneration({ trigger: 'manual', topicId, ignorePause: true })
  if (report.outcome === 'published') revalidateBlog(report.slug)
  revalidatePath('/admin', 'layout')
  redirect(`/admin?run=${report.outcome}`)
}

export async function togglePausedAction() {
  await requireAdmin()
  await repo.setPaused(!(await repo.getPaused()))
  revalidatePath('/admin', 'layout')
}

// ── temas ──────────────────────────────────────────────────────────────────
export async function addTopicAction(formData: FormData) {
  await requireAdmin()
  const title = text(formData, 'title')
  const category = text(formData, 'category')
  if (title.length < 10 || !category) redirect('/admin/temas?erro=campos')
  await repo.insertTopics(
    [{ title, category, angle: text(formData, 'angle'), keywords: text(formData, 'keywords').split(',').map((k) => k.trim()).filter(Boolean) }],
    'curated',
  )
  revalidatePath('/admin/temas')
  redirect('/admin/temas?ok=1')
}

export async function setTopicStatusAction(formData: FormData) {
  await requireAdmin()
  const status = text(formData, 'status')
  if (!['pending', 'skipped'].includes(status)) return
  await repo.updateTopic(text(formData, 'id'), { status: status as 'pending' | 'skipped' })
  revalidatePath('/admin/temas')
}

export async function setTopicPriorityAction(formData: FormData) {
  await requireAdmin()
  const topic = await repo.getTopic(text(formData, 'id'))
  if (!topic) return
  const delta = Number(text(formData, 'delta')) || 0
  await repo.updateTopic(topic.id, { priority: Math.max(0, Math.min(99, topic.priority + delta)) })
  revalidatePath('/admin/temas')
}

export async function researchTopicsAction() {
  await requireAdmin()
  const titles = (await repo.listTopics()).map((t) => t.title).concat((await repo.listAllPostsBrief()).map((p) => p.title))
  let added = 0
  try {
    added = await repo.insertTopics(await discoverTopics(titles), 'research')
  } catch (error) {
    redirect(`/admin/temas?erro=${encodeURIComponent(error instanceof Error ? error.message : 'pesquisa falhou')}`)
  }
  revalidatePath('/admin/temas')
  redirect(`/admin/temas?novos=${added}`)
}
