import React from 'react'
import ActivityCard from './ActivityCard'
import { UNLOCK_REQUIREMENTS } from '../data/activities'

const DIFFICULTY_ORDER = ['easy', 'medium', 'hard']

export default function ActivityList({ activities, completedActivities, onSelectActivity }) {
  const totalCompleted = Object.keys(completedActivities).length
  const allDone = totalCompleted === activities.length

  function isUnlocked(diff) {
    const req = UNLOCK_REQUIREMENTS[diff]
    if (!req.requiredDifficulty) return true
    const completedInPrev = activities.filter(
      a => a.difficulty === req.requiredDifficulty && completedActivities[a.id]
    ).length
    return completedInPrev >= req.requiredCount
  }

  function completedInDiff(diff) {
    return activities.filter(a => a.difficulty === diff && completedActivities[a.id]).length
  }

  return (
    <div className="activity-list-page">
      <div className="mission-brief">
        <h1 className="mission-title">Your Mission, Detective</h1>
        <p className="mission-desc">
          Data is full of clues waiting to be uncovered. Complete the Easy cases first to unlock Medium, then crack Medium to unlock Hard!
        </p>
        {allDone && (
          <div className="all-done-banner">
            <span>🏆</span>
            <span>Outstanding work! You've cracked every case!</span>
          </div>
        )}
      </div>

      {DIFFICULTY_ORDER.map(diff => {
        const group = activities.filter(a => a.difficulty === diff)
        const unlocked = isUnlocked(diff)
        const req = UNLOCK_REQUIREMENTS[diff]
        const completed = completedInDiff(diff)

        return (
          <section key={diff} className="difficulty-section">
            <div className="difficulty-heading-row">
              <h2 className={`difficulty-heading difficulty-heading--${diff} ${!unlocked ? 'difficulty-heading--locked' : ''}`}>
                <span className="diff-dot" />
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
                {!unlocked && <span className="lock-icon">🔒</span>}
              </h2>
              {unlocked && (
                <span className="diff-progress">
                  {completed}/{group.length} done
                </span>
              )}
              {!unlocked && (
                <span className="unlock-hint">
                  Complete {req.requiredCount} {req.requiredDifficulty} activities to unlock
                </span>
              )}
            </div>

            <div className={`activity-grid ${!unlocked ? 'activity-grid--locked' : ''}`}>
              {group.map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  result={completedActivities[activity.id]}
                  locked={!unlocked}
                  onClick={() => unlocked && onSelectActivity(activity.id)}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
