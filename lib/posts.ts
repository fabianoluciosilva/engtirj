import { getPublicClient, type Post } from './supabase'

/**
 * Acesso aos posts do blog via Supabase.
 * Todas as funções são seguras para Server Components e degradam com graça
 * (retornam vazio) quando o Supabase ainda não está configurado.
 */

export const POSTS_PAGE_SIZE = 9

/** Lista posts publicados, mais recentes primeiro, paginado. */
export async function listPublishedPosts(opts?: {
  page?: number
  pageSize?: number
}): Promise<{ posts: Post[]; total: number }> {
  const supabase = getPublicClient()
  if (!supabase) return { posts: [], total: 0 }

  const page = Math.max(1, opts?.page ?? 1)
  const pageSize = Math.max(1, opts?.pageSize ?? POSTS_PAGE_SIZE)
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, count, error } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .range(from, to)

  if (error) {
    console.error('[posts] listPublishedPosts', error.message)
    return { posts: [], total: 0 }
  }

  return { posts: (data ?? []) as Post[], total: count ?? 0 }
}

/** Os N posts mais recentes — usado no preview da landing. */
export async function getLatestPosts(limit = 3): Promise<Post[]> {
  const supabase = getPublicClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) {
    console.error('[posts] getLatestPosts', error.message)
    return []
  }
  return (data ?? []) as Post[]
}

/** Um post publicado pelo slug — usado em /blog/[slug]. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = getPublicClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()

  if (error) {
    console.error('[posts] getPostBySlug', error.message)
    return null
  }
  return (data as Post | null) ?? null
}

/** Slugs de todos os posts publicados — usado em generateStaticParams. */
export async function listPublishedSlugs(): Promise<string[]> {
  const supabase = getPublicClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('posts')
    .select('slug')
    .eq('is_published', true)

  if (error) {
    console.error('[posts] listPublishedSlugs', error.message)
    return []
  }
  return (data ?? []).map((row) => (row as { slug: string }).slug)
}

/** Posts publicados de uma ou mais categorias — artigos relacionados nas páginas de serviço. */
export async function getPostsByCategories(categories: string[], limit = 3): Promise<Post[]> {
  if (categories.length === 0) return []
  const supabase = getPublicClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .in('category', categories)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit)

  if (error) {
    console.error('[posts] getPostsByCategories', error.message)
    return []
  }
  return (data ?? []) as Post[]
}
