import { describe, expect, it } from 'vitest'
import { load, nextCronRun } from './safe'

describe('nextCronRun', () => {
  it('numa quarta, devolve a próxima segunda 06:00 UTC', () => {
    // 2026-11-11 é quarta-feira
    expect(nextCronRun(new Date('2026-11-11T12:00:00Z')).toISOString()).toBe('2026-11-16T06:00:00.000Z')
  })
  it('na segunda antes das 06:00 UTC, é no mesmo dia', () => {
    expect(nextCronRun(new Date('2026-11-09T05:00:00Z')).toISOString()).toBe('2026-11-09T06:00:00.000Z')
  })
  it('na segunda depois das 06:00 UTC, é na semana seguinte', () => {
    expect(nextCronRun(new Date('2026-11-09T07:00:00Z')).toISOString()).toBe('2026-11-16T06:00:00.000Z')
  })
})

describe('load', () => {
  it('devolve o dado ou a mensagem de erro', async () => {
    expect(await load(async () => 1)).toEqual({ data: 1, error: null })
    expect(await load(async () => { throw new Error('falhou') })).toEqual({ data: null, error: 'falhou' })
  })
})
