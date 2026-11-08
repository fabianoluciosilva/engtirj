import { cn } from '@/lib/cn'

/**
 * Logotipo EngTI RJ — vetorial (SVG).
 *
 * Conceito: um hexágono metálico (estrutura de engenharia) contendo uma
 * treliça de nós conectados por barras diagonais — a própria "rede" que liga
 * infraestrutura e tecnologia. O nó central em laranja-construção é o ponto
 * de conexão. O wordmark "EngTI RJ" usa o laranja apenas no "TI".
 *
 * `variant="light"` (fundo claro) e `variant="dark"` (fundo escuro) trocam as
 * cores do traço e do texto para manter contraste AA.
 */
export function Logo({
  className,
  variant = 'light',
  showText = true,
  height = 40,
}: {
  className?: string
  variant?: 'light' | 'dark'
  showText?: boolean
  height?: number
}) {
  const markStroke = variant === 'dark' ? '#F8FAFC' : '#0F172A'
  const nodeFill = variant === 'dark' ? '#F8FAFC' : '#0F172A'
  const textColor = variant === 'dark' ? '#F8FAFC' : '#0F172A'
  const subColor = variant === 'dark' ? '#94A3B8' : '#475569'
  const accent = '#EA580C'
  const metalA = variant === 'dark' ? '#1E293B' : '#F1F5F9'
  const metalB = variant === 'dark' ? '#0F172A' : '#FFFFFF'
  const gradId = `engti-metal-${variant}`

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg
        width={height}
        height={height}
        viewBox="0 0 48 48"
        fill="none"
        role="img"
        aria-label="EngTI RJ"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id={gradId} x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={metalA} />
            <stop offset="1" stopColor={metalB} />
          </linearGradient>
        </defs>

        <path
          d="M24 3.5 41.75 13.75V34.25L24 44.5 6.25 34.25V13.75L24 3.5Z"
          fill={`url(#${gradId})`}
          stroke={markStroke}
          strokeWidth="2.25"
          strokeLinejoin="round"
        />

        <path
          d="M24 12V36M14 18 34 30M34 18 14 30"
          stroke={markStroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.45"
        />

        <circle cx="24" cy="12" r="2.4" fill={nodeFill} />
        <circle cx="24" cy="36" r="2.4" fill={nodeFill} />
        <circle cx="14" cy="18" r="2.4" fill={nodeFill} />
        <circle cx="34" cy="30" r="2.4" fill={nodeFill} />
        <circle cx="34" cy="18" r="2.4" fill={nodeFill} />
        <circle cx="14" cy="30" r="2.4" fill={nodeFill} />

        <circle cx="24" cy="24" r="4.4" fill={accent} />
        <circle cx="24" cy="24" r="1.7" fill="#FFF7ED" />
      </svg>

      {showText && (
        <span className="flex flex-col leading-none">
          <span
            className="font-display font-bold tracking-tight"
            style={{ color: textColor, fontSize: height * 0.46 }}
          >
            Eng<span style={{ color: accent }}>TI</span> RJ
          </span>
          <span
            className="mt-1 font-medium uppercase"
            style={{ color: subColor, fontSize: Math.max(9, height * 0.24), letterSpacing: '0.16em' }}
          >
            TI para Engenharia
          </span>
        </span>
      )}
    </span>
  )
}