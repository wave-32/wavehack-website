"use client";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { NeonButton } from "@/components/ui/primitives";
import { Input } from "@/components/ui/floating-input";
import { Lock, Star } from "lucide-react";

function AdminLoginInner() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (!res?.ok) {
      setError("Invalid email or password.");
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 -mt-16 pt-16">
      <form
        onSubmit={onSubmit}
        className="glass grain w-full max-w-md rounded-3xl p-8 grid gap-4"
      >
        <div className="inline-flex items-center gap-2 self-start text-xs uppercase tracking-[0.3em] text-white/60">
          <Star className="h-3 w-3 text-neon-cyan" /> WaveHack Admin
        </div>
        <h1 className="font-display text-3xl">
          <span className="neon-text">Sign in</span>
        </h1>
        <p className="text-sm text-white/60">
          Restricted to organizers. Your credentials stay on this device.
        </p>
        <Input
          name="email"
          type="email"
          label="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@wavehack.local"
        />
        <Input
          name="password"
          type="password"
          label="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <div className="text-sm text-rose-300 bg-rose-500/10 rounded-md px-3 py-2 border border-rose-400/30">
            {error}
          </div>
        )}
        <NeonButton type="submit" loading={loading} className="mt-2">
          <Lock className="h-4 w-4" /> Sign in
        </NeonButton>
      </form>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={null}>
      <AdminLoginInner />
    </Suspense>
  );
}
