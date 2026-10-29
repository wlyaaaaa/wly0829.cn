// 本人设备上的按钮（后端在条目上给的 owner_actions）：只在本人设备出现；公开版没有这个字段，页面和以前一字不差。
// 本人 14:25：“我自己的私人设备我可以在駕駛艙以我看见了，我知道了等等等理由关掉”；14:58：“主要是自动我在公网点完让Claude做……GPT做还是Claude做我能选吧？”
// 按钮一律只按 owner_actions 画，不自己多加。纯函数：构建时和浏览器里共用；
// 点了以后的状态（正在交、撤回倒数、出错）和还没交的输入（选了哪项、写了什么、交给谁）由 client.js 放在 ctx.act 里传进来。
import { hm, when, dateHm } from './model.js';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const json = (x) => esc(JSON.stringify(x));
export const ACTIONS = ['answer', 'note', 'seen', 'ack', 'done', 'dismiss', 'snooze', 'confirm', 'redo', 'switch'];
// 会交给 AI 的动作（提交时带 executor）；seen、ack、snooze 只记下，不交给 AI
export const AI_ACTIONS = ['answer', 'note', 'done', 'dismiss', 'confirm', 'redo', 'switch'];
export const WHO = { claude: 'Claude', gpt: 'GPT' };
const other = (e) => (e === 'gpt' ? 'claude' : 'gpt');
export const LABEL = { note: '回一句话', seen: '看见了', ack: '知道了', done: '办好了', dismiss: '不用了', snooze: '晚点提醒', confirm: '确认', redo: '不对，重做' };
export const SNOOZE = [['tomorrow_9', '明早 9 点'], ['three_days', '3 天后'], ['next_monday_9', '下周一 9 点']];
export const MAX_TEXT = 500;

// 这一条能点哪些（只认得上面这几种；条目没有编号就不画）
export const actsOf = (x) => (Array.isArray(x?.owner_actions) && typeof x.id === 'string' && x.id.trim() ? ACTIONS.filter((a) => x.owner_actions.includes(a)) : []);
export const hasActs = (x) => actsOf(x).length > 0;
const stOf = (ctx, x) => ctx?.act?.state?.get(x.id) || null;
const uiOf = (ctx, x) => ctx?.act?.ui?.get(x.id) || {};
// 点过、交出去了：卡片和行变灰（撤回倒数和回执照常亮着）
export const actCls = (x, ctx) => { const s = hasActs(x) && stOf(ctx, x); return s && (s.phase === 'done' || s.phase === 'undoing') ? ' is-acted' : ''; };

// 答题：后端 questions（多题，用每题 id）或 options（单题，题号 choice）；字符串选项以原字符串为值，对象选项用 value
export function questionsFor(x) {
  const opts = (list) => (Array.isArray(list) ? list : []).map((o) => (typeof o === 'string' ? { value: o, text: o }
    : o && typeof o === 'object' && o.value !== undefined && o.value !== null ? { value: o.value, text: String(o.text || o.label || o.value) } : null)).filter((o) => o && String(o.text).trim());
  if (Array.isArray(x?.questions) && x.questions.length) {
    return x.questions.map((q) => (q && typeof q === 'object' && typeof q.id === 'string' && q.id ? { id: q.id, text: String(q.text || ''), options: opts(q.options) } : null)).filter((q) => q && q.options.length);
  }
  const one = opts(x?.options);
  return one.length ? [{ id: 'choice', text: '', options: one }] : [];
}
export const answered = (qs, u) => qs.length > 0 && qs.every((q) => u.answers?.[q.id] && 'value' in u.answers[q.id]);

