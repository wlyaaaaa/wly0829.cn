// 可整块移除：只读已有的电脑状态和手机亮屏时段，不改变原始数据。
(() => {
  'use strict';
  function combine(computer, phone) {
    const pc = computer?.day, tl = phone?.series?.find(s => s.id === 'usage-timeline')?.timeline, mobile = tl?.rows?.phone;
    if (!pc || !mobile) return null;
    // 只算两边时间带都覆盖的那段（手机只有近 24 小时），免得前两天整段空着。
    const from = Math.max(Date.parse(pc.from), Date.parse(mobile.from)) / 1000, to = Math.min(Date.parse(pc.to), Date.parse(mobile.to)) / 1000;
    if (!(to > from)) return null;
    const intervals = (row, states, active) => (row.spans || []).flatMap(([t, s], i, spans) => {
      const a = Math.max(t, Date.parse(row.from) / 1000, from), b = Math.min(spans[i + 1]?.[0] ?? Date.parse(row.to) / 1000, Date.parse(row.to) / 1000, to);
      return b > a ? [[a, b, s == null || !states?.[s] || states[s].id === 'unrecorded' ? null : active.includes(states[s].id)]] : [];
    });
    const a = intervals(pc, computer.states, ['work', 'active']), b = intervals(mobile, tl.states, ['on']);
    const edges = [...new Set([from, to, ...a.flatMap(r => r.slice(0, 2)), ...b.flatMap(r => r.slice(0, 2))])].sort((x, y) => x - y);
    const totals = [0, 0, 0], spans = []; let gaps = 0, known = 0, lastGap = false, ai = 0, bi = 0, pcMissing = 0, phoneMissing = 0;
    for (let i = 0; i < edges.length - 1; i++) {
      const t = edges[i], end = edges[i + 1];
      while (a[ai] && a[ai][1] <= t) ai++;
      while (b[bi] && b[bi][1] <= t) bi++;
      const x = a[ai]?.[0] <= t ? a[ai][2] : null, y = b[bi]?.[0] <= t ? b[bi][2] : null;
      const gap = x == null || y == null, state = gap || !x && !y ? null : x && y ? 2 : x ? 0 : 1;
      if (gap && !lastGap) gaps++;
      if (!gap) known += end - t;
      if (x == null) pcMissing += end - t;
      if (y == null) phoneMissing += end - t;
      if (state != null) totals[state] += end - t;
      if (!spans.length || spans.at(-1)[1] !== state) spans.push([t, state]);
      lastGap = gap;
    }
    return { total: totals.reduce((s, n) => s + n, 0), computer: totals[0], phone: totals[1], overlap: totals[2], gaps, known, missing: to - from - known, pcMissing, phoneMissing, from: new Date(from * 1000).toISOString(), to: new Date(to * 1000).toISOString(), spans };
  }
  // 缺多少写成时长，分到电脑、手机两边；零碎的段数不报（几十小段读不出意思）。
  function gapText(result, dur) {
    if (!result || !(result.missing >= 60)) return '';
    const sides = [['电脑', result.pcMissing], ['手机', result.phoneMissing]].filter(([, s]) => s >= 60).map(([name, s]) => `${name}缺 ${dur(s)}`);
    return `这 24 小时里有 ${dur(result.missing)}没有记录${sides.length ? `（${sides.join('、')}）` : ''}，这些时段不算进上面的数。`;
  }
  const windowSeconds = w => (Date.parse(w.to) - Date.parse(w.from)) / 1000;
  // 两段都记全了才比较；页头和下面这句用同一个判断。没有对比数据（旧数据包）时返回 null。
  function comparable(c) {
    if (!c?.window || !c.before_window || c.current?.active == null || c.before?.active == null) return null;
    const S = window.LiveStat;
    return [[c.current, c.window], [c.before, c.before_window]].every(([s, w]) => !S?.partial(s, 'active') && s.coverage?.missing_s === 0 && s.coverage.observed_s >= windowSeconds(w));
  }
  function comparisonText(c, dur, unread) {
    if (comparable(c) == null) return unread;
    const date = iso => new Date(Date.parse(iso) + 8 * 3600000).toISOString().slice(5, 16).replace('T', ' ');
    const period = w => `${date(w.from)}–${date(w.to)}`;
    const length = w => {
      const hours = (Date.parse(w.to) - Date.parse(w.from)) / 3600000;
      return Number.isInteger(hours / 24) ? `${hours / 24} 天` : Number.isInteger(hours) ? `${hours} 小时` : '一段时间';
    };
    const current = '近 ' + length(c.window), previous = '此前 ' + length(c.before_window);
    const sides = [[c.current, c.window, current], [c.before, c.before_window, previous]];
    if (!comparable(c)) return `电脑在用记录不全，暂不比较。${sides.map(([s, w, name]) => `${name}（${period(w)}）：${s.coverage ? `已记录 ${dur(s.coverage.observed_s)}，缺 ${dur(s.coverage.missing_s)}` : unread}`).join('；')}。`;
    const diff = c.current.active - c.before.active;
    return `电脑${current}比${previous}${diff === 0 ? '用得一样久' : `${diff > 0 ? '多' : '少'}用了 ${dur(Math.abs(diff))}`}（${current} ${period(c.window)}；${previous} ${period(c.before_window)}）。`;
  }
  function create(getUsage, refresh) {
    const U = window.LiveUI, V = window.LiveViz;
    let phone = null, started = false;
    return { key: 'union', name: '电脑或手机在用的时间', palette: ['teal', 'teal'], line: () => '',
      build(el) {
        el.innerHTML = '<div class="use-union-values" data-union-values></div><div data-union-track></div><p class="use-note" data-union-note></p><p class="use-note" data-union-comparison></p>';
        const track = V.timeline(el.querySelector('[data-union-track]'), { rows: [{ key: 'union', label: '去掉重叠', short: '去掉重叠' }] });
        const set = () => {
          const result = combine(getUsage(), phone), available = result?.known > 0;
          U.html(el.querySelector('[data-union-values]'), [['total', '去掉重叠后一共'], ['computer', '只用电脑'], ['phone', '只用手机'], ['overlap', '两边同时亮着']].map(([key, label]) => `<div><span>${U.fieldHtml(label)}</span><b>${U.fieldHtml(available ? V.dur(result[key]) : U.offline?.() ? '这块没存下来' : U.collectionText())}</b></div>`).join(''));
          track.set(available ? { states: [{ id: 'computer', label: '只用电脑', hue: 'teal' }, { id: 'phone', label: '只用手机', hue: 'violet' }, { id: 'both', label: '两边同时亮着', hue: '#00A650' }], rows: { union: result } } : null);
          const note = '近 24 小时（手机的时间带只记这么长）。只合计两边都有记录的时段；电脑按在用状态，手机按亮屏，亮屏不代表一直在操作。';
          U.html(el.querySelector('[data-union-note]'), U.fieldHtml(`${note}${gapText(result, V.dur)}`));
          U.html(el.querySelector('[data-union-comparison]'), U.fieldHtml(comparisonText(getUsage()?.comparison, V.dur, U.offline?.() ? '这块没存下来' : U.collectionText())));
        };
        if (!started) {
          started = true;
          window.Live.watch('phone/charts', { group: 'usage', range: '24h' }, {
            data(data, meta) { phone = meta.source === 'fixture' && data?.ranges ? data.ranges['24h'] : data; refresh(); },
            phase(state) { if (state.data == null && ['none', 'gone'].includes(state.phase)) { phone = null; set(); } },
          });
        }
        return { set };
      },
    };
  }
  window.UsageUnion = { combine, comparable, comparisonText, create };
})();
