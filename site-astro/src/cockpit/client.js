// 驾驶舱浏览器端：页面一打开就是构建时那份快照画好的最终版式；这里只负责读新数据、原地换字。
// 每分钟读一次（页面在后台时不读）；刷新按钮叫醒电脑重读，等三个采集器都完成再换。
import { normalize, riverSnapshot, freshAfter } from './model.js';
import { REGIONS, Q_KEY, LF_KEY, LB_KEY, needCount } from './render.js';
import { AI_ACTIONS, leftText } from './actions.js';

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
  set(t) { try { localStorage.setItem(KEY, t); return true; } catch { return false; } }, drop() { try { localStorage.removeItem(KEY); } catch { /* 无存储 */ } } };
let notice = '';
const say = (text) => { notice = text; paint(); setTimeout(() => { if (notice === text) { notice = ''; paint(); } }, 15000); };
// phase：还没收到过任何一次读取结果时是 snapshot（首帧那份构建时的数），之后是 live；读不到另由 offline 说明
// act：本人设备上点过的处理（state：正在交 / 交出去了 / 出错 / 撤回中；ui：还没交的选择、写的话、交给谁；recent：最近处理里撤回过的）
const act = { state: new Map(), ui: new Map(), recent: new Map() };
const ctx = () => ({ now: new Date(), offline, notice, phase: shown ? 'live' : 'snapshot', paired: !!store.get(), projectUrls: boot.projectUrls || {}, img: boot.img || {}, ov: window.OverviewScreen, act });

