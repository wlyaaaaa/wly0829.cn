/* 小鸟带路（LivingBird.guide）：读者往下翻，画快翻出去时，鸟先在画里起飞、从画的上沿飞出去；读者停下约 1.5 秒，
 * 鸟从吸顶栏下面飞进眼前，落在那一节的小标题或卡片上沿。往回翻、画重新露出来时反过来：鸟从眼前往上飞走，
 * 读者停下后再从画的上沿落回原来的落脚点。夜里鸟在画里睡、不跟；系统设了减少动态时整块不启用；标签页隐藏时不做决定。
 *
 * 用法：var g = LivingBird.guide(bird, { data: 配置.guide[方向], params: 配置.guide.params });  // 没有可用落点时返回 null
 *       g.state() 读最近一次决定；g.destroy() 拆掉（鸟 destroy 时自动拆）。
 * 落点由 scripts/bird_guide_perches.py 离线从分片原图算好（不压字、不挡链接、不站角尖），这里只按读者位置挑一个。
 * 性能：滚动监听是 passive；回调里只记时间，并且每 0.1 秒最多用缓存的画框位置和 scrollY 比一次（不读版面）；
 *       停下后才一次性读位置、再交给鸟去写；只有鸟在飞或在做小动作时才跑动画帧。
 */
