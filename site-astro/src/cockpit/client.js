// 驾驶舱浏览器端：页面一打开就是构建时那份快照画好的最终版式；这里只负责读新数据、原地换字。
// 每分钟读一次（页面在后台时不读）；刷新按钮叫醒电脑重读，等三个采集器都完成再换。
import { normalize, riverSnapshot, freshAfter } from './model.js';
import { REGIONS, Q_KEY, LF_KEY, needCount } from './render.js';
import { ACTIONS } from './actions.js';
import { copyToClipboard } from './clipboard.js';
import { createActionController } from './action-state.js';
import { SEEN_PAGES, SEEN_DWELL_MS, seenKey, trackedIds, parseSeen, serializeSeen, compare, newCss } from './seen.js';

const boot = JSON.parse(document.getElementById('cockpit-boot')?.textContent || '{}');
// 本机预览走预览脚本的转发入口，线上走 live（边缘）再退到 mcp
const local = /^(127\.0\.0\.1|localhost|\[::1\])$/.test(location.hostname);
const endpoints = (local ? boot.local : boot.endpoints) || [];
let view = normalize(boot.snapshot);
let offline = false, busy = null;
let wanted = ''; // 地址里 # 后面要找的那一条（见下面 reveal）
let asked = 0, shown = 0;
// 本人设备钥匙：只存在这台浏览器的 localStorage；读写不了就当公开版。notice 是页头的一句短提示（配对结果、授权失效）
const KEY = 'wly-cockpit-device', TOKEN = /^[A-Za-z0-9_-]{43}$/;
const PAIR_URL = 'https://mcp.wly0829.cn/computer-access/api/cockpit-device/pair';
const store = { get() { try { const t = localStorage.getItem(KEY); return TOKEN.test(t || '') ? t : null; } catch { return null; } },
  set(t) { try { localStorage.setItem(KEY, t); return true; } catch { return false; } }, drop() { try { localStorage.removeItem(KEY); localStorage.removeItem(HOME_KEY); } catch { /* 无存储 */ } } };
// 主驾驶那台电脑本机直读（PCConfig 状态服务，约 0.4 秒；live 常常握手失败、mcp 要 2.5—3 秒）。只有这台浏览器配对过、
// 上一次读到的本人版说它就是主驾驶（viewer.device_machine）时才记下、下次多发这一路；公开访客、手机、副驾驶都不发，
// 免得别的设备弹“访问本地网络”的授权框。本机预览本来就走 LOCAL 入口，不另加
const HOME_KEY = 'wly-cockpit-home', HOME_URL = 'http://127.0.0.1:18793/computer-access/api/status?view=cockpit';
const home = { on() { try { return localStorage.getItem(HOME_KEY) === '1'; } catch { return false; } },
  mark(yes) { try { if (yes) localStorage.setItem(HOME_KEY, '1'); else localStorage.removeItem(HOME_KEY); } catch { /* 无存储：下次照旧两路 */ } } };
const isHome = (v) => v?.viewer?.kind === 'owner' && v.viewer.device_kind !== 'phone' && v.viewer.device_machine === '主驾驶';
// 浏览器的“访问本地网络”权限：点过不允许（denied）就再也不发；还没问过（prompt）每次打开页面只发一次，那一路不跟着别的路取消，
// 授权框留着等本人点；本机服务没开、连不上时歇 10 分钟再试，不每分钟在控制台留一条连不上
let homeAsked = false, homeRest = 0;
async function homeWay() {
  let state = 'granted';
  for (const name of ['loopback-network', 'local-network-access']) {
    try { state = (await navigator.permissions.query({ name })).state; break; } catch { /* 这个浏览器不认这个名字 */ }
  }
  if (state === 'denied' || Date.now() < homeRest || state === 'prompt' && homeAsked) return null;
  if (state === 'prompt') homeAsked = true;
  return state;
}
let notice = '';
const say = (text, ms = 15000) => { notice = text; paint(); setTimeout(() => { if (notice === text) { notice = ''; paint(); } }, ms); };
// phase：还没收到过任何一次读取结果时是 snapshot（首帧那份构建时的数），之后是 live；读不到另由 offline 说明
// act：本人设备上点过的收起、提醒、撤回，以及未选择的提醒日期。
const act = { state: new Map(), ui: new Map(), recent: new Map() };
const ctx = () => ({ now: new Date(), viewer: view.viewer, offline, notice, phase: shown ? 'live' : 'snapshot', paired: !!store.get(), projectUrls: boot.projectUrls || {}, img: boot.img || {}, ov: window.OverviewScreen, act, since: seen.since() });