// 撤回还剩多久：10 分钟以内倒数秒；更长的（看见了、知道了、晚点提醒是 24 小时）写“今天 18:40 前可撤回”
const DAY = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
export const todayBJ = (now = new Date()) => DAY(now);
export function leftText(until, now = new Date()) {
  const t = Date.parse(until || '');
  if (!Number.isFinite(t)) return '';
  const sec = Math.ceil((t - now.getTime()) / 1000);
  if (sec <= 0) return '';
  if (sec <= 600) return sec < 60 ? `还剩 ${sec} 秒` : `还剩 ${Math.floor(sec / 60)} 分 ${sec % 60} 秒`;
  const day = DAY(new Date(t)), today = DAY(now), tomorrow = DAY(new Date(now.getTime() + 864e5));
  return `${day === today ? '今天 ' + hm(until) : day === tomorrow ? '明天 ' + hm(until) : dateHm(until)} 前可撤回`;
}

// 后端记下的状态（刷新后照显示）：已交给 Claude（HH:MM）/ AI 核实中 / 你 HH:MM 点了看见了
export function ownerStatus(x, now) {
  const bits = [];
  if (x?.verifying === true) bits.push('AI 核实中');
  else if (x?.handed_to_ai && typeof x.handed_to_ai === 'object') { const t = when(x.handed_to_ai.at, now); bits.push(`已交给 ${WHO[x.handed_to_ai.executor] || 'AI'}${t ? `（${t}）` : ''}`); }
  const seen = x?.seen_at ? when(x.seen_at, now) : '';
  if (seen) bits.push(`你 ${seen} 点了看见了`);
  return bits.length ? `<p class="cp-oa-status">${bits.map(esc).join(' · ')}</p>` : '';
}

const btn = (label, attrs, cls = '') => `<button type="button" class="cp-btn${cls}" ${attrs}>${esc(label)}</button>`;
const execBtn = (e) => `<button type="button" class="cp-oa-exec" data-exec aria-label="交给谁：现在是 ${WHO[e]}，点一下改成 ${WHO[other(e)]}">交给：${WHO[e]} ▾</button>`;
// 交出去以后：灰着，下面回执的话 + “撤回” + 倒数；撤回期过了写“已交给 Claude（HH:MM）”
function receipt(s, ctx) {
  const r = s.receipt || {}, now = ctx.now;
  const until = Date.parse(r.undo_until || '');
  const err = s.undoError ? `<p class="cp-oa-err" role="alert">${esc(s.undoError)}</p>` : '';
  if (s.phase === 'undoing') return `<p class="cp-oa-done"><span class="cp-oa-msg">${esc(r.message || '已记录')}</span>${btn('撤回', 'disabled aria-busy="true"', ' cp-oa-undo')}</p>`;
  if (Number.isFinite(until) && until > now.getTime()) {
    return `<p class="cp-oa-done"><span class="cp-oa-msg">${esc(r.message || '已记录')}</span>${btn('撤回', `data-undo="${esc(r.id || '')}"`, ' cp-oa-undo')}`
      + `<span class="cp-oa-left" data-left="${esc(r.undo_until)}">${esc(leftText(r.undo_until, now))}</span></p>` + err;
  }
  const at = hm(r.apply_at || r.undo_until || r.created_at), mine = hm(r.created_at);
  const after = AI_ACTIONS.includes(s.action) ? `已交给 ${WHO[s.executor] || 'AI'}${at ? `（${at}）` : ''}`
    : s.action === 'seen' ? `你 ${mine} 点了看见了` : s.action === 'ack' ? `你 ${mine} 点了知道了` : r.message || '已记录';
  return `<p class="cp-oa-done"><span class="cp-oa-msg">${esc(after)}</span></p>` + err;
}

