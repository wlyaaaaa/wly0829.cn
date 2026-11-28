// “项目”“技能”两张试看页共用。会动的几件事：
// 1. 画滑进窗口时慢慢浮上来，光晕跟着亮起来。
// 2. 点了先不跳：进入项目页、技能页的那段动画还没做。
// 3. 技能页：鼠标放到一张上，同一个项目名下的几张（同门）一起亮着。
// 4. 右下角的小面板：调大画高矮（一屏几张）和光晕浓淡。只是试看用的；两页记同一组数。
// 原来想让“画里的景比画框走得慢一点”，试了不行：封面上的字贴着画的边，画一挪字就被裁掉，去掉了。
(() => {
  let pieces = [...document.querySelectorAll('.piece')];
  if (!pieces.length) return;
  const params = new URLSearchParams(location.hash.slice(1));
  const root = document.documentElement;
  const wall = document.getElementById('wall');
  if (wall?.classList.contains('wall--skills')) {
    const project = new URLSearchParams(location.search).get('project');
    const matches = project ? pieces.filter((piece) => piece.dataset.group === project) : [];
    if (matches.length) {
      for (const piece of pieces) {
        if (piece.dataset.group !== project) piece.remove();
      }
      pieces = matches;

      const link = document.createElement('a');
      link.className = 'wall__all-skills';
      link.href = '/skills/';
      link.textContent = '看全部技能';
      wall.prepend(link);
    }
  }
  const revealAll = params.get('reveal') === 'all'; // 截图自查用：不等滑到，全部直接显示，也不放过渡
  if (revealAll) root.classList.add('no-anim');

  // 1. 浮上来：画的上沿进了窗口（留 6% 的余量）就算到了
  let ticking = false;
  function check() {
    ticking = false;
    const vh = window.innerHeight;
    for (const p of pieces) {
      if (p.classList.contains('is-in')) continue;
      const r = p.getBoundingClientRect();
      if (revealAll || (r.top < vh * 0.94 && r.bottom > 0)) p.classList.add('is-in');
    }
  }
  function requestCheck() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(check);
  }
  window.addEventListener('scroll', requestCheck, { passive: true });
  window.addEventListener('resize', requestCheck);
  // 等页面先画出一帧再检查，刚打开时第一屏的画才有“浮上来”的那一下
  requestAnimationFrame(() => requestAnimationFrame(check));

  // 2. 点了先不跳
  pieces.forEach((p) => p.addEventListener('click', (e) => e.preventDefault()));

  // 3. 同门一起亮（页面上写了 data-kin="on" 才有；哪几张是同门看每张的 data-group）
  if (wall && wall.dataset.kin === 'on') {
    for (const p of pieces) {
      p.addEventListener('mouseenter', () => {
        for (const q of pieces) q.classList.toggle('is-kin', q !== p && !!p.dataset.group && q.dataset.group === p.dataset.group);
      });
      p.addEventListener('mouseleave', () => {
        for (const q of pieces) q.classList.remove('is-kin');
      });
    }
  }

  // 4. 小面板
  const knobs = document.getElementById('knobs');
  if (!knobs) return;
  const bigh = document.getElementById('k-bigh'); // 技能页没有这一根
  const glow = document.getElementById('k-glow');
  const out = document.getElementById('knobs-out');
  const page = knobs.dataset.page || '这一页';
  const GAP = 5.5; // 和 wall.css 里的 --gap-big 一致

  // 两页记同一组数：在一页上调过，换到另一页还是这组
  function recall(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function remember(key, value) {
    try { localStorage.setItem(key, value); } catch { /* 记不住就算了 */ }
  }
  const savedBig = recall('wall.bigvh');
  const savedGlow = recall('wall.glow');
  if (savedBig) {
    if (bigh) bigh.value = savedBig;
    else root.style.setProperty('--big-vh', savedBig);
  }
  if (savedGlow) glow.value = savedGlow;

  function apply() {
    const parts = [];
    if (bigh) {
      root.style.setProperty('--big-vh', bigh.value);
      bigh.nextElementSibling.textContent = bigh.value;
      // 一屏几张：页眉占掉约 7% 的窗口高，剩下的除以（一张画 + 一段白墙）
      const perScreen = (100 - 7) / (Number(bigh.value) + GAP);
      parts.push(`大画高 ${bigh.value}`, `一屏约 ${perScreen.toFixed(1)} 张`);
    }
    root.style.setProperty('--glow', (glow.value / 100).toFixed(2));
    glow.nextElementSibling.textContent = glow.value;
    parts.push(`光晕 ${glow.value}`);
    out.textContent = `${page}：${parts.join(' · ')}`;
    requestCheck();
  }

  if (bigh) bigh.addEventListener('input', () => { remember('wall.bigvh', bigh.value); apply(); });
  glow.addEventListener('input', () => { remember('wall.glow', glow.value); apply(); });

  document.getElementById('knobs-fold').addEventListener('click', (e) => {
    const folded = knobs.dataset.folded !== 'true';
    knobs.dataset.folded = String(folded);
    e.currentTarget.textContent = folded ? '展开' : '收起';
  });

  document.getElementById('knobs-copy').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    try {
      await navigator.clipboard.writeText(out.textContent);
      btn.textContent = '已复制';
    } catch {
      btn.textContent = '没复制上，手抄上面那行';
    }
    setTimeout(() => { btn.textContent = '复制这组数'; }, 1600);
  });

  if (params.get('tune') === 'off') knobs.hidden = true;
  apply();
})();
