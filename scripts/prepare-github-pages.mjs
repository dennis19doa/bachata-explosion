import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outputDirectory = fileURLToPath(new URL("../dist/", import.meta.url));
const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] || "bachata-explosion";
const basePath = `/${repository}/`;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }

  return files;
}

function prefixHtml(content) {
  let result = content.replace(
    /action=(['"])\/wp-admin\/[^'"]*\1/g,
    'action="#"',
  );

  result = result.replace(
    /(href|src|poster|action)=(['"])\/(?!\/)/g,
    (_, attribute, quote) => `${attribute}=${quote}${basePath}`,
  );

  result = result.replace(/srcset=(['"])(.*?)\1/g, (_, quote, value) => {
    const prefixed = value.replace(/(^|,\s*)\/(?!\/)/g, `$1${basePath}`);
    return `srcset=${quote}${prefixed}${quote}`;
  });

  if (!/<meta\s+name=(['"])robots\1/i.test(result)) {
    result = result.replace("</head>", '  <meta name="robots" content="noindex,nofollow" />\n</head>');
  }

  return result;
}

function prefixCss(content) {
  return content.replace(
    /url\((['"]?)\/(?!\/)/g,
    (_, quote) => `url(${quote}${basePath}`,
  );
}

for (const file of await walk(outputDirectory)) {
  const extension = extname(file);
  if (extension !== ".html" && extension !== ".css") continue;

  const content = await readFile(file, "utf8");
  const transformed = extension === ".html" ? prefixHtml(content) : prefixCss(content);
  await writeFile(file, transformed);
}

await writeFile(
  join(outputDirectory, "robots.txt"),
  "User-agent: *\nDisallow: /\n",
);

console.log(`Prepared GitHub Pages preview at ${basePath}`);
