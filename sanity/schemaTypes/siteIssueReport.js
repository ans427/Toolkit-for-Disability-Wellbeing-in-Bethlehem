export default {
  name: 'siteIssueReport',
  title: 'Site Issue Report',
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
          { title: 'In Progress', value: 'inProgress' },
          { title: 'Resolved', value: 'resolved' },
          { title: 'Rejected', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subject',
      title: 'Issue title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'details',
      title: 'Issue details',
      type: 'text',
      validation: (Rule) => Rule.required().min(20),
    },
    {
      name: 'pageUrl',
      title: 'Page URL',
      type: 'url',
      description: 'Optional URL where the issue occurred.',
    },
    {
      name: 'locationDescription',
      title: 'Location description',
      type: 'string',
      description: 'Optional text describing where the issue happened.',
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
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional screenshot/photo for this issue report.',
    },
    {
      name: 'internalNotes',
      title: 'Internal notes',
      type: 'text',
    },
  ],
}
