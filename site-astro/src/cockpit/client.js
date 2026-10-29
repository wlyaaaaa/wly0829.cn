// 驾驶舱浏览器端：页面一打开就是构建时那份快照画好的最终版式；这里只负责读新数据、原地换字。
// 每分钟读一次（页面在后台时不读）；刷新按钮叫醒电脑重读，等三个采集器都完成再换。
import { normalize, riverSnapshot, freshAfter } from './model.js';
import { REGIONS, PICK_FIRST, COPY_HINT, aiPrompt, promptIds } from './render.js';
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
const ctx = () => ({ now: new Date(), offline, notice, phase: shown ? 'live' : 'snapshot', projectUrls: boot.projectUrls || {}, img: boot.img || {}, ov: window.OverviewScreen, act });

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
      // 展开着的“AI 在核对”保持展开；卡片上已经选的答案和写的补充，换字时原样留着；正在按的按钮、正在写的框换字后仍有焦点
      const open = [...node.querySelectorAll('details[open]')].map((d) => d.id).filter(Boolean);
      const answers = saveAnswers(node);
      const focus = document.activeElement && node.contains(document.activeElement) ? focusKey(document.activeElement) : null;
      node.innerHTML = html;
      open.forEach((id) => node.querySelector('#' + CSS.escape(id))?.setAttribute('open', ''));
      restoreAnswers(node, answers);
      if (focus) refocus(node, focus);
    }
  }
  const river = window.todayRiver;
  if (river?.ready && view.automation.items.length) river.setSnapshot(riverSnapshot(view), false);
  // 读到新数据后还找不到的（条目已经办完关掉了），不再惦记，免得过一会儿突然跳走
  if (wanted && shown && !reveal(true) && !offline) wanted = '';
}

