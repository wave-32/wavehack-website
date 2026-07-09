import { HeroSection } from "@/components/sections/hero-section";
import { EventSection } from "@/components/sections/event-section";
import { StatsSection } from "@/components/sections/stats-section";
import { PastSection } from "@/components/sections/past-section";
import { WinnersSection } from "@/components/sections/winners-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SponsorsSection } from "@/components/sections/sponsors-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { TeamSection } from "@/components/sections/team-section";
import { FaqSection } from "@/components/sections/faq-section";
import { RegistrationSection } from "@/components/sections/registration-section";
import { SponsorSectionForm } from "@/components/sections/sponsor-section-form";
import { VolunteerSection } from "@/components/sections/volunteer-section";
import { JoinTeamSection } from "@/components/sections/join-team-section";
import { ContactSection } from "@/components/sections/contact-section";
import { NewsletterFooter } from "@/components/sections/newsletter-footer";
import { listContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [stats, event, sponsors, winners, team, judges, mentors, speakers, gallery, faq] =
    await Promise.all([
      listContent<import("@/lib/content").StatItem>("stat"),
      listContent<import("@/lib/content").EventInfo>("event"),
      listContent<import("@/lib/content").Sponsor>("sponsor"),
      listContent<import("@/lib/content").Winner>("winner"),
      listContent<import("@/lib/content").TeamMember>("team_member"),
      listContent<import("@/lib/content").TeamMember>("judge"),
      listContent<import("@/lib/content").TeamMember>("mentor"),
      listContent<import("@/lib/content").TeamMember>("speaker"),
      listContent<import("@/lib/content").GalleryItem>("gallery"),
      listContent<import("@/lib/content").FaqItem>("faq"),
    ]);

  return (
    <>
      <HeroSection />
      <EventSection data={event[0] ?? null} />
      <StatsSection stats={stats} />
      <PastSection />
      <WinnersSection winners={winners} />
      <ProjectsSection />
      <SponsorsSection sponsors={sponsors} />
      <RegistrationSection />
      <VolunteerSection />
      <SponsorSectionForm />
      <JoinTeamSection />
      <GallerySection items={gallery} />
      <TeamSection team={team} judges={judges} mentors={mentors} speakers={speakers} />
      <FaqSection items={faq} />
      <ContactSection />
      <NewsletterFooter />
    </>
  );
}
