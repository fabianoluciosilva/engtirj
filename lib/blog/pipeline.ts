import { site } from '../site'
import type { PostInsert, RunOutcome, Topic } from '../supabase'
import { chat } from './llm'
import { discoverTopics } from './topic-discovery'
import { researchTopic, type ResearchSource } from './research'
import { countWords, runGates, type DraftArticle, type GateContext, type GateResult } from './quality-gates'
import { parseArticleJson, uniqueSlug } from './text'
import * as repo from './repo'

/**
 * Pipeline do artigo semanal: tema → pesquisa → redação → travas → verificação
 * factual → publicação (ou rascunho com os motivos).
 */
export interface RunOptions {
  trigger: 'cron' | 'manual'
  /** Não grava nada no banco; devolve o artigo e o resultado das travas. */
  dry?: boolean
  topicId?: string
  /** Execuções manuais ignoram a pausa (que vale só para o cron). */
  ignorePause?: boolean
}

export interface RunReport {
  outcome: RunOutcome
  reasons: string[]
  topic?: { id: string; title: string }
  postId?: string | null
  slug?: string
  article?: DraftArticle
  gates?: GateResult
  unsupportedClaims?: string[]
  log: string[]
  dry: boolean
}

const REPLENISH_BELOW = 5
const MAX_UNSUPPORTED_CLAIMS = 2
/** Orçamento de tempo: sem espaço para uma 2ª tentativa depois disso. */
const RETRY_DEADLINE_MS = 170_000

const SYSTEM_PROMPT =
  'Você é engenheiro de infraestrutura de TI e escreve para sócios e coordenadores de escritórios de engenharia, ' +
  'arquitetura e construtoras do Rio de Janeiro. Escreve em português do Brasil, de forma direta, prática e precisa. ' +
  'Só afirma o que está sustentado pelas fontes fornecidas ou é conhecimento técnico consolidado; ' +
  'nunca inventa números, versões, preços ou contatos. Responde sempre com um único objeto JSON.'

function sourcesBlock(sources: ResearchSource[]): string {
  return sources.map((s, i) => `### FONTE ${i + 1}\nURL: ${s.url}\nTÍTULO: ${s.title}\n${s.text.slice(0, 5000)}`).join('\n\n')
}

function writePrompt(topic: Topic, sources: ResearchSource[], previousReasons: string[]): string {
  return [
    `Escreva um artigo de blog completo sobre: "${topic.title}".`,
    `Categoria: ${topic.category}.`,
    topic.angle ? `Ângulo: ${topic.angle}` : '',
    '',
    'REGRAS:',
    '- Entre 1.100 e 1.400 palavras em Markdown. Não inclua o título como H1.',
    '- O PRIMEIRO parágrafo é a resposta direta ao tema, em 30 a 60 palavras, sem rodeios.',
    '- Use seções H2 (##) e, quando útil, H3. Inclua ao menos uma lista com passos ou critérios concretos.',
    '- Mencione o Rio de Janeiro de forma natural, sem forçar.',
    '- Baseie as afirmações técnicas nas FONTES abaixo. Reescreva com suas palavras; não copie trechos.',
    '- Não invente números, versões de produto, preços, telefones ou e-mails.',
    '- Não inclua seção de "Fontes" no texto (o site a exibe a partir do campo sources).',
    `- Termine com "## Próximos passos", convidando a pedir um diagnóstico gratuito da ${site.name}, sem prometer resultados.`,
    '- "sources": use SOMENTE URLs listadas nas FONTES, ao menos 2, as que realmente usou.',
    '- "faq": 3 perguntas curtas com respostas diretas.',
    '- "meta_description": entre 100 e 155 caracteres.',
    '',
    'Responda com {"title":"","meta_description":"","slug":"","content_md":"","faq":[{"question":"","answer":""}],"sources":[{"title":"","url":""}],"keywords":[""]}',
    previousReasons.length > 0
      ? `\nA versão anterior foi REPROVADA pelos motivos abaixo. Corrija todos:\n${previousReasons.map((r) => `- ${r}`).join('\n')}`
      : '',
    '',
    'FONTES:',
    sourcesBlock(sources),
  ]
    .filter((l) => l !== '')
    .join('\n')
}

async function writeArticle(topic: Topic, sources: ResearchSource[], previousReasons: string[]): Promise<{ ok: true; article: DraftArticle } | { ok: false; error: string }> {
  const raw = await chat({ system: SYSTEM_PROMPT, user: writePrompt(topic, sources, previousReasons), json: true, maxTokens: 4200, temperature: 0.6, timeoutMs: 110_000 })
  return parseArticleJson(raw)
}

/** 2ª passada da IA: lista afirmações técnicas específicas sem apoio nas fontes. */
async function findUnsupportedClaims(article: DraftArticle, sources: ResearchSource[]): Promise<string[]> {
  const raw = await chat({
    system: 'Você é um revisor técnico rigoroso. Responde somente com JSON.',
    user: [
      'Leia o ARTIGO e as FONTES. Liste as afirmações técnicas ESPECÍFICAS do artigo (números, versões, nomes de produto, prazos, preços, requisitos) que NÃO são sustentadas pelas fontes e não são conhecimento técnico consolidado.',
      'Ignore opiniões, recomendações genéricas e boas práticas amplamente aceitas.',
      'Responda com {"unsupported_claims":["..."]}. Lista vazia se não houver.',
      '',
      'ARTIGO:',
      article.content_md,
      '',
      'FONTES:',
      sourcesBlock(sources),
    ].join('\n'),
    json: true,
    maxTokens: 1200,
    temperature: 0,
    timeoutMs: 70_000,
  })
  const parsed = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)) as { unsupported_claims?: unknown }
  return Array.isArray(parsed.unsupported_claims) ? parsed.unsupported_claims.filter((c): c is string => typeof c === 'string') : []
}

