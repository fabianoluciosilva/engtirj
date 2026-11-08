'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { whatsappUrl } from '@/lib/site'

/**
 * Botão flutuante de WhatsApp com balão de convite.
 * Só aparece após o usuário rolar um pouco (não polui a dobra) e pode ser
 * fechado. O link leva a mensagem pré-formatada com a tag [engti].
 */
export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (dismissed) return null

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-end gap-2 transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <div className="mb-1 hidden max-w-[220px] rounded-lg border border-border bg-card p-3 text-xs text-card-foreground shadow-lift sm:block">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Fechar"
          className="float-right -mr-1 -mt-1 rounded p-0.5 text-muted-foreground hover:bg-muted"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <p className="pr-3">
          <strong className="text-foreground">Problemas com projetos travando?</strong>
          <br />
          Fale com um especialista em TI para engenharia.
        </p>
      </div>

      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp com a EngTI RJ"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <MessageCircle className="h-7 w-7" strokeWidth={2.2} />
      </a>
    </div>
  )
}
