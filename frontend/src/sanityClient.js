// src/sanityClient.js
import { createClient } from '@sanity/client'

export const sanity = createClient({
  projectId: 'bfuuhtl6',
  dataset: 'production',
  apiVersion: '2026-02-05',
  useCdn: false, // Disabled for write operations
  token: import.meta.env.VITE_SANITY_TOKEN || undefined,
})