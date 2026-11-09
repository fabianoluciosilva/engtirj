import { cn } from '@/lib/cn'

/**
 * Renderer de Markdown mínimo, sem dependências externas.
 * Cobre o subconjunto usado pelos posts gerados: títulos (#..###), parágrafos,
 * listas (- / *), negrito (**), itálico (*), código inline (`), links [txt](url),
 * blockquote (>) e separador (---). Conteúdo é HTML-escapado antes de qualquer
 * transformação, então não há injeção de HTML arbitrário.
 */

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function inline(text: string): string {
  let out = escapeHtml(text)
  // código inline
  out = out.replace(/`([^`]+)`/g, '<code class="rounded border border-border/60 bg-white/5 px-1.5 py-0.5 font-mono text-[0.85em] text-accent-soft">$1</code>')
  // negrito
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // itálico
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  // links — aceita apenas http(s)/mailto e caminhos relativos
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*|mailto:[^\s)]+)\)/g,
    '<a class="font-medium text-accent underline underline-offset-2 hover:opacity-80" href="$2" rel="noopener noreferrer">$1</a>',
  )
  return out
}

function renderMarkdown(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const html: string[] = []
  let listOpen = false

  const closeList = () => {
    if (listOpen) {
      html.push('</ul>')
      listOpen = false
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd()

    if (line.trim() === '') {
      closeList()
      continue
    }

    if (/^---+$/.test(line.trim())) {
      closeList()
      html.push('<hr class="my-8 border-border/60" />')
      continue
    }

    const heading = line.match(/^(#{1,4})\s+(.*)$/)
    if (heading) {
      closeList()
      const level = heading[1].length
      const cls =
        level === 1
          ? 'mt-8 mb-4 font-display text-2xl font-bold text-foreground'
          : level === 2
            ? 'mt-8 mb-3 font-display text-xl font-bold text-foreground'
            : level === 3
              ? 'mt-6 mb-2 font-display text-lg font-semibold text-foreground'
              : 'mt-5 mb-2 font-display text-base font-semibold text-foreground'
      html.push(`<h${level} class="${cls}">${inline(heading[2])}</h${level}>`)
      continue
    }

    const quote = line.match(/^>\s?(.*)$/)
    if (quote) {
      closeList()
      html.push(
        `<blockquote class="my-4 border-l-4 border-accent/50 bg-accent/[0.06] py-2.5 pl-4 italic text-foreground/80">${inline(
          quote[1],
        )}</blockquote>`,
      )
      continue
    }

    const list = line.match(/^\s*[-*]\s+(.*)$/)
    if (list) {
      if (!listOpen) {
        html.push('<ul class="my-4 list-disc space-y-2 pl-6">')
        listOpen = true
      }
      html.push(`<li>${inline(list[1])}</li>`)
      continue
    }

    closeList()
    html.push(`<p class="my-4 leading-relaxed text-foreground/90">${inline(line)}</p>`)
  }

  closeList()
  return html.join('\n')
}

export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div
      className={cn('text-base', className)}
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  )
}
