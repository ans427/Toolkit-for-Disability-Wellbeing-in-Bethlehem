export default {
  name: 'submission',
  title: 'Submission (from website)',
  type: 'document',
  fields: [
    {
      name: 'type',
      title: 'Submission type',
      type: 'string',
      options: {
        list: [
          { title: 'Resource', value: 'resource' },
          { title: 'Community story', value: 'communityStory' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'submitterName',
      title: 'Submitter name',
      type: 'string',
    },
    {
      name: 'submitterEmail',
      title: 'Submitter email',
      type: 'string',
    },
    {
      name: 'notes',
      title: 'Internal notes',
      type: 'text',
    },
    // Resource-specific fields
    {
      name: 'resourceTitle',
      title: 'Resource title',
      type: 'string',
    },
    {
      name: 'resourceUrl',
      title: 'Resource website URL',
      type: 'url',
    },
    {
      name: 'resourceDescription',
      title: 'Resource description',
      type: 'text',
    },
    {
      name: 'resourceCategory',
      title: 'Resource category',
      type: 'string',
    },
    {
      name: 'resourceContactEmail',
      title: 'Resource contact email',
      type: 'string',
    },
    {
      name: 'resourceContactPhone',
      title: 'Resource contact phone',
      type: 'string',
    },
    {
      name: 'resourceAddress',
      title: 'Resource address',
      type: 'object',
      fields: [
        {
          name: 'street',
          title: 'Street address',
          type: 'string',
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
        },
        {
          name: 'state',
          title: 'State',
          type: 'string',
        },
        {
          name: 'zipCode',
          title: 'ZIP code',
          type: 'string',
        },
      ],
    },
    // Story-specific fields
    {
      name: 'storyTitle',
      title: 'Story title',
      type: 'string',
    },
    {
      name: 'storyPersonName',
      title: 'Name or pseudonym',
      type: 'string',
    },
    {
      name: 'storyLocation',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'storySummary',
      title: 'Short summary',
      type: 'text',
    },
    {
      name: 'storyBody',
      title: 'Full story',
      type: 'text',
    },
  ],
}

