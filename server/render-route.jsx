import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Page from "../app/page.jsx";
import { globalSearchEntries } from "../app/search.js";
import { canonicalPath, canonicalUrl, projectCatalog, projectEntryForPath, routeMeta, routePaths } from "../app/site-content.js";

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function replaceRequired(html, matcher, replacement) {
  if (!matcher.test(html)) throw new Error(`Expected HTML pattern was not found: ${matcher}`);
  return html.replace(matcher, replacement);
}

function canonicalDocumentHref(href) {
  const target = new URL(href, "https://wly0829.cn");
  return `${canonicalPath(target.pathname)}${target.search}${target.hash}`;
}

function compactSearchProjection(entry) {
  const href = canonicalDocumentHref(entry.href);
  const detailLimit = entry.type === "项目资产" ? 120 : entry.type === "系统组成" ? 140 : 180;
  return {
    type: entry.type,
    group: entry.group,
    scopes: entry.scopes || [],
    projectSlug: entry.projectSlug || null,
    title: entry.title,
    detail: entry.detail.slice(0, detailLimit),
    href,
    aliases: [...new Set(entry.aliases || [])],
    search: entry.compactSearch || ""
  };
}

export const compactSearchIndex = globalSearchEntries
  .filter((entry) => entry.type !== "项目内容")
  .map(compactSearchProjection);

export const compactProjectSearchIndex = globalSearchEntries
  .filter((entry) => entry.type === "项目内容")
  .map(compactSearchProjection);

export const compactProjectSearchIndices = Object.fromEntries(projectCatalog.map((entry) => [
  entry.project.slug,
  compactProjectSearchIndex.filter((candidate) => candidate.projectSlug === entry.project.slug)
]));

export const compactSearchRecordCount = compactSearchIndex.length + compactProjectSearchIndex.length;

function jsonForInlineScript(value) {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}

export const compactSearchAsset = `window.__WLY_SEARCH_INDEX__=${jsonForInlineScript(compactSearchIndex)};\n`;
export const compactProjectSearchAsset = `window.__WLY_PROJECT_SEARCH_INDEX__=${jsonForInlineScript(compactProjectSearchIndex)};\n`;
export const compactProjectSearchAssets = Object.fromEntries(Object.entries(compactProjectSearchIndices).map(([slug, entries]) => [
  slug,
  `window.__WLY_PROJECT_SEARCH_INDEX__=${jsonForInlineScript(entries)};\n`
]));

function searchIndexScripts(route) {
  const scripts = ['<script src="/search-index.js"></script>'];
  if (route === "/search") scripts.push('<script src="/search-projects.js"></script>');
  else {
    const projectEntry = projectEntryForPath(route);
    if (projectEntry) scripts.push(`<script src="/search-project-${escapeAttribute(projectEntry.project.slug)}.js"></script>`);
  }
  return scripts.join("\n    ");
}

function nextStaticRoute(route) {
  if (route === "/system") return null;
  const currentIndex = routePaths.indexOf(route);
  if (currentIndex < 0) return null;
  return routePaths.slice(currentIndex + 1).find((candidate) => candidate !== "/system") || null;
}

export function renderRoute(pathname, search = "") {
  return renderToStaticMarkup(<Page initialPathname={pathname} initialSearch={search} />);
}

export function renderDocument(template, pathname, search = "") {
  const route = canonicalPath(pathname) === "/" ? "/" : canonicalPath(pathname).slice(0, -1);
  const meta = routeMeta(route);
  const canonical = canonicalUrl(route === "/system" ? "/" : route);
  const prefetchTarget = nextStaticRoute(route);
  const prefetchLinks = prefetchTarget ? `<link rel="prefetch" as="document" href="${escapeAttribute(canonicalPath(prefetchTarget))}" />` : "";
  let html = template;
  html = replaceRequired(html, /<title>[^<]*<\/title>/, `<title>${escapeAttribute(meta.title)}</title>`);
  html = replaceRequired(html, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/, `<meta name="description" content="${escapeAttribute(meta.description)}" />`);
  html = replaceRequired(html, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${escapeAttribute(canonical)}" />`);
  html = replaceRequired(html, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${escapeAttribute(canonical)}" />`);
  html = replaceRequired(html, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escapeAttribute(meta.title)}" />`);
  html = replaceRequired(html, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${escapeAttribute(meta.description)}" />`);
  html = replaceRequired(html, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${escapeAttribute(meta.title)}" />`);
  html = replaceRequired(html, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${escapeAttribute(meta.description)}" />`);
  html = replaceRequired(html, /<div id="root"><\/div>/, `<div id="root" data-static-route="${escapeAttribute(route)}">${renderRoute(route, search)}</div>`);
  const compatibilityRedirect = route === "/system" ? '<meta http-equiv="refresh" content="0; url=/" />\n    ' : "";
  html = html.replace("</head>", `    ${compatibilityRedirect}${prefetchLinks}\n  </head>`);
  if (!/<script\s+type="module"/.test(html)) throw new Error("HTML template has no client enhancement entry");
  return html.replace(/(<script\s+type="module")/, `${searchIndexScripts(route)}\n    $1`);
}
