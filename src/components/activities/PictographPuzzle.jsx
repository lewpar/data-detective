import { useState } from 'react'
import ResultBanner from '../ResultBanner'

// 1 symbol = 1 vote. No maths — just reading pictures as numbers.
const ROWS = [
  { animal: 'Lion',     emoji: '🦁', votes: 4 },
  { animal: 'Elephant', emoji: '🐘', votes: 6 },
  { animal: 'Penguin',  emoji: '🐧', votes: 3 },
  { animal: 'Giraffe',  emoji: '🦒', votes: 5 },
]

// Sequential tasks answered by clicking a row or typing a number
const TASKS = [
  {
    id: 't1',
    prompt: 'Which animal got the most votes? Click that row.',
    type: 'click-row',
    correct: 'Elephant',
    feedback: 'Elephant has 6 symbols — more than any other row. Six symbols = six votes.',
  },
  {
    id: 't2',
    prompt: 'Which animal got the fewest votes? Click that row.',
    type: 'click-row',
    correct: 'Penguin',
    feedback: 'Penguin only has 3 symbols — the shortest row. Three symbols = three votes.',
  },
  {
    id: 't3',
    prompt: 'Count the symbols in the Lion row. How many votes did Lion get? Type your answer.',
    type: 'type-number',
    correct: 4,
    feedback: 'Lion has 4 🦁 symbols, so Lion got 4 votes. Each symbol stands for exactly one vote.',
  },
  {
    id: 't4',
    prompt: 'Giraffe and Penguin — if you added their votes together, which single animal has the same total? Click that row.',
    type: 'click-row',
    correct: 'Elephant',
    feedback: 'Giraffe (5) + Penguin (3) = 8? No — count again: Giraffe has 5 votes, Penguin has 3. 5 + 3 = 8. Elephant has 6 votes, Lion has 4. Actually: Penguin (3) + Lion (4) = 7? Let\'s check: Giraffe (5) + Penguin (3) = 8. Elephant = 6. Hmm — Giraffe (5) + Lion (4) = 9. Lion (4) + Penguin (3) = 7. Elephant (6) + Penguin (3) = 9. The pictograph makes it easy to compare by eye — Elephant\'s row is the longest!',
  },
]

// Fix task 4 to make mathematical sense
const CORRECT_TASKS = [
  {
    id: 't1',
    prompt: 'Which animal got the most votes? Click that row.',
    type: 'click-row',
    correct: 'Elephant',
    feedback: 'Elephant has the longest row — 6 symbols means 6 votes. You can tell at a glance just by looking at which row is longest!',
  },
  {
    id: 't2',
    prompt: 'Which animal got the fewest votes? Click that row.',
    type: 'click-row',
    correct: 'Penguin',
    feedback: 'Penguin has the shortest row — 3 symbols means 3 votes. The picture makes it immediately obvious.',
  },
  {
    id: 't3',
    prompt: 'Count the 🦁 symbols in the Lion row. How many votes did Lion get?',
    type: 'type-number',
    correct: 4,
    feedback: 'Lion has 4 symbols, so Lion got 4 votes. Each symbol represents one real vote — that\'s the whole point of a pictograph!',
  },
  {
    id: 't4',
    prompt: 'Which animal got exactly 1 more vote than Penguin? Click that row.',
    type: 'click-row',
    correct: 'Lion',
    feedback: 'Penguin got 3 votes. One more than 3 is 4. Lion has 4 symbols — you can see Lion\'s row is just one symbol longer than Penguin\'s.',
  },
]

