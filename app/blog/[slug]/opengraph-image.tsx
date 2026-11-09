import { OG_SIZE, renderOgImage } from '@/lib/og'
import { getPostBySlug } from '@/lib/posts'

export const alt = 'Artigo do blog da EngTI RJ'
export const size = OG_SIZE
export const contentType = 'image/png'
export const revalidate = 3600

export default async function PostOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  return renderOgImage({
    title: post?.title ?? 'Blog da EngTI RJ',
    subtitle: post?.category ? `${post.category} — EngTI RJ` : 'EngTI RJ — TI para engenharia no Rio de Janeiro',
  })
}
