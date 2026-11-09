import { notFound } from 'next/navigation'
import { OG_SIZE, renderOgImage } from '@/lib/og'
import { getService, site } from '@/lib/site'

export const alt = 'Serviço de TI da EngTI RJ'
export const size = OG_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return site.services.map((s) => ({ slug: s.slug }))
}

export default async function ServiceOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()
  return renderOgImage({ title: service.title, subtitle: 'EngTI RJ — TI para engenharia no Rio de Janeiro' })
}
