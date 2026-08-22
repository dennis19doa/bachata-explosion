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

mkdirSync(server, { recursive: true });
writeFileSync(
  join(server, "index.js"),
  `export default {\n  async fetch(request, env) {\n    return env.ASSETS.fetch(request);\n  },\n};\n`,
);

if (existsSync(join(projectRoot, ".openai", "hosting.json"))) {
  mkdirSync(join(dist, ".openai"), { recursive: true });
  cpSync(join(projectRoot, ".openai", "hosting.json"), join(dist, ".openai", "hosting.json"));
}
