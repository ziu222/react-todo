import { useRef } from 'react'
import { useUserContext } from '../../app/UserContext'
import './ProfileBanner.css'

function IconCamera() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function readFile(file: File, onLoad: (result: string) => void) {
  const reader = new FileReader()
  reader.onload = ev => { if (ev.target?.result) onLoad(ev.target.result as string) }
  reader.readAsDataURL(file)
}

export default function ProfileBanner() {
  const { user, initials, setAvatar, setCoverImage } = useUserContext()
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef  = useRef<HTMLInputElement>(null)

  const coverStyle = user.coverImage
    ? { backgroundImage: `url(${user.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: user.coverColor }

  return (
    <div className="profile-banner">
      {/* ── Cover ── */}
      <div className="profile-banner-cover" style={coverStyle}>
        <button
          className="cover-edit-btn"
          onClick={() => coverInputRef.current?.click()}
          aria-label="Change cover photo"
        >
          <IconCamera />
          Change cover
        </button>
      </div>
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, setCoverImage) }}
        tabIndex={-1}
      />

      {/* ── Avatar ── */}
      <button
        className="profile-avatar-btn"
        onClick={() => avatarInputRef.current?.click()}
        aria-label="Change avatar photo"
      >
        <div className="profile-avatar">
          {user.avatar
            ? <img src={user.avatar} alt={user.firstName} />
            : <span>{initials}</span>
          }
        </div>
        <div className="profile-avatar-overlay" aria-hidden="true">
          <IconCamera />
        </div>
      </button>
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={e => { const f = e.target.files?.[0]; if (f) readFile(f, setAvatar) }}
        tabIndex={-1}
      />

      {/* ── Name / email ── */}
      <div className="profile-info-bar">
        <span className="profile-name">
          {[user.firstName, user.lastName].filter(Boolean).join(' ')}
        </span>
        <span className="profile-email">{user.email}</span>
      </div>
    </div>
  )
}
