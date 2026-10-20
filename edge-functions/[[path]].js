const statusPath = '/computer-access/state';
const origins = new Set(['https://wly0829.cn', 'https://www.wly0829.cn']);
export default async function onRequest({ request }) {
  const url = new URL(request.url), origin = request.headers.get('Origin');
  const headers = new Headers({ 'Cache-Control': 'no-store, max-age=0', Pragma: 'no-cache', Expires: '0', Vary: 'Origin, Accept-Encoding', 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS' });
  if (origins.has(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Credentials', 'true');
  }
  if (url.pathname !== statusPath) return new Response('Not found', { status: 404, headers });
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (!['GET', 'HEAD'].includes(request.method)) return new Response('Not found', { status: 404, headers });
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 6000);
  try {
    // Only two fixed query values pass through: the compact cockpit view and the refresh wake-up.
    const query = new URLSearchParams();
    if (url.searchParams.get('view') === 'cockpit') query.set('view', 'cockpit');
    if (url.searchParams.get('refresh') === '1') query.set('refresh', '1');
    const upstream = await fetch('https://mcp.wly0829.cn/computer-access/api/status' + (String(query) ? '?' + query : ''), {
      headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' }, signal: controller.signal
    });
    let body = await upstream.text();
    headers.set('Content-Type', upstream.headers.get('Content-Type') || 'application/json');
    const gzip = (request.headers.get('Accept-Encoding') || '').split(',').some((part) => {
      const [coding, ...params] = part.trim().toLowerCase().split(';');
      return coding === 'gzip' && !params.some((param) => /^\s*q\s*=\s*0(?:\.0*)?\s*$/.test(param));
    });
    if (gzip) {
      // fetch 已解压上游正文；重新压缩，不沿用上游的 Content-Encoding。
      body = await new Response(new Blob([body]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer();
      headers.set('Content-Encoding', 'gzip');
    }
    return new Response(request.method === 'HEAD' ? null : body, { status: upstream.status, headers });
  } catch {
    return new Response('Upstream unavailable', { status: 504, headers });
  } finally { clearTimeout(timer); }
}
