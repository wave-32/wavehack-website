import { Section, SectionTitle } from "@/components/ui/primitives";
import { prisma } from "@/lib/db";
import { AdminTable } from "@/components/admin/admin-table";
import type { Participant } from "@prisma/client";
import { ParticipantStatus } from "@/lib/types";
import { updateParticipantStatus } from "./actions";

export const dynamic = "force-dynamic";

const STATUSES = Object.values(ParticipantStatus) as string[];

export default async function AdminParticipants() {
  const rows = await prisma.participant.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <SectionTitle
        eyebrow="Participants"
        title={`${rows.length} registrations`}
        description="View, filter, and update statuses. Export to CSV."
      />
      <div className="mt-8">
        <AdminTable<Participant & { id: string }>
          rows={rows as (Participant & { id: string })[]}
          filename="participants"
          statuses={STATUSES}
          onStatusChange={updateParticipantStatus}
          columns={[
            { key: "fullName", label: "Name", sortable: true },
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
            { key: "age", label: "Age", sortable: true },
            { key: "school", label: "School" },
            { key: "grade", label: "Grade" },
            { key: "location", label: "Location" },
            {
              key: "teamStatus",
              label: "Team",
              sortable: true,
              render: (r) => (
                <span className="text-[10px] uppercase tracking-widest text-white/70">
                  {r.teamStatus}
                </span>
              ),
            },
            {
              key: "skills",
              label: "Skills",
              render: (r) => (
                <div className="max-w-xs truncate text-white/70" title={r.skills}>
                  {r.skills}
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
