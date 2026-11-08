-- ─────────────────────────────────────────────────────────────────────────────
-- EngTI RJ — schema do blog (Supabase / PostgreSQL)
-- Execute no SQL Editor do projeto Supabase do blog.
-- ─────────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

create table if not exists public.posts (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  title             text not null,
  meta_description  text,
  content_md        text,          -- Markdown (renderizado no Server Component)
  category          text,
  published_at      timestamptz,
  is_published      boolean not null default false,
  cover_url         text,
  created_at        timestamptz not null default now()
);

-- Índice para a listagem do blog (publicados, mais recentes primeiro).
create index if not exists posts_published_idx
  on public.posts (is_published, published_at desc);

-- ─── Row Level Security ──────────────────────────────────────────────────────
-- A landing usa a chave ANON para leitura pública. Só posts publicados podem
-- ser lidos anonimamente. Escrita só acontece via service_role (cron/seed),
-- que faz bypass de RLS.
alter table public.posts enable row level security;

drop policy if exists "posts_public_read" on public.posts;
create policy "posts_public_read"
  on public.posts
  for select
  to anon, authenticated
  using (is_published = true);

-- ─── Trigger de updated_at não é necessário para o blog (não há edição), mas
-- ─── o published_at é preenchido automaticamente ao publicar, se vazio.
create or replace function public.posts_set_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.is_published and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists posts_set_published_at on public.posts;
create trigger posts_set_published_at
  before insert or update on public.posts
  for each row
  execute function public.posts_set_published_at();
