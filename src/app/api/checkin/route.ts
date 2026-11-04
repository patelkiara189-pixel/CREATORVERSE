import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { checkinSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const session = await requireSession([
    "SUPER_ADMIN",
    "EVENT_MANAGER",
    "REGISTRATION_STAFF",
    "CHECKIN_STAFF",
  ]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = checkinSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }
    const token = parsed.data.token.trim();

    let reg = await prisma.registration.findUnique({ where: { verificationToken: token } });
    if (!reg) {
      reg = await prisma.registration.findUnique({ where: { registrationId: token } });
    }
    if (!reg) {
      reg = await prisma.registration.findUnique({ where: { ticketNumber: token } });
    }

    if (!reg) {
      return NextResponse.json({
        success: false,
        message: "Ticket not found / invalid",
      });
    }

    if (reg.status === "CANCELLED") {
      return NextResponse.json({
        success: false,
        message: "Ticket has been cancelled",
        registration: { fullName: reg.fullName, registrationId: reg.registrationId, status: reg.status },
      });
    }

    if (reg.status === "CHECKED_IN") {
      return NextResponse.json({
        success: false,
        message: `Already checked in at ${reg.checkedInAt?.toISOString() ?? "unknown"}`,
        registration: { fullName: reg.fullName, registrationId: reg.registrationId, status: reg.status },
      });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const u = await tx.registration.update({
        where: { id: reg!.id },
        data: { status: "CHECKED_IN", checkedInAt: new Date() },
      });
      await tx.checkIn.create({
        data: {
          registrationId: reg!.id,
          performedById: session.id,
          notes: "Successful check-in",
        },
      });
      return u;
    });

    return NextResponse.json({
      success: true,
      message: "Check-in successful",
      registration: {
        fullName: updated.fullName,
        registrationId: updated.registrationId,
        status: updated.status,
      },
    });
  } catch (err: any) {
    console.error("Check-in error:", err);
    return NextResponse.json({ error: "Check-in failed" }, { status: 500 });
  }
}
