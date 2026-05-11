import { useState } from 'react'
import type { Todo, TodoStatus, Priority, Attachment } from '../../features/todos/model/todoLogic'
import KanbanCard from './KanbanCard'
import AddTaskModal from './AddTaskModal'
import './KanbanColumn.css'

export interface AddTaskData {
  title:        string
  status:       TodoStatus
  startDay?:    number
  endDay?:      number
  priority?:    Priority
  tags?:        string[]
  description?: string
  attachments?: Attachment[]
}

interface KanbanColumnProps {
  status:          TodoStatus
  label:           string
  accentColor:     string
  todos:           Todo[]
  query:           string
  selectedIds:     Set<string>
  onToggleSelect:  (id: string) => void
  onAdd:           (data: AddTaskData) => void
  onUpdateStatus:  (id: string, status: TodoStatus) => void
  onDelete:        (id: string) => void
  onEdit:          (todo: Todo) => void
}

export default function KanbanColumn({
  status, label, accentColor, todos, query,
  selectedIds, onToggleSelect,
  onAdd, onUpdateStatus, onDelete, onEdit,
}: KanbanColumnProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section
      className="kanban-column"
      data-status={status}
      style={{ '--col-color': accentColor } as React.CSSProperties}
    >
      <header className="kanban-column-header">
        <div className="kanban-column-label">
          <span className="kanban-column-dot" style={{ background: accentColor }} />
          <span className="kanban-column-name">{label}</span>
          <span className="kanban-column-count">{todos.length}</span>
        </div>
        <button
          className="kanban-column-add-btn"
          onClick={() => setModalOpen(true)}
          aria-label={`Add task to ${label}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </header>

      <ul className="kanban-column-list">
        {todos.length === 0 && (
          <li className="kanban-column-empty">
            <span className="kanban-column-empty-icon">
              {status === 'backlog' ? '📋' : status === 'todo' ? '✅' : status === 'in-progress' ? '⚡' : '🎉'}
            </span>
            <span className="kanban-column-empty-text">
              {status === 'backlog' ? 'No backlog items' : status === 'todo' ? "You're all caught up" : status === 'in-progress' ? 'Nothing in progress' : 'No completed tasks yet'}
            </span>
            <span className="kanban-column-empty-sub">
              {status === 'done' ? 'Finish a task to see it here' : 'Hit + to add one'}
            </span>
          </li>
        )}
        {todos.map(todo => (
          <li key={todo.id}>
            <KanbanCard
              todo={todo}
              query={query}
              isSelected={selectedIds.has(todo.id)}
              onToggleSelect={onToggleSelect}
              onUpdateStatus={onUpdateStatus}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </li>
        ))}
      </ul>

      {modalOpen && (
        <AddTaskModal
          initialStatus={status}
          onClose={() => setModalOpen(false)}
          onSubmit={data => onAdd(data)}
        />
      )}
    </section>
  )
}
