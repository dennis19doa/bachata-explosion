import type { APIRoute } from "astro";
import { archiveEvents } from "../data/archive";
import { wordpressPages } from "../lib/wordpressContent";

const pages = [
  "",
  "festival/",
  "jack-and-jill/",
  "role-rotation/",
  "elite-dance-3/",
  "history/",
  "ambassadors/",
  "volunteers/",
  "archive/",
  ...archiveEvents.map((event) => `archive/${event.slug}/`),
  "contact/",
  "imprint/",
  "privacy-policy/",
  ...wordpressPages.filter((page) => page.slug !== "home").map((page) => `${page.slug}/`),
];

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL("https://bachataexplosion.com");
  const urls = [...new Set(pages)]
    .map((path) => `<url><loc>${new URL(path, base).href}</loc></url>`)
    .join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "Content-Type": "application/xml" },
  });
};
