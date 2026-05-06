import { useState } from 'react'
import { useTodosContext } from '../../app/TodosContext'
import AddTaskModal from '../kanban/AddTaskModal'
import KanbanCard from '../kanban/KanbanCard'
import './TodayPanel.css'

export default function TodayPanel() {
  const { filteredTodos, query, addTodo, updateStatus, deleteTodo, pinTodo } = useTodosContext()
  const [modalOpen, setModalOpen] = useState(false)

  const remainingTodos = filteredTodos
    .filter(t => t.status !== 'done')
    .sort((a, b) => (a.startDay ?? a.createdAt) - (b.startDay ?? b.createdAt))

  const today = new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <aside className="today-panel">
      <div className="today-panel-header">
        <span className="today-panel-title">Task Remaining</span>
        <span className="today-panel-date">{today}</span>
      </div>

      <ul className="today-list">
        {remainingTodos.length === 0 && (
          <li className="today-empty">No remaining tasks.</li>
        )}
        {remainingTodos.map(todo => (
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
