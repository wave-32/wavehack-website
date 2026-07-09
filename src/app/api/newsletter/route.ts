import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { NewsletterSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`newsletter:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "Slow down a bit." }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = NewsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const d = parsed.data;
  if (typeof d.website === "string" && d.website.length > 0) {
    return NextResponse.json({ ok: true });
  }
  try {
    const sub = await prisma.newsletterSubscriber.upsert({
      where: { email: d.email.toLowerCase() },
      create: {
        email: d.email.toLowerCase(),
        name: d.name,
        ip,
        ua: req.headers.get("user-agent") ?? undefined,
      },
      update: { name: d.name },
    });
    return NextResponse.json({ ok: true, id: sub.id });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Could not subscribe", detail: String(err) },
      { status: 500 },
    );
  }
}
