import { sanityFetch } from '../cms/client';
import { worksQuery } from '../cms/queries';
import { sampleWorks } from '../fallback/sample-content';
import { renderMarkdown } from '../renderers/markdown';
import type { Work } from '../types/content';

export async function getWorks(): Promise<Work[]> {
  const data = await sanityFetch<Work[]>(worksQuery);
  return normalizeWorks(data || sampleWorks);
}

export async function getWorkBySlug(slug: string) {
  return (await getWorks()).find((entry) => entry.slug === slug);
}

function normalizeWorks(items: Work[]) {
  return items.map((item) => ({
    ...item,
    body: renderMarkdown(item.body)
  }));
}
