import { revalidatePath } from 'next/cache'

/** Atualiza as páginas que dependem dos posts (home, blog, sitemap e o artigo). */
export function revalidateBlog(slug?: string): void {
  revalidatePath('/')
  revalidatePath('/blog')
  revalidatePath('/sitemap.xml')
  revalidatePath('/llms.txt')
  if (slug) revalidatePath(`/blog/${slug}`)
}
