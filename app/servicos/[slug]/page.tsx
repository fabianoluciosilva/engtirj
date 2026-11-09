import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ChevronDown, ChevronRight, Check } from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { WhatsAppFloat } from '@/components/WhatsAppButton'
import { ButtonAnchor } from '@/components/Button'
import {
  JsonLd,
  graph,
  organizationNode,
  websiteNode,
  serviceNode,
  breadcrumbSchema,
  faqPageSchema,
} from '@/components/JsonLd'
import { serviceIcons } from '@/components/nav/serviceIcons'
import { getPostsByCategories } from '@/lib/posts'
import { servicesContent } from '@/lib/services-content'
import { getService, site, SITE_URL, whatsappUrl } from '@/lib/site'

export const revalidate = 3600

export function generateStaticParams() {
  return site.services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const content = servicesContent[slug]
  if (!content || !getService(slug)) return { title: 'Serviço não encontrado' }
  const url = `/servicos/${slug}`
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}${url}`,
      title: content.metaTitle,
      description: content.metaDescription,
    },
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getService(slug)
  const content = servicesContent[slug]
  if (!service || !content) notFound()

  const Icon = serviceIcons[service.icon]
  const related = await getPostsByCategories(content.relatedCategories, 3)
  const waUrl = whatsappUrl(`Olá! [engti] Quero um diagnóstico de TI sobre: ${content.whatsappTopic}.`)
  const pageUrl = `${SITE_URL}/servicos/${slug}`

  return (
    <>
      <JsonLd data={graph(organizationNode(), websiteNode(), serviceNode(service))} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Início', url: SITE_URL },
          { name: 'Serviços', url: `${SITE_URL}/#servicos` },
          { name: service.title, url: pageUrl },
        ])}
      />
      <JsonLd data={faqPageSchema(content.faq)} />

      <SiteHeader />
      <main>
        <section className="border-b border-line/20">
          <div className="container-page py-14 lg:py-20">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Trilha">
              <Link href="/" className="hover:text-white">Início</Link>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              <Link href="/#servicos" className="hover:text-white">Serviços</Link>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              <span className="text-foreground">{service.title}</span>
            </nav>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
              <div>
                <Icon className="h-9 w-9 text-line" aria-hidden />
                <h1 className="mt-5 font-display text-5xl font-extrabold leading-[0.98] tracking-tight text-white sm:text-6xl">
                  {content.h1}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  {content.intro}
                </p>
              </div>

              <aside className="plate h-fit self-end p-6">
                <p className="font-display text-2xl font-bold leading-tight text-white">
                  Quer saber como isso fica no seu escritório?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Conte o que está travando e fazemos um diagnóstico gratuito.
                </p>
                <ButtonAnchor
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="accent"
                  size="lg"
                  className="mt-5 w-full"
                >
                  {site.cta.primary}
                </ButtonAnchor>
              </aside>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="container-page">
            <h2 className="max-w-2xl font-display text-4xl font-extrabold leading-[1] tracking-tight text-white sm:text-5xl">
              O que costuma dar errado
            </h2>
            <ul className="mt-10 grid gap-px bg-line/20 md:grid-cols-3">
              {content.problems.map((p) => (
                <li key={p.title} className="bg-background p-7">
                  <h3 className="font-display text-2xl font-bold leading-tight text-white">{p.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-y border-line/20 bg-surface/40 py-16 lg:py-20">
          <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
            <h2 className="font-display text-4xl font-extrabold leading-[1] tracking-tight text-white sm:text-5xl">
              O que entregamos
            </h2>
            <ul className="divide-y divide-line/20 border-y border-line/20">
              {content.deliverables.map((item) => (
                <li key={item} className="flex gap-3.5 py-4 text-[15px] leading-relaxed text-foreground">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-line" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="container-page">
            <h2 className="max-w-2xl font-display text-4xl font-extrabold leading-[1] tracking-tight text-white sm:text-5xl">
              Como trabalhamos
            </h2>
            <ol className="mt-10 grid gap-px bg-line/20 md:grid-cols-3">
              {content.howWeWork.map((step, i) => (
                <li key={step.title} className="bg-background p-7">
                  <span className="font-display text-5xl font-extrabold leading-none text-line/40">{i + 1}</span>
                  <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-white">{step.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-line/20 py-16 lg:py-20">
          <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
            <div>
              <h2 className="font-display text-4xl font-extrabold leading-[1] tracking-tight text-white sm:text-5xl">
                Perguntas sobre este serviço
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {site.coverage}. Atendemos {site.regions.slice(0, -1).join(', ')} e o {site.regions.at(-1)}.
              </p>
            </div>
            <div className="divide-y divide-line/20 border-y border-line/20">
              {content.faq.map((item) => (
                <details key={item.question} className="group [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5">
                    <h3 className="font-display text-xl font-bold leading-snug text-foreground group-open:text-white">
                      {item.question}
                    </h3>
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-line transition-transform group-open:rotate-180 group-open:text-accent"
                      aria-hidden
                    />
                  </summary>
                  <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="border-t border-line/20 py-16 lg:py-20">
            <div className="container-page">
              <h2 className="font-display text-4xl font-extrabold leading-[1] tracking-tight text-white sm:text-5xl">
                Leia também
              </h2>
              <ul className="mt-10 grid gap-6 md:grid-cols-3">
                {related.map((post) => (
                  <li key={post.id}>
                    <Link href={`/blog/${post.slug}`} className="plate plate-hover group block h-full p-6">
                      <span className="font-display text-2xl font-bold leading-tight text-white group-hover:text-accent">
                        {post.title}
                      </span>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                        Ler artigo <ArrowRight className="h-4 w-4" aria-hidden />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="border-t border-line/20 bg-surface/40 py-16 lg:py-20">
          <div className="container-page flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-xl font-display text-4xl font-extrabold leading-[1] tracking-tight text-white">
              Vamos olhar a sua infraestrutura?
            </p>
            <ButtonAnchor href={waUrl} target="_blank" rel="noopener noreferrer" variant="accent" size="lg">
              {site.cta.primary}
            </ButtonAnchor>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  )
}
