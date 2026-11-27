// 我的说明书（/live/project/?id=daily-preferences）自己的几块；page.js 只在四处接进来：adapt 改这一页的数据、strip 加关键数字第一格、board 加卡、columns 定卡放哪一栏。
// 本人 11-27 定的样子：第一格“AI 共用的主题卡”；左栏“整理成主题卡的认识”（六类、明细、协作约定三条对外说法）＋最近改动（page.js 画），
// 右栏“最近改过的 5 张”（四个小读数、月度总更新进度条、五行）＋“材料和依据”。原来“新不新”“最近产物”“更多数据”“材料攒了多少”“根据什么”不画。
// 访客版同一套页面、同一份接口：能点进去的条目外面不挂签；本人版在访客看不到原文的类名旁挂全站同一个紫色“访客看不到”。
// 每个数、每个“截止／更新”都照接口给的字段写，字段没给的那块不画（本人 11-27 14:41 禁令：不显示没人维护的标识）。
// 数在哪：项目详情顶层 manual，见 read。
(() => {
  'use strict';
  const U = window.LiveUI, esc = U.esc;
  const DROP = new Set(['understanding', 'freshness', 'basis', 'more-data', 'materials']);   // 这页不按通用卡画的几节
  const HIDDEN = new Set(['group-0', 'group-1', 'group-2', 'group-3', 'group-5']);   // 访客看不到认识原文的五类（资料速查访客能看原文）
  const TITLED = new Set(['group-0', 'group-4']);   // 最近改过的几张里，访客也看得到标题的两类
  const COLUMNS = { 'manual-groups': 0, changes: 0, 'manual-recent': 1, 'manual-materials': 1 };
  const RULES = '/rules/', FINANCE = '/live/project/?id=personal-finance';
  // 后台两项口径只给了一个内部代号，换成人话（和 page.js 的 SCOPE_WORDS 同一句）
  const SCOPE_WORDS = { 现行主题卡: '只算现在在用的认识，退役的旧认识不算', 现有记录: '按库里现在留着的记录算' };

  // —— 数怎么写 ——
  const finite = n => typeof n === 'number' && Number.isFinite(n);
  const int = n => Math.round(n).toLocaleString('zh-CN');
  const zoned = at => {
    if (typeof at !== 'string' || !/^\d{4}-\d\d-\d\d/.test(at)) return null;
    if (/^\d{4}-\d\d-\d\d$/.test(at)) return { y: at.slice(0, 4), m: +at.slice(5, 7), d: +at.slice(8, 10), time: '' };
    const t = Date.parse(/(?:Z|[+-]\d\d:\d\d)$/.test(at) ? at : `${at}+08:00`);
    if (!Number.isFinite(t)) return null;
    const f = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(t)).map(p => [p.type, p.value]));
    return { y: f.year, m: +f.month, d: +f.day, time: `${f.hour}:${f.minute}` };
  };
  const md = at => { const z = zoned(at); return z ? `${z.m}月${z.d}日` : ''; };
  const mdTime = at => { const z = zoned(at); return z ? `${z.m}月${z.d}日${z.time ? ` ${z.time}` : ''}` : ''; };
  const dash = at => { const z = zoned(at); return z ? `${String(z.m).padStart(2, '0')}-${String(z.d).padStart(2, '0')}${z.time ? ` ${z.time}` : ''}` : ''; };
  const cutoff = at => md(at) ? `截止 ${md(at)}` : '';
  const dayMs = at => { const z = zoned(at); return z ? Date.UTC(+z.y, z.m - 1, z.d) : NaN; };
  const today = () => { const z = zoned(new Date().toISOString()); return Date.UTC(+z.y, z.m - 1, z.d); };
  const wan = n => n >= 1e4 ? `约 <b>${esc(String(+(n / 1e4).toFixed(1)))}</b> 万条` : `<b>${esc(int(n))}</b> 条`;
  const words = v => typeof v === 'string' ? SCOPE_WORDS[v.trim()] || v : '';
  const records = section => `/live/records/?project=daily-preferences&section=${encodeURIComponent(section)}`;

  // —— 数据：项目详情顶层 manual（后台 11-27 交的，本人版、访客版同结构）——
  // cards{count,through}；groups[{section,label,count,updated}]；recent{latest_at,context_at,updated7,monthly{last,next},items[{section,label,title,at,href,record_id}]}；
  // conventions[三句]；materials{records,providers,through,evidence,statements,basis_through}。各卡“说明”里的口径照旧取 sections 里的那几句。
  function read(raw) {
    const sections = Array.isArray(raw.sections) ? raw.sections : [];
    const sec = id => sections.find(s => s?.id === id) || null;
    const metric = id => sections.flatMap(s => Array.isArray(s?.metrics) ? s.metrics : []).find(m => m?.id === id) || null;
    const mx = raw.manual && typeof raw.manual === 'object' ? raw.manual : {};
    const cards = mx.cards && finite(mx.cards.count) ? mx.cards : null;
    const groups = (Array.isArray(mx.groups) ? mx.groups : []).filter(g => /^group-[0-5]$/.test(g?.section || ''));
    const r = mx.recent && typeof mx.recent === 'object' ? mx.recent : {}, updated7 = metric('updated7');
    const recent = {
      latest: r.latest_at, context: r.context_at, updated7: r.updated7, monthly: r.monthly && (r.monthly.last || r.monthly.next) ? r.monthly : null,
      items: (Array.isArray(r.items) ? r.items : []).filter(it => it?.section && it.at),
      notes: [...new Set([sec('freshness')?.about, sec('freshness')?.note, metric('latest')?.scope, words(updated7?.scope) && `近 7 天整理：${words(updated7.scope)}`].filter(Boolean))],
    };
    const m0 = mx.materials && typeof mx.materials === 'object' ? mx.materials : {}, prov = metric('providers');
    const materials = {
      records: m0.records, recordsAt: m0.through, providers: m0.providers, providersAt: m0.through,
      evidence: m0.evidence, evidenceAt: m0.basis_through, statements: m0.statements, statementsAt: m0.basis_through,
      notes: [...new Set([sec('materials')?.about, sec('materials')?.note, metric('records')?.scope, words(prov?.scope) && `来源种数：${words(prov.scope)}`, sec('basis')?.about, sec('basis')?.note, metric('evidence')?.scope, metric('statements_used')?.scope].filter(Boolean))],
    };
    const und = sec('understanding'), cog = metric('cognitions');
    const groupNotes = [und?.about, cards && '一张主题卡是 AI 对本人某一方面的整理，下面按类列出；整理时用到的原始资料和本人原话另算，见“材料和依据”。',
      words(cog?.scope), typeof und?.note === 'string' && und.note.replace('资料速查只给标题，金额、测量值和秘密不进入页面。', '资料速查明细会显示已记录的数值和单位。')].filter(Boolean);
    // 三条对外说法：两版都挂“对外换了说法”（照图）
    const conventions = { items: (Array.isArray(mx.conventions) ? mx.conventions : []).filter(x => typeof x === 'string' && x.trim()), rewritten: true };
    return { cards, groups, groupNotes, recent, materials, conventions };
  }
  function adapt(raw) {
    const sections = Array.isArray(raw.sections) ? raw.sections : [];
    const dropped = sections.filter(s => DROP.has(s?.id));
    return {
      ...raw, headline: null, artifacts: null, manualView: read(raw),   // 首格由 strip 画；“最近产物”整块撤掉
      sections: sections.filter(s => !DROP.has(s?.id)),
      hidden: finite(raw.hidden) ? Math.max(0, raw.hidden - dropped.reduce((n, s) => n + (finite(s.hidden) ? s.hidden : 0), 0)) : raw.hidden,
    };
  }

  // —— 关键数字第一格：“AI 共用的主题卡 95 张 · 截止 X月X日” ——
  function strip(d) {
    const c = d.manualView?.cards;
    if (!c || !finite(c.count)) return '';
    const cut = cutoff(c.through);
    return `<div class="pj-cell" title="AI 共用的主题卡 ${esc(int(c.count))} 张"><span class="pj-cell__k">AI 共用的主题卡</span><span class="pj-cell__v"><b>${esc(int(c.count))}</b><small>张</small></span>${cut ? `<small class="pj-cell__sub">${esc(cut)}</small>` : ''}</div>`;
  }

  // —— 卡头：卡名（＋一句）和右上“说明 ›”；说明点开在卡名下面 ——
  function head(b, title, sub, notes) {
    const explain = notes.length ? `<button type="button" class="mn-explain" aria-expanded="false">说明 <span class="more__chev">›</span></button>` : '';
    U.html(b.head, `<b>${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}${explain}`, false);
    b.el.classList.add('mn-sec');
    b.el.classList.toggle('mn-viewer-owner', viewing === 'owner'); b.el.classList.toggle('mn-viewer-public', viewing !== 'owner');
    return notes.length ? `<div class="mn-note" hidden>${notes.map(esc).join('<br>')}</div>` : '';
  }
  // 说明：点一下打开、再点收起（每张卡自己的）
  document.addEventListener('click', e => {
    const btn = e.target.closest?.('.mn-explain');
    if (!btn) return;
    const note = btn.closest('.pj-sec')?.querySelector('.mn-note');
    if (!note) return;
    note.hidden = !note.hidden;
    btn.setAttribute('aria-expanded', String(!note.hidden));
  });

  // —— 左栏大卡：整理成主题卡的认识（六类） ——
  function groupsHtml(v, viewer) {
    const c = v.conventions;
    const conv = c.items.length ? `<div class="mn-conv">${c.rewritten ? U.visitorRewrittenTag('这几条约定', '', 'public') : '<span></span>'}<ul>${c.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : '';
    return `<ul class="mn-groups">${v.groups.map(g => {
      const tag = viewer === 'owner' && HIDDEN.has(g.section) ? U.visitorHiddenTag(`这一类的认识原文，只看到${g.count > 2 ? '一句说明' : '每条的标题'}`, '', viewer) : '';
      const meta = [finite(g.count) && `${int(g.count)} 张`, md(g.updated) && `本组更新 ${md(g.updated)}`].filter(Boolean).join(' · ');
      const rules = g.section === 'group-5' ? `<a class="more mn-rules" href="${RULES}">看通用规则 <span class="more__chev">›</span></a>` : '';
      return `<li class="mn-group"><div class="mn-group__main"><p class="mn-group__name"><b>${esc(g.label || '')}</b>${tag}</p>${meta ? `<p class="mn-group__meta">${esc(meta)}</p>` : ''}</div>
        <div class="mn-group__links">${rules}<a class="more" href="${esc(records(g.section))}" aria-label="${esc(`${g.label || ''}明细`)}">明细 <span class="more__chev">›</span></a></div>${g.section === 'group-5' ? conv : ''}</li>`;
    }).join('')}</ul>`;
  }

  // —— 右栏：最近改过的 5 张 ——
  function recentHtml(v, viewer) {
    const r = v.recent, tiles = [];
    if (mdTime(r.latest)) tiles.push(['最近一次整理认识', esc(mdTime(r.latest))]);
    if (mdTime(r.context)) tiles.push(['近况上次整理', esc(mdTime(r.context))]);
    if (finite(r.updated7)) tiles.push(['近 7 天整理', `${esc(int(r.updated7))} <small>张</small>`]);
    const last = r.monthly?.last, next = r.monthly?.next;
    if (md(last) || md(next)) tiles.push(['月度总更新', [md(last) && `上次 ${esc(md(last))}`, md(next) && `下次约 ${esc(md(next))}`].filter(Boolean).join(' ·<br>')]);
    const reads = tiles.length ? `<div class="mn-reads" style="--n:${tiles.length}">${tiles.map(([k, val]) => `<div class="mn-read"><span>${k}</span><b>${val}</b></div>`).join('')}</div>` : '';
    // 进度条：从上次月度总更新走到下次，今天走到哪
    let bar = '';
    const a = dayMs(last), z = dayMs(next);
    if (Number.isFinite(a) && Number.isFinite(z) && z > a) {
      const p = Math.min(1, Math.max(0, (today() - a) / (z - a))), pct = (p * 100).toFixed(1);
      const now = new Date(today()), nowText = `${now.getUTCMonth() + 1}月${now.getUTCDate()}日`;
      bar = `<div class="mn-month"><span>${esc(md(last))}</span><div class="mn-bar" role="img" aria-label="${esc(`从 ${md(last)} 到 ${md(next)}，今天 ${nowText}`)}"><i style="width:${pct}%"></i><em style="left:${pct}%"><span>${esc(nowText)}</span></em></div><span>${esc(md(next))}</span></div>`;
    }
    const rows = r.items.slice(0, 5).map(it => {
      const title = typeof it.title === 'string' && it.title.trim() ? it.title.trim() : '';
      const tag = viewer === 'owner' && !TITLED.has(it.section) ? U.visitorHiddenTag('这张主题卡的标题和内容', '', viewer) : '';
      const when = viewer === 'owner' ? dash(it.at) : md(it.at);
      // 点回那一张所在的明细；后台给了 record_id 的带上 card=，明细页按它落到那一张
      const base = typeof it.href === 'string' && it.href.startsWith('/') ? it.href : records(it.section);
      const href = it.record_id != null && it.record_id !== '' ? `${base}${base.includes('?') ? '&' : '?'}card=${encodeURIComponent(it.record_id)}` : base;
      return `<li class="mn-row${title ? '' : ' is-untitled'}"><a href="${esc(href)}"><span class="mn-row__cls">${esc(it.label || '')}</span>${title ? `<span class="mn-row__title">${esc(title)}</span>` : ''}<span class="mn-row__at">${esc(when)}</span><span class="more__chev">›</span></a>${tag}</li>`;
    }).join('');
    return `${reads}${bar}${rows ? `<ul class="mn-rows">${rows}</ul>` : ''}`;
  }

  // —— 右栏：材料和依据 ——
  // 一块两个数：截止同一天写一次；不同天各写各的
  const cuts = (a, aName, b, bName) => md(a) && md(b) && md(a) !== md(b) ? `${aName}${cutoff(a)} · ${bName}${cutoff(b)}` : cutoff(a) || cutoff(b);
  function materialsHtml(v) {
    const m = v.materials, out = [];
    if (finite(m.records) || finite(m.providers)) {
      const line = [finite(m.records) && wan(m.records), finite(m.providers) && `<b>${esc(int(m.providers))}</b> 种来源`].filter(Boolean).join('<i>·</i>');
      const cut = cuts(finite(m.records) ? m.recordsAt : '', '条数', finite(m.providers) ? m.providersAt : '', '来源');
      out.push(`<div class="mn-mat"><p class="mn-mat__k">已入库</p><p class="mn-mat__v">${line}</p>${cut ? `<p class="mn-mat__cut">${esc(cut)}</p>` : ''}</div>`);
    }
    if (finite(m.evidence) || finite(m.statements)) {
      const line = [finite(m.evidence) && `被认识引用的原始资料 <b>${esc(int(m.evidence))}</b> 条`, finite(m.statements) && `用到的本人原话 <b>${esc(int(m.statements))}</b> 句`].filter(Boolean).join('<i>、</i>');
      const cut = cuts(finite(m.evidence) ? m.evidenceAt : '', '原始资料', finite(m.statements) ? m.statementsAt : '', '原话');
      out.push(`<div class="mn-mat"><p class="mn-mat__k">依据</p><p class="mn-mat__v">${line}</p>${cut ? `<p class="mn-mat__cut">${esc(cut)}</p>` : ''}</div>`);
    }
    out.push(`<a class="mn-mat__go" href="${FINANCE}">消费记录在账房先生 <span class="more__chev">›</span></a>`);
    return out.join('');
  }

  // 下排两张卡顶边对齐（照图）：上排左右两张卡取一样高；说明展开、窗口变了、字体到了都重新量
  function align() {
    const a = document.querySelector('.pj-card[data-card="manual-groups"]'), b = document.querySelector('.pj-card[data-card="manual-recent"]');
    for (const c of [a, b]) if (c) c.style.minHeight = '';
    if (!a || !b || a.parentNode === b.parentNode) return;
    const h = Math.max(a.offsetHeight, b.offsetHeight);
    a.style.minHeight = b.style.minHeight = `${h}px`;
  }
  const realign = () => requestAnimationFrame(() => requestAnimationFrame(align));
  window.addEventListener('resize', realign);
  document.fonts?.ready?.then(realign);
  document.addEventListener('click', e => { if (e.target.closest?.('.mn-explain')) realign(); });

  let viewing = 'public';
  function board(d, viewer, graphBlock, boardEl) {
    const v = d.manualView, out = [];
    viewing = viewer;
    boardEl?.classList.add('pj-board--manual');
    realign();
    if (!v) return out;
    if (v.groups.length) {
      const b = graphBlock('manual-groups', '');
      b.group = 'manual-groups';
      const title = `整理成主题卡的认识${v.cards && finite(v.cards.count) ? `（${int(v.cards.count)} 张，分${['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'][v.groups.length] || v.groups.length}类）` : ''}`;
      const sub = viewer === 'owner' ? '点“明细”看这一类每张的认识和依据' : '点“明细”看这一类有几张、哪天整理';
      const note = head(b, title, sub, v.groupNotes);
      U.html(b.viz, note + groupsHtml(v, viewer), false);
      out.push(b);
    }
    const r = v.recent;
    if (r.items.length || mdTime(r.latest) || mdTime(r.context) || finite(r.updated7) || r.monthly) {
      const b = graphBlock('manual-recent', '');
      b.group = 'manual-recent';
      const note = head(b, r.items.length ? `最近改过的 ${Math.min(5, r.items.length)} 张` : '最近整理', '', r.notes);
      U.html(b.viz, note + recentHtml(v, viewer), false);
      out.push(b);
    }
    const b = graphBlock('manual-materials', '');
    b.group = 'manual-materials';
    const note = head(b, '材料和依据', '', v.materials.notes);
    U.html(b.viz, note + materialsHtml(v), false);
    out.push(b);
    return out;
  }
  // 卡放哪一栏：照图固定；出现别的卡（读不到、另有提示）时交回 page.js 按高度摆
  const columns = keys => keys.every(k => k in COLUMNS) ? keys.map(k => COLUMNS[k]) : null;

  window.ProjectPages = Object.assign(window.ProjectPages || {}, { 'daily-preferences': { adapt, strip, board, columns } });
})();
