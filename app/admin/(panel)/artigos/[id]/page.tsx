import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PostEditor } from '@/components/admin/PostEditor'
import { DbError, Notice } from '@/components/admin/Ui'
import * as repo from '@/lib/blog/repo'
import { load } from '@/lib/blog/safe'

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ ok?: string; erro?: string }>
}) {
  const { id } = await params
  const { ok, erro } = await searchParams
  const { data: post, error } = await load(() => repo.getPostById(id))
  if (error) return <DbError message={error} />
  if (!post) notFound()

  return (
    <div>
      <Link href="/admin/artigos" className="text-sm text-muted-foreground hover:text-white">← Voltar para os artigos</Link>
      <h1 className="mt-3 font-display text-4xl font-extrabold text-white">Editar artigo</h1>
      {ok && <div className="mt-6"><Notice>Alterações salvas.</Notice></div>}
      {erro && <div className="mt-6"><Notice tone="warn">Preencha título e texto.</Notice></div>}
      <div className="mt-8">
        <PostEditor post={post} />
      </div>
    </div>
  )
}
