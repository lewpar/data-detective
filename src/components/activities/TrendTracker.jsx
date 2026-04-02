import React, { useState, useRef } from 'react'
import ResultBanner from '../ResultBanner'

// Monthly library visitors (Jan–Jun) — kid drags the July dot onto the graph
const DATA_POINTS = [
  { month: 'Jan', visitors: 120 },
  { month: 'Feb', visitors: 135 },
  { month: 'Mar', visitors: 150 },
  { month: 'Apr', visitors: 165 },
  { month: 'May', visitors: 180 },
  { month: 'Jun', visitors: 195 },
]
const CORRECT_JULY = 210
const MONTH_LABEL = 'Jul'

const W = 380
const H = 180
const PAD = { top: 20, right: 30, bottom: 32, left: 42 }
const chartW = W - PAD.left - PAD.right
const chartH = H - PAD.top - PAD.bottom
const MIN_V = 80
const MAX_V = 240
const ALL_MONTHS = [...DATA_POINTS.map(d => d.month), MONTH_LABEL]

function scaleX(i, total) { return PAD.left + (i / (total - 1)) * chartW }
function scaleY(v) { return PAD.top + chartH - ((v - MIN_V) / (MAX_V - MIN_V)) * chartH }
function unscaleY(px) {
  // px is relative to SVG top
  const raw = MIN_V + ((PAD.top + chartH - px) / chartH) * (MAX_V - MIN_V)
  return Math.round(Math.max(MIN_V, Math.min(MAX_V, raw)) / 5) * 5
}

const TOTAL_POINTS = ALL_MONTHS.length // 7 (Jan–Jul)

// Two bonus questions answered by clicking buttons — kept minimal
const TREND_Q = {
  prompt: 'What kind of trend does this data show?',
  options: ['Going up', 'Going down', 'Staying the same', 'Going up and down'],
  correct: 'Going up',
  feedback: 'Every month the number of visitors increases — this is called an upward trend.',
}

