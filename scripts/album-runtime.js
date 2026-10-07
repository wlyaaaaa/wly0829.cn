/* Native multi-document album navigation; original links and history own routing. */
(() => {
  'use strict';
  if (window.SiteAlbum) return;
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'site-album-navigation-v1', positionsKey = key + '-positions';
  const meta = JSON.parse(document.querySelector('#album-page')?.textContent || '{}');
  const budget = 785, nominal = 655;
  let index = {}, generation = 0, clicked = null, revealSeen = false, transition = null;
  let runtimeLoaded = false, runtimeLoading = false, runtimeRequested = false, runtimeStartCount = 0, currentClean = null;
  const heldImages = new Map(), decodedImages = new Set(), warmedRoutes = new Set(), events = [], pausedForAlbum = new Set();
  const path = url => { try { return new URL(url, location.href).pathname.replace(/index\.html$/, ''); } catch { return ''; } };
  const read = name => { try { return JSON.parse(sessionStorage.getItem(name)); } catch { return null; } };
  const write = (name, value) => { try { sessionStorage.setItem(name, JSON.stringify(value)); } catch {} };
  const recall = () => { const p = read(key); return p && Date.now() - p.at < 10000 ? p : null; };
  const local = url => { try { const u = new URL(url, location.href); return u.origin === location.origin && path(u.href) !== path(location.href); } catch { return false; } };
  const visible = el => el && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
  const eligible = url => local(url) && Object.hasOwn(meta.outbound || {}, path(url));
  const staticMotion = () => reduce.matches || window.SiteMotionInsurance?.snapshot?.stalled === true || document.body?.classList.contains('motion-stalled');
  function resumeVideo() {
    for (const video of pausedForAlbum) {
      if (!video.isConnected || !video.paused) pausedForAlbum.delete(video);
      else if (!document.hidden && !staticMotion() && visible(video)) {
        pausedForAlbum.delete(video); video.play().catch(() => {});
      }
    }
  }
  function event(type, detail = {}) {
    const row = {type, at: performance.now(), epoch: Date.now(), generation, ...detail};
    events.push(row); if (events.length > 40) events.shift();
    dispatchEvent(new CustomEvent('site-album-state', {detail: row}));
  }
  function loadRuntime() {
    runtimeRequested = true;
    if (runtimeLoaded || runtimeLoading || document.readyState === 'loading') return;
    runtimeLoading = true;
    runtimeStartCount++;
    const scripts = [...document.querySelectorAll('script[data-album-runtime]')];
    // Engines and their mounts retain the source order, including module
    // entries. Mark before starting so BFCache cannot load a second copy.
    event('runtime-start', {scripts: scripts.map(el => el.dataset.src)});
    (async () => {
      for (const placeholder of scripts) {
        const replacement = document.createElement('script');
        for (const attr of placeholder.attributes) if (!attr.name.startsWith('data-album-') && attr.name !== 'data-src') replacement.setAttribute(attr.name, attr.value);
        replacement.src = placeholder.dataset.src;
        replacement.async = false;
        await new Promise(resolve => {
          replacement.addEventListener('load', resolve, {once:true});
          replacement.addEventListener('error', () => { event('runtime-resource-error', {src: replacement.src}); resolve(); }, {once:true});
          placeholder.replaceWith(replacement);
        });
      }
      runtimeLoaded = true; runtimeLoading = false;
      event('runtime-ready');
    })();
  }
  function resolveImage(descriptor) {
    if (descriptor.media && !matchMedia(descriptor.media).matches) return null;
    const orientation = descriptor.widthBased ? (innerWidth < 768 ? 'v' : 'h') : (matchMedia('(orientation:portrait)').matches ? 'v' : 'h');
    if (descriptor.orientation && descriptor.orientation !== orientation && !descriptor.both) return null;
    return descriptor;
  }
  function warmImages(images) {
    if (reduce.matches) return;
    for (const input of images || []) {
      const d = resolveImage(input); if (!d || !d.src || heldImages.has(d.src)) continue;
      const im = new Image(); im.decoding = 'async';
      if (new URL(d.src, location.href).origin !== location.origin) im.crossOrigin = 'anonymous';
      if (d.sizes) im.sizes = d.sizes;
      if (d.candidates) im.srcset = d.candidates.map(c => c.src + ' ' + c.descriptor).join(', ');
      else if (d.srcset) im.srcset = d.srcset;
      im.src = d.src; heldImages.set(d.src, im); im.decode().then(() => decodedImages.add(d.src), () => {});
    }
  }
  const indexURL = document.querySelector('#album-route-index')?.href;
  const indexReady = indexURL ? fetch(indexURL, {mode: 'cors', credentials: 'same-origin'})
    .then(r => r.ok ? r.json() : {}).then(value => { index = value.routes || {}; }).catch(() => {}) : Promise.resolve();
  function warmTarget(anchor) {
    if (!anchor || !eligible(anchor.href) || anchor.download || (anchor.target && anchor.target !== '_self')) return;
    const route = path(anchor.href);
    if (!warmedRoutes.has(route)) {
      warmedRoutes.add(route);
      // Only direct pointer intent inserts a document prefetch. Never prerender.
      const rules = document.createElement('script'); rules.type = 'speculationrules';
      rules.dataset.albumSpeculation = '';
      rules.textContent = JSON.stringify({prefetch: [{source: 'list', urls: [anchor.href], eagerness: 'immediate'}]});
      document.head.append(rules);
    }
    indexReady.then(() => warmImages(index[route]?.images));
  }
  document.addEventListener('pointerover', e => warmTarget(e.target.closest?.('a[href]')), {passive: true});
  document.addEventListener('pointerdown', e => { if (e.button === 0) warmTarget(e.target.closest?.('a[href]')); }, {passive: true});
  function selectedNode(anchor) {
    if (!anchor) return null;
    const section = anchor.closest('[data-screen]');
    const own = meta.nodes?.find(n => n.screen === section?.dataset.screen && (n.primary === path(anchor.href) || n.links?.includes(path(anchor.href))));
    return own || null;
  }
  function imageDescriptors() {
    const rows = [];
    for (const el of document.querySelectorAll('main picture img')) {
      if (!visible(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) continue;
      const source = [...(el.closest('picture')?.querySelectorAll('source') || [])].find(s => (!s.media || matchMedia(s.media).matches) && (s.srcset || s.dataset.srcset));
      const srcset = source?.srcset || source?.dataset.srcset || el.srcset || el.dataset.srcset;
      const absolute = srcset?.replace(/(^|,)\s*([^\s,]+)/g, (_, prefix, url) => prefix + ' ' + new URL(url, location.href).href);
      const raw = el.currentSrc || el.getAttribute('src') || el.dataset.src;
      if (raw) rows.push({src: new URL(raw, location.href).href, srcset: absolute, sizes: source?.sizes || el.sizes, both: true});
    }
    return rows;
  }
  function savePosition() {
    const values = read(positionsKey) || {};
    const sections = [...document.querySelectorAll('main [data-screen]')].map(el => ({el,r:el.getBoundingClientRect()}));
    sections.sort((a,b) => (Math.max(0,Math.min(b.r.bottom,innerHeight)-Math.max(b.r.top,0))) - (Math.max(0,Math.min(a.r.bottom,innerHeight)-Math.max(a.r.top,0))));
    values[path(location.href)] = {x: scrollX, y: scrollY, width: innerWidth, images: imageDescriptors(), screen: clicked?.screen || sections[0]?.el.dataset.screen || null, target: clicked?.url ? path(clicked.url) : null, at: Date.now()};
    // Positions serve browser return, not motion insurance or persistent tracking.
    const names = Object.keys(values); if (names.length > 24) delete values[names[0]];
    write(positionsKey, values);
  }
  document.addEventListener('click', e => {
    const a = e.target.closest?.('a[href]');
    if (a && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey && !a.download && (!a.target || a.target === '_self') && eligible(a.href)) {
      clicked = {url: a.href, at: Date.now(), node: selectedNode(a), screen: a.closest('[data-screen]')?.dataset.screen};
      event('native-click', {to: path(a.href), prevented: e.defaultPrevented});
    }
  }, {capture: true});
  addEventListener('keydown', e => { if (e.key === 'Enter' && document.activeElement?.matches('a[href]')) warmImages(index[path(document.activeElement.href)]?.images); }, {capture: true});
  function currentNodes(screen) {
    return (meta.nodes || []).filter(n => !screen || n.screen === screen).filter(n => {
      const el = document.querySelector(n.selector); return visible(el);
    });
  }
  function rectVisible(node, rect) {
    const owner = document.querySelector(node.selector);
    if (!visible(owner)) return false;
    const r = owner.getBoundingClientRect(), x = r.x + rect[0] * r.width, y = r.y + rect[1] * r.height;
    return x < innerWidth && x + rect[2] * r.width > 0 && y < innerHeight && y + rect[3] * r.height > 0;
  }
  function pixelLayer(node, rect, name, participants, holes) {
    const owner = document.querySelector(node.selector);
    if (!visible(owner) || !rectVisible(node, rect)) return null;
    const layer = document.createElement('span');
    layer.className = 'album-pixel-layer'; layer.dataset.albumTemporary = ''; layer.setAttribute('aria-hidden', 'true');
    layer.dataset.albumOrientation = node.orientation;
    Object.assign(layer.style, {left: rect[0] * 100 + '%', top: rect[1] * 100 + '%', width: rect[2] * 100 + '%', height: rect[3] * 100 + '%', viewTransitionName: name});
    const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'), im = document.createElementNS(ns, 'image');
    svg.setAttribute('viewBox', rect.map((n, i) => n * node.size[i % 2]).join(' '));
    svg.setAttribute('preserveAspectRatio', 'none');
    im.setAttribute('href', node.src); im.setAttribute('width', node.size[0]); im.setAttribute('height', node.size[1]);
    if (new URL(node.src, location.href).origin !== location.origin) im.setAttribute('crossorigin', 'anonymous');
    svg.append(im); layer.append(svg); owner.append(layer); participants.push(layer);
    if (!holes.has(owner)) holes.set(owner, []); holes.get(owner).push(rect);
    return layer;
  }
  function decorate(direction, artKey, screen, incoming, outgoingTitle = false) {
    currentClean?.();
    const ticket = ++generation, participants = [], temporary = [], holes = new Map(), altered = [];
    root.dataset.albumDirection = direction; root.dataset.albumRunning = '';
    const nodes = currentNodes(screen);
    const artNode = artKey && nodes.find(n => n.arts?.some(a => a.key === artKey));
    const art = artNode?.arts.find(a => a.key === artKey);
    const artEl = art && pixelLayer(artNode, art.rect, 'album-art', participants, holes);
    // Card lettering remains in root; only actual page titles participate.
    const titleNode = (incoming || outgoingTitle) && nodes.find(n => n.title && !n.primary);
    let title = titleNode && pixelLayer(titleNode, titleNode.title, 'album-title', participants, holes);
    if (!title && incoming && !screen) {
      title = [...document.querySelectorAll('main h1,main .page-heading h2')].find(visible);
      if (title && !title.matches('.visually-hidden')) { altered.push([title, title.style.viewTransitionName]); title.style.viewTransitionName = 'album-title'; }
      else title = null;
    }
    for (const [owner, rects] of holes) {
      const pic = owner.querySelector(':scope > picture'); if (!pic) continue;
      const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg'), defs = document.createElementNS(ns, 'defs'), clip = document.createElementNS(ns, 'clipPath'), shape = document.createElementNS(ns, 'path');
      const id = 'album-holes-' + ticket + '-' + temporary.length;
      clip.id = id; clip.setAttribute('clipPathUnits', 'objectBoundingBox');
      shape.setAttribute('clip-rule', 'evenodd');
      shape.setAttribute('d', 'M0 0H1V1H0Z ' + rects.map(([x,y,w,h]) => `M${x} ${y}H${x+w}V${y+h}H${x}Z`).join(' '));
      clip.append(shape); defs.append(clip); svg.append(defs); svg.style.cssText = 'position:absolute;width:0;height:0'; svg.dataset.albumTemporary = '';
      document.body.append(svg); temporary.push(svg); altered.push([pic, pic.style.clipPath, 'clip-path']); pic.style.clipPath = `url(#${id})`;
    }
    if (direction === 'forward' && incoming) {
      const wash = document.createElement('div'); wash.className = 'album-wash'; wash.dataset.albumTemporary = ''; wash.setAttribute('aria-hidden', 'true');
      let dx = 0, dy = 0;
      if (artEl) {
        const r = artEl.getBoundingClientRect(), x = Math.max(0,Math.min(100,(r.x+r.width/2)/innerWidth*100)), y = Math.max(0,Math.min(100,(r.y+r.height/2)/innerHeight*100));
        dx=x-65;dy=y-42;root.style.setProperty('--album-origin', `${x}% ${y}%`);
      }
      const points=[[58,35],[62,32],[65,35],[67,34],[69,34],[71,38],[72,41],[70,46],[70,50],[67,52],[64,53],[60,50],[56,45],[57,40]];
      const opening=points.map(([x,y],i)=>(i?'L':'M')+(x+dx)+' '+(y+dy)).join('')+'Z';
      wash.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path fill="#fff" fill-rule="evenodd" d="M0 0H100V100H0Z '+opening+'"/></svg>';
      document.body.append(wash); temporary.push(wash);
    }
    if (title) {
      const box = title.getBoundingClientRect(), ink = document.createElement('div');
      ink.className = 'album-ink'; ink.dataset.albumTemporary = ''; ink.setAttribute('aria-hidden', 'true');
      Object.assign(ink.style, {left: box.x+'px', top: box.y+'px', width: box.width+'px', height: box.height+'px'});
      document.body.append(ink); temporary.push(ink);
    }
    const videos = [...document.querySelectorAll('.hero-video video, video.hero-video')].filter(v => !v.paused);
    videos.forEach(v => { pausedForAlbum.add(v); v.pause(); });
    event('decorate', {direction, incoming, artKey: artEl ? artKey : null, title: !!title, participants: participants.map(el => ({name: el.style.viewTransitionName, orientation: el.dataset.albumOrientation, rect: el.getBoundingClientRect().toJSON()}))});
    const clean = () => {
      if (ticket !== generation) return;
      participants.forEach(el => el.remove()); temporary.forEach(el => el.remove());
      altered.forEach(([el,value,prop]) => value ? el.style.setProperty(prop || 'view-transition-name', value) : el.style.removeProperty(prop || 'view-transition-name'));
      delete root.dataset.albumRunning; delete root.dataset.albumDirection;
      root.style.removeProperty('--album-duration'); root.style.removeProperty('--album-origin');
      resumeVideo();
      currentClean = null; event('cleanup');
    };
    currentClean = clean; return clean;
  }
  function compositeGroups(vt, ticket) {
    vt.ready.then(() => {
      if (ticket !== generation) return;
      // BFCache retains the original site's animation listeners. An animation
      // may enter their 2.5x clock after ready or after the first start event.
      // Keep only this short native snapshot at its frozen rate until finished.
      let frame = 0;
      const keepClock = () => {
        if (ticket !== generation || !root.hasAttribute('data-album-running')) return;
        // A synchronous setter also clears a pending 2.5x update. Repeated
        // updatePlaybackRate(1) calls can leave that older rate visible while
        // compositor synchronization is pending, especially after BFCache.
        for (const animation of document.getAnimations()) if (animation.effect?.pseudoElement?.startsWith('::view-transition')) animation.playbackRate = 1;
        frame = requestAnimationFrame(keepClock);
      };
      keepClock();
      vt.finished.then(() => cancelAnimationFrame(frame), () => cancelAnimationFrame(frame));
      const endpoints = [];
      for (const a of document.getAnimations()) {
        if (a.effect?.pseudoElement?.startsWith('::view-transition')) a.playbackRate = 1;
        if (!['::view-transition-group(album-art)', '::view-transition-group(album-title)', '::view-transition-group(album-ink)'].includes(a.effect?.pseudoElement)) continue;
        const frames = a.effect.getKeyframes(), first = frames[0], last = frames.at(-1);
        endpoints.push({pseudo: a.effect.pseudoElement, first, last, timing: a.effect.getTiming()});
        if (!first?.transform || !last?.transform || !parseFloat(last.width) || !parseFloat(last.height)) continue;
        const matrix = new DOMMatrix(first.transform).scale(parseFloat(first.width)/parseFloat(last.width), parseFloat(first.height)/parseFloat(last.height));
        a.effect.setKeyframes([{offset:0, transform:matrix.toString(), easing:first.easing}, {offset:1, transform:last.transform, easing:last.easing}]);
      }
      event('ready', {endpoints, duration: parseFloat(root.style.getPropertyValue('--album-duration')) || nominal});
    }).catch(() => {});
  }
  // An already initialized BFCache document retains the site's 2.5x CSS
  // listener. Reset only native album snapshots after that listener's event,
  // leaving every established page animation and its insurance unchanged.
  function keepAlbumClock() {
    if (!root.hasAttribute('data-album-running')) return;
    queueMicrotask(() => {
      if (!root.hasAttribute('data-album-running')) return;
      for (const animation of document.getAnimations()) if (animation.effect?.pseudoElement?.startsWith('::view-transition')) animation.playbackRate = 1;
    });
  }
  document.addEventListener('animationstart', keepAlbumClock, true);
  document.addEventListener('transitionrun', keepAlbumClock, true);
  addEventListener('pageswap', e => {
    const to = e.activation?.entry?.url || clicked?.url, vt = e.viewTransition;
    if (vt) { vt.ready.catch(() => {}); vt.updateCallbackDone?.catch(() => {}); }
    const target = meta.outbound?.[path(to)];
    // Deep anchors keep the original runtime's tab/heading initialization on
    // native navigation, rather than capturing an unrelated opening viewport.
    const allowed = !!target && local(to) && !new URL(to, location.href).hash;
    savePosition();
    const activeClick = clicked?.url === to && Date.now() - clicked.at < 10000 ? clicked : null;
    const returnPosition = (read(positionsKey) || {})[path(to)];
    const traversal = e.activation?.navigationType === 'traverse';
    const returnToCard = returnPosition?.target && (path(location.href) === returnPosition.target || path(location.href).startsWith(returnPosition.target));
    const restore = !!returnPosition && (traversal || !!returnToCard);
    const sourceNodes = activeClick?.node ? currentNodes(activeClick.node.screen) : currentNodes(meta.entry);
    const keys = restore ? target?.allKeys : target?.keys;
    const art = sourceNodes.flatMap(n => (n.arts || []).filter(a => rectVisible(n, a.rect))).find(a => keys?.includes(a.key));
    const outgoingTitle = !target?.hasTitle || sourceNodes.some(n => n.titleKey && target?.titleKeys?.includes(n.titleKey));
    const targetIndex = e.activation?.entry?.index, sourceIndex = window.navigation?.currentEntry?.index;
    const back = restore && (traversal && Number.isInteger(targetIndex) && Number.isInteger(sourceIndex) ? targetIndex < sourceIndex : !!returnToCard || traversal);
    write(key, {from: location.href, to, at: activeClick ? activeClick.at : Date.now(), artKey: art?.key || null, sourceScreen: activeClick?.node?.screen || null, back, restore, allowed: allowed && !staticMotion()});
    if (!vt) return;
    if (!allowed || staticMotion()) { vt.skipTransition(); return; }
    const clean = decorate(back ? 'back' : 'forward', art?.key, activeClick?.node?.screen, false, outgoingTitle);
    vt.finished.then(clean, clean);
  });
  addEventListener('pagereveal', e => {
    clicked = null;
    revealSeen = true; transition = e.viewTransition;
    if (!transition) { currentClean?.(); loadRuntime(); resumeVideo(); return; }
    const vt = transition, pending = recall();
    vt.ready.catch(() => {}); vt.updateCallbackDone?.catch(() => {});
    const from = window.navigation?.activation?.from?.url || pending?.from || document.referrer;
    const valid = pending?.allowed && path(pending.to) === path(location.href) && local(from);
    const remaining = pending ? budget - (Date.now() - pending.at) : 0;
    const finish = () => { loadRuntime(); event('finished'); };
    vt.finished.then(finish, finish);
    if (!valid || staticMotion() || remaining < 80) { currentClean?.(); event('skip', {reason: staticMotion() ? 'static' : remaining < 80 ? 'navigation-budget' : 'native-route', remaining}); vt.skipTransition(); return; }
    const saved = (read(positionsKey) || {})[path(location.href)];
    if (pending.restore && saved && !location.hash) {
      if (saved.width === innerWidth) scrollTo({left:saved.x, top:saved.y, behavior:'instant'});
      else if (saved.screen) {
        const section = document.getElementById(saved.screen);
        const card = [...(section?.querySelectorAll('a[href]') || [])].find(a => visible(a) && path(a.href) === saved.target);
        (card || section)?.scrollIntoView({block:'center', behavior:'instant'});
      }
    }
    // The native browser chooses actual restored position. Make only the nearby
    // saved pictures eager before capture; no fixed home screen or whole-page decode.
    if (pending.restore && saved) {
      const urls = new Set(saved.images?.map(i => i.src));
      for (const im of document.querySelectorAll('main picture img')) if (urls.has(im.currentSrc || im.src || im.dataset.src)) {
        const picture = im.closest('picture'); picture?.querySelectorAll('source[data-srcset]').forEach(s => s.srcset = s.dataset.srcset);
        if (im.dataset.src) im.src = im.dataset.src; if (im.dataset.srcset) im.srcset = im.dataset.srcset; im.loading = 'eager';
      }
    }
    const clean = decorate(pending.back ? 'back' : 'forward', pending.artKey, pending.restore ? saved?.screen : meta.entry, true);
    // Capturing real DOM bounds can itself consume the allowance. Recompute
    // after that work, rather than replaying time spent on layout/decoding.
    const animationRemaining = budget - (Date.now() - pending.at);
    if (animationRemaining < 80) { clean(); event('skip',{reason:'preparation-budget',remaining:animationRemaining}); vt.skipTransition(); return; }
    root.style.setProperty('--album-duration', Math.min(nominal, animationRemaining - 80) + 'ms');
    compositeGroups(vt, generation);
    const timer = setTimeout(() => vt.skipTransition(), animationRemaining - 20);
    vt.finished.then(() => { clearTimeout(timer); clean(); }, () => { clearTimeout(timer); clean(); });
    clicked = null;
  });
  addEventListener('DOMContentLoaded', () => {
    const pending = recall();
    if (runtimeRequested || !transition && (revealSeen || !('onpagereveal' in window) || !pending || path(pending.to) !== path(location.href))) loadRuntime();
    // If a browser suppresses pagereveal despite exposing its event property,
    // the existing runtime still starts within the original total allowance.
    if (!runtimeLoaded && !transition) setTimeout(loadRuntime, Math.max(0, budget - (Date.now() - (pending?.at || 0))));
    const value = (read(positionsKey) || {})[path(pending?.from)];
    if (value && Date.now() - value.at < 3600000) warmImages(value.images);
  }, {once:true});
  addEventListener('pageshow', e => { if (e.persisted && !root.hasAttribute('data-album-running')) { loadRuntime(); resumeVideo(); } });
  reduce.addEventListener('change', () => { if (reduce.matches) { transition?.skipTransition(); currentClean?.(); loadRuntime(); } });
  window.SiteAlbum = {get snapshot() { return {generation, runtimeLoaded, runtimeLoading, runtimeStartCount, running: root.hasAttribute('data-album-running'), events: [...events], warmedRoutes: [...warmedRoutes], imageCount: heldImages.size, images:[...heldImages].map(([src,im])=>({src,currentSrc:im.currentSrc,crossOrigin:im.crossOrigin,decoded:decodedImages.has(src)}))}; }};
})();
