import type { ContentEntry } from '../types/content';

const DEFAULT_SUMMARY = '본문 준비 중입니다.';

export function getEntrySummary(item: Pick<ContentEntry, 'body'>, maxLength = 140) {
  const plain = item.body
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_`>[\]-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!plain) return DEFAULT_SUMMARY;
  return plain.length > maxLength ? `${plain.slice(0, maxLength).trim()}…` : plain;
}
