import { useThemeContext } from '../../app/ThemeContext'
import './ThemeSelector.css'

export default function ThemeSelector() {
  const { theme, themes, setTheme } = useThemeContext()

  return (
    <div className="theme-selector">
      <h3 className="settings-section-title">Appearance</h3>
      <div className="theme-grid">
        {themes.map(t => (
          <button
            key={t.id}
            className={`theme-swatch${theme.id === t.id ? ' active' : ''}`}
            onClick={() => setTheme(t.id)}
            aria-label={`${t.name} theme`}
            aria-pressed={theme.id === t.id}
          >
            <span
              className="theme-swatch-preview"
              style={{
                background: t.colors.bgPage,
                border: `2px solid ${t.colors.accent}`,
              }}
            >
              <span className="theme-swatch-accent" style={{ background: t.colors.accent }} />
            </span>
            <span className="theme-swatch-name">{t.name}</span>
            <span className={`theme-swatch-badge ${t.mode}`}>{t.mode}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
