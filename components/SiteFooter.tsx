import Link from 'next/link'
import { MapPin, Mail, Phone, MessageCircle } from 'lucide-react'
import { Logo } from './Logo'
import { site, whatsappUrl } from '@/lib/site'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-24 border-t border-line/20 bg-surface/40">
      <div className="container-page grid gap-10 py-16 md:grid-cols-[1.2fr_1.4fr_1fr_1.2fr]">
        <div>
          <Logo variant="dark" height={40} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            TI para empresas de engenharia, arquitetura e construção civil do estado do Rio de
            Janeiro.
          </p>
        </div>

        <div>
          <h3 className="font-display text-xl font-bold text-white">Serviços</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {site.services.map((service) => (
              <li key={service.slug}>
                <Link href={`/servicos/${service.slug}`} className="transition-colors hover:text-white">
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xl font-bold text-white">Navegação</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><Link href="/#como-funciona" className="transition-colors hover:text-white">Como funciona</Link></li>
            <li><Link href="/#faq" className="transition-colors hover:text-white">Perguntas frequentes</Link></li>
            <li><Link href="/#quem-somos" className="transition-colors hover:text-white">Quem somos</Link></li>
            <li><Link href="/blog" className="transition-colors hover:text-white">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xl font-bold text-white">Contato</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-line" aria-hidden />
                WhatsApp comercial
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-line" aria-hidden />
              <a href={`tel:${site.phoneE164}`} className="transition-colors hover:text-white">
                {site.phone}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-line" aria-hidden />
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-white">
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-line" aria-hidden />
              <span>{site.coverage}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line/20">
        <div className="container-page py-6 text-xs text-muted-foreground">
          <p>© {year} {site.legalName}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
