import { getMeetings } from '../repositories/meetings';
import { getStudies } from '../repositories/studies';
import { getWorks } from '../repositories/works';
import type { ContentEntry } from '../types/content';

export async function getFeaturedStudy() {
  const entries = await getStudies();
  return entries[0];
}

export async function getAllContent(): Promise<ContentEntry[]> {
  const [studies, works, meetings] = await Promise.all([getStudies(), getWorks(), getMeetings()]);
  return [...studies, ...works, ...meetings].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export function getContentHref(item: Pick<ContentEntry, '_type' | 'slug'>) {
  return item._type === 'study' ? `/study/${item.slug}` : item._type === 'work' ? `/work/${item.slug}` : `/meetings/${item.slug}`;
}
