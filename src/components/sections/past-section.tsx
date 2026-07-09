"use client";
import { Section, SectionTitle, GlassPanel } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

const PAST = [
  {
    name: "WaveHack",
    year: "2024",
    url: "https://wavehack.devpost.com/",
    blurb:
      "Our pilot. 76 hackers shipped software across web, AI, and hardware. Kickoff of the Wave.",
    color: "from-neon-cyan to-neon-violet",
    planet: "🪐",
  },
  {
    name: "CyberWave",
    year: "2025",
    url: "https://cyberwave.devpost.com/",
    blurb:
      "The deep-space edition. 54 hackers competed on futuristic themes with a $700 prize pool.",
    color: "from-neon-violet to-neon-magenta",
    planet: "🌌",
  },
  {
    name: "WaveHack · 2026",
    year: "2026",
    url: "/",
    blurb:
      "Coming soon. Bigger prize pool, more judges, more mentors. You're looking at it.",
    color: "from-neon-magenta to-neon-amber",
    planet: "🚀",
  },
];

export function PastSection() {
  return (
    <Section id="past">
      <SectionTitle
        eyebrow="Mission Log"
        title="Past WaveHacks"
        description="A quick descent through the previous WaveHack events."
      />
      <div className="mt-12 relative">
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent" />
        <div className="grid gap-6 lg:grid-cols-3">
          {PAST.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <a
                href={p.url}
                target={p.url.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="block h-full group"
              >
                <GlassPanel className="p-6 sm:p-8 h-full relative overflow-hidden transition group-hover:scale-[1.01]">
                  <div className={`absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl bg-gradient-to-br ${p.color} opacity-30`} />
                  <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="relative">
                    <div className="text-5xl drop-shadow-[0_0_18px_rgba(34,230,255,0.35)] mb-2">
                      {p.planet}
                    </div>
                    <div className="text-xs uppercase tracking-widest text-white/50">
                      Event · {p.year}
                    </div>
                    <div className="font-display text-2xl mt-1">
                      <span className="neon-text">{p.name}</span>
                    </div>
                    <p className="mt-3 text-sm text-white/70">{p.blurb}</p>
                    <div className="mt-4 text-xs text-neon-cyan inline-flex items-center gap-1">
                      {p.url.startsWith("http") ? "View on Devpost" : "Coming soon"} →
                    </div>
                  </div>
                </GlassPanel>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
