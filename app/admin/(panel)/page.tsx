import { generateNowAction, togglePausedAction } from '../actions'
import { SubmitButton } from '@/components/admin/SubmitButton'
import { Badge, DbError, Notice } from '@/components/admin/Ui'
import * as repo from '@/lib/blog/repo'
import { OUTCOME_LABEL, formatDateTime, load, nextCronRun } from '@/lib/blog/safe'

// "Gerar agora" executa o pipeline completo (pesquisa + redação + verificação).
export const maxDuration = 300

const RUN_NOTICE: Record<string, { text: string; tone: 'ok' | 'warn' }> = {
  published: { text: 'Artigo gerado e publicado.', tone: 'ok' },
  draft_rejected: { text: 'O artigo não passou nas travas e foi salvo como rascunho. Veja os motivos em Execuções.', tone: 'warn' },
  error: { text: 'A geração falhou. Veja o motivo em Execuções.', tone: 'warn' },
  skipped: { text: 'Nada foi gerado. Veja o motivo em Execuções.', tone: 'warn' },
}

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ run?: string }> }) {
  const { run } = await searchParams
  const [runs, posts, topics, paused] = await Promise.all([
    load(() => repo.listRuns(6)),
    load(() => repo.listPosts()),
    load(() => repo.listTopics()),
    load(() => repo.getPaused()),
  ])
  const error = runs.error ?? posts.error ?? topics.error ?? paused.error

  const count = (status: string) => posts.data?.filter((p) => p.status === status).length ?? 0
  const pending = topics.data?.filter((t) => t.status === 'pending').length ?? 0
  const last = runs.data?.[0]
  const notice = run ? RUN_NOTICE[run] : null

  return (
    <div>
      <h1 className="font-display text-4xl font-extrabold text-white">Início</h1>

      {notice && <div className="mt-6"><Notice tone={notice.tone}>{notice.text}</Notice></div>}
      {error && <div className="mt-6"><DbError message={error} /></div>}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Publicados', count('published')],
          ['Rascunhos', count('draft')],
          ['Temas na fila', pending],
          ['Próxima geração', formatDateTime(nextCronRun())],
        ].map(([label, value]) => (
          <div key={String(label)} className="plate p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-white">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="plate p-6">
          <h2 className="font-display text-2xl font-bold text-white">Geração do artigo semanal</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            O sistema gera um artigo por semana, automaticamente. Use o botão para gerar um agora; o processo pesquisa,
            escreve e verifica o texto e pode levar alguns minutos.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <form action={generateNowAction}>
              <SubmitButton pending="Gerando... não feche esta página">Gerar artigo agora</SubmitButton>
            </form>
            <form action={togglePausedAction} className="flex items-center gap-3">
              <SubmitButton variant="outline">{paused.data ? 'Retomar geração semanal' : 'Pausar geração semanal'}</SubmitButton>
              {paused.data && <Badge kind="skipped">Pausada</Badge>}
            </form>
          </div>
        </div>

        <div className="plate p-6">
          <h2 className="font-display text-2xl font-bold text-white">Última execução</h2>
          {last ? (
            <div className="mt-3 text-sm">
              <p className="flex flex-wrap items-center gap-2">
                <Badge kind={last.outcome}>{OUTCOME_LABEL[last.outcome]}</Badge>
                <span className="text-muted-foreground">{formatDateTime(last.started_at)}</span>
              </p>
              <p className="mt-2 text-foreground">{last.topic_title ?? 'Sem tema'}</p>
              {last.reasons.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                  {last.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Nenhuma execução ainda.</p>
          )}
        </div>
      </section>
    </div>
  )
}
