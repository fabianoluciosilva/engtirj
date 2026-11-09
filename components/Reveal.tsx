'use client'

import { useEffect, useRef, useState, type ReactNode, type ElementType } from 'react'
import { cn } from '@/lib/cn'

/**
 * Reveal — suaviza a entrada (opacidade) de blocos que estão abaixo da dobra.
 * O conteúdo é renderizado visível no servidor e sem JavaScript; só depois de
 * montar, o que ainda não está na tela é escondido e revelado ao entrar na
 * viewport. Assim o texto nunca depende do script para existir. Respeita
 * prefers-reduced-motion via CSS. `delay` (ms) escalona itens de uma grade.
 */
export function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className,
}: {
  children: ReactNode
  as?: ElementType
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLElement | null>(null)
  const [state, setState] = useState<'shown' | 'hidden' | 'revealed'>('shown')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92) return // já visível: não anima

    setState('hidden')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setState('revealed')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as never}
      className={cn(state !== 'shown' && 'reveal', state === 'revealed' && 'is-visible', className)}
      style={state === 'shown' ? undefined : { transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
