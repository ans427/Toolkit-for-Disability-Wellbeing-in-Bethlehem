import { useState, useEffect } from 'react'
import { sanity } from './sanityClient'
import { getSessionId } from './sessionUtils'
import './WasThisHelpful.css'

function WasThisHelpful({ resourceId, initialHelpfulCount = 0, initialNotHelpfulCount = 0 }) {
  const [helpfulCount, setHelpfulCount] = useState(initialHelpfulCount)
  const [notHelpfulCount, setNotHelpfulCount] = useState(initialNotHelpfulCount)
  const [userVote, setUserVote] = useState(null) // 'yes' | 'no' | null
  const [showSuggestionInput, setShowSuggestionInput] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setHelpfulCount(initialHelpfulCount)
    setNotHelpfulCount(initialNotHelpfulCount)
  }, [initialHelpfulCount, initialNotHelpfulCount])

  useEffect(() => {
    const checkUserVote = async () => {
      try {
        const sessionId = getSessionId()
        const userResult = await sanity.fetch(
          `*[_type == "resourceFeedback" && resource._ref == $resourceId && sessionId == $sessionId][0].helpful`,
          { resourceId, sessionId }
        )
        if (userResult === true) setUserVote('yes')
        else if (userResult === false) setUserVote('no')
      } catch (err) {
        console.error('Error fetching resource feedback:', err)
      } finally {
        setLoading(false)
      }
    }
    checkUserVote()
  }, [resourceId])

  const handleVote = async (value) => {
    if (userVote || submitting) return
    if (value === 'no') {
      setShowSuggestionInput(true)
      setError(null)
      return
    }
    await submitFeedback('yes', null)
  }

  const submitFeedback = async (value, suggestionText) => {
    if (submitting) return
    if (value === 'no' && (!suggestionText || suggestionText.trim().length < 20)) {
      setError('Please provide 1–2 sentences on how this resource could improve (at least 20 characters).')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const sessionId = getSessionId()
      const doc = {
        _type: 'resourceFeedback',
        resource: { _type: 'reference', _ref: resourceId },
        sessionId,
        helpful: value === 'yes',
      }
      if (value === 'no' && suggestionText?.trim()) {
        doc.suggestion = suggestionText.trim()
      }
      await sanity.create(doc)
      await sanity
        .patch(resourceId)
        .setIfMissing({ helpfulCount: 0, notHelpfulCount: 0 })
        .inc(value === 'yes' ? { helpfulCount: 1 } : { notHelpfulCount: 1 })
        .commit()
      setUserVote(value)
      setShowSuggestionInput(false)
      setSuggestion('')
      setHelpfulCount((c) => (value === 'yes' ? c + 1 : c))
      setNotHelpfulCount((c) => (value === 'no' ? c + 1 : c))
    } catch (err) {
      console.error('Error submitting feedback:', err)
      setError(err?.message || 'Failed to save your feedback. Check that VITE_SANITY_TOKEN is set in .env with write permissions.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitSuggestion = () => {
    submitFeedback('no', suggestion)
  }

  const handleCancelSuggestion = () => {
    setShowSuggestionInput(false)
    setSuggestion('')
    setError(null)
  }

  if (loading) {
    return (
      <section className="was-this-helpful was-this-helpful--loading" aria-hidden="true">
        <div className="was-this-helpful-skeleton" />
      </section>
    )
  }

  const totalVotes = helpfulCount + notHelpfulCount
  const hasVoted = userVote !== null

  return (
    <section
      className={`was-this-helpful ${hasVoted ? 'was-this-helpful--voted' : ''}`}
      aria-label="Rate this resource"
    >
      <div className="was-this-helpful-card">
        {hasVoted ? (
          <>
            <p className="was-this-helpful-thanks">Thank you for your feedback.</p>
            {totalVotes > 0 && (
              <p className="was-this-helpful-counts" aria-live="polite">
                <span className="was-this-helpful-count was-this-helpful-count--yes">
                  <span className="was-this-helpful-icon" aria-hidden>👍</span>
                  {helpfulCount} found this helpful
                </span>
                {notHelpfulCount > 0 && (
                  <>
                    <span className="was-this-helpful-sep">·</span>
                    <span className="was-this-helpful-count was-this-helpful-count--no">
                      <span className="was-this-helpful-icon" aria-hidden>👎</span>
                      {notHelpfulCount} did not
                    </span>
                  </>
                )}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="was-this-helpful-question">Was this helpful?</p>
            {totalVotes > 0 && (
              <p className="was-this-helpful-counts was-this-helpful-counts--prompt">
                <span className="was-this-helpful-count was-this-helpful-count--yes">
                  <span className="was-this-helpful-icon" aria-hidden>👍</span>
                  {helpfulCount}
                </span>
                <span className="was-this-helpful-sep">·</span>
                <span className="was-this-helpful-count was-this-helpful-count--no">
                  <span className="was-this-helpful-icon" aria-hidden>👎</span>
                  {notHelpfulCount}
                </span>
              </p>
            )}
            {error && (
              <p className="was-this-helpful-error" role="alert">
                {error}
              </p>
            )}
            {showSuggestionInput ? (
              <div className="was-this-helpful-suggestion">
                <label htmlFor="was-this-helpful-suggestion-input" className="was-this-helpful-suggestion-label">
                  How could this resource be improved? (1–2 sentences required)
                </label>
                <textarea
                  id="was-this-helpful-suggestion-input"
                  className="was-this-helpful-suggestion-input"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="e.g., Add more contact options or clarify the eligibility requirements…"
                  rows={3}
                  maxLength={500}
                  disabled={submitting}
                  aria-required="true"
                />
                <div className="was-this-helpful-suggestion-actions">
                  <button
                    type="button"
                    className="was-this-helpful-btn was-this-helpful-btn-no"
                    onClick={handleCancelSuggestion}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="was-this-helpful-btn was-this-helpful-btn-yes"
                    onClick={handleSubmitSuggestion}
                    disabled={submitting || suggestion.trim().length < 20}
                  >
                    {submitting ? 'Submitting…' : 'Submit feedback'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="was-this-helpful-buttons" role="group" aria-label="Yes or No">
                <button
                  type="button"
                  className="was-this-helpful-btn was-this-helpful-btn-yes"
                  onClick={() => handleVote('yes')}
                  disabled={submitting}
                  aria-pressed={false}
                >
                  <span className="was-this-helpful-btn-icon" aria-hidden>👍</span>
                  Yes
                </button>
                <button
                  type="button"
                  className="was-this-helpful-btn was-this-helpful-btn-no"
                  onClick={() => handleVote('no')}
                  disabled={submitting}
                  aria-pressed={false}
                >
                  <span className="was-this-helpful-btn-icon" aria-hidden>👎</span>
                  No
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default WasThisHelpful