// ---- 新出现的标“新”（seen.js）：只存条目编号和时间。第一次打开不标；读到新数据后才和上次比（首帧是构建时的旧数，不拿它比）。
// 新的卡和行左边一个小绿点“新”，进视野停留一会儿（SEEN_DWELL_MS）或页面关掉／切走就算看过，下次不再标
const seen = (() => {
  const page = SEEN_PAGES[location.pathname];
  const key = page && seenKey(page);
  const load = () => { try { return parseSeen(localStorage.getItem(key)); } catch { return null; } };
  const save = (ids) => { try { localStorage.setItem(key, serializeSeen(Date.now(), ids)); } catch { /* 无存储：这次照样标，下次当第一次 */ } };
  const prev = key ? load() : null; // 这次打开时读到的上一次，整个会话都和它比
  const looked = new Set(); // 这次已经看过的
  let ids = [], cmp = { fresh: [], closed: 0 }, ready = false, saved = false;
  let style = null, io = null;
  const timers = new Map();
  const marked = () => cmp.fresh.filter((id) => !looked.has(id));
  function sync() {
    if (!key || !shown || offline) return;
    ids = trackedIds(view, page);
    ready = true;
    if (!prev) { if (!saved) { save(ids); saved = true; } return; }
    cmp = compare(prev, ids);
    const css = newCss(marked());
    if (!style) { style = document.createElement('style'); style.id = 'cp-new-style'; document.head.append(style); }
    if (style.textContent !== css) style.textContent = css;
  }
  // 进视野停留 SEEN_DWELL_MS 才算看过；每次换字后重新挂
  function watch() {
    io?.disconnect(); timers.forEach(clearTimeout); timers.clear();
    const left = new Set(marked());
    if (!left.size || typeof IntersectionObserver !== 'function') return;
    io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) { clearTimeout(timers.get(e.target)); timers.delete(e.target); continue; }
        if (timers.has(e.target)) continue;
        timers.set(e.target, setTimeout(() => {
          timers.delete(e.target);
          const mine = String(e.target.dataset.items || e.target.dataset.ids || '').split(' ').filter((id) => left.has(id));
          if (!mine.length) return;
          mine.forEach((id) => looked.add(id));
          style.textContent = newCss(marked());
        }, SEEN_DWELL_MS));
      }
    }, { threshold: 0.6 });
    for (const n of document.querySelectorAll('[data-items], .cp-ltable tr[data-ids]')) {
      const own = String(n.dataset.items || n.dataset.ids || '').split(' ');
      if (own.some((id) => left.has(id)) && n.getClientRects().length) io.observe(n);
    }
  }
  // 关页、切走：这次的条目都算看过，存下来
  const leave = () => { if (key && ready) save(ids); };
  addEventListener('pagehide', leave);
  document.addEventListener('visibilitychange', () => { if (document.hidden) leave(); });
  return { sync, watch: () => { if (prev && ready) watch(); }, since: () => (prev && ready ? { at: prev.at, fresh: cmp.fresh.length, closed: cmp.closed } : null) };
})();

// 几个入口同时发出，第一个拿到有效驾驶舱视图的就用，其余的当场取消；总共最多等 12 秒。
// （本人 10-30 嫌刷新要 10—15 秒：live 入口常常握手失败，以前按顺序试，要干等它 12 秒才换 mcp）
// 主驾驶上再加本机直读那一路（见上面 home）；它失败（服务没开、浏览器不让访问本地网络、跨域不通）就静默放弃，不影响另外两路
async function read(wake) {
  const token = store.get();
  const way = !local && token && home.on() ? await homeWay() : null;
  const bases = way ? [...endpoints, HOME_URL] : endpoints;
  const stop = new AbortController();
  const timer = setTimeout(() => stop.abort(), 12000);
  const one = async (base) => {
    const url = new URL(base, location.href), mine = base === HOME_URL;
    if (wake) url.searchParams.set('refresh', '1');
    const signal = mine && way === 'prompt' ? AbortSignal.timeout(60000) : stop.signal;
    try {
      const r = await fetch(url, { cache: 'no-store', credentials: 'omit', headers: token ? { 'X-Cockpit-Device': token } : {}, signal });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const v = normalize(await r.json());
      if (!v.ok) throw new Error('不是驾驶舱视图');
      // 本机那一路只认本人版主驾驶：回来的不是（钥匙对不上、登记表读不了）就当没读到，交给另外两路定，不拿它删钥匙
      if (mine && !isHome(v)) throw new Error('本机回的不是本人版');
      return v;
    } catch (e) {
      if (mine && !signal.aborted) homeRest = Date.now() + 600000;
      throw e;
    }
  };
  // 12 秒到了就算没读到，不等还挂着授权框的本机那一路
  const late = new Promise((_, no) => stop.signal.addEventListener('abort', () => no(new Error('12 秒没读到')), { once: true }));
  try {
    const v = await Promise.race([Promise.any(bases.map(one)), late]);
    // 钥匙不认识或已撤销：删掉本地钥匙；登记表暂时读不了（unavailable）不删
    if (token && v.viewer?.device_state === 'invalid') { store.drop(); say('这台设备的授权已失效'); }
    else if (!local && token && v.viewer?.device_state !== 'unavailable') home.mark(isHome(v));
    return v;
  } catch { return null; /* 都没读到（或 12 秒到了） */ } finally { clearTimeout(timer); stop.abort(); }
}

