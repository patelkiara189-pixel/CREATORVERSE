"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    ticketCategory: "",
    organization: "",
    city: "",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      router.push(`/thanks?token=${encodeURIComponent(data.verificationToken)}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <PublicNav />
      <main className="mx-auto max-w-lg px-4 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight">Register</h1>
        <p className="mt-2 text-ink-600">
          One registration per person. You will receive a unique digital ticket with QR code. No
          payment is collected on this site.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label className="label">Full Name *</label>
            <input
              className="input"
              required
              minLength={2}
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Email *</label>
            <input
              className="input"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Phone *</label>
            <input
              className="input"
              type="tel"
              required
              minLength={8}
              placeholder="+91..."
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Ticket Category *</label>
            <select
              className="input"
              required
              value={form.ticketCategory}
              onChange={(e) => setForm({ ...form, ticketCategory: e.target.value })}
            >
              <option value="">Select...</option>
              <option value="early_bird">Early Bird — ₹499 (provisional)</option>
              <option value="standard">Standard — ₹799 (provisional)</option>
              <option value="vip">VIP Creator Pass — ₹1,499 (provisional)</option>
            </select>
          </div>
          <div>
            <label className="label">Organization (optional)</label>
            <input
              className="input"
              value={form.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
            />
          </div>
          <div>
            <label className="label">City (optional)</label>
            <input
              className="input"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>

          <p className="text-xs text-ink-500">
            By registering you agree to the{" "}
            <Link href="/privacy" className="underline">
              privacy notice
            </Link>
            . Prices are provisional.
          </p>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Registration"}
          </button>
        </form>
      </main>
    </>
  );
}
