import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { listPublishedSlugs, getLatestPosts } from '@/lib/posts'

// Sitemap dinâmico: home + /blog + cada artigo publicado no Supabase.
// Revalidado a cada hora para captar novos posts do cron semanal.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  const slugs = await listPublishedSlugs()
  if (slugs.length === 0) return staticRoutes

  // Busca datas de publicação para o lastModified dos artigos.
  const posts = await getLatestPosts(slugs.length)
  const publishedBySlug = new Map(posts.map((p) => [p.slug, p.published_at]))

  const postRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: publishedBySlug.get(slug) ? new Date(publishedBySlug.get(slug)!) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...postRoutes]
}
