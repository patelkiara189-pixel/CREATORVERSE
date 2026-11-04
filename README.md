# CREATORVERSE Event Management Platform

A working, Vercel-deployable event website and admin system for **CREATORVERSE** — *Create. Connect. Collaborate.*

Built for college students who need to deploy without using a terminal.

---

## What works (tested core)

| Feature | Status |
|---------|--------|
| Public multi-page site (Home, About, Agenda, Speakers, Venue, Contact, Privacy) | ✅ |
| Event settings editable from admin (name, dates, venue, registration open/closed) | ✅ |
| Registration form → unique Registration ID + Ticket # + verification token | ✅ |
| Digital ticket page with QR code (token only, no personal data) | ✅ |
| Confirmation email via Resend (when API key is set) | ✅ |
| Admin login (session JWT) | ✅ |
| Dashboard with **live** DB counts | ✅ |
| Registration list, search, status update (ACTIVE / CHECKED_IN / CANCELLED) | ✅ |
| QR / token check-in with duplicate prevention | ✅ |
| CSV export | ✅ |
| Proposed speakers (clearly marked, not confirmed) | ✅ |
| One-time protected `/api/setup` for DB seed + super admin | ✅ |
| Role-based access (SUPER_ADMIN, EVENT_MANAGER, REGISTRATION_STAFF, CHECKIN_STAFF) | ✅ |

### Explicitly not included in this core release

- Drag-and-drop form builder
- Travel / driver dispatch module
- Catering / dietary module
- Visual email campaign composer & scheduled reminders
- Image uploads
- Full multi-event support
- Payment gateway

These can be added later. Do not treat them as finished.

---

## Student deployment (no terminal required)

### Step 1 – Get a Neon database (free)

1. Go to [https://console.neon.tech](https://console.neon.tech) and sign up / log in.
2. Create a new project.
3. Copy the **connection string** (starts with `postgresql://...`). Keep it private.

### Step 2 – Create a GitHub repository

1. Go to [https://github.com/new](https://github.com/new).
2. Create a new **public or private** repository (e.g. `creatorverse-event`).
3. Do **not** initialize with a README.
4. On the next screen choose **uploading an existing file**.
5. Drag and drop **all files and folders** from this project (the unzipped contents) into the browser upload area.
6. Commit the files.

### Step 3 – Deploy on Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New Project** → Import your GitHub repository.
3. Leave Framework Preset as **Next.js**.
4. Before deploying, open **Environment Variables** and add:

| Name | Value | Notes |
|------|-------|-------|
| `DATABASE_URL` | your Neon connection string | Required |
| `AUTH_SECRET` | any long random string (32+ chars) | Required |
| `SETUP_SECRET` | any secret phrase you choose | Required for first-time setup |
| `RESEND_API_KEY` | your Resend key (optional) | Only if you want emails |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` or your verified domain | Optional |
| `NEXT_PUBLIC_APP_URL` | leave blank first, fill after deploy | Optional |

5. Click **Deploy**.

### Step 4 – Initialize the database (one-time)

After the first successful deploy:

1. Note your live site URL, e.g. `https://creatorverse-event.vercel.app`.
2. Use any API client (or the browser extension / Postman / curl from a friend’s computer) to call:

```
POST https://YOUR-SITE.vercel.app/api/setup
Header: x-setup-secret: <the SETUP_SECRET you set>
Body (JSON, optional):
{
  "adminEmail": "admin@yourcollege.edu",
  "adminPassword": "ChooseAStrongPassword123!",
  "adminName": "Event Admin"
}
```

3. You should receive `{ "success": true, ... }`.
4. Log in at `https://YOUR-SITE.vercel.app/admin/login` with the admin email/password you just set.

**Default seed accounts** (if you did not override):

- Super Admin: `admin@creatorverse.in` / `ChangeMeNow123!`
- Check-in Staff: `staff@creatorverse.in` / `staff123`

**Change these passwords immediately.**

### Step 5 – Set public URL (for email links)

In Vercel → Settings → Environment Variables, set:

`NEXT_PUBLIC_APP_URL` = `https://your-actual-domain.vercel.app`

Redeploy if needed.

---

## Local development (optional, for developers only)

```bash
cp .env.example .env
# fill DATABASE_URL, AUTH_SECRET, SETUP_SECRET
npm install
npx prisma db push
npm run dev
```

Then call `POST /api/setup` with the setup secret.

---

## Security notes

- Never commit `.env` or real API keys.
- The Resend key provided in chat must be entered only in Vercel environment variables.
- QR codes contain only an unpredictable verification token.
- All admin APIs check the session role on the server.
- Registration is idempotent against the same email while status is not CANCELLED.

---

## Support checklist before your event

- [ ] Neon database created and `DATABASE_URL` set
- [ ] `/api/setup` called successfully once
- [ ] Super admin password changed
- [ ] Event name, dates, venue updated in Admin → Settings
- [ ] Registration tested end-to-end (two different people)
- [ ] Check-in tested (valid, already checked-in, cancelled)
- [ ] CSV export downloaded
- [ ] Speakers still show as “PROPOSED” until you confirm them

---

Built for CREATORVERSE. Prefer a smaller, reliable, fully tested core over unfinished features.
