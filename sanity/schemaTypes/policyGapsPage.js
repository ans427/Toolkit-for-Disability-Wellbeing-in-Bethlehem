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
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
      initialValue:
        'Bridging the gap between policy and lived experience. A living document of accessibility challenges in Bethlehem and recommendations for change.',
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
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          name: 'forPolicymakers',
          title: 'For Policymakers',
          type: 'text',
          rows: 4,
        },
        {
          name: 'forActivists',
          title: 'For Activists and Community Members',
          type: 'text',
          rows: 4,
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
