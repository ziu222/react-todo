import './StatCard.css'

interface StatCardProps {
  icon:       React.ReactNode
  label:      string
  count:      number
  trend:      number
  accentColor: string
}

export default function StatCard({ icon, label, count, trend, accentColor }: StatCardProps) {
  const isPositive = trend >= 0

  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ background: `${accentColor}20`, color: accentColor }}>
        {icon}
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
}
