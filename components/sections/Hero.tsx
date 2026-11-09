import { ShieldCheck, HardDrive, Wifi, ArrowRight, Cpu, Activity } from 'lucide-react'
import { CtaWhatsApp } from '../CtaWhatsApp'

const highlights = [
  { icon: HardDrive, label: 'CAD / BIM sem travar' },
  { icon: Wifi, label: 'Rede para canteiros' },
  { icon: ShieldCheck, label: 'Anti-ransomware' },
]

const rows = [
  { name: 'Servidor de arquivos (SSD)', value: 'Leitura 2.4 GB/s', pct: 92 },
  { name: 'Storage BIM / NAS', value: 'Uso 68% · saudável', pct: 68 },
  { name: 'Link redundante (fibra + 4G)', value: 'Failover ativo', pct: 99 },
  { name: 'Backup imutável offsite', value: 'Último: hoje, 03h', pct: 100 },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Fundo: grade animada + glows radiais */}
      <div className="absolute inset-0 bg-engineering-grid animate-grid-pan opacity-60" aria-hidden />
      <div className="absolute inset-0 bg-hero-glow" aria-hidden />
      <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-accent/20 blur-[100px]" aria-hidden />
      <div className="absolute top-40 left-0 h-64 w-64 rounded-full bg-cyan/10 blur-[100px]" aria-hidden />

      <div className="container-page relative grid items-center gap-14 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent shadow-neon-soft">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            TI exclusiva para engenharia no RJ
          </span>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Seus projetos de{' '}
            <span className="text-gradient">AutoCAD, Revit e BIM</span>{' '}
            param de travar.
            <br className="hidden sm:block" />
            <span className="text-foreground/90"> Suas obras, protegidas.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Infraestrutura de TI de alta performance para empresas de engenharia, arquitetura e
            construção civil no Rio de Janeiro — servidores e storages para projetos pesados, redes
            para canteiros de obras, backup em nuvem e imunização contra ransomware.
          </p>

          <CtaWhatsApp className="mt-9" />

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-white/[0.03] text-accent shadow-inner">
                  <Icon className="h-4 w-4" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Painel HUD futurista */}
        <div className="relative animate-floaty">
          {/* anel orbital decorativo */}
          <div className="pointer-events-none absolute -inset-6 rounded-[2rem] border border-border/40" aria-hidden />
          <div className="pointer-events-none absolute -inset-12 rounded-[2.5rem] border border-accent/10" aria-hidden />

          <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            {/* linha de scan animada */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent/10 to-transparent animate-scan" aria-hidden />

            <div className="flex items-center justify-between border-b border-border/60 px-5 py-3.5">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Activity className="h-3.5 w-3.5 text-accent" />
                Monitoramento em tempo real
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Estável
              </span>
            </div>

            <ul className="space-y-4 px-5 py-5">
              {rows.map((row) => (
                <li key={row.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{row.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{row.value}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-accent-soft shadow-[0_0_12px_rgba(249,115,22,0.6)]"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-border/60 px-5 py-3.5">
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Cpu className="h-3.5 w-3.5 text-cyan" />
                Uptime 99,98%
              </span>
              <a
                href="#servicos"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-all hover:gap-2.5"
              >
                Ver como implementamos <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Divisor luminoso */}
      <div className="divider-glow" aria-hidden />
    </section>
  )
}