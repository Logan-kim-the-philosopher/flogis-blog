import { isStrictContentMode, sanityFetch } from '../cms/client';
import { siteSettingsQuery } from '../cms/queries';
import { sampleSiteSettings } from '../fallback/sample-site';
import type { SiteSettings } from '../types/site';
import { normalizeNavItems } from '../utils/content';

export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await sanityFetch<Partial<SiteSettings>>(siteSettingsQuery);

  if (!data) {
    if (isStrictContentMode) {
      throw new Error('siteSettings document is required in SANITY_STRICT_CONTENT mode.');
    }

    return sampleSiteSettings;
  }

  return {
    title: data.title?.trim() || sampleSiteSettings.title,
    description: data.description?.trim() || sampleSiteSettings.description,
    tagline: data.tagline?.trim() || sampleSiteSettings.tagline,
    heroText: data.heroText?.trim() || sampleSiteSettings.heroText,
    nav: normalizeNavItems(data.nav || [], sampleSiteSettings.nav),
    socialLinks: normalizeNavItems(data.socialLinks || [], sampleSiteSettings.socialLinks),
    seo: {
      title: data.seo?.title?.trim() || data.title?.trim() || sampleSiteSettings.seo.title,
      description: data.seo?.description?.trim() || data.description?.trim() || sampleSiteSettings.seo.description,
      image: data.seo?.image?.trim() || sampleSiteSettings.seo.image
    }
  };
}
