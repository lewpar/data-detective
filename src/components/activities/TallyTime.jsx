import React, { useState } from 'react'
import ResultBanner from '../ResultBanner'

const ANIMALS = ['🐱', '🐶', '🐸', '🐰', '🦊']
const ANIMAL_NAMES = ['Cat', 'Dog', 'Frog', 'Rabbit', 'Fox']

// Deterministic scrambled sequence of 25 animals
const SEQUENCE = [0,1,0,2,3,1,4,0,2,1,3,0,4,2,1,0,3,4,1,2,0,1,3,2,4]
const CORRECT_COUNTS = ANIMALS.map((_, i) => SEQUENCE.filter(x => x === i).length)

export default function TallyTime({ savedResult, onComplete, onRetry, onBack }) {
  const [answers, setAnswers] = useState(
    savedResult ? savedResult.answers : ANIMALS.map(() => '')
  )
  const [submitted, setSubmitted] = useState(!!savedResult)

  function handleChange(i, val) {
    if (submitted) return
    const v = val.replace(/\D/g, '').slice(0, 2)
    setAnswers(prev => prev.map((a, idx) => idx === i ? v : a))
  }

  function handleSubmit() {
    const score = answers.reduce((acc, ans, i) => {
      return acc + (parseInt(ans, 10) === CORRECT_COUNTS[i] ? 1 : 0)
    }, 0)
    setSubmitted(true)
    onComplete(score, ANIMALS.length, answers)
  }

  const canSubmit = answers.every(a => a !== '')
  const score = submitted
    ? answers.reduce((acc, ans, i) => acc + (parseInt(ans, 10) === CORRECT_COUNTS[i] ? 1 : 0), 0)
    : null

  return (
    <div className="activity-content">
      <p className="activity-intro">
        Count each type of animal in the field below, then fill in the tally chart.
      </p>

      <div className="animal-field">
        {SEQUENCE.map((animalIdx, i) => (
          <span key={i} className="field-animal">{ANIMALS[animalIdx]}</span>
        ))}
      </div>

      <table className="tally-table">
        <thead>
          <tr>
            <th>Animal</th>
            <th>Count</th>
            {submitted && <th>Correct</th>}
          </tr>
        </thead>
        <tbody>
          {ANIMALS.map((animal, i) => {
            const correct = parseInt(answers[i], 10) === CORRECT_COUNTS[i]
            return (
              <tr key={i} className={submitted ? (correct ? 'row-correct' : 'row-wrong') : ''}>
                <td>{animal} {ANIMAL_NAMES[i]}</td>
                <td>
                  <input
                    className={`tally-input ${submitted ? (correct ? 'input-correct' : 'input-wrong') : ''}`}
                    type="text"
                    inputMode="numeric"
                    value={answers[i]}
                    onChange={e => handleChange(i, e.target.value)}
                    disabled={submitted}
                    maxLength={2}
                  />
                </td>
                {submitted && <td>{correct ? '✅' : `✗ (${CORRECT_COUNTS[i]})`}</td>}
              </tr>
            )
          })}
        </tbody>
      </table>

      {!submitted && (
        <button className="btn btn--primary" onClick={handleSubmit} disabled={!canSubmit}>
          Submit Answers
        </button>
      )}

      {submitted && (
        <ResultBanner score={score} maxScore={ANIMALS.length} onRetry={onRetry} onBack={onBack} />
      )}
    </div>
  )
}
