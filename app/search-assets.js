import { createCompactSearchEntry } from "./compact-search.js";
import { canonicalPath } from "./site-content.js";
import { publicSearchRecord } from "./public-search-projection.js";

export function compactSearchProjection(entry) {
  const target = new URL(entry.href, "https://wly0829.cn");
  const publicEntry = publicSearchRecord({ ...entry, search: entry.compactSearch ?? entry.search ?? "" });
  return publicSearchRecord(createCompactSearchEntry(publicEntry, `${canonicalPath(target.pathname)}${target.search}${target.hash}`));
}

export function serializeSearchAsset(entries, project = false) {
  const json = JSON.stringify(entries.map(publicSearchRecord))
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
  return `window.${project ? "__WLY_PROJECT_SEARCH_INDEX__" : "__WLY_SEARCH_INDEX__"}=${json};\n`;
}
