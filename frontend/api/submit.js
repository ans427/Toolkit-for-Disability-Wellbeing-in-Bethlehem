import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'bfuuhtl6',
  dataset: 'production',
  apiVersion: '2026-02-05',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!client.config().token) {
    res
      .status(500)
      .json({ error: 'Missing SANITY_WRITE_TOKEN environment variable' })
    return
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
  const {
    type,
    submitterName,
    submitterEmail,
    resourceTitle,
    resourceUrl,
    resourceDescription,
    resourceCategory,
    storyTitle,
    storyPersonName,
    storyLocation,
    storySummary,
    storyBody,
  } = body

  if (type !== 'resource' && type !== 'communityStory') {
    res.status(400).json({ error: 'Invalid submission type' })
    return
  }

  try {
    const doc = {
      _type: 'submission',
      type,
      submitterName: submitterName || '',
      submitterEmail: submitterEmail || '',
      resourceTitle: resourceTitle || '',
      resourceUrl: resourceUrl || '',
      resourceDescription: resourceDescription || '',
      resourceCategory: resourceCategory || '',
      storyTitle: storyTitle || '',
      storyPersonName: storyPersonName || '',
      storyLocation: storyLocation || '',
      storySummary: storySummary || '',
      storyBody: storyBody || '',
    }

    const created = await client.create(doc)

    res.status(200).json({ success: true, id: created._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save submission' })
  }
}

