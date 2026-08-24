import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const dist = new URL("../dist/client/", import.meta.url);
const rootPath = fileURLToPath(dist);
const errors = [];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function routeFile(pathname) {
  if (pathname === "/") return join(rootPath, "index.html");
  if (extname(pathname)) return join(rootPath, pathname.slice(1));
  return join(rootPath, pathname.slice(1), "index.html");
}

for (const file of walk(rootPath).filter((path) => path.endsWith(".html"))) {
  const html = readFileSync(file, "utf8");
  const visibleHtml = html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "");
  const label = relative(rootPath, file);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${label}: missing title`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${label}: missing description`);
  if (!/<meta property="og:image" content="[^"]+"/.test(html)) errors.push(`${label}: missing social image`);
  if ((visibleHtml.match(/<h1\b/g) ?? []).length !== 1) errors.push(`${label}: expected exactly one h1`);

  for (const [, src] of html.matchAll(/\b(?:src|href)="(\/[^"]+)"/g)) {
    if (src.startsWith("//")) continue;
    const url = new URL(src, "https://bachataexplosion.com");
    const target = url.pathname.startsWith("/_astro/") || extname(url.pathname)
      ? join(rootPath, url.pathname.slice(1))
      : routeFile(url.pathname);
    if (!existsSync(target)) errors.push(`${label}: missing internal target ${src}`);
    if (url.hash && existsSync(target) && target.endsWith(".html")) {
      const targetHtml = readFileSync(target, "utf8");
      const id = url.hash.slice(1);
      if (!targetHtml.includes(`id="${id}"`)) errors.push(`${label}: missing anchor ${src}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Bachata Explosion site audit passed.");
