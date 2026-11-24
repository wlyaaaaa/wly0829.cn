// 通用“不可信设备”弹框，和文件末尾全站共用的通知浮窗 SiteNotice。授权页先用，实况页以后照样引这两个文件就能用。样子照本目录 fable-2-防伪底纹.png，底色换成强调绿（本人 11-14 21:23、21:25）。
//
// 用法：要可信设备才能点的按钮加 data-need-trusted（值写动作名，比如 "锁屏"，现在只用来标记）。
//       按钮照常露着、不隐藏；这台设备不可信时，点它不执行原来的动作，改为弹框。
//       程序里要自己弹（比如电脑回了“要可信设备”的错误），调 TrustModal.show()。
//       访客份里看不到的内容原位写“可信设备可见”（本人 11-16 18:58）：输出
//       <button type="button" class="trust-note" data-trust-view>可信设备可见</button>，点了弹同一个框，说明换成“看”的那句。
//       访客份里对外换过说法的地方写 <button type="button" class="trust-note" data-trust-view="rewritten">换了说法</button>（总协调 11-16 19:36），点了说明原话在哪看。
//
// 设备身份由后端读回，设备头仍由每个写接口核验。
(() => {
  const base = new URL('.', document.currentScript.src);
  const isTrusted = () => window.CockpitViewer?.kind === 'owner';

  let layer, ok, lastFocus, hideT = 0;

  function build() {
    layer = document.createElement('div');
    layer.className = 'tm-layer';
    layer.hidden = true;
    layer.innerHTML = `
      <div class="tm-shade"></div>
      <div class="tm-card" role="dialog" aria-modal="true" aria-labelledby="tm-title" aria-describedby="tm-body">
        <div class="tm-pattern" aria-hidden="true"></div>
        <h2 class="tm-title" id="tm-title">这台设备还不是可信设备</h2>
        <p class="tm-body" id="tm-body">这一步只有可信设备能做。</p>
        <p class="tm-note">本人的新设备：让电脑上的 AI 发一个配对链接，15 分钟内打开就成了可信设备。</p>
        <button class="tm-ok" type="button">知道了</button>
      </div>`;
    layer.querySelector('.tm-pattern').style.backgroundImage = `url("${new URL('img/pattern-v1.webp', base)}")`;
    document.body.append(layer);
    ok = layer.querySelector('.tm-ok');
    layer.querySelector('.tm-shade').addEventListener('click', hide);
    ok.addEventListener('click', hide);
    layer.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); hide(); }
      else if (e.key === 'Tab') { e.preventDefault(); ok.focus(); }   // 框里只有一颗按钮，焦点留在它上面
    });
  }

  const BODY = {
    act: '这一步只有可信设备能做。',
    view: '这里是本人的隐私信息，不公开。本人在自己配对过的手机和电脑上能看到原文。',
    rewritten: '这里换了一种说法，原话是本人的隐私信息，不公开。本人在自己配对过的手机和电脑上能看到原话。',
  };

  function show(kind) {
    if (!layer) build();
    layer.querySelector('.tm-body').textContent = BODY[kind] || BODY.act;
    clearTimeout(hideT);
    lastFocus = document.activeElement;
    layer.hidden = false;
    void layer.offsetWidth;                      // 先让它出现，再加类，淡入才播得出来
    layer.classList.add('is-open');
    ok.focus({ preventScroll: true });
  }

  function hide() {
    if (!layer || layer.hidden) return;
    layer.classList.remove('is-open');
    hideT = setTimeout(() => { layer.hidden = true; }, 300);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  // 抢在页面自己的点击处理前面拦下（捕获阶段），页面脚本不用改动作逻辑
  document.addEventListener('click', (e) => {
    const el = e.target instanceof Element ? e.target : null;
    const view = el?.closest('[data-trust-view]');
    if (view) {                                  // “可信设备可见”几个字：谁点都弹，说明什么是可信设备
      e.preventDefault();
      e.stopImmediatePropagation();
      show(view.dataset.trustView === 'rewritten' ? 'rewritten' : 'view');
      return;
    }
    const b = el?.closest('[data-need-trusted]');
    if (!b || isTrusted()) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    show();
  }, true);

  window.TrustModal = { show, hide, isTrusted };

  // 全站共用的通知浮窗（本人 11-24：成功失败都做一个好看的提示，尽可能共用）。授权页和实况每页都已经引本文件，所以放这里。
  // 从页眉正中那颗绿点长出来，停在页眉正下方居中的磨砂玻璃胶囊：成功绿勾、失败珊瑚橙感叹号，带 × 和倒计时细线。
  // SiteNotice(先写的话, 小字, 列表 id) 先转圈，返回 { set(state, 话, { name, retry, error, hold }), close }；
  // state 是 busy／ok／fail；ok 默认 9 秒自己收起，fail 默认留着（hold 给毫秒数改）；retry 给了就多一颗“再点一次”。
  window.SiteNotice = (head = '正在保存…', detail = '', laneId = 'site-notices') => {
    let lane = document.getElementById(laneId), timer;
    if (!lane) { lane = document.createElement('ul'); lane.id = laneId; document.body.append(lane); }
    lane.classList.add('site-notices');
    const note = document.createElement('li'), make = (tag, name, text = '') => Object.assign(document.createElement(tag), { className: name, textContent: text });
    note.setAttribute('role', 'status');
    lane.prepend(note);
    const close = () => { clearTimeout(timer); note.classList.add('is-leaving'); setTimeout(() => note.remove(), 260); };
    const set = (state, text, { name = detail, retry, error, hold = state === 'ok' ? 9000 : 0 } = {}) => {
      clearTimeout(timer);
      note.className = 'site-notice is-' + state;
      if (error) note.dataset.error = error;   // 后台回的错误名，查问题用
      note.replaceChildren(make('span', 'site-notice__icon'), make('b', 'site-notice__head', text));
      note.firstChild.setAttribute('aria-hidden', 'true');
      if (name) note.append(make('span', 'site-notice__name', name));
      if (retry) note.append(Object.assign(make('button', 'site-notice__retry', '再点一次'), { type: 'button', onclick: () => { note.remove(); retry(); } }));
      if (state === 'busy') return;
      note.append(Object.assign(make('button', 'site-notice__x', '×'), { type: 'button', title: '关掉', onclick: close }));
      if (hold > 0) { const line = make('i', 'site-notice__line'); line.style.setProperty('--hold', hold + 'ms'); note.append(line); timer = setTimeout(close, hold); }
    };
    set('busy', head);
    return { set, close, note };
  };
})();
