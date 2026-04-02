import React, { useState } from 'react'
import ResultBanner from '../ResultBanner'

const DATASETS = [
  {
    context: 'Five friends compared how many books they read last month:',
    values: [4, 7, 3, 8, 3],
    unit: 'books',
  },
  {
    context: 'A class measured how long (in minutes) they spent reading each evening:',
    values: [20, 35, 45, 30, 25],
    unit: 'min',
  },
  {
    context: 'A shop recorded daily ice-cream sales over a week:',
    values: [12, 18, 15, 22, 9, 14, 10],
    unit: 'ice creams',
  },
]

export default function MeanMachine({ savedResult, onComplete, onRetry, onBack }) {
  const [datasetIdx] = useState(0)
  const dataset = DATASETS[datasetIdx]
  const sum = dataset.values.reduce((a, b) => a + b, 0)
  const mean = sum / dataset.values.length

  const [step, setStep] = useState(savedResult ? 3 : 0)
  const [sumInput, setSumInput] = useState(savedResult ? String(sum) : '')
  const [meanInput, setMeanInput] = useState(savedResult ? String(mean) : '')
  const [submitted, setSubmitted] = useState(!!savedResult)

  function handleSumCheck() {
    if (parseInt(sumInput, 10) === sum) setStep(2)
    else {
      setSumInput('')
      alert(`Not quite! Hint: add all the numbers together.`)
    }
  }

  function handleMeanSubmit() {
    const parsed = parseFloat(meanInput)
    const correct = Math.abs(parsed - mean) < 0.1
    const score = correct ? 3 : 1
    setStep(3)
    setSubmitted(true)
    onComplete(score, 3, { sum: sumInput, mean: meanInput })
  }

  const sumCorrect = parseInt(sumInput, 10) === sum
  const meanCorrect = Math.abs(parseFloat(meanInput) - mean) < 0.1

  return (
    <div className="activity-content">
      <p className="activity-intro">
        The <strong>mean</strong> (also called the average) is found by adding all the values together, then dividing by how many values there are. It gives you a "middle" number that represents the whole group. Work through the steps below!
      </p>

      <div className="dataset-card">
        <p>{dataset.context}</p>
        <div className="value-chips">
          {dataset.values.map((v, i) => (
            <span key={i} className="value-chip">{v} {dataset.unit}</span>
          ))}
        </div>
      </div>

      {/* Step 1 */}
      <div className={`step-card ${step >= 0 ? 'step-active' : ''}`}>
        <div className="step-label">Step 1 — Add them all up</div>
        <p>What is the <strong>total</strong> when you add all the values together?</p>
        <div className="step-input-row">
          <input
            className={`step-input ${step > 0 ? 'input-correct' : ''}`}
            type="text"
            inputMode="numeric"
            placeholder="Total = ?"
            value={sumInput}
            onChange={e => setSumInput(e.target.value.replace(/\D/g, ''))}
            disabled={step > 0}
          />
          {step === 0 && (
            <button className="btn btn--primary btn--sm" onClick={handleSumCheck} disabled={!sumInput}>
              Check
            </button>
          )}
          {step > 0 && <span className="step-tick">✅ {sum}</span>}
        </div>
      </div>

      {/* Step 2 */}
      {step >= 1 && (
        <div className="step-card step-active">
          <div className="step-label">Step 2 — Divide by how many values there are</div>
          <p>
            There are <strong>{dataset.values.length}</strong> values in the list.
            Divide your total by {dataset.values.length} to get the mean.
          </p>
          <div className="step-input-row">
            <input
              className={`step-input ${step > 2 ? (meanCorrect ? 'input-correct' : 'input-wrong') : ''}`}
              type="text"
              inputMode="decimal"
              placeholder="Mean = ?"
              value={meanInput}
              onChange={e => setMeanInput(e.target.value.replace(/[^0-9.]/g, ''))}
              disabled={step > 2}
            />
            {step < 3 && (
              <button className="btn btn--primary btn--sm" onClick={handleMeanSubmit} disabled={!meanInput}>
                Submit Mean
              </button>
            )}
            {step > 2 && (
              <span className={meanCorrect ? 'step-tick' : 'step-cross'}>
                {meanCorrect ? `✅ ${mean}` : `✗ (answer: ${mean})`}
              </span>
            )}
          </div>
        </div>
      )}

      {submitted && (
        <div className="explanation-box">
          <strong>Working it out:</strong><br />
          Add them all up: {dataset.values.join(' + ')} = {sum}<br />
          Divide by how many ({dataset.values.length}): {sum} ÷ {dataset.values.length} = <strong>{mean}</strong> {dataset.unit}
        </div>
      )}

      {submitted && (
        <ResultBanner
          score={meanCorrect ? 3 : 1}
          maxScore={3}
          onRetry={onRetry}
          onBack={onBack}
          customMsg={meanCorrect ? 'Correct mean! Great calculating!' : `The mean was ${mean} — you still get 1 point for finding the total!`}
        />
      )}
    </div>
  )
}
