/**
 * Seeds Policy & Service Gaps content into Sanity.
 * Run from project root: cd frontend && SANITY_AUTH_TOKEN=your_token node scripts/seed-policy-gaps.mjs
 * Get a token from: https://www.sanity.io/manage → Project → API → Tokens
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'bfuuhtl6',
  dataset: 'production',
  apiVersion: '2026-02-05',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
})

if (!process.env.SANITY_AUTH_TOKEN) {
  console.error('Error: SANITY_AUTH_TOKEN is required for mutations. Set it and try again.')
  process.exit(1)
}

const policyGaps = [
  {
    _type: 'policyGap',
    title: '1. LANTA Transit Services',
    slug: { _type: 'slug', current: 'lanta' },
    experience:
      'Residents report severe difficulty scheduling rides, experiencing long wait times, or dealing with "no-shows." There are limited routes connecting to vital locations like grocery stores and healthcare facilities. Additionally, a lack of covered bus stops or benches prevents many from even attempting to use the service.',
    conditions:
      'The system relies heavily on fixed routes versus paratransit availability. Current scheduling protocols are rigid, service hours are limited, online tracking is frequently inaccurate, and bus driver accessibility training is inconsistent.',
    gaps: "LANTA's current limitations mean daily living needs (medical visits, employment, groceries) are not being met. The requirement to plan trips far in advance, coupled with unreliable service, strips individuals of their independence.",
    implications: [
      'Expand existing routes and service hours.',
      'Create specific, dedicated routes for major medical centers.',
      'Implement more reliable scheduling standards and real-time tracking.',
      "Mandate comprehensive, disability-centered training for all transit operators.",
    ],
  },
  {
    _type: 'policyGap',
    title: '2. Transportation Access (Streets & Sidewalks)',
    slug: { _type: 'slug', current: 'transportation' },
    experience:
      'Navigating the city involves constant obstacles: sidewalks that are too narrow, lacking curb cuts, poorly maintained, or entirely inaccessible to wheelchairs. Street crossings and crosswalks often feel unsafe.',
    conditions:
      'Infrastructure frequently meets only the bare minimum legal code (or relies on "grandfathered" exceptions) rather than prioritizing actual usability.',
    gaps: 'There is a massive gap between "code compliance" and daily, functional accessibility. The infrastructure is not disability-centered, resulting in a city that fails to accommodate all of its residents.',
    implications: [
      'Shift city planning from "minimum code compliance" to Universal Design standards.',
      'Implement proactive, city-funded sidewalk repair and winter maintenance programs.',
      'Audit and upgrade pedestrian crossing times and curb cuts at major intersections.',
    ],
  },
  {
    _type: 'policyGap',
    title: '3. Caregiver Access & Support',
    slug: { _type: 'slug', current: 'caregiver' },
    experience:
      'Caregivers experience high levels of burnout, financial strain, and a lack of personal time. They often feel invisible within the broader healthcare and social support systems.',
    conditions:
      'The system relies heavily on unpaid or underpaid familial labor. Respite care is expensive, and navigating the bureaucracy to get state-funded assistance is a full-time job in itself.',
    gaps: 'Caregivers are the unrecognized backbone of disability wellbeing. When caregiver support fails, the wellbeing of the disabled individual is directly compromised, yet infrastructure treats caregivers as an endless, free resource.',
    implications: [
      'Streamline bureaucratic processes for caregiver compensation and benefits.',
      'Increase local funding or grants for accessible respite care.',
      'Establish community caregiver support networks and resource hubs.',
    ],
  },
  {
    _type: 'policyGap',
    title: '4. Social and Public Space Access',
    slug: { _type: 'slug', current: 'social-spaces' },
    experience:
      "Many residents feel isolated from community events. Public gathering spaces are frequently not sensory-friendly, nor are they physically accessible, making participation exhausting or impossible.",
    conditions:
      "There is limited adoption of inclusive design in Bethlehem's public spaces. Furthermore, it is incredibly difficult to find out in advance if an event or venue will be accessible.",
    gaps: 'There is no baseline of accessibility built into the foundational infrastructure of our public spaces. Inclusion is often treated as an afterthought rather than a starting point.',
    implications: [
      'Raise accessibility standards for all public spaces and parks beyond minimum ADA requirements.',
      'Mandate that public venues and city-sponsored events clearly label their accessibility features in their marketing.',
    ],
  },
  {
    _type: 'policyGap',
    title: '5. Healthcare Access',
    slug: { _type: 'slug', current: 'healthcare' },
    experience:
      'Major obstacles include securing reliable transportation to appointments, navigating complex insurance networks, and facing prohibitive out-of-pocket costs.',
    conditions: 'There is almost no coordination between healthcare providers and municipal mobility services.',
    gaps: 'Healthcare access is heavily dependent on transportation, income, and caregiver support. Because these intersecting systems are failing, preventive care becomes inaccessible, leading to poorer health outcomes.',
    implications: [
      'Foster direct partnerships between local healthcare networks and transit authorities to guarantee medical transport.',
      'Expand telehealth infrastructure and ensure digital platforms are accessible.',
    ],
  },
  {
    _type: 'policyGap',
    title: '6. Legal Support',
    slug: { _type: 'slug', current: 'legal' },
    experience:
      'Many individuals do not know or fully understand their rights. Finding legal assistance for necessities like housing discrimination or benefits appeals is incredibly difficult.',
    conditions:
      'Legal outreach targeting the disabled community is limited. When information is available, it is often dense, scattered, and not presented in accessible formats.',
    gaps: 'While legal rights and protections exist on paper, they are functionally useless if the information is hidden behind academic jargon and scattered across agencies.',
    implications: [
      'Fund accessible, plain-language legal clinics specifically for disability rights.',
      'Create a centralized, easy-to-read local directory of legal advocates.',
    ],
  },
  {
    _type: 'policyGap',
    title: '7. Housing',
    slug: { _type: 'slug', current: 'housing' },
    experience:
      'Finding accessible and affordable housing in Bethlehem is nearly impossible. When units do exist, waitlists are years long. Tenants face severe resistance from landlords when requesting home modifications.',
    conditions:
      'Housing policy is not inclusive of disabled and aging residents. Modern developments frequently lack accessible design.',
    gaps: 'Accessibility is treated as a "specialty" or niche category of housing rather than a standard feature. This puts the financial burden of modifying units squarely onto the tenants.',
    implications: [
      'Provide tax incentives for developers who build universally designed housing.',
      'Create a city-funded grant program to help low-income residents afford necessary home modifications.',
    ],
  },
]

const policyGapsPage = {
  _id: 'policyGapsPage',
  _type: 'policyGapsPage',
  pageTitle: 'Policy & Service Gaps',
  subtitle:
    'Bridging the gap between policy and lived experience. A living document of accessibility challenges in Bethlehem and recommendations for change.',
  actionSection: {
    overlappingThemes: [
      {
        _key: 'theme1',
        label: 'Intersectionality',
        description:
          'A lack of transportation directly impacts healthcare, housing, and social life.',
      },
      {
        _key: 'theme2',
        label: 'The Caregiver Crisis',
        description:
          'Systems supporting disabled individuals rely heavily on under-supported caregivers.',
      },
      {
        _key: 'theme3',
        label: 'Paper vs. Practice',
        description:
          'Too often, accessibility in Bethlehem exists on paper, but fails in daily practice.',
      },
    ],
    forPolicymakers:
      'True change requires integrating disability into all city planning processes. Policy and design decisions must be human-centered and driven by lived experiences. Look to these gaps to see where immediate administrative changes are possible, and where long-term funding shifts are necessary.',
    forActivists:
      'Use this data to apply pressure. This toolkit highlights exactly where the systemic pressure points exist. Use these shared experiences to build stronger coalitions.',
  },
}

async function seed() {
  try {
    console.log('Creating Policy Gaps Page...')
    await client.createOrReplace(policyGapsPage)
    console.log('Policy Gaps Page created.')

    console.log('Creating Policy Gap documents...')
    for (const gap of policyGaps) {
      await client.createOrReplace({
        ...gap,
        _id: `policyGap-${gap.slug.current}`,
      })
      console.log(`  - ${gap.title}`)
    }

    console.log('\nSeeding complete. Publish the documents in Sanity Studio to make them live.')
  } catch (err) {
    console.error('Seed failed:', err)
    process.exit(1)
  }
}

seed()
