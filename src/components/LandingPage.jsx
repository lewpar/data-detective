import React from 'react'

const SKILLS = [
  { icon: '📊', label: 'Read charts and graphs' },
  { icon: '🔍', label: 'Spot mistakes and outliers in data' },
  { icon: '📈', label: 'Identify trends and make predictions' },
  { icon: '🏷️', label: 'Understand different types of data' },
  { icon: '🧹', label: 'Recognise data quality problems' },
  { icon: '🗂️', label: 'Choose the right chart for the job' },
]

export default function LandingPage({ onStart }) {
  return (
    <div className="landing">
      <div className="landing-inner">

        <h1 className="landing-title">
          <span className="landing-icon">🔎</span>
          Data Detective
        </h1>

        <p className="landing-tagline">
          The world runs on data. Detectives use evidence to solve cases —
          data analysts use numbers to uncover the truth. Can you crack the cases?
        </p>

        <div className="landing-skills">
          <p className="landing-skills-heading">In this investigation you'll learn to:</p>
          <div className="landing-skills-grid">
            {SKILLS.map(s => (
              <div key={s.label} className="landing-skill-item">
                <span className="landing-skill-icon">{s.icon}</span>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn--start" onClick={onStart}>
          Click to Start Investigating →
        </button>
      </div>
    </div>
  )
}
