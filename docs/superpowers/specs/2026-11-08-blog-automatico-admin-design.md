# Blog automático com pesquisa + painel administrativo — EngTI RJ

Subprojeto 2 de 2. Depende dos tokens visuais do subprojeto 1
(`2026-11-08-redesign-seo-geo-design.md`).

## Objetivo

Publicar **1 artigo por semana**, 100% automático, sobre problemas reais de TI de empresas de
engenharia/arquitetura/construção no RJ, com **pesquisa na web** e **fontes citadas**, e dar ao
dono um painel (`/admin`) para acompanhar e gerenciar tudo.

## Estado atual e problemas

- `lib/blog-topics.ts`: 5 temas fixos; `pickNextTopic` cicla e repete.
- `lib/blog-generator.ts`: sem pesquisa; se a DeepSeek falha, publica um texto placeholder ("Conteúdo em atualização") — prejudica SEO.
- `app/api/cron/generate-post/route.ts`: publica direto, sem validação.
- Sem edição, despublicação, agendamento ou painel.

## Decisões do dono

- Publicação **100% automática** → compensada por travas automáticas de qualidade (abaixo). Reprovou nas travas ⇒ rascunho, nunca publica.
- Pesquisa: **lista curada + busca na web** combinadas.
- Painel: **senha única** em variável de ambiente.

## Modelo de dados (Supabase)

Migração `supabase/migrations/…_blog_v2.sql` (e `schema.sql` atualizado):

- `posts` (existente) ganha: `status text check in ('draft','published','archived') default 'draft'`, `sources jsonb default '[]'` (`[{title,url}]`), `faq jsonb default '[]'`, `keywords text[] default '{}'`, `reading_minutes int`, `updated_at timestamptz default now()` (trigger), `topic_id uuid null`. `is_published` é migrado: `status = 'published'` onde `is_published = true`; a coluna é mantida por compatibilidade e derivada por trigger de `status`.
- `topics`: `id`, `title`, `category`, `angle`, `keywords text[]`, `origin ('curated'|'research')`, `status ('pending'|'used'|'skipped')`, `priority int default 0`, `post_id uuid null`, `created_at`.
- `generation_runs`: `id`, `started_at`, `finished_at`, `topic_id`, `outcome ('published'|'draft_rejected'|'error'|'skipped')`, `reasons jsonb`, `post_id`, `log text`.
- `settings`: linha única (`id = 1`), `paused boolean default false`.
- **RLS**: anon lê apenas `posts` com `status = 'published'`. `topics`, `generation_runs`, `settings` sem política pública. Toda escrita e leitura administrativa usa a chave de serviço, somente no servidor.
- Seed: 50+ temas curados em `scripts/seed-topics.ts` (substitui `blog-topics.ts`), distribuídos em categorias: Infraestrutura CAD/BIM, Rede e canteiros, Backup e ransomware, Licenciamento e software, Segurança e acesso remoto, Estações e hardware, Nuvem e colaboração.

## Pipeline semanal

Cron Vercel existente (`0 6 * * 1`) chama `GET/POST /api/cron/generate-post` autenticado por `CRON_SECRET`. Parâmetros: `?dry=1` (não grava), `?topic=<id>` (força tema). Respeita `settings.paused`.

1. **Tema**: próximo `pending` da categoria menos publicada (desempate por `priority`). Se restarem < 5 `pending`, executa a **reposição**: busca tendências/problemas atuais na web, pede à DeepSeek 10 temas novos fora dos já existentes, insere com `origin = 'research'`.
2. **Pesquisa** (`lib/research.ts`): 2–3 consultas Firecrawl (pt-BR e en) derivadas do tema/palavras-chave; lê as 3–4 melhores fontes (markdown truncado). Falha de pesquisa ⇒ `outcome = 'error'`, nada publicado.
3. **Redação** (`lib/blog-generator.ts`): DeepSeek com as fontes no contexto, saída JSON validada: `title`, `meta_description` (≤160), `slug`, `content_md`, `faq[]`, `sources[]`, `keywords[]`. Sem fallback com texto fixo; sem chave ⇒ erro explícito.
4. **Travas** (`lib/quality-gates.ts`, funções puras e testadas):
   - 900–1.600 palavras; primeiro parágrafo responde objetivamente ao título;
   - não contém marcadores de placeholder (ex.: "em atualização", "lorem", "TODO");
   - não contém telefone/e-mail que não sejam os de `site.ts`;
   - ≥ 2 fontes e **todas** as URLs citadas pertencem ao conjunto realmente pesquisado;
   - título com similaridade (Jaccard de tokens) < 0,6 contra posts existentes; slug único;
   - menciona RJ/Rio de Janeiro de forma natural (≥ 1 vez);
   - anti-cópia: nenhuma sequência de 12 palavras consecutivas do artigo coincide com o texto de uma fonte;
   - **verificação factual**: 2ª chamada à DeepSeek recebe artigo + fontes e lista afirmações técnicas específicas (números, versões, nomes de produto) sem apoio; > 2 afirmações sem apoio ⇒ reprova.
