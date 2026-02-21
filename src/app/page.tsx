import Link from "next/link";

import { SiteChrome } from "@/components/site-chrome";

export default function Home() {
  return (
    <SiteChrome>
      <main>
        <section
          className="relative overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(2,6,23,0.28), rgba(2,6,23,0.35)), url('/images/hero-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative min-h-[360px] flex items-end">
            <div>
              <p className="inline-flex rounded-full border border-cyan-200/40 bg-cyan-300/15 px-3 py-1 text-xs font-medium tracking-[0.16em] text-cyan-100">
                DalKom.ai
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                News
                <span className="block text-cyan-200">Images</span>
              </h1>
            </div>
          </div>
        </section>

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
            <Link href="/news" className="block rounded-2xl border border-white/20 bg-white/5 p-5 transition hover:bg-white/10">
              <h3 className="text-lg font-semibold text-white">News</h3>
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
            <Link href="/images" className="block rounded-2xl border border-white/20 bg-white/5 p-5 transition hover:bg-white/10">
              <h3 className="text-lg font-semibold text-white">Images</h3>
            </Link>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
