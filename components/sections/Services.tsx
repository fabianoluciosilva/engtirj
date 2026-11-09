import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { site } from '@/lib/site'
import { CtaWhatsApp } from '../CtaWhatsApp'
import { Reveal } from '../Reveal'
import { serviceIcons } from '../nav/serviceIcons'

export function Services() {
  return (
    <section id="servicos" className="relative scroll-mt-20 border-y border-line/20 bg-surface/40 py-20 lg:py-28">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-4xl font-extrabold leading-[1] tracking-tight text-white sm:text-5xl">
            Quatro frentes que sustentam o dia a dia do projeto
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Do servidor que abre o Revit à rede que conecta o canteiro, passando pelo backup e pelas
            licenças. Cada frente tem uma página com o que entregamos e como trabalhamos.
          </p>
        </Reveal>

        <ul className="mt-12 divide-y divide-line/20 border-y border-line/20">
          {site.services.map((service, i) => {
            const Icon = serviceIcons[service.icon]
            return (
              <li key={service.slug}>
                <Reveal delay={i * 50}>
                  <Link
                    href={`/servicos/${service.slug}`}
                    className="group grid items-center gap-4 py-7 transition-colors hover:bg-surface sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-8 sm:px-4"
                  >
                    <Icon className="h-7 w-7 text-line transition-colors group-hover:text-accent" aria-hidden />
                    <span>
                      <span className="block font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                        {service.title}
                      </span>
                      <span className="mt-2 block max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                        {service.summary}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground group-hover:text-accent">
                      Ver o serviço
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </span>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>

        <Reveal className="mt-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="font-display text-3xl font-bold leading-tight text-white">
                Não sabe por onde começar?
              </p>
              <p className="mt-2 text-base text-muted-foreground">
                Fazemos um diagnóstico gratuito da infraestrutura atual e mostramos o que corrigir
                primeiro.
              </p>
            </div>
            <CtaWhatsApp secondaryHref="#faq" secondaryLabel="Ver perguntas comuns" className="shrink-0" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
