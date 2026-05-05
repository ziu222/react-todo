import { useState, useEffect } from 'react'
import { THEMES, DEFAULT_THEME } from '../styles/themeFactory'
import type { Theme } from '../styles/themeFactory'

const THEME_KEY = 'todo:theme'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_KEY)
    return saved && THEMES[saved] ? THEMES[saved] : DEFAULT_THEME
  })

  useEffect(() => {
    theme.apply()
    localStorage.setItem(THEME_KEY, theme.id)
  }, [theme])

  return {
    theme,
    themes: Object.values(THEMES),
    setTheme: (id: string) => {
      if (THEMES[id]) setThemeState(THEMES[id])
    },
  }
}
