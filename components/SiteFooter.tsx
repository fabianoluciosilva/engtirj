import Link from 'next/link'
import { MapPin, Mail, Phone, MessageCircle } from 'lucide-react'
import { Logo } from './Logo'
import { site, whatsappUrl } from '@/lib/site'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border/60">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-accent/[0.08] blur-[120px]" aria-hidden />

      <div className="container-page relative grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo variant="dark" height={40} />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            TI especializada, exclusivamente, para empresas de engenharia, arquitetura e construção
            civil no estado do Rio de Janeiro.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Serviços</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {site.services.map((service) => (
              <li key={service.slug}>
                <Link href="/#servicos" className="transition-colors hover:text-accent">
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Navegação</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><Link href="/#dores" className="transition-colors hover:text-accent">Desafios do setor</Link></li>
            <li><Link href="/#servicos" className="transition-colors hover:text-accent">Serviços</Link></li>
            <li><Link href="/#faq" className="transition-colors hover:text-accent">Perguntas frequentes</Link></li>
            <li><Link href="/blog" className="transition-colors hover:text-accent">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Contato</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-accent"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-accent" />
                WhatsApp comercial
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <a href={`tel:${site.phoneE164}`} className="transition-colors hover:text-accent">
                {site.phone}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-accent">
                {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{site.coverage}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} {site.legalName}. Todos os direitos reservados.</p>
          <p>Atendimento no estado do Rio de Janeiro · Remoto e in-loco</p>
        </div>
      </div>
    </footer>
  )
}