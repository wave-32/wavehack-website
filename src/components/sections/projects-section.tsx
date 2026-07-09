"use client";
import { Section, SectionTitle } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";

const HIGHLIGHTS = [
  {
    title: "Live 3D Object — Rotating Planet",
    blurb: "Drag to rotate. Hover to glow.",
    type: "WebGL",
  },
  {
    title: "Animated Project Card",
    blurb: "Tilts with cursor. Glass + neon.",
    type: "Component",
  },
  {
    title: "Particle Gallery",
    blurb: "Browse projects in 3D space.",
    type: "Concept",
  },
  {
    title: "Winner Showcase",
    blurb: "See previous winners in motion.",
    type: "Gallery",
  },
];

export function ProjectsSection() {
  return (
    <Section id="projects">
      <SectionTitle
        eyebrow="Project Showcase"
        title="Interactive 3D Gallery"
        description="A glimpse at what the 3D experience looks like in production."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.05}>
            <div className="relative glass grain rounded-2xl p-6 h-[260px] overflow-hidden group cursor-pointer transition hover:scale-[1.02]">
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full blur-3xl bg-neon-cyan/30 group-hover:bg-neon-violet/40 transition" />
              <div className="absolute inset-0 mask-radial flex items-center justify-center">
                <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-neon-cyan via-neon-violet to-neon-magenta shadow-neon animate-float" style={{ animationDelay: `${i * 0.4}s` }} />
              </div>
              <div className="relative h-full flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-widest text-white/50">
                  {p.type}
                </span>
                <div className="mt-1 font-display text-lg">{p.title}</div>
                <div className="mt-1 text-xs text-white/60">{p.blurb}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
