import Link from "next/link";

import { PostCard } from "@/components/post-card";
import { SiteChrome } from "@/components/site-chrome";
import { getLatestPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const latestPosts = await getLatestPosts(6);

  return (
    <SiteChrome>
      <main>
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10">
          <p className="inline-flex rounded-full border border-cyan-200/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium tracking-[0.16em] text-cyan-100">
            MODERN BLOG PLATFORM
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Thoughtful writing, engineered with Next.js and Supabase.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Fresh articles with a premium reading experience, fast page loads, and direct Supabase-powered updates.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:opacity-90"
            >
              Explore all posts
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Latest Posts</h2>
            <Link href="/blog" className="text-sm text-cyan-200 transition hover:text-cyan-100">
              View all
            </Link>
          </div>

          {latestPosts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-300">
              No posts yet. Add or update rows directly in Supabase `posts` table.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {latestPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
    </SiteChrome>
  );
}
