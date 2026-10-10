// 驾驶舱各块的 HTML。构建时用最近一份快照画出首帧，浏览器拿到新数据后用同一组函数原地换掉每块里面的内容。
// 每块外框（[data-cp] 所在的元素）始终在，数据没到只换字，不出空框、不换版式。
import { hm, when, light, splitChecked, dedupeCards, taskAlerts } from './model.js';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// 图片地址由页面传入（构建时 Vite 给的带指纹地址）；没传时按素材原名
const src = (ctx, name) => ctx?.img?.[name] || '/assets/cockpit/' + name;
const dot = (state) => `<span class="cp-dot is-${light(state)}" aria-hidden="true"></span>`;
const notRead = (at, now) => `还没读到${at ? `（上次 ${esc(when(at, now))}）` : ''}`;
const copyBtn = (id, label = '复制给 AI') => (id ? `<button type="button" class="cp-btn" data-copy-ai="${esc(id)}">${label}</button>` : '');

// 一张事实卡：标题、一句话、判断标准、读到的时间；没读到时写清上次读到是几点
export function card(c, now) {
  const missing = c.state === 'unavailable' || c.state === 'reading';
  const text = c.text ? esc(c.text) + (missing && c.observed_at ? `<span class="cp-stale">（这是 ${esc(when(c.observed_at, now))} 读到的，之后没读到）</span>` : '') : notRead(c.observed_at, now);
  const time = !missing && c.observed_at ? `<p class="cp-time">${esc(when(c.observed_at, now))} 读到</p>` : '';
  return `<article class="cp-card is-${light(c.state)}"><h3>${dot(c.state)}${esc(c.title)}</h3><p>${text}</p>`
    + (c.criteria_text ? `<p class="cp-criteria">判断标准：${esc(c.criteria_text)}</p>` : '')
    + time + (['red', 'attention'].includes(c.state) ? `<div class="cp-actions">${copyBtn(c.copy_ai_id)}</div>` : '') + `</article>`;
}

// 第一屏“现在”：一句结论 + 读到时间（连不上电脑时在这里说清楚，不在别处插条）
export function now(v, ctx) {
  const n = v.counts.need_you, ai = v.counts.ai_following, wait = v.counts.deferred;
  const head = !v.ok ? `${dot('unavailable')}<strong>${notRead(v.served_at, ctx.now)}</strong>`
    : n > 0 ? `${dot('red')}<strong>要你处理 ${n} 项</strong>`
    : `${dot(v.verdict.state === 'attention' ? 'attention' : 'ok')}<strong>现在不用你处理</strong>`;
  const bits = [ai ? `AI 在核对 ${ai} 项，你不用管` : '', wait ? `${wait} 件等条件到了再办` : ''].filter(Boolean).join(' · ');
  const read = ctx.offline ? `连不上电脑，下面是 ${esc(when(v.served_at, ctx.now))} 读到的` : v.served_at ? `${esc(when(v.served_at, ctx.now))} 读到（北京时间）` : '';
  return `<p class="cp-verdict">${head}</p><p class="cp-verdict-sub">${[bits, read].filter(Boolean).join(' · ')}</p>`;
}

// 四个数字小卡，点了跳到对应分区
export function tiles(v) {
  const alerts = taskAlerts(v).length, backup = v.counts.backup_problems;
  const t = [
    ['need-you', v.counts.need_you, '项', '要你处理', v.counts.need_you ? 'red' : 'ok'],
    ['ai', v.counts.ai_following, '项', 'AI 在核对', v.counts.ai_following ? 'attention' : 'ok'],
    ['tasks', alerts, '个', '自动任务出错或要留意', alerts ? 'attention' : 'ok'],
    ['backup', backup, '项', '备份要留意', backup ? 'attention' : 'ok'],
  ];
  return t.map(([href, num, unit, label, s]) => `<a class="cp-tile is-${light(s)}" href="#${href}"><span class="cp-tile-num">${esc(num)}<small>${unit}</small></span><span class="cp-tile-label">${dot(s)}${label}</span></a>`).join('');
}

