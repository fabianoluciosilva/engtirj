import type { DraftArticle } from './quality-gates'

/** Converte um texto em slug de URL (sem acentos, minúsculo, até 80 caracteres). */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '')
}

/** Garante slug único acrescentando -2, -3... quando já existe. */
export function uniqueSlug(base: string, existing: string[]): string {
  const taken = new Set(existing)
  if (!taken.has(base)) return base
  let n = 2
  while (taken.has(`${base}-${n}`)) n++
  return `${base}-${n}`
}

export type ParseResult = { ok: true; article: DraftArticle } | { ok: false; error: string }

const str = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0

/** Lê e valida o JSON do artigo devolvido pela IA (aceita cerca ```json e texto ao redor). */
export function parseArticleJson(raw: string): ParseResult {
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end <= start) return { ok: false, error: 'JSON ausente ou incompleto na resposta da IA.' }

  let data: Record<string, unknown>
  try {
    data = JSON.parse(raw.slice(start, end + 1))
  } catch {
    return { ok: false, error: 'JSON inválido na resposta da IA.' }
  }

  const missing = (['title', 'meta_description', 'slug', 'content_md'] as const).filter((k) => !str(data[k]))
  if (missing.length > 0) return { ok: false, error: `Campos ausentes ou inválidos: ${missing.join(', ')}` }

  const list = <T,>(v: unknown, pick: (x: Record<string, unknown>) => T | null): T[] =>
    Array.isArray(v)
      ? v.map((x) => (x && typeof x === 'object' ? pick(x as Record<string, unknown>) : null)).filter((x): x is T => x !== null)
      : []

  return {
    ok: true,
    article: {
      title: (data.title as string).trim(),
      meta_description: (data.meta_description as string).trim(),
      slug: slugify(data.slug as string) || slugify(data.title as string),
      content_md: (data.content_md as string).trim(),
      faq: list(data.faq, (x) => (str(x.question) && str(x.answer) ? { question: x.question, answer: x.answer } : null)),
      sources: list(data.sources, (x) => (str(x.url) ? { title: str(x.title) ? x.title : x.url, url: x.url } : null)),
      keywords: Array.isArray(data.keywords) ? data.keywords.filter((k): k is string => typeof k === 'string') : [],
    },
  }
}
