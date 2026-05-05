import type { Todo, TodoStatus } from '../model/todoLogic'

const STORAGE_KEY = 'todos:v1'

const VALID_STATUSES: TodoStatus[] = ['todo', 'in-progress', 'done']

function isValidTodo(item: unknown): item is Todo {
  if (typeof item !== 'object' || item === null) return false
  const t = item as Record<string, unknown>
  return (
    typeof t.id        === 'string' &&
    typeof t.title     === 'string' &&
    typeof t.createdAt === 'number' &&
    typeof t.pinned    === 'boolean' &&
    typeof t.color     === 'string' &&
    typeof t.status    === 'string' &&
    VALID_STATUSES.includes(t.status as TodoStatus)
  )
}

export function loadTodos(): Todo[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.every(isValidTodo)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  } catch {
    // quota exceeded or storage blocked in private browsing — degrade silently
  }
}
