import { PostCard } from "@/components/post-card";
import { SiteChrome } from "@/components/site-chrome";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const posts = await getAllPosts();

  return (
    <SiteChrome>
      <main>
        <section className="mb-8">
          <h1 className="text-4xl font-semibold text-white">News</h1>
          <p className="mt-3 max-w-2xl text-slate-300">스크랩된 뉴스가 시간순으로 정렬돼 있어.</p>
        </section>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-300">
            표시할 뉴스가 없어.
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
