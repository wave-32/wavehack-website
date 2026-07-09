"use client";
import { Section, SectionTitle } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import type { EventInfo } from "@/lib/content";
import { Calendar, MapPin, Users, Trophy, Sparkles } from "lucide-react";

const FALLBACK: EventInfo = {
  date: "August 1, 2026",
  iso: "2026-08-01T00:00:00Z",
  location: "Online + select local hubs",
  eligibility: "High-school & university students worldwide",
  teamSize: "1–4 hackers per team",
  rules: [
    "All work must be designed & built during the event",
    "Open-source friendly: licenses required for open-source track",
    "Be kind. Follow the Code of Conduct.",
    "No AI-generated plagiarism — flag your AI usage",
  ],
  build: "Web, mobile, AI, hardware, hardware+software, robotics, games, and more.",
  schedule: [
    { time: "Aug 1 · 9:00 AM", label: "Opening keynote & teaming" },
    { time: "Aug 1 · 11:00 AM", label: "Hacking begins" },
    { time: "Aug 2 · 4:00 PM", label: "Hacking ends / submissions lock" },
    { time: "Aug 2 · 6:00 PM", label: "Demos & judging" },
    { time: "Aug 2 · 9:00 PM", label: "Awards & closing" },
  ],
  prizes: [
    { name: "Grand Prize", amount: "$300", description: "Best overall hack" },
    { name: "Best Open Source", amount: "$200", description: "Most useful OSS" },
    { name: "Best Beginner Hack", amount: "$100", description: "By first-time hackers" },
    { name: "Community Choice", amount: "$100", description: "Voted by participants" },
  ],
};

// Static accent map — used so Tailwind JIT can pick the actual class names.
// Adding to this union/switch MUST use only existing tokens in tailwind.config.
type AccentKey = "cyan" | "violet" | "magenta" | "lime";
const ACCENT: Record<
  AccentKey,
  { text: string; blur: string }
> = {
  cyan: { text: "text-neon-cyan", blur: "bg-neon-cyan/30" },
  violet: { text: "text-neon-violet", blur: "bg-neon-violet/30" },
  magenta: { text: "text-neon-magenta", blur: "bg-neon-magenta/30" },
  lime: { text: "text-neon-lime", blur: "bg-neon-lime/30" },
};

export function EventSection({ data }: { data?: EventInfo | null }) {
  const e = data ?? FALLBACK;
  const tiles: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; accent: AccentKey }[] = [
    { icon: Calendar, label: "Date", value: e.date, accent: "cyan" },
    { icon: MapPin, label: "Location", value: e.location, accent: "violet" },
    { icon: Users, label: "Eligibility", value: e.eligibility ?? "Open worldwide", accent: "magenta" },
    { icon: Sparkles, label: "Team Size", value: e.teamSize ?? "1–4", accent: "lime" },
  ];
  return (
    <Section id="event" innerClassName="pt-12">
      <SectionTitle
        eyebrow="Mission Briefing"
        title="Event Information"
        description="The details you need to plan your build weekend."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tiles.map((it, i) => {
          const Icon = it.icon;
          const accent = ACCENT[it.accent];
          return (
            <Reveal key={it.label} delay={i * 0.05}>
              <div className="glass grain rounded-2xl p-5 h-full relative overflow-hidden">
                <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl ${accent.blur}`} />
                <Icon className={`h-5 w-5 ${accent.text}`} />
                <div className="mt-4 text-[10px] uppercase tracking-widest text-white/50">
                  {it.label}
                </div>
                <div className="mt-1 font-display text-lg">{it.value}</div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <div className="glass grain rounded-2xl p-6 sm:p-8 h-full">
            <h3 className="font-display text-xl">What you can build</h3>
            <p className="mt-2 text-white/70 text-sm">{e.build}</p>

            <h3 className="font-display text-xl mt-8">Schedule</h3>
            <ol className="mt-3 relative border-l border-white/10 pl-5 space-y-4">
              {(e.schedule ?? []).map((s, i) => (
                <li key={i}>
                  <span className="absolute -left-1.5 mt-2 h-3 w-3 rounded-full bg-neon-cyan shadow-[0_0_0_4px_rgba(34,230,255,0.18)]" />
                  <div className="text-xs uppercase tracking-widest text-neon-cyan">
                    {s.time}
                  </div>
                  <div className="text-sm text-white/90">{s.label}</div>
                </li>
              ))}
            </ol>

            <h3 className="font-display text-xl mt-8">Rules</h3>
            <ul className="mt-3 grid gap-2 text-sm text-white/80">
              {(e.rules ?? []).map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-neon-cyan/80">▍</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="glass grain rounded-2xl p-6 sm:p-8 h-full">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-neon-amber" />
              <h3 className="font-display text-xl">Prizes</h3>
            </div>
            <div className="mt-4 grid gap-3">
              {(e.prizes ?? []).map((p, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="font-display neon-text">{p.amount}</div>
                  </div>
                  {p.description && (
                    <div className="text-xs text-white/60 mt-1">
                      {p.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
