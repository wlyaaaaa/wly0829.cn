// 驾驶舱各块的 HTML。构建时用最近一份快照画出首帧，浏览器拿到新数据后用同一组函数原地换掉每块里面的内容。
// 每块外框（[data-cp] 所在的元素）始终在，数据没到只换字，不出空框、不换版式。
import { hm, dateHm, when, ago, light, dedupeCards, isToday, govState } from './model.js';
import { actCls, ownerBox, recentBlock, ownerWarn, questionsFor, actionToast } from './actions.js';
import { sinceText } from './seen.js';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// 图片地址由页面传入（构建时 Vite 给的带指纹地址）；没传时按素材原名
const src = (ctx, name) => ctx?.img?.[name] || '/assets/cockpit/' + name;
const anchor = (id) => `<span class="cp-anchor" id="${esc(id)}"></span>`;
// 沿用全站标题条的叶子、标题与笔刷结构；传入的正文已经转义，只有本站构造的件数加粗标签例外。
const blockHead = (title, cls = '', extra = '', headingClass = '') => `<div class="cp-block-heading c-title-strip ${cls}" data-layout="inline" data-brush-position="below_whole_row"><div class="hub-strip-text"><div class="hub-strip-heading-group"><div class="hub-strip-heading-line"><span class="hub-leaf hub-leaf-l" aria-hidden="true"></span><h2 class="hub-heading ${headingClass}">${title}</h2></div></div>${extra ? `<div class="cp-heading-meta">${extra}</div>` : ''}</div><span class="hub-brush" aria-hidden="true"></span></div>`;
const dot = (state) => `<span class="cp-dot is-${light(state)}" aria-hidden="true"></span>`;
const notRead = (at, now) => `还没读到${at ? `（上次 ${esc(when(at, now))}）` : ''}`;
// 在哪办：手机上能办 / 得在电脑前办（本人看不懂“借电脑 MCP”）
const MOBILE = { direct: '手机上能办', computer_mcp: '手机上能办', in_person: '得在电脑前办' };
// 页面兜底的词表：只换旧后端留下的“借电脑 MCP”。别的字原样显示——后端契约（10 月 29 日）：标题、进展、原因和原话的行话由登记校验和源头改写解决，
// 不在显示路径换词（原来的“本人→你”把“确认是你本人”换成了“确认是你你”）
const PLAIN = [[/（其中\s*(\d+)\s*件借电脑\s*MCP）/g, '（其中 $1 件得借电脑办）'], [/，其中\s*(\d+)\s*件借电脑\s*MCP/g, '，其中 $1 件得借电脑办'],
  [/手机借电脑\s*MCP\s*办/g, '手机上能办'], [/电脑\s*MCP/g, '电脑']];
export const plain = (s) => PLAIN.reduce((t, [re, to]) => t.replace(re, to), String(s ?? ''));
const https = (s) => { try { const u = new URL(s); return u.protocol === 'https:' && !u.username && !u.password ? u.href : ''; } catch { return ''; } };

// 本人版 / 公开版（后端 viewer、private_count，行上的 owner_only、placeholder、owner_detail）：
// 公开版的私人行只剩占位标题，灰着、不出详情和按钮；本人版的私人行挂“仅你可见”，有“具体”就在标题下多一行（单行省略，悬停或点一下看全）
export const PRIVATE_TITLE = '私人事项（只在本人设备上显示）';
const isPh = (x) => x?.placeholder === true;
const PH_HINT = '私人事项，详情只在本人设备上显示';
// 公开版的私人待办卡：说清本人设备上多看到什么，不只写“看不到”（本人 2026-10-31）
const PH_TODO = '私人事项：本人设备上能看到要做什么、为什么找本人、怎么办';
// 占位行的标题可能是 AI 另写的一句公开说法，照行里的 title 显示；本人版行带 public_title 时，标签悬停或点一下显示“公网显示为：…”
const ownTag = (x) => {
  if (x?.owner_only !== true || isPh(x)) return '';
  const pub = typeof x.public_title === 'string' && x.public_title.trim() ? '公网显示为：' + x.public_title.trim() : '';
  return pub ? `<span class="cp-own" tabindex="0" title="${esc(pub)}" data-pub="${esc(pub)}">仅你可见</span>` : '<span class="cp-own">仅你可见</span>';
};
const detail = (x, limit = 200) => {
  const d = !isPh(x) && typeof x?.owner_detail === 'string' ? x.owner_detail.trim().slice(0, limit) : '';
  return d ? `<span class="cp-detail" tabindex="0" title="${esc(d)}">${/^[一-鿿A-Za-z]{1,6}[：:]/.test(d) ? '' : '具体：'}${esc(d)}</span>` : '';
};
// 本人的事过了原定时间（后端 need_you 行的 overdue_text：“今天已过原定时间”“过了原定时间 N 天”）：标题旁一个琥珀色小标签；公开版占位行也显示，它只是天数
const lateTag = (x) => {
  const t = typeof x?.overdue_text === 'string' ? x.overdue_text.trim().slice(0, 40) : '';
  return t ? `<span class="cp-late">${esc(t)}</span>` : '';
};
// 列表里的一行：标题 + 标签 + 具体 + 原来的小字；占位行只出标题
const rowText = (x, title, small = '') => (isPh(x)
  ? `<span title="${PH_HINT}">${esc(x.title || PRIVATE_TITLE)}</span>`
  : `<span>${esc(title)}${ownTag(x)}</span>${detail(x)}${small ? `<small>${small}</small>` : ''}`);
const phCls = (x) => (isPh(x) ? ' is-private' : '');
// 列表行的 class：私人占位行灰着；本人设备上点过、交出去了的也灰着（见 actions.js）
const liCls = (x, ctx) => { const c = ((isPh(x) ? 'is-private' : '') + actCls(x, ctx)).trim(); return c ? ` class="${c}"` : ''; };
// 每个条目带上自己的编号（data-items），手机通知打开 /cockpit/#<条目编号> 时 client.js 按它找到这一条、滚过去并高亮
export const itemAttr = (x) => { const ids = [...new Set([x?.id, x?.copy_ai_id].filter((s) => typeof s === 'string' && s.trim()).map((s) => s.trim()))]; return ids.length ? ` data-items="${esc(ids.join(' '))}"` : ''; };
// 配对过的设备（ctx.paired）首帧还是构建时那份公开的数：先写“你的设备”，免得以为配对掉了
const pairedWaiting = (v, ctx) => v.viewer?.kind !== 'owner' && ctx.paired === true && ctx.phase === 'snapshot';
const PAIRED_WAIT = '正在读你的完整版，私人事项稍后出来';
export function viewerLine(v, ctx = {}) {
  const n = v.private_count, w = v.viewer, waiting = pairedWaiting(v, ctx);
  const note = ctx.notice ? `<span class="cp-viewer-note">${esc(ctx.notice)}</span>` : '';
  const line = w?.kind === 'owner' ? `你的设备 · 全部显示${n > 0 ? `（其中 ${n} 件公网看不到）` : ''}`
    : waiting ? `你的设备 · ${PAIRED_WAIT}` : n > 0 ? `公开版 · ${n} 件私人事项只在本人设备上显示` : '';
  return note + (line ? `<span class="cp-viewer-line${w?.kind === 'owner' || waiting ? ' is-owner' : ''}">${line}</span>` : '');
}

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
// t（电脑区网格卡）：{ big, sub, bar, go, more } 都是排好的 HTML；给了就先写大数字、短说明，原句收进“详情 ›”（要你出手的照旧摊开），读不到电脑时不各写时间
export function card(c, now, off = false, pageAt = '', t = null) {
  const lag = (x) => !pageAt || !!lagAt(x, { served_at: pageAt });
  const missing = c.state === 'unavailable' || c.state === 'reading';
  const gap = ago(c.observed_at, now).replace(/^刚刚$/, '').replace(/前$/, '');
  const state = off ? 'unavailable' : cardState(c);
  const text = c.text ? esc(c.text) + (missing && c.observed_at ? `<span class="cp-stale">（这是 ${esc(when(c.observed_at, now))} 读到的，之后${gap ? ' ' + esc(gap) : ''}没读到新的）</span>` : '') : notRead(c.observed_at, now);
  const time = off && t ? '' : off ? (missing ? '' : `<p class="cp-time cp-off-note">读不到${c.observed_at ? `（最后 ${esc(when(c.observed_at, now))} 读到）` : ''}</p>`)
    : state === 'stale' ? `<p class="cp-time">数据源停了，上面是最后一次记录，不是你的事${c.observed_at ? ` · ${esc(when(c.observed_at, now))} 读到` : ''}</p>`
    // 大字已经写了“AI 在管”的网格卡（t.who === false），下面不再重复写一遍
    : !missing && c.observed_at && ((state === 'neutral' && t?.who !== false) || lag(c.observed_at)) ? `<p class="cp-time">${state === 'neutral' && t?.who !== false ? esc(typeof c.ai_handling === 'string' && c.ai_handling ? c.ai_handling.replace(/[。\s]+$/, '') : 'AI 在管，不用你动手') + (lag(c.observed_at) ? ' · ' : '') : ''}${lag(c.observed_at) ? esc(when(c.observed_at, now)) + ' 读到' : ''}</p>` : '';
  // 后端给出“具体是哪条线触发的”（trigger_items：单个程序 1 小时上传超过 2GB，或近 1 小时合计超过登记线）就写出来；
  // 卡片正文已经写了程序名的不重复；没给就不猜
  const LINE = { program_hour_upload: (t) => `${t.name || '某个程序'} 1 小时上传 ${Number(t.value_gb).toFixed(1)}GB，超过 ${t.threshold_gb}GB`, proxy_hour_total: (t) => `近 1 小时合计 ${Number(t.value_gb).toFixed(1)}GB，超过 ${t.threshold_gb}GB` };
  const items = Array.isArray(c.trigger_items) ? c.trigger_items.filter((t) => t && LINE[t.reason] && Number.isFinite(Number(t.value_gb))) : [];
  const lines = items.filter((t) => !(c.text || '').includes(Number(t.value_gb).toFixed(1))).map((t) => LINE[t.reason](t));
  const trig = off ? '' : lines.length ? `<p class="cp-reason">触发的是：${esc(lines.join('；'))}</p>` : typeof c.trigger_text === 'string' && c.trigger_text ? `<p class="cp-reason">触发的是：${esc(c.trigger_text)}</p>` : '';
  const details = Array.isArray(c.details) ? c.details.filter((d) => d && (d.title || d.text)) : [];
  // 网格卡：要你出手的（黄、红）原句照旧摊开；其余有没说全的才收进“详情 ›”
  const open = !off && !t?.fold && ['attention', 'red'].includes(state);
  const body = !t ? `<p>${text}</p>` : `<p class="cp-big">${t.big}</p>${t.bar || ''}${t.sub ? `<p class="cp-sub">${t.sub}</p>` : ''}${t.list || ''}`
    + (open ? `<p>${text}</p>` : t.more === false && !(missing && c.text) ? '' : `<details class="cp-tile-more"><summary>详情</summary><p>${text}</p></details>`) + (t.go || '');
  return `<article class="cp-card is-${light(state)} ct-card${off ? ' is-off' : ''}${t ? ' cp-tile' : ''}"${t?.id ? ` id="${t.id}"` : ''}><h3>${dot(state)}${esc(c.title)}</h3>${body}` + trig
    + (details.length ? `<details class="cp-more"><summary>查看具体缺口</summary><ul class="cp-list">${details.map((d) => `<li><span>${esc(d.title)}</span>${d.text ? `<small>${esc(d.text)}</small>` : ''}</li>`).join('')}</ul></details>` : '')
    + (c.criteria_text ? `<p class="cp-criteria">判断标准：${esc(c.criteria_text)}</p>` : '')
    + time + `</article>`;
}
// 正常的事实卡只占一行：灯 + 标题 + 一句话（一行放不下就省略，悬停或点一下看全）
const factText = (c) => { const t = String(c.text || '').trim(), h = String(c.title || ''); return (h && t.startsWith(h) && t.slice(h.length).replace(/^[：:，,\s]+/, '')) || t; };
export const factLine = (c, attrs = '', note = '') => `<li class="cp-fact"${attrs} tabindex="0" title="${esc(c.text || '')}">${dot('ok')}<b>${esc(c.title)}</b><span>${esc(factText(c) + note)}</span></li>`;
// 一组事实卡：正常的收成一行一条，其余（要留意、AI 在管、读不到）照原样整张卡
// 要你出手的（红、黄）照样整张卡；正常的一行；AI 在管、数据停了、读不到的也一行，点开就是原来那张卡（原因、缺口、读到时间都在里面）
const FOLD_STATES = ['neutral', 'stale', 'unavailable', 'reading'];
const foldFact = (c, now, off, pageAt = '') => {
  const st = off ? 'unavailable' : cardState(c), missing = c.state === 'unavailable' || c.state === 'reading';
  // 读不到的那一行先说是几点读到的（点开才是那时的值），不把旧值当现在的写在外面
  const gap = c.observed_at ? ago(c.observed_at, now).replace(/^刚刚$/, '').replace(/前$/, '') : '';
  const say = missing ? (c.observed_at ? `这是 ${when(c.observed_at, now)} 读到的，之后${gap ? ' ' + gap : ''}没读到新的` : '还没读到') : factText(c) || (st === 'neutral' ? 'AI 在管' : '没读到');
  return `<li class="cp-fact is-fold"><details><summary>${dot(st)}<b>${esc(c.title)}</b><span>${esc(say)}</span></summary>${card(c, now, off, pageAt)}</details></li>`;
};
// pageAt：页面顶上那次读取的时间（v.served_at）；给了就只在比它旧 15 分钟以上时写几点读到（本人 10-30 批准第 5 项），没给照旧每组写一次
export function factCards(cards, now, off = false, pageAt = '') {
  const st = (c) => (off ? 'unavailable' : cardState(c));
  const big = cards.filter((c) => !off && !['ok', ...FOLD_STATES].includes(st(c)));
  const lines = cards.filter((c) => !big.includes(c));
  // 收成一行的卡不各写时间，这一组末尾写一次几点读到的（读不到电脑时写最后几点读到）
  const t = lines.map((c) => Date.parse(c.observed_at || '')).filter(Number.isFinite);
  const last = t.length ? new Date(Math.max(...t)).toISOString() : '';
  // 比这一组最新的读数旧 15 分钟以上的那一行，自己写上几点读到的
  const note = (c) => { const x = Date.parse(c.observed_at || ''); return Number.isFinite(x) && Date.parse(last) - x > 9e5 ? `（${when(c.observed_at, now)} 读到）` : ''; };
  const atLine = last && (off || !pageAt || lagAt(last, { served_at: pageAt })) ? `<p class="cp-time cp-facts-at">${off ? `读不到（最后 ${esc(when(last, now))} 读到）` : `${esc(when(last, now))} 读到`}</p>` : '';
  return (big.length ? `<div class="cp-grid">${big.map((c) => card(c, now, off, pageAt)).join('')}</div>` : '')
    + (lines.length ? `<ul class="cp-facts">${lines.map((c) => (st(c) === 'ok' ? factLine(c, '', note(c)) : foldFact(c, now, off, pageAt))).join('')}</ul>${atLine}` : '');
}
// 停了 3 天以上、已收进“这几块数据停了”那一句的卡（后端 stale_summary.ids），各区不再单独列
const staleIds = (v) => new Set(v.stale_summary?.ids || []);
const oldTodayCards = (v, now) => v.sections.today.filter((c) => c.id !== 'today_changes' && !isToday(c.observed_at, now));


// 安全和授权：和电脑 / 自动任务 / 备份三格同一个样子（小标题、圆点 + 状态词、一行灰色小字、右下 ›），整格链到授权页（本人 10-30 选定 A 版）。
// 状态词只看要不要你留意：无限制授权开着用注意色；资料锁着不算异常；首帧（构建时的数）和读不到电脑时不拿旧状态冒充现在。
// 小字先写资料解锁到几点；数据来源和判定不变，公开版拿到的也是这几样
export function security(v, ctx) {
  const s = v.security, pd = s.personal_data.state, un = s.unrestricted.state;
  const off = ctx.offline || !v.ok;
  // 自己的读取时间超过总览同一个时限（没给按 15 分钟）就算没读到，不拿旧状态报平安；和总览缺不缺无关
  const seenAt = Date.parse(s.observed_at || ''), limit = Number(v.overview?.stale_after_seconds) || 900;
  const old = Number.isFinite(seenAt) && ctx.now.getTime() - seenAt > limit * 1000;
  const unread = off || ctx.phase === 'snapshot' || old;
  const lastRead = s.observed_at ? '上次 ' + when(s.observed_at, ctx.now) + ' 读到' : '还没读到过';
  const pdAt = s.personal_data.expires_at, unAt = s.unrestricted.expires_at;
  const [word, state] = off ? ['连不上电脑', 'unavailable'] : unread ? ['没读到', 'unavailable']
    : un === 'active' ? ['无限制授权开着', 'attention'] : un === 'inactive' && ['unlocked', 'locked'].includes(pd) ? ['都正常', 'ok'] : ['没读到', 'unavailable'];
  const sub = unread ? lastRead : pd === 'unlocked' ? (pdAt ? `资料解锁到 ${dateHm(pdAt)}` : '资料已解锁')
    : un === 'active' && unAt ? `开到 ${dateHm(unAt)}` : pd === 'locked' ? '资料锁着' : '资料状态没读到';
  return `<ul class="cp-tri cp-tri-sec"><li class="cp-tri-cell is-${light(state)}" data-signal="security"><a class="hub-stat-field ct-card" href="/computer-access/">`
    + `<span class="cp-tri-label">安全和授权</span><b class="cp-tri-status">${dot(state)}${statusText(word)}</b><span class="cp-tri-who"><span>${esc(sub)}</span></span></a></li></ul>`;
}

