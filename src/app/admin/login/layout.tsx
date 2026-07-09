// Login page bypasses the auth gate (handled in the parent layout).

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
