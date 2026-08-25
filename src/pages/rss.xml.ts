import rss from '@astrojs/rss';
import { getRuntimeSiteUrl } from '../lib/config/runtime';
import { getSiteSettings } from '../lib/repositories/site';
import { getAllContent, getContentHref } from '../lib/services/content-service';
import { getEntrySummary } from '../lib/services/summary-service';

export async function GET(context) {
  const [site, items] = await Promise.all([getSiteSettings(), getAllContent()]);
  const response = await rss({
    title: site.title,
    description: site.description,
    site: getRuntimeSiteUrl(context.url),
    items: items.map((item) => ({
      title: item.title,
      description: getEntrySummary(item, 160),
      pubDate: new Date(item.publishedAt),
      link: getContentHref(item)
    }))
  });

  response.headers.set('Cache-Control', 'no-store');
  return response;
}
