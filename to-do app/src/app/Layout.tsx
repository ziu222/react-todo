import { Outlet, useLocation } from 'react-router-dom'
import { ThemeProvider } from './ThemeContext'
import { TodosProvider } from './TodosContext'
import { UserProvider } from './UserContext'
import Sidebar   from '../components/layout/Sidebar'
import TopBar    from '../components/layout/TopBar'
import BottomNav from '../components/layout/BottomNav'
import './Layout.css'
// ── Main layout component wrapping pages
export default function Layout() {
  const location = useLocation()
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
        </TodosProvider>
      </UserProvider>
    </ThemeProvider>
  )
}
