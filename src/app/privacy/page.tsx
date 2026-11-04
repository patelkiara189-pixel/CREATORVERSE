import PublicNav from "@/components/PublicNav";
import { prisma } from "@/lib/prisma";

export default async function PrivacyPage() {
  let settings = null;
  try {
    settings = await prisma.eventSettings.findFirst();
  } catch {}
  return (
    <>
      <PublicNav eventName={settings?.eventName} registrationOpen={settings?.registrationOpen ?? true} />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight">Privacy Notice</h1>
        <p className="mt-4 text-ink-600">
          {settings?.privacyNotice ||
            "We collect only the information necessary for event registration and communication. Your data will not be sold."}
        </p>
        <p className="mt-4 text-ink-600">
          We store registration data (name, email, phone, ticket category) solely to manage attendance,
          issue tickets and communicate event updates. QR codes contain only a verification token, not
          your personal details.
        </p>
      </main>
    </>
  );
}