// 配对：AI 在这台设备上打开 /cockpit/#pair=<一次性配对码>；先去掉地址里的码，再换成长期钥匙
async function pair() {
  if (!location.hash.startsWith('#pair=')) return;
  const m = /^#pair=([A-Za-z0-9_-]{43})$/.exec(location.hash);
  history.replaceState(null, '', location.pathname + location.search);
  if (m) try {
    const r = await fetch(PAIR_URL, { method: 'POST', credentials: 'omit', cache: 'no-store', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: m[1] }), signal: AbortSignal.timeout(12000) });
    const j = r.ok ? await r.json() : null;
    if (j?.status === 'pass' && TOKEN.test(j.token || '') && store.set(j.token)) return say('这台设备已设为本人设备，私人事项会直接显示');
  } catch { /* 按失败提示 */ }
  say('配对链接无效或已过期，请让 AI 重新发一个');
}

function paint() {
  seen.sync();
  const c = ctx();
  for (const node of document.querySelectorAll('[data-cp]')) {
    const fn = REGIONS[node.dataset.cp];
    if (!fn) continue;
    // 总览屏脚本还没加载完时先不动这几块，保留首帧
    if (!c.ov && /^(overview|lamp-)/.test(node.dataset.cp)) continue;
    const html = fn(view, c);
    if (node.innerHTML !== html) {
      // 展开着的折叠保持展开；按钮和筛选框换字后仍有焦点
      const open = [...node.querySelectorAll('details[open]')].map((d) => d.id).filter(Boolean);
      const focus = document.activeElement && node.contains(document.activeElement) ? focusKey(document.activeElement) : null;
      const finding = document.activeElement?.matches?.('[data-lfilter]') && node.contains(document.activeElement);
      node.innerHTML = html;
      open.forEach((id) => node.querySelector('#' + CSS.escape(id))?.setAttribute('open', ''));
      if (focus) refocus(node, focus);
      if (finding) { const f = node.querySelector('[data-lfilter]'); f?.focus({ preventScroll: true }); f?.setSelectionRange(f.value.length, f.value.length); }
    }
  }
  syncWide();
  syncCopy();
  syncTab();
  seen.watch();
  const river = window.todayRiver;
  if (river?.ready && view.automation.items.length) river.setSnapshot(riverSnapshot(view), false);
  // 读到新数据后还找不到的：是 AI 自己的活（AI 在跟、AI 已定、AI 等条件的）就去“AI 的账本”那一页找；
  // 别的（条目已经办完关掉了）不再惦记，免得过一会儿突然跳走
  if (wanted && shown && !reveal(true) && !offline) { if (onLedger(wanted)) location.replace('/cockpit/ai/#' + encodeURIComponent(wanted)); wanted = ''; }
}

