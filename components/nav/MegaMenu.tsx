'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState, type Ref } from 'react'
import { ChevronDown } from 'lucide-react'
import { site } from '@/lib/site'
import { cn } from '@/lib/cn'
import { serviceIcons } from './serviceIcons'

/**
 * Mega-menu de serviços (desktop). Abre por clique, hover e foco; fecha com
 * Esc (devolvendo o foco ao botão), clique fora ou navegação.
 */
export function MegaMenu({
  active,
  triggerRef,
}: {
  active: boolean
  triggerRef?: Ref<HTMLButtonElement>
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const panelId = useId()

  const setButton = (node: HTMLButtonElement | null) => {
    buttonRef.current = node
    if (typeof triggerRef === 'function') triggerRef(node)
    else if (triggerRef) (triggerRef as { current: HTMLButtonElement | null }).current = node
  }

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpen(false), 140)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onPointer = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  useEffect(() => cancelClose, [])

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose()
        setOpen(true)
      }}
      onMouseLeave={scheduleClose}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        ref={setButton}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium transition-colors',
          active || open ? 'text-white' : 'text-muted-foreground hover:text-white',
        )}
      >
        Serviços
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute left-1/2 top-full z-50 w-[40rem] -translate-x-1/2 pt-3"
      >
        <div className="plate grid grid-cols-2 gap-px overflow-hidden bg-line/20 p-0 shadow-2xl shadow-black/40">
          {site.services.map((service) => {
            const Icon = serviceIcons[service.icon]
            return (
              <Link
                key={service.slug}
                href={`/servicos/${service.slug}`}
                onClick={() => setOpen(false)}
                className="group flex gap-3.5 bg-background p-5 transition-colors hover:bg-surface"
              >
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-line transition-colors group-hover:text-accent" aria-hidden />
                <span>
                  <span className="block font-display text-lg font-bold leading-tight text-white">
                    {service.title}
                  </span>
                  <span className="mt-1 block text-[13px] leading-snug text-muted-foreground">
                    {service.summary}
                  </span>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
