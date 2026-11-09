import { getAdminClient, type GenerationRun, type Post, type PostInsert, type RunOutcome, type Topic } from '../supabase'

/**
 * Acesso ao banco para o pipeline e o painel (service_role, só no servidor).
 * Lança erro com a mensagem do Supabase quando uma consulta falha.
 */
function check<T>(res: { data: T | null; error: { message: string } | null }, what: string): T {
  if (res.error) throw new Error(`${what}: ${res.error.message}`)
  return res.data as T
}

// ── configurações ──────────────────────────────────────────────────────────
export async function getPaused(): Promise<boolean> {
  const db = getAdminClient()
  const row = check(await db.from('settings').select('paused').eq('id', 1).maybeSingle(), 'settings')
  return Boolean((row as { paused?: boolean } | null)?.paused)
}

export async function setPaused(paused: boolean): Promise<void> {
  const db = getAdminClient()
  check(await db.from('settings').upsert({ id: 1, paused }), 'settings')
}

// ── temas ──────────────────────────────────────────────────────────────────
export async function listTopics(): Promise<Topic[]> {
  const db = getAdminClient()
  return check(
    await db.from('topics').select('*').order('status', { ascending: true }).order('priority', { ascending: false }).order('created_at', { ascending: true }),
    'topics',
  ) as Topic[]
}

export async function countPendingTopics(): Promise<number> {
  const db = getAdminClient()
  const { count, error } = await db.from('topics').select('id', { count: 'exact', head: true }).eq('status', 'pending')
  if (error) throw new Error(`topics: ${error.message}`)
  return count ?? 0
}

export async function getTopic(id: string): Promise<Topic | null> {
  const db = getAdminClient()
  return (check(await db.from('topics').select('*').eq('id', id).maybeSingle(), 'topics') as Topic | null) ?? null
}

/** Próximo tema pendente: categoria menos publicada, depois prioridade e antiguidade. */
export async function pickNextTopic(): Promise<Topic | null> {
  const db = getAdminClient()
  const pending = check(
    await db.from('topics').select('*').eq('status', 'pending').order('priority', { ascending: false }).order('created_at', { ascending: true }),
    'topics',
  ) as Topic[]
  if (pending.length === 0) return null

  const published = check(await db.from('posts').select('category').eq('status', 'published'), 'posts') as { category: string | null }[]
  const counts = new Map<string, number>()
  for (const p of published) if (p.category) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)

  return pending.reduce((best, t) => {
    const ct = counts.get(t.category) ?? 0
    const cb = counts.get(best.category) ?? 0
    if (ct !== cb) return ct < cb ? t : best
    return t.priority > best.priority ? t : best
  })
}

export async function insertTopics(
  topics: { title: string; category: string; angle: string; keywords: string[] }[],
  origin: 'curated' | 'research',
): Promise<number> {
  if (topics.length === 0) return 0
  const db = getAdminClient()
  const existing = (check(await db.from('topics').select('title'), 'topics') as { title: string }[]).map((t) => t.title.toLowerCase())
  const fresh = topics.filter((t) => !existing.includes(t.title.toLowerCase()))
  if (fresh.length === 0) return 0
  check(await db.from('topics').insert(fresh.map((t) => ({ ...t, origin }))), 'topics')
  return fresh.length
}

export async function updateTopic(id: string, patch: Partial<Pick<Topic, 'status' | 'priority' | 'post_id' | 'title' | 'angle' | 'category'>>): Promise<void> {
  const db = getAdminClient()
  check(await db.from('topics').update(patch).eq('id', id), 'topics')
}

// ── posts ──────────────────────────────────────────────────────────────────
export async function listAllPostsBrief(): Promise<{ title: string; slug: string }[]> {
  const db = getAdminClient()
  return check(await db.from('posts').select('title, slug'), 'posts') as { title: string; slug: string }[]
}

export async function listPosts(): Promise<Post[]> {
  const db = getAdminClient()
  return check(await db.from('posts').select('*').order('created_at', { ascending: false }), 'posts') as Post[]
}

export async function getPostById(id: string): Promise<Post | null> {
  const db = getAdminClient()
  return (check(await db.from('posts').select('*').eq('id', id).maybeSingle(), 'posts') as Post | null) ?? null
}

export async function insertPost(payload: PostInsert): Promise<Post> {
  const db = getAdminClient()
  return check(await db.from('posts').insert(payload).select('*').single(), 'posts') as Post
}

export async function updatePost(id: string, patch: Partial<PostInsert>): Promise<Post> {
  const db = getAdminClient()
  return check(await db.from('posts').update(patch).eq('id', id).select('*').single(), 'posts') as Post
}

export async function deletePost(id: string): Promise<void> {
  const db = getAdminClient()
  check(await db.from('posts').delete().eq('id', id), 'posts')
}

// ── execuções ──────────────────────────────────────────────────────────────
export async function startRun(trigger: 'cron' | 'manual'): Promise<string> {
  const db = getAdminClient()
  const row = check(await db.from('generation_runs').insert({ trigger }).select('id').single(), 'generation_runs') as { id: string }
  return row.id
}

export async function finishRun(
  id: string,
  patch: { outcome: RunOutcome; reasons: string[]; topic_id?: string | null; topic_title?: string | null; post_id?: string | null; log?: string },
): Promise<void> {
  const db = getAdminClient()
  check(await db.from('generation_runs').update({ ...patch, finished_at: new Date().toISOString() }).eq('id', id), 'generation_runs')
}

export async function listRuns(limit = 30): Promise<GenerationRun[]> {
  const db = getAdminClient()
  return check(await db.from('generation_runs').select('*').order('started_at', { ascending: false }).limit(limit), 'generation_runs') as GenerationRun[]
}
