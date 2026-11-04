"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Reg = {
  id: string;
  registrationId: string;
  ticketNumber: string;
  fullName: string;
  email: string;
  phone: string;
  ticketCategory: string;
  status: string;
  createdAt: string;
};

export default function AdminRegistrationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Reg[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  function load() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    fetch(`/api/admin/registrations?${params}`)
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setItems(data.items || []);
      });
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(registrationId: string, newStatus: string) {
    await fetch("/api/admin/registrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationId, status: newStatus }),
    });
    load();
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/admin/dashboard" className="font-semibold text-brand-600">
            ← Dashboard
          </Link>
          <h1 className="font-bold">Registrations</h1>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4 flex flex-wrap gap-2">
          <input
            className="input max-w-xs"
            placeholder="Search name, email, ID..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select className="input max-w-[160px]" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="CHECKED_IN">Checked-in</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button className="btn-secondary" onClick={load}>
            Filter
          </button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-ink-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-100 bg-ink-50 text-xs uppercase text-ink-500">
              <tr>
                <th className="px-3 py-2">Reg ID</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Update</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="border-b border-ink-50">
                  <td className="px-3 py-2 font-mono text-xs">{r.registrationId}</td>
                  <td className="px-3 py-2">{r.fullName}</td>
                  <td className="px-3 py-2">{r.email}</td>
                  <td className="px-3 py-2">{r.ticketCategory}</td>
                  <td className="px-3 py-2">
                    <span className={`badge-${r.status.toLowerCase()}`}>{r.status}</span>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      className="rounded border border-ink-200 px-2 py-1 text-xs"
                      value={r.status}
                      onChange={(e) => updateStatus(r.registrationId, e.target.value)}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="CHECKED_IN">CHECKED_IN</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-ink-400">
                    No registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
