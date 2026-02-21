create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null,
  cover_url text,
  tags text[] default '{}',
  source_url text,
  published_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists posts_published_at_idx on public.posts (published_at desc);
create index if not exists posts_tags_gin_idx on public.posts using gin (tags);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_posts_set_updated_at on public.posts;

create trigger trg_posts_set_updated_at
before update on public.posts
for each row
execute function public.set_updated_at();