// 安全和授权：只显示，点了去授权页对应卡片办理（锚点和 O3 对齐）
export function security(v, ctx) {
  const s = v.security, pd = s.personal_data.state, un = s.unrestricted.state, win = s.windows.state;
  const off = ctx.offline || !v.ok;
  const rows = [
    ['cockpit-07-icon-01.png', '个人资料', pd === 'unlocked' ? ['已解锁', s.personal_data.expires_at ? '到 ' + hm(s.personal_data.expires_at) : '', 'ok'] : pd === 'locked' ? ['锁着', '要用时再解锁', 'gray'] : ['没读到', '', 'gray'], '/computer-access/#personal-data'],
    ['cockpit-07-icon-02.png', '无限制授权', un === 'active' ? ['开着', s.unrestricted.expires_at ? '到 ' + hm(s.unrestricted.expires_at) : '', 'attention'] : un === 'inactive' ? ['正常关着', '', 'gray'] : ['没读到', '', 'gray'], '/computer-access/#unrestricted'],
    ['cockpit-07-icon-03.png', 'Windows', win === 'locked' ? ['已锁屏', '', 'ok'] : win === 'unlocked' ? ['未锁屏', '', 'ok'] : ['没读到', '', 'gray'], '/computer-access/#windows'],
    ['', '电脑', off ? ['读不到', s.observed_at ? '上次 ' + when(s.observed_at, ctx.now) : '', 'gray'] : ['在线', s.computer.uptime_hours != null ? `开机 ${s.computer.uptime_hours} 小时` : '', 'ok'], '/computer-access/'],
  ];
  return rows.map(([icon, label, [word, sub, state], href]) => `<a class="cp-sec-item" href="${href}">`
    + (icon ? `<img src="${src(ctx, icon)}" alt="" width="58" height="35" loading="eager">` : `<span class="cp-sec-pc" aria-hidden="true"></span>`)
    + `<span class="cp-sec-label">${label}</span><span class="cp-sec-word">${dot(state)}${esc(word)}</span><span class="cp-sec-sub">${esc(sub)}</span><span class="cp-sec-go">${href === '/computer-access/' ? '看连接状态 →' : '去授权页办理 →'}</span></a>`).join('');
}

// 要我处理的事 + AI 在核对 + 按条件再办
export function needYou(v, ctx) {
  const cards = v.need_you.map((x) => {
    const { title, checked } = splitChecked(x.title);
    const step = splitChecked(x.next_step).title;
    return `<article class="cp-card cp-todo is-red"><h3>${dot('red')}${esc(title)}</h3>`
      + (step && step !== title ? `<p>${esc(step)}</p>` : '')
      + `<p class="cp-meta">${[x.project, x.done_when ? '完成条件：' + x.done_when : '', x.last_checked_at ? '最后核对 ' + when(x.last_checked_at, ctx.now) : checked].filter(Boolean).map(esc).join(' · ')}</p>`
      + `<div class="cp-actions">${copyBtn(x.copy_ai_id)}</div></article>`;
  }).join('');
  const body = cards ? `<div class="cp-todos">${cards}</div>` + (v.need_you.length > 1 ? `<p class="cp-all"><button type="button" class="cp-btn" data-copy-ai-all>全部 ${v.need_you.length} 项一起复制给 AI</button></p>` : '')
    : `<p class="cp-empty">${dot(v.ok ? 'ok' : 'unavailable')}${v.ok ? '现在没有要你动手的事。' : notRead(v.served_at, ctx.now)}</p>`;
  const ai = v.ai_following.length
    ? `<details class="cp-more" id="ai"><summary>AI 在核对 ${v.ai_following.length} 项，你暂时不用管（点开看是哪些）</summary><ul class="cp-list">${v.ai_following.map((x) => `<li>${esc(splitChecked(x.title).title)}${x.project ? `<span class="cp-meta"> · ${esc(x.project)}</span>` : ''}</li>`).join('')}</ul></details>`
    : `<p class="cp-line" id="ai">${dot('ok')}AI 这边没有要核对的。</p>`;
  const wait = v.deferred.length
    ? `<h3 class="cp-sub">等条件到了再做（${v.deferred.length} 项）</h3><ul class="cp-list cp-wait">${v.deferred.map((x) => `<li><b>${esc(x.done_when || '你方便时')}</b><span>${esc(splitChecked(x.title).title)}</span></li>`).join('')}</ul>`
    : '';
  return body + ai + wait;
}