// ---- 本人设备上的收起、提醒与复制（见 actions.js）----
// 点了就交给电脑：POST /computer-access/api/cockpit/actions，带本人设备钥匙；每次点击一个新的幂等键，网络重试用同一个。
// 收起和提醒立即隐藏卡片；失败恢复，顶部短回执支持请求回来之前撤回。
const ACTIONS_URL = 'https://mcp.wly0829.cn/computer-access/api/cockpit/actions';
const ALNUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const newKey = () => { const a = new Uint8Array(24); crypto.getRandomValues(a); return [...a].map((b) => ALNUM[b % 62]).join(''); };
const uiOf = (id) => { if (!act.ui.has(id)) act.ui.set(id, {}); return act.ui.get(id); };
async function post(url, body) {
  const token = store.get();
  const init = { method: 'POST', credentials: 'omit', cache: 'no-store', headers: { 'Content-Type': 'application/json', ...(token ? { 'X-Cockpit-Device': token } : {}) }, body: JSON.stringify(body) };
  // 只在连不上（没拿到任何回应）时重试，最多 3 次，正文（含幂等键）不变；拿到回应就按回应办
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { ...init, signal: AbortSignal.timeout(12000) });
      let j = null;
      try { j = await r.json(); } catch { /* 没有正文 */ }
      return { status: r.status, ok: r.ok, j: j && typeof j === 'object' ? j : null };
    } catch { if (i < 2) await new Promise((r) => setTimeout(r, 800 * (i + 1))); }
  }
  return { status: 0, ok: false, j: null };
}
const CJK = /[一-鿿]/;
const failText = (res) => (res.status === 429 ? '点得太快了，稍后再试' : res.status === 0 ? '连不上电脑，没交出去，稍后再点一次'
  : typeof res.j?.message === 'string' && CJK.test(res.j.message) ? res.j.message : '没交出去，稍后再试');
const actionController = createActionController({ act, post, url: ACTIONS_URL, newKey, paint, load,
  retired: () => say('这个按钮已经取消，请刷新页面') });
const undo = actionController.undo;
function submit(box, action, extra = {}) {
  if (view.viewer?.kind !== 'owner' || !ACTIONS.includes(action)) return;
  let version;
  if (box.dataset.ver) try { version = JSON.parse(box.dataset.ver); } catch { /* 旧条目没有版本 */ }
  return actionController.submit({ id: box.dataset.oa, title: box.dataset.title || '', sourceTitle: box.dataset.sourceTitle || '', version }, action, extra);
}
let copied = '', copyTimer = null;
function syncCopy() {
  for (const b of document.querySelectorAll('[data-copy]')) {
    const label = b.querySelector('[data-copy-caption]');
    if (label) label.textContent = b.dataset.copy === copied ? '已复制' : b.dataset.copyLabel || '复制给 AI';
  }
}
document.addEventListener('click', async (e) => {
  const el = e.target instanceof Element ? e.target.closest('[data-copy],[data-act],[data-snooze],[data-undo],[data-oa-refresh],[data-recent-undo]') : null;
  if (!el || el.disabled) return;
  if ('copy' in el.dataset) {
    if (!await copyToClipboard(el.dataset.copy)) return say('没复制上，再点一次');
    copied = el.dataset.copy;
    clearTimeout(copyTimer);
    say('已复制，粘到对话里就行', 6000);
    syncCopy();
    copyTimer = setTimeout(() => { copied = ''; syncCopy(); }, 2000);
    return;
  }
  if (el.dataset.recentUndo) return void undo(el.dataset.recentUndo, null);
  if ('undo' in el.dataset) return void undo(el.dataset.undo, el.dataset.undoItem || el.closest('[data-oa]')?.dataset.oa);
  const box = el.closest('[data-oa]');
  if (!box) return;
  const id = box.dataset.oa, u = uiOf(id);
  if ('oaRefresh' in el.dataset) { act.state.delete(id); paint(); return void load(); }
  if (el.dataset.snooze) return void submit(box, 'snooze', { until: el.dataset.snooze });
  if (el.dataset.act === 'snooze') { u.open = u.open === 'snooze' ? '' : 'snooze'; return void paint(); }
  if (el.dataset.act === 'ack') submit(box, 'ack');
});
// 选一天：选好（不早于今天）就交，传 YYYY-MM-DD。
document.addEventListener('change', (e) => {
  const el = e.target instanceof Element ? e.target : null;
  if (!el?.matches('[data-snooze-date]')) return;
  const box = el.closest('[data-oa]');
  if (box && /^\d{4}-\d{2}-\d{2}$/.test(el.value) && el.value >= (el.min || '')) submit(box, 'snooze', { until: el.value });
});
const FOCUS = ['act', 'snooze', 'snoozeDate', 'undo', 'oaRefresh', 'copy'];
function focusKey(el) {
  const box = el.closest('[data-oa]');
  const k = box && FOCUS.find((x) => x in el.dataset);
  return k ? [box.dataset.oa, k, el.dataset[k]].join('\u0001') : null;
}
function refocus(node, key) {
  const all = [...node.querySelectorAll('[data-oa] button, [data-oa] input')].filter((x) => focusKey(x) === key);
  const el = all.find((x) => x.getClientRects().length) || all[0];
  if (el && !el.disabled) el.focus({ preventScroll: true });
}

