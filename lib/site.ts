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

export const site = {
  name: 'EngTI RJ',
  legalName: 'EngTI RJ — Soluções de TI para Engenharia',
  tagline: 'TI especializada para engenharia, arquitetura e construção civil no Rio de Janeiro',
  description:
    'Suporte de TI especializado para empresas de engenharia, arquitetura e construção civil no Rio de Janeiro. Servidores e storages para AutoCAD, Revit e BIM, redes para canteiros de obras, backup em nuvem e proteção contra ransomware.',
  locale: 'pt-BR',
  state: 'RJ',
  region: 'Rio de Janeiro',
  city: 'Rio de Janeiro',
  country: 'BR',
  areaServed: 'Rio de Janeiro, RJ',
  /**
   * Modelo de atendimento: a EngTI RJ atende em todo o estado do Rio de
   * Janeiro, de forma remota e in-loco na empresa do cliente. Não há endereço
   * de rua público divulgado (operação remota/in-loco) — por isso o JSON-LD
   * usa areaServed em vez de streetAddress, o que é válido para negócios de
   * serviço local. Se houver endereço comercial, preencha `address.street` e
   * `address.postalCode` abaixo.
   */
  coverage: 'Atendimento em todo o Rio de Janeiro — remoto e in-loco',
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
  // E-mail e telefone: telefone exibido = número comercial do WhatsApp.
  email: 'contato@engtirj.com.br',
  phone: '+55 21 4042-1350',
  phoneE164: '+552140421350',
  openingHours: 'Mo-Fr 08:00-18:00',
  /**
   * Serviços especializados — usados na seção de serviços, no JSON-LD
   * ProfessionalService (`hasOfferCatalog`) e nos direct-answer blocks de GEO.
   */
  services: [
    {
      slug: 'servidores-storage-cad-bim',
      title: 'Servidores e Storages para Projetos 3D / CAD / BIM',
      description:
        'Infraestrutura de servidores de arquivos e storage de alta performance (NAS/SAN/SSD) dimensionada para abrir e salvar projetos pesados de AutoCAD, Revit e BIM em rede, sem travamentos e com acesso simultâneo de toda a equipe.',
    },
    {
      slug: 'redes-canteiros-obras',
      title: 'Conectividade e Redes para Canteiros de Obras',
      description:
        'Redes cabeadas e Wi-Fi industrial robustas, link de internet redundante (fibra + 4G/5G) e acesso remoto seguro para canteiros de obras e escritórios de engenharia, garantindo upload de projetos e comunicação com a obra.',
    },
    {
      slug: 'backup-ransomware',
      title: 'Backup em Nuvem e Imunização contra Ransomware',
      description:
        'Estratégia de backup 3-2-1 com cópias imutáveis e offsite para arquivos de projetos e pranchas, detecção e contenção de ransomware e plano de continuidade para não perder anos de projetos.',
    },
    {
      slug: 'licenciamento-softwares-tecnicos',
      title: 'Gestão de Licenciamento de Softwares Técnicos',
      description:
        'Gestão de licenças Autodesk (Revit, AutoCAD, Civil 3D), Microsoft 365, plataformas BIM e softwares de cálculo, com controle de custos, conformidade e otimização de renovações.',
    },
  ],
  /** CTAs reutilizados em várias seções. */
  cta: {
    primary: 'Solicitar diagnóstico de TI gratuito',
    secondary: 'Falar no WhatsApp',
    services: 'Ver serviços especializados',
  },
} as const

export type SiteService = (typeof site.services)[number]