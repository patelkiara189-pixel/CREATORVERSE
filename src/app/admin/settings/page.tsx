"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState<any>({});
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => setForm(data || {}));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    if (!res.ok) {
      setError("Save failed");
      return;
    }
    setSaved(true);
  }

  function set(key: string, value: any) {
    setForm((f: any) => ({ ...f, [key]: value }));
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <Link href="/admin/dashboard" className="font-semibold text-brand-600">
            ← Dashboard
          </Link>
          <h1 className="font-bold">Event Settings</h1>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-8">
        <form onSubmit={onSubmit} className="space-y-4">
          {[
            ["eventName", "Event Name"],
            ["tagline", "Tagline"],
            ["startDate", "Start Date"],
            ["endDate", "End Date"],
            ["venueName", "Venue Name"],
            ["venueAddress", "Venue Address"],
            ["organizerName", "Organizer Name"],
            ["organizerEmail", "Organizer Email"],
            ["organizerPhone", "Organizer Phone"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input
                className="input"
                value={form[key] || ""}
                onChange={(e) => set(key, e.target.value)}
              />
            </div>
          ))}
          <div>
            <label className="label">Registration Open</label>
            <select
              className="input"
              value={form.registrationOpen === false ? "false" : "true"}
              onChange={(e) => set("registrationOpen", e.target.value === "true")}
            >
              <option value="true">Open</option>
              <option value="false">Closed</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {saved && <p className="text-sm text-emerald-600">Saved.</p>}
          <button type="submit" className="btn-primary w-full">
            Save Settings
          </button>
        </form>
      </main>
    </div>
  );
}
