import { useState } from 'react'
import { useTodosContext } from '../../app/TodosContext'
import type { Todo, TodoStatus } from '../../features/todos/model/todoLogic'
import KanbanColumn from './KanbanColumn'
import AddTaskModal from './AddTaskModal'
import './KanbanBoard.css'

const COLUMNS: { status: TodoStatus; label: string; color: string }[] = [
  { status: 'backlog',      label: 'Backlog',     color: '#6B7280' },
  { status: 'todo',         label: 'To Do',       color: 'var(--status-todo)'        },
  { status: 'in-progress',  label: 'In Progress', color: 'var(--status-in-progress)' },
  { status: 'done',         label: 'Done',        color: 'var(--status-done)'        },
]

export default function KanbanBoard() {
  const { filteredTodos, query, addTodo, updateStatus, deleteTodo, updateTask } = useTodosContext()
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  return (
    <>
      <div className="kanban-board">
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            label={col.label}
            accentColor={col.color}
            todos={filteredTodos.filter(t => t.status === col.status)}
            query={query}
            onAdd={({ title, ...extras }) => addTodo(title, extras)}
            onUpdateStatus={updateStatus}
            onDelete={deleteTodo}
            onEdit={setEditingTodo}
          />
        ))}
      </div>

      {editingTodo && (
        <AddTaskModal
          initialStatus={editingTodo.status}
          initialTodo={editingTodo}
          onClose={() => setEditingTodo(null)}
          onSubmit={() => {}}
          onUpdate={updates => updateTask(editingTodo.id, updates)}
        />
      )}
    </>
  )
}
