// 账房先生（/live/project/?id=personal-finance）自己的几块；page.js 只在三处接进来：adapt 改这一页的数据、strip 加关键数字第一格、board 加卡。
// 本人 11-27 批准的样子：第一格“〈最近整月〉花了”；通栏“每月花多少、花在哪”（12 个整月堆叠柱＋本月一根虚线柱，点柱子看这个月）；
// 左下“钱现在大概多少”（三个大数、五行账户、长期分期、对账）；右下照旧“最近改动”（page.js 画）。原来“各部分新到哪天”“账上管着什么”“更多数据”三张卡不画。
// 来源不同、新到日子不一样的数，每个都写“截止 X月X日”。访客版同一套页面、同一份接口：后台给访客的金额是 null，这里在原位画“••••”（柱顶金额也是，本人 11-27 22:55；纵轴照旧不写数）；
// 三处挂全站同一个紫色“访客看不到”小签（本人版、访客版都挂）。
// 数在哪：项目详情 sections 里 id="spending" 那一节的 spending、headline 两项的 value；id="balance" 那一节的 balance 一项的 value（字段见单子）。
(() => {
  'use strict';
  const U = window.LiveUI, esc = U.esc;
  const DROP = new Set(['freshness', 'coverage', 'more-data', 'spending', 'balance']);   // 这页不按通用卡画的几节
  const DOTS = '<span class="fin-dots">••••</span>';

  // —— 数怎么写 ——
  const finite = n => typeof n === 'number' && Number.isFinite(n);
  const yuan = n => `${n < 0 ? '−' : ''}¥${Math.round(Math.abs(n)).toLocaleString('zh-CN')}`;
  // 金额：有数写数；访客那份是 null，画“••••”；本人那份没给数写“还没读到”这类全站说法
  const money = (n, viewer) => finite(n) ? esc(yuan(n)) : viewer === 'owner' ? `<span class="fin-miss">${esc(U.collectionText())}</span>` : DOTS;
  const kilo = n => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(Math.round(n));
  const ymd = s => /^(\d{4})-(\d\d)-(\d\d)/.exec(s || '');
  const md = s => { const m = ymd(s); return m ? `${+m[2]}月${+m[3]}日` : ''; };
  const cutoff = s => md(s) ? `截止 ${md(s)}` : '';
  const isMonth = s => /^\d{4}-\d\d$/.test(s || '');
  const monthNo = ym => +String(ym).slice(5, 7);
  const CN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  const pct = share => !finite(share) ? '' : share > 0 && share < 0.005 ? '<1%' : `${Math.round(Math.max(0, share) * 100)}%`;
  const nice = x => { const p = 10 ** Math.floor(Math.log10(x)), f = x / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p; };

  // —— 访客看不到：用全站那个紫色小签；访客版也挂（本人 11-27 05:43），说明里写清藏的是什么 ——
  const TAGS = {
    spend: ['每月花了多少钱的具体金额', '钱数只给本人看；柱子高低和各类占比访客照样看得到'],
    month: ['这个月各类花了多少钱', '钱数只给本人看；各类占比访客照样看得到'],
    balance: ['钱现在大概多少的具体金额', '余额和欠款只给本人看；账户名、截止日期和依据访客照样看得到'],
  };
  const tag = key => U.visitorHiddenTag(TAGS[key][0], TAGS[key][1], 'owner');

  // —— 类别颜色：彩色但柔和；同一类在每根柱子、图例、面板里一个颜色；“没分清”灰色、总在最上面 ——
  const ORDER = ['餐饮', '交通', '休闲娱乐', '旅行住宿', '购物', 'AI 订阅和海外', '医疗', '分期每月还的'];
  const COLOR = { 餐饮: '#f2a1a7', 交通: '#92b7ee', 休闲娱乐: '#b9a3ef', 旅行住宿: '#f4cf73', 购物: '#f2afd3', 'AI 订阅和海外': '#85d5bd', 医疗: '#8ed0e6', 分期每月还的: '#dcc2a2', 没分清: '#cccbd3' };
  const SPARE = ['#f0b98a', '#a8d08d', '#6fc2bd', '#c79fc8', '#a9b3c9', '#d9c38a', '#e6a28f', '#9bc7a6'];   // 后台新出的类（课程、房租水电……）按出现先后配
  const GAP = '这个月有一笔信用卡账单分期，对不上原来的几笔，暂时没法按类拆。';
  const GAP_COLOR = '#d9d8de';
  function palette(months) {
    const seen = [];
    for (const m of months) for (const c of m.categories || []) if (c?.name && !seen.includes(c.name)) seen.push(c.name);
    const rank = name => name === '没分清' ? 1e3 : ORDER.includes(name) ? ORDER.indexOf(name) : 100 + seen.indexOf(name);
    const names = seen.sort((a, b) => rank(a) - rank(b));
    let spare = 0;
    const color = Object.fromEntries(names.map(name => [name, COLOR[name] || SPARE[spare++ % SPARE.length]]));
    return { names, color, rank };
  }

  // —— 数据：取出这页的三样（消费在 sections 的 spending 一节；余额在详情顶层 balance，没有再找 sections 的 balance 一节），再去掉不按通用卡画的几节 ——
  function metricValue(sections, sectionId, metricId, test) {
    const metrics = sections.find(s => s?.id === sectionId)?.metrics || [];
    const m = metrics.find(x => x?.id === metricId) || (test ? metrics.find(x => test(x?.value)) : null);
    return m?.value && typeof m.value === 'object' ? m.value : null;
  }
  const isBalance = v => !!v && typeof v === 'object' && Array.isArray(v.accounts);
  function adapt(raw) {
    const sections = Array.isArray(raw.sections) ? raw.sections : [];
    const finance = {
      spending: metricValue(sections, 'spending', 'spending', v => Array.isArray(v?.months)),
      headline: metricValue(sections, 'spending', 'headline'),
      balance: isBalance(raw.balance) ? raw.balance : metricValue(sections, 'balance', 'balance', isBalance),
    };
    const dropped = sections.filter(s => DROP.has(s?.id));
    return {
      ...raw, headline: null, finance,   // 首格由 strip 画；data.headline 指向的那项在 spending 一节里
      links: (raw.links || []).filter(l => l?.id !== 'spending'),   // “消费记录在我的说明书 ›”不要了（本人批准的图）
      sections: sections.filter(s => !DROP.has(s?.id)),
      hidden: finite(raw.hidden) ? Math.max(0, raw.hidden - dropped.reduce((n, s) => n + (finite(s.hidden) ? s.hidden : 0), 0)) : raw.hidden,
    };
  }

  // —— 关键数字第一格：“10月花了 ¥14,722”（整月的数，截止日期写在消费卡底，不在这里重复）——
  function strip(d, viewer) {
    const h = d.finance?.headline, sp = d.finance?.spending, last = Array.isArray(sp?.months) ? sp.months.filter(m => isMonth(m?.month)).at(-1) : null;
    if (!h && !last) return '';
    const label = h?.label || `${monthNo(last.month)}月花了`;
    const amount = finite(h?.amount) ? h.amount : h ? null : last.total;
    const v = finite(amount) ? `<b>${esc(yuan(amount))}</b>` : money(null, viewer);
    return `<div class="pj-cell fin-cell" title="${esc(label)}"><span class="pj-cell__k">${esc(label)}${tag('spend')}</span><span class="pj-cell__v">${v}</span></div>`;
  }

  // —— 本月各处新到哪天：同一天、同一依据的合成一句；本月一笔都没算进去的那处（through 早于本月 1 号）照后台那句原样写 ——
  function sourceLines(cur) {
    const start = `${cur.month}-01`, groups = [];
    for (const s of cur.sources || []) {
      if (!s?.name) continue;
      const early = !ymd(s.through) || s.through < start, key = early ? `early|${s.basis || ''}` : `${s.through}|${s.basis || ''}`;
      const g = groups.find(x => x.key === key);
      if (g) g.names.push(s.name); else groups.push({ key, early, names: [s.name], through: s.through, basis: s.basis });
    }
    return groups.map(g => g.early ? `${g.names.join('、')}${g.basis || `${cutoff(g.through)}，本月还没算进去`}` : `${g.names.join('、')}${cutoff(g.through)}${!g.basis ? '' : /[（(]/.test(g.basis) ? `，${g.basis}` : `（${g.basis}）`}`);   // 依据里自带括号的用逗号接，不套两层括号
  }

  // —— 卡名下两行笔数（本人 11-27 14:54 照图）：近 13 个月、有记录以来；后台 purchase_counts 两组 {from, through, count, count_at_least_100}，哪组缺就不写那行 ——
  const ym = s => { const m = ymd(s); return m ? `${m[1]}年${+m[2]}月起` : ''; };
  function countLines(pc) {
    const ok = g => g && finite(g.count) && finite(g.count_at_least_100);
    const n = x => Math.round(x).toLocaleString('zh-CN');
    const r = pc?.recent_13_months, all = pc?.since_first_purchase, lines = [];
    if (ok(r)) lines.push(`近 13 个月 ${n(r.count)} 笔消费，其中 100 元以上 ${n(r.count_at_least_100)} 笔${cutoff(r.through) ? ` · ${cutoff(r.through)}` : ''}`);
    if (ok(all)) lines.push(`有记录以来 ${n(all.count)} 笔消费，其中 100 元以上 ${n(all.count_at_least_100)} 笔${ym(all.from) ? `（${ym(all.from)}）` : ''}`);
    return lines.map(t => `<p class="fin-count">${esc(t)}</p>`).join('');
  }

  // —— 每月花多少、花在哪：一张通栏卡，放在两栏卡片上面 ——
  let wide = null, drawn = '', picked = null, shown = null;
  function spending(d, viewer, board) {
    const sp = d.finance?.spending;
    const months = Array.isArray(sp?.months) ? sp.months.filter(m => isMonth(m?.month)) : [];
    if (!months.length && !isMonth(sp?.current?.month)) { wide?.remove(); wide = null; drawn = ''; return; }
    if (!wide) {
      wide = document.createElement('section');
      wide.className = 'pj-card glass fin-spend is-in'; wide.id = 'finance-spending';
      wide.addEventListener('click', e => { const bar = e.target.closest?.('.fin-bar'); if (bar && shown) { picked = bar.dataset.month; pick(); } });
    }
    if (wide.nextElementSibling !== board || wide.parentNode !== board.parentNode) board.before(wide);
    const sig = JSON.stringify([sp, viewer]);
    if (sig === drawn) return;
    drawn = sig;
    const cur = isMonth(sp.current?.month) ? sp.current : null;
    const all = cur ? [...months, cur] : months, pal = palette(all);
    shown = { sp, months, cur, viewer, pal };
    if (!all.some(m => m.month === picked)) picked = months.at(-1)?.month || cur?.month;   // 默认选最近整月
    const legend = pal.names.map(name => `<li><i class="fin-chip" style="--c:${pal.color[name]}"></i>${esc(name)}</li>`).join('');
    const foot = [sp.complete_through && `整月截止 ${md(sp.complete_through)}，四处账单都齐`, cur && sourceLines(cur).length && `${monthNo(cur.month)}月：${sourceLines(cur).join('；')}`].filter(Boolean).map(esc).join(' · ');
    const counts = countLines(sp.purchase_counts);
    wide.innerHTML = `<div class="fin-head${counts ? ' has-counts' : ''}"><div class="fin-head__main"><b class="fin-title">每月花多少、花在哪</b>${counts}</div>${legend ? `<ul class="fin-legend">${legend}</ul>` : ''}</div>
      <div class="fin-body">${chart(months, cur, viewer, pal)}<div class="fin-panel" aria-live="polite"></div></div>${foot ? `<p class="fin-foot">${foot}</p>` : ''}`;
    pick();
  }
  function chart(months, cur, viewer, pal) {
    const all = cur ? [...months, cur] : months;
    // 柱高用后台给的相对高度（访客那份也有）；没给就按金额自己比。最高那根占图高的 88%，顶上留出写金额的地方。
    const maxTotal = Math.max(0, ...all.map(m => finite(m.total) ? m.total : 0));
    const rel = m => finite(m.height) ? Math.max(0, m.height) : maxTotal > 0 && finite(m.total) ? Math.max(0, m.total) / maxTotal : 0;
    const maxRel = Math.max(1e-9, ...all.map(rel)), FILL = 0.88, frac = m => rel(m) / maxRel * FILL;
    // 纵坐标只在有金额时画（本人版）：图顶对应的钱 = 某个月的钱 ÷ 它占的图高
    const ref = all.find(m => finite(m.total) && m.total > 0 && rel(m) > 0);
    const top = ref ? ref.total / frac(ref) : 0, step = top ? nice(top / 10) : 0, ticks = [];
    if (step) for (let v = 0; v <= top + 1e-6; v += step) ticks.push(v);
    const lines = step ? ticks.map(v => v / top) : [1, 2, 3, 4, 5, 6, 7, 8].map(i => i / 8);
    const yAxis = `<div class="fin-y" aria-hidden="true">${step ? ticks.map(v => `<span style="--y:${(v / top * 100).toFixed(2)}%">${v ? kilo(v) : '0'}</span>`).join('') : ''}</div>`;
    const grid = `<div class="fin-grid" aria-hidden="true">${lines.filter(y => y > 0).map(y => `<i style="--y:${(y * 100).toFixed(2)}%"></i>`).join('')}</div>`;
    const bar = (m, isCur, i) => {
      const cats = (m.categories || []).filter(c => c?.name).map(c => {
        const share = finite(c.share) ? c.share : finite(c.amount) && finite(m.total) && m.total > 0 ? c.amount / m.total : 0;
        return { name: c.name, w: finite(c.amount) && c.amount < 0 ? 0 : Math.max(0, share) };   // 万一出现负数：按 0 画，面板里写原数
      }).filter(c => c.w > 0).sort((a, b) => pal.rank(a.name) - pal.rank(b.name));
      const sum = cats.reduce((n, c) => n + c.w, 0), gap = !cats.length && m.category_gap;   // 没法按类拆的月：一整根浅灰
      const segs = gap ? `<i style="--c:${GAP_COLOR};--s:100%" title="${esc(GAP)}"></i>` : cats.map(c => `<i style="--c:${pal.color[c.name]};--s:${(c.w / sum * 100).toFixed(2)}%" title="${esc(c.name)}"></i>`).join('');
      // 横轴写“11月”，第一根和每年 1 月下面再写年份（写“2025-11”在 900 宽一根柱子放不下，挤成一串）；本月各处截止哪天写在卡底和点开的面板里
      const label = isCur ? `<span>${monthNo(m.month)}月</span><span>未过完</span>` : `${monthNo(m.month)}月${!i || monthNo(m.month) === 1 ? `<span class="fin-bar__year">${esc(m.month.slice(0, 4))}</span>` : ''}`;
      const said = isCur ? `${monthNo(m.month)}月到目前` : m.month;
      const amount = finite(m.total) ? `，${yuan(m.total)}` : '';
      return `<button type="button" class="fin-bar${isCur ? ' is-current' : ''}${gap ? ' is-gap' : ''}" data-month="${esc(m.month)}" aria-pressed="false" aria-label="${esc(said + amount)}">
        <span class="fin-bar__plot">${isCur ? '' : finite(m.total) ? `<span class="fin-bar__top">${kilo(m.total)}</span>` : viewer !== 'owner' ? `<span class="fin-bar__top">${DOTS}</span>` : ''}<span class="fin-bar__stack" style="--h:${(frac(m) * 100).toFixed(2)}%">${segs}</span></span>
        <span class="fin-bar__x">${label}</span></button>`;
    };
    return `<div class="fin-chart${step ? '' : ' is-bare'}">${yAxis}<div class="fin-bars" style="--n:${all.length}">${grid}${months.map((m, i) => bar(m, false, i)).join('')}${cur ? bar(cur, true) : ''}</div></div>`;
  }
  // 选中一根：描边、右边面板换成这个月
  function pick() {
    if (!wide || !shown) return;
    const { months, cur, viewer, pal } = shown;
    for (const b of wide.querySelectorAll('.fin-bar')) b.setAttribute('aria-pressed', String(b.dataset.month === picked));
    const isCur = cur && cur.month === picked, m = isCur ? cur : months.find(x => x.month === picked);
    const panel = wide.querySelector('.fin-panel');
    if (panel) panel.innerHTML = m ? panelHtml(m, isCur, viewer, pal, cur || months.at(-1)) : '';
  }
  function panelHtml(m, isCur, viewer, pal, latest) {
    const sameYear = String(latest?.month || '').slice(0, 4) === m.month.slice(0, 4);
    const name = `${sameYear ? `${monthNo(m.month)} 月` : `${m.month.slice(0, 4)}年${monthNo(m.month)}月`}${isCur ? '到目前' : ''}`;
    const sources = isCur ? sourceLines(m) : [];
    const cats = (m.categories || []).filter(c => c?.name).slice().sort((a, b) => (a.name === '没分清') - (b.name === '没分清')
      || (finite(b.share) ? b.share : finite(b.amount) ? b.amount : 0) - (finite(a.share) ? a.share : finite(a.amount) ? a.amount : 0));
    const rows = cats.map(c => `<li><i class="fin-chip" style="--c:${pal.color[c.name] || '#cccbd3'}"></i><span class="fin-row__name">${esc(c.name)}</span><span class="fin-row__amt">${money(c.amount, viewer)}</span><span class="fin-row__pct">${pct(finite(c.share) ? c.share : finite(c.amount) && finite(m.total) && m.total > 0 ? c.amount / m.total : null)}</span></li>`).join('');
    // 比前 3 个月：后台给了 top 才写（前面不够 3 个整月可比时 delta、top 都是 null）；访客那份 delta 是 null，金额画“••••”
    const v = m.vs_prev3, way = { more: 1, less: -1, same: 0 }[v?.direction], dir = way ?? (finite(v?.delta) ? Math.sign(v.delta) : undefined);   // 多还是少照后台的 direction（本人、访客都给），没给再看 delta 的正负
    const top = v?.top ? `<b class="fin-em">${esc(v.top)}</b>` : '';
    const delta = finite(v?.delta) ? `<b class="fin-em">${esc(yuan(Math.abs(v.delta)))}</b>` : `<b class="fin-em">${DOTS}</b>`;
    // 不够 3 个整月可比时 direction、delta 都是 null，不写这行；top 是 null 时只写前半句
    const cmp = isCur || dir === undefined ? ''
      : dir === 1 ? `比前 3 个月平均多 ${delta}${top ? `，主要多在 ${top}` : ''}。`
      : dir === -1 ? `比前 3 个月平均少 ${delta}${top ? `，主要少在 ${top}` : ''}。`
      : `和前 3 个月平均差不多${top ? `，变化最大的是 ${top}` : ''}。`;
    const unsure = m.unsure && finite(m.unsure.count) && m.unsure.count > 0 ? `另有 ${m.unsure.count} 笔 ${money(m.unsure.amount, viewer)} 认不清是不是重复，没算进去。` : '';
    return `${sources.length ? `<ul class="fin-src">${sources.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      <p class="fin-panel__head"><span class="fin-panel__month">${esc(name)}</span><span class="fin-panel__total">${money(m.total, viewer)}</span>${tag('month')}</p>
      ${rows ? `<ul class="fin-rows">${rows}</ul>` : `<p class="fin-empty">${m.category_gap ? GAP : isCur ? '这个月还没有算进去的账。' : '这个月没有记到账。'}</p>`}
      ${cmp ? `<p class="fin-cmp">${cmp}</p>` : ''}${unsure ? `<p class="fin-unsure">${unsure}</p>` : ''}`;
  }

  // —— 钱现在大概多少：左下一张卡（page.js 的卡片骨架，和“最近改动”两栏摆齐）——
  function balanceHtml(b, viewer) {
    if (!b) return `<p class="pj-note">${esc(U.collectionText())}</p>`;
    const accounts = (Array.isArray(b.accounts) ? b.accounts : []).filter(a => a?.name);
    const big = [['能用的', b.usable], ['欠着的', b.owing], ['扣完还剩', b.remaining]]
      .map(([k, n]) => `<div><span>${k}</span><b><small>约</small>${money(n, viewer)}</b></div>`).join('');
    const asOf = (at, basis) => !md(at) ? '' : basis
      ? `<button type="button" class="fin-asof" aria-expanded="false">截止 ${md(at)}<span class="fin-tip" role="tooltip">依据：${esc(basis)}</span></button>`
      : `<span class="fin-asof is-plain">截止 ${md(at)}</span>`;
    const rows = accounts.map(a => `<li><span class="fin-acct__name">${esc(a.name)}</span>${asOf(a.as_of, a.basis)}${a.flag ? `<span class="fin-flag">${esc(a.flag)}</span>` : ''}<span class="fin-acct__amt">${money(a.amount, viewer)}</span></li>`).join('');
    // 长期分期：同名的几笔合成一项（“信用卡两笔”，剩的、每月的相加，到哪个月取最晚的），一项一行；各项截止同一天就在标题后写一次，不同就各写各的
    const groups = [];
    for (const x of Array.isArray(b.long_term) ? b.long_term : []) {
      if (!x?.name) continue;
      const g = groups.find(y => y.name === x.name);
      if (g) g.items.push(x); else groups.push({ name: x.name, items: [x] });
    }
    const sum = (items, key) => items.every(x => finite(x[key])) ? items.reduce((n, x) => n + x[key], 0) : null;
    const earliest = items => items.map(x => x.as_of).filter(md).sort()[0] || '';
    const days = groups.map(g => earliest(g.items)), sameDay = days.length > 1 && days.every(t => t && t === days[0]);
    const long = groups.map((g, i) => {
      const n = g.items.length, ends = g.items.map(x => typeof x.ends === 'string' && x.ends ? x.ends : null);
      const last = ends.every(Boolean) ? ends.slice().sort().at(-1) : null, differ = last && new Set(ends).size > 1;
      const to = last ? ` ${differ ? '最晚到' : '到'} ${esc(last)}` : viewer === 'owner' ? '' : ` 到 ${DOTS}`;
      const name = n > 1 ? `${g.name}${n === 2 ? '两' : n <= 10 ? CN[n] : n}笔` : g.name;
      return `<span class="fin-long__item"><b>${esc(name)}</b> 剩 ${money(sum(g.items, 'remaining'), viewer)} 每月 ${money(sum(g.items, 'monthly'), viewer)}${to}${!sameDay && days[i] ? `<small>${esc(cutoff(days[i]))}</small>` : ''}</span>`;
    }).join('');
    const check = b.last_check && md(b.last_check.date)
      ? `上次对账（${md(b.last_check.date)}）：${(b.last_check.diffs || []).filter(x => x?.name).map(x => `${esc(x.name)}差 ${money(x.amount, viewer)}`).join('、') || '各账户都对得上'}`
      : '对账：12月更新个人项目时第一次逐个账户对，以后每月一次';
    const n = accounts.length;
    return `<div class="fin-big">${big}</div>
      ${n ? `<p class="fin-sub">${n <= 10 ? CN[n] : n}行加起来；各行截止的日子不一样，写在每行</p><ul class="fin-accts">${rows}</ul>` : ''}
      ${long ? `<p class="fin-long"><span class="fin-long__k">长期分期（不算进欠着的）：${sameDay ? `<small>${esc(cutoff(days[0]))}</small>` : ''}</span>${long}</p>` : ''}
      <p class="fin-check">${check}</p>`;
  }
  // 截止日期：鼠标悬停看依据；手机上点一下打开、再点或点别处收起
  document.addEventListener('click', e => {
    const hit = e.target.closest?.('button.fin-asof');
    for (const el of document.querySelectorAll('button.fin-asof.is-open')) if (el !== hit) { el.classList.remove('is-open'); el.setAttribute('aria-expanded', 'false'); }
    if (hit) { const open = !hit.classList.contains('is-open'); hit.classList.toggle('is-open', open); hit.setAttribute('aria-expanded', String(open)); }
  });

  function board(d, viewer, graphBlock, boardEl) {
    boardEl?.classList.add('pj-board--finance');
    spending(d, viewer, boardEl);
    const b = graphBlock('finance-balance', '钱现在大概多少');
    b.group = 'finance-balance';
    // 小签直接插在卡名后面：graphBlock 每次写的卡名不变，就不会再去动它
    if (!b.head.querySelector('.live-mark')) b.head.insertAdjacentHTML('beforeend', tag('balance'));
    U.html(b.viz, balanceHtml(d.finance?.balance, viewer), false);
    return [b];
  }

  window.ProjectPages = Object.assign(window.ProjectPages || {}, { 'personal-finance': { adapt, strip, board } });
})();
