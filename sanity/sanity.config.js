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
              .title('Pages')
              .child(
                S.list()
                  .title('Pages')
                  .items([
                    S.listItem()
                      .title('Policy Gaps Page')
                      .child(
                        S.document()
                          .schemaType('policyGapsPage')
                          .documentId('policyGapsPage')
                      ),
                    S.listItem()
                      .title('Disability Activism Page')
                      .child(
                        S.document()
                          .schemaType('disabilityActivismPage')
                          .documentId('disabilityActivismPage')
                      ),
                    S.listItem()
                      .title('About Page')
                      .child(
                        S.document()
                          .schemaType('aboutPage')
                          .documentId('aboutPage')
                      ),
                  ])
              ),
            S.listItem()
              .title('Policy & Advocacy')
              .child(
                S.list()
                  .title('Policy & Advocacy')
                  .items([
                    S.listItem()
                      .title('Policy Gaps')
                      .child(S.documentTypeList('policyGap').title('Policy Gaps')),
                    S.listItem()
                      .title('Accessibility Reports')
                      .child(S.documentTypeList('accessibilityReport').title('Accessibility Reports')),
                    S.listItem()
                      .title('Site Issue Reports')
                      .child(S.documentTypeList('siteIssueReport').title('Site Issue Reports')),
                  ])
              ),
            S.listItem()
              .title('Community Content')
              .child(
                S.list()
                  .title('Community Content')
                  .items([
                    S.documentTypeListItem('resource').title('Resources'),
                    S.documentTypeListItem('communityStory').title('Community Stories'),
                    S.documentTypeListItem('comment').title('Comments'),
                    S.documentTypeListItem('submission').title('Submissions'),
                    S.documentTypeListItem('resourceFeedback').title('Resource Feedback'),
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
