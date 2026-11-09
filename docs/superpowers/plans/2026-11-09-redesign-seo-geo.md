# Redesign, menu, copy e SEO/GEO — Plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar a nova identidade "prancheta de engenharia" (hero com planta viva, mega-menu, vocabulário limpo, FAQ único, páginas de serviço) e corrigir as lacunas de SEO/GEO.

**Architecture:** Next 15 App Router + Tailwind 3. Tokens de cor em CSS variables (já é o padrão do repo). Conteúdo textual em `lib/*.ts` como fonte única (HTML + JSON-LD + llms.txt leem dos mesmos dados). Hero e menu são client components isolados; o resto permanece Server Component.

**Tech Stack:** Next 15.5, React 19, Tailwind 3.4, lucide-react, `next/font/google`, `next/og`. Sem novas dependências.

Spec: `docs/superpowers/specs/2026-11-08-redesign-seo-geo-design.md`

## Global Constraints

- Paleta: fundo `#0A1B33`, superfície `#0F2442`, linha `#9CC3E4`, texto `#E6EEF7`, secundário `#93A9C2`, ação `#FF7A1A` (somente botão, item ativo, foco).
- Fontes: Big Shoulders Display (títulos), Geist (corpo), JetBrains Mono (apenas cotas da planta).
- Remover: ciano, glows radiais, `text-gradient`, `shadow-neon*`, `animate-floaty`, etiquetas caixa-alta acima de títulos, numeração 01–04.
- Zero ocorrências de "dor"/"dores" no texto visível. "alta performance", "projetos pesados", "especializad*", "exclusivamente": no máximo 2 ocorrências cada em todo o texto visível.
- Nenhuma métrica fictícia. Nenhum dado inventado de cliente.
- Única animação autônoma da página: desenho da planta + ponto percorrendo. `prefers-reduced-motion` desliga ambas.
- Mensagem de WhatsApp com tag `[engti]` permanece (`lib/site.ts#whatsappUrl`).
- CTA primário em todo o site: "Pedir diagnóstico gratuito".
- Contraste AA, foco visível, navegação por teclado no menu e na planta.
- Rodar a cada commit: `npm run type-check`.
- Commits terminam com `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Mapa de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `app/globals.css`, `tailwind.config.ts`, `app/layout.tsx` | tokens, fontes, utilitários (`.plate`, `.focus-ring`) |
| `components/Button.tsx` | botões na nova linguagem |
| `lib/site.ts` | dados da empresa, serviços (slug, título, resumo), regiões |
| `lib/faq.ts` | FAQ único (8 itens) |
| `lib/services-content.ts` | conteúdo longo das 4 páginas de serviço |
| `scripts/check-copy.mjs` | verificação automática do vocabulário |
| `components/hero/BlueprintPlan.tsx` | SVG da planta + pontos interativos (client) |
| `components/sections/Hero.tsx` | composição do hero |
| `components/nav/MegaMenu.tsx`, `components/SiteHeader.tsx` | menu desktop/mobile, scroll-spy |
| `components/sections/{Symptoms,Services,Faq,About,BlogPreview}.tsx` | seções da home |
| `app/servicos/[slug]/page.tsx` | páginas de serviço |
| `components/JsonLd.tsx`, `app/opengraph-image.tsx`, `app/llms.txt/route.ts`, `app/sitemap.ts`, `app/robots.ts` | SEO/GEO |

---

### Task 1: Tokens visuais, fontes e botões

**Files:**
- Modify: `app/globals.css`, `tailwind.config.ts`, `app/layout.tsx`, `components/Button.tsx`

**Interfaces:**
- Produces: classes `.plate` (superfície plana com borda de linha de planta), `.container-page` (mantida), `.rule` (divisor 1px de linha de planta); cores Tailwind `bg-background`, `bg-surface`, `text-foreground`, `text-muted-foreground`, `text-line`, `bg-accent`; fontes `font-display`, `font-sans`, `font-mono`.

- [ ] **Step 1:** Em `app/layout.tsx`, trocar `Sora` por `Big_Shoulders_Display` (`variable: '--font-display'`, pesos 700/800, `display: 'swap'`, subsets latin). Manter Geist e JetBrains Mono. `viewport.themeColor` = `#0A1B33`.
- [ ] **Step 2:** Em `app/globals.css`, substituir os tokens `:root` pelos valores da paleta (formato `R G B`): `--background: 10 27 51; --surface: 15 36 66; --foreground: 230 238 247; --muted-foreground: 147 169 194; --line: 156 195 228; --accent: 255 122 26; --accent-foreground: 10 27 51; --border: 156 195 228` (a borda é aplicada sempre com opacidade `/20`). Remover `--cyan`, glows de `body`, `.text-gradient`, `.glass`, `.btn-glow`, `.divider-glow`, `.card-future`, animações `float/pulseGlow/scan/marquee`. Criar `.plate` (`border:1px solid rgb(var(--line)/.2); background: rgb(var(--surface)); border-radius:.375rem`), `.rule`, e fundo do `body` = grade de planta bem sutil (linhas `rgb(var(--line)/.05)` a cada 48px, `background-attachment: fixed`). Manter bloco `prefers-reduced-motion`.
- [ ] **Step 3:** Em `tailwind.config.ts`, remover cor `cyan`, sombras `neon*`, keyframes/animations `floaty`/`shimmer`; adicionar cores `surface` e `line`; `borderRadius.DEFAULT = '0.375rem'`.
- [ ] **Step 4:** Reescrever `variants` em `components/Button.tsx`: `accent` = fundo laranja sólido, texto `accent-foreground`, hover clareia levemente (sem translate/sombra); `outline` = borda `line/40`, hover borda laranja; `ghost`; manter assinaturas (`Button`, `ButtonLink`, `ButtonAnchor`) e `ring` de foco laranja.
- [ ] **Step 5:** Buscar usos remanescentes das classes removidas e corrigi-los (a build quebrará se `@apply` apontar para classe inexistente):
  Run: `grep -rnE "card-future|text-gradient|btn-glow|divider-glow|glass|shadow-neon|animate-floaty|bg-hero-glow|bg-engineering-grid|animate-grid-pan|animate-scan|text-cyan|bg-cyan|border-cyan" app components`
  Expected: lista de arquivos; substituir por `.plate`/classes novas. Seções que serão reescritas nas Tasks 3–5 podem ser deixadas para lá, mas `app/blog/**`, `components/Markdown.tsx`, `not-found.tsx`, `loading.tsx` devem ser corrigidos nesta task.
