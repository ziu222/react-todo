import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useTodosContext } from '../../app/TodosContext'
import { useUserContext } from '../../app/UserContext'
import NotificationPanel from './NotificationPanel'
import './TopBar.css'

const PAGE_TITLES: Record<string, string> = {
  '/':         'Dashboard',
  '/timeline': 'Timeline',
  '/tasks':    'Tasks',
  '/settings': 'Settings',
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

function IconBell() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  )
}

function IconKeyboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8M6 10h.01" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export default function TopBar() {
  const location  = useLocation()
  const { query, setSearch, todos } = useTodosContext()
  const { user, initials }          = useUserContext()
  const [inputVal,    setInputVal]    = useState(query)
  const [showNotifs,  setShowNotifs]  = useState(false)

  const todayMs    = useMemo(() => new Date().setHours(0, 0, 0, 0), [])
  const tomorrowMs = todayMs + 86_400_000

  const overdueTodos  = useMemo(
    () => todos.filter(t => t.endDay != null && t.endDay < todayMs && t.status !== 'done'),
    [todos, todayMs]
  )
  const dueTodayTodos = useMemo(
    () => todos.filter(t => t.endDay != null && t.endDay >= todayMs && t.endDay < tomorrowMs && t.status !== 'done'),
    [todos, todayMs, tomorrowMs]
  )
  const highPriorityTodos = useMemo(() => {
    const urgentIds = new Set([...overdueTodos, ...dueTodayTodos].map(t => t.id))
    return todos.filter(t => t.priority === 'high' && t.status !== 'done' && !urgentIds.has(t.id))
  }, [todos, overdueTodos, dueTodayTodos])
  const hasNotifs = overdueTodos.length > 0 || dueTodayTodos.length > 0 || highPriorityTodos.length > 0

  const title = PAGE_TITLES[location.pathname] ?? 'My Todos'

  useEffect(() => {
    const t = setTimeout(() => setSearch(inputVal), 200)
    return () => clearTimeout(t)
  }, [inputVal, setSearch])

  useEffect(() => { setInputVal(query) }, [query])

  function openNewTask() {
    window.dispatchEvent(new CustomEvent('taskflow:new-task'))
  }

  function openShortcuts() {
    window.dispatchEvent(new CustomEvent('taskflow:show-shortcuts'))
  }

  return (
    <header className="topbar">
      <span className="topbar-title">{title}</span>

      <div className="topbar-search">
        <span className="topbar-search-icon"><IconSearch /></span>
        <input
          type="search"
          className="topbar-search-input"
          placeholder="Search tasks…"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          aria-label="Search tasks"
        />
        <span className="topbar-search-hint" aria-hidden="true">/</span>
      </div>

      <div className="topbar-actions">
        <button
          className="topbar-new-btn"
          onClick={openNewTask}
          aria-label="New task"
          title="New task (N)"
        >
          <IconPlus />
          <span className="topbar-new-label">New</span>
          <kbd className="topbar-kbd">N</kbd>
        </button>

        <button
          className="topbar-icon-btn"
          onClick={openShortcuts}
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts (?)"
        >
          <IconKeyboard />
        </button>

        <div className="topbar-notif-wrap">
          <button
            className="topbar-icon-btn"
            aria-label="Notifications"
            onClick={() => setShowNotifs(v => !v)}
          >
            <IconBell />
            {hasNotifs && <span className="topbar-badge" aria-hidden="true" />}
          </button>
          {showNotifs && (
            <NotificationPanel
              overdue={overdueTodos}
              dueToday={dueTodayTodos}
              highPriority={highPriorityTodos}
              onClose={() => setShowNotifs(false)}
            />
          )}
        </div>

        <div className="topbar-avatar" aria-label={`Avatar for ${user.firstName}`}>
          {user.avatar
            ? <img src={user.avatar} alt={user.firstName} />
            : initials
          }
        </div>
      </div>
    </header>
  )
}