export async function runGeneration(opts: RunOptions): Promise<RunReport> {
  const started = Date.now()
  const dry = Boolean(opts.dry)
  const log: string[] = []
  const note = (m: string) => log.push(`[${Math.round((Date.now() - started) / 1000)}s] ${m}`)
  const report: RunReport = { outcome: 'error', reasons: [], log, dry }

  const runId = dry ? null : await repo.startRun(opts.trigger)
  const finish = async (patch: { outcome: RunOutcome; reasons: string[] }) => {
    report.outcome = patch.outcome
    report.reasons = patch.reasons
    if (runId) {
      await repo.finishRun(runId, {
        ...patch,
        topic_id: report.topic?.id ?? null,
        topic_title: report.topic?.title ?? null,
        post_id: report.postId ?? null,
        log: log.join('\n'),
      })
    }
    return report
  }

  try {
    if (opts.trigger === 'cron' && !opts.ignorePause && (await repo.getPaused())) {
      note('Geração pausada nas configurações.')
      return await finish({ outcome: 'skipped', reasons: ['Geração pausada no painel.'] })
    }

    const existing = await repo.listAllPostsBrief()

    // Reposição da fila de temas.
    if (!opts.topicId && (await repo.countPendingTopics()) < REPLENISH_BELOW) {
      try {
        const titles = (await repo.listTopics()).map((t) => t.title).concat(existing.map((p) => p.title))
        const found = await discoverTopics(titles)
        const added = dry ? found.length : await repo.insertTopics(found, 'research')
        note(`Reposição de temas: ${added} novo(s).`)
      } catch (error) {
        note(`Reposição de temas falhou: ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    const topic = opts.topicId ? await repo.getTopic(opts.topicId) : await repo.pickNextTopic()
    if (!topic) return await finish({ outcome: 'skipped', reasons: ['Não há temas pendentes.'] })
    report.topic = { id: topic.id, title: topic.title }
    note(`Tema: ${topic.title}`)

    // Pesquisa
    const research = await researchTopic(topic)
    note(`Pesquisa: ${research.sources.length} fonte(s) lida(s).`)
    if (research.sources.length < 2) {
      return await finish({ outcome: 'error', reasons: ['A pesquisa não encontrou fontes suficientes (mínimo 2).'] })
    }

    const ctx: GateContext = {
      researchedUrls: research.sources.map((s) => s.url),
      existingTitles: existing.map((p) => p.title),
      existingSlugs: existing.map((p) => p.slug),
      sourceTexts: research.sources.map((s) => s.text),
      allowedPhones: [site.phoneE164, site.phone],
      allowedEmails: [site.email],
    }

    // Redação + travas (até 2 tentativas)
    let reasons: string[] = []
    let article: DraftArticle | null = null
    let gates: GateResult = { ok: false, reasons: [] }

    for (let attempt = 1; attempt <= 2; attempt++) {
      if (attempt === 2 && Date.now() - started > RETRY_DEADLINE_MS) {
        note('Sem tempo para uma 2ª tentativa.')
        break
      }
      note(`Redação (tentativa ${attempt}).`)
      const written = await writeArticle(topic, research.sources, reasons)
      if (!written.ok) {
        reasons = [written.error]
        note(`Resposta inválida: ${written.error}`)
        continue
      }
      article = written.article
      article.slug = uniqueSlug(article.slug, ctx.existingSlugs)

      gates = runGates(article, ctx)
      reasons = gates.reasons
      if (gates.ok) {
        try {
          const claims = await findUnsupportedClaims(article, research.sources)
          report.unsupportedClaims = claims
          note(`Verificação factual: ${claims.length} afirmação(ões) sem apoio.`)
          if (claims.length > MAX_UNSUPPORTED_CLAIMS) {
            gates = { ok: false, reasons: [`Afirmações sem apoio nas fontes: ${claims.join(' | ')}`] }
            reasons = gates.reasons
          }
        } catch (error) {
          gates = { ok: false, reasons: [`Verificação factual indisponível: ${error instanceof Error ? error.message : String(error)}`] }
          reasons = gates.reasons
        }
      }
      if (gates.ok) break
      note(`Reprovado: ${reasons.join(' / ')}`)
    }

    report.article = article ?? undefined
    report.gates = gates
    if (!article) return await finish({ outcome: 'error', reasons: reasons.length ? reasons : ['A IA não devolveu um artigo válido.'] })

    report.slug = article.slug
    const approved = gates.ok

    if (dry) return await finish({ outcome: approved ? 'published' : 'draft_rejected', reasons: approved ? [] : reasons })

    const payload: PostInsert = {
      slug: article.slug,
      title: article.title,
      meta_description: article.meta_description,
      content_md: article.content_md,
      category: topic.category,
      status: approved ? 'published' : 'draft',
      sources: article.sources,
      faq: article.faq,
      keywords: article.keywords,
      reading_minutes: Math.max(1, Math.ceil(countWords(article.content_md) / 200)),
      topic_id: topic.id,
    }
    const post = await repo.insertPost(payload)
    report.postId = post.id
    await repo.updateTopic(topic.id, { status: 'used', post_id: post.id })
    note(approved ? 'Publicado.' : 'Salvo como rascunho.')

    return await finish({ outcome: approved ? 'published' : 'draft_rejected', reasons: approved ? [] : reasons })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    note(`Erro: ${message}`)
    return await finish({ outcome: 'error', reasons: [message] })
  }
}
