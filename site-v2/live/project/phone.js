// 手机日记本（/live/project/?id=phone-collector）自己的几块；page.js 只在几处接进来：adapt 改这一页的数据、board 加卡、columns 定卡放哪一栏、changes 定“最近改动”先露几条。
// 本人 11-27 22:42 选的甲：通栏“日记本：每天收到了什么”（左边四种记录各一行，右边每天一列格子，一次 14 天、往前翻）；
// 左下照旧“最近改动”（page.js 画，先露 3 条）；右下“去实况里看”四行跳转（实况“手机”页按 #grp- 停在那一组）。
// 跟实况“手机”重复的（定位、用机新到，采集运行，App 版本，变化清单时间，非系统软件数，流量）这页不再画，接口照给，跳过去看。
// 访客版同一套页面、同一份接口：这页都是条数、日期、几点收到这类技术数，两版一样；以后接口给了访客看不到的值，原位“••••”并挂全站同一个紫色“访客看不到”。
// 每个日期、“截止”都照接口给的字段写，字段没给的那块不画（本人 11-27 14:41 禁令：不显示没人维护的标识）。
(() => {
  'use strict';
  const U = window.LiveUI, esc = U.esc;
  const DROP = new Set(['freshness', 'accumulated', 'recent-day', 'packages', 'survival', 'daily', 'more-data', 'traffic']);   // 这页不按通用卡画的几节
  const COLUMNS = { changes: 0, 'phone-go': 1 };
  const NARROW = '(max-width: 1100px)';   // 和 phone.css 的 @media 同一个宽度
  const PAGE = 14;   // 格子一次露 14 天
  const GREEN = '#00a650';
  const DOTS = '<span class="ph-dots">••••</span>';

  // —— 数怎么写 ——
  const finite = n => typeof n === 'number' && Number.isFinite(n);
  const int = n => Math.round(n).toLocaleString('zh-CN');
  const zoned = at => {
    if (typeof at !== 'string' || !/^\d{4}-\d\d-\d\d/.test(at)) return null;
    if (/^\d{4}-\d\d-\d\d$/.test(at)) return { y: +at.slice(0, 4), m: +at.slice(5, 7), d: +at.slice(8, 10), time: '', day: at };
    const t = Date.parse(/(?:Z|[+-]\d\d:\d\d)$/.test(at) ? at : `${at}+08:00`);
    if (!Number.isFinite(t)) return null;
    const f = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(t)).map(p => [p.type, p.value]));
    return { y: +f.year, m: +f.month, d: +f.day, time: `${f.hour}:${f.minute}`, day: `${f.year}-${f.month}-${f.day}` };
  };
  const md = at => { const z = zoned(at); return z ? `${z.m}月${z.d}日` : ''; };
  const mdTime = at => { const z = zoned(at); return z ? `${z.m}月${z.d}日${z.time ? ` ${z.time}` : ''}` : ''; };
  const dash = day => { const z = zoned(day); return z ? `${String(z.m).padStart(2, '0')}-${String(z.d).padStart(2, '0')}` : ''; };
  const todayDay = () => zoned(new Date().toISOString()).day;
  const isoText = t => typeof t === 'string' ? t.replace(/\b\d{4}-\d\d-\d\d(?:T\d\d:\d\d(?::\d\d(?:\.\d+)?)?(?:Z|[+-]\d\d:\d\d)?)?/g, x => x.length > 10 ? mdTime(x) : md(x)) : '';
  const shortParts = /(\d{1,2}月\d{1,2}日(?:起| \d\d:\d\d)?|\d\d:\d\d|\d[\d,.]*(?:[ \u00a0]*(?:分钟|小时|天|个))?|增删|空档|新装|卸载|亮屏|解锁)/g;
  const wrapShort = text => text.split(shortParts).map((part, i) => i % 2 ? `<span class="ph-keep">${esc(part)}</span>` : esc(part)).join('');

  // —— 访客看不到的值（这页现在没有；以后接口真给了就照全站写法原位占位挂签，两版都挂）——
  const locked = (m, viewer) => !!m && (m.hidden || m.hidden_block || m.value?.hidden || viewer !== 'owner' && (m.visibility === 'owner' || m.public === 'owner') && m.value == null);
  const hiddenHtml = what => `${DOTS}${U.visitorHiddenTag(what, '', 'owner')}`;

  // —— 数据：sections 里各项按 id 取（后台加的 step_coverage、package_coverage 不管落在哪一节都认）——
  function read(raw) {
    const sections = Array.isArray(raw.sections) ? raw.sections : [];
    const all = sections.flatMap(s => Array.isArray(s?.metrics) ? s.metrics : []);
    const metric = id => all.find(m => m?.id === id) || null;
    const sec = id => sections.find(s => s?.id === id) || null;
    const daily = metric('daily_exact') || metric('daily');
    const notes = [...new Set([sec('accumulated')?.note, sec('daily')?.note, sec('packages')?.note, sec('more-data')?.note, metric('usage_total')?.scope, metric('location_gap')?.note && `当天定位最长间隔：${metric('location_gap').note}`].filter(t => typeof t === 'string' && t.trim()).map(isoText))];
    return {
      usage: { total: metric('usage_total'), cover: metric('usage_coverage') },
      location: { total: metric('location_total'), cover: metric('location_coverage') },
      steps: { total: metric('step_buckets'), cover: metric('step_coverage'), days: metric('step_days'), last: metric('steps_new_exact') || metric('steps_new') },
      packages: { total: metric('package_snapshots'), cover: metric('package_coverage'), days: metric('package_days'), now: metric('packages'), system: metric('packages_system') },
      gap: metric('location_gap'), gapDay: metric('location_day'), runGap: metric('run_gap_exact'),
      daily: daily && daily.section ? { section: daily.section, count: daily.count, at: daily.at } : null,
      notes,
    };
  }
  function adapt(raw) {
    const sections = Array.isArray(raw.sections) ? raw.sections : [];
    const dropped = sections.filter(s => DROP.has(s?.id));
    return {
      ...raw, headline: null, artifacts: null, phoneView: read(raw),   // 代表数“定位新到”跟实况重复，关键数字那一条不再放
      sections: sections.filter(s => !DROP.has(s?.id)),
      hidden: finite(raw.hidden) ? Math.max(0, raw.hidden - dropped.reduce((n, s) => n + (finite(s.hidden) ? s.hidden : 0), 0)) : raw.hidden,
    };
  }

  // —— 小图标（描边，正绿）——
  const ICON = {
    book: '<path d="M3 5.5c3-1.4 6-1.4 9 .6 3-2 6-2 9-.6V19c-3-1.4-6-1.4-9 .6-3-2-6-2-9-.6Z"/><path d="M12 6.1v13.5"/>',
    usage: '<rect x="6.5" y="3" width="11" height="18" rx="2.2"/>',
    location: '<path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.8" r="2.3"/>',
    steps: '<ellipse cx="8" cy="13.5" rx="2.6" ry="4.2"/><ellipse cx="16" cy="9.5" rx="2.6" ry="4.2"/><path d="M7 19.6h2.2M15 15.6h2.2"/>',
    packages: '<path d="m12 3 9 4.6-9 4.6-9-4.6Z"/><path d="m3 12 9 4.6 9-4.6"/><path d="m3 16.4 9 4.6 9-4.6"/>',
    go: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>',
    network: '<path d="M4 20.5h16"/><path d="M6.5 17v-4M10.5 17V8M14.5 17v-6M18.5 17V5"/>',
    apps: '<rect x="3" y="4" width="18" height="12.5" rx="1.8"/><path d="M9 20.5h6M12 16.5v4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  };
  const icon = (name, cls = 'ph-ico') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[name]}</svg>`;

  // —— 左边四种记录：总数、从哪天起、记了几天 ——
  const coverOf = c => { const v = c?.value && typeof c.value === 'object' ? c.value : null; return v && (md(v.first) || finite(v.days)) ? v : null; };
  // 用机、定位那两项后台另给一句“天天都有／缺 N 天”，照它写
  const tailOf = v => typeof v?.text === 'string' && v.text.includes('；') ? v.text.split('；').pop().trim() : '';
  const stale = m => !!m && (m.stale === true || m.q === 'stale' || (finite(m.stale_after) && zoned(m.value) && Date.now() - Date.parse(m.value) > m.stale_after * 1000));
  function kindRow(key, name, unit, m, subParts, viewer, extra = '') {
    if (!m) return '';
    const n = locked(m, viewer) ? hiddenHtml(`${name}的条数`) : finite(m.value) ? `<b>${esc(int(m.value))}</b><small>${esc(unit)}</small>` : '';
    if (!n) return '';
    const sub = subParts.filter(Boolean).map(wrapShort).join(' · ');
    return `<li class="ph-kind" data-kind="${key}">${icon(key)}<div class="ph-kind__main"><p class="ph-kind__top"><b class="ph-kind__name">${esc(name)}</b><span class="ph-kind__n">${n}</span></p>${sub || extra ? `<p class="ph-kind__sub">${sub}${extra}</p>` : ''}</div></li>`;
  }
  function kindsHtml(v, viewer) {
    const since = c => [md(c?.first) && `${md(c.first)}起`, finite(c?.days) && `${int(c.days)} 天`];
    const uc = coverOf(v.usage.cover), lc = coverOf(v.location.cover), sc = coverOf(v.steps.cover), pc = coverOf(v.packages.cover);
    const last = v.steps.last, lastAt = zoned(last?.value) ? mdTime(last.value) : '';
    const old = lastAt && stale(last) ? `<span class="ph-stale" title="${esc(isoText(last.stale_text || last.gap || ''))}">过期</span>` : '';
    const stepDays = sc ? since(sc) : [finite(v.steps.days?.value) && `${int(v.steps.days.value)} 天有记录`];
    const pkgDays = pc ? since(pc) : [finite(v.packages.days?.value) && `${int(v.packages.days.value)} 天`];
    const now = v.packages.now, sys = v.packages.system;
    const installed = finite(now?.value) ? `现装 ${int(now.value)} 个软件${finite(sys?.value) ? `（系统自带 ${int(sys.value)}）` : ''}` : '';
    return [
      kindRow('usage', '用机记录', '条', v.usage.total, uc ? [...since(uc), tailOf(uc)] : [], viewer),
      kindRow('location', '定位点', '个', v.location.total, lc ? [...since(lc), tailOf(lc)] : [], viewer),
      kindRow('steps', '计步段', '段', v.steps.total, [...stepDays, lastAt && `最后一段 ${lastAt}`], viewer, old),
      kindRow('packages', '装机清单', '份', v.packages.total, [...pkgDays, installed], viewer),
    ].join('');
  }

  // —— 右边格子：每天一列，四行数＋“收到至”；底色深浅表示多少（按这一屏里这一行最多的那天比）——
  const ROWS = [['events', 'usage', '用机记录'], ['locations', 'location', '定位点'], ['step_buckets', 'steps', '计步段'], ['package_snapshots', 'packages', '装机清单']];
  function gridHtml(days, kinds) {
    if (!days.length) return '';
    const today = todayDay(), rows = ROWS.filter(([, k]) => kinds.includes(k));
    const head = `<span class="ph-rl ph-rl--head" aria-hidden="true"></span>${days.map(d => d.date === today ? `<span class="ph-d is-today">今天</span>` : `<span class="ph-d">${esc(dash(d.date))}</span>`).join('')}`;
    const body = rows.map(([field, key, name]) => {
      const vals = days.map(d => d[field]).filter(finite), max = Math.max(0, ...vals), min = Math.min(max, ...vals);
      const cells = days.map(d => {
        const n = d[field];
        if (d[`${field}_hidden`] || d.hidden) return `<span class="ph-c is-locked">${DOTS}</span>`;
        if (!finite(n)) return '<span class="ph-c is-none" title="这天没收到"></span>';
        // 这一屏里这一行最少的那天最浅、最多的最深
        const a = (max > min ? 0.05 + 0.3 * (n - min) / (max - min) : 0.14).toFixed(3);
        return `<span class="ph-c" style="--a:${a}" title="${esc(`${md(d.date)} ${name} ${int(n)}`)}">${esc(int(n))}</span>`;
      }).join('');
      return `<span class="ph-rl">${esc(name)}</span>${cells}`;
    }).join('');
    const through = days.map(d => { const z = zoned(d.through); return `<span class="ph-t">${z ? esc(z.day === d.date ? z.time : `${dash(z.day)} ${z.time}`) : ''}</span>`; }).join('');
    const at = days.findIndex(d => d.date === today);
    const ring = at >= 0 ? `<i class="ph-ring" style="grid-column:${at + 2};grid-row:2 / ${rows.length + 2}" aria-hidden="true"></i>` : '';
    return `<div class="ph-grid" style="--n:${days.length};--r:${rows.length}" role="table" aria-label="每天收到了什么">${head}${body}<span class="ph-rl ph-rl--t">收到至：</span>${through}${ring}</div>`;
  }

  // —— 每天的明细：项目详情里 daily_exact 指的那份逐项明细，一次取一页（后台一页最多 50 行），往前翻不够了再取下一页 ——
  const params = new URLSearchParams(location.search);
  const state = { key: '', rows: [], next: null, total: null, offset: 0, loading: false, failed: false };
  async function fetchPage(section, cursor) {
    const path = `projects/phone-collector/records${params.has('fixture') ? `-${encodeURIComponent(section)}` : ''}`;
    try {
      const r = await window.Live.get(path, cursor ? { section, cursor } : { section });
      return r?.data && Array.isArray(r.data.items) ? r.data : null;
    } catch { return null; }
  }
  const byDay = rows => { const seen = new Map(); for (const r of rows) if (r && /^\d{4}-\d\d-\d\d$/.test(r.date || '')) seen.set(r.date, r); return [...seen.values()].sort((a, b) => b.date.localeCompare(a.date)); };
  async function loadDays(daily) {
    const key = JSON.stringify([daily.section, daily.at, daily.count]);
    if (state.key === key) return;
    state.key = key; state.loading = true;
    const first = await fetchPage(daily.section);
    if (state.key !== key) return;
    state.loading = false;
    if (!first) { state.failed = !state.rows.length; draw(); return; }
    state.failed = false;
    state.rows = byDay(first.items); state.next = first.next || null; state.total = finite(first.total) ? first.total : null; state.at = first.at;
    state.offset = Math.min(state.offset, Math.max(0, state.rows.length - 1));
    draw();
  }
  // 往前翻：已取到的不够一屏就接着取下一页；取完了（没有 next）就停在有记录的第一天
  async function earlier() {
    if (state.loading) return;
    const want = state.offset + PAGE * 2;
    if (state.rows.length < want && state.next) {
      state.loading = true; draw();
      const key = state.key, page = await fetchPage(shown.v.daily.section, state.next);
      if (state.key !== key) return;
      state.loading = false;
      if (page) { state.rows = byDay([...state.rows, ...page.items]); state.next = page.next || null; if (finite(page.total)) state.total = page.total; }
    }
    state.offset = Math.min(state.offset + PAGE, Math.max(0, state.rows.length - PAGE));
    draw();
  }
  function later() { state.offset = Math.max(0, state.offset - PAGE); draw(); }
  const canEarlier = () => !state.loading && (state.offset + PAGE < state.rows.length || !!state.next);

  // —— 通栏卡：放在两栏卡片上面 ——
  let wide = null, shown = null;
  function draw() {
    if (!wide || !shown) return;
    const { v, viewer } = shown;
    const kinds = kindsHtml(v, viewer), kindKeys = [...kinds.matchAll(/data-kind="(\w+)"/g)].map(m => m[1]);
    const days = state.rows.slice(state.offset, state.offset + PAGE).reverse();   // 左旧右新，今天在最右
    // 窗口窄（≤1100 像素）：14 天拆成上下两排各 7 天，不横着滑、不挤
    const rowKeys = kindKeys.length ? kindKeys : ROWS.map(r => r[1]), half = Math.ceil(days.length / 2);
    const grid = window.matchMedia?.(NARROW).matches && days.length > 7 ? gridHtml(days.slice(0, half), rowKeys) + gridHtml(days.slice(half), rowKeys) : gridHtml(days, rowKeys);
    const gapDay = v.gapDay?.value?.date, gap = v.gap?.value?.text || (typeof v.gap?.text === 'string' ? v.gap.text : '');
    const gapText = gap && !locked(v.gap, viewer) ? `${gapDay ? gapDay === todayDay() ? '今天' : md(gapDay) : '当天'}定位最长隔了 ${gap}` : '';
    const cut = mdTime(v.daily?.at || state.at);   // daily_exact.at 是日记四类数据自己的截止时刻
    // ‹ 更早 往前翻 14 天，翻到有记录的第一天变灰；翻过以后右边出“更晚 ›”翻回来
    const nav = days.length ? `<div class="ph-nav"><button type="button" class="ph-earlier more"${canEarlier() ? '' : ' disabled'}><span class="ph-chev-l">‹</span>${state.loading ? '正在读…' : '更早'}</button>${state.offset > 0 ? `<button type="button" class="ph-later more">更晚 <span class="more__chev">›</span></button>` : ''}</div>` : '';
    const note = v.notes.length ? `<div class="ph-note" hidden>${v.notes.map(wrapShort).join('<br>')}</div>` : '';
    const open = wide.querySelector('.ph-note:not([hidden])');
    const empty = !days.length ? `<p class="ph-empty">${esc(state.failed ? '每天的记录暂时读不到' : state.loading ? '正在读每天的记录…' : '')}</p>` : '';
    wide.innerHTML = `<div class="ph-head">${icon('book', 'ph-ico ph-ico--title')}<b class="ph-title">日记本：每天收到了什么</b></div>
      <div class="ph-body">${kinds ? `<ul class="ph-kinds" style="--r:${kindKeys.length}">${kinds}</ul>` : ''}<div class="ph-days">${grid || empty}${nav}</div></div>
      <div class="ph-foot">${v.notes.length ? `<button type="button" class="ph-explain" aria-expanded="false">说明 <span class="more__chev">›</span></button>` : '<span></span>'}<span class="ph-gap">${wrapShort(gapText)}</span><span class="ph-cut">${cut ? esc(`截止 ${cut}`) : ''}</span></div>${note}`;
    if (open) { wide.querySelector('.ph-note').hidden = false; wide.querySelector('.ph-explain')?.setAttribute('aria-expanded', 'true'); }
    realign();
  }
  function diary(d, viewer, boardEl) {
    const v = d.phoneView;
    if (!v) { wide?.remove(); wide = null; return; }
    if (!wide) {
      wide = document.createElement('section');
      wide.className = 'pj-card glass ph-diary is-in'; wide.id = 'phone-diary';
      wide.addEventListener('click', e => {
        if (e.target.closest?.('.ph-earlier')) earlier();
        else if (e.target.closest?.('.ph-later')) later();
        else if (e.target.closest?.('.ph-explain')) {
          const btn = e.target.closest('.ph-explain'), note = wide.querySelector('.ph-note');
          if (note) { note.hidden = !note.hidden; btn.setAttribute('aria-expanded', String(!note.hidden)); realign(); }
        }
      });
    }
    if (wide.nextElementSibling !== boardEl || wide.parentNode !== boardEl.parentNode) boardEl.before(wide);
    shown = { v, viewer };
    draw();
    if (v.daily) loadDays(v.daily);
  }

  // —— 去实况里看：四行跳转，不写数（实况“手机”页按 #grp- 停在那一组）——
  function goHtml(v, viewer) {
    // 采集停得最久那次：都在今天写“16:07 到 16:28”；同一天但不是今天带上日期；跨天两头都带日期
    const r = v.runGap?.value, a = zoned(r?.start), z = zoned(r?.end), today = todayDay();
    const span = !a || !z || !a.time || !z.time ? '' : a.day === z.day ? `${a.day === today ? '' : `${md(r.start)} `}${a.time} 到 ${z.time}` : `${mdTime(r.start)} 到 ${mdTime(r.end)}`;
    const longest = span && !locked(v.runGap, viewer) ? `；采集停得最久那次 ${span}` : '';
    const rows = [
      ['packages', '收集情况', `电脑收集了没有、近 24 小时采集几次、最长多久没采集、近 30 天采集图、最近的空档${longest}`, '/live/phone/#grp-collect'],
      ['network', '流量', '今天和本月的移动流量、本月 Wi‑Fi、近 30 天每天流量', '/live/phone/#grp-network'],
      ['apps', '装了哪些应用', '应用清单、近 7 天更新、近 90 天新装和卸载', '/live/phone/#grp-apps'],
      ['clock', '今天怎么用的', '亮屏、解锁、用在哪类应用、几点在用', '/live/phone/#grp-usage'],
    ];
    return `<ul class="ph-go">${rows.map(([ic, name, sub, href]) => `<li><a href="${esc(href)}">${icon(ic)}<span class="ph-go__text"><b>${esc(name)}</b><small>${wrapShort(sub)}</small></span><span class="more__chev">›</span></a></li>`).join('')}</ul>`;
  }

  // 下排两张卡顶边、底边对齐（照图）：取一样高；说明展开、窗口变了、字体到了都重新量
  function align() {
    const a = document.querySelector('.pj-card[data-card="changes"]'), b = document.querySelector('.pj-card[data-card="phone-go"]');
    for (const c of [a, b]) if (c) c.style.minHeight = '';
    if (!a || !b || a.parentNode === b.parentNode || window.matchMedia?.(NARROW).matches) return;
    const h = Math.max(a.offsetHeight, b.offsetHeight);
    a.style.minHeight = b.style.minHeight = `${h}px`;
  }
  const realign = () => requestAnimationFrame(() => requestAnimationFrame(align));
  window.addEventListener('resize', realign);
  window.matchMedia?.(NARROW).addEventListener?.('change', draw);
  document.fonts?.ready?.then(realign);
  document.addEventListener('click', e => { if (e.target.closest?.('.pj-card[data-card="changes"] button, .pj-card[data-card="changes"] summary')) realign(); });

  function board(d, viewer, graphBlock, boardEl) {
    boardEl?.classList.add('pj-board--phone');
    diary(d, viewer, boardEl);
    const v = d.phoneView;
    if (!v) return [];
    const b = graphBlock('phone-go', '');
    b.group = 'phone-go';
    U.html(b.head, `${icon('go', 'ph-ico ph-ico--title')}<b>去实况里看</b>`, false);
    b.el.classList.add('ph-go-sec');
    U.html(b.viz, goHtml(v, viewer), false);
    realign();
    return [b];
  }
  // 卡放哪一栏：照图固定（左最近改动、右去实况里看）；出现别的卡时交回 page.js 按高度摆；窗口窄排成一栏
  const columns = keys => !keys.every(k => k in COLUMNS) ? null : window.matchMedia?.(NARROW).matches ? keys.map(() => 0) : keys.map(k => COLUMNS[k]);
  // 最近改动：先露 3 条，展开按钮写“全部 N 条”，左下“说明 ›”（照图）；共用的改动接口没有现成口径，说明这句是这页写的
  const changes = { shown: 3, step: (left, open, total) => !open && finite(total) ? `全部 ${int(total)} 条` : '',
    note: '这里是手机日记本这个项目的改动，按提交记，一条写一句改了什么（几次提交合成一条的写明几次），最新的在上。' };

  window.ProjectPages = Object.assign(window.ProjectPages || {}, { 'phone-collector': { adapt, board, columns, changes } });
})();
