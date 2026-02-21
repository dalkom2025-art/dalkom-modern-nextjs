import Link from "next/link";

import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

type NewsPageProps = {
  searchParams: Promise<{
    source?: string;
  }>;
};

function sourceType(url: string | null): "github" | "reddit" | "other" {
  if (!url) return "other";
  const u = url.toLowerCase();
  if (u.includes("github")) return "github";
  if (u.includes("reddit")) return "reddit";
  return "other";
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const posts = await getAllPosts();
  const sp = await searchParams;
  const selected = (sp.source || "all").toLowerCase();

  const githubCount = posts.filter((p) => sourceType(p.source_url) === "github").length;
  const redditCount = posts.filter((p) => sourceType(p.source_url) === "reddit").length;

  const filtered =
    selected === "github"
      ? posts.filter((p) => sourceType(p.source_url) === "github")
      : selected === "reddit"
      ? posts.filter((p) => sourceType(p.source_url) === "reddit")
      : posts;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
      <section className="rounded-2xl border border-black/10 bg-[#f6f1e9] p-6 text-[#222]">
        <h1 className="text-3xl font-bold">오늘의 최신 AI 소식</h1>
      </section>

      <section className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link
          href="/news"
          className={`rounded-full px-3 py-1 ${selected === "all" ? "bg-[#1b1b1b] text-white" : "bg-[#f0e8dd] text-[#5b5148]"}`}
        >
          전체 ({posts.length})
        </Link>
        <Link
          href="/news?source=github"
          className={`rounded-full px-3 py-1 ${selected === "github" ? "bg-[#1b1b1b] text-white" : "bg-[#f0e8dd] text-[#5b5148]"}`}
        >
          깃허브 ({githubCount})
        </Link>
        <Link
          href="/news?source=reddit"
          className={`rounded-full px-3 py-1 ${selected === "reddit" ? "bg-[#1b1b1b] text-white" : "bg-[#f0e8dd] text-[#5b5148]"}`}
        >
          레딧 ({redditCount})
        </Link>
      </section>

      <p className="mt-3 text-sm text-[#6b625a]">총 {filtered.length}개의 기사</p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-[#eadfce] bg-[#fffaf4] p-6 text-sm text-[#6b625a]">표시할 뉴스가 없어.</div>
      ) : (
        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((post) => (
            <article key={post.id} className="rounded-2xl border border-[#eadfce] bg-[#fffaf4] p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <h2 className="line-clamp-2 text-xl font-semibold leading-snug text-[#1f1a16]">{post.title}</h2>
                <span className="rounded-full bg-[#f7ebc8] px-2 py-1 text-xs text-[#9a6b00]">
                  {sourceType(post.source_url) === "github" ? "깃허브" : sourceType(post.source_url) === "reddit" ? "레딧" : "AI"}
                </span>
              </div>

              {post.excerpt && <p className="mt-3 line-clamp-4 text-sm leading-6 text-[#5c5147]">{post.excerpt}</p>}

              <div className="mt-4 flex items-center justify-between text-xs text-[#7c7166]">
                <span>{new URL(post.source_url || "https://example.com").hostname.replace("www.", "")}</span>
                <span>{post.published_at.slice(0, 10)}</span>
              </div>

              <Link
                href={`/news/${post.slug}`}
                className="mt-3 inline-flex rounded-md bg-[#2f261f] px-3 py-1.5 text-sm font-semibold text-[#fff8ef] transition hover:bg-[#1f1914]"
              >
                원문 보기
              </Link>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
