"use client";
import { Section, SectionTitle } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export function NewsletterFooter() {
  return (
    <Section id="newsletter" className="!py-20">
      <div className="relative grain rounded-3xl glass-strong p-8 sm:p-12 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl bg-neon-cyan/30" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl bg-neon-violet/30" />
        <div className="relative grid gap-8 lg:grid-cols-[1.1fr_1fr] items-center">
          <div>
            <SectionTitle
              align="left"
              eyebrow="Stay in the loop"
              title="Get WaveHack updates"
              description="Hackathon announcements, sponsor reveals, registration windows, and behind-the-scenes."
            />
          </div>
          <NewsletterForm />
        </div>
      </div>
    </Section>
  );
}
