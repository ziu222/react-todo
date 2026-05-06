import { useState } from 'react'
import { useUserContext } from '../app/UserContext'
import ProfileBanner from '../components/settings/ProfileBanner'
import ThemeSelector from '../components/settings/ThemeSelector'
import './SettingsPage.css'

type Tab = 'details' | 'theme'

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('details')
  const { user, setFirstName, setLastName, setEmail, setCoverColor } = useUserContext()

  return (
    <div className="settings-page">
      <ProfileBanner />

      <div className="settings-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'details'}
          className={`settings-tab${tab === 'details' ? ' active' : ''}`}
          onClick={() => setTab('details')}
        >
          My Details
        </button>
        <button
          role="tab"
          aria-selected={tab === 'theme'}
          className={`settings-tab${tab === 'theme' ? ' active' : ''}`}
          onClick={() => setTab('theme')}
        >
          Theme
        </button>
      </div>

      <div className="settings-panel" role="tabpanel">
        {tab === 'details' && (
          <div className="settings-form">
            <h3 className="settings-section-title">Profile details</h3>
            <div className="settings-row">
              <label className="settings-label">
                First name
                <input
                  className="settings-input"
                  type="text"
                  value={user.firstName}
                  onChange={e => setFirstName(e.target.value)}
                  maxLength={80}
                />
              </label>
              <label className="settings-label">
                Last name
                <input
                  className="settings-input"
                  type="text"
                  value={user.lastName}
                  onChange={e => setLastName(e.target.value)}
                  maxLength={80}
                />
              </label>
            </div>
            <label className="settings-label">
              Email
              <input
                className="settings-input"
                type="email"
                value={user.email}
                onChange={e => setEmail(e.target.value)}
                maxLength={200}
              />
            </label>

            <h3 className="settings-section-title" style={{ marginTop: 24 }}>Appearance</h3>
            <label className="settings-label">
              Cover gradient
              <div className="color-row">
                <input
                  type="color"
                  className="color-picker"
                  defaultValue="#a78bfa"
                  onChange={e => setCoverColor(`linear-gradient(135deg, ${e.target.value} 0%, #3b82f6 100%)`)}
                  aria-label="Cover color start"
                />
                <span className="settings-hint">Pick the start colour for your profile cover.</span>
              </div>
            </label>
          </div>
        )}

        {tab === 'theme' && <ThemeSelector />}
      </div>
    </div>
  )
}
