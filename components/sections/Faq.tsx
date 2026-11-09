import { ChevronDown, HelpCircle } from 'lucide-react'
import { faq } from '@/lib/faq'
import { Reveal } from '../Reveal'

/**
 * FAQ acessível com <details>/<summary> nativo (sem JS, indexável).
 * O mesmo conteúdo alimenta o schema FAQPage.
 */
export function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-20 py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden />

      <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <HelpCircle className="h-3.5 w-3.5" />
            Perguntas frequentes
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Dúvidas comuns de quem{' '}
            <span className="text-gradient">trabalha com projetos</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            As perguntas que diretores e sócios de empresas de engenharia mais fazem sobre TI,
            CAD/BIM e segurança de arquivos de obra.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm">
            {faq.map((item) => (
              <details key={item.question} className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 transition-colors hover:bg-white/[0.03]">
                  <h3 className="font-display text-base font-semibold text-foreground group-open:text-white">
                    {item.question}
                  </h3>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all group-open:border-accent/40 group-open:bg-accent/10 group-open:text-accent">
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}