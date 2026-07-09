"use client";
import { Section, SectionTitle } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { VolunteerForm } from "@/components/forms/volunteer-form";

export function VolunteerSection() {
  return (
    <Section id="volunteer">
      <SectionTitle
        eyebrow="Mission Support"
        title="Volunteer at WaveHack"
        description="Help us run a smooth event — judging room logistics, hacker support, and more."
      />
      <Reveal className="mt-12 max-w-3xl mx-auto">
        <VolunteerForm />
      </Reveal>
    </Section>
  );
}
