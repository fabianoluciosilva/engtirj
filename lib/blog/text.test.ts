import { describe, expect, it } from 'vitest'
import { parseArticleJson, slugify, uniqueSlug } from './text'

describe('slugify', () => {
  it('remove acentos, pontuação e limita tamanho', () => {
    expect(slugify('Como proteger arquivos de obra: ransomware & backup!')).toBe('como-proteger-arquivos-de-obra-ransomware-backup')
    expect(slugify('Ação, informação e Revit')).toBe('acao-informacao-e-revit')
    expect(slugify('a'.repeat(200)).length).toBeLessThanOrEqual(80)
  })
})

describe('uniqueSlug', () => {
  it('acrescenta sufixo numérico quando já existe', () => {
    expect(uniqueSlug('backup', ['backup', 'backup-2'])).toBe('backup-3')
    expect(uniqueSlug('novo', ['backup'])).toBe('novo')
  })
})

describe('parseArticleJson', () => {
  const valid = {
    title: 'Título do artigo sobre backup em escritório',
    meta_description: 'Descrição suficientemente longa para a meta description do artigo sobre backup.',
    slug: 'titulo',
    content_md: 'Conteúdo',
    faq: [{ question: 'Q?', answer: 'A.' }],
    sources: [{ title: 'S', url: 'https://x.com' }],
    keywords: ['backup'],
  }

  it('lê JSON puro e com cerca de código', () => {
    expect(parseArticleJson(JSON.stringify(valid)).ok).toBe(true)
    expect(parseArticleJson('```json\n' + JSON.stringify(valid) + '\n```').ok).toBe(true)
    expect(parseArticleJson('Aqui está: ' + JSON.stringify(valid) + ' fim').ok).toBe(true)
  })

  it('reprova JSON truncado', () => {
    const r = parseArticleJson(JSON.stringify(valid).slice(0, 80))
    expect(r.ok).toBe(false)
  })

  it('reprova campos ausentes e informa quais', () => {
    const { title: _t, ...rest } = valid
    const r = parseArticleJson(JSON.stringify(rest))
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatch(/title/)
  })

  it('normaliza faq/sources/keywords ausentes para listas vazias', () => {
    const { faq: _f, sources: _s, keywords: _k, ...rest } = valid
    const r = parseArticleJson(JSON.stringify(rest))
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.article.faq).toEqual([])
      expect(r.article.sources).toEqual([])
    }
  })
})
