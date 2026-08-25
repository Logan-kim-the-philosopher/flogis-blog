import type { APIRoute } from 'astro';
import { getRuntimeSiteUrl } from '../lib/config/runtime';
import { getAllContent, getContentHref } from '../lib/services/content-service';
import { getPeopleFromContent, getTagsFromContent } from '../lib/services/archive-service';

const staticPaths = ['/', '/study', '/meetings', '/work', '/people', '/tags', '/search', '/rss.xml'];

function escapeXml(value: string) {
  const entities: Record<string, string> = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;'
  };

  return value.replace(/[<>&'"]/g, (character) => entities[character] || character);
}

export const GET: APIRoute = async ({ url }) => {
  const content = await getAllContent();
  const siteUrl = getRuntimeSiteUrl(url);
  const dynamicEntries = [
    ...content.map((item) => ({ path: getContentHref(item), lastModified: item.publishedAt })),
    ...getPeopleFromContent(content).map((person) => ({ path: `/people/${encodeURIComponent(person.slug)}` })),
    ...getTagsFromContent(content).map((tag) => ({ path: `/tags/${encodeURIComponent(tag.slug)}` }))
  ];
  const entries: { path: string; lastModified?: string }[] = [
    ...staticPaths.map((path) => ({ path })),
    ...dynamicEntries
  ];
  const body = entries.map(({ path, lastModified }) => {
    const location = escapeXml(new URL(path, siteUrl).toString());
    const lastmod = lastModified ? `\n    <lastmod>${escapeXml(lastModified)}</lastmod>` : '';
    return `  <url>\n    <loc>${location}</loc>${lastmod}\n  </url>`;
  }).join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`, {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
