import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  listContent,
  upsertContent,
  deleteContent,
} from "@/lib/content";
import type {
  Sponsor,
  Winner,
  TeamMember,
  GalleryItem,
  StatItem,
  FaqItem,
  EventInfo,
  HeroContent,
  Judge,
  Speaker,
  Mentor,
  Testimonial,
} from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isKind(s: unknown): s is string {
  return typeof s === "string" && s.length > 0;
}

// GET — public, lists all of a kind
export async function GET(req: Request) {
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind");
  if (kind && isKind(kind)) {
    return NextResponse.json({ ok: true, data: await listContent(kind) });
  }
  if (kind === "all") {
    const out: Record<string, unknown> = {};
    const kinds = await prismaDistinctKinds();
    for (const k of kinds) out[k] = await listContent(k);
    return NextResponse.json({ ok: true, data: out });
  }
  return NextResponse.json({ ok: false, error: "Missing ?kind=" }, { status: 400 });
}

async function prismaDistinctKinds(): Promise<string[]> {
  const rows = await prisma.contentItem.findMany({
    distinct: ["kind"],
    select: { kind: true },
  });
  return rows.map((r) => r.kind);
}

// POST/PATCH/DELETE — admin only
async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return null;
  }
  return session;
}

export async function POST(req: Request) {
  if (!(await requireAdmin()))
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (
    !body ||
    typeof body.kind !== "string" ||
    typeof body.key !== "string" ||
    !isKind(body.kind)
  ) {
    return NextResponse.json({ ok: false, error: "Bad content payload" }, { status: 400 });
  }
  const order = typeof body.order === "number" ? body.order : 0;
  const row = await upsertContent(body.kind, body.key, body.data ?? {}, order);
  return NextResponse.json({ ok: true, id: row.id });
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin()))
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (
    !body ||
    typeof body.kind !== "string" ||
    typeof body.key !== "string" ||
    !isKind(body.kind)
  ) {
    return NextResponse.json({ ok: false, error: "Bad content payload" }, { status: 400 });
  }
  const row = await upsertContent(body.kind, body.key, body.data ?? {}, body.order ?? 0);
  return NextResponse.json({ ok: true, id: row.id });
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin()))
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind");
  const key = url.searchParams.get("key");
  if (!kind || !isKind(kind) || !key) {
    return NextResponse.json({ ok: false, error: "Missing kind/key" }, { status: 400 });
  }
  await deleteContent(kind, key);
  return NextResponse.json({ ok: true });
}

export type {
  Sponsor,
  Winner,
  TeamMember,
  GalleryItem,
  StatItem,
  FaqItem,
  EventInfo,
  HeroContent,
  Judge,
  Speaker,
  Mentor,
  Testimonial,
};
