import type { Todo, TodoStatus } from '../model/todoLogic'

const STORAGE_KEY = 'todos:v1'

const VALID_STATUSES: TodoStatus[] = ['backlog', 'todo', 'in-progress', 'done']

function isValidTodo(item: unknown): item is Todo {
  if (typeof item !== 'object' || item === null) return false
  const t = item as Record<string, unknown>
  if (
    typeof t.id        !== 'string'  ||
    typeof t.title     !== 'string'  ||
    typeof t.createdAt !== 'number'  ||
    typeof t.pinned    !== 'boolean' ||
    typeof t.color     !== 'string'  ||
    typeof t.status    !== 'string'  ||
    !VALID_STATUSES.includes(t.status as TodoStatus)
  ) return false
  // optional fields — accept if present and correct type, or absent
  if (t.dueDate     !== undefined && typeof t.dueDate     !== 'number')  return false
  if (t.priority    !== undefined && !['low','medium','high'].includes(t.priority as string)) return false
  if (t.tags        !== undefined && !Array.isArray(t.tags))             return false
  if (t.description !== undefined && typeof t.description !== 'string')  return false
  if (t.progress    !== undefined && typeof t.progress    !== 'number')  return false
  if (t.attachments !== undefined && !Array.isArray(t.attachments))      return false
  return true
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
