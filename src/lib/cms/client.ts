import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production';
const apiVersion = process.env.SANITY_API_VERSION || '2025-08-22';
const token = process.env.SANITY_API_TOKEN;

export const hasSanityConfig = Boolean(projectId && dataset);
export const isStrictContentMode = process.env.SANITY_STRICT_CONTENT === 'true';

export const sanityClient = hasSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      token: token || undefined,
      useCdn: false,
      perspective: 'published'
    })
  : null;

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}) {
  if (!sanityClient) {
    if (isStrictContentMode) {
      throw new Error('Sanity strict mode is enabled, but SANITY_PROJECT_ID / SANITY_DATASET is missing.');
    }

    return null;
  }

  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (error) {
    if (isStrictContentMode) {
      throw error;
    }

    console.warn('Sanity fetch failed in non-strict content mode.', error);
    return null;
  }
}
