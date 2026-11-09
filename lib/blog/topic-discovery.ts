import { CATEGORIES } from './curated-topics'
import { chat } from './llm'
import { searchWeb } from './research'
import { titleSimilarity } from './quality-gates'

/**
 * Reposição da fila de temas: pesquisa problemas e novidades atuais na web e
 * pede à IA 10 temas novos (fora dos já existentes), no formato da tabela `topics`.
 */
export interface DiscoveredTopic {
  title: string
  category: string
  angle: string
  keywords: string[]
}

const DISCOVERY_QUERIES = [
  'problemas de TI em escritórios de engenharia e arquitetura Revit AutoCAD',
  'ransomware e segurança de dados em construtoras e escritórios de projeto Brasil',
  'novidades Autodesk Revit AutoCAD requisitos de hardware e licenciamento',
  'internet e rede em canteiro de obras soluções',
]

export async function discoverTopics(existingTitles: string[]): Promise<DiscoveredTopic[]> {
  const snippets: string[] = []
  for (const q of DISCOVERY_QUERIES) {
    try {
      for (const r of await searchWeb(q, { limit: 5 })) snippets.push(`- ${r.title}: ${r.description}`.slice(0, 300))
    } catch {
      // Uma consulta falhando não impede as demais.
    }
  }
  if (snippets.length === 0) throw new Error('A pesquisa de tendências não retornou resultados.')

  const raw = await chat({
    system:
      'Você é editor de um blog de TI para empresas de engenharia, arquitetura e construção civil no Rio de Janeiro. Responda somente com JSON.',
    user: [
      'Com base nos resultados de pesquisa abaixo, proponha 10 temas NOVOS de artigos que resolvam problemas reais desses escritórios.',
      `Categorias permitidas: ${CATEGORIES.join('; ')}.`,
      'Cada título deve ser específico, em português, no formato de problema ou pergunta que alguém buscaria.',
      'Não repita nem reformule os temas já existentes listados.',
      'Responda com {"topics":[{"title":"","category":"","angle":"","keywords":["",""]}]}.',
      '',
      'TEMAS JÁ EXISTENTES:',
      ...existingTitles.slice(0, 120).map((t) => `- ${t}`),
      '',
      'RESULTADOS DA PESQUISA:',
      ...snippets.slice(0, 20),
    ].join('\n'),
    json: true,
    maxTokens: 2500,
    temperature: 0.8,
    timeoutMs: 80_000,
  })

  let parsed: { topics?: Array<Record<string, unknown>> }
  try {
    parsed = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1))
  } catch {
    throw new Error('A IA devolveu um JSON inválido para os novos temas.')
  }

  const valid = new Set<string>(CATEGORIES)
  const accepted: DiscoveredTopic[] = []
  for (const t of parsed.topics ?? []) {
    const title = typeof t.title === 'string' ? t.title.trim() : ''
    const category = typeof t.category === 'string' ? t.category : ''
    if (title.length < 20 || !valid.has(category)) continue
    const all = [...existingTitles, ...accepted.map((a) => a.title)]
    if (all.some((e) => titleSimilarity(title, e) >= 0.6)) continue
    accepted.push({
      title,
      category,
      angle: typeof t.angle === 'string' ? t.angle.trim() : '',
      keywords: Array.isArray(t.keywords) ? t.keywords.filter((k): k is string => typeof k === 'string').slice(0, 5) : [],
    })
  }
  return accepted
}
