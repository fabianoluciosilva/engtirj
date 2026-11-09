'use client'

import { useFormStatus } from 'react-dom'
import { cn } from '@/lib/cn'

/** Botão de envio que mostra estado de carregamento enquanto a ação roda. */
export function SubmitButton({
  children,
  pending: pendingLabel,
  variant = 'accent',
  className,
  confirm,
}: {
  children: React.ReactNode
  pending?: string
  variant?: 'accent' | 'outline' | 'danger'
  className?: string
  /** Se informado, pede confirmação antes de enviar. */
  confirm?: string
}) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault()
      }}
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded px-3.5 py-2 text-sm font-semibold transition-colors disabled:cursor-wait disabled:opacity-60',
        variant === 'accent' && 'bg-accent text-accent-foreground hover:bg-accent-soft',
        variant === 'outline' && 'border border-line/40 text-foreground hover:border-accent',
        variant === 'danger' && 'border border-red-400/50 text-red-300 hover:bg-red-400/10',
        className,
      )}
    >
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  )
}
