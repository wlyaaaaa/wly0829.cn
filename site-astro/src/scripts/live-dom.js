/* 内容页“现在”实时位（区块库排好的 .ts-canvas [data-hot="live"][data-href=键]）。
   现在网站的运行脚本只认整屏图上叠的 [data-slot]，新页上它不取数、不画；这里借它对外的 SiteLiveRuntime.readStatus / parse
   （授权与状态、连接电脑两页借 SiteB2）取值，按键填进实时位。
   读不到时照驾驶舱的做法（public/_home-cockpit/cockpit-offline.js）：页面上只说一次，显示上次读到的值和北京时间，实时位整体变淡；
   从没读到过就安静占位，不写“读不到电脑”；读到后自动恢复。上次读到的值只在真正读到时存（localStorage：site-live-dom:v1:<页>）。
   页面里没有 [data-slot]，现在运行脚本自己的“读不到电脑”提示不会出现；SiteB2 那条连接提示由样式藏掉（typeset-page.css）。 */
(() => {
  'use strict';
  if (window.LiveDom) return;
  let pd = null;
  try { pd = JSON.parse(document.querySelector('#page-data')?.textContent || 'null'); } catch { pd = null; }
  // 连接电脑页的表单、结果、提示也标了 data-hot="live"，那些归 SiteB2 管，不在这里填
  const boxes = () => [...document.querySelectorAll('.ts-canvas [data-hot="live"][data-href]')]
    .filter((b) => !/^ca-(form|results|toast)/.test(b.dataset.href));
  if (!pd || !boxes().length) return;
  const b2 = ['mcp', 'computer-access'].includes(pd.kind);
  const root = document.documentElement;
  const KEY = 'site-live-dom:v1:' + pd.page;
  const project = pd.project ?? null;
  const fmt = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  });
  const bj = (ms) => {
    const p = Object.fromEntries(fmt.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
    return `${p.month}月${p.day}日 ${p.hour}:${p.minute}`;
  };
  let saved = null, notice = null, last = null, busy = false, ctl = null, freshKeys = new Set();
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    if (v && v.project === project && v.at > 0 && v.at <= Date.now() + 6e4 && v.values && typeof v.values === 'object') saved = v;
  } catch { saved = null; }

  // 一项这次读到的值 {text?, rows?, state, href?}；这项没算出（读不到，或数据里暂时没有这一项）返回 null
  function compute(k) {
    if (b2) {
      const v = window.SiteB2?.value?.(k);
      return (v?.text || v?.rows?.some((r) => r.text)) && v.state !== 'unknown' && !v.cached ? v : null;
    }
    if (pd.page === 'remote-control' && k === 'run') return { text: '电脑连接服务在线', state: 'ok' };  // 读到状态本身就说明在线（同现在网站）
    const r = window.SiteLiveRuntime?.parse?.(last, k, pd.project);
    if (!r || r.state === 'unknown' || !r.text) return null;
    const t = k === 'run' ? lastRun() : '';  // 首屏状态行：“运行”那一格带上次运行时间
    return t ? { ...r, text: r.text + ' · 上次运行 ' + t } : r;
  }

  // 这个项目的自动任务里最近一次运行的时间（读到的自动任务数据要新鲜；没有就不写）
  function lastRun() {
    const a = last?.automation, now = Date.now();
    if (!a || !['ok', 'partial', 'empty'].includes(a.state) || !Array.isArray(a.items) || !pd.project) return '';
    const seen = Date.parse(a.observed_at);
    if (!Number.isFinite(seen) || seen > now + 6e4 || now - seen > (Number(a.max_age_seconds) || 120) * 1000) return '';
    const ts = a.items.filter((x) => x?.project === pd.project && x.enabled !== false && x.state !== 'disabled')
      .map((x) => Date.parse(x.last_run_at)).filter((t) => Number.isFinite(t) && t <= now + 6e4);
    if (!ts.length) return '';
    const at = new Date(Math.max(...ts));
    return window.SiteLiveRuntime?.formatTime?.(at.toISOString(), now) || bj(at.getTime());
  }

  // mode：live 刚读到 / loading 正在读（先显示上次的值）/ cached 读不到、有上次的值 / empty 从没读到过
  function paint(mode) {
    root.dataset.liveDom = mode;
    const pre = pd.status_binding?.prefixes || {};
    for (const b of boxes()) {
      const k = b.dataset.href, v = saved?.values?.[k];
      const fresh = !!v && mode === 'live' && freshKeys.has(k);
      const named = !!b.closest('.liveslot')?.querySelector('.livename');  // 旁边已写名字的不再加前缀（同现在网站的“现在”条）
      const rows = v?.rows?.length ? v.rows : null;
      const text = v ? (!named && pre[k] ? pre[k] + '：' : '') + (rows ? rows.map((r) => r.text).join('\n') : v.text) : '';
      const renderKey = JSON.stringify([text, rows?.map((r) => fresh ? r.state : 'cached')]);
      if (b.dataset.liveRender !== renderKey) {
        b.dataset.liveText = text; b.dataset.liveRender = renderKey;
        if (rows) {
          const list = document.createElement('span'); list.className = 'live-rows';
          for (const r of rows) {
            const row = document.createElement('span'), dot = document.createElement('i'), span = document.createElement('span');
            row.className = 'live-row'; row.dataset.state = fresh ? (r.state || 'ok') : 'cached';
            dot.className = 'live-dot'; dot.setAttribute('aria-hidden', 'true');
            span.className = 'live-text'; span.textContent = r.text;
            row.append(dot, span); list.append(row);
          }
          b.replaceChildren(list);
        } else if (text) {
          const dot = document.createElement('i'), span = document.createElement('span');
          dot.className = 'live-dot'; dot.setAttribute('aria-hidden', 'true');
          span.className = 'live-text'; span.textContent = text;
          b.replaceChildren(dot, span);
        } else {
          b.replaceChildren();
        }
      }
      b.dataset.state = !v ? 'empty' : fresh ? (v.state || 'ok') : 'cached';
      b.dataset.liveFresh = String(fresh);
      const href = fresh ? (v?.href || '') : '';
      b.dataset.liveLink = href;
      b.title = !v ? '' : fresh ? text : text + '（最后读到 ' + bj(v.at) + '，北京时间）';
      if (href) { b.setAttribute('role', 'link'); b.tabIndex = 0; }
      else { b.setAttribute('role', 'status'); b.removeAttribute('tabindex'); }
      b.setAttribute('aria-label', text ? b.title : '暂时没有读数');
    }
    const say = mode === 'cached'
      ? '暂时读不到电脑，“现在”一栏保留最后一次读到的状态：' + bj(saved.at) + '（北京时间）。恢复连接后会自动更新。'
      : '';
    if (say && !notice) {
      notice = document.createElement('aside');
      notice.className = 'live-dom-notice';
      notice.setAttribute('role', 'status');
      notice.setAttribute('aria-live', 'polite');
      // 放在第一个有实时位的屏前面；那一屏在卡片网格里时放在网格前面
      const scr = boxes()[0]?.closest('.ts-screen');
      const at = scr?.parentElement?.classList.contains('ts-card-grid') ? scr.parentElement : scr;
      if (at?.parentElement) at.parentElement.insertBefore(notice, at);
      else document.querySelector('main')?.prepend(notice);
    }
    if (notice) {
      notice.hidden = !say;
      if (say && notice.textContent !== say) notice.textContent = say;
    }
    document.dispatchEvent(new Event('site-live-layout'));
  }

  function settle(ok, at) {
    freshKeys = new Set();
    if (!ok) return paint(saved ? 'cached' : 'empty');
    const values = { ...(saved?.values || {}) };
    let any = false;
    for (const b of boxes()) {
      const v = compute(b.dataset.href);
      if (v) {
        values[b.dataset.href] = { text: String(v.text || ''), state: v.state, href: v.href || '', at,
          ...(v.rows ? { rows: v.rows.filter((r) => r.text).map((r) => ({ text: String(r.text), state: r.state })) } : {}) };
        freshKeys.add(b.dataset.href); any = true;
      }
    }
    if (any) {
      saved = { project, at, values };
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch { /* 存不下就只在这次显示 */ }
    }
    // 读到了：这次没算出的项保持变淡（有上次的值）或空位，不出页面提示
    paint(any ? 'live' : (saved ? 'cached' : 'empty'));
  }

  async function refresh() {
    const R = window.SiteLiveRuntime;
    if (!R?.readStatus || busy || document.hidden) return;
    busy = true; ctl = new AbortController();
    try {
      last = await R.readStatus(ctl.signal);  // 失败、过期都会抛错（重试 3 次在它里面）
      const t = Number(last?.served_at_unix ?? last?.observed_at_unix);
      settle(true, Number.isFinite(t) && t > 0 ? Math.min(t * 1000, Date.now()) : Date.now());
    } catch {
      if (!ctl.signal.aborted) settle(false);
    } finally { busy = false; }
  }

  // 有链接的实时位（例如图表网页）点了或回车打开；别的实时位只是读数
  const open = (e) => {
    const b = e.target instanceof Element ? e.target.closest('.ts-canvas [data-hot="live"]') : null;
    if (!b?.dataset.liveLink || root.dataset.liveDom !== 'live' || b.dataset.liveFresh !== 'true' || (e.type === 'keydown' && e.key !== 'Enter')) return;
    e.preventDefault();
    window.open(b.dataset.liveLink, '_blank', 'noopener');
  };
  document.addEventListener('click', open);
  document.addEventListener('keydown', open);

  paint(saved ? 'loading' : 'empty');
  if (b2) {
    const upd = () => {
      const s = window.SiteB2?.getSnapshot?.(), ph = s?.phase || document.body.dataset.b2StatusPhase;
      if (ph === 'ready') settle(true, Math.min((Number(s?.lastRead) || Date.now() / 1000) * 1000, Date.now()));
      else if (ph === 'error') settle(false);
    };
    new MutationObserver(upd).observe(document.body, { attributes: true, attributeFilter: ['data-b2-status-phase'] });
    setInterval(upd, 15000);
    upd();
  } else {
    if (window.SiteLiveRuntime) refresh(); else addEventListener('site-live-ready', refresh, { once: true });
    setInterval(refresh, 60000);
    document.addEventListener('visibilitychange', () => (document.hidden ? ctl?.abort() : refresh()));
  }
  window.LiveDom = { get state() { return root.dataset.liveDom; }, refresh };
})();
