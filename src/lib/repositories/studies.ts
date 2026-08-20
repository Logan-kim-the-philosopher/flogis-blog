import { sanityFetch } from '../cms/client';
import { studiesQuery } from '../cms/queries';
import { sampleStudies } from '../fallback/sample-content';
import { renderMarkdown } from '../renderers/markdown';
import type { Study } from '../types/content';

export async function getStudies(): Promise<Study[]> {
  const data = await sanityFetch<Study[]>(studiesQuery);
  return normalizeStudies(data || sampleStudies);
}

export async function getStudyBySlug(slug: string) {
  return (await getStudies()).find((entry) => entry.slug === slug);
}

function normalizeStudies(items: Study[]) {
  return items.map((item) => ({
    ...item,
    body: renderMarkdown(item.body)
  }));
}
