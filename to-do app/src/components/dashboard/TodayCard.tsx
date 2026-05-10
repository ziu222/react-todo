import { useState } from 'react'
import type { Todo, TodoStatus, Priority } from '../../features/todos/model/todoLogic'
import { calcProgress, STATUS_LABEL } from '../../features/todos/model/todoLogic'
import TaskDetailModal from '../kanban/TaskDetailModal'
import './TodayCard.css'

interface TodayCardProps {
  todo:           Todo
  onEdit:         (todo: Todo) => void
  onUpdateStatus: (id: string, status: TodoStatus) => void
  onDelete:       (id: string) => void
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

const fmt = (ms: number) =>
  new Date(ms).toLocaleDateString('en', { month: 'short', day: 'numeric' })

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
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

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
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

export default function TodayCard({ todo, onEdit, onUpdateStatus, onDelete }: TodayCardProps) {
  const [detailOpen, setDetailOpen] = useState(false)

  const color      = todo.color ?? '#8B5CF6'
  const nextStatus = STATUS_NEXT[todo.status]
  const todayMs    = new Date().setHours(0, 0, 0, 0)
  const isOverdue  = todo.endDay != null && todo.endDay < todayMs && todo.status !== 'done'
  const progress   = (todo.startDay != null && todo.endDay != null) || (todo.subTasks?.length ?? 0) > 0
    ? calcProgress(todo)
    : null

  return (
    <>
      <article
        className="tc-card"
        style={{ '--tc-color': color } as React.CSSProperties}
        onClick={() => setDetailOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setDetailOpen(true)}
      >
        {/* Title row */}
        <div className="tc-top">
          <p className="tc-title">
            {todo.emoji && <span className="tc-emoji">{todo.emoji}</span>}
            {todo.title}
          </p>
          <span
            className="tc-status-badge"
            style={{ background: `${color}18`, color }}
          >
            {STATUS_LABEL[todo.status]}
          </span>
        </div>

        {/* Meta row */}
        <div className="tc-meta">
          <span className={`tc-date${isOverdue ? ' overdue' : ''}`}>
            <IconCalendar />
            {todo.startDay
              ? `${fmt(todo.startDay)}${todo.endDay ? ` → ${fmt(todo.endDay)}` : ''}`
              : `Created ${fmt(todo.createdAt)}`
            }
          </span>
          {todo.priority && (
            <>
              <span
                className="tc-priority-dot"
                style={{ background: PRIORITY_COLOR[todo.priority] }}
                title={todo.priority}
              />
              <span className="tc-priority-label" style={{ color: PRIORITY_COLOR[todo.priority] }}>
                {todo.priority}
              </span>
            </>
          )}
        </div>

        {/* Progress bar */}
        {progress !== null && (
          <div className="tc-progress-bar">
            <div className="tc-progress-fill" style={{ width: `${progress}%`, background: color }} />
          </div>
        )}

        {/* Hover actions */}
        <div className="tc-actions" onClick={e => e.stopPropagation()}>
          <button
            className="tc-btn"
            onClick={() => onEdit(todo)}
            aria-label="Edit task"
          >
            <IconEdit />
            Edit
          </button>
          {nextStatus && (
            <button
              className="tc-btn primary"
              onClick={() => onUpdateStatus(todo.id, nextStatus)}
              aria-label={`Move to ${nextStatus}`}
            >
              <IconCheck />
              {nextStatus === 'done' ? 'Done' : 'Advance'}
            </button>
          )}
          <button
            className="tc-btn delete"
            onClick={() => onDelete(todo.id)}
            aria-label="Delete task"
          >
            <IconTrash />
          </button>
        </div>
      </article>

      {detailOpen && (
        <TaskDetailModal
          todo={todo}
          onClose={() => setDetailOpen(false)}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
          onEdit={t => { setDetailOpen(false); onEdit(t) }}
        />
      )}
    </>
  )
}