// 一条的按钮区。card：要你处理的大卡片（“交给：Claude ▾”总在按钮行上）；行（AI 在跟、你得知道、AI 正在跑……）只在有一点就交给 AI 的按钮时放在按钮行，否则放进“回一句话”“不对，重做”的框里
export function ownerBox(x, ctx, card = false, extra = '') {
  const acts = actsOf(x);
  const status = ownerStatus(x, ctx.now);
  if (!acts.length) return status;
  const s = stOf(ctx, x), u = uiOf(ctx, x);
  const open = `<div class="cp-oa${card ? ' is-card' : ''}" data-oa="${esc(x.id)}"${x.item_version !== undefined && x.item_version !== null ? ` data-ver="${json(x.item_version)}"` : ''}>`;
  if (s && (s.phase === 'done' || s.phase === 'undoing')) return status + open + receipt(s, ctx) + '</div>';
  const busy = s?.phase === 'sending';
  const dis = busy ? ' disabled' : '';
  const exec = u.executor === 'gpt' ? 'gpt' : 'claude';
  const has = (a) => acts.includes(a);
  const execInBar = card || ['answer', 'done', 'dismiss', 'confirm'].some(has);
  // 答题：每题一排选项 + 一个“我的说明”小框；每题都选了才能交
  const qs = has('answer') ? questionsFor(x) : [];
  const quiz = qs.length ? `<div class="cp-oa-quiz">${qs.map((q, i) => {
    const a = u.answers?.[q.id];
    const legend = qs.length > 1 || q.text ? `<b>第 ${i + 1} 题</b>${esc(q.text)}` : '选一个';
    return `<fieldset class="cp-oa-q" data-qid="${esc(q.id)}"><legend>${legend}</legend><div class="cp-opts">`
      + q.options.map((o) => `<button type="button" class="cp-btn cp-opt" data-val="${json(o.value)}" aria-pressed="${a && JSON.stringify(a.value) === JSON.stringify(o.value) ? 'true' : 'false'}"${dis}>${esc(o.text)}</button>`).join('')
      + `</div><input class="cp-note cp-oa-qnote" type="text" data-qnote maxlength="${MAX_TEXT}" placeholder="我的说明（可不写）" aria-label="第 ${i + 1} 题我的说明" value="${esc(a?.text || '')}"${dis}></fieldset>`;
  }).join('')}</div>` : '';
  const ready = answered(qs, u);
  const swTo = other(x.executor === 'gpt' || x.executor === 'claude' ? x.executor : x.vendor === 'gpt' ? 'gpt' : 'claude');
  const bar = [
    qs.length ? btn('交给 AI', `data-send="answer"${ready && !busy ? '' : ' disabled'}`, ' cp-btn-main') : '',
    has('confirm') ? btn(LABEL.confirm, `data-act="confirm"${dis}`, ' cp-btn-main') : '',
    has('done') ? btn(LABEL.done, `data-act="done"${dis}`, ' cp-btn-main') : '',
    has('seen') ? btn(LABEL.seen, `data-act="seen"${dis}`) : '',
    has('ack') ? btn(LABEL.ack, `data-act="ack"${dis}`) : '',
    has('switch') ? btn(`改给 ${WHO[swTo]}`, `data-act="switch" data-to="${swTo}"${dis}`) : '',
    has('note') ? btn(LABEL.note, `data-act="note" aria-expanded="${u.open === 'note'}"${dis}`) : '',
    has('snooze') ? btn(LABEL.snooze, `data-act="snooze" aria-expanded="${u.open === 'snooze'}"${dis}`) : '',
    has('redo') ? btn(LABEL.redo, `data-act="redo" aria-expanded="${u.open === 'redo'}"${dis}`) : '',
    has('dismiss') ? btn(LABEL.dismiss, `data-act="dismiss"${dis}`, ' cp-btn-quiet') : '',
  ].filter(Boolean);
  const hint = qs.length && !ready ? `<p class="cp-oa-hint">${qs.length > 1 ? '每道题都选一个，才能交' : '先选一个，才能交'}</p>` : '';
  // 回一句话 / 不对，重做：一个输入框（最多 500 字，都必须写）+ 交给 AI
  const text = u.open === 'note' || u.open === 'redo'
    ? `<div class="cp-oa-panel"><textarea class="cp-oa-text" data-text rows="3" maxlength="${MAX_TEXT}" placeholder="${u.open === 'redo' ? '哪里不对、要怎么改（必填）' : '想对 AI 说的话（最多 500 字）'}" aria-label="${u.open === 'redo' ? '哪里不对、要怎么改' : '回一句话'}"${dis}>${esc(u.text || '')}</textarea>`
      + `<div class="cp-oa-row">${execInBar ? '' : execBtn(exec)}${btn('交给 AI', `data-send="${u.open}"${(u.text || '').trim() && !busy ? '' : ' disabled'}`, ' cp-btn-main')}</div></div>` : '';
  // 晚点提醒：明早 9 点、3 天后、下周一 9 点、选一天
  const snooze = u.open === 'snooze'
    ? `<div class="cp-oa-panel cp-oa-snooze">${SNOOZE.map(([v, l]) => btn(l, `data-snooze="${v}"${dis}`)).join('')}`
      + `<label class="cp-oa-date"><span>选一天</span><input type="date" data-snooze-date min="${todayBJ(ctx.now)}"${dis}></label></div>` : '';
  const err = s?.phase === 'error' ? `<p class="cp-oa-err" role="alert">${esc(s.error)}${s.refresh ? btn('刷新', 'data-oa-refresh') : ''}</p>` : '';
  const undone = s?.phase === 'undone' ? `<p class="cp-oa-note" role="status">${esc(s.message || '已撤回')}</p>` : '';
  return status + open + quiz + hint + `<div class="cp-oa-bar"${busy ? ' aria-busy="true"' : ''}>${bar.join('')}${extra}${execInBar ? execBtn(exec) : ''}</div>` + text + snooze + err + undone + `</div>`;
}

