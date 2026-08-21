import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemaTypes';

const singletonTypes = new Set(['siteSettings']);

export default defineConfig({
  name: 'default',
  title: process.env.SANITY_STUDIO_TITLE || "Flogi's Blog Studio",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'w1jypogd',
  dataset: process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            ...S.documentTypeListItems().filter((listItem) => !singletonTypes.has(listItem.getId() || ''))
          ])
    })
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType))
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter((item) => !singletonTypes.has(item.templateId));
      }

      return prev;
    },
    actions: (prev, context) => {
      if (singletonTypes.has(context.schemaType)) {
        return prev.filter(({ action }) => action && !['duplicate', 'delete'].includes(action));
      }

      return prev;
    }
  }
});
