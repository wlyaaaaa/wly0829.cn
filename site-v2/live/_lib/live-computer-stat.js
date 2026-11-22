(() => {
  const partial = (meta, key = 'value') => meta?.lower_bound === true || meta?.[key]?.lower_bound === true || meta?.q === 'partial' && (!Array.isArray(meta.partial) || meta.partial.includes(key));
  const gap = (meta, key = 'value') => partial(meta, key) ? meta.gap || '' : '';
  function text(value, unit = '', meta = {}, key = 'value') {
    meta ||= {};
    if (value == null) return window.LiveUI?.offline?.() ? '这块没存下来，连上后补上。' : window.LiveUI.collectionText(meta.label || '', meta, null, key);
    const rendered = window.LiveChart.value(value, unit) ?? String(value);
    return `${partial(meta, key) && !/^(至少\s*|不到)/.test(rendered) ? '至少 ' : ''}${rendered}`;
  }
  window.ComputerStat = { partial, text, gap };
})();
