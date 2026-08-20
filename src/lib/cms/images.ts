import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlFor(source: unknown) {
  return builder?.image(source).auto('format').fit('max').url();
}
