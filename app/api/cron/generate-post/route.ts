import { NextResponse } from 'next/server'
import { runGeneration } from '@/lib/blog/pipeline'
import { revalidateBlog } from '@/lib/blog/revalidate'

// Executada pelo Vercel Cron (semanal). Protegida por CRON_SECRET.
// ?dry=1 roda tudo sem gravar; ?topic=<id> força um tema.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const header = request.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : header
  return token === secret
}

async function handle(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const dry = url.searchParams.get('dry') === '1'
  const topicId = url.searchParams.get('topic') ?? undefined

  const report = await runGeneration({ trigger: 'cron', dry, topicId })
  if (!dry && report.outcome === 'published') revalidateBlog(report.slug)

  // Em modo dry devolve o artigo completo para inspeção; fora dele, só o resumo.
  return NextResponse.json(
    {
      ok: report.outcome === 'published' || report.outcome === 'skipped',
      outcome: report.outcome,
      reasons: report.reasons,
      topic: report.topic,
      slug: report.slug,
      postId: report.postId,
      unsupportedClaims: report.unsupportedClaims,
      log: report.log,
      ...(dry ? { article: report.article, gates: report.gates } : {}),
    },
    { status: report.outcome === 'error' ? 500 : 200 },
  )
}

export async function GET(request: Request) {
  return handle(request)
}

export async function POST(request: Request) {
  return handle(request)
}
