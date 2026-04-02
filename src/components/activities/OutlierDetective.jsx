import React, { useState } from 'react'
import ResultBanner from '../ResultBanner'

const DATASETS = [
  {
    context: 'Heights of students in a class (cm):',
    values: [142, 138, 145, 210, 140, 136, 143],
    outlierIdx: 3,
    explanation: '210 cm is way outside the normal range for people this age. It\'s likely a mistake — someone probably typed "210" instead of something like "140" or "141" when recording the data.',
  },
  {
    context: 'Time (minutes) spent doing homework each night:',
    values: [30, 45, 35, 40, 3, 50, 38],
    outlierIdx: 4,
    explanation: '3 minutes is much lower than all the other values (which are between 30 and 50 minutes). It stands out so much that it\'s probably a mistake — perhaps one day wasn\'t recorded properly.',
  },
]

export default function OutlierDetective({ savedResult, onComplete, onRetry, onBack }) {
  const [dsIdx] = useState(0)
  const ds = DATASETS[dsIdx]
  const [selected, setSelected] = useState(savedResult ? savedResult.answers.selected : null)
  const [submitted, setSubmitted] = useState(!!savedResult)

  function handleSelect(i) {
    if (submitted) return
    setSelected(i)
  }

  function handleSubmit() {
    const correct = selected === ds.outlierIdx
    setSubmitted(true)
    onComplete(correct ? 3 : 0, 3, { selected })
  }

  const isCorrect = selected === ds.outlierIdx

  return (
    <div className="activity-content">
      <p className="activity-intro">
        An <strong>outlier</strong> is a value that is very different from the rest of the data.
        Detectives look for outliers because they might be data errors or something unusual!
      </p>

      <div className="dataset-card">
        <p>{ds.context}</p>
        <p className="instruction-hint">Click the value that doesn't belong:</p>
        <div className="outlier-chips">
          {ds.values.map((v, i) => (
            <button
              key={i}
              className={`outlier-chip
                ${selected === i ? 'outlier-chip--selected' : ''}
                ${submitted && i === ds.outlierIdx ? 'outlier-chip--correct' : ''}
                ${submitted && selected === i && !isCorrect ? 'outlier-chip--wrong' : ''}
              `}
              onClick={() => handleSelect(i)}
              disabled={submitted}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {!submitted && (
        <button className="btn btn--primary" onClick={handleSubmit} disabled={selected === null}>
          That's the Outlier!
        </button>
      )}

      {submitted && (
        <div className="explanation-box">
          <strong>{isCorrect ? '🔍 Correct!' : `🔍 The outlier was ${ds.values[ds.outlierIdx]}`}</strong>
          <br />{ds.explanation}
        </div>
      )}

      {submitted && (
        <ResultBanner score={isCorrect ? 3 : 0} maxScore={3} onRetry={onRetry} onBack={onBack} />
      )}
    </div>
  )
}
