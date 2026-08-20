import type { NavItem } from './common';

export type SiteSettings = {
  title: string;
  description: string;
  tagline: string;
  heroText: string;
  nav: NavItem[];
  socialLinks: NavItem[];
  seo: {
    title: string;
    description: string;
    image: string;
  };
};
