import { useState } from 'react'
import { useTodosContext } from '../app/TodosContext'
import TimelineHeader from '../components/timeline/TimelineHeader'
import TimelineRow    from '../components/timeline/TimelineRow'
import TaskDetailModal from '../components/kanban/TaskDetailModal'
import DayView        from '../components/timeline/DayView'
import type { Todo } from '../features/todos/model/todoLogic'
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

  const [viewMode, setViewMode] = useState<TLViewMode>('month')
  const [anchor,   setAnchor]   = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [selectedTodo,  setSelectedTodo]  = useState<Todo | null>(null)
  const [selectedDayMs, setSelectedDayMs] = useState<number>(
    () => new Date().setHours(0, 0, 0, 0)
  )

  const visibleDays = viewMode === 'month'
    ? getDaysInMonth(anchor.getFullYear(), anchor.getMonth())
    : getWeekDays(anchor)

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
    if (viewMode === 'month') {
      setAnchor(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
    } else {
      setAnchor(d => { const n = new Date(d); n.setDate(d.getDate() - 7); return n })
    }
  }

  function goNext() {
    if (viewMode === 'month') {
      setAnchor(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
    } else {
      setAnchor(d => { const n = new Date(d); n.setDate(d.getDate() + 7); return n })
    }
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
      <TimelineHeader
        visibleDays={visibleDays}
        viewMode={viewMode}
        onViewChange={handleViewChange}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
        onDayClick={setSelectedDayMs}
        selectedDayMs={selectedDayMs}
      />

      <div className="timeline-split">
        {/* Left: day view */}
        <DayView
          selectedDayMs={selectedDayMs}
          todos={filteredTodos}
          onAddSubTask={(parentId, title, date) => addSubTask(parentId, title, { date })}
          onUpdateSubTaskStatus={updateSubTaskStatus}
          onDeleteSubTask={deleteSubTask}
        />

        {/* Right: Gantt */}
        <div className="timeline-gantt">
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
            />
          ))}
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
