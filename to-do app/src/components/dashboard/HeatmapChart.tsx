import { useMemo } from 'react'
import type { Todo } from '../../features/todos/model/todoLogic'
import './HeatmapChart.css'

interface HeatmapChartProps {
  todos: Todo[]
}

const WEEKS = 15
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function toMidnight(ms: number) {
  const d = new Date(ms)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

function getLevel(count: number) {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count <= 3)  return 2
  if (count <= 5)  return 3
  return 4
}

export default function HeatmapChart({ todos }: HeatmapChartProps) {
  const { cells, monthLabels, totalDone } = useMemo(() => {
    const todayMs = toMidnight(Date.now())

    // Start from the Sunday that is WEEKS weeks ago
    const todayDate  = new Date(todayMs)
    const dayOfWeek  = todayDate.getDay()
    const startMs    = todayMs - (WEEKS * 7 - 1 - dayOfWeek) * 86_400_000

    // Count done todos per day using endDay ?? createdAt
    const countMap = new Map<number, number>()
    for (const t of todos) {
      if (t.status !== 'done') continue
      const dayMs = toMidnight(t.endDay ?? t.createdAt)
      if (dayMs >= startMs && dayMs <= todayMs) {
        countMap.set(dayMs, (countMap.get(dayMs) ?? 0) + 1)
      }
    }

    const totalDays = WEEKS * 7
    const cells: { ms: number; count: number; level: number; isFuture: boolean }[] = []
    for (let i = 0; i < totalDays; i++) {
      const ms      = startMs + i * 86_400_000
      const count   = countMap.get(ms) ?? 0
      const level   = getLevel(count)
      const isFuture = ms > todayMs
      cells.push({ ms, count, level, isFuture })
    }

    // Build month labels: track when month changes across columns
    const monthLabels: { col: number; label: string }[] = []
    let lastMonth = -1
    for (let col = 0; col < WEEKS; col++) {
      const d = new Date(startMs + col * 7 * 86_400_000)
      const m = d.getMonth()
      if (m !== lastMonth) {
        monthLabels.push({ col, label: d.toLocaleDateString('en', { month: 'short' }) })
        lastMonth = m
      }
    }

    const totalDone = todos.filter(t => t.status === 'done').length

    return { cells, monthLabels, totalDone }
  }, [todos])

  const fmt = (ms: number) => new Date(ms).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="hm-root">
      <div className="hm-header">
        <span className="hm-title">Completion Activity</span>
        <span className="hm-sub">{totalDone} tasks completed total</span>
      </div>

      <div className="hm-wrap">
        {/* Day labels on the left */}
        <div className="hm-day-labels">
          {DAY_LABELS.map((d, i) => (
            <span key={d} className="hm-day-label" style={{ gridRow: i + 1 }}>
              {i % 2 === 1 ? d.slice(0, 1) : ''}
            </span>
          ))}
        </div>

        <div className="hm-grid-wrap">
          {/* Month labels above */}
          <div className="hm-months" style={{ gridTemplateColumns: `repeat(${WEEKS}, 1fr)` }}>
            {monthLabels.map(({ col, label }) => (
              <span key={col} className="hm-month" style={{ gridColumn: col + 1 }}>{label}</span>
            ))}
          </div>

          {/* Cell grid — column-major (each column = 1 week) */}
          <div className="hm-grid" style={{ gridTemplateColumns: `repeat(${WEEKS}, 1fr)` }}>
            {cells.map((cell, i) => {
              const col = Math.floor(i / 7) + 1
              const row = (i % 7) + 1
              return (
                <div
                  key={cell.ms}
                  className={`hm-cell lv${cell.isFuture ? 0 : cell.level}`}
                  style={{ gridColumn: col, gridRow: row }}
                  title={cell.isFuture ? '' : `${fmt(cell.ms)}: ${cell.count} task${cell.count !== 1 ? 's' : ''} done`}
                  aria-label={cell.isFuture ? undefined : `${fmt(cell.ms)}, ${cell.count} tasks`}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="hm-legend">
        <span className="hm-legend-label">Less</span>
        {[0, 1, 2, 3, 4].map(l => <div key={l} className={`hm-cell lv${l}`} />)}
        <span className="hm-legend-label">More</span>
      </div>
    </div>
  )
}
