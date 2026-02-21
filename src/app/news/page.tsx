import Link from "next/link";

import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

const CATEGORIES = ["전체", "AI기술", "증시금융", "산업·경제", "연구·기술"];

export default async function NewsPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
      <section className="rounded-2xl border border-black/10 bg-[#f6f1e9] p-6 text-[#222]">
        <h1 className="text-3xl font-bold">뉴스 카드 뷰어</h1>
        <p className="mt-2 text-sm text-[#6b625a]">오늘의 주요 뉴스를 카테고리별로 확인하세요</p>
      </section>

      <section className="mt-6 flex flex-wrap gap-2 text-sm">
        {CATEGORIES.map((c, idx) => (
          <button
            key={c}
            className={`rounded-full px-3 py-1 ${
              idx === 0 ? "bg-[#1b1b1b] text-white" : "bg-[#f0e8dd] text-[#5b5148]"
            }`}
          >
            {c}
          </button>
        ))}
      </section>

      <p className="mt-3 text-sm text-[#6b625a]">총 {posts.length}개의 기사</p>

      {posts.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[#eadfce] bg-[#fffaf4] p-6 text-sm text-[#6b625a]">표시할 뉴스가 없어.</div>
      ) : (
        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="rounded-2xl border border-[#eadfce] bg-[#fffaf4] p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h2 className="line-clamp-2 text-xl font-semibold leading-snug text-[#1f1a16]">{post.title}</h2>
                <span className="rounded-full bg-[#f7ebc8] px-2 py-1 text-xs text-[#9a6b00]">산업·경제</span>
              </div>

              {post.excerpt && <p className="mt-3 line-clamp-4 text-sm leading-6 text-[#5c5147]">{post.excerpt}</p>}

              <div className="mt-4 flex items-center justify-between text-xs text-[#7c7166]">
                <span>{new URL(post.source_url || "https://example.com").hostname.replace("www.", "")}</span>
                <span>{post.published_at.slice(0, 10)}</span>
              </div>

              <Link href={`/news/${post.slug}`} className="mt-3 inline-flex text-sm font-medium text-[#3a2f24] underline-offset-2 hover:underline">
                기사 보기
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
