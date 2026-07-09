"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { NeonButton } from "@/components/ui/primitives";
import { Input, Honeypot } from "@/components/ui/floating-input";
import { Mail, Check, AlertCircle, Bell } from "lucide-react";
import type { Errors } from "./shared";

export function NewsletterForm({ inline = false }: { inline?: boolean }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setErrors({});
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries());
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        const fields: Errors = {};
        const issues = json.issues?.fieldErrors ?? {};
        for (const k of Object.keys(issues)) {
          fields[k as keyof Errors] = issues[k]?.[0];
        }
        setErrors(fields);
        setError(json.error ?? "Validation failed");
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${inline ? "p-4" : "p-6 sm:p-8"} glass grain rounded-2xl flex items-center gap-3`}
      >
        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-neon-cyan via-neon-violet to-neon-magenta shadow-neon-soft">
          <Check className="h-5 w-5 text-space-950" strokeWidth={3} />
        </div>
        <div>
          <div className="font-display text-base">Subscribed!</div>
          <div className="text-xs text-white/60">
            We'll send you hackathon announcements.
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`grid gap-3 ${inline ? "" : "glass grain rounded-3xl p-6 sm:p-8"}`}
      noValidate
    >
      <Honeypot />
      {!inline && (
        <div className="flex items-center gap-2 mb-1">
          <Bell className="h-4 w-4 text-neon-cyan" />
          <div className="text-xs uppercase tracking-widest text-white/70">
            Newsletter
          </div>
        </div>
      )}
      {inline ? (
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_auto] gap-2">
          <Input name="name" placeholder="Name (optional)" />
          <Input name="email" type="email" placeholder="you@example.com" required error={errors.email} />
          <NeonButton type="submit" loading={submitting}>
            <Mail className="h-4 w-4" /> Subscribe
          </NeonButton>
        </div>
      ) : (
        <>
          <Input name="name" label="Name (optional)" />
          <Input name="email" type="email" label="Email" required error={errors.email} />
          {error && (
            <div className="flex items-start gap-2 text-sm text-rose-300 bg-rose-500/10 rounded-md px-3 py-2 border border-rose-400/30">
              <AlertCircle className="h-4 w-4 mt-0.5" /> {error}
            </div>
          )}
          <NeonButton type="submit" loading={submitting} className="mt-2">
            <Mail className="h-4 w-4" /> Subscribe
          </NeonButton>
        </>
      )}
      {inline && error && (
        <div className="text-sm text-rose-300">{error}</div>
      )}
    </form>
  );
}
