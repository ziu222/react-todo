import { useTodosContext } from '../../app/TodosContext'
import type { TodoStatus } from '../../features/todos/model/todoLogic'
import KanbanColumn from './KanbanColumn'
import './KanbanBoard.css'

const COLUMNS: { status: TodoStatus; label: string; color: string }[] = [
  { status: 'backlog',      label: 'Backlog',     color: '#6B7280' },
  { status: 'todo',         label: 'To Do',       color: 'var(--status-todo)'        },
  { status: 'in-progress',  label: 'In Progress', color: 'var(--status-in-progress)' },
  { status: 'done',         label: 'Done',        color: 'var(--status-done)'        },
]

export default function KanbanBoard() {
  const { filteredTodos, query, addTodo, updateStatus, deleteTodo, pinTodo } = useTodosContext()

  return (
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
          onPin={pinTodo}
        />
      ))}
    </div>
  )
}
