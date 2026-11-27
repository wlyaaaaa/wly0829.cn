// 实况第二层：一个项目（/live/project/?id=…）。47 个项目共用这一套排版，每个项目自己的底色（layout.js 分色）。
// 页头：名字＋日用/偶用/冻结＋（项目介绍、问情况）；一行“最近改动 ｜ 一句话说明”，最近改动写了什么、近 7 天影响改动、有多大收在“详情 ›”。
// 页头下一条关键数字：代表数、近 7 天影响改动、名下任务/技能、AI 手上、等你的、最近产物、有多大；能点的点进下一页。
// 下面两栏卡片：项目自己声明的一段一张卡（同一段的数、逐项清单那几行、图合在一张里），另有最近产物（#artifacts）、技能使用、更多数据；
// 卡右上角“看全部 ›”（去逐项明细或原地展开）；两栏按卡的高度摆齐；没有的块不出卡。
// 每个读数只露读数和一句解释，口径、截止时刻这些合进卡底的“说明”收起来。
// 数只从 Live 来：projects/<id>、projects/<id>/artifacts；null 写“还没读到”，不写 0。
(async () => {
  'use strict';
  const titleText = (value, fallback) => {
    const reading = U.fieldText(value, projectViewer);
    // 先认结构标记，再认占位字（“〈哪一样〉仅本人可见”，和旧的两种写法）。
    const hidden = value?.hidden || value?.hidden_block || projectViewer === 'public' && (value?.visibility === 'owner' || value?.public === 'owner');
    return hidden || /(?:仅本人可见|可信设备可见|正在换说法)$/.test(reading) ? fallback : reading;
  };
  const marker = (v, kind, name = '内容') => v && (v.hidden || v.visibility || v.public || v.rewrite) ? window.LiveUI.fieldHtml({ text: kind === 'owner' ? '' : undefined, hidden: kind !== 'owner' && (v.hidden || v.visibility === 'owner' || v.public === 'owner'), visibility: v.visibility, public: v.public, rewrite: v.rewrite, hidden_what: v.hidden_what }, { name, kind }) : '';
  const isStale = data => data?.stale === true || data?.q === 'stale' || data?.state === 'stale';
  function staleText(data, at, now = Date.now()) {
    return window.LiveUI.staleText(data, at || data?.at, now);
  }
  const U = window.LiveUI;
  const Light = window.LiveLight;
  const { esc, sp } = U;
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const interfaceProjects = new Set(['passwordcenter', 'proxyclean', 'pcconfig', 'pc-panel-hub', 'video-scaffold', 'localocr', 'ai-cli-profile-manager', 'wly0829.cn', 'agents', 'chineseasr']);
  let interfaceLoad;
  // 个别项目自己的几块（账房先生：finance.js）：adapt 改这一页的数据，strip 加关键数字第一格，board 加卡
  const custom = window.ProjectPages?.[id] || null;
  const artifactVersion = id === 'agents' && /^E\d+$/.test(params.get('artifact') || '') && params.get('artifact');
  function projectLookKey(id) {
    let hash = 0x811c9dc5;
    for (const byte of new TextEncoder().encode(id || '')) hash = Math.imul(hash ^ byte, 0x01000193);
    return (hash >>> 0).toString(16).padStart(8, '0');
  }
  function applyProjectLook(hero, id, looks) {
    const key = projectLookKey(id), look = looks[key] || (typeof window === 'object' ? window.LiveProjectLook?.of(id, looks) : null);
    hero.dataset.frozen = String(look?.frozen === true);
    hero.dataset.pic = look?.layout === 'left' ? 'left' : 'right';
    hero.toggleAttribute('data-wide', look?.layout === 'wide');
    if (look) { hero.dataset.look = key; hero.style.setProperty('--pj-glow-a', look.glow[0]); hero.style.setProperty('--pj-glow-b', look.glow[1]); }
    else { delete hero.dataset.look; hero.style.removeProperty('--pj-glow-a'); hero.style.removeProperty('--pj-glow-b'); }
    for (const img of hero.querySelectorAll('.card__pic img, .card__tint')) img.src = look?.img || '/live/img/projects.webp';   // 图址写全在 looks.json 里，构建才认得出、收得进
  }
  const looks = window.LiveProjectLook.load();
  // 这一页的底色：这个项目自己的两色（共用小件 LiveProjectLook：looks.json 的 glow，没登记的按项目固定分）；冻结的项目颜色收一点
  function paintTone(lookMap) {
    const look = window.LiveProjectLook?.of(id, lookMap || {});
    if (!look) return;
    window.LiveProjectLook.paint(document.documentElement, look);
    if (look.frozen) document.body.classList.add('pj-frozen');
    requestAnimationFrame(() => document.body.classList.add('pj-toned'));
  }
  // 站内地址带上 ?fixture（锚点留在最后）
  const route = (href) => {
    if (!params.has('fixture') || !href.startsWith('/live/')) return href;
    const [path, hash = ''] = href.split('#');
    return `${path}${path.includes('?') ? '&' : '?'}fixture=${encodeURIComponent(params.get('fixture'))}${hash ? `#${hash}` : ''}`;
  };
  const enc = encodeURIComponent;
  const missingText = (state, what = '项目') => state?.offline || U.offline?.() ? '这块没存下来，连上后补上。'
    : [404, 503].includes(state?.meta?.status) ? `${U.fieldText(what) || '项目'}暂时读不到` : `${U.fieldText(what) || '项目'}没有记录`;

  const hero = $('pj-hero');
  let coverSlug;
  const lookReady = Promise.all([looks, fetch('/live/project/cover-links.json').then(r => r.ok ? r.json() : {}).catch(() => ({}))])
    .then(([lookMap, coverLinks]) => {
      coverSlug = Object.keys(coverLinks).find(slug => coverLinks[slug] === id);
      applyProjectLook(hero, id, lookMap);
      paintTone(lookMap);
    });
  // 页头的几块在卡里；关键数字那一条在卡下面
  const part = (name) => hero.querySelector(`[data-part="${name}"]`) || document.querySelector(`[data-part="${name}"]`);
  U.fold(part('detail'), part('factsbox'));
  const notices = $('notices'), emptyHero = document.createElement('p'); emptyHero.className = 'pj-note'; emptyHero.hidden = true; hero.before(emptyHero);
  const main = $('pj-main'), side = $('pj-side'), board = $('pj-board');
  Light.add(hero);

  const back = document.querySelector('[data-back]');
  const from = new URL(document.referrer || '/', location.href);
  const fromList = from.origin === location.origin && /^\/live\/projects\/(?:index\.html)?$/.test(from.pathname);
  back.href = fromList ? from.pathname + from.search + from.hash : route(back.getAttribute('href'));
  back.addEventListener('click', U.restoreBack);

  // —— 数怎么写 ——
  const num = (n) => (typeof n === 'number' ? n.toLocaleString('zh-CN', { maximumFractionDigits: Math.abs(n) < 10 ? 2 : 1 }) : sp(String(n)));
  // 有多大：一万以上写“万”（154 万字、9.7 万行），以下照写（3,200 字）
  function big(n, unit) {
    if (n == null) return '';
    if (n < 1e4) return `${num(n)} ${unit}`;
    const v = n / 1e4;
    return `${v >= 100 ? Math.round(v) : +v.toFixed(1)} 万${unit}`;
  }
  function dateOnly(at, now = Date.now()) {
    if (!/^\d{4}-\d\d-\d\d$/.test(at || '')) return '';
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(now));
    const days = (Date.parse(today) - Date.parse(at)) / 86400000;
    return days === 0 ? '今天' : days === 1 ? '昨天' : days > 0 ? `${days} 天前` : `${-days} 天后`;
  }
  function stamp(at, precision) {
    if (!at) return '';
    if (precision === 'date') at = at.slice(0, 10);
    if (/^\d{4}-\d\d-\d\d$/.test(at)) return at.startsWith('2026-') ? at.slice(5) : at;
    const fields = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(/(?:Z|[+-]\d\d:\d\d)$/.test(at) ? at : `${at}+08:00`)).map(p => [p.type, p.value]));
    return `${fields.year === '2026' ? '' : fields.year + '-'}${fields.month}-${fields.day} ${fields.hour}:${fields.minute}`;
  }
  const shortDate = stamp;
  const isStamp = v => typeof v === 'string' && /^\d{4}-\d\d-\d\d(?:T|$)/.test(v);
  // 读数句子里夹着的机器时刻（2026-11-17T15:47:23.82+08:00）按北京时间写成“11-17 15:47”
  const isoText = t => typeof t === 'string' ? t.replace(/\b\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d+)?)?(?:Z|[+-]\d\d:\d\d)?/g, x => { const at = /(?:Z|[+-]\d\d:\d\d)$/.test(x) ? x : `${x}+08:00`; return Number.isFinite(Date.parse(at)) ? stamp(x) : x; }) : t;
  const metricText = v => sp(sp(v).replace(/\d{4}-\d\d-\d\d(?:T\d\d:\d\d(?::\d\d(?:\.\d+)?)?(?:Z|[+-]\d\d:\d\d)?)?/g, stamp).replaceAll('登记', '记录'));
  // 后台有几项口径只给了一个内部代号（我的说明书“说明”点开那几句），换成人话
  const SCOPE_WORDS = { 现行主题卡: '只算现在在用的认识，退役的旧认识不算', 现有记录: '按库里现在留着的记录算' };
  const metricNote = v => metricText(typeof v === 'string' && Object.hasOwn(SCOPE_WORDS, v.trim()) ? SCOPE_WORDS[v.trim()] : v);
  // 公开版：名字能公开的那一行留在原位，数的位置写“仅本人可见”；名字本身就露私事的，后端不给这一行、只给个数（段的 hidden），
  // 合成段尾一句“另有 N 项仅本人可见”。只放宽，不在前端再藏别的。
  const lower = (m, key) => (m?.lower_bound === true || m?.at_least === true || m?.isPartial === true || m?.value?.lower_bound === true || m?.value?.at_least === true || m?.value?.isPartial === true) || m?.q === 'partial' && (!Array.isArray(m.partial) || m.partial.includes(key));
  const isPrivate = (m) => m.private === true || ((m.public === 'owner' || m.visibility === 'owner') && m.value == null && (m.text == null || /(?:仅本人可见|可信设备可见)$/.test(m.text)));
  const hideZero = (m) => m.hide_zero && !isPrivate(m) && !lower(m, m.count != null ? 'count' : 'value') && (m.value === 0 || m.count === 0);
  const unknownValue = m => m.value === null && m.q === 'unknown';
  const hasValue = m => !!cardReading(m) || !!window.ProjectAdditions?.structuredMetric(m, stamp, projectViewer) || m.count != null || isPrivate(m) || m.rewrite === 'pending' || m.text != null || (m.value && typeof m.value === 'object' ? m.value.hidden || m.value.rewrite === 'pending' || m.value.text != null || m.value.count != null || m.value.value != null : m.value != null);
  const restricted = v => v?.hidden || v?.hidden_block || v?.visibility === 'pending' || v?.rewrite === 'pending' || projectViewer === 'public' && (v?.visibility === 'owner' || v?.public === 'owner');
  const hookEvents = { UserPromptSubmit: '发消息后', SessionStart: '新开对话时', PreToolUse: '工具运行前', PostToolUse: '工具运行后' };
  const agentsTimed = m => id === 'agents' && ['hook_prompt', 'hook_session', 'hook_tools', 'hook_errors', 'quotes_recent'].includes(m.id);
  // 原话存档：滚动窗口的终点是最后一条原话存进来的时刻，过了几个钟头再叫“近 24 小时”不对；写成“到 X 为止的 24 小时”（M769）
  function quotesWindow(m, source) {
    const end = m.window_as_of || m.source_at || m.at, d1 = source?.[1], d7 = source?.[7];
    if (!end || !Number.isFinite(Date.parse(/(?:Z|[+-]\d\d:\d\d)$/.test(end) ? end : `${end}+08:00`)) || !Number.isFinite(d1) && !Number.isFinite(d7)) return '';
    return `到 ${stamp(end)} 为止：${[Number.isFinite(d1) && `24 小时 ${num(d1)} 条`, Number.isFinite(d7) && `7 天 ${num(d7)} 条`].filter(Boolean).join('，')}`;
  }
  function cardReading(m) {
    if (!agentsTimed(m)) return null;
    const source = m.value && typeof m.value === 'object' ? m.value : m;
    if (restricted(m) || restricted(source)) return restricted(m) ? m : source;
    const raw = source.text ?? m.text;
    const dated = typeof raw === 'string' && /^截至/.test(raw), quote = dated ? raw : m.window_text ?? raw;
    const text = m.id === 'quotes_recent'
      ? quotesWindow(m, source) || (typeof quote === 'string' ? quote.replace(/\d{4,}(?=\s*条)/g, n => num(+n)) : quote ?? [7, 1].filter(n => Number.isFinite(source[n])).map(n => `近 ${n === 7 ? '7 天' : '24 小时'} ${num(source[n])} 条`).join(' · '))
      : dated ? raw
      : m.summary_zh ?? source.summary_zh ?? (typeof raw === 'string' ? raw.replace(/\b(UserPromptSubmit|SessionStart|PreToolUse|PostToolUse)\b/g, word => hookEvents[word]) : raw);
    return text && typeof text === 'object' ? text : text ? { ...source, value: undefined, text } : null;
  }
  // 一个数：大号的数和小号的单位分开；接口给了现成的文字（“一般 0.4 秒、慢时 2.1 秒”）就照写
  function rawValue(m) {
    if (isPrivate(m)) return { html: `<span class="pj-none">${marker({ visibility: 'owner' }, projectViewer, m.hidden_what || '这项读数')}</span>`, plain: '', long: false };
    if (id === 'daily-preferences' && m.id === 'cards-notice' && !restricted(m) &&
        (m.text ?? m.value) === '逐项认识可展开查看') {
      return rawValue({ ...m, value: null, text: '点各类右侧的「明细」进入对应页面' });
    }
    const special = window.ProjectAdditions?.lowerBoundValue(m) || window.ProjectAdditions?.timestampObject(m, stamp) || window.ProjectAdditions?.structuredMetric(m, stamp, projectViewer)
      || window.ProjectAdditions?.rulesLengthReading?.(m);
    if (special) return { html: `<span class="pj-text">${esc(special)}</span>`, plain: special, long: true };
    if (m.rewrite === 'pending' && m.count == null && m.value == null && m.text == null || m.value?.hidden || m.value?.rewrite === 'pending' && m.value.count == null && !m.value.text) { const text = metricText(m.value && typeof m.value === 'object' ? m.value : m); return { html: `<span class="pj-text">${U.fieldHtml(m.value && typeof m.value === 'object' ? m.value : m, { name: '项目读数', kind: projectViewer })}</span>`, plain: text, long: true }; }
    const reading = cardReading(m);
    if (reading) return { html: `<span class="pj-text">${U.fieldHtml(reading, { name: '项目读数', kind: projectViewer })}</span>`, plain: U.fieldText(reading, projectViewer), long: true };
    // 读数本身是个时刻（“画面更新于”这类）：用后端给的那句（“07-28 05:51”），没给就按北京时间写，不露机器格式
    if (isStamp(m.value) && (m.text != null || Number.isFinite(Date.parse(/(?:Z|[+-]\d\d:\d\d)$/.test(m.value) || m.value.length === 10 ? m.value : `${m.value}+08:00`)))) return rawValue({ ...m, value: null, text: m.text ?? stamp(m.value) });
    if (m.text != null || m.value?.text != null || isStamp(m.value)) { const text = isoText(metricText(m.text ?? m.value?.text ?? m.value)); return { html: `<span class="${/还没读到|还在采集|开始记|没读全|还不准/.test(text) ? 'pj-none' : 'pj-text'}">${isoText(U.fieldHtml(m.value && typeof m.value === 'object' ? m.value : m, { name: '项目读数', kind: projectViewer }))}</span>`, plain: text, long: [...text].length > 12 }; }
    if (m.count != null) return { html: `<b>${esc(num(m.count))}</b><small>项</small>`, plain: `${num(m.count)} 项`, long: false };
    if (m.value && typeof m.value === 'object') {
      const scalar = m.value.text ?? m.value.count ?? m.value.value;
      if (typeof scalar === 'number' || typeof scalar === 'string') return rawValue({ ...m, value: scalar, text: null });
      const missing = U.offline?.() ? '' : U.collectionText(m.label || '', { ...m, ...m.value }); return { html: `<span class="pj-none">${missing}</span>`, plain: missing, long: false };
    }
    if (m.value == null) return { html: `<span class="pj-none">${U.offline?.() ? '' : m.q === 'warming' ? '正在准备' : U.collectionText(m.label || '', m)}</span>`, plain: '', long: false };
    if (['bytes', 'B', '字节'].includes(m.unit)) {
      const units = ['B', 'KB', 'MB', 'GB', 'TB'], power = m.value ? Math.min(4, Math.max(0, Math.floor(Math.log2(Math.abs(m.value)) / 10))) : 3;
      const n = num(m.value / 1024 ** power), unit = units[power];
      return { html: `<b>${esc(n)}</b><small>${unit}</small>`, plain: `${n} ${unit}`, long: false };
    }
    const seconds = ['ms', '毫秒'].includes(m.unit) && Math.abs(m.value) >= 1000;
    const n = num(seconds ? m.value / 1000 : m.value), u = seconds ? '秒' : m.unit || '';
    return { html: `<b>${esc(n)}</b>${u ? `<small${u === '%' ? ' class="is-tight"' : ''}>${esc(u)}</small>` : ''}`, plain: `${n}${u && u !== '%' ? ' ' : ''}${u}`, long: false };
  }
  function value(m) {
    const v = rawValue(m), field = m.count != null ? 'count' : 'value';
    if (!isPrivate(m) && lower(m, field) && (typeof m[field] === 'number' || m.lower_bound || m.value?.lower_bound) && !v.plain.startsWith('至少') && !v.plain.startsWith('不到')) {
      v.html = `<small class="pj-atleast">至少</small>${v.html}`; v.plain = `至少 ${v.plain}`;
    }
    return v;
  }
  // 数下面的小字：旧读数统一写截止，静态数带测量日期。
  // mark 是仅本人可见、换了说法这类标记；lead 是“一句解释”（接口的 note）；all 是全部小字（卡里只露 lead，其余收进“说明”）。
  function subPieces(m) {
    const note = m.note && metricNote(m.note), html = v => U.fieldHtml(v, { name: '读数说明', kind: projectViewer });
    const windowAt = agentsTimed(m) && !restricted(m) && !restricted(m.value) && (m.window_as_of || m.source_at || m.at);
    // 原话存档的读数里已经写了“到 X 为止”，没旧就不再补一句“数据截至 X”
    const windowed = m.id === 'quotes_recent' && windowAt && !isStale(m) && !!quotesWindow(m, m.value && typeof m.value === 'object' ? m.value : m);
    const windowDate = windowAt && stamp(windowAt), lead = /此后未更新/.test(note || '') ? note
      : windowDate && !windowed ? `数据截至 ${windowDate}${isStale(m) ? '，此后未更新' : ''}` : note;
    const gap = m.value?.gap || m.gap;
    const pieces = [m.checked_at && `最近检查成功 ${stamp(m.checked_at)}`, typeof m.scope === 'string' && metricNote(m.scope), note, id === 'agents' && m.id === 'release' && m.at && `${stamp(m.at)} 生效`, gap && (!windowDate || !metricNote(gap).includes(windowDate)) && gap, !windowAt && staleText(m, m.at), !windowAt && m.mode === 'static' && !isStale(m) && !U.offline?.() && m.at && `${shortDate(m.at)} 取的`];
    // 后台在这一项上标了 visitor_labels（整项 '$' 或读数字段）的，本人版在读数下面挂“访客看不到／对外换了说法”，访客版只挂后一种（M930）
    const labeled = U.visitorLabel(m, ['$', 'text', 'value'], m.hidden_what || '这项读数', projectViewer);
    return { mark: (!isPrivate(m) && marker(m, projectViewer, m.hidden_what || '这项读数')) || labeled || '', lead: lead ? html(lead) : '', all: [...new Set(pieces.filter(Boolean).map(html))] };
  }
  function sub(m) {
    const p = subPieces(m);
    return [p.mark, ...p.all].filter(Boolean).join(' · ');
  }
  const subText = text => {
    const pieces = String(text).split(/(<button\b[^>]*>[\s\S]*?<\/button>|<span\b[^>]*>[^<]*<\/span>)/g);
    return `<span class="pj-note-piece">${pieces.map((part, i) => i % 2 ? part : part.replaceAll(' · ', ' </span><span class="pj-note-piece">· ').replace(/\d+(?:[.,]\d+)*[ \t]*(?:[GMKT]?B(?:\/s)?|kWh|ms|FPS|GHz|MHz|W|%|℃|°C|小时|分钟|秒|分|天|个月|年|个|件|项|次|份|台|条)(?:前|后)?[。，、；：）]?/g, '<span class="pj-unit">$&</span>')).join('')}</span>`;
  };
  const attention = it => ['waiting', 'pending'].includes(it.state) || ['waiting', 'pending', '在等'].includes(it.state_text);
  const recordKey = it => it.id || it.name || it.label || it.text;
  const records = (section, attention = false) => route(`/live/records/?project=${enc(id)}&section=${enc(section)}${attention ? '&attention=1' : ''}`);
  function recordSection(field) {
    const section = typeof field === 'string' ? field : field?.value;
    return typeof section === 'string' && U.fieldText(field, projectViewer) === section ? section : '';
  }
  // 规则版本号（E 加数字）点了去规则页（本人 11-24 13:00）：AI 百工谱的现役版本、上一版两个读数，和下面“规则版本”卡里的逐版号
  const RULES = '/rules/';
  const ruleVersion = v => typeof v === 'string' && /^E\d+$/.test(v);
  const ruleLink = html => `<a class="row__title" href="${RULES}">${html}</a>`;
  function metricHref(m) {
    if (m.href) return route(m.href);
    if (id === 'agents' && ['release', 'previous_release'].includes(m.id) && ruleVersion(m.value ?? m.text)) return RULES;
    const section = recordSection(m.section);
    if (['waiting', 'pending'].includes(m.id) || /等待|待核对/.test(m.label || '')) {
      const lists = [...new Set((proj?.sections || []).flatMap(s => (s.metrics || []).filter(x => x.expandable).map(x => recordSection(x.section))).filter(Boolean))];
      const target = section || (!m.section && lists.length === 1 ? lists[0] : '');
      if (target) return records(target, true);
    }
    return m.expandable && section ? records(section) : '';
  }

  // —— 一段的几种行 ——
  // 卡里一个读数只露读数和一句解释（note）；口径、截止、取数日期放进 extra，由 fill 合进这一张卡的“说明”
  const plain = html => String(html).replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  function lineOf(m, v, arrow = '') {
    const p = subPieces(m), desktop = id === 'pcconfig' && m.id === 'remote' ? window.ProjectAdditions?.desktopNote(m, projectViewer, lower) : '';
    // “这件事最后一次发生”的那一句（LiveProjectMoments）：一张卡里几项同一句时写在卡底一次（moment_shared），否则跟在这一项下面
    const moment = m.moment && !m.moment_shared ? U.fieldHtml(m.moment, { name: '读数说明', kind: projectViewer }) : '';
    // 同处标一次：读数本身已挂了“对外换了说法／访客看不到”签，下面那句不再挂第二个
    const line = [!(v && /\blive-mark\b/.test(v.html)) && p.mark, desktop && esc(desktop), p.lead].filter(Boolean).join(' · ');
    return { line, moment, desktop, cadence: window.ProjectAdditions?.metricCadence(m, id, arrow) || arrow, extra: p.all.filter(x => x !== p.lead), labelText: metricText(m.label || '') };
  }
  // 后台在读数名上标了 visitor_labels.label 的（访客看到的名字换过说法，或看不到），名字旁挂现有的小签；名字能点时挂在链接外面
  const labelTag = m => U.visitorLabel(m, 'label', '这一项的名称', projectViewer);
  const metricArrow = '<span class="more__chev">›</span>';
  // 数字格：读数在上（大）、名字在下，一格一个数；字长的占一整行，最多两行，点一下看全
  function figRow(m) {
    const v = value(m), href = metricHref(m), { line, moment, extra, labelText, cadence } = lineOf(m, v, href ? ' ' + metricArrow : '');
    const tag = labelTag(m), label = `<span class="pj-fig__k" title="${esc(metricText(m.label))}">${U.fieldHtml(m.label, { name: '读数', place: 'label' })}${href ? '' : tag}${cadence}</span>`;
    return {
      key: m.id, extra, labelText,
      cls: `pj-fig${v.long ? ' pj-fig--wide' : ''}${isStale(m) ? ' is-stale' : ''}`,
      html: `${href ? `<a class="pj-fig__link" href="${esc(href)}">${label}</a>${tag}` : label}${href ? `<a class="pj-fig__link pj-fig__v" title="${esc(v.plain)}" href="${esc(href)}">${v.html}</a>` : `<span class="pj-fig__v" title="${esc(v.plain)}"${v.long ? ' data-clamp' : ''}>${v.html}</span>`}${line ? `<small class="pj-fig__sub" title="${esc(plain(line))}">${subText(line)}</small>` : ''}${moment ? `<small class="pj-fig__sub pj-moment">${moment}</small>` : ''}`,
    };
  }
  // 两列小表（“更多数据”）：名字左、数右，一项一行；名字下一句解释
  function kvRow(m) {
    const v = value(m), href = metricHref(m), { line, moment, extra, labelText, cadence } = lineOf(m, v, href ? ' ' + metricArrow : '');
    const label = U.fieldHtml(m.label, { name: '读数', place: 'label' }) + cadence, tag = labelTag(m);
    return {
      key: m.id, extra, labelText,
      cls: `pj-kv__row${v.long || v.plain.length > 9 ? ' pj-kv__row--wide' : ''}${isStale(m) ? ' is-stale' : ''}`,
      html: `<span class="pj-kv__k">${href ? `<a href="${esc(href)}">${label}</a>` : label}${tag}${line ? `<small class="pj-kv__sub" title="${esc(plain(line))}">${subText(line)}</small>` : ''}${moment ? `<small class="pj-kv__sub pj-moment">${moment}</small>` : ''}</span>${href ? `<a class="pj-fig__link pj-kv__v" title="${esc(v.plain)}" href="${esc(href)}">${v.html}</a>` : `<span class="pj-kv__v" title="${esc(v.plain)}"${v.long || v.plain.length > 9 ? ' data-clamp' : ''}>${v.html}</span>`}`,
    };
  }
  // 状态文字沿用原说法，灯只照后端 level 画。
  const STATE = { ready: '好了', done: '好了', waiting: '在等', pending: '在等', partial: '只读到一部分', stale: '是旧的', failed: '没成' };
  function itemRow(it, index, viewer) {
    if (it.private_count) return { key: it.key, cls: 'row row--flat', html: U.privateSummary(it.private_count) };
    const status = U.status(it, { small: true });
    if (it.title && ('statements' in it || 'detail' in it || 'correction_text' in it)) {
      const text = s => U.fieldHtml(s);
      const statements = (it.statements || []).map(s => `<p class="knowledge-prose">${text(s.text)}<small>${[s.at && stamp(s.at), s.until && `至 ${stamp(s.until)}`, s.state_text, s.role].filter(Boolean).map(text).join(' · ')}</small></p>`).join('');
      const period = [it.evidence_from, it.evidence_until].filter(Boolean).map(stamp).join(' 至 ');
      const detail = `${it.detail ? `<p class="knowledge-prose">${text(it.detail)}</p>` : ''}${statements}${period ? `<p>证据时段：${period}</p>` : ''}${it.tags?.length ? `<p>${it.tags.map(text).join(' · ')}</p>` : ''}`;
      const buttons = it.correction_text ? U.actions(it, [{ kind: 'copy', label: '这条不对', text: it.correction_text }]) : '';
      return { key: it.id || `record-${index}`, cls: 'row row--flat pj-item', html: `${status.lamp || '<span></span>'}<div class="row__text"><p class="row__main"><span class="row__title">${text(it.title)}</span></p>${it.text || marker(it, projectViewer, it.hidden_what || '这项资料') ? `<p class="row__sub">${[it.text ? text(it.text) : '', marker(it, projectViewer, it.hidden_what || '这项资料')].filter(Boolean).join(' · ')}</p>` : ''}${detail ? `<details><summary class="live-disclosure"><span class="disclosure-closed">展开</span><span class="disclosure-open">收起</span><span class="disclosure-chev">›</span></summary>${detail}</details>` : ''}${buttons}</div><span class="pj-at">${stamp(it.at)}</span>` };
    }
    const said = sp(STATE[it.state_text] || it.state_text || STATE[it.state] || '未记录状态');
    const detail = [status.note, marker(it, projectViewer, it.hidden_what || '这项资料'), it.text && (it.name || it.label) && U.fieldHtml(it.text, { name: '条目说明', kind: projectViewer }), it.version != null && `版本 ${U.fieldHtml(it.version, { name: '版本', kind: projectViewer })}`, it.bytes != null && esc(U.gb.scaled(it.bytes))].filter(Boolean).join(' · ');
    return {
      key: it.id || `record-${index}`,
      group: STATE[it.state] || it.state || '',
      cls: `row row--flat pj-item${attention(it) ? ' is-attention' : ''}`,
      html: `${status.lamp || '<span></span>'}<div class="row__text"><p class="row__main"><span class="row__title">${U.fieldHtml(it.name || it.label || it.text || '')}</span>${said ? `<span class="row__meta">${U.fieldHtml(said)}</span>` : ''}</p>${detail ? `<p class="row__sub">${detail}</p>` : ''}</div><span class="pj-at">${esc(stamp(it.file_at || it.at))}</span>`,
    };
  }
  function pcActions(item, list) {
    return U.actions(item, list).replace(/<(button|a)([^>]*data-(?:act|open)="(\d+)"[^>]*)>/g, (tag, name, attrs, index) => {
      const a = list[index], href = a?.href;
      return a?.kind === 'open' && (typeof href !== 'string' || /^(?:file:|[a-z]:[\\/]|\\\\)|grafana/i.test(href) || /在电脑|打开对话|打开汇报|Grafana/.test(a.label || '')) ? `<${name} data-needs-pc${attrs}>` : tag;
    });
  }
  function artifactRow(it, index, sharedAt = false) {
    const item = { ...it, id: `${id}-artifact-${index}-${it.at || ''}` };
    // 整件藏起来（content_locked 或整件标了不公开）才锁整行；只藏了标题的，说明和打开链接照常给，标题处写清藏的是名称。
    if (projectViewer === 'public' && (it.content_locked || restricted(it) || it.title === '一样私事成品')) {
      return { key: item.id, cls: 'row row--flat pj-item', html: `<span></span><div class="row__text"><p class="row__main"><span class="row__title">成品名称仅本人可见</span></p></div><span class="pj-at">${esc(stamp(it.at, it.at_precision))}</span>` };
    }
    if (it.title === '一样私事成品') {
      const title = [it.title, stamp(it.at, it.at_precision).split(' ')[0]].filter(Boolean).join(' · ');
      return { key: item.id, cls: 'row row--flat pj-item', html: `<span></span><div class="row__text"><p class="row__main"><span class="row__title">${esc(title)}</span></p></div>` };
    }
    const publicTitle = projectViewer === 'public' ? it.public_title : null, field = publicTitle ?? it.title ?? it.name ?? '产物';
    const prefix = `${sp(proj?.name)} · `, trim = title => typeof title === 'string' && title.startsWith(prefix) ? title.slice(prefix.length) : title;
    const text = value => U.fieldHtml(typeof value === 'string' ? metricText(value) : value, { name: '产物标题', kind: projectViewer });
    const title = trim(field), titleVisible = publicTitle != null || U.fieldText({ ...it, value: undefined, text: field }, projectViewer) === U.fieldText(field, projectViewer);
    const canShorten = id === 'agents' && titleVisible && typeof title === 'string';
    const legacy = canShorten && /。；/.test(title) && /^(E\d+)\s*[｜|：:]\s*([^。！？\n]+[。！？])/.exec(title);
    const brief = canShorten ? trim(it.display_title) || null : null, version = canShorten && /^(E\d+)\s*[｜|：:]/.exec(title)?.[1];
    const display = typeof brief === 'string' && brief && version && !/^E\d+\b/.test(brief) ? `${version}｜${brief}` : brief ?? (legacy ? `${legacy[1]}｜${legacy[2]}` : title);
    const nameHidden = projectViewer === 'public' && [it.recent_title, it.title].some(v => restricted(v) || /(?:仅本人可见|可信设备可见)$/.test(sp(v)));
    const name = nameHidden ? '成品名称仅本人可见' : titleVisible ? [proj?.name && text(proj.name), text(it.recent_title || '已登记的成品')].filter(Boolean).join(' · ') : '';
    // M684：本人版成品名称旁按后台 visitor_labels.title 挂签；后台还没标、但访客版另有名字（public_title 和本人版的名字不一样）的，就是成品改了名字，挂第二种签。
    const renamed = projectViewer === 'owner' && typeof it.public_title === 'string' && it.public_title.trim() && it.public_title.trim() !== U.fieldText(it.recent_title || it.title, projectViewer).trim();
    // 整条只给本人的成品（visibility: 'owner'，或后台标了整块 hidden）：本人版名称后挂“访客看不到”，点开写访客版看不到这份成品的标题和内容
    // 只在最外面挂一个（LOOKS1126 ②）：这个项目整个访客看不到时，页头已挂“访客看不到”，成品各行一个签都不再挂；
    // 只是这份成品整条看不到时，签挂在名称旁，“在电脑上打开”旁不再重复挂
    const quiet = projectViewer === 'owner' && U.visitorWholeHidden(proj, ['$', 'name']);
    const whole = projectViewer === 'owner' && U.visitorWholeHidden(it, ['$']);
    const wholeTag = whole && !quiet ? U.visitorHiddenMark(it, '这份成品', projectViewer, { keys: ['$'] }) : '';
    const nameTag = !name || quiet ? '' : wholeTag || U.visitorLabel(it, ['$', 'title', 'recent_title'], '这份成品的名称', projectViewer) || (renamed ? U.visitorRewrittenTag('这份成品的名称', '', projectViewer) : '');
    const changes = canShorten && Array.isArray(it.changes) && it.changes.length ? it.changes : display !== title ? [typeof title === 'string' ? title.replace(/([。！？])\s*；/g, '$1') : title] : [];
    const details = changes.length ? `<details${artifactVersion ? ' open' : ''}><summary class="live-disclosure">查看改动${Number.isFinite(it.change_count) ? `（${num(it.change_count)} 条）` : ''}</summary>${changes.map(change => `<p class="row__sub">${text(change)}</p>`).join('')}</details>` : '';
    const publicLink = projectViewer === 'public' && typeof it.open === 'string' && !it.web_open ? { href: it.open, label: '打开成品' } : it.web_open;
    // 新私事规则：登记时填了 open_note 的成品，访客版在打开链接的位置显示这句普通字（“这里是……，所以不予展示”）；本人版照给链接，旁边挂签。
    // M684：访客那边正文看不到（整块写成“这里是……，所以不予展示”），挂“访客看不到”；后台给了 visitor_labels.open 时照它挂哪种。
    const openNote = U.fieldText(it.open_note, projectViewer).trim();
    // 两版同一套：访客版正文那句（open_note）照写，打开按钮也照摆，不再让那句把按钮压掉
    const target = !artifactVersion && U.artifactAction({ ...it, web_open: publicLink }, projectViewer, route);
    const action = target ? projectViewer === 'public' && typeof target.href === 'string'
      ? `<a class="btn btn--sm" href="${esc(target.href)}"${/^https?:/i.test(target.href) ? ' target="_blank" rel="noopener"' : ''} data-mo-press>${esc(target.label)}</a>${U.visitorLabel(it, 'open', '这份成品的正文', projectViewer)}`
      : pcActions(item, [target]) + (quiet || whole ? '' : U.visitorLabel(it, 'open', '这份成品的正文', projectViewer) || (openNote ? U.visitorHiddenTag('这份成品的正文', `访客版在打开链接的位置写：${openNote}`, projectViewer) : '')) : '';
    const noteLine = !artifactVersion && openNote && projectViewer === 'public' ? `<p class="row__sub">${esc(openNote)}</p>` : '';
    const canOpen = projectViewer === 'owner' && !!target && (typeof target.href === 'string' || !!target.href?.target && !!target.href?.item_id);
    const note = canOpen ? '' : marker(it, projectViewer, it.hidden_what || '产物文件');
    // 没写说明就不写这一行（原来的兜底句“这项成品已有登记，内容说明待补充。”两版读着都像没写）
    const explanation = titleVisible ? it.recent_detail || '' : '';
    const solution = canShorten && typeof it.solves === 'string' ? it.summary_zh || it.solves : it.solves;
    const knownSolution = solution && !/^(?:没有|未)记录(?:解决)?(?:[。.]|$)/.test(sp(solution));
    const solves = knownSolution ? `<p class="row__sub">解决：${U.fieldHtml(solution, { name: '解决', kind: projectViewer })}</p>` : '';
    return {
      key: item.id,
      cls: 'row row--flat pj-item',
      html: `<span></span><div class="row__text"><p class="row__main"><span class="row__title">${name}</span>${nameTag}</p><p class="row__sub">${[explanation ? U.fieldHtml(explanation, { name: '产物说明', kind: projectViewer }) : '', note].filter(Boolean).join(' · ')}</p>${solves}${details}${action ? `<div class="acts">${action}</div>` : noteLine}</div><span class="pj-at">${sharedAt ? '' : esc(stamp(it.at, it.at_precision))}</span>`,
    };
  }

  // —— 一段的骨架：搭一次，以后只换里面变了的 ——
  // 头一行：段名（加粗）+ 这一段回答你什么（浅）；下面行；多的收成“还有 N 项 ›”往下长开；有逐项明细的给一条去第三层的路；
  // 最后是这一段的小字和“另有 N 项仅本人可见”
  const LIST = { figs: 'pj-figs', kv: 'pj-kv', rows: 'rows list' };
  const SHOW = { figs: 8, kv: 5, rows: 5 };
  // 分批展开（R147）：先露 SHOW 那几条，点“展开（还有 N 条）”一次多露一批，露到底变“收起”；一批多少按排版定
  const BATCH = { figs: 8, kv: 10, rows: 10 };
  // reveal：这一块每组已多露了几条（组名 → 条数），重画时照着露；more(key)：这一组读完了、后面还能接着读（更早的改动、更多产物），这时不写“收起”，由那颗按钮接着读
  function groupedRows(rows, preview = SHOW.rows, reveal = new Map(), more = null) {
    const groups = new Map();
    for (const row of rows) { const key = row.group || ''; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(row); }
    const list = items => `<ul class="rows list">${items.map(r => `<li class="${r.cls}" data-key="${esc(r.key)}">${r.html}</li>`).join('')}</ul>`;
    return [...groups].map(([key, items]) => {
      const extra = Math.max(0, items.length - preview), open = Math.min(extra, reveal.get(key) || 0), left = extra - open;
      const step = extra && !(!left && more?.(key)) ? `<button class="more pj-step" type="button" data-step="${esc(key)}"${left ? '' : ' data-open'}>${left ? `展开（还有 ${num(left)} 条）` : '收起'} <span class="more__chev">›</span></button>` : '';
      return { key: `group:${key}`, cls: 'pj-list-group', html: `${key ? `<p class="part">${U.fieldHtml(STATE[key] || key)}</p>` : ''}${list(items.slice(0, preview + open))}${step}` };
    });
  }
  // 点了分组底下那颗“展开（还有 N 条）／收起”：只重画这一块，不重摆两栏（免得卡片在眼前换栏）
  function stepGroup(b, key, close) {
    b.reveal ??= new Map();
    b.reveal.set(key, close ? 0 : (b.reveal.get(key) || 0) + (b.step || BATCH.rows));
    drawGroups(b);
  }
  function drawGroups(b) {
    if (!b.groupSrc?.length) return;
    U.list(b.main, groupedRows(b.groupSrc, b.groupPreview, b.reveal, b.groupMore), { animate: false });
    syncPage(b);
  }
  // 最近改动、最近产物：已读到的露完了，才出“更早的改动／再看”接着读
  function syncPage(b) {
    if (!b.changes && !b.artifacts) return;
    const left = Math.max(0, (b.groupSrc?.length || 0) - (b.groupPreview || 0) - (b.reveal?.get('') || 0));
    b.page.hidden = !b.hasNext || left > 0;
    if (b.changes) changeCounts(b);
  }
  // 卡里收着的读数（数字格、两列小表）：同样一批一批露
  function drawRest(b, animate) {
    const all = b.restRows || [], unread = b.unread || [], open = (b.restShown || 0) > 0, n = Math.min(all.length, b.restShown || 0), left = all.length - n;
    U.list(b.rest, [...all.slice(0, n), ...(open && !left ? unread : [])], { animate });
    b.box.classList.toggle('is-open', open); b.box.inert = !open; b.box.setAttribute('aria-hidden', String(!open));
    b.more.setAttribute('aria-expanded', String(open && !left));
    const closed = [left && `展开（还有 ${num(left)} 条）`, !left && !open && !U.offline?.() && unread.length && U.collectionText('其余项目')].filter(Boolean).join(' · ');
    U.html(b.more, `${closed || '收起'} <span class="more__chev">›</span>`);
  }
  const blocks = new Map();
  function block(key, kind) {
    let b = blocks.get(key);
    if (b && b.kind === kind) return b;
    b?.el.remove();
    const el = document.createElement('div');
    el.className = `pj-sec pj-sec--${kind}`;
    el.id = key;
    // 头一行段名和一句话；reading 是逐项清单那类读数的一句读数；最后是收起来的“说明”和整张卡都一样的截止时刻
    el.innerHTML = `<p class="pj-part" data-p="head"></p><p class="pj-reading" data-p="reading" hidden></p><p class="pj-note" data-p="cutoff" hidden></p>
      <ul class="${LIST[kind]}" data-p="main"></ul>
      <div class="fold" data-p="box"><div><ul class="${LIST[kind]}" data-p="rest"></ul></div></div>
      <div class="pj-foot" data-p="foot" hidden><button class="more" type="button" data-p="more" hidden></button><a class="more more--link" data-p="link" hidden></a></div>
      <p class="pj-note" data-p="note" hidden></p>
      <p class="pj-hidden" data-p="hidden" hidden></p>
      <button class="more" type="button" data-needs-pc data-p="page" hidden>再看 ›</button>
      <div class="pj-tail"><details class="pj-notes"><summary class="live-disclosure"><span class="disclosure-closed">说明</span><span class="disclosure-open">收起说明</span><span class="disclosure-chev">›</span></summary><p class="pj-note" data-p="explain" hidden></p></details><span class="pj-cut" data-p="cut" hidden></span></div>`;
    b = { key, kind, el, ...Object.fromEntries([...el.querySelectorAll('[data-p]')].map((n) => [n.dataset.p, n])) };
    b.box.inert = true; b.box.setAttribute('aria-hidden', 'true');
    b.more.setAttribute('aria-expanded', 'false');
    b.more.addEventListener('click', () => {
      const all = b.restRows?.length || 0, shown = Math.min(all, b.restShown || 0);
      b.restShown = shown < all ? shown + (BATCH[b.kind] || BATCH.rows) : !all && !b.restShown ? 1 : 0;
      drawRest(b, true);
    });
    b.page.addEventListener('click', () => b.changes ? loadChanges(b) : loadArtifacts(b));
    blocks.set(key, b);
    return b;
  }
  function drawRecordCutoff(b) {
    const cutoff = staleText({ q: 'stale', note: b.metric?.note, about: b.metric?.about }, b.recordStaleAt), text = cutoff === staleText(proj, at) || cutoff === staleText(b.metric, b.metric?.at) ? '' : cutoff;
    b.cutoff.hidden = !text; U.html(b.cutoff, esc(text));
  }
  // 清单式读数只提供直达逐项明细，正文统一在明细页读取。
  function arrayBlock(m) {
    const b = block(`records-${m.section || m.id}`, 'rows');
    b.el.classList.add('pj-sec--array'); b.array = true; b.metric = m;
    // 签已挂在类名后（ownerTag），收起的“说明”里不再挂第二个
    const href = m.section ? records(m.section) : '', { line, extra } = lineOf({ ...m, moment_shared: true, visitor_labels: null });
    const name = U.fieldHtml(m.label, { name: '逐项明细名称', place: 'label', kind: projectViewer });
    const count = m.count == null ? '' : `${lower(m, 'count') ? '至少 ' : ''}${num(m.count)} 条`;
    const at = m.at && stamp(m.at, m.at_precision);
    // 时刻是“这件事最后一次发生”的（11-15 真机验收、最后整理于 11-21……）写那一句，不写“截至”
    // 同一张卡的卡底已经是这一句时，卡里这一行不再重复（cardTail 里收起）
    const meta = [count, !m.moment && at && `截至 ${at}`].filter(Boolean).join(' · '); b.moment = m.moment || '';
    const linkLabel = U.fieldText(m.label, projectViewer) + '明细';
    // 说明书各类（资料速查 group-4 除外）：后台给访客的明细只有一句“这里是 N 条……所以不予展示”（两条以内的只给每条标题，cockpit_projects 里 group 那段）。
    // 本人版在类名后挂“访客看不到”；访客版在卡上照定稿卡第 3 种写法写清几条、哪一类。后台在这一项上标了 visitor_labels 的照后台。
    const knowledgeHidden = id === 'daily-preferences' && /^group-[0-5]$/.test(m.section || '') && m.section !== 'group-4';
    const ownerTag = projectViewer !== 'owner' ? '' : U.visitorLabel(m, ['$', 'label'], '这一类', projectViewer)
      || (knowledgeHidden ? U.visitorHiddenTag(`这一类的认识原文，只看到${m.count > 2 ? '一句说明' : '每条的标题'}`, '', projectViewer) : '');
    U.html(b.head, `<b>${name}${ownerTag ? ` ${ownerTag}` : ''}</b>${meta || b.moment ? `<span class="pj-record-meta">${esc(meta)}${b.moment ? `<span class="pj-record-moment">${meta ? ' · ' : ''}${esc(b.moment)}</span>` : ''}</span>` : ''}${href ? `<a class="more pj-record-link" href="${esc(href)}" aria-label="${esc(linkLabel)}">明细 <span class="more__chev">›</span></a>` : ''}`);
    const hidden = m.value?.hidden_block || m.hidden_block || (isPrivate(m) ? m.value?.hidden_what || m.hidden_what : '');
    const knowledgeLine = projectViewer === 'public' && knowledgeHidden && !hidden
      ? esc(`这里是${m.count == null ? '' : ` ${num(m.count)} 条`}关于${U.fieldText(m.label, projectViewer)}的认识，本人版能看到全部，所以不予展示`) : '';
    const notice = knowledgeLine || (projectViewer !== 'public' || !hidden ? '' : U.visibilityNote({ visibility: 'owner', hidden_block: hidden }, 'public', U.fieldText(m.label)));
    b.reading.hidden = !notice;
    U.html(b.reading, notice);
    b.main.hidden = b.foot.hidden = b.more.hidden = b.link.hidden = b.note.hidden = b.cut.hidden = true;
    const about = [line && subText(line), ...extra].filter(Boolean).join('<br>');
    b.explain.hidden = !about; U.html(b.explain, about);
    return b;
  }
  function fill(b, { label, about, rows, unread = [], total, link, note, explain = [], hidden, hiddenText, hiddenWhat, empty, headOnly = false, limit, moment = '' }, animate) {
    if (b.main) b.main.hidden = headOnly;
    b.headOnly = headOnly;
    b.head.hidden = !label && !about;
    U.html(b.head, `${label ? `<b>${U.fieldHtml(label, { name: '项目资料', place: 'label' })}</b>` : ''}${about ? `<span>${U.fieldHtml(about)}</span>` : ''}`);
    const rowCount = rows.length;
    if (b.kind === 'rows') {
      b.groupSrc = rows; b.groupPreview = b.changes ? b.preview : b.artifacts && id === 'work-delivery-copilot' ? 6 : SHOW.rows;
      b.groupMore = (b.changes || b.artifacts) ? () => !!b.hasNext : null; b.reveal ??= new Map();
      if (rows.length) rows = groupedRows(rows, b.groupPreview, b.reveal, b.groupMore);
    }
    const show = limit ?? (b.kind === 'rows' ? rows.length : b.kind === 'figs' && rows.length - SHOW.figs <= 2 ? rows.length : SHOW[b.kind]);
    const shown = rows.length ? rows.slice(0, show) : unread.length || (hidden && !hiddenText) ? [] : [{ key: 'none', cls: b.kind === 'rows' ? 'row row--flat row--empty' : 'pj-empty', html: `${b.kind === 'rows' ? '<span></span>' : ''}<p class="row__sub">${U.fieldHtml(metricText(U.offline?.() && /还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|正在读/.test(empty || '') ? '这块没存下来，连上后补上。' : hiddenText || empty))}</p>` }];
    if (b.artifacts && rows.length) clearArtifactEmpty(b);
    U.list(b.main, shown, { animate });
    b.restRows = rows.slice(show); b.unread = unread;
    drawRest(b, animate);
    const rest = Math.max(0, rows.length - show);
    b.more.hidden = !rest && !unread.length;
    b.link.hidden = !link;
    if (link) { b.link.href = link.href; U.html(b.link, `${esc(link.text)} <span class="more__chev">›</span>`); }
    b.foot.hidden = !rest && !unread.length && !link;
    // 接口说一共 N 项、这里只给了一部分：写清楚，不装成全部
    const notes = [total != null && total > rowCount && `一共 ${num(total)} 项，这里是最近的 ${rowCount} 项`, note && metricText(note)].filter(Boolean);
    b.note.hidden = !notes.length;
    U.html(b.note, notes.map(esc).join('<br>'));
    const hiddenLine = hiddenText ? (rows.length ? metricText(hiddenText) : '') : hidden ? projectViewer === 'public' ? U.hiddenMore?.(hidden, '个', hiddenWhat || (b.artifacts ? '产物文件' : '条目')) || '' : `另有 ${num(hidden)} 个仅你可见` : '';
    b.hidden.hidden = !hiddenLine;
    U.html(b.hidden, U.fieldHtml(hiddenLine, { name: '项目内容', kind: projectViewer }));
    // 收起来的说明：这一段的口径＋各项除一句解释以外的小字；所有项都一样的截止时刻露在卡底
    const told = explainLines(rows, explain);
    if (b.explain) { b.explain.hidden = !told.lines.length; U.html(b.explain, told.lines.join('<br>')); }
    const cut = [told.cut, moment && U.fieldHtml(moment, { name: '读数说明', kind: projectViewer })].filter(Boolean).join(' · ');
    if (b.cut) { b.cut.hidden = !cut; U.html(b.cut, cut); }
    // 卡右上角“看全部 ›”用：去逐项明细的路，或者原地展开剩下的
    b.allHref = link?.href || ''; b.allFold = rest > 0 || unread.length > 0;
  }
  function clearArtifactEmpty(b) { for (const host of [b.main, b.rest]) host.querySelectorAll('.row--empty').forEach(row => row.remove()); }
  // 同一段里重复的小字只写一次；各项自己的小字前面带上它的名字
  function explainLines(rows, explain = []) {
    const per = rows.map(r => [...new Set(r.extra || [])]), seen = new Map();
    for (const list of per) for (const x of list) seen.set(x, (seen.get(x) || 0) + 1);
    const withExtra = per.filter(list => list.length).length, time = x => /^(?:数据截止 |.*取的$)/.test(String(x).replace(/<[^>]+>/g, ''));
    const cut = withExtra ? [...seen].find(([x, n]) => time(x) && n === withExtra)?.[0] || '' : '';
    const common = [...seen].filter(([x, n]) => n > 1 && x !== cut).map(([x]) => x);
    const own = rows.flatMap((r, i) => per[i].filter(x => seen.get(x) === 1 && x !== cut).map(x => `${r.labelText && rows.length > 1 ? `${esc(r.labelText)}：` : ''}${x}`));
    return { lines: [...new Set([...explain.filter(Boolean), ...common, ...own])], cut };
  }
  // 按给的顺序：卡片和块的摆放在下面“摆卡片”那一节
  // —— 下面两栏 ——
  const isMore = (s) => s.id === 'more-data' || s.label === '更多数据';
  let proj = null, at = null, arts = null, artsState = null, projectViewer = 'public';
  let changeLog, changeHead, changeView, changeRead = 0, changeEpoch = 0, changeRefill = 0;
  let activity, activityWatch, activityScope, audience = 0, changeIssue = '', correctionsWatch;
  const additions = {};
  const additionWatches = [];
  function readSoftware(save, watch) {
    return watch('projects/pcconfig/records', { section: 'software_versions' }, {
      data(d, meta) { if (!sameViewer(meta)) return;
        delete additions.softwareRead;
        blocks.get('software-versions')?.softwareRead?.done(false);
        save('software', d);
      },
      link(state) {
        if (!sameViewer(state.meta) || Array.isArray(state.data?.items) || !(['none', 'gone'].includes(state.phase) || state.meta?.status >= 400)) return;
        const old = additions.softwareRead;
        if (old && old.offline === state.offline && old.meta?.status === state.meta?.status) return;
        save('softwareRead', { ...state, phase: 'none' });
      },
    });
  }
  function softwareUnavailable(state) {
    const b = graphBlock('software-versions', '');
    b.group = b.key;
    if (!b.softwareRead || b.softwareRead.phase === 'ready') U.html(b.viz, '');
    b.softwareRead ??= U.reading(b.viz, { name: '日用工具现在在用哪一版', ghost: '' });
    b.softwareRead.set(state);
    return b;
  }
  function readAdditions(reads, watch) {
    if (additionWatches.length) return;
    const viewerEpoch = audience;
    const save = (key, data) => {
      if (viewerEpoch !== audience) return;
      additions[key] = data;
      if (proj && !first) renderBoard(false);
    };
    if (id === 'agents') reads.push(fetch('/live/project/weekly-new.json', { signal: AbortSignal.timeout(15000) }).then(r => r.ok ? r.json() : null).then(d => save('weekly', d)).catch(() => {}));
    additionWatches.push(watch('computer', null, { data(d, meta) { if (!sameViewer(meta)) return; if (id === 'wly0829.cn') save('external', d?.external); save('batches', d?.batch_progress); } }));
    if (id === 'pcconfig') additionWatches.push(readSoftware(save, watch));
  }
  const sameViewer = meta => (meta?.viewer?.kind || 'public') === projectViewer;
  const getChanges = cursor => window.Live.get('projects/changes', { project: id, cursor }).catch(() => null);
  const changeSource = page => page.source_at || page.at;
  function projectChanges(data) {
    if (!Array.isArray(data?.items)) return null;
    const names = new Set([id, U.fieldText(proj?.name, projectViewer)]);
    const items = data.items.filter(it => it && (!it.project || names.has(U.fieldText(it.project, projectViewer))));
    return items.length === data.items.length ? data : { items };
  }
  function uniqueChanges(rows) {
    const seen = new Set();
    return rows.filter(it => {
      if (!it.id) return true;
      if (seen.has(it.id)) return false;
      seen.add(it.id);
      return true;
    });
  }
  function changePacket(result) {
    const page = sameViewer(result?.meta) ? projectChanges(result?.data) : null;
    return page && { ...page, at: page.at || result.meta?.at };
  }
  function extendChanges(log, page) {
    if (!page?.items.length || !changeSource(log) || changeSource(log) !== changeSource(page) || page.next === log.next) return null;
    if (Number.isFinite(log.total) && Number.isFinite(page.total) && log.total !== page.total) return null;
    const items = uniqueChanges([...log.items, ...page.items]);
    if (items.length !== log.items.length + page.items.length) return null;
    return { ...log, items, next: page.next, total: page.total ?? log.total };
  }
  function publishChanges(issue = '') {
    changeIssue = issue;
    const cutoff = (changeIssue || isStale(changeLog) || U.offline?.()) && (changeLog?.source_at || changeLog?.at);
    const view = JSON.stringify([changeLog?.items, changeLog?.total, changeLog?.shown, changeLog?.next, changeIssue, cutoff]);
    if (view !== changeView) { changeView = view; if (!first) U.anchor(() => renderBoard(true)); }
  }
  // 没读到时写从几点起读不到（这一页先读到过才有，M982）；手上那份截至几点另由“上次改动记录截至”那句写
  const unreadText = (result, what = '改动记录') => result?.failingSince ? `${what}自 ${stamp(result.failingSince)} 起暂时读不到。` : `${what}暂时读不到。`;
  async function readChanges() {
    const read = ++changeRead;
    const result = await getChanges();
    if (read !== changeRead) return;
    // 没读到：本页主数据确认接通后自己再读一次，不等项目数据换代（M982）
    result?.again?.then(() => { if (read === changeRead) readChanges(); });
    const first = changePacket(result), hint = first?.gap || first?.stale_text || first?.note || first?.text;
    const missing = result?.meta?.status >= 400 || !first || !first.items.length && (['unknown', 'missing', 'partial', 'stale'].includes(first.q) || /没读到|未读到|读不到|缺测|没有读到|读取失败|暂不可用|上次记录|最近一次记录/.test(U.fieldText(hint, projectViewer)));
    if (missing && (changeLog || !first?.items.length)) { changeRefill = 0; publishChanges(hint || unreadText(result)); return; }
    const head = JSON.stringify([changeSource(first), first.items, first.total, first.next]);
    if (head === changeHead) {
      changeRefill = 0;
      changeLog = { ...first, items: changeLog.items, next: changeLog.next };
    } else {
      // 位置游标只在同一份名单里有效，重读达到原范围后一次换掉整份。
      let replacement = { ...first, items: uniqueChanges(first.items) };
      const loaded = changeLog?.items.length ?? 0;
      changeEpoch++;
      changeRefill = read;
      try {
        while (replacement.next && replacement.items.length < loaded) {
          const next = await getChanges(replacement.next);
          if (read !== changeRead) return;
          replacement = next?.meta?.status < 400 && extendChanges(replacement, changePacket(next));
          if (!replacement) { publishChanges('改动记录暂时没能更新，仍显示上次已读的记录。'); return; }
        }
        changeLog = replacement; changeHead = head;
      } finally { if (changeRefill === read) changeRefill = 0; }
    }
    publishChanges(missing ? hint || unreadText(result) : '');
  }
  function readSide(d, reads, watch) {
    if (id === 'agents' && !correctionsWatch) correctionsWatch = watch('chats', null, { data(d, meta) {
      if (sameViewer(meta) && d?.stats?.owner_corrections) { additions.corrections = d.stats.owner_corrections; if (!first) renderBoard(false); }
    } });
    reads.push(readChanges());
    const scope = d.phase === 'archived' || d.state === 'frozen' ? 'frozen' : 'active';
    if (activityWatch && activityScope === scope) return;
    activityWatch?.stop();
    activityScope = scope;
    const query = { state: scope };
    const show = (data, meta) => {
      if (!sameViewer(meta)) return;
      const a = data?.activity, row = a?.items?.find(x => x.id === id);
      const next = Array.isArray(a?.days) && Array.isArray(row?.commits)
        ? { days: a.days, commits: row.commits, q: row.q, partial: row.partial } : null;
      if (!next && activity || JSON.stringify(activity) === JSON.stringify(next)) return;
      activity = next; if (!first) renderStrip(proj);
    };
    // 订阅接收重读结果，get 仍复用首个请求并处理这次读不到的状态。
    const subscription = activityWatch = window.Live.watch('projects', query, { data: show });
    reads.push(window.Live.get('projects', query).then(({ data, meta }) => {
      if (activityWatch === subscription) show(data, meta);
    }));
  }
  function changeRow(it, index) {
    const protectedRow = restricted(it), locked = protectedRow || restricted(it.text), field = protectedRow ? it : it.text ?? it;
    const note = field === it ? '' : marker(it, projectViewer, it.hidden_what || '改动说明');
    const title = U.fieldHtml(field, { name: '改动说明', kind: projectViewer });
    const count = Number.isFinite(it.count) && (it.count > 1 || locked) ? `<span class="row__meta">${esc(num(it.count))} 次提交</span>` : '';
    return { key: it.id || `change-${index}`, cls: 'row row--flat pj-item', html: `<span></span><div class="row__text"><p class="row__main"><span class="pj-tl-at">${esc(stamp(it.at))}</span><span class="pj-tl-copy"><span class="row__title">${title}</span>${count}${note ? ` ${note}` : ''}</span></p></div><span></span>` };
  }
  async function loadChanges(b) {
    const cursor = changeLog?.next, epoch = changeEpoch, label = b.page.innerHTML;
    if (!cursor || changeRefill) return;
    b.page.disabled = true; U.html(b.page, '正在读…', false);
    try {
      const result = await getChanges(cursor);
      if (epoch !== changeEpoch || cursor !== changeLog?.next) return;
      const page = result?.meta?.status < 400 && changePacket(result);
      if (!page?.items.length) {
        publishChanges('下一页暂时读不到，已读到的留在这里。');
        // 本页主数据确认接通后用同一个翻页位置自己再取一次（M982）
        result?.again?.then(() => { if (epoch === changeEpoch && cursor === changeLog?.next && !changeRefill) loadChanges(b); });
        return;
      }
      const extended = extendChanges(changeLog, page);
      if (!extended) { await readChanges(); return; }
      // 接着读到的一页：露出新来的头一批（这颗按钮只在已读到的都露完时才出）
      b.reveal ??= new Map(); b.reveal.set('', Math.max(0, changeLog.items.length - (b.groupPreview || 0)) + (b.step || BATCH.rows));
      changeLog = extended; publishChanges();
    } finally { b.page.disabled = false; U.html(b.page, label, false); }
  }
  function changeCounts(b) {
    const { loaded, preview } = b, total = changeLog?.total;
    const shown = Math.min(loaded, preview + (b.reveal?.get('') || 0));
    const count = loaded ? [Number.isFinite(total) && `共 ${num(total)} 条`, `当前显示 ${num(shown)} 条`, `已载入 ${num(loaded)} 条`].filter(Boolean).join('，') : '';
    // 还能展开几条由卡底“展开（还有 N 条）”说，这里不重复，只写还没取来的
    const available = Number.isFinite(total) && total > loaded ? `另有 ${num(total - loaded)} 条待取` : '';
    const status = changeIssue || (!changeLog && '正在读改动记录…');
    const cutoff = (isStale(changeLog) || changeIssue || U.offline?.()) && (changeLog?.source_at || changeLog?.at);
    b.note.hidden = !count && !status && !cutoff;
    U.html(b.note, [esc(count), esc(available), cutoff && esc(`上次改动记录截至 ${stamp(cutoff)}`), status && U.fieldHtml(status, { name: '改动记录', kind: projectViewer })].filter(Boolean).join('<br>'));
  }
  async function loadArtifacts(b) {
    const generation = audience, cursor = arts?.next, label = b.page.innerHTML;
    if (!cursor) return;
    b.page.disabled = true; U.html(b.page, '正在读…', false);
    try {
      const result = await window.Live.get(`projects/${enc(id)}/artifacts${params.has('fixture') ? `-${enc(cursor)}` : ''}`, { cursor });
      if (generation !== audience || !sameViewer(result.meta) || cursor !== arts?.next) return;
      // 接着读到的一页：露出新来的头一批（这颗按钮只在已读到的都露完时才出）
      if (result.data) { const before = arts.items.length; arts = { ...result.data, items: [...arts.items, ...(result.data.items || [])] }; if (!artifactVersion) { b.reveal ??= new Map(); b.reveal.set('', Math.max(0, before - (b.groupPreview || 0)) + (b.step || BATCH.rows)); } renderBoard(true); }
      else {
        b.note.hidden = false; U.html(b.note, U.fieldHtml([403, 404].includes(result.meta?.status) ? missingText(result) : "下一页暂时读不到，已读到的留在这里。", { name: '项目内容', kind: projectViewer }));
        // 同改动记录的下一页：本页主数据确认接通后用同一个翻页位置自己再取一次（M982）
        result.again?.then(() => { if (generation === audience && cursor === arts?.next) loadArtifacts(b); });
      }
    } finally { b.page.disabled = false; U.html(b.page, label, false); }
  }
  // 从规则页按版本跳进来（?artifact=E…）：这一版不在已读到的几页里，就接着往后读，读到这一版或读完为止（R55）
  const versionHit = it => it.kind === 'rules' && typeof it.title === 'string' && /^(E\d+)\s*｜/.exec(it.title)?.[1] === artifactVersion;
  async function readVersion(b) {
    if (b.versionRead) return;
    b.versionRead = true;
    try {
      while (artifactVersion && arts?.next && !arts.items?.some(versionHit)) {
        const cursor = arts.next;
        await loadArtifacts(b);
        if (arts?.next === cursor) { b.versionFailed = true; renderBoard(false); break; }
      }
    } finally { b.versionRead = false; }
  }
  function graphBlock(key, label) {
    const b = block(key, 'figs'); b.el.classList.add('pj-sec--chart');
    U.html(b.head, `<b>${esc(label)}</b>`); b.main.hidden = true;
    if (!b.viz) { b.viz = document.createElement('div'); b.viz.className = 'pj-viz'; b.cutoff.after(b.viz); }
    drawRecordCutoff(b); return b;
  }
  // 热门页榜：先读第一页、先露 5 行，往下一批一批露，露完了再读下一页（R147）；每天的柱子图仍读全再画
  const PAGE_NAMES = { '/': '首页', '/live/': '实况', '/skills/': '技能', '/projects/': '项目', '/rules/': '规则' };
  function pageRankRow(r) {
    const V = window.LiveProjectViz, partial = V.lower(r, 'opens');
    return { key: r.page, name: r.title || r.name || PAGE_NAMES[r.page] || r.page, value: r.opens, text: r.opens == null ? U.collectionText('打开次数', r) : partial ? `至少 ${r.opens} 次` : undefined, sub: partial ? V.gap(r) : r.note, hue: 'blue' };
  }
  async function loadGraph(b, m) {
    b.metric = m;
    const paged = m.id === 'top_pages' && window.ProjectSiteReadings?.pagedRank;
    const read = cursor => window.Live.get(`projects/${enc(id)}/records${params.has('fixture') ? `-${enc(m.section)}` : ''}`, { section: m.section, cursor });
    let rows = [], cursor = null, result, staleAt = null;
    do {
      result = await read(cursor);
      if (!result.data || !Array.isArray(result.data.items)) { b.chartLoaded = false; b.viz.innerHTML = `<p class="pj-note">${U.fieldHtml(missingText(result, m.id === 'top_pages' ? '打开记录' : m.label || '这块'), { name: '项目内容', kind: projectViewer })}</p>`; balance(); return; }
      if (isStale(result.data)) staleAt ||= result.data.at || result.meta.at;
      rows.push(...(result.data.items || [])); cursor = result.data.next;
    } while (cursor && !paged);
    b.recordStaleAt = staleAt; drawRecordCutoff(b);
    const after = next => next ? async () => { const page = await read(next); return page.data && Array.isArray(page.data.items) && sameViewer(page.meta) ? { rows: page.data.items.map(pageRankRow), load: after(page.data.next) } : null; } : null;
    if (paged) window.ProjectSiteReadings.pagedRank(b.viz, { rows: rows.map(pageRankRow), total: result.data.total, load: after(cursor), rank: { unit: '次', empty: '这段时间没有打开记录' } });
    else window.LiveProjectViz.chart(b.viz, m.id, rows);
    const { line, extra } = lineOf(m);
    b.note.hidden = !line; U.html(b.note, line ? subText(line) : '');
    b.explain.hidden = !extra.length; U.html(b.explain, extra.join('<br>'));
    balance();
  }
  // —— 摆卡片 ——
  // 同一个 group 的块合进一张卡；左边（项目自己的段）、右边（最近产物、技能使用等）交替排先后，“更多数据”和安静的小字排最后；
  // 再按卡的实际高度，一张一张放进更矮的那一栏（layout.js 的 split）。旧摆法还够齐就不挪，免得刷新时卡片换栏。
  const cards = new Map();
  let laidOut = [];
  function cardOf(key) {
    let c = cards.get(key);
    if (c) return c;
    const el = document.createElement('section');
    el.className = 'pj-card glass';
    el.dataset.card = key;
    const link = document.createElement('a'), btn = document.createElement('button');
    link.className = 'pj-all'; link.hidden = true;
    btn.className = 'pj-all'; btn.type = 'button'; btn.hidden = true; btn.setAttribute('aria-expanded', 'false');
    el.append(link, btn);
    c = { key, el, link, btn, col: null, toggle: null };
    btn.addEventListener('click', () => c.toggle?.());
    cards.set(key, c);
    return c;
  }
  // 卡右上角“看全部 ›”：先看卡里第一块（不算逐项清单那几行）——有逐项明细去明细，有收着的原地展开；
  // 整张卡只有一行逐项清单时去那一行的明细
  const synced = new WeakSet();
  function setAll(c, list) {
    const content = list.filter(b => !b.headOnly && !b.quiet), rows = content.filter(b => !b.array);
    let pick = null;
    // 右上角“看全部 ›”只用来去逐项明细；原地展开的改成卡里一批一批露（R147），右上角不再一下全摊开
    for (const b of rows) {
      if (b.allHref) { pick = { href: b.allHref, b }; break; }
      if (b.allFold && !b.more.hidden || b.main?.querySelector?.('.pj-step, details') || b.allDetails?.isConnected) break;
    }
    if (!pick && !rows.length && content.length === 1 && content[0].allHref) pick = { href: content[0].allHref, b: content[0] };
    // 右上角接管了的那个“展开”不再在卡底重复露一次
    c.el.querySelectorAll('.pj-led').forEach(n => n.classList.remove('pj-led'));
    c.link.hidden = !pick?.href; c.btn.hidden = !(pick?.fold || pick?.details); c.toggle = null;
    if (pick?.href) {
      c.link.href = pick.href; U.html(c.link, '看全部 <span class="more__chev">›</span>');
      if (pick.b.link.getAttribute('href') === pick.href) { pick.b.link.hidden = true; pick.b.foot.hidden = pick.b.more.hidden; }
      return;
    }
    const target = pick?.fold || pick?.details;
    if (!target) return;
    target.classList.add('pj-led');
    const open = () => pick.fold ? pick.fold.getAttribute('aria-expanded') === 'true' : pick.details.open;
    const sync = () => { c.btn.setAttribute('aria-expanded', String(open())); U.html(c.btn, `${open() ? '收起' : '看全部'} <span class="more__chev">›</span>`); if (pick.b.changes) changeCounts(pick.b); };
    c.toggle = () => { if (pick.fold) pick.fold.click(); else pick.details.open = !pick.details.open; sync(); };
    if (!synced.has(target)) { synced.add(target); target.addEventListener(pick.fold ? 'click' : 'toggle', () => requestAnimationFrame(() => cards.forEach(card => card.sync?.()))); }
    c.sync = sync; sync();
  }
  // 一张卡只有一个“说明”：卡里各块收着的说明合在卡底（逐项清单那几行、小标题的前面带上名字）；各块一样的截止时刻只写一次
  function cardTail(c, list) {
    if (!c.tail) {
      c.tail = document.createElement('div'); c.tail.className = 'pj-tail pj-card__tail';
      c.tail.innerHTML = '<details class="pj-notes"><summary class="live-disclosure"><span class="disclosure-closed">说明</span><span class="disclosure-open">收起说明</span><span class="disclosure-chev">›</span></summary><div class="pj-note"></div></details><span class="pj-cut"></span>';
    }
    if (c.el.lastElementChild !== c.tail) c.el.append(c.tail);
    const name = b => b.array ? metricText(b.metric?.label || '') : b === list[0] || b.head?.hidden ? '' : b.head?.querySelector('b')?.textContent || '';
    const cuts = [...new Set(list.map(b => b.cut && !b.cut.hidden ? b.cut.textContent.trim() : '').filter(Boolean))];
    const parts = list.filter(b => b.explain && !b.explain.hidden && b.explain.innerHTML.trim()).map(b => { const n = name(b); return `${n ? `<b>${esc(n)}</b>：` : ''}${b.explain.innerHTML}`; });
    if (cuts.length > 1) parts.push(...cuts.map(esc));
    const box = c.tail.querySelector('.pj-note'), html = parts.join('<br>');
    if (box.innerHTML !== html) box.innerHTML = html;
    c.tail.querySelector('.pj-notes').hidden = !parts.length;
    const cut = c.tail.querySelector('.pj-cut'); cut.hidden = cuts.length !== 1; cut.textContent = cuts.length === 1 ? cuts[0] : '';
    c.tail.hidden = !parts.length && cuts.length !== 1;
    for (const b of list) { const said = b.array && b.moment && b.head?.querySelector('.pj-record-moment'); if (said) said.hidden = cuts.length === 1 && cuts[0] === b.moment; }
  }
  function groupsOf(list) {
    const out = new Map();
    for (const b of list) { const key = b.group || b.key; if (!out.has(key)) out.set(key, { key, blocks: [], quiet: true }); const g = out.get(key); g.blocks.push(b); g.quiet &&= !!b.quiet; }
    return [...out.values()];
  }
  function inOrder(host, els) { els.forEach((el, i) => { if (host.children[i] !== el) host.insertBefore(el, host.children[i] || null); }); }
  function arrange(left, right) {
    const late = g => g.key === 'more-data' || g.quiet, L = groupsOf(left), R = groupsOf(right).filter(g => !L.some(l => l.key === g.key));
    const l = L.filter(g => !late(g)), r = R.filter(g => !late(g)), seq = [];
    for (let i = 0; i < Math.max(l.length, r.length); i++) { if (l[i]) seq.push(l[i]); if (r[i]) seq.push(r[i]); }
    seq.push(...[...L, ...R].filter(late).sort((a, b) => a.quiet - b.quiet));
    for (const g of seq) {
      const c = g.card = cardOf(g.key);
      c.el.classList.toggle('pj-card--quiet', g.quiet); c.el.classList.toggle('glass', !g.quiet);
      g.blocks.forEach((b, i) => { const at = c.el.children[i + 2]; if (at !== b.el) c.el.insertBefore(b.el, at || null); });
      for (const el of [...c.el.querySelectorAll(':scope > .pj-sec')]) if (!g.blocks.some(b => b.el === el)) { el.remove(); if (el.id) blocks.delete(el.id); }
      setAll(c, g.blocks); cardTail(c, g.blocks);
    }
    for (const [key, c] of cards) if (!seq.some(g => g.key === key)) { for (const el of [...c.el.children].slice(2)) if (el.id) blocks.delete(el.id); c.el.remove(); cards.delete(key); }
    const shown = seq.filter(g => !g.quiet).length;
    board.hidden = !seq.length;
    board.classList.toggle('is-single', seq.length < 2);
    document.body.classList.toggle('pj-sparse', !!proj && shown <= 1);
    laidOut = seq;
    // 先放进原来那一栏（新卡放左栏），两栏一样宽，量出来的高度就是摆好以后的高度
    for (const g of seq) { const host = g.card.col === 1 && seq.length > 1 ? side : main; if (g.card.el.parentNode !== host) host.append(g.card.el); }
    balance();
    return seq;
  }
  function balance() {
    const seq = laidOut;
    if (!seq.length) return;
    for (const g of seq) cardTail(g.card, g.blocks);
    if (seq.length < 2) { inOrder(main, seq.map(g => g.card.el)); seq.forEach(g => g.card.col = 0); return; }
    // 摆齐的算法在 layout.js；那个文件没取到时卡片留在原来那一栏，不让整页出错
    const PL = window.ProjectLayout;
    if (!PL) return;
    const gap = parseFloat(getComputedStyle(main).rowGap) || 20, heights = seq.map(g => g.card.el.offsetHeight), prev = seq.map(g => g.card.col);
    // 项目自己定了哪张卡放哪一栏的（说明书照本人定的图：左栏大卡＋最近改动，右栏最近改过的 5 张＋材料和依据），照它摆
    const fixed = custom?.columns?.(seq.map(g => g.key));
    const cols = Array.isArray(fixed) && fixed.length === seq.length ? fixed : prev.every(c => c === 0 || c === 1) && PL.keep(prev, heights, gap) ? prev : PL.split(heights, gap);
    inOrder(main, seq.filter((_, i) => cols[i] === 0).map(g => g.card.el));
    inOrder(side, seq.filter((_, i) => cols[i] === 1).map(g => g.card.el));
    seq.forEach((g, i) => g.card.col = cols[i]);
  }

  // 规则仓“更多数据”里 11-15 那次一次性摸底（fd03_*，“11-15 检查时……”）不会再更新，智能体页都有，不摆
  const surveyRow = m => id === 'agents' && (/^fd03_/.test(m.id) || /^11-15 检查时/.test(String(m.label || '')));
  // 一段一张卡：同一段的数、逐项清单那几行、图都带同一个 group，摆的时候合进一张卡
  function renderBoard(animate) {
    const left = [], right = [], V = window.LiveProjectViz;
    const allMetrics = (proj?.sections || []).flatMap(s => s.metrics || []), skillUsage = id === 'agents' ? V.skillData(allMetrics) : null;
    // 还没有数：页头那一句已经说了（正在读／还没读到／连不上），下面整块先不摆
    if (proj) {
      if (custom?.board) left.push(...custom.board(proj, projectViewer, graphBlock, board));
      for (const card of window.ProjectAdditions?.cards(id, proj, projectViewer, additions, stamp) || []) { const b = graphBlock(card.key, card.title); b.group = card.key; window.ProjectAdditions.render(card, b, U.html, window.LiveViz.bars); left.push(b); }
      if (id === 'pcconfig' && additions.softwareRead) left.push(softwareUnavailable(additions.softwareRead));
      const headId = typeof proj.headline === 'string' ? proj.headline : proj.headline?.id;
      for (const s of proj.sections || []) {
        const into = isMore(s) ? right : left;
        // 规则仓的“后台提醒程序”整块在智能体页的钩子表里，这里只留一行链过去
        if (id === 'agents' && s.id === 'hooks') {
          const b = graphBlock(s.id, ''); b.group = s.id;
          U.html(b.head, '<a class="pj-moved-head" href="/live/agents/#hooks">后台提醒程序跑多久、有没有出错，都在智能体页的钩子表 <span class="more__chev">›</span></a>');
          U.html(b.viz, ''); into.push(b);
          continue;
        }
        const readings = id === 'wly0829.cn' ? window.ProjectSiteReadings : null;
        if (readings && s.id === 'site-visitors') {
          const b = graphBlock(s.id, s.label || '网站有谁来看');
          readings.visitors(b.viz, s, projectViewer, stamp);
          into.push(b);
          continue;
        }
        if (readings && s.id === 'site_update_todo') {
          const b = block(s.id, 'kv'), rows = readings.todoRows(s, kvRow, stamp);
          fill(b, { label: s.label || '下次更新网站要补什么', rows, limit: rows.length, empty: '没有记录' }, animate);
          into.push(b);
          continue;
        }
        const sectionNote = id === 'daily-preferences' && s.id === 'understanding' && typeof s.note === 'string'
          ? s.note.replace('资料速查只给标题，金额、测量值和秘密不进入页面。', '资料速查明细会显示已记录的数值和单位。')
          : s.note;
        const repeatedNote = sectionNote && s.metrics?.some(m => m.note === sectionNote || m.scope === sectionNote) ? sectionNote : '';
        const shared = ['scope', 'note', 'gap'].map(key => { const text = s.metrics?.[0]?.[key]; return typeof text === 'string' && text && s.metrics.every(m => m[key] === text) ? text : ''; });
        const descriptions = [s.about, s.scope || (s.id === 'growth' ? s.metrics?.find(m => m.scope)?.scope : ''), repeatedNote, ...shared].filter(Boolean);
        // 卡头只露一句（这一段回答你什么），段的口径、共同的说明收进卡底“说明”
        const [about = '', ...told] = [...new Set(descriptions.map(metricNote).filter(Boolean))];
        // 后台在这一段的说明上标了 visitor_labels.note 的，说明后面挂现有的小签
        const noteText = sectionNote && metricNote(sectionNote), noteTag = noteText ? U.visitorLabel(s, 'note', '这一段的说明', projectViewer) : '';
        const explain = [...told, !repeatedNote && noteText].filter(Boolean).map(text => U.fieldHtml(text, { name: '这一段的说明', kind: projectViewer }) + (text === noteText ? noteTag : ''));
        // 代表数已经在页头那一条里，卡里不再写一遍
        const duplicate = m => (headId != null && m.id === headId && !!headline(proj)) || (id === 'agents' && s.id === 'skills' && s.metrics.length === 1 && m.value === proj.counts?.skills);
        const intro = readings && s.id === 'scale' ? s.metrics?.find(m => m.id === 'missing_intros') : null;
        const visible = (s.metrics || []).filter(m => m !== intro && m.label && !duplicate(m) && !hideZero(m) && !(skillUsage && V.skills.includes(m.id)) && !surveyRow(m)).map(m => ({ ...m, scope: descriptions.includes(m.scope) ? null : m.scope, note: descriptions.includes(m.note) ? null : m.note, gap: descriptions.includes(m.gap) ? null : m.gap }));
        if (s.metrics?.length && !intro && !visible.length && !s.items && !s.hidden && !s.rule_history && !(s.id === 'skills' && skillUsage)) continue;
        const arrays = visible.filter(m => m.expandable && m.section);
        const metrics = visible.filter(m => !arrays.includes(m) && (!U.offline?.() || hasValue(m)));
        const hasMetrics = metrics.length || !!intro;
        let headed = false;
        if (hasMetrics || (U.offline?.() && s.metrics?.length && !arrays.length && !s.items) || (!s.metrics?.length && !s.items && !arrays.length && !s.rule_history && !(s.id === 'skills' && skillUsage))) {
          const kind = isMore(s) ? 'kv' : 'figs';
          const b = block(s.id, kind), missing = !intro && !metrics.some(hasValue) && !s.hidden && !s.hidden_text;
          b.group = s.id; b.quiet = false;
          if (missing) { if (!arrays.length && !s.items) { fill(b, { label: '', rows: [], empty: missingText(null, s.label || '这块') }, animate); b.quiet = true; into.push(b); } } else {
          // 卡里“最后一次发生”那一句有一句占了这张卡一半以上（至少两项），就只在卡底写一次；别的句子和不够一半的跟在各项下面，免得卡底一句被当成整张卡的
          const said = new Map(); for (const m of metrics) if (m.moment) said.set(m.moment, (said.get(m.moment) || 0) + 1);
          const [common = '', times = 0] = [...said].sort((a, b) => b[1] - a[1])[0] || [], moment = times > 1 && times * 2 > metrics.length ? common : '';
          const rows = metrics.map(m => moment && m.moment === moment ? { ...m, moment_shared: true } : m).map(kind === 'kv' ? kvRow : figRow);
          if (intro) rows.splice(Math.min(rows.length, SHOW.figs - 1), 0, readings.introRow(intro, metricHref(intro)));
          fill(b, { label: s.label || '', about, explain, rows, note: '', hidden: s.items ? 0 : s.hidden, hiddenWhat: s.hidden_what, hiddenText: s.items ? '' : s.hidden_text, empty: s.text || U.collectionText(), moment }, animate);
          into.push(b); headed = true; }
        }
        // 这一段只有逐项清单或图：卡头单独一块，写段名和那一句
        if (!headed && s.label && !s.items && (arrays.length || s.rule_history)) {
          const b = block(s.id, 'figs'); b.group = s.id; b.quiet = false;
          fill(b, { label: s.label, about, explain, rows: [], empty: '', headOnly: true }, animate);
          into.push(b);
        }
        for (const metric of arrays) {
          const m = { ...metric, section: recordSection(metric.section) };
          if (m.section && id === 'wly0829.cn' && ['daily', 'top_pages'].includes(m.id)) {
            const b = graphBlock(m.id, m.label); b.group = m.id === 'top_pages' ? m.id : s.id; (m.id === 'top_pages' ? right : into).push(b);
            U.html(b.head, `<b>${esc(m.label)}${window.ProjectAdditions?.metricCadence(m, id) || ''}</b>`);
            if (!b.chartLoaded || b.chartAt !== m.at) { b.chartLoaded = true; b.chartAt = m.at; loadGraph(b, m); }
          } else { const b = arrayBlock(m); b.group = s.id; into.push(b); }
        }
        // 规则版本自己一张卡：卡头一句“从几时开始记”，下面版本时间线和近两周的小柱子
        if (s.rule_history) {
          const r = s.rule_history, gap = ruleHistoryGap(r), b = graphBlock('rule-history', '规则版本'); b.group = 'rule-history';
          U.html(b.head, `<b>规则版本</b>${gap ? `<span>${U.fieldHtml(gap, { name: '规则历史', kind: projectViewer })}</span>` : ''}`);
          ruleHistory(b.viz, r); b.allDetails = b.viz.querySelector('.pj-rh-events'); into.unshift(b);
        }
        if (s.items) {
          // 逐项清单：前几行在这里，全部的逐项明细在第三层（卡右上角“看全部 ›”）
          const b = block(hasMetrics ? `${s.id}-items` : s.id, 'rows'); b.group = s.id;
          fill(b, { label: hasMetrics ? '' : s.label || '', about: hasMetrics ? '' : about, explain: hasMetrics ? [] : explain, rows: U.mergePrivateRows(U.order(s.items.filter(it => it.title || it.name || it.label || it.text), attention, `project:${b.key}`, recordKey), { value: it => it.title || it.name || it.label || it.text || it, kind: projectViewer }).map(itemRow), total: s.total, link: { href: records(s.id), text: '逐项明细' }, note: '', hidden: s.hidden, hiddenWhat: s.hidden_what, hiddenText: s.hidden_text, empty: s.text || '没有条目' }, animate);
          into.push(b);
        }
      }
      const artifactsTarget = location.hash === '#artifacts';
      // 电脑心电图把“最近产物”并进了自己的看板清单（timeaudit.js，那张卡的 id 就叫 artifacts），这里不再画通用的那张
      if (!custom?.noArtifacts && (artifactsTarget || proj.artifacts?.count || (proj.artifacts?.count === 0 && lower(proj.artifacts, 'count')) || (projectViewer === 'public' && (proj.artifacts?.hidden || arts?.hidden)))) {
        const b = block('artifacts', 'rows');
        b.el.classList.add('pj-sec--flat'); b.artifacts = true; b.group = 'artifacts';
        // 产物一行高（标题、说明、打开按钮），一批 5 行；已读到的露完了才出“再看”接着读
        b.step = 5; b.hasNext = !artifactVersion && !!arts?.next;
        const missingArts = !Array.isArray(arts?.items) && !(arts?.hidden || proj.artifacts?.hidden);
        const items = (arts?.items || []).filter(it => !artifactVersion || versionHit(it));
        const versionMore = !!artifactVersion && !items.length && !!arts?.next && !b.versionFailed;
        const sharedAt = items.length > 1 && items[0].at && items.every(it => it.at === items[0].at && it.at_precision === items[0].at_precision);
        const reading = missingArts && proj.artifacts && (!artsState || ['idle', 'wait', 'slow'].includes(artsState.phase));
        const empty = reading ? '正在读最近产物' : versionMore ? '正在往后读这版的改动记录…' : artifactVersion ? '暂时没有读到这版的改动记录' : arts?.hidden || proj.artifacts?.hidden ? '' : missingArts ? missingText(artsState, '最近产物') : '还没有产物';
        const label = artifactVersion ? `${artifactVersion} 规则改动` : missingArts && !artifactsTarget && !U.offline?.() ? '' : '最近产物';
        fill(b, { label, about: sharedAt ? stamp(items[0].at, items[0].at_precision) : '', rows: items.map((it, i) => artifactRow(it, i, sharedAt)), total: artifactVersion ? items.length : arts?.total, note: arts?.text, hidden: !artifactVersion && projectViewer === 'public' ? arts?.hidden || proj.artifacts?.hidden : 0, hiddenWhat: arts?.hidden_what || proj.artifacts?.hidden_what, empty }, animate);
        syncPage(b);
        if (versionMore) readVersion(b);
        U.blockNote(b.el, artsState);
        right.unshift(b);
      }
      const mine = changeLog?.items || [];
      if (mine.length || id === 'agents' && (!changeLog || changeIssue)) {
        const b = block('changes', 'rows'); b.group = 'changes'; b.changes = true; b.el.classList.add('pj-sec--flat', 'pj-sec--timeline');
        // 一批 10 条往下露；已读到的露完了才出“更早的改动”接着读
        b.step = BATCH.rows; b.hasNext = !!changeLog?.next;
        b.loaded = changeLog?.loaded === mine.length ? changeLog.loaded : mine.length;
        const preview = changeLog?.shown;
        b.preview = Math.min(b.loaded, Number.isInteger(preview) && preview >= 0 ? preview : SHOW.rows);
        fill(b, { label: '最近改动', rows: mine.map(changeRow), headOnly: !mine.length, empty: '' }, animate);
        const changed = !mine.length && proj.changed?.at ? proj.changed : null;
        const hasText = changed?.text && !/^这次改动没有说明记录[。]?$/.test(U.fieldText(changed.text, projectViewer));
        b.reading.hidden = !changed;
        U.html(b.reading, changed ? `最近一次提交 ${esc(stamp(changed.at))}${hasText ? ` · ${U.fieldHtml(restricted(changed) ? changed : changed.text, { name: '提交说明', kind: projectViewer })}` : ''}` : '');
        syncPage(b);
        if (b.page.textContent !== '正在读…') U.html(b.page, '更早的改动 <span class="more__chev">›</span>');
        right.push(b);
      }
      // 整段都不对外的
      const hidden = Math.max(0, (proj.hidden || 0) - (proj.sections || []).reduce((n, s) => n + (s.hidden || 0), 0));
      const changeHidden = proj.changes?.hidden || {}, hiddenNotes = [hidden && U.hiddenMore?.(hidden, '个', proj.hidden_what || '条目'), changeHidden.project_repositories && U.hiddenMore?.(changeHidden.project_repositories, '个', '项目'), changeHidden.project_changes && U.hiddenMore?.(changeHidden.project_changes, '条', '项目变化')].filter(Boolean);
      if (projectViewer === 'owner' && hiddenNotes.length) {
        const b = block('pj-hidden', 'figs');
        fill(b, { label: '', rows: [], empty: hiddenNotes.join(' · ') }, animate);
        b.el.classList.add('pj-sec--quiet'); b.group = 'pj-hidden'; b.quiet = true;
        left.push(b);
      }
    }
    arrange(left, right);
    // 首次跳到分段后，晚到的项目数据可能把卡片移到另一栏。
    if (deepLink && deepLink.y === scrollY) {
      const target = document.getElementById(deepLink.id);
      const heading = target?.querySelector('.pj-part') || target;
      const top = heading?.getBoundingClientRect().top;
      if (top < 0 || top > innerHeight - 40) {
        deepLink = null;
        target.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    }
    U.land();
  }

  // 规则版本：逐版时间线（现役的那一颗绿）＋近两周发布、退回的小柱子；完整说明收在“看全部”里
  function ruleHistoryGap(history) {
    const from = history.events_observed_from || history.observed_from;
    return from && history.history_gap ? `${stamp(from)} 开始观察，之前的发布、退回流水不完整` : history.history_gap;
  }
  function ruleHistory(host, history) {
    const signature = JSON.stringify([history, !!U.offline?.(), projectViewer]);
    if (host.dataset.history === signature) return;
    host.dataset.history = signature;
    const left = host.querySelector('.pj-tl')?.scrollLeft;
    const text = v => U.fieldHtml(v, { name: '规则历史', kind: projectViewer });
    const kept = (history.events || []).filter(e => /^E\d+$/.test(e.version));
    const events = kept.map(e => {
      const when = e.at ? `${stamp(e.at)} 生效` : '生效时间暂时读不到';
      return text([e.version, { published: '发布', rolled_back: '退回' }[e.kind], when, e.observed_at && `观察于 ${stamp(e.observed_at)}`, e.created_at && `目录创建于 ${stamp(e.created_at)}`, e.time_gap].filter(Boolean).join(' · ')).replace(/^E\d+(?= · |$)/, ruleLink);
    });
    const historyGap = ruleHistoryGap(history);
    const gaps = [historyGap, ...(history.weekly || []).filter(w => !w.complete).map(w => `${w.week} 这一周未观察完整：已观察到发布 ${w.observed_published ?? '暂时读不到'} 次、退回 ${w.observed_rolled_back ?? '暂时读不到'} 次`)].filter(Boolean);
    const line = ruleTimeline(kept, history.current_version, text);
    const two = window.ProjectLayout?.twoWeeks(history) || [], max = Math.max(1, ...two.flatMap(w => [w.published, w.rolled_back].filter(Number.isFinite)));
    const bar = (w, key, cls) => Number.isFinite(w[key]) ? `<span class="pj-wk__bar ${cls}" style="--h:${(w[key] / max * 100).toFixed(1)}%"><b>${w.partial && w[key] > 0 ? '至少 ' : ''}${w[key]}</b><i></i></span>` : `<span class="pj-wk__bar ${cls}" style="--h:0%"><b>—</b><i></i></span>`;
    const week = w => `<div class="pj-wk__bars">${w.published == null && w.rolled_back == null ? '<span class="pj-wk__nil">无记录</span>' : bar(w, 'published', 'is-pub') + bar(w, 'rolled_back', 'is-back')}</div>`;
    // 近两周合计：两周都读到才写合计；有一周没观察完整写“至少”
    const total = key => { const got = two.map(w => w[key]).filter(Number.isFinite); return got.length ? `${two.some(w => w.partial && w[key] > 0) ? '至少 ' : ''}${got.reduce((a, b) => a + b, 0)} 次` : '没有记录'; };
    // 两周都没有任何记录：不画两个空框
    const chart = !two.some(w => w.published != null || w.rolled_back != null) ? '' : `<div class="pj-wk"><p class="pj-wk__cap"><span class="pj-wk__sum">近两周：发布 ${total('published')}、退回 ${total('rolled_back')}</span><span class="pj-wk__legend"><span><i class="is-pub"></i>发布</span><span><i class="is-back"></i>退回</span></span></p><div class="pj-wk__plot">${two.map(week).join('')}</div><div class="pj-wk__x">${two.map(w => `<span>${text(w.label)}</span>`).join('')}</div></div>`;
    // 逐版记录和更早没记录的缘由收在“逐版记录”里；打开先列 10 条，一次多露 10 条，露到底“收起”（R147）
    U.html(host, `${line || chart ? `<div class="pj-rh pj-rh--narrow">${line}${chart}</div>` : ''}${events.length || gaps.length ? `<details class="pj-rh-events"><summary class="live-disclosure"><span class="disclosure-closed">逐版记录（${events.length} 条）</span><span class="disclosure-open">收起逐版记录</span><span class="disclosure-chev">›</span></summary><div class="pj-rh-list"></div>${gaps.length ? `<p class="pj-note">${gaps.map(text).join(' · ')}</p>` : ''}</details>` : ''}`);
    // 最新的在上，和上面的逐版时间线、“最近改动”一样新的在前；先露最近 10 个版本，再往更早的露（主持 11-26 10:3x 定）
    host._ruleEvents = [...events].reverse();
    const opened = host.querySelector('.pj-rh-events');
    if (opened && !opened._stepBound) { opened._stepBound = true; opened.addEventListener('toggle', () => { if (!opened.open) { host._ruleShown = 0; drawRuleEvents(host); } }); }
    drawRuleEvents(host);
    const axis = host.querySelector('.pj-tl');
    if (axis && left < 0) axis.scrollLeft = left;
    else if (axis && !axis.firstElementChild?.matches('.is-now')) requestAnimationFrame(() => {
      const current = axis.querySelector('.is-now');
      if (current && axis.isConnected && axis.scrollLeft === 0) axis.scrollLeft = current.getBoundingClientRect().right - axis.getBoundingClientRect().right;
    });
  }

  const RULE_STEP = 10;
  function drawRuleEvents(host) {
    const box = host.querySelector('.pj-rh-list');
    if (!box) return;
    const all = host._ruleEvents || [], n = Math.min(all.length, Math.max(RULE_STEP, host._ruleShown || 0)), left = all.length - n;
    box.innerHTML = all.slice(0, n).map(e => `<p>${e}</p>`).join('') + (all.length > RULE_STEP ? `<button class="more pj-rh-step" type="button"${left ? '' : ' data-open'}>${left ? `展开（还有 ${num(left)} 条）` : '收起'} <span class="more__chev">›</span></button>` : '');
  }
  function ruleTimeline(kept, current, text) {
    const index = kept.findLastIndex(e => e.version === current);
    const dot = (e, i) => `<li${i === index ? ' aria-current="true"' : ''} class="${i === index ? 'is-now' : e.kind === 'rolled_back' ? 'is-back' : ''}"><i></i><b>${ruleLink(text(e.version))}</b><small>${text([e.kind === 'rolled_back' && '退回', e.at ? stamp(e.at) : '时刻未留'].filter(Boolean).join(' · '))}</small>${e.time_gap ? `<small>${text(e.time_gap)}</small>` : ''}</li>`;
    return (index < 0 && current ? `<p class="pj-note">现役 ${ruleVersion(current) ? ruleLink(text(current)) : text(current)}</p>` : '') + (kept.length ? `<ol class="pj-tl" style="--rule-count:${kept.length}" tabindex="0" aria-label="逐版生效时间，北京时间">${kept.map(dot).reverse().join('')}</ol>` : '');
  }

  // —— 页头 ——
  function headline(d) {
    const h = d.headline;
    if (!h) return '';
    if (typeof h === 'object') {
      const reading = U.fieldText(h.text, projectViewer);
      return [reading && `${lower(h, 'value') && !reading.includes('至少') && !reading.startsWith('不到') ? '至少 ' : ''}${metricText(reading)}`, id === 'agents' && h.id === 'release' && h.at && `${stamp(h.at)} 生效`].filter(Boolean).join(' · ');
    }
    const m = (d.sections || []).flatMap((s) => s.metrics || []).find((x) => x.id === h);
    if (!m || !m.label || isPrivate(m) || hideZero(m)) return '';
    const v = value(m).plain;
    return v ? `${sp(m.label || '')} ${v}${id === 'agents' && m.id === 'release' && m.at ? ` · ${stamp(m.at)} 生效` : ''}` : '';
  }
  // 页头下那一条里点得过去的几格：名下任务、技能、AI 手上、等你的、最近产物；有才摆，0 不摆入口。格子的 title 是一整句（“名下自动任务 7 个”）
  function links(d) {
    const c = d.counts || {};
    const out = [];
    const partial = key => c.q === 'partial' && lower(c, key);
    const cell = (label, n, unit, href, title, atLeast) => `<${href ? `a href="${esc(href)}"` : 'div'} class="pj-cell" title="${esc(title)}"><span class="pj-cell__k">${esc(label)}${href ? '<span class="more__chev">›</span>' : ''}</span><span class="pj-cell__v">${atLeast ? '<small class="pj-atleast">至少</small>' : ''}<b>${esc(n)}</b><small>${unit}</small></span></${href ? 'a' : 'div'}>`;
    const go = (n, label, unit, href, key) => { if (n || (n === 0 && partial(key))) out.push(cell(label, n, unit, href ? route(href) : '', `${label} ${partial(key) ? '至少 ' : ''}${n} ${unit}`, partial(key))); };
    go(c.tasks, '名下计划任务', '项', d.tasks_href || `/live/tasks/?project=${enc(d.id)}`, 'tasks');
    go(c.skills, '名下技能', '个', d.skills_href || ((d.sections || []).some((s) => s.id === 'skills') ? '#skills' : ''), 'skills');
    go(c.ai, 'AI 手上', '件', d.ai_href || `/live/ledger/?project=${enc(d.id)}`, 'ai');
    go(c.need, `等${projectViewer === 'public' ? '本人的' : '你的'}`, '件', d.need_href || `/live/?project=${enc(d.id)}#needs`, 'need');
    if (d.artifacts?.count || (d.artifacts?.count === 0 && lower(d.artifacts, 'count'))) out.push(cell('最近产物', d.artifacts.count, '份', '#artifacts', `最近产物 ${lower(d.artifacts, 'count') ? '至少 ' : ''}${d.artifacts.count} 份`, lower(d.artifacts, 'count')));
    if (c.q === 'partial' && c.gap) out.push(`<small class="pj-strip-note pj-count-gap">${esc(c.gap)}</small>`);
    // 冻结的项目不再采名下任务、技能，不写“还在采集”
    const missing = ['tasks', 'skills'].filter(k => k in c && c[k] == null);
    if (missing.length && !U.offline?.() && d.phase !== 'archived' && d.state !== 'frozen') out.push(`<small class="pj-strip-note pj-links-note">${missing.length === 2 ? U.collectionText("名下任务、技能") : `名下${missing[0] === 'tasks' ? '任务' : '技能'}${U.collectionText()}`}</small>`);
    return out.join('');
  }
  // 那一条里不点的几格：代表数、近 7 天影响改动；有多大放在最后
  function heroCells(d) {
    // 读数是一整句话（超过 12 个字）的那一格占两格宽、照正文字号写，不当大号粗体数字。
    const sentence = text => [...String(text || '')].length > 12;
    const cell = (label, v, { sub = '', title = '', href = '', kind = '', wide = false, arrow = href ? metricArrow : '' } = {}) => `<${href ? `a href="${esc(href)}"` : 'div'} class="pj-cell${wide ? ' pj-cell--wide' : ''}"${title ? ` title="${esc(title)}"` : ''}><span class="pj-cell__k">${label}${arrow}</span><span class="pj-cell__v${kind ? ` is-${kind}` : ''}">${v}</span>${sub ? `<small class="pj-cell__sub" title="${esc(plain(sub))}">${sub}</small>` : ''}</${href ? 'a' : 'div'}>`;
    const head = [], tail = [], h = d.headline;
    const readingLabel = label => {
      const text = U.fieldHtml(label, { name: '读数', place: 'label' });
      return id === 'wly0829.cn' ? text.replace('（按浏览器算）', '<span class="live-unit">（按浏览器算）</span>') : text;
    };
    const metricId = typeof h === 'string' ? h : h?.id;
    const m = metricId && (d.sections || []).flatMap(s => s.metrics || []).find(x => x.id === metricId);
    const remote = m?.value ?? h?.value;
    if (id === 'pcconfig' && metricId === 'remote' && !restricted(h) && !restricted(h?.text) && !restricted(m) && !restricted(remote) && !m?.private && Number.isFinite(remote?.total)) {
      const words = metricText(remote.text || m?.text || h?.text || '');
      const total = lower(m, 'value') || lower(remote, 'total') ? '<small class="pj-atleast">至少</small>' : '';
      const { cadence, desktop } = m ? lineOf(m) : {};
      head.push(cell(readingLabel(m?.label || 'AI 远程用电脑') + (cadence || ''), `${total}<b>${esc(num(remote.total))}</b><small>次</small>`, { wide: true, href: m && metricHref(m), sub: esc([words, desktop].filter(Boolean).join(' · ')) }));
    } else if (h && typeof h === 'object' && h.text) {
      const { cadence, desktop } = m ? lineOf(m) : {};
      const words = headline({ ...d, headline: { ...h, at: null } });
      head.push(cell(m?.label ? readingLabel(m.label) + (cadence || '') : '现在', esc(words), { kind: 'text', wide: sentence(words), sub: id === 'agents' && h.id === 'release' && h.at ? esc(`${stamp(h.at)} 生效`) : esc(desktop || ''),
        href: id === 'agents' && h.id === 'release' && ruleVersion(h.value ?? h.text) ? RULES : '' }));
    } else if (typeof h === 'string' && headline(d)) {
      const href = metricHref(m), v = value(m), { line: said, moment, cadence } = lineOf(m, v, href ? metricArrow : ''), line = [said, moment].filter(Boolean).join(' · ');
      // 读数是一句字、超过 11 个字的（“10-04（52 天前）”，项目页卡 is-long 也从 11 个字起）：和整句读数一样占两格、一行写全，不截成“10-04（5…”
      const words = v.long || /class="pj-text"/.test(v.html) && [...v.plain].length > 11;
      const wrap = id === 'video-scaffold' && m.id === 'films' || id === 'pc-panel-hub' && m.id === 'updated';
      head.push(cell(readingLabel(m.label) + cadence, v.html, { kind: words ? 'text' : wrap ? 'wrap' : '', wide: v.long ? sentence(v.plain) : words, title: `${metricText(m.label)} ${v.plain}`, href, arrow: '', sub: id === 'agents' && m.id === 'release' && m.at ? esc(`${stamp(m.at)} 生效`) : line }));
    }
    if (d.changes7 != null) {
      const cutoff = d.changes7_stale && d.changes7_at && esc(`上次记录截至 ${stamp(d.changes7_at)}`);
      const missing = d.changes7_missing_note && `另有 ${esc(num(d.changes7_missing_note))} 次提交没有填写变化说明`;
      head.push(cell('近 7 天影响改动', `<b>${esc(num(d.changes7))}</b><small>次</small>`, { title: `近 7 天影响改动 ${num(d.changes7)} 次`, sub: [cutoff, missing].filter(Boolean).join(' · ') }));
    }
    const spark = commitsCell(cell);
    if (spark) head.push(spark);
    const size = d.size, bigCell = (n, unit) => { const t = big(n, unit), hit = /^([\d.,]+)\s*(.*)$/.exec(t); return hit ? `<b>${esc(hit[1])}</b><small>${esc(hit[2])}</small>` : esc(t); };
    if (size?.text) tail.push(cell('有多大', esc(size.text), { kind: 'text' }));
    else {
      if (size?.docs_chars != null) tail.push(cell('文档', bigCell(size.docs_chars, '字'), { title: `文档 ${big(size.docs_chars, '字')}` }));
      if (size?.code_lines != null) {
        const chars = size.code_chars != null && id === 'agents' ? window.ProjectAdditions?.codeCharacters(size, lower) : '';
        tail.push(cell('代码', bigCell(size.code_lines, '行'), { title: `代码 ${big(size.code_lines, '行')}${chars ? ` · ${chars}` : ''}`, sub: esc(chars || '') }));
      }
    }
    return { head, tail };
  }
  // 近 30 天提交：总数＋一条小折线（后端 projects 的 activity，按天；读不到的天不画、总数写“至少”）
  function commitsCell(cell) {
    const a = activity;
    const unavailable = () => id === 'agents' ? `<small class="pj-strip-note">${a === undefined ? '正在读提交记录…' : '提交记录暂时读不到。'}</small>` : '';
    if (!a) return unavailable();
    if (!a.commits.length) return '';
    const vals = a.commits.map(n => (typeof n === 'number' && Number.isFinite(n) ? n : null));
    const known = vals.filter(n => n != null), total = known.reduce((s, n) => s + n, 0);
    if (!known.length) return unavailable();
    if (!total && (proj?.phase === 'archived' || proj?.state === 'frozen')) return '';
    const unknown = known.length < vals.length || a.partial === true || a.q === 'partial';
    const W = 120, H = 22, max = Math.max(1, ...known), step = vals.length > 1 ? W / (vals.length - 1) : W;
    const pts = vals.map((n, i) => (n == null ? null : `${(i * step).toFixed(1)},${(H - 2 - (n / max) * (H - 6)).toFixed(1)}`));
    const runs = []; let run = [];
    for (const p of pts) { if (p) run.push(p); else if (run.length) { runs.push(run); run = []; } }
    if (run.length) runs.push(run);
    const line = runs.map(r => r.length > 1 ? `<polyline points="${r.join(' ')}"/>` : `<circle r="1.6" cx="${r[0].split(',')[0]}" cy="${r[0].split(',')[1]}"/>`).join('');
    const from = a.days?.[0], to = a.days?.at?.(-1);
    const svg = `<svg class="pj-spark" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true" preserveAspectRatio="none">${line}</svg>`;
    const title = `近 30 天提交 ${unknown ? '至少 ' : ''}${num(total)} 次${from && to ? `（${shortDate(from)}～${shortDate(to)}）` : ''}`;
    // 小折线放在数字下面，占满这一格的宽（一行九格时数字旁边放不下）
    return cell('近 30 天提交', `${unknown ? '<small class="pj-atleast">至少</small>' : ''}<b>${esc(num(total))}</b><small>次</small>`, { title }).replace(/<\/div>$/, `${svg}</div>`).replace('class="pj-cell"', 'class="pj-cell pj-cell--spark"');
  }
  function renderStrip(d) {
    const strip = part('links'), { head, tail } = heroCells(d), html = (custom?.strip?.(d, projectViewer) || '') + head.join('') + links(d) + tail.join('');
    const n = (html.match(/class="pj-cell[ "]/g) || []).length + (html.match(/class="pj-cell pj-cell--wide"/g) || []).length;
    strip.hidden = !html; strip.style.setProperty('--pj-cells', String(Math.min(Math.max(n, 4), 10)));
    U.html(strip, html);
    if (interfaceProjects.has(id) && !interfaceLoad) {
      interfaceLoad = import('/live/project/interface.js').then(module => module.mountInterface(id, strip))
        .catch(() => { interfaceLoad = null; });
    }
  }
  // 名字旁边：项目介绍（外链）、问情况
  function projectItemReferences(action) {
    const ids = (action?.item_ids || []).filter(id => typeof id === 'string' && id.length);
    return ids.length ? `相关事项编号：${ids.join('、')}。` : '';
  }
  function heroActs(d) {
    const out = [];
    if (coverSlug) out.push(`<a class="more more--link" href="/${esc(enc(coverSlug))}/project.html">项目介绍 <span class="more__chev">↗</span></a>`);
    for (const l of d.links || []) if (l.href && !(coverSlug && /^项目介绍(?:\s*↗)?$/.test(sp(l.label)))) out.push(`<a class="more more--link" href="${esc(route(l.href))}">${esc(sp(l.label))} <span class="more__chev">↗</span></a>`);
    const item = askItem(d);
    const act = (d.actions || []).filter(a => a.kind === 'copy' || a.href).map(a => {
      const refs = a.kind === 'copy' && a.intent === 'project' && projectItemReferences(a);
      return refs ? { ...a, text: (a.text ?? window.Live.copy(item, a.intent)) + refs } : a;
    });
    if (act.length) out.push(`<span class="pj-acts">${pcActions(item, act)}</span>`);
    return out.join('');
  }
  function askItem(d) {
    const c = d.counts || {};
    return { id: d.id, text: [d.name, c.need && `等你 ${c.need} 件`, c.ai && `AI 手上 ${c.ai} 件`].filter(Boolean).join(' · ') };
  }
  function renderHero(d) {
    hero.hidden = false; emptyHero.hidden = true;
    const status = U.status(d);
    Light.tone(hero, d);
    document.body?.classList.toggle('pj-frozen', d.phase === 'archived' || d.state === 'frozen' || hero.dataset.frozen === 'true');
    // 名字＋日用／偶用／冻结小标签（分档读不到时写后端那句缺口）
    const phase = { daily: '日用', occasional: '偶用', archived: '冻结' }[d.phase];
    const tag = phase ? `<span class="tag pj-phase" data-phase="${esc(d.phase)}">${phase}</span>` : d.phase_gap ? `<span class="pj-phase-gap">${U.fieldHtml(d.phase_gap, { name: '分档', kind: projectViewer })}</span>` : '';
    const anonymous = projectViewer === 'public' && /^project-[0-9a-f]{32}$/.test(d.id);
    const heading = titleText(d.name || (anonymous ? '项目名称仅本人可见' : d.id), anonymous ? '项目名称仅本人可见' : '项目');
    // M767：本人版里访客看不到的项目（后台标 visitor_labels.name=hidden），标题旁挂“访客看不到”
    const visitorTag = U.visitorLabel(d, ['$', 'name'], '这个项目', projectViewer);
    U.html(part('head'), status.lamp + U.head(heading, { lamp: false }) + tag + (visitorTag ? `<span class="head__rewrite">${visitorTag}</span>` : ''));
    document.title = `${heading} · 实况`;
    const acts = heroActs(d); part('acts').hidden = !acts; U.html(part('acts'), acts);
    // 一行：最近改动 ｜ 一句话说明（没有说明时用后端那句，例如冻结项目的“已冻结，保留已有资料”）
    // 冻结项目后台没给“有多大”时，用同一页“仓库”卡里同一次取的文档字数、代码行数，不在一页上一处说没有记录、一处给数
    const repo = !d.size && (d.sections || []).find(sec => sec?.id === 'repository')?.metrics || [], metric = key => repo.find(m => m?.id === key && Number.isFinite(m.value));
    const repoSize = (metric('docs_chars') || metric('code_lines')) && { docs_chars: metric('docs_chars')?.value, code_lines: metric('code_lines')?.value, at: (metric('docs_chars') || metric('code_lines')).at };
    const ch = d.changed, size = d.size || repoSize, stale = staleText(d, d.at || at), say = d.about || d.note;
    const line = [ch?.at && `<span class="pj-when">最近一次提交：${esc(stamp(ch.at))}</span>`, say && `<span class="pj-about">${U.fieldHtml(say, { name: '项目说明', kind: projectViewer })}</span>`, stale && `<small class="pj-stale">${esc(stale)}</small>`, status.note && `<small class="pj-stale">${status.note}</small>`].filter(Boolean).join('');
    part('about').hidden = !line; U.html(part('about'), line);
    // 详情（收起）：最近改动写了什么、近 7 天影响改动、有多大，以及后端给的说明和缺口
    const changed = !ch ? U.offline?.() ? '' : `<span class="pj-none">${U.collectionText()}</span>` : `<span class="pj-when">${esc(stamp(ch.at))}</span>${ch.text && !/^这次改动没有说明记录[。]?$/.test(U.fieldText(ch.text, projectViewer)) ? `<span>${U.fieldHtml(restricted(ch) ? ch : ch.text, { name: '提交说明', kind: projectViewer })}</span>` : ''}`;
    const chars = size?.code_chars != null && id === 'agents' ? window.ProjectAdditions?.codeCharacters(size, lower) : '';
    const sizeText = size && [size.text || [size.docs_chars != null && `文档 ${big(size.docs_chars, '字')}`, size.code_lines != null && `代码 ${big(size.code_lines, '行')}`].filter(Boolean).join(' · '), chars].filter(Boolean).join(' · ');
    const sized = !size ? U.offline?.() ? '' : `<span class="pj-none">${U.collectionText()}</span>`
      : `${esc(sizeText || U.collectionText())}${size.at ? `<small>${esc(U.offline?.() || isStale(size) ? staleText(size, size.at) : size.moment || `${shortDate(size.at)} 取的`)}</small>` : ''}`;
    part('facts').hidden = false;
    // 后台没给近 7 天改动数、而最近一次提交在 7 天以前：近 7 天就是 0 次
    const quiet = d.changes7 == null && Number.isFinite(Date.parse(ch?.at)) && (Date.parse(d.at || at) || Date.now()) - Date.parse(ch.at) > 7 * 86400000;
    // 后台说了为什么没数（changes7_gap）就只写原因，不再前面摆“没有记录”；数没核全（changes7_complete 为 false）写“至少”
    const changes = [d.changes7 == null ? quiet ? `0 次（最近一次提交在 ${shortDate(ch.at)}）` : d.changes7_gap ? null : U.collectionText() : `${d.changes7_complete === false ? '至少 ' : ''}${num(d.changes7)} 次`, d.changes7_missing_note != null && `另有 ${num(d.changes7_missing_note)} 次提交没有填写变化说明`, d.changes7_at && `截至 ${stamp(d.changes7_at)}`, d.changes7_gap].filter(v => v !== false && v != null && v !== '').map(v => U.fieldHtml(v, { name: '近 7 天影响改动数', kind: projectViewer })).join(' · ');
    const impactNote = !window.ProjectAdditions?.personalDetail(id) && Number.isFinite(d.changes7) && Number.isFinite(d.changes7_missing_note)
      ? '<small class="pj-impact-note">从这次读数往前数 7 天。只数写了“变化：”、而且不是“无”的提交；没写这一行的另算在<span class="pj-no-split">下面。</span></small>' : '';
    // “还缺”一格照后台逐项列的写（“缺少：A、B”去掉打头的“缺少：”，不和格名重复）
    const missing = typeof d.gap === 'string' ? d.gap.replace(/^缺少[：:]\s*/, '') : d.gap;
    const extra = [d.about && d.note && ['说明', d.note], d.gap && d.gap !== d.stale_text && !/数据截止/.test(U.fieldText(d.gap)) && ['还缺', missing]].filter(Boolean).map(([k, v]) => `<div class="kv__row"><span></span><dt>${k}</dt><dd>${U.fieldHtml(v, { name: '项目说明', kind: projectViewer })}</dd></div>`).join('');
    U.html(part('facts'), `${changed ? `<div class="kv__row"><span></span><dt>最近一次提交</dt><dd>${changed}</dd></div>` : ''}<div class="kv__row"><span></span><dt>近 7 天影响改动</dt><dd>${impactNote}${changes}</dd></div>${sized ? `<div class="kv__row"><span></span><dt>有多大</dt><dd>${sized}</dd></div>` : ''}${extra}`);
    part('detail').hidden = false;
    renderStrip(d);
    let cover = $('pj-cover');
    if (d.cover && !cover) { cover = document.createElement('img'); cover.id = 'pj-cover'; cover.className = 'pj-cover'; cover.alt = `${d.name || d.id}预览`; (part('links') || hero).after(cover); }
    if (cover) { cover.hidden = !d.cover; if (d.cover && cover.getAttribute('src') !== d.cover) cover.src = d.cover; }
  }
  function renderEmptyHero(text) {
    hero.hidden = true; emptyHero.hidden = false; U.html(emptyHero, U.fieldHtml(text));
    $('pj-cover')?.remove();
    U.html(part('head'), typeof text === 'object' ? U.fieldHtml(text) : U.head(text, { lamp: false }));
    part('about').hidden = true;
    part('facts').hidden = true;
    part('links').hidden = true;
    part('acts').hidden = true;
    part('detail').hidden = true;
  }

  // —— 出事时的横条：连不上 ——
  function renderNotices(state) {
    U.list(notices, state.offline
      ? [{ key: 'link', cls: 'notice glass', html: `<span class="lamp" aria-hidden="true"></span><span>${U.fieldHtml(state.text)}</span>` }] : []);
  }

  // —— 页眉〔问情况〕：一句就够，不堆废话 ——
  function ask() {
    if (!proj) return '';
    const c = proj.counts || {};
    const bits = [c.need && `等你 ${c.need} 件`, c.ai && `AI 手上 ${c.ai} 件`, c.tasks && `名下计划任务 ${c.tasks} 项`].filter(Boolean);
    const refs = projectItemReferences(proj.actions?.find(a => a.kind === 'copy' && a.intent === 'project'));
    return `请看实况项目「${proj.name || proj.id}」${at ? `（${U.time(at)} 的数）` : ''}${bits.length ? `：${bits.join('，')}` : ''}。请说明现在的情况。${refs}`;
  }
  const bar = U.topbar({ ask });

  // —— 项目首批读数和卡片齐了再入场；之后沿用原有的读数更新、灯与光 ——
  let lit = false;
  function lightUp() {
    if (lit) return;
    lit = true;
    Light.lightUp([hero, main, side, notices]);
  }

  let first = true, jumped = false, disconnected = false;
  let deepLink = null, linkInterrupted = false;
  if (location.hash) for (const type of ['wheel', 'pointerdown', 'keydown']) {
    addEventListener(type, () => { linkInterrupted = true; deepLink = null; }, { once: true, capture: true, passive: true });
  }
  // 地址带 #artifacts、#某一段：数第一次到了滚过去（全站换页时页面先藏着，等露出来再滚，不然滚不动）
  function jump() {
    if (jumped || linkInterrupted || !location.hash) return;
    let name;
    try { name = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const el = document.getElementById(name);
    if (!el) return;
    jumped = true;
    const t0 = performance.now();
    const go = () => {
      if (linkInterrupted) return;
      if (document.documentElement.classList.contains('mo-hide') && performance.now() - t0 < 2000) { requestAnimationFrame(go); return; }
      el.scrollIntoView({ block: 'start', behavior: 'instant' });
      deepLink = { id: name, y: scrollY };
    };
    requestAnimationFrame(go);
  }

  // 规则版本卡“逐版记录”底下的“展开（还有 N 条）／收起”
  board.addEventListener('click', (e) => {
    const btn = e.target.closest?.('.pj-rh-step'), host = btn?.closest('.pj-viz');
    if (!host) return;
    if (btn.hasAttribute('data-open')) {
      const details = btn.closest('details');
      details.open = false;
      if (details.getBoundingClientRect().top < 0) details.scrollIntoView({ block: 'start', behavior: 'instant' });
    } else { host._ruleShown = Math.max(RULE_STEP, host._ruleShown || 0) + RULE_STEP; drawRuleEvents(host); }
  });
  // 分组底下的“展开（还有 N 条）／收起”
  board.addEventListener('click', (e) => {
    const btn = e.target.closest?.('.pj-step'), b = btn && blocks.get(btn.closest('.pj-sec')?.id);
    if (!b) return;
    const close = btn.hasAttribute('data-open'), sec = b.el;
    stepGroup(b, btn.dataset.step, close);
    // 收起后卡头跑到屏幕上面去了：滚回这一块的开头，不让人找不到刚才看的地方
    if (close && sec.getBoundingClientRect().top < 0) sec.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  // 卡里两行收着的长读数：点一下看全，再点收回（是链接、按钮的不管）
  document.addEventListener('click', (e) => { const v = e.target.closest?.('.pj-card [data-clamp]'); if (v && !e.target.closest('a,button')) v.classList.toggle('is-full'); });
  // 字体到了、窗口变了，卡的高度会变：重新摆齐两栏
  document.fonts?.ready?.then(() => balance());
  let resized; window.addEventListener('resize', () => { clearTimeout(resized); resized = setTimeout(balance, 200); });

  if (!id) {
    await lookReady;
    renderEmptyHero('地址里没有说是哪个项目');
    renderBoard(false);
    bar?.set({ meta: {}, shownAt: null });
    requestAnimationFrame(lightUp);
    requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
    return;
  }

  let artsWatch = null, projectLink, documents;
  let opening = [], revealTimer;
  const loading = setTimeout(() => {
    if (first && emptyHero.hidden && !document.documentElement.classList.contains('live-public-paused')) {
      renderEmptyHero('正在读项目数据');
    }
  }, 400);  // 数据慢时 0.4 秒内先写“正在读项目数据”，不让整页空着（原来要等 2.5 秒）
  window.Live.watch(`projects/${enc(id)}`, null, window.Live.afterReady(lookReady, {
    data(raw, meta) {
      const viewer = meta.viewer?.kind || 'public';
      if (viewer !== projectViewer || !raw) {
        audience++; changeRead++; changeEpoch++; changeRefill = 0;
        changeLog = changeHead = changeView = activity = undefined; changeIssue = '';
        for (const subscription of additionWatches.splice(0)) subscription.stop();
        activityWatch?.stop(); activityWatch = null;
        correctionsWatch?.stop(); correctionsWatch = null; Object.keys(additions).forEach(key => delete additions[key]);
        artsWatch?.stop(); artsWatch = arts = artsState = null;
        opening = [];
      }
      projectViewer = viewer;
      if (raw && custom?.adapt) raw = custom.adapt(raw);
      if (raw && !raw.name) raw = { ...raw, name: raw.label || raw.title || raw.id || id };
      // M1002：“AI 记着的认识 95 项”读着像 AI 只记得这么多；这个数是说明书里整理成主题卡的认识张数（各类明细加起来），照实说。数照回包。
      if (raw && id === 'daily-preferences' && Array.isArray(raw.sections)) raw = { ...raw, sections: raw.sections.map(s => !Array.isArray(s?.metrics) ? s : { ...s, metrics: s.metrics.map(m => m?.id !== 'cognitions' || m.label !== 'AI 记着的认识' ? m
        : { ...m, label: '整理成主题卡的认识', unit: '张', scope: '一张主题卡是 AI 对本人某一方面的整理，下面按类列出；整理时用到的原始资料和本人原话另算，见“根据什么”“材料攒了多少”。' }) }) };
      // 时刻是“这件事最后一次发生”的读数：不按多久算旧标旧，换成照这件事意思写的一句（M769 C 类）
      if (raw) raw = window.LiveProjectMoments?.settle(id, raw) ?? raw;
      // 原话存档读数写成“到 X 为止：24 小时 N 条，7 天 N 条”，读数名也不再叫“近”
      if (raw && id === 'agents' && Array.isArray(raw.sections)) raw = { ...raw, sections: raw.sections.map(s => Array.isArray(s?.metrics) ? { ...s, metrics: s.metrics.map(m => m?.id === 'quotes_recent' && typeof m.label === 'string' && quotesWindow(m, m.value && typeof m.value === 'object' ? m.value : m) ? { ...m, label: m.label.replace(/^近\s*7\s*天存下（含近\s*24\s*小时）$/, '7 天存下（含 24 小时）') } : m) } : s) };
      proj = raw;
      at = meta.at;
      const reads = first ? opening : [];
      const watch = (resource, query, callbacks) => {
        const subscription = window.Live.watch(resource, query, callbacks);
        // get 复用订阅已发出的首个请求，等待状态回调把首批数据收齐。
        if (first) reads.push(window.Live.get(resource, query));
        return subscription;
      };
      if (!first) draw(true);
      if (raw) { readSide(raw, reads, watch); readAdditions(reads, watch); }
      if (raw?.artifacts && !artsWatch && !custom?.noArtifacts) {
        artsWatch = watch(`projects/${enc(id)}/artifacts`, null, {
          data(d, meta) {
            if (!sameViewer(meta)) return;
            if (first) { arts = d; return; }
            const update = () => { arts = d; renderBoard(true); };
            if (arts) U.anchor(update); else update();
            jump();
          },
          link(state) { artsState = state; if (first) return; if (!arts) renderBoard(false); U.blockNote(blocks.get('artifacts')?.el, state); },
        });
      }
      if (first) {
        const reveal = () => {
          if (!first || proj !== raw) return;
          clearTimeout(loading);
          clearTimeout(revealTimer);
          first = false;
          opening = [];
          draw(false);
        };
        // 辅助读数慢时先让项目能看，随后收取迟到的读数。
        clearTimeout(revealTimer);
        revealTimer = setTimeout(reveal, 2500);
        Promise.allSettled(reads).then(reveal);
      }
      function draw(animate) {
        const render = () => {
          if (raw) renderHero(raw); else renderEmptyHero(missingText());
          main.hidden = side.hidden = false;
          renderBoard(animate);
          if (!animate) for (const el of [part('facts'), part('links')]) U.swapped(el);
        };
        if (animate) U.anchor(render); else render();
        if (raw) jump();
        requestAnimationFrame(lightUp);
      }
    },
    link(state) {
      projectLink = state;
      if (typeof documents === 'function') documents();
      else if (!documents && state.data && state.meta.source === 'net' && state.viewer.kind === 'owner' &&
          !state.offline && !window.LiveView?.isPublic()) {
        documents = import('/live/project/documents.js').then(module => {
          documents = module.mount(id, board, () => projectLink);
        }).catch(() => { documents = null; });
      }
      bar?.set(state);
      if (disconnected !== state.offline) { disconnected = state.offline; if (proj && !first) { renderHero(proj); renderBoard(false); } }
      Light.offline(state.offline);
      renderNotices(state);
      if (!proj && ['none', 'gone'].includes(state.phase)) {
        clearTimeout(loading);
        const locked = state.meta?.status === 403 && state.meta?.viewer?.kind === 'public';
        renderEmptyHero(locked ? { visibility: 'owner', hidden_what: '此项目的实况' } : missingText(state));
      }
      [hero.querySelector('.card__body'), ...[...blocks.values()].filter(b => !b.artifacts && !b.changes && !(id === 'agents' && ['quotes', 'agents-moved', 'hooks'].includes(b.key))).map(b => b.el)].forEach(el => U.blockNote(el, state));
    },
  }));

  await lookReady;
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();
