import React, { useState } from 'react'
import ResultBanner from '../ResultBanner'

const CHART_TYPES = [
  { id: 'bar',     label: 'Bar Chart',    icon: '📊', desc: 'Compare amounts across different groups' },
  { id: 'pie',     label: 'Pie Chart',    icon: '🥧', desc: 'Show how a total is split into parts' },
  { id: 'line',    label: 'Line Graph',   icon: '📈', desc: 'Show how something changes over time' },
  { id: 'scatter', label: 'Scatter Plot', icon: '✦',  desc: 'See if two things are connected' },
]

const SCENARIOS = [
  {
    id: 's1',
    title: 'Pocket Money',
    emoji: '💰',
    description: 'You asked 20 friends how they spend their pocket money — on food, games, clothes, or saving. You want to show what share (portion) of the total goes to each category.',
    correct: 'pie',
    explanation: 'A pie chart splits a total into slices — perfect for showing what share goes to each thing.',
  },
  {
    id: 's2',
    title: 'Growing Sunflower',
    emoji: '🌻',
    description: 'You measured a sunflower\'s height every week for 8 weeks. You want to show how it grew over time.',
    correct: 'line',
    explanation: 'A line graph is best for showing change over time — each week gets a dot and the line shows the growth.',
  },
  {
    id: 's3',
    title: 'Favourite Colours',
    emoji: '🎨',
    description: 'Your class voted for their favourite colour. You want to compare how many people chose each colour.',
    correct: 'bar',
    explanation: 'A bar chart is great for comparing separate groups — each colour gets a bar, and the taller it is, the more people chose it.',
  },
  {
    id: 's4',
    title: 'Sleep vs Grades',
    emoji: '😴',
    description: 'You collected data on how many hours 15 classmates slept and their test score. You want to see if sleeping more is connected to getting higher marks.',
    correct: 'scatter',
    explanation: 'A scatter plot puts two pieces of information on the same chart — one on each axis. If the dots form a line going up, it means the two things are connected.',
  },
]

export default function ChartChooser({ savedResult, onComplete, onRetry, onBack }) {
  // matches: { scenarioId: chartTypeId }
  const [matches, setMatches] = useState(savedResult ? savedResult.answers : {})
  const [draggingChart, setDraggingChart] = useState(null)
  const [submitted, setSubmitted] = useState(!!savedResult)

  function handleDragStart(chartId) { setDraggingChart(chartId) }
  function handleDragEnd() { setDraggingChart(null) }
  function handleDrop(scenarioId) {
    if (!draggingChart || submitted) return
    setMatches(prev => ({ ...prev, [scenarioId]: draggingChart }))
    setDraggingChart(null)
  }

  // Also allow clicking a chart chip then clicking a scenario to assign
  const [pendingChart, setPendingChart] = useState(null)

  function handleChartClick(chartId) {
    if (submitted) return
    setPendingChart(prev => prev === chartId ? null : chartId)
  }

  function handleScenarioClick(scenarioId) {
    if (submitted || !pendingChart) return
    setMatches(prev => ({ ...prev, [scenarioId]: pendingChart }))
    setPendingChart(null)
  }

  function handleSubmit() {
    const score = SCENARIOS.reduce(
      (acc, s) => acc + (matches[s.id] === s.correct ? 1 : 0), 0
    )
    setSubmitted(true)
    onComplete(score, SCENARIOS.length, matches)
  }

  const allMatched = SCENARIOS.every(s => matches[s.id])

  function getChartById(id) { return CHART_TYPES.find(c => c.id === id) }

  return (
    <div className="activity-content">
      <p className="activity-intro">
        Choosing the <strong>right chart</strong> is a key data skill! Different charts are good at different things. <strong>Drag each chart type onto the situation it fits best</strong> — or tap a chart, then tap a situation.
      </p>

      {/* Chart type palette */}
      <div className="chart-palette">
        {CHART_TYPES.map(ct => (
          <div
            key={ct.id}
            className={`chart-chip
              ${pendingChart === ct.id ? 'chart-chip--selected' : ''}
              ${submitted ? 'chart-chip--static' : ''}
            `}
            draggable={!submitted}
            onDragStart={() => handleDragStart(ct.id)}
            onDragEnd={handleDragEnd}
            onClick={() => handleChartClick(ct.id)}
          >
            <span className="chart-chip-icon">{ct.icon}</span>
            <div>
              <div className="chart-chip-label">{ct.label}</div>
              <div className="chart-chip-desc">{ct.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <p className="palette-hint">
        {pendingChart
          ? `📌 "${getChartById(pendingChart)?.label}" selected — now click a situation below to assign it.`
          : !submitted ? 'Drag a chart type onto each situation, or click a chart then click a situation.' : ''}
      </p>

      {/* Scenario drop targets */}
      <div className="scenarios-grid">
        {SCENARIOS.map(s => {
          const assigned = matches[s.id]
          const chart = assigned ? getChartById(assigned) : null
          const isCorrect = submitted && assigned === s.correct
          const isWrong = submitted && assigned && assigned !== s.correct

          return (
            <div
              key={s.id}
              className={`scenario-drop
                ${draggingChart ? 'scenario-drop--active' : ''}
                ${pendingChart ? 'scenario-drop--clickable' : ''}
                ${isCorrect ? 'scenario-drop--correct' : ''}
                ${isWrong ? 'scenario-drop--wrong' : ''}
              `}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(s.id)}
              onClick={() => handleScenarioClick(s.id)}
            >
              <div className="scenario-header">
                <span className="scenario-emoji">{s.emoji}</span>
                <strong>{s.title}</strong>
              </div>
              <p className="scenario-desc">{s.description}</p>

              <div className={`scenario-slot ${!assigned ? 'scenario-slot--empty' : ''}`}>
                {chart ? (
                  <span className="assigned-chart">
                    {chart.icon} {chart.label}
                    {submitted && (isCorrect ? ' ✅' : ` ✗ → ${getChartById(s.correct)?.icon} ${getChartById(s.correct)?.label}`)}
                  </span>
                ) : (
                  <span className="slot-placeholder">Drop a chart here</span>
                )}
              </div>

              {submitted && (
                <p className="q-feedback">{s.explanation}</p>
              )}
            </div>
          )
        })}
      </div>

      {!submitted && (
        <button className="btn btn--primary" onClick={handleSubmit} disabled={!allMatched}>
          Lock in my matches!
        </button>
      )}

      {submitted && (
        <ResultBanner
          score={SCENARIOS.reduce((acc, s) => acc + (matches[s.id] === s.correct ? 1 : 0), 0)}
          maxScore={SCENARIOS.length}
          onRetry={onRetry}
          onBack={onBack}
        />
      )}
    </div>
  )
}
