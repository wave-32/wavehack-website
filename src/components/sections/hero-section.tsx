"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";
import { Countdown } from "@/components/ui/countdown";

const HeroScene = dynamic(() => import("@/components/3d/hero-scene"), {
  ssr: false,
  loading: () => null,
});

export function HeroSection() {
  const title = process.env.NEXT_PUBLIC_HACKATHON_NAME || "WaveHack";
  return (
    <section id="hero" className="relative isolate -mt-16 min-h-screen pt-16 overflow-hidden">
      {/* 3D backdrop */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
        <HeroScene />
      </div>
      {/* soft gradient stop to merge into next section */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-space-950 pointer-events-none" />

      <div className="container-page relative pt-16 sm:pt-24 pb-20 sm:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs uppercase tracking-[0.3em] text-white/70"
        >
          <Sparkles className="h-3 w-3 text-neon-cyan" /> 2026 · Splashdown sequence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="font-display text-[12vw] sm:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mt-6 text-balance"
        >
          <span className="neon-text">{title}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="mt-6 max-w-2xl text-base sm:text-xl text-white/70 text-balance"
        >
          A space-themed hackathon for the next generation of builders. Build open-source
          projects, compete for prizes, and launch into the next wave of technology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Link
            href="/#register"
            className="relative inline-flex items-center gap-2 rounded-md h-12 px-6 font-medium neon-border shadow-neon-soft hover:shadow-neon transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Register now
            <span className="text-xs text-white/70">→ {title}</span>
          </Link>
          <Link
            href="/#sponsors"
            className="inline-flex items-center gap-2 rounded-md h-12 px-6 font-medium bg-white/[0.06] border border-white/15 backdrop-blur-md hover:bg-white/[0.10] transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Sponsor WaveHack
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
          className="mt-12 max-w-3xl"
        >
          <Countdown />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-16 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/40"
        >
          <ArrowDown className="h-3 w-3 animate-bounce" /> Scroll to explore
        </motion.div>
      </div>
    </section>
  );
}
