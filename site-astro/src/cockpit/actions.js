// 本人只在这里收起事项或稍后提醒；要让 AI 办事，复制卡片后在对话里说。
import { hm, when, dateHm } from './model.js';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const json = (x) => esc(JSON.stringify(x));
export const ACTIONS = ['ack', 'snooze'];
export const LABEL = { ack: '知道了', snooze: '晚点提醒' };
export const SNOOZE = [['tomorrow_9', '明早 9 点'], ['three_days', '3 天后'], ['next_monday_9', '下周一 9 点']];
export const actsOf = (x, only = null) => (Array.isArray(x?.owner_actions) && typeof x.id === 'string' && x.id.trim()
  ? ACTIONS.filter((a) => x.owner_actions.includes(a) && (!only || only.includes(a))) : []);
export const hasActs = (x, only = null) => actsOf(x, only).length > 0;
const stOf = (ctx, x) => ctx?.act?.state?.get(x.id) || null;
const uiOf = (ctx, x) => ctx?.act?.ui?.get(x.id) || {};
export const actCls = (x, ctx) => {
  if (ctx.viewer?.kind !== 'owner') return '';
  const s = stOf(ctx, x);
  return s && ACTIONS.includes(s.action) && ['sending', 'done', 'undoing'].includes(s.phase) && !s.undoRequested ? ' is-hidden-action' : '';
};

