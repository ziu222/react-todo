import { useState, useMemo } from 'react'
import { useTodosContext } from '../app/TodosContext'
import TimelineHeader  from '../components/timeline/TimelineHeader'
import TimelineRow     from '../components/timeline/TimelineRow'
import TaskDetailModal from '../components/kanban/TaskDetailModal'
import DayView         from '../components/timeline/DayView'
import { toMidnight }  from '../features/todos/model/todoLogic'
import type { Todo }   from '../features/todos/model/todoLogic'
import './TimelinePage.css'

export type TLViewMode = 'month' | 'week'

function getDaysInMonth(year: number, month: number): Date[] {
  const count = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: count }, (_, i) => new Date(year, month, i + 1))
}

function getWeekDays(anchor: Date): Date[] {
  const day = anchor.getDay()
  const monday = new Date(anchor)
  monday.setDate(anchor.getDate() + (day === 0 ? -6 : 1 - day))
  monday.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

export default function TimelinePage() {
  const {
    filteredTodos,
    updateStatus,
    deleteTodo,
    pinTodo,
    addSubTask,
    updateSubTaskStatus,
    deleteSubTask,
  } = useTodosContext()

  const [viewMode,     setViewMode]     = useState<TLViewMode>('month')
  const [anchor,       setAnchor]       = useState(() => {
    const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [selectedTodo,  setSelectedTodo]  = useState<Todo | null>(null)
  const [selectedDayMs, setSelectedDayMs] = useState<number>(
    () => new Date().setHours(0, 0, 0, 0)
  )

  const visibleDays = viewMode === 'month'
    ? getDaysInMonth(anchor.getFullYear(), anchor.getMonth())
    : getWeekDays(anchor)

  const todayIdx = useMemo(() => {
    const todayMs = new Date().setHours(0, 0, 0, 0)
    return visibleDays.findIndex(d => toMidnight(d) === todayMs)
  }, [visibleDays])

  const rangeLabel = viewMode === 'month'
    ? visibleDays[0].toLocaleDateString('en', { month: 'long', year: 'numeric' })
    : (() => {
        const s = visibleDays[0], e = visibleDays[6]
        return s.getMonth() === e.getMonth()
          ? `${s.toLocaleDateString('en', { month: 'long', day: 'numeric' })} – ${e.getDate()}, ${e.getFullYear()}`
          : `${s.toLocaleDateString('en', { month: 'short', day: 'numeric' })} – ${e.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`
      })()

  function goToday() {
    const d = new Date()
    if (viewMode === 'month') {
      setAnchor(new Date(d.getFullYear(), d.getMonth(), 1))
    } else {
      const day = d.getDay()
      const monday = new Date(d)
      monday.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
      monday.setHours(0, 0, 0, 0)
      setAnchor(monday)
    }
  }

  function goPrev() {
    if (viewMode === 'month') setAnchor(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
    else setAnchor(d => { const n = new Date(d); n.setDate(d.getDate() - 7); return n })
  }

  function goNext() {
    if (viewMode === 'month') setAnchor(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
    else setAnchor(d => { const n = new Date(d); n.setDate(d.getDate() + 7); return n })
  }

  function handleViewChange(mode: TLViewMode) {
    setViewMode(mode)
    const today = new Date()
    if (mode === 'month') {
      setAnchor(new Date(today.getFullYear(), today.getMonth(), 1))
    } else {
      const day = today.getDay()
      const monday = new Date(today)
      monday.setDate(today.getDate() + (day === 0 ? -6 : 1 - day))
      monday.setHours(0, 0, 0, 0)
      setAnchor(monday)
    }
  }

  return (
    <div className="timeline-page" style={{ '--day-count': visibleDays.length } as React.CSSProperties}>

      {/* ── Controls bar ── */}
      <div className="tl-controls">
        <div className="tl-controls-left">
          <button className="tl-nav-btn" onClick={goToday}>Today</button>
          <button className="tl-nav-btn icon" onClick={goPrev} aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className="tl-nav-btn icon" onClick={goNext} aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <span className="tl-range-label">{rangeLabel}</span>
        </div>
        <div className="tl-view-toggle">
          <button className={`tl-view-btn${viewMode === 'month' ? ' active' : ''}`} onClick={() => handleViewChange('month')}>Month</button>
          <button className={`tl-view-btn${viewMode === 'week'  ? ' active' : ''}`} onClick={() => handleViewChange('week')}>Week</button>
        </div>
      </div>

      {/* ── Split panel ── */}
      <div className="timeline-split">

        {/* Left: day view */}
        <DayView
          selectedDayMs={selectedDayMs}
          todos={filteredTodos}
          onAddSubTask={(parentId, title, date, startTime, endTime, category) =>
            addSubTask(parentId, title, { date, startTime, endTime, category })
          }
          onUpdateSubTaskStatus={updateSubTaskStatus}
          onDeleteSubTask={deleteSubTask}
        />

        {/* Right: Gantt (date strip + rows in one card) */}
        <div className="timeline-gantt">
          <TimelineHeader
            visibleDays={visibleDays}
            onDayClick={setSelectedDayMs}
            selectedDayMs={selectedDayMs}
            todayIdx={todayIdx}
          />

          <div className="tl-rows">
            {filteredTodos.length === 0 && (
              <p className="timeline-empty">No tasks yet — add some from the Dashboard or Tasks page.</p>
            )}
            {filteredTodos.map(todo => (
              <TimelineRow
                key={todo.id}
                todo={todo}
                visibleDays={visibleDays}
                onOpenDetail={setSelectedTodo}
                onDayClick={setSelectedDayMs}
                selectedDayMs={selectedDayMs}
                todayIdx={todayIdx}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TaskDetailModal
          todo={selectedTodo}
          onClose={() => setSelectedTodo(null)}
          onUpdateStatus={updateStatus}
          onDelete={deleteTodo}
          onPin={pinTodo}
        />
      )}
    </div>
  )
}
