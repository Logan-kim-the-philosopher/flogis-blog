import { defineConfig } from 'sanity';
import { schemaTypes } from './sanity/schemaTypes';

export default defineConfig({
  name: 'default',
  title: process.env.SANITY_STUDIO_TITLE || "Flogi's Blog Studio",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'demo123',
  dataset: process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || 'production',
  schema: {
    types: schemaTypes
  }
});
