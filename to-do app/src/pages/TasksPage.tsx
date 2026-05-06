import KanbanBoard from '../components/kanban/KanbanBoard'
import './TasksPage.css'

export default function TasksPage() {
  return (
    <div className="tasks-page">
      <div className="tasks-page-header">
        <h2 className="tasks-page-title">Tasks</h2>
      </div>
      <KanbanBoard />
    </div>
  )
}
