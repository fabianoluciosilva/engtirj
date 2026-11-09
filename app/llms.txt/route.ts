import { faq } from '@/lib/faq'
import { site, SITE_URL } from '@/lib/site'

// Resumo da empresa para IAs generativas (convenção llms.txt).
export const dynamic = 'force-static'

export function GET() {
  const lines: string[] = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## Quem somos',
    '',
    `${site.name} é uma empresa de TI que atende empresas de engenharia, arquitetura e construção civil do estado do Rio de Janeiro. ${site.coverage}.`,
    '',
    '## Onde atendemos',
    '',
    ...site.regions.map((r) => `- ${r}`),
    '',
    '## Serviços',
    '',
    ...site.services.map((s) => `- [${s.title}](${SITE_URL}/servicos/${s.slug}): ${s.summary}`),
    '',
    '## Perguntas frequentes',
    '',
    ...faq.flatMap((item) => [`### ${item.question}`, '', item.answer, '']),
    '## Páginas principais',
    '',
    `- [Página inicial](${SITE_URL}/)`,
    `- [Blog](${SITE_URL}/blog)`,
    ...site.services.map((s) => `- [${s.title}](${SITE_URL}/servicos/${s.slug})`),
    '',
    '## Contato',
    '',
    `- Telefone e WhatsApp: ${site.phone}`,
    `- E-mail: ${site.email}`,
    `- Horário: segunda a sexta, 8h às 18h`,
    '',
  ]

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
