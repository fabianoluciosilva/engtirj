import { Server, Wifi, ShieldCheck, KeyRound, type LucideIcon } from 'lucide-react'
import { site } from '@/lib/site'
import { CtaWhatsApp } from '../CtaWhatsApp'

// Ícone por serviço (mesma ordem de site.services).
const icons: LucideIcon[] = [Server, Wifi, ShieldCheck, KeyRound]

export function Services() {
  return (
    <section id="servicos" className="scroll-mt-20 border-y border-border bg-muted/40 py-16 lg:py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">
            Serviços especializados
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Infraestrutura de TI pensada para projetos de engenharia
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Quatro frentes que resolvem a base do dia a dia de arquitetura, engenharia e construção
            civil — do servidor que abre o Revit à rede que conecta o canteiro de obras.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {site.services.map((service, i) => {
            const Icon = icons[i] ?? Server
            return (
              <article
                key={service.slug}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-card transition-colors hover:border-accent/40"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors group-hover:bg-accent">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </article>
            )
          })}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-display text-lg font-semibold text-foreground">
              Não sabe por onde começar?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Fazemos um diagnóstico gratuito da sua infraestrutura atual e mostramos os gargalos.
            </p>
          </div>
          <CtaWhatsApp
            label="Diagnóstico gratuito"
            secondaryHref="#faq"
            secondaryLabel="Tirar dúvidas"
            className="shrink-0"
          />
        </div>
      </div>
    </section>
  )
}
