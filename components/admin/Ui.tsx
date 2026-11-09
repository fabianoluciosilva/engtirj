import { cn } from '@/lib/cn'

export function DbError({ message }: { message: string }) {
  return (
    <div role="alert" className="mb-6 rounded border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-200">
      <p className="font-semibold">Não foi possível ler os dados.</p>
      <p className="mt-1 break-words">{message}</p>
      <p className="mt-2 text-red-200/80">
        Confira as variáveis do Supabase e se a migração supabase/migrations/20261109000000_blog_v2.sql foi aplicada.
      </p>
    </div>
  )
}

export function Notice({ children, tone = 'ok' }: { children: React.ReactNode; tone?: 'ok' | 'warn' }) {
  return (
    <p
      role="status"
      className={cn(
        'mb-6 rounded border px-4 py-3 text-sm',
        tone === 'ok' ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200' : 'border-amber-400/40 bg-amber-400/10 text-amber-200',
      )}
    >
      {children}
    </p>
  )
}

const BADGE: Record<string, string> = {
  published: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
  draft: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
  draft_rejected: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
  archived: 'border-line/30 bg-line/10 text-muted-foreground',
  skipped: 'border-line/30 bg-line/10 text-muted-foreground',
  error: 'border-red-400/40 bg-red-400/10 text-red-200',
  pending: 'border-sky-400/40 bg-sky-400/10 text-sky-200',
  used: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
}

export function Badge({ kind, children }: { kind: string; children: React.ReactNode }) {
  return (
    <span className={cn('inline-block whitespace-nowrap rounded border px-2 py-0.5 text-xs font-medium', BADGE[kind] ?? BADGE.archived)}>
      {children}
    </span>
  )
}

export const th = 'px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground'
export const td = 'px-3 py-3 align-top text-sm'
