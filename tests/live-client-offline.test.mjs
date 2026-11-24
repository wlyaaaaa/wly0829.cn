import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source = readFileSync(new URL('../site-v2/live/_lib/live-client.js', import.meta.url), 'utf8');

test('LAN reader is only selected for a direct unpaired owner view', () => {
  for (const [origin, publicMode, token, resource, expected] of [
    ['http://192.168.31.235:8829', false, '', 'screen', 'http://192.168.31.235:18829/__live/screen'],
    ['http://192.168.31.235:8829', true,  '', 'screen', '/__live/screen'],
    ['http://192.168.31.235:8829', false, 'A'.repeat(43), 'screen', '/__live/screen'],
    ['http://192.168.31.235:8829', false, '', 'access', '/__live/access'],
    ['https://tailnet.invalid:8829', false, '', 'screen', '/__live/screen'],
  ]) {
    const doc = {querySelector: () => ({content: '18829'}), addEventListener() {}};
    const view = {isPublic: () => publicMode, headers: value => value ? {'X-Cockpit-Device': value} : {}};
    const sandbox = {window: {LiveView: view}, location: new URL(origin + '/live/'), document: doc,
      localStorage: {getItem() {return null;}, setItem() {}}, URLSearchParams, Intl, Date, AbortSignal, setTimeout, clearTimeout};
    vm.runInNewContext(source, sandbox);
    const target = sandbox.window.Live.readRequest(resource, token);
    assert.equal(target.url, expected);
    if (target.lan) { assert.equal(target.credentials, 'omit'); assert.equal(Object.keys(target.headers).length, 0); }
  }
});

test('only live pages follow the public selection; home and computer connection read as the owner (M518)', () => {
  const device = 'A'.repeat(43);
  for (const [url, resource, expected, expectedHeader, owner] of [
    ['http://192.168.31.235:8829/live/', 'home', '/__live/home', 'public', false],
    ['http://192.168.31.235:8829/', 'screen', 'http://192.168.31.235:18829/__live/screen', undefined, true],
    ['http://192.168.31.235:8829/mcp/', 'connect', 'http://192.168.31.235:18829/__live/connect', undefined, true],
    ['https://wly0829.cn/mcp/', 'connect', 'https://live.wly0829.cn/computer-access/live/v1/connect', undefined, true],
  ]) {
    const window = {sessionStorage: {getItem: key => key === 'wly-live-view' ? 'public' : null}};
    vm.runInNewContext(source, {window, location: new URL(url), document: {
      querySelector: () => ({content: '18829'}), addEventListener() {},
    }, URLSearchParams, Intl, Date, AbortSignal, setTimeout, clearTimeout});
    const target = window.Live.readRequest(resource, '');
    assert.equal(target.url, expected);
    assert.equal(target.headers['X-Wly-View'], expectedHeader);
    assert.equal(window.Live.readRequest(resource, device).headers['X-Cockpit-Device'], owner ? device : undefined);
  }
});

test('conversation wait labels require an explicit visible waiting state', () => {
  const ui = readFileSync(new URL('../site-v2/live/_lib/live-ui.js', import.meta.url), 'utf8');
  const window = {}, document = {documentElement: {childNodes: []}, addEventListener() {}, getElementById: () => null};
  vm.runInNewContext(ui, {window, document, location: {pathname: '/'}, Node: {TEXT_NODE: 3, ELEMENT_NODE: 1},
    matchMedia: () => ({}), MutationObserver: class {observe() {}}});
  const label = window.LiveUI.chatWaitLabel, waiting = {state: 'waiting'};
  for (const kind of ['owner', 'public']) {
    assert.equal(label({...waiting, wait_kind: 'tool'}, kind), '在提问');
    assert.equal(label({...waiting, wait_kind: 'final'}, kind), kind === 'owner' ? '等你回答' : '等本人回答');
    assert.equal(label({...waiting, text: 'asking'}, kind), '');
    assert.equal(label({...waiting, wait_kind: 'other'}, kind), '');
    assert.equal(label({state: 'running', wait_kind: 'tool'}, kind), '');
  }
  assert.equal(label({...waiting, wait_kind: 'tool', visibility: 'owner'}, 'public'), '');
  assert.equal(label({...waiting, wait_kind: 'tool', visibility: 'pending'}, 'public'), '');
  assert.equal(label({...waiting, wait_kind: 'tool', visibility: 'owner'}, 'owner'), '在提问');
  const progress = window.LiveUI.chatProgressText, question = {...waiting, wait_kind: 'tool'};
  assert.equal(progress('asking', question, 'owner'), '在提问');
  const rewritten = progress({text: 'asking', visibility: 'rewritten'}, question, 'public');
  assert.equal(rewritten.text, '在提问');
  assert.equal(rewritten.visibility, 'rewritten');
  assert.equal(progress('asking', {...waiting, wait_kind: 'final'}, 'owner'), 'asking');
  assert.equal(progress('asking about timing', question, 'owner'), 'asking about timing');
  assert.equal(progress('asking', {...question, visibility: 'owner'}, 'public'), 'asking');
});

