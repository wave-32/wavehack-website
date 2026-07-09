"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Github } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#event", label: "Event" },
  { href: "/#stats", label: "Stats" },
  { href: "/#past", label: "Past" },
  { href: "/#winners", label: "Winners" },
  { href: "/#team", label: "Team" },
  { href: "/#sponsors", label: "Sponsors" },
  { href: "/#register", label: "Register" },
  { href: "/#contact", label: "Contact" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-xl bg-space-950/70 border-b border-white/10"
          : "bg-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-2">
        <Link
          href="/"
          className="group flex items-center gap-2 font-display font-semibold text-lg tracking-tight"
        >
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md neon-border">
            <span className="absolute inset-0 rounded-md bg-grid-radial" />
            <span className="relative neon-text text-sm">W</span>
          </span>
          <span className="hidden sm:inline">WaveHack</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm text-white/70 hover:text-white transition relative group"
            >
              {l.label}
              <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px scale-x-0 group-hover:scale-x-100 origin-left transition-transform bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-magenta" />
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/#register"
            className="relative inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium neon-border neon-text hover:scale-[1.02] active:scale-[0.98] transition"
          >
            Register
          </Link>
          <a
            href="https://wavehack.devpost.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 hover:bg-white/5 text-white/70"
            aria-label="Devpost"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>

        <button
          className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 hover:bg-white/5"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 bg-space-950/80 backdrop-blur-xl">
          <div className="container-page py-3 grid gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-2 py-2 rounded-md text-sm text-white/80 hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/#register"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium neon-border neon-text"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
