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

const RECOVERED_IMAGE_BY_ALT: Record<string, string> = {
  "Bachata Explosion crowd dancing at a Berlin party": "/media/atmosphere/party-crowd.webp",
  "Dennis, Bachata Explosion founder": "/media/team/dennis.jpg",
  "Elena, Bachata Explosion founder": "/media/team/elena.jpg",
  "Laura, Bachata Explosion team member": "/media/team/laura.jpg",
  "Lucy, physiotherapist": "/media/team/lucy.jpg",
  "Mircea, chef": "/media/team/mircea.jpg",
  "Roberto, promoter": "/media/team/roberto.jpg",
  "Jenn, Bachata Explosion team member": "/media/team/jenn.jpg",
  "Milo, driver": "/media/team/milo.jpg",
  "Blanca, research and planning": "/media/team/blanca.jpg",
  "Berlin Bachata Festival 2026 poster": "/media/events/bbf-2026-poster.jpg",
  "Role Rotation 2026 bachata event poster": "/media/events/role-rotation-2026.webp",
  "Elite Dance 3 Bachata Explosion Berlin poster": "/media/events/elite-dance-3.webp",
  "Role Rotation 2026 cover": "/media/archive/role-rotation-2026.jpg",
  "Elite Dance #3 cover": "/media/archive/elite-dance-3.jpg",
  "Elite Dance #2 2025 cover": "/media/archive/elite-dance-2-2025.jpg",
  "Berlin Bachata Festival 2025 cover": "/media/archive/bbf-2025.jpg",
  "Elite Dance #1 2025 cover": "/media/archive/elite-dance-1-2025.jpg",
  "Summer Edition 25 cover": "/media/archive/summer-2025.jpg",
  "Role Rotation 25 cover": "/media/archive/role-rotation-2025.jpg",
  "Role Rotation 2025 cover": "/media/archive/role-rotation-2025.jpg",
  "Berlin Bachata Festival 24 cover": "/media/archive/bbf-2024.jpg",
  "Berlin Bachata Festival 2024 cover": "/media/archive/bbf-2024.jpg",
  "Summer Edition 24 cover": "/media/archive/summer-2024.jpg",
  "Summer Edition 2024 cover": "/media/archive/summer-2024.jpg",
  "Role Rotation 24 cover": "/media/archive/role-rotation-2024.jpg",
  "Role Rotation 2024 cover": "/media/archive/role-rotation-2024.jpg",
  "Berlin Bachata Festival 23 cover": "/media/archive/bbf-2023.jpg",
  "Berlin Bachata Festival 2023 cover": "/media/archive/bbf-2023.jpg",
  "Summer Edition 2023 cover": "/media/archive/summer-2023.jpg",
  "Hamburg Explosion 2023 cover": "/media/archive/hamburg-2023.jpg",
  "Gold Edition 2022 cover": "/media/archive/gold-2022.jpg",
  "Dominican Edition 2022 cover": "/media/archive/dominican-2022.jpg",
  "Sensual Weekend 2022 cover": "/media/archive/sensual-weekend-2022.jpg",
};

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

function restoreRecoveredImageSources(html: string) {
  return html
    .replaceAll(
      "https://bachataexplosion.com/wp-content/uploads/2025/08/Layer-1-scaled-1.webp",
      "/media/brand/graffiti-layer.webp",
    )
    .replace(/<img\b[^>]*>/gi, (tag) => {
      const altMatch = tag.match(/\balt=(['"])(.*?)\1/i);
      if (!altMatch) return tag;
      const localSrc = RECOVERED_IMAGE_BY_ALT[decodeWordPressText(altMatch[2])];
      if (!localSrc) return tag;

      if (/\bsrc=(['"])[\s\S]*?\1/i.test(tag)) {
        return tag.replace(/\bsrc=(['"])[\s\S]*?\1/i, `src="${localSrc}"`);
      }

      return tag.replace(/<img\b/i, `<img src="${localSrc}"`);
    });
}

export function prepareWordPressHtml(html: string) {
  const prepared = restoreRecoveredImageSources(html)
    .replaceAll(
      "https://bachataexplosion.com/wp-content/uploads/2026/01/12251.mp4",
      "/media/video/bbf-2026-recap.mp4",
    )
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
