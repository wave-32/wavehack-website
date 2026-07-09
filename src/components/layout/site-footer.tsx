"use client";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative mt-32 border-t border-white/10">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent" />
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-xl font-semibold">
            <span className="neon-text">WaveHack</span>
          </div>
          <p className="mt-3 text-sm text-white/60 max-w-xs">
            A space-themed hackathon platform. Build something extraordinary with
            us.
          </p>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/50 mb-3">
            Platform
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#event" className="text-white/80 hover:text-white">Event</Link></li>
            <li><Link href="/#register" className="text-white/80 hover:text-white">Register</Link></li>
            <li><Link href="/#sponsors" className="text-white/80 hover:text-white">Sponsors</Link></li>
            <li><Link href="/#past" className="text-white/80 hover:text-white">Past Events</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/50 mb-3">
            Team
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#join" className="text-white/80 hover:text-white">Join the team</Link></li>
            <li><Link href="/#team" className="text-white/80 hover:text-white">Organizers</Link></li>
            <li><Link href="/#judges" className="text-white/80 hover:text-white">Judges & Mentors</Link></li>
            <li><Link href="/#contact" className="text-white/80 hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-white/50 mb-3">
            Past events
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a className="text-white/80 hover:text-white" href="https://wavehack.devpost.com/" target="_blank" rel="noreferrer">
                WaveHack
              </a>
            </li>
            <li>
              <a className="text-white/80 hover:text-white" href="https://cyberwave.devpost.com/" target="_blank" rel="noreferrer">
                CyberWave
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-page pb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/50">
        <div>© {new Date().getFullYear()} WaveHack. Built for the next wave of builders.</div>
        <div className="flex items-center gap-3">
          <a href="mailto:dheepak209@gmail.com" className="hover:text-white">dheepak209@gmail.com</a>
          <span aria-hidden>·</span>
          <a href="tel:4708089390" className="hover:text-white">470-808-9390</a>
        </div>
      </div>
    </footer>
  );
}
