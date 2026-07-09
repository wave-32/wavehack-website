"use client";
import { Section, SectionTitle, GlassPanel } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { useEffect, useState } from "react";
import type { StatItem } from "@/lib/content";

const FALLBACK: StatItem[] = [
  { label: "Hackers Registered (WaveHack I)", value: 76, suffix: "+", blurb: "From our first pilot event" },
  { label: "Hackers Registered (WaveHack II)", value: 54, suffix: "+", blurb: "Our second, CyberWave edition" },
  { label: "Open-Source Projects Created", value: 50, suffix: "+", blurb: "Live repositories shipped" },
  { label: "Total Prizes Awarded", value: 700, prefix: "$", suffix: "+", blurb: "Across all events to date" },
];

export function StatsSection({ stats }: { stats?: StatItem[] | null }) {
  const [items, setItems] = useState<StatItem[]>(FALLBACK);
  useEffect(() => {
    if (stats && stats.length) setItems(stats);
  }, [stats]);

  return (
    <Section id="stats">
      <SectionTitle
        eyebrow="Traction"
        title="The wave so far"
        description="Numbers from our previous two Waves. Updated each event."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s, i) => (
          <Reveal key={`${s.label}-${i}`} delay={i * 0.06}>
            <GlassPanel className="p-6 h-full relative overflow-hidden">
              <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full blur-3xl bg-neon-cyan/30" />
              <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full blur-3xl bg-neon-violet/20" />
              <div className="relative">
                <div className="font-display text-5xl sm:text-6xl neon-text">
                  <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <div className="mt-2 text-sm font-medium text-white">
                  {s.label}
                </div>
                {s.blurb && (
                  <div className="mt-1 text-xs text-white/55">{s.blurb}</div>
                )}
              </div>
            </GlassPanel>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
