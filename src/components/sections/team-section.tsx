"use client";
import { Section, SectionTitle, GlassPanel } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { Award, Mic, Wrench, Users } from "lucide-react";
import type { TeamMember } from "@/lib/content";

const ORG: TeamMember[] = [
  {
    name: "WaveHack Org Team",
    role: "Founders & Organizers",
    bio: "A small team of student organizers building WaveHack from the ground up in 2024 — and growing the Wave ever since.",
    links: [
      { label: "GitHub", href: "https://github.com/" },
      { label: "Email", href: "mailto:dheepak209@gmail.com" },
    ],
  },
];

const JUDGES: TeamMember[] = [
  { name: "TBA", role: "Head Judge", bio: "Industry expert — to be announced." },
  { name: "TBA", role: "Technical Judge", bio: "Open-source maintainer — to be announced." },
  { name: "TBA", role: "Design Judge", bio: "Designer & DX advocate — to be announced." },
];

const MENTORS: TeamMember[] = [
  { name: "TBA", role: "AI / ML Mentor", bio: "Helps teams with model + tooling decisions." },
  { name: "TBA", role: "Web Mentor", bio: "Frontend + full-stack expertise." },
  { name: "TBA", role: "Hardware Mentor", bio: "Robotics, IoT, embedded." },
];

const SPEAKERS: TeamMember[] = [
  { name: "TBA", role: "Opening Keynote", bio: "Set the tone for the weekend." },
  { name: "TBA", role: "Sponsor Talk", bio: "Mini talk during hacker downtime." },
];

export function TeamSection({
  team,
  judges,
  mentors,
  speakers,
}: {
  team?: TeamMember[] | null;
  judges?: TeamMember[] | null;
  mentors?: TeamMember[] | null;
  speakers?: TeamMember[] | null;
}) {
  return (
    <>
      <Section id="team">
        <SectionTitle
          eyebrow="Crew"
          title="Meet the Organizers"
          description="The humans behind the WaveHack experience."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(team && team.length ? team : ORG).map((m, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <GlassPanel className="p-6 h-full relative overflow-hidden">
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl bg-neon-cyan/30" />
                <div className="relative flex items-center gap-4">
                  <Avatar url={m.photoUrl} name={m.name} />
                  <div>
                    <div className="font-display text-lg">{m.name}</div>
                    <div className="text-xs uppercase tracking-widest text-neon-cyan">
                      {m.role}
                    </div>
                  </div>
                </div>
                <p className="relative mt-4 text-sm text-white/75">{m.bio}</p>
                {m.links && (
                  <div className="relative mt-4 flex flex-wrap gap-3 text-xs">
                    {m.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        className="text-white/70 hover:text-white"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {l.label} →
                      </a>
                    ))}
                  </div>
                )}
              </GlassPanel>
            </Reveal>
          ))}
        </div>
      </Section>

      <PeopleSection
        id="judges"
        eyebrow="Judges · Mentors · Speakers"
        title="Jury & Support"
        description="The people evaluating and supporting your build."
        icon={<Award className="h-4 w-4 text-neon-amber" />}
        groups={[
          {
            label: "Judges",
            icon: <Award className="h-4 w-4 text-neon-amber" />,
            items: judges && judges.length ? judges : JUDGES,
          },
          {
            label: "Mentors",
            icon: <Wrench className="h-4 w-4 text-neon-cyan" />,
            items: mentors && mentors.length ? mentors : MENTORS,
          },
          {
            label: "Speakers",
            icon: <Mic className="h-4 w-4 text-neon-violet" />,
            items: speakers && speakers.length ? speakers : SPEAKERS,
          },
        ]}
      />
    </>
  );
}

function PeopleSection({
  id,
  eyebrow,
  title,
  description,
  icon,
  groups,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  groups: { label: string; icon: React.ReactNode; items: TeamMember[] }[];
}) {
  return (
    <Section id={id}>
      <SectionTitle
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <div className="mt-12 grid gap-10">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="flex items-center gap-2 mb-4">
              {g.icon}
              <h3 className="font-display text-xl">{g.label}</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((m, i) => (
                <Reveal key={i} delay={(i % 3) * 0.05}>
                  <GlassPanel className="p-5 h-full relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full blur-3xl bg-neon-cyan/20" />
                    <div className="relative flex items-center gap-3">
                      <Avatar url={m.photoUrl} name={m.name} small />
                      <div>
                        <div className="font-medium text-sm">{m.name}</div>
                        <div className="text-xs text-white/60">{m.role}</div>
                      </div>
                    </div>
                    <p className="relative mt-3 text-xs text-white/70 line-clamp-3">
                      {m.bio}
                    </p>
                  </GlassPanel>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Avatar({ url, name, small = false }: { url?: string; name: string; small?: boolean }) {
  const size = small ? "h-10 w-10" : "h-14 w-14";
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name}
        className={`${size} rounded-full object-cover border border-white/10`}
      />
    );
  }
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={`${size} rounded-full flex items-center justify-center bg-gradient-to-br from-neon-cyan/30 via-neon-violet/30 to-neon-magenta/30 border border-white/10 font-medium text-sm text-white/80`}
    >
      {initials || <Users className="h-4 w-4" />}
    </div>
  );
}
