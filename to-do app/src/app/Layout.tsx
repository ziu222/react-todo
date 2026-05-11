import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ThemeProvider } from './ThemeContext'
import { TodosProvider } from './TodosContext'
import { UserProvider } from './UserContext'
import Sidebar          from '../components/layout/Sidebar'
import TopBar           from '../components/layout/TopBar'
import BottomNav        from '../components/layout/BottomNav'
import ShortcutOverlay  from '../components/layout/ShortcutOverlay'
import '../components/layout/ShortcutOverlay.css'
import './Layout.css'

function KeyboardShortcuts({ onShowHelp }: { onShowHelp: () => void }) {
  const navigate = useNavigate()

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable

      if (e.key === '?' && !isEditing) {
        e.preventDefault()
        onShowHelp()
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
        navigate('/tasks')
        setTimeout(() => {
          const btn = document.querySelector<HTMLButtonElement>('[aria-label^="Add task to"]')
          btn?.click()
        }, 100)
        return
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [navigate, onShowHelp])

  return null
}

export default function Layout() {
  const location = useLocation()
  const [showShortcuts, setShowShortcuts] = useState(false)

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
          <KeyboardShortcuts onShowHelp={() => setShowShortcuts(true)} />
          {showShortcuts && <ShortcutOverlay onClose={() => setShowShortcuts(false)} />}
        </TodosProvider>
      </UserProvider>
    </ThemeProvider>
  )
}
