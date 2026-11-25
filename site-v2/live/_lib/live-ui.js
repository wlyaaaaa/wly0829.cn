// 实况共用的小件：字和数怎么写、按钮（复制一句话／直接打开）、页眉右边“几点读到”和〔问情况〕、
// 列表按条目更新（新的落下、下去的淡出、变了的淡换）、收着的往下长开、“新”字、加载中（雾里显影）。第一、二、三层页都用这一份。
// 取数只走 window.Live（live-client.js）；这里不请求任何东西。
//
// 加载中怎么接（方案：front\brainstorm\加载中-独立.md 方向一“雾里显影”；什么时候算在读由 live-client.js 给 state.phase）：
//   const r = LiveUI.reading(card.querySelector('.card__body'), { ghost: LiveUI.ghost.card(2), name: '这个任务' });
//   Live.watch('tasks/x', null, { phase: (state) => { if (state.data == null) r.set(state); },
//     link(state) { if (state.data == null) { 读完没数（phase 是 none）时自己写“还没读到”; return; } 画真内容(state.data); r.done(); } });
//   一串行：LiveUI.reading(那一节, { ghost: LiveUI.ghost.rows(4) })；一组曲线的一格：{ ghost: LiveUI.ghost.chart() }；
//   一个数：LiveUI.reading(dd, { ghost: LiveUI.ghost.value(), inline: true })（数的位置先空着）。节里不靠数的小标题加 data-keep，在读时照样显示。
//   同一份数喂好几块时，“这块要多读一会儿”只让第一块说：其余的加 { slow: false }。
//   电脑不在线、这块又没存下来（phase 是 gone）时，r.set 自己把这块收成一句灰色、静止的话；有存下的旧数时 phase 是 ready，照常画。
(() => {
  'use strict';
  const root = document.documentElement;

  // 只改已经出页的字。原始数据、链接、按钮参数和表单值仍用来源的内容。
  const deviceNames = { 主: '台式机', 副: '笔记本' };
  const programNames = new Map(Object.entries({
    chrome: 'Google Chrome', 'chrome 浏览器': 'Google Chrome', '浏览器 (chrome)': 'Google Chrome',
    pixpin: 'PixPin', 'pixpin 截图工具': 'PixPin',
    weixin: '微信', wechat: '微信', '微信电脑版': '微信',
    claude: 'Claude 桌面端', 'claude desktop': 'Claude 桌面端',
    codex: 'Codex', chatgpt: 'ChatGPT', antigravity: 'Antigravity', 'antigravity-x64': 'Antigravity（x64）', sunshine: 'Sunshine', 'clash-verge': 'Clash Verge',
    msedge: 'Microsoft Edge', msedgewebview2: 'Microsoft Edge WebView2', svchost: 'Windows 服务主机', explorer: '文件资源管理器', taskmgr: '任务管理器',
    dwm: '桌面窗口管理器', werfault: 'Windows 错误报告', windowsterminal: 'Windows 终端',
    startmenuexperiencehost: 'Windows 开始菜单', shellexperiencehost: 'Windows 桌面界面宿主',
    applicationframehost: 'Windows 应用窗口宿主', searchhost: 'Windows 搜索', textinputhost: 'Windows 文本输入',
    python: 'Python', pythonw: 'Python（无控制台）', pwsh: 'PowerShell 7（命令行）', 'powershell 7': 'PowerShell 7（命令行）', powershell: 'Windows PowerShell（命令行）',
    wallpaperui: '动态壁纸组件',
  }));
  function programName(value) {
    if (typeof value !== 'string') return value;
    const name = value.trim().replace(/^(?:\d+\s*·\s*)?(?:⚙️\s*)?/u, '').replace(/\.exe$/i, '');
    return programNames.get(name.trim().toLowerCase()) ?? name;
  }
  const deviceWords = /(?<!坐在|坐)([主副])驾驶(?!座|位|席|员|乘客|车门|车窗|安全带)(?:[ \t\u00a0]*(?:台式电脑|台式机|笔记本电脑|笔记本|电脑))?/g;
  const shortDeviceWords = /([主副])驾[ \t\u00a0]*(?:台式电脑|台式机|笔记本电脑|笔记本|电脑)|(?<![\p{L}\p{N}])([主副])驾(?=\s*(?:$|[：:、·/／|｜）】」]|CPU\b|GPU\b|MCP\b))/gu;
  const deviceLabel = text => text.replace(deviceWords, (_, role) => deviceNames[role])
    .replace(shortDeviceWords, (_, role, label) => deviceNames[role || label]);
  const labelAttrs = ['title', 'alt', 'aria-label', 'aria-description', 'aria-valuetext', 'placeholder', 'label'];
  const rawText = 'script,style,template,textarea,[contenteditable]';
  function showDeviceAttr(el, attr) {
    const before = el.getAttribute(attr);
    if (before == null) return;
    const label = deviceLabel(before);
    if (label !== before) el.setAttribute(attr, label);
  }
  function showDeviceNames(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const label = deviceLabel(node.data), parent = node.parentElement;
      if (label === node.data || parent?.closest(rawText)) return;
      const option = parent?.closest('option:not([value])');
      if (option) option.value = option.value;
      node.data = label;
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      for (const attr of labelAttrs) showDeviceAttr(node, attr);
      if (node.matches(rawText)) return;
    }
    for (const child of node.childNodes) showDeviceNames(child);
  }
  showDeviceNames(root);
  new MutationObserver(changes => {
    for (const change of changes) {
      if (!root.contains(change.target)) continue;
      if (change.type === 'attributes') showDeviceAttr(change.target, change.attributeName);
      else if (change.type === 'characterData') showDeviceNames(change.target);
      else for (const node of change.addedNodes) if (root.contains(node)) showDeviceNames(node);
    }
  }).observe(root, { subtree: true, childList: true, characterData: true, attributeFilter: labelAttrs });

  const liveNavigation = window.navigation;
  // history.replaceState 会清掉这条记录上的导航状态；每次存完位置再记一遍本页是哪一版，返回链接才认得出上一页。
  function markLiveView() {
    const entry = liveNavigation?.currentEntry;
    if (entry) try { liveNavigation.updateCurrentEntry({ state: { ...entry.getState(), livePublicView: window.LiveView?.isPublic() } }); } catch { /* 记不上就照普通换页。 */ }
  }
  markLiveView();
  const plainClick = e => e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey;
  // ?self=1 / ?self=0 只是本人设备记一下“别算进访客”，不改页面内容；比对上一页是不是同一目的地时不算它（M633）。
  const pageSearch = href => { const u = new URL(href); u.searchParams.delete('self'); return u.search; };
  // 正文的返回链接只在上一条历史确实是同一目的地时恢复原页位置。
  function restoreBack(e, link = e.currentTarget) {
    if (e.defaultPrevented || !plainClick(e) || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
    const index = liveNavigation?.currentEntry?.index;
    const entry = index > 0 ? liveNavigation.entries()[index - 1] : null;
    if (!entry?.url || entry.getState()?.livePublicView !== window.LiveView?.isPublic()) return;
    const previous = new URL(entry.url);
    // 回实况首页的链接带“#卡片”：上一条去掉 # 后面那段就是实况首页时直接后退，回到离开时的位置（M229、M598，各页一样）。
    const liveHome = link.pathname === '/live/';
    if (previous.origin !== link.origin || previous.pathname !== link.pathname || pageSearch(previous.href) !== pageSearch(link.href) ||
        (link.hash && !liveHome && previous.hash !== link.hash)) return;
    e.preventDefault();
    history.back();
  }
  // 没自己接上面这个的页（自动任务）点“返回总览”也一样回到点进来的那张卡；自己接了的页先处理，这里见已拦下就不动（M598）。
  document.addEventListener('click', e => {
    const link = e.target instanceof Element && e.target.closest('a[data-back][href]');
    if (link && link.pathname === '/live/') restoreBack(e, link);
  });

  // 页眉链接照地址回实况总览；已经在总览时回到页首。
  function liveHeaderBack() {
    if (!/^\/live(?:\/|$)/.test(location.pathname) || /^\/live\/usage(?:\/(?:index\.html)?)?$/.test(location.pathname)) return;
    const link = [...document.querySelectorAll('#topbar a[href]')]
      .find(a => new URL(a.href, location.href).pathname === '/live/');
    if (!link) return;
    link.style.touchAction = 'manipulation';
    link.addEventListener('click', e => {
      if (!plainClick(e) || link.pathname !== location.pathname || link.search !== location.search) return;
      e.preventDefault();
      if (location.hash) history.replaceState(history.state, '', link.href);
      window.scrollTo({ left: 0, top: 0, behavior: 'instant' });
    });
  }
  const offline = () => window.Live?.offline?.() || !!root.classList?.contains('live-offline');
  const speed = () => parseFloat(getComputedStyle(root).getPropertyValue('--mo-speed')) || 1;
  const cssVar = (name, fallback) => getComputedStyle(root).getPropertyValue(name).trim() || fallback;

  // —— 字 ——
  const esc = (s) => String(s && typeof s === 'object' ? fieldText(s) : typeof s === 'number' && !Number.isFinite(s) ? '' : s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  // 只包展示文字；各宽度都把读数、完整时长、日期和时刻连在一起。
  const tight = matchMedia('(max-width: 1440px)');
  const nowrap = s => esc(s).replace(/数据截止(?=\s+\d)/g, '数据截至').replace(/AI[ \t]+在修[ \t]+\d+[ \t]+件|（(?:(?:记录到|截至|上次)\s*)?(?:\d{1,2}-\d{2}\s+)?\d{1,2}:\d{2}(?::\d{2})?）|(?:还剩|共)\s*\d+(?:\.\d+)?\s*[GMKT]B|\d+[ \t]*(?:天|小时|分钟|秒|分)(?:[ \t]*\d+[ \t]*(?:天|小时|分钟|秒|分))+(?:前|后)?|\d{4}-\d{2}-\d{2}|\d{1,2}-\d{2}|\d{1,2}:\d{2}(?::\d{2})?|\d+×\d+|\d+(?:[.,]\d+)*[ \t]*(?:[GMKT]?B(?:\/s)?|kWh|ms|FPS|[GM]?Hz|W|%|℃|°C|小时|分钟|秒|分|天|个月|年|个|件|项|次|份|台|条|帧(?:\/秒)?)(?:前|后)?/g, '<span class="live-unit">$&</span>');
  tight.addEventListener?.('change', () => {
    for (const span of document.querySelectorAll('main .live-unit')) { const parent = span.parentNode; span.replaceWith(...span.childNodes); parent.normalize(); }
    const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT), nodes = []; let node;
    while ((node = walker.nextNode())) if (!node.parentElement.closest('script,style,svg,textarea,select')) nodes.push(node);
    for (const text of nodes) {
      const html = nowrap(text.textContent); if (html === esc(text.textContent)) continue;
      const template = document.createElement('template'); template.innerHTML = html; text.replaceWith(template.content);
    }
  });
  // 汉字和数字、字母之间留一个空：后端给“2个在干”，页上写“2 个在干”
  const sp = (s) => String(s && typeof s === 'object' ? fieldText(s) : typeof s === 'number' && !Number.isFinite(s) ? '' : s ?? '')
    .replace(/数据截止 (\d{2}-\d{2}) (\d{2}:\d{2})/g, (s, d, t) => d === new Date(Date.now() + 8 * 3600000).toISOString().slice(5, 10) ? `数据截止 ${t}` : s)
    .replace(/([一-鿿])([0-9A-Za-z])/g, '$1 $2')
    .replace(/([0-9A-Za-z%℃])([一-鿿])/g, '$1 $2');

  const clock = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const day = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', month: '2-digit', day: '2-digit' });
  const time = (at, precision = at?.at_precision) => { at = typeof at === 'object' && at ? at.at : at; return at && precision !== 'date' && !/^\d{4}-\d\d-\d\d$/.test(at) ? clock.format(new Date(at)) : ''; };
  const date = (at) => (at = typeof at === 'object' && at ? at.at : at) ? day.format(new Date(at)).replace('/', '-') : '';
  function onBeijingDayChange(update) {
    const dayMs = 86400000, local = () => Date.now() + 8 * 3600000;
    let day = Math.floor(local() / dayMs), timer;
    function check() {
      const at = local(), next = Math.floor(at / dayMs);
      clearTimeout(timer);
      timer = setTimeout(check, (next + 1) * dayMs - at);
      if (day !== next) { day = next; update(); }
    }
    document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
    window.addEventListener('pageshow', check);
    check();
  }
  // 大小、流量、网速：实况一律按 1024 进位（本人 11-22 07:00），写 B、KB、MB、GB、TB，网速传 unit 'B/s'
  function trafficBytes(n, unit = 'B', lower = false) {
    const magnitude = Math.abs(n), power = magnitude >= 2 ** 40 ? 4 : magnitude >= 2 ** 30 ? 3 : magnitude >= 2 ** 20 ? 2 : magnitude >= 1024 ? 1 : 0;
    const value = n / 1024 ** power, prefix = ['', 'K', 'M', 'G', 'T'][power];
    const digits = Math.abs(value) < 10 ? 2 : 1;
    const shown = lower && power ? Math.floor(value * 10 ** digits) / 10 ** digits : Number(value.toFixed(digits));
    return `${shown} ${prefix}${unit}`;
  }
  const separateTrafficNote = '这里只算量到的 Claude 桌面版和它自带程序的流量，这笔单独记，不加进代理流量总数。';
  function separateTraffic(row) {
    if (!row || row.name !== 'Claude' || ![row.upload, row.download].every(Number.isSafeInteger) || ![row.from, row.to].every(at => Number.isFinite(Date.parse(at)))) return null;
    const bytes = n => `至少 ${trafficBytes(n, 'B', true)}`;
    const stamp = at => `${date(at)} ${time(at)}`;
    const note = `计量从 ${stamp(row.from)} 到 ${stamp(row.to)} · ${row.note || separateTrafficNote}`;
    const upload = bytes(row.upload), download = bytes(row.download), total = bytes(row.upload + row.download);
    return { name: row.name, upload, download, total, note, summary: `上传 ${upload} · 下载 ${download} · 合计 ${total} · ${note}` };
  }
  function accumulatingText(a) {
    if (!a) return '';
    const tail = a.unit === '天' ? `攒满 ${a.need} 天才有数` : `攒够 ${a.need} 笔才有数`;
    const since = Date.parse(a.since);
    if (!Number.isFinite(since)) return tail;
    const start = date(since);
    return a.unit === '天' ? `从 ${start} 开始记，${date(since + a.need * 86400000)} ${tail}`
      : `从 ${start} ${time(since)} 开始记，${tail}`;
  }
  const missingReasons = {
    not_applicable: '不适用', not_recorded: '未登记', not_collected: '尚未采集',
    not_counted: '暂未统计', read_failed: '这次读取失败', warming: '正在准备',
  };
  const readingAt = data => Object.hasOwn(data || {}, 'source_at') ? data.source_at : data?.at;
  const cutoffPattern = /^(?:数据截[止至]|最近一次记录于|上一次读到是|最后读到)\s*((?:\d{4}-)?\d\d-\d\d(?:\s+\d\d:\d\d(?::\d\d)?)?|\d\d:\d\d(?::\d\d)?)[。.]?$/;
  const cutoffKey = text => typeof text === 'string' ? cutoffPattern.exec(text.trim())?.[1] : undefined;
  const isCutoffNote = text => !!cutoffKey(text);
  const isReadingCutoff = text => /^(?:数据截[止至]|最近一次记录于|最后读到|这次没读到[，, ]+(?:最近一次记录于|上一次读到是)|本次未刷新[，, ]+沿用)\s*\d/.test(sp(text));
  const sameCutoffNote = (a, b) => {
    const one = cutoffKey(a), two = cutoffKey(b);
    return !!one && !!two && sp(`数据截止 ${one}`) === sp(`数据截止 ${two}`);
  };
  const isMissingName = text => /^(?:没有标题|没有记录|没有名称|未命名|还没读到|暂未统计|这一项)$/.test(text.trim());
  const isMissingText = text => /没有记录|还在采集|开始记|还没读到|暂未统计|未登记|读取失败|不适用|没读全|还不准/.test(text);
  function collectionText(label = '', meta = {}, value, key = 'value') {
    const text = typeof value === 'object' ? fieldText(value) : typeof value === 'number' && !Number.isFinite(value) ? '' : String(value ?? '');
    if (text.trim()) return `${(meta?.lower_bound === true || meta?.q === 'partial' && (!Array.isArray(meta.partial) || meta.partial.includes(key))) && !/^(至少\s*|不到)/.test(text) ? '至少 ' : ''}${text}`;
    const missing = meta?.missing?.[key];
    const codes = [missing?.reason_code, missing?.reason, missing?.text, missing, meta?.missing_reason, meta?.reason_code, meta?.reason, meta?.state, meta?.q];
    const code = meta?.applicable === false ? 'not_applicable' : codes.find(code => typeof code === 'string' && Object.hasOwn(missingReasons, code));
    const failed = code === 'read_failed' || !code && !!meta?.read_error;
    const reason = failed ? missingReasons.read_failed : missingReasons[code];
    if (reason) {
      const last = failed && (missing?.last_success_at ?? (Object.hasOwn(typeof missing === 'object' && missing || {}, 'source_at') ? missing.source_at
        : meta?.last_success_at ?? meta?.source_at));
      const stamp = last && cutoffStamp(last);
      return `${label}${reason}${stamp ? `，最后读到 ${stamp}` : ''}`;
    }
    if (meta?.accumulating) return accumulatingText(meta.accumulating);
    const since = meta?.since || meta?.from || meta?.coverage?.from, at = Date.parse(since && !/(?:Z|[+-]\d\d:\d\d)$/.test(since) ? `${since}${since.length === 10 ? 'T00:00:00' : ''}+08:00` : since);
    if (Number.isFinite(at)) {
      const start = new Date(at + 8 * 3600000).toISOString().slice(0, 10), year = new Date(Date.now() + 8 * 3600000).getUTCFullYear();
      return `从 ${start.startsWith(String(year)) ? start.slice(5) : start} 开始记`;
    }
    return label ? `${label}还没读到` : '没有记录';
  }
  const isStale = data => data?.stale === true || data?.q === 'stale' || data?.state === 'stale';
  function cutoffStamp(at, precision, now = Date.now()) {
    const parsed = typeof at === 'number' ? at : Date.parse(/(?:Z|[+-]\d\d:\d\d)$/.test(at) ? at : `${at}${at?.length === 10 ? 'T00:00:00' : ''}+08:00`);
    if (!Number.isFinite(parsed)) return '';
    const beijing = n => new Date((typeof n === 'number' ? n : Date.parse(n)) + 8 * 3600000).toISOString().slice(0, 16).replace('T', ' '), stamp = beijing(parsed);
    return precision === 'date' || at?.length === 10 ? stamp.slice(5, 10) : stamp.slice(0, 10) === beijing(now).slice(0, 10) ? stamp.slice(11) : stamp.slice(5);
  }
  function staleText(data, at = data?.at, now = Date.now()) {
    if (Object.hasOwn(data || {}, 'source_at')) at = data.source_at;
    if ((!offline() && !isStale(data)) || !at || ['summary', 'reason', 'about', 'text', 'note', 'gap', 'why']
      .some(k => isReadingCutoff(data?.[k]) || /数据截止|最后读到/.test(data?.[k]?.text ?? data?.[k] ?? ''))) return '';
    const stamp = cutoffStamp(at, data?.at_precision, now);
    return stamp ? `数据截止 ${stamp}` : '';
  }
  function withoutSnapshotCutoff(data, snapshotAt) {
    if (!data || !snapshotAt) return data;
    const snapshot = Date.parse(snapshotAt), source = Date.parse(data.source_at);
    const separateBlock = Object.values(data.blocks || {}).some(block => {
      const measured = Date.parse(readingAt(block));
      return Number.isFinite(measured) && measured !== snapshot;
    });
    if (!Number.isFinite(snapshot) || source === snapshot || !Number.isFinite(source) && !separateBlock) return data;
    const note = `数据截止 ${cutoffStamp(snapshotAt)}`;
    const keys = ['stale_text', 'text', 'why'].filter(key => sameCutoffNote(data[key], note));
    return keys.length ? { ...data, ...Object.fromEntries(keys.map(key => [key, ''])) } : data;
  }
  const olderNote = (at, data) => staleText(data, at);
  function blockNote(el, state) {
    if (el?.matches?.('.grp')) el = el.querySelector('.grp__body');
    if (!el) return;
    let note = el.querySelector(':scope > .live-fallback-note');
    const text = state?.fallbackNote || state?.meta?.fallbackNote || '';
    if (!text) { note?.remove(); return; }
    if (!note) { note = document.createElement('p'); note.className = 'row__sub live-fallback-note'; el.append(note); }
    if (el.classList?.contains?.('grp__body')) note.style.margin = '0 26px 16px 64px';
    note.textContent = text;
  }

  // 多久以前：按后端给的 now 算，不按这台电脑的钟
  function ago(at, now) {
    if (!at) return '';
    if (offline()) return time(at);
    const m = Math.round((Date.parse(now || Date.now()) - Date.parse(at)) / 60000);
    if (m < 1) return '刚刚';
    if (m < 60) return `${m} 分钟前`;
    if (m < 24 * 60) return `${Math.floor(m / 60)} 小时前`;
    if (m < 48 * 60) return `昨天 ${time(at)}`;
    return date(at);
  }
  function minutes(n) {
    if (n == null) return '';
    // 调用处常传“秒数 / 60”的小数：先取整到分钟，页上不出现长小数
    const v = Math.round(Number(n));
    if (!Number.isFinite(v)) return '';
    if (v < 1 && n > 0) return '不到 1 分钟';
    if (v < 60) return `${v} 分钟`;
    const h = Math.floor(v / 60), r = v % 60;
    return r ? `${h} 小时 ${r} 分钟` : `${h} 小时`;
  }
  // 容量：底层是字节，按 2^30 换算，写 GB
  function gb(bytes) {
    if (bytes == null) return '';
    const v = bytes / 2 ** 30;
    if (v === 0) return '0 GB';
    if (v > 0 && v < .01) return '不到 0.01 GB';
    return `${Number(v.toFixed(Math.abs(v) >= 10 ? 1 : 2))} GB`;
  }
  gb.scaled = (bytes) => {
    if (!bytes) return gb(bytes);
    const power = Math.abs(bytes) >= 2 ** 30 ? 30 : Math.abs(bytes) >= 2 ** 20 ? 20 : 10;
    const value = bytes / 2 ** power;
    return `${Number(value.toFixed(Math.abs(value) >= 10 ? 1 : 2))} ${{ 30: 'GB', 20: 'MB', 10: 'KB' }[power]}`;
  };

  // 初读把有事的放前面；刷新保留旧条目的相对顺序，阅读中的行不换位。
  const orders = new Map();
  function order(items, attention, scope, key = x => x.id) {
    const previous = orders.get(scope), by = new Map(items.map(x => [key(x), x]));
    const fresh = items.filter(x => !previous?.includes(key(x)));
    const first = fresh.filter(attention), rest = fresh.filter(x => !attention(x));
    const rows = [...first, ...(previous || []).filter(id => by.has(id)).map(id => by.get(id)), ...rest];
    orders.set(scope, rows.map(key));
    return rows;
  }
  function chatActivity(c, now) {
    const helpers = Array.isArray(c.helpers) ? c.helpers : c.helpers?.active || [];
    const at = [c.at, ...helpers.map(h => h.at)].filter(Boolean).sort((a, b) => Date.parse(b) - Date.parse(a))[0];
    if (offline()) return `${c.state === 'waiting' ? '最后提问' : '最后活动'} ${time(at)}`;
    const m = ((now ? Date.parse(now) : Date.now()) - Date.parse(at)) / 60000;
    return c.state === 'running' && !helpers.some(h => h.state === 'running') && !c.helpers?.running && m >= 30 ? `已经 ${m >= 60 ? `${Math.floor(m / 60)} 小时` : `${Math.floor(m)} 分钟`}没动静` : `${ago(at, now)}${c.state === 'waiting' ? '问的' : '在动'}`;
  }

  // 复用通知的落点：展开目标所在折叠，露出后滚过去并亮一下。
  let landed = false;
  // keepOnBack：退回来时筛出的几行照样亮着（位置由退回恢复，不再滚），目前只有备份总表用（M115）。
  function land({ keepOnBack = false } = {}) {
    if (landed) return;
    if (returned && !keepOnBack) { landed = true; return; }
    const p = new URLSearchParams(location.search), id = p.get('item');
    if (!id && !p.has('attention') && !p.has('source')) return;
    const kind = p.get('attention'), cls = p.has('source') ? `source-${p.get('source')}` : kind === '1' ? 'is-attention' : `attention-${kind}`;
    const targets = [...document.querySelectorAll('[data-key]')].filter(el => id ? el.dataset.key === id : el.classList.contains(cls));
    if (!targets.length) return;
    landed = true;
    if (returned) { targets.forEach(el => el.classList.add('notice-target')); return; }
    for (const el of targets) {
      for (let box = el.closest('.fold'); box; box = box.parentElement?.closest('.fold')) box._liveOpen?.();
    }
    const start = performance.now();
    const go = () => {
      if (root.classList.contains('mo-hide') && performance.now() - start < 2000) { requestAnimationFrame(go); return; }
      targets[0].scrollIntoView({ block: 'center', behavior: 'instant' });
      targets.forEach(el => el.classList.add('notice-target'));
    };
    requestAnimationFrame(go);
  }

  // 后端定灯，前端只画；ok/amber/off 仅接安装切换前的旧数据，不从 state、缺数或时间另判颜色。
  function sameReadingReason(data, cover) {
    const at = Date.parse(readingAt(data));
    if (!cover || !Number.isFinite(at) || at !== Date.parse(readingAt(cover))) return false;
    const why = data.why;
    const legacyRow = typeof why === 'string' && /^这次没读到[，,]/.test(why) &&
      isCutoffNote(why.replace(/^这次没读到[，,]\s*/, ''));
    return ['stale', 'read_failed'].includes(data.gray_reason) && data.gray_reason === cover.gray_reason
      && (!why || why === cover.why || isCutoffNote(why))
      || legacyRow && /^最近一次记录于/.test(cover.why || cover.stale_text || '');
  }
  function status(data, { small = false, missingNames = {}, showZeroFixing = true, cutoffShown, cover } = {}) {
    const tone = { green: 'green', yellow: 'amber', red: 'red', gray: 'gray', blue: 'blue', ok: 'green', amber: 'amber', off: 'gray' }[data?.level];
    if (!tone) return { tone: 'none', lamp: '', note: '' };
    const notes = [];
    if (tone === 'blue') notes.push('有问题，AI 已接手在修，不用你动手');
    const why = data.why, at = readingAt(data), shared = sameReadingReason(data, cover);
    const measured = Date.parse(at), coveredCutoff = Number.isFinite(measured) && measured === Date.parse(readingAt(cover))
      && [cover?.why, cover?.text, cover?.stale_text].some(isReadingCutoff);
    const cutoff = data.stale_text || (tone === 'gray' && !data.read_error && staleText({ ...data, stale: true }));
    if (why && !shared && why !== data.text && !sameCutoffNote(why, cutoff) && !cutoffShown?.(why)) notes.push(fieldHtml(why, { name: '状态说明' }));
    const alert = data.alert_at;
    if (tone === 'red' && Number.isFinite(Date.parse(alert)) && !sp(why).includes('最后读到')) {
      notes.push(`告警读到 ${nowrap([date(alert) !== date(Date.now()) && date(alert), time(alert)].filter(Boolean).join(' '))}`);
    }
    if (tone === 'gray') {
      if (!why && !cutoff && !shared) notes.push(nowrap(collectionText('', { ...data, source_at: at })));
      const missing = [...new Set(data.partial || [])];
      const names = [], reasons = [];
      let count = 0;
      for (const key of missing) {
        const supplied = Object.hasOwn(missingNames, key) ? missingNames[key] : '';
        const name = (typeof supplied === 'string' ? supplied.trim() : supplied) || (/[\u3400-\u9fff]/.test(key) ? key : '');
        const reason = data.missing?.[key];
        const label = name ? fieldHtml(name, { name: '缺少读数' }) : '';
        const code = reason?.reason_code ?? reason?.reason ?? reason;
        const explanation = !privateField(reason) && !pendingField(reason) && Object.hasOwn(missingReasons, code) ? missingReasons[code]
          : reason && (typeof reason === 'object' || /[\u3400-\u9fff]/.test(reason)) ? fieldHtml(reason, { name: '缺数原因' }) : '';
        if (label) names.push(explanation ? `${label}（${explanation}）` : label);
        else if (explanation) reasons.push(explanation);
        else count++;
      }
      if (names.length) notes.push(`缺：${names.join('、')}`);
      notes.push(...reasons);
      if (count) notes.push(`${count} 项读数不完整`);
    }
    if (cutoff && !shared && !coveredCutoff && !cutoffShown?.(cutoff) && !isReadingCutoff(data.text) &&
        !(isReadingCutoff(why) && !isCutoffNote(why)) && !/最后读到/.test(why?.value ?? why?.text ?? why ?? '')) {
      notes.push(fieldHtml(cutoff, { name: '数据截止时刻' }));
    }
    if (data.attention_count > 0) notes.push(`${esc(data.attention_count)} 项要处理`);
    if (data.gray_count > 0) notes.push(`${esc(data.gray_count)} 项读数还不能确认`);
    if (data.ai_fixing_count != null && (showZeroFixing !== false || data.ai_fixing_count !== 0)) notes.push(nowrap(`AI 在修 ${data.ai_fixing_count} 件`));
    return {
      tone, lamp: `<span class="lamp${small ? ' lamp--sm' : ''}" data-tone="${tone}" aria-hidden="true"></span>`,
      note: [...new Set(notes)].join(' · '), attentionCount: data.attention_count, grayCount: data.gray_count, aiFixingCount: data.ai_fixing_count,
    };
  }

  // —— 第一行：灯 + 前半句大、后半句轻 ——
  function head(text, { lamp = true, href = '', tag = '', name = '' } = {}) {
    if (/^\/live\/(?:ledger|projects)\/(?:[?#]|$)/.test(href)) lamp = false;
    const raw = sp(text || collectionText());
    const first = raw.split(' · ')[0], marked = !!text?.hidden_block || /^(?:[^<>]*：)?(?:可信设备可见|正在换说法|对外换了说法|换了说法)$/.test(first);
    const names = { chats: 'AI 对话', items: '等你的事', tasks: '计划任务', automation: '自动任务', ledger: 'AI 账本', projects: '项目', project: '项目', computer: '电脑', phone: '手机', backups: '备份' };
    const own = name || names[href.split('/')[2]] || (marked || isReadingCutoff(raw) ? document.title?.split(' · ')[0] : '') || '实况';
    const words = (marked ? [sp(own), ...raw.split(' · ').slice(1)] : raw.split(' · ')), cutoff = [...new Set(words.filter(isReadingCutoff))];
    const s = words.filter(s => !cutoff.includes(s)).join(' · ') || own;
    const i = s.indexOf(' · ');
    const lead = i < 0 ? s : s.slice(0, i);
    const tail = i < 0 ? '' : s.slice(i + 3);
    const content = `<span class="${isMissingText(lead) ? 'row__sub' : 'head__lead'}">${nowrap(lead)}</span>${tail ? `<span class="head__tail">${nowrap(tail)}</span>` : ''}`;
    return `${lamp ? '<span class="lamp" aria-hidden="true"></span>' : ''}${href ? `<a class="head__link" href="${esc(href)}">${content}<span class="head__tail">›</span></a>` : content}${tag ? `<span class="tag tag--todo">${esc(tag)}</span>` : ''}${marked ? `<span class="head__marker">${fieldHtml(text && typeof text === 'object' ? text : first, { name: own, marker: true })}</span>` : ''}${cutoff.length ? `<span class="head__cutoff">${nowrap(cutoff.join(' · '))}</span>` : ''}`;
  }

  // —— 按钮：只有两种——复制一句带编号的话、能直接打开的直接打开 ——
  const actionKeys = new Map(), actionSets = new Map();
  let nextActionKey = 0;
  let viewer = 'public';
  const privateField = v => !!(v?.hidden_block || v?.hidden || v?.visibility === 'owner' || v?.public === 'owner');
  const pendingField = v => v?.visibility === 'pending' || v?.rewrite === 'pending';
  function explanationButton(type, label, subject, explanation, group = false) {
    const lock = type === 'owner' ? '<span class="live-mark__lock" aria-hidden="true">🔒</span>' : '';
    return `<button type="button" class="trust-note live-mark live-mark--${type}${group ? ' live-mark--group' : ''}" title="${esc(label)} · 点开看说明" data-trust-context="${esc(subject)}" data-trust-explanation="${esc(explanation)}" aria-expanded="false" aria-controls="live-privacy-note" data-trust-view>${lock}<span class="live-mark__label">${esc(label)}</span></button>`;
  }
  // 新私事规则（本人 11-24 02:56）：访客版只有被标对话里写的字能藏，写成普通字，不画锁、不打码、不变灰。
  // 一大块的（hidden_block）原位写“这里是……，所以不予展示”；其余后台还标着藏的，只写“〈哪一样〉仅本人可见”这句普通字。
  const blockSentence = block => `这里是${String(block).replace(/^这里是|，?所以不予展示[。.]?$/g, '')}，所以不予展示`;
  function privacyLock(what, { name = '', block = '' } = {}) {
    if (block) return `<span class="live-mark live-mark--plain">${esc(blockSentence(block))}</span>`;
    const specific = name && /^这个项目的(?:内容|说明)$/.test(what || '') ? name : what;
    const subject = (specific || name || '这项内容').replace(/[，：:]$/, '');
    const label = /仅本人可见/.test(subject) ? subject : `${subject}仅本人可见`;
    return `<span class="live-mark live-mark--plain">${esc(label)}</span>`;
  }
  function rewriteNote(name, kind) {
    // 本人版用第二种标签（visitorRewrittenTag）；访客版照旧。
    if (kind === 'owner') return visitorRewrittenTag(name || '这句话', '', kind);
    const subject = name || '这句话';
    return explanationButton('rewritten', '换了说法', subject, `${subject}对外换了说法。本人能看到原文。`);
  }
  function privateDownload(name) {
    return explanationButton('owner', '演示文件下载仅本人可见', '这份演示文件', `下载权限仅给本人。本人能在电脑上打开或保存${name || '这份演示文件'}。`);
  }
  function visibilityNote(item, kind = viewer, what, plain = false) {
    const label = item?.hidden_what || what || '';
    // 后台旧的“待改”占位：换说法的流程已经停了，和私事一样处理。
    if (privateField(item) || pendingField(item)) {
      // 本人版给完整版：不画锁，不写“仅本人可见”。
      if (kind === 'owner') return '';
      if (plain) return item.hidden_block ? blockSentence(item.hidden_block) : `${label || '这项原文'}仅本人可见`;
      return privacyLock(label.replace(/[，：:]$/, ''), { name: what, block: item.hidden_block });
    }
    if (item?.visibility === 'rewritten' || item?.public === 'rewrite') {
      // 访客：只是把号码、私事句换成“仅本人可见”，不是换了说法，不再挂“换了说法”。
      if (kind !== 'owner' && [item.text, item.now, item.value, item.title].some(v => /仅本人可见/.test(fieldText(v, kind)))) return '';
      if (kind !== 'owner' && privateField(item.text)) return fieldHtml(item.text, { kind, name: what || '正文' });
      return rewriteNote(label, kind);
    }
    return '';
  }
  // M684：本人版两种标签，全站同一个样子，访客版不挂（本人 11-24 定稿：两种一眼分得开）。
  // 第一种“访客看不到”（紫色）：访客那边这一处看不到原内容，只有中性占位。第二种“对外换了说法”（琥珀色）：访客看到的是换过的说法。
  // 后台在本人读口的显示对象上给可选 visitor_labels：键是同一对象里的字段名，'$' 表示整块；值只有 hidden / rewritten，隐藏优先，缺键不挂。
  // 正文对象里只换了词时，标记给在字段自己身上（如 reply.visitor_labels.text），这里一并读。
  function visitorFieldKind(item, keys = ['$']) {
    const found = [], labels = item && typeof item === 'object' && item.visitor_labels && typeof item.visitor_labels === 'object' ? item.visitor_labels : null;
    for (const key of [].concat(keys)) {
      if (labels) found.push(labels[key]);
      const own = key !== '$' && item && typeof item === 'object' ? item[key] : null;
      if (own && typeof own === 'object' && own.visitor_labels && typeof own.visitor_labels === 'object') found.push(own.visitor_labels.$, own.visitor_labels.text, own.visitor_labels.value);
    }
    return found.includes('hidden') ? 'hidden' : found.includes('rewritten') ? 'rewritten' : '';
  }
  // 访客版整条藏掉的（visibility: 'owner'、整场锁、visitor_labels 标了整块或标题 hidden），原位挂“访客看不到”，点开写清藏了什么、为什么（M648）；
  // 只标了换说法的挂第二种签（rewrittenWhat 是换了说法的那一样）。后台给了 visitor_hidden_why 就把原因带上。
  function visitorHiddenMark(item, what = '这一条', kind = viewer, { keys = ['$', 'title'], rewrittenWhat = `${what}的标题` } = {}) {
    if (kind !== 'owner') return '';
    const whole = item?.visibility === 'owner' || item?.public === 'owner' || item?.content_locked === true || visitorFieldKind(item, '$') === 'hidden';
    const labeled = visitorFieldKind(item, keys);
    if (!whole && labeled !== 'hidden') return labeled === 'rewritten' ? visitorRewrittenTag(rewrittenWhat, '', kind) : '';
    const why = typeof item.visitor_hidden_why === 'string' ? item.visitor_hidden_why.trim() : '';
    return explanationButton('rewritten', '访客看不到', what, `访客版看不到${what}的${whole ? '标题和内容' : '标题'}。${why ? `原因：${why.replace(/[。.]?$/, '。')}` : ''}`);
  }
  // 访客版整条都看不到的：页面据此不再在这一条的各块上重复挂签。
  const visitorWholeHidden = (item, keys = ['$', 'title']) => !!item && (item.visibility === 'owner' || item.public === 'owner' || item.content_locked === true || visitorFieldKind(item, keys) === 'hidden');
  // 本人版：访客看不到的东西（被标对话、窗口标题、备份文件名、给了 open_note 的成品正文）在原位挂同一个“访客看不到”小签，点开写清看不到什么、为什么。
  function visitorHiddenTag(what, why = '', kind = viewer) {
    if (kind !== 'owner' || !what) return '';
    const reason = typeof why === 'string' && why.trim() ? `原因：${why.trim().replace(/[。.]?$/, '。')}` : '';
    return explanationButton('rewritten', '访客看不到', what, `访客版看不到${what}。${reason}`);
  }
  function visitorRewrittenTag(what, why = '', kind = viewer) {
    if (kind !== 'owner' || !what) return '';
    const reason = typeof why === 'string' && why.trim() ? why.trim().replace(/[。.]?$/, '。') : '';
    return explanationButton('reworded', '对外换了说法', what, `访客版看到的${what}是换过的说法，本人这边是原文。${reason}`);
  }
  // 按 visitor_labels 在原位挂两种签之一；keys 是这个位置显示的字段名（整块的位置带上 '$'）。
  function visitorLabel(item, keys, what, kind = viewer) {
    if (kind !== 'owner') return '';
    const type = visitorFieldKind(item, keys);
    return type === 'hidden' ? visitorHiddenTag(what, item?.visitor_hidden_why, kind) : type === 'rewritten' ? visitorRewrittenTag(what, '', kind) : '';
  }
  // 新私事规则：访客侧不再画“另有 N 条仅本人可见”。
  const hiddenMore = () => '';
  function escapeNotes(text) {
    // 只让共用函数生成的固定结构通过，其余内容一律按文字显示。
    return String(text ?? '').split(/(<button type="button" class="trust-note live-mark live-mark--(?:owner(?: live-mark--group)?|rewritten|reworded)" title="[^"<>]*" data-trust-context="[^"<>]*" data-trust-explanation="[^"<>]*" aria-expanded="false" aria-controls="live-privacy-note" data-trust-view>(?:<span class="live-mark__lock" aria-hidden="true">🔒<\/span>)?<span class="live-mark__label">[^<]*<\/span><\/button>)/g).map((part, index) => index % 2 ? part : esc(part)).join('');
  }
  function trustText(text, kind = viewer) {
    if (typeof text === 'number' && !Number.isFinite(text)) text = '';
    if (text && typeof text === 'object') {
      return fieldHtml(text, { kind });
    }
    return escapeNotes(text);
  }
  const hiddenBlockText = value => value?.hidden_block ? blockSentence(value.hidden_block) : '';
  // 等你的事字数兜底（M560，后台登卡另限字数）：字面的 \n 当换行，**、反引号、行首 # 这类记号不显示；超过 n 个字用“…”收住，oneLine 时换行压成空格
  function capText(value, n, oneLine = false) {
    const cut = s => { const t = [...s.replace(/\\n/g, '\n').replace(/\*\*|__|\x60/g, '').replace(/^#{1,6}\s+/gm, '').replace(oneLine ? /\s*\n\s*/g : /\n{3,}/g, oneLine ? ' ' : '\n\n').trim()]; return t.length > n ? t.slice(0, n).join('').trimEnd() + '…' : t.join(''); };
    return typeof value === 'string' ? cut(value) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, ['value', 'text', 'label'].includes(k) && typeof v === 'string' ? cut(v) : v])) : value;
  }
  // 事项来源的名字：内部编号和来源码（pcconfig-auto-source-…、owner-2026…、pending-…、owner-intake 这类）不给人看（本人 11-23 16:50；M603）。
  // “来源码 · 型号”这样拼起来的逐段看：认得的来源码换成人话，是项目编号的换成项目名，认不出的、夹着内部编号的那段不写。
  const ORIGIN_NAMES = { 'news-quickcheck': '资讯查询', 'owner-intake': '新消息登记', 'report-page': '汇报页' };
  const internalCode = s => /^[\w.-]+$/u.test(s) && (/[-_]/.test(s) || /^[a-z0-9.]+$/.test(s)) && !/^(?:low|medium|high|xhigh|ultra|max)$/.test(s) || /\b[a-z][a-z0-9]*(?:-[a-z0-9]+){2,}\b/.test(s);
  function originName(origin, item) {
    const name = origin?.label || origin?.text || origin?.name;
    if (!name || typeof name !== 'string') return name || '';
    return name.split(' · ').map(s => s.trim()).filter(Boolean).map(s => Object.hasOwn(ORIGIN_NAMES, s) ? ORIGIN_NAMES[s]
      : s === item?.project && typeof item?.project_name === 'string' ? item.project_name : internalCode(s) ? '' : s).filter(Boolean).join(' · ');
  }
  function fieldText(value, kind = viewer) {
    if (typeof value === 'number' && !Number.isFinite(value)) return '';
    if (value && typeof value === 'object') {
      const hidden = privateField(value) && (kind !== 'owner' || value.value == null && value.text == null);
      if (kind !== 'owner' && pendingField(value) && (value.visibility === 'pending' || hidden || ((value.value ?? '') === '' && (value.text ?? '') === ''))) return visibilityNote(value, kind, '', true);
      // 本人版：后台给了原字就给原字，没给的空着，不写“仅本人可见”。
      if (hidden) return kind === 'owner' ? '' : hiddenBlockText(value) || visibilityNote({ ...value, visibility: 'owner' }, 'public', value.hidden_what || '', true);
      const text = fieldText(value.value ?? value.text ?? value.label, kind);
      return value.lower_bound === true && text && !/^(至少\s*|不到)/.test(text) ? `至少 ${text}` : text;
    }
    return String(value ?? '');
  }
  function chatJoinedReply(value, kind = viewer, lineStarts = false) {
    if (pendingField(value) || kind === 'public' && privateField(value)) return value;
    if (value && typeof value === 'object') {
      const key = ['text', 'value'].find(k => value[k] != null && value[k] !== '');
      if (!key) return value;
      const text = chatJoinedReply(value[key], kind, lineStarts);
      return text === value[key] ? value : { ...value, [key]: text };
    }
    if (typeof value !== 'string') return value;
    // 详情保留换行和真实列表，只补掉旧回执在拼句时留下的符号。
    return value.replace(/(```|~~~)[\s\S]*?\1|^[ \t]*>[^\r\n]*|“[^”\n]*”|「[^」\n]*」|『[^』\n]*』|"[^"\n]*"|`[^`\n]*`|((?<=[。！？.!?])|(^[ \t]*))[-*+][ \t]+(?=[A-Za-z\u3400-\u9fff])/gm,
      (text, fence, mark, line, at, source) => mark == null || line != null && !lineStarts ? text : /[.!?]/.test(source[at - 1]) ? ' ' : '');
  }
  function chatPreviewSummary(value, chat, kind = viewer) {
    const restricted = field => pendingField(field) || kind === 'public' && privateField(field);
    if (chat?.state !== 'done' || restricted(chat) || restricted(value)) return value;
    if (value && typeof value === 'object') {
      const key = ['text', 'value'].find(k => value[k] != null && value[k] !== '');
      if (!key) return value;
      const text = chatPreviewSummary(value[key], chat, kind);
      return text === value[key] ? value : { ...value, [key]: text };
    }
    if (typeof value !== 'string') return value;
    value = chatJoinedReply(value, kind, true);
    if (value === '通。') {
      let title = chat.title;
      while (title && typeof title === 'object' && !restricted(title)) title = title.value ?? title.text ?? title.label;
      const object = typeof title === 'string' && /^(?:检查|核对)\s*(.+?)\s*连通状态$/.exec(title.trim())?.[1].trim();
      if (object) return sp(`${object}已连通。`);
    }
    return value.replace(/^(?:(已完成复核并写入正式回执[，,])\s*)?结论为\s+ignore\s*[（(]忽略[）)](?=\s*[。！？.!?]?\s*$)/,
      (_, receipt) => receipt ? receipt + '决定忽略此项' : '复核结论是忽略此项');
  }
  function chatStart(c) {
    return [[c.session_started_at, '对话开始'], [c.turn_started_at, '本轮开始'], [c.started_at, '记录起于'], [c.born, '记录起于']]
      .find(([at]) => typeof at === 'string' && Number.isFinite(Date.parse(at))) || [];
  }
  function chatWaitLabel(c, kind = viewer) {
    if (c?.state !== 'waiting' || kind === 'public' && (privateField(c) || pendingField(c))) return '';
    if (c.wait_kind === 'tool') return '在提问';
    return c.wait_kind === 'final' ? (kind === 'public' ? '等本人回答' : '等你回答') : '';
  }
  function chatProgressText(value, chat, kind = viewer) {
    if (pendingField(value)) return value;
    const text = fieldText(value, kind);
    if (chat?.state === 'failed') {
      const stamp = /^((?:(?:5 小时|周)额度|额度)用完 · 恢复时间 )(\d{1,2})月(\d{1,2})日(?= \d{1,2}:\d{2})/;
      const label = text.replace(stamp, (_, prefix, month, day) => prefix + month.padStart(2, '0') + '-' + day.padStart(2, '0'));
      return label === text ? value : typeof value === 'object' ? { ...value, text: label, value: label } : label;
    }
    const label = text === 'asking' ? chatWaitLabel(chat, kind) : '';
    if (!label || chat?.wait_kind !== 'tool') return value;
    return typeof value === 'object' ? { ...value, text: label, value: label } : label;
  }
  function chatShortName(c, kind = viewer, extra = []) {
    const restricted = value => value?.hidden || value?.hidden_block || pendingField(value) || kind === 'public' && privateField(value);
    if (!c || restricted(c)) return '';
    const visible = value => {
      for (let v = value; v && typeof v === 'object'; v = v.value ?? v.text ?? v.label) {
        if (restricted(v)) return '';
      }
      return fieldText(value, kind).trim();
    };
    const short = value => {
      const line = visible(value).split(/[\n。！？]/, 1)[0];
      return /^(?:已完成|做完了|正在处理|在干|等回答|没有标题|没有记录)(?:\s|$)|没有.*记录$|(?:仅本人可见|可信设备可见|正在换说法)$|^[-\w]+$/.test(line) ? '' : line;
    };
    const name = [c.doing, c.progress, c.latest_reply, c.text, c.project_name, ...extra].map(short).find(Boolean);
    if (name) return name;
    const model = c.model_text ?? c.model, label = short(model) || visible(model);
    const [at, scope] = chatStart(c), started = Date.parse(at), dayKey = ms => Math.floor((ms + 8 * 3600000) / 86400000);
    const stamp = Number.isFinite(started) ? [dayKey(started) !== dayKey(Date.now()) && date(at), time(at)].filter(Boolean).join(' ') || date(at) : '';
    const startedName = stamp && (scope === '对话开始' ? `${stamp} 开始的对话` : `${scope} ${stamp}`);
    return [label, startedName].filter(Boolean).join(' · ');
  }
  // 正文用默认 place；标题、按钮、格名传本块 name，标记另用默认 place 放在正文。
  function fieldHtml(value, { name = '', place = 'body', kind = viewer, marker = false, plain = false } = {}) {
    const v = value && typeof value === 'object' ? value : {}, s = fieldText(value, kind).replace(/^数据截止(?=\s+\d)/, '数据截至');
    if (!plain && kind === 'public' && place === 'body') {
      const old = /^(〔这句可信设备可见〕|文件名可信设备可见[。.]?)(.*)$/s.exec(s);
      if (old) return privacyLock(old[1].startsWith('文件名') ? '这批文件的具体名称' : name || '这段原文') + esc(old[2]);
    }
    if (kind === 'public') {
      // 旧的“待改”占位没有可给的原文，和私事一样显示。
      if (privateField(v) || pendingField(v) && (v.value == null && v.text == null || v.visibility === 'pending')) return place === 'body' ? privacyLock(fieldText(v.hidden_what) || name, { block: v.hidden_block })
        : esc(v.hidden_block ? blockSentence(v.hidden_block) : `${fieldText(v.hidden_what) || (place === 'title' ? '标题' : name || '这一项')}仅本人可见`);
      const old = typeof value === 'string' && /^(?:([^<>]*)：)?可信设备可见$/.exec(s);
      if (old) return esc(`${old[1] || name || '这一项'}仅本人可见`);
      if (place === 'body' && v.visibility === 'rewritten' && s) return esc(s);
    }
    const marked = marker || place !== 'body';
    const hidden = privateField(v);
    const type = pendingField(v) || marked && /^(?:[^<>]*：)?正在换说法$/.test(s) ? 'pending'
      : hidden ? 'owner'
      : marked && /^(?:[^<>]*：)?可信设备可见$/.test(s) ? 'owner'
      : v.visibility === 'rewritten' || v.public === 'rewrite' || marked && /^(?:对外)?换了说法$/.test(s) ? 'rewritten' : '';
    if (!type) return !plain && place === 'body' && s.includes('data-trust-explanation=') ? escapeNotes(s)
      : esc(place === 'title' && isMissingName(s) ? name : s);
    if (kind === 'owner' && type !== 'rewritten') {
      // 本人版给完整版：有原字就照原字给，不画锁、不挂“仅你可见”；后台没给原字的空着。
      const shown = (v.value != null || v.text != null || typeof value === 'string') && !/^(?:[^<>]*：)?(?:正在换说法|可信设备可见|仅本人可见)$/.test(s) ? s : '';
      return place === 'body' ? esc(shown) : esc(shown && !(place === 'title' && isMissingName(shown)) ? shown : name);
    }
    const visible = v.visibility !== 'pending' && (v.value != null || v.text != null) && (!hidden || kind === 'owner')
      && (type !== 'pending' || !/^(?:[^<>]*：)?正在换说法$/.test(s));
    if (place !== 'body') return esc(visible && (place !== 'title' || !isMissingName(s)) ? s : name);
    const what = fieldText(v.hidden_what) || (typeof value === 'string' && s.includes('：') ? s.slice(0, s.indexOf('：')) : ''), label = what || name;
    if (type === 'owner' && !visible) return privacyLock(what, { name, block: v.hidden_block });
    if (type === 'rewritten') return (visible ? esc(s) + ' ' : '') + rewriteNote(label, kind);
    // 旧“待改”占位但原字照给的，只给字；没给字的写清藏的是哪一样。
    return visible ? esc(s) : privacyLock(what, { name, block: v.hidden_block });
  }
  // 新私事规则：访客侧不再画“另有 N 条仅本人可见”（后台也不再按条藏）。
  function privateSummary() { return ''; }
  function mergePrivateRows(rows) { return rows; }
  const INTENT = { done: '复制给 AI', decline: '不办了', later: '晚点提醒', ack: '我知道了', close_report: '关掉' };
  const CONFIRM_ITEM = {
    decline: { action: 'dismiss', title: '这件不办了？', note: '马上从“等你的事”撤下，记进退出记录，手机不再提醒。', cancel: '再想想', confirm: '不办了', saved: '已关掉，记为你不办了', state: '你说不办了' },
    done: { title: '复制办理结果？', note: '把这段话贴给 AI。AI 核实后按编号关卡。', cancel: '取消', confirm: '复制给 AI' },
    decline_copy: { title: '复制给 AI 处理后续？', note: '把这段话贴给 AI，请它处理卡上写的后续。', cancel: '取消', confirm: '复制给 AI' },
    later: { action: 'snooze', title: '晚点再提醒？', note: '移到“你放着”，明天上午 10 点再提醒。', cancel: '取消', confirm: '明天再提醒', saved: '已放到你放着，明早 10:00 再提醒', state: '晚点再提醒' },
    ack: { action: 'ack', title: '确认已知？', note: '马上从“等你的事”撤下，并写入退出记录。', cancel: '取消', confirm: '我知道了', saved: '已记下：我知道了', state: '本人已知' },
    close_report: { action: 'dismiss', title: '关掉这份汇报？', note: '从“等你答的汇报”撤下，保留原链接和关闭记录。', cancel: '取消', confirm: '关掉', saved: '已关掉这份汇报', state: '汇报已关闭' },
  };
  const MANY_TITLE = { decline: '这 N 件都不办了？', done: '复制这 N 件的办理结果？', decline_copy: '复制这 N 件的后续给 AI？',
    later: '这 N 件都晚点再提醒？', ack: '这 N 件都确认已知？', close_report: '关掉这 N 份汇报？' };
  // 没保存上时给本人看的原因：后台回的错误名换成人话（错误名留在回执的 data-error 上，查问题用）
  const FAILED_TEXT = {
    cockpit_action_not_allowed: '后台现在不让这张卡这样办，没保存上。卡先留着，可以点“问情况”交给 AI 处理。',
    cockpit_item_changed: '这张卡刚有变化，没保存上。点“再点一次”会按最新的再保存。',
    cockpit_item_buttons_disabled: '电脑这会儿没开放卡上的按钮，没保存上。稍后再点一次。',
    cockpit_owner_required: '这台设备没配对，没保存上。',
    cockpit_device_rate_limited: '点得太多了，没保存上。过几分钟再点一次。',
  };
  const itemWrites = new Set();
  function itemIntent(item, action) {
    if (item.closed || !action || !['copy', 'direct'].includes(action.kind)) return '';
    const key = action.intent === 'decline' && item.decline_followup ? 'decline_copy' : action.intent;
    return (item.owner_source_id || action.kind === 'direct' || item.item_version) && CONFIRM_ITEM[key] ? key : '';
  }
  const itemLabels = { ...INTENT, decline_copy: '不办了（复制后续）' };
  // 选择题的答案复制给 AI：写上原卡号、题号和题目，两张同名卡复制出来也分得开。
  function choiceText(item, title, question, option) {
    const line = value => String(fieldText(value, 'owner') ?? '').replace(/\s+/g, ' ').trim();
    const name = line(title).slice(0, 90).replace(/[。！？；]+$/, '');
    const ask = line(question?.text && typeof question.text === 'object' ? question.text : question).replace(/[。！？；?]+$/, '');
    const card = item?.owner_source_id ? `事项原编号 ${item.owner_source_id}` : `实况事项 ${item?.id}`;
    return `${card}${name ? `（${name}）` : ''}，题号 ${question?.id ?? '没有记录'}${ask ? `「${ask}」` : ''}，我选：${line(option).replace(/[。；]+$/, '')}。请按编号接着办，要我做什么直接问我。`;
  }

  // 一件一件写回，各记各的结果：没生效的写清是哪件、为什么；写回接口说“还没确认”的（unconfirmed）单算，不当失败。
  async function writeItems(live, items, action, followReceipt = false, resume = false) {
    const saved = [], failed = [], receipts = {};
    let pending = 0, unconfirmed = 0;
    // 每件各发一笔；后台慢、没回的，按同一提交编号接着查到真结果（定稿：异步的成功失败回执）。
    const requests = items.map(item => live.applyOwnerItems([item], action, followReceipt, resume));
    for (const [index, result] of (await Promise.all(requests)).entries()) {
      const item = items[index];
      Object.assign(receipts, result.receipts);
      if (result.saved?.length) saved.push(...result.saved);
      else if (result.pending) pending += result.pending;
      else if (result.unconfirmed) unconfirmed += result.unconfirmed;
      else failed.push({ item, name: fieldText(item.text || item.title, 'owner'), error: result.error || '', message: String(result.message || '没有确认保存，请重读这件事。') });
    }
    const failedText = failed.map(f => `「${f.name}」：${f.message.replace(/[。.]+$/, '')}`).join('；');
    const text = word => [`${word} ${saved.length} 件` + (pending ? `，正在写入 ${pending} 件` : '') + '。',
      unconfirmed && (followReceipt ? `暂时没读到 ${unconfirmed} 件的结果，稍后刷新可以看最新状态。` : `还没确认 ${unconfirmed} 件，再点一次可继续核对。`),
      failed.length && `没生效 ${failed.length} 件：${failedText}。`].filter(Boolean).join('\n');
    return { saved, pending, unconfirmed, failed, receipts, text };
  }

  // 刚办成的卡：后台读数要过几分钟才跟上，这期间刷新页面也先不显示它（按卡的版本认，读数一变就照读数显示；最多 10 分钟）
  const SAVED_KEY = 'wly-live-saved-writes';
  function savedWrites() {
    try { const all = JSON.parse(localStorage.getItem(SAVED_KEY) || '{}'), now = Date.now(); for (const [id, v] of Object.entries(all)) if (!(now - v.at < 600000)) delete all[id]; return all; }
    catch { return {}; }
  }
  function rememberSaved(rows) {
    if (!rows.length) return;
    try { const all = savedWrites(); for (const item of rows) all[item.id] = { version: item.item_version, kind: item.kind, at: Date.now() }; localStorage.setItem(SAVED_KEY, JSON.stringify(all)); } catch { /* 存不下就只靠本页 */ }
  }
  function justSaved(item) { const hit = item && savedWrites()[item.id]; return !!hit && !item.closed && hit.version === item.item_version && hit.kind === item.kind; }   // 晚点提醒后到了“你放着”就照常显示
  // 回执弹窗（定稿：异步的成功失败回执；本人 11-23 11:51 要弹窗告诉他保存成功还是失败）：先写“正在保存…”，后台真结果回来再换；失败的留着，能再点一次。
  // 用全站共用的通知浮窗（trust-modal.js 的 SiteNotice），列表还是 #item-action-receipts，等你的事页在它上面听 item-write。
  function itemReceipt(head = '正在保存…', detail = '') { return window.SiteNotice(head, detail, 'item-action-receipts'); }
  function itemFeedback(trigger, message) { itemReceipt().set(/^(?:已|好)/.test(message) ? 'ok' : 'fail', message); }
  // 再点一次用页面上最新的那份（版本变了的卡，重读后按新版本提交）。
  const latestItem = item => [...actionSets.values()].reverse().find(it => it.id === item.id && it.item_version) || item;
  // 点了确认、还没回结果就刷新或离开：记下这次办的是哪几件（30 分钟），回到同一页按同一次操作接着查、照常弹回执；有了结果的就不再记（M945）
  const WRITING_KEY = 'wly-live-item-writing', WRITING_KEEP = 1800000;
  function writingItems() {
    try { const all = JSON.parse(localStorage.getItem(WRITING_KEY) || '{}'), now = Date.now(); for (const [id, v] of Object.entries(all)) if (!(now - v?.at < WRITING_KEEP)) delete all[id]; return all; }
    catch { return {}; }
  }
  function keepWriting(rows, entry) {
    try { const all = writingItems(); for (const item of rows) { if (entry) all[item.id] = { ...entry, row: item }; else delete all[item.id]; } localStorage.setItem(WRITING_KEY, JSON.stringify(all)); } catch { /* 存不下就只靠本页 */ }
  }
  // 写回、跟查到真结果、弹回执。resume：回到页面接着查上回那一次，只按那次的提交编号查，不另起一笔。
  async function saveItems(rows, intent, { trigger = null, extra = '', complete = () => {}, resume = null } = {}) {
    const wording = CONFIRM_ITEM[intent], live = window.Live, lane = document.getElementById('item-action-receipts'), started = resume?.at ?? Date.now();
    // 等你的事页：后台回了“已写成”的从清单撤下；没回、没写上的留在原处（本人 11-26 00:13：显示的结果必须是后台真回的）。
    // 后台的回执（下去的时刻、几点再提醒）一并交给页面，先摆上的那条照回执写，不拿浏览器的钟算
    const project = (saved, receipts = {}) => {
      if (wording.action && lane) lane.dispatchEvent(new CustomEvent('item-write', { detail: { items: rows, saved, intent, at: started, receipts } }));
    };
    const nameOf = item => fieldText(item.text || item.title, 'owner');
    // 点下去马上有动静：按钮换成“正在办…”，弹窗写“正在保存…”。
    const busy = on => {
      if (!trigger) return;
      if (on) { trigger.dataset.busyLabel ??= trigger.textContent; trigger.textContent = '正在办…'; trigger.disabled = true; trigger.classList.add('is-busy'); return; }
      if (trigger.dataset.busyLabel != null) trigger.textContent = trigger.dataset.busyLabel;
      delete trigger.dataset.busyLabel; trigger.disabled = false; trigger.classList.remove('is-busy');
    };
    rows.forEach(item => itemWrites.add(item.id));
    if (!resume) keepWriting(rows, { batch: started + '-' + Math.random().toString(36).slice(2, 8), at: started, intent, page: location.pathname });
    busy(true); project(null);
    const receipt = itemReceipt('正在保存…', rows.length > 1 ? `${rows.length} 件` : nameOf(rows[0]));
    try {
      // 后台忙时一笔要几分钟才写进去：没结果就按同一编号接着查，回执先写“还在保存”，最多再查三轮（约 7 分钟）
      // 回到页面接着查（resume）只看本机记下的结果，查一轮就够：后台没有只读的查回执口，不拿原编号重发
      const saved = [], failed = [], receipts = {};
      let pending = rows;
      for (let round = 0; pending.length && round < (resume ? 1 : 4); round++) {
        if (round) receipt.set('busy', '还在保存…电脑这会儿忙，结果回来就告诉你');
        const result = await writeItems(live, pending, wording.action, true, !!resume);
        saved.push(...result.saved); failed.push(...result.failed); Object.assign(receipts, result.receipts);
        pending = pending.filter(item => !result.saved.includes(item.id) && !result.failed.some(f => f.item === item));
      }
      const left = rows.filter(item => !saved.includes(item.id)), unsure = left.filter(item => !failed.some(f => f.item === item));
      // 结果不明的留着，下回打开这页接着按同一次操作查；保存上和没保存上的不再记。回到页面查过一回的也不再记：再查也查不到新东西，每次打开都弹同一句就成了打扰
      keepWriting(resume ? rows : rows.filter(item => !unsure.includes(item)), null);
      rememberSaved(rows.filter(item => saved.includes(item.id)));
      project(saved, receipts);
      const detail = saved.length === 1 && rows.length === 1 && trigger?.closest('.dossier-card');
      const state = detail && detail.querySelector('[data-part="state"]');
      if (state) { state.textContent = wording.state; detail.querySelectorAll('[aria-haspopup="dialog"]').forEach(button => button.remove()); }
      // 晚点提醒几点再提醒照后台回执说（回执的 until，没有就用后台回话里的“X月X日 10:00 再提醒”），后台没说就不写几点
      const remind = intent === 'later' && [...new Set(saved.map(id => receipts[id]).map(r => r?.until ? `${date(r.until).split('-').map(Number).join('月')}日 ${time(r.until)}` : String(r?.message || '').match(/(\d{1,2}月\d{1,2}日 \d{1,2}:\d{2}) 再提醒/)?.[1] || ''))];
      const savedText = remind ? '已放到你放着' + (remind.length === 1 && remind[0] ? `，${remind[0]} 再提醒` : '') : wording.saved;
      if (!left.length) receipt.set('ok', savedText + (rows.length > 1 ? `（${rows.length} 件）` : ''), { name: extra || (rows.length > 1 ? '' : nameOf(rows[0])) });
      else {
        // 多选时分开说保存上几件、没保存上几件、还没确认几件：结果不明的不算进“没保存上”
        const why = [...failed.map(f => (rows.length > 1 ? `「${f.name}」：` : '') + (FAILED_TEXT[f.error] || f.message)),
          unsure.length && (rows.length > 1 && failed.length ? `还没确认的 ${unsure.length} 件：` : '') + (resume ? '刷新、离开前点的这一下没等到结果。等清单读回来：' + (rows.length > 1 ? '不见了的就是办成了，还在的可以再点一次。' : '这件不见了就是办成了，还在可以再点一次。') : '电脑在忙，还没回结果；稍后刷新看，或者再点一次。')].filter(Boolean).join('\n');
        const head = rows.length > 1 ? [saved.length && `保存上 ${saved.length} 件`, failed.length && `没保存上 ${failed.length} 件`, unsure.length && `还没确认 ${unsure.length} 件`].filter(Boolean).join('，') : failed.length ? '没保存上' : '还没确认保存上';
        receipt.set('fail', head,
          { name: (rows.length > 1 ? '' : nameOf(rows[0]) + '\n') + why + (extra ? '\n' + extra : ''), error: failed.map(f => f.error).filter(Boolean).join(','), retry: () => saveItems(left.map(latestItem), intent, { trigger, complete }) });
      }
      complete(saved);
      await live.refresh();
    } finally {
      rows.forEach(item => itemWrites.delete(item.id));
      busy(false);
    }
  }
  // 回到页面时（本人设备、读到本人份以后）把这一页上回没回结果的那几次接着查完，一页只查一回
  let resumeChecked = false;
  function resumeItemWrites() {
    if (resumeChecked || viewer !== 'owner' || !window.Live?.canOwnerAct?.()) return;
    resumeChecked = true;
    const batches = new Map();
    for (const entry of Object.values(writingItems())) {
      if (entry?.page !== location.pathname || !entry.row?.id || !CONFIRM_ITEM[entry.intent]?.action || itemWrites.has(entry.row.id)) continue;
      if (!batches.has(entry.batch)) batches.set(entry.batch, { at: entry.at, intent: entry.intent, rows: [] });
      batches.get(entry.batch).rows.push(entry.row);
    }
    for (const batch of batches.values()) saveItems(batch.rows, batch.intent, { resume: batch });
  }

  function confirmItems(trigger, items, intent, complete = () => {}) {
    // “不办了”一次选进普通卡和有后续的卡：同一个确认框分两组，普通卡按原编号撤下，有后续的复制给 AI。
    const follow = ['decline', 'decline_copy'].includes(intent) ? items.filter(item => item.decline_followup) : [];
    if (follow.length && follow.length === items.length) intent = 'decline_copy';
    const direct = intent === 'decline' && follow.length ? items.filter(item => !item.decline_followup) : null;
    const answering = intent === 'done' && items.some(item => item.kind === 'choose');
    const wording = CONFIRM_ITEM[intent], live = window.Live, writes = direct || items;
    if (!items.length || !wording || items.some(item => itemWrites.has(item.id)) || document.querySelector('.live-item-confirm[open]')) return;
    // M803：访客（含本人切到看公开版）点关掉类按钮、多选后的处理按钮，和同页别的按钮一样弹全站共用的可信设备说明框；本人设备一时办不了的仍走短浮窗
    if (!live?.canOwnerAct?.()) { if (viewer !== 'owner') window.TrustModal?.show(); else itemFeedback(trigger, '不是可信设备'); return; }
    if (wording.action && writes.some(item => !item.item_version || !item.owner_actions?.includes(wording.action))) {
      itemFeedback(trigger, '这件事刚刚有变化，请重读后再试。'); return;
    }
    // 本人版列全：选了几件就列几件。
    const names = (rows, id = '') => `<ul${id ? ` id="${id}"` : ''} class="live-item-confirm__name live-item-confirm__list">${rows.map(item => `<li>${esc(fieldText(item.text || item.title, 'owner'))}</li>`).join('')}</ul>`;
    const dialog = document.createElement('dialog');
    dialog.className = 'live-item-confirm';
    dialog.setAttribute('aria-labelledby', 'live-item-confirm-title');
    dialog.setAttribute('aria-describedby', 'live-item-confirm-name live-item-confirm-note');
    dialog.innerHTML = `<div class="live-item-confirm__card">
      <button type="button" data-cancel class="live-item-confirm__x" aria-label="关闭确认框">×</button>
      <h2 id="live-item-confirm-title">${esc(answering ? '复制给 AI？' : items.length > 1 ? MANY_TITLE[intent].replace('N', items.length) : wording.title)}</h2>
      ${direct ? `<div id="live-item-confirm-name"><p class="live-item-confirm__group">直接撤下（${direct.length} 件）</p>${names(direct)}<p class="live-item-confirm__group">有后续，复制给 AI（${follow.length} 件）</p>${names(follow)}</div>`
        : items.length === 1 ? `<p id="live-item-confirm-name" class="live-item-confirm__name">${esc(fieldText(items[0].text || items[0].title, 'owner'))}</p>`
        : names(items, 'live-item-confirm-name')}
      <p id="live-item-confirm-note">${esc(direct ? '直接撤下的马上从“等你的事”撤下，记进退出记录，手机不再提醒；有后续的复制成一段话，贴给 AI 处理卡上写的后续。' : answering ? '把这段话贴给 AI，填上你的回答或办理结果。AI 处理后按编号关卡。' : intent === 'decline' && items.every(item => item.kind === 'choose') ? '这次不管了；好了以后再坏，直接给你卡。' : wording.note)}</p>
      <div class="live-item-confirm__buttons">
        <button type="button" data-cancel autofocus>${esc(wording.cancel)}</button>
        <button type="button" data-apply>${esc(wording.confirm)}</button>
      </div></div>`;
    const viewport = window.visualViewport;
    function size() {
      if (!viewport) return;
      const zoom = Math.max(1, 1 / viewport.scale);
      dialog.style.setProperty('--item-confirm-zoom', zoom);
      dialog.style.setProperty('--item-confirm-width', `${viewport.width / zoom}px`);
    }
    dialog.addEventListener('click', event => {
      if (event.target === dialog || event.target.closest('[data-cancel]')) dialog.close();
    });
    dialog.addEventListener('close', () => {
      viewport?.removeEventListener('resize', size);
      dialog.remove();
      trigger.focus({ preventScroll: true });
    }, { once: true });
    dialog.querySelector('[data-apply]').addEventListener('click', async () => {
      dialog.close();
      if (direct) {
        // 先复制（要趁这次点按），再按各卡原编号写回；两组结果在同一张回执里报。
        const ok = await copy(follow.map(item => live.copy(item, 'decline')).join('\n\n'));
        if (ok) complete(follow.map(item => item.id));
        await saveItems(direct, intent, { trigger, complete, extra: `有后续的 ${follow.length} 件` + (ok ? '已复制，粘贴到 AI 对话发送。' : '没复制成，请再试。') });
        return;
      }
      if (!wording.action) {
        // 有后续的“不办了”、办完了：不写后台，复制一段带卡编号的话给 AI，卡留着等 AI 按编号关。
        const ok = await copy(items.map(item => live.copy(item, intent === 'decline_copy' ? 'decline' : intent)).join('\n\n'));
        itemReceipt().set(ok ? 'ok' : 'fail', ok ? '已复制，粘贴到 AI 对话发送' : '没复制成，请再点一次', { name: ok ? (intent === 'decline_copy' ? 'AI 办完后续再关这张卡。' : 'AI 核实后按编号关卡。') : '' });
        if (ok) complete(items.map(item => item.id));
        return;
      }
      await saveItems(items, intent, { trigger, complete });
    }, { once: true });
    size();
    viewport?.addEventListener('resize', size);
    document.body.append(dialog);
    dialog.showModal();
    dialog.querySelector('[autofocus]').focus({ preventScroll: true });
  }
  let receipts, receiptQueued = false;
  const receiptKey = () => 'wly-live-actions:' + (new URLSearchParams(location.search).get('fixture') ?? 'net');
  function actionReceipts() {
    if (!receipts) try { receipts = JSON.parse(localStorage.getItem(receiptKey()) || '{}'); } catch { receipts = {}; }
    return receipts;
  }
  function saveReceipts() { try { localStorage.setItem(receiptKey(), JSON.stringify(receipts)); } catch { /* 本次仍显示 */ } }
  function receiptText(entry, now = Date.now()) {
    const word = INTENT[entry?.intent];
    if (!word) return '';
    const at = offline() && window.Live?.upTo?.(); if (at) now = Date.parse(at);
    const copied = `${time(entry.at)} 已复制「${word}」`;
    return now - entry.at >= 2 * 3600000
      ? `${copied}，${at ? `截至 ${time(at)} 仍在清单里` : '这件事仍在清单里'}`
      : `${copied}，粘贴到 AI 对话发送`;
  }
  function refreshReceipts() {
    receiptQueued = false;
    if (viewer !== 'owner') {
      for (const note of document.querySelectorAll('.row__receipt')) note.remove();
      return;
    }
    for (const btn of document.querySelectorAll('[data-item]')) {
      const host = btn.closest('.row')?.querySelector('.row__text') || btn.closest('.card__body');
      if (!host) continue;
      let note = host.querySelector('.row__receipt');
      const entry = actionReceipts()[btn.dataset.item];
      if (!entry) { note?.remove(); continue; }
      if (!note) { note = document.createElement('p'); note.className = 'row__sub row__receipt'; host.append(note); }
      note.textContent = receiptText(entry);
    }
  }
  function queueReceipts() { if (!receiptQueued) { receiptQueued = true; queueMicrotask(refreshReceipts); } }
  function pruneReceipts(current) {
    const ids = new Set(current.map(it => it.id)), saved = actionReceipts();
    for (const id of Object.keys(saved)) if (!ids.has(id)) delete saved[id];
    saveReceipts(); queueReceipts();
  }
  window.setInterval?.(() => {
    refreshReceipts();
    const mounted = new Set([...document.querySelectorAll('[data-action-set]')].map(button => button.dataset.actionSet));
    for (const [signature, key] of actionKeys) {
      if (mounted.has(key)) continue;
      actionKeys.delete(signature);
      actionSets.delete(key);
    }
  }, 60000);
  function artifactAction(item, kind, route) {
    if (item.no_open === true || pendingField(item) || kind === 'public' && privateField(item)) return null;
    const web = item.web_open, local = item.open;
    if (!pendingField(web) && !(kind === 'public' && privateField(web)) &&
        typeof web?.href === 'string' && /^(?:\/(?![\/\\])|https?:\/\/)/.test(web.href))
      return { kind: 'open', label: web.label || '看这次记录', href: route(web.href) };
    if (kind === 'owner' && typeof local?.item_id === 'string' && local.item_id && typeof local.target === 'string' && local.target)
      return { kind: 'open', label: local.label || '在电脑上打开', href: local };
    // 两版同一套（本人禁令 11-24 14:16）：后台在访客回包里也给这个动作（不带私有路径），访客照样摆这颗按钮，点了由共用拦截弹可信设备说明框
    if (kind !== 'owner' && local && typeof local === 'object' && !Array.isArray(local)) return { kind: 'open', label: local.label || '在电脑上打开', href: local };
    return null;
  }

  function actions(item, list) {
    if (item.closed && actionReceipts()[item.id]) { delete receipts[item.id]; saveReceipts(); }
    queueReceipts();
    if (!list?.length) return '';
    // 同一条目可以在多处有不同的操作，按钮携带生成它的那一套。
    const signature = JSON.stringify([item.id, item.guard, item.text, item.title, item.name, list]);
    let key = actionKeys.get(signature);
    if (!key) {
      key = String(++nextActionKey);
      actionKeys.set(signature, key);
    }
    actionSets.set(key, { ...item, actions: list });
    const binding = `data-item="${esc(item.id)}" data-action-set="${key}"`;
    return list.map((a, i) => {
      const label = fieldHtml(a.label || a.href?.label || '问情况', { name: a.kind === 'open' ? '打开' : '问情况', place: 'button' }), pc = a.kind === 'open' || INTENT[a.intent] ? ' data-needs-pc' : '';
      // 每种按钮占固定的一列（问情况／关掉类／晚点提醒），哪行少一个也不挪位（本人 11-23 圈的对不齐）
      const slot = ` data-slot="${a.kind === 'open' ? 'go' : a.intent === 'later' ? 'later' : INTENT[a.intent] ? 'close' : a.intent === 'ask' || a.label === '问情况' ? 'ask' : 'go'}"`;
      if (a.kind === 'open' && typeof a.href === 'string' && a.href && !/^(file:|[a-z]:[\\/]|\\\\)/i.test(a.href)) {
        return `<a class="btn btn--sm" href="${esc(a.href)}"${/^https:\/\//i.test(a.href) ? ' target="_blank" rel="noopener"' : ''} ${binding} data-open="${i}"${slot}${pc} data-mo-press>${label}</a>`;
      }
      const markup = itemIntent(item, a) ? ' aria-haspopup="dialog"' : INTENT[a.intent] ? ' data-receipt-intent' : '';
      return `<button class="btn btn--sm" type="button" ${binding} data-act="${i}"${markup}${slot}${pc} data-mo-press>${label}</button>`;
    }).join('');
  }

  // 等你的事卡上：登记带的去处（例：“登录牛客”和它的网址）排第一个，绿底白字带 ↗，一眼看得出能点、点了新开那个网址（M491）
  function goActions(item, list) {
    const open = a => a.kind === 'open' && typeof a.href === 'string' && /^https:\/\//i.test(a.href);
    return actions(item, [...list.filter(open), ...list.filter(a => !open(a))])
      .replace(/<a class="btn btn--sm"([^>]*target="_blank"[^>]*)>(.*?)<\/a>/g, '<a class="btn btn--sm btn--go"$1>$2 <span class="btn__go" aria-hidden="true">↗</span></a>');
  }

  function knowledgeCells(r, owner, split = false) {
    const seen = new Set();
    const kind = owner ? 'owner' : 'public';
    const text = (s, name) => {
      if (!owner && privateField(s) || pendingField(s) && !s.value && !s.text) {
        const key = fieldText(s, kind);
        if (seen.has(key)) return '';
        seen.add(key);
      }
      return fieldHtml(s ?? (offline() ? '这块没存下来，连上后补上。' : collectionText()), { name, kind });
    };
    const stamp = at => at ? `${date(at)} ${time(at)}` : offline() ? '' : collectionText();
    if (!owner && (r.visibility === 'owner' || r.public === 'owner')) return [visibilityNote(r, 'public', '这项记录的内容'), '', stamp(r.at)];
    const title = text(r.title || r.name || r.label, '这项记录的标题'), body = r.text ? text(r.text, '正文') : '';
    const statements = (r.statements || []).map(s => `<p class="knowledge-prose">${text(s.text)}<small>${[s.at && stamp(s.at), s.until && `至 ${stamp(s.until)}`, s.state_text, s.role].filter(Boolean).map(value => text(value, '依据说明')).join(' · ')}</small></p>`).join('');
    const period = [r.evidence_from, r.evidence_until].filter(Boolean).map(stamp).join(' 至 ');
    const detail = `${r.detail ? `<p class="knowledge-prose">${text(r.detail)}</p>` : ''}${statements}${period ? `<p>证据时段：${period}</p>` : ''}${r.tags?.length ? `<p>${r.tags.map(value => text(value, '标签')).join(' · ')}</p>` : ''}`;
    const buttons = r.correction_text ? actions(r, [{ kind: 'copy', label: '这条不对', text: r.correction_text }]) : '';
    const note = !owner && !privateField(r.text) && (r.visibility || r.public) ? visibilityNote(r, 'public', '正文') : '';
    const label = `${title}${note ? `<small>${note}</small>` : ''}`, summary = body ? `<p>${body}</p>` : '';
    if (split) return [label, summary, stamp(r.at), detail, buttons];
    return [label, `${summary}${detail ? `<details><summary class="live-disclosure"><span class="disclosure-closed">展开</span><span class="disclosure-open">收起</span><span class="disclosure-chev">›</span></summary>${detail}</details>` : ''}${buttons}`, stamp(r.at)];
  }

  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch { /* 局域网地址没有剪贴板权限，用老办法 */ }
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.append(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    area.remove();
    return ok;
  }

  // 按完字换成“已复制”，1.5 秒后换回
  function flash(btn, text) {
    clearTimeout(btn._flash);
    btn.dataset.label ??= btn.textContent;
    btn.textContent = text;
    btn.classList.add('is-done');
    btn._flash = setTimeout(() => { btn.textContent = btn.dataset.label; btn.classList.remove('is-done'); }, 1500);
  }

  function guard(e) {
    if (viewer === 'owner') return false;
    e.preventDefault();
    window.TrustModal?.show();
    return true;
  }

  function needsPc(e) {
    const button = e.target.closest?.('[data-needs-pc]');
    if (!button || !offline() || e.type === 'keydown' && !['Enter', ' '].includes(e.key)) return;
    e.preventDefault(); e.stopImmediatePropagation();
    let note = button.nextElementSibling;
    if (!note?.matches('.live-pc-note')) { note = document.createElement('span'); note.className = 'live-pc-note'; note.setAttribute('role', 'status'); button.after(note); }
    note.textContent = '电脑连不上，连上后再办';
  }
  window.addEventListener?.('click', needsPc, true);
  window.addEventListener?.('keydown', needsPc, true);

  let privacyAnchor, privacyNote;
  const privacyObserver = typeof MutationObserver === 'function' ? new MutationObserver(() => {
    if (privacyAnchor && !privacyAnchor.isConnected) closePrivacyNote();
  }) : null;
  function closePrivacyNote() {
    privacyAnchor?.setAttribute('aria-expanded', 'false');
    privacyAnchor?.removeAttribute('aria-describedby');
    privacyNote?.remove();
    privacyObserver?.disconnect();
    privacyAnchor = privacyNote = null;
  }
  window.addEventListener?.('click', e => {
    const button = e.target.closest?.('button[data-trust-view]');
    if (!button) { if (!privacyNote?.contains(e.target)) closePrivacyNote(); return; }
    const wasOpen = button === privacyAnchor;
    e.preventDefault(); e.stopImmediatePropagation();
    closePrivacyNote();
    if (wasOpen) return;
    privacyAnchor = button;
    privacyNote = document.createElement('span');
    privacyNote.id = 'live-privacy-note';
    privacyNote.setAttribute('role', 'status');
    privacyNote.textContent = button.dataset.trustExplanation;
    button.after(privacyNote);
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-describedby', privacyNote.id);
    privacyObserver?.observe(document.body, { childList: true, subtree: true });
  }, true);
  window.addEventListener?.('keydown', e => {
    if (privacyNote && e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); closePrivacyNote(); }
  }, true);

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action-set]');
    if (!btn) return;
    const item = actionSets.get(btn.dataset.actionSet);
    const a = item?.actions[Number(btn.dataset.open ?? btn.dataset.act)];
    if (!a) {
      e.preventDefault();
      flash(btn, '请重读后再试');
      return;
    }
    if (a.kind === 'open' && btn.dataset.open != null && /^(?:https?:\/\/|\/live\/)/i.test(a.href) && a.guard !== 'owner' && item.guard !== 'owner') return;
    if (btn.dataset.act == null) return;
    const intent = itemIntent(item, a);
    if (intent) { confirmItems(btn, [item], intent); return; }
    if (guard(e) || itemWrites.has(item.id)) return;
    if (a.kind === 'copy') {
      const ok = await copy(a.text ?? window.Live.copy(item, a.intent || 'ask'));
      flash(btn, ok ? '已复制' : '没复制成');
      if (ok && INTENT[a.intent]) { actionReceipts()[item.id] = { intent: a.intent, at: Date.now() }; saveReceipts(); refreshReceipts(); }
    }
    if (a.kind === 'open') {
      btn.disabled = true;
      try {
        const r = await window.Live.open(item.id, a.target, a.href);
        const row = btn.closest('.row') || btn.parentElement;
        row.querySelector('.row__feedback')?.remove();
        const note = document.createElement('p'); note.className = 'row__sub row__feedback'; note.setAttribute('role', 'status'); note.textContent = r.text; row.append(note);
        if (r.path) {
          const copyPath = document.createElement('button');
          copyPath.type = 'button'; copyPath.className = 'btn btn--sm'; copyPath.textContent = '复制路径';
          copyPath.addEventListener('click', async (event) => {
            if (!guard(event)) flash(copyPath, (await copy(r.path)) ? '已复制' : '没复制成');
          });
          note.append(' ', copyPath);
        } else setTimeout(() => note.remove(), 8000);
      }
      finally { btn.disabled = false; }
    }
  });

  // 点进下一层：新页从被点的那一块长出来、退回时缩回去（全站 motion.js 的 data-mo-open，和首页按钮一套手感）。
  // 第一层的卡从玻璃长，列表里的一行从这一行长；回路、页眉、横着去别的第二层、同一页换参数照普通换页。
  document.addEventListener('click', (e) => {
    const a = e.target instanceof Element && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.origin !== location.origin || !a.pathname.startsWith('/live/') || a.pathname === location.pathname) return;
    if (a.matches('[data-back]') || a.closest('.topbar, .l2-nav, .back')) return;
    const row = a.closest('.row, tbody tr'), card = !row && a.closest('.card--link');
    if (row) row.setAttribute('data-mo-open', '');
    else if (card) card.setAttribute('data-mo-open', '.card__glass');
  }, true);

  // 各层只保留一个页眉占位；导航和右侧操作都从这里生成。
  function header() {
    const bar = document.getElementById('topbar');
    if (!bar) return;
    const links = [['实况', '/live/'], ['原理', '/principles/'], ['规则', '/rules/'], ['技能', '/skills/'], ['项目', '/projects/']];
    if (bar.querySelector('.brand')) {
      const addresses = new Map([...links, ['连接电脑', '/mcp/'], ['授权与状态', '/computer-access/']]);
      bar.querySelectorAll('.pill').forEach(a => { if (addresses.has(a.textContent.trim())) a.href = addresses.get(a.textContent.trim()); });
      liveHeaderBack();
      return;
    }
    bar.innerHTML = `<div class="topbar__glass"></div><nav class="topbar__group" aria-label="主导航">${links.map(([name, href]) => `<a class="pill" href="${href}"${name === '实况' ? ' aria-current="page"' : ''}>${name}</a>`).join('')}</nav><a class="brand" href="/" aria-label="Inside a Personal Agent，回首页"><span class="brand__lamp"></span><span class="brand__word">Inside a Personal Agent</span></a><div class="topbar__group topbar__group--right"><a class="pill" href="/mcp/">连接电脑</a><a class="pill" href="/computer-access/">授权与状态</a></div>`;
    liveHeaderBack();
  }
  header();

  // 沿用页顶离线提示的样式；不占条目编号，页面重读不会把配对结果收掉。
  window.Live?.paired?.then(text => {
    const notices = document.getElementById('notices');
    if (!notices) return;
    const note = document.createElement('li');
    note.className = 'notice glass'; note.setAttribute('role', 'status'); note.textContent = text;
    notices.prepend(note);
    setTimeout(() => note.remove(), 6500);
  });

  // 页顶那张卡（本人 11-23 选的 B，01:01 定了和页顶提醒合成一张）：和下面大卡同宽、同一个样子（玻璃、右边一整幅画），一件事一行，
  // 什么事都没有时整张不出现；出现时从 0 撑开、收起时合拢，下面的卡跟着滑，不跳。
  // 连接那一行：琥珀小灯一直慢慢呼吸、循环箭头一直慢慢转；画在样式表里，卡出现才下载。
  // 原因变了只换粗字。连上后灯变绿、写“已连上”，约 2 秒后收走这一行；卡里没别的事就整张收起。
  // 页面原来的提醒列表（#notices）整个搬进这张卡，各条照旧由各页自己画、按钮和跳转不变；配对失效的说明也放成一行。
  const CONN_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M19.47 11.35A7.5 7.5 0 1 1 15.17 5.2"/><path d="M19.16 7.06 16.07 .66 12.27 8.82Z" fill="currentColor" stroke-width=".8"/></svg>';
  let connBack = 0;
  const connStage = () => document.querySelector?.('body.page--live main.stage');
  const connFit = card => {
    const was = card.hidden;
    card.hidden = !card.querySelector('.live-conn__row') && !card.querySelector('#notices > li');
    if (!was || card.hidden || card.classList.contains('is-closing')) return;
    card.style.height = '0px'; void card.offsetHeight; card.style.height = card.scrollHeight + 'px';
    setTimeout(() => { if (!card.classList.contains('is-closing')) card.style.height = ''; }, 520);
  };
  function connCard(stage) {
    let card = stage.querySelector(':scope > .live-conn');
    if (card) return card;
    card = document.createElement('section'); card.className = 'live-conn glass'; card.setAttribute('role', 'status'); card.hidden = true;
    card.innerHTML = '<span class="live-conn__tint" aria-hidden="true"></span><span class="live-conn__pic" aria-hidden="true"></span><div class="live-conn__rows"></div>';
    const notices = stage.querySelector(':scope > #notices');
    const after = stage.querySelector(':scope > [data-live-view-row], :scope > .back');
    if (notices) notices.before(card); else if (after) after.after(card); else stage.prepend(card);
    if (notices) {
      card.append(notices);
      new MutationObserver(() => connFit(card)).observe(notices, { childList: true });
    }
    connFit(card);
    return card;
  }
  { const init = () => { const stage = connStage(); if (stage) connCard(stage); };
    if (document.readyState === 'loading') document.addEventListener?.('DOMContentLoaded', init, { once: true }); else init(); }
  function connection(state) {
    const stage = connStage();
    if (!stage) return;
    const card = connCard(stage), rows = card.querySelector('.live-conn__rows');
    const row = (key) => {
      let el = rows.querySelector(`.live-conn__row[data-key="${key}"]`);
      if (!el) { el = document.createElement('div'); el.className = 'live-conn__row'; el.dataset.key = key; rows.append(el); }
      return el;
    };
    const put = (el, text) => { if (el && el.textContent !== text) el.textContent = text; };
    const close = (el) => {
      const only = !card.querySelector('#notices > li') && rows.children.length === 1, target = only ? card : el;
      target.style.height = target.offsetHeight + 'px'; void target.offsetHeight;
      target.classList.add('is-closing');
      setTimeout(() => {
        if (!el.classList.contains('is-back')) { target.classList.remove('is-closing'); target.style.height = ''; return; }
        el.remove(); card.classList.remove('is-closing'); card.style.height = ''; connFit(card);
      }, 520);
    };
    let link = rows.querySelector('.live-conn__row[data-key="link"]');
    if (state.offline && !state.publicPaused) {
      clearTimeout(connBack); connBack = 0;
      if (!link) {
        link = row('link');
        link.innerHTML = `<span class="live-conn__lamp" aria-hidden="true"></span><span class="live-conn__say"><b></b><span class="live-conn__at"></span></span><span class="live-conn__wait"><span class="live-conn__spin" aria-hidden="true">${CONN_ICON}</span>连上后会自动换成最新的</span>`;
        rows.prepend(link);
      }
      for (const el of [card, link]) { el.classList.remove('is-closing'); el.style.height = ''; }
      link.classList.remove('is-back');
      put(link.querySelector('b'), state.reason || '连不上实况服务');
      put(link.querySelector('.live-conn__at'), state.pageAtText ? ` · 下面是 ${state.pageAtText} 的数据` : ' · 这页没有可显示的上次数据');
    } else if (link && !link.classList.contains('is-back')) {
      link.classList.add('is-back');
      const upTo = window.Live?.upTo?.() || state.shownAt;
      put(link.querySelector('b'), '已连上');
      put(link.querySelector('.live-conn__at'), upTo ? ` · 数据已更新到 ${time(upTo)}` : '');
      connBack = setTimeout(() => { connBack = 0; if (link.isConnected && link.classList.contains('is-back')) close(link); }, 2000);
    }
    const pair = state.publicPaused ? '' : state.pairNotice || '';
    const pairRow = rows.querySelector('.live-conn__row[data-key="pair"]');
    if (pair) put(row('pair'), pair);
    else pairRow?.remove();
    connFit(card);
  }

  function publicPause(on, message) {
    const stage = document.querySelector('body.page--live main.stage');
    if (!stage) return;
    root.classList.toggle('live-public-paused', on);
    if (!on) {
      stage.querySelectorAll('.live-pause-text,.live-pause-fallback').forEach(el => el.remove());
      stage.querySelectorAll('[data-live-pause-frame]').forEach(el => el.removeAttribute('data-live-pause-frame'));
      stage.inert = false;
      return;
    }
    closePrivacyNote();
    stage.inert = true;
    const selector = '.card,.grp,.book-group,.lb-card';
    const frames = [...stage.querySelectorAll(selector)].filter(el => el.getClientRects().length && !el.parentElement.closest(selector));
    if (!frames.length) {
      const frame = document.createElement('section');
      frame.className = 'card glass live-pause-fallback';
      stage.append(frame);
      frames.push(frame);
    }
    for (const frame of frames) {
      frame.setAttribute('data-live-pause-frame', '');
      const text = document.createElement('p');
      text.className = 'live-pause-text';
      text.textContent = message;
      frame.prepend(text);
    }
  }

  // —— 页眉右边：几点读到、〔问情况〕 ——
  function topbar({ ask }) {
    const group = document.querySelector('.topbar__group--right');
    if (!group) return null;
    group.insertAdjacentHTML('afterbegin',
      '<button class="pill live-at" type="button" aria-live="polite" title="点一下重读"></button>' +
      '<button class="pill live-ask" type="button">问情况</button>');
    const at = group.querySelector('.live-at');
    const askBtn = group.querySelector('.live-ask');
    const pageTitle = document.title || '实况';
    let label = '', busy = false, paused = false;
    // 刷新图标用画好的 SVG：一段顺时针 300° 的圆弧，右上偏上一个实心三角箭头（字体里的 ↻ 在不同字体里样子怪）。
    // 不用“直角折线”箭头（转到缺口朝上像电源键）；箭头小了、线细了又像字母 C。线宽 2.25（显示约 1.5px，和 14px 字的笔画一样重），
    // 箭头尖离圆弧起点约 2px，转到哪个角度都像一个圆在转。
    const icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M19.47 11.35A7.5 7.5 0 1 1 15.17 5.2"/><path d="M19.16 7.06 16.07 .66 12.27 8.82Z" fill="currentColor" stroke-width=".8"/></svg>';
    const show = (text) => html(at, paused ? esc(text) : `<span class="live-refresh-icon" aria-hidden="true">${icon}</span><span class="live-refresh-text">${esc(text)}</span>`);
    const waiting = setTimeout(() => { if (!label) { label = '正在读'; if (!busy) show(label); } }, 2500);
    // 点一下就等于浏览器刷新（本人 M513：页面上的刷新没用、浏览器刷新就好）：整页重新载入，拿到最新版网页和最新数据。
    // 动画照 r62：药丸先收成圆（--live-at-slide）再重新载入；新页面一出来就是收好、接着转的样子，这一轮数据读完、
    // 转到整圈（--live-at-turn）再从正中展开。点的时刻和当时的字记在 sessionStorage，转圈和等多久都从点下去那一刻算。
    const RESUME = 'wly-live-refresh-at';
    let readDone; const read = new Promise(resolve => { readDone = resolve; });
    const resumed = (() => { try { const v = JSON.parse(sessionStorage.getItem(RESUME)); sessionStorage.removeItem(RESUME); return Date.now() - v?.at < 20000 ? v : null; } catch { return null; } })();
    if (resumed) {
      busy = true; label = resumed.label || '';
      show(label);
      at.setAttribute('aria-busy', 'true'); at.setAttribute('aria-label', '正在重读');
      at.classList.add('is-refreshing'); // 按钮刚建出来，第一次排版就是收好的样子，不会再收一遍
      const shrink = ms('--live-at-slide', '760ms') * speed(), turn = ms('--live-at-turn', '1100ms') * speed();
      const spin = at.querySelector('.live-refresh-icon'); if (spin) spin.style.animationDelay = `${shrink - (Date.now() - resumed.at)}ms`;
      read.then(async () => {
        const elapsed = Date.now() - resumed.at; const wait = shrink + Math.max(1, Math.ceil((elapsed - shrink) / turn)) * turn - elapsed; if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));
        busy = false; at.classList.remove('is-refreshing'); at.removeAttribute('aria-busy'); at.setAttribute('aria-label', label); show(label);
      });
    }
    at.addEventListener('click', () => {
      if (busy) return;
      busy = true;
      at.setAttribute('aria-busy', 'true');
      if (!paused) at.setAttribute('aria-label', '正在重读');
      at.querySelector('.live-refresh-text')?.classList.remove('is-swapped');
      at.classList.add('is-refreshing');
      try { sessionStorage.setItem(RESUME, JSON.stringify({ at: Date.now(), label })); } catch { /* 记不下：新页面照常显示，只少展开那一段 */ }
      setTimeout(() => { if (window.Live?.reload) window.Live.reload(); else location.reload(); }, ms('--live-at-slide', '760ms') * speed());
    });
    askBtn.addEventListener('click', async (e) => {
      if (guard(e)) return;
      const text = ask();
      if (text) flash(askBtn, (await copy(text)) ? '已复制' : '没复制成');
    });
    return {
      // 用假数据写“示意数”；真数写“04:12 读到”
      set(state) {
        const nextViewer = state.viewer?.kind === 'public' ? 'public' : 'owner';
        if (viewer !== nextViewer) {
          viewer = nextViewer;
          queueReceipts();
        }
        if (viewer === 'owner') queueMicrotask(resumeItemWrites);   // M945：回到页面接着查上回没回结果的办理
        root.dataset.liveViewer = viewer;
        if (paused && !state.publicPaused) {
          label = '';
          at.removeAttribute('aria-label');
          if (document.title === '实况暂时不公开 · 实况') document.title = pageTitle;
        }
        paused = !!state.publicPaused;
        if (paused) {
          clearTimeout(waiting); readDone();
          label = state.text;
          document.title = `${label} · 实况`;
          at.setAttribute('aria-label', label);
          show(label);
          return;
        }
        const stamp = state.offline ? state.cutoffAt : state.shownAt, atText = stamp ? `${time(stamp)} ${state.offline ? '最后一份' : '读到'}` : '';
        if (stamp || state.offline || state.phase === 'none') { clearTimeout(waiting); readDone(); }
        label = state.meta?.source === 'fixture' ? `示意数${atText ? ` · ${atText}` : ''}` : atText || (state.offline ? '连不上' : state.phase === 'none' ? collectionText() : label);
        if (!busy) show(label);
      },
    };
  }

  // —— 动 ——
  function swapped(el) {
    el.classList.remove('is-swapped');
    void el.offsetWidth;
    el.classList.add('is-swapped');
  }
  // 数变了：只有一个数不一样、别的字都一样时，从旧数走到新数（600 毫秒，--mo-out），不淡换；
  // 钟点、日期、补零的数（04:09、11-15）不走，照旧淡换。
  const NUM = /-?\d+(?:\.\d+)?/g;
  function count(node, from, to) {
    if (/\d[:\-/]\d/.test(from + ' ' + to)) return false;
    const a = from.match(NUM), b = to.match(NUM);
    if (!a || !b || a.length !== b.length || from.replace(NUM, '#') !== to.replace(NUM, '#')) return false;
    const diff = a.map((v, i) => (v !== b[i] ? i : -1)).filter(i => i >= 0);
    if (diff.length !== 1) return false;
    const i = diff[0], v0 = parseFloat(a[i]), v1 = parseFloat(b[i]);
    if (!Number.isFinite(v0) || !Number.isFinite(v1) || /^-?0\d/.test(a[i]) || /^-?0\d/.test(b[i])) return false;
    const dec = Math.max((a[i].split('.')[1] || '').length, (b[i].split('.')[1] || '').length);
    const parts = to.split(NUM);
    const text = (v) => parts.map((p, k) => p + (k < b.length ? (k === i ? v.toFixed(dec) : b[k]) : '')).join('');
    const dur = 600 * speed(), t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      node.textContent = p < 1 ? text(v0 + (v1 - v0) * e) : to;
      if (p < 1) node._count = requestAnimationFrame(tick);
    };
    node._count = requestAnimationFrame(tick);
    return true;
  }
  // 换内容：一样就不动；不一样就换掉并淡换（第一次画不淡换）
  function html(el, next, fade = true) {
    if (el._html === next) return false;
    const first = el._html === undefined;
    const template = document.createElement('template');
    template.innerHTML = next;
    function patch(parent, target) {
      const old = [...parent.childNodes].filter(n => !n.classList?.contains('row__detail') && !n.classList?.contains('row__receipt') && !n.classList?.contains('live-fallback-note'));
      const fresh = [...target.childNodes];
      fresh.forEach((n, i) => {
        const was = old[i];
        if (!was) { parent.append(n.cloneNode(true)); return; }
        if (was.nodeType !== n.nodeType || was.nodeName !== n.nodeName) { was.replaceWith(n.cloneNode(true)); return; }
        if (n.nodeType === Node.TEXT_NODE) {
          cancelAnimationFrame(was._count);
          if (was.textContent !== n.textContent) {
            const counted = fade && !first && !was.parentElement.closest('[data-steady]') && count(was, was.textContent, n.textContent);
            if (!counted) { was.textContent = n.textContent; if (fade && !first && !was.parentElement.closest('[data-steady]')) swapped(was.parentElement); }
          }
        } else if (n.nodeType === Node.ELEMENT_NODE) {
          for (const a of [...was.attributes]) if (!n.hasAttribute(a.name) && a.name !== 'aria-expanded') was.removeAttribute(a.name);
          for (const a of n.attributes) if (a.name !== 'aria-expanded' && was.getAttribute(a.name) !== a.value) was.setAttribute(a.name, a.value + (a.name === 'class' && was.classList.contains('notice-target') ? ' notice-target' : ''));
          patch(was, n);
        }
      });
      old.slice(fresh.length).forEach(n => n.remove());
    }
    if (first) {
      el.innerHTML = next;
      showDeviceNames(el);
    } else {
      showDeviceNames(template.content);
      patch(el, template.content);
    }
    el._html = next;
    return true;
  }

  const ms = (name, fallback) => {
    const v = cssVar(name, fallback);
    return parseFloat(v) * (/ms$/.test(v) ? 1 : 1000);
  };

  // 列表按条目编号更新：没变的不动；变了的原地淡换；新来的先撑开位置再落下淡入；下去的淡出、下面的合拢
  function list(ul, rows, { animate = true } = {}) {
    if (offline()) {
      animate = false;
      if (ul.id === 'notices') rows = rows.filter(r => !/电脑(?:自 |不在线)|连不上(?:电脑|实况服务)|实况服务暂不可用|当前设备未连接网络|暂时读不到本人实况/.test(r.html));
    }
    const old = new Map();
    for (const li of ul.children) if (li.dataset.key && !li.classList.contains('notification-record')) old.set(li.dataset.key, li);
    const k = speed(), positions = new Map([...old.values()].map(li => [li, li.getBoundingClientRect().top]));
    // 正在展开、键盘聚焦或鼠标正在读的条目保留原顺位。
    rows = [...rows];
    [...old.values()].forEach((li, i) => {
      if (!li.matches('.is-expanded,:hover,:focus-within')) return;
      const at = rows.findIndex(r => r.key === li.dataset.key);
      if (at >= 0 && at !== i) rows.splice(Math.min(i, rows.length - 1), 0, rows.splice(at, 1)[0]);
    });
    let prev = null;
    for (const r of rows) {
      let li = old.get(r.key);
      if (li) {
        old.delete(r.key);
        li.className = r.cls + (li.classList.contains('is-expanded') ? ' is-expanded' : '') + (li.classList.contains('notice-target') ? ' notice-target' : '');
        html(li, r.html, animate);
      } else {
        li = document.createElement('li');
        li.className = r.cls;
        li.dataset.key = r.key;
        html(li, r.html, false);
        if (animate && r.enter !== false && ul.isConnected && ul.children.length) enter(li, k);
      }
      let at = prev ? prev.nextElementSibling : ul.firstElementChild;
      while (at && at.classList.contains('is-leaving')) at = at.nextElementSibling;
      if (at !== li) ul.insertBefore(li, at);
      prev = li;
    }
    if (animate) for (const [li, top] of positions) {
      if (old.has(li.dataset.key)) continue;
      const dy = top - li.getBoundingClientRect().top;
      if (dy) li.animate({ transform: [`translateY(${dy}px)`, 'translateY(0)'] }, { duration: Math.min(400, 220 + Math.abs(dy) / 4) * k, easing: cssVar('--mo-move', 'ease') });
    }
    for (const li of old.values()) {
      if (!animate) { li.remove(); continue; }
      li.classList.add('is-leaving');
      delete li.dataset.key;
      leave(li, k);
    }
  }

  // 更新期间锁住眼前的那行；高度动画完成后也不会把它推走。
  // 页面自己要落到某处（从别页点“看等你的事”这类落点）时先 anchor.stop()，还在锁的旧行不再把页面拉回去。
  let anchorRun = 0;
  function anchor(update) {
    if (scrollY < 1 || restoring) { update(); return; }
    const rows = [...document.querySelectorAll('.rows > [data-key]')];
    const visible = rows.filter(el => { const r = el.getBoundingClientRect(); return r.top >= 95 && r.top < innerHeight - 30; });
    const el = visible.find(el => el.matches(':hover,:focus-within')) || visible.find(el => el.classList.contains('is-expanded')) || visible[0];
    const top = el?.getBoundingClientRect().top;
    update();
    if (!el) return;
    const end = performance.now() + 1000 * speed(), run = anchorRun;
    let cancelled = false;
    const stop = () => { cancelled = true; };
    window.addEventListener('wheel', stop, { once: true, passive: true });
    // 顶住的那一行被收起（hidden、整块读不到时只留卡头）就不再顶：它的位置读出来是 0，再顶会每帧往上推、整页跳到页顶（M528）
    function hold() { if (cancelled || run !== anchorRun || !el.isConnected || !el.getClientRects().length || performance.now() >= end) { window.removeEventListener('wheel', stop); return; } const dy = el.getBoundingClientRect().top - top; if (Math.abs(dy) > .5) window.scrollBy(0, dy); requestAnimationFrame(hold); }
    hold();
  }
  anchor.stop = () => { anchorRun++; };
  function enter(li, k) {
    requestAnimationFrame(() => {
      const h = li.offsetHeight;
      li.animate({ height: ['0px', `${h}px`], paddingTop: ['0px', getComputedStyle(li).paddingTop], paddingBottom: ['0px', getComputedStyle(li).paddingBottom] },
        { duration: 220 * k, easing: cssVar('--mo-move', 'ease') });
      li.animate({ opacity: [0, 0, 1], translate: ['0 -8px', '0 -8px', '0 0'], offset: [0, .27, 1] },
        { duration: (220 + 600) * k, easing: cssVar('--mo-out', 'ease') });
    });
  }
  function leave(li, k) {
    li.style.overflow = 'hidden';
    const fade = li.animate({ opacity: [1, 0] }, { duration: 180 * k, easing: cssVar('--mo-in', 'ease'), fill: 'forwards' });
    fade.finished.then(() => {
      const h = li.offsetHeight;
      li.animate({ height: [`${h}px`, '0px'], paddingTop: [getComputedStyle(li).paddingTop, '0px'], paddingBottom: [getComputedStyle(li).paddingBottom, '0px'] },
        { duration: 220 * k, easing: cssVar('--mo-move', 'ease'), fill: 'forwards' }).finished.then(() => li.remove());
    });
  }

  // 展开、翻更多都是阅读，默认向所有访客开放；复制和直接打开由 actions 自己拦。
  // load 只在第一次打开时调（二级的数点开才取）。
  const folds = new Map();
  const returned = window.performance?.getEntriesByType?.('navigation')[0]?.type === 'back_forward'
    ? window.history?.state?.liveUI : null;
  const homePath = /^\/live\/?$/.test(window.location?.pathname || '');
  let departingCard, restoring = false;
  // 首页按卡片偏移恢复，避免浏览器稍后把位置覆写成离开时的绝对 Y。
  if (homePath) history.scrollRestoration = 'manual';
  function homePosition() {
    const cards = [...document.querySelectorAll('.page--live .board .card[id]')];
    const barBottom = document.getElementById('topbar')?.getBoundingClientRect().bottom || 0;
    const visible = cards.map(card => ({ key: card.id, rect: card.getBoundingClientRect() }))
      .filter(({ rect }) => rect.bottom > barBottom && rect.top < (window.visualViewport?.height || innerHeight))
      .sort((a, b) => Math.max(a.rect.top, barBottom) - Math.max(b.rect.top, barBottom) || a.rect.left - b.rect.left);
    const hit = visible.find(card => card.key === departingCard?.id) || visible[0];
    return hit && { key: hit.key, top: hit.rect.top };
  }
  function saveFolds() {
    try { history.replaceState({ ...history.state, liveUI: {
      folds: Object.fromEntries([...folds].map(([key, btn]) => [key, btn.getAttribute('aria-expanded') === 'true'])),
      x: scrollX, y: scrollY, ...(homePath ? { homeCard: homePosition() } : {}),
    } }, ''); } catch { /* 不让存时仍可展开阅读。 */ }
    markLiveView();
  }
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (homePath) departingCard = e.target.closest('.board .card[id]');
    if (link) saveFolds();
  }, true);
  let scrollSave;
  window.addEventListener?.('scroll', () => { clearTimeout(scrollSave); scrollSave = setTimeout(saveFolds, 120); }, { passive: true });
  if (homePath) window.addEventListener('pagehide', () => { clearTimeout(scrollSave); saveFolds(); departingCard = null; });
  window.addEventListener?.('pageshow', e => {
    if (homePath || !returned || e.persisted) return;
    const back = () => window.scrollTo({ left: returned.x, top: returned.y, behavior: 'instant' });
    back();
    if (typeof ResizeObserver !== 'function') return;
    // 正文是读到数据以后才一段段长出来的：页面每变一次高就再落回原处，停稳 1.5 秒、本人自己动了或过了 8 秒才放手；
    // 这段时间里换数据不再按可见那一行顶住位置（anchor），免得两边互相拉。
    const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
    let settle;
    const stop = () => { restoring = false; grow.disconnect(); clearTimeout(timer); clearTimeout(settle); inputs.forEach(type => window.removeEventListener(type, stop, true)); };
    const wait = () => { clearTimeout(settle); settle = setTimeout(stop, 1500); };
    const grow = new ResizeObserver(() => { back(); wait(); });
    const timer = setTimeout(stop, 8000);
    restoring = true;
    inputs.forEach(type => window.addEventListener(type, stop, { capture: true, passive: true }));
    grow.observe(document.body);
    wait();
  });
  function fold(btn, box, load) {
    let node = box, key = '';
    while (node) {
      key = (node.id ? `#${node.id}` : node.dataset?.key ? `${node.tagName}[${node.dataset.key}]` : `${node.tagName}:${[...node.parentElement?.children || []].indexOf(node)}`) + '/' + key;
      if (node.id) break;
      node = node.parentElement;
    }
    folds.set(key, btn);
    const set = async (open, read = true) => {
      btn.setAttribute('aria-expanded', String(open));
      box.inert = !open;
      box.setAttribute('aria-hidden', String(!open));
      box.classList.toggle('is-open', open);
      if (open && read && load && !box._loaded) {
        box._loaded = (await load(box.firstElementChild)) !== false;
      }
    };
    const open = returned?.folds?.[key] === true;
    box._liveOpen = () => set(true);
    if (open) box.style.transition = 'none';
    set(open, false);
    if (open && load) Promise.resolve().then(() => set(true));
    if (open) requestAnimationFrame(() => requestAnimationFrame(() => box.style.removeProperty('transition')));
    btn.addEventListener('click', () => { const pending = set(btn.getAttribute('aria-expanded') !== 'true'); saveFolds(); return pending; });
  }

  // 鼠标悬停照旧；触摸松手后保留读数，再点同一图或别处收起，横拖时跟着读。
  let pinnedPlot = null;
  document.addEventListener('pointerdown', e => { if (pinnedPlot && !pinnedPlot.plot.contains(e.target)) pinnedPlot.clear(); }, true);
  function pointing(plot, at, hide) {
    let pinned = false, touch = null;
    const clear = () => { pinned = false; touch = null; if (pinnedPlot?.plot === plot) pinnedPlot = null; hide(); };
    plot.style.touchAction = 'pan-y';
    plot.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse') return;
      e.preventDefault();
      touch = { id: e.pointerId, x: e.clientX, y: e.clientY, was: pinned, moved: false };
      pinned = true; pinnedPlot = { plot, clear }; at(e); plot.setPointerCapture(e.pointerId);
    });
    plot.addEventListener('pointermove', e => {
      if (e.pointerType === 'mouse') { pinned = false; if (pinnedPlot?.plot === plot) pinnedPlot = null; at(e); }
      else if (touch?.id === e.pointerId) {
        touch.moved ||= Math.hypot(e.clientX - touch.x, e.clientY - touch.y) * (window.visualViewport?.scale || 1) > 6;
        at(e);
      }
    });
    plot.addEventListener('pointerup', e => {
      if (touch?.id !== e.pointerId) return;
      const close = touch.was && !touch.moved;
      touch = null;
      if (close) clear(); else at(e);
    });
    plot.addEventListener('pointercancel', clear);
    plot.addEventListener('pointerleave', () => { if (!pinned) hide(); });
  }

  // —— “新”：这台浏览器上次看过之后才出现的 ——
  // 上次看到的时刻存在浏览器里；第一次来时，半小时内出现的算新。用假数据时不记，每次打开一样
  function seen(name, source) {
    const key = `wly-live-seen:${name}`;
    let since;
    try { since = localStorage.getItem(key); } catch { since = null; }
    return {
      isNew: (born, at) => !!born && Date.parse(born) > (since ? Date.parse(since) : Date.parse(at) - 30 * 60000),
      done(at) { if (source !== 'fixture' && at) try { localStorage.setItem(key, at); } catch { /* 不让存就算了 */ } },
    };
  }

  // —— 加载中：雾里显影 ——
  // 没到的字像隔着起雾的玻璃看过去（糊开的示意字，读不出写的什么）；背景沿用本页随机分配的光色，第一行一颗珍珠白小灯轻轻呼吸。
  // 加载中不比正常的卡多动任何一样东西。数到了：雾里的字换成真字、由糊变清（900 毫秒，先用 160 毫秒显出来），灯换成后端状态色，背景光保持（live-light.js）。
  // 示意字只说“正在读”，糊开后读不出，也不编数。
  const SLOW_TEXT = '这块要多读一会儿';
  const pearl = (small) => `<span class="lamp lamp--pearl${small ? ' lamp--sm' : ''}" aria-hidden="true"></span>`;
  const blur = (text, cls = '') => `<span class="fog__text${cls ? ` ${cls}` : ''}">${esc(text)}</span>`;
  const FOG_LINES = ['正在读这一块最近的情况', '正在读这一块的数，读到了就在这里显出来', '正在读这一块现在怎样'];
  const ghost = {
    // 一张卡：第一行灯 + 一行大字，下面几行小字
    // 第一行大字糊着，旁边一句清楚的小灰字“正在读…”：看得出是在读，不像被打了码
    card: (lines = 2) => `<p class="card__head fog__head">${pearl()}${blur('正在读这一块', 'head__lead')}<span class="fog__note">正在读…<span class="fog__more">${SLOW_TEXT}</span></span></p>` +
      FOG_LINES.slice(0, lines).map((t) => `<p class="fog__line">${blur(t)}</p>`).join(''),
    // 一串行：每行前面一颗不呼吸的珍珠小点
    rows: (n = 4) => Array.from({ length: n }, (_, i) =>
      `<div class="fog__row">${pearl(true)}<p class="fog__line">${blur(i % 2 ? '正在读这一行' : '正在读这一行的时间')}<br>${blur(FOG_LINES[i % 3])}</p></div>`).join(''),
    // 一格曲线：横在曲线大概会在的高度上，一条糊开的珍珠色光带
    chart: () => '<span class="fog__chart"><i class="fog__band"></i></span>',
    // 一个数
    value: () => blur('正在读'),
  };
  function reading(el, { ghost: inner = ghost.card(), name = '', inline = false, slow = true } = {}) {
    const fog = document.createElement(inline ? 'span' : 'div');
    fog.className = 'fog';
    const card = el.closest('.card');
    let stage = '';
    // 所有在读的块同一个节拍：动画都从页面打开那一刻算起，谁先谁后进雾都对得上
    const sync = (node) => node?.style.setProperty('--fog-sync', `${-Math.round(performance.now())}ms`);
    function show(next, say) {
      if (next === stage) return;
      const was = stage;
      stage = next;
      if (!fog.isConnected) {
        // 雾放在不靠数的小标题（data-keep）后面
        const keep = [...el.children].filter((c) => c.matches('[data-keep]')).at(-1);
        if (keep) keep.after(fog); else el.prepend(fog);
      }
      if (next === 'unavailable') {
        fog.innerHTML = `<p class="fog__say"><span class="lamp" aria-hidden="true"></span>${say || esc(name || '这块') + '暂时读不到'}</p>`; fog.removeAttribute('aria-hidden');
      } else if (next === 'gone') {
        // 存不下：一句灰色、静止的话；卡上留名字和一颗灭着的灯
        fog.innerHTML = (name ? `<p class="card__head fog__head"><span class="lamp" aria-hidden="true"></span><span class="head__lead fog__name">${esc(name)}</span></p>` : '') +
          `<p class="fog__say">${/(?:^|[?&])id(?:=|&|$)/.test(typeof location === 'object' ? location.search : '') ? '电脑连不上，这一条现在看不了' : '这块没存下来，连上后补上。'}</p>`;
        fog.removeAttribute('aria-hidden');
      } else if (!was || was === 'gone' || was === 'unavailable') {
        // 读得慢：卡的示意里那句“正在读…”后面接着说；别的示意另起一行，同色同字号
        const own = inner.includes('fog__more');
        fog.innerHTML = (slow ? inner : inner.replace(/<span class="fog__more">[^<]*<\/span>/, '')) +
          (slow && !own ? `<${inline ? 'span' : 'p'} class="fog__slow">${SLOW_TEXT}</${inline ? 'span' : 'p'}>` : '');
        fog.setAttribute('aria-hidden', 'true');
      }
      el.dataset.read = next;
      if (next === 'gone' || next === 'unavailable') el.removeAttribute('aria-busy'); else el.setAttribute('aria-busy', 'true');
      const foggy = next === 'wait' || next === 'slow';
      if (foggy && was !== 'wait' && was !== 'slow') { sync(el); sync(card); }
      card?.classList.toggle('is-fogged', foggy);
      card?.classList.toggle('is-slow', next === 'slow');
    }
    // 数到了、真内容已经画好：出雾。在雾里待过（或收成过一句话）的由糊变清；2.5 秒内就到的只淡入 200 毫秒
    function done(animate = true) {
      const was = el.dataset.read;
      if (!was) return;
      // 真在雾里露过面的（或收成过一句话的）才由糊变清；2.5 秒内就到的、本来藏着没露面的，只淡入 200 毫秒
      const seen = was !== 'idle' && el.getClientRects().length > 0 && !!fog.textContent.trim();
      delete el.dataset.read;
      el.removeAttribute('aria-busy');
      fog.remove();
      stage = '';
      card?.classList.remove('is-fogged', 'is-slow');
      if (!animate) return;
      const cls = seen ? 'is-clearing' : 'is-swapped';
      // 只动刚显出来的内容；不靠数、一直清楚的小标题（data-keep）不跟着糊
      for (const node of el.children) {
        // 一直清楚的小标题（data-keep）不糊，只把刚换上的字淡入
        const how = node.matches('[data-keep]') ? 'is-swapped' : cls;
        node.classList.remove('is-swapped', 'is-clearing');
        void node.offsetWidth;
        node.classList.add(how);
        const off = (e) => { if (e.target !== node) return; node.classList.remove(how); node.removeEventListener('animationend', off); };
        node.addEventListener('animationend', off);
      }
      // 版面一次排成最终的样子，再在最终内容上变清；不边长高边变清（那样会露出被切掉一半的按钮）
    }
    show(offline() ? 'gone' : 'idle');
    return {
      // 照 state.phase 摆：idle、wait、slow、gone 由这里摆；ready 等页面画好真内容后调 done()；none 直接撤掉雾，页面自己写“还没读到”
      set(state) {
        const next = state?.offline && state.data == null ? 'gone' : state?.phase || 'idle';
        if (next === 'ready') return;
        if (next === 'none') { show('unavailable', state.meta?.status === 403 ? privacyLock(name || '这部分内容') : ''); return; }
        show(next, state.say);
      },
      done,
      get phase() { return el.dataset.read || 'ready'; },
    };
  }

  function backupSummary(d) {
    if (!d.protection) return '';
    const missing = offline() ? '这块没存下来，连上后补上。' : collectionText("副本情况");
    const labels = { complete: '齐了', gap: '有缺', local_copy_no_cloud: '有本地副本，云端还没有', single: '只有一份', unknown: missing };
    const states = { partial: '有缺', missing: '没有副本', waiting: '等稳定', failed: '没传成' };
    const places = [['local', '本机'], ['g', 'G 盘'], ['h', 'H 盘']];
    const notes = places.filter(([key]) => states[d[key]?.state]).map(([key, name]) => name + states[d[key].state]);
    for (const [key, name] of [['drive', 'Drive'], ['photos', '照片云']]) {
      if (d[key]?.waiting > 0) notes.push(`${name} ${d[key].waiting} 份在等`);
      if (d[key]?.failed > 0) notes.push(`${name} ${d[key].failed} 份没传成`);
    }
    return [labels[d.protection] || missing, ...notes].join('，');
  }

  // 电脑下面的八页：返回回电脑总览（各页 HTML 里写好），返回下面一排同层切换，这一页标出来（M016、M017）
  (() => {
    const pages = [['/live/storage/', '存储'], ['/live/traffic/', '海外流量'], ['/live/power/', '用电'], ['/live/smooth/', '卡顿与流畅'], ['/live/apps/', '谁在占'], ['/live/usage/', '使用时间'], ['/live/security/', '安全'], ['/live/environment/', '软件与环境']];
    const back = document.querySelector?.('main a.back[href="/live/computer/"]');
    if (!back || !pages.some(([path]) => path === location.pathname)) return;
    const fixture = new URLSearchParams(location.search).get('fixture'), nav = document.createElement('nav');
    nav.className = 'l2-nav live-siblings'; nav.setAttribute('aria-label', '电脑下面的几页');
    nav.innerHTML = `<span class="l2-nav__groups">${pages.map(([path, label]) => path === location.pathname ? `<a aria-current="page">${label}</a>`
      : `<a href="${path}${fixture == null ? '' : `?fixture=${encodeURIComponent(fixture)}`}">${label}</a>`).join('')}</span>`;
    back.after(nav);
  })();

  // 内存的总量、类型、频率、时序、同步：后台低频从机器上取（hardware.memory 或 memory.spec），值为 null 或没给的项不写，带截至哪天（M654）。
  function memorySpec(mem, at, total = false) {
    if (!mem || typeof mem !== 'object') return '';
    const raw = typeof mem.timings === 'string' ? mem.timings.trim() : '', timings = /^\d/.test(raw) ? `C${raw}` : raw;
    const speed = Number.isFinite(mem.freq_mts) ? mem.type ? `${sp(mem.type)}-${mem.freq_mts}` : `${mem.freq_mts} MT/s` : '';
    const sync = ({ synchronous: '同步', asynchronous: '异步' })[mem.sync] || '';
    const parts = [total && Number.isFinite(mem.total_gb) ? `${+mem.total_gb.toFixed(1)} GB` : '', speed, timings, sync].filter(Boolean);
    const when = mem.source_at ?? at;
    return parts.length ? [...parts, Number.isFinite(Date.parse(when)) ? `截至 ${date(when)}` : ''].filter(Boolean).join(' · ') : '';
  }
  window.LiveUI = { memorySpec, justSaved, restoreBack, programName, originName, collectionText, accumulatingText, offline, isReadingCutoff, sameReadingReason, isStale, staleText, olderNote, blockNote, isCutoffNote, sameCutoffNote, withoutSnapshotCutoff, isMissingText, hiddenMore, visitorFieldKind, visitorRewrittenTag, visitorLabel, visitorWholeHidden, privateDownload, trustText, visibilityNote, visitorHiddenMark, visitorHiddenTag, blockSentence, fieldText, capText, chatJoinedReply, chatPreviewSummary, chatStart, chatWaitLabel, chatProgressText, chatShortName, fieldHtml, mergePrivateRows, privateSummary, itemIntent, itemLabels, choiceText, writeItems, confirmItems, knowledgeCells, esc, sp, nowrap, time, date, onBeijingDayChange, ago, minutes, gb, status, head, actions, goActions, artifactAction, copy, flash, topbar, connection, publicPause, html, list, fold, pointing, seen, swapped, guard, anchor, reading, ghost, order, land, chatActivity, receiptText, pruneReceipts, backupSummary, trafficBytes, separateTraffic, separateTrafficNote };
})();
