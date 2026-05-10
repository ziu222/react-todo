import { useState, useEffect, useRef } from 'react'
import './ContactPage.css'

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

// ── Icons ──────────────────────────────────────────────────────────────────

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.031 1.531 1.031.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

// ── Data ───────────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  {
    icon: <GitHubIcon />,
    label: 'GitHub',
    handle: '@ziu222',
    desc: 'View projects and source code',
    href: 'https://github.com/ziu222',
    color: '#6e40c9',
  },
  {
    icon: <EmailIcon />,
    label: 'Email',
    handle: 'btn2812@gmail.com',
    desc: 'Send a message directly',
    href: 'mailto:btn2812@gmail.com',
    color: '#EA4335',
  },
  {
    icon: <LinkedInIcon />,
    label: 'LinkedIn',
    handle: '/in/btn2812',
    desc: 'Professional network',
    href: 'https://www.linkedin.com/in/btn2812',
    color: '#0A66C2',
  },
]

// ── Component ──────────────────────────────────────────────────────────────

export default function ContactPage() {
  const linksReveal = useReveal(0)

  return (
    <div className="contact-page">

      {/* ── Hero ── */}
      <section className="ct-hero">
        <div className="ct-hero-eyebrow">Get in Touch</div>
        <h1 className="ct-hero-title">LET'S<br />CONNECT</h1>
        <p className="ct-hero-sub">Reach out through any of the channels below</p>
      </section>

      {/* ── Links ── */}
      <section
        {...linksReveal}
        ref={linksReveal.ref as React.RefObject<HTMLElement>}
      >
        <p className="ct-section-label">Channels</p>
        <div className="ct-links">
          {SOCIAL_LINKS.map(link => (
            <a
              key={link.label}
              className="ct-link-card"
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              style={{ '--ct-color': link.color } as React.CSSProperties}
            >
              <div className="ct-link-icon">{link.icon}</div>
              <div className="ct-link-body">
                <div className="ct-link-label">{link.label}</div>
                <div className="ct-link-handle">{link.handle}</div>
                <div className="ct-link-desc">{link.desc}</div>
              </div>
              <span className="ct-link-arrow">→</span>
            </a>
          ))}
        </div>
      </section>

    </div>
  )
}
