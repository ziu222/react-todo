import { memo } from 'react'
import './StatCard.css'

interface StatCardProps {
  icon:        React.ReactNode
  label:       string
  count:       number
  trend:       number
  accentColor: string
  total?:      number
}

const RADIUS = 20
const CIRC   = 2 * Math.PI * RADIUS

function ProgressRing({ pct, color }: { pct: number; color: string }) {
  const offset = CIRC * (1 - pct / 100)
  return (
    <svg className="sc-ring" viewBox="0 0 48 48" aria-hidden="true">
      <circle className="sc-ring-track" cx="24" cy="24" r={RADIUS} />
      <circle
        className="sc-ring-fill"
        cx="24" cy="24" r={RADIUS}
        stroke={color}
        strokeDasharray={CIRC}
        strokeDashoffset={offset}
        style={{ '--circ': CIRC, '--offset': offset } as React.CSSProperties}
      />
      <text className="sc-ring-text" x="24" y="28">{Math.round(pct)}%</text>
    </svg>
  )
}

const StatCard = memo(function StatCard({ icon, label, count, trend, accentColor, total }: StatCardProps) {
  const isPositive = trend >= 0
  const pct = total != null && total > 0 ? Math.min(100, Math.round((count / total) * 100)) : null

  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-card-icon" style={{ background: `${accentColor}20`, color: accentColor }}>
          {icon}
        </div>
        {pct !== null && <ProgressRing pct={pct} color={accentColor} />}
      </div>
      <div className="stat-card-body">
        <span className="stat-card-count">{count}</span>
        <span className="stat-card-label">{label}</span>
      </div>
      <span className={`stat-card-trend ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(trend)} this week
      </span>
    </div>
  )
})

export default StatCard
