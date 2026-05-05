import type { Todo, TodoStatus } from '../../features/todos/model/todoLogic'
import { highlightMatchingText } from '../../features/todos/utils/highlightMatchingText'
import './KanbanCard.css'

interface KanbanCardProps {
  todo:           Todo
  query:          string
  onUpdateStatus: (id: string, status: TodoStatus) => void
  onDelete:       (id: string) => void
  onPin:          (id: string) => void
}

const STATUS_NEXT: Partial<Record<TodoStatus, TodoStatus>> = {
  backlog:      'todo',
  todo:         'in-progress',
  'in-progress': 'done',
}

function IconPin({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3 7h6l-5 4 2 7-6-4-6 4 2-7L3 9h6l3-7z" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
    </svg>
  )
}

function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export default function KanbanCard({ todo, query, onUpdateStatus, onDelete, onPin }: KanbanCardProps) {
  const date      = new Date(todo.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })
  const nextStatus = STATUS_NEXT[todo.status]

  return (
    <article className={`kanban-card${todo.pinned ? ' pinned' : ''}`} data-status={todo.status}>
      <div className="kanban-card-chip" style={{ background: `${todo.color}22`, color: todo.color }}>
        <span className="kanban-card-dot" style={{ background: todo.color }} />
        {todo.status}
      </div>

      <p className="kanban-card-title">
        {highlightMatchingText(todo.title, query)}
      </p>

      <div className="kanban-card-footer">
        <span className="kanban-card-date">{date}</span>

        <div className="kanban-card-actions">
          <button
            className={`kanban-card-btn pin${todo.pinned ? ' active' : ''}`}
            onClick={() => onPin(todo.id)}
            aria-label={todo.pinned ? 'Unpin' : 'Pin'}
          >
            <IconPin filled={todo.pinned} />
          </button>

          {nextStatus && (
            <button
              className="kanban-card-btn advance"
              onClick={() => onUpdateStatus(todo.id, nextStatus)}
              aria-label={`Move to ${nextStatus}`}
            >
              <IconArrow />
            </button>
          )}

          <button
            className="kanban-card-btn delete"
            onClick={() => onDelete(todo.id)}
            aria-label="Delete task"
          >
            <IconTrash />
          </button>
        </div>
      </div>
    </article>
  )
}
