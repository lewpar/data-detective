import React, { useState } from 'react'
import { useSession } from './hooks/useSession'
import LandingPage from './components/LandingPage'
import ActivityList from './components/ActivityList'
import ActivityRunner from './components/ActivityRunner'
import SettingsModal from './components/SettingsModal'
import Header from './components/Header'
import { ACTIVITIES, UNLOCK_REQUIREMENTS, DIFFICULTY_LABELS } from './data/activities'

function getUnlockProgress(completedActivities) {
  for (const diff of ['medium', 'hard']) {
    const req = UNLOCK_REQUIREMENTS[diff]
    const done = ACTIVITIES.filter(
      a => a.difficulty === req.requiredDifficulty && completedActivities[a.id]
    ).length
    if (done < req.requiredCount) {
      return {
        current: done,
        total: req.requiredCount,
        label: `${done}/${req.requiredCount} ${DIFFICULTY_LABELS[req.requiredDifficulty]} · unlocks ${DIFFICULTY_LABELS[diff]}`,
      }
    }
  }
  const total = ACTIVITIES.length
  const current = Object.keys(completedActivities).length
  return { current, total, label: `${current}/${total} solved` }
}

export default function App() {
  const { session, completeActivity, resetSession, markStarted } = useSession()
  const [activeId, setActiveId] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  const activeActivity = activeId ? ACTIVITIES.find(a => a.id === activeId) : null
  const progress = getUnlockProgress(session.completedActivities)

  if (!session.started) {
    return <LandingPage onStart={markStarted} />
  }

  return (
    <div className="app">
      <Header
        progressCurrent={progress.current}
        progressTotal={progress.total}
        progressLabel={progress.label}
        onSettingsClick={() => setShowSettings(true)}
        onLogoClick={() => setActiveId(null)}
      />

      <main className="main-content">
        {activeActivity ? (
          <ActivityRunner
            activity={activeActivity}
            savedResult={session.completedActivities[activeId]}
            onComplete={(score, maxScore, answers) => {
              completeActivity(activeId, score, maxScore, answers)
            }}
            onBack={() => setActiveId(null)}
          />
        ) : (
          <ActivityList
            activities={ACTIVITIES}
            completedActivities={session.completedActivities}
            onSelectActivity={setActiveId}
          />
        )}
      </main>

      {showSettings && (
        <SettingsModal
          onReset={() => {
            resetSession()
            setActiveId(null)
            setShowSettings(false)
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
