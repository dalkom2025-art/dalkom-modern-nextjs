# Dalkom Journal (Next.js + Supabase)

Modern blog built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase.

## Features

- Premium modern UI for home, blog index, and post detail pages
- Supabase-backed `posts` table
- Reusable Supabase clients for server and browser usage
- Reusable post data functions in `src/lib/posts.ts`
- SQL schema at `supabase/schema.sql` (table + indexes + updated_at trigger)
- **Direct update workflow**: write posts directly to Supabase (no ingest API)

## Routes

- `/` latest posts hero + grid
- `/blog` all posts list
- `/blog/[slug]` post detail page

## 1) Environment Variables

Copy `.env.example` to `.env.local` and set values:

```bash
cp .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Never commit real keys.

## 2) Supabase Setup

Run the SQL in `supabase/schema.sql` inside your Supabase SQL editor.

This creates:

- `public.posts` table
- `posts_published_at_idx`
- `posts_tags_gin_idx`
- `set_updated_at` trigger function + update trigger

## 3) Update Posts (Direct)

Use Supabase Table Editor or SQL to insert/update posts directly in `public.posts`.

Example SQL:

```sql
insert into public.posts (slug, title, excerpt, content, tags, source_url)
values (
  'hello-supabase',
  'Hello Supabase',
  'Short summary',
  'Full post body',
  array['nextjs','supabase'],
  'https://example.com/source'
)
on conflict (slug)
do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  tags = excluded.tags,
  source_url = excluded.source_url,
  updated_at = now();
```

## 4) Install and Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 5) Build and Deploy

```bash
npm run build
npm start
```

Deploy to Vercel (or similar) and set the same environment variables in your hosting dashboard.

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be exposed client-side.
- The app pages are dynamic so content is fetched at request time.
