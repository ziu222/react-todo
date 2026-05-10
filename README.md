
# React To-Do App

A dashboard-first task management app built with React 19 and Vite. The app combines a KPI dashboard, Kanban board, timeline view, settings, and simple marketing pages, with state persisted in localStorage.

## Tech Stack

- React 19 + Vite 8
- TypeScript
- React Router DOM v7
- Recharts for dashboard charts
- Plain CSS with CSS variables

## Quick Start

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## Scripts

- `npm run dev` starts the Vite dev server.
- `npm run build` produces the production bundle.
- `npm run preview` serves the built app locally.
- `npm run lint` runs ESLint across the workspace.

## App Surface

### Routes
- `/` dashboard with KPI cards, chart, and Today panel
- `/tasks` Kanban board for task management
- `/timeline` month/week timeline view
- `/settings` profile and theme controls
- `/about` informational page
- `/contact` contact page

### Core capabilities
- Task CRUD in the Kanban flow
- Search and filter driven from shared app state
- Timeline visualization for tasks with date ranges
- Persistent theme and profile settings
- Responsive layout with sidebar, top bar, and bottom navigation

## Architecture

```
src/
  app/            # router and app-level providers
  components/     # dashboard, kanban, layout, settings, timeline
  pages/          # route-level pages
  styles/         # theme tokens and factory helpers
  features/todos/ # todo state, reducer logic, storage helpers
```

## State and Persistence

- Todos use a versioned localStorage key: `todos:v1`
- Theme is stored under `todo:theme`
- User profile is stored under `todo:user`
- IDs are generated with `crypto.randomUUID()`
- Titles are trimmed and rendered as plain text
- Storage reads are guarded with safe parsing and fallback values

## Design Notes

The UI draws from a task-management dashboard concept, with the implementation tuned for a practical app rather than a static mockup.

## References

- [docs/TODO_APP_PLAN.md](docs/TODO_APP_PLAN.md) for the current app architecture and state model
- [docs/project-milestone.md](docs/project-milestone.md) for delivery status and roadmap
