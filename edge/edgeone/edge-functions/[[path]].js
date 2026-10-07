const statusPath = '/computer-access/state';
const origins = new Set(['https://wly0829.cn', 'https://www.wly0829.cn']);
export default async function onRequest({ request }) {
  const url = new URL(request.url), origin = request.headers.get('Origin');
  const headers = new Headers({ 'Cache-Control': 'no-store, max-age=0', Pragma: 'no-cache', Expires: '0', Vary: 'Origin', 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS' });
  if (origins.has(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Credentials', 'true');
  }
  if (url.pathname !== statusPath) return new Response('Not found', { status: 404, headers });
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (!['GET', 'HEAD'].includes(request.method)) return new Response('Not found', { status: 404, headers });
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 6000);
  try {
    const upstream = await fetch('https://mcp.wly0829.cn/computer-access/api/status' + (url.searchParams.get('refresh') === '1' ? '?refresh=1' : ''), {
      headers: { Accept: 'application/json', 'Cache-Control': 'no-cache' }, signal: controller.signal
    });
    const body = await upstream.text();
    headers.set('Content-Type', upstream.headers.get('Content-Type') || 'application/json');
    return new Response(request.method === 'HEAD' ? null : body, { status: upstream.status, headers });
  } catch {
    return new Response('Upstream unavailable', { status: 504, headers });
  } finally { clearTimeout(timer); }
}
