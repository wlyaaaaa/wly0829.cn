// 实况里面三页（智能体、自动任务、AI 账本）共用的“行情屏”零件：快讯条、跳数、细线图、页面开头那几步。
// 只给 body.page--tape 的三页用；读数照旧走 Live.watch，文字照旧过 LiveUI.fieldHtml（访客版的“仅本人可见”由它写）。
(() => {
  'use strict';
  const U = window.LiveUI, Live = window.Live, { esc } = U;
  const params = new URLSearchParams(location.search);
  const HOSTS = [
    { id: 'claude', name: 'Claude', color: '#e8913f' },
    { id: 'codex', name: 'Codex', color: '#16a6c4' },
    { id: 'antigravity', name: 'Antigravity', color: '#7a63e8' },
  ];
  const TONE = { ok: '#00a650', repair: '#d48806', owner: '#d48806', bad: '#d93b3b', off: '#9a988f' };
  const list = v => Array.isArray(v) ? v : [];
  const known = v => typeof v === 'number' && Number.isFinite(v);
  const stamp = at => { const t = Date.parse(at); return Number.isFinite(t) ? t : null; };
  const bj = at => { const t = stamp(at); return t == null ? null : new Date(t + 8 * 3600000); };
  const two = n => String(n).padStart(2, '0');
  const clock = at => { const d = bj(at); return d ? `${two(d.getUTCHours())}:${two(d.getUTCMinutes())}` : ''; };
  const day = at => { const d = bj(at); return d ? `${two(d.getUTCMonth() + 1)}-${two(d.getUTCDate())}` : ''; };
  const dayKey = at => { const d = bj(at); return d ? d.toISOString().slice(0, 10) : ''; };
  const today = () => dayKey(new Date().toISOString());
  // “11-23 08:02”；今天的只写钟点
  const when = at => !stamp(at) ? '' : dayKey(at) === today() ? clock(at) : `${day(at)} ${clock(at)}`;
  const int = n => known(n) ? Math.round(n).toLocaleString('zh-CN') : '';
  const dec = (n, d = 1) => known(n) ? (Math.round(n * 10 ** d) / 10 ** d).toLocaleString('zh-CN', { maximumFractionDigits: d }) : '';
  const pct = x => known(x) ? `${Math.round(x * 100)}%` : '';
  const hours = minutes => known(minutes) ? (minutes >= 600 ? int(minutes / 60) : dec(minutes / 60)) : '';
  const duration = seconds => {
    if (!known(seconds)) return '';
    if (seconds < 60) return `${Math.max(1, Math.round(seconds))} 秒`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} 分钟`;
    const h = Math.floor(seconds / 3600), m = Math.round(seconds % 3600 / 60);
    return m ? `${h} 小时 ${m} 分` : `${h} 小时`;
  };
  const ms = n => !known(n) ? '' : n < 1000 ? `${Math.round(n)} ms` : n < 60000 ? `${dec(n / 1000)} s` : `${dec(n / 60000)} 分`;
  const path = (href, query = {}) => {
    if (typeof href !== 'string' || !href.startsWith('/') || href.startsWith('//')) return '';
    const url = new URL(href, location.origin);
    for (const [key, val] of Object.entries(query)) if (val != null && val !== '') url.searchParams.set(key, val);
    if (params.has('fixture') && url.pathname.startsWith('/live/')) url.searchParams.set('fixture', params.get('fixture'));
    return url.pathname + url.search + url.hash;
  };
  const link = (href, label, cls = 'tp-link') => path(href) ? `<a class="${cls}" href="${esc(path(href))}">${label}</a>` : label;
  const fog = (text = '没读到') => `<span class="tp-fog">${esc(text)}</span>`;
  // 后台给的字一律过这里：访客版藏起来的写清“〈哪一样〉仅本人可见”
  const field = (value, viewer, name = '') => value == null || value === '' ? '' : U.fieldHtml(value, { name, kind: viewer });
  const plain = (value, viewer) => U.fieldText(value, viewer);
  const you = viewer => viewer === 'owner' ? '你' : '本人';
  const hostOf = id => HOSTS.find(h => h.id === String(id || '').toLowerCase() || h.name === id);

  // —— 大数跳：进页从 0 跳到当前值，之后读数变了从旧值跳到新值 ——
  // <span data-num="68" data-key="acc-claude" data-fmt="int|dec|pct100">68</span>
  const seen = new Map();
  function count(root) {
    for (const el of root.querySelectorAll('[data-num]')) {
      const target = Number(el.dataset.num), key = el.dataset.key || '', from = seen.has(key) ? seen.get(key) : 0;
      if (!Number.isFinite(target)) continue;
      seen.set(key, target);
      if (from === target) continue;
      const fmt = el.dataset.fmt || 'int', digits = fmt === 'dec' ? 1 : 0;
      const show = v => fmt === 'dec' ? dec(v, digits) : int(v);
      const start = performance.now(), span = 900;
      const step = now => {
        const t = Math.min(1, (now - start) / span), e = 1 - (1 - t) ** 3;
        el.textContent = show(from + (target - from) * e);
        if (t < 1) requestAnimationFrame(step);
      };
      el.textContent = show(from);
      requestAnimationFrame(step);
      if (seen.size && key && from !== 0) el.closest('.tp-flashable')?.classList.add('tp-flash');
    }
  }
  const big = (value, key, fmt = 'int') => known(value)
    ? `<span data-num="${fmt === 'dec' ? Math.round(value * 10) / 10 : Math.round(value)}" data-key="${esc(key)}" data-fmt="${fmt}">${fmt === 'dec' ? dec(value) : int(value)}</span>` : '';

  // —— 快讯条：一直从右往左滚；新来的一条从最前面推进来，10 分钟内的标“新” ——
  function ticker(host) {
    host.innerHTML = '<div class="tp-ticker" data-state="on" role="region" aria-label="实时快讯"><span class="tp-ticker__label"><span class="tp-ticker__dot" aria-hidden="true"></span>实时</span>' +
      '<div class="tp-ticker__window"><div class="tp-ticker__track"></div></div></div>';
    const bar = host.firstChild, track = bar.querySelector('.tp-ticker__track');
    let last = '', known = new Set();
    function item(row, fresh) {
      const t = stamp(row.at), isNew = t && Date.now() - t < 10 * 60000;
      const body = `${row.at ? `<b>${esc(when(row.at))}</b>` : ''}${row.actor ? `<strong>${esc(row.actor)}</strong>` : ''}${row.html || esc(row.text || '')}${isNew ? '<i>新</i>' : ''}`;
      const cls = `tp-ticker__item${fresh ? ' is-new' : ''}`, tone = row.tone ? ` data-tone="${esc(row.tone)}"` : '';
      return path(row.href) ? `<a class="${cls}"${tone} href="${esc(path(row.href))}">${body}</a>` : `<span class="${cls}"${tone}>${body}</span>`;
    }
    return {
      set(rows, { off = false } = {}) {
        rows = list(rows).filter(r => r && (r.text || r.html));
        bar.dataset.state = off ? 'off' : 'on';
        const sign = JSON.stringify(rows.map(r => [r.at, r.actor, r.text, r.html, r.tone]));
        if (sign === last) return;
        last = sign;
        const keys = rows.map(r => `${r.at}|${r.actor}|${r.text || r.html}`);
        const first = known.size === 0;
        const html = rows.map((r, i) => item(r, !first && !known.has(keys[i]))).join('');
        known = new Set(keys);
        // 两遍拼起来，滚到一半无缝接回开头；内容不够一屏时多拼几遍
        track.innerHTML = html || '<span class="tp-ticker__item">这会儿没有新消息</span>';
        const one = track.scrollWidth, need = Math.max(2, Math.ceil((bar.clientWidth * 2) / Math.max(1, one)));
        const unit = track.innerHTML;
        track.innerHTML = unit.repeat(need % 2 ? need + 1 : need);
        const width = track.scrollWidth / 2;
        track.style.setProperty('--tp-dur', `${Math.max(20, width / 70)}s`);
        track.style.animation = 'none'; void track.offsetWidth; track.style.animation = '';
      },
    };
  }

  // —— 图 ——
  function ring(done, total, { size = 92, color = TONE.ok, label } = {}) {
    const r = size / 2 - 7, c = 2 * Math.PI * r, share = known(done) && total > 0 ? Math.max(0, Math.min(1, done / total)) : 0;
    const text = label ?? (known(done) && total ? `${done}/${total}` : '··');
    return `<svg class="tp-ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(text)}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="rgb(20 20 19 / .08)" stroke-width="8"/>
      <circle class="tp-ring__arc" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round"
        stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - share)}" transform="rotate(-90 ${size / 2} ${size / 2})"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central">${esc(text)}</text></svg>`;
  }
  // 折线：series [{color, name, values:[number|null]}]，labels 是横轴每一格的字
  function line({ series, labels, width = 520, height = 210, max = 1, fmt = pct, draw = true, unit = '' }) {
    const pad = { l: 40, r: 46, t: 12, b: 26 }, w = width - pad.l - pad.r, h = height - pad.t - pad.b, n = labels.length;
    const x = i => pad.l + (n <= 1 ? w / 2 : i * w / (n - 1)), y = v => pad.t + h - Math.max(0, Math.min(1, v / max)) * h;
    const ticks = [0, .25, .5, .75, 1].map(f => f * max);
    let out = ticks.map(v => `<line class="tp-gridline" x1="${pad.l}" x2="${pad.l + w}" y1="${y(v)}" y2="${y(v)}"/><text x="${pad.l - 6}" y="${y(v) + 4}" text-anchor="end">${esc(fmt(v))}</text>`).join('');
    out += labels.map((label, i) => `<text x="${x(i)}" y="${height - 6}" text-anchor="middle">${esc(label)}</text>`).join('');
    const ends = [];
    for (const s of series) {
      const pts = s.values.map((v, i) => known(v) ? [x(i), y(v), v] : null);
      const segs = []; let cur = [];
      for (const p of pts) { if (p) cur.push(p); else if (cur.length) { segs.push(cur); cur = []; } }
      if (cur.length) segs.push(cur);
      for (const seg of segs) {
        if (seg.length > 1) out += `<path class="tp-series${draw ? ' tp-draw' : ''}" pathLength="1" stroke="${s.color}" d="M${seg.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L')}"/>`;
        out += seg.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="#fff" stroke="${s.color}" stroke-width="2"/>`).join('');
      }
      const lastPoint = [...pts].reverse().find(Boolean);
      if (lastPoint) {
        out += `<circle class="tp-pulse" cx="${lastPoint[0]}" cy="${lastPoint[1]}" r="4" fill="${s.color}"/><circle cx="${lastPoint[0]}" cy="${lastPoint[1]}" r="4" fill="${s.color}"/>`;
        ends.push({ y: lastPoint[1], v: lastPoint[2], color: s.color });
      }
    }
    // 线末端的数，挤在一起时上下错开
    ends.sort((a, b) => a.y - b.y);
    for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 15) ends[i].y = ends[i - 1].y + 15;
    out += ends.map(e => `<rect x="${pad.l + w + 7}" y="${e.y - 8}" width="38" height="16" rx="4" fill="${e.color}"/><text x="${pad.l + w + 26}" y="${e.y + 4}" text-anchor="middle" style="fill:#fff;font-weight:700">${esc(fmt(e.v))}${unit}</text>`).join('');
    return `<svg class="tp-chart" viewBox="0 0 ${width} ${height}" role="img">${out}</svg>`;
  }
  // 竖着的堆叠柱：rows [{label, parts:[{value,color}], total, text}]
  function columns({ rows, width = 520, height = 220, fmt = v => int(v), grow = true, highlight = -1 }) {
    const pad = { l: 36, r: 8, t: 22, b: 26 }, w = width - pad.l - pad.r, h = height - pad.t - pad.b, n = Math.max(1, rows.length);
    const max = Math.max(1e-9, ...rows.map(r => r.total || r.parts.reduce((s, p) => s + (p.value || 0), 0)));
    const nice = niceMax(max), bw = Math.min(46, w / n * .56);
    let out = [0, .5, 1].map(f => { const v = nice * f, yy = pad.t + h - f * h; return `<line class="tp-gridline" x1="${pad.l}" x2="${pad.l + w}" y1="${yy}" y2="${yy}"/><text x="${pad.l - 6}" y="${yy + 4}" text-anchor="end">${esc(fmt(v))}</text>`; }).join('');
    rows.forEach((r, i) => {
      const cx = pad.l + (i + .5) * w / n; let top = pad.t + h;
      const total = r.total ?? r.parts.reduce((s, p) => s + (p.value || 0), 0);
      out += `<g class="${grow ? 'tp-grow' : ''}" style="animation-delay:${i * 60}ms">`;
      for (const p of r.parts) {
        const ph = (p.value || 0) / nice * h; if (ph <= 0) continue;
        top -= ph; out += `<rect x="${cx - bw / 2}" y="${top}" width="${bw}" height="${ph}" fill="${p.color}"/>`;
      }
      out += '</g>';
      if (i === highlight) out += `<rect x="${cx - bw / 2 - 4}" y="${top - 4}" width="${bw + 8}" height="${pad.t + h - top + 4}" fill="none" stroke="#00a650" stroke-width="1.5" rx="4"/>`;
      if (total > 0 || r.text) out += `<text class="tp-val" x="${cx}" y="${top - 6}" text-anchor="middle">${esc(r.text ?? fmt(total))}</text>`;
      out += `<text x="${cx}" y="${height - 6}" text-anchor="middle">${esc(r.label)}</text>`;
    });
    out += `<line class="tp-axis" x1="${pad.l}" x2="${pad.l + w}" y1="${pad.t + h}" y2="${pad.t + h}"/>`;
    return `<svg class="tp-chart" viewBox="0 0 ${width} ${height}" role="img">${out}</svg>`;
  }
  function niceMax(v) {
    if (!(v > 0)) return 1;
    const p = 10 ** Math.floor(Math.log10(v)), f = v / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  }
  // 30 天正负小柱：成朝上（绿），坏朝下（红），没记录的天画一道灰底线
  function posneg(days, { width = 150, height = 34 } = {}) {
    const n = Math.max(1, days.length), bw = width / n, mid = height * .62;
    const max = Math.max(1, ...days.map(d => d.success || 0)), maxBad = Math.max(1, ...days.map(d => d.failed || 0));
    let out = `<line x1="0" x2="${width}" y1="${mid}" y2="${mid}" stroke="rgb(20 20 19 / .12)"/>`;
    days.forEach((d, i) => {
      const x = i * bw + bw * .18, w = Math.max(1.5, bw * .64);
      if (d.success == null && d.failed == null) { out += `<rect x="${x}" y="${mid - 1}" width="${w}" height="2" fill="rgb(20 20 19 / .12)"/>`; return; }
      if (d.success > 0) { const hh = Math.max(3, d.success / max * (mid - 2)); out += `<rect class="tp-grow" style="animation-delay:${i * 18}ms" x="${x}" y="${mid - hh}" width="${w}" height="${hh}" fill="#00a650" rx="1"/>`; }
      if (d.failed > 0) { const hh = Math.max(4, d.failed / maxBad * (height - mid - 1)); out += `<rect x="${x}" y="${mid + 1}" width="${w}" height="${hh}" fill="#d93b3b" rx="1"/>`; }
    });
    return `<svg class="tp-chart" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">${out}</svg>`;
  }

  // —— 页面开头：页眉、回实况、快讯条、读数 ——
  function boot({ resource, query = {}, ask, back = '/live/', onState }) {
    const root = document.getElementById('tp-root'), backLink = document.querySelector('[data-back]');
    if (backLink) { backLink.href = path(back); backLink.addEventListener('click', U.restoreBack); }
    const bar = U.topbar({ ask });
    const tick = ticker(document.getElementById('tp-ticker'));
    // 等调用方拿到返回值再开始读，免得缓存里的旧数同步回调时页面变量还没赋值
    queueMicrotask(() => Live.watch(resource, query, { phase(next) { bar?.set(next); window.LiveView?.owner?.(next.viewer); onState(next); } }));
    requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
    return { root, tick };
  }
  const viewerOf = state => state?.meta?.viewer?.kind === 'owner' || state?.viewer?.kind === 'owner' ? 'owner' : 'public';
  const stateNote = (state, label) => state?.offline ? `<p class="tp-note" data-tone="off">${esc(state.text || '电脑连不上')}。</p>`
    : state?.publicPaused ? `<p class="tp-note" data-tone="off">${esc(state.text)}</p>` : '';
  const placeholder = (state, label) => `<p class="tp-placeholder" role="status">${esc(state?.offline ? `电脑连不上，${label}没存下来。`
    : ['none', 'gone', 'error'].includes(state?.phase) || state?.meta?.status >= 400 ? `${label}暂时没读到。` : `正在读${label}…`)}</p>`;
  // 保留展开、收起状态后整块重画
  function paint(root, html) {
    const open = new Map([...root.querySelectorAll('details[id]')].map(el => [el.id, el.open]));
    root.innerHTML = html;
    for (const el of root.querySelectorAll('details[id]')) if (open.has(el.id)) el.open = open.get(el.id);
    count(root);
    // 进页那一次柱子长出来、线描出来；之后每轮读数重画不再重播
    if (!root.dataset.painted) { root.dataset.painted = '1'; setTimeout(() => root.classList.add('tp-still'), 1600); }
  }
  // 点了某个按钮整块重画时，让这个按钮停在原来的位置
  function keep(root, selector, update) {
    const top = root.querySelector(selector)?.getBoundingClientRect().top;
    update();
    const again = root.querySelector(selector);
    if (again && top != null) window.scrollBy(0, again.getBoundingClientRect().top - top);
    again?.focus({ preventScroll: true });
  }
  const reveal = id => {
    const target = id && document.getElementById(id);
    if (!target) return false;
    if (target.matches('details')) target.open = true;
    requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    return true;
  };

  window.LiveTape = { HOSTS, TONE, list, known, stamp, clock, day, dayKey, when, int, dec, pct, hours, duration, ms, path, link, fog, field, plain, you,
    hostOf, count, big, ticker, ring, line, columns, posneg, niceMax, boot, viewerOf, stateNote, placeholder, paint, keep, reveal, esc };
})();
