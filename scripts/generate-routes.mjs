import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { createServer } from "vite";
import { canonicalUrl, routePaths } from "../app/site-content.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const distRoot = path.join(projectRoot, "dist");
const rootHtml = await readFile(path.join(distRoot, "index.html"), "utf8");

const vite = await createServer({
  root: projectRoot,
  configFile: false,
  appType: "custom",
  logLevel: "error",
  plugins: [react()],
  server: {
    middlewareMode: true,
    hmr: false
  }
});

let compactSearchRecordCount = 0;
try {
  const renderer = await vite.ssrLoadModule("/server/render-route.jsx");
  compactSearchRecordCount = renderer.compactSearchRecordCount;
  await writeFile(path.join(distRoot, "search-index.js"), renderer.compactSearchAsset, "utf8");
  for (const route of routePaths) {
    const targetDirectory = route === "/" ? distRoot : path.join(distRoot, ...route.slice(1).split("/"));
    await mkdir(targetDirectory, { recursive: true });
    await writeFile(path.join(targetDirectory, "index.html"), renderer.renderDocument(rootHtml, route), "utf8");
  }
} finally {
  await vite.close();
}

const sitemapEntries = routePaths
  .map((route) => `  <url>\n    <loc>${canonicalUrl(route)}</loc>\n  </url>`)
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;
await writeFile(path.join(distRoot, "sitemap.xml"), sitemap, "utf8");

console.log(`Generated ${routePaths.length} complete static pages, ${compactSearchRecordCount} compact search records and sitemap.xml.`);
