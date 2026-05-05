
## Tech Stack

- **React 19** + **Vite 8**
- **TypeScript**
- **React Router DOM v7**
- Plain CSS with CSS variables

## Project Structure

```
src/
  features/todos/
    api/          # localStorage storage adapter
    components/   # TodoForm, FilterBar, TodoList, TodoItem
    hooks/        # useTodos — reducer + localStorage
    model/        # Todo type + pure logic functions
    utils/        # helper utilities
  App.tsx
  main.tsx
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

- Add, toggle, and delete todos
- Filter by All / Active / Completed
- Persisted to `localStorage` (key: `todos:v1`)
- Keyboard accessible (Enter to submit, focus-visible styles)
- XSS-safe — titles rendered as plain text

## References

-(FE at first) [django-react-todo-app](https://github.com/TuanTran0168/django-react-todo-app.git) by TuanTran0168
- [TodoApp](https://github.com/maciekt07/TodoApp) by maciekt07

## Design

UI layout and assets inspired by the [Task Management Web App Design](https://www.figma.com/design/Oa55NERwMPgGQYJ9uhf3EU/Task--Management--Web-App-Design--Community-?node-id=2-384&t=1HVrXOKfyFEqZsYC-0) (Community) on Figma.