test('offline owner copy uses the displayed generation and Beijing date', async () => {
  for (const [now, at, expected] of [['2026-11-15T22:16:00Z', '2026-11-15T22:14:00Z', '06:14'], ['2026-11-15T16:01:00Z', '2026-11-15T14:40:00Z', '11-15 22:40']]) {
    let packet = {v: 1, seq: 2, rev: 'new', at, now, data: {screen: {}}, viewer: {kind: 'owner', device: 'ok'}, link: {state: 'online', basis: 'response'}};
    let broken = false;
    const waits = [], lapse = () => waits.splice(0).forEach(fn => fn());
    const sandbox = {window: {}, location: new URL('https://example.test/live/'), URLSearchParams, Intl, Date, AbortSignal, clearTimeout,
      setTimeout: (fn, ms) => ms === 10000 ? (waits.push(fn), 0) : setTimeout(fn, ms),
      document: {addEventListener() {}}, localStorage: {getItem() {return null;}, setItem() {}, removeItem() {}},
      fetch: async () => {if (broken) throw Error('network'); return {ok: true, status: 200, headers: new Headers(), json: async () => packet};}};
    vm.runInNewContext(source, sandbox); const client = sandbox.window.Live;
    await client.get('home');
    packet = {...packet, seq: 1, rev: 'old', at: '2026-11-14T00:00:00Z', data: {screen: {old: true}},
      link: {state: 'offline', basis: 'heartbeat', heartbeat: 'live', text: '电脑不在线 · 数据截止 11-14 08:00'}};
    const state = await client.get('home');
    assert.equal(state.text, `连不上电脑 · 下面是 ${expected} 的数据。`); assert.equal(state.shownAt, at);
    assert.equal(state.meta.seq, 2); assert.equal(state.data.screen.old, undefined);
    broken = true;
    // 读不到新的：10 秒内照旧；满 10 秒仍按后台最后说的（连不上电脑），只标上是几点的数（M587、M588）
    assert.equal((await client.get('home')).text, `连不上电脑 · 下面是 ${expected} 的数据。`);
    lapse();
    const slow = await client.get('home');
    assert.equal(slow.text, `连不上电脑 · 下面是 ${expected} 的数据。`);
  }
});

