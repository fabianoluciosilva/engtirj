'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, MessageCircle } from 'lucide-react'
import { Logo } from './Logo'
import { ButtonAnchor } from './Button'
import { whatsappUrl } from '@/lib/site'
import { cn } from '@/lib/cn'

const NAV = [
  { href: '/#dores', label: 'Desafios' },
  { href: '/#servicos', label: 'Serviços' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/blog', label: 'Blog' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="EngTI RJ — página inicial" className="shrink-0">
          <Logo height={38} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ButtonAnchor
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            variant="accent"
            size="md"
          >
            <MessageCircle className="h-4 w-4" />
            Falar no WhatsApp
          </ButtonAnchor>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted md:hidden"
          aria-expanded={open}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Menu mobile */}
      <div
        className={cn(
          'border-t border-border bg-background md:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-3" aria-label="Navegação mobile">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
          <ButtonAnchor
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            variant="accent"
            size="md"
            className="mt-2 w-full"
          >
            <MessageCircle className="h-4 w-4" />
            Falar no WhatsApp
          </ButtonAnchor>
        </nav>
      </div>
    </header>
  )
}
