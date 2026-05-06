import { useState } from 'react'
import { useTodosContext } from '../../app/TodosContext'
import AddTaskModal from '../kanban/AddTaskModal'
import KanbanCard from '../kanban/KanbanCard'
import './TodayPanel.css'

function isSameDay(ts: number): boolean {
  const d = new Date(ts), now = new Date()
  return d.getFullYear() === now.getFullYear()
      && d.getMonth()    === now.getMonth()
      && d.getDate()     === now.getDate()
}

export default function TodayPanel() {
  const { filteredTodos, query, addTodo, updateStatus, deleteTodo, pinTodo } = useTodosContext()
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
          <li key={todo.id}>
            <KanbanCard
              todo={todo}
              query={query}
              onUpdateStatus={updateStatus}
              onDelete={deleteTodo}
              onPin={pinTodo}
            />
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
