import { useState } from 'react'
import { useTodosContext } from '../app/TodosContext'
import TimelineHeader from '../components/timeline/TimelineHeader'
import TimelineRow    from '../components/timeline/TimelineRow'
import './TimelinePage.css'

function getDaysInMonth(year: number, month: number): Date[] {
  const count = new Date(year, month + 1, 0).getDate()
  return Array.from({ length: count }, (_, i) => new Date(year, month, i + 1))
}

export default function TimelinePage() {
  const { filteredTodos } = useTodosContext()
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  const visibleDays = getDaysInMonth(viewMonth.getFullYear(), viewMonth.getMonth())

  function goToday() {
    const d = new Date()
    setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1))
  }

  function goPrev() {
    setViewMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }

  function goNext() {
    setViewMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  return (
    <div className="timeline-page" style={{ '--day-count': visibleDays.length } as React.CSSProperties}>
      <TimelineHeader
        visibleDays={visibleDays}
        month={viewMonth}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
      />

      <div className="timeline-body">
        {filteredTodos.length === 0 && (
          <p className="timeline-empty">No tasks yet — add some from the Dashboard or Tasks page.</p>
        )}
        {filteredTodos.map(todo => (
          <TimelineRow key={todo.id} todo={todo} visibleDays={visibleDays} />
        ))}
      </div>
    </div>
  )
}
