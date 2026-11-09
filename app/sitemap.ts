import type { MetadataRoute } from 'next'
import { SITE_URL, SITE_UPDATED_AT, site } from '@/lib/site'
import { listPublishedSlugs, getLatestPosts } from '@/lib/posts'

// Sitemap dinâmico: home, serviços, /blog e cada artigo publicado.
// Revalidado a cada hora para captar novos posts do cron semanal.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const updated = new Date(SITE_UPDATED_AT)

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: updated, changeFrequency: 'weekly', priority: 1 },
    ...site.services.map((service) => ({
      url: `${SITE_URL}/servicos/${service.slug}`,
      lastModified: updated,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ]

  const slugs = await listPublishedSlugs()
  const posts = slugs.length > 0 ? await getLatestPosts(slugs.length) : []
  const publishedBySlug = new Map(posts.map((p) => [p.slug, p.published_at]))

  // /blog muda quando sai um post novo: usa a data do post mais recente.
  const latest = posts.map((p) => p.published_at).find(Boolean)
  const blogRoute: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/blog`,
      lastModified: latest ? new Date(latest) : updated,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  const postRoutes: MetadataRoute.Sitemap = slugs.map((slug) => {
    const published = publishedBySlug.get(slug)
    return {
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: published ? new Date(published) : updated,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }
  })

  return [...staticRoutes, ...blogRoute, ...postRoutes]
}
