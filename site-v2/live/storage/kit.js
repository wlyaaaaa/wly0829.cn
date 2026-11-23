// 存储页共用的小工具：字节怎么写、盘叫什么、多久满。自动清理卡（cleanup.js）、每块盘卡（disks.js）和 page.js 共用。
// 全页按 1024 进制写 KB、MB、GB、TB。
(() => {
  'use strict';
  const KiB = 2 ** 10, MiB = 2 ** 20, GiB = 2 ** 30, TiB = 2 ** 40;
  function size(n, digits) {
    if (!Number.isFinite(n)) return '—';
    const a = Math.abs(n), sign = n < 0 ? '−' : '';
    if (a >= TiB) return `${sign}${Number((a / TiB).toFixed(2))} TB`;
    const [divisor, unit] = a >= GiB ? [GiB, 'GB'] : a >= MiB ? [MiB, 'MB'] : a >= KiB ? [KiB, 'KB'] : [1, 'B'];
    const value = a / divisor;
    const rounded = Number(value.toFixed(digits ?? (value < 10 && divisor > 1 ? 1 : 0)));
    return `${sign}${rounded === 1024 ? 1023 : rounded} ${unit}`;
  }
  const PRIVATE = '仅本人可见';
  const isPlaceholder = text => typeof text === 'string' && text.trimEnd().endsWith(PRIVATE);
  const locked = value => value?.content_locked === true;
  const raw = value => value && typeof value === 'object' ? value.value ?? value.text ?? value.label : value;
  function field(value, label, viewer) {
    if (viewer !== 'owner' && locked(value)) return label + PRIVATE;
    const text = window.LiveUI.fieldText(raw(value), viewer);
    if (!isPlaceholder(text)) return text;
    if (viewer === 'owner') return '';
    return text.trim() === PRIVATE ? label + PRIVATE : text;
  }
  function splitRows(rows, viewer) {
    rows ??= [];
    const visible = viewer === 'owner' ? rows : rows.filter(row => !locked(row));
    return { visible, hidden: rows.length - visible.length };
  }
  // 新私事规则（本人 11-24 02:56）：访客侧不再写“另有 N 条……仅本人可见”。
  const hiddenRows = () => '';
  // 盘的用途：后台给 volumes[].purpose 就用后台的；没给按盘符对照（H 盘卷标是一串数字，要对照表）。
  const PURPOSE = { C: '系统', D: '游戏', E: '软件', F: '恢复 U 盘', G: '数据', H: '备份', V: '开发盘' };
  const ORDER = 'CDEGHVF';
  const letter = v => (/^([a-z]):?$/i.exec(String(v?.id ?? v ?? ''))?.[1] || '').toUpperCase();
  const volName = (v, viewer) => letter(v) ? `${letter(v)} 盘` : field(v?.name ?? v?.id, '磁盘名称', viewer);
  const purpose = (v, viewer) => field(v?.purpose, '磁盘用途', viewer) || PURPOSE[letter(v)] || '';
  function offlineRead(v, viewer) {
    const stamp = field(v.read_at, '上次容量读数时间', viewer);
    const U = window.LiveUI;
    return `离线${Number.isFinite(Date.parse(stamp)) ? ` · 上次 ${U.date(stamp)} ${U.time(stamp)} 读到` : stamp && isPlaceholder(stamp) ? ` · ${stamp}` : ''}`;
  }
  const order = (a, b) => { const i = ORDER.indexOf(letter(a)), j = ORDER.indexOf(letter(b)); return (i < 0 ? 99 : i) - (j < 0 ? 99 : j) || String(a.id).localeCompare(String(b.id)); };
  // 走势线的颜色按盘固定：用深一点的色，和分段条、规则条的浅色明显分开（免得 E 盘线被读成“回收站”）。
  const HUE = { C: '#2456b8', D: '#8a5a2b', E: '#e07800', G: '#08877f', H: '#7048c8', V: '#5d6676' };
  const hue = v => HUE[letter(v)] || '#7d8798';
  const days = n => n < 1 ? '不到 1 天' : n < 365 ? `${Math.round(n)} 天` : `${Math.round(n / 365)} 年`;
  // 多久满：页首、每块盘、口径栏同一个算法——按走势图那条线，看近 14 天空闲的实际变化（含自动清理腾出的）。
  // 起点＝14 天前（含半天余量）以来最早的一个读数，终点＝现在的读数；日均变化＝（终点空闲 − 起点空闲）/ 天数。
  // 空闲在减少、且照这个速度 60 天内会用完，才写“约 N 天满”；否则写“60 天内不会满”。不到 3 天的读数写“数据还不够预测”。
  const DAY = 86400000, WINDOW = 14, HORIZON = 60;
  function trail(v, d) {
    const pts = new Map((v.space_history?.points || [])
      .filter(p => Number.isFinite(p?.[0]))
      .map(([t, n]) => [t * 1000, Number.isFinite(n) && n >= 0 ? n : null]));
    for (const run of d?.cleanup?.runs || []) {
      const start = Date.parse(run.started_at), end = Date.parse(run.finished_at);
      const row = run.volumes?.find(x => letter(x) === letter(v));
      if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(row?.free_before) ||
          !Number.isFinite(row?.free_after) || row.free_before === row.free_after) continue;
      for (const t of pts.keys()) if (t > start && t < end) pts.delete(t);
      pts.set(start, row.free_before).set(end, row.free_after);
    }
    const now = Date.parse(v.state === 'offline' ? v.read_at : v.source_at || v.at || d?.at);
    if (Number.isFinite(v.free) && Number.isFinite(now)) pts.set(now, v.free);
    return [...pts].sort((a, b) => a[0] - b[0]);
  }
  function forecast(v, d) {
    if (v?.state === 'offline') return { text: '离线' };
    if (!(v?.total > 0) || !Number.isFinite(v.free)) return { text: '没读到' };
    const pts = trail(v, d).filter(p => p[1] != null);
    if (!pts.length) return { text: '没有走势记录' };
    const end = pts.at(-1), start = pts.find(p => p[0] >= end[0] - (WINDOW + 0.5) * DAY), span = (end[0] - start[0]) / DAY;
    if (span < 3) return { text: '数据还不够预测', start, end, span };
    const rate = (end[1] - start[1]) / span, left = rate < 0 ? end[1] / -rate : Infinity;
    const text = left <= HORIZON ? `${left < 1 ? '' : '约 '}${days(left)}满` : `${HORIZON} 天内不会满`;
    return { text, days: left, rate, start, end, span };
  }
  const outlook = (v, d) => forecast(v, d).text;
  const tone = (v, forecast) => v?.level === 'gray' || v?.state === 'offline' ? 'gray' : forecast.days <= 3 ? 'red' : forecast.days < 14 ? 'amber' : 'green';
  const lamp = (t, small = true) => `<span class="lamp${small ? ' lamp--sm' : ''}" data-tone="${t}" aria-hidden="true"></span>`;
  // 只在内容真变了才重写；重写后把展开着的保持展开。
  function put(el, html) {
    if (!el || el._storageHtml === html) return false;
    const open = new Set([...el.querySelectorAll('details[open][data-key]')].map(d => d.dataset.key));
    el.innerHTML = html; el._storageHtml = html;
    el.querySelectorAll('details[data-key]').forEach(d => { if (open.has(d.dataset.key)) d.open = true; });
    return true;
  }
  const bj = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', month: '2-digit', day: '2-digit' });
  const dayKey = t => bj.format(new Date(t)).replace(/\//g, '-');
  const dayId = t => new Date(t + 8 * 3600000).toISOString().slice(0, 10);
  window.StorageKit = { KiB, MiB, GiB, TiB, DAY, WINDOW, HORIZON, size, locked, raw, field, isPlaceholder, splitRows, hiddenRows, letter, volName, purpose, offlineRead, order, hue, days, trail, forecast, outlook, tone, lamp, put, dayKey, dayId };
})();
