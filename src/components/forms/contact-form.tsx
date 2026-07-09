"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeonButton } from "@/components/ui/primitives";
import { Input, Textarea, Honeypot } from "@/components/ui/floating-input";
import { Mail, Phone, Check, AlertCircle } from "lucide-react";
import type { Errors } from "./shared";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
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
      const res = await fetch("/api/contact", {
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
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative grain rounded-3xl p-10 sm:p-14 text-center glass-strong"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 14 }}
              className="mx-auto h-20 w-20 rounded-full flex items-center justify-center bg-gradient-to-br from-neon-cyan via-neon-violet to-neon-magenta shadow-neon"
            >
              <Check className="h-10 w-10 text-space-950" strokeWidth={3} />
            </motion.div>
            <div className="mt-6 font-display text-3xl">
              <span className="neon-text">Message sent</span>
            </div>
            <p className="mt-3 text-white/70 max-w-md mx-auto">
              We'll get back to you within a couple of business days.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-6 glass grain rounded-3xl p-6 sm:p-10"
            noValidate
          >
            <Honeypot />
            <div className="grid gap-6 md:grid-cols-2">
              <Input name="name" label="Name" required error={errors.name} />
              <Input name="email" type="email" label="Email" required error={errors.email} />
            </div>
            <Input name="subject" label="Subject" required error={errors.subject} />
            <Textarea name="message" label="Message" required error={errors.message} rows={6} />

            {error && (
              <div className="flex items-start gap-2 text-sm text-rose-300 bg-rose-500/10 rounded-md px-3 py-2 border border-rose-400/30">
                <AlertCircle className="h-4 w-4 mt-0.5" /> {error}
              </div>
            )}

            <NeonButton type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
              <Mail className="h-4 w-4" /> Send message
            </NeonButton>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="glass grain rounded-3xl p-6 sm:p-8 h-full">
        <h3 className="font-display text-2xl">Contact</h3>
        <p className="mt-2 text-white/65 text-sm">
          For inquiries, partnerships, and sponsorship opportunities:
        </p>
        <div className="mt-6 grid gap-4">
          <a
            href="mailto:dheepak209@gmail.com"
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3 hover:bg-white/[0.06] transition"
          >
            <Mail className="h-4 w-4 text-neon-cyan" />
            <div className="text-sm">
              <div className="text-xs text-white/50 uppercase tracking-widest">Email</div>
              <div>dheepak209@gmail.com</div>
            </div>
          </a>
          <a
            href="tel:4708089390"
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3 hover:bg-white/[0.06] transition"
          >
            <Phone className="h-4 w-4 text-neon-violet" />
            <div className="text-sm">
              <div className="text-xs text-white/50 uppercase tracking-widest">Phone</div>
              <div>470-808-9390</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