// 几次读取可能同时在路上（页面刚打开那次、每分钟那次、刷新按钮那次），回来的先后不一定。
// 只认比已显示那次更晚发出的：晚到的旧失败不能把新结果说成“连不上”，晚到的旧数据也不能盖掉新数据。
let lastLoad = 0;
async function load(wake = false) {
  const turn = ++asked;
  lastLoad = Date.now();
  const v = await read(wake);
  if (turn < shown) return v;
  shown = turn;
  if (v) {
    actionController.reconcile([v.need_you, v.ai_following, v.ai_overdue || [], v.deferred, v.must_know?.items || [], v.ai_running?.rows || []].flat().map((x) => x.id), v);
    view = v; offline = false;
  } else offline = true;
  paint();
  return v;
}

// 刷新按钮用：叫醒采集，最多等 20 秒，三个采集器都在点击之后完成才算新数据到了
async function refresh() {
  if (busy) return busy;
  const clicked = Date.now();
  busy = (async () => {
    let v = await load(true);
    for (let i = 0; i < 9 && v && !freshAfter(v, clicked - 1000); i++) {
      await new Promise((r) => setTimeout(r, 2000));
      v = await load(false);
    }
    return { fresh: !!v && freshAfter(v, clicked - 1000), at: Date.parse(view.served_at || '') / 1000 || null };
  })();
  try { return await busy; } finally { busy = null; }
}
window.CockpitData = { refresh, get view() { return view; } };

// 河：脚本就绪就先喂构建时的快照，不让它先显示“读不到”再换
const feedRiver = () => { if (view.automation.items.length) window.todayRiver?.setSnapshot(riverSnapshot(view), true); };
if (window.todayRiver?.ready) feedRiver(); else document.addEventListener('today-river-ready', feedRiver, { once: true });

// 打开 /cockpit/#<条目编号>（手机通知、远程卡的“间歇断开的情况看这里”等）：找到那一条，先打开外面的折叠，滚过去并高亮几秒。
// 认两种写法：页面元素自己的 id（如 todo-…、know-…、ai-running），或条目原编号（每条的 data-items 里）。
// 首帧是构建时的旧数，新条目要等第一次读到新数据才画出来，所以没找到时记着，每次换字后再找一次。
const hashId = () => { try { return decodeURIComponent(location.hash.slice(1)).trim(); } catch { return ''; } };
// 分区落点（#need-you、#tasks、项目名等）照浏览器原样跳，不高亮；只认条目。落点在收起的折叠里（如“正常运行的 N 个”里的项目名）时先打开折叠再跳
function openTo(id) {
  const el = id && !id.startsWith('pair=') ? document.getElementById(id) : null;
  if (!el || !el.closest('details:not([open])')) return;
  for (let p = el.parentElement; p; p = p.parentElement) if (p.tagName === 'DETAILS') p.open = true;
  el.scrollIntoView({ block: 'start' });
}
// AI 自己的活（AI 在跟、过了日子的、AI 已定、AI 等条件的）在二级页“AI 的账本”上
const onLedger = (id) => location.pathname === '/cockpit/' && [...view.ai_following, ...(view.ai_overdue || []), ...view.deferred.filter((x) => x.action_owner && x.action_owner !== 'user'),
  ...(view.must_know?.items || []).filter((k) => k.kind === 'ai_decision')].some((x) => x.id === id || x.copy_ai_id === id);
function findItem(id) {
  if (!id || id.startsWith('pair=')) return null;
  const own = document.getElementById(id);
  if (own) return own.matches('[data-items], #ai-running') || /^(todo|know)-/.test(id) ? own : null;
  const all = [...document.querySelectorAll('[data-items]')].filter((n) => n.dataset.items.split(' ').includes(id));
  return all.find((n) => n.getClientRects().length) || all[0] || null;
}
// final：已经是读到新数据后的那一版，找到就不再惦记；首帧（构建时的旧数）上先跳一次，读到新数据换字后再对准一次
function reveal(final) {
  let target = findItem(wanted);
  if (!target) return false;
  const q = target.closest('.cp-q[data-q]:not(.is-open)');
  if (q) { act.ui.set(Q_KEY, { ...act.ui.get(Q_KEY), open: q.dataset.q }); paint(); target = findItem(wanted) || target; }
  if (final) wanted = '';
  for (let p = target.parentElement; p; p = p.parentElement) if (p.tagName === 'DETAILS') p.open = true;
  target.scrollIntoView({ block: 'start' });
  target.classList.remove('cp-hit');
  void target.offsetWidth; // 同一条再点一次也重新闪
  target.classList.add('cp-hit');
  setTimeout(() => target.classList.remove('cp-hit'), 4000);
  return true;
}
// ---- 电脑版（宽度 ≥1200）----
// 队列默认全部展开；“一行一件 / 全部展开”记在这台浏览器。
// 点一行展开那一件（记在 act.ui）；选项和 AI 建议始终只是说明。
const QMODE = 'wly-cockpit-qmode';
const qmode = { get() { try { const m = localStorage.getItem(QMODE); return m === 'rows' || m === 'all' ? m : ''; } catch { return ''; } },
  set(m) { try { localStorage.setItem(QMODE, m); } catch { /* 无存储：这次照样换，下次回到默认 */ } } };
