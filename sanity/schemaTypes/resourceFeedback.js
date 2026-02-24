export default {
  name: 'resourceFeedback',
  title: 'Resource Feedback',
  type: 'document',
  preview: {
    select: {
      resourceTitle: 'resource.title',
      helpful: 'helpful',
    },
    prepare({ resourceTitle, helpful }) {
      const status = helpful ? 'Helpful' : 'Not helpful'
      return {
        title: resourceTitle ? `${resourceTitle} – ${status}` : `Resource feedback (${status})`,
      }
    },
  },
  fields: [
    {
      name: 'resource',
      title: 'Resource',
      type: 'reference',
      to: [{ type: 'resource' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
      description: 'Anonymous session for one vote per person per resource',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'helpful',
      title: 'Helpful',
      type: 'boolean',
      description: 'true = found it helpful, false = did not',
    },
    {
      name: 'suggestion',
      title: 'Improvement suggestion',
      type: 'text',
      description: 'Required when helpful is false - 1-2 sentences on how the resource could improve',
      rows: 3,
      hidden: ({ parent }) => parent?.helpful !== false,
    },
  ],
}
