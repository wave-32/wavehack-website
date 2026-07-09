"use client";
import { Section, SectionTitle } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { HeartHandshake, Globe, CalendarClock, Mic } from "lucide-react";
import { VOLUNTEER_ROLES } from "@/lib/types";
import { VolunteerForm } from "@/components/forms/volunteer-form";

export function JoinTeamSection() {
  return (
    <Section id="join">
      <SectionTitle
        eyebrow="Long-term Crew"
        title="Join the WaveHack Team"
        description="We're always looking for organizers, mentors, and partners — long-term roles that shape future Waves."
      />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {VOLUNTEER_ROLES.map((r, i) => (
          <Reveal key={r.value} delay={i * 0.05}>
            <div className="glass grain rounded-2xl p-5 h-full relative overflow-hidden">
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl bg-neon-violet/30" />
              <div className="relative">
                <Badges index={i} />
                <h3 className="mt-3 font-display text-xl">{r.label}</h3>
                <p className="mt-2 text-sm text-white/70">{r.description}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-12 max-w-3xl mx-auto">
        <VolunteerForm />
      </Reveal>
    </Section>
  );
}

function Badges({ index }: { index: number }) {
  const Icon = [Globe, CalendarClock, HeartHandshake][index % 3];
  return (
    <div className="inline-flex h-9 w-9 items-center justify-center rounded-md neon-border text-white/80">
      <Icon className="h-4 w-4 text-neon-cyan" />
    </div>
  );
}
