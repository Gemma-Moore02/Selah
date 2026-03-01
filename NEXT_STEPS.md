# Selah — Next Steps Checklist
> Complete these in order before your first Claude Code session.
> Check each off as you go. Estimated total time: 1–2 hours.

---

## BEFORE YOU OPEN CLAUDE CODE

### Step 1 — Accounts & API Keys (30 min)
Get your accounts and keys ready. You'll need them before Phase 1 ends.

- [ ] **API.Bible** — Create account at https://scripture.api.bible
      → Create an app → copy your API key → keep it somewhere safe
      → Free tier: 5,000 req/day (plenty for development)

- [ ] **ESV API** — Register at https://api.esv.org/accounts/signup/
      → Request an API key → free for non-commercial use
      → Note: ESV text cannot be stored, only fetched live

- [ ] **Supabase** — Create account at https://supabase.com
      → Create a new project called "selah"
      → Copy your Project URL and anon key from Settings → API
      → You'll run the schema SQL later (it's in CLAUDE.md)

---

### Step 2 — Install Tools (15 min)
Make sure your development environment is ready.

- [ ] **Node.js 18+** — Check with `node --version`
      → Download from https://nodejs.org if needed

- [ ] **Claude Code** — Install with `npm install -g @anthropic/claude-code`
      → Run `claude` in terminal to verify it works
      → Sign in with your Anthropic account

- [ ] **VS Code** (recommended) — https://code.visualstudio.com
      → Install extension: "ES7+ React/Redux/React-Native snippets"
      → Install extension: "Tailwind CSS IntelliSense"
      → Install extension: "Prettier"

- [ ] **Git** — Check with `git --version`
      → Create a GitHub repo called "selah" (private)

---

### Step 3 — Get the Bible Data (20 min)
Download the free public domain Bible databases you'll use for development.

- [ ] Go to https://github.com/scrollmapper/bible_databases
- [ ] Download or clone the repository
- [ ] Find the WEB (World English Bible) translation in JSON format
- [ ] Also grab Matthew Henry commentary JSON while you're there
      → You'll put these in the project once it's scaffolded

---

### Step 4 — Prepare Your Project Folder (5 min)

- [ ] Create a folder on your computer called `selah`
- [ ] Inside it, create a `mocks/` folder
- [ ] Copy `bible-reader-mock-v3.html` into `mocks/`
- [ ] Copy `CLAUDE.md` into the root of the `selah` folder
- [ ] Copy `SPECS.md` into the root of the `selah` folder
- [ ] Create `.env.local` file with this content (fill in your real keys):
      ```
      VITE_API_BIBLE_KEY=your_key_here
      VITE_ESV_KEY=your_key_here
      VITE_SUPABASE_URL=your_supabase_url
      VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
      ```
- [ ] Create `.gitignore` with `.env.local` in it — never commit your keys

---

## YOUR FIRST CLAUDE CODE SESSION

### Step 5 — Open Claude Code in your project folder

```bash
cd selah
claude
```

### Step 6 — Paste this exact prompt to start:

```
Read CLAUDE.md and SPECS.md carefully before doing anything.

We are beginning Phase 1. Start with SPEC-001 (Project Scaffold).

Scaffold the Vite + React project with all dependencies listed in CLAUDE.md.
Configure Tailwind with the CSS variables from the design system section.
Load the three Google Fonts in index.css.
Set up React Router with a single route at / pointing to a Reader page placeholder.

Reference /mocks/bible-reader-mock-v3.html for all visual decisions.
Do not build anything beyond SPEC-001 in this session.
Ask me before making any architectural decisions not covered in CLAUDE.md.
```

### Step 7 — After scaffold is done, continue with:

```
SPEC-001 is complete. Now do SPEC-002.
Set up the local WEB translation JSON in /src/data/translations/web/.
I have the scrollmapper bible_databases files available — 
tell me exactly which files to copy and where to put them.
```

### Step 8 — Then the reader itself:

```
SPEC-002 is complete. Now do SPEC-003 and SPEC-004 together.
Build the BibleText component and the Topbar.
Reference /mocks/bible-reader-mock-v3.html closely for all styling.
Use the CSS variables, not Tailwind color classes.
Start with John chapter 4 as the default view.
```

---

## GENERAL CLAUDE CODE TIPS

**When starting any new session:**
> "Re-read CLAUDE.md and SPECS.md. We are currently in Phase [N].
>  Last session we completed [X]. Today we are working on [Y]."

**When Claude goes off-scope:**
> "Stop. That's Phase [N+1] scope. Stay in Phase [N] only.
>  Stub that with a TODO comment and continue."

**When something looks wrong visually:**
> "Open /mocks/bible-reader-mock-v3.html and compare your output to it.
>  Fix the discrepancy."

**When you're not sure what to work on:**
> "Read SPECS.md and tell me what the next incomplete spec is.
>  Then implement it."

---

## PHASE COMPLETION MILESTONES

### Phase 1 done when:
- [ ] `npm run dev` runs without errors
- [ ] John 4 renders with correct text and beautiful typography
- [ ] Sidebar collapses and expands smoothly
- [ ] Chapter navigation (prev/next) works
- [ ] Book + chapter dropdowns change the displayed passage

### Phase 2 done when:
- [ ] Can highlight verses in 5 colors
- [ ] Highlights persist on page refresh
- [ ] Can write and save a note on a verse
- [ ] Notes panel shows all chapter notes
- [ ] Note dot appears on verses that have notes

### Phase 3 done when:
- [ ] Commentary tab shows Matthew Henry for current chapter
- [ ] Can switch commentary source
- [ ] Insights tab shows cards for John 4
- [ ] Insight chips appear inline on relevant verses
- [ ] Insight detail modal opens with full content

### Phase 4 done when:
- [ ] MapModal shows a real Leaflet map
- [ ] Biblical places are marked on the map
- [ ] /maps page exists and is navigable

### Phase 5 done when:
- [ ] Can create an account and log in
- [ ] Notes and highlights sync to Supabase
- [ ] Data persists across devices when logged in

---

*You've got everything you need. Start at Step 1 and work down the list.*
*The first Claude Code session is the hardest — after that it gets fast.*
