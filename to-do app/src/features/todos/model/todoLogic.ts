export type Filter = 'all' | 'active' | 'completed'

export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: number
  pinned: boolean
  color: string
}

export interface TodoState {
  todos: Todo[]
  filter: Filter
  query: string
}

export type TodoAction =
  | { type: 'ADD';        payload: { title: string; color?: string } }
  | { type: 'TOGGLE';     payload: { id: string } }
  | { type: 'PIN';        payload: { id: string } }
  | { type: 'DELETE';     payload: { id: string } }
  | { type: 'SET_FILTER'; payload: { filter: Filter } }
  | { type: 'SET_SEARCH'; payload: { query: string } }
  | { type: 'HYDRATE';    payload: { todos: Todo[] } }

export const INITIAL_STATE: TodoState = { todos: [], filter: 'all', query: '' }

export function getDefaultColor(): string {
  return (
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#7c3aed'
  )
}

export function addTodo(todos: Todo[], title: string, color?: string): Todo[] {
  const trimmed = title.trim()
  if (!trimmed || trimmed.length > 500) return todos
  return [
    ...todos,
    {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
      pinned: false,
      color: color ?? getDefaultColor(),
    },
  ]
}

export function toggleTodo(todos: Todo[], id: string): Todo[] {
  return todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
}

export function pinTodo(todos: Todo[], id: string): Todo[] {
  return todos.map(t => (t.id === id ? { ...t, pinned: !t.pinned } : t))
}

export function deleteTodo(todos: Todo[], id: string): Todo[] {
  return todos.filter(t => t.id !== id)
}

export function todosReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD':
      return { ...state, todos: addTodo(state.todos, action.payload.title, action.payload.color) }
    case 'TOGGLE':
      return { ...state, todos: toggleTodo(state.todos, action.payload.id) }
    case 'PIN':
      return { ...state, todos: pinTodo(state.todos, action.payload.id) }
    case 'DELETE':
      return { ...state, todos: deleteTodo(state.todos, action.payload.id) }
    case 'SET_FILTER':
      return { ...state, filter: action.payload.filter }
    case 'SET_SEARCH':
      return { ...state, query: action.payload.query }
    case 'HYDRATE':
      return { ...state, todos: action.payload.todos }
  }
}

export function selectFilteredTodos(todos: Todo[], filter: Filter, query: string): Todo[] {
  let result = todos
  if (filter === 'active')    result = result.filter(t => !t.completed)
  if (filter === 'completed') result = result.filter(t => t.completed)
  const q = query.trim().toLowerCase()
  if (q) result = result.filter(t => t.title.toLowerCase().includes(q))
  // pinned todos always float to top within the filtered view
  return [...result.filter(t => t.pinned), ...result.filter(t => !t.pinned)]
}

export function selectCounts(todos: Todo[]) {
  const active    = todos.filter(t => !t.completed).length
  const completed = todos.filter(t => t.completed).length
  return { total: todos.length, active, completed }
}
