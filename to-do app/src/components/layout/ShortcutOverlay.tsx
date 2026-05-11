interface ShortcutOverlayProps {
  onClose: () => void
}

const SHORTCUTS = [
  { key: 'N',    desc: 'Add new task (from any page)' },
  { key: '/',    desc: 'Focus search bar' },
  { key: '?',    desc: 'Show this shortcuts guide' },
  { key: 'Esc',  desc: 'Close any open modal' },
]

export default function ShortcutOverlay({ onClose }: ShortcutOverlayProps) {
  return (
    <div
      className="sc-backdrop"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="sc-panel" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
        <div className="sc-header">
          <span className="sc-title">Keyboard Shortcuts</span>
          <button className="sc-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="sc-list">
          {SHORTCUTS.map(s => (
            <li key={s.key} className="sc-item">
              <kbd className="sc-kbd">{s.key}</kbd>
              <span className="sc-desc">{s.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
