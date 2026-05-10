import { useState, useEffect, useRef } from 'react'
import type { Todo, TodoStatus, SubTask } from '../../features/todos/model/todoLogic'
import { toMidnight, STATUS_LABEL, calcProgress } from '../../features/todos/model/todoLogic'
import './DayView.css'

interface DayViewProps {
  selectedDayMs:         number
  todos:                 Todo[]
  onAddSubTask:          (parentId: string, title: string, date: number, startTime?: string, endTime?: string, category?: string) => void
  onUpdateSubTaskStatus: (parentId: string, subId: string, status: TodoStatus) => void
  onDeleteSubTask:       (parentId: string, subId: string) => void
}

const DAY_NAMES   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatDayHeader(ms: number) {
  const d = new Date(ms)
  return { day: DAY_NAMES[d.getDay()], date: `${MONTH_SHORT[d.getMonth()]} ${d.getDate()}` }
}

function parseHHMM(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + (m ?? 0)
}

function calcSubTaskTimeProgress(sub: SubTask): number {
  if (!sub.startTime || !sub.endTime) return 0
  const now  = new Date()
  const nowM = now.getHours() * 60 + now.getMinutes()
  const s    = parseHHMM(sub.startTime)
  const e    = parseHHMM(sub.endTime)
  if (nowM <= s) return 0
  if (nowM >= e) return 100
  return Math.round(((nowM - s) / (e - s)) * 100)
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
  onAddSubTask:          (parentId: string, title: string, date: number, startTime?: string, endTime?: string, category?: string) => void
  onUpdateSubTaskStatus: (parentId: string, subId: string, status: TodoStatus) => void
  onDeleteSubTask:       (parentId: string, subId: string) => void
}

