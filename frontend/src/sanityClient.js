// src/sanityClient.js
import { createClient } from '@sanity/client'

const EXPECTED_PROJECT_ID = 'bfuuhtl6'
const EXPECTED_DATASET = 'production'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || EXPECTED_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || EXPECTED_DATASET

if (projectId !== EXPECTED_PROJECT_ID || dataset !== EXPECTED_DATASET) {
  console.warn(
    `[Sanity] Frontend is using ${projectId}/${dataset}, expected ${EXPECTED_PROJECT_ID}/${EXPECTED_DATASET}. ` +
      'Check Vercel env vars VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET.'
  )
}

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion: '2026-02-05',
  useCdn: false, // Disabled for write operations
  token: import.meta.env.VITE_SANITY_TOKEN || undefined,
})