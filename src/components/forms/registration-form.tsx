"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeonButton } from "@/components/ui/primitives";
import { Input, Textarea, Select, RadioGroup, Honeypot } from "@/components/ui/floating-input";
import { TEAM_STATUSES } from "@/lib/types";
import { Check, Rocket, AlertCircle } from "lucide-react";

type Errors = Partial<Record<string, string>>;

export function RegistrationForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [teamStatus, setTeamStatus] = useState<string>("looking");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setErrors({});
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries());
    try {
      const res = await fetch("/api/participants", {
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
      setSuccess(json.id ?? "ok");
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
          exit={{ opacity: 0 }}
          className="relative grain rounded-3xl p-10 sm:p-14 text-center glass-strong"
        >
          <div className="absolute inset-0 -z-10 mask-radial bg-grid-radial" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="mx-auto h-20 w-20 rounded-full flex items-center justify-center bg-gradient-to-br from-neon-cyan via-neon-violet to-neon-magenta shadow-neon"
          >
            <Check className="h-10 w-10 text-space-950" strokeWidth={3} />
          </motion.div>
          <div className="mt-6 font-display text-3xl sm:text-4xl">
            <span className="neon-text">You're in!</span>
          </div>
          <p className="mt-3 text-white/70 max-w-md mx-auto">
            Welcome to WaveHack. We've sent a confirmation email with what's next.
          </p>
          <button
            onClick={() => setSuccess(null)}
            className="mt-6 text-sm text-white/50 hover:text-white underline"
          >
            Register another person
          </button>
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
            <Input name="fullName" label="Full Name" required error={errors.fullName} placeholder="Ada Lovelace" />
            <Input name="email" type="email" label="Email" required error={errors.email} placeholder="you@example.com" />
            <Input name="age" type="number" label="Age" required error={errors.age} placeholder="17" />
            <Input name="school" label="School / University" required error={errors.school} placeholder="MIT" />
            <Input name="grade" label="Grade Level" required error={errors.grade} placeholder="Junior" />
            <Input name="location" label="Location" required error={errors.location} placeholder="Boston, USA" />
          </div>

          <Input
            name="codingExperience"
            label="Coding Experience"
            required
            error={errors.codingExperience}
            placeholder="Beginner / Intermediate / Advanced"
          />

          <Textarea
            name="skills"
            label="Skills — languages, frameworks, tools"
            required
            error={errors.skills}
            placeholder="TypeScript, React, Python, PyTorch, Three.js…"
          />

          <RadioGroup
            name="teamStatus"
            label="Team Status"
            value={teamStatus}
            onChange={setTeamStatus}
            options={[...TEAM_STATUSES]}
            error={errors.teamStatus}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <Input
              name="github"
              type="url"
              label="GitHub (optional)"
              error={errors.github}
              placeholder="https://github.com/yourname"
            />
            <Input
              name="portfolio"
              type="url"
              label="Portfolio (optional)"
              error={errors.portfolio}
              placeholder="https://yourdomain.com"
            />
          </div>
          <Textarea
            name="prevExperience"
            label="Previous hackathon experience (optional)"
            error={errors.prevExperience}
            placeholder="Tell us about past events you attended."
            rows={3}
          />
          <Textarea
            name="motivation"
            label="Why do you want to participate? (optional)"
            error={errors.motivation}
            rows={3}
          />
          <Textarea
            name="accessibility"
            label="Accessibility requirements (optional)"
            error={errors.accessibility}
            placeholder="Anything we should know to make this event great for you."
            rows={2}
          />

          {error && (
            <div className="flex items-start gap-2 text-sm text-rose-300 bg-rose-500/10 rounded-md px-3 py-2 border border-rose-400/30">
              <AlertCircle className="h-4 w-4 mt-0.5" /> {error}
            </div>
          )}

          <NeonButton type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
            <Rocket className="h-4 w-4" /> Launch my registration
          </NeonButton>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
