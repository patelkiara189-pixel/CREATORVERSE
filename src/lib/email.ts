import { Resend } from "resend";
import { prisma } from "./prisma";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendRegistrationEmail(opts: {
  to: string;
  fullName: string;
  registrationId: string;
  ticketNumber: string;
  ticketCategory: string;
  verificationToken: string;
  qrDataUrl?: string;
}) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const ticketUrl = `${appUrl}/ticket/${opts.verificationToken}`;

  const subject = `Your CREATORVERSE ticket – ${opts.registrationId}`;

  const html = `
  <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#18181b">
    <h1 style="font-size:22px;margin:0 0 8px">You're registered for CREATORVERSE</h1>
    <p style="color:#52525b;margin:0 0 20px">Create. Connect. Collaborate.</p>
    <p>Hi <strong>${opts.fullName}</strong>,</p>
    <p>Your registration is confirmed. Save this email or open your digital ticket:</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0">
      <tr><td style="padding:8px 0;color:#71717a">Registration ID</td><td style="padding:8px 0;font-weight:600">${opts.registrationId}</td></tr>
      <tr><td style="padding:8px 0;color:#71717a">Ticket Number</td><td style="padding:8px 0;font-weight:600">${opts.ticketNumber}</td></tr>
      <tr><td style="padding:8px 0;color:#71717a">Category</td><td style="padding:8px 0;font-weight:600">${opts.ticketCategory}</td></tr>
    </table>
    <p style="margin:24px 0">
      <a href="${ticketUrl}" style="display:inline-block;background:#7c3aed;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600">View Digital Ticket &amp; QR</a>
    </p>
    <p style="color:#71717a;font-size:14px">Present the QR code at check-in. The code contains only a verification token, not your personal details.</p>
    <p style="color:#a1a1aa;font-size:12px;margin-top:32px">This is an automated message from CREATORVERSE. Ticket prices and dates remain provisional until confirmed by organizers.</p>
  </div>`;

  if (!resend) {
    await prisma.emailLog.create({
      data: {
        toEmail: opts.to,
        subject,
        status: "skipped_no_api_key",
        error: "RESEND_API_KEY not configured",
      },
    });
    return { sent: false, reason: "RESEND_API_KEY not configured" };
  }

  try {
    const result = await resend.emails.send({
      from,
      to: opts.to,
      subject,
      html,
    });

    await prisma.emailLog.create({
      data: {
        toEmail: opts.to,
        subject,
        status: "sent",
        providerId: result.data?.id ?? null,
      },
    });

    return { sent: true, id: result.data?.id };
  } catch (err: any) {
    await prisma.emailLog.create({
      data: {
        toEmail: opts.to,
        subject,
        status: "failed",
        error: err?.message || "Unknown error",
      },
    });
    return { sent: false, reason: err?.message || "send failed" };
  }
}