// 电脑：读数卡 + 两张 Grafana 曲线卡 + 远程和网络
export function computer(v, ctx) {
  const g = v.grafana;
  const charts = g.links.filter((l) => l.id !== 'overview');
  const graf = charts.length
    ? charts.map((l) => `<a class="cp-card cp-chart is-green" href="${esc(l.url)}" target="_blank" rel="noopener"><h3><span class="cp-chart-icon" aria-hidden="true"></span>${esc(l.label)} 24 小时曲线</h3><p>在新标签页打开图表网页（Grafana）。</p></a>`).join('')
    : `<article class="cp-card is-gray"><h3>${dot('unavailable')}24 小时曲线</h3><p>图表网页现在打不开${g.checked_at ? `（上次检查 ${esc(when(g.checked_at, ctx.now))}）` : ''}。</p></article>`;
  const cards = dedupeCards(v.sections.computer).map((c) => card(c, ctx.now)).join('');
  const remote = dedupeCards(v.sections.remote).map((c) => card(c, ctx.now)).join('') || card({ title: '远程连接', state: 'unavailable', text: '' }, ctx.now);
  return `<div class="cp-grid">${cards}${remote}${graf}</div>`;
}

export function backup(v, ctx) {
  const cards = dedupeCards(v.sections.backup_cloud).map((c) => card(c, ctx.now)).join('');
  return `<div class="cp-grid">${cards || card({ title: '备份', state: 'unavailable', text: '' }, ctx.now)}</div>`;
}

// 项目：在用的每个一张小卡；冻结的只列名字
export function projects(v, ctx) {
  const items = v.projects.items;
  if (!items.length) return `<p class="cp-empty">${dot('unavailable')}${notRead(v.projects.observed_at, ctx.now)}</p>`;
  const live = items.filter((p) => p.mode !== 'frozen_static'), frozen = items.filter((p) => p.mode === 'frozen_static');
  const stateOf = (p) => (p.waiting_user > 0 ? 'red' : ['ok', 'not_applicable'].includes(p.run_health) && p.overview === 'ok' ? 'ok' : ['error', 'failed', 'red'].includes(p.run_health) || ['error', 'red'].includes(p.overview) ? 'red' : ['warn', 'attention'].includes(p.run_health) || ['warn', 'attention'].includes(p.overview) ? 'attention' : ['ok', 'not_applicable'].includes(p.run_health) || p.overview === 'ok' ? 'ok' : 'unavailable');
  const name = (p) => (ctx.projectUrls?.[p.name] ? `<a href="${esc(ctx.projectUrls[p.name])}">${esc(p.name)}</a>` : esc(p.name));
  const card1 = (p, s) => {
    const wait = [p.waiting_user ? `等你 ${p.waiting_user} 件` : '', p.waiting_ai ? `等 AI ${p.waiting_ai} 件` : '', p.on_hold ? `暂缓 ${p.on_hold} 件` : ''].filter(Boolean).join(' · ');
    return `<article class="cp-proj is-${light(s)}"><h3>${dot(s)}${name(p)}</h3>${p.health_reason ? `<p>${esc(p.health_reason)}</p>` : ''}${wait ? `<p class="cp-meta">${esc(wait)}</p>` : ''}</article>`;
  };
  const busy = live.filter((p) => stateOf(p) !== 'ok' || p.waiting_user > 0), calm = live.filter((p) => !busy.includes(p));
  const cards = busy.map((p) => card1(p, stateOf(p))).join('');
  const chips = calm.map((p) => `<li>${dot('ok')}${name(p)}</li>`).join('');
  return (cards ? `<div class="cp-grid cp-grid-proj">${cards}</div>` : '')
    + (chips ? `<h3 class="cp-sub">正常运行的 ${calm.length} 个</h3><ul class="cp-chips">${chips}</ul>` : '')
    + (frozen.length ? `<p class="cp-line cp-frozen">${dot('unavailable')}冻结的 ${frozen.length} 个（AI 不再维护）：${frozen.map(name).join('、')}</p>` : '');
}