- [ ] **Step 6:** Run: `npm run type-check` → Expected: sem erros.
- [ ] **Step 7: Commit** `feat(ui): tokens de prancheta de engenharia, fontes e botoes`

---

### Task 2: Conteúdo — site, FAQ único, serviços, verificação de vocabulário

**Files:**
- Modify: `lib/site.ts`, `lib/faq.ts`
- Create: `lib/services-content.ts`, `scripts/check-copy.mjs`
- Delete (na Task 5): `lib/geo-content.ts`

**Interfaces:**
- Produces:
  - `site.services: { slug: string; title: string; summary: string; icon: 'server'|'wifi'|'shield'|'key' }[]` (4 itens; slugs mantidos: `servidores-storage-cad-bim`, `redes-canteiros-obras`, `backup-ransomware`, `licenciamento-softwares-tecnicos`). `description` é renomeado `summary` (1 frase, ≤ 160 caracteres).
  - `site.regions: string[]` = `['Rio de Janeiro (capital)', 'Niterói', 'Baixada Fluminense', 'Região Serrana', 'Região dos Lagos', 'Sul Fluminense', 'interior do estado']`.
  - `faq: { question: string; answer: string }[]` (8 itens, sem duplicatas, resposta objetiva na 1ª frase).
  - `servicesContent: Record<slug, { h1: string; metaTitle: string; metaDescription: string; intro: string; problems: {title:string; text:string}[]; deliverables: string[]; howWeWork: string[]; faq: {question:string; answer:string}[]; relatedCategory: string }>`

- [ ] **Step 1: Escrever o verificador (falha primeiro).** Criar `scripts/check-copy.mjs`:

