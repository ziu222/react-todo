import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import type { Todo } from '../../features/todos/model/todoLogic'
import './TaskChart.css'

type Range = 'daily' | 'weekly' | 'monthly'

function buildDailyData(todos: Todo[]) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d
  })
  return days.map(d => {
    const label = d.toLocaleDateString('en', { weekday: 'short' })
    const start = new Date(d); start.setHours(0, 0, 0, 0)
    const end   = new Date(d); end.setHours(23, 59, 59, 999)
    return {
      name:    label,
      done:    todos.filter(t => t.status === 'done'        && t.createdAt >= start.getTime() && t.createdAt <= end.getTime()).length,
      created: todos.filter(t => t.createdAt >= start.getTime() && t.createdAt <= end.getTime()).length,
    }
  })
}

function buildWeeklyData(todos: Todo[]) {
  return Array.from({ length: 6 }, (_, i) => {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - (5 - i) * 7)
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)
    const label = `W${weekStart.toLocaleDateString('en', { month: 'short', day: 'numeric' })}`
    return {
      name:    label,
      done:    todos.filter(t => t.status === 'done' && t.createdAt >= weekStart.getTime() && t.createdAt <= weekEnd.getTime()).length,
      created: todos.filter(t => t.createdAt >= weekStart.getTime() && t.createdAt <= weekEnd.getTime()).length,
    }
  })
}

function buildMonthlyData(todos: Todo[]) {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const label = d.toLocaleDateString('en', { month: 'short' })
    return {
      name:    label,
      done:    todos.filter(t => {
        const td = new Date(t.createdAt)
        return t.status === 'done' && td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth()
      }).length,
      created: todos.filter(t => {
        const td = new Date(t.createdAt)
        return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth()
      }).length,
    }
  })
}

interface TaskChartProps { todos: Todo[] }

export default function TaskChart({ todos }: TaskChartProps) {
  const [range, setRange] = useState<Range>('daily')

  const data = range === 'daily'   ? buildDailyData(todos)
             : range === 'weekly'  ? buildWeeklyData(todos)
             : buildMonthlyData(todos)

  return (
    <div className="task-chart">
      <div className="task-chart-header">
        <span className="task-chart-title">Task Progress</span>
        <div className="task-chart-tabs" role="group" aria-label="Range">
          {(['daily', 'weekly', 'monthly'] as Range[]).map(r => (
            <button
              key={r}
              className={`task-chart-tab${range === r ? ' active' : ''}`}
              onClick={() => setRange(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="gradDone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--accent)"       stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--accent)"       stopOpacity={0}    />
            </linearGradient>
            <linearGradient id="gradCreated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10B981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: 'var(--text-secondary)' }}
          />
          <Area type="monotone" dataKey="done"    stroke="var(--accent)" strokeWidth={2} fill="url(#gradDone)"    name="Done"    />
          <Area type="monotone" dataKey="created" stroke="#10B981"       strokeWidth={2} fill="url(#gradCreated)" name="Created" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
