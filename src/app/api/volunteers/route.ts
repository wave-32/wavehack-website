import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { VolunteerSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail, EmailTemplates } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`volunteers:${ip}`, 3, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "Too many submissions." }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = VolunteerSchema.safeParse(body);
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
    const created = await prisma.volunteerApplication.upsert({
      where: { email: d.email.toLowerCase() },
      create: {
        fullName: d.fullName,
        email: d.email.toLowerCase(),
        age: d.age,
        school: d.school,
        location: d.location,
        role: d.role,
        motivation: d.motivation,
        skills: d.skills,
        experience: d.experience,
        availability: d.availability,
        resumeUrl: d.resumeUrl,
        ip,
        ua: req.headers.get("user-agent") ?? undefined,
      },
      update: {
        fullName: d.fullName,
        age: d.age,
        school: d.school,
        location: d.location,
        role: d.role,
        motivation: d.motivation,
        skills: d.skills,
        experience: d.experience,
        availability: d.availability,
        resumeUrl: d.resumeUrl,
      },
    });
    await sendEmail({
      to: d.email,
      ...EmailTemplates.volunteerConfirmation(d.fullName, d.role),
    });
    await sendEmail(
      EmailTemplates.notifyOrganizers("volunteer", {
        id: created.id,
        fullName: created.fullName,
        email: created.email,
        role: d.role,
      }),
    );
    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Could not save application", detail: String(err) },
      { status: 500 },
    );
  }
}
