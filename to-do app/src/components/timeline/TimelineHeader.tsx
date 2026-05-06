import type { TLViewMode } from '../../pages/TimelinePage'
import './TimelineHeader.css'

interface TimelineHeaderProps {
  visibleDays:  Date[]
  viewMode:     TLViewMode
  onViewChange: (mode: TLViewMode) => void
  onPrev:       () => void
  onNext:       () => void
  onToday:      () => void
}

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function TimelineHeader({ visibleDays, viewMode, onViewChange, onPrev, onNext, onToday }: TimelineHeaderProps) {
  const today = new Date()

  const rangeLabel = viewMode === 'month'
    ? visibleDays[0].toLocaleDateString('en', { month: 'long', year: 'numeric' })
    : (() => {
        const s = visibleDays[0]
        const e = visibleDays[6]
        const sameMonth = s.getMonth() === e.getMonth()
        return sameMonth
          ? `${s.toLocaleDateString('en', { month: 'long', day: 'numeric' })} – ${e.getDate()}, ${e.getFullYear()}`
          : `${s.toLocaleDateString('en', { month: 'short', day: 'numeric' })} – ${e.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`
      })()

  return (
    <div className="tl-header">
      <div className="tl-header-nav">
        <button className="tl-nav-btn" onClick={onToday}>Today</button>
        <button className="tl-nav-btn icon" onClick={onPrev} aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="tl-range-label">{rangeLabel}</span>
        <button className="tl-nav-btn icon" onClick={onNext} aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div className="tl-view-toggle">
          <button
            className={`tl-view-btn${viewMode === 'month' ? ' active' : ''}`}
            onClick={() => onViewChange('month')}
          >
            Month
          </button>
          <button
            className={`tl-view-btn${viewMode === 'week' ? ' active' : ''}`}
            onClick={() => onViewChange('week')}
          >
            Week
          </button>
        </div>
      </div>

      <div className="tl-date-row">
        <div className="tl-label-spacer" />
        <div className="tl-date-strip" role="row" aria-label="Days">
          {visibleDays.map(d => {
            const isToday   = d.toDateString() === today.toDateString()
            const isWeekend = d.getDay() === 0 || d.getDay() === 6
            return (
              <div
                key={d.toISOString()}
                className={`tl-date-cell${isToday ? ' today' : ''}${isWeekend ? ' weekend' : ''}`}
                aria-current={isToday ? 'date' : undefined}
              >
                <span className="tl-date-dow">{DOW[d.getDay()]}</span>
                <span className="tl-date-num">{d.getDate()}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