test('offline screen retains proven readings, and a rejected device drops its owner copy', async () => {
  const at = '2026-11-19T00:00:00Z', viewer = {kind: 'owner', device: 'ok'};
  const stored = new Map([['wly-cockpit-device', 'a'.repeat(43)]]);
  const localStorage = {get length() {return stored.size;}, key: i => [...stored.keys()][i], getItem: key => stored.get(key),
    setItem: (key, value) => stored.set(key, value), removeItem: key => stored.delete(key)};
  const packet = (cells, rev) => Response.json({at, now: at, viewer, rev, seq: rev, data: {cells}});
  let reply = () => packet([{id: 'need', n: 0}, {id: 'computer', cpu_c: 52, uptime: 3600}], 1);
  const waits = [], lapse = () => waits.splice(0).forEach(fn => fn());
  const sandbox = {window: {}, location: new URL('https://example.test/'), URLSearchParams, Intl, Date, AbortSignal,
    setTimeout: (fn, ms) => ms === 10000 ? (waits.push(fn), 0) : setTimeout(fn, ms), clearTimeout, document: {addEventListener() {}}, localStorage, fetch: async () => reply()};
  vm.runInNewContext(source, sandbox);
  const read = () => sandbox.window.Live.get('screen');
  await read();
  reply = () => packet([{id: 'need', n: null}], 2); await read();
  reply = () => Response.json({}, {status: 503});
  assert.equal((await read()).offline, false);
  lapse();
  // 主数据 10 秒没到、已经画出来了：不挂连不上，标上是几点的数（M587、M588）
  const slow = await read();
  assert.equal(slow.offline, false); assert.equal(slow.fallbackNote, '这是 08:00 的数，这次刷新慢了，正在重读。');
  // 浏览器真断网才挂连不上，副屏照旧拼上读到过的读数
  sandbox.navigator = {onLine: false};
  reply = () => Promise.reject(new TypeError('offline'));
  const old = await read();
  delete sandbox.navigator;
  assert.equal(old.text, '当前设备未连接网络 · 下面是 08:00 的数据。');
  assert.equal(old.data.cells.find(c => c.id === 'computer').cpu_c, 52);
  assert.equal(old.data.cells.find(c => c.id === 'need').n, 0);
  reply = () => Response.json({error: 'snapshot_metadata_only', at}, {status: 503, headers: {
    'X-Live-Source': 'oss', 'X-Live-Fallback-Policy': 'policy-10', 'X-Live-Fallback-Audience': 'a'.repeat(64)
  }});
  const reopened = {...sandbox, window: {}};
  vm.runInNewContext(source, reopened);
  await reopened.window.Live.get('screen'); lapse();
  const edge = await reopened.window.Live.get('screen');
  assert.equal(edge.viewer.kind, 'owner');
  assert.equal(edge.data.cells.find(c => c.id === 'computer').cpu_c, 52);
  reply = () => Response.json({at, seq: 3, rev: 'public', viewer: {kind: 'public', device: 'invalid'}, data: {cells: []}},
    {headers: {'X-Wly-Preview-View': 'owner'}});
  const rejected = await read();
  assert.match(rejected.pageText, /配对已失效，正在显示公开版/);
  assert.equal(rejected.offline, false); assert.equal(rejected.data.cells.length, 0);
  assert.equal([...stored.keys()].some(key => key.endsWith(':owner:screen')), false);
  reply = () => packet([{id: 'need', n: 3}], 3);
  const recovered = await read();
  assert.equal(recovered.pageText, ''); assert.equal(recovered.data.cells[0].n, 3);
});

test('owner originals stay in the current page, and opening the client removes old copies', async () => {
  const at = new Date().toISOString(), viewer = {kind: 'owner', device: 'ok'};
  const stored = new Map([['wly-cockpit-device', 'a'.repeat(43)]]);
  const localStorage = {get length() {return stored.size;}, key: i => [...stored.keys()][i], getItem: key => stored.get(key),
    setItem: (key, value) => stored.set(key, value), removeItem: key => stored.delete(key)};
  const packet = title => ({at, now: at, viewer, seq: 1, rev: 'synthetic', data: {title}});
  let online = true, title = 'ordinary synthetic reading';
  function open(query = '') {
    const window = {};
    vm.runInNewContext(source, {window, location: new URL('https://wly0829.cn/live/chat/' + query),
      localStorage, document: {addEventListener() {}}, performance: {getEntriesByType: () => [{type: 'back_forward'}]},
      URLSearchParams, Intl, Date, AbortSignal, setTimeout: () => 0, clearTimeout() {},
      fetch: async (_, init) => {
        assert.equal(init.cache, 'no-store');
        if (!online) throw Error('synthetic offline');
        return Response.json(packet(title), {headers: {'Cache-Control': 'private, no-store'}});
      }});
    return window.Live;
  }
  const initial = open();
  const kept = ['home', 'items/closed', 'projects/changes'];
  for (const resource of kept) await initial.get(resource);
  const key = [...stored.keys()].find(k => k.endsWith(':owner:home')).replace(/home$/, '');
  const originals = ['chats/sample', 'items/sample', 'reports/sample', 'projects/sample/records'];
  for (const resource of originals) stored.set(key + resource + '?view=sample', JSON.stringify(packet('old original text')));

  online = false;
  const live = open();
  for (const resource of originals) assert.equal((await live.get(resource, 'view=sample')).data, null);
  assert.ok(originals.every(resource => !stored.has(key + resource + '?view=sample')));
  assert.ok(kept.every(resource => stored.has(key + resource)));

  online = true;
  title = 'current original text';
  for (const resource of originals) assert.equal((await live.get(resource, 'view=sample')).data.title, title);
  assert.ok([...stored.values()].every(value => !value.includes(title)));
  online = false;
  assert.equal((await live.get('chats/sample', 'view=sample')).data.title, title);
  assert.equal((await open().get('chats/sample', 'view=sample')).data, null);

  online = true;
  title = 'illustrative fixture only';
  await open('?fixture=sample').get('chats/sample');
  online = false;
  assert.equal((await open('?fixture=sample').get('chats/sample')).data.title, title);
});