```js
// Verifica vocabulário no texto visível (lib/*.ts e components/**/*.tsx, app/**/*.tsx).
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const roots = ['app', 'components', 'lib']
const skip = [/blog-topics\.ts$/, /blog-generator\.ts$/, /JsonLd\.tsx$/, /check-copy/]
const files = []
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.(ts|tsx)$/.test(f) && !skip.some((r) => r.test(p))) files.push(p)
  }
}
roots.forEach(walk)
const text = files.map((f) => readFileSync(f, 'utf8')).join('\n')

const banned = [/\bdores?\b/gi]
const limited = [
  [/alta performance/gi, 2],
  [/projetos pesados/gi, 2],
  [/especializad[oa]s?/gi, 2],
  [/exclusivamente/gi, 2],
]
let fail = false
for (const re of banned) {
  const n = (text.match(re) ?? []).length
  if (n) { console.error(`FAIL ${re}: ${n} ocorrências (máx 0)`); fail = true }
}
for (const [re, max] of limited) {
  const n = (text.match(re) ?? []).length
  if (n > max) { console.error(`FAIL ${re}: ${n} ocorrências (máx ${max})`); fail = true }
}
if (fail) process.exit(1)
console.log('copy OK')
```

- [ ] **Step 2:** Run: `node scripts/check-copy.mjs` → Expected: FAIL (hoje há "dores", "alta performance" 10×, etc.).
- [ ] **Step 3:** Reescrever `lib/site.ts` (`services` com `summary` + `icon`, `regions`, `cta.primary = 'Pedir diagnóstico gratuito'`, `description` sem repetir "especializado/exclusivamente"). Manter intactos: `WHATSAPP_NUMBER`, `WHATSAPP_MESSAGE`, `whatsappUrl`, `SITE_URL`, `geo`, `phone*`, `email`, `openingHours`, `address`.
- [ ] **Step 4:** Reescrever `lib/faq.ts` com 8 perguntas (incluir: o que uma TI para engenharia precisa ter; por que Revit/AutoCAD/BIM travam na rede; como proteger projetos contra ransomware; como ter internet estável no canteiro; NAS ou SAN para escritório de engenharia; como funciona o diagnóstico gratuito; vocês atendem fora da capital; gestão de licenças Autodesk). Respostas sem as expressões limitadas além do orçamento e **sem inventar** números de desempenho.
- [ ] **Step 5:** Criar `lib/services-content.ts` com os 4 conteúdos (400–600 palavras por serviço somando intro/problemas/entregas/como trabalhamos), em português, citando o RJ naturalmente, sem as expressões limitadas além do orçamento.
- [ ] **Step 6:** Run: `npm run type-check` (consumidores de `service.description` quebram → corrigidos nas Tasks 3–6; se necessário manter temporariamente `description` como alias até a Task 5 e removê-lo lá).
- [ ] **Step 7: Commit** `feat(content): site, FAQ unico e conteudo dos servicos`

---

### Task 3: Menu — MegaMenu, scroll-spy, gaveta mobile

**Files:**
- Create: `components/nav/MegaMenu.tsx`
- Modify: `components/SiteHeader.tsx`

**Interfaces:**
- Consumes: `site.services`, `whatsappUrl()`, `Logo`.
- Produces: `SiteHeader` (sem props). `MegaMenu({ onNavigate }: { onNavigate?: () => void })` renderiza a lista de 4 serviços com link `/servicos/${slug}`.

- [ ] **Step 1:** `MegaMenu.tsx`: botão "Serviços" com `aria-expanded`/`aria-controls`; painel abre por clique, hover (desktop) e foco; Esc fecha e devolve foco ao botão; clique fora fecha. Cada item: ícone lucide, título, `summary`, link.
- [ ] **Step 2:** `SiteHeader.tsx`: itens `Serviços` (MegaMenu), `Como funciona` (`/#como-funciona`), `Blog` (`/blog`), `FAQ` (`/#faq`). Estado `scrolled` (scrollY > 24) reduz altura (h-16 → h-14) e aumenta opacidade do fundo. Scroll-spy via `IntersectionObserver` nas seções `#servicos`, `#como-funciona`, `#faq`; indicador laranja (barra 2px) posicionado sob o item ativo, com transição de `left/width`. Em rotas internas (`usePathname`), marca `/blog` ou `/servicos/*`.
- [ ] **Step 3:** CTA no header: botão laranja "Pedir diagnóstico" (WhatsApp) + telefone `site.phone` com `tel:`.
- [ ] **Step 4:** Mobile: botão menu abre gaveta em tela cheia (`role="dialog" aria-modal`), links grandes, bloco "Serviços" já expandido, CTA fixo no rodapé da gaveta; `document.body.style.overflow='hidden'` enquanto aberta; foco preso (primeiro/último focáveis ciclam); Esc fecha; fecha ao navegar.
- [ ] **Step 5:** Run: `npm run type-check` → sem erros.
- [ ] **Step 6: Commit** `feat(nav): mega-menu, scroll-spy e gaveta mobile`