// ---- “要你做的事”怎么读：后端按需问字段（P2）有就用；没有就从现有标题里拆，拆不出就照原句显示 ----
const CIRCLED = /[①②③④⑤⑥⑦⑧⑨]/;
const BJ = (s) => { const m = /(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(s || ''); return m ? Date.parse(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:00+08:00`) : NaN; };
const clean = (t) => String(t || '').replace(/\s*做完点“复制给 AI”说一声。?/g, '').replace(/\s*(最后核对：[^。]*。?|尚未核对。?)/g, '').trim();
// 没写问题的旧“AI 在等你回”卡（标题只有“有一个 AI 对话在等你回复”）：有对话名写“「对话名」那个对话在等你回话”，没有就照实说它没写问题。
// 钩子以后会把问题写全，这里只是旧卡的兜底；“打开对话”照 open 字段画
export const vagueWait = (x) => x?.card_type === 'ai_wait' && !isPh(x) && (!clean(x.title) || /^有一?个\s*(AI\s*)?对话在等你回(复|话)[。！]?$/.test(clean(x.title)));
export const waitTitle = (x) => {
  if (!vagueWait(x)) return clean(x.title);
  const c = x.open?.conversation, name = [c?.title, x.conversation_title].find((s) => typeof s === 'string' && s.trim());
  return name ? `「${name.trim()}」那个对话在等你回话` : '有个对话在等你回话，但它没写问题';
};
export function readTodo(x, now) {
  let t = vagueWait(x) ? waitTitle(x) : clean(x.title || x.next_step);
  let path = '';
  t = t.replace(/\s*汇报在电脑上：[^（]*（路径\s*([^）]+)）。?/, (_, p) => { path = p.trim(); return ''; }).replace(/\s*（路径\s*([^）]+)）/, (_, p) => { path ||= p.trim(); return ''; }).trim();
  const mins = x.minutes ?? x.action?.estimated_minutes;
  let minutes = Number.isFinite(mins) ? `约 ${mins} 分钟` : '';
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
  // 截止时间只读条目上的 due_at（后端在补）；done_when 是完成条件，不从它的文字里猜日子
  const dueAt = Date.parse(x.due_at || '');
  const dueText = Number.isFinite(dueAt) ? dateHm(new Date(dueAt).toISOString()) : '';
  // 卡片上的完成说明只读后端 completion_text（“做完上面几步就行，剩下 AI 收尾。”）；done_when 是给 AI 核对的完成条件，不给本人当提示
  const done = typeof x.completion_text === 'string' ? x.completion_text.trim() : '';
  const left = Number.isFinite(dueAt) ? dueAt - now.getTime() : NaN;
  const urgent = typeof x.urgent === 'boolean' ? x.urgent : Number.isFinite(left) && left < 864e5;
  // 卡片红不红：后端给了 color 就按它（本人待办用黄色“要你处理”，红色只给确有失败又有期限的）；没给按期限急不急
  const red = x.color ? x.color === 'red' : urgent;
  const mobile = x.mobile_method && MOBILE[x.mobile_method.kind] ? x.mobile_method : null;
  return { head: label && !x.headline ? `${label}：${head}` : head, body: rest, steps, options, minutes, path, where, mobile, dueText, done, hasDue: Number.isFinite(dueAt), overdue: left < 0, urgent, red };
}
// “你现在 N 件”：件数优先用后端 overview.owner_count / owner_urgent_count（数字；owner_urgent 是真假，不是件数），没有就数“要你做的事”清单
export function ownerNow(v, now, ctx = {}) {
  const ov = v.overview || {};
  // 后端给了 ask_kind 时，不把明确写着“AI 的事”的算进来；急不急也以后端为准。
  // （以前只认 do / decide，后端实际给的是 decision，首屏标题因此一条都没列出来）
  const all = v.need_you.map((x) => ({ x, r: readTodo(x, now) }));
  const own = all.filter((i) => !['ai', 'know'].includes(i.x.ask_kind));
  const uc = Number.isInteger(ov.owner_urgent_count) && ov.owner_urgent_count >= 0 ? ov.owner_urgent_count : null;
  const hidden = own.filter((i) => actCls(i.x, { ...ctx, viewer: v.viewer }));
  const items = own.filter((i) => !hidden.includes(i));
  const n = Number.isFinite(ov.owner_count) ? Math.max(0, ov.owner_count - hidden.length) : items.length;
  const urgent = uc != null ? Math.max(0, uc - hidden.filter((i) => i.r.urgent).length) : items.filter((i) => i.r.urgent).length;
  return { n, urgent, items, all, hidden: hidden.length };
}
const checkedAgo = (v, now) => { const t = Date.parse(v || ''); if (!Number.isFinite(t)) return ''; const h = Math.floor((now.getTime() - t) / 36e5); return h < 1 ? '1 小时内核对过' : h < 48 ? `${h} 小时前核对` : `${Math.floor(h / 24)} 天前核对`; };
const todoId = (x) => 'todo-' + String(x.id || '').replace(/[^\w-]/g, '');

// 卡片上的题：后端 questions（[{id, text, options, note}]）；旧条目只有一组 options 时当成一道题
const questionsOf = (x, r) => {
  const qs = Array.isArray(x.questions) ? x.questions.map((q, i) => (q && typeof q === 'object' ? {
    id: String(q.id || 'q' + (i + 1)), text: String(q.text || ''), note: q.note === true,
    options: (Array.isArray(q.options) ? q.options : []).map((o) => (typeof o === 'string' ? o : o && (o.text || o.label)) || '').filter(Boolean),
  } : null)).filter((q) => q && q.options.length) : [];
  return qs.length ? qs : r.options.length ? [{ id: 'q1', text: '', note: false, options: r.options.map((o) => o.text) }] : [];
};
const DECIDE = ['decide', 'decision', 'choose'];
const isBlank = (s) => !s || /^\s*(待补|待补充|暂无|无)(说明)?[。\s]*$/.test(String(s));
// 各类卡共用精简首行：标题、原因、按钮；步骤、后果和确认内容完整保存在“怎么办”里。
const CONFIRM = { message: '发消息', publish: '对外发布', payment: '花钱', delete_unique: '删除唯一的数据' };
// 确认卡写清发给谁、发什么、花多少或删什么（后端 confirmation 对象）
const CONFIRM_KEYS = [['to', '发给'], ['content', '发什么'], ['amount', '花多少'], ['target', '删什么']];
const isQuestion = (x) => ['question', 'ai_wait'].includes(x.card_type) || (!x.card_type && DECIDE.includes(x.ask_kind));
const whereOf = (r) => (r.mobile ? MOBILE[r.mobile.kind] : r.where === 'phone' ? '手机上能办' : r.where === 'pc' ? '得在电脑前办' : '');
const dueOf = (r) => (r.dueText ? `<span class="${r.urgent ? 'is-urgent' : ''}">${r.overdue ? '已过期限 ' + esc(r.dueText) : esc(r.dueText) + (r.hasDue ? ' 前' : '')}</span>` : '');
// 选项只是说明；选择和确认都由本人复制到对话里表达，不在网页提交答案。
const optionsText = (x, r) => {
  let qs = questionsFor(x);
  if (!qs.length && r) qs = questionsOf(x, r).map((q) => ({ ...q, options: q.options.map((text) => ({ text })) }));
  return qs.map((q) => `<div class="cp-q">${q.text ? `<p class="cp-q-k">${esc(q.text)}</p>` : ''}<ul class="cp-oa-opts is-text">${q.options.map((o) => `<li><b>${esc(o.text)}${o.rec ? ' · AI 建议（只是说明，不能点）' : ''}</b>${o.detail ? `<span class="cp-oa-detail">${esc(o.detail)}</span>` : ''}</li>`).join('')}</ul></div>`).join('');
};
function ownerCard(x, r, ctx) {
  const kind = CONFIRM[x.confirmation_kind] || (x.card_type === 'confirm' ? '要你点头' : '');
  const conf = x.confirmation && typeof x.confirmation === 'object' ? CONFIRM_KEYS.filter(([k]) => typeof x.confirmation[k] === 'string' && x.confirmation[k].trim()).map(([k, l]) => [l, x.confirmation[k].trim()]) : [];
  const why = isBlank(x.why_you) ? '' : plain(String(x.why_you).trim().replace(/[。\s]+$/, '')), cons = x.consequence || x.action?.consequence;
  const s2 = [why ? `<b>为什么是你</b>${esc(why)}。` : '', isBlank(cons) ? '' : `<b>${isQuestion(x) ? '不回会怎样' : '不做会怎样'}</b>${esc(plain(String(cons).trim().replace(/[。\s]+$/, '')))}。`].join('');
  const due = dueOf(r);
  const how = [whereOf(r), r.minutes].filter(Boolean).map(esc).concat(due ? [due] : []).join('，');
  const steps = r.steps.length > 1 ? `<ol class="cp-steps">${r.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>` : '';
  const doText = r.steps.length === 1 ? r.steps[0] : r.body;
  const far = r.path || (typeof x.report_title === 'string' && x.report_title) ? '<span class="cp-own-path">详细说明在电脑上</span>' : '';
  const s3 = (doText || how || steps ? `<p class="cp-own-s"><b>怎么办</b>${esc(String(doText || '').replace(/[。\s]+$/, ''))}${doText && how ? '。' : ''}${how ? `<span class="cp-own-how">${how}</span>` : ''}${far}</p>${steps}` : '')
    + (r.done ? `<p class="cp-own-done">${esc(r.done)}</p>` : '');
  const href = https(x.action?.href || x.href);
  const go = href ? `<a class="cp-btn" href="${esc(href)}" target="_blank" rel="noopener noreferrer">去办 →</a>` : '';
  const og = openGroup(x, ctx.viewer), waiting = x.card_type === 'ai_wait';
  const late = (r.overdue || String(x.overdue_text || '').trim()) && !r.urgent ? '过了原定时间，但不急' : '';
  const brief = [why, late].filter(Boolean).join(' · ');
  const source = waiting ? [x.conversation_title ? `「${x.conversation_title}」那个对话` : '', x.asked_at ? `${when(x.asked_at, ctx.now)} 问的` : ''].filter(Boolean).join(' · ') : '';
  const meta = [x.at ? '登记于 ' + when(x.at, ctx.now) : '', Number.isFinite(x.asked_count) ? `问过你 ${x.asked_count} 次` : '', x.last_checked_at ? '最后核对 ' + when(x.last_checked_at, ctx.now) : '', x.project ? '项目：' + x.project : ''].filter(Boolean);
  return `<article class="cp-ask is-own${r.red ? ' is-urgent' : ''}${kind ? ' is-confirm' : ''} ct-card${actCls(x, ctx)}" id="${esc(todoId(x))}"${itemAttr(x)}>`
    + `<div class="cp-ask-main"><h3 class="cp-ask-title">${dot(r.scheduled ? 'neutral' : r.red ? 'red' : 'attention')}<span>${esc(r.head)}${ownTag(x)}</span></h3>${brief ? `<p class="cp-ask-why">${esc(brief)}</p>` : ''}</div>`
    + ownerBox(x, ctx, { card: true, extra: go + og })
    + `<details class="cp-ask-details" id="${esc(todoId(x))}-details"><summary>怎么办${r.steps.length ? `（${r.steps.length} 步）` : ''} ›</summary>`
    + (source ? `<p class="cp-wait-src">${esc(source)}</p>` : '')
    + (waiting && typeof x.progress === 'string' && x.progress.trim() ? `<p class="cp-own-s"><b>它做到哪</b>${esc(plain(x.progress))}</p>` : '')
    + (kind ? `<p class="cp-own-kind">要你确认 · ${kind}</p>` : '') + detail(x) + lateTag(x)
    + (conf.length ? `<dl class="cp-own-conf">${conf.map(([k, val]) => `<div><dt>${k}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl>` : '')
    + optionsText(x, r) + (s2 ? `<p class="cp-own-s">${s2}</p>` : '') + s3
    + (meta.length ? `<p class="cp-meta">${meta.map(esc).join(' · ')}</p>` : '') + `</details></article>`;
}
// ---- 卡上的“打开”组（后端条目和“AI 正在跑”行上的 open；没有这个字段就一个都不画）----
// 打开对话：这台就是对话所在的那台电脑（viewer.device_machine 等于 open.conversation.machine），直接链到 claude:// 或 codex://，
// Chrome 第一次会问一次要不要打开；不是这台（另一台电脑、手机）就“在主驾驶上打开”，让那台电脑打开（POST open）。
// 看汇报：网页里右侧抽屉（client.js），汇报页放进不同源的沙箱里。打开登记的文件夹、文件：让主驾驶打开。
// 这些都不改条目状态、不撤回；作为 ownerBox 的 extra 和复制放在同一行。
const APP_LINK = /^(?:claude|codex):\/\/[\w./?=&%:-]+$/;
export function openGroup(x, viewer) {
  if (viewer?.kind !== 'owner') return '';
  const o = x?.open;
  if (!o || typeof o !== 'object' || Array.isArray(o) || typeof x.id !== 'string' || !x.id) return '';
  const cap = new Set(viewer?.capabilities || []), phone = viewer?.device_kind === 'phone', me = viewer?.device_machine || '';
  const c = o.conversation && typeof o.conversation === 'object' ? o.conversation : null;
  const targets = (Array.isArray(o.targets) ? o.targets : []).filter((t) => t && typeof t.key === 'string' && /^(conversation|report|path:[0-4])$/.test(t.key) && typeof t.label === 'string' && t.label.trim()).slice(0, 7);
  const isConv = (t) => t.key === 'conversation';
  // 只有 open.report 为 true 的才有“看汇报”（在这台设备的抽屉里看）；有了它，“在主驾驶上打开汇报页”就不再重复列
  const drawer = o.report === true && cap.has('report');
  const there = c && typeof c.machine === 'string' && c.machine.trim() ? c.machine.trim() : '主驾驶';
  const remote = (t, label) => `<button type="button" class="cp-open-b ct-inline-action" data-open-item="${esc(x.id)}" data-open-target="${esc(t.key)}">${esc(label)}</button>`;
  const bits = [];
  if (c) {
    const url = typeof c.url === 'string' && APP_LINK.test(c.url) ? c.url : '';
    const conv = targets.find(isConv);
    if (!phone && url && me && c.machine === me) bits.push(`<a class="cp-open-a ct-inline-action" href="${esc(url)}">打开对话 ↗</a>`);
    else if (cap.has('open') && conv) bits.push(remote(conv, `在${there}上打开对话`));
  }
  if (drawer) bits.push(`<button type="button" class="cp-open-b ct-inline-action" data-report="${esc(x.id)}">看汇报</button>`);
  if (cap.has('open')) for (const t of targets.filter((t) => !isConv(t) && !(drawer && t.key === 'report'))) bits.push(remote(t, (me === '主驾驶' ? '' : '在主驾驶上') + t.label.trim().slice(0, 40)));
  return bits.length ? `<span class="cp-open${phone ? ' is-phone' : ''}" role="group" aria-label="打开">${bits.join('')}</span>` : '';
}
function askCard(x, r, ctx) {
  if (isPh(x)) return `<article class="cp-ask is-private ct-card" id="${esc(todoId(x))}"${itemAttr(x)}><div class="cp-ask-main"><h3 class="cp-ask-title" title="${PH_HINT}">${dot('unavailable')}<span>${esc(x.title || PRIVATE_TITLE)}</span></h3><p class="cp-ask-why">${PH_TODO}</p></div></article>`;
  return ownerCard(x, r, ctx);
}
// 后端偶尔给的是内部代号（如 checkpoint_overdue）：认得的换成人话，认不得的不显示
// 后三个是账本“晚了”的原因（后端 cockpit_followup）；晚了那一行自己的话已经说清时不再重复
const STUCK_CODES = { checkpoint_overdue: '已超过约定的检查时间，还没收到进展', no_progress_7d: '已超过 7 天没有进展记录',
  original_deadline_overdue: '过了原定的日子还没办完', undated_wake_condition: '等的条件没定日子，AI 在补期限', ai_decision_due: '跟得久了还没结果，等 AI 定下一步' };
const LATE_CODES = ['original_deadline_overdue', 'undated_wake_condition', 'ai_decision_due'];
const stuckWhy = (s) => (!s ? '' : /^[a-z][a-z0-9_]*$/.test(s) ? STUCK_CODES[s] || '' : s);
// 进展：后端投影的是 progress（字符串或 {text}），旧数据叫 latest_progress
const progressOf = (x) => String((typeof x.progress === 'string' ? x.progress : x.progress?.text) || x.latest_progress || '').trim();
// AI 在跟（二级页“AI 的账本”）：晚了的一行一条（晚得最多的在前），其余收起，每条可复制。
// 写给本人看的话：“满 14 天待 AI 定”→“跟了 16 天还没结果，AI 这周要么定期限修好，要么结束”；
// 没写清要办什么的不列：空标题、只写了项目名、“还没写清要办什么”“说明还不全”这类占位标题
const bare = (x) => { const t = clean(x.title); return (!isPh(x) && (!t || t === x.project)) || /还没写清要办什么|说明还不全/.test(t); };
// 日期写“10 月 30 日”，不是今年的带年份（“2027 年 9 月 6 日”）；北京时间
const bjParts = (v) => { const t = Date.parse(v || ''); if (!Number.isFinite(t)) return null; const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(new Date(t)).map((x) => [x.type, x.value])); return { y: +p.year, m: +p.month, d: +p.day, t }; };
const thisYear = (now) => bjParts(now.toISOString()).y;
export const dayText = (v, now) => { const p = bjParts(v); return p ? `${p.y !== thisYear(now) ? p.y + ' 年 ' : ''}${p.m} 月 ${p.d} 日` : ''; };
// 账本一行“该有结果的日子”：AI 新定的期限（decision_due_at）优先，原来的日子放小字；其次原定日子、排期、截止、检查点；都没有就是 null
export function ledgerDue(x, now) {
  const orig = x.overdue_since || x.scheduled_at || x.scheduled_for || x.due_at || x.checkpoint_at || '';
  const p = bjParts(orig), sched = String(x.scheduled_text || '').trim();
  const origText = sched && !x.overdue_since ? (p && p.y !== thisYear(now) && !/年/.test(sched) ? sched.replace(/^(约\s*)?/, `$1${p.y} 年 `) : sched) : dayText(orig, now);
  const dec = bjParts(x.decision_due_at);
  if (dec) return { text: dayText(x.decision_due_at, now), old: origText && origText !== dayText(x.decision_due_at, now) ? `原定 ${origText}` : '', at: dec.t };
  return origText ? { text: origText, old: '', at: p ? p.t : null } : null;
}
// 公开版：标题完全一样的私人占位行合成一行，后面写“另有 N 件同类事（私人事项）”
const mergePh = (list) => {
  const out = [], seen = new Map();
  for (const x of list) {
    const k = isPh(x) ? String(x.title || PRIVATE_TITLE) : null, e = k != null && seen.get(k);
    if (e) { e.more += 1; continue; }
    const row = { x, more: 0 };
    if (k != null) seen.set(k, row);
    out.push(row);
  }
  return out;
};
const moreText = (n) => (n ? `<small class="cp-ph-more">另有 ${n} 件同类事（私人事项）</small>` : '');
// 晚了的按晚了几天从多到少排；没有天数的（满 14 天待定、没定日子）排后面，再按跟了多久
const ageOf = (x) => (x.registration_unknown ? 14 : Number.isFinite(x.age_days) ? x.age_days : -1);
const lateDays = (x) => (Number.isFinite(Number(x.overdue_days)) && x.overdue_days !== null ? Number(x.overdue_days) : -1);
const byLate = (a, b) => lateDays(b) - lateDays(a) || ageOf(b) - ageOf(a);
const ledgerBox = (x, ctx) => ownerBox(x, ctx, { extra: openGroup(x, ctx.viewer) });
// 还在跟、AI 已经定了怎么办的（后端 decision_summary：“{标题}：在 11 月 5 日前处理好；{技术依据}”）：写“AI 定了：在 11 月 5 日前处理好”，依据收进“技术细节”
export const decisionOf = (x) => {
  let s = typeof x?.decision_summary === 'string' ? x.decision_summary.trim() : '';
  if (!s || isPh(x)) return null;
  const t = String(x.title || '').trim();
  if (t && s.startsWith(t)) s = s.slice(t.length).replace(/^\s*[：:]\s*/, '');
  const i = s.search(/[；;]/);
  const what = (i > 0 ? s.slice(0, i) : s).trim().replace(/[。\s]+$/, '');
  return what ? { what, basis: i > 0 ? s.slice(i + 1).trim().replace(/[。\s]+$/, '') : '' } : null;
};
const decLine = (x, pre) => {
  const d = decisionOf(x);
  if (!d) return '';
  const id = `${pre}-${String(x.id || '').replace(/[^\w-]/g, '')}`;
  return `<div class="cp-ai-dec"><span>AI 定了：${esc(d.what)}</span>${d.basis ? `<details class="cp-tech" id="${esc(id)}"><summary>技术细节</summary><p>${esc(d.basis)}</p></details>` : ''}</div>`;
};
// 账本件数（筛选按钮、总句、首页“AI 手上 N 件”同一个数）：合成一行的同类私人事项、说明还没写全不单列的照样计数，
// 列表末尾写一行“另有 N 件没单列（……）”
function ledgerRows(v) {
  const lateAll = v.ai_overdue ? [...v.ai_overdue] : v.ai_following.filter((x) => x.stuck === true);
  const lateIds = new Set(lateAll.map((x) => x.id));
  const restAll = v.ai_following.filter((x) => !lateIds.has(x.id));
  const late = mergePh(lateAll.filter((x) => !bare(x)).sort(byLate)), rest = mergePh(restAll.filter((x) => !bare(x)));
  return { lateAll, restAll, late, rest, merged: [...late, ...rest].reduce((s, e) => s + e.more, 0), blank: [...lateAll, ...restAll].filter(bare).length };
}
const unlisted = (r, cls) => (r.merged || r.blank ? `<p class="${cls}">另有 ${r.merged + r.blank} 件没单列（${[r.merged ? `${r.merged} 件同类私人事项，合在上面同名那行` : '', r.blank ? `${r.blank} 件说明还没写全，AI 会补上` : ''].filter(Boolean).join('；')}）</p>` : '');
function aiFollowing(v, ctx) {
  const now = ctx.now;
  const row = ({ x, more }, small) => `<li${liCls(x, ctx)}${itemAttr(x)}>${rowText(x, plain(clean(x.title) || x.project), esc(small))}${moreText(more)}${decLine(x, 'decl')}${ledgerBox(x, ctx)}</li>`;
  if (v.ai_overdue) {
    const lr = ledgerRows(v), late = lr.lateAll;
    const lines = lr.late.map((e) => {
      const x = e.x, at = x.overdue_since ? dayText(x.overdue_since, now) : '';
      const d = Number(x.overdue_days), days = x.registration_unknown ? 14 : Number.isFinite(x.age_days) ? x.age_days : null;
      const why = x.awaiting_ai_decision ? `跟了 ${days ?? 14} 天还没结果，AI 这周要么定期限修好，要么结束` : at ? `原定 ${at}${d >= 1 ? `，晚了 ${d} 天` : '，刚过不到 1 天'}` : '没写哪天该有结果，AI 在补上期限';
      return row(e, [why, plain(progressOf(x) || (LATE_CODES.includes(x.stuck_reason) ? '' : stuckWhy(x.stuck_reason)))].filter(Boolean).join(' · '));
    }).join('');
    const rest = lr.restAll;
    // 其余的分两类说：有日子还没到的、根本没定日子的（不把没定日子的说成“还没到日子”）
    const dated = rest.filter((x) => ledgerDue(x, now)).length, undated = rest.length - dated;
    const restSum = `其余 ${rest.length} 件` + (undated ? `：${[dated ? `${dated} 件还没到日子` : '', `${undated} 件没定日子`].filter(Boolean).join('、')}` : '还没到日子');
    const restRow = (e) => { const due = ledgerDue(e.x, now); return row(e, [due ? `期限 ${due.text}${due.old ? `（${due.old}）` : ''}` : '没定日子', e.x.last_checked_at ? checkedAgo(e.x.last_checked_at, now) : ''].filter(Boolean).join(' · ')); };
    const restList = rest.length ? `<details class="cp-more" id="ai-rest"><summary>${restSum}</summary><ul class="cp-ailist">${lr.rest.map(restRow).join('')}</ul></details>` : '';
    return `<div class="cp-ai" id="ai">${late.length ? `<p class="cp-ai-cap">${dot('neutral')}AI 自己有 ${late.length} 件晚了，在补（不用你管）</p><ul class="cp-ailist">${lines}</ul>` : `<p class="cp-line">${dot('ok')}AI 自己的活都没晚。</p>`}${restList}${unlisted(lr, 'cp-ai-more')}</div>`;
  }
  const rows = v.ai_following.filter((x) => !bare(x)).map((x) => {
    const title = clean(x.title);
    const cp = /检查点\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})/.exec(x.title || '');
    const cpAt = cp ? BJ(cp[1]) : NaN;
    const passed = Number.isFinite(cpAt) && cpAt < now.getTime();
    const h = x.handler && typeof x.handler === 'object' ? x.handler : null;
    const stuck = x.stuck === true || h?.stuck === true || passed;
    const why = stuckWhy(x.stuck_reason) || (passed ? `约定 ${dateHm(new Date(cpAt).toISOString())} 检查，已超过 ${Math.max(1, Math.round((now.getTime() - cpAt) / 36e5))} 小时还没收到进展` : '');
    const state = stuck ? 'stuck' : h?.kind === 'running' ? 'running' : h?.kind === 'queued' ? 'queued' : h?.kind === 'none' ? 'none' : 'wait';
    return { x, title: passed ? title.replace(/[；;]\s*下一个检查点[^；;]*$/, '') : title, why, state, h };
  });
  if (!rows.length) return `<p class="cp-line" id="ai">${dot('ok')}AI 现在手上没有自己的活。</p>`;
  const line = (r) => `<li class="is-${r.state}${phCls(r.x)}${actCls(r.x, ctx)}"${itemAttr(r.x)}>${rowText(r.x, plain(r.title), [r.why, r.h?.task ? `由“${r.h.task}”在办` : '', r.h?.next_run_at ? '下次 ' + dateHm(r.h.next_run_at) : '', r.x.last_checked_at ? checkedAgo(r.x.last_checked_at, now) : '还没核对过'].filter(Boolean).map(esc).join(' · '))}${ledgerBox(r.x, ctx)}</li>`;
  const stuck = rows.filter((r) => r.state === 'stuck'), rest = rows.filter((r) => r.state !== 'stuck');
  return `<div class="cp-ai" id="ai">${stuck.length ? `<p class="cp-ai-cap">${dot('neutral')}AI 自己有 ${stuck.length} 件超过约定的检查时间，在补（不用你管）</p><ul class="cp-ailist">${stuck.map(line).join('')}</ul>` : ''}`
    + (rest.length ? `<details class="cp-more" id="ai-rest"><summary>其余 ${rest.length} 件还没到约定日子</summary><ul class="cp-ailist">${rest.map(line).join('')}</ul></details>` : '') + `</div>`;
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
  const nums = [['修好', c.fixed], ['关掉', c.closed], ['转暂缓', c.deferred], ['还在跟', c.following], ['待你办', c.need_you]].filter(([, n]) => nOf(n) != null);
  const at = r.started_at || r.ended_at, next = r.next_run_at || g.next_run_at;
  // 本周这一轮还没开始、正在跑、读不到（后端 phase）时，和上次的结果并列写，不让上次的结果冒充这周
  const s = ['not_started', 'running', 'unavailable'].includes(g.phase) ? govState(v, ctx.now) : null;
  const now1 = s ? `<p class="cp-gov-line">${dot(s.state === 'failed' ? 'unavailable' : s.state === 'running' ? 'neutral' : 'ok')}<span class="cp-gov-text">本周 AI 体检：${esc(s.state === 'failed' ? '读不到' : s.text.replace(/^这周/, ''))}${next && s.state !== 'running' ? ` · 下次 ${esc(dateHm(next))}` : ''}</span></p>` : '';
  const head = `上次 AI 体检${at ? `（${dateHm(at)}）` : ''}记录：` + (nums.length ? '当时' + nums.map(([k, n]) => `${k} ${n}`).join('、') + ' 件' : esc(r.summary || '跑完了'));
  const sub = (key, label, items, note) => (items.length ? `<details class="cp-more cp-gov-more" id="${key}"><summary>${label} ${items.length} 件</summary><ul class="cp-ailist">${items.map((x) => `<li${liCls(x, ctx)}>${rowText(x, x.title, x[note] ? esc(x[note]) : '')}${ownerBox(x, ctx)}</li>`).join('')}</ul></details>` : '');
  return `<div class="cp-gov">${now1}<p class="cp-gov-line">${dot('neutral')}<span class="cp-gov-text">${head}${next && !now1 ? ` · 下次 ${esc(dateHm(next))}` : ''}</span></p>`
    + (acts.length ? `<details class="cp-more cp-gov-more" id="gov-actions"><summary>当时留下的说明 ${acts.length} 条</summary><p>这是上次体检的记录；现在要办的事以上面的当前待办为准。</p><ul class="cp-gov-acts">${acts.map((x) => `<li${liCls(x, ctx)}>${rowText(x, plain(x.title))}${ownerBox(x, ctx)}</li>`).join('')}</ul></details>` : '')
    + sub('gov-closed', '那次自动关掉', closed, 'evidence') + sub('gov-deferred', '那次新转暂缓', deferred, 'reason') + `</div>`;
}
// 项目后台进展（ai_work）：已接入的后台任务、留下没合并的分支；后端没给这块就不出
function aiWork(v, ctx) {
  const items = v.ai_work?.items || [];
  if (!items.length) return '';
  const run = items.filter((p) => nOf(p.running_automations) > 0), tasks = items.filter((p) => nOf(p.running_tasks) > 0);
  const taskGap = items.some((p) => nOf(p.running_tasks) == null), runGap = items.some((p) => nOf(p.running_automations) == null);
  const branches = items.filter((p) => Number(p.unmerged_branches) > 0), nb = branches.reduce((n, p) => n + Number(p.unmerged_branches), 0);
  const names = (list, k) => list.map((p) => `${p.project}${k === 'running_tasks' && p.running_tasks_basis === 'confirmed_minimum' ? ` 至少${p[k]}个` : Number(p[k]) > 1 ? ` ${p[k]} 个` : ''}`).join('、');
  const bits = [
    tasks.length ? `已读到的 AI 后台任务：${names(tasks, 'running_tasks')}${taskGap ? '；另有项目状态未读到' : ''}` : taskGap ? '部分项目的 AI 后台任务状态暂时读不到' : '已接入的 AI 后台任务当前未运行',
    run.length ? `已读到的自动任务：${names(run, 'running_automations')}${runGap ? '；另有项目状态未读到' : ''}` : runGap ? '部分项目的自动任务状态暂时读不到' : '已登记项目没有正在运行的自动任务',
    nb ? `代码分支记录：${branches.length} 个项目共 ${nb} 条未合入主版本；需逐项核对用途后，才能判断哪些要处理。` : '',
  ].filter(Boolean);
  return `<div class="cp-aiwork"><b>项目后台进展</b><small>这里只统计已接入的后台任务，不代表所有 AI 聊天。</small><ul>${bits.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>${v.ai_work.observed_at ? `<small>${esc(when(v.ai_work.observed_at, ctx.now))} 读到</small>` : ''}</div>`;
}

// 要你做／要你回（首屏）：只放要你动手的卡。“AI 在等你回”单独一组“AI 在等你回话”；确认卡、要你动手、要你拍板各一组。
// AI 在跟、暂缓、排了日子的不在这里（前两样去“AI 的账本”和“你放着 N 件不急的事”）
const groupOf = (x) => (x.card_type === 'ai_wait' ? 'wait' : x.card_type === 'confirm' || CONFIRM[x.confirmation_kind] ? 'confirm'
  : x.card_type === 'question' || (!x.card_type && DECIDE.includes(x.ask_kind)) ? 'decide' : 'do');
const NEED_GROUPS = [['wait', 'AI 在等你回话'], ['confirm', '要你确认'], ['do', '要你动手'], ['decide', '要你拍板']];
// ---- 电脑版（宽度 ≥1200）左栏“要你做 N 件”队列 ----
// 每件一行：类型、对话名或事、问题（放不下省略）、几点问的或期限；默认第一件展开，点哪行展开哪件，同时只展开一件（记在 act.ui 的 Q_KEY）。
// “一行一件 / 全部展开”记在这台浏览器（client.js），1700 宽以上默认全部展开、两列。
// 收起的行最多一个按钮，而且只给“AI 在等你回”的 AI 建议（点了直接交，照常可撤回）；确认卡、动手卡的行上永远不放一点就办的按钮。
// 窄屏（<1200）这些行和“要你做 N 件”都不出（cockpit.css），卡片照第三步的样子
export const Q_KEY = '\u0000queue';
const Q_TAG = { wait: '等你回', confirm: '要你确认', do: '要你动手', decide: '要你拍板' };
function qRow(x, r, ctx, kind, open) {
  const title = kind === 'wait' ? waitTitle(x) : r.head;
  const src = !vagueWait(x) && typeof x.conversation_title === 'string' && x.conversation_title.trim() ? `「${x.conversation_title.trim()}」` : '';
  const at = kind === 'wait' && x.asked_at ? `${when(x.asked_at, ctx.now)} 问的` : r.dueText ? (r.overdue ? '已过期限 ' + r.dueText : r.dueText + (r.hasDue ? ' 前' : '')) : '';
  return `<div class="cp-q-row is-${kind}${r.red ? ' is-urgent' : ''}" data-q-open="${esc(x.id)}" role="button" tabindex="0" aria-expanded="${open}">`
    + `<span class="cp-q-tag is-${kind}">${Q_TAG[kind]}</span>`
    + `<span class="cp-q-text">${src ? `<b class="cp-q-src">${esc(src)}</b>` : ''}<span class="cp-q-title">${esc(title)}</span></span>`
    + (at ? `<small class="cp-q-at${r.red ? ' is-urgent' : ''}">${esc(at)}</small>` : '') + `</div>`;
}
export function needCards(v, ctx) {
  const { all, n } = ownerNow(v, ctx.now, ctx);
  const cx = { ...ctx, viewer: v.viewer };
  // 别的页面链到 #pending，没事可做时也留着这个位置标记（整块仍按 cockpit.css 收起）
  if (!all.some((i) => !actCls(i.x, cx))) return anchor('pending') + (v.ok ? '' : `<p class="cp-empty">${dot('unavailable')}${notRead(v.served_at, ctx.now)}</p>`);
  const order = NEED_GROUPS.flatMap(([k]) => all.filter((i) => groupOf(i.x) === k)).filter((i) => !isPh(i.x) && typeof i.x.id === 'string' && i.x.id);
  // 展开哪件：点过的那件；还没点过（或那件已经办完不在了）就是第一件；点了“收起”是一件都不展开
  const want = ctx.act?.ui?.get(Q_KEY)?.open;
  const openId = typeof want === 'string' && (want === '' || order.some((i) => i.x.id === want)) ? want : order[0]?.x.id || '';
  // 能收成一行的超过两件才给“一行一件 / 全部展开”（只有一两件、或都是私人占位行时没得切）
  const modes = order.length > 2 ? `<span class="cp-q-modes" role="group" aria-label="怎么排"><button type="button" class="cp-q-mode" data-q-mode="rows" aria-pressed="false">一行一件</button><button type="button" class="cp-q-mode" data-q-mode="all" aria-pressed="false">全部展开</button></span>` : '';
  const head = blockHead(`要你做 <b>${n}</b> 件`, 'cp-q-head', modes, 'cp-q-n');
  const wrap = (i, k) => {
    const x = i.x, card = askCard(x, i.r, cx);
    if (!order.includes(i)) return `<div class="cp-q is-open">${card}</div>`;
    // 能收成一行的只有一两件：都展开（电脑上并排），不收成一行一件
    const open = ctx.act?.ui?.get(Q_KEY)?.mode !== 'rows' || x.id === openId || order.length <= 2;
    return `<div class="cp-q${open ? ' is-open' : ''}${actCls(x, ctx)}" data-q="${esc(x.id)}">${qRow(x, i.r, ctx, k, open)}${card}</div>`;
  };
  const few = all.length <= 2 ? `<span class="cp-q-few${all.length === 1 ? ' is-one' : ''}" hidden></span>` : '';
  return anchor('pending') + head + few + NEED_GROUPS.map(([k, title]) => {
    const list = all.filter((i) => groupOf(i.x) === k);
    return list.length ? `<h3 class="cp-sub cp-need-k">${title}</h3><div class="cp-todos">${list.map((i) => wrap(i, k)).join('')}</div>` : '';
  }).join('');
}
// 你放着的不急的事（暂缓里你的那几件 + 排了日子的）：一行一条，写人话的“到什么时候再做”。AI 等条件的那几件去“AI 的账本”
const waitWhen = (x) => {
  const why = plain(String(x.deferred_reason || x.reason || '').trim());
  const m = /^(?:按登记条件暂缓|等到这个时候再办)[：:]\s*(?:随时[：:]\s*)?(?:等到?)?(.+?)[。\s]*$/.exec(why);
  if (!m) return /^还没写清/.test(why) ? '' : why.replace(/[。\s]+$/, '');
  // 只取第一小句；末尾括号里的小字（约几分钟）挪到后面
  const c = m[1].split(/[；;。]/)[0].trim(), core = c.replace(/\s*（[^（）]*）$/, ''), paren = c.slice(core.length).trim();
  if (/(再做|再办|再提醒|再说)$/.test(core)) return c;
  return /(时|后|前|以后|之后)$/.test(core) ? `${core}再做${paren}` : c;
};
const mineOf = (v) => { const own = v.deferred.filter((x) => x.action_owner === 'user'); return own.length || v.deferred.some((x) => x.action_owner) ? own : v.deferred; };
const theirsOf = (v) => v.deferred.filter((x) => x.action_owner && x.action_owner !== 'user');
// 排了日子的：后端 scheduled_text（“约 11 月 20 日”，旧数据叫 schedule_text）；没有再按日期算（以前只读 scheduled_for、due_at，日期会空）
const schedText = (x) => String(x.scheduled_text || x.schedule_text || '').trim() || monthDay(x.scheduled_at || x.scheduled_for || x.due_at);
const waitRow = (x, ctx, only = null) => `<li${liCls(x, ctx)}${itemAttr(x)}>${rowText(x, plain(clean(x.title) || x.project || ''), esc(waitWhen(x)))}${ownerBox(x, ctx, { only })}</li>`;
function schedRow(x, ctx) {
  const r = readTodo(x, ctx.now), at = schedText(x);
  const head = r.head.replace(/^\s*(?:\d{1,2}\s*月\s*\d{1,2}\s*日(?:\s*[（(]周.[)）])?\s*[：:]|\d{1,2}\/\d{1,2}\s+)\s*/, '') || r.head;
  return `<li${liCls(x, ctx)}${itemAttr(x)}>${rowText(x, head, at ? esc(`排在${/^约/.test(at) ? '' : ' '}${at}`) : '')}${ownerBox(x, ctx)}</li>`;
}

// 电脑：约 12 张同样子的卡（本人 10-31 选定 A 版网格）：数据卡宽屏一行 3 张，最后一排是 Grafana 三张链接卡。
// 大数字只从现有原句里取，取不到就写状态词、原句照旧写在下面，不编数字；长句收进卡内“详情 ›”
const WORD = { green: '正常', neutral: 'AI 在管', yellow: '要留意', red: '要你看', gray: '读不到' };
const SIZE = String.raw`(\d+(?:\.\d+)?\s*[KMGT]i?B)`;
const pick = (s, re) => (re.exec(s || '') || [])[1] || '';
const bigOf = (n, aside = '') => esc(n) + (aside ? ` <small>${esc(aside)}</small>` : '');
// 细进度条：处理器画占用，磁盘、套餐画“已用”（旁边写明已用多少）
const meter = (p, label, said = false) => `<p class="cp-meter"><progress max="100" value="${Math.round(Math.max(0, Math.min(100, p)))}" aria-label="${esc(label)}"></progress>${said ? `<small>${esc(label)}</small>` : ''}</p>`;
const TILE = {
  computer_health: (t) => { const p = pick(t, /(\d+(?:\.\d+)?)\s*%/); return p && { big: bigOf(p + '%', pick(t, /(-?\d+(?:\.\d+)?\s*℃)/)), bar: meter(+p, `处理器占用 ${p}%`), more: false }; },
  system_resources: (t, st) => st === 'ok' && /^[^。；]*正常。?$/.test(t) && { big: '正常', more: false },
  disk_space: (t) => { const m = new RegExp(`([A-Z])\\s*盘还剩\\s*${SIZE}\\s*[（(]\\s*(\\d+(?:\\.\\d+)?)%`).exec(t); return m && { big: esc(m[2]), sub: esc(`${m[1]} 盘还剩 ${m[3]}%`), bar: meter(100 - m[3], `已用 ${Math.round(100 - m[3])}%`, true), more: false }; },
  proxy_traffic: (t) => { const d = pick(t, new RegExp(`今天(?:上网)?\\s*${SIZE}`)), h = pick(t, new RegExp(`近\\s*60\\s*分钟\\s*${SIZE}`)); return d && { big: esc(d), sub: esc(['今天上网', h && `近 60 分钟 ${h}`, pick(t, /(没超提醒线|超过提醒线)/)].filter(Boolean).join(' · ')) }; },
  traffic: (t) => { const m = /已用\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*([KMGT]i?B)/.exec(t), left = pick(t, new RegExp(`剩余?\\s*${SIZE}`)); return m && left && { big: bigOf(left, '剩余'), sub: esc(`套餐已用 ${m[1]}/${m[2]} ${m[3]}`), bar: meter(m[1] / m[2] * 100, `已用 ${Math.round(m[1] / m[2] * 100)}%`, true) }; },
  temp_reclaim: (t) => { const n = pick(t, new RegExp(`约\\s*${SIZE}`)), m = /^(今天|昨天)?\s*(\d{1,2}:\d{2})\s*把\s*(\d+)\s*个/.exec(t); return n && { big: esc(n), sub: m ? esc(`${m[1] || ''} ${m[2]} 放进回收站 ${m[3]} 个`.trim()) : '' }; },
  remote: (t) => { const [a, ...rest] = t.replace(/[。.\s]+$/, '').split(/[；;]/), w = ['能连上', '连不上', '在线', '离线'].find((x) => a.includes(x)); return w && a.length <= 8 && { big: w, sub: esc(rest.map((x) => x.trim()).filter(Boolean).join(' · ')), more: false }; },
};
const tileOf = (c, now, off, pageAt, extra = {}) => {
  const st = off ? 'unavailable' : cardState(c), missing = c.state === 'unavailable' || c.state === 'reading';
  const gap = c.observed_at ? ago(c.observed_at, now).replace(/^刚刚$/, '').replace(/前$/, '') : '';
  // 后端给了 missing_reason（是什么没读到、为什么、谁在管）就照写，不只写“还没读到”（本人 10-31 12:54：不知道何意）
  const why = typeof c.missing_reason === 'string' ? c.missing_reason.trim() : '';
  const t = missing ? { big: '读不到', sub: esc([why, c.observed_at ? `这是 ${when(c.observed_at, now)} 读到的，之后${gap ? ' ' + gap : ''}没读到新的` : why ? '' : '还没读到'].filter(Boolean).join('；')), more: false }
    : (TILE[c.id] || TILE[c.kind] || (() => null))(String(c.text || ''), cardState(c)) || { big: esc(WORD[light(st)]), sub: ['attention', 'red'].includes(st) ? '' : esc(factText(c)), more: false, who: false };
  return card(c, now, off, pageAt, { ...t, ...extra, sub: [t.sub, extra.sub].filter(Boolean).join(' · ') });
};
const GIB = (n) => (Number.isFinite(n) && n >= 0 ? `${+(n / 2 ** 30).toFixed(1)} GiB` : '');
const sizeOf = (x) => (!x ? '' : x.complete === true && Number.isFinite(x.bytes) ? GIB(x.bytes) : GIB(x.partial_bytes) && '至少 ' + GIB(x.partial_bytes));
// 存储采样（storage_pressure）：有类别、采样没过期才算读到；过期的算“数据停了”
const storageOf = (v, now) => {
  const sp = v.storage_pressure || {}, cats = (Array.isArray(sp.categories) ? sp.categories : []).filter((x) => x && typeof x === 'object');
  const age = now.getTime() - Date.parse(sp.observed_at || ''), fresh = age <= (Number(sp.max_age_seconds) > 0 ? sp.max_age_seconds * 1000 : 72e5);
  return { sp, cats, of: (id) => cats.find((x) => x.id === id), fresh };
};
const GO_STORAGE = (word) => `<a class="cp-tile-go" href="/cockpit/storage/">${word} ›</a>`;
// AI 临时文件：存储采样里的合计（ai_cache_total），没量全写“至少”；颜色只看这一项自己的 alert：空或“还没量全”都算正常，
// 超预算、一周增长超线才写“要留意”和是哪种；别的类别归“存储占用与增长”那张卡。整卡链到存储页
const AI_ALERT = { budget: '超过预算', weekly_growth: '一周增长超过提醒线' };
function aiCacheTile(v, now, off, pageAt) {
  const { sp, of, fresh } = storageOf(v, now), all = of('ai_cache_total'), size = sizeOf(all);
  const state = !size ? 'unavailable' : !fresh ? 'stale' : AI_ALERT[all.alert] ? 'attention' : 'ok';
  const c = { id: 'ai_cache_total', title: 'AI 临时文件', state, observed_at: sp.observed_at || null, text: AI_ALERT[all?.alert] ? `要留意：${AI_ALERT[all.alert]}` : '' };
  const sub = [GIB(all?.budget_bytes) && '预算 ' + GIB(all.budget_bytes), sizeOf(of('claude_temp')) && 'Claude ' + sizeOf(of('claude_temp')), sizeOf(of('codex_temp')) && 'Codex ' + sizeOf(of('codex_temp'))].filter(Boolean).join(' · ');
  return card(c, now, off, pageAt, state === 'unavailable' ? { big: '读不到', sub: '存储采样还没读到', more: false, go: GO_STORAGE('明细') } : { big: esc(size), sub: esc(sub), more: false, go: GO_STORAGE('明细') });
}
// 存储占用与增长：按 storage_pressure.state 上色（只有“还没量全”、没有超预算和增长超线的类别时算正常）。
// 直接写数字（本人 10-31 12:49：为什么存储不写几个数字就写超预算）：超预算的、一周增长超线的每项一条“名字 数字 线”，
// 最要紧的那条（超预算的先，超得最多的先）做大字，其余列在下面；单位和存储页一样用 GiB
const SP_STATE = { ok: 'ok', warn: 'attention', attention: 'attention', red: 'red', critical: 'red', error: 'red' };
const GI = (n) => { const g = n / 2 ** 30; return `${g >= 100 ? Math.round(g).toLocaleString('en-US') : +g.toFixed(1)} GiB`; };
const spName = (x) => String(x.label || x.id || '').replace(/整卷已用空间$/, '').replace(/^[A-Z]\s*盘当前用户\s*/, '');
function storageTile(v, now, off, pageAt) {
  const { sp, cats, fresh } = storageOf(v, now), ok = (n) => Number.isFinite(n) && n >= 0;
  const used = (x) => (x.complete !== false && ok(x.bytes) ? GI(x.bytes) : ok(x.partial_bytes) ? '至少 ' + GI(x.partial_bytes) : '');
  const over = cats.filter((x) => x.alert === 'budget').sort((a, b) => (b.bytes || 0) / (b.budget_bytes || 1) - (a.bytes || 0) / (a.budget_bytes || 1))
    .map((x) => ({ name: spName(x), val: used(x) || '超过预算', line: ok(x.budget_bytes) ? `预算 ${GI(x.budget_bytes)}` : '超过预算' }));
  const grow = cats.filter((x) => x.alert === 'weekly_growth').sort((a, b) => (b.weekly_growth_bytes || 0) - (a.weekly_growth_bytes || 0))
    .map((x) => ({ name: spName(x), val: ok(x.weekly_growth_bytes) ? `一周 +${GI(x.weekly_growth_bytes)}` : '一周增长偏快', line: [used(x) && `已用 ${used(x)}`, ok(x.growth_limit_bytes) && `提醒线一周 ${GI(x.growth_limit_bytes)}`].filter(Boolean).join(' · ') }));
  const items = [...over, ...grow], [top, ...more] = items;
  const state = !cats.length ? 'unavailable' : !fresh ? 'stale' : !items.length ? 'ok' : SP_STATE[sp.state] || 'attention';
  const c = { id: 'storage_pressure', title: '存储占用与增长', state, observed_at: sp.observed_at || null, text: items.map((x) => `${x.name} ${x.val}（${x.line}）`).join('；') };
  const go = GO_STORAGE('各类别和近一周变化');
  if (!cats.length) return card(c, now, off, pageAt, { big: '读不到', sub: '存储采样还没读到', more: false, go });
  if (!top) return card(c, now, off, pageAt, { big: '正常', sub: esc(`量了 ${cats.length} 类，都在预算和增长线以内`), more: false, go });
  const list = more.length ? `<ul class="cp-tile-rows">${more.map((x) => `<li><span>${esc(x.name)}</span><b>${esc(x.val)}</b>${x.line ? `<small>${esc(x.line)}</small>` : ''}</li>`).join('')}</ul>` : '';
  return card(c, now, off, pageAt, { big: bigOf(top.val, top.name), sub: esc(top.line), list, fold: true, more: false, go });
}
const linkCard = (href, title, sub, cls = '') => `<a class="cp-link-card ct-card${cls}" href="${esc(href)}" target="_blank" rel="noopener"><b>${esc(title)}</b><small>${esc(sub)}</small><span class="cp-link-arrow" aria-hidden="true">↗</span></a>`;
// 9 张数据卡排成 3×3，按组一排：电脑本身、存储、网络；某张因为数据断了没出就留空位，不拉宽别的卡
export function computer(v, ctx) {
  const g = v.grafana, off = !!ctx.offline, stale = staleIds(v), now = ctx.now, at = v.served_at;
  const cards = dedupeCards(v.sections.computer).filter((c) => !stale.has(c.id)), byId = (id) => cards.find((c) => c.id === id);
  const tile = (c, extra) => (c ? tileOf(c, now, off, at, extra) : '');
  // 流量：本机代理今天的量做大字；套餐流量读到了（没停）才在小字后面接“套餐已用 x/y GB”
  const proxy = byId('proxy_traffic'), plan = byId('traffic');
  const planUsed = plan && !['unavailable', 'reading'].includes(plan.state) ? (/已用\s*(\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?\s*[KMGT]i?B)/.exec(plan.text || '') || [])[1] : '';
  const traffic = proxy ? tile({ ...proxy, title: '流量' }, { sub: planUsed ? esc('套餐已用 ' + planUsed.replace(/\s*\/\s*/, '/')) : '' }) : tile(plan && { ...plan, title: '流量' });
  // “你得知道”里有正在修的网络问题时，后端在远程卡上给 must_know_id（文字是“此刻能连上；间歇断开还在查”），点了跳到“你得知道”那一条
  const remoteCards = dedupeCards(v.sections.remote).filter((c) => !stale.has(c.id));
  const remote = (remoteCards.length ? remoteCards : [{ title: '远程连接', state: 'unavailable', text: '' }]).map((c, i) => tileOf({ kind: 'remote', ...c }, now, off, at,
    { id: i ? '' : 'remote', sub: !off && c.must_know_id ? `<a class="cp-net" href="#${esc(knowId({ id: c.must_know_id }))}">看这里 →</a>` : '' }));
  // 副机在线不在线看 laptop.connection；laptop.state 是副机自动任务的健康，不能当连接
  const lap = LAPTOP[v.laptop.connection];
  // 连不上、没读到也照样占这一格写“读不到”，九宫格不缺格（本人 10-31 12:46：九宫格怎么变成 8 个）
  const laptop = lap ? card({ title: '笔记本（副机）', state: lap[1], text: '' }, now, off, at, { big: lap[0], sub: lap[2], more: false })
    : tileOf({ title: '笔记本（副机）', state: 'unavailable', text: '', missing_reason: v.laptop.missing_reason || '这次没判断出它在不在线，不等于离线' }, now, off, at, {});
  const known = ['computer_health', 'system_resources', 'disk_space', 'temp_reclaim', 'proxy_traffic', 'traffic'];
  const rest = [...cards.filter((c) => !known.includes(c.id)).map((c) => tile(c)), ...remote.slice(1)];
  const rows = [[tile(byId('computer_health')), tile(byId('system_resources')), tile(byId('disk_space'))],
    [aiCacheTile(v, now, off, at), tile(byId('temp_reclaim')), storageTile(v, now, off, at)], [traffic, remote[0], laptop],
    ...Array.from({ length: Math.ceil(rest.length / 3) }, (_, i) => rest.slice(i * 3, i * 3 + 3))];
  const pad = (row) => [0, 1, 2].map((i) => row[i] || '<div class="cp-tile-gap" aria-hidden="true"></div>').join('');
  const t = cards.map((c) => Date.parse(c.observed_at || '')).filter(Number.isFinite);
  const offAt = off ? `<p class="cp-time cp-facts-at">读不到${t.length ? `（最后 ${esc(when(new Date(Math.max(...t)).toISOString(), now))} 读到）` : ''}</p>` : '';
  // 图表链接固定三张（本人 10-31 12:49：怎么又消失一个）：两张公开图表各占一格，这次没拿到地址的照样占格，写清怎么看；最后一张登录
  // 图表网页整个打不开时三张照样占格、变灰，登录那张写几点检查的
  const login = g.url ? new URL('login', g.url).href : '', down = !g.links.length && !login;
  const offCard = (label, sub) => `<div class="cp-link-card ct-card cp-chart is-off"><b>${esc(label)}</b><small>${esc(sub)}</small></div>`;
  const fixed = CHARTS.map(([id, label]) => { const l = g.links.find((x) => x.id === id); return l ? linkCard(l.url, l.label || label, '24 小时曲线', ' cp-chart')
    : login ? linkCard(login, label, '这张图的公开地址这次没拿到，登录后台能看', ' cp-chart is-off') : offCard(label, down ? '这会儿打不开' : '这张图的公开地址这次没拿到'); });
  const extra = g.links.filter((l) => l.id !== 'overview' && !CHARTS.some(([id]) => id === l.id)).map((l) => linkCard(l.url, l.label, '24 小时曲线', ' cp-chart'));
  const links = [...fixed, ...extra, login ? linkCard(login, '图表后台登录', '登录后看全部图表', ' cp-chart cp-login')
    : offCard('图表后台登录', `图表网页现在打不开${g.checked_at ? `（上次检查 ${when(g.checked_at, now)}）` : ''}`)];
  // 读不到电脑时图表网页也打不开：链接卡先收起，只留一行说明
  const chartsRow = off ? `<p class="cp-line cp-off-note" id="grafana">${dot('unavailable')}读不到电脑，图表链接先收起，读到后再出来。</p>`
    : `<div class="cp-pc-links" id="grafana">${links.join('')}</div>`;
  return `<div class="cp-pc-grid">${rows.filter((r) => r.some(Boolean)).map(pad).join('')}</div>` + offAt + chartsRow;
}

const LAPTOP = { online: ['在线', 'ok', ''], offline: ['离线', 'attention', '要用它时得先开机连网'] };
const CHARTS = [['cpu-gpu', 'CPU 和显卡'], ['memory-network', '内存和网络']];

// 备份和云端：和电脑区一样的卡片网格，宽屏一行三张（本人 10-31 12:54：排版不好看，一句“还没读到”不知何意）。
// 大字取后端给的结构化数（几项备份正常、上传进度、余额），没给就从原句里取，取不到写状态词，原句收进“详情”；
// 读不到的卡写清是什么没读到、为什么、谁在管：后端给了 missing_reason 就照写；副本清单整体没读到时，两张副本卡跟着这样说
const yuan = (n) => `¥${(Math.round(n * 100) / 100).toFixed(2)}`;
const isNum = Number.isFinite;
const BACKUP = {
  backups: (c, now, issue) => {
    const fail = Array.isArray(c.failing) ? c.failing.filter((x) => x?.name) : [];
    // 正在跑的不算没成功（后端 state=running，本人 10-31 截图里“正在运行”却标了“没成功”）
    const run = (x) => x.state === 'running';
    const note = (x) => [!run(x) && x.last_failed_at && `${when(x.last_failed_at, now)} 没成功`, x.last_success_at && `上次成功 ${when(x.last_success_at, now)}`].filter(Boolean).join(' · ');
    const list = fail.length ? `<ul class="cp-tile-rows">${fail.map((x) => `<li><span>${esc(x.name)}</span><b>${run(x) ? '正在跑' : '没成功'}</b>${note(x) ? `<small>${esc(note(x))}</small>` : ''}</li>`).join('')}</ul>` : '';
    if (isNum(c.items_total) && isNum(c.items_ok)) return { big: bigOf(`${c.items_ok}/${c.items_total}`, '项正常'), sub: c.last_success_at ? esc(`最近一次成功 ${when(c.last_success_at, now)}`) : '', list, more: false };
    return issue ? { big: esc(WORD[light(cardState(c))]), sub: esc([issue, factText(c)].filter(Boolean).join('；')), more: false, who: false } : null;
  },
  drive_upload: (c, now) => {
    const u = isNum(c.uploaded) ? c.uploaded : +pick(c.text, /(\d+)\s*\/\s*\d+\s*个/), all = isNum(c.total) ? c.total : +pick(c.text, /\d+\s*\/\s*(\d+)\s*个/);
    if (!(all > 0) || !isNum(u)) return null;
    const p = (u / all) * 100, at = c.last_completed_at || c.observed_at;
    return { big: bigOf(`${u}/${all}`, '个'), bar: meter(p, `传了 ${Math.floor(p)}%`, true), sub: esc([c.category, c.uploading ? '正在传' : u >= all ? '都传完了' : at && `${when(at, now)} 之后没再传`].filter(Boolean).join(' · ')), ...(c.text ? {} : { more: false }) };
  },
  aliyun_billing: (c) => isNum(c.balance_yuan) && { big: bigOf(yuan(c.balance_yuan), '余额'), sub: esc([isNum(c.month_spend_yuan) && `本月花了 ${yuan(c.month_spend_yuan)}`, isNum(c.runway_days) && `约够 ${Math.round(c.runway_days)} 天`].filter(Boolean).join(' · ')), more: false },
  copy: (c, now) => (isNum(c.bytes) || isNum(c.files)) && { big: isNum(c.bytes) ? esc(GI(c.bytes)) : bigOf(c.files.toLocaleString('en-US'), '个文件'),
    sub: esc([isNum(c.bytes) && isNum(c.files) && `${c.files.toLocaleString('en-US')} 个文件`, c.last_synced_at && `${when(c.last_synced_at, now)} 同步过`].filter(Boolean).join(' · ')), more: false },
};
const BACKUP_ORDER = ['backups', 'copy_drive', 'copy_photos', 'drive_upload', 'aliyun_billing'];
// 备份盘 G 和 H（本人 10-31 选定的第六张卡）：每块盘已用多少、一周涨多少、按近一周的速度几天到预算线、核对过几类备份。
// 数字取存储采样的 backup_g / backup_h；核对类数取备份卡原句里“X 盘有 N 类备份已经核对”，取不到就不写
const signedGI = (n) => (n < 0 ? '−' : '+') + GI(Math.abs(n));
function diskTile(v, own, now, off, pageAt) {
  const { sp, of, fresh } = storageOf(v, now), ok = (n) => Number.isFinite(n) && n >= 0;
  const checked = (d) => { const m = new RegExp(`${d}\\s*盘有\\s*(\\d+)\\s*类备份已经核对(?:，另外\\s*(\\d+)\\s*类\\s*AI\\s*还在核对)?`).exec(own?.text || ''); return m ? `核对过 ${m[1]} 类${m[2] ? `，${m[2]} 类在核对` : ''}` : ''; };
  const disks = ['G', 'H'].map((d) => ({ d, x: of('backup_' + d.toLowerCase()) })).filter((r) => r.x && ok(r.x.bytes)).map(({ d, x }) => {
    const left = ok(x.budget_bytes) ? x.budget_bytes - x.bytes : NaN, grow = x.weekly_growth_bytes;
    return { d, x, days: Number.isFinite(left) && grow > 0 ? Math.max(0, (left / grow) * 7) : Infinity };
  });
  const near = disks.some((r) => r.days < 14 || ['budget', 'weekly_growth'].includes(r.x.alert));
  const c = { id: 'backup_disks', title: '备份盘 G 和 H', state: !disks.length ? 'unavailable' : !fresh ? 'stale' : near ? 'attention' : 'ok', observed_at: sp.observed_at || null, text: '' };
  if (!disks.length) return card(c, now, off, pageAt, { big: '读不到', sub: '存储采样这次没读到两块备份盘', more: false });
  const top = [...disks].sort((a, b) => a.days - b.days)[0];
  const big = !Number.isFinite(top.days) ? bigOf('够用', '近一周没变多') : top.days < 1 ? bigOf('已到', `${top.d} 盘预算线`) : bigOf(`约 ${Math.round(top.days)} 天`, `${top.d} 盘到预算线`);
  const list = `<ul class="cp-tile-rows">${disks.map((r) => `<li><span>${r.d} 盘已用 ${esc(GI(r.x.bytes))}</span><b>${Number.isFinite(r.x.weekly_growth_bytes) ? esc('一周 ' + signedGI(r.x.weekly_growth_bytes)) : ''}</b>`
    + `<small>${esc([ok(r.x.budget_bytes) && `预算 ${GI(r.x.budget_bytes)}`, checked(r.d)].filter(Boolean).join(' · '))}</small></li>`).join('')}</ul>`;
  return card(c, now, off, pageAt, { big, sub: Number.isFinite(top.days) ? '按近一周的增速算' : '', list, fold: true, more: false, go: GO_STORAGE('各类别和近一周变化') });
}
export function backup(v, ctx) {
  const off = !!ctx.offline, stale = staleIds(v), now = ctx.now, at = v.served_at;
  const cards = dedupeCards(v.sections.backup_cloud).filter((c) => !stale.has(c.id)).map((c) => (c.id === 'drive_upload' ? { ...c, text: knownFirst(c.text) } : c));
  const sig = sigOf(v.overview, 'backup'), issue = !off && sig.level !== 'ok' ? backupIssue(v.overview) : '';
  const rank = (c) => (BACKUP_ORDER.includes(c.id) ? BACKUP_ORDER.indexOf(c.id) : BACKUP_ORDER.length);
  const own = cards.find((c) => c.id === 'backups'), inv = pick(own?.text, /副本清单从(.+?)起没读到/);
  const tile = (c) => {
    const k = /^copy_/.test(c.id) ? 'copy' : c.id, missing = ['unavailable', 'reading'].includes(c.state);
    const t = !off && BACKUP[k] ? BACKUP[k](c, now, issue) : null;
    if (t) return card(c, now, off, at, t);
    const why = c.missing_reason || (k === 'copy' && missing ? (inv ? `副本清单从${inv}起没读到，这份副本有多大、几时同步的跟着读不到；AI 在管` : '这份副本有多大、几时同步的，这次没读到') : '');
    // 原句只是“暂时读不到”这类话时不另收进“详情”，上面那句已经说清了
    return tileOf({ ...c, missing_reason: why, text: why && /^(暂时)?(读不到|还没读到|没读到)[。.]?$/.test(String(c.text || '').trim()) ? '' : c.text }, now, off, at);
  };
  // 备份盘那张紧跟“备份”，本地的两张挨着，云端的在后面
  const disks = diskTile(v, own, now, off, at), sorted = [...cards].sort((a, b) => rank(a) - rank(b));
  const tiles = cards.length ? (own ? sorted.flatMap((c) => (c === own ? [tile(c), disks] : [tile(c)])) : [...sorted.map(tile), disks]) : [tileOf({ title: '备份', state: 'unavailable', text: '' }, now, off, at), disks];
  return anchor('backups') + (issue && !own ? `<p class="cp-line cp-backup-current">${esc(issue)}</p>` : '') + `<div class="cp-pc-grid cp-bk-grid">${tiles.join('')}</div>`;
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
  const know = (p) => Array.isArray(p.know) ? p.know.filter((x) => typeof x?.text === 'string' && x.text.trim()) : [];
  // 有状况的项目一行一个：灯、名字、一句原因；“知道就行”的小字跟在下面
  const row = (p, s) => {
    const wait = [p.waiting_user ? `等你 ${p.waiting_user} 件` : '', p.waiting_ai ? `等 AI ${p.waiting_ai} 件` : '', p.on_hold ? `暂缓 ${p.on_hold} 件` : ''].filter(Boolean).join(' · ');
    const [id, ...more] = idsOf(slugOf(ctx.projectUrls?.[p.name]));
    const why = [p.health_reason, wait].filter(Boolean).join(' · '), info = know(p).map((x) => x.text.trim()).join('；');
    return `<li class="cp-proj is-${light(s)}"${id ? ` id="${esc(id)}"` : ''}>${more.map(anchor).join('')}${dot(s)}<b>${name(p)}</b>${why ? `<span>${esc(plain(why))}</span>` : ''}${info ? `<small>知道就行：${esc(plain(info))}</small>` : ''}</li>`;
  };
  // 等你动手的项目一行一个露在外面；AI 在查的、只有“知道就行”的收进一行；正常的再收一行
  const busy = live.filter((p) => stateOf(p) !== 'ok' || p.waiting_user > 0 || know(p).length), calm = live.filter((p) => !busy.includes(p));
  const mine = busy.filter((p) => p.waiting_user > 0), aiSide = busy.filter((p) => !mine.includes(p));
  const chips = calm.map((p) => { const [id, ...more] = idsOf(slugOf(ctx.projectUrls?.[p.name])); return `<li${id ? ` id="${esc(id)}"` : ''}>${more.map(anchor).join('')}${dot('ok')}${name(p)}</li>`; }).join('');
  // 驾驶舱里没有的项目（冻结的、接口没给的），锚点落在项目区开头
  const shown = new Set(live.flatMap((p) => idsOf(slugOf(ctx.projectUrls?.[p.name]))));
  const rest = [...new Set(Object.values(ctx.projectUrls || {}).map(slugOf).flatMap(idsOf))].filter((id) => id && !shown.has(id));
  return `<div class="cp-anchors">${rest.map(anchor).join('')}</div>`
    + (mine.length ? `<ul class="cp-proj-list">${mine.map((p) => row(p, stateOf(p))).join('')}</ul>` : '')
    // 默认展开，标题行点一下能收起（本人 10-31 12:54：项目默认展开）
    + (aiSide.length ? `<details class="cp-fold" id="proj-ai" open><summary>${dot('neutral')}${aiSide.length} 个项目有小毛病，AI 在查（不用你管）</summary><ul class="cp-proj-list">${aiSide.map((p) => row(p, stateOf(p))).join('')}</ul></details>` : '')
    + (chips ? `<details class="cp-fold" id="proj-calm" open><summary>正常运行的 ${calm.length} 个</summary><ul class="cp-chips">${chips}</ul></details>` : '')
    + (frozen.length ? `<p class="cp-line cp-frozen">${dot('unavailable')}冻结的 ${frozen.length} 个（AI 不再维护）：${frozen.map(name).join('、')}</p>` : '');
}

// 今天的动态：今天的变化卡 + 今天的事件 + 你纠正 AI 的次数 + 读不到的来源
const EVENT = { acceptance_reviewed: (x) => `AI 核对了 ${x.count ?? ''} 件登记的事${x.passed != null ? `，${x.passed} 件确认办完` : ''}`, freeze_captured: () => '电脑卡住时自动留了一次现场' };
// 两张常驻卡之一：今天代码变化。大数字 + 近 7 天（有逐日数就画 7 根柱，没有就比今天和日均）+ 提交最多的项目
const short = (d) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ''); return m ? `${+m[3]}日` : ''; };
const bars = (rows, unit) => {
  const max = Math.max(1, ...rows.map((r) => r.n || 0));
  return `<ol class="cp-bars">${rows.map((r) => `<li class="${r.n == null ? 'is-none' : ''}${r.now ? ' is-now' : ''}" title="${esc(r.label)} ${r.n == null ? '没统计到' : r.n + unit}"><span class="cp-bar" style="--h:${r.n == null ? 6 : Math.max(6, Math.round(r.n / max * 100))}%"></span><b>${r.n == null ? '—' : esc(r.n)}</b><small>${esc(r.label)}</small></li>`).join('')}</ol>`;
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
  return `<article class="cp-feature cp-code ct-card"><h3>今天代码变化</h3>${head}${yline}${trend}${top}<p class="cp-time">提交不等于已经上线${c.observed_at ? ` · ${esc(when(c.observed_at, ctx.now))} 读到` : ''}</p></article>`;
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
    const missing = (Array.isArray(oc.history) ? oc.history : []).filter((d) => d && d.total === null).map((d) => monthDay(d.date));
    const gap = missing.length ? `<p class="cp-cap">${esc(missing.join('、'))}没统计到，近 7 天只合计已统计的日期。</p>` : '';
    const cells = WORDS9.map((k) => {
      const hot = k === '禁令' || k === '纠正';
      const week = days.reduce((n, d) => n + count(d.by_category, k), 0);
      return `<li class="${hot ? 'is-hot' : ''}"><small>${k}</small><b>${esc(count(cats, k))}</b><span>近 7 天 ${esc(week)}</span></li>`;
    }).join('');
    const asof = oc.complete === false && oc.observed_at ? `今天截至 ${esc(hm(oc.observed_at))}` : '今天';
    const none = WORDS9.every((k) => count(cats, k) === 0);
    const prev = days.filter((d) => d.date && d.date < (oc.date || '')).pop();
    const yline = prev && (early(ctx) || none) ? `<p class="cp-cap cp-yesterday">昨天（${esc(monthDay(prev.date))}）：${WORDS9.map((k) => `${k} ${count(prev.by_category, k)}`).join('、')}</p>` : '';
    return `<article class="cp-feature cp-words ct-card"><h3>你对 AI 说的话（按 9 类）</h3><p class="cp-cap">${none ? (oc.complete === false && oc.observed_at ? `今天截至 ${esc(hm(oc.observed_at))}，还没跟 AI 说话（0 条）` : '今天还没跟 AI 说话（0 条）') : `大数字是${asof}，小字是近 7 天；一条话含几类就各算一次`}</p>${gap}${yline}<ol class="cp-words9">${cells}</ol></article>`;
  }
  const hist = Array.isArray(oc.history) ? oc.history.filter((d) => d && d.date) : [];
  const known = hist.filter((d) => Number.isFinite(d.total));
  const last = Number.isFinite(oc.total) ? { date: oc.date, total: oc.total, today: true } : known.length ? known[known.length - 1] : null;
  const head = last
    ? `<div class="cp-big"><b>${esc(last.total)}</b><span>次纠正 AI<br>${last.today ? '今天' : `最近有数的一天（${esc(short(last.date))}）`}</span></div>`
    : `<div class="cp-big"><b class="is-none">—</b><span>纠正次数还没读到</span></div>`;
  const trend = hist.length ? `<p class="cp-cap">近 ${hist.length} 天每天纠正几次（— 表示没统计到）</p>` + bars(hist.map((d, i) => ({ label: short(d.date), n: Number.isFinite(d.total) ? d.total : null, now: i === hist.length - 1 })), ' 次') : '';
  return `<article class="cp-feature cp-words ct-card"><h3>你纠正 AI 的次数</h3>${head}${trend}<p class="cp-time">以后按 9 类分开显示：禁令、纠正、授权、要求、建议、偏好、事实、询问、好奇</p></article>`;
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
  const acc = typeof s.acceptance_text === 'string' && s.acceptance_text.trim() ? `<p class="cp-cap cp-acceptance">${esc(s.acceptance_text.trim())}</p>` : '';
  // 任务数在自动任务区开头已经有了，这里只留备份和镜像（本人 10-30 批准第 5 项）
  const done = [Number.isFinite(s.backups_done) ? `完成 ${s.backups_done} 项备份` : '', Number.isFinite(s.images_done) && s.images_done ? `${s.images_done} 次系统镜像` : ''].filter(Boolean).join('、');
  void line;
  return `<article class="cp-feature cp-activity ct-card"><h3>电脑后台今天做的事</h3>${done ? `<p class="cp-big-line">今天${esc(done)}</p>` : ''}${acc}${names}${yline}`
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
  return `<article class="cp-feature cp-power ct-card"><h3>电脑今天的用电和开机</h3>`
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

