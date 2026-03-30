export default {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    {
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'About Us',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'pageTitleI18n',
      title: 'Page Title (translations)',
      type: 'localizedString',
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
              name: 'listType',
              title: 'List Type',
              type: 'string',
              options: {
                list: [
                  { title: 'None', value: 'none' },
                  { title: 'Bulleted', value: 'bullet' },
                  { title: 'Numbered', value: 'number' },
                ],
                layout: 'radio',
              },
              initialValue: 'none',
            },
            {
              name: 'listItems',
              title: 'List Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'text',
                      title: 'Text',
                      type: 'string',
                    },
                    {
                      name: 'textI18n',
                      title: 'Text (translations)',
                      type: 'localizedString',
                    },
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
  ],
  preview: {
    prepare() {
      return { title: 'About Page' }
    },
  },
}
