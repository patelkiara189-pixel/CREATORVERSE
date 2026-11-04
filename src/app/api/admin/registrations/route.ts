import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await requireSession([
    "SUPER_ADMIN",
    "EVENT_MANAGER",
    "REGISTRATION_STAFF",
  ]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
  const take = Math.min(parseInt(searchParams.get("limit") || "100", 10), 500);

  const where: any = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { registrationId: { contains: q, mode: "insensitive" } },
      { ticketNumber: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.registration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
    }),
    prisma.registration.count({ where }),
  ]);

  return NextResponse.json({ items, total });
}

export async function PATCH(req: NextRequest) {
  const session = await requireSession(["SUPER_ADMIN", "EVENT_MANAGER", "REGISTRATION_STAFF"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { registrationId, status } = body;
  if (!registrationId || !["ACTIVE", "CHECKED_IN", "CANCELLED"].includes(status)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await prisma.registration.update({
    where: { registrationId },
    data: {
      status,
      checkedInAt: status === "CHECKED_IN" ? new Date() : undefined,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: session.id,
      action: "UPDATE_STATUS",
      entity: "Registration",
      entityId: updated.id,
      details: { registrationId, status },
    },
  });

  return NextResponse.json({ success: true, registration: updated });
}
