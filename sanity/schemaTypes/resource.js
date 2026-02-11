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
          { title: 'Healthcare', value: 'healthcare' },
          { title: 'Community Organization', value: 'community' },
          { title: 'Legal Support', value: 'legal' },
          { title: 'Mental Health', value: 'mental-health' },
          { title: 'Mutual Aid', value: 'mutual-aid' },
          { title: 'Housing', value: 'housing' },
          { title: 'Transportation', value: 'transportation' }
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
