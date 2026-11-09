import { ChevronDown } from 'lucide-react'
import { faq } from '@/lib/faq'
import { Reveal } from '../Reveal'

/**
 * FAQ com <details>/<summary> nativo (sem JS, indexável). O mesmo conteúdo
 * (lib/faq.ts) alimenta o schema FAQPage e o /llms.txt.
 */
export function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-20 border-t border-line/20 py-20 lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-display text-4xl font-extrabold leading-[1] tracking-tight text-white sm:text-5xl">
            Perguntas de quem toca projetos
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">
            O que sócios e coordenadores de escritórios de engenharia mais perguntam sobre TI,
            CAD/BIM e segurança de arquivos de obra.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="divide-y divide-line/20 border-y border-line/20">
            {faq.map((item) => (
              <details key={item.question} className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 transition-colors hover:text-white">
                  <h3 className="font-display text-xl font-bold leading-snug text-foreground group-open:text-white">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-line transition-transform group-open:rotate-180 group-open:text-accent"
                    aria-hidden
                  />
                </summary>
                <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
