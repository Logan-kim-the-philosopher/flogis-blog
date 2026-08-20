import { getAllContent } from './content-service';
import type { ContentEntry } from '../types/content';
import type { Person } from '../types/common';

export async function getAllTags() {
  const content = await getAllContent();
  const counts = new Map<string, number>();

  for (const entry of content) {
    for (const tag of entry.tags || []) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: toArchiveSlug(name), count }))
    .sort((a, b) => (b.count - a.count) || a.name.localeCompare(b.name, 'ko'));
}

export async function getContentByTagSlug(slug: string) {
  const content = await getAllContent();
  return content.filter((entry) => (entry.tags || []).some((tag) => toArchiveSlug(tag) === slug));
}

export async function getAllPeople() {
  const content = await getAllContent();
  const people = new Map<string, Person & { count: number }>();

  for (const entry of content) {
    for (const person of getEntryPeople(entry)) {
      const existing = people.get(person.slug);
      if (existing) {
        existing.count += 1;
      } else {
        people.set(person.slug, { ...person, count: 1 });
      }
    }
  }

  return [...people.values()].sort((a, b) => (b.count - a.count) || a.name.localeCompare(b.name, 'ko'));
}

export async function getContentByPersonSlug(slug: string) {
  const content = await getAllContent();
  return content.filter((entry) => getEntryPeople(entry).some((person) => person.slug === slug));
}

export async function getPersonBySlug(slug: string) {
  const people = await getAllPeople();
  return people.find((person) => person.slug === slug);
}

export function getEntryPeople(entry: ContentEntry) {
  return entry._type === 'meeting' ? entry.participants : entry.authors;
}

export function toArchiveSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
