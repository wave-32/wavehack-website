"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function AdminSignOut() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] text-xs text-white/80"
    >
      <LogOut className="h-3.5 w-3.5" /> Sign out
    </button>
  );
}
