import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SponsorInquirySchema } from "@/lib/validation";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { sendEmail, EmailTemplates } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = getClientIp(req.headers);
  const limit = rateLimit(`sponsors:${ip}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ ok: false, error: "Too many submissions." }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = SponsorInquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const d = parsed.data;
  if (typeof d.website_check === "string" && d.website_check.length > 0) {
    return NextResponse.json({ ok: true });
  }
  try {
    const created = await prisma.sponsorInquiry.create({
      data: {
        companyName: d.companyName,
        contactName: d.contactName,
        email: d.email.toLowerCase(),
        phone: d.phone,
        website: d.website,
        partnershipType: d.partnershipType,
        orgDescription: d.orgDescription,
        partnershipInterest: d.partnershipInterest,
        supportOffered: d.supportOffered,
        goals: d.goals,
        ip,
        ua: req.headers.get("user-agent") ?? undefined,
      },
    });
    await sendEmail({
      to: d.email,
      ...EmailTemplates.sponsorConfirmation(d.companyName, d.contactName),
    });
    await sendEmail(
      EmailTemplates.notifyOrganizers("sponsor", {
        id: created.id,
        company: d.companyName,
        contact: d.contactName,
        email: d.email,
        type: d.partnershipType,
      }),
    );
    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Could not save inquiry", detail: String(err) },
      { status: 500 },
    );
  }
}
