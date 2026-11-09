import { describe, expect, it } from 'vitest'
import {
  countWords,
  hasLongCopy,
  normalizeUrl,
  runGates,
  titleSimilarity,
  type DraftArticle,
  type GateContext,
} from './quality-gates'

const words = (n: number, w = 'palavra') => Array.from({ length: n }, (_, i) => `${w}${i % 40}`).join(' ')

function goodArticle(over: Partial<DraftArticle> = {}): DraftArticle {
  const direct =
    'Para o Revit abrir mais rápido em rede, mova os modelos para um storage com SSD e separe o tráfego de arquivos de projeto do restante da rede do escritório, medindo antes onde está o gargalo.'
  return {
    title: 'Como acelerar a abertura de modelos Revit na rede do escritório',
    meta_description:
      'Entenda por que os modelos de Revit demoram a abrir na rede e como um storage com SSD resolve em escritórios do Rio de Janeiro.',
    slug: 'acelerar-abertura-modelos-revit-rede',
    content_md: `${direct}\n\n## Onde está o gargalo\n\n${words(500)} Rio de Janeiro.\n\n## O que fazer\n\n${words(500, 'texto')}\n`,
    faq: [],
    sources: [
      { title: 'A', url: 'https://example.com/a' },
      { title: 'B', url: 'https://example.com/b/' },
    ],
    keywords: ['revit'],
    ...over,
  }
}

const ctx = (over: Partial<GateContext> = {}): GateContext => ({
  researchedUrls: ['https://example.com/a', 'https://example.com/b'],
  existingTitles: ['Backup 3-2-1 para escritórios de arquitetura'],
  existingSlugs: ['backup-3-2-1-arquitetura'],
  sourceTexts: ['texto completamente diferente sobre outro assunto sem relação'],
  allowedPhones: ['+552140421350'],
  allowedEmails: ['contato@engtirj.com.br'],
  ...over,
})

describe('helpers', () => {
  it('countWords ignora marcação markdown', () => {
    expect(countWords('## Título\n\nUm **dois** [três](http://x.com) quatro')).toBe(5)
  })
  it('normalizeUrl remove barra final, hash e caixa do host', () => {
    expect(normalizeUrl('HTTPS://Example.com/a/#x')).toBe('https://example.com/a')
  })
  it('titleSimilarity: iguais = 1, distintos < 0.3', () => {
    expect(titleSimilarity('Backup contra ransomware', 'backup contra ransomware')).toBe(1)
    expect(titleSimilarity('Backup contra ransomware', 'Rede para canteiro de obras')).toBeLessThan(0.3)
  })
  it('hasLongCopy detecta 12 palavras seguidas copiadas', () => {
    const src = 'a b c d e f g h i j k l m n o p'
    expect(hasLongCopy('x y a b c d e f g h i j k l z', [src], 12)).toBe(true)
    expect(hasLongCopy('x y a b c d e f g h i j z', [src], 12)).toBe(false)
  })
})

describe('runGates', () => {
  it('aprova um artigo válido', () => {
    const r = runGates(goodArticle(), ctx())
    expect(r.reasons).toEqual([])
    expect(r.ok).toBe(true)
  })

  it('reprova artigo curto', () => {
    const a = goodArticle({ content_md: 'Resposta direta curta sobre o assunto em Rio de Janeiro.\n\n' + words(100) })
    expect(runGates(a, ctx()).reasons.join('|')).toMatch(/palavras/)
  })

  it('reprova placeholder', () => {
    const a = goodArticle()
    a.content_md += '\n\nConteúdo em atualização'
    expect(runGates(a, ctx()).reasons.join('|')).toMatch(/placeholder/)
  })

  it('reprova telefone e e-mail inventados', () => {
    const a = goodArticle()
    a.content_md += '\n\nLigue (21) 99999-1234 ou escreva para fulano@empresa.com'
    const reasons = runGates(a, ctx()).reasons.join('|')
    expect(reasons).toMatch(/telefone/i)
    expect(reasons).toMatch(/e-mail/i)
  })

  it('aceita o telefone e e-mail oficiais', () => {
    const a = goodArticle()
    a.content_md += '\n\nFale pelo +55 21 4042-1350 ou contato@engtirj.com.br'
    expect(runGates(a, ctx()).ok).toBe(true)
  })

  it('exige ao menos 2 fontes e que existam na pesquisa', () => {
    expect(runGates(goodArticle({ sources: [{ title: 'A', url: 'https://example.com/a' }] }), ctx()).reasons.join('|')).toMatch(/fontes/)
    const bad = goodArticle({
      sources: [
        { title: 'A', url: 'https://example.com/a' },
        { title: 'X', url: 'https://inventada.com/x' },
      ],
    })
    expect(runGates(bad, ctx()).reasons.join('|')).toMatch(/não pesquisada/)
  })

  it('reprova título parecido e slug repetido', () => {
    const a = goodArticle({ title: 'Backup 3-2-1 para escritórios de arquitetura', slug: 'backup-3-2-1-arquitetura' })
    const reasons = runGates(a, ctx()).reasons.join('|')
    expect(reasons).toMatch(/título/)
    expect(reasons).toMatch(/slug/)
  })

  it('exige menção ao Rio de Janeiro', () => {
    const a = goodArticle()
    a.content_md = a.content_md.replace('Rio de Janeiro', 'cidade')
    a.meta_description = a.meta_description.replace('Rio de Janeiro', 'cidade')
    expect(runGates(a, ctx()).reasons.join('|')).toMatch(/Rio de Janeiro/)
  })

  it('reprova cópia literal de fonte', () => {
    const body = goodArticle().content_md
    const copied = body.split(/\s+/).slice(30, 60).join(' ')
    expect(runGates(goodArticle(), ctx({ sourceTexts: [copied] })).reasons.join('|')).toMatch(/cópia/)
  })

  it('reprova meta description fora do tamanho', () => {
    expect(runGates(goodArticle({ meta_description: 'curta' }), ctx()).reasons.join('|')).toMatch(/descrição/)
  })
})
