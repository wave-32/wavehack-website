"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles } from "lucide-react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

export const NeonButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function NeonButton(
    { variant = "primary", size = "md", loading, className, children, ...rest },
    ref,
  ) {
    const sizes: Record<string, string> = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-5 text-sm",
      lg: "h-12 px-6 text-base",
    };
    const variants: Record<string, string> = {
      primary:
        "neon-border text-white shadow-neon-soft hover:shadow-neon transition-all",
      secondary:
        "bg-white/[0.06] border border-white/15 text-white hover:bg-white/[0.10] backdrop-blur-md",
      ghost: "text-white/80 hover:text-white hover:bg-white/[0.05]",
    };
    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 rounded-md font-medium overflow-hidden will-change-transform active:scale-[0.98] hover:scale-[1.02] transition",
          sizes[size],
          variants[variant],
          className,
        )}
        disabled={loading || rest.disabled}
        {...rest}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {variant === "primary" && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.18),transparent)] -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
          />
        )}
        {children}
      </button>
    );
  },
);

export function GlassPanel({
  className,
  children,
  innerClassName,
}: {
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative grain rounded-2xl glass overflow-hidden",
        className,
      )}
    >
      <div className={cn("relative", innerClassName)}>{children}</div>
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-xs uppercase tracking-widest text-white/70">
          <Sparkles className="h-3 w-3 text-neon-cyan" /> {eyebrow}
        </div>
      )}
      <h2 className="font-display text-3xl sm:text-5xl font-semibold leading-[1.05] text-balance">
        <span className="neon-text">{title}</span>
      </h2>
      {description && (
        <p className="mt-4 text-white/70 text-base sm:text-lg max-w-2xl mx-auto text-balance">
          {description}
        </p>
      )}
    </div>
  );
}

export function Section({
  id,
  children,
  className,
  innerClassName,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section id={id} className={cn("relative", className)}>
      <div className={cn("container-page py-24 sm:py-32", innerClassName)}>
        {children}
      </div>
    </section>
  );
}

export type Status =
  | "REGISTERED" | "CONFIRMED" | "WAITLISTED" | "REJECTED"
  | "SUBMITTED" | "REVIEWING" | "ACCEPTED"
  | "NEW_INQUIRY" | "CONTACTED" | "NEGOTIATING";

export function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    REGISTERED: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30",
    CONFIRMED: "bg-emerald-500/10 text-emerald-300 border-emerald-400/30",
    WAITLISTED: "bg-amber-500/10 text-amber-300 border-amber-400/30",
    REJECTED: "bg-rose-500/10 text-rose-300 border-rose-400/30",
    SUBMITTED: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30",
    REVIEWING: "bg-amber-500/10 text-amber-300 border-amber-400/30",
    ACCEPTED: "bg-emerald-500/10 text-emerald-300 border-emerald-400/30",
    NEW_INQUIRY: "bg-neon-violet/10 text-neon-violet border-neon-violet/30",
    CONTACTED: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30",
    NEGOTIATING: "bg-amber-500/10 text-amber-300 border-amber-400/30",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 text-xs rounded-md border", map[status])}>
      {status}
    </span>
  );
}
