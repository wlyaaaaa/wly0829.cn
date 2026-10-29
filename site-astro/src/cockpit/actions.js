// 本人设备上的按钮（后端在条目上给的 owner_actions）：只在本人设备出现；公开版没有这个字段，一个按钮都不画。
// 本人 14:25：“我自己的私人设备我可以在駕駛艙以我看见了，我知道了等等等理由关掉”；14:58：“主要是自动我在公网点完让Claude做……GPT做还是Claude做我能选吧？”
// 本人 18:42—18:51 看了说太谜语人、还不好用：按钮短、点完说清会怎样（第三步）。
// 按钮一律只按 owner_actions 画，不自己多加；各区块还可以再收窄（例如“AI 正在跑”只画“改给另一家”）。纯函数：构建时和浏览器里共用；
// 点了以后的状态（正在交、撤回倒数、出错）和还没交的输入（选了哪项、写了什么、交给谁）由 client.js 放在 ctx.act 里传进来。
import { hm, when, dateHm } from './model.js';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const json = (x) => esc(JSON.stringify(x));
export const ACTIONS = ['answer', 'note', 'seen', 'ack', 'done', 'dismiss', 'snooze', 'confirm', 'redo', 'switch', 'delegate', 'unclear'];
// 会交给 AI 的动作（提交时带 executor）；seen、ack、snooze 只记下，不交给 AI
export const AI_ACTIONS = ['answer', 'note', 'done', 'dismiss', 'confirm', 'redo', 'switch', 'delegate', 'unclear'];
export const WHO = { claude: 'Claude', gpt: 'GPT' };
const other = (e) => (e === 'gpt' ? 'claude' : 'gpt');
export const LABEL = { note: '回一句话', seen: '看见了', ack: '知道了', done: '我办好了', dismiss: '这件不做了', snooze: '晚点提醒', confirm: '确认', redo: '不对，重做', delegate: '你定就行', unclear: '我没看懂' };
export const SNOOZE = [['tomorrow_9', '明早 9 点'], ['three_days', '3 天后'], ['next_monday_9', '下周一 9 点']];
export const MAX_TEXT = 500;

// 这一条能点哪些（只认得上面这几种；条目没有编号就不画）；only：这一区块最多允许哪些
export const actsOf = (x, only = null) => (Array.isArray(x?.owner_actions) && typeof x.id === 'string' && x.id.trim()
  ? ACTIONS.filter((a) => x.owner_actions.includes(a) && (!only || only.includes(a))) : []);
export const hasActs = (x, only = null) => actsOf(x, only).length > 0;
const stOf = (ctx, x) => ctx?.act?.state?.get(x.id) || null;
const uiOf = (ctx, x) => ctx?.act?.ui?.get(x.id) || {};
// 点过、交出去了：卡片和行变灰（撤回倒数和回执照常亮着）；看见了、知道了：卡片收起，只留标题和回执
export const actCls = (x, ctx) => {
  const s = hasActs(x) && stOf(ctx, x);
  if (!s || (s.phase !== 'done' && s.phase !== 'undoing')) return '';
  return ' is-acted' + (s.action === 'seen' || s.action === 'ack' ? ' is-folded' : '');
};

// 答题：后端 questions（多题，用每题 id）或 options（单题，题号 choice）；字符串选项以原字符串为值，对象选项用 value；
// 选项可带 detail（点了会怎样）和 recommended（AI 建议，最多一个，画成主按钮）
export function questionsFor(x) {
  const opts = (list) => {
    const out = (Array.isArray(list) ? list : []).map((o) => (typeof o === 'string' ? { value: o, text: o, detail: '', rec: false }
      : o && typeof o === 'object' && o.value !== undefined && o.value !== null
        ? { value: o.value, text: String(o.text || o.label || o.value), detail: typeof o.detail === 'string' ? o.detail.trim() : '', rec: o.recommended === true } : null)).filter((o) => o && String(o.text).trim());
    let seen = false;
    return out.map((o) => { const rec = o.rec && !seen; if (rec) seen = true; return { ...o, rec }; });
  };
  if (Array.isArray(x?.questions) && x.questions.length) {
    return x.questions.map((q) => (q && typeof q === 'object' && typeof q.id === 'string' && q.id ? { id: q.id, text: String(q.text || ''), options: opts(q.options) } : null)).filter((q) => q && q.options.length);
  }
  const one = opts(x?.options);
  return one.length ? [{ id: 'choice', text: '', options: one }] : [];
}
export const answered = (qs, u) => qs.length > 0 && qs.every((q) => u.answers?.[q.id] && 'value' in u.answers[q.id]);

