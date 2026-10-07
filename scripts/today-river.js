// Derived from the owner-approved river2.template.html; no embedded task records.
(() => {
'use strict';
const SPEED = 2.5;                 // 整体速度：水、船、灯、开场都按这个倍数走，只改这一个数
const GATE = 47;                   // “现在”那排浮标在河的哪里（横向百分比）
const KEEP = 5;                    // 浮标两边，河面上各留几条写着名字的船
const DOCK = 16;                   // 每个码头最多画几条船，再多只写在木牌和日志里
const I = { reveal: 3.6, gate: .8, clock: [2, 12], future: 3.2, fleet: 4.2, lamps: 4.8, signs: 1.5, end: 16.5 };   // 开场各段从什么时候开始（按动效自己的时间算，真实时间是它除以 SPEED；整段开场真实约 6 秒）

const host = document.querySelector('[data-today-river]'); if (!host) return;
host.id = 'today-river'; host.innerHTML = "<div class=\"wrap\">\n  <h3>今天的河</h3>\n  <p id=\"headline\" role=\"status\">暂时读不到电脑，还没读到今天的自动任务。</p>\n  <p class=\"when\" id=\"when\"></p>\n  <div id=\"alerts\"></div>\n  <div id=\"scroller\" hidden>\n    <div id=\"stage\" aria-label=\"今天的河：电脑上自动任务今天的情况\">\n      <div id=\"paper\"></div><canvas id=\"water\"></canvas><div id=\"layer\"></div><div id=\"tip\"></div>\n    </div>\n  </div>\n  <p class=\"hint\" hidden>左右滑动，可以看整条河。</p>\n  <div class=\"legend\" id=\"legend\" hidden></div>\n  <div class=\"card\" id=\"pick\" hidden></div>\n  <div class=\"card\" id=\"log\" hidden></div>\n</div>";
const GEOM = {"aspect": 1.722, "top": [17.15, 17.04, 16.82, 16.82, 14.46, 14.8, 15.02, 15.47, 17.83, 19.39, 20.96, 20.4, 17.6, 16.59, 16.03, 16.82, 19.73, 20.4, 20.52, 20.18, 20.52, 22.42, 20.74, 22.42, 22.65, 23.09, 23.32, 20.85, 20.74, 21.41, 23.32, 22.09, 22.09, 22.53, 22.53, 22.2, 22.87, 22.42, 21.3, 20.4, 20.29, 20.18, 20.4, 21.52, 21.64, 21.52, 21.75, 21.86, 21.52, 21.64, 22.31, 23.65, 24.55, 24.66, 24.66, 24.33, 23.54, 21.97, 21.75, 22.09, 21.08, 20.85, 23.77, 23.88, 24.1, 23.99, 23.09, 20.07, 18.27, 16.59, 16.93, 18.16, 18.05, 18.27, 18.5, 15.25, 15.47, 15.13, 13.34, 17.6, 17.83, 16.48, 14.13, 13.45, 17.15, 17.83, 18.72, 18.5, 17.83, 18.16, 18.27, 18.27, 18.05, 16.59, 18.05, 18.05, 17.49], "bot": [62.11, 61.66, 61.1, 61.1, 61.77, 66.14, 65.81, 67.49, 67.26, 66.14, 66.14, 66.48, 66.48, 66.82, 67.15, 67.49, 67.83, 68.05, 72.2, 69.17, 70.07, 70.74, 70.74, 69.73, 69.17, 69.39, 69.51, 69.84, 69.51, 69.06, 72.09, 72.98, 74.66, 75.22, 70.07, 74.66, 74.1, 74.44, 73.32, 73.88, 74.33, 74.78, 75.34, 75.22, 74.22, 73.54, 73.21, 72.2, 71.41, 72.2, 74.78, 76.35, 77.02, 78.14, 77.69, 77.91, 79.04, 75.67, 74.44, 72.98, 72.09, 71.97, 72.2, 72.09, 72.87, 73.54, 73.32, 72.65, 74.78, 73.54, 72.76, 70.07, 69.51, 69.73, 69.28, 69.28, 69.51, 69.73, 71.41, 71.08, 71.52, 71.97, 72.53, 69.06, 68.95, 68.83, 69.84, 70.07, 69.73, 69.51, 68.83, 68.5, 68.05, 67.38, 67.38, 67.38, 68.05], "boats": [{"w": 360, "h": 118}, {"w": 360, "h": 134}, {"w": 360, "h": 113}, {"w": 360, "h": 116}]}, $ = s => host.querySelector(s), root = host;
const riverAssets = JSON.parse(document.querySelector('#page-data')?.textContent || '{}').today_river_assets;
const asset = name => riverAssets?.[name] || new URL('./today-river-assets2/' + name, import.meta.url).href;
const BIRD = {"idle": {"w": 122, "h": 97, "fx": 83.8, "fy": 93.6}, "look": {"w": 117, "h": 97, "fx": 85.5, "fy": 93.4}, "tilt": {"w": 125, "h": 93, "fx": 84.3, "fy": 89.1}, "sing": {"w": 123, "h": 108, "fx": 85.9, "fy": 104.7}, "sleep": {"w": 116, "h": 78, "fx": 80.6, "fy": 75.2}};
for (const [pose, meta] of Object.entries(BIRD)) meta.src = asset('bird-' + pose + '.webp');
const stage = $('#stage'), layer = $('#layer'), tip = $('#tip'), canvas = $('#water');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
root.style.setProperty('--speed', SPEED); stage.style.setProperty('--aspect', GEOM.aspect);
stage.style.setProperty('--river', `url("${asset('river.webp')}")`);
for (let i = 0; i < 4; i++) stage.style.setProperty('--b' + i, `url("${asset('boat' + i + '.webp')}")`);

// ---------- 小工具 ----------
const mk = (tag, cls, parent, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const parse = s => typeof s === 'string' && /(?:Z|[+-]\d{2}:\d{2})$/.test(s) ? Date.parse(s.replace(/(\.\d{3})\d+/, '$1')) : NaN;
const bj = ms => new Date(ms + 8 * 3600e3), pad = n => String(n).padStart(2, '0');           // 一律按北京时间读，不跟浏览器的时区走
const hm = ms => { const d = bj(ms); return pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()); };
const dkey = ms => Math.floor((ms + 8 * 3600e3) / 864e5);
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const span = min => min < 1 ? '不到 1 分钟' : min < 60 ? `${Math.round(min)} 分钟` : `${Math.floor(min / 60)} 小时${Math.round(min % 60) ? ' ' + Math.round(min % 60) + ' 分' : ''}`;
const smooth = arr => { const a = arr.map(v => v ?? arr.find(x => x != null)); return a.map((_, i) => { let s = 0, n = 0; for (let k = -3; k <= 3; k++) if (a[i + k] != null) { s += a[i + k]; n++; } return s / n; }); };
const TOP = smooth(GEOM.top), BOT = smooth(GEOM.bot);
const at = (arr, x) => { const f = clamp(x / 100) * (arr.length - 1), i = Math.floor(f), j = Math.min(arr.length - 1, i + 1); return arr[i] + (arr[j] - arr[i]) * (f - i); };
const range = (a, b, step) => { const r = []; for (let x = a; x <= b + 1e-6; x += step) r.push(x); return r; };
const ease3 = u => 1 - (1 - u) ** 3, sstep = u => u * u * (3 - 2 * u);
const FLAG = '<svg class="flag" viewBox="0 0 20 26" aria-hidden="true"><path class="pole" d="M3 25V2"/><path class="cloth" d="M3.6 2.5C8 1 11 5 17 3.2C15 6 15.5 8 17.5 10.6C11 12.4 8 8.6 3.6 10.8Z"/></svg>';

// 河面上写着名字的船停在哪（离浮标最近的排最前）；码头、岸上、雾里各在哪
const SLOT = { future: [[56.5, 44], [64, 36.5], [68.5, 51.5], [78, 37], [82.5, 52]], past: [[37.5, 44], [30, 36.5], [25.5, 51.5], [16, 37], [11.5, 52]] };
const DOCKS = { done: [...range(31, 44.5, 2.25).reverse(), ...range(3.5, 22, 2.25).reverse()], wait: [...range(52, 69.5, 2.25), ...range(79.5, 97, 2.25)] };
const SHORE = [[23.5, 85.6, -12], [27.2, 87.6, 14], [30.8, 85.2, -4], [34.4, 87.8, 9], [38, 85.6, -16], [41, 88, 6]];
const MIST = [[93, 37, -3], [96.3, 46, 4], [92.4, 55, -2]];

// ---------- 把每个任务分到它该在的地方 ----------
function sort(snap) {
  const A = snap.automation, now = parse(A.observed_at) || parse(snap.captured_at), today = dkey(now), dayStart = today * 864e5 - 8 * 3600e3;
  const groups = Object.fromEntries((A.groups || []).map(g => [g.id, g.name]));
  const every = t => { const s = t.schedule_zh || ''; let m; if (/每分钟一次/.test(s)) return 1; if ((m = /每\s*(\d+)\s*分钟一次/.exec(s))) return +m[1]; if ((m = /每\s*(\d+)\s*秒/.exec(s))) return +m[1] / 60; return Infinity; };
  const tasks = (A.items || []).map((raw, i) => {
    const t = { raw, i, name: raw.plain?.name || '没写名字的任务', group: groups[raw.group] || '', last: parse(raw.last_run_at), next: parse(raw.next_run_at), every: every(raw) };
    t.note = raw.status_note || raw.plain?.status_note || raw.reason || '';
    t.off = raw.enabled === false || raw.state === 'disabled';
    t.flag = raw.state === 'failed' ? 'bad' : ['warn', 'overdue', 'stale'].includes(raw.state) ? 'warn' : ['success', 'running'].includes(raw.state) ? 'ok' : 'gray';
    t.alert = !t.off && (t.flag === 'bad' || t.flag === 'warn');
    // 守护：一直开着的，或者每隔半小时以内就查一趟的。它们不算“一趟一趟的船”，是岸边的灯
    t.guard = !t.off && !['unknown', 'never'].includes(raw.state) && (raw.state === 'running' || t.every <= 30 || /常驻/.test(raw.schedule_zh || ''));
    t.ran = !t.off && !t.guard && t.last <= now && dkey(t.last) === today;
    t.coming = !t.off && !t.guard && dkey(t.next) === today && (t.next > now || !(t.last >= t.next));
    t.home = t.off ? 'off' : t.guard ? 'guard' : (t.ran || t.coming || t.alert) ? 'trip' : raw.state === 'unknown' ? 'fog' : (raw.state === 'never' && !(t.next > now)) ? 'off' : 'idle';
    return t;
  });
  const rank = t => t.flag === 'bad' ? 0 : t.flag === 'warn' ? 1 : 2;
  const past = tasks.filter(t => t.ran || (t.home === 'trip' && t.alert && !t.ran)).map(t => ({ t, at: t.last, kind: 'past' })).sort((a, b) => rank(a.t) - rank(b.t) || (b.at || 0) - (a.at || 0));
  const future = tasks.filter(t => t.coming).map(t => ({ t, at: t.next, kind: 'future' })).sort((a, b) => a.at - b.at);
  const by = h => tasks.filter(t => t.home === h);
  const guards = by('guard').sort((a, b) => rank(a) - rank(b) || a.every - b.every);
  return { snap, A, now, today, dayStart, tasks, past, future, guards, idle: by('idle'), off: by('off'), fog: by('fog'),
           alerts: tasks.filter(t => t.alert).sort((a, b) => rank(a) - rank(b)), stale: !!snap.reason || ['unknown', 'unavailable', 'stale'].includes(A.state) };
}
const whenText = (M, ms) => { if (!(ms > 0)) return ''; const d = dkey(ms) - M.today, b = bj(ms); return (d === 0 ? '今天 ' : d === -1 ? '昨天 ' : d === 1 ? '明天 ' : `${b.getUTCMonth() + 1} 月 ${b.getUTCDate()} 日 `) + hm(ms); };
const STATE = { ok: '正常', bad: '出错了', warn: '要留意', gray: '还不知道' };
const frequency = (t, once = false) => {
  const s = t.every < 1 ? `每 ${Math.round(t.every * 60)} 秒` : t.every === 1 ? '每分钟' : t.every <= 30 ? `每 ${t.every} 分钟` : '常驻';
  return s + (once && t.every <= 30 ? '一次' : '');
};
function stateOf(t) {
  if (t.off) return ['gray', '已停用'];
  if (t.raw.state === 'overdue') return ['warn', '过期'];
  if (t.flag === 'bad' || t.flag === 'warn') return [t.flag, STATE[t.flag]];
  if (t.raw.state === 'running') return ['ok', '正在运行'];
  if (t.raw.state === 'never') return ['gray', '还没跑过'];
  if (t.raw.state === 'unknown') return ['gray', '没读到结果'];
  return ['ok', '上次运行正常'];
}

// ---------- 选中一条：那六样 ----------
const v = x => x ? esc(x) : '<span class="none">还没写</span>';
function six(M, t) {
  const [cls, word] = stateOf(t), r = t.raw;
  const err = t.off ? '已停用，不算出错' : r.state === 'overdue' ? '过期' + (t.note ? '：' + t.note : '') : t.flag === 'bad' ? '出错了' + (t.note ? '：' + t.note : '') : t.flag === 'warn' ? '要留意' + (t.note ? '：' + t.note : '') :
    r.state === 'unknown' ? '不知道，这次没读到它的运行结果' : r.state === 'never' ? '还没跑过，谈不上出错' : r.state === 'running' ? '没有，正在运行' : '没有，上次运行正常';
  const next = t.off ? '已停用，不会自动跑' : t.next > M.now ? whenText(M, t.next) + (r.schedule_zh ? `（${r.schedule_zh}）` : '') : r.schedule_zh || '';
  return `<h4>${esc(t.name)}<span class="state ${cls}">${word}</span><small>${esc(t.group)}</small></h4><div class="six">
    <div><b>在做什么</b>${v(r.plain?.what)}</div><div><b>上次什么时候跑的</b>${t.last > 0 ? esc(whenText(M, t.last)) : '<span class="none">' + (r.state === 'never' ? '还没跑过' : '没读到') + '</span>'}</div>
    <div><b>下次什么时候跑</b>${next ? esc(next) : '<span class="none">没读到</span>'}</div><div><b>有没有出错</b>${esc(err)}</div>
    <div><b>怎么停</b>${v(r.plain?.stop)}</div><div><b>停了影响什么</b>${v(r.plain?.impact)}</div></div>`;
}

// ---------- 画面 ----------
let M = null, acts = [], wakes = [], els = new Map();
const put = (e, x, y) => { if (e.classList.contains('boat')) { e.style.left = e.style.top = '0'; e.style.transform = `translate(${x}em,${y / GEOM.aspect}em) translate(-50%,-50%)`; } else { e.style.left = x + '%'; e.style.top = y + '%'; } };
const remember = (t, e) => { if (!els.has(t.i)) els.set(t.i, []); els.get(t.i).push(e); };
function boat(o) {
  const S = GEOM.boats[o.sprite], b = mk('button', 'boat ' + (o.cls || ''), layer); b.type = 'button';
  b.style.cssText = `--w:${o.w};--img:var(--b${o.sprite});--ar:${(S.w / S.h).toFixed(3)};--rot:${o.rot || 0}deg;--bd:${(-rnd() * 4).toFixed(2)}s;--bp:${(12.5 + rnd() * 5).toFixed(1)}s`;
  put(b, o.x, o.y);
  const bob = mk('span', 'bob', b); mk('span', 'hull', bob);
  if (o.flag) { bob.insertAdjacentHTML('beforeend', FLAG); b.classList.add('f-' + o.flag); }
  if (o.tag) o.tagEl = mk('span', 'tag' + (o.lead ? ' lead' : ''), b, o.tag);
  b.setAttribute('aria-label', o.t.name); b.dataset.i = o.t.i; if (o.tip) b.dataset.tip = o.tip;
  remember(o.t, b); o.el = b; o.s = 0; return o;
}
const spriteOf = t => ({ backup: 2, ai: 1, daily: 1, upkeep: 3, remote: 3 }[t.raw.group] ?? 0);   // 备份的船载着货，自己的日常和 AI 的船有篷，维护和远程的带桨，别的软件的是空船
const sign = (x, y, html, key, cls) => { const s = mk(key ? 'button' : 'div', 'sign ' + (cls || ''), layer, html); if (key) { s.type = 'button'; s.onclick = () => openGroup(key); } put(s, x, y); return s; };

function build(snap) {
  M = sort(snap); acts = []; wakes = []; els = new Map(); layer.textContent = ''; seed = 11;
  const { now, dayStart } = M, nowMin = Math.max(1, (now - dayStart) / 6e4);
  const tcOf = ms => I.clock[0] + (I.clock[1] - I.clock[0]) * clamp((ms - dayStart) / 6e4 / nowMin);       // 开场里钟走到这条船的时间，它就过浮标
  M.night = nightOf(now); stage.style.setProperty('--night', M.night.n.toFixed(3)); stage.classList.toggle('stale', M.stale);

  // 雾（放最底下）
  const fog = mk('div', 'fog', layer, '<i></i><i></i>'); acts.push(tb => fog.classList.toggle('in', tb >= I.fleet && M.fog.length > 0));
  M.fog.slice(0, MIST.length).forEach((t, k) => { const o = boat({ t, x: MIST[k][0], y: MIST[k][1], w: 4.3, rot: MIST[k][2], sprite: spriteOf(t), cls: 'misty', tip: '在雾里：这次没读到它的结果' });
    acts.push(tb => o.el.classList.toggle('in', tb >= I.fleet + .5 * k)); });

  // 浮标：上下两段，中间留一个口子给船过
  const y0 = at(TOP, GATE) + 2.5, y1 = at(BOT, GATE) - 3, gap = [38.2, 49.8];
  [[y0, gap[0]], [gap[1], y1]].forEach(([a, b]) => { const r = mk('div', 'rope', layer); put(r, GATE, a); r.style.height = (b - a) + '%'; });
  const n0 = Math.max(1, Math.round((gap[0] - y0) / 6)), n1 = Math.max(1, Math.round((y1 - gap[1]) / 6));
  const ys = [...Array.from({ length: n0 }, (_, k) => y0 + (gap[0] - y0) * k / n0), gap[0], gap[1], ...Array.from({ length: n1 }, (_, k) => gap[1] + (y1 - gap[1]) * (k + 1) / n1)];
  ys.forEach((y, k) => { const b = mk('i', 'buoy' + (y === gap[0] || y === gap[1] ? ' big' : ''), layer); put(b, GATE, y); b.style.setProperty('--bd', (-rnd() * 3).toFixed(2) + 's');
    acts.push(tb => b.classList.toggle('in', tb >= I.gate + k * .15)); });

  // 岸上：今天不出航的、停用的，各挑几条画出来，全部的数写在木牌上
  const ashore = [...M.idle, ...M.off], pool = [];
  for (let k = 0; k < SHORE.length; k++) { const t = (k % 2 ? M.off : M.idle)[k >> 1]; if (t) pool.push(t); }
  for (const t of ashore) { if (pool.length >= SHORE.length) break; if (!pool.includes(t)) pool.push(t); }
  pool.forEach((t, k) => { const p = SHORE[k], o = boat({ t, x: p[0], y: p[1], w: 3.9, rot: p[2], sprite: spriteOf(t), cls: 'ashore' + (t.home === 'off' ? ' off' : ''), tip: t.home === 'off' ? '在岸上：停用，或者从没跑过' : '在岸上：今天没有安排' });
    acts.push(tb => o.el.classList.toggle('in', tb >= I.fleet + .2 * k)); });

  // 跑完的：最近几条留在河面上，更早的靠到左上的码头
  M.past.forEach((trip, k) => {
    const t = trip.t, onWater = k < KEEP; if (!onWater && k - KEEP >= DOCK) return;
    const E = onWater ? SLOT.past[k] : [DOCKS.done[k - KEEP], at(TOP, DOCKS.done[k - KEEP]) + 4.9], isToday = dkey(trip.at) === M.today;
    const timeTxt = isToday ? hm(trip.at) : whenText(M, trip.at) || '—';
    const o = boat({ t, x: E[0], y: E[1], w: onWater ? 6.2 : 4.4, sprite: spriteOf(t), flag: t.flag, cls: onWater ? '' : 'moored in move',
      tag: onWater ? `<b>${esc(timeTxt)}</b>${esc(t.name)}` : null, tip: `${trip.at > 0 ? timeTxt + ' 跑完' : '上次时间没读到'} · ${t.flag === 'ok' ? '正常' : stateOf(t)[1]}` });
    const tc = isToday ? tcOf(trip.at) : I.clock[0], t0 = tc - 1.5, t1 = tc + (onWater ? 3 : 4), S = [53.5, k % 2 ? 51.5 : 36.5];
    const ring = mk('i', 'ring', layer); put(ring, GATE, 44); wakes.push(o);
    acts.push(tb => {
      let x, y, op = 1, s, rot = onWater ? 0 : 90;
      if (tb <= t0) { x = S[0]; y = S[1]; op = 0; s = 0; rot = 0; }
      else if (tb < tc) { const u = (tb - t0) / (tc - t0); x = S[0] + (GATE - S[0]) * u * u; y = S[1] + (44 - S[1]) * sstep(u); op = Math.min(1, u * 3); s = 1; rot = 0; }
      else { const u = clamp((tb - tc) / (t1 - tc)); x = GATE + (E[0] - GATE) * ease3(u); y = 44 + (E[1] - 44) * sstep(u); s = onWater ? 1 - .3 * u : 1 - u; if (!onWater) rot = 90 * sstep(clamp((u - .45) / .55)); }
      put(o.el, x, y); o.el.style.opacity = op; o.x = x; o.y = y; o.s = s * op; if (!onWater) o.el.style.setProperty('--rot', rot + 'deg');
      o.el.classList.toggle('flagged', tb >= tc); if (o.tagEl) o.tagEl.classList.toggle('show', tb >= t1 - .5);
      const ru = (tb - tc) / 2.4; ring.style.opacity = ru > 0 && ru < 1 ? (1 - ru) * .9 : 0; ring.style.transform = `scale(${.25 + 1.5 * clamp(ru)})`;
    });
  });

  // 要来的：最近几条在河面上朝浮标划，其余的在右下的码头等着
  M.future.forEach((trip, k) => {
    const t = trip.t, onWater = k < KEEP; if (!onWater && k - KEEP >= DOCK) return;
    const left = (trip.at - now) / 6e4, timeTxt = hm(trip.at), sp = spriteOf(t);
    if (onWater) {
      const E = SLOT.future[k], t0 = I.future + k * .5, t1 = t0 + 4;
      const o = boat({ t, x: E[0], y: E[1], w: 6.2, sprite: sp, lead: k === 0, tag: `<b>${timeTxt}</b>${esc(t.name)}` + (k === 0 && !M.stale ? `<i>${left <= 0 ? '到点了' : '还有 ' + span(left)}</i>` : ''), tip: `${timeTxt} 出发${M.stale ? '' : left > 0 ? ' · 还有 ' + span(left) : ' · 到点了，还没读到它跑完'}` });
      wakes.push(o);
      acts.push(tb => { const u = clamp((tb - t0) / (t1 - t0)), x = E[0] + 15 * (1 - ease3(u)), op = Math.min(1, u * 4); put(o.el, x, E[1]); o.el.style.opacity = op; o.x = x; o.y = E[1]; o.s = (1 - .3 * u) * op;
        o.tagEl.classList.toggle('show', tb >= t1 - .8); });
    } else {
      const x = DOCKS.wait[k - KEEP], o = boat({ t, x, y: at(BOT, x) - 5.2, w: 4.4, rot: 90, sprite: sp, cls: 'moored', tip: `${timeTxt} 出发 · 在码头等着` });
      acts.push(tb => o.el.classList.toggle('in', tb >= I.fleet + (k - KEEP) * .1));
    }
  });

  // 一直在岗的守护：岸边的灯
  const nG = M.guards.length;
  M.guards.forEach((t, k) => {
    const x = nG > 1 ? 50 + 47.2 * k / (nG - 1) : 73, l = mk('button', 'lamp' + (t.flag === 'bad' ? ' l-bad' : t.flag === 'warn' ? ' l-warn' : '') + (t.every <= 30 ? ' beat' : ''), layer, '<i class="glow"></i><i class="post"></i><i class="lit"></i>');
    l.type = 'button'; put(l, x, at(TOP, x) - .4); l.style.setProperty('--bd', (-rnd() * 5).toFixed(2) + 's'); l.dataset.i = t.i; l.setAttribute('aria-label', t.name);
    l.dataset.tip = t.alert ? stateOf(t)[1] : t.raw.state === 'running' ? '正在运行' + (t.every <= 30 ? ' · ' + frequency(t, true) : '') : frequency(t, true) + ' · 上次正常';
    remember(t, l); acts.push(tb => l.classList.toggle('lit', tb >= I.lamps + k * (nG > 1 ? 5 / (nG - 1) : 0)));   // 一盏一盏点亮，前后约 2 秒
  });

  // 木牌和钟
  const nowSign = sign(GATE, 11.5, `现在 <b>${hm(Date.now())}</b>`, null, 'now'), nowB = nowSign.querySelector('b');
  acts.push(() => { nowB.textContent = hm(Date.now()); });
  perch(nowSign);
  const ranToday = M.past.filter(p => p.t.ran).length;
  const signs = [nowSign, sign(13, 10.5, `${M.stale ? '当时' : '今天'}已跑完 <b>${ranToday}</b> 个`, 'past'), sign(74, 9.5, `常驻和高频 <b>${nG}</b> 个`, 'guard'),
    sign(88, 82.5, `${M.stale ? '当时' : ''}还有 <b>${M.future.length}</b> 个要跑`, 'future'), sign(32, 80.3, `岸上 <b>${ashore.length}</b> 个`, M.idle.length ? 'idle' : 'off'), M.fog.length ? sign(94.6, 29.5, `雾里 <b>${M.fog.length}</b> 个`, 'fog') : null].filter(Boolean);
  signs.forEach((s, k) => acts.push(tb => s.classList.toggle('in', tb >= I.signs + k * .5)));

  texts(ranToday, ashore.length);
}

// ---------- 小鸟 ----------
let audio = null, birdTimer = 0;
function chirp(pitch, count) {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)(); if (audio.state === 'suspended') audio.resume();
    const t0 = audio.currentTime + 0.02;
    for (let i = 0; i < count; i++) {
      const o = audio.createOscillator(), g = audio.createGain(), st = t0 + i * 0.16, f0 = (3000 + Math.random() * 500) * pitch;
      o.type = 'sine'; o.frequency.setValueAtTime(f0, st); o.frequency.exponentialRampToValueAtTime(f0 * 1.45, st + 0.035); o.frequency.exponentialRampToValueAtTime(f0 * 0.80, st + 0.090);
      g.gain.setValueAtTime(0.0001, st); g.gain.exponentialRampToValueAtTime(0.15, st + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, st + 0.100);
      o.connect(g).connect(audio.destination); o.start(st); o.stop(st + 0.12);
    }
  } catch (e) { /* 没声音不影响画面 */ }
}
function perch(signEl) {
  const P = BIRD; if (!P) return; clearTimeout(birdTimer);
  const b = mk('button', 'bird', signEl), img = mk('img', '', b), k = 2.9 / P.idle.h, asleep = M.night.n > .6 && !M.stale;      // 站着的时候大约 2.9 个字高
  b.type = 'button'; b.setAttribute('aria-label', '小鸟，点一下会叫'); img.alt = ''; img.draggable = false;
  const pose = name => { const p = P[name]; img.src = p.src; img.style.width = p.w * k + 'em'; img.style.left = -p.fx * k + 'em'; img.style.top = -p.fy * k + 'em'; };
  const rest = () => { pose(asleep ? 'sleep' : 'idle'); b.classList.toggle('asleep', asleep); };
  const idle = () => { birdTimer = setTimeout(() => { if (!asleep && !reduce && !still && !M.stale && !document.hidden && seen) { pose(rnd() < .5 ? 'look' : 'tilt'); setTimeout(rest, 1100 / SPEED * 2); } if (!still && !M.stale) idle(); }, (5 + rnd() * 6) * 1000 / SPEED * 2); };
  rest(); if (!M.stale && !reduce && !still) idle();
  b.onclick = e => { e.stopPropagation(); chirp(asleep ? .86 : 1, asleep ? 1 : 3); if (reduce || still || M.stale) return; b.classList.remove('asleep', 'hop'); void b.offsetWidth; pose(asleep ? 'idle' : 'sing'); b.classList.add('hop'); setTimeout(rest, asleep ? 1500 : 900); };
  acts.push(tb => b.classList.toggle('in', tb >= I.clock[1] + 2));   // 钟走完、船停稳前后，小鸟最后落下
}

