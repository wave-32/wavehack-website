import { Section, SectionTitle } from "@/components/ui/primitives";
import { prisma } from "@/lib/db";
import { AdminTable } from "@/components/admin/admin-table";
import type { VolunteerApplication } from "@prisma/client";
import { VolunteerStatus } from "@/lib/types";
import { updateVolunteerStatus } from "./actions";

export const dynamic = "force-dynamic";

const STATUSES = Object.values(VolunteerStatus) as string[];

export default async function AdminVolunteers() {
  const rows = await prisma.volunteerApplication.findMany({
    orderBy: { createdAt: "desc" },
  });
  return (
    <div>
      <SectionTitle
        eyebrow="Volunteers & Team"
        title={`${rows.length} applications`}
        description="Review and accept/reject volunteer, intern, and org-team applicants."
      />
      <div className="mt-8">
        <AdminTable<VolunteerApplication & { id: string }>
          rows={rows as (VolunteerApplication & { id: string })[]}
          filename="volunteers"
          statuses={STATUSES}
          onStatusChange={updateVolunteerStatus}
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
            { key: "location", label: "Location" },
            {
              key: "role",
              label: "Role",
              sortable: true,
              render: (r) => (
                <span className="text-[10px] uppercase tracking-widest text-white/70">
                  {r.role}
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
              key: "motivation",
              label: "Motivation",
              render: (r) => (
                <div className="max-w-md truncate text-white/70" title={r.motivation ?? ""}>
                  {r.motivation}
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
