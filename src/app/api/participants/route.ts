import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ParticipantSchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail, EmailTemplates } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`participants:${ip}`, 3, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Try again shortly." },
      { status: 429 },
    );
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = ParticipantSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;
  // honeypot: if website field filled, silently "succeed"
  if (typeof data.website === "string" && data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }
  try {
    const created = await prisma.participant.upsert({
      where: { email: data.email.toLowerCase() },
      create: {
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        age: data.age,
        school: data.school,
        grade: data.grade,
        location: data.location,
        codingExperience: data.codingExperience,
        skills: data.skills,
        teamStatus: data.teamStatus,
        github: data.github,
        portfolio: data.portfolio,
        prevExperience: data.prevExperience,
        motivation: data.motivation,
        accessibility: data.accessibility,
        ip,
        ua: req.headers.get("user-agent") ?? undefined,
      },
      update: {
        fullName: data.fullName,
        age: data.age,
        school: data.school,
        grade: data.grade,
        location: data.location,
        codingExperience: data.codingExperience,
        skills: data.skills,
        teamStatus: data.teamStatus,
        github: data.github,
        portfolio: data.portfolio,
        prevExperience: data.prevExperience,
        motivation: data.motivation,
        accessibility: data.accessibility,
      },
    });
    await sendEmail({
      to: data.email,
      ...EmailTemplates.participantConfirmation(data.fullName),
    });
    await sendEmail(
      EmailTemplates.notifyOrganizers("participant", {
        id: created.id,
        fullName: created.fullName,
        email: created.email,
        teamStatus: created.teamStatus,
        school: created.school,
      }),
    );
    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: "Could not save registration",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
