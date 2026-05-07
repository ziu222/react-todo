import type { Todo, TodoStatus, Priority } from '../../features/todos/model/todoLogic'
import { calcProgress } from '../../features/todos/model/todoLogic'
import './TaskDetailModal.css'

interface TaskDetailModalProps {
  todo:           Todo
  onClose:        () => void
  onUpdateStatus: (id: string, status: TodoStatus) => void
  onDelete:       (id: string) => void
  onEdit:         (todo: Todo) => void
}

const STATUS_NEXT: Partial<Record<TodoStatus, TodoStatus>> = {
  backlog:       'todo',
  todo:          'in-progress',
  'in-progress': 'done',
}

const STATUS_LABEL: Record<TodoStatus, string> = {
  backlog:       'Backlog',
  todo:          'To Do',
  'in-progress': 'In Progress',
  done:          'Done',
}

const PRIORITY_COLOR: Record<Priority, string> = {
  low:    '#10B981',
  medium: '#F59E0B',
  high:   '#EF4444',
}

const fmt = (ms: number) =>
  new Date(ms).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })

const fmtShort = (ms: number) =>
  new Date(ms).toLocaleDateString('en', { month: 'short', day: 'numeric' })

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
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

function IconEdit() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
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

function IconPaperclip() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.41 17.41a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

export default function TaskDetailModal({ todo, onClose, onUpdateStatus, onDelete, onEdit }: TaskDetailModalProps) {
  const todayMs    = new Date().setHours(0, 0, 0, 0)
  const progress   = (todo.startDay != null && todo.endDay != null) || (todo.subTasks && todo.subTasks.length > 0)
    ? calcProgress(todo)
    : null
  const isOverdue  = todo.endDay != null && todo.endDay < todayMs && todo.status !== 'done'
  const nextStatus = STATUS_NEXT[todo.status]

  function handleDelete() {
    onDelete(todo.id)
    onClose()
  }

  function handleAdvance() {
    if (nextStatus) {
      onUpdateStatus(todo.id, nextStatus)
      onClose()
    }
  }

  return (
    <div className="td-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="td-modal" role="dialog" aria-modal="true" aria-label="Task details">

        {/* ── Header ── */}
        <div className="td-header" style={{ borderLeftColor: todo.color }}>
          <div className="td-header-main">
            <span
              className="td-status-badge"
              style={{ background: `${todo.color}18`, color: todo.color }}
            >
              {STATUS_LABEL[todo.status]}
            </span>
            <h2 className="td-title">{todo.title}</h2>
          </div>
          <button className="td-close" onClick={onClose} aria-label="Close">
            <IconX />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="td-body">

          {/* Dates + progress */}
          {(todo.startDay || todo.endDay) && (
            <div className="td-section">
              <div className="td-date-row">
                {todo.startDay && (
                  <div className="td-date-block">
                    <span className="td-label">Start Day</span>
                    <span className="td-date-val">
                      <IconCalendar /> {fmtShort(todo.startDay)}
                    </span>
                  </div>
                )}
                {todo.endDay && (
                  <div className="td-date-block">
                    <span className="td-label">End Day</span>
                    <span className={`td-date-val${isOverdue ? ' overdue' : ''}`}>
                      <IconCalendar /> {fmtShort(todo.endDay)}
                    </span>
                  </div>
                )}
                {progress !== null && (
                  <div className="td-date-block td-progress-block">
                    <span className="td-label">Progress</span>
                    <span className="td-progress-pct">{progress}%</span>
                  </div>
                )}
              </div>
              {progress !== null && (
                <div className="td-progress-track">
                  <div className="td-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
          )}

          {/* Priority */}
          {todo.priority && (
            <div className="td-section td-row">
              <span className="td-label">Priority</span>
              <span
                className="td-priority"
                style={{ color: PRIORITY_COLOR[todo.priority], background: `${PRIORITY_COLOR[todo.priority]}15` }}
              >
                {todo.priority}
              </span>
            </div>
          )}

          {/* Tags */}
          {todo.tags && todo.tags.length > 0 && (
            <div className="td-section td-row">
              <span className="td-label">Tags</span>
              <div className="td-tags">
                {todo.tags.map(t => (
                  <span key={t} className="td-tag">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {todo.description && (
            <div className="td-section">
              <span className="td-label">Description</span>
              <p className="td-description">{todo.description}</p>
            </div>
          )}

          {/* Attachments */}
          {todo.attachments && todo.attachments.length > 0 && (
            <div className="td-section">
              <span className="td-label">Attachments ({todo.attachments.length})</span>
              <ul className="td-attachments">
                {todo.attachments.map((a, i) => (
                  <li key={i} className="td-attachment-item">
                    <span className="td-attachment-icon"><IconPaperclip /></span>
                    <span className="td-attachment-name">{a.name}</span>
                    {a.type.startsWith('image/') && (
                      <img src={a.data} alt={a.name} className="td-attachment-thumb" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Created */}
          <div className="td-section td-row">
            <span className="td-label">Created</span>
            <span className="td-meta">{fmt(todo.createdAt)}</span>
          </div>
        </div>

        {/* ── Footer actions ── */}
        <div className="td-footer">
          <button
            className="td-action-btn"
            onClick={() => { onEdit(todo); onClose() }}
            aria-label="Edit task"
          >
            <IconEdit />
            Edit
          </button>

          {nextStatus && (
            <button className="td-action-btn advance" onClick={handleAdvance}>
              <IconArrow />
              Move to {STATUS_LABEL[nextStatus]}
            </button>
          )}

          <button className="td-action-btn delete" onClick={handleDelete}>
            <IconTrash />
            Delete
          </button>
        </div>

      </div>
    </div>
  )
}
