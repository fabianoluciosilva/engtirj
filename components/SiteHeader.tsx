'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Menu, X, MessageCircle, Phone } from 'lucide-react'
import { Logo } from './Logo'
import { MegaMenu } from './nav/MegaMenu'
import { serviceIcons } from './nav/serviceIcons'
import { site, whatsappUrl } from '@/lib/site'
import { cn } from '@/lib/cn'

type NavKey = 'servicos' | 'como-funciona' | 'faq' | 'blog'

const LINKS: { key: Exclude<NavKey, 'servicos'>; href: string; label: string }[] = [
  { key: 'como-funciona', href: '/#como-funciona', label: 'Como funciona' },
  { key: 'faq', href: '/#faq', label: 'Perguntas' },
  { key: 'blog', href: '/blog', label: 'Blog' },
]

const SPY_SECTIONS: NavKey[] = ['servicos', 'como-funciona', 'faq']

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [spy, setSpy] = useState<NavKey | null>(null)
  const [bar, setBar] = useState<{ left: number; width: number } | null>(null)

  const navRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Partial<Record<NavKey, HTMLElement | null>>>({})
  const drawerRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  // Item ativo: rota interna tem prioridade; na home vale o scroll-spy.
  const active: NavKey | null = pathname.startsWith('/blog')
    ? 'blog'
    : pathname.startsWith('/servicos')
      ? 'servicos'
      : pathname === '/'
        ? spy
        : null

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy: só na home.
  useEffect(() => {
    if (pathname !== '/') return
    const visible = new Map<string, number>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0))
        let best: NavKey | null = null
        let bestRatio = 0
        SPY_SECTIONS.forEach((id) => {
          const r = visible.get(id) ?? 0
          if (r > bestRatio) {
            best = id
            bestRatio = r
          }
        })
        setSpy(best)
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    )
    SPY_SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [pathname])

  // Posiciona a barra laranja sob o item ativo.
  const measure = useCallback(() => {
    const nav = navRef.current
    const el = active ? itemRefs.current[active] : null
    if (!nav || !el) return setBar(null)
    const n = nav.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    setBar({ left: r.left - n.left + 14, width: r.width - 28 })
  }, [active])

  useLayoutEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  // Gaveta mobile: trava scroll, prende foco, Esc fecha.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const drawer = drawerRef.current
    const focusables = () =>
      Array.from(
        drawer?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      )
    focusables()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuButtonRef.current?.focus()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => setOpen(false), [pathname])

  const setItemRef = (key: NavKey) => (node: HTMLElement | null) => {
    itemRefs.current[key] = node
  }

  return (
    <header className="sticky top-0 z-40">
      <div
        className={cn(
          'border-b border-line/20 transition-[background-color,backdrop-filter] duration-300',
          scrolled ? 'bg-background/95 backdrop-blur-md' : 'bg-background/70 backdrop-blur-sm',
        )}
      >
        <div
          className={cn(
            'container-page flex items-center justify-between gap-6 transition-[height] duration-300',
            scrolled ? 'h-14' : 'h-[4.5rem]',
          )}
        >
          <Link href="/" className="shrink-0">
            <Logo height={scrolled ? 32 : 38} variant="dark" />
            <span className="sr-only"> — página inicial</span>
          </Link>

          <nav className="hidden items-center md:flex" aria-label="Navegação principal">
            <div ref={navRef} className="relative flex items-center">
              <MegaMenu active={active === 'servicos'} triggerRef={setItemRef('servicos')} />
              {LINKS.map((item) => (
                <Link
                  key={item.key}
                  ref={setItemRef(item.key)}
                  href={item.href}
                  aria-current={active === item.key ? 'location' : undefined}
                  className={cn(
                    'px-3.5 py-2 text-sm font-medium transition-colors',
                    active === item.key ? 'text-white' : 'text-muted-foreground hover:text-white',
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-[1.05rem] h-0.5 bg-accent transition-[left,width,opacity] duration-300 ease-out"
                style={{ left: bar?.left ?? 0, width: bar?.width ?? 0, opacity: bar ? 1 : 0 }}
              />
            </div>
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <a
              href={`tel:${site.phoneE164}`}
              className="hidden items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-white xl:inline-flex"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {site.phone}
            </a>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-soft"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Pedir diagnóstico
            </a>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded border border-line/30 p-2 text-foreground md:hidden"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label="Abrir menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {open && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background md:hidden"
        >
          <div className="container-page flex h-[4.5rem] shrink-0 items-center justify-between border-b border-line/20">
            <Logo height={34} variant="dark" />
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                menuButtonRef.current?.focus()
              }}
              className="inline-flex items-center justify-center rounded border border-line/30 p-2 text-foreground"
              aria-label="Fechar menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="container-page flex-1 py-8" aria-label="Navegação mobile">
            <p className="cota">SERVIÇOS</p>
            <ul className="mt-3 divide-y divide-line/20 border-y border-line/20">
              {site.services.map((service) => {
                const Icon = serviceIcons[service.icon]
                return (
                  <li key={service.slug}>
                    <Link
                      href={`/servicos/${service.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 py-3.5 font-display text-2xl font-bold text-white"
                    >
                      <Icon className="h-5 w-5 shrink-0 text-line" aria-hidden />
                      {service.title}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <ul className="mt-8 space-y-1">
              {LINKS.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 font-display text-3xl font-bold text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sticky bottom-0 border-t border-line/20 bg-background p-5">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded bg-accent px-4 py-3.5 text-base font-semibold text-accent-foreground"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Pedir diagnóstico gratuito
            </a>
            <a
              href={`tel:${site.phoneE164}`}
              className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {site.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
