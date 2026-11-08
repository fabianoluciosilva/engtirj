import type { Config } from 'tailwindcss'

// Design System EngTI RJ —"precisão técnica, robustez estrutural".
// Cor semântica via CSS variables (formato "R G B") em globals.css, ligadas
// aqui por rgb(var(--x) / <alpha-value>) para permitir modificadores de
// opacidade (bg-primary/10). Novo código usa SEMPRE os tokens semânticos
// (bg-background, text-foreground, bg-primary...) e nunca cor Tailwind crua.
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Neutros
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        // Azul Engenharia / Industrial Deep (primária)
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
          soft: 'rgb(var(--primary-soft) / <alpha-value>)',
        },
        // Laranja Construção / Aço Escovado (acento / CTA)
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
          soft: 'rgb(var(--accent-soft) / <alpha-value>)',
        },
        // Cinza Concreto / Prata Metálico (neutros)
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        steel: 'rgb(var(--steel) / <alpha-value>)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(2 6 23 / 0.04), 0 1px 3px 0 rgb(2 6 23 / 0.06)',
        lift: '0 10px 30px -12px rgb(15 23 42 / 0.25)',
      },
      backgroundImage: {
        'grid-steel':
          'linear-gradient(to right, rgb(var(--border) / 1) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--border) / 1) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}

export default config
