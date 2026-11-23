// 实况的光和灯：每次进页随机分配柔和光色，同页保留；后端状态只改变小灯。
// 光的样子照本人选定的样板（front\sample\light.js）：主光 6 秒一圈（“快”），乘全站 --mo-speed；
// 只在标签页不在前台时不飘（没人看得见）；动效一直开着，连不上也照常飘，连接状态由灯的颜色和文字说。
//
// 用法（页面）：
//   LiveLight.add(card)                 卡上要有 .card__glow；随机分配光色并记在 data-glow，同页不重抽
//   LiveLight.add(card, { defer: true }) 首屏的光等 lightUp 点灯后再漫出
//   LiveLight.tone(card, 'amber')        只换灯：green|amber|red|gray|blue（也接受 grey、灰、off）；none 表示没有总状态
//   LiveLight.tone(card, data)           直接接后端 level；灯和说明用 LiveUI.status(data) 的 lamp / note
//   LiveLight.lightUp(cards)            进页那一次：按给的顺序一颗接一颗亮
//   LiveLight.offline(true|false)       整页连不上／恢复
(() => {
  'use strict';
  const root = document.documentElement;
  const TAU = Math.PI * 2;
  const TURN = 6;            // 主光走一圈的秒数（样板“快”）
  const STEP = 60;           // 灯与灯错开的毫秒（动效定稿第二节第 2 条）
  const LAMP = 200;          // 等小灯亮完才漫出底光
  const GLOW = 800;          // 光漫出的毫秒
  const PALETTE = ['green', 'sage', 'lilac', 'cyan', 'blue', 'coral', 'pink', 'peach', 'red', 'amber'];
  const weight = color => color === 'green' ? 1.5 : 1;

  // 每种颜色两团光。w、h：大小，按卡宽、参考高的比例；cx、cy：中心，按“画在右边”写（画在左边时左右对调，没画用 bare）；
  // ax、ay 飘多远，s 大小呼吸，o0±oa 浓淡呼吸；f* 相对主光一圈的快慢，p* 起点。数都来自样板。
  const MOVE_A = { fx: 1, fy: .73, fs: 1.21, fo: .83 };
  const MOVE_B = { fx: .81, fy: 1.13, fs: .9, fo: 1.37 };
  const LOOK = {
    green: {
      a: { w: .72, h: 1.5, max: 540, cx: .38, cy: .5, ax: .12, ay: .14, s: .07, o0: .9, oa: .1, ...MOVE_A, px: 3.3, py: 2.1, ps: 1.4, po: 3.1 },
      b: { w: .44, h: 1.05, max: 330, cx: .26, cy: .42, ax: .1, ay: .2, s: .1, o0: .7, oa: .3, ...MOVE_B, px: .7, py: 4.4, ps: 2.6, po: 1.2 },
      bare: { a: .48, b: .36 },
    },

  };

  // 各色统一形状、浓淡和飘法，状态不参与背景的选择。
  for (const color of PALETTE) LOOK[color] = LOOK.green;

  // 全站曲线（motion.css）：出现 --mo-out
  function bezier(x1, y1, x2, y2) {
    const at = (t, a, b) => ((1 - 3 * b + 3 * a) * t + (3 * b - 6 * a)) * t * t + 3 * a * t;
    return (x) => {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let t = x;
      for (let i = 0; i < 8; i++) {
        const d = at(t, x1, x2) - x;
        const slope = (3 * (1 - 3 * x2 + 3 * x1)) * t * t + 2 * (3 * x2 - 6 * x1) * t + 3 * x1;
        if (Math.abs(d) < 1e-4 || !slope) break;
        t -= d / slope;
      }
      return at(Math.min(1, Math.max(0, t)), y1, y2);
    };
  }
  const OUT = bezier(.16, 1, .3, 1);

  const speed = () => parseFloat(getComputedStyle(root).getPropertyValue('--mo-speed')) || 1;

  const cards = new Map();
  let isOffline = false;
  let turns = 0, elapsed = 0, last = null, raf = 0;
  // 只有页面在后台时停（没人看得见）；连不上照样飘，连接状态由灯的颜色和文字说
  const paused = () => document.hidden;
  const visible = c => c.enabled && c.visible && c.card.isConnected && c.w && c.set && c.revealAt !== Infinity;
  const canMove = () => !paused() && [...cards.values()].some(visible);

  function makeSet(c, tone) {
    const el = document.createElement('span');
    el.className = 'glow';
    el.dataset.tone = tone;
    el.innerHTML = '<i class="blob blob--a"></i><i class="blob blob--b"></i>';
    c.host.append(el);
    const set = { tone, el, a: el.children[0], b: el.children[1] };
    set.b.hidden = c.single;
    for (const [i, blob] of [set.a, set.b].entries()) {
      const first = i ? randomGlow(c.card) : tone, second = Math.random() < .5 ? first : randomGlow(c.card, [first]);
      blob.dataset.colors = first === second ? first : `${first}+${second}`;
      blob.style.setProperty('--glow-a', `var(--glow-${first})`);
      blob.style.setProperty('--glow-b', `var(--glow-${second})`);
      blob.style.setProperty('--glow-alpha-a', first === 'green' ? '.65' : '1');
      blob.style.setProperty('--glow-alpha-b', second === 'green' ? '.65' : '1');
    }
    return set;
  }

  function size(c, set) {
    const look = LOOK[set.tone];
    const ref = Math.min(c.h, c.w * .37);
    set.sz = {};
    for (const k of ['a', 'b']) {
      const m = look[k];
      const w = Math.min(c.w * m.w, m.max), h = ref * m.h;
      set.sz[k] = [w, h];
      set[k].style.width = w.toFixed(1) + 'px';
      set[k].style.height = h.toFixed(1) + 'px';
    }
  }

  function measure(c) {
    c.w = c.card.offsetWidth;
    c.h = c.card.offsetHeight;
    if (!c.w) return;
    if (!c.set) {
      c.tone = randomGlow(c.card);
      c.card.dataset.glow = c.tone;
      c.set = makeSet(c, c.tone);
    }
    if (!c.set.el.isConnected) c.host.append(c.set.el);
    size(c, c.set);
    if (!c.set.a.style.transform) pose(c, speed());
  }

  function pose(c, pace) {
    const set = c.set, t = turns;
    const look = LOOK[set.tone];
    const side = c.card.dataset.pic;
    const lv = OUT((elapsed - c.revealAt) / (GLOW * pace));
    const ref = Math.min(c.h, c.w * .37);
    const reach = Math.min(c.w, 760);
    for (const k of ['a', 'b']) {
      const m = look[k], el = set[k];
      let cx = side ? m.cx : look.bare[k];
      if (side === 'left') cx = 1 - cx;
      const [bw, bh] = set.sz[k];
      const x = c.w * cx + reach * m.ax * Math.sin(TAU * t * m.fx + m.px) - bw / 2;
      // 高的卡（一长串的清单）光放在上半，靠着第一行的灯
      const y = Math.min(c.h * m.cy, c.w * .3) + ref * m.ay * Math.sin(TAU * t * m.fy + m.py) - bh / 2;
      // 漫出：从小一圈、淡的长到原大；收回反过来
      const s = (1 + m.s * Math.sin(TAU * t * m.fs + m.ps)) * (.62 + .38 * lv);
      const o = m.o0 + m.oa * Math.sin(TAU * t * m.fo + m.po);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
      el.style.opacity = o.toFixed(3);
    }
    set.el.style.opacity = lv.toFixed(3);
  }

  function frame(now) {
    raf = 0;
    if (!canMove()) { last = null; return; }
    // 恢复的第一帧留在停下时的姿态；下帧才向前走。
    if (last != null) {
      const dt = Math.min(now - last, 100);
      const pace = speed();
      elapsed += dt;
      turns += dt / (1000 * TURN * pace);
      for (const c of cards.values()) if (visible(c)) pose(c, pace);
    }
    last = now;
    raf = requestAnimationFrame(frame);
  }

  function run() {
    root.classList.toggle('live-hidden', document.hidden);
    if (canMove()) {
      if (!raf) raf = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(raf);
      raf = 0;
      last = null;
    }
  }

  const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(() => {
    selectGlows();
    run();
  }) : null;
  const intersection = typeof IntersectionObserver === 'function' ? new IntersectionObserver(entries => {
    for (const entry of entries) cards.get(entry.target).visible = entry.isIntersecting;
    run();
  }) : null;

  function randomGlow(card, avoid = []) {
    const rect = card.getBoundingClientRect(), previous = [...cards.values()].filter(c => c.enabled && c.card !== card && c.tone && c.card.offsetWidth);
    const nearby = rect.width ? previous.map(c => {
      const r = c.card.getBoundingClientRect();
      return { color: c.tone, distance: Math.hypot(r.left + r.width / 2 - rect.left - rect.width / 2, r.top + r.height / 2 - rect.top - rect.height / 2) };
    }).sort((a, b) => a.distance - b.distance).slice(0, 3).map(c => c.color) : previous.slice(-3).map(c => c.tone);
    nearby.push(card.previousElementSibling?.dataset.glow, card.nextElementSibling?.dataset.glow, ...avoid);
    const choices = PALETTE.filter(color => !nearby.includes(color));
    let draw = Math.random() * choices.reduce((sum, color) => sum + weight(color), 0);
    return choices.find(color => (draw -= weight(color)) < 0) || choices.at(-1);
  }

  function add(card, { defer = false } = {}) {
    if (cards.has(card)) return;
    if (card.closest('.grp,.lb-card,.row,.grp__fig')) return;
    const host = card.querySelector('.card__glow');
    if (!host) return;
    const home = !!document.querySelector('.board #projects');
    const c = { card, host, set: null, tone: null, revealAt: defer ? Infinity : -Infinity,
      enabled: false, visible: !intersection, single: !home || card.id !== 'chats' };
    cards.set(card, c);
    selectGlows();
    resize?.observe(card);
    intersection?.observe(card);
    run();
  }

  function selectGlows() {
    const all = [...cards.values()].filter(c => c.card.isConnected).sort((a, b) => a.card.compareDocumentPosition(b.card) & 4 ? -1 : 1);
    const home = !!document.querySelector('.board #projects');
    const hero = all.find(c => c.card.matches('#hero,#pj-hero,.card--hero,.book-hero,.route-head')) || all[0];
    // 实况首页的每张主卡都带光；其它页沿用原来的两处。
    const chosen = new Set(home ? all : [hero, all.find(c => c !== hero)].filter(Boolean));
    for (const c of cards.values()) {
      c.enabled = chosen.has(c);
      if (!c.enabled) c.set?.el.remove();
    }
    for (const c of chosen) measure(c);
  }

  function tone(card, next) {
    if (next && typeof next === 'object') next = window.LiveUI.status(next).tone;
    card.dataset.tone = ({ yellow: 'amber', grey: 'gray', '灰': 'gray', off: 'gray' })[next] || next;
  }

  // 从下一层退回来（motion.js 在 document 上发 motion:still）：页面缩回卡片时底下要是画好的样子，灯和光直接在，不再一颗颗亮
  let returning = false;
  document.addEventListener('motion:still', () => { returning = true; });
  function lightUp(list, immediate = false) {
    const pace = immediate || returning || paused() ? 0 : speed();
    list.forEach((card, i) => {
      const turnOn = () => {
        card.classList.add('is-lit');
        const c = cards.get(card);
        if (!c || c.revealAt !== Infinity) return;
        c.revealAt = pace ? elapsed + LAMP * pace : -Infinity;
        if (c.revealAt === -Infinity && c.set && c.enabled) pose(c, 1);
        run();
      };
      if (pace && i) setTimeout(turnOn, i * STEP * pace);
      else turnOn();
    });
  }

  function offline(on) {
    on ||= window.LiveUI?.offline?.();
    if (isOffline === on) return;
    isOffline = on;
    document.body.classList.toggle('live-off', on);
    run();
  }

  document.addEventListener('visibilitychange', run);

  // ———— 全站共用：每页都有进页升起和首卡的光，页面自己没接的由这里补上（新页、漏接的页不用各自写）————
  // 1. 页面没标升起块：主体里的各大块自动按顺序升起（通知条、装饰层不动）
  // 2. 升起块进页时还藏着、等数据到了才露出（如任务详情的统计和记录）：头几秒内露出时补演一次升起
  // 3. 页面没给任何卡接光：首卡补一团光，进页漫出、之后照常飘
  const HERO = '#hero,#pj-hero,.card--hero,.book-hero,.route-head,.task-hero,.automation-hero,.laptop-hero';
  const entered = performance.now();
  function autoRise() {
    const main = document.querySelector('main');
    if (!main) return;
    // 实况首页自己按卡片入场（l1.js），这里不再整块升起
    if (!main.querySelector('[data-mo-rise]') && !document.querySelector('.board #projects')) {
      for (const el of main.children) if (!el.matches('script,template,style,.notices,.field,[aria-hidden="true"]')) el.setAttribute('data-mo-rise', '');
    }
    const late = new Set(main.querySelectorAll('[data-mo-rise][hidden]'));
    if (!late.size) return;
    const watch = new MutationObserver(records => {
      if (performance.now() - entered > 6000) { watch.disconnect(); return; }
      for (const { target } of records) {
        if (target.hidden || !late.delete(target)) continue;
        if (!root.classList.contains('mo-on') || returning || document.hidden) continue;
        const css = getComputedStyle(root), length = (parseFloat(css.getPropertyValue('--mo-rise')) || 600) * speed();
        target.animate([{ opacity: 0, translate: `0 ${css.getPropertyValue('--mo-rise-y').trim() || '14px'}` }, { opacity: 1, translate: '0 0' }],
          { duration: length, easing: css.getPropertyValue('--mo-out').trim() || 'ease-out', fill: 'backwards' });
      }
    });
    for (const el of late) watch.observe(el, { attributes: true, attributeFilter: ['hidden'] });
  }
  function autoLight() {
    // 页面自己设计了光（标了 card__glow）或已经接上的，不动
    const main = document.querySelector('main');
    if (cards.size || !main || main.querySelector('.card__glow')) return;
    const hero = main.querySelector(HERO) || main.querySelector('.glass:not(.live-conn)');
    if (!hero || hero.closest('.grp,.lb-card,.row,.grp__fig')) return;
    if (!hero.querySelector('.card__glow')) {
      // 光垫在首卡自己的底色上面、所有内容下面
      const glow = document.createElement('div');
      glow.className = 'card__glow'; glow.setAttribute('aria-hidden', 'true'); glow.style.zIndex = '-1';
      if (getComputedStyle(hero).position === 'static') hero.style.position = 'relative';
      hero.style.isolation = 'isolate';
      hero.prepend(glow);
    }
    add(hero);
    lightUp([hero]);
  }
  if (document.readyState === 'loading') {
    if (document.querySelector('main')) autoRise(); else document.addEventListener('DOMContentLoaded', autoRise, { once: true });
    document.addEventListener('DOMContentLoaded', autoLight, { once: true });
  } else { autoRise(); autoLight(); }

  window.LiveLight = { add, tone, lightUp, offline };
})();
