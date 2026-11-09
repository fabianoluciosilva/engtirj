/**
 * Configuração central da EngTI RJ.
 * Fonte única de verdade para SEO, GEO, WhatsApp e dados de contato.
 */

/** Número do WhatsApp (apenas dígitos, DDI + DDD + número). */
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '552140421350'

/** Mensagem pré-formatada de conversão, já com a tag de identificação [engti]. */
export const WHATSAPP_MESSAGE =
  'Olá! [engti] Gostaria de solicitar um diagnóstico de TI para minha empresa de engenharia.'

/**
 * URL do WhatsApp com a mensagem pré-preenchida e codificada (URL/percent
 * encoding). O "!" é forçado para %21 para casar byte a byte com o formato
 * oficial de conversão.
 */
export function whatsappUrl(message: string = WHATSAPP_MESSAGE): string {
  const encoded = encodeURIComponent(message).replace(/!/g, '%21')
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
}

/** URL canônica do site (sem barra final). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://engtirj.com.br').replace(/\/+$/, '')

/**
 * Data da última alteração relevante de conteúdo das páginas estáticas
 * (usada no sitemap). Atualize ao mudar textos das páginas.
 */
export const SITE_UPDATED_AT = '2026-11-09'

export type ServiceIcon = 'server' | 'wifi' | 'shield' | 'key'

export interface SiteService {
  slug: string
  title: string
  /** Uma frase (até 160 caracteres) — cartões, menu, meta e llms.txt. */
  summary: string
  icon: ServiceIcon
}

export const site = {
  name: 'EngTI RJ',
  legalName: 'EngTI RJ — Soluções de TI para Engenharia',
  tagline: 'TI para engenharia, arquitetura e construção civil no Rio de Janeiro',
  description:
    'TI para empresas de engenharia, arquitetura e construção civil no Rio de Janeiro: servidores e storage para AutoCAD, Revit e BIM, redes para canteiros de obras, backup em nuvem e proteção contra ransomware.',
  locale: 'pt-BR',
  state: 'RJ',
  region: 'Rio de Janeiro',
  city: 'Rio de Janeiro',
  country: 'BR',
  areaServed: 'Rio de Janeiro, RJ',
  /**
   * Modelo de atendimento: todo o estado do Rio de Janeiro, de forma remota e
   * in-loco na empresa do cliente. Não há endereço de rua público divulgado —
   * por isso o JSON-LD usa areaServed em vez de streetAddress. Se houver
   * endereço comercial, preencha `address.street` e `address.postalCode`.
   */
  coverage: 'Atendimento em todo o estado do Rio de Janeiro — remoto e in-loco',
  regions: [
    'Rio de Janeiro (capital)',
    'Niterói',
    'Baixada Fluminense',
    'Região Serrana',
    'Região dos Lagos',
    'Sul Fluminense',
    'interior do estado',
  ],
  address: {
    street: '' as string,
    city: 'Rio de Janeiro',
    region: 'RJ',
    postalCode: '' as string,
    country: 'BR',
  },
  geo: {
    latitude: -22.9068,
    longitude: -43.1729,
  },
  email: 'contato@engtirj.com.br',
  phone: '+55 21 4042-1350',
  phoneE164: '+552140421350',
  openingHours: 'Mo-Fr 08:00-18:00',
  /** Perfis sociais reais (URLs). Vazio até serem informados — alimenta `sameAs`. */
  social: [] as string[],
  services: [
    {
      slug: 'servidores-storage-cad-bim',
      title: 'Servidores e storage para CAD e BIM',
      summary:
        'Servidor de arquivos e storage NAS/SSD dimensionados para abrir e salvar modelos de AutoCAD, Revit e BIM em rede, com a equipe toda trabalhando junta.',
      icon: 'server',
    },
    {
      slug: 'redes-canteiros-obras',
      title: 'Redes e internet para canteiros de obras',
      summary:
        'Cabeamento, Wi-Fi para obra e link duplo (fibra + 4G/5G) com troca automática, para o canteiro enviar e receber projetos sem ficar offline.',
      icon: 'wifi',
    },
    {
      slug: 'backup-ransomware',
      title: 'Backup em nuvem e proteção contra ransomware',
      summary:
        'Backup 3-2-1 com cópia imutável fora do escritório, para recuperar pranchas e modelos mesmo depois de um ataque.',
      icon: 'shield',
    },
    {
      slug: 'licenciamento-softwares-tecnicos',
      title: 'Gestão de licenças de software técnico',
      summary:
        'Controle de licenças Autodesk, Microsoft 365 e plataformas BIM: renovações no prazo, custo sob controle e conformidade.',
      icon: 'key',
    },
  ] satisfies SiteService[],
  /** CTAs reutilizados em várias seções. */
  cta: {
    primary: 'Pedir diagnóstico gratuito',
    services: 'Conhecer os serviços',
  },
}

export function getService(slug: string): SiteService | undefined {
  return site.services.find((s) => s.slug === slug)
}
