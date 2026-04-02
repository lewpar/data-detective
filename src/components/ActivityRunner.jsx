import React, { useState } from 'react'
import TallyTime from './activities/TallyTime'
import SortSquad from './activities/SortSquad'
import ChartReader from './activities/ChartReader'
import DataTypeSorter from './activities/DataTypeSorter'
import RangeFinder from './activities/RangeFinder'
import PictographPuzzle from './activities/PictographPuzzle'
import MeanMachine from './activities/MeanMachine'
import OutlierDetective from './activities/OutlierDetective'
import DataGaps from './activities/DataGaps'
import TrendTracker from './activities/TrendTracker'
import SurveyShowdown from './activities/SurveyShowdown'
import ChartChooser from './activities/ChartChooser'

const ACTIVITY_COMPONENTS = {
  'tally': TallyTime,
  'sort': SortSquad,
  'chart-reader': ChartReader,
  'data-type-sorter': DataTypeSorter,
  'range-finder': RangeFinder,
  'pictograph-puzzle': PictographPuzzle,
  'mean-machine': MeanMachine,
  'outlier': OutlierDetective,
  'data-gaps': DataGaps,
  'trend-tracker': TrendTracker,
  'survey-showdown': SurveyShowdown,
  'chart-chooser': ChartChooser,
}

export default function ActivityRunner({ activity, savedResult, onComplete, onBack }) {
  const [retryCount, setRetryCount] = useState(0)
  const Component = ACTIVITY_COMPONENTS[activity.type]

  function handleRetry() {
    setRetryCount(c => c + 1)
  }

  if (!Component) {
    return (
      <div className="runner-wrap">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <p>Activity not found.</p>
      </div>
    )
  }

  return (
    <div className="runner-wrap">
      <div className="runner-header">
        <button className="back-btn" onClick={onBack}>← Cases</button>
        <div className="runner-title-row">
          <span className="runner-emoji">{activity.emoji}</span>
          <div>
            <h2 className="runner-title">{activity.title}</h2>
            <span className={`diff-pill diff-pill--${activity.difficulty}`}>{activity.difficulty}</span>
          </div>
        </div>
      </div>
      {activity.learningOutcome && (
        <div className="learning-outcome">
          <span className="learning-outcome-label">🎯 What you're practising</span>
          <p>{activity.learningOutcome}</p>
        </div>
      )}

      <Component
        key={retryCount}
        savedResult={retryCount > 0 ? null : savedResult}
        onComplete={onComplete}
        onRetry={handleRetry}
        onBack={onBack}
      />
    </div>
  )
}
