import type { Config } from 'tailwindcss'

// Design System EngTI RJ — tema futurista dark. Cores via CSS variables.
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
          soft: 'rgb(var(--primary-soft) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
          soft: 'rgb(var(--accent-soft) / <alpha-value>)',
        },
        cyan: 'rgb(var(--cyan) / <alpha-value>)',
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
        '2xl': 'calc(var(--radius) + 12px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.3), 0 20px 40px -24px rgb(0 0 0 / 0.8)',
        lift: '0 10px 30px -12px rgb(0 0 0 / 0.6)',
        neon: '0 0 24px -2px rgb(249 115 22 / 0.55)',
        'neon-cyan': '0 0 24px -2px rgb(34 211 238 / 0.5)',
        'neon-soft': '0 8px 40px -10px rgb(249 115 22 / 0.4)',
      },
      backgroundImage: {
        'grid-steel':
          'linear-gradient(to right, rgb(var(--steel) / 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--steel) / 0.1) 1px, transparent 1px)',
        'hero-glow':
          'radial-gradient(60rem 40rem at 70% 0%, rgb(249 115 22 / 0.18), transparent 60%), radial-gradient(50rem 40rem at 10% 30%, rgb(34 211 238 / 0.12), transparent 55%)',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config