export default function PictographPuzzle({ savedResult, onComplete, onRetry, onBack }) {
  const [taskIdx,    setTaskIdx]    = useState(savedResult ? CORRECT_TASKS.length : 0)
  const [selected,   setSelected]   = useState(null)
  const [typeInput,  setTypeInput]  = useState('')
  const [confirmed,  setConfirmed]  = useState(false)
  const [wrongFlash, setWrongFlash] = useState(null)
  const [score,      setScore]      = useState(savedResult ? savedResult.score : 0)
  const [submitted,  setSubmitted]  = useState(!!savedResult)

  const task = CORRECT_TASKS[taskIdx]
  const allDone = taskIdx >= CORRECT_TASKS.length

  function handleRowClick(animal) {
    if (confirmed || submitted || task?.type !== 'click-row') return
    setSelected(animal)
  }

  function handleConfirm() {
    if (confirmed) return
    const task = CORRECT_TASKS[taskIdx]
    let correct = false
    if (task.type === 'click-row') correct = selected === task.correct
    if (task.type === 'type-number') correct = parseInt(typeInput, 10) === task.correct

    if (!correct && task.type === 'click-row') {
      setWrongFlash(selected)
      setTimeout(() => setWrongFlash(null), 600)
    }

    const newScore = score + (correct ? 1 : 0)
    setScore(newScore)
    setConfirmed(true)

    if (taskIdx === CORRECT_TASKS.length - 1) {
      setTimeout(() => {
        setSubmitted(true)
        onComplete(newScore, CORRECT_TASKS.length, { score: newScore })
      }, 1600)
    }
  }

  function advanceTask() {
    setTaskIdx(i => i + 1)
    setSelected(null)
    setTypeInput('')
    setConfirmed(false)
    setWrongFlash(null)
  }

  const currentTask = CORRECT_TASKS[taskIdx]
  const canConfirm = currentTask?.type === 'click-row'
    ? selected !== null
    : typeInput !== ''

  return (
    <div className="activity-content">
      <p className="activity-intro">
        A <strong>pictograph</strong> uses pictures or symbols to show data instead of plain numbers.
        Each symbol stands for one real thing — making it easy to compare groups just by looking at the row lengths!
      </p>

      {/* The pictograph — always visible */}
      <div className="pictograph">
        <div className="pictograph-key">
          Each symbol = 1 vote &nbsp;|&nbsp; Click a row to select it
        </div>

        {ROWS.map(row => {
          const isSelected = selected === row.animal
          const isWrong = wrongFlash === row.animal
          const isCorrectRow = confirmed && currentTask?.correct === row.animal

          return (
            <button
              key={row.animal}
              className={`pictograph-row pictograph-row--btn
                ${isSelected && !confirmed ? 'pictograph-row--selected' : ''}
                ${isCorrectRow ? 'pictograph-row--correct' : ''}
                ${isWrong ? 'pictograph-row--wrong-flash' : ''}
                ${submitted ? 'pictograph-row--static' : ''}
              `}
              onClick={() => handleRowClick(row.animal)}
              disabled={submitted || confirmed || currentTask?.type !== 'click-row'}
            >
              <span className="pictograph-label">{row.emoji} {row.animal}</span>
              <div className="pictograph-symbols">
                {Array.from({ length: row.votes }).map((_, si) => (
                  <span key={si} className="pictograph-cell pictograph-cell--filled">
                    {row.emoji}
                  </span>
                ))}
              </div>
              <span className="pictograph-vote-count">{row.votes}</span>
            </button>
          )
        })}
      </div>

      {/* Task prompt */}
      {!submitted && (
        <div className="task-prompt-card">
          <div className="task-counter">Question {taskIdx + 1} of {CORRECT_TASKS.length}</div>
          <p className="task-prompt">{currentTask?.prompt}</p>

          {currentTask?.type === 'type-number' && !confirmed && (
            <div className="step-input-row">
              <input
                className="step-input"
                type="text"
                inputMode="numeric"
                placeholder="Count the symbols..."
                value={typeInput}
                onChange={e => setTypeInput(e.target.value.replace(/\D/g, ''))}
                maxLength={2}
                autoFocus
              />
              <button
                className="btn btn--primary btn--sm"
                onClick={handleConfirm}
                disabled={!canConfirm}
              >
                That's my answer!
              </button>
            </div>
          )}

          {currentTask?.type === 'click-row' && !confirmed && (
            <button
              className="btn btn--primary"
              onClick={handleConfirm}
              disabled={!canConfirm}
            >
              That's my answer!
            </button>
          )}

          {confirmed && (
            <div className={`task-feedback ${
              (currentTask?.type === 'click-row' ? selected === currentTask.correct : parseInt(typeInput) === currentTask.correct)
                ? 'task-feedback--correct' : 'task-feedback--wrong'
            }`}>
              <strong>
                {(currentTask?.type === 'click-row' ? selected === currentTask.correct : parseInt(typeInput) === currentTask.correct)
                  ? '✅ Correct!'
                  : `✗ The answer was ${currentTask?.correct}`}
              </strong>
              <p>{currentTask?.feedback}</p>
              {taskIdx < CORRECT_TASKS.length - 1 && (
                <button className="btn btn--primary" onClick={advanceTask}>Next Question →</button>
              )}
            </div>
          )}
        </div>
      )}

      {submitted && (
        <div className="explanation-box">
          A pictograph turns numbers into a visual — instead of reading "6", you see six symbols in a row.
          This makes it much easier to spot which group is biggest or smallest without doing any calculations.
          Pictographs are one of the oldest ways humans have recorded and shared data.
        </div>
      )}

      {submitted && (
        <ResultBanner score={score} maxScore={CORRECT_TASKS.length} onRetry={onRetry} onBack={onBack} />
      )}
    </div>
  )
}
