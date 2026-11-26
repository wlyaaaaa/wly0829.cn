// 连接参数来自现役登记；页面只显示、复制，不登录客户端。
(async () => {
  const syncGlow = () => document.body.classList.toggle('connect-glow-paused', document.hidden);
  document.addEventListener('visibilitychange', syncGlow);
  syncGlow();

  let data = null, offlineNote = '', reading = true;   // 第一次回话之前写“正在读…”，不写像没有这种接法的“还没读到”
  const pick = { who: 'chatgpt', pc: 'main' };
  // 固定的接法（地址、认证、客户端 ID、命令）构建时已从现役登记写进页面（组装.py 的 connect_fixed）：
  // 进页先照它画，不等实时读数；读到以后照读到的。没写进来的（试看页）照旧等读数。
  const fixed = (() => { try { return JSON.parse(document.getElementById('connect-fixed')?.textContent || 'null'); } catch { return null; } })();
  const known = () => data || fixed;
  const plans = () => known()?.endpoints?.[pick.pc]?.plans || {};

  const segs = {};
  for (const el of document.querySelectorAll('.seg')) segs[el.dataset.name] = el;
  const mainUptime = document.createElement('span');
  mainUptime.className = 'seg__label';
  mainUptime.hidden = true;
  segs.pc.append(mainUptime);

  function uptimeText(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '';
    const hours = Math.floor(seconds / 3600);
    return hours >= 24
      ? `主机已开机 ${Math.floor(hours / 24)} 天 ${hours % 24} 小时`
      : `主机已开机 ${hours} 小时 ${Math.floor(seconds / 60) % 60} 分钟`;
  }
  function showUptime(main) {
    mainUptime.textContent = uptimeText(main?.uptime_seconds);
    mainUptime.hidden = !mainUptime.textContent;
  }

  // —— 分段选择：黑色的那块滑到选中的一格 ——
  function place(seg, instant) {
    const thumb = seg.querySelector('.seg__thumb');
    const on = seg.querySelector('.seg__opt[aria-checked="true"]');
    if (!on) return;
    thumb.classList.toggle('is-instant', !!instant);
    thumb.style.setProperty('--x', on.offsetLeft + 'px');
    thumb.style.setProperty('--w', on.offsetWidth + 'px');
    if (instant) { void thumb.offsetWidth; thumb.classList.remove('is-instant'); }
  }

  function markSegs(instant) {
    const supported = pc => known()?.endpoints?.[pc]?.plans?.[pick.who];
    // 两台都没有这家的接法：不把选中推到副机冒充能选；两格都置灰、黑块收起，下面照实写“还没读到这个接法。”
    const none = !!known() && !supported('main') && !supported('sub');
    if (known() && !none && !supported(pick.pc)) pick.pc = supported('main') ? 'main' : 'sub';
    for (const [name, seg] of Object.entries(segs)) {
      const empty = name === 'pc' && none;
      seg.classList.toggle('is-none', empty);
      for (const opt of seg.querySelectorAll('.seg__opt')) {
        const v = opt.dataset.v, on = pick[name] === v && !empty;
        opt.setAttribute('aria-checked', String(on));
        opt.tabIndex = on ? 0 : -1;
        if (name === 'pc') opt.disabled = !!known() && !supported(v);
      }
      place(seg, instant);
    }
  }

  // —— 复制：真能复制，点了出“已复制” ——
  async function writeClip(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { ok = false; }
      ta.remove();
      return ok;
    }
  }

  // 浏览器不让写剪贴板：按钮上照实说没复制上，并把那段原文选中，按 Ctrl+C 就能手动复制
  function copyBtn(text, source) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn copy';
    b.dataset.moPress = '';
    b.textContent = '复制';
    b.addEventListener('click', async () => {
      const ok = await writeClip(text);
      clearTimeout(b._t);
      b.textContent = ok ? '已复制' : '没复制上，请手动复制';
      b.classList.toggle('is-done', ok);
      b.classList.toggle('is-failed', !ok);
      if (!ok && source) getSelection()?.selectAllChildren(source);
      b._t = setTimeout(() => {
        b.textContent = '复制';
        b.classList.remove('is-done', 'is-failed');
      }, ok ? 1600 : 4000);
    });
    return b;
  }

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  // —— 画出这一种组合 ——
  function build() {
    const plan = plans()[pick.who];
    const out = [];
    if (!plan) return [el('p', 'say', offlineNote || (reading && !data ? '正在读这个接法…' : '还没读到这个接法。'))];
    // Claude、Codex：先写明是哪台上的程序去连
    if (plan.where) {
      const box = el('div', 'rows');
      const row = el('div', 'row');
      row.append(el('span', 'row__k', '在哪运行'), el('span', 'row__v row__v--plain', plan.where), el('span'));
      box.append(row);
      out.push(box);
    }
    if (plan.rows) {
      const box = el('div', 'rows');
      for (const [k, v, copy, word] of plan.rows) {
        const row = el('div', 'row'), value = el('span', word ? 'row__v row__v--word' : 'row__v', v);
        row.append(el('span', 'row__k', k), value);
        row.append(copy ? copyBtn(v, value) : el('span'));
        box.append(row);
      }
      out.push(box);
    }
    if (plan.cmds) {
      const box = el('div', 'cmds');
      for (const c of plan.cmds) {
        const row = el('div', 'cmd'), value = el('pre', 'cmd__v', c);
        row.append(value, copyBtn(c, value));
        box.append(row);
      }
      out.push(box);
    }
    if (plan.say) out.push(el('p', 'say', pick.who === 'self' ? plan.say.split('；')[0] : plan.say));
    // 自己看桌面没有“它”，这一句不出
    if (offlineNote || !plan.quiet) out.push(el('p', 'sheet__foot', offlineNote || '让它报出电脑名，报得出就是连上了。'));
    return out;
  }

  const body = document.querySelector('.sheet__body');
  const sheet = document.getElementById('sheet');
  let swapT = 0;

  function show(animate) {
    if (!animate) {
      sheet.replaceChildren(...build());
      return;
    }
    clearTimeout(swapT);
    const from = body.offsetHeight;
    body.style.height = from + 'px';
    sheet.classList.add('is-leaving');
    swapT = setTimeout(() => {
      sheet.replaceChildren(...build());
      sheet.classList.remove('is-leaving');
      sheet.classList.add('is-entering');
      const to = sheet.offsetHeight;
      requestAnimationFrame(() => {
        body.style.height = to + 'px';
        [...sheet.children].forEach((c, i) => { c.style.transitionDelay = i * 40 + 60 + 'ms'; });
        sheet.classList.remove('is-entering');
      });
      const done = (e) => {
        if (e.target !== body) return;
        body.style.height = '';
        body.removeEventListener('transitionend', done);
      };
      body.addEventListener('transitionend', done);
    }, 140);
  }

  for (const [name, seg] of Object.entries(segs)) {
    seg.addEventListener('click', (e) => {
      const opt = e.target.closest('.seg__opt');
      if (!opt || opt.disabled || pick[name] === opt.dataset.v) return;
      const before = plans()[pick.who];
      pick[name] = opt.dataset.v;
      markSegs(false);
      if (plans()[pick.who] !== before) show(true);
    });
    // 左右键在一条里挪
    seg.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const opts = [...seg.querySelectorAll('.seg__opt:not(:disabled)')];
      if (!opts.length) return;
      const i = opts.findIndex((o) => o.dataset.v === pick[name]);
      const next = opts[(i + (e.key === 'ArrowRight' ? 1 : -1) + opts.length) % opts.length];
      e.preventDefault();
      next.click();
      next.focus();
    });
  }

  // 先画固定的接法，不等实况脚本下载完
  markSegs(true);
  show(false);
  if (!window.Live) await new Promise((resolve, reject) => { const s = document.createElement('script'); s.src = '/live/_lib/live-client.js'; s.onload = resolve; s.onerror = reject; document.head.append(s); });
  function renderLink(s) {
    const at = s.shownAt || s.cutoffAt;
    if (!['idle', 'wait', 'slow'].includes(s.phase)) reading = false;
    offlineNote = s.offline ? '电脑连不上' + (at ? ` · 北京时间 ${window.Live.stamp(at)} 最后读到` : '') : '';
    document.body.classList.toggle('live-off', s.offline);
    showUptime(s.offline ? null : data?.main);
    show(false);
  }
  window.Live.watch('connect', {}, { data(value) { data = value; markSegs(true); }, link: renderLink });
  window.addEventListener('focus', () => window.Live.refresh());
  markSegs(true);
  show(false);
  window.addEventListener('resize', () => markSegs(true));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => markSegs(true));

  const ready = () => document.body.classList.add('is-ready');
  requestAnimationFrame(() => requestAnimationFrame(ready));
})().catch(() => { document.body.classList.add('is-ready'); document.getElementById('sheet').textContent = '连接状态还没读到，请重新加载。'; });
