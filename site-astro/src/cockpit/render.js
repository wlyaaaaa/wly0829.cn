// 驾驶舱各块的 HTML。构建时用最近一份快照画出首帧，浏览器拿到新数据后用同一组函数原地换掉每块里面的内容。
// 每块外框（[data-cp] 所在的元素）始终在，数据没到只换字，不出空框、不换版式。
import { hm, when, light, splitChecked, dedupeCards, isToday } from './model.js';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// 图片地址由页面传入（构建时 Vite 给的带指纹地址）；没传时按素材原名
const src = (ctx, name) => ctx?.img?.[name] || '/assets/cockpit/' + name;
const anchor = (id) => `<span class="cp-anchor" id="${esc(id)}"></span>`;
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
  return anchor('pending') + body + ai + wait;
}

// 电脑：读数卡 + 两张 Grafana 曲线卡 + 远程和网络
export function computer(v, ctx) {
  const g = v.grafana;
  const charts = g.links.filter((l) => l.id !== 'overview');
  const graf = charts.length
    ? charts.map((l) => `<a class="cp-card cp-chart is-green" href="${esc(l.url)}" target="_blank" rel="noopener"><h3><span class="cp-chart-icon" aria-hidden="true"></span>${esc(l.label)} 24 小时曲线</h3><p>在新标签页打开图表网页（Grafana）。</p></a>`).join('')
    : `<article class="cp-card is-gray"><h3>${dot('unavailable')}24 小时曲线</h3><p>图表网页现在打不开${g.checked_at ? `（上次检查 ${esc(when(g.checked_at, ctx.now))}）` : ''}。</p></article>`;
  // Grafana 后台登录：根地址来自接口，后面拼 login；接口没给地址就不出这张卡
  const login = g.url ? `<a class="cp-card cp-chart cp-login" href="${esc(new URL('login', g.url).href)}" target="_blank" rel="noopener"><h3><span class="cp-login-icon" aria-hidden="true"></span>Grafana 后台登录 →</h3><p>登录后看全部图表、改面板（新标签页）。</p></a>` : '';
  const cards = dedupeCards(v.sections.computer).map((c) => card(c, ctx.now)).join('');
  const remote = (dedupeCards(v.sections.remote).map((c) => card(c, ctx.now)).join('') || card({ title: '远程连接', state: 'unavailable', text: '' }, ctx.now)).replace('<article ', '<article id="remote" ');
  return `<div class="cp-grid">${cards}${remote}</div><div id="grafana" class="cp-grid cp-charts">${graf}${login}</div>`;
}

export function backup(v, ctx) {
  const cards = dedupeCards(v.sections.backup_cloud).map((c) => card(c, ctx.now)).join('');
  return anchor('backups') + `<div class="cp-grid">${cards || card({ title: '备份', state: 'unavailable', text: '' }, ctx.now)}</div>`;
}

