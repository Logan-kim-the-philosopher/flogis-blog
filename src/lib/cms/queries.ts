import groq from 'groq';

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  title,
  description,
  tagline,
  heroText,
  "nav": nav[]{label, href},
  "socialLinks": socialLinks[]{label, href},
  seo
}`;

export const studiesQuery = groq`*[_type == "study"] | order(publishedAt desc) {
  _id,
  _type,
  title,
  "slug": slug.current,
  "coverImage": coverImage.asset->url,
  publishedAt,
  tags,
  body,
  authors[]->{name, "slug": slug.current, role, bio, "avatar": avatar.asset->url, links[]{label, href}}
}`;

export const worksQuery = groq`*[_type == "work"] | order(publishedAt desc) {
  _id,
  _type,
  title,
  "slug": slug.current,
  "coverImage": coverImage.asset->url,
  publishedAt,
  tags,
  body,
  authors[]->{name, "slug": slug.current, role, bio, "avatar": avatar.asset->url, links[]{label, href}}
}`;

export const meetingsQuery = groq`*[_type == "meeting"] | order(publishedAt desc) {
  _id,
  _type,
  title,
  "slug": slug.current,
  "coverImage": coverImage.asset->url,
  publishedAt,
  tags,
  body,
  participants[]->{name, "slug": slug.current, role, bio, "avatar": avatar.asset->url, links[]{label, href}}
}`;
