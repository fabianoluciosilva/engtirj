'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { site, getService } from '@/lib/site'
import { cn } from '@/lib/cn'

/**
 * Planta técnica do hero: escritório (servidor), canteiro (rede), nuvem
 * (backup) e licenças, ligados por traços de desenho.
 * - Ao carregar, os traços se desenham; depois um ponto percorre o cabo
 *   que liga escritório e canteiro. É o único movimento autônomo da página.
 * - Os 4 pontos são botões: abrem um cartão com o serviço e o link.
 * - `prefers-reduced-motion`: planta já desenhada e sem o ponto.
 */

const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}z`

interface Stroke {
  d: string
  delay: number
  weight?: number
  opacity?: number
}

// Escritório: contorno, pavimentos, janelas, sala de servidores, porta, antena.
const office: Stroke[] = [
  { d: rect(60, 250, 240, 220), delay: 0, weight: 2 },
  { d: 'M60 330H300M60 400H300', delay: 0.15 },
  { d: [90, 140, 190, 240].map((x) => rect(x, 272, 34, 32)).join(''), delay: 0.25 },
  { d: [90, 240].map((x) => rect(x, 346, 34, 32)).join(''), delay: 0.3 },
  { d: rect(130, 410, 100, 60), delay: 0.35, weight: 2 },
  { d: rect(142, 420, 30, 50) + rect(188, 420, 30, 50), delay: 0.4 },
  { d: 'M148 432h18M148 444h18M148 456h18M194 432h18M194 444h18M194 456h18', delay: 0.45, opacity: 0.6 },
  { d: rect(250, 430, 30, 40), delay: 0.4 },
  { d: 'M180 250V212M166 224a20 20 0 0 1 28 0M158 214a32 32 0 0 1 44 0', delay: 0.5 },
]

// Canteiro: estrutura em construção, guindaste e contêiner com antena.
const site_: Stroke[] = [
  { d: 'M520 470V330M580 470V330M640 470V330M700 470V330', delay: 0.4, weight: 2 },
  { d: 'M520 400H700M520 330H700', delay: 0.55 },
  { d: 'M520 470L580 400M580 470L520 400M580 400L640 330M640 400L580 330', delay: 0.65, opacity: 0.55 },
  { d: 'M752 470V104M776 470V104M752 470L776 440L752 410L776 380L752 350L776 320L752 290L776 260L752 230L776 200L752 170L776 140L752 110', delay: 0.5 },
  { d: 'M690 104H850M690 104L764 56L838 104M690 104V120', delay: 0.7, weight: 2 },
  { d: 'M690 120V250M684 250h12v12h-12z', delay: 0.9 },
  { d: rect(430, 428, 80, 42), delay: 0.6, weight: 2 },
  { d: 'M450 428V396M450 396l-8-10M450 396l8-10M444 440h14M474 440h14', delay: 0.75 },
  { d: 'M404 470h446', delay: 0.2, weight: 2 },
]

// Nuvem e chave de licença.
const extras: Stroke[] = [
  { d: 'M330 132a30 30 0 0 1 6-59a46 46 0 0 1 88-6a36 36 0 0 1 14 65z', delay: 0.8, weight: 2 },
  { d: 'M96 150a14 14 0 1 0 28 0a14 14 0 1 0-28 0M124 150h52M160 150v14M172 150v10', delay: 1, weight: 2 },
]

// Cabos: licenças→nuvem, escritório→nuvem, nuvem→canteiro e o cabo enterrado.
const links: Stroke[] = [
  { d: 'M178 150C250 150 290 118 330 106', delay: 1.4, opacity: 0.7 },
  { d: 'M262 250C282 200 300 150 338 122', delay: 1.5, opacity: 0.7 },
  { d: 'M404 134C450 220 470 330 470 396', delay: 1.6, opacity: 0.7 },
  { d: 'M180 470C180 528 470 528 470 470', delay: 1.7, opacity: 0.9 },
]
const CABLE = 'M180 470C180 528 470 528 470 470'

interface Hotspot {
  slug: string
  cota: string
  left: number // % do SVG
  top: number
  card: 'above' | 'below'
  align: 'left' | 'center' | 'right'
}

const hotspots: Hotspot[] = [
  { slug: 'licenciamento-softwares-tecnicos', cota: 'LICENÇAS', left: 15.9, top: 26.8, card: 'below', align: 'left' },
  { slug: 'backup-ransomware', cota: 'BACKUP IMUTÁVEL', left: 43.8, top: 17.9, card: 'below', align: 'center' },
  { slug: 'servidores-storage-cad-bim', cota: 'SERVIDOR DE ARQUIVOS', left: 20.5, top: 78.6, card: 'above', align: 'left' },
  { slug: 'redes-canteiros-obras', cota: 'REDE DO CANTEIRO', left: 53.4, top: 80, card: 'above', align: 'center' },
]

function Paths({ strokes }: { strokes: Stroke[] }) {
  return (
    <>
      {strokes.map((s, i) => (
        <path
          key={i}
          d={s.d}
          pathLength={1}
          className="plan-draw"
          strokeWidth={s.weight ?? 1.25}
          opacity={s.opacity ?? 1}
          style={{ animationDelay: `${s.delay}s` }}
        />
      ))}
    </>
  )
}

export function BlueprintPlan() {
  const [openSlug, setOpenSlug] = useState<string | null>(null)
  const [motionOk, setMotionOk] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: no-preference)')
    setMotionOk(mq.matches)
    const onChange = () => setMotionOk(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!openSlug) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenSlug(null)
    }
    const onPointer = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpenSlug(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [openSlug])

  return (
    <div>
      <div ref={wrapRef} className="relative mx-auto w-full max-w-[860px]">
        <svg
          viewBox="0 0 880 560"
          role="img"
          aria-label="Planta de um escritório de engenharia ligado a um canteiro de obras por cabo de rede e à nuvem de backup"
          className="block w-full text-line"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Paths strokes={office} />
          <Paths strokes={site_} />
          <Paths strokes={extras} />
          <Paths strokes={links} />

          {/* ponto de dados percorrendo o cabo */}
          {motionOk && (
            <circle r="5" fill="rgb(var(--accent))" stroke="none">
              <animateMotion dur="7s" begin="2.6s" repeatCount="indefinite" path={CABLE} />
            </circle>
          )}
        </svg>

        {hotspots.map((h) => {
          const service = getService(h.slug)
          if (!service) return null
          const isOpen = openSlug === h.slug
          return (
            <div
              key={h.slug}
              className="absolute hidden md:block"
              style={{ left: `${h.left}%`, top: `${h.top}%` }}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`plan-card-${h.slug}`}
                onClick={() => setOpenSlug(isOpen ? null : h.slug)}
                className="group -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span className="relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-accent bg-background">
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full bg-accent transition-transform',
                      isOpen ? 'scale-100' : 'scale-50 group-hover:scale-100',
                    )}
                  />
                </span>
                <span className="cota rounded bg-background/90 px-1.5 py-1 group-hover:text-white">
                  {h.cota}
                </span>
              </button>

              {isOpen && (
                <div
                  id={`plan-card-${h.slug}`}
                  role="region"
                  aria-label={service.title}
                  className={cn(
                    'plate absolute z-10 w-64 p-4 text-left shadow-xl shadow-black/40',
                    h.card === 'below' ? 'top-5' : 'bottom-5',
                    h.align === 'left' && 'left-0 -translate-x-3',
                    h.align === 'center' && 'left-1/2 -translate-x-1/2',
                    h.align === 'right' && 'right-0 translate-x-3',
                  )}
                >
                  <p className="font-display text-lg font-bold leading-tight text-white">{service.title}</p>
                  <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">{service.summary}</p>
                  <Link
                    href={`/servicos/${service.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                  >
                    Ver o serviço
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile: os mesmos 4 pontos como atalhos */}
      <ul className="mt-5 grid grid-cols-2 gap-2 md:hidden">
        {hotspots.map((h) => (
          <li key={h.slug}>
            <Link
              href={`/servicos/${h.slug}`}
              className="flex h-full items-center gap-2 rounded border border-line/30 px-3 py-2.5 text-sm font-medium text-white"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden />
              {site.services.find((s) => s.slug === h.slug)?.title.split(' ').slice(0, 3).join(' ')}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
