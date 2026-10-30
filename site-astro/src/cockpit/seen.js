// 新出现的标“新”（本人 10-30 批准第 4 项）：这台浏览器记上次看到哪些条目，之后新冒出来的卡和行左边一个小绿点“新”。
// 只存条目编号和时间，不存标题、正文这类私人内容，所以公开版也能用；每页（驾驶舱首页、AI 的账本）各记各的。
// 这里只放纯函数（构建、浏览器和测试共用）；读写 localStorage、看没看过（进视野停一会儿或关页）在 client.js。
export const SEEN_PAGES = { '/cockpit/': 'home', '/cockpit/ai/': 'ledger' };
export const seenKey = (page) => 'wly-cockpit-seen:' + page;
// 进视野停留多久算看过
export const SEEN_DWELL_MS = 1500;
const MAX_IDS = 2000;

const idOf = (x) => (x && typeof x.id === 'string' && x.id.trim() ? x.id.trim() : '');
// 每页算哪些条目：首页是要你做、你得知道（不含 AI 已定）、你放着的；账本页是 AI 在跟、晚了的、AI 已定、AI 等条件的。
// “AI 正在干活”的行是对话，来来去去，不算条目
export function trackedIds(v, page) {
  const know = v.must_know?.items || [];
  const mineDeferred = (v.deferred || []).filter((x) => !x.action_owner || x.action_owner === 'user');
  const lists = page === 'ledger'
    ? [v.ai_following || [], v.ai_overdue || [], know.filter((k) => k.kind === 'ai_decision'), (v.deferred || []).filter((x) => x.action_owner && x.action_owner !== 'user')]
    : [v.need_you || [], know.filter((k) => k.kind !== 'ai_decision'), mineDeferred, v.scheduled || []];
  return [...new Set(lists.flat().map(idOf).filter(Boolean))];
}
// 存的格式：{v:1, at: 毫秒, ids: [...]}；坏数据、别的格式一律当没来过
export function parseSeen(raw) {
  try {
    const o = JSON.parse(raw || '');
    if (!o || o.v !== 1 || !Number.isFinite(o.at) || !Array.isArray(o.ids)) return null;
    return { at: o.at, ids: new Set(o.ids.filter((s) => typeof s === 'string' && s).slice(0, MAX_IDS)) };
  } catch { return null; }
}
export const serializeSeen = (at, ids) => JSON.stringify({ v: 1, at, ids: [...ids].slice(0, MAX_IDS) });
// 和上次比：fresh 是这次有、上次没有的（新冒出），closed 是上次有、这次没有的（按“AI 关掉”估）
export function compare(prev, ids) {
  if (!prev) return { fresh: [], closed: 0 };
  const now = new Set(ids);
  return { fresh: ids.filter((id) => !prev.ids.has(id)), closed: [...prev.ids].filter((id) => !now.has(id)).length };
}
const BJ = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const parts = (t) => Object.fromEntries(BJ.formatToParts(new Date(t)).map((p) => [p.type, p.value]));
// “你上次 23:10 来过，之后新冒出 2 件、AI 关掉 4 件”；不是今天写“10月29日 23:10”；没有变化不写（第一次打开也不写）
export function sinceText(since, now) {
  if (!since || !Number.isFinite(since.at) || !(since.fresh > 0 || since.closed > 0)) return '';
  const a = parts(since.at), b = parts(now.getTime());
  const at = `${a.month === b.month && a.day === b.day ? '' : `${a.month}月${a.day}日 `}${a.hour}:${a.minute}`;
  const bits = [since.fresh > 0 ? `新冒出 ${since.fresh} 件` : '', since.closed > 0 ? `AI 关掉 ${since.closed} 件` : ''].filter(Boolean);
  const said = bits.join('、');
  return `你上次 ${at} 来过，之后${/^[A-Za-z]/.test(said) ? ' ' : ''}${said}`;
}
// 小绿点“新”：按编号生成一段样式，不改已经画好的内容（每分钟换字时不用重画）。
// 卡和行带 data-items（多个编号空格分开），账本页表格行带 data-ids
const attr = (s) => s.replace(/["\\]/g, '\\$&');
export function newCss(ids) {
  if (!ids.length) return '';
  const sel = (a) => ids.map((id) => `[${a}~="${attr(id)}"]`).join(',');
  const items = `:is(${sel('data-items')})`, rows = `.cp-ltable tr:is(${sel('data-ids')}) > td:first-child`;
  return `.cp-page ${items}, .cp-page ${rows} { position: relative; }\n`
    + `.cp-page li${items}, .cp-page ${rows} { padding-left: 30px !important; }\n`
    + `.cp-page ${items}::before, .cp-page ${rows}::before { content: "新"; position: absolute; z-index: 2; left: 10px; top: -9px; padding: 0 6px 0 14px; border: 1px solid #a8dcb9; border-radius: 99px; background: #fff radial-gradient(circle at 7px 50%, #2f9e5a 3.5px, transparent 4px) no-repeat; color: #1d7a45; font-size: 11px; font-weight: 800; line-height: 16px; }\n`
    + `.cp-page li${items}::before, .cp-page ${rows}::before { left: 0; top: 11px; }\n`;
}