// 项目：在用的每个一张小卡；冻结的只列名字
// 其他页面“看驾驶舱”的链接落点：/cockpit/#<项目名>，项目名取项目页地址里的那一段；旧链接里的别名也认
const slugOf = (url) => (/^\/projects\/([^/]+)\/$/.exec(url || '') || [])[1] || '';
const ALIAS = { 'github-index': ['github-local-index'] };
const idsOf = (slug) => (slug ? [slug, ...(ALIAS[slug] || [])] : []);
export function projects(v, ctx) {
  const items = v.projects.items;
  if (!items.length) return `<div class="cp-anchors">${[...new Set(Object.values(ctx.projectUrls || {}).map(slugOf).flatMap(idsOf))].filter(Boolean).map(anchor).join('')}</div><p class="cp-empty">${dot('unavailable')}${notRead(v.projects.observed_at, ctx.now)}</p>`;
  const live = items.filter((p) => p.mode !== 'frozen_static'), frozen = items.filter((p) => p.mode === 'frozen_static');
  const stateOf = (p) => (p.waiting_user > 0 ? 'red' : ['ok', 'not_applicable'].includes(p.run_health) && p.overview === 'ok' ? 'ok' : ['error', 'failed', 'red'].includes(p.run_health) || ['error', 'red'].includes(p.overview) ? 'red' : ['warn', 'attention'].includes(p.run_health) || ['warn', 'attention'].includes(p.overview) ? 'attention' : ['ok', 'not_applicable'].includes(p.run_health) || p.overview === 'ok' ? 'ok' : 'unavailable');
  const name = (p) => (ctx.projectUrls?.[p.name] ? `<a href="${esc(ctx.projectUrls[p.name])}">${esc(p.name)}</a>` : esc(p.name));
  const card1 = (p, s) => {
    const wait = [p.waiting_user ? `等你 ${p.waiting_user} 件` : '', p.waiting_ai ? `等 AI ${p.waiting_ai} 件` : '', p.on_hold ? `暂缓 ${p.on_hold} 件` : ''].filter(Boolean).join(' · ');
    const [id, ...more] = idsOf(slugOf(ctx.projectUrls?.[p.name]));
    return `<article class="cp-proj is-${light(s)}"${id ? ` id="${esc(id)}"` : ''}>${more.map(anchor).join('')}<h3>${dot(s)}${name(p)}</h3>${p.health_reason ? `<p>${esc(p.health_reason)}</p>` : ''}${wait ? `<p class="cp-meta">${esc(wait)}</p>` : ''}</article>`;
  };
  const busy = live.filter((p) => stateOf(p) !== 'ok' || p.waiting_user > 0), calm = live.filter((p) => !busy.includes(p));
  const cards = busy.map((p) => card1(p, stateOf(p))).join('');
  const chips = calm.map((p) => { const [id, ...more] = idsOf(slugOf(ctx.projectUrls?.[p.name])); return `<li${id ? ` id="${esc(id)}"` : ''}>${more.map(anchor).join('')}${dot('ok')}${name(p)}</li>`; }).join('');
  // 驾驶舱里没有的项目（冻结的、接口没给的），锚点落在项目区开头
  const shown = new Set(live.flatMap((p) => idsOf(slugOf(ctx.projectUrls?.[p.name]))));
  const rest = [...new Set(Object.values(ctx.projectUrls || {}).map(slugOf).flatMap(idsOf))].filter((id) => id && !shown.has(id));
  return `<div class="cp-anchors">${rest.map(anchor).join('')}</div>`
    + (cards ? `<div class="cp-grid cp-grid-proj">${cards}</div>` : '')
    + (chips ? `<h3 class="cp-sub">正常运行的 ${calm.length} 个</h3><ul class="cp-chips">${chips}</ul>` : '')
    + (frozen.length ? `<p class="cp-line cp-frozen">${dot('unavailable')}冻结的 ${frozen.length} 个（AI 不再维护）：${frozen.map(name).join('、')}</p>` : '');
}

