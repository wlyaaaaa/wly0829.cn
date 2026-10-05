/* LivingBird：wly0829.cn 全站共用的那只小鸟（沿用原绣眼鸟图集，暖金羽色由鸟层滤色）。不依赖任何库。
 * 用法：var b = LivingBird.mount(容器, { sprites, perches, size, night, speed, reducedMotion, from, auto });
 * 方法：b.arrive() / b.leave() 返回 Promise；b.setNight(布尔)；b.seek(秒)；b.destroy()。
 * 带路（第二步）：b.visit(落点) / b.home() 返回 Promise；b.info() 读当前位置；b.onDestroy(fn)。
 *   鸟离开画时搬到页面上一层（.lb-page，随页面滚动），坐标用页面像素；回到画里再搬回画框，坐标恢复成画框占比。
 * 文中的秒都是真实时间。全站速度数 speed 只记下来备用，不拿它去加快鸟（本人说过另外两个小样“太快了”）。
 */
(function (G) {
  'use strict';
  var A = __ATLAS__;                      // 构建时填入：图集里每个姿势的位置和对齐点
  var FLAP = 0.28;                        // 拍一个来回的真实秒数
  var SEQ = ['fly1', 'fly2', 'fly3', 'fly2'];
  var SEED = 20261003;
  var LEAVE = -1, PAGE = -2, HOME = -3;   // 一条飞行落在哪：画里第几个落点（≥0）/ 飞走 / 页面落点 / 回画里的家
  var audio = null, styled = false;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function bez(a, b, c, d, u) { var v = 1 - u; return v * v * v * a + 3 * v * v * u * b + 3 * v * u * u * c + u * u * u * d; }
  function dbez(a, b, c, d, u) { var v = 1 - u; return 3 * v * v * (b - a) + 6 * v * u * (c - b) + 3 * u * u * (d - c); }
  function eOut(u) { return 1 - (1 - u) * (1 - u); }
  function rng(s) { return function () { s = (s + 0x6D2B79F5) | 0; var t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  // 叫声：照搬首页的 chirp()
  function chirp(pitch, count) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === 'suspended') audio.resume();
      var t0 = audio.currentTime + 0.02;
      for (var i = 0; i < count; i++) {
        var o = audio.createOscillator(), g = audio.createGain(), st = t0 + i * 0.16, f0 = (3000 + Math.random() * 500) * pitch;
        o.type = 'sine'; o.frequency.setValueAtTime(f0, st);
        o.frequency.exponentialRampToValueAtTime(f0 * 1.45, st + 0.035); o.frequency.exponentialRampToValueAtTime(f0 * 0.80, st + 0.090);
        g.gain.setValueAtTime(0.0001, st); g.gain.exponentialRampToValueAtTime(0.15, st + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, st + 0.100);
        o.connect(g).connect(audio.destination); o.start(st); o.stop(st + 0.12);
      }
    } catch (e) { /* 没声音不影响画面 */ }
  }

  function addStyle() {
    if (styled) return; styled = true;
    var s = document.createElement('style');
    s.textContent = '.lb-stage{position:absolute;left:0;top:0;right:0;bottom:0;overflow:hidden;pointer-events:none}'
      + '.lb{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform;visibility:hidden}'
      + '.lb-f{position:absolute;overflow:hidden;filter:hue-rotate(-28deg) saturate(1.38) brightness(1.07) drop-shadow(.45px 0 0 rgba(255,247,220,.62)) drop-shadow(-.45px 0 0 rgba(255,247,220,.62)) drop-shadow(0 .45px 0 rgba(255,247,220,.62)) drop-shadow(0 -.45px 0 rgba(255,247,220,.62)) drop-shadow(0 1.2px 1.8px rgba(55,35,10,.24))}'
      + '.lb-night .lb-f{filter:hue-rotate(-28deg) saturate(1.12) brightness(.73) drop-shadow(.45px 0 0 rgba(255,247,220,.62)) drop-shadow(-.45px 0 0 rgba(255,247,220,.62)) drop-shadow(0 .45px 0 rgba(255,247,220,.62)) drop-shadow(0 -.45px 0 rgba(255,247,220,.62)) drop-shadow(0 1.2px 1.8px rgba(20,15,8,.26))}'
      + '.lb-i{position:absolute;max-width:none;max-height:none;margin:0;padding:0;border:0;user-select:none;-webkit-user-drag:none}'
      + '.lb-note{position:absolute;color:#657e36;font:600 11px/1 sans-serif;pointer-events:none;display:none;text-shadow:0 1px 1px rgba(255,255,255,.8)}'
      + '.lb-hit{position:absolute;left:0;top:0;pointer-events:auto;cursor:pointer;display:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;border-radius:50%}'
      // 页面层：贴在文档左上角、随页面滚动；只横向裁掉，免得鸟从屏边飞进来时撑出横向滚动条。层级低于网站吸顶栏和回到顶部按钮。
      + '.lb-page{position:absolute;left:0;top:0;width:100%;height:0;overflow:visible;overflow-x:clip;pointer-events:none;z-index:20}'
      + '.lb-anchor{position:absolute;left:0;top:0;width:1px;height:1px;visibility:hidden;pointer-events:none}'
      // 页面上站着时脚下很淡的接触阴影：只改透明度；夜里、画里、飞的时候都是 0
      + '.lb-shade{position:absolute;left:0;top:0;border-radius:50%;pointer-events:none;opacity:0;transition:opacity .35s ease;background:radial-gradient(closest-side,rgba(38,52,28,.55),rgba(38,52,28,0))}';
    document.head.appendChild(s);
  }

  function mount(el, o) {
    o = o || {};
    addStyle();
    var perches = (o.perches && o.perches.length ? o.perches : [{ x: 0.5, y: 0.8 }]).map(function (p) {
      return { x: +p.x || 0, y: +p.y || 0, f: p.facing === 'left' ? -1 : 1, span: Math.max(0, +p.span || 0) };
    });
    var size = o.size > 0 ? +o.size : 0.12, minimumSize = o.minSize > 0 ? +o.minSize : 24;
    var reduced = !!o.reducedMotion, auto = o.auto !== false;
    var from = o.from === 'left' || o.from === 'top' ? o.from : 'right';
    var base = o.sprites ? String(o.sprites).replace(/\/*$/, '/') : '';
    var speed = o.speed > 0 ? +o.speed : 2.5;   // 只备用：和别的动效对齐时可以读，鸟的节奏不跟它走

    // ---------- 画面元素 ----------
    var stage = document.createElement('div'), bird = document.createElement('div'), frame = document.createElement('div'),
      img = document.createElement('img'), hit = document.createElement('div'), note = document.createElement('span');
    stage.className = 'lb-stage'; bird.className = 'lb'; frame.className = 'lb-f'; img.className = 'lb-i'; hit.className = 'lb-hit';
    stage.setAttribute('aria-hidden', 'true');
    img.alt = ''; img.draggable = false; img.decoding = 'async'; img.crossOrigin = 'anonymous';
    note.className = 'lb-note'; note.textContent = '♪';
    frame.appendChild(img); bird.appendChild(frame); stage.appendChild(bird); stage.appendChild(hit); stage.appendChild(note); el.appendChild(stage);

    var W = 0, H = 0, loaded = false, failed = false, dead = false, manual = false, inView = true, raf = 0, last = 0;
    var shown = '', shownK = 0, lastTr = '', lastHit = '', log = [], li = 0, arriveP = [], leaveP = [], visitP = [], homeP = [];
    var paper = [0, 0, 0, 0], paperClip = 'inset(0px)', lastClip = null;
    var S;
    // 带路：art = 在画框里（坐标是画框宽高的占比）；page = 在页面层（坐标是页面像素）。F 是当前坐标系的换算比例。
    var mode = 'art', F = { w: 0, h: 0 }, layer = null, anchor = null, pio = null, pageInView = false, pagePerch = null;
    var idleTimer = 0, idleUntil = 0, deathHooks = [], frames = 0;
    // 页面上的站高：不小于 pageMin（由带路设定，电脑 32、手机 28 像素）；进出页面的飞行途中由 S.gs（0 画里大小 → 1 页面大小）平滑过渡
    var pageMin = 0, shade = null, lastShade = '';

    function measure() {
      W = stage.clientWidth; H = stage.clientHeight; shownK = 0;
      if (mode === 'art') { F.w = W; F.h = H; }
      // 停栖只借同页已有纸面，逻辑框不变；不越过页面或视口的左右边界。
      var part = el.closest('.typeset-part'), r = stage.getBoundingClientRect(), q = part ? part.getBoundingClientRect() : r,
        m = 0.75 * bh(), vw = document.documentElement.clientWidth || G.innerWidth;
      paper = [Math.min(m, Math.max(0, r.top - Math.max(0, q.top))),
        Math.min(m, Math.max(0, Math.min(vw, q.right) - r.right)),
        Math.min(m, Math.max(0, q.bottom - r.bottom)),
        Math.min(m, Math.max(0, r.left - Math.max(0, q.left)))];
      paperClip = 'inset(' + paper.map(function (v) { return -v.toFixed(2) + 'px'; }).join(' ') + ')';
      if (S && S.pend && W && H) { S.pend = false; doArrive(); sync(); }
      if (mode === 'page') placeAnchor();
      render();
    }

    // ---------- 状态 ----------
    function reset(n) {
      if (mode === 'page') toArtFrame();
      S = { t: 0, vis: false, x: 0, y: 0, pi: 0, flip: 1, pose: 'idle', sx: 1, sy: 1, rot: 0, lift: 0, act: null,
            night: false, nextSmall: 0, nextMove: 0, turnAt: 0, gazeAt: -9, pend: false, peek: false, gs: 0, rnd: rng(SEED) };
      setN(n);
      if (auto) doArrive();
    }
    function R(a, b) { return a + (b - a) * S.rnd(); }
    function bh() { return Math.min(Math.max(size * H, minimumSize), A.standH / (2 * (G.devicePixelRatio || 1) * 1.06)); }
    function pageH() { return Math.max(bh(), pageMin || 0); }
    function hNow() { return bh() + (pageH() - bh()) * (S ? S.gs : 0); }  // 此刻显示的站高
    function hBase() { return mode === 'page' ? pageH() : bh(); }          // 图片按这个大小排版；飞行中的大小变化只用 transform 缩放
    function perch() { return mode === 'page' && pagePerch ? pagePerch : perches[S.pi]; }
    function place(i) { var p = perches[i]; S.pi = i; S.x = p.x; S.y = p.y; S.flip = p.f; }
    function flying() { var a = S.act; return !!a && (a.k === 'fly' || a.k === 'up'); }
    function settle(list) { var l = list.splice(0, list.length); for (var i = 0; i < l.length; i++) l[i](); }

    // 一条飞行：p0..p3 是脚的位置（当前坐标系的像素），换算成占比存下来，容器变大小时形状跟着变（页面层占比就是像素）
    function flight(p, dur, ease, land, up, glide, g1) {
      var path = p.map(function (q) { return [q[0] / F.w, q[1] / F.h]; });
      var f = { k: 'fly', t: 0, dur: dur, path: path, ease: ease, land: land, glide: !!glide, g0: S.gs, g1: g1 == null ? S.gs : g1 };
      S.vis = true;
      S.act = up ? { k: 'up', t: 0, dur: 0.09, next: f } : f;
    }
    function len(p) { var s = 0; for (var i = 1; i < 4; i++) s += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return s; }

    function doArrive(fo) {
      var fr = fo === 'top' || fo === 'left' || fo === 'right' ? fo : from;   // 带路回画时指定从画的上沿进来
      if (mode === 'page') {                                                 // 在页面上：飞回画里就是“回来”
        if (S.vis && !(S.act && S.act.k === 'fly' && S.act.land === LEAVE)) { doHome(null); return; }
        toArtFrame(); S.vis = false; S.act = null;
      }
      if (reduced) { place(0); S.vis = true; S.act = null; S.pose = S.night ? 'sleep' : 'idle'; S.sx = S.sy = 1; S.rot = 0; settle(leaveP); settle(arriveP); return; }
      if (!W || !H) { S.pend = true; return; }                              // 还没量到尺寸：量到再飞
      var P = perches[0], b = bh(), p3 = [P.x * W, P.y * H], dir, p0, p1;
      if (S.vis && S.act && S.act.k === 'fly' && S.act.land === LEAVE) {   // 正在飞走：掉头飞回来
        var c = [S.x * W, S.y * H]; dir = p3[0] >= c[0] ? 1 : -1;
        flight([c, [c[0] + dir * b, c[1] - 0.6 * b], [p3[0] - dir * 1.1 * b, p3[1] - 2.2 * b], p3], 1.0, 'land', 0);
        settle(leaveP); return;
      }
      if (S.vis) return;                                                    // 已经在画里
      var hi = Math.min(p3[1], 1.1 * b);                                  // 脚不高过这里，整只鸟就还在画里（落脚点靠上时改成平着飞进来）
      if (fr === 'top') {
        dir = P.f; p0 = [p3[0] - dir * Math.min(0.3 * W, 6 * b), -1.7 * b]; p1 = [p0[0] + dir * 0.4 * Math.abs(p3[0] - p0[0]), Math.max(p0[1] + 0.32 * H, hi)];
      } else {
        dir = fr === 'left' ? 1 : -1;
        var sy = clamp(p3[1] - Math.max(0.3 * H, 2.6 * b), hi, p3[1]);
        p0 = [dir > 0 ? -1.5 * b : W + 1.5 * b, sy]; p1 = [p0[0] + (p3[0] - p0[0]) * 0.45, Math.max(sy - 0.07 * H, hi)];
      }
      var p = [p0, p1, [p3[0] - dir * 1.1 * b, Math.max(p3[1] - 2.2 * b, hi)], p3];
      S.x = p0[0] / W; S.y = p0[1] / H; S.flip = dir;
      flight(p, 1.0 + 0.3 * clamp(len(p) / (0.9 * W), 0, 1), 'land', 0);
    }

    function doLeave(v) {
      if (!S.vis) { settle(arriveP); settle(leaveP); return; }
      if (reduced) { S.vis = false; S.act = null; settle(arriveP); settle(leaveP); return; }
      var a = S.act;
      if (a && a.k === 'fly' && a.land === LEAVE) return;                   // 已经在飞走
      var b = mode === 'page' ? hNow() : bh(), c = [S.x * F.w, S.y * F.h], up = !flying();
      if (mode === 'page') {                                                // 在页面上：从眼前往上飞走，边飞边缩回画里的大小
        var dp = S.flip; settle(visitP); settle(homeP);
        if (v && v.topY != null && (v.instant || !pageInView) && !flying()) {             // 落点已经不在眼前：不用演，直接收起
          S.vis = false; S.act = null; toArtFrame(); settle(arriveP); settle(leaveP); return;
        }
        // 飞走这一段改按视口算（页面层临时固定在屏幕上）：读者还在往回翻，鸟也照样从屏幕上方出去，不被页面带着往下走
        var Lr = layer.getBoundingClientRect(); layer.style.position = 'fixed'; S.x += Lr.left; S.y += Lr.top; c = [S.x, S.y];
        var ty = v && v.topY != null ? Math.min(v.topY + Lr.top, c[1] - 3 * b) : c[1] - 7 * b, tx = c[0] + dp * Math.min(4.5 * b, 0.4 * Math.abs(c[1] - ty) + 2 * b);
        var lp = [c, [c[0] + dp * 0.6 * b, c[1] - 1.3 * b], [tx - dp * 1.2 * b, ty + 1.6 * b], [tx, ty]];
        flight(lp, clamp(0.45 + len(lp) / ((v && v.pace) || 700), 0.75, 1.6), up ? 'out' : 'cruise', LEAVE, up, true, 0);
        settle(arriveP); return;
      }
      var dl = c[0], dr = W - c[0], dt = c[1] + b, dir, p1, p2, p3;
      if ((v && v.top) || (dt < dl && dt < dr)) {                          // 带路起飞：一定从画的上沿出去
        dir = S.flip; p3 = [c[0] + dir * Math.min(0.25 * W, 5 * b), -1.7 * b];
        p1 = [c[0] + dir * 0.5 * b, c[1] - 1.8 * b]; p2 = [p3[0] - dir * 0.4 * b, p3[1] + 0.25 * H];
      } else {
        dir = dl < dr ? -1 : 1;
        var hi = Math.min(c[1], 1.1 * b);
        p3 = [dir < 0 ? -1.5 * b : W + 1.5 * b, Math.max(c[1] - Math.max(0.28 * H, 2.4 * b), Math.min(c[1], 0.5 * b))];
        p1 = [c[0] + dir * 0.9 * b, Math.max(c[1] - 1.6 * b, hi)]; p2 = [c[0] + (p3[0] - c[0]) * 0.6, p3[1] + 0.05 * H];
      }
      var p = [c, p1, p2, p3];
      flight(p, 0.78 + 0.16 * clamp(len(p) / W, 0, 1), up ? 'out' : 'cruise', LEAVE, up);
      settle(arriveP);
    }

    // ---------- 带路：画框 ⇄ 页面层 ----------
    function ensureLayer() {
      if (layer) return layer;
      layer = document.createElement('div'); layer.className = 'lb-page'; layer.setAttribute('aria-hidden', 'true');
      anchor = document.createElement('div'); anchor.className = 'lb-anchor'; layer.appendChild(anchor);
      shade = document.createElement('div'); shade.className = 'lb-shade'; layer.appendChild(shade);
      document.body.appendChild(layer);
      if (G.IntersectionObserver) {
        pio = new IntersectionObserver(function (en) { pageInView = en[en.length - 1].isIntersecting; sync(); }, { rootMargin: '64px 0px' });
        pio.observe(anchor);
      } else pageInView = true;
      return layer;
    }
    function rehome(parent) {                                              // 鸟、热区、音符一起搬家；缓存的样式全部作废重写
      parent.appendChild(bird); parent.appendChild(hit); parent.appendChild(note);
      lastTr = ''; lastHit = ''; lastClip = null; shownK = 0;
    }
    function toPageFrame() {                                               // 画框占比 → 页面像素（两次读位置，之后才写）
      var L = ensureLayer().getBoundingClientRect(), r = stage.getBoundingClientRect();
      S.x = r.left - L.left + S.x * W; S.y = r.top - L.top + S.y * H;
      mode = 'page'; F.w = 1; F.h = 1;
      stage.style.clipPath = ''; stage.style.overflow = 'hidden'; stage.classList.remove('lb-perched');
      rehome(layer);
    }
    function toArtFrame() { mode = 'art'; F.w = W; F.h = H; pagePerch = null; if (S) S.gs = 0; if (layer) layer.style.position = ''; clearIdle(); rehome(stage); }
    function homePoint() {                                                 // 画里的家（第一个落点）在页面层里的像素位置
      var L = ensureLayer().getBoundingClientRect(), r = stage.getBoundingClientRect(), P = perches[0];
      return [r.left - L.left + P.x * W, r.top - L.top + P.y * H];
    }
    function placeAnchor() {                                               // 页面落点上放一个看不见的小块，给“看得见吗”用
      if (!anchor || !pagePerch) return;
      var b = pageH();
      anchor.style.transform = 'translate(' + (pagePerch.x - 0.7 * b).toFixed(1) + 'px,' + (pagePerch.y - b).toFixed(1) + 'px)';
      anchor.style.width = (1.4 * b).toFixed(1) + 'px'; anchor.style.height = b.toFixed(1) + 'px';
    }
    // 一条平缓的弧线：先离开、再从落点斜上方落下；几乎垂直时往侧面鼓出去，免得像电梯。
    function arc(p0, p3, b, side) {
      var dx = p3[0] - p0[0], dy = p3[1] - p0[1], d = Math.hypot(dx, dy), lift = clamp(0.16 * d, 0.8 * b, 2.6 * b);
      var s = Math.abs(dx) > 2 * b ? (dx > 0 ? 1 : -1) : (side || 1), bow = Math.abs(dx) > 2 * b ? 0 : 1.4 * b;
      var p1 = [p0[0] + 0.28 * dx + s * bow, p0[1] + 0.45 * dy - lift];
      var p2 = [p3[0] - 0.22 * dx - s * (0.9 * b - bow * 0.4), p3[1] - 1.5 * b - 0.15 * lift];
      return [p0, p1, p2, p3];
    }
    function busy() { var a = S.act; return !!a && a.k !== 'pose'; }
    // v：{ x, y（脚在页面层的像素）, f（朝向 ±1）, from（null｜[x,y] 从屏边飞进来的起点）, pace（像素/秒）, instant }
    function doVisit(v) {
      if (reduced || failed || S.night || !W || !H || (!S.vis && !v.from)) { settle(visitP); return; }
      if (S.vis && busy() && !(v.instant && !flying())) { settle(visitP); return; }
      if (mode === 'art') toPageFrame();
      var b = pageH();
      pagePerch = { x: v.x, y: v.y, f: v.f > 0 ? 1 : -1, span: 0 };
      placeAnchor(); clearIdle();
      if (v.instant) { S.x = v.x; S.y = v.y; S.flip = pagePerch.f; S.act = null; S.rot = 0; S.sx = S.sy = 1; S.gs = 1; S.vis = true; settle(visitP); return; }
      var start = v.from ? v.from : [S.x, S.y];
      if (v.from) { S.x = start[0]; S.y = start[1]; S.gs = 0; S.act = null; }  // 从屏边进来：先是画里的大小，越飞越近、越大
      var p = arc(start, [v.x, v.y], b, v.f > 0 ? -1 : 1), L = len(p);
      flight(p, clamp(0.55 + L / (v.pace || 700), 0.9, 2.3), 'smooth', PAGE, !v.from && S.vis, true, 1);
      if (v.from) S.flip = v.x >= start[0] ? 1 : -1;
    }
    function doHome(v) {
      if (mode !== 'page') { settle(homeP); return; }
      if (!S.vis) { toArtFrame(); settle(homeP); return; }
      if (flying() && S.act.land === HOME) return;
      var b = bh(), p3 = homePoint(), start = v && v.from ? v.from : [S.x, S.y];
      if (v && v.from) { S.x = start[0]; S.y = start[1]; }
      var p = arc(start, p3, b, -perches[0].f), L = len(p);
      flight(p, clamp(0.6 + L / ((v && v.pace) || 700), 1.0, 2.4), 'smooth', HOME, !(v && v.from) && !flying(), true, 0);
      clearIdle();
    }

    function hopTo(x1, lift) {
      S.flip = x1 >= S.x ? 1 : -1;
      S.act = { k: 'hop', t: 0, dur: lift ? 0.4 : 0.5, x0: S.x, x1: x1, lift: lift || 0.2 };
    }
    function flyTo(j) {
      var q = perches[j], b = bh(), c = [S.x * W, S.y * H], x1 = (q.x + (S.rnd() - 0.5) * q.span) * W, p3 = [x1, q.y * H];
      var dx = p3[0] - c[0], lo = Math.min(c[1], p3[1]), top = Math.max(lo - Math.max(1.6 * b, 0.25 * Math.abs(dx)), Math.min(lo, 1.1 * b));
      var p = [c, [c[0] + dx * 0.2, top], [p3[0] - dx * 0.2, top - 0.2 * b], p3];
      flight(p, 0.62 + 0.36 * clamp(len(p) / W, 0, 1), 'smooth', j, true);
    }

    function smallAct(name) {
      var d = name === 'preen' ? R(1.0, 1.3) : name === 'tilt' && S.peek ? R(1.3, 1.6) : R(0.9, 1.2);
      S.act = { k: 'pose', t: 0, dur: d, pose: name }; S.peek = false;
    }
    function hopTarget() {
      var p = perch(), bw = 1.25 * bh() / F.w, lo = p.x - p.span / 2, hi = p.x + p.span / 2;
      if (hi - lo < 0.4 * bw) return null;
      var d = R(0.5, 1.2) * bw, x1 = S.x + (S.rnd() < 0.5 ? -d : d);
      if (x1 < lo || x1 > hi) x1 = S.x - (x1 - S.x);
      x1 = clamp(x1, lo, hi);
      return Math.abs(x1 - S.x) < 0.3 * bw ? null : x1;
    }
    function move() {
      var x1 = hopTarget(), can = perches.length > 1;
      if (x1 != null && (!can || S.rnd() < 0.6)) hopTo(x1);
      else if (can) { var j = Math.floor(S.rnd() * (perches.length - 1)); flyTo(j >= S.pi ? j + 1 : j); }
      else hopTo(S.x);                                                     // 窄落脚面只原地轻跳，脚仍回到承托面
    }
    /*TEST*/function force(n) {                                                     // 只给逐格录像用（构建成品时去掉）
      if (!S.vis || S.act || S.night) return;
      if (n === 'hop') { var x1 = hopTarget(); if (x1 != null) hopTo(x1); }
      else if (n === 'fly') { if (perches.length > 1) flyTo((S.pi + 1) % perches.length); }
      else smallAct(n);
      S.nextSmall = S.t + R(5, 11); S.nextMove = Math.max(S.nextMove, S.t + R(12, 20));
    }/*END*/
    function tap(sound) {
      if (failed) return;
      if (reduced) { if (sound) chirp(S.night ? 0.72 : 1, S.night ? 1 : 3); return; }
      var a = S.act;
      if (!S.vis || (a && (a.k === 'fly' || a.k === 'up' || a.k === 'land' || (a.k === 'hop' && a.t > 0.08)))) return;
      if (S.night) { S.act = { k: 'wake', t: 0, dur: 1.4 }; if (sound) chirp(0.72, 1); return; }
      S.act = { k: 'sing', t: 0, dur: 0.95 }; S.sx = S.sy = 1; S.rot = 0;
      if (sound) chirp(1, 3);
      S.nextSmall = Math.max(S.nextSmall, S.t + R(4, 7));
    }
    function setN(v) {
      S.night = !!v; stage.classList.toggle('lb-night', S.night);
      if (reduced) S.pose = S.night ? 'sleep' : 'idle';
      if (!S.night) S.nextSmall = S.t + R(1.5, 3);
      else if (mode === 'page' && S.vis && !flying()) doHome(null);         // 夜里不在页面上睡：先飞回画里
    }
    function gaze(side) {
      if (reduced || S.night || !S.vis || S.act || S.t - S.gazeAt < 1.8) return;
      S.gazeAt = S.t; S.flip = side; S.turnAt = S.t + 1.8; smallAct('look');
      S.nextSmall = Math.max(S.nextSmall, S.t + 3);
    }

    // ---------- 往前走一小步（dt 是真实秒） ----------
    function step(dt) {
      S.t += dt;
      var a = S.act;
      S.lift = 0;
      if (a) { a.t += dt; run(a); return; }
      if (!S.vis) return;
      S.rot = 0;
      if (S.turnAt && S.t >= S.turnAt) { S.flip = perch().f; S.turnAt = 0; }   // 落下或跳完，转回落脚点规定的朝向
      if (S.night) {                                                        // 睡觉：很慢的呼吸
        var w = Math.sin(S.t * 2 * Math.PI / 3.4);
        S.pose = 'sleep'; S.sy = 1 + 0.022 * w; S.sx = 1 - 0.008 * w; return;
      }
      S.pose = 'idle'; S.sx = 1;
      if (mode === 'page') {                                                // 页面上：不呼吸（静止时不跑循环），只偶尔看看字、歪头、理毛
        S.sy = 1;
        if (S.t >= S.nextSmall) { smallAct(S.peek ? 'tilt' : ['look', 'tilt', 'tilt', 'preen'][Math.floor(S.rnd() * 4)]); S.nextSmall = S.t + R(6, 12); }
        return;
      }
      S.sy = 1 + 0.007 * Math.sin(S.t * 2 * Math.PI / 2.6);
      if (S.t >= S.nextMove) { S.nextMove = S.t + R(24, 38); S.nextSmall = Math.max(S.nextSmall, S.t + 2.5); move(); }
      else if (S.t >= S.nextSmall) { smallAct(['look', 'tilt', 'preen'][Math.floor(S.rnd() * 3)]); S.nextSmall = S.t + R(5, 11); }
    }

    function landed(a) {                                                    // 一条飞行到了终点
      var b;
      if (a.land >= 0) { var q = perches[a.land]; S.pi = a.land; S.y = q.y; S.act = { k: 'land', t: 0, dur: 0.32 }; return; }
      if (a.land === PAGE) { S.x = pagePerch.x; S.y = pagePerch.y; S.act = { k: 'land', t: 0, dur: 0.32, settle: true }; return; }
      if (a.land === HOME) {
        b = perches[0]; toArtFrame(); S.pi = 0; S.x = b.x; S.y = b.y;
        S.act = { k: 'land', t: 0, dur: 0.32, settle: true }; return;
      }
      S.vis = false; S.act = null; settle(leaveP);
      if (mode === 'page') { toArtFrame(); settle(visitP); settle(homeP); }
    }

    function run(a) {
      var u = Math.min(1, a.t / a.dur), k, b;
      if (a.k === 'up') {                                                   // 起飞前蹲一下
        S.pose = 'crouch'; k = u; S.sy = 1 - 0.06 * k; S.sx = 1 + 0.03 * k; S.rot = 0;
        if (u >= 1) { S.act = a.next; S.sx = S.sy = 1; }
      } else if (a.k === 'fly') {
        var e, de, P = a.path, landing = a.land !== LEAVE;
        if (a.ease === 'land') { e = 1 - Math.pow(1 - u, 1.7); de = 1.7 * Math.pow(1 - u, 0.7); }
        else if (a.ease === 'out') { e = 0.25 * u + 0.75 * u * u; de = 0.25 + 1.5 * u; }
        else if (a.ease === 'cruise') { e = u; de = 1; }
        else { e = u * u * (3 - 2 * u); de = 6 * u * (1 - u) + 0.05; }
        S.x = bez(P[0][0], P[1][0], P[2][0], P[3][0], e); S.y = bez(P[0][1], P[1][1], P[2][1], P[3][1], e);
        if (a.g1 !== a.g0) S.gs = u >= 1 ? a.g1 : a.g0 + (a.g1 - a.g0) * (e * e * (3 - 2 * e));
        var vx = dbez(P[0][0], P[1][0], P[2][0], P[3][0], e) * de * F.w, vy = dbez(P[0][1], P[1][1], P[2][1], P[3][1], e) * de * F.h;
        if (Math.abs(vx) > 0.25 * Math.hypot(vx, vy)) S.flip = vx > 0 ? 1 : -1;
        var rem = (1 - u) * a.dur;
        S.rot = clamp(Math.atan2(vy, Math.abs(vx) + 1e-6) * 0.22, -0.28, 0.28) * S.flip * (landing ? clamp(rem / 0.3, 0, 1) : 1);
        // 长途：往下时多半展翅滑翔、隔一会儿扇两下；往上和平飞一直扇
        var flap = SEQ[Math.floor(a.t / (FLAP / 4)) % 4];
        if (a.glide && vy > 0.3 * Math.hypot(vx, vy) && a.t > 0.3 && rem > 0.45 && (a.t % 0.95) > 0.56) flap = 'fly2';
        S.pose = landing && rem < 0.22 ? 'fly4' : landing && rem < 0.32 ? 'fly2' : flap;
        S.sx = S.sy = 1;
        if (u >= 1) { S.rot = 0; landed(a); }
      } else if (a.k === 'land') {                                          // 落下：很轻地蹲一下再站直
        S.pose = 'idle'; S.rot = 0;
        k = u < 0.3 ? u / 0.3 : 1 - eOut((u - 0.3) / 0.7);
        S.sy = 1 - 0.09 * k; S.sx = 1 + 0.045 * k;
        if (u >= 1) {
          S.act = null; S.sx = S.sy = 1;
          if (a.settle) {                                                   // 带路落地：再原地轻轻一跳站稳，随后低头看一眼脚下的字
            hopTo(S.x + S.flip * 0.05 * hNow() / F.w, 0.1);
            S.peek = mode === 'page'; S.nextSmall = S.t + 0.4 + R(0.3, 0.6); S.nextMove = S.t + R(22, 34);
            if (mode === 'page') settle(visitP); else { settle(homeP); settle(arriveP); }
            if (mode === 'page' && S.night) doHome(null);
            return;
          }
          if (S.flip !== perch().f) S.turnAt = S.t + 0.45;
          S.nextSmall = S.t + R(2.5, 4.5); S.nextMove = S.t + R(22, 34);
          settle(arriveP);
        }
      } else if (a.k === 'hop') {                                           // 在 span 里跳一小步
        var c = 0.1 / a.dur, l = 1 - 0.12 / a.dur;
        if (u < c) { k = u / c; S.pose = 'crouch'; S.sy = 1 - 0.06 * k; S.sx = 1 + 0.03 * k; }
        else if (u < l) {
          k = (u - c) / (l - c); S.pose = k > 0.28 && k < 0.72 ? 'hop2' : 'hop';
          S.x = a.x0 + (a.x1 - a.x0) * k; S.lift = (a.lift || 0.2) * 4 * k * (1 - k); S.sy = 1.03; S.sx = 0.98; S.rot = -(0.5 - k) * 0.3 * S.flip;
        } else { k = (u - l) / (1 - l); S.pose = 'crouch'; S.x = a.x1; S.sy = 0.94 + 0.06 * k; S.sx = 1.03 - 0.03 * k; S.rot = 0; }
        if (u >= 1) { S.act = null; S.sx = S.sy = 1; S.rot = 0; if (S.flip !== perch().f) S.turnAt = S.t + R(0.6, 1.4); }
      } else if (a.k === 'pose') {                                          // 看一眼、歪头、理毛
        S.pose = a.pose; S.rot = a.pose === 'preen' ? 0.03 * Math.sin(a.t * 15) * S.flip : 0; S.sx = S.sy = 1;
        if (u >= 1) { S.act = null; S.rot = 0; }
      } else if (a.k === 'sing') {                                          // 被点：叫三声，同时轻轻跳一下
        S.pose = 'sing'; S.rot = 0;
        k = a.t < 0.48 ? Math.sin(((a.t % 0.16) / 0.16) * Math.PI) : 0;
        S.sy = 1 + 0.05 * k; S.sx = 1 - 0.025 * k;
        b = a.t / 0.36; S.lift = b < 1 ? 0.12 * 4 * b * (1 - b) : 0;
        if (u >= 1) { S.act = null; S.sx = S.sy = 1; }
      } else if (a.k === 'wake') {                                          // 睡着被点醒：抬头叫一声，再睡回去
        S.pose = 'look'; S.rot = 0; S.sx = S.sy = 1;
        b = a.t / 0.26; S.lift = b < 1 ? 0.06 * 4 * b * (1 - b) : 0;
        if (u >= 1) S.act = null;
      }
    }

    // ---------- 画 ----------
    function render() {
      if (dead || !S) return;
      if (!S.vis || !W || !H || failed) {
        if (lastTr !== 'x') { bird.style.visibility = 'hidden'; hit.style.display = 'none'; lastTr = 'x'; lastHit = ''; }
        note.style.display = 'none';
        return;
      }
      if (mode === 'art') {
        var clip = flying() ? '' : paperClip;
        if (clip !== lastClip) {
          stage.classList.toggle('lb-perched', !!clip); stage.style.overflow = clip ? 'visible' : 'hidden';
          stage.style.clipPath = clip; lastClip = clip;
        }
      }
      var p = A.poses[S.pose], h = hNow(), hb = hBase(), k = hb / A.standH, ke = h / A.standH, g = h / hb, lift = S.lift, sy = S.sy;
      // 高沿小动作：只约束画出来的上抬和纵向拉伸，脚锚、姿态与时钟不变。
      if (mode === 'art' && S.act && (S.act.k === 'sing' || S.act.k === 'hop' || S.act.k === 'wake')) {
        var sn = Math.sin(S.rot), cs = Math.cos(S.rot),
          rx = Math.min(-p[4] * k * S.flip * S.sx * sn, (p[2] - p[4]) * k * S.flip * S.sx * sn),
          above = p[5] * k * cs, room = Math.max(0, S.y * H + paper[0] - 0.5 + rx);
        if (above > 0) {
          sy = Math.min(sy, room / above);
          lift = Math.min(lift, Math.max(0, (room - above * sy) / h));
        }
      }
      if (S.pose !== shown || k !== shownK) {
        shown = S.pose; shownK = k;
        var fs = frame.style, is = img.style;
        fs.left = -p[4] * k + 'px'; fs.top = -p[5] * k + 'px'; fs.width = p[2] * k + 'px'; fs.height = p[3] * k + 'px';
        is.left = -p[0] * k + 'px'; is.top = -p[1] * k + 'px'; is.width = A.size[0] * k + 'px'; is.height = A.size[1] * k + 'px';
      }
      var X = S.x * F.w, Y = S.y * F.h - lift * h;
      if (p[6]) { X += A.body[0] * ke * S.flip; Y += A.body[1] * ke; }
      var tr = 'translate(' + X.toFixed(2) + 'px,' + Y.toFixed(2) + 'px) rotate(' + S.rot.toFixed(4) + 'rad) scale(' + (S.flip * S.sx * g).toFixed(4) + ',' + (sy * g).toFixed(4) + ')';
      if (tr !== lastTr) { bird.style.transform = tr; if (lastTr === 'x' || !lastTr) bird.style.visibility = 'visible'; lastTr = tr; }
      var singing = !reduced && S.act && (S.act.k === 'sing' || S.act.k === 'wake');
      note.style.display = singing ? 'block' : 'none';
      if (singing) {
        var nu = Math.min(1, S.act.t / S.act.dur);
        note.style.left = (X + S.flip * .38 * h - 4).toFixed(2) + 'px';
        note.style.top = (Y - .87 * h - 5 * nu).toFixed(2) + 'px';
        note.style.opacity = Math.min(1, nu * 8, (1 - nu) * 5);
      }
      var hs;
      if (flying()) hs = 'none';
      else {                                                                // 点击热区：画里比鸟大一圈、至少 48 像素见方；页面上只贴着鸟身，不越出落点留好的空地
        var I = A.poses.idle, page = mode === 'page',
          hw = page ? Math.max(30, 1.15 * h) : Math.max(48, 1.6 * h), hh = page ? Math.max(30, 1.0 * h) : Math.max(48, 1.5 * h),
          cx = S.x * F.w + (I[2] / 2 - I[4]) * ke * S.flip, cy = S.y * F.h - lift * h - 0.5 * h;
        hs = (cx - hw / 2).toFixed(1) + ',' + (cy - hh / 2).toFixed(1) + ',' + hw.toFixed(1) + ',' + hh.toFixed(1);
      }
      if (shade) {                                                          // 接触阴影：位置只在落点变了时写，显隐只改透明度
        var on = mode === 'page' && !!pagePerch && !flying() && !S.night, sk = on ? pagePerch.x.toFixed(1) + ',' + pagePerch.y.toFixed(1) + ',' + h.toFixed(1) : 'off';
        if (sk !== lastShade) {
          if (on) {
            var sw = 0.62 * h, sh = 0.13 * h; shade.style.width = sw.toFixed(1) + 'px'; shade.style.height = sh.toFixed(1) + 'px';
            shade.style.transform = 'translate(' + (pagePerch.x - sw / 2 + 0.06 * h * pagePerch.f).toFixed(1) + 'px,' + (pagePerch.y - sh * 0.45).toFixed(1) + 'px)';
          }
          shade.style.opacity = on ? '0.34' : '0'; lastShade = sk;
        }
      }
      if (hs !== lastHit) {
        lastHit = hs;
        if (hs === 'none') hit.style.display = 'none';
        else { var v = hs.split(','); hit.style.display = 'block'; hit.style.transform = 'translate(' + v[0] + 'px,' + v[1] + 'px)'; hit.style.width = v[2] + 'px'; hit.style.height = v[3] + 'px'; }
      }
    }

    // ---------- 真实时钟：看得见才走 ----------
    // 画里沿用原来的做法；页面上飞的时候一直走，站着不动时停掉循环，用计时器等下一个小动作。
    function seen() { var a = S && S.act; return (!!a && (a.k === 'fly' || a.k === 'up' || a.k === 'land' || a.k === 'hop')) || (mode === 'art' ? inView : pageInView); }   // 飞行、落地、落地后那一跳一定做完（几百毫秒），哪怕已翻出屏幕；否则等它回到眼前
    function running() { return loaded && !failed && !dead && !manual && !reduced && seen() && !document.hidden; }
    function resting() { return mode === 'page' && S.vis && !S.act && !S.night && !manual && S.pose === 'idle' && S.sy === 1 && S.sx === 1 && !S.lift; }
    // 页面飞行沿用引擎已有的同一份保险；画滚出屏幕后也独立按实际可见的鸟帧检查。
    // 只在真实 RAF 动画时记间隔，静待计时器、隐藏、手动取帧、减少动态均不积累。
    var pageGuard = o.guardFactory && o.guardShared && o.guardStop ? o.guardFactory({
      label: 'LivingBird page', shared: o.guardShared,
      shouldRun: function () {
        if (mode !== 'page' || !running() || !S.vis || idleTimer || resting()) return false;
        var r = frame.getBoundingClientRect(), vw = document.documentElement.clientWidth || G.innerWidth, vh = G.innerHeight;
        return r.width > 0 && r.height > 0 && r.right > 0 && r.left < vw && r.bottom > 0 && r.top < vh;
      },
      exempt: function () { return manual || reduced; }, stop: o.guardStop
    }) : null;
    function resetPageGuard() { if (pageGuard) pageGuard.reset(pageGuard.rules.graceMs); }
    resetPageGuard();
    if (pageGuard && o.onPageGuard) o.onPageGuard(pageGuard);
    function clearIdle() { if (idleTimer) { clearTimeout(idleTimer); idleTimer = 0; } }
    function armIdle() {                                                   // 返回 true：已停下循环、等计时器
      clearIdle();
      step(0);                                                              // 已经到点的转身、小动作先做掉
      if (!resting()) return false;
      var at = S.turnAt ? Math.min(S.nextSmall, S.turnAt) : S.nextSmall;
      idleUntil = at;
      resetPageGuard();
      idleTimer = setTimeout(function () { idleTimer = 0; if (dead || !S) return; S.t = Math.max(S.t, idleUntil); if (o.refreshNight) o.refreshNight(); sync(); }, Math.max(16, (at - S.t) * 1000));
      return true;
    }
    function loop(now) {
      raf = 0; if (!running()) { resetPageGuard(); return; }
      if (pageGuard && pageGuard.check(now)) return;
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now; frames++;
      if (dt > 0) step(dt);
      render();
      if (resting() && armIdle()) return;
      raf = requestAnimationFrame(loop);
    }
    function sync() {
      if (running()) { if (!raf && !(idleTimer && resting())) { clearIdle(); resetPageGuard(); last = 0; raf = requestAnimationFrame(loop); } }
      else { if (raf) { cancelAnimationFrame(raf); raf = 0; } clearIdle(); resetPageGuard(); }
    }
    function onVis() { sync(); }

    // 逐格录像模式里发生的事要记下来，往回 seek 时照样重演
    function apply(e, sound) {
      if (e.k === 'arrive') doArrive(e.v); else if (e.k === 'leave') doLeave(e.v); else if (e.k === 'night') setN(e.v);
      else if (e.k === 'tap') tap(sound); else if (e.k === 'gaze') gaze(e.v);
      else if (e.k === 'visit') doVisit(e.v); else if (e.k === 'home') doHome(e.v);/*TEST*/ else if (e.k === 'force') force(e.v);/*END*/
    }
    function act(k, v) {
      if (dead) return;
      var e = { k: k, v: v, t: S.t };
      if (manual) log.splice(li++, 0, e);                                  // 记在“已经发生过的”最后面
      apply(e, true);
      sync(); render();
    }
    function promise(list, k, v) {
      return new Promise(function (res) {
        if (dead || failed) { res(); return; }
        list.push(res); act(k, v);
        if (k === 'arrive' && S.vis && !flying() && !(S.act && S.act.k === 'land')) settle(arriveP);   // 本来就站在画里
      });
    }

    var io = null, ro = null;
    if (G.IntersectionObserver) { io = new IntersectionObserver(function (en) { inView = en[en.length - 1].isIntersecting; sync(); }); io.observe(stage); }
    if (G.ResizeObserver) { ro = new ResizeObserver(measure); ro.observe(stage); } else G.addEventListener('resize', measure);
    document.addEventListener('visibilitychange', onVis);
    hit.addEventListener('click', function (ev) { ev.stopPropagation(); act('tap'); });
    function onPointer(ev) {
      if (ev.pointerType === 'touch' || reduced || dead || !loaded || !seen() || S.night || S.act || !S.vis) return;
      var r = (mode === 'page' ? layer : stage).getBoundingClientRect(), x = r.left + S.x * F.w, y = r.top + S.y * F.h - .5 * hNow(),
        dx = ev.clientX - x, dy = ev.clientY - y;
      if (Math.hypot(dx, dy) <= Math.max(90, bh() * 3) && Math.abs(dx) > 8) act('gaze', dx < 0 ? -1 : 1);
    }
    document.addEventListener('pointermove', onPointer, { passive: true });

    var night0 = !!o.night;
    W = stage.clientWidth; H = stage.clientHeight; F.w = W; F.h = H; reset(night0);
    function ok() { if (loaded || dead) return; loaded = true; measure(); sync(); }
    img.onload = function () { (img.decode ? img.decode() : Promise.resolve()).then(ok, ok); };
    var url = base + A.image, retried = false;
    if (location.protocol === 'file:' && !/^[a-z]+:/i.test(url)) img.removeAttribute('crossorigin');   // 双击打开的本地页面没有跨域可言
    img.onerror = function () {
      if (!retried && img.hasAttribute('crossorigin')) { retried = true; img.removeAttribute('crossorigin'); img.src = url; return; }  // 图床没给跨域头：退回普通方式读
      failed = true; settle(arriveP); settle(leaveP); settle(visitP); settle(homeP); render();
    };
    img.src = url;

    // 客户区坐标（视口像素）→ 页面层像素；只读位置，不写
    function toLayer(x, y) { var L = ensureLayer().getBoundingClientRect(); return [x - L.left, y - L.top]; }

    var api = {
      arrive: function (t) { return promise(arriveP, 'arrive', t && t.from); },
      leave: function () { return promise(leaveP, 'leave'); },
      setNight: function (v) { if (S.night !== !!v) act('night', !!v); },
      // 带路：t = { x, y（脚的视口坐标）, facing（'left'|'right'|±1）, from（null｜'top'|'bottom'）, edge（屏边：{top, bottom}）, pace, instant }
      visit: function (t) {
        if (dead || failed || reduced) return Promise.resolve(false);
        var p = toLayer(t.x, t.y), v = { x: p[0], y: p[1], f: t.facing === 'left' || t.facing < 0 ? -1 : 1, pace: t.pace, instant: !!t.instant, from: null };
        if (t.from) {                                                       // 远了不长途飞：从眼前屏幕的上沿（吸顶栏下面）或下沿飞进来
          var e = t.edge || {}, b = pageH(), side = t.side || (p[0] > (document.documentElement.clientWidth || G.innerWidth) / 2 ? -1 : 1);
          var sy = t.from === 'top' ? toLayer(0, (e.top || 0) - 0.2 * b)[1] : toLayer(0, (e.bottom || G.innerHeight) + 1.3 * b)[1];
          v.from = [p[0] + side * Math.min(3.2 * b, 0.3 * (document.documentElement.clientWidth || G.innerWidth)), sy];
        }
        return promise(visitP, 'visit', v).then(function () { return mode === 'page'; });
      },
      // 带路的“离开”：画里从画的上沿飞出去；页面上从眼前往上飞到吸顶栏后面（落点已不在眼前就直接收起）。edge.top 是吸顶栏下沿（视口坐标）
      away: function (t) {
        if (dead || failed || reduced) return Promise.resolve();
        var v = { top: true, pace: t && t.pace, instant: !!(t && t.instant) };
        if (mode === 'page') v.topY = toLayer(0, ((t && t.edge && t.edge.top) || 0) - 1.2 * pageH())[1];
        return promise(leaveP, 'leave', v);
      },
      setPageSize: function (px) { pageMin = Math.max(0, +px || 0); shownK = 0; },
      // 不读版面的快速状态（滚动回调里用）
      state: function () { return S && !dead ? { mode: mode, vis: S.vis, busy: busy(), flying: flying(), night: S.night, reduced: reduced, loaded: loaded && !failed } : null; },
      home: function (t) {
        if (dead || failed || mode !== 'page') return Promise.resolve(true);
        var v = { pace: t && t.pace, from: null };
        if (t && t.from) {
          var e = t.edge || {}, b = pageH(), hp = homePoint();
          var sy = t.from === 'top' ? toLayer(0, (e.top || 0) - 0.2 * b)[1] : toLayer(0, (e.bottom || G.innerHeight) + 1.3 * b)[1];
          v.from = [hp[0] - perches[0].f * Math.min(3.2 * b, 0.3 * (document.documentElement.clientWidth || G.innerWidth)), sy];
        }
        return promise(homeP, 'home', v).then(function () { return mode === 'art'; });
      },
      // 现在在哪：都是视口坐标；只读位置
      info: function () {
        if (!S || dead) return null;
        var b = pageH(), r = (mode === 'page' ? ensureLayer() : stage).getBoundingClientRect(), s = stage.getBoundingClientRect(), P = perches[0];
        return { mode: mode, vis: S.vis, busy: busy(), flying: flying(), night: S.night, reduced: reduced, loaded: loaded && !failed, frames: frames, resting: !!idleTimer, ha: bh(), hNow: hNow(),
          x: r.left + S.x * F.w, y: r.top + S.y * F.h, h: b, home: { x: s.left + P.x * W, y: s.top + P.y * H, w: s.width, h: s.height, top: s.top, bottom: s.bottom } };
      },
      onDestroy: function (fn) { deathHooks.push(fn); },
      seek: function (s) {
        if (dead) return 0;
        s = Math.max(0, +s || 0);
        if (!manual) { manual = true; sync(); log = []; li = 0; night0 = S.night; reset(night0); }
        else if (s < S.t - 1e-9) { reset(night0); li = 0; }                // 往回：从头重演，记下的事照样在原来的时刻发生
        while (li < log.length && log[li].t <= S.t + 1e-9) apply(log[li++], false);
        while (S.t < s - 1e-9) {
          var end = li < log.length ? Math.min(s, log[li].t) : s;
          while (S.t < end - 1e-9) step(Math.min(1 / 120, end - S.t));
          while (li < log.length && log[li].t <= S.t + 1e-9) apply(log[li++], false);
        }
        render();
        return S.t;
      },
      destroy: function () {
        if (dead) return;
        dead = true; if (raf) cancelAnimationFrame(raf); raf = 0; clearIdle();
        var hooks = deathHooks.splice(0, deathHooks.length);
        for (var i = 0; i < hooks.length; i++) { try { hooks[i](); } catch (e) { /* 收尾出错不影响拆除 */ } }
        if (io) io.disconnect(); if (ro) ro.disconnect(); else G.removeEventListener('resize', measure);
        if (pio) pio.disconnect();
        document.removeEventListener('visibilitychange', onVis);
        document.removeEventListener('pointermove', onPointer);
        if (stage.parentNode) stage.parentNode.removeChild(stage);
        if (layer && layer.parentNode) layer.parentNode.removeChild(layer);
        settle(arriveP); settle(leaveP); settle(visitP); settle(homeP);
      }
    };
    /*TEST*/Object.defineProperty(api, '_force', { value: function (n) { act('force', n); } });
    Object.defineProperty(api, '_state', { get: function () { return { t: S.t, vis: S.vis, act: S.act && S.act.k, pose: S.pose, x: S.x, y: S.y, pi: S.pi, flip: S.flip, night: S.night, raf: !!raf, mode: mode, idle: !!idleTimer }; } });/*END*/
    return api;
  }

  G.LivingBird = { mount: mount };
})(window);
