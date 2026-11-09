'use client'

import { useState } from 'react'
import { Markdown } from '@/components/Markdown'
import { SubmitButton } from './SubmitButton'
import { savePostAction } from '@/app/admin/actions'
import { CATEGORIES } from '@/lib/blog/curated-topics'
import type { Post } from '@/lib/supabase'

const field = 'mt-1.5 w-full rounded border border-line/30 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none'
const label = 'block text-sm font-medium text-foreground'

/** Editor de artigo: formulário à esquerda, pré-visualização do Markdown à direita. */
export function PostEditor({ post }: { post: Post }) {
  const [content, setContent] = useState(post.content_md ?? '')
  const categories = Array.from(new Set<string>([...CATEGORIES, ...(post.category ? [post.category] : [])]))

  return (
    <form action={savePostAction} className="grid gap-8 xl:grid-cols-2">
      <input type="hidden" name="id" value={post.id} />

      <div className="space-y-5">
        <label className={label}>
          Título
          <input name="title" defaultValue={post.title} required className={field} />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={label}>
            Endereço (slug)
            <input name="slug" defaultValue={post.slug} required className={field} />
          </label>
          <label className={label}>
            Categoria
            <select name="category" defaultValue={post.category ?? ''} className={field}>
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <label className={label}>
          Descrição para o Google (até 160 caracteres)
          <textarea name="meta_description" defaultValue={post.meta_description ?? ''} rows={2} maxLength={200} className={field} />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={label}>
            Situação
            <select name="status" defaultValue={post.status} className={field}>
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
              <option value="archived">Arquivado</option>
            </select>
          </label>
          <label className={label}>
            Imagem de capa (URL, opcional)
            <input name="cover_url" defaultValue={post.cover_url ?? ''} className={field} placeholder="https://" />
          </label>
        </div>
        <label className={label}>
          Palavras-chave (separadas por vírgula)
          <input name="keywords" defaultValue={post.keywords.join(', ')} className={field} />
        </label>
        <label className={label}>
          Fontes (uma por linha: Título | URL)
          <textarea name="sources" defaultValue={post.sources.map((s) => `${s.title} | ${s.url}`).join('\n')} rows={4} className={`${field} font-mono`} />
        </label>
        <label className={label}>
          Perguntas frequentes (uma por linha: Pergunta | Resposta)
          <textarea name="faq" defaultValue={post.faq.map((f) => `${f.question} | ${f.answer}`).join('\n')} rows={4} className={`${field} font-mono`} />
        </label>
        <label className={label}>
          Texto (Markdown)
          <textarea
            name="content_md"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={22}
            className={`${field} font-mono leading-relaxed`}
          />
        </label>

        <SubmitButton pending="Salvando...">Salvar alterações</SubmitButton>
      </div>

      <div>
        <p className="text-sm font-medium text-muted-foreground">Pré-visualização</p>
        <div className="plate mt-1.5 p-6">
          <h2 className="font-display text-3xl font-bold leading-tight text-white">{post.title}</h2>
          <div className="mt-5">
            <Markdown content={content} />
          </div>
        </div>
      </div>
    </form>
  )
}
