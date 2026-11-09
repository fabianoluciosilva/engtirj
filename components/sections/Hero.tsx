import { BlueprintPlan } from '../hero/BlueprintPlan'
import { CtaWhatsApp } from '../CtaWhatsApp'

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line/20">
      <div className="container-page grid min-h-[calc(100svh-4.5rem)] items-center gap-10 py-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6 lg:py-16">
        <div>
          <h1 className="font-display text-[3.25rem] font-extrabold leading-[0.95] tracking-tight text-white sm:text-7xl lg:text-[5.25rem]">
            TI para engenharia no Rio de Janeiro: o projeto abre rápido e a obra não fica sem rede.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Cuidamos de servidores, redes de canteiro, backup e licenças de escritórios de
            engenharia, arquitetura e construtoras de todo o estado.
          </p>

          <CtaWhatsApp className="mt-9" />
        </div>

        <div className="lg:-mr-12 xl:-mr-28">
          <BlueprintPlan />
        </div>
      </div>
    </section>
  )
}
