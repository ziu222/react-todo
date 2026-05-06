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

export default function ProfileBanner() {
  const { user, initials, setAvatar } = useUserContext()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setAvatar(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="profile-banner">
      <div
        className="profile-banner-cover"
        style={{ background: user.coverColor }}
        aria-hidden="true"
      />

      {/* Avatar: absolutely positioned, straddles cover/white boundary */}
      <button
        className="profile-avatar-btn"
        onClick={() => inputRef.current?.click()}
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
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFile}
        tabIndex={-1}
      />

      {/* Info: in-flow, starts after cover → always in the white area */}
      <div className="profile-info-bar">
        <span className="profile-name">
          {[user.firstName, user.lastName].filter(Boolean).join(' ')}
        </span>
        <span className="profile-email">{user.email}</span>
      </div>
    </div>
  )
}
