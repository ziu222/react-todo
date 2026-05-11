# Milestones & Delivery History

## Product Summary

**TaskFlow** is a React 19 task manager with a dashboard-first experience:

- **Dashboard** — 5 KPI stat cards (with animated SVG rings), Recharts progress chart, 15-week completion heatmap, Today panel.
- **Tasks** — Kanban board with drag-and-drop, tag filtering, bulk actions, pinned sections, inline quick-edit, subtask checklist.
- **Timeline** — Month/week Gantt view with smart 3-tier pill rendering.
- **Settings** — Persistent profile (name, avatar, cover color) and multi-theme support.
- **About / Contact** — Animated marketing pages.

## Status at a Glance

**Current phase**: Feature-complete. All planned features shipped. Next focus: unit tests, accessibility hardening, production deploy.

**Definition of Done (global)**:
- No console errors in dev
- All user input validated (trim, non-empty, max length)
- Keyboard-accessible (`:focus-visible`, labels, Enter/Escape)
- Persistence reliable (localStorage with safe parsing and fallbacks)

---

## Milestone 1 — Project Bootstrap ✅
**Completed**: 2026-05-05

- Vite + React 19 scaffold
- ESLint flat config
- Git setup and base documentation
- `vite-env.d.ts` for asset/editor typings

---

## Milestone 2 — Core Architecture ✅
**Completed**: 2026-05-05 → 2026-05-06

- `Todo` model with `id`, `title`, `completed`, `createdAt`
- Pure logic functions in `features/todos/model/`
- `useTodos` hook (reducer + hydration + localStorage persistence)
- Versioned storage adapter (`todos:v1`)
- App-level providers: theme + todos

---

## Milestone 3 — Dashboard Shell & Layout ✅
**Completed**: 2026-05-06

- Sidebar navigation + sticky top bar (search, notifications, avatar)
- KPI cards: Total Tasks / In Progress / Completed
- Recharts progress chart with Daily / Weekly / Monthly toggle
- Today panel with date header, empty state, and quick-add input
- Page scaffolds for all routes

---

## Milestone 4 — Task Functionality ✅
**Completed**: 2026-05-06 → 2026-05-07

- Kanban board: Backlog / To Do / In Progress / Done columns
- Tabbed add-task modal: Details · Organize · Files · Notes
- Fields: title, emoji picker, start/end date, priority, tags, description, color, file attachments
- Task detail modal with all fields in read-only view
- Update status, delete task, pin task (floats to top of column)
- Auto-status: tasks past their end date created as Done
- Progress bar derived from `startDay`/`endDay` — never stored
- Subtasks with start/end time slots
- Search across all columns; counts update live on Dashboard
- Today panel shows tasks due today

---

## Milestone 5 — Timeline View ✅
**Completed**: 2026-05-07

- Month / Week toggle with Prev / Next / Today navigation
- Each task renders as a horizontal bar spanning `startDay → endDay`
- Color-coded bars match each task's accent color
- Tasks without dates shown in a separate section
- Day click opens the DayView drill-down panel

---

## Milestone 6 — Settings & Theme System ✅
**Completed**: 2026-05-07

- Settings page with My Details / Theme tabs
- Profile: first name, last name, email, avatar upload, cover color
- Multiple built-in themes applied via CSS custom properties
- `UserContext` persists profile to `todo:user`; theme to `todo:theme`

---

## Milestone 7 — UX Polish & New Features ✅
**Completed**: 2026-05-08 → 2026-05-09

All originally planned features plus additional improvements:

- **Drag-and-drop** between Kanban columns (HTML5 native)
- **Tag filter bar** — horizontal pill row filters the entire board
- **Bulk action bar** — multi-select cards, move all or delete all
- **Pinned tasks section** — dedicated header row above normal cards in each column
- **Empty column states** — per-column emoji + message + hint
- **Empty board state** — full-board banner with "Load sample tasks" button (7 realistic demo tasks across all statuses)
- **Inline title quick-edit** — double-click any card title; Enter saves, Escape cancels
- **Description preview** on cards — 1-line clamp below the title
- **Subtask count** on cards — `✓ 2/4` meta badge
- **Subtask checklist** in task detail modal — click to toggle done/undone
- **Column color themes** — tinted header backgrounds via `color-mix()`
- **Due Today** and **Overdue** stat cards on Dashboard
- **Debounced search** (200 ms) in TopBar

---

## Milestone 8 — Animations & Motion ✅
**Completed**: 2026-05-09 → 2026-05-10

- **Page transitions** via View Transitions API (`viewTransition` on NavLink, `key={pathname}` remount)
- **Scroll-reveal** on About and Contact pages (IntersectionObserver, transition-based)
- **Expo-out easing** (`cubic-bezier(0.16, 1, 0.3, 1)`) applied app-wide
- **Card hover lift** on Kanban cards (`translateY(-2px)` + shadow)
- **Action slide-in** — card action buttons animate up on hover
- **Sidebar micro-animations** — logo spin, nav icon scale, active indicator height animation
- **Progress bar fill** transition on cards

---

## Milestone 9 — Dashboard Enhancements ✅
**Completed**: 2026-05-10 → 2026-05-11

- **15-week completion heatmap** — GitHub-style activity grid using `endDay ?? createdAt` for done tasks
- **Animated SVG progress rings** on In Progress and Completed stat cards — `stroke-dashoffset` animation from 0 to value on mount

---

## Milestone 10 — Keyboard Shortcuts & Global UX ✅
**Completed**: 2026-05-11

- **Keyboard shortcuts**: `N` new task (any page), `/` focus search, `?` cheat-sheet overlay, `Esc` close modal
- **Global add-task modal** in Layout — `N` key opens `AddTaskModal` from any route without navigation
- **TopBar + New button** and **keyboard icon button** for discoverability
- **`/` hint badge** inside search input (fades on focus)
- **ShortcutOverlay** component with styled `<kbd>` elements

---

## Milestone 11 — Timeline & Date Pill Fixes ✅
**Completed**: 2026-05-11

- **3-tier timeline pills**: 1-day → compact colored circle with emoji; 2-day → title-only capsule; 3+ days → full pill with progress + arrow. Eliminates the "donut" artifact from fixed-size fill in a circle pill.
- **Smart Kanban date pills**: single "Due: Today" pill for same-day tasks; amber "Today" highlight when due date is today; `endDay`-only tasks now show "Due: [date]" instead of hiding the date.
- **Division-by-zero fix** in `calcProgress` for `startDay === endDay` tasks.
- **React.memo** on `KanbanCard`, `StatCard`, `TodayCard` to prevent unnecessary re-renders.

---

## Milestone 12 — Tests, A11y & Deploy (Planned)

**Goal**: Confidence to ship and iterate.

**Scope**
- Unit tests for `todoLogic.ts` pure functions (add, delete, calcProgress, selectCounts)
- Storage adapter tests (parse failures, version mismatch)
- Focus management after task delete (move focus to sibling or list container)
- `aria-live="polite"` on filtered task count
- Production build + Vercel / GitHub Pages deploy
- README screenshots and live link

**Acceptance criteria**
- `npm test` passes in CI
- `npm run build` produces no warnings indicating runtime issues
- Deployed app loads, persists tasks, and passes keyboard nav from add to delete
