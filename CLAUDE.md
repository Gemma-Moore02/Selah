# Selah — CLAUDE.md
> This file is read automatically by Claude Code at the start of every session.
> Do not delete or rename it. Keep it updated as the project evolves.

---

## Project Overview

**Selah** is a React-based Bible study web application. It is beautiful, airy, and built for
serious study — not casual reading. The aesthetic is warm parchment, timeless typography,
and intentional whitespace. Think a well-loved study Bible, not a tech product.

The app includes a Bible reader, margin notes, highlights, commentary, contextual insights
(archaeology, manuscripts, geography, history), and interactive maps.

> **Design reference:** `/mocks/bible-reader-mock-v3.html`
> Do not deviate from the visual design without explicit instruction. When building any
> UI component, open and read the mock first.

---

## Tech Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | React 18 + Vite | Fast dev server, clean builds |
| Styling | Tailwind CSS + CSS variables | Use CSS vars from mock, not Tailwind color classes |
| State | Zustand | Lightweight; covers UI state + user data |
| Server state | Tanstack Query (React Query) | All API calls go through this — cache aggressively |
| Routing | React Router v6 | File-based-style organization |
| Backend/Auth | Supabase | Auth, notes, highlights, bookmarks |
| Maps | Leaflet.js + React-Leaflet | OT geography; Phase 4 |
| Icons | Lucide React | Consistent, clean, tree-shakeable |

**Never suggest replacing any of these without asking first.**

---

## Design System

These tokens come directly from the mock. Use them everywhere via CSS variables.
Do not hardcode hex values in components — always reference variables.

```css
--parchment:      #f5f0e8;   /* page background */
--parchment-dark: #ede6d6;   /* hover states, subtle fills */
--ink:            #2c2416;   /* primary text */
--ink-light:      #5c4f3a;   /* secondary text */
--ink-faint:      #9c8e78;   /* labels, placeholders */
--accent:         #8b6f47;   /* primary accent, CTAs */
--accent-light:   #c4a882;   /* soft accent, borders */
--rule:           #d9cfc0;   /* dividers, borders */
```

**Typography:**
- Display / headings: `Cormorant Garamond` (Google Fonts)
- Body / verse text: `Crimson Pro` (Google Fonts)
- UI labels / controls: `Jost` (Google Fonts)

**Highlight colors:**
```css
--hl-yellow: rgba(255, 220, 100, 0.45);
--hl-green:  rgba(140, 195, 150, 0.45);
--hl-blue:   rgba(130, 175, 210, 0.45);
--hl-pink:   rgba(220, 160, 160, 0.45);
--hl-purple: rgba(175, 155, 210, 0.45);
```

---

## Folder Structure

```
selah/
├── CLAUDE.md                  ← you are here
├── SPECS.md                   ← feature specs, acceptance criteria
├── mocks/
│   └── bible-reader-mock-v3.html
├── public/
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css              ← CSS variables, global resets, font imports
│   │
│   ├── components/
│   │   ├── reader/
│   │   │   ├── BibleText.jsx         ← renders verses for a chapter
│   │   │   ├── VerseBlock.jsx        ← single verse + note dot + chips
│   │   │   ├── ChapterHeader.jsx
│   │   │   ├── PassageSection.jsx    ← section heading (e.g. "The Samaritan Woman")
│   │   │   ├── ChapterNav.jsx        ← prev/next chapter buttons
│   │   │   └── InsightChip.jsx       ← inline map/arch/scroll badge on verse
│   │   │
│   │   ├── sidebar/
│   │   │   ├── Sidebar.jsx           ← collapsible left sidebar wrapper
│   │   │   ├── BookList.jsx
│   │   │   ├── ChapterGrid.jsx
│   │   │   └── ReadingPlan.jsx
│   │   │
│   │   ├── topbar/
│   │   │   ├── Topbar.jsx
│   │   │   ├── NavSelects.jsx        ← book/chapter dropdowns
│   │   │   └── TranslationBadge.jsx
│   │   │
│   │   ├── panel/
│   │   │   ├── StudyPanel.jsx        ← tabbed right panel wrapper
│   │   │   ├── PanelTabs.jsx
│   │   │   ├── NotesPane.jsx
│   │   │   ├── NoteCompose.jsx
│   │   │   ├── NoteCard.jsx
│   │   │   ├── CommentaryPane.jsx
│   │   │   ├── CommentarySource.jsx  ← source switcher (Henry, Calvin, etc.)
│   │   │   ├── InsightsPane.jsx
│   │   │   └── InsightCard.jsx
│   │   │
│   │   ├── modals/
│   │   │   ├── TranslationModal.jsx
│   │   │   ├── MapModal.jsx
│   │   │   └── InsightDetailModal.jsx
│   │   │
│   │   └── ui/                       ← reusable primitives
│   │       ├── IconButton.jsx
│   │       ├── Badge.jsx
│   │       ├── Modal.jsx             ← generic backdrop + container
│   │       └── Select.jsx            ← styled native select wrapper
│   │
│   ├── hooks/
│   │   ├── useBibleText.js           ← Tanstack Query wrapper for chapter fetch
│   │   ├── useNotes.js               ← Supabase notes CRUD
│   │   ├── useHighlights.js          ← Supabase highlights CRUD
│   │   ├── useInsights.js            ← loads insight JSON for current book
│   │   └── useCommentary.js          ← loads commentary JSON for passage
│   │
│   ├── services/
│   │   ├── apiBible.js               ← API.Bible fetch functions
│   │   ├── esvApi.js                 ← ESV API (ESV translation only)
│   │   └── supabase.js               ← Supabase client init
│   │
│   ├── store/
│   │   ├── uiStore.js                ← sidebar open, panel tab, active verse
│   │   └── studyStore.js             ← selected highlight color, tool mode
│   │
│   ├── data/
│   │   ├── translations/
│   │   │   └── web/                  ← WEB translation JSON (local fallback)
│   │   │       ├── john.json
│   │   │       └── ... (add books as needed)
│   │   ├── commentaries/
│   │   │   ├── matthew-henry/
│   │   │   │   └── john.json
│   │   │   └── john-gill/
│   │   │       └── john.json
│   │   └── insights/
│   │       ├── john.json             ← hand-curated insight cards per verse
│   │       └── genesis.json
│   │
│   └── pages/
│       ├── Reader.jsx                ← main reading page (/)
│       ├── Commentary.jsx            ← dedicated full commentary page (/commentary)
│       └── Maps.jsx                  ← dedicated OT maps page (/maps)
│
├── supabase/
│   └── schema.sql
├── .env.example
├── .env.local                        ← never commit this
├── index.html
├── vite.config.js
└── tailwind.config.js
```

