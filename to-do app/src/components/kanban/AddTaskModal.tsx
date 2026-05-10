import { useState, useRef, useCallback, useEffect } from 'react'
import type { Todo, TodoStatus, Priority, Attachment } from '../../features/todos/model/todoLogic'
import { calcProgressPreview } from '../../features/todos/model/todoLogic'
import './AddTaskModal.css'

const PRESET_TAGS   = ['Planning', 'Research', 'Content', 'Development', 'Design', 'Marketing']
const QUICK_EMOJIS  = ['🔥', '⭐', '✅', '📌', '🚀', '💡', '🐛', '⚠️', '🎯', '📝']

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'low',    label: 'Low Priority'    },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high',   label: 'High Priority'   },
]

// Parse a YYYY-MM-DD string as local midnight timestamp
function dateStrToMs(s: string): number {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d).getTime()
}

interface AddTaskModalProps {
  initialStatus: TodoStatus
  initialTodo?:  Todo
  onClose:  () => void
  onSubmit: (data: {
    title:        string
    status:       TodoStatus
    emoji?:       string
    startDay?:    number
    endDay?:      number
    priority?:    Priority
    tags?:        string[]
    description?: string
    attachments?: Attachment[]
  }) => void
  onUpdate?: (updates: {
    title:        string
    emoji?:       string
    startDay?:    number
    endDay?:      number
    priority?:    Priority
    tags?:        string[]
    description?: string
    attachments?: Attachment[]
  }) => void
}

function readFileAsBase64(file: File): Promise<Attachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = e => resolve({ name: file.name, type: file.type, data: e.target!.result as string })
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

function IconUpload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <polyline points="9 15 12 12 15 15" />
    </svg>
  )
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

