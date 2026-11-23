// 在用、冻结名册和近七天变化各自取，慢的一块单独等。
(async () => {
  'use strict';
  const isStale = data => data?.stale === true || data?.q === 'stale' || data?.state === 'stale';
  function staleText(data, at, now = Date.now()) {
    return window.LiveUI.staleText(data, at || data?.at, now);
  }
  const U = window.LiveUI, L = window.LiveLight, $ = id => document.getElementById(id), { esc, sp } = U;
  const p = new URLSearchParams(location.search), hero = $('hero'), states = new Map();
  const readFrozenView = () => new URLSearchParams(location.search).get('state') === 'frozen';
  let frozenOnly = readFrozenView();
  const route = href => { const u = new URL(href, location.origin); if (u.origin !== location.origin) return href; if (p.has('fixture') && u.pathname.startsWith('/live/')) u.searchParams.set('fixture', p.get('fixture')); return u.pathname + u.search + u.hash; };
  let looks = {}, looksReady = false;
  // 画册卡片、变化卡片顶上的插画横幅：先铺占位色、字照常先出；外观表到了才放图。
  // 图只在滑到离屏幕 350 像素以内才下（和页眉那份共用懒加载同一距离；首屏以下不先下）。
  // 用自己的 data-pj-src，不用 data-src：共用懒加载会删掉 data-src，列表按条目重画时又写回来，图就丢了。
  // 下过的地址记住，重画时直接带上 src，不会闪回占位色；坏图重试仍由共用那份管。
  const bandsShown = new Set();
  const bandWatch = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { const url = e.target.dataset.pjSrc; bandsShown.add(url); e.target.src = url; bandWatch.unobserve(e.target); }
  }, { rootMargin: '350px' }) : null;
  const watchBands = box => { for (const img of box.querySelectorAll('img[data-pj-src]:not([src])')) if (bandWatch) bandWatch.observe(img); else { bandsShown.add(img.dataset.pjSrc); img.src = img.dataset.pjSrc; } };
  const lazyImg = (url, w, h = w) => `<img data-pj-src="${esc(url)}"${bandsShown.has(url) ? ` src="${esc(url)}"` : ''} width="${w}" height="${h}" alt="" decoding="async">`;
  function band(look, href, cls, card = false) {
    const ready = looksReady && look, bg = ready ? `linear-gradient(135deg,${look.glow[0]},${look.glow[1]})` : 'linear-gradient(135deg,#f1ece2,#ebe8f0)';
    const pic = `<span class="pj-band ${cls}" style="background:${bg}">${ready ? card ? lazyImg(look.band, 960, 240) : lazyImg(look.banner, 720, 405) : ''}</span>`;
    return href ? `<a class="pj-band-link" href="${esc(route(href))}" tabindex="-1" aria-hidden="true">${pic}</a>` : `<span class="pj-band-link" aria-hidden="true">${pic}</span>`;
  }
  function withLook(key, rows) {
    return rows.map(row => {
      // 名字不公开的项目不放画（只铺占位色），免得从画认出是哪个项目。
      const look = row.secret ? null : window.LiveProjectLook?.of(row.project || row.key, looks);
      if (key === 'changes') return { ...row, band: band(look, row.href, 'pj-band--strip') };
      return { ...row, cls: `${row.cls} pj-card`, html: `${band(look, row.href, 'pj-band--card', true)}<div class="pj-card__body">${row.html}</div>` };
    });
  }
  function updateCutoff(key, data) {
    const section = $(key === 'changes' ? 'changes-footer' : key), at = stamp(data?.at);
    const label = { active: '在用项目名册截止', frozen: '冻结项目名册截止', changes: '项目变化截止' }[key];
    const legacy = !at && isStale(data) && staleText(data);
    const merged = key === 'active' && !hero.hidden && Date.parse(data?.at) === Date.parse(home?.at);
    const text = at && !merged ? `${label.replace(/截止$/, '截至')} ${at}` : legacy ? `${label.replace(/截止$/, '')} · ${legacy}` : '';
    let note = section.querySelector('[data-source-cutoff]');
    if (!text) { note?.remove(); return; }
    if (!note) { note = document.createElement('p'); note.className = 'row__sub'; note.dataset.sourceCutoff = ''; section.append(note); }
    note.textContent = text;
  }
  let disconnected;
  const repaints = new Map(), remember = (key, draw) => (d, meta) => { repaints.set(key, () => draw(d, meta)); draw(d, meta); };
  let viewer = 'public', home = null, changes = null, changeRows = null, changeViewer = 'public', next = null;
  const homeRead = U.reading(hero.querySelector('.card__body'), { ghost: U.ghost.card(1), name: '项目' });
  const projectGhost = `<div class="pj-figs pj-grid-ghost">${Array.from({ length: 4 }, () => '<div class="pj-fig"><span class="pj-fig__k fog__text">正在读项目</span><span class="pj-fig__v fog__text">正在读这一项</span></div>').join('')}</div>`;
  const reads = Object.fromEntries(['active', 'frozen', 'changes'].map(key => [key, U.reading($(key), { ghost: key === 'changes' ? U.ghost.rows(4) : projectGhost, slow: key !== 'active' })]));
  const phase = (key, s) => { if (s.data != null) return; if (key === 'home') { homeRead.set(s); if (p.has('fixture') && !frozenOnly) reads.active.set(s); } else reads[key].set(s); };
  const primed = new Set(), update = (key, paint) => { if (primed.has(key)) U.anchor(paint); else paint(); primed.add(key); };
  L.add(hero);
  const bar = U.topbar({ ask: () => `请看实况项目：${home?.text ? U.fieldText(home.text) : '请说明现在的情况'}。` });
  document.querySelectorAll('.stage a[href^="/live/"]').forEach(a => a.href = route(a.getAttribute('href')));
  document.querySelector('[data-back]').addEventListener('click', U.restoreBack);
  for (const key of ['active', 'frozen', 'changes']) { U.fold($(`${key}-more`), $(`${key}-box`)); $(`${key}-more`).addEventListener('click', () => foldLabel(key)); }
  function setRosterVisibility() {
    $(frozenOnly ? 'all-link' : 'frozen-link').removeAttribute('aria-current');
    $(frozenOnly ? 'frozen-link' : 'all-link').setAttribute('aria-current', 'page');
    for (const id of ['board', 'activity', 'active', 'changes', 'pj-summary']) $(id).hidden = frozenOnly;
    $('active').parentElement.hidden = frozenOnly;
    $('board').classList.toggle('is-single', frozenOnly);
  }
  setRosterVisibility();
  const empty = (text, grid) => ({ key: 'empty', cls: grid ? 'pj-empty' : 'row row--flat row--empty', html: `${grid ? '' : '<span></span>'}<p class="row__sub">${U.fieldHtml(text, { name: '项目', kind: viewer })}</p>` });
  function foldLabel(key, count) {
    const button = $(`${key}-more`); if (count != null) button.dataset.count = count;
    U.html(button, `${button.getAttribute('aria-expanded') === 'true' ? '收起' : key === 'frozen' ? `冻结 ${button.dataset.count} 个` : key === 'changes' ? `展开（还有 ${button.dataset.count} 个项目组）` : `还有 ${button.dataset.count} 个`} <span class="more__chev">›</span>`);
  }
  function renderHead() {
    const roster = key => { const state = states.get(key); return state?.viewer?.kind === viewer ? state.data : null; };
    const activeRoster = roster('active'), frozenRoster = roster('frozen');
    const source = frozenOnly ? frozenRoster : home || activeRoster || frozenRoster;
    const status = U.status(source); L.tone(hero, source);
    const active = home?.active ?? activeRoster?.total, frozen = home?.frozen ?? frozenRoster?.total;
    const total = home?.total ?? activeRoster?.portfolio_total ?? frozenRoster?.portfolio_total
      ?? (Number.isFinite(active) && Number.isFinite(frozen) ? active + frozen : null);
    const privateSummary = home?.text && typeof home.text === 'object';
    const summary = privateSummary ? '' : sp(home?.text).split(' · ').filter(s => !/^数据截止\s/.test(s)).join(' · ');
    const counts = [Number.isFinite(active) && `${active} 个在用`, Number.isFinite(frozen) && `${frozen} 个冻结`].filter(Boolean).join(' · ');
    const text = frozenOnly ? Number.isFinite(frozenRoster?.total) ? `共 ${frozenRoster.total} 个冻结项目` : '冻结的项目'
      : [Number.isFinite(total) && `共 ${total} 个项目`, counts || summary].filter(Boolean).map(sp).join(' · ');
    const sourceAt = frozenOnly ? frozenRoster?.source_at ?? frozenRoster?.at : home?.source_at ?? home?.at
      ?? activeRoster?.at ?? frozenRoster?.at;
    const at = sourceAt && stamp(sourceAt), sameRoster = at && Date.parse(home?.at) === Date.parse(states.get('active')?.data?.at);
    const cutoff = at ? ` <span class="row__meta">${U.isStale(source) ? '上次项目汇总' : '项目汇总截至'} ${esc(at)}${sameRoster ? '（含在用名册）' : ''}</span>` : '';
    const empty = U.offline?.() ? '这块没存下来，连上后补上。' : '项目暂时读不到';
    U.html($('head'), status.lamp + U.head(text || (privateSummary ? '项目' : empty), { lamp: false }) + cutoff + (status.note ? ` <span class="row__meta">${status.note}</span>` : '') + (!frozenOnly && privateSummary ? ` <span class="row__meta">${U.fieldHtml(home.text, { name: '项目说明', kind: viewer })}</span>` : ''));
  }
  let changesPack = null;
  function fill(key, rows, none) {
    const n = key === 'frozen' && !frozenOnly ? 0 : key === 'changes' ? 5 : Infinity; if (rows == null) { rows = []; none = U.offline?.() ? '这块没存下来，连上后补上。' : `${({ active: '在用的项目', frozen: '冻结的项目', changes: '项目变化' })[key]}暂时读不到`; $(`${key}`).style.minHeight = '0'; }
    rows = withLook(key, rows);
    const total = rows.length;
    if (key !== 'frozen' || !frozenOnly && rows.length > 6) rows = groupedRows(rows, key);
    U.list($(`${key}-list`), rows.length ? rows.slice(0, n) : none ? [empty(none, key !== 'changes')] : []); U.list($(`${key}-rest`), rows.slice(n));
    watchBands($(key));
    // 项目变化：先列的几组和展开后的其余几组接着排两栏，展开后不在两块之间空一截（M486/M487）
    if (key === 'changes') (changesPack ||= window.LivePack.create([$('changes-list'), $('changes-rest')], { cols: 2, gap: 24 })).fit();
    $(`${key}-more`).hidden = rows.length <= n; foldLabel(key, key === 'frozen' ? total : Math.max(0, rows.length - n));
    L.lightUp([hero, $('board'), $('notices')]);
  }
  function groupedRows(rows, key) {
    const groups = new Map(), cls = key === 'changes' ? 'rows list' : 'pj-figs';
    for (const row of rows) { const label = row.group || ''; if (!groups.has(label)) groups.set(label, []); groups.get(label).push(row); }
    const list = items => `<ul class="${cls}">${items.map(r => `<li class="${r.cls}" data-key="${esc(r.key)}">${r.html}</li>`).join('')}</ul>`;
    return [...groups].map(([label, items]) => {
      const first = items[0], title = key === 'changes' ? name({ name: first.groupLabel, href: first.href }, changeViewer) : U.fieldHtml(first.groupLabel ?? label, { name: '项目分类', kind: viewer });
      const shown = key === 'changes' ? 5 : 6;  // 名册排三列，先露两整排
      return { key: `group:${label}`, cls: 'pj-list-group', html: `${key === 'changes' ? first.band || '' : ''}${label ? `<p class="part">${title}</p>` : ''}${list(items.slice(0, shown))}${items.length > shown ? `<details><summary class="live-disclosure"><span class="disclosure-closed">展开（还有 ${items.length - shown} 条）</span><span class="disclosure-open">收起</span><span class="disclosure-chev">›</span></summary>${list(items.slice(shown))}</details>` : ''}` };
    });
  }
  const name = (it, kind = viewer) => { const field = it.name || it.label || '', hidden = kind === 'public' && (field?.hidden || field?.visibility === 'owner' || field?.public === 'owner'), text = U.fieldHtml(field, { name: '项目', place: 'label', kind }), note = hidden ? U.fieldHtml(field, { name: '项目名', kind }) : U.visibilityNote(it, kind, it.hidden_what || '这个项目'); return (it.href ? `<a class="row__title" href="${esc(route(it.href))}">${text} <span class="more__chev">›</span></a>` : `<span class="row__title">${text}</span>`) + (note ? `<span class="row__meta">${note}</span>` : ''); };
  const stamp = at => {
    if (typeof at !== 'string' || !at) return '';
    if (/^\d{4}-\d\d-\d\d$/.test(at)) return at.startsWith('2026-') ? at.slice(5) : at;
    if (!/(?:Z|[+-]\d\d:\d\d)$/.test(at)) at += '+08:00';
    const date = new Date(at); if (!Number.isFinite(+date)) return '';
    const year = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Shanghai', year: 'numeric' }).format(date);
    return `${year === '2026' ? '' : `${year}-`}${U.date(at)} ${U.time(at)}`;
  };
  const display = s => sp(s).replace(/\d{4}-\d\d-\d\d(?:T\d\d:\d\d(?::\d\d(?:\.\d+)?)?(?:Z|[+-]\d\d:\d\d)?)/g, stamp).replaceAll('登记', '记录');
  const headline = (it, withLabel = true) => {
    const h = it.headline, v = h?.value, seconds = v?.window?.seconds;
    const days = h?.id === 'contribution_days' || h?.data_through;
    const supplied = v?.window ? v.text || h?.text : h?.text || v?.text;
    let value = days && Number.isFinite(v) ? v : supplied || (v ?? (h?.rewrite === 'pending' ? sp(h) : null));
    if (v?.window && typeof value === 'object' && Number.isFinite(seconds) && seconds >= 0 && Number.isFinite(v.total)) {
      value = seconds >= 86400 ? `近 24 小时按现有日志共 ${v.total} 次` : `现有日志覆盖约 ${Math.floor(seconds / 60)} 分钟，共 ${v.total} 次`;
    }
    if (value == null) return '';
    if (typeof value === 'object') return sp(value);
    let reading = sp(value).trim().replace(/^现存日志内/, '现有日志内');
    // M316：AI 发射台这一项后台写成“09-16 01:09 用过旧版本”，意思是那次测的不是现在装的版本。
    if (it.id === 'ai-cli-profile-manager' && h?.id === 'latest_agent') reading = reading.replace(/\s*用过旧版本$/, '（当时还是旧版本）');
    if (!reading) return '';
    const numeric = /^[+-]?\d+(?:[,.]\d+)*(?:\/\d+)?$/.test(reading);
    const unit = !numeric ? '' : days ? (Number.isFinite(v) && (h.unit || '天')) : h.unit;
    const text = [withLabel && h.label, reading, unit].filter(Boolean).map(sp).join(' ');
    return window.LiveProjectViz.lower(h, 'value') && !text.includes('至少') && /\d/.test(reading) ? `至少 ${text}` : text;
  };
  const recent = it => !it.changed?.at ? '' : `<small class="pj-recent" title="${esc(stamp(it.changed?.at))}">${esc(window.LiveProjectViz.ago(it.changed?.at, window.Live.now?.() || Date.now()))}</small>`;
  const rosterStat = text => display(text).replace(/(?<![\d.,])\d{4,}(?=\s*(?:笔|件))/g, n => n.replace(/\B(?=(\d{3})+(?!\d))/g, ',')).split(/(\d[\d,.]*\s*(?:万)?\s*(?:项|份|个|字|行|次|笔|件))/).filter(Boolean).map(part => `<span class="pj-stat-piece">${U.fieldHtml(part, { name: '项目读数', kind: viewer })}</span>`).join('');
  function newProjectLabel(it) { return viewer === 'owner' && it.new === true ? '<span class="tag tag--new">新项目</span> ' : ''; }
  function renderActive(items) {
    fill('active', items?.filter(it => it.name || it.label).sort((a, b) => (Date.parse(b.changed?.at) || 0) - (Date.parse(a.changed?.at) || 0)).map(it => {
      const status = U.status(it, { small: true }), phase = it.phase === 'archived' ? '冻结' : it.phase_gap;
      const text = String(headline(it, false)).trim(), hidden = viewer === 'public' && (it.name?.hidden || it.name?.visibility === 'owner' || it.name?.public === 'owner'), shown = (it.new === true && viewer === 'owner' ? newProjectLabel(it) : '') + U.fieldHtml(it.name || it.label || it.title || it.id, { name: '项目', place: 'label', kind: viewer }), note = hidden ? U.fieldHtml(it.name, { name: '项目名', kind: viewer }) : U.visibilityNote(it, viewer, it.hidden_what || '这个项目');
      const h = it.headline, marked = [h?.text, h?.value?.text, h?.value, h].find(v => v && typeof v === 'object' && (v.hidden || v.hidden_block || ['owner', 'pending', 'rewritten'].includes(v.visibility) || v.public === 'owner' || v.public === 'rewrite' || v.rewrite));
      const remote = it.id === 'pcconfig' && (h?.id === 'remote' || h?.value?.window);
      const hasText = !!(text || marked), valueHtml = marked || remote ? U.fieldHtml(marked || text, { name: '项目读数', kind: viewer }) : rosterStat(text);
      let label = h?.label, scope = h?.scope;
      const observed = typeof h?.at === 'string' && stamp(h.at), through = h?.data_through && stamp(h.data_through);
      if (through && !marked && !text.includes(through) && (!scope || typeof scope === 'string' && !scope.includes(through))) scope = [`截至 ${through}`, scope].filter(Boolean).join(' · ');
      if (remote && !marked) {
        const w = h.value?.window, from = stamp(w?.from), to = stamp(w?.to);
        if (/现有日志/.test(text) || Number.isFinite(w?.seconds) && w.seconds < 86400) label = 'AI 远程用电脑';
        const range = from && to ? `现有日志从 ${from} 到 ${to}` : from ? `现有日志自 ${from} 起` : to ? `现有日志截至 ${to}` : '';
        if (range && (!scope || typeof scope === 'string' && !(scope.includes(from) && scope.includes(to)))) scope = [range, scope].filter(Boolean).join(' · ');
      }
      if (it.id === 'typora-theme-pack' && h?.id === 'menus' && scope === 'Current installed theme and configured menus; export was not run') scope = '当前已安装的主题和已配置的菜单，本次未执行导出';
      // M316：项目自己起的读数名和说明，外人读不懂的几句换成人话；只换说法，数照后台给的。
      if (it.id === 'ai-cli-profile-manager' && h?.id === 'latest_agent' && label === '最后一次实战（含旧版）') label = '最近一次让 AI 真干活的测试';
      if (it.id === 'video-scaffold' && h?.id === 'films' && typeof scope === 'string') scope = scope.replace(/^已选的 (\d+) 组本地完整长版及各自成片目录；不是全历史或发布总数。.*$/s, '只算这台电脑上存着成片的 $1 部，不是做过的全部片子，也不是发出去的数量。');
      const labelHtml = label ? U.fieldHtml(label, { name: '项目读数', place: 'label', kind: viewer }) : '', labelBody = label ? U.fieldHtml(label, { kind: viewer }) : '';
      const scopeHtml = scope ? `<small class="pj-fig__sub pj-fig__scope" title="${esc(typeof scope === 'string' ? scope : '')}">${U.fieldHtml(scope, { name: '项目说明', kind: viewer })}</small>` : '';
      const readAt = observed && observed !== through && !marked && !text.includes(observed) && !(typeof scope === 'string' && scope.includes(observed)) ? `<small class="pj-fig__sub">读取于 ${esc(observed)}</small>` : '';
      const labelHidden = viewer === 'public' && labelBody.includes('live-mark--owner') && (label?.hidden || label?.visibility === 'owner' || label?.public === 'owner' || /^〔?[^〔〕<>]*(?:仅本人可见|可信设备可见)〕?$/.test(labelHtml.trim()));
      const labelLine = label && !labelHidden ? `<small class="pj-fig__sub" title="${esc(typeof label === 'string' ? label : '')}">${labelHtml}</small>` : '';
      const labelMark = labelBody !== labelHtml ? `<small class="pj-fig__mark">${labelBody}</small>` : '';
      const valueLine = `<span class="pj-fig__v${/还没读到|还在采集|开始记|没有记录/.test(text) ? ' row__sub' : ''}${[...text].length > 11 ? ' is-long' : ''}" title="${esc(marked ? '' : text)}">${valueHtml}</span>`;
      const reading = (hasText ? labelLine + labelMark + valueLine : '') + (hasText || through ? scopeHtml + readAt : '');
      return { key: it.id, href: it.href, secret: hidden, group: ({ daily: '日用', occasional: '偶用' })[it.phase] || '未分档', cls: 'pj-fig', html: `${status.lamp}${it.href ? `<a class="pj-fig__link" title="${esc(it.name || it.label || it.title || it.id)}" href="${esc(route(it.href))}">${shown} ›</a>` : `<span class="pj-fig__k">${shown}</span>`}${reading}${hasText && window.LiveProjectViz.lower(h, 'value') && window.LiveProjectViz.gap(h) ? `<small class="pj-fig__sub">${U.fieldHtml(window.LiveProjectViz.gap(h), { name: '读数说明', kind: viewer })}</small>` : ''}${recent(it)}${phase ? `<small class="pj-fig__sub">${U.fieldHtml(phase, { name: '项目分档', kind: viewer })}</small>` : ''}${status.note ? `<small class="pj-fig__sub">${status.note}</small>` : ''}${note ? `<small class="pj-fig__mark">${note}</small>` : ''}` };
    }), '没有在用的项目');
  }
  function shortText(value, options) {
    const full = U.fieldHtml(value, options), plain = U.fieldText(value, options.kind);
    const first = plain.match(/^[^。！？\n]*[。！？]?/)?.[0] || plain;
    const preview = [...first].slice(0, 80).join('');
    if (preview === plain) return full;
    return `<details class="pj-short"><summary><span>${esc(preview)}${preview.length < first.length ? '…' : ''}</span><span class="more"><span class="disclosure-closed">展开全文</span><span class="disclosure-open">收起全文</span> <span class="more__chev" aria-hidden="true">›</span></span></summary><div class="row__sub">${full}</div></details>`;
  }
  function renderFrozen(items) {
    fill('frozen', items?.filter(it => it.name || it.label).map(it => {
      const status = U.status(it, { small: true }), phase = { daily: '日用', occasional: '偶用', archived: '冻结' }[it.phase] || it.phase_gap;
      const detail = [phase && U.fieldHtml(phase, { name: '项目分档', kind: viewer }), it.reason && shortText(it.reason, { name: '冻结原因', kind: viewer }), status.note]
        .filter(Boolean).map(line => `<div class="pj-fig__sub">${line}</div>`).join('');
      // 冻结项目的详情页照样打得开（/live/project/?id=…）；后台名册没给链接时按编号接上
      const secret = secretName(it.name || it.label), href = secret ? '' : it.href || (it.id ? `/live/project/?id=${encodeURIComponent(it.id)}` : '');
      return { key: it.id, cls: 'pj-fig', href, secret,
        html: `<p class="row__main">${status.lamp}${name({ ...it, href })}</p>${detail}` };
    }), '没有冻结的项目');
  }
  const changesNote = document.createElement('p'); changesNote.className = 'row__sub'; changesNote.hidden = true; $('changes-footer').append(changesNote);
  const changeRow = it => ({ key: it.id, project: it.project, group: it.project || it.id, groupLabel: it.name, secret: secretName(it.name, changeViewer),
    href: it.href || (it.project ? `/live/project/?id=${encodeURIComponent(it.project)}` : ''),
    cls: 'row row--flat pj-item pj-item--change',
    html: `<div class="row__text"><div class="row__sub">${shortText(typeof it.text === 'string' ? display(it.text) : it.text || (U.offline?.() ? '' : '变化内容暂时读不到'), { name: '项目变化', kind: changeViewer })}</div></div><span class="pj-at">${it.at ? stamp(it.at) : ''}</span>` });
  function renderChanges() {
    const roster = p.has('fixture') ? home?.items || [] : ['active', 'frozen'].flatMap(key => {
      const state = states.get(key);
      return state?.viewer?.kind === changeViewer ? state.data?.items || [] : [];
    });
    const projects = new Map(roster.map(it => [it.id, it]));
    const rows = changeRows?.map(it => ({ ...it, name: it.name || projects.get(it.project)?.name || '项目变化', href: it.href || projects.get(it.project)?.href }));
    const gap = changes?.gap && (changes.q === 'partial' || isStale(changes)) ? U.fieldHtml(changes.gap, { kind: changeViewer }) : '';
    const hidden = changeViewer === 'owner' && changes?.hidden;
    fill('changes', rows?.filter(it => it.name).map(changeRow), hidden || gap ? '' : '近 7 天没有实质变化');
    $('next').hidden = !next;
    const note = [gap, hidden && `另有 ${esc(hidden)} 个${esc(changes.hidden_what || '项目变化')}没列在这里`].filter(Boolean).join(' · ');
    changesNote.hidden = !note; U.html(changesNote, note);
  }
  function link(key, s) {
    const rosterChanged = ['active', 'frozen'].includes(key) && states.get(key)?.data !== s.data;
    states.set(key, s);
    if (key === 'home') bar?.set({ ...s, cutoffAt: s.shownAt });
    if (s.data || ['none', 'gone'].includes(s.phase)) renderHead();
    if (key === 'home' || key === 'active') updateCutoff('active', states.get('active')?.data);
    else updateCutoff(key, s.data);
    if (rosterChanged && changeRows?.length) renderChanges();
    if (disconnected !== undefined && disconnected !== s.offline) for (const draw of repaints.values()) draw();
    disconnected = s.offline; L.offline([...states.values()].some(x => x.offline));
    const notice = [...states].find(([, x]) => x.offline || (!x.data && !x.warming && x.text));
    const connection = notice?.[1].offline ? notice[1].text.split(' · ')[0] : notice?.[1].text;
    U.list($('notices'), notice ? [{ key: notice[0], cls: 'notice glass', html: `<span>${U.fieldHtml(connection, { name: '连接情况', kind: viewer })}</span>` }] : []);
    if (!s.data && ['none', 'gone'].includes(s.phase)) { if (key === 'home' || key === 'active') renderOverview(states.get('active')?.data || home); if (key === 'changes') { changes = changeRows = next = null; renderChanges(); } if (key === 'active') renderActive(null); else if (!['home', 'changes'].includes(key)) fill(key, null); }
    const fallback = s.fallbackNote || s.meta?.fallbackNote || '';
    const fallbackNote = /^数据截止\s/.test(fallback) && (key === 'home' ? s.shownAt : s.data?.at) ? '' : fallback;
    U.blockNote(key === 'home' ? hero.querySelector('.card__body') : $(key), { fallbackNote: key === 'home' && fallbackNote ? `页头 · ${fallbackNote}` : fallbackNote });
  }
  function renderActivity(data) {
    const host = $('activity-chart'), rows = data?.items || [];
    if (!data || rows.length < 2 || U.offline?.() && !rows.some(r => r.commits?.some(Number.isFinite))) {
      window.LiveProjectViz.heatmap(host, data, viewer, route); return;
    }
    const days = data.days || [], first = days.findIndex((_, i) => rows.some(r => Number.isFinite(r.commits?.[i]))), start = first < 0 ? days.length : first;
    host.innerHTML = '<div class="pj-heat-halves"><div></div><div></div></div><div class="pj-heat-footer"></div>';
    const halves = [...host.firstElementChild.children], midpoint = Math.ceil(rows.length / 2);
    halves.forEach((half, i) => window.LiveProjectViz.heatmap(half, { ...data, days: days.slice(start), items: (i ? rows.slice(midpoint) : rows.slice(0, midpoint)).map(r => ({ ...r, commits: r.commits?.slice(start) })) }, viewer, route, { aligned: true }));
    const footer = host.lastElementChild;
    footer.append(...[...halves[0].children].slice(1));
    [...halves[1].children].slice(1).forEach(el => el.remove());
    window.LiveProjectViz.bindHeat(host);
  }
  let extraLanded = false;
  function renderOverview(d) {
    if (frozenOnly) return;
    drawProjectExtras(d);
    const target = /^#(?:unpushed|recent-artifacts)$/.test(location.hash) && $(location.hash.slice(1));
    if (!extraLanded && target && !target.hidden) {
      extraLanded = true;
      requestAnimationFrame(() => target.scrollIntoView());
    }
    window.LiveProjectViz.summary($('pj-summary'), d?.summary, viewer); renderActivity(d?.activity);
    if (!U.offline?.() && !d?.summary) U.html($('pj-summary'), '<span class="pj-summary-none">近 7 天、文档、代码暂时读不到</span>');
    $('activity').querySelector('.part').hidden = !U.offline?.() && !d?.activity;
    if (!U.offline?.() && !d?.activity) U.html($('activity-chart'), '<p class="pj-note">近 30 天项目活跃暂时读不到</p>');

  }
  // 下面两块（本地还没推的改动、最近成品）和上面画册一套：大标题加绿条，白卡、深色正文，配项目小图。
  const secretName = (field, kind = viewer) => kind === 'public' && !!field && typeof field === 'object' && !!(field.hidden || field.hidden_block || field.visibility === 'owner' || field.public === 'owner' || field.visibility === 'pending' || field.rewrite === 'pending');
  // 项目小图：名字不公开的不放图（只铺占位色），免得认出是哪个项目；外观表没到也先铺占位色。
  function miniPic(id, nameField, kind = viewer) {
    const secret = !id || secretName(nameField, kind), look = !secret && window.LiveProjectLook?.of(id, looks);
    const ready = looksReady && look, bg = ready ? `linear-gradient(135deg,${look.glow[0]},${look.glow[1]})` : 'linear-gradient(135deg,#f1ece2,#ebe8f0)';
    return `<span class="pj-mini__pic" style="background:${bg}" aria-hidden="true">${ready ? lazyImg(look.thumb, 160) : ''}</span>`;
  }
  function recentDisclosure(box) {
    const button = box.querySelector('.part').appendChild(document.createElement('button'));
    button.type = 'button'; button.className = 'btn btn--sm pj-extra__all'; button.setAttribute('data-mo-press', '');
    const folds = () => [...box.querySelectorAll('.pj-extra__more:not([hidden]), .pj-art:not(.is-leaving) > details')];
    const sync = () => {
      const sections = folds(), allOpen = sections.length > 0 && sections.every(el => el.open);
      button.hidden = !sections.length;
      button.setAttribute('aria-expanded', String(allOpen));
      button.textContent = allOpen ? '收起全部成品' : '展开全部已读到的成品';
    };
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      box.pack?.reset();
      for (const el of folds()) el.open = open;
      sync();
    });
    box.addEventListener('toggle', sync, true);
    return () => {
      if (button.getAttribute('aria-expanded') === 'true') for (const el of folds()) el.open = true;
      sync();
    };
  }
  function drawProjectExtras(d) {
    const field = v => U.fieldHtml(v, { kind: viewer });
    const section = (id, title, rows, note = '', rest = []) => {
      let box = $(id);
      if (!rows.length && !note) { if (box) box.hidden = true; return; }
      if (!box) {
        box = document.createElement('section'); box.id = id; box.className = `pj-sec pj-extra pj-extra--${id}`;
        box.innerHTML = '<p class="part"><span></span></p><p class="pj-extra__note" data-extra-note></p><ul class="pj-extra__list"></ul><details class="pj-extra__more"><summary class="live-disclosure"><span class="disclosure-closed"></span><span class="disclosure-open">收起</span><span class="disclosure-chev">›</span></summary><ul class="pj-extra__list" data-extra-rest></ul></details>';
        if (id === 'recent-artifacts') box.syncDisclosure = recentDisclosure(box);
        (id === 'recent-artifacts' && $('unpushed') || $('activity')).after(box);
      }
      box.hidden = frozenOnly; box.querySelector('.part > span').textContent = title;
      U.list(box.querySelector('ul'), rows); U.html(box.querySelector('[data-extra-note]'), note);
      const more = box.querySelector('.pj-extra__more');
      more.hidden = !rest.length; more.querySelector('.disclosure-closed').textContent = `再看 ${rest.length} 个项目`;
      U.list(box.querySelector('[data-extra-rest]'), rest);
      // 最近成品：卡按顺序放进最矮的一栏，“再看几个项目”展开后接着排（M487，共用 LivePack）
      if (id === 'recent-artifacts') (box.pack ||= window.LivePack.create([...box.querySelectorAll('.pj-extra__list')], { min: 330, gap: 24 })).fit();
      box.syncDisclosure?.();
      watchBands(box);
    };
    drawUnpushed(d?.unpushed, section, field); drawRecentArtifacts(d?.recent_artifacts, section, field, viewer);
  }
  function drawUnpushed(unpushed, section, field) {
    // 有没推提交的排前面、放大；零值不写，只写有的。
    const items = (unpushed?.items || []).filter(it => it.commits > 0 || it.files > 0)
      .sort((a, b) => (b.commits > 0) - (a.commits > 0) || (b.commits || 0) - (a.commits || 0) || (b.files || 0) - (a.files || 0));
    section('unpushed', '本地还没推的改动', items.map(it => {
      const seconds = it.age_seconds, mins = Math.floor(seconds / 60), remainder = seconds % 60;
      const age = Number.isInteger(seconds) && seconds >= 0 && (mins < 60 && remainder ? [mins && `${mins} 分`, `${remainder} 秒`].filter(Boolean).join(' ') : U.minutes(Math.round(seconds / 60)));
      const hot = it.commits > 0;
      const words = [it.files > 0 && `${it.files} 个文件没提交`, age && `已放 ${age}`, it.local_only === true && '按你说的只留本地', it.note && it.note !== '按你说的只留本地' && field(it.note)].filter(Boolean);
      const lead = hot ? `<p class="pj-mini__big"><b>${esc(it.commits)}</b> 个提交没推</p>` : '';
      return { key: it.id, cls: `pj-mini${hot ? ' is-hot' : ''}`, html: `${miniPic(it.id, it.name)}<div class="pj-mini__text"><p class="pj-mini__name">${field(it.name)}</p>${lead}${words.length ? `<p class="pj-mini__sub">${words.join(' · ')}</p>` : ''}</div>` };
    }), unpushed?.items?.length ? [unpushed.at && `数据截至 ${stamp(unpushed.at)}`, unpushed.gap && field(unpushed.gap)].filter(Boolean).join(' · ') : '');
  }
  function drawRecentArtifacts(recent, section, field, audience = 'public') {
    const concealed = v => v?.visibility === 'pending' || v?.rewrite === 'pending' || audience === 'public' && (v?.hidden || v?.hidden_block || v?.visibility === 'owner' || v?.public === 'owner');
    // 按项目一张卡；同一项目里标题和说明都一样的几件合成一行写“×N”，每件的时刻各是一个按钮，去向和原来一样。不公开的成品单独一张、不带项目和图。
    const groups = new Map(), items = recent?.items || [];
    items.forEach((it, index) => {
      const fields = [it, it.recent_title, it.title];
      if (audience === 'owner') fields.push(it.project, it.project?.name);
      // 整件藏起来（content_locked 或整件标了不公开）才归进“不公开的成品”；只藏了标题的照常列，说明和打开链接都给，标题处写清藏了名称。
      const hidden = fields.some(concealed);
      const secret = it.title === '一样私事成品' || concealed(it) || audience === 'owner' && hidden || audience === 'public' && it.content_locked;
      const gkey = secret ? 'private' : `p:${it.project?.id || (typeof it.project?.name === 'string' ? it.project.name : index)}`;
      if (!groups.has(gkey)) groups.set(gkey, { key: gkey, secret, project: secret ? null : it.project, rows: [] });
      const group = groups.get(gkey);
      let title, sub = '', item = { ...it, id: `recent-artifact-${it.project?.id || ''}-${index}` }, open = null;
      if (secret) {
        title = audience === 'public' ? '仅本人可见' : esc(['一样私事成品', !hidden && stamp(it.at).split(' ')[0]].filter(Boolean).join(' · '));
        item = { id: `recent-artifact-hidden-${index}` };
      } else {
        const project = it.project?.name, raw = it.recent_title || '已登记的成品';
        const prefix = typeof project === 'string' ? `${project} · ` : '';
        title = audience === 'public' && [it.recent_title, it.title].some(v => concealed(v) || typeof v === 'string' && /(?:仅本人可见|可信设备可见)$/.test(v)) ? '成品名称仅本人可见'
          : field(typeof raw === 'string' && prefix && raw.startsWith(prefix) ? raw.slice(prefix.length) : raw);
        sub = field(it.recent_detail || '这项成品已有登记，内容说明待补充。');
        const publicLink = audience === 'public' && typeof it.open === 'string' && !it.web_open ? { href: it.open, label: '打开成品' } : it.web_open;
        open = U.artifactAction({ ...it, web_open: publicLink }, audience, route);
        // 新私事规则：登记时填了 open_note（“这里是这份材料的正文（8 页），所以不予展示”）的成品，访客版在打开链接的位置显示这句普通字；本人版照给链接，旁边挂“访客看不到”。
        const openNote = U.fieldText(it.open_note, audience).trim();
        if (openNote && audience === 'public') { open = null; item = { ...item, openNote }; }
        else if (openNote) item = { ...item, ownerNote: U.visitorHiddenTag('这份成品的正文', `访客版在打开链接的位置写：${openNote}`, audience) };
      }
      const sig = secret && audience === 'public' ? item.id : `${title}\u0000${sub}`;
      let row = group.rows.find(r => r.sig === sig);
      if (!row) group.rows.push(row = { sig, title, sub, members: [] });
      row.members.push({ item, open, at: it.at });
    });
    const openAction = (item, action) => audience === 'public'
      ? `<a class="btn btn--sm" href="${esc(action.href)}"${/^https?:/i.test(action.href) ? ' target="_blank" rel="noopener"' : ''} data-mo-press>${esc(action.label)}</a>`
      : U.actions(item, [action]);
    const rowHtml = r => {
      const one = r.members.length === 1, m = r.members[0], when = x => x.at ? stamp(x.at) : '';
      if (one) return `<li class="pj-art__row"><div class="pj-art__text"><p class="pj-art__title">${r.title}</p>${r.sub ? `<p class="pj-art__sub">${r.sub}</p>` : ''}${m.open ? `<div class="acts">${openAction(m.item, m.open)}${m.item.ownerNote || ''}</div>` : m.item.openNote ? `<p class="pj-art__sub">${esc(m.item.openNote)}</p>` : m.item.ownerNote ? `<div class="acts">${m.item.ownerNote}</div>` : ''}</div><span class="pj-at">${esc(when(m))}</span></li>`;
      const caption = r.members.find(x => x.open)?.open.label;
      const times = r.members.map(x => x.open ? openAction(x.item, { ...x.open, label: when(x) || x.open.label }) + (x.item.ownerNote || '') : `<span class="pj-at">${esc([when(x), x.item.openNote].filter(Boolean).join(' · '))}</span>`).join('');
      return `<li class="pj-art__row is-many"><div class="pj-art__text"><p class="pj-art__title">${r.title} <span class="pj-art__count">×${r.members.length}</span></p>${r.sub ? `<p class="pj-art__sub">${r.sub}</p>` : ''}<div class="acts pj-art__times">${typeof caption === 'string' ? `<span class="pj-art__caption">${esc(caption)}</span>` : ''}${times}</div></div></li>`;
    };
    const SHOW = 3;
    const cards = [...groups.values()].map(g => {
      const p = g.project, name = g.secret ? '不公开的成品' : field(p?.name || '项目');
      const head = g.secret ? `<span class="row__title">${name}</span>` : p?.href ? `<a class="row__title" href="${esc(route(p.href))}">${name} <span class="more__chev">›</span></a>` : `<span class="row__title">${name}</span>`;
      const rest = g.rows.slice(SHOW);
      const header = g.secret && audience === 'public' ? '' : `<div class="pj-art__head">${g.secret ? miniPic('', null) : miniPic(p?.id, p?.name)}${head}</div>`;
      return { key: g.key, cls: 'pj-art', html: `${header}<ul class="pj-art__rows">${g.rows.slice(0, SHOW).map(rowHtml).join('')}</ul>${rest.length ? `<details><summary class="live-disclosure"><span class="disclosure-closed">展开（还有 ${rest.length} 条）</span><span class="disclosure-open">收起</span><span class="disclosure-chev">›</span></summary><ul class="pj-art__rows">${rest.map(rowHtml).join('')}</ul></details>` : ''}` };
    });
    const missing = Number.isInteger(recent?.count_7d) && recent.count_7d > items.length
      ? `近 7 天登记 ${recent.count_7d} 件，还有至少 ${recent.count_7d - items.length} 件未读到`
      : '';
    const note = items.length || recent?.hidden || missing ? [
      recent.at && `成品数据截至 ${stamp(recent.at)}`, missing || recent.q === 'partial' && '只列已读到的成品',
    ].filter(Boolean).join(' · ') : '';
    section('recent-artifacts', '最近成品', cards.slice(0, 9), note, cards.slice(9));
  }
  window.LiveHeader.watch(null, {
    phase: s => phase('home', s),
    data: remember('home', (d, meta) => {
      viewer = meta.viewer?.kind || 'public'; home = d?.projects; if (p.has('fixture')) renderOverview(home); renderHead();
      if (changeRows?.length) renderChanges();  // 变化先到时名字还没有，项目名到了重画
      $('published').textContent = d?.published ? `网站上次发布 ${stamp(d.published)}` : '';
      if (d) homeRead.done();
      if (p.has('fixture') && !frozenOnly) {
        update('active', () => renderActive(home?.items)); if (d) reads.active.done();
      }
    }), link: s => link('home', s),
  });
  const activeRoster = { phase: s => phase('active', s), data: remember('active', (d, meta) => { viewer = meta.viewer?.kind || 'public';
    renderHead(); renderOverview(d); update('active', () => renderActive(d?.items));
    if (d) reads.active.done();
  }), link: s => link('active', s) };
  window.Live.watch('projects', { state: 'frozen' }, { phase: s => phase('frozen', s), data: remember('frozen', (d, meta) => { viewer = meta.viewer?.kind || 'public'; if (!d) return; update('frozen', () => renderFrozen(d.items)); reads.frozen.done(); }), link: s => link('frozen', s) });
  const changeAt = d => d?.source_at || d?.at;
  const rosterChanges = { phase: s => phase('changes', s), data: remember('changes', (d, meta) => {
    if (!d) return;
    update('changes', () => {
      const kind = meta.viewer?.kind || 'public';
      if (d.items == null || kind !== changeViewer || !changeAt(d) || changeAt(d) !== changeAt(changes) || changes?.next !== d.next) {
        changeRows = d.items; next = d.next;
      }
      changes = d; changeViewer = kind; renderChanges();
    });
    reads.changes.done();
  }), link: s => link('changes', s) };
  let overviewWatches = [], rosterMotion;
  function watchOverview() {
    for (const watch of overviewWatches) watch.stop();
    overviewWatches = [];
    if (frozenOnly) return;
    if (!p.has('fixture')) overviewWatches.push(window.Live.watch('projects', { state: 'active' }, activeRoster));
    overviewWatches.push(window.Live.watch('projects/changes', null, rosterChanges));
  }
  watchOverview();
  function switchRoster() {
    const nextView = readFrozenView();
    if (nextView === frozenOnly) return;
    frozenOnly = nextView;
    setRosterVisibility();
    for (const id of ['unpushed', 'recent-artifacts']) if (frozenOnly && $(id)) $(id).hidden = true;
    const overview = p.has('fixture') ? home : states.get('active')?.data;
    if (!frozenOnly && overview) renderOverview(overview);
    repaints.get('frozen')?.();
    renderHead();
    watchOverview();
    rosterMotion?.cancel();
    if (document.documentElement.classList.contains('mo-on')) {
      rosterMotion = $(frozenOnly ? 'frozen' : 'board').animate([{ opacity: .65, translate: '0 6px' }, { opacity: 1, translate: '0 0' }],
        { duration: 240, easing: 'ease-out' });
    }
  }
  // 两个名册地址共用同一页，只切页面内的视图，快速切换不用重启跨文档快照。
  for (const id of ['all-link', 'frozen-link']) $(id).addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (e.currentTarget.href === location.href) return;
    history.pushState(null, '', e.currentTarget.href);
    scrollTo({ top: 0, behavior: 'instant' });
    switchRoster();
  });
  addEventListener('popstate', switchRoster);
  $('next').addEventListener('click', async () => {
    if (!next) return; $('next').disabled = true;
    try {
      const cursor = next, source = changeAt(changes), s = await window.Live.get('projects/changes', { cursor });
      if (cursor !== next || source !== changeAt(changes)) return;
      if (s.data?.items && (s.meta.viewer?.kind || 'public') === changeViewer && source === changeAt(s.data) && s.data.next !== cursor) {
        U.anchor(() => { changeRows = [...new Map([...changeRows, ...s.data.items].map(it => [it.id, it])).values()]; next = s.data.next; renderChanges(); });
      } else { changesNote.hidden = false; U.html(changesNote, '下一页暂时读不到，已读到的留在这里。'); }
    } finally { $('next').disabled = false; }
  });
  window.LiveProjectLook?.load().then(data => {
    looks = data || {}; looksReady = true;
    for (const draw of repaints.values()) draw();
  });
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();
