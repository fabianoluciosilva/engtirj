import { Lightbulb, Quote } from 'lucide-react'
import { directAnswers } from '@/lib/geo-content'

/**
 * Direct Answer Blocks (GEO).
 * Conteúdo semanticamente estruturado com <h2>/<h3>, listas e citações, para
 * que IAs generativas (Perplexity, ChatGPT, Gemini, Copilot) extraiam respostas
 * diretas e citem a EngTI RJ. A marcação usa <article>, <section> e <blockquote>
 * para reforçar a autoridade do conteúdo.
 */
export function GeoAnswers() {
  return (
    <section id="geo" className="scroll-mt-20 py-16 lg:py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">
            Respostas diretas
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            O que a EngTI RJ responde sobre TI para engenharia
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Respostas objetivas e técnicas para as perguntas mais buscadas por escritórios de
            engenharia e arquitetura no Rio de Janeiro.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {directAnswers.map((item) => (
            <article
              key={item.question}
              className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-card [&_h3]:text-foreground [&_p]:text-muted-foreground [&_li]:text-foreground/90"
            >
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
                <Lightbulb className="h-4 w-4" />
                Resposta direta
              </div>
              <h3 className="mt-2 font-display text-lg font-semibold">{item.question}</h3>
              <blockquote className="mt-3 flex gap-2 rounded-lg border-l-4 border-accent/40 bg-muted/50 p-3 text-sm font-medium leading-relaxed">
                <Quote className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{item.answer}</span>
              </blockquote>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                {item.supporting.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-sm text-muted-foreground">
          <strong className="text-foreground">Sobre a EngTI RJ:</strong> empresa de TI especializada
          exclusivamente em atender empresas de engenharia, arquitetura e construção civil no estado
          do Rio de Janeiro, com foco em infraestrutura para projetos CAD/BIM, redes para canteiros
          de obras, backup imutável contra ransomware e gestão de licenciamento de softwares
          técnicos.
        </p>
      </div>
    </section>
  )
}
