// 实况 · 智能体页：从首页智能体卡点某一家进来（?family=claude|codex|antigravity#work；后台旧链接带 ?host= 的也认）时，
// 停在“三家各干了多少活”那块（滚动由 page.js 认 #work），把这一家那一格亮成绿框。
// 页面每轮读数整块重画，重画后再亮回去；只第一次淡入，之后不再重播，免得每轮闪一下。
(() => {
  'use strict';
  const p = new URLSearchParams(location.search), host = String(p.get('family') || p.get('host') || '').toLowerCase();
  if (!/^(claude|codex|antigravity)$/.test(host)) return;
  const root = document.getElementById('tp-root');
  if (!root) return;
  let first = true;
  const mark = () => {
    const el = root.querySelector(`#work .ag-work[data-host="${host}"]`);
    if (!el || el.classList.contains('notice-target')) return;
    if (!first) el.style.animation = 'none';
    el.classList.add('notice-target');
    first = false;
  };
  new MutationObserver(mark).observe(root, { childList: true, subtree: true });
  mark();
})();
