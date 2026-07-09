import { Section, SectionTitle } from "@/components/ui/primitives";
import { AdminContentEditor } from "@/components/admin/admin-content-editor";
import { listContent } from "@/lib/content";

export const dynamic = "force-dynamic";

type KindEntry = { key: string; label: string };
const KINDS: KindEntry[] = [
  { key: "sponsor", label: "Sponsors" },
  { key: "winner", label: "Winners" },
  { key: "team_member", label: "Team" },
  { key: "judge", label: "Judges" },
  { key: "speaker", label: "Speakers" },
  { key: "mentor", label: "Mentors" },
  { key: "gallery", label: "Gallery" },
  { key: "stat", label: "Stats" },
  { key: "faq", label: "FAQ" },
  { key: "event", label: "Event Info" },
  { key: "testimonial", label: "Testimonials" },
];

export default async function AdminContent() {
  const grouped: Record<string, unknown[]> = {};
  for (const k of KINDS) {
    grouped[k.key] = await listContent(k.key);
  }
  return (
    <div>
      <SectionTitle
        eyebrow="Editable Content"
        title="Content Manager"
        description="Update sponsors, winners, team, judges, gallery, stats, FAQ, event details — all from here."
      />
      <div className="mt-8">
        <AdminContentEditor kinds={KINDS} grouped={grouped} />
      </div>
    </div>
  );
}
