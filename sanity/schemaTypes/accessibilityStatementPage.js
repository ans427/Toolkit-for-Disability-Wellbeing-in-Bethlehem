export default {
  name: 'accessibilityStatementPage',
  title: 'Accessibility Statement Page',
  type: 'document',
  fields: [
    {
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Accessibility Statement',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'pageTitleI18n',
      title: 'Page Title (translations)',
      type: 'localizedString',
    },
    {
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      description: 'Short introduction under the page title.',
    },
    {
      name: 'introI18n',
      title: 'Intro (translations)',
      type: 'localizedText',
    },
    {
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'headingI18n',
              title: 'Heading (translations)',
              type: 'localizedString',
            },
            {
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 6,
              description: 'Use blank lines to separate paragraphs.',
            },
            {
              name: 'bodyI18n',
              title: 'Body (translations)',
              type: 'localizedText',
            },
            {
              name: 'listItems',
              title: 'List Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'text', title: 'Text', type: 'string' },
                    { name: 'textI18n', title: 'Text (translations)', type: 'localizedString' },
                  ],
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'heading',
              subtitle: 'body',
            },
            prepare({ title, subtitle }) {
              return {
                title: title || 'Untitled section',
                subtitle: subtitle || '',
              }
            },
          },
        },
      ],
    },
    {
      name: 'contactEmailLabel',
      title: 'Contact Email Label',
      type: 'string',
      initialValue: 'Email',
    },
    {
      name: 'contactEmailLabelI18n',
      title: 'Contact Email Label (translations)',
      type: 'localizedString',
    },
    {
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : 'Enter a valid email address.'
        }),
    },
  ],
  preview: {
    prepare() {
      return { title: 'Accessibility Statement Page' }
    },
  },
}
