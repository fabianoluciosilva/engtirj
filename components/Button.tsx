import Link from 'next/link'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'accent' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-soft',
  accent: 'bg-accent text-accent-foreground hover:bg-accent-soft',
  outline: 'border border-border bg-background text-foreground hover:bg-muted',
  ghost: 'text-foreground hover:bg-muted',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: Variant
  size?: Size
}

export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
}

export interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant
  size?: Size
}

/** Versão Link do botão — para navegação interna. */
export function ButtonLink({ variant = 'primary', size = 'md', className, ...props }: ButtonLinkProps) {
  return <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />
}

export interface ButtonAnchorProps extends ComponentProps<'a'> {
  variant?: Variant
  size?: Size
}

/** Versão <a> do botão — para links externos (WhatsApp, tel, mailto). */
export function ButtonAnchor({ variant = 'accent', size = 'md', className, ...props }: ButtonAnchorProps) {
  return <a className={cn(base, variants[variant], sizes[size], className)} {...props} />
}
