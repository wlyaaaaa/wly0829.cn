// 一个项目页（/live/project/?id=…）的共用排版：只放不碰页面的纯算法，page.js 调；node 测试直接 require。
// 每个项目自己的颜色和画在共用小件 _lib/live-project-look.js。
// 1. 两栏卡片按高度摆齐：按给的先后，一张一张放进当前更矮的那一栏。
// 2. “规则版本”的近两周发布、退回：按北京时间周一切周，读不到的周写“无记录”，不当 0。
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ProjectLayout = api;
})(typeof window !== 'undefined' ? window : globalThis, () => {
  'use strict';

  // 两栏摆齐：heights 按摆放先后给；返回每张放哪一栏（0 左、1 右）。
  // 每栏里卡片的先后不变，只挑放哪一栏：卡不多时把所有分法都试一遍，取两栏最齐的；一样齐的取更接近“一张一张放进更矮那栏”的分法。
  // pins[i] 给了 0／1 的那张钉在那一栏（本人版、访客版卡片高度不一样，钉住的几张两版摆在同一处）
  function greedy(heights, gap, pins = []) {
    const cols = [0, 0], out = [];
    heights.forEach((h, i) => { const c = pins[i] ?? (cols[1] < cols[0] ? 1 : 0); out[i] = c; cols[c] += (cols[c] ? gap : 0) + Math.max(0, h || 0); });
    return out;
  }
  function split(heights, gap = 0, pins = []) {
    const n = heights.length, base = greedy(heights, gap, pins);
    if (n < 2 || n > 16) return base;
    const hs = heights.map(h => Math.max(0, h || 0));
    let best = base, bestDiff = Infinity, bestMoved = Infinity;
    for (let mask = 0; mask < 1 << n; mask++) {
      if ((mask & 1) !== (pins[0] === 1 ? 1 : 0)) continue;   // 第一张在左栏（钉在右栏的除外）
      const cols = [0, 0], out = [];
      let fits = true;
      for (let i = 0; i < n; i++) { const c = (mask >> i) & 1; if (pins[i] != null && pins[i] !== c) { fits = false; break; } out[i] = c; cols[c] += (cols[c] ? gap : 0) + hs[i]; }
      if (!fits) continue;
      const diff = Math.abs(cols[0] - cols[1]), moved = out.reduce((k, c, i) => k + (c !== base[i]), 0);
      if (diff < bestDiff - 0.5 || (Math.abs(diff - bestDiff) <= 0.5 && moved < bestMoved)) { best = out; bestDiff = diff; bestMoved = moved; }
    }
    return best;
  }
  // 旧的摆法还够齐就不挪，免得每分钟一刷新卡片换栏
  function keep(previous, heights, gap = 0, pins = []) {
    if (!Array.isArray(previous) || previous.length !== heights.length || previous.some((c, i) => pins[i] != null && pins[i] !== c)) return false;
    const sum = c => previous.reduce((n, col, i) => col === c ? n + Math.max(0, heights[i] || 0) + gap : n, 0);
    const fresh = split(heights, gap, pins), freshSum = c => fresh.reduce((n, col, i) => col === c ? n + Math.max(0, heights[i] || 0) + gap : n, 0);
    const before = Math.abs(sum(0) - sum(1)), after = Math.abs(freshSum(0) - freshSum(1));
    return before <= after + 60;
  }

  // —— 规则版本：近两周 ——
  const DAY = 86400000;
  const beijingDate = ms => new Date(ms + 8 * 3600000).toISOString().slice(0, 10);
  const parse = at => { if (!at) return NaN; return Date.parse(/(?:Z|[+-]\d\d:\d\d)$/.test(at) ? at : `${at}${at.length === 10 ? 'T00:00:00' : ''}+08:00`); };
  function monday(date) {   // date: YYYY-MM-DD（北京时间那一天）→ 那一周的周一
    const t = Date.parse(`${date}T00:00:00Z`), wd = (new Date(t).getUTCDay() + 6) % 7;
    return new Date(t - wd * DAY).toISOString().slice(0, 10);
  }
  const shift = (date, days) => new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY).toISOString().slice(0, 10);
  const finite = n => typeof n === 'number' && Number.isFinite(n);
  // history 给 weekly（新：complete、observed_*）或 weeks（旧：published、rolled_back，null 是没记）
  function twoWeeks(history, now = Date.now()) {
    const weekly = Array.isArray(history?.weekly) && history.weekly.length ? history.weekly : null;
    const rows = (weekly || history?.weeks || []).filter(w => /^\d{4}-\d\d-\d\d$/.test(w?.week || ''));
    const latest = rows.map(w => w.week).sort().at(-1);
    const from = parse(history?.events_observed_from || history?.observed_from);
    const end = latest || monday(beijingDate(Number.isFinite(from) ? Math.max(from, now) : now));
    return [shift(end, -7), end].map(week => {
      const w = rows.find(r => r.week === week), to = shift(week, 6);
      const label = `${week.slice(5)} ~ ${to.slice(5)}`;
      if (!w) return { week, label, published: null, rolled_back: null, partial: false, before: Number.isFinite(from) && Date.parse(`${shift(week, 7)}T00:00:00+08:00`) <= from };
      const complete = weekly ? w.complete === true : true;
      const pick = key => complete ? w[key] : w[`observed_${key}`] ?? null;
      return { week, label, published: finite(pick('published')) ? pick('published') : null, rolled_back: finite(pick('rolled_back')) ? pick('rolled_back') : null, partial: !complete || w.q === 'partial', before: false };
    });
  }

  return { split, keep, twoWeeks, monday };
});