async function read(wake) {
  const token = store.get();
  for (const base of endpoints) {
    const url = new URL(base, location.href);
    if (wake) url.searchParams.set('refresh', '1');
    try {
      const r = await fetch(url, { cache: 'no-store', credentials: 'omit', headers: token ? { 'X-Cockpit-Device': token } : {}, signal: AbortSignal.timeout(12000) });
      if (!r.ok) continue;
      const v = normalize(await r.json());
      if (!v.ok) continue;
      // 钥匙不认识或已撤销：删掉本地钥匙；登记表暂时读不了（unavailable）不删
      if (token && v.viewer?.device_state === 'invalid') { store.drop(); say('这台设备的授权已失效'); }
      return v;
    } catch { /* 换下一个地址 */ }
  }
  return null;
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
  const c = ctx();
  for (const node of document.querySelectorAll('[data-cp]')) {
    const fn = REGIONS[node.dataset.cp];
    if (!fn) continue;
    // 总览屏脚本还没加载完时先不动这几块，保留首帧
    if (!c.ov && /^(overview|lamp-)/.test(node.dataset.cp)) continue;
    const html = fn(view, c);
    if (node.innerHTML !== html) {
      // 展开着的折叠保持展开（选了的答案、写的话在 act.ui 里，重画时照样画出来）；正在按的按钮、正在写的框换字后仍有焦点
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
  syncTab();
  floatLater();
  const river = window.todayRiver;
  if (river?.ready && view.automation.items.length) river.setSnapshot(riverSnapshot(view), false);
  // 读到新数据后还找不到的：是 AI 自己的活（AI 在跟、AI 已定、AI 等条件的）就去“AI 的账本”那一页找；
  // 别的（条目已经办完关掉了）不再惦记，免得过一会儿突然跳走
  if (wanted && shown && !reveal(true) && !offline) { if (onLedger(wanted)) location.replace('/cockpit/ai/#' + encodeURIComponent(wanted)); wanted = ''; }
}

// ---- 本人设备上的按钮（条目带 owner_actions 才有；见 actions.js）----
// 点了就交给电脑：POST /computer-access/api/cockpit/actions，带本人设备钥匙；每次点击一个新的幂等键，网络重试用同一个。
// 交出去以后卡片变灰，回执的话 + “撤回”倒数；撤回期过了写“已交给 Claude（HH:MM）”。出错照接口的中文说明写，条目变了给“刷新”。
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
async function submit(box, action, extra = {}) {
  const id = box.dataset.oa;
  if (act.state.get(id)?.phase === 'sending') return; // 防连点
  const u = uiOf(id);
  const body = { item_id: id, action, ...extra, idempotency_key: newKey() };
  // “AI 在等你回”的卡（data-noexec）：答案送回原来那个对话，不选交给谁
  if (AI_ACTIONS.includes(action) && !body.executor && !('noexec' in box.dataset)) body.executor = u.executor === 'gpt' ? 'gpt' : 'claude';
  if (box.dataset.ver) try { body.item_version = JSON.parse(box.dataset.ver); } catch { /* 没有版本就不带 */ }
  // 晚点提醒记下选的是哪天，撤回期过了写“好，明早 9 点再提醒你。”
  const base = { action, executor: body.executor, until: body.until };
  act.state.set(id, { phase: 'sending', ...base });
  paint();
  const res = await post(ACTIONS_URL, body);
  if (res.ok && typeof res.j?.id === 'string') { act.state.set(id, { phase: 'done', ...base, receipt: res.j }); act.ui.delete(id); }
  else act.state.set(id, { phase: 'error', ...base, error: failText(res), refresh: res.status === 409 && res.j?.error === 'cockpit_item_changed' });
  paint();
}
async function undo(actId, itemId) {
  const s = itemId ? act.state.get(itemId) : null;
  if (s) { if (s.phase === 'undoing') return; act.state.set(itemId, { ...s, phase: 'undoing', undoError: '' }); } else { if (act.recent.get(actId) === 'undoing') return; act.recent.set(actId, 'undoing'); }
  paint();
  const res = await post(`${ACTIONS_URL}/${encodeURIComponent(actId)}/undo`, {});
  if (res.ok) {
    act.recent.set(actId, 'undone');
    for (const [k, v] of act.state) if (v.receipt?.id === actId) act.state.set(k, { phase: 'undone', message: typeof res.j?.message === 'string' && CJK.test(res.j.message) ? res.j.message : '已撤回' });
    setTimeout(() => { let changed = false; for (const [k, v] of act.state) if (v.phase === 'undone') { act.state.delete(k); changed = true; } if (changed) paint(); }, 6000);
    load();
  } else if (s) act.state.set(itemId, { ...s, phase: 'done', undoError: failText(res) });
  else act.recent.delete(actId);
  paint();
}
// 同一条在页面上可能画了两处（账本页的表格和列表），只认看得见的那处
const shown1 = (sel) => { const all = [...document.querySelectorAll(sel)]; return all.find((n) => n.getClientRects().length) || all[0] || null; };
document.addEventListener('click', (e) => {
  const el = e.target instanceof Element ? e.target.closest('[data-act],[data-send],[data-snooze],[data-exec],[data-undo],[data-oa-refresh],[data-recent-undo],[data-pick],[data-add],.cp-oa-q .cp-opt') : null;
  if (!el || el.disabled) return;
  if (el.dataset.recentUndo) return void undo(el.dataset.recentUndo, null);
  const box = el.closest('[data-oa]');
  if (!box) return;
  const id = box.dataset.oa, u = uiOf(id);
  // 只有一道题：点选项就直接交（照常可撤回）；“补一句”写的话跟着一起交
  if ('pick' in el.dataset) {
    const qid = el.closest('[data-qid]')?.dataset.qid || 'choice', text = (u.answers?.[qid]?.text || '').trim();
    return void submit(box, 'answer', { answers: { [qid]: { value: JSON.parse(el.dataset.val), ...(text ? { text } : {}) } } });
  }
  if ('add' in el.dataset) {
    u.open = u.open === 'add' ? '' : 'add';
    paint();
    if (u.open === 'add') shown1(`[data-oa="${CSS.escape(id)}"] [data-qnote]`)?.focus();
    return;
  }
  if (el.matches('.cp-oa-q .cp-opt')) {
    // 单选，再点一次取消；“我的说明”留着
    const qid = el.closest('[data-qid]').dataset.qid, cur = u.answers?.[qid] || {};
    const again = 'value' in cur && JSON.stringify(cur.value) === el.dataset.val;
    const next = { ...cur };
    if (again) delete next.value; else next.value = JSON.parse(el.dataset.val);
    u.answers = { ...u.answers, [qid]: next };
    return void paint();
  }
  if ('exec' in el.dataset) { u.executor = u.executor === 'gpt' ? 'claude' : 'gpt'; return void paint(); }
  if (el.dataset.undo !== undefined) return void undo(el.dataset.undo, id);
  if ('oaRefresh' in el.dataset) { act.state.delete(id); paint(); return void load(); }
  if (el.dataset.snooze) return void submit(box, 'snooze', { until: el.dataset.snooze });
  if (el.dataset.send) {
    const a = el.dataset.send;
    if (a === 'answer') {
      const answers = Object.fromEntries(Object.entries(u.answers || {}).filter(([, x]) => 'value' in x).map(([q, x]) => [q, { value: x.value, ...(x.text?.trim() ? { text: x.text.trim() } : {}) }]));
      return void submit(box, 'answer', { answers });
    }
    const text = (u.text || '').trim();
    if (text) submit(box, a, { text });
    return;
  }
  const a = el.dataset.act;
  if (a === 'note' || a === 'redo' || a === 'snooze') {
    // 回一句话 / 不对，重做 / 晚点提醒：展开或收起下面的框；两个写字的框共用一份草稿
    u.open = u.open === a ? '' : a;
    paint();
    if (u.open === 'note' || u.open === 'redo') shown1(`[data-oa="${CSS.escape(id)}"] [data-text]`)?.focus();
    return;
  }
  if (a === 'switch') return void submit(box, 'switch', { executor: el.dataset.to === 'gpt' ? 'gpt' : 'claude' });
  submit(box, a); // 看见了、知道了、我办好了、这件不做了、确认、你定就行、我没看懂：直接交，不加二次确认（误点靠撤回）
});
document.addEventListener('input', (e) => {
  const el = e.target instanceof Element ? e.target : null;
  const box = el?.closest('[data-oa]');
  if (!box) return;
  const u = uiOf(box.dataset.oa);
  if ('text' in el.dataset) {
    u.text = el.value;
    const send = box.querySelector('[data-send]:not([data-send="answer"])');
    if (send) send.disabled = !el.value.trim();
  } else if ('qnote' in el.dataset) {
    const qid = el.closest('[data-qid]').dataset.qid;
    u.answers = { ...u.answers, [qid]: { ...u.answers?.[qid], text: el.value } };
  }
});
// 选一天：选好（不早于今天）就交，传 YYYY-MM-DD
document.addEventListener('change', (e) => {
  const el = e.target instanceof Element ? e.target : null;
  if (!el?.matches('[data-snooze-date]')) return;
  const box = el.closest('[data-oa]');
  if (box && /^\d{4}-\d{2}-\d{2}$/.test(el.value) && el.value >= (el.min || '')) submit(box, 'snooze', { until: el.value });
});
// 换字时把焦点放回同一个按钮或输入框
const FOCUS = ['act', 'send', 'exec', 'snooze', 'snoozeDate', 'undo', 'text', 'qnote', 'val', 'add', 'oaRefresh'];
function focusKey(el) {
  const box = el.closest('[data-oa]');
  const k = box && FOCUS.find((x) => x in el.dataset);
  return k ? [box.dataset.oa, el.closest('[data-qid]')?.dataset.qid || '', k, el.dataset[k]].join('\u0001') : null;
}
function refocus(node, key) {
  const all = [...node.querySelectorAll('[data-oa] button, [data-oa] input, [data-oa] textarea')].filter((x) => focusKey(x) === key);
  const el = all.find((x) => x.getClientRects().length) || all[0];
  if (!el || el.disabled) return;
  el.focus({ preventScroll: true });
  if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && el.type === 'text')) el.setSelectionRange(el.value.length, el.value.length);
}
// 撤回倒数每秒走一格；有一条到点了，整块重画成“已交给 ……”
setInterval(() => {
  const now = new Date();
  let due = false;
  for (const el of document.querySelectorAll('[data-left]')) { const t = leftText(el.dataset.left, now); if (t) el.textContent = t; else due = true; }
  if (due) paint();
}, 1000);