---

### Task 4: Primeira dobra — planta técnica viva

**Files:**
- Create: `components/hero/BlueprintPlan.tsx`
- Modify: `components/sections/Hero.tsx`, `app/globals.css` (keyframes `draw`, `travel` dentro de `@media (prefers-reduced-motion: no-preference)`)

**Interfaces:**
- Consumes: `site.services` (slug, title, summary).
- Produces: `BlueprintPlan()` (client). Pontos: servidor→`servidores-storage-cad-bim`, canteiro→`redes-canteiros-obras`, nuvem→`backup-ransomware`, chave→`licenciamento-softwares-tecnicos`.

- [ ] **Step 1:** `BlueprintPlan.tsx`: `<svg viewBox="0 0 800 560" role="group" aria-label="Planta da infraestrutura de TI de um escritório de engenharia">` com: prédio de escritório em planta/isométrica simples (retângulos e linhas), canteiro com guindaste, nuvem, chave, conexões tracejadas entre os 4. Todos os traços `stroke="rgb(var(--line))"`, `fill="none"`, `vector-effect="non-scaling-stroke"`. Linhas com `pathLength="1"`, `stroke-dasharray:1`, animação `draw 2s ease-out forwards` escalonada; ponto (`<circle>` laranja r=4) com `offset-path`/`animateMotion` percorrendo a rota principal em 9s, loop. Sem `prefers-reduced-motion: no-preference` ⇒ linhas já completas e ponto parado/oculto.
- [ ] **Step 2:** 4 hotspots como `<button>` posicionados sobre o SVG (wrapper `relative`, posições em %), cada um com "cota" em `font-mono text-[11px]` (ex.: `SERVIDOR DE ARQUIVOS`) e `aria-expanded`. Clique/Enter abre cartão (`.plate`, 1 frase = `summary`, link "Ver o serviço" → `/servicos/${slug}`); Esc fecha; só um aberto por vez; clique fora fecha.
- [ ] **Step 3:** Mobile (`<md`): esconder cartões flutuantes; abaixo da planta renderizar 4 chips-link para os serviços.
- [ ] **Step 4:** `Hero.tsx`: grid `lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]`; coluna esquerda com `<h1>` (contém "TI", "engenharia" e "Rio de Janeiro"; proposta: "TI para engenharia no Rio de Janeiro: o projeto abre rápido e a obra não fica sem rede."), parágrafo curto (1 frase, sem expressões limitadas), `CtaWhatsApp` com rótulos "Pedir diagnóstico gratuito" / "Conhecer os serviços" (âncora `#servicos`). Planta à direita sangrando para fora do container (`lg:-mr-[calc((100vw-72rem)/2)]` ou equivalente testado). Sem pills, sem métricas, sem gradiente.
- [ ] **Step 5:** Run: `npm run type-check`; `npm run dev` e abrir `http://localhost:3002` conferindo desenho da planta, hotspots e teclado.
- [ ] **Step 6: Commit** `feat(hero): planta tecnica viva com pontos interativos`

---

### Task 5: Seções da home, rodapé e remoção do que sobra

**Files:**
- Create: `components/sections/Symptoms.tsx`, `components/sections/About.tsx`, `components/sections/HowItWorks.tsx`
- Modify: `components/sections/{Services,Faq,BlogPreview}.tsx`, `components/SiteFooter.tsx`, `components/WhatsAppButton.tsx`, `app/page.tsx`
- Delete: `components/sections/PainPoints.tsx`, `components/sections/GeoAnswers.tsx`, `lib/geo-content.ts`

**Interfaces:**
- Consumes: `site`, `faq`, `getLatestPosts`, `CtaWhatsApp`.
- Produces: seções com `id` = `servicos`, `como-funciona`, `faq`, `quem-somos`, `blog`.

