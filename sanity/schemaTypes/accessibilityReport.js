export default {
  name: 'accessibilityReport',
  title: 'Accessibility Report',
  type: 'document',
  fields: [
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Pending Review', value: 'pending' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
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
      name: 'subject',
      title: 'Subject',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'details',
      title: 'Details',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'locationType',
      title: 'Location Type',
      type: 'string',
      options: {
        list: [
          { title: 'Address', value: 'address' },
          { title: 'Coordinates', value: 'coordinates' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'address',
      title: 'Address',
      type: 'object',
      hidden: ({ parent }) => parent?.locationType !== 'address',
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
    {
      name: 'coordinates',
      title: 'Coordinates',
      type: 'object',
      hidden: ({ parent }) => parent?.locationType !== 'coordinates',
      fields: [
        {
          name: 'lat',
          title: 'Latitude',
          type: 'number',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'lng',
          title: 'Longitude',
          type: 'number',
          validation: (Rule) => Rule.required(),
        },
      ],
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Optional photo showing the accessibility issue',
    },
  ],
}