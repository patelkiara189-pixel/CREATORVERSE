import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";
import {
  generateRegistrationId,
  generateTicketNumber,
  generateVerificationToken,
} from "@/lib/tickets";
import { sendRegistrationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const settings = await prisma.eventSettings.findFirst();
    if (settings && !settings.registrationOpen) {
      return NextResponse.json({ error: "Registration is currently closed." }, { status: 403 });
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Soft duplicate check: same email + active registration
    const existing = await prisma.registration.findFirst({
      where: { email: data.email.toLowerCase(), status: { not: "CANCELLED" } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An active registration already exists for this email." },
        { status: 409 }
      );
    }

    const registrationId = generateRegistrationId();
    const ticketNumber = generateTicketNumber();
    const verificationToken = generateVerificationToken();

    const reg = await prisma.registration.create({
      data: {
        registrationId,
        ticketNumber,
        verificationToken,
        fullName: data.fullName.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone.trim(),
        ticketCategory: data.ticketCategory,
        organization: data.organization || null,
        city: data.city || null,
        status: "ACTIVE",
      },
    });

    // Fire-and-forget email (do not block success)
    let emailResult = { sent: false, reason: "not attempted" };
    try {
      emailResult = await sendRegistrationEmail({
        to: reg.email,
        fullName: reg.fullName,
        registrationId: reg.registrationId,
        ticketNumber: reg.ticketNumber,
        ticketCategory: reg.ticketCategory,
        verificationToken: reg.verificationToken,
      });
    } catch {
      emailResult = { sent: false, reason: "email exception" };
    }

    return NextResponse.json({
      success: true,
      registrationId: reg.registrationId,
      ticketNumber: reg.ticketNumber,
      verificationToken: reg.verificationToken,
      emailSent: emailResult.sent,
      emailNote: emailResult.sent
        ? "Confirmation email sent."
        : `Email not sent (${"reason" in emailResult ? emailResult.reason : "unknown"}). Use the ticket link below.`,
    });
  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
