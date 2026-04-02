import React from 'react'

const MESSAGES = {
  perfect: ['Outstanding detective work! 🏆', 'Perfect score! You cracked the case! ⭐', 'Flawless! 100% correct! 🎉'],
  good:    ['Great job, detective! 🔍', 'Nice work — nearly there! 👍', 'Good detective instincts! 🕵️'],
  ok:      ['Keep investigating! You\'re getting there. 💪', 'Not bad — review the clues above! 📋'],
  low:     ['This one was tricky! Read the explanations to learn. 📚'],
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

export default function ResultBanner({ score, maxScore, onRetry, onBack, customMsg }) {
  const pct = maxScore > 0 ? score / maxScore : 0
  const tier = pct === 1 ? 'perfect' : pct >= 0.67 ? 'good' : pct >= 0.34 ? 'ok' : 'low'
  const msg = customMsg || pick(MESSAGES[tier])

  return (
    <div className={`result-banner result-banner--${tier}`}>
      <div className="result-score">
        {score}/{maxScore} points
      </div>
      <div className="result-stars">
        {Array.from({ length: maxScore }).map((_, i) => (
          <span key={i} className={i < score ? 'star star--on' : 'star star--off'}>★</span>
        ))}
      </div>
      <p className="result-msg">{msg}</p>
      <div className="result-actions">
        {onRetry && score < maxScore && (
          <button className="btn btn--ghost" onClick={onRetry}>Try Again</button>
        )}
        {onBack && (
          <button className="btn btn--primary" onClick={onBack}>← Back to Activities</button>
        )}
      </div>
    </div>
  )
}
