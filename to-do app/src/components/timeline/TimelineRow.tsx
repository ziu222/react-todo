import type { Todo } from '../../features/todos/model/todoLogic'
import { calcProgress } from '../../features/todos/model/todoLogic'
import './TimelineRow.css'

interface TimelineRowProps {
  todo:          Todo
  visibleDays:   Date[]
  onOpenDetail:  (todo: Todo) => void
}

const STATUS_LABEL: Record<string, string> = {
  backlog:       'Backlog',
  todo:          'To Do',
  'in-progress': 'In Progress',
  done:          'Done',
}

function toMidnight(d: Date | number): number {
  const dt = typeof d === 'number' ? new Date(d) : d
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime()
}

export default function TimelineRow({ todo, visibleDays, onOpenDetail }: TimelineRowProps) {
  const n        = visibleDays.length
  const firstMs  = toMidnight(visibleDays[0])
  const lastMs   = toMidnight(visibleDays[n - 1])

  const startMs = todo.startDay != null ? toMidnight(todo.startDay) : toMidnight(todo.createdAt)
  const endMs   = todo.endDay   != null ? toMidnight(todo.endDay)   : startMs

  const pillVisible = startMs <= lastMs && endMs >= firstMs

  const progress = todo.startDay != null && todo.endDay != null
    ? calcProgress(todo.startDay, todo.endDay)
    : 0

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
        <span className="tl-row-status">{STATUS_LABEL[todo.status]}</span>
      </div>

      <div className="tl-row-track">
        {visibleDays.map(d => (
          <div key={d.toISOString()} className="tl-row-cell" />
        ))}

        {pillVisible && (
          <div
            className="tl-pill"
            style={{
              left: `${leftPct}%`,
              width: `${widthPct}%`,
              '--pill-color': color,
            } as React.CSSProperties}
            onClick={() => onOpenDetail(todo)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && onOpenDetail(todo)}
            title={`${todo.title} · ${progress}%`}
          >
            {/* faint full-width track */}
            <div className="tl-pill-bg" />
            {/* solid progress fill */}
            <div className="tl-pill-fill" style={{ width: `${progress}%` }} />
            {/* content layer */}
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
