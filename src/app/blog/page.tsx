import { PostCard } from "@/components/post-card";
import { SiteChrome } from "@/components/site-chrome";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <SiteChrome>
      <main>
        <section className="mb-8">
          <h1 className="text-4xl font-semibold text-white">All Posts</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Every published article from the Supabase `posts` table.
          </p>
        </section>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-300">
            No published posts available.
          </div>
        ) : (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>
        )}
      </main>
    </SiteChrome>
  );
}
