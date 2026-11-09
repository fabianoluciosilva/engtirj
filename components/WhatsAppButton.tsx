'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { whatsappUrl } from '@/lib/site'

/**
 * Botão flutuante de WhatsApp com balão de convite.
 * Aparece após rolar um pouco e pode ser fechado. Mensagem com tag [engti].
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
      className={`fixed bottom-5 right-5 z-50 flex items-end gap-3 transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <div className="plate mb-1 hidden max-w-[230px] p-3.5 text-xs text-card-foreground shadow-xl shadow-black/40 sm:block">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Fechar"
          className="float-right -mr-1 -mt-1 rounded p-0.5 text-muted-foreground hover:bg-white/10"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <p className="pr-3 leading-relaxed">
          <strong className="text-white">Projeto travando?</strong>
          <br />
          Conte o que está acontecendo e respondemos pelo WhatsApp.
        </p>
      </div>

      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp com a EngTI RJ"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_0_0_rgba(37,211,102,0.6)] transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" aria-hidden />
        <MessageCircle className="relative h-7 w-7" strokeWidth={2.2} />
      </a>
    </div>
  )
}