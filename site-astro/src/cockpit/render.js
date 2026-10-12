// 驾驶舱各块的 HTML。构建时用最近一份快照画出首帧，浏览器拿到新数据后用同一组函数原地换掉每块里面的内容。
// 每块外框（[data-cp] 所在的元素）始终在，数据没到只换字，不出空框、不换版式。
import { hm, dateHm, when, ago, light, dedupeCards, isToday, govState } from './model.js';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// 图片地址由页面传入（构建时 Vite 给的带指纹地址）；没传时按素材原名
const src = (ctx, name) => ctx?.img?.[name] || '/assets/cockpit/' + name;
const anchor = (id) => `<span class="cp-anchor" id="${esc(id)}"></span>`;
const dot = (state) => `<span class="cp-dot is-${light(state)}" aria-hidden="true"></span>`;
const notRead = (at, now) => `还没读到${at ? `（上次 ${esc(when(at, now))}）` : ''}`;
const copyBtn = (id, label = '交给 AI 处理') => (id ? `<button type="button" class="cp-btn" data-copy-ai="${esc(id)}">${label}</button>` : '');

// 卡片颜色只看“要不要你出手”：后端给了 owner_action（do / know / none）或 owner_action_needed 就按它；
// 没给时以卡片自己的文字结论为准——写着交给 AI、AI 在管的，用中性色，不用黄红吓人；
// 写着数据源（文件、记录）多少天没更新的，是数据停了，不是出了事，用灰色。
const AI_HANDLES = /交给\s*AI|AI\s*(在管|在查|在修|在核对|在处理|盯着|会核对|会处理)|不用你(动手|管)/;
const SOURCE_STOPPED = /(文件|记录|数据|进度)[^。]*?(超过\s*\d+\s*天|\d+\s*天以上)没(有)?更新/;
// 后端 10 月 12 日起给每张卡、每个信号一个显示颜色 color（ok / neutral / unavailable / yellow / red），只按要不要你出手定；有就以它为准
export const COLOR_STATE = { ok: 'ok', neutral: 'neutral', unavailable: 'unavailable', yellow: 'attention', red: 'red' };
export function cardState(c) {
  if (COLOR_STATE[c.color]) return c.color === 'unavailable' && !['unavailable', 'reading'].includes(c.state) ? 'stale' : COLOR_STATE[c.color];
  if (!['red', 'attention'].includes(c.state)) return c.state;
  const oa = c.owner_action, need = c.owner_action_needed;
  if (oa === 'do' || need === true) return c.state;
  if (oa === 'know') return 'attention';
  if (oa === 'none' || need === false) return c.stuck === true ? 'attention' : 'neutral';
  if (SOURCE_STOPPED.test(c.text || '')) return 'stale';
  return AI_HANDLES.test(c.text || '') ? 'neutral' : c.state;
}
// 一张事实卡：标题、一句话、判断标准、读到的时间；没读到时写清上次读到是几点。
// off = 这会儿整个读不到电脑：卡片变淡、灯灰，写“读不到（最后 HH:MM 读到）”，不再亮着上次的绿灯
export function card(c, now, off = false) {
  const missing = c.state === 'unavailable' || c.state === 'reading';
  const gap = ago(c.observed_at, now).replace(/^刚刚$/, '').replace(/前$/, '');
  const state = off ? 'unavailable' : cardState(c);
  const text = c.text ? esc(c.text) + (missing && c.observed_at ? `<span class="cp-stale">（这是 ${esc(when(c.observed_at, now))} 读到的，之后${gap ? ' ' + esc(gap) : ''}没读到新的）</span>` : '') : notRead(c.observed_at, now);
  const time = off ? (missing ? '' : `<p class="cp-time cp-off-note">读不到${c.observed_at ? `（最后 ${esc(when(c.observed_at, now))} 读到）` : ''}</p>`)
    : state === 'stale' ? `<p class="cp-time">数据源停了，上面是最后一次记录，不是你的事${c.observed_at ? ` · ${esc(when(c.observed_at, now))} 读到` : ''}</p>`
    : !missing && c.observed_at ? `<p class="cp-time">${state === 'neutral' ? esc(typeof c.ai_handling === 'string' && c.ai_handling ? c.ai_handling.replace(/[。\s]+$/, '') : 'AI 在管，不用你动手') + ' · ' : ''}${esc(when(c.observed_at, now))} 读到</p>` : '';
  // 后端给出“具体是哪条线触发的”（trigger_items：单个程序 1 小时上传超过 2GB，或近 1 小时合计超过登记线）就写出来；
  // 卡片正文已经写了程序名的不重复；没给就不猜
  const LINE = { program_hour_upload: (t) => `${t.name || '某个程序'} 1 小时上传 ${Number(t.value_gb).toFixed(1)}GB，超过 ${t.threshold_gb}GB`, proxy_hour_total: (t) => `近 1 小时合计 ${Number(t.value_gb).toFixed(1)}GB，超过 ${t.threshold_gb}GB` };
  const items = Array.isArray(c.trigger_items) ? c.trigger_items.filter((t) => t && LINE[t.reason] && Number.isFinite(Number(t.value_gb))) : [];
  const lines = items.filter((t) => !(c.text || '').includes(Number(t.value_gb).toFixed(1))).map((t) => LINE[t.reason](t));
  const trig = off ? '' : lines.length ? `<p class="cp-reason">触发的是：${esc(lines.join('；'))}</p>` : typeof c.trigger_text === 'string' && c.trigger_text ? `<p class="cp-reason">触发的是：${esc(c.trigger_text)}</p>` : '';
  return `<article class="cp-card is-${light(state)}${off ? ' is-off' : ''}"><h3>${dot(state)}${esc(c.title)}</h3><p>${text}</p>` + trig
    + (c.criteria_text ? `<p class="cp-criteria">判断标准：${esc(c.criteria_text)}</p>` : '')
    + time + (!off && ['red', 'attention'].includes(state) ? `<div class="cp-actions">${copyBtn(c.copy_ai_id)}</div>` : '') + `</article>`;
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
  // 手机上四项压成一行（电脑宽度照旧四格）
  const words = [pd === 'unlocked' ? `资料已解锁${s.personal_data.expires_at ? '到 ' + dateHm(s.personal_data.expires_at) : ''}` : pd === 'locked' ? '资料锁着' : '资料没读到',
    un === 'active' ? `无限制授权开着${s.unrestricted.expires_at ? '到 ' + dateHm(s.unrestricted.expires_at) : ''}` : un === 'inactive' ? '无限制授权关' : '无限制授权没读到',
    win === 'locked' ? '已锁屏' : win === 'unlocked' ? '未锁屏' : '锁屏没读到',
    off ? `连不上电脑${s.observed_at ? '（最后 ' + when(s.observed_at, ctx.now) + '）' : ''}` : '能连上'];
  const line = `<a class="cp-sec-line" href="/computer-access/">${dot(off ? 'unavailable' : un === 'active' ? 'attention' : 'ok')}<span>${words.map(esc).join(' · ')}</span><b aria-hidden="true">▸</b></a>`;
  return line + rows.map(([icon, label, [word, sub, state], href]) => `<a class="cp-sec-item" href="${href}">`
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
    // 冒号后面只是一小句（如“十月旅游去哪：北京、九寨沟还是武汉”），整句就是标题，不在冒号处截断
    const tail = m && m[0].endsWith('：') ? t.slice(m[0].length) : '';
    if (m && tail && t.length <= 60 && !/[。；！？]|[①-⑳]/.test(tail.replace(/[。\s]+$/, ''))) { head = t.replace(/[。\s]+$/, ''); rest = ''; }
    else if (m) { head = m[1]; rest = t.slice(m[0].length); } else { head = t; rest = ''; }
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
  // 标题之外的下一步（next_step）不能被短标题遮掉：有步骤就接在步骤后面，没有步骤就作为正文
  const next = x.title && x.next_step ? clean(x.next_step).replace(/\s*汇报在电脑上：[^（]*（路径\s*[^）]+）。?/, '').replace(/[。；\s]+$/, '') : '';
  // 下一步和大标题说的是同一件事（一个包含另一个，或冒号、间隔号前的开头一样，如“十月旅游去哪 · 三方盲测对照”和“十月旅游去哪：北京、九寨沟还是武汉”）时，不再当成多出来的一步
  const topic = (a) => String(a || '').split(/\s*[：:·・｜|]\s*/)[0].trim();
  const sameTopic = (a, b) => !!a && !!b && (a.includes(b) || b.includes(a) || (topic(a).length >= 2 && topic(a) === topic(b)));
  if (next && next !== head && ![head, t, clean(x.title)].some((h) => sameTopic(h, next)) && !steps.some((s) => s.includes(next) || next.includes(s)) && !rest.includes(next)) {
    if (steps.length) steps = [...steps, next]; else rest = rest ? `${rest}。${next}` : next;
  }
  // 后端给了一句话标题和步骤或选项，就不再显示从旧标题里拆出来的正文
  if (x.headline && (steps.length || options.length || x.why_you)) rest = '';
  const raw = String(x.title || '') + String(x.next_step || '');
  const where = x.where === 'phone' || x.where === 'pc' ? x.where : /在电脑上|在笔记本|[A-Z]:\\/.test(raw) ? 'pc' : '';
  const dueAt = Date.parse(x.due_at || '') || BJ(x.done_when);
  const dueText = Number.isFinite(dueAt) ? dateHm(new Date(dueAt).toISOString()) : '';
  // done_when 不是日期时是“怎么算办完”的人话，原样放进卡片的一行信息里；只是“本人方便时”就不写
  const doneText = !Number.isFinite(BJ(x.done_when)) && x.done_when && !/^\s*本人方便时\s*$/.test(x.done_when) && !/^\s*AI\s*核实登记的完成条件已满足后关闭本条。?\s*$/.test(x.done_when) ? String(x.done_when).trim().replace(/[。\s]+$/, '') : '';
  const left = Number.isFinite(dueAt) ? dueAt - now.getTime() : NaN;
  const urgent = typeof x.urgent === 'boolean' ? x.urgent : Number.isFinite(left) && left < 864e5;
  // 卡片红不红：后端给了 color 就按它（本人待办用黄色“要你处理”，红色只给确有失败又有期限的）；没给按期限急不急
  const red = x.color ? x.color === 'red' : urgent;
  return { head: label && !x.headline ? `${label}：${head}` : head, body: rest, steps, options, minutes, path, where, dueText, doneText, hasDue: Number.isFinite(dueAt), overdue: left < 0, urgent, red };
}
const chips = (r) => [r.dueText ? `<span class="cp-chip${r.urgent ? ' is-urgent' : ''}">${r.overdue ? '已过期限 ' + esc(r.dueText) : esc(r.dueText) + (r.hasDue ? ' 前' : '')}</span>` : '',
  r.minutes ? `<span class="cp-chip">${esc(r.minutes)}</span>` : '',
  r.where === 'phone' ? '<span class="cp-chip is-phone">手机能办</span>' : r.where === 'pc' ? '<span class="cp-chip is-pc">要在电脑上办</span>' : ''].join('');
// “你现在 N 件”：件数优先用后端 overview.owner_count / owner_urgent（P1），没有就数“要你做的事”清单
export function ownerNow(v, now) {
  const ov = v.overview || {};
  // 后端给了 ask_kind 时，不把明确写着“AI 的事”的算进来；急不急也以后端为准。
  // （以前只认 do / decide，后端实际给的是 decision，首屏标题因此一条都没列出来）
  const all = v.need_you.map((x) => ({ x, r: readTodo(x, now) }));
  const items = all.filter((i) => !['ai', 'know'].includes(i.x.ask_kind));
  if (Number.isFinite(ov.owner_urgent)) items.forEach((i) => { i.r.urgent = i.x.urgent === true; });
  const n = Number.isFinite(ov.owner_count) ? ov.owner_count : items.length;
  const urgent = Number.isFinite(ov.owner_urgent) ? ov.owner_urgent : items.filter((i) => i.r.urgent).length;
  return { n, urgent, items, all };
}
const checkedAgo = (v, now) => { const t = Date.parse(v || ''); if (!Number.isFinite(t)) return ''; const h = Math.floor((now.getTime() - t) / 36e5); return h < 1 ? '1 小时内核对过' : h < 48 ? `${h} 小时前核对` : `${Math.floor(h / 24)} 天前核对`; };
// 只把一段话复制到剪贴板，不发任何请求
const copyText = (text, label, cls = '') => `<button type="button" class="cp-btn${cls}" data-copy-text="${esc(text)}">${label}</button>`;
const todoId = (x) => 'todo-' + String(x.id || '').replace(/[^\w-]/g, '');

// 卡片上的题：后端 questions（[{id, text, options, note}]）；旧条目只有一组 options 时当成一道题
const questionsOf = (x, r) => {
  const qs = Array.isArray(x.questions) ? x.questions.map((q, i) => (q && typeof q === 'object' ? {
    id: String(q.id || 'q' + (i + 1)), text: String(q.text || ''), note: q.note === true,
    options: (Array.isArray(q.options) ? q.options : []).map((o) => (typeof o === 'string' ? o : o && (o.text || o.label)) || '').filter(Boolean),
  } : null)).filter((q) => q && q.options.length) : [];
  return qs.length ? qs : r.options.length ? [{ id: 'q1', text: '', note: false, options: r.options.map((o) => o.text) }] : [];
};
const ACTION_KINDS = ['action', 'cooperate', 'do'];
const DECIDE = ['decide', 'decision', 'choose'];
const isBlank = (s) => !s || /^\s*(待补|待补充|暂无|无)(说明)?[。\s]*$/.test(String(s));
export const PICK_FIRST = '先在上面选一项，才能复制答复';
export const COPY_HINT = '按钮只复制一句话，贴到任意 AI 对话发送即可';
function askCard(x, r, ctx) {
  const id = x.copy_ai_id || x.id;
  const ref = `（驾驶舱条目 ${id}）`, name = `「${r.head}」`;
  const qs = questionsOf(x, r);
  const doList = r.steps.length ? `<ol class="cp-steps">${r.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>` : r.body ? `<p class="cp-ask-body">${esc(r.body)}</p>` : '';
  const quiz = qs.length ? `<div class="cp-quiz">${qs.map((q, i) => `<fieldset class="cp-q" data-q="${esc(q.id)}" data-qn="${i + 1}" data-qtext="${esc(q.text)}">`
      + `<legend>${qs.length > 1 || q.text ? `<b>第 ${i + 1} 题</b>${esc(q.text)}` : '选一个'}</legend>`
      + `<div class="cp-opts">${q.options.map((o) => `<button type="button" class="cp-btn cp-opt" data-opt="${esc(o)}" aria-pressed="false">${esc(o)}</button>`).join('')}</div>`
      + (q.note ? `<input class="cp-note" type="text" data-note placeholder="想补一句可以写在这里（可不写）" aria-label="第 ${i + 1} 题补充说明">` : '')
      + `</fieldset>`).join('')}</div>` : '';
  const due = r.dueText ? `<span class="${r.urgent ? 'is-urgent' : ''}">${r.overdue ? '已过期限 ' + esc(r.dueText) : esc(r.dueText) + (r.hasDue ? ' 前办' : '')}</span>` : '';
  const where = r.where === 'phone' ? '手机上就能办' : r.where === 'pc' ? '在电脑上办' : '';
  const info = [due, [where, r.minutes].filter(Boolean).map(esc).join('，'), r.doneText ? '办完后：' + esc(r.doneText) : ''].filter(Boolean);
  const facts = [['为什么要你', x.why_you], ['不做会怎样', x.consequence]].filter(([, val]) => !isBlank(val));
  const meta = [x.at ? '登记于 ' + when(x.at, ctx.now) : '', Number.isFinite(x.asked_count) ? `问过你 ${x.asked_count} 次` : '', x.last_checked_at ? `最后核对 ${when(x.last_checked_at, ctx.now)}` : '', x.project ? '项目：' + x.project : ''].filter(Boolean);
  const main = qs.length
    ? `<button type="button" class="cp-btn cp-btn-main" data-copy-answer data-ref="${esc(ref)}" data-name="${esc(name)}" aria-describedby="${esc(todoId(x))}-hint" data-disabled-reason="${PICK_FIRST}" disabled>复制我的答复</button>`
    : ACTION_KINDS.includes(x.ask_kind) ? copyText(`${ref}${name}我已经做完了，请核实后关掉这条`, '我做完了', ' cp-btn-main') : '';
  return `<article class="cp-ask${r.red ? ' is-urgent' : ''}" id="${esc(todoId(x))}">`
    + `<h3 class="cp-ask-title">${dot(r.red ? 'red' : 'attention')}<span>${esc(r.head)}</span></h3>`
    + (typeof x.report_title === 'string' && x.report_title && x.report_title !== r.head ? `<p class="cp-report-title">汇报页：${esc(x.report_title)}</p>` : '')
    + (doList ? `<div class="cp-ask-do"><p class="cp-ask-k">要做什么</p>${doList}</div>` : '') + quiz
    + (info.length ? `<p class="cp-ask-info">${info.join('<i aria-hidden="true"> · </i>')}</p>` : '')
    + (facts.length ? `<dl class="cp-facts">${facts.map(([k, val]) => `<div><dt>${k}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl>` : '')
    + (r.path ? `<p class="cp-path">电脑上的文件：${esc(r.path)}</p>` : '')
    + `<div class="cp-actions">${main}${copyText(`${ref}${name}这件不做了，请核对后移出要做的事并记下结果`, '不做了', ' cp-btn-quiet')}`
    + `${copyText(`${ref}${name}这条请你处理：读驾驶舱状态里这条的详情，用一两句话告诉我要做什么；能由 AI 直接办的就直接办掉并核实关掉`, '问 AI', ' cp-btn-quiet')}</div>`
    + `<p class="cp-hint" id="${esc(todoId(x))}-hint">${qs.length ? PICK_FIRST : COPY_HINT}</p>`
    + (meta.length ? `<p class="cp-meta">${meta.map(esc).join(' · ')}</p>` : '') + `</article>`;
}

// 后端偶尔给的是内部代号（如 checkpoint_overdue）：认得的换成人话，认不得的不显示
const STUCK_CODES = { checkpoint_overdue: '已超过约定的检查时间，还没收到进展', no_progress_7d: '已超过 7 天没有进展记录' };
const stuckWhy = (s) => (!s ? '' : /^[a-z][a-z0-9_]*$/.test(s) ? STUCK_CODES[s] || '' : s);
// 后端没写具体完成条件时的通用句，不显示（缺就不显示）
const GENERIC_DONE = /^\s*AI\s*核实登记的完成条件已满足后关闭本条。?\s*$/;
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
    const why = stuckWhy(x.stuck_reason) || (passed ? `约定 ${dateHm(new Date(cpAt).toISOString())} 检查，已超过 ${Math.max(1, Math.round((now.getTime() - cpAt) / 36e5))} 小时还没收到进展` : '');
    const state = stuck ? 'stuck' : h?.kind === 'running' ? 'running' : h?.kind === 'queued' ? 'queued' : h?.kind === 'none' ? 'none' : 'wait';
    const shown = bare ? `${x.project ? x.project + '：' : ''}这条还没写清要办什么，AI 需要补上说明。` : passed ? title.replace(/[；;]\s*下一个检查点[^；;]*$/, '') : title;
    return { x, title: shown, why, state, h };
  });
  if (!rows.length) return `<p class="cp-line" id="ai">${dot('ok')}现在没有交给 AI 的事。</p>` + govRun(v, ctx);
  const count = (s) => rows.filter((r) => r.state === s).length;
  const parts = [count('stuck') && `超期没进展 ${count('stuck')}`, count('running') && `AI 正在办 ${count('running')}`, count('queued') && `等自动任务开始 ${count('queued')}`, count('none') && `还没读到 AI 何时处理 ${count('none')}`, count('wait') && `等 AI 处理 ${count('wait')}`].filter(Boolean);
  const g = v.governance || {};
  const next = g.next_run_at ? `下次每周体检 ${dateHm(g.next_run_at)}${g.consumer_state === 'not_confirmed' ? '，还没确认它会接手这些事' : ''}` : '';
  const line = (r) => `<li class="is-${r.state}"><span>${esc(r.title)}</span><small>${[r.why, r.h?.task ? `由“${r.h.task}”在办` : '', r.h?.next_run_at ? '下次 ' + dateHm(r.h.next_run_at) : '', r.x.last_checked_at ? checkedAgo(r.x.last_checked_at, now) : '还没核对过'].filter(Boolean).map(esc).join(' · ')}</small></li>`;
  const stuck = rows.filter((r) => r.state === 'stuck'), rest = rows.filter((r) => r.state !== 'stuck');
  return `<div class="cp-ai" id="ai"><h3 class="cp-sub">交给 AI 的事：${rows.length} 件<span class="cp-ai-parts">${parts.join(' · ')}</span></h3>` + govRun(v, ctx)
    + (stuck.length ? `<p class="cp-ai-cap">${dot('attention')}超期没进展（已超过约定的检查时间）</p><ul class="cp-ailist is-stuck">${stuck.map(line).join('')}</ul>` : '')
    + aiWork(v, ctx)
    + (rest.length ? `<details class="cp-more" id="ai-rest"><summary>其余 ${rest.length} 件，你不用动手${next ? `（${esc(next)}）` : ''}</summary><ul class="cp-ailist">${rest.map(line).join('')}</ul></details>` : '')
    + `</div>`;
}
// 每周 AI 体检这一轮做了什么（后端 governance.last_run，字段见 G3）；没给 counts 就不出，退回原来的显示
const nOf = (x) => (Number.isInteger(x) && x >= 0 ? x : null);
function govRun(v, ctx) {
  const g = v.governance || {}, r = g.last_run && typeof g.last_run === 'object' ? g.last_run : null, c = r?.counts && typeof r.counts === 'object' ? r.counts : null;
  if (!c) {
    // 还没有这一轮的结果数：照实说到了哪一步（几点开始、正在跑 / 没跑成 / 这周还没开始），不写“这周已跑过”
    const s = govState(v, ctx.now);
    if (!s) return '';
    return `<div class="cp-gov"><p class="cp-gov-line">${dot(s.state === 'failed' ? 'attention' : s.state === 'running' ? 'neutral' : 'ok')}<span class="cp-gov-text">每周 AI 体检：${esc(s.text)}${s.next && s.state !== 'running' ? ` · 下次 ${esc(dateHm(s.next))}` : ''}</span></p></div>`;
  }
  const list = (k) => (Array.isArray(r[k]) ? r[k].filter((x) => x && typeof x === 'object' && x.title) : []);
  const acts = list('actions').slice(0, 3), closed = list('auto_closed'), deferred = list('newly_deferred');
  const nums = [['修好', c.fixed], ['关掉', c.closed], ['转暂缓', c.deferred], ['还在跟', c.following], ['要你办', c.need_you]].filter(([, n]) => nOf(n) != null);
  const need = nOf(c.need_you), at = r.started_at || r.ended_at, next = r.next_run_at || g.next_run_at;
  const head = `这周 AI 体检${at ? `（${dateHm(at)}）` : ''}：` + (nums.length ? nums.map(([k, n]) => `${k} ${n}`).join('、') + ' 件' + (need ? '（在上面）' : '') : esc(r.summary || '跑完了'));
  const ask = `驾驶舱每周 AI 体检${at ? `（${dateHm(at)} 那一轮）` : ''}：请读本机状态接口（/computer-access/api/status 全量）里的 governance.last_run 和这一轮的体检回执，告诉我修好、关掉、转暂缓、还在跟的各是哪几件。`;
  const sub = (key, label, items, note) => (items.length ? `<details class="cp-more cp-gov-more" id="${key}"><summary>${label} ${items.length} 件</summary><ul class="cp-ailist">${items.map((x) => `<li><span>${esc(x.title)}</span>${x[note] ? `<small>${esc(x[note])}</small>` : ''}</li>`).join('')}</ul></details>` : '');
  return `<div class="cp-gov"><p class="cp-gov-line">${dot(need ? 'attention' : 'ok')}<span class="cp-gov-text">${head}${next ? ` · 下次 ${esc(dateHm(next))}` : ''}</span>${copyText(ask, '问 AI 详情', ' cp-btn-quiet')}</p>`
    + (acts.length ? `<ul class="cp-gov-acts">${acts.map((x) => `<li><span>${esc(x.title)}</span>${copyBtn(x.copy_ai_id)}</li>`).join('')}</ul>` : '')
    + sub('gov-closed', '本周自动关掉', closed, 'evidence') + sub('gov-deferred', '本周新转暂缓', deferred, 'reason') + `</div>`;
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
    nb ? `改动还没合进正式版本：${branches.length} 个项目共 ${nb} 处，AI 会合进去或清掉` : '',
  ].filter(Boolean);
  return `<div class="cp-aiwork"><b>AI 现在在做</b><ul>${bits.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>${v.ai_work.observed_at ? `<small>${esc(when(v.ai_work.observed_at, ctx.now))} 读到</small>` : ''}</div>`;
}

// 要我处理的事 + 交给 AI 的事 + 等条件到了再做
export function needYou(v, ctx) {
  const { all: items } = ownerNow(v, ctx.now);
  const decide = items.filter((i) => DECIDE.includes(i.x.ask_kind)), act = items.filter((i) => !DECIDE.includes(i.x.ask_kind));
  const group = (list, title) => (list.length ? (title ? `<h3 class="cp-sub">${title}</h3>` : '') + `<div class="cp-todos">${list.map((i) => askCard(i.x, i.r, ctx)).join('')}</div>` : '');
  const body = items.length
    ? group(act, decide.length ? '要你动手' : '') + group(decide, '要你拍板（规则或做法）')
      + (items.length > 1 ? `<p class="cp-all"><button type="button" class="cp-btn" data-copy-ai-all>全部 ${items.length} 件一起交给 AI（复制一句话）</button></p>` : '')
    : `<p class="cp-empty">${dot(v.ok ? 'ok' : 'unavailable')}${v.ok ? '现在没有要你动手的事。' : notRead(v.served_at, ctx.now)}</p>`;
  // 等条件：分“你有空时可以做”和“AI 等条件”；事在前、什么时候做在后；后端没给是谁的事就合在一起
  // “按登记条件暂缓：……”后面就是等什么条件，直接写“等到：……”；通用完成句不显示
  const fmt = (x) => {
    const why = String(x.deferred_reason || x.reason || '').trim(), m = /^(?:按登记条件暂缓|等到这个时候再办)[：:]\s*(.+)$/.exec(why);
    const done = x.done_when && !GENERIC_DONE.test(x.done_when) ? x.done_when : '';
    const bits = [m ? `等到这个时候再办：${m[1]}` : why ? `为什么暂缓：${why}` : '等你方便时', done ? `办完后：${done}` : ''].filter(Boolean);
    return `<li><span>${esc(clean(x.title) || x.project)}</span><small>${bits.map(esc).join(' · ')}</small></li>`;
  };
  const mine = v.deferred.filter((x) => x.action_owner === 'user'), theirs = v.deferred.filter((x) => x.action_owner && x.action_owner !== 'user');
  const known = mine.length + theirs.length === v.deferred.length;
  const wait = !v.deferred.length ? '' : known
    ? (mine.length ? `<h3 class="cp-sub">暂缓 · 你有空时可以做（${mine.length} 件，不急）</h3><ul class="cp-list cp-wait">${mine.map(fmt).join('')}</ul>` : '')
      + (theirs.length ? `<details class="cp-more" id="ai-wait"><summary>暂缓 · AI 等条件到了再做（${theirs.length} 件，你不用管）</summary><ul class="cp-list cp-wait">${theirs.map(fmt).join('')}</ul></details>` : '')
    : `<h3 class="cp-sub">暂缓 · 等条件到了再做（${v.deferred.length} 件）</h3><ul class="cp-list cp-wait">${v.deferred.map(fmt).join('')}</ul>`;
  return anchor('pending') + body + aiBlock(v, ctx) + wait;
}

// 电脑：读数卡 + 两张 Grafana 曲线卡 + 远程和网络
export function computer(v, ctx) {
  const g = v.grafana, off = !!ctx.offline;
  const charts = g.links.filter((l) => l.id !== 'overview');
  const graf = charts.length
    ? charts.map((l) => `<a class="cp-card cp-chart is-green" href="${esc(l.url)}" target="_blank" rel="noopener"><h3><span class="cp-chart-icon" aria-hidden="true"></span>${esc(l.label)} 24 小时曲线</h3><p>在新标签页打开图表网页（Grafana）。</p></a>`).join('')
    : `<article class="cp-card is-gray"><h3>${dot('unavailable')}24 小时曲线</h3><p>图表网页现在打不开${g.checked_at ? `（上次检查 ${esc(when(g.checked_at, ctx.now))}）` : ''}。</p></article>`;
  // Grafana 后台登录：根地址来自接口，后面拼 login；接口没给地址就不出这张卡
  const login = g.url && !off ? `<a class="cp-card cp-chart cp-login" href="${esc(new URL('login', g.url).href)}" target="_blank" rel="noopener"><h3><span class="cp-login-icon" aria-hidden="true"></span>图表后台（Grafana）登录 →</h3><p>登录后看全部图表、改面板（新标签页）。</p></a>` : '';
  // 处理器卡只按温度上色；内存和系统资源是后端单独的一张卡（system_resources），正文就是真实触发项，这里不再自己补猜的原因
  const cards = dedupeCards(v.sections.computer).map((c) => card(c, ctx.now, off)).join('');
  // 副机（笔记本）在不在线，接在远程连接卡里（remote_network.secondary_laptop；没读到就不写这一行）
  const lap = LAPTOP[v.laptop.state];
  // “你得知道”里有正在修的网络问题时，远程卡不再只写“网络正常”，而是说此刻能连上、间歇断开还在查，点了跳到那一条
  // 有在修的网络问题时，后端在远程卡上给 must_know_id（文字已改成“此刻能连上；间歇断开还在查”），点了跳到“你得知道”那一条
  const remoteCards = dedupeCards(v.sections.remote);
  const net = !off && remoteCards.find((c) => c.must_know_id);
  const remote = (remoteCards.map((c) => card(c, ctx.now, off)).join('') || card({ title: '远程连接', state: 'unavailable', text: '' }, ctx.now, off)).replace('<article ', '<article id="remote" ')
    .replace(/<\/p>/, (m) => m + (net ? `<p class="cp-net"><a href="#${esc(knowId({ id: net.must_know_id }))}">间歇断开的情况看这里 →</a></p>` : '') + (lap && !off ? `<p class="cp-laptop">${dot(lap[1])}笔记本（副机）：${lap[0]}</p>` : ''));
  // 读不到电脑时图表网页也打不开：链接先收起，只留一行说明
  const chartsRow = off ? `<p class="cp-line cp-off-note">${dot('unavailable')}读不到电脑，图表链接先收起，读到后再出来。</p>` : `<div id="grafana" class="cp-grid cp-charts">${graf}${login}</div>`;
  return `<div class="cp-grid">${cards}${remote}</div>${chartsRow}`;
}
const LAPTOP = { online: ['在线', 'ok'], offline: ['离线（要用它时得先开机连网）', 'attention'] };

export function backup(v, ctx) {
  const off = !!ctx.offline;
  const cards = dedupeCards(v.sections.backup_cloud).map((c) => card(c.id === 'drive_upload' ? { ...c, text: knownFirst(c.text) } : c, ctx.now, off)).join('');
  return anchor('backups') + `<div class="cp-grid">${cards || card({ title: '备份', state: 'unavailable', text: '' }, ctx.now, off)}</div>`;
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
const EVENT = { acceptance_reviewed: (x) => `AI 核对了 ${x.count ?? ''} 件登记的事${x.passed != null ? `，${x.passed} 件确认办完` : ''}`, freeze_captured: () => '电脑卡住时自动留了一次现场' };
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
  const known = a.errors.length && a.errors.every((e) => typeof e.recovered === 'boolean');
  const names = a.errors.length ? `<p class="cp-cap cp-errnames">出过错的：${a.errors.map((e) => `${esc(e.name || '没写名字的任务')}（${esc(hm(e.at))}${e.owner === 'other' ? '，别的软件自带' : ''}${e.recovered === true ? '，后来已恢复' : e.recovered === false ? '，还没恢复' : ''}）`).join('、')}${known ? '。' : '；后来恢复没有，看上面自动任务清单里的“今天出过错的”。'}</p>` : '';
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
    + `<p class="cp-src">${esc(p.source_note || '估算 · 来自电脑自己的实时记录（TimeAudit 项目采集，图表后台 Grafana 里能看）')}</p>`
    + (p.observed_at ? `<p class="cp-time">${p.state === 'attention' ? `这次没读到，上面是 ${esc(when(p.observed_at, ctx.now))} 读到的` : `${esc(when(p.observed_at, ctx.now))} 读到`}</p>` : '') + `</article>`;
}

// 网站上次成功发布（后端 website_release，字段在才出这一行）：只证明上次成功那次；读不到时灰着照实说
function releaseLine(v, ctx) {
  const r = v.website_release;
  if (!r) return '';
  const good = r.state === 'success' && r.verified === true;
  const text = good ? (typeof r.text === 'string' && r.text ? r.text : `网站上次成功发布 ${r.published_at ? when(r.published_at, ctx.now) : ''}，回读通过`) : '网站上次发布的回执这会儿读不到';
  return `<p class="cp-release${good ? '' : ' is-off'}">${dot(good ? 'ok' : 'unavailable')}<span>${esc(text)}</span></p>`;
}

export function todayBlock(v, ctx) {
  const cards = dedupeCards(v.sections.today.filter((c) => c.id !== 'today_changes')).map((c) => card(c, ctx.now, !!ctx.offline)).join('');
  const gaps = v.source_gaps.length ? `<h3 class="cp-sub">这次有几处没读到（相关的数可能不全）</h3><ul class="cp-list">${v.source_gaps.map((g) => `<li>${dot('attention')}${esc(g.title)}${g.since ? `<span class="cp-meta">（${esc(when(g.since, ctx.now))} 起）</span>` : ''}</li>`).join('')}</ul>` : '';
  return releaseLine(v, ctx) + `<div class="cp-features">${codeCard(v, ctx)}${wordsCard(v, ctx)}${activityBlock(v, ctx)}${powerBlock(v, ctx)}</div>`
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
// 颜色只看要不要你出手：后端给了 owner_action（do / know / none）或 owner_action_needed 就按它；
// 没给时按这一格自己写的“谁在办”：写着不用你动手、交给 AI 的，不用红黄，用中性色写“AI 在管”。
// 红 = 要你出手且急；黄 = 要你出手不急，或 AI 卡住要你知道；中性 = AI 在管；绿 = 正常；灰 = 读不到
export function ownerState(level, s, who = '') {
  if (COLOR_STATE[s?.color]) return COLOR_STATE[s.color];
  const lv = LV[level];
  if (!lv) return 'unavailable';
  const oa = s?.owner_action, need = s?.owner_action_needed;
  if (oa === 'do' || need === true) return lv === 'ok' ? 'attention' : lv;
  if (lv === 'ok') return 'ok';
  if (oa === 'know') return 'attention';
  if (oa === 'none' || need === false) return s?.stuck === true ? 'attention' : 'neutral';
  return !who || AI_HANDLES.test(who) ? 'neutral' : lv;
}
// 今天出错的任务里，哪些已经恢复：后端每条错误带 recovered 时按它数；没有就用 overview.task_health；都没有返回 null（照旧只报出错总数）
const recovery = (v) => {
  // 后端 10 月 12 日起：today_tasks 信号的 value 就是现在仍失败的数，recovered_today 是今天已恢复的数
  const sig = sigOf(v.overview, 'today_tasks');
  if (Number.isFinite(sig.recovered_today) && Number.isFinite(Number(sig.value))) return { open: Number(sig.value), done: sig.recovered_today };
  const list = v.today_activity?.errors || [];
  if (list.length && list.every((e) => typeof e.recovered === 'boolean')) return { open: list.filter((e) => !e.recovered).length, done: list.filter((e) => e.recovered).length };
  const th = v.overview?.task_health;
  return th && Number.isFinite(th.unrecovered_today) && Number.isFinite(th.recovered_today) ? { open: th.unrecovered_today, done: th.recovered_today } : null;
};
const SHORT = { neutral: 'AI 在管', attention: '要你看', red: '要你看', unavailable: '读不到' };
// 首屏三格的内容：每格 {state, status, who, why, note, short, brief}
function triCells(v, ctx, off) {
  const ov = v.overview;
  const make = (id, label, level, sig, status, okWho, okShort, why, note = '') => {
    const state = off ? 'unavailable' : ownerState(level, sig, sig?.handler_text || '交给 AI');
    const aiSays = typeof sig?.ai_handling === 'string' && sig.ai_handling ? sig.ai_handling.replace(/^AI\s*在管[：:]\s*/, '').replace(/[。\s]+$/, '') : '';
    const who = state === 'ok' ? okWho : state === 'neutral' ? (aiSays && aiSays !== 'AI 在管' ? `AI 在管 · ${aiSays}` : sig?.handler_text && AI_HANDLES.test(sig.handler_text) ? sig.handler_text : 'AI 在管 · 不用你动手')
      : state === 'unavailable' ? (ov?.as_of ? `上次 ${hm(ov.as_of)} 读到` : '还没读到') : (sig?.handler_text || '要你看一眼 ↓');
    return { id, label, state, status: off ? '读不到' : status, who, why: off ? '' : why, note: off ? '' : note, short: SHORT[state] || okShort, brief: status.startsWith(label) ? status : label + status };
  };
  // 电脑：处理器（只看温度）和内存/系统资源分开说，哪张卡亮了就说哪张，原因用后端卡片原文
  const pc = sigOf(ov, 'computer'), pcWhy = whyOf(ov, 'computer');
  const pcOf = (id) => v.sections.computer.find((c) => c.id === id) || null;
  const proc = pcOf('computer_health'), res = pcOf('system_resources');
  const bad = (c) => !!c && ['attention', 'red'].includes(c.state);
  const pcLevel = pc.level === 'ok' && (bad(proc) || bad(res)) ? 'watch' : pc.level;
  const pcBad = [bad(proc) && '处理器偏热', bad(res) && '内存/系统资源偏高'].filter(Boolean);
  const pcStatus = pcLevel === 'ok' ? '正常' : LV[pcLevel] ? (pcBad.length ? pcBad.join('，') : pcWhy[0] || '有预警') : '读不到';
  const pcText = (c) => String(c?.text || '').replace(/^电脑读数：/, '');
  const pcDetail = (pcBad.length ? [bad(res) && pcText(res), bad(proc) && pcText(proc)] : [proc?.text && '现在 ' + pcText(proc)]).filter(Boolean).join('；');
  // 自动任务：只数现在还没恢复的；已恢复的放下面一行灰色小字。“这周反复出错”只留最近一次仍失败的
  const tk = sigOf(ov, 'today_tasks'), errs = todayErrors(v), sum = v.today_activity?.summary || {}, rec = recovery(v);
  const total = errs ? errs.owner + errs.other : Number.isFinite(tk.value) ? tk.value : null;
  const nErr = rec ? rec.open : total;
  // 这周反复出错：后端 task_health.current_repeated_7d（最近仍失败、七天至少 5 次的条数）是 0 时不挂；有数时列最近仍失败的那几条
  const cur = v.overview?.task_health?.current_repeated_7d;
  const repeat = cur === 0 ? [] : v.automation.items.filter((t) => Number(t.failures_7d) >= 5 && t.state === 'failed').sort((a, b) => b.failures_7d - a.failures_7d);
  const tkLevel = rec && !rec.open && !repeat.length && LV[tk.level] ? 'ok' : tk.level;
  const tkStatus = nErr == null ? (tk.word || '读不到') : nErr === 0 ? (repeat.length ? '这周反复出错' : '今天都正常') : rec ? `今天 ${nErr} 个出错还没恢复` : `今天出错 ${nErr} 个`;
  const tkWhy = [Number.isFinite(sum.tasks_run) ? `今天跑了 ${sum.tasks_run} 个${errs && !rec ? `，出错 ${total} 个（${errorsText(errs)}）` : ''}` : '', repeat.length ? `这周反复出错：${repeat.slice(0, 2).map((t) => `${t.name} ${t.failures_7d} 次`).join('、')}` : ''].filter(Boolean).join('；');
  const tkNote = rec && rec.done ? `今天出过错、已恢复 ${rec.done} 个` : '';
  // 备份
  const bk = sigOf(ov, 'backup'), bkWhy = whyOf(ov, 'backup_cloud');
  const bkStatus = bk.level === 'ok' ? '都按时备份了' : bkWhy[0] || (Number.isFinite(bk.value) && bk.value ? `${bk.value} 项要留意` : bk.word || '读不到');
  const bkMore = bkWhy.length > 1 ? `另有 ${bkWhy.length - 1} 项：${bkWhy.slice(1).join('、')}` : Number.isFinite(bk.value) && bk.level !== 'ok' ? `共 ${bk.value} 项不正常` : '';
  return [
    make('computer', '电脑', pcLevel, pc, pcStatus, '你不用管', '正常', pcDetail),
    // 现在没有仍失败的、也没有当前反复出错的：这一格就是正常（绿），不因后端 color=neutral 写成“今天都正常，AI 在管”
    make('tasks', '自动任务', tkLevel, nErr === 0 && !repeat.length ? { ...tk, color: 'ok' } : tk, tkStatus, '电脑自己按时跑', '都正常', tkWhy, tkNote),
    make('backup', '备份', bk.level, bk, bkStatus, '你不用管', '都按时', bkMore),
  ];
}
function tri(cells) {
  const cell = (c) => `<li class="cp-tri-cell is-${light(c.state)}" data-signal="${c.id}"><a href="#${c.id === 'tasks' ? 'tasks' : c.id === 'backup' ? 'backups' : 'computer'}">`
    + `<span class="cp-tri-label">${c.label}</span><b class="cp-tri-status">${dot(c.state)}${esc(c.status)}</b><b class="cp-tri-short">${esc(c.short)}</b>`
    + `<span class="cp-tri-who">${c.who.split(' · ').map((w) => `<span>${esc(w)}</span>`).join('<i aria-hidden="true"> · </i>')}</span>`
    + (c.why ? `<span class="cp-tri-why">${esc(c.why)}</span>` : '') + (c.note ? `<span class="cp-tri-note">${esc(c.note)}</span>` : '') + `</a></li>`;
  return `<ul class="cp-tri">${cells.map(cell).join('')}</ul>`;
}
// 结论句的后半句：三格各一句，按“AI 在管 / 正常 / 要你看”归拢
function restLine(cells, n, off, at) {
  if (off) return `电脑那边这会儿读不到${at ? `（最后 ${at} 读到）` : ''}，下面三格是那时的情况。`;
  const pick = (st) => cells.filter((c) => st.includes(c.state));
  const ai = pick(['neutral']), fine = pick(['ok']), mine = pick(['red', 'attention']);
  const okWord = (c) => (c.id === 'backup' ? '备份都按时' : c.label + (c.id === 'tasks' ? '都正常' : '正常'));
  const parts = [ai.length && `${ai.map((c) => c.brief).join('、')}，AI 在管`, fine.length && (fine.length === 3 ? '电脑、自动任务、备份都正常' : fine.map(okWord).join('、')), mine.length && `${mine.map((c) => c.label).join('、')}要你看一眼 ↓`].filter(Boolean);
  return (n ? (mine.length ? '另外：' : '其余都有人管：') : '') + parts.join('；') + '。';
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
// “你得知道”（后端 must_know，字段在才出这一块）：AI 在修、影响你用电脑的毛病；刚恢复、刚办好的事；你没回又该知道的汇报。
// 最多 5 条（手机 3 条）；满 3 天收起的放在折叠里；0 条一行“没有要你知道的新事”；来源读不到时照实说读不到，不说没新事
export const knowId = (k) => 'know-' + String(k.id || '').replace(/[^\w-]/g, '');
const KNOW_TAG = { repairing: ['AI 在修', 'neutral'], recovered: ['已恢复', 'ok'], report: ['汇报', 'neutral'] };
function knowBlock(v, ctx) {
  const m = v.must_know;
  if (!m) return '';
  if (m.state === 'unavailable') return `<div class="cp-know is-empty"><p>${dot('unavailable')}你得知道：这会儿读不到${m.observed_at ? `（最后 ${esc(when(m.observed_at, ctx.now))} 读到）` : ''}，不代表没有新事</p></div>`;
  const ok = (k) => typeof k.text === 'string' && k.text;
  const all = m.items.filter(ok), old = m.archived.filter(ok);
  const row = (k) => {
    const [tag, st] = KNOW_TAG[k.kind] || ['你得知道', 'neutral'];
    const small = [k.at ? when(k.at, ctx.now) : '', typeof k.exit_when === 'string' ? k.exit_when : ''].filter(Boolean);
    return `<li id="${esc(knowId(k))}" class="is-${esc(k.kind || 'other')}"><span class="cp-know-tag is-${light(st)}">${tag}</span><span class="cp-know-text">${esc(k.text)}${small.length ? `<small>${small.map(esc).join(' · ')}</small>` : ''}</span></li>`;
  };
  const folded = old.length ? `<details class="cp-know-old"><summary>最近收起的 ${old.length} 条</summary><ul class="cp-know-list">${old.map(row).join('')}</ul></details>` : '';
  if (!all.length) return `<div class="cp-know is-empty"><p>${dot('ok')}${esc(m.text || '没有要你知道的新事')}</p>${folded}</div>`;
  const list = all.slice(0, 5);
  return `<div class="cp-know"><p class="cp-know-k">你得知道</p><ul class="cp-know-list">${list.map(row).join('')}</ul>`
    + (list.length > 2 ? `<details class="cp-know-more is-phone" id="know-more"><summary><span class="is-shut">还有 ${list.length - 2} 条，点开看</span><span class="is-open">收起</span></summary></details>` : '') + folded + `</div>`;
}
const overview = (v, ctx) => {
  if (!ctx.ov) return '';
  const off = ctx.ov.stale(v.overview, ctx.now.getTime());
  const { n, urgent, items } = ownerNow(v, ctx.now);
  const read = v.ok && !ctx.offline;
  const cells = triCells(v, ctx, off);
  const at = v.overview?.as_of ? when(v.overview.as_of, ctx.now) : v.served_at ? when(v.served_at, ctx.now) : '';
  // 页面刚打开、还没读到新数据时，首帧是构建网页那会儿的数：写明是几点的，整体灰着（样式在 cockpit.css 的 .cp-snap）
  // 构建时还不知道哪天被打开，这里总带日期（“10月12日 07:32”），过了零点也不会说错
  const snap = ctx.phase === 'snapshot' ? `<p class="cp-snap">${dot('unavailable')}这是 ${esc(v.served_at ? dateHm(v.served_at) : '早些时候')} 的数，不是现在的<span class="cp-snap-reading">，正在读最新…</span></p>` : '';
  const kinds = items.map((i) => i.x.ask_kind);
  const verb = kinds.length && kinds.every((k) => DECIDE.includes(k)) ? '要你拍板' : kinds.length && kinds.every((k) => ACTION_KINDS.includes(k)) ? '要你动手' : '要你处理';
  const tag = !n ? '' : urgent ? `<span class="cp-you-tag is-urgent">${urgent === n ? (n === 1 ? '急' : '都急') : `${urgent} 件急`}</span>` : '<span class="cp-you-tag">都不急</span>';
  const list = items.slice(0, 3).map(({ x, r }) => `<li><a href="#${esc(todoId(x))}">${dot(r.red ? 'red' : 'attention')}<span class="cp-you-title">${esc(r.head)}</span><span class="cp-you-chips">${chips(r)}</span></a></li>`).join('');
  const rest = `<p class="cp-you-rest">${esc(restLine(cells, n, off || !read, at))}</p>`;
  const you = !read && !v.need_you.length
    ? `<div class="cp-you is-off">${snap}<p class="cp-you-n">要你做的事还没读到</p><p class="cp-you-sub">${notRead(v.served_at, ctx.now)}</p></div>`
    : !n
      ? `<div class="cp-you is-none">${snap}<p class="cp-you-n">${dot('ok')}现在没有要你做的事</p>${rest}</div>`
      : `<div class="cp-you${urgent ? ' is-urgent' : ''}">${snap}<p class="cp-you-n">${verb} <b>${n}</b> 件事${tag}</p>`
        + `<ol class="cp-you-list">${list}</ol>` + rest
        + `<p class="cp-you-sub">${n > 3 ? `<a href="#need-you">还有 ${n - 3} 件 ↓</a> · ` : ''}<a href="#need-you">去处理 ↓</a>${!read && v.served_at ? ` · 这是 ${esc(when(v.served_at, ctx.now))} 读到的` : ''}</p></div>`;
  return you + knowBlock(v, ctx) + tri(cells) + score(v, ctx, off);
};
const LAMPS = { 'need-you': 'need_you', tasks: 'automation', computer: 'computer', backup: 'backup_cloud', projects: 'projects', today: 'today' };
// 分区标题旁的灯也只看要不要你出手：没有要你做的，“要处理”换成中性色“AI 在管”；项目区有等你动手的项目才保留红黄
const lampOf = (key) => (v, ctx) => {
  if (!ctx.ov) return '';
  const off = ctx.ov.stale(v.overview, ctx.now.getTime()), sec = v.overview?.sections?.[key];
  if (!off && sec && COLOR_STATE[sec.color]) {
    const st = COLOR_STATE[sec.color];
    if (st === 'neutral') return `<span class="ov-sec is-neutral"><i class="ov-lamp" aria-hidden="true"></i>AI 在管</span>`;
    if (st === 'unavailable') return ctx.ov.lamp(null, true);
    return ctx.ov.lamp({ ...sec, level: st === 'red' ? 'act' : st === 'attention' ? 'watch' : 'ok', word: st === 'ok' ? '正常' : key === 'need_you' ? '要你处理' : sec.word }, false);
  }
  if (off || !sec || key === 'need_you' || !['act', 'watch'].includes(sec.level)) return ctx.ov.lamp(sec, off);
  const st = key === 'projects' && v.projects.items.some((p) => p.waiting_user > 0) ? LV[sec.level] : ownerState(sec.level, sec);
  if (st === 'neutral') return `<span class="ov-sec is-neutral"><i class="ov-lamp" aria-hidden="true"></i>AI 在管</span>`;
  return ctx.ov.lamp({ ...sec, level: st === 'red' ? 'act' : 'watch' }, false);
};
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
  <figure class="cp-hero-art"${ctx?.birdConfig ? ` data-living-config="${ctx.birdConfig}"` : ''}><img src="${src(ctx, 'cockpit-01-illustration-01.png')}" alt="" width="866" height="326" loading="eager" crossorigin="anonymous"></figure>
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
