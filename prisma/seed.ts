import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

type Kind =
  | "sponsor"
  | "winner"
  | "team_member"
  | "judge"
  | "speaker"
  | "mentor"
  | "gallery"
  | "stat"
  | "faq"
  | "event";

const prisma = new PrismaClient();

async function upsertContent<T extends object>(
  kind: Kind,
  key: string,
  data: T,
  order = 0,
) {
  await prisma.contentItem.upsert({
    where: { kind_key: { kind, key } },
    create: { kind, key, data: JSON.stringify(data), order },
    update: { data: JSON.stringify(data), order },
  });
}

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || "admin@wavehack.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe!WaveHack2026";
  const name = process.env.ADMIN_NAME || "WaveHack Admin";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { email },
    create: { email, name, passwordHash },
    update: { name, passwordHash },
  });
  // eslint-disable-next-line no-console
  console.log(`Seeded admin user: ${email} (password from ADMIN_PASSWORD env)`);
}

async function seedContent() {
  // Stats
  const stats: { key: string; data: { label: string; value: number; suffix?: string; prefix?: string; blurb?: string }; order: number }[] = [
    { key: "hackers-1", data: { label: "Hackers Registered (WaveHack I)", value: 76, suffix: "+", blurb: "From our first pilot event" }, order: 0 },
    { key: "hackers-2", data: { label: "Hackers Registered (WaveHack II)", value: 54, suffix: "+", blurb: "Our second, CyberWave edition" }, order: 1 },
    { key: "oss", data: { label: "Open-Source Projects Created", value: 50, suffix: "+", blurb: "Live repositories shipped" }, order: 2 },
    { key: "prizes", data: { label: "Total Prizes Awarded", value: 700, prefix: "$", suffix: "+", blurb: "Across all events to date" }, order: 3 },
  ];
  for (const s of stats) await upsertContent("stat", s.key, s.data, s.order);

  // Event info
  await upsertContent(
    "event",
    "wavehack-2026",
    {
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
    },
    0,
  );

  // Sponsors (placeholder copy — replace logos/blurbs via /admin/content)
  const sponsors: { tier: "platinum" | "gold" | "prize" | "community"; name: string; url?: string }[] = [
    { tier: "platinum", name: "GitHub", url: "https://github.com" },
    { tier: "platinum", name: "Resend", url: "https://resend.com" },
    { tier: "gold", name: "Vercel", url: "https://vercel.com" },
    { tier: "gold", name: "PostHog", url: "https://posthog.com" },
    { tier: "gold", name: "Linear", url: "https://linear.app" },
    { tier: "prize", name: "Sentry", url: "https://sentry.io" },
    { tier: "prize", name: "PlanetScale", url: "https://planetscale.com" },
    { tier: "prize", name: "Cloudflare", url: "https://cloudflare.com" },
    { tier: "community", name: "HackClub", url: "https://hackclub.com" },
    { tier: "community", name: "MLH", url: "https://mlh.io" },
    { tier: "community", name: "Devpost", url: "https://devpost.com" },
    { tier: "community", name: "Open Source Camp", url: "https://opensource.camp" },
  ];
  let i = 0;
  for (const s of sponsors) {
    await upsertContent(
      "sponsor",
      `${s.tier}-${s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      { name: s.name, tier: s.tier, url: s.url },
      i++,
    );
  }

  // Winners (placeholder)
  const winners = [
    {
      teamName: "Stellar Squad",
      projectName: "AstroAlign",
      description: "A real-time satellite trajectory visualizer built with WebGL + Three.js. Open-sourced under MIT.",
      members: ["Riya P.", "Marcus L.", "Sofia K."],
      prize: "Grand Prize",
      event: "WaveHack",
      year: 2024,
    },
    {
      teamName: "Photon Pirates",
      projectName: "Halo Notify",
      description: "Hardware hack — a low-cost wearable that gives blind users ambient distance cues via haptic feedback.",
      members: ["Anika D.", "Theo R."],
      prize: "Best Open Source",
      event: "WaveHack",
      year: 2024,
    },
    {
      teamName: "Quasar",
      projectName: "Quasar Coach",
      description: "AI study coach using retrieval-augmented generation over each student's class notes.",
      members: ["Priya N.", "Owen W.", "Mira S.", "Dean H."],
      prize: "Grand Prize",
      event: "CyberWave",
      year: 2025,
    },
  ];
  let w = 0;
  for (const x of winners) {
    await upsertContent(
      "winner",
      `${x.teamName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${x.year}`,
      x,
      w++,
    );
  }

  // Team
  await upsertContent(
    "team_member",
    "wavehack-org",
    {
      name: "WaveHack Org Team",
      role: "Founders & Organizers",
      bio: "A small team of student organizers building WaveHack from the ground up in 2024 — and growing the Wave ever since.",
      links: [
        { label: "GitHub", href: "https://github.com/" },
        { label: "Email", href: "mailto:dheepak209@gmail.com" },
      ],
    },
    0,
  );

  // FAQ
  const faqs = [
    { q: "Who can participate?", a: "High school, undergraduate, and graduate students worldwide. Open to beginners and experienced hackers alike." },
    { q: "Is the event free?", a: "Yes. Participation is free. We provide mentorship, workshops, and prizes thanks to our sponsors." },
    { q: "Do I need coding experience?", a: "No. Beginner-friendly tracks and mentors help you ship your first hackathon build." },
    { q: "What is the team size?", a: "1–4 hackers per team. You can register solo and we'll help you find teammates." },
    { q: "What can I build?", a: "Anything from web, mobile, AI, hardware, robotics, games, and more." },
    { q: "How do prizes work?", a: "Prizes are awarded per category. Top overall project takes the Grand Prize. Cash prizes paid within 30 days." },
  ];
  let f = 0;
  for (const faq of faqs) {
    await upsertContent("faq", `faq-${f++}`, faq, f);
  }

  // Gallery placeholders (admin uploads images later)
  const gallery = [
    "Opening Ceremony 2024",
    "Hackers in deep focus",
    "CyberWave Stage",
    "Demo Day Winners",
    "Workshop with Vercel",
    "Closing Vibes",
  ];
  let g = 0;
  for (const t of gallery) {
    await upsertContent("gallery", `gallery-${g}`, { title: t, caption: "", imageUrl: "" }, g++);
  }

  // eslint-disable-next-line no-console
  console.log("Seeded editable content.");
}

async function main() {
  await seedAdmin();
  await seedContent();
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
