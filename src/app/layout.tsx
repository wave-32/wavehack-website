import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const siteName = process.env.NEXT_PUBLIC_HACKATHON_NAME || "WaveHack";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://wavehack.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — A space-themed hackathon for the next generation of builders`,
    template: `%s | ${siteName}`,
  },
  description:
    "WaveHack is a futuristic, space-themed hackathon bringing together students and builders to create open-source projects, compete for prizes, and launch into the next wave of technology.",
  keywords: [
    "WaveHack",
    "hackathon",
    "open source",
    "student hackathon",
    "future tech",
  ],
  openGraph: {
    title: `${siteName} — Hack the Wave`,
    description:
      "An immersive hackathon for the next generation of builders. Register, build, win.",
    type: "website",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-space-900"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main" className="relative">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
