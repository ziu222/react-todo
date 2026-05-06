import { useReducer, useEffect, useRef } from 'react'
import {
  todosReducer,
  INITIAL_STATE,
  selectFilteredTodos,
  selectCounts,
} from '../model/todoLogic'
import { loadTodos, saveTodos } from '../api/storage'
import type { Filter, TodoStatus, Priority, Attachment } from '../model/todoLogic'

interface AddTodoExtras {
  status?:      TodoStatus
  color?:       string
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
    hydratedRef.current = true
  }, [])

  useEffect(() => {
    if (!hydratedRef.current) return
    saveTodos(state.todos)
  }, [state.todos])

  return {
    filteredTodos: selectFilteredTodos(state.todos, state.filter, state.query),
    counts:        selectCounts(state.todos),
    filter:        state.filter,
    query:         state.query,
    addTodo:      (title: string, extras?: AddTodoExtras) => dispatch({ type: 'ADD', payload: { title, ...extras } }),
    updateStatus: (id: string, status: TodoStatus) => dispatch({ type: 'UPDATE_STATUS', payload: { id, status } }),
    pinTodo:      (id: string)                 => dispatch({ type: 'PIN',           payload: { id } }),
    deleteTodo:   (id: string)                 => dispatch({ type: 'DELETE',        payload: { id } }),
    setFilter:    (filter: Filter)             => dispatch({ type: 'SET_FILTER',    payload: { filter } }),
    setSearch:    (query: string)              => dispatch({ type: 'SET_SEARCH',    payload: { query } }),
  }
}
