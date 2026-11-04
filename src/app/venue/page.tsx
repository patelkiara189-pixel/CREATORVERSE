import PublicNav from "@/components/PublicNav";
import { prisma } from "@/lib/prisma";

export default async function VenuePage() {
  let settings = null;
  try {
    settings = await prisma.eventSettings.findFirst();
  } catch {}
  return (
    <>
      <PublicNav eventName={settings?.eventName} registrationOpen={settings?.registrationOpen ?? true} />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight">Venue & Travel</h1>
        <p className="mt-4">
          <strong>Venue:</strong> {settings?.venueName || "To be announced"}
        </p>
        <p>
          <strong>Address:</strong> {settings?.venueAddress || "India"}
        </p>
        <p>
          <strong>Dates:</strong> {settings?.startDate || "TBA"} – {settings?.endDate || "TBA"}
        </p>
        <h2 className="mt-8 text-xl font-bold">Travel policy</h2>
        <p className="mt-2 text-ink-600">
          Complimentary airport transfers are provided <strong>only for approved invited creators,
          speakers, performers or VIP guests</strong>, subject to the approved budget and itinerary.
          Ordinary ticket holders should arrange their own travel and accommodation.
        </p>
      </main>
    </>
  );
}
