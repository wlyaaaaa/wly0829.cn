// 只响应图片真正的 error；慢请求一直等待，不设加载超时，也不重复下载。
(() => {
  const retries = new WeakMap(), delays = [1000, 2500, 5000];
  const near = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const img = entry.target; near.unobserve(img);
    const target = img.getBoundingClientRect().width * 2;
    img.src = JSON.parse(img.dataset.variants || '[]').find(([width]) => width >= target)?.[1] || img.dataset.src;
    delete img.dataset.src; watch(img);
  }), {rootMargin: '350px'});
  function failed(img) {
    if (!(img instanceof HTMLImageElement) || !img.getAttribute('src')) return;
    let state = retries.get(img);
    if (!state) { state = {src: img.currentSrc || img.src, count: 0, timer: 0}; retries.set(img, state); }
    if (state.timer || img.dataset.imageState === 'failed') return;
    img.dataset.imageState = state.count < delays.length ? 'retry' : 'failed';
    if (state.count >= delays.length) return;
    state.timer = setTimeout(() => {
      state.timer = 0;
      const url = new URL(state.src); url.searchParams.set('image-retry', `${++state.count}-${Date.now()}`);
      img.src = url.href;
    }, delays[state.count]);
  }
  function watch(img) {
    if (img.dataset.src) { img.dataset.imageState = 'pending'; near.observe(img); return; }
    if (!img.getAttribute('src')) return;
    if (img.complete) { if (!img.naturalWidth) failed(img); }
    else img.dataset.imageState = 'pending';
  }
  document.addEventListener('error', e => failed(e.target), true);
  document.addEventListener('load', e => {
    if (!(e.target instanceof HTMLImageElement)) return;
    const state = retries.get(e.target); if (state?.timer) clearTimeout(state.timer);
    retries.delete(e.target); delete e.target.dataset.imageState;
  }, true);
  document.querySelectorAll('img').forEach(watch);
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType !== 1) return;
    if (node.matches('img')) watch(node);
    node.querySelectorAll('img').forEach(watch);
  }))).observe(document.documentElement, {childList: true, subtree: true});
})();
// 页眉会动的三件事：
// 1. 往下滑收起，往上滑出现；第一屏里不收，到第二屏才收。
// 2. 在页面最顶上是“小绿灯 + Inside a Personal Agent”；离开顶上，字一个个收进灯里，只剩灯。
// 3. 字收进去、放出来的那一下，灯跟着鼓一下。
(() => {
  const bar = document.getElementById('topbar');
  if (!bar) return;

  const word = bar.querySelector('.brand__word');
  const lamp = bar.querySelector('.brand__lamp');

  // 把那行字拆成一个个字母，才能一个接一个地动
  const text = word.textContent.trim();
  word.textContent = '';
  word.setAttribute('aria-hidden', 'true');
  const chars = [...text].map((c, i) => {
    const s = document.createElement('span');
    s.className = 'ch';
    s.textContent = c;
    s.style.setProperty('--i', i);
    word.appendChild(s);
    return s;
  });
  word.style.setProperty('--n', chars.length);

  // 量这行字有多宽、每个字母离灯多远（字体载入后、窗口变了都重量一次）
  function measure() {
    const first = chars[0];
    const last = chars[chars.length - 1];
    const base = first.offsetLeft;
    const w = last.offsetLeft + last.offsetWidth - base;
    if (!w) return;
    word.style.setProperty('--w', w + 'px');
    for (const ch of chars) {
      ch.style.setProperty('--dx', (ch.offsetLeft - base + ch.offsetWidth / 2 + 6).toFixed(1));
    }
    fit();
  }

  // 栅格负责给两边按钮和站名留位置；三组加起来也放不下时，整条页眉才等比缩小。
  const groups = [...bar.querySelectorAll(':scope > .topbar__group')];
  const brand = bar.querySelector('.brand');
  const NAME_GAP = 11;   // 和 topbar.css 里 .brand__word 的 margin-left 一样
  function fit() {
    const w = parseFloat(word.style.getPropertyValue('--w'));
    if (!w || groups.length !== 2 || !brand) return;
    const bs = getComputedStyle(bar), br = getComputedStyle(brand);
    const inset = (parseFloat(bs.left) || 0) + (parseFloat(bs.right) || 0);
    const frame = inset + parseFloat(bs.paddingLeft) + parseFloat(bs.paddingRight);
    const gaps = 2 * parseFloat(bs.columnGap);
    const zoom = parseFloat(bs.zoom);
    const [left, right] = groups.map(group => group.getBoundingClientRect().width / zoom);
    const named = parseFloat(br.paddingLeft) + lamp.offsetWidth + NAME_GAP + w + parseFloat(br.paddingRight);
    const needed = Math.ceil(frame + left + named + right + gaps);
    // 按固定页眉实际拿到的窗口宽度算，包含两侧边距，但不把纵向滚动条的留白算进去。
    const room = Math.floor(bar.getBoundingClientRect().width + inset * zoom + .01);
    if (room >= needed) bar.style.removeProperty('--fit-zoom');
    // 放大时才容许取整误差。内容一旦超宽就重算，页眉连同站名一起缩。
    else if (needed * zoom > room + .01 || needed * zoom < room - 2) bar.style.setProperty('--fit-zoom', room / needed);
  }
  // 按钮换字、增减时，整组的自然宽度跟着变。
  const sized = new ResizeObserver(fit);
  groups.forEach(group => sized.observe(group));
  sized.observe(bar);
  sized.observe(document.documentElement);

  const TOP = 12;     // 离顶上这么近都算“在最顶上”
  const JITTER = 6;   // 小于这个的抖动不算滑动
  let lastY = Math.max(0, window.scrollY);
  let ticking = false;

  function setState(next) {
    if (bar.dataset.state === next) return;
    bar.dataset.state = next;
    lamp.classList.remove('is-gulp', 'is-emit');
    void lamp.offsetWidth; // 让动画能重新播
    lamp.classList.add(next === 'compact' ? 'is-gulp' : 'is-emit');
  }

  function update() {
    ticking = false;
    const y = Math.max(0, window.scrollY);
    const dy = y - lastY;

    setState(y <= TOP ? 'full' : 'compact');

    if (y <= TOP) {
      bar.dataset.hidden = 'false';
      lastY = y;
      return;
    }
    if (Math.abs(dy) < JITTER) return;
    // 第一屏里怎么滑都不收；滑过一整屏、到了第二屏，往下滑才收起
    const pastFirstScreen = y > window.innerHeight;
    bar.dataset.hidden = dy > 0 && pastFirstScreen ? 'true' : 'false';
    lastY = y;
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });

  window.addEventListener('resize', measure);
  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  // 给截图自查用：#shot=compact&at=某个元素的 id，直接摆成“滑到那里、往上滑了一下”的样子。
  // 无头浏览器真滚动后截图会是空白，所以这里不滚，只把内容整体往上挪。
  const shot = new URLSearchParams(location.hash.slice(1));
  if (shot.get('style')) bar.dataset.style = shot.get('style');
  if (shot.get('shot') === 'compact') {
    const target = document.getElementById(shot.get('at') || '');
    const y = target ? target.getBoundingClientRect().top - 8 : 700;
    const main = document.querySelector('main');
    if (main) main.style.transform = `translateY(${-y}px)`;
    bar.dataset.state = 'compact';
    bar.dataset.hidden = 'false';
  }
})();
