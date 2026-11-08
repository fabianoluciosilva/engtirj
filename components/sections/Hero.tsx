import { ShieldCheck, HardDrive, Wifi, ArrowRight } from 'lucide-react'
import { CtaWhatsApp } from '../CtaWhatsApp'

const highlights = [
  { icon: HardDrive, label: 'CAD / BIM sem travar' },
  { icon: Wifi, label: 'Rede para canteiros' },
  { icon: ShieldCheck, label: 'Proteção anti-ransomware' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-engineering-grid opacity-[0.5]" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" aria-hidden />

      <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            TI exclusiva para engenharia no RJ
          </span>

          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            Seus projetos de <span className="text-accent">AutoCAD, Revit e BIM</span> param de travar.
            <br className="hidden sm:block" /> Suas obras, protegidas.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Infraestrutura de TI sob medida para empresas de engenharia, arquitetura e construção
            civil no Rio de Janeiro — servidores e storages de alta performance, redes para canteiros
            de obras, backup em nuvem e imunização contra ransomware.
          </p>

          <CtaWhatsApp className="mt-8" />

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Painel técnico decorativo — "status da infraestrutura" */}
        <div className="relative">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Performance da rede
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Estável
              </span>
            </div>

            <ul className="mt-4 space-y-3">
              {[
                { name: 'Servidor de arquivos (SSD)', value: 'Leitura 2.4 GB/s', pct: 92 },
                { name: 'Storage BIM / NAS', value: 'Uso 68% · saudável', pct: 68 },
                { name: 'Link redundante (fibra + 4G)', value: 'Failover ativo', pct: 99 },
                { name: 'Backup imutável offsite', value: 'Último: hoje, 03h', pct: 100 },
              ].map((row) => (
                <li key={row.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{row.name}</span>
                    <span className="text-xs text-muted-foreground">{row.value}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <a
              href="#servicos"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:gap-2.5 transition-all"
            >
              Ver como implementamos <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
