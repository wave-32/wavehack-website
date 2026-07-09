"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type Common = {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
};

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & Common
>(function Input({ label, error, hint, className, id, ...rest }, ref) {
  const r = React.useId();
  const inputId = id ?? r;
  return (
    <div className="grid gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs uppercase tracking-wider text-white/70">
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative rounded-md overflow-hidden border border-white/10 bg-white/[0.04] focus-within:border-neon-cyan/60 transition",
          error && "border-rose-400/60 focus-within:border-rose-400",
          className,
        )}
      >
        <input
          ref={ref}
          id={inputId}
          className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-white/30 text-white"
          {...rest}
        />
        {hint && !error && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-white/40">
            {hint}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-rose-300">{error}</p>}
    </div>
  );
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & Common
>(function Textarea({ label, error, hint, className, id, rows = 4, ...rest }, ref) {
  const r = React.useId();
  const inputId = id ?? r;
  return (
    <div className="grid gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs uppercase tracking-wider text-white/70">
          {label}
        </label>
      )}
      <div
        className={cn(
          "relative rounded-md overflow-hidden border border-white/10 bg-white/[0.04] focus-within:border-neon-cyan/60 transition",
          error && "border-rose-400/60 focus-within:border-rose-400",
          className,
        )}
      >
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-white/30 text-white resize-y"
          {...rest}
        />
      </div>
      {hint && !error && <p className="text-[11px] text-white/40">{hint}</p>}
      {error && <p className="text-xs text-rose-300">{error}</p>}
    </div>
  );
});

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & Common & {
  options: { value: string; label: string }[];
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, error, className, id, options, ...rest }, ref) {
    const r = React.useId();
    const inputId = id ?? r;
    return (
      <div className="grid gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs uppercase tracking-wider text-white/70">
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative rounded-md overflow-hidden border border-white/10 bg-white/[0.04] focus-within:border-neon-cyan/60 transition",
            error && "border-rose-400/60 focus-within:border-rose-400",
            className,
          )}
        >
          <select
            ref={ref}
            id={inputId}
            className="w-full bg-transparent px-3 py-2.5 text-sm outline-none text-white appearance-none pr-9"
            {...rest}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value} className="bg-space-900">
                {o.label}
              </option>
            ))}
          </select>
          <svg
            aria-hidden
            viewBox="0 0 20 20"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60"
          >
            <path d="M6 8l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        {error && <p className="text-xs text-rose-300">{error}</p>}
      </div>
    );
  },
);

export function RadioGroup({
  label,
  options,
  value,
  onChange,
  name,
  error,
  required,
}: {
  label: string;
  /**
   * Required: the radio inputs share this name so they form a single
   * accessible group (arrow-key navigation) and FormData picks up the
   * selected value. If omitted we fall back to a stable React id and
   * warn loudly — callers should always pass `name`.
   */
  name?: string;
  value?: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; description?: string }[];
  error?: string;
  required?: boolean;
}) {
  const fallbackName = React.useId();
  if (!name && typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.warn(
      "[RadioGroup] missing `name` prop — FormData will not capture the selection. Pass `name` from the parent form.",
    );
  }
  const inputName = name ?? fallbackName;

  return (
    <fieldset className="grid gap-2 m-0 p-0 border-0">
      <legend className="text-xs uppercase tracking-wider text-white/70 px-0">
        {label}
        {required && <span className="text-rose-400 ml-1" aria-hidden>*</span>}
      </legend>
      <div className="grid sm:grid-cols-3 gap-2">
        {options.map((o) => {
          const active = value === o.value;
          const id = `${inputName}-${o.value}`;
          return (
            <label
              key={o.value}
              htmlFor={id}
              className={cn(
                "relative cursor-pointer select-none text-left rounded-lg p-3 border transition backdrop-blur-md",
                "focus-within:ring-2 focus-within:ring-neon-cyan focus-within:ring-offset-2 focus-within:ring-offset-space-950",
                active
                  ? "border-neon-cyan/60 bg-neon-cyan/10 shadow-neon-soft"
                  : "border-white/10 bg-white/[0.04] hover:bg-white/[0.06]",
              )}
            >
              <input
                id={id}
                type="radio"
                name={inputName}
                value={o.value}
                checked={active}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
                required={required}
                aria-label={o.label}
              />
              <div className="font-medium text-sm">{o.label}</div>
              {o.description && (
                <div className="text-xs text-white/60 mt-1">{o.description}</div>
              )}
              {active && (
                <span
                  aria-hidden
                  className="absolute top-2 right-2 h-2 w-2 rounded-full bg-neon-cyan shadow-[0_0_10px_2px_rgba(34,230,255,0.7)]"
                />
              )}
            </label>
          );
        })}
      </div>
      {error && <p className="text-xs text-rose-300">{error}</p>}
    </fieldset>
  );
}

export function Honeypot({ name = "website" }: { name?: string } = {}) {
  return (
    <input
      type="text"
      name={name}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden
      className="hidden"
    />
  );
}
