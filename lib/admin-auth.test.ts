import { describe, expect, it } from 'vitest'
import { passwordMatches, signSession, verifySession } from './admin-auth'

const SECRET = 'segredo-de-teste-com-mais-de-32-caracteres-ok'

describe('sessão do admin', () => {
  it('aceita um token válido', async () => {
    const token = await signSession(SECRET, 3600, 1_000_000)
    expect(await verifySession(token, SECRET, 1_000_500)).toBe(true)
  })

  it('recusa token expirado', async () => {
    const token = await signSession(SECRET, 60, 1_000_000)
    expect(await verifySession(token, SECRET, 1_000_000 + 61_000)).toBe(false)
  })

  it('recusa token adulterado (expiração alterada)', async () => {
    const token = await signSession(SECRET, 60, 1_000_000)
    const [, sig] = token.split('.')
    const forged = `${9_999_999_999}.${sig}`
    expect(await verifySession(forged, SECRET, 1_000_001)).toBe(false)
  })

  it('recusa assinatura de outro segredo, lixo e vazio', async () => {
    const token = await signSession('outro-segredo-qualquer-com-32-caracteres-xx', 60, 1_000_000)
    expect(await verifySession(token, SECRET, 1_000_001)).toBe(false)
    expect(await verifySession('lixo', SECRET)).toBe(false)
    expect(await verifySession('', SECRET)).toBe(false)
    expect(await verifySession(undefined, SECRET)).toBe(false)
  })
})

describe('passwordMatches', () => {
  it('compara senha em tempo constante', async () => {
    expect(await passwordMatches('senha-correta-123', 'senha-correta-123')).toBe(true)
    expect(await passwordMatches('senha-errada', 'senha-correta-123')).toBe(false)
    expect(await passwordMatches('', 'senha-correta-123')).toBe(false)
  })
})