// “你最近处理的（30 天）›”（后端 owner_recent）：默认收起；每行一句人话、交给谁、状态；还能撤回的带“撤回”
const RECENT = { applied: '已记下', undone: '已撤回', rejected: '没办成' };
export function recentBlock(v, ctx) {
  const rows = v.owner_recent;
  if (!rows || !rows.length) return '';
  const items = rows.map((r) => {
    const local = ctx.act?.recent?.get(r.id);
    const status = local === 'undone' ? 'undone' : r.status;
    const ai = AI_ACTIONS.includes(r.action), who = WHO[r.executor] || 'AI';
    const word = status === 'waiting_undo' ? (ai ? `要交给 ${who}，还能撤回` : '还能撤回') : status === 'ready_for_ai' ? `已交给 ${who}`
      : status === 'rejected' && /[一-鿿]/.test(r.error || '') ? `没办成：${r.error}` : RECENT[status] || '';
    const text = String(r.text || '').replace(/^\s*\d{1,2}:\d{2}\s*/, '').replace(/（已撤回）\s*$/, '');
    const t = when(r.created_at, ctx.now);
    const undo = r.can_undo === true && status !== 'undone' ? btn(local === 'undoing' ? '正在撤回' : '撤回', local === 'undoing' ? 'disabled' : `data-recent-undo="${esc(r.id)}"`, ' cp-oa-undo') : '';
    return `<li class="is-${esc(status || 'other')}"><span class="cp-recent-text">${t ? `<time>${esc(t)}</time>` : ''}${esc(text)}</span><span class="cp-recent-st">${esc(word)}</span>${undo}</li>`;
  }).join('');
  return `<details class="cp-recent" id="owner-recent"><summary>你最近处理的（30 天）</summary><ul class="cp-recent-list">${items}</ul></details>`;
}

// 顶上的提示：你点的处理写不回、通知没发出去、调度在排队（后端给了才显示，没有不占位）
export function ownerWarn(v) {
  const bits = [];
  if (v.owner_actions_worker?.state === 'error') bits.push('你点的处理暂时写不回，电脑在重试');
  if (v.notification_status === 'failed') bits.push(v.notification_message || '通知没发出去');
  if (v.owner_dispatch_notice) bits.push(v.owner_dispatch_notice);
  return bits.map((b) => `<p class="cp-oa-warn" role="status">${esc(b)}</p>`).join('');
}
