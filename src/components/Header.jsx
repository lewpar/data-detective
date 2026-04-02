import React from 'react'

export default function Header({ completed, total, onSettingsClick, onLogoClick }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <header className="header">
      <button className="logo-btn" onClick={onLogoClick} title="Back to activities">
        <span className="logo-icon">🔎</span>
        <span className="logo-text">Data Detective</span>
      </button>

      <div className="header-progress">
        <span className="progress-label">
          {completed}/{total} solved
        </span>
        <div className="progress-track" title={`${pct}% complete`}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <button
        className="settings-btn"
        onClick={onSettingsClick}
        title="Settings / Reset session"
        aria-label="Settings"
      >
        <GearIcon />
      </button>
    </header>
  )
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
      <path d="M12 15.5A3.5 3.5 0 018.5 12 3.5 3.5 0 0112 8.5a3.5 3.5 0 013.5 3.5 3.5 3.5 0 01-3.5 3.5m7.43-2.92c.04-.34.07-.69.07-1.08s-.03-.73-.07-1.08l2.32-1.82c.21-.16.27-.45.12-.68l-2.2-3.81a.49.49 0 00-.61-.22l-2.74 1.1c-.57-.44-1.19-.81-1.87-1.09l-.42-2.92A.49.49 0 0014 2h-4a.49.49 0 00-.49.42l-.42 2.92c-.68.28-1.3.65-1.87 1.09L4.48 5.33a.49.49 0 00-.61.22L1.67 9.36a.48.48 0 00.12.68l2.32 1.82c-.04.35-.07.7-.07 1.08s.03.73.07 1.08L1.79 15.84a.48.48 0 00-.12.68l2.2 3.81c.12.22.39.29.61.22l2.74-1.1c.57.44 1.19.81 1.87 1.09l.42 2.92c.07.24.29.42.54.42h4c.25 0 .47-.18.54-.42l.42-2.92c.68-.28 1.3-.65 1.87-1.09l2.74 1.1c.22.07.49 0 .61-.22l2.2-3.81a.48.48 0 00-.12-.68l-2.32-1.82z" />
    </svg>
  )
}
