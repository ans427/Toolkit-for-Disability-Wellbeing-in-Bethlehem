export default {
  name: 'policyGap',
  title: 'Policy Gap',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "1. LANTA Transit Services"',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'titleI18n',
      title: 'Title (translations)',
      type: 'localizedString',
    },
    {
      name: 'slug',
      title: 'Slug (for anchor link)',
      type: 'slug',
      description: 'Used for the #anchor in the table of contents (e.g. lanta, transportation)',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'experience',
      title: 'The Resident Experience',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'experienceI18n',
      title: 'The Resident Experience (translations)',
      type: 'localizedText',
      rows: 4,
    },
    {
      name: 'conditions',
      title: 'Current Conditions',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'conditionsI18n',
      title: 'Current Conditions (translations)',
      type: 'localizedText',
      rows: 4,
    },
    {
      name: 'gaps',
      title: 'Analyzing the Gap',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'gapsI18n',
      title: 'Analyzing the Gap (translations)',
      type: 'localizedText',
      rows: 4,
    },
    {
      name: 'implications',
      title: 'Policy Implications',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Each item becomes a bullet point',
    },
    {
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Describe the image for screen readers',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    },
  ],
  orderings: [
    {
      title: 'Title (A–Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title || 'Untitled Policy Gap' }
    },
  },
}
