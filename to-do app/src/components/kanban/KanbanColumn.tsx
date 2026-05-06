import { useState } from 'react'
import type { Todo, TodoStatus, Priority, Attachment } from '../../features/todos/model/todoLogic'
import KanbanCard from './KanbanCard'
import AddTaskModal from './AddTaskModal'
import './KanbanColumn.css'

export interface AddTaskData {
  title:        string
  status:       TodoStatus
  dueDate?:     number
  priority?:    Priority
  tags?:        string[]
  description?: string
  progress?:    number
  attachments?: Attachment[]
}

interface KanbanColumnProps {
  status:         TodoStatus
  label:          string
  accentColor:    string
  todos:          Todo[]
  query:          string
  onAdd:          (data: AddTaskData) => void
  onUpdateStatus: (id: string, status: TodoStatus) => void
  onDelete:       (id: string) => void
  onPin:          (id: string) => void
}

export default function KanbanColumn({
  status, label, accentColor, todos, query,
  onAdd, onUpdateStatus, onDelete, onPin,
}: KanbanColumnProps) {
  const [modalOpen, setModalOpen] = useState(false)

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