test('a visitor offline copy exposes only metadata and a public pause clears the view', async () => {
  const at = new Date().toISOString(), viewer = {kind: 'public', device: 'none'};
  const packet = {seq: 1, rev: 'one', at, data: {text: 'old'}, viewer};
  const normal = 'wly-live-v2:net:none:public:', forced = 'wly-live-v2:net:public:none:public:';
  const owner = 'wly-live-v2:net:none:owner:home', token = 'wly-cockpit-device';
  const stored = new Map([[normal+'home', JSON.stringify(packet)], [forced+'policy-9:home', JSON.stringify(packet)], [normal+'policy-9:home', JSON.stringify(packet)], [owner, 'owner'], [token, 'example']]);
  const localStorage = {get length() {return stored.size;}, key: i => [...stored.keys()][i],
    getItem: key => stored.get(key), setItem: (key, value) => stored.set(key, value), removeItem: key => stored.delete(key)};
  const audience = 'a'.repeat(64);
  let paused = false, offline = false, fallbackRead, packagedPolicy = 'policy-9';
  const waits = [], lapse = () => waits.splice(0).forEach(fn => fn());
  const requested = [];
  const sandbox = {window: {}, location: new URL('https://wly0829.cn/live/'), URLSearchParams, Intl, Date, AbortSignal, clearTimeout,
    setTimeout(fn, ms) { if (ms === 15000) fallbackRead = fn; if (ms === 10000) waits.push(fn); return 0; },
    setInterval: () => 0, document: {addEventListener() {}}, localStorage,
    fetch: async url => {
      requested.push(url);
      if (url === '/release-identity.json') {
        return Response.json({live_fallback: {origin: 'https://assets.example.test', key: packagedPolicy + '.json'}});
      }
      if (url === 'https://assets.example.test/' + packagedPolicy + '.json') {
        const saved = {...packet, data: {text: packagedPolicy}};
        return Response.json({at, publication: {policy: packagedPolicy, audience}, metadata_only: true,
          resources: {projects: saved, tasks: saved}});
      }
      if (paused) return Response.json({error: 'live_public_paused'}, {status: 503});
      if (!offline) return Response.json({...packet, data: {text: 'safe'}});
      if (url.endsWith('/projects')) {
        return Response.json({...packet, data: {text: 'stale-edge-body'}},
          {headers: {'X-Live-Source': 'oss', 'X-Live-Fallback-Policy': 'policy-10'}});
      }
      return Response.json({error: 'snapshot_metadata_only', at, data: {text: 'stale-edge-body'}}, {status: 503,
        headers: {'X-Live-Source': 'oss', 'X-Live-Fallback-Policy': 'policy-10', 'X-Live-Fallback-Audience': audience}});
    }};
  vm.runInNewContext(source, sandbox);
  const client = sandbox.window.Live, shown = [];
  client.watch('home', null, {data: data => shown.push(data?.text)});
  assert.equal((await client.get('home')).data.text, 'safe');
  assert.deepEqual(shown, ['safe']);
  assert.equal(requested[0], 'https://live.wly0829.cn/computer-access/live/v1/home');
  assert.equal([...stored.keys()].filter(key => key.startsWith(normal) || key.startsWith(forced)).length, 0);
  offline = true;
  // 本页主数据（home）等满 10 秒还没有新的：已经画出来的访客数据留着，标上是几点的数，不算连不上（M587、M588）
  await client.get('home'); lapse();
  const slow = await client.get('home');
  assert.equal(slow.data.text, 'safe'); assert.equal(slow.offline, false); assert.match(slow.fallbackNote, /这次刷新慢了，正在重读/);
  // 浏览器真断网才算整页连不上：已经显示的访客数据留着、标上是几点的（本人 R12，M741）；没读到过的只用备用包的元数据
  sandbox.navigator = {onLine: false};
  await client.get('home');
  assert.equal((await client.get('projects')).data, null);
  await fallbackRead();
  assert.equal((await client.get('projects')).meta.at, null);
  packagedPolicy = 'policy-10';
  assert.equal((await client.get('projects')).data, null);
  await fallbackRead();
  const packaged = await client.get('projects');
  assert.equal(packaged.data, null);
  assert.equal(packaged.meta.rev, 'metadata-' + audience);
  assert.ok(requested.includes('https://assets.example.test/policy-9.json'));
  assert.ok(requested.includes('https://assets.example.test/policy-10.json'));
  const edge = await client.get('home');
  assert.equal(edge.offline, true); assert.equal(edge.data.text, 'safe');
  assert.match(edge.text, / · 下面是 .+ 的数据。$/);
  assert.deepEqual(shown, ['safe']);
  paused = true;
  assert.equal((await client.get('home')).publicPaused, true);
  assert.deepEqual([stored.get(owner), stored.get(token)], ['owner', 'example']);
});

