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
        <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-70" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-engineering-grid opacity-40" aria-hidden />
        <div className="container-page relative">
          <p className="font-display text-7xl font-extrabold tracking-tight text-gradient sm:text-8xl">404</p>
          <h1 className="mt-4 font-display text-2xl font-semibold text-white sm:text-3xl">
            Página não encontrada
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            O endereço que você tentou acessar não existe ou foi movido.
          </p>
          <ButtonLink href="/" variant="accent" size="lg" className="mt-8">
            <Home className="h-4 w-4" />
            Voltar para a página inicial
          </ButtonLink>
          <p className="mt-5">
            <Link href="/blog" className="text-sm font-medium text-accent hover:underline">
              Ir para o blog técnico
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}