"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import PublicNav from "@/components/PublicNav";

function ThanksContent() {
  const params = useSearchParams();
  const token = params.get("token") || "";

  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold tracking-tight text-emerald-700">
        Registration Successful
      </h1>
      <p className="mt-4 text-ink-600">
        Thank you for registering for CREATORVERSE. Your unique digital ticket is ready.
      </p>
      {token ? (
        <Link href={`/ticket/${token}`} className="btn-primary mt-8 inline-flex">
          View Digital Ticket &amp; QR
        </Link>
      ) : (
        <p className="mt-6 text-sm text-ink-500">
          Check your email or contact the help desk for ticket details.
        </p>
      )}
      <p className="mt-6 text-xs text-ink-400">
        If email delivery is not configured, use the ticket link above as your confirmation.
      </p>
      <Link href="/" className="mt-8 inline-block text-sm text-brand-600 hover:underline">
        ← Back to home
      </Link>
    </main>
  );
}

export default function ThanksPage() {
  return (
    <>
      <PublicNav />
      <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
        <ThanksContent />
      </Suspense>
    </>
  );
}
