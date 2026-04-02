import { useState } from 'react'
import ResultBanner from '../ResultBanner'

const BUCKETS = [
  {
    id: 'number',
    label: 'Numbers',
    icon: '🔢',
    hint: 'Values you can do maths with — add, subtract, measure',
  },
  {
    id: 'category',
    label: 'Categories',
    icon: '🏷️',
    hint: 'Labels or names that describe a group — you can\'t add them together',
  },
  {
    id: 'yesno',
    label: 'Yes / No',
    icon: '✅',
    hint: 'Only two possible answers — true/false, yes/no, on/off',
  },
]

const ITEMS = [
  { id: 'i1',  label: '42',       correct: 'number'   },
  { id: 'i2',  label: '3.7',      correct: 'number'   },
  { id: 'i3',  label: '100',      correct: 'number'   },
  { id: 'i4',  label: '-5',       correct: 'number'   },
  { id: 'i5',  label: 'Blue',     correct: 'category' },
  { id: 'i6',  label: 'Football', correct: 'category' },
  { id: 'i7',  label: 'Monday',   correct: 'category' },
  { id: 'i8',  label: 'Pizza',    correct: 'category' },
  { id: 'i9',  label: 'Yes',      correct: 'yesno'    },
  { id: 'i10', label: 'No',       correct: 'yesno'    },
  { id: 'i11', label: 'True',     correct: 'yesno'    },
  { id: 'i12', label: 'False',    correct: 'yesno'    },
]

export default function DataTypeSorter({ savedResult, onComplete, onRetry, onBack }) {
  // placed: { itemId: bucketId }
  const [placed, setPlaced]       = useState(savedResult ? savedResult.answers.placed : {})
  const [dragging, setDragging]   = useState(null)   // itemId being dragged
  const [dragOver, setDragOver]   = useState(null)   // bucketId being hovered
  const [submitted, setSubmitted] = useState(!!savedResult)

  const unplaced = ITEMS.filter(item => !placed[item.id])

  // ── drag from pool ──
  function onDragStartPool(itemId) {
    setDragging(itemId)
  }

  // ── drag from an already-placed bucket chip back out ──
  function onDragStartPlaced(itemId) {
    setDragging(itemId)
    // remove from its current bucket immediately so the slot opens up
    setPlaced(prev => {
      const next = { ...prev }
      delete next[itemId]
      return next
    })
  }

  function onDragOverBucket(e, bucketId) {
    e.preventDefault()
    setDragOver(bucketId)
  }

  function onDropBucket(bucketId) {
    if (!dragging) return
    setPlaced(prev => ({ ...prev, [dragging]: bucketId }))
    setDragging(null)
    setDragOver(null)
  }

  // dropping back onto the pool removes the item from any bucket
  function onDropPool(e) {
    e.preventDefault()
    if (!dragging) return
    setPlaced(prev => {
      const next = { ...prev }
      delete next[dragging]
      return next
    })
    setDragging(null)
    setDragOver(null)
  }

  function onDragEnd() {
    setDragging(null)
    setDragOver(null)
  }

  function handleSubmit() {
    const score = ITEMS.reduce(
      (acc, item) => acc + (placed[item.id] === item.correct ? 1 : 0), 0
    )
    setSubmitted(true)
    onComplete(score, ITEMS.length, { placed })
  }

  const allPlaced = ITEMS.every(item => placed[item.id])
  const score = submitted
    ? ITEMS.reduce((acc, item) => acc + (placed[item.id] === item.correct ? 1 : 0), 0)
    : null

  return (
    <div className="activity-content">
      <p className="activity-intro">
        Not all data is the same! There are three main types. <strong>Drag each item</strong> into the bucket it belongs to. You can drag items back out to move them.
      </p>

      {/* Item pool */}
      <div
        className="item-pool"
        onDragOver={e => e.preventDefault()}
        onDrop={onDropPool}
      >
        <p className="pool-label">Items to sort:</p>
        <div className="pool-chips">
          {unplaced.length > 0
            ? unplaced.map(item => (
                <div
                  key={item.id}
                  className={`pool-chip ${dragging === item.id ? 'pool-chip--dragging' : ''}`}
                  draggable={!submitted}
                  onDragStart={() => onDragStartPool(item.id)}
                  onDragEnd={onDragEnd}
                >
                  {item.label}
                </div>
              ))
            : <span className="bucket-empty">All items sorted! ✓</span>
          }
        </div>
      </div>

      {/* Buckets */}
      <div className="buckets-row">
        {BUCKETS.map(bucket => {
          const bucketItems = ITEMS.filter(item => placed[item.id] === bucket.id)
          const isOver = dragOver === bucket.id

          return (
            <div
              key={bucket.id}
              className={`bucket ${isOver && !submitted ? 'bucket--drag-over' : ''}`}
              onDragOver={e => onDragOverBucket(e, bucket.id)}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => onDropBucket(bucket.id)}
            >
              <div className="bucket-header">
                <span className="bucket-icon">{bucket.icon}</span>
                <span className="bucket-label">{bucket.label}</span>
              </div>
              <p className="bucket-hint">{bucket.hint}</p>
              <div className="bucket-items">
                {bucketItems.map(item => {
                  const correct = item.correct === bucket.id
                  return (
                    <div
                      key={item.id}
                      className={`bucket-chip
                        ${!submitted ? 'bucket-chip--draggable' : ''}
                        ${submitted && correct  ? 'bucket-chip--correct' : ''}
                        ${submitted && !correct ? 'bucket-chip--wrong'   : ''}
                      `}
                      draggable={!submitted}
                      onDragStart={() => onDragStartPlaced(item.id)}
                      onDragEnd={onDragEnd}
                      title={submitted ? '' : 'Drag to move'}
                    >
                      {item.label}
                      {submitted && <span>{correct ? ' ✅' : ' ✗'}</span>}
                    </div>
                  )
                })}
                {bucketItems.length === 0 && (
                  <span className="bucket-empty">
                    {isOver ? 'Drop here!' : 'Drag items here'}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {submitted && (
        <div className="explanation-box">
          <strong>The three data types:</strong><br />
          🔢 <strong>Numbers</strong> — 42, 3.7, -5, 100 — you can add, subtract, and measure these.<br />
          🏷️ <strong>Categories</strong> — Blue, Football, Monday, Pizza — labels that describe something.<br />
          ✅ <strong>Yes/No</strong> — True, False, Yes, No — only two possible values.
        </div>
      )}

      {!submitted && (
        <button className="btn btn--primary" onClick={handleSubmit} disabled={!allPlaced}>
          Lock in my sorting!
        </button>
      )}

      {submitted && (
        <ResultBanner score={score} maxScore={ITEMS.length} onRetry={onRetry} onBack={onBack} />
      )}
    </div>
  )
}
