import Link from 'next/link'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { ButtonLink } from '@/components/Button'

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-display text-6xl font-bold text-accent">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">
          Página não encontrada
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          O endereço que você tentou acessar não existe ou foi movido.
        </p>
        <ButtonLink href="/" variant="primary" size="lg" className="mt-6">
          Voltar para a página inicial
        </ButtonLink>
        <p className="mt-4">
          <Link href="/blog" className="text-sm font-medium text-accent hover:underline">
            Ir para o blog técnico
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  )
}
