import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/admin-auth'

/**
 * Protege /admin/**: sem cookie de sessão válido, redireciona para o login.
 * Toda resposta do painel leva X-Robots-Tag: noindex. As Server Actions
 * reconferem a sessão por conta própria (defesa em profundidade).
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLogin = pathname === '/admin/login'

  const secret = process.env.ADMIN_SESSION_SECRET ?? ''
  const valid = await verifySession(request.cookies.get(SESSION_COOKIE)?.value, secret)

  let response: NextResponse
  if (!valid && !isLogin) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.search = ''
    response = NextResponse.redirect(url)
  } else if (valid && isLogin) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    url.search = ''
    response = NextResponse.redirect(url)
  } else {
    response = NextResponse.next()
  }

  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export const config = { matcher: ['/admin/:path*'] }
