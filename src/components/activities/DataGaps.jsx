import React, { useState } from 'react'
import ResultBanner from '../ResultBanner'

// Sports day results — kids click the cells that contain mistakes
const RESULTS = [
  { name: 'Amir',    event: '100m Sprint', result: '14.2s',  place: '1st', rowValid: true,  colIssues: [] },
  { name: 'Beatrix', event: '100m Sprint', result: '14.9s',  place: '2nd', rowValid: true,  colIssues: [] },
  { name: 'Carlos',  event: '100m Sprint', result: '13.8s',  place: '3rd', rowValid: false, colIssues: ['place'],
    explanation: 'Carlos ran 13.8s — that\'s faster than Amir\'s 14.2s. The fastest time should be 1st place, not 3rd. The place is wrong!' },
  { name: 'Demi',    event: 'Long Jump',   result: '3.2m',   place: '1st', rowValid: true,  colIssues: [] },
  { name: 'Ethan',   event: 'Long Jump',   result: '3.10m',  place: '2nd', rowValid: false, colIssues: ['result'],
    explanation: '3.10m is the same as 3.1m. But 3.1 is less than 3.2 — so Ethan jumped shorter than Demi. Writing "3.10" instead of "3.1" is confusing because it makes the number look bigger than it is.' },
  { name: 'Fiona',   event: 'High Jump',   result: '1.45m',  place: '1st', rowValid: true,  colIssues: [] },
  { name: 'George',  event: 'High Jump',   result: '150cm',  place: '2nd', rowValid: false, colIssues: ['result', 'place'],
    explanation: '150cm = 1.5m, which is higher than Fiona\'s 1.45m. Two problems: George\'s place should be 1st (not 2nd), and the unit is different from everyone else (cm instead of m).' },
  { name: 'Hannah',  event: 'Relay',       result: '55.4s',  place: '1st', rowValid: true,  colIssues: [] },
]

const WRONG_ROWS = RESULTS.filter(r => !r.rowValid)

export default function DataGaps({ savedResult, onComplete, onRetry, onBack }) {
  // flagged: { rowName: Set of column keys }
  const [flagged, setFlagged] = useState(() => {
    if (savedResult) return savedResult.answers.flagged || {}
    return {}
  })
  const [submitted, setSubmitted] = useState(!!savedResult)
  const [revealed, setRevealed] = useState(savedResult ? new Set(WRONG_ROWS.map(r => r.name)) : new Set())

  function toggleFlag(rowName, col) {
    if (submitted) return
    setFlagged(prev => {
      const rowSet = new Set(prev[rowName] || [])
      if (rowSet.has(col)) rowSet.delete(col)
      else rowSet.add(col)
      return { ...prev, [rowName]: rowSet }
    })
  }

  function isFlagged(rowName, col) {
    return flagged[rowName] instanceof Set
      ? flagged[rowName].has(col)
      : !!(flagged[rowName] && flagged[rowName][col])
  }

  function handleSubmit() {
    // Score: 1 point per wrong row correctly identified (at least one correct col flagged, no extra wrong flags on valid rows)
    let score = 0
    WRONG_ROWS.forEach(row => {
      const userFlags = flagged[row.name]
      const flagSet = userFlags instanceof Set ? userFlags : new Set(Object.keys(userFlags || {}).filter(k => (userFlags)[k]))
      const hitACorrect = row.colIssues.some(col => flagSet.has(col))
      if (hitACorrect) score++
    })
    // Reveal all wrong rows
    setRevealed(new Set(WRONG_ROWS.map(r => r.name)))
    setSubmitted(true)
    onComplete(score, WRONG_ROWS.length, { flagged: Object.fromEntries(
      Object.entries(flagged).map(([k, v]) => [k, v instanceof Set ? [...v] : v])
    )})
  }

  const anyFlagged = Object.values(flagged).some(s => (s instanceof Set ? s.size > 0 : Object.values(s).some(Boolean)))

  return (
    <div className="activity-content">
      <p className="activity-intro">
        A detective always checks their data for <strong>discrepancies</strong> — that's when something in the data doesn't add up or looks wrong. Study this sports day results table and <strong>click on any cells you think are mistakes</strong>. You can flag more than one cell per row!
      </p>

      <div className="hint-box">
        💡 Think about: Are the places in the right order? Do the units match? Do the numbers make sense?
      </div>

      <div className="raw-data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Event</th>
              <th>Result</th>
              <th>Place</th>
            </tr>
          </thead>
          <tbody>
            {RESULTS.map(row => {
              const isWrongRow = !row.valid && !row.rowValid
              const isRevealed = revealed.has(row.name)
              return (
                <React.Fragment key={row.name}>
                  <tr>
                    <td>{row.name}</td>
                    <td>{row.event}</td>
                    {['result', 'place'].map(col => {
                      const flagged_ = isFlagged(row.name, col)
                      const isActuallyWrong = row.colIssues?.includes(col)
                      let cellClass = ''
                      if (submitted && isActuallyWrong) cellClass = 'cell-revealed-wrong'
                      else if (submitted && flagged_ && !isActuallyWrong) cellClass = 'cell-false-flag'
                      else if (flagged_) cellClass = 'cell-flagged'
                      return (
                        <td
                          key={col}
                          className={`clickable-cell ${cellClass}`}
                          onClick={() => toggleFlag(row.name, col)}
                          title={submitted ? '' : 'Click to flag this cell as wrong'}
                        >
                          {col === 'result' ? row.result : row.place}
                          {flagged_ && !submitted && <span className="flag-icon">🚩</span>}
                          {submitted && isActuallyWrong && <span className="flag-icon">⚠️</span>}
                        </td>
                      )
                    })}
                  </tr>
                  {isRevealed && row.explanation && (
                    <tr className="explanation-row">
                      <td colSpan={4}>
                        <div className="inline-explanation">💡 {row.explanation}</div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
        {!submitted && <p className="table-note">🚩 Click any cell you think contains a mistake.</p>}
      </div>

      {!submitted && (
        <button className="btn btn--primary" onClick={handleSubmit} disabled={!anyFlagged}>
          I've found the mistakes!
        </button>
      )}

      {submitted && <ResultBanner score={
        (() => {
          let s = 0
          WRONG_ROWS.forEach(row => {
            const userFlags = flagged[row.name]
            const flagSet = userFlags instanceof Set ? userFlags : new Set(Object.keys(userFlags || {}).filter(k => (userFlags)[k]))
            if (row.colIssues.some(col => flagSet.has(col))) s++
          })
          return s
        })()
      } maxScore={WRONG_ROWS.length} onRetry={onRetry} onBack={onBack} />}
    </div>
  )
}
