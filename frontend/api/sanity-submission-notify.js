const SUPPORTED_TYPES = new Set(['submission', 'accessibilityReport', 'siteIssueReport'])

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function getDocumentFromPayload(payload) {
  if (!payload || typeof payload !== 'object') return null
  if (payload.document && typeof payload.document === 'object') return payload.document
  if (payload.result && typeof payload.result === 'object') return payload.result
  return payload
}

function inferSubmissionLabel(doc) {
  if (!doc) return 'Submission'
  if (doc._type === 'submission') {
    if (doc.type === 'communityStory') return 'Community Story Submission'
    return 'Resource Submission'
  }
  if (doc._type === 'accessibilityReport') return 'Accessibility Map Report'
  if (doc._type === 'siteIssueReport') return 'Website Issue Report'
  return 'Submission'
}

function buildSummaryRows(doc) {
  if (!doc) return []

  const rows = []
  const add = (label, value) => {
    if (value == null || value === '') return
    rows.push([label, String(value)])
  }

  add('Document ID', doc._id)
  add('Document type', doc._type)
  add('Submitted by', doc.submitterName)
  add('Submitter email', doc.submitterEmail)
  add('Status', doc.status)

  if (doc._type === 'submission') {
    add('Submission kind', doc.type)
    add('Resource title', doc.resourceTitle)
    add('Resource URL', doc.resourceUrl)
    add('Resource category', doc.resourceCategory)
    add('Story title', doc.storyTitle)
    add('Story person name', doc.storyPersonName)
    add('Story location', doc.storyLocation)
  }

  if (doc._type === 'accessibilityReport') {
    add('Subject', doc.subject)
    add('Location type', doc.locationType)
  }

  if (doc._type === 'siteIssueReport') {
    add('Subject', doc.subject)
    add('Page URL', doc.pageUrl)
    add('Location description', doc.locationDescription)
  }

  return rows
}

function buildEmailHtml(doc, studioBaseUrl) {
  const rows = buildSummaryRows(doc)
  const label = inferSubmissionLabel(doc)
  const studioLink = studioBaseUrl && doc?._id
    ? `${studioBaseUrl.replace(/\/$/, '')}/structure;${encodeURIComponent(doc._type)};${encodeURIComponent(doc._id)}`
    : null

  const rowsHtml = rows
    .map(
      ([key, value]) =>
        `<tr><td style="padding:6px 10px;border:1px solid #ddd;font-weight:600;">${escapeHtml(key)}</td><td style="padding:6px 10px;border:1px solid #ddd;">${escapeHtml(value)}</td></tr>`
    )
    .join('')

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111;">
      <h2 style="margin-bottom:8px;">New ${escapeHtml(label)}</h2>
      <p style="margin-top:0;">A new form submission was created in Sanity.</p>
      <table style="border-collapse:collapse;margin:14px 0;">
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
      ${
        studioLink
          ? `<p><a href="${escapeHtml(studioLink)}">Open this document in Sanity Studio</a></p>`
          : ''
      }
      <details style="margin-top:10px;">
        <summary>Raw payload</summary>
        <pre style="white-space:pre-wrap;background:#f7f7f8;padding:10px;border-radius:6px;">${escapeHtml(
          JSON.stringify(doc, null, 2)
        )}</pre>
      </details>
    </div>
  `
}

async function sendEmail({ apiKey, from, to, subject, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Resend error (${response.status}): ${text}`)
  }
}

async function sendToGoogleAppsScript({ url, doc, webhookSecret }) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source: 'sanity-submission-notify',
      webhookSecret: webhookSecret || '',
      document: doc,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Google Apps Script error (${response.status}): ${text}`)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const webhookSecret = process.env.SANITY_WEBHOOK_SECRET
  const authorization = req.headers.authorization || ''
  if (webhookSecret && authorization !== `Bearer ${webhookSecret}`) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const doc = getDocumentFromPayload(req.body)
  if (!doc || !SUPPORTED_TYPES.has(doc._type)) {
    res.status(200).json({ ok: true, skipped: true })
    return
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const googleAppsScriptWebhookUrl = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL
  const notifyTo = process.env.NOTIFY_EMAIL_TO || 'inclusivebethlehem@gmail.com'
  const notifyFrom = process.env.NOTIFY_EMAIL_FROM || 'Toolkit Notifications <onboarding@resend.dev>'
  const studioBaseUrl = process.env.SANITY_STUDIO_BASE_URL

  if (!googleAppsScriptWebhookUrl && !resendApiKey) {
    res.status(500).json({
      error: 'Missing email provider config. Set GOOGLE_APPS_SCRIPT_WEBHOOK_URL or RESEND_API_KEY.',
    })
    return
  }

  try {
    const label = inferSubmissionLabel(doc)
    if (googleAppsScriptWebhookUrl) {
      await sendToGoogleAppsScript({
        url: googleAppsScriptWebhookUrl,
        doc: {
          ...doc,
          _notificationLabel: label,
          _notificationRecipient: notifyTo,
          _notificationSender: notifyFrom,
          _studioLink: studioBaseUrl && doc?._id
            ? `${studioBaseUrl.replace(/\/$/, '')}/structure;${encodeURIComponent(doc._type)};${encodeURIComponent(doc._id)}`
            : '',
        },
        webhookSecret,
      })
    } else {
      await sendEmail({
        apiKey: resendApiKey,
        from: notifyFrom,
        to: notifyTo,
        subject: `[Toolkit] New ${label}`,
        html: buildEmailHtml(doc, studioBaseUrl),
      })
    }

    res.status(200).json({ ok: true })
  } catch (error) {
    console.error('Failed to send submission notification:', error)
    res.status(500).json({ error: 'Failed to send notification email' })
  }
}
