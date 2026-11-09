import type { Metadata, Viewport } from 'next'
import { Geist, Sora, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { site, SITE_URL } from '@/lib/site'

const geist = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

// Sora — display geométrica, transmite precisão técnica nos títulos.
const sora = Sora({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
})

const mono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
})

// Metadados globais com foco regional (RJ) e termos de nicho (SEO/GEO).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'EngTI RJ — Suporte de TI para Engenharia no Rio de Janeiro',
    template: '%s | EngTI RJ',
  },
  description: site.description,
  keywords: [
    'suporte de TI para empresas de engenharia no Rio de Janeiro',
    'servidor para AutoCAD e Revit RJ',
    'TI para obras e construtoras',
    'storage NAS BIM Rio de Janeiro',
    'backup contra ransomware engenharia',
    'rede para canteiro de obras RJ',
    'TI para arquitetura e construção civil RJ',
    'licenciamento Autodesk Revit RJ',
  ],
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  publisher: site.name,
  category: 'Tecnologia',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: site.name,
    title: 'EngTI RJ — TI especializada para engenharia, arquitetura e construção civil',
    description: site.description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EngTI RJ — TI especializada para engenharia no Rio de Janeiro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EngTI RJ — TI especializada para engenharia no Rio de Janeiro',
    description: site.description,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  // Ajuda buscadores/IAs a associar o conteúdo ao recorte regional.
  other: {
    'geo.region': 'BR-RJ',
    'geo.placename': 'Rio de Janeiro',
    'geo.position': `${site.geo.latitude};${site.geo.longitude}`,
    ICBM: `${site.geo.latitude}, ${site.geo.longitude}`,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#060A16',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${sora.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
