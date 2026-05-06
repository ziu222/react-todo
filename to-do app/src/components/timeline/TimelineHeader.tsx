import './TimelineHeader.css'

interface TimelineHeaderProps {
  visibleDays: Date[]
  month:       Date
  onPrev:      () => void
  onNext:      () => void
  onToday:     () => void
}

export default function TimelineHeader({ visibleDays, month, onPrev, onNext, onToday }: TimelineHeaderProps) {
  const monthLabel = month.toLocaleDateString('en', { month: 'long', year: 'numeric' })
  const today      = new Date()

  return (
    <div className="tl-header">
      <div className="tl-header-nav">
        <button className="tl-nav-btn" onClick={onToday}>Today</button>
        <button className="tl-nav-btn icon" onClick={onPrev} aria-label="Previous month">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="tl-month-label">{monthLabel}</span>
        <button className="tl-nav-btn icon" onClick={onNext} aria-label="Next month">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="tl-date-strip" role="row" aria-label="Days">
        {visibleDays.map(d => {
          const isToday = d.toDateString() === today.toDateString()
          return (
            <div key={d.toISOString()} className={`tl-date-cell${isToday ? ' today' : ''}`} aria-current={isToday ? 'date' : undefined}>
              <span className="tl-date-dow">{d.toLocaleDateString('en', { weekday: 'narrow' })}</span>
              <span className="tl-date-num">{d.getDate()}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
