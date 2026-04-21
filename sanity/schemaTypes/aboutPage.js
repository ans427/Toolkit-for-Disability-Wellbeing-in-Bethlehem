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
    {
      name: 'getInvolved',
      title: 'Get Involved Section',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string', initialValue: 'Get Involved' },
        { name: 'headingI18n', title: 'Heading (translations)', type: 'localizedString' },
        { name: 'body', title: 'Body', type: 'text', rows: 3 },
        { name: 'bodyI18n', title: 'Body (translations)', type: 'localizedText' },
        { name: 'buttonLabel', title: 'Button Label', type: 'string', initialValue: 'Submit a Resource or Story' },
        { name: 'buttonLabelI18n', title: 'Button Label (translations)', type: 'localizedString' },
        { name: 'buttonHref', title: 'Button Link', type: 'string', initialValue: '/submit' },
      ],
    },
    {
      name: 'contact',
      title: 'Contact Section',
      type: 'object',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string', initialValue: 'Contact Us' },
        { name: 'headingI18n', title: 'Heading (translations)', type: 'localizedString' },
        { name: 'emailLabel', title: 'Email Label', type: 'string', initialValue: 'Email' },
        { name: 'emailLabelI18n', title: 'Email Label (translations)', type: 'localizedString' },
        { name: 'email', title: 'Email Address', type: 'string', initialValue: 'inclusivebethlehem@gmail.com' },
        { name: 'phoneLabel', title: 'Phone Label', type: 'string', initialValue: 'Phone' },
        { name: 'phoneLabelI18n', title: 'Phone Label (translations)', type: 'localizedString' },
        { name: 'phone', title: 'Phone Number', type: 'string' },
        { name: 'body', title: 'Body', type: 'text', rows: 3 },
        { name: 'bodyI18n', title: 'Body (translations)', type: 'localizedText' },
      ],
    },
    {
      name: 'funding',
      title: 'Funding Statement',
      type: 'text',
      description: 'A short funding/acknowledgement statement shown on the About page.',
    },
    {
      name: 'fundingI18n',
      title: 'Funding Statement (translations)',
      type: 'localizedText',
    },
  ],
  preview: {
    prepare() {
      return { title: 'About Page' }
    },
  },
}