5. **Resultado**: aprovado ⇒ `status = 'published'`, `published_at = now()`, `revalidatePath` de `/`, `/blog`, `/blog/[slug]`, sitemap. Reprovado ⇒ 1 nova tentativa com os motivos injetados no prompt; se reprovar de novo ⇒ `status = 'draft'` e `outcome = 'draft_rejected'`. Toda execução grava `generation_runs`.
6. **Orçamento de tempo**: pipeline tem rede + 2–3 chamadas LLM; `maxDuration` ajustado ao limite do plano Vercel do projeto (verificar antes de implementar; se insuficiente, dividir em etapas persistidas em `generation_runs`).

## Painel `/admin`

- **Autenticação** (`lib/admin-auth.ts`): `ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET`. Login por Server Action; comparação em tempo constante; cookie `httpOnly; Secure; SameSite=Lax` com payload `{exp}` assinado por HMAC-SHA256 (7 dias). Atraso crescente após falhas por IP (best-effort em memória + cabeçalho de espera). `middleware.ts` protege `/admin/**` (exceto `/admin/login`); **cada Server Action reconfere a sessão**. `/admin` com `noindex` (metadata + `X-Robots-Tag`) e `Disallow` no robots.
- **Telas**
  - *Início*: última execução e resultado, próxima execução, contagens (publicados/rascunhos/temas pendentes), botão **Gerar agora**, interruptor **Pausar geração**.
  - *Artigos*: tabela com filtro por status e busca; ações publicar / despublicar / arquivar / excluir (com confirmação).
  - *Editor*: título, slug, descrição, categoria, URL da capa, Markdown com pré-visualização lado a lado, fontes, FAQ, palavras-chave. Salvar atualiza `updated_at`.
  - *Temas*: lista com status/origem/prioridade; adicionar, ignorar, priorizar; **Pesquisar novos temas**.
  - *Execuções*: histórico com resultado e motivos de reprovação.
- Visual: mesmos tokens do subprojeto 1, denso e funcional (tabelas, formulários), sem a planta/animações.

## Mudanças no blog público

- `lib/posts.ts` filtra por `status = 'published'`; inclui posts relacionados (mesma categoria).
- `/blog/[slug]`: seção **Fontes** ao final; `BlogPosting` com `dateModified = updated_at`, `wordCount`/tempo de leitura e `FAQPage` quando houver FAQ; `BreadcrumbList` mantido.
- Capa por post via `app/blog/[slug]/opengraph-image.tsx` (`next/og`) quando `cover_url` for nulo.
- Templates de `/blog` e `/blog/[slug]` adotam os tokens do subprojeto 1.

## Variáveis de ambiente

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DEEPSEEK_API_KEY`, `FIRECRAWL_API_KEY`, `CRON_SECRET`, `ADMIN_PASSWORD` (≥ 16 caracteres), `ADMIN_SESSION_SECRET` (≥ 32 caracteres aleatórios). Fornecidas pelo dono depois; o código falha com mensagem clara se faltarem e `.env.local.example` documenta todas.

## Verificação

- Adicionar `vitest`; testes unitários de: cada trava de `quality-gates`, similaridade de títulos, geração/validação de slug, assinatura/expiração/adulteração do cookie, parse do JSON da IA (válido, truncado, com campos ausentes).
- `?dry=1` roda a pipeline completa sem gravar e devolve artigo + resultado das travas.
- Com as chaves: uma execução real que gera um rascunho/publicação de teste revisada pelo dono.
- Teste manual de autorização: `/admin/*` e Server Actions sem cookie ⇒ redirecionam/recusam; cookie adulterado/expirado ⇒ recusado.
- `npm run type-check`, `npm run build`, `npm test` sem erros.

## Riscos e premissas

- Senha única compartilhada: sem trilha de quem alterou o quê. Aceito pelo dono.
- Publicação sem revisão humana: mitigada pelas travas, mas conteúdo técnico pode ter imprecisão; o painel permite despublicar/editar a qualquer momento e o interruptor de pausa interrompe a geração.
- Custo/limite das APIs (Firecrawl, DeepSeek) e limite de duração de função na Vercel dependem do plano — conferir na implementação.
- Direitos autorais: o modelo deve sintetizar e citar, nunca copiar trechos longos das fontes (instrução explícita no prompt + trava anti-cópia de 12 palavras consecutivas, descrita nas travas).

## Fora do escopo

Geração de imagens por IA, newsletter, múltiplos usuários/papéis, comentários, tradução.
