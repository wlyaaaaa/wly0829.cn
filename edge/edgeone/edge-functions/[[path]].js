const prefix = '/computer-access/live/v1/';
const origins = new Set(['https://wly0829.cn', 'https://www.wly0829.cn']);
const OSS_FALLBACK_URL = 'https://wly0829-img-media-shanghai.cn-shanghai.oss.aliyuncs.com/live/v1/fallback.json';
const FALLBACK_POLICY = 'policy-11'; // Same generation as the PCConfig exporter and live client.
const stamp = value => typeof value === 'string' && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null;
async function transformBytes(stream, bytes) {
  const writer = stream.writable.getWriter(), reader = stream.readable.getReader();
  const reading = async () => {
    const chunks = []; let length = 0;
    for (;;) {
      const {done, value} = await reader.read();
      if (done) break;
      const chunk = ArrayBuffer.isView(value) ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength) : new Uint8Array(value);
      chunks.push(chunk); length += chunk.byteLength;
    }
    const result = new Uint8Array(length); let offset = 0;
    for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.byteLength; }
    return result;
  };
  const writing = async () => { await writer.write(bytes); await writer.close(); };
  const [body] = await Promise.all([reading(), writing()]);
  return body;
}
const gunzip = bytes => transformBytes(new DecompressionStream('gzip'), bytes);

function acceptsGzip(header) {
  const weights = new Map();
  for (const item of (header || '').toLowerCase().split(',')) {
    const [encoding, ...params] = item.split(';').map(part => part.trim());
    let weight = 1;
    for (const param of params) {
      const [key, value] = param.split('=');
      if (key.trim() === 'q') weight = Number(value);
    }
    weights.set(encoding, weight > 0 && weight <= 1);
  }
  return weights.get('gzip') ?? weights.get('*') ?? false;
}

