// Shared by the current Astro render and its focused head/retry checks.
export function currentAlbumHead(head: string[], metadata: () => unknown, runtime: {source: string; css: string}) {
  return head.map(h => h.startsWith('<script id="album-page"')
    ? `<script id="album-page" type="application/json">${JSON.stringify(metadata()).replace(/</g, '\u003c')}</script>`
    : /<script[^>]*data-album-inline/.test(h) ? `<script data-album-inline>${runtime.source}</script>`
    : h.replace(/\/_album\/album-[\w]+\.css/g, runtime.css));
}
