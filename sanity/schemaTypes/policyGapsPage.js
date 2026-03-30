export default {
  name: 'policyGapsPage',
  title: 'Policy Gaps Page',
  type: 'document',
  fields: [
    {
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Policy & Service Gaps',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'pageTitleI18n',
      title: 'Page Title (translations)',
      type: 'localizedString',
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      initialValue:
        'Bridging the gap between policy and lived experience. A living document of accessibility challenges in Bethlehem and recommendations for change.',
    },
    {
      name: 'subtitleI18n',
      title: 'Subtitle (translations)',
      type: 'localizedText',
      rows: 2,
    },
    {
      name: 'actionSection',
      title: "Moving Forward: From Observation to Action",
      type: 'object',
      fields: [
        {
          name: 'overlappingThemes',
          title: 'Overlapping Themes',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'label',
                  title: 'Theme label',
                  type: 'string',
                  description: 'e.g. "Intersectionality"',
                },
                {
                  name: 'labelI18n',
                  title: 'Theme label (translations)',
                  type: 'localizedString',
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                },
                {
                  name: 'descriptionI18n',
                  title: 'Description (translations)',
                  type: 'localizedText',
                },
              ],
            },
          ],
        },
        {
          name: 'contentBlocks',
          title: 'Action Content Blocks',
          description:
            'Flexible sections for this area. Add as many header + body blocks as needed.',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'heading',
                  title: 'Header',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'headingI18n',
                  title: 'Header (translations)',
                  type: 'localizedString',
                },
                {
                  name: 'body',
                  title: 'Body',
                  type: 'text',
                  rows: 4,
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'bodyI18n',
                  title: 'Body (translations)',
                  type: 'localizedText',
                  rows: 4,
                },
              ],
              preview: {
                select: {
                  title: 'heading',
                  subtitle: 'body',
                },
                prepare({ title, subtitle }) {
                  return {
                    title: title || 'Untitled action block',
                    subtitle: subtitle || '',
                  }
                },
              },
            },
          ],
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return { title: 'Policy & Service Gaps Page' }
    },
  },
}
