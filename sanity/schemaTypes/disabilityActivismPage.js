export default {
  name: 'disabilityActivismPage',
  title: 'Disability Activism Page',
  type: 'document',
  fields: [
    {
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Disability Activism',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Optional subtitle, e.g. "Current Terms, Activism, and Questions"',
    },
    {
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 6,
      description: 'Opening paragraphs that introduce the section.',
    },
    {
      name: 'sections',
      title: 'Content Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'section',
          fields: [
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'content',
              title: 'Content',
              type: 'text',
              rows: 8,
            },
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }) {
              return { title: title || 'Untitled Section' }
            },
          },
        },
      ],
    },
    {
      name: 'principlesSection',
      title: 'Ten Principles of Disability Justice',
      type: 'object',
      fields: [
        {
          name: 'intro',
          title: 'Section Introduction',
          type: 'text',
          rows: 2,
          description: 'Optional intro text before the principles list (e.g. "Shortened for clarity/approachability")',
        },
        {
          name: 'principles',
          title: 'Principles',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'number',
                  title: 'Number',
                  type: 'number',
                  validation: (Rule) => Rule.required().min(1).max(10),
                },
                {
                  name: 'title',
                  title: 'Title',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  rows: 2,
                },
              ],
              preview: {
                select: { number: 'number', title: 'title' },
                prepare({ number, title }) {
                  return { title: `${number}. ${title || 'Untitled'}` }
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'externalLinks',
      title: 'External Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Link Label',
              type: 'string',
              description: 'Display text for the link',
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { label: 'label', url: 'url' },
            prepare({ label, url }) {
              return { title: label || url || 'Untitled Link' }
            },
          },
        },
      ],
    },
    {
      name: 'sources',
      title: 'Sources',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Source Title / Citation',
              type: 'string',
            },
            {
              name: 'url',
              title: 'URL (optional)',
              type: 'url',
            },
          ],
          preview: {
            select: { text: 'text' },
            prepare({ text }) {
              return { title: text || 'Untitled Source' }
            },
          },
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return { title: 'Disability Activism Page' }
    },
  },
}
