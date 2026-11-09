/**
 * Seed da fila de temas do blog.
 * Uso: npm run db:seed
 *
 * Requer NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (no .env.local ou
 * no ambiente) e a migração supabase/migrations/20261109000000_blog_v2.sql aplicada.
 * É idempotente: temas com o mesmo título não são duplicados.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { curatedTopics } from '../lib/blog/curated-topics'
import { insertTopics } from '../lib/blog/repo'

// Carrega .env.local manualmente (script fora do runtime do Next).
function loadEnvLocal() {
  try {
    const file = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
    for (const line of file.split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (!match) continue
      const [, key, raw] = match
      if (process.env[key]) continue
      process.env[key] = raw.replace(/^["']|["']$/g, '')
    }
  } catch {
    // Sem .env.local — presume variáveis já exportadas no ambiente.
  }
}

async function main() {
  loadEnvLocal()
  const added = await insertTopics(curatedTopics, 'curated')
  console.log(`${added} tema(s) inserido(s); ${curatedTopics.length - added} já existiam.`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
