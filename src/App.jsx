import React, { useState } from 'react'
import { useSession } from './hooks/useSession'
import LandingPage from './components/LandingPage'
import ActivityList from './components/ActivityList'
import ActivityRunner from './components/ActivityRunner'
import SettingsModal from './components/SettingsModal'
import Header from './components/Header'
import { ACTIVITIES } from './data/activities'

export default function App() {
  const { session, completeActivity, resetSession, markStarted } = useSession()
  const [activeId, setActiveId] = useState(null)
  const [showSettings, setShowSettings] = useState(false)

  const totalActivities = ACTIVITIES.length
  const completedCount = Object.keys(session.completedActivities).length
  const activeActivity = activeId ? ACTIVITIES.find(a => a.id === activeId) : null

  if (!session.started) {
    return <LandingPage onStart={markStarted} />
  }

  return (
    <div className="app">
      <Header
        completed={completedCount}
        total={totalActivities}
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