// ---------- 河上面的一句话、提醒，河下面的日志 ----------
function texts(ranToday, nShore) {
  const nBad = M.alerts.filter(t => t.flag === 'bad').length, nWarn = M.alerts.length - nBad, b = bj(M.now), obs = `${b.getUTCMonth() + 1} 月 ${b.getUTCDate()} 日 ${hm(M.now)}`;
  const nGuardAlert = M.guards.filter(t => t.alert).length;
  const lead = nBad || nWarn ? [nBad ? `<span class="bad">有 ${nBad} 个任务出错</span>` : '', nWarn ? `<span class="warn">${nBad ? '' : '有 '}${nWarn} 个${nBad ? '' : '任务'}要留意</span>` : ''].filter(Boolean).join('、') + '，详情见下面。' : M.fog.length ? `读到结果的任务都没有出错，也没有要留意的；${M.fog.length} 个这次没读到结果。` : '没有出错的，也没有要留意的。';
  const unavailable = ({offline:'现在读不到电脑。', unreadable:'自动任务暂时读不到。', stale:'自动任务的记录没有及时更新。'})[M.snap.reason || (M.A.state === 'stale' ? 'stale' : 'unreadable')];
  $('#headline').innerHTML = M.stale ? `<span class="warn">${unavailable}</span>下面是 ${obs} 最后一次读到的样子，之后的情况不知道。` : M.A.state === 'empty' ? '电脑上现在没有登记的自动任务。' : lead +
    `今天定时任务已经跑完 <b>${ranToday}</b> 个，还有 <b>${M.future.length}</b> 个要跑；常驻和高频任务 <b>${M.guards.length}</b> 个，${nGuardAlert ? `其中 ${nGuardAlert} 个有问题` : '都正常'}。另有 ${nShore} 个今天没有安排或已停用${(nBad || nWarn) && M.fog.length ? `，${M.fog.length} 个这次没读到结果` : ''}。`;
  $('#when').textContent = `读到电脑的时间：${obs}（北京时间）· 一共 ${M.tasks.length} 个自动任务`;
  const al = $('#alerts'); al.textContent = '';
  M.alerts.forEach(t => { const e = mk('button', 'alert ' + t.flag, al, `<b>${esc(t.name)}</b>${stateOf(t)[1]}${t.note ? '：' + esc(t.note) : ''}${t.last > 0 ? `（上次运行：${esc(whenText(M, t.last))}）` : ''}`); e.type = 'button'; e.onclick = () => pick(t, true); });
  $('#legend').innerHTML = `<span>浮标：${M.stale ? '最后读到时刻' : '现在'}（左边跑完，右边还没到点）</span>` + [['var(--ok)', '绿旗：跑完，正常'], ['var(--warn)', '黄旗：要留意'], ['var(--bad)', '红旗：出错'], ['#c3ccc8', '灰旗：跑了，但没读到结果']]
    .map(([c, s]) => `<span><i style="--c:${c}"></i>${s}</span>`).join('') + '<span>没升旗的船：还没到点</span><span>灯：常驻和高频任务（一直开着，或每半小时内就跑一次）</span><span>岸上的船：今天没有安排或已停用</span><span>雾里的船：这次没读到结果</span>';
  const log = $('#log'); log.innerHTML = '<h4>任务清单<small>点一行，看它在做什么、上次和下次、有没有出错、怎么停、停了影响什么</small></h4>';
  const C = { ok: 'var(--ok)', warn: 'var(--warn)', bad: 'var(--bad)', gray: 'var(--gray)' };
  const group = (key, title, say, list, open, timeOf, colorOf, head) => { if (!list.length) return;
    const d = mk('details', 'group', log); d.id = 'g-' + key; d.open = open;
    d.innerHTML = `<summary><span class="dot" style="--c:${head}"></span>${title}<span class="n">${list.length}</span><span class="say">${say}</span></summary><div class="rows"></div>`;
    list.forEach(x => { const t = x.t || x, r = mk('details', 'row', d.lastChild);
      r.innerHTML = `<summary><span class="dot" style="--c:${colorOf(x)}"></span><span class="t">${esc(timeOf(x) || '—')}</span><span class="nm">${esc(t.name)}</span></summary>`;
      r.addEventListener('toggle', () => { if (r.open && !r.querySelector('.six')) r.insertAdjacentHTML('beforeend', six(M, t).replace(/<h4>.*?<\/h4>/, '')); mark(r.open ? t : null); }); });
  };
  const day = ms => !(ms > 0) ? '' : dkey(ms) === M.today ? hm(ms) : dkey(ms) === M.today - 1 ? '昨天' : `${bj(ms).getUTCMonth() + 1}月${bj(ms).getUTCDate()}日`;
  group('alert', '出错的、要留意的', '先看这里', M.alerts, true, t => day(t.last), t => C[t.flag], C.bad);
  group('past', M.stale ? '当时已跑完的' : '今天跑完的', '浮标左边升了旗的船', M.past.filter(p => p.t.ran).sort((a, b) => b.at - a.at), true, p => hm(p.at), p => C[p.t.flag], C.ok);
  group('future', M.stale ? '当时还没到点的' : '今天还要跑的', '浮标右边还没升旗的船，按出发时间排', M.future, true, p => hm(p.at), () => '#9fd8b3', '#9fd8b3');
  group('guard', '常驻和高频任务', '岸边的灯：一直开着，或每半小时内就跑一次', M.guards, false, t => t.every <= 30 ? frequency(t) : t.raw.state === 'running' ? '在运行' : '常驻', t => t.alert ? C[t.flag] : '#ffcb52', '#ffcb52');
  group('idle', '今天没有安排的', '岸上的船，今天不跑', M.idle, false, t => day(t.last), () => '#7cc79b', '#7cc79b');
  group('off', '停用的、从没跑过的', '拉到岸上的船', M.off, false, t => t.off ? '停用' : '没跑过', () => C.gray, C.gray);
  group('fog', '没读到结果的', '雾里的船：这次没读到运行结果，好坏还不知道', M.fog, false, () => '', () => '#c9d3de', '#c9d3de');
}
function mark(t) { host.querySelectorAll('#layer .on').forEach(e => e.classList.remove('on')); if (t) (els.get(t.i) || []).forEach(e => e.classList.add('on')); }
function pick(t, scroll) { mark(t); const p = $('#pick'); p.hidden = false; p.innerHTML = six(M, t); if (scroll) p.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); }
function openGroup(key) { const d = $('#g-' + key) || $('#g-off'); if (!d) return; d.open = true; d.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' }); }
layer.addEventListener('click', e => { const b = e.target.closest('[data-i]'); if (b) pick(M.tasks[+b.dataset.i]); });
const showTip = e => { const b = e.target.closest?.('[data-i]'); if (!b) { tip.style.opacity = 0; return; } const t = M.tasks[+b.dataset.i], r = stage.getBoundingClientRect(), q = b.getBoundingClientRect();
  tip.innerHTML = `<b>${esc(t.name)}</b>${esc(b.dataset.tip || stateOf(t)[1])}`; tip.style.left = clamp(q.left - r.left + q.width / 2 - 70, 6, r.width - 290) + 'px';
  tip.style.top = (q.top - r.top > 90 ? q.top - r.top - 62 : q.bottom - r.top + 10) + 'px'; tip.style.opacity = 1; };
layer.addEventListener('pointerover', showTip); layer.addEventListener('focusin', showTip); layer.addEventListener('pointerleave', () => { tip.style.opacity = 0; }); layer.addEventListener('focusout', () => { tip.style.opacity = 0; });

// ---------- 天色：跟着杭州的日出日落 ----------
function nightOf(ms) {
  const d = bj(ms), rad = Math.PI / 180, N = Math.floor((Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - Date.UTC(d.getUTCFullYear(), 0, 0)) / 864e5), g = 2 * Math.PI / 365 * (N - 1);
  const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const dec = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const lat = 30.2741 * rad, lon = 120.1551, ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(lat) * Math.cos(dec)) - Math.tan(lat) * Math.tan(dec)) / rad;
  const sr = (720 - 4 * (lon + ha) - eqt) / 60 + 8, ss = (720 - 4 * (lon - ha) - eqt) / 60 + 8, h = d.getUTCHours() + d.getUTCMinutes() / 60;
  const ramp = (a, b, x) => sstep(clamp((x - a) / (b - a)));
  const n = h < 12 ? 1 - ramp(sr - 1.1, sr + .5, h) : ramp(ss - .3, ss + 1.2, h);                 // 夜有多深，0 到 1
  const w = Math.max(0, 1 - Math.abs(h - (sr + .1)) / 1.1, 1 - Math.abs(h - (ss - .2)) / 1.2);    // 日出日落前后的暖光
  return { n, w };
}