// 选项是普通说明；保留每项解释和第一条 AI 建议，独立于 owner_actions。
export function questionsFor(x) {
  const opts = (list) => {
    let seen = false;
    return (Array.isArray(list) ? list : []).map((o) => {
      const v = typeof o === 'string' ? { value: o, text: o } : o && typeof o === 'object' ? o : {};
      const text = String(v.text || v.label || (v.value ?? '')).trim();
      const rec = v.recommended === true && !seen;
      if (rec) seen = true;
      return { value: v.value ?? text, text, detail: typeof v.detail === 'string' ? v.detail.trim() : '', rec };
    }).filter((o) => o.text);
  };
  if (Array.isArray(x?.questions) && x.questions.length) return x.questions.map((q, i) => q && typeof q === 'object'
    ? { id: String(q.id || 'q' + (i + 1)), text: String(q.text || ''), options: opts(q.options) } : null).filter((q) => q && q.options.length);
  const one = opts(x?.options);
  return one.length ? [{ id: 'choice', text: '', options: one }] : [];
}
const DAY = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
export const todayBJ = (now = new Date()) => DAY(now);
export const untilWord = (u) => {
  const m = /^\d{4}-(\d{2})-(\d{2})$/.exec(u || '');
  return Object.fromEntries(SNOOZE)[u] || (m ? `${+m[1]} 月 ${+m[2]} 日 9 点` : '到时候');
};
const textOf = (v) => typeof v === 'string' ? v.trim() : v && typeof (v.text ?? v.summary) === 'string' ? (v.text ?? v.summary).trim() : '';
const first = (...vs) => vs.map(textOf).find(Boolean) || '';
const displayTitle = (x) => first(x.headline, x.title, x.text, x.project).replace(/\s*汇报在电脑上：[^（]*(?:（路径\s*[^）]+）)?[。]?/g, '').replace(/\s*（路径\s*[^）]+）/g, '').replace(/\s*[A-Za-z]:\\[^，。；）\n]*/g, '').replace(/[。；\s]+$/, '').trim();
export function copyText(x) {
  const lines = ['先用大白话给我解释这是什么事、为什么找我、现在到哪一步、我可以怎么做；先别执行任何操作。我下了明确命令，你就直接去做，不用再问我确认。', ''];
  const add = (label, value) => { if (value) lines.push(`${label}：${value}`); };
  add('驾驶舱卡片', first(x.headline, x.title, x.text, x.project));
  const current = [x.body, x.progress, x.latest_progress, x.owner_detail, x.detail, x.doing, x.latest_reply, x.summary, x.text, x.next_step, x.headline && x.title !== x.headline ? x.title : ''].map(textOf).filter(Boolean);
  add('现在', [...new Set(current)].join('\n'));
  add('状态', textOf(x.status_text) || ({ running: '正在干活', network_retry: '网络在重连', quota_exhausted: '额度用完', login_failed: '登录失效', waiting_owner: '在等你回话', stopped: '停了，没做完', unknown: '判断不了' }[x.status] || textOf(x.status)));
  add('为什么找我', textOf(x.why_you));
  add('不做会怎样', first(x.consequence, x.action?.consequence));
  const steps = (Array.isArray(x.steps) ? x.steps : []).map(textOf).filter(Boolean);
  if (steps.length) add('怎么办', '\n' + steps.map((s, i) => `${i + 1}. ${s}`).join('\n'));
  const choices = questionsFor(x).map((q) => [q.text, ...q.options.map((o) => `${o.text}${o.rec ? '（AI 建议）' : ''}${o.detail ? '：' + o.detail : ''}`)].filter(Boolean).join('\n'));
  if (choices.length) add('要我选的', '\n' + choices.join('\n'));
  const conf = x.confirmation;
  const confirmations = typeof conf === 'string' ? [conf] : conf && typeof conf === 'object'
    ? [['to', '发给'], ['content', '发什么'], ['amount', '花多少'], ['target', '删什么']].map(([k, l]) => textOf(conf[k]) ? `${l}：${textOf(conf[k])}` : '').filter(Boolean) : [];
  if (confirmations.length) add('要我确认的', '\n' + confirmations.join('\n'));
  const times = [['登记', x.registered_at || x.created_at || x.asked_at], ['开始', x.started_at], ['截止', x.due_at], ['更新', x.updated_at || x.observed_at || x.at], ['最近活动', x.last_activity_at], ['进展', x.progress?.at || x.progress_at], ['最近回复', x.latest_reply?.at || x.latest_reply_at]].filter(([, v]) => v).map(([l, v]) => `${l} ${dateHm(v) || v}`);
  add('时间', times.join('；'));
  // 电脑路径保留在复制内容中，方便 AI 直接找到原件。
  add('路径', first(x.path, x.report_path, x.action?.path));
  add('编号', textOf(x.id));
  return lines.join('\n');
}
export function ownerStatus(x, now) {
  const who = { claude: 'Claude', gpt: 'GPT' };
  const t = x?.handed_to_ai ? when(x.handed_to_ai.at, now) : '';
  const text = x?.verifying === true ? 'AI 核实中' : x?.handed_to_ai ? `已交给 ${who[x.handed_to_ai.executor] || 'AI'}${t ? `（${t}）` : ''}` : '';
  return text ? `<p class="cp-oa-status">${esc(text)}</p>` : '';
}
const btn = (label, attrs, cls = '') => `<button type="button" class="cp-btn${cls} ct-inline-action" ${attrs}>${esc(label)}</button>`;
export function ownerBox(x, ctx, o = {}) {
  const owner = ctx.viewer?.kind === 'owner';
  const acts = owner ? actsOf(x, o.only) : [], status = owner ? ownerStatus(x, ctx.now) : '';
  const copy = owner ? `<button type="button" class="cp-btn cp-copy ct-inline-action" aria-label="复制给 AI" data-copy="${esc(copyText(x))}" data-copy-label="复制给 AI"><svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M13 5V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1"/></svg><span data-copy-caption>复制给 AI</span></button>` : '';
  if (!acts.length && !copy && !o.extra) return status;
  const s = stOf(ctx, x), u = uiOf(ctx, x), busy = ['sending', 'undoing'].includes(s?.phase);
  const dis = busy ? ' disabled' : '';
  const bar = acts.map((a) => btn(LABEL[a], `data-act="${a}"${a === 'snooze' ? ` aria-expanded="${u.open === 'snooze'}"` : ''}${dis}`)).join('');
  const snooze = acts.includes('snooze') && u.open === 'snooze' ? `<div class="cp-oa-panel cp-oa-snooze">${SNOOZE.map(([v, l]) => btn(l, `data-snooze="${v}"${dis}`)).join('')}<label class="cp-oa-date"><span>选一天</span><input type="date" data-snooze-date min="${todayBJ(ctx.now)}"${dis}></label></div>` : '';
  const err = s?.phase === 'error' ? `<span class="cp-oa-err" role="alert">${esc(s.error)}${s.refresh ? btn('刷新', 'data-oa-refresh') : ''}</span>` : '';
  return status + `<div class="cp-oa${o.card ? ' is-card' : ''}" data-oa="${esc(x.id || '')}" data-title="${esc(displayTitle(x))}" data-source-title="${esc(first(x.title, x.headline, x.text, x.project))}"${x.item_version != null ? ` data-ver="${json(x.item_version)}"` : ''}>`
    + (o.mid || '') + `<div class="cp-oa-bar"${busy ? ' aria-busy="true"' : ''}>${bar}${err}${o.extra || ''}${copy}</div>` + snooze + '</div>';
}
// 顶部短回执不占卡片；请求还在路上也可以先记下撤回。
export function actionToast(ctx) {
  if (ctx.viewer?.kind !== 'owner') return '';
  return [...(ctx.act?.state || [])].filter(([, s]) => s.toastUntil > ctx.now.getTime() && s.phase !== 'error').map(([id, s]) => {
    const title = displayTitle({ title: s.title }) || '这件事';
    const text = s.phase === 'undone' ? `已撤回「${title}」` : s.undoRequested || s.phase === 'undoing' ? '正在撤回…' : s.undoError || (s.action === 'snooze' ? `好，${untilWord(s.until)}再提醒你` : `已收起「${title}」`);
    const undo = s.phase === 'undone' ? '' : btn('撤回', `data-undo="${esc(s.receipt?.id || '')}" data-undo-item="${esc(id)}"${s.undoRequested || s.phase === 'undoing' ? ' disabled' : ''}`, ' cp-oa-undo');
    return `<p class="cp-action-toast" role="status"><span>${esc(text)}</span>${undo}</p>`;
  }).join('');
}
export function recentBlock(v, ctx) {
  if (ctx.viewer?.kind !== 'owner' || !v.owner_recent?.length) return '';
  const items = v.owner_recent.map((r) => {
    const local = ctx.act?.recent?.get(r.id), status = local === 'undone' ? 'undone' : r.status;
    const why = typeof r.error_message === 'string' ? r.error_message : typeof r.error === 'string' ? r.error : '';
    const failed = !!r.error_message || ['rejected', 'failed', 'error'].includes(status);
    const word = status === 'undone' ? '已撤回' : local === 'undoing' ? '正在撤回…' : local?.error || (failed ? `没存上${why ? '：' + why : ''}` : r.action === 'ack' ? '已收起' : r.action === 'snooze' ? `好，${untilWord(r.until)}再提醒你` : ({ waiting_undo: '已记下', ready_for_ai: '已交给 AI', applied: '已记下' }[status] || ''));
    const text = String(r.text || r.title || '').replace(/^\s*\d{1,2}:\d{2}\s*/, '').replace(/（已撤回）\s*$/, '');
    const undo = r.can_undo === true && status !== 'undone' ? btn(local === 'undoing' ? '正在撤回' : '撤回', local === 'undoing' ? 'disabled' : `data-recent-undo="${esc(r.id)}"`, ' cp-oa-undo') : '';
    return `<li class="is-${esc(status || 'other')}"><span class="cp-recent-text">${r.created_at ? `<time>${esc(when(r.created_at, ctx.now))}</time>` : ''}${esc(text)}</span><span class="cp-recent-st">${esc(word)}</span>${undo}</li>`;
  }).join('');
  return `<details class="cp-recent" id="owner-recent"><summary>你最近处理的（30 天）</summary><ul class="cp-recent-list">${items}</ul></details>`;
}
export function ownerWarn(v, ctx) {
  if (ctx?.viewer?.kind !== 'owner') return '';
  const bits = [], worker = v.owner_actions_worker;
  const failed = Array.isArray(worker?.failed_items) ? worker.failed_items : [];
  const usable = failed.filter((x) => x && first(x.title, x.item_title) && first(x.created_at, x.at) && first(x.error_message, x.reason, x.message, x.error));
  if (usable.length) {
    usable.slice(0, 2).forEach((x) => bits.push(`你 ${hm(x.created_at || x.at)} 点的「${first(x.title, x.item_title)}」没存上：${first(x.error_message, x.reason, x.message, x.error)}`));
    if (failed.length > 2) bits[bits.length - 1] += `；等 ${failed.length} 条`;
  } else if (worker?.state === 'error') bits.push('你点的处理暂时写不回，电脑在重试');
  if (v.notification_status === 'failed') bits.push(v.notification_message || '通知没发出去');
  if (v.owner_dispatch_notice) bits.push(v.owner_dispatch_notice);
  return bits.map((b) => `<p class="cp-oa-warn" role="status">${esc(b)}</p>`).join('');
}