- [ ] **Step 1:** `Symptoms.tsx` ("O que trava um escritório de engenharia"): 3–4 cards sintoma→correção (ex.: "O Revit leva minutos para abrir o modelo", "Um arquivo de obra sumiu e não há cópia", "O técnico de TI não conhece Autodesk nem canteiro"). Cada card: sintoma como título, parágrafo de causa, e a correção em bloco separado por `.rule` — **sem rótulos "A dor"/"A solução"**, sem ícone de alerta, sem eyebrow.
- [ ] **Step 2:** `Services.tsx`: 4 itens em linha/lista editorial (não 4 cards iguais): título, `summary`, link "Ver o serviço" → `/servicos/${slug}`; sem numeração; sem blur/gradiente. Manter bloco de CTA "Diagnóstico gratuito" com texto próprio.
- [ ] **Step 3:** `HowItWorks.tsx` (`id="como-funciona"`): 3 passos reais em sequência (conversa e diagnóstico → plano com prioridades → implantação e acompanhamento), aqui a numeração é legítima (é uma sequência).
- [ ] **Step 4:** `Faq.tsx`: usa o `faq` único (8); `<details>` nativo; sem eyebrow/gradiente; título "Perguntas de quem toca projetos".
- [ ] **Step 5:** `About.tsx` (`id="quem-somos"`): parágrafo definindo a empresa (o que faz, para quem, onde) + lista de regiões (`site.regions`) como texto, sem criar links.
- [ ] **Step 6:** `BlogPreview.tsx`: remover eyebrow/gradiente; título "Do blog"; cards no estilo `.plate`.
- [ ] **Step 7:** `SiteFooter.tsx`: coluna Serviços com links `/servicos/${slug}`; navegação atualizada; sem `uppercase tracking` nos títulos de coluna. `WhatsAppButton.tsx`: trocar "Projetos travando?" por texto neutro sem "especialista" repetido.
- [ ] **Step 8:** `app/page.tsx`: ordem `Hero → Symptoms → Services → HowItWorks → Faq → About → BlogPreview`; remover `GeoAnswers`; JSON-LD continua (será trocado na Task 7). Deletar os 3 arquivos listados.
- [ ] **Step 9:** Run: `node scripts/check-copy.mjs` → Expected: `copy OK`. Run: `npm run type-check` → sem erros.
- [ ] **Step 10: Commit** `feat(home): novas secoes sem repeticao e FAQ unico`

---

### Task 6: Páginas de serviço `/servicos/[slug]`

**Files:**
- Create: `app/servicos/[slug]/page.tsx`
- Modify: `app/not-found.tsx` (se necessário)

**Interfaces:**
- Consumes: `site.services`, `servicesContent`, `getLatestPosts`/`listPublishedPosts` (posts da categoria `relatedCategory`), `JsonLd`, helpers da Task 7 (`serviceSchema`, `breadcrumbSchema`, `faqPageSchema`).
- Produces: rota estática por slug; `generateStaticParams`, `generateMetadata` (title = `metaTitle`, description, canonical `/servicos/${slug}`, OG).

- [ ] **Step 1:** `generateStaticParams` a partir de `site.services`; `notFound()` para slug inexistente.
- [ ] **Step 2:** Página: breadcrumb visual (Início › Serviços › {título}), `<h1>`, intro, problemas (lista), entregas (lista), como trabalhamos (passos), bloco de cobertura regional (`site.regions`), FAQ do serviço (`<details>`), posts relacionados (até 3, ocultar bloco se vazio), CTA com mensagem WhatsApp específica: `whatsappUrl('Olá! [engti] Quero um diagnóstico de TI sobre: ' + título)`.
- [ ] **Step 3:** JSON-LD da página: `Service` (provider por `@id`), `BreadcrumbList`, `FAQPage` do serviço.
- [ ] **Step 4:** Run: `npm run build` → Expected: 4 rotas `/servicos/*` geradas como estáticas (●).
- [ ] **Step 5: Commit** `feat(seo): paginas de servico com schema proprio`

---

### Task 7: SEO/GEO — JSON-LD em grafo, OG image, llms.txt, sitemap, robots

