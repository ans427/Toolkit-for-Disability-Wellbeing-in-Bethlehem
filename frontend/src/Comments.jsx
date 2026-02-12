import { useState, useEffect } from 'react'
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
import './Comments.css'

function Comments({ storyId }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Fetch comments on component mount
  useEffect(() => {
    fetchComments()
    // Refresh comments every 10 seconds
    const interval = setInterval(fetchComments, 10000)
    return () => clearInterval(interval)
  }, [storyId])

  const fetchComments = async () => {
    try {
      const data = await sanity.fetch(
        `*[_type == "comment" && storyId._ref == $storyId && isFlagged == false && !defined(inlineMarker)] | order(_createdAt desc) {
          _id,
          text,
          _createdAt,
          flagCount
        }`,
        { storyId }
      )
      setComments(data || [])
      setLoading(false)
    } catch (err) {
      console.error('Error fetching comments:', err)
      setError('Failed to load comments')
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    
    // Validate input
    if (!newComment.trim()) {
      setError('Comment cannot be empty')
      return
    }

    // Check rate limit
    const limitCheck = canSubmitComment()
    if (!limitCheck.allowed) {
      setError(limitCheck.message)
      return
    }

    setSubmitting(true)
    setError('')
    setSuccessMessage('')

    try {
      const comment = {
        _type: 'comment',
        storyId: {
          _type: 'reference',
          _ref: storyId
        },
        sessionId: getSessionId(),
        text: newComment.trim(),
        flagCount: 0,
        isFlagged: false
      }

      await sanity.create(comment)
      
      recordCommentSubmission()
      setNewComment('')
      setSuccessMessage('Comment posted successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // Refetch comments
      await fetchComments()
    } catch (err) {
      console.error('Error submitting comment:', err)
      setError('Failed to post comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFlagComment = async (commentId) => {
    // Check if user already flagged this comment
    if (hasUserFlaggedComment(commentId)) {
      setError('You have already flagged this comment')
      return
    }

    // Check flag rate limit
    const limitCheck = canFlagComment()
    if (!limitCheck.allowed) {
      setError(limitCheck.message)
      return
    }

    try {
      // Update comment flag count
      const comment = await sanity.getDocument(commentId)
      const newFlagCount = (comment.flagCount || 0) + 1
      
      // Hide comment if it reaches flag threshold (5 flags)
      const shouldHide = newFlagCount >= 5
      
      await sanity.patch(commentId).set({
        flagCount: newFlagCount,
        isFlagged: shouldHide
      }).commit()

      recordCommentFlag(commentId)
      recordFlagSubmission()
      setSuccessMessage('Comment flagged. Thank you for helping keep the community safe.')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // Refetch comments
      await fetchComments()
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
    <section className="comments-section">
      <h2>Comments</h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts... (anonymous)"
          rows="3"
          maxLength="1000"
          disabled={submitting}
        />
        <div className="comment-form-footer">
          <span className="char-count">{newComment.length}/1000</span>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* Comments List */}
      <div className="comments-list">
        {loading ? (
          <p>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">Anonymous</span>
                <span className="comment-date">{formatDate(comment._createdAt)}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
              <div className="comment-footer">
                <button
                  className="flag-button"
                  onClick={() => handleFlagComment(comment._id)}
                  disabled={hasUserFlaggedComment(comment._id)}
                >
                  {hasUserFlaggedComment(comment._id) ? '✓ Flagged' : '⚠ Flag'}
                </button>
                {comment.flagCount > 0 && (
                  <span className="flag-count">{comment.flagCount} flag(s)</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default Comments
