// 首页：第 1 步的两屏，加第 2 步的“镜头退出来”。动效一直开着（见网站 AGENTS.md），不做“减少动态”适配。
// 镜头只动 transform 和 opacity，由滚动时间线驱动；动效层见文件末尾的 window.HOME。
(() => {
'use strict';

const CONFIG = window.HOME_CONFIG;
const SRC_W = 1672;
const SRC_H = 941;
const query = new URLSearchParams(location.search);
const root = document.documentElement;
// ?vp=1280：把视口那一行临时换成固定宽度（自查用；整站统一的那一行定了以后拿它再对一次）。
if (query.has('vp')) document.querySelector('meta[name="viewport"]').content = `width=${Number(query.get('vp')) || 1280}`;
const clamp01 = (value) => Math.min(1, Math.max(0, value));
const smooth = (value) => { const v = clamp01(value); return v * v * (3 - 2 * v); };
const ramp = (value, from, to) => smooth((value - from) / (to - from));

// ---------------------------------------------------------------- 五个按钮
const hotspots = CONFIG.buttons.map((button) => {
  const link = document.createElement('a');
  const [left, top, width, height] = button.bounds;
  link.className = 'hotspot';
  link.id = button.id;
  link.href = CONFIG.links[button.id];
  link.setAttribute('aria-label', button.label);
  link.dataset.screen = button.screen;
  Object.assign(link.style, {
    left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%`,
    borderRadius: button.radius
  });
  return { button, link };
});

// ---------------------------------------------------------------- 机箱右边的副屏（四格）
// 原画里它是一块没通电的白板。亮屏那张小图原位盖上去（屏、图标、分隔线是画好的），字和数是这里叠的活字；
// 屏里会动的云、光、彩边和开机时流下来的光，由灯效模块画在它那张画布里（fx/lights.js 的 panel）。
// 画布不在时用同一张亮屏小图，字照常显示。
const SCREEN = CONFIG.screen;
const cellTargets = [
  ['ai', '/live/chats/'], ['need', '/live/items/'],
  ['maintenance', '/live/tasks/?scope=ai-today'], ['computer', '/live/computer/']
];
const pct = (value) => `${value * 100}%`;
const panelArt = new Image();
panelArt.crossOrigin = 'anonymous';
panelArt.src = 'images/screen1-panel-v2.webp';
const panelArtReady = panelArt.decode().then(() => true, () => false);
// 灯效每帧来读的状态：指针、点按、读数变化、电脑没开机和镜头进度。
const panelState = { hover: -1, press: -1, ptr: null, pulse: [0, 0, 0, 0], hostOff: false, sheen: 0,
  temp: -1 };   // temp：CPU 多热，30℃ 算 0、90℃ 算 1（温度计图标的水银柱跟着走）；没读到是 -1
const panelFx = { image: null, state: panelState,
  onBoot(schedule) { if (litMode !== 'still') { litMode = 'boot'; lightPanels(schedule); } },
  onLive() { for (const panel of panels) panel.box.classList.add('on-canvas'); },   // 画布在画这块屏了
  // 画布换了、丢了或收走了：还压着的字马上放出来，小图垫上
  onGone() { if (bootClock) bootClock.now = () => Infinity; for (const panel of panels) panel.box.classList.remove('on-canvas'); } };

// 第一屏和镜头里用同一块（镜头退远时它跟着画一起缩小）；不会动的第二屏另摆一块到那张画的白板上。
function buildPanel(screen) {
  const [ax0, ay0, ax1, ay1] = SCREEN.art, [fx0, fy0, fx1, fy1] = SCREEN.frame, [gx0, , gx1] = SCREEN.glass;
  let kx = 1, ky = 1, left = ax0, top = ay0;
  if (screen === 'screen2') {
    const [sx0, sy0, sx1, sy1] = SCREEN.stillFrame;
    kx = (sx1 - sx0) / (fx1 - fx0); ky = (sy1 - sy0) / (fy1 - fy0);
    left = sx0 - (fx0 - ax0) * kx; top = sy0 - (fy0 - ay0) * ky;
  }
  // 两层：小图（face）垫在动效层底下，字（box）在最上面；位置一样。
  const box = element('div', 'screen-panel'), face = element('img', 'screen-face');
  box.dataset.screen = screen;
  for (const node of [box, face]) Object.assign(node.style, {
    left: pct(left / SRC_W), top: pct(top / SRC_H),
    width: pct((ax1 - ax0) * kx / SRC_W), height: pct((ay1 - ay0) * ky / SRC_H)
  });
  box.style.setProperty('--k', kx.toFixed(4));
  face.alt = ''; face.draggable = false; face.src = panelArt.src;
  const cells = cellTargets.map(([id, href], index) => {
    const link = element('a', 'hotspot screen-cell', box);
    link.dataset.screen = screen; link.dataset.cell = id; link.href = href;
    link.style.setProperty('--iy', (SCREEN.icons[index] - SCREEN.edges[index]).toFixed(1));   // 图标中心离格顶多少定稿像素
    Object.assign(link.style, {
      left: pct((gx0 - ax0) / (ax1 - ax0)), width: pct((gx1 - gx0) / (ax1 - ax0)),
      top: pct((SCREEN.edges[index] - ay0) / (ay1 - ay0)),
      height: pct((SCREEN.edges[index + 1] - SCREEN.edges[index]) / (ay1 - ay0))
    });
    // 确认没开机时第四格的图标是开机键。画布在画时画布自己画；这一份只在没有画布、只有小图时用：
    // 画里那支温度计拿右边同样干净的一块底色盖掉，上面叠线条画的开机键（形状和画布里画的一样）。位置、大小见 style.css 的 .cell-pc
    if (id === 'computer') {
      const cover = element('b', '', element('i', 'cell-pc', link));
      cover.style.backgroundImage = `url("${panelArt.src}")`;
      cover.insertAdjacentHTML('afterend', '<svg viewBox="-20 -20 40 40" aria-hidden="true"><path d="M-6.68-7.86A11.5 11.5 0 1 0 6.68-7.86M0-13V-1.5"/></svg>');
    }
    const cell = { index, link, title: element('span', 'cell-title', link), main: element('span', 'cell-main', link), sub: element('span', 'cell-sub', link) };
    link.addEventListener('pointerenter', (event) => { if (event.pointerType !== 'touch') panelState.hover = index; });
    link.addEventListener('pointerleave', () => { if (panelState.hover === index) panelState.hover = -1; });
    link.addEventListener('pointerdown', (event) => { panelState.press = index; panelState.ptr = paintingPoint(box, event); });
    return cell;
  });
  box.addEventListener('pointermove', (event) => { if (event.pointerType !== 'touch') panelState.ptr = paintingPoint(box, event); });
  box.addEventListener('pointerleave', () => { panelState.ptr = null; panelState.hover = -1; });
  return { screen, box, face, cells };
}
// 指针落在定稿图的哪个像素上（屏跟着镜头缩放、平移，按它当下的位置换算）。
function paintingPoint(box, event) {
  const rect = box.getBoundingClientRect(), [ax0, ay0, ax1, ay1] = SCREEN.art;
  return [ax0 + (event.clientX - rect.left) / rect.width * (ax1 - ax0), ay0 + (event.clientY - rect.top) / rect.height * (ay1 - ay0)];
}
const panels = ['screen1', 'screen2'].map(buildPanel);
const release = (event) => { panelState.press = -1; if (event.pointerType === 'touch') panelState.ptr = null; };
window.addEventListener('pointerup', release, true);
window.addEventListener('pointercancel', release, true);
panelArtReady.then((ok) => {
  if (ok) panelFx.image = panelArt;
  else for (const panel of panels) { panel.box.classList.add('no-art'); panel.face.hidden = true; }   // 小图没读到：字改成深色，落在原画的白板上也看得清
});

// 屏亮起来：灯效在画时，光流到哪一格、哪一格的字就出来（时刻表是灯效给的）；只有小图时，小图和字一起淡入。
let litMode = '';   // '' 还没亮；'boot' 灯效在画；'still' 只有那张小图
const cellDue = [0, 0, 0, 0];         // 屏是几时开始亮的（毫秒时刻）；0 是屏还没亮
const LINES = [['title', 44], ['main', 84], ['sub', 109]];   // 一格里三行字的下沿离格顶多少定稿像素：光流过了，这一行才出来
// 灯效在画开机时，字跟着光走：灯效按真实时间计时，少画几帧也按原定秒数放出文字。
let bootClock = null;                 // { now(): 开机走到第几秒, at(y): 光第几秒流到画上的 y, done: 第几秒流满, faced: 小图垫上没有 }
const held = new Set();               // 还压着没出来的行：{ node, cell, name, at（秒）, latest（毫秒时刻：钟停了也不再等）}
function unhold(item) {
  held.delete(item);
  item.node.classList.remove('held'); item.node.style.setProperty('--d', '0ms');
}
function holdTick() {
  const t = bootClock ? bootClock.now() : Infinity, now = performance.now();
  for (const item of [...held]) if (t >= item.at || now >= item.latest) unhold(item);
  // 光流满以后把小图垫在画布底下：以后画布被收走或关掉，露出来的还是亮着的屏。
  if (bootClock && !bootClock.faced && t >= bootClock.done + 0.4) {
    bootClock.faced = true;
    for (const panel of panels) panel.face.classList.add('shown');
  }
  if (held.size || (bootClock && !bootClock.faced)) requestAnimationFrame(holdTick);
}
// 不跟光的时候（只有小图，或者光早流过去了数才到）：这一格的三行字 wait 毫秒后一起出来，行与行错开一点。
function cueCell(cell, wait) {
  LINES.forEach(([name], line) => cell[name].style.setProperty('--d', `${Math.round((wait ?? cell.index * 80) + line * 50)}ms`));
}
// 数字怎么动：第一次亮出来，直接就是读到的那个数（不先跳别的数）；页面开着时数真变了，才从旧数一格格数到新数。
// 数字本身一直是清楚的，不做半透明的淡换。
const counting = new Set();
function countTick(now) {
  for (const cell of counting) {
    const run = cell.count, t = (now - run.at) / run.dur;
    if (!run.node.isConnected || t >= 1) { run.node.textContent = String(run.to); counting.delete(cell); cell.count = null; continue; }
    run.node.textContent = String(Math.round(run.from + (run.to - run.from) * (1 - (1 - t) ** 2)));
  }
  if (counting.size) requestAnimationFrame(countTick);
}
function countNumber(cell, from) {
  const node = cell.main.querySelector('.cell-num'), to = Number(node?.textContent);
  if (!node || !Number.isFinite(from) || !Number.isFinite(to) || from === to) return;
  node.textContent = String(from);
  cell.count = { node, from, to, at: performance.now(), dur: Math.min(560, 160 + 40 * Math.abs(to - from)) };
  if (!counting.size) requestAnimationFrame(countTick);
  counting.add(cell);
}
function lightPanels(schedule) {
  const now = performance.now();
  bootClock = schedule ? { ...schedule, faced: false } : null;
  for (const item of held) item.node.classList.remove('held');
  held.clear();
  cellDue.fill(now);
  for (const panel of panels) {
    panel.box.classList.remove('lit', 'still');
    panel.face.classList.remove('shown', 'fade');
    void panel.box.offsetWidth;                // 重新开机（调参页“重看开场”）时字重新一行行出来
    for (const cell of panel.cells) {
      if (!schedule) { cueCell(cell, null); continue; }
      for (const [name, below] of LINES) {
        const at = schedule.at(SCREEN.edges[cell.index] + below) + 0.05;
        cell[name].classList.add('held');
        held.add({ node: cell[name], cell, name, at, latest: now + at * 3000 + 3000 });
      }
    }
    panel.box.classList.add('lit');
    if (!schedule) { panel.box.classList.add('still'); panel.face.classList.add('shown', 'fade'); }
  }
  if (schedule) requestAnimationFrame(holdTick);
}
function stillPanels() {
  if (litMode) return;
  litMode = 'still';
  panelArtReady.then(() => lightPanels(null));
}

// 数：三格是个数；第四格是 CPU 温度和开机多久。没读到是 null，不是 0。结构字段还没到的旧包，从那一格的 text 里认。
function uptimeText(seconds) {
  const minutes = Math.max(0, Math.floor(seconds / 60)), hours = Math.floor(minutes / 60), days = Math.floor(hours / 24);
  if (hours < 1) return `${minutes} 分钟`;
  if (days < 1) return minutes % 60 ? `${hours} 小时 ${minutes % 60} 分` : `${hours} 小时`;
  return hours % 24 ? `${days} 天 ${hours % 24} 小时` : `${days} 天`;
}
function cellFacts(id, cell) {
  const text = cell?.text ?? '';
  if (id !== 'computer') {
    if (cell && 'n' in cell) return { n: cell.n };
    const match = /·\s*(\d+)/.exec(text);
    return { n: match ? Number(match[1]) : null };
  }
  if (cell && 'on' in cell) return { on: cell.on, cpu: cell.cpu_c ?? null, uptime: cell.uptime ?? null };
  if (text === '没开机') return { on: false };
  const cpu = /CPU\s*(\d+)\s*℃/.exec(text), up = /开机\s*(?:(\d+)\s*天)?\s*(?:(\d+)\s*小时)?\s*(?:(\d+)\s*分)?/.exec(text);
  const known = up && (up[1] || up[2] || up[3]);
  return { on: known || cpu ? true : null, cpu: cpu ? Number(cpu[1]) : null,
    uptime: known ? (Number(up[1]) || 0) * 86400 + (Number(up[2]) || 0) * 3600 + (Number(up[3]) || 0) * 60 : null };
}
// 一格上写什么：title 小字，num + unit 大数，sub 第四格下面那行；note 是读不到或没开机时写在大数位置的话。
// wait：数还在路上（第一次还没回话）。这一格先不出字，只是亮着的屏和图标；数到了，小字和数一起亮出来。
// 屏上不做“加载中”的样子（本人 11-16 07:53：尽可能不要加载，只有真数和没开机两种）。
function cellView(id, facts, owner, pending, down) {
  // 实况暂停对外：没有数可等，四格照常出字，写明暂不公开（M414）。
  const missing = pending ? '' : down.paused ? '暂不公开' : down.offline ? '—' : '还没读到';
  if (id === 'computer') {
    if (down.hostOff) return { title: '电脑', num: '', unit: '', sub: '', note: '没开机', off: true, label: '电脑没开机' };
    const cpu = Number.isFinite(facts.cpu) ? String(Math.round(facts.cpu)) : '';
    // 心跳停了但没确认关机：有上一份读数就照写（带“截至”），没有就照实说没回应，不说没开机。
    if (down.silent && !cpu && !pending) return { title: 'CPU', num: '', unit: '', sub: '', note: '没回应', label: '电脑没回应' };
    const sub = Number.isFinite(facts.uptime) ? `开机 ${uptimeText(facts.uptime)}` : facts.on && !pending && !down.offline ? '开机时长还没读到' : '';
    return { title: 'CPU', num: cpu, unit: cpu && '℃', sub, note: cpu ? '' : missing, wait: pending && !cpu,
      label: `CPU ${cpu ? cpu + '℃' : missing}${sub ? '，' + sub : ''}`.trim() };
  }
  // “今天 AI 后台自动维护”一行放不下又不能缩小（最小的字也要看得清），折成两行。
  const [title, unit] = { ai: ['AI 在干活', '个'], need: [owner ? '等你' : '等本人', '件'], maintenance: ['今天 AI 后台\n自动维护', '次'] }[id];
  const num = Number.isFinite(facts.n) ? String(facts.n) : '';
  return { title, num, unit: num && unit, sub: '', note: num ? '' : missing, wait: pending && !num,
    label: `${title.replace('\n', '')} ${num ? num + ' ' + unit : missing}`.trim() };
}

// 动效脚本没跑起来（浏览器缺功能、出错）时字直接出来，不等光
const screenMotionOff = () => !root.classList.contains('mo-on');
// 把一格画上去。回的是“灯效那边隔多少毫秒从数字那里荡开一圈涟漪”：数刚到、这一格的字这才亮出来，
// 或者数变成了另一个数（从旧数数到新数）；别的情况回 -1。
function paintCell(cell, view, href, sample, quiet) {
  const { link, title, main, sub } = cell;
  // 数到了：屏已经亮过这一格就马上出字（几格一起到的，从上往下错开一点）；光还没流到，就照旧跟着光出来。
  const arrived = cell.waiting && !view.wait && cellDue[cell.index] > 0;
  const behind = arrived && !title.classList.contains('held');
  const late = behind ? cell.index * 80 : -1;
  cell.waiting = !!view.wait;
  if (behind) cueCell(cell, late);
  link.classList.toggle('is-waiting', !!view.wait);
  link.classList.toggle('is-off', !!view.off);
  link.classList.toggle('has-cutoff', !!view.cutoff);
  link.href = href;
  link.setAttribute('aria-label', view.label + sample);
  if (title.textContent !== view.title) title.textContent = view.title;
  if (sub.textContent !== view.sub) sub.textContent = view.sub;      // 开机时长本来就一直在走：直接换，不做动画
  const key = `${view.num}|${view.unit}|${view.note}|${view.tag ?? ''}`;
  if (cell.key === key) return -1;
  const fill = () => {
    main.replaceChildren();
    if (view.num) {
      element('b', 'cell-num', main).textContent = view.num;
      element('i', view.unit === '℃' ? 'cell-unit cell-degree' : 'cell-unit', main).textContent = view.unit;
    } else if (view.note) {
      element('em', 'cell-note', main).textContent = view.note;
      if (view.tag) element('i', 'cell-tag', main).textContent = view.tag;
    }
  };
  const before = cell.hasNumber ? Number(cell.num) : NaN;
  cell.key = key; cell.hasNumber = !!view.num; cell.num = view.num;
  fill();
  // 第一次出现、读不到、没开机：直接就是这个数、这句话。
  if (quiet || !Number.isFinite(before) || !view.num) return view.num && !quiet ? late : -1;
  // 数变成另一个数：从旧数数到新数，数字一直清楚；新数亮一下，灯效那边同时荡开一圈涟漪。
  // “今天维护”当天只增不减：变小了（过了零点重新算）就直接换，不倒着数。
  if (!(link.dataset.cell === 'maintenance' && Number(view.num) < before)) countNumber(cell, before);
  link.classList.remove('is-changed'); void link.offsetWidth; link.classList.add('is-changed');
  return 0;
}
// pending：数还在路上（第一次还没回话，或后端说正在准备）。回了话还是没有数，才写“还没读到”。
const down = { offline: false, hostOff: false, silent: false, paused: false };
const lastReadings = new Map();
let lastViewer;
// 屏上的数是几点的：当天只写时刻，隔天带上月-日（北京时间）。
function cutoffText(at, now, prefix) {
  try {
    const part = (value, options) => new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', hourCycle: 'h23', ...options }).format(new Date(value));
    const day = (value) => part(value, { month: '2-digit', day: '2-digit' }).replace('/', '-'), time = part(at, { hour: '2-digit', minute: '2-digit' });
    return day(at) === day(now || Date.now()) ? `${prefix ?? '以上截至'} ${time}` : `${prefix ?? '截至'} ${day(at)} ${time}`;
  } catch { return ''; }
}
function aiCellView(source, meta, owner, pending, now) {
  const at = source?.source_at ?? source?.at ?? meta?.at;
  const stamp = Date.parse(at), age = (Date.parse(now) || Date.now()) - stamp;
  // /screen 的 n 只表示当前读数。过期时，同笔对话计数留在“上次 N 个在干”里。
  const last = source?.q === 'stale' && /^上次\s*(\d+)\s*个在干(?:\s*·|$)/.exec(source.text ?? '');
  const n = ['unknown', 'warming'].includes(source?.q) || age < 0 ? null
    : last && Number.isFinite(stamp) ? Number(last[1]) : cellFacts('ai', source).n;
  const view = cellView('ai', { n }, owner, pending || source?.q === 'warming', down);
  if (!view.num) return view;
  if (source?.q === 'partial') {
    view.unit = '个以上';
    view.label = `AI 在干活，至少 ${view.num} 个`;
  }
  const old = isOldReading(source, meta, age);
  view.sub = Number.isFinite(stamp) ? cutoffText(at, now, old ? '截至' : '记录于') : '上次读数';
  if (view.sub) view.label += `，${view.sub}`;
  return view;
}
function isOldReading(source, meta, age) {
  return down.offline || ['copy', 'fallback'].includes(meta?.source) || source?.stale || source?.q === 'stale' || age >= 120000;
}
function renderScreen(data, meta, pending = false, now) {
  // 本人的设备上一直写“等你”：这一回没读到是谁在看（实况脚本没取到），照这台设备上一回读到的算。
  let owner = meta?.viewer?.kind === 'owner';
  try {
    if (meta?.viewer?.kind) { if (meta.source !== 'fixture') localStorage.setItem('wly-home-screen-viewer', meta.viewer.kind); }
    else owner = localStorage.getItem('wly-home-screen-viewer') === 'owner';
  } catch { /* 浏览器不让存：照这一回读到的算 */ }
  // 同一份访问权限下，某格暂时少了读数时沿用手上的数字。读数被撤回时随实况清空。
  const viewer = `${meta?.viewer?.kind}:${meta?.viewer?.device}`;
  if (!data || viewer !== lastViewer) lastReadings.clear();
  lastViewer = viewer;
  const sample = meta?.source === 'fixture' ? '（示意数）' : '';
  const quiet = screenMotionOff() || document.hidden;
  cellTargets.forEach(([id, fallback], index) => {
    let source = data?.cells?.find((item) => item.id === id);
    let at = source?.source_at ?? source?.at ?? meta?.at;
    const waiting = source?.q === 'warming';
    const facts = cellFacts(id, waiting || source?.q === 'unknown' ? null : source);
    const read = (entry, values, info) => id === 'ai' ? aiCellView(entry, info, owner, pending, now)
      : cellView(id, values, owner, pending || waiting, down);
    let view = read(source, facts, meta);
    const previous = lastReadings.get(id);
    const hasUptime = Number.isFinite(facts.uptime), time = Date.parse(at);
    const retain = !view.off && previous && ((!view.num && (previous.hasNumber || !hasUptime)) || time < Date.parse(previous.at));
    if (retain) {
      ({ source, at } = previous);
      view = read(source, previous.facts, { ...meta, at, source: 'copy' });
    } else if (!view.off && source && (view.num || hasUptime) && Number.isFinite(time)) {
      lastReadings.set(id, { source, at, facts, hasNumber: !!view.num });
    }
    const age = (Date.parse(now) || Date.now()) - Date.parse(at);
    if (id !== 'ai' && !view.off && (view.num || view.sub) && (retain || isOldReading(source, meta, age))) {
      const stamp = cutoffText(at, now, '截至');
      if (stamp) { view.cutoff = true; view.sub = [view.sub, stamp].filter(Boolean).join('\n'); view.label += `，${stamp}`; }
    }
    let ring = -1;
    for (const panel of panels) ring = Math.max(ring, paintCell(panel.cells[index], view, fallback, sample, quiet));
    if (id === 'computer') {
      panelState.hostOff = !!view.off;
      panelState.temp = view.num ? Math.min(1, Math.max(0, (Number(view.num) - 30) / 60)) : -1;
    }
    if (ring >= 0) panelState.pulse[index] = performance.now() + ring;   // 那圈光和字同时出来
  });
}
renderScreen(null, null, true);

// ---------------------------------------------------------------- 两屏停稳时图怎么放
// 正常窗口下就是第 1 步验收过的算法。只多了一条：窗口很扁时，第一屏至少露出画高的 MIN_VISIBLE，
// 再扁就把画缩小、两侧用延伸铺，不再往下裁（标题和按钮不会被裁掉）。
const MIN_VISIBLE = 0.72;
function placement(screenName, width, height) {
  let scale, top;
  if (screenName === 'screen1') {
    scale = Math.min(width / SRC_W, height / (SRC_H * MIN_VISIBLE));
    const overflow = SRC_H * scale - height;
    top = overflow > 0 ? -overflow * 0.4 : -overflow / 2;
  } else if (width / height < SRC_W / SRC_H) {
    scale = Math.min(width / SRC_W, height / SRC_H);
    top = (height - SRC_H * scale) / 2;
  } else {
    // Preserve the source's x=3..97%, y=9..98.5% rectangle.
    scale = Math.min(width / (SRC_W * 0.94), height / (SRC_H * 0.895));
    top = height / 2 - SRC_H * scale * 0.5375;
  }
  return { scale, left: (width - SRC_W * scale) / 2, top };
}

// ---------------------------------------------------------------- 镜头用到的量（都是原图像素，量自定稿图）
// 第二屏玻璃窗的内沿；高度按第一屏画的比例算，整幅画正好放进去。
const WINDOW = { x: 497.6, y: 231.0, w: 1035.9 };
WINDOW.h = WINDOW.w * SRC_H / SRC_W;
// 窗口左下、右下两个螺丝座压在画上面：[x0, y0, x1, y1, 圆角]。
const TABS = [
  [492.0, 789.6, 521.3, 818.0, '0 7 0 0'],
  [1507.7, 789.6, 1541.0, 818.0, '7 0 0 0']
];
// 第一屏透明字层：[x0, y0, x1, y1, 羽化(上右下左), 离场起, 离场止]，起止是滚动进度。
// 沿用原来的分块和淡出节奏，透明处直接露出下面会动的云与阳光。
const SCREEN1_TEXT = [
  [0, 314, 640, 470, [16, 70, 60, 0], 0.000, 0.050],
  [0, 140, 640, 330, [70, 70, 16, 0], 0.020, 0.090]
];
// 第二屏的字：底图一直是带字图，用不带字图的同一块墙盖住，入场就是把盖的那块淡掉（从上到下一行行来）。
const SCREEN2_TEXT = [
  [70, 212, 404, 308, [10, 10, 10, 10], 0.700, 0.775],
  [70, 288, 404, 388, [10, 10, 10, 10], 0.730, 0.805],
  [70, 368, 404, 484, [10, 10, 10, 10], 0.760, 0.835],
  [70, 472, 404, 584, [8, 8, 8, 8], 0.810, 0.880],
  [70, 568, 404, 672, [8, 8, 8, 8], 0.845, 0.915],
  [70, 656, 404, 770, [8, 8, 8, 8], 0.880, 0.950]
];
// 镜头：从 from 滚到 to 之间后拉；速度是“起步轻、中段匀、落位长而柔”的梯形。
const CAMERA = { from: 0.015, to: 0.95, startSpeed: 0.24, accelerate: 0.24, endSpeed: 0.04, decelerate: 0.46 };
const REST_TOP = 0.02;   // 进度小于它：第一屏的两个按钮可点
const REST_END = 0.965;  // 进度大于它：第二屏的三个按钮可点
const STEPS = 120;       // 每条关键帧的采样数
const SETTLED = Math.max(CAMERA.to, ...SCREEN2_TEXT.map((spec) => spec[6]));   // 镜头停稳、第二屏的字全显完的进度：页底就在这里

const cameraEase = (() => {
  const count = 600;
  const table = new Float64Array(count + 1);
  const speed = (t) => {
    if (t < CAMERA.accelerate) return CAMERA.startSpeed + (1 - CAMERA.startSpeed) * smooth(t / CAMERA.accelerate);
    if (t > 1 - CAMERA.decelerate) return CAMERA.endSpeed + (1 - CAMERA.endSpeed) * smooth((1 - t) / CAMERA.decelerate);
    return 1;
  };
  for (let i = 1; i <= count; i++) table[i] = table[i - 1] + (speed((i - 1) / count) + speed(i / count)) / 2;
  const total = table[count];
  return (progress) => {
    const t = clamp01((progress - CAMERA.from) / (CAMERA.to - CAMERA.from)) * count;
    const index = Math.min(count - 1, Math.floor(t));
    return (table[index] + (table[index + 1] - table[index]) * (t - index)) / total;
  };
})();

// ---------------------------------------------------------------- 搭舞台
function element(tag, className, parent) {
  const node = document.createElement(tag);
  if (tag === 'img') node.crossOrigin = 'anonymous';
  if (className) node.className = className;
  if (parent) parent.append(node);
  return node;
}
// 舞台里的图先只记地址，第一次真要用镜头时才开始下载。
function picture(src, className, parent, alt = '') {
  const node = element('img', className, parent);
  node.dataset.src = src;
  node.style.opacity = '0';
  node.alt = alt;
  node.draggable = false;
  return node;
}
// 把一张整图的某一块原位叠上去（图本身不动，只是只露出这一块）。
function piece(parent, src, sourceWidth, [x0, y0, x1, y1], className) {
  const box = element('div', `piece ${className}`, parent);
  Object.assign(box.style, {
    left: `${x0 / SRC_W * 100}%`, top: `${y0 / SRC_H * 100}%`,
    width: `${(x1 - x0) / SRC_W * 100}%`, height: `${(y1 - y0) / SRC_H * 100}%`
  });
  const image = picture(src, '', box);
  Object.assign(image.style, {
    width: `${sourceWidth / (x1 - x0) * 100}%`,
    left: `${-x0 / (x1 - x0) * 100}%`, top: `${-y0 / (y1 - y0) * 100}%`
  });
  return box;
}

function feather(box, [top, right, bottom, left]) {
  for (const [name, value] of [['--ft', top], ['--fr', right], ['--fb', bottom], ['--fl', left]]) box.style.setProperty(name, value);
}

const staticAlt = [...document.querySelectorAll('.scene img')].map((image) => image.alt);
const stillScene = document.querySelector('[data-screen="screen1"]');
stillScene.querySelector('img').dataset.src = 'images/screen1-clean-v2.webp';
picture('images/screen1-textlayer-v2.webp', 'still-title', stillScene);
const track = element('div', 'track');
const stage = element('div', 'stage', track);
const backdrop = element('div', 'backdrop', stage);            // 整张第二屏铺不满窗口时的延伸
const world = element('div', 'world', stage);                  // 整张第二屏：墙、桌、机箱
const extension = element('div', 'extension', stage);          // 第一屏的画铺不满窗口时的延伸（同第 1 步：同一张图拉伸柔化）
element('div', 'extension-art', extension);
picture('images/screen2-text-v2.webp', 'shell', world, staticAlt[1]);
const screen2Text = SCREEN2_TEXT.map((spec) => {
  const box = piece(world, 'images/screen2-clean-v2.webp', 1671, spec, 'cover');
  feather(box, spec[4]);
  return box;
});
const shade = element('div', 'shade', world);
const pane = element('div', 'pane', world);                    // 玻璃窗内沿：里面是第一屏那幅画
picture('images/screen1-clean-v2.webp', 'garden', pane, staticAlt[0]);
const fx = element('div', 'fx', pane);                         // 动效层：第 3 到 5 步都放这里
fx.id = 'fx-garden';
const screen1Text = SCREEN1_TEXT.map((spec) => {
  const box = piece(pane, 'images/screen1-textlayer-v2.webp', 1671, spec, 'title');
  feather(box, spec[4]);
  return box;
});
// “实时状态”按钮上那颗点就是连没连上的灯（本人 11-23 20:55“连不上还是绿的吗”、20:57“上面有颜色；就不用下面在搞个颜色”）：
// 连上是画里原来那颗绿点；连不上时在它上面盖一颗呼吸的橙点，连上了慢慢收走、露回绿点。样子在 style.css 的 .home-lamp。
// 位置是字层图里那颗绿点的中心（定稿图像素），放进按钮那块字里，跟着一起缩放、一起淡出；静态那张画上也放一颗。
const LAMP_AT = [246.2, 360.8], LAMP_SIZE = 24;
function statusLamp(host, [x0, y0, x1, y1]) {
  const lamp = element('span', 'home-lamp', host);
  lamp.setAttribute('aria-hidden', 'true');
  Object.assign(lamp.style, { left: `${(LAMP_AT[0] - x0) / (x1 - x0) * 100}%`, top: `${(LAMP_AT[1] - y0) / (y1 - y0) * 100}%`,
    width: `${LAMP_SIZE / (x1 - x0) * 100}%` });
  element('i', '', lamp);
}
statusLamp(screen1Text[0], SCREEN1_TEXT[0]);
statusLamp(stillScene, [0, 0, SRC_W, SRC_H]);
const glass = element('div', 'glass', pane);
const sheen = element('div', 'sheen', glass);
const shades = [shade];
const tabs = [];
for (const spec of TABS) {
  const box = piece(world, 'images/screen2-text-v2.webp', SRC_W, spec, 'tab');
  tabs.push(box);
  box.style.borderRadius = spec[4].split(' ').map((value) => `calc(var(--unit) * ${value})`).join(' ');
  shades.push(element('div', 'shade', box));               // 螺丝座和机箱一起压暗、一起亮起来
}
document.querySelector('main').append(track);
let stageLoaded = false;
let firstScreenReady = Promise.resolve();
function loadStage() {
  if (stageLoaded) return;
  stageLoaded = true;
  const images = [...stage.querySelectorAll('img[data-src]')];
  // 全站动效 2.2：从别的页点页眉中间回来、直接停在第二屏时，第二屏的图和第一屏的一起先下、一起显出来
  // （不等第一屏、不再淡入 0.6 秒），整页缩进机箱的时候机箱已经在画面里。
  const atEnd = !!window.__motionHomeAtEnd;
  const first = atEnd ? images : images.filter(i => i.matches('.garden, .title img'));
  // Only errors retry; slow requests keep waiting. Failed images do not hold up a batch.
  function loadBatch(batch, onReady = () => {}) {
    const decoded = new Set(), delays = [1000, 2500, 5000];
    let showing = false, release;
    const show = image => {
      if (decoded.has(image)) { image.style.opacity = '1'; onReady(image); }
    };
    const visible = new Promise(resolve => { release = () => {
      if (showing) return;
      showing = true; batch.forEach(show); resolve();
    }; });
    const ready = Promise.all(batch.map(image => new Promise(resolve => {
      let count = 0;
      image.addEventListener('load', async () => {
        await image.decode().catch(() => {});
        decoded.add(image); if (showing) show(image); resolve();
      });
      image.addEventListener('error', () => {
        release();
        if (count === delays.length) { resolve(); return; }
        setTimeout(() => {
          const url = new URL(image.dataset.src, document.baseURI);
          url.searchParams.set('image-retry', `${++count}-${Date.now()}`);
          image.src = url.href;
        }, delays[count]);
      });
      image.src = image.dataset.src;
    })));
    ready.then(release);
    return { visible, ready };
  }
  first.forEach(i => { i.fetchPriority = 'high'; });
  const updateBackdrop = image => {
    if (image.parentElement.classList.contains('cover')) backdrop.style.backgroundImage = `url("${image.src}")`;
  };
  const primary = loadBatch(first, updateBackdrop);
  firstScreenReady = primary.ready;
  primary.visible.then(() => {
    // 白纸开场：原画（和副屏小图）就绪后从旧开场的落墨位置晕开。
    panelArtReady.then(() => {
      if (!root.classList.contains('home-opening')) return;
      root.classList.add('home-washing');
      root.addEventListener('animationend', function finishOpening(event) {
        if (event.animationName !== 'home-paper-wash') return;
        root.classList.remove('home-opening', 'home-washing');
        root.removeEventListener('animationend', finishOpening);
      });
    });
    const second = images.filter(i => !first.includes(i));
    second.forEach(i => { i.style.opacity = '0'; i.style.transition = 'opacity .6s'; i.fetchPriority = 'low'; });
    const secondary = loadBatch(second, updateBackdrop);
    secondary.visible.then(() => stage.classList.add('secondary-ready'));
  });
}
// 量“一屏高”用的尺子：100vh。手机上地址栏收起、弹出时它不变，舞台就不会跟着重排。
const ruler = element('div', 'vh-ruler', document.body);

// ---------------------------------------------------------------- 镜头
let camera = null;
let animations = [];
let timeline = null;
let travel = 1;
let trackTop = 0;
const pinned = query.has('p') ? clamp01(Number(query.get('p')) || 0) : null;   // ?p=0.35 把进度钉住
const listeners = new Set();

function cameraAt(progress) {
  const ease = cameraEase(progress);
  const zoom = Math.exp(Math.log(camera.endZoom) * ease);       // 1 → endZoom，按倍率匀速
  const along = (1 - zoom) / (1 - camera.endZoom);              // 平移跟倍率成正比 = 绕一个不动点缩放
  return {
    ease, zoom,
    x: camera.start.x + (camera.end.x - camera.start.x) * along,
    y: camera.start.y + (camera.end.y - camera.start.y) * along
  };
}

function layoutCamera() {
  const width = stage.clientWidth;
  const height = stage.clientHeight;
  const first = placement('screen1', width, height);
  const second = placement('screen2', width, height);
  const startScale = SRC_W * first.scale / WINDOW.w;            // 窗口内沿正好等于第一屏那幅画
  camera = {
    startScale,
    endZoom: second.scale / startScale,
    start: { x: Math.round(first.left) - WINDOW.x * startScale, y: Math.round(first.top) - WINDOW.y * startScale },
    end: { x: Math.round(second.left), y: Math.round(second.top) }
  };
  // 舞台按起点（最大）尺寸排版，之后只缩小，任何时候都不糊。
  Object.assign(world.style, { width: `${SRC_W * startScale}px`, height: `${SRC_H * startScale}px` });
  world.style.setProperty('--unit', `${startScale}px`);
  world.style.setProperty('--edge', `${16 / camera.endZoom}px`);
  Object.assign(pane.style, {
    left: `${WINDOW.x * startScale}px`, top: `${WINDOW.y * startScale}px`,
    width: `${WINDOW.w * startScale}px`, height: `${WINDOW.h * startScale}px`
  });
  pane.style.setProperty('--unit', `${first.scale}px`);
  // 第一屏的画没铺满窗口（比 16:9 高的窗口上下有空、很扁的窗口左右有空）：空的地方先用延伸盖住，镜头一动就化开。
  const garden = { left: Math.round(first.left), top: Math.round(first.top), width: SRC_W * first.scale, height: SRC_H * first.scale };
  extension.hidden = !(garden.left > 0.5 || garden.top > 0.5
    || garden.left + garden.width < width - 0.5 || garden.top + garden.height < height - 0.5);
  for (const [name, value] of [['--gl', garden.left], ['--gt', garden.top], ['--gw', garden.width], ['--gh', garden.height]]) {
    extension.style.setProperty(name, `${value}px`);
  }
  // 空出来的地方小（正常窗口）柔化 20 像素，同第 1 步；空得多时柔化得更开，免得延伸里认得出主机和字的影子。
  // 竖着的可视区上限跟着宽度走：手机的视口按电脑宽度（比如 1280）算时，64 像素其实很小。
  const blurLimit = width < height ? Math.max(64, width * 0.16) : 64;
  const blurFor = (gap) => (gap <= 60 ? 20 : Math.min(blurLimit, 20 + (gap - 60) * 0.35));
  extension.style.setProperty('--blur', `${blurFor(Math.max(garden.left, garden.top))}px`);
  backdrop.style.setProperty('--blur', `${blurFor(Math.max(second.left, second.top))}px`);
  // 滚动距离照 style.css 量（先摘掉上次写的高度）；页面只留到镜头停稳、第二屏最后一个按钮显完（SETTLED）为止，
  // 后面那段滑了画面不再变的路不留（M585）。进度仍按整段距离算，每个滚动位置上的画面和原来一样。
  track.style.removeProperty('height');
  trackTop = track.offsetTop;
  travel = Math.max(1, track.offsetHeight - stage.offsetHeight);
  track.style.height = `${stage.offsetHeight + Math.ceil(travel * SETTLED)}px`;
}

function buildAnimations() {
  for (const animation of animations) animation.cancel();
  animations = [];
  timeline = null;
  let options = { duration: 1000, fill: 'both' };
  if (pinned === null && !query.has('js') && typeof ScrollTimeline === 'function') {
    timeline = new ScrollTimeline({ source: document.documentElement, axis: 'block' });
    options = { timeline, rangeStart: `${trackTop}px`, rangeEnd: `${trackTop + travel}px`, fill: 'both' };
  }
  const animate = (node, frameAt) => {
    const frames = [];
    for (let i = 0; i <= STEPS; i++) frames.push({ offset: i / STEPS, ...frameAt(i / STEPS) });
    let animation;
    try {
      animation = node.animate(frames, options);
    } catch (error) {
      timeline = null;
      options = { duration: 1000, fill: 'both' };
      animation = node.animate(frames, options);
    }
    if (!timeline) animation.pause();
    animations.push(animation);
  };
  const fade = (value) => ({ opacity: value.toFixed(4) });

  animate(world, (p) => {
    const at = cameraAt(p);
    return { transform: `translate(${at.x.toFixed(3)}px, ${at.y.toFixed(3)}px) scale(${at.zoom.toFixed(6)})` };
  });
  // 刚进画的白机箱先压暗一点，随着退远慢慢亮起来，免得画面一下变白。
  for (const node of shades) animate(node, (p) => fade(0.30 * (1 - ramp(cameraEase(p), 0.04, 0.66))));
  // 玻璃：窗框压在画上的一圈暗边和一道斜的反光，镜头离开玻璃后才显出来。
  animate(glass, (p) => fade(ramp(cameraEase(p), 0.02, 0.34)));
  animate(sheen, (p) => ({ transform: `translate(${(-16 * (1 - cameraEase(p))).toFixed(3)}%, 0)` }));
  // 第一屏停稳时窗框和螺丝座都还不该看见：延伸先盖着，镜头一动，延伸化开、螺丝座显出来。
  animate(extension, (p) => fade(1 - ramp(p, 0, 0.06)));
  for (const node of tabs) animate(node, (p) => fade(ramp(p, 0, 0.06)));
  SCREEN1_TEXT.forEach((spec, index) => animate(screen1Text[index], (p) => fade(1 - ramp(p, spec[5], spec[6]))));
  SCREEN2_TEXT.forEach((spec, index) => animate(screen2Text[index], (p) => fade(1 - ramp(p, spec[5], spec[6]))));
}

// 进度 0 → 1 在当前模式下对应哪一段滚动位置（镜头模式：轨道那一段；两屏模式：第一屏顶到第二屏顶）。
function scrollSpan() {
  if (camera) return { start: trackTop, length: travel };
  const screens = document.querySelectorAll('.screen');
  return { start: screens[0].offsetTop, length: Math.max(1, screens[1].offsetTop - screens[0].offsetTop) };
}
function readProgress() {
  if (pinned !== null) return pinned;
  const span = scrollSpan();
  const progress = (window.scrollY - span.start) / span.length;
  // 镜头模式下页底就是 SETTLED，那时画面已和进度 1 一样：按 1 算，第二屏三个按钮照常可点
  return camera && progress >= SETTLED - 1 / span.length ? 1 : clamp01(progress);
}

const viewportKey = () => `${root.clientWidth}x${ruler.offsetHeight}`;
let laidOutFor = '';                    // 现在的排版是按哪个可视区算的
let lastProgress = window.__motionHomeAtEnd ? 1 : query.has('at') ? clamp01(Number(query.get('at')) || 0) : null;   // 可视区变化前停在哪（?at=0.35 是自查用的初值）
let lastRest = null;
function update() {
  if (viewportKey() !== laidOutFor) return;      // 可视区刚变、还没重排：这一刻的滚动位置不作数
  const progress = readProgress();
  lastProgress = progress;
  scrollCue.hidden = progress > .04;
  if (!camera) return;
  if (!timeline) for (const animation of animations) animation.currentTime = progress * 1000;
  const rest = progress < REST_TOP ? 'top' : progress > REST_END ? 'end' : 'moving';
  if (rest !== lastRest) { stage.dataset.rest = rest; lastRest = rest; }
  if (listeners.size) {
    const at = cameraAt(progress);
    for (const listener of listeners) listener(progress, at);
  }
}

let frameRequested = false;
function requestUpdate() {
  if (frameRequested) return;
  frameRequested = true;
  requestAnimationFrame(() => { frameRequested = false; update(); });
}

// ---------------------------------------------------------------- 镜头，和可视区变化
// 镜头动画。不管可视区多大、多扁、多窄多高都走它：全屏、开着开发者工具、拖成竖条、手机横着竖着都一样，
// 画铺不满的地方用延伸铺（竖着的手机上就是中间横着一条画，上下是延伸）。手机不特殊对待。
function refresh() {
  const key = viewportKey();
  if (key === laidOutFor) return;
  const keep = lastProgress;                     // 可视区变之前停在哪，重排后回到同一进度
  root.classList.add('cine');
  for (const { button, link } of hotspots) {
    const host = button.screen === 'screen1' ? pane : world;
    if (link.parentElement !== host) host.append(link);
  }
  for (const panel of panels) {
    const host = panel.screen === 'screen1' ? pane : null;
    if (!host) { panel.box.remove(); panel.face.remove(); continue; }
    if (panel.box.parentElement === host) continue;
    host.insertBefore(panel.face, fx);           // 小图垫在动效层底下
    host.append(panel.box);
  }
  loadStage();
  layoutCamera();
  buildAnimations();
  laidOutFor = key;
  if (keep !== null && pinned === null) {
    const span = scrollSpan();
    const target = span.start + span.length * keep;
    if (Math.abs(window.scrollY - target) > 1) window.scrollTo(0, target);
  }
  lastRest = null;
  update();
}

const scrollCue = document.querySelector('.scroll-cue');
scrollCue.addEventListener('click', event => {
  event.preventDefault();
  const { start, length } = scrollSpan();
  window.scrollTo({ top: start + length, behavior: 'smooth' });
});

new ResizeObserver(refresh).observe(root);
window.addEventListener('resize', refresh);
window.addEventListener('scroll', requestUpdate, { passive: true });
refresh();

// ---------------------------------------------------------------- 留给后面动效的接口
window.HOME = {
  showAtEnd() {
    const { start, length } = scrollSpan();
    window.scrollTo({ top: start + length, behavior: 'instant' });
    update();
  },
  paneAtEnd() {
    const at = placement('screen2', stage.clientWidth, stage.clientHeight);
    return { left: Math.round(at.left) + WINDOW.x * at.scale, top: Math.round(at.top) + WINDOW.y * at.scale,
      width: WINDOW.w * at.scale, height: WINDOW.h * at.scale, radius: 1.2 * WINDOW.w / SRC_W * at.scale };
  },
  get firstScreenReady() { return firstScreenReady; },
  fx,                                   // 动效层：跟着画一起缩放、一起被窗口内沿裁切；坐标 = 第一屏原图百分比
  progress: readProgress,               // 当前滚动进度 0（第一屏）→ 1（整台主机）
  camera: () => (camera ? cameraAt(readProgress()) : null),   // { ease, zoom, x, y }；zoom 是相对第一屏的倍率
  onProgress(listener) { listeners.add(listener); requestUpdate(); return () => listeners.delete(listener); },
  // 副屏：ready 小图读好了没有；fx 交给灯效模块的那一份（小图、状态、开机时刻表的回调）；still() 不动的亮屏。
  screen: { ready: panelArtReady, fx: panelFx, still: stillPanels }
};
listeners.add((progress) => { panelState.sheen = progress; });   // 镜头往后退时，屏的玻璃上有一道反光跟着走
// 动效脚本没跑起来也不能一直黑着：第一屏的画出来 6 秒后屏还没亮，就直接用小图。
firstScreenReady.then(() => setTimeout(stillPanels, 6000));

// 首页只订阅副屏小包；一分钟重读与后台暂停由实况共用取数层负责。
const liveClient = document.createElement('script');
// 读不到实况时的提示（本人 11-23 选的 A）：在“实时状态”“它如何工作”两个按钮正下方，跟着画一起缩放，不是按钮、不挡东西。
// 只在连不上时出现，一直显示到连上；连上了不换字、不变绿，带着原样慢慢收走（本人 11-23：首页没有“连上了”这一步）。
// 出来、收走的动法在 style.css 的 .home-conn；来回抖时同一枚签顺着当下的样子掉头，不闪、不叠两层。副屏和动效照常。
const tip = element('div', 'home-conn', pane);
tip.setAttribute('role', 'status'); tip.hidden = true;
tip.innerHTML = '<p class="home-conn__line"><b></b><span class="home-conn__at"></span></p><p class="home-conn__sub"></p>';
const [tipSay, tipAt, tipSub] = ['b', '.home-conn__at', '.home-conn__sub'].map((selector) => tip.querySelector(selector));
let tipHide = 0, tipNext = null, tipSize = null;
function tipWrite({ pair, say, at, sub }) {
  tip.classList.toggle('is-pair', pair);
  tipSay.textContent = say; tipAt.textContent = at; tipSub.textContent = sub;
}
// 签在画面上时换字：旧字先淡掉，外框从旧大小慢慢变到新大小，新字再淡进来，不一下跳大跳小。
function tipText(next) {
  if (tipNext) { tipNext = next; return; }            // 旧字正在淡掉，淡完写最新的这一份
  if (tip.classList.contains('is-pair') === next.pair && tipSay.textContent === next.say
    && tipAt.textContent === next.at && tipSub.textContent === next.sub) return;
  if (tip.hidden) { tipWrite(next); return; }
  tipNext = next;
  const lines = [...tip.children];
  const fade = lines.map((line) => line.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: 'ease-in', fill: 'forwards' }));
  fade[0].onfinish = () => {
    const from = [tip.offsetWidth, tip.offsetHeight];
    tipSize?.cancel();
    tipWrite(tipNext); tipNext = null;
    const to = [tip.offsetWidth, tip.offsetHeight];
    for (const step of fade) step.cancel();
    if (from[0] !== to[0] || from[1] !== to[1]) tipSize = tip.animate([
      { width: `${from[0]}px`, height: `${from[1]}px` }, { width: `${to[0]}px`, height: `${to[1]}px` }
    ], { duration: 520, easing: 'cubic-bezier(.45,0,.2,1)' });
    for (const line of lines) line.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, delay: 120, easing: 'ease-out', fill: 'backwards' });
  };
}
// 家里网站上这台设备的配对失效时，原来顶上那句说明也放在这里（不亮灯）。
function connectionTip(off, reason, at, sub, pair = '') {
  root.classList.toggle('home-off', !!off);           // “实时状态”按钮上那颗点跟着变橙、变回绿（.home-lamp）
  if (off || pair) {
    clearTimeout(tipHide);
    tipText({ pair: !off, say: off ? reason || '连不上实况服务' : pair,
      at: !off ? '' : at ? ` · 右边屏上是 ${at} 的数据` : ' · 右边屏上暂时没有数', sub: off ? sub : '' });
    if (tip.hidden) { tip.hidden = false; void tip.offsetWidth; }
    tip.classList.add('is-shown');
  } else if (tip.classList.contains('is-shown')) {
    tip.classList.remove('is-shown');
    tipHide = setTimeout(() => { tip.hidden = true; }, 900);   // 收走的动画（style.css 里 0.8 秒）走完再拿掉
  }
}
liveClient.src = '/live/_lib/live-client.js';
const watchScreen = () => window.Live?.watch('screen', {}, {
  link(state) {
    down.hostOff = state.hostOff;
    down.silent = !!state.silent;
    down.offline = state.offline;
    down.paused = !!state.publicPaused;
    for (const panel of panels) for (const { link } of panel.cells) {
      if (state.text) link.title = state.text; else link.removeAttribute('title');
    }
    // 失败后先隔 2、4、8 秒各再试一次，之后跟着每分钟重读一起试（live-client.js 的 retryFailure 和 startPolling）。
    connectionTip(state.offline, state.reason, state.pageAtText, '每分钟自动再试，连上就换成最新的', state.pairNotice);
    renderScreen(state.data, state.meta, state.warming, state.offline ? null : state.now);
  }
});
liveClient.onload = watchScreen;
// 实况那份脚本没取到（断网、被拦）：没有数可等了，按连不上算，别让四格一直空着。
// 之后网络回来、页面回到前台，或在前台每过一分钟，再取一次同一份脚本；取到了照常订阅，签和四格自己接上（M983）。
let clientRetry = 0, clientFetching = false;
function fetchClientAgain() {
  if (window.Live || clientFetching || document.hidden) return;
  clientFetching = true;
  const again = document.createElement('script');
  again.src = liveClient.src;
  again.onload = () => {
    clientFetching = false;
    clearInterval(clientRetry);
    removeEventListener('online', fetchClientAgain);
    document.removeEventListener('visibilitychange', fetchClientAgain);
    watchScreen();
  };
  again.onerror = () => { clientFetching = false; again.remove(); };
  document.head.append(again);
}
liveClient.onerror = () => {
  down.offline = true;
  connectionTip(true, '连不上实况服务', '', '刷新这一页再试，连上就换成最新的');
  renderScreen(null, null);
  clientRetry = setInterval(fetchClientAgain, 60000);
  addEventListener('online', fetchClientAgain);
  document.addEventListener('visibilitychange', fetchClientAgain);
};
document.head.append(liveClient);
})();
