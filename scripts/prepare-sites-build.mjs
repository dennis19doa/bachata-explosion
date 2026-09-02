import { cpSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(projectRoot, "dist");
const client = join(dist, "client");
const server = join(dist, "server");

mkdirSync(client, { recursive: true });

for (const entry of readdirSync(dist)) {
  if (entry === "client" || entry === "server") continue;
  renameSync(join(dist, entry), join(client, entry));
}

// WordPress historically published and linked both lowercase and uppercase
// variants of the BBF route. Linux/Cloudflare paths are case-sensitive, so
// preserve the old uppercase path as a real static alias during migration.
const legacyAliases = [
  ["bbf-2026", "BBF-2026"],
];
for (const [source, alias] of legacyAliases) {
  const sourcePath = join(client, source);
  const aliasPath = join(client, alias);
  if (existsSync(sourcePath) && !existsSync(aliasPath)) cpSync(sourcePath, aliasPath, { recursive: true });
}

mkdirSync(server, { recursive: true });
writeFileSync(
  join(server, "index.js"),
  `export default {\n  async fetch(request, env) {\n    return env.ASSETS.fetch(request);\n  },\n};\n`,
);

if (existsSync(join(projectRoot, ".openai", "hosting.json"))) {
  mkdirSync(join(dist, ".openai"), { recursive: true });
  cpSync(join(projectRoot, ".openai", "hosting.json"), join(dist, ".openai", "hosting.json"));
}
