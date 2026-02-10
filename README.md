# Scope Labs Theatre — Showtimes Admin

A theater showtimes admin web app that ingests partner CSV drops, previews and reconciles changes (add/update/archive), and displays a sortable/filterable showtimes table. Built for the Scope Labs Full Stack Engineering Challenge.

## Features

- **CSV ingestion** – Upload a partner's CSV and reconcile against the current schedule
- **Preview changes** – Groups actions before applying: Add, Update (field-level diffs), Archive
- **Showtimes table** – Sort by column, filter by movie and format
- **Clear schedule** – Archive all showtimes with confirmation
- **Optimistic updates** – Clear schedule updates the UI immediately before the API completes
- **Loading feedback** – Table skeleton on initial load; spinners for CSV upload, Apply, and Clear actions
- **Persistence** – Supabase for storage

## Tech Stack

- React 19, TypeScript, Vite
- TanStack Query, Supabase, Tailwind CSS, shadcn/ui
- Zod for environment validation

## Run instructions

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and add your Supabase credentials:

   ```bash
   cp .env.example .env.local
   ```

3. Run the Supabase migrations (showtimes table, csv-drops bucket, performance indexes):

   ```bash
   supabase db push
   ```

   Or run the SQL in `supabase/migrations/` manually in the Supabase SQL editor. Create the `csv-drops` storage bucket in Storage settings if needed.

4. Start the dev server:

   ```bash
   npm run dev
   ```

### Deploy to Vercel

- Connect the GitHub repo to Vercel
- Set environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Build command: `npm run build`
- Output directory: `dist`

## Decisions

- **Multi-theater display** – The table shows showtimes from all theaters. Clear schedule archives all active showtimes. The challenge used "Scope Labs Cinema" as the primary theater; the API can be parameterized for theater-scoped fetching and clearing.
- **Archive vs delete** – Showtimes are soft-deleted via `archived_at`. Archives are recoverable and preserve history.
- **Normalization** – Titles are matched case-insensitively with trimmed whitespace, collapsed spaces, and punctuation (hyphens, colons) treated as spaces. "Part Two" and "Part 2" are normalized for matching. Auditorium matching is case-insensitive.
- **Duplicate rows** – Incoming CSV rows are deduped by (theater, normalized title, start_time) before reconciliation.

## Project Structure

```
src/
├── api/           # Supabase operations and query keys
├── components/    # CSV upload, Preview changes, Showtimes table, UI (button, card, skeleton, table)
├── hooks/         # useShowtimes, useApplyChanges, useClearSchedule
├── lib/           # showtime-utils, reconcile, supabase, env
├── types/         # Showtime and Supabase types
└── App.tsx
```

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start dev server                     |
| `npm run build`   | Production build                     |
| `npm run preview` | Preview production build locally     |
| `npm run lint`    | Run ESLint                           |
| `npm run type-check` | TypeScript type checking          |
# scope_showtime
