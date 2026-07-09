"use client";
import { Section, SectionTitle } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { SponsorForm } from "@/components/forms/sponsor-form";

export function SponsorSectionForm() {
  return (
    <Section id="partner">
      <SectionTitle
        eyebrow="Partnership"
        title="Sponsor WaveHack"
        description="Partner with WaveHack and help support the next generation of innovators."
      />
      <Reveal className="mt-12 max-w-3xl mx-auto">
        <SponsorForm />
      </Reveal>
    </Section>
  );
}
