import { createBrowserRouter } from 'react-router-dom'
import Layout       from './Layout'
import DashboardPage from '../pages/DashboardPage'
import TimelinePage  from '../pages/TimelinePage'
import TasksPage     from '../pages/TasksPage'
import SettingsPage  from '../pages/SettingsPage'
// ── Router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,      element: <DashboardPage /> },
      { path: 'timeline', element: <TimelinePage />  },
      { path: 'tasks',    element: <TasksPage />     },
      { path: 'settings', element: <SettingsPage />  },
    ],
  },
])