test('authority clears a withdrawn detail and never fills it from a saved public body', async () => {
  const at = new Date().toISOString(), storage = new Map();
  const localStorage = {get length() {return storage.size;}, key: i => [...storage.keys()][i],
    getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key)};
  const publicPacket = {at, now: at, seq: 8, rev: 'open', viewer: {kind: 'public'}, data: {title: 'synthetic title'}};
  let response = () => Response.json(publicPacket), requested = [];
  const sandbox = {window: {}, location: new URL('https://wly0829.cn/live/chat/?id=example'),
    localStorage, document: {addEventListener() {}}, URLSearchParams, Intl, Date, AbortSignal,
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, fetch: async url => {requested.push(url); return response();}};
  vm.runInNewContext(source, sandbox);
  const client = sandbox.window.Live, shown = [];
  client.watch('chats/example', null, {data: value => shown.push(value?.title ?? null)});
  await client.get('chats/example');
  response = () => Response.json({error: 'live_detail_unavailable'}, {status: 503});
  const warming = await client.get('chats/example');
  assert.equal(warming.meta.withdrawn, false);
  assert.equal(warming.data.title, 'synthetic title');
  response = () => Response.json({error: 'live_missing'}, {status: 404});
  const gone = await client.get('chats/example');
  assert.equal(gone.meta.withdrawn, true);
  assert.equal(gone.phase, 'none');
  assert.equal(gone.data, null);
  assert.equal([...storage.values()].some(value => value.includes('synthetic title')), false);
  assert.deepEqual(shown, ['synthetic title', null]);
  response = () => Response.json(publicPacket);
  await client.get('chats/example');
  response = () => Response.json({error: 'live_publication_revoked'}, {status: 503});
  assert.equal((await client.get('home')).meta.withdrawn, true);
  assert.deepEqual(shown, ['synthetic title', null, 'synthetic title', null]);
  assert.equal(requested.filter(url => !url.startsWith('/release-identity.json')).every(url => url.startsWith('https://live.wly0829.cn/')), true);
});

