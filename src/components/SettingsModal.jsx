import React, { useState } from 'react'

export default function SettingsModal({ onReset, onClose }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Session Settings</h2>

        {!confirming ? (
          <>
            <p className="modal-body">
              Use this button to reset the session. All completed activities and scores will be cleared.
            </p>
            <div className="modal-actions">
              <button className="btn btn--danger" onClick={() => setConfirming(true)}>
                Reset Session
              </button>
              <button className="btn btn--ghost" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="modal-body modal-body--warn">
              Are you sure? All progress will be lost and cannot be recovered.
            </p>
            <div className="modal-actions">
              <button className="btn btn--danger" onClick={onReset}>
                Yes, Reset Everything
              </button>
              <button className="btn btn--ghost" onClick={() => setConfirming(false)}>
                Go Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
