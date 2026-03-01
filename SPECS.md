# Selah — SPECS.md
> Feature specifications and acceptance criteria.
> Read alongside CLAUDE.md. CLAUDE.md = how we build. SPECS.md = what we build.

---

## Phase 1 — Reader

### SPEC-001: Project Scaffold
**Status:** DONE

**What:** Initialize the Vite + React project with all dependencies and configuration.

**Steps:**
1. `npm create vite@latest selah -- --template react`
2. Install: `tailwindcss`, `postcss`, `autoprefixer`
3. Install: `react-router-dom`, `zustand`, `@tanstack/react-query`
4. Install: `lucide-react`
5. Configure Tailwind (`tailwind.config.js` + `index.css`)
6. Add Google Fonts to `index.css` (Cormorant Garamond, Crimson Pro, Jost)
7. Add all CSS variables to `index.css` under `:root`
8. Set up React Router in `App.jsx` with single route `/` → `Reader` page
9. Create `.env.example` with all variable names (no values)
10. Create `/mocks/` folder and place mock HTML file there

**Acceptance criteria:**
- `npm run dev` starts without errors
- Blank parchment background (#f5f0e8) renders at `/`
- Fonts load correctly in browser

---

### SPEC-002: Local Bible Data
**Status:** DONE (using KJV as local dev fallback — WEB not in bible_databases repo)

**Note for SPEC-004:** KJV uses Roman numeral book names (I Samuel, II Kings, I Corinthians).
Files were generated as `isamuel.json`, `iikings.json`, `icorinthians.json` etc.
The book-name → filename lookup in `index.js` will need a normalization map for numbered
books when navigation across all 66 books is wired up.

**What:** Get WEB translation JSON files into the project for development use.

**Steps:**
1. Clone or download from https://github.com/scrollmapper/bible_databases
2. Extract the WEB translation in JSON format
3. Place individual book files in `/src/data/translations/web/`
   - File naming: `john.json`, `genesis.json`, `matthew.json`, etc.
4. Each file should follow this schema:
```json
{
  "book": "John",
  "chapters": [
    {
      "chapter": 1,
      "verses": [
        { "verse": 1, "text": "In the beginning was the Word..." },
        { "verse": 2, "text": "..." }
      ]
    }
  ]
}
```
5. Write a utility function `getChapter(book, chapter)` in `/src/data/translations/web/index.js`

**Acceptance criteria:**
- `getChapter('John', 4)` returns an array of verse objects
- No API call is made — data is local

---

### SPEC-003: BibleText Component
**Status:** DONE

**What:** The core reading component. Renders a chapter of scripture beautifully.

**Reference:** `/mocks/bible-reader-mock-v3.html` — `.reader-wrap`, `.verse-block`, `.v-text`, `.v-num`

**Components to build:**
- `ChapterHeader` — book name, chapter title (spelled out), subtitle
- `PassageSection` — section headings (e.g. "Jesus and the Samaritan Woman")
- `VerseBlock` — verse number + text + note dot (note dot is Phase 2, stub it)
- `BibleText` — composes all of the above for a full chapter
- `ChapterNav` — previous/next chapter buttons at bottom

**Props for BibleText:**
```jsx
<BibleText book="John" chapter={4} translation="WEB" />
```

**Acceptance criteria:**
- John 4 renders with correct verse text
- Fonts match mock (Crimson Pro for verse text, Jost for verse numbers)
- Section headings appear in correct accent color
- Chapter header has ornamental divider (✦)
- Prev/next chapter navigation changes the chapter displayed
- Line height and spacing matches mock closely

---

### SPEC-004: Topbar + Navigation Selects
**Status:** DONE

**What:** The sticky top bar with book, chapter, and translation selectors.

**Reference:** `/mocks/bible-reader-mock-v3.html` — `.topbar`, `.nav-sel`, `.trans-badge`

**Components:**
- `Topbar` — sticky, blur backdrop, contains all controls
- `NavSelects` — book dropdown + chapter dropdown, wired to app state
- `TranslationBadge` — ESV/WEB/KJV badge button (opens modal, Phase later)

**Behavior:**
- Changing book resets chapter to 1
- Changing chapter updates the reader immediately
- Book dropdown is grouped (Old Testament / New Testament)
- All 66 books must be listed

**Acceptance criteria:**
- Selecting "Romans" from dropdown navigates reader to Romans 1
- Selecting "Ch. 3" navigates to chapter 3 of current book
- Topbar stays fixed on scroll
- Logo ("Selah") visible on left

---

### SPEC-005: Sidebar
**Status:** DONE

**What:** Collapsible left sidebar with book list and chapter grid.

**Reference:** `/mocks/bible-reader-mock-v3.html` — `.sidebar`, `.book-list`, `.ch-grid`

**Behavior:**
- Visible by default on desktop (≥1024px)
- Toggle button in topbar left (panel icon) shows/hides it
- Smooth CSS transition (0.3s ease) on width
- Book list highlights active book
- Chapter grid highlights active chapter
- Chapters with notes show a small dot indicator (stub for Phase 2)
- Reading plan section at bottom (static display for now)
- On mobile (< 1024px): hidden by default, toggle shows as overlay

**Acceptance criteria:**
- Click toggle → sidebar slides closed, reader expands to fill space
- Click toggle again → sidebar slides back open
- Active book and chapter are visually highlighted
- Scrollable independently of reader

---

## Phase 2 — Study Tools

### SPEC-006: Zustand Stores
**Status:** TODO

**What:** Global state management setup.

**`uiStore.js`:**
```js
{
  sidebarOpen: true,
  panelOpen: true,
  activePane: 'notes',         // 'notes' | 'commentary' | 'insights'
  activeVerse: null,           // { book, chapter, verse } or null
  setSidebarOpen: fn,
  setPanelOpen: fn,
  setActivePane: fn,
  setActiveVerse: fn,
}
```

**`studyStore.js`:**
```js
{
  activeHighlightColor: 'yellow',
  toolMode: 'highlight',       // 'highlight' | 'erase' | 'note'
  notes: {},                   // key: "John-4-5", value: { text, updatedAt }
  highlights: {},              // key: "John-4-5", value: { color }
  setHighlightColor: fn,
  setToolMode: fn,
  addNote: fn,
  updateNote: fn,
  addHighlight: fn,
  removeHighlight: fn,
}
```

---

### SPEC-007: Highlight Tool
**Status:** TODO

**What:** Users can select a verse and apply a color highlight to it.

**Behavior:**
- Clicking a verse in "highlight" tool mode applies the active color
- Clicking a highlighted verse in "erase" mode removes the highlight
- 5 color swatches in tool strip (yellow, green, blue, pink, purple)
- Active swatch has border ring
- Highlights persist in Zustand (localStorage persistence via zustand/middleware)

**Acceptance criteria:**
- Click verse → it gets the active highlight color background
- Switch color → next click applies new color
- Erase mode → clicking highlighted verse removes color
- Refreshing page preserves highlights (localStorage)

---

### SPEC-008: Notes — Local
**Status:** TODO

**What:** Users can write notes attached to verses, stored locally.

**Components:**
- `StudyPanel` — tabbed right panel wrapper, starts with Notes tab only
- `PanelTabs` — tab switcher (Notes only in Phase 2, others stubbed)
- `NoteCompose` — compose area at top of notes pane, shows active verse context
- `NoteCard` — saved note display card
- `NotesPane` — composes NoteCompose + list of NoteCards

**Behavior:**
- Clicking a verse opens the Notes panel (if closed) and populates NoteCompose
- Verse reference and preview text shown above textarea
- Save button saves to Zustand studyStore
- Saved notes appear as cards below compose area
- Note dot on VerseBlock becomes filled/accent when a note exists for that verse
- Panel is chapter-scoped: shows all notes for current chapter

**Acceptance criteria:**
- Click verse → Notes panel opens, compose area shows "John 4:5"
- Type note + save → card appears in list below
- Note dot on verse turns accent color
- Closing and reopening panel preserves notes

---

## Phase 3 — Commentary + Insights

### SPEC-009: Commentary Pane
**Status:** TODO

**What:** Commentary tab in the right panel, showing public domain commentary for the chapter.

**Data:** Matthew Henry JSON from `/src/data/commentaries/matthew-henry/john.json`

**Components:**
- `CommentaryPane` — scrollable commentary content
- `CommentarySource` — source switcher buttons (Matthew Henry, Calvin, Gill, Geneva)

**Behavior:**
- Commentary is chapter-scoped by default
- Switching source swaps the content
- If commentary data doesn't exist for a book/chapter, show a graceful empty state
- Sources without data for this passage are grayed out in switcher

**Acceptance criteria:**
- Commentary tab shows Matthew Henry text for John 4
- Switching to "John Gill" swaps content
- Author name and dates displayed above content

---

### SPEC-010: Insights Pane + Cards
**Status:** TODO

**What:** Insights tab showing archaeology, manuscript, geography, and history cards.

**Data:** `/src/data/insights/john.json`

**Components:**
- `InsightsPane` — scrollable list of InsightCard components
- `InsightCard` — type badge, title, preview text, "Read more" button
- `InsightDetailModal` — full content modal, triggered by InsightCard
- `InsightChip` — inline colored badge on VerseBlock (e.g. "🗺 Map", "⛏ Archaeology")

**Insight types and colors:**
- `archaeology` → `#7a6a4a` brown
- `manuscript` → `#7a6a8a` purple
- `geography` → `#6a8f7a` green
- `history` → `#6a7a8a` slate

**Behavior:**
- InsightChips appear inline with verses that have linked insights
- Clicking a chip opens the InsightDetailModal directly
- InsightsPane shows all insights for the current chapter
- Clicking a card in the pane also opens InsightDetailModal

**Acceptance criteria:**
- John 4 Insights tab shows at least 3 cards
- Chip on verse 5 opens archaeology modal
- Chip on verse 4 opens map (stubs to InsightDetailModal in Phase 3, real map in Phase 4)
- Modal displays full formatted content

---

## Phase 4 — Maps

### SPEC-011: MapModal with Leaflet
**Status:** TODO

**What:** Replace the SVG mock map with a real interactive Leaflet map.

**Data:** OpenBible.info geocoded places CSV, converted to JSON at `/src/data/places.json`

**Behavior:**
- MapModal receives a place name or lat/lng and centers on it
- Relevant places for the current passage are shown as markers
- Clicking a marker shows a popup with place name + description
- Dedicated `/maps` page shows a full-screen version

**Acceptance criteria:**
- MapModal opens and renders a Leaflet map centered on Sychar
- Marker placed at Jacob's Well coordinates
- Popup shows place name and brief description

---

## Phase 5 — Auth + Sync

### SPEC-012: Supabase Auth
**Status:** TODO

**What:** Email-based authentication using Supabase Auth.

**Behavior:**
- Sign up / sign in modal (email + password)
- Session persisted across page refreshes
- User avatar in topbar shows initials when logged in
- Logging out clears session

### SPEC-013: Notes + Highlights Sync
**Status:** TODO

**What:** Migrate notes and highlights from Zustand/localStorage to Supabase.

**Hooks:**
- `useNotes(book, chapter)` — fetch notes for chapter, CRUD operations
- `useHighlights(book, chapter)` — fetch highlights for chapter, CRUD operations
- Both use Tanstack Query + Supabase
- Optimistic updates: UI updates immediately, syncs in background

**Behavior:**
- When logged out: notes/highlights stored in localStorage (Zustand)
- When logged in: notes/highlights stored in Supabase, localStorage as cache
- Merging strategy: Supabase wins on conflict

---

## Phase 6 — Full Commentary Page + Polish

### SPEC-014: Dedicated Commentary Page
**Status:** TODO

**Route:** `/commentary`

**What:** A full-page commentary view, side-by-side with scripture. Richer than the panel.

### SPEC-015: API.Bible Integration
**Status:** TODO

**What:** Replace local WEB JSON with live API.Bible fetches via Tanstack Query.

**Behavior:**
- Local JSON remains as fallback if API is unavailable
- Translation switching (KJV, WEB, ASV, YLT) via API.Bible
- ESV translation via ESV API
- Cache with `staleTime: Infinity` per session

---

*Specs are added as phases begin. Do not spec future phases in detail until ready to build them.*
