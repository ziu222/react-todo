import { useState } from 'react'
import type { TodoStatus } from '../../features/todos/model/todoLogic'
import { STATUS_LABEL } from '../../features/todos/model/todoLogic'
import './BulkActionBar.css'

const MOVE_STATUSES: TodoStatus[] = ['backlog', 'todo', 'in-progress', 'done']

interface BulkActionBarProps {
  count:       number
  onMoveAll:   (status: TodoStatus) => void
  onDeleteAll: () => void
  onClear:     () => void
}

export default function BulkActionBar({ count, onMoveAll, onDeleteAll, onClear }: BulkActionBarProps) {
  const [moveOpen, setMoveOpen] = useState(false)

  return (
    <div className="bulk-bar" role="toolbar" aria-label="Bulk actions">
      <span className="bulk-bar-count">{count} selected</span>

      <div className="bulk-bar-divider" />

      <div className="bulk-bar-move-wrap">
        <button
          className="bulk-bar-btn"
          onClick={() => setMoveOpen(o => !o)}
          aria-haspopup="listbox"
          aria-expanded={moveOpen}
        >
          Move to ▾
        </button>
        {moveOpen && (
          <ul className="bulk-bar-dropdown" role="listbox">
            {MOVE_STATUSES.map(s => (
              <li key={s}>
                <button
                  className="bulk-bar-dropdown-item"
                  role="option"
                  onClick={() => { onMoveAll(s); setMoveOpen(false) }}
                >
                  {STATUS_LABEL[s]}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className="bulk-bar-btn danger" onClick={onDeleteAll}>
        Delete all
      </button>

      <button className="bulk-bar-close" onClick={onClear} aria-label="Clear selection">
        ✕
      </button>
    </div>
  )
}
