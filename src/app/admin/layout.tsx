// Minimal pass-through for /admin/*.
// The auth gate lives in `src/app/admin/(protected)/layout.tsx` so that
// `/admin/login` does not trigger a redirect loop when signed-out users
// try to load it.

import type { ReactNode } from "react";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