// 今天的动态：四张大卡（代码、你对 AI 说的话、电脑后台、用电）默认展开，标题行点一下能收起（本人 10-31 12:54：今天的动态默认展开）；读不到的来源合并成一行
const foldLine = (id, summary, body, open = true) => `<details class="cp-fold" id="${id}"${open ? ' open' : ''}><summary>${summary}</summary><div class="cp-fold-body">${body}</div></details>`;
function codeLine(v) { const c = v.changes, n = c.today.commits; return n == null ? '今天代码：还没读到' : `今天代码：${n} 个提交${c.today.repos_changed != null ? `，涉及 ${c.today.repos_changed} 个项目` : ''}`; }
function wordsLine(v) {
  const oc = v.owner_corrections, cats = Array.isArray(oc.by_category) && oc.by_category.length ? oc.by_category : null;
  // 统计没到此刻（complete=false）时摘要后面写“截至 HH:MM”，和展开里的大数字同一口径
  const asof = oc.complete === false && hm(oc.observed_at) ? `（截至 ${hm(oc.observed_at)}）` : '';
  if (cats) {
    const nz = WORDS9.map((k) => [k, (cats.find((x) => x?.category === k) || {}).count]).filter(([, n]) => Number.isFinite(n) && n > 0);
    return (nz.length ? `你今天对 AI 说的话：${nz.slice(0, 4).map(([k, n]) => `${k} ${n}`).join('、')}${nz.length > 4 ? ' 等' : ''}` : '你今天还没跟 AI 说话') + asof;
  }
  return Number.isFinite(oc.total) ? `你今天纠正 AI ${oc.total} 次${asof}` : '你对 AI 说的话：还没读到';
}
function activityLine(v, ctx) {
  let s = v.today_activity.summary;
  if (!v.today_activity.timeline.length && !Number.isFinite(s.tasks_run)) {
    const ran = v.automation.items.filter((t) => t.enabled !== false && isToday(t.last_run_at, ctx.now));
    s = { tasks_run: v.automation.items.length ? ran.length : null, tasks_failed: v.automation.items.length ? ran.filter((t) => t.state === 'failed').length : null };
  }
  if (!Number.isFinite(s.tasks_run)) return '电脑后台今天做的事：还没读到';
  // 跑了几个任务、几个出错在自动任务区开头已经写了（本人 10-30 批准第 5 项），这里只说备份和别的记录
  const n = v.today_activity.timeline.length;
  const bits = [Number.isFinite(s.backups_done) ? `完成 ${s.backups_done} 项备份` : '', n ? `记了 ${n} 件事` : ''].filter(Boolean);
  return `电脑后台今天做的事${bits.length ? '：' + bits.join('，') : ''}`;
}
function powerLine(v) {
  const p = v.power_today, up = p.uptime_hours ?? v.security.computer.uptime_hours, kwh = p.energy_kwh;
  return [Number.isFinite(up) ? `今天开机 ${Math.round(up * 10) / 10} 小时` : '', Number.isFinite(kwh) ? `用电约 ${Math.round(kwh * 10) / 10} 度` : ''].filter(Boolean).join('、') || '今天的开机和用电：还没读到';
}
export function todayBlock(v, ctx) {
  const stale = staleIds(v);
  const cards = dedupeCards(v.sections.today.filter((c) => c.id !== 'today_changes' && !stale.has(c.id) && isToday(c.observed_at, ctx.now)));
  // 同一处没读到的合成一行
  const gapRows = new Map();
  for (const g of v.source_gaps) { const e = gapRows.get(g.title); gapRows.set(g.title, e ? { ...e, n: e.n + 1 } : { g, n: 1 }); }
  // 没读到的来源清单照旧收着（各卡上已经写了是什么没读到），不算“今天的动态”
  const gaps = gapRows.size ? foldLine('today-gaps', `这次有 ${gapRows.size} 处没读到，相关的数可能不全`, `<ul class="cp-list">${[...gapRows.values()].map(({ g, n }) => `<li>${dot('attention')}${esc(g.title)}${n > 1 ? `（${n} 处）` : ''}${g.since ? `<span class="cp-meta">（${esc(when(g.since, ctx.now))} 起）</span>` : ''}${typeof g.impact === 'string' && g.impact.trim() ? `<small class="cp-gap-impact">${esc(g.impact.trim())}</small>` : ''}</li>`).join('')}</ul>`, false) : '';
  return releaseLine(v, ctx) + `<div class="cp-folds">${foldLine('today-code', esc(codeLine(v)), codeCard(v, ctx))}${foldLine('today-words', esc(wordsLine(v)), wordsCard(v, ctx))}`
    + `${foldLine('today-activity', esc(activityLine(v, ctx)), activityBlock(v, ctx))}${foldLine('today-power', esc(powerLine(v)), powerBlock(v, ctx))}</div>`
    + (cards.length ? factCards(cards, ctx.now, !!ctx.offline, v.served_at) : '') + gaps;
}
// 自动任务区开头一行：今天跑了几个、自己装的任务几个出过错（几个已好、几个 AI 在修）；
// “后台 N 项功能中断过，现在都恢复了”从“你得知道”挪到这里（可用性审查）。今天的河收在下面的折叠里
export function tasksSum(v, ctx) {
  const s = v.today_activity.summary, errs = todayErrors(v), rec = recovery(v);
  const bits = [Number.isFinite(s.tasks_run) ? `今天跑了 ${s.tasks_run} 个任务` : '',
    errs ? (errs.owner ? `我们自己装的任务 ${errs.owner} 个出过错` : '我们自己装的任务今天没出错') + (errs.other ? `，别的软件自带的 ${errs.other} 个出过错` : '') : '',
    rec && (rec.done || rec.open) ? `已好 ${rec.done} 个，AI 在修 ${rec.open} 个` : ''].filter(Boolean);
  return (bits.length ? `<p class="cp-line cp-tasks-line">${dot(rec && rec.open ? 'neutral' : 'ok')}${esc(bits.join('；'))}</p>` : '') + recoveredBlock(v, ctx);
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
// 备份不正常时的那一句（状态格第一行和备份区开头共用）：写真实件数，分数里扣了 3 项就写“3 项备份失败（开发配置等）”，只有 1 项照原句
function backupIssue(ov) {
  const bk = sigOf(ov, 'backup'), why = whyOf(ov, 'backup_cloud');
  const n = Number.isFinite(Number(bk.value)) && Number(bk.value) > 0 ? Number(bk.value) : why.length;
  if (n <= 1) return why[0] || (n ? '1 项要留意' : '');
  // 只留第一项的名字：“开发配置备份超过 72 小时没成功”→“开发配置”
  const name = ((/^(.+?)(?:的?备份|失败|过期|超过|需要留意|要留意)/.exec(why[0] || '') || [])[1] || '').trim();
  return `${n} 项备份${why.length && why.every((t) => /失败$/.test(t)) ? '失败' : '要留意'}${name ? `（${name}等）` : ''}`;
}
// 首屏三格的内容：每格 {state, status, who, why, note, short, brief}
function triCells(v, ctx, off) {
  const ov = v.overview;
  const make = (id, label, level, sig, status, okWho, okShort, why, note = '') => {
    const state = off ? 'unavailable' : ownerState(level, sig, sig?.handler_text || '交给 AI');
    // 第二行小字只回答“要不要你管”（本人 10-30 批准第 2 项）：AI 在管写“AI 在修，不用你管”，要你出手写“要你看”
    const who = state === 'ok' ? okWho : state === 'neutral' ? WHO_TEXT.neutral
      : state === 'unavailable' ? (ov?.as_of ? `上次 ${hm(ov.as_of)} 读到` : '还没读到') : WHO_TEXT[state] || '要你看';
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
  const bkStatus = bk.level === 'ok' ? '都按时备份了' : backupIssue(ov) || bk.word || '读不到';
  const bkMore = bkWhy.length > 1 ? `另有 ${bkWhy.length - 1} 项：${bkWhy.slice(1).join('、')}` : Number.isFinite(bk.value) && bk.level !== 'ok' ? `共 ${bk.value} 项不正常` : '';
  // 这次开机了多久（本人 10-31 找不到它：五格首屏上要一眼看到）；连不上电脑时 make 不画 note
  const upH = v.security?.computer?.uptime_hours;
  const upNote = Number.isFinite(upH) && upH >= 0 ? `这次开机 ${upH >= 24 ? `${Math.floor(upH / 24)} 天 ${Math.round(upH % 24)} 小时` : `${Math.round(upH * 10) / 10} 小时`}` : '';
  return [
    make('computer', '电脑', pcLevel, pc, pcStatus, '不用你管', '正常', pcDetail, upNote),
    // 现在没有仍失败的、也没有当前反复出错的：这一格就是正常（绿），不因后端 color=neutral 写成“今天都正常，AI 在管”
    make('tasks', '自动任务', tkLevel, nErr === 0 && !repeat.length ? { ...tk, color: 'ok' } : tk, tkStatus, '不用你管', '都正常', tkWhy, tkNote),
    make('backup', '备份', bk.level, bk, bkStatus, '不用你管', '都按时', bkMore),
  ];
}
// 状态小格按中文整词换行；空格和标点仍参与浏览器的正常断行。
const statusSegmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('zh-CN', { granularity: 'word' }) : null;
const statusText = (text) => statusSegmenter ? [...statusSegmenter.segment(text)].map(({ segment, isWordLike }) => isWordLike ? `<span class="cp-status-word">${esc(segment)}</span>` : esc(segment)).join('') : esc(text);
function tri(cells) {
  const cell = (c) => `<li class="cp-tri-cell is-${light(c.state)}" data-signal="${c.id}"><a class="hub-stat-field ct-card" href="#${c.id === 'tasks' ? 'tasks' : c.id === 'backup' ? 'backups' : 'computer'}">`
    + `<span class="cp-tri-label">${c.label}</span><b class="cp-tri-status">${dot(c.state)}${statusText(c.status)}</b>`
    + `<span class="cp-tri-who">${c.who.split(' · ').map((w) => `<span>${esc(w)}</span>`).join('<i aria-hidden="true"> · </i>')}</span>`
    + (c.why ? `<span class="cp-tri-why">${esc(c.why)}</span>` : '') + (c.note ? `<span class="cp-tri-note${c.id === 'computer' ? ' cp-tri-up' : ''}">${esc(c.note)}</span>` : '') + `</a></li>`;
  return `<ul class="cp-tri">${cells.map(cell).join('')}</ul>`;
}
// 电脑健康分（和首页小屏同名）：后端只按电脑、自动任务和备份扣分，你的事、AI 的事不扣分。
// 大数字下面直接写最大的两三项扣分（“备份 3 项失败 −30 · 自动任务 2 个没恢复 −16 ›”）；点开每行写谁在管、修好能回到几分，点哪行跳到页面下面那块
const SCORE_SCOPE = '只算电脑、自动任务和备份；你的事、AI 的事不扣分';
// 后端 overview.reasons[].section → 页面上的那块；“今天你的自动任务……”挂在 today 下，实际在自动任务区
const SEC_ANCHOR = { backup_cloud: 'backup', automation: 'tasks', computer: 'computer', remote: 'computer', projects: 'projects', today: 'today' };
const anchorOf = (r) => (r.section === 'today' && /任务/.test(r.text) ? 'tasks' : SEC_ANCHOR[r.section] || 'status');
// 谁在管：后端 overview.sections[区].color / owner_action 说了算（和状态格同一套），AI 在管写“AI 在修，不用你管”
const WHO_TEXT = { neutral: 'AI 在修，不用你管', attention: '要你看', red: '要你看' };
const whoOfSec = (ov, sec) => { const s = ov?.sections?.[sec]; return s ? WHO_TEXT[ownerState(s.level, s)] || '' : ''; };
const backupName = (t) => String(t || '').replace(/(的?备份)?(失败|过期|需要留意|要留意)$|(的?备份)?超过.*$/, '').trim();
// 扣分合并成几行：备份几项合成一行（“备份 3 项失败”），“自动任务尚未确认恢复 2 个”写成“自动任务 2 个没恢复”，其余照后端原句
export function scoreGroups(ov) {
  const list = (Array.isArray(ov?.reasons) ? ov.reasons : []).filter((r) => r && typeof r.text === 'string' && r.text.trim() && Number.isFinite(r.delta) && r.delta < 0);
  const groups = [];
  for (const r of list) {
    const key = r.section === 'backup_cloud' ? 'backup_cloud' : `${r.section}\u0001${r.text}`;
    const g = groups.find((x) => x.key === key);
    if (g) { g.items.push(r); g.delta += r.delta; } else groups.push({ key, section: r.section, anchor: anchorOf(r), items: [r], delta: r.delta });
  }
  for (const g of groups) {
    const n = g.items.length, t = g.items[0].text.trim().replace(/[。\s]+$/, '');
    const late = /尚未确认恢复\s*(\d+)\s*个/.exec(t);
    g.label = g.key === 'backup_cloud' && n > 1 ? `备份 ${n} 项${g.items.every((r) => /失败$/.test(r.text.trim())) ? '失败' : '要留意'}`
      : late ? `自动任务 ${late[1]} 个没恢复` : t;
    g.names = g.key === 'backup_cloud' && n > 1 ? g.items.map((r) => backupName(r.text)).filter(Boolean) : [];
    g.who = whoOfSec(ov, g.section);
  }
  return groups.sort((a, b) => a.delta - b.delta);
}
const minus = (d) => `−${Math.abs(Math.round(d))}`;
// 某块比页面时间旧 15 分钟以上才单独写几点读到（顶上已经写过一次）
export const lagAt = (at, v) => { const a = Date.parse(at || ''), p = Date.parse(v?.served_at || ''); return Number.isFinite(a) && Number.isFinite(p) && p - a >= 15 * 60e3 ? `${dateHm(at)} 读到` : ''; };
function score(v, ctx, off) {
  const ov = v.overview;
  const at = ov?.as_of ? hm(ov.as_of) : '';
  if (off || !Number.isFinite(ov?.score)) return `<p class="cp-score is-off">电脑健康分：读不到${at ? `（上次 ${at}）` : ''}</p>`;
  const groups = scoreGroups(ov), now = Math.round(ov.score);
  const top = groups.slice(0, 3).map((g) => `<span class="cp-score-hit">${esc(g.label)} <b>${minus(g.delta)}</b></span>`).join('<i aria-hidden="true"> · </i>');
  const back = (d) => Math.min(100, now - Math.round(d));
  const row = (g) => `<li><a class="cp-score-go" href="#${g.anchor}"><span class="cp-score-what">${esc(g.label)}${g.names.length ? `<small>${esc(g.names.join('、'))}</small>` : ''}</span><b>${minus(g.delta)}</b>`
    + `<small class="cp-score-fix">${esc([g.who, `修好能回到 ${back(g.delta)} 分`].filter(Boolean).join(' · '))}</small></a></li>`;
  const total = groups.reduce((s, g) => s + g.delta, 0);
  const rules = Array.isArray(ov.rules) ? ov.rules.map((r) => (typeof r === 'string' ? { text: r } : r)).filter((r) => r?.text) : [];
  const late = lagAt(ov.as_of, v);
  return `<details class="cp-score hub-stat-field ct-card" id="score"><summary>${blockHead('电脑健康分', 'cp-score-title')}<span class="cp-score-number hub-field-number-line"><b class="cp-score-value hub-field-value">${now}</b><small>/100</small></span><progress class="cp-score-meter" max="100" value="${Math.max(0, Math.min(100, ov.score))}" aria-label="电脑健康分"></progress>`
    + `<span class="cp-score-top">${groups.length ? top + (groups.length > 3 ? `<i aria-hidden="true"> · </i>另 ${groups.length - 3} 项` : '') : '没有扣分的地方'}<span class="cp-score-more" aria-hidden="true"> ›</span></span>`
    + `<span class="cp-score-why hub-field-body"><span class="cp-score-scope-s">${SCORE_SCOPE}</span>${late ? `<small>${esc(late)}</small>` : ''}</span></summary>`
    // 电脑版五格一排时计算范围那句收进点开的说明里（cockpit.css 按宽度只显示一处）
    + `<div class="cp-score-body"><p class="cp-score-scope">${SCORE_SCOPE}</p>${groups.length ? `<ul class="cp-score-rows">${groups.map(row).join('')}</ul>${groups.length > 1 ? `<p class="cp-score-all">全部修好是 ${back(total)} 分。</p>` : ''}` : '<p>没有扣分的地方。</p>'}`
    + (rules.length ? `<details class="cp-score-rules" id="score-rules"><summary>分数怎么算（${rules.length} 条）</summary><ul>${rules.map((r) => `<li>${esc(r.text)}</li>`).join('')}</ul></details>` : '')
    + `</div></details>`;
}
// “你得知道”（后端 must_know，字段在才出这一块）：AI 在修、影响你用电脑的毛病；刚恢复、刚办好的事；你没回又该知道的汇报。
// 本人 10 月 29 日：长了头疼、短了像谜语，最多 5 行。所以：
// - 几条“××已恢复”合成一行“后台 N 项功能中断过，现在都恢复了”，点开看是哪几项；
// - “AI 已定”是 AI 自己的技术决定，本人不用逐条知道：合成一行“AI 自己定了 N 件技术问题”，点开才看全部（每条仍能复制给 AI 改）；
// - 汇报只露第一句，后面的数字收进展开里；
// - “AI 在修”、其他真正影响本人的事排在前面；合完还超过 5 行，第 5 行起折成“其余 N 条”。
// 每个折叠都带固定 id，每分钟换字时 client.js 按 id 保持展开。
export const knowId = (k) => 'know-' + String(k.id || '').replace(/[^\w-]/g, '');
const KNOW_TAG = { repairing: ['在修', 'neutral'], recovered: ['已恢复', 'ok'], report: ['结果', 'neutral'], new_feature: ['新功能', 'ok'], feature: ['新功能', 'ok'], ai_decision: ['AI 已定', 'neutral'], just_completed: ['结果', 'ok'], done: ['结果', 'ok'] };
// 排在前面的先后：AI 在修 → 其他影响本人的事（后端以后加的新种类也算这一档） → 汇报；合起来的两行放最后
const KNOW_RANK = { repairing: 0, report: 2 };
export const KNOW_MAX = 5;
// 第一句：到第一个逗号、句号、分号为止（前面至少 6 个字，免得只剩“每周体检”四个字）；后端给了 headline 就用它
export function firstSentence(k) {
  const s = String(k?.text || '').trim();
  if (typeof k?.headline === 'string' && k.headline.trim() && s.startsWith(k.headline.trim())) return [k.headline.trim(), s.slice(k.headline.trim().length).replace(/^[，。；！？\s]+/, '')];
  const m = /^(.{6,}?)[，。；！？]/.exec(s);
  const tail = m ? s.slice(m[0].length).trim() : '';
  return tail ? [m[1], tail] : [s.replace(/[。\s]+$/, ''), ''];
}
// “××已恢复，AI 已核对最近一次成功。”里的“××”
const recoveredName = (k) => (isPh(k) ? k.title || PRIVATE_TITLE : ((/^(.+?)已恢复/.exec(k.text || '') || [])[1] || String(k.text || '').replace(/[。\s]+$/, '')).trim());
// AI 决定的原句是“事项：结束；依据”或“事项：限期到 2026-10-31 18:30（北京时间）；依据”，拆成事项、决定、依据三段；拆不出就整句照登
const DECISION_RE = /^([^]*?)[：:]\s*(结束(?:跟进)?|限期到\s*\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(?:\s*（北京时间）)?)\s*(?:[；;]\s*([^]*))?$/;
function splitDecision(k) {
  const m = DECISION_RE.exec(String(k.text || '').trim());
  if (!m || !m[1].trim()) return null;
  const end = m[2].startsWith('结束');
  const due = end ? '' : (k.decision_due_at && dateHm(k.decision_due_at)) || dateHm(m[2].replace(/^限期到\s*/, '').replace(/\s*（北京时间）$/, '').replace(/\s+/, 'T') + ':00+08:00');
  return { topic: m[1].trim(), decision: end ? '不再跟进，这条结束' : `限期到 ${due}`, basis: (m[3] || '').trim().replace(/[。\s]+$/, '') };
}
function knowBlock(v, ctx) {
  const m = v.must_know;
  if (!m) return '';
  if (m.state === 'unavailable') return `<div class="cp-know is-empty"><p>${dot('unavailable')}你得知道：这会儿读不到${m.observed_at ? `（最后 ${esc(when(m.observed_at, ctx.now))} 读到）` : ''}，不代表没有新事</p></div>`;
  const ok = (k) => isPh(k) || (typeof k.text === 'string' && k.text);
  // 已恢复的挪到自动任务区，AI 自己定了的挪到“AI 的账本”；这里只留真跟你有关的
  const mine = (k) => k.kind !== 'recovered' && k.kind !== 'ai_decision';
  // 结果类（标签“结果”）超过 2 天自动放进“最近收起”：后端该关没关时的页面兜底（本人 10-30 批准第 5 项；根治在后端）
  const RESULT = ['report', 'just_completed', 'done'];
  const aged = (k) => RESULT.includes(k.kind) && Number.isFinite(Date.parse(k.at || '')) && ctx.now.getTime() - Date.parse(k.at) > 48 * 36e5;
  const all = m.items.filter(ok).filter(mine).filter((k) => !aged(k)), old = [...m.items.filter(ok).filter(mine).filter(aged), ...m.archived.filter(ok).filter(mine)];
  const tagOf = (kind) => { const [tag, st] = KNOW_TAG[kind] || ['你得知道', 'neutral']; return `<span class="cp-know-tag is-${light(st)}">${tag}</span>`; };
  // 刚做完的（后端 kind=just_completed，带 executor）：小字写“几点 · Claude 做完”
  const smallOf = (k) => [k.at && !String(k.text || '').includes(when(k.at, ctx.now)) ? when(k.at, ctx.now) + (k.kind === 'just_completed' && VENDOR[k.executor] ? ` · ${VENDOR[k.executor]} 做完` : '') : '', !isPh(k) && typeof k.exit_when === 'string' ? k.exit_when : ''].filter(Boolean);
  // 一条照原样的行；汇报只露第一句，其余点开看
  const row = (k) => {
    const small = smallOf(k);
    const tail = small.length ? `<small>${small.map(esc).join(' · ')}</small>` : '';
    const progress = typeof k.progress === 'string' ? k.progress : k.progress?.text || k.latest_progress || '';
    const next = typeof k.next_step === 'string' ? k.next_step : '', nextAt = k.next_at || k.next_check_at || k.next_run_at || k.handler?.next_run_at;
    // 后台可在“具体”与独立字段里带同一句；只补正文尚未出现的内容，不改原始复制数据。
    const key = (s) => plain(s).replace(/(^|[。；;\n])\s*(?:具体|进展|下一步)[：:]\s*/g, '$1').replace(/[\s：:，,。；;]/g, '');
    const shown = [k.text || ''], has = (s) => !!key(s) && shown.some((t) => key(t).includes(key(s)));
    const detailRest = [progress, next, nextAt && dateHm(nextAt), nextAt && when(nextAt, ctx.now)].filter(Boolean)
      .reduce((rest, s) => key(s) ? rest.split(key(s)).join('') : rest, key(k.owner_detail));
    const extra = has(k.owner_detail) || !detailRest ? '' : detail(k, Infinity);
    if (extra) shown.push(k.owner_detail);
    const progressText = has(progress) ? '' : progress;
    if (progressText) shown.push(progressText);
    const nextText = has(next) ? '' : next;
    if (nextText) shown.push(nextText);
    const nextTime = nextAt && !has(dateHm(nextAt)) && !has(when(nextAt, ctx.now)) ? dateHm(nextAt) : '';
    const updates = isPh(k) ? '' : (progressText ? `<span class="cp-know-progress">${/^(?:进展)[：:]/.test(progressText) ? '' : '进展：'}${esc(plain(progressText))}</span>` : '')
      + (nextText || nextTime ? `<span class="cp-know-next">${!nextText || /^下一步[：:]/.test(nextText) ? '' : '下一步：'}${esc(plain(nextText))}${nextTime ? `${nextText ? ' · ' : ''}${esc(nextTime)}` : ''}</span>` : '');
    if (k.kind === 'report' && !isPh(k)) {
      const [head, rest] = /旧临时目录回收/.test(k.title || k.text || '') ? ['旧临时目录回收情况，展开看明细', k.text] : firstSentence(k);
      if (rest) return `<li id="${esc(knowId(k))}" class="is-report${phCls(k)}${actCls(k, ctx)}"${itemAttr(k)}>${tagOf('report')}<details class="cp-know-fold" id="${esc(knowId(k))}-open"><summary>${esc(plain(head))}${ownTag(k)}</summary><div class="cp-know-sub"><p>${esc(plain(rest))}</p>${extra}${tail}</div></details>${updates}${ownerBox(k, ctx, { only: ['ack'] })}</li>`;
    }
    // 标签已经写了“刚做完”，正文开头同样的“刚做完：”不再重复
    const text = isPh(k) ? k.title || PRIVATE_TITLE : k.kind === 'just_completed' ? plain(k.text).replace(/^\s*刚做完[：:]\s*/, '') : plain(k.text);
    return `<li id="${esc(knowId(k))}" class="is-${esc(k.kind || 'other')}${phCls(k)}${actCls(k, ctx)}"${itemAttr(k)}>${tagOf(k.kind)}<span class="cp-know-text">${esc(text)}${ownTag(k)}${extra}${tail}${updates}</span>${ownerBox(k, ctx, { only: ['ack'] })}</li>`;
  };
  const rows = all.map((k, i) => ({ k, i, r: KNOW_RANK[k.kind] ?? 1 })).sort((a, b) => a.r - b.r || a.i - b.i).map(({ k }) => row(k));
  const folded = old.length ? `<details class="cp-know-old" id="know-old"><summary>最近收起的 ${old.length} 条</summary><p class="cp-know-note">结果满 2 天自动收到这里。</p><ul class="cp-know-list">${old.map(row).join('')}</ul></details>` : '';
  if (!rows.length) return `<div class="cp-know is-empty"><p>${dot('ok')}${esc(m.text || '没有要你知道的新事')}</p>${folded}</div>`;
  // 最多 5 行：超过时露前 4 行，第 5 行是“其余 N 条”
  const shown = rows.length > KNOW_MAX ? rows.slice(0, KNOW_MAX - 1) : rows, more = rows.slice(shown.length);
  return `<div class="cp-know">${blockHead('你得知道', 'cp-know-k')}<ul class="cp-know-list">${shown.join('')}</ul>`
    + (more.length ? `<details class="cp-know-rest" id="know-rest"><summary>其余 ${more.length} 条</summary><ul class="cp-know-list">${more.join('')}</ul></details>` : '') + folded + `</div>`;
}
// 几条“××已恢复”合一行（同一项恢复过几次算一项，留最近那次），放在自动任务区开头
function recoveredBlock(v, ctx) {
  const recovered = (v.must_know?.items || []).filter((k) => k.kind === 'recovered' && (isPh(k) || (typeof k.text === 'string' && k.text)));
  if (!recovered.length) return '';
  const byName = new Map();
  for (const k of recovered) { const n = recoveredName(k), seen = byName.get(n); byName.set(n, { k: seen?.k || k, ids: [...(seen?.ids || []), k.id], times: (seen?.times || 0) + 1, at: !seen || Date.parse(k.at || '') > Date.parse(seen.at || '') ? k.at : seen.at }); }
  return `<div class="cp-recovered" id="know-recovered"><details class="cp-fold" id="know-recovered-open"><summary>${dot('ok')}后台 ${byName.size} 项功能中断过，现在都恢复了</summary>`
    + `<ul class="cp-know-sub">${[...byName.entries()].map(([name, { k, ids, times, at }]) => `<li id="${esc(knowId(k))}"${liCls(k, ctx)}${itemAttr({ id: ids.join(' ') })}><span>${esc(name)}${times > 1 ? `（中断过 ${times} 次）` : ''}</span>${at ? `<small>${esc(when(at, ctx.now))} 确认恢复</small>` : ''}${ownerBox(k, ctx)}</li>`).join('')}</ul>`
    + `<p class="cp-know-note">AI 都核对过最近一次成功；确认恢复满 3 天后自动收起。</p></details></div>`;
}
// AI 自己定了的（二级页“AI 的账本”）：每条写什么事、AI 定了什么、一句原因；英文代号之类的技术细节收进“技术细节”。
const CODE = /\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b|[A-Za-z]:\\\S+/;
function decisionsBlock(v, ctx) {
  const list = (v.must_know?.items || []).filter((k) => k.kind === 'ai_decision' && (isPh(k) || (typeof k.text === 'string' && k.text)));
  if (!list.length) return `<p class="cp-line">${dot('ok')}最近 AI 没有自己定过什么。</p>`;
  const item = (k) => {
    if (isPh(k)) return `<li id="${esc(knowId(k))}" class="is-ai_decision is-private"${itemAttr(k)}><span class="cp-know-dec-topic">${esc(k.title || PRIVATE_TITLE)}</span></li>`;
    const d = splitDecision(k);
    const when1 = k.at ? `<small>${esc(when(k.at, ctx.now))} 定</small>` : '';
    const basis = d?.basis ? (CODE.test(d.basis) ? `<details class="cp-tech"><summary>技术细节</summary><p>${esc(d.basis)}</p></details>` : `<span class="cp-know-dec-why">原因：${esc(plain(d.basis))}</span>`) : '';
    return `<li id="${esc(knowId(k))}" class="is-ai_decision${actCls(k, ctx)}"${itemAttr(k)}>` + (d
      ? `<span class="cp-know-dec-topic">${esc(d.topic)}${ownTag(k)}</span><span class="cp-know-dec-what">AI 定了：${esc(d.decision)}</span>${basis}`
      : `<span class="cp-know-dec-topic">${esc(k.text)}${ownTag(k)}</span>`) + detail(k) + when1 + ledgerBox(k, ctx) + `</li>`;
  };
  return `<p class="cp-know-note">这些是 AI 自己能定的技术事，你不用逐条看。</p><ul class="cp-know-sub cp-know-decs" id="know-decisions">${list.map(item).join('')}</ul>`;
}

// “AI 正在干活”（后端 ai_running，字段在才出这一块）：首屏写件数和真要你出手的卡住行，其余点开看，每行可复制。
// 状态带颜色和符号，色盲也分得清；“停了，没做完”（半路停下超过半小时）“看不出在干嘛”多半已经结束，不算在干活、也不算卡住（可用性审查）。
// 公开版（行带 placeholder，或这次拿到的是公开版）只写两句：几个在干活（卡在哪类），再按型号数一数；不列在做什么。
// 后端新加的 queued 在排队、waiting_confirm 等你确认、waiting_data 等你解锁个人资料算“还在办”；failed 中途断了和停了一样不算在干活。字照后端 status_text 写
export const RUN_LOOK = {
  login_failed: ['登录失效', 'red', '○'], quota_exhausted: ['额度用完', 'red', '○'], network_retry: ['网络在重连', 'yellow', '◐'],
  waiting_owner: ['在等你回话', 'blue', '◆'], waiting_confirm: ['等你确认', 'blue', '◆'], waiting_data: ['等你解锁个人资料', 'blue', '◆'], queued: ['在排队', 'gray', '◇'],
  stopped: ['停了，没做完', 'gray', '■'], failed: ['中途断了，不用你管', 'gray', '■'], unknown: ['看不出在干嘛（多半已经结束）', 'gray', '？'], running: ['在干活', 'green', '●'],
};
const RUN_ORDER = ['quota_exhausted', 'login_failed', 'network_retry', 'stopped', 'waiting_owner', 'waiting_confirm', 'waiting_data', 'running', 'queued', 'unknown', 'failed'];
// 卡住只看行上的 r.stuck（model.js 的 rowStuck，和后端 stuck_count 同一口径）；额度用完、登录失效是要你出手的那种
const OWNER_STUCK = ['quota_exhausted', 'login_failed'];
const DONE_LIKE = ['stopped', 'unknown', 'failed'];
const VENDOR = { claude: 'Claude', gpt: 'GPT' };
const modelOf = (r) => r.model_text || VENDOR[r.vendor] || '型号没记下';
const activeOf = (a) => (a.rows.length && a.rows.length >= a.count ? a.rows.filter((r) => !DONE_LIKE.includes(r.status)).length : a.count);
// 卡住件数以后端 stuck_count 为准，其中额度、登录要你出手：“2 个卡住要你看”“2 个卡住，1 个要你看”“1 个卡住”
const stuckOf = (a) => {
  const k = Number.isInteger(a.stuck_count) ? a.stuck_count : a.rows.filter((r) => r.stuck).length;
  const m = Math.min(k, a.rows.filter((r) => r.stuck && OWNER_STUCK.includes(r.status)).length);
  return k ? `（${k} 个卡住${m === k ? '要你看' : m ? `，${m} 个要你看` : ''}）` : '';
};
// 首屏那一句：“AI 在干活：8 个（1 个卡住要你看）”；一个都没有时“现在没有 AI 在干活”；这次读不全时照实说
export const runLine = (a) => {
  const n = activeOf(a), k = stuckOf(a);
  const s = a.rows.filter((r) => r.status === 'stopped').length, u = a.rows.filter((r) => r.status === 'unknown').length;
  const more = s || u ? `，另 ${[s ? `${s} 件停了没做完` : '', u ? `${u} 件看不出在干嘛` : ''].filter(Boolean).join('、')}` : '';
  return n || k ? `AI 在干活：${n} 个${k}${more}` : a.unread ? 'AI 干活情况读不全' : `现在没有 AI 在干活${more}`;
};
// 帮手说明换成人话：“+9 个帮手：4 个在跑、5 个判断不了” → “它叫了 9 个助手，4 个在干活”
export const helperText = (s) => String(s || '').replace(/(^|[，,；;]\s*)\+(\d+)\s*个帮手(?:[：:]([^；;]*))?/, (_m, pre, n, rest) => { const run = /(\d+)\s*个在跑/.exec(rest || ''); return `${pre}它叫了 ${n} 个助手${run ? `，${run[1]} 个在干活` : ''}`; });
// 按型号数：“Claude Opus 5.5 5 个 · GPT Sol 3 个”（多的在前；只数在干活的）
function modelCounts(rows) {
  const m = new Map();
  for (const r of rows) m.set(modelOf(r), (m.get(modelOf(r)) || 0) + 1);
  return [...m.entries()].sort((x, y) => y[1] - x[1]).map(([k, c]) => `${k} ${c} 个`).join(' · ');
}
// 一行：主行写它现在在做什么（后端 doing：“正在做：……”，有第几步就在后面小字“第 3 步/共 8 步”）；没有 doing 写最近一次进展那句；两样都没有才写标题。
// 第二行小字：最近一次进展那句（主行已经是它时不重复）· 型号 · 多久前还在动；对话名、任务名降成灰色小标签（开头定的，后来会过时）
// 在等你回话的行对上哪张“AI 在等你回”卡：同一个对话链接，或卡上的对话名就是这行的标题
const waitFor = (r, waits) => {
  const url = r.open?.conversation?.url;
  return waits.find((x) => (url && x.open?.conversation?.url === url) || (x.conversation_title && r.title && x.conversation_title === r.title)) || null;
};
// 一行：状态 · 主行（永远不用标题：本人“驾驶舱肯定不能取标题”）· 小字（对话名/任务名灰色标签 · 进展 · 型号 · 助手 · 多久前还在动）
// 主行依次用：在等你回话的写“在等你回话：{卡上的问题}”（对不上卡用进展那句）；doing“正在做：……”（第几步小字）→ progress 那句 →
// latest_reply 它最近一条回复的第一句（带时间）→ 都没有写“还没写进展”
function runRowOf(r, ctx, viewer, waits = []) {
  const [word, color, mark] = RUN_LOOK[r.status];
  const waiting = r.status === 'waiting_owner';
  const w = waiting ? waitFor(r, waits) : null;
  const reply = r.latest_reply;
  const q = w ? clean(w.title) : '';
  let main = '', from = '';
  if (waiting && (q || r.progress || reply)) { main = '在等你回话：' + (q || r.progress?.text || reply.text); from = q ? 'card' : r.progress ? 'progress' : 'reply'; }
  else if (r.doing) { main = `正在做：${r.doing}`; from = 'doing'; }
  else if (r.progress) { main = r.progress.text; from = 'progress'; }
  else if (reply) { main = `最近回复：${reply.text}`; from = 'reply'; }
  else main = waiting ? '在等你回话' : '还没写进展';
  const step = from === 'doing' && r.step_index ? `第 ${r.step_index} 步${r.step_total ? `/共 ${r.step_total} 步` : ''}` : from === 'reply' && reply.at ? `${reply.approx ? '约 ' : ''}${when(reply.at, ctx.now)} 回的` : '';
  const moved = ago(r.last_activity_at || r.progress?.at, ctx.now);
  const second = [from !== 'progress' && from !== 'card' && r.progress ? r.progress.text : '', modelOf(r),
    (/它叫了 \d+ 个助手(?:，\d+ 个在干活)?/.exec(helperText(r.detail)) || [])[0] || (r.helpers > 0 ? `它叫了 ${r.helpers} 个助手` : ''), moved ? `${moved}${r.last_activity_at ? '还在动' : '更新进展'}` : ''].filter(Boolean);
  const said = r.status_text && !/判断不了|没正常结束/.test(r.status_text) ? r.status_text : word;
  // 屏幕只保留路径的用途；复制仍使用源条目里的完整原文。
  // 引号用等价十六进制写法，避免资源校验器把正则字符类当成 JS 字符串。
  const visible = (s) => String(s || '').replace(/[A-Za-z]:[\\/][^\s，。；！？<>（）()\x22\x27]+/g, '电脑上的文件');
  main = visible(main);
  const box = ownerBox(r.copy_source || r, ctx, { extra: openGroup(r, viewer) });
  // 在干活、在等你回话的行主行已经说清了，状态那几个字只留给读屏；对上卡的，主行点一下跳到那张卡。
  // 别的状态（停了没做完、看不出在干嘛……）状态词写在主行开头、同一行接着往下排：左边那一列只放符号，任何宽度都不和主行叠在一起
  const quiet = r.status === 'running' || waiting;
  const wordHtml = `<span class="cp-run-word${quiet ? '' : ` is-${color}`}">${esc(said)}</span>`;
  const mainHtml = w ? `<a class="cp-run-doing cp-run-goto" href="#${esc(encodeURIComponent(w.id))}">${esc(main)}</a>` : `<span class="cp-run-doing${from ? '' : ' is-empty'}">${quiet ? '' : wordHtml}${esc(main)}</span>`;
  return `<li class="cp-run-row is-${r.status} is-live${actCls(r, ctx)}"${itemAttr(r)}><span class="cp-run-st is-${color}"><i aria-hidden="true">${mark}</i>${quiet ? wordHtml : ''}</span>`
    + mainHtml + (step ? `<small class="cp-run-step">${esc(step)}</small>` : '')
    + `<small class="cp-run-meta">${r.title ? `<span class="cp-run-name">${esc(visible(r.title))}</span>` : ''}${second.map((s) => esc(visible(s))).join(' · ')}</small>${box}</li>`;
}
function runBlock(v, ctx) {
  const a = v.ai_running;
  if (!a) return '';
  const pub = a.rows.some((r) => r.placeholder) || v.viewer?.kind === 'public';
  const at = a.observed_at && (ctx.offline || lagAt(a.observed_at, v)) ? `<span class="cp-run-at">${ctx.offline ? '读不到电脑，这是 ' : ''}${esc(when(a.observed_at, ctx.now))} 读到的</span>` : '';
  const off = ctx.offline ? ' is-off' : '';
  const gone = [...(a.stale_rows || []), ...(a.stopped_rows || [])].filter((r) => !a.rows.some((x) => x.id === r.id));
  const stale = !pub && gone.length ? `<details class="cp-run-stale" id="run-stale"><summary>另有 ${gone.length} 件已经停了</summary><ul class="cp-run-list">${gone.map((r) => runRowOf(r, ctx, v.viewer)).join('')}</ul></details>` : '';
  if (!a.count && !a.rows.length) return `<div class="cp-run is-empty${off}" id="ai-running">${blockHead(esc(a.unread ? 'AI 干活情况暂时读不全' : '现在没有 AI 在干活'), 'cp-run-head cp-run-none', at, 'cp-run-sum')}${stale}</div>`;
  const active = a.rows.filter((r) => !DONE_LIKE.includes(r.status));
  if (pub) {
    const head = `AI 在干活：${activeOf(a)} 个${stuckOf(a)}`;
    const models = active.length ? `<p class="cp-run-models">${esc(modelCounts(active))}</p>` : '';
    // 公开版只露件数，下面说清本人设备上还能看到什么，免得像什么都没写（本人 2026-10-31）
    const more = active.length ? '<p class="cp-run-private">在本人设备上，每个都单独一行：这件活此刻在做什么、做到哪一步、是不是在等人回话，还能直接打开那个对话，或复制给 AI 接着办。</p>' : '';
    return `<div class="cp-run is-public${off}" id="ai-running">${blockHead(esc(head.replace('AI 在干活：', 'AI 正在干活：')), 'cp-run-head', at, 'cp-run-sum')}${models}${more}</div>`;
  }
  const sorted = a.rows.map((r, i) => ({ r, i })).sort((x, y) => RUN_ORDER.indexOf(x.r.status) - RUN_ORDER.indexOf(y.r.status) || x.i - y.i).map(({ r }) => r);
  const stuck = sorted.filter((r) => r.stuck), rest = sorted.filter((r) => !stuck.includes(r));
  const waits = v.need_you.filter((x) => x.card_type === 'ai_wait' && !isPh(x) && x.id);
  const runRow = (r) => runRowOf(r, ctx, v.viewer, waits);
  return `<div class="cp-run${off}" id="ai-running">${blockHead(esc(runLine(a).replace('AI 在干活：', 'AI 正在干活：')), 'cp-run-head', at, 'cp-run-sum')}`
    + (stuck.length ? `<ul class="cp-run-list is-stuck">${stuck.map(runRow).join('')}</ul>` : '')
    // 每个对话一行直接列出来，不折叠（本人 10-31 12:51：看是哪几个也不需要，直接默认展开）
    + (rest.length ? `<ul class="cp-run-list" id="run-all">${rest.map(runRow).join('')}</ul>` : '')
    + stale + `</div>`;
}

// 首屏第一句：后端 verdict.text（10 月 29 日起就是首屏那一句）；旧数据是“要你做 1 件（……） · AI 在跟 63 件……”，只取第一段（AI 的事去“AI 的账本”）
const topSentence = (v) => {
  const parts = String(v.verdict.text || v.summary.text || '').trim().split(/\s*·\s*/);
  const one = parts.length > 1 ? (/^(要你|现在没有要你)/.test(parts[0]) ? parts[0] : '') : parts[0];
  // 一段里有好几句（后端 10 月 29 日起：“现在没有要你动手或回话的事。还有 8 件事等合适时候再办。AI 手上还有……”）：顶上只放第一句，后面几句下面各有一行
  const m = /^(.+?[。！？])\s*\S/.exec(one);
  return plain(m ? m[1] : one);
};
// 公开版：顶上那句的件数含私人事项、下面又只露出一部分时，那句下面一行“另 N 件是私人事项：在本人设备上能看到……”。
// N = 后端给的要你做的总件数 − 下面露出来的卡（占位行也算露出来）；几处总件数对不上、没有 private_count 或 N 比它还大，算不准就不写
const hiddenPrivate = (v) => {
  if (v.viewer?.kind !== 'public' && !v.need_you.some(isPh)) return 0;
  const totals = [v.overview?.owner_count, v.verdict?.need_you].filter(Number.isInteger);
  if (!totals.length || totals.some((t) => t !== totals[0]) || !Number.isInteger(v.private_count)) return 0;
  const shown = v.need_you.filter((x) => !['ai', 'know'].includes(x.ask_kind)).length;
  const n = totals[0] - shown;
  return n > 0 && n <= v.private_count ? n : 0;
};
// 标签页标题“(N) 驾驶舱”和图标红点用的件数：和顶上那块的“要你做 N 件”同一个数
export const needCount = (v, now, ctx) => ownerNow(v, now, ctx).n;
const overview = (v, ctx) => {
  if (!ctx.ov) return '';
  const off = ctx.ov.stale(v.overview, ctx.now.getTime());
  const { n, urgent, items, hidden } = ownerNow(v, ctx.now, ctx);
  const read = v.ok && !ctx.offline;
  // 页面刚打开、还没读到新数据时，首帧是构建网页那会儿的数：写明是几点的，整体灰着（样式在 cockpit.css 的 .cp-snap）
  // 构建时还不知道哪天被打开，这里总带日期（“10月12日 07:32”），过了零点也不会说错
  const snap = ctx.phase === 'snapshot' ? `<p class="cp-snap">${dot('unavailable')}这是 ${esc(v.served_at ? dateHm(v.served_at) : '早些时候')} 的数，不是现在的<span class="cp-snap-reading">，正在读最新…</span></p>` : '';
  if (!read && !v.need_you.length) return `<div class="cp-you is-off">${snap}<p class="cp-you-n">要你做的事还没读到</p><p class="cp-you-sub">${notRead(v.served_at, ctx.now)}</p></div>`;
  const late = items.some((i) => i.r.overdue || String(i.x.overdue_text || '').trim());
  const tag = !n ? '' : urgent ? `<span class="cp-you-tag is-urgent">${urgent === n ? (n === 1 ? '急' : '都急') : `${urgent} 件急`}</span>` : `<span class="cp-you-tag">${late ? '过了原定时间，但不急' : n === 1 ? '不急' : '都不急'}</span>`;
  // 没有要你做的事时不写“现在没有要你做的事 / 现在没有要你动手或回话的事”（本人 10-30：多余）；有事照旧写“要你做 N 件”和急不急
  const said = read && !hidden ? topSentence(v) : '';
  const quiet = !n && (!said || /^(现在)?没有要你/.test(said));
  const head = quiet ? '' : said ? `<span class="cp-you-said">${esc(said)}</span>` : `要你做 <b>${n}</b> 件`;
  // 本人设备：顶上一两行提示（点的处理写不回、通知没发出去、调度在排队），块末尾“你最近处理的（30 天）›”；后端没给就都不出
  const sub = !read && v.served_at ? `<p class="cp-you-sub">这是 ${esc(when(v.served_at, ctx.now))} 读到的</p>` : '';
  const hid = hiddenPrivate(v);
  const priv = hid ? `<p class="cp-you-sub cp-you-private">另 ${hid} 件是私人事项：在本人设备上能看到每件要做什么、为什么找本人、怎么办</p>` : '';
  return `<div class="cp-you${urgent ? ' is-urgent' : ''}${n ? '' : ' is-none'}${said ? ' is-said' : ''}">${snap}${quiet ? '' : `<p class="cp-you-n">${n ? '' : dot(COLOR_STATE[v.summary.color] || COLOR_STATE[v.verdict.color] || 'ok')}${head}${tag}</p>`}`
    + priv + sinceLine(ctx) + ownerWarn(v, ctx) + sub + recentBlock(v, ctx) + `</div>`;
};
// “你上次 23:10 来过，之后新冒出 2 件、AI 关掉 4 件”（本人 10-30 批准第 4 项）：ctx.since 由 client.js 按这台浏览器存的编号算，第一次打开、没有变化都不写
const sinceLine = (ctx) => { const t = sinceText(ctx.since, ctx.now); return t ? `<p class="cp-since">${esc(t)}</p>` : ''; };
// 首屏下半：三格（电脑 / 自动任务 / 备份）和健康分小字
const overviewTri = (v, ctx) => {
  if (!ctx.ov) return '';
  const off = ctx.ov.stale(v.overview, ctx.now.getTime());
  return tri(triCells(v, ctx, off)) + score(v, ctx, off);
};
// 手机和窄屏标题下面的三行状态条（本人 10-30 批准第 3 项）：要你做几件、AI 干活卡没卡住、电脑几分扣在哪，点哪行跳到哪块。
// 电脑版左栏已经有这些，cockpit.css 在 ≥1200 时不显示
export function strip(v, ctx) {
  if (!ctx.ov) return '';
  const row = (href, state, text) => (href ? `<a class="cp-strip-row" href="#${href}">` : '<p class="cp-strip-row">') + `${dot(state)}<span>${esc(text)}</span>` + (href ? '</a>' : '</p>');
  const rows = [];
  // ① 要你做：和顶上“要你做 N 件”、标签页标题同一个数
  if (v.ok || v.need_you.length) {
    const { n, urgent } = ownerNow(v, ctx.now, ctx);
    rows.push(n ? row('need-you', urgent ? 'red' : 'attention', `要你做 ${n} 件${urgent ? (urgent === n ? '，急' : `，${urgent} 件急`) : '，不急'}`) : row('', 'ok', '现在没有要你做的事'));
  }
  // ② AI 在干活：在干活的件数，卡住几个、要不要你看
  const a = v.ai_running;
  if (a) {
    const k = Number.isInteger(a.stuck_count) ? a.stuck_count : a.rows.filter((r) => r.stuck).length;
    const m = Math.min(k, a.rows.filter((r) => r.stuck && OWNER_STUCK.includes(r.status)).length);
    rows.push(!a.count && !a.rows.length ? row('ai-running', a.unread ? 'unavailable' : 'ok', a.unread ? 'AI 干活情况暂时读不全' : '现在没有 AI 在干活')
      : row('ai-running', m ? 'red' : k ? 'neutral' : 'ok', `AI 在干活 ${activeOf(a)} 个，${k ? `${k} 个卡住${m ? (m === k ? '，要你看' : `，${m} 个要你看`) : '，AI 在管'}` : '没卡住'}`));
  }
  // ③ 电脑健康分：几分、最大的那项扣分、谁在管
  const ov = v.overview, off = ctx.ov.stale(ov, ctx.now.getTime());
  if (off || !Number.isFinite(ov?.score)) rows.push(row('status', 'unavailable', `电脑：读不到${ov?.as_of ? `（上次 ${hm(ov.as_of)}）` : ''}`));
  else {
    const g = scoreGroups(ov)[0];
    const st = !g ? 'ok' : g.who === WHO_TEXT.neutral ? 'neutral' : g.who ? 'attention' : 'neutral';
    rows.push(row('status', st, `电脑 ${Math.round(ov.score)} 分：${g ? `${g.label}${g.who ? `，${g.who === WHO_TEXT.neutral ? 'AI 在修' : g.who}` : ''}` : '一切正常'}`));
  }
  return rows.join('');
}
// “AI 的账本”那一行：后端 ai_ledger_summary.text；没给时按 AI 在跟和过期的件数写
const ledgerText = (v) => v.ai_ledger_summary?.text || (() => {
  const n = v.counts.ai_following || v.ai_following.length, late = (v.ai_overdue || []).length;
  return n ? `AI 手上还有 ${n} 件自己的活${late ? `，${late} 件比它自己定的日子晚了` : ''}（不用你管）` : 'AI 自己手上的活（不用你管）';
})();
// 首屏的几行入口：AI 的账本 ›、你放着 N 件不急的事 ›、停了 3 天以上的数据卡收成一句
export function lines(v, ctx) {
  const mine = mineOf(v), n = mine.length + v.scheduled.length;
  // 两类分开说：等条件再办的（暂缓里你的）、已经排好日子的
  const kinds = [mine.length ? `等条件 ${mine.length}` : '', v.scheduled.length ? `排好日子 ${v.scheduled.length}` : ''].filter(Boolean).join(' · ');
  const wait = n ? `<details class="cp-fold cp-mine" id="mine-wait"><summary>你放着 ${n} 件（${kinds}）</summary><ul class="cp-list cp-wait">${mine.map((x) => waitRow(x, ctx)).join('')}${v.scheduled.map((x) => schedRow(x, ctx)).join('')}</ul></details>` : '';
  const { shown, hidden } = staleCards(v, ctx.now);
  const staleRow = (c) => `<li class="cp-fact" tabindex="0" title="${esc(c.text || '')}">${dot('unavailable')}<b>${esc(c.title)}</b><span>${esc(staleWho(c, v, ctx.now))}${c.observed_at ? `（最后一次 ${esc(when(c.observed_at, ctx.now))}）` : ''}</span></li>`;
  // 每样写清谁在管；挂满 3 天的不再在首屏列，收在“AI 的账本”的“停了的数据”里（本人 10-30 批准第 5 项；页面兜底，根治在后端）
  const more = hidden.length ? `<a class="cp-stale-more" href="/cockpit/ai/#stale-data">另 ${hidden.length} 样停了 3 天以上，在 AI 的账本里 ›</a>` : '';
  const stale = shown.length
    ? `<details class="cp-fold cp-stale-fold" id="stale-cards"><summary>${dot('unavailable')}${esc(`这些数据没再更新：${shown.map((c) => `${c.title}（${staleWho(c, v, ctx.now)}）`).join('；')}${hidden.length ? `；另 ${hidden.length} 样停了 ${STALE_DAYS} 天以上，在 AI 的账本里` : ''}`)}</summary><ul class="cp-facts is-stale">${shown.map(staleRow).join('')}</ul>${more ? `<p class="cp-line">${more}</p>` : ''}</details>`
    : more ? `<p class="cp-line cp-stale-line">${dot('unavailable')}${more}</p>` : '';
  return `<div class="cp-lines"><a class="cp-go" href="/cockpit/ai/">${esc(ledgerText(v))}</a>${wait}${stale}</div>`;
}
// 停了的数据（后端 stale_summary.ids 的卡，加上今天的动态里不是今天读到的卡）：每样写清谁在管；最后一次读到满 3 天的不再在首屏列
const STALE_DAYS = 3;
function staleCards(v, now) {
  const st = v.stale_summary;
  const cards = dedupeCards([...(st ? ['computer', 'remote', 'backup_cloud', 'today'].flatMap((k) => v.sections[k]).filter((c) => st.ids.includes(c.id)) : []), ...oldTodayCards(v, now)]);
  const old = (c) => { const t = Date.parse(c.observed_at || ''); return Number.isFinite(t) && now.getTime() - t >= STALE_DAYS * 864e5; };
  return { all: cards, shown: cards.filter((c) => !old(c)), hidden: cards.filter(old) };
}
// 谁在管：没有新记录的（学习进度这类，不代表出了毛病）写“N 天没有新记录”；采集停了的写“M/D 起读不到”。
// 后端在卡上给了处理方（ai_handling 一句话，或 handler.kind=running 真在处理）才写谁在管；没给就只写事实，不替后端说“AI 在查”
const handlerOf = (c) => (typeof c.ai_handling === 'string' && c.ai_handling.trim() ? c.ai_handling.trim().replace(/[。\s]+$/, '')
  : c.handler?.kind === 'running' ? 'AI 在处理' : '');
const staleWho = (c, v, now) => {
  const t = Date.parse(c.observed_at || ''), days = Number.isFinite(t) ? Math.floor((now.getTime() - t) / 864e5) : null;
  if (/没有新记录|不代表你没有/.test(c.text || '')) return days != null ? `${days ? `${days} 天` : '今天'}没有新记录` : '没有新记录';
  if (!v.stale_summary?.ids.includes(c.id) && !SOURCE_STOPPED.test(c.text || '')) return '今天还没读到新的';
  const md = Number.isFinite(t) ? new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Shanghai', month: 'numeric', day: 'numeric' }).format(new Date(t)) : '';
  const who = handlerOf(c);
  return `${md ? `${md} 起` : ''}读不到${who ? `，${who}` : ''}`;
};
// 二级页“停了的数据”：首屏收起的（满 3 天）和还在首屏的都列，停了的数据不会被藏起来
function staleLedger(v, ctx) {
  const { all, hidden } = staleCards(v, ctx.now);
  if (!all.length) return '';
  return `<p class="cp-know-note">首屏只列停了不满 ${STALE_DAYS} 天的；满 ${STALE_DAYS} 天的（${hidden.length} 样）只在这里。</p><ul class="cp-facts is-stale">${all.map((c) => `<li class="cp-fact" title="${esc(c.text || '')}">${dot('unavailable')}<b>${esc(c.title)}</b><span>${esc(staleWho(c, v, ctx.now))}${c.observed_at ? `（最后一次 ${esc(when(c.observed_at, ctx.now))}）` : ''}</span></li>`).join('')}</ul>`;
}
// 首屏中间：AI 正在干活 → 你得知道 → 几行入口
const home = (v, ctx) => runBlock(v, ctx) + knowBlock(v, ctx) + lines(v, ctx);

const LAMPS = { 'need-you': 'need_you', tasks: 'automation', computer: 'computer', backup: 'backup_cloud', projects: 'projects', today: 'today' };
// 分区标题旁的灯也只看要不要你出手：没有要你做的，“要处理”换成中性色“AI 在管”；项目区有等你动手的项目才保留红黄
const lampOf = (key) => (v, ctx) => {
  if (!ctx.ov) return '';
  const off = ctx.ov.stale(v.overview, ctx.now.getTime()), sec = v.overview?.sections?.[key];
  if (!off && sec && COLOR_STATE[sec.color]) {
    const st = COLOR_STATE[sec.color];
    // 本人 10-30 批准第 5 项：五个一模一样的“AI 在管”等于没写；正常、AI 在管都不挂，只在要你看、读不到时挂
    if (st === 'neutral' || st === 'ok') return '';
    if (st === 'unavailable') return ctx.ov.lamp(null, true);
    return ctx.ov.lamp({ ...sec, level: st === 'red' ? 'act' : 'watch', word: key === 'need_you' ? '要你处理' : '要你看' }, false);
  }
  if (off || !sec) return ctx.ov.lamp(sec, true);
  if (key === 'need_you' || !['act', 'watch'].includes(sec.level)) return ['act', 'watch'].includes(sec.level) ? ctx.ov.lamp(sec, false) : '';
  const st = key === 'projects' && v.projects.items.some((p) => p.waiting_user > 0) ? LV[sec.level] : ownerState(sec.level, sec);
  if (st === 'neutral' || st === 'ok') return '';
  return ctx.ov.lamp({ ...sec, level: st === 'red' ? 'act' : 'watch', word: '要你看' }, false);
};
// 二级页电脑版（宽度 ≥1200）的表格。窄屏照旧是上面的列表；两样都画，cockpit.css 按宽度只显示一样（表格行不带 data-items，通知跳转找列表那行）。
// 筛选（全部 / 晚了 / 没晚、输入几个字）和勾选记在 client.js 的 act.ui（下面两个键），重画时照样画出来
export const LF_KEY = '\u0000ledger-filter', LB_KEY = '\u0000ledger-batch';
const cellNote = (x, ctx) => (isPh(x) ? '' : ledgerBox(x, ctx));
// 表格行的编号只给“新”标记用（seen.js 的 newCss），不叫 data-items，免得通知跳转找到看不见的那处
const rowIds = (x) => (typeof x?.id === 'string' && x.id.trim() ? ` data-ids="${esc(x.id.trim())}"` : '');
function followTable(v, ctx) {
  const now = ctx.now;
  const lr = ledgerRows(v);
  const rows = [...lr.late.map((e) => ({ ...e, late: true })), ...lr.rest.map((e) => ({ ...e, late: false }))];
  if (!rows.length) return '';
  const f = ctx.act?.ui?.get(LF_KEY) || {}, show = ['late', 'ok'].includes(f.show) ? f.show : 'all', q = String(f.q || '').trim().toLowerCase();
  const nLate = lr.lateAll.length, nAll = nLate + lr.restAll.length;
  // 一行都不能回话（公开版、后端没给按钮）时不留最后那一列
  const anyAct = ctx.viewer?.kind === 'owner' && rows.some(({ x }) => !isPh(x));
  const tr = ({ x, late, more }) => {
    const title = isPh(x) ? x.title || PRIVATE_TITLE : plain(clean(x.title) || x.project || '');
    const d = Number(x.overdue_days), days = x.registration_unknown ? 14 : Number.isFinite(x.age_days) ? x.age_days : null;
    // 该有结果的日子：AI 新定的期限优先，原定日子放小字；都没有写“—”；没晚只说给有日子、日子还没过的
    const due = ledgerDue(x, now);
    const lag = !late ? '' : x.awaiting_ai_decision ? `跟了 ${days ?? 14} 天没结果` : d >= 1 ? `晚 ${d} 天` : x.overdue_since ? '刚过不到 1 天' : '没定日子';
    const fine = !late && due && !(due.at != null && due.at < now.getTime());
    const prog = isPh(x) ? '' : plain(progressOf(x) || (LATE_CODES.includes(x.stuck_reason) ? '' : stuckWhy(x.stuck_reason)));
    const checked = isPh(x) ? '' : x.last_checked_at ? checkedAgo(x.last_checked_at, now) : '';
    const hay = [title, x.project, prog, x.decision_summary].filter(Boolean).join(' ').toLowerCase();
    const hide = (show === 'late' && !late) || (show === 'ok' && late) || (q && !hay.includes(q));
    return `<tr class="${late ? 'is-late' : 'is-ok'}${phCls(x)}${actCls(x, ctx)}"${rowIds(x)}${hide ? ' hidden' : ''}>`
      + `<td class="cp-lt-what">${isPh(x) ? `<span title="${PH_HINT}">${esc(title)}</span>${moreText(more)}` : `<span class="cp-lt-title">${esc(title)}${ownTag(x)}</span>${prog && String(x.owner_detail || '').includes(prog) ? '' : detail(x)}${decLine(x, 'dect')}`}</td>`
      + `<td class="cp-lt-due">${due ? `${esc(due.text)}${due.old ? `<small>${esc(due.old)}</small>` : ''}` : '—'}</td><td class="cp-lt-lag">${lag ? `<span class="cp-lt-late">${esc(lag)}</span>` : `<span class="cp-lt-none">${fine ? '没晚' : '—'}</span>`}</td>`
      + `<td class="cp-lt-prog">${prog ? `<span>${esc(prog)}</span>` : ''}${checked ? `<small>${esc(checked)}</small>` : ''}</td>`
      + (anyAct ? `<td class="cp-lt-act">${cellNote(x, ctx)}</td>` : '') + `</tr>`;
  };
  const body = rows.map(tr).join('');
  // 件数都按条目算：合成一行的同类私人事项按它代表的件数，说明还没写全不单列的也算在全部、晚了、没晚里
  const blankLate = lr.lateAll.filter(bare).length, blankRest = lr.restAll.filter(bare).length;
  const shown = rows.filter((r) => !((show === 'late' && !r.late) || (show === 'ok' && r.late))).reduce((s, r) => s + 1 + r.more, 0) + (show === 'late' ? blankLate : show === 'ok' ? blankRest : blankLate + blankRest);
  const chip = (k, label, n) => `<button type="button" class="cp-q-mode" data-lshow="${k}" aria-pressed="${show === k}">${label} ${n}</button>`;
  return `<div class="cp-lt" id="ai-following-table"><div class="cp-lt-bar"><span class="cp-q-modes" role="group" aria-label="看哪些">${chip('all', '全部', nAll)}${chip('late', '晚了', nLate)}${chip('ok', '没晚', nAll - nLate)}</span>`
    + `<input type="search" class="cp-lt-find" data-lfilter value="${esc(f.q || '')}" placeholder="筛选：输入几个字" aria-label="筛选 AI 在跟的事">${q ? `<small class="cp-lt-count">按“${esc(f.q.trim())}”筛</small>` : shown < nAll ? `<small class="cp-lt-count">显示 ${shown} 件</small>` : ''}</div>`
    + `<table class="cp-ltable"><thead><tr><th class="cp-lt-what">事项</th><th class="cp-lt-due">该有结果的日子</th><th class="cp-lt-lag">晚几天</th><th class="cp-lt-prog">最近进展</th>${anyAct ? '<th class="cp-lt-act"><span class="cp-vh">处理和复制</span></th>' : ''}</tr></thead><tbody>${body}</tbody></table>`
    + `<p class="cp-lt-empty" hidden>没有对得上的</p>${unlisted(lr, 'cp-lt-more')}</div>`;
}
function decisionsTable(v, ctx) {
  const list = (v.must_know?.items || []).filter((k) => k.kind === 'ai_decision' && (isPh(k) || (typeof k.text === 'string' && k.text)));
  if (!list.length) return '';
  const anyAct = ctx.viewer?.kind === 'owner' && list.some((k) => !isPh(k));
  const tr = (k) => {
    if (isPh(k)) return `<tr class="is-private"${rowIds(k)}><td class="cp-lt-what" colspan="4"><span title="${PH_HINT}">${esc(k.title || PRIVATE_TITLE)}</span></td>${anyAct ? '<td class="cp-lt-act"></td>' : ''}</tr>`;
    const d = splitDecision(k);
    const basis = d?.basis ? (CODE.test(d.basis) ? `<details class="cp-tech" id="dect-${esc(knowId(k))}"><summary>技术细节</summary><p>${esc(d.basis)}</p></details>` : esc(plain(d.basis))) : '';
    return `<tr class="is-ai_decision${actCls(k, ctx)}"${rowIds(k)}>`
      + `<td class="cp-lt-what"><span class="cp-lt-title">${esc(d ? d.topic : k.text)}${ownTag(k)}</span>${detail(k)}</td><td class="cp-lt-dec">${d ? esc(d.decision) : ''}</td>`
      + `<td class="cp-lt-why">${basis}</td><td class="cp-lt-at">${k.at ? esc(when(k.at, ctx.now)) : ''}</td>`
      + (anyAct ? `<td class="cp-lt-act">${ledgerBox(k, ctx)}</td>` : '') + `</tr>`;
  };
  return `<div class="cp-lt" id="ai-decided-table"><table class="cp-ltable is-dec"><thead><tr><th class="cp-lt-what">事项</th><th class="cp-lt-dec">定了什么</th><th class="cp-lt-why">原因</th><th class="cp-lt-at">时间</th>${anyAct ? '<th class="cp-lt-act"><span class="cp-vh">处理和复制</span></th>' : ''}</tr></thead><tbody>${list.map(tr).join('')}</tbody></table></div>`;
}
// 二级页“AI 的账本”（/cockpit/ai/）：AI 在跟、晚了的、它自己定了的、等条件的、每周体检和项目后台。都不用本人管，想看时点进来
export function ledger(v, ctx) {
  const theirs = theirsOf(v), health = govRun(v, ctx) + aiWork(v, ctx);
  const snap = ctx.phase === 'snapshot' ? `<p class="cp-snap">${dot('unavailable')}这是 ${esc(v.served_at ? dateHm(v.served_at) : '早些时候')} 的数，不是现在的<span class="cp-snap-reading">，正在读最新…</span></p>`
    // 读过之后又读不到电脑：照样列着上次的数，但写明是几点的，不让旧数看起来像实时
    : ctx.offline ? `<p class="cp-snap">${dot('unavailable')}读不到电脑，这是 ${esc(v.served_at ? when(v.served_at, ctx.now) : '早些时候')} 的数</p>` : '';
  // 1700 宽以上左边一列小目录
  const stale = staleLedger(v, ctx);
  const toc = [['ai-following', 'AI 在跟'], ['ai-decided', 'AI 自己定了的'], theirs.length ? ['ai-wait', 'AI 等条件再做的'] : null, health ? ['ai-health', '体检和项目后台'] : null, stale ? ['stale-data', '停了的数据'] : null].filter(Boolean);
  return `<nav class="cp-ledger-toc" aria-label="这页有什么">${toc.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</nav>`
    + snap + `<p class="cp-ledger-sum">${dot('neutral')}${esc(ledgerText(v))}</p>` + sinceLine(ctx)
    + `<section class="cp-ledger-sec" id="ai-following"><h2>AI 在跟</h2>${aiFollowing(v, ctx)}${followTable(v, ctx)}</section>`
    + `<section class="cp-ledger-sec" id="ai-decided"><h2>AI 自己定了的</h2>${decisionsBlock(v, ctx)}${decisionsTable(v, ctx)}</section>`
    + (theirs.length ? `<section class="cp-ledger-sec" id="ai-wait"><h2>AI 等条件再做的</h2><ul class="cp-list cp-wait">${theirs.map((x) => waitRow(x, ctx, [])).join('')}</ul></section>` : '')
    + (health ? `<section class="cp-ledger-sec" id="ai-health"><h2>每周体检和项目后台</h2>${health}</section>` : '')
    + (stale ? `<section class="cp-ledger-sec" id="stale-data"><h2>停了的数据</h2>${stale}</section>` : '');
}
// 电脑版顶栏右端：哪台设备、几点读到（窄屏不出，那里看标题下的小字）；配对结果、授权失效这类提示也写在这里
export function meta(v, ctx) {
  const w = v.viewer, owner = w?.kind === 'owner', n = v.private_count, waiting = pairedWaiting(v, ctx);
  const who = owner ? w.device_machine || '你的设备' : waiting ? '你的设备' : w ? '公开版' : '';
  const at = ctx.offline ? `读不到电脑${v.served_at ? `（最后 ${when(v.served_at, ctx.now)}）` : ''}` : !v.served_at ? '还没读到'
    : ctx.phase === 'snapshot' ? `${dateHm(v.served_at)} 的数` : `${when(v.served_at, ctx.now)} 读到`;
  const sub = owner ? (n > 0 ? `全部显示，其中 ${n} 件公网看不到` : '全部显示') : waiting ? PAIRED_WAIT : n > 0 ? `${n} 件私人事项只在本人设备上显示` : '';
  return (ctx.notice ? `<span class="cp-meta-note">${esc(ctx.notice)}</span>` : '')
    + `<span class="cp-meta-at">${esc([who, at].filter(Boolean).join(' · '))}</span>` + (sub ? `<span class="cp-meta-sub">${esc(sub)}</span>` : '');
}
// 今天几号（北京时间，跨过零点浏览器里会自动换）
const todayDate = (v, ctx) => new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', month: 'long', day: 'numeric', weekday: 'long' }).format(ctx.now).replace(/(\d+)月(\d+)日/, '$1 月 $2 日 ') + ' · 北京时间 0 点起';
export const REGIONS = Object.fromEntries(Object.entries({ overview, strip, 'overview-tri': overviewTri, 'need-you': needCards, home, tasks: tasksSum, security, computer, backup, projects, today: todayBlock, 'today-date': todayDate, viewer: viewerLine, meta, ledger,
  'action-toast': (_v, ctx) => actionToast(ctx), ...Object.fromEntries(Object.entries(LAMPS).map(([id, key]) => ['lamp-' + id, lampOf(key)])) }).map(([key, render]) => [key, (v, ctx = {}) => render(v, { ...ctx, viewer: v.viewer })]));

// 各区标题下原来的说明句（本人 10-30 批准第 5 项：天天看的人用不上）收进“这页怎么用”（?）里
const SECTIONS = [['tasks', '自动任务', '电脑自己在做的事，有没有按时做、做成没有。'], ['computer', '电脑', '这台电脑现在累不累、还剩多少地方；人不在电脑前能不能连上它。'],
  ['today', '今天的动态', '今天有什么变化：代码、你对 AI 说的话、今天发生的事。'], ['backup', '备份和云端', '东西有没有按时备份、云端的钱够不够。'], ['projects', '项目', '每个在用的项目现在怎么样、有没有等你的事。点名字进项目页。']];
// 整页：外框固定，内容由上面各函数填。电脑版单栏（本人 10-30 选定 A 版）：横幅（标题、读取时间、总述 | 插画和小鸟）→ 五格（电脑、自动任务、备份、安全和授权、健康分）
// → 要你做 → AI 正在干活 → 你得知道和几行入口 → 自动任务（今天的河默认展开）→ 电脑 → 今天的动态 → 备份和云端 → 项目；事实区正常的只占一行。
// 手机和窄屏照旧：标题总述、三行状态条、要你做、AI 正在干活、你得知道、状态一览、其余各块，插画放页尾（cockpit.css 排位）
export function page(v, ctx) {
  ctx = { ...ctx, viewer: v.viewer };
  const r = (k) => '<div class="cp-body" data-cp="' + k + '">' + REGIONS[k](v, ctx) + '</div>';
  const sec = (id, title, sub, body) => '<section class="cp-section" id="' + id + '">'
    + blockHead('<span class="cp-section-title">' + esc(title) + '</span>', 'cp-head',
      '<span class="cp-lamp" data-cp="lamp-' + id + '">' + REGIONS['lamp-' + id](v, ctx) + '</span>'
      + (id === 'today' ? '<span class="cp-date" data-cp="today-date">' + todayDate(v, ctx) + '</span>' : ''))
    + body + '</section>';
  const help = '<details class="cp-help" id="cp-help"><summary class="cp-tool ct-inline-action" title="这页怎么用" aria-label="这页怎么用">?</summary><div class="cp-help-pop">'
    + '<p><b>这页怎么用</b></p><p>最上面是要你做的事；下面是你得知道和 AI 在干的活，再往下是各项明细。每条可复制给 AI，选项和确认内容也会一起带过去。</p>'
    + '<p>AI 自己的活收在“AI 的账本”。每分钟从电脑读一次（页面在后台时每 3 分钟一次），时间都是北京时间；↻ 立刻重读。</p>'
    + '<p><b>公开版和本人设备</b></p><p>别人打开看到的是公开版：私人事项只写件数或“私人事项”，AI 正在干的活只写个数，也没有按钮。'
    + '配对过的本人设备上能看到私人事项的原文和要做什么、为什么、怎么办，AI 每件活此刻做到哪一步并能直接打开那个对话，今天的河里私人任务的名字和结论；每条后面还有“复制给 AI”“知道了”“晚点提醒”。</p>'
    + '<p><b>键盘</b></p><dl class="cp-keys"><dt><kbd>j</kbd> <kbd>k</kbd></dt><dd>下一件、上一件</dd><dt><kbd>1</kbd>—<kbd>9</kbd></dt><dd>直接打开第几件</dd>'
    + '<dt><kbd>o</kbd></dt><dd>打开那个对话</dd><dt><kbd>s</kbd></dt><dd>晚点提醒</dd><dt><kbd>u</kbd></dt><dd>撤回刚才那下</dd><dt><kbd>?</kbd></dt><dd>打开、关上这个说明</dd></dl>'
    + '<p><b>下面各块</b></p><dl class="cp-keys cp-help-secs">' + SECTIONS.map(([, title, sub]) => '<dt>' + esc(title) + '</dt><dd>' + esc(sub) + '</dd>').join('') + '</dl>'
    + '<p>分区标题旁只在要你看或读不到时挂标签；几点读到只在顶上写一次，某块比它旧 15 分钟以上才另写。</p></div></details>';
  return '<div class="cp-action-toast" data-cp="action-toast">' + actionToast(ctx) + '</div>'
    + '<section class="cp-dashboard c-text" id="top"><div class="cp-banner">'
    + '<div class="cp-intro cp-hero-copy"><h1 class="cp-main-title"><img src="' + src(ctx, 'cockpit-01-title-01.png') + '" alt="" width="483" height="198" loading="eager"><span class="cp-h1-text">驾驶舱</span></h1>'
    + '<div class="cp-tools"><p class="cp-meta" data-cp="meta" role="status">' + meta(v, ctx) + '</p>'
    + '<button type="button" class="cp-tool ct-inline-action" data-cp-reload title="立刻重读电脑" aria-label="立刻重读电脑">↻</button>' + help + '</div>'
    + '<p class="cp-viewer" data-cp="viewer" role="status">' + viewerLine(v, ctx) + '</p>'
    + '<div class="cp-overview" data-cp="overview">' + overview(v, ctx) + '</div><nav class="cp-strip" data-cp="strip" aria-label="现在的情况">' + strip(v, ctx) + '</nav></div>'
    + '<figure class="cp-hero-art"' + (ctx.birdConfig ? ' data-living-config="' + ctx.birdConfig + '"' : '') + '><img src="' + src(ctx, 'cockpit-01-illustration-01.png') + '" alt="" width="866" height="326" loading="eager" crossorigin="anonymous"></figure></div>'
    // 五格：电脑 / 自动任务 / 备份（overview-tri 的前三格）、安全和授权（security）、健康分（overview-tri 的最后一块）；外框 display: contents，五格直接排进同一个网格
    + '<div class="cp-status c-hub-stats" id="status">' + blockHead('状态一览', 'cp-mobile-status-heading')
    + '<div class="cp-overview-tri" data-cp="overview-tri">' + overviewTri(v, ctx) + '</div>'
    + '<div class="cp-sec-cell" data-cp="security">' + security(v, ctx) + '</div></div>'
    + '<div class="cp-workspace c-text"><div class="cp-need" id="need-you" data-cp="need-you">' + needCards(v, ctx) + '</div>'
    + '<div class="cp-home" data-cp="home">' + home(v, ctx) + '</div><div class="cp-facts-wall">'
    // 今天的河默认展开（本人 10-30）；构建时有任务就先按河图比例占好位置（cockpit.css 的 .cp-river.is-expected），河画进来时不推挤下面
    + sec('tasks', '自动任务', '', r('tasks') + '<details class="cp-fold cp-river-fold" id="river" open><summary>今天的河：每条船是一个自动任务，点开看它在做什么、怎么停</summary><div class="cp-river' + (v.automation.items.length ? ' is-expected' : '') + '" data-today-river aria-label="今天的河"></div></details>')
    + sec('computer', '电脑', '', r('computer'))
    + sec('today', '今天的动态', '', r('today'))
    + sec('backup', '备份和云端', '', r('backup'))
    + sec('projects', '项目', '', r('projects'))
    + '</div></div></section>';
}

// 二级页整页（/cockpit/ai/）
export function ledgerPage(v, ctx) {
  ctx = { ...ctx, viewer: v.viewer };
  return `<section class="cp-section cp-ledger c-text" id="top"><p class="cp-back"><a href="/cockpit/">← 回驾驶舱</a></p><h1 class="cp-ledger-h1">AI 的账本</h1>`
    + `<p class="cp-lead">AI 自己手上的活：在跟的、晚了的、它自己定了的、每周体检。都不用你管，想看时进来看看。</p>`
    + `<p class="cp-viewer" data-cp="viewer" role="status">${viewerLine(v, ctx)}</p><div class="cp-action-toast" data-cp="action-toast">${actionToast(ctx)}</div><div class="cp-body" data-cp="ledger">${ledger(v, ctx)}</div></section>`;
}
