// 授权页首屏小鸟：O3 重排把旧整屏 .living-layer 隐藏了，这里把现有 LivingBird 挂到新插画 .o3-art 上。
// 落点按新插画重算：.o3-art 是原图 (1328,192) 起 156×132 的裁块，保险箱可见顶面中段在裁块里约 (0.49, 0.36)。
// 鸟层叠在插画上、点击穿透，不改办理逻辑；减少动态效果时静止。
(() => {
  let birdSrc, birdSprites;
  try {
    const data = JSON.parse(document.currentScript?.dataset.bird || '{}');
    birdSrc = data.script; birdSprites = data.atlas ? new URL('.', new URL(data.atlas, document.baseURI)).href : '';
  } catch { return; }
  const screen = document.getElementById('computer-access-01');
  if (!birdSrc || !birdSprites || !screen) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let bird, host, timer, watch, paused = false, loading = false, size = '';
  function clear() { bird?.destroy(); bird = null; host?.remove(); host = null; size = ''; }
  function refresh() {
    if (paused || !window.LivingBird?.mount) return;
    const art = screen.querySelector('.o3-art');
    if (!art) return;
    const a = art.getBoundingClientRect(), s = screen.getBoundingClientRect();
    if (!a.width || !a.height) { clear(); return; }
    const key = [a.left - s.left, a.top - s.top, a.width, a.height].map(v => v.toFixed(1)).join();
    if (bird && key === size) return;
    clear(); size = key;
    host = document.createElement('div'); host.className = 'access-bird'; host.setAttribute('aria-hidden', 'true');
    Object.assign(host.style, { left: `${a.left - s.left + screen.clientLeft}px`, top: `${a.top - s.top + screen.clientTop}px`, width: `${a.width}px`, height: `${a.height}px` });
    art.after(host);
    const still = reduced.matches || document.body.classList.contains('motion-off');
    bird = window.LivingBird.mount(host, { sprites: birdSprites, perches: [{ x: .49, y: .36, facing: 'left', span: .06 }], size: Math.min(.22, 46 / a.height), minSize: 24, from: 'right', reducedMotion: still, night: false, auto: true });
    if (still) bird.seek(0);
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(refresh, 120); }
  function remount() { clear(); schedule(); }
  function boot() {
    if (!screen.querySelector('.o3-art')) {
      watch ||= new MutationObserver(() => { if (screen.querySelector('.o3-art')) { watch.disconnect(); watch = null; boot(); } });
      watch.observe(screen, { childList: true });
      return;
    }
    if (window.LivingBird?.mount) { schedule(); return; }
    if (loading || paused) return;
    loading = true;
    const url = new URL(birdSrc, document.baseURI).href, existing = [...document.scripts].find(script => script.src === url);
    const script = existing || document.createElement('script');
    script.addEventListener('load', () => { loading = false; schedule(); }, { once: true });
    script.addEventListener('error', () => { loading = false; if (!existing) script.remove(); }, { once: true });
    if (!existing) { script.src = url; script.async = true; document.head.append(script); }
  }
  window.addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', remount); document.addEventListener('site-motion', remount);
  window.addEventListener('pagehide', () => { paused = true; clearTimeout(timer); clear(); });
  window.addEventListener('pageshow', () => { paused = false; boot(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true }); else boot();
})();
