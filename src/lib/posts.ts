import { getSupabaseServerClient } from "@/lib/supabase/server";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  tags: string[];
  source_url: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
};

function normalizePost(row: Omit<Post, "tags"> & { tags: string[] | null }): Post {
  return {
    ...row,
    tags: row.tags ?? [],
  };
}

export async function getLatestPosts(limit = 6): Promise<Post[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, content, cover_url, tags, source_url, published_at, created_at, updated_at")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data.map((row) => normalizePost(row as Omit<Post, "tags"> & { tags: string[] | null }));
}

export async function getAllPosts(): Promise<Post[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, content, cover_url, tags, source_url, published_at, created_at, updated_at")
    .order("published_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((row) => normalizePost(row as Omit<Post, "tags"> & { tags: string[] | null }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, content, cover_url, tags, source_url, published_at, created_at, updated_at")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return normalizePost(data as Omit<Post, "tags"> & { tags: string[] | null });
}
