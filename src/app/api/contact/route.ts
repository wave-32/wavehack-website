import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ContactSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail, EmailTemplates } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "Too many submissions." }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = ContactSchema.safeParse(body);
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
    const created = await prisma.contactMessage.create({
      data: {
        name: d.name,
        email: d.email.toLowerCase(),
        subject: d.subject,
        message: d.message,
        ip,
        ua: req.headers.get("user-agent") ?? undefined,
      },
    });
    await sendEmail(
      EmailTemplates.notifyOrganizers("contact", {
        id: created.id,
        name: d.name,
        email: d.email,
        subject: d.subject,
      }),
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Could not send message", detail: String(err) },
      { status: 500 },
    );
  }
}
