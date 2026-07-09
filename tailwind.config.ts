import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Deep space background palette
        space: {
          950: "#03060f",
          900: "#070b1c",
          800: "#0b1228",
          700: "#111935",
          600: "#1a2347",
        },
        // Neon accents
        neon: {
          cyan: "#22e6ff",
          violet: "#a855f7",
          magenta: "#ff3df5",
          lime: "#aaff3a",
          amber: "#ffb53d",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "grid-radial":
          "radial-gradient(circle at 50% 50%, rgba(34,230,255,0.10), transparent 55%)",
        "noise":
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.08 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(34,230,255,0.35), 0 0 24px -4px rgba(34,230,255,0.55), 0 0 80px -20px rgba(168,85,247,0.45)",
        "neon-soft": "0 0 0 1px rgba(34,230,255,0.18), 0 0 28px -8px rgba(34,230,255,0.35)",
        "neon-violet": "0 0 0 1px rgba(168,85,247,0.35), 0 0 28px -6px rgba(168,85,247,0.5)",
        glass: "inset 0 1px 0 0 rgba(255,255,255,0.08), 0 8px 30px -10px rgba(0,0,0,0.6)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%, 100%": { opacity: "0.85", filter: "drop-shadow(0 0 16px #22e6ff)" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 28px #a855f7)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        glow: "glow 5s ease-in-out infinite",
        float: "float 7s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.9s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
