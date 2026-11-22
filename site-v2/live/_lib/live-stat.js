// 统计下限：q 与 partial 只修饰同一对象内的裸数。
(() => {
  'use strict';
  const partial = (o, key) => o?.lower_bound === true || o?.[key]?.lower_bound === true || o?.q === 'partial' && (!Array.isArray(o.partial) || o.partial.includes(key));
  const has = (o) => o?.q === 'partial' && (!Array.isArray(o.partial) || o.partial.some((key) => Object.hasOwn(o, key)));
  const lower = (text) => /^(至少\s*|不到)/.test(text) ? text : `至少 ${text}`;
  const text = (o, key, format = String) => o?.[key] == null ? window.LiveUI?.offline?.() ? '这块没存下来，连上后补上。' : window.LiveUI.collectionText(o?.label || '', o, null, key) : (partial(o, key) ? lower(format(o[key])) : format(o[key]));
  function figure(f, o, key) {
    if (o?.[key] == null || f.value == null || !(f.lower_bound === true || partial(o, key))) return f;
    return { ...f, text: lower(f.text ?? window.LiveChart?.value(f.value, f.unit) ?? String(f.value)), label: f.label + (o.gap ? ` · ${o.gap}` : '') };
  }
  function row(r, o, key) {
    return { ...r, text: r.value != null && o?.[key] != null && (r.lower_bound === true || partial(o, key)) ? lower(r.text) : r.text, sub: [r.sub, has(o) && o.gap].filter(Boolean).join(' · ') };
  }
  function scan(o, gaps = new Set()) {
    let found = has(o);
    if (found && o.gap) gaps.add(o.gap);
    if (o && typeof o === 'object') for (const v of Object.values(o)) if (v && typeof v === 'object') found = scan(v, gaps).partial || found;
    return { partial: found, gaps };
  }
  function notes(o, out = new Set()) {
    if (!o || typeof o !== 'object') return out;
    if (typeof o.note === 'string' && o.note) out.add(o.note);
    for (const [key, v] of Object.entries(o)) if (key !== 'states') notes(v, out);
    return out;
  }
  function finish(data, map = {}) {
    queueMicrotask(() => {
      const state = scan(data), hero = document.getElementById('hero'), note = hero?.querySelector('[data-part="note"]');
      note?.querySelector('[data-quality]')?.remove();
      if (state.gaps.size && note) { const n = document.createElement('span'); n.className = 'stat-gap'; n.dataset.quality = ''; n.textContent = [...state.gaps].join('；'); note.append(n); note.hidden = false; }
      document.querySelectorAll('[data-stat-note]').forEach((el) => el.remove());
      const seen = new Set([].concat(data?.note || []));
      for (const card of document.querySelectorAll('.grp[data-key]')) {
        const keys = map[card.dataset.key] || [card.dataset.key], messages = new Set();
        for (const key of keys) { notes(data?.[key], messages); notes(data?.blocks?.[key], messages); }
        const status = card.querySelector('.grp__status');
        if (!status) continue;
        for (const text of messages) if (!seen.has(text)) {
          const el = document.createElement('span');
          el.dataset.statNote = '';
          el.textContent = (status.innerText.trim() ? ' · ' : '') + text;
          status.append(el);
          seen.add(text);
        }
        window.LiveViz?.cardLineTitle(status.parentElement);
      }
    });
  }
  window.LiveStat = { partial, has, text, figure, row, finish };
})();
