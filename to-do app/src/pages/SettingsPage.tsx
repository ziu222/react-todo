import { useState, useRef } from 'react'
import { useUserContext } from '../app/UserContext'
import { useTodosContext } from '../app/TodosContext'
import { loadTodos, isValidTodo } from '../features/todos/api/storage'
import ProfileBanner from '../components/settings/ProfileBanner'
import ThemeSelector from '../components/settings/ThemeSelector'
import './SettingsPage.css'

type Tab = 'details' | 'theme'

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('details')
  const { user, setFirstName, setLastName, setEmail, setCoverColor } = useUserContext()
  const { importTodos } = useTodosContext()
  const importInputRef = useRef<HTMLInputElement>(null)
  const [importMsg, setImportMsg] = useState('')

  function handleExport() {
    const todos = loadTodos() ?? []
    const blob = new Blob([JSON.stringify(todos, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todos-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportFile(file: File) {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const raw = JSON.parse(e.target?.result as string)
        if (!Array.isArray(raw)) throw new Error()
        const valid = raw.filter(isValidTodo)
        importTodos(valid)
        setImportMsg(`Imported ${valid.length} task${valid.length !== 1 ? 's' : ''}.`)
      } catch {
        setImportMsg('Invalid backup file — no tasks imported.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="settings-page">
      <ProfileBanner />

      <div className="settings-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'details'}
          className={`settings-tab${tab === 'details' ? ' active' : ''}`}
          onClick={() => setTab('details')}
        >
          My Details
        </button>
        <button
          role="tab"
          aria-selected={tab === 'theme'}
          className={`settings-tab${tab === 'theme' ? ' active' : ''}`}
          onClick={() => setTab('theme')}
        >
          Theme
        </button>
      </div>

      <div className="settings-panel" role="tabpanel">
        {tab === 'details' && (
          <div className="settings-form">
            <h3 className="settings-section-title">Profile details</h3>
            <div className="settings-row">
              <label className="settings-label">
                First name
                <input
                  className="settings-input"
                  type="text"
                  value={user.firstName}
                  onChange={e => setFirstName(e.target.value)}
                  maxLength={80}
                />
              </label>
              <label className="settings-label">
                Last name
                <input
                  className="settings-input"
                  type="text"
                  value={user.lastName}
                  onChange={e => setLastName(e.target.value)}
                  maxLength={80}
                />
              </label>
            </div>
            <label className="settings-label">
              Email
              <input
                className="settings-input"
                type="email"
                value={user.email}
                onChange={e => setEmail(e.target.value)}
                maxLength={200}
              />
            </label>

            <h3 className="settings-section-title" style={{ marginTop: 24 }}>Data</h3>
            <div className="settings-data-row">
              <button className="settings-data-btn" onClick={handleExport}>
                ⬇ Export tasks
              </button>
              <button className="settings-data-btn" onClick={() => importInputRef.current?.click()}>
                ⬆ Import tasks
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept=".json"
                className="sr-only"
                onChange={e => { if (e.target.files?.[0]) handleImportFile(e.target.files[0]); e.target.value = '' }}
              />
            </div>
            {importMsg && <p className="settings-import-msg">{importMsg}</p>}

            <h3 className="settings-section-title" style={{ marginTop: 24 }}>Appearance</h3>
            <label className="settings-label">
              Cover gradient
              <div className="color-row">
                <input
                  type="color"
                  className="color-picker"
                  defaultValue="#a78bfa"
                  onChange={e => setCoverColor(`linear-gradient(135deg, ${e.target.value} 0%, #3b82f6 100%)`)}
                  aria-label="Cover color start"
                />
                <span className="settings-hint">Pick the start colour for your profile cover.</span>
              </div>
            </label>
          </div>
        )}

        {tab === 'theme' && <ThemeSelector />}
      </div>
    </div>
  )
}
