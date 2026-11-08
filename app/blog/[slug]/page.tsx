import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, ChevronRight } from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { WhatsAppFloat } from '@/components/WhatsAppButton'
import { Markdown } from '@/components/Markdown'
import { CtaWhatsApp } from '@/components/CtaWhatsApp'
import {
  JsonLd,
  blogPostingSchema,
  breadcrumbSchema,
  localBusinessSchema,
} from '@/components/JsonLd'
import { getPostBySlug, listPublishedSlugs } from '@/lib/posts'
import { SITE_URL, site } from '@/lib/site'

// ISR: cada artigo é revalidado a cada hora.
export const revalidate = 3600

/** Pré-renderiza os slugs existentes no build (novos chegam via ISR). */
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
  if (!post) return { title: 'Artigo não encontrado' }

  const url = `/blog/${post.slug}`
  return {
    title: post.title,
    description: post.meta_description ?? undefined,
    alternates: { canonical: url },
    keywords: post.category ? [post.category, 'TI para engenharia', 'Rio de Janeiro'] : undefined,
    openGraph: {
      type: 'article',
      url: `${SITE_URL}${url}`,
      title: post.title,
      description: post.meta_description ?? site.description,
      publishedTime: post.published_at ?? undefined,
      images: post.cover_url ? [{ url: post.cover_url }] : undefined,
    },
  }
}

function formatDate(value: string | null): string {
  if (!value) return ''
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={blogPostingSchema(post)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Início', url: SITE_URL },
          { name: 'Blog', url: `${SITE_URL}/blog` },
          { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
        ])}
      />

      <SiteHeader />
      <main className="container-page py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb visível */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Trilha">
            <Link href="/" className="hover:text-foreground">Início</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
          </nav>

          <header className="mt-4">
            {post.category && (
              <span className="inline-flex w-fit rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-accent">
                {post.category}
              </span>
            )}
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
              {post.title}
            </h1>
            {post.meta_description && (
              <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                {post.meta_description}
              </p>
            )}
            <div className="mt-4 flex items-center gap-3 border-b border-border pb-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.published_at)}
              </span>
              <span>·</span>
              <span>{site.name}</span>
            </div>
          </header>

          {post.cover_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_url}
              alt={post.title}
              loading="lazy"
              className="mt-6 w-full rounded-xl border border-border object-cover"
            />
          )}

          <article className="mt-6">
            <Markdown content={post.content_md ?? ''} />
          </article>

          {/* CTA ao final do artigo */}
          <div className="mt-12 rounded-xl border border-accent/20 bg-accent/5 p-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Quer resolver isso na sua empresa?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A EngTI RJ faz um diagnóstico gratuito da infraestrutura da sua empresa de engenharia
              no Rio de Janeiro.
            </p>
            <CtaWhatsApp className="mt-4" secondaryHref="/servicos" secondaryLabel="Ver serviços" />
          </div>

          <div className="mt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:gap-2.5 transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar para o blog
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  )
}
