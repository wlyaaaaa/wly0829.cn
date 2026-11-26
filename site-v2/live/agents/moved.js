// 实况 · 智能体：从规则仓项目页搬来的两块——你跟三家说了多少、三家常用的技能（本人 11-24 02:45 选 B；“AI 最常被拦在哪”本人 03:00 取消：拦下次数里多少是真违规、多少是检查太宽没人核过，拿不准就不放）。
// 放在“三家各干了多少活”下面；每块右上一排“全部｜近 7 天｜近 30 天”各切各的，默认全部，“全部”写从哪天算起。
// 本人：“antigravity和Claude和codex点上去能看见具体数字”——点三家的名字（图例或那一行），或柱子、横条上那一家的那一段：
// 这一家高亮、别的变淡，直接写出这一家的数；再点一次或点“全部”回到三家合起来。看哪一家是整页共用的一个（page.js 的 only），
// 本人 11-24：“三个可点默认全部”“智能体页永远是打开默认全部”，点哪一处整页一起跟着变。
// 技能先列用得最多的 5 个，“另 N 个技能”就地展开全部、再点收起（本人 11-24：“仍然不能展示全部（包括全部智能体和全部技能（带展开））”）。
// 展开后最下面接着列这段时间没用过的技能（本人 16:35 照图点头）：名字灰字、条空着、右边琥珀色“没用过”；“另 N 个”的 N 算上它们。
// 展开后用后台现役技能清单 skill_stats.catalog 对这段时间的完整技能行；只有记录下限时写“没记到使用”。
// 数据读 /agents 的 message_stats、skill_stats（数据约定-前端升级 第 10 节）；取数只在“取数”那一段，约定改了只改那一段。
(() => {
  'use strict';
  const T = window.LiveTape, U = window.LiveUI, { esc } = U;
  const { HOSTS, list, known, int } = T;
  const PERIODS = [['all', '全部'], ['d7', '近 7 天'], ['d30', '近 30 天']], TOP = 5;
  const period = { talk: 'all', skills: 'all' };
  const drawn = new Set();
  let viewer = 'public', only = null, chips = () => '', skillsOpen = false, asof = at => `截至 ${T.when(at)}`;
  const fam = id => HOSTS.find(h => h.id === id);
  const hostOf = v => HOSTS.find(h => h.id === String(v || '').toLowerCase() || h.name === v);
  const num = v => known(v) ? v : null;
  const you = () => T.you(viewer);
  const first = key => { const fresh = !drawn.has(key); drawn.add(key); return fresh; };
  // 带时刻的取北京日期，只有日期的照用
  const dateKey = s => typeof s !== 'string' || !s ? null : s.length > 10 ? T.dayKey(s) : s;

  // —— 取数：/agents 的两份统计转成页面要的样子 ——
  // 说话：{ at, win:{all|d7|d30:{start, starts:{家:起点}, v:{家:数}, lower:{家:true}}}, days:[{date, v:{家:数}}], today, last:{家:时刻}, starts:{家:日期} }
  // 技能：{ at, win:{all|d7|d30:{start, starts, v:{家:总次数}, own:{家:[按次数排的技能名]}, rows:Map(技能名→{name, v:{家:次数}})}}, lower, missing, starts }
  const windowCount = w => !w ? { n: null, lower: false } : known(w.count) ? { n: w.count, lower: false } : known(w.recorded) ? { n: w.recorded, lower: true } : { n: null, lower: false };
  const earliest = dates => dates.filter(Boolean).sort()[0] || null;
  const startsOf = (providers, id) => Object.fromEntries(providers.map(p => [p.fam.id, dateKey(p.windows?.[id]?.start)]));
  function merge(providers) {
    const byDate = new Map();
    for (const p of providers) for (const r of list(p.days)) {
      const row = byDate.get(r.date) || { date: r.date, v: {} };
      row.v[p.fam.id] = num(r.count);
      byDate.set(r.date, row);
    }
    return [...byDate.values()].sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
  }
  const providersOf = s => list(s?.providers).filter(Boolean).map(p => ({ ...p, fam: hostOf(p.host) })).filter(p => p.fam);
  function talkModel(m) {
    const providers = providersOf(m), win = {};
    for (const [id] of PERIODS) {
      win[id] = { start: earliest(providers.map(p => dateKey(p.windows?.[id]?.start))), v: {}, lower: {}, starts: startsOf(providers, id) };
      for (const p of providers) { const c = windowCount(p.windows?.[id]); win[id].v[p.fam.id] = c.n; win[id].lower[p.fam.id] = c.lower; }
    }
    return { at: m.as_of, win, days: merge(providers.map(p => ({ ...p, days: list(p.days).filter(r => r.date) }))),
      today: { date: providers.map(p => p.today?.date).find(Boolean), v: Object.fromEntries(providers.map(p => [p.fam.id, num(p.today?.count)])) },
      last: Object.fromEntries(providers.map(p => [p.fam.id, p.last_at || null])), starts: Object.fromEntries(providers.map(p => [p.fam.id, dateKey(p.since)])),
      gaps: providers.filter(p => list(p.missing_months).length || list(p.unreadable_months).length).map(p => p.fam.name) };
  }
  // M767：后台在技能名上带 visitor_labels.label（hidden／rewritten），三家各段的 skills、top 和清单 catalog 里同一个名字合成一个，访客看不到的优先
  const keepLabel = (labels, row) => { const kind = row && typeof row === 'object' ? row.visitor_labels?.label : null; if (typeof row?.label === 'string' && ['hidden', 'rewritten'].includes(kind) && labels.get(row.label) !== 'hidden') labels.set(row.label, kind); };
  function skillModel(s) {
    const providers = providersOf(s), win = {}, labels = new Map();
    for (const [id] of PERIODS) {
      const rows = new Map(), v = {}, own = {}, onlyTop = [], complete = new Set();
      for (const p of providers) {
        const w = p.windows?.[id];
        v[p.fam.id] = num(w?.count);
        // skills 是这一家这一段用到的全部技能，按标签对齐画三家合表；旧读口只有前 5（top）时退回前 5，并在下面写一句
        const full = Array.isArray(w?.skills), items = list(full ? w.skills : w?.top).filter(t => t?.label);
        if (full && known(v[p.fam.id])) complete.add(p.fam.id);
        if (!full && items.length) onlyTop.push(p.fam.name);
        own[p.fam.id] = [...items].sort((a, b) => (num(b.count) || 0) - (num(a.count) || 0)).map(t => t.label);
        for (const t of items) { (rows.get(t.label) || rows.set(t.label, { name: t.label, v: {} }).get(t.label)).v[p.fam.id] = num(t.count); keepLabel(labels, t); }
        if (full) list(w?.top).forEach(t => keepLabel(labels, t));
      }
      win[id] = { start: earliest(providers.map(p => dateKey(p.windows?.[id]?.start))), v, own, rows, onlyTop, complete, starts: startsOf(providers, id) };
    }
    // 全部技能清单：[{label}] 或 [名字]；没给是 null（这时不列没用过的）
    const cat = Array.isArray(s.catalog) ? s.catalog : Array.isArray(s.catalog?.skills) ? s.catalog.skills : null;
    const catalog = cat && [...new Set(cat.map(c => typeof c === 'string' ? c : c?.label).filter(c => typeof c === 'string' && c))];
    cat?.forEach(c => keepLabel(labels, c));
    return { latest: s.as_of, refresh: num(s.refresh_seconds), win, catalog, labels, lower: Object.fromEntries(providers.map(p => [p.fam.id, p.lower_bound === true])),
      unverified: Object.fromEntries(providers.map(p => [p.fam.id, num(p.unverified_sources)])),
      starts: Object.fromEntries(providers.map(p => [p.fam.id, dateKey(p.since)])),
      invalid: num(s.invalid_ledger_rows), href: '/live/records/?project=agents&section=skill_rows',
      // 每家技能记到哪一刻（recorded_through）：比这一轮读到的时候早一天以上，说明后面用的还没入账，下面小字写明记到几点（M742），不让旧数冒充新的
      through: Object.fromEntries(providers.map(p => [p.fam.id, p.recorded_through || null])), readAt: s.observed_at || s.as_of || null };
  }
  // —— 小零件 ——
  const sum = (v, keys) => keys.reduce((a, h) => a + (known(v?.[h.id]) ? v[h.id] : 0), 0);
  const partial = (v, keys, lower = {}) => keys.some(h => !known(v?.[h.id]) || lower[h.id]);
  const md = date => date ? `${date.slice(5, 7)}-${date.slice(8, 10)}` : '';
  const sinceWord = start => start ? `${md(start)} 起` : '';
  const lead = (p, start) => p === 'all' ? (start ? sinceWord(start) : '一共') : PERIODS.find(x => x[0] === p)[1];
  const lastText = at => !at ? '' : /T/.test(at) ? `上次 ${T.when(at)}` : `上次 ${md(at)}`;
  const inWindow = (days, start) => start ? days.filter(r => r.date >= start) : days;
  function seg(key, start) {
    return `<div class="tp-seg" role="group" aria-label="看哪一段">${PERIODS.map(([id, label]) => `<button type="button" data-mperiod="${key}:${id}" aria-pressed="${period[key] === id}">${esc(id === 'all' && start ? `${label} · ${sinceWord(start)}` : label)}</button>`).join('')}</div>`;
  }
  // 跟顶栏“读到”同一分钟的“截至”不再写（page.js 递来的 asof，M746）
  const head = (key, title, start, reading) => `<div class="tp-panel__head"><h2>${title}</h2><div class="ag-mhead">${seg(key, start)}${reading ? `<span class="tp-asof">${esc(reading)}</span>` : ''}</div></div>`;
  const tone = id => only === id ? ' is-on' : only ? ' is-off' : '';
  // 三家各一行：点了这一家高亮
  function famRows(key, keys, v, unit, { lower = {}, last = {}, starts = {}, start = null } = {}) {
    return `<ul class="ag-fams">${keys.map(h => {
      const n = v?.[h.id], later = start && starts[h.id] && starts[h.id] > start ? `${md(starts[h.id])} 起才有记录` : '';
      const notes = [known(n) && n === 0 && last[h.id] && lastText(last[h.id]), later].filter(Boolean).join(' · ');
      return `<li><button type="button" class="ag-fam${tone(h.id)}" data-pick="${h.id}" data-host="${h.id}" aria-pressed="${only === h.id}" style="--host:${h.color}">
        <span class="ag-fam__name"><i class="tp-swatch"></i>${h.name}</span><span class="ag-fam__num">${known(n) ? `${lower[h.id] ? '至少 ' : ''}${int(n)} ${unit}` : '没读到'}${notes ? `<small>${esc(notes)}</small>` : ''}</span></button></li>`;
    }).join('')}</ul>`;
  }
  // 按天堆起来的柱子：每一段能点。点了一家，柱子只画这一家、按它自己的数定高（Antigravity 只占三家合计的千分之几，
  // 叠在合计里根本看不见），柱顶写这一家这天的数；别家在左边那几行和下面的小签里变淡
  function stackCols(key, days, all, unit) {
    const W = 780, H = 250, pad = { l: 36, r: 8, t: 24, b: 26 }, w = W - pad.l - pad.r, h = H - pad.t - pad.b, n = Math.max(1, days.length);
    const f = only, keys = f ? all.filter(k => k.id === f) : all, max = T.niceMax(Math.max(1, ...days.map(r => sum(r.v, keys))));
    const y = v => pad.t + h - v / max * h, bw = Math.min(54, w / n * .62), step = Math.ceil(n / 12), grow = first(`cols-${key}`);
    let out = [0, .5, 1].map(k => `<line class="tp-gridline" x1="${pad.l}" x2="${pad.l + w}" y1="${y(max * k)}" y2="${y(max * k)}"/><text x="${pad.l - 6}" y="${y(max * k) + 4}" text-anchor="end">${int(max * k)}</text>`).join('');
    days.forEach((r, i) => {
      const cx = pad.l + (i + .5) * w / n; let top = pad.t + h;
      out += `<g${grow ? ` class="tp-grow" style="animation-delay:${i * 25}ms"` : ''}>`;
      for (const k of keys) {
        const v = known(r.v?.[k.id]) ? r.v[k.id] : 0, ph = v / max * h;
        if (ph <= 0) continue;
        top -= ph;
        out += `<rect class="ag-seg" data-pick="${k.id}" x="${cx - bw / 2}" y="${top}" width="${bw}" height="${ph}" fill="${k.color}"><title>${esc(`${md(r.date)} ${k.name} ${int(v)} ${unit}`)}</title></rect>`;
      }
      out += '</g>';
      const all = sum(r.v, keys), mine = f ? r.v?.[f] : null;
      const label = f ? (known(mine) ? int(mine) : '') : all > 0 ? int(all) : '';
      if (label !== '' && n <= 31) out += `<text class="ag-val${f ? ' is-focus' : ''}" x="${cx}" y="${top - 6}" text-anchor="middle"${f ? ` style="fill:${fam(f).color}"` : ''}>${label}</text>`;
      // 最后一天总标；按间隔标的那天离最后一天太近（两个日期会挤成“11-2111-24”）就少标这一个
      if (i === n - 1 || i % step === 0 && (n - 1 - i) * w / n >= 40) out += `<text x="${cx}" y="${H - 7}" text-anchor="middle">${esc(md(r.date))}</text>`;
    });
    out += `<line class="tp-axis" x1="${pad.l}" x2="${pad.l + w}" y1="${pad.t + h}" y2="${pad.t + h}"/>`;
    return `<svg class="tp-chart ag-cols" viewBox="0 0 ${W} ${H}" role="img" aria-label="按天">${out}</svg>`;
  }
  // 本人版技能名旁的小签（访客看不到／对外换了说法），访客版只挂其中的“对外换了说法”（M930），没标的不挂；名字太长时名字省略、签留着
  const skillName = (name, labels) => { const tag = labels?.get(name) ? U.visitorLabel({ visitor_labels: { label: labels.get(name) } }, 'label', '这个技能名', viewer) : '';
    return `<span class="ag-hrow__name" title="${esc(name)}">${tag ? `<span class="ag-hrow__label">${esc(name)}</span>${tag}` : esc(name)}</span>`; };
  // 横条（技能）：每家一段，能点。点了一家，横条只画这一家、按它自己用得最多的那个定长，右边写这一家的数
  function bars(key, rows, every, unit, { lower = {}, labels = null } = {}) {
    const f = only, keys = f ? every.filter(k => k.id === f) : every, max = Math.max(1, ...rows.map(r => sum(r.v, keys)));
    return `<div class="ag-hrows">${rows.map(r => {
      const all = sum(r.v, keys), mine = f ? r.v?.[f] : null;
      const right = f ? `<b style="color:${fam(f).color}">${known(mine) ? `${lower[f] ? '至少 ' : ''}${int(mine)}` : '—'}</b><small>${unit}</small>` : `<b>${int(all)}</b>`;
      const segs = keys.filter(k => known(r.v?.[k.id]) && r.v[k.id] > 0).map(k => `<button type="button" class="ag-hseg${lower[k.id] ? ' is-lower' : ''}" data-pick="${k.id}" style="flex:${r.v[k.id]};--fill:${k.color}" title="${esc(`${k.name} ${lower[k.id] ? '至少 ' : ''}${int(r.v[k.id])} ${unit}`)}" aria-label="${esc(`${r.name} · ${k.name} ${int(r.v[k.id])} ${unit}`)}"></button>`).join('');
      return `<div class="ag-hrow">${skillName(r.name, labels)}
        <span class="ag-hrow__track"><span class="ag-hrow__fill" style="width:${all / max * 100}%">${segs}</span></span><span class="ag-hrow__num">${right}</span></div>`;
    }).join('')}</div>`;
  }
  const bigNum = (key, value, f, lower) => `<b${f ? ` style="color:${fam(f).color}"` : ''}>${lower ? '<small>至少</small>' : ''}${T.big(value, `${key}-${period[key]}-${f || 'all'}`)}</b>`;

  // —— 一、你跟三家说了多少 ——
  function talkSection(t) {
    const key = 'talk', p = period[key], w = t.win[p], f = only, days = inWindow(t.days, w.start);
    const value = f ? w.v[f] : sum(w.v, HOSTS), lower = f ? w.lower[f] || !known(w.v[f]) : partial(w.v, HOSTS, w.lower);
    const todayN = f ? t.today.v[f] : sum(t.today.v, HOSTS), todayKnown = f ? known(t.today.v[f]) : HOSTS.some(h => known(t.today.v[h.id]));
    const lastAt = f ? t.last[f] : Object.values(t.last).filter(Boolean).sort().at(-1);
    const to = f ? `跟 ${fam(f).name} ` : '';
    const todayText = !todayKnown ? '' : todayN > 0 ? `今天到 ${T.clock(t.at)} ${to}说了 ${int(todayN)} 句` : `今天到 ${T.clock(t.at)} 还没${to}说${lastAt ? ` · ${lastText(lastAt)}` : ''}`;
    return `<section class="tp-panel ag-moved" id="talk">${head(key, `${you()}跟三家说了多少`, t.win.all.start, t.at && asof(t.at))}
      <div class="tp-grid ag-mgrid"><div class="ag-mleft">
        <p class="ag-mbig">${esc(lead(p, f ? w.starts[f] || w.start : w.start))}${you()}${esc(to)}<span class="ag-mbig__tail">说了 ${bigNum(key, value || 0, f, lower)} 句</span></p>
        ${famRows(key, HOSTS, w.v, '句', { lower: w.lower, last: t.last, starts: t.starts, start: p === 'all' ? w.start : null })}
        ${todayText ? `<p class="tp-small ag-mtoday">${esc(todayText)}</p>` : ''}</div>
        <div>${days.length ? stackCols(key, days, HOSTS, '句') : '<p class="tp-empty">这段时间没有按天的记录。</p>'}${chips()}</div></div>
      <p class="tp-small ag-mnote">按原话存档里${you()}发给每家的消息算，一条算一句，北京时间零点分天。${days.length && w.start && days[0].date > w.start ? `按天的柱子从 ${esc(md(days[0].date))} 起，更早的只算在合计里。` : ''}${t.gaps.length ? `${esc(t.gaps.join('、'))} 有几个月的档案缺了或读不了，这几家写的是至少。` : ''}</p></section>`;
  }
  // —— 二、三家常用的技能 ——
  function skillSection(s) {
    const key = 'skills', p = period[key], w = s.win[p], f = only;
    // 三家合起来：按三家加起来的次数排；点了一家：换成这一家自己的技能、按它的次数排，别家那几段不画。先列前 5 个，展开看全部
    const every = f ? (w.own[f] || []) : [...w.rows.values()].sort((a, b) => sum(b.v, HOSTS) - sum(a.v, HOSTS)).map(r => r.name);
    const rows = (skillsOpen ? every : every.slice(0, TOP)).map(n => w.rows.get(n)).filter(Boolean);
    const hs = f ? HOSTS.filter(h => h.id === f) : HOSTS;   // 只看一家时，下面的小字也只说这一家
    // 只在所选时段有全量行时对现役清单；如果来源照实标了下限，未见记录不能断定没用过。
    const judged = s.catalog && hs.every(h => w.complete.has(h.id));
    const unused = judged ? s.catalog.filter(n => !every.includes(n)) : [];
    const lower = hs.filter(h => s.lower[h.id]).map(h => h.name);
    const unusedLabel = lower.length ? '没记到使用' : '没用过';
    const missing = hs.filter(h => !known(w.v[h.id]) && !w.own[h.id]?.length).map(h => h.name);
    const total = f ? w.v[f] : null;
    const line = !f ? '' : known(total) ? `${fam(f).name} ${lead(p, w.starts[f] || w.start)}一共用了${s.lower[f] ? '至少' : ''} ${int(total)} 次技能${total === 0 ? '' : `，用到 ${every.length} 个`}` : `${fam(f).name} 这段时间的技能没采到`;
    const hidden = Math.max(0, every.length - TOP) + unused.length;
    const more = hidden ? `<button type="button" class="ag-more ag-skillmore" data-skills-more aria-expanded="${skillsOpen}">${skillsOpen ? '收起' : `另 ${hidden} 个技能`}<span class="tp-chev" aria-hidden="true"></span></button>` : '';
    const never = skillsOpen && unused.length ? `<div class="ag-unused"><p class="ag-unused__head">${unusedLabel}的 ${unused.length} 个</p><div class="ag-hrows">${unused.map(n =>
      `<div class="ag-hrow is-unused">${skillName(n, s.labels)}<span class="ag-hrow__track"></span><span class="ag-hrow__num"><b>${unusedLabel}</b></span></div>`).join('')}</div></div>` : '';
    const later = hs.filter(h => p === 'all' && s.starts[h.id] && w.start && s.starts[h.id] > w.start).map(h => `${h.name} ${md(s.starts[h.id])} 起才有记录`);
    const behind = hs.filter(h => Date.parse(s.readAt) - Date.parse(s.through[h.id]) > 864e5).map(h => `${h.name} 只记到 ${T.when(s.through[h.id])}`);
    const lag = behind.length ? `${behind.join('、')}，之后用的还没入账` : '';
    const unverified = hs.filter(h => s.unverified[h.id] > 0).map(h => `${h.name} 有 ${int(s.unverified[h.id])} 个来源未能确认`);
    const notes = [line, lag, ...later, ...unverified, w.onlyTop.length ? `${w.onlyTop.join('、')} 只给了用得最多的 5 个，别的技能这一家那一段没画` : '',
      missing.length ? `${missing.join('、')} 的技能这段时间还没采到` : '', lower.length ? `${lower.join('、')} 只记得到能确认的，写的是至少` : '',
      known(s.invalid) && s.invalid > 0 ? `技能记录里有 ${int(s.invalid)} 行坏了，没算进来` : ''].filter(Boolean);
    const interval = s.refresh > 0 && (s.refresh % 60 ? `${int(s.refresh)} 秒` : T.duration(s.refresh));
    const reading = [interval && `约每 ${interval}汇总已有记录`, s.latest && `最近一条使用记于 ${T.when(s.latest)}`].filter(Boolean).join(' · ');
    return `<section class="tp-panel ag-moved" id="skills-used">${head(key, '三家常用的技能', s.win.all.start, reading)}
      ${chips()}
      ${rows.length ? bars(key, rows, HOSTS, '次', { lower: s.lower, labels: s.labels })
        : `<p class="tp-empty">${missing.length === hs.length ? '这段时间的技能没读到。' : '这段时间没有采到技能使用记录。'}</p>`}${never}${more}
      <div class="ag-mfoot"><p class="tp-small">${notes.length ? `${esc(notes.join('；'))}。` : ''}</p>${T.link(s.href, '全部技能 ›')}</div></section>`;
  }
  window.AgentsMoved = {
    html(d, kind, opts = {}) {
      viewer = kind; only = opts.only || null; chips = opts.chips || (() => ''); if (opts.asof) asof = opts.asof;
      return [d.message_stats && talkSection(talkModel(d.message_stats)), d.skill_stats && skillSection(skillModel(d.skill_stats))].filter(Boolean).join('');
    },
    // 点了切换时段或技能展开：返回要停住的位置；不是这两块的点击返回 null（点哪一家归 page.js）
    click(target) {
      const p = target.closest('[data-mperiod]'), more = target.closest('[data-skills-more]');
      if (p) { const [key, id] = p.dataset.mperiod.split(':'); period[key] = id; return `[data-mperiod="${key}:${id}"]`; }
      if (more) { skillsOpen = !skillsOpen; return '[data-skills-more]'; }
      return null;
    },
  };
})();
