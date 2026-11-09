import Link from 'next/link'
import { logoutAction } from '../actions'
import { requireAdmin } from '@/lib/admin-session'
import { SubmitButton } from '@/components/admin/SubmitButton'

export const dynamic = 'force-dynamic'

const NAV = [
  { href: '/admin', label: 'Início' },
  { href: '/admin/artigos', label: 'Artigos' },
  { href: '/admin/temas', label: 'Temas' },
  { href: '/admin/execucoes', label: 'Execuções' },
]

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="min-h-screen">
      <header className="border-b border-line/20 bg-background/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3">
          <Link href="/admin" className="font-display text-2xl font-extrabold text-white">
            Painel <span className="text-accent">EngTI RJ</span>
          </Link>
          <nav aria-label="Painel" className="flex flex-1 flex-wrap items-center gap-1">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="rounded px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-line/10 hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/blog" target="_blank" className="text-sm text-muted-foreground hover:text-white">
            Ver o blog
          </Link>
          <form action={logoutAction}>
            <SubmitButton variant="outline" className="py-1.5">Sair</SubmitButton>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  )
}
