async () => {
  const issues = [], measurements = [], readable = new Map(), styles = new WeakMap(), measured = new Set(), tolerance = 3;
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
      const classes = [...node.classList].slice(0, 2).map(name => '.' + CSS.escape(name)).join(''), siblings = node.parentElement ? [...node.parentElement.children].filter(peer => peer.tagName === node.tagName) : [node];
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
  const raster = async (img, rect, width, height) => {
    const src = img.currentSrc || img.src || img.dataset.src; if (!readable.has(src)) readable.set(src, fetch(src, {mode: 'cors', credentials: 'omit', cache: 'force-cache', signal: AbortSignal.timeout(8000)}).then(async response => { if (!response.ok) throw Error('image-http-' + response.status); const blob = await response.blob(), sha256 = window.__uiGlyphs?.length && crypto.subtle ? [...new Uint8Array(await crypto.subtle.digest('SHA-256', await blob.arrayBuffer()))].map(value => value.toString(16).padStart(2, '0')).join('') : null; return {image: await createImageBitmap(blob), sha256}; }));
    const {image: source, sha256} = await readable.get(src), canvas = document.createElement('canvas'), ctx = canvas.getContext('2d'); canvas.width = width; canvas.height = height; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, width, height);
    const b = img.getBoundingClientRect(), s = css(img); let x = b.left, y = b.top, w = b.width, h = b.height;
    if (rect && /contain|cover/.test(s.objectFit)) { const scale = Math[s.objectFit === 'contain' ? 'min' : 'max'](w / source.width, h / source.height), pos = s.objectPosition.split(' '); w = source.width * scale; h = source.height * scale; x += (b.width - w) * (parseFloat(pos[0]) / 100 || 0); y += (b.height - h) * (parseFloat(pos[1]) / 100 || 0); }
    if (rect && (rect.left < x - tolerance || rect.top < y - tolerance || rect.right > x + w + tolerance || rect.bottom > y + h + tolerance)) throw Error('crop-outside-source');
    const crop = rect ? [(rect.left - x) * source.width / w, (rect.top - y) * source.height / h, rect.width * source.width / w, rect.height * source.height / h] : [0, 0, source.width, source.height]; ctx.drawImage(source, ...crop, 0, 0, width, height);
    return {data: ctx.getImageData(0, 0, width, height).data, width, height, crop, src, sha256}; };
  const ink = ({data, width: w, height: h}, known = []) => {
    const buckets = new Map(); for (let y = 4; y < h - 4; y += 2) for (let x = 4; x < w - 4; x += 2) { const i = (y * w + x) * 4, key = [0, 1, 2].map(channel => data[i + channel] >> 4).join(','); if (!buckets.has(key)) buckets.set(key, []); buckets.get(key).push(i); }
    const boundary = [...buckets.values()].sort((a, b) => b.length - a.length)[0]; if (!boundary?.length) return null;
    const background = [0, 1, 2].map(channel => { const values = boundary.map(i => data[i + channel]).sort((a, b) => a - b); return values[Math.floor(values.length / 2)]; }), mask = new Uint8Array(w * h), rows = new Uint16Array(h), cols = new Uint16Array(w);
    for (let i = 0; i < mask.length; i++) if (Math.max(...background.map((value, channel) => Math.abs(data[i * 4 + channel] - value))) > 48 && data[i * 4 + 3] > 96) { mask[i] = 1; rows[Math.floor(i / w)]++; cols[i % w]++; }
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if ((y < 8 || y >= h - 8) && rows[y] > w * .65 || (x < 8 || x >= w - 8) && cols[x] > h * .65) mask[y * w + x] = 0;
    const edgeSuppressed = cols.some((count, x) => count > h * .65 && (x >= 4 && x < 8 || x >= w - 8 && x < w - 4)) || rows.some((count, y) => count > w * .65 && (y >= 4 && y < 8 || y >= h - 8 && y < h - 4)), pieces = []; for (let start = 0; start < mask.length; start++) if (mask[start]) {
      const queue = [start], pixels = []; mask[start] = 0; for (let q = 0; q < queue.length; q++) { const i = queue[q], x = i % w, y = Math.floor(i / w); pixels.push(i); for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]]) { const nx = x + dx, ny = y + dy, n = ny * w + nx; if (nx >= 0 && nx < w && ny >= 0 && ny < h && mask[n]) { mask[n] = 0; queue.push(n); } } }
      const xs = pixels.map(i => i % w), ys = pixels.map(i => Math.floor(i / w)), box = {left: Math.min(...xs), right: Math.max(...xs) + 1, top: Math.min(...ys), bottom: Math.max(...ys) + 1}, bw = box.right - box.left, bh = box.bottom - box.top;
      if (pixels.length >= 3 && !(bw > w * .65 && bh <= 8 && (box.top < 8 || box.bottom > h - 8) || bh > h * .65 && bw <= 8 && (box.left < 8 || box.right > w - 8) || pixels.every(i => i % w < 8 || i % w >= w - 8 || Math.floor(i / w) < 8 || Math.floor(i / w) >= h - 8) && (bw > w * .4 || bh > h * .4) || bw <= 12 && bh <= 12 && (box.left < 12 || box.right > w - 12) && (box.top < 12 || box.bottom > h - 12))) pieces.push({box, pixels});
    }
    if (!pieces.length && !known.length) return null; const box = union(known.length ? known : pieces.map(piece => piece.box)), occupied = new Set(pieces.flatMap(piece => piece.pixels.map(i => Math.floor(i / w)))), bands = [];
    for (const y of [...occupied].sort((a, b) => a - b)) { if (!bands.length || y > bands.at(-1)[1] + 2) bands.push([y, y]); else bands.at(-1)[1] = y; }
    return {dx: number((box.left + box.right - w) / 2), dy: number((box.top + box.bottom - h) / 2), lines: bands.filter(band => band[1] - band[0] >= 3).length || (known.length ? null : 0), margins: {left: number(box.left), right: number(w - box.right), top: number(box.top), bottom: number(h - box.bottom)}, background, inkPixels: pieces.reduce((sum, piece) => sum + piece.pixels.length, 0), edgeSuppressed: !known.length && edgeSuppressed, frameMerged: !known.length && pieces.some(piece => piece.box.right - piece.box.left > w * .85 && piece.box.bottom - piece.box.top > h * .8), sample: [w, h], basis: known.length ? 'source-text-box' : 'raster-ink'}; };
  const all = [...document.querySelectorAll('body *')], imageGrids = all.filter(el => el.matches('.typeset-part') && visible(el) && el._layout?.cards?.length > 1);
  if (imageGrids.length) report('image-grid-review', imageGrids[0], {parts: imageGrids.map(el => ({element: selector(el), cardFrames: el._layout.cards.length})), reason: '底图卡片框不能证明文字归属和真实行列，仅检查已有DOM网格'});
  for (const el of all.filter(node => node.matches('.hotspot[data-typeset-kind="link"],.hotspot[data-typeset-kind="button"],.b2-image-action') && visible(node) && (!node.textContent.trim() || /transparent|rgba\([^)]*,\s*0\)/.test(css(node).color)) && text(node).length <= 16)) {
    const r = el.getBoundingClientRect(); if (r.width > 320 || r.height > 80 || r.width <= 70 || r.height <= 32) continue;
    const owner = el.closest('.typeset-live-flow-tile') || el.closest('.typeset-part') || el.parentElement, img = [...owner.querySelectorAll('img')].find(node => { const b = node.getBoundingClientRect(); return visible(node) && b.left <= r.left + tolerance && b.top <= r.top + tolerance && b.right >= r.right - tolerance && b.bottom >= r.bottom - tolerance; });
    try { if (!img) throw Error('no-corresponding-raster'); const sample = await raster(img, r, Math.ceil(r.width), Math.ceil(r.height)), record = window.__uiGlyphs?.find(entry => entry.sha256 && entry.sha256 === sample.sha256 && (new URL(entry.src, location.href).href === new URL(sample.src, location.href).href || sample.src.endsWith('/' + entry.src.split('/').pop()))), [x, y, w, h] = sample.crop;
      const known = (record?.boxes || []).filter(box => box.kind === 'text' && box.rect?.length === 4 && box.rect.every(Number.isFinite) && box.rect[2] > 0 && box.rect[3] > 0 && box.rect[0] >= x - 1 && box.rect[1] >= y - 1 && box.rect[0] + box.rect[2] <= x + w + 1 && box.rect[1] + box.rect[3] <= y + h + 1).map(({rect: [bx, by, bw, bh]}) => ({left: (bx - x) * sample.width / w, right: (bx + bw - x) * sample.width / w, top: (by - y) * sample.height / h, bottom: (by + bh - y) * sample.height / h}));
      const evidence = ink(sample, known); if (!evidence || evidence.lines === 0) throw Error('no-distinct-text-ink'); measurements.push({element: selector(el), text: text(el), ...evidence});
      if (evidence.inkPixels > r.width * r.height * .45 || evidence.frameMerged) report('image-text-pixels-review', el, {...evidence, reason: 'dense-or-frame-merged-ink'}); else { if (Math.abs(evidence.dx) > tolerance || Math.abs(evidence.dy) > tolerance) report('button-image-center', el, evidence); if (Math.min(...Object.values(evidence.margins)) <= 3) report('button-image-edge', el, evidence); if (evidence.edgeSuppressed) report('image-text-pixels-review', el, {...evidence, reason: 'inner-edge-line-ambiguous'}); if (evidence.lines > 1) report('button-image-wrap-review', el, evidence); }
    } catch (error) { report('image-text-unmeasurable', el, {reason: error.message, rect: {width: number(r.width), height: number(r.height)}}); }
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
    if (el.matches('[data-today-river] .boat,[data-today-river] .sign,[data-today-river] .alert') || el.querySelector('p,h1,h2,h3,h4') || r.height > 100 || !text(el)) continue;
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
    const parent = parents.every(item => item === parents[0]) ? parents[0] : el, labelBox = content(parent), wideLabel = parent !== el && labelBox.right - labelBox.left > label.right - label.left + 8;
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
      else {
        try { const pixels = (await raster(el, null, 16, 16)).data, colors = [...pixels].filter((v, i) => i % 4 !== 3); if (Math.min(...colors) > 220 && Math.max(...colors) - Math.min(...colors) < 3) report('image-empty-review', el, {src: src.slice(0, 180), sample: 'transparent-or-neutral-flat'}); }
        catch (error) { report('image-pixels-review', el, {src: src.slice(0, 180), reason: error.name}); }
      }
    } else {
      const shapes = [...el.querySelectorAll('path,rect,circle,ellipse,line,polyline,polygon,text,image,use,foreignObject')].filter(shape => !shape.closest('defs,clipPath,mask,symbol') && shown(shape));
      try { if (!shapes.some(shape => { const b = shape.getBBox(); return b.width + b.height > 0 && (css(shape).fill !== 'none' || css(shape).stroke !== 'none' || shape.matches('image,use,foreignObject')); })) report('svg-empty', el, {drawableElements: shapes.length}); }
      catch (error) { report('svg-review', el, {reason: error.name}); }
    }
  }
  for (const entry of readable.values()) { try { (await entry).image.close(); } catch {} }
  return {issues, counts: {buttons: buttons.length, grids: grids.length, images: images.length}, measurements};
}
