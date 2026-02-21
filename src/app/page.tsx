import Link from "next/link";

import { PostCard } from "@/components/post-card";
import { SiteChrome } from "@/components/site-chrome";
import { getLatestPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const latestNews = await getLatestPosts(3);

  return (
    <SiteChrome>
      <main>
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10">
          <p className="inline-flex rounded-full border border-cyan-200/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium tracking-[0.16em] text-cyan-100">
            LANDING PAGE
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            뉴스와 이미지를 한 곳에서 보는
            <span className="block text-cyan-200">모던 포털</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            상단 메뉴에서 News / Images로 바로 이동하고, 업데이트된 스크랩 결과를 빠르게 확인할 수 있어.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link href="/news" className="rounded-2xl border border-white/20 bg-white/5 p-5 transition hover:bg-white/10">
              <h3 className="text-lg font-semibold text-white">News</h3>
              <p className="mt-2 text-sm text-slate-300">스크랩된 최신 뉴스 목록과 상세 보기</p>
            </Link>
            <Link href="/images" className="rounded-2xl border border-white/20 bg-white/5 p-5 transition hover:bg-white/10">
              <h3 className="text-lg font-semibold text-white">Images</h3>
              <p className="mt-2 text-sm text-slate-300">뉴스에 연결된 이미지를 카드형으로 보기</p>
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Latest News</h2>
            <Link href="/news" className="text-sm text-cyan-200 transition hover:text-cyan-100">
              전체 보기
            </Link>
          </div>

          {latestNews.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-300">
              아직 뉴스가 없어. Supabase `posts` 테이블에 데이터를 추가해줘.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {latestNews.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
    </SiteChrome>
  );
}
