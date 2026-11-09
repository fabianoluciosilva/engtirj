import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { WhatsAppFloat } from '@/components/WhatsAppButton'
import { JsonLd, breadcrumbSchema, localBusinessSchema } from '@/components/JsonLd'
import { listPublishedPosts, POSTS_PAGE_SIZE } from '@/lib/posts'
import { SITE_URL } from '@/lib/site'
import { Reveal } from '@/components/Reveal'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Blog técnico — TI para engenharia, CAD/BIM e segurança de projetos',
  description:
    'Artigos sobre TI para engenharia: projetos AutoCAD, Revit e BIM, storage NAS/SAN, redes para canteiros de obras, backup e proteção contra ransomware para escritórios de engenharia no Rio de Janeiro.',
  alternates: { canonical: '/blog' },
}

function formatDate(value: string | null): string {
  if (!value) return ''
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
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
      <JsonLd data={breadcrumbSchema([{ name: 'Início', url: SITE_URL }, { name: 'Blog', url: `${SITE_URL}/blog` }])} />

      <SiteHeader />
      <main className="relative">
        <div className="container-page relative py-14 lg:py-20">
          <header className="max-w-2xl">
            <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Blog de TI para engenharia, arquitetura e construção civil
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Guias práticos sobre projetos CAD/BIM, storage, redes para canteiros de obras e
              proteção de arquivos de projeto.
            </p>
          </header>

          {posts.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={i * 80}>
                  <article className="plate plate-hover group flex h-full flex-col p-6">
                    {post.category && (
                      <span className="cota w-fit">{post.category}</span>
                    )}
                    <h2 className="mt-3 font-display text-xl font-bold leading-snug text-white">
                      <Link href={`/blog/${post.slug}`} className="transition-colors group-hover:text-accent">
                        {post.title}
                      </Link>
                    </h2>
                    {post.meta_description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {post.meta_description}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-3.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(post.published_at)}
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 font-semibold text-accent transition-all hover:gap-2"
                      >
                        Ler <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded border border-dashed border-line/30 p-12 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum artigo publicado ainda. Os conteúdos técnicos são publicados semanalmente.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <nav className="mt-14 flex items-center justify-center gap-2" aria-label="Paginação">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={p === 1 ? '/blog' : `/blog?page=${p}`}
                  aria-current={p === page ? 'page' : undefined}
                  className={
                    p === page
                      ? 'inline-flex h-10 min-w-10 items-center justify-center rounded bg-accent px-3 text-sm font-semibold text-accent-foreground'
                      : 'inline-flex h-10 min-w-10 items-center justify-center rounded border border-line/30 px-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-white'
                  }
                >
                  {p}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  )
}