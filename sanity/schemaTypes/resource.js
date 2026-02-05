export default {
  name: 'resource',
  title: 'Resource',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'url', title: 'URL', type: 'url' },
    { name: 'description', title: 'Description', type: 'text' },
  ],
}