---

## Data Sources

### Bible Text
- **Primary:** [API.Bible](https://scripture.api.bible) — large translation selection
  - Key: `VITE_API_BIBLE_KEY` in `.env.local`
  - Free tier: 5,000 requests/day. **Cache every response.** A chapter fetch should
    never be made more than once per session for the same reference.
  - Bible IDs to support: WEB, KJV, ASV, YLT (all open license)
  - Licensed (require separate keys): ESV, NIV, NASB
- **ESV:** [ESV API](https://api.esv.org) — direct from Crossway
  - Key: `VITE_ESV_KEY`
  - Non-commercial free tier available
  - **Never store ESV text in Supabase** — copyright restriction. Always fetch live.
- **Local fallback:** WEB translation as JSON in `/src/data/translations/web/`
  - Use this during development so you don't burn API quota
  - Source: [scrollmapper/bible_databases](https://github.com/scrollmapper/bible_databases)

### Commentaries (Public Domain)
All sourced from [scrollmapper/bible_databases](https://github.com/scrollmapper/bible_databases):
- Matthew Henry's Commentary (1706) — most complete, most readable
- John Gill's Exposition (1748) — very detailed, Reformed
- Geneva Bible Notes (1560) — brief, covenantal
- John Calvin's Commentaries — strong on Gospels and Epistles

Store as JSON in `/src/data/commentaries/`. Each file is one book.
Schema per entry:
```json
{
  "book": "John",
  "chapter": 4,
  "verse": 10,
  "text": "Commentary body here..."
}
```

### Geography / Maps
- **[OpenBible.info](https://openBible.info/geo/)** — geocoded Bible places CSV
  - Download once at build time, convert to JSON, store in `/src/data/`
  - Has lat/lng + description for ~3,000 biblical places
- **Leaflet.js** — map rendering (Phase 4)
- **Map tiles:** OpenStreetMap or a historical tile set

### Insights (Archaeology, Manuscripts, History)
- Hand-curated JSON files in `/src/data/insights/`
- Start with `john.json` — build out as you study
- Future sources: ISBE (public domain, parsed JSON available on GitHub),
  OpenBible.info topic notes
- Schema per insight card:
```json
{
  "id": "john-4-5-arch",
  "book": "John",
  "chapter": 4,
  "verse": 5,
  "type": "archaeology",
  "label": "Archaeology",
  "title": "Jacob's Well — Confirmed Site",
  "preview": "A well at Tell Balata...",
  "body": "Full markdown content here..."
}
```
Types: `"archaeology"` | `"manuscript"` | `"geography"` | `"history"`

---

## Supabase Schema

```sql
-- Run this in your Supabase SQL editor

create table notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  book text not null,
  chapter integer not null,
  verse integer not null,
  text text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  book text not null,
  chapter integer not null,
  verse_start integer not null,
  verse_end integer not null,
  color text not null, -- 'yellow' | 'green' | 'blue' | 'pink' | 'purple'
  created_at timestamptz default now()
);

create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  book text not null,
  chapter integer not null,
  verse integer,
  label text,
  created_at timestamptz default now()
);

-- Enable Row Level Security on all tables
alter table notes enable row level security;
alter table highlights enable row level security;
alter table bookmarks enable row level security;

-- RLS policies: users can only see their own data
create policy "notes: own data" on notes for all using (auth.uid() = user_id);
create policy "highlights: own data" on highlights for all using (auth.uid() = user_id);
create policy "bookmarks: own data" on bookmarks for all using (auth.uid() = user_id);
```

---

## Environment Variables

```bash
# .env.example — copy to .env.local and fill in values

VITE_API_BIBLE_KEY=your_key_here
VITE_ESV_KEY=your_key_here
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Phased Roadmap

### ✅ Phase 0 — Design (COMPLETE)
- Visual mock created: `/mocks/bible-reader-mock-v3.html`
- Design system documented above
- Architecture decided

### 🔨 Phase 1 — Reader (START HERE)
**Goal:** A working Bible reader. Nothing else. Get the text on screen beautifully.

Scope:
- Vite + React scaffold with Tailwind + CSS variables
- Google Fonts loaded in `index.css`
- React Router with single route `/`
- Local WEB JSON loaded for development (no API key needed yet)
- `BibleText`, `VerseBlock`, `ChapterHeader`, `ChapterNav` components
- `Topbar` with book/chapter selects (functional)
- `Sidebar` with book list + chapter grid (collapsible)
- No notes, no highlights, no panel — Phase 2

**Definition of done:** App runs, John 4 renders, sidebar collapses, chapter navigation works.

### 📝 Phase 2 — Study Tools
- Zustand stores: `uiStore`, `studyStore`
- Highlight tool (5 colors, apply to verse, stored in Zustand)
- `StudyPanel` with Notes tab only
- `NoteCompose` + `NoteCard` components
- Notes stored in Zustand locally (no Supabase yet — Phase 5)
- Inline note dot indicator on verses

### 📖 Phase 3 — Commentary + Insights
- Commentary tab: load Matthew Henry JSON for current chapter
- Commentary source switcher
- Insights tab: load from `/src/data/insights/john.json`
- `InsightCard` components with type badges
- `InsightChip` inline on verses
- `InsightDetailModal`

### 🗺 Phase 4 — Maps
- Install Leaflet + React-Leaflet
- Load OpenBible.info geocoded data
- `MapModal` with interactive Leaflet map
- Dedicated `/maps` page
- Geography insight cards link to map

### 🔐 Phase 5 — Auth + Sync
- Supabase client setup
- Email auth (Supabase Auth)
- Notes + highlights sync to Supabase
- `useNotes` + `useHighlights` hooks with optimistic updates
- User avatar + session state in Topbar

### 📚 Phase 6 — Full Commentary Page + Polish
- Dedicated `/commentary` page
- API.Bible integration (replace local JSON)
- Cross-references
- Reading plans
- Multiple translation support in reader
- Performance audit + mobile polish

---

## Development Rules

1. **Read this file at the start of every session.** If context seems lost, re-read CLAUDE.md and SPECS.md before writing any code.

2. **One phase at a time.** Do not build Phase 3 features while working on Phase 1. If something from a future phase is needed, note it with a `// TODO: Phase N` comment.

3. **Ask before architectural decisions** not covered in this file.

4. **Never hardcode API keys.** All external keys go in `.env.local` only.

5. **Cache API calls.** Every Bible text fetch goes through Tanstack Query. `staleTime` for chapter data should be `Infinity` within a session.

6. **Mobile first.** Every component should work at 375px width. Sidebar collapses, panel hides, reader fills screen.

7. **Keep components small.** If a component exceeds ~150 lines, split it. Prefer composition.

8. **CSS variables, not Tailwind colors.** Use `bg-[var(--parchment)]` pattern or inline styles for design token values. Do not use `bg-amber-50` or similar — the exact parchment values matter.

9. **ESV text is never stored.** If translation is ESV, always fetch live from ESV API. Never insert ESV text into Supabase.

10. **Respect the mock.** When in doubt about any UI decision, open `/mocks/bible-reader-mock-v3.html` and match it.

---

## Key Reference Links

- API.Bible docs: https://scripture.api.bible/livedocs
- ESV API docs: https://api.esv.org/docs/
- Supabase docs: https://supabase.com/docs
- OpenBible geocoded data: https://openBible.info/geo/
- Bible databases (commentaries + translations JSON): https://github.com/scrollmapper/bible_databases
- Leaflet docs: https://leafletjs.com/reference.html
- Tanstack Query docs: https://tanstack.com/query/latest

---

*Last updated: Phase 0 complete. Beginning Phase 1.*
