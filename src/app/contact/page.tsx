import PublicNav from "@/components/PublicNav";
import { prisma } from "@/lib/prisma";

export default async function ContactPage() {
  let settings = null;
  try {
    settings = await prisma.eventSettings.findFirst();
  } catch {}
  return (
    <>
      <PublicNav eventName={settings?.eventName} registrationOpen={settings?.registrationOpen ?? true} />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight">Contact & Help Desk</h1>
        <ul className="mt-6 space-y-2 text-ink-700">
          <li>
            Email:{" "}
            <a className="text-brand-600" href={`mailto:${settings?.organizerEmail || "hello@creatorverse.in"}`}>
              {settings?.organizerEmail || "hello@creatorverse.in"}
            </a>
          </li>
          <li>Phone: {settings?.organizerPhone || "+91-XXXXXXXXXX"}</li>
          <li>Organizer: {settings?.organizerName || "CREATORVERSE Team"}</li>
        </ul>
        <p className="mt-6 text-sm text-ink-500">
          Registration & Help Desk lead (sample): Ananya Shah. Update details in admin settings.
        </p>
      </main>
    </>
  );
}
