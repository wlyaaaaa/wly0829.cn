(() => {
  let birdSrc, birdSprites;
  try {
    const data = JSON.parse(document.currentScript?.dataset.bird || '{}');
    birdSrc = data.script; birdSprites = data.atlas ? new URL('.', new URL(data.atlas, document.baseURI)).href : '';
  } catch { return; }
  if (!birdSrc || !birdSprites || document.querySelector('figure[data-living-config]')) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let bird, host, waiting, timer, paused = false, loading = false;
  function clear() {
    bird?.destroy(); bird = null; host?.remove(); host = null;
    waiting?.removeEventListener('load', refresh); waiting = null;
  }
  function refresh() {
    clear();
    if (paused || !window.LivingBird?.mount) return;
    const images = [...document.querySelectorAll('[data-comp="illustration"] img')].filter(img => {
      const r = img.getBoundingClientRect(); return img.closest('.ts-o') && r.width > 0 && r.height > 0;
    });
    const img = images.find(img => { const r = img.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }) || images[0];
    if (!img) return;
    if (!img.complete || !img.naturalWidth) { waiting = img; img.addEventListener('load', refresh, { once: true }); return; }
    const parent = img.closest('.ts-o'), r = img.getBoundingClientRect(), p = parent.getBoundingClientRect();
    host = document.createElement('div'); host.className = 'page-bird'; host.setAttribute('aria-hidden', 'true');
    Object.assign(host.style, { position: 'absolute', left: `${r.left - p.left}px`, top: `${r.top - p.top}px`, width: `${r.width}px`, height: `${r.height}px`, overflow: 'hidden', pointerEvents: 'none', zIndex: '3' });
    const style = document.createElement('style'); style.textContent = '.page-bird,.page-bird *{pointer-events:none!important}';
    host.append(style); parent.append(host);
    const still = reduced.matches || document.body.classList.contains('motion-off');
    bird = window.LivingBird.mount(host, { sprites: birdSprites, perches: [{ x: .5, y: .8 }], size: Math.min(.12, 46 / r.height), minSize: 24, reducedMotion: still, night: false, auto: true });
    if (still) bird.seek(0);
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(refresh, 100); }
  function boot() {
    if (window.LivingBird?.mount) { refresh(); return; }
    if (loading || paused) return;
    loading = true;
    const url = new URL(birdSrc, document.baseURI).href, existing = [...document.scripts].find(script => script.src === url);
    const script = existing || document.createElement('script');
    script.addEventListener('load', () => { loading = false; refresh(); }, { once: true });
    script.addEventListener('error', () => { loading = false; if (!existing) script.remove(); }, { once: true });
    if (!existing) { script.src = url; script.async = true; document.head.append(script); }
  }
  window.addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', schedule); document.addEventListener('site-motion', schedule);
  window.addEventListener('pagehide', () => { paused = true; clearTimeout(timer); clear(); });
  window.addEventListener('pageshow', () => { paused = false; boot(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})();
