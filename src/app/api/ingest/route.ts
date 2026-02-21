import { NextRequest, NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase/server";

type IngestInput = {
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  cover_url?: string | null;
  tags?: string[];
  source_url?: string | null;
  published_at?: string;
};

type IngestBody =
  | IngestInput
  | {
      posts: IngestInput[];
    };

export async function POST(request: NextRequest) {
  const ingestSecret = process.env.INGEST_SECRET;
  if (!ingestSecret) {
    return NextResponse.json({ error: "Server ingest secret is not configured" }, { status: 500 });
  }

  const receivedSecret = request.headers.get("x-ingest-secret");
  if (receivedSecret !== ingestSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: IngestBody;
  try {
    body = (await request.json()) as IngestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const items = Array.isArray((body as { posts?: unknown }).posts)
    ? (body as { posts: IngestInput[] }).posts
    : [body as IngestInput];

  if (items.length === 0) {
    return NextResponse.json({ error: "No posts provided" }, { status: 400 });
  }

  const payload = items.map((post) => ({
    slug: post.slug?.trim(),
    title: post.title?.trim(),
    excerpt: post.excerpt ?? null,
    content: post.content,
    cover_url: post.cover_url ?? null,
    tags: post.tags ?? [],
    source_url: post.source_url ?? null,
    published_at: post.published_at,
  }));

  const hasInvalid = payload.some((post) => !post.slug || !post.title || !post.content?.trim());
  if (hasInvalid) {
    return NextResponse.json(
      { error: "Each post requires non-empty slug, title, and content" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase server credentials are not configured" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("posts")
    .upsert(payload, { onConflict: "slug" })
    .select("id, slug");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, count: data?.length ?? 0, posts: data ?? [] });
}

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      message: "Use POST with x-ingest-secret header.",
    },
    { status: 405 },
  );
}
