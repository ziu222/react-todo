import { toMidnight } from '../../features/todos/model/todoLogic'
import './TimelineHeader.css'

interface TimelineHeaderProps {
  visibleDays:    Date[]
  onDayClick?:    (dayMs: number) => void
  selectedDayMs?: number
  todayIdx:       number   // index of today in visibleDays, or -1
}

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function TimelineHeader({ visibleDays, onDayClick, selectedDayMs, todayIdx }: TimelineHeaderProps) {
  const today = new Date()

  return (
    <div className="tl-date-strip" role="row" aria-label="Days">
      {todayIdx >= 0 && (
        <div
          className="tl-today-col"
          style={{ left: `${(todayIdx / visibleDays.length) * 100}%`, width: `${(1 / visibleDays.length) * 100}%` }}
        />
      )}
      {visibleDays.map(d => {
        const isToday    = d.toDateString() === today.toDateString()
        const isWeekend  = d.getDay() === 0 || d.getDay() === 6
        const dayMs      = toMidnight(d)
        const isSelected = dayMs === selectedDayMs
        return (
          <div
            key={d.toISOString()}
            className={`tl-date-cell${isToday ? ' today' : ''}${isWeekend ? ' weekend' : ''}${isSelected ? ' selected' : ''}`}
            role="button"
            tabIndex={0}
            onClick={() => onDayClick?.(dayMs)}
            onKeyDown={e => e.key === 'Enter' && onDayClick?.(dayMs)}
            aria-current={isToday ? 'date' : undefined}
            aria-pressed={isSelected}
          >
            <span className="tl-date-dow">{DOW[d.getDay()]}</span>
            <span className="tl-date-num">{d.getDate()}</span>
          </div>
        )
      })}
    </div>
  )
}
