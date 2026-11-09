import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { getLatestPosts } from '@/lib/posts'
import type { Post } from '@/lib/supabase'
import { Reveal } from '../Reveal'

function formatDate(value: string | null): string {
  if (!value) return ''
  return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function PostCard({ post }: { post: Post }) {
  return (
    <article className="plate plate-hover group flex h-full flex-col p-6">
      {post.category && <span className="cota w-fit">{post.category}</span>}
      <h3 className="mt-3 font-display text-2xl font-bold leading-tight text-white">
        <Link href={`/blog/${post.slug}`} className="group-hover:text-accent">
          {post.title}
        </Link>
      </h3>
      {post.meta_description && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.meta_description}
        </p>
      )}
      <div className="mt-auto flex items-center justify-between border-t border-line/20 pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" aria-hidden />
          {formatDate(post.published_at)}
        </span>
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 font-semibold text-foreground group-hover:text-accent"
        >
          Ler artigo <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </article>
  )
}

export async function BlogPreview() {
  const posts = await getLatestPosts(3)
  if (posts.length === 0) return null

  return (
    <section id="blog" className="relative scroll-mt-20 border-t border-line/20 py-20 lg:py-28">
      <div className="container-page">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-xl font-display text-4xl font-extrabold leading-[1] tracking-tight text-white sm:text-5xl">
            No blog, uma solução por semana
          </h2>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-accent"
          >
            Ver todos os artigos <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={i * 80}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
