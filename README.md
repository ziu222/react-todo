# TaskFlow — React To-Do App

A dashboard-first task management app built with React 19 and Vite. Combines a live KPI dashboard, Kanban board, Gantt timeline, and rich task data (priorities, tags, subtasks, attachments, colors) with state persisted in localStorage.

## Tech Stack

- **React 19** + **Vite 8** (Oxc transform)
- **TypeScript** (type-only, no `tsc` emit)
- **React Router DOM v7**
- **Recharts** — progress chart on Dashboard
- **Plain CSS** with CSS custom properties — no component library, no CSS-in-JS

## Quick Start

```bash
cd "to-do app"
npm install
npm run dev       # http://localhost:5173
npm run build     # production bundle → dist/
npm run preview   # serve production build
npm run lint      # ESLint flat config
```

## Routes

| Route | Page |
|-------|------|
| `/` | Dashboard — KPI cards, progress chart, activity heatmap, Today panel |
| `/tasks` | Kanban board — four-column task management |
| `/timeline` | Month / week Gantt timeline |
| `/settings` | Profile and theme controls |
| `/about` | About page |
| `/contact` | Contact page |

## Features

### Dashboard
- 5 KPI stat cards: Total Tasks, In Progress, Completed, Due Today, Overdue
- Animated SVG progress rings on In Progress and Completed cards
- Daily / Weekly / Monthly progress chart (Recharts)
- 15-week completion activity heatmap (GitHub-style)
- Today panel with tasks due today and quick-add

### Kanban Board
- Four columns: Backlog · To Do · In Progress · Done
- Column-level color themes with tinted headers
- Drag & drop cards between columns (native HTML5)
- Tag filter bar — click any tag to filter the whole board
- Bulk action bar — multi-select cards, move or delete in one action
- Pinned tasks section at the top of each column
- Empty board state with **Load sample tasks** button (7 realistic demo tasks)
- Task cards show: emoji, title, description preview, tags, subtask progress, priority badge, date pills, progress bar
- Smart date pills: single "Due: Today" for same-day tasks, amber highlight when due today, red when overdue
- Double-click any card title to edit inline (Enter saves, Escape cancels)

### Task Detail & Add Modal
- Tabbed add/edit modal: Details · Organize · Files · Notes
- Fields: title, emoji, start/end date, priority, tags, description, color, attachments (file upload)
- Subtasks with time slots (start/end time per subtask)
- Interactive subtask checklist in the detail modal — click to toggle done/undone
- Attach images with inline thumbnail preview

### Timeline
- Month and week view with Previous / Next / Today navigation
- Smart 3-tier pill rendering:
  - **1-day span** → compact colored circle with emoji
  - **2-day span** → capsule with title only
  - **3+ day span** → full pill with progress %, arrow, and fill bar
- Tasks without dates listed in a separate section

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `N` | Open new task modal (works from any page) |
| `/` | Focus the search bar |
| `?` | Show keyboard shortcuts overlay |
| `Esc` | Close any open modal |

The TopBar also has a **+ New** button and a keyboard icon button for discoverability.

### Animations & UX
- Page transitions via View Transitions API + key-based remount
- Scroll-reveal on About and Contact pages (IntersectionObserver)
- Expo-out easing (`cubic-bezier(0.16, 1, 0.3, 1)`) throughout
- Sidebar logo, nav links, and active indicator micro-animations
- Card hover lift + action slide-in on Kanban cards
- Debounced search (200 ms)

### Settings
- Profile: first name, last name, email, avatar upload, cover color
- Multiple built-in themes (persisted to `todo:theme`)
- `UserContext` makes profile data available app-wide

## Architecture

```
src/
  app/                  # Layout, router, ThemeContext, TodosContext, UserContext
  components/
    dashboard/          # StatCard, TaskChart, HeatmapChart, TodayPanel, TodayCard
    kanban/             # KanbanBoard, KanbanColumn, KanbanCard, AddTaskModal,
                        #   TaskDetailModal, BulkActionBar
    layout/             # Sidebar, TopBar, BottomNav, ShortcutOverlay
    settings/           # SettingsPanel
    timeline/           # TimelineHeader, TimelineRow, DayView
  features/todos/
    api/                # loadTodos / saveTodos (localStorage adapter)
    hooks/              # useTodos (reducer + hydration + demo seed)
    model/              # todoLogic.ts — pure functions, reducer, selectors
    utils/              # highlightMatchingText
  pages/                # DashboardPage, TasksPage, TimelinePage, SettingsPage,
                        #   AboutPage, ContactPage
  styles/               # CSS variables, theme tokens, keyframe library
```

## State & Persistence

- **Todos** → `todos:v1` in localStorage
- **Theme** → `todo:theme`
- **User profile** → `todo:user`
- IDs generated with `crypto.randomUUID()` — never array indices
- All storage reads are wrapped in `try/catch` with typed fallbacks
- Multi-tab sync via the `storage` event

## Data Model

```ts
type Todo = {
  id:           string          // crypto.randomUUID()
  title:        string          // trimmed, max 500 chars
  status:       'backlog' | 'todo' | 'in-progress' | 'done'
  createdAt:    number          // Unix ms
  pinned:       boolean
  color:        string          // hex or CSS variable
  emoji?:       string          // single emoji character
  startDay?:    number          // Unix ms, local midnight
  endDay?:      number          // Unix ms, local midnight
  priority?:    'low' | 'medium' | 'high'
  tags?:        string[]
  description?: string
  attachments?: Attachment[]    // base64 data URLs
  subTasks?:    SubTask[]
}

type SubTask = {
  id:           string
  title:        string
  status:       TodoStatus
  startTime?:   string          // "HH:MM"
  endTime?:     string          // "HH:MM"
  date?:        number          // Unix ms midnight
  description?: string
}
```

Progress is always derived — never stored as separate state.

## Performance

- `React.memo` on `KanbanCard`, `StatCard`, and `TodayCard`
- Debounced search input (200 ms)
- `useMemo` for filtered todo lists and tag aggregation

## Tradeoffs

- **No test runner configured** — add `vitest` + `@testing-library/react` before writing tests; pure logic in `todoLogic.ts` is fully unit-testable without React.
- **localStorage only** — no server sync; multi-tab handled via the `storage` event.
- **Hard delete** — no undo/trash; soft delete would need additional state.
- **Single user** — no auth or per-user scoping.

## References

- [docs/TODO_APP_PLAN.md](docs/TODO_APP_PLAN.md) — architecture rules and data model details
- [docs/project-milestone.md](docs/project-milestone.md) — delivery history and milestone status

## Credits & Inspiration

- **[maciekt07/TodoApp](https://github.com/maciekt07/TodoApp)** Patterns inspired include: emoji picker on tasks, per-task color accent, `position` field concept for manual ordering, `useStorageState` hook pattern for localStorage abstraction, and the category/tag model for organizing tasks.
