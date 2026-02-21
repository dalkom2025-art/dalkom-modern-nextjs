# Dalkom Journal (Next.js + Supabase)

Modern blog built with Next.js App Router, TypeScript, Tailwind CSS, and Supabase.

## Features

- Premium modern UI for home, blog index, and post detail pages
- Supabase-backed posts table
- Reusable Supabase clients for server and browser usage
- Reusable post data functions in `src/lib/posts.ts`
- Secure ingest endpoint (`POST /api/ingest`) with shared secret header
- SQL schema at `supabase/schema.sql` (table + indexes + updated_at trigger)

## Routes

- `/` latest posts hero + grid
- `/blog` all posts list
- `/blog/[slug]` post detail page
- `/api/ingest` post ingest/upsert endpoint (POST)

## 1) Environment Variables

Copy `.env.example` to `.env.local` and set values:

```bash
cp .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `INGEST_SECRET`

Never commit real keys.

## 2) Supabase Setup

Run the SQL in `supabase/schema.sql` inside your Supabase SQL editor.

This creates:

- `public.posts` table
- `posts_published_at_idx`
- `posts_tags_gin_idx`
- `set_updated_at` trigger function + update trigger

## 3) Install and Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 4) Ingest API Usage

Endpoint: `POST /api/ingest`

Header:

- `x-ingest-secret: <INGEST_SECRET>`

Body (single post):

```json
{
  "slug": "hello-supabase",
  "title": "Hello Supabase",
  "excerpt": "Short summary",
  "content": "Full post body",
  "cover_url": "https://example.com/cover.jpg",
  "tags": ["nextjs", "supabase"],
  "source_url": "https://example.com/source",
  "published_at": "2026-02-21T12:00:00Z"
}
```

Body (multiple posts):

```json
{
  "posts": [
    {
      "slug": "post-1",
      "title": "Post 1",
      "content": "Body"
    }
  ]
}
```

`slug` is used for upsert conflict handling.

## 5) Build and Deploy

```bash
npm run build
npm start
```

Deploy to Vercel (or similar) and set the same environment variables in your hosting dashboard.

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be exposed client-side.
- The app pages are dynamic so content is fetched at request time.