// 今天的动态：今天的变化卡 + 今天的事件 + 你纠正 AI 的次数 + 读不到的来源
const EVENT = { acceptance_reviewed: (x) => `验收核对了 ${x.count ?? ''} 项${x.passed != null ? `，通过 ${x.passed} 项` : ''}`, freeze_captured: () => '电脑卡住时自动留了一次现场' };
// 两张常驻卡之一：今天代码变化。大数字 + 近 7 天（有逐日数就画 7 根柱，没有就比今天和日均）+ 提交最多的项目
const short = (d) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ''); return m ? `${+m[3]}日` : ''; };
const bars = (rows, unit) => {
  const max = Math.max(1, ...rows.map((r) => r.n || 0));
  return `<ol class="cp-bars">${rows.map((r) => `<li class="${r.n == null ? 'is-none' : ''}${r.now ? ' is-now' : ''}" title="${esc(r.label)} ${r.n == null ? '没数' : r.n + unit}"><span class="cp-bar" style="--h:${r.n == null ? 6 : Math.max(6, Math.round(r.n / max * 100))}%"></span><b>${r.n == null ? '—' : esc(r.n)}</b><small>${esc(r.label)}</small></li>`).join('')}</ol>`;
};
function codeCard(v, ctx) {
  const c = v.changes, n = c.today.commits;
  const head = n == null
    ? `<div class="cp-big"><b class="is-none">—</b><span>${notRead(c.observed_at, ctx.now)}</span></div>`
    : `<div class="cp-big"><b>${esc(n)}</b><span>个提交${c.today.repos_changed != null ? `<br>涉及 ${esc(c.today.repos_changed)} 个项目` : ''}</span></div>`;
  let trend = '';
  if (c.daily.some((d) => Number.isFinite(d.commits))) trend = `<p class="cp-cap">近 ${c.daily.length} 天每天提交</p>` + bars(c.daily.map((d, i) => ({ label: short(d.date), n: Number.isFinite(d.commits) ? d.commits : null, now: i === c.daily.length - 1 })), ' 个');
  else if (c.commits_7d != null && n != null) {
    const avg = Math.round(c.commits_7d / (c.window_days || 7));
    trend = `<p class="cp-cap">近 ${c.window_days} 天一共 ${esc(c.commits_7d)} 个，日均 ${avg} 个</p>` + bars([{ label: '近 7 天日均', n: avg }, { label: '今天', n, now: true }], ' 个');
  }
  const top = c.projects_7d.length ? (() => {
    const max = Math.max(1, ...c.projects_7d.map((p) => p.commits_7d));
    return `<p class="cp-cap">近 7 天提交最多的项目</p><ul class="cp-hbars">${c.projects_7d.map((p) => `<li><span>${esc(p.project)}</span><i style="--w:${Math.max(3, Math.round(p.commits_7d / max * 100))}%"></i><b>${esc(p.commits_7d)}</b></li>`).join('')}</ul>`;
  })() : '';
  const y = c.daily.length > 1 ? c.daily[c.daily.length - 2] : null;
  const yline = y && Number.isFinite(y.commits) && (early(ctx) || !n) ? `<p class="cp-cap cp-yesterday">昨天（${esc(monthDay(y.date))}）共 ${esc(y.commits)} 个提交</p>` : '';
  return `<article class="cp-feature cp-code"><h3>今天代码变化</h3>${head}${yline}${trend}${top}<p class="cp-time">提交不等于已经上线${c.observed_at ? ` · ${esc(when(c.observed_at, ctx.now))} 读到` : ''}</p></article>`;
}

// 两张常驻卡之二：你对 AI 说的话（9 类）。9 类计数没到时，退回纠正总数和近 7 天，不出空格、不写“未统计”
const early = (ctx) => Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Shanghai', hour: 'numeric', hourCycle: 'h23' }).format(ctx.now)) < 12;
const monthDay = (d) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ''); return m ? `${+m[2]} 月 ${+m[3]} 日` : ''; };
const WORDS9 = ['禁令', '纠正', '授权', '要求', '建议', '偏好', '事实', '询问', '好奇'];
function wordsCard(v, ctx) {
  const oc = v.owner_corrections;
  const cats = Array.isArray(oc.by_category) && oc.by_category.length ? oc.by_category : null;
  if (cats) {
    const count = (list, k) => { const x = (list || []).find((y) => y && y.category === k); return Number.isFinite(x?.count) ? x.count : 0; };
    const days = (Array.isArray(oc.history) ? oc.history : []).filter((d) => d && Array.isArray(d.by_category));
    const cells = WORDS9.map((k) => {
      const hot = k === '禁令' || k === '纠正';
      const week = days.reduce((n, d) => n + count(d.by_category, k), 0);
      return `<li class="${hot ? 'is-hot' : ''}"><small>${k}</small><b>${esc(count(cats, k))}</b><span>近 7 天 ${esc(week)}</span></li>`;
    }).join('');
    const asof = oc.complete === false && oc.observed_at ? `今天截至 ${esc(hm(oc.observed_at))}` : '今天';
    const none = WORDS9.every((k) => count(cats, k) === 0);
    const prev = days.filter((d) => d.date && d.date < (oc.date || '')).pop();
    const yline = prev && (early(ctx) || none) ? `<p class="cp-cap cp-yesterday">昨天（${esc(monthDay(prev.date))}）：${WORDS9.map((k) => `${k} ${count(prev.by_category, k)}`).join('、')}</p>` : '';
    return `<article class="cp-feature cp-words"><h3>你对 AI 说的话（按 9 类）</h3><p class="cp-cap">${none ? (oc.complete === false && oc.observed_at ? `今天截至 ${esc(hm(oc.observed_at))}，还没跟 AI 说话（0 条）` : '今天还没跟 AI 说话（0 条）') : `大数字是${asof}，小字是近 7 天；一条话含几类就各算一次`}</p>${yline}<ol class="cp-words9">${cells}</ol></article>`;
  }
  const hist = Array.isArray(oc.history) ? oc.history.filter((d) => d && d.date) : [];
  const known = hist.filter((d) => Number.isFinite(d.total));
  const last = Number.isFinite(oc.total) ? { date: oc.date, total: oc.total, today: true } : known.length ? known[known.length - 1] : null;
  const head = last
    ? `<div class="cp-big"><b>${esc(last.total)}</b><span>次纠正 AI<br>${last.today ? '今天' : `最近有数的一天（${esc(short(last.date))}）`}</span></div>`
    : `<div class="cp-big"><b class="is-none">—</b><span>纠正次数还没读到</span></div>`;
  const trend = hist.length ? `<p class="cp-cap">近 ${hist.length} 天每天纠正几次（— 是那天没有数）</p>` + bars(hist.map((d, i) => ({ label: short(d.date), n: Number.isFinite(d.total) ? d.total : null, now: i === hist.length - 1 })), ' 次') : '';
  return `<article class="cp-feature cp-words"><h3>你纠正 AI 的次数</h3>${head}${trend}<p class="cp-time">以后按 9 类分开显示：禁令、纠正、授权、要求、建议、偏好、事实、询问、好奇</p></article>`;
}

