// AI 账本：最上面一小块“现在 AI 手上的”（在做、在等，点开是两张小表），下面一本按结果分组的账簿（_lib/live-book.js）。
// 每件事一行：短标题、结果小标签、时间、所属项目、一句话原因；长原因、轮次、关联任务和关联的事、上回、问情况都在点开的那一行里。
// 每组先摆 5 条，其余“展开其余 N 条”；后端还有下一批时底下“继续看”。结果筛选、早期历史和游标都保留在资源的查询里。
(() => {
  'use strict';
  const U = window.LiveUI, L = window.LiveLight, $ = id => document.getElementById(id), { esc, sp } = U;
  const p = new URLSearchParams(location.search), hero = $('hero');
  const nextButton = $('next'), nextLabel = nextButton.textContent;
  const homeRead = U.reading(hero.querySelector('.card__body'), { ghost: U.ghost.card(1), name: 'AI 账本' });
  const route = href => { const u = new URL(href, location.origin); if (p.has('fixture')) u.searchParams.set('fixture', p.get('fixture')); return u.pathname + u.search + u.hash; };
  const outcome = { fixed: '修好', not_fixed: '没修好', wont_fix: '定了不修', deferred: '暂时不修', to_owner: '转给你' }, state = { working: '在做', waiting: '在等', deferred: '暂时不修', wont_fix: '定了不修' };
  const attention = it => it.outcome === 'not_fixed';
  // 结果五组的颜色：只用实况现有的几种灯色，具体色值在 live-book.css 的 --tone-*（结果小标签按结果名在那里配色）
  const TONE = { fixed: 'green', not_fixed: 'red', wont_fix: 'violet', deferred: 'blue', to_owner: 'amber' };
  const GROUPS = Object.entries({ fixed: 'check', not_fixed: 'cross', wont_fix: 'minus', deferred: 'pause', to_owner: 'person' }).map(([id, icon]) => ({ id, title: outcome[id], tone: TONE[id], icon }));
  // 三张表的列；整列都没有数的列（例如后端没给所属项目）不摆。结果、状态不单列：组头、按钮上已经写了，
  // 只有和这张表不一样的（例如“在做”里一件“暂时不修”）在标题前面挂一个小标签
  const COLUMNS = {
    history: [{ id: 'name', label: '事项（短标题）' }, { id: 'at', label: '时间' }, { id: 'project', label: '所属项目' }, { id: 'reason', label: '原因（一句话）' }],
    working: [{ id: 'name', label: '事项（短标题）' }, { id: 'reason', label: '说明' }, { id: 'age', label: '跟了' }],
    waiting: [{ id: 'name', label: '事项（短标题）' }, { id: 'reason', label: '在等什么' }, { id: 'age', label: '跟了' }],
  };
  const own = (r, key) => r.state === key || r.outcome === key ? r : { ...r, parts: { ...r.parts, name: `<span class="ledger-name">${r.parts.tag}<span class="ledger-name__t">${r.parts.name}</span></span>` } };
  const NOW = {
    working: { label: '在做', icon: '<svg class="ledger-now__ico" data-tag="working" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M10.2 8.6v6.8l5.2-3.4z"/></svg>' },
    waiting: { label: '在等', icon: '<svg class="ledger-now__ico" data-tag="waiting" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M10 8.8v6.4m4-6.4v6.4"/></svg>' },
  };
  const book = (id, columns, groups, frame) => window.LiveBook.create($(id), { name: '账本事项', columns, groups, frame, tools: false, ribbon: false, art: null, spread: false, first: 5 });
  const books = { history: book('history-book', COLUMNS.history, GROUPS, 'glass'), working: book('working-book', COLUMNS.working, [{ id: 'working', head: false }], 'plain'), waiting: book('waiting-book', COLUMNS.waiting, [{ id: 'waiting', head: false }], 'plain') };
  books.history.el.top.append($('ledger-nav'));
  const detailReads = [U.reading($('current'), { ghost: U.ghost.rows(4), slow: true }), U.reading(books.history.pages, { ghost: U.ghost.rows(4), slow: false })];
  let viewer = 'public', data = null, at = null, watcher, historyRows = null, next = null, pages = new Map(), earlier = p.get('before'), selected = p.get('outcome') || '';
  let reading, pageRequest, linkState;
  const outcomeLabel = key => key === 'to_owner' && viewer === 'public' ? '转给本人' : outcome[key];
  let waitOrder = false;
  window.LedgerWaitOrder?.bind(enabled => { waitOrder = enabled; if (data) render(); });
  const eventKey = it => `${it.id}:${it.episode ?? ''}:${it.at ?? it.accepted ?? ''}:${it.outcome ?? it.state ?? ''}`;
  const collect = () => pages.get('') == null ? null : [...new Map([...pages.values()].flat().filter(Boolean).map(it => [eventKey(it), it])).values()];
  const visibleCursor = cursor => !earlier && cursor?.startsWith('older:') ? null : cursor;
  function allResultsCount(outcomes, lower, historical, key) {
    if (historical) {
      if (selected && key !== selected || historyRows == null) return U.offline?.() ? '' : '未读全';
      const read = historyRows.filter(it => key ? it.outcome === key : Object.hasOwn(outcome, it.outcome)).length;
      const incomplete = next || lower(data, 'history') || lower(data.coverage, 'history');
      return `${incomplete ? '已读 ' : ''}${read} 件`;
    }
    const keys = Object.keys(outcome);
    if (!keys.every(k => Number.isSafeInteger(outcomes?.[k]) && outcomes[k] >= 0)) return U.offline?.() ? '' : '没有记录';
    const scope = data?.window?.label === '已记录时段' || data?.coverage?.q === 'partial' ? '已记录 ' : '';
    return `${keys.some(k => lower(outcomes, k)) ? '至少 ' : scope}${keys.reduce((sum, k) => sum + outcomes[k], 0)} 件`;
  }
  function summary(historical = false) {
    if (data?.q === 'warming') { U.html($('head'), U.head('正在准备', { lamp: false })); $('hero-note').textContent = ''; homeRead.done(); return; }
    const s = data?.summary, c = data?.counts, outcomes = c?.outcomes7 || c, lower = (d, key) => [d, d?.[key]].some(o => o?.lower_bound === true || o?.at_least === true || o?.isPartial === true) || d?.q === 'partial' && (!Array.isArray(d.partial) || [].concat(key).some(k => d.partial.includes(k))), number = (n, d, key) => n == null ? U.offline?.() ? '' : U.collectionText('', d) : `${lower(d, key) ? '至少 ' : ''}${n} 件`;
    const accepted = number(s?.new7 ?? s?.accepted7, s, s?.new7 != null ? 'new7' : 'accepted7');
    const noResults = data?.coverage?.outcomes7_recorded === 0;
    const results = noResults ? [] : Object.keys(outcome).map(key => {
      const count = number(outcomes?.[key], outcomes, key);
      return count && `${outcomeLabel(key)} ${count}`;
    });
    U.html($('head'), U.status({ ...data, level: data?.header_level ?? data?.level }).lamp + U.head(historical ? '更早的结果' : [accepted && `近 7 天新接 ${accepted}`, ...results].filter(Boolean).join(' · ') || 'AI 账本', { lamp: false }));
    homeRead.done();
    const working = s?.working ?? c?.working, waiting = s?.waiting ?? c?.waiting;
    const workText = number(working, s?.working != null ? s : c, 'working'), waitText = number(waiting, s?.waiting != null ? s : c, 'waiting');
    U.html($('hero-note'), [workText && `账本在做 ${workText}`, waitText && `在等 ${waitText}`, ...new Set([...[s, c, outcomes].filter(d => d?.q === 'partial' && d.gap && !(U.offline?.() && /还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|正在读/.test(d.gap))).map(d => d.gap)].filter(Boolean))].filter(Boolean).map(v => U.fieldHtml(v)).concat(U.status({ ...data, level: data?.header_level ?? data?.level }).note || (data.why ? U.fieldHtml(data.why) : [])).join(' · '));
    for (const button of $('outcome').querySelectorAll('[data-outcome]')) {
      const key = button.dataset.outcome;
      const count = noResults && !historical ? '' : key && !historical ? number(outcomes?.[key], outcomes, key) : allResultsCount(outcomes, lower, historical, key);
      U.html(button, `${esc(key ? outcomeLabel(key) : '全部结果')} <span class="filter-count">${esc(count)}</span>`);
    }
  }
  L.add(hero); L.tone(hero, 'none');
  const bar = U.topbar({ ask: () => `请看实况 AI 账本${at ? `（${U.time(at)} 的数）` : ''}：${data?.summary?.text || '请说明现在的情况'}。` });
  document.querySelector('[data-back]').href = route('/live/#ledger');
  document.querySelector('[data-back]').addEventListener('click', U.restoreBack);
  for (const key of ['working', 'waiting']) U.fold($(`${key}-more`), $(`${key}-box`));
  // 账簿的一行。parts 按列名放好每一格，html 是这一行摆出来的全部（格子加点开的说明），has 给“整列没数就不摆”用
  function row(it, historical) {
    const when = v => v ? [U.date?.(v), U.time?.(v)].filter(Boolean).join(' ') : '';
    const label = outcomeLabel(it.outcome) || state[it.state] || (U.offline?.() ? '' : U.collectionText());
    const field = it.text && typeof it.text === 'object' ? { ...it, ...it.text } : it, content = sp(field), hidden = viewer === 'public' && (it.visibility === 'owner' || it.public === 'owner' || field.visibility === 'owner' || field.public === 'owner'), placeholder = hidden || viewer === 'public' && (field.hidden || field.rewrite === 'pending' && !field.text && !field.value);
    const shortTitle = !placeholder && it.plain_title != null && U.fieldText(it.plain_title, viewer).trim() ? it.plain_title : field;
    const title = U.fieldHtml(hidden ? { visibility: 'owner' } : sp(shortTitle) ? shortTitle : '未记事项标题', { name: '账本事项', place: 'title', kind: viewer });
    const task = it.task ? `<a href="${esc(route(`/live/task/?id=${encodeURIComponent(it.task)}`))}">关联任务 ›${it.task_name ? ` ${U.fieldHtml(it.task_name, { name: '关联任务', kind: viewer })}` : ''}</a>` : it.task_name ? U.fieldHtml(it.task_name, { name: '关联任务', kind: viewer }) : '';
    const item = it.owner_item ? `<a href="${esc(route(`/live/item/?id=${encodeURIComponent(it.owner_item)}`))}">关联的事 · 看这件事 ›</a>` : '';
    const marks = placeholder ? [U.fieldHtml(hidden ? { visibility: 'owner' } : field, { name: '这件事的内容', kind: viewer })] : [...new Set([U.visibilityNote(it, viewer, '这件事的内容'), U.visibilityNote(it.wait, viewer, '等待的原因')].filter(Boolean))];
    const waiting = viewer === 'public' && (it.wait?.visibility === 'owner' || it.wait?.public === 'owner') ? '' : sp(it.wait);
    const wait = waiting && !(/正在换说法|仅本人可见/.test(waiting) && waiting === content) ? it.wait || waiting : '';
    const said = it.outcome_text && !(/正在换说法|仅本人可见/.test(sp(it.outcome_text)) && sp(it.outcome_text) === content) ? it.outcome_text : '';
    const reason = said || wait;
    const project = hidden ? '' : typeof it.project_name === 'string' && it.project_name ? (it.project ? `<a href="${esc(route(`/live/project/?id=${encodeURIComponent(it.project)}`))}">${U.fieldHtml(it.project_name, { kind: viewer })}</a>` : U.fieldHtml(it.project_name, { kind: viewer })) : it.project_name && typeof it.project_name === 'object' ? U.fieldHtml(it.project_name, { name: '所属项目', kind: viewer }) : '';
    const took = when(it.accepted), facts = [it.round != null && `第 ${sp(it.round)} 轮`, historical && it.age_days != null && `跟了 ${sp(it.age_days)} 天`, took && `${took} 接手`, !historical && it.at && when(it.at), said && wait].filter(Boolean);
    const before = it.previous && (!U.offline?.() || it.previous.text || outcome[it.previous.outcome]) ? `上回${it.previous.at ? `（${when(it.previous.at)}）` : ''}：${U.fieldHtml(it.previous.text || outcome[it.previous.outcome] || U.collectionText("结局"), { kind: viewer })}` : '';
    const actions = (it.actions?.length ? it.actions : [{ kind: 'copy', label: '问情况', intent: 'ask' }]).map(a => a.intent === 'ask' && a.label && typeof a.label === 'object' && !a.label.text && !a.label.value ? { ...a, label: '问情况' } : a);
    const status = U.status(it, { small: true }), note = U.status(it).note;
    const tip = hidden || placeholder ? '' : ` title="${esc(sp(U.fieldText ? U.fieldText(field, viewer) : field))}"`;
    const detailHref = /^\/live\/automation\/\?work=/.test(it.work_href || '') ? it.work_href : `/live/issue/?id=${encodeURIComponent(it.id)}`;
    const parts = {
      name: (hidden ? `<span class="book-clip book-clip--2">${title}</span>` : `<a class="ledger-title book-clip book-clip--2" href="${esc(route(detailHref))}"${tip}>${title}</a>`) + (placeholder && marks.length ? ` ${marks.join(' · ')}` : '') + (note ? `<small>${note}</small>` : ''),
      tag: label ? `<span class="tag ledger-tag" data-tag="${esc(outcome[it.outcome] ? it.outcome : state[it.state] ? it.state : 'none')}">${U.fieldHtml(label, { place: 'label' })}</span>` : '',
      at: historical && it.at ? `<span class="ledger-when">${esc(when(it.at))}</span>` : '',
      age: !historical && it.age_days != null ? `${esc(sp(it.age_days))} 天` : '',
      project,
      reason: reason ? `<span class="book-clip book-clip--1">${U.fieldHtml(reason, { kind: viewer })}</span>` : '',
    };
    const detail = hidden ? [
      reason && `<p class="ledger-detail__say">${U.fieldHtml(reason, { kind: viewer })}</p>`,
      facts.length && `<p class="ledger-detail__facts">${facts.map(s => `<span class="ledger-bit">${U.fieldHtml(s, { kind: viewer })}</span>`).join(' · ')}</p>`,
      marks.length && `<p class="ledger-detail__marks">${marks.join(' · ')}</p>`,
      (task || item) && `<p class="ledger-detail__links">${[task, item].filter(Boolean).join('')}</p>`,
      before && `<p class="ledger-detail__before">${before}</p>`,
    ].filter(Boolean).join('') + `<div class="ledger-detail__acts">${U.actions(it, actions)}</div>` : '';
    return { key: historical ? eventKey(it) : it.id, group: it.outcome || it.state, state: it.state ?? null, outcome: it.outcome ?? null, parts, has: { at: !!parts.at, age: !!parts.age, project: !!project, reason: !!reason }, lamp: status.lamp, attention: attention(it), detail: detail && `<div class="ledger-detail">${detail}</div>`, text: content, html: status.lamp + Object.values(parts).join('') + detail };
  }
  const keep = (columns, rows) => rows.length ? columns.filter(c => !(c.id in rows[0].has) || rows.some(r => r.has[c.id])) : columns;
  const shape = (rows, columns) => rows.map(r => ({ ...r, cells: columns.map(c => r.parts[c.id] ?? '') }));
  const lost = () => U.offline?.() ? '这块没存下来，连上后补上。' : U.collectionText();
  // 手上那一小块：按钮上是件数，点开是一张小表（先 5 条，其余展开）
  function fill(key, list, none) {
    if (list == null) none = lost();
    const rows = U.order(list || [], attention, `ledger:${key}:${selected}:${earlier || ''}`, it => it.id);
    const ordered = window.LedgerWaitOrder?.order(rows, waitOrder) || rows, rendered = ordered.map(it => ({ ...own(row(it, false), key), group: key })), columns = keep(COLUMNS[key], rendered);
    books[key].set(shape(rendered, columns), { columns, empty: U.fieldHtml(none) });
    U.html($(`${key}-more`), `${NOW[key].icon}<span class="ledger-now__t"><b>${NOW[key].label} ${list == null ? U.collectionText() : `${rows.length} 件`}</b></span><span class="more__chev">›</span>`);
  }
  // 结果账簿：五组（筛了结果只摆那一组），组头写件数；后端还有下一批没读时写“已读 N 条”或后端给的总数
  function results(list) {
    const rows = U.order(list || [], attention, `ledger:history:${selected}:${earlier || ''}`, eventKey).map(it => row(it, true)).map(r => own(r, r.group)), columns = keep(COLUMNS.history, rows), counts = earlier ? null : data?.counts?.outcomes7 || data?.counts;
    const noKnownRecentOutcome = !earlier && !rows.length && data?.coverage?.outcomes7_recorded === 0;
    const known = typeof counts?.[selected] === 'number' ? counts[selected] : null;
    const later = '还有记录，点「继续看」翻下一页。';
    $('history-empty').hidden = !!rows.length;
    $('history-empty').textContent = list == null ? lost() : noKnownRecentOutcome ? '近 7 天已读到的记录没有逐件标过结果。'
      : known === 0 ? '这个范围登记了 0 件该类结果。' : next ? later
        : known ? `这类结果有 ${known} 件，这次没读到明细。` : '这个范围没有记录该类结果。';
    if (noKnownRecentOutcome) {
      books.history.set([], { columns, groups: [], empty: '' });
      return;
    }
    const groups = GROUPS.filter(g => !selected || g.id === selected).map(g => {
      const n = rows.filter(r => r.group === g.id).length, total = !earlier && typeof counts?.[g.id] === 'number' ? counts[g.id] : null;
      const empty = list == null ? lost() : total === 0 ? '这组登记了 0 件。' : next ? later
        : total > 0 ? `这次没读到 ${total} 件的明细。` : '这组没有登记结果。';
      return { ...g, title: outcomeLabel(g.id), empty: U.fieldHtml(empty), count: list == null ? '' : `（${total != null && total >= n ? total : next ? `已读 ${n} 条` : n}）` };
    });
    books.history.set(shape(rows, columns), { columns, groups, empty: U.fieldHtml(list == null ? lost() : '暂无记录') });
  }
  function render() {
    if (data?.repeat_fixes) drawRepeatFixes(data.repeat_fixes);
    else $('repeat-fixes')?.remove?.();
    $('board').hidden = data.q === 'warming'; if (data.q === 'warming') { summary(); L.tone(hero, 'off'); detailReads.forEach(r => r.done()); return; }
    summary(!!earlier);
    L.tone(hero, { ...data, level: data.header_level ?? data.level });
    // “定了不修”不算在办：不进手上那块，放进账簿“定了不修”那一组（看更早的时不放；同一件已经在结果里的不重复）
    const decided = data.items?.filter(it => !it.state && it.outcome === 'wont_fix') || [];
    fill('working', data.items?.filter(it => it.state !== 'waiting' && !(!it.state && it.outcome === 'wont_fix')), '没有在做的事');
    fill('waiting', data.items?.filter(it => it.state === 'waiting'), '没有在等的事');
    const closed = new Set((historyRows || []).filter(it => it.outcome === 'wont_fix').map(it => it.id));
    results(historyRows == null ? null : [...(earlier ? [] : decided.filter(it => !closed.has(it.id))), ...historyRows].filter(it => it.outcome && (!selected || it.outcome === selected)));
    $('current').hidden = !!earlier;
    const currentLink = hero.querySelector('a[href="#current"]');
    if (currentLink) currentLink.hidden = !!earlier;
    $('board').classList.toggle('is-single', !!earlier);
    $('earlier').textContent = earlier ? '回到近 7 天 ›' : '更早的 ›';
    $('history-label').textContent = earlier ? `${U.date(earlier)} 以前的结果` : '近 7 天的结果';
    U.html($('coverage'), [data.coverage?.from && `记录从 ${U.date(data.coverage.from)} 起`, ...new Set([data, data.coverage].filter(d => d?.q === 'partial' && d.gap && !(U.offline?.() && /还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|正在读/.test(d.gap))).map(d => d.gap))].filter(Boolean).map(v => U.fieldHtml(v, { kind: viewer })).join(' · ') + (data.hidden ? ` ${U.hiddenMore?.(data.hidden, '件', data.hidden_what || '办完的事') || ''}` : ''));
    L.lightUp([hero, $('board'), $('notices')]);
    U.land();
  }
  function drawRepeatFixes(repeat) {
    let box = $('repeat-fixes');
    if (!repeat?.items?.length) { if (box) box.hidden = true; return; }
    if (!box) { box = document.createElement('section'); box.id = 'repeat-fixes'; box.className = 'lbp-side glass'; box.innerHTML = '<p class="part">反复出现的问题</p><ul class="rows list"></ul>'; $('board').before(box); }
    box.hidden = false;
    function repeatDetails(row) {
      const details = [];
      for (const [key, label] of [['previous_handling', '上次怎么处理'], ['current_impact', '这次的影响']]) {
        if (Object.hasOwn(row, key)) details.push(`${label}：${U.fieldHtml(row[key] ?? '没有记录', { kind: viewer })}`);
      }
      const seconds = row.total_tracked_seconds;
      if (viewer === 'owner' && Number.isInteger(seconds) && seconds >= 0) {
        const hours = Math.floor(seconds / 3600);
        const duration = hours >= 24 ? `${Math.floor(hours / 24)} 天` : hours ? `${hours} 小时` : '不到 1 小时';
        details.push(`从第一次登记到现在 ${duration}`);
      }
      return details.map(detail => `<p class="row__sub">${detail}</p>`).join('');
    }
    function trackedDuration(seconds) {
      if (!Number.isFinite(seconds) || seconds < 0) return '';
      const minutes = Math.floor(seconds / 60);
      if (!minutes) return seconds ? '不到 1 分钟' : '0 分钟';
      const parts = [[Math.floor(minutes / 1440), '天'], [Math.floor(minutes / 60) % 24, '小时'], [minutes % 60, '分钟']];
      return parts.filter(([value]) => value > 0).map(([value, unit]) => `${value} ${unit}`).join(' ');
    }
    const withheld = value => viewer === 'public' && (value?.hidden || value?.hidden_block
      || ['owner', 'pending'].includes(value?.visibility) || value?.public === 'owner' || value?.rewrite === 'pending');
    const reading = value => withheld(value) ? null : value?.value ?? value;
    const when = at => typeof at === 'string' && Number.isFinite(Date.parse(at)) ? `${U.date(at)} ${U.time(at)}` : '';
    U.list(box.querySelector('ul'), repeat.items.map(it => {
      const words = [it.reopen_count != null && `明确重开 ${it.reopen_count} 次`];
      if (!withheld(it)) {
        const first = when(reading(it.first_at)), last = when(reading(it.last_at));
        const duration = trackedDuration(reading(it.tracked_seconds));
        words.push(first && `首次接手 ${first}`, duration && `已跟进 ${duration}（截至上次重开）`, last && `上次重开 ${last}`);
      }
      const label = U.fieldHtml(it.text, { name: '反复出现的问题', place: 'label', kind: viewer });
      const body = U.fieldHtml(it.text, { name: '反复出现的问题', kind: viewer });
      const note = body === label ? '' : body.startsWith(label + ' ') ? body.slice(label.length + 1) : body;
      return { key: it.id, cls: 'row row--flat', html: `<span></span><div class="row__text"><p class="row__main"><a class="row__title" href="${esc(route(`/live/issue/?id=${encodeURIComponent(it.issue || it.id)}`))}">${label} ›</a>${note ? ` ${note}` : ''}</p><p class="row__sub">${words.filter(Boolean).map(esc).join(' · ')}</p>${repeatDetails(it)}</div>` };
    }));
  }
  const showTime = s => {
    const sourceAt = Object.hasOwn(data || {}, 'source_at') ? data.source_at : data?.at ?? at;
    bar?.set(sourceAt ? { ...s, shownAt: sourceAt, cutoffAt: sourceAt } : s);
  };
  function link(s) {
    linkState = s; showTime(s); L.offline(s.offline);
    U.list($('notices'), s.offline || (!s.data && !s.warming && s.text) ? [{ key: 'ledger', cls: 'notice glass', html: `<span>${U.fieldHtml(s.text, { kind: viewer })}</span>` }] : []);
    if (s.data == null && s.phase === 'none') {
      homeRead.set(s); U.html($('head'), U.head(U.collectionText(), { lamp: false }));
      detailReads.forEach(r => r.set(s)); fill('working', null); fill('waiting', null); results(null);
    }
    [hero.querySelector('.card__body'), $('current'), $('history').querySelector('.ledger-paper')].forEach(el => U.blockNote(el, s));
  }
  function query(cursor) { return { project: p.get('project'), outcome: selected || null, before: earlier, cursor }; }
  const resource = () => p.has('fixture') && earlier ? 'ledger-earlier' : 'ledger';
  const audience = meta => meta.viewer?.kind || 'public';
  function nextControl() {
    nextButton.hidden = !reading?.next || data?.q === 'warming' || !earlier && data?.coverage?.outcomes7_recorded === 0;
    nextButton.disabled = !!pageRequest;
    nextButton.textContent = reading?.failed ? '后续记录暂时读不到，重试 ›' : nextLabel;
  }
  function resetHistory() {
    at = data = historyRows = next = reading = pageRequest = null;
    pages = new Map(); nextControl();
    U.html($('outcome').querySelector('[data-outcome=""]'), '全部结果');
  }
  function showReading() {
    U.anchor(() => {
      ({ first: data, at, viewer, pages, next } = reading);
      historyRows = collect(); render(); nextControl(); detailReads.forEach(r => r.done());
    });
  }
  function readFirst(d, meta) {
    const kind = audience(meta), sameViewer = reading?.viewer === kind;
    if (!d) { resetHistory(); viewer = kind; fill('working', null); fill('waiting', null); results(null); return; }
    if (!sameViewer) pageRequest = null;
    if (!sameViewer || reading.at !== meta.at) reading = { first: d, at: meta.at, viewer: kind, next: visibleCursor(d.next), pages: new Map([['', d.history]]) };
    else {
      reading.first = d; reading.pages.set('', d.history);
      if (reading.pages.size === 1) reading.next = visibleCursor(d.next);
    }
    if (!sameViewer || !reading.next || reading.pages.size >= pages.size) showReading();
    else if (!reading.failed) readPages(pages.size);
  }
  function subscribe() {
    watcher?.stop(); resetHistory();
    watcher = window.Live.watch(resource(), query(null), {
      phase(s) { if (s.data == null) [homeRead, ...detailReads].forEach(r => r.set(s)); },
      data: readFirst, link,
    });
  }
  const selectOutcome = () => $('outcome').querySelectorAll('[data-outcome]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.outcome === selected)));
  selectOutcome();
  $('outcome').addEventListener('click', e => { const button = e.target.closest('[data-outcome]'); if (!button) return; selected = button.dataset.outcome; selectOutcome(); selected ? p.set('outcome', selected) : p.delete('outcome'); history.replaceState(null, '', `${location.pathname}?${p}`); subscribe(); });
  $('earlier').addEventListener('click', () => {
    if (earlier) { earlier = null; p.delete('before'); }
    else {
      if (!Number.isFinite(Date.parse(at))) return;
      const [day, clock] = at.split('T');
      const previousWeek = new Date(Date.parse(day) - 7 * 86400000).toISOString().slice(0, 10);
      earlier = `${previousWeek}T${clock.replace(/Z$/, '+00:00')}`;
      p.set('before', earlier);
    }
    history.replaceState(null, '', `${location.pathname}?${p}`); subscribe();
  });
  async function readPages(depth) {
    if (!reading?.next || pageRequest) return;
    const request = pageRequest = {}, fetchPage = cursor => window.Live.get(resource(), query(cursor)).catch(() => null);
    let refreshed = false;
    nextControl();
    try {
      while (pageRequest === request && reading.next && reading.pages.size < depth) {
        const batch = reading, cursor = batch.next, s = await fetchPage(cursor);
        if (pageRequest !== request) return;
        if (batch !== reading) continue;
        if (s?.meta?.status >= 400 || !Array.isArray(s?.data?.history) || batch.pages.has(s.data.next)) {
          batch.failed = true; return;
        }
        if (batch.at !== s.meta.at || batch.viewer !== audience(s.meta)) {
          if (!refreshed) {
            refreshed = true; await fetchPage(null);
            if (batch !== reading) continue;
          }
          batch.failed = true; return;
        }
        batch.pages.set(cursor, s.data.history); batch.next = visibleCursor(s.data.next); batch.failed = false;
      }
      if (pageRequest === request) { showReading(); showTime(linkState); }
    } finally {
      if (pageRequest === request) { pageRequest = null; nextControl(); }
    }
  }
  nextButton.addEventListener('click', () => readPages(pages.size + Number(reading?.pages === pages)));
  subscribe(); requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();
