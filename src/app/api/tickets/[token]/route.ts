import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQrDataUrl } from "@/lib/tickets";

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = params.token;
  const reg = await prisma.registration.findUnique({
    where: { verificationToken: token },
  });
  if (!reg) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const qrDataUrl = await generateQrDataUrl(reg.verificationToken);

  // Public-safe fields only
  return NextResponse.json({
    registrationId: reg.registrationId,
    ticketNumber: reg.ticketNumber,
    fullName: reg.fullName,
    ticketCategory: reg.ticketCategory,
    status: reg.status,
    createdAt: reg.createdAt,
    qrDataUrl,
  });
}
