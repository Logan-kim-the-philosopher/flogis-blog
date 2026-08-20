import { createClient } from '@sanity/client';

const projectId = import.meta.env.SANITY_PROJECT_ID || import.meta.env.SANITY_STUDIO_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET || import.meta.env.SANITY_STUDIO_DATASET;
const apiVersion = import.meta.env.SANITY_API_VERSION || '2025-01-01';

export const hasSanityConfig = Boolean(projectId && dataset);

export const sanityClient = hasSanityConfig
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: 'published'
    })
  : null;

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}) {
  if (!sanityClient) return null;

  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (error) {
    console.warn('Sanity fetch failed. Falling back to local demo content.', error);
    return null;
  }
}
