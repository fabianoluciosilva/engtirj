import { NextResponse } from 'next/server'
import { getAdminClient, type PostInsert } from '@/lib/supabase'
import { blogTopics, pickNextTopic } from '@/lib/blog-topics'
import { generateArticle } from '@/lib/blog-generator'

// Rota executada pelo Vercel Cron (semanal) ou por uma Supabase Edge Function.
// Protegida por CRON_SECRET no header Authorization.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const header = request.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : header
  return token === secret
}

/**
 * Gera e insere UM artigo por chamada.
 * - Escolhe o próximo tema ainda não publicado (cicla quando esgotam).
 * - Gera o Markdown (DeepSeek ou fallback determinístico).
 * - Insere em `posts` já publicado.
 *
 * Aceita GET (Vercel Cron usa GET) e POST. Parâmetro opcional ?slug= força
 * um tema específico (útil para teste manual).
 */
async function handle(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getAdminClient()

    // Descobre quais temas já existem.
    const { data: existing, error: selectError } = await supabase.from('posts').select('slug')
    if (selectError) {
      return NextResponse.json({ ok: false, error: selectError.message }, { status: 500 })
    }
    const existingSlugs = (existing ?? []).map((row) => (row as { slug: string }).slug)

    // Tema: forçado por query ou o próximo pendente.
    const url = new URL(request.url)
    const forcedSlug = url.searchParams.get('slug')
    const forced = forcedSlug ? blogTopics.find((t) => t.slug === forcedSlug) : undefined
    const topic = forced ?? pickNextTopic(existingSlugs)

    // Se forçado e já existir, não duplica (idempotência).
    if (forced && existingSlugs.includes(forced.slug)) {
      return NextResponse.json({ ok: true, skipped: true, reason: 'tema já publicado', slug: topic.slug })
    }

    const { content_md, source } = await generateArticle(topic)

    const payload: PostInsert = {
        slug: topic.slug,
        title: topic.title,
        meta_description: topic.metaDescription,
        content_md,
        category: topic.category,
        is_published: true,
        published_at: new Date().toISOString(),
    }

    const { error: insertError } = await supabase.from('posts').insert(payload)

    if (insertError) {
      return NextResponse.json({ ok: false, error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      source,
      post: { slug: payload.slug, title: payload.title, published_at: payload.published_at },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'erro desconhecido'
    console.error('[cron/generate-post]', message)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  return handle(request)
}

export async function POST(request: Request) {
  return handle(request)
}

