import Link from "next/link";
import { prisma } from "@/lib/db";
import { Section, SectionTitle } from "@/components/ui/primitives";
import { Users, Sparkles, Handshake, Mail, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [participants, volunteers, sponsors, newsletter] = await Promise.all([
    prisma.participant.count(),
    prisma.volunteerApplication.count(),
    prisma.sponsorInquiry.count(),
    prisma.newsletterSubscriber.count(),
  ]);

  const stats = [
    { label: "Participants", value: participants, href: "/admin/participants", icon: Users, color: "text-neon-cyan" },
    { label: "Volunteer apps", value: volunteers, href: "/admin/volunteers", icon: Sparkles, color: "text-neon-violet" },
    { label: "Sponsors", value: sponsors, href: "/admin/sponsors", icon: Handshake, color: "text-neon-magenta" },
    { label: "Newsletter", value: newsletter, href: "/admin/newsletter", icon: Mail, color: "text-neon-amber" },
  ];

  return (
    <div>
      <SectionTitle eyebrow="Admin" title="Overview" description="Submission counts and quick links." />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="glass grain rounded-2xl p-5 relative overflow-hidden group hover:scale-[1.01] transition"
            >
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full blur-3xl bg-white/10" />
              <div className="flex items-center justify-between">
                <Icon className={`h-5 w-5 ${s.color}`} />
                <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-white transition" />
              </div>
              <div className="mt-4 font-display text-4xl neon-text">{s.value}</div>
              <div className="text-sm text-white/70">{s.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="glass grain rounded-2xl p-6">
          <h3 className="font-display text-lg">Quick links</h3>
          <ul className="mt-3 grid gap-2 text-sm">
            <li><Link className="hover:text-white text-white/80" href="/admin/content">Edit content (sponsors, winners, team, judges…)</Link></li>
            <li><Link className="hover:text-white text-white/80" href="/admin/participants">Manage participants & waitlist</Link></li>
            <li><Link className="hover:text-white text-white/80" href="/admin/sponsors">Triage sponsor inquiries</Link></li>
          </ul>
        </div>
        <div className="glass grain rounded-2xl p-6 text-sm text-white/70">
          <h3 className="font-display text-lg text-white">Tips</h3>
          <ul className="mt-3 grid gap-2">
            <li>• Editable content lives at <code>/admin/content</code>.</li>
            <li>• Tables support search, status updates, and CSV export.</li>
            <li>• Set ADMIN_EMAIL / ADMIN_PASSWORD in .env to seed a new admin.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
