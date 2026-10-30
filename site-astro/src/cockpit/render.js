// 驾驶舱各块的 HTML。构建时用最近一份快照画出首帧，浏览器拿到新数据后用同一组函数原地换掉每块里面的内容。
// 每块外框（[data-cp] 所在的元素）始终在，数据没到只换字，不出空框、不换版式。
import { hm, dateHm, when, ago, light, dedupeCards, isToday, govState } from './model.js';
import { actCls, ownerBox, recentBlock, ownerWarn, questionsFor, actionToast } from './actions.js';

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
  const details = Array.isArray(c.details) ? c.details.filter((d) => d && (d.title || d.text)) : [];
  return `<article class="cp-card is-${light(state)} ct-card${off ? ' is-off' : ''}"><h3>${dot(state)}${esc(c.title)}</h3><p>${text}</p>` + trig
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
const foldFact = (c, now, off) => {
  const st = off ? 'unavailable' : cardState(c), missing = c.state === 'unavailable' || c.state === 'reading';
  // 读不到的那一行先说是几点读到的（点开才是那时的值），不把旧值当现在的写在外面
  const gap = c.observed_at ? ago(c.observed_at, now).replace(/^刚刚$/, '').replace(/前$/, '') : '';
  const say = missing ? (c.observed_at ? `这是 ${when(c.observed_at, now)} 读到的，之后${gap ? ' ' + gap : ''}没读到新的` : '还没读到') : factText(c) || (st === 'neutral' ? 'AI 在管' : '没读到');
  return `<li class="cp-fact is-fold"><details><summary>${dot(st)}<b>${esc(c.title)}</b><span>${esc(say)}</span></summary>${card(c, now, off)}</details></li>`;
};
export function factCards(cards, now, off = false) {
  const st = (c) => (off ? 'unavailable' : cardState(c));
  const big = cards.filter((c) => !off && !['ok', ...FOLD_STATES].includes(st(c)));
  const lines = cards.filter((c) => !big.includes(c));
  // 收成一行的卡不各写时间，这一组末尾写一次几点读到的（读不到电脑时写最后几点读到）
  const t = lines.map((c) => Date.parse(c.observed_at || '')).filter(Number.isFinite);
  const last = t.length ? new Date(Math.max(...t)).toISOString() : '';
  // 比这一组最新的读数旧 15 分钟以上的那一行，自己写上几点读到的
  const note = (c) => { const x = Date.parse(c.observed_at || ''); return Number.isFinite(x) && Date.parse(last) - x > 9e5 ? `（${when(c.observed_at, now)} 读到）` : ''; };
  const atLine = last ? `<p class="cp-time cp-facts-at">${off ? `读不到（最后 ${esc(when(last, now))} 读到）` : `${esc(when(last, now))} 读到`}</p>` : '';
  return (big.length ? `<div class="cp-grid">${big.map((c) => card(c, now, off)).join('')}</div>` : '')
    + (lines.length ? `<ul class="cp-facts">${lines.map((c) => (st(c) === 'ok' ? factLine(c, '', note(c)) : foldFact(c, now, off))).join('')}</ul>${atLine}` : '');
}
// 停了 3 天以上、已收进“这几块数据停了”那一句的卡（后端 stale_summary.ids），各区不再单独列
const staleIds = (v) => new Set(v.stale_summary?.ids || []);
const oldTodayCards = (v, now) => v.sections.today.filter((c) => c.id !== 'today_changes' && !isToday(c.observed_at, now));


