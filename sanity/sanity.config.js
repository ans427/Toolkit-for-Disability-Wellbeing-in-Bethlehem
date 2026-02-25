import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Toolkit for Disability Wellbeing in Bethlehem',

  projectId: 'bfuuhtl6',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Policy Gaps Page')
              .child(
                S.document()
                  .schemaType('policyGapsPage')
                  .documentId('policyGapsPage')
              ),
            S.divider(),
            S.listItem()
              .title('Policy Gaps')
              .child(S.documentTypeList('policyGap').title('Policy Gaps')),
            S.divider(),
            S.documentTypeListItem('resource').title('Resources'),
            S.documentTypeListItem('communityStory').title('Community Stories'),
            S.documentTypeListItem('comment').title('Comments'),
            S.documentTypeListItem('submission').title('Submissions'),
            S.documentTypeListItem('resourceFeedback').title('Resource Feedback'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
