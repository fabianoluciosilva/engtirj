import { site, SITE_URL, type SiteService } from '@/lib/site'
import { faq } from '@/lib/faq'

/**
 * Dados estruturados Schema.org (JSON-LD).
 * Helpers puros que devolvem objetos; o componente <JsonLd> injeta via
 * <script type="application/ld+json">. Os nós se ligam por `@id`.
 */

const LOGO_URL = `${SITE_URL}/logo-engti-rj.svg`
export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

type Node = Record<string, unknown>

/** Junta nós em um único bloco `@graph`. */
export function graph(...nodes: Node[]): Node {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.map(({ '@context': _ctx, ...rest }) => rest),
  }
}

/** Organização + negócio local de serviço, com atendimento no estado do RJ. */
export function organizationNode(): Node {
  // Endereço de rua só entra no schema se estiver preenchido.
  const hasStreet = Boolean(site.address.street && site.address.postalCode)
  const address = hasStreet
    ? {
        '@type': 'PostalAddress',
        streetAddress: site.address.street,
        addressLocality: site.address.city,
        addressRegion: site.address.region,
        postalCode: site.address.postalCode,
        addressCountry: site.address.country,
      }
    : {
        '@type': 'PostalAddress',
        addressLocality: site.address.city,
        addressRegion: site.address.region,
        addressCountry: site.address.country,
      }

  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORGANIZATION_ID,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    telephone: site.phoneE164,
    email: site.email,
    areaServed: {
      '@type': 'State',
      name: 'Rio de Janeiro',
      containedInPlace: { '@type': 'Country', name: 'Brasil' },
    },
    address,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    ...(site.social.length > 0 ? { sameAs: [...site.social] } : {}),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Serviços de TI para engenharia',
      itemListElement: site.services.map((service) => ({
        '@type': 'Offer',
        itemOffered: serviceNode(service),
      })),
    },
    knowsAbout: [
      'Servidores para AutoCAD e Revit',
      'Storage NAS e SAN para BIM',
      'Redes para canteiros de obras',
      'Backup contra ransomware',
      'Licenciamento Autodesk',
      'TI para engenharia civil',
    ],
  }
}

export function websiteNode(): Node {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: site.name,
    inLanguage: 'pt-BR',
    publisher: { '@id': ORGANIZATION_ID },
  }
}

/** Serviço prestado pela organização (usado no catálogo e nas páginas de serviço). */
export function serviceNode(service: SiteService): Node {
  return {
    '@type': 'Service',
    '@id': `${SITE_URL}/servicos/${service.slug}#service`,
    name: service.title,
    description: service.summary,
    serviceType: service.title,
    url: `${SITE_URL}/servicos/${service.slug}`,
    areaServed: { '@type': 'State', name: 'Rio de Janeiro' },
    provider: { '@id': ORGANIZATION_ID },
  }
}

/** FAQPage — habilita rich snippet de perguntas/respostas no Google. */
export function faqPageSchema(items: { question: string; answer: string }[] = faq): Node {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

/** BreadcrumbList — para /blog, /blog/[slug] e /servicos/[slug]. */
export function breadcrumbSchema(items: { name: string; url: string }[]): Node {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** BlogPosting — para a página de um artigo. */
export function blogPostingSchema(post: {
  slug: string
  title: string
  meta_description: string | null
  published_at: string | null
  cover_url: string | null
}): Node {
  const url = `${SITE_URL}/blog/${post.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.title,
    description: post.meta_description ?? undefined,
    image: post.cover_url ?? LOGO_URL,
    datePublished: post.published_at ?? undefined,
    dateModified: post.published_at ?? undefined,
    url,
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'pt-BR',
  }
}

/** Injeta um objeto JSON-LD na página. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
