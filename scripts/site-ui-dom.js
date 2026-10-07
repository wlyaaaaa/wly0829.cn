() => {
  const issues = [], styles = new WeakMap(), measured = new Set(), tolerance = 3;
  const css = el => styles.get(el) || (styles.set(el, getComputedStyle(el)), styles.get(el));
  const number = value => Math.round(value * 10) / 10;
  const text = el => (el.innerText || el.textContent || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 80);
  const shown = el => {
    for (let node = el; node; node = node.parentElement) {
      const s = css(node);
      if (node.hidden || s.display === 'none' || /hidden|collapse/.test(s.visibility) || Number(s.opacity) === 0) return false;
    }
    return true;
  };
  const visible = el => { const r = el.getBoundingClientRect(); return shown(el) && r.width > 0 && r.height > 0; };
  const selector = el => {
    const parts = [];
    for (let node = el; node && parts.length < 4; node = node.parentElement) {
      if (node.id) { parts.unshift('#' + CSS.escape(node.id)); break; }
      const classes = [...node.classList].slice(0, 2).map(name => '.' + CSS.escape(name)).join('');
      const siblings = node.parentElement ? [...node.parentElement.children].filter(peer => peer.tagName === node.tagName) : [node];
      parts.unshift(node.localName + classes + (siblings.length > 1 ? `:nth-of-type(${siblings.indexOf(node) + 1})` : ''));
    }
    return parts.join(' > ');
  };
  const report = (kind, el, evidence) => issues.push({kind, element: selector(el), evidence: {text: text(el), ...evidence}});
  const union = rects => ({left: Math.min(...rects.map(r => r.left)), right: Math.max(...rects.map(r => r.right)), top: Math.min(...rects.map(r => r.top)), bottom: Math.max(...rects.map(r => r.bottom))});
  const content = el => {
    const r = el.getBoundingClientRect(), s = css(el), inset = side => (parseFloat(s['border' + side + 'Width']) || 0) + (parseFloat(s['padding' + side]) || 0);
    return {left: r.left + inset('Left'), right: r.right - inset('Right'), top: r.top + inset('Top'), bottom: r.bottom - inset('Bottom')};
  };
  const all = [...document.querySelectorAll('body *')];
  for (const el of all.filter(node => node.matches('a.hotspot[data-typeset-kind="link"][aria-label][href="/cockpit/#pc"]') && visible(node) && !node.textContent.trim() && node.getAttribute('aria-label').length <= 16)) {
    const r = el.getBoundingClientRect(); if (r.width <= 320 && r.height <= 80) report('image-text-unmeasurable', el, {rect: {x: number(r.left), y: number(r.top), width: number(r.width), height: number(r.height)}, status: 'coverage-gap', reason: '文字在图片里，DOM无法量居中'});
  }
  const buttons = all.filter(el => {
    if (!visible(el)) return false;
    if (el.matches('button,[role="button"],input[type="button"],input[type="submit"]')) return true;
    if (!el.matches('a[href]') || el.closest('nav') || el.matches('.nav-link,.hotspot') || el.querySelector('p,h1,h2,h3,h4,small')) return false;
    const s = css(el), r = el.getBoundingClientRect();
    return /(^|[\s_-])(btn|button)([\s_-]|$)/i.test(el.className) || (r.height <= 80 && text(el).length <= 48 && parseFloat(s.borderLeftWidth) > 0 && parseFloat(s.borderRightWidth) > 0 && parseFloat(s.paddingLeft) >= 8);
  });
  for (const el of buttons) {
    const r = el.getBoundingClientRect();
    if (el.querySelector('p,h1,h2,h3,h4') || r.height > 100 || !text(el)) continue;
    const rects = [], parents = [], walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let node; (node = walker.nextNode());) {
      const parent = node.parentElement, value = node.textContent;
      if (!value.trim() || !visible(parent) || parent.closest('svg,.icon,.sr-only,.visually-hidden,[aria-hidden="true"],[role="tooltip"]') || /transparent|rgba\([^)]*,\s*0\)/.test(css(parent).color)) continue;
      const range = document.createRange(); range.setStart(node, value.search(/\S/)); range.setEnd(node, value.trimEnd().length);
      rects.push(...[...range.getClientRects()].filter(box => box.width > 0 && box.height > 0)); parents.push(parent);
    }
    if (!rects.length) continue; measured.add(el);
    const label = union(rects), box = content(el), icons = [...el.querySelectorAll('svg,img,.icon')].filter(visible).map(icon => icon.getBoundingClientRect());
    const group = union([...rects, ...icons]), lineTops = [];
    for (const rect of rects) if (!lineTops.some(top => Math.abs(top - rect.top) < Math.max(3, rect.height * .35))) lineTops.push(rect.top);
    if (lineTops.length > 1) report(el.querySelector('small') || text(el).length > 48 ? 'button-wrap-review' : 'button-wrap', el, {lines: lineTops.length, height: number(r.height)});
    const parent = parents.every(item => item === parents[0]) ? parents[0] : el;
    const labelBox = content(parent), wideLabel = parent !== el && labelBox.right - labelBox.left > label.right - label.left + 8;
    const horizontal = wideLabel ? (label.left + label.right - labelBox.left - labelBox.right) / 2 : (group.left + group.right - box.left - box.right) / 2;
    const vertical = (label.top + label.bottom - box.top - box.bottom) / 2;
    if (Math.abs(horizontal) > tolerance || Math.abs(vertical) > tolerance) report('button-center', el, {dx: number(horizontal), dy: number(vertical), basis: wideLabel ? 'text-container' : icons.length ? 'text-and-icons' : 'content-box'});
    const overflow = {left: number(box.left - group.left), right: number(group.right - box.right), top: number(box.top - group.top), bottom: number(group.bottom - box.bottom)};
    if (Object.values(overflow).some(value => value > tolerance) || el.scrollWidth > el.clientWidth + tolerance || el.scrollHeight > el.clientHeight + tolerance) report('button-overflow', el, {...overflow, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth});
  }
  for (const parent of new Set(buttons.map(el => el.parentElement))) {
    const peers = buttons.filter(el => el.parentElement === parent && measured.has(el));
    for (let i = 0; i < peers.length; i++) for (let j = i + 1; j < peers.length; j++) {
      const a = peers[i].getBoundingClientRect(), b = peers[j].getBoundingClientRect();
      if (Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) < Math.min(a.height, b.height) * .6 || a.left < b.right && b.left < a.right) continue;
      const evidence = {peer: selector(peers[j]), heights: [number(a.height), number(b.height)], tops: [number(a.top), number(b.top)]};
      if (Math.abs(a.height - b.height) > tolerance) report('button-row-height', peers[i], evidence);
      if (Math.abs(a.top - b.top) > tolerance || Math.abs(a.bottom - b.bottom) > tolerance) report('button-row-align', peers[i], evidence);
    }
  }
  const grids = all.filter(el => visible(el) && /^(inline-)?grid$/.test(css(el).display) && (/card|grants|stats|steps|(^|[-\s])grid($|\s)/.test(el.className) || [...el.children].filter(visible).every(child => child.matches('article,.card,[class*="-card"]'))));
  for (const grid of grids) {
    const children = [...grid.children].filter(visible).map(el => ({el, r: el.getBoundingClientRect()})), rows = [];
    if (children.length < 3) continue;
    for (const item of children.sort((a, b) => a.r.top - b.r.top || a.r.left - b.r.left)) {
      let row = rows.find(group => Math.abs(group[0].r.top - item.r.top) <= tolerance);
      if (!row) rows.push(row = []); row.push(item);
    }
    const first = rows[0], last = rows[rows.length - 1];
    if (rows.length < 2 || first.length < 2 || last.length >= first.length) continue;
    const rtl = css(grid).direction === 'rtl', edge = row => rtl ? Math.max(...row.map(item => item.r.right)) : Math.min(...row.map(item => item.r.left));
    const shift = edge(last) - edge(first);
    if (Math.abs(shift) > tolerance) report('grid-row-offset', grid, {firstRow: first.length, lastRow: last.length, shift: number(shift), last: selector(last[0].el)});
  }
  const images = all.filter(el => el.matches('img,svg') && visible(el));
  for (const el of images) {
    const src = el.currentSrc || el.getAttribute('src') || '', marker = [src, el.getAttribute('alt'), el.getAttribute('class')].join(' ');
    if (/placeholder|placehold\.(co|it)|dummyimage|占位|待替换|missing[-_](image|asset)/i.test(marker)) report('image-placeholder', el, {src: src.slice(0, 180)});
    if (el.localName === 'img') {
      if (!src) report(el.matches('[data-src],[data-lazy-src]') ? 'image-not-loaded-review' : 'image-source-missing', el, {lazySource: (el.dataset.src || el.dataset.lazySrc || '').slice(0, 180)});
      else if (el.complete && !el.naturalWidth) report('image-load-failed', el, {src: src.slice(0, 180), complete: true, naturalWidth: 0});
      else if (!el.complete) report('image-not-loaded-review', el, {src: src.slice(0, 180), complete: false});
    } else {
      const shapes = [...el.querySelectorAll('path,rect,circle,ellipse,line,polyline,polygon,text,image,use,foreignObject')].filter(shape => !shape.closest('defs,clipPath,mask,symbol') && shown(shape));
      try { if (!shapes.some(shape => { const b = shape.getBBox(); return b.width + b.height > 0 && (css(shape).fill !== 'none' || css(shape).stroke !== 'none' || shape.matches('image,use,foreignObject')); })) report('svg-empty', el, {drawableElements: shapes.length}); }
      catch (error) { report('svg-review', el, {reason: error.name}); }
    }
  }
  return {issues, counts: {buttons: buttons.length, grids: grids.length, images: images.length}};
}
