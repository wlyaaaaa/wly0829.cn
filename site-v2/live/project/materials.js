(() => {
  'use strict';
  const ID = 'personal-materials', U = window.LiveUI, { esc } = U;
  const SECTIONS = new Set(['shelf', 'refresh', 'text', 'locators', 'more-data']);
  const BACKUPS = '/live/backups/', TASK = '/live/task/?id=task-98e3035efabf9eb294064378';
  const cadence = '每天 17:10 随每日备份刷新';
  const missing = '<p class="pj-note">暂时读不到</p>', arrow = '<span class="more__chev">›</span>';
  const paths = {
    shelf: '<path d="m2 8 10-5 10 5-10 5Z M2 12l10 5 10-5 M2 16l10 5 10-5"/>',
    search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
    disk: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 4 18 4 18 0V5 M3 12c0 4 18 4 18 0"/>',
    clip: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2Z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18 M7 3v4 M17 3v4"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-8Z"/>',
  };
  const icon = name => `<svg class="mat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
  const n = value => Number.isFinite(value) ? value.toLocaleString('zh-CN') : '—';
  const count = (value, unit = '') => `<span class="mat-count">${n(value)}${unit ? ` ${unit}` : ''}</span>`;
  const valueOf = (data, id) => data.readings[id]?.value;
  const noteOf = (data, ...ids) => ids.map(id => U.fieldHtml(data.notes[id], { kind: viewer })).filter(Boolean).join('<br>');
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' });
  function instant(at) {
    const text = String(at || '');
    return Date.parse(text.includes('T') && !/(?:Z|[+-]\d\d:\d\d)$/.test(text) ? `${text}+08:00` : text);
  }
  const dayOf = at => Number.isFinite(instant(at)) ? date.format(new Date(instant(at))) : '';
  function stamp(at, dayOnly = false) {
    if (!Number.isFinite(instant(at))) return '';
    const t = instant(at), [year, month, day] = date.format(new Date(t)).split('-');
    const when = dayOnly || /^\d{4}-\d\d-\d\d$/.test(at) ? '' : ` ${U.time(t)}`;
    return `${year === date.format(new Date()).slice(0, 4) ? '' : year + '年'}${Number(month)}月${Number(day)}日${when}`;
  }
  function cutoff(at, stale, tail = '') {
    return at && stamp(at) ? `<span class="pj-cut${stale ? ' mat-old' : ''}">截止 ${stamp(at)}${stale ? ' · 旧了' : ''}${tail}</span>` : '';
  }
  function daily(metric, tail) {
    // Beijing 17:10 is 09:10 UTC, the start of the next daily refresh cycle.
    const cycle = t => Math.floor((t - (9 * 60 + 10) * 60000) / 86400000);
    return cutoff(metric?.at, U.isStale(metric) || cycle(instant(metric?.at)) < cycle(Date.now()), tail);
  }
  function card(id, title, kind, content, note, cut, opts = {}) {
    return `<section class="pj-card glass mat-card mat-${id}" id="${id}"><h2 class="mat-title">${icon(kind)}${title}${opts.subtitle ? `<small>${opts.subtitle}</small>` : ''}</h2>
      <div class="mat-body">${content}</div>
      <div class="pj-tail"><details class="pj-notes" ${note ? '' : 'hidden'}><summary class="live-disclosure"><span class="disclosure-closed">说明</span><span class="disclosure-open">收起说明</span><span class="disclosure-chev">›</span></summary><p class="pj-note">${note}</p></details>${opts.link || ''}${cut}</div></section>`;
  }
  const go = (href, label) => `<a class="mat-go" href="${esc(href)}">${label} ${arrow}</a>`;
  const large = (prefix, num, unit) => `<p class="mat-big">${prefix ? `<small>${prefix}</small>` : ''}<b>${num}</b>${unit ? `<small>${unit}</small>` : ''}</p>`;

  // The strip still reads the representative metric through the common project page.
  function adapt(raw) {
    const sections = raw.sections || [], shown = sections.filter(s => SECTIONS.has(s.id));
    const readings = Object.fromEntries(shown.flatMap(s => (s.metrics || []).map(m => [m.id, m])));
    const notes = Object.fromEntries(shown.map(s => [s.id, s.note]));
    const remaining = sections.filter(s => !SECTIONS.has(s.id));
    if (Number.isFinite(readings.registered?.value)) remaining.unshift({ id: 'shelf', metrics: [readings.registered] });
    return { ...raw, sections: remaining, materials: { readings, notes } };
  }
  function shelves(data) {
    const v = id => valueOf(data, id), refresh = v('refresh_partial'), coverage = v('text_coverage'), complete = v('text_complete');
    const bytes = id => esc(v(id)?.text ?? (Number.isFinite(v(id)?.bytes) ? U.trafficBytes(v(id).bytes) : '—'));
    const levels = [
      ['more-data', v('sources'), '处', '收录的来源', `${count(refresh?.total, '处')}建了文件名清单（${count(v('nonempty_directories'), '处')}有条目） · ${count(v('source_partial'), '处')}只声明部分覆盖`],
      ['', v('filenames'), '个', '能按文件名找到', `清单原始 ${count(v('filename_rows'), '条')}（含重叠路径） · 清单记载体积 <span class="mat-count">${bytes('filename_bytes')}</span>`],
      ['', v('registered'), '份', '精确记住位置', `收录时体积 <span class="mat-count">${bytes('registered_bytes')}</span>`],
      ['text', coverage?.with_text, '份', '能搜到里面的字', `整份录了 ${count(complete?.complete)} · 只录部分 ${count(complete?.partial)} · 还没录 ${count(coverage?.without_text)} · 文字记录 ${count(v('text_rows'), '条')} · 原生关系 ${count(v('relations'), '条')}`],
    ];
    const rows = levels.map(([id, amount, unit, label, detail]) => `<li ${id ? `id="${id}"` : ''}>${large('', n(amount), unit)}
      <strong>${label} ${count(amount, unit)}</strong><p>${detail}</p></li>`).join('');
    return card('shelf', '书架能帮你找到多少', 'shelf', levels.some(row => Number.isFinite(row[1])) ? `<ol class="mat-levels">${rows}</ol>` : missing,
      [coverage?.text && esc(coverage.text), noteOf(data, 'shelf', 'more-data', 'text')].filter(Boolean).join('<br>'), daily(data.readings.sources, ` · ${cadence}`), { subtitle: '从宽到窄四层，越往下越准' });
  }
  function refreshCard(data) {
    const vs = valueOf(data, 'refresh_partial'), info = valueOf(data, 'filename_refresh'), fileAt = valueOf(data, 'latest_filename_modified');
    const ready = Number.isSafeInteger(vs?.total) && Number.isSafeInteger(vs?.partial) && vs.partial >= 0 && vs.partial <= vs.total;
    const done = ready ? vs.total - vs.partial : 0;
    const dot = complete => `<i${complete ? '' : ' class="mat-pending"'}></i>`;
    const dots = ready && (vs.total > 120 ? `<progress class="mat-progress" aria-label="走完的来源" max="${vs.total}" value="${done}"></progress>`
      : `<div class="mat-dots" aria-hidden="true">${Array.from({ length: vs.total }, (_, i) => dot(i < done)).join('')}</div>`);
    const names = rows?.slice(0, 5).map((row, index, list) => `<span class="mat-source">${U.fieldHtml(row.label, { kind: viewer })}${U.visitorLabel(row, ['$', 'label'], '来源名称', viewer)}${index < list.length - 1 ? '、' : ''}</span>`).join('');
    const today = dayOf(info?.newest) === date.format(new Date());
    const content = ready ? `${large(today ? '今天' : '', `${n(done)}/${n(vs.total)}`, '处走完')}${dots}
      <p class="mat-legend">${dot(true)}走完 ${dot(false)}<span>没走完（先用上次完整清单）</span></p>
      ${vs.partial ? `<p class="mat-names">没走完的 ${count(vs.partial, '处')}：${names || '暂时读不到'}</p>` : ''}
      <p class="mat-small">完整清单 最旧 ${stamp(info?.oldest) || '暂时读不到'} · 最新 ${stamp(info?.newest) || '暂时读不到'}<br>清单里最新的文件改于 ${stamp(fileAt) || '暂时读不到'}</p>` : missing;
    const link = go(`/live/records/?project=${ID}&section=refresh_partial`, vs?.partial > 5 ? `全部 ${n(vs.partial)} 处` : '明细');
    return card('refresh', '新放进去的找得到吗', 'search', content, noteOf(data, 'refresh'), daily(data.readings.refresh_partial), { link });
  }
  function locators(data) {
    const found = valueOf(data, 'originals_present'), checked = valueOf(data, 'last_verified'), size = valueOf(data, 'size_mismatch');
    const content = Number.isFinite(found?.present) ? `${large('', `${n(found.present)}/${n(found.total)}`, '还在原处')}
      <p>大小和收录时不同 <b>${Number.isFinite(size) ? count(size, '份') : '暂时读不到'}</b></p>
      <p class="mat-checked">最近一次收录或核对原件<br><b>${stamp(checked) || '暂时读不到'}</b><br><span class="mat-small">（办事那天才会变）</span></p>` : missing;
    return card('locators', '记住的还对得上吗', 'disk', content + go(BACKUPS, '原件的备份副本 → 备份'),
      noteOf(data, 'locators'), daily(data.readings.originals_present));
  }

  const HISTORY_PAGE = 12;
  let historyAt = 0, historyPage = 0;
  function inventory(data) {
    const metric = data.readings.inventory_history, previous = data.readings.inventory_files;
    const entries = metric?.value?.items ?? (previous?.value ? [{ at: previous.at, scope: previous.scope,
      metrics: { source_scope_nonmedia_file_entries: previous.value, discoverable_not_exact_file_entries: valueOf(data, 'discoverable_files') },
      ...valueOf(data, 'inventory_progress') }] : null);
    const history = entries?.filter((item, i) => !i || dayOf(item.at).slice(0, 7) !== dayOf(entries[i - 1].at).slice(0, 7)) ?? null;
    const page = history?.slice(historyPage * HISTORY_PAGE, (historyPage + 1) * HISTORY_PAGE) || [], entry = page[historyAt] || page[0];
    const totals = entry?.metrics?.source_scope_nonmedia_file_entries, other = entry?.metrics?.discoverable_not_exact_file_entries;
    const newest = dayOf(history?.[0]?.at);
    const [year, month, day] = date.format(new Date()).split('-').map(Number);
    // Monthly project updates are due by the tenth, Beijing time.
    const expected = new Date(Date.UTC(year, month - (day > 10 ? 1 : 2), 1)).toISOString().slice(0, 7);
    const stale = U.isStale(metric ?? previous) || newest && newest.slice(0, 7) < expected;
    const fields = [['完成', 'completed_sources'], ['尝试', 'attempted_sources'], ['太大没数完', 'capped_sources'], ['读错', 'root_errors']];
    const steps = page.slice().reverse().map((item, i) => `<button type="button" data-mat-point="${page.length - 1 - i}" aria-label="${stamp(item.at)}" aria-pressed="${entry === item}"></button>`).join('');
    const content = entry ? `${large(totals?.lower_bound ? '至少' : '', n(totals?.value), '个')}<p>这些地方现在至少有多少文件</p>
      <p class="mat-inv-sub">其中没精确记住、还能按名字发现的<br><b>${other?.lower_bound ? '至少 ' : ''}${count(other?.value, '个')}</b></p>
      <dl class="mat-tallies">${fields.map(([label, key]) => `<div><dt>${label}</dt><dd>${n(entry[key])}</dd></div>`).join('')}</dl>
      <div class="mat-time"><div class="mat-points">${steps}</div><div><b>${stamp(entry.at, true)}</b>
        <span>下次：${Number((newest || date.format(new Date())).slice(5, 7)) % 12 + 1}月个人项目更新
        ${(historyPage + 1) * HISTORY_PAGE < history.length ? '<button type="button" data-mat-step="1">‹ 更早</button>' : ''}
        ${historyPage ? '<button type="button" data-mat-step="-1">更新 ›</button>' : ''}</span></div></div>
      <p class="mat-small">和左边每天的数不是同一天数的，不能相减</p>` : Array.isArray(history) ? '<p class="pj-note">还没盘点过</p>' : missing;
    return card('inventory', '现场盘点', 'clip', `<p class="mat-inv-lead">另一种数法：到现场把这些地方走一遍</p>${content}`,
      U.fieldHtml(entry?.scope || data.notes.shelf, { kind: viewer }), cutoff(entry?.at || metric?.at || previous?.at, stale && !historyPage && !historyAt, entry ? '（这次盘点）' : ''));
  }
  let viewer, rows, subscription, last, wide;
  function draw() {
    if (!last || !wide?.isConnected) return;
    const open = [...wide.querySelectorAll('.pj-notes[open]')].map(el => el.closest('.mat-card').id);
    U.html(wide, shelves(last) + `<div class="mat-row">${refreshCard(last)}${locators(last)}${inventory(last)}</div>`, false);
    for (const id of open) wide.querySelector(`#${id} .pj-notes`).open = true;
  }
  function board(d, kind, graphBlock, host) {
    if (!wide) {
      wide = document.createElement('div');
      wide.className = 'mat-wide';
      host.prepend(wide);
      wide.addEventListener('click', event => {
        const button = event.target.closest('button'), point = button?.dataset.matPoint, step = button?.dataset.matStep;
        if (point == null && step == null) return;
        if (step != null) historyPage += Number(step);
        historyAt = Number(point ?? 0);
        draw();
      });
    }
    host.classList.add('pj-board--materials');
    last = d.materials;
    if (kind !== viewer) {
      viewer = kind;
      rows = undefined;
      historyAt = historyPage = 0;
      subscription?.stop();
      const fixture = new URLSearchParams(location.search).has('fixture');
      subscription = window.Live.watch(`projects/${ID}/records${fixture ? '-refresh_partial' : ''}`, { section: 'refresh_partial' }, { data(payload, meta) {
        if ((meta?.viewer?.kind || 'public') !== viewer) return;
        rows = payload?.items;
        draw();
      } });
    }
    draw();
    const b = graphBlock('mat-where', '去实况里看');
    const links = [
      ['disk', '备份', '原件所在几类资料的副本', BACKUPS],
      ['calendar', '计划任务', '每日备份 17:10 顺带刷新名字清单', TASK],
      ['bolt', '名下技能', '怎么让 AI 找原件', d.skills_href || '/skills/'],
    ];
    U.html(b.head, `${icon('grid')}<b>去实况里看</b>`, false);
    U.html(b.viz, `<ul class="mat-links">${links.map(([kind, title, text, href]) => `<li><a href="${esc(href)}">${icon(kind)}<b>${title}</b><span>${text}</span>${arrow}</a></li>`).join('')}</ul>`, false);
    b.explain.hidden = false;
    U.html(b.explain, cadence, false);
    return [b];
  }
  const columns = keys => keys.every(key => ['changes', 'mat-where'].includes(key))
    ? keys.map(key => window.matchMedia('(max-width: 1100px)').matches || key === 'changes' ? 0 : 1) : null;
  window.ProjectPages = Object.assign(window.ProjectPages || {}, { [ID]: { adapt, board, columns } });
})();
