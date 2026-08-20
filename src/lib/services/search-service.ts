import { getAllContent, getContentHref } from './content-service';
import { getEntrySummary } from './summary-service';

export async function getSearchPayload() {
  const items = await getAllContent();
  return items.map((item) => ({
    type: item._type === 'study' ? '스터디' : item._type === 'work' ? '작업' : '회의',
    title: item.title,
    href: getContentHref(item),
    excerpt: getEntrySummary(item),
    publishedAt: item.publishedAt
  }));
}
