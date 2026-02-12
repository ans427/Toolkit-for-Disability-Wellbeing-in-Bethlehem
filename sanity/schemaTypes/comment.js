export default {
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    {
      name: 'storyId',
      title: 'Story ID',
      type: 'reference',
      to: [{ type: 'communityStory' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
      description: 'Anonymous user tracking via session ID',
      validation: Rule => Rule.required()
    },
    {
      name: 'text',
      title: 'Comment text',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required().min(1).max(1000)
    },
    {
      name: 'inlineMarker',
      title: 'Inline Comment Marker',
      type: 'object',
      description: 'For inline comments - marks which paragraph and position in text',
      fields: [
        {
          name: 'paragraphIndex',
          type: 'number',
          description: 'Which paragraph (0-indexed) the comment refers to'
        },
        {
          name: 'startChar',
          type: 'number',
          description: 'Starting character position in the paragraph'
        },
        {
          name: 'endChar',
          type: 'number',
          description: 'Ending character position in the paragraph'
        },
        {
          name: 'selectedText',
          type: 'string',
          description: 'The text that was highlighted'
        }
      ]
    },
    {
      name: 'flagCount',
      title: 'Flag count',
      type: 'number',
      initialValue: 0,
      description: 'Number of times this comment has been flagged'
    },
    {
      name: 'isFlagged',
      title: 'Is flagged',
      type: 'boolean',
      initialValue: false,
      description: 'Whether comment is hidden due to flagging'
    },
    {
      name: 'flagReason',
      title: 'Flag reason',
      type: 'string',
      options: {
        list: [
          { title: 'Spam', value: 'spam' },
          { title: 'Inappropriate', value: 'inappropriate' },
          { title: 'Harassment', value: 'harassment' },
          { title: 'Other', value: 'other' }
        ]
      }
    },
    {
      name: 'parentComment',
      title: 'Parent Comment (for replies)',
      type: 'reference',
      to: [{ type: 'comment' }],
      description: 'Reference to parent comment if this is a reply'
    }
  ]
}
