import { Badge, DbError, td, th } from '@/components/admin/Ui'
import * as repo from '@/lib/blog/repo'
import { OUTCOME_LABEL, formatDateTime, load } from '@/lib/blog/safe'

export default async function RunsPage() {
  const { data, error } = await load(() => repo.listRuns(50))
  const runs = data ?? []

  return (
    <div>
      <h1 className="font-display text-4xl font-extrabold text-white">Execuções</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Histórico de cada geração de artigo, com o motivo quando o texto não foi publicado.
      </p>
      {error && <div className="mt-6"><DbError message={error} /></div>}

      <div className="plate mt-8 overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-line/20">
            <tr>
              <th className={th}>Quando</th>
              <th className={th}>Origem</th>
              <th className={th}>Tema</th>
              <th className={th}>Resultado</th>
              <th className={th}>Detalhes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/20">
            {runs.map((r) => (
              <tr key={r.id}>
                <td className={`${td} whitespace-nowrap text-muted-foreground`}>{formatDateTime(r.started_at)}</td>
                <td className={`${td} text-muted-foreground`}>{r.trigger === 'cron' ? 'Automática' : 'Manual'}</td>
                <td className={`${td} max-w-xs text-white`}>{r.topic_title ?? '—'}</td>
                <td className={td}><Badge kind={r.outcome}>{OUTCOME_LABEL[r.outcome]}</Badge></td>
                <td className={td}>
                  {r.reasons.length > 0 && (
                    <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
                      {r.reasons.map((reason, i) => <li key={i}>{reason}</li>)}
                    </ul>
                  )}
                  {r.log && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-xs text-muted-foreground hover:text-white">Registro</summary>
                      <pre className="mt-2 max-w-xl whitespace-pre-wrap break-words text-xs text-muted-foreground">{r.log}</pre>
                    </details>
                  )}
                </td>
              </tr>
            ))}
            {runs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-sm text-muted-foreground">Nenhuma execução registrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
