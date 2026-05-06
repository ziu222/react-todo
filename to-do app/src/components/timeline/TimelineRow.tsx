import type { Todo } from '../../features/todos/model/todoLogic'
import './TimelineRow.css'

interface TimelineRowProps {
  todo:        Todo
  visibleDays: Date[]
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
      && a.getMonth()    === b.getMonth()
      && a.getDate()     === b.getDate()
}

const STATUS_LABEL: Record<string, string> = {
  backlog:       'Backlog',
  todo:          'To Do',
  'in-progress': 'In Progress',
  done:          'Done',
}

export default function TimelineRow({ todo, visibleDays }: TimelineRowProps) {
  const createdDate = new Date(todo.createdAt)
  const dayIndex    = visibleDays.findIndex(d => isSameDay(d, createdDate))

  const pillStyle = dayIndex >= 0
    ? {
        left:  `${(dayIndex / visibleDays.length) * 100}%`,
        width: `${(1 / visibleDays.length) * 100}%`,
        background: todo.color,
      }
    : undefined

  return (
    <div className="tl-row">
      <div className="tl-row-label">
        <span className="tl-row-title">{todo.title}</span>
        <span className="tl-row-status">{STATUS_LABEL[todo.status]}</span>
      </div>

      <div className="tl-row-track">
        {/* grid lines matching the date strip columns */}
        {visibleDays.map(d => (
          <div key={d.toISOString()} className="tl-row-cell" />
        ))}

        {pillStyle && (
          <div
            className="tl-row-pill"
            style={pillStyle}
            title={`${todo.title} — ${createdDate.toLocaleDateString()}`}
          />
        )}
      </div>
    </div>
  )
}
