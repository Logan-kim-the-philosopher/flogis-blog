import type { NavItem, Person } from '../types/common';

export const DEFAULT_BODY_MARKDOWN = '본문 준비 중입니다.';
export const DEFAULT_PUBLISHED_AT = '1970-01-01';

export function normalizeDate(value?: string) {
  const input = value?.trim();
  if (!input) return DEFAULT_PUBLISHED_AT;
  return Number.isNaN(new Date(input).valueOf()) ? DEFAULT_PUBLISHED_AT : input;
}

export function normalizeTags(tags?: string[]) {
  if (!Array.isArray(tags)) return [];

  return [...new Set(tags.map((tag) => tag?.trim()).filter(Boolean))];
}

export function normalizeMarkdownBody(body?: string) {
  return body?.trim() || DEFAULT_BODY_MARKDOWN;
}

export function normalizePeople(people?: Person[]) {
  if (!Array.isArray(people)) return [];

  return people
    .map((person) => ({
      name: person?.name?.trim() || '',
      slug: person?.slug?.trim() || '',
      role: person?.role?.trim() || '',
      bio: person?.bio?.trim() || undefined,
      avatar: person?.avatar?.trim() || undefined,
      links: Array.isArray(person?.links)
        ? person.links
            .map((link) => ({
              label: link?.label?.trim() || '',
              href: link?.href?.trim() || ''
            }))
            .filter((link) => link.label && link.href)
        : []
    }))
    .filter((person) => person.name && person.slug);
}

export function normalizeNavItems(items: NavItem[], fallback: NavItem[]) {
  if (!Array.isArray(items) || items.length === 0) return fallback;

  const normalized = items
    .map((item) => ({
      label: item?.label?.trim() || '',
      href: item?.href?.trim() || ''
    }))
    .filter((item) => item.label && item.href);

  return normalized.length ? normalized : fallback;
}

export function sortByPublishedAtDesc<T extends { publishedAt: string }>(a: T, b: T) {
  return +new Date(b.publishedAt) - +new Date(a.publishedAt);
}
