'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, MessageCircle, Sparkles } from 'lucide-react'
import { Logo } from './Logo'
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
    <header className="sticky top-0 z-40">
      <div className="glass border-b border-border/60">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/" aria-label="EngTI RJ — página inicial" className="shrink-0 transition-opacity hover:opacity-90">
            <Logo height={38} variant="dark" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-0 scale-90 rounded-lg bg-white/5 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100" />
                <span className="absolute -bottom-px left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent to-transparent transition-all duration-300 group-hover:w-3/4" />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow group inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4 transition-transform group-hover:rotate-6" />
              Falar no WhatsApp
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-lg border border-border/60 p-2 text-foreground transition-colors hover:bg-white/5 md:hidden"
            aria-expanded={open}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        className={cn(
          'overflow-hidden border-b border-border/60 bg-background/95 backdrop-blur-xl transition-all duration-300 md:hidden',
          open ? 'max-h-[320px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <nav className="container-page flex flex-col gap-1 py-3" aria-label="Navegação mobile">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-white/5"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              {item.label}
            </Link>
          ))}
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground"
          >
            <MessageCircle className="h-4 w-4" />
            Falar no WhatsApp
          </a>
        </nav>
      </div>
    </header>
  )
}