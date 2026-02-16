import { useState, useEffect, useRef } from 'react'
import { sanity } from './sanityClient'
import {
  canSubmitComment,
  recordCommentSubmission,
  canFlagComment,
  recordCommentFlag,
  hasUserFlaggedComment,
  recordFlagSubmission,
  getSessionId,
} from './sessionUtils'
import './InlineComments.css'

function InlineComments({ storyId, paragraphIndex, paragraphText }) {
  const [panelOpen, setPanelOpen] = useState(false)
  const [comments, setComments] = useState([])
  const [commentsCount, setCommentsCount] = useState(0)
  const [newComment, setNewComment] = useState('')
  const [selectedText, setSelectedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const wrapperRef = useRef(null)

  // Fetch only counts initially to decide whether to show badge
  useEffect(() => {
    let mounted = true
    const fetchCount = async () => {
      try {
        const data = await sanity.fetch(
          `*[_type == "comment" && storyId._ref == $storyId && isFlagged == false && defined(inlineMarker) && inlineMarker.paragraphIndex == $paragraphIndex]{_id}`,
          { storyId, paragraphIndex }
        )
        if (mounted) setCommentsCount((data && data.length) || 0)
      } catch (err) {
        console.error('Error fetching inline comment count:', err)
      }
    }

    fetchCount()
    return () => {
      mounted = false
    }
  }, [storyId, paragraphIndex])

  const fetchInlineComments = async () => {
    setLoading(true)
    try {
      const data = await sanity.fetch(
        `*[_type == "comment" && storyId._ref == $storyId && isFlagged == false && defined(inlineMarker) && inlineMarker.paragraphIndex == $paragraphIndex] | order(_createdAt desc) {
          _id,
          text,
          _createdAt,
          flagCount,
          inlineMarker{
            selectedText,
            startChar,
            endChar
          }
        }`,
        { storyId, paragraphIndex }
      )
      setComments(data || [])
      setCommentsCount((data && data.length) || 0)
    } catch (err) {
      console.error('Error fetching inline comments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTextSelect = () => {
    const selection = window.getSelection()
    const text = selection.toString()
    setSelectedText(text)
  }

  const openPanel = async () => {
    // Open panel; show passage at top but do not auto-quote it.
    setPanelOpen(true)
    await fetchInlineComments()
  }

  const closePanel = () => {
    setPanelOpen(false)
    setSelectedText('')
    setNewComment('')
    setError('')
  }

  const handleSubmitInlineComment = async (e) => {
    e.preventDefault()

    if (!newComment.trim()) {
      setError('Comment cannot be empty')
      return
    }


    const limitCheck = canSubmitComment()
    if (!limitCheck.allowed) {
      setError(limitCheck.message)
      return
    }

    try {
      const trimmed = newComment.trim()
      const comment = {
        _type: 'comment',
        storyId: {
          _type: 'reference',
          _ref: storyId
        },
        sessionId: getSessionId(),
        text: trimmed,
        inlineMarker: {
          paragraphIndex,
          selectedText: selectedText ? selectedText.trim() : '',
          startChar: 0,
          endChar: selectedText ? selectedText.length : 0,
        },
        flagCount: 0,
        isFlagged: false
      }

      await sanity.create(comment)
      recordCommentSubmission()
      setNewComment('')
      setSelectedText('')
      setError('')
      await fetchInlineComments()
    } catch (err) {
      console.error('Error submitting inline comment:', err)
      setError('Failed to post comment')
    }
  }

  const handleFlagComment = async (commentId) => {
    if (hasUserFlaggedComment(commentId)) {
      setError('You have already flagged this comment')
      return
    }

    const limitCheck = canFlagComment()
    if (!limitCheck.allowed) {
      setError(limitCheck.message)
      return
    }

    try {
      const comment = await sanity.getDocument(commentId)
      const newFlagCount = (comment.flagCount || 0) + 1
      const shouldHide = newFlagCount >= 5
      
      await sanity.patch(commentId).set({
        flagCount: newFlagCount,
        isFlagged: shouldHide
      }).commit()

      recordCommentFlag(commentId)
      recordFlagSubmission()
      await fetchInlineComments()
    } catch (err) {
      console.error('Error flagging comment:', err)
      setError('Failed to flag comment')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString()
  }

  return (
    <div ref={wrapperRef} className="inline-comment-wrapper">
      {/* Floating bubble/button */}
      <button
        className={`inline-bubble ${commentsCount > 0 ? 'has-comments' : ''}`}
        onClick={() => (panelOpen ? closePanel() : openPanel())}
        aria-label={commentsCount > 0 ? `${commentsCount} inline comments` : 'Add inline comment'}
      >
        <span className="bubble-icon">💬</span>
        {commentsCount > 0 && <span className="bubble-count">{commentsCount}</span>}
      </button>

      {/* Panel */}
      {panelOpen && (
        <div className="inline-comment-panel">
          <div className="inline-comment-header">
            <h4>Comments on this passage</h4>
            <button onClick={closePanel} className="close-button" aria-label="Close comments">×</button>
          </div>

          <form onSubmit={handleSubmitInlineComment} className="inline-comment-form">
            {paragraphText && (
              <div className="selected-text-context">
                <small>Paragraph:</small>
                  <p>{paragraphText.substring(0, 400)}{paragraphText.length > 400 ? '...' : ''}</p>
              </div>
            )}

            <div className="select-instruction">
                <small>Comment on this paragraph</small>
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={'Add a comment...'}
                rows="3"
              maxLength="500"
              onMouseUp={handleTextSelect}
            />
            <div className="inline-form-footer">
              <span className="char-count">{newComment.length}/500</span>
              <button type="submit" disabled={!newComment.trim()}>Post</button>
            </div>
          </form>

          {error && <div className="error-message">{error}</div>}

          <div className="inline-comments-list">
            {loading ? (
              <p>Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className="no-comments">Be the first to comment</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="inline-comment-item">
                  <div className="inline-comment-meta">
                    <span className="inline-comment-author">Anonymous</span>
                    <span className="inline-comment-date">{formatDate(comment._createdAt)}</span>
                  </div>

                  <p className="inline-comment-text">{comment.text}</p>

                  <button
                    className="inline-flag-button"
                    onClick={() => handleFlagComment(comment._id)}
                    disabled={hasUserFlaggedComment(comment._id)}
                  >
                    {hasUserFlaggedComment(comment._id) ? '✓ Flagged' : '⚠ Flag'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default InlineComments
