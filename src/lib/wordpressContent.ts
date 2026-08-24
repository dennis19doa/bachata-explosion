import pageExport from "../data/wp-pages-public-export.json";

export type WordPressPage = {
  id: number;
  modified: string;
  slug: string;
  status: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  featured_media: number;
  parent: number;
  menu_order: number;
};

export const wordpressPages = pageExport as WordPressPage[];

export function getWordPressPage(slug: string) {
  const page = wordpressPages.find((candidate) => candidate.slug === slug);
  if (!page) throw new Error(`Missing WordPress source page: ${slug}`);
  return page;
}

export function decodeWordPressText(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#8211;|&#8212;/g, "–")
    .replace(/&#8217;|&#039;/g, "’")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getWordPressDescription(page: WordPressPage) {
  const excerpt = decodeWordPressText(page.excerpt.rendered);
  if (excerpt) return excerpt.slice(0, 190);
  return `${decodeWordPressText(page.title.rendered)} on Bachata Explosion.`;
}

export function prepareWordPressHtml(html: string) {
  const prepared = html
    .replace(/href=(['"])https:\/\/bachataexplosion\.com\/(.*?)\1/gi, (match, quote, path) => (
      path.startsWith("wp-content/uploads/") ? match : `href=${quote}/${path}${quote}`
    ))
    .replace(/action=(['"])https:\/\/bachataexplosion\.com\/(.*?)\1/gi, (_match, quote, path) => `action=${quote}/${path}${quote}`)
    .replace(
      /(<div\b[^>]*\be-gallery-image\b[^>]*\bdata-thumbnail="([^"]+)"[^>]*>)(\s*<\/div>)/gi,
      (_match, opening, imageUrl, closing) => `${opening}<img src="${imageUrl}" alt="" loading="lazy" decoding="async">${closing}`,
    );

  let sourceHeadingIndex = 0;
  return prepared.replace(/<h1([^>]*)>([\s\S]*?)<\/h1>/gi, (_match, attributes, inner) => {
    sourceHeadingIndex += 1;
    return sourceHeadingIndex === 1 ? `<h1${attributes}>${inner}</h1>` : `<h2${attributes}>${inner}</h2>`;
  });
}
