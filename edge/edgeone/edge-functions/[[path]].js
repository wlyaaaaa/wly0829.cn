const statusPath = '/computer-access/state';
const origins = new Set(['https://wly0829.cn', 'https://www.wly0829.cn']);
export default async function onRequest({ request }) {
  const url = new URL(request.url), origin = request.headers.get('Origin');
  const headers = new Headers({ 'Cache-Control': 'no-store, max-age=0', Pragma: 'no-cache', Expires: '0', Vary: 'Origin, Accept-Encoding, X-Cockpit-Device', 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS', 'Access-Control-Allow-Headers': 'X-Cockpit-Device' });
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
    // 本人设备钥匙：只认固定格式，原样交给上游判断本人版/公开版；这里不记录、不回显
    // Keep the representation unambiguous across fetch runtimes: no decode/re-encode in JS.
    const upstreamHeaders = { Accept: 'application/json', 'Accept-Encoding': 'identity', 'Cache-Control': 'no-cache' }, device = request.headers.get('X-Cockpit-Device');
    if (device && /^[A-Za-z0-9_-]{43}$/.test(device)) upstreamHeaders['X-Cockpit-Device'] = device;
    const upstream = await fetch('https://mcp.wly0829.cn/computer-access/api/status' + (String(query) ? '?' + query : ''), {
      headers: upstreamHeaders, signal: controller.signal
    });
    headers.set('Content-Type', upstream.headers.get('Content-Type') || 'application/json');
    if (request.method === 'HEAD') {
      await upstream.body?.cancel();
      return new Response(null, { status: upstream.status, headers });
    }
    // Return at headers; the platform streams with backpressure, without buffering the JSON.
    // Do not copy Content-Encoding/Length: fetch may have decoded the upstream body.
    return new Response(upstream.body, { status: upstream.status, headers });
  } catch {
    return new Response('Upstream unavailable', { status: 504, headers });
  } finally { clearTimeout(timer); } // The deadline bounds headers, not the returned body stream.
}
