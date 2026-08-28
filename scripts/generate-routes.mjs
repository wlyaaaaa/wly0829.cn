import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { routeMeta, routePaths, site } from "../app/site-content.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const distRoot = path.join(projectRoot, "dist");
const rootIndexPath = path.join(distRoot, "index.html");
const rootHtml = await readFile(rootIndexPath, "utf8");

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function replaceMeta(html, matcher, replacement) {
  if (!matcher.test(html)) {
    throw new Error(`Expected metadata pattern was not found: ${matcher}`);
  }
  return html.replace(matcher, replacement);
}

function htmlForRoute(route) {
  const meta = routeMeta(route);
  const canonical = `${site.url}${route === "/" ? "/" : route}`;
  let html = rootHtml;
  html = replaceMeta(html, /<title>[^<]*<\/title>/, `<title>${escapeAttribute(meta.title)}</title>`);
  html = replaceMeta(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeAttribute(meta.description)}" />`
  );
  html = replaceMeta(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeAttribute(canonical)}" />`
  );
  html = replaceMeta(
    html,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${escapeAttribute(canonical)}" />`
  );
  html = replaceMeta(
    html,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeAttribute(meta.title)}" />`
  );
  html = replaceMeta(
    html,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeAttribute(meta.description)}" />`
  );
  html = replaceMeta(
    html,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeAttribute(meta.title)}" />`
  );
  html = replaceMeta(
    html,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeAttribute(meta.description)}" />`
  );
  return html;
}

for (const route of routePaths) {
  const targetDirectory = route === "/" ? distRoot : path.join(distRoot, ...route.slice(1).split("/"));
  await mkdir(targetDirectory, { recursive: true });
  await writeFile(path.join(targetDirectory, "index.html"), htmlForRoute(route), "utf8");
}

const sitemapEntries = routePaths
  .map((route) => `  <url>\n    <loc>${site.url}${route === "/" ? "/" : route}</loc>\n  </url>`)
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;
await writeFile(path.join(distRoot, "sitemap.xml"), sitemap, "utf8");

console.log(`Generated ${routePaths.length} routable pages and sitemap.xml.`);
