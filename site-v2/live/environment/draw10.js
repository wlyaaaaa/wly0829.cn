(() => {
  const U = window.LiveUI;
  // 软件变化先摆最近 10 条，底下“再看 N 条（还有 M 条） ›”每点一次多摆 20 条（本人 11-25：默认显示一部分，可以慢慢展开）。
  // 标题的天数照回包给的时段写：后台给 window_days 就照它，没给就是现在的 7 天。
  const FIRST = 10, STEP = 20;
  let shown = FIRST, days = 7, last = null;
  const span = d => Number.isInteger(d?.window_days) && d.window_days > 0 ? d.window_days : 7;
  const dateText = text => {
    const year = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Shanghai' }).format(new Date(window.Live.now?.() || Date.now()));
    return String(text ?? '').replace(/\b\d{4}-\d{2}-\d{2}\b/g, day => day.startsWith(year + '-') ? day.slice(5) : day)
      .replace(/从\s*((?:\d{4}-)?\d{2}-\d{2})\s*开始记/g, '从 $1 开始记');
  };
  function changes(d, viewer, limit = Infinity) {
    if (!Array.isArray(d?.items) || d.visibility === 'owner' && viewer !== 'owner') return '';
    const title = `<b>近 ${span(d)} 天变化</b>`;
    if (!d.items.length) return d.gap ? `${title}<p class="env-note">${U.fieldHtml(typeof d.gap === 'string' ? dateText(d.gap) : d.gap, { name: '软件变化记录', kind: viewer })}</p>` : '';
    const rows = d.items.filter(r => r.visibility !== 'owner' || viewer === 'owner').map(r => {
      const kind = ({ installed: '新装', updated: '升级／版本变化', uninstalled: '卸载' })[r.kind] || r.kind;
      const versions = [...new Set([r.previous_version, r.version].filter(Boolean))];
      const suffix = typeof r.name === 'string' && versions.map(v => ` ${v}`).find(v => r.name.endsWith(v));
      const name = suffix ? r.name.slice(0, -suffix.length) : r.name;
      const versionText = versions.map(U.esc).join(' → ');
      return `<p class="row__sub">${U.esc(dateText(r.date))} · ${U.esc(kind)} ${U.fieldHtml(name, { name: '软件', kind: viewer })}${versionText ? ` ${versionText}` : ''}${r.drive ? ` · ${U.esc(r.drive)} 盘` : ''}</p>`;
    });
    const left = rows.length - limit;
    const more = left > 0 ? `<button type="button" class="more" data-change-more>再看 ${Math.min(STEP, left)} 条（还有 ${left} 条） ›</button>` : '';
    return `${title}${rows.slice(0, limit).join('')}${more}<p class="env-note">${U.esc(dateText([d.text, d.q === 'stale' && '旧读数', d.missing_dates?.length && `缺少 ${d.missing_dates.join('、')} 的观察`, d.gap].filter(Boolean).join(' · ')))}</p>`;
  }
  const host = document.createElement('section'); host.className = 'card grp grp--quiet'; host.hidden = true; document.getElementById('board').before(host);
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
  host.addEventListener('click', e => {
    if (!e.target.closest('[data-change-more]')) return;
    shown += STEP; draw();
  });
  window.Live.watch('projects/pcconfig/records', { section: 'software_changes' }, {
    data(d, meta) {
      read?.done(false); read = null;
      last = { d, viewer: meta.viewer?.kind }; if (Array.isArray(d?.items)) days = span(d); draw();
    }, link: unavailable,
  });
  window.EnvironmentDraw10 = { changes };
})();
