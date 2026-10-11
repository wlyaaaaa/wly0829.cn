// 驾驶舱各块的 HTML。构建时用最近一份快照画出首帧，浏览器拿到新数据后用同一组函数原地换掉每块里面的内容。
// 每块外框（[data-cp] 所在的元素）始终在，数据没到只换字，不出空框、不换版式。
import { hm, dateHm, when, ago, light, splitChecked, dedupeCards, isToday } from './model.js';

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
  const gap = ago(c.observed_at, now).replace(/^刚刚$/, '').replace(/前$/, '');
  const text = c.text ? esc(c.text) + (missing && c.observed_at ? `<span class="cp-stale">（这是 ${esc(when(c.observed_at, now))} 读到的，之后${gap ? ' ' + esc(gap) : ''}没读到新的）</span>` : '') : notRead(c.observed_at, now);
  const time = !missing && c.observed_at ? `<p class="cp-time">${esc(when(c.observed_at, now))} 读到</p>` : '';
  return `<article class="cp-card is-${light(c.state)}"><h3>${dot(c.state)}${esc(c.title)}</h3><p>${text}</p>`
    + (c.criteria_text ? `<p class="cp-criteria">判断标准：${esc(c.criteria_text)}</p>` : '')
    + time + (['red', 'attention'].includes(c.state) ? `<div class="cp-actions">${copyBtn(c.copy_ai_id)}</div>` : '') + `</article>`;
}

// 安全和授权：只显示，点了去授权页对应卡片办理（锚点和 O3 对齐）；数据来源和判定不变，首屏只放这一处
export function security(v, ctx) {
  const s = v.security, pd = s.personal_data.state, un = s.unrestricted.state, win = s.windows.state;
  const off = ctx.offline || !v.ok;
  const rows = [
    ['cockpit-07-icon-01.png', '个人资料', pd === 'unlocked' ? ['已解锁', s.personal_data.expires_at ? '到 ' + dateHm(s.personal_data.expires_at) : '', 'ok'] : pd === 'locked' ? ['锁着', '要用时再解锁', 'gray'] : ['没读到', '', 'gray'], '/computer-access/#personal-data'],
    ['cockpit-07-icon-02.png', '无限制授权', un === 'active' ? ['开着', s.unrestricted.expires_at ? '到 ' + dateHm(s.unrestricted.expires_at) : '', 'attention'] : un === 'inactive' ? ['正常关着', '', 'gray'] : ['没读到', '', 'gray'], '/computer-access/#unrestricted'],
    ['cockpit-07-icon-03.png', 'Windows', win === 'locked' ? ['已锁屏', '', 'ok'] : win === 'unlocked' ? ['未锁屏', '', 'ok'] : ['没读到', '', 'gray'], '/computer-access/#windows'],
    // 这里只说“连不连得上”；电脑好不好看上面“电脑”那一格
    ['', '能不能连上电脑', off ? ['连不上', s.observed_at ? '上次 ' + when(s.observed_at, ctx.now) : '', 'gray'] : ['能', s.computer.uptime_hours != null ? `开机 ${s.computer.uptime_hours} 小时` : '', 'ok'], '/computer-access/'],
  ];
  return rows.map(([icon, label, [word, sub, state], href]) => `<a class="cp-sec-item" href="${href}">`
    + (icon ? `<img src="${src(ctx, icon)}" alt="" width="58" height="35" loading="eager">` : `<span class="cp-sec-pc" aria-hidden="true"></span>`)
    + `<span class="cp-sec-label">${label}</span><span class="cp-sec-word">${dot(state)}${esc(word)}</span><span class="cp-sec-sub">${esc(sub)}</span><span class="cp-sec-go">${href === '/computer-access/' ? '看连接状态 →' : '去授权页办理 →'}</span></a>`).join('');
}

