import { sanityFetch } from '../cms/client';
import { meetingsQuery } from '../cms/queries';
import { sampleMeetings } from '../fallback/sample-content';
import { renderMarkdown } from '../renderers/markdown';
import type { Meeting } from '../types/content';

export async function getMeetings(): Promise<Meeting[]> {
  const data = await sanityFetch<Meeting[]>(meetingsQuery);
  return normalizeMeetings(data || sampleMeetings);
}

export async function getMeetingBySlug(slug: string) {
  return (await getMeetings()).find((entry) => entry.slug === slug);
}

function normalizeMeetings(items: Meeting[]) {
  return items.map((item) => ({
    ...item,
    body: renderMarkdown(item.body)
  }));
}
