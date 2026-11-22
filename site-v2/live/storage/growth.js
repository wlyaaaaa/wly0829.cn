(() => {
  const U = window.LiveUI, K = window.StorageKit, { size } = K;
  function growthDays(item, volume, d) {
    const daily = new Map(volume ? K.trail(volume, d).filter(p => p[1] != null).map(p => [K.dayId(p[0]), p]) : []);
    return (item.days || []).map(day => {
      if (day.growth != null) return day;
      const previousDate = K.dayId(Date.parse(day.date + 'T00:00:00+08:00') - K.DAY);
      const current = daily.get(day.date), previous = daily.get(previousDate);
      if (!current || !previous) return { ...day,
        gap: current ? '缺前一天的空闲读数' : '缺当天的空闲读数',
        missing: [!previous && previousDate, !current && day.date].filter(Boolean) };
      return { ...day, at: new Date(current[0]).toISOString(), growth: previous[1] - current[1], fromFree: true };
    });
  }
  function dailyGrowth(growth7, kind, d) {
    const { visible: items, hidden } = K.splitRows(growth7?.items, kind);
    if (!items.length && !hidden) return '';
    const withheld = K.hiddenRows(hidden, '磁盘增长记录', '磁盘名称、增长量和说明');
    const totals = items.map(x => {
      const volume = d?.volumes?.find(v => K.letter(v) === K.letter(x));
      const days = growthDays(x, volume, d);
      const note = x.note === '没有记录' ? '' : x.note;
      return { ...x, days, note, total: days.length === 7 && days.every(row => Number.isFinite(row.growth)) ? days.reduce((n, row) => n + row.growth, 0) : null };
    });
    totals.sort((a, b) => (b.total ?? -Infinity) - (a.total ?? -Infinity));
    const volumeName = x => U.esc(K.volName(x, kind));
    const signed = n => `${n > 0 ? '+' : ''}${U.esc(size(n))}`;
    const notes = new Map();
    for (const x of totals) {
      if (!x.note) continue;
      if (!notes.has(x.note)) notes.set(x.note, []);
      notes.get(x.note).push(x);
    }
    const shared = [...notes].filter(([, volumes]) => volumes.length > 1).map(([note, volumes]) =>
      `<p class="row__sub">${volumes.length === totals.length ? '' : `${volumes.map(volumeName).join('、')} · `}${U.esc(K.field(note, '增长说明', kind))}</p>`).join('');
    const summary = totals.filter(x => x.total != null).map(x => `<p class="row__sub"><b>${volumeName(x)}</b> · ${signed(x.total)}</p>`).join('') +
      (totals.some(x => x.total == null) ? '<p class="row__sub">七天记录未齐的盘只列每日净增。</p>' : '');
    const detail = totals.map(x => {
      const note = notes.get(x.note)?.length === 1 ? ` · ${U.esc(K.field(x.note, '增长说明', kind))}` : '';
      const days = (x.days || []).map(d => {
        const gap = d.missing?.length === 2 ? '两天都没有空闲读数' : d.gap;
        const value = d.growth == null ? `${gap}${d.missing ? `（${d.missing.join('、')}）` : ''}` : size(d.growth);
        return `<p class="row__sub">${U.esc(d.date)} · ${d.growth > 0 ? '+' : ''}${U.esc(value)}${d.at ? ` · 截至 ${U.esc(U.time(d.at))}` : ''}</p>`;
      }).join('');
      return `<section><p class="row__sub"><b>${volumeName(x)}</b>${note}</p>${days}</section>`;
    }).join('');
    return `${summary}${withheld ? `<p class="pj-note">${U.esc(withheld)}</p>` : ''}${totals.some(x => x.days.some(day => day.fromFree)) ? '<p class="row__sub">缺每日净增的日期，用当天和前一天最后读到的空闲量相减。</p>' : ''}${shared}<div class="st-growth-days">${detail}</div>`;
  }
  function render(categories, kind, growth7, categoryNote, readings) {
    const host = document.getElementById('category-growth');
    if (!host) return;
    const daily = dailyGrowth(growth7, kind, readings);
    const note = categoryNote ? `<p class="pj-note">${U.esc(K.field(categoryNote, '分类增长说明', kind))}</p>` : '';
    if (daily) {
      K.put(host, `<details class="st-detail" data-key="growth"><summary class="live-disclosure">近 7 天增长 · 查看各盘每日净增</summary>${daily}${note}</details>`);
      return;
    }
    const measured = (categories || []).filter(c => typeof c.growth === 'number' && Number.isFinite(c.growth));
    const group = (label, sign) => {
      const rows = measured.filter(c => c.growth * sign > 0).sort((a, b) => sign * (b.growth - a.growth)).slice(0, 3);
      return `<p class="row__sub">${label}</p><ul class="rows">${rows.map(c => `<li class="row row--flat"><p class="row__main"><a href="#cleanup-${encodeURIComponent(c.id)}">${U.esc(K.field(c.name || c.label, '分类名称', kind))}</a><span class="row__meta">${sign > 0 ? '+' : ''}${U.esc(size(c.growth))}</span></p></li>`).join('')}</ul>${rows.length ? '' : '<p class="pj-note">没有测到</p>'}`;
    };
    const missing = (categories || []).length - measured.length;
    K.put(host, measured.length || note ? `<details class="st-detail" data-key="growth"><summary class="live-disclosure">近 7 天增长</summary>${measured.length ? group('增加最多', 1) + group('减少最多', -1) : ''}${note || (missing ? `<p class="pj-note">另有 ${missing} 类还没测增长</p>` : '')}</details>` : '');
  }
  document.getElementById('category-growth').addEventListener('click', e => {
    const link = e.target.closest('a[href^="#cleanup-"]');
    if (!link) return;
    const row = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!row) return;
    const more = document.getElementById('categories-more');
    if (row.closest('#categories-rest') && more.getAttribute('aria-expanded') !== 'true') more.click();
    row.querySelector('details').open = true;
    e.preventDefault();
    row.scrollIntoView({ block: 'center' });
  });
  function supplementUsage(category, volumes, kind) {
    if (category.bytes != null) return category;
    const recovery = category.id === 'recovery_versions';
    const parts = volumes.filter(v => recovery ? ['G', 'H'].includes(K.letter(v)) : K.letter(v) !== 'V').flatMap(v =>
      K.splitRows(v.categories, kind).visible.filter(row => row.id === category.id && Number.isFinite(row.bytes))
        .map(row => ({ ...row, drive: K.letter(v) })));
    if (!parts.length) return category;
    const drives = [...new Set(parts.map(row => row.drive))];
    const complete = recovery && drives.length === 2 && parts.every(row => row.complete === true);
    return { ...category, bytes: parts.reduce((sum, row) => sum + row.bytes, 0), complete,
      usage_note: `按 ${drives.join('、')} 盘已量到的${recovery ? '恢复包' : '同类目录'}${complete ? '合计' : '统计，全盘合计还没读到'}` };
  }
  window.StorageGrowth = { render, dailyGrowth, growthDays, supplementUsage };
})();
