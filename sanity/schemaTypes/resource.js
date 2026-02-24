export default {
  name: 'resource',
  title: 'Resource',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      type: 'string',
      options: {
        list: [
          { title: 'Legal Aid', value: 'legal-aid' },
          { title: 'Community Organizations', value: 'community-organizations' },
          { title: 'Mutual Aid Support', value: 'mutual-aid-support' },
          { title: 'Interdependency Support', value: 'interdependency-support' },
          { title: 'Mental Health Support', value: 'mental-health-support' }
        ]
      }
    },
    {
      name: 'isFree',
      type: 'boolean',
      title: 'Free Resource'
    },
    {
      name: 'isChildSpecific',
      type: 'boolean',
      title: 'For Children'
    },
    {
      name: 'description',
      type: 'text'
    },
    {
      name: 'url',
      type: 'url'
    },
    {
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string'
    },
    {
      name: 'contactPhone',
      title: 'Contact phone',
      type: 'string'
    },
    {
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        {
          name: 'street',
          title: 'Street address',
          type: 'string'
        },
        {
          name: 'city',
          title: 'City',
          type: 'string'
        },
        {
          name: 'state',
          title: 'State',
          type: 'string'
        },
        {
          name: 'zipCode',
          title: 'ZIP code',
          type: 'string'
        }
      ]
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image (legacy – used for cards)',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text'
        }
      ]
    },
    {
      name: 'coverImage',
      type: 'image',
      title: 'Cover Photo',
      description: 'Large hero image for the resource detail page. Falls back to the main image if empty.',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text'
        }
      ]
    },
    {
      name: 'helpfulCount',
      type: 'number',
      title: 'Helpful count',
      description: 'Number of people who found this resource helpful (updated automatically)',
      initialValue: 0,
      readOnly: true
    },
    {
      name: 'notHelpfulCount',
      type: 'number',
      title: 'Not helpful count',
      description: 'Number of people who did not find this resource helpful (updated automatically)',
      initialValue: 0,
      readOnly: true
    },
    {
      name: 'gallery',
      type: 'array',
      title: 'Additional Photos',
      description: 'Extra photos to display on the resource page (e.g. facility, staff, services).',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text'
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption'
            }
          ]
        }
      ]
    }
  ]
}
