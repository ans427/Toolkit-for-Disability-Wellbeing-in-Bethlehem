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
