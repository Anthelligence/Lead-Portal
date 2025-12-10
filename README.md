# COTIT Portal

Next.js 14 portal with Supabase-backed auth, demo mode defaults, and portal flows for assessments, ROI, resources, and profile sharing.

## Stack
- Next.js 14 (App Router) + React 18
- NextAuth 5 (Supabase adapter + email or demo credentials)
- Supabase (client + service role)
- Tailwind CSS

## Features
- Portal areas for assessments, ROI calculator, resources/ebooks, dashboard, and profile settings.
- Public profile/token flows (`/profile/[slug]`, demo token handling, vCard API).
- Demo mode enabled by default to load without Supabase; switch off for real data.
- Email magic-link auth when `EMAIL_SERVER` and `EMAIL_FROM` are set; falls back to demo credentials provider otherwise.

## Prerequisites
- Node.js 18+ and npm
- Supabase project (if running with real data)

## Setup
1) Clone and install:
```
git clone git@github.com:Anthelligence/Lead-Portal.git
cd Lead-Portal
npm install
```
2) Create `.env.local` (values shown as examples):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_SECRET=long-random-string
NEXTAUTH_URL=http://localhost:3000
DEMO_MODE=true
EMAIL_SERVER=smtp://user:pass@mailhost:587  # optional
EMAIL_FROM="COTIT Portal <no-reply@yourdomain.com>"  # optional
```
- `DEMO_MODE` defaults to `true`; set to `false` to require Supabase and real auth.
- If `EMAIL_SERVER`/`EMAIL_FROM` are absent, the app still runs using the demo credentials provider.

3) (Optional) Apply Supabase schema to your project:
```
psql "$SUPABASE_DB_URL" -f supabase/schema.sql
```
or paste `supabase/schema.sql` into the Supabase SQL editor.

## Run
- Dev server: `npm run dev` (http://localhost:3000)
- Lint: `npm run lint`
- Production build: `npm run build` then `npm start`

## Project structure
- `app/` – App Router routes for public pages, portal, API routes
- `components/` – UI, portal, forms, and profile components
- `lib/` – Supabase clients, auth config, demo data
- `supabase/schema.sql` – Database schema

## Deployment notes
- Set all required env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXTAUTH_SECRET`).
- Disable demo mode in production (`DEMO_MODE=false`) and ensure email settings are configured if you need magic-link sign-in.