function DayTaskCard({ todo, selectedDayMs, onAddSubTask, onUpdateSubTaskStatus, onDeleteSubTask }: DayTaskCardProps) {
  const [expanded,      setExpanded]      = useState(false)
  const [addingSubTask, setAddingSubTask] = useState(false)
  const [newSubTitle,   setNewSubTitle]   = useState('')
  const [newStartTime,  setNewStartTime]  = useState('')
  const [newEndTime,    setNewEndTime]    = useState('')
  const [newCategory,   setNewCategory]   = useState('')
  const [timeError,     setTimeError]     = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const daySubTasks: SubTask[] = (todo.subTasks ?? []).filter(s =>
    s.date === undefined || toMidnight(s.date) === selectedDayMs
  )

  const doneCount  = daySubTasks.filter(s => s.status === 'done').length
  const totalCount = daySubTasks.length
  const progress   = calcProgress(todo)

  const firstTime = daySubTasks.find(s => s.startTime)
  const timeLabel = firstTime
    ? `${firstTime.startTime}${firstTime.endTime ? ` – ${firstTime.endTime}` : ''}`
    : 'All day'

  const color  = todo.color ?? '#8B5CF6'
  const isDone = todo.status === 'done'

  useEffect(() => {
    if (addingSubTask) inputRef.current?.focus()
  }, [addingSubTask])

  function resetAddForm() {
    setNewSubTitle(''); setNewStartTime(''); setNewEndTime('')
    setNewCategory(''); setTimeError('')
    setAddingSubTask(false)
  }

  function isValidTime(t: string): boolean {
    const [hStr, mStr] = t.split(':')
    const h = parseInt(hStr, 10), m = parseInt(mStr, 10)
    return h >= 0 && h <= 23 && m >= 0 && m <= 59
  }

  function handleCreate() {
    const val = newSubTitle.trim()
    if (!val) return
    if (newStartTime && !isValidTime(newStartTime)) {
      setTimeError('Invalid start time — use HH:MM (00:00 – 23:59)')
      return
    }
    if (newEndTime && !isValidTime(newEndTime)) {
      setTimeError('Invalid end time — use HH:MM (00:00 – 23:59)')
      return
    }
    if (newStartTime && newEndTime && parseHHMM(newEndTime) <= parseHHMM(newStartTime)) {
      setTimeError('End time must be after start time')
      return
    }
    const todayMs = new Date().setHours(0, 0, 0, 0)
    if (selectedDayMs === todayMs && newStartTime && newEndTime) {
      const now  = new Date()
      const nowM = now.getHours() * 60 + now.getMinutes()
      if (parseHHMM(newEndTime) <= nowM) {
        setTimeError('End time has already passed — pick a future time or leave times blank')
        return
      }
    }
    onAddSubTask(
      todo.id, val, selectedDayMs,
      newStartTime || undefined,
      newEndTime   || undefined,
      newCategory.trim() || undefined,
    )
    resetAddForm()
  }

  // Auto-format: digits only → HH:MM as user types
  function handleTimeInput(raw: string, setter: (v: string) => void) {
    const digits = raw.replace(/\D/g, '').slice(0, 4)
    if (digits.length <= 2) setter(digits)
    else setter(`${digits.slice(0, 2)}:${digits.slice(2)}`)
  }

  // Pad and clamp on blur (e.g. "9" → "09:00", "89:90" → "23:59")
  function handleTimeBlur(val: string, setter: (v: string) => void) {
    if (!val) return
    const digits = val.replace(/\D/g, '')
    if (digits.length === 0) { setter(''); return }
    const h = Math.min(23, parseInt(digits.slice(0, 2) || '0', 10))
    const m = Math.min(59, parseInt(digits.slice(2) || '0', 10))
    setter(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleCreate()
    if (e.key === 'Escape') resetAddForm()
  }

  function toggleSubStatus(sub: SubTask) {
    onUpdateSubTaskStatus(todo.id, sub.id, sub.status === 'done' ? 'todo' : 'done')
  }

  // Group sub-tasks by category (null = no category)
  const grouped: { label: string | null; items: SubTask[] }[] = []
  const seen = new Map<string | null, SubTask[]>()
  for (const s of daySubTasks) {
    const key = s.category ?? null
    if (!seen.has(key)) { seen.set(key, []); grouped.push({ label: key, items: seen.get(key)! }) }
    seen.get(key)!.push(s)
  }

  return (
    <div className={`dv-card${isDone ? ' done' : ''}`} style={{ '--card-color': color } as React.CSSProperties}>
      <div className="dv-card-bar" />

      <div className="dv-card-head">
        <span className="dv-status-badge" style={{ background: `${color}18`, color }}>
          {STATUS_LABEL[todo.status]}
        </span>
        <span className="dv-time-label">{timeLabel}</span>
      </div>

      <p className="dv-card-title">
        {todo.emoji && <span className="dv-emoji">{todo.emoji}</span>}
        {todo.title}
      </p>

      {todo.description && (
        <p className="dv-card-desc">{todo.description}</p>
      )}

      <div className="dv-progress-row">
        <div className="dv-progress-track">
          <div className="dv-progress-fill" style={{ width: `${progress}%`, background: color }} />
        </div>
        <span className="dv-progress-pct">{progress}%</span>
      </div>

      <button
        className="dv-subtask-toggle"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        <span className="dv-chevron"><ChevronIcon open={expanded} /></span>
        {totalCount > 0 ? `${doneCount}/${totalCount} sub-tasks` : '0 sub-tasks'}
      </button>

      {expanded && (
        <ul className="dv-subtask-list">
          {grouped.map(({ label, items }) => (
            <>
              {label && <li key={`cat-${label}`} className="dv-cat-header">#{label}</li>}
              {items.map(sub => (
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
                  {sub.startTime && sub.endTime && sub.status !== 'done' && (
                    <div className="dv-sub-time-track">
                      <div
                        className="dv-sub-time-fill"
                        style={{ width: `${calcSubTaskTimeProgress(sub)}%`, background: color }}
                      />
                    </div>
                  )}
                  <button
                    className="dv-sub-del"
                    onClick={() => onDeleteSubTask(todo.id, sub.id)}
                    aria-label="Delete"
                  >×</button>
                </li>
              ))}
            </>
          ))}

          {!isDone && (
            addingSubTask ? (
              <li className="dv-add-row">
                <input
                  ref={inputRef}
                  className="dv-add-input"
                  type="text"
                  placeholder="Sub-task name…"
                  value={newSubTitle}
                  onChange={e => setNewSubTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={500}
                />
                <div className="dv-time-row">
                  <span className="dv-time-lbl">⏱</span>
                  <input
                    className="dv-time-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="09:00"
                    value={newStartTime}
                    onChange={e => { handleTimeInput(e.target.value, setNewStartTime); setTimeError('') }}
                    onBlur={e => handleTimeBlur(e.target.value, setNewStartTime)}
                    onKeyDown={handleKeyDown}
                    maxLength={5}
                  />
                  <span className="dv-time-sep">→</span>
                  <input
                    className="dv-time-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="17:00"
                    value={newEndTime}
                    onChange={e => { handleTimeInput(e.target.value, setNewEndTime); setTimeError('') }}
                    onBlur={e => handleTimeBlur(e.target.value, setNewEndTime)}
                    onKeyDown={handleKeyDown}
                    maxLength={5}
                  />
                </div>
                {timeError && <p className="dv-time-error">{timeError}</p>}
                <div className="dv-cat-row">
                  <span className="dv-time-lbl">#</span>
                  <input
                    className="dv-cat-input"
                    type="text"
                    placeholder="Category (optional)"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={50}
                  />
                </div>
                <div className="dv-add-actions">
                  <button
                    className="dv-action-create"
                    onClick={handleCreate}
                    disabled={!newSubTitle.trim()}
                  >
                    Create
                  </button>
                  <button className="dv-action-discard" onClick={resetAddForm}>
                    Discard
                  </button>
                </div>
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