// 撤回还剩多久：10 分钟以内倒数秒；更长的（看见了、知道了、晚点提醒是 24 小时）写“今天 18:40 前可撤回”“明天 18:40 前可撤回”
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

// 点完说清会怎样（本人 18:51：长了头疼、短了谜语）。回执里有 message 时撤回期里以回执为准；撤回期过了一律写这些
const SNOOZE_WORD = Object.fromEntries(SNOOZE);
const untilWord = (u) => { const m = /^\d{4}-(\d{2})-(\d{2})$/.exec(u || ''); return SNOOZE_WORD[u] || (m ? `${+m[1]} 月 ${+m[2]} 日 9 点` : '到时候'); };
export function doneText(s) {
  const at = hm(s.receipt?.apply_at || s.receipt?.created_at);
  switch (s.action) {
    case 'done': return '已记下。AI 会去核实，没问题这张卡就消失。';
    case 'dismiss': return '已移走，AI 记下你不做了。';
    case 'snooze': return `好，${untilWord(s.until)}再提醒你。`;
    case 'seen': case 'ack': return '收起了。';
    case 'delegate': return '好，AI 按它的建议办；以后这类事它自己定。';
    case 'unclear': return 'AI 正在换个说法重写这张卡，写好会更新在这里。';
    // “AI 在等你回”的卡：答案送回原来那个对话（不选交给谁）
    case 'answer': if (!s.executor) return `已送回原来那个对话${at ? `（${at}）` : ''}，AI 接着做，做完会通知你。`; // 选了交给谁的照下面
    // falls through
    default: return `已交给 ${WHO[s.executor] || 'AI'}${at ? `（${at}）` : ''}，办完会通知你。`;
  }
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
// 交出去以后：灰着，下面一句点完会怎样 + “撤回” + 倒数
function receipt(s, ctx) {
  const r = s.receipt || {}, now = ctx.now;
  const until = Date.parse(r.undo_until || '');
  const err = s.undoError ? `<p class="cp-oa-err" role="alert">${esc(s.undoError)}</p>` : '';
  const said = typeof r.message === 'string' && r.message.trim() ? r.message.trim() : doneText(s);
  if (s.phase === 'undoing') return `<p class="cp-oa-done"><span class="cp-oa-msg">${esc(said)}</span>${btn('撤回', 'disabled aria-busy="true"', ' cp-oa-undo')}</p>`;
  if (Number.isFinite(until) && until > now.getTime()) {
    return `<p class="cp-oa-done"><span class="cp-oa-msg">${esc(said)}</span>${btn('撤回', `data-undo="${esc(r.id || '')}"`, ' cp-oa-undo')}`
      + `<span class="cp-oa-left" data-left="${esc(r.undo_until)}">${esc(leftText(r.undo_until, now))}</span></p>` + err;
  }
  return `<p class="cp-oa-done"><span class="cp-oa-msg">${esc(doneText(s))}</span></p>` + err;
}

// 一条的按钮区。o.card：要你处理的大卡片（“交给：Claude ▾”在按钮行上）；行只在有一点就交给 AI 的按钮时放在按钮行，否则放进写字的框里。
// o.only：这一区块允许的动作；o.mid：选项和按钮行之间插的一句（如“不回会怎样”）；o.noExec：答案送回原对话，不选交给谁；
// o.extra：按钮行末尾的链接（如“去办 →”）；o.label：按钮文字改写（如 AI 已定那条的“回一句话”写成“不同意，改一下”）；
// o.minor：问题卡和“AI 在等你回”卡，“晚点提醒”“这件不做了”降成按钮行下面一行小字链接（同样能点、同样能撤回），不跟选项抢眼
export function ownerBox(x, ctx, o = {}) {
  const acts = actsOf(x, o.only);
  const status = ownerStatus(x, ctx.now);
  if (!acts.length) return status;
  const s = stOf(ctx, x), u = uiOf(ctx, x);
  const open = `<div class="cp-oa${o.card ? ' is-card' : ''}" data-oa="${esc(x.id)}"${x.item_version !== undefined && x.item_version !== null ? ` data-ver="${json(x.item_version)}"` : ''}${o.noExec ? ' data-noexec' : ''}>`;
  if (s && (s.phase === 'done' || s.phase === 'undoing')) return status + open + receipt(s, ctx) + '</div>';
  const busy = s?.phase === 'sending';
  const dis = busy ? ' disabled' : '';
  const label = { ...LABEL, ...o.label };
  const exec = u.executor === 'gpt' ? 'gpt' : 'claude';
  const has = (a) => acts.includes(a);
  const qs = has('answer') ? questionsFor(x) : [];
  // 只有一道题：点选项就直接交（照常可撤回）；要补一句话先点“补一句”。多道题：每题选一个、每题一个“我的说明”，再点“交给 AI”
  const one = qs.length === 1;
  const showExec = !o.noExec && (o.card || ['answer', 'done', 'dismiss', 'confirm', 'delegate', 'unclear'].some(has));
  const optBtn = (q, op, a) => {
    const pressed = !one && a && JSON.stringify(a.value) === JSON.stringify(op.value);
    const cls = ' cp-opt' + (op.rec ? ' cp-btn-main' : '');
    const name = op.text + (op.rec ? ' · AI 建议' : '');
    return one ? btn(name, `data-pick data-val="${json(op.value)}"${dis}`, cls) : btn(name, `data-val="${json(op.value)}" aria-pressed="${pressed ? 'true' : 'false'}"${dis}`, cls);
  };
  const quiz = qs.length ? `<div class="cp-oa-quiz">${qs.map((q, i) => {
    const a = u.answers?.[q.id];
    const legend = qs.length > 1 || q.text ? `<legend><b>第 ${i + 1} 题</b>${esc(q.text)}</legend>` : '';
    const detailed = q.options.some((op) => op.detail);
    const options = detailed
      ? `<ul class="cp-oa-opts">${q.options.map((op) => `<li>${optBtn(q, op, a)}${op.detail ? `<span class="cp-oa-detail">${esc(op.detail)}</span>` : ''}</li>`).join('')}</ul>`
      : `<div class="cp-opts">${q.options.map((op) => optBtn(q, op, a)).join('')}</div>`;
    const note = !one || u.open === 'add'
      ? `<input class="cp-note cp-oa-qnote" type="text" data-qnote maxlength="${MAX_TEXT}" placeholder="${one ? '补一句（写好再点上面的选项）' : '我的说明（可不写）'}" aria-label="第 ${i + 1} 题我的说明" value="${esc(a?.text || '')}"${dis}>` : '';
    return `<fieldset class="cp-oa-q" data-qid="${esc(q.id)}">${legend}${options}${note}</fieldset>`;
  }).join('')}</div>` : '';
  const ready = answered(qs, u);
  const swTo = other(x.executor === 'gpt' || x.executor === 'claude' ? x.executor : x.vendor === 'gpt' ? 'gpt' : 'claude');
  const bar = [
    qs.length > 1 ? btn('交给 AI', `data-send="answer"${ready && !busy ? '' : ' disabled'}`, ' cp-btn-main') : '',
    has('confirm') ? btn(label.confirm, `data-act="confirm"${dis}`, ' cp-btn-main') : '',
    has('done') ? btn(label.done, `data-act="done"${dis}`, ' cp-btn-main') : '',
    has('seen') ? btn(label.seen, `data-act="seen"${dis}`) : '',
    has('ack') ? btn(label.ack, `data-act="ack"${dis}`) : '',
    has('switch') ? btn(`改给 ${WHO[swTo]}`, `data-act="switch" data-to="${swTo}"${dis}`) : '',
    has('delegate') ? btn(label.delegate, `data-act="delegate"${dis}`) : '',
    has('unclear') ? btn(label.unclear, `data-act="unclear"${dis}`) : '',
    one ? btn('补一句', `data-add aria-expanded="${u.open === 'add'}"${dis}`) : '',
    has('note') && !one ? btn(label.note, `data-act="note" aria-expanded="${u.open === 'note'}"${dis}`) : '',
    has('snooze') && !o.minor ? btn(label.snooze, `data-act="snooze" aria-expanded="${u.open === 'snooze'}"${dis}`) : '',
    has('redo') ? btn(label.redo, `data-act="redo" aria-expanded="${u.open === 'redo'}"${dis}`) : '',
    has('dismiss') && !o.minor ? btn(label.dismiss, `data-act="dismiss"${dis}`, ' cp-btn-quiet') : '',
  ].filter(Boolean);
  const minor = o.minor ? [
    has('snooze') ? btn(label.snooze, `data-act="snooze" aria-expanded="${u.open === 'snooze'}"${dis}`, ' cp-oa-link') : '',
    has('dismiss') ? btn(label.dismiss, `data-act="dismiss"${dis}`, ' cp-oa-link') : '',
  ].filter(Boolean) : [];
  const hint = qs.length > 1 && !ready ? `<p class="cp-oa-hint">每道题都选一个，才能交</p>` : '';
  // 回一句话 / 不对，重做：一个输入框（最多 500 字，都必须写）+ 交给 AI
  const text = u.open === 'note' || u.open === 'redo'
    ? `<div class="cp-oa-panel"><textarea class="cp-oa-text" data-text rows="3" maxlength="${MAX_TEXT}" placeholder="${u.open === 'redo' ? '哪里不对、要怎么改（必填）' : '想对 AI 说的话（最多 500 字）'}" aria-label="${u.open === 'redo' ? '哪里不对、要怎么改' : label.note}"${dis}>${esc(u.text || '')}</textarea>`
      + `<div class="cp-oa-row">${showExec || o.noExec ? '' : execBtn(exec)}${btn('交给 AI', `data-send="${u.open}"${(u.text || '').trim() && !busy ? '' : ' disabled'}`, ' cp-btn-main')}</div></div>` : '';
  // 晚点提醒：明早 9 点、3 天后、下周一 9 点、选一天
  const snooze = u.open === 'snooze'
    ? `<div class="cp-oa-panel cp-oa-snooze">${SNOOZE.map(([v, l]) => btn(l, `data-snooze="${v}"${dis}`)).join('')}`
      + `<label class="cp-oa-date"><span>选一天</span><input type="date" data-snooze-date min="${todayBJ(ctx.now)}"${dis}></label></div>` : '';
  const err = s?.phase === 'error' ? `<p class="cp-oa-err" role="alert">${esc(s.error)}${s.refresh ? btn('刷新', 'data-oa-refresh') : ''}</p>` : '';
  const undone = s?.phase === 'undone' ? `<p class="cp-oa-note" role="status">${esc(s.message || '已撤回')}</p>` : '';
  return status + open + quiz + (o.mid || '') + hint + `<div class="cp-oa-bar"${busy ? ' aria-busy="true"' : ''}>${bar.join('')}${o.extra || ''}${showExec ? execBtn(exec) : ''}</div>` + (minor.length ? `<p class="cp-oa-minor">${minor.join('')}</p>` : '') + text + snooze + err + undone + `</div>`;
}

// “你最近处理的（30 天）›”（后端 owner_recent）：默认收起；每行一句人话、交给谁、状态；还能撤回的带“撤回”
const RECENT = { applied: '已记下', undone: '已撤回', rejected: '没办成' };
const CJK = /[一-鿿]/;
export function recentBlock(v, ctx) {
  const rows = v.owner_recent;
  if (!rows || !rows.length) return '';
  const items = rows.map((r) => {
    const local = ctx.act?.recent?.get(r.id);
    const status = local === 'undone' ? 'undone' : r.status;
    const ai = AI_ACTIONS.includes(r.action), who = WHO[r.executor] || 'AI';
    const why = [r.error_message, r.error].find((e) => typeof e === 'string' && CJK.test(e)) || '';
    const word = status === 'waiting_undo' ? (ai ? `要交给 ${who}，还能撤回` : '还能撤回') : status === 'ready_for_ai' ? `已交给 ${who}`
      : status === 'rejected' && why ? `没办成：${why}` : RECENT[status] || '';
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
