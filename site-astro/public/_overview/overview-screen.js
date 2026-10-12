// 总览屏：驾驶舱第一屏（大号，6 块信号）和首页电脑屏幕（小号，3 块）共用这一份。
// 输入后端给的 overview 对象（字段见 PCConfig 合同 overview.v1：level 取 ok|watch|act|unknown）；这里不算分，只画，并且只判断一件事：数据过期没有。
// 服务端（驾驶舱构建时）import 它画首帧；浏览器里用 <script type="module" src="/_overview/overview-screen.js"> 加载，
// 用 window.OverviewScreen.render(元素, overview, { size: 'big' | 'small' }) 原地更新。
const TZ = 'Asia/Shanghai';
const COLOR = { ok: 'green', watch: 'yellow', act: 'red', unknown: 'gray', neutral: 'neutral' };
const WORD = { ok: '正常', watch: '留意', act: '要处理', unknown: '读不到' };
const LEVEL_WORD = { ok: '稳', watch: '留意', act: '要你处理' };
// 首页小屏放哪 3 块：要你做、电脑、备份——一眼回答“要不要我动手、电脑好不好、东西保住没有”
// 首页小屏的主角是“你待办 N 件”（拍板 1）；下面 3 块：电脑、备份、今天的任务。分数降成一行小字
export const SMALL_SIGNALS = ['computer', 'backup', 'today_tasks'];
const STATUS = { ok: '正常', watch: '留意', act: '有预警' };
const ORDER = ['todo', 'ai_followup', 'computer', 'backup', 'today_tasks', 'security'];
const LABEL = { todo: '要你做', ai_followup: 'AI 在跟', computer: '电脑', backup: '备份', today_tasks: '今天的任务', security: '安全和授权' };

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const parse = (v) => { const t = Date.parse(v || ''); return Number.isFinite(t) ? t : NaN; };
const hm = (t) => new Intl.DateTimeFormat('zh-CN', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(t));

// 线条图标，颜色跟文字走
const ICON = {
  todo: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M3.5 6l1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/>',
  ai_followup: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>',
  computer: '<rect x="3" y="4" width="18" height="12" rx="1.6"/><path d="M8.5 20h7M12 16v4"/>',
  backup: '<path d="M7 18.5a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 8.6a4 4 0 0 1-.5 7.9H16"/><path d="M12 12v8M9 15l3-3 3 3"/>',
  today_tasks: '<rect x="3.5" y="5" width="17" height="15" rx="1.6"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14.5l2.2 2.2L16 13"/>',
  security: '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z"/><rect x="9" y="11" width="6" height="5" rx="1"/><path d="M10.2 11V9.6a1.8 1.8 0 0 1 3.6 0V11"/>',
};
const icon = (id) => `<svg class="ov-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[id] || ICON.computer}</svg>`;

// 过期：现在减 as_of 超过 stale_after_seconds；没有 overview 也按读不到画，结构不变
export function stale(ov, now = Date.now()) {
  if (!ov || typeof ov !== 'object') return true;
  const at = parse(ov.as_of), limit = Number(ov.stale_after_seconds);
  return !Number.isFinite(at) || (Number.isFinite(limit) && limit > 0 && now - at > limit * 1000);
}

function ring(score, color, size) {
  const r = 52, c = 2 * Math.PI * r, p = Number.isFinite(score) ? Math.max(0, Math.min(100, score)) / 100 : 0;
  return `<div class="ov-ring is-${color}"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="ov-track" cx="60" cy="60" r="${r}"/>${p > 0 ? `<circle class="ov-arc" cx="60" cy="60" r="${r}" stroke-dasharray="${(c * p).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 60 60)"/>` : ''}</svg>`
    + `<div class="ov-score">${Number.isFinite(score) ? `<b>${Math.round(score)}</b>${size === 'big' ? '<small>分</small>' : ''}` : '<b class="ov-none">—</b>'}</div></div>`;
}

function signal(s, off) {
  const level = off || s?.locked ? 'unknown' : (s?.level || 'unknown');
  const color = COLOR[level] || 'gray';
  const word = off ? '读不到' : s?.locked ? '锁着' : (s?.word || WORD[level] || '读不到');
  const has = s?.value != null && s.value !== '';
  return `<li class="ov-sig is-${color}${off && has ? ' is-old' : ''}" data-signal="${esc(s?.id)}">${icon(s?.id)}<span class="ov-sig-label">${esc(s?.label || LABEL[s?.id] || '')}</span>`
    + `<span class="ov-sig-value">${has ? esc(s.value) : '—'}${has && s.unit ? `<small>${esc(s.unit)}</small>` : ''}</span>`
    + `<span class="ov-sig-word"><i class="ov-lamp" aria-hidden="true"></i>${esc(word)}${!off && s?.detail ? `<em class="ov-sig-detail">${esc(s.detail)}</em>` : ''}</span></li>`;
}

// 小屏头部：你待办 N 件（件数用后端 owner_count，没有就用“要你做”信号的数）+ 急不急 + 电脑健康分小字
function todoHead(ov, off, at) {
  const todo = (ov?.signals || []).find((x) => x?.id === 'todo') || {};
  const n = off ? NaN : Number.isFinite(ov?.owner_count) ? ov.owner_count : Number(todo.value);
  const urgent = Number.isFinite(ov?.owner_urgent) ? ov.owner_urgent : null;
  const sub = !Number.isFinite(n) ? (Number.isFinite(at) ? `电脑那边没读到（上次 ${hm(at)}）` : '还没读到') : n === 0 ? '现在没有要你做的事' : urgent == null ? '去驾驶舱看是哪几件' : urgent ? `其中 ${urgent} 件急` : '都不急';
  const color = !Number.isFinite(n) ? 'gray' : urgent ? 'red' : n ? 'yellow' : 'green';
  const score = !off && Number.isFinite(ov?.score) ? `电脑健康 ${Math.round(ov.score)}/100 · ${hm(at)} 读到` : '';
  return `<div class="ov-head ov-todo is-${color}"><div class="ov-todo-n">${Number.isFinite(n) ? `<b>${n}</b><span>件<br>你待办</span>` : '<span>你待办</span>'}</div>`
    + `<div class="ov-verdict"><p class="ov-word">${esc(sub)}</p>${score ? `<p class="ov-asof">${esc(score)}</p>` : ''}</div></div>`;
}

