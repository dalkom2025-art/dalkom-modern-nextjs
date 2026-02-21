import { SiteChrome } from "@/components/site-chrome";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function ImagesPage() {
  const posts = await getAllPosts();
  const imagePosts = posts.filter((p) => p.cover_url);

  return (
    <SiteChrome>
      <main>
        <section className="mb-8">
          <h1 className="text-4xl font-semibold text-white">Images</h1>
          <p className="mt-3 max-w-2xl text-slate-300">뉴스에 연결된 이미지를 모아 보여줘.</p>
        </section>

        {imagePosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-300">
            아직 표시할 이미지가 없어.
          </div>
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {imagePosts.map((post) => (
              <article key={post.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.cover_url!} alt={post.title} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <p className="line-clamp-2 text-sm text-slate-200">{post.title}</p>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </SiteChrome>
  );
}
