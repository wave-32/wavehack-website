"use client";
import { Section, SectionTitle, GlassPanel } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Github, Trophy, ExternalLink } from "lucide-react";
import type { Winner } from "@/lib/content";

const FALLBACK: Winner[] = [
  {
    teamName: "Stellar Squad",
    projectName: "AstroAlign",
    description:
      "A real-time satellite trajectory visualizer built with WebGL + Three.js. Open-sourced under MIT, with thousands of stars.",
    members: ["Riya P.", "Marcus L.", "Sofia K."],
    prize: "Grand Prize",
    event: "WaveHack",
    year: 2024,
    github: "https://github.com/",
    demo: "https://astroalign.example.com",
  },
  {
    teamName: "Photon Pirates",
    projectName: "Halo Notify",
    description:
      "Hardware hack — a low-cost wearable that gives blind users ambient distance cues via haptic feedback.",
    members: ["Anika D.", "Theo R."],
    prize: "Best Open Source",
    event: "WaveHack",
    year: 2024,
    github: "https://github.com/",
  },
  {
    teamName: "Quasar",
    projectName: "Quasar Coach",
    description:
      "AI study coach using retrieval-augmented generation over each student's class notes. Built in 36 hours.",
    members: ["Priya N.", "Owen W.", "Mira S.", "Dean H."],
    prize: "Grand Prize",
    event: "CyberWave",
    year: 2025,
    github: "https://github.com/",
    demo: "https://quasar.example.com",
  },
  {
    teamName: "Lunar Loops",
    projectName: "Sleep Orbit",
    description:
      "Adaptive sleep soundscape app that reacts to room light and motion. Won Community Choice.",
    members: ["Hira M.", "Bao T."],
    prize: "Community Choice",
    event: "CyberWave",
    year: 2025,
    github: "https://github.com/",
  },
];

export function WinnersSection({ winners }: { winners?: Winner[] | null }) {
  const list = winners && winners.length ? winners : FALLBACK;
  return (
    <Section id="winners">
      <SectionTitle
        eyebrow="Hall of Fame"
        title="Past Winners"
        description="Projects shipped during previous WaveHack weekends."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((w, i) => (
          <Reveal key={`${w.teamName}-${i}`} delay={(i % 3) * 0.06}>
            <GlassPanel className="p-6 h-full relative overflow-hidden group">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl bg-neon-violet/30" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-widest text-white/50">
                    {w.event} · {w.year}
                  </div>
                  <Trophy className="h-4 w-4 text-neon-amber" />
                </div>
                <div className="font-display text-xl mt-2">
                  <span className="neon-text">{w.projectName}</span>
                </div>
                <div className="text-sm text-white/70">by {w.teamName}</div>

                <p className="mt-3 text-sm text-white/80 leading-relaxed">
                  {w.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {w.members?.map((m) => (
                    <span
                      key={m}
                      className="text-[10px] uppercase tracking-widest text-white/70 px-2 py-0.5 rounded-md bg-white/5 border border-white/10"
                    >
                      {m}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-neon-amber font-medium uppercase tracking-wider">
                    {w.prize}
                  </span>
                  <div className="flex items-center gap-2">
                    {w.github && (
                      <a
                        href={w.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white"
                        aria-label="GitHub repo"
                      >
                        <Github className="h-3.5 w-3.5" /> Repo
                      </a>
                    )}
                    {w.demo && (
                      <a
                        href={w.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white"
                        aria-label="Demo"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </GlassPanel>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
