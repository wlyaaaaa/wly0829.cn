// Migrated from rescue-sweep-dom.js; run only after the runner has settled fonts, images and lazy content.
window.scanGlance = config => {
  const t = config.thresholds, q = config.selectors, allow = e => !!e.closest(q.overlap_allow);
  const body = document.body || document.documentElement, vw = document.documentElement.clientWidth || innerWidth;
  const norm = s => String(s || '').replace(/\s+/gu, ' ').trim(), styles = new WeakMap(), selectors = new WeakMap(), states = new WeakMap();
  const css = e => { if (!styles.has(e)) styles.set(e, getComputedStyle(e)); return styles.get(e); };
  const sel = e => { if (selectors.has(e)) return selectors.get(e); const parts = []; let a = e;
    while (a) { if (a.id) { parts.unshift('#' + CSS.escape(a.id)); break; } const tag = a.tagName.toLowerCase(); const siblings = a.parentElement ? [...a.parentElement.children].filter(x => x.tagName === a.tagName) : [a]; parts.unshift(tag + (siblings.length > 1 ? ':nth-of-type(' + (siblings.indexOf(a) + 1) + ')' : '')); a = a.parentElement; }
    const value = parts.join(' > '); selectors.set(e, value); return value; };
  const rect = r => ({ x: Math.round((r.left + scrollX) * 10) / 10, y: Math.round((r.top + scrollY) * 10) / 10, width: Math.round(r.width * 10) / 10, height: Math.round(r.height * 10) / 10 });
  const pack = (e, text, why, extra = {}, r = e.getBoundingClientRect()) => ({ selector: sel(e), text: norm(text).slice(0, t.excerpt_chars), rect: rect(r), message: why, ...extra });
  // 收起的 details 里，只有它自己的 summary 会画出来；嵌套 details 的 summary 也算被收起。浏览器能判时再用 checkVisibility 复核（display:contents 没有盒子，取最近有盒子的祖先）。
  const folded = e => { for (let d = e.closest('details:not([open])'); d; d = d.parentElement && d.parentElement.closest('details:not([open])')) { const own = [...d.children].find(c => c.tagName === 'SUMMARY'); if (!own || !own.contains(e)) return true; }
    let a = e; while (a && css(a).display === 'contents') a = a.parentElement; return !!a && typeof a.checkVisibility === 'function' && !a.checkVisibility({ contentVisibilityAuto: true }); };
  const state = e => { if (states.has(e)) return states.get(e); let skip = !!e.closest('script,style,noscript,template') || folded(e), why = [], alpha = 1;
    for (let a = e; a; a = a.parentElement) { const s = css(a), r = a.getBoundingClientRect(); if (s.display === 'none' || (r.width <= t.clip_px && r.height <= t.clip_px && /absolute|fixed/u.test(s.position) && /hidden|clip/u.test(s.overflow))) skip = true; alpha *= Number(s.opacity); if (Number(s.opacity) === 0) why.push('opacity=0: ' + sel(a)); if (/hidden|collapse/u.test(s.visibility)) why.push('visibility=' + s.visibility); }
    const value = { skip, why, alpha }; states.set(e, value); return value; };
  const visible = e => { const s = state(e), r = e.getBoundingClientRect(); return !s.skip && !s.why.length && r.width > 0 && r.height > 0 && r.right > 0 && r.left < vw && !!paint(r, e); };
  const paint = (q, e) => { let left = q.left, right = q.right, top = q.top, bottom = q.bottom;
    for (let a = e; a; a = a.parentElement) { const s = css(a), b = a.getBoundingClientRect(); if (/^(hidden|clip|auto|scroll)$/u.test(s.overflowX)) { left = Math.max(left, b.left + parseFloat(s.borderLeftWidth || 0)); right = Math.min(right, b.right - parseFloat(s.borderRightWidth || 0)); } if (/^(hidden|clip|auto|scroll)$/u.test(s.overflowY)) { top = Math.max(top, b.top + parseFloat(s.borderTopWidth || 0)); bottom = Math.min(bottom, b.bottom - parseFloat(s.borderBottomWidth || 0)); } }
    return right > left && bottom > top ? { left, right, top, bottom, width: right - left, height: bottom - top } : null; };
  const controlRect = e => [...e.getClientRects()].filter(r => r.width > 0 && r.height > 0).sort((a,b) => b.width*b.height-a.width*a.height)[0] || e.getBoundingClientRect();
  const owner = e => { let a = e; while (a.parentElement && a !== body && /^(inline|contents)$/u.test(css(a).display)) a = a.parentElement; return a; };
  const hidden = [], clipped = [], overlaps = [], blank = [], placeholders = [], dates = [], duplicateHeadings = [], duplicateCards = [], overflowElements = [], records = [];
  const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT); let node;
  while ((node = walker.nextNode())) { const e = node.parentElement, text = norm(node.nodeValue); if (!e || !/[\p{L}\p{N}\uFFFD]|\{\{/u.test(text) || e.closest('svg,[aria-hidden="true"],[role="presentation"],[role="none"],.sr-only,.visually-hidden,.visuallyhidden,.screen-reader-only,.screen-reader-text,.sr_only,.visually-hidden-focusable:not(:focus-within)') || state(e).skip) continue;
    const range = document.createRange(); range.selectNodeContents(node); const rs = [...range.getClientRects()].filter(r => r.width > t.text_rect_px && r.height > t.text_rect_px); if (!rs.length) continue;
    const why = [...state(e).why]; if (/rgba\([^)]*,\s*0\)/u.test(css(e).color) && !parseFloat(css(e).webkitTextStrokeWidth)) why.push('文字颜色完全透明'); if (rs.every(r => r.right <= 0 || r.left >= vw)) why.push('全部文字位于页面左右范围之外'); records.push({ e, node, text, rs, r: range.getBoundingClientRect(), block: owner(e), why }); }
  // 裁切和重叠都按实际字形判断：先用文字行框找候选，再逐字用 Range 取字框，按 canvas 字形度量缩到墨迹范围复核。
  const ink = document.createElement('canvas').getContext('2d'), inkCache = new WeakMap();
  const glyphs = r => { if (inkCache.has(r.node)) return inkCache.get(r.node); const s = css(r.e), text = r.node.nodeValue, range = document.createRange(), out = []; ink.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
    for (let i = 0; i < text.length;) { const ch = String.fromCodePoint(text.codePointAt(i)); if (/\S/u.test(ch)) { range.setStart(r.node, i); range.setEnd(r.node, i + ch.length); const m = ink.measureText(ch), fa = m.fontBoundingBoxAscent, fd = m.fontBoundingBoxDescent;
      for (const z of range.getClientRects()) { if (z.width <= 0 || z.height <= 0) continue; const ky = fa + fd > 0 ? z.height / (fa + fd) : 1, kx = m.width > 0 ? z.width / m.width : 1;
        out.push({ left: z.left - m.actualBoundingBoxLeft * kx, right: z.left + m.actualBoundingBoxRight * kx, top: z.top + (fa - m.actualBoundingBoxAscent) * ky, bottom: z.top + (fa + m.actualBoundingBoxDescent) * ky }); } } i += ch.length; }
    inkCache.set(r.node, out); return out; };
  const inkPaint = r => glyphs(r).map(p => paint(p, r.e)).filter(Boolean), inkOverlap = (a, b) => inkPaint(a).some(p => inkPaint(b).some(q => Math.min(p.right, q.right) - Math.max(p.left, q.left) > t.glyph_overlap_px && Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top) > t.glyph_overlap_px));
  const texts = records.filter(r => !r.why.length), hiddenSeen = new Set(), clippedSeen = new Set(), textMap = new Map(), groups = new Map();
  const exposed = new Set(texts.filter(r => r.rs.some(q => { const p = paint(q, r.e); return p && p.right > 0 && p.left < vw; })));
  for (const r of records) if (r.why.length && !hiddenSeen.has(r.e)) { hiddenSeen.add(r.e); hidden.push(pack(r.e, r.text, r.why.join('; '), {}, r.r)); }
  for (const r of texts) { if (exposed.has(r)) { for (let a = r.e; a; a = a.parentElement) if (/^(A|ARTICLE|LI|SECTION|H1|H2|H3)$/u.test(a.tagName)) { if (!textMap.has(a)) textMap.set(a, []); textMap.get(a).push(r.text); }
    for (const a of new Set([r.block, r.block.parentElement].filter(Boolean))) { if (!groups.has(a)) groups.set(a, []); groups.get(a).push(r.text); } }
    for (let a = r.e; a; a = a.parentElement) { const s = css(a), b = a.getBoundingClientRect(), left = b.left + parseFloat(s.borderLeftWidth || 0), right = b.right - parseFloat(s.borderRightWidth || 0), top = b.top + parseFloat(s.borderTopWidth || 0), bottom = b.bottom - parseFloat(s.borderBottomWidth || 0);
      const bounded = a.matches(q.clip_bounds), x = bounded || /^(hidden|clip)$/u.test(s.overflowX), y = bounded || /^(hidden|clip)$/u.test(s.overflowY), out = z => (x && (z.left < left - t.clip_tolerance_px || z.right > right + t.clip_tolerance_px)) || (y && (z.top < top - t.clip_tolerance_px || z.bottom > bottom + t.clip_tolerance_px)), escaped = r.rs.some(out) && glyphs(r).some(out);
      const scrollExcess=(/^(hidden|clip)$/u.test(s.overflowX)&&a.scrollWidth>a.clientWidth+t.clip_tolerance_px)||(/^(hidden|clip)$/u.test(s.overflowY)&&a.scrollHeight>a.clientHeight+t.clip_tolerance_px), scaled=s.transform!=='none'||[...a.children].some(e=>css(e).transform!=='none');
      if ((x || y) && (escaped || (scrollExcess&&!scaled&&a===r.e))) { const key = sel(r.e) + '|' + sel(a); if (!clippedSeen.has(key)) { clippedSeen.add(key); clipped.push(pack(r.e, r.text, '文字越出画布、卡片或裁剪容器: ' + sel(a), { clipSelector: sel(a), clipRect: rect(b), scrollWidth:a.scrollWidth,clientWidth:a.clientWidth,scrollHeight:a.scrollHeight,clientHeight:a.clientHeight }, r.r)); } } }
    if (!exposed.has(r)) continue; const rx = /(?<![\p{L}\p{N}_])(?:TODO|undefined|NaN|null|lorem)(?![\p{L}\p{N}_])|\{\{|\uFFFD/giu; let match;
    while ((match = rx.exec(r.text))) placeholders.push(pack(r.e, r.text.slice(Math.max(0, match.index - 75), match.index + match[0].length + 90), '可见正文中的占位词或损坏字符', { match: match[0] }, r.r)); }
  const flat = [...exposed].flatMap(r => r.rs.map(q => paint(q, r.e)).filter(Boolean).map(q => ({ ...r, q }))).sort((a, b) => a.q.top - b.q.top), overlapSeen = new Set();
  for (let i = 0; i < flat.length; i++) for (let j = i + 1; j < flat.length && flat[j].q.top < flat[i].q.bottom - t.overlap_px; j++) { const a = flat[i], b = flat[j];
    if (a.e === b.e || a.block === b.block || a.e.contains(b.e) || b.e.contains(a.e) || allow(a.e) || allow(b.e)) continue; const width = Math.min(a.q.right, b.q.right) - Math.max(a.q.left, b.q.left), height = Math.min(a.q.bottom, b.q.bottom) - Math.max(a.q.top, b.q.top);
    if (width <= t.overlap_px || height <= t.overlap_px || !inkOverlap(a, b)) continue; const key = [sel(a.e), sel(b.e)].sort().join('|'); if (overlapSeen.has(key)) continue; overlapSeen.add(key); overlaps.push(pack(a.e, a.text, '两段文字的实际字形相交', { otherSelector: sel(b.e), otherText: b.text.slice(0, t.excerpt_chars), otherRect: rect(b.q), intersection: { width, height } }, a.q)); }
  const media = [...body.querySelectorAll('img,svg,canvas,video,' + q.cards)].filter(visible).map(e => ({ e, rs: [e.getBoundingClientRect()] })), painted = [...texts, ...media].map(r => ({ e: r.e, rs: r.rs.map(z => paint(z, r.e)).filter(Boolean) }));
  for (const e of body.querySelectorAll('section.ts-screen')) { if (!visible(e)) continue; const b = e.getBoundingClientRect(), occupied = [];
    for (const r of painted) if (e.contains(r.e)) for (const z of r.rs) { const top = Math.max(b.top, z.top), bottom = Math.min(b.bottom, z.bottom); if (bottom > top && z.right > Math.max(0, b.left) && z.left < Math.min(vw, b.right)) occupied.push([top, bottom]); }
    occupied.sort((a, c) => a[0] - c[0]); let end = b.top; const gap = to => { const height = to - end; if (height > innerHeight * t.screen_blank_viewport_fraction) blank.push(pack(e, (textMap.get(e) || []).join(' '), '屏内连续竖向空带超过视口高度阈值', { gapHeight: Math.round(height), viewportFraction:height/innerHeight }, { left: b.left, top: end, width: b.width, height })); };
    for (const interval of occupied) { gap(interval[0]); end = Math.max(end, interval[1]); } gap(b.bottom); }
  for (const row of body.querySelectorAll('.row')) { if (!visible(row)) continue; const b=row.getBoundingClientRect(), scope=row.closest('.ts-o') || row;
    if (css(row).display === 'flex' && css(row).flexDirection === 'column') continue; // 顺序堆叠没有横向短栏；屏级空带仍照常测量。
    for(const e of [...row.children].filter(e=>!state(e).skip&&!state(e).why.length&&e.getBoundingClientRect().width>0)) { const c=e.getBoundingClientRect(); let bottom=b.top;
      for(const r of painted) if(e.contains(r.e) || (scope.contains(r.e) && !row.contains(r.e))) for(const z of r.rs) if((z.left+z.right)/2>=c.left && (z.left+z.right)/2<=c.right && z.bottom>b.top && z.top<b.bottom) bottom=Math.max(bottom,Math.min(b.bottom,z.bottom));
      const height=b.bottom-bottom; if(height>t.row_blank_px && height>b.height*t.row_blank_fraction) blank.push(pack(e,'','栏底空白同时超过像素与行高比例阈值',{rowSelector:sel(row),gapHeight:height,rowHeight:b.height,fraction:height/b.height},{left:c.left,top:bottom,width:c.width,height})); } }
  // 比较横排文字卡的真实内容，不把拉齐后的卡框高度算作内容。
  const imbalance = [], imbalanceSeen = new Set(), content = [...texts, ...media.filter(r => r.e.matches('img,svg,canvas,video'))];
  for (const row of body.querySelectorAll(q.imbalance_rows)) {
    if (!visible(row) || row.matches('.feature-masonry-grid') || (css(row).display === 'flex' && css(row).flexDirection.startsWith('column'))) continue;
    const bands = [];
    for (const e of row.children) {
      if (!visible(e) || !texts.some(r => e.contains(r.e))) continue;
      const b = e.getBoundingClientRect(), boxes = content.filter(r => e.contains(r.e)).flatMap(r => r.rs.map(z => paint(z, r.e)).filter(Boolean));
      if (!boxes.length) continue;
      const bottom = Math.max(...boxes.map(z => z.bottom)), height = bottom - b.top;
      if (height <= 0) continue;
      const item = { e, b, height, bottom }, band = bands.find(g => g.some(a =>
        Math.min(a.b.bottom, b.bottom) > Math.max(a.b.top, b.top) &&
        Math.min(a.b.right, b.right) <= Math.max(a.b.left, b.left) + t.clip_px));
      if (band) band.push(item); else bands.push([item]);
    }
    for (const band of bands) {
      if (band.length < 2) continue;
      band.sort((a, b) => b.height - a.height);
      const [high, next] = band, ratio = high.height / next.height, difference = high.height - next.height;
      if (ratio <= t.imbalance_ratio || difference <= t.imbalance_px || imbalanceSeen.has(high.e)) continue;
      imbalanceSeen.add(high.e);
      imbalance.push(pack(high.e, high.e.textContent, '横排卡片最高内容与次高内容同时超过比例和像素差阈值',
        { rowSelector: sel(row), contentHeight: high.height, nextContentHeight: next.height, ratio, difference,
          peers: band.map(a => ({ selector: sel(a.e), contentHeight: a.height, contentBottom: a.bottom + scrollY, frameRect: rect(a.b) })) },
        { left: high.b.left, top: high.b.top, width: high.b.width, height: high.height }));
    }
  }
  const dateSeen = new Set(), datePattern = /(?:19|20)\d{2}(?:[年./-]\d{1,2})?(?:[月./-]\d{1,2}日?)?|\d{1,2}月\d{1,2}日|\d{1,2}:\d{2}/u;
  for (const [e, pieces] of groups) { const text = norm(pieces.join(' ')), rx = /最新|截至|更新时间|数据时间|今日|当前/gu; let match;
    while ((match = rx.exec(text))) { const context = text.slice(Math.max(0, match.index - 70), match.index + 110); if (!datePattern.test(context) || dateSeen.has(context)) continue; dateSeen.add(context); dates.push(pack(e, context, '原文包含时点词及邻近日期，需按文章语义核对')); } }
  const fullText = e => norm((textMap.get(e) || []).join(' ')), headings = new Map();
  for (const e of body.querySelectorAll('h1,h2,h3')) { const text = fullText(e); if (!text || !visible(e)) continue; if (!headings.has(text)) headings.set(text, []); headings.get(text).push(e); }
  for (const [text, es] of headings) if (es.length > 1) duplicateHeadings.push(pack(es[0], text, '可见标题原文相同', { count: es.length, selectors: es.map(sel), rects: es.map(e => rect(e.getBoundingClientRect())) }));
  const parents = new Map(); for (const e of body.querySelectorAll('a,article,li,section')) { const text = fullText(e); if (text.length <= t.duplicate_card_chars || !visible(e)) continue; if (!parents.has(e.parentElement)) parents.set(e.parentElement, new Map()); const map = parents.get(e.parentElement), key = e.tagName + '\u0000' + text; if (!map.has(key)) map.set(key, []); map.get(key).push(e); }
  for (const map of parents.values()) for (const es of map.values()) if (es.length > 1) duplicateCards.push(pack(es[0], fullText(es[0]), '同父、同类型卡片完整可见文字相同', { count: es.length, selectors: es.map(sel), rects: es.map(e => rect(e.getBoundingClientRect())) }));
  for (const e of new Set([...texts.map(r => r.e), ...body.querySelectorAll('img')])) { if (!visible(e)) continue; const b = e.getBoundingClientRect(); if (b.left >= -t.clip_px && b.right <= vw + t.clip_px) continue;
    const probes = texts.filter(r => r.e === e).flatMap(r => r.rs); if (e.tagName === 'IMG') probes.push(b); if (!probes.some(q => { const p = paint(q, e); return p && p.right > 0 && p.left < vw; })) continue;
    let scrollable = false; for (let a = e; a && a !== body; a = a.parentElement) if (/^(auto|scroll)$/u.test(css(a).overflowX) && a.scrollWidth > a.clientWidth + t.clip_px) scrollable = true;
    if (!scrollable) overflowElements.push(pack(e, texts.filter(r => r.e === e).map(r => r.text).join(' ') || e.alt || '', '可见正文或图片元素越出页面左右范围')); }
  const images = [...body.querySelectorAll('img')].filter(e => visible(e) && (!e.complete || !e.naturalWidth)).map(e => pack(e, e.alt || '', '稳定后可见 img 未加载成功', { currentSrc: e.currentSrc, src: e.getAttribute('src') ? e.src : '', complete: e.complete, naturalWidth: e.naturalWidth }));
  const imageSources = e => [...(e.matches('img') ? [e] : e.querySelectorAll('img'))].filter(i => visible(i) && (!i.complete || !i.naturalWidth)).map(i => i.currentSrc || (i.getAttribute('src') ? i.src : ''));
  for(const e of body.querySelectorAll(q.loading)) if(visible(e)) images.push(pack(e,e.textContent,'稳定后加载占位仍可见',{imageSources:imageSources(e.parentElement)}));
  for(const e of body.querySelectorAll(q.image_frames)) { const b=e.getBoundingClientRect(); if(!visible(e) || b.width<=t.image_frame_px || b.height<=t.image_frame_px) continue;
    const content=[e,...e.querySelectorAll('img,svg,canvas,video')].some(a=>visible(a) && ((a.tagName==='IMG' && a.complete && a.naturalWidth>0) || /^(SVG|CANVAS|VIDEO)$/iu.test(a.tagName) || /url\(/u.test(css(a).backgroundImage))); if(!content) images.push(pack(e,e.textContent,'超过图框尺寸阈值但没有可见图像',{imageSources:imageSources(e)})); }
  const links = [...body.querySelectorAll('a[href]')].map(e => ({ href: e.href, text: norm(e.innerText || e.textContent).slice(0, t.excerpt_chars) }));
  const imageGroups=new Map(); for(const e of body.querySelectorAll('main img')){const b=e.getBoundingClientRect();if(!visible(e)||b.width<t.duplicate_image_width||b.height<t.duplicate_image_height||!e.currentSrc)continue;const key=e.currentSrc;if(!imageGroups.has(key))imageGroups.set(key,[]);imageGroups.get(key).push(e);}
  const duplicateImages=[...imageGroups].filter(([src,es])=>es.length>1).map(([src,es])=>pack(es[0],es[0].alt,'同一页重复可见大图',{src,count:es.length,rects:es.map(e=>rect(e.getBoundingClientRect()))}));
  const blocked=[], probes=[...exposed].filter(r=>!allow(r.e)).flatMap(r=>r.rs.map(z=>({e:r.e,text:r.text,r:z,kind:'text',x:(z.left+z.right)/2+scrollX,y:(z.top+z.bottom)/2+scrollY}))), origin={x:scrollX,y:scrollY}, coveredSeen=new Set();
  for(const e of body.querySelectorAll('a,button,[role="button"]')) if(visible(e)) {const r=controlRect(e);probes.push({e,r,kind:'control',x:(r.left+r.right)/2+scrollX,y:(r.top+r.bottom)/2+scrollY});}
  probes.sort((a,b)=>a.y-b.y); let bucket=-1;
  for(const p of probes) { const next=Math.floor(p.y/(innerHeight*t.probe_band_fraction)); if(next!==bucket){bucket=next;scrollTo({top:Math.max(0,next*innerHeight*t.probe_band_fraction-innerHeight*t.probe_margin_fraction),left:origin.x,behavior:'instant'});} const current=p.kind==='control'?controlRect(p.e):null,x=current?(current.left+current.right)/2:p.x-scrollX,y=current?(current.top+current.bottom)/2:p.y-scrollY; if(x<0 || x>=innerWidth || y<0 || y>=innerHeight) continue; const hit=document.elementFromPoint(x,y);
    if(p.kind==='control') {const e=p.e, disabled=e.disabled || e.getAttribute('aria-disabled')==='true', reason=norm(e.dataset.disabledReason || e.getAttribute('aria-description') || (e.getAttribute('aria-describedby') || '').split(/\s+/u).map(id=>document.getElementById(id)?.textContent).join(' ')), written=reason || new RegExp(q.disabled_reason_pattern,'u').test(norm(e.title+' '+e.textContent)); if(css(e).pointerEvents==='none' || !hit || (hit!==e && !e.contains(hit)) || (disabled && !written)) blocked.push(pack(e,e.textContent,disabled&&!written?'禁用却没有说明原因':css(e).pointerEvents==='none'?'pointer-events 为 none':'中心点被其他元素挡住',{blocker:hit?sel(hit):null}, {left:p.r.left,top:p.r.top+origin.y-scrollY,width:p.r.width,height:p.r.height})); }
    else { const disabledPaint=media.filter(r=>{if(css(r.e).pointerEvents!=='none'||allow(r.e)||!r.e.matches('img,canvas,video,'+q.cards))return false;const z=r.e.getBoundingClientRect();return x>=z.left&&x<=z.right&&y>=z.top&&y<=z.bottom;}).map(r=>[r.e,r.e.getAttribute('style')]); try { for(const [e] of disabledPaint)e.style.setProperty('pointer-events','auto','important'); const cover=document.elementFromPoint(x,y)?.closest('img,canvas,video,'+q.cards);
      if(!cover || cover.contains(p.e) || p.e.contains(cover) || allow(cover) || state(cover).alpha<t.opaque_alpha) continue; const s=css(cover), opaque=/^(IMG|CANVAS|VIDEO)$/u.test(cover.tagName) || (s.backgroundImage!=='none') || /rgb\(/u.test(s.backgroundColor) || /rgba\([^,]+,[^,]+,[^,]+,\s*1\)/u.test(s.backgroundColor), key=sel(p.e)+'|'+sel(cover); if(opaque&&!coveredSeen.has(key)){coveredSeen.add(key);overlaps.push(pack(p.e,p.text,'文字中心被不透明图片或卡片盖住',{otherSelector:sel(cover)},{left:p.r.left,top:p.r.top+origin.y-scrollY,width:p.r.width,height:p.r.height}));}
    } finally { for(const [e,style] of disabledPaint)style===null?e.removeAttribute('style'):e.setAttribute('style',style); } } }
  scrollTo({top:origin.y,left:origin.x,behavior:'instant'});
  const classify=(category,rows)=>rows.map(r=>({category,...r}));
  return {title:document.title,height:Math.max(body.scrollHeight,document.documentElement.scrollHeight),links,failures:[...classify('blank',blank),...classify('imbalance',imbalance),...classify('overlap',overlaps),...classify('clipped',clipped),...classify('image',images),...classify('blocked',blocked)],hints:[...classify('hidden',hidden),...classify('placeholder',placeholders),...classify('duplicate_heading',duplicateHeadings),...classify('duplicate_card',duplicateCards),...classify('duplicate_image',duplicateImages),...classify('overflow',overflowElements),...classify('date',dates)]};
};
void 0;
