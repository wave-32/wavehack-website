"use client";
import { Section, SectionTitle } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "@/components/forms/contact-form";

export function ContactSection() {
  return (
    <Section id="contact">
      <SectionTitle
        eyebrow="Reach Out"
        title="Contact"
        description="Email, partnerships, sponsorship ideas — we'd love to hear from you."
      />
      <Reveal className="mt-12 max-w-4xl mx-auto">
        <ContactForm />
      </Reveal>
    </Section>
  );
}
