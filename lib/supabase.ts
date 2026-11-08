import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Schema da tabela `posts` do blog. Mantido aqui (e não num pacote de tipos
 * gerado) porque a landing é um projeto independente com um único recurso.
 */
export interface Post {
  id: string
  slug: string
  title: string
  meta_description: string | null
  content_md: string | null
  category: string | null
  published_at: string | null
  is_published: boolean
  cover_url: string | null
  created_at: string
}

/** Payload de inserção em `posts`. */
export type PostInsert = {
          id?: string
          slug: string
          title: string
          meta_description?: string | null
          content_md?: string | null
          category?: string | null
          published_at?: string | null
          is_published?: boolean
          cover_url?: string | null
          created_at?: string
        }
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

/**
 * Client público (anon) — usado nas leituras do blog (posts publicados).
 * RLS da tabela `posts` permite SELECT apenas das linhas is_published = true.
 * Retorna null se as env vars não estiverem configuradas, para que as páginas
 * degradem com graça (empty state) em vez de quebrar o build.
 *
 * Sem generic de Database: as linhas são tipadas explicitamente nos call sites
 * (lib/posts.ts), o que mantém o cliente simples e evita a inferência `never`
 * do supabase-js em tabelas de schema único.
 */
export function getPublicClient(): SupabaseClient | null {
  if (!URL || !ANON_KEY) return null
  return createClient(URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/**
 * Client administrativo (service_role) — SOMENTE no server, para escrita
 * (cron de geração de post, seed). Nunca importar em componente de client.
 */
export function getAdminClient(): SupabaseClient {
  if (!URL || !SERVICE_ROLE_KEY) {
    throw new Error(
      'Supabase do blog não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.',
    )
  }
  return createClient(URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

