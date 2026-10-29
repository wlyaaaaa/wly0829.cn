// 驾驶舱浏览器端：页面一打开就是构建时那份快照画好的最终版式；这里只负责读新数据、原地换字。
// 每分钟读一次（页面在后台时不读）；刷新按钮叫醒电脑重读，等三个采集器都完成再换。
import { normalize, riverSnapshot, freshAfter } from './model.js';
import { REGIONS, PICK_FIRST, COPY_HINT, aiPrompt, promptIds } from './render.js';

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
const ctx = () => ({ now: new Date(), offline, notice, phase: shown ? 'live' : 'snapshot', projectUrls: boot.projectUrls || {}, img: boot.img || {}, ov: window.OverviewScreen });

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
      // 展开着的“AI 在核对”保持展开；卡片上已经选的答案和写的补充，换字时原样留着
      const open = [...node.querySelectorAll('details[open]')].map((d) => d.id).filter(Boolean);
      const answers = saveAnswers(node);
      node.innerHTML = html;
      open.forEach((id) => node.querySelector('#' + CSS.escape(id))?.setAttribute('open', ''));
      restoreAnswers(node, answers);
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
