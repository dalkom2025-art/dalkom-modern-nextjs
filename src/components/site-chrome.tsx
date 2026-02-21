import Link from "next/link";

export function SiteChrome({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#0f172a_0%,#020617_45%,#02020f_100%)] text-slate-100">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-16 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-6 pb-12 pt-8 sm:px-10">
        <header className="mb-10 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
          <Link href="/" className="text-sm font-semibold tracking-[0.18em] text-cyan-200">
            DalKom.ai
          </Link>
          <nav className="flex items-center gap-5 text-sm text-slate-300">
            <Link className="transition hover:text-white" href="/news">
              News
            </Link>
            <Link className="transition hover:text-white" href="/images">
              Images
            </Link>
            <a
              className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-white/20"
              href="https://open.kakao.com/o/szoUF5zg"
              target="_blank"
              rel="noreferrer"
            >
              Contact Us
            </a>
          </nav>
        </header>

        {children}

        <footer className="mt-16 border-t border-white/10 pt-6 text-sm text-slate-400">
          © {new Date().getFullYear()} DalKom.ai
        </footer>
      </div>
    </div>
  );
}
