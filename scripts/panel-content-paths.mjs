import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const contentHash = (bytes) => createHash("sha256").update(bytes).digest("hex");
export function safeContentPath(relativePath) {
  const resolved = path.resolve(projectRoot, relativePath);
  const relative = path.relative(projectRoot, resolved);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`Invalid content path: ${relativePath}`);
  return resolved;
}

export async function contentFiles(paths) {
  const files = new Set();
  async function collect(relative) {
    const absolute = safeContentPath(relative);
    if ((await stat(absolute)).isDirectory()) {
      for (const name of (await readdir(absolute)).sort()) await collect(`${relative}/${name}`);
      if (/^sources\/pages\/[^/]+$/.test(relative)) {
        const markdown = `site-astro/src/content/pages/${path.basename(relative)}.md`;
        try { await stat(safeContentPath(markdown)); } catch (error) { if (error.code === "ENOENT") return; throw error; }
        files.add(markdown);
      }
    } else files.add(relative);
  }
  for (const relative of paths) await collect(relative);
  return Promise.all([...files].sort().map(async (relative) => ({
    path: relative, content_sha256: contentHash(await readFile(safeContentPath(relative)))
  })));
}

export async function projectContentSnapshot(registration) {
  const primary = registration.ai_refresh.content_path;
  const prefix = registration.route.replace(/^\//, "").replace(/\/?$/, "/");
  const manifest = JSON.parse(await readFile(path.join(projectRoot, "site-astro/sources/frozen-site/manifest.json"), "utf8"));
  const paths = Object.keys(manifest.pages).filter((name) => name.startsWith(prefix)).map((name) => `site-astro/sources/frozen-site/pages/${name}`);
  let authored = null;
  if (primary.startsWith("sources/pages/")) {
    authored = JSON.parse(await readFile(safeContentPath(primary), "utf8"));
    const routes = [registration.route, authored.url].map((route) => route.replace(/\/?$/, "/"));
    const prefixes = [registration.id, path.basename(path.dirname(primary))];
    const names = (await readdir(path.join(projectRoot, "sources/pages"))).filter((name) =>
      prefixes.some((prefix) => name === prefix || name.startsWith(`${prefix}-`))).sort();
    for (const name of names) {
      const relative = `sources/pages/${name}`;
      const page = JSON.parse(await readFile(safeContentPath(`${relative}/page.json`), "utf8"));
      if (routes.some((route) => page.url?.startsWith(route))) paths.push(relative);
    }
  } else {
    if (!paths.includes(primary)) throw new Error(`Frozen overview is not published: ${primary}`);
  }
  const files = await contentFiles(paths);
  return { files, authored, sha256: contentHash(JSON.stringify(files)) };
}
