
# React To-Do App

A task management web app built with React 19 and Vite. Features a dashboard overview, Kanban board, Gantt-style timeline, and a multi-theme settings panel — all persisted to localStorage.

## Tech Stack

- **React 19** + **Vite 8**
- **TypeScript**
- **React Router DOM v7**
- Plain CSS with CSS variables

## Project Structure

```
src/
  app/              # Providers (ThemeContext, TodosContext, UserContext, router)
  features/todos/
    api/            # localStorage storage adapter (todos:v1)
    hooks/          # useTodos — useReducer + hydration/persistence
    model/          # Todo type + pure logic functions
    utils/          # helper utilities (e.g. highlight matching text)
  components/
    dashboard/      # StatCard, TaskChart, TodayPanel
    kanban/         # KanbanBoard, KanbanColumn, KanbanCard, AddTaskModal, TaskDetailModal
    layout/         # Sidebar, TopBar, BottomNav
    settings/       # ProfileBanner, ThemeSelector
    timeline/       # TimelineHeader, TimelineRow
  pages/            # DashboardPage, TasksPage, TimelinePage, SettingsPage
  styles/           # themeFactory — CSS variable token sets
```

## Getting Started

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build
npm run lint      # ESLint
```

## Features

### Dashboard
- KPI cards: Total Tasks / In Progress / Completed (derived in real-time)
- Progress chart with Daily / Weekly / Monthly timeframe toggle
- Today panel — shows tasks due today with quick-add

### Tasks (Kanban)
- Four columns: **Backlog → To Do → In Progress → Done**
- Add task with title, color, priority, tags, start/end dates, description, and file attachments
- Task detail modal for full editing
- Pin tasks to float them to the top of their column
- Delete tasks; auto-status for past end dates
- Progress bar derived from start/end dates (not stored)
- Global search filters all columns simultaneously

### Timeline
- Gantt-style month/week view of tasks with `startDay`/`endDay` set
- Navigate with Previous / Next / Today buttons
- Color-coded task bars matching each task's accent color

### Settings
- Profile: first name, last name, email, cover color — persisted to localStorage
- Theme selector with multiple built-in themes (CSS variable token sets)

### Cross-cutting
- All state persisted to `localStorage` (`todos:v1`, `todo:theme`, `todo:user`)
- IDs use `crypto.randomUUID()` — never array indices
- XSS-safe: titles rendered as plain React text nodes
- Keyboard accessible (Enter to submit, focus-visible styles)

## References

-(FE at first) [django-react-todo-app](https://github.com/TuanTran0168/django-react-todo-app.git) by TuanTran0168
- [TodoApp](https://github.com/maciekt07/TodoApp) by maciekt07

## Design

UI layout and assets inspired by the [Task Management Web App Design](https://www.figma.com/design/Oa55NERwMPgGQYJ9uhf3EU/Task--Management--Web-App-Design--Community-?node-id=2-384&t=1HVrXOKfyFEqZsYC-0) (Community) on Figma.
