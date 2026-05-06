import { useState, useEffect, useRef } from 'react'
import type { Todo, TodoStatus, SubTask } from '../../features/todos/model/todoLogic'
import { toMidnight, STATUS_LABEL, calcProgress } from '../../features/todos/model/todoLogic'
import './DayView.css'

interface DayViewProps {
  selectedDayMs:         number
  todos:                 Todo[]
  onAddSubTask:          (parentId: string, title: string, date: number) => void
  onUpdateSubTaskStatus: (parentId: string, subId: string, status: TodoStatus) => void
  onDeleteSubTask:       (parentId: string, subId: string) => void
}

const DAY_NAMES  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatDayHeader(ms: number) {
  const d = new Date(ms)
  return { day: DAY_NAMES[d.getDay()], date: `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}` }
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

// ── DayTaskCard ─────────────────────────────────────────────────────────────

interface DayTaskCardProps {
  todo:                  Todo
  selectedDayMs:         number
  onAddSubTask:          (parentId: string, title: string, date: number) => void
  onUpdateSubTaskStatus: (parentId: string, subId: string, status: TodoStatus) => void
  onDeleteSubTask:       (parentId: string, subId: string) => void
}

function DayTaskCard({ todo, selectedDayMs, onAddSubTask, onUpdateSubTaskStatus, onDeleteSubTask }: DayTaskCardProps) {
  const [expanded,     setExpanded]     = useState(false)
  const [addingSubTask, setAddingSubTask] = useState(false)
  const [newSubTitle,  setNewSubTitle]  = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const daySubTasks: SubTask[] = (todo.subTasks ?? []).filter(s =>
    s.date === undefined || toMidnight(s.date) === selectedDayMs
  )

  const doneCount  = daySubTasks.filter(s => s.status === 'done').length
  const totalCount = daySubTasks.length
  const progress   = calcProgress(todo)

  const firstTime  = daySubTasks.find(s => s.startTime)
  const timeLabel  = firstTime
    ? `${firstTime.startTime}${firstTime.endTime ? ` – ${firstTime.endTime}` : ''}`
    : 'All day'

  const color  = todo.color ?? '#8B5CF6'
  const isDone = todo.status === 'done'

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
    onUpdateSubTaskStatus(todo.id, sub.id, sub.status === 'done' ? 'todo' : 'done')
  }

  return (
    <div className={`dv-card${isDone ? ' done' : ''}`} style={{ '--card-color': color } as React.CSSProperties}>
      {/* Color accent bar at top */}
      <div className="dv-card-bar" />

      {/* Header: status badge + time */}
      <div className="dv-card-head">
        <span className="dv-status-badge" style={{ background: `${color}18`, color }}>
          {STATUS_LABEL[todo.status]}
        </span>
        <span className="dv-time-label">{timeLabel}</span>
      </div>

      {/* Title */}
      <p className="dv-card-title">{todo.title}</p>

      {/* Description */}
      {todo.description && (
        <p className="dv-card-desc">{todo.description}</p>
      )}

      {/* Progress bar */}
      <div className="dv-progress-row">
        <div className="dv-progress-track">
          <div className="dv-progress-fill" style={{ width: `${progress}%`, background: color }} />
        </div>
        <span className="dv-progress-pct">{progress}%</span>
      </div>

      {/* Sub-task toggle */}
      <button
        className="dv-subtask-toggle"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        <span className="dv-chevron"><ChevronIcon open={expanded} /></span>
        {totalCount > 0 ? `${doneCount}/${totalCount} sub-tasks` : '0 sub-tasks'}
      </button>

      {/* Sub-task list */}
      {expanded && (
        <ul className="dv-subtask-list">
          {daySubTasks.map(sub => (
            <li key={sub.id} className="dv-subtask-row">
              <button
                className={`dv-check${sub.status === 'done' ? ' done' : ''}`}
                style={{ '--check-color': color } as React.CSSProperties}
                onClick={() => toggleSubStatus(sub)}
                aria-label={sub.status === 'done' ? 'Mark incomplete' : 'Mark complete'}
              >
                {sub.status === 'done' && (
                  <svg viewBox="0 0 10 10" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <path d="M2 5l2.5 2.5L8 3" />
                  </svg>
                )}
              </button>
              <span className={`dv-sub-title${sub.status === 'done' ? ' done' : ''}`}>{sub.title}</span>
              {sub.startTime && (
                <span className="dv-sub-time">{sub.startTime}{sub.endTime ? ` – ${sub.endTime}` : ''}</span>
              )}
              <button
                className="dv-sub-del"
                onClick={() => onDeleteSubTask(todo.id, sub.id)}
                aria-label="Delete"
              >×</button>
            </li>
          ))}

          {!isDone && (
            addingSubTask ? (
              <li className="dv-add-row">
                <input
                  ref={inputRef}
                  className="dv-add-input"
                  type="text"
                  placeholder="Sub-task name… Enter ✓  Esc ✕"
                  value={newSubTitle}
                  onChange={e => setNewSubTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={500}
                />
              </li>
            ) : (
              <li>
                <button className="dv-add-btn" onClick={() => setAddingSubTask(true)}>
                  + Add sub-task
                </button>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  )
}

// ── DayView panel ────────────────────────────────────────────────────────────

export default function DayView({ selectedDayMs, todos, onAddSubTask, onUpdateSubTaskStatus, onDeleteSubTask }: DayViewProps) {
  const activeTasks = todos.filter(t => {
    const start = toMidnight(t.startDay ?? t.createdAt)
    const end   = toMidnight(t.endDay   ?? t.startDay ?? t.createdAt)
    return start <= selectedDayMs && selectedDayMs <= end
  })

  const { day, date } = formatDayHeader(selectedDayMs)
  const isToday = selectedDayMs === new Date().setHours(0,0,0,0)

  return (
    <aside className="dv-panel">
      <header className="dv-header">
        <div className="dv-header-day">{day}</div>
        <div className="dv-header-date">
          {date}
          {isToday && <span className="dv-today-chip">Today</span>}
        </div>
        <div className="dv-header-count">{activeTasks.length} task{activeTasks.length !== 1 ? 's' : ''}</div>
      </header>

      <div className="dv-scroll">
        {activeTasks.length === 0 ? (
          <div className="dv-empty">
            <span className="dv-empty-icon">📅</span>
            <p>No tasks on this day</p>
          </div>
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
