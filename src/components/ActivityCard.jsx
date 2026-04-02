import React from 'react'

export default function ActivityCard({ activity, result, locked, onClick }) {
  const done = !!result && !locked
  const perfect = done && result.score === result.maxScore

  return (
    <button
      className={`activity-card activity-card--${activity.difficulty}
        ${done   ? 'activity-card--done'   : ''}
        ${locked ? 'activity-card--locked' : ''}
      `}
      onClick={onClick}
      disabled={locked}
      title={locked ? 'Complete more activities to unlock this tier' : ''}
    >
      <div className="card-top">
        <span className="card-emoji">{locked ? '🔒' : activity.emoji}</span>
        {done && (
          <span className="card-badge" title={`${result.score}/${result.maxScore} points`}>
            {perfect ? '⭐' : '✓'}
          </span>
        )}
      </div>
      <h3 className="card-title">{locked ? '???' : activity.title}</h3>
      <p className="card-desc">{locked ? 'Complete more activities to unlock this tier.' : activity.description}</p>
      {!locked && activity.skill && (
        <p className="card-skill">🎯 {activity.skill}</p>
      )}
      <div className="card-footer">
        <span className={`diff-pill diff-pill--${activity.difficulty}`}>
          {activity.difficulty}
        </span>
        {done && (
          <span className="card-score">{result.score}/{result.maxScore} pts</span>
        )}
      </div>
    </button>
  )
}
