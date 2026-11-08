import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { getLatestPosts } from '@/lib/posts'
import type { Post } from '@/lib/supabase'

function formatDate(value: string | null): string {
  if (!value) return ''
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-card transition-colors hover:border-accent/40">
      {post.category && (
        <span className="inline-flex w-fit rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-accent">
          {post.category}
        </span>
      )}
      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-foreground">
        <Link href={`/blog/${post.slug}`} className="hover:text-accent">
          {post.title}
        </Link>
      </h3>
      {post.meta_description && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.meta_description}
        </p>
      )}
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(post.published_at)}
        </span>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 font-semibold text-accent hover:gap-2 transition-all"
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
    <section id="blog" className="scroll-mt-20 py-16 lg:py-24">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wide text-accent">Blog técnico</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Conteúdo para quem vive de projetos
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Guias práticos sobre CAD/BIM, redes para obras, backup e segurança de arquivos de
              engenharia.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:gap-2.5 transition-all"
          >
            Ver todos os artigos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Os primeiros artigos técnicos estão sendo publicados. Acompanhe em breve.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
