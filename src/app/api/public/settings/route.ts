import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.eventSettings.findFirst();
    const speakers = await prisma.speaker.findMany({
      where: { OR: [{ published: true }, { status: "PROPOSED" }] },
      orderBy: { sortOrder: "asc" },
    });
    // Only expose safe public fields for unpublished/proposed
    const publicSpeakers = speakers.map((s) => ({
      id: s.id,
      name: s.name,
      bio: s.bio,
      expertise: s.expertise,
      status: s.status,
      published: s.published,
    }));

    return NextResponse.json({
      settings: settings || null,
      speakers: publicSpeakers,
    });
  } catch {
    return NextResponse.json({ settings: null, speakers: [] });
  }
}
