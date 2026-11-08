import Link from 'next/link'
import { MapPin, Mail, Phone, MessageCircle } from 'lucide-react'
import { Logo } from './Logo'
import { site, whatsappUrl } from '@/lib/site'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo variant="dark" height={40} />
          <p className="mt-4 max-w-xs text-sm text-primary-foreground/70">
            TI especializada, exclusivamente, para empresas de engenharia, arquitetura e construção
            civil no estado do Rio de Janeiro.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/90">
            Serviços
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/70">
            {site.services.map((service) => (
              <li key={service.slug}>
                <Link href="/#servicos" className="hover:text-accent-soft">
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/90">
            Navegação
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/70">
            <li><Link href="/#dores" className="hover:text-accent-soft">Desafios do setor</Link></li>
            <li><Link href="/#servicos" className="hover:text-accent-soft">Serviços</Link></li>
            <li><Link href="/#faq" className="hover:text-accent-soft">Perguntas frequentes</Link></li>
            <li><Link href="/blog" className="hover:text-accent-soft">Blog</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/90">
            Contato
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70">
            <li>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-accent-soft"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                WhatsApp comercial
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <a href={`tel:${site.phone.replace(/[^\d+]/g, '')}`} className="hover:text-accent-soft">
                {site.phone}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <a href={`mailto:${site.email}`} className="hover:text-accent-soft">
                {site.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>
                {site.address.city} / {site.address.region} — atendimento em todo o RJ
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-primary-foreground/60 sm:flex-row">
          <p>
            © {year} {site.legalName}. Todos os direitos reservados.
          </p>
          <p>
            CNPJ e demais dados corporativos sob consulta · Atendimento no estado do Rio de Janeiro
          </p>
        </div>
      </div>
    </footer>
  )
}
