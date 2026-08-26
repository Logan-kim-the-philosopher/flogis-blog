import { marked, type Tokens } from 'marked';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

marked.use({
  gfm: true,
  breaks: true,
  renderer: {
    code({ text, lang, escaped }: Tokens.Code) {
      if (lang === 'mermaid') {
        return `<div class="mermaid">${escapeHtml(text)}</div>`;
      }

      const className = lang ? ` class="language-${escapeHtml(lang)}"` : '';
      const content = escaped ? text : escapeHtml(text);
      return `<pre><code${className}>${content}</code></pre>`;
    }
  }
});

export function renderMarkdown(body: string) {
  return marked.parse(body) as string;
}
