// 用电：正常的一组一行，点开看功耗曲线、场景和电源细项。
(() => {
  'use strict';
  const V = window.LiveViz, C = window.LiveChart, D = window.LiveDetail, S = window.LiveStat, $ = (id) => document.getElementById(id);
  const sync = C.sync();
  let data = null, at = null;
  const off = () => !!window.LiveUI.offline?.();
  const energy = (v) => v == null ? (off() ? '—' : window.LiveUI.collectionText()) : `${Number(v.toFixed(Math.abs(v) < 10 ? 2 : 1))} 度`;
  const unit = (v, u) => u === '度' || u === 'kWh' ? energy(v) : C.value(v, u) ?? (off() ? '—' : window.LiveUI.collectionText());
  const fig = (key, label, value, u, source, field = key) => S.figure({ key, label: window.LiveUI.sp(label), value, unit: u, ...(['度', 'kWh'].includes(u) ? { text: value == null ? '—' : energy(value) } : {}) }, source, field);
  const row = (key, name, value, u, sub = '', source, field = key) => S.row({ key, name: window.LiveUI.sp(name), value, text: unit(value, u), sub }, source, field);
  const L = (id, label) => ({ id, label });
  const basis = (d, key) => d?.[key]?.basis || d?.blocks?.[key]?.basis || 'components';
  const totalTitle = (d) => window.LiveUI.sp(d?.power?.series?.find((s) => s.id === 'total')?.label || (basis(d, 'power') === 'wall' ? '实时整机总功耗' : '部件功耗合计（估算）')).replace(/\s*[（(]W[)）]/g, '').replace(/^实时/, off() ? '' : '实时');
  const kind = (d, key) => basis(d, key) === 'wall' ? '整机' : '部件';
  const note = (el, text) => { const p = document.createElement('p'); p.className = 'vz-note'; p.textContent = text; p.hidden = true; el.append(p); return p; };
  function todayPeak(s) {
    const f = fig('peak', powerDay(data) + '峰时', s?.today_peak_kwh, '度', s, 'today_peak_kwh');
    const hour = new Date(instant(summaryCutoff(data)) + 8 * 3600000).getUTCHours();
    return s?.today_peak_kwh === 0 && hour < 8 ? { ...f, text: '还没到峰时' } : f;
  }
  function energyDays(d) {
    const pack = d?.days, block = blockMeta(d, 'days'), series = pack?.series?.find((s) => s.id === 'energy');
    const days = new Map(), lastRead = cutoff(block) ?? pack?.at ?? pack?.to, lastDay = dayOf(lastRead);
    for (const [t, value] of [...(series?.points || [])].sort((a, b) => a[0] - b[0])) {
      const day = beijing(t * 1000).slice(0, 10), asOf = pack.as_of_by_day?.[t];
      days.set(day, { day, value, asOf, at: dayOf(asOf) ? asOf : lastDay === day ? lastRead : null });
    }
    const list = [...days.values()].slice(-30), latest = list.at(-1), s = d?.summary, tag = blockMeta(d, 'summary');
    const read = cutoff(tag), window = tag.window, end = window?.to ?? read, commonBasis = tag.basis;
    if (!latest || !Number.isFinite(s?.today_kwh) || !['wall', 'components'].includes(commonBasis)
      || commonBasis !== (series?.basis ?? pack?.basis ?? block?.basis) || failed(s) || failed(tag)
      || [s, tag].some((b) => ['computing', 'stale', 'unknown'].includes(b?.state) || ['unknown', 'stale'].includes(b?.q) || b?.stale || S.partial(b, 'today_kwh'))
      || [read, end, latest.at].some((t) => dayOf(t) !== latest.day)
      || (window?.from != null && instant(window.from) !== instant(`${latest.day}T00:00:00+08:00`))) return list;
    if (instant(end) === instant(latest.at) && Number.isFinite(latest.value) && energy(s.today_kwh) !== energy(latest.value)) latest.source = '同一截止电量与当天摘要不一致，待复核';
    if (instant(end) > instant(latest.at) || latest.value == null && instant(end) === instant(latest.at)) Object.assign(latest, { value: s.today_kwh, at: end, source: '当天摘要' });
    return list;
  }
  const blockMeta = (d, key) => Array.isArray(d?.[key]) ? d?.blocks?.[key] : { ...d?.blocks?.[key], ...d?.[key] };
  const cutoff = (b) => b?.at ?? b?.source_at;
  const failed = (b) => !!b?.error || [b?.state, b?.q].some((v) => ['error', 'failed', 'unavailable'].includes(v));
  const instant = (v) => typeof v === 'string' && /T\d\d:\d\d.*(?:Z|[+-]\d\d:\d\d)$/.test(v) ? Date.parse(v) : NaN;
  const beijing = (ms) => new Date(ms + 28800000).toISOString();
  const dayOf = (v) => Number.isFinite(instant(v)) ? beijing(instant(v)).slice(0, 10) : '';
  function summaryCutoff(d) {
    const b = blockMeta(d, 'summary');
    return b.window?.to || cutoff(b) || d?.at || at;
  }
  const powerDay = (d) => {
    const day = dayOf(summaryCutoff(d));
    return day && day !== beijing(Date.now()).slice(0, 10) ? day.slice(5) + ' ' : '今天';
  };
  function stamp(t, day = beijing(Date.now()).slice(0, 10)) {
    const date = dayOf(t);
    return date && `${date === day ? '' : date.slice(5) + ' '}${window.LiveUI.time(t)}`;
  }
  function readingNote(b, label, has, t = cutoff(b), day) {
    const when = has && stamp(t, day);
    const state = failed(b) ? `${label}更新失败${when ? `，保留到 ${when}` : has ? '，保留上次读数' : ''}` : when && (off() || window.LiveUI.isStale?.(b)) ? `截至 ${when}` : '';
    return [state, b?.gap && window.LiveUI.sp(b.gap)].filter(Boolean).join(' · ');
  }
  function carbonMonth(d) {
    const month = dayOf(cutoff(blockMeta(d, 'carbon'))).slice(0, 7);
    return month && month !== beijing(Date.now()).slice(0, 7) ? `${month.replace('-', ' 年 ')} 月` : '本月';
  }
  function carbonNote(d, has) {
    const b = blockMeta(d, 'carbon'), w = b.window, from = dayOf(w?.from), to = dayOf(w?.to);
    const range = has && w?.label === '当月' && from && to;
    const offset = from.slice(0, 4) === to.slice(0, 4) ? 5 : 0;
    return [range && `统计时段 ${from.slice(offset)} ${window.LiveUI.time(w.from)} 至 ${to.slice(offset)} ${window.LiveUI.time(w.to)}`, readingNote(b, '月碳排', has)].filter(Boolean).join(' · ');
  }
  const appName = (a) => a?.display_label || a?.name || (a?.hidden || a?.hidden_block || a?.visibility === 'owner' ? a : undefined);
  const appEnergy = (v) => `${v.toFixed(Math.abs(v) < 10 ? 2 : 1)} 度`;
  function appRow(r, index) {
    const name = appName(r), key = typeof name === 'string' && typeof r.name === 'string' ? r.name : `app-${index}`;
    const front = S.text(r, 'seconds', V.dur);
    const sub = [r.avg_w == null ? '' : `它在前台时 CPU＋显卡平均 ${S.text(r, 'avg_w', (v) => unit(v, 'W'))}`, r.seconds == null ? front : `窗口在前台共 ${front}`].filter(Boolean).join(' · ');
    return { ...r, ...row(key, name, r.kwh, '度', sub, r, 'kwh'), name, text: r.kwh == null ? '—' : `计入电量 ${S.text(r, 'kwh', appEnergy)}`, hue: V.categoryHues[r.category] || 'stone' };
  }
  function appsNote() {
    const b = blockMeta(data, 'apps'), range = b?.kwh_label && b.window, from = stamp(range?.from, ''), to = stamp(range?.to ?? cutoff(b), from ? '' : undefined);
    // 后台的口径说明是术语（“前台窗口区间去重合计”等），这里换成人话；这页的前台时长含人离开的时间，和使用时间页、卡顿与流畅页不是一个算法。
    return [to && (from ? `统计时段 ${from} 至 ${to}` : `截至 ${to}`),
      '前台时长：这个程序的窗口在最前面的时间，人离开电脑、窗口还开着也算，所以比“使用时间”页和“卡顿与流畅”页的同一程序长（那两页离开电脑的时间不算）',
      '平均功率：它在前台时整台电脑 CPU＋显卡的平均功耗，不是它一个程序用的',
      '计入电量：它在前台时有功率读数的那些时段，CPU＋显卡用的电记到它名下'].filter(Boolean).map(window.LiveUI.sp).join('。') + '。';
  }
  function supplyNote(x) {
    const state = typeof x.supply_state === 'string' ? x.supply_state.replace(/\s*·\s*估算$/, '') : '', { capacity_a: amps, warning_pct: warn, critical_pct: crit } = x.thresholds ?? {};
    if (!Number.isFinite(warn) || !Number.isFinite(crit)) return state;
    const rules = { 危险: `估算负载 ≥ ${crit}%`, 吃紧: `${warn}% ≤ 估算负载 < ${crit}%`, 安全: `估算负载 < ${warn}%` };
    const rule = rules[state.match(/危险|吃紧|安全/)?.[0]];
    return [state, rule && !state.replace(/\s+/g, '').includes(rule.replace(/\s+/g, '')) && rule, rule && Number.isFinite(amps) && !state.replace(/\s+/g, '').includes(`${amps}A`) && `容量 ${amps} A`].filter(Boolean).join(' · ');
  }
  function gameRange(pack) {
    return pack && { ...pack, series: pack.series?.map((s) => {
      const points = s.points.filter(([, v]) => v != null && Number.isFinite(v));
      return points.length > 1 ? { ...s, from: new Date(points[0][0] * 1000).toISOString(), to: new Date(points.at(-1)[0] * 1000).toISOString() } : s;
    }) };
  }
  function ranks(el, sections, text) {
    el.innerHTML = `<div${sections.length > 1 ? ' class="grp-split"' : ''}>${sections.map((s, i) => `<div><p class="grp-split__k">${s.title}</p><div data-rank="${i}"></div></div>`).join('')}</div>`;
    const views = sections.map((s, i) => { const host = el.querySelector(`[data-rank="${i}"]`); if (s.key === 'apps') host.dataset.appRank = ''; return V.block(host, V.rank(host, { show: Infinity, mark: !!s.mark, bar: s.bar !== false, keepNameOnlyRows: s.key === 'apps', more: (n) => `还有 ${n} 个` }), () => data, s.key); });
    const p = text ? note(el, '') : null;
    const missing = note(el, '');
    return { set: () => {
      const rows = sections.map((s) => s.rows()), names = rows.flatMap((r) => r?.filter((x) => x.value == null).map((x) => x.name) || []);
      rows.forEach((r, i) => { const shown = off() ? r?.filter((x) => x.value != null) : r; views[i].set(r?.length && !shown?.length ? null : shown?.map((x) => x.value == null ? { ...x, text: '—' } : x) ?? null); });
      for (const label of el.querySelectorAll('[data-app-rank] .vz-rank__label')) {
        const node = label.firstChild;
        const icon = node?.nodeType === Node.TEXT_NODE && /^([\p{Extended_Pictographic}\p{Regional_Indicator}]\S*)\s+/u.exec(node.textContent);
        if (!icon) continue;
        const mark = document.createElement('span');
        mark.className = 'power-app-icon';
        mark.textContent = icon[0];
        node.splitText(icon[0].length);
        node.replaceWith(mark);
      }
      el.querySelectorAll('.grp-split__k').forEach((n, i) => { n.textContent = off() ? sections[i].title.replace(/^此刻的/, '') : sections[i].title; });
      missing.hidden = off() || !names.length; missing.textContent = !off() && names.length ? `${window.LiveUI.collectionText()}：${[...new Set(names)].join('、')}` : '';
      if (p) { p.textContent = typeof text === 'function' ? text() : text; p.hidden = !p.textContent || rows.every((r) => r == null); }
    } };
  }
  function carbonConversion(carbon) {
    const factor = carbon?.factor_kg_per_kwh, absorption = carbon?.kg_per_tree;
    const energy = Number.isFinite(factor) ? `每度电 ${factor} 千克二氧化碳` : '';
    const trees = Number.isFinite(absorption) ? `每棵树一年吸收 ${absorption} 千克` : '';
    const values = [energy, trees].filter(Boolean).join('、');
    return values ? `按${values}折算` : '';
  }
  function buildCarbon(el) {
    return ranks(el, [{ key: 'carbon', title: '按统计月份累计', bar: false, rows: () => {
      const x = data?.carbon;
      return x ? [row('co2', '碳排估算', x.co2_kg, 'kg CO₂', carbonNote(data, x.co2_kg != null), x, 'co2_kg'), row('tree', '折合树木', x.co2_kg == null ? null : x.trees, '棵', '', x, 'trees')] : null;
    } }], () => carbonConversion(data?.carbon));
  }
  function group(g, has) {
    const given = data?.groups?.find((x) => x.key === g.key);
    const figures = off() ? g.figures?.filter((f) => f.value != null || f.line) : g.figures;
    return { ...given, ...g, figures: figures?.some((f) => f.value != null || f.line || f.text && f.text !== '还没读到') ? figures : [], line: has ? g.line : '', level: given?.level, reason: ['red', 'yellow'].includes(given?.level) ? window.LiveUI.sp(given.reason) : '' };
  }
  const board = V.board($('board'), { key: 'power', sync, keepChips: true, onCount(c) {
    D.count(c);
    const hero = $('hero');
    const status = window.LiveUI.status(data); window.LiveLight.tone(hero, status.tone);
    const note = hero.querySelector('[data-part="count"]'); note.hidden = !status.note; window.LiveUI.html(note, status.note);
    const measured = data?.summary?.today_kwh != null, day = powerDay(data);
    const title = day + kind(data, 'summary') + '用电';
    const archive = measured && day !== '今天' ? ` · 数据截止 ${stamp(summaryCutoff(data))}` : '';
    const headline = measured ? `${title} ${S.text(data.summary, 'today_kwh', energy)}${basis(data, 'summary') === 'wall' ? '' : '（估算）'}${archive}` : off() ? '用电' : title + window.LiveUI.collectionText();
    window.LiveUI.html(hero.querySelector('[data-part="head"]'), status.lamp + window.LiveUI.head(headline, { lamp: false }));
  } });
  function groups() {
    const d = data, s = d?.summary, ac = d?.ac, rails = d?.rails, five = d?.five_volt, carbon = d?.carbon;
    const scene = d?.scenes?.length ? [...d.scenes].sort((a, b) => (b.kwh ?? -1) - (a.kwh ?? -1))[0] : null;
    const app = d?.apps?.slice().sort((a, b) => (b.kwh ?? -1) - (a.kwh ?? -1))[0];
    const gameSeries = d?.efficiency?.series?.find(s => s.id === 'efficiency'), game = gameSeries ? C.sum(gameSeries) : null;
    const gameFigure = (key, label, value) => ({ ...fig(key, label, value, '帧/千焦耳'), text: value == null ? undefined : String(+value.toFixed(1)), gap: key === 'efficiency' ? readingNote(blockMeta(d, 'efficiency'), '游戏能效', value != null) : '' });
    const month = { ...fig('month', `${carbonMonth(d)}${kind(d, 'carbon')}累计`, carbon?.month_kwh, '度', carbon, 'month_kwh'), gap: carbonNote(d, carbon?.month_kwh != null) };
    const known = [
      group({ key: 'power', name: '功耗与能耗', pic: '/live/img/grp-power.webp', palette: ['teal', 'violet', 'pink'],
        line: `每日${kind(d, 'days')}用电与功耗`,
        figures: [fig('today', `${powerDay(d)}${kind(d, 'summary')}累计`, s?.today_kwh, '度', s, 'today_kwh'), month, { key: 'total', label: totalTitle(d), line: 'total' }, { key: 'cpu', label: 'CPU', line: 'cpu' }, { key: 'gpu', label: '显卡', line: 'gpu' }],
        chips: [
          { key: 'parts', label: '各部分功耗', lines: [L('cpu', 'CPU'), L('gpu', '显卡'), L('platform', '主板和外设估算')], unit: 'W', stack: true, floor: 0 },
          { key: 'total', label: totalTitle(d), lines: [L('total', totalTitle(d))], unit: 'W', floor: 0 },
        ],
        build(el) {
          const box = document.createElement('div'); el.append(box);
          const readings = V.figures(box);
          const daily = document.createElement('div'); el.append(daily);
          const bars = V.block(daily, V.bars(daily, { title: `近 30 天每天${kind(d, 'days')}用电`, unit: '度', formatValue: energy, series: [{ id: 'energy', label: '累计', hue: 'teal' }] }), () => data, 'days');
          const missing = note(el, window.LiveUI.collectionText());
          return { set: () => {
            const x = data?.summary, c = data?.carbon, days = energyDays(data), b = blockMeta(data, 'days'), original = cutoff(b) ?? data?.days?.at ?? data?.days?.to;
            const stats = [fig('today', `${powerDay(data)}${kind(data, 'summary')}累计`, x?.today_kwh, '度', x, 'today_kwh'), todayPeak(x), fig('valley', powerDay(data) + '谷时', x?.today_valley_kwh, '度', x, 'today_valley_kwh'), { ...fig('month', `${carbonMonth(data)}${kind(data, 'carbon')}累计`, c?.month_kwh, '度', c, 'month_kwh'), sub: carbonNote(data, c?.month_kwh != null) }];
            const shown = off() ? stats.filter((f) => f.value != null) : stats; box.hidden = off() && !shown.length; readings.set(shown);
            box.querySelectorAll('.vz-fig__v').forEach((v) => { const m = /^(至少 )?([\d.]+) 度$/.exec(v.textContent); if (m) v.innerHTML = `${m[1] ? '<small>至少 </small>' : ''}<b>${m[2]}</b><small>度</small>`; });
            daily.hidden = days.length < 2;
            const absent = stats.filter((f) => f.value == null).map((f) => f.label); if (daily.hidden) absent.push(`每日${kind(data, 'days')}用电`); missing.hidden = off() || !absent.length; missing.textContent = !off() && absent.length ? `${window.LiveUI.collectionText()}：${absent.join('、')}` : '';
            if (!daily.hidden) bars.set({
              labels: days.map(({ day }, i) => ({ text: i % 5 === 0 || i === days.length - 1 ? day.slice(5) : '', title: day })), values: { energy: days.map((r) => r.value) },
              quality: { energy: days.map((r) => r.source !== '当天摘要' && !(instant(r.asOf) > instant(original)) && (S.partial(data?.days, 'energy') || S.partial(b, 'energy')) ? 'partial' : '') },
              notes: { energy: days.map((r) => {
                const when = stamp(r.at, r.day), replaced = when && instant(r.at) !== instant(original);
                const status = r === days.at(-1) || dayOf(original) === r.day ? readingNote(b, replaced ? '历史日统计' : '日统计', r.value != null, original ?? null, r.day) : '';
                return [when && (replaced || !status.includes(when)) && `截至 ${when}`, r.source, replaced && status.startsWith('截至') ? `历史日统计${status}` : status].filter(Boolean).join(' · ');
              }) },
            });
          } };
        },
      }, !!(d?.power || d?.days || s)),
      group({ key: 'scenes', name: '用电场景与峰谷', pic: '/live/img/use-where.webp', palette: ['blue', 'apricot'],
        line: scene ? `近 24 小时${window.LiveUI.sp(scene.label)}耗电最多` : '近 24 小时按场景、峰谷分开看',
        figures: [fig('scene', scene?.label || '最多的场景', scene?.kwh, 'kWh', scene, 'kwh'), ...['peak', 'valley'].map((key) => { const r = d?.periods?.find((r) => r.id === key); return fig(key, key === 'peak' ? '峰时' : '谷时', r?.kwh, '度', r, 'kwh'); })],
        build: (el) => ranks(el, [
          { key: 'scenes', title: '近 24 小时，电用在哪类场景', rows: () => { const list = data?.scenes; const total = list?.length && list.every((r) => r.kwh != null && !S.partial(r, 'kwh')) ? list.reduce((a, r) => a + r.kwh, 0) : null; return list?.map((r) => ({ ...row(r.id, r.label, r.kwh, 'kWh', total > 0 && r.kwh != null ? `${Math.round(r.kwh / total * 100)}%` : '', r, 'kwh'), hue: V.categoryHues[r.id] || 'stone' })) ?? null; } },
          { key: 'periods', title: '近 24 小时峰时和谷时', rows: () => data?.periods?.map((r) => ({ ...row(r.id, r.id === 'peak' ? '峰时' : r.id === 'valley' ? '谷时' : r.label, r.kwh, '度', '', r, 'kwh'), hue: r.id === 'peak' ? 'apricot' : 'violet' })) ?? null },
        ], () => {
          const sum = (list) => list?.length && list.every((r) => Number.isFinite(r.kwh) && !S.partial(r, 'kwh')) ? list.reduce((a, r) => a + r.kwh, 0) : null;
          const scenes = sum(data?.scenes), periods = sum(data?.periods), diff = scenes != null && periods != null ? periods - scenes : null;
          return '峰时 08–22 点；谷时 22–08 点。' + (diff > 0.05 ? `场景按前台程序分类合计 ${scenes.toFixed(2)} 度，峰谷按整机合计 ${periods.toFixed(2)} 度，差的 ${diff.toFixed(2)} 度没归到哪类场景。` : '');
        }),
      }, !!(d?.scenes || d?.periods)),
      group({ key: 'apps', name: '耗电应用', pic: '/live/img/head-apps.webp', palette: ['violet', 'blue'],
        line: app ? typeof appName(app) === 'object' ? window.LiveUI.sp(appName(app)) : `${window.LiveUI.sp(appName(app))}排在最前` : '按程序前台时段分摊部件能耗',
        figures: [{ ...fig('energy', appName(app) || '最多的应用', app?.kwh, 'kWh', app, 'kwh'), label: appName(app) || '最多的应用', text: app?.kwh == null ? '—' : S.text(app, 'kwh', appEnergy), gap: S.has(app) && app.gap }, fig('avg', '它在前台时的平均功率', app?.avg_w, 'W', app, 'avg_w'), fig('time', '它的前台时长', app?.seconds == null ? null : app.seconds / 3600, '小时', app, 'seconds')],
        build: (el) => ranks(el, [{ key: 'apps', title: '前台场景耗电最多的程序', mark: false, show: 5, rows: () => data?.apps?.slice().sort((a, b) => (b.kwh ?? -1) - (a.kwh ?? -1)).map(appRow) ?? null }], appsNote),
      }, !!d?.apps),
      group({ key: 'efficiency', name: '游戏能效', pic: '/live/img/grp-cpu.webp', palette: ['violet', 'pink'],
        line: '每千焦耳电产生的帧数，越高越省电', figures: [gameFigure('efficiency', '最近能效', game?.last), gameFigure('game-average', '平均能效', game?.avg), gameFigure('game-peak', '最高能效', game?.max)],
        say: () => game?.maxAt == null ? '' : `最高 ${unit(game.max, '帧/千焦耳')}（${stamp(new Date(game.maxAt * 1000).toISOString(), '')}），平均 ${unit(game.avg, '帧/千焦耳')}`,
        chips: [{ key: 'efficiency', label: '游戏能效', lines: [L('efficiency', '游戏能效')], unit: '帧/千焦耳', axisUnit: '', floor: 0 }],
        build(el) { return { set() {
          const s = data?.efficiency?.series?.find((s) => s.id === 'efficiency'), few = !s || s.points.filter(([, v]) => v != null && Number.isFinite(v)).length < 2;
          const value = C.sum(s)?.last, status = readingNote(blockMeta(data, 'efficiency'), '游戏能效', value != null);
          el.closest('.grp').querySelector('.grp__main').hidden = few; el.classList?.toggle('vz-note', !few || off()); el.hidden = !few && !status;
          el.textContent = [few && (off() && value == null ? '这块没存下来，连上后补上。' : `游戏能效 ${unit(value, '帧/千焦耳')}`), status].filter(Boolean).join(' · ');
        } }; },
      }, !!d?.efficiency),
      group({ key: 'supply', name: '电源与供电余量', pic: '/live/img/card-power-supply.webp', palette: ['pink', 'apricot'],
        line: '墙上输入、各轨电流与 5V 余量，均为估算',
        figures: [fig('wall', '墙上输入', ac?.wall_w, 'W', ac, 'wall_w'), fig('current', '输入电流', ac?.current_a, 'A', ac, 'current_a'), fig('load', '电源负载', ac?.load_pct, '%', ac, 'load_pct'), fig('headroom', '5V 余量', five?.headroom_a, 'A', five, 'headroom_a')],
        build: (el) => ranks(el, [
          { key: 'ac', title: '此刻的墙上输入 · AC 220V 估算', bar: false, rows: () => { const x = data?.ac; return x ? [row('wall', '墙上输入', x.wall_w, 'W', '', x, 'wall_w'), row('current', '220V 输入电流', x.current_a, 'A', '', x, 'current_a'), row('load', '1000W 电源负载', x.load_pct, '%', '', x, 'load_pct')] : null; } },
          { key: 'rails', title: '电源各轨电流 · 估算', bar: false, rows: () => { const x = data?.rails; return x ? [row('12v', '+12V · CPU、显卡和风扇', x.v12_a, 'A', '', x, 'v12_a'), row('5v', '+5V · USB 和灯光', x.v5_a, 'A', '', x, 'v5_a'), row('3v3', '+3.3V · 主板和 M.2', x.v3_3_a, 'A', '', x, 'v3_3_a')] : null; } },
          { key: 'five_volt', title: '5V 供电余量 · 估算', bar: false, rows: () => { const x = data?.five_volt; return x ? [row('current', '电流', x.current_a, 'A', '', x, 'current_a'), row('load', '负载率', x.load_pct, '%', '', x, 'load_pct'), row('headroom', '余量', x.headroom_a, 'A', supplyNote(x), x, 'headroom_a')] : null; } },
        ], '和功耗曲线是两种估法，数对不上正常。'),
      }, !!(ac || rails || five)),
      group({ key: 'carbon', name: `${carbonMonth(d)}碳排足迹`, pic: '/live/img/grp-long.webp', palette: ['teal', 'blue'],
        line: `${carbonMonth(d)}的碳排折合`,
        figures: [{ ...fig('co2', '碳排估算', carbon?.co2_kg, 'kg CO₂', carbon, 'co2_kg'), gap: carbonNote(d, carbon?.co2_kg != null) }, fig('tree', '树木折合', carbon?.co2_kg == null ? null : carbon?.trees, '棵', carbon, 'trees')],
        build: buildCarbon,
      }, !!carbon),
    ];
    return window.LiveAdaptive?.groups(data, known, ['summary', 'ac', 'rails', 'five_volt', 'periods', 'days']) || known;
  }
  window.LiveUI.onBeijingDayChange(() => { if (data) board.set(groups()); });
  D.mount({ resource: 'computer/power', board,
    merge(d) { const pack = D.merge({ ...d, efficiency: gameRange(d?.efficiency) }, ['power', 'efficiency']); return { ...pack, series: pack.series.map((s) => ({
      ...s, label: ({ cpu: 'CPU', gpu: '显卡', platform: '主板和外设估算' })[s.id] || s.label,
      ...(s.id === 'efficiency' ? { chart_window: { ...s.chart_window, off_spans: [] } } : {}),
    })) }; },
    render(d, meta) {
      data = d; at = meta?.at || d?.window?.to || null; const list = groups(); board.set(list); window.LiveAdaptive?.tail($('board'), list);
      document.querySelectorAll('#board .grp__fv').forEach(v => { const m = /^(至少 )?([\d.]+) 度$/.exec(v.textContent); if (m) v.innerHTML = `${m[1] ? '<small>至少 </small>' : ''}<b>${m[2]}</b><small>度</small>`; });
      if (d?.note?.length) { const U = window.LiveUI; U.html($('hero').querySelector('[data-part="note"]'), [].concat(d.note).map((s) => `<span>${U.esc(U.sp(s).replace(/(\d+(?:\.\d+)?)\s*kWh/g, (_, n) => energy(Number(n))))}</span>`).join('')); }
      S.finish(d, { power: ['summary', 'power', 'days', 'carbon'], scenes: ['scenes', 'periods'], supply: ['ac', 'rails', 'five_volt'] });
    },
  });
})();
