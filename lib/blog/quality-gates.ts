/**
 * Travas automáticas de qualidade do blog. Funções puras (sem rede): recebem o
 * artigo gerado e o contexto da pesquisa e devolvem os motivos de reprovação.
 * Como a publicação é automática, é aqui que se decide se o artigo vai ao ar.
 */

export interface DraftArticle {
  title: string
  meta_description: string
  slug: string
  content_md: string
  faq: { question: string; answer: string }[]
  sources: { title: string; url: string }[]
  keywords: string[]
}

export interface GateContext {
  /** URLs que a pesquisa realmente retornou/leu. */
  researchedUrls: string[]
  existingTitles: string[]
  existingSlugs: string[]
  /** Texto (markdown) das fontes lidas, para a trava anti-cópia. */
  sourceTexts: string[]
  allowedPhones: string[]
  allowedEmails: string[]
}

export interface GateResult {
  ok: boolean
  reasons: string[]
}

export const LIMITS = {
  minWords: 900,
  maxWords: 1600,
  minSources: 2,
  titleSimilarityMax: 0.6,
  copyWindow: 12,
  metaMin: 50,
  metaMax: 160,
  titleMin: 20,
  titleMax: 110,
  directMin: 20,
  directMax: 90,
} as const

const STOPWORDS = new Set([
  'de', 'da', 'do', 'das', 'dos', 'e', 'a', 'o', 'as', 'os', 'para', 'com', 'em', 'no', 'na', 'nos', 'nas',
  'um', 'uma', 'por', 'que', 'se', 'ou', 'ao', 'aos', 'como',
])

const stripAccents = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*_>`|~]/g, ' ')
    .replace(/^\s*[-+]\s+/gm, ' ')
}

function tokens(text: string): string[] {
  return stripAccents(text.toLowerCase())
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

export function countWords(md: string): number {
  return stripMarkdown(md)
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length
}

export function normalizeUrl(raw: string): string {
  try {
    const u = new URL(raw)
    u.hash = ''
    const path = u.pathname.length > 1 ? u.pathname.replace(/\/+$/, '') : ''
    return `${u.protocol}//${u.host}${path}${u.search}`.toLowerCase()
  } catch {
    return raw.trim().toLowerCase()
  }
}

/** Similaridade de Jaccard entre os tokens significativos de dois títulos. */
export function titleSimilarity(a: string, b: string): number {
  const ta = new Set(tokens(a).filter((t) => t.length > 1 && !STOPWORDS.has(t)))
  const tb = new Set(tokens(b).filter((t) => t.length > 1 && !STOPWORDS.has(t)))
  if (ta.size === 0 || tb.size === 0) return 0
  let inter = 0
  ta.forEach((t) => {
    if (tb.has(t)) inter++
  })
  return inter / (ta.size + tb.size - inter)
}

/** Há `n` palavras consecutivas do artigo idênticas ao texto de alguma fonte? */
export function hasLongCopy(article: string, sources: string[], n: number = LIMITS.copyWindow): boolean {
  const grams = new Set<string>()
  for (const src of sources) {
    const t = tokens(stripMarkdown(src))
    for (let i = 0; i + n <= t.length; i++) grams.add(t.slice(i, i + n).join(' '))
  }
  if (grams.size === 0) return false
  const a = tokens(stripMarkdown(article))
  for (let i = 0; i + n <= a.length; i++) {
    if (grams.has(a.slice(i, i + n).join(' '))) return true
  }
  return false
}

const PLACEHOLDER_RE =
  /em atualiza[cç][aã]o|lorem ipsum|\bTODO\b|\bTBD\b|\[inserir|conte[uú]do em constru[cç][aã]o|gerado automaticamente|ser[aá] complementado/i
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g
const PHONE_RE = /(?:\+?55\s?)?\(?\d{2}\)?\s?9?\d{4}-?\d{4}/g
const digits = (s: string) => s.replace(/\D/g, '')

function firstParagraph(md: string): string {
  const blocks = md.trim().split(/\n\s*\n/)
  return blocks.find((b) => !b.trim().startsWith('#'))?.trim() ?? ''
}

export function runGates(article: DraftArticle, ctx: GateContext): GateResult {
  const reasons: string[] = []
  const { title, meta_description: meta, slug, content_md: body } = article

  const words = countWords(body)
  if (words < LIMITS.minWords) reasons.push(`O artigo tem ${words} palavras (mínimo ${LIMITS.minWords}).`)
  if (words > LIMITS.maxWords) reasons.push(`O artigo tem ${words} palavras (máximo ${LIMITS.maxWords}).`)

  const direct = countWords(firstParagraph(body))
  if (direct < LIMITS.directMin || direct > LIMITS.directMax) {
    reasons.push(
      `O primeiro parágrafo (resposta direta) tem ${direct} palavras; deve ter entre ${LIMITS.directMin} e ${LIMITS.directMax} palavras.`,
    )
  }

  if (title.length < LIMITS.titleMin || title.length > LIMITS.titleMax) {
    reasons.push(`O título deve ter entre ${LIMITS.titleMin} e ${LIMITS.titleMax} caracteres.`)
  }
  if (meta.length < LIMITS.metaMin || meta.length > LIMITS.metaMax) {
    reasons.push(`A descrição (meta) deve ter entre ${LIMITS.metaMin} e ${LIMITS.metaMax} caracteres (tem ${meta.length}).`)
  }

  if (PLACEHOLDER_RE.test(body) || PLACEHOLDER_RE.test(title) || PLACEHOLDER_RE.test(meta)) {
    reasons.push('O texto contém marcador de placeholder.')
  }

  const allowedPhones = ctx.allowedPhones.map(digits)
  for (const found of body.match(PHONE_RE) ?? []) {
    const d = digits(found)
    if (!allowedPhones.some((p) => p.endsWith(d) || d.endsWith(p))) {
      reasons.push(`Telefone não autorizado no texto: ${found.trim()}`)
      break
    }
  }
  const allowedEmails = ctx.allowedEmails.map((e) => e.toLowerCase())
  for (const found of body.match(EMAIL_RE) ?? []) {
    if (!allowedEmails.includes(found.toLowerCase())) {
      reasons.push(`E-mail não autorizado no texto: ${found}`)
      break
    }
  }

  const researched = new Set(ctx.researchedUrls.map(normalizeUrl))
  const cited = Array.from(new Set(article.sources.map((s) => normalizeUrl(s.url))))
  if (cited.length < LIMITS.minSources) {
    reasons.push(`São necessárias ao menos ${LIMITS.minSources} fontes citadas (há ${cited.length}).`)
  }
  for (const s of article.sources) {
    if (!researched.has(normalizeUrl(s.url))) {
      reasons.push(`Fonte citada não pesquisada: ${s.url}`)
    }
  }

  for (const existing of ctx.existingTitles) {
    if (titleSimilarity(title, existing) >= LIMITS.titleSimilarityMax) {
      reasons.push(`O título é muito parecido com um artigo existente: "${existing}".`)
      break
    }
  }
  if (ctx.existingSlugs.includes(slug)) reasons.push(`O slug já existe: ${slug}`)

  if (!/rio de janeiro|\bRJ\b/i.test(`${title} ${meta} ${body}`)) {
    reasons.push('O texto não menciona o Rio de Janeiro.')
  }

  if (hasLongCopy(body, ctx.sourceTexts)) {
    reasons.push(`Possível cópia literal de fonte (${LIMITS.copyWindow} palavras seguidas idênticas).`)
  }

  return { ok: reasons.length === 0, reasons }
}
