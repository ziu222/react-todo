import { useState } from 'react'
import type { Todo, TodoStatus } from '../../features/todos/model/todoLogic'
import KanbanCard from './KanbanCard'
import './KanbanColumn.css'

interface KanbanColumnProps {
  status:         TodoStatus
  label:          string
  accentColor:    string
  todos:          Todo[]
  query:          string
  onAdd:          (title: string) => void
  onUpdateStatus: (id: string, status: TodoStatus) => void
  onDelete:       (id: string) => void
  onPin:          (id: string) => void
}

export default function KanbanColumn({
  status, label, accentColor, todos, query,
  onAdd, onUpdateStatus, onDelete, onPin,
}: KanbanColumnProps) {
  const [adding, setAdding] = useState(false)
  const [input,  setInput]  = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    onAdd(input.trim())
    setInput('')
    setAdding(false)
  }

  return (
    <section className="kanban-column" data-status={status}>
      <header className="kanban-column-header">
        <div className="kanban-column-label">
          <span className="kanban-column-dot" style={{ background: accentColor }} />
          <span className="kanban-column-name">{label}</span>
          <span className="kanban-column-count">{todos.length}</span>
        </div>
        <button
          className="kanban-column-add-btn"
          onClick={() => setAdding(v => !v)}
          aria-label={`Add task to ${label}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </header>

      {adding && (
        <form className="kanban-column-form" onSubmit={handleSubmit}>
          <input
            autoFocus
            className="kanban-column-input"
            type="text"
            placeholder="Task title…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && setAdding(false)}
            maxLength={500}
          />
          <div className="kanban-column-form-actions">
            <button type="submit" className="kanban-form-btn primary">Add</button>
            <button type="button" className="kanban-form-btn" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </form>
      )}

      <ul className="kanban-column-list">
        {todos.length === 0 && !adding && (
          <li className="kanban-column-empty">No tasks here</li>
        )}
        {todos.map(todo => (
          <li key={todo.id}>
            <KanbanCard
              todo={todo}
              query={query}
              onUpdateStatus={onUpdateStatus}
              onDelete={onDelete}
              onPin={onPin}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
