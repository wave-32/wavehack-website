# 🌊 WaveHack — Hackathon Platform

A futuristic, immersive hackathon platform built with **Next.js 14 + React Three Fiber + Prisma + NextAuth + Resend**. Long-term home for WaveHack events.

> Space-themed, dark, neon, fully editable from an admin dashboard.

---

## ✨ Features

### Frontend
- Full-screen 3D hero (starfield + nebula shader, GPU particle→wordmark morph, liquid-blob, mouse-parallax floating cards)
- Interactive 3D timeline of past events (WaveHack · CyberWave · ~WaveHack 2026)
- Animated counters, glass panels, neon gradient text, scanline-free grain
- Floating labels, dynamic forms (different questions per role)
- Reveal-on-scroll, mouse parallax, performance-aware `PerformanceMonitor` (drops DPR on low-end)
- Live countdown to **August 1, 2026** ("WaveHack is Live!" after)

### Backend
- Prisma + SQLite for the MVP (swap to Postgres/Supabase in production)
- All forms write to DB with zod validation + per-IP rate limiting + honeypot
- NextAuth credentials provider; admin seeded from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- Resend for transactional emails (with **console fallback** if `RESEND_API_KEY` unset, so it works dev / free)
- JSON-based content model for editable collections (sponsors, winners, team, judges, mentors, speakers, gallery, stats, FAQ, event info)

### Admin Dashboard
- Login + session-protected admin shell
- Tables for participants / volunteers / sponsors / newsletter (search, filter, sort, CSV export, status updates)
- Visual **content editor** with tabs for every collection
- DB health page

### Email automation
- Participant confirmation
- Volunteer/Intern/Org-team confirmation
- Sponsor/professional confirmation
- Organizer notified on every submission

### Security
- Server-side zod validation
- Honeypot fields
- Per-IP, per-route in-memory rate limiting (swap for Redis in multi-instance prod)
- NextAuth JWT sessions, `httpOnly` cookies
- Admin routes server-gated via `auth()`

---

## 🚀 Getting started

```bash
# 1. install
npm install

# 2. copy env & set secrets
cp .env.example .env
#   ADMIN_EMAIL / ADMIN_PASSWORD seed the first admin
#   NEXTAUTH_SECRET should be `openssl rand -base64 32`
#   RESEND_API_KEY optional; if unset, emails log to console

# 3. push the DB schema
npx prisma db push

# 4. seed admin user + editable content
npm run db:seed

# 5. dev
npm run dev
# open http://localhost:3000
# admin → http://localhost:3000/admin/login
```

## 📜 Scripts

| script | purpose |
| --- | --- |
| `npm run dev` | Next.js dev |
| `npm run build` | Generate Prisma client + Next.js production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run db:push` | Push Prisma schema to SQLite |
| `npm run db:seed` | Seed initial admin + content |
| `npm run db:studio` | Open Prisma Studio |

---

## 🧱 Architecture

```
src/
├── app/
│   ├── layout.tsx                # fonts, nav, footer
│   ├── page.tsx                  # homepage (loads editable content)
│   ├── admin/
│   │   ├── layout.tsx            # auth-gated shell with sidebar
│   │   ├── login/page.tsx
│   │   ├── page.tsx              # overview
│   │   ├── participants/page.tsx
│   │   ├── volunteers/page.tsx
│   │   ├── sponsors/page.tsx
│   │   ├── newsletter/page.tsx
│   │   ├── content/page.tsx      # content manager
│   │   └── database/page.tsx
│   └── api/
│       ├── participants/route.ts
│       ├── volunteers/route.ts
│       ├── sponsors/route.ts
│       ├── newsletter/route.ts
│       ├── contact/route.ts
│       ├── content/route.ts
│       └── auth/[...nextauth]/route.ts
├── components/
│   ├── layout/                   # nav, footer
│   ├── ui/                       # primitives, countdown, counter, reveal
│   ├── 3d/                       # hero scene, particle-wordmark, liquid-blob, space-bg
│   ├── sections/                 # hero, event, stats, past, winners, projects, sponsors, gallery, team, faq, registration, contact, ...
│   ├── forms/                    # registration, volunteer, sponsor, contact, newsletter
│   └── admin/                    # table, content editor
├── lib/
│   ├── db.ts                     # Prisma singleton
│   ├── auth.ts                   # NextAuth credentials
│   ├── email.ts                  # Resend + console fallback + templates
│   ├── validation.ts             # Zod schemas
│   ├── content.ts                # JSON content CRUD
│   ├── rate-limit.ts             # per-IP rate limiter
│   ├── types.ts                  # status unions (replaces Prisma enums)
│   ├── three-utils.ts            # sampling + math helpers
│   └── utils.ts
prisma/
├── schema.prisma
└── seed.ts
```

### Why no Prisma enums?

SQLite doesn't support them. Status fields are typed as `String` in the schema and constrained at the TS layer in `src/lib/types.ts`. This keeps the MVP portable to other DBs later (Postgres/Supabase can upgrade to native enums by editing one schema).

### Why dynamic-import R3F?

React Three Fiber depends on browser-only APIs. `next/dynamic` with `ssr: false` keeps the SSR pass clean and avoids hydration errors. The `<HeroScene>` is loaded only on the client.

### Editable content

`ContentItem` is a `(kind, key)` indexed table with a JSON `data` blob. Each kind has its own TS-typed shape in `src/lib/content.ts` and a default field schema in the admin editor (`SCHEMAS`).

---

## 🛡️ Security notes

- Rate limits are in-memory per process — replace with Upstash/Redis for horizontally-scaled deploys.
- Honeypot fields are silently `ok`'d so bots believe they succeeded.
- The admin login page is the only public `/admin/*` route; everything else is server-gated by `auth()`.
- All forms are zod-validated server-side; client-side errors are advisory.
- Set a strong `NEXTAUTH_SECRET` (`openssl rand -base64 32`).

## 🚢 Deploying

Next.js + SQLite works on Vercel/Render/Railway, but **on serverless SQLite won't survive cold starts** (writes live in `/tmp`). For production we recommend:

1. Switch `provider` in `prisma/schema.prisma` to `postgresql`.
2. Point `DATABASE_URL` at Supabase / Neon / your own Postgres.
3. Re-introduce native enums (the changes are local to the schema + `src/lib/types.ts`).
4. Replace `src/lib/rate-limit.ts` with an Upstash Redis client.
5. Add `RESEND_API_KEY` + verified domain in `FROM_EMAIL`.

## 🤝 Maintainers

You can swap image/logo URLs and all editable content via `/admin/content`. New fields can be added by:

- typing them in `src/lib/content.ts`
- adding a Zod schema in `src/lib/validation.ts` (if public form input)
- extending `SCHEMAS[*]` in `src/components/admin/admin-content-editor.tsx`

Built with care by the WaveHack organizing team.
