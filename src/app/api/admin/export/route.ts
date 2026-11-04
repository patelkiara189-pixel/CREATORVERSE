import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET() {
  const session = await requireSession([
    "SUPER_ADMIN",
    "EVENT_MANAGER",
    "REGISTRATION_STAFF",
  ]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const regs = await prisma.registration.findMany({ orderBy: { createdAt: "desc" } });

  const header = [
    "registration_id",
    "ticket_number",
    "full_name",
    "email",
    "phone",
    "ticket_category",
    "organization",
    "city",
    "status",
    "created_at",
    "checked_in_at",
  ].join(",");

  const rows = regs.map((r) =>
    [
      r.registrationId,
      r.ticketNumber,
      `"${r.fullName.replace(/"/g, '""')}"`,
      r.email,
      r.phone,
      r.ticketCategory,
      r.organization || "",
      r.city || "",
      r.status,
      r.createdAt.toISOString(),
      r.checkedInAt?.toISOString() || "",
    ].join(",")
  );

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=creatorverse-registrations.csv",
    },
  });
}
