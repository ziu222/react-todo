import { useTodosContext } from '../app/TodosContext'
import StatCard   from '../components/dashboard/StatCard'
import TaskChart  from '../components/dashboard/TaskChart'
import TodayPanel from '../components/dashboard/TodayPanel'
import './DashboardPage.css'

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

function IconList() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  )
}

export default function DashboardPage() {
  const { filteredTodos, counts } = useTodosContext()

  return (
    <div className="dashboard">
      <div className="dashboard-main">
        <section className="stat-row" aria-label="Task statistics">
          <StatCard icon={<IconList  />} label="Total Tasks"    count={counts.all}            trend={counts.all}            accentColor="var(--accent)"       />
          <StatCard icon={<IconClock />} label="In Progress"    count={counts['in-progress']} trend={counts['in-progress']} accentColor="var(--status-in-progress)" />
          <StatCard icon={<IconCheck />} label="Completed"      count={counts.done}           trend={counts.done}           accentColor="var(--status-done)"   />
        </section>

        <TaskChart todos={filteredTodos} />
      </div>

      <TodayPanel />
    </div>
  )
}
