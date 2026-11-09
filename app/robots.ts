import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// A landing é pública e deve ser indexada. Bloqueia só rotas internas de API
// e permite explicitamente os bots de IA (GEO: Perplexity, OpenAI, Gemini...).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin'],
      },
      // Bots de IA — liberados para que possam citar o conteúdo (GEO).
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
