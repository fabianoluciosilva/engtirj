# Redesign, menu, copy e SEO/GEO — EngTI RJ

Subprojeto 1 de 2. O subprojeto 2 (blog automático + painel) está em
`2026-11-08-blog-automatico-admin-design.md` e depende dos tokens visuais definidos aqui.

## Objetivo

1. Primeira dobra diferente do contirj.com.br (hoje: texto à esquerda + painel falso de métricas à direita) e futurista.
2. Menu mais completo (hoje: 4 links de texto + botão).
3. Eliminar repetição de palavras ("dor", "alta performance", "especializado"...) e conteúdo duplicado entre seções.
4. Corrigir lacunas de SEO e GEO.

## Auditoria (estado atual)

| Problema | Onde |
|---|---|
| Layout do hero idêntico ao do contirj (texto + painel lateral de status) | `components/sections/Hero.tsx` |
| Métricas fictícias apresentadas como reais ("Uptime 99,98%", "backup hoje 03h") | `Hero.tsx` |
| "dor/dores/A dor/Problema × Solução" 4× na mesma seção | `PainPoints.tsx` |
| "alta performance" 10×, "projetos pesados" 8×, "especializad*" 16×, "exclusivamente" 5× | `site.ts`, `faq.ts`, `geo-content.ts`, seções |
| Mesma pergunta em FAQ e Respostas diretas; 4 de 6 temas repetidos em 3 seções | `faq.ts`, `geo-content.ts` |
| Etiqueta caixa-alta + palavra em gradiente em todo título de seção | todas as seções |
| Numeração 01–04 em lista que não é sequência | `Services.tsx` |
| `/og-image.png` declarado e inexistente (404 em compartilhamentos) | `app/layout.tsx`, `public/` |
| Sem `llms.txt` | — |
| Serviços só como âncora; "Saiba mais →" sem destino | `Services.tsx` |
| JSON-LD: `sameAs` vazio, `priceRange: '$$'` inventado, sem `WebSite`/`Service`, sem grafo `@id` único | `JsonLd.tsx` |
| Sitemap com `lastModified = now` para tudo | `app/sitemap.ts` |

## Identidade visual: "prancheta de engenharia"

| Token | Valor |
|---|---|
| Fundo (azul-planta) | `#0A1B33` |
| Superfície | `#0F2442` |
| Linha de planta | `#9CC3E4` (usada em 12–40% de opacidade) |
| Texto | `#E6EEF7` |
| Texto secundário | `#93A9C2` |
| Ação (laranja-obra) | `#FF7A1A` — **somente** botão, item ativo e foco |

- Remove: ciano, glows radiais, `text-gradient`, `shadow-neon*`, `animate-floaty`, `card-future` com translateY no hover.
- Tipografia: **Big Shoulders Display** (títulos, 700/800, sentence case), **Geist** (corpo), **JetBrains Mono** apenas para "cotas" (anotações da planta). Carregadas com `next/font/google`.
- Raio de borda pequeno e consistente (planta = cantos retos/levemente arredondados), sem sombras suaves em todos os cards.
- Contraste mínimo AA em todos os pares texto/fundo; foco visível em laranja; `prefers-reduced-motion` respeitado.

## Primeira dobra: planta técnica viva

- Layout: título + CTA à esquerda; planta SVG ocupando o restante da largura à direita e sangrando para fora do container.
- A planta (SVG inline, sem libs): prédio de escritório (servidor/storage), canteiro com guindaste (rede), nuvem (backup), chave (licenças), ligados por linhas tracejadas.
- Animação única: ao carregar, `stroke-dashoffset` desenha as linhas (~2 s); depois um ponto percorre as conexões em loop lento. Nada mais anima na página fora de ações do usuário.
- Pontos clicáveis (botões acessíveis) com "cota" em mono: abrem um cartão com uma frase e link para `/servicos/[slug]`. Teclado: Tab/Enter/Esc.
- Mobile: planta abaixo do título; os 4 pontos viram 4 chips.
- `prefers-reduced-motion`: planta já desenhada, sem ponto percorrendo.
- Nenhuma métrica fictícia.
- `<h1>` visível contém o recorte: "TI para engenharia no Rio de Janeiro..." (texto final no plano; precisa conter "TI", "engenharia" e "Rio de Janeiro").

## Menu (`SiteHeader`)

