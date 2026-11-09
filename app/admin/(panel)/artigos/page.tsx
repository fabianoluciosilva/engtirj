import Link from 'next/link'
import { deletePostAction, setPostStatusAction } from '../../actions'
import { SubmitButton } from '@/components/admin/SubmitButton'
import { Badge, DbError, td, th } from '@/components/admin/Ui'
import * as repo from '@/lib/blog/repo'
import { formatDateTime, load } from '@/lib/blog/safe'

const STATUS_LABEL: Record<string, string> = { draft: 'Rascunho', published: 'Publicado', archived: 'Arquivado' }

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status, q } = await searchParams
  const { data, error } = await load(() => repo.listPosts())
  const term = (q ?? '').toLowerCase().trim()
  const posts = (data ?? []).filter(
    (p) => (!status || p.status === status) && (!term || p.title.toLowerCase().includes(term) || p.slug.includes(term)),
  )

  return (
    <div>
      <h1 className="font-display text-4xl font-extrabold text-white">Artigos</h1>
      {error && <div className="mt-6"><DbError message={error} /></div>}

      <form className="mt-6 flex flex-wrap items-center gap-3" role="search">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por título"
          aria-label="Buscar por título"
          className="w-64 rounded border border-line/30 bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <select name="status" defaultValue={status ?? ''} aria-label="Situação" className="rounded border border-line/30 bg-background px-3 py-2 text-sm">
          <option value="">Todas as situações</option>
          {Object.entries(STATUS_LABEL).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <SubmitButton variant="outline">Filtrar</SubmitButton>
      </form>

      <div className="plate mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="border-b border-line/20">
            <tr>
              <th className={th}>Título</th>
              <th className={th}>Situação</th>
              <th className={th}>Categoria</th>
              <th className={th}>Atualizado</th>
              <th className={th}>Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/20">
            {posts.map((p) => (
              <tr key={p.id}>
                <td className={td}>
                  <Link href={`/admin/artigos/${p.id}`} className="font-medium text-white hover:text-accent">{p.title}</Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">/{p.slug}</p>
                </td>
                <td className={td}><Badge kind={p.status}>{STATUS_LABEL[p.status]}</Badge></td>
                <td className={`${td} text-muted-foreground`}>{p.category ?? '—'}</td>
                <td className={`${td} whitespace-nowrap text-muted-foreground`}>{formatDateTime(p.updated_at)}</td>
                <td className={td}>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/admin/artigos/${p.id}`} className="rounded border border-line/40 px-3 py-1.5 text-sm hover:border-accent">Editar</Link>
                    <form action={setPostStatusAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="status" value={p.status === 'published' ? 'draft' : 'published'} />
                      <SubmitButton variant="outline" className="py-1.5">{p.status === 'published' ? 'Despublicar' : 'Publicar'}</SubmitButton>
                    </form>
                    {p.status !== 'archived' && (
                      <form action={setPostStatusAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="status" value="archived" />
                        <SubmitButton variant="outline" className="py-1.5">Arquivar</SubmitButton>
                      </form>
                    )}
                    <form action={deletePostAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <SubmitButton variant="danger" className="py-1.5" confirm={`Excluir "${p.title}"? Isso não pode ser desfeito.`}>Excluir</SubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-sm text-muted-foreground">Nenhum artigo encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
