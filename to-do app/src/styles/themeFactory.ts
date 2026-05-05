export interface ThemeColors {
  accent:       string
  accentLight:  string
  accentGlow:   string
  accentSubtle: string
}

export interface Theme {
  id:     string
  name:   string
  colors: ThemeColors
  apply(): void
}

// ── Factory Method ────────────────────────────────────────────────────────────
export function createTheme(id: string, name: string, colors: ThemeColors): Theme {
  return {
    id,
    name,
    colors,
    apply() {
      const root = document.documentElement
      root.style.setProperty('--accent',        this.colors.accent)
      root.style.setProperty('--accent-light',  this.colors.accentLight)
      root.style.setProperty('--accent-glow',   this.colors.accentGlow)
      root.style.setProperty('--accent-subtle', this.colors.accentSubtle)
    },
  }
}

// ── Concrete themes (products) ────────────────────────────────────────────────
export const THEMES: Record<string, Theme> = {
  violet: createTheme('violet', 'Violet', {
    accent:       '#7c3aed',
    accentLight:  '#9d5cf2',
    accentGlow:   'rgba(124, 58, 237, 0.35)',
    accentSubtle: 'rgba(124, 58, 237, 0.25)',
  }),
  ocean: createTheme('ocean', 'Ocean', {
    accent:       '#2563eb',
    accentLight:  '#3b82f6',
    accentGlow:   'rgba(37, 99, 235, 0.35)',
    accentSubtle: 'rgba(37, 99, 235, 0.25)',
  }),
  rose: createTheme('rose', 'Rose', {
    accent:       '#e11d48',
    accentLight:  '#fb7185',
    accentGlow:   'rgba(225, 29, 72, 0.35)',
    accentSubtle: 'rgba(225, 29, 72, 0.25)',
  }),
  forest: createTheme('forest', 'Forest', {
    accent:       '#059669',
    accentLight:  '#34d399',
    accentGlow:   'rgba(5, 150, 105, 0.35)',
    accentSubtle: 'rgba(5, 150, 105, 0.25)',
  }),
}

export const DEFAULT_THEME = THEMES.violet
