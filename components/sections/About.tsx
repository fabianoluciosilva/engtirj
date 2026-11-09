import { site } from '@/lib/site'
import { Reveal } from '../Reveal'

export function About() {
  return (
    <section id="quem-somos" className="relative scroll-mt-20 border-t border-line/20 bg-surface/40 py-20 lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
        <Reveal>
          <h2 className="font-display text-4xl font-extrabold leading-[1] tracking-tight text-white sm:text-5xl">
            Quem é a EngTI RJ
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <p className="max-w-2xl text-lg leading-relaxed text-foreground">
            A {site.name} é uma empresa de TI que atende empresas de engenharia, arquitetura e
            construção civil do estado do Rio de Janeiro. Cuidamos de servidores e storage para CAD e
            BIM, redes para canteiros de obras, backup contra ransomware e licenças de software
            técnico, de forma remota e no local.
          </p>

          <h3 className="mt-10 font-display text-2xl font-bold text-white">Onde atendemos</h3>
          <ul className="mt-4 grid max-w-2xl gap-x-8 gap-y-2 text-[15px] text-muted-foreground sm:grid-cols-2">
            {site.regions.map((region) => (
              <li key={region} className="flex items-center gap-2.5 border-b border-line/20 pb-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-line/60" aria-hidden />
                {region}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
