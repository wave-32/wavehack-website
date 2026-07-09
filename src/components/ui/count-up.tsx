"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function CountUp({
  value,
  duration = 1500,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const start = useRef<number | null>(null);
  const started = useRef(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const animate = (t: number) => {
              if (start.current == null) start.current = t;
              const p = Math.min(1, (t - start.current) / duration);
              const eased = 1 - Math.pow(1 - p, 3); // ease out cubic
              setDisplay(value * eased);
              if (p < 1) requestAnimationFrame(animate);
              else setDisplay(value);
            };
            requestAnimationFrame(animate);
          }
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [value, duration]);

  const hasFraction = value % 1 !== 0;
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {hasFraction ? display.toFixed(2) : Math.round(display).toLocaleString()}
      {suffix}
    </span>
  );
}
