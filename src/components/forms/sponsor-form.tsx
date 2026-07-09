"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeonButton } from "@/components/ui/primitives";
import {
  Input,
  Textarea,
  Select,
  Honeypot,
} from "@/components/ui/floating-input";
import { PARTNERSHIP_TYPES } from "@/lib/types";
import { Check, AlertCircle, Handshake } from "lucide-react";

type Errors = Partial<Record<string, string>>;

export function SponsorForm() {
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
      const res = await fetch("/api/sponsors", {
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
            className="mx-auto h-20 w-20 rounded-full flex items-center justify-center bg-gradient-to-br from-neon-magenta via-neon-violet to-neon-cyan shadow-neon"
          >
            <Handshake className="h-10 w-10 text-space-950" strokeWidth={2.5} />
          </motion.div>
          <div className="mt-6 font-display text-3xl">
            <span className="neon-text">Partner with WaveHack</span>
          </div>
          <p className="mt-3 text-white/70 max-w-md mx-auto">
            Help support the next generation of innovators. We'll be in touch
            with our sponsor deck within 2 business days.
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
          <Honeypot name="website_check" />

          <div className="grid gap-6 md:grid-cols-2">
            <Input name="companyName" label="Company / Organization" required error={errors.companyName} />
            <Input name="contactName" label="Contact Person" required error={errors.contactName} />
            <Input name="email" type="email" label="Email" required error={errors.email} />
            <Input name="phone" label="Phone" error={errors.phone} />
            <Input name="website" type="url" label="Website" error={errors.website} />
            <Select
              name="partnershipType"
              label="Partnership Type"
              required
              error={errors.partnershipType}
              options={PARTNERSHIP_TYPES.map((p) => ({ value: p.value, label: p.label }))}
            />
          </div>

          <Textarea
            name="orgDescription"
            label="Tell us about your organization"
            required
            error={errors.orgDescription}
            rows={3}
          />
          <Textarea
            name="partnershipInterest"
            label="What partnership are you interested in?"
            required
            error={errors.partnershipInterest}
            rows={3}
          />
          <Textarea
            name="supportOffered"
            label="What support can you provide?"
            required
            error={errors.supportOffered}
            placeholder="e.g. cash sponsorship, swag, mentors, cloud credits, prize categories"
            rows={3}
          />
          <Textarea
            name="goals"
            label="What goals do you have?"
            required
            error={errors.goals}
            rows={3}
          />

          {error && (
            <div className="flex items-start gap-2 text-sm text-rose-300 bg-rose-500/10 rounded-md px-3 py-2 border border-rose-400/30">
              <AlertCircle className="h-4 w-4 mt-0.5" /> {error}
            </div>
          )}

          <NeonButton type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
            <Handshake className="h-4 w-4" /> Submit partnership inquiry
          </NeonButton>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
