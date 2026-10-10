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
const ctx = () => ({ now: new Date(), offline, projectUrls: boot.projectUrls || {}, img: boot.img || {} });

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
    const html = fn(view, c);
    if (node.innerHTML !== html) {
      // 展开着的“AI 在核对”保持展开
      const open = [...node.querySelectorAll('details[open]')].map((d) => d.id).filter(Boolean);
      node.innerHTML = html;
      open.forEach((id) => node.querySelector('#' + CSS.escape(id))?.setAttribute('open', ''));
    }
  }
  const river = window.todayRiver;
  if (river?.ready && view.automation.items.length) river.setSnapshot(riverSnapshot(view), false);
}

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
  const b = e.target instanceof Element ? e.target.closest('[data-copy-ai],[data-copy-ai-all]') : null;
  if (!b) return;
  const ids = b.hasAttribute('data-copy-ai-all') ? view.need_you.map((x) => x.copy_ai_id || x.id) : [b.dataset.copyAi];
  try { await navigator.clipboard.writeText(prompt(ids)); b.dataset.done = '已复制'; } catch { b.dataset.done = '复制不了，请手动选中'; }
  setTimeout(() => delete b.dataset.done, 2500);
});

// 河：脚本就绪就先喂构建时的快照，不让它先显示“读不到”再换
const feedRiver = () => { if (view.automation.items.length) window.todayRiver?.setSnapshot(riverSnapshot(view), true); };
if (window.todayRiver?.ready) feedRiver(); else document.addEventListener('today-river-ready', feedRiver, { once: true });

load();
setInterval(() => { if (!document.hidden && !busy) load(); }, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && !busy) load(); });
