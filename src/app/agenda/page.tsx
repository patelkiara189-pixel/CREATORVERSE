import PublicNav from "@/components/PublicNav";
import { prisma } from "@/lib/prisma";

export default async function AgendaPage() {
  let settings = null;
  try {
    settings = await prisma.eventSettings.findFirst();
  } catch {}
  const agenda = (settings?.agenda as any[]) || [];

  return (
    <>
      <PublicNav eventName={settings?.eventName} registrationOpen={settings?.registrationOpen ?? true} />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight">Event Agenda</h1>
        <p className="mt-2 text-sm text-ink-500">Provisional schedule — subject to change.</p>
        {agenda.length === 0 && (
          <p className="mt-8 text-ink-500">Agenda will appear once configured in admin settings.</p>
        )}
        {agenda.map((day: any) => (
          <div key={day.day} className="mt-10">
            <h2 className="text-xl font-bold">Day {day.day}</h2>
            <ul className="mt-4 space-y-3">
              {(day.items || []).map((item: any, i: number) => (
                <li key={i} className="flex gap-4 border-b border-ink-100 pb-3">
                  <span className="w-32 shrink-0 text-sm font-semibold text-brand-600">
                    {item.time}
                  </span>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    {item.desc && <p className="text-sm text-ink-500">{item.desc}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>
    </>
  );
}