// 电脑后台今天做的事：一行总数 + 按北京时间的时间线（备份、系统镜像、出错、重启、卡住、验收）
const KIND = { backup: '备份', image: '系统镜像', failed: '出错', restart: '重启', freeze: '卡住', acceptance: '验收' };
const EVENT_KIND = { acceptance_reviewed: 'acceptance', freeze_captured: 'freeze' };
function activityBlock(v, ctx) {
  let a = v.today_activity, s = a.summary;
  if (!a.timeline.length && !Number.isFinite(s.tasks_run)) {
    const ran = v.automation.items.filter((t) => t.enabled !== false && isToday(t.last_run_at, ctx.now));
    s = { tasks_run: v.automation.items.length ? ran.length : null, tasks_failed: v.automation.items.length ? ran.filter((t) => t.state === 'failed').length : null };
    a = { ...a, observed_at: v.automation.observed_at || a.observed_at, timeline: v.today.items.map((x) => ({ at: x.at, kind: EVENT_KIND[x.type] || '', text: (EVENT[x.type] || (() => '电脑上记了一件事'))(x), level: x.type === 'freeze_captured' ? 'watch' : 'ok' })) };
  }
  const num = (x) => (Number.isFinite(x) ? x : '—');
  const errs = todayErrors(v);
  const line = `今天跑了 ${num(s.tasks_run)} 个任务、${errs ? `${errs.owner + errs.other} 个出错（${errorsText(errs)}）` : `${num(s.tasks_failed)} 个出错`}${Number.isFinite(s.backups_done) ? `，完成 ${s.backups_done} 项备份` : ''}${Number.isFinite(s.images_done) && s.images_done ? `、${s.images_done} 次系统镜像` : ''}`;
  const y = a.yesterday;
  const yline = y && Number.isFinite(y.tasks_run) && (early(ctx) || a.timeline.length < 3) ? `<p class="cp-cap cp-yesterday">昨天（${esc(monthDay(y.date))}）共跑了 ${num(y.tasks_run)} 个任务、${num(y.tasks_failed)} 个出错，完成 ${num(y.backups_done)} 项备份</p>` : '';
  const items = a.timeline.map((x) => `<li class="is-${light(x.level === 'act' ? 'red' : x.level === 'watch' ? 'attention' : x.level === 'ok' ? 'ok' : 'unavailable')}"><time>${esc(hm(x.at))}</time><i class="cp-tl-dot" aria-hidden="true"></i><span class="cp-tl-kind">${esc(KIND[x.kind] || '其他')}</span><span>${esc(x.text)}</span></li>`).join('');
  return `<article class="cp-feature cp-activity"><h3>电脑后台今天做的事</h3><p class="cp-big-line">${esc(line)}</p>${yline}`
    + (items ? `<ol class="cp-timeline">${items}</ol>` : `<p class="cp-line">${dot('ok')}今天还没有备份、出错、重启这类事。</p>`)
    + (a.observed_at ? `<p class="cp-time">${esc(when(a.observed_at, ctx.now))} 读到</p>` : '') + `</article>`;
}

