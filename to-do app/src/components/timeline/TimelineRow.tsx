import type { Todo } from '../../features/todos/model/todoLogic'
import { calcProgress, toMidnight } from '../../features/todos/model/todoLogic'
import './TimelineRow.css'

interface TimelineRowProps {
  todo:          Todo
  visibleDays:   Date[]
  onOpenDetail:  (todo: Todo) => void
  onDayClick:    (dayMs: number) => void
  selectedDayMs?: number
}

export default function TimelineRow({ todo, visibleDays, onOpenDetail, onDayClick, selectedDayMs }: TimelineRowProps) {
  const n        = visibleDays.length
  const firstMs  = toMidnight(visibleDays[0])
  const lastMs   = toMidnight(visibleDays[n - 1])

  const startMs = todo.startDay != null ? toMidnight(todo.startDay) : toMidnight(todo.createdAt)
  const endMs   = todo.endDay   != null ? toMidnight(todo.endDay)   : startMs

  const pillVisible = startMs <= lastMs && endMs >= firstMs

  const progress = calcProgress(todo)

  const clampedStart = Math.max(startMs, firstMs)
  const clampedEnd   = Math.min(endMs,   lastMs)

  const startIdx = visibleDays.findIndex(d => toMidnight(d) === clampedStart)
  const endIdx   = visibleDays.findIndex(d => toMidnight(d) === clampedEnd)

  const leftPct  = startIdx >= 0 ? (startIdx / n) * 100 : 0
  const widthPct = endIdx   >= 0 ? ((endIdx - (startIdx >= 0 ? startIdx : 0) + 1) / n) * 100 : (1 / n) * 100

  const color = todo.color ?? '#8B5CF6'

  return (
    <div className="tl-row">
      <div className="tl-row-label">
        <span className="tl-row-title">{todo.title}</span>
        <span className="tl-row-status">{todo.status === 'in-progress' ? 'In Progress' : todo.status === 'todo' ? 'To Do' : todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}</span>
      </div>

      <div className="tl-row-track">
        {visibleDays.map(d => {
          const dayMs = toMidnight(d)
          return (
            <div
              key={d.toISOString()}
              className={`tl-row-cell${dayMs === selectedDayMs ? ' selected' : ''}`}
              onClick={() => onDayClick(dayMs)}
              role="button"
              tabIndex={-1}
              aria-label={`Select ${d.toLocaleDateString()}`}
            />
          )
        })}

        {pillVisible && (
          <div
            className="tl-pill"
            style={{
              left: `${leftPct}%`,
              width: `${widthPct}%`,
              '--pill-color': color,
            } as React.CSSProperties}
            onClick={e => { e.stopPropagation(); onOpenDetail(todo) }}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onOpenDetail(todo)}
            title={`${todo.title} · ${progress}%`}
          >
            <div className="tl-pill-bg" />
            <div className="tl-pill-fill" style={{ width: `${progress}%` }} />
            <div className="tl-pill-content">
              <span className="tl-pill-dot" />
              <span className="tl-pill-name">{todo.title}</span>
              <div className="tl-pill-meta">
                <span className="tl-pill-pct">{progress}%</span>
                <span className="tl-pill-arrow">›</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
