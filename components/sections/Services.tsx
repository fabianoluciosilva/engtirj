import { Server, Wifi, ShieldCheck, KeyRound, type LucideIcon } from 'lucide-react'
import { site } from '@/lib/site'
import { CtaWhatsApp } from '../CtaWhatsApp'
import { Reveal } from '../Reveal'

const icons: LucideIcon[] = [Server, Wifi, ShieldCheck, KeyRound]

export function Services() {
  return (
    <section id="servicos" className="relative scroll-mt-20 py-20 lg:py-28">
      {/* faixa de glow atrás da seção */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[120px]" aria-hidden />

      <div className="container-page relative">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <Server className="h-3.5 w-3.5" />
            Serviços especializados
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Infraestrutura de TI pensada para{' '}
            <span className="text-gradient">projetos de engenharia</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Quatro frentes que resolvem a base do dia a dia de arquitetura, engenharia e construção
            civil — do servidor que abre o Revit à rede que conecta o canteiro de obras.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {site.services.map((service, i) => {
            const Icon = icons[i] ?? Server
            return (
              <Reveal key={service.slug} delay={i * 100}>
                <article className="card-future group flex h-full flex-col p-7">
                  <div className="flex items-start justify-between">
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-soft text-white shadow-neon-soft transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <span className="absolute inset-0 rounded-2xl bg-accent/40 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
                      <Icon className="relative h-7 w-7" />
                    </span>
                    <span className="font-mono text-4xl font-bold text-white/[0.06] transition-colors duration-500 group-hover:text-accent/20">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-white">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent opacity-0 transition-all duration-300 group-hover:opacity-100">
                    Saiba mais →
                  </span>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={120} className="mt-12">
          <div className="relative overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/[0.12] via-card/60 to-cyan/[0.06] p-7">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" aria-hidden />
            <div className="relative flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
              <div>
                <p className="font-display text-xl font-semibold text-white">
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
        </Reveal>
      </div>
    </section>
  )
}