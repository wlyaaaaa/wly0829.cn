/* 无旧运行件页面的共用增强；大图查看器沿用现役画廊，不加载旧整页运行时。 */
(() => {
  'use strict';
  if (window.SitePageInteractions) return;
  window.SitePageInteractions = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const moving = () => !reduced.matches && !document.body.classList.contains('motion-off');
  const footer = document.querySelector('footer');
  const top = document.createElement('button');
  top.type = 'button'; top.className = 'back-to-top'; top.hidden = true;
  top.setAttribute('aria-label', '回到顶部');
  top.innerHTML = '<img src="/_shared/back_to_top.webp" alt="">';
  const bird = document.createElement('div');
  bird.className = 'easter-bird'; bird.hidden = true; bird.setAttribute('aria-hidden', 'true');
  bird.innerHTML = '<img src="/_shared/easter_bird.webp" alt="">';
  document.body.append(top, bird);
  let returning = false, flightTimer = 0, bubbleTimer = 0, flightFrame = 0, lifecycle = 0;
  const cleanups = [];
  const hideBird = () => { clearTimeout(flightTimer); cancelAnimationFrame(flightFrame); bird.hidden = true; bird.classList.remove('flying'); bird.removeAttribute('data-feedback'); };
  function showBird(trigger = null) {
    if (!moving() && !trigger) return;
    const screen = trigger || document.querySelector('.ts-screen,.screen');
    if (!screen) return;
    const r = screen.getBoundingClientRect(), w = innerWidth < 600 ? 100 : 150;
    bird.toggleAttribute('data-feedback', !!trigger);
    Object.assign(bird.style, { width: w + 'px', left: Math.max(8, Math.min(innerWidth - w - 8, trigger ? r.right + 8 : r.left + r.width * .35)) + 'px', top: (trigger ? Math.max(8, Math.min(innerHeight - w - 8, r.top - w * .25)) : Math.max(65, r.top + 18)) + 'px' });
    bird.hidden = false; bird.classList.remove('flying');
    cancelAnimationFrame(flightFrame); flightFrame = requestAnimationFrame(() => { if (moving() && !bird.hidden) bird.classList.add('flying'); });
    clearTimeout(flightTimer); flightTimer = setTimeout(hideBird, 2300);
  }
  function updateTop() {
    top.hidden = scrollY < innerHeight * .65 || (footer && footer.getBoundingClientRect().top < innerHeight);
    if (returning && scrollY <= 2) { returning = false; showBird(); }
  }
  top.onclick = () => { returning = true; scrollTo({ top: 0, behavior: moving() ? 'smooth' : 'instant' }); requestAnimationFrame(updateTop); };
  addEventListener('scroll', updateTop, { passive: true }); addEventListener('resize', updateTop); updateTop();
  addEventListener('pageshow', updateTop);
  addEventListener('pagehide', () => {
    lifecycle++; returning = false; hideBird(); clearTimeout(bubbleTimer); top.hidden = true;
    document.querySelector('.footer-landscape')?.classList.remove('is-celebrating');
    for (const cleanup of cleanups) cleanup();
  });
  const signature = document.querySelector('.footer-signature-trigger');
  if (signature) signature.onclick = async () => {
    const done = document.querySelector('.scenery-done'), landscape = document.querySelector('.footer-landscape');
    if (!done || !landscape) { showBird(signature); return; }
    const run = lifecycle;
    try { await done.decode(); } catch { if (run === lifecycle) showBird(signature); return; }
    if (run !== lifecycle) return;
    landscape.classList.add('is-celebrating'); clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => landscape.classList.remove('is-celebrating'), 1800);
  };
  const syncMotion = () => { if (!moving()) hideBird(); };
  reduced.addEventListener('change', syncMotion); document.addEventListener('site-motion', syncMotion);

  if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;
  const viewer = document.createElement('dialog');
  viewer.id = 'image-viewer'; viewer.className = 'full-image-viewer'; viewer.dataset.native = 'true';
  viewer.setAttribute('aria-label', '查看完整图片');
  viewer.innerHTML = '<div class="viewer-toolbar"><button class="viewer-close" aria-label="关闭大图">关闭</button><button class="viewer-prev" aria-label="上一张">←</button><span class="viewer-caption"></span><button class="viewer-next" aria-label="下一张">→</button><button class="viewer-less" aria-label="缩小">−</button><button class="viewer-more" aria-label="放大">＋</button><a target="_blank" rel="noopener">最大尺寸 ↗</a></div><div class="viewer-stage"><img alt=""></div>';
  document.body.append(viewer);
  let images = [], current = 0, zoom = 1, returnFocus = null, returnPosition = null;
  const stage = viewer.querySelector('.viewer-stage'), image = stage.querySelector('img'); image.decoding = 'async';
  function scale() {
    image.style.width = zoom === 1 ? 'auto' : Math.round(Math.min(image.naturalWidth || innerWidth, innerWidth - 40) * zoom) + 'px';
    image.style.maxWidth = zoom === 1 ? '100%' : 'none'; image.style.maxHeight = zoom === 1 ? '100%' : 'none';
    stage.classList.toggle('zoomed', zoom > 1);
  }
  function draw() {
    const item = images[current]; if (!item) return;
    image.src = item.src; image.alt = item.title;
    viewer.querySelector('.viewer-caption').textContent = item.title + (images.length > 1 ? ' · ' + (current + 1) + '/' + images.length : '');
    viewer.querySelector('a').href = item.src;
    viewer.querySelector('.viewer-prev').hidden = viewer.querySelector('.viewer-next').hidden = images.length < 2;
    viewer.querySelector('.viewer-prev').disabled = current === 0; viewer.querySelector('.viewer-next').disabled = current === images.length - 1;
    zoom = 1; stage.scrollTo(0, 0); scale();
  }
  function show(list, index = 0, trigger = document.activeElement) {
    if (!list.length) return;
    if (!viewer.open) { returnFocus = trigger; returnPosition = { left: scrollX, top: scrollY }; }
    images = list; current = Math.max(0, Math.min(list.length - 1, index)); draw(); if (!viewer.open) viewer.showModal();
  }
  function next(step) { current = Math.max(0, Math.min(images.length - 1, current + step)); draw(); }
  viewer.querySelector('.viewer-close').onclick = () => viewer.close();
  viewer.querySelector('.viewer-prev').onclick = () => next(-1); viewer.querySelector('.viewer-next').onclick = () => next(1);
  viewer.querySelector('.viewer-more').onclick = () => { zoom = Math.min(4, zoom + .5); scale(); };
  viewer.querySelector('.viewer-less').onclick = () => { zoom = Math.max(1, zoom - .5); scale(); };
  viewer.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); next(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); next(-1); } });
  image.ondblclick = () => { zoom = zoom > 1 ? 1 : 2; scale(); }; image.onload = scale;
  const touches = new Map(); let pinch = null;
  function distance() { const p = [...touches.values()]; return p.length === 2 ? Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) : 0; }
  stage.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'touch') return;
    touches.set(e.pointerId, { x: e.clientX, y: e.clientY }); try { stage.setPointerCapture(e.pointerId); } catch {}
    if (touches.size === 2) pinch = { distance: distance(), zoom }; e.preventDefault();
  });
  stage.addEventListener('pointermove', e => {
    if (!touches.has(e.pointerId)) return;
    const previous = touches.get(e.pointerId); touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (touches.size === 2 && pinch && pinch.distance) { zoom = Math.max(1, Math.min(4, pinch.zoom * distance() / pinch.distance)); scale(); }
    else if (touches.size === 1 && zoom > 1) { stage.scrollLeft -= e.clientX - previous.x; stage.scrollTop -= e.clientY - previous.y; }
    e.preventDefault();
  });
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) stage.addEventListener(event, e => { touches.delete(e.pointerId); if (touches.size < 2) pinch = null; });
  viewer.addEventListener('close', () => {
    touches.clear(); pinch = null; if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    if (returnPosition) scrollTo({ ...returnPosition, behavior: 'instant' }); returnFocus = returnPosition = null;
  });
  cleanups.push(() => { returnFocus = returnPosition = null; touches.clear(); pinch = null; if (viewer.open) viewer.close(); });
  window.SiteImageViewer = { openGallery: show };

  const fallback = document.querySelector('.ai-brief-static');
  if (!fallback) return;
  const dialog = document.createElement('dialog'); dialog.className = 'brief-dialog';
  dialog.setAttribute('aria-label', '复制 AI 续作说明');
  dialog.innerHTML = '<form method="dialog"><button class="brief-close" aria-label="关闭续作说明">关闭</button></form><h2>复制 AI 续作说明</h2><label>这次处理哪里<select name="scope"><option>整个项目</option></select></label><label>目标<input name="goal" type="text" placeholder="例如：检查备份失败的原因并修好" autocomplete="off"></label><p class="brief-preview" tabindex="0"></p><button class="brief-copy" type="button" disabled>复制</button><p class="brief-status" role="status"></p>';
  document.body.append(dialog);
  const scope = dialog.querySelector('select'), goal = dialog.querySelector('input'), preview = dialog.querySelector('.brief-preview'), copy = dialog.querySelector('.brief-copy'), status = dialog.querySelector('.brief-status');
  for (const a of document.querySelectorAll('.toc a')) {
    if (a.dataset.section === 'top') continue;
    const option = document.createElement('option'); option.value = a.dataset.section;
    option.textContent = a.dataset.fullLabel || a.dataset.labelH || a.textContent; scope.append(option);
  }
  function generate() {
    const repo = fallback.dataset.repo, lead = `项目：${fallback.dataset.projectTitle}；${repo.startsWith('private-project-') ? '项目键' : '仓库'}：${repo}；范围：${scope.options[scope.selectedIndex].textContent}；目标：`, tail = '。先读项目的 AGENTS.md 和说明，按现行规则做。';
    goal.maxLength = Math.max(10, 150 - lead.length - tail.length);
    preview.textContent = goal.value.trim() ? lead + goal.value.trim() + tail : '';
    copy.disabled = !goal.value.trim() || preview.textContent.length > 150;
    status.textContent = preview.textContent.length > 150 ? '请把目标再写短一些。' : '';
  }
  goal.oninput = scope.onchange = generate; generate();
  copy.onclick = async () => {
    try { await navigator.clipboard.writeText(preview.textContent); status.textContent = '已复制。'; }
    catch { status.textContent = '自动复制未成功，请选中上面的说明复制。'; preview.focus(); const range = document.createRange(); range.selectNodeContents(preview); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); }
  };
  let briefFocus = null, briefPosition = null;
  function open(trigger = document.activeElement) {
    if (!dialog.open) { briefFocus = trigger; briefPosition = { left: scrollX, top: scrollY }; dialog.showModal(); } goal.focus();
  }
  dialog.addEventListener('close', () => { if (briefFocus?.isConnected) briefFocus.focus({ preventScroll: true }); if (briefPosition) scrollTo({ ...briefPosition, behavior: 'instant' }); });
  cleanups.push(() => { briefFocus = briefPosition = null; if (dialog.open) dialog.close(); });
  document.addEventListener('click', e => {
    const target = e.target instanceof Element ? e.target.closest('a[href], [data-href]') : null;
    if (!target) return;
    const href = new URL(target.getAttribute('href') || target.dataset.href, location.href);
    if (href.origin === location.origin && href.pathname === location.pathname && href.hash === '#ai-brief') { e.preventDefault(); open(target); }
  }, true);
  window.SiteBrief = { generate, open };
  fallback.id = 'ai-brief-text'; fallback.hidden = true; dialog.id = 'ai-brief';
  if (location.hash === '#ai-brief') open();
})();
