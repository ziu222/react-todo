import { useState, useRef, useEffect } from 'react'
import { useTodosContext } from '../../app/TodosContext'
import type { Todo, TodoStatus } from '../../features/todos/model/todoLogic'
import KanbanColumn from './KanbanColumn'
import AddTaskModal from './AddTaskModal'
import './KanbanBoard.css'

const COLUMNS: { status: TodoStatus; label: string; color: string }[] = [
  { status: 'backlog',      label: 'Backlog',     color: '#6B7280' },
  { status: 'todo',         label: 'To Do',       color: 'var(--status-todo)'        },
  { status: 'in-progress',  label: 'In Progress', color: 'var(--status-in-progress)' },
  { status: 'done',         label: 'Done',        color: 'var(--status-done)'        },
]

export default function KanbanBoard() {
  const { filteredTodos, query, addTodo, updateStatus, deleteTodo, updateTask } = useTodosContext()
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const board = boardRef.current
    if (!board) return
    const columns = board.querySelectorAll('.kanban-column')
    const dotsContainer = board.nextElementSibling
    const dots = dotsContainer?.querySelectorAll('.kanban-dot')
    if (!dots || dots.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const idx = Array.from(columns).indexOf(entry.target as HTMLElement)
          if (idx === -1) return
          dots[idx]?.classList.toggle('active', entry.isIntersecting)
        })
      },
      { root: board, threshold: 0.5 }
    )
    columns.forEach(col => observer.observe(col))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div className="kanban-board" ref={boardRef}>
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            label={col.label}
            accentColor={col.color}
            todos={filteredTodos.filter(t => t.status === col.status)}
            query={query}
            onAdd={({ title, ...extras }) => addTodo(title, extras)}
            onUpdateStatus={updateStatus}
            onDelete={deleteTodo}
            onEdit={setEditingTodo}
          />
        ))}
      </div>

      <div className="kanban-dots" aria-hidden="true">
        {COLUMNS.map(col => (
          <span key={col.status} className="kanban-dot" />
        ))}
      </div>

      {editingTodo && (
        <AddTaskModal
          initialStatus={editingTodo.status}
          initialTodo={editingTodo}
          onClose={() => setEditingTodo(null)}
          onSubmit={() => {}}
          onUpdate={updates => updateTask(editingTodo.id, updates)}
        />
      )}
    </>
  )
}