// ---------- 水：让画里的河真的流起来 ----------
const VS = 'attribute vec2 a; varying vec2 vUv; void main(){ vUv = vec2(a.x*.5+.5, .5-a.y*.5); gl_Position = vec4(a,0.,1.); }';
const FS = `precision highp float;
varying vec2 vUv; uniform sampler2D uTex, uMask; uniform float uT, uA, uReveal, uGray, uNight, uWarm; uniform vec4 uBoat[14];
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x), mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x), f.y); }
float fbm(vec2 p){ float s=0., a=.5; for(int i=0;i<3;i++){ s+=a*noise(p); p=p*2.03+vec2(17.3,9.1); a*=.5; } return s; }
void main(){
  vec2 uv = vUv, p = vec2(uv.x*uA, uv.y); float m = texture2D(uMask, uv).r;
  // 船尾拖出来的水痕、船头压出来的一道弧
  vec2 push = vec2(0.); float foam = 0.;
  for (int i=0;i<14;i++){
    vec4 b = uBoat[i]; if (b.w <= 0.) continue;
    float L = b.z; vec2 d = p - vec2(b.x*uA, b.y);
    if (abs(d.y) > L*1.25 || d.x < -L*.9 || d.x > L*4.) continue;
    float s = d.x - L*.4, c = d.y, fade = smoothstep(0., L*.3, s) * exp(-s/(L*1.7));
    float arm = L*.12 + s*.26, w = L*(.05 + s/L*.05), n = noise(vec2(s/L*9. - uT*.75, c/L*14. + float(i)*7.));
    float la = (abs(c)-arm)/w; float line = exp(-la*la) * (.35 + 1.1*n);
    float inner = smoothstep(arm, arm*.1, abs(c)) * max(fbm(vec2(s/L*7. - uT*.6, c/L*12.)) - .3, 0.) * 2.2;
    float rip = sin(s/L*22. - uT*2.5) * smoothstep(arm*1.1, 0., abs(c)) * fade;
    foam += (line*1.25 + inner*.8) * fade * b.w;
    push += vec2(rip*.003, sign(c)*line*fade*.003) * b.w;
    vec2 e = vec2(d.x + L*.36, c*1.25);
    float ba = (length(e) - L*.17)/(L*.035); foam += exp(-ba*ba) * smoothstep(L*.02, -L*.1, d.x + L*.36) * (.5 + .5*n) * .95 * b.w;
  }
  // 水往右流：同一处的画分两拍错开着挪，接起来就是一直在流（1460 宽时每秒约 9—10 像素；和时间有关的常数都按这个快慢定，改快慢要一起改）
  float my = .2*sin(uv.x*5.2 + uv.y*3.);
  vec2 f = vec2(1., my*uA) * .036 * m;
  vec2 sh = (vec2(fbm(p*8. + vec2(uT*.1, 0.)), fbm(p*8. + vec2(31.7, uT*.085))) - .5) * .0042;
  vec2 base = uv + (sh + push) * m;
  float ph = uT*.0725 + noise(p*2.6)*.7, p0 = fract(ph), p1 = fract(ph + .5);
  vec3 col = mix(texture2D(uTex, base - f*(p0-.5)).rgb, texture2D(uTex, base - f*(p1-.5)).rgb, abs(p0-.5)*2.);
  // 水面上漂着的光网和碎光
  vec2 q = p*vec2(9., 13.) - vec2(uT*.25, 0.) + (fbm(p*4. + uT*.05) - .5)*1.5;
  float ca = pow(1. - abs(2.*noise(q) - 1.), 7.) + .6*pow(1. - abs(2.*noise(q*1.9 + 4.7) - 1.), 9.);
  col += vec3(1., 1., .9) * ca * .12 * m * (1. - .55*uNight);
  vec2 gp = vec2(p.x - uT*.0045, p.y) * 46.; vec2 gc = floor(gp); float gh = hash(gc);
  vec2 gq = gc + .25 + .5*vec2(hash(gc + 3.1), hash(gc + 7.7));
  float glint = smoothstep(.17, 0., length(gp - gq)) * pow(max(0., sin(uT*(.35 + gh*.6) + gh*40.)), 10.) * step(.8, gh);
  col += glint * .8 * m * (1. - .3*uNight);
  col = mix(col, vec3(.96, 1., .97), clamp(foam, 0., 1.) * .78 * m);
  // 天色：夜里偏蓝偏暗，日出日落偏暖；纸的留白不跟着变
  float ink = smoothstep(.985, .8, min(col.r, min(col.g, col.b)));
  col = mix(col, col*vec3(.5,.69,.86)*.92 + vec3(0.,.012,.035), uNight*.62*ink*(1. - uGray));
  col = mix(col, col*vec3(1.08,.95,.78), uWarm*.55*ink);
  float gr = dot(col, vec3(.3,.59,.11)); col = mix(col, vec3(gr)*1.03 + .02, uGray*.88);
  // 四边化进白纸里；开场从浮标那里晕开
  float nz = fbm(p*4.5); vec2 ed = min(uv, 1.-uv);
  float show = smoothstep(0., .05, ed.x + (nz-.5)*.03) * smoothstep(0., .075, ed.y + (nz-.5)*.045);
  float dist = distance(p, vec2(${(GATE / 100).toFixed(3)}*uA, .44)) / (uA*.62);
  show *= 1. - smoothstep(uReveal*1.5 - .24, uReveal*1.5, dist + (nz-.5)*.28);
  gl_FragColor = vec4(mix(vec3(1.), col, show), 1.);
}`;
const GL = { gl: null, u: {}, ok: false };
const loadImage = src => new Promise((res, rej) => { const im = new Image(); let retried = false; im.crossOrigin = 'anonymous'; im.onload = () => res(im); im.onerror = () => { if (!retried) { retried = true; im.src = src; } else rej(new Error('图没读出来')); }; im.src = src; });
for (let i = 0; i < 4; i++) loadImage(asset('boat' + i + '.webp')).catch(() => {});
async function initGL() {
  try {
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' }); if (!gl) throw new Error('这台设备开不了 WebGL');
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr)); gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    const url = getComputedStyle(stage).getPropertyValue('--river').trim().replace(/^url\(["']?|["']?\)$/g, '');
    const [river, mask] = await Promise.all([loadImage(url), loadImage(asset('mask.png'))]);
    [river, mask].forEach((im, k) => { gl.activeTexture(gl.TEXTURE0 + k); gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); });
    ['uTex', 'uMask', 'uT', 'uA', 'uReveal', 'uGray', 'uNight', 'uWarm', 'uBoat'].forEach(n => GL.u[n] = gl.getUniformLocation(pr, n));
    gl.uniform1i(GL.u.uTex, 0); gl.uniform1i(GL.u.uMask, 1); GL.gl = gl; GL.ok = true; stage.classList.remove('nogl');
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); GL.ok = false; stage.classList.add('nogl'); });
  } catch (err) { console.info('[今天的河] 水面动效没开起来，改用静止的画：', err.message || err); stage.classList.add('nogl'); }
}
const boatBuf = new Float32Array(56);
function draw(tb) {
  if (!GL.ok) return; const gl = GL.gl, u = GL.u;
  const w = Math.round(stageWidth * Math.min(1.5, devicePixelRatio || 1)), h = Math.round(w / GEOM.aspect);
  if (!w || !h) return; // 重挂载时保留上一帧，等容器恢复尺寸再画。
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
  boatBuf.fill(0); wakes.filter(o => o.s > .02).sort((a, b) => b.s - a.s).slice(0, 14).forEach((o, k) => boatBuf.set([o.x / 100, o.y / 100, o.w / 100 * GEOM.aspect, o.s], k * 4));
  gl.uniform4fv(u.uBoat, boatBuf); gl.uniform1f(u.uT, Math.min(tb, 1e6) % 4000); gl.uniform1f(u.uA, GEOM.aspect); gl.uniform1f(u.uReveal, clamp(tb / I.reveal));
  gl.uniform1f(u.uGray, M.stale ? 1 : 0); if (M.stale) boatBuf.fill(0), gl.uniform4fv(u.uBoat, boatBuf); gl.uniform1f(u.uNight, M.night.n); gl.uniform1f(u.uWarm, M.night.w);
  metrics.draws++; gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

// ---------- 时间和循环 ----------
const clock = { t0: null, skip: false, manual: null, done: false };
let stageWidth = 0;
const fit = () => { stageWidth = stage.clientWidth; if (stageWidth) stage.style.fontSize = stageWidth / 100 + 'px'; };
let raf = 0, seen = true, still = false, last = 0, gaps = [], since = 0, generation = 0, glLoading = null;
const metrics = { frames: 0, draws: 0, freezeReason: null, medianFPS: null };
function step(tb) { if (!clock.done || clock.manual != null) acts.forEach(f => f(tb)); if (tb >= I.end && clock.manual == null) clock.done = true; draw(tb); }
function frame(ts) {
  raf = 0; if (!M || still || M.stale || reduce || document.hidden || !seen) return;
  metrics.frames++;
  if (clock.t0 == null) clock.t0 = ts - (clock.skip ? I.end / SPEED * 1000 : 0);          // 第一次真的画出来才开始算时间，后台打开的页面不会把开场白白放掉
  step(clock.manual != null ? clock.manual : (ts - clock.t0) / 1000 * SPEED);
  // 防卡死的保险：页面看得见、动画在播、连着大约 5 秒帧率的中位数低于 10 帧，才退回静止；只管这一次这一页
  if (last) { const gap = ts - last; since += gap; if (since > 2000) { gaps.push(gap); let sum = 0; for (const g of gaps) sum += g; while (sum > 5000 && gaps.length > 1) sum -= gaps.shift();
    if (sum >= 4800 && gaps.length >= 5) { const s = [...gaps].sort((a, b) => a - b), fps = 1000 / s[s.length >> 1]; metrics.medianFPS = fps; if (fps < 10) { freeze(`连着 5 秒帧率中位数只有 ${fps.toFixed(1)} 帧，低于 10 帧`); return; } } } }
  last = ts; raf = requestAnimationFrame(frame);
}
function freeze(why) { still = true; metrics.freezeReason = why; clearTimeout(birdTimer); stage.classList.add('still'); acts.forEach(f => f(1e9)); draw(1e9); console.info('[今天的河] 这一次改成静止画面：' + why); }
const wake = () => { last = 0; since = 0; gaps = []; metrics.medianFPS = null; if (M && seen && !document.hidden && !raf && !still && !reduce && !M.stale) raf = requestAnimationFrame(frame); };
document.addEventListener('visibilitychange', wake);
setInterval(()=>{const label=$('.now b');if(label&&!document.hidden)label.textContent=hm(Date.now());},1000);
new IntersectionObserver(es => { seen = es[0].isIntersecting; stage.classList.toggle('out-of-view', !seen); if (seen) wake(); }).observe(stage);
addEventListener('scroll', () => { last = 0; since = 0; gaps = []; }, true);
const redraw = () => {
  if (!M || !stage.clientWidth) return;
  fit();
  draw(reduce || still || M.stale ? 1e9 : clock.manual ?? (clock.t0 == null ? 0 : (performance.now() - clock.t0) / 1000 * SPEED));
};
addEventListener('resize', redraw);
new ResizeObserver(redraw).observe(stage);

async function start(snap, intro = true) {
  const turn = ++generation;
  cancelAnimationFrame(raf); raf = 0; clearTimeout(birdTimer);
  if (!snap?.automation || !Number.isFinite(parse(snap.automation.observed_at) || parse(snap.captured_at))) return;
  const firstDisplay = $('#scroller').hidden;
  $('#scroller').hidden = false; $('#legend').hidden = false; $('#log').hidden = false; $('.hint').hidden = false;
  $('#pick').hidden = true; tip.style.opacity = 0;
  fit(); build(snap);
  if (!glLoading) { stage.classList.add('nogl'); glLoading = initGL().then(redraw); }
  if (turn !== generation) return;
  const sc = $('#scroller'); if (firstDisplay || intro) sc.scrollLeft = Math.max(0, stage.clientWidth * GATE / 100 - sc.clientWidth / 2 + 18);
  stage.classList.toggle('still', still || M.stale || reduce);
  if (reduce || still || M.stale) { acts.forEach(f => f(1e9)); draw(1e9); return; }      // 读不到电脑时河停住，不放开场
  clock.done = false; clock.manual = null; clock.t0 = null; clock.skip = !intro; wake();
}
// 接入用：setSnapshot 换一份新读到的数据；验收用：seek(秒) 定格到开场的某一刻，resume() 接着走
window.todayRiver = { SPEED, ready: true, setSnapshot: (s, intro = false) => {
    if (['unknown','unavailable'].includes(s?.automation?.state) && !M) return Promise.resolve();
    if ((!s?.automation || !Array.isArray(s.automation.items) || ['unknown','unavailable'].includes(s.automation.state)) && M) s = {...M.snap, reason:s?.reason || 'unreadable'};
    if (!s?.automation || !Array.isArray(s.automation.items) || !Number.isFinite(parse(s.automation.observed_at) || parse(s.captured_at))) return Promise.resolve();
    return start(s, intro);
  }, replay: () => M ? start(M.snap, true) : Promise.resolve(),
  seek: s => { clock.manual = s * SPEED; clock.done = false; step(clock.manual); }, resume: () => { clock.t0 = performance.now() - (clock.manual || 0) / SPEED * 1000; clock.manual = null; wake(); },
  get model() { return M; }, get still() { return still; }, get static() { return reduce || still || !!M?.stale; }, get gl() { return GL.ok; }, get metrics() { return {...metrics}; } };
document.dispatchEvent(new Event('today-river-ready'));
})();
