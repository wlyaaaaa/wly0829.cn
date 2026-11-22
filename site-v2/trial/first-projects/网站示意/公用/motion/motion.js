/* 全站通用动效（预览版，照 demo\手感规格.md）。和 motion.css 一对，所有页面 head 里先样式表、后本脚本（普通阻塞脚本）。
   - 动效一直开着（见网站 AGENTS.md）：不做“减少动态”适配，也没有关掉的开关。
   - 一开头在 <html> 上加 mo-on、mo-hide；藏起来等着出现的东西由 motion.css 在第一次画之前藏好。
   - 出错就摘掉 mo-hide（全露出来）并停手；脚本没加载，mo-hide 就不在，内容照样看得见。
   - 时长、距离都在 motion.css 的 :root；这里顶部 T 里是“几个、几成、多快”这类数。
   - 按页面认类型：图片页 body[data-page] + #pictures；列表 .wall .piece；规则 .rules-page；首页 HOME_CONFIG / main > .screen；
     其余顶层页给大块写 data-mo-rise、成块能点的写 data-mo-press 就有。 */
(() => {
  'use strict';

  const T = {
    cardStaggerCount: 6,     // 列表卡最多错开 6 张，后面的和第 6 张一起
    cardShowAt: 0.12,        // 列表卡露出 12% 才出现
    imageShowAt: 0.25,       // 图露出四分之一才开始（11-14 21:0x 从 15% 改：15% 时图才露个边，人眼还在上一张）
    fastScreensPerSec: 2.5,  // 每秒滚过两屏半以上算“滚得快”：演短的那一版（时长在 motion.css 的 --mo-focus-quick*）
    pastShare: 0.5,          // 图已经从屏幕上方滚过去一半以上、还没演过：直接显示
    // 2.5 光晕（主持 11-14 21:1x 重定：柔和七彩、以绿为主，和首页风扇光环一套；要让人找得到）
    dust: {
      min: 8, max: 10,             // 个数
      greens: ['rgb(134 232 178)', 'rgb(178 240 150)', 'rgb(120 222 214)'],   // 薄荷绿、嫩绿、青绿
      others: ['rgb(200 182 255)', 'rgb(255 184 214)', 'rgb(255 232 150)'],   // 淡紫、粉、淡黄
      greenShare: 0.58,            // 绿的三种合起来占一半多一点
      dMin: 160, dMax: 360,        // 直径（像素）
      aMin: 0.38, aMax: 0.55,      // 中心最浓处的透明度
      pulseLow: 0.6,               // 明暗在自己最浓值的 60%～100% 之间来回（这个数在 motion.css 的 mo-dust-pulse 里）
      pulseMin: 5, pulseMax: 8,    // 几秒明暗一次
      speedMin: 10, speedMax: 22,  // 每秒飘几像素
      travelMin: 120, travelMax: 260, // 一趟飘多远（像素），到头软着折回
      tilt: 25,                    // 以上下为主：方向离竖直最多偏这么多度
      nearEdge: 5,                 // 至少这么多个的中心落在图那一列左右边缘内外 edgeBand 像素以内
      edgeBand: 120,
      touchShare: 0.5              // 触屏上个数减半
    },
    // 2.2 回首页时首页脚本（home.js，defer）可能还没跑完（电脑忙时常见），过渡已经开始：照 home.js 的同一组数自己算第二屏玻璃的位置。
    // 这组数抄自 home.js 的 SRC_W、SRC_H、WINDOW 和 placement('screen2')；首页换图改了那边，这里跟着改。
    homeGlass: { srcW: 1672, srcH: 941, x: 497.6, y: 231.0, w: 1035.9, fitW: 0.94, fitH: 0.895, centerY: 0.5375, radius: 1.2 },
    navRecordMaxAge: 10000,  // 换页时旧页留给新页的话，10 秒内算数
    revealWait: 400          // 支持 pagereveal 的浏览器，最多等它这么久再开始出现
  };

  const root = document.documentElement;
  // WebKit 只在实况卡片、首页与实况之间走兼容；其它入口保留原生过渡。
  const webkit = /AppleWebKit/.test(navigator.userAgent) && !/(Chrome|Chromium|Edg|OPR)\//.test(navigator.userAgent);
  const crossDoc = 'onpagereveal' in window && 'onpageswap' in window;
  let routeStyle = null;
  function compatRoute(value) {
    if (!webkit) return;
    if (!routeStyle) { routeStyle = document.createElement('style'); (document.head || root).append(routeStyle); }
    routeStyle.textContent = `@view-transition { navigation: ${value ? 'none' : 'auto'}; }`;
  }
  const KEY = 'mo-nav';
  const VT_CLASSES = ['mo-vt', 'mo-vt-nav', 'mo-vt-top', 'mo-vt-same', 'mo-vt-other', 'mo-vt-cover', 'mo-vt-cover-handoff', 'mo-vt-uncover', 'mo-vt-home-in', 'mo-vt-home-out', 'mo-vt-open', 'mo-vt-close'];
  const supported = 'IntersectionObserver' in window && 'animate' in Element.prototype &&
    !!window.CSS && CSS.supports('translate', '1px') && CSS.supports('scale', '1');
  const on = supported;      // 浏览器缺功能才不起动画，内容照常显示
  let dead = !on;            // 缺功能、或出过错：不再起新的动画
  const cssVar = name => getComputedStyle(root).getPropertyValue(name).trim();
  const ms = name => {
    const v = cssVar(name), n = parseFloat(v);
    if (!isFinite(n)) return 0;
    return /ms$/.test(v) ? n : /s$/.test(v) ? n * 1000 : n;
  };
  const SPEED = (() => { const s = parseFloat(cssVar('--mo-speed')); return s > 0 ? s : 1; })();
  const stripHash = u => { try { const x = new URL(u, location.href); x.hash = ''; return x.href; } catch { return String(u); } };
  const dirOf = u => { const p = new URL(u, location.href).pathname; return p.slice(0, p.lastIndexOf('/') + 1); };
  const listURL = u => stripHash(u).replace(/\/index\.html(?=\?|$)/, '/');
  const projectOf = u => `/${new URL(u, location.href).pathname.split('/')[1]}/`;
  const inView = el => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
  };
  const coverArt = '[data-initial-cover] > img';
  const wallArt = '.wall .piece__frame > .piece__art';
  const artPreviews = new WeakMap();
  const displayedArt = img => img?.naturalWidth && !img.matches('[data-src],[data-image-state],[data-cover-pending],[data-cover-error]');

  // 只从已经显示的图取画面。按元素和当前网址保存，换图后就重新取。
  function smallArt(img) {
    const src = img.currentSrc, cached = artPreviews.get(img);
    if (cached?.src === src) return cached.preview;
    let preview = '';
    try {
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(384, img.naturalWidth);
      canvas.height = Math.max(1, Math.round(img.naturalHeight * canvas.width / img.naturalWidth));
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      preview = canvas.toDataURL('image/jpeg', 0.78);
    } catch { /* 读不到图时仍传递位置和原网址 */ }
    artPreviews.set(img, { src, preview });
    return preview;
  }

  function prepareSmallArt(selector) {
    const prepare = img => (window.requestIdleCallback || window.setTimeout).call(window, () => {
      if (displayedArt(img) && inView(img)) smallArt(img);
    });
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) prepare(entry.target);
    });
    document.querySelectorAll(selector).forEach(img => observer.observe(img));
    document.addEventListener('load', e => {
      if (e.target.matches?.(selector)) prepare(e.target);
    }, true);
  }

  function fail(err) {
    console.error('[motion]', err);
    dead = true;
    root.classList.remove('mo-hide', 'mo-on');
    window.MOTION_DETAIL?.reset();
  }

  function readRecord() {
    try {
      const r = JSON.parse(sessionStorage.getItem(KEY) || 'null');
      if (!r || stripHash(r.to) !== stripHash(location.href)) return null;
      const activation = window.navigation?.activation;
      if (r.reloadCover && activation?.navigationType !== 'reload') return null;
      if (r.cover?.entry) {
        if (activation?.navigationType !== 'push' || activation.from?.key !== r.cover.entry) return null;
      } else if (Date.now() - r.t > T.navRecordMaxAge) return null;
      return r;
    } catch { return null; }
  }

  // ———— 头部就做的事（第一次画之前） ————
  // 只管动效自己的错：别的脚本报错不关动效（关了背景会弹回、光斑会消失）
  const SELF = document.currentScript?.src || '';
  const mine = err => !!SELF && String(err?.stack || '').includes(SELF);
  const initialRecord = readRecord();
  if (on) {
    addEventListener('error', e => { if (e.error && (e.filename === SELF || mine(e.error))) fail(e.error); });
    addEventListener('unhandledrejection', e => { if (mine(e.reason)) fail(e.reason); });
    root.classList.add('mo-on', 'mo-hide');
    // 2.5 背景漂的位置按钟点算：每页同一个钟，换页不跳、不从头来
    const now = Date.now();
    root.style.setProperty('--mo-phase-x', `${-(now % ms('--mo-drift-x'))}ms`);
    root.style.setProperty('--mo-phase-y', `${-(now % ms('--mo-drift-y'))}ms`);
    // 2.3 同一个项目里换页：旧页把背景地址留下，新页一开头就铺上，第一帧就有背景
    const rec = initialRecord;
    if (rec?.reloadCover) {
      root.style.setProperty('--mo-refresh-cover', `url("${rec.reloadCover}")`);
      root.classList.add('mo-cover-refresh');
    }
    if (webkit && (rec?.open || rec?.close || rec?.compatHome)) compatRoute(true);
    if (rec?.home === 'in' && location.pathname === '/') window.__motionHomeAtEnd = true;
    if (rec && rec.bg && rec.fromKind === 'inner' && dirOf(rec.from) === dirOf(location.href)) {
      root.style.setProperty('--project-background', rec.bg);
    }
  }

  function pageKind() {
    const body = document.body;
    if (body && body.hasAttribute('data-page') && document.getElementById('pictures')) return 'inner';
    if (document.querySelector('.wall .piece')) return 'list';
    if (document.querySelector('.rules-page')) return 'rules';
    if (window.HOME_CONFIG || document.querySelector('main > .screen')) return 'home';
    return 'top';
  }

  // ———— 1.3 / 2.6 松手：回去用“松开”的时长 ————
  const PRESSABLE = 'main .picture-actions > .pill, main .more, .hotspot, [data-mo-press]';
  function released(e) {
    if (dead || !(e.target instanceof Element)) return;
    const el = e.target.closest(PRESSABLE);
    if (!el) return;
    el.classList.add('mo-rel');
    clearTimeout(el._moRel);
    el._moRel = setTimeout(() => el.classList.remove('mo-rel'), Math.max(ms('--mo-btn-release'), ms('--mo-release')) + 40);
  }
  addEventListener('pointerup', released, true);
  addEventListener('pointercancel', released, true);
  if (on) document.addEventListener('touchstart', () => {}, { passive: true }); // 苹果手机上让 :active 生效

  // ———— 换页（跨页面视图过渡）：旧页这边 ————
  let lastLink = null;
  let clickedCover = null;
  const projectWall = /^\/projects\/(index\.html)?$/;
  function coverFrame(frame, carry) {
    const art = frame.querySelector('.piece__art'), r = frame.getBoundingClientRect();
    const src = displayedArt(art) ? art.currentSrc : '';
    return {
      src, preview: carry && src ? smallArt(art) : undefined, title: art?.alt || '',
      left: r.left, top: r.top, width: r.width, height: r.height, radius: parseFloat(getComputedStyle(frame).borderTopLeftRadius) || 0
    };
  }
  addEventListener('click', e => { lastLink = e.target instanceof Element ? e.target.closest('a[href]') : null; }, true);
  addEventListener('click', e => {
    const link = lastLink;
    clickedCover = null;
    if (dead || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
        !link || link.origin !== location.origin || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
    const frame = link.closest('.wall .piece')?.querySelector('.piece__frame');
    if (!frame || !inView(frame)) return;
    const carry = projectWall.test(location.pathname);
    clickedCover = { frame, to: stripHash(link.href), data: {
      ...coverFrame(frame, carry), entry: window.navigation?.currentEntry?.key,
      visible: carry
        ? [...document.querySelectorAll('.wall a.piece.is-in > .piece__frame')].filter(el => el !== frame && inView(el)).map(el => coverFrame(el, carry))
        : []
    } };
  });

  const named = new Set();
  let coverCopy;
  function name(el, n) { el.style.viewTransitionName = n; named.add(el); }
  // 页眉右边那组按颗起名：链接按地址认（两页都有的配成一对、原地不动），按钮按自己的类名；
  // 只在一边有的成了单边的，原地淡出、淡入。同名的只起第一个（重名整段过渡会作废）。
  function nameBarRight() {
    const used = new Set();
    for (const el of document.querySelectorAll('.topbar .topbar__group--right > *')) {
      const key = (el.matches('a[href]') ? new URL(el.href, location.href).pathname : [...el.classList].find(c => c !== 'pill') || '')
        .replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
      if (!key || used.has(key)) continue;
      used.add(key);
      name(el, `mo-nav-r-${key}`);
    }
  }
  function clearNames() {
    for (const el of named) el.style.viewTransitionName = '';
    named.clear();
    coverCopy?.remove();
    coverCopy = null;
    root.classList.remove(...VT_CLASSES);
    root.style.removeProperty('--mo-exit-top');
    for (const el of document.querySelectorAll('.mo-now')) el.classList.remove('mo-now');
  }

  // 返回首页用当前实况的只读 DOM 快照盖住等图阶段，再把这张页面缩进玻璃。
  function homeSnapshot() {
    const copy = document.body.cloneNode(true), originals = document.body.querySelectorAll('*'), clones = copy.querySelectorAll('*');
    originals.forEach((el, i) => {
      if (!el.getAnimations().length) return;
      const css = getComputedStyle(el);
      for (const p of ['transform', 'translate', 'scale', 'opacity', 'filter', 'box-shadow']) clones[i].style.setProperty(p, css.getPropertyValue(p));
    });
    copy.querySelectorAll('script,.mo-sheet').forEach(el => el.remove());
    const styles = [...document.head.querySelectorAll('link[rel="stylesheet"],style')].map(el => el.outerHTML).join('');
    return { html: `<!doctype html><html class="${root.className}" style="${root.style.cssText}"><head><base href="${location.href}">${styles}<style>*,*::before,*::after{animation:none!important;transition:none!important}</style></head>${copy.outerHTML}</html>`, y: scrollY };
  }
  function snapshotSurface(snapshot, arrival = false) {
    const el = document.createElement('iframe');
    el.className = 'mo-home-snapshot'; el.setAttribute('aria-hidden', 'true'); el.tabIndex = -1;
    el.setAttribute('sandbox', 'allow-same-origin');
    if (arrival) el.dataset.moArrival = 'true';
    el.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0;z-index:100;pointer-events:none;transform-origin:0 0;background:#faf9f6';
    const ready = new Promise(resolve => { el.onload = () => { el.contentWindow.scrollTo(0, snapshot.y); resolve(); }; });
    el.srcdoc = snapshot.html; root.append(el);
    return { el, ready };
  }

  addEventListener('pageswap', e => {
    const vt = e.viewTransition;
    vt?.ready.catch(() => {});   // 浏览器自己放弃过渡（手机上两页宽度不同时会这样）不报未处理的错
    vt?.finished.catch(() => {});
    vt?.updateCallbackDone.catch(() => {});
    if (dead || !e.activation) { vt?.skipTransition(); return; }
    // 浏览器返回只给 traverse 时，也保留原生快照，由到达页核对是否回到原卡。
    if (!e.activation.entry) { if (location.pathname === '/') vt?.skipTransition(); return; }
    try {
      const to = e.activation.entry.url, kind = pageKind(), bar = document.getElementById('topbar');
      const rec = { t: Date.now(), from: location.href, to, fromKind: kind, nav: e.activation.navigationType,
        bar: !!bar && bar.dataset.hidden !== 'true' };
      const piece = lastLink && lastLink.closest('.wall .piece');
      if (kind === 'list') {
        sessionStorage.setItem(`mo-list:${listURL(location.href)}`, String(scrollY));
        if (piece && stripHash(lastLink.href) === stripHash(to)) {
          sessionStorage.setItem(`mo-list-entry:${listURL(location.href)}:${projectOf(to)}`, String(scrollY));
          sessionStorage.setItem(`mo-list-page:${listURL(location.href)}:${new URL(to).pathname}`, String(scrollY));
        }
      }
      if (kind !== 'home' && lastLink?.matches('.brand') && new URL(to).pathname === '/') { rec.home = 'in'; rec.bar = false; }
      if (kind === 'inner') rec.bg = root.style.getPropertyValue('--project-background');
      if (kind === 'inner' && rec.nav === 'reload' && stripHash(to) === stripHash(location.href)) {
        const art = document.querySelector(coverArt);
        if (displayedArt(art) && inView(art)) rec.reloadCover = smallArt(art);
      }
      if (kind === 'inner' && /^\/(projects|skills)\/(index\.html)?$/.test(new URL(to).pathname)) {
        rec.exit = { top: rec.bar ? Math.max(0, bar.getBoundingClientRect().bottom) : 0,
          width: innerWidth, height: innerHeight, animate: !document.body.classList.contains('reading') };
      }
      // 2.2 从首页进别的页：5 个按钮都一样，新页从被点的那个按钮的位置长到满屏（第一屏本人 11-14 21:05 定，第二屏 21:58 定“和那两个一样”）。
      // 回首页不变（仍缩进第二屏的玻璃）。算不出按钮位置（按钮不在屏幕里、没有大小）才按 1.1 普通换页。
      if (kind === 'home' && lastLink?.matches('.hotspot')) {
        const b = lastLink.getBoundingClientRect(), cs = getComputedStyle(lastLink);
        if (b.width > 1 && b.height > 1 && b.bottom > 0 && b.top < innerHeight && b.right > 0 && b.left < innerWidth) {
          // 按钮的圆角写的是“横 / 竖”两个百分比：换成像素，取小的那个
          const [rh, rv = rh] = cs.borderTopLeftRadius.split(' ');
          const px = (v, side) => (v.endsWith('%') ? parseFloat(v) / 100 * side : parseFloat(v)) || 0;
          rec.home = 'out'; rec.bar = false;
          rec.pane = { left: b.left, top: b.top, width: b.width, height: b.height, radius: Math.min(px(rh, b.width), px(rv, b.height)) };
        }
      }
      // 2.8 点开一块（页面在那一块上写 data-mo-open，值可以是里面真正看得见的那个框的选择器）：
      // 新页从这一块的位置、带着它的圆角长满页眉以下，和 2.2 首页按钮同一套时长和曲线；退回来时缩回这一块。
      // 位置按点的那一刻记下（回来时这一页会滚回同一处），记在 sessionStorage 里，按新页地址认。
      const opener = kind !== 'home' && lastLink && stripHash(lastLink.href) === stripHash(to) && lastLink.closest('[data-mo-open]');
      const top = rec.bar ? Math.max(0, bar.getBoundingClientRect().bottom) : 0;
      if (opener) {
        const box = (opener.dataset.moOpen && opener.querySelector(opener.dataset.moOpen)) || opener;
        const b = box.getBoundingClientRect();
        if (b.width > 1 && b.height > 1 && b.bottom > top && b.top < innerHeight) {
          const cs = getComputedStyle(box);
          const [rh, rv = rh] = cs.borderTopLeftRadius.split(' ');
          const px = (v, side) => (v.endsWith('%') ? parseFloat(v) / 100 * side : parseFloat(v)) || 0;
          rec.open = { left: b.left, top: b.top, width: b.width, height: b.height, radius: Math.min(px(rh, b.width), px(rv, b.height)), bar: top };
          sessionStorage.setItem(`mo-open:${stripHash(to)}`, JSON.stringify({ back: stripHash(location.href), y: scrollY, rect: rec.open }));
          // 点下去时板已经在长（2.8 点下去就开始长）：新页从板这一刻的位置接着长；退回时仍缩回原来那一块
          if (pre && pre.el.isConnected) {
            const p = pre.el.getBoundingClientRect();
            rec.open = { left: p.left, top: p.top, width: p.width, height: p.height,
              radius: parseFloat(getComputedStyle(pre.el).borderTopLeftRadius) || 0, bar: top, elapsed: performance.now() - pre.t0 };
          }
        }
      }
      let opened = null;
      try { opened = JSON.parse(sessionStorage.getItem(`mo-open:${stripHash(location.href)}`) || 'null'); } catch {}
      if (!rec.open && opened && opened.back === stripHash(to)) rec.close = { ...opened.rect, bar: top, y: opened.y };
      if (webkit && opened?.home && opened.back === stripHash(to)) { rec.home = 'in'; rec.bar = false; }
      if (kind === 'list' && rec.nav === 'push' && clickedCover?.to === stripHash(to)) {
        rec.cover = clickedCover.data;
        if (vt) {
          // 命名一层副本，保留旧目录原卡的画面。
          const frame = clickedCover.frame;
          coverCopy = frame.cloneNode(true);
          coverCopy.inert = true;
          coverCopy.style.pointerEvents = 'none';
          frame.after(coverCopy);
          name(coverCopy, 'mo-cover');
        }
      }
      if (webkit) {
        rec.compatHome = (rec.home === 'out' && new URL(to).pathname === '/live/') ||
          (rec.home === 'in' && /^\/live(?:\/|$)/.test(location.pathname));
        if (rec.compatHome && rec.home === 'in') rec.snapshot = homeSnapshot();
        if (rec.open || rec.close || rec.compatHome) { compatRoute(true); vt?.skipTransition(); }
      }
      if (vt && rec.bar) { root.classList.add('mo-vt-nav'); nameBarRight(); }
      sessionStorage.setItem(KEY, JSON.stringify(rec));
    } catch (err) {
      console.error('[motion]', err);
      vt?.skipTransition();
    }
  });

  // ———— 换页：新页这边 ————
  let revealed = !('onpagereveal' in window) || !initialRecord;
  let arrivalAt = 0;        // 1.1：新内容从这一刻起出现（旧页开始退场后 --mo-page-in-at，和旧页交叠）
  const arrivalDelay = () => Math.max(0, arrivalAt - performance.now());   // 页面骨架晚于过渡开始齐了，就少等这么多
  let coverReleased;        // 2.1：目录画面交接结束后，首图按钮才落位
  let uncoverRect = null;
  let still = false;        // 2.8 退回来：第一屏不演 1.2，直接在位（页面要知道的话听 document 上的 motion:still）
  const homeReturn = rec => webkit && rec?.compatHome && rec.home === 'in' ? { home: true, snapshot: rec.snapshot } : null;
  let compatReturn = homeReturn(initialRecord);

  addEventListener('pagereveal', e => {
    const vt = e.viewTransition;
    vt?.ready.catch(() => {});   // 已经揭页、兼容跳过或浏览器取消过渡，都不用等待快照。
    vt?.finished.catch(() => {});
    vt?.updateCallbackDone.catch(() => {});
    if (webkit) document.querySelectorAll('.mo-home-snapshot').forEach(el => {
      if (el.dataset.moArrival) el.removeAttribute('data-mo-arrival'); else el.remove();
    });
    document.querySelectorAll('.mo-sheet').forEach(x => x.remove());   // 从“返回秒开”缓存回来：打开时留下的板不能进新快照
    let rec = null;
    try { rec = readRecord(); sessionStorage.removeItem(KEY); } catch {}
    compatReturn = homeReturn(rec);
    const compatible = webkit && (rec?.open || rec?.close || rec?.compatHome);
    const departed = !rec && !webkit && previousOpen();
    if (departed && !departed.home) {
      sessionStorage.removeItem(SHEET_KEY);
      rec = { close: { ...departed.rect, y: departed.y } };
    }
    if (compatible) vt?.skipTransition();
    clearNames();
    if (!vt && rec?.exit && pageKind() === 'list') pairUncover(rec);
    if (vt && !compatible) {
      if (dead) vt.skipTransition();
      else {
        try { arrive(vt, rec); } catch (err) { console.error('[motion]', err); vt.skipTransition(); clearNames(); }
      }
    } else if (!dead && !webkit && rec?.close) {
      still = true;
      const close = () => shrinkCard(rec.close, rec.close.y);
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', close, { once: true });
      else close();
    } else if (!dead && canReplayCover(rec)) {
      replayCover(rec);
    }
    revealed = true;
    maybeStart();
  });
  addEventListener('pageshow', e => { if (e.persisted && !root.classList.contains('mo-vt')) clearNames(); });

  // 上一次过渡里脚本加的动画是 fill: forwards，过渡结束后还挂在页面上；页面从“返回秒开”缓存里回来再过渡时，
  // 它们的终点（缩成卡片大小、透明）会盖到新的这一次上（第二次返回时缩回去那一片一出来就没了）。过渡一结束就摘掉。
  function dropVtAnims() {
    for (const a of document.getAnimations()) {
      if (a.playState === 'finished' && String(a.effect?.pseudoElement || '').startsWith('::view-transition')) a.cancel();
    }
  }

  function arrive(vt, rec) {
    dropVtAnims();
    // 保险：过渡 3 秒还没完（某个浏览器里动画卡住了），直接跳到新页，页面不能一直停在快照上点不动
    const watchdog = setTimeout(() => { try { vt.skipTransition(); } catch {} }, 3000 * SPEED);
    vt.finished.then(() => clearTimeout(watchdog), () => clearTimeout(watchdog));
    const kind = pageKind();
    const paired = rec?.exit && kind === 'list' && pairUncover(rec);
    let type = 'top';
    if (rec?.home) type = `home-${rec.home}`;
    else if (rec?.open || rec?.close) type = rec.open ? 'open' : 'close';
    // 揭页可能早于正文解析；旧页已把对应目的地的封面位置留下。
    else if (rec?.cover) type = 'cover';
    else if (paired && rec.exit.animate) type = 'uncover';
    else if (rec && kind === 'inner' && rec.fromKind === 'inner') type = dirOf(rec.from) === dirOf(location.href) ? 'same' : 'other';
    root.classList.add('mo-vt', `mo-vt-${type}`);
    if (rec && rec.bar && document.getElementById('topbar')) { root.classList.add('mo-vt-nav'); nameBarRight(); }
    if (type === 'top') arrivalAt = performance.now() + ms('--mo-page-in-at') * SPEED;
    // 旧页先停着，等新页的内容真画出来了再退（最多等 --mo-page-hold），不留一段只剩背景的空当：
    // 图片页等第一张图开始显出来（图要解码）；别的页等新页画出第一帧（电脑忙时这一帧会晚）
    if (type === 'top' || type === 'same' || type === 'other') holdOld(vt);
    if (type === 'cover') {
      const hero = document.querySelector('[data-initial-cover]');
      hero?.querySelector(':scope > img')?.setAttribute('data-cover-carried', '');
      coverReleased = vt.ready.then(() => {
        flyCover(rec, hero, vt.finished);
        return vt.finished;
      }, () => canReplayCover(rec) && !rec.localCover ? vt.finished.then(() => replayCover(rec)) : undefined).catch(() => {});
    }
    if (type === 'uncover') {
      root.style.setProperty('--mo-exit-top', `${rec.exit.top}px`);
      vt.ready.then(() => roundUncover(rec)).catch(() => {});
    }
    if (rec?.home) vt.ready.then(() => flyHome(vt, rec)).catch(() => {});
    if (type === 'open' || type === 'close') {
      // 第一屏不演 1.2，直接在位：打开时长出来的那一片里就是新页本来的样子（不是一片空白再升上来）；退回来时这一页是静止的底图
      still = true;
      // 退回来：先滚回点开时的位置，那一块正好接住缩回来的页
      if (type === 'close' && Math.abs(scrollY - rec.close.y) > 1) scrollTo({ top: rec.close.y, behavior: 'instant' });
      vt.ready.then(() => flyOpen(rec)).catch(() => {});
    }
    vt.finished.then(() => {
      if (rec?.exit && rec.bar) document.getElementById('topbar').dataset.hidden = 'false';
      clearNames();
      dropVtAnims();
    }, () => { clearNames(); dropVtAnims(); });
  }

  // 1.1 / 2.3 旧页退场先按住；新页内容画出来时（init、initInner 里叫 letGo）或到点了放开
  let letGo = () => {};
  function holdOld(vt) {
    let held = [], done = false;
    const go = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      letGo = () => {};
      for (const a of held) { try { a.play(); } catch {} }
    };
    const timer = setTimeout(go, ms('--mo-page-hold') * SPEED);
    letGo = go;
    vt.ready.then(() => {
      if (done) return;
      held = document.getAnimations().filter(a => a.effect?.pseudoElement === '::view-transition-old(root)');
      held.forEach(a => a.pause());
    }).catch(go);
  }

  // 2.1 退出、2.2 机箱共用：把整页快照里的一块（src，视口坐标）等比缩放进一个圆角矩形（dst）。
  // 先铺满 dst，多出来的按 dst 的形状裁掉；横竖用同一个倍数，窗口不是 16:9、手机竖屏都不压扁。
  // 搬动（transform）和裁切（clip-path）分成两段动画：搬动那段只有 transform，浏览器放在合成线程上演，
  // 新页面正忙着排版、解码大图（首页刚打开时就是这样）或者电脑很忙时也照样顺；裁切跟不上只是晚一点裁到位。
  // （原来两样写在一段里，还带着 transform-origin，整段只能在主线程上演：CPU 压慢 6 倍时缩进机箱只剩一两帧。）
  // 两种伪元素的 transform-origin 都由 motion.css 定成 0 0。
  function fitFrames(src, dst, vw, vh) {
    const s = Math.max(dst.width / src.w, dst.height / src.h);
    const w = dst.width / s, h = dst.height / s;
    const L = src.x + (src.w - w) / 2, T0 = src.y + (src.h - h) / 2;
    const clip = (t, r, b, l, rad) => `inset(${t}px ${r}px ${b}px ${l}px round ${rad}px)`;
    return {
      move: [{ transform: 'translate(0px, 0px) scale(1)' }, { transform: `translate(${dst.left - L * s}px, ${dst.top - T0 * s}px) scale(${s})` }],
      clip: [{ clipPath: clip(src.y, vw - src.x - src.w, vh - src.y - src.h, src.x, 0) },
        { clipPath: clip(T0, vw - L - w, vh - T0 - h, L, (dst.radius || 0) / s) }]
    };
  }
  function playFrames(frames, reverse, options) {
    return ['move', 'clip'].map(k => root.animate(reverse ? [...frames[k]].reverse() : frames[k], options));
  }

  // home.js 还没跑时的第二屏玻璃矩形（和 home.js 的 paneAtEnd 同一个算法；舞台 = 整个可视区）
  function glassAtEnd() {
    if (location.pathname !== '/') return null;
    const G = T.homeGlass, w = root.clientWidth, h = innerHeight;
    let scale, top;
    if (w / h < G.srcW / G.srcH) { scale = Math.min(w / G.srcW, h / G.srcH); top = (h - G.srcH * scale) / 2; }
    else { scale = Math.min(w / (G.srcW * G.fitW), h / (G.srcH * G.fitH)); top = h / 2 - G.srcH * scale * G.centerY; }
    const left = (w - G.srcW * scale) / 2;
    return { left: Math.round(left) + G.x * scale, top: Math.round(top) + G.y * scale, width: G.w * scale,
      height: G.w * G.srcH / G.srcW * scale, radius: G.radius * G.w / G.srcW * scale };
  }

  // 2.2 用首页排好的玻璃矩形（首页脚本还没跑完就照同一组数自己算）；算不出时退回 1.1 普通换页（不硬切）。
  function flyHome(vt, rec) {
    const incoming = rec.home === 'in';
    let pane = null;
    try { pane = incoming ? (window.HOME?.paneAtEnd?.() || glassAtEnd()) : rec.pane; } catch {}
    if (!pane?.width || !pane.height) {
      root.classList.remove('mo-vt-home-in', 'mo-vt-home-out');
      root.classList.add('mo-vt-top');
      return;
    }
    const vw = innerWidth, vh = innerHeight;
    const frames = fitFrames({ x: 0, y: 0, w: vw, h: vh }, pane, vw, vh);
    const pseudoElement = `::view-transition-${incoming ? 'old' : 'new'}(root)`;
    const duration = ms('--mo-home') * SPEED, fade = ms('--mo-home-fade') * SPEED;
    playFrames(frames, !incoming, { duration, easing: cssVar('--mo-move'), fill: 'forwards', pseudoElement });
    if (incoming) root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: fade, delay: duration - fade, fill: 'forwards', pseudoElement });
  }

  // 2.8 点开一块 / 退回这一块：和 2.2 同一个算法、同一组时长和曲线（--mo-home、--mo-move、--mo-home-fade）。
  // 只动页眉以下那一片（页眉两页一样，原地不动）；打开时开头这么长淡入（像那一块化开），收回时最后这么长淡掉（和回首页一样）。
  function flyOpen(rec) {
    const opening = !!rec.open, r = rec.open || rec.close;
    const vw = innerWidth, vh = innerHeight, top = Math.min(r.bar || 0, vh - 1);
    const frames = fitFrames({ x: 0, y: top, w: vw, h: vh - top }, r, vw, vh);
    const pseudoElement = `::view-transition-${opening ? 'new' : 'old'}(root)`;
    // 旧页上的板已经长了一段（2.8 点下去就开始长）：从板的位置接着长完剩下的，用减速的曲线，不重新起步；不再等新页
    const going = opening && r.elapsed != null;
    const total = ms('--mo-home') * SPEED;
    const duration = going ? Math.max(240 * SPEED, total - r.elapsed) : total;
    const fade = going ? Math.min(120 * SPEED, duration / 2) : ms('--mo-home-fade') * SPEED;
    const options = { duration, easing: cssVar(going ? '--mo-out' : '--mo-move'), fill: 'forwards', pseudoElement };
    const anims = ['move', 'clip'].map(k => root.animate(opening ? [...frames[k]].reverse() : frames[k], options));
    anims.push(root.animate(opening ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }],
      { duration: fade, delay: opening ? 0 : duration - fade, easing: 'linear', fill: opening ? 'backwards' : 'forwards', pseudoElement }));
    if (!opening || going) return;
    // 打开：新页的第一屏（字、图）画出来再长，不然长出来的是一片空白、看不出是从卡片长出来的；最多等 --mo-page-hold。
    // 等的时候停在起点（那一块的位置、全透明），旧页原样在，看着就是刚按下去。
    anims.forEach(a => a.pause());
    let go = false;
    const start = () => { if (go) return; go = true; anims.forEach(a => { try { a.play(); } catch {} }); };
    setTimeout(start, ms('--mo-page-hold') * SPEED);
    const painted = () => {
      const imgs = [...document.querySelectorAll('main img')].filter(img => img.loading !== 'lazy' && inView(img)).slice(0, 6);
      Promise.all(imgs.map(decoded)).then(() => requestAnimationFrame(() => requestAnimationFrame(start)));
    };
    if (domReady) painted(); else document.addEventListener('DOMContentLoaded', painted, { once: true });
  }

  function canReplayCover(rec) {
    return rec?.cover?.entry && projectWall.test(new URL(rec.from).pathname) && document.startViewTransition;
  }

  function replayCover(rec) {
    root.classList.add('mo-vt-cover');
    const run = async () => {
      const stage = document.createElement('div');
      stage.className = 'mo-cover-replay-stage';
      stage.inert = true;
      function addCard(c) {
        const card = document.createElement('div');
        card.className = 'mo-cover-replay';
        card.style.cssText = `left:${c.left}px;top:${c.top}px;width:${c.width}px;height:${c.height}px;border-radius:${c.radius}px`;
        if (c.preview) {
          const preview = new Image();
          preview.decoding = 'sync';
          preview.src = c.preview;
          card.append(preview);
        } else card.textContent = c.title;
        stage.append(card);
        if (c.src) {
          const image = new Image();
          image.crossOrigin = 'anonymous';
          image.src = c.src;
          return image.decode().then(() => card.replaceChildren(image), () => {});
        }
      }
      // 可见的卡立即留在原位，原缩图解码后再替换临时小图。
      const art = [...(rec.cover.visible || []), rec.cover].map(addCard);
      document.body.append(stage);
      name(stage.lastElementChild, 'mo-cover');
      await Promise.all(art);
      const local = document.startViewTransition(() => {
        stage.remove();
        arrive(local, { ...rec, localCover: true });
      });
      local.ready.catch(() => {});
      local.updateCallbackDone.catch(() => {});
      return local.finished.catch(clearNames);
    };
    coverReleased = (document.body ? run() : new Promise(resolve => {
      document.addEventListener('DOMContentLoaded', () => resolve(run()), { once: true });
    })).catch(clearNames);
    return coverReleased;
  }

  // 两种过渡用同一份来源矩形，落到静态首图的实际位置。
  function flyCover(rec, hero, finished) {
    const art = hero?.querySelector(':scope > img');
    if (!art) {
      console.error('[motion] 缺少首图，不能完成封面交接');
      return;
    }
    const { left, top, width } = art.getBoundingClientRect();
    const c = rec.cover, options = { duration: ms('--mo-cover') * SPEED, easing: cssVar('--mo-move'), fill: 'forwards', pseudoElement: '::view-transition-group(mo-cover)' };
    const k = width / c.width;
    const move = root.animate([
      { transform: `matrix(1, 0, 0, 1, ${c.left}, ${c.top})` },
      { transform: `matrix(${k}, 0, 0, ${k}, ${left}, ${top})` }
    ], options);
    root.animate([{ borderRadius: `${c.radius}px` }, { borderRadius: '0px' }], options);
    // 旧目录和移动封面盖到同一刻，等新页首图（或失败文字）画好再一次淡换。
    const fades = ['root', 'mo-cover'].map(part => root.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: ms('--mo-cover-out') * SPEED, fill: 'both', pseudoElement: `::view-transition-old(${part})`
    }));
    fades.forEach(a => a.pause());
    // loader 在实图解码或确认失败后设置状态，等对应的画面有机会画出。
    const ready = () => art.hasAttribute('data-cover-error') || !art.hasAttribute('data-cover-pending');
    const imageReady = ready() ? Promise.resolve() : new Promise(resolve => {
      const observer = new MutationObserver(() => { if (ready()) { observer.disconnect(); resolve(); } });
      observer.observe(art, { attributeFilter: ['data-cover-pending', 'data-cover-error'] });
      const clean = () => { observer.disconnect(); if (!ready()) art.removeAttribute('data-cover-carried'); };
      finished.then(clean, clean);
    });
    const painted = imageReady.then(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    Promise.all([move.finished, painted]).then(() => {
      if (projectWall.test(new URL(rec.from).pathname)) root.classList.add('mo-vt-cover-handoff');
      fades.forEach(a => a.play());
    }).catch(() => {});
  }

  function pairUncover(rec) {
    const from = new URL(rec.from).pathname;
    const pieces = [...document.querySelectorAll('.wall a.piece')];
    const exact = pieces.find(x => x.pathname === from);
    const a = exact || pieces.find(x => projectOf(x.href) === projectOf(rec.from));
    const savedY = !a ? null : sessionStorage.getItem(exact
      ? `mo-list-page:${listURL(location.href)}:${from}`
      : `mo-list-entry:${listURL(location.href)}:${projectOf(rec.from)}`);
    const generalY = sessionStorage.getItem(`mo-list:${listURL(location.href)}`);
    if (savedY !== null) scrollTo({ top: Number(savedY), behavior: 'instant' });
    else if (a) a.scrollIntoView({ block: 'center', behavior: 'instant' });
    else if (generalY !== null) scrollTo({ top: Number(generalY), behavior: 'instant' });
    // 新列表是静止的底图，不能等入场动画才露出封面。
    for (const p of document.querySelectorAll('.wall .piece')) if (p === a || inView(p)) {   // 含“还在做”的空卡
      p.classList.remove('mo-entering');
      p.classList.add('mo-shown', 'is-in', 'mo-now');
    }
    const art = a && a.querySelector('.piece__art');
    if (!art) return false;
    const r = art.getBoundingClientRect();
    uncoverRect = { left: r.left, top: r.top, width: r.width, height: r.height,
      radius: parseFloat(getComputedStyle(a).borderTopLeftRadius) || 0 };
    return r.width > 0 && r.height > 0;
  }

  function roundUncover(rec) {
    const source = rec.exit;
    const duration = ms('--mo-cover-back') * SPEED, fade = ms('--mo-nav-swap') * SPEED;
    const pseudoElement = '::view-transition-old(root)';
    playFrames(fitFrames({ x: 0, y: source.top, w: source.width, h: source.height - source.top }, uncoverRect, source.width, source.height), false, {
      duration, easing: cssVar('--mo-move'), fill: 'forwards', pseudoElement
    });
    root.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: fade, delay: duration - fade, fill: 'forwards', pseudoElement
    });
  }

  // ———— 2.8 点下去就开始长：一块和页面同色的板从那一块的位置、带着圆角往外长（和 2.2 同一组时长和曲线） ————
  // Chrome、Edge：板在旧页上先长着，新页好了以后过渡从板长到的地方接着长，
  //   新页的字和图在长的过程中显出来，不先干等新页。
  // Firefox、WebKit：板长满再跳，新页照 1.1 出来；退回时这一页先被同色的板盖住，板缩回那一块、最后淡掉
  //   （没有新页快照可用，所以板是素的）。
  const SHEET_KEY = 'mo-left';
  function previousOpen() {
    try {
      const left = JSON.parse(sessionStorage.getItem(SHEET_KEY) || 'null');
      if (!left || Date.now() - left.t > T.navRecordMaxAge) return null;
      const opened = JSON.parse(sessionStorage.getItem(`mo-open:${left.from}`) || 'null');
      return opened && opened.back === stripHash(location.href) ? opened : null;
    } catch { return null; }
  }
  let pre = null;            // 正在长的板（跨页过渡接着用）
  function sheet(from, to, { fadeIn = false, fadeOut = false } = {}) {
    const el = document.createElement('div');
    el.className = 'mo-sheet';
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = 'position:fixed;z-index:99;pointer-events:none;margin:0;box-sizing:border-box;' +
      `background:${getComputedStyle(root).backgroundColor || '#faf9f6'};box-shadow:0 18px 48px -24px rgb(20 20 19 / .28)`;
    (document.body || root).append(el);
    const k = r => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, borderRadius: `${r.radius || 0}px` });
    const duration = ms('--mo-home') * SPEED, fade = ms('--mo-home-fade') * SPEED;
    const animate = (frames, options) => {
      const a = el.animate(frames, options);
      // 替代路线立即对齐文档时钟，避免慢帧/返回缓存时一直 pending、尚未长大就跳页。
      if (!crossDoc || webkit) a.startTime = document.timeline.currentTime;
      return a;
    };
    const move = animate([k(from), k(to)], { duration, easing: cssVar('--mo-move'), fill: 'forwards' });
    if (fadeIn) animate([{ opacity: 0 }, { opacity: 1 }], { duration: fade, easing: 'linear', fill: 'backwards' });
    if (fadeOut) animate([{ opacity: 1 }, { opacity: 0 }], { duration: fade, delay: duration - fade, easing: 'linear', fill: 'forwards' });
    return { el, move, duration, t0: performance.now() };
  }
  const fullBelow = top => ({ left: 0, top, width: innerWidth, height: innerHeight - top, radius: 0 });
  const dropSheets = () => { pre = null; document.querySelectorAll('.mo-sheet').forEach(x => x.remove()); };
  function barBottom() {
    const bar = document.getElementById('topbar');
    return bar && bar.dataset.hidden !== 'true' ? Math.max(0, bar.getBoundingClientRect().bottom) : 0;
  }
  function shrinkCard(rect, y) {
    if (Math.abs(scrollY - y) > 1) scrollTo({ top: y, behavior: 'instant' });
    const s = sheet(fullBelow(barBottom()), rect, { fadeOut: true });
    s.el.style.background = 'rgb(250 249 246 / .35)';
    const done = () => { s.el.remove(); compatRoute(false); };
    s.move.finished.then(done, done);
    setTimeout(done, s.duration + 200);
  }
  function boxRect(box) {
    const r = box.getBoundingClientRect();
    const [rh, rv = rh] = getComputedStyle(box).borderTopLeftRadius.split(' ');
    const px = (v, side) => (v.endsWith('%') ? parseFloat(v) / 100 * side : parseFloat(v)) || 0;
    return { left: r.left, top: r.top, width: r.width, height: r.height, radius: Math.min(px(rh, r.width), px(rv, r.height)) };
  }
  if (on) {
    document.addEventListener('click', e => {
      if (dead || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element && e.target.closest('a[href]');
      const home = webkit && pageKind() === 'home' && a?.matches('.hotspot') && a.pathname === '/live/';
      const opener = home ? a : a && a.closest('[data-mo-open]');
      if (webkit && a && !opener) compatRoute(false);
      if (!opener || (a.target && a.target !== '_self') || a.origin !== location.origin || a.hasAttribute('download')) return;
      const rect = boxRect((opener.dataset.moOpen && opener.querySelector(opener.dataset.moOpen)) || opener), top = home ? 0 : barBottom();
      if (rect.width < 2 || rect.height < 2 || rect.top + rect.height < top || rect.top > innerHeight) return;
      dropSheets();
      if (crossDoc && !webkit) {
        pre = sheet(rect, fullBelow(top), { fadeIn: true });
        const mine = pre;
        setTimeout(() => { if (pre === mine) dropSheets(); }, 10000);   // 十秒还没跳走（被拦下、取消了）：收掉
        return;
      }
      e.preventDefault();
      compatRoute(true);
      try { sessionStorage.setItem(`mo-open:${stripHash(a.href)}`, JSON.stringify({ back: stripHash(location.href), y: scrollY, rect, home })); } catch {}
      const s = sheet(rect, fullBelow(top), { fadeIn: true });
      setTimeout(() => { location.href = a.href; }, Math.max(0, s.duration - 60));
    });
    // 从“返回秒开”缓存回来：打开时留下的板先摘掉
    addEventListener('pageshow', e => { if (e.persisted) dropSheets(); });
  }
  if (on) {
    // 浏览器后退时不一定给 pageswap 目的地。保留离开的地址，回到打开它的页面再认父卡。
    addEventListener('pagehide', () => {
      try { sessionStorage.setItem(SHEET_KEY, JSON.stringify({ from: stripHash(location.href), t: Date.now() })); } catch {}
    });
  }
  if (on && (!crossDoc || webkit)) {
    const backFrom = () => compatReturn || previousOpen();
    const shrink = opened => {
      compatReturn = null;
      sessionStorage.removeItem(SHEET_KEY);
      dropSheets();
      if (opened.home) {
        root.classList.add('mo-sheet-wait');
        const cover = opened.cover || (opened.snapshot && snapshotSurface(opened.snapshot));
        const track = document.querySelector('.track'), stage = track?.querySelector('.stage');
        if (track && stage) scrollTo({ top: track.offsetTop + track.offsetHeight - stage.offsetHeight, behavior: 'instant' });
        Promise.all([cover?.ready, window.HOME?.firstScreenReady]).then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
          const pane = window.HOME?.paneAtEnd?.() || glassAtEnd();
          if (cover) {
            const frames = fitFrames({ x: 0, y: 0, w: innerWidth, h: innerHeight }, pane, innerWidth, innerHeight), duration = ms('--mo-home') * SPEED, fade = ms('--mo-home-fade') * SPEED;
            const options = { duration, easing: cssVar('--mo-move'), fill: 'forwards' };
            const anims = ['move', 'clip'].map(k => cover.el.animate(frames[k], options));
            anims.push(cover.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: fade, delay: duration - fade, fill: 'forwards' }));
            anims.forEach(a => { a.startTime = document.timeline.currentTime; });
            anims[0].finished.then(() => { cover.el.remove(); compatRoute(false); }, () => cover.el.remove());
          } else {
            const s = sheet(fullBelow(0), pane, { fadeOut: true });
            s.move.finished.then(() => { s.el.remove(); compatRoute(false); }, () => s.el.remove());
          }
          root.classList.remove('mo-sheet-wait');
        })));
        return;
      }
      shrinkCard(opened.rect, opened.y);
    };
    // 新载入：页头就决定第一屏不演 1.2、先盖上，骨架齐了就缩回
    const opened = backFrom();
    if (opened) {
      still = true;
      root.classList.add('mo-sheet-wait');   // 第一帧就先盖上（motion.css），不先闪一下这一页
      if (opened.home && opened.snapshot) opened.cover = snapshotSurface(opened.snapshot, true);
      if (!opened.home) setTimeout(() => root.classList.remove('mo-sheet-wait'), 1500);
      const go = () => requestAnimationFrame(() => shrink(opened));
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go, { once: true }); else go();
    }
    addEventListener('pageshow', e => {
      if (!e.persisted) return;
      const o = !dead && backFrom();
      if (o) shrink(o);
    });
  }

  // ———— 进页以后：等页面骨架齐了、页面露出来了，再开始出现 ————
  let started = false, domReady = document.readyState !== 'loading';
  function maybeStart() {
    if (started || !domReady || !revealed) return;
    started = true;
    if (dead) return;
    try { init(); } catch (err) { fail(err); }
  }
  document.addEventListener('DOMContentLoaded', () => {
    domReady = true;
    maybeStart();
    setTimeout(() => { revealed = true; maybeStart(); }, T.revealWait);
  });

  // 加一个动画类，演完摘掉（摘掉后的样子就是落定的样子）
  function play(el, cls, delay, length) {
    el.style.setProperty('--mo-d', `${Math.round(delay)}ms`);
    el.classList.add(cls);
    setTimeout(() => { el.classList.remove(cls); el.style.removeProperty('--mo-d'); }, delay + length + 60);
  }

  function init() {
    const kind = pageKind();
    const risen = initRise();
    if (kind === 'list') {
      initList(risen);
      if (projectWall.test(location.pathname)) prepareSmallArt(wallArt);
    }
    if (kind === 'inner') {
      initInner();
      prepareSmallArt(coverArt);
    }
    else requestAnimationFrame(() => requestAnimationFrame(() => letGo()));   // 新页第一帧画好了：旧页开始退
    document.addEventListener('visibilitychange', () => {
      root.classList.toggle('mo-bg-paused', document.hidden);
      if (!document.hidden) syncDust();   // 回到前台：光斑按钟点重新对相位，下一页接得上
    });
    setTimeout(ambient, 1800);
  }

  // 每页都要有点在动的：入场演完后，页面自己没有一直在动的东西（灯、光、视频、插画动画都没有），
  // 铺一层全站同一套光斑（2.5），在内容后面慢慢飘，不挡字、不抢读数
  function ambient() {
    if (dead || document.querySelector('.mo-dust')) return;
    // 页眉那颗小灯一直在呼吸，不算页面自己的动效
    const looping = document.getAnimations().some(a => a.playState === 'running' && a.effect?.getTiming?.().iterations === Infinity &&
      !a.effect.target?.closest?.('.topbar,.site-header'));
    if (looping || window.LiveLight || [...document.querySelectorAll('video')].some(v => !v.paused)) return;
    const layer = document.createElement('div');
    layer.className = 'mo-dust';
    layer.setAttribute('aria-hidden', 'true');
    // 这类页多半铺着不透明的底，垫在后面会被盖住：浮在内容上面，用“正片叠底”只给浅底染一点色，字照样是原来的颜色、点得到
    layer.style.zIndex = '1';
    layer.style.mixBlendMode = 'multiply';
    document.body.append(layer);
    build(layer, false);
    for (const s of layer.children) s.style.setProperty('--a', (parseFloat(s.style.getPropertyValue('--a')) * .7).toFixed(3));
  }

  // 1.2 顶层：几大块按阅读顺序错开出现
  function initRise() {
    const blocks = [...document.querySelectorAll('.rules-title, .rules-toc, .rules-body, .rules-meta, [data-mo-rise]')]
      .filter(el => {
        if (el.classList.contains('mo-shown')) return false;
        // 3 秒保险已经让它露出来了（慢网）：就这样留着，不再藏回去重演
        if (getComputedStyle(el).opacity === '1') { el.classList.add('mo-shown'); return false; }
        return true;
      });
    if (still) {
      blocks.forEach(el => el.classList.add('mo-shown'));
      document.dispatchEvent(new CustomEvent('motion:still'));
      return 0;
    }
    const step = ms('--mo-rise-step') * SPEED, length = ms('--mo-rise') * SPEED;
    const at = arrivalDelay();
    blocks.forEach((el, i) => {
      el.classList.add('mo-shown');
      play(el, 'mo-rise', at + i * step, length);
    });
    return blocks.length;
  }

  // 1.2 列表页的封面卡
  function initList(risen) {
    const pieces = [...document.querySelectorAll('.wall .piece')];
    if (root.classList.contains('no-anim')) { pieces.forEach(p => p.classList.add('mo-shown', 'is-in')); return; }
    const step = ms('--mo-card-step') * SPEED;
    const length = Math.max(ms('--mo-rise'), ms('--mo-glow-delay') + ms('--mo-glow')) * SPEED;
    let base = arrivalDelay() + risen * ms('--mo-rise-step') * SPEED;
    const show = (p, delay) => {
      p.style.setProperty('--mo-d', `${Math.round(delay)}ms`);
      p.classList.add('mo-entering', 'mo-shown', 'is-in');
      setTimeout(() => { p.classList.remove('mo-entering'); p.style.removeProperty('--mo-d'); }, delay + length + 60);
    };
    const io = new IntersectionObserver(entries => {
      if (dead) { io.disconnect(); return; }
      const batch = entries.filter(en => en.isIntersecting && en.intersectionRatio >= T.cardShowAt).map(en => en.target)
        .filter(p => !p.classList.contains('mo-shown'))
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      batch.forEach((p, i) => { io.unobserve(p); show(p, base + Math.min(i, T.cardStaggerCount - 1) * step); });
      if (batch.length) base = 0;
    }, { threshold: T.cardShowAt });
    pieces.forEach(p => { if (!p.classList.contains('mo-shown')) io.observe(p); });
  }

  // 2.4 / 2.6 图片页：每张图从模糊变清楚，按钮晚半拍落上去
  function initInner() {
    initDust();
    const sections = [...document.querySelectorAll('#pictures > .picture:has(> .more)')];
    // 首图按进场交接；正文图已解码且露出四分之一才淡入、对焦。
    let lastY = scrollY, lastT = performance.now(), vel = 0;
    addEventListener('scroll', () => {
      const t = performance.now(), y = scrollY, dt = t - lastT;
      if (dt > 0) { const v = Math.abs(y - lastY) / dt * 1000; vel = dt > 150 ? v : (vel + v) / 2; }
      lastY = y; lastT = t;
      for (const sec of sections) if (sec._mo !== 'done' && past(sec)) settle(sec);
    }, { passive: true });
    const fast = () => performance.now() - lastT < 150 && vel > T.fastScreensPerSec * innerHeight;
    const past = sec => { const r = sec.getBoundingClientRect(); return -r.top > r.height * T.pastShare; };
    const isBodyPicture = sec => !sec.hasAttribute('data-initial-cover');
    const visibleShare = sec => {
      const { left, right, top, bottom, width, height } = sec.getBoundingClientRect();
      const x = Math.max(0, Math.min(right, innerWidth) - Math.max(left, 0));
      const y = Math.max(0, Math.min(bottom, innerHeight) - Math.max(top, 0));
      return width && height ? x * y / (width * height) : 0;
    };

    const io = new IntersectionObserver(entries => {
      if (dead) { io.disconnect(); return; }
      for (const en of entries) if (en.isIntersecting && en.intersectionRatio >= T.imageShowAt) want(en.target);
    }, { threshold: T.imageShowAt });

    function settle(sec) {
      letGo();
      sec._mo = 'done'; io.unobserve(sec);
      if (isBodyPicture(sec)) sec.classList.add('mo-shown');
    }
    function want(sec) {
      if (sec._mo) return;
      const img = sec.querySelector(':scope > img'), body = isBodyPicture(sec);
      sec._mo = 'wait';
      const quick = fast();
      const begin = () => {
        if (dead || sec._mo !== 'wait') return;
        const ready = body && img.decode ? img.decode() : decoded(img);
        ready.then(() => {
          if (dead || sec._mo !== 'wait') return;
          if (past(sec)) settle(sec);
          else if (body ? visibleShare(sec) < T.imageShowAt : !inView(sec)) sec._mo = null;
          else landButtons(sec, body ? quick : fast());
        }, () => { if (sec._mo === 'wait') sec._mo = null; });
      };
      if (body && !img.naturalWidth) img.addEventListener('load', begin, { once: true });
      else begin();
    }
    function landButtons(sec, quick) {
      settle(sec);   // 第一张图已经开始显出来，放旧页退场。
      const fade = ms(quick ? '--mo-focus-quick-fade' : '--mo-focus-fade') * SPEED;
      const clear = ms(quick ? '--mo-focus-quick' : '--mo-focus') * SPEED;
      if (isBodyPicture(sec)) {
        sec.classList.toggle('mo-quick', quick);
        play(sec, 'mo-focus', 0, fade + clear);
      }
      dropButtons(sec, fade + Math.min(ms('--mo-btn-after') * SPEED, clear));
    }

    function observe(sec) {
      if (sec.hasAttribute('data-initial-cover') && coverReleased) {
        // 旧封面离开以后才开始按钮的动效，避免它们先露出、再被盖住。
        sec._mo = 'done';
        coverReleased.then(() => dropButtons(sec, 0));
      } else if (past(sec)) settle(sec);
      else io.observe(sec);
    }
    sections.forEach(observe);
    // 正文按需加载，之后加入的图也要接上按钮动效。
    const box = document.getElementById('pictures');
    if (box) new MutationObserver(() => {
      if (dead) return;
      for (const sec of box.querySelectorAll(':scope > .picture:has(> .more)')) {
        if (sections.includes(sec)) continue;
        sections.push(sec);
        observe(sec);
      }
    }).observe(box, { childList: true, subtree: true });
  }

  function decoded(img) {
    if (!img) return Promise.resolve();
    const dec = () => (img.decode ? img.decode().catch(() => {}) : Promise.resolve());
    if (img.complete) return dec();
    return new Promise(res => {
      img.addEventListener('load', () => dec().then(res), { once: true });
      img.addEventListener('error', res, { once: true });
    });
  }

  function dropButtons(sec, delay) {
    const pills = [...sec.querySelectorAll('.picture-actions > .pill')]
      .sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    const more = sec.querySelector(':scope > .more');
    if (more) pills.push(more);   // “细节”小牌最后
    const step = ms('--mo-btn-step') * SPEED, length = ms('--mo-btn') * SPEED;
    pills.forEach((b, i) => play(b, 'mo-drop', delay + i * step, length));
  }

  // 2.5 光晕：柔和七彩、以绿为主；固定在窗口里，在背景和图之间那一层。
  // 至少 nearEdge 个落在图那一列左右边缘附近（两边露出的背景里，或从图后面探出半个），其余随便。
  // 用哪几个颜色、落在哪按项目目录定（同一个项目里各页一样），相位按钟点算，同一个项目换页接着飘。
  function initDust() {
    const cfg = window.PROJECT_CONFIG;
    if (!cfg || !cfg.background) return;
    const layer = document.createElement('div');
    layer.className = 'mo-dust';
    layer.setAttribute('aria-hidden', 'true');
    document.body.append(layer);
    const seenKey = `mo-dust-seen:${dirOf(location.href)}`;
    let seen = false;
    try { seen = sessionStorage.getItem(seenKey) === '1'; sessionStorage.setItem(seenKey, '1'); } catch {}
    build(layer, seen);   // 这个项目里已经看过：直接在，不再整层淡入
  }

  function build(layer, instant) {
    const D = T.dust;
    let seed = 0;
    for (const ch of dirOf(location.href)) seed = (Math.imul(seed, 31) + ch.charCodeAt(0)) | 0;
    const rand = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const lerp = (a, b) => a + (b - a) * rand();
    const pick = list => list[Math.min(list.length - 1, Math.floor(rand() * list.length))];
    let n = D.min + Math.floor(rand() * (D.max - D.min + 1));
    let edge = D.nearEdge;
    if (matchMedia('(hover: none)').matches) { n = Math.max(1, Math.round(n * D.touchShare)); edge = Math.ceil(edge * D.touchShare); }
    const now = Date.now() / 1000;
    const side0 = rand() < 0.5 ? -1 : 1;
    for (let i = 0; i < n; i++) {
      const d = lerp(D.dMin, D.dMax), a = lerp(D.aMin, D.aMax), speed = lerp(D.speedMin, D.speedMax);
      const tilt = (rand() * 2 - 1) * D.tilt * Math.PI / 180, up = rand() < 0.5 ? -1 : 1;
      const travel = lerp(D.travelMin, D.travelMax), t = travel / speed;
      const p = lerp(D.pulseMin, D.pulseMax) / 2;
      const color = rand() < D.greenShare ? pick(D.greens) : pick(D.others);
      let x, y;
      if (i < edge) {
        // 左右轮流贴着图那一列的边：中心在边外 0～120、边内 0～40 像素之间（多半在露出的背景里），上下分散开
        const side = i % 2 ? -side0 : side0, out = lerp(-40, D.edgeBand);
        x = `calc(50% ${side < 0 ? '-' : '+'} var(--content-width, 1440px) / 2 ${side < 0 ? '-' : '+'} ${out.toFixed(1)}px)`;
        y = `${(((i + 0.15 + rand() * 0.7) / edge) * 100).toFixed(1)}%`;
      } else { x = `${(rand() * 100).toFixed(1)}%`; y = `${(rand() * 100).toFixed(1)}%`; }
      const s = document.createElement('i');
      const set = (k, v) => s.style.setProperty(k, v);
      set('--x', x); set('--y', y); set('--s', `${d.toFixed(0)}px`); set('--c', color); set('--a', a.toFixed(3));
      set('--dx', `${(Math.sin(tilt) * travel).toFixed(1)}px`); set('--dy', `${(up * Math.cos(tilt) * travel).toFixed(1)}px`);
      set('--t', `${t.toFixed(2)}s`); set('--p', `${p.toFixed(2)}s`);
      s.dataset.t = t.toFixed(2); s.dataset.p = p.toFixed(2);
      layer.append(s);
    }
    syncDust(now);
    if (instant) layer.classList.add('is-instant');
    requestAnimationFrame(() => layer.classList.add('is-ready'));
  }

  // 光斑的相位按钟点算：建好时、从后台回来时各对一次（后台时暂停过，不对就和下一页接不上）
  function syncDust(now = Date.now() / 1000) {
    for (const s of document.querySelectorAll('.mo-dust i')) {
      const t = Number(s.dataset.t), p = Number(s.dataset.p);
      s.style.setProperty('--td', `${-(now % (2 * t)).toFixed(2)}s`);
      s.style.setProperty('--pd', `${-(now % (2 * p)).toFixed(2)}s`);
      if (s.isConnected && s.getAnimations().length) { s.style.animation = 'none'; void s.offsetWidth; s.style.animation = ''; }
    }
  }

  // ———— 2.7 细节栏：给 公用\page.js 用的几个口子（page.js 里没有这个对象时照原来瞬间开合） ————
  const detail = (() => {
    const running = new Set();
    let ghosts = [], hidden = null, openedTop = 0, openedId = null;
    const track = a => { running.add(a); a.finished.then(() => running.delete(a), () => running.delete(a)); return a; };
    const parts = drawer => [...drawer.children];   // 标题区、正文、翻张
    function stop() {
      for (const a of [...running]) a.cancel();
      running.clear();
      ghosts.forEach(g => g.remove());
      ghosts = [];
    }
    function hide(id) {
      show();
      const img = document.querySelector(`#${CSS.escape(id)} > img`);
      if (img) { img.style.visibility = 'hidden'; hidden = img; }
    }
    function show() { if (hidden) { hidden.style.visibility = ''; hidden = null; } }

    return {
      active: () => !dead,
      reset() { stop(); show(); document.body && document.body.classList.remove('mo-closing'); },

      // 打开：图从页面上的位置搬到左边，纸晚 60 毫秒从图的右边缘后面抽出来，字最后淡入；别的东西由 motion.css 暗下去
      open({ shot, drawer, from, item }) {
        stop();
        openedId = item.id; openedTop = from.top;
        hide(item.id);
        const sheet = ms('--mo-sheet') * SPEED, lag = ms('--mo-sheet-lag') * SPEED, text = ms('--mo-sheet-text') * SPEED, move = cssVar('--mo-move');
        const end = getComputedStyle(shot).transform;
        const origin = shot.closest('dialog').getBoundingClientRect();
        const start = `translate(${from.left - origin.left}px, ${from.top - origin.top}px) scale(${from.width / item.width})`;
        const dx = shot.getBoundingClientRect().right - drawer.getBoundingClientRect().right;
        track(shot.animate([{ transform: start }, { transform: end }], { duration: sheet, easing: move }));
        track(drawer.animate([
          { transform: `translateX(${dx}px)`, opacity: 0 },
          { opacity: 1, offset: 0.3 },
          { transform: 'translateX(0)', opacity: 1 }
        ], { duration: sheet, delay: lag, easing: move, fill: 'backwards' }));
        parts(drawer).forEach(el => track(el.animate([{ opacity: 0 }, { opacity: 1 }],
          { duration: text, delay: lag + sheet - text, easing: 'ease', fill: 'backwards' })));
      },

      // 收起：反着演；页面先挪到最后看的那张，图搬回的就是那张的位置
      close({ shot, drawer, item }, done) {
        // 打开还没演完就收起：从这一刻的位置往回演，不先跳到终点
        const curShot = running.size ? getComputedStyle(shot).transform : null;
        const curDrawer = running.size ? { transform: getComputedStyle(drawer).transform, opacity: getComputedStyle(drawer).opacity } : null;
        stop();
        let finished = false, closing = [];
        const finish = () => {
          if (finished) return;
          finished = true;
          // 收起的几段动画是 fill: forwards，演完后已不在 running 里，stop() 摘不掉；
          // 不在这里摘掉，下次打开同一张时图会停在页面上的位置、纸一直是透明的。
          try { done(); } finally { document.body.classList.remove('mo-closing'); closing.forEach(a => a.cancel()); stop(); show(); }
        };
        const img = document.querySelector(`#${CSS.escape(item.id)} > img`);
        if (img && item.id !== openedId) {
          const r0 = img.getBoundingClientRect();
          window.scrollTo({ top: Math.max(0, scrollY + r0.top - openedTop), behavior: 'instant' });
        }
        const r = img && img.getBoundingClientRect();
        hide(item.id);
        document.body.classList.add('mo-closing');
        const length = ms('--mo-sheet-close') * SPEED, move = cssVar('--mo-move');
        const cur = curShot || getComputedStyle(shot).transform;
        const origin = shot.closest('dialog').getBoundingClientRect();
        const target = r ? `translate(${r.left - origin.left}px, ${r.top - origin.top}px) scale(${r.width / item.width})` : cur;
        const dx = shot.getBoundingClientRect().right - drawer.getBoundingClientRect().right;
        const textOut = ms('--mo-sheet-text') * SPEED * length / (ms('--mo-sheet') * SPEED);
        const all = [
          track(shot.animate([{ transform: cur }, { transform: target }], { duration: length, easing: move, fill: 'forwards' })),
          track(drawer.animate([
            curDrawer ? { transform: curDrawer.transform, opacity: Number(curDrawer.opacity) } : { transform: 'translateX(0)', opacity: 1 },
            { opacity: 1, offset: 0.7 },
            { transform: `translateX(${dx}px)`, opacity: 0 }
          ], { duration: length, easing: move, fill: 'forwards' })),
          ...parts(drawer).map(el => track(el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: textOut, easing: 'ease', fill: 'forwards' })))
        ];
        closing = all;
        Promise.all(all.map(a => a.finished)).then(finish, finish);
      },

      // 在细节栏里翻张：图淡换、朝翻的方向带一点；纸不动，字换
      flip({ dir, shot, drawer, apply }) {
        const curShot = running.size ? getComputedStyle(shot).transform : null;   // 打开还没演完就翻：旧图从这一刻的位置淡走
        stop();
        const ghost = shot.cloneNode(true);
        if (curShot && curShot !== 'none') ghost.style.transform = curShot;
        ghost.removeAttribute('title');
        ghost.setAttribute('aria-hidden', 'true');
        ghost.style.pointerEvents = 'none';
        shot.before(ghost);
        ghosts.push(ghost);
        apply();
        const d = ms('--mo-flip') * SPEED;
        const x = parseFloat(cssVar('--mo-flip-x')) * dir, out = cssVar('--mo-out');
        track(ghost.animate([{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: `${-x}px 0` }], { duration: d, easing: out, fill: 'forwards' }))
          .finished.then(() => ghost.remove(), () => ghost.remove());
        track(shot.animate([{ opacity: 0, translate: `${x}px 0` }, { opacity: 1, translate: '0 0' }], { duration: d, easing: out }));
        const td = ms('--mo-flip-text') * SPEED;
        parts(drawer).forEach(el => track(el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: td, easing: 'ease' })));
      }
    };
  })();
  if (on) window.MOTION_DETAIL = detail;
})();
