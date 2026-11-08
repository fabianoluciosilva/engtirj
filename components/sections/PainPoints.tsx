import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react'

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
    <section id="dores" className="scroll-mt-20 py-16 lg:py-24">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">
            Problema × Solução
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            As dores reais de um escritório de engenharia
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Não é falta de tecnologia. É infraestrutura que não foi pensada para projetos pesados,
            arquivos críticos e equipes distribuídas entre escritório e obra.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.problem} className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-card">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-red-600">
                <AlertTriangle className="h-4 w-4" />
                A dor
              </div>
              <h3 className="mt-2 font-display text-lg font-semibold text-foreground">{item.problem}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>

              <div className="my-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
                <ArrowRight className="h-4 w-4" />
                A solução EngTI RJ
              </div>
              <div className="mt-auto flex gap-2 rounded-lg bg-accent/5 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-sm leading-relaxed text-foreground/90">{item.solution}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
