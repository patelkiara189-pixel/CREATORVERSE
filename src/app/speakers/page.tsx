import PublicNav from "@/components/PublicNav";
import { prisma } from "@/lib/prisma";

export default async function SpeakersPage() {
  let settings = null;
  let speakers: any[] = [];
  try {
    settings = await prisma.eventSettings.findFirst();
    speakers = await prisma.speaker.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {}

  return (
    <>
      <PublicNav eventName={settings?.eventName} registrationOpen={settings?.registrationOpen ?? true} />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight">Proposed Creators & Speakers</h1>
        <p className="mt-2 text-ink-600">
          The following names are <strong>proposed invitees only</strong>. None are confirmed unless
          explicitly updated by organizers.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {speakers.map((s) => (
            <div key={s.id} className="card text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-teal-400 text-2xl font-bold text-white">
                {s.name[0]}
              </div>
              <h3 className="mt-3 font-bold">{s.name}</h3>
              <span className="badge-proposed mt-1">{s.status}</span>
              {s.bio && <p className="mt-2 text-sm text-ink-500">{s.bio}</p>}
            </div>
          ))}
          {speakers.length === 0 && (
            <p className="text-ink-500">Speakers will appear after setup.</p>
          )}
        </div>
      </main>
    </>
  );
}
