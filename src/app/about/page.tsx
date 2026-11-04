import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import { prisma } from "@/lib/prisma";

export default async function AboutPage() {
  let settings = null;
  try {
    settings = await prisma.eventSettings.findFirst();
  } catch {}
  return (
    <>
      <PublicNav eventName={settings?.eventName} registrationOpen={settings?.registrationOpen ?? true} />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight">About CREATORVERSE</h1>
        <p className="mt-4 text-lg text-ink-600">
          {settings?.description ||
            "A two-day creators and influencers convention focused on creator skills, personal branding, creator–brand opportunities, collaboration, digital entrepreneurship, and community."}
        </p>
        <p className="mt-4 text-ink-600">
          Expected attendance is approximately 200–300 participants. The city, venue, dates, final
          capacity, ticket prices, and guest confirmations have not yet been finalized.
        </p>
        <p className="mt-6 text-sm text-ink-500">
          <strong>Date:</strong> {settings?.startDate || "To be announced"} –{" "}
          {settings?.endDate || "To be announced"}
          <br />
          <strong>Venue:</strong> {settings?.venueName || "To be announced"}
        </p>
        <Link href="/register" className="btn-primary mt-8 inline-flex">
          Register
        </Link>
      </main>
    </>
  );
}