test('an offline public preview cannot paint previous task names or conversation text', async () => {
  const at = new Date().toISOString(), viewer = {kind: 'public', device: 'none'};
  const packet = (name, seq = 39) => ({seq, rev: String(seq), at, now: at, data: {name}, viewer});
  const locations = ['tasks', 'tasks?group=backup&scope=scheduled', 'tasks?scope=automation', 'tasks/fixture',
    'chats', 'chats?window=72h', 'chats?window=30d', 'chats/fixture', 'home', 'home?project=fixture'];
  const prefixes = ['wly-live-v2:net:public:none:public:policy-9:names-v2:', 'wly-live-v2:net:none:public:policy-9:names-v2:'];
  const old = prefixes.flatMap(prefix => locations.map(path => prefix + path));
  const owner = 'wly-live-v2:net:none:owner:tasks/fixture', fixture = 'wly-live-v2:fixture:demo:none:public:home';
  const paired = 'wly-cockpit-device';
  const stored = new Map([...old.map(key => [key, JSON.stringify(packet('old name'))]),
    [owner, 'owner task'], [fixture, 'illustrative data'], [paired, 'synthetic device registration']]);
  const localStorage = {get length() {return stored.size;}, key: i => [...stored.keys()][i], getItem: key => stored.get(key),
    setItem: (key, data) => stored.set(key, data), removeItem: key => stored.delete(key)};
  const window = {sessionStorage: {getItem: () => 'public'}}, outputs = [];
  let online = false;
  vm.runInNewContext(source, {window, localStorage, location: new URL('http://localhost:8829/live/tasks/'),
    document: {hidden: false, addEventListener() {}}, URLSearchParams, Intl, Date, AbortSignal, setTimeout: () => 0, clearTimeout,
    setInterval: () => 0, fetch: async () => {
      if (!online) throw Error('fixture offline');
      return Response.json(packet('reviewed task', 40));
    }});
  const client = window.Live, scheduled = {scope: 'scheduled', group: 'backup'};
  client.watch('tasks', scheduled, {data: data => outputs.push(data?.name)});
  for (const entry of locations) {
    const [resource, query] = entry.split('?');
    assert.equal((await client.get(resource, query)).data, null, entry);
  }
  assert.deepEqual(outputs, []);
  assert.equal(old.some(key => stored.has(key)), false);
  assert.deepEqual([stored.get(owner), stored.get(fixture), stored.get(paired)], ['owner task', 'illustrative data', 'synthetic device registration']);
  online = true;
  assert.equal((await client.get('tasks', scheduled)).data.name, 'reviewed task');
  assert.deepEqual(outputs, ['reviewed task']);
});

test('a public pause supersedes a project reading received before its artwork is ready', async () => {
  const at = new Date().toISOString();
  const sandbox = {window: {}, location: new URL('https://example.test/live/projects/'), URLSearchParams, Intl, Date,
    AbortSignal, setTimeout, clearTimeout, setInterval: () => 1, clearInterval() {},
    document: {addEventListener() {}}, localStorage: {getItem() {return null;}, setItem() {}, removeItem() {}},
    fetch: async url => {
      const paused = url.endsWith('projects');
      return {ok: !paused, status: paused ? 503 : 200, headers: new Headers(), json: async () =>
        paused ? {error: 'live_public_paused'} : {at, seq: 1, rev: 'one', viewer: {kind: 'public'}, data: {name: '项目'}}};
    }};
  vm.runInNewContext(source, sandbox);
  const client = sandbox.window.Live, shown = [];
  let ready;
  const artwork = new Promise(resolve => { ready = resolve; });
  client.watch('home', null, client.afterReady(artwork, {data: d => shown.push(d)}));
  assert.equal((await client.get('home')).data.name, '项目');
  assert.deepEqual(shown, []);
  assert.equal((await client.get('projects')).publicPaused, true);
  ready();
  await artwork;
  assert.deepEqual(shown, [null]);
});

