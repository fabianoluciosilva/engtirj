import { Reveal } from '../Reveal'

const steps = [
  {
    title: 'Você chama no WhatsApp',
    text: 'Conte o que está travando no escritório ou na obra. Combinamos uma conversa sem compromisso.',
  },
  {
    title: 'Fazemos o diagnóstico',
    text: 'Analisamos servidor, rede, backup e licenças e entregamos a lista do que corrigir primeiro.',
  },
  {
    title: 'Implantamos e acompanhamos',
    text: 'Executamos as correções sem parar o escritório e seguimos monitorando depois da entrega.',
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative scroll-mt-20 py-20 lg:py-28">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-4xl font-extrabold leading-[1] tracking-tight text-white sm:text-5xl">
            Do primeiro contato à rede funcionando
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-px bg-line/20 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="bg-background">
              <Reveal delay={i * 80} className="h-full p-7 md:p-8">
                <span className="font-display text-6xl font-extrabold leading-none text-line/40">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
