// 明细账簿（共用模版）：一长张明细表摆成左右两页（排法照本人 11-17 19:53 点头的设计图“新模版 · 逐项明细”），外观是实况这一家的玻璃卡和白底圆角卡（21:40 定）。
// 上面一排：搜索、排序、几张摘要卡（例如“用得最多”“很久没用”）；下面一本账簿：左右两页、每页 20 行，底边“再看 20 条”。
// 长文字的明细（一行好几句话）用一整页（spread: false），每次 20 行。
//
// 页面只管把每一行准备好，账簿负责摆、搜、排、分页、展开说明：
//   const book = LiveBook.create(host, {
//     name: '技能名称',                                   // 搜索框写“搜索技能名称…”
//     columns: [{ id: 'name', label: '技能名称' }, { id: 'count', label: '近 30 天用了几次', bar: true }, { id: 'last', label: '最近使用日期' }],
//     sorts: [{ id: 'count-desc', label: '…', by: 'count', dir: -1 }, …],  // 第一项是默认；没有 by 的是“原来的顺序”
//     picks: [{ id: 'top', title: '用得最多', sub: n => `Top ${n}`, by: 'count', dir: -1, n: 3, keep: r => r.sort.count > 0,
//               icon: 'bars', tone: 'green', mark: 'crown', cell: 1, sort: 'count-desc' }],
//     spread: true, page: 20,
//     more: async () => {},                                  // 已读到的都摆出来了、后端还有下一批时去取
//   });
//   book.set(rows, { columns, caption, empty, hasNext });  // 每次数到了就整批交进来；搜索词、排序、展开了哪几行都留着
//   book.pages                                             // 摆行的那块（读数时的雾也放这里）
// 一行：{ key, cells: [各格 HTML], title: 名字（摘要卡用，已转义）, text: 搜索用的字, sort: { count, last, name… },
//         bar: 画条用的数（没读到写 null）, lamp: 小灯 HTML（只给非正常的）, attention, detail: 展开后的说明 HTML,
//         expand: 没有另外的说明、但格子里有收着的长字（.book-clip 长名字最多两行、原因一句、长说明几行），点开整行放开 }
//       合起来的私密行：{ key, wide: '另有 N 件，可信设备可见' }
// 空值（还在采集、没读到）排序时总在最后，不当 0；条只画有数的，0 画空槽。
//
// 分组的账簿（AI 账本那种：修好、没修好…各一组）：create 时给 groups，set 时也可以换一批（例如只看某一种结果）：
//   LiveBook.create(host, { tools: false, spread: false, first: 5,
//     groups: [{ id: 'fixed', title: '修好', tone: 'green', icon: 'check', empty: '…', count: '（3）' }], columns: […] });
//   一行另带 group: 'fixed'；每组先摆 first 条，其余“展开其余 N 条”。tools: false 不要搜索排序那一排；
//   外框默认是实况现有的玻璃卡（.glass），frame: 'plain' 不要外框（放在别的卡里）；组上写 head: false 不要组头；
//   book.el.top 是账簿最上面的空位，页面可以把自己的筛选条放进去。
(() => {
  'use strict';
  const UI = () => window.LiveUI || {};
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const fold = s => String(s ?? '').normalize('NFKC').toLowerCase().replace(/[\s\-_·.\/]+/g, ' ').trim();
  const blank = v => v == null || v === '' || (typeof v === 'number' && !Number.isFinite(v));

  const ICON = {
    crown: place => `<svg class="book-ico book-ico--crown" data-place="${place}" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.6 8.4 8.2 12l3.8-6.6 3.8 6.6 4.6-3.6-1.9 9.4H5.5Z"/><circle cx="3.6" cy="7.6" r="1.5"/><circle cx="12" cy="4.4" r="1.6"/><circle cx="20.4" cy="7.6" r="1.5"/><path class="book-ico__base" d="M5.6 19.4h12.8"/></svg>`,
    clock: () => '<svg class="book-ico book-ico--clock" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.4"/><path d="M12 7.4V12l3.2 2"/></svg>',
    bars: '<svg class="book-ico book-ico--bars" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="12" width="4" height="8.5" rx="1.2"/><rect x="10" y="5" width="4" height="15.5" rx="1.2"/><rect x="16.5" y="9" width="4" height="11.5" rx="1.2"/></svg>',
    time: '<svg class="book-ico book-ico--time" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.4"/><path d="M12 7.4V12l3.2 2"/></svg>',
    search: '<svg class="book-ico book-ico--search" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.6" cy="10.6" r="6.4"/><path d="m15.4 15.4 4.6 4.6"/></svg>',
    next: '<svg class="book-ico book-ico--next" viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 6 6 6-6 6"/></svg>',
    down: '<svg class="book-ico book-ico--down" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9.5 6 6 6-6"/></svg>',
    check: '<svg class="book-ico book-ico--group" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.6"/><path d="m8.2 12.3 2.6 2.6 5-5.4"/></svg>',
    cross: '<svg class="book-ico book-ico--group" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.6"/><path d="m9.2 9.2 5.6 5.6m0-5.6-5.6 5.6"/></svg>',
    minus: '<svg class="book-ico book-ico--group" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.6"/><path d="M8.4 12h7.2"/></svg>',
    pause: '<svg class="book-ico book-ico--group" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.6"/><path d="M12 7.6V12l3 1.8"/></svg>',
    person: '<svg class="book-ico book-ico--group" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="10" r="2.6"/><path d="M7.6 17.2c.9-2 2.5-3 4.4-3s3.5 1 4.4 3"/></svg>',
  };

  // 排序：空值总在最后；同值保持原来的先后
  function compare(a, b, by, dir = 1) {
    const x = a.sort?.[by], y = b.sort?.[by], nx = blank(x), ny = blank(y);
    if (nx || ny) return nx === ny ? 0 : nx ? 1 : -1;
    if (typeof x === 'string' || typeof y === 'string') return dir * String(x).localeCompare(String(y), 'zh-CN', { numeric: true, sensitivity: 'base' });
    return dir * (x - y);
  }
  // 搜索 + 排序，返回全部命中的行（分页另算）
  function arrange(rows, { query = '', sort = null } = {}) {
    const q = fold(query), at = new Map(rows.map((r, i) => [r, i]));
    const list = q ? rows.filter(r => !r.wide && fold(r.text).includes(q)) : rows.slice();
    if (sort?.by) list.sort((a, b) => compare(a, b, sort.by, sort.dir || 1) || at.get(a) - at.get(b));
    return list;
  }
  // 摘要卡挑出来的几行，同一行只进一张卡（先来先得）；marks 给账簿里那几行画皇冠、钟。
  // 挑不出来时：看得见的行里有没数的，卡上写“还在采集”（wait）；别的情况（行太少、都是私密行）这张卡不摆
  function rank(rows, picks = []) {
    const lists = {}, marks = new Map(), wait = {};
    for (const p of picks) {
      const pool = rows.filter(r => !r.wide && !blank(r.sort?.[p.by]) && !marks.has(r.key) && (!p.keep || p.keep(r)));
      lists[p.id] = arrange(pool, { sort: p }).slice(0, p.n || 3);
      lists[p.id].forEach((r, i) => marks.set(r.key, { pick: p.id, place: i + 1, mark: p.mark }));
      wait[p.id] = !lists[p.id].length && rows.some(r => !r.wide && r.text && blank(r.sort?.[p.by]));
    }
    return { lists, marks, wait };
  }
  // “再看 N 条”：本地还没摆出来的先摆；都摆完了、后端还有下一批（且没在搜索）才去取
  function moreLabel(left, hasNext, page = 20, query = '') {
    if (left > 0) return `再看 ${Math.min(page, left)} 条`;
    return hasNext && !fold(query) ? `再看 ${page} 条` : '';
  }

  function rowHtml(r, n, o) {
    if (r.wide) return `<tr class="book-row book-row--wide" data-key="${esc(r.key)}" style="--i:${n}"><td class="book-no"></td><td class="book-wide" colspan="${o.span - 1}">${r.wide}</td></tr>`;
    const m = o.marks.get(r.key), open = o.open.has(r.key);
    const icon = r.lamp || (m && ICON[m.mark] ? ICON[m.mark](m.place) : '');
    const cls = ['book-row', m && `is-${m.pick}`, m && `is-${m.pick}-${m.place}`, r.attention && 'is-attention', (r.detail || r.expand) && 'has-detail', open && 'is-open'].filter(Boolean).join(' ');
    const cells = o.columns.map((c, i) => {
      const v = r.cells?.[i] ?? '';
      if (i === 0) return `<td class="book-name"><span class="book-name__in"><span class="book-mark">${icon}</span><span class="book-name__text">${v}</span>${r.detail || r.expand ? `<button class="book-open" type="button" aria-expanded="${open}" aria-label="展开说明" data-book-open>${ICON.down}</button>` : ''}</span></td>`;
      if (c.bar) {
        const w = blank(r.bar) || !o.max ? 0 : Math.max(0, Math.min(100, r.bar / o.max * 100));
        return `<td class="book-bar">${blank(r.bar) ? '' : `<span class="book-bar__track"><i class="book-bar__fill${w > 0 ? '' : ' is-zero'}" style="--w:${w.toFixed(2)}%"></i></span>`}</td><td class="book-num">${v}</td>`;
      }
      return `<td class="book-cell book-cell--${esc(c.id || i)}">${v}</td>`;
    }).join('');
    return `<tr class="${cls}" data-key="${esc(r.key)}" style="--i:${n}"><td class="book-no">${String(n).padStart(2, '0')}</td>${cells}</tr>` +
      (r.detail ? `<tr class="book-detail" data-detail="${esc(r.key)}"${open ? '' : ' hidden'}><td></td><td colspan="${o.span - 1}"><div class="book-detail__in">${r.detail}</div></td></tr>` : '');
  }

  // 摆出来的那几行 → 两页（或一整页）的 HTML。rows 是已经搜过、排过、截到这一批的行；有 groups 时按组摆
  function pages(rows, o) {
    const columns = o.columns, span = 1 + columns.reduce((n, c) => n + (c.bar ? 2 : 1), 0);
    const opt = { ...o, span, open: o.open || new Set(), marks: o.marks || new Map() };
    const cols = `<colgroup><col class="book-col-no">${columns.map((c, i) => c.bar ? '<col class="book-col-bar"><col class="book-col-num">' : `<col class="book-col-${i ? esc(c.id || 'cell') : 'name'}">`).join('')}</colgroup>`;
    const head = `<thead><tr><th class="book-no" scope="col">#</th>${columns.map(c => `<th scope="col"${c.bar ? ' colspan="2"' : ''}>${esc(c.label)}</th>`).join('')}</tr></thead>`;
    const table = (list, start) => `<table class="book-table">${cols}${head}<tbody>${list.map((r, i) => rowHtml(r, start + i + 1, opt)).join('')}</tbody></table>`;
    if (o.groups) {
      const first = o.first || 5, opened = o.openGroups || new Set();
      return `<div class="book-page">${o.groups.map(g => {
        const list = rows.filter(r => r.group === g.id), open = opened.has(g.id), shown = open ? list : list.slice(0, first);
        const more = list.length > first ? `<button class="more book-group__more" type="button" data-book-group="${esc(g.id)}" aria-expanded="${open}">${open ? '收起' : `展开其余 ${list.length - first} 条`} <span class="more__chev">›</span></button>` : '';
        const head = g.head === false ? '' : `<p class="book-group__head">${ICON[g.icon] || ''}<b>${esc(g.title)}</b><span class="book-group__n">${esc(g.count ?? `（${list.length}）`)}</span></p>`;
        return `<section class="book-group${g.head === false ? ' book-group--bare' : ''}" data-group="${esc(g.id)}" data-tone="${esc(g.tone || 'gray')}">${head}` +
          table(shown, 0) + (list.length ? '' : `<p class="book-empty">${g.empty ?? o.empty ?? ''}</p>`) + more + '</section>';
      }).join('')}</div>`;
    }
    if (!rows.length) return `<div class="book-page"><p class="book-empty">${o.empty || ''}</p></div>${o.spread ? '<div class="book-page" aria-hidden="true"></div>' : ''}`;
    if (!o.spread) return `<div class="book-page">${table(rows, 0)}</div>`;
    const half = Math.ceil(rows.length / 2);
    return `<div class="book-page">${table(rows.slice(0, half), 0)}</div><div class="book-page">${rows.length > half ? table(rows.slice(half), half) : ''}</div>`;
  }

  function picksHtml(lists, picks, wait = {}) {
    return picks.map(p => {
      const list = lists[p.id] || [];
      if (!list.length && !wait[p.id]) return '';
      const items = list.length ? list.map(r => `<span class="book-pick__item"><span class="book-pick__name" title="${r.title ?? ''}">${r.title ?? ''}</span><span class="book-pick__val">${p.value ? p.value(r) : r.cells?.[p.cell] ?? ''}</span></span>`).join('')
        : `<span class="book-pick__none">${p.empty || UI().collectionText?.() || ''}</span>`;
      const sub = typeof p.sub === 'function' ? p.sub(list.length) : p.sub || '';
      return `<button type="button" class="book-pick" data-pick="${esc(p.id)}" data-tone="${esc(p.tone || 'green')}"${list.length ? '' : ' disabled'} data-mo-press><span class="book-pick__head">${ICON[p.icon] || ''}<b>${esc(p.title)}</b>${sub ? `<span class="book-pick__sub">${esc(sub)}</span>` : ''}${ICON.next}</span><span class="book-pick__list">${items}</span></button>`;
    }).join('');
  }

  function skeleton(o) {
    return (o.tools === false ? '<div class="book-tools" hidden>' : `<div class="book-tools${o.picks.length ? ' has-picks' : ''}">`) +
      `<label class="book-search">${ICON.search}<input type="search" placeholder="搜索${esc(o.name)}…" aria-label="搜索${esc(o.name)}" autocomplete="off" spellcheck="false" enterkeyhint="search"></label>` +
      (o.sorts.length > 1 ? `<label class="book-sort"><span class="book-sort__k">排序：</span><span class="book-sort__box"><select aria-label="排序">${o.sorts.map(s => `<option value="${esc(s.id)}">${esc(s.label)}</option>`).join('')}</select>${ICON.down}</span></label>` : '') +
      (o.picks.length ? `<div class="book-picks" style="--picks:${o.picks.length}"></div>` : '') +
      `</div><div class="book is-lit ${o.spread ? 'book--spread' : 'book--sheet'}${o.frame === 'plain' ? ' book--plain' : ' glass book--glass'}${o.groups ? ' book--groups' : ''}">` +
      `<div class="book__top"></div><div class="book__pages"></div><p class="book__caption" hidden></p>` +
      `<div class="book-foot" hidden><button class="book-more" type="button" data-mo-press><span class="book-more__t">再看 20 条</span>${ICON.down}</button></div>` +
      '<p class="book-found" role="status"></p></div>';
  }

  function create(host, options = {}) {
    const o = { name: '名称', columns: [], sorts: [{ id: 'given', label: '原来的顺序' }], picks: [], spread: true, page: 20, ...options };
    const first = o.spread ? o.page * 2 : o.page;
    const state = { rows: [], query: '', sort: o.sorts[0], shown: first, open: new Set(), openGroups: new Set(), groups: o.groups || null, hasNext: false, columns: o.columns, caption: '', empty: '', drawn: false, busy: false };
    host.classList.add('book-host');
    host.innerHTML = skeleton(o);
    const $ = s => host.querySelector(s);
    const el = { q: $('.book-search input'), sort: $('.book-sort select'), picks: $('.book-picks'), book: $('.book'), top: $('.book__top'), pages: $('.book__pages'), caption: $('.book__caption'), foot: $('.book-foot'), more: $('.book-more'), found: $('.book-found') };

    function draw(kind = 'data') {
      const list = arrange(state.rows, { query: state.query, sort: state.sort }), shown = state.groups ? list : list.slice(0, state.shown);
      const { lists, marks, wait } = rank(state.rows, o.picks);
      const max = state.rows.reduce((m, r) => blank(r.bar) ? m : Math.max(m, +r.bar), 0);
      const empty = state.query ? `没有找到名字里带“${esc(state.query.trim())}”的项` : state.empty;
      const spread = o.spread && (o.singleUntil == null || shown.length > o.singleUntil);
      el.book.classList.toggle('book--spread', spread);
      el.book.classList.toggle('book--sheet', !spread);
      const html = pages(shown, { columns: state.columns, spread, marks, open: state.open, max, empty, groups: state.groups, first: o.first, openGroups: state.openGroups });
      const rowsNow = () => [...el.pages.querySelectorAll('tbody > .book-row')];
      const before = rowsNow(), had = new Set(before.map(tr => tr.dataset.key));
      if ((kind === 'data' || kind === 'group') && state.drawn) UI().html(el.pages, html, kind === 'data');
      else { el.pages.innerHTML = html; el.pages._html = html; }
      // 局部更新不改 aria-expanded（共用件的约定），这里照状态对一遍
      el.pages.querySelectorAll('[data-book-group]').forEach(b => b.setAttribute('aria-expanded', String(state.openGroups.has(b.dataset.bookGroup))));
      el.pages.querySelectorAll('tr.book-row [data-book-open]').forEach(b => b.setAttribute('aria-expanded', String(state.open.has(b.closest('tr').dataset.key))));
      // 分组展开：只让新露出来的那几行浮出来
      if (kind === 'group') rowsNow().filter(tr => !had.has(tr.dataset.key)).forEach((tr, i) => { tr.style.setProperty('--k', String(Math.min(i, 24))); tr.classList.remove('is-new'); void tr.offsetWidth; tr.classList.add('is-new'); });
      // 新摆出来的行由上往下浮出来；第一次还让条从左边长出来
      else if (kind !== 'data' || !state.drawn) {
        const from = kind === 'more' ? before.length : 0;
        el.pages.querySelectorAll('tbody > .book-row').forEach((tr, i) => { if (i >= from) { tr.style.setProperty('--k', String(Math.min(i - from, 24))); tr.classList.add('is-new'); } });
        el.pages.classList.toggle('is-growing', !state.drawn);
      }
      state.drawn = true;
      if (el.picks) UI().html(el.picks, picksHtml(lists, o.picks, wait));
      el.caption.hidden = !state.caption; el.caption.innerHTML = state.caption || '';
      const label = state.groups ? '' : moreLabel(list.length - shown.length, state.hasNext, o.page, state.query);
      el.foot.hidden = !label; el.more.querySelector('.book-more__t').textContent = label || '再看';
      el.found.textContent = state.query.trim() && list.length ? `找到 ${list.length} 项` : '';
    }
    function set(rows, info = {}) {
      state.rows = Array.isArray(rows) ? rows : [];
      state.columns = info.columns || o.columns;
      state.caption = info.caption || '';
      state.empty = info.empty ?? '';
      state.hasNext = !!info.hasNext;
      if ('groups' in info) state.groups = info.groups || null;
      const keys = new Set(state.rows.map(r => r.key));
      for (const k of state.open) if (!keys.has(k)) state.open.delete(k);
      draw('data');
    }
    function sortBy(id) {
      state.sort = o.sorts.find(s => s.id === id) || o.sorts[0];
      if (el.sort) el.sort.value = state.sort.id;
      draw('view');
    }

    let typing = 0;
    el.q.addEventListener('input', () => {
      clearTimeout(typing);
      typing = setTimeout(() => { state.query = el.q.value; state.shown = first; draw('view'); }, 90);
    });
    el.q.addEventListener('keydown', e => { if (e.key === 'Escape' && el.q.value) { el.q.value = ''; state.query = ''; state.shown = first; draw('view'); } });
    el.sort?.addEventListener('change', () => sortBy(el.sort.value));
    // 有说明的行：点小箭头或这一行空白处都能展开；行里的按钮、链接照它们自己的
    el.pages.addEventListener('click', e => {
      // 分组的“展开其余 N 条 / 收起”
      const grp = e.target.closest('[data-book-group]');
      if (grp) {
        const id = grp.dataset.bookGroup, open = !state.openGroups.has(id);
        if (open) state.openGroups.add(id); else state.openGroups.delete(id);
        draw('group');
        if (open && e.isTrusted) {
          const ledger = /^\/live\/ledger(?:\/|$)/.test(location.pathname);
          window.Live?.markOpened?.(ledger ? 'card/ledger/book-group' : 'card/records/book-group');
        }
        const sec = [...el.pages.querySelectorAll('.book-group')].find(s => s.dataset.group === id);
        if (!open && sec && sec.getBoundingClientRect().top < 0) sec.scrollIntoView({ block: 'start', behavior: 'smooth' });
        return;
      }
      const own = e.target.closest('[data-book-open]');
      if (!own && (e.target.closest('a, button, input, select, textarea, label, summary') || String(getSelection?.() || ''))) return;
      const tr = e.target.closest('tr.book-row.has-detail'), btn = tr?.querySelector('[data-book-open]');
      if (!tr || !btn) return;
      const key = tr.dataset.key, detail = [...el.pages.querySelectorAll('tr[data-detail]')].find(d => d.dataset.detail === key);
      const open = !state.open.has(key);
      if (open) state.open.add(key); else state.open.delete(key);
      btn.setAttribute('aria-expanded', String(open));
      tr.classList.toggle('is-open', open);
      if (detail) detail.hidden = !open;
      if (open && e.isTrusted) window.Live?.markOpened?.('card/records/book-row');
    });
    el.picks?.addEventListener('click', e => {
      const btn = e.target.closest('[data-pick]');
      const p = btn && o.picks.find(x => x.id === btn.dataset.pick);
      if (!p) return;
      if (state.query) { el.q.value = ''; state.query = ''; }
      sortBy(p.sort);
      el.book.scrollIntoView({ block: 'start', behavior: 'smooth' });
      const rows = el.pages.querySelectorAll(`.book-row.is-${CSS.escape(p.id)}`);
      rows.forEach(tr => { tr.classList.remove('is-flash'); void tr.offsetWidth; tr.classList.add('is-flash'); });
    });
    el.more.addEventListener('click', async () => {
      if (state.busy) return;
      const left = arrange(state.rows, { query: state.query }).length - state.shown;
      if (left <= 0 && state.hasNext && o.more) {
        state.busy = true; el.more.disabled = true;
        try { await o.more(); } finally { state.busy = false; el.more.disabled = false; }
      }
      state.shown += o.page;
      draw('more');
    });
    return { set, sortBy, pages: el.pages, columns: o.columns, el };
  }

  window.LiveBook = { create, arrange, rank, pages, moreLabel, fold };
})();