test('home waits for current public data and honors a pause during navigation', async () => {
  const at = new Date().toISOString(), token = 'a'.repeat(43), stored = new Map([['wly-cockpit-device', token]]);
  const localStorage = {get length() {return stored.size;}, key: i => [...stored.keys()][i],
    getItem: key => stored.get(key), setItem: (key, value) => stored.set(key, value), removeItem: key => stored.delete(key)};
  const response = (status, body) => ({status, ok: status === 200, headers: new Headers(), json: async () => body});
  const packet = (kind, project, seq = 1) => ({at, seq, rev: String(seq), data: {text: kind + ' ' + project}, viewer: {kind, device: 'none'}});
  function page(kind, fetch) {
    const view = {isPublic: () => kind === 'public', owner() {},
      headers: token => ({'X-Wly-View': kind, ...(kind === 'owner' ? {'X-Cockpit-Device': token} : {})})};
    const sandbox = {window: {LiveView: view}, location: new URL('http://127.0.0.1/live/'), localStorage,
      URLSearchParams, Intl, Date, AbortSignal, setTimeout, clearTimeout, setInterval: () => 1, clearInterval() {},
      document: {addEventListener() {}}, fetch};
    vm.runInNewContext(source, sandbox);
    return sandbox.window.Live;
  }
  const seed = kind => page(kind, async (url, {headers}) => {
    assert.equal(headers['X-Wly-View'], kind);
    assert.equal(headers['X-Cockpit-Device'], kind === 'owner' ? token : undefined);
    return response(200, packet(kind, url.match(/project=([^&]+)/)[1]));
  });
  const owner = seed('owner'), visitor = seed('public');
  await owner.get('home', {project: 'first'});
  await visitor.get('home', {project: 'first'});
  await visitor.get('home', {project: 'second'});

  const trace = [], replies = new Map();
  const client = page('public', (url, options) => {
    assert.equal(options.headers['X-Wly-View'], 'public');
    assert.equal(options.headers['X-Cockpit-Device'], undefined);
    trace.push(url);
    return new Promise(resolve => replies.set(url, resolve));
  });
  const visit = () => ({data: value => trace.push(value?.text ?? null)});
  const initial = client.watch('home', {project: 'first'}, visit());
  const first = client.get('home', {project: 'first'});
  initial.stop();
  client.watch('home', {project: 'second'}, visit());
  const second = client.get('home', {project: 'second'});
  const requests = ['/__live/home?project=first', '/__live/home?project=second'];
  assert.deepEqual(trace, requests);
  replies.get('/__live/home?project=first')(response(503, {error: 'live_public_paused'}));
  assert.equal((await first).publicPaused, true);
  replies.get('/__live/home?project=second')(response(200, packet('public', 'second', 2)));
  assert.equal((await second).publicPaused, true);
  assert.deepEqual(trace, requests);
  assert.equal([...stored.keys()].filter(key => key.includes(':owner:home?project=first')).length, 1);
  assert.equal([...stored.keys()].filter(key => key.includes(':public:home?')).length, 0);
});

test('opening an Antigravity conversation keeps device checks and shows only fixed messages', async () => {
  const token = 'a'.repeat(43), id = 'antigravity:12345678-abcd-1234-abcd-1234567890ab';
  const at = '2026-11-19T00:00:00Z', requests = [];
  let reply = {error: 'antigravity_open_unavailable', message: 'Antigravity 没有确认已切到原对话，请在主驾驶上核对。'};
  const sandbox = {window: {}, location: new URL('https://example.test/live/'), URLSearchParams, Intl, Date, setTimeout, clearTimeout,
    AbortSignal: {timeout: milliseconds => milliseconds}, document: {addEventListener() {}},
    localStorage: {getItem: key => key === 'wly-cockpit-device' ? token : null, setItem() {}},
    fetch: async (url, options) => {
      if (!url.endsWith('/cockpit/open')) return Response.json({at, seq: 1, rev: '1', viewer: {kind: 'owner', device: 'ok'}, data: {}});
      requests.push(options);
      return Response.json(reply, {status: reply.status ?? 503});
    }};
  vm.runInNewContext(source, sandbox);
  const client = sandbox.window.Live;
  assert.equal((await client.open(id, 'conversation')).text, '仅本人设备可以打开');
  assert.equal(requests.length, 0);
  await client.get('home');
  assert.equal((await client.open(null, null, {item_id: id, target: 'conversation'})).text, 'Antigravity 没有确认已切到原对话，请在台式机上核对。');
  assert.equal(requests[0].signal, 18000);
  assert.equal(requests[0].headers['X-Cockpit-Device'], token);
  assert.deepEqual(JSON.parse(requests[0].body), {item_id: id, target: 'conversation'});
  reply = {error: 'antigravity_open_busy', message: '内部路径 C:/private/title'};
  assert.equal((await client.open(id, 'conversation')).text, '台式机正在打开另一段 Antigravity 对话，请稍后重试。');
  reply = {error: 'antigravity_unknown', message: '内部路径 C:/private/title', status: 400};
  assert.equal((await client.open('item-123', 'conversation')).text, '电脑没打开，稍后再试');
  assert.equal(requests.at(-1).signal, 12000);
  reply = {...reply, status: 403};
  assert.equal((await client.open(id, 'conversation')).text, '设备已失效，没打开，请重新连接电脑');
});
