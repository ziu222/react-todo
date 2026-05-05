export interface ThemeColors {
  // Page & surface
  bgPage:      string
  bgCard:      string
  bgCardHover: string
  bgSidebar:   string
  cardBorder:  string
  cardShadow:  string

  // Text
  textPrimary:   string
  textSecondary: string
  textMuted:     string
  textOnAccent:  string

  // Accent
  accent:       string
  accentLight:  string
  accentGlow:   string
  accentSubtle: string

  // Input / border
  borderColor:  string
  inputBg:      string
}

export interface Theme {
  id:     string
  name:   string
  mode:   'light' | 'dark'
  colors: ThemeColors
  apply(): void
}

// ── Factory Method ─────────────────────────────────────────────────────────────
export function createTheme(id: string, name: string, mode: 'light' | 'dark', colors: ThemeColors): Theme {
  return {
    id,
    name,
    mode,
    colors,
    apply() {
      const r = document.documentElement
      r.style.setProperty('--bg-page',        this.colors.bgPage)
      r.style.setProperty('--bg-card',        this.colors.bgCard)
      r.style.setProperty('--bg-card-hover',  this.colors.bgCardHover)
      r.style.setProperty('--bg-sidebar',     this.colors.bgSidebar)
      r.style.setProperty('--card-border',    this.colors.cardBorder)
      r.style.setProperty('--card-shadow',    this.colors.cardShadow)
      r.style.setProperty('--text-primary',   this.colors.textPrimary)
      r.style.setProperty('--text-secondary', this.colors.textSecondary)
      r.style.setProperty('--text-muted',     this.colors.textMuted)
      r.style.setProperty('--text-on-accent', this.colors.textOnAccent)
      r.style.setProperty('--accent',         this.colors.accent)
      r.style.setProperty('--accent-light',   this.colors.accentLight)
      r.style.setProperty('--accent-glow',    this.colors.accentGlow)
      r.style.setProperty('--accent-subtle',  this.colors.accentSubtle)
      r.style.setProperty('--border-color',   this.colors.borderColor)
      r.style.setProperty('--input-bg',       this.colors.inputBg)
      r.setAttribute('data-theme-mode', mode)
    },
  }
}

// ── Concrete themes (products) ─────────────────────────────────────────────────

export const THEMES: Record<string, Theme> = {
  // ── Light themes ──
  lightPurple: createTheme('lightPurple', 'Purple', 'light', {
    bgPage:      '#F5F3FF',
    bgCard:      '#FFFFFF',
    bgCardHover: '#F9F7FF',
    bgSidebar:   '#FFFFFF',
    cardBorder:  'rgba(139, 92, 246, 0.12)',
    cardShadow:  '0 2px 12px rgba(139, 92, 246, 0.08), 0 1px 3px rgba(0,0,0,0.06)',
    textPrimary:   '#1F1235',
    textSecondary: '#6B7280',
    textMuted:     '#9CA3AF',
    textOnAccent:  '#FFFFFF',
    accent:       '#8B5CF6',
    accentLight:  '#A78BFA',
    accentGlow:   'rgba(139, 92, 246, 0.30)',
    accentSubtle: 'rgba(139, 92, 246, 0.10)',
    borderColor:  'rgba(139, 92, 246, 0.15)',
    inputBg:      '#F5F3FF',
  }),

  lightOcean: createTheme('lightOcean', 'Ocean', 'light', {
    bgPage:      '#EFF6FF',
    bgCard:      '#FFFFFF',
    bgCardHover: '#F0F7FF',
    bgSidebar:   '#FFFFFF',
    cardBorder:  'rgba(37, 99, 235, 0.12)',
    cardShadow:  '0 2px 12px rgba(37, 99, 235, 0.08), 0 1px 3px rgba(0,0,0,0.06)',
    textPrimary:   '#0F172A',
    textSecondary: '#64748B',
    textMuted:     '#94A3B8',
    textOnAccent:  '#FFFFFF',
    accent:       '#2563EB',
    accentLight:  '#3B82F6',
    accentGlow:   'rgba(37, 99, 235, 0.30)',
    accentSubtle: 'rgba(37, 99, 235, 0.10)',
    borderColor:  'rgba(37, 99, 235, 0.15)',
    inputBg:      '#EFF6FF',
  }),

  // ── Dark themes ──
  darkPurple: createTheme('darkPurple', 'Dark Purple', 'dark', {
    bgPage:      '#0f0f13',
    bgCard:      'rgba(255, 255, 255, 0.04)',
    bgCardHover: 'rgba(255, 255, 255, 0.07)',
    bgSidebar:   '#13131a',
    cardBorder:  'rgba(255, 255, 255, 0.09)',
    cardShadow:  '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
    textPrimary:   '#F0F0F5',
    textSecondary: '#9090A0',
    textMuted:     '#5A5A6E',
    textOnAccent:  '#FFFFFF',
    accent:       '#7C3AED',
    accentLight:  '#9D5CF2',
    accentGlow:   'rgba(124, 58, 237, 0.35)',
    accentSubtle: 'rgba(124, 58, 237, 0.25)',
    borderColor:  'rgba(255, 255, 255, 0.10)',
    inputBg:      'rgba(255, 255, 255, 0.05)',
  }),

  darkOcean: createTheme('darkOcean', 'Dark Ocean', 'dark', {
    bgPage:      '#0a0f1e',
    bgCard:      'rgba(255, 255, 255, 0.04)',
    bgCardHover: 'rgba(255, 255, 255, 0.07)',
    bgSidebar:   '#0d1424',
    cardBorder:  'rgba(255, 255, 255, 0.09)',
    cardShadow:  '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
    textPrimary:   '#F0F4FF',
    textSecondary: '#8090A8',
    textMuted:     '#4A5A72',
    textOnAccent:  '#FFFFFF',
    accent:       '#2563EB',
    accentLight:  '#3B82F6',
    accentGlow:   'rgba(37, 99, 235, 0.35)',
    accentSubtle: 'rgba(37, 99, 235, 0.25)',
    borderColor:  'rgba(255, 255, 255, 0.10)',
    inputBg:      'rgba(255, 255, 255, 0.05)',
  }),
}

export const DEFAULT_THEME = THEMES.lightPurple