// ---- “要你做的事”怎么读：后端按需问字段（P2）有就用；没有就从现有标题里拆，拆不出就照原句显示 ----
const CIRCLED = /[①②③④⑤⑥⑦⑧⑨]/;
const BJ = (s) => { const m = /(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(s || ''); return m ? Date.parse(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:00+08:00`) : NaN; };
const clean = (t) => String(t || '').replace(/\s*做完点“复制给 AI”说一声。?/g, '').replace(/\s*(最后核对：[^。]*。?|尚未核对。?)/g, '').trim();
export function readTodo(x, now) {
  let t = clean(x.title || x.next_step);
  let path = '';
  t = t.replace(/\s*汇报在电脑上：[^（]*（路径\s*([^）]+)）。?/, (_, p) => { path = p.trim(); return ''; }).replace(/\s*（路径\s*([^）]+)）/, (_, p) => { path ||= p.trim(); return ''; }).trim();
  let minutes = Number.isFinite(x.minutes) ? `约 ${x.minutes} 分钟` : '';
  t = t.replace(/（约\s*(\d+|几)\s*分钟）/, (_, n) => { minutes ||= n === '几' ? '几分钟' : `约 ${n} 分钟`; return ''; });
  let label = '';
  t = t.replace(/^(等你选|等你定|请你定|要你定)[：:]\s*/, (_, l) => { label = l; return ''; });
  let head = typeof x.headline === 'string' && x.headline ? x.headline : '', rest = t;
  if (!head) {
    const m = /^(.{4,46}?)[：；]/.exec(t) || /^(.{4,60}?)。/.exec(t);
    if (m) { head = m[1]; rest = t.slice(m[0].length); } else { head = t; rest = ''; }
  }
  rest = rest.replace(/^[，。；\s]+/, '');
  let steps = Array.isArray(x.steps) ? x.steps.filter((s) => typeof s === 'string' && s) : [];
  let options = Array.isArray(x.options) ? x.options.map((o, i) => (typeof o === 'string' ? { key: String.fromCharCode(65 + i), text: o.replace(/^[A-Z][\s.、：:]+/, '') } : o && typeof o === 'object' ? { key: o.key || String.fromCharCode(65 + i), text: o.text || o.label || '' } : null)).filter((o) => o && o.text) : [];
  if (!steps.length && CIRCLED.test(rest)) {
    const parts = rest.split(CIRCLED);
    rest = parts.shift().replace(/[：:，\s]+$/, '');
    steps = parts.map((p) => p.replace(/^[\s：:]+|[；。，\s]+$/g, '')).filter(Boolean);
    // 最后一条后面常跟着一句总的话（“都推荐……”），拆出来放回正文
    const tail = steps.length ? /^(.*?[。；])\s*([^。；]*(推荐|按|随时)[^]*)$/.exec(steps[steps.length - 1]) : null;
    if (tail) { steps[steps.length - 1] = tail[1].replace(/[；。]$/, ''); rest = (rest ? rest + '。' : '') + tail[2]; }
  }
  // “等你选：甲、乙、丙，请……”：顿号列出的就是选项
  if (!options.length && label === '等你选') {
    const m = /^([^，。]{2,80}?)[，。]\s*(.*)$/.exec(rest);
    if (m && m[1].includes('、')) { options = m[1].split('、').map((s, i) => ({ key: String.fromCharCode(65 + i), text: s.trim() })); rest = m[2]; }
  }
  rest = rest.replace(/[，；\s]+$/g, '');
  // 后端给了一句话标题和步骤或选项，就不再显示从旧标题里拆出来的正文
  if (x.headline && (steps.length || options.length || x.why_you)) rest = '';
  const raw = String(x.title || '') + String(x.next_step || '');
  const where = x.where === 'phone' || x.where === 'pc' ? x.where : /在电脑上|在笔记本|[A-Z]:\\/.test(raw) ? 'pc' : '';
  const dueAt = Date.parse(x.due_at || '') || BJ(x.done_when);
  const dueText = Number.isFinite(dueAt) ? dateHm(new Date(dueAt).toISOString()) : (x.done_when && !/^\s*本人方便时\s*$/.test(x.done_when) ? x.done_when : '');
  const left = Number.isFinite(dueAt) ? dueAt - now.getTime() : NaN;
  const urgent = typeof x.urgent === 'boolean' ? x.urgent : Number.isFinite(left) && left < 864e5;
  return { head: label && !x.headline ? `${label}：${head}` : head, body: rest, steps, options, minutes, path, where, dueText, hasDue: Number.isFinite(dueAt), overdue: left < 0, urgent };
}
const chips = (r) => [r.dueText ? `<span class="cp-chip${r.urgent ? ' is-urgent' : ''}">${r.overdue ? '已过期限 ' + esc(r.dueText) : esc(r.dueText) + (r.hasDue ? ' 前' : '')}</span>` : '',
  r.minutes ? `<span class="cp-chip">${esc(r.minutes)}</span>` : '',
  r.where === 'phone' ? '<span class="cp-chip is-phone">手机能办</span>' : r.where === 'pc' ? '<span class="cp-chip is-pc">要在电脑上办</span>' : ''].join('');
// “你现在 N 件”：件数优先用后端 overview.owner_count / owner_urgent（P1），没有就数“要你做的事”清单
export function ownerNow(v, now) {
  const ov = v.overview || {};
  // 后端给了 ask_kind 时，只把“要你动手 / 要你拍板”算进来；急不急也以后端为准
  const all = v.need_you.map((x) => ({ x, r: readTodo(x, now) }));
  const items = all.some((i) => i.x.ask_kind) ? all.filter((i) => !i.x.ask_kind || ['do', 'decide'].includes(i.x.ask_kind)) : all;
  if (Number.isFinite(ov.owner_urgent)) items.forEach((i) => { i.r.urgent = i.x.urgent === true; });
  const n = Number.isFinite(ov.owner_count) ? ov.owner_count : items.length;
  const urgent = Number.isFinite(ov.owner_urgent) ? ov.owner_urgent : items.filter((i) => i.r.urgent).length;
  return { n, urgent, items, all };
}
const checkedAgo = (v, now) => { const t = Date.parse(v || ''); if (!Number.isFinite(t)) return ''; const h = Math.floor((now.getTime() - t) / 36e5); return h < 1 ? '1 小时内核对过' : h < 48 ? `${h} 小时前核对` : `${Math.floor(h / 24)} 天前核对`; };
// 只把一段话复制到剪贴板，不发任何请求
const copyText = (text, label, cls = '') => `<button type="button" class="cp-btn${cls}" data-copy-text="${esc(text)}">${label}</button>`;
const todoId = (x) => 'todo-' + String(x.id || '').replace(/[^\w-]/g, '');

function askCard(x, r, ctx) {
  const id = x.copy_ai_id || x.id;
  const ref = `（驾驶舱条目 ${id}「${r.head}」）`;
  const facts = [
    x.why_you ? ['为什么要你', x.why_you] : null,
    x.consequence ? ['不办会怎样', x.consequence] : null,
    x.done_when_text ? ['怎么算办完', x.done_when_text] : null,
  ].filter(Boolean);
  const steps = r.steps.length ? `<ol class="cp-steps">${r.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>` : '';
  const opts = r.options.length
    ? `<div class="cp-opts" role="group" aria-label="选一个，点了就复制你的选择">${r.options.map((o) => copyText(`我选 ${o.key}：${o.text}${ref}`, `<b>${esc(o.key)}</b>${esc(o.text)}`, ' cp-opt')).join('')}</div><p class="cp-hint">点一个选项就复制“我选 …”，贴到和 AI 的对话里发出去。</p>`
    : '';
  const meta = [x.at ? '登记于 ' + when(x.at, ctx.now) : '', Number.isFinite(x.asked_count) ? `问过 ${x.asked_count} 次` : '', x.last_checked_at ? checkedAgo(x.last_checked_at, ctx.now) : '还没核对过', x.project ? '项目：' + x.project : ''].filter(Boolean);
  return `<article class="cp-ask${r.urgent ? ' is-urgent' : ''}" id="${esc(todoId(x))}">`
    + `<header class="cp-ask-head"><h3>${dot(r.urgent ? 'red' : 'attention')}<span>${esc(r.head)}</span></h3><span class="cp-chips-row">${chips(r)}</span></header>`
    + (r.body ? `<p class="cp-ask-body">${esc(r.body)}</p>` : '') + steps + opts
    + (facts.length ? `<dl class="cp-facts">${facts.map(([k, val]) => `<div><dt>${k}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl>` : '')
    + `<p class="cp-meta">${meta.map(esc).join(' · ')}</p>`
    + (r.path ? `<p class="cp-path">电脑上的文件：${esc(r.path)}</p>` : '')
    + `<div class="cp-actions">${r.options.length ? '' : copyText(`关于${ref}，我的回答是：`, '复制我的回答')}${copyText(`${ref}这件不做了，请转暂缓或取消，按规矩关闭并记一笔。`, '这件不做了', ' cp-btn-quiet')}${copyBtn(id)}</div></article>`;
}

// 交给 AI 的事：卡住的先列（P2 给 stuck/handler；没给时只认“检查点已过”这一条硬事实），其余收起来
function aiBlock(v, ctx) {
  const now = ctx.now;
  const rows = v.ai_following.map((x) => {
    const title = clean(x.title);
    const bare = !title || title === x.project;
    const cp = /检查点\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})/.exec(x.title || '');
    const cpAt = cp ? BJ(cp[1]) : NaN;
    const passed = Number.isFinite(cpAt) && cpAt < now.getTime();
    const h = x.handler && typeof x.handler === 'object' ? x.handler : null;
    const stuck = x.stuck === true || h?.stuck === true || passed;
    const why = x.stuck_reason || (passed ? `检查点 ${dateHm(new Date(cpAt).toISOString())} 已过 ${Math.max(1, Math.round((now.getTime() - cpAt) / 36e5))} 小时，没收到进度` : '');
    const state = stuck ? 'stuck' : h?.kind === 'running' ? 'running' : h?.kind === 'queued' ? 'queued' : h?.kind === 'none' ? 'none' : 'wait';
    const shown = bare ? `${x.project || '没写项目'}：这条缺一句说明` : passed ? title.replace(/[；;]\s*下一个检查点[^；;]*$/, '') : title;
    return { x, title: shown, why, state, h };
  });
  if (!rows.length) return `<p class="cp-line" id="ai">${dot('ok')}现在没有交给 AI 的事。</p>`;
  const count = (s) => rows.filter((r) => r.state === s).length;
  const parts = [count('stuck') && `卡住 ${count('stuck')}`, count('running') && `在办 ${count('running')}`, count('queued') && `排队 ${count('queued')}`, count('none') && `还没人接 ${count('none')}`, count('wait') && `等 AI 处理 ${count('wait')}`].filter(Boolean);
  const g = v.governance || {};
  const next = g.next_run_at ? `下次每周体检 ${dateHm(g.next_run_at)}${g.consumer_state === 'not_confirmed' ? '，还没确认它会接手这些事' : ''}` : '';
  const line = (r) => `<li class="is-${r.state}"><span>${esc(r.title)}</span><small>${[r.why, r.h?.task ? `由“${r.h.task}”在办` : '', r.h?.next_run_at ? '下次 ' + dateHm(r.h.next_run_at) : '', r.x.last_checked_at ? checkedAgo(r.x.last_checked_at, now) : '还没核对过'].filter(Boolean).map(esc).join(' · ')}</small></li>`;
  const stuck = rows.filter((r) => r.state === 'stuck'), rest = rows.filter((r) => r.state !== 'stuck');
  return `<div class="cp-ai" id="ai"><h3 class="cp-sub">交给 AI 的事：${rows.length} 件<span class="cp-ai-parts">${parts.join(' · ')}</span></h3>`
    + (stuck.length ? `<p class="cp-ai-cap">${dot('attention')}卡住了（超过 AI 自己写的检查点）</p><ul class="cp-ailist is-stuck">${stuck.map(line).join('')}</ul>` : '')
    + aiWork(v, ctx)
    + (rest.length ? `<details class="cp-more" id="ai-rest"><summary>其余 ${rest.length} 件，你不用动手${next ? `（${esc(next)}）` : ''}</summary><ul class="cp-ailist">${rest.map(line).join('')}</ul></details>` : '')
    + `</div>`;
}
// AI 现在在做（ai_work）：在跑的自动任务、留下没合并的分支；后端没给这块就不出
function aiWork(v, ctx) {
  const items = v.ai_work?.items || [];
  if (!items.length) return '';
  const run = items.filter((p) => Number(p.running_automations) > 0), tasks = items.filter((p) => Number(p.running_tasks) > 0);
  const branches = items.filter((p) => Number(p.unmerged_branches) > 0), nb = branches.reduce((n, p) => n + Number(p.unmerged_branches), 0);
  const names = (list, k) => list.map((p) => `${p.project}${Number(p[k]) > 1 ? ` ${p[k]} 个` : ''}`).join('、');
  const bits = [
    tasks.length ? `AI 在干活：${names(tasks, 'running_tasks')}` : items.every((p) => p.running_tasks == null) ? '' : '现在没有 AI 对话在干活',
    run.length ? `在跑的自动任务：${names(run, 'running_automations')}` : '现在没有自动任务在跑',
    nb ? `留下没收尾的分支：${branches.length} 个项目共 ${nb} 个，AI 会合并或清掉` : '',
  ].filter(Boolean);
  return `<div class="cp-aiwork"><b>AI 现在在做</b><ul>${bits.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>${v.ai_work.observed_at ? `<small>${esc(when(v.ai_work.observed_at, ctx.now))} 读到</small>` : ''}</div>`;
}

// 要我处理的事 + 交给 AI 的事 + 等条件到了再做
export function needYou(v, ctx) {
  const { all: items } = ownerNow(v, ctx.now);
  const decide = items.filter((i) => i.x.ask_kind === 'decide'), act = items.filter((i) => i.x.ask_kind !== 'decide');
  const group = (list, title) => (list.length ? (title ? `<h3 class="cp-sub">${title}</h3>` : '') + `<div class="cp-todos">${list.map((i) => askCard(i.x, i.r, ctx)).join('')}</div>` : '');
  const body = items.length
    ? group(act, decide.length ? '要你动手' : '') + group(decide, '要你拍板（规则或做法）')
      + (items.length > 1 ? `<p class="cp-all"><button type="button" class="cp-btn" data-copy-ai-all>全部 ${items.length} 项一起复制给 AI</button></p>` : '')
    : `<p class="cp-empty">${dot(v.ok ? 'ok' : 'unavailable')}${v.ok ? '现在没有要你动手的事。' : notRead(v.served_at, ctx.now)}</p>`;
  // 等条件：分“你有空时可以做”和“AI 等条件”；事在前、什么时候做在后；后端没给是谁的事就合在一起
  const fmt = (x) => `<li><span>${esc(clean(x.title) || x.project)}</span><small>什么时候：${esc(x.done_when || '你方便时')}</small></li>`;
  const mine = v.deferred.filter((x) => x.action_owner === 'user'), theirs = v.deferred.filter((x) => x.action_owner && x.action_owner !== 'user');
  const known = mine.length + theirs.length === v.deferred.length;
  const wait = !v.deferred.length ? '' : known
    ? (mine.length ? `<h3 class="cp-sub">你有空时可以做（${mine.length} 件，不急）</h3><ul class="cp-list cp-wait">${mine.map(fmt).join('')}</ul>` : '')
      + (theirs.length ? `<details class="cp-more" id="ai-wait"><summary>AI 等条件到了再做（${theirs.length} 件，你不用管）</summary><ul class="cp-list cp-wait">${theirs.map(fmt).join('')}</ul></details>` : '')
    : `<h3 class="cp-sub">等条件到了再做（${v.deferred.length} 件）</h3><ul class="cp-list cp-wait">${v.deferred.map(fmt).join('')}</ul>`;
  return anchor('pending') + body + aiBlock(v, ctx) + wait;
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
  const cards = dedupeCards(v.sections.computer).map((c) => (c.id === 'computer_health' ? card(c, ctx.now).replace('</p>', '</p>' + pcReason(v)) : card(c, ctx.now))).join('');
  // 副机（笔记本）在不在线，接在远程连接卡里（remote_network.secondary_laptop；没读到就不写这一行）
  const lap = LAPTOP[v.laptop.state];
  const remote = (dedupeCards(v.sections.remote).map((c) => card(c, ctx.now)).join('') || card({ title: '远程连接', state: 'unavailable', text: '' }, ctx.now)).replace('<article ', '<article id="remote" ')
    .replace(/<\/p>/, (m) => m + (lap ? `<p class="cp-laptop">${dot(lap[1])}笔记本（副机）：${lap[0]}</p>` : ''));
  return `<div class="cp-grid">${cards}${remote}</div><div id="grafana" class="cp-grid cp-charts">${graf}${login}</div>`;
}
const LAPTOP = { online: ['在线', 'ok'], offline: ['离线（要用它时得先开机连网）', 'attention'] };

// 电脑有预警时说清原因：哪一项涨得最多、现在多少；“AI 核对、你不用关软件”是后端 pc-health 待办的原话。
// 再列出之前定过、和电脑卡有关的暂缓办法（你有空时）。原因字段没到就什么都不加。
const PC_METRIC = { nonpaged_pool_bytes: '非分页池（系统内核自己占的内存）', paged_pool_bytes: '分页池（系统内核占的内存）', committed_bytes: '已提交内存', handle_count: '句柄数' };
const gb = (b) => `${Math.round(b / 2 ** 30 * 10) / 10} GB`;
function pcReason(v) {
  const h = v.pc_health;
  if (!['warn', 'error'].includes(h.state)) return '';
  const m = h.metrics || {}, d = h.changes_24h || {};
  const top = Object.keys(PC_METRIC).filter((k) => Number.isFinite(m[k]) && d[k] > 0 && m[k] > d[k]).sort((a, b) => d[b] / (m[b] - d[b]) - d[a] / (m[a] - d[a]))[0];
  const what = String(h.reason_code || '').startsWith('resource_growth') ? '系统资源一直在涨' : '系统资源超过了警戒线';
  const fmt = (k, n) => (k === 'handle_count' ? `${Math.round(n / 1e4) / 10} 万个` : gb(n));
  const detail = top ? `：${PC_METRIC[top]}现在 ${fmt(top, m[top])}，24 小时涨了 ${fmt(top, d[top])}` : '';
  const plan = v.deferred.filter((x) => /卡住|卡死|超频|BIOS/.test(x.title || '')).map((x) => splitChecked(x.title).title);
  return `<p class="cp-reason">原因：${what}${esc(detail)}。卡顿原因还没查明，由 AI 按现有办法核对，你不用自己关软件。</p>`
    + (plan.length ? `<p class="cp-plan">之前定过的办法（你有空时）：${plan.map(esc).join('；')}</p>` : '');
}

export function backup(v, ctx) {
  const cards = dedupeCards(v.sections.backup_cloud).map((c) => card(c.id === 'drive_upload' ? { ...c, text: knownFirst(c.text) } : c, ctx.now)).join('');
  return anchor('backups') + `<div class="cp-grid">${cards || card({ title: '备份', state: 'unavailable', text: '' }, ctx.now)}</div>`;
}

// 先说读到了什么，再说哪点还不知道：句子以“……还不知道。”开头时挪到最后（Google Drive 上传卡）
const knownFirst = (t) => { const m = /^([^。：]*：)?([^。]*不知道)。(.+)$/.exec(t || ''); return m ? `${m[1] || ''}${m[3]}${m[2]}。` : t; };

// 项目：在用的每个一张小卡；冻结的只列名字
// 其他页面“看驾驶舱”的链接落点：/cockpit/#<项目名>，项目名取项目页地址里的那一段；旧链接里的别名也认
const slugOf = (url) => (/^\/projects\/([^/]+)\/$/.exec(url || '') || [])[1] || '';
const ALIAS = { 'github-index': ['github-local-index'] };
const idsOf = (slug) => (slug ? [slug, ...(ALIAS[slug] || [])] : []);
export function projects(v, ctx) {
  const items = v.projects.items;
  if (!items.length) return `<div class="cp-anchors">${[...new Set(Object.values(ctx.projectUrls || {}).map(slugOf).flatMap(idsOf))].filter(Boolean).map(anchor).join('')}</div><p class="cp-empty">${dot('unavailable')}${notRead(v.projects.observed_at, ctx.now)}</p>`;
  const live = items.filter((p) => p.mode !== 'frozen_static'), frozen = items.filter((p) => p.mode === 'frozen_static');
  // 红只给“等你动手”的（契约：本人必须动手才红）；任务没跑成、AI 还要查的是黄
  const stateOf = (p) => (p.waiting_user > 0 ? 'red' : ['ok', 'not_applicable'].includes(p.run_health) && p.overview === 'ok' ? 'ok' : ['error', 'failed', 'red', 'warn', 'attention'].includes(p.run_health) || ['error', 'red', 'run_failed', 'warn', 'attention'].includes(p.overview) ? 'attention' : ['ok', 'not_applicable'].includes(p.run_health) || p.overview === 'ok' ? 'ok' : 'unavailable');
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
// 一天里很多次“验收核对了 1 项，通过 0 项”合成一行，放在最后一次的位置；出错、重启、卡住这些照原样一条一条列
function mergeAcceptance(list) {
  const acc = list.filter((x) => x.kind === 'acceptance');
  if (acc.length < 2) return list;
  const nums = acc.map((x) => /(\d+)\s*项.*?通过\s*(\d+)\s*项/.exec(x.text || ''));
  const sum = (i) => nums.reduce((n, m) => n + Number(m[i]), 0);
  const tail = nums.every(Boolean) ? `，一共核对 ${sum(1)} 项次、${sum(2)} 项通过（通过的会关掉，其余 AI 接着跟）` : '';
  const last = acc[acc.length - 1];
  const one = { ...last, text: `AI 今天核对登记事项 ${acc.length} 次${tail}（${hm(acc[0].at)} 起）`, level: acc.some((x) => x.level === 'act') ? 'act' : acc.some((x) => x.level === 'watch') ? 'watch' : last.level };
  return list.filter((x) => x.kind !== 'acceptance' || x === last).map((x) => (x === last ? one : x));
}
function activityBlock(v, ctx) {
  let a = v.today_activity, s = a.summary;
  if (!a.timeline.length && !Number.isFinite(s.tasks_run)) {
    const ran = v.automation.items.filter((t) => t.enabled !== false && isToday(t.last_run_at, ctx.now));
    s = { tasks_run: v.automation.items.length ? ran.length : null, tasks_failed: v.automation.items.length ? ran.filter((t) => t.state === 'failed').length : null };
    a = { ...a, observed_at: v.automation.observed_at || a.observed_at, timeline: v.today.items.map((x) => ({ at: x.at, kind: EVENT_KIND[x.type] || '', text: (EVENT[x.type] || (() => '电脑上记了一件事'))(x), level: x.type === 'freeze_captured' ? 'watch' : 'ok' })) };
  }
  const num = (x) => (Number.isFinite(x) ? x : '—');
  const errs = todayErrors(v);
  const line = `今天跑了 ${num(s.tasks_run)} 个任务、${errs ? `${errs.owner + errs.other} 个出过错${errs.owner + errs.other ? `（你的任务 ${errs.owner} 个、别的软件自带的 ${errs.other} 个）` : ''}` :`${num(s.tasks_failed)} 个出错`}${Number.isFinite(s.backups_done) ? `，完成 ${s.backups_done} 项备份` : ''}${Number.isFinite(s.images_done) && s.images_done ? `、${s.images_done} 次系统镜像` : ''}`;
  const y = a.yesterday;
  const yline = y && Number.isFinite(y.tasks_run) && (early(ctx) || a.timeline.length < 3) ? `<p class="cp-cap cp-yesterday">昨天（${esc(monthDay(y.date))}）共跑了 ${num(y.tasks_run)} 个任务、${num(y.tasks_failed)} 个出错，完成 ${num(y.backups_done)} 项备份</p>` : '';
  // 今天出过错的任务点名（和自动任务清单“今天出过错的”同一份 today_activity.errors）
  const names = a.errors.length ? `<p class="cp-cap cp-errnames">出过错的：${a.errors.map((e) => `${esc(e.name || '没写名字的任务')}（${esc(hm(e.at))}${e.owner === 'other' ? '，别的软件自带' : ''}）`).join('、')}；后来恢复没有，看上面自动任务清单里的“今天出过错的”。</p>` : '';
  const items = mergeAcceptance(a.timeline).map((x) => `<li class="is-${light(x.level === 'act' ? 'red' : x.level === 'watch' ? 'attention' : x.level === 'ok' ? 'ok' : 'unavailable')}"><time>${esc(hm(x.at))}</time><i class="cp-tl-dot" aria-hidden="true"></i><span class="cp-tl-kind">${esc(KIND[x.kind] || '其他')}</span><span>${esc(x.text)}</span></li>`).join('');
  return `<article class="cp-feature cp-activity"><h3>电脑后台今天做的事</h3><p class="cp-big-line">${esc(line)}</p>${names}${yline}`
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
// 首屏三行（场景 1）：① 你现在 N 件事（急/不急）② 电脑 / 自动任务 / 备份 各写状态和谁在办 ③ 电脑健康分小字 + 为什么
// 分数、各格的灯都由后端 overview 给（O6），这里只挑字、不算分；overview 过期时三格灰掉并写上次时间
const sigOf = (ov, id) => (Array.isArray(ov?.signals) ? ov.signals.find((s) => s?.id === id) : null) || {};
const LV = { ok: 'ok', watch: 'attention', act: 'red' };
const whyOf = (ov, sec) => (Array.isArray(ov?.reasons) ? ov.reasons.filter((r) => r?.section === sec).map((r) => r.text).filter(Boolean) : []);
function tri(v, ctx, off) {
  const ov = v.overview;
  const cell = (id, label, level, status, who, why) => {
    const st = off ? 'unavailable' : LV[level] || 'unavailable';
    return `<li class="cp-tri-cell is-${light(st)}" data-signal="${id}"><a href="#${id === 'tasks' ? 'tasks' : id === 'backup' ? 'backups' : 'computer'}">`
      + `<span class="cp-tri-label">${label}</span><b class="cp-tri-status">${dot(st)}${esc(off ? '读不到' : status)}</b>`
      + `<span class="cp-tri-who">${off ? esc(ov?.as_of ? `上次 ${hm(ov.as_of)} 读到` : '还没读到') : who.split(' · ').map((w) => `<span>${esc(w)}</span>`).join('<i aria-hidden="true"> · </i>')}</span>`
      + (why && !off ? `<span class="cp-tri-why">${esc(why)}</span>` : '') + `</a></li>`;
  };
  const handled = (s, fallback) => (s?.handler_text ? s.handler_text : fallback);
  // 电脑
  const pc = sigOf(ov, 'computer'), pcWhy = whyOf(ov, 'computer');
  const pcCard = (v.sections.computer.find((c) => c.id === 'computer_health') || {}).text || '';
  const pcStatus = pc.level === 'ok' ? '正常' : pc.level === 'act' || pc.level === 'watch' ? (pcWhy.some((t) => /资源/.test(t)) || !pcWhy.length ? '资源有预警' : pcWhy[0]) : '读不到';
  const pcWho = pc.level === 'ok' ? '你不用管' : handled(pc, '不用你动手 · 交给 AI 盯着');
  // 自动任务：今天出错数和“今天的动态”同一份（today_activity.summary.errors）
  const tk = sigOf(ov, 'today_tasks'), errs = todayErrors(v), sum = v.today_activity?.summary || {};
  const nErr = errs ? errs.owner + errs.other : Number.isFinite(tk.value) ? tk.value : null;
  const repeat = v.automation.items.filter((t) => Number(t.failures_7d) >= 5).sort((a, b) => b.failures_7d - a.failures_7d);
  const tkStatus = nErr == null ? (tk.word || '读不到') : nErr === 0 ? (repeat.length ? '今天正常，这周反复出错' : '今天都正常') : `今天出错 ${nErr} 个`;
  const tkWhy = [Number.isFinite(sum.tasks_run) ? `今天跑了 ${sum.tasks_run} 个${errs ? `，出错 ${nErr} 个（${errorsText(errs)}）` : ''}` : '', repeat.length ? `这周反复出错：${repeat.slice(0, 2).map((t) => `${t.name} ${t.failures_7d} 次`).join('、')}` : ''].filter(Boolean).join('；');
  const tkWho = nErr ? handled(tk, '不用你动手 · 交给 AI') : '电脑自己按时跑';
  // 备份
  const bk = sigOf(ov, 'backup'), bkWhy = whyOf(ov, 'backup_cloud');
  const bkStatus = bk.level === 'ok' ? '都按时备份了' : bkWhy[0] || (Number.isFinite(bk.value) && bk.value ? `${bk.value} 项要留意` : bk.word || '读不到');
  const bkWho = bk.level === 'ok' ? '你不用管' : handled(bk, '不用你动手 · 交给 AI');
  const bkMore = bkWhy.length > 1 ? `另有 ${bkWhy.length - 1} 项：${bkWhy.slice(1).join('、')}` : Number.isFinite(bk.value) && bk.level !== 'ok' ? `共 ${bk.value} 项不正常` : '';
  return `<ul class="cp-tri">`
    + cell('computer', '电脑', pc.level, pcStatus, pcWho, pcCard.replace(/^电脑读数：/, '现在 '))
    + cell('tasks', '自动任务', tk.level, tkStatus, tkWho, tkWhy)
    + cell('backup', '备份', bk.level, bkStatus, bkWho, bkMore)
    + `</ul>`;
}
// 扣分按“你的 / AI 的 / 电脑和任务的”分组；规则原样列出
const GROUP = { need_you: '你的事', ai_following: '交给 AI 的事' };
function score(v, ctx, off) {
  const ov = v.overview;
  const at = ov?.as_of ? hm(ov.as_of) : '';
  if (off || !Number.isFinite(ov?.score)) return `<p class="cp-score is-off">电脑健康分：读不到${at ? `（上次 ${at}）` : ''}</p>`;
  const reasons = Array.isArray(ov.reasons) ? ov.reasons : [];
  const groups = {};
  for (const r of reasons) (groups[GROUP[r.section] || '电脑和自动任务'] ||= []).push(r);
  const line = (r) => `<li>${esc(r.text)}${Number.isFinite(r.delta) && r.delta ? ` <b>${r.delta > 0 ? '+' : '−'}${Math.abs(r.delta)}</b>` : ''}</li>`;
  const rules = Array.isArray(ov.rules) ? ov.rules.map((r) => (typeof r === 'string' ? { text: r } : r)) : [];
  return `<details class="cp-score" id="score"><summary><span>电脑健康 <b>${Math.round(ov.score)}</b>/100</span><span>${at} 读到</span><span class="cp-score-why">为什么是 ${Math.round(ov.score)} 分</span></summary>`
    + `<div class="cp-score-body">${reasons.length ? Object.entries(groups).map(([k, list]) => `<div><h4>${k}</h4><ul>${list.map(line).join('')}</ul></div>`).join('') : '<p>没有扣分的地方。</p>'}`
    + (rules.length ? `<div class="cp-score-rules"><h4>分数怎么算</h4><ul>${rules.map((r) => `<li>${esc(r.text)}</li>`).join('')}</ul></div>` : '')
    + `<p class="cp-score-note">这个分数主要看电脑和 AI 的活，不等于你要做几件事；你要做的看上面第一行。</p></div></details>`;
}
const overview = (v, ctx) => {
  if (!ctx.ov) return '';
  const off = ctx.ov.stale(v.overview, ctx.now.getTime());
  const { n, urgent, items } = ownerNow(v, ctx.now);
  const read = v.ok && !ctx.offline;
  const tag = !n ? '' : urgent ? `<span class="cp-you-tag is-urgent">${urgent === n ? (n === 1 ? '急' : '都急') : `${urgent} 件急`}</span>` : '<span class="cp-you-tag">都不急</span>';
  const list = items.slice(0, 3).map(({ x, r }) => `<li><a href="#${esc(todoId(x))}">${dot(r.urgent ? 'red' : 'attention')}<span class="cp-you-title">${esc(r.head)}</span><span class="cp-you-chips">${chips(r)}</span></a></li>`).join('');
  const you = !read && !v.need_you.length
    ? `<div class="cp-you is-off"><p class="cp-you-k">你现在</p><p class="cp-you-n">要你做的事还没读到</p><p class="cp-you-sub">${notRead(v.served_at, ctx.now)}</p></div>`
    : !n
      ? `<div class="cp-you is-none"><p class="cp-you-k">你现在</p><p class="cp-you-n">${dot('ok')}没有要你做的事</p><p class="cp-you-sub">下面三格是电脑自己的情况。</p></div>`
      : `<div class="cp-you${urgent ? ' is-urgent' : ''}"><p class="cp-you-k">你现在</p><p class="cp-you-n"><b>${n}</b> 件事${tag}</p>`
        + `<ol class="cp-you-list">${list}</ol>`
        + `<p class="cp-you-sub">${items.length > 3 ? `还有 ${items.length - 3} 件 · ` : ''}<a href="#need-you">去处理 ↓</a>${!read && v.served_at ? ` · 这是 ${esc(when(v.served_at, ctx.now))} 读到的` : ''}</p></div>`;
  return you + tri(v, ctx, off) + score(v, ctx, off);
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
    <h1><img src="${src(ctx, 'cockpit-01-title-01.png')}" alt="驾驶舱" width="483" height="198" loading="eager"><span class="cp-h1-text" aria-hidden="true">驾驶舱</span></h1>
    <p class="cp-lead">先看你现在要做几件事，再看电脑、自动任务、备份谁在办。每分钟从电脑读一次，时间都是北京时间；右下角 ↻ 立刻重读。</p>
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
