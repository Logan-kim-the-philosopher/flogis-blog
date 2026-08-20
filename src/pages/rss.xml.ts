import rss from '@astrojs/rss';
import { getSiteSettings } from '../lib/repositories/site';
import { getAllContent, getContentHref } from '../lib/services/content-service';
import { getEntrySummary } from '../lib/services/summary-service';

export async function GET(context) {
  const [site, items] = await Promise.all([getSiteSettings(), getAllContent()]);

  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items: items.map((item) => ({
      title: item.title,
      description: getEntrySummary(item, 160),
      pubDate: new Date(item.publishedAt),
      link: getContentHref(item)
    }))
  });
}
