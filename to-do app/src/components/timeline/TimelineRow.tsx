import type { Todo } from '../../features/todos/model/todoLogic'
import { calcProgress, toMidnight } from '../../features/todos/model/todoLogic'
import './TimelineRow.css'

interface TimelineRowProps {
  todo:           Todo
  visibleDays:    Date[]
  onOpenDetail:   (todo: Todo) => void
  onDayClick:     (dayMs: number) => void
  selectedDayMs?: number
  todayIdx:       number
}

export default function TimelineRow({ todo, visibleDays, onOpenDetail, onDayClick, selectedDayMs, todayIdx }: TimelineRowProps) {
  const n        = visibleDays.length
  const firstMs  = toMidnight(visibleDays[0])
  const lastMs   = toMidnight(visibleDays[n - 1])

  const startMs = todo.startDay != null ? toMidnight(todo.startDay) : toMidnight(todo.createdAt)
  const endMs   = todo.endDay   != null ? toMidnight(todo.endDay)   : startMs

  const pillVisible = startMs <= lastMs && endMs >= firstMs
  const progress    = calcProgress(todo)

  const clampedStart = Math.max(startMs, firstMs)
  const clampedEnd   = Math.min(endMs,   lastMs)

  const startIdx = visibleDays.findIndex(d => toMidnight(d) === clampedStart)
  const endIdx   = visibleDays.findIndex(d => toMidnight(d) === clampedEnd)

  const leftPct  = startIdx >= 0 ? (startIdx / n) * 100 : 0
  const widthPct = endIdx   >= 0 ? ((endIdx - (startIdx >= 0 ? startIdx : 0) + 1) / n) * 100 : (1 / n) * 100

  // how many days this pill spans inside the visible window
  const daySpan  = endIdx >= 0 && startIdx >= 0 ? endIdx - startIdx + 1 : 1

  const color    = todo.color ?? '#8B5CF6'
  const label    = todo.emoji ?? todo.title.trim()[0]?.toUpperCase() ?? '?'

  const pillProps = {
    style: {
      left:  `${leftPct}%`,
      width: `${widthPct}%`,
      '--pill-color': color,
    } as React.CSSProperties,
    onClick:    (e: React.MouseEvent) => { e.stopPropagation(); onOpenDetail(todo) },
    role:       'button' as const,
    tabIndex:   0,
    onKeyDown:  (e: React.KeyboardEvent) => e.key === 'Enter' && onOpenDetail(todo),
    title:      `${todo.emoji ? todo.emoji + ' ' : ''}${todo.title} · ${progress}%`,
  }

  return (
    <div className="tl-row">
      {/* today column tint */}
      {todayIdx >= 0 && (
        <div
          className="tl-row-today-bg"
          style={{ left: `${(todayIdx / n) * 100}%`, width: `${(1 / n) * 100}%` }}
        />
      )}

      {/* day cells (for click interaction) */}
      {visibleDays.map((d, i) => {
        const dayMs = toMidnight(d)
        return (
          <div
            key={d.toISOString()}
            className={`tl-row-cell${dayMs === selectedDayMs ? ' selected' : ''}${i === todayIdx ? ' today' : ''}`}
            onClick={() => onDayClick(dayMs)}
            role="button"
            tabIndex={-1}
          />
        )
      })}

      {/* pill — three render tiers based on day span */}
      {pillVisible && (
        daySpan <= 1 ? (
          /* ── Compact dot (1 day) ── */
          <div className="tl-pill tl-pill--dot" {...pillProps}>
            <div className="tl-pill-bg" />
            <span className="tl-pill-dot-label">{label}</span>
          </div>
        ) : daySpan <= 2 ? (
          /* ── Narrow pill (2 days) — title only ── */
          <div className="tl-pill tl-pill--narrow" {...pillProps}>
            <div className="tl-pill-bg" />
            <div className="tl-pill-fill" style={{ width: `${progress}%` }} />
            <div className="tl-pill-content">
              {todo.emoji && <span className="tl-emoji">{todo.emoji}</span>}
              <span className="tl-pill-name">{todo.title}</span>
            </div>
          </div>
        ) : (
          /* ── Full pill (3+ days) ── */
          <div className="tl-pill" {...pillProps}>
            <div className="tl-pill-bg" />
            <div className="tl-pill-fill" style={{ width: `${progress}%` }} />
            <div className="tl-pill-content">
              <span className="tl-pill-dot" />
              <span className="tl-pill-name">
                {todo.emoji && <span className="tl-emoji">{todo.emoji}</span>}
                {todo.title}
              </span>
              <div className="tl-pill-meta">
                <span className="tl-pill-pct">{progress}%</span>
                <span className="tl-pill-arrow">›</span>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}
