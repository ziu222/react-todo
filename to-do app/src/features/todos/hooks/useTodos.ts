import { useReducer, useEffect, useRef } from 'react'
import {
  todosReducer,
  INITIAL_STATE,
  selectFilteredTodos,
  selectCounts,
} from '../model/todoLogic'
import { loadTodos, saveTodos } from '../api/storage'
import type { Filter, TodoStatus, Priority, Attachment, Todo } from '../model/todoLogic'

const today    = new Date().setHours(0, 0, 0, 0)
const DAY      = 86_400_000
const DEMO_TODOS: Todo[] = [
  {
    id: crypto.randomUUID(), title: 'Design new landing page',
    status: 'in-progress', createdAt: today - 5 * DAY, pinned: false,
    color: '#8B5CF6', emoji: '🎨', priority: 'high',
    tags: ['Design'], startDay: today - 3 * DAY, endDay: today + 4 * DAY,
    description: 'Redesign the hero section and update the color palette to match the new brand guidelines.',
  },
  {
    id: crypto.randomUUID(), title: 'Fix authentication bug',
    status: 'todo', createdAt: today - 2 * DAY, pinned: true,
    color: '#EF4444', emoji: '🐛', priority: 'high',
    tags: ['Development'],
    description: 'Users are getting logged out unexpectedly after 10 minutes of inactivity.',
  },
  {
    id: crypto.randomUUID(), title: 'Write API documentation',
    status: 'todo', createdAt: today - 4 * DAY, pinned: false,
    color: '#3B82F6', emoji: '📝', priority: 'medium',
    tags: ['Development', 'Content'],
    startDay: today, endDay: today + 7 * DAY,
  },
  {
    id: crypto.randomUUID(), title: 'Plan Q3 product roadmap',
    status: 'backlog', createdAt: today - 7 * DAY, pinned: false,
    color: '#F59E0B', emoji: '🗺️', priority: 'medium',
    tags: ['Planning'],
    description: 'Gather team input and define key milestones for the next quarter.',
  },
  {
    id: crypto.randomUUID(), title: 'Set up CI/CD pipeline',
    status: 'backlog', createdAt: today - 10 * DAY, pinned: false,
    color: '#6B7280', emoji: '⚙️', priority: 'low',
    tags: ['Development'],
  },
  {
    id: crypto.randomUUID(), title: 'User research interviews',
    status: 'done', createdAt: today - 14 * DAY, pinned: false,
    color: '#10B981', emoji: '🎯', priority: 'high',
    tags: ['Research'],
    endDay: today - 2 * DAY,
    description: 'Conducted 8 interviews with existing customers to identify pain points.',
  },
  {
    id: crypto.randomUUID(), title: 'Launch email campaign',
    status: 'done', createdAt: today - 8 * DAY, pinned: false,
    color: '#EC4899', emoji: '📧', priority: 'medium',
    tags: ['Marketing', 'Content'],
    endDay: today - 1 * DAY,
  },
]

interface AddSubTaskExtras {
  date?:        number
  startTime?:   string
  endTime?:     string
  description?: string
}

interface AddTodoExtras {
  status?:      TodoStatus
  color?:       string
  emoji?:       string
  startDay?:    number
  endDay?:      number
  priority?:    Priority
  tags?:        string[]
  description?: string
  attachments?: Attachment[]
}

export function useTodos() {
  const [state, dispatch] = useReducer(todosReducer, INITIAL_STATE)


  const hydratedRef = useRef(false)

  useEffect(() => {
    const saved = loadTodos()
    if (saved !== null) dispatch({ type: 'HYDRATE', payload: { todos: saved } })
    dispatch({ type: 'SYNC_STATUS', payload: { todayMs: new Date().setHours(0, 0, 0, 0) } })
    hydratedRef.current = true
  }, [])

  useEffect(() => {
    if (!hydratedRef.current) return
    saveTodos(state.todos)
  }, [state.todos])

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== 'todos:v1') return
      const saved = loadTodos()
      if (saved !== null) dispatch({ type: 'HYDRATE', payload: { todos: saved } })
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  return {
    todos:         state.todos,
    filteredTodos: selectFilteredTodos(state.todos, state.filter, state.query),
    counts:        selectCounts(state.todos),
    filter:        state.filter,
    query:         state.query,
    addTodo:      (title: string, extras?: AddTodoExtras) => dispatch({ type: 'ADD', payload: { title, ...extras } }),
    updateStatus: (id: string, status: TodoStatus) => dispatch({ type: 'UPDATE_STATUS', payload: { id, status } }),
    pinTodo:      (id: string)                 => dispatch({ type: 'PIN',           payload: { id } }),
    deleteTodo:   (id: string)                 => dispatch({ type: 'DELETE',        payload: { id } }),
    setFilter:           (filter: Filter)             => dispatch({ type: 'SET_FILTER',    payload: { filter } }),
    setSearch:           (query: string)              => dispatch({ type: 'SET_SEARCH',    payload: { query } }),
    addSubTask:          (parentId: string, title: string, extras?: AddSubTaskExtras) =>
      dispatch({ type: 'ADD_SUBTASK', payload: { parentId, title, ...extras } }),
    updateSubTaskStatus: (parentId: string, subId: string, status: TodoStatus) =>
      dispatch({ type: 'UPDATE_SUBTASK_STATUS', payload: { parentId, subId, status } }),
    deleteSubTask:       (parentId: string, subId: string) =>
      dispatch({ type: 'DELETE_SUBTASK', payload: { parentId, subId } }),
    updateTask: (id: string, updates: {
      title?: string; emoji?: string; startDay?: number; endDay?: number;
      priority?: Priority; tags?: string[]; description?: string; attachments?: Attachment[]
    }) => dispatch({ type: 'UPDATE_TASK', payload: { id, ...updates } }),
    importTodos:    (todos: Todo[]) => dispatch({ type: 'HYDRATE', payload: { todos } }),
    seedDemoTasks:  () => dispatch({ type: 'HYDRATE', payload: { todos: DEMO_TODOS } }),
  }
}
