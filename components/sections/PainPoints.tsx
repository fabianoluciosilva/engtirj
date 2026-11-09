import { AlertTriangle, ArrowRight, CheckCircle2, Zap } from 'lucide-react'
import { Reveal } from '../Reveal'

const items = [
  {
    problem: 'Projetos BIM/CAD lentos e travando',
    description:
      'Arquivos de centenas de MB abertos por vários usuários em HDs comuns e rede genérica. Cada salvamento é uma espera.',
    solution:
      'Servidor de arquivos e storage SSD/NAS dedicados, com rede segmentada para abrir e salvar projetos grandes de forma contínua.',
  },
  {
    problem: 'Perda de arquivos de obras e pranchas',
    description:
      'Sem backup confiável, um HD queimado ou um ransomware apaga anos de projetos em minutos — sem cópia recuperável.',
    solution:
      'Backup 3-2-1 com cópia imutável offsite e versionamento: recuperação pontual mesmo após um ataque.',
  },
  {
    problem: 'Falta de suporte especializado',
    description:
      'A TI genérica não entende Autodesk, BIM, pranchas nem o ritmo de um canteiro de obras — e o suporte vira ping-pong.',
    solution:
      'Time que atende exclusivamente engenharia, arquitetura e construção civil no RJ, com SLA e conhecimento dos softwares técnicos.',
  },
]

export function PainPoints() {
  return (
    <section id="dores" className="relative scroll-mt-20 py-20 lg:py-28">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <Zap className="h-3.5 w-3.5" />
            Problema × Solução
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            As dores reais de um{' '}
            <span className="text-gradient">escritório de engenharia</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Não é falta de tecnologia. É infraestrutura que não foi pensada para projetos pesados,
            arquivos críticos e equipes distribuídas entre escritório e obra.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.problem} delay={i * 120}>
              <article className="card-future group flex h-full flex-col p-6">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
                  <AlertTriangle className="h-4 w-4" />
                  A dor
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold text-white">{item.problem}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

                <div className="my-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                  <ArrowRight className="h-4 w-4" />
                  A solução EngTI RJ
                </div>
                <div className="mt-auto flex gap-2 rounded-xl border border-accent/15 bg-accent/[0.06] p-3.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <p className="text-sm leading-relaxed text-foreground/90">{item.solution}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}