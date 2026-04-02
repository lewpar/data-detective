import React, { useState } from 'react'
import ResultBanner from '../ResultBanner'

// Kids fix the data by dragging/clicking correction labels onto the bad cells
const RAW_DATA = [
  { name: 'Alex',    sport: 'Football', age: 11, sportIssue: null,       ageIssue: null },
  { name: 'Bella',   sport: 'Swimming', age: 12, sportIssue: null,       ageIssue: null },
  { name: 'Carlos',  sport: 'Football', age: 11, sportIssue: null,       ageIssue: null },
  { name: 'Demi',    sport: 'Tennis',   age: 10, sportIssue: null,       ageIssue: null },
  { name: 'Ethan',   sport: 'Swimming', age: 11, sportIssue: null,       ageIssue: null },
  { name: 'Fiona',   sport: 'FOOTBALL', age: 12, sportIssue: 'caps',     ageIssue: null,
    sportFix: 'Football', sportHint: 'All caps — should be "Football"' },
  { name: 'George',  sport: 'Tennis',   age: 9,  sportIssue: null,       ageIssue: 'range',
    ageFix: '?', ageHint: 'Age 9 is outside the range for this survey (10–12)' },
  { name: 'Hannah',  sport: 'Swimmng',  age: 11, sportIssue: 'typo',     ageIssue: null,
    sportFix: 'Swimming', sportHint: 'Spelling mistake — "Swimmng" should be "Swimming"' },
  { name: 'Ivan',    sport: 'Football', age: 10, sportIssue: null,       ageIssue: null },
  { name: 'Jess',    sport: 'Tennis',   age: 11, sportIssue: null,       ageIssue: null },
]

const BAD_CELLS = [
  { name: 'Fiona',  col: 'sport', label: 'FOOTBALL', fix: 'Football', hint: '"FOOTBALL" uses all capital letters. Sports names should be written like "Football" — only the first letter is capital.', type: 'Wrong capitals' },
  { name: 'George', col: 'age',   label: '9',        fix: '?',        hint: 'The survey is for ages 10–12. Age 9 is outside that range — this person shouldn\'t be in the results, or their age was typed wrong.', type: 'Out-of-range value' },
  { name: 'Hannah', col: 'sport', label: 'Swimmng',  fix: 'Swimming', hint: '"Swimmng" is missing a letter — it should be "Swimming". Even small typos cause problems when counting results.', type: 'Spelling mistake' },
]

export default function SurveyShowdown({ savedResult, onComplete, onRetry, onBack }) {
  // fixed: set of "name-col" strings that the user has clicked to fix
  const [fixed, setFixed] = useState(() =>
    savedResult ? new Set(savedResult.answers.fixed || []) : new Set()
  )
  const [revealed, setRevealed] = useState(() =>
    savedResult ? new Set(savedResult.answers.fixed || []) : new Set()
  )
  const [submitted, setSubmitted] = useState(!!savedResult)

  function toggleFix(key) {
    if (submitted) return
    setFixed(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function handleSubmit() {
    // Score: 1 per bad cell the user correctly identified (clicked)
    let score = 0
    BAD_CELLS.forEach(cell => {
      if (fixed.has(`${cell.name}-${cell.col}`)) score++
    })
    setRevealed(new Set(BAD_CELLS.map(c => `${c.name}-${c.col}`)))
    setSubmitted(true)
    onComplete(score, BAD_CELLS.length, { fixed: [...fixed] })
  }

  const score = (() => {
    let s = 0
    BAD_CELLS.forEach(cell => {
      if (fixed.has(`${cell.name}-${cell.col}`)) s++
    })
    return s
  })()

  return (
    <div className="activity-content">
      <p className="activity-intro">
        Real data always has mistakes! Someone collected a survey but made several errors. Your job is to find them — <strong>click on any cell that looks wrong</strong> to flag it.
      </p>

      <div className="hint-box">
        💡 Look out for: spelling mistakes, words in ALL CAPS when they shouldn't be, and ages that seem wrong for this survey (ages 10–12 only).
      </div>

      <div className="raw-data-table-wrap">
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Favourite Sport</th><th>Age</th></tr>
          </thead>
          <tbody>
            {RAW_DATA.map((row, i) => {
              return (
                <tr key={row.name}>
                  <td>{i + 1}</td>
                  <td>{row.name}</td>
                  {['sport', 'age'].map(col => {
                    const badCell = BAD_CELLS.find(b => b.name === row.name && b.col === col)
                    const key = `${row.name}-${col}`
                    const isFlagged = fixed.has(key)
                    const isRevealed = revealed.has(key)
                    const isMissed = submitted && badCell && !isFlagged

                    let cellClass = ''
                    if (isRevealed && badCell) cellClass = isFlagged ? 'cell-fixed-correct' : 'cell-revealed-missed'
                    else if (submitted && isFlagged && !badCell) cellClass = 'cell-false-flag'
                    else if (isFlagged) cellClass = 'cell-flagged'
                    else if (badCell && !submitted) cellClass = 'cell-warn-clickable'

                    const displayVal = col === 'sport' ? row.sport : String(row.age)

                    return (
                      <td
                        key={col}
                        className={`clickable-cell ${cellClass}`}
                        onClick={() => badCell || isFlagged ? toggleFix(key) : null}
                        title={!submitted && badCell ? 'Click to flag this cell' : ''}
                      >
                        {displayVal}
                        {isFlagged && !submitted && <span className="flag-icon">🚩</span>}
                        {isRevealed && badCell && (
                          <span className="flag-icon">{isFlagged ? '✅' : '⚠️'}</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        {!submitted && <p className="table-note">🚩 Click a cell to flag it as a mistake. Click again to unflag.</p>}
      </div>

      {/* After submit: show explanations */}
      {submitted && (
        <div className="explanations-list">
          {BAD_CELLS.map(cell => (
            <div key={`${cell.name}-${cell.col}`} className="explanation-box">
              <strong>{cell.name} — {cell.type}:</strong> {cell.hint}
            </div>
          ))}
        </div>
      )}

      {!submitted && (
        <button className="btn btn--primary" onClick={handleSubmit} disabled={fixed.size === 0}>
          I've found the mistakes!
        </button>
      )}

      {submitted && <ResultBanner score={score} maxScore={BAD_CELLS.length} onRetry={onRetry} onBack={onBack} />}
    </div>
  )
}
