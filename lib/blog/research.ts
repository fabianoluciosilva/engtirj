import { normalizeUrl } from './quality-gates'

/**
 * Pesquisa na web via Firecrawl (POST /v2/search). Cada resultado já vem com o
 * markdown da página, que serve de base factual para o artigo.
 */
export interface WebResult {
  url: string
  title: string
  description: string
  text: string
}

export interface ResearchSource {
  url: string
  title: string
  text: string
}

export interface ResearchResult {
  sources: ResearchSource[]
  queries: string[]
}

const BLOCKED_HOSTS = ['pinterest.', 'facebook.', 'instagram.', 'tiktok.', 'twitter.', 'x.com', 'youtube.', 'youtu.be']
const MIN_TEXT = 800
const MAX_TEXT_PER_SOURCE = 20_000

function endpoint(): { url: string; key: string } {
  const key = process.env.FIRECRAWL_API_KEY
  if (!key) throw new Error('FIRECRAWL_API_KEY não configurada.')
  return { url: 'https://api.firecrawl.dev/v2/search', key }
}

/** Busca na web. Com `scrape`, devolve também o markdown de cada página. */
export async function searchWeb(query: string, opts: { limit?: number; scrape?: boolean } = {}): Promise<WebResult[]> {
  const { url, key } = endpoint()
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 60_000)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      signal: controller.signal,
      body: JSON.stringify({
        query,
        limit: opts.limit ?? 5,
        sources: [{ type: 'web' }],
        country: 'BR',
        timeout: 45_000,
        ...(opts.scrape ? { scrapeOptions: { formats: ['markdown'], onlyMainContent: true } } : {}),
      }),
    })
    if (!res.ok) throw new Error(`Firecrawl respondeu HTTP ${res.status}.`)

    const json = (await res.json()) as {
      success?: boolean
      data?: { web?: Array<Record<string, unknown>> } | Array<Record<string, unknown>>
    }
    const items = Array.isArray(json.data) ? json.data : (json.data?.web ?? [])
    return items
      .map((it) => ({
        url: String(it.url ?? ''),
        title: String(it.title ?? (it.metadata as Record<string, unknown> | undefined)?.title ?? ''),
        description: String(it.description ?? ''),
        text: String(it.markdown ?? ''),
      }))
      .filter((r) => r.url)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw new Error('Firecrawl excedeu o tempo limite.')
    throw error
  } finally {
    clearTimeout(timer)
  }
}

const isBlocked = (url: string) => {
  try {
    const host = new URL(url).hostname.toLowerCase()
    return BLOCKED_HOSTS.some((b) => host.includes(b))
  } catch {
    return true
  }
}

export function buildQueries(topic: { title: string; keywords: string[] }): string[] {
  const kw = topic.keywords.slice(0, 3).join(' ')
  return [topic.title, `${kw} escritório de engenharia arquitetura`].filter(Boolean)
}

/** Pesquisa o tema e devolve até 4 fontes com texto suficiente, sem duplicatas. */
export async function researchTopic(topic: { title: string; keywords: string[] }): Promise<ResearchResult> {
  const queries = buildQueries(topic)
  const found = new Map<string, ResearchSource>()
  let lastError: unknown = null

  for (const q of queries) {
    try {
      for (const r of await searchWeb(q, { limit: 5, scrape: true })) {
        if (isBlocked(r.url) || r.text.length < MIN_TEXT) continue
        const key = normalizeUrl(r.url)
        if (!found.has(key)) {
          found.set(key, { url: r.url, title: r.title || r.url, text: r.text.slice(0, MAX_TEXT_PER_SOURCE) })
        }
      }
    } catch (error) {
      lastError = error
    }
  }

  if (found.size === 0 && lastError) throw lastError
  const sources = Array.from(found.values())
    .sort((a, b) => b.text.length - a.text.length)
    .slice(0, 4)
  return { sources, queries }
}
