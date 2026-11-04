import Link from "next/link";
import PublicNav from "@/components/PublicNav";
import { prisma } from "@/lib/prisma";

async function getData() {
  try {
    const settings = await prisma.eventSettings.findFirst();
    return settings;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const settings = await getData();
  const name = settings?.eventName || "CREATORVERSE";
  const tagline = settings?.tagline || "Create. Connect. Collaborate.";
  const regOpen = settings?.registrationOpen ?? true;
  const prices = (settings?.ticketPrices as any) || {
    early_bird: { name: "Early Bird", price: 499, provisional: true },
    standard: { name: "Standard", price: 799, provisional: true },
    vip: { name: "VIP Creator Pass", price: 1499, provisional: true },
  };

  return (
    <>
      <PublicNav eventName={name} registrationOpen={regOpen} />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-brand-50 to-white">
          <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-600">
              Proposed · Two-day Creator Convention · India
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-ink-900 md:text-6xl">
              {name}
            </h1>
            <p className="mt-3 text-xl font-semibold text-brand-600 md:text-2xl">{tagline}</p>
            <p className="mt-5 max-w-xl text-lg text-ink-600">
              A focused gathering for content creators, aspiring creators, students, brands and
              digital entrepreneurs. Expected attendance ~200–300.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {regOpen ? (
                <Link href="/register" className="btn-primary">
                  Register Now
                </Link>
              ) : (
                <span className="btn bg-ink-200 text-ink-500">Registration Closed</span>
              )}
              <Link href="/agenda" className="btn-secondary">
                View Agenda
              </Link>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">Why CREATORVERSE?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Create",
                body: "Hands-on workshops including the Reel Factory and Creator Challenge to level up your craft.",
              },
              {
                title: "Connect",
                body: "Meet fellow creators, proposed industry guests and brand partners in focused networking sessions.",
              },
              {
                title: "Collaborate",
                body: "Speed networking with brands and opportunities to explore partnerships and growth.",
              },
            ].map((c) => (
              <div key={c.title} className="card">
                <h3 className="text-lg font-bold text-brand-700">{c.title}</h3>
                <p className="mt-2 text-ink-600">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tickets */}
        <section className="border-y border-ink-100 bg-ink-50 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight">Ticket Categories</h2>
              <span className="badge-provisional">Prices provisional</span>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {Object.entries(prices).map(([key, p]: [string, any]) => (
                <div key={key} className="card text-center">
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="mt-2 text-3xl font-extrabold text-brand-600">₹{p.price}</p>
                  <p className="mt-2 text-sm text-ink-500">
                    Registration only — no payment collected on this site
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-ink-500">
              Dates, venue and final prices will be confirmed by the organizers.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold">Ready to join?</h2>
          <p className="mt-2 text-ink-600">
            Secure your spot. Each registration receives a unique digital ticket with QR code.
          </p>
          {regOpen && (
            <Link href="/register" className="btn-primary mt-6">
              Register
            </Link>
          )}
        </section>
      </main>
      <footer className="border-t border-ink-100 py-10 text-center text-sm text-ink-500">
        <p className="font-semibold text-ink-700">
          {name} — {tagline}
        </p>
        <p className="mt-1">Proposed two-day Indian creator convention · ~200–300 participants</p>
        <p className="mt-3">
          <Link href="/privacy" className="hover:text-ink-800">
            Privacy
          </Link>
          {" · "}
          <Link href="/contact" className="hover:text-ink-800">
            Contact
          </Link>
          {" · "}
          <Link href="/admin/login" className="hover:text-ink-800">
            Admin
          </Link>
        </p>
        <p className="mt-2 text-xs">Demo site. Ticket prices, dates, venue and guest list are provisional.</p>
      </footer>
    </>
  );
}
