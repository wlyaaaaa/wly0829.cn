// 已有名称与画面优先，新增分组沿用同页的卡片和配色。
(() => {
  'use strict';
  const current = new Map();
  const id = row => row.key ?? row.id;
  const name = (row, known = {}) => known[id(row)] || [row.label, row.name, row.title, row.text].find(v => v != null && (typeof v === 'object' || String(v).trim())) || String(id(row) ?? '未命名');
  const hue = (key, palette) => palette[[...String(key)].reduce((n, c) => (n * 31 + c.codePointAt(0)) >>> 0, 0) % palette.length];
  function groups(data, known, aliases = []) {
    const used = new Set([...known.map(g => g.key), ...aliases]);
    const palette = [...new Set(known.flatMap(g => g.palette || []))];
    return known.concat((data?.groups || []).filter(g => !used.has(id(g)) && used.add(id(g))).map(g => {
      const key = id(g), pack = String(key).split('.').reduce((value, part) => value?.[part], data) || g;
      current.set(key, pack);
      const lines = pack.series || data.series?.filter(s => s.group === key) || [];
      const chips = lines.map(s => ({ key: s.id, label: name(s), lines: [{ id: s.id, label: name(s), hue: hue(s.id, palette.length ? palette : ['teal']) }], unit: s.unit }));
      return { ...g, from: pack.from || data.window?.from, to: pack.to || data.window?.to, series: lines, adaptive: true, key, name: name(g), pic: known[0]?.pic, palette: [hue(key, palette.length ? palette : ['teal'])],
        reason: g.reason || g.why, line: g.reason || g.why || '', figures: g.figures || chips.slice(0, 4).map(c => ({ key: c.key, label: c.label, line: c.key })), chips, build(el) { return { set() {
          const pack = current.get(key), rows = Array.isArray(pack) ? pack : pack?.items || pack?.rows || [];
          window.LiveUI.html(el, rows.map(row => `<p class="row__sub">${window.LiveUI.fieldHtml(name(row), { name: '名称' })}</p>`).join(''));
        } }; } };
    }));
  }
  function tail(root, list) {
    const extra = new Set(list.filter(g => g.adaptive).map(g => String(g.key)));
    for (const card of root.querySelectorAll(':scope > .grp')) if (extra.has(card.dataset.key)) root.append(card);
  }
  window.LiveAdaptive = { id, name, hue, groups, tail };
})();
