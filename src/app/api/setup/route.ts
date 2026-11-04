import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

/**
 * One-time protected setup endpoint.
 * POST /api/setup
 * Header: x-setup-secret: <SETUP_SECRET>
 * Body (optional JSON): { adminEmail, adminPassword, adminName }
 *
 * Creates tables via Prisma (assumes DATABASE_URL is set and schema can be pushed),
 * seeds EventSettings, default speakers (proposed), and the super admin user.
 * After first successful run, SetupState.completed = true and further calls are rejected.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-setup-secret") || "";
  const expected = process.env.SETUP_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if already completed
    let setup = await prisma.setupState.findUnique({ where: { id: "setup" } });
    if (setup?.completed) {
      return NextResponse.json(
        { error: "Setup already completed. Delete SetupState row to re-run (not recommended)." },
        { status: 409 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const adminEmail = (body.adminEmail || "admin@creatorverse.in").toLowerCase();
    const adminPassword = body.adminPassword || "ChangeMeNow123!";
    const adminName = body.adminName || "Super Admin";

    // Ensure settings exist
    const settingsCount = await prisma.eventSettings.count();
    if (settingsCount === 0) {
      await prisma.eventSettings.create({
        data: {
          agenda: [
            {
              day: 1,
              items: [
                { time: "09:00 – 10:00", title: "Registration & Welcome Networking", desc: "" },
                { time: "10:00 – 11:00", title: "Opening Keynote", desc: "The Future of Content Creation" },
                { time: "11:15 – 12:30", title: "Panel: Building Your Personal Brand", desc: "" },
                { time: "13:30 – 15:00", title: "Reel Factory Workshop", desc: "Hands-on short-form video" },
                { time: "15:15 – 16:30", title: "Creator × Brand Speed Networking", desc: "" },
              ],
            },
            {
              day: 2,
              items: [
                { time: "10:30 – 12:00", title: "Creator Challenge Finals", desc: "" },
                { time: "13:00 – 14:30", title: "Masterclass: Monetization", desc: "" },
                { time: "14:45 – 16:00", title: "Creator Spotlight Awards", desc: "" },
                { time: "16:15 – 17:00", title: "Closing Keynote & Farewell", desc: "" },
              ],
            },
          ],
        },
      });
    }

    // Seed proposed speakers if empty
    const speakerCount = await prisma.speaker.count();
    if (speakerCount === 0) {
      const proposed = [
        { name: "Ranveer Allahbadia", bio: "Podcaster and content creator", expertise: "Podcasting, personal brand" },
        { name: "Prajakta Koli", bio: "Actress and YouTuber", expertise: "Comedy, storytelling" },
        { name: "Bhuvan Bam", bio: "Comedian and content creator", expertise: "Comedy, short-form" },
        { name: "Mumbiker Nikhil", bio: "Travel vlogger", expertise: "Travel, vlogging" },
        { name: "Ankur Warikoo", bio: "Entrepreneur and creator", expertise: "Startups, personal finance" },
        { name: "Dolly Singh", bio: "Content creator and actress", expertise: "Comedy, lifestyle" },
      ];
      for (let i = 0; i < proposed.length; i++) {
        await prisma.speaker.create({
          data: { ...proposed[i], status: "PROPOSED", published: false, sortOrder: i },
        });
      }
    }

    // Super admin
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!existing) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          name: adminName,
          passwordHash: await hashPassword(adminPassword),
          role: "SUPER_ADMIN",
        },
      });
    }

    // Staff user for check-in demos
    const staffEmail = "staff@creatorverse.in";
    if (!(await prisma.user.findUnique({ where: { email: staffEmail } }))) {
      await prisma.user.create({
        data: {
          email: staffEmail,
          name: "Check-in Staff",
          passwordHash: await hashPassword("staff123"),
          role: "CHECKIN_STAFF",
        },
      });
    }

    // Sample SPOCs
    if ((await prisma.spoc.count()) === 0) {
      await prisma.spoc.createMany({
        data: [
          {
            name: "Ananya Shah",
            designation: "Registration & Help Desk",
            email: "help@creatorverse.in",
            phone: "+91-XXXXXXXXXX",
            responsibility: "Attendee queries and check-in",
            category: "general",
          },
          {
            name: "Kavya Patel",
            designation: "Creator & Speaker Management",
            email: "creators@creatorverse.in",
            phone: "+91-XXXXXXXXXX",
            responsibility: "Invitations, schedules, green-room",
            category: "speaker",
          },
        ],
      });
    }

    await prisma.setupState.upsert({
      where: { id: "setup" },
      create: { id: "setup", completed: true, completedAt: new Date() },
      update: { completed: true, completedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: "Setup completed. Super admin created.",
      adminEmail,
      note: "Change the default password immediately after first login.",
    });
  } catch (err: any) {
    console.error("Setup error:", err);
    return NextResponse.json(
      { error: "Setup failed", detail: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const setup = await prisma.setupState.findUnique({ where: { id: "setup" } });
    return NextResponse.json({
      completed: !!setup?.completed,
      completedAt: setup?.completedAt ?? null,
    });
  } catch {
    return NextResponse.json({ completed: false, error: "Database not reachable" });
  }
}
