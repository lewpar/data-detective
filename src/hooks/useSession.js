import { useState, useCallback } from 'react'

const SESSION_KEY = 'data-detective-session'

function defaultSession() {
  return {
    completedActivities: {}, // { [activityId]: { score, maxScore, answers } }
    started: false,
    startedAt: Date.now(),
  }
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return defaultSession()
}

function saveSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {}
}

export function useSession() {
  const [session, setSession] = useState(() => loadSession())

  const completeActivity = useCallback((activityId, score, maxScore, answers) => {
    setSession(prev => {
      const next = {
        ...prev,
        completedActivities: {
          ...prev.completedActivities,
          [activityId]: { score, maxScore, answers, completedAt: Date.now() },
        },
      }
      saveSession(next)
      return next
    })
  }, [])

  const resetSession = useCallback(() => {
    const fresh = defaultSession()
    saveSession(fresh)
    setSession(fresh)
  }, [])

  const markStarted = useCallback(() => {
    setSession(prev => {
      const next = { ...prev, started: true }
      saveSession(next)
      return next
    })
  }, [])

  return { session, completeActivity, resetSession, markStarted }
}
