import type { Todo, TodoStatus, Priority } from '../../features/todos/model/todoLogic'
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
  backlog:       'todo',
  todo:          'in-progress',
  'in-progress': 'done',
}

const PRIORITY_COLOR: Record<Priority, string> = {
  low:    '#10B981',
  medium: '#F59E0B',
  high:   '#EF4444',
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

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

export default function KanbanCard({ todo, query, onUpdateStatus, onDelete, onPin }: KanbanCardProps) {
  const nextStatus  = STATUS_NEXT[todo.status]
  const chipLabel   = todo.tags?.[0] ?? todo.status
  const extraTags   = todo.tags && todo.tags.length > 1 ? todo.tags.slice(1) : []
  const isOverdue   = todo.dueDate && todo.dueDate < Date.now() && todo.status !== 'done'
  const dueDateStr  = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })
    : null
  const createdStr  = new Date(todo.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })

  return (
    <article className={`kanban-card${todo.pinned ? ' pinned' : ''}`} data-status={todo.status}>

      {/* Category chip + priority */}
      <div className="kanban-card-chips">
        <span className="kanban-card-chip" style={{ background: `${todo.color}22`, color: todo.color }}>
          <span className="kanban-card-dot" style={{ background: todo.color }} />
          {chipLabel}
        </span>
        {todo.priority && (
          <span
            className="kanban-card-priority"
            style={{ color: PRIORITY_COLOR[todo.priority], background: `${PRIORITY_COLOR[todo.priority]}18` }}
          >
            {todo.priority}
          </span>
        )}
      </div>

      {/* Title */}
      <p className="kanban-card-title">
        {highlightMatchingText(todo.title, query)}
      </p>

      {/* Additional tags */}
      {extraTags.length > 0 && (
        <div className="kanban-card-tags">
          {extraTags.map(t => (
            <span key={t} className="kanban-card-tag">{t}</span>
          ))}
        </div>
      )}

      {/* Progress bar */}
      {todo.progress != null && todo.progress > 0 && (
        <div className="kanban-card-progress">
          <div className="kanban-card-progress-track">
            <div className="kanban-card-progress-bar" style={{ width: `${todo.progress}%` }} />
          </div>
          <span className="kanban-card-progress-label">{todo.progress}%</span>
        </div>
      )}

      {/* Footer */}
      <div className="kanban-card-footer">
        <span className={`kanban-card-date${isOverdue ? ' overdue' : ''}`}>
          <IconCalendar />
          {dueDateStr ?? createdStr}
        </span>

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
