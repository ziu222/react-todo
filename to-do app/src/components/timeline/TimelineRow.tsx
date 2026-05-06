import type { Todo } from '../../features/todos/model/todoLogic'
import { calcProgress } from '../../features/todos/model/todoLogic'
import './TimelineRow.css'

interface TimelineRowProps {
  todo:        Todo
  visibleDays: Date[]
}

const STATUS_LABEL: Record<string, string> = {
  backlog:       'Backlog',
  todo:          'To Do',
  'in-progress': 'In Progress',
  done:          'Done',
}

// Normalize a date/timestamp to local midnight ms for comparison
function toMidnight(d: Date | number): number {
  const dt = typeof d === 'number' ? new Date(d) : d
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime()
}

export default function TimelineRow({ todo, visibleDays }: TimelineRowProps) {
  const n         = visibleDays.length
  const firstMs   = toMidnight(visibleDays[0])
  const lastMs    = toMidnight(visibleDays[n - 1])
  const dayWidth  = 1 / n   // fraction per day

  const startMs = todo.startDay != null ? toMidnight(todo.startDay) : toMidnight(todo.createdAt)
  const endMs   = todo.endDay   != null ? toMidnight(todo.endDay)   : startMs

  // Hide pill if entirely outside this view
  const pillVisible = startMs <= lastMs && endMs >= firstMs

  const progress = todo.startDay != null && todo.endDay != null
    ? calcProgress(todo.startDay, todo.endDay)
    : 0

  // Clamp to visible range, then convert to % of track width
  const clampedStart = Math.max(startMs, firstMs)
  const clampedEnd   = Math.min(endMs,   lastMs)

  // Find the column index of clamped start
  const startIdx = visibleDays.findIndex(
    d => toMidnight(d) === clampedStart
  )
  // Find the column index of clamped end
  const endIdx = visibleDays.findIndex(
    d => toMidnight(d) === clampedEnd
  )

  const leftPct  = startIdx >= 0 ? (startIdx / n) * 100               : 0
  const widthPct = endIdx   >= 0 ? ((endIdx - (startIdx >= 0 ? startIdx : 0) + 1) / n) * 100 : dayWidth * 100

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
            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
            title={`${todo.title} · ${progress}%`}
          >
            {/* Track background */}
            <div className="tl-pill-bg" style={{ background: todo.color }} />
            {/* Progress fill */}
            <div
              className="tl-pill-fill"
              style={{ width: `${progress}%`, background: todo.color }}
            />
            {/* Label */}
            <span className="tl-pill-label">
              {progress > 0 ? `${progress}%` : ''} {todo.title}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
