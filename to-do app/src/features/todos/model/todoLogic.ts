export type TodoStatus = 'backlog' | 'todo' | 'in-progress' | 'done'
export type Filter     = 'all'   | 'backlog' | 'todo' | 'in-progress' | 'done'
export type Priority   = 'low' | 'medium' | 'high'

export interface Attachment {
  name: string
  type: string
  data: string   // base64 data URL
}

export interface Todo {
  id:           string
  title:        string
  status:       TodoStatus
  createdAt:    number
  pinned:       boolean
  color:        string
  dueDate?:     number        // Unix ms
  priority?:    Priority
  tags?:        string[]
  description?: string
  progress?:    number        // 0–100
  attachments?: Attachment[]
}

export interface TodoState {
  todos:  Todo[]
  filter: Filter
  query:  string
}

export type TodoAction =
  | { type: 'ADD'; payload: {
      title:        string
      color?:       string
      dueDate?:     number
      priority?:    Priority
      tags?:        string[]
      description?: string
      progress?:    number
      attachments?: Attachment[]
    }}
  | { type: 'UPDATE_STATUS'; payload: { id: string; status: TodoStatus } }
  | { type: 'PIN';           payload: { id: string } }
  | { type: 'DELETE';        payload: { id: string } }
  | { type: 'SET_FILTER';    payload: { filter: Filter } }
  | { type: 'SET_SEARCH';    payload: { query: string } }
  | { type: 'HYDRATE';       payload: { todos: Todo[] } }

export const INITIAL_STATE: TodoState = { todos: [], filter: 'all', query: '' }

export function getDefaultColor(): string {
  return (
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#8B5CF6'
  )
}

// ── CRUD operations

export function addTodo(
  todos: Todo[],
  title: string,
  extras?: Omit<Partial<Todo>, 'id' | 'title' | 'createdAt' | 'pinned'>,
): Todo[] {
  const trimmed = title.trim()
  if (!trimmed || trimmed.length > 500) return todos
  return [
    ...todos,
    {
      id:        crypto.randomUUID(),
      title:     trimmed,
      status:    extras?.status    ?? 'todo',
      createdAt: Date.now(),
      pinned:    false,
      color:     extras?.color     ?? getDefaultColor(),
      dueDate:   extras?.dueDate,
      priority:  extras?.priority,
      tags:      extras?.tags,
      description: extras?.description,
      progress:  extras?.progress,
      attachments: extras?.attachments,
    },
  ]
}

export function updateStatus(todos: Todo[], id: string, status: TodoStatus): Todo[] {
  return todos.map(t => (t.id === id ? { ...t, status } : t))
}

export function pinTodo(todos: Todo[], id: string): Todo[] {
  return todos.map(t => (t.id === id ? { ...t, pinned: !t.pinned } : t))
}

export function deleteTodo(todos: Todo[], id: string): Todo[] {
  return todos.filter(t => t.id !== id)
}

// ── Reducer for state

export function todosReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD': {
      const { title, ...extras } = action.payload
      return { ...state, todos: addTodo(state.todos, title, extras) }
    }
    case 'UPDATE_STATUS':
      return { ...state, todos: updateStatus(state.todos, action.payload.id, action.payload.status) }
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

// ── Selectors

export function selectFilteredTodos(todos: Todo[], filter: Filter, query: string): Todo[] {
  let result = filter === 'all' ? todos : todos.filter(t => t.status === filter)
  const q = query.trim().toLowerCase()
  if (q) result = result.filter(t => t.title.toLowerCase().includes(q))
  return [...result.filter(t => t.pinned), ...result.filter(t => !t.pinned)]
}

export function selectCounts(todos: Todo[]) {
  return {
    all:           todos.length,
    backlog:       todos.filter(t => t.status === 'backlog').length,
    todo:          todos.filter(t => t.status === 'todo').length,
    'in-progress': todos.filter(t => t.status === 'in-progress').length,
    done:          todos.filter(t => t.status === 'done').length,
  }
}
