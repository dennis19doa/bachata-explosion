import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const projectRoot = new URL("../", import.meta.url);
const pages = JSON.parse(readFileSync(new URL("../migration/wp-pages-public-export.json", import.meta.url), "utf8"));
const distRoot = new URL("../dist/client/", import.meta.url);
const mediaPattern = /https?:\/\/[^"'<>) ]+\/wp-content\/uploads\/[^"'<>) ]+/g;
const errors = [];
const sourceMedia = new Set();
const builtMedia = new Set();
const builtOutput = [];
const mediaReplacements = new Map([
  ["https://bachataexplosion.com/wp-content/uploads/2026/03/November-Event-2.webp", "/media/events/elite-dance-3.webp"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/08/2022.07.21-22-16-IMG_1671-Rating_-2-scaled-1.jpg", "/media/team/dennis.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/08/DSC_3803-scaled-1.jpg", "/media/team/elena.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/08/IMG_9272-scaled-1.jpg", "/media/team/laura.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/08/2022.07-1.jpg", "/media/team/lucy.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-11-at-00.25.12.jpg", "/media/team/mircea.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/08/Roberto-1.jpg", "/media/team/roberto.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/08/WhatsApp-Image-2025-07-18-at-12.28.56.jpg", "/media/team/jenn.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/08/SnapInsta.to_520722287_17912319933149947_7642995369490480336_n-1.jpg", "/media/team/milo.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/08/1000081647-1.jpg", "/media/team/blanca.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/08/Layer-1-scaled-1.webp", "/media/brand/graffiti-layer.webp"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/08/Party-Friday-124-scaled-1.webp", "/media/bbf/atmosphere/saturday-62.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2026/01/12251.mp4", "/media/video/bbf-2026-recap.mp4"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/08/DSC_0143b-scaled.jpg", "/media/bbf/atmosphere/saturday-62.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/08/DSC_2849a.jpg", "/media/bbf/atmosphere/party-143.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/Screenshot-2025-12-25-172057.png", "/media/bbf/venue/architecture.png"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/Screenshot-2025-12-25-171752.png", "/media/bbf/venue/arrival.png"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/Screenshot-2025-12-25-171539.png", "/media/bbf/venue/location.png"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/Screenshot-2025-12-25-171413.png", "/media/bbf/venue/facilities.png"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/Screenshot-2025-12-25-171926.png", "/media/bbf/venue/hotel.png"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/Screenshot-2025-12-25-171858.png", "/media/bbf/venue/hero.png"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/Screenshot-2025-12-25-165417.png", "/media/bbf/venue/connectivity.png"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/Screenshot-2025-12-25-171955.png", "/media/bbf/venue/lounge.png"],
  ["https://bachataexplosion.com/wp-content/uploads/2026/04/Party-143.jpg", "/media/bbf/atmosphere/party-143.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-Victor-Alba-scaled.jpg", "/media/bbf/artists/victor-alba.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-Azu-Records-scaled.jpg", "/media/bbf/artists/azu-records.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-Cesc-scaled.jpg", "/media/bbf/artists/cesc.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-David-Laura-scaled.jpg", "/media/bbf/artists/david-laura.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-Diego-Ola-scaled.jpg", "/media/bbf/artists/diego-ola.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-Diego-scaled.jpg", "/media/bbf/artists/diego.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-DJ-DennisS-scaled.jpg", "/media/bbf/artists/dj-denniss.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-DJ-Molando-scaled.jpg", "/media/bbf/artists/dj-molando.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-DNA-scaled.jpg", "/media/bbf/artists/dna.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-Don-DIego-scaled.jpg", "/media/bbf/artists/don-diego.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-Elena-Dennis-scaled.jpg", "/media/bbf/artists/elena-dennis.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-Emilien-Tehina-scaled.jpg", "/media/bbf/artists/emilien-tehina.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-Lee-scaled.jpg", "/media/bbf/artists/lee.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-InstagramLiza-Chicho-scaled.jpg", "/media/bbf/artists/liza-chicho.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-Mahir-scaled.jpg", "/media/bbf/artists/mahir.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-Nick-Daniela-scaled.jpg", "/media/bbf/artists/nick-daniela.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-Ofir-Ofri-scaled.jpg", "/media/bbf/artists/ofir-ofri.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-Pakulat-scaled.jpg", "/media/bbf/artists/pakulat.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-Sebas-scaled.jpg", "/media/bbf/artists/sebas.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-Solo-Poster-scaled.jpg", "/media/bbf/artists/solo-poster.jpg"],
  ["https://bachataexplosion.com/wp-content/uploads/2025/12/4-5-BBF-2026-Instagram-Solo-Poster-Felipe-Taigo-scaled.jpg", "/media/bbf/artists/felipe-taigo.jpg"],
]);

for (const page of pages) {
  const pathname = page.slug === "home" ? "index.html" : join(page.slug, "index.html");
  const outputUrl = new URL(pathname, distRoot);
  if (!existsSync(outputUrl)) {
    errors.push(`${page.slug}: missing built route`);
    continue;
  }

  const output = readFileSync(outputUrl, "utf8");
  builtOutput.push(output);
  if (!output.includes(`data-wordpress-source="${page.slug}"`)) {
    errors.push(`${page.slug}: built route is not connected to its WordPress source page`);
  }

  const pageMedia = page.content.rendered.match(mediaPattern) ?? [];
  pageMedia.forEach((url) => sourceMedia.add(url.replace(/\\+$/, "")));
  (output.match(mediaPattern) ?? []).forEach((url) => builtMedia.add(url.replace(/\\+$/, "")));
}

const renderedOutput = builtOutput.join("\n");
for (const mediaUrl of sourceMedia) {
  if (builtMedia.has(mediaUrl)) continue;
  const replacement = mediaReplacements.get(mediaUrl);
  if (replacement && renderedOutput.includes(replacement) && existsSync(new URL(replacement.slice(1), distRoot))) continue;
  errors.push(`missing media reference: ${mediaUrl}`);
}

if (errors.length) {
  console.error(errors.slice(0, 100).join("\n"));
  if (errors.length > 100) console.error(`…and ${errors.length - 100} more`);
  process.exit(1);
}

console.log(`WordPress content parity passed: ${pages.length} source pages and ${sourceMedia.size} media references preserved.`);
