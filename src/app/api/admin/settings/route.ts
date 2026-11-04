import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET() {
  const settings = await prisma.eventSettings.findFirst();
  return NextResponse.json(settings || {});
}

export async function PATCH(req: NextRequest) {
  const session = await requireSession(["SUPER_ADMIN", "EVENT_MANAGER"]);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const allowed = [
    "eventName",
    "tagline",
    "description",
    "startDate",
    "endDate",
    "venueName",
    "venueAddress",
    "organizerName",
    "organizerEmail",
    "organizerPhone",
    "registrationOpen",
    "primaryColor",
    "secondaryColor",
    "privacyNotice",
  ] as const;

  const data: any = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  const existing = await prisma.eventSettings.findFirst();
  let settings;
  if (existing) {
    settings = await prisma.eventSettings.update({ where: { id: existing.id }, data });
  } else {
    settings = await prisma.eventSettings.create({ data });
  }

  await prisma.auditLog.create({
    data: {
      userId: session.id,
      action: "UPDATE_SETTINGS",
      entity: "EventSettings",
      entityId: settings.id,
      details: data,
    },
  });

  return NextResponse.json({ success: true, settings });
}
