import { Section, SectionTitle } from "@/components/ui/primitives";
import { prisma } from "@/lib/db";
import { AdminTable } from "@/components/admin/admin-table";

export const dynamic = "force-dynamic";

export default async function AdminNewsletter() {
  const rows = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <SectionTitle
        eyebrow="Newsletter"
        title={`${rows.length} subscribers`}
        description="Export to CSV for your announcement list."
      />
      <div className="mt-8">
        <AdminTable
          rows={rows}
          filename="newsletter"
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email", sortable: true,
              render: (r) => (
                <a href={`mailto:${r.email}`} className="hover:text-white text-white/80">{r.email}</a>
              ) },
            { key: "createdAt", label: "Subscribed", sortable: true,
              render: (r) => new Date(r.createdAt).toLocaleString() },
          ]}
        />
      </div>
    </div>
  );
}
