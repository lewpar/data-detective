import { useState } from 'react'
import ResultBanner from '../ResultBanner'

const ORIGINAL = [34, 12, 67, 8, 45, 23, 56, 3]
const SORTED = [...ORIGINAL].sort((a, b) => a - b)

export default function SortSquad({ savedResult, onComplete, onRetry, onBack }) {
  const [items, setItems] = useState(
    savedResult ? savedResult.answers : [...ORIGINAL]
  )
  const [dragging, setDragging] = useState(null)
  const [dragOver, setDragOver] = useState(null)
  const [submitted, setSubmitted] = useState(!!savedResult)

  function handleDragStart(i) {
    setDragging(i)
  }

  function handleDragEnd() {
    setDragging(null)
    setDragOver(null)
  }

  function handleDragOver(e, i) {
    e.preventDefault()
    if (i !== dragging) setDragOver(i)
  }

  function handleDragLeave() {
    setDragOver(null)
  }

  function handleDrop(i) {
    if (dragging === null || dragging === i) {
      setDragging(null)
      setDragOver(null)
      return
    }
    setItems(prev => {
      const next = [...prev]
      const [removed] = next.splice(dragging, 1)
      next.splice(i, 0, removed)
      return next
    })
    setDragging(null)
    setDragOver(null)
  }

  function handleSubmit() {
    const correct = items.every((v, i) => v === SORTED[i])
    const score = correct ? 5 : 0
    setSubmitted(true)
    onComplete(score, 5, items)
  }

  const isCorrect = items.every((v, i) => v === SORTED[i])

  return (
    <div className="activity-content">
      <p className="activity-intro">
        Drag and drop the temperature readings to arrange them from <strong>smallest to largest</strong>.
      </p>

      <div className="sort-context">
        <p>A weather station recorded these daily high temperatures (°C):</p>
      </div>

      <div className="sort-row">
        {items.map((val, i) => {
          const isBeingDragged = dragging === i
          const isTarget = dragOver === i && dragging !== null && dragging !== i
          const insertBefore = isTarget && dragging > i
          const insertAfter  = isTarget && dragging < i

          return (
            <div
              key={i}
              className={`sort-chip
                ${isBeingDragged ? 'sort-chip--dragging' : ''}
                ${insertBefore  ? 'sort-chip--insert-before' : ''}
                ${insertAfter   ? 'sort-chip--insert-after'  : ''}
                ${submitted && val === SORTED[i] ? 'sort-chip--correct' : ''}
                ${submitted && val !== SORTED[i] ? 'sort-chip--wrong'   : ''}
              `}
              draggable={!submitted}
              onDragStart={() => handleDragStart(i)}
              onDragEnd={handleDragEnd}
              onDragOver={e => handleDragOver(e, i)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(i)}
            >
              {val}°C
              {submitted && (
                <span className="sort-chip-check">
                  {val === SORTED[i] ? '✅' : '❌'}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {submitted && (
        <div className="sort-answer">
          <strong>Correct order:</strong>{' '}
          {SORTED.map(v => `${v}°C`).join(' → ')}
        </div>
      )}

      {!submitted && (
        <button className="btn btn--primary" onClick={handleSubmit}>
          Lock In My Order
        </button>
      )}

      {submitted && (
        <ResultBanner
          score={isCorrect ? 5 : 0}
          maxScore={5}
          onRetry={onRetry}
          onBack={onBack}
          customMsg={isCorrect ? 'Perfect ordering!' : 'Not quite — check the correct order above.'}
        />
      )}
    </div>
  )
}
