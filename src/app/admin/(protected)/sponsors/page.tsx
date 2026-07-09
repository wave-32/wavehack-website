import { Section, SectionTitle } from "@/components/ui/primitives";
import { prisma } from "@/lib/db";
import { AdminTable } from "@/components/admin/admin-table";
import type { SponsorInquiry } from "@prisma/client";
import { PartnerStatus } from "@/lib/types";
import { updateSponsorStatus } from "./actions";

export const dynamic = "force-dynamic";

const STATUSES = Object.values(PartnerStatus) as string[];

export default async function AdminSponsors() {
  const rows = await prisma.sponsorInquiry.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <SectionTitle
        eyebrow="Sponsors"
        title={`${rows.length} partnership inquiries`}
        description="Triage incoming partnership requests. CSV export for the deck."
      />
      <div className="mt-8">
        <AdminTable<SponsorInquiry & { id: string }>
          rows={rows as (SponsorInquiry & { id: string })[]}
          filename="sponsors"
          statuses={STATUSES}
          onStatusChange={updateSponsorStatus}
          columns={[
            { key: "companyName", label: "Company", sortable: true },
            { key: "contactName", label: "Contact", sortable: true },
            {
              key: "email",
              label: "Email",
              sortable: true,
              render: (r) => (
                <a href={`mailto:${r.email}`} className="hover:text-white text-white/80">
                  {r.email}
                </a>
              ),
            },
            { key: "phone", label: "Phone" },
            {
              key: "website",
              label: "Website",
              render: (r) =>
                r.website ? (
                  <a
                    href={r.website}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white text-white/80"
                  >
                    {r.website}
                  </a>
                ) : null,
            },
            { key: "partnershipType", label: "Type", sortable: true },
            {
              key: "goals",
              label: "Goals",
              render: (r) => (
                <div className="max-w-md truncate text-white/70" title={r.goals}>
                  {r.goals}
                </div>
              ),
            },
            {
              key: "createdAt",
              label: "Since",
              sortable: true,
              render: (r) => new Date(r.createdAt).toLocaleString(),
            },
          ]}
        />
      </div>
    </div>
  );
}
