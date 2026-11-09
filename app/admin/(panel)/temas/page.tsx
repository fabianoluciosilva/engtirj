import { addTopicAction, researchTopicsAction, setTopicPriorityAction, setTopicStatusAction } from '../../actions'
import { SubmitButton } from '@/components/admin/SubmitButton'
import { Badge, DbError, Notice, td, th } from '@/components/admin/Ui'
import { CATEGORIES } from '@/lib/blog/curated-topics'
import * as repo from '@/lib/blog/repo'
import { load } from '@/lib/blog/safe'

// A pesquisa de novos temas faz buscas na web e uma chamada à IA.
export const maxDuration = 120

const STATUS_LABEL: Record<string, string> = { pending: 'Na fila', used: 'Usado', skipped: 'Ignorado' }
const field = 'mt-1.5 w-full rounded border border-line/30 bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none'

export default async function TopicsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erro?: string; novos?: string }>
}) {
  const { ok, erro, novos } = await searchParams
  const { data, error } = await load(() => repo.listTopics())
  const topics = data ?? []

  return (
    <div>
      <h1 className="font-display text-4xl font-extrabold text-white">Temas</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        A fila de assuntos dos próximos artigos. O sistema escolhe o tema da categoria menos publicada; temas com
        prioridade maior saem antes. Quando a fila fica curta, ele pesquisa novos temas sozinho.
      </p>

      {error && <div className="mt-6"><DbError message={error} /></div>}
      {ok && <div className="mt-6"><Notice>Tema adicionado.</Notice></div>}
      {novos !== undefined && <div className="mt-6"><Notice>{novos} novo(s) tema(s) adicionado(s) pela pesquisa.</Notice></div>}
      {erro && <div className="mt-6"><Notice tone="warn">{erro === 'campos' ? 'Informe o título (mínimo 10 caracteres) e a categoria.' : erro}</Notice></div>}

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <form action={addTopicAction} className="plate p-6">
          <h2 className="font-display text-2xl font-bold text-white">Adicionar tema</h2>
          <label className="mt-4 block text-sm font-medium">
            Título
            <input name="title" required minLength={10} className={field} placeholder="Ex.: Como proteger o servidor de projetos contra queda de energia" />
          </label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Categoria
              <select name="category" required className={field}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium">
              Palavras-chave (vírgula)
              <input name="keywords" className={field} />
            </label>
          </div>
          <label className="mt-4 block text-sm font-medium">
            Ângulo do artigo (opcional)
            <textarea name="angle" rows={2} className={field} />
          </label>
          <SubmitButton pending="Adicionando..." className="mt-5">Adicionar à fila</SubmitButton>
        </form>

        <form action={researchTopicsAction} className="plate p-6">
          <h2 className="font-display text-2xl font-bold text-white">Pesquisar novos temas</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Busca problemas e novidades atuais na web e propõe até 10 temas novos, sem repetir os existentes.
          </p>
          <SubmitButton pending="Pesquisando..." variant="outline" className="mt-5">Pesquisar agora</SubmitButton>
        </form>
      </div>

      <div className="plate mt-8 overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-line/20">
            <tr>
              <th className={th}>Tema</th>
              <th className={th}>Categoria</th>
              <th className={th}>Origem</th>
              <th className={th}>Situação</th>
              <th className={th}>Prioridade</th>
              <th className={th}>Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/20">
            {topics.map((t) => (
              <tr key={t.id}>
                <td className={`${td} max-w-md font-medium text-white`}>{t.title}</td>
                <td className={`${td} text-muted-foreground`}>{t.category}</td>
                <td className={`${td} text-muted-foreground`}>{t.origin === 'curated' ? 'Curado' : 'Pesquisa'}</td>
                <td className={td}><Badge kind={t.status}>{STATUS_LABEL[t.status]}</Badge></td>
                <td className={td}>
                  {t.status === 'pending' ? (
                    <div className="flex items-center gap-1.5">
                      <form action={setTopicPriorityAction}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="delta" value="-1" />
                        <button aria-label="Diminuir prioridade" className="h-7 w-7 rounded border border-line/40 hover:border-accent">−</button>
                      </form>
                      <span className="w-6 text-center">{t.priority}</span>
                      <form action={setTopicPriorityAction}>
                        <input type="hidden" name="id" value={t.id} />
                        <input type="hidden" name="delta" value="1" />
                        <button aria-label="Aumentar prioridade" className="h-7 w-7 rounded border border-line/40 hover:border-accent">+</button>
                      </form>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className={td}>
                  {t.status === 'pending' && (
                    <form action={setTopicStatusAction}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="status" value="skipped" />
                      <SubmitButton variant="outline" className="py-1.5">Ignorar</SubmitButton>
                    </form>
                  )}
                  {t.status === 'skipped' && (
                    <form action={setTopicStatusAction}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="status" value="pending" />
                      <SubmitButton variant="outline" className="py-1.5">Voltar para a fila</SubmitButton>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {topics.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  Nenhum tema ainda. Rode <code className="font-mono">npm run db:seed</code> para carregar os temas curados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
