// 档案卡：单条详情页的共用模版（一件事先用；以后“账本一条”“一类备份”这类单条详情照这个摆）。
// 页面照旧取数、照旧往各个槽（data-part、id）里写字；这里只管四件和排版有关的事：
//   split(句子)            一整句太长时拆成短标题和其余的话：只拆不改字，括号里的补充说明、第一句以后的话放进正文
//   sentence(一段话)        第一句和其余的话：“为什么”、经过每条先只摆一句
//   clamp(正文, 按钮)       正文超过五行先收着（按整行收，不切半行），下面一颗“展开全文”；没超就不出按钮
//   link({label, html, href, note})  相关链接的一行：图标、小字名目、名字，能点的整行都能点，后面一个“›”
//   init(根)               自动收卡：[data-auto] 的卡里 [data-fill] 都藏着就整张收起；[data-follow="某 id"] 跟着那一块藏；
//                         左栏整栏空了右栏的卡挪上来横着排（.dossier__grid 的 data-shape：two / main / side / none）；
//                         页头也可以放进左栏最上面（一个任务那页），算左栏有内容
// 样子在 live-dossier.css；出字、灯、按钮照旧走 LiveUI（fieldHtml、status、actions），这里不判灯、不改说法。
(() => {
  'use strict';
  const len = s => [...s].length;
  const OPEN = '（(', CLOSE = '）)';
  const tidyStart = s => s.replace(/^[\s，、；：。,;:]+/u, '');
  const tidy = s => tidyStart(s).replace(/[\s，、；：。,;:]+$/u, '');

  // 拆标题：30 字以内不拆。先试“括号外当标题、括号里当说明”（括号里要有一段像样的话），
  // 再试“第一句当标题”、“冒号前当标题”，句子特别长（60 字以上）才按 30 字以内最后一个逗号断。都不合适就整句当标题。
  function split(raw, { max = 30 } = {}) {
    const s = String(raw ?? '').trim();
    if (len(s) <= max) return { title: s, rest: '' };
    const chars = [...s], asides = [];
    let depth = 0, cur = '', outside = '', end = -1, colon = -1, soft = -1, broken = false;
    chars.forEach((ch, i) => {
      if (OPEN.includes(ch)) { if (depth++) cur += ch; else cur = ''; return; }
      if (CLOSE.includes(ch)) { if (!depth) { broken = true; outside += ch; return; } if (--depth) cur += ch; else asides.push(cur); return; }
      if (depth) { cur += ch; return; }
      outside += ch;
      if (end < 0 && /[。！？；;!?]/u.test(ch)) end = i;
      if (colon < 0 && ch === '：') colon = i;
      if (i <= max && /[，、：,:]/u.test(ch)) soft = i;
    });
    if (depth) broken = true;
    const title = tidy(outside), aside = asides.map(a => tidyStart(a.trim())).filter(Boolean).join('\n');
    if (!broken && len(aside) >= 16 && len(title) >= 4 && len(title) <= max + 12) return { title, rest: aside };
    const cut = i => ({ title: tidy(chars.slice(0, i).join('')), rest: tidyStart(chars.slice(i + 1).join('').trim()) });
    if (end >= 4 && end <= max + 12) { const r = cut(end); if (r.rest && len(r.title) >= 4) return r; }
    // “什么事：怎么回事”这种：冒号前当标题，冒号后当正文
    if (colon >= 6 && colon <= max + 12) { const r = cut(colon); if (r.rest) return r; }
    if (len(s) > max * 2 && soft >= 6) { const r = cut(soft); if (r.rest) return r; }
    return { title: s, rest: '' };
  }

  // 一段话的第一句和其余的话（“为什么”只摆一句、经过每条先摆一句，其余点开看或进原始记录）。
  function sentence(raw) {
    const s = String(raw ?? '').trim(), m = s.match(/^[\s\S]*?[。！？!?](?:[”’」』"])?/u);
    const head = m && m[0].trim().length < s.length ? m[0].trim() : s;
    return { head, rest: s.slice(head.length).trim() };
  }

  // 正文收着：量一下收着时有没有被截；被截才出“展开全文”。展开、收起记在正文上，重画内容不丢。
  function clamp(el, btn) {
    if (!el || !btn) return;
    if (!btn._dossier) {
      btn._dossier = true;
      btn.addEventListener('click', () => { el.classList.toggle('is-open'); label(); });
    }
    const label = () => {
      const open = el.classList.contains('is-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.innerHTML = `${open ? '收起' : '展开全文'} <span class="more__chev">›</span>`;
    };
    const measure = () => {
      if (el.hidden) { btn.hidden = true; return; }
      const open = el.classList.contains('is-open');
      el.classList.remove('is-open'); el.style.removeProperty('--lead-cut'); el.classList.add('is-clamped');
      const over = el.scrollHeight > el.clientHeight + 2;
      // 按整行收：五行高度以内最后一整行的底（段与段之间有空隙，直接按高度切会切到半行）
      if (over) {
        const top = el.getBoundingClientRect().top, limit = el.clientHeight + 0.5, range = document.createRange(), line = parseFloat(getComputedStyle(el).lineHeight) || 0;
        range.selectNodeContents(el);
        // 字的框比行矮，补上半个行距才是这一行的底
        const cut = Math.max(0, ...[...range.getClientRects()].map(r => r.bottom - top + Math.max(0, (line - r.height) / 2)).filter(b => b <= limit));
        if (cut) el.style.setProperty('--lead-cut', `${Math.ceil(cut)}px`);
      }
      el.classList.toggle('is-clamped', over);
      el.classList.toggle('is-open', open && over);
      btn.hidden = !over; label();
    };
    measure();
    document.fonts?.ready?.then(measure);
  }

  function link({ label, html, href = '', note = '' }) {
    const esc = window.LiveUI.esc;
    const name = href ? `<a class="dossier-link__name" href="${esc(href)}">${html}</a>` : `<span class="dossier-link__name">${html}</span>`;
    return `<div class="dossier-link${href ? ' has-href' : ''}"><span class="dossier-link__icon" aria-hidden="true"></span><span class="dossier-link__text"><small class="dossier-link__label">${esc(label)}</small>${name}${note ? `<small class="dossier-link__note">${note}</small>` : ''}</span>${href ? '<span class="dossier-link__chev" aria-hidden="true">›</span>' : ''}</div>`;
  }

  const visible = card => !card.hidden && !card.parentElement?.closest('[hidden]');
  function fit(root) {
    for (const el of root.querySelectorAll('[data-follow]')) { const h = !!document.getElementById(el.dataset.follow)?.hidden; if (el.hidden !== h) el.hidden = h; }
    for (const card of root.querySelectorAll('.dossier-card[data-auto]')) { const h = !card.querySelector('[data-fill]:not([hidden])'); if (card.hidden !== h) card.hidden = h; }
    const grid = root.querySelector('.dossier__grid');
    if (!grid) return;
    const main = grid.querySelector('.dossier__main'), side = grid.querySelector('.dossier__side');
    const reading = !!main && !main.hidden && !!main.dataset.read && !['gone', 'unavailable'].includes(main.dataset.read);
    const has = box => !!box && !box.hidden && ([...box.querySelectorAll('.dossier-card, .dossier__hero')].some(visible) || !!box.dataset.read);
    const a = has(main), b = has(side);
    const shape = reading || a && b ? 'two' : a ? 'main' : b ? 'side' : 'none';
    if (grid.dataset.shape !== shape) grid.dataset.shape = shape;
  }
  function init(root = document.querySelector('.dossier')) {
    if (!root || root._dossier) return;
    root._dossier = true;
    let queued = false;
    const run = () => { queued = false; fit(root); };
    new MutationObserver(() => { if (!queued) { queued = true; queueMicrotask(run); } })
      .observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'data-read'] });
    fit(root);
  }

  window.LiveDossier = { split, sentence, clamp, link, fit, init };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init()); else init();
})();
