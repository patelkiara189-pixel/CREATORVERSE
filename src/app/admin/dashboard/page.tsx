"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Stats = {
  total: number;
  active: number;
  checkedIn: number;
  cancelled: number;
  byCategory: Record<string, number>;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setStats(data);
      })
      .catch(() => setError("Failed to load stats"));
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="font-extrabold tracking-tight">CREATORVERSE Admin</h1>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/registrations" className="btn-secondary text-sm">
              Registrations
            </Link>
            <Link href="/admin/checkin" className="btn-secondary text-sm">
              Check-in
            </Link>
            <Link href="/admin/settings" className="btn-secondary text-sm">
              Settings
            </Link>
            <a href="/api/admin/export" className="btn-secondary text-sm">
              CSV Export
            </a>
            <button onClick={logout} className="btn-ghost text-sm">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="mt-1 text-sm text-ink-500">Live counts from the database</p>

        {error && <p className="mt-4 text-red-600">{error}</p>}

        {stats && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card text-center">
              <p className="text-sm text-ink-500">Total</p>
              <p className="mt-1 text-3xl font-extrabold text-brand-600">{stats.total}</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-ink-500">Active</p>
              <p className="mt-1 text-3xl font-extrabold text-emerald-600">{stats.active}</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-ink-500">Checked-in</p>
              <p className="mt-1 text-3xl font-extrabold text-teal-600">{stats.checkedIn}</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-ink-500">Cancelled</p>
              <p className="mt-1 text-3xl font-extrabold text-red-500">{stats.cancelled}</p>
            </div>
          </div>
        )}

        {!stats && !error && <p className="mt-8 text-ink-500">Loading...</p>}
      </main>
    </div>
  );
}
