import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.FROM_EMAIL || "WaveHack <noreply@wavehack.dev>";
const resend = apiKey ? new Resend(apiKey) : null;

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: EmailPayload) {
  if (!resend) {
    // Dev / no-API-key path — log to server console instead of sending.
    // eslint-disable-next-line no-console
    console.warn(
      `[email:dev-fallback] to=${to} subject=${JSON.stringify(subject)} text=${JSON.stringify(text ?? stripHtml(html))}`,
    );
    return { ok: true as const, id: "dev-fallback", delivered: false };
  }
  try {
    const result = await resend.emails.send({ from, to, subject, html, text });
    return { ok: true as const, id: result.data?.id ?? "unknown", delivered: true };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[email:error]", err);
    return {
      ok: false as const,
      delivered: false,
      error: err instanceof Error ? err.message : "send failed",
    };
  }
}

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

// ---------- Templates ----------

function wrapper(content: string, preheader?: string) {
  return `<!doctype html><html><body style="background:#03060f;color:#eaf2ff;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:24px;">
    ${preheader ? `<div style="display:none">${preheader}</div>` : ""}
    <div style="max-width:560px;margin:0 auto;background:linear-gradient(180deg,#070b1c,#0b1228);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;">
      ${content}
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0"/>
      <p style="font-size:12px;color:#7f8aa6;margin:0">WaveHack · A space-themed hackathon platform</p>
    </div>
  </body></html>`;
}

export const EmailTemplates = {
  participantConfirmation(name: string) {
    return {
      subject: "You're registered for WaveHack 🌊",
      html: wrapper(
        `<h1 style="margin:0 0 12px 0;font-size:22px;background:linear-gradient(120deg,#22e6ff,#a855f7);-webkit-background-clip:text;color:transparent;">Welcome aboard, ${escape(name)}!</h1>
         <p>Thanks for registering for WaveHack. We'll follow up soon with team formation details, sponsor announcements, and the official schedule.</p>
         <p>Keep hacking. 🚀</p>`,
        "You're in!",
      ),
    };
  },
  volunteerConfirmation(name: string, role: string) {
    return {
      subject: `WaveHack team application received — ${role}`,
      html: wrapper(
        `<h1 style="margin:0 0 12px 0;font-size:22px;">Hey ${escape(name)},</h1>
         <p>We've received your application to join the WaveHack team as a <strong>${escape(role)}</strong>. We'll review it and get back to you within a few days.</p>
         <p>In the meantime, drop us anything else you'd like us to see.</p>`,
      ),
    };
  },
  sponsorConfirmation(company: string, contact: string) {
    return {
      subject: "WaveHack partnership inquiry received",
      html: wrapper(
        `<h1 style="margin:0 0 12px 0;font-size:22px;">Hello ${escape(contact)},</h1>
         <p>We received a partnership inquiry from <strong>${escape(company)}</strong>. Our leads will be in touch with a sponsor deck and tier options within 2 business days.</p>
         <p>Thanks for supporting the next generation of builders. 🛰️</p>`,
      ),
    };
  },
  notifyOrganizers(kind: string, payload: Record<string, unknown>): EmailPayload {
    const adminEmail = process.env.ADMIN_EMAIL || "dheepak209@gmail.com";
    return {
      to: adminEmail,
      subject: `[WaveHack] New ${kind} submission`,
      html: wrapper(
        `<h2 style="margin:0 0 12px 0;font-size:18px;">New ${escape(kind)} submission</h2>
         <pre style="background:rgba(255,255,255,0.04);padding:12px;border-radius:8px;overflow:auto;font-size:12px;color:#cdd6f4;">${escape(JSON.stringify(payload, null, 2))}</pre>`,
      ),
    };
  },
};

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
