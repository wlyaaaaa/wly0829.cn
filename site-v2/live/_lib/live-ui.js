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
  // 正文的返回链接只在上一条历史确实是同一目的地时恢复原页位置。
  function restoreBack(e) {
    const link = e.currentTarget;
    if (e.defaultPrevented || !plainClick(e) || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
    const index = liveNavigation?.currentEntry?.index;
    const entry = index > 0 ? liveNavigation.entries()[index - 1] : null;
    if (!entry?.url || entry.getState()?.livePublicView !== window.LiveView?.isPublic()) return;
    const previous = new URL(entry.url);
    // 回实况首页的链接带“#卡片”：上一条去掉 # 后面那段就是实况首页时直接后退，回到离开时的位置（M229）。
    // 自动任务、AI 账本、问题三页归另一条线，照旧要求 # 也相同。
    const liveHome = link.pathname === '/live/' && !document.body?.matches('.page--automation, .page--ledger, [data-record="issue"]');
    if (previous.origin !== link.origin || previous.pathname !== link.pathname || previous.search !== link.search ||
        (link.hash && !liveHome && previous.hash !== link.hash)) return;
    e.preventDefault();
    history.back();
  }

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
  function separateTraffic(row) {
    if (!row || row.name !== 'Claude' || ![row.upload, row.download].every(Number.isSafeInteger) || ![row.from, row.to].every(at => Number.isFinite(Date.parse(at)))) return null;
    const bytes = n => `至少 ${trafficBytes(n, 'B', true)}`;
    const stamp = at => `${date(at)} ${time(at)}`;
    const note = `计量从 ${stamp(row.from)} 到 ${stamp(row.to)} · ${row.note || '独立侧车实测，不重复计入代理合计'}`;
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
  function land() {
    if (landed) return;
    if (returned) { landed = true; return; }
    const p = new URLSearchParams(location.search), id = p.get('item');
    if (!id && !p.has('attention') && !p.has('source')) return;
    const kind = p.get('attention'), cls = p.has('source') ? `source-${p.get('source')}` : kind === '1' ? 'is-attention' : `attention-${kind}`;
    const targets = [...document.querySelectorAll('[data-key]')].filter(el => id ? el.dataset.key === id : el.classList.contains(cls));
    if (!targets.length) return;
    landed = true;
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
    if (data.gray_count > 0) notes.push(`${esc(data.gray_count)} 项读不准`);
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
  function privacyLock(what, { name = '', block = '', group = false } = {}) {
    const specific = name && /^这个项目的(?:内容|说明)$/.test(what || '') ? name : what;
    const subject = (specific || block || name || '这项内容').replace(/[，：:]$/, '');
    const context = name && name.replace(/[，：:]$/, '') !== subject && name !== block ? `${name}：` : '';
    const intro = block ? `以下是${block}，属于隐私信息，不予公开。`
      : group ? `${subject}${/未公开|不公开|不对外展示|隐藏/.test(subject) ? '' : '未公开'}。`
        : `这里藏的是${subject}。`;
    const seen = block ? '这部分的原文' : group
      ? /应用.*名/.test(subject) ? '这些应用的名称' : `这些${subject.replace(/^(?:另有|其中)\s*\d+\s*[项件个条份处次]?\s*/, '').replace(/未公开$|不对外展示$/, '') || '条目'}的原文`
      : subject.replace(/[。.]$/, '').replace(/(?:原文)?$/, '原文');
    // 访客版写清藏了什么：“〈哪一样〉仅本人可见”。
    const label = /仅本人可见/.test(subject) ? subject : `${subject}仅本人可见`;
    return explanationButton('owner', label, subject, `${context}${intro}本人能看到${seen}。`, group);
  }
  function rewriteNote(name, kind) {
    const label = kind === 'owner' ? '对外换了说法' : '换了说法', subject = name || '这句话';
    return explanationButton('rewritten', label, subject, `${subject}对外换了说法。本人能看到原文。`);
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
      if (plain) return `${label || '这项原文'}仅本人可见`;
      return privacyLock(label.replace(/[，：:]$/, ''), { name: what, block: item.hidden_block, group: /^(?:另有|其中)\s*\d+/.test(label) });
    }
    if (item?.visibility === 'rewritten' || item?.public === 'rewrite') {
      // 访客：只是把号码、私事句换成“仅本人可见”，不是换了说法，不再挂“换了说法”。
      if (kind !== 'owner' && [item.text, item.now, item.value, item.title].some(v => /仅本人可见/.test(fieldText(v, kind)))) return '';
      if (kind !== 'owner' && privateField(item.text)) return fieldHtml(item.text, { kind, name: what || '正文' });
      return rewriteNote(label, kind);
    }
    return '';
  }
  const hiddenMore = (n, unit, what) => n > 0 ? privateSummary(n, { unit, what }) : '';
  function escapeNotes(text) {
    // 只让共用函数生成的固定结构通过，其余内容一律按文字显示。
    return String(text ?? '').split(/(<button type="button" class="trust-note live-mark live-mark--(?:owner(?: live-mark--group)?|rewritten)" title="[^"<>]*" data-trust-context="[^"<>]*" data-trust-explanation="[^"<>]*" aria-expanded="false" aria-controls="live-privacy-note" data-trust-view>(?:<span class="live-mark__lock" aria-hidden="true">🔒<\/span>)?<span class="live-mark__label">[^<]*<\/span><\/button>)/g).map((part, index) => index % 2 ? part : esc(part)).join('');
  }
  function trustText(text, kind = viewer) {
    if (typeof text === 'number' && !Number.isFinite(text)) text = '';
    if (text && typeof text === 'object') {
      return fieldHtml(text, { kind });
    }
    return escapeNotes(text);
  }
  const hiddenBlockText = value => value?.hidden_block ? `${value.hidden_block}的原文仅本人可见` : '';
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
      return /^(?:已完成|做完了|正在处理|在干|等回答|没有标题|没有记录)(?:\s|$)|没有.*记录$|(?:仅本人可见|可信设备可见|正在换说法)$|^[-\w]+$/.test(line) ? '' : kind !== 'owner' && line.length > 32 ? line.slice(0, 31) + '…' : line;
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
        : esc(`${fieldText(v.hidden_what) || (place === 'title' ? '标题' : name || '这一项')}仅本人可见`);
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
  function privateSummary(count, { unit = '件', what = '' } = {}) {
    return privacyLock(`另有 ${count} ${unit}${what}`, { group: true });
  }
  function mergePrivateRows(rows) { return rows; }
  const INTENT = { done: '复制给 AI', decline: '不办了', later: '晚点提醒', ack: '我知道了', close_report: '关掉' };
  const CONFIRM_ITEM = {
    decline: { action: 'dismiss', title: '这件不办了？', note: '马上从“等你的事”撤下，记进退出记录，手机不再提醒。', cancel: '再想想', confirm: '不办了', saved: '已撤下这件事', state: '你说不办了' },
    done: { title: '复制办理结果？', note: '把这段话贴给 AI。AI 核实后按编号关卡。', cancel: '取消', confirm: '复制给 AI' },
    decline_copy: { title: '复制给 AI 处理后续？', note: '把这段话贴给 AI，请它处理卡上写的后续。', cancel: '取消', confirm: '复制给 AI' },
    later: { action: 'snooze', title: '晚点再提醒？', note: '移到“你放着”，明天上午 10 点再提醒。', cancel: '取消', confirm: '明天再提醒', saved: '已移到你放着，明天上午 10 点再提醒', state: '晚点再提醒' },
    ack: { action: 'ack', title: '确认已知？', note: '马上从“等你的事”撤下，并写入退出记录。', cancel: '取消', confirm: '我知道了', saved: '已记为本人已知', state: '本人已知' },
    close_report: { action: 'dismiss', title: '关掉这份汇报？', note: '从“等你答的汇报”撤下，保留原链接和关闭记录。', cancel: '取消', confirm: '关掉', saved: '已关掉汇报', state: '汇报已关闭' },
  };
  const MANY_TITLE = { decline: '这 N 件都不办了？', done: '复制这 N 件的办理结果？', decline_copy: '复制这 N 件的后续给 AI？',
    later: '这 N 件都晚点再提醒？', ack: '这 N 件都确认已知？', close_report: '关掉这 N 份汇报？' };
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
  async function writeItems(live, items, action, followReceipt = false) {
    const saved = [], failed = [], requests = [];
    let pending = 0, unconfirmed = 0;
    for (const item of items) {
      const result = await live.applyOwnerItems([item], action);
      // 先逐条提交，未完成的回执可以同时核对。
      requests.push(followReceipt && (result.pending || result.unconfirmed) ? live.applyOwnerItems([item], action, true) : result);
    }
    for (const [index, result] of (await Promise.all(requests)).entries()) {
      const item = items[index];
      if (result.saved?.length) saved.push(...result.saved);
      else if (result.pending) pending += result.pending;
      else if (result.unconfirmed) unconfirmed += result.unconfirmed;
      else failed.push({ name: fieldText(item.text || item.title, 'owner'), message: String(result.message || '没有确认保存，请重读这件事。') });
    }
    const failedText = failed.map(f => `「${f.name}」：${f.message.replace(/[。.]+$/, '')}`).join('；');
    const text = word => [`${word} ${saved.length} 件` + (pending ? `，正在写入 ${pending} 件` : '') + '。',
      unconfirmed && (followReceipt ? `暂时没读到 ${unconfirmed} 件的结果，稍后刷新可以看最新状态。` : `还没确认 ${unconfirmed} 件，再点一次可继续核对。`),
      failed.length && `没生效 ${failed.length} 件：${failedText}。`].filter(Boolean).join('\n');
    return { saved, pending, unconfirmed, failed, text };
  }

  function itemFeedback(trigger, message, ms = 6500) {
    const notices = document.getElementById('item-action-receipts') || document.getElementById('notices');
    const note = document.createElement(notices ? 'li' : 'span');
    note.className = notices ? 'notice glass' : 'row__feedback';
    note.setAttribute('role', 'status');
    note.textContent = message;
    note.style.whiteSpace = 'pre-line';   // 多选结果分行写
    if (notices) notices.prepend(note); else trigger.after(note);
    setTimeout(() => note.remove(), ms);
  }

  function confirmItems(trigger, items, intent, complete = () => {}) {
    // “不办了”一次选进普通卡和有后续的卡：同一个确认框分两组，普通卡按原编号撤下，有后续的复制给 AI。
    const follow = ['decline', 'decline_copy'].includes(intent) ? items.filter(item => item.decline_followup) : [];
    if (follow.length && follow.length === items.length) intent = 'decline_copy';
    const direct = intent === 'decline' && follow.length ? items.filter(item => !item.decline_followup) : null;
    const answering = intent === 'done' && items.some(item => item.kind === 'choose');
    const wording = CONFIRM_ITEM[intent], live = window.Live, writes = direct || items;
    if (!items.length || !wording || items.some(item => itemWrites.has(item.id)) || document.querySelector('.live-item-confirm[open]')) return;
    if (!live?.canOwnerAct?.()) { itemFeedback(trigger, '不是可信设备'); return; }
    if (wording.action && writes.some(item => !item.item_version || !item.owner_actions?.includes(wording.action))) {
      itemFeedback(trigger, '这件事刚刚有变化，请重读后再试。'); return;
    }
    const lane = document.getElementById('item-action-receipts');
    const followReceipt = !!lane && !!wording.action;
    const project = saved => {
      if (followReceipt) lane.dispatchEvent(new CustomEvent('item-write', { detail: { items: writes, saved } }));
    };
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
      <p id="live-item-confirm-note">${esc(direct ? '直接撤下的马上从“等你的事”撤下，记进退出记录，手机不再提醒；有后续的复制成一段话，贴给 AI 处理卡上写的后续。' : answering ? '把这段话贴给 AI，填上你的回答或办理结果。AI 处理后按编号关卡。' : wording.note)}</p>
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
      items.forEach(item => itemWrites.add(item.id));
      dialog.close();
      project(null);
      try {
        if (direct) {
          // 先复制（要趁这次点按），再按各卡原编号写回；两组结果分开报。
          const ok = await copy(follow.map(item => live.copy(item, 'decline')).join('\n\n'));
          const result = await writeItems(live, direct, wording.action, followReceipt);
          project(result.saved);
          itemFeedback(trigger, result.text('已撤下') + '\n有后续的 ' + follow.length + ' 件' + (ok ? '已复制，粘贴到 AI 对话发送。' : '没复制成，请再试。'), result.failed.length || result.unconfirmed ? 20000 : 6500);
          complete([...result.saved, ...(ok ? follow.map(item => item.id) : [])]);
          await live.refresh();
          return;
        }
        if (!wording.action) {
          const ok = await copy(items.map(item => live.copy(item, intent === 'decline_copy' ? 'decline' : intent)).join('\n\n'));
          itemFeedback(trigger, ok ? '已复制，粘贴到 AI 对话发送。' : '没复制成，请再试。');
          if (ok) complete(items.map(item => item.id));
          return;
        }
        const result = await writeItems(live, items, wording.action, followReceipt), { saved, pending, unconfirmed, failed } = result;
        project(saved);
        if (saved.length === 1 && items.length === 1) {
          const detail = trigger.closest('.dossier-card');
          const state = detail?.querySelector('[data-part="state"]');
          if (state) {
            state.textContent = wording.state;
            detail.querySelectorAll('[aria-haspopup="dialog"]').forEach(button => button.remove());
          }
        }
        const count = !failed.length && !pending && !unconfirmed ? wording.saved + '（' + items.length + ' 件）' : result.text('已生效');
        const failure = followReceipt && failed.length
          ? `${({ dismiss: '没关掉', ack: '没记下已知', snooze: '没改好提醒时间' })[wording.action]}：${failed[0].message}` : failed[0]?.message;
        const message = items.length > 1 ? count : saved.length ? wording.saved : pending ? '已收到，正在写入这件事。'
          : unconfirmed ? followReceipt ? '暂时没读到办理结果，稍后刷新可以看最新状态。' : '还没确认结果，再点一次可继续核对。' : failure;
        const name = followReceipt && items.length === 1 ? fieldText(items[0].text || items[0].title, 'owner') : '';
        itemFeedback(trigger, name ? `${message}\n${name}` : message, (followReceipt || items.length > 1) && (failed.length || unconfirmed) ? 20000 : 6500);
        complete(saved);
        await live.refresh();
      } finally {
        items.forEach(item => itemWrites.delete(item.id));
      }
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
      if (a.kind === 'open' && typeof a.href === 'string' && a.href && !/^(file:|[a-z]:[\\/]|\\\\)/i.test(a.href)) {
        return `<a class="btn btn--sm" href="${esc(a.href)}"${/^https:\/\//i.test(a.href) ? ' target="_blank" rel="noopener"' : ''} ${binding} data-open="${i}"${pc} data-mo-press>${label}</a>`;
      }
      const markup = itemIntent(item, a) ? ' aria-haspopup="dialog"' : INTENT[a.intent] ? ' data-receipt-intent' : '';
      return `<button class="btn btn--sm" type="button" ${binding} data-act="${i}"${markup}${pc} data-mo-press>${label}</button>`;
    }).join('');
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

  function connection(state) {
    const stage = document.querySelector('body.page--live main.stage');
    if (!stage) return;
    let banner = stage.querySelector('.live-connection-banner');
    if (!state.pageText) { banner?.remove(); return; }
    if (!banner) {
      banner = document.createElement('p'); banner.className = 'live-connection-banner'; banner.setAttribute('role', 'status');
      const after = stage.querySelector(':scope > [data-live-view-row], :scope > .back');
      if (after) after.after(banner); else stage.prepend(banner);
    }
    if (banner.textContent !== state.pageText) banner.textContent = state.pageText;
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
    at.addEventListener('click', async (e) => {
      if (busy) return;
      busy = true;
      const started = performance.now(), shrink = ms('--live-at-slide', '760ms') * speed(), turn = ms('--live-at-turn', '1100ms') * speed();
      at.setAttribute('aria-busy', 'true');
      if (!paused) at.setAttribute('aria-label', '正在重读');
      at.querySelector('.live-refresh-text')?.classList.remove('is-swapped');
      at.classList.add('is-refreshing');
      try { await window.Live.refresh(); }
      finally {
        const elapsed = performance.now() - started; const wait = shrink + Math.max(1, Math.ceil((elapsed - shrink) / turn)) * turn - elapsed; if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));
        busy = false; at.classList.remove('is-refreshing'); at.removeAttribute('aria-busy'); at.setAttribute('aria-label', label); show(label);
      }
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
        root.dataset.liveViewer = viewer;
        if (paused && !state.publicPaused) {
          label = '';
          at.removeAttribute('aria-label');
          if (document.title === '实况暂时不公开 · 实况') document.title = pageTitle;
        }
        paused = !!state.publicPaused;
        if (paused) {
          clearTimeout(waiting);
          label = state.text;
          document.title = `${label} · 实况`;
          at.setAttribute('aria-label', label);
          show(label);
          return;
        }
        const stamp = state.offline ? state.cutoffAt : state.shownAt, atText = stamp ? `${time(stamp)} ${state.offline ? '最后一份' : '读到'}` : '';
        if (stamp || state.offline || state.phase === 'none') clearTimeout(waiting);
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
    function hold() { if (cancelled || run !== anchorRun || !el.isConnected || performance.now() >= end) { window.removeEventListener('wheel', stop); return; } const dy = el.getBoundingClientRect().top - top; if (Math.abs(dy) > .5) window.scrollBy(0, dy); requestAnimationFrame(hold); }
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

  window.LiveUI = { restoreBack, programName, collectionText, accumulatingText, offline, isReadingCutoff, sameReadingReason, isStale, staleText, olderNote, blockNote, isCutoffNote, sameCutoffNote, withoutSnapshotCutoff, isMissingText, hiddenMore, privateDownload, trustText, visibilityNote, fieldText, chatJoinedReply, chatPreviewSummary, chatStart, chatWaitLabel, chatProgressText, chatShortName, fieldHtml, mergePrivateRows, privateSummary, itemIntent, itemLabels, choiceText, writeItems, confirmItems, knowledgeCells, esc, sp, nowrap, time, date, onBeijingDayChange, ago, minutes, gb, status, head, actions, artifactAction, copy, flash, topbar, connection, publicPause, html, list, fold, pointing, seen, swapped, guard, anchor, reading, ghost, order, land, chatActivity, receiptText, pruneReceipts, backupSummary, trafficBytes, separateTraffic };
})();
