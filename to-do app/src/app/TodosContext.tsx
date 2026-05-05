import { createContext, useContext, type ReactNode } from 'react'
import { useTodos } from '../features/todos/hooks/useTodos'

type TodosContextValue = ReturnType<typeof useTodos>

const TodosContext = createContext<TodosContextValue | null>(null)

export function TodosProvider({ children }: { children: ReactNode }) {
  const value = useTodos()
  return <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
}

export function useTodosContext(): TodosContextValue {
  const ctx = useContext(TodosContext)
  if (!ctx) throw new Error('useTodosContext must be used inside TodosProvider')
  return ctx
}
