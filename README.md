# EngTI RJ

Site e blog automático da EngTI RJ (TI para engenharia, arquitetura e construção civil no Rio de Janeiro).
Next.js 15 (App Router) + Tailwind + Supabase.

```bash
npm install
cp .env.local.example .env.local   # preencha as variáveis
npm run dev                        # http://localhost:3002
npm test                           # testes unitários (vitest)
npm run type-check
npm run build
```

## Blog automático

Um artigo por semana, publicado sozinho (cron da Vercel, segundas às 06:00 UTC):

1. escolhe o próximo tema da fila (`topics`), da categoria menos publicada;
2. pesquisa na web (Firecrawl) e lê as melhores fontes;
3. escreve o artigo (DeepSeek) com base nas fontes;
4. aplica as travas de qualidade (`lib/blog/quality-gates.ts`) e uma verificação factual por uma 2ª chamada da IA;
5. se passar, publica; se não, tenta mais uma vez e, reprovando de novo, salva como **rascunho** com os motivos.

Configuração inicial:

1. Rode `supabase/schema.sql` e depois `supabase/migrations/20261109000000_blog_v2.sql` no SQL Editor do Supabase.
2. Cadastre as variáveis de `.env.local.example` (local e na Vercel).
3. `npm run db:seed` carrega os 56 temas curados.
4. Teste sem gravar: `curl -H "Authorization: Bearer $CRON_SECRET" "https://SEU-SITE/api/cron/generate-post?dry=1"`.

## Painel `/admin`

Acesso por senha única (`ADMIN_PASSWORD`). Páginas: Início (gerar agora, pausar), Artigos (publicar, editar, arquivar, excluir),
Temas (fila, prioridade, pesquisa de novos temas) e Execuções (histórico e motivos de reprovação).

## Outros

- `node scripts/check-copy.mjs` valida o vocabulário do texto do site (sem "dor", limites de repetição).
- Conteúdo do site em `lib/site.ts`, `lib/faq.ts` e `lib/services-content.ts`.
- Especificações e planos em `docs/superpowers/`.
