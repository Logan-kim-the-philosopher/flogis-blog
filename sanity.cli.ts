import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID || 'w1jypogd',
    dataset: process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || 'production'
  },
  deployment: {
    appId: 'fgyhr9hh2jn97wetyzq4g72v'
  }
});
