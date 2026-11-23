// 实况 · 智能体：从规则仓项目页搬来的两块——你跟三家说了多少、三家常用的技能（本人 11-24 02:45 选 B；“AI 最常被拦在哪”本人 03:00 取消：拦下次数里多少是真违规、多少是检查太宽没人核过，拿不准就不放）。
// 放在“三家各干了多少活”下面；每块右上一排“全部｜近 7 天｜近 30 天”各切各的，默认全部，“全部”写从哪天算起。
// 本人：“antigravity和Claude和codex点上去能看见具体数字”——点三家的名字（图例或那一行），或柱子、横条上那一家的那一段：
// 这一家高亮、别的变淡，直接写出这一家的数；再点一次回到三家合起来。
// 数据读 /agents 的 message_stats、skill_stats（数据约定-前端升级 第 10 节）；取数只在“取数”那一段，约定改了只改那一段。
(() => {
  'use strict';
  const T = window.LiveTape, U = window.LiveUI, { esc } = U;
  const { HOSTS, list, known, int } = T;
  const PERIODS = [['all', '全部'], ['d7', '近 7 天'], ['d30', '近 30 天']];
  const period = { talk: 'all', skills: 'all' }, focus = { talk: null, skills: null };
  const SECTION = { talk: 'talk', skills: 'skills-used' };
  const drawn = new Set();
  let viewer = 'public';
  const fam = id => HOSTS.find(h => h.id === id);
  const hostOf = v => HOSTS.find(h => h.id === String(v || '').toLowerCase() || h.name === v);
  const num = v => known(v) ? v : null;
  const you = () => T.you(viewer);
  const first = key => { const fresh = !drawn.has(key); drawn.add(key); return fresh; };
  // 带时刻的取北京日期，只有日期的照用
  const dateKey = s => typeof s !== 'string' || !s ? null : s.length > 10 ? T.dayKey(s) : s;

  // —— 取数：/agents 的两份统计转成页面要的样子 ——
  // 每份转成 { at, win:{all|d7|d30:{start, v:{家:数}, lower:{家:true}, rows}}, days:[{date, v:{家:数}}], last:{家:时刻}, starts:{家:日期} }
  const windowCount = w => !w ? { n: null, lower: false } : known(w.count) ? { n: w.count, lower: false } : known(w.recorded) ? { n: w.recorded, lower: true } : { n: null, lower: false };
  const earliest = dates => dates.filter(Boolean).sort()[0] || null;
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
      win[id] = { start: earliest(providers.map(p => dateKey(p.windows?.[id]?.start))), v: {}, lower: {} };
      for (const p of providers) { const c = windowCount(p.windows?.[id]); win[id].v[p.fam.id] = c.n; win[id].lower[p.fam.id] = c.lower; }
    }
    return { at: m.as_of, win, days: merge(providers.map(p => ({ ...p, days: list(p.days).filter(r => r.date) }))),
      today: { date: providers.map(p => p.today?.date).find(Boolean), v: Object.fromEntries(providers.map(p => [p.fam.id, num(p.today?.count)])) },
      last: Object.fromEntries(providers.map(p => [p.fam.id, p.last_at || null])), starts: Object.fromEntries(providers.map(p => [p.fam.id, dateKey(p.since)])),
      gaps: providers.filter(p => list(p.missing_months).length || list(p.unreadable_months).length).map(p => p.fam.name) };
  }
  function skillModel(s) {
    const providers = providersOf(s), win = {};
    for (const [id] of PERIODS) {
      const rows = new Map(), v = {}, top = {};
      for (const p of providers) {
        const w = p.windows?.[id];
        v[p.fam.id] = num(w?.count);
        top[p.fam.id] = list(w?.top).map(t => ({ name: t.label, v: { [p.fam.id]: num(t.count) } }));
        for (const t of list(w?.top)) (rows.get(t.label) || rows.set(t.label, { name: t.label, v: {} }).get(t.label)).v[p.fam.id] = num(t.count);
      }
      win[id] = { start: earliest(providers.map(p => dateKey(p.windows?.[id]?.start))), v, top, rows: [...rows.values()] };
    }
    return { at: s.as_of || s.observed_at, win, lower: Object.fromEntries(providers.map(p => [p.fam.id, p.lower_bound === true])),
      missing: HOSTS.filter(h => !providers.some(p => p.fam === h)), starts: Object.fromEntries(providers.map(p => [p.fam.id, dateKey(p.since)])),
      invalid: num(s.invalid_ledger_rows), href: '/live/records/?project=agents&section=skill_rows' };
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
  const head = (key, title, start, at) => `<div class="tp-panel__head"><h2>${title}</h2><div class="ag-mhead">${seg(key, start)}${at ? `<span class="tp-asof">截至 ${esc(T.when(at))}</span>` : ''}</div></div>`;
  const tone = (key, id) => focus[key] === id ? ' is-on' : focus[key] ? ' is-off' : '';
  // 三家各一行：点了这一家高亮
  function famRows(key, keys, v, unit, { lower = {}, last = {}, starts = {}, start = null } = {}) {
    return `<ul class="ag-fams">${keys.map(h => {
      const n = v?.[h.id], later = start && starts[h.id] && starts[h.id] > start ? `${md(starts[h.id])} 起才有记录` : '';
      const notes = [known(n) && n === 0 && last[h.id] && lastText(last[h.id]), later].filter(Boolean).join(' · ');
      return `<li><button type="button" class="ag-fam${tone(key, h.id)}" data-focus="${key}:${h.id}" data-host="${h.id}" aria-pressed="${focus[key] === h.id}" style="--host:${h.color}">
        <span class="ag-fam__name"><i class="tp-swatch"></i>${h.name}</span><span class="ag-fam__num">${known(n) ? `${lower[h.id] ? '至少 ' : ''}${int(n)} ${unit}` : '没读到'}${notes ? `<small>${esc(notes)}</small>` : ''}</span></button></li>`;
    }).join('')}</ul>`;
  }
  function legend(key, keys) {
    return `<p class="ag-mlegend">${keys.map(h => `<button type="button" class="ag-chip${tone(key, h.id)}" data-focus="${key}:${h.id}" aria-pressed="${focus[key] === h.id}" style="--host:${h.color}"><i class="tp-swatch"></i>${h.name}</button>`).join('')}
      <span class="ag-mhint">${focus[key] ? `只看 ${fam(focus[key]).name} · 再点一次回到三家合起来` : '点一家，只看它自己的数'}</span></p>`;
  }
  // 按天堆起来的柱子：每一段能点；点了一家，别家变淡，柱顶写这一家这天的数
  function stackCols(key, days, keys, unit) {
    const W = 780, H = 250, pad = { l: 36, r: 8, t: 24, b: 26 }, w = W - pad.l - pad.r, h = H - pad.t - pad.b, n = Math.max(1, days.length);
    const f = focus[key], max = T.niceMax(Math.max(1, ...days.map(r => sum(r.v, keys))));
    const y = v => pad.t + h - v / max * h, bw = Math.min(54, w / n * .62), step = Math.ceil(n / 12), grow = first(`cols-${key}`);
    let out = [0, .5, 1].map(k => `<line class="tp-gridline" x1="${pad.l}" x2="${pad.l + w}" y1="${y(max * k)}" y2="${y(max * k)}"/><text x="${pad.l - 6}" y="${y(max * k) + 4}" text-anchor="end">${int(max * k)}</text>`).join('');
    days.forEach((r, i) => {
      const cx = pad.l + (i + .5) * w / n; let top = pad.t + h;
      out += `<g${grow ? ` class="tp-grow" style="animation-delay:${i * 25}ms"` : ''}>`;
      for (const k of keys) {
        const v = known(r.v?.[k.id]) ? r.v[k.id] : 0, ph = v / max * h;
        if (ph <= 0) continue;
        top -= ph;
        out += `<rect class="ag-seg${f && f !== k.id ? ' is-dim' : ''}" data-focus="${key}:${k.id}" x="${cx - bw / 2}" y="${top}" width="${bw}" height="${ph}" fill="${k.color}"><title>${esc(`${md(r.date)} ${k.name} ${int(v)} ${unit}`)}</title></rect>`;
      }
      out += '</g>';
      const all = sum(r.v, keys), mine = f ? r.v?.[f] : null;
      const label = f ? (known(mine) ? int(mine) : '') : all > 0 ? int(all) : '';
      if (label !== '' && n <= 31) out += `<text class="ag-val${f ? ' is-focus' : ''}" x="${cx}" y="${top - 6}" text-anchor="middle"${f ? ` style="fill:${fam(f).color}"` : ''}>${label}</text>`;
      if (i % step === 0 || i === n - 1) out += `<text x="${cx}" y="${H - 7}" text-anchor="middle">${esc(md(r.date))}</text>`;
    });
    out += `<line class="tp-axis" x1="${pad.l}" x2="${pad.l + w}" y1="${pad.t + h}" y2="${pad.t + h}"/>`;
    return `<svg class="tp-chart ag-cols" viewBox="0 0 ${W} ${H}" role="img" aria-label="按天">${out}</svg>`;
  }
  // 横条（技能）：每家一段，能点；点了一家，右边写这一家的数
  function bars(key, rows, keys, unit, { lower = {} } = {}) {
    const f = focus[key], max = Math.max(1, ...rows.map(r => sum(r.v, keys)));
    return `<div class="ag-hrows">${rows.map(r => {
      const all = sum(r.v, keys), mine = f ? r.v?.[f] : null;
      const right = f ? `<b style="color:${fam(f).color}">${known(mine) ? `${lower[f] ? '至少 ' : ''}${int(mine)}` : '—'}</b><small>${unit}</small>` : `<b>${int(all)}</b>`;
      const segs = keys.filter(k => known(r.v?.[k.id]) && r.v[k.id] > 0).map(k => `<button type="button" class="ag-hseg${lower[k.id] ? ' is-lower' : ''}${f && f !== k.id ? ' is-dim' : ''}" data-focus="${key}:${k.id}" style="flex:${r.v[k.id]};--fill:${k.color}" title="${esc(`${k.name} ${lower[k.id] ? '至少 ' : ''}${int(r.v[k.id])} ${unit}`)}" aria-label="${esc(`${r.name} · ${k.name} ${int(r.v[k.id])} ${unit}`)}"></button>`).join('');
      return `<div class="ag-hrow"><span class="ag-hrow__name" title="${esc(r.name)}">${esc(r.name)}</span>
        <span class="ag-hrow__track"><span class="ag-hrow__fill" style="width:${all / max * 100}%">${segs}</span></span><span class="ag-hrow__num">${right}</span></div>`;
    }).join('')}</div>`;
  }
  const bigNum = (key, value, f, lower) => `<b${f ? ` style="color:${fam(f).color}"` : ''}>${lower ? '<small>至少</small>' : ''}${T.big(value, `${key}-${period[key]}-${f || 'all'}`)}</b>`;

  // —— 一、你跟三家说了多少 ——
  function talkSection(t) {
    const key = 'talk', p = period[key], w = t.win[p], f = focus[key], days = inWindow(t.days, w.start);
    const value = f ? w.v[f] : sum(w.v, HOSTS), lower = f ? w.lower[f] || !known(w.v[f]) : partial(w.v, HOSTS, w.lower);
    const todayN = f ? t.today.v[f] : sum(t.today.v, HOSTS), todayKnown = f ? known(t.today.v[f]) : HOSTS.some(h => known(t.today.v[h.id]));
    const lastAt = f ? t.last[f] : Object.values(t.last).filter(Boolean).sort().at(-1);
    const to = f ? `跟 ${fam(f).name} ` : '';
    const todayText = !todayKnown ? '' : todayN > 0 ? `今天到 ${T.clock(t.at)} ${to}说了 ${int(todayN)} 句` : `今天到 ${T.clock(t.at)} 还没${to}说${lastAt ? ` · ${lastText(lastAt)}` : ''}`;
    return `<section class="tp-panel ag-moved" id="talk">${head(key, `${you()}跟三家说了多少`, t.win.all.start, t.at)}
      <div class="tp-grid ag-mgrid"><div class="ag-mleft">
        <p class="ag-mbig">${esc(lead(p, w.start))}${you()}${esc(to)}说了 ${bigNum(key, value || 0, f, lower)} 句</p>
        ${famRows(key, HOSTS, w.v, '句', { lower: w.lower, last: t.last, starts: t.starts, start: p === 'all' ? w.start : null })}
        ${todayText ? `<p class="tp-small ag-mtoday">${esc(todayText)}</p>` : ''}</div>
        <div>${days.length ? stackCols(key, days, HOSTS, '句') : '<p class="tp-empty">这段时间没有按天的记录。</p>'}${legend(key, HOSTS)}</div></div>
      <p class="tp-small ag-mnote">按原话存档里${you()}发给每家的消息算，一条算一句，北京时间零点分天。${t.gaps.length ? `${esc(t.gaps.join('、'))} 有几个月的档案缺了或读不了，这几家写的是至少。` : ''}</p></section>`;
  }
  // —— 二、三家常用的技能 ——
  function skillSection(s) {
    const key = 'skills', p = period[key], w = s.win[p], f = focus[key];
    const rows = f ? w.top[f] || [] : [...w.rows].sort((a, b) => sum(b.v, HOSTS) - sum(a.v, HOSTS)).slice(0, 6);
    const total = f ? w.v[f] : null;
    const line = f ? (known(total) ? `${fam(f).name} ${lead(p, w.start)}一共用了 ${s.lower[f] ? '至少 ' : ''}${int(total)} 次技能${total === 0 ? '' : '，下面是它用得最多的几个'}。` : `${fam(f).name} 这段时间的技能没采到。`)
      : `每家只列它自己用得最多的 5 个；某个技能没进哪家的前 5，那一家这一段就不画、不算进右边的数。`;
    const later = HOSTS.filter(h => p === 'all' && s.starts[h.id] && w.start && s.starts[h.id] > w.start).map(h => `${h.name} ${md(s.starts[h.id])} 起才有记录`);
    return `<section class="tp-panel ag-moved" id="skills-used">${head(key, '三家常用的技能', s.win.all.start, s.at)}
      ${legend(key, HOSTS)}
      ${rows.length ? bars(key, rows, HOSTS, '次', { lower: s.lower }) : '<p class="tp-empty">这段时间没有记录。</p>'}
      <div class="ag-mfoot"><p class="tp-small">${esc([line, ...later, s.missing.length ? `${s.missing.map(h => h.name).join('、')} 的技能还没采到` : '', HOSTS.some(h => s.lower[h.id]) ? `${HOSTS.filter(h => s.lower[h.id]).map(h => h.name).join('、')} 只记得到能确认的，写的是至少` : ''].filter(Boolean).join('；'))}。</p>${T.link(s.href, '全部技能 ›')}</div></section>`;
  }
  window.AgentsMoved = {
    html(d, kind) {
      viewer = kind;
      return [d.message_stats && talkSection(talkModel(d.message_stats)), d.skill_stats && skillSection(skillModel(d.skill_stats))].filter(Boolean).join('');
    },
    // 点了切换或某一家：返回要停住的位置；不是这两块的点击返回 null
    click(target) {
      const p = target.closest('[data-mperiod]'), f = target.closest('[data-focus]');
      if (p) { const [key, id] = p.dataset.mperiod.split(':'); period[key] = id; return `[data-mperiod="${key}:${id}"]`; }
      if (f) { const [key, id] = f.dataset.focus.split(':'); focus[key] = focus[key] === id ? null : id; return `#${SECTION[key]} .tp-panel__head`; }
      return null;
    },
  };
})();
