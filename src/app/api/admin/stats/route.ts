import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET() {
  const session = await requireSession([
    "SUPER_ADMIN",
    "EVENT_MANAGER",
    "REGISTRATION_STAFF",
    "CHECKIN_STAFF",
  ]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [byStatus, byCategory, total] = await Promise.all([
    prisma.registration.groupBy({ by: ["status"], _count: true }),
    prisma.registration.groupBy({ by: ["ticketCategory"], _count: true }),
    prisma.registration.count(),
  ]);

  const statusMap: Record<string, number> = {};
  byStatus.forEach((r) => (statusMap[r.status] = r._count));

  const categoryMap: Record<string, number> = {};
  byCategory.forEach((r) => (categoryMap[r.ticketCategory] = r._count));

  return NextResponse.json({
    total,
    active: statusMap["ACTIVE"] || 0,
    checkedIn: statusMap["CHECKED_IN"] || 0,
    cancelled: statusMap["CANCELLED"] || 0,
    byCategory: categoryMap,
  });
}
