import { useUserContext } from '../../app/UserContext'
import './ProfileBanner.css'

export default function ProfileBanner() {
  const { user, initials } = useUserContext()

  return (
    <div className="profile-banner">
      <div
        className="profile-banner-cover"
        style={{ background: user.coverColor }}
        aria-hidden="true"
      />
      <div className="profile-banner-body">
        <div className="profile-avatar">
          {user.avatar
            ? <img src={user.avatar} alt={user.firstName} />
            : <span>{initials}</span>
          }
        </div>
        <div className="profile-info">
          <span className="profile-name">
            {[user.firstName, user.lastName].filter(Boolean).join(' ')}
          </span>
          <span className="profile-email">{user.email}</span>
        </div>
      </div>
    </div>
  )
}
