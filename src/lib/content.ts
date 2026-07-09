import { prisma } from "@/lib/db";
import { safeJSON } from "@/lib/utils";

// The set of kinds we ship pre-typed below. `listContent`/`upsertContent`/
// `deleteContent` accept ANY string for `kind` so admins can add new kinds
// (e.g. "testimonial") without schema migration. TypeScript will not enforce
// the union when reading — only at the editor level via `lib/types.ts`.
export type Kind =
  | "sponsor"
  | "winner"
  | "team_member"
  | "judge"
  | "speaker"
  | "mentor"
  | "gallery"
  | "stat"
  | "faq"
  | "event"
  | "hero"
  | "testimonial"
  | string; // open for future kinds

export async function listContent<T>(kind: string): Promise<T[]> {
  const rows = await prisma.contentItem.findMany({
    where: { kind },
    orderBy: { order: "asc" },
  });
  return rows.map((r) => safeJSON<T>(r.data, {} as T));
}

export async function getContent<T>(kind: string, key: string): Promise<T | null> {
  const row = await prisma.contentItem.findUnique({
    where: { kind_key: { kind, key } },
  });
  return row ? safeJSON<T>(row.data, null as T) : null;
}

export async function upsertContent<T extends object>(
  kind: string,
  key: string,
  data: T,
  order = 0,
) {
  return prisma.contentItem.upsert({
    where: { kind_key: { kind, key } },
    create: { kind, key, data: JSON.stringify(data), order },
    update: { data: JSON.stringify(data), order },
  });
}

export async function deleteContent(kind: string, key: string) {
  return prisma.contentItem.delete({ where: { kind_key: { kind, key } } });
}

// Type shapes for the kinds the homepage uses directly.
export type Sponsor = {
  name: string;
  tier: "platinum" | "gold" | "prize" | "community";
  url?: string;
  logoUrl?: string;
  blurb?: string;
};

export type Winner = {
  teamName: string;
  projectName: string;
  description: string;
  members: string[];
  prize: string;
  event: string;
  year: number;
  images?: string[];
  github?: string;
  demo?: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photoUrl?: string;
  links?: { label: string; href: string }[];
};

export type Judge = TeamMember;
export type Speaker = TeamMember;
export type Mentor = TeamMember;

export type GalleryItem = {
  title: string;
  imageUrl: string;
  caption?: string;
};

export type StatItem = {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  blurb?: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type EventInfo = {
  date: string;
  iso?: string;
  location: string;
  registrationDeadline?: string;
  eligibility?: string;
  teamSize?: string;
  rules?: string[];
  build?: string;
  schedule?: { time: string; label: string }[];
  prizes?: { name: string; amount: string; description?: string }[];
};

export type HeroContent = {
  tagline?: string;
  subtagline?: string;
  ctaPrimaryLabel?: string;
  ctaSecondaryLabel?: string;
};

export type Testimonial = {
  name: string;
  quote: string;
  role?: string;
};
