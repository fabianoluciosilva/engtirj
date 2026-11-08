import { MessageCircle, ArrowRight } from 'lucide-react'
import { ButtonAnchor, ButtonLink } from './Button'
import { whatsappUrl } from '@/lib/site'
import { cn } from '@/lib/cn'

/**
 * Par de CTAs (WhatsApp + âncora de seção), reutilizado no hero e nas faixas.
 * `message` permite personalizar a mensagem por seção mantendo a tag [engti].
 */
export function CtaWhatsApp({
  label = 'Solicitar diagnóstico de TI gratuito',
  message,
  secondaryHref = '#servicos',
  secondaryLabel = 'Ver serviços especializados',
  className,
  align = 'start',
}: {
  label?: string
  message?: string
  secondaryHref?: string
  secondaryLabel?: string
  className?: string
  align?: 'start' | 'center'
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row',
        align === 'center' ? 'sm:justify-center' : 'sm:justify-start',
        className,
      )}
    >
      <ButtonAnchor
        href={whatsappUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        variant="accent"
        size="lg"
      >
        <MessageCircle className="h-5 w-5" />
        {label}
      </ButtonAnchor>
      <ButtonLink href={secondaryHref} variant="outline" size="lg">
        {secondaryLabel}
        <ArrowRight className="h-4 w-4" />
      </ButtonLink>
    </div>
  )
}
