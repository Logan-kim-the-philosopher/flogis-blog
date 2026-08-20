import type { ContentEntry } from '../types/content';

export function getEntrySummary(item: ContentEntry, maxLength = 140) {
  const plain = item.body
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_`>[\]-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plain) return '';
  return plain.length > maxLength ? `${plain.slice(0, maxLength).trim()}…` : plain;
}
