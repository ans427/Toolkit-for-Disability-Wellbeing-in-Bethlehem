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
      name: 'experienceHeading',
      title: 'The Resident Experience heading',
      type: 'string',
      initialValue: 'The Resident Experience',
      description: 'Optional override for this card heading.',
    },
    {
      name: 'experienceHeadingI18n',
      title: 'The Resident Experience heading (translations)',
      type: 'localizedString',
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
      name: 'conditionsHeading',
      title: 'Current Conditions heading',
      type: 'string',
      initialValue: 'Current Conditions',
      description: 'Optional override for this card heading.',
    },
    {
      name: 'conditionsHeadingI18n',
      title: 'Current Conditions heading (translations)',
      type: 'localizedString',
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
      name: 'gapsHeading',
      title: 'Analyzing the Gap heading',
      type: 'string',
      initialValue: 'Analyzing the Gap',
      description: 'Optional override for this card heading.',
    },
    {
      name: 'gapsHeadingI18n',
      title: 'Analyzing the Gap heading (translations)',
      type: 'localizedString',
    },
    {
      name: 'implications',
      title: 'Policy Implications',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Each item becomes a bullet point',
    },
    {
      name: 'implicationsHeading',
      title: 'Policy Implications heading',
      type: 'string',
      initialValue: 'Policy Implications',
      description: 'Optional override for this card heading.',
    },
    {
      name: 'implicationsHeadingI18n',
      title: 'Policy Implications heading (translations)',
      type: 'localizedString',
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
