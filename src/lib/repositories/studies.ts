import { sanityFetch } from '../cms/client';
import { studiesQuery } from '../cms/queries';
import { sampleStudies } from '../fallback/sample-content';
import { renderMarkdown } from '../renderers/markdown';
import type { Study } from '../types/content';
import {
  DEFAULT_COVER_IMAGE,
  normalizeDate,
  normalizeMarkdownBody,
  normalizePeople,
  normalizeTags,
  sortByPublishedAtDesc
} from '../utils/content';

export async function getStudies(): Promise<Study[]> {
  const data = await sanityFetch<Study[]>(studiesQuery);
  return normalizeStudies(data || sampleStudies);
}

export async function getStudyBySlug(slug: string) {
  return (await getStudies()).find((entry) => entry.slug === slug);
}

function normalizeStudies(items: Study[]) {
  return items
    .flatMap((item) => {
      const slug = item?.slug?.trim();
      const title = item?.title?.trim();

      if (!slug || !title) {
        console.warn('Skipping invalid study entry because title or slug is missing.', item?._id || item);
        return [];
      }

      return [
        {
          ...item,
          title,
          slug,
          coverImage: item?.coverImage?.trim() || DEFAULT_COVER_IMAGE,
          publishedAt: normalizeDate(item?.publishedAt),
          authors: normalizePeople(item?.authors),
          tags: normalizeTags(item?.tags),
          body: renderMarkdown(normalizeMarkdownBody(item?.body))
        }
      ];
    })
    .sort(sortByPublishedAtDesc);
}
