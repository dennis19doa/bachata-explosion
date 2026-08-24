import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const projectRoot = new URL("../", import.meta.url);
const pages = JSON.parse(readFileSync(new URL("../migration/wp-pages-public-export.json", import.meta.url), "utf8"));
const distRoot = new URL("../dist/client/", import.meta.url);
const mediaPattern = /https?:\/\/[^"'<>) ]+\/wp-content\/uploads\/[^"'<>) ]+/g;
const errors = [];
const sourceMedia = new Set();
const builtMedia = new Set();

for (const page of pages) {
  const pathname = page.slug === "home" ? "index.html" : join(page.slug, "index.html");
  const outputUrl = new URL(pathname, distRoot);
  if (!existsSync(outputUrl)) {
    errors.push(`${page.slug}: missing built route`);
    continue;
  }

  const output = readFileSync(outputUrl, "utf8");
  if (!output.includes(`data-wordpress-source="${page.slug}"`)) {
    errors.push(`${page.slug}: built route is not connected to its WordPress source page`);
  }

  const pageMedia = page.content.rendered.match(mediaPattern) ?? [];
  pageMedia.forEach((url) => sourceMedia.add(url.replace(/\\+$/, "")));
  (output.match(mediaPattern) ?? []).forEach((url) => builtMedia.add(url.replace(/\\+$/, "")));
}

for (const mediaUrl of sourceMedia) {
  if (!builtMedia.has(mediaUrl)) errors.push(`missing media reference: ${mediaUrl}`);
}

if (errors.length) {
  console.error(errors.slice(0, 100).join("\n"));
  if (errors.length > 100) console.error(`…and ${errors.length - 100} more`);
  process.exit(1);
}

console.log(`WordPress content parity passed: ${pages.length} source pages and ${sourceMedia.size} media references preserved.`);