(function (G) {
  'use strict';
  if (!G.LivingBird) return;

  // 可调参数（秒、视口占比、像素/秒、CSS 像素）。配置 guide.params 里同名字段可以按页覆盖。
  var DEFAULTS = {
    dwell: 1.5,          // 停下多久才飞（电脑）；离开画后的第一次落下也照这个，读者马上能发现它在跟
    phoneDwell: 1.5,     // 手机
    homeDwell: 0.9,      // 画重新露出来、家在眼前以后，停多久落回画里
    gap: 20,             // 之后在页面上挪地方：两次至少隔几秒（电脑）
    phoneGap: 25,        // 手机
    pageMin: 32,         // 鸟离开画后在页面上的最小站高（电脑），飞行途中平滑变大，回画时缩回原样
    phonePageMin: 28,    // 手机
    departLine: 0.35,    // 往下翻：家的落点被翻到吸顶栏以下可视高度的上 35% 以内时起飞……
    departFrac: 0.55,    // ……或者画只剩 55% 还露在吸顶栏下面时起飞（两者先到为准；落点得还看得见）
    returnFrac: 0.12,    // 往回翻：画的下沿露出到吸顶栏下 12% 可视高度时，鸟先从眼前飞走……
    leaveLow: 0.85,      // ……或者鸟的落点被翻到屏幕 85% 以下、快掉出眼前时，就先往上飞走（不被读者甩在后面）
    fastScroll: 2.5,     // 翻得比这快（像素/毫秒，例如点“回到顶部”）就不演飞走，直接收起
    readLine: 0.3,       // 读者眼睛所在的那条线：吸顶栏以下可视高度的 30%
    bandBottom: 0.58,    // 候选落点最低到可视高度的 58%（再低就不算“眼前”）
    stayBottom: 0.8,     // 鸟当前落点还在吸顶栏下到 80% 之间，就不挪
    far: 1.25,           // 新落点离鸟超过 1.25 个屏高：不长途飞，从屏幕上沿或下沿飞进来（电脑）
    phoneFar: 0.9,       // 手机更短
    pace: 720,           // 飞行速度（像素/秒，电脑）
    phonePace: 520,      // 手机慢一点、距离也短
    titleBonus: 0.06,    // 同样近时更愿意落在小标题上
    phoneWidth: 768,     // 窄于这个宽度按手机
    chrome: ['#site-header', '.toc'],   // 吸顶的栏：鸟不落在它们下面，进出页面都从它们后面
  };

  function guide(bird, o) {
    o = o || {};
    var data = o.data;
    if (!bird || !data || !data.parts || !data.parts.length) return null;
    var P = {}, k;
    for (k in DEFAULTS) P[k] = DEFAULTS[k];
    if (o.params) for (k in o.params) if (k in DEFAULTS) P[k] = o.params[k];

    var dead = false, timer = 0, lastScroll = 0, lastWatch = 0, lastY = G.scrollY || 0, lastVisit = -1e9, inflight = false, started = false;
    var current = null, parts = [], resizeTimer = 0, fromPainting = false, geo = null;
    var why = 'waiting', decisions = 0, flights = 0, homes = 0, departs = 0, leaves = 0, scan = null;

    function phone() { return (document.documentElement.clientWidth || G.innerWidth) < P.phoneWidth; }
    function base(src) { try { return new URL(src, document.baseURI).pathname.split('/').pop(); } catch (e) { return ''; } }
    function where(st) { return st.mode === 'page' ? 'page' : st.vis ? 'home' : 'away'; }

    // 页面数据里的分片 → 当前页面上的元素；原图换过（文件名不同）的分片整块跳过，免得落点对不上
    function resolve() {
      parts = [];
      data.parts.forEach(function (d) {
        var sec = document.getElementById(d.s);
        if (!sec) return;
        var list = sec.querySelectorAll('.typeset-part[data-orientation="' + (d.o || o.orient || 'h') + '"]'), el = list[d.i || 0];
        var im = el && el.querySelector('picture img');
        if (!im || base(im.getAttribute('data-src') || im.getAttribute('src') || im.currentSrc) !== d.img) return;
        parts.push({ el: el, d: d });
      });
      bird.setPageSize(phone() ? P.phonePageMin : P.pageMin);
    }
    function chromeBottom(vh) {                                            // 吸顶栏的下沿（视口坐标）
      var b = 0;
      for (var i = 0; i < P.chrome.length; i++) {
        var el = document.querySelector(P.chrome[i]);
        if (!el) continue;
        var r = el.getBoundingClientRect();
        if (r.height > 0 && r.top < 0.3 * vh && r.bottom > b) b = r.bottom;
      }
      return b;
    }
    function measureGeo(i, hdr) {                                          // 画框和家的位置换成页面坐标缓存起来，滚动时只用 scrollY 比
      var y = G.scrollY || 0;
      geo = { homeDoc: i.home.y + y, top: i.home.top + y, bottom: i.home.bottom + y, ha: i.ha, hdr: hdr };
    }

    // ---------- 滚动：回调里只记时间；节流地看一眼要不要起飞或从眼前飞走 ----------
    function need() {
      if (geo && (G.scrollY || 0) < geo.bottom - geo.hdr) return P.homeDwell * 1000;
      return (phone() ? P.phoneDwell : P.dwell) * 1000;
    }
    function onScroll() {
      var now = performance.now();
      lastScroll = now;
      if (!timer) timer = setTimeout(tick, need());
      if (now - lastWatch > 100) { lastWatch = now; watch(); }
    }
    function tick() {
      timer = 0;
      if (dead) return;
      var idle = performance.now() - lastScroll, n = need();
      if (idle < n - 8) { timer = setTimeout(tick, n - idle); return; }    // 还在翻：等停下
      decide();
    }
    function later(ms) { if (!timer && !dead) timer = setTimeout(tick, Math.max(50, ms)); }

    var lastWatchY = 0;
    function watch() {
      var y = G.scrollY || 0, down = y > lastY + 1, up = y < lastY - 1, now = performance.now();
      var speed = Math.abs(y - lastY) / Math.max(16, now - lastWatchY);
      lastY = y; lastWatchY = now;
      if (dead || inflight || document.hidden) return;
      if (o.refreshNight) o.refreshNight();
      var st = bird.state();
      if (!st || !st.loaded || st.reduced || st.night) return;
      if (!started) { if (st.vis && !st.busy) started = true; else return; }
      if (!geo) { var i0 = bird.info(); if (!i0) return; measureGeo(i0, chromeBottom(G.innerHeight)); }   // 只在第一次和窗口变化后读一次版面
      var w = where(st), hdr = geo.hdr, vh = G.innerHeight;
      if (w === 'home' && down && !st.flying) {
        // 起飞提示：画快翻出去、家的落点还看得见时，鸟在画里起飞，从画的上沿飞出去
        var homeC = geo.homeDoc - y, top = geo.top - y, bottom = geo.bottom - y;
        var frac = (bottom - Math.max(hdr, top)) / Math.max(1, bottom - top);
        if (homeC > hdr + 0.3 * geo.ha && (homeC < hdr + Math.max(1.6 * geo.ha, P.departLine * (vh - hdr)) || frac <= P.departFrac)) {
          inflight = true; why = 'depart';
          bird.away({ pace: phone() ? P.phonePace : P.pace }).then(function () { inflight = false; departs++; fromPainting = true; });
        }
      } else if (w === 'page' && up && !st.flying && ((current && current.docY - y > vh - (1 - P.leaveLow) * (vh - hdr)) || geo.bottom - y > hdr + P.returnFrac * (vh - hdr))) {
        // 往回翻：落点快掉出眼前、或画重新露出来时，鸟先从眼前往上飞走；翻得太快或落点已不在眼前就直接收起
        inflight = true; why = 'leave-page';
        bird.away({ edge: { top: hdr }, pace: phone() ? P.phonePace : P.pace, instant: speed > P.fastScroll }).then(function () {
          inflight = false; leaves++; current = null; fromPainting = false;
        });
      }
    }

    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (dead) return;
        resolve(); geo = null;
        if (!current || inflight) return;                                   // 版面变了：鸟原地挪到同一个落点的新位置，不飞
        var r = current.el.getBoundingClientRect(), q = current.q;
        if (!r.height) return;
        current.docY = r.top + q[2] * r.height + (G.scrollY || 0);
        bird.visit({ x: r.left + q[1] * r.width, y: r.top + q[2] * r.height, facing: q[3], instant: true });
      }, 250);
    }

    // ---------- 决定：一次读完所有位置，再让鸟去飞 ----------
    function decide() {
      decisions++;
      if (dead) return;
      if (document.hidden) { why = 'hidden'; return; }
      if (o.refreshNight) o.refreshNight();
      var st = bird.state();
      if (!st || !st.loaded || st.reduced) { why = 'bird-not-ready'; later(1200); return; }
      if (!started) { if (st.vis && !st.busy) started = true; else { why = 'bird-not-ready'; later(1200); return; } }
      if (st.night) { why = 'night'; return; }                              // 夜里在画里睡；在页面上时鸟自己会先飞回去
      if (inflight || (st.busy && where(st) !== 'away')) { why = 'busy'; later(800); return; }
      var i = bird.info(), w = where(st);
      var vh = G.innerHeight, hdr = chromeBottom(vh), use = Math.max(1, vh - hdr), b = i.h, now = performance.now();
      var pace = phone() ? P.phonePace : P.pace, far = (phone() ? P.phoneFar : P.far) * vh;
      measureGeo(i, hdr);
      var edge = { top: hdr, bottom: vh };
      var visible = w !== 'away' && i.y > hdr - 0.2 * b && i.y - b < vh;   // 鸟本身在眼前吗

      // 1) 画重新露出来、家在眼前：不在家就落回画里（在页面上的先从眼前飞走）
      if (i.home.y > hdr + 0.3 * i.ha && i.home.y < vh * 0.88 && i.home.bottom > hdr) {
        if (w === 'home') { why = 'home-already'; current = null; return; }
        inflight = true; why = 'return-home';
        var first = w === 'page' ? bird.away({ edge: edge, pace: pace }) : Promise.resolve();
        first.then(function () { return bird.arrive({ from: 'top' }); }).then(function () {
          inflight = false; current = null; homes++; fromPainting = false;
        });
        return;
      }
      // 家的落点已经翻到吸顶栏下面、鸟还在家：读者看不见它，当作已经离开画
      if (w === 'home') fromPainting = true;
      // 2) 节制：离开画后的第一次只等停顿；之后在页面上挪地方至少隔一会儿；鸟就在眼前合适的位置就不挪
      var gap = (phone() ? P.phoneGap : P.gap) * 1000;
      if (!fromPainting && now - lastVisit < gap) { why = 'gap'; later(gap - (now - lastVisit)); return; }
      if (w === 'page' && visible && i.y > hdr + 0.5 * b && i.y < hdr + P.stayBottom * use) { why = 'stay'; return; }

      // 3) 挑眼前最合适的落点：读者视线附近、刚出现在上三分之一；放不下这么大的鸟、在吸顶栏下面的都不要
      var line = hdr + P.readLine * use, best = null, bestScore = Infinity;
      scan = { parts: 0, perches: 0, tooBig: 0, outOfBand: 0, same: 0, band: [Math.round(hdr + b + 8), Math.round(hdr + P.bandBottom * use)] };
      for (var n = 0; n < parts.length; n++) {
        var pr = parts[n], r = pr.el.getBoundingClientRect();
        if (!r.height || r.bottom < hdr || r.top > vh) continue;
        var rel = b / r.width, ps = pr.d.perches;
        scan.parts++;
        for (var j = 0; j < ps.length; j++) {
          var q = ps[j];
          scan.perches++;
          if (rel > q[4]) { scan.tooBig++; continue; }
          var y = r.top + q[2] * r.height, x = r.left + q[1] * r.width;
          if (y < hdr + b + 8 || y > hdr + P.bandBottom * use) { scan.outOfBand++; continue; }
          if (current && current.el === pr.el && current.q === q) { scan.same++; continue; }
          var s = Math.abs(y - line) / use - (q[0] === 'title' ? P.titleBonus : 0);
          if (s < bestScore) { bestScore = s; best = { el: pr.el, q: q, x: x, y: y, s: pr.d.s, docY: y + (G.scrollY || 0) }; }
        }
      }
      if (!best) { why = 'no-target'; return; }                             // 找不到合适的就不飞

      // 4) 不在眼前、或远了：不长途飞，从吸顶栏下面（或屏幕下沿）飞进来
      var from = null;
      if (!visible || Math.abs(best.y - i.y) > far) from = w !== 'page' || i.y < best.y ? 'top' : 'bottom';
      inflight = true; why = from ? 'fly-enter-' + from : 'fly';
      var target = best;
      bird.visit({ x: target.x, y: target.y, facing: target.q[3], from: from, edge: edge, pace: pace }).then(function (ok) {
        inflight = false;
        if (ok) { flights++; lastVisit = performance.now(); fromPainting = false; current = target; } else current = null;
      });
    }

    function destroy() {
      if (dead) return; dead = true;
      clearTimeout(timer); clearTimeout(resizeTimer);
      G.removeEventListener('scroll', onScroll, true);
      G.removeEventListener('resize', onResize);
    }

    resolve();
    if (!parts.length) return null;
    G.addEventListener('scroll', onScroll, { capture: true, passive: true });
    G.addEventListener('resize', onResize, { passive: true });
    bird.onDestroy(destroy);
    return {
      destroy: destroy,
      state: function () {
        var bi = bird.info(), st = bird.state();
        return { why: why, scan: scan, decisions: decisions, birdFrames: bi && bi.frames, birdResting: bi && bi.resting, birdMode: bi && bi.mode,
          where: st && where(st), birdH: bi && Math.round(bi.hNow * 10) / 10,
          flights: flights, homes: homes, departs: departs, leaves: leaves, inflight: inflight, parts: parts.length,
          current: current ? { screen: current.s, perch: current.q } : null, params: P, phone: phone() };
      },
    };
  }

  G.LivingBird.guide = guide;
})(window);
