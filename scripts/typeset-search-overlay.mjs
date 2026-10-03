import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const banned = /飞鸟|flyingbird|clash(?:[ -]verge(?:[ -]service)?| for windows)?|mihomo|\bTAG\b/giu;
const publicRegistryFields = {
  groups: ["name"],
  features: ["name", "what", "how", "status"],
  numbers: ["text", "meaning"],
  relations: ["with", "direction", "flow"],
  highlights: ["title"],
  mentions: ["text"],
  symptoms: ["name", "title", "what", "how"]
};

function plainText(text) {
  return String(text || "").replace(/^#{1,6}\s+/gm, "").replace(/\*\*|`/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").trim();
}

function registryText(registry = {}) {
  return Object.entries(publicRegistryFields).flatMap(([key, fields]) =>
    (Array.isArray(registry[key]) ? registry[key] : []).flatMap((row) =>
      fields.map((field) => typeof row[field] === "string" ? row[field] : "")))
    .filter(Boolean).join(" ");
}

function recordsForPage(page, project, anchors) {
  const scope = project ? [`project:${page.page}`] : ["system"];
  const allText = [page.tagline, ...page.screens.map((screen) => screen.text),
    ...page.screens.flatMap((screen) => (screen.screenshots || []).map((shot) => shot.caption)),
    registryText(page.registry)].filter(Boolean).join(" ");
  const records = [{
    type: project ? "项目" : "页面", group: project ? "项目" : "系统",
    scopes: project ? ["project", ...scope] : scope,
    projectSlug: project ? page.page : null,
    title: `${page.title} · 总览`, detail: plainText(page.tagline || page.screens[0].text),
    href: page.url, aliases: [page.title, page.page], compactSearch: allText
  }, ...page.screens.map((screen) => ({
    type: project ? "项目内容" : "页面内容", group: project ? "项目" : "系统",
    scopes: scope, projectSlug: project ? page.page : null,
    title: `${page.title} · ${screen.title}`, detail: plainText(screen.text),
    href: anchors.has(screen.id) ? `${page.url}#${screen.id}` : page.url, aliases: [screen.title],
    compactSearch: [screen.text, ...(screen.screenshots || []).map((shot) => shot.caption),
      ...Object.entries(publicRegistryFields).flatMap(([key, fields]) =>
        (Array.isArray(page.registry?.[key]) ? page.registry[key] : [])
          .filter((row) => row.screen === screen.id || row.screens?.includes(screen.id))
          .flatMap((row) => fields.map((field) => typeof row[field] === "string" ? row[field] : "")))
    ].filter(Boolean).join(" ")
  }))];
  const hits = JSON.stringify(records).match(banned) || [];
  if (hits.length) throw new Error(`Old brand remains in public search input for ${page.page}: ${hits.join(", ")}`);
  return records;
}

async function readIndex(root, name, project) {
  const bytes = await readFile(path.join(root, name));
  const prefix = `window.${project ? "__WLY_PROJECT_SEARCH_INDEX__" : "__WLY_SEARCH_INDEX__"}=`;
  const text = bytes.toString("utf8").trim();
  if (!text.startsWith(prefix) || !text.endsWith(";")) throw new Error(`Unexpected search asset format: ${name}`);
  const entries = JSON.parse(text.slice(prefix.length, -1));
  if (!Array.isArray(entries)) throw new Error(`Search asset is not an array: ${name}`);
  return { bytes, entries };
}

export async function generateTypesetSearchOverlay(renderer, configPath) {
  const configBytes = await readFile(configPath);
  const config = JSON.parse(configBytes.toString("utf8"));
  const resolve = (value) => path.resolve(path.dirname(configPath), value);
  const baseline = resolve(config.baseline);
  const output = resolve(config.output);
  if (baseline === output) throw new Error("Search overlay output must differ from its baseline");
  const pages = [];
  for (const input of config.pages) {
    const source = resolve(input.source);
    const bytes = await readFile(source);
    const sha256 = digest(bytes);
    if (sha256 !== input.sha256) throw new Error(`Page input fingerprint changed: ${source}`);
    const page = JSON.parse(bytes.toString("utf8"));
    if (page.page !== input.page || !Array.isArray(page.screens) || !page.screens.length || !page.url?.startsWith("/")) {
      throw new Error(`Invalid canonical page input: ${source}`);
    }
    const pagePath = path.join(baseline, ...page.url.split("/").filter(Boolean), "index.html");
    const html = await readFile(pagePath, "utf8");
    const anchors = new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));
    const records = recordsForPage(page, input.project !== false, anchors).map(renderer.compactSearchProjection);
    const unanchoredScreens = page.screens.filter((screen) => !anchors.has(screen.id)).map((screen) => screen.id);
    pages.push({ page, records, project: input.project !== false, source, sha256, pagePath,
      html_sha256: digest(Buffer.from(html)), unanchoredScreens });
  }
  if (new Set(pages.map((input) => input.page.page)).size !== pages.length) throw new Error("Duplicate canonical search page");
  const slugs = new Set(pages.filter((input) => input.project).map((input) => input.page.page));
  const standaloneUrls = pages.filter((input) => !input.project).map((input) => input.page.url);
  const selected = (entry) => slugs.has(entry.projectSlug) || standaloneUrls.some((url) => entry.href?.split("#")[0].replace(/\/$/, "") === url.replace(/\/$/, ""));
  const global = await readIndex(baseline, "search-index.js", false);
  const projects = await readIndex(baseline, "search-projects.js", true);
  const globalEntries = [...global.entries.filter((entry) => !selected(entry)),
    ...pages.flatMap((input) => input.records.filter((entry) => entry.type !== "项目内容"))];
  const projectEntries = [...projects.entries.filter((entry) => !selected(entry)),
    ...pages.flatMap((input) => input.records.filter((entry) => entry.type === "项目内容"))];
  const assets = [
    { name: "search-index.js", before: global, entries: globalEntries, project: false },
    { name: "search-projects.js", before: projects, entries: projectEntries, project: true }
  ];
  for (const slug of slugs) {
    const name = `search-project-${slug}.js`;
    assets.push({ name, before: await readIndex(baseline, name, true),
      entries: projectEntries.filter((entry) => entry.projectSlug === slug), project: true });
  }
  const unchangedGlobal = global.entries.filter((entry) => !selected(entry));
  const unchangedProjects = projects.entries.filter((entry) => !selected(entry));
  if (JSON.stringify(unchangedGlobal) !== JSON.stringify(globalEntries.filter((entry) => !selected(entry)))
      || JSON.stringify(unchangedProjects) !== JSON.stringify(projectEntries.filter((entry) => !selected(entry)))) {
    throw new Error("Unrelated search records changed");
  }
  await mkdir(output, { recursive: true });
  const files = [];
  for (const asset of assets) {
    const bytes = Buffer.from(renderer.serializeSearchAsset(asset.entries, asset.project), "utf8");
    await writeFile(path.join(output, asset.name), bytes);
    files.push({ path: asset.name, before_sha256: digest(asset.before.bytes), after_sha256: digest(bytes),
      before_bytes: asset.before.bytes.length, after_bytes: bytes.length,
      before_records: asset.before.entries.length, after_records: asset.entries.length });
  }
  const report = {
    schema: "wly.typeset-search-overlay.v1", status: "generated", baseline, output,
    config_sha256: digest(configBytes),
    inputs: pages.map((input) => ({ page: input.page.page, source: input.source, sha256: input.sha256,
      html_source: input.pagePath, html_sha256: input.html_sha256, unanchored_screens: input.unanchoredScreens,
      records: input.records.length, public_brand_hits: 0 })),
    unrelated_records_preserved: { global: unchangedGlobal.length, projects: unchangedProjects.length }, files
  };
  await writeFile(path.join(output, "search-overlay-manifest.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  return report;
}
