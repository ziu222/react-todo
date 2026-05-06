import { useState, useEffect, useRef } from 'react'
import type { Todo, TodoStatus, SubTask } from '../../features/todos/model/todoLogic'
import { toMidnight, STATUS_LABEL } from '../../features/todos/model/todoLogic'
import './DayView.css'

interface DayViewProps {
  selectedDayMs:         number
  todos:                 Todo[]
  onAddSubTask:          (parentId: string, title: string, date: number) => void
  onUpdateSubTaskStatus: (parentId: string, subId: string, status: TodoStatus) => void
  onDeleteSubTask:       (parentId: string, subId: string) => void
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDayHeader(ms: number): string {
  const d = new Date(ms)
  return `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
      <path d="M2 6l2.5 2.5L10 3" />
    </svg>
  )
}

// ── Internal DayTaskCard ────────────────────────────────────────────────────

interface DayTaskCardProps {
  todo:                  Todo
  selectedDayMs:         number
  onAddSubTask:          (parentId: string, title: string, date: number) => void
  onUpdateSubTaskStatus: (parentId: string, subId: string, status: TodoStatus) => void
  onDeleteSubTask:       (parentId: string, subId: string) => void
}

function DayTaskCard({ todo, selectedDayMs, onAddSubTask, onUpdateSubTaskStatus, onDeleteSubTask }: DayTaskCardProps) {
  const [expanded, setExpanded]           = useState(false)
  const [addingSubTask, setAddingSubTask] = useState(false)
  const [newSubTitle, setNewSubTitle]     = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Sub-tasks that belong to this day (undated sub-tasks show on all active days)
  const daySubTasks: SubTask[] = (todo.subTasks ?? []).filter(s =>
    s.date === undefined || toMidnight(s.date) === selectedDayMs
  )

  // Earliest sub-task time for the time range label
  const firstTime = daySubTasks.find(s => s.startTime)
  const timeLabel = firstTime
    ? `${firstTime.startTime}${firstTime.endTime ? ` – ${firstTime.endTime}` : ''}`
    : 'All day'

  useEffect(() => {
    if (addingSubTask) inputRef.current?.focus()
  }, [addingSubTask])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const val = newSubTitle.trim()
      if (val) onAddSubTask(todo.id, val, selectedDayMs)
      setNewSubTitle('')
      setAddingSubTask(false)
    }
    if (e.key === 'Escape') {
      setNewSubTitle('')
      setAddingSubTask(false)
    }
  }

  function toggleSubStatus(sub: SubTask) {
    const next: TodoStatus = sub.status === 'done' ? 'todo' : 'done'
    onUpdateSubTaskStatus(todo.id, sub.id, next)
  }

  const color = todo.color ?? '#8B5CF6'

  return (
    <div
      className={`dv-card${todo.status === 'in-progress' ? ' in-progress' : ''}`}
      style={{ '--card-accent': color } as React.CSSProperties}
    >
      {/* Header row: status badge + time range */}
      <div className="dv-card-header">
        <span
          className="dv-status-badge"
          style={{ background: `${color}18`, color }}
        >
          {STATUS_LABEL[todo.status]}
        </span>
        <span className="dv-time-range">{timeLabel}</span>
      </div>

      {/* Title */}
      <p className="dv-card-title">{todo.title}</p>

      {/* Description (2-line clamp) */}
      {todo.description && (
        <p className="dv-card-desc">{todo.description}</p>
      )}

      {/* Sub-task toggle */}
      <button
        className="dv-subtask-toggle"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        <span className={`dv-chevron${expanded ? ' open' : ''}`}><ChevronDown /></span>
        {daySubTasks.length} sub-task{daySubTasks.length !== 1 ? 's' : ''}
      </button>

      {/* Sub-task list */}
      {expanded && (
        <ul className="dv-subtask-list">
          {daySubTasks.map(sub => (
            <li key={sub.id} className="dv-subtask-row">
              <button
                className={`dv-subtask-check${sub.status === 'done' ? ' done' : ''}`}
                onClick={() => toggleSubStatus(sub)}
                aria-label={sub.status === 'done' ? 'Mark incomplete' : 'Mark complete'}
              >
                {sub.status === 'done' && <CheckIcon />}
              </button>
              <span className={`dv-subtask-title${sub.status === 'done' ? ' done' : ''}`}>
                {sub.title}
              </span>
              {sub.startTime && (
                <span className="dv-subtask-time">
                  {sub.startTime}{sub.endTime ? ` – ${sub.endTime}` : ''}
                </span>
              )}
              <button
                className="dv-subtask-delete"
                onClick={() => onDeleteSubTask(todo.id, sub.id)}
                aria-label="Delete sub-task"
              >
                ×
              </button>
            </li>
          ))}

          {/* Notion-style inline add */}
          {addingSubTask ? (
            <li className="dv-subtask-add-row">
              <input
                ref={inputRef}
                className="dv-subtask-input"
                type="text"
                placeholder="Sub-task name… Enter to confirm, Esc to cancel"
                value={newSubTitle}
                onChange={e => setNewSubTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={500}
              />
            </li>
          ) : (
            <li>
              <button
                className="dv-add-subtask-btn"
                onClick={() => setAddingSubTask(true)}
              >
                + Add sub-task
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

// ── DayView panel ──────────────────────────────────────────────────────────

export default function DayView({ selectedDayMs, todos, onAddSubTask, onUpdateSubTaskStatus, onDeleteSubTask }: DayViewProps) {
  const activeTasks = todos.filter(t => {
    const start = toMidnight(t.startDay ?? t.createdAt)
    const end   = toMidnight(t.endDay   ?? t.startDay ?? t.createdAt)
    return start <= selectedDayMs && selectedDayMs <= end
  })

  return (
    <aside className="dv-panel">
      <header className="dv-header">
        <span className="dv-date-label">{formatDayHeader(selectedDayMs)}</span>
        <span className="dv-task-count">{activeTasks.length} task{activeTasks.length !== 1 ? 's' : ''}</span>
      </header>

      <div className="dv-scroll">
        {activeTasks.length === 0 ? (
          <p className="dv-empty">No tasks on this day.</p>
        ) : (
          activeTasks.map(todo => (
            <DayTaskCard
              key={todo.id}
              todo={todo}
              selectedDayMs={selectedDayMs}
              onAddSubTask={onAddSubTask}
              onUpdateSubTaskStatus={onUpdateSubTaskStatus}
              onDeleteSubTask={onDeleteSubTask}
            />
          ))
        )}
      </div>
    </aside>
  )
}
