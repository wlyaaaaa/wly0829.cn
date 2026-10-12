// 驾驶舱浏览器端：页面一打开就是构建时那份快照画好的最终版式；这里只负责读新数据、原地换字。
// 每分钟读一次（页面在后台时不读）；刷新按钮叫醒电脑重读，等三个采集器都完成再换。
import { normalize, riverSnapshot, freshAfter } from './model.js';
import { REGIONS } from './render.js';
import { asView } from './full-adapter.js';

const boot = JSON.parse(document.getElementById('cockpit-boot')?.textContent || '{}');
// 本机预览走预览脚本的转发入口，线上走 live（边缘）再退到 mcp
const local = /^(127\.0\.0\.1|localhost|\[::1\])$/.test(location.hostname);
const endpoints = (local ? boot.local : boot.endpoints) || [];
let view = normalize(boot.snapshot ? asView(boot.snapshot) : {});
let offline = false, busy = null;
const ctx = () => ({ now: new Date(), offline, projectUrls: boot.projectUrls || {}, img: boot.img || {}, ov: window.OverviewScreen });

async function read(wake) {
  for (const base of endpoints) {
    const url = new URL(base, location.href);
    if (wake) url.searchParams.set('refresh', '1');
    try {
      const r = await fetch(url, { cache: 'no-store', credentials: 'omit', signal: AbortSignal.timeout(12000) });
      if (!r.ok) continue;
      const v = normalize(asView(await r.json()));
      if (v.ok) return v;
    } catch { /* 换下一个地址 */ }
  }
  return null;
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
  if (b) b.disabled = !card.querySelector('.cp-opt[aria-pressed="true"]');
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

async function load(wake = false) {
  const v = await read(wake);
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

// 复制给 AI：只给条目 id，让 AI 去本机接口读那一条的 ai_hint，不内嵌日志
const prompt = (ids) => ids.map((id) => `驾驶舱条目 ${id}`).join('；') + '：请读本机状态接口（/computer-access/api/status 全量）里这些 id 的条目和 ai_hint，处理后核实，按规矩关闭。';
document.addEventListener('click', async (e) => {
  const b = e.target instanceof Element ? e.target.closest('[data-copy-ai],[data-copy-ai-all],[data-copy-text],[data-copy-answer]') : null;
  if (!b || b.disabled) return;
  // “复制我的答复 / 我做完了 / 不做了 / 问 AI”：只把一段话放进剪贴板，不发任何请求
  const ids = b.hasAttribute('data-copy-ai-all') ? view.need_you.map((x) => x.copy_ai_id || x.id) : [b.dataset.copyAi];
  const text = b.hasAttribute('data-copy-answer') ? answerText(b.closest('.cp-ask'), b) : b.hasAttribute('data-copy-text') ? b.dataset.copyText : prompt(ids);
  try { await navigator.clipboard.writeText(text); b.dataset.done = '已复制，去 AI 对话粘贴发送'; } catch { b.dataset.done = '复制不了，请手动选中'; }
  setTimeout(() => delete b.dataset.done, 2500);
});

// 河：脚本就绪就先喂构建时的快照，不让它先显示“读不到”再换
const feedRiver = () => { if (view.automation.items.length) window.todayRiver?.setSnapshot(riverSnapshot(view), true); };
if (window.todayRiver?.ready) feedRiver(); else document.addEventListener('today-river-ready', feedRiver, { once: true });

load();
setInterval(() => { if (!document.hidden && !busy) load(); }, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && !busy) load(); });
