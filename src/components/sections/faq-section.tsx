"use client";
import { Section, SectionTitle } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/lib/content";

const FALLBACK: FaqItem[] = [
  {
    q: "Who can participate?",
    a: "High school, undergraduate, and graduate students worldwide. Open to beginners and experienced hackers alike.",
  },
  {
    q: "Is the event free?",
    a: "Yes. Participation is free. We provide mentorship, workshops, and prizes thanks to our sponsors.",
  },
  {
    q: "Do I need coding experience?",
    a: "No. Beginner-friendly tracks and mentors help you ship your first hackathon build.",
  },
  {
    q: "What is the team size?",
    a: "1–4 hackers per team. You can register solo and we'll help you find teammates.",
  },
  {
    q: "What can I build?",
    a: "Anything from web, mobile, AI, hardware, robotics, games, and more. Open-source tracks require a license.",
  },
  {
    q: "How do prizes work?",
    a: "Prizes are awarded per category. Top overall project takes the Grand Prize. All cash prizes are paid within 30 days of the event.",
  },
];

export function FaqSection({ items }: { items?: FaqItem[] | null }) {
  const list = items && items.length ? items : FALLBACK;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq">
      <SectionTitle
        eyebrow="FAQ"
        title="Frequently Asked"
        description="Quick answers. Don't see yours? Hit the contact section below."
      />
      <div className="mt-12 max-w-3xl mx-auto grid gap-3">
        {list.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={i} delay={i * 0.04}>
              <div
                className={cn(
                  "rounded-2xl border overflow-hidden transition",
                  isOpen ? "border-neon-cyan/40 bg-neon-cyan/5" : "border-white/10 bg-white/[0.04]",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-sm sm:text-base">{f.q}</span>
                  <span
                    className={cn(
                      "h-7 w-7 rounded-full flex items-center justify-center border border-white/10 text-white/70 transition",
                      isOpen && "bg-neon-cyan text-space-950 border-neon-cyan",
                    )}
                  >
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 text-sm text-white/75 leading-relaxed">
                      {f.a}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
