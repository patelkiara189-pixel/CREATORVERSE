"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";

type Ticket = {
  registrationId: string;
  ticketNumber: string;
  fullName: string;
  ticketCategory: string;
  status: string;
  qrDataUrl: string;
};

export default function TicketPage() {
  const params = useParams();
  const token = params.token as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/tickets/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setTicket(data);
      })
      .catch(() => setError("Failed to load ticket"));
  }, [token]);

  return (
    <>
      <PublicNav />
      <main className="mx-auto max-w-md px-4 py-12 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">Digital Ticket</h1>
        {error && <p className="mt-6 text-red-600">{error}</p>}
        {!ticket && !error && <p className="mt-6 text-ink-500">Loading...</p>}
        {ticket && (
          <div className="card mt-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
              CREATORVERSE
            </p>
            <h2 className="mt-2 text-xl font-bold">{ticket.fullName}</h2>
            <span
              className={`mt-2 inline-block badge-${ticket.status.toLowerCase()}`}
            >
              {ticket.status.replace("_", " ")}
            </span>
            <div className="mt-4 space-y-1 text-sm text-ink-600">
              <p>
                Registration ID: <strong className="text-ink-900">{ticket.registrationId}</strong>
              </p>
              <p>
                Ticket: <strong className="text-ink-900">{ticket.ticketNumber}</strong>
              </p>
              <p>Category: {ticket.ticketCategory.replace("_", " ")}</p>
            </div>
            {ticket.qrDataUrl && (
              <div className="mt-6 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ticket.qrDataUrl}
                  alt="Ticket QR code"
                  className="rounded-xl border border-ink-100 bg-white p-2"
                  width={220}
                  height={220}
                />
              </div>
            )}
            <p className="mt-4 text-xs text-ink-400">
              Present this QR at check-in. The code contains only a verification token.
            </p>
          </div>
        )}
        <Link href="/" className="mt-8 inline-block text-sm text-brand-600 hover:underline">
          ← Back to site
        </Link>
      </main>
    </>
  );
}
