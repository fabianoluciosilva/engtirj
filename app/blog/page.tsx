import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { WhatsAppFloat } from '@/components/WhatsAppButton'
import { JsonLd, breadcrumbSchema, localBusinessSchema } from '@/components/JsonLd'
import { listPublishedPosts, POSTS_PAGE_SIZE } from '@/lib/posts'
import { SITE_URL } from '@/lib/site'

// ISR: regenera a listagem a cada 30 minutos (capta posts do cron semanal).
export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Blog técnico — TI para engenharia, CAD/BIM e segurança de projetos',
  description:
    'Artigos sobre TI para engenharia: projetos AutoCAD, Revit e BIM, storage NAS/SAN, redes para canteiros de obras, backup e proteção contra ransomware para escritórios de engenharia no Rio de Janeiro.',
  alternates: { canonical: '/blog' },
}

function formatDate(value: string | null): string {
  if (!value) return ''
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1)
  const { posts, total } = await listPublishedPosts({ page })
  const totalPages = Math.max(1, Math.ceil(total / POSTS_PAGE_SIZE))

  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Início', url: SITE_URL },
          { name: 'Blog', url: `${SITE_URL}/blog` },
        ])}
      />

      <SiteHeader />
      <main className="container-page py-12 lg:py-16">
        <header className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">Blog técnico</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Conteúdo de TI para engenharia, arquitetura e construção civil
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Guias práticos sobre projetos CAD/BIM, storage de alta performance, redes para canteiros
            de obras e proteção de arquivos de projeto.
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.id}
                className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-card transition-colors hover:border-accent/40"
              >
                {post.category && (
                  <span className="inline-flex w-fit rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-accent">
                    {post.category}
                  </span>
                )}
                <h2 className="mt-3 font-display text-lg font-semibold leading-snug text-foreground">
                  <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                    {post.title}
                  </Link>
                </h2>
                {post.meta_description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {post.meta_description}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="mt-3 inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(post.published_at)}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-3 inline-flex items-center gap-1 font-semibold text-accent hover:gap-2 transition-all"
                  >
                    Ler <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum artigo publicado ainda. Os conteúdos técnicos são publicados semanalmente.
            </p>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Paginação">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={p === 1 ? '/blog' : `/blog?page=${p}`}
                aria-current={p === page ? 'page' : undefined}
                className={
                  p === page
                    ? 'inline-flex h-9 min-w-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground'
                    : 'inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-border px-3 text-sm font-medium text-foreground hover:bg-muted'
                }
              >
                {p}
              </Link>
            ))}
          </nav>
        )}
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  )
}
