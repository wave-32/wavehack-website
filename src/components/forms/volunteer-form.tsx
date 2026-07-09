"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeonButton } from "@/components/ui/primitives";
import {
  Input,
  Textarea,
  RadioGroup,
  Honeypot,
} from "@/components/ui/floating-input";
import { VOLUNTEER_ROLES } from "@/lib/types";
import { Check, AlertCircle } from "lucide-react";

type Errors = Partial<Record<string, string>>;

const EXTRA_BY_ROLE: Record<string, { label: string; name: string; placeholder: string }[]> = {
  intern: [
    {
      label: "Availability (hours/week)",
      name: "intern_hours",
      placeholder: "e.g. 5–10 hrs/week",
    },
  ],
  volunteer: [
    {
      label: "Availability (event-day hours)",
      name: "volunteer_hours",
      placeholder: "e.g. full weekend, half day",
    },
  ],
  org_team: [
    {
      label: "Availability (hours/week)",
      name: "orgteam_hours",
      placeholder: "e.g. 3–6 hrs/week on weekly calls",
    },
  ],
};

export function VolunteerForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [role, setRole] = useState<string>("volunteer");

  const extra = EXTRA_BY_ROLE[role] ?? [];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setErrors({});
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries());
    try {
      const res = await fetch("/api/volunteers", {
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
            className="mx-auto h-20 w-20 rounded-full flex items-center justify-center bg-gradient-to-br from-neon-cyan via-neon-violet to-neon-magenta shadow-neon"
          >
            <Check className="h-10 w-10 text-space-950" strokeWidth={3} />
          </motion.div>
          <div className="mt-6 font-display text-3xl">
            <span className="neon-text">Application received</span>
          </div>
          <p className="mt-3 text-white/70 max-w-md mx-auto">
            We'll review and follow up within a few days. Thanks for stepping up.
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

          <RadioGroup
            name="role"
            label="Which role are you applying for?"
            value={role}
            onChange={setRole}
            options={VOLUNTEER_ROLES.map((r) => ({
              value: r.value,
              label: r.label,
              description: r.description,
            }))}
            error={errors.role}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <Input name="fullName" label="Full Name" required error={errors.fullName} />
            <Input name="email" type="email" label="Email" required error={errors.email} />
            <Input name="age" type="number" label="Age" required error={errors.age} />
            <Input name="school" label="School" required error={errors.school} />
            <Input name="location" label="Location" required error={errors.location} />
            <Input name="resumeUrl" type="url" label="Resume / GitHub link (optional)" error={errors.resumeUrl} />
          </div>

          <Textarea
            name="motivation"
            label="Why do you want to join WaveHack?"
            required
            error={errors.motivation}
            rows={3}
          />
          <Textarea
            name="skills"
            label="Skills you can contribute"
            required
            error={errors.skills}
            placeholder="Design, ops, frontend, hardware, mentorship, sponsorship outreach…"
            rows={3}
          />
          <Textarea
            name="experience"
            label="Relevant experience (optional)"
            error={errors.experience}
            rows={3}
          />
          {/* Dynamic per-role availability */}
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid gap-2"
            >
              {extra.map((f) => (
                <Input
                  key={f.name}
                  name={f.name}
                  label={f.label}
                  placeholder={f.placeholder}
                  error={errors[f.name]}
                />
              ))}
            </motion.div>
          </AnimatePresence>
          {error && (
            <div className="flex items-start gap-2 text-sm text-rose-300 bg-rose-500/10 rounded-md px-3 py-2 border border-rose-400/30">
              <AlertCircle className="h-4 w-4 mt-0.5" /> {error}
            </div>
          )}

          <NeonButton type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
            Submit application
          </NeonButton>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
