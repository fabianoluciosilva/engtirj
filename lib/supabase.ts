import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type PostStatus = 'draft' | 'published' | 'archived'

export interface PostSource {
  title: string
  url: string
}

export interface PostFaq {
  question: string
  answer: string
}

/**
 * Schema da tabela `posts` do blog. Mantido aqui (e não num pacote de tipos
 * gerado) porque a landing é um projeto independente.
 */
export interface Post {
  id: string
  slug: string
  title: string
  meta_description: string | null
  content_md: string | null
  category: string | null
  published_at: string | null
  /** Derivado de `status` por trigger no banco. */
  is_published: boolean
  cover_url: string | null
  created_at: string
  status: PostStatus
  sources: PostSource[]
  faq: PostFaq[]
  keywords: string[]
  reading_minutes: number | null
  updated_at: string
  topic_id: string | null
}

/** Payload de inserção/atualização em `posts`. */
export type PostInsert = Partial<Omit<Post, 'id' | 'created_at' | 'updated_at' | 'is_published'>> & {
  slug: string
  title: string
}

export interface Topic {
  id: string
  title: string
  category: string
  angle: string
  keywords: string[]
  origin: 'curated' | 'research'
  status: 'pending' | 'used' | 'skipped'
  priority: number
  post_id: string | null
  created_at: string
}

export type RunOutcome = 'published' | 'draft_rejected' | 'error' | 'skipped'

export interface GenerationRun {
  id: string
  started_at: string
  finished_at: string | null
  trigger: 'cron' | 'manual'
  topic_id: string | null
  topic_title: string | null
  outcome: RunOutcome
  reasons: string[]
  post_id: string | null
  log: string | null
}

// As variáveis são lidas dentro das funções (e não no import) para que scripts
// fora do Next possam carregar o .env.local antes de usar o client.

/**
 * Client público (anon) — usado nas leituras do blog (posts publicados).
 * RLS da tabela `posts` permite SELECT apenas das linhas publicadas.
 * Retorna null se as env vars não estiverem configuradas, para que as páginas
 * degradem com graça (empty state) em vez de quebrar o build.
 */
export function getPublicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return null
  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/**
 * Client administrativo (service_role) — SOMENTE no servidor (cron e painel).
 * Nunca importar em componente de client.
 */
export function getAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error(
      'Supabase do blog não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.',
    )
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
