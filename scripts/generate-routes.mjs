import { mkdir, readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { canonicalUrl, routePaths } from "../app/site-content.js";
import * as searchAssets from "../app/search-assets.js";
import { generateTypesetSearchOverlay } from "./typeset-search-overlay.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const distRoot = path.join(projectRoot, "dist");
const bodyArgument = process.argv.indexOf("--render-bodies");
const bodyConfig = bodyArgument < 0 ? null : JSON.parse(await readFile(process.argv[bodyArgument + 1], "utf8"));
const overlayArgument = process.argv.indexOf("--search-overlay");
const overlayConfig = overlayArgument < 0 ? null : process.argv[overlayArgument + 1];
if (overlayArgument >= 0 && !overlayConfig) throw new Error("--search-overlay requires a JSON configuration path");
if (overlayConfig) {
  const report = await generateTypesetSearchOverlay(searchAssets, path.resolve(overlayConfig));
  console.log(JSON.stringify(report, null, 2));
} else {
  const rootHtml = bodyConfig ? "" : await readFile(path.join(distRoot, "index.html"), "utf8");
  const [{ default: react }, { createServer }] = await Promise.all([
    import("@vitejs/plugin-react"), import("vite")
  ]);

  const vite = await createServer({
    root: projectRoot,
    configFile: false,
    appType: "custom",
    logLevel: "error",
    plugins: [react()],
    // One-shot SSR must not crawl/watch the generated publication directories.
    optimizeDeps: { noDiscovery: true, include: [] },
    server: {
      middlewareMode: true,
      hmr: false,
      watch: null
    }
  });

  let compactSearchRecordCount = 0;
  try {
    const renderer = await vite.ssrLoadModule("/server/render-route.jsx");
    if (bodyConfig) {
      for (const route of bodyConfig.routes) {
        if (!routePaths.includes(route)) throw new Error(`Unknown static route: ${route}`);
        const target = path.resolve(bodyConfig.output, route.slice(1), "index.html");
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, renderer.renderRoute(route), "utf8");
      }
    } else {
    compactSearchRecordCount = renderer.compactSearchRecordCount;
    await writeFile(path.join(distRoot, "search-index.js"), renderer.compactSearchAsset, "utf8");
    await writeFile(path.join(distRoot, "search-projects.js"), renderer.compactProjectSearchAsset, "utf8");
    for (const [slug, asset] of Object.entries(renderer.compactProjectSearchAssets)) {
      await writeFile(path.join(distRoot, `search-project-${slug}.js`), asset, "utf8");
    }
    for (const route of routePaths) {
      const targetDirectory = route === "/" ? distRoot : path.join(distRoot, ...route.slice(1).split("/"));
      await mkdir(targetDirectory, { recursive: true });
      await writeFile(path.join(targetDirectory, "index.html"), renderer.renderDocument(rootHtml, route), "utf8");
    }
    }
  } finally {
    await vite.close();
  }
  if (bodyConfig) { console.log(`Generated ${bodyConfig.routes.length} route bodies.`); process.exit(0); }

  const sitemapEntries = routePaths
    .filter((route) => route !== "/system")
    .map((route) => `  <url>\n    <loc>${canonicalUrl(route)}</loc>\n  </url>`)
    .join("\n");
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;
  await writeFile(path.join(distRoot, "sitemap.xml"), sitemap, "utf8");

  execFileSync(process.platform === "win32" ? "python" : "python3", [
    path.join(scriptDirectory, "audit-page-publication.py"), "--release-root", distRoot, "--finalize-only"
  ], { cwd: projectRoot, stdio: "inherit", windowsHide: true });

  console.log(`Generated ${routePaths.length} complete static pages, ${compactSearchRecordCount} compact search records and sitemap.xml.`);
}