// 电脑今天的用电和开机；用电是估算，取自 Grafana 后台实时记录（TimeAudit 项目）
function powerBlock(v, ctx) {
  const p = v.power_today;
  const cell = (val, unit, label) => `<li><b>${val == null ? '—' : esc(val)}<small>${unit}</small></b><span>${label}</span></li>`;
  const kwh = p.energy_kwh == null ? null : Math.round(p.energy_kwh * 10) / 10, up = p.uptime_hours == null ? null : Math.round(p.uptime_hours * 10) / 10;
  const y = p.yesterday;
  const ybits = y ? [Number.isFinite(y.uptime_hours) ? `开机 ${Math.round(y.uptime_hours * 10) / 10} 小时` : '', Number.isFinite(y.energy_kwh) ? `用电约 ${Math.round(y.energy_kwh * 10) / 10} 度` : ''].filter(Boolean) : [];
  const yline = ybits.length && (early(ctx) || kwh == null) ? `<p class="cp-cap cp-yesterday">昨天（${esc(monthDay(y.date))}）${ybits.join('、')}</p>` : '';
  const boot = up ?? v.security.computer.uptime_hours;
  const cells = kwh == null && p.peak_watts == null
    ? `${cell(boot, '小时', up == null ? '这次开机到现在' : '今天开机')}<li class="cp-stat-note"><span>用电和最高功率还没读到，接上后显示在这里</span></li>`
    : `${cell(boot, '小时', '今天开机')}${cell(kwh == null ? null : '约 ' + kwh, '度', '今天用电')}${cell(p.peak_watts, '瓦', '今天最高功率')}`;
  return `<article class="cp-feature cp-power"><h3>电脑今天的用电和开机</h3>`
    + `<ul class="cp-stats3">${cells}</ul>${yline}`
    + `<p class="cp-src">${esc(p.source_note || '估算 · 取自 Grafana 后台实时记录（TimeAudit 项目）')}</p>`
    + (p.observed_at ? `<p class="cp-time">${p.state === 'attention' ? `这次没读到，上面是 ${esc(when(p.observed_at, ctx.now))} 读到的` : `${esc(when(p.observed_at, ctx.now))} 读到`}</p>` : '') + `</article>`;
}

export function todayBlock(v, ctx) {
  const cards = dedupeCards(v.sections.today.filter((c) => c.id !== 'today_changes')).map((c) => card(c, ctx.now)).join('');
  const gaps = v.source_gaps.length ? `<h3 class="cp-sub">这次没读全的来源</h3><ul class="cp-list">${v.source_gaps.map((g) => `<li>${dot('attention')}${esc(g.title)}${g.since ? `<span class="cp-meta">（${esc(when(g.since, ctx.now))} 起）</span>` : ''}</li>`).join('')}</ul>` : '';
  return `<div class="cp-features">${codeCard(v, ctx)}${wordsCard(v, ctx)}${activityBlock(v, ctx)}${powerBlock(v, ctx)}</div>`
    + (cards ? `<div class="cp-grid">${cards}</div>` : '')
    + gaps;
}

