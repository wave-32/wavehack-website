import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSignOut } from "@/components/admin/admin-signout";
import {
  LayoutDashboard,
  Users,
  Handshake,
  Mail,
  Sparkles,
  GalleryHorizontalEnd,
  Database,
} from "lucide-react";
import type { ReactNode } from "react";

export const metadata = { title: "Admin" };

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/participants", label: "Participants", icon: Users },
  { href: "/admin/volunteers", label: "Volunteers", icon: Sparkles },
  { href: "/admin/sponsors", label: "Sponsors", icon: Handshake },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/content", label: "Content", icon: GalleryHorizontalEnd },
  { href: "/admin/database", label: "Database", icon: Database },
];

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen -mt-16 pt-16">
      <div className="grid lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-16 self-start lg:h-[calc(100vh-4rem)] border-r border-white/10 bg-space-950/40 backdrop-blur-xl p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-md neon-border" />
            <div>
              <div className="font-display text-sm">WaveHack</div>
              <div className="text-[10px] uppercase tracking-widest text-white/50">
                Admin Console
              </div>
            </div>
          </div>
          <nav className="grid gap-1">
            {NAV.map((n) => {
              const Icon = n.icon;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-white/80 hover:bg-white/5 hover:text-white transition"
                >
                  <Icon className="h-4 w-4 text-neon-cyan/80" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 pt-4 border-t border-white/10 text-xs text-white/60">
            Signed in as <span className="text-white">{session.user.email}</span>
            <div className="mt-2">
              <AdminSignOut />
            </div>
          </div>
        </aside>
        <main className="p-4 sm:p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
