import { useState, useEffect, useRef } from 'react'
import { useUserContext } from '../app/UserContext'
import './AboutPage.css'

// ── Scroll-reveal hook ─────────────────────────────────────────────────────

function useReveal(delay = 0) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return {
    ref,
    className: `reveal-block${visible ? ' visible' : ''}`,
    style: { transitionDelay: `${delay}ms` } as React.CSSProperties,
  }
}

// ── Data ───────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: '🗂', title: 'Kanban Board',    desc: 'Drag-free multi-status columns for backlog, to-do, in-progress, and done' },
  { icon: '📅', title: 'Timeline View',   desc: 'Gantt-style bars showing every task across a 30-day rolling window' },
  { icon: '📊', title: 'Smart Dashboard', desc: "At-a-glance stats, progress charts, and today's remaining task list" },
  { icon: '⚡', title: 'Auto Progress',   desc: 'Progress calculated automatically from start/end dates or sub-tasks' },
  { icon: '🎨', title: 'Themes',          desc: 'Four built-in themes — light and dark purple and ocean variants' },
  { icon: '📦', title: 'Import / Export', desc: 'JSON backup and restore so your data is always portable' },
]

const TECH_STACK = ['React 19', 'TypeScript', 'Vite 8', 'React Router v7', 'Plain CSS']

// ── Component ──────────────────────────────────────────────────────────────

export default function AboutPage() {
  const { user, initials } = useUserContext()
  const featuresReveal = useReveal(0)
  const devReveal      = useReveal(100)
  const techReveal     = useReveal(200)

  return (
    <div className="about-page">

      {/* ── Hero ── */}
      <section className="ab-hero">
        <div className="ab-hero-eyebrow">Task Management React</div>
        <h1 className="ab-hero-title">FEATURE</h1>
      </section>

      {/* ── Features ── */}
      <section
        {...featuresReveal}
        ref={featuresReveal.ref as React.RefObject<HTMLElement>}
      >
        <p className="ab-section-label">Features</p>
        <div className="ab-features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="ab-feature-card">
              <span className="ab-feature-icon">{f.icon}</span>
              <span className="ab-feature-title">{f.title}</span>
              <span className="ab-feature-desc">{f.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Developer ── */}
      <section
        {...devReveal}
        ref={devReveal.ref as React.RefObject<HTMLElement>}
        style={{ ...devReveal.style, marginBottom: '48px' }}
      >
        <p className="ab-section-label">Developer</p>
        <div className="ab-dev-card">
          <div className="ab-dev-avatar">{initials}</div>
          <div>
            <div className="ab-dev-name">{user.firstName}{user.lastName ? ` ${user.lastName}` : ''}</div>
            <div className="ab-dev-email">{user.email}</div>
            <div className="ab-dev-role">Full-Stack Developer in Future :D(FE rn)</div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section
        {...techReveal}
        ref={techReveal.ref as React.RefObject<HTMLElement>}
      >
        <p className="ab-section-label">Built With</p>
        <div className="ab-tech-row">
          {TECH_STACK.map(t => (
            <span key={t} className="ab-tech-badge">{t}</span>
          ))}
        </div>
      </section>

    </div>
  )
}
