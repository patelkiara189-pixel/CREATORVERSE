"use client";

import Link from "next/link";
import { useState } from "react";

export default function PublicNav({ eventName = "CREATORVERSE", registrationOpen = true }) {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/agenda", label: "Agenda" },
    { href: "/speakers", label: "Creators" },
    { href: "/venue", label: "Venue" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-ink-900">
          {eventName}
        </Link>
        <button
          className="rounded-lg p-2 text-ink-600 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          ☰
        </button>
        <nav
          className={`${
            open ? "flex" : "hidden"
          } absolute left-0 right-0 top-full flex-col gap-1 border-b border-ink-100 bg-white p-4 md:static md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:p-0`}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-600 hover:text-ink-900"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {registrationOpen ? (
            <Link href="/register" className="btn-primary text-sm" onClick={() => setOpen(false)}>
              Register
            </Link>
          ) : (
            <span className="badge-provisional">Registration Closed</span>
          )}
        </nav>
      </div>
    </header>
  );
}
