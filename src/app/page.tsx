import Link from "next/link";

import { formatDate } from "@/lib/format-date";
import { getLatestPosts } from "@/lib/posts";
import { SiteChrome } from "@/components/site-chrome";

export const dynamic = "force-dynamic";

export default async function Home() {
  const latest = await getLatestPosts(1);
  const topNews = latest[0];

  return (
    <SiteChrome wide>
      <main>
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black">
          <div className="relative aspect-video w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-bg.jpg"
              alt="hero"
              className="h-full w-full object-contain"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <p className="inline-flex rounded-full border border-cyan-200/40 bg-cyan-300/15 px-3 py-1 text-xs font-medium tracking-[0.16em] text-cyan-100">
                DalKom.ai
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-6xl">
                News
                <span className="block text-cyan-200">Images</span>
              </h1>

              <section className="mt-8 grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 flex justify-end">
                    <Link
                      href="/news"
                      className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:bg-white/20"
                    >
                      더보기
                    </Link>
                  </div>
                  <Link href="/news" className="block rounded-2xl border border-white/20 bg-black/35 p-5 backdrop-blur-sm transition hover:bg-black/45">
                    <h3 className="text-lg font-semibold text-white">News</h3>
                    {topNews ? (
                      <div className="mt-2 text-sm text-slate-200">
                        <p className="line-clamp-1 text-white">{topNews.title}</p>
                        {topNews.excerpt && <p className="mt-1 line-clamp-1 text-xs text-slate-200">{topNews.excerpt}</p>}
                        <p className="mt-1 text-xs text-slate-300">{formatDate(topNews.published_at)}</p>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-300">최신 뉴스 1건이 여기에 표시돼.</p>
                    )}
                  </Link>
                </div>

                <div>
                  <div className="mb-2 flex justify-end">
                    <Link
                      href="/images"
                      className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white transition hover:bg-white/20"
                    >
                      더보기
                    </Link>
                  </div>
                  <Link href="/images" className="block rounded-2xl border border-white/20 bg-black/35 p-5 backdrop-blur-sm transition hover:bg-black/45">
                    <h3 className="text-lg font-semibold text-white">Images</h3>
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
