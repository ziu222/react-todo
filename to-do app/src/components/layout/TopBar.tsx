import { useLocation } from 'react-router-dom'
import { useTodosContext } from '../../app/TodosContext'
import { useUserContext } from '../../app/UserContext'
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

export default function TopBar() {
  const location  = useLocation()
  const { query, setSearch } = useTodosContext()
  const { user, initials }   = useUserContext()

  const title = PAGE_TITLES[location.pathname] ?? 'My Todos'

  return (
    <header className="topbar">
      <span className="topbar-title">{title}</span>

      <div className="topbar-search">
        <span className="topbar-search-icon"><IconSearch /></span>
        <input
          type="search"
          className="topbar-search-input"
          placeholder="Search tasks…"
          value={query}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search tasks"
        />
      </div>

      <div className="topbar-actions">
        <button className="topbar-icon-btn" aria-label="Notifications">
          <IconBell />
          <span className="topbar-badge" aria-hidden="true" />
        </button>

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