// 今天的动态：今天的变化卡 + 今天的事件 + 你纠正 AI 的次数 + 读不到的来源
const EVENT = { acceptance_reviewed: (x) => `验收核对了 ${x.count ?? ''} 项${x.passed != null ? `，通过 ${x.passed} 项` : ''}`, freeze_captured: () => '电脑卡住时自动留了一次现场' };
export function todayBlock(v, ctx) {
  const cards = dedupeCards(v.sections.today).map((c) => card(c, ctx.now)).join('');
  const events = v.today.items.map((x) => `<li><span class="cp-time">${esc(when(x.at, ctx.now))}</span> ${esc((EVENT[x.type] || (() => '电脑上记了一件事'))(x))}</li>`).join('');
  const oc = v.owner_corrections.text ? card({ title: '你纠正 AI 的次数', state: v.owner_corrections.status === 'ok' ? 'ok' : 'unavailable', text: v.owner_corrections.text }, ctx.now) : '';
  const gaps = v.source_gaps.length ? `<h3 class="cp-sub">这次没读全的来源</h3><ul class="cp-list">${v.source_gaps.map((g) => `<li>${dot('attention')}${esc(g.title)}${g.since ? `<span class="cp-meta">（${esc(when(g.since, ctx.now))} 起）</span>` : ''}</li>`).join('')}</ul>` : '';
  return `<div class="cp-grid">${cards}${oc}</div>`
    + `<h3 class="cp-sub">今天发生的事</h3>` + (events ? `<ul class="cp-list">${events}</ul>` : `<p class="cp-line">${dot('ok')}今天还没有新事件。</p>`) + gaps;
}

export const REGIONS = { now, tiles, security, 'need-you': needYou, computer, backup, projects, today: todayBlock };

// 整页：外框固定，内容由上面各函数填
export function page(v, ctx) {
  const r = (k) => `<div class="cp-body" data-cp="${k}">${REGIONS[k](v, ctx)}</div>`;
  const sec = (id, title, w, h, sub, body) => `<section class="cp-section" id="${id}"><div class="cp-head"><h2><img src="${src(ctx, title[0])}" alt="${title[1]}" width="${w}" height="${h}" loading="eager"></h2><p>${sub}</p></div>${body}</section>`;
  return `<section class="cp-section cp-hero" id="top">
  <div class="cp-hero-copy">
    <h1><img src="${src(ctx, 'cockpit-01-title-01.png')}" alt="驾驶舱" width="483" height="198" loading="eager"></h1>
    ${r('now')}
    <p class="cp-lead">这台电脑现在好不好、要我做什么，一页看完。每分钟从电脑读一次，时间都是北京时间；右下角 ↻ 立刻重读。</p>
    <p class="cp-legend">${dot('ok')}都正常　${dot('attention')}要留意　${dot('red')}要你马上处理　${dot('unavailable')}没读到，或正常关着</p>
  </div>
  <img class="cp-hero-art" src="${src(ctx, 'cockpit-01-illustration-01.png')}" alt="" width="866" height="326" loading="eager">
  <div class="cp-tiles" data-cp="tiles">${tiles(v)}</div>
  <div class="cp-security-wrap"><h2 class="cp-security-title"><img src="${src(ctx, 'cockpit-07-title-01.png')}" alt="安全和授权" width="719" height="180" loading="eager"></h2><div class="cp-security" data-cp="security">${security(v, ctx)}</div></div>
</section>
${sec('need-you', ['cockpit-01-title-02.png', '要我处理的事'], 348, 84, '要你动手的事；做完后 AI 核实，会自己从这里消失。', r('need-you'))}
${sec('tasks', ['cockpit-05-title-01.png', '自动任务'], 588, 192, '电脑自己在做的事，有没有按时做、做成没有。点一条船或清单里的一行，看它在做什么、上次下次什么时候跑、怎么停、停了影响什么。', '<div class="cp-river" data-today-river aria-label="今天的河"></div>')}
${sec('computer', ['cockpit-02-title-01.png', '电脑'], 317, 184, '这台电脑现在累不累、还剩多少地方；人不在电脑前能不能连上它。', r('computer'))}
${sec('backup', ['cockpit-06-title-01.png', '备份和云端'], 716, 199, '东西有没有按时备份、云端的钱够不够。', r('backup'))}
${sec('projects', ['cockpit-08-title-01.png', '项目'], 369, 222, '每个在用的项目现在怎么样、有没有等你的事。点名字进项目页。', r('projects'))}
${sec('today', ['cockpit-09-title-01.png', '今天的动态'], 675, 220, '今天有什么变化。代码提交不等于已经上线。', r('today'))}`;
}