let qpick = '';
act.ui.set(Q_KEY, { mode: qmode.get() || 'all' });
const WIDE = matchMedia('(min-width: 1700px)');
let runTouched = false; // 少量运行行默认展开；自己收起过就不再替你展开
function syncWide() {
  const need = document.getElementById('need-you');
  if (need) {
    const m = qmode.get() || qpick;
    need.dataset.qmode = m || 'all';
    const eff = m || 'all';
    for (const b of need.querySelectorAll('[data-q-mode]')) b.setAttribute('aria-pressed', String(b.dataset.qMode === eff));
    // 键盘移到的那件画一圈绿边（只有一两件时都展开着，绿边只给当前那件）
    if ('kbd' in need.dataset) { const cur = curQ(); for (const q of need.querySelectorAll('.cp-q[data-q]')) q.classList.toggle('is-kbd', q === cur); }
  }
  if (!runTouched && (WIDE.matches || (view.ai_running?.rows.length || 0) <= 4)) document.getElementById('run-all')?.setAttribute('open', '');
}
WIDE.addEventListener('change', syncWide);
const openQ = (id) => {
  act.ui.set(Q_KEY, { ...act.ui.get(Q_KEY), open: id });
  paint();
  document.querySelector(`.cp-q[data-q="${CSS.escape(id)}"]`)?.scrollIntoView({ block: 'nearest' });
};
// 顶栏 ↻：和右下角的刷新按钮一样叫醒电脑重读，结果写在顶栏右端
let reloading = false;
async function reloadNow(btn) {
  if (reloading) return;
  reloading = true;
  btn.setAttribute('aria-busy', 'true');
  try {
    const r = await refresh();
    say(r?.fresh ? '已更新' : '电脑没回应，现在显示的是之前读到的数据');
  } catch { say('电脑没回应，现在显示的是之前读到的数据'); } finally { reloading = false; btn.setAttribute('aria-busy', 'false'); }
}
// 卡上的“打开”组（后端 open 字段才有，见 render.js 的 openGroup）：在主驾驶上打开、看汇报；都只带条目编号和哪一项，路径由电脑从登记里取
const OPEN_URL = 'https://mcp.wly0829.cn/computer-access/api/cockpit/open';
const REPORT_URL = 'https://mcp.wly0829.cn/computer-access/api/cockpit/report/';
async function openThere(btn) {
  if (btn.disabled) return;
  btn.disabled = true;
  const res = await post(OPEN_URL, { item_id: btn.dataset.openItem, target: btn.dataset.openTarget });
  btn.disabled = false;
  const msg = res.ok ? (typeof res.j?.message === 'string' && CJK.test(res.j.message) ? res.j.message : '已在主驾驶上打开') : failText(res).replace('没交出去', '没打开');
  const note = document.createElement('span');
  note.className = 'cp-open-msg' + (res.ok ? '' : ' is-err');
  note.setAttribute('role', 'status');
  note.textContent = msg;
  btn.closest('.cp-open')?.after(note);
  setTimeout(() => note.remove(), msg.length > 12 ? 9000 : 5000);
}
// 看汇报：取回汇报页的 HTML，放进右侧抽屉（窄屏全屏）的沙箱 iframe（allow-scripts，不给同源，汇报页的脚本读不到设备钥匙）；Esc 关闭，回到原来的位置
let drawer = null, drawerFrom = null;
function closeDrawer() {
  if (!drawer || drawer.hidden) return;
  drawer.hidden = true;
  drawer.querySelector('iframe').srcdoc = '';
  document.documentElement.classList.remove('cp-drawer-open');
  drawerFrom?.focus({ preventScroll: true });
}
async function showReport(btn) {
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.className = 'cp-drawer';
    drawer.hidden = true;
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', '汇报页');
    drawer.innerHTML = '<div class="cp-drawer-bar"><b>汇报页</b><span class="cp-drawer-note" role="status"></span><button type="button" class="cp-drawer-close" data-drawer-close>关闭（Esc）</button></div><iframe sandbox="allow-scripts" title="汇报页" referrerpolicy="no-referrer"></iframe>';
    document.body.append(drawer);
  }
  drawerFrom = btn;
  const note = drawer.querySelector('.cp-drawer-note'), frame = drawer.querySelector('iframe');
  note.textContent = '正在取汇报页…';
  frame.srcdoc = '';
  drawer.hidden = false;
  document.documentElement.classList.add('cp-drawer-open');
  drawer.querySelector('[data-drawer-close]').focus({ preventScroll: true });
  const token = store.get();
  try {
    const r = await fetch(REPORT_URL + encodeURIComponent(btn.dataset.report), { cache: 'no-store', credentials: 'omit', headers: token ? { 'X-Cockpit-Device': token } : {}, signal: AbortSignal.timeout(15000) });
    if (!r.ok) throw new Error(String(r.status));
    frame.srcdoc = await r.text();
    note.textContent = '';
  } catch { note.textContent = '汇报页没取到，稍后再试'; }
}
document.addEventListener('click', (e) => {
  // 电脑版健康分说明是浮层：点浮层外面任何地方都收起（窄屏是原地展开，不管）
  const sc = document.getElementById('score');
  if (sc?.open && matchMedia('(min-width: 1200px)').matches && e.target instanceof Node && !sc.contains(e.target)) sc.open = false;
  const el = e.target instanceof Element ? e.target.closest('[data-q-mode],[data-q-open],[data-cp-reload],[data-open-item],[data-report],[data-drawer-close],#run-all > summary,#score .cp-score-go') : null;
  if (!el) return;
  if (el.matches('#run-all > summary')) { runTouched = true; return; }
  // 健康分点开的说明在电脑版浮在五格下面：点其中一行跳过去时顺手收起，不留在顶上挡着
  if (el.matches('#score .cp-score-go')) { document.getElementById('score').open = false; return; }
  if (el.dataset.qMode) { qpick = el.dataset.qMode; qmode.set(qpick); act.ui.set(Q_KEY, { ...act.ui.get(Q_KEY), mode: qpick }); return void paint(); }
  if (el.dataset.qOpen !== undefined) return void openQ(el.dataset.qOpen);
  if ('cpReload' in el.dataset) return void reloadNow(el);
  if (el.dataset.openItem) return void openThere(el);
  if (el.dataset.report) return void showReport(el);
  if ('drawerClose' in el.dataset) closeDrawer();
});
// ---- 键盘（电脑版）：j/k 下一件上一件、1—9 第几件、o 打开对话、s 晚点提醒、u 撤回、? 说明 ----
// 正在写字（输入框、文本框）时一个都不接；按住 Ctrl、Alt、⌘ 的组合键也不接。都是点页面上同一个按钮，照样能撤回
const DESK = matchMedia('(min-width: 1200px)');
const typing = (el) => !!el?.closest?.('input, textarea, select, [contenteditable=""], [contenteditable="true"]');
const qIds = () => [...document.querySelectorAll('#need-you .cp-q[data-q]')].map((n) => n.dataset.q);
// 键盘当前在哪一件：j/k、数字移过去的那件；没移过就是展开着的第一件（只有一两件时都展开着）
let kbdId = '';
const curQ = () => (kbdId && document.querySelector(`#need-you .cp-q[data-q="${CSS.escape(kbdId)}"]`)) || document.querySelector('#need-you .cp-q.is-open[data-q]');
const live = (root, sel) => [...root.querySelectorAll(sel)].find((b) => b.getClientRects().length && !b.disabled) || null;
function kbdGo(id) {
  const need = document.getElementById('need-you');
  need.dataset.kbd = '';
  kbdId = id;
  openQ(id);
  const q = document.querySelector(`#need-you .cp-q[data-q="${CSS.escape(id)}"]`);
  const row = q?.querySelector('.cp-q-row');
  if (row?.getClientRects().length) row.focus({ preventScroll: true });
  q?.scrollIntoView({ block: 'nearest' });
}
function shortcut(e, el) {
  const k = e.key;
  if (k === '?') { const h = document.getElementById('cp-help'); if (h) { e.preventDefault(); h.open = !h.open; } return true; }
  const ids = qIds();
  if (!ids.length) return false;
  const cur = curQ(), i = cur ? ids.indexOf(cur.dataset.q) : -1;
  if (k === 'j' || k === 'k') { e.preventDefault(); kbdGo(ids[Math.max(0, Math.min(ids.length - 1, i < 0 ? 0 : i + (k === 'j' ? 1 : -1)))]); return true; }
  if (/^[1-9]$/.test(k)) { if (ids[+k - 1]) { e.preventDefault(); kbdGo(ids[+k - 1]); } return true; }
  if (!cur) return false;
  const map = { o: '.cp-open-a, .cp-open-b', s: '[data-act="snooze"]', u: '[data-undo]' };
  if (!map[k]) return false;
  const b = live(cur, map[k]) || (k === 'u' ? live(document, '[data-undo]') : null);
  e.preventDefault();
  if (b) b.click(); else say({ o: '这件没有能打开的对话', s: '这件不能晚点提醒', u: '现在没有能撤回的' }[k]);
  return true;
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawer && !drawer.hidden) { e.preventDefault(); return closeDrawer(); }
  const el = e.target instanceof Element ? e.target : null;
  if (e.key === 'Escape' && document.getElementById('cp-help')?.open) { document.getElementById('cp-help').open = false; return; }
  if (e.key === 'Escape' && document.getElementById('score')?.open) { document.getElementById('score').open = false; return; }
  if (DESK.matches && !e.ctrlKey && !e.metaKey && !e.altKey && !typing(el) && !(e.key === 'Enter' && el?.matches('.cp-q-row:not([aria-expanded="true"])')) && shortcut(e, el)) return;
  // 队列的行：Enter / 空格展开
  if ((e.key === 'Enter' || e.key === ' ') && el?.matches('.cp-q-row')) { e.preventDefault(); return openQ(el.dataset.qOpen); }

});

