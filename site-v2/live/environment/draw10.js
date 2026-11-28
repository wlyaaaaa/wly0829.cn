(() => {
  const U = window.LiveUI, DAY = 86400000;
  // 软件变化先摆最近 10 条，底下“再看 N 条（还有 M 条） ›”每点一次多摆 20 条；手里这一页露完、后台还有下一页（next）就接着取（本人 11-25：默认显示一部分，可以慢慢展开，M932）。
  // 标题天数照回包的 window 写（现在给 7 天就写 7 天，后台改成近 90 天就跟着变）；记录起点晚于窗口起点一天以上才写“从几号起才有”，写法同手机页（M911）。
  const FIRST = 10, STEP = 20, RESOURCE = 'projects/pcconfig/records', QUERY = { section: 'software_changes' };
  let shown = FIRST, days = 7, last = null, paging = false, pageFailed = false;
  const span = d => { const a = Date.parse(d?.window?.from), b = Date.parse(d?.window?.to); return Number.isFinite(a) && Number.isFinite(b) && b > a ? Math.floor((b - a) / DAY) + 1 : 7; };
  const dayKey = at => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date(at));
  const dateText = text => {
    const year = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Shanghai' }).format(new Date(window.Live.now?.() || Date.now()));
    return String(text ?? '').replace(/\b\d{4}-\d{2}-\d{2}\b/g, day => day.startsWith(year + '-') ? day.slice(5) : day)
      .replace(/从\s*((?:\d{4}-)?\d{2}-\d{2})\s*开始记/g, '从 $1 开始记');
  };
  // 连着缺的日子并成“A 到 B”
  const ranges = list => [...new Set(list)].sort().reduce((out, day) => {
    const tail = out.at(-1);
    if (tail && Date.parse(day) - Date.parse(tail[1]) === DAY) tail[1] = day; else out.push([day, day]);
    return out;
  }, []).map(([a, b]) => a === b ? a : `${a} 到 ${b}`);
  // 记录从哪天起才有；窗口里起点之后零星缺的日子另写一句（起点之前那一大段由第一句说清，不逐日列）
  function coverage(d) {
    const start = Date.parse(d?.window?.from), first = Date.parse(d?.coverage?.from);
    const late = Number.isFinite(start) && Number.isFinite(first) && first - start >= DAY;
    const firstDay = late ? dayKey(first) : '';
    const inner = (Array.isArray(d?.missing_dates) ? d.missing_dates : []).filter(x => typeof x === 'string' && (!late || x > firstDay));
    return { late, note: late ? `软件变化记录从 ${U.date(d.coverage.from)} 起才有，近 ${span(d)} 天里 ${U.date(d.window.from)} 到 ${U.date(d.coverage.from)} 没有记录` : '',
      inner: inner.length ? `${ranges(inner).join('、')} 没有记录` : '' };
  }
  const visible = (d, viewer) => d.items.filter(r => r.visibility !== 'owner' || viewer === 'owner');
  function changes(d, viewer, limit = Infinity) {
    if (!Array.isArray(d?.items) || d.visibility === 'owner' && viewer !== 'owner') return '';
    const title = `<b>近 ${span(d)} 天变化</b>`;
    if (!d.items.length) return d.gap ? `${title}<p class="env-note">${U.fieldHtml(typeof d.gap === 'string' ? dateText(d.gap) : d.gap, { name: '软件变化记录', kind: viewer })}</p>` : '';
    const rows = visible(d, viewer).map(r => {
      const versions = [...new Set([r.previous_version, r.version].filter(Boolean))];
      const kind = r.kind === 'updated' && versions.length === 2 ? '' : ({ installed: '新装', updated: '升级／版本变化', uninstalled: '卸载' })[r.kind] || r.kind;
      const suffix = typeof r.name === 'string' && versions.map(v => ` ${v}`).find(v => r.name.endsWith(v));
      const name = suffix ? r.name.slice(0, -suffix.length) : r.name;
      const versionText = versions.map(U.esc).join(' → ');
      return `<p class="row__sub">${U.esc(dateText(r.date))} · ${kind ? `${U.esc(kind)} ` : ''}${U.fieldHtml(name, { name: '软件', kind: viewer })}${versionText ? ` ${versionText}` : ''}${r.drive ? ` · ${U.esc(r.drive)} 盘` : ''}</p>`;
    });
    const head = rows.slice(0, limit);
    // 还没取的下一页：有总数就算进“还有几条”，没有总数也照样给“继续看”
    const unloaded = d.next ? Number.isFinite(d.total) ? Math.max(0, d.total - d.items.length) : null : 0;
    const left = rows.length - head.length + (unloaded || 0), fetch = head.length >= rows.length && unloaded !== 0;
    const label = paging ? '正在读…' : pageFailed ? '下一页暂时读不到，再试一次 ›' : left > 0 ? `再看 ${Math.min(STEP, left)} 条（还有 ${left} 条） ›` : '继续看 ›';
    const more = left > 0 || fetch ? `<button type="button" class="more" data-change-more${fetch ? ' data-needs-pc' : ''}${paging ? ' disabled' : ''}>${label}</button>` : '';
    const cover = coverage(d);
    // 起点之前没记录造成的“快照缺口”已由上一句说清；起点之后真缺了日子才照后台原话说
    const gap = d.gap && !(d.q === 'partial' && cover.late && !cover.inner) ? d.gap : '';
    return `${title}${head.join('')}${more}<p class="env-note">${U.esc(dateText([cover.late ? cover.note : d.text, d.q === 'stale' && '旧读数', cover.inner, gap].filter(Boolean).join(' · ')))}</p>`;
  }
  const host = document.createElement('section'); host.className = 'card grp grp--quiet'; host.hidden = true; document.getElementById('board').after(host);
  const shell = html => `<div class="card__glass glass"><div class="card__body"><div class="grp__chapter">${html}</div></div></div>`;
  let read;
  function unavailable(state) {
    if (Array.isArray(state.data?.items) || !(['none', 'gone'].includes(state.phase) || state.meta?.status >= 400)) return;
    if (!read) {
      U.html(host, shell(''));
      read = U.reading(host.querySelector('.grp__chapter'), { name: `近 ${days} 天变化`, ghost: '' });
    }
    host.hidden = false;
    read.set({ ...state, phase: 'none' });
  }
  function draw() {
    const html = last ? changes(last.d, last.viewer, shown) : ''; host.hidden = !html; U.html(host, html ? shell(html) : '');
  }
  // 要摆的条数超过手里已有的、后台还有下一页：照 next 游标接着取，接在后面（刷新回来第一页时也照这样补回已展开的）
  async function fill() {
    while (last && !paging) {
      const d = last.d;
      if (!Array.isArray(d?.items) || !d.next || shown <= visible(d, last.viewer).length || U.offline?.()) return;
      paging = true; pageFailed = false; draw();
      let s = null;
      try { s = await window.Live.get(RESOURCE, { ...QUERY, cursor: d.next }); } catch { s = null; }
      paging = false;
      if (last?.d !== d) continue;
      if (!Array.isArray(s?.data?.items)) { pageFailed = true; draw(); return; }
      last.d = { ...d, ...s.data, items: [...d.items, ...s.data.items], next: s.data.items.length && s.data.next !== d.next ? s.data.next : null };
      draw();
    }
  }
  host.addEventListener('click', e => {
    const btn = e.target.closest('[data-change-more]');
    if (!btn || btn.disabled || paging) return;
    if (!pageFailed) shown += STEP;
    pageFailed = false; draw(); fill();
    host.querySelector('[data-change-more]')?.focus({ preventScroll: true });
  });
  window.Live.watch(RESOURCE, QUERY, {
    data(d, meta) {
      read?.done(false); read = null;
      last = { d, viewer: meta.viewer?.kind }; pageFailed = false; if (Array.isArray(d?.items)) days = span(d); draw(); fill();
    }, link: unavailable,
  });
  window.EnvironmentDraw10 = { changes };
})();
