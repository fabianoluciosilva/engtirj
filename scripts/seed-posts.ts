/**
 * Seed do blog — publica os 4 artigos-base dos temas de engenharia.
 * Uso: npm run db:seed
 *
 * Requer NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local.
 * É idempotente: usa upsert por slug (não duplica artigos existentes).
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { blogTopics } from '../lib/blog-topics'
import { generateArticle } from '../lib/blog-generator'

// Carrega .env.local manualmente (script fora do runtime do Next).
function loadEnvLocal() {
  try {
    const path = resolve(process.cwd(), '.env.local')
    const file = readFileSync(path, 'utf8')
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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Faltam NEXT_PUBLIC_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY.')
    process.exit(1)
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  let ok = 0
  for (const topic of blogTopics) {
    const { content_md, source } = await generateArticle(topic)
    const { error } = await supabase.from('posts').upsert(
      {
        slug: topic.slug,
        title: topic.title,
        meta_description: topic.metaDescription,
        content_md,
        category: topic.category,
        is_published: true,
        published_at: new Date().toISOString(),
      },
      { onConflict: 'slug' },
    )

    if (error) {
      console.error(`✗ ${topic.slug}: ${error.message}`)
    } else {
      ok += 1
      console.log(`✓ ${topic.slug} (${source})`)
    }
  }

  console.log(`\nConcluído: ${ok}/${blogTopics.length} artigos publicados.`)
  process.exit(ok === blogTopics.length ? 0 : 1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
