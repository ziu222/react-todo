import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { THEMES, DEFAULT_THEME, type Theme } from '../styles/themeFactory'

interface ThemeContextValue {
  theme:    Theme
  themes:   Theme[]
  setTheme: (id: string) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('todo:theme')
    return (saved && THEMES[saved]) ? THEMES[saved] : DEFAULT_THEME
  })

  useEffect(() => {
    theme.apply()
    localStorage.setItem('todo:theme', theme.id)
  }, [theme])

  return (
    <ThemeContext.Provider value={{
      theme,
      themes:   Object.values(THEMES),
      setTheme: (id: string) => { if (THEMES[id]) setThemeState(THEMES[id]) },
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeContext must be used inside ThemeProvider')
  return ctx
}
