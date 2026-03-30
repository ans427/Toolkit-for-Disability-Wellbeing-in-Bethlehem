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
          name: 'forPolicymakersI18n',
          title: 'For Policymakers (translations)',
          type: 'localizedText',
          rows: 4,
        },
        {
          name: 'forActivists',
          title: 'For Activists and Community Members',
          type: 'text',
          rows: 4,
        },
        {
          name: 'forActivistsI18n',
          title: 'For Activists and Community Members (translations)',
          type: 'localizedText',
          rows: 4,
        },
      ],
    },
    {
      name: 'sectionHeadings',
      title: 'Section Headings',
      description:
        'Optional custom headings for this page. English comes from the main field; add Spanish in translations.',
      type: 'object',
      fields: [
        {
          name: 'tocHeading',
          title: 'Table of contents heading',
          type: 'string',
          initialValue: 'Jump to a Section',
        },
        {
          name: 'tocHeadingI18n',
          title: 'Table of contents heading (translations)',
          type: 'localizedString',
        },
        {
          name: 'experienceHeading',
          title: 'The Resident Experience heading',
          type: 'string',
          initialValue: 'The Resident Experience',
        },
        {
          name: 'experienceHeadingI18n',
          title: 'The Resident Experience heading (translations)',
          type: 'localizedString',
        },
        {
          name: 'conditionsHeading',
          title: 'Current Conditions heading',
          type: 'string',
          initialValue: 'Current Conditions',
        },
        {
          name: 'conditionsHeadingI18n',
          title: 'Current Conditions heading (translations)',
          type: 'localizedString',
        },
        {
          name: 'gapsHeading',
          title: 'Analyzing the Gap heading',
          type: 'string',
          initialValue: 'Analyzing the Gap',
        },
        {
          name: 'gapsHeadingI18n',
          title: 'Analyzing the Gap heading (translations)',
          type: 'localizedString',
        },
        {
          name: 'implicationsHeading',
          title: 'Policy Implications heading',
          type: 'string',
          initialValue: 'Policy Implications',
        },
        {
          name: 'implicationsHeadingI18n',
          title: 'Policy Implications heading (translations)',
          type: 'localizedString',
        },
        {
          name: 'actionHeading',
          title: 'Action section heading',
          type: 'string',
          initialValue: 'Moving Forward: From Observation to Action',
        },
        {
          name: 'actionHeadingI18n',
          title: 'Action section heading (translations)',
          type: 'localizedString',
        },
        {
          name: 'overlappingThemesHeading',
          title: 'Overlapping Themes heading',
          type: 'string',
          initialValue: 'Overlapping Themes',
        },
        {
          name: 'overlappingThemesHeadingI18n',
          title: 'Overlapping Themes heading (translations)',
          type: 'localizedString',
        },
        {
          name: 'forPolicymakersHeading',
          title: 'For Policymakers heading',
          type: 'string',
          initialValue: 'For Policymakers',
        },
        {
          name: 'forPolicymakersHeadingI18n',
          title: 'For Policymakers heading (translations)',
          type: 'localizedString',
        },
        {
          name: 'forActivistsHeading',
          title: 'For Activists and Community Members heading',
          type: 'string',
          initialValue: 'For Activists and Community Members',
        },
        {
          name: 'forActivistsHeadingI18n',
          title: 'For Activists and Community Members heading (translations)',
          type: 'localizedString',
        },
        {
          name: 'returnTopLabel',
          title: 'Return to top label',
          type: 'string',
          initialValue: '↑ Return to Top',
        },
        {
          name: 'returnTopLabelI18n',
          title: 'Return to top label (translations)',
          type: 'localizedString',
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
