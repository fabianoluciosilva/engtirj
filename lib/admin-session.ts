import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, SESSION_TTL_SECONDS, getAdminConfig, signSession, verifySession } from './admin-auth'

/** Confere a sessão do painel; sem sessão válida, redireciona para o login. */
export async function requireAdmin(): Promise<void> {
  const config = getAdminConfig()
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!config || !(await verifySession(token, config.secret))) redirect('/admin/login')
}

export async function startSession(secret: string): Promise<void> {
  const token = await signSession(secret, SESSION_TTL_SECONDS)
  ;(await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: SESSION_TTL_SECONDS,
  })
}

export async function endSession(): Promise<void> {
  ;(await cookies()).delete({ name: SESSION_COOKIE, path: '/admin' })
}

// ── limite de tentativas de login (melhor esforço, em memória) ──────────────
// Em ambiente serverless cada instância tem seu próprio mapa; serve para frear
// força bruta simples. A senha forte (≥ 16 caracteres) é a defesa principal.
const attempts = new Map<string, { fails: number; blockedUntil: number }>()

export async function clientKey(): Promise<string> {
  const h = await headers()
  return (h.get('x-forwarded-for') ?? h.get('x-real-ip') ?? 'local').split(',')[0].trim()
}

/** Segundos que ainda faltam para liberar novas tentativas (0 = liberado). */
export function loginWaitSeconds(key: string, now: number = Date.now()): number {
  const a = attempts.get(key)
  return a && a.blockedUntil > now ? Math.ceil((a.blockedUntil - now) / 1000) : 0
}

export function registerLoginFailure(key: string, now: number = Date.now()): void {
  const a = attempts.get(key) ?? { fails: 0, blockedUntil: 0 }
  a.fails += 1
  // 3 erros livres; depois 2s, 4s, 8s... até 5 minutos.
  if (a.fails > 3) a.blockedUntil = now + Math.min(2 ** (a.fails - 3) * 1000, 300_000)
  attempts.set(key, a)
}

export function registerLoginSuccess(key: string): void {
  attempts.delete(key)
}
