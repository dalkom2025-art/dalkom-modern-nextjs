import Image from "next/image";

import { SiteChrome } from "@/components/site-chrome";

const galleryItems = [
  {
    src: "/images/gallery-01.jpg",
    title: "DalKom.ai Gallery #1",
  },
];

export default function ImagesPage() {
  return (
    <SiteChrome>
      <main>
        <section className="mb-8">
          <h1 className="text-4xl font-semibold text-white">Images</h1>
        </section>

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <article key={item.src} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="relative aspect-[16/9] w-full">
                <Image src={item.src} alt={item.title} fill className="object-cover" priority />
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-200">{item.title}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </SiteChrome>
  );
}
