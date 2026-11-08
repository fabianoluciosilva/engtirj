import { ChevronDown } from 'lucide-react'
import { faq } from '@/lib/faq'

/**
 * FAQ acessível. Usa <details>/<summary> nativo — sem JS, indexável e
 * acessível. O mesmo conteúdo alimenta o schema FAQPage (ver JsonLd).
 */
export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-border bg-muted/40 py-16 lg:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">
            Perguntas frequentes
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Dúvidas comuns de quem trabalha com projetos
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            As perguntas que diretores e sócios de empresas de engenharia mais fazem sobre TI,
            CAD/BIM e segurança de arquivos de obra.
          </p>
        </div>

        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {faq.map((item) => (
            <details key={item.question} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <h3 className="font-display text-base font-semibold text-foreground">
                  {item.question}
                </h3>
                <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
