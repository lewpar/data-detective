import { useState } from 'react'
import ResultBanner from '../ResultBanner'

const DATASET = {
  context: 'A PE teacher recorded how far (in metres) each student threw a ball:',
  values: [8, 23, 5, 41, 17, 36, 12],
}

const CORRECT_MAX = Math.max(...DATASET.values) // 41
const CORRECT_MIN = Math.min(...DATASET.values) // 5
const CORRECT_RANGE = CORRECT_MAX - CORRECT_MIN  // 36

export default function RangeFinder({ savedResult, onComplete, onRetry, onBack }) {
  const [pickedMax,   setPickedMax]   = useState(savedResult ? savedResult.answers.pickedMax   : null)
  const [pickedMin,   setPickedMin]   = useState(savedResult ? savedResult.answers.pickedMin   : null)
  const [wrongFlash,  setWrongFlash]  = useState(null)
  const [rangeInput,  setRangeInput]  = useState(savedResult ? savedResult.answers.rangeInput  : '')
  const [step,        setStep]        = useState(savedResult ? 3 : 0)
  const [submitted,   setSubmitted]   = useState(!!savedResult)

  function handleValueClick(val) {
    if (submitted || step >= 2) return

    if (step === 0) {
      if (val === CORRECT_MAX) {
        setPickedMax(val)
        setStep(1)
      } else {
        setWrongFlash(val)
        setTimeout(() => setWrongFlash(null), 600)
      }
    } else if (step === 1) {
      if (val === CORRECT_MIN) {
        setPickedMin(val)
        setStep(2)
      } else {
        setWrongFlash(val)
        setTimeout(() => setWrongFlash(null), 600)
      }
    }
  }

  function handleSubmit() {
    const rangeCorrect = parseInt(rangeInput, 10) === CORRECT_RANGE
    const score = (pickedMax === CORRECT_MAX ? 1 : 0) +
                  (pickedMin === CORRECT_MIN ? 1 : 0) +
                  (rangeCorrect ? 1 : 0)
    setStep(3)
    setSubmitted(true)
    onComplete(score, 3, { pickedMax, pickedMin, rangeInput })
  }

  const rangeCorrect = parseInt(rangeInput, 10) === CORRECT_RANGE

  function getChipClass(val) {
    if (val === wrongFlash) return 'range-chip--wrong-flash'
    if (pickedMax === val)  return 'range-chip--max'
    if (pickedMin === val)  return 'range-chip--min'
    return 'range-chip--clickable'
  }

  return (
    <div className="activity-content">
      <p className="activity-intro">
        The <strong>range</strong> tells you how spread out a dataset is. It's the difference between the highest and lowest values. A big range means the data is very spread out; a small range means values are all close together.
      </p>

      {/* Dataset */}
      <div className="dataset-card">
        <p>{DATASET.context}</p>
        <div className="range-chips">
          {DATASET.values.map((val, i) => (
            <button
              key={i}
              className={`range-chip ${getChipClass(val)}`}
              onClick={() => handleValueClick(val)}
              disabled={submitted || step >= 2 || val === pickedMax || val === pickedMin}
            >
              {val}m
            </button>
          ))}
        </div>
      </div>

      {/* Always-visible working panel */}
      <div className="range-working-panel">
        <div className="range-working-row">
          <span className="range-working-label">Highest value</span>
          {pickedMax !== null
            ? <span className="range-working-value txt-max">✅ {pickedMax}m — that's the biggest throw in the list</span>
            : <span className="range-working-placeholder">{step === 0 ? '👆 Click the highest value above' : '—'}</span>
          }
        </div>
        <div className="range-working-row">
          <span className="range-working-label">Lowest value</span>
          {pickedMin !== null
            ? <span className="range-working-value txt-min">✅ {pickedMin}m — that's the smallest throw in the list</span>
            : <span className="range-working-placeholder">{step === 1 ? '👇 Now click the lowest value above' : step === 0 ? 'Find the highest first' : '—'}</span>
          }
        </div>
        <div className={`range-working-row range-working-row--range ${step >= 2 ? 'range-working-row--active' : ''}`}>
          <span className="range-working-label">Range</span>
          {step < 2
            ? <span className="range-working-placeholder">= Highest − Lowest (find both values first)</span>
            : submitted
              ? <span className={`range-working-value ${rangeCorrect ? 'txt-max' : 'txt-min'}`}>
                  {rangeCorrect ? `✅ ${CORRECT_RANGE}m` : `✗ Answer: ${CORRECT_RANGE}m`} = {CORRECT_MAX} − {CORRECT_MIN}
                </span>
              : (
                <div className="step-input-row">
                  <span className="range-eq">
                    <strong className="txt-max">{pickedMax}</strong> − <strong className="txt-min">{pickedMin}</strong> =
                  </span>
                  <input
                    className="step-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="?"
                    value={rangeInput}
                    onChange={e => setRangeInput(e.target.value.replace(/\D/g, ''))}
                    maxLength={3}
                    autoFocus
                  />
                  <span>m</span>
                  <button
                    className="btn btn--primary btn--sm"
                    onClick={handleSubmit}
                    disabled={!rangeInput}
                  >
                    Submit
                  </button>
                </div>
              )
          }
        </div>
      </div>

      {submitted && (
        <div className="explanation-box">
          The throws ranged from <strong className="txt-min">{CORRECT_MIN}m</strong> all the way up to <strong className="txt-max">{CORRECT_MAX}m</strong>.
          That's a range of <strong>{CORRECT_RANGE}m</strong> — some students threw nearly 8× further than others!
          A large range like this tells you the group had very different abilities.
        </div>
      )}

      {submitted && (
        <ResultBanner
          score={(pickedMax === CORRECT_MAX ? 1 : 0) + (pickedMin === CORRECT_MIN ? 1 : 0) + (rangeCorrect ? 1 : 0)}
          maxScore={3}
          onRetry={onRetry}
          onBack={onBack}
        />
      )}
    </div>
  )
}
