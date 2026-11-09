/** Executa uma consulta e devolve o erro como texto, para o painel mostrar em vez de quebrar. */
export async function load<T>(fn: () => Promise<T>): Promise<{ data: T | null; error: string | null }> {
  try {
    return { data: await fn(), error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : String(error) }
  }
}

/** Próxima execução do cron semanal (segunda-feira 06:00 UTC, igual ao vercel.json). */
export function nextCronRun(from: Date = new Date()): Date {
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate(), 6, 0, 0))
  const daysUntilMonday = (1 - d.getUTCDay() + 7) % 7
  d.setUTCDate(d.getUTCDate() + daysUntilMonday)
  if (d <= from) d.setUTCDate(d.getUTCDate() + 7)
  return d
}

export const OUTCOME_LABEL: Record<string, string> = {
  published: 'Publicado',
  draft_rejected: 'Rascunho (reprovado)',
  error: 'Erro',
  skipped: 'Ignorado',
}

export function formatDateTime(value: string | Date | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  })
}
