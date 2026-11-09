import Link from 'next/link'
import { ArrowRight, Calendar, Newspaper } from 'lucide-react'
import { getLatestPosts } from '@/lib/posts'
import type { Post } from '@/lib/supabase'
import { Reveal } from '../Reveal'

function formatDate(value: string | null): string {
  if (!value) return ''
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="card-future group flex h-full flex-col p-6">
      {post.category && (
        <span className="inline-flex w-fit rounded-full border border-accent/25 bg-accent/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-accent">
          {post.category}
        </span>
      )}
      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-white">
        <Link href={`/blog/${post.slug}`} className="transition-colors group-hover:text-accent">
          {post.title}
        </Link>
      </h3>
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
          Ler artigo <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  )
}

export async function BlogPreview() {
  const posts = await getLatestPosts(3)

  return (
    <section id="blog" className="relative scroll-mt-20 py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden />
      <div className="container-page">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              <Newspaper className="h-3.5 w-3.5" />
              Blog técnico
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Conteúdo para quem{' '}
              <span className="text-gradient">vive de projetos</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Guias práticos sobre CAD/BIM, redes para obras, backup e segurança de arquivos de
              engenharia.
            </p>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-all hover:gap-2.5"
          >
            Ver todos os artigos <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>

        {posts.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={i * 100}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="mt-12">
            <div className="rounded-2xl border border-dashed border-border/70 bg-white/[0.02] p-12 text-center">
              <p className="text-sm text-muted-foreground">
                Os primeiros artigos técnicos estão sendo publicados. Acompanhe em breve.
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}