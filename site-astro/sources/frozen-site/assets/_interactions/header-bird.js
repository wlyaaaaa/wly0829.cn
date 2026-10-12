(() => { let host, bird, trim, active = true; const cfg = JSON.parse(document.currentScript.dataset.bird), q = s => document.querySelector(s);
  const header = q('.site-header>.header-inner') || q('body>main>header'), title = header?.querySelector('.brand,h1');
  const fallback = q('#main-content .project-hero,#main-content .search-results-page>header,main>section.hero'); if (!header || !title || !fallback) return;
  const overlaps = (a, b) => a.left < b.right + 4 && a.right > b.left - 4 && a.top < b.bottom + 4 && a.bottom > b.top - 4;
  const visible = e => e.getBoundingClientRect().width && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).opacity !== '0';
  const rects = e => { if (!e.matches('h1,.section-kicker')) return [e.getBoundingClientRect()]; const r = document.createRange(); r.selectNodeContents(e); return [...r.getClientRects()]; };
  function place() { if (!host) return;
    const h = innerWidth <= 900 ? 30 : 40, r = header.getBoundingClientRect(), t = title.getBoundingClientRect();
    let x = r.right - 52, y = t.top + (t.height - h) / 2, box = () => ({left:x, top:y, right:x+48, bottom:y+h});
    const blocks = [...header.querySelectorAll('.brand,h1,.primary-nav,.desktop-search,.header-utilities,nav'), ...document.querySelectorAll('.back-to-top')].filter(visible).flatMap(rects);
    let clear = false; for (const p of [r.right - 52, ...blocks.map(b => b.left - 56)].sort((a,b) => b-a)) { x = p;
      if (y >= r.top && y + h <= r.bottom && x >= r.left && x + 48 <= Math.min(innerWidth,r.right) && !blocks.some(b => overlaps(box(), b))) { clear = true; break; } }
    if (clear && trim) { trim[0].style.marginRight = trim[1]; trim = null; }
    if (!clear) { const f = fallback.getBoundingClientRect(), pad = getComputedStyle(fallback), kicker = fallback.querySelector('.section-kicker'), ft = kicker || fallback.querySelector('h1,h2');
      x = f.right - (parseFloat(pad.paddingRight) || 16) - 48; y = ft ? ft.getBoundingClientRect().top + (kicker ? ft.clientHeight - h : 0) : f.top;
      if (ft && !trim && rects(ft).some(b => overlaps(box(), b))) { trim = [ft, ft.style.marginRight]; ft.style.marginRight = '50px'; } }
    host.hidden = !clear && [...fallback.querySelectorAll('a,button,input,select,textarea')].filter(visible).some(e => overlaps(box(), e.getBoundingClientRect()));
    Object.assign(host.style, {position:'absolute', width:'48px', zIndex:100, pointerEvents:'none', left:`${x + scrollX}px`, top:`${y + scrollY}px`, height:`${h}px`});
  } function mount() {
    if (!active || host) return; host = document.createElement('div'); host.id = 'header-bird'; host.setAttribute('aria-hidden', 'true'); document.body.append(host); place();
    bird = LivingBird.mount(host, {sprites:new URL('.', new URL(cfg.atlas, location.href)).href, reducedMotion:true, size:.8, minSize:24, perches:[{x:.4,y:.85,facing:'left'}]});
    bird.seek(0); host.querySelectorAll('*').forEach(e => e.style.setProperty('pointer-events', 'none', 'important')); }
  const ready = new Promise(resolve => { if (window.LivingBird) return resolve(); const s = document.createElement('script'); s.src = cfg.script; s.onload = resolve; document.head.append(s); });
  const btt = q('.back-to-top'); if (btt) new MutationObserver(place).observe(btt, {attributes:true, attributeFilter:['hidden','class']});
  addEventListener('resize', place); addEventListener('scroll', place, {passive:true});
  addEventListener('pagehide', () => { active = false; bird?.destroy(); bird = null; host?.remove(); host = null; });
  addEventListener('pageshow', () => { active = true; ready.then(mount).catch(() => {}); }); ready.then(mount).catch(() => {}); })();
