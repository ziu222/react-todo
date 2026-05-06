export type TodoStatus = 'backlog' | 'todo' | 'in-progress' | 'done'
export type Filter     = 'all'   | 'backlog' | 'todo' | 'in-progress' | 'done'
export type Priority   = 'low' | 'medium' | 'high'

export interface Attachment {
  name: string
  type: string
  data: string   // base64 data URL
}

export interface SubTask {
  id:           string
  title:        string
  status:       TodoStatus
  startTime?:   string    // "HH:MM" local-time display string
  endTime?:     string    // "HH:MM" local-time display string
  description?: string
  date?:        number    // unix ms midnight — which day this sub-task belongs to
}

export interface Todo {
  id:           string
  title:        string
  status:       TodoStatus
  createdAt:    number
  pinned:       boolean
  color:        string
  startDay?:    number        // Unix ms, local midnight of start date
  endDay?:      number        // Unix ms, local midnight of end date
  priority?:    Priority
  tags?:        string[]
  description?: string
  attachments?: Attachment[]
  subTasks?:    SubTask[]
}

export const STATUS_LABEL: Record<TodoStatus, string> = {
  backlog:       'Backlog',
  todo:          'To Do',
  'in-progress': 'In Progress',
  done:          'Done',
}

// Normalize a date/timestamp to local midnight ms for comparison
export function toMidnight(d: Date | number): number {
  const dt = typeof d === 'number' ? new Date(d) : d
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime()
}

// Option B: sub-task based when subTasks exist, date-based fallback capped at 99 until done
export function calcProgress(todo: Todo): number {
  if (todo.subTasks && todo.subTasks.length > 0) {
    const done = todo.subTasks.filter(s => s.status === 'done').length
    return Math.round((done / todo.subTasks.length) * 100)
  }
  if (todo.startDay == null || todo.endDay == null) return 0
  if (todo.status === 'done') return 100
  const todayMs = new Date().setHours(0, 0, 0, 0)
  if (todayMs <= todo.startDay) return 0
  return Math.min(99, Math.round(
    ((todayMs - todo.startDay) / (todo.endDay - todo.startDay)) * 100
  ))
}

// Date-only preview — used in AddTaskModal before a Todo object exists
export function calcProgressPreview(startDay: number, endDay: number): number {
  if (startDay === endDay) return 0
  const todayMs = new Date().setHours(0, 0, 0, 0)
  if (todayMs <= startDay) return 0
  return Math.min(99, Math.round(((todayMs - startDay) / (endDay - startDay)) * 100))
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
      startDay?:    number
      endDay?:      number
      priority?:    Priority
      tags?:        string[]
      description?: string
      attachments?: Attachment[]
    }}
  | { type: 'UPDATE_STATUS'; payload: { id: string; status: TodoStatus } }
  | { type: 'PIN';           payload: { id: string } }
  | { type: 'DELETE';        payload: { id: string } }
  | { type: 'SET_FILTER';    payload: { filter: Filter } }
  | { type: 'SET_SEARCH';    payload: { query: string } }
  | { type: 'HYDRATE';       payload: { todos: Todo[] } }
  | { type: 'ADD_SUBTASK';           payload: { parentId: string; title: string; date?: number; startTime?: string; endTime?: string; description?: string } }
  | { type: 'UPDATE_SUBTASK_STATUS'; payload: { parentId: string; subId: string; status: TodoStatus } }
  | { type: 'DELETE_SUBTASK';        payload: { parentId: string; subId: string } }

export const INITIAL_STATE: TodoState = { todos: [], filter: 'all', query: '' }

export function getDefaultColor(): string {
  return (
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#8B5CF6'
  )
}

// ── CRUD operations — parent tasks

export function addTodo(
  todos: Todo[],
  title: string,
  extras?: Omit<Partial<Todo>, 'id' | 'title' | 'createdAt' | 'pinned'>,
): Todo[] {
  const trimmed = title.trim()
  if (!trimmed || trimmed.length > 500) return todos

  const todayMs = new Date().setHours(0, 0, 0, 0)
  const autoStatus = extras?.endDay !== undefined && extras.endDay < todayMs
    ? 'done'
    : (extras?.status ?? 'todo')

  return [
    ...todos,
    {
      id:          crypto.randomUUID(),
      title:       trimmed,
      status:      autoStatus,
      createdAt:   Date.now(),
      pinned:      false,
      color:       extras?.color     ?? getDefaultColor(),
      startDay:    extras?.startDay,
      endDay:      extras?.endDay,
      priority:    extras?.priority,
      tags:        extras?.tags,
      description: extras?.description,
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

// ── CRUD operations — sub-tasks

export function addSubTask(
  todos: Todo[],
  parentId: string,
  title: string,
  extras?: Pick<Partial<SubTask>, 'date' | 'startTime' | 'endTime' | 'description'>,
): Todo[] {
  const trimmed = title.trim()
  if (!trimmed || trimmed.length > 500) return todos
  const newSub: SubTask = {
    id:          crypto.randomUUID(),
    title:       trimmed,
    status:      'todo',
    date:        extras?.date,
    startTime:   extras?.startTime,
    endTime:     extras?.endTime,
    description: extras?.description,
  }
  return todos.map(t =>
    t.id === parentId
      ? { ...t, subTasks: [...(t.subTasks ?? []), newSub] }
      : t
  )
}

export function updateSubTaskStatus(
  todos: Todo[],
  parentId: string,
  subId: string,
  status: TodoStatus,
): Todo[] {
  return todos.map(t =>
    t.id === parentId
      ? { ...t, subTasks: (t.subTasks ?? []).map(s => s.id === subId ? { ...s, status } : s) }
      : t
  )
}

export function deleteSubTask(todos: Todo[], parentId: string, subId: string): Todo[] {
  return todos.map(t =>
    t.id === parentId
      ? { ...t, subTasks: (t.subTasks ?? []).filter(s => s.id !== subId) }
      : t
  )
}

// ── Reducer

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
    case 'ADD_SUBTASK': {
      const { parentId, title, ...extras } = action.payload
      return { ...state, todos: addSubTask(state.todos, parentId, title, extras) }
    }
    case 'UPDATE_SUBTASK_STATUS':
      return { ...state, todos: updateSubTaskStatus(state.todos, action.payload.parentId, action.payload.subId, action.payload.status) }
    case 'DELETE_SUBTASK':
      return { ...state, todos: deleteSubTask(state.todos, action.payload.parentId, action.payload.subId) }
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
