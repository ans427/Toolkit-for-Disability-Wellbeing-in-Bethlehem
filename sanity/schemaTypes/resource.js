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
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text'
        }
      ]
    }
  ]
}
