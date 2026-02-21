export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070f] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10 sm:px-10">
        <header className="flex items-center justify-between">
          <div className="rounded-full border border-white/20 bg-white/5 px-4 py-1 text-sm tracking-[0.2em] text-cyan-200 backdrop-blur">
            DALKOM STUDIO
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/90 backdrop-blur transition hover:bg-white/10"
          >
            GitHub
          </a>
        </header>

        <section className="grid flex-1 items-center gap-12 py-12 md:grid-cols-2">
          <div>
            <p className="mb-4 inline-block rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
              MODERN NEXT.JS EXPERIENCE
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              더 고급스럽고 모던한
              <span className="block bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                프리미엄 웹 경험
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Next.js App Router 기반으로 재구성된 고성능 사이트. 세련된 비주얼,
              빠른 로딩, 확장 가능한 구조로 운영과 업데이트가 쉬운 형태로 설계했습니다.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
              >
                프로젝트 보기
              </a>
              <a
                href="#"
                className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/10"
              >
                문의하기
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            {[
              ["Performance", "최적화된 렌더링과 빠른 초기 로딩"],
              ["Design System", "일관된 컴포넌트와 감각적인 UI"],
              ["Deployment Ready", "GitHub + Vercel 배포 흐름 즉시 적용"],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl"
              >
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-white/70">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/10 pt-6 text-sm text-white/60">
          © {new Date().getFullYear()} Dalkom. Crafted with Next.js.
        </footer>
      </main>
    </div>
  );
}
