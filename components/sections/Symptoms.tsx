import { Reveal } from '../Reveal'

const items = [
  {
    symptom: 'O Revit leva minutos para abrir o modelo',
    cause:
      'Vários projetistas puxam o mesmo arquivo de um servidor antigo ou de um HD compartilhado, numa rede que trata projeto como se fosse planilha.',
    fix: 'Servidor de arquivos ou NAS com SSD e rede segmentada, dimensionados pelo que a equipe realmente usa.',
  },
  {
    symptom: 'Um arquivo de obra sumiu e não existe cópia',
    cause:
      'O backup roda num HD ligado ao próprio servidor, ou ninguém nunca testou restaurar. Um ransomware leva as duas cópias juntas.',
    fix: 'Backup 3-2-1 com cópia imutável fora do escritório e teste periódico de restauração.',
  },
  {
    symptom: 'A obra fica sem internet quando a fibra cai',
    cause:
      'Canteiro com um só link e Wi-Fi doméstico: sem a prancha atualizada, sem diário de obra e sem contato com o escritório.',
    fix: 'Fibra mais 4G/5G com troca automática e Wi-Fi dimensionado para a área da obra.',
  },
  {
    symptom: 'O suporte de TI não entende de Autodesk nem de obra',
    cause:
      'O chamado vira ping-pong: quem atende não sabe o que é um modelo central nem a urgência de uma entrega.',
    fix: 'Atendimento por quem conhece o dia a dia de projeto e de canteiro, direto pelo WhatsApp.',
  },
]

export function Symptoms() {
  return (
    <section id="sintomas" className="relative scroll-mt-20 py-20 lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="font-display text-4xl font-extrabold leading-[1] tracking-tight text-white sm:text-5xl">
            O que trava um escritório de engenharia
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">
            Quase nunca falta tecnologia. Falta infraestrutura montada para arquivos grandes, prazos
            de entrega e equipes divididas entre escritório e obra.
          </p>
        </Reveal>

        <ol className="divide-y divide-line/20 border-y border-line/20">
          {items.map((item, i) => (
            <li key={item.symptom}>
              <Reveal delay={i * 60} className="py-8">
                <h3 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                  {item.symptom}
                </h3>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  {item.cause}
                </p>
                <p className="mt-4 max-w-xl border-l-2 border-line/50 pl-4 text-[15px] leading-relaxed text-foreground">
                  {item.fix}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