// 今天出错数：后端 today_activity.summary.errors = {owner, other} 一份清单，总览和今天的动态都读它；字段缺失时返回 null，按原来的方式显示
export const todayErrors = (v) => { const e = v.today_activity?.summary?.errors; return e && Number.isFinite(e.owner) && Number.isFinite(e.other) ? { owner: e.owner, other: e.other } : null; };
const errorsText = (e) => `本人 ${e.owner}、别的软件 ${e.other}`;
// 总览屏和分区灯由共用脚本 /_overview/overview-screen.js 画（ctx.ov 传进来：构建时 import，浏览器里是 window.OverviewScreen）
const overview = (v, ctx) => {
  if (!ctx.ov) return '';
  const e = todayErrors(v);
  const ov = e && v.overview && Array.isArray(v.overview.signals)
    ? { ...v.overview, signals: v.overview.signals.map((s) => (s?.id === 'today_tasks' ? { ...s, value: e.owner + e.other, detail: errorsText(e) } : s)) }
    : v.overview;
  return ctx.ov.html(ov, { size: 'big', now: ctx.now.getTime() });
};
const LAMPS = { 'need-you': 'need_you', tasks: 'automation', computer: 'computer', backup: 'backup_cloud', projects: 'projects', today: 'today' };
const lampOf = (key) => (v, ctx) => ctx.ov ? ctx.ov.lamp(v.overview?.sections?.[key], ctx.ov.stale(v.overview, ctx.now.getTime())) : '';
// 今天几号（北京时间，跨过零点浏览器里会自动换）
const todayDate = (v, ctx) => new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', month: 'long', day: 'numeric', weekday: 'long' }).format(ctx.now).replace(/(\d+)月(\d+)日/, '$1 月 $2 日 ') + ' · 北京时间 0 点起';
export const REGIONS = { overview, security, 'need-you': needYou, computer, backup, projects, today: todayBlock, 'today-date': todayDate,
  ...Object.fromEntries(Object.entries(LAMPS).map(([id, key]) => ['lamp-' + id, lampOf(key)])) };

// 整页：外框固定，内容由上面各函数填
export function page(v, ctx) {
  const r = (k) => `<div class="cp-body" data-cp="${k}">${REGIONS[k](v, ctx)}</div>`;
  const sec = (id, title, w, h, sub, body) => `<section class="cp-section" id="${id}"><div class="cp-head"><h2><img src="${src(ctx, title[0])}" alt="${title[1]}" width="${w}" height="${h}" loading="eager"></h2><span class="cp-lamp" data-cp="lamp-${id}">${REGIONS['lamp-' + id](v, ctx)}</span>${id === 'today' ? `<span class="cp-date" data-cp="today-date">${todayDate(v, ctx)}</span>` : ''}<p>${sub}</p></div>${body}</section>`;
  return `<section class="cp-section cp-hero" id="top">
  <div class="cp-hero-copy">
    <h1><img src="${src(ctx, 'cockpit-01-title-01.png')}" alt="驾驶舱" width="483" height="198" loading="eager"></h1>
    <p class="cp-lead">这台电脑现在好不好、要我做什么，一页看完。每分钟从电脑读一次，时间都是北京时间；右下角 ↻ 立刻重读。</p>
  </div>
  <img class="cp-hero-art" src="${src(ctx, 'cockpit-01-illustration-01.png')}" alt="" width="866" height="326" loading="eager">
  <div class="cp-overview" data-cp="overview">${overview(v, ctx)}</div>
  <div class="cp-security-wrap"><h2 class="cp-security-title"><img src="${src(ctx, 'cockpit-07-title-01.png')}" alt="安全和授权" width="719" height="180" loading="eager"></h2><div class="cp-security" data-cp="security">${security(v, ctx)}</div></div>
</section>
${sec('need-you', ['cockpit-01-title-02.png', '要我处理的事'], 348, 84, '要你动手的事；做完后 AI 核实，会自己从这里消失。', r('need-you'))}
${sec('tasks', ['cockpit-05-title-01.png', '自动任务'], 588, 192, '电脑自己在做的事，有没有按时做、做成没有。点一条船或清单里的一行，看它在做什么、上次下次什么时候跑、怎么停、停了影响什么。', '<div class="cp-river" data-today-river aria-label="今天的河"></div>')}
${sec('computer', ['cockpit-02-title-01.png', '电脑'], 317, 184, '这台电脑现在累不累、还剩多少地方；人不在电脑前能不能连上它。', r('computer'))}
${sec('today', ['cockpit-09-title-01.png', '今天的动态'], 675, 220, '今天有什么变化：代码、你对 AI 说的话、今天发生的事。', r('today'))}
${sec('backup', ['cockpit-06-title-01.png', '备份和云端'], 716, 199, '东西有没有按时备份、云端的钱够不够。', r('backup'))}
${sec('projects', ['cockpit-08-title-01.png', '项目'], 369, 222, '每个在用的项目现在怎么样、有没有等你的事。点名字进项目页。', r('projects'))}`;
}
