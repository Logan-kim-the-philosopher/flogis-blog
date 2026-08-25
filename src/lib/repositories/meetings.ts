import { hasSanityConfig, sanityFetch } from '../cms/client';
import { meetingBySlugQuery, meetingsQuery } from '../cms/queries';
import { sampleMeetings } from '../fallback/sample-content';
import { renderMarkdown } from '../renderers/markdown';
import type { Meeting } from '../types/content';
import {
  DEFAULT_COVER_IMAGE,
  normalizeDate,
  normalizeMarkdownBody,
  normalizePeople,
  normalizeTags,
  sortByPublishedAtDesc
} from '../utils/content';

export async function getMeetings(): Promise<Meeting[]> {
  const data = await sanityFetch<Meeting[]>(meetingsQuery);
  return normalizeMeetings(data || sampleMeetings);
}

export async function getMeetingBySlug(slug: string) {
  if (!hasSanityConfig) {
    return normalizeMeetings(sampleMeetings).find((entry) => entry.slug === slug);
  }

  const data = await sanityFetch<Meeting | null>(meetingBySlugQuery, { slug });
  return data ? normalizeMeetings([data])[0] : undefined;
}

function normalizeMeetings(items: Meeting[]) {
  return items
    .flatMap((item) => {
      const slug = item?.slug?.trim();
      const title = item?.title?.trim();

      if (!slug || !title) {
        console.warn('Skipping invalid meeting entry because title or slug is missing.', item?._id || item);
        return [];
      }

      return [
        {
          ...item,
          title,
          slug,
          coverImage: item?.coverImage?.trim() || DEFAULT_COVER_IMAGE,
          publishedAt: normalizeDate(item?.publishedAt),
          participants: normalizePeople(item?.participants),
          tags: normalizeTags(item?.tags),
          body: renderMarkdown(normalizeMarkdownBody(item?.body))
        }
      ];
    })
    .sort(sortByPublishedAtDesc);
}
