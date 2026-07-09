"use client";
import { Section, SectionTitle, GlassPanel } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Sparkles } from "lucide-react";
import type { Sponsor } from "@/lib/content";

const TIERS = [
  {
    key: "platinum" as const,
    label: "Platinum",
    blurb: "Title-level partners powering the Wave.",
    colsClass: "sm:grid-cols-2",
    color: "from-white/30 to-neon-cyan/40",
    glow: "shadow-[0_0_40px_-6px_rgba(34,230,255,0.6)]",
  },
  {
    key: "gold" as const,
    label: "Gold",
    blurb: "Major supporters making the weekend possible.",
    colsClass: "sm:grid-cols-3",
    color: "from-neon-amber/20 to-neon-amber/40",
    glow: "shadow-[0_0_40px_-6px_rgba(255,181,61,0.45)]",
  },
  {
    key: "prize" as const,
    label: "Prize",
    blurb: "Brands funding category prizes.",
    colsClass: "sm:grid-cols-3",
    color: "from-neon-violet/20 to-neon-violet/40",
    glow: "shadow-[0_0_40px_-6px_rgba(168,85,247,0.45)]",
  },
  {
    key: "community" as const,
    label: "Community Partners",
    blurb: "Friends who help amplify our reach.",
    colsClass: "sm:grid-cols-4",
    color: "from-neon-magenta/20 to-neon-magenta/40",
    glow: "shadow-[0_0_40px_-6px_rgba(255,61,245,0.4)]",
  },
];

const FALLBACK: Sponsor[] = [
  { name: "GitHub", tier: "platinum", url: "https://github.com" },
  { name: "Resend", tier: "platinum", url: "https://resend.com" },
  { name: "Vercel", tier: "gold", url: "https://vercel.com" },
  { name: "PostHog", tier: "gold", url: "https://posthog.com" },
  { name: "Linear", tier: "gold", url: "https://linear.app" },
  { name: "Sentry", tier: "prize", url: "https://sentry.io" },
  { name: "PlanetScale", tier: "prize", url: "https://planetscale.com" },
  { name: "Cloudflare", tier: "prize", url: "https://cloudflare.com" },
  { name: "HackClub", tier: "community", url: "https://hackclub.com" },
  { name: "MLH", tier: "community", url: "https://mlh.io" },
  { name: "Devpost", tier: "community", url: "https://devpost.com" },
  { name: "Open Source Camp", tier: "community", url: "https://opensource.camp" },
];

export function SponsorsSection({ sponsors }: { sponsors?: Sponsor[] | null }) {
  const list = sponsors && sponsors.length ? sponsors : FALLBACK;
  return (
    <Section id="sponsors">
      <SectionTitle
        eyebrow="Powered by"
        title="Our Sponsors"
        description="Brands who fuel hackathons and the people who build them."
      />

      <div className="mt-12 grid gap-6">
        {TIERS.map((tier, i) => {
          const tierItems = list.filter((s) => s.tier === tier.key);
          if (!tierItems.length) return null;
          return (
            <Reveal key={tier.key} delay={i * 0.05}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/50">
                      Tier
                    </div>
                    <h3 className="font-display text-2xl mt-0.5">
                      <span className="neon-text">{tier.label}</span>
                    </h3>
                    <p className="text-sm text-white/60">{tier.blurb}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-xs text-white/40">
                    <Sparkles className="h-3 w-3 text-neon-cyan" />
                    {tierItems.length} partners
                  </div>
                </div>
                <div className={`grid gap-3 grid-cols-2 ${tier.colsClass}`}>
                  {tierItems.map((s) => (
                    <SponsorCard
                      key={s.name}
                      sponsor={s}
                      accent={tier.color}
                      glow={tier.glow}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-14 text-center">
        <a
          href="/#partner"
          className="inline-flex items-center gap-2 rounded-md h-12 px-6 font-medium neon-border shadow-neon-soft hover:shadow-neon transition hover:scale-[1.02] active:scale-[0.98]"
        >
          Partner with WaveHack →
        </a>
      </div>
    </Section>
  );
}

function SponsorCard({
  sponsor,
  accent,
  glow,
}: {
  sponsor: Sponsor;
  accent: string;
  glow: string;
}) {
  const inner = (
    <GlassPanel className={`p-5 h-full relative overflow-hidden transition hover:scale-[1.04] group ${glow}`}>
      <div className={`absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl bg-gradient-to-br ${accent} opacity-25`} />
      <div className="relative flex flex-col items-center text-center justify-center min-h-[90px]">
        {sponsor.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sponsor.logoUrl}
            alt={`${sponsor.name} logo`}
            className="max-h-10 max-w-[160px] object-contain opacity-90 group-hover:opacity-100 transition"
          />
        ) : (
          <div className="font-display text-lg sm:text-xl">{sponsor.name}</div>
        )}
        {sponsor.blurb && (
          <div className="mt-2 text-xs text-white/55 line-clamp-2">
            {sponsor.blurb}
          </div>
        )}
      </div>
    </GlassPanel>
  );
  return sponsor.url ? (
    <a href={sponsor.url} target="_blank" rel="noreferrer">
      {inner}
    </a>
  ) : (
    inner
  );
}