// 几次读取可能同时在路上（页面刚打开那次、每分钟那次、刷新按钮那次），回来的先后不一定。
// 只认比已显示那次更晚发出的：晚到的旧失败不能把新结果说成“连不上”，晚到的旧数据也不能盖掉新数据。
let lastLoad = 0;
async function load(wake = false) {
  const turn = ++asked;
  lastLoad = Date.now();
  const v = await read(wake);
  if (turn < shown) return v;
  shown = turn;
  if (v) { view = v; offline = false; } else offline = true;
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
  if (q) { act.ui.set(Q_KEY, { open: q.dataset.q }); paint(); target = findItem(wanted) || target; }
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
// 左栏队列“一行一件 / 全部展开”记在这台浏览器；没选过时 1700 宽以上全部展开（两列），以下一行一件。
// 点一行展开那一件（同时只展开一件，记在 act.ui）；行上的“AI 建议”直接交那个选项（和卡里点一样，可撤回），同时展开那件好看到回执和撤回。
const QMODE = 'wly-cockpit-qmode';
const qmode = { get() { try { const m = localStorage.getItem(QMODE); return m === 'rows' || m === 'all' ? m : ''; } catch { return ''; } },
  set(m) { try { localStorage.setItem(QMODE, m); } catch { /* 无存储：这次照样换，下次回到默认 */ } } };
let qpick = '';
const WIDE = matchMedia('(min-width: 1700px)');
let runTouched = false; // 1700 宽以上“AI 正在干活”默认全列；自己收起过就不再替你展开
function syncWide() {
  const need = document.getElementById('need-you');
  if (need) {
    const m = qmode.get() || qpick;
    if (m) need.dataset.qmode = m; else delete need.dataset.qmode;
    const eff = m || (WIDE.matches ? 'all' : 'rows');
    for (const b of need.querySelectorAll('[data-q-mode]')) b.setAttribute('aria-pressed', String(b.dataset.qMode === eff));
    // 键盘移到的那件画一圈绿边（只有一两件时都展开着，绿边只给当前那件）
    if ('kbd' in need.dataset) { const cur = curQ(); for (const q of need.querySelectorAll('.cp-q[data-q]')) q.classList.toggle('is-kbd', q === cur); }
  }
  if (WIDE.matches && !runTouched) document.getElementById('run-all')?.setAttribute('open', '');
}
WIDE.addEventListener('change', syncWide);
const openQ = (id) => {
  act.ui.set(Q_KEY, { open: id });
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
  const el = e.target instanceof Element ? e.target.closest('[data-q-mode],[data-q-pick],[data-q-open],[data-cp-reload],[data-open-item],[data-report],[data-drawer-close],#run-all > summary') : null;
  if (!el) return;
  if (el.matches('#run-all > summary')) { runTouched = true; return; }
  if (el.dataset.qMode) { qpick = el.dataset.qMode; qmode.set(qpick); return void syncWide(); }
  if (el.dataset.qPick) {
    const id = el.dataset.qPick;
    const pick = [...document.querySelectorAll(`[data-oa="${CSS.escape(id)}"] [data-pick]`)].find((b) => b.dataset.val === el.dataset.val);
    act.ui.set(Q_KEY, { open: id });
    if (pick) pick.click(); else paint();
    return;
  }
  if (el.dataset.qOpen !== undefined) return void openQ(el.dataset.qOpen);
  if ('cpReload' in el.dataset) return void reloadNow(el);
  if (el.dataset.openItem) return void openThere(el);
  if (el.dataset.report) return void showReport(el);
  if ('drawerClose' in el.dataset) closeDrawer();
});
// ---- 键盘（电脑版）：j/k 下一件上一件、1—9 第几件、Enter 按 AI 建议回答、o 打开对话、n 回一句话、s 晚点提醒、u 撤回、? 说明 ----
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
  if (k === 'Enter') {
    // 焦点在别的按钮、链接上时 Enter 照常按那个；在空白处或这一件的行上才按 AI 建议
    if (el && el !== document.body && !el.matches(`.cp-q-row[data-q-open="${CSS.escape(cur.dataset.q)}"]`)) return false;
    const b = live(cur, '.cp-ask [data-pick].cp-btn-main');
    e.preventDefault();
    if (b) b.click(); else say('这件没有 AI 建议，点选项回答');
    return true;
  }
  const map = { o: '.cp-open-a, .cp-open-b', n: '[data-act="note"], [data-add]', s: '[data-act="snooze"]', u: '[data-undo]' };
  if (!map[k]) return false;
  const b = live(cur, map[k]) || (k === 'u' ? live(document, '[data-undo]') : null);
  e.preventDefault();
  if (b) b.click(); else say({ o: '这件没有能打开的对话', n: '这件不能回话', s: '这件不能晚点提醒', u: '现在没有能撤回的' }[k]);
  return true;
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && drawer && !drawer.hidden) { e.preventDefault(); return closeDrawer(); }
  const el = e.target instanceof Element ? e.target : null;
  if (e.key === 'Escape' && document.getElementById('cp-help')?.open) { document.getElementById('cp-help').open = false; return; }
  if (DESK.matches && !e.ctrlKey && !e.metaKey && !e.altKey && !typing(el) && !(e.key === 'Enter' && el?.matches('.cp-q-row:not([aria-expanded="true"])')) && shortcut(e, el)) return;
  // 队列的行：Enter / 空格展开
  if ((e.key === 'Enter' || e.key === ' ') && el?.matches('.cp-q-row')) { e.preventDefault(); return openQ(el.dataset.qOpen); }
  // 写字的框里 Ctrl+Enter 交出去（回一句话、不对重做的“交给 AI”；多道题的“交给 AI”）
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && el?.matches('[data-oa] [data-text], [data-oa] [data-qnote]')) {
    const box = el.closest('[data-oa]');
    const send = 'text' in el.dataset ? box.querySelector('[data-send]:not([data-send="answer"])') : box.querySelector('[data-send="answer"]');
    if (send && !send.disabled) { e.preventDefault(); send.click(); }
  }
});

