import { SiteChrome } from "@/components/site-chrome";

export default function ImagesPage() {
  return (
    <SiteChrome>
      <main>
        <section className="mb-8">
          <h1 className="text-4xl font-semibold text-white">Images</h1>
        </section>

        <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-300">
          이미지 업로드 대기 중
        </div>
      </main>
    </SiteChrome>
  );
}
