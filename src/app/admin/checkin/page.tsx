"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminCheckinPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [result, setResult] = useState<{ success: boolean; message: string; registration?: any } | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.trim() }),
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setResult(data);
      if (data.success) setToken("");
    } catch {
      setResult({ success: false, message: "Network error" });
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <Link href="/admin/dashboard" className="font-semibold text-brand-600">
            ← Dashboard
          </Link>
          <h1 className="font-bold">Check-in</h1>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-10">
        <p className="text-sm text-ink-600">
          Scan or paste the verification token, registration ID, or ticket number.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
            className="input"
            placeholder="Token / Reg ID / Ticket #"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
            autoFocus
          />
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Checking..." : "Check In"}
          </button>
        </form>
        {result && (
          <div
            className={`mt-6 rounded-xl border p-4 ${
              result.success
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            <p className="font-semibold">{result.success ? "OK" : "Failed"}</p>
            <p className="mt-1 text-sm">{result.message}</p>
            {result.registration && (
              <p className="mt-2 text-sm">
                {result.registration.fullName} · {result.registration.registrationId}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
