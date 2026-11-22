// 分组看板（共用模版）：一长串分好组的清单，摆成横排几栏的看板。样子照本人 11-17 20:15 点头的设计图“新模版 · 分组看板”。
// 每组一张卡：卡头（圆徽章、组名和件数、一句小字、右边一幅淡出去的插画），下面一张小表（列名一行、先摆几行），
// 底边“展开（还有 N 条）”，展开后在卡里接着往下摆，再往后“继续看 ›”按批取。卡按栏摆（瀑布流）：
// 一张卡展开只把它这一栏往下推，别的栏不动；哪张卡放哪一栏在卡的组成变了时才重排，展开、收起都不挪。
//
// 页面只管把每张卡的字和每一行准备好，看板负责摆、量高、单看一组：
//   const board = LiveBoard.create(host, {
//     columns: [{ label: '任务名', width: 'minmax(0, 1.3fr)' }, …],   // 列名（可以带 HTML）和宽；每行照同一套列宽对齐
//     cols: 3,                                                       // 几栏
//   });
//   const card = board.card(id, { icon: 'sparkle', tint: 'gold', art: 'ai' });   // 同一个 id 只建一次
//     每组一色：tint 写光圈色板里的名字（green、lilac、cyan、blue、aqua、pink、peach、gold，对应 _lib/live.css 的 --glow-*），
//       卡头的淡彩渐变和圆徽章都用这个色；不给 tint 就按建卡顺序从 AUTO 里轮一个（不轮到绿，免得一片绿），所以每张卡都有颜色、没有灰图标。
//       渐变和徽章有多浓只在 live-board.css 的 --lb-head-a、--lb-head-b、--lb-badge-a 三个变量里改。
//     icon 是徽章里的小图名（PATH 里那些，见 LiveBoard.icon），线条跟着组的颜色走。
//     art 是卡头右边插画的名字：卡上写 data-art，页面的 CSS 给 .lb-card[data-art="ai"] 写 --lb-art（值是 /live/img/ 下那张图的 url）；不给就没有插画。
//   card = { el, title, sub, main, rest, more, next, box }   // 卡头两行、先摆的行、展开里的行、展开按钮、“继续看”、展开的盒子
//   look 还可以给 last: true（这张卡总排在最后）、ids: { el, title, main, rest, more, box, next }（给各部分起 id，页面原来按 id 找的照旧找得到）
//   columns 给空数组就是“卡片清单”：不写列名行，每一行是页面自己排的一小张卡（类名用 lb-item）
//   board.layout()        // 卡换了顺序后调一次：照卡的高矮重新分栏（卡出现、消失看板自己会重排）
//   board.only(id|null)   // 只看一组（整宽摆这一张）；null 回到全部
// 一行的样子（页面写 HTML，类名照下面，U.list 照旧管增删）：
//   <li class="row lb-row" data-key="…"><span class="lb-row__lamp">灯</span>
//     <p class="lb-cell lb-cell--name"><a class="row__title" href=详情地址>名字</a></p>  ← 名字的链接撑满整行，点行的空处也进详情
//     <p class="lb-cell">…</p> …（列数和 columns 一样）<div class="row__acts">按钮</div>
//     <p class="lb-row__extra row__sub">要留意的原因等，有才写</p></li>
// 名字最多两行、说明最多两行，再长的省略，全文到详情看。视口固定 1440，不按屏宽换排版；手机上整页缩小。
(() => {
  'use strict';
  const PATH = {
    sparkle: '<path d="M12 3.2l1.9 5.1 5.1 1.9-5.1 1.9L12 17.2l-1.9-5.1L5 10.2l5.1-1.9z"/><path d="M18.6 14.6l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    wrench: '<path d="M14.6 4.2a4.6 4.6 0 0 0-4.9 6.1l-5.3 5.3a1.9 1.9 0 0 0 2.7 2.7l5.3-5.3a4.6 4.6 0 0 0 6.1-4.9l-2.8 2.8-2.6-.6-.6-2.6z"/>',
    chip: '<rect x="6.5" y="6.5" width="11" height="11" rx="2.2"/><rect x="9.6" y="9.6" width="4.8" height="4.8" rx=".8"/><path d="M9.5 3.5v3M14.5 3.5v3M9.5 17.5v3M14.5 17.5v3M3.5 9.5h3M3.5 14.5h3M17.5 9.5h3M17.5 14.5h3"/>',
    stack: '<ellipse cx="12" cy="6.4" rx="7" ry="2.6"/><path d="M5 6.4v5.4c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6.4"/><path d="M5 11.8v5.4c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-5.4"/>',
    mic: '<rect x="9" y="3.4" width="6" height="10.4" rx="3"/><path d="M6 11.2a6 6 0 0 0 12 0M12 17.2v3.4M9 20.6h6"/>',
    wifi: '<path d="M3.6 9.4a12 12 0 0 1 16.8 0M6.6 12.6a7.6 7.6 0 0 1 10.8 0M9.6 15.7a3.4 3.4 0 0 1 4.8 0"/><circle cx="12" cy="18.6" r="1.2"/>',
    box: '<path d="M12 3.4l7.6 4v9.2L12 20.6l-7.6-4V7.4z"/><path d="M4.4 7.4L12 11.4l7.6-4M12 11.4v9.2"/>',
    loop: '<path d="M8.4 8.6c-2-2-5.4-.6-5.4 2.6s3.4 4.6 5.4 2.6l7.2-5.2c2-2 5.4-.6 5.4 2.6s-3.4 4.6-5.4 2.6z" transform="translate(0 .8)"/>',
    moon: '<path d="M18.4 14.6A7.4 7.4 0 0 1 9.4 5.6a7.4 7.4 0 1 0 9 9z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3.6v2.2M12 18.2v2.2M3.6 12h2.2M18.2 12h2.2M6 6l1.6 1.6M16.4 16.4L18 18M6 18l1.6-1.6M16.4 7.6L18 6"/>',
    chat: '<path d="M5 5.6h14a1.6 1.6 0 0 1 1.6 1.6v8a1.6 1.6 0 0 1-1.6 1.6h-8.2L6.6 20v-3.2H5a1.6 1.6 0 0 1-1.6-1.6v-8A1.6 1.6 0 0 1 5 5.6z"/><path d="M8.4 11.2h.01M12 11.2h.01M15.6 11.2h.01"/>',
    check: '<circle cx="12" cy="12" r="8.4"/><path d="M8.2 12.2l2.6 2.6 5-5.2"/>',
    play: '<path d="M8.4 5.6v12.8L18.6 12z"/>',
    plus: '<circle cx="12" cy="12" r="8.4"/><path d="M12 8.2v7.6M8.2 12h7.6"/>',
    refresh: '<path d="M19 12a7 7 0 1 1-2.1-5"/><path d="M17.4 3.8v3.4H14"/>',
    alert: '<path d="M12 4.2l8.4 14.6H3.6z"/><path d="M12 10v4M12 16.6h.01"/>',
    clock: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.6V12l3 1.8"/>',
    search: '<circle cx="10.8" cy="10.8" r="6"/><path d="M15.4 15.4l4.4 4.4"/>',
  };
  // 页面没给颜色时按建卡顺序轮的颜色（光圈色板里的名字，不含绿）
  const AUTO = ['gold', 'aqua', 'lilac', 'blue', 'peach', 'cyan', 'pink'];
  const icon = (name, cls = '') => `<svg class="lb-ico${cls ? ` ${cls}` : ''}" viewBox="0 0 24 24" aria-hidden="true">${PATH[name] || PATH.gear}</svg>`;

  function create(host, { columns = [], cols = 3, unit = 4, gap = 22, lead = '' } = {}) {
    const grid = document.createElement('div');
    grid.className = 'lb';
    grid.style.setProperty('--lb-cols', String(cols));
    grid.style.setProperty('--lb-grid', columns.map(c => c.width || 'minmax(0, 1fr)').join(' '));
    grid.style.setProperty('--lb-gap', `${gap}px`);
    host.append(grid);
    const cards = new Map(), place = new Map();
    let placed = '', single = null, tints = 0;
    // 页面把某张卡藏起来或放出来（hidden），看板自己重新分栏
    const shift = typeof MutationObserver === 'function' ? new MutationObserver(() => layout()) : null;
    // 卡的高随内容变（展开、收起、翻下一批、数到了）：量到就改它占的行数，下面的卡跟着上下挪
    const fit = el => {
      if (el.hidden || !el.isConnected) return;
      const h = el.getBoundingClientRect().height;
      const span = Math.max(1, Math.ceil((h + gap) / unit));
      if (el.style.gridRowEnd !== `span ${span}`) el.style.gridRowEnd = `span ${span}`;
    };
    const watch = typeof ResizeObserver === 'function' ? new ResizeObserver(entries => entries.forEach(e => fit(e.target))) : null;

    function card(id, look = {}) {
      if (cards.has(id)) return cards.get(id);
      const el = document.createElement('section');
      el.className = `lb-card glass${columns.length ? '' : ' lb-card--items'}`;
      el.dataset.key = id;
      el.dataset.tint = look.tint || AUTO[tints++ % AUTO.length];
      if (look.art) el.dataset.art = look.art;
      el.innerHTML = `<header class="lb-card__head"><span class="lb-card__badge">${icon(look.icon)}</span>`
        + '<div class="lb-card__words"><h2 class="lb-card__title"></h2><p class="lb-card__sub"></p></div>'
        + (look.art ? '<span class="lb-card__art" aria-hidden="true"></span>' : '') + '</header>'
        + (columns.length ? `<div class="lb-card__cols" aria-hidden="true"><span></span>${columns.map(c => `<span>${c.label}</span>`).join('')}<span></span></div>` : '')
        + '<ul class="rows list lb-rows"></ul>'
        + '<div class="fold lb-fold"><div><ul class="rows list lb-rows"></ul><button class="more lb-card__next" type="button" hidden data-needs-pc>继续看 ›</button></div></div>'
        + '<button class="more lb-card__more" type="button" hidden></button>';
      const tail = [...cards.values()].find(c => c.last);
      if (tail && !look.last) grid.insertBefore(el, tail.el); else grid.append(el);
      const [main, rest] = el.querySelectorAll('ul');
      const c = { id, el, title: el.querySelector('.lb-card__title'), sub: el.querySelector('.lb-card__sub'), main, rest,
        more: el.querySelector('.lb-card__more'), next: el.querySelector('.lb-card__next'), box: el.querySelector('.lb-fold'), last: !!look.last };
      for (const [part, name] of Object.entries(look.ids || {})) if (c[part] && name) c[part].id = name;
      cards.set(id, c);
      watch?.observe(el);
      shift?.observe(el, { attributes: true, attributeFilter: ['hidden'] });
      queueMicrotask(() => layout());   // 新来的卡：等页面这一轮写完再一起分栏
      return c;
    }

    // 分栏：照页面给的顺序，一张张放进当下最矮的那一栏（一样高时放左边），所以第一排从左到右就是前几组
    function layout(force = false) {
      const featured = cards.get(lead)?.el;
      if (featured && featured !== grid.firstElementChild) grid.prepend(featured);
      const byEl = new Map([...cards.values()].map(c => [c.el, c]));
      const shown = [...grid.children].map(el => byEl.get(el)).filter(c => c && !c.el.hidden && !c.el.classList.contains('is-away'));
      const key = shown.map(c => c.id).join('\u0001');
      if (force || key !== placed) {
        placed = key;
        const heights = Array.from({ length: cols }, () => 0);
        for (const c of shown.filter(c => c.id !== lead)) {
          const k = heights.indexOf(Math.min(...heights));
          place.set(c.id, k + 1);
          heights[k] += c.el.getBoundingClientRect().height + gap;
        }
        if (lead) place.set(lead, heights.indexOf(Math.min(...heights)) + 1);
      }
      for (const c of cards.values()) {
        c.el.style.gridColumn = single === c.id ? '1 / -1' : String(place.get(c.id) || 1);
        // 先按估计的行数放好，免得量到之前一帧叠在一起
        fit(c.el);
      }
    }

    function only(id) {
      single = id && cards.has(id) ? id : null;
      grid.classList.toggle('is-single', !!single);
      for (const c of cards.values()) c.el.classList.toggle('is-away', !!single && c.id !== single);
      layout(true);
      return single ? cards.get(single) : null;
    }

    return { el: grid, card, layout, only, get: id => cards.get(id), get single() { return single; } };
  }

  window.LiveBoard = { create, icon };
})();
