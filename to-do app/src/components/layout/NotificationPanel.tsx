import { useEffect } from 'react'
import type { Todo } from '../../features/todos/model/todoLogic'
import './NotificationPanel.css'

interface NotificationPanelProps {
  overdue:      Todo[]
  dueToday:     Todo[]
  highPriority: Todo[]
  onClose:      () => void
}

const PRIORITY_LABEL: Record<string, string> = {
  high:   'High',
  medium: 'Med',
  low:    'Low',
}

const PRIORITY_CLASS: Record<string, string> = {
  high:   'notif-priority-high',
  medium: 'notif-priority-med',
  low:    'notif-priority-low',
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function NotifRow({ todo }: { todo: Todo }) {
  return (
    <div className="notif-row">
      <span className="notif-row-emoji">
        {todo.emoji ?? <span className="notif-row-dot" style={{ background: todo.color }} />}
      </span>
      <span className="notif-row-title">{todo.title}</span>
      <div className="notif-row-meta">
        {todo.endDay != null && (
          <span className="notif-row-date">{formatDate(todo.endDay)}</span>
        )}
        {todo.priority && (
          <span className={`notif-priority ${PRIORITY_CLASS[todo.priority] ?? ''}`}>
            {PRIORITY_LABEL[todo.priority] ?? todo.priority}
          </span>
        )}
      </div>
    </div>
  )
}

export default function NotificationPanel({ overdue, dueToday, highPriority, onClose }: NotificationPanelProps) {
  const isEmpty = overdue.length === 0 && dueToday.length === 0 && highPriority.length === 0

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      <div className="notif-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="notif-panel" role="dialog" aria-label="Notifications">
        <div className="notif-header">
          <span className="notif-header-title">Notifications</span>
          <button className="notif-close-btn" onClick={onClose} aria-label="Close notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isEmpty ? (
          <div className="notif-empty">
            <span className="notif-empty-icon">🎉</span>
            <p className="notif-empty-text">You're all caught up!</p>
            <p className="notif-empty-sub">No overdue or upcoming tasks</p>
          </div>
        ) : (
          <div className="notif-body">
            {overdue.length > 0 && (
              <section className="notif-section">
                <div className="notif-section-label notif-section-overdue">
                  Overdue
                  <span className="notif-section-count">{overdue.length}</span>
                </div>
                {overdue.map(t => <NotifRow key={t.id} todo={t} />)}
              </section>
            )}

            {dueToday.length > 0 && (
              <section className="notif-section">
                <div className="notif-section-label notif-section-today">
                  Due Today
                  <span className="notif-section-count">{dueToday.length}</span>
                </div>
                {dueToday.map(t => <NotifRow key={t.id} todo={t} />)}
              </section>
            )}

            {highPriority.length > 0 && (
              <section className="notif-section">
                <div className="notif-section-label notif-section-high">
                  High Priority
                  <span className="notif-section-count">{highPriority.length}</span>
                </div>
                {highPriority.map(t => <NotifRow key={t.id} todo={t} />)}
              </section>
            )}
          </div>
        )}
      </div>
    </>
  )
}
