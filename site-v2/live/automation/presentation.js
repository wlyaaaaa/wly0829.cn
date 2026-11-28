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
  const markup = /<span\b[^>]*class="[^"\n]*\b(?:live-unit|au-nobr|iss-nowrap|task-phrase|ah-keep)\b[^"\n]*"[^>]*>[^<]*<\/span>|<[^>]*>|&[\w#]+;/;
  const dates = /\d{1,2}[ \t]*月[ \t]*\d{1,2}[ \t]*日(?:[ \t]*(?:北京时间[ \t]*)?\d{1,2}:\d{2}(?::\d{2})?)?|(?<![\w-])(?:\d{4}-)?\d{1,2}-\d{1,2}(?![\w-])(?:[ \t]+(?:周[一二三四五六日][ \t]+)?\d{1,2}:\d{2}(?::\d{2})?)?|(?<![\w:])\d{1,2}:\d{2}(?::\d{2})?(?![\w:])/;
  const amounts = /第[ \t]*\d+[ \t]*轮|\d+(?:[.,]\d+)?[ \t]*(?:小时(?:[ \t]*\d+[ \t]*分(?:钟)?)?|分钟|分|秒|轮|次|件|条|项|份|天|处|个|[KMG]i?B)|\b[A-Z][ \t]*盘/;
  const phrases = /这次(?:没读到|读不到)|不完整|看得到|几点跑|随时派|备份|完成|自己开工|下一次开工|自动接活|定时任务|自己|收到|当时|采集|软件|下载目录|验收|太久|回复/;
  const unitsFor = parts => new RegExp(`(${parts.map(part => part.source).join('|')})`, 'gu');
  const baseUnits = [markup, dates, amounts, phrases, /（[^（）\n]{1,10}）/];
  const units = unitsFor(baseUnits);
  const rowUnits = unitsFor([...baseUnits, /入口核对|要(?:你|本人)定|修不住/, /(?<![\w/\\:.-])[A-Za-z]{2,12}(?![\w/\\:.-])/, /[ \t]+›/]);
  // 先保护完整日期和短语，再切普通中文。长英文、地址和路径仍由原容器换行。
  const wrap = (html, pattern) => html.split(pattern).map((part, index) => index % 2
    ? (/^[<&]/.test(part) ? part : part.endsWith('›') ? '&nbsp;›' : keep(part)) : part.replace(/\p{Script=Han}{2,}/gu, wordsIn)).join('');
  const keepWords = html => wrap(html, units);
  const keepRowWords = html => wrap(html, rowUnits);
  function wordsIn(part) {
    if (part.length <= 4) return keep(part);
    const words = [];
    for (const { segment } of segmenter.segment(part)) {
      const prev = words.at(-1);
      if (prev && prev.length + segment.length <= 6 && (single.test(segment) || single.test(prev))) words[words.length - 1] += segment;
      else words.push(segment);
    }
    return words.map(keep).join('<wbr>');
  }
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
  window.AutomationPresentation = { lamp, tag, kinds, keepWords, keepRowWords, settingNotices, settingReadback, retrying, staleAt };
})();