- Barra sticky que encolhe (altura e opacidade do fundo) ao rolar.
- Itens: Serviços (mega-menu), Como funciona, Blog, FAQ.
- Mega-menu de Serviços: 4 serviços com ícone, uma linha de descrição, link para a página própria. Abre por clique/hover/foco; fecha com Esc e clique fora; `aria-expanded`, `aria-controls`.
- Scroll-spy (IntersectionObserver) move um indicador laranja para a seção visível; em páginas internas marca a rota atual.
- CTA: WhatsApp (com a mensagem `[engti]` existente) + telefone.
- Mobile: gaveta em tela cheia, links grandes, lista de serviços expandida, CTA fixo no rodapé, trava de scroll do body, foco preso na gaveta, Esc fecha.

## Conteúdo e vocabulário

- A seção `PainPoints` vira **"O que trava um escritório de engenharia"**: cards sintoma → correção sem rótulos "A dor" / "A solução EngTI RJ". Nenhuma ocorrência de "dor/dores" no site.
- `GeoAnswers` e `Faq` fundem-se em **uma** seção FAQ com 8 perguntas sem duplicatas. Cada resposta começa com a resposta objetiva (formato "direct answer"). Fonte única `lib/faq.ts` alimenta o HTML e o schema `FAQPage`. `lib/geo-content.ts` é removido.
- O box "Sobre a EngTI RJ" vira a seção **Quem somos** (parágrafo curto que define a entidade: o que faz, para quem, onde).
- Regra de vocabulário (cada expressão, no máximo 2 ocorrências em todo o site visível): "alta performance", "projetos pesados", "especializad*", "exclusivamente". Substituir por especificações concretas (SSD NVMe, 10 GbE, RAID, failover 4G/5G etc.) sem inventar números de desempenho do cliente.
- Remover: etiquetas em caixa-alta acima de títulos, palavra em gradiente nos títulos, numeração 01–04.
- Textos de CTA consistentes: "Pedir diagnóstico gratuito" (primário) em todo o site.

## SEO e GEO

1. **Open Graph**: `app/opengraph-image.tsx` (`next/og`) com marca e proposta; remover referência a `/og-image.png`.
2. **`/llms.txt`**: rota que lista empresa, serviços, regiões atendidas, FAQ resumido e URLs principais.
3. **Páginas de serviço** `/servicos/[slug]` (4, estáticas via `generateStaticParams`): texto original (~400–600 palavras), FAQ próprio, links para posts relacionados do blog, bloco de cobertura regional, CTA. Metadata própria + canonical.
4. **JSON-LD em grafo único** (`@graph` com `@id`): `Organization`/`ProfessionalService`, `WebSite`, e por página: `Service`, `BreadcrumbList`, `FAQPage`. Remover `priceRange`. `sameAs` só com URLs reais fornecidas pelo dono (vazio até lá).
5. **Sitemap**: inclui `/servicos/*`; `lastModified` com datas reais (posts: `updated_at`; páginas estáticas: data da última alteração conhecida, não "agora").
6. **Cobertura regional**: texto cita capital, Niterói, Baixada Fluminense, Região Serrana, interior — apenas como área atendida (remoto + in-loco), sem criar páginas finas por cidade.
7. `robots`: continua liberando bots de IA; adicionar `Disallow: /admin`.

## Arquivos

Alterar: `app/layout.tsx`, `app/globals.css`, `tailwind.config.ts`, `app/page.tsx`, `app/sitemap.ts`, `app/robots.ts`, `components/SiteHeader.tsx`, `components/SiteFooter.tsx`, `components/JsonLd.tsx`, `components/sections/{Hero,PainPoints,Services,Faq,BlogPreview}.tsx`, `lib/site.ts`, `lib/faq.ts`.
Criar: `components/hero/BlueprintPlan.tsx`, `components/nav/MegaMenu.tsx`, `components/sections/About.tsx`, `app/servicos/[slug]/page.tsx`, `app/opengraph-image.tsx`, `app/llms.txt/route.ts`, `lib/services-content.ts`.
Remover: `components/sections/GeoAnswers.tsx`, `lib/geo-content.ts`.

## Verificação

- `npm run type-check` e `npm run build` sem erros.
- Lighthouse (desktop e mobile) na home e em uma página de serviço: SEO ≥ 95, Acessibilidade ≥ 95, Boas práticas ≥ 95; LCP da home < 2,5 s no mobile.
- Screenshots: primeira dobra desktop (1440) e mobile (390), menu aberto (mega-menu e gaveta), com e sem `prefers-reduced-motion`.
- Script que extrai todo o texto visível e confirma: zero "dor/dores", e os limites de repetição da regra de vocabulário.
- `JSON.parse` e validação básica dos blocos JSON-LD; `/llms.txt`, `/sitemap.xml`, `/robots.txt` e `/opengraph-image` respondem 200.
- Navegação por teclado completa no menu e nos pontos da planta.

## Fora do escopo

Blog, painel admin, Supabase, cron (subprojeto 2); redesenho do logo; páginas por cidade; imagens geradas por IA.
