import { loginAction } from '../actions'
import { getAdminConfig } from '@/lib/admin-auth'
import { SubmitButton } from '@/components/admin/SubmitButton'

export const dynamic = 'force-dynamic'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; s?: string }>
}) {
  const { erro, s } = await searchParams
  const configured = getAdminConfig() !== null

  const message =
    !configured || erro === 'config'
      ? 'Painel não configurado: defina ADMIN_PASSWORD (16 caracteres ou mais) e ADMIN_SESSION_SECRET (32 caracteres ou mais) nas variáveis de ambiente.'
      : erro === 'senha'
        ? 'Senha incorreta.'
        : erro === 'espera'
          ? `Muitas tentativas. Aguarde ${s ?? 'alguns'} segundos e tente de novo.`
          : null

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <form action={loginAction} className="plate w-full max-w-sm p-7">
        <h1 className="font-display text-3xl font-extrabold text-white">Painel EngTI RJ</h1>
        <p className="mt-1 text-sm text-muted-foreground">Entre para gerenciar o blog.</p>

        <label className="mt-6 block text-sm font-medium text-foreground">
          Senha
          <input
            type="password"
            name="senha"
            required
            autoFocus
            autoComplete="current-password"
            className="mt-1.5 w-full rounded border border-line/30 bg-background px-3 py-2.5 text-foreground focus:border-accent focus:outline-none"
          />
        </label>

        {message && (
          <p role="alert" className="mt-4 rounded border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm text-red-200">
            {message}
          </p>
        )}

        <SubmitButton pending="Entrando..." className="mt-6 w-full py-2.5">
          Entrar
        </SubmitButton>
      </form>
    </main>
  )
}
