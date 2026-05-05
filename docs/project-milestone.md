# Milestones & Delivery Plan

## Product summary
**React To‑Do App** is a lightweight task manager with a dashboard-first experience:
- **Dashboard**: KPI cards (Total / In Progress / Completed), progress chart (Daily/Weekly/Monthly), and a **Today** panel with quick-add.
- **Tasks**: CRUD, completion tracking, filters, and (later) Kanban-style organization.

## Status at a glance
- **Current phase**: Dashboard UI is in place; next focus is end-to-end task functionality.
- **Definition of Done (global)**:
  - No console errors in dev
  - All user input is validated (trim, non-empty, max length)
  - Keyboard-accessible interactions (`:focus-visible`, labels, Enter/Escape flows)
  - Persistence works reliably (localStorage with safe parsing and fallbacks)

---

## Milestone 1 — Project bootstrap (Completed)
**When**: 2026‑05‑05  
**Outcome**: Working dev setup and repo hygiene.

**Delivered**
- Vite + React project scaffold
- ESLint (flat config)
- Git setup and base documentation
- `vite-env.d.ts` for asset/editor typings

---

## Milestone 2 — Core architecture (Completed)
**When**: 2026‑05‑05 → 2026‑05‑06  
**Outcome**: Stable foundations for state and persistence.

**Delivered**
- `Todo` model (id, title, completed, createdAt)
- Pure logic functions (add/toggle/delete/clear) in `features/todos/model/`
- `useTodos` hook (reducer + hydration/persistence)
- localStorage adapter (versioned key: `todos:v1`)
- App-level providers (theme + todos)

---

## Milestone 3 — Dashboard shell & layout (Completed)
**When**: 2026‑05‑06  
**Outcome**: Dashboard matches the intended first screen (sidebar, header, cards, chart, today panel).

**Delivered**
- Layout: sidebar navigation + top header with search/notifications/profile
- KPI cards: Total Tasks / In Progress / Completed
- Progress chart with timeframe toggle (Daily / Weekly / Monthly)
- Today panel with date, empty-state text, and “Add a task…” quick input
- Page scaffolds (Dashboard / Tasks / Timeline / Settings)

**Design reference**
- Inspired by a Figma community dashboard concept (see existing link in repo history).

---

## Milestone 4 — Task functionality (Next)
**Goal**: Make the dashboard real by wiring up task creation, completion, and accurate counts.

**Scope**
- Add task (supports quick-add in Today panel + primary add flow)
- Toggle complete / delete
- Derived counts for cards (Total / In Progress / Completed)
- Basic list rendering for Today and Tasks views

**Acceptance criteria**
- Creating a task updates KPI cards immediately
- Titles are validated: trimmed, non-empty, ≤ 500 chars
- IDs use `crypto.randomUUID()` (no array indices as keys)
- State persists across refresh (localStorage, safe parse + fallback)

---

## Milestone 5 — Filters, editing, and UX polish (Planned)
**Goal**: Everyday usability features without adding complex infrastructure.

**Scope**
- Filters: All / Active / Completed
- Inline edit (Enter to save, Escape to cancel)
- Clear completed
- Empty states that look intentional (not placeholder-ish)

**Acceptance criteria**
- Filtered views match the underlying state (no duplicated derived state)
- Inline edit never allows blank titles
- Clear completed is one click and undo-safe (optional: confirm)

---

## Milestone 6 — Accessibility & responsiveness (Planned)
**Goal**: Keyboard-first and mobile-friendly experience.

**Scope**
- `:focus-visible` and consistent focus rings
- Labels correctly bound (`htmlFor` / `aria-labelledby`)
- Responsive layout (sidebar collapses on small screens)
- Theme toggle (if already wired, ensure it’s complete and persisted)

**Acceptance criteria**
- Full task flow usable via keyboard only
- No interactive element lacks an accessible name
- Layout remains usable at common mobile widths (375px)

---

## Milestone 7 — Testing & release (Planned)
**Goal**: Confidence to iterate quickly and ship a stable build.

**Scope**
- Add unit tests for pure todo logic
- Add smoke tests for key UI components (KPI cards, Today quick-add)
- Production build + deploy (Vercel or GitHub Pages)
- README updated with screenshots + live link

**Acceptance criteria**
- Tests run in CI locally (`npm test` or equivalent)
- `npm run build` succeeds with no warnings that indicate runtime issues
- Deployed app loads and persists tasks across reloads
