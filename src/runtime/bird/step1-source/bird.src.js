/* LivingBird：wly0829.cn 全站共用的那只小鸟（沿用原绣眼鸟图集，暖金羽色由鸟层滤色）。不依赖任何库。
 * 用法：var b = LivingBird.mount(容器, { sprites, perches, size, night, speed, reducedMotion, from, auto });
 * 方法：b.arrive() / b.leave() 返回 Promise；b.setNight(布尔)；b.seek(秒)；b.destroy()。
 * 文中的秒都是真实时间。全站速度数 speed 只记下来备用，不拿它去加快鸟（本人说过另外两个小样“太快了”）。
 */
(function (G) {
  'use strict';
  var A = __ATLAS__;                      // 构建时填入：图集里每个姿势的位置和对齐点
  var FLAP = 0.28;                        // 拍一个来回的真实秒数
  var SEQ = ['fly1', 'fly2', 'fly3', 'fly2'];
  var SEED = 20261003;
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
      + '.lb-hit{position:absolute;left:0;top:0;pointer-events:auto;cursor:pointer;display:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent;border-radius:50%}';
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
    var shown = '', shownK = 0, lastTr = '', lastHit = '', log = [], li = 0, arriveP = [], leaveP = [];
    var paper = [0, 0, 0, 0], paperClip = 'inset(0px)', lastClip = null;
    var S;

    function measure() {
      W = stage.clientWidth; H = stage.clientHeight; shownK = 0;
      // 停栖只借同页已有纸面，逻辑框不变；不越过页面或视口的左右边界。
      var part = el.closest('.typeset-part'), r = stage.getBoundingClientRect(), q = part ? part.getBoundingClientRect() : r,
        m = 0.75 * bh(), vw = document.documentElement.clientWidth || G.innerWidth;
      paper = [Math.min(m, Math.max(0, r.top - Math.max(0, q.top))),
        Math.min(m, Math.max(0, Math.min(vw, q.right) - r.right)),
        Math.min(m, Math.max(0, q.bottom - r.bottom)),
        Math.min(m, Math.max(0, r.left - Math.max(0, q.left)))];
      paperClip = 'inset(' + paper.map(function (v) { return -v.toFixed(2) + 'px'; }).join(' ') + ')';
      if (S && S.pend && W && H) { S.pend = false; doArrive(); sync(); }
      render();
    }

    // ---------- 状态 ----------
    function reset(n) {
      S = { t: 0, vis: false, x: 0, y: 0, pi: 0, flip: 1, pose: 'idle', sx: 1, sy: 1, rot: 0, lift: 0, act: null,
            night: false, nextSmall: 0, nextMove: 0, turnAt: 0, gazeAt: -9, pend: false, rnd: rng(SEED) };
      setN(n);
      if (auto) doArrive();
    }
    function R(a, b) { return a + (b - a) * S.rnd(); }
    function bh() { return Math.min(Math.max(size * H, minimumSize), A.standH / (2 * (G.devicePixelRatio || 1) * 1.06)); }
    function perch() { return perches[S.pi]; }
    function place(i) { var p = perches[i]; S.pi = i; S.x = p.x; S.y = p.y; S.flip = p.f; }
    function flying() { var a = S.act; return !!a && (a.k === 'fly' || a.k === 'up'); }
    function settle(list) { var l = list.splice(0, list.length); for (var i = 0; i < l.length; i++) l[i](); }

    // 一条飞行：p0..p3 是脚的位置（像素），换算成占比存下来，容器变大小时形状跟着变
    function flight(p, dur, ease, land, up) {
      var path = p.map(function (q) { return [q[0] / W, q[1] / H]; });
      var f = { k: 'fly', t: 0, dur: dur, path: path, ease: ease, land: land };
      S.vis = true;
      S.act = up ? { k: 'up', t: 0, dur: 0.09, next: f } : f;
    }
    function len(p) { var s = 0; for (var i = 1; i < 4; i++) s += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return s; }

    function doArrive() {
      if (reduced) { place(0); S.vis = true; S.act = null; S.pose = S.night ? 'sleep' : 'idle'; S.sx = S.sy = 1; S.rot = 0; settle(leaveP); settle(arriveP); return; }
      if (!W || !H) { S.pend = true; return; }                              // 还没量到尺寸：量到再飞
      var P = perches[0], b = bh(), p3 = [P.x * W, P.y * H], dir, p0, p1;
      if (S.vis && S.act && S.act.k === 'fly' && S.act.land < 0) {          // 正在飞走：掉头飞回来
        var c = [S.x * W, S.y * H]; dir = p3[0] >= c[0] ? 1 : -1;
        flight([c, [c[0] + dir * b, c[1] - 0.6 * b], [p3[0] - dir * 1.1 * b, p3[1] - 2.2 * b], p3], 1.0, 'land', 0);
        settle(leaveP); return;
      }
      if (S.vis) return;                                                    // 已经在画里
      var hi = Math.min(p3[1], 1.1 * b);                                  // 脚不高过这里，整只鸟就还在画里（落脚点靠上时改成平着飞进来）
      if (from === 'top') {
        dir = P.f; p0 = [p3[0] - dir * Math.min(0.3 * W, 6 * b), -1.7 * b]; p1 = [p0[0] + dir * 0.4 * Math.abs(p3[0] - p0[0]), Math.max(p0[1] + 0.32 * H, hi)];
      } else {
        dir = from === 'left' ? 1 : -1;
        var sy = clamp(p3[1] - Math.max(0.3 * H, 2.6 * b), hi, p3[1]);
        p0 = [dir > 0 ? -1.5 * b : W + 1.5 * b, sy]; p1 = [p0[0] + (p3[0] - p0[0]) * 0.45, Math.max(sy - 0.07 * H, hi)];
      }
      var p = [p0, p1, [p3[0] - dir * 1.1 * b, Math.max(p3[1] - 2.2 * b, hi)], p3];
      S.x = p0[0] / W; S.y = p0[1] / H; S.flip = dir;
      flight(p, 1.0 + 0.3 * clamp(len(p) / (0.9 * W), 0, 1), 'land', 0);
    }

    function doLeave() {
      if (!S.vis) { settle(arriveP); settle(leaveP); return; }
      if (reduced) { S.vis = false; S.act = null; settle(arriveP); settle(leaveP); return; }
      var a = S.act;
      if (a && a.k === 'fly' && a.land < 0) return;                         // 已经在飞走
      var b = bh(), c = [S.x * W, S.y * H], up = !flying();
      var dl = c[0], dr = W - c[0], dt = c[1] + b, dir, p1, p2, p3;
      if (dt < dl && dt < dr) {
        dir = S.flip; p3 = [c[0] + dir * Math.min(0.25 * W, 5 * b), -1.7 * b];
        p1 = [c[0] + dir * 0.5 * b, c[1] - 1.8 * b]; p2 = [p3[0] - dir * 0.4 * b, p3[1] + 0.25 * H];
      } else {
        dir = dl < dr ? -1 : 1;
        var hi = Math.min(c[1], 1.1 * b);
        p3 = [dir < 0 ? -1.5 * b : W + 1.5 * b, Math.max(c[1] - Math.max(0.28 * H, 2.4 * b), Math.min(c[1], 0.5 * b))];
        p1 = [c[0] + dir * 0.9 * b, Math.max(c[1] - 1.6 * b, hi)]; p2 = [c[0] + (p3[0] - c[0]) * 0.6, p3[1] + 0.05 * H];
      }
      var p = [c, p1, p2, p3];
      flight(p, 0.78 + 0.16 * clamp(len(p) / W, 0, 1), up ? 'out' : 'cruise', -1, up);
      settle(arriveP);
    }

    function hopTo(x1) {
      S.flip = x1 >= S.x ? 1 : -1;
      S.act = { k: 'hop', t: 0, dur: 0.5, x0: S.x, x1: x1 };
    }
    function flyTo(j) {
      var q = perches[j], b = bh(), c = [S.x * W, S.y * H], x1 = (q.x + (S.rnd() - 0.5) * q.span) * W, p3 = [x1, q.y * H];
      var dx = p3[0] - c[0], lo = Math.min(c[1], p3[1]), top = Math.max(lo - Math.max(1.6 * b, 0.25 * Math.abs(dx)), Math.min(lo, 1.1 * b));
      var p = [c, [c[0] + dx * 0.2, top], [p3[0] - dx * 0.2, top - 0.2 * b], p3];
      flight(p, 0.62 + 0.36 * clamp(len(p) / W, 0, 1), 'smooth', j, true);
    }

    function smallAct(name) {
      var d = name === 'preen' ? R(1.0, 1.3) : R(0.9, 1.2);
      S.act = { k: 'pose', t: 0, dur: d, pose: name };
    }
    function hopTarget() {
      var p = perch(), bw = 1.25 * bh() / W, lo = p.x - p.span / 2, hi = p.x + p.span / 2;
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
      S.pose = 'idle'; S.sy = 1 + 0.007 * Math.sin(S.t * 2 * Math.PI / 2.6); S.sx = 1;
      if (S.t >= S.nextMove) { S.nextMove = S.t + R(24, 38); S.nextSmall = Math.max(S.nextSmall, S.t + 2.5); move(); }
      else if (S.t >= S.nextSmall) { smallAct(['look', 'tilt', 'preen'][Math.floor(S.rnd() * 3)]); S.nextSmall = S.t + R(5, 11); }
    }

    function run(a) {
      var u = Math.min(1, a.t / a.dur), k, b;
      if (a.k === 'up') {                                                   // 起飞前蹲一下
        S.pose = 'crouch'; k = u; S.sy = 1 - 0.06 * k; S.sx = 1 + 0.03 * k; S.rot = 0;
        if (u >= 1) { S.act = a.next; S.sx = S.sy = 1; }
      } else if (a.k === 'fly') {
        var e, de, P = a.path;
        if (a.ease === 'land') { e = 1 - Math.pow(1 - u, 1.7); de = 1.7 * Math.pow(1 - u, 0.7); }
        else if (a.ease === 'out') { e = 0.25 * u + 0.75 * u * u; de = 0.25 + 1.5 * u; }
        else if (a.ease === 'cruise') { e = u; de = 1; }
        else { e = u * u * (3 - 2 * u); de = 6 * u * (1 - u) + 0.05; }
        S.x = bez(P[0][0], P[1][0], P[2][0], P[3][0], e); S.y = bez(P[0][1], P[1][1], P[2][1], P[3][1], e);
        var vx = dbez(P[0][0], P[1][0], P[2][0], P[3][0], e) * de * W, vy = dbez(P[0][1], P[1][1], P[2][1], P[3][1], e) * de * H;
        if (Math.abs(vx) > 0.25 * Math.hypot(vx, vy)) S.flip = vx > 0 ? 1 : -1;
        var rem = (1 - u) * a.dur;
        S.rot = clamp(Math.atan2(vy, Math.abs(vx) + 1e-6) * 0.22, -0.28, 0.28) * S.flip * (a.land >= 0 ? clamp(rem / 0.3, 0, 1) : 1);
        S.pose = a.land >= 0 && rem < 0.22 ? 'fly4' : a.land >= 0 && rem < 0.32 ? 'fly2' : SEQ[Math.floor(a.t / (FLAP / 4)) % 4];
        S.sx = S.sy = 1;
        if (u >= 1) {
          S.rot = 0;
          if (a.land >= 0) { var q = perches[a.land]; S.pi = a.land; S.y = q.y; S.act = { k: 'land', t: 0, dur: 0.32 }; }
          else { S.vis = false; S.act = null; settle(leaveP); }
        }
      } else if (a.k === 'land') {                                          // 落下：很轻地蹲一下再站直
        S.pose = 'idle'; S.rot = 0;
        k = u < 0.3 ? u / 0.3 : 1 - eOut((u - 0.3) / 0.7);
        S.sy = 1 - 0.09 * k; S.sx = 1 + 0.045 * k;
        if (u >= 1) {
          S.act = null; S.sx = S.sy = 1;
          if (S.flip !== perch().f) S.turnAt = S.t + 0.45;
          S.nextSmall = S.t + R(2.5, 4.5); S.nextMove = S.t + R(22, 34);
          settle(arriveP);
        }
      } else if (a.k === 'hop') {                                           // 在 span 里跳一小步
        var c = 0.1 / a.dur, l = 1 - 0.12 / a.dur;
        if (u < c) { k = u / c; S.pose = 'crouch'; S.sy = 1 - 0.06 * k; S.sx = 1 + 0.03 * k; }
        else if (u < l) {
          k = (u - c) / (l - c); S.pose = k > 0.28 && k < 0.72 ? 'hop2' : 'hop';
          S.x = a.x0 + (a.x1 - a.x0) * k; S.lift = 0.2 * 4 * k * (1 - k); S.sy = 1.03; S.sx = 0.98; S.rot = -(0.5 - k) * 0.3 * S.flip;
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
      var clip = flying() ? '' : paperClip;
      if (clip !== lastClip) {
        stage.classList.toggle('lb-perched', !!clip); stage.style.overflow = clip ? 'visible' : 'hidden';
        stage.style.clipPath = clip; lastClip = clip;
      }
      var p = A.poses[S.pose], h = bh(), k = h / A.standH, lift = S.lift, sy = S.sy;
      // 高沿小动作：只约束画出来的上抬和纵向拉伸，脚锚、姿态与时钟不变。
      if (S.act && (S.act.k === 'sing' || S.act.k === 'hop' || S.act.k === 'wake')) {
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
      var X = S.x * W, Y = S.y * H - lift * h;
      if (p[6]) { X += A.body[0] * k * S.flip; Y += A.body[1] * k; }
      var tr = 'translate(' + X.toFixed(2) + 'px,' + Y.toFixed(2) + 'px) rotate(' + S.rot.toFixed(4) + 'rad) scale(' + (S.flip * S.sx).toFixed(4) + ',' + sy.toFixed(4) + ')';
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
      else {                                                                // 点击热区：比鸟大一圈，至少 48 像素见方
        var I = A.poses.idle, hw = Math.max(48, 1.6 * h), hh = Math.max(48, 1.5 * h),
          cx = S.x * W + (I[2] / 2 - I[4]) * k * S.flip, cy = S.y * H - lift * h - 0.5 * h;
        hs = (cx - hw / 2).toFixed(1) + ',' + (cy - hh / 2).toFixed(1) + ',' + hw.toFixed(1) + ',' + hh.toFixed(1);
      }
      if (hs !== lastHit) {
        lastHit = hs;
        if (hs === 'none') hit.style.display = 'none';
        else { var v = hs.split(','); hit.style.display = 'block'; hit.style.transform = 'translate(' + v[0] + 'px,' + v[1] + 'px)'; hit.style.width = v[2] + 'px'; hit.style.height = v[3] + 'px'; }
      }
    }

    // ---------- 真实时钟：看得见才走 ----------
    function running() { return loaded && !failed && !dead && !manual && !reduced && inView && !document.hidden; }
    function loop(now) {
      raf = 0; if (!running()) return;
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
      if (dt > 0) step(dt);
      render();
      raf = requestAnimationFrame(loop);
    }
    function sync() {
      if (running()) { if (!raf) { last = 0; raf = requestAnimationFrame(loop); } }
      else if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }
    function onVis() { sync(); }

    // 逐格录像模式里发生的事要记下来，往回 seek 时照样重演
    function apply(e, sound) {
      if (e.k === 'arrive') doArrive(); else if (e.k === 'leave') doLeave(); else if (e.k === 'night') setN(e.v);
      else if (e.k === 'tap') tap(sound); else if (e.k === 'gaze') gaze(e.v);/*TEST*/ else if (e.k === 'force') force(e.v);/*END*/
    }
    function act(k, v) {
      if (dead) return;
      var e = { k: k, v: v, t: S.t };
      if (manual) log.splice(li++, 0, e);                                  // 记在“已经发生过的”最后面
      apply(e, true);
      sync(); render();
    }
    function promise(list, k) {
      return new Promise(function (res) {
        if (dead || failed) { res(); return; }
        list.push(res); act(k);
        if (k === 'arrive' && S.vis && !flying() && !(S.act && S.act.k === 'land')) settle(arriveP);   // 本来就站在画里
      });
    }

    var io = null, ro = null;
    if (G.IntersectionObserver) { io = new IntersectionObserver(function (en) { inView = en[en.length - 1].isIntersecting; sync(); }); io.observe(stage); }
    if (G.ResizeObserver) { ro = new ResizeObserver(measure); ro.observe(stage); } else G.addEventListener('resize', measure);
    document.addEventListener('visibilitychange', onVis);
    hit.addEventListener('click', function (ev) { ev.stopPropagation(); act('tap'); });
    function onPointer(ev) {
      if (ev.pointerType === 'touch' || reduced || dead || !loaded || !inView || S.night || S.act || !S.vis) return;
      var r = stage.getBoundingClientRect(), x = r.left + S.x * W, y = r.top + S.y * H - .5 * bh(),
        dx = ev.clientX - x, dy = ev.clientY - y;
      if (Math.hypot(dx, dy) <= Math.max(90, bh() * 3) && Math.abs(dx) > 8) act('gaze', dx < 0 ? -1 : 1);
    }
    document.addEventListener('pointermove', onPointer, { passive: true });

    var night0 = !!o.night;
    W = stage.clientWidth; H = stage.clientHeight; reset(night0);
    function ok() { if (loaded || dead) return; loaded = true; measure(); sync(); }
    img.onload = function () { (img.decode ? img.decode() : Promise.resolve()).then(ok, ok); };
    var url = base + A.image, retried = false;
    if (location.protocol === 'file:' && !/^[a-z]+:/i.test(url)) img.removeAttribute('crossorigin');   // 双击打开的本地页面没有跨域可言
    img.onerror = function () {
      if (!retried && img.hasAttribute('crossorigin')) { retried = true; img.removeAttribute('crossorigin'); img.src = url; return; }  // 图床没给跨域头：退回普通方式读
      failed = true; settle(arriveP); settle(leaveP); render();
    };
    img.src = url;

    var api = {
      arrive: function () { return promise(arriveP, 'arrive'); },
      leave: function () { return promise(leaveP, 'leave'); },
      setNight: function (v) { if (S.night !== !!v) act('night', !!v); },
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
        dead = true; if (raf) cancelAnimationFrame(raf); raf = 0;
        if (io) io.disconnect(); if (ro) ro.disconnect(); else G.removeEventListener('resize', measure);
        document.removeEventListener('visibilitychange', onVis);
        document.removeEventListener('pointermove', onPointer);
        if (stage.parentNode) stage.parentNode.removeChild(stage);
        settle(arriveP); settle(leaveP);
      }
    };
    /*TEST*/Object.defineProperty(api, '_force', { value: function (n) { act('force', n); } });
    Object.defineProperty(api, '_state', { get: function () { return { t: S.t, vis: S.vis, act: S.act && S.act.k, pose: S.pose, x: S.x, y: S.y, pi: S.pi, flip: S.flip, night: S.night, raf: !!raf }; } });/*END*/
    return api;
  }

  G.LivingBird = { mount: mount };
})(window);