// 安全和授权：只显示，点了去授权页对应卡片办理（锚点和 O3 对齐）；数据来源和判定不变，首屏只放这一处
export function security(v, ctx) {
  const s = v.security, pd = s.personal_data.state, un = s.unrestricted.state, win = s.windows.state;
  const off = ctx.offline || !v.ok;
  const unread = off || ctx.phase === 'snapshot';
  const lastRead = s.observed_at ? '上次 ' + when(s.observed_at, ctx.now) + ' 读到' : '还没读到过';
  const missing = ['没读到', lastRead, 'gray'];
  const rows = [
    ['cockpit-07-icon-01.png', '个人资料', unread ? missing : pd === 'unlocked' ? ['已解锁', s.personal_data.expires_at ? '到 ' + dateHm(s.personal_data.expires_at) : '', 'ok'] : pd === 'locked' ? ['锁着', '要用时再解锁', 'gray'] : ['没读到', '', 'gray'], '/computer-access/#personal-data'],
    ['cockpit-07-icon-02.png', '无限制授权', unread ? missing : un === 'active' ? ['开着', s.unrestricted.expires_at ? '到 ' + dateHm(s.unrestricted.expires_at) : '', 'attention'] : un === 'inactive' ? ['正常关着', '', 'gray'] : ['没读到', '', 'gray'], '/computer-access/#unrestricted'],
    ['cockpit-07-icon-03.png', 'Windows', unread ? missing : win === 'locked' ? ['已锁屏', '', 'ok'] : win === 'unlocked' ? ['未锁屏', '', 'ok'] : ['没读到', '', 'gray'], '/computer-access/#windows'],
    // 这里只说“连不连得上”；电脑好不好看上面“电脑”那一格
    ['', '能不能连上电脑', off ? ['连不上', s.observed_at ? '上次 ' + when(s.observed_at, ctx.now) : '', 'gray'] : ['能', s.computer.uptime_hours != null ? `开机 ${s.computer.uptime_hours} 小时` : '', 'ok'], '/computer-access/'],
  ];
  // 手机上四项压成一行（电脑宽度照旧四格）
  const words = unread ? [`资料、授权和锁屏状态没读到（${lastRead}）`] : [pd === 'unlocked' ? `资料已解锁${s.personal_data.expires_at ? '到 ' + dateHm(s.personal_data.expires_at) : ''}` : pd === 'locked' ? '资料锁着' : '资料没读到',
    un === 'active' ? `无限制授权开着${s.unrestricted.expires_at ? '到 ' + dateHm(s.unrestricted.expires_at) : ''}` : un === 'inactive' ? '无限制授权关' : '无限制授权没读到',
    win === 'locked' ? '已锁屏' : win === 'unlocked' ? '未锁屏' : '锁屏没读到'];
  words.push(off ? `连不上电脑${s.observed_at ? '（最后 ' + when(s.observed_at, ctx.now) + '）' : ''}` : '能连上');
  const line = `<a class="cp-sec-line" href="/computer-access/">${dot(unread ? 'unavailable' : un === 'active' ? 'attention' : 'ok')}<span>${words.map(esc).join(' · ')}</span><b aria-hidden="true">▸</b></a>`;
  return line + rows.map(([icon, label, [word, sub, state], href]) => `<a class="cp-sec-item" href="${href}">`
    + (icon ? `<img src="${src(ctx, icon)}" alt="" width="58" height="35" loading="eager">` : `<span class="cp-sec-pc" aria-hidden="true"></span>`)
    + `<span class="cp-sec-label">${label}</span><span class="cp-sec-word">${dot(state)}${esc(word)}</span><span class="cp-sec-sub">${esc(sub)}</span><span class="cp-sec-go">${href === '/computer-access/' ? '看连接状态 →' : '去授权页办理 →'}</span></a>`).join('');
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
  if (isPh(x)) return `<article class="cp-ask is-private ct-card" id="${esc(todoId(x))}"${itemAttr(x)}><div class="cp-ask-main"><h3 class="cp-ask-title" title="${PH_HINT}">${dot('unavailable')}<span>${esc(x.title || PRIVATE_TITLE)}</span></h3><p class="cp-ask-why">${PH_HINT}</p></div></article>`;
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
function aiFollowing(v, ctx) {
  const now = ctx.now;
  const row = ({ x, more }, small) => `<li${liCls(x, ctx)}${itemAttr(x)}>${rowText(x, plain(clean(x.title) || x.project), esc(small))}${moreText(more)}${decLine(x, 'decl')}${ledgerBox(x, ctx)}</li>`;
  if (v.ai_overdue) {
    const late = [...v.ai_overdue].filter((x) => !bare(x)).sort(byLate);
    const lines = mergePh(late).map((e) => {
      const x = e.x, at = x.overdue_since ? dayText(x.overdue_since, now) : '';
      const d = Number(x.overdue_days), days = x.registration_unknown ? 14 : Number.isFinite(x.age_days) ? x.age_days : null;
      const why = x.awaiting_ai_decision ? `跟了 ${days ?? 14} 天还没结果，AI 这周要么定期限修好，要么结束` : at ? `原定 ${at}${d >= 1 ? `，晚了 ${d} 天` : '，刚过不到 1 天'}` : '没写哪天该有结果，AI 在补上期限';
      return row(e, [why, plain(progressOf(x) || (LATE_CODES.includes(x.stuck_reason) ? '' : stuckWhy(x.stuck_reason)))].filter(Boolean).join(' · '));
    }).join('');
    const lateIds = new Set(v.ai_overdue.map((x) => x.id));
    const rest = v.ai_following.filter((x) => !lateIds.has(x.id) && !bare(x));
    // 其余的分两类说：有日子还没到的、根本没定日子的（不把没定日子的说成“还没到日子”）
    const dated = rest.filter((x) => ledgerDue(x, now)).length, undated = rest.length - dated;
    const restSum = `其余 ${rest.length} 件` + (undated ? `：${[dated ? `${dated} 件还没到日子` : '', `${undated} 件没定日子`].filter(Boolean).join('、')}` : '还没到日子');
    const restRow = (e) => { const due = ledgerDue(e.x, now); return row(e, [due ? `期限 ${due.text}${due.old ? `（${due.old}）` : ''}` : '没定日子', e.x.last_checked_at ? checkedAgo(e.x.last_checked_at, now) : ''].filter(Boolean).join(' · ')); };
    const restList = rest.length ? `<details class="cp-more" id="ai-rest"><summary>${restSum}</summary><ul class="cp-ailist">${mergePh(rest).map(restRow).join('')}</ul></details>` : '';
    return `<div class="cp-ai" id="ai">${late.length ? `<p class="cp-ai-cap">${dot('neutral')}AI 自己有 ${late.length} 件晚了，在补（不用你管）</p><ul class="cp-ailist">${lines}</ul>` : `<p class="cp-line">${dot('ok')}AI 自己的活都没晚。</p>`}${restList}</div>`;
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

// 电脑：正常的读数各占一行，要留意的整张卡；远程连接正常时也是一行；图表链接一行
export function computer(v, ctx) {
  const g = v.grafana, off = !!ctx.offline, stale = staleIds(v);
  const cards = dedupeCards(v.sections.computer).filter((c) => !stale.has(c.id));
  // 副机在线不在线看 laptop.connection；laptop.state 是副机自动任务的健康，不能当连接
  const lap = LAPTOP[v.laptop.connection];
  // “你得知道”里有正在修的网络问题时，后端在远程卡上给 must_know_id（文字是“此刻能连上；间歇断开还在查”），点了跳到“你得知道”那一条
  const remoteCards = dedupeCards(v.sections.remote).filter((c) => !stale.has(c.id));
  const net = !off && remoteCards.find((c) => c.must_know_id);
  const remoteOk = !off && !net && remoteCards.length > 0 && remoteCards.every((c) => cardState(c) === 'ok');
  const remote = remoteOk
    ? `<ul class="cp-facts">${remoteCards.map((c, i) => factLine(c, i ? '' : ' id="remote"')).join('')}${lap ? `<li class="cp-fact">${dot(lap[1])}<b>笔记本（副机）</b><span>${lap[0]}</span></li>` : ''}</ul>`
    : `<div class="cp-grid">${(remoteCards.map((c) => card(c, ctx.now, off)).join('') || card({ title: '远程连接', state: 'unavailable', text: '' }, ctx.now, off)).replace('<article ', '<article id="remote" ')
      .replace(/<\/p>/, (m) => m + (net ? `<p class="cp-net"><a href="#${esc(knowId({ id: net.must_know_id }))}">间歇断开的情况看这里 →</a></p>` : '') + (lap && !off ? `<p class="cp-laptop">${dot(lap[1])}笔记本（副机）：${lap[0]}</p>` : ''))}</div>`;
  const charts = g.links.filter((l) => l.id !== 'overview');
  const links = [...charts.map((l) => `<a class="cp-chart" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`), g.url ? `<a class="cp-chart cp-login" href="${esc(new URL('login', g.url).href)}" target="_blank" rel="noopener">图表后台登录</a>` : ''].filter(Boolean);
  // 读不到电脑时图表网页也打不开：链接先收起，只留一行说明
  const chartsRow = off ? `<p class="cp-line cp-off-note">${dot('unavailable')}读不到电脑，图表链接先收起，读到后再出来。</p>`
    : `<p class="cp-line cp-charts" id="grafana">${links.length ? `24 小时曲线（新标签页打开）：${links.join('<i aria-hidden="true"> · </i>')}` : `${dot('unavailable')}图表网页现在打不开${g.checked_at ? `（上次检查 ${esc(when(g.checked_at, ctx.now))}）` : ''}`}</p>`;
  return factCards(cards, ctx.now, off) + remote + `<p class="cp-line"><a href="/cockpit/storage/">存储占用与增长：各类别容量和近一周变化 ›</a></p>` + chartsRow;
}

const LAPTOP = { online: ['在线', 'ok'], offline: ['离线（要用它时得先开机连网）', 'attention'] };

export function backup(v, ctx) {
  const off = !!ctx.offline, stale = staleIds(v);
  const cards = dedupeCards(v.sections.backup_cloud).filter((c) => !stale.has(c.id)).map((c) => (c.id === 'drive_upload' ? { ...c, text: knownFirst(c.text) } : c));
  const sig = sigOf(v.overview, 'backup'), issue = !off && sig.level !== 'ok' ? backupIssue(v.overview) : '';
  return anchor('backups') + (issue ? `<p class="cp-line cp-backup-current">${esc(issue)}</p>` : '') + (cards.length ? factCards(cards, ctx.now, off) : `<div class="cp-grid">${card({ title: '备份', state: 'unavailable', text: '' }, ctx.now, off)}</div>`);
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
    + (aiSide.length ? `<details class="cp-fold" id="proj-ai"><summary>${dot('neutral')}${aiSide.length} 个项目有小毛病，AI 在查（不用你管）</summary><ul class="cp-proj-list">${aiSide.map((p) => row(p, stateOf(p))).join('')}</ul></details>` : '')
    + (chips ? `<details class="cp-fold" id="proj-calm"><summary>正常运行的 ${calm.length} 个</summary><ul class="cp-chips">${chips}</ul></details>` : '')
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
  return `<article class="cp-feature cp-activity ct-card"><h3>电脑后台今天做的事</h3><p class="cp-big-line">${esc(line)}</p>${acc}${names}${yline}`
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

// 今天的动态：四张大卡（代码、你对 AI 说的话、电脑后台、用电）各收成一行，点开看全；读不到的来源合并成一行
const foldLine = (id, summary, body) => `<details class="cp-fold" id="${id}"><summary>${summary}</summary><div class="cp-fold-body">${body}</div></details>`;
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
  const errs = todayErrors(v), bad = errs ? errs.owner + errs.other : s.tasks_failed;
  return `电脑后台今天跑了 ${s.tasks_run} 个任务${Number.isFinite(bad) ? `，${bad} 个出过错` : ''}${Number.isFinite(s.backups_done) ? `，完成 ${s.backups_done} 项备份` : ''}`;
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
  const gaps = gapRows.size ? foldLine('today-gaps', `这次有 ${gapRows.size} 处没读到，相关的数可能不全`, `<ul class="cp-list">${[...gapRows.values()].map(({ g, n }) => `<li>${dot('attention')}${esc(g.title)}${n > 1 ? `（${n} 处）` : ''}${g.since ? `<span class="cp-meta">（${esc(when(g.since, ctx.now))} 起）</span>` : ''}${typeof g.impact === 'string' && g.impact.trim() ? `<small class="cp-gap-impact">${esc(g.impact.trim())}</small>` : ''}</li>`).join('')}</ul>`) : '';
  return releaseLine(v, ctx) + `<div class="cp-folds">${foldLine('today-code', esc(codeLine(v)), codeCard(v, ctx))}${foldLine('today-words', esc(wordsLine(v)), wordsCard(v, ctx))}`
    + `${foldLine('today-activity', esc(activityLine(v, ctx)), activityBlock(v, ctx))}${foldLine('today-power', esc(powerLine(v)), powerBlock(v, ctx))}</div>`
    + (cards.length ? factCards(cards, ctx.now, !!ctx.offline) : '') + gaps;
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
  const name = (why[0] || '').replace(/(的?备份)?(失败|过期|需要留意|要留意)$/, '').trim();
  return `${n} 项备份${why.length && why.every((t) => /失败$/.test(t)) ? '失败' : '要留意'}${name ? `（${name}等）` : ''}`;
}
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
  const bkStatus = bk.level === 'ok' ? '都按时备份了' : backupIssue(ov) || bk.word || '读不到';
  const bkMore = bkWhy.length > 1 ? `另有 ${bkWhy.length - 1} 项：${bkWhy.slice(1).join('、')}` : Number.isFinite(bk.value) && bk.level !== 'ok' ? `共 ${bk.value} 项不正常` : '';
  return [
    make('computer', '电脑', pcLevel, pc, pcStatus, '你不用管', '正常', pcDetail),
    // 现在没有仍失败的、也没有当前反复出错的：这一格就是正常（绿），不因后端 color=neutral 写成“今天都正常，AI 在管”
    make('tasks', '自动任务', tkLevel, nErr === 0 && !repeat.length ? { ...tk, color: 'ok' } : tk, tkStatus, '电脑自己按时跑', '都正常', tkWhy, tkNote),
    make('backup', '备份', bk.level, bk, bkStatus, '你不用管', '都按时', bkMore),
  ];
}
// 状态小格按中文整词换行；空格和标点仍参与浏览器的正常断行。
const statusSegmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter('zh-CN', { granularity: 'word' }) : null;
const statusText = (text) => statusSegmenter ? [...statusSegmenter.segment(text)].map(({ segment, isWordLike }) => isWordLike ? `<span class="cp-status-word">${esc(segment)}</span>` : esc(segment)).join('') : esc(text);
function tri(cells) {
  const cell = (c) => `<li class="cp-tri-cell is-${light(c.state)}" data-signal="${c.id}"><a class="hub-stat-field ct-card" href="#${c.id === 'tasks' ? 'tasks' : c.id === 'backup' ? 'backups' : 'computer'}">`
    + `<span class="cp-tri-label">${c.label}</span><b class="cp-tri-status">${dot(c.state)}${statusText(c.status)}</b>`
    + `<span class="cp-tri-who">${c.who.split(' · ').map((w) => `<span>${esc(w)}</span>`).join('<i aria-hidden="true"> · </i>')}</span>`
    + (c.why ? `<span class="cp-tri-why">${esc(c.why)}</span>` : '') + (c.note ? `<span class="cp-tri-note">${esc(c.note)}</span>` : '') + `</a></li>`;
  return `<ul class="cp-tri">${cells.map(cell).join('')}</ul>`;
}
// 电脑健康分（和首页小屏同名）：后端只按电脑、自动任务和备份扣分，你的事、AI 的事不扣分；扣分逐条列出，规则原样列出
const SCORE_SCOPE = '只算电脑、自动任务和备份；你的事、AI 的事不扣分';
function score(v, ctx, off) {
  const ov = v.overview;
  const at = ov?.as_of ? hm(ov.as_of) : '';
  if (off || !Number.isFinite(ov?.score)) return `<p class="cp-score is-off">电脑健康分：读不到${at ? `（上次 ${at}）` : ''}</p>`;
  const reasons = Array.isArray(ov.reasons) ? ov.reasons : [];
  const line = (r) => `<li>${esc(r.text)}${Number.isFinite(r.delta) && r.delta ? ` <b>${r.delta > 0 ? '+' : '−'}${Math.abs(r.delta)}</b>` : ''}</li>`;
  const rules = Array.isArray(ov.rules) ? ov.rules.map((r) => (typeof r === 'string' ? { text: r } : r)) : [];
  return `<details class="cp-score hub-stat-field ct-card" id="score"><summary>${blockHead('电脑健康分', 'cp-score-title')}<span class="cp-score-number hub-field-number-line"><b class="cp-score-value hub-field-value">${Math.round(ov.score)}</b><small>/100</small></span><progress class="cp-score-meter" max="100" value="${Math.max(0, Math.min(100, ov.score))}" aria-label="电脑健康分"></progress><span class="cp-score-why hub-field-body">${SCORE_SCOPE}${at ? `<small>${at} 读到</small>` : ''}</span></summary>`
    + `<div class="cp-score-body">${reasons.length ? `<div><h4>扣分的地方</h4><ul>${reasons.map(line).join('')}</ul></div>` : '<p>没有扣分的地方。</p>'}`
    + (rules.length ? `<div class="cp-score-rules"><h4>分数怎么算</h4><ul>${rules.map((r) => `<li>${esc(r.text)}</li>`).join('')}</ul></div>` : '')
    + `<p class="cp-score-note">${SCORE_SCOPE}；要你做的件数看上面第一行。</p></div></details>`;
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
  const all = m.items.filter(ok).filter(mine), old = m.archived.filter(ok).filter(mine);
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
  const folded = old.length ? `<details class="cp-know-old" id="know-old"><summary>最近收起的 ${old.length} 条</summary><ul class="cp-know-list">${old.map(row).join('')}</ul></details>` : '';
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
  // 在干活、在等你回话的行主行已经说清了，状态那几个字只留给读屏；对上卡的，主行点一下跳到那张卡
  const mainHtml = w ? `<a class="cp-run-doing cp-run-goto" href="#${esc(encodeURIComponent(w.id))}">${esc(main)}</a>` : `<span class="cp-run-doing${from ? '' : ' is-empty'}">${esc(main)}</span>`;
  return `<li class="cp-run-row is-${r.status} is-live${actCls(r, ctx)}"${itemAttr(r)}><span class="cp-run-st is-${color}"><i aria-hidden="true">${mark}</i><span class="cp-run-word">${esc(said)}</span></span>`
    + mainHtml + (step ? `<small class="cp-run-step">${esc(step)}</small>` : '')
    + `<small class="cp-run-meta">${r.title ? `<span class="cp-run-name">${esc(visible(r.title))}</span>` : ''}${second.map((s) => esc(visible(s))).join(' · ')}</small>${box}</li>`;
}
function runBlock(v, ctx) {
  const a = v.ai_running;
  if (!a) return '';
  const pub = a.rows.some((r) => r.placeholder) || v.viewer?.kind === 'public';
  const at = a.observed_at ? `<span class="cp-run-at">${ctx.offline ? '读不到电脑，这是 ' : ''}${esc(when(a.observed_at, ctx.now))} 读到的</span>` : '';
  const off = ctx.offline ? ' is-off' : '';
  const gone = [...(a.stale_rows || []), ...(a.stopped_rows || [])].filter((r) => !a.rows.some((x) => x.id === r.id));
  const stale = !pub && gone.length ? `<details class="cp-run-stale" id="run-stale"><summary>另有 ${gone.length} 件已经停了</summary><ul class="cp-run-list">${gone.map((r) => runRowOf(r, ctx, v.viewer)).join('')}</ul></details>` : '';
  if (!a.count && !a.rows.length) return `<div class="cp-run is-empty${off}" id="ai-running">${blockHead(esc(a.unread ? 'AI 干活情况暂时读不全' : '现在没有 AI 在干活'), 'cp-run-head cp-run-none', at, 'cp-run-sum')}${stale}</div>`;
  const active = a.rows.filter((r) => !DONE_LIKE.includes(r.status));
  if (pub) {
    const head = `AI 在干活：${activeOf(a)} 个${stuckOf(a)}`;
    const models = active.length ? `<p class="cp-run-models">${esc(modelCounts(active))}</p>` : '';
    return `<div class="cp-run is-public${off}" id="ai-running">${blockHead(esc(head.replace('AI 在干活：', 'AI 正在干活：')), 'cp-run-head', at, 'cp-run-sum')}${models}</div>`;
  }
  const sorted = a.rows.map((r, i) => ({ r, i })).sort((x, y) => RUN_ORDER.indexOf(x.r.status) - RUN_ORDER.indexOf(y.r.status) || x.i - y.i).map(({ r }) => r);
  const stuck = sorted.filter((r) => r.stuck), rest = sorted.filter((r) => !stuck.includes(r));
  const waits = v.need_you.filter((x) => x.card_type === 'ai_wait' && !isPh(x) && x.id);
  const runRow = (r) => runRowOf(r, ctx, v.viewer, waits);
  return `<div class="cp-run${off}" id="ai-running">${blockHead(esc(runLine(a).replace('AI 在干活：', 'AI 正在干活：')), 'cp-run-head', at, 'cp-run-sum')}`
    + (stuck.length ? `<ul class="cp-run-list is-stuck">${stuck.map(runRow).join('')}</ul>` : '')
    + (rest.length ? `<details class="cp-run-all" id="run-all"><summary>${stuck.length ? `其余 ${rest.length} 个` : `看是哪 ${rest.length} 个`}</summary><ul class="cp-run-list">${rest.map(runRow).join('')}</ul></details>` : '')
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
// 公开版：顶上那句的件数含私人事项、下面又只露出一部分时，那句下面一行“另 N 件是私人事项，只在你的设备上显示”。
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
  const said = read && !hidden ? topSentence(v) : '';
  const head = said ? `<span class="cp-you-said">${esc(said)}</span>` : n ? `要你做 <b>${n}</b> 件` : '现在没有要你做的事';
  // 本人设备：顶上一两行提示（点的处理写不回、通知没发出去、调度在排队），块末尾“你最近处理的（30 天）›”；后端没给就都不出
  const sub = !read && v.served_at ? `<p class="cp-you-sub">这是 ${esc(when(v.served_at, ctx.now))} 读到的</p>` : '';
  const hid = hiddenPrivate(v);
  const priv = hid ? `<p class="cp-you-sub cp-you-private">另 ${hid} 件是私人事项，只在你的设备上显示</p>` : '';
  return `<div class="cp-you${urgent ? ' is-urgent' : ''}${n ? '' : ' is-none'}${said ? ' is-said' : ''}">${snap}<p class="cp-you-n">${n ? '' : dot(COLOR_STATE[v.summary.color] || COLOR_STATE[v.verdict.color] || 'ok')}${head}${tag}</p>`
    + priv + ownerWarn(v, ctx) + sub + recentBlock(v, ctx) + `</div>`;
};
// 首屏下半：三格（电脑 / 自动任务 / 备份）和健康分小字
const overviewTri = (v, ctx) => {
  if (!ctx.ov) return '';
  const off = ctx.ov.stale(v.overview, ctx.now.getTime());
  return tri(triCells(v, ctx, off)) + score(v, ctx, off);
};
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
  const st = v.stale_summary;
  const cards = dedupeCards([...(st ? ['computer', 'remote', 'backup_cloud', 'today'].flatMap((k) => v.sections[k]).filter((c) => st.ids.includes(c.id)) : []), ...oldTodayCards(v, ctx.now)]);
  const extra = cards.filter((c) => !st?.ids.includes(c.id)).length;
  const staleText = st?.text ? st.text + (extra ? `；另 ${extra} 块今天还没读到新数据` : '') : `这 ${cards.length} 块数据今天还没读到新的`;
  const stale = cards.length
    ? `<details class="cp-fold cp-stale-fold" id="stale-cards"><summary>${dot('unavailable')}${esc(staleText)}</summary><ul class="cp-facts is-stale">${cards.map((c) => `<li class="cp-fact" tabindex="0" title="${esc(c.text || '')}">${dot('unavailable')}<b>${esc(c.title)}</b><span>${c.observed_at ? `最后一次是 ${esc(when(c.observed_at, ctx.now))}${st?.ids.includes(c.id) || SOURCE_STOPPED.test(c.text || '') ? '，数据停了' : '，今天还没读到新的'}` : '还没读到'}</span></li>`).join('')}</ul></details>`
    : st ? `<p class="cp-line">${dot('unavailable')}${esc(st.text)}</p>` : '';
  return `<div class="cp-lines"><a class="cp-go" href="/cockpit/ai/">${esc(ledgerText(v))}</a>${wait}${stale}</div>`;
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
    if (st === 'neutral') return `<span class="ov-sec is-neutral"><i class="ov-lamp" aria-hidden="true"></i>AI 在管</span>`;
    if (st === 'unavailable') return ctx.ov.lamp(null, true);
    return ctx.ov.lamp({ ...sec, level: st === 'red' ? 'act' : st === 'attention' ? 'watch' : 'ok', word: st === 'ok' ? '正常' : key === 'need_you' ? '要你处理' : sec.word }, false);
  }
  if (off || !sec || key === 'need_you' || !['act', 'watch'].includes(sec.level)) return ctx.ov.lamp(sec, off);
  const st = key === 'projects' && v.projects.items.some((p) => p.waiting_user > 0) ? LV[sec.level] : ownerState(sec.level, sec);
  if (st === 'neutral') return `<span class="ov-sec is-neutral"><i class="ov-lamp" aria-hidden="true"></i>AI 在管</span>`;
  return ctx.ov.lamp({ ...sec, level: st === 'red' ? 'act' : 'watch' }, false);
};
// 二级页电脑版（宽度 ≥1200）的表格。窄屏照旧是上面的列表；两样都画，cockpit.css 按宽度只显示一样（表格行不带 data-items，通知跳转找列表那行）。
// 筛选（全部 / 晚了 / 没晚、输入几个字）和勾选记在 client.js 的 act.ui（下面两个键），重画时照样画出来
export const LF_KEY = '\u0000ledger-filter', LB_KEY = '\u0000ledger-batch';
const cellNote = (x, ctx) => (isPh(x) ? '' : ledgerBox(x, ctx));
function followTable(v, ctx) {
  const now = ctx.now;
  const lateList = v.ai_overdue ? [...v.ai_overdue] : v.ai_following.filter((x) => x.stuck === true);
  const lateIds = new Set(lateList.map((x) => x.id));
  const rows = [...mergePh(lateList.filter((x) => !bare(x)).sort(byLate)).map((e) => ({ ...e, late: true })),
    ...mergePh(v.ai_following.filter((x) => !lateIds.has(x.id) && !bare(x))).map((e) => ({ ...e, late: false }))];
  if (!rows.length) return '';
  const f = ctx.act?.ui?.get(LF_KEY) || {}, show = ['late', 'ok'].includes(f.show) ? f.show : 'all', q = String(f.q || '').trim().toLowerCase();
  const nLate = rows.filter((r) => r.late).length;
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
    return `<tr class="${late ? 'is-late' : 'is-ok'}${phCls(x)}${actCls(x, ctx)}"${hide ? ' hidden' : ''}>`
      + `<td class="cp-lt-what">${isPh(x) ? `<span title="${PH_HINT}">${esc(title)}</span>${moreText(more)}` : `<span class="cp-lt-title">${esc(title)}${ownTag(x)}</span>${prog && String(x.owner_detail || '').includes(prog) ? '' : detail(x)}${decLine(x, 'dect')}`}</td>`
      + `<td class="cp-lt-due">${due ? `${esc(due.text)}${due.old ? `<small>${esc(due.old)}</small>` : ''}` : '—'}</td><td class="cp-lt-lag">${lag ? `<span class="cp-lt-late">${esc(lag)}</span>` : `<span class="cp-lt-none">${fine ? '没晚' : '—'}</span>`}</td>`
      + `<td class="cp-lt-prog">${prog ? `<span>${esc(prog)}</span>` : ''}${checked ? `<small>${esc(checked)}</small>` : ''}</td>`
      + (anyAct ? `<td class="cp-lt-act">${cellNote(x, ctx)}</td>` : '') + `</tr>`;
  };
  const body = rows.map(tr).join('');
  const shown = rows.filter((r) => !((show === 'late' && !r.late) || (show === 'ok' && r.late))).length;
  const chip = (k, label, n) => `<button type="button" class="cp-q-mode" data-lshow="${k}" aria-pressed="${show === k}">${label} ${n}</button>`;
  return `<div class="cp-lt" id="ai-following-table"><div class="cp-lt-bar"><span class="cp-q-modes" role="group" aria-label="看哪些">${chip('all', '全部', rows.length)}${chip('late', '晚了', nLate)}${chip('ok', '没晚', rows.length - nLate)}</span>`
    + `<input type="search" class="cp-lt-find" data-lfilter value="${esc(f.q || '')}" placeholder="筛选：输入几个字" aria-label="筛选 AI 在跟的事">${q ? `<small class="cp-lt-count">按“${esc(f.q.trim())}”筛</small>` : shown < rows.length ? `<small class="cp-lt-count">显示 ${shown} 件</small>` : ''}</div>`
    + `<table class="cp-ltable"><thead><tr><th class="cp-lt-what">事项</th><th class="cp-lt-due">该有结果的日子</th><th class="cp-lt-lag">晚几天</th><th class="cp-lt-prog">最近进展</th>${anyAct ? '<th class="cp-lt-act"><span class="cp-vh">处理和复制</span></th>' : ''}</tr></thead><tbody>${body}</tbody></table>`
    + `<p class="cp-lt-empty" hidden>没有对得上的</p></div>`;
}
function decisionsTable(v, ctx) {
  const list = (v.must_know?.items || []).filter((k) => k.kind === 'ai_decision' && (isPh(k) || (typeof k.text === 'string' && k.text)));
  if (!list.length) return '';
  const anyAct = ctx.viewer?.kind === 'owner' && list.some((k) => !isPh(k));
  const tr = (k) => {
    if (isPh(k)) return `<tr class="is-private"><td class="cp-lt-what" colspan="4"><span title="${PH_HINT}">${esc(k.title || PRIVATE_TITLE)}</span></td>${anyAct ? '<td class="cp-lt-act"></td>' : ''}</tr>`;
    const d = splitDecision(k);
    const basis = d?.basis ? (CODE.test(d.basis) ? `<details class="cp-tech" id="dect-${esc(knowId(k))}"><summary>技术细节</summary><p>${esc(d.basis)}</p></details>` : esc(plain(d.basis))) : '';
    return `<tr class="is-ai_decision${actCls(k, ctx)}">`
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
  const toc = [['ai-following', 'AI 在跟'], ['ai-decided', 'AI 自己定了的'], theirs.length ? ['ai-wait', 'AI 等条件再做的'] : null, health ? ['ai-health', '体检和项目后台'] : null].filter(Boolean);
  return `<nav class="cp-ledger-toc" aria-label="这页有什么">${toc.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</nav>`
    + snap + `<p class="cp-ledger-sum">${dot('neutral')}${esc(ledgerText(v))}</p>`
    + `<section class="cp-ledger-sec" id="ai-following"><h2>AI 在跟</h2>${aiFollowing(v, ctx)}${followTable(v, ctx)}</section>`
    + `<section class="cp-ledger-sec" id="ai-decided"><h2>AI 自己定了的</h2>${decisionsBlock(v, ctx)}${decisionsTable(v, ctx)}</section>`
    + (theirs.length ? `<section class="cp-ledger-sec" id="ai-wait"><h2>AI 等条件再做的</h2><ul class="cp-list cp-wait">${theirs.map((x) => waitRow(x, ctx, [])).join('')}</ul></section>` : '')
    + (health ? `<section class="cp-ledger-sec" id="ai-health"><h2>每周体检和项目后台</h2>${health}</section>` : '');
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
export const REGIONS = Object.fromEntries(Object.entries({ overview, 'overview-tri': overviewTri, 'need-you': needCards, home, tasks: tasksSum, security, computer, backup, projects, today: todayBlock, 'today-date': todayDate, viewer: viewerLine, meta, ledger,
  'action-toast': (_v, ctx) => actionToast(ctx), ...Object.fromEntries(Object.entries(LAMPS).map(([id, key]) => ['lamp-' + id, lampOf(key)])) }).map(([key, render]) => [key, (v, ctx = {}) => render(v, { ...ctx, viewer: v.viewer })]));

// 整页：外框固定，内容由上面各函数填。首屏只放本人的事（本人 18:51：太谜语人、还不好用）：
// 顶上一句 → 要你做／要你回的卡 → AI 正在干活 → 你得知道 → AI 的账本 › / 你放着 N 件不急的事 › / 停了的数据 → 三格；事实区在下面，正常的只占一行
export function page(v, ctx) {
  ctx = { ...ctx, viewer: v.viewer };
  const r = (k) => '<div class="cp-body" data-cp="' + k + '">' + REGIONS[k](v, ctx) + '</div>';
  const sec = (id, title, sub, body) => '<section class="cp-section" id="' + id + '">'
    + blockHead('<span class="cp-section-title">' + esc(title) + '</span>', 'cp-head',
      '<span class="cp-lamp" data-cp="lamp-' + id + '">' + REGIONS['lamp-' + id](v, ctx) + '</span>'
      + (id === 'today' ? '<span class="cp-date" data-cp="today-date">' + todayDate(v, ctx) + '</span>' : '') + '<p>' + sub + '</p>')
    + body + '</section>';
  const help = '<details class="cp-help" id="cp-help"><summary class="cp-tool ct-inline-action" title="这页怎么用" aria-label="这页怎么用">?</summary><div class="cp-help-pop">'
    + '<p><b>这页怎么用</b></p><p>最上面是要你做的事；下面是你得知道和 AI 在干的活，再往下是各项明细。每条可复制给 AI，选项和确认内容也会一起带过去。</p>'
    + '<p>AI 自己的活收在“AI 的账本”。每分钟从电脑读一次（页面在后台时每 3 分钟一次），时间都是北京时间；↻ 立刻重读。</p>'
    + '<p><b>键盘</b></p><dl class="cp-keys"><dt><kbd>j</kbd> <kbd>k</kbd></dt><dd>下一件、上一件</dd><dt><kbd>1</kbd>—<kbd>9</kbd></dt><dd>直接打开第几件</dd>'
    + '<dt><kbd>o</kbd></dt><dd>打开那个对话</dd><dt><kbd>s</kbd></dt><dd>晚点提醒</dd><dt><kbd>u</kbd></dt><dd>撤回刚才那下</dd><dt><kbd>?</kbd></dt><dd>打开、关上这个说明</dd></dl></div></details>';
  return '<div class="cp-action-toast" data-cp="action-toast">' + actionToast(ctx) + '</div>'
    + '<section class="cp-dashboard c-text" id="top"><aside class="cp-sidebar">'
    + '<div class="cp-intro cp-hero-copy"><h1 class="cp-main-title"><img src="' + src(ctx, 'cockpit-01-title-01.png') + '" alt="" width="483" height="198" loading="eager"><span class="cp-h1-text">驾驶舱</span></h1>'
    + '<div class="cp-tools"><p class="cp-meta" data-cp="meta" role="status">' + meta(v, ctx) + '</p>'
    + '<button type="button" class="cp-tool ct-inline-action" data-cp-reload title="立刻重读电脑" aria-label="立刻重读电脑">↻</button>' + help + '</div>'
    + '<p class="cp-viewer" data-cp="viewer" role="status">' + viewerLine(v, ctx) + '</p>'
    + '<div class="cp-overview" data-cp="overview">' + overview(v, ctx) + '</div></div>'
    + '<div class="cp-status c-hub-stats">' + blockHead('状态一览', 'cp-mobile-status-heading')
    + '<div class="cp-overview-tri" data-cp="overview-tri">' + overviewTri(v, ctx) + '</div>'
    + '<div class="cp-security-wrap hub-stat-field ct-card"><h2 class="cp-security-title">安全和授权</h2><div class="cp-security" data-cp="security">' + security(v, ctx) + '</div></div></div>'
    + '<figure class="cp-hero-art"' + (ctx.birdConfig ? ' data-living-config="' + ctx.birdConfig + '"' : '') + '><img src="' + src(ctx, 'cockpit-01-illustration-01.png') + '" alt="" width="866" height="326" loading="eager" crossorigin="anonymous"></figure></aside>'
    + '<div class="cp-workspace c-text"><div class="cp-need" id="need-you" data-cp="need-you">' + needCards(v, ctx) + '</div>'
    + '<div class="cp-home" data-cp="home">' + home(v, ctx) + '</div><div class="cp-facts-wall">'
    + sec('tasks', '自动任务', '电脑自己在做的事，有没有按时做、做成没有。', r('tasks') + '<details class="cp-fold cp-river-fold" id="river"><summary>看今天的河：每条船是一个自动任务，点开看它在做什么、怎么停</summary><div class="cp-river" data-today-river aria-label="今天的河"></div></details>')
    + sec('computer', '电脑', '这台电脑现在累不累、还剩多少地方；人不在电脑前能不能连上它。', r('computer'))
    + sec('today', '今天的动态', '今天有什么变化：代码、你对 AI 说的话、今天发生的事。', r('today'))
    + sec('backup', '备份和云端', '东西有没有按时备份、云端的钱够不够。', r('backup'))
    + sec('projects', '项目', '每个在用的项目现在怎么样、有没有等你的事。点名字进项目页。', r('projects'))
    + '</div></div></section>';
}

// 二级页整页（/cockpit/ai/）
export function ledgerPage(v, ctx) {
  ctx = { ...ctx, viewer: v.viewer };
  return `<section class="cp-section cp-ledger c-text" id="top"><p class="cp-back"><a href="/cockpit/">← 回驾驶舱</a></p><h1 class="cp-ledger-h1">AI 的账本</h1>`
    + `<p class="cp-lead">AI 自己手上的活：在跟的、晚了的、它自己定了的、每周体检。都不用你管，想看时进来看看。</p>`
    + `<p class="cp-viewer" data-cp="viewer" role="status">${viewerLine(v, ctx)}</p><div class="cp-action-toast" data-cp="action-toast">${actionToast(ctx)}</div><div class="cp-body" data-cp="ledger">${ledger(v, ctx)}</div></section>`;
}
