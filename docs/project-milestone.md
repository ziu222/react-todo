# Milestones & Delivery Plan

## Product summary
**React To‑Do App** is a lightweight task manager with a dashboard-first experience:
- **Dashboard**: KPI cards (Total / In Progress / Completed), progress chart (Daily/Weekly/Monthly), and a **Today** panel with quick-add.
- **Tasks**: CRUD, completion tracking, filters, and (later) Kanban-style organization.

## Status at a glance
- **Current phase**: Core app complete — Kanban board, Timeline, Settings, and theme system all shipped. Next focus is polish, accessibility hardening, and deploy.
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

## Milestone 4 — Task functionality (Completed)
**When**: 2026‑05‑06 → 2026‑05‑07  
**Outcome**: Full Kanban-based task management wired to real state and localStorage.

**Delivered**
- Kanban board with four columns: **Backlog / To Do / In Progress / Done**
- Add task via per-column inline form (title, color picker, start/end date, priority, tags, description, attachments)
- Task detail modal — full-field view with edit support
- Update status (drag-free column reassignment via modal)
- Delete task
- Pin task (pinned items float to top within their column)
- Derived KPI counts on Dashboard (Total / In Progress / Completed) update in real time
- Today panel on Dashboard shows tasks due today with quick-add
- Auto-status: tasks whose end date has already passed are created as **Done**
- Progress bar derived from start/end dates — never stored as redundant state
- Search bar filters across all columns simultaneously
- Full localStorage persistence (`todos:v1`)

---

## Milestone 5 — Timeline view (Completed)
**When**: 2026‑05‑07  
**Outcome**: Gantt-style timeline showing task date ranges across a month or week.

**Delivered**
- Timeline page with **Month / Week** view toggle
- Previous / Next / Today navigation
- Each task renders as a horizontal bar spanning its `startDay → endDay`
- Tasks without dates are listed in a separate "No date" section
- Color-coded bars match each task's accent color
- View is read-only (task editing lives in the Kanban detail modal)

---

## Milestone 6 — Settings & theme system (Completed)
**When**: 2026‑05‑07  
**Outcome**: Persistent user profile and multi-theme support.

**Delivered**
- Settings page with **My Details / Theme** tabs
- Profile fields: first name, last name, email, cover color; persisted to localStorage
- Profile banner shows avatar initials and cover color
- Theme selector with multiple built-in themes (tokens applied via CSS variables)
- Selected theme persisted to localStorage (`todo:theme`)
- `UserContext` provider for profile state across the app

---

## Milestone 7 — Filters, editing, and UX polish (Planned)
**Goal**: Everyday usability features without adding complex infrastructure.

**Scope**
- Filter sidebar / chip bar: All / Backlog / To Do / In Progress / Done
- Inline edit directly on Kanban cards (Enter to save, Escape to cancel)
- Clear completed column in one click
- Empty states that look intentional (not placeholder-ish)
- Drag-and-drop card reordering between columns

**Acceptance criteria**
- Filtered views match the underlying state (no duplicated derived state)
- Inline edit never allows blank titles
- Clear completed is one click

---

## Milestone 8 — Accessibility & responsiveness (Planned)
**Goal**: Keyboard-first and mobile-friendly experience.

**Scope**
- `:focus-visible` and consistent focus rings
- Labels correctly bound (`htmlFor` / `aria-labelledby`)
- Responsive layout (sidebar collapses on small screens, bottom-nav on mobile)
- Theme toggle accessible from keyboard

**Acceptance criteria**
- Full task flow usable via keyboard only
- No interactive element lacks an accessible name
- Layout remains usable at common mobile widths (375px)

---

## Milestone 9 — Testing & release (Planned)
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
