import { createCompactSearchEntry } from "./compact-search.js";
import { canonicalPath } from "./site-content.js";

export function compactSearchProjection(entry) {
  const target = new URL(entry.href, "https://wly0829.cn");
  return createCompactSearchEntry(entry, `${canonicalPath(target.pathname)}${target.search}${target.hash}`);
}

export function serializeSearchAsset(entries, project = false) {
  const json = JSON.stringify(entries)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
  return `window.${project ? "__WLY_PROJECT_SEARCH_INDEX__" : "__WLY_SEARCH_INDEX__"}=${json};\n`;
}
