import { ImageResponse } from 'next/og'
import { site } from '@/lib/site'

export const OG_SIZE = { width: 1200, height: 630 }

/**
 * Imagem de compartilhamento (WhatsApp, LinkedIn etc.) no estilo "prancheta":
 * fundo azul-planta, traço de planta e uma linha de título.
 */
export function renderOgImage({ title, subtitle }: { title: string; subtitle?: string }) {
  const line = '#9CC3E4'
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A1B33',
          padding: 72,
          color: '#E6EEF7',
          position: 'relative',
        }}
      >
        <svg
          width="560"
          height="360"
          viewBox="0 0 560 360"
          style={{ position: 'absolute', right: 48, bottom: 48, opacity: 0.55 }}
          fill="none"
          stroke={line}
          strokeWidth="2.5"
        >
          <path d="M10 330H550" />
          <path d="M20 130h170v200H20zM20 200h170M20 262h170M70 262v68" />
          <path d="M330 330V180M390 330V180M450 330V180M330 250h120M330 180h120" />
          <path d="M500 330V30M530 330V30M500 30h-150M515 4l-45 26M515 4l45 26M380 30v110" />
          <path d="M215 100a30 30 0 0 1 6-50a40 40 0 0 1 76-4a30 30 0 0 1 12 54z" />
          <path d="M105 330c0 28 190 28 190 0" stroke="#FF7A1A" />
        </svg>

        <div style={{ display: 'flex', fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>
          Eng<span style={{ color: '#FF7A1A' }}>TI</span>&nbsp;RJ
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 560 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2 }}>{title}</div>
          {subtitle ? (
            <div style={{ marginTop: 24, fontSize: 30, color: '#93A9C2', lineHeight: 1.3 }}>{subtitle}</div>
          ) : null}
        </div>

        <div style={{ display: 'flex', fontSize: 26, color: line }}>{site.phone}</div>
      </div>
    ),
    OG_SIZE,
  )
}
