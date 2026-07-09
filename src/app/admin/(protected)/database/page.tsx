import { Section, SectionTitle } from "@/components/ui/primitives";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDatabase() {
  const [p, v, s, n, c] = await Promise.all([
    prisma.participant.count(),
    prisma.volunteerApplication.count(),
    prisma.sponsorInquiry.count(),
    prisma.newsletterSubscriber.count(),
    prisma.contactMessage.count(),
  ]);
  return (
    <div>
      <SectionTitle
        eyebrow="Database"
        title="Storage health"
        description="Live DB counts. Useful for sanity checking."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Participants", value: p },
          { label: "Volunteers", value: v },
          { label: "Sponsors", value: s },
          { label: "Newsletter", value: n },
          { label: "Contact", value: c },
        ].map((it) => (
          <div key={it.label} className="glass rounded-2xl p-5">
            <div className="text-xs uppercase tracking-widest text-white/50">{it.label}</div>
            <div className="font-display text-3xl mt-2 neon-text">{it.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
