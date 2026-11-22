(() => {
  const U = window.LiveUI;
  const dateText = text => {
    const year = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Shanghai' }).format(new Date(window.Live.now?.() || Date.now()));
    return String(text ?? '').replace(/\b\d{4}-\d{2}-\d{2}\b/g, day => day.startsWith(year + '-') ? day.slice(5) : day)
      .replace(/从\s*((?:\d{4}-)?\d{2}-\d{2})\s*开始记/g, '从 $1 开始记');
  };
  function changes(d, viewer) {
    if (!Array.isArray(d?.items) || d.visibility === 'owner' && viewer !== 'owner') return '';
    if (!d.items.length) return d.gap ? `<b>近 7 天变化</b><p class="env-note">${U.fieldHtml(typeof d.gap === 'string' ? dateText(d.gap) : d.gap, { name: '软件变化记录', kind: viewer })}</p>` : '';
    const rows = d.items.filter(r => r.visibility !== 'owner' || viewer === 'owner').map(r => {
      const kind = ({ installed: '新装', updated: '升级／版本变化', uninstalled: '卸载' })[r.kind] || r.kind;
      const versions = [...new Set([r.previous_version, r.version].filter(Boolean))];
      const suffix = typeof r.name === 'string' && versions.map(v => ` ${v}`).find(v => r.name.endsWith(v));
      const name = suffix ? r.name.slice(0, -suffix.length) : r.name;
      const versionText = versions.map(U.esc).join(' → ');
      return `<p class="row__sub">${U.esc(dateText(r.date))} · ${U.esc(kind)} ${U.fieldHtml(name, { name: '软件', kind: viewer })}${versionText ? ` ${versionText}` : ''}${r.drive ? ` · ${U.esc(r.drive)} 盘` : ''}</p>`;
    });
    return `<b>近 7 天变化</b>${rows.join('')}<p class="env-note">${U.esc(dateText([d.text, d.q === 'stale' && '旧读数', d.missing_dates?.length && `缺少 ${d.missing_dates.join('、')} 的观察`, d.gap].filter(Boolean).join(' · ')))}</p>`;
  }
  const host = document.createElement('section'); host.className = 'card grp grp--quiet'; host.hidden = true; document.getElementById('board').before(host);
  const shell = html => `<div class="card__glass glass"><div class="card__body"><div class="grp__chapter">${html}</div></div></div>`;
  let read;
  function unavailable(state) {
    if (Array.isArray(state.data?.items) || !(['none', 'gone'].includes(state.phase) || state.meta?.status >= 400)) return;
    if (!read) {
      U.html(host, shell(''));
      read = U.reading(host.querySelector('.grp__chapter'), { name: '近 7 天变化', ghost: '' });
    }
    host.hidden = false;
    read.set({ ...state, phase: 'none' });
  }
  window.Live.watch('projects/pcconfig/records', { section: 'software_changes' }, {
    data(d, meta) {
      read?.done(false); read = null;
      const html = changes(d, meta.viewer?.kind); host.hidden = !html; U.html(host, html ? shell(html) : '');
    }, link: unavailable,
  });
  window.EnvironmentDraw10 = { changes };
})();
