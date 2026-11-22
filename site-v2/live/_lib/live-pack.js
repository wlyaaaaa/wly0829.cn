// 多栏卡片的自动排版（M486/M487 的共用做法，原先只在项目页“最近成品”里）：
// 卡高矮不一时，按顺序把每张卡放进当时最矮的一栏，同一栏里卡贴着卡排，不按同排最高的卡留白；第一排从左到右仍是前几张。
// “先列几张”和“展开后其余”是前后两张清单：展开后后一张接着前一张每栏的底往下排，两块之间不再空一截（接缝）。
// 卡里点“展开”只拉长自己那一栏，别的卡不换栏；栏数变了（窗口宽度）、卡的顺序变了，或页面调 reset() 时才重新分栏。
//
//   const pack = LivePack.create([先列的 ul, 展开后的 ul], { min: 330, gap: 24 });   // 栏数按宽度算：每栏至少 min 宽
//   const pack = LivePack.create([...], { cols: 2, gap: 24 });                         // 固定几栏
//   pack.fit();     // 清单内容换了以后调一次（卡长高、窗口变宽窄、展开收起会自己跟上）
//   pack.reset();   // 下次 fit 时重新分栏（例：“展开全部／收起全部”）
// 收着的那张清单（在没打开的 .fold 或 <details> 里）不参与排；打开以后接着排。
(() => {
  'use strict';
  const shown = ul => !ul.closest('.fold:not(.is-open), details:not([open])') && ul.getClientRects().length > 0;
  // 刚进来的卡还在从 0 撑开（LiveUI.list 的进场动画）：按撑开以后的高度分栏，不然一进来几张都量成 2px、全挤进同一栏，另一栏下面空一大截（M056）
  const grown = li => {
    const grow = li.getAnimations?.().find(a => a.playState !== 'finished' && a.effect?.getKeyframes?.().at(-1)?.height);
    const end = grow ? parseFloat(grow.effect.getKeyframes().at(-1).height) : NaN;
    return Number.isFinite(end) ? Math.max(end, li.offsetHeight) : li.offsetHeight;
  };

  // 后一张清单往上提以后，它和外面那层（展开的盒子）的空处会盖住上面几栏的底：空处让点击穿过去，卡和“收起”照常能点
  function through(ul, value, first) {
    for (let el = ul; el && !el.contains(first); el = el.parentElement) {
      el.style.pointerEvents = value;
      for (const child of el.children) if (child.matches('li, summary, button')) child.style.pointerEvents = value ? 'auto' : '';
    }
  }

  function create(lists, { min = 330, gap = 24, cols: fixed = 0 } = {}) {
    const assigned = new Map();
    let colsUsed = 0, order = [], queued = false;
    const columns = () => fixed || Math.max(1, Math.floor((lists[0].clientWidth + gap) / (min + gap)));

    function fit() {
      queued = false;
      const cols = columns(), visible = lists.filter((ul, i) => i === 0 || shown(ul));
      const cards = visible.flatMap(ul => [...ul.children].filter(li => !li.classList.contains('is-leaving')));
      if (!cards.length || cards.some(li => !grown(li))) return;
      const keys = cards.map(li => li.dataset.key || '');
      const prefix = (a, b) => a.every((k, i) => b[i] === k);
      if (cols !== colsUsed || !(prefix(order, keys) || prefix(keys, order))) assigned.clear();
      colsUsed = cols; order = keys;
      const heights = Array(cols).fill(0);
      for (const ul of lists) {
        if (!visible.includes(ul)) { ul.style.marginTop = ''; through(ul, '', lists[0]); continue; }
        Object.assign(ul.style, { display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, columnGap: `${gap}px`, rowGap: '0', gridAutoRows: '1px', alignItems: 'start', columns: 'auto' });
        // 后一张清单从上面最矮那一栏的底开始，每栏再各自往下错开，接着上面排
        const base = Math.min(...heights);
        if (ul !== lists[0]) {
          ul.style.marginTop = '0px';
          const above = lists[0].getBoundingClientRect().top + Math.max(...heights), top = ul.getBoundingClientRect().top;
          ul.style.marginTop = `${base - Math.max(...heights) - (top - above)}px`;
          through(ul, 'none', lists[0]);
        }
        for (const li of ul.children) {
          if (li.classList.contains('is-leaving')) continue;
          const key = li.dataset.key || '';
          let col = assigned.get(key);
          if (col == null || col >= cols) { col = heights.indexOf(Math.min(...heights)); assigned.set(key, col); }
          const span = Math.ceil(grown(li)) + gap;
          Object.assign(li.style, { gridColumn: String(col + 1), gridRow: `${heights[col] - base + 1} / span ${span}`, margin: '0' });
          heights[col] += span;
        }
      }
    }
    const later = () => { if (!queued) { queued = true; requestAnimationFrame(fit); } };
    const watch = new ResizeObserver(later);
    const seen = new WeakSet();
    const observe = () => {
      for (const ul of lists) {
        for (const el of [ul, ...ul.children, ul.closest('.fold, details')].filter(Boolean)) if (!seen.has(el)) { seen.add(el); watch.observe(el); }
      }
    };
    for (const ul of lists) ul.closest('details')?.addEventListener('toggle', later);
    return {
      fit() { observe(); fit(); },
      reset() { assigned.clear(); colsUsed = 0; later(); },
    };
  }

  window.LivePack = { create };
})();
