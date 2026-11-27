// 实况 · 智能体页：从首页智能体卡点某一家进来（?family=claude|codex|antigravity；后台旧链接带 ?host= 的也认）时，把这一家亮成绿框：
// 落在“三家干了多少”（#hours，首页那一行写的是这一家今天实际干了几小时）就亮这一家那条横条；落在“报了估时的活”（#work）就亮这一家那张卡。
// 滚动由 page.js 认网址里的 #。页面每轮读数整块重画，重画后再亮回去；只第一次淡入，之后不再重播，免得每轮闪一下。
(() => {
  'use strict';
  const p = new URLSearchParams(location.search), host = String(p.get('family') || p.get('host') || '').toLowerCase();
  if (!/^(claude|codex|antigravity)$/.test(host)) return;
  const root = document.getElementById('tp-root');
  if (!root) return;
  const target = location.hash === '#hours' ? `#hours .ag-hbar[data-pick="${host}"]` : `#work .ag-work[data-host="${host}"]`;
  let first = true;
  const mark = () => {
    const el = root.querySelector(target);
    if (!el || el.classList.contains('notice-target')) return;
    if (!first) el.style.animation = 'none';
    el.classList.add('notice-target');
    first = false;
  };
  new MutationObserver(mark).observe(root, { childList: true, subtree: true });
  mark();
})();