// ---- 账本页电脑版表格：筛选（全部 / 晚了 / 没晚、输入几个字）；AI 自己定了的勾选后一次“知道了”（后端给了 batch 才有）----
const lf = () => act.ui.get(LF_KEY) || {};
document.addEventListener('click', (e) => {
  const el = e.target instanceof Element ? e.target.closest('[data-lshow],[data-lb-ack]') : null;
  if (!el || el.disabled) return;
  if (el.dataset.lshow) { act.ui.set(LF_KEY, { ...lf(), show: el.dataset.lshow }); return void paint(); }
  batchAck();
});
document.addEventListener('input', (e) => {
  const el = e.target instanceof Element ? e.target : null;
  if (el?.matches('[data-lfilter]')) { act.ui.set(LF_KEY, { ...lf(), q: el.value }); paint(); }
});
document.addEventListener('change', (e) => {
  const el = e.target instanceof Element ? e.target : null;
  if (!el?.matches('[data-lb], [data-lb-all]')) return;
  const all = [...document.querySelectorAll('#ai-decided-table [data-lb]')].map((b) => b.dataset.lb);
  const sel = new Set(act.ui.get(LB_KEY)?.sel || []);
  if ('lbAll' in el.dataset) { sel.clear(); if (el.checked) all.forEach((id) => sel.add(id)); } else if (el.checked) sel.add(el.dataset.lb); else sel.delete(el.dataset.lb);
  act.ui.set(LB_KEY, { sel: [...sel] });
  paint();
});
// 一次交多件（POST …/cockpit/actions/batch {actions:[…]}，限频算一次）；每件各自的回执、撤回和出错照单件的样子画
async function batchAck() {
  const all = [...document.querySelectorAll('#ai-decided-table [data-lb]')].map((b) => b.dataset.lb);
  const pick = act.ui.get(LB_KEY)?.sel || [];
  const ids = pick.length ? pick.filter((id) => all.includes(id)) : all;
  if (!ids.length) return;
  const actions = ids.map((id) => {
    const box = document.querySelector(`#ai-decided-table [data-oa="${CSS.escape(id)}"]`);
    const body = { item_id: id, action: 'ack', idempotency_key: newKey() };
    if (box?.dataset.ver) try { body.item_version = JSON.parse(box.dataset.ver); } catch { /* 没有版本就不带 */ }
    return body;
  });
  for (const id of ids) act.state.set(id, { phase: 'sending', action: 'ack' });
  act.ui.delete(LB_KEY);
  paint();
  for (let k = 0; k < actions.length; k += 30) {
    const part = actions.slice(k, k + 30);
    const res = await post(ACTIONS_URL + '/batch', { actions: part });
    const list = Array.isArray(res.j?.results) ? res.j.results : [];
    for (const a of part) {
      const r = list.find((x) => x?.item_id === a.item_id) || null;
      const code = Number(r?.http_status) || 0;
      const fine = res.ok && r && r.status !== 'error' && (!code || code < 400) && typeof r.id === 'string';
      if (fine) act.state.set(a.item_id, { phase: 'done', action: 'ack', receipt: r });
      else {
        const why = r && typeof r.message === 'string' && CJK.test(r.message) ? r.message : code === 429 ? '点得太快了，稍后再试' : res.ok ? '这件没交上，稍后再点一次' : failText(res);
        act.state.set(a.item_id, { phase: 'error', action: 'ack', error: why, refresh: (code === 409 && r?.error === 'cockpit_item_changed') || (res.status === 409 && res.j?.error === 'cockpit_item_changed') });
      }
    }
    paint();
  }
}

