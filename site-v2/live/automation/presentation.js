(() => {
  'use strict';
  const colors = ['green', 'blue', 'yellow', 'red', 'gray'];
  // 自动任务的灯按全部后台 AI 算，后端给 level、why、attention_count；没给灯色或连不上就是灰灯“读不到”。
  // 访客版的 why 可能被换成能公开的说法或省掉，省掉时只亮灯、不写那句。
  function lamp(data, offline = false) {
    if (!offline && colors.includes(data?.level)) {
      return { level: data.level, why: data.why || '', attention: Number.isInteger(data.attention_count) ? data.attention_count : null };
    }
    return { level: 'gray', why: '读不到后台 AI 的状态', attention: null };
  }
  const kinds = { scheduled: '定时', repair: '修毛病', routine: '例行', other: '后台' };
  // 小标：“定时 · Codex”“修毛病 · Sol”“例行 · Claude”，软件名和型号照数据写。
  function tag(kind, who, esc) {
    const name = kinds[kind];
    if (!name) return '';
    return `<span class="auto-tag" data-kind="${esc(kind)}">${name}${who ? ` · ${esc(who)}` : ''}</span>`;
  }
  window.AutomationPresentation = { lamp, tag, kinds };
})();
