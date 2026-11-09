/**
 * Autenticação do painel: senha única (variável de ambiente) + cookie assinado.
 * Usa Web Crypto, então roda tanto no middleware (Edge) quanto no Node.
 */

export const SESSION_COOKIE = 'engti_admin'
export const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60

const enc = new TextEncoder()

const toHex = (buf: ArrayBuffer) =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

async function hmacHex(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return toHex(await crypto.subtle.sign('HMAC', key, enc.encode(data)))
}

/** Comparação em tempo constante de duas strings de mesmo comprimento esperado. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/** Cria o token `exp.assinatura` (exp em segundos). `now` em ms, injetável para testes. */
export async function signSession(secret: string, ttlSeconds: number, now: number = Date.now()): Promise<string> {
  const exp = Math.floor(now / 1000) + ttlSeconds
  return `${exp}.${await hmacHex(secret, String(exp))}`
}

export async function verifySession(token: string | undefined, secret: string, now: number = Date.now()): Promise<boolean> {
  if (!token || !secret) return false
  const [expRaw, sig] = token.split('.')
  const exp = Number(expRaw)
  if (!sig || !Number.isInteger(exp) || exp <= Math.floor(now / 1000)) return false
  return constantTimeEqual(sig, await hmacHex(secret, expRaw))
}

/** Compara a senha informada com a esperada via hash (tempo constante). */
export async function passwordMatches(input: string, expected: string): Promise<boolean> {
  if (!input || !expected) return false
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(input)),
    crypto.subtle.digest('SHA-256', enc.encode(expected)),
  ])
  return constantTimeEqual(toHex(a), toHex(b))
}

export interface AdminConfig {
  password: string
  secret: string
}

/** Lê e valida as variáveis de ambiente do painel; null se faltarem ou forem fracas. */
export function getAdminConfig(): AdminConfig | null {
  const password = process.env.ADMIN_PASSWORD ?? ''
  const secret = process.env.ADMIN_SESSION_SECRET ?? ''
  if (password.length < 16 || secret.length < 32) return null
  return { password, secret }
}
