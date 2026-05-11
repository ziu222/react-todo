import { useState, useRef, useEffect } from 'react'
import { useTodosContext } from '../../app/TodosContext'
import type { Todo, TodoStatus } from '../../features/todos/model/todoLogic'
import KanbanColumn from './KanbanColumn'
import AddTaskModal from './AddTaskModal'
import BulkActionBar from './BulkActionBar'
import './KanbanBoard.css'

const COLUMNS: { status: TodoStatus; label: string; color: string }[] = [
  { status: 'backlog',      label: 'Backlog',     color: '#6B7280' },
  { status: 'todo',         label: 'To Do',       color: 'var(--status-todo)'        },
  { status: 'in-progress',  label: 'In Progress', color: 'var(--status-in-progress)' },
  { status: 'done',         label: 'Done',        color: 'var(--status-done)'        },
]

export default function KanbanBoard() {
  const { filteredTodos, query, addTodo, updateStatus, deleteTodo, updateTask, seedDemoTasks } = useTodosContext()
  const updateTitle = (id: string, title: string) => updateTask(id, { title })
  const [editingTodo,  setEditingTodo]  = useState<Todo | null>(null)
  const [selectedIds,  setSelectedIds]  = useState<Set<string>>(new Set())
  const [activeTag,    setActiveTag]    = useState<string | null>(null)
  const [dragId,       setDragId]       = useState<string | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const allTags      = Array.from(new Set(filteredTodos.flatMap(t => t.tags ?? []))).sort()
  const visibleTodos = activeTag ? filteredTodos.filter(t => t.tags?.includes(activeTag)) : filteredTodos
  const isEmpty      = filteredTodos.length === 0 && !query.trim()

  function handleDrop(targetStatus: TodoStatus) {
    if (dragId) {
      updateStatus(dragId, targetStatus)
      setDragId(null)
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function bulkMove(status: TodoStatus) {
    selectedIds.forEach(id => updateStatus(id, status))
    setSelectedIds(new Set())
  }

  function bulkDelete() {
    selectedIds.forEach(id => deleteTodo(id))
    setSelectedIds(new Set())
  }

  useEffect(() => {
    const board = boardRef.current
    if (!board) return
    const columns = board.querySelectorAll('.kanban-column')
    const dotsContainer = board.nextElementSibling
    const dots = dotsContainer?.querySelectorAll('.kanban-dot')
    if (!dots || dots.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const idx = Array.from(columns).indexOf(entry.target as HTMLElement)
          if (idx === -1) return
          dots[idx]?.classList.toggle('active', entry.isIntersecting)
        })
      },
      { root: board, threshold: 0.5 }
    )
    columns.forEach(col => observer.observe(col))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {allTags.length > 0 && (
        <div className="kanban-tag-filter">
          <button
            className={`kanban-tag-pill${activeTag === null ? ' active' : ''}`}
            onClick={() => setActiveTag(null)}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`kanban-tag-pill${activeTag === tag ? ' active' : ''}`}
              onClick={() => setActiveTag(prev => prev === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="kanban-board" ref={boardRef}>
        {isEmpty ? (
          <div className="kanban-empty-board">
            <span className="kanban-empty-board-emoji">📋</span>
            <span className="kanban-empty-board-title">Your board is empty</span>
            <span className="kanban-empty-board-sub">
              Create your first task or load sample data to explore all the features — tags, priorities, subtasks, and more.
            </span>
            <div className="kanban-empty-board-actions">
              <button
                className="kanban-empty-board-btn primary"
                onClick={() => window.dispatchEvent(new CustomEvent('taskflow:new-task'))}
              >
                + Create first task
                <kbd style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.2)', borderRadius: 3, padding: '1px 5px', marginLeft: 2 }}>N</kbd>
              </button>
              <button
                className="kanban-empty-board-btn secondary"
                onClick={seedDemoTasks}
              >
                🎲 Load sample tasks
              </button>
            </div>
          </div>
        ) : (
          COLUMNS.map(col => (
            <KanbanColumn
              key={col.status}
              status={col.status}
              label={col.label}
              accentColor={col.color}
              todos={visibleTodos.filter(t => t.status === col.status)}
              query={query}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
              onAdd={({ title, ...extras }) => addTodo(title, extras)}
              onUpdateStatus={updateStatus}
              onUpdateTitle={updateTitle}
              onDelete={deleteTodo}
              onEdit={setEditingTodo}
              dragId={dragId}
              onDragStart={setDragId}
              onDragEnd={() => setDragId(null)}
              onDrop={handleDrop}
            />
          ))
        )}
      </div>

      <div className="kanban-dots" aria-hidden="true">
        {COLUMNS.map(col => (
          <span key={col.status} className="kanban-dot" />
        ))}
      </div>

      {selectedIds.size > 0 && (
        <BulkActionBar
          count={selectedIds.size}
          onMoveAll={bulkMove}
          onDeleteAll={bulkDelete}
          onClear={() => setSelectedIds(new Set())}
        />
      )}

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
