import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Calendar, ChevronDown, ChevronRight, Clock, User } from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { WhatsAppFloat } from '@/components/WhatsAppButton'
import { Markdown } from '@/components/Markdown'
import { CtaWhatsApp } from '@/components/CtaWhatsApp'
import { JsonLd, blogPostingSchema, breadcrumbSchema, faqPageSchema, graph, organizationNode, websiteNode } from '@/components/JsonLd'
import { getPostBySlug, getRelatedPosts, listPublishedSlugs } from '@/lib/posts'
import { SITE_URL, site } from '@/lib/site'

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await listPublishedSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: ' Artigo não encontrado' }
  const url = `/blog/${post.slug}`
  return {
    title: post.title,
    description: post.meta_description ?? undefined,
    alternates: { canonical: url },
    keywords: post.keywords?.length ? post.keywords : post.category ? [post.category, 'TI para engenharia', 'Rio de Janeiro'] : undefined,
    openGraph: {
      type: 'article',
      url: `${SITE_URL}${url}`,
      title: post.title,
      description: post.meta_description ?? site.description,
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      images: post.cover_url ? [{ url: post.cover_url }] : undefined,
    },
  }
}

function formatDate(value: string | null): string {
  if (!value) return ''
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()
  const related = await getRelatedPosts(post, 3)
  const sources = post.sources ?? []
  const faq = post.faq ?? []

  return (
    <>
      <JsonLd data={graph(organizationNode(), websiteNode())} />
      <JsonLd data={blogPostingSchema(post)} />
      {faq.length > 0 && <JsonLd data={faqPageSchema(faq)} />}
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Início', url: SITE_URL },
          { name: 'Blog', url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
        ])}
      />

      <SiteHeader />
      <main className="relative">
        <div className="container-page relative py-12 lg:py-16">
          <div className="mx-auto max-w-3xl">
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Trilha">
              <Link href="/" className="transition-colors hover:text-accent">Início</Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href="/blog" className="transition-colors hover:text-accent">Blog</Link>
            </nav>

            <header className="mt-5">
              {post.category && (
                <span className="cota w-fit">{post.category}</span>
              )}
              <h1 className="mt-3 font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                {post.title}
              </h1>
              {post.meta_description && (
                <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{post.meta_description}</p>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border/60 pb-5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-accent" />
                  {formatDate(post.published_at)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4 text-accent" />
                  {site.name}
                </span>
                {post.reading_minutes ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-accent" />
                    {post.reading_minutes} min de leitura
                  </span>
                ) : null}
              </div>
            </header>

            {post.cover_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.cover_url}
                alt={post.title}
                loading="lazy"
                className="mt-6 w-full rounded border border-line/20 object-cover"
              />
            )}

            <article className="prose-invert mt-8">
              <Markdown content={post.content_md ?? ''} />
            </article>

            {faq.length > 0 && (
              <section className="mt-12" aria-labelledby="faq-post">
                <h2 id="faq-post" className="font-display text-3xl font-bold text-white">Perguntas frequentes</h2>
                <div className="mt-4 divide-y divide-line/20 border-y border-line/20">
                  {faq.map((item) => (
                    <details key={item.question} className="group [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4">
                        <h3 className="font-display text-xl font-bold text-foreground group-open:text-white">{item.question}</h3>
                        <ChevronDown className="h-5 w-5 shrink-0 text-line transition-transform group-open:rotate-180" aria-hidden />
                      </summary>
                      <p className="pb-5 text-[15px] leading-relaxed text-muted-foreground">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {sources.length > 0 && (
              <section className="mt-12" aria-labelledby="fontes-post">
                <h2 id="fontes-post" className="font-display text-3xl font-bold text-white">Fontes</h2>
                <ul className="mt-4 space-y-2 text-sm">
                  {sources.map((src) => (
                    <li key={src.url}>
                      <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-foreground underline decoration-line/40 underline-offset-4 hover:text-accent">
                        {src.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="plate mt-12 p-7">
              <h2 className="font-display text-xl font-semibold text-white">
                Quer resolver isso na sua empresa?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                A EngTI RJ faz um diagnóstico gratuito da infraestrutura da sua empresa de engenharia
                no Rio de Janeiro.
              </p>
              <CtaWhatsApp className="mt-5" secondaryHref="/#servicos" secondaryLabel="Ver serviços" />
            </div>

            {related.length > 0 && (
              <section className="mt-12" aria-labelledby="relacionados-post">
                <h2 id="relacionados-post" className="font-display text-3xl font-bold text-white">Leia também</h2>
                <ul className="mt-4 grid gap-4 sm:grid-cols-3">
                  {related.map((r) => (
                    <li key={r.id}>
                      <Link href={`/blog/${r.slug}`} className="plate plate-hover group block h-full p-4">
                        <span className="font-display text-lg font-bold leading-snug text-white group-hover:text-accent">{r.title}</span>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">Ler artigo <ArrowRight className="h-4 w-4" aria-hidden /></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="mt-8">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-all hover:gap-2.5"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Voltar para o blog
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  )
}