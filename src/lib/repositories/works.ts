import { hasSanityConfig, sanityFetch } from '../cms/client';
import { workBySlugQuery, worksQuery } from '../cms/queries';
import { sampleWorks } from '../fallback/sample-content';
import { renderMarkdown } from '../renderers/markdown';
import type { Work } from '../types/content';
import {
  DEFAULT_COVER_IMAGE,
  normalizeDate,
  normalizeMarkdownBody,
  normalizePeople,
  normalizeTags,
  sortByPublishedAtDesc
} from '../utils/content';

export async function getWorks(): Promise<Work[]> {
  const data = await sanityFetch<Work[]>(worksQuery);
  return normalizeWorks(data || sampleWorks);
}

export async function getWorkBySlug(slug: string) {
  if (!hasSanityConfig) {
    return normalizeWorks(sampleWorks).find((entry) => entry.slug === slug);
  }

  const data = await sanityFetch<Work | null>(workBySlugQuery, { slug });
  return data ? normalizeWorks([data])[0] : undefined;
}

function normalizeWorks(items: Work[]) {
  return items
    .flatMap((item) => {
      const slug = item?.slug?.trim();
      const title = item?.title?.trim();

      if (!slug || !title) {
        console.warn('Skipping invalid work entry because title or slug is missing.', item?._id || item);
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
