import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { Hero } from '@/components/sections/Hero'
import { PainPoints } from '@/components/sections/PainPoints'
import { Services } from '@/components/sections/Services'
import { GeoAnswers } from '@/components/sections/GeoAnswers'
import { Faq } from '@/components/sections/Faq'
import { BlogPreview } from '@/components/sections/BlogPreview'
import { WhatsAppFloat } from '@/components/WhatsAppButton'
import { JsonLd, localBusinessSchema, faqPageSchema } from '@/components/JsonLd'

export default function HomePage() {
  return (
    <>
      {/* Dados estruturados globais da landing */}
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={faqPageSchema()} />

      <SiteHeader />
      <main>
        <Hero />
        <PainPoints />
        <Services />
        <GeoAnswers />
        <Faq />
        <BlogPreview />
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  )
}
