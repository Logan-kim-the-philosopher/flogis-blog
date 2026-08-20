import { toHTML } from '@portabletext/to-html';

export function renderRichText(body: unknown) {
  if (typeof body === 'string') {
    return body;
  }

  if (Array.isArray(body)) {
    return toHTML(body as never[]);
  }

  return '';
}
