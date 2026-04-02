import React, { useState } from 'react'
import ResultBanner from '../ResultBanner'

const CHART_DATA = [
  { label: 'Maths',   value: 8,  color: '#6c63ff' },
  { label: 'Science', value: 12, color: '#00c2a8' },
  { label: 'English', value: 6,  color: '#ff6b6b' },
  { label: 'History', value: 4,  color: '#ffa94d' },
  { label: 'Art',     value: 10, color: '#f06292' },
]

const MAX_BAR_HEIGHT = 140
const MAX_VALUE = Math.max(...CHART_DATA.map(d => d.value))

// Three tasks — each asks the kid to click a bar directly
const TASKS = [
  {
    id: 't1',
    prompt: 'Click on the bar for the most popular subject.',
    correct: 'Science',
    feedback: 'Science has the tallest bar — 12 students chose it, more than any other subject.',
  },
  {
    id: 't2',
    prompt: 'Click on the bar for the least popular subject.',
    correct: 'History',
    feedback: 'History has the shortest bar — only 4 students chose it.',
  },
  {
    id: 't3',
    prompt: 'Click the bar that has exactly 2 more students than English.',
    correct: 'Maths',
    feedback: 'English has 6 students. 6 + 2 = 8, which matches Maths.',
  },
]

export default function ChartReader({ savedResult, onComplete, onRetry, onBack }) {
  const [taskIdx, setTaskIdx] = useState(savedResult ? TASKS.length : 0)
  const [selected, setSelected] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [score, setScore] = useState(savedResult ? savedResult.score : 0)
  const [wrongFlash, setWrongFlash] = useState(null)
  const [submitted, setSubmitted] = useState(!!savedResult)

  const task = TASKS[taskIdx]
  const allDone = taskIdx >= TASKS.length

  function handleBarClick(label) {
    if (confirmed || allDone) return
    setSelected(label)
  }

  function handleConfirm() {
    if (!selected) return
    const correct = selected === task.correct
    const newScore = score + (correct ? 1 : 0)
    setScore(newScore)
    setConfirmed(true)

    if (!correct) setWrongFlash(selected)
  }

  function handleNext() {
    const nextIdx = taskIdx + 1
    setTaskIdx(nextIdx)
    setSelected(null)
    setConfirmed(false)
    setWrongFlash(null)

    if (nextIdx >= TASKS.length) {
      setSubmitted(true)
      onComplete(score + (confirmed && selected === task.correct ? 0 : 0), TASKS.length, { score })
    }
  }

  function finishLast() {
    const correct = selected === task.correct
    const finalScore = score + (correct ? 1 : 0)
    setScore(finalScore)
    setConfirmed(true)
    setTimeout(() => {
      setSubmitted(true)
      onComplete(finalScore, TASKS.length, { score: finalScore })
    }, 1400)
  }

  // simplified: confirm always advances; last task auto-submits
  function handleConfirmUnified() {
    if (!selected || confirmed) return
    const correct = selected === task.correct
    const newScore = score + (correct ? 1 : 0)
    setScore(newScore)
    setConfirmed(true)
    if (!correct) setWrongFlash(selected)

    if (taskIdx === TASKS.length - 1) {
      setTimeout(() => {
        setSubmitted(true)
        onComplete(newScore, TASKS.length, { score: newScore })
      }, 1800)
    }
  }

  function advanceTask() {
    const nextIdx = taskIdx + 1
    setTaskIdx(nextIdx)
    setSelected(null)
    setConfirmed(false)
    setWrongFlash(null)
  }

  return (
    <div className="activity-content">
      <p className="activity-intro">
        A class voted for their favourite subject. The results are shown in a <strong>bar chart</strong> — a graph where each bar's height shows how many people chose that option. Answer each question by clicking a bar!
      </p>

      {/* Bar Chart */}
      <div className="bar-chart-wrap">
        <div className="bar-chart">
          {CHART_DATA.map(d => {
            const isSelected = selected === d.label
            const isCorrectBar = confirmed && d.label === task?.correct
            const isWrong = wrongFlash === d.label
            return (
              <button
                key={d.label}
                className={`bar-col bar-col--btn
                  ${isSelected && !confirmed ? 'bar-col--selected' : ''}
                  ${isCorrectBar ? 'bar-col--correct' : ''}
                  ${isWrong ? 'bar-col--wrong' : ''}
                `}
                onClick={() => handleBarClick(d.label)}
                disabled={confirmed || allDone || submitted}
                title={`Click to select ${d.label}`}
              >
                <span className="bar-value">{d.value}</span>
                <div
                  className="bar-bar"
                  style={{
                    height: `${(d.value / MAX_VALUE) * MAX_BAR_HEIGHT}px`,
                    background: d.color,
                  }}
                />
                <span className="bar-label">{d.label}</span>
              </button>
            )
          })}
        </div>
        <p className="chart-caption">Favourite Subject Survey — 40 students</p>
      </div>

      {/* Task prompt */}
      {!submitted && (
        <div className="task-prompt-card">
          <div className="task-counter">Question {taskIdx + 1} of {TASKS.length}</div>
          <p className="task-prompt">{task.prompt}</p>

          {!confirmed && (
            <button
              className="btn btn--primary"
              onClick={handleConfirmUnified}
              disabled={!selected}
            >
              That's my answer!
            </button>
          )}

          {confirmed && (
            <div className={`task-feedback ${selected === task.correct ? 'task-feedback--correct' : 'task-feedback--wrong'}`}>
              <strong>{selected === task.correct ? '✅ Correct!' : `✗ Not quite — the answer was ${task.correct}`}</strong>
              <p>{task.feedback}</p>
              {taskIdx < TASKS.length - 1 && (
                <button className="btn btn--primary" onClick={advanceTask}>Next Question →</button>
              )}
            </div>
          )}
        </div>
      )}

      {submitted && <ResultBanner score={score} maxScore={TASKS.length} onRetry={onRetry} onBack={onBack} />}
    </div>
  )
}
