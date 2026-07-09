"use client";
import { Section, SectionTitle } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { RegistrationForm } from "@/components/forms/registration-form";

export function RegistrationSection() {
  return (
    <Section id="register" innerClassName="pt-12">
      <SectionTitle
        eyebrow="Mission 2026"
        title="Register to hack"
        description="Lock your seat for WaveHack. Confirmation lands in your inbox instantly."
      />
      <Reveal className="mt-12 max-w-3xl mx-auto">
        <RegistrationForm />
      </Reveal>
    </Section>
  );
}
