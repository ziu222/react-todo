import React, { useState } from 'react'
import type { Todo, TodoStatus, Priority } from '../../features/todos/model/todoLogic'
import { calcProgress } from '../../features/todos/model/todoLogic'
import { highlightMatchingText } from '../../features/todos/utils/highlightMatchingText'
import TaskDetailModal from './TaskDetailModal'
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

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
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

function IconList() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )
}

function IconBell() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  )
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

function IconPaperclip() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.41 17.41a2 2 0 01-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

const STATUS_ICON: Record<TodoStatus, React.ReactElement> = {
  backlog:      <IconList />,
  todo:         <IconClock />,
  'in-progress': <IconPlay />,
  done:         <IconCheck />,
}

const fmt = (ms: number) =>
  new Date(ms).toLocaleDateString('en', { month: 'short', day: 'numeric' })

export default function KanbanCard({ todo, query, onUpdateStatus, onDelete, onPin }: KanbanCardProps) {
  const [detailOpen, setDetailOpen] = useState(false)
  const nextStatus = STATUS_NEXT[todo.status]
  const todayMs    = new Date().setHours(0, 0, 0, 0)
  const progress   = (todo.startDay != null && todo.endDay != null) || (todo.subTasks && todo.subTasks.length > 0)
    ? calcProgress(todo)
    : null
  const isOverdue  = todo.endDay != null && todo.endDay < todayMs && todo.status !== 'done'

  return (
    <>
    <article
      className={`kc-card${todo.pinned ? ' pinned' : ''}`}
      data-status={todo.status}
      onClick={() => setDetailOpen(true)}
      style={{ cursor: 'pointer' }}
    >

      {/* ── Left: status orb + dates ── */}
      <div className="kc-left">
        <div className="kc-orb" style={{ background: `${todo.color}1a`, color: todo.color }}>
          {STATUS_ICON[todo.status]}
        </div>
        <div className="kc-dates">
          {todo.startDay ? (
            <>
              <span className="kc-date-item">
                <span className="kc-date-lbl">Start</span>
                <span className="kc-date-val">{fmt(todo.startDay)}</span>
              </span>
              {todo.endDay && (
                <span className="kc-date-item">
                  <span className="kc-date-lbl">End</span>
                  <span className={`kc-date-val${isOverdue ? ' overdue' : ''}`}>{fmt(todo.endDay)}</span>
                </span>
              )}
            </>
          ) : (
            <span className="kc-date-item">
              <span className="kc-date-lbl">Created</span>
              <span className="kc-date-val">{fmt(todo.createdAt)}</span>
            </span>
          )}
        </div>
      </div>

      {/* ── Center: title + tags ── */}
      <div className="kc-body">
        <p className="kc-title">{highlightMatchingText(todo.title, query)}</p>
        <div className="kc-meta-row">
          {todo.tags?.slice(0, 2).map(t => (
            <span key={t} className="kc-tag">{t}</span>
          ))}
          {todo.attachments && todo.attachments.length > 0 && (
            <span className="kc-meta-item">
              <IconPaperclip />
              {todo.attachments.length}
            </span>
          )}
        </div>
      </div>

      {/* ── Progress ── */}
      {progress !== null && (
        <div className="kc-progress">
          <span className="kc-progress-pct">{progress}% complete</span>
          <div className="kc-progress-track">
            <div className="kc-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* ── Right: priority badge + actions ── */}
      <div className="kc-right">
        {todo.priority && (
          <span
            className="kc-priority-badge"
            style={{ color: PRIORITY_COLOR[todo.priority], background: `${PRIORITY_COLOR[todo.priority]}15` }}
          >
            <IconBell />
            {todo.priority}
          </span>
        )}
        <div className="kc-actions">
          <button
            className={`kc-btn${todo.pinned ? ' active' : ''}`}
            onClick={e => { e.stopPropagation(); onPin(todo.id) }}
            aria-label={todo.pinned ? 'Unpin' : 'Pin'}
          >
            <IconPin filled={todo.pinned} />
          </button>
          {nextStatus && (
            <button
              className="kc-btn"
              onClick={e => { e.stopPropagation(); onUpdateStatus(todo.id, nextStatus) }}
              aria-label={`Move to ${nextStatus}`}
            >
              <IconArrow />
            </button>
          )}
          <button
            className="kc-btn delete"
            onClick={e => { e.stopPropagation(); onDelete(todo.id) }}
            aria-label="Delete task"
          >
            <IconTrash />
          </button>
        </div>
      </div>

    </article>

    {detailOpen && (
      <TaskDetailModal
        todo={todo}
        onClose={() => setDetailOpen(false)}
        onUpdateStatus={onUpdateStatus}
        onDelete={onDelete}
        onPin={onPin}
      />
    )}
    </>
  )
}
