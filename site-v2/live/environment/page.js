(() => {
  'use strict';
  const U = window.LiveUI, L = window.LiveLight, V = window.LiveViz, $ = id => document.getElementById(id), { esc, sp } = U;
  const params = new URLSearchParams(location.search), data = {}, phases = {}, clocks = {}, links = {};
  let header = null;
  const offline = () => !!U.offline?.();
  const missing = (label = '', meta) => offline() ? '这块没存下来，连上后补上。' : U.collectionText(label, meta);
  // 开机启动挪到自启动页（/live/startup/，本人 11-26 02:12 选的），这页只留软件版本和命令环境，最下面一行指过去。
  const resources = { software: 'software', runtime: 'runtimes' }, observed = {};
  const recordResource = (key, cursor) => params.has('fixture') ? `projects/pcconfig/records-${resources[key]}${cursor ? '-2' : ''}` : 'projects/pcconfig/records';
  const names = { software: '软件版本', runtime: '命令环境' };
  const pictures = { software: '/live/img/grp-long.webp', runtime: '/live/img/grp-machine.webp' };
  const relations = { equal: '版本相同', behind: '装的版本落后', ahead: '装的版本更新', channel_mismatch: '渠道不同，不能直接比较', unknown: '比不出新旧' };
  const cultures = { 'zh-CN': '简体中文', 'zh-TW': '繁体中文', 'zh-HK': '繁体中文（香港）', 'en-US': '英语（美国）', 'en-GB': '英语（英国）', 'ja-JP': '日语' };
  const sources = { registry_run: '注册表启动项', startup_folder: '启动文件夹', user_startup_folder: '启动文件夹', common_startup_folder: '公共启动文件夹', msi_or_portable: 'MSI 安装或便携版', windows_builtin: 'Windows 自带' };
  const referenceTime = key => offline() ? clocks[key] || window.Live.upTo?.() || observed[key] || data[key]?.at || null : new Date().toISOString();
  const date = (at, key = 'software') => at ? `${U.date(at) === U.date(referenceTime(key) || at) ? '' : U.date(at) + ' '}${U.time(at)}` : U.collectionText();
  const validAt = at => typeof at === 'string' && Number.isFinite(Date.parse(at)) ? at : null;
  const checkedAt = key => [data[key]?.checked_at, Object.hasOwn(data[key] || {}, 'source_at') ? data[key].source_at
    : data[key]?.at ?? observed[key]].find(validAt);
  const plain = (v, key, label = names[key] || '', meta = data[key]) => v == null || v === '' ? (offline() ? '—' : U.collectionText(label, meta)) : typeof v === 'object' ? sp(v) : String(v);
  const value = (v, key, label, meta) => esc(sp(plain(v, key, label, meta)));
  const list = d => d?.items, runtime = d => d?.items && Object.assign({ windows: d.items[0]?.windows }, Object.fromEntries(d.items.map(r => [r.runtime_id || r.name, r])));
  // 两边版本都没读到、或比较结果不是“相同／落后／更新”的，算没法比，不算进“0 个落后”（M436）。
  const noVersion = v => v == null || v === '';
  const compared = r => ['equal', 'behind', 'ahead'].includes(r.relation) && !(noVersion(r.current_version) && noVersion(r.target_version));
  const comparisonNote = rows => { const n = rows.filter(r => !compared(r)).length; return n ? `${n} 个软件没法直接比版本` : ''; };
  const count = (n, unit, meta, key = 'total') => window.ComputerStat.text(n, unit, meta, key);
  const indicator = (row, level) => U.status({
    ...row, level: level && (!row.level || ['green', 'ok'].includes(row.level)) ? level : row.level,
  }, { small: true }).lamp;
  function snapshot(at, key) {
    if (!at) return offline() ? '' : U.collectionText('快照日期', data[key]);
    const days = Math.max(0, Math.floor((Date.parse(offline() ? referenceTime(key) || at : new Date().toISOString()) - Date.parse(at)) / 86400000));
    return `${U.isStale(data[key]) ? '上次 ' : ''}${U.date(at)} ${U.time(at)} 查的${days > 7 ? `（${days} 天前）` : ''}`;
  }
  // 软件版本多久查一次：周期读回包每行的 refresh_interval_seconds；是 7 天时写上钟点。
  // 按需更新快核（M928）核法：E:/PCConfig/registries/tasks.json 里“PCConfig Governance Check”的 schedule_zh，现“每周日 23:30；错过会补”；变了改这句
  const softwareEvery = rows => { const s = Number(rows?.[0]?.refresh_interval_seconds); return s === 604800 ? '每周日 23:30 查一次，没开机就开机后补查' : s > 0 ? `每 ${s % 86400 ? `${Math.round(s / 3600)} 小时` : `${s / 86400} 天`}查一次` : ''; };
  function encoding(cp) { return cp == null ? null : Number(cp) === 65001 ? 'UTF-8 · 65001' : Number(cp) === 936 ? 'GBK · 936' : Number(cp) === 20127 ? 'ASCII · 20127' : String(cp); }
  const fields = ['console_input_code_page', 'console_output_code_page', 'pipeline_output_code_page', 'dotnet_default_code_page'];
  const hero = $('hero'), heroRead = U.reading(hero.querySelector('.card__body'), { ghost: U.ghost.card(2), name: '软件与环境' });
  const bar = U.topbar({ ask: () => '帮我看看软件与环境，哪些版本落后、中文编码有什么不同。' });
  L.add(hero);
  document.querySelectorAll('.stage a[href^="/live/"]').forEach(a => { if (params.has('fixture') && !new URL(a.href).searchParams.has('fixture')) a.href += (a.href.includes('?') ? '&' : '?') + 'fixture=' + encodeURIComponent(params.get('fixture')); });
  const hosts = {}, boards = {};
  function addBoard(key) {
    const host = document.createElement('section');
    host.dataset.section = key; hosts[key] = host; $('board').append(host);
    boards[key] = V.board(host, { key: `environment-${key}`, collapsible: Object.hasOwn(resources, key) });
  }
  function readingRows() {
    const ghost = hosts.software.querySelector('.grp__ghost .fog__chart');
    if (ghost && !ghost.querySelector('.fog__row')) ghost.innerHTML = U.ghost.rows(4);
  }
  const envFolds = new Map();
  const foldAttrs = key => ` data-env-fold="${esc(key)}"${envFolds.get(key) ? ' open' : ''}`;
  const rememberFold = detail => envFolds.set(detail.dataset.envFold, detail.open);
  const details = () => [...$('board').querySelectorAll('details[data-env-fold]')].filter(d => !d.closest('.grp--private,.is-unread'));
  // 软件版本表按“要不要你管”分组（本人 11-26 选 ENV1 的 A，照图 ENV-1）：要你点头才更新的、会自动更新但还没更新上的、已是最新的。
  // 分组读后台每行的 update_mode（automatic／owner_approval）和自动项的 last_update；后台还没给 update_mode 时只分“落后／已是最新”，“怎么更新”写还没读到。
  // 已是最新那组：多就先露一部分、点“再看”展开，少就全露（本人补的：默认收起不好，前提是多，现在少不代表以后少）。
  const LATEST_FIRST = 5, LATEST_STEP = 10;
  let latestShown = LATEST_FIRST;
  const isBehind = r => compared(r) && r.relation === 'behind', isLatest = r => compared(r) && ['equal', 'ahead'].includes(r.relation);
  // 周检和自动更新是同一个每周任务（PCConfig Governance Check），星期几照它的下次运行时刻写，不写死
  const weekday = at => validAt(at) ? '日一二三四五六'[new Date(Date.parse(at) + 8 * 3600000).getUTCDay()] : '';
  const weekly = rows => weekday(rows?.find(r => validAt(r.target_next_run_at))?.target_next_run_at);
  const hasMode = rows => rows.some(r => ['automatic', 'owner_approval'].includes(r.update_mode));
  // 最新版上次是哪天查的：取各行周检时刻里最晚的（“最新版本”那列最旧可能是一周前的）
  const targetAt = rows => rows.map(r => r.target_observed_at).filter(validAt).sort((a, b) => Date.parse(b) - Date.parse(a))[0] || checkedAt('software');
  function versionGroups(rows) {
    const behind = rows.filter(isBehind);
    return [
      { key: 'approval', name: '要你点头才更新', rows: behind.filter(r => r.update_mode === 'owner_approval') },
      { key: 'auto', name: '会自动更新，还没更新上', rows: behind.filter(r => r.update_mode === 'automatic') },
      { key: 'behind', name: '版本落后', rows: behind.filter(r => !['automatic', 'owner_approval'].includes(r.update_mode)) },
      { key: 'other', name: '没法比新旧', rows: rows.filter(r => !compared(r)) },
      { key: 'latest', name: '已是最新', rows: rows.filter(isLatest) },
    ].filter(g => g.rows.length);
  }
  function updateWay(r) {
    if (r.update_mode === 'owner_approval') return '你说一声，AI 来更新';
    // 还落后的自动项顺带写下次几号再试（放这列，“现在”那列就能一行写完上次的结果）
    if (r.update_mode === 'automatic') { const w = weekday(r.target_next_run_at); return `${w ? `每周${w}自动` : '自动更新'}${isBehind(r) && w ? `，下次 ${U.date(r.target_next_run_at)}` : ''}`; }
    return '还没读到';
  }
  // “现在”：落后的自动项写上次自动更新的结果和原因（后台 last_update）
  function nowState(r) {
    if (isLatest(r)) return { level: 'green', text: r.relation === 'ahead' ? '已是最新（比上次查到的还新）' : '已是最新' };
    if (!compared(r)) return { level: null, text: [relations[r.relation] || r.state_text || relations.unknown, r.unknown_text].filter(Boolean).map(sp).join(' · ') };
    if (r.update_mode !== 'automatic') return { level: 'yellow', text: '落后' };
    const u = r.last_update || {}, when = validAt(u.at) ? `${U.date(u.at)} ` : '';
    const what = u.status === 'unknown' || !u.status ? '还没有自动更新的记录' : `${when}${({ deferred: '被推迟：', failed: '没更新成功：' })[u.status] || ''}${sp(u.reason || '')}`;
    return { level: 'yellow', text: what };
  }
  function versionRow(r) {
    const now = nowState(r);
    return `<tr><td title="${value(r.name || r.component_id)}">${value(r.name || r.component_id, 'software', '软件名', r)}</td><td title="${value(r.current_version)}">${r.installed === false ? '没装' : value(r.current_version, 'software', '装的版本', r)}</td><td title="${value(r.target_version)}">${value(r.target_version, 'software', '最新版本', r)}</td><td>${updateWay(r) === '还没读到' ? '<span class="env-missing">还没读到</span>' : esc(updateWay(r))}</td><td title="${esc(now.text)}">${now.text.split('，').map((s, i, all) => `<span class="env-nw">${i || !now.level ? '' : indicator({}, now.level)}${esc(s)}${i < all.length - 1 ? '，' : ''}</span>`).join('')}</td></tr>`;
  }
  function versionTable(rows) {
    const body = versionGroups(rows).map(g => {
      const list = g.key === 'latest' && g.rows.length > LATEST_FIRST + 1 ? g.rows.slice(0, latestShown) : g.rows, left = g.rows.length - list.length;
      const more = left > 0 ? `<tr class="env-more-row"><td colspan="5"><button type="button" class="more" data-latest-more>${left > LATEST_STEP ? `再看 ${LATEST_STEP} 个（还有 ${left} 个）` : `再看剩下 ${left} 个`} ›</button></td></tr>` : '';
      return `<tbody class="env-group" data-group="${g.key}"><tr class="env-group__head"><th colspan="5" scope="rowgroup"><span>${esc(g.name)}</span> · ${count(g.rows.length, '个', data.software)}</th></tr>${list.map(versionRow).join('')}${more}</tbody>`;
    }).join('');
    return `<table class="env-table env-table--versions"><thead><tr><th>软件</th><th>装的版本</th><th>最新版本</th><th>怎么更新</th><th>现在</th></tr></thead>${body}</table>`;
  }
  // 日用软件（本人 11-26 第 3 题：固定名单＋近 30 天常用的自动挑，两样一起；照图 ENV-2）：读后台 software_versions，只写现在的版本和最近一次换版本，不和官网比新旧。
  const DAILY_FIRST = 6, DAILY_STEP = 6, DAY = 86400000;
  let daily = null, dailyPhase = null, dailyShown = DAILY_FIRST;
  const dayKey = at => new Date(at + 8 * 3600000).toISOString().slice(0, 10);
  // 最近一次换版本：有安装登记日期写“几号起用这版”（登记日分不出新装还是升级，“起用”两样都对）；只能靠前后两天的清单对出来的也写“几号起用这版”（夜里那份算前一天），跨了几天写“几号到几号之间换成这版”；
  // 两样都没有，就是清单记着的这几天里没换过（后台按最近 8 份日清单对，所以最多说近 7 天）
  function dailyChange(c, d) {
    const nowAt = Date.parse(referenceTime('software') || new Date().toISOString()), recent = at => Number.isFinite(at) && nowAt - at < 7 * DAY;
    if (c?.at && Number.isFinite(Date.parse(`${c.at}T00:00:00+08:00`))) { const at = Date.parse(`${c.at}T00:00:00+08:00`); return { text: `${U.date(at)} 起用这版`, recent: recent(at) }; }
    if (validAt(c?.after) && validAt(c?.by)) {
      const from = Date.parse(c.after), by = Date.parse(c.by), end = by - (new Date(by + 8 * 3600000).getUTCHours() < 6 ? DAY : 0);
      const a = U.date(from), b = U.date(Math.max(from, end));
      return { text: a === b ? `${a} 起用这版` : `${a} 到 ${b} 之间换成这版`, recent: recent(by) };
    }
    const start = Date.parse(d?.started_at), seen = Date.parse(d?.observed_at);
    const days = Number.isFinite(start) && Number.isFinite(seen) ? Math.min(7, Math.round((Date.parse(dayKey(seen)) - Date.parse(dayKey(start))) / DAY)) : 0;
    return { text: days > 0 ? `近 ${days} 天没换过` : '没有换版本的记录', recent: false };
  }
  function dailyBlock() {
    const d = daily?.d, items = d?.items, kind = daily?.viewer;
    const title = n => `<p class="env-sub"><b>日用软件</b>${n ? ` · ${esc(n)}` : ''}<span>固定名单加近 30 天常用的自动挑 · 它们大多自己会更新，这里只记现在的版本和最近一次换版本</span></p>`;
    if (!Array.isArray(items)) return d || ['none', 'gone'].includes(dailyPhase) ? `${title('')}<p class="env-note">${esc(missing('日用软件', d))}</p>` : '';
    const cards = items.slice(0, dailyShown).map(r => {
      // 现役后台还没有 last_change 时，用它原来给的安装登记日期
      const change = !r.version ? null : Object.hasOwn(r, 'last_change') ? dailyChange(r.last_change, d)
        : r.installed_or_updated_on ? dailyChange({ at: r.installed_or_updated_on }, d) : { text: '没有换版本的记录', recent: false };
      return `<li class="env-app"><b>${U.fieldHtml(r.name, { name: '软件', kind })}</b><span>${r.version ? esc(sp(r.version)) : '没找到安装记录'}</span>${change ? `<span class="env-app__change${change.recent ? ' is-recent' : ''}">${esc(change.text)}</span>` : ''}</li>`;
    }).join('');
    const left = items.length - Math.min(dailyShown, items.length);
    const notes = [d.usage_gap, d.q === 'stale' && (d.gap || '旧读数')].filter(Boolean).map(sp);
    return `${title(count(items.length, '个', d))}${notes.length ? `<p class="env-note">${esc(notes.join(' · '))}</p>` : ''}${items.length ? `<ul class="env-apps">${cards}</ul>` : '<p class="env-note">这一轮没有日用软件条目</p>'}${left > 0 ? `<button type="button" class="more" data-daily-more>还有 ${left} 个 ›</button>` : ''}`;
  }
  function software(el) {
    el.innerHTML = '<p class="env-note"></p><div class="env-versions"></div><div data-software-more></div><div class="env-daily"></div>';
    el.addEventListener('click', e => {
      if (e.target.closest('[data-latest-more]')) { latestShown += LATEST_STEP; if (e.isTrusted) window.Live.markOpened(softwareCard); repaint(); }
      if (e.target.closest('[data-daily-more]')) { dailyShown += DAILY_STEP; repaint(); }
    });
    return { set() {
      const d = data.software, rows = list(d);
      const note = el.querySelector('.env-note'), versions = el.querySelector('.env-versions');
      note.hidden = !!rows;
      if (!rows) note.textContent = missing('软件版本', d);
      U.html(versions, !rows ? '' : rows.length ? versionTable(rows) : '<p class="env-note">这一轮没有软件条目</p>');
      U.html(el.querySelector('.env-daily'), dailyBlock());
    } };
  }
  // 命令环境改成三句结论（本人 11-26 选 ENV4 的 A，照图 ENV-3）：AI 用的 PowerShell 7 中文正不正常；AI 常用的命令工具在不在；系统自带的旧版 PowerShell 影不影响。
  // 第三句“影不影响”要后台给 windows_powershell.used_by = { tasks: 用它的计划任务数, passes_chinese: 经不经它传中文 }；没给时照实说还没读到，灯不降灰。
  const BASIC_TOOLS = ['pwsh7', 'node', 'python', 'git', 'go'];
  function commandLines(r) {
    const lines = [], core = r.powershell_core, win = r.windows_powershell, tools = list(data.software);
    const coreOk = core && fields.every(k => Number(core[k]) === 65001);
    lines.push(core ? { level: coreOk ? 'green' : 'yellow', text: `AI 跑命令用的 PowerShell 7：${coreOk ? '中文正常' : fields.some(k => Number(core[k]) === 20127) ? '有中文可能乱码的编码设置，看明细' : '中文编码要按明细看'}` }
      : { level: null, text: 'AI 跑命令用的 PowerShell 7：还没读到' });
    if (tools) {
      const lost = tools.filter(t => t.installed === false), unread = tools.filter(t => t.installed !== false && noVersion(t.current_version));
      const basic = BASIC_TOOLS.map(id => tools.find(t => t.component_id === id)).filter(Boolean).map(t => sp(t.name || t.component_id));
      const names = items => items.map(t => sp(t.name || t.component_id)).join('、');
      lines.push(lost.length ? { level: 'yellow', text: `AI 常用的命令工具缺 ${lost.length} 个：${names(lost)}` }
        : unread.length ? { level: 'yellow', text: `AI 常用的命令工具：${names(unread)} 的版本没读到` }
        : { level: 'green', text: `AI 常用的命令工具都在：${basic.join('、')}${tools.length > basic.length ? ` 等 ${tools.length} 个` : ''}` });
    } else lines.push({ level: null, text: `AI 常用的命令工具：${missing('', data.software)}` });
    if (win) {
      const garbled = fields.some(k => Number(win[k]) === 20127), use = win.used_by, n = Number(use?.tasks);
      const who = !Number.isFinite(n) ? '' : n === 0 ? '没有计划任务在用它' : `${n === 1 ? '只有 1 个' : `${n} 个`}计划任务在用它`;
      const effect = !garbled ? '' : use?.passes_chinese === false && who ? ` · ${who}，不传中文，不影响` : use?.passes_chinese === true && who ? ` · ${who}，会经它传中文` : !use ? ' · 谁在用它、传不传中文还没读到' : ` · ${who || '用它的计划任务还没读到'}`;
      lines.push({ level: !garbled ? 'green' : use?.passes_chinese === false && who ? 'gray' : 'yellow', quiet: garbled && use?.passes_chinese === false, text: `系统自带的旧版 PowerShell：${garbled ? (Number(win.pipeline_output_code_page) === 20127 ? '管道里中文会乱码' : '有中文会乱码的编码设置') : '中文正常'}${effect}` });
    }
    return lines;
  }
  function command(el) {
    return { set() {
      const r = runtime(data.runtime);
      if (!r) { U.html(el, `<p class="env-note">${missing('命令环境', data.runtime)}</p>`); return; }
      const w = r.windows, gap = window.ComputerStat.gap(data.runtime, 'risk') || window.ComputerStat.gap(data.runtime, 'shells');
      U.html(el, `${gap ? `<p class="env-note">${esc(gap)}</p>` : ''}<ul class="env-differences">${commandLines(r).map(x => `<li${x.quiet ? ' class="is-quiet"' : ''}>${x.level ? indicator({}, x.level) : ''}<span>${esc(x.text)}</span></li>`).join('')}</ul><details class="env-details"${foldAttrs('runtime-details')}><summary>版本、来源和编码明细</summary><p class="env-note">Windows 语言 ${cultures[w?.culture] ? esc(cultures[w.culture]) : value(w?.culture, 'runtime')} · ANSI 代码页 ${value(w?.ansi_code_page, 'runtime')} · OEM 代码页 ${value(w?.oem_code_page, 'runtime')}</p><div class="env-runtime">${[['powershell_core', 'PowerShell 7'], ['windows_powershell', 'Windows PowerShell']].map(([key, name]) => {
        const p = r[key];
        return `<section><p>${name} ${value(p?.version, 'runtime')}</p><dl>${[['来源', sources[p?.install_source] || p?.install_source || (p && key === 'windows_powershell' ? 'Windows 自带' : null)], ['输入编码', encoding(p?.console_input_code_page)], ['输出编码', encoding(p?.console_output_code_page)], ['管道编码', encoding(p?.pipeline_output_code_page)], ['.NET 默认编码', encoding(p?.dotnet_default_code_page)]].map(([label, v]) => `<dt>${label}</dt><dd>${value(v, 'runtime')}</dd>`).join('')}</dl></section>`;
      }).join('')}</div></details>`);
    } };
  }
  const chapters = { software, runtime: command };
  const loading = new Set();
  const softwareCard = 'card/environment/software';
  $('board').addEventListener('toggle', e => { if (e.target.matches?.('details[data-env-fold]')) rememberFold(e.target); }, true);
  // 后台把软件表分页给（有 next）时，表下面接着取下一页
  function moreRecords(el, key) {
    el.querySelector('[data-more-records]')?.remove();
    if (!data[key]?.next) return;
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'more'; btn.dataset.moreRecords = key; btn.dataset.needsPc = '';
    const left = data[key].total == null ? null : data[key].total - data[key].items.length;
    btn.textContent = left > 0 ? `还有 ${count(left, '个', data[key])} ›` : `继续看${names[key]} ›`; (el.querySelector('[data-software-more]') || el).append(btn);
    btn.addEventListener('click', async () => {
      if (offline() || loading.has(key)) return;
      const current = data[key], label = btn.textContent;
      loading.add(key); btn.disabled = true; btn.textContent = '正在读…';
      try { const s = await window.Live.get(recordResource(key, current.next), { section: resources[key], cursor: current.next });
        if (data[key] !== current) return;
        if (s.data) { data[key] = { ...current, ...s.data, items: [...current.items, ...(s.data.items || [])] }; repaint(); }
        else btn.textContent = "下一页暂时读不到，再试一次 ›";
      } finally { loading.delete(key); btn.disabled = false; if (btn.textContent === '正在读…') btn.textContent = label; }
    });
  }
  function group(key) {
    const d = data[key], waiting = !d && !['none', 'gone'].includes(phases[key]), rows = list(d), r = runtime(d);
    let line = missing(names[key], d);
    let figures = key === 'software' ? [{ key: 'total', label: '软件', unit: '个' }, { key: 'behind', label: '版本落后', unit: '个' }] : [{ key: 'risk', label: '可能乱码', unit: '处' }, { key: 'shells', label: '命令环境', unit: '套' }];
    // 标题下写多久查一次（照图 ENV-1／ENV-3）：装的版本每天夜里本机实测（current_refresh_seconds=86400），最新版跟每周的周检，星期几和下次几号照周检任务的下次运行；
    // 后台还没给这几项时照旧写“几号查的 · 每周日 23:30 查一次”
    const w = weekly(list(data.software)), next = list(data.software)?.find(x => validAt(x.target_next_run_at))?.target_next_run_at;
    if (key === 'software' && rows) {
      line = w && rows.some(x => Number(x.current_refresh_seconds) === 86400)
        ? [U.isStale(d) ? snapshot(checkedAt('software'), 'software') : '', `装的版本每天夜里查 · 最新版每周${w}查（错过了开机补查），${targetAt(rows) ? `上次 ${U.date(targetAt(rows))}，` : ''}下次 ${U.date(next)}`].filter(Boolean).join(' · ')
        : [snapshot(checkedAt('software'), 'software'), softwareEvery(rows)].filter(Boolean).join(' · ');
      figures = [];
    }
    if (key === 'runtime' && r) { const at = checkedAt('runtime'); line = w && at ? `每周${w}查（错过了开机补查） · 上次 ${U.date(at)} ${U.time(at)}` : snapshot(at, 'runtime'); figures = []; }
    if (!d && !waiting) figures = [];
    return { ...d, key, name: names[key], pic: pictures[key], wait: waiting, level: d?.level, reason: '', line: sp(line), palette: ['apricot', 'pink'], figures, build: el => { const chapter = chapters[key](el); return { set() { chapter.set(); moreRecords(el, key); } }; } };
  }
  let lit = false;
  function paint() {
    const groups = window.LiveAdaptive?.groups(header, Object.keys(resources).map(group)) || Object.keys(resources).map(group);
    for (const key of Object.keys(boards)) if (!groups.some(g => g.key === key)) { hosts[key].remove(); delete hosts[key]; delete boards[key]; }
    for (const g of groups) {
      if (!boards[g.key]) addBoard(g.key);
      boards[g.key].set([g]);
      if (g.adaptive) boards[g.key].data(g);
      const card = boards[g.key].cards()[0], failed = !offline() && !g.wait && !g.adaptive && !Array.isArray(data[g.key]?.items);
      card?.classList.toggle('is-unread', failed);
      let say = card?.querySelector('[data-unread]');
      if (failed && !say) { say = document.createElement('p'); say.dataset.unread = ''; say.className = 'env-note'; card.querySelector('.card__body').append(say); }
      if (say) { say.hidden = !failed; say.textContent = failed ? `${g.name}暂时读不到` : ''; }
    }
    const status = U.status(header);
    L.tone(hero, status.tone);
    U.html($('attention'), status.note); $('attention').hidden = !status.note;
    readingRows();
    if (!$('board').matches(':hover,:focus-within')) groups.sort((a, b) => (Number(!!a.adaptive) - Number(!!b.adaptive)) || ((({ red: 0, yellow: 1, blue: 2, gray: 3, none: 4, green: 5, ok: 5 })[a.level] ?? 4) - (({ red: 0, yellow: 1, blue: 2, gray: 3, none: 4, green: 5, ok: 5 })[b.level] ?? 4))).forEach(g => $('board').append(hosts[g.key]));
    const rows = list(data.software);
    hero.classList.toggle('is-unread', !offline() && !rows && Object.keys(phases).length === Object.keys(resources).length && Object.values(phases).every(p => ['none', 'gone', 'ready'].includes(p)));
    // 页顶大字先说有几个要你点头才更新，小字说其余的（照图 ENV-1）；后台还没给 update_mode 时照旧写“几个软件 · 几个版本落后”
    if (rows && hasMode(rows)) {
      const n = Object.fromEntries(versionGroups(rows).map(g => [g.key, count(g.rows.length, '个', data.software)]));
      $('note').textContent = [n.auto && `${n.approval ? '另有 ' : ''}${n.auto}会自动更新，还没更新上`, n.behind && `${n.behind}版本落后`, n.latest && `${n.latest}已是最新`, n.other && `${n.other}没法比新旧`].filter(Boolean).join(' · ');
      $('note').hidden = !$('note').textContent;
      U.html($('head'), status.lamp + U.head(n.approval ? `${n.approval}要你点头才更新` : '没有要你点头才更新的软件', { lamp: false })); heroRead.done();
    } else if (rows) { $('note').textContent = comparisonNote(rows); $('note').hidden = !$('note').textContent; }
    else { $('note').textContent = ''; $('note').hidden = true; }
    if (rows && !hasMode(rows)) { const behind = rows.filter(r => compared(r) && r.relation === 'behind').length, none = rows.length && !rows.some(compared); U.html($('head'), status.lamp + U.head(`${window.ComputerStat.text(data.software.total ?? rows.length, '个', data.software, 'total')}软件 · ${none ? '还没读到版本，没法比新旧' : `${count(behind, '个', data.software, 'behind')}版本落后`}`, { lamp: false })); heroRead.done(); }
    else if (!rows && Object.keys(phases).length === Object.keys(resources).length && Object.values(phases).every(p => ['none', 'gone', 'ready'].includes(p))) { U.html($('head'), status.lamp + U.head(offline() ? '软件与环境' : '软件与环境暂时读不到', { lamp: false })); heroRead.done(); }
    if (!lit && Object.keys(data).length) { lit = true; L.lightUp([hero, ...Object.values(boards).flatMap(b => b.cards())]); }
  }
  // 两版同一套：访客也照本人版看各卡自己的截止说明，不再另写一行“公开数据读于 …”把它们换掉（同一接口原时刻照给）
  function updateNotes() {
    for (const [key, s] of Object.entries(links)) {
      const state = { fallbackNote: s.fallbackNote, meta: { fallbackNote: s.meta?.fallbackNote } };
      if (key === 'software') U.blockNote(hero.querySelector('.card__body'), state);
      boards[key].cards().forEach(el => U.blockNote(el, state));
    }
  }
  function repaint() { details().forEach(rememberFold); paint(); updateNotes(); }
  repaint();
  readingRows();
  for (const [key, resource] of Object.entries(resources)) window.Live.watch(recordResource(key), { section: resource }, {
    phase(s) { phases[key] = s.phase; boards[key].phase(s); readingRows(); if (!s.data) { if (key === 'software') heroRead.set(s); if (s.phase === 'none' || s.phase === 'gone') repaint(); } },
    data(d, meta) { data[key] = d; clocks[key] = d && validAt(meta?.at); if (d) boards[key].data({ series: [] }); repaint(); },
    link(s) { links[key] = s; if (key === 'software') { bar?.set(s); L.offline(s.offline); repaint(); U.list($('notices'), s.offline ? [{ key: 'offline', cls: 'notice glass', html: `<span class="lamp" aria-hidden="true"></span><span>${esc(sp(s.text))}</span>` }] : []); } else if (s.offline) repaint(); else updateNotes(); },
  });
  // 日用软件单独一段读口，画在软件版本卡里
  window.Live.watch(params.has('fixture') ? 'projects/pcconfig/records-software_versions' : 'projects/pcconfig/records', { section: 'software_versions' }, {
    phase(s) { dailyPhase = s.phase; if (!s.data && ['none', 'gone'].includes(s.phase)) repaint(); },
    data(d, meta) { daily = d ? { d, viewer: meta?.viewer?.kind } : null; repaint(); },
  });
  window.Live.watch('projects/pcconfig', null, { data(d) {
    // 后端 03:45：正式接入时这三组还在 registry 分组下、没有单独的 environment 分组，两种形状都给 data.environment，先读它
    header = d?.environment || d?.sections?.find(s => s.id === 'environment') || null;
    const metrics = d?.sections?.flatMap(s => s.metrics || []) || [];
    for (const [key, section] of Object.entries(resources)) observed[key] = metrics.find(m => m.id === section || m.section === section)?.at;
    repaint();
  } });
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();
