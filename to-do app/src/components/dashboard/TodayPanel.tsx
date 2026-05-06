import { useState } from 'react'
import { useTodosContext } from '../../app/TodosContext'
import AddTaskModal from '../kanban/AddTaskModal'
import './TodayPanel.css'

// Returns true when a timestamp falls on the current local calendar day.
function isSameDay(ts: number): boolean {
  const d = new Date(ts)
  const now = new Date()
  return d.getFullYear() === now.getFullYear()
      && d.getMonth()    === now.getMonth()
      && d.getDate()     === now.getDate()
}

const STATUS_LABEL: Record<string, string> = {
  backlog:      'Backlog',
  todo:         'To Do',
  'in-progress': 'In Progress',
  done:         'Done',
}

const STATUS_COLOR: Record<string, string> = {
  backlog:      '#6B7280',
  todo:         'var(--status-todo)',
  'in-progress': 'var(--status-in-progress)',
  done:         'var(--status-done)',
}

export default function TodayPanel() {
  const { filteredTodos, addTodo } = useTodosContext()
  const [modalOpen, setModalOpen] = useState(false)

  const todayTodos = filteredTodos.filter(t => isSameDay(t.createdAt))

  const today = new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <aside className="today-panel">
      <div className="today-panel-header">
        <span className="today-panel-title">Today</span>
        <span className="today-panel-date">{today}</span>
      </div>

      <ul className="today-list">
        {todayTodos.length === 0 && (
          <li className="today-empty">No tasks added today yet.</li>
        )}
        {todayTodos.map(todo => (
          <li key={todo.id} className="today-item">
            <span
              className="today-item-dot"
              style={{ background: STATUS_COLOR[todo.status] }}
              aria-hidden="true"
            />
            <span className="today-item-title">{todo.title}</span>
            <span className="today-item-status">{STATUS_LABEL[todo.status]}</span>
          </li>
        ))}
      </ul>

      <div className="today-add-form">
        <span className="today-add-label">New Task</span>
        <button
          className="today-add-btn"
          onClick={() => setModalOpen(true)}
          aria-label="Add task"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {modalOpen && (
        <AddTaskModal
          initialStatus="todo"
          onClose={() => setModalOpen(false)}
          onSubmit={({ title, ...extras }) => addTodo(title, extras)}
        />
      )}
    </aside>
  )
}
