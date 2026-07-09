"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function getTarget(): Date {
  const env = process.env.NEXT_PUBLIC_COUNTDOWN_DATE;
  if (env) return new Date(env);
  // Aug 1 2026, 00:00 UTC
  return new Date("2026-08-01T00:00:00Z");
}

function diff(target: Date) {
  const ms = target.getTime() - Date.now();
  if (ms <= 0) return null;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const seconds = Math.floor((ms / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function Countdown({ className }: { className?: string }) {
  const target = getTarget();
  const [t, setT] = useState<ReturnType<typeof diff>>();
  useEffect(() => {
    const tick = () => setT(diff(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!t) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl neon-border px-8 py-10 text-center",
          className,
        )}
      >
        <div className="text-xs uppercase tracking-[0.4em] text-white/60 mb-2">
          The mission begins
        </div>
        <div className="font-display text-4xl sm:text-5xl neon-text font-semibold">
          WaveHack is Live!
        </div>
        <div className="mt-2 text-white/70">Tune in now · Welcome to the splashdown.</div>
      </div>
    );
  }

  const cells = [
    { label: "Days", value: t.days },
    { label: "Hours", value: t.hours },
    { label: "Minutes", value: t.minutes },
    { label: "Seconds", value: t.seconds },
  ];

  return (
    <div className={cn("w-full", className)}>
      <div className="text-center text-xs uppercase tracking-[0.4em] text-white/60 mb-4">
        Mission Start in
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cells.map((c) => (
          <div
            key={c.label}
            className="relative grain glass-strong rounded-xl p-4 sm:p-5 text-center overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-70" />
            <div className="font-display text-4xl sm:text-5xl font-semibold tabular-nums neon-text">
              {String(c.value).padStart(2, "0")}
            </div>
            <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-widest text-white/60">
              {c.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
