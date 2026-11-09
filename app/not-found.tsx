import Link from 'next/link'
import { Home } from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { ButtonLink } from '@/components/Button'

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden py-20 text-center">
        <div className="container-page relative">
          <p className="cota">ERRO 404</p>
          <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            Página não encontrada
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            O endereço que você tentou acessar não existe ou foi movido.
          </p>
          <ButtonLink href="/" variant="accent" size="lg" className="mt-8">
            <Home className="h-4 w-4" />
            Voltar para a página inicial
          </ButtonLink>
          <p className="mt-5">
            <Link href="/blog" className="text-sm font-medium text-accent hover:underline">
              Ir para o blog
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
