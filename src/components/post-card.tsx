import Link from "next/link";

import { formatDate } from "@/lib/format-date";
import type { Post } from "@/lib/posts";

export function PostCard({ post }: Readonly<{ post: Post }>) {
  return (
    <article className="group rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition hover:border-cyan-300/40 hover:bg-white/10">
      <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
        {post.tags.length > 0 && <span>{post.tags[0]}</span>}
      </div>

      <h3 className="text-xl font-semibold text-white transition group-hover:text-cyan-200">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      {post.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-300">{post.excerpt}</p>}

      <Link
        href={`/blog/${post.slug}`}
        className="mt-5 inline-flex text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
      >
        Read article →
      </Link>
    </article>
  );
}
