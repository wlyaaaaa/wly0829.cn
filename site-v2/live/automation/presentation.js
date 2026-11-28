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
  const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' });
  const single = /^\p{Script=Han}$/u;
  const keep = word => `<span class="live-unit">${word}</span>`;
  // 和实况首页一样，在词之间留换行处，单字跟相邻的词一起走。
  const keepWords = html => html.replace(/<[^>]*>|&[\w#]+;|第[ \t]*\d+[ \t]*轮|\d+(?:[.,]\d+)?[ \t]*(?:小时(?:[ \t]*\d+[ \t]*分(?:钟)?)?|分钟|分|秒|轮|次|件|条|份)|[A-Za-z0-9]+(?:[.-][A-Za-z0-9]+)+|\p{Script=Han}{2,}/gu, part => {
    if (/^[<&]/.test(part)) return part;
    if (part.length <= 4 || !/^\p{Script=Han}+$/u.test(part)) return keep(part);
    const words = [];
    for (const { segment } of segmenter.segment(part)) {
      if (words.length && (single.test(segment) || single.test(words.at(-1)))) words[words.length - 1] += segment;
      else words.push(segment);
    }
    return words.map(keep).join('<wbr>');
  });
  function settingNotices() {
    let current, pending;
    const clear = () => { current?.close(); current = pending = null; };
    return {
      clear,
      waiting: id => pending === id,
      start(id) { clear(); pending = id; current = window.SiteNotice('正在保存…'); },
      finish(state, text) {
        pending = null;
        if (!text) { clear(); return; }
        const notice = current ||= window.SiteNotice(text);
        notice.set(state, text);
        return (next, heading) => { if (current === notice) notice.set(next, heading); };
      },
    };
  }
  // 没收到写入结果，只能等一次新读数来核对。暂停同时比对时刻。
  function settingReadback(update, setting, want, when) {
    const { mode, until_at: until } = setting || {};
    if (!['on', 'off', 'paused'].includes(mode) || mode === 'paused' && want.until && !until) return;
    const stamp = value => typeof value === 'number' ? value * 1000 : Date.parse(value);
    if (mode === want.mode && (!want.until || stamp(until) === stamp(want.until))) { update?.('ok', '已保存'); return; }
    const current = mode === 'paused' ? until ? `暂停到 ${when(typeof until === 'number' ? new Date(stamp(until)).toISOString() : until)}` : '暂停中'
      : { on: '开着', off: '关着' }[mode];
    update?.('fail', `最新读数还是${current}`);
  }
  function retrying(reading) {
    const status = reading?.meta?.status;
    return !!reading && !reading.offline && !reading.publicPaused && !reading.meta?.withdrawn && !reading.meta?.publicationRevoked
      && (reading.warming || status === 0 || status === 408 || status === 429 || status >= 500
        || status >= 200 && status < 400 && reading.fallbackNote && reading.meta?.source !== 'fallback');
  }
  const staleAt = reading => reading?.data && retrying(reading) ? reading.shownAt || reading.meta?.at : '';
  window.AutomationPresentation = { lamp, tag, kinds, keepWords, settingNotices, settingReadback, retrying, staleAt };
})();
