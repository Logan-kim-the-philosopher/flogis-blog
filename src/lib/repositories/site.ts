import { sampleSiteSettings } from '../fallback/sample-site';
import { sanityFetch } from '../cms/client';
import { siteSettingsQuery } from '../cms/queries';
import type { SiteSettings } from '../types/site';

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await sanityFetch<SiteSettings>(siteSettingsQuery);
  return data || sampleSiteSettings;
}
