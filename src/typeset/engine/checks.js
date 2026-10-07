// 浏览器里的自检取数：G1 文字、G2 实测字高、G3 版面、G5 热区、G4 标题图位置、G6 同角色字号。
() => {
  const page = document.querySelector('#page');
  const res = {text: '', issues: [], minGlyph: 999, minGlyphAt: '', hot: [], titles: [], roles: {}};
  // 字体内容区比例：100px 的“国”字 Range 高度 / 100
  // 每种字体各量一次：100px 的“国M”Range 高度 / 100 = 内容区比例；实测字高 = 行框里字形矩形高 / 比例
  const ratios = {};
  const ratioFor = (fam, weight, cjk = true, size = 100) => {
    const k = fam + '|' + weight + '|' + cjk + '|' + size;
    if (ratios[k]) return ratios[k];
    const probe = document.createElement('span');
    probe.style.cssText = 'font-size:' + size + 'px;line-height:1;position:absolute;left:-9999px;top:0';  // 和被量的字同号量，免得整像素取整误差
    probe.style.fontFamily = fam; probe.style.fontWeight = weight;
    probe.textContent = cjk ? '国M' : 'M'; document.body.appendChild(probe);  // 纯西文段只用西文量：等宽字体没有汉字，混量会被后备字体撑高
    const pr = document.createRange(); pr.selectNodeContents(probe);
    ratios[k] = pr.getBoundingClientRect().height / size; probe.remove();
    return ratios[k];
  };

  // G1：按 DOM 顺序取看得见的字（含 data-text），跳过 data-echo
  const parts = [];
  const textRects = [];  // 看得见的字的行框：[rect, 文字开头]
  const tw = document.createTreeWalker(page, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let n;
  while ((n = tw.nextNode())) {
    if (n.nodeType === 1) {
      if (n.closest('[data-echo]')) continue;
      if (n.dataset && n.dataset.text) parts.push(n.dataset.text);
      continue;
    }
    const el = n.parentElement;
    if (!n.textContent.trim() || el.closest('[data-echo]')) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    parts.push(n.textContent);
    // G2：实测字形高（跳过标题图下的透明对照字）
    if (el.closest('.ghost')) continue;
    // 旋转过的字（如竖版把“→”转成向下）：外框高不等于字高，按字号算（13:50 裁定第 9 条的框架缺陷）
    let rotated = false;
    for (let e = el; e && e !== page; e = e.parentElement) {
      const m = getComputedStyle(e).transform.match(/^matrix\(([^)]+)\)/);
      if (m && Math.abs(parseFloat(m[1].split(',')[1])) > 0.01) { rotated = true; break; }
    }
    if (rotated) {
      const g = parseFloat(cs.fontSize);
      if (g < res.minGlyph) { res.minGlyph = g; res.minGlyphAt = n.textContent.trim().slice(0, 12); }
      continue;
    }
    const r = document.createRange(); r.selectNodeContents(n);
    for (const rect of r.getClientRects()) {
      if (rect.width < 1) continue;
      if (cs.color !== 'rgba(0, 0, 0, 0)' && !el.closest('[aria-hidden="true"], .deco')) textRects.push([rect, n.textContent.trim().slice(0, 8)]);
      const g = rect.height / ratioFor(cs.fontFamily, cs.fontWeight, /[⺀-鿿＀-￯　-〿]/.test(n.textContent), parseFloat(cs.fontSize));
      if (g < res.minGlyph) { res.minGlyph = g; res.minGlyphAt = n.textContent.trim().slice(0, 12); }
    }
  }
  res.text = parts.join('');
  // G1 补查：排版记号不该画出来（canon 会把它们从两边都去掉，所以逐字比较看不出）
  const marks = (res.text.match(/[〔〕【】［］｜]|\*\*/g) || []);
  if (marks.length) res.issues.push('G1 画出了排版记号 ' + [...new Set(marks)].join(' ') + ' 共 ' + marks.length + ' 处');

  // G3：溢出（卡片根元素的叶子装饰故意探出，卡内文字另查）
  for (const el of page.querySelectorAll('*')) {
    if (el.closest('svg') || el.closest('[aria-hidden="true"], .deco') || el.classList.contains('bubble') || el.classList.contains('card') || el.classList.contains('steps')) continue;
    if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).display !== 'inline')
      res.issues.push('G3 横向溢出：' + (el.className || el.tagName) + ' ' + (el.innerText || '').slice(0, 12));
  }
  const pw = page.getBoundingClientRect();
  // 底图（字故意压在上面的背景画，如地图群岛底景）：data-underlay，或绝对定位、铺满父框九成以上的图
  const isUnderlay = e => {
    if (e.closest('[data-underlay]')) return true;
    if (e.tagName !== 'IMG' || getComputedStyle(e).position !== 'absolute' || !e.offsetParent) return false;
    const r = e.getBoundingClientRect(), q = e.offsetParent.getBoundingClientRect();
    return r.width * r.height >= 0.9 * q.width * q.height;
  };
  // 装饰图（aria-hidden 或 .deco）故意探出、可压字，不参与重叠和出卡检查
  const isDeco = e => e.closest('[aria-hidden="true"], .deco') || isUnderlay(e);
  const items = [...page.querySelectorAll('.tb, img, .livebox, .shot')].filter(e => !isDeco(e)).map(e => ({e, r: e.getBoundingClientRect()}));
  for (const a of items) if (a.r.left < pw.left - 1 || a.r.right > pw.right + 1) res.issues.push('G3 超出页面：' + a.e.className);
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    const A = items[i], B = items[j];
    if (A.e.contains(B.e) || B.e.contains(A.e)) continue;
    if (A.e.parentElement === B.e.parentElement && (A.e.classList.contains('badge') || B.e.classList.contains('badge'))) continue;
    const ox = Math.min(A.r.right, B.r.right) - Math.max(A.r.left, B.r.left);
    const oy = Math.min(A.r.bottom, B.r.bottom) - Math.max(A.r.top, B.r.top);
    if (ox > 2 && oy > 2) res.issues.push('G3 重叠：' + A.e.className + ' / ' + B.e.className);
  }
  for (const c of page.querySelectorAll('.card, .nowbar, .bubble')) {
    const cr = c.getBoundingClientRect();
    for (const k of c.querySelectorAll('.tb, img')) {
      if (isDeco(k)) continue;
      const r = k.getBoundingClientRect();
      if (r.left < cr.left - 1 || r.right > cr.right + 1 || r.top < cr.top - 1 || r.bottom > cr.bottom + 1)
        res.issues.push('G3 出卡片：' + k.className);
    }
  }
  // 固定图内牌面：不能只量固定高度外框；真实文字 Range 必须全部留在已测安全框内。
  for (const label of page.querySelectorAll('.mock-label-overlay .mock-source-label')) {
    const box = label.getBoundingClientRect();
    const walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);
    let text, outside = false;
    while ((text = walker.nextNode())) {
      if (!text.textContent.trim()) continue;
      const range = document.createRange(); range.selectNodeContents(text);
      for (const r of range.getClientRects()) {
        if (r.width > 0 && (r.left < box.left - 1 || r.right > box.right + 1 ||
            r.top < box.top - 1 || r.bottom > box.bottom + 1)) outside = true;
      }
    }
    if (outside) res.issues.push('G3 图内标签文字超出实测安全框：' + label.textContent.trim().slice(0, 20));
  }
  // G3 装饰压字：装饰可以探出卡角，但不能盖字（外框重叠两边都超过 4 像素才算）
  const decoBoxes = [];
  for (const c of page.querySelectorAll('.card, .stat, .step, .side')) {
    const cr = c.getBoundingClientRect(), ccs = getComputedStyle(c);
    for (const pseudo of ['::after', '::before']) {
      const ps = getComputedStyle(c, pseudo);
      if (ps.content === 'none' || ps.backgroundImage === 'none' || ps.position !== 'absolute' || ps.display === 'none') continue;
      const w = parseFloat(ps.width), h = parseFloat(ps.height);
      if (!(w > 0 && h > 0)) continue;
      const bl = parseFloat(ccs.borderLeftWidth), bt = parseFloat(ccs.borderTopWidth);
      const br = parseFloat(ccs.borderRightWidth), bb = parseFloat(ccs.borderBottomWidth);
      const x = ps.left !== 'auto' ? cr.left + bl + parseFloat(ps.left) : cr.right - br - parseFloat(ps.right) - w;
      const y = ps.top !== 'auto' ? cr.top + bt + parseFloat(ps.top) : cr.bottom - bb - parseFloat(ps.bottom) - h;
      decoBoxes.push({name: (c.className || '').split(' ').slice(0, 3).join('.') + pseudo, r: {left: x, top: y, right: x + w, bottom: y + h}});
    }
  }
  for (const d of page.querySelectorAll('img[aria-hidden="true"], .deco img, img.deco')) {
    if (isUnderlay(d)) continue;
    decoBoxes.push({name: 'deco ' + (d.getAttribute('src') || '').split('/').pop().slice(0, 24), r: d.getBoundingClientRect()});
  }
  const pressed = new Set();
  for (const d of decoBoxes) for (const [t, txt] of textRects) {
    const ox = Math.min(d.r.right, t.right) - Math.max(d.r.left, t.left);
    const oy = Math.min(d.r.bottom, t.bottom) - Math.max(d.r.top, t.top);
    if (ox > 4 && oy > 4) { const k = d.name + '|' + txt; if (!pressed.has(k)) { pressed.add(k); res.issues.push('G3 装饰压字：' + d.name + ' 盖住“' + txt + '”'); } }
  }
  // 组件在浏览器里才发现的未完成（如叠字目标找不到）：data-incomplete="说明"、data-overlay-error
  res.domIncomplete = [...page.querySelectorAll('[data-incomplete], [data-overlay-error]')].map(e =>
    (e.dataset.incomplete || ('叠字目标运行时缺失：' + e.dataset.overlayError)) + '（' + (e.dataset.comp || e.className || e.tagName).toString().slice(0, 24) + '）');
  // 图片没加载出来（路径错、文件坏）：记下来，报告列为缺素材
  res.broken = [...page.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth === 0)
    .map(i => decodeURIComponent((i.getAttribute('src') || '').split('/').pop()).slice(0, 60));
  // G5：热区（链接、按钮、实时框、截图位）
  for (const a of page.querySelectorAll('[data-hot]')) {
    for (const r of a.getClientRects()) {
      if (r.width < 1) continue;
      res.hot.push({kind: a.dataset.hot, href: a.dataset.href || '', text: (a.innerText || '').trim(),
        x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height)});
    }
  }
  // G4：标题图位置
  for (const im of page.querySelectorAll('img[data-title-src], img[data-title-std]')) {
    const r = im.getBoundingClientRect();
    res.titles.push({src: im.dataset.titleSrc || '', box: im.dataset.titleBox || '', std: !!im.dataset.titleStd, natural: im.naturalWidth,
      x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height)});
  }
  // G6：同角色字号
  for (const [role, sel] of Object.entries({prose: '.prose', body: '.body', name: '.name', num: '.num', sechead: '.sechead', li: '.blist li'})) {
    const s = new Set([...page.querySelectorAll(sel)].map(e => getComputedStyle(e).fontSize));
    if (s.size) res.roles[role] = [...s];
  }
  for (const e of page.querySelectorAll('[data-role]')) {
    const role = e.dataset.role, fs = getComputedStyle(e).fontSize;
    res.roles[role] = [...new Set([...(res.roles[role] || []), fs])];
  }
  // 竖版切口同时避开完整表格、标题、完整节点和每一条可见文字 Range。
  // data-echo 只影响 G1 计字，仍是真实可见文字，不能从切口保护里排除。
  const Y = e => { const r = e.getBoundingClientRect(); return [r.top + scrollY, r.bottom + scrollY]; };
  const sel = '[data-hot], .title-wrap, .row, .ill, .c-prose > *, .btnrow, .card, .nowbar, .bubblecol, .step, .sechead, .legend, .shot';
  const iv = [...page.querySelectorAll(sel)].map(Y);
  res.splitProtected = [];
  const protect = (kind, e, r) => {
    if (r.width < 1 || r.height < 1) return;
    res.splitProtected.push({kind, top: r.top + scrollY, bottom: r.bottom + scrollY,
      name: (e.className || e.tagName || '').toString().slice(0, 60),
      text: (e.innerText || e.textContent || '').trim().slice(0, 24)});
  };
  for (const [kind, selector] of Object.entries({
    table: '[data-comp="table"]',
    title: '.title-wrap, .sechead, .table-header, .table-caption, h1, h2, h3, h4, h5, h6',
    node: '.sequence-item', hot: '[data-hot]'
  })) for (const e of page.querySelectorAll(selector)) {
    if (!e.closest('[aria-hidden="true"], .deco, .ghost')) protect(kind, e, e.getBoundingClientRect());
  }
  const splitWalker = document.createTreeWalker(page, NodeFilter.SHOW_TEXT);
  let splitText;
  while ((splitText = splitWalker.nextNode())) {
    const e = splitText.parentElement;
    if (!splitText.textContent.trim() || e.closest('[aria-hidden="true"], .deco, .ghost')) continue;
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.color === 'rgba(0, 0, 0, 0)') continue;
    const r = document.createRange(); r.selectNodeContents(splitText);
    for (const rect of r.getClientRects()) protect('line', e, rect);
  }
  iv.push(...res.splitProtected.map(r => [r.top, r.bottom]));
  res.H = document.documentElement.scrollHeight;
  const brk = [];
  for (const e of page.querySelectorAll('[data-page-break]')) brk.push(Y(e)[0]);
  for (const e of page.querySelectorAll('[data-page-break-after]')) {
    if (e.dataset.pageBreakAfter === 'false') continue;
    const [, b] = Y(e), nx = e.nextElementSibling;
    brk.push(nx ? (b + Y(nx)[0]) / 2 : b + 6);
  }
  for (const e of page.querySelectorAll('[data-page-break-before]')) {
    if (e.dataset.pageBreakBefore === 'false') continue;
    const [t] = Y(e), pv = e.previousElementSibling;
    brk.push(pv ? (Y(pv)[1] + t) / 2 : t - 6);
  }
  brk.sort((a, b) => a - b);
  res.breaks = [];
  for (const y of brk) if (y > 20 && y < res.H - 20 && !res.breaks.some(z => Math.abs(z - y) < 40)) res.breaks.push(Math.round(y));
  res.splitCards = [...page.querySelectorAll('.card')]
    .filter(c => !c.closest('[aria-hidden="true"], .deco'))
    .map(c => { const [top, bottom] = Y(c); return {top, bottom, name: (c.className || '').slice(0, 30)}; });
  res.cuts = [];
  for (let y = 1; y < res.H - 1; y += 2) if (!iv.some(([t, b]) => y > t - 8 && y < b + 8)) res.cuts.push(y);
  res.typeset = globalThis.TypesetChecks ? globalThis.TypesetChecks.check() :
    {checked: false, reason: '独立组件HTML未加载排版检查工具'};
  return res;
}
