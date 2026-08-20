import { getAllContent, getContentHref } from './content-service';
import { getEntrySummary } from './summary-service';

export async function getSearchPayload() {
  const items = await getAllContent();
  return items.map((item) => {
    const type = item._type === 'study' ? '스터디' : item._type === 'work' ? '작업' : '회의';
    const people = item._type === 'meeting' ? item.participants : item.authors;
    const excerpt = getEntrySummary(item);

    return {
      type,
      title: item.title,
      href: getContentHref(item),
      excerpt,
      publishedAt: item.publishedAt,
      searchText: [item.title, excerpt, type, ...(item.tags || []), ...people.map((person) => person.name)].join(' ')
    };
  });
}
