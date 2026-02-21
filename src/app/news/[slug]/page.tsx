import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteChrome } from "@/components/site-chrome";
import { formatDate } from "@/lib/format-date";
import { getPostBySlug } from "@/lib/posts";

export const dynamic = "force-dynamic";

type NewsDetailProps = {
  params: Promise<{ slug: string }>;
};

export default async function NewsDetailPage({ params }: NewsDetailProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const paragraphs = post.content
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <SiteChrome>
      <main>
        <Link href="/news" className="inline-flex text-sm text-cyan-200 transition hover:text-cyan-100">
          ← News 목록으로
        </Link>

        <article className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-10">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-semibold text-white sm:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="mt-5 text-lg leading-relaxed text-slate-300">{post.excerpt}</p>}

          {post.cover_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_url}
              alt={post.title}
              className="mt-7 h-auto w-full rounded-2xl border border-white/10 object-cover"
            />
          )}

          <div className="mt-8 max-w-none text-slate-200">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="mb-4 leading-8">
                {paragraph}
              </p>
            ))}
          </div>

          {post.source_url && (
            <a
              href={post.source_url}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex text-sm text-cyan-200 transition hover:text-cyan-100"
            >
              원문 보기 ↗
            </a>
          )}
        </article>
      </main>
    </SiteChrome>
  );
}