export default function TrendTracker({ savedResult, onComplete, onRetry, onBack }) {
  const svgRef = useRef(null)
  const [julyY, setJulyY] = useState(savedResult ? savedResult.answers.julyY : null)
  const [isDragging, setIsDragging] = useState(false)
  const [placedValue, setPlacedValue] = useState(savedResult ? savedResult.answers.placedValue : null)
  const [trendAnswer, setTrendAnswer] = useState(savedResult ? savedResult.answers.trendAnswer : null)
  const [submitted, setSubmitted] = useState(!!savedResult)

  const julyXIdx = TOTAL_POINTS - 1
  const julyX = scaleX(julyXIdx, TOTAL_POINTS)

  function getSvgY(clientY) {
    const rect = svgRef.current.getBoundingClientRect()
    const svgScaleY = H / rect.height
    return (clientY - rect.top) * svgScaleY
  }

  function handleSvgMouseDown(e) {
    if (submitted) return
    setIsDragging(true)
    const y = getSvgY(e.clientY)
    const val = unscaleY(y)
    setJulyY(scaleY(val))
    setPlacedValue(val)
  }

  function handleSvgMouseMove(e) {
    if (!isDragging || submitted) return
    const y = getSvgY(e.clientY)
    const val = unscaleY(y)
    setJulyY(scaleY(val))
    setPlacedValue(val)
  }

  function handleSvgTouchMove(e) {
    if (!isDragging || submitted) return
    e.preventDefault()
    const y = getSvgY(e.touches[0].clientY)
    const val = unscaleY(y)
    setJulyY(scaleY(val))
    setPlacedValue(val)
  }

  function stopDrag() { setIsDragging(false) }

  function handleSubmit() {
    const julyCorrect = placedValue !== null && Math.abs(placedValue - CORRECT_JULY) <= 15
    const trendCorrect = trendAnswer === TREND_Q.correct
    const score = (julyCorrect ? 2 : 0) + (trendCorrect ? 1 : 0)
    setSubmitted(true)
    onComplete(score, 3, { julyY, placedValue, trendAnswer })
  }

  const canSubmit = placedValue !== null && trendAnswer !== null

  // Existing points polyline (Jan–Jun only)
  const existingPolyline = DATA_POINTS.map((d, i) =>
    `${scaleX(i, TOTAL_POINTS)},${scaleY(d.visitors)}`
  ).join(' ')

  const julyCorrectY = scaleY(CORRECT_JULY)
  const julyPlacedCorrect = submitted && placedValue !== null && Math.abs(placedValue - CORRECT_JULY) <= 15

  return (
    <div className="activity-content">
      <p className="activity-intro">
        A <strong>trend</strong> shows the general direction data is moving over time — is it going up, down, or staying the same? Study the graph and make your predictions!
      </p>

      <div className="line-chart-wrap">
        <p className="task-mini-prompt">
          📍 <strong>Click anywhere on the graph to place the July dot</strong> — where do you think it will land?
        </p>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="line-chart-svg line-chart-svg--interactive"
          onMouseDown={handleSvgMouseDown}
          onMouseMove={handleSvgMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchStart={handleSvgMouseDown}
          onTouchMove={handleSvgTouchMove}
          onTouchEnd={stopDrag}
          style={{ cursor: submitted ? 'default' : 'crosshair', touchAction: 'none' }}
        >
          {/* Grid lines */}
          {[120, 150, 180, 210].map(v => (
            <g key={v}>
              <line x1={PAD.left} y1={scaleY(v)} x2={W - PAD.right} y2={scaleY(v)}
                stroke="#2a2a4a" strokeWidth="1" />
              <text x={PAD.left - 4} y={scaleY(v) + 4} textAnchor="end" fontSize="9" fill="#666">{v}</text>
            </g>
          ))}

          {/* Axes */}
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="#555" strokeWidth="1" />
          <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="#555" strokeWidth="1" />

          {/* Month labels */}
          {ALL_MONTHS.map((m, i) => (
            <text key={m} x={scaleX(i, TOTAL_POINTS)} y={H - 8}
              textAnchor="middle" fontSize="9"
              fill={m === MONTH_LABEL ? '#6c63ff' : '#888'}
              fontWeight={m === MONTH_LABEL ? '700' : '400'}
            >{m}</text>
          ))}

          {/* Jul target zone (shown after submit) */}
          {submitted && (
            <circle cx={julyX} cy={julyCorrectY} r="14"
              fill="none" stroke="#06d6a0" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.7" />
          )}

          {/* Existing line (Jan–Jun) */}
          <polyline points={existingPolyline}
            fill="none" stroke="#6c63ff" strokeWidth="2.5" strokeLinejoin="round" />

          {/* Dashed line extending to Jul column */}
          <line
            x1={scaleX(DATA_POINTS.length - 1, TOTAL_POINTS)}
            y1={scaleY(DATA_POINTS[DATA_POINTS.length - 1].visitors)}
            x2={julyX}
            y2={julyY ?? scaleY(DATA_POINTS[DATA_POINTS.length - 1].visitors)}
            stroke="#6c63ff" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5"
          />

          {/* Existing dots */}
          {DATA_POINTS.map((d, i) => (
            <g key={i}>
              <circle cx={scaleX(i, TOTAL_POINTS)} cy={scaleY(d.visitors)} r="5" fill="#6c63ff" />
              <text x={scaleX(i, TOTAL_POINTS)} y={scaleY(d.visitors) - 8}
                textAnchor="middle" fontSize="8" fill="#aaa">{d.visitors}</text>
            </g>
          ))}

          {/* Placed July dot */}
          {julyY !== null && (
            <g>
              <circle cx={julyX} cy={julyY} r="7"
                fill={submitted ? (julyPlacedCorrect ? '#06d6a0' : '#ff6b6b') : '#ffd166'}
                stroke="#fff" strokeWidth="1.5" />
              <text x={julyX} y={julyY - 10} textAnchor="middle" fontSize="9"
                fill={submitted ? (julyPlacedCorrect ? '#06d6a0' : '#ff6b6b') : '#ffd166'}
                fontWeight="700">{placedValue}</text>
            </g>
          )}

          {/* After submit: show correct dot if wrong */}
          {submitted && !julyPlacedCorrect && (
            <g>
              <circle cx={julyX} cy={julyCorrectY} r="6"
                fill="none" stroke="#06d6a0" strokeWidth="2" />
              <text x={julyX + 10} y={julyCorrectY + 4} fontSize="9" fill="#06d6a0" fontWeight="700">{CORRECT_JULY} ✓</text>
            </g>
          )}
        </svg>
        <p className="chart-caption">Monthly Library Visitors (Jan – Jun) — place your July prediction!</p>
      </div>

      {/* Trend question — button click, not MCQ list */}
      <div className="task-prompt-card">
        <p className="task-prompt">{TREND_Q.prompt}</p>
        <div className="options-row">
          {TREND_Q.options.map(opt => (
            <button
              key={opt}
              className={`option-btn
                ${trendAnswer === opt ? 'option-btn--selected' : ''}
                ${submitted && opt === TREND_Q.correct ? 'option-btn--correct' : ''}
                ${submitted && trendAnswer === opt && opt !== TREND_Q.correct ? 'option-btn--wrong' : ''}
              `}
              onClick={() => { if (!submitted) setTrendAnswer(opt) }}
              disabled={submitted}
            >{opt}</button>
          ))}
        </div>
        {submitted && (
          <p className="q-feedback">
            {trendAnswer === TREND_Q.correct ? '✅' : `✗ ${TREND_Q.correct}`} — {TREND_Q.feedback}
          </p>
        )}
      </div>

      {submitted && placedValue !== null && (
        <div className="explanation-box">
          <strong>July prediction:</strong> The pattern increases by 15 each month.
          195 + 15 = <strong>210</strong>.{' '}
          {julyPlacedCorrect
            ? `You placed ${placedValue} — close enough, great work!`
            : `You placed ${placedValue} — the expected value was 210.`}
        </div>
      )}

      {!submitted && (
        <button className="btn btn--primary" onClick={handleSubmit} disabled={!canSubmit}>
          Lock in my predictions!
        </button>
      )}

      {submitted && (
        <ResultBanner
          score={
            (placedValue !== null && Math.abs(placedValue - CORRECT_JULY) <= 15 ? 2 : 0) +
            (trendAnswer === TREND_Q.correct ? 1 : 0)
          }
          maxScore={3}
          onRetry={onRetry}
          onBack={onBack}
        />
      )}
    </div>
  )
}