// 卡片上的题：单选，再点一次取消；至少选了一题，“复制我的答复”才能点
const qKey = (q) => (q.closest('.cp-ask')?.id || '') + '/' + q.dataset.q;
function saveAnswers(node) {
  return [...node.querySelectorAll('.cp-q')].map((q) => ({ key: qKey(q), opt: q.querySelector('.cp-opt[aria-pressed="true"]')?.dataset.opt, note: q.querySelector('[data-note]')?.value || '' })).filter((a) => a.opt || a.note);
}
function restoreAnswers(node, answers) {
  for (const a of answers) {
    const q = [...node.querySelectorAll('.cp-q')].find((x) => qKey(x) === a.key);
    if (!q) continue;
    q.querySelectorAll('.cp-opt').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.opt === a.opt)));
    const n = q.querySelector('[data-note]'); if (n) n.value = a.note;
  }
  node.querySelectorAll('.cp-ask').forEach(syncAnswer);
}
function syncAnswer(card) {
  const b = card.querySelector('[data-copy-answer]');
  if (!b) return;
  b.disabled = !card.querySelector('.cp-opt[aria-pressed="true"]');
  const hint = card.querySelector('.cp-hint');
  if (hint) hint.textContent = b.disabled ? PICK_FIRST : COPY_HINT;
}
function answerText(card, b) {
  const qs = [...card.querySelectorAll('.cp-q')];
  const parts = qs.map((q) => {
    const opt = q.querySelector('.cp-opt[aria-pressed="true"]')?.dataset.opt;
    if (!opt) return '';
    const head = qs.length > 1 || q.dataset.qtext ? `第${q.dataset.qn}题${q.dataset.qtext ? ' ' + q.dataset.qtext : ''}→` : '';
    return head + opt;
  }).filter(Boolean);
  const notes = qs.map((q) => q.querySelector('[data-note]')?.value.trim()).filter(Boolean);
  return `${b.dataset.ref}关于${b.dataset.name}，我的答复：${parts.join('；')}${notes.length ? `；补充：${notes.join('；')}` : ''}`;
}
document.addEventListener('click', (e) => {
  const o = e.target instanceof Element ? e.target.closest('.cp-q .cp-opt') : null;
  if (!o) return;
  const on = o.getAttribute('aria-pressed') !== 'true';
  o.closest('.cp-q').querySelectorAll('.cp-opt').forEach((b) => b.setAttribute('aria-pressed', 'false'));
  o.setAttribute('aria-pressed', String(on));
  syncAnswer(o.closest('.cp-ask'));
});

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
  if (AI_ACTIONS.includes(action) && !body.executor) body.executor = u.executor === 'gpt' ? 'gpt' : 'claude';
  if (box.dataset.ver) try { body.item_version = JSON.parse(box.dataset.ver); } catch { /* 没有版本就不带 */ }
  act.state.set(id, { phase: 'sending', action, executor: body.executor });
  paint();
  const res = await post(ACTIONS_URL, body);
  if (res.ok && typeof res.j?.id === 'string') { act.state.set(id, { phase: 'done', action, executor: body.executor, receipt: res.j }); act.ui.delete(id); }
  else act.state.set(id, { phase: 'error', action, executor: body.executor, error: failText(res), refresh: res.status === 409 && res.j?.error === 'cockpit_item_changed' });
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
document.addEventListener('click', (e) => {
  const el = e.target instanceof Element ? e.target.closest('[data-act],[data-send],[data-snooze],[data-exec],[data-undo],[data-oa-refresh],[data-recent-undo],.cp-oa-q .cp-opt') : null;
  if (!el || el.disabled) return;
  if (el.dataset.recentUndo) return void undo(el.dataset.recentUndo, null);
  const box = el.closest('[data-oa]');
  if (!box) return;
  const id = box.dataset.oa, u = uiOf(id);
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
    if (u.open === 'note' || u.open === 'redo') document.querySelector(`[data-oa="${CSS.escape(id)}"] [data-text]`)?.focus();
    return;
  }
  if (a === 'switch') return void submit(box, 'switch', { executor: el.dataset.to === 'gpt' ? 'gpt' : 'claude' });
  submit(box, a); // 看见了、知道了、办好了、不用了、确认：直接交，不加二次确认（误点靠撤回）
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
const FOCUS = ['act', 'send', 'exec', 'snooze', 'snoozeDate', 'undo', 'text', 'qnote', 'val', 'oaRefresh'];
function focusKey(el) {
  const box = el.closest('[data-oa]');
  const k = box && FOCUS.find((x) => x in el.dataset);
  return k ? [box.dataset.oa, el.closest('[data-qid]')?.dataset.qid || '', k, el.dataset[k]].join('\u0001') : null;
}
function refocus(node, key) {
  const el = [...node.querySelectorAll('[data-oa] button, [data-oa] input, [data-oa] textarea')].find((x) => focusKey(x) === key);
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
async function load(wake = false) {
  const turn = ++asked;
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

// 复制给 AI：只给条目编号；提示词由 render.js 的 aiPrompt 生成——让 AI 用电脑 MCP 或在本机读驾驶舱待办登记和来源登记，
// 不去公开状态接口找细节（那里已不带 AI 侧自由文本），不写本机路径、不内嵌正文
document.addEventListener('click', async (e) => {
  const b = e.target instanceof Element ? e.target.closest('[data-copy-ai],[data-copy-ai-all],[data-copy-text],[data-copy-answer]') : null;
  if (!b || b.disabled) return;
  // “复制我的答复 / 我做完了 / 不做了 / 问 AI”：只把一段话放进剪贴板，不发任何请求
  const ids = b.hasAttribute('data-copy-ai-all') ? promptIds(view.need_you) : [b.dataset.copyAi];
  const text = b.hasAttribute('data-copy-answer') ? answerText(b.closest('.cp-ask'), b) : b.hasAttribute('data-copy-text') ? b.dataset.copyText : aiPrompt(ids);
  try { await navigator.clipboard.writeText(text); b.dataset.done = '已复制，去 AI 对话粘贴发送'; } catch { b.dataset.done = '复制不了，请手动选中'; }
  setTimeout(() => delete b.dataset.done, 2500);
});

// 河：脚本就绪就先喂构建时的快照，不让它先显示“读不到”再换
const feedRiver = () => { if (view.automation.items.length) window.todayRiver?.setSnapshot(riverSnapshot(view), true); };
if (window.todayRiver?.ready) feedRiver(); else document.addEventListener('today-river-ready', feedRiver, { once: true });

// 打开 /cockpit/#<条目编号>（手机通知、远程卡的“间歇断开的情况看这里”等）：找到那一条，先打开外面的折叠，滚过去并高亮几秒。
// 认两种写法：页面元素自己的 id（如 todo-…、know-…、ai-running），或条目原编号（每条的 data-items 里）。
// 首帧是构建时的旧数，新条目要等第一次读到新数据才画出来，所以没找到时记着，每次换字后再找一次。
const hashId = () => { try { return decodeURIComponent(location.hash.slice(1)).trim(); } catch { return ''; } };
// 分区落点（#need-you、#tasks、项目名等）照浏览器原样跳，不高亮；只认条目
function findItem(id) {
  if (!id || id.startsWith('pair=')) return null;
  const own = document.getElementById(id);
  if (own) return own.matches('[data-items], #ai-running') || /^(todo|know)-/.test(id) ? own : null;
  return [...document.querySelectorAll('[data-items]')].find((n) => n.dataset.items.split(' ').includes(id)) || null;
}
// final：已经是读到新数据后的那一版，找到就不再惦记；首帧（构建时的旧数）上先跳一次，读到新数据换字后再对准一次
function reveal(final) {
  const target = findItem(wanted);
  if (!target) return false;
  if (final) wanted = '';
  for (let p = target.parentElement; p; p = p.parentElement) if (p.tagName === 'DETAILS') p.open = true;
  target.scrollIntoView({ block: 'start' });
  target.classList.remove('cp-hit');
  void target.offsetWidth; // 同一条再点一次也重新闪
  target.classList.add('cp-hit');
  setTimeout(() => target.classList.remove('cp-hit'), 4000);
  return true;
}
window.addEventListener('hashchange', () => { wanted = hashId(); reveal(shown > 0); });
wanted = hashId();
reveal(false);

pair().finally(() => load());
setInterval(() => { if (!document.hidden && !busy) load(); }, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && !busy) load(); });
