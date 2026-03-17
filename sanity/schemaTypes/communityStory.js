export default {
  name: 'communityStory',
  title: 'Community Story',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Story title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'titleI18n',
      title: 'Story title (translations)',
      type: 'localizedString',
    },
    {
      name: 'personName',
      title: 'Name or pseudonym',
      type: 'string',
      description: 'You can use a first name, initials, or a pseudonym if preferred.'
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'For example: South Bethlehem, West Bethlehem, etc.'
    },
    {
      name: 'summary',
      title: 'Short summary',
      type: 'text',
      rows: 3,
      description: '1–2 sentence overview of the story (optional).'
    },
    {
      name: 'summaryI18n',
      title: 'Short summary (translations)',
      type: 'localizedText',
      rows: 3,
    },
    {
      name: 'story',
      title: 'Full story',
      type: 'text',
      rows: 8,
      validation: Rule => Rule.required()
    },
    {
      name: 'storyI18n',
      title: 'Full story (translations)',
      type: 'localizedText',
      rows: 8,
    },
    {
      name: 'date',
      title: 'Date of story (optional)',
      type: 'date'
    }
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }]
    },
    {
      title: 'Oldest first',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }]
    }
  ]
}