// 返回整块 HTML（外框始终同一结构）
export function html(ov, { size = 'big', now = Date.now() } = {}) {
  const off = stale(ov, now);
  const at = parse(ov?.as_of);
  const level = off ? 'unknown' : (ov.level || 'unknown');
  const color = COLOR[level] || 'gray';
  const word = off ? '读不到' : (ov.word || LEVEL_WORD[level] || '读不到');
  const ids = size === 'big' ? ORDER : SMALL_SIGNALS;
  const find = (id) => (ov?.signals || []).find((x) => x?.id === id) || {};
  // 小屏：电脑那块写“正常 / 有预警”而不是“在线”；不正常的块写“交给 AI”，不写没有主语的“要处理”
  // 备份那块的数是“有问题的项数”（后端 backup_problems），写成“0 项有问题”，不写成会被读成“0 项正常”的“0 项 · 正常”
  const small = (s) => (s.id === 'computer' ? { ...s, value: STATUS[s.level] || s.value, unit: '' } : s.id === 'backup' && s.value !== '' && Number.isFinite(Number(s.value)) ? { ...s, unit: '项有问题' } : s);
  // 小屏的颜色只看要不要你出手（和驾驶舱同一规则）：后端给 owner_action=do（或 owner_action_needed=true）才保留红黄、写“要你看”；
  // owner_action=know 用黄写“要你知道”；其余有状况的都是 AI 在管，用中性色写“AI 在管”，不用红色配“交给 AI”
  const owner = (s) => {
    if (!s.level || s.level === 'ok' || s.level === 'unknown') return s;
    if (s.owner_action === 'do' || s.owner_action_needed === true) return { ...s, word: '要你看' };
    if (s.owner_action === 'know') return { ...s, level: 'watch', word: '要你知道' };
    return { ...s, level: 'neutral', word: 'AI 在管' };
  };
  const sigs = ids.map((id) => { const s = { id, ...find(id) }; return signal(size === 'big' ? s : owner(small(s)), off); }).join('');
  const reasons = !off && Array.isArray(ov.reasons) ? ov.reasons : [];
  const line = (r) => `<li>${esc(r.text)}${Number.isFinite(r.delta) && r.delta ? ` <b>${r.delta > 0 ? '+' : '−'}${Math.abs(r.delta)}</b>` : ''}</li>`;
  const rules = !off && Array.isArray(ov.rules) ? ov.rules.map((r) => (typeof r === 'string' ? { text: r } : r)) : [];
  const why = size !== 'big' ? '' : reasons.length
    ? `<ul class="ov-why">${reasons.slice(0, 3).map(line).join('')}</ul>`
      + `<details class="ov-more"><summary>${reasons.length > 3 ? `全部 ${reasons.length} 条扣分 · ` : ''}分数怎么算</summary>${reasons.length > 3 ? `<ul class="ov-why">${reasons.map(line).join('')}</ul>` : ''}${rules.length ? `<ul class="ov-rules">${rules.map(line).join('')}</ul>` : ''}</details>`
    : `<p class="ov-why ov-why-none">${!ov ? '还没读到电脑的总览。' : off ? '电脑那边这会儿没读到，下面灰着的是上次的情况。' : '没有扣分的地方。'}</p>`
      + (rules.length ? `<details class="ov-more"><summary>分数怎么算</summary><ul class="ov-rules">${rules.map(line).join('')}</ul></details>` : '');
  const asof = Number.isFinite(at) ? `<p class="ov-asof">${off ? `（上次 ${hm(at)}）` : hm(at) + ' 读到（北京时间）'}</p>` : '';
  return `<div class="ov ov-${size} is-${color}" role="group" aria-label="电脑总览：${esc(word)}${!off && Number.isFinite(ov?.score) ? `，${Math.round(ov.score)} 分` : ''}">`
    + (size === 'big' ? `<div class="ov-head">${ring(off ? NaN : ov.score, color, size)}<div class="ov-verdict"><p class="ov-word">${esc(word)}</p>${asof}${why}</div></div>` : todoHead(ov, off, at))
    + `<ul class="ov-sigs">${sigs}</ul></div>`;
}

// 分区标题旁的灯：一盏灯 + 一个词，不只靠颜色
export function lamp(sec, off) {
  const level = off || !sec ? 'unknown' : sec.level || 'unknown';
  return `<span class="ov-sec is-${COLOR[level] || 'gray'}"><i class="ov-lamp" aria-hidden="true"></i>${esc(off || !sec ? '读不到' : sec.word || WORD[level] || '读不到')}</span>`;
}

export function render(el, ov, opts = {}) {
  if (!el) return;
  const next = html(ov, opts);
  if (el.innerHTML !== next) {
    const open = el.querySelector('details.ov-more')?.open;
    el.innerHTML = next;
    if (open) el.querySelector('details.ov-more')?.setAttribute('open', '');
  }
}

if (typeof window !== 'undefined') window.OverviewScreen = { render, html, lamp, stale, SMALL_SIGNALS };
