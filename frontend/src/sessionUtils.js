// Session and spam prevention utilities

// Get or create a session ID for anonymous users
export const getSessionId = () => {
  let sessionId = localStorage.getItem('tk_sessionId')
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('tk_sessionId', sessionId)
  }
  
  return sessionId
}

// Rate limiting: track comment submission times per session
const RATE_LIMIT_KEY = 'tk_commentSubmissions'
const RATE_LIMIT_WINDOW = 60000 // 1 minute in milliseconds
const MAX_COMMENTS_PER_WINDOW = 3 // Max 3 comments per minute

export const canSubmitComment = () => {
  const sessionId = getSessionId()
  const submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}')
  
  if (!submissions[sessionId]) {
    submissions[sessionId] = []
  }

  const now = Date.now()
  // Filter out old submissions outside the time window
  submissions[sessionId] = submissions[sessionId].filter(
    time => now - time < RATE_LIMIT_WINDOW
  )

  // Check if limit exceeded
  if (submissions[sessionId].length >= MAX_COMMENTS_PER_WINDOW) {
    return {
      allowed: false,
      message: `You can submit at most ${MAX_COMMENTS_PER_WINDOW} comments per minute. Please wait before posting again.`,
      remaining: Math.ceil((RATE_LIMIT_WINDOW - (now - submissions[sessionId][0])) / 1000)
    }
  }

  return { allowed: true }
}

export const recordCommentSubmission = () => {
  const sessionId = getSessionId()
  const submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}')
  
  if (!submissions[sessionId]) {
    submissions[sessionId] = []
  }
  
  submissions[sessionId].push(Date.now())
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(submissions))
}

// Track flagged comments per session (prevent spam flagging)
const FLAG_LIMIT_KEY = 'tk_commentFlags'
const FLAG_LIMIT_WINDOW = 86400000 // 24 hours
const MAX_FLAGS_PER_WINDOW = 10 // Max 10 flags per day

export const canFlagComment = () => {
  const sessionId = getSessionId()
  const flags = JSON.parse(localStorage.getItem(FLAG_LIMIT_KEY) || '{}')
  
  if (!flags[sessionId]) {
    flags[sessionId] = []
  }

  const now = Date.now()
  flags[sessionId] = flags[sessionId].filter(
    time => now - time < FLAG_LIMIT_WINDOW
  )

  if (flags[sessionId].length >= MAX_FLAGS_PER_WINDOW) {
    return {
      allowed: false,
      message: 'You have reached your daily flag limit. Please try again tomorrow.'
    }
  }

  return { allowed: true }
}

export const recordFlagSubmission = () => {
  const sessionId = getSessionId()
  const flags = JSON.parse(localStorage.getItem(FLAG_LIMIT_KEY) || '{}')
  
  if (!flags[sessionId]) {
    flags[sessionId] = []
  }
  
  flags[sessionId].push(Date.now())
  localStorage.setItem(FLAG_LIMIT_KEY, JSON.stringify(flags))
}

// Track viewed comments to prevent duplicate flags on same comment
export const hasUserFlaggedComment = (commentId) => {
  const sessionId = getSessionId()
  const flaggedComments = JSON.parse(localStorage.getItem(`tk_flagged_${sessionId}`) || '[]')
  return flaggedComments.includes(commentId)
}

export const recordCommentFlag = (commentId) => {
  const sessionId = getSessionId()
  const flaggedComments = JSON.parse(localStorage.getItem(`tk_flagged_${sessionId}`) || '[]')
  
  if (!flaggedComments.includes(commentId)) {
    flaggedComments.push(commentId)
    localStorage.setItem(`tk_flagged_${sessionId}`, JSON.stringify(flaggedComments))
  }
}
