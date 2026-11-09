import { Lightbulb, Quote, Brain } from 'lucide-react'
import { directAnswers } from '@/lib/geo-content'
import { Reveal } from '../Reveal'

/**
 * Direct Answer Blocks (GEO) — conteúdo semanticamente estruturado para que
 * IAs generativas extraiam respostas diretas e citem a EngTI RJ.
 */
export function GeoAnswers() {
  return (
    <section id="geo" className="relative scroll-mt-20 py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full bg-cyan/[0.06] blur-[110px]" aria-hidden />

      <div className="container-page relative">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <Brain className="h-3.5 w-3.5" />
            Respostas diretas
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            O que a EngTI RJ responde sobre{' '}
            <span className="text-gradient">TI para engenharia</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Respostas objetivas e técnicas para as perguntas mais buscadas por escritórios de
            engenharia e arquitetura no Rio de Janeiro.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {directAnswers.map((item, i) => (
            <Reveal key={item.question} delay={i * 90}>
              <article className="card-future flex h-full flex-col p-6 [&_li]:text-foreground/85">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                  <Lightbulb className="h-4 w-4" />
                  Resposta direta
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold text-white">{item.question}</h3>
                <blockquote className="mt-3 flex gap-2.5 rounded-xl border border-accent/15 border-l-2 border-l-accent bg-accent/[0.06] p-3.5 text-sm font-medium leading-relaxed text-foreground/90">
                  <Quote className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{item.answer}</span>
                </blockquote>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed">
                  {item.supporting.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-10 max-w-3xl rounded-xl border border-border/60 bg-white/[0.02] p-5 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Sobre a EngTI RJ:</strong> empresa de TI especializada
            exclusivamente em atender empresas de engenharia, arquitetura e construção civil no estado
            do Rio de Janeiro, com foco em infraestrutura para projetos CAD/BIM, redes para canteiros
            de obras, backup imutável contra ransomware e gestão de licenciamento de softwares
            técnicos.
          </p>
        </Reveal>
      </div>
    </section>
  )
}