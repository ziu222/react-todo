import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { ThemeProvider } from './ThemeContext'
import { TodosProvider } from './TodosContext'
import { useTodosContext } from './TodosContext'
import { UserProvider } from './UserContext'
import Sidebar          from '../components/layout/Sidebar'
import TopBar           from '../components/layout/TopBar'
import BottomNav        from '../components/layout/BottomNav'
import ShortcutOverlay  from '../components/layout/ShortcutOverlay'
import AddTaskModal     from '../components/kanban/AddTaskModal'
import type { AddTaskData } from '../components/kanban/KanbanColumn'
import '../components/layout/ShortcutOverlay.css'
import './Layout.css'

function GlobalAddModal({ onClose }: { onClose: () => void }) {
  const { addTodo } = useTodosContext()
  function handleSubmit(data: AddTaskData) {
    const { title, ...extras } = data
    addTodo(title, extras)
    onClose()
  }
  return (
    <AddTaskModal
      initialStatus="todo"
      onClose={onClose}
      onSubmit={handleSubmit}
    />
  )
}

function GlobalShortcuts() {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable

      if (e.key === '?' && !isEditing) {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('taskflow:show-shortcuts'))
        return
      }
      if (e.key === '/' && !isEditing) {
        e.preventDefault()
        const input = document.querySelector<HTMLInputElement>('.topbar-search-input')
        input?.focus()
        return
      }
      if ((e.key === 'n' || e.key === 'N') && !isEditing) {
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('taskflow:new-task'))
        return
      }
      if (e.key === 'Escape') {
        window.dispatchEvent(new CustomEvent('taskflow:escape'))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return null
}

export default function Layout() {
  const location = useLocation()
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showAddTask,   setShowAddTask]   = useState(false)

  useEffect(() => {
    const onShowShortcuts = () => setShowShortcuts(true)
    const onNewTask       = () => setShowAddTask(true)
    const onEscape        = () => { setShowShortcuts(false); setShowAddTask(false) }
    window.addEventListener('taskflow:show-shortcuts', onShowShortcuts)
    window.addEventListener('taskflow:new-task',       onNewTask)
    window.addEventListener('taskflow:escape',         onEscape)
    return () => {
      window.removeEventListener('taskflow:show-shortcuts', onShowShortcuts)
      window.removeEventListener('taskflow:new-task',       onNewTask)
      window.removeEventListener('taskflow:escape',         onEscape)
    }
  }, [])

  return (
    <ThemeProvider>
      <UserProvider>
        <TodosProvider>
          <div className="app-layout">
            <Sidebar />
            <div className="page-area">
              <TopBar />
              <main className="page-content">
                <div key={location.pathname} className="page-route">
                  <Outlet />
                </div>
              </main>
            </div>
            <BottomNav />
          </div>

          <GlobalShortcuts />

          {showShortcuts && (
            <ShortcutOverlay onClose={() => setShowShortcuts(false)} />
          )}

          {showAddTask && (
            <GlobalAddModal onClose={() => setShowAddTask(false)} />
          )}
        </TodosProvider>
      </UserProvider>
    </ThemeProvider>
  )
}
