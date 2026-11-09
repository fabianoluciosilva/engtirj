-- ─────────────────────────────────────────────────────────────────────────────
-- EngTI RJ — Blog v2: status, fontes, FAQ, temas, execuções e configurações.
-- Execute no SQL Editor do Supabase DEPOIS de supabase/schema.sql.
-- É idempotente: pode ser executado mais de uma vez.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── posts: novos campos ────────────────────────────────────────────────────
alter table public.posts
  add column if not exists status          text   not null default 'draft',
  add column if not exists sources         jsonb  not null default '[]'::jsonb,
  add column if not exists faq             jsonb  not null default '[]'::jsonb,
  add column if not exists keywords        text[] not null default '{}',
  add column if not exists reading_minutes int,
  add column if not exists updated_at      timestamptz not null default now(),
  add column if not exists topic_id        uuid;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'posts_status_check') then
    alter table public.posts
      add constraint posts_status_check check (status in ('draft', 'published', 'archived'));
  end if;
end $$;

-- Migra o que já existe: is_published passa a refletir o status.
update public.posts
   set status = case when is_published then 'published' else 'draft' end
 where status = 'draft' and is_published = true;

-- `is_published` e `published_at` passam a ser derivados de `status` por trigger,
-- então o site público continua lendo `is_published = true` sem mudança.
create or replace function public.posts_before_write()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  if new.status = 'published' then
    new.is_published := true;
    if new.published_at is null then
      new.published_at := now();
    end if;
  else
    new.is_published := false;
  end if;
  return new;
end;
$$;

drop trigger if exists posts_set_published_at on public.posts;
drop trigger if exists posts_before_write on public.posts;
create trigger posts_before_write
  before insert or update on public.posts
  for each row
  execute function public.posts_before_write();

create index if not exists posts_status_idx on public.posts (status, published_at desc);
create index if not exists posts_category_idx on public.posts (category);

-- ─── topics: fila de temas (curados e vindos da pesquisa) ───────────────────
create table if not exists public.topics (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  category   text not null,
  angle      text not null default '',
  keywords   text[] not null default '{}',
  origin     text not null default 'curated' check (origin in ('curated', 'research')),
  status     text not null default 'pending' check (status in ('pending', 'used', 'skipped')),
  priority   int  not null default 0,
  post_id    uuid references public.posts (id) on delete set null,
  created_at timestamptz not null default now()
);
create unique index if not exists topics_title_unique on public.topics (lower(title));
create index if not exists topics_queue_idx on public.topics (status, priority desc, created_at);

-- ─── generation_runs: histórico de cada execução do pipeline ────────────────
create table if not exists public.generation_runs (
  id          uuid primary key default gen_random_uuid(),
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  trigger     text not null default 'cron' check (trigger in ('cron', 'manual')),
  topic_id    uuid references public.topics (id) on delete set null,
  topic_title text,
  outcome     text not null default 'error'
              check (outcome in ('published', 'draft_rejected', 'error', 'skipped')),
  reasons     jsonb not null default '[]'::jsonb,
  post_id     uuid references public.posts (id) on delete set null,
  log         text
);
create index if not exists generation_runs_started_idx on public.generation_runs (started_at desc);

-- ─── settings: linha única ──────────────────────────────────────────────────
create table if not exists public.settings (
  id     int primary key default 1 check (id = 1),
  paused boolean not null default false
);
insert into public.settings (id, paused) values (1, false) on conflict (id) do nothing;

-- ─── RLS ────────────────────────────────────────────────────────────────────
-- Só `posts` publicados são públicos. topics, generation_runs e settings não
-- têm política: ficam acessíveis apenas pela service_role (servidor).
alter table public.topics          enable row level security;
alter table public.generation_runs enable row level security;
alter table public.settings        enable row level security;

drop policy if exists "posts_public_read" on public.posts;
create policy "posts_public_read"
  on public.posts
  for select
  to anon, authenticated
  using (status = 'published');
