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

  // 电脑窗口拉窄时，按这一页两边实际有几颗按钮量（实况页右边多“几点读到”“问情况”两颗）：
  // 照常居中放得下就不动；居中放不下、站名还放得下，站名往空的一边让；站名放不下才只留小绿灯（仍是回首页）；
  // 小绿灯也放不下，整条页眉按比例缩小，入口一个不丢。1440 宽和手机（按 1440 宽整页缩小）都放得下，不受影响。
  const groups = [...bar.querySelectorAll(':scope > .topbar__group')];
  const brand = bar.querySelector('.brand');
  const NAME_GAP = 11;   // 和 topbar.css 里 .brand__word 的 margin-left 一样
  const across = el => {
    const kids = [...el.children].filter(c => c.offsetWidth);
    return kids.reduce((sum, c) => sum + c.offsetWidth, 0) + (parseFloat(getComputedStyle(el).columnGap) || 0) * Math.max(0, kids.length - 1);
  };
  function fit() {
    const w = parseFloat(word.style.getPropertyValue('--w'));
    if (!w || groups.length !== 2 || !brand) return;
    const bs = getComputedStyle(bar), br = getComputedStyle(brand);
    const frame = (parseFloat(bs.left) || 0) + (parseFloat(bs.right) || 0) + parseFloat(bs.paddingLeft) + parseFloat(bs.paddingRight);
    const room = document.documentElement.clientWidth - frame - 4;
    const gaps = 2 * 12;   // 让开时站名和两边按钮之间各留 12（topbar.css 里 data-fit 那几行的 column-gap）
    const [left, right] = groups.map(across);
    const lampOnly = parseFloat(br.paddingLeft) + parseFloat(br.paddingRight) + lamp.offsetWidth;
    const named = lampOnly + NAME_GAP + w;
    let next = 'center';
    // 居中时站名和两边按钮之间也至少留 12（实况页右边多了“看公开版”，1440 宽贴得太近就往空的一边让）
    if (2 * Math.max(left, right) + named + gaps > room) next = left + named + right + gaps <= room ? 'tight' : left + lampOnly + right + gaps <= room ? 'lamp' : 'zoom';
    if (next === 'zoom') bar.style.setProperty('--fit-zoom', Math.max(.5, (room + frame) / (left + lampOnly + right + gaps + frame)).toFixed(3));
    else bar.style.removeProperty('--fit-zoom');
    if (bar.dataset.fit === next) return;
    // 打开页面时第一次摆好就是落定的样子，不演一遍字收进灯里；之后拉窗口照常有收放
    if (!bar.dataset.fit) {
      bar.setAttribute('data-fit-first', '');
      requestAnimationFrame(() => requestAnimationFrame(() => bar.removeAttribute('data-fit-first')));
    }
    bar.dataset.fit = next;
  }
  // 按钮字变了（实况页“几点读到”会换）、加了按钮，都重量一次
  const sized = new ResizeObserver(() => fit());
  const watchKids = () => groups.forEach(g => [...g.children].forEach(c => sized.observe(c)));
  new MutationObserver(watchKids).observe(bar, { childList: true, subtree: true });
  watchKids();

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