function IconInfo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function msToDateStr(ms: number): string {
  const d = new Date(ms)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function AddTaskModal({ initialStatus, initialTodo, onClose, onSubmit, onUpdate }: AddTaskModalProps) {
  const todayStr  = new Date().toISOString().split('T')[0]
  const isEditing = !!initialTodo

  const [title,       setTitle]       = useState(initialTodo?.title ?? '')
  const [emoji,       setEmoji]       = useState(initialTodo?.emoji ?? '')
  const [startDay,    setStartDay]    = useState(initialTodo?.startDay ? msToDateStr(initialTodo.startDay) : '')
  const [endDay,      setEndDay]      = useState(initialTodo?.endDay   ? msToDateStr(initialTodo.endDay)   : '')
  const [priority,    setPriority]    = useState<Priority>(initialTodo?.priority ?? 'medium')
  const [tags,        setTags]        = useState<string[]>(initialTodo?.tags ?? [])
  const [customTag,   setCustomTag]   = useState('')
  const [description, setDescription] = useState(initialTodo?.description ?? '')
  const [attachments, setAttachments] = useState<Attachment[]>(initialTodo?.attachments ?? [])
  const [dragging,    setDragging]    = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!initialTodo) return
    setTitle(initialTodo.title)
    setEmoji(initialTodo.emoji ?? '')
    setStartDay(initialTodo.startDay ? msToDateStr(initialTodo.startDay) : '')
    setEndDay(initialTodo.endDay     ? msToDateStr(initialTodo.endDay)   : '')
    setPriority(initialTodo.priority ?? 'medium')
    setTags(initialTodo.tags ?? [])
    setDescription(initialTodo.description ?? '')
    setAttachments(initialTodo.attachments ?? [])
  }, [])

  // Derive progress from selected dates
  const startMs      = startDay ? dateStrToMs(startDay) : null
  const endMs        = endDay   ? dateStrToMs(endDay)   : null
  const todayMs      = new Date().setHours(0, 0, 0, 0)
  const autoProgress = startMs !== null && endMs !== null && endMs >= startMs
    ? calcProgressPreview(startMs, endMs)
    : null
  const willBeDone   = endMs !== null && endMs < todayMs

  function toggleTag(tag: string) {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  function addCustomTag(e: React.KeyboardEvent) {
    if (e.key !== 'Enter') return
    const val = customTag.trim()
    if (val && !tags.includes(val)) setTags(prev => [...prev, val])
    setCustomTag('')
  }

  async function processFiles(files: FileList | File[]) {
    const arr = Array.from(files).slice(0, 5)
    const results = await Promise.all(arr.map(readFileAsBase64))
    setAttachments(prev => [...prev, ...results].slice(0, 5))
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    processFiles(e.dataTransfer.files)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const payload = {
      title:       title.trim(),
      startDay:    startMs ?? undefined,
      endDay:      endMs   ?? undefined,
      priority,
      tags:        tags.length        ? tags        : undefined,
      description: description.trim() || undefined,
      attachments: attachments.length ? attachments : undefined,
    }
    const emojiVal = emoji.trim() || undefined
    if (isEditing && onUpdate) {
      onUpdate({ ...payload, emoji: emojiVal })
    } else {
      onSubmit({ ...payload, emoji: emojiVal, status: initialStatus })
    }
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={isEditing ? 'Edit task' : 'Add new task'}>
        <div className="modal-header">
          <h2 className="modal-title">{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close"><IconX /></button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="modal-grid">
            {/* ── Left column ── */}
            <div className="modal-col">
              {/* Card 1: Task Details */}
              <div className="modal-card">
                <h3 className="modal-card-title">Task Details</h3>

                <label className="modal-field-label">
                  TASK TITLE
                  <input
                    autoFocus
                    className="modal-input"
                    type="text"
                    placeholder="Enter task name..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    maxLength={500}
                    required
                  />
                </label>

                <div className="modal-field-label">
                  EMOJI
                  <div className="emoji-picker-row">
                    {QUICK_EMOJIS.map(e => (
                      <button
                        key={e}
                        type="button"
                        className={`emoji-quick-btn${emoji === e ? ' active' : ''}`}
                        onClick={() => setEmoji(prev => prev === e ? '' : e)}
                        aria-label={`Pick emoji ${e}`}
                      >
                        {e}
                      </button>
                    ))}
                    <input
                      className="emoji-custom-input"
                      type="text"
                      placeholder="✏️"
                      value={emoji}
                      onChange={e => setEmoji(e.target.value.slice(-2))}
                      maxLength={2}
                      aria-label="Custom emoji"
                    />
                  </div>
                </div>

                <div className="modal-row">
                  <label className="modal-field-label">
                    START DAY
                    <input
                      className="modal-input"
                      type="date"
                      value={startDay}
                      min={isEditing ? undefined : todayStr}
                      onChange={e => {
                        setStartDay(e.target.value)
                        if (endDay && e.target.value > endDay) setEndDay(e.target.value)
                      }}
                    />
                  </label>
                  <label className="modal-field-label">
                    END DAY
                    <input
                      className="modal-input"
                      type="date"
                      value={endDay}
                      min={startDay || todayStr}
                      onChange={e => setEndDay(e.target.value)}
                    />
                  </label>
                </div>

                <label className="modal-field-label">
                  PRIORITY
                  <select
                    className="modal-input modal-select"
                    value={priority}
                    onChange={e => setPriority(e.target.value as Priority)}
                  >
                    {PRIORITY_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>

                {willBeDone && (
                  <div className="modal-info-banner modal-warn-banner">
                    <IconInfo />
                    <p>End date is in the past — this task will be marked as <strong>Done</strong> automatically.</p>
                  </div>
                )}
              </div>

              {/* Card 2: Categorization */}
              <div className="modal-card">
                <h3 className="modal-card-title">Categorization</h3>

                <div className="modal-field-label">
                  CATEGORY TAGS
                  <div className="tag-row">
                    {PRESET_TAGS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        className={`tag-chip${tags.includes(tag) ? ' active' : ''}`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                    <input
                      className="tag-custom-input"
                      type="text"
                      placeholder="+ custom"
                      value={customTag}
                      onChange={e => setCustomTag(e.target.value)}
                      onKeyDown={addCustomTag}
                      maxLength={40}
                    />
                  </div>
                  {tags.filter(t => !PRESET_TAGS.includes(t)).map(t => (
                    <span key={t} className="tag-chip active custom">
                      {t}
                      <button type="button" onClick={() => toggleTag(t)} aria-label={`Remove ${t}`}>×</button>
                    </span>
                  ))}
                </div>

                <div className="modal-field-label">
                  <div className="progress-header">
                    <span>AUTO PROGRESS</span>
                    <span className="progress-value">
                      {autoProgress !== null ? `${autoProgress}%` : '—'}
                    </span>
                  </div>
                  {autoProgress !== null ? (
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${autoProgress}%` }} />
                    </div>
                  ) : (
                    <p className="progress-empty-hint">Set start &amp; end dates to auto-track progress</p>
                  )}
                  <div className="progress-labels">
                    <span>
                      {startDay
                        ? new Date(dateStrToMs(startDay)).toLocaleDateString('en', { month: 'short', day: 'numeric' })
                        : 'START'}
                    </span>
                    <span>
                      {endDay
                        ? new Date(dateStrToMs(endDay)).toLocaleDateString('en', { month: 'short', day: 'numeric' })
                        : 'END'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right column ── */}
            <div className="modal-col">
              {/* Card 3: Attachments */}
              <div className="modal-card">
                <h3 className="modal-card-title">Attachments</h3>
                <div
                  className={`drop-zone${dragging ? ' dragging' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragging(true)  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload attachment"
                >
                  <span className="drop-icon"><IconUpload /></span>
                  <p className="drop-text">Drag and drop files here or <span>click to browse</span></p>
                  <p className="drop-hint">PDF, JPG, PNG (MAX. 25MB)</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                  className="sr-only"
                  onChange={e => { if (e.target.files) processFiles(e.target.files) }}
                />
                {attachments.length > 0 && (
                  <ul className="attachment-list">
                    {attachments.map((a, i) => (
                      <li key={i} className="attachment-item">
                        <span className="attachment-name">{a.name}</span>
                        <button
                          type="button"
                          className="attachment-remove"
                          onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))}
                          aria-label={`Remove ${a.name}`}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Card 4: Description */}
              <div className="modal-card">
                <h3 className="modal-card-title">Description &amp; Notes</h3>
                <textarea
                  className="modal-textarea"
                  placeholder="Provide a detailed description of the task requirements..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={5}
                  maxLength={2000}
                />
                <div className="modal-info-banner">
                  <IconInfo />
                  <p>Saved details will appear on the task card and in the timeline view.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="modal-footer">
            <button type="button" className="modal-btn cancel" onClick={onClose}>Cancel</button>
            <button type="submit"  className="modal-btn submit">{isEditing ? 'Update Task' : 'Add Task'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
