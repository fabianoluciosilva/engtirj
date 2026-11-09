import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { Hero } from '@/components/sections/Hero'
import { Symptoms } from '@/components/sections/Symptoms'
import { Services } from '@/components/sections/Services'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Faq } from '@/components/sections/Faq'
import { About } from '@/components/sections/About'
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
        <Symptoms />
        <Services />
        <HowItWorks />
        <Faq />
        <About />
        <BlogPreview />
      </main>
      <SiteFooter />
      <WhatsAppFloat />
    </>
  )
}