// ---- 标签页：“(N) 驾驶舱”，有要你做的事时图标加红点 ----
const baseTitle = document.title.replace(/^\(\d+\)\s*/, '');
const icon = document.querySelector('link[rel~="icon"]');
const iconWas = icon ? { href: icon.href, type: icon.type } : null;
let dotOn = false, dotHref = '';
function syncTab() {
  const n = needCount(view, new Date());
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

// 右下角 ↻：电脑版顶栏的 ↻ 看得见时藏起来，滚出去才出现（窄屏顶栏没有 ↻，一直在）
// 看得见＝它在视口里、而且没被页头之类盖住（取它正中那一点，落在它身上才算）
const topReload = document.querySelector('[data-cp-reload]'), floatWrap = document.querySelector('.cockpit-refresh-wrap');
let floatRaf = 0;
function checkFloat() {
  floatRaf = 0;
  if (!topReload || !floatWrap) return;
  const r = topReload.getBoundingClientRect();
  const seen = r.width > 0 && r.bottom > 0 && r.top < innerHeight && topReload.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
  floatWrap.classList.toggle('is-top-visible', seen);
}
const floatLater = () => { if (!floatRaf) floatRaf = requestAnimationFrame(checkFloat); };
if (topReload && floatWrap) { addEventListener('scroll', floatLater, { passive: true }); addEventListener('resize', floatLater); checkFloat(); }

window.addEventListener('hashchange', () => { wanted = hashId(); if (!reveal(shown > 0)) openTo(wanted); });
wanted = hashId();
syncWide();
if (!reveal(false)) openTo(wanted);

pair().finally(() => load());
// 页面在前台每分钟读一次；在后台（切到别的标签页）每 3 分钟读一次，标签页上的“(N) 驾驶舱”和图标红点照样跟着变
setInterval(() => { if (!busy && (!document.hidden || Date.now() - lastLoad >= 175000)) load(); }, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && !busy) load(); });