async function cloudSnapshot(resource) {
  // The fixed OSS address cannot prove that its audience is still current.
  // OSS 上这份按 gzip 存，不管请求头一律回压缩字节（Content-Encoding: gzip）；运行时没替我们解压时开头是 1f 8b，自己解（M817）。
  // 限时用 AbortController：EdgeOne 运行时文档只列了它和 AbortSignal.abort()，没列 AbortSignal.timeout()。
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 5000);
  let bytes, modified;
  try {
    const response = await fetch(OSS_FALLBACK_URL, {cache: 'no-store', signal: controller.signal});
    if (!response.ok) throw Error('snapshot');
    modified = response.headers.get('Last-Modified');
    bytes = new Uint8Array(await response.arrayBuffer());
  } finally { clearTimeout(timer); }
  const value = JSON.parse(new TextDecoder().decode(bytes[0] === 0x1f && bytes[1] === 0x8b ? await gunzip(bytes) : bytes)), proof = value?.publication;
  // 代号沿用 policy-11；有没有正文看 metadata_only：true 只有时刻（旧包），false 每块带访客版正文（后台 11-25 06:56）。
  if (typeof value?.metadata_only !== 'boolean' || proof?.policy !== FALLBACK_POLICY ||
      typeof proof.audience !== 'string' || !/^[a-f0-9]{64}$/.test(proof.audience) || !stamp(value.at)) throw Error('snapshot');
  const block = value.resources?.[resource], at = stamp(block?.at);
  // 带正文的包：这一块和整包同一代（块序号一样）、身份是访客、正文是非空对象，才当访客回包交给浏览器；别的照旧只给时刻。
  const packet = value.metadata_only === false && at && block.seq === value.seq && block.viewer?.kind === 'public' &&
    block.data && typeof block.data === 'object' && !Array.isArray(block.data) && Object.keys(block.data).length
    ? {v: 1, seq: block.seq, at, viewer: {kind: 'public'}, data: block.data} : null;
  // 关机标记：电脑正常关机时最后写的那份带 host_off_at，且和整包时刻一样；Last-Modified 是云端收到这份的时刻（后台 43fef13ec）。
  const instant = Date.now(), received = Date.parse(modified);
  const hostOff = value.v === 1 && Number.isInteger(value.seq) && value.host_off_at === value.at && Date.parse(value.at) <= instant;
  return {at, audience: proof.audience, packet, hostOffAt: hostOff ? new Date(value.at).toISOString() : null,
    lastSeen: Number.isFinite(received) && received <= instant ? new Date(received).toISOString() : null};
}
export default async function onRequest({request, env = {}}) {
  const url = new URL(request.url), old = url.pathname === '/computer-access/state';
  const instant = Date.now(), now = new Date(instant).toISOString(), device = request.headers.get('X-Cockpit-Device') || '';
  const validDevice = /^[A-Za-z0-9_-]{43}$/.test(device);
  const headers = new Headers({'Cache-Control': 'no-store', Vary: old ? 'Origin, Accept-Encoding, X-Cockpit-Device' : 'X-Cockpit-Device, Origin, Accept-Encoding', Date: new Date(instant).toUTCString()});
  headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS'); headers.set('Access-Control-Allow-Headers', 'X-Cockpit-Device, If-None-Match');
  headers.set('Access-Control-Expose-Headers', 'ETag, Date, X-Live-Source, X-Live-Fallback-Policy, X-Live-Fallback-Audience, X-Live-Fallback-At, X-Live-Connection, X-Live-Offline-Since, X-Live-Last-Seen'); headers.set('Access-Control-Max-Age', '86400');
  if (origins.has(request.headers.get('Origin'))) { headers.set('Access-Control-Allow-Origin', request.headers.get('Origin')); headers.set('Access-Control-Allow-Credentials', 'true'); }
  const reply = (value, status = 200) => { headers.set('Content-Type', 'application/json; charset=utf-8'); return new Response(request.method === 'HEAD' || status === 304 ? null : JSON.stringify(value), {status, headers}); };
  const fail = (error, text, status = 503) => reply({error, text, now}, status);
  if (!old && !url.pathname.startsWith(prefix)) return fail('not_found', '没有这个接口', 404);
  if (request.method === 'OPTIONS') return new Response(null, {status: 204, headers});
  if (!['GET', 'HEAD'].includes(request.method)) return fail('method', '只接受读取', 405);
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), old ? 6000 : 10000);
  let connection = 'unreachable';
  try {
    let query = url.searchParams;
    if (old) {
      query = new URLSearchParams();
      if (url.searchParams.get('view') === 'cockpit') query.set('view', 'cockpit');
      if (url.searchParams.get('refresh') === '1') query.set('refresh', '1');
    }
    const target = old ? '/computer-access/api/status' : url.pathname, match = request.headers.get('If-None-Match');
    // 新接口回源要 gzip：隧道里少传四五倍，回源那层也不再因替我们解压把 ETag 改成弱标签。
    // If-None-Match 按标准做弱比较，去掉 W/ 再交给源站（源站只认原样的标签）。
    const upstream = await fetch((env.LIVE_ORIGIN || 'https://mcp.wly0829.cn') + target + (String(query) ? '?' + query : ''), {
      method: old ? 'GET' : request.method, headers: {Accept: 'application/json', 'Accept-Encoding': old ? 'identity' : 'gzip', ...(validDevice ? {'X-Cockpit-Device': device} : {}), ...(match ? {'If-None-Match': old ? match : match.replace(/W\//g, '')} : {})}, signal: controller.signal, redirect: 'manual', cache: 'no-store'});
    const empty = request.method === 'HEAD' || [101, 103, 204, 205, 304].includes(upstream.status);
    if (empty) await upstream.body?.cancel();
    // 新接口照旧读整包（10 秒内读不全才能改回云端备用包）。运行时通常已替我们解压；开头仍是 gzip 的 1f 8b 就原样转给浏览器并标上 gzip。
    const bytes = empty || old ? null : new Uint8Array(await upstream.arrayBuffer());
    const gzipBytes = bytes?.[0] === 0x1f && bytes[1] === 0x8b;
    const packed = gzipBytes && /gzip/i.test(upstream.headers.get('Content-Encoding') || '');
    if (!old && upstream.status >= 500) {
      const plain = async () => JSON.parse(new TextDecoder().decode(packed ? await gunzip(bytes) : bytes));
      // 源站答了、只是这一项读不到（live_source_unavailable、live_variant_unavailable）也原样转：浏览器按“在线、这一项暂时读不到”显示，不当整个服务掉线（M813）。
      const preserve503 = upstream.status === 503 && (request.method === 'HEAD' ||
        ['live_public_paused', 'live_publication_revoked', 'live_detail_unavailable', 'live_source_unavailable', 'live_variant_unavailable']
          .includes((bytes && await plain().catch(() => null))?.error));
      if (!preserve503) {
        if ([500, 503].includes(upstream.status)) connection = 'service';
        throw Error('origin');
      }
    }
    let body = empty ? null : old ? upstream.body : bytes;
    for (const key of ['Content-Type', 'ETag', 'Date']) if (upstream.headers.has(key)) headers.set(key, upstream.headers.get(key));
    const encoding = request.headers.get('Accept-Encoding'), gzip = acceptsGzip(encoding);
    let codec = gzip ? 'not-encoded' : encoding === null ? 'no-accept-encoding' : 'identity-requested';
    if (packed && encoding !== null && !gzip) body = await gunzip(bytes);
    else if (packed) headers.set('Content-Encoding', 'gzip');
    else if (!gzipBytes && bytes?.length && gzip && upstream.status === 200 &&
             /^application\/json(?:\s*;|$)/i.test(headers.get('Content-Type') || '')) {
      let phase = 'constructor';
      try {
        const stream = new CompressionStream('gzip');
        phase = 'stream';
        body = await transformBytes(stream, bytes);
        headers.set('Content-Encoding', 'gzip');
      } catch {
        // Keep the readable upstream response if local encoding fails.
        codec = typeof CompressionStream === 'function' ? 'encoder-' + phase + '-error' : 'encoder-unavailable';
      }
    }
    if (!old && !empty && upstream.status === 200) headers.set('X-Live-Compression', headers.has('Content-Encoding') ? 'gzip' : codec);
    return new Response(body, {status: upstream.status, headers});
  } catch { if (old) return new Response('Upstream unavailable', {status: 504, headers}); }
  finally { clearTimeout(timer); }
  headers.set('X-Live-Connection', connection);
  try {
    const query = new URLSearchParams(url.searchParams);
    query.delete('refresh');
    query.delete('opened');
    query.sort(); // 包里的资源键和浏览器一样按参数名排好
    const variant = String(query);
    const resource = url.pathname.slice(prefix.length) + (variant ? '?' + variant : '');
    const {at, audience, packet, hostOffAt, lastSeen} = await cloudSnapshot(resource);
    if (lastSeen) headers.set('X-Live-Last-Seen', lastSeen);
    if (hostOffAt && connection === 'unreachable') {
      headers.set('X-Live-Connection', 'host-off');
      headers.set('X-Live-Offline-Since', hostOffAt);
    }
    headers.set('X-Live-Source', 'oss');
    headers.set('X-Live-Fallback-Policy', FALLBACK_POLICY);
    headers.set('X-Live-Fallback-Audience', audience);
    headers.set('ETag', `"live-fallback-${audience}"`);
    // 浏览器只在确认关机时才用这份正文（本人 11-24 20:34）；这里照样回 503，不当在线读数。
    if (packet) { headers.set('X-Live-Fallback-At', packet.at); return reply({error: 'snapshot_content', ...packet, now}, 503); }
    return reply({error: 'snapshot_metadata_only', at, now}, 503);
  } catch { return fail('snapshot_unavailable', '云端还没有最后一份'); }
}