**Files:**
- Modify: `components/JsonLd.tsx`, `app/layout.tsx`, `app/page.tsx`, `app/sitemap.ts`, `app/robots.ts`
- Create: `app/opengraph-image.tsx`, `app/llms.txt/route.ts`

**Interfaces:**
- Produces em `JsonLd.tsx`: `organizationSchema()`, `websiteSchema()`, `serviceSchema(slug)`, `breadcrumbSchema(items)` (existente), `faqPageSchema(items)` (existente), `blogPostingSchema(post)` (existente), e `graph(...nodes)` que devolve `{ '@context': 'https://schema.org', '@graph': nodes-sem-@context }`. `@id`s: `${SITE_URL}/#organization`, `${SITE_URL}/#website`.

- [ ] **Step 1:** Em `JsonLd.tsx`: remover `priceRange`; `sameAs` só inclui itens de `site.social` se existir (campo novo opcional em `site.ts`, vazio por padrão); `Organization` com `@type: ['Organization','ProfessionalService']`; `WebSite` com `publisher`; `serviceSchema` com `provider: {'@id': organizationId}`, `areaServed` = estado do RJ e `serviceType`. Home emite `graph(organizationSchema(), websiteSchema(), faqPage)`.
- [ ] **Step 2:** `app/opengraph-image.tsx` com `next/og` (`ImageResponse`, 1200×630, fundo `#0A1B33`, nome, proposta, traço de planta em laranja/linha). Exportar `alt`, `size`, `contentType`. Em `layout.tsx` remover as referências a `/og-image.png` (Next injeta a imagem gerada).
- [ ] **Step 3:** `app/llms.txt/route.ts`: `GET` devolve `text/plain; charset=utf-8` com: nome, descrição, regiões, lista dos 4 serviços com URL absoluta e `summary`, FAQ em pergunta/resposta curta, URLs principais (`/`, `/blog`, `/servicos/*`), contato. Gerado a partir de `site`, `faq`.
- [ ] **Step 4:** `sitemap.ts`: adicionar `/servicos/*` (priority 0.9); `lastModified` das páginas estáticas = constante `SITE_UPDATED_AT` em `lib/site.ts` (data real da última mudança de conteúdo, atualizada manualmente), posts = `published_at`.
- [ ] **Step 5:** `robots.ts`: `disallow: ['/api/', '/admin']`.
- [ ] **Step 6:** Run: `npm run build`. Depois `npm run start` e:
  Run: `curl -s -o /dev/null -w "%{http_code} %{content_type}\n" http://localhost:3002/llms.txt http://localhost:3002/opengraph-image http://localhost:3002/sitemap.xml http://localhost:3002/robots.txt` → Expected: quatro linhas `200`.
- [ ] **Step 7:** Validar JSON-LD:
  Run: `curl -s http://localhost:3002/ | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const m=[...s.matchAll(/<script type=\"application\/ld\+json\">(.*?)<\/script>/g)];m.forEach(x=>JSON.parse(x[1]));console.log('jsonld ok',m.length)})"` → Expected: `jsonld ok N` (N ≥ 1).
- [ ] **Step 8: Commit** `feat(seo): grafo JSON-LD, OG image, llms.txt, sitemap e robots`

---

### Task 8: Verificação final

- [ ] **Step 1:** `npm run type-check`, `npm run build`, `node scripts/check-copy.mjs` → todos sem erro.
- [ ] **Step 2:** Lighthouse (chrome-devtools) na home e em `/servicos/servidores-storage-cad-bim`, mobile e desktop. Metas: SEO ≥ 95, Acessibilidade ≥ 95, Boas práticas ≥ 95, LCP mobile < 2,5 s. Corrigir o que ficar abaixo.
- [ ] **Step 3:** Screenshots 1440×900 e 390×844: primeira dobra, mega-menu aberto, gaveta mobile, hotspot aberto. Inspecionar e corrigir problemas visuais (overflow horizontal, sobreposição, contraste).
- [ ] **Step 4:** Teste com `prefers-reduced-motion` emulado: planta completa e estática.
- [ ] **Step 5:** Teclado: Tab percorre menu e hotspots; Esc fecha mega-menu, cartão e gaveta.
- [ ] **Step 6:** Commit final dos ajustes `fix(ui): ajustes da verificacao final`.