// ---- 账本页电脑版表格：筛选（全部 / 晚了 / 没晚、输入几个字）----
const lf = () => act.ui.get(LF_KEY) || {};
document.addEventListener('click', (e) => {
  const el = e.target instanceof Element ? e.target.closest('[data-lshow]') : null;
  if (el?.dataset.lshow) { act.ui.set(LF_KEY, { ...lf(), show: el.dataset.lshow }); paint(); }
});
document.addEventListener('input', (e) => {
  const el = e.target instanceof Element ? e.target : null;
  if (el?.matches('[data-lfilter]')) { act.ui.set(LF_KEY, { ...lf(), q: el.value }); paint(); }
});

// ---- 标签页：“(N) 驾驶舱”，有要你做的事时图标加红点 ----
const baseTitle = document.title.replace(/^\(\d+\)\s*/, '');
const icon = document.querySelector('link[rel~="icon"]');
const iconWas = icon ? { href: icon.href, type: icon.type } : null;
let dotOn = false, dotHref = '';
function syncTab() {
  const n = needCount(view, new Date(), ctx());
  const t = (n ? `(${n}) ` : '') + baseTitle;
  if (document.title !== t) document.title = t;
  if (!icon || n > 0 === dotOn) return;
  dotOn = n > 0;
  if (!dotOn) { icon.type = iconWas.type; icon.href = iconWas.href; return; }
  if (dotHref) { icon.type = 'image/png'; icon.href = dotHref; return; }
  // 原图标在另一个网址（发布后放在图床）时要它允许跨站读；读不到就画一个绿底圆标加红点
  const draw = (img) => {
    try {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const g = c.getContext('2d');
      if (img) g.drawImage(img, 0, 0, 64, 64);
      else { g.beginPath(); g.arc(30, 34, 26, 0, Math.PI * 2); g.fillStyle = '#1d7a45'; g.fill(); }
      g.beginPath(); g.arc(47, 17, 15, 0, Math.PI * 2); g.fillStyle = '#d93025'; g.fill(); g.lineWidth = 4; g.strokeStyle = '#fff'; g.stroke();
      dotHref = c.toDataURL('image/png');
    } catch { if (img) return draw(null); return; }
    if (dotOn) { icon.type = 'image/png'; icon.href = dotHref; }
  };
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => draw(img);
  img.onerror = () => draw(null);
  img.src = iconWas.href;
}

window.addEventListener('hashchange', () => { wanted = hashId(); if (!reveal(shown > 0)) openTo(wanted); });
wanted = hashId();
syncWide();
if (!reveal(false)) openTo(wanted);

pair().finally(() => load());
// 页面在前台每分钟读一次；在后台（切到别的标签页）每 3 分钟读一次，标签页上的“(N) 驾驶舱”和图标红点照样跟着变
setInterval(() => { if (!busy && (!document.hidden || Date.now() - lastLoad >= 175000)) load(); }, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && !busy) load(); });
