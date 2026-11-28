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
      // 名字不公开的项目放项目页通用的那张画（没登记专门画的项目本来就用它），认不出是哪个项目，也不再是一块像没加载出来的空底（M1007）。
      const look = window.LiveProjectLook?.of(row.secret ? '' : row.project || row.key, looks);
      if (key === 'changes') return { ...row, band: band(look, row.href, 'pj-band--strip') };
      return { ...row, cls: `${row.cls} pj-card`, html: `${band(look, row.href, 'pj-band--card', true)}<div class="pj-card__body">${row.html}</div>` };
    });
  }
  function updateCutoff(key, data) {
    const section = $(key === 'changes' ? 'changes-footer' : key), at = stamp(data?.at);
    // 冻结名册的截至时刻跟着“冻结 N 个 ›”排在偶用那组下面、左边那几行字的右边；只看冻结的时候照旧写在名册底下
    const host = key === 'frozen' && !frozenOnly ? $('frozen-head') : section;
    const label = { active: '在用项目名册截止', frozen: '冻结项目名册截止', changes: '项目变化截止' }[key];
    const legacy = !at && isStale(data) && staleText(data);
    const merged = key === 'active' && !hero.hidden && Date.parse(data?.at) === Date.parse(home?.at);
    const text = at && !merged ? `${label.replace(/截止$/, '截至')} ${at}` : legacy ? `${label.replace(/截止$/, '')} · ${legacy}` : '';
    let note = section.querySelector('[data-source-cutoff]');
    if (!text) { note?.remove(); if (key !== 'changes') alignFrozen(); return; }
    if (!note) { note = document.createElement('p'); note.className = 'row__sub'; note.dataset.sourceCutoff = ''; }
    if (note.parentElement !== host) host.append(note);
    note.textContent = text;
    if (key !== 'changes') alignFrozen();
  }
  // “冻结 N 个 ›”和下面那行截至时刻往上提，和偶用那组最后的“展开（还有 N 条）”同一行起（没有展开就和“在用项目名册截至”同一行）；
  // 横着的位置在 index.html 里定（左边对齐第二列卡片，图5 那处）。那组点开了、或两行都没有，就在下面自成一行。提多少按当时版面量；高度至少垫到左边最后一行字底下，下面的近 30 天不会压上来，也不多空一截。
  function alignFrozen() {
    const head = $('frozen-head');
    head.style.marginTop = head.style.minHeight = '';
    if (frozenOnly || $('board').hidden || $('frozen').dataset.read || !head.querySelector(':scope > :not([hidden])')) return;
    const anchor = $('active-list').lastElementChild?.querySelector(':scope > .pj-step') || $('active').querySelector('[data-source-cutoff]');
    if (!anchor?.getClientRects().length) return;
    // 按排版位置量（offsetTop 一层层加），不受切换名册时那下 6 像素的动效位移影响
    const pageY = el => { let y = 0; for (let n = el; n; n = n.offsetParent) y += n.offsetTop; return y; };
    const lift = pageY(head) - pageY(anchor);
    if (lift <= 0) return;
    head.style.marginTop = `${-lift}px`;
    // 高度也按排版位置量：名册分批展开时那一组正带着位移动效，量屏幕位置会差出几百像素，冻结卡下面空一大块
    head.style.minHeight = `${Math.max(0, Math.round(pageY($('active')) + $('active').offsetHeight - pageY(anchor)))}px`;
  }
  if ('ResizeObserver' in window) new ResizeObserver(() => alignFrozen()).observe($('active'));
  let disconnected;
  const repaints = new Map(), remember = (key, draw) => (d, meta) => { repaints.set(key, () => draw(d, meta)); draw(d, meta); };
  let viewer = 'public', home = null, changes = null, changeRows = null, changeViewer = 'public', next = null;
  const homeRead = U.reading(hero.querySelector('.card__body'), { ghost: U.ghost.card(1), name: '项目' });
  const projectGhost = `<div class="pj-figs pj-grid-ghost">${Array.from({ length: 4 }, () => '<div class="pj-fig"><span class="pj-fig__k fog__text">正在读项目</span><span class="pj-fig__v fog__text">正在读这一项</span></div>').join('')}</div>`;
  const reads = Object.fromEntries(['active', 'frozen', 'changes'].map(key => [key, U.reading($(key), { ghost: key === 'changes' ? U.ghost.rows(4) : projectGhost, slow: key !== 'active' })]));
  // 冻结那组平常收在“冻结 N 个”按钮后面、没有自己的小标题：连不上又没存下来时不另写“这块没存下来”，
  // 不然紧接在“在用的”那句下面再写一遍，读着像同一句连写两遍（D6 复查）；列表那边同样不写
  const headerUpdating = s => s?.meta?.publicationRevoked && !s.offline;
  const phase = (key, s) => {
    if (s.data != null) return;
    if (key === 'home') {
      if (headerUpdating(s)) homeRead.done(false); else homeRead.set(s);
      if (p.has('fixture') && !frozenOnly) reads.active.set(s);
    } else if (key === 'frozen' && !frozenOnly && (s.offline || s.phase === 'gone')) reads.frozen.done();
    else reads[key].set(s);
  };
  const primed = new Set(), update = (key, paint) => { if (primed.has(key)) U.anchor(paint); else paint(); primed.add(key); };
  L.add(hero);
  const bar = U.topbar({ ask: () => `请看实况项目：${home?.text ? U.fieldText(home.text) : '请说明现在的情况'}。` });
  document.querySelectorAll('.stage a[href^="/live/"]').forEach(a => a.href = route(a.getAttribute('href')));
  document.querySelector('[data-back]').addEventListener('click', U.restoreBack);
  for (const key of ['active', 'frozen']) { U.fold($(`${key}-more`), $(`${key}-box`), null, true); $(`${key}-more`).addEventListener('click', () => foldLabel(key)); }
  // 分批展开（R97“逐步展开”、R147）：名册各组、冻结名册、全部变化的组和组里的行，先露一批，点“展开（还有 N …）”一次多露一批，露到底变“收起”。
  // 露到第几批按块记着（名册约每分钟重画、变化翻页后重画都照着露）；切时间档时全部变化从头露。
  const STEP = { active: 6, frozen: 6, changes: 5, artifacts: 3 }, MORE = { active: 6, frozen: 6, changes: 5, artifacts: 5, artcards: 6 }, GROUPS = { first: 5, more: 4 }, CARDS = 9;
  const reveals = { active: new Map(), frozen: new Map(), changes: new Map(), artifacts: new Map(), artcards: new Map() };
  let groupsShown = 0;
  const redraw = key => key === 'artifacts' || key === 'artcards' ? drawProjectExtras(lastOverview) : key === 'changes' ? renderChanges() : key === 'frozen' ? renderFrozen(states.get('frozen')?.data?.items) : renderActive(p.has('fixture') ? home?.items : states.get('active')?.data?.items);
  $('stage').addEventListener('click', e => {
    const b = e.target.closest('button.pj-step[data-step-of]');
    if (!b) return;
    const key = b.dataset.stepOf, map = reveals[key], label = b.dataset.step, close = b.hasAttribute('data-open');
    const paint = () => {
      map.set(label, close ? 0 : (map.get(label) || 0) + MORE[key]);
      redraw(key);
    };
    const find = () => [...document.querySelectorAll(`button.pj-step[data-step-of="${key}"]`)].find(x => x.dataset.step === label);
    if (close && !(key === 'active' && label === '个人')) U.anchorFold(b, paint, find);
    else if (close) {
      U.anchor(paint);
      const again = find();
      if (again && again.getBoundingClientRect().top < 0) again.scrollIntoView({ block: 'center' });
    }
    else U.anchor(paint);
  });
  $('changes-more').addEventListener('click', () => {
    const more = $('changes-more');
    if (more.getAttribute('aria-expanded') === 'true') U.anchorFold(more, () => { groupsShown = 0; renderChanges(); });
    else { groupsShown += GROUPS.more; U.anchor(renderChanges); }
  });
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
    L.tone(hero, source);
    const active = home?.active ?? activeRoster?.total, frozen = home?.frozen ?? frozenRoster?.total;
    const total = home?.total ?? activeRoster?.portfolio_total ?? frozenRoster?.portfolio_total
      ?? (Number.isFinite(active) && Number.isFinite(frozen) ? active + frozen : null);
    const privateSummary = home?.text && typeof home.text === 'object';
    const summary = privateSummary ? '' : sp(home?.text).split(' · ').filter(s => !/^数据截止\s/.test(s)).join(' · ');
    // 约法“全部项目”不含冻结：项目数只算在用的（日用、偶用），冻结的另写一句；文档、代码的字数和行数在下面那排，也只算在用的（本人 11-24 02:45 定的那一批）
    const size = activeRoster?.code_size, inUse = Number.isFinite(size?.active) ? size.active : active, cold = Number.isFinite(size?.frozen) ? size.frozen : frozen;
    const counts = [Number.isFinite(inUse) && `共 ${inUse} 个在用项目`, Number.isFinite(cold) && cold > 0 && `另有 ${cold} 个冻结，不算在内`].filter(Boolean).join(' · ');
    const text = frozenOnly ? Number.isFinite(frozenRoster?.total) ? `共 ${frozenRoster.total} 个冻结项目` : '冻结的项目'
      : Number.isFinite(inUse) ? counts : [Number.isFinite(total) && `共 ${total} 个项目`, summary].filter(Boolean).map(sp).join(' · ');
    const sourceAt = frozenOnly ? frozenRoster?.source_at ?? frozenRoster?.at : home?.source_at ?? home?.at
      ?? activeRoster?.at ?? frozenRoster?.at;
    const at = sourceAt && stamp(sourceAt), sameRoster = at && Date.parse(home?.at) === Date.parse(states.get('active')?.data?.at);
    const cutoff = at ? ` <span class="row__meta">${U.isStale(source) ? '上次项目汇总' : '项目汇总截至'} ${esc(at)}${sameRoster ? '（含在用名册）' : ''}</span>` : '';
    // 页头已写“项目汇总截至／上次项目汇总 …”时，状态说明里同一时刻的“最近一次记录于／数据截止 …”不再说第二遍（M746）
    const status = U.status(source, { cutoffShown: text => !!at && U.sameCutoffNote(U.fieldText(text), U.staleText({ stale: true }, sourceAt)) });
    const empty = U.offline?.() ? '这块没存下来，连上后补上。' : '项目暂时读不到';
    const title = headerUpdating(states.get('home')) ? '项目页头正在更新' : text || (privateSummary ? '项目' : empty);
    U.html($('head'), status.lamp + U.head(title, { lamp: false }) + cutoff + (status.note ? ` <span class="row__meta">${status.note}</span>` : '') + (!frozenOnly && privateSummary ? ` <span class="row__meta">${U.fieldHtml(home.text, { name: '项目说明', kind: viewer })}</span>` : ''));
  }
  let changesPack = null;
  let changesWidth;
  new ResizeObserver(([entry]) => {
    const width = entry.contentRect.width, resized = changesWidth && width !== changesWidth;
    changesWidth = width;
    if (width && resized && changesPack) renderChanges();
  }).observe($('changes-list'));
  function balancedChanges(rows) {
    const first = GROUPS.first, gap = 24;
    if (!U.shouldFold(rows.length - first)) return rows.length;
    // 在原有收着的第二张清单里量同栏宽的卡，不打断第一张清单的排版和动画。
    const probe = $('changes-rest');
    Object.assign(probe.style, { columns: 'auto', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' });
    U.list(probe, rows, { animate: false });
    const sizes = [...probe.children].map(card => card.offsetHeight + gap);
    U.list(probe, [], { animate: false });
    for (const prop of ['columns', 'display', 'grid-template-columns']) probe.style.removeProperty(prop);
    const heights = [0, 0];
    let cut = 0;
    for (const size of sizes) {
      const col = heights[0] <= heights[1] ? 0 : 1;
      const difference = heights[1 - col] - heights[col];
      if (cut >= first && Math.abs(difference - size) >= difference) break;
      heights[col] += size;
      cut++;
    }
    return U.shouldFold(rows.length - cut) ? cut : rows.length;
  }
  function fill(key, rows, none) {
    if (rows == null) { rows = []; none = U.offline?.() ? (key === 'frozen' && !frozenOnly ? '' : '这块没存下来，连上后补上。') : `${({ active: '在用的项目', frozen: '冻结的项目', changes: '项目变化' })[key]}暂时读不到`; $(`${key}`).style.minHeight = '0'; }
    rows = withLook(key, rows);
    const total = rows.length;
    if (key !== 'frozen' || rows.length > STEP.frozen) rows = groupedRows(rows, key);
    const first = key === 'changes' ? balancedChanges(rows) : key === 'frozen' && !frozenOnly ? 0 : Infinity;
    const limit = first + groupsShown, n = key !== 'changes' ? first : U.shouldFold(rows.length - limit) ? limit : rows.length;
    U.list($(`${key}-list`), rows.length ? rows.slice(0, n) : none ? [empty(none, key !== 'changes')] : []); U.list($(`${key}-rest`), key === 'changes' ? [] : rows.slice(n));
    watchBands($(key));
    // 项目变化：先列的几组和展开后的其余几组接着排两栏，展开后不在两块之间空一截（M486/M487）
    if (key === 'changes') (changesPack ||= window.LivePack.create([$('changes-list'), $('changes-rest')], { cols: 2, gap: 24 })).fit();
    if (key === 'changes') {
      // 先露到两栏尽量齐平，点一次再露 4 组，露到底变“收起”。
      const more = $('changes-more'), left = Math.max(0, rows.length - n);
      more.hidden = rows.length <= first; more.setAttribute('aria-expanded', String(!left));
      U.html(more, `${left ? `展开（还有 ${left} 个项目组）` : '收起'} <span class="more__chev">›</span>`);
    } else { $(`${key}-more`).hidden = rows.length <= n; foldLabel(key, key === 'frozen' ? total : Math.max(0, rows.length - n)); }
    L.lightUp([hero, $('board'), $('notices')]);
  }
  function groupedRows(rows, key) {
    const groups = new Map(), cls = key === 'changes' ? 'rows list' : 'pj-figs';
    for (const row of rows) { const label = row.group || ''; if (!groups.has(label)) groups.set(label, []); groups.get(label).push(row); }
    const list = items => `<ul class="${cls}">${items.map(r => `<li class="${r.cls}" data-key="${esc(r.key)}">${r.html}</li>`).join('')}</ul>`;
    return [...groups].map(([label, items]) => {
      const first = items[0], title = key === 'changes' ? name({ name: first.groupLabel, href: first.href }, changeViewer) : U.fieldHtml(first.groupLabel ?? label, { name: '项目分类', kind: viewer });
      // 名册排三列，先露两整排、点一次再露两排；变化每组先 5 条、点一次再 5 条
      const extra = Math.max(0, items.length - STEP[key]), reveal = Math.min(extra, reveals[key].get(label) || 0);
      const personal = key === 'active' && label === '个人';
      const fold = personal ? extra > 0 : U.shouldFold(extra);
      const open = (personal || U.shouldFold(extra - reveal)) && fold ? reveal : extra, left = extra - open;
      const step = fold ? `<button class="more pj-step" type="button" data-step-of="${key}" data-step="${esc(label)}"${left ? '' : ' data-open'}>${left ? `展开（还有 ${left} 条）` : '收起'} <span class="more__chev">›</span></button>` : '';
      return { key: `group:${label}`, cls: 'pj-list-group', html: `${key === 'changes' ? first.band || '' : ''}${label ? `<p class="part">${title}</p>` : ''}${list(items.slice(0, STEP[key] + open))}${step}` };
    });
  }
  // M767：本人版里访客看不到的项目（后台标 visitor_labels.name=hidden），名字旁挂“访客看不到”；访客版只挂其中的“对外换了说法”（M930），没标的不挂
  const projectTag = (it, kind = viewer) => U.visitorLabel(it, ['$', 'name'], '这个项目', kind);
  const name = (it, kind = viewer) => { const field = it.name || it.label || '', hidden = kind === 'public' && (field?.hidden || field?.visibility === 'owner' || field?.public === 'owner'), text = U.fieldHtml(field, { name: '项目', place: 'label', kind }), note = (hidden ? U.fieldHtml(field, { name: '项目名', kind }) : U.visibilityNote(it, kind, it.hidden_what || '这个项目')) || projectTag(it, kind); return (it.href ? `<a class="row__title" href="${esc(route(it.href))}">${text} <span class="more__chev">›</span></a>` : `<span class="row__title">${text}</span>`) + (note ? `<span class="row__meta">${note}</span>` : ''); };
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
  function newProjectLabel(it) { return it.new === true ? '<span class="tag tag--new">新项目</span> ' : ''; }
  // 名册按组排：日用、个人（带 group: "personal" 的在用项目，本人 11-27 批准）、偶用，读不到分档的放最后；组内照旧按最近改动
  const PHASE_GROUPS = { daily: '日用', personal: '个人', occasional: '偶用' };
  const groupOf = it => it.group === 'personal' && it.phase !== 'archived' ? 'personal' : it.phase;
  const groupRank = it => { const i = Object.keys(PHASE_GROUPS).indexOf(groupOf(it)); return i < 0 ? 9 : i; };
  function renderActive(items) {
    fill('active', items?.filter(it => it.name || it.label).sort((a, b) => groupRank(a) - groupRank(b) || (Date.parse(b.changed?.at) || 0) - (Date.parse(a.changed?.at) || 0)).map(it => {
      const status = U.status(it, { small: true }), phase = it.phase === 'archived' ? '冻结' : it.phase_gap;
      const text = String(headline(it, false)).trim(), hidden = viewer === 'public' && (it.name?.hidden || it.name?.visibility === 'owner' || it.name?.public === 'owner');
      const shown = newProjectLabel(it) + U.fieldHtml(it.name || it.label || it.title || it.id, { name: '项目', place: 'label', kind: viewer })
        .replace(/名册(?![^<>]*>)/g, '<span style="white-space:nowrap">$&</span>');
      const note = (hidden ? U.fieldHtml(it.name, { name: '项目名', kind: viewer }) : U.visibilityNote(it, viewer, it.hidden_what || '这个项目')) || projectTag(it);
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
      // 说明里的日期连成一段，折行时不拆成“2026-11-／24”（只动标签外面的字）
      const keepDates = html => html.replace(/(^|>)([^<]+)/g, (m, a, t) => a + t.replace(/\d{4}-\d{2}-\d{2}|\d{1,2}-\d{2}(?:\s+\d{1,2}:\d{2})?/g, '<span class="live-unit">$&</span>'));
      const scopeHtml = scope ? `<small class="pj-fig__sub pj-fig__scope" title="${esc(typeof scope === 'string' ? scope : '')}">${keepDates(U.fieldHtml(scope, { name: '项目说明', kind: viewer }))}</small>` : '';
      // 代表数的时刻是“这件事最后一次发生”的：写那一句，不写“读取于”（M769）
      const moment = !marked && window.LiveProjectMoments?.headline(it);
      const readAt = moment ? `<small class="pj-fig__sub">${esc(moment)}</small>`
        : observed && observed !== through && !marked && !text.includes(observed) && !(typeof scope === 'string' && scope.includes(observed)) ? `<small class="pj-fig__sub">读取于 ${esc(observed)}</small>` : '';
      const labelHidden = viewer === 'public' && labelBody.includes('live-mark--owner') && (label?.hidden || label?.visibility === 'owner' || label?.public === 'owner' || /^〔?[^〔〕<>]*(?:仅本人可见|可信设备可见)〕?$/.test(labelHtml.trim()));
      // AI 百工谱的读数是现役规则版本号（E 加数字）：读数名和版本号点了去规则页，名字后带箭头，和项目页能点的读数一个样子（本人 11-24 13:00）
      const rule = it.id === 'agents' && h?.id === 'release' && !marked && /^E\d+$/.test(text);
      const labelLine = label && !labelHidden ? `<small class="pj-fig__sub" title="${esc(typeof label === 'string' ? label : '')}">${rule ? `<a class="row__title" href="/rules/">${labelHtml} <span class="more__chev">›</span></a>` : labelHtml}</small>` : '';
      const labelMark = labelBody !== labelHtml ? `<small class="pj-fig__mark">${labelBody}</small>` : '';
      const valueLine = rule ? `<a class="pj-fig__link pj-fig__v" title="${esc(text)}" href="/rules/">${valueHtml}</a>`
        : `<span class="pj-fig__v${/还没读到|还在采集|开始记|没有记录/.test(text) ? ' row__sub' : ''}${[...text].length > 11 ? ' is-long' : ''}" title="${esc(marked ? '' : text)}">${valueHtml}</span>`;
      const reading = (hasText ? labelLine + labelMark + valueLine : '') + (hasText || through ? scopeHtml + readAt : '');
      return { key: it.id, href: it.href, secret: hidden, group: PHASE_GROUPS[groupOf(it)] || '未分档', cls: 'pj-fig', html: `${status.lamp}${it.href ? `<a class="pj-fig__link" title="${esc(it.name || it.label || it.title || it.id)}" href="${esc(route(it.href))}">${shown} ›</a>` : `<span class="pj-fig__k">${shown}</span>`}${reading}${hasText && window.LiveProjectViz.lower(h, 'value') && window.LiveProjectViz.gap(h) ? `<small class="pj-fig__sub">${U.fieldHtml(window.LiveProjectViz.gap(h), { name: '读数说明', kind: viewer })}</small>` : ''}${recent(it)}${phase ? `<small class="pj-fig__sub">${U.fieldHtml(phase, { name: '项目分档', kind: viewer })}</small>` : ''}${status.note ? `<small class="pj-fig__sub">${status.note}</small>` : ''}${note ? `<small class="pj-fig__mark">${note}</small>` : ''}` };
    }), '没有在用的项目');
  }
  function shortText(value, { keepChangeWords = false, ...options }) {
    const html = U.fieldHtml(value, options), plain = U.fieldText(value, options.kind);
    const full = keepChangeWords
      ? html.replace(/<[^>]+>|一次|讲解页|收工|补跑一轮/g, word => word.startsWith('<') ? word : `<span class="pj-change-word">${word}</span>`)
      : html;
    const first = plain.match(/^[^。！？\n]*[。！？]?/)?.[0] || plain;
    const preview = keepChangeWords ? first : [...first].slice(0, 80).join('');
    if (preview === plain) return full;
    return `<details class="pj-short" data-fold-anchor><summary><span>${esc(preview)}${preview.length < first.length ? '…' : ''}</span><span class="more"><span class="disclosure-closed">展开全文</span><span class="disclosure-open">收起全文</span> <span class="more__chev" aria-hidden="true">›</span></span></summary><div class="row__sub">${full}</div></details>`;
  }
  function renderFrozen(items) {
    fill('frozen', items?.filter(it => it.name || it.label).map(it => {
      const status = U.status(it, { small: true }), phase = { daily: '日用', occasional: '偶用', archived: '冻结' }[it.phase] || it.phase_gap;
      const detail = [phase && !(frozenOnly && it.phase === 'archived') && U.fieldHtml(phase, { name: '项目分档', kind: viewer }), it.reason && shortText(it.reason, { name: '冻结原因', kind: viewer }), status.note]
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
    html: `<div class="row__text"><div class="row__sub">${shortText(typeof it.text === 'string' ? display(it.text) : it.text || (U.offline?.() ? '' : '变化内容暂时读不到'), { name: '项目变化', kind: changeViewer, keepChangeWords: true })}</div></div><span class="pj-at">${it.at ? stamp(it.at) : ''}</span>` });
  // 全部变化、成品两块标题右边一排“近 7 天｜近 30 天｜全部”，默认近 7 天（本人 11-24 20:34）；样子和智能体页工期、工作量、钩子那三排一样（index.html 的 .pj-tseg）。
  // 近 7 天照旧用变化接口和名册送来的那份；近 30 天、全部点了才读 projects/changes?range=、projects/artifacts?range=（翻页同样带 cursor）。
  // 回包里 range 和点的那档对得上才用；后台还没给就写“后台还没送来”，不拿近 7 天的数顶上。
  const RANGES = [['7d', '近 7 天'], ['30d', '近 30 天'], ['all', '全部']], rangeLabel = id => RANGES.find(r => r[0] === id)?.[1] || '';
  const rangeSeg = key => `<span class="tp-seg pj-tseg" role="group" aria-label="看哪一段">${RANGES.map(([id, label]) => `<button type="button" data-range-of="${key}" data-range="${id}" aria-pressed="${id === '7d'}">${label}</button>`).join('')}</span>`;
  const pick = { changes: '7d', artifacts: '7d' }, ranged = { changes: {}, artifacts: {} };
  const rangeWord = (key, range, state) => { const what = `${range === 'all' ? '全部时间' : rangeLabel(range)}的${key === 'changes' ? '变化' : '成品'}`;
    return state === 'loading' ? `正在读${what}…` : `${what}后台还没送来，先看“近 7 天”。`; };
  // 切档等数时，上一份画好的照旧留在页上，标“加载中 · 下面先留着近 7 天的”；同一档重读写“正在刷新”（页面说明：切换立即标亮，加载旧行保留并标当前读数范围）
  const shown = { changes: null, artifacts: null };
  const waitingNote = (key, range, kept) => kept.range === range ? '正在刷新' : `加载中 · 下面先留着${rangeLabel(kept.range)}的${key === 'changes' ? '变化' : '成品'}`;
  async function loadRange(key, range) {
    const had = ranged[key][range]?.state, prev = had === 'ok' ? ranged[key][range] : ranged[key][range]?.prev;
    if (had !== 'loading') ranged[key][range] = { state: 'loading', prev };
    drawRange(key);
    if (had === 'loading') return;
    let s = null;
    try { s = await window.Live.get(key === 'changes' ? 'projects/changes' : 'projects/artifacts', { range }); } catch { /* 读不到按还没送来写 */ }
    const d = s?.data;
    ranged[key][range] = d && Array.isArray(d.items) && d.range === range ? { state: 'ok', data: d, rows: d.items, next: d.next || null } : prev || { state: 'missing' };
    if (pick[key] === range) drawRange(key);
  }
  // 后台有了新的一份（近 7 天那份换了时刻）：近 30 天、全部存着的旧档作废，正看着的那档重读一次，读到前旧行照留（P5 那版拉过一次就一直用旧的）
  function refreshRanges(key) {
    for (const range of Object.keys(ranged[key])) if (range !== pick[key] && ranged[key][range]?.state !== 'loading') delete ranged[key][range];
    if (pick[key] !== '7d' && ranged[key][pick[key]]?.state === 'ok') loadRange(key, pick[key]);
  }
  let lastOverview = null;
  function drawRange(key) { if (key === 'changes') renderChanges(); else drawProjectExtras(lastOverview); }
  const changesHeading = $('changes').querySelector('.part');
  const changesTitle = changesHeading.firstChild;
  changesHeading.insertAdjacentHTML('beforeend', rangeSeg('changes'));
  // 切时间档还在加载时，“加载中 · 下面先留着…”写在时间按钮下面、列表上面（和成品那块同一个位置），点了马上看得到
  const changesWaiting = document.createElement('p'); changesWaiting.className = 'pj-extra__note'; changesWaiting.hidden = true; $('changes').querySelector('.part').after(changesWaiting);
  document.addEventListener('click', e => {
    const button = e.target.closest('[data-range-of]');
    if (!button) return;
    const key = button.dataset.rangeOf, range = button.dataset.range;
    for (const b of document.querySelectorAll(`[data-range-of="${key}"]`)) b.setAttribute('aria-pressed', String(b === button));
    if (pick[key] === range) return;
    pick[key] = range;
    if (key === 'changes') { groupsShown = 0; reveals.changes.clear(); }   // 换了时间档，从头一批批露
    else { reveals.artifacts.clear(); reveals.artcards.clear(); }
    if (range === '7d' || ranged[key][range]?.state === 'ok') drawRange(key); else loadRange(key, range);
  });
  function renderChanges() {
    const picked = pick.changes, mine = picked === '7d' ? { data: changes, rows: changeRows, next } : ranged.changes[picked] || { state: 'loading' };
    const kept = mine.state === 'loading' && (mine.prev ? { range: picked, own: mine.prev } : shown.changes);
    const range = kept ? kept.range : picked, own = kept ? kept.own : mine;
    if (!kept && own.state !== 'loading' && own.state !== 'missing' && own.rows) shown.changes = { range, own };
    const roster = p.has('fixture') ? home?.items || [] : ['active', 'frozen'].flatMap(key => {
      const state = states.get(key);
      return state?.viewer?.kind === changeViewer ? state.data?.items || [] : [];
    });
    const projects = new Map(roster.map(it => [it.id, it]));
    const rows = own.rows?.map(it => ({ ...it, name: it.name || projects.get(it.project)?.name || '项目变化', href: it.href || projects.get(it.project)?.href }));
    const data = own.data;
    const partial = data?.q === 'partial' || Array.isArray(data?.partial) && data.partial.includes('total');
    const gap = data?.gap && (partial || isStale(data)) ? U.fieldHtml(data.gap, { kind: changeViewer }) : '';
    const lastFull = !partial && (isStale(data) || U.offline?.()) && Number.isInteger(data?.total)
      && Number.isFinite(Date.parse(data?.source_at)) && stamp(data.source_at).slice(-11);
    changesTitle.textContent = partial ? '已读到的变化' : '全部变化';
    const hidden = data?.hidden;   // 两版同一套（本人禁令 11-24 14:16）：没列出的条数两版都写
    const quiet = { '7d': '近 7 天没有实质变化', '30d': '近 30 天没有实质变化', all: '还没有记下实质变化' }[range];
    if (['loading', 'missing'].includes(own.state)) fill('changes', [], rangeWord('changes', range, own.state));
    else fill('changes', rows?.filter(it => it.name).map(changeRow), hidden || partial || gap ? '' : quiet);
    // 读到的项目组都露完了才出“更多变化 ›”接着读（和成品那块“更多成品 ›”一样）
    const groupsLeft = !$('changes-more').hidden && $('changes-more').getAttribute('aria-expanded') !== 'true';
    $('next').hidden = !!kept || !own.next || groupsLeft;
    // 近 30 天、全部的头一页和近 7 天一样从最新的排起：写清这一档一共几条、列了几条，看得出点了哪档（和成品那块“已列出 N 件，近 30 天共 M 件”一样）
    const listed = own.rows?.length || 0, count = !partial && range !== '7d' && own.state === 'ok' && Number.isInteger(data?.total) && data.total > listed
      ? `已列出 ${listed} 条，${rangeLabel(range)}共 ${data.total.toLocaleString('zh-CN')} 条` : '';
    const waiting = kept ? waitingNote('changes', picked, kept) : '';
    changesWaiting.hidden = !waiting; U.html(changesWaiting, waiting);
    const note = [lastFull ? `这是 ${esc(lastFull)} 读全的那一批` : gap, hidden && `另有 ${esc(hidden)} 个${esc(data.hidden_what || '项目变化')}没列在这里`, count].filter(Boolean).join(' · ');
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
    const notice = [...states].find(([name, x]) => x.offline || (!(name === 'home' && headerUpdating(x)) && !x.data && !x.warming && x.text && (x.text !== '没有记录' || s.conn?.stage !== 'retrying')));
    const connection = notice?.[1].offline ? notice[1].text.split(' · ')[0] : notice?.[1].text;
    U.list($('notices'), notice ? [{ key: notice[0], cls: 'notice glass', html: `<span>${U.fieldHtml(connection, { name: '连接情况', kind: viewer })}</span>` }] : []);
    if (!s.data && ['none', 'gone'].includes(s.phase)) { if (key === 'home' || key === 'active') renderOverview(states.get('active')?.data || home); if (key === 'changes') { changes = changeRows = next = null; renderChanges(); } if (key === 'active') renderActive(null); else if (!['home', 'changes'].includes(key)) fill(key, null); }
    const fallback = s.fallbackNote || s.meta?.fallbackNote || '';
    const fallbackNote = /^数据截止\s/.test(fallback) && (key === 'home' ? s.shownAt : s.data?.at) ? '' : fallback;
    U.blockNote(key === 'home' ? hero.querySelector('.card__body') : $(key), { fallbackNote: key === 'home' && fallbackNote ? `页头 · ${fallbackNote}` : fallbackNote });
  }
  // 近 30 天项目活跃：左右两半所有项目一次列全，不折（本人 11-26 19:38 选“全列不折”：要不要展开是审美，这张图本来就好看）。
  // 热图本身是共用的 live-project-viz.js，不动它；时间轴、图例和点格子照旧。
  function renderActivity(data, roster) {
    // 项目行和上面画册卡同一个顺序：最近一次改动在前（主持 11-26 10:3x 定，照同页已有顺序）
    const changedAt = new Map((roster || []).map(it => [it.id, Date.parse(it.changed?.at) || 0]));
    const host = $('activity-chart'), rows = (data?.items || []).map((r, i) => [r, i]).sort(([a, i], [b, j]) => (changedAt.get(b.id) ?? -1) - (changedAt.get(a.id) ?? -1) || i - j).map(([r]) => r);
    if (!data || rows.length < 2 || U.offline?.() && !rows.some(r => r.commits?.some(Number.isFinite))) {
      window.LiveProjectViz.heatmap(host, data, viewer, route); return;
    }
    const days = data.days || [], first = days.findIndex((_, i) => rows.some(r => Number.isFinite(r.commits?.[i]))), start = first < 0 ? days.length : first;
    host.innerHTML = '<div class="pj-heat-halves"><div></div><div></div></div><div class="pj-heat-footer"></div>';
    // 左半是排在前面的一半，右半接着往下排
    const halves = [...host.firstElementChild.children], midpoint = Math.ceil(rows.length / 2);
    halves.forEach((half, i) => window.LiveProjectViz.heatmap(half, { ...data, days: days.slice(start), items: (i ? rows.slice(midpoint) : rows.slice(0, midpoint)).map(r => ({ ...r, commits: r.commits?.slice(start) })) }, viewer, route, { aligned: true }));
    const footer = host.lastElementChild;
    footer.append(...[...halves[0].children].slice(1));
    [...halves[1].children].slice(1).forEach(el => el.remove());
    // 两半各自管点格子（heatmap 里已接好）；整块只留一格选中：点了这半的格子，另一半选着的那格取消。
    // 原来在整块上再接一遍 bindHeat，点右半的格子时左半同一位置会多冒一个读数小条。
    halves.forEach((half, i) => half.addEventListener('click', e => { if (e.isTrusted && e.target.closest('button.pj-heat-cell')) halves[1 - i].querySelector('button.pj-heat-cell.is-picked')?.click(); }));
  }
  let extraLanded = false;
  function renderOverview(d) {
    if (frozenOnly) return;
    const fresh = lastOverview && d?.recent_artifacts?.at !== lastOverview.recent_artifacts?.at;
    lastOverview = d; drawProjectExtras(d);
    if (fresh) refreshRanges('artifacts');
    const target = /^#(?:unpushed|recent-artifacts)$/.test(location.hash) && $(location.hash.slice(1));
    if (!extraLanded && target && !target.hidden) {
      extraLanded = true;
      requestAnimationFrame(() => target.scrollIntoView());
    }
    // 文档字数、代码行数和代码字数用 code_size（数据约定第 10 节：同一份只算在用项目的合计）；它还没出数的那几项照旧用 summary
    const size = d?.code_size && Object.fromEntries(['docs_chars', 'code_lines', 'code_chars', 'observed_code_chars', 'covered', 'active'].filter(k => Number.isFinite(d.code_size[k])).map(k => [k, d.code_size[k]]));
    const sizeDate = ['docs_chars', 'code_lines', 'code_chars', 'observed_code_chars'].some(k => Number.isFinite(size?.[k])) ? stamp(d.code_size.date) : '';
    window.LiveProjectViz.summary($('pj-summary'), d?.summary && size ? { ...d.summary, ...size } : d?.summary, viewer, sizeDate); renderActivity(d?.activity, d?.items);
    if (!U.offline?.() && !d?.summary) U.html($('pj-summary'), '<span class="pj-summary-none">近 7 天、文档、代码暂时读不到</span>');
    $('activity').querySelector('.part').hidden = !U.offline?.() && !d?.activity;
    if (!U.offline?.() && !d?.activity) U.html($('activity-chart'), '<p class="pj-note">近 30 天项目活跃暂时读不到</p>');

  }
  // 下面两块（本地还没推的改动、成品）和上面画册一套：大标题加绿条，白卡、深色正文，配项目小图。
  const secretName = (field, kind = viewer) => kind === 'public' && !!field && typeof field === 'object' && !!(field.hidden || field.hidden_block || field.visibility === 'owner' || field.public === 'owner' || field.visibility === 'pending' || field.rewrite === 'pending');
  // 项目小图：名字不公开的放通用的那张画，认不出是哪个项目（M1007，和画册卡同一张）；外观表没到先铺占位色。
  function miniPic(id, nameField, kind = viewer) {
    const secret = !id || secretName(nameField, kind), look = window.LiveProjectLook?.of(secret ? '' : id, looks);
    const ready = looksReady && look, bg = ready ? `linear-gradient(135deg,${look.glow[0]},${look.glow[1]})` : 'linear-gradient(135deg,#f1ece2,#ebe8f0)';
    return `<span class="pj-mini__pic" style="background:${bg}" aria-hidden="true">${ready ? lazyImg(look.thumb, 160) : ''}</span>`;
  }
  function drawProjectExtras(d) {
    const field = v => U.fieldHtml(v, { kind: viewer });
    const section = (id, title, rows, note = '', rest = []) => {
      let box = $(id);
      if (!rows.length && !note) { if (box) box.hidden = true; return; }
      if (!box) {
        box = document.createElement('section'); box.id = id; box.className = `pj-sec pj-extra pj-extra--${id}`;
        box.innerHTML = '<p class="part"><span></span></p><p class="pj-extra__note" data-extra-note></p><ul class="pj-extra__list"></ul><details class="pj-extra__more"><summary class="live-disclosure"><span class="disclosure-closed"></span><span class="disclosure-open">收起</span><span class="disclosure-chev">›</span></summary><ul class="pj-extra__list" data-extra-rest></ul></details>';
        if (id === 'recent-artifacts') {
          box.querySelector('.part').insertAdjacentHTML('beforeend', rangeSeg('artifacts'));
          for (const b of box.querySelectorAll('[data-range-of]')) b.setAttribute('aria-pressed', String(b.dataset.range === pick.artifacts));
          // 近 30 天、全部一页读不完时接着翻（和全部变化的“更多变化 ›”一样）
          box.insertAdjacentHTML('beforeend', '<button class="more pj-extra__next" id="artifacts-next" type="button" hidden>更多成品 ›</button>');
          box.querySelector('#artifacts-next').addEventListener('click', e => moreArtifacts(e.currentTarget));
        }
        // 顺序：近 30 天项目活跃 → 全部变化 → 本地还没推的改动 → 成品（本人 11-24 20:34，汇报页选 A）
        (id === 'recent-artifacts' && $('unpushed') || $('changes')).after(box);
      }
      box.hidden = frozenOnly; box.querySelector('.part > span').textContent = title;
      U.list(box.querySelector('ul'), rows); U.html(box.querySelector('[data-extra-note]'), note);
      const more = box.querySelector('.pj-extra__more');
      more.hidden = !rest.length; more.querySelector('.disclosure-closed').textContent = `再看 ${rest.length} 个项目`;
      U.list(box.querySelector('[data-extra-rest]'), rest);
      // 最近成品：卡按顺序放进最矮的一栏，“再看几个项目”展开后接着排（M487，共用 LivePack）
      if (id === 'recent-artifacts') (box.pack ||= window.LivePack.create([...box.querySelectorAll('.pj-extra__list')], { min: 330, gap: 24 })).fit();
      watchBands(box);
    };
    const range = pick.artifacts, own = ranged.artifacts[range] || { state: 'loading' };
    // 名册到了却没带成品这一块：写“成品暂时读不到”，不整块消失（页面说明第 12 条）
    const asRecent = (r, o) => r === '7d' ? d?.recent_artifacts || (d && !U.offline?.() ? { state: 'unread' } : undefined) : o.state === 'ok' ? { ...o.data, items: o.rows, next: o.next, page_gap: o.pageGap } : { state: o.state };
    const kept = range !== '7d' && own.state === 'loading' && (own.prev ? { range, recent: asRecent(range, own.prev) } : shown.artifacts);
    let recent = kept ? { ...kept.recent, range: kept.range, waiting: waitingNote('artifacts', range, kept) } : asRecent(range, own);
    if (!kept && recent && !recent.state) shown.artifacts = { range, recent };
    drawUnpushed(d?.unpushed, section, field); drawRecentArtifacts(recent && { range, ...recent }, section, field, viewer, d?.items);
  }
  async function moreArtifacts(button) {
    const range = pick.artifacts, own = ranged.artifacts[range];
    if (!own?.next) return;
    const label = button.textContent;
    button.disabled = true; button.textContent = '正在读…';
    try {
      const cursor = own.next, s = await window.Live.get('projects/artifacts', { range, cursor });
      if (cursor !== own.next || ranged.artifacts[range] !== own) return;
      if (s.data?.items && s.data.range === range && s.data.next !== cursor) { own.rows = [...own.rows, ...s.data.items]; own.next = s.data.next || null; own.pageGap = ''; reveals.artcards.set('', (reveals.artcards.get('') || 0) + MORE.artcards); }   // 新读到的接着露一批
      else own.pageGap = '下一页暂时读不到，已读到的留在这里。';
      if (pick.artifacts === range) U.anchor(() => drawProjectExtras(lastOverview));
    } finally { button.disabled = false; button.textContent = label; }
  }
  function drawUnpushed(unpushed, section, field) {
    // 有没推提交的排前面、放大；零值不写，只写有的。
    const items = (unpushed?.items || []).filter(it => it.commits > 0 || it.files > 0)
      .sort((a, b) => (b.commits > 0) - (a.commits > 0) || (b.commits || 0) - (a.commits || 0) || (b.files || 0) - (a.files || 0));
    const rows = items.map(it => {
      const seconds = it.age_seconds, mins = Math.floor(seconds / 60), remainder = seconds % 60;
      const age = Number.isInteger(seconds) && seconds >= 0 && (mins < 60 && remainder ? [mins && `${mins} 分`, `${remainder} 秒`].filter(Boolean).join(' ') : U.minutes(Math.round(seconds / 60)));
      const hot = it.commits > 0;
      const words = [it.files > 0 && `${it.files} 个文件没提交`, age && `已放 ${age}`, it.local_only === true && '按你说的只留本地', it.note && it.note !== '按你说的只留本地' && field(it.note)].filter(Boolean);
      const lead = hot ? `<p class="pj-mini__big"><b>${esc(it.commits)}</b> 个提交没推</p>` : '';
      return { key: it.id, cls: `pj-mini${hot ? ' is-hot' : ''}`, html: `${miniPic(it.id, it.name)}<div class="pj-mini__text"><p class="pj-mini__name">${field(it.name)}${projectTag(it) ? ` ${projectTag(it)}` : ''}</p>${lead}${words.length ? `<p class="pj-mini__sub">${words.join(' · ')}</p>` : ''}</div>` };
    });
    // 多了才分批（R147、X4 第 111 项）：一排四格，有没推提交的大卡占两格、排在前面；先露两排（八格），点“展开（还有 N 个项目）”再露两排，到底变“收起”。两排放得下就不出按钮，样子照旧。
    const UNITS = 8, units = it => it.commits > 0 ? 2 : 1, total = items.reduce((n, it) => n + units(it), 0);
    const shown = total <= UNITS ? UNITS : Number($('unpushed')?.dataset.shown) || UNITS;
    let first = 0, cut = 0;
    for (let used = 0; cut < items.length && used + units(items[cut]) <= shown; cut++) {
      used += units(items[cut]);
      if (used <= UNITS) first++;
    }
    const fold = U.shouldFold(items.length - first);
    if (!U.shouldFold(items.length - cut)) cut = items.length;
    // 读不到和真没有分开（页面说明第 12 条）：名册到了、这一块没给或标了读不到，又一项改动都没读到，就写“本地改动暂时读不到”和后台给的原因；真没有改动不留空卡
    const unread = !items.length && (!unpushed || unpushed.q === 'unknown' || unpushed.q === 'error' || isStale(unpushed) || !Array.isArray(unpushed.items)) && !U.offline?.();
    const note = unread ? ['本地改动暂时读不到', unpushed?.gap && field(unpushed.gap), unpushed?.at && `上次读到 ${stamp(unpushed.at)}`].filter(Boolean).join(' · ')
      : unpushed?.items?.length ? [unpushed.at && `数据截至 ${stamp(unpushed.at)}`, unpushed.gap && field(unpushed.gap)].filter(Boolean).join(' · ') : '';
    section('unpushed', '本地还没推的改动', rows.slice(0, Math.max(cut, 1)), note);
    const box = $('unpushed');
    if (!box) return;
    box.dataset.shown = fold ? shown : UNITS;
    let more = box.querySelector(':scope > .pj-unpushed-more');
    if (!fold) { more?.remove(); return; }
    if (!more) {
      more = document.createElement('button'); more.type = 'button'; more.className = 'more pj-unpushed-more';
      more.addEventListener('click', () => {
        const close = more.getAttribute('aria-expanded') === 'true';
        const paint = () => { box.dataset.shown = close ? UNITS : Number(box.dataset.shown) + UNITS; box.redrawUnpushed(); };
        if (close) U.anchorFold(more, paint);
        else paint();
      });
    }
    box.redrawUnpushed = () => drawUnpushed(unpushed, section, field);
    box.querySelector(':scope > .pj-extra__list').after(more);
    const left = items.length - Math.max(cut, 1);
    more.setAttribute('aria-expanded', String(!left));
    U.html(more, `${left ? `展开（还有 ${left} 个项目）` : '收起'} <span class="more__chev">›</span>`);
  }
  function drawRecentArtifacts(recent, section, field, audience = 'public', roster = []) {
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
        sub = it.recent_detail ? field(it.recent_detail) : '';   // 没写说明就不写这一行，不再补兜底句
        const publicLink = audience === 'public' && typeof it.open === 'string' && !it.web_open ? { href: it.open, label: '打开成品' } : it.web_open;
        open = U.artifactAction({ ...it, web_open: publicLink }, audience, route);
        // 新私事规则：登记时填了 open_note（“这里是这份材料的正文（8 页），所以不予展示”）的成品，访客版在打开链接的位置显示这句普通字；本人版照给链接，旁边挂签。
        // M684：访客那边正文看不到，挂“访客看不到”；后台给了 visitor_labels.open 时照它挂哪种。成品名称按 visitor_labels.title 挂在名称后面，改了名字的挂“对外换了说法”。
        const openNote = U.fieldText(it.open_note, audience).trim();
        // 两版同一套：访客版正文那句照写，打开按钮也照摆，不再让那句把按钮压掉
        if (openNote && audience === 'public') item = { ...item, openNote };
        else if (audience === 'owner') {
          // 整条访客看不到的成品只在名称旁挂一个“访客看不到”，“在电脑上打开”旁不再重复挂（LOOKS1126 ②，全站同一个口径）
          const whole = U.visitorWholeHidden(it, ['$']);
          const ownerNote = whole ? '' : U.visitorLabel(it, 'open', '这份成品的正文', audience) || (openNote ? U.visitorHiddenTag('这份成品的正文', `访客版在打开链接的位置写：${openNote}`, audience) : '');
          if (ownerNote) item = { ...item, ownerNote };
          const renamed = typeof it.public_title === 'string' && it.public_title.trim() && it.public_title.trim() !== U.fieldText(raw, audience).trim();
          // 整条只给本人的成品（visibility: 'owner'，或后台标了整块 hidden）：名称后挂“访客看不到”，点开写访客版看不到这份成品的标题和内容
          const wholeTag = whole ? U.visitorHiddenMark(it, '这份成品', audience, { keys: ['$'] }) : '';
          const nameTag = wholeTag || U.visitorLabel(it, ['$', 'title', 'recent_title'], '这份成品的名称', audience) || (renamed ? U.visitorRewrittenTag('这份成品的名称', '', audience) : '');
          if (nameTag) item = { ...item, nameTag };
        }
        if (audience !== 'owner') {
          // M930：访客版只挂“对外换了说法”（后台在访客回包里标了 rewritten 才有）
          const openTag = U.visitorLabel(it, 'open', '这份成品的正文', audience), nameTag = U.visitorLabel(it, ['$', 'title', 'recent_title'], '这份成品的名称', audience);
          if (openTag) item = { ...item, ownerNote: openTag };
          if (nameTag) item = { ...item, nameTag };
        }
      }
      const sig = secret && audience === 'public' ? item.id : `${title}\u0000${item.nameTag || ''}\u0000${sub}`;
      let row = group.rows.find(r => r.sig === sig);
      if (!row) group.rows.push(row = { sig, title, tag: item.nameTag || '', sub, members: [] });
      row.members.push({ item, open, at: it.at });
    });
    const openAction = (item, action) => audience === 'public' && typeof action.href === 'string'
      ? `<a class="btn btn--sm" href="${esc(action.href)}"${/^https?:/i.test(action.href) ? ' target="_blank" rel="noopener"' : ''} data-mo-press>${esc(action.label)}</a>`
      : U.actions(item, [action]);
    // quiet：整张卡（这个项目）访客看不到时，卡头项目名旁已挂一个“访客看不到”，卡里各行的名称旁、“在电脑上打开”旁一个签都不再挂
    const rowHtml = (r, quiet = false) => {
      const one = r.members.length === 1, m = r.members[0], when = x => x.at ? stamp(x.at) : '', note = x => quiet ? '' : x.item.ownerNote || '';
      const title = r.title + (quiet ? '' : r.tag);
      if (one) return `<li class="pj-art__row"><div class="pj-art__text"><p class="pj-art__title">${title}</p>${r.sub ? `<p class="pj-art__sub">${r.sub}</p>` : ''}${m.item.openNote ? `<p class="pj-art__sub">${esc(m.item.openNote)}</p>` : ''}${m.open ? `<div class="acts">${openAction(m.item, m.open)}${note(m)}</div>` : note(m) ? `<div class="acts">${note(m)}</div>` : ''}</div><span class="pj-at">${esc(when(m))}</span></li>`;
      const caption = r.members.find(x => x.open)?.open.label;
      // 本人版的“访客看不到”签跟着自己的日期，成组不拆行；整组每份都挂同一个签时，只在组名旁挂一个
      const groupNote = r.members.every(x => note(x) && note(x) === note(m)) ? note(m) : '';
      const times = r.members.map(x => `<span class="pj-art__time">${x.open ? openAction(x.item, { ...x.open, label: when(x) || x.open.label }) + (groupNote ? '' : note(x)) + (x.item.openNote ? `<span class="pj-at">${esc(x.item.openNote)}</span>` : '') : `<span class="pj-at">${esc([when(x), x.item.openNote].filter(Boolean).join(' · '))}</span>`}</span>`).join('');
      return `<li class="pj-art__row is-many"><div class="pj-art__text"><p class="pj-art__title">${title} <span class="pj-art__count">×${r.members.length}</span>${groupNote}</p>${r.sub ? `<p class="pj-art__sub">${r.sub}</p>` : ''}<div class="acts pj-art__times">${typeof caption === 'string' ? `<span class="pj-art__caption">${esc(caption)}</span>` : ''}${times}</div></div></li>`;
    };
    const SHOW = 3;
    const cards = [...groups.values()].map(g => {
      const p = g.project, name = g.secret ? '不公开的成品' : field(p?.name || '项目');
      // 本人版：整项不给访客看的项目（名册里标 visitor_labels.name=hidden 或 visibility: 'owner'），卡头项目名后挂“访客看不到”；成品行里的项目只带 id 和名字，标记到名册里找
      const listed = audience === 'owner' && !g.secret && p?.id ? [...(Array.isArray(roster) ? roster : []), ...['active', 'frozen'].flatMap(key => states.get(key)?.data?.items || [])].find(r => r?.id === p.id) || p : null;
      const headTag = !listed ? '' : projectTag(listed, audience) || (listed.visibility === 'owner' || listed.public === 'owner' ? U.visitorHiddenTag('这个项目', '', audience) : '');
      const quiet = !!listed && U.visitorWholeHidden(listed, ['$', 'name']);
      const head = (g.secret ? `<span class="row__title">${name}</span>` : p?.href ? `<a class="row__title" href="${esc(route(p.href))}">${name} <span class="more__chev">›</span></a>` : `<span class="row__title">${name}</span>`) + (headTag ? ` ${headTag}` : '');
      // 卡里先 3 行，“展开（还有 N 条）”一次再露 5 行，露到底变“收起”（R97、R147；长列表表第 112 项）
      const extra = Math.max(0, g.rows.length - SHOW), reveal = Math.min(extra, reveals.artifacts.get(g.key) || 0);
      const left = U.shouldFold(extra - reveal) ? extra - reveal : 0, open = extra - left;
      const step = U.shouldFold(extra) ? `<button class="more pj-step" type="button" data-step-of="artifacts" data-step="${esc(g.key)}"${left ? '' : ' data-open'}>${left ? `展开（还有 ${left} 条）` : '收起'} <span class="more__chev">›</span></button>` : '';
      const header = g.secret && audience === 'public' ? '' : `<div class="pj-art__head">${g.secret ? miniPic('', null) : miniPic(p?.id, p?.name)}${head}</div>`;
      return { key: g.key, cls: 'pj-art', html: `${header}<ul class="pj-art__rows">${g.rows.slice(0, SHOW + open).map(r => rowHtml(r, quiet)).join('')}</ul>${step}` };
    });
    const range = recent?.range || '7d', count = range === '7d' ? recent?.count_7d : recent?.count;
    // 还能往下翻的不算“未读到”；翻完了还比登记的少才写
    const missing = !recent?.next && Number.isInteger(count) && count > items.length
      ? `${rangeLabel(range)}登记 ${count} 件，还有至少 ${count - items.length} 件未读到`
      : '';
    // 这一档一件都没有、但别的档有（或是近 30 天、全部）时照样留着这块，写一句没有，切换还点得到
    const quiet = !items.length && !recent?.hidden && !missing && (range !== '7d' || recent?.total > 0)
      ? range === 'all' ? '还没有登记过成品' : `${rangeLabel(range)}没有新登记的成品` : '';
    const note = recent?.state === 'unread' ? '成品暂时读不到' : ['loading', 'missing'].includes(recent?.state) ? rangeWord('artifacts', range, recent.state) : items.length || recent?.hidden || missing || quiet ? [
      recent.waiting, recent.at && `成品数据截至 ${stamp(recent.at)}`, missing || recent.q === 'partial' && '只列已读到的成品', quiet,
      // 近 30 天、全部一页没列完：写清列了几件、这一档一共几件，下面“更多成品 ›”接着翻
      recent.next && Number.isInteger(count) && `已列出 ${items.length} 件，${rangeLabel(range)}共 ${count} 件`, recent.page_gap,
    ].filter(Boolean).join(' · ') : '';
    const cut = CARDS + (reveals.artcards.get('') || 0);
    const cardsLeft = U.shouldFold(cards.length - cut) ? cards.length - cut : 0, cardsShown = cards.length - cardsLeft;
    section('recent-artifacts', '成品', cards.slice(0, cardsShown), note, []);
    const box = $('recent-artifacts');
    if (box) {
      // 项目卡先 9 张，“展开（还有 N 个项目）”一次再露 6 张（两排），露到底变“收起”；读到的都露完了才出“更多成品 ›”接着读。说法和同页活跃、未推那两颗一样，箭头前的空也一样
      let more = box.querySelector(':scope > .pj-art-more');
      if (!U.shouldFold(cards.length - CARDS)) more?.remove();
      else {
        if (!more) { more = document.createElement('button'); more.type = 'button'; more.className = 'more pj-step pj-art-more'; more.dataset.stepOf = 'artcards'; more.dataset.step = ''; box.querySelector(':scope > .pj-extra__list').after(more); }
        more.toggleAttribute('data-open', !cardsLeft);
        U.html(more, `${cardsLeft ? `展开（还有 ${cardsLeft} 个项目）` : '收起'} <span class="more__chev">›</span>`);
      }
    }
    if ($('artifacts-next')) $('artifacts-next').hidden = !recent?.next || cardsLeft > 0;
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
  window.Live.watch('projects', { state: 'frozen' }, { phase: s => phase('frozen', s), data: remember('frozen', (d, meta) => { viewer = meta.viewer?.kind || 'public'; if (!d) return; update('frozen', () => renderFrozen(d.items)); reads.frozen.done(); alignFrozen(); }), link: s => link('frozen', s) });
  const changeAt = d => d?.source_at || d?.at;
  const rosterChanges = { phase: s => phase('changes', s), data: remember('changes', (d, meta) => {
    if (!d) return;
    update('changes', () => {
      const kind = meta.viewer?.kind || 'public';
      if (d.items == null || kind !== changeViewer || !changeAt(d) || changeAt(d) !== changeAt(changes) || changes?.next !== d.next) {
        changeRows = d.items; next = d.next;
      }
      const fresh = changes && changeAt(d) !== changeAt(changes);
      changes = d; changeViewer = kind; renderChanges();
      if (fresh) refreshRanges('changes');
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
    updateCutoff('frozen', states.get('frozen')?.data);
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
  $('next').addEventListener('click', async (event) => {
    const range = pick.changes, own = range === '7d' ? null : ranged.changes[range];
    if (!(own ? own.next : next)) return;
    const button = event.currentTarget, label = button.textContent;
    button.disabled = true; button.textContent = '正在读…';
    try {
      if (own) {
        // 近 30 天、全部：同一份回包接着翻，翻到的并进这一档
        const cursor = own.next, source = changeAt(own.data), s = await window.Live.get('projects/changes', { range, cursor });
        if (cursor !== own.next || ranged.changes[range] !== own) return;
        if (s.data?.items && s.data.range === range && source === changeAt(s.data) && s.data.next !== cursor) {
          own.rows = [...new Map([...own.rows, ...s.data.items].map(it => [it.id, it])).values()]; own.next = s.data.next; groupsShown += GROUPS.more;   // 新读到的组接着露一批
          if (pick.changes === range) U.anchor(renderChanges);
        } else { changesNote.hidden = false; U.html(changesNote, '下一页暂时读不到，已读到的留在这里。'); }
        return;
      }
      const cursor = next, source = changeAt(changes), s = await window.Live.get('projects/changes', { cursor });
      if (cursor !== next || source !== changeAt(changes)) return;
      if (s.data?.items && (s.meta.viewer?.kind || 'public') === changeViewer && source === changeAt(s.data) && s.data.next !== cursor) {
        U.anchor(() => { changeRows = [...new Map([...changeRows, ...s.data.items].map(it => [it.id, it])).values()]; next = s.data.next; groupsShown += GROUPS.more; if (pick.changes === '7d') renderChanges(); });
      } else { changesNote.hidden = false; U.html(changesNote, '下一页暂时读不到，已读到的留在这里。'); }
    } finally { button.disabled = false; button.textContent = label; }
  });
  window.LiveProjectLook?.load().then(data => {
    looks = data || {}; looksReady = true;
    for (const draw of repaints.values()) draw();
  });
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();
