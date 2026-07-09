"use client";
import { Section, SectionTitle } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Image as ImageIcon } from "lucide-react";
import type { GalleryItem } from "@/lib/content";

const PLACEHOLDERS: GalleryItem[] = [
  { title: "Opening Ceremony 2024", caption: "WaveHack · kickoff night", imageUrl: "" },
  { title: "Hackers in deep focus", caption: "Final 4 hours of WaveHack I", imageUrl: "" },
  { title: "CyberWave Stage", caption: "CyberWave · 2025", imageUrl: "" },
  { title: "Demo Day Winners", caption: "Stellar Squad + Halo Notify", imageUrl: "" },
  { title: "Workshop with Vercel", caption: "Ship faster with Next.js", imageUrl: "" },
  { title: "Closing Vibes", caption: "Group photo · CyberWave", imageUrl: "" },
];

export function GallerySection({ items }: { items?: GalleryItem[] | null }) {
  const list = items && items.length ? items : PLACEHOLDERS;
  return (
    <Section id="gallery">
      <SectionTitle
        eyebrow="Media"
        title="Behind the scenes"
        description="Moments from previous WaveHacks. Add real photos via the admin dashboard."
      />
      <div className="mt-12 grid gap-4 grid-cols-2 md:grid-cols-3">
        {list.map((it, i) => (
          <Reveal key={i} delay={(i % 3) * 0.05}>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04] backdrop-blur-md aspect-[4/3] group">
              {it.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={it.imageUrl}
                  alt={it.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-grid-radial flex items-center justify-center">
                  <ImageIcon className="h-10 w-10 text-white/30 group-hover:text-neon-cyan transition" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-space-950/95 via-space-950/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="font-display text-sm">{it.title}</div>
                {it.caption && (
                  <div className="text-xs text-white/60">{it.caption}</div>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
