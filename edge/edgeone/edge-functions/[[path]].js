const prefix = '/computer-access/live/v1/';
const origins = new Set(['https://wly0829.cn', 'https://www.wly0829.cn']);
const OSS_FALLBACK_URL = 'https://wly0829-img-media-shanghai.cn-shanghai.oss.aliyuncs.com/live/v1/fallback.json';
const FALLBACK_POLICY = 'policy-10'; // Same generation as the PCConfig exporter and live client.
async function cloudSnapshot(resource) {
  // The fixed OSS address cannot prove that its audience is still current.
  const response = await fetch(OSS_FALLBACK_URL, {cache: 'no-store', signal: AbortSignal.timeout(5000)});
  if (!response.ok) throw Error('snapshot');
  const value = await response.json(), proof = value?.publication;
  if (value?.metadata_only !== true || proof?.policy !== FALLBACK_POLICY ||
      typeof proof.audience !== 'string' || !/^[a-f0-9]{64}$/.test(proof.audience) ||
      typeof value.at !== 'string' || !Number.isFinite(Date.parse(value.at))) throw Error('snapshot');
  const observed = value.resources?.[resource]?.at;
  const at = typeof observed === 'string' && Number.isFinite(Date.parse(observed)) ? new Date(observed).toISOString() : null;
  return {at, audience: proof.audience};
}
export default async function onRequest({request, env = {}}) {
  const url = new URL(request.url), old = url.pathname === '/computer-access/state';
  const instant = Date.now(), now = new Date(instant).toISOString(), device = request.headers.get('X-Cockpit-Device') || '';
  const validDevice = /^[A-Za-z0-9_-]{43}$/.test(device);
  const headers = new Headers({'Cache-Control': 'no-store', Vary: old ? 'Origin, Accept-Encoding, X-Cockpit-Device' : 'X-Cockpit-Device, Origin, Accept-Encoding', Date: new Date(instant).toUTCString()});
  headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS'); headers.set('Access-Control-Allow-Headers', 'X-Cockpit-Device, If-None-Match');
  headers.set('Access-Control-Expose-Headers', 'ETag, Date, X-Live-Source, X-Live-Fallback-Policy, X-Live-Fallback-Audience, X-Live-Connection'); headers.set('Access-Control-Max-Age', '86400');
  if (origins.has(request.headers.get('Origin'))) { headers.set('Access-Control-Allow-Origin', request.headers.get('Origin')); headers.set('Access-Control-Allow-Credentials', 'true'); }
  const reply = (value, status = 200) => { headers.set('Content-Type', 'application/json; charset=utf-8'); return new Response(request.method === 'HEAD' || status === 304 ? null : JSON.stringify(value), {status, headers}); };
  const fail = (error, text, status = 503) => reply({error, text, now}, status);
  if (!old && !url.pathname.startsWith(prefix)) return fail('not_found', '没有这个接口', 404);
  if (request.method === 'OPTIONS') return new Response(null, {status: 204, headers});
  if (!['GET', 'HEAD'].includes(request.method)) return fail('method', '只接受读取', 405);
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), old ? 6000 : 10000);
  let connection = 'unreachable';
  try {
    const query = old ? new URLSearchParams([...url.searchParams].filter(([k,v]) => k === 'view' && v === 'cockpit' || k === 'refresh' && v === '1')) : url.searchParams;
    const target = old ? '/computer-access/api/status' : url.pathname;
    const upstream = await fetch((env.LIVE_ORIGIN || 'https://mcp.wly0829.cn') + target + (String(query) ? '?' + query : ''), {
      method: old ? 'GET' : request.method, headers: {Accept: 'application/json', 'Accept-Encoding': 'identity', ...(validDevice ? {'X-Cockpit-Device': device} : {}), ...(request.headers.has('If-None-Match') ? {'If-None-Match': request.headers.get('If-None-Match')} : {})}, signal: controller.signal, redirect: 'manual', cache: 'no-store'});
    if (!old && upstream.status >= 500) {
      const preserve503 = upstream.status === 503 && (request.method === 'HEAD' ||
        ['live_public_paused', 'live_publication_revoked', 'live_detail_unavailable'].includes((await upstream.clone().json().catch(() => null))?.error));
      if (!preserve503) {
        if ([500, 503].includes(upstream.status)) connection = 'service';
        await upstream.body?.cancel(); throw Error('origin');
      }
    }
    const empty = request.method === 'HEAD' || [101, 103, 204, 205, 304].includes(upstream.status);
    if (empty) await upstream.body?.cancel();
    const body = empty ? null : old ? upstream.body : await upstream.arrayBuffer();
    for (const key of ['Content-Type', 'ETag', 'Date']) if (upstream.headers.has(key)) headers.set(key, upstream.headers.get(key));
    return new Response(body, {status: upstream.status, headers});
  } catch { if (old) return new Response('Upstream unavailable', {status: 504, headers}); }
  finally { clearTimeout(timer); }
  headers.set('X-Live-Connection', connection);
  try {
    const query = new URLSearchParams(url.searchParams);
    query.delete('refresh');
    query.delete('opened');
    const variant = String(query);
    const resource = url.pathname.slice(prefix.length) + (variant ? '?' + variant : '');
    const {at, audience} = await cloudSnapshot(resource);
    headers.set('X-Live-Source', 'oss');
    headers.set('X-Live-Fallback-Policy', FALLBACK_POLICY);
    headers.set('X-Live-Fallback-Audience', audience);
    headers.set('ETag', `"live-fallback-${audience}"`);
    return reply({error: 'snapshot_metadata_only', at, now}, 503);
  } catch { return fail('snapshot_unavailable', '云端还没有最后一份'); }
}
