import { site, SITE_URL } from '@/lib/site'
import { faq } from '@/lib/faq'

/**
 * Dados estruturados Schema.org (JSON-LD).
 * Helpers puros que devolvem objetos; o componente <JsonLd> injeta via
 * <script type="application/ld+json">.
 */

const LOGO_URL = `${SITE_URL}/logo-engti-rj.svg`

/** LocalBusiness + ProfessionalService completos, com foco regional (RJ). */
export function localBusinessSchema() {
  // Endereço de rua só entra no schema se estiver preenchido — evita emitir
  // streetAddress/postalCode vazios. Atendimento é remoto + in-loco em todo RJ.
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
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': `${SITE_URL}/#organization`,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    telephone: site.phoneE164,
    email: site.email,
    priceRange: '$$',
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
    sameAs: [] as string[],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Serviços de TI especializada para engenharia',
      itemListElement: site.services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.summary,
          serviceType: service.title,
          areaServed: site.areaServed,
          provider: { '@id': `${SITE_URL}/#organization` },
        },
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

/** FAQPage — habilita rich snippet de perguntas/respostas no Google. */
export function faqPageSchema(items: { question: string; answer: string }[] = faq) {
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

/** BreadcrumbList — para /blog e /blog/[slug]. */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
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
}) {
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
    author: { '@type': 'Organization', name: site.name, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
    inLanguage: 'pt-BR',
  }
}

/** Injeta um objeto JSON-LD na página. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}