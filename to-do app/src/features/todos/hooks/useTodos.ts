import { useReducer, useEffect, useRef } from 'react'
import {
  todosReducer,
  INITIAL_STATE,
  selectFilteredTodos,
  selectCounts,
} from '../model/todoLogic'
import { loadTodos, saveTodos } from '../api/storage'
import type { Filter, TodoStatus, Priority, Attachment, Todo } from '../model/todoLogic'

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
    importTodos: (todos: Todo[]) => dispatch({ type: 'HYDRATE', payload: { todos } }),
  }
}
