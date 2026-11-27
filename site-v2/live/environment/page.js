(() => {
  'use strict';
  const U = window.LiveUI, L = window.LiveLight, V = window.LiveViz, $ = id => document.getElementById(id), { esc, sp } = U;
  const params = new URLSearchParams(location.search), data = {}, phases = {}, clocks = {}, links = {};
  let header = null, softwareViewer = 'public';
  const offline = () => !!U.offline?.();
  const missing = (label = '', meta) => offline() ? '这块没存下来，连上后补上。' : U.collectionText(label, meta);
  const resources = { software: 'software', runtime: 'runtimes', startup: 'startup' }, observed = {};
  const recordResource = (key, cursor) => params.has('fixture') ? `projects/pcconfig/records-${resources[key]}${cursor ? '-2' : ''}` : 'projects/pcconfig/records';
  const names = { software: '软件版本', runtime: '命令环境', startup: '开机启动' };
  const pictures = { software: '/live/img/grp-long.webp', runtime: '/live/img/grp-machine.webp', startup: '/live/img/tasks.webp' };
  const relations = { equal: '版本相同', behind: '装的版本落后', ahead: '装的版本更新', channel_mismatch: '渠道不同，不能直接比较', unknown: '比不出新旧' };
  const cultures = { 'zh-CN': '简体中文', 'zh-TW': '繁体中文', 'zh-HK': '繁体中文（香港）', 'en-US': '英语（美国）', 'en-GB': '英语（英国）', 'ja-JP': '日语' };
  const sources = { registry_run: '注册表启动项', startup_folder: '启动文件夹', user_startup_folder: '启动文件夹', common_startup_folder: '公共启动文件夹', msi_or_portable: 'MSI 安装或便携版', windows_builtin: 'Windows 自带' };
  const referenceTime = key => offline() ? clocks[key] || window.Live.upTo?.() || observed[key] || data[key]?.at || null : new Date().toISOString();
  const date = (at, key = 'software') => at ? `${U.date(at) === U.date(referenceTime(key) || at) ? '' : U.date(at) + ' '}${U.time(at)}` : U.collectionText();
  const validAt = at => typeof at === 'string' && Number.isFinite(Date.parse(at)) ? at : null;
  const checkedAt = key => {
    const d = data[key];
    const sampled = key === 'software' ? (d?.at_kind === 'sampled' ? d.at : null)
      : Object.hasOwn(d || {}, 'source_at') ? null : d?.at ?? observed[key];
    return [d?.checked_at, d?.source_at, sampled].find(validAt);
  };
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
  const softwareEvery = rows => {
    const s = Number(rows[0]?.refresh_interval_seconds);
    if (!(s > 0) || rows.some(row => Number(row.refresh_interval_seconds) !== s)) return '';
    return s === 604800 ? '每周日 23:30 查一次，没开机就开机后补查' : `每 ${s % 86400 ? `${Math.round(s / 3600)} 小时` : `${s / 86400} 天`}查一次`;
  };
  function encoding(cp) { return cp == null ? null : Number(cp) === 65001 ? 'UTF-8 · 65001' : Number(cp) === 936 ? 'GBK · 936' : Number(cp) === 20127 ? 'ASCII · 20127' : String(cp); }
  const fields = ['console_input_code_page', 'console_output_code_page', 'pipeline_output_code_page', 'dotnet_default_code_page'];
  const commandRows = r => [['powershell_core', 'PowerShell 7'], ['windows_powershell', '系统自带的 Windows PowerShell']].filter(([key]) => r[key]).map(([key, name]) => {
    const p = r[key], risks = fields.filter(k => Number(p[k]) === 20127).length;
    const normal = fields.every(k => Number(p[k]) === 65001);
    return { lamp: indicator(p, risks ? 'yellow' : normal ? 'green' : null), text: `${name}${Number(p.pipeline_output_code_page) === 20127 ? ' 管道里中文可能乱码' : risks ? ' 里有中文可能乱码的编码设置' : normal ? ' 里中文正常' : ' 的中文编码需按明细查看'}` };
  });
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
  const rememberFold = detail => envFolds.set(detail.dataset.envFold, detail.open && !detail.hasAttribute('data-fold-flat'));
  const details = () => [...$('board').querySelectorAll('details[data-env-fold]')].filter(d => !d.closest('.grp--private,.is-unread'));
  // 软件版本表按“要不要你管”分组（本人 11-26 选 ENV1 的 A，照图 ENV-1）：要你点头才更新的、会自动更新但还没更新上的、已是最新的。
  // 分组读后台每行的 update_mode（automatic／owner_approval）和自动项的 last_update；后台还没给 update_mode 时只分“落后／已是最新”，“怎么更新”写还没读到。
  // 已是最新那组：多就先露一部分、点“再看”展开，少就全露（本人补的：默认收起不好，前提是多，现在少不代表以后少）。
  const you = () => softwareViewer === 'owner' ? '你' : '本人';
  const LATEST_FIRST = 5, LATEST_STEP = 10;
  let latestShown = LATEST_FIRST;
  const isBehind = r => compared(r) && r.relation === 'behind', isLatest = r => compared(r) && ['equal', 'ahead'].includes(r.relation);
  // 周检和自动更新是同一个每周任务（PCConfig Governance Check），星期几照它的下次运行时刻写，不写死
  const weekday = at => validAt(at) ? '日一二三四五六'[new Date(Date.parse(at) + 8 * 3600000).getUTCDay()] : '';
  const hasMode = rows => rows.some(r => ['automatic', 'owner_approval'].includes(r.update_mode));
  // 最新版上次是哪天查的：取各行周检时刻里最晚的（“最新版本”那列最旧可能是一周前的）
  const latestAt = (rows, key) => rows.map(r => r[key]).filter(validAt).sort((a, b) => Date.parse(b) - Date.parse(a))[0];
  function versionGroups(rows) {
    const behind = rows.filter(isBehind);
    return [
      { key: 'approval', name: `要${you()}点头才更新`, rows: behind.filter(r => r.update_mode === 'owner_approval') },
      { key: 'auto', name: '会自动更新，还没更新上', rows: behind.filter(r => r.update_mode === 'automatic') },
      { key: 'behind', name: '版本落后', rows: behind.filter(r => !['automatic', 'owner_approval'].includes(r.update_mode)) },
      { key: 'other', name: '没法比新旧', rows: rows.filter(r => !compared(r)) },
      { key: 'latest', name: '已是最新', rows: rows.filter(isLatest) },
    ].filter(g => g.rows.length);
  }
  function updateWay(r) {
    if (r.update_mode === 'owner_approval') return `${you()}说一声，AI 来更新`;
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
  function versionRow(r, group) {
    const now = nowState(r), way = updateWay(r);
    const visibleState = group === 'behind' && now.text === '落后' ? '' : now.text;
    const wayText = esc(way).replace(/^(?:每周[日一二三四五六]自动|(?:你|本人)说一声，)|AI 来更新/g, '<span class="env-nw">$&</span>');
    return `<tr><td title="${value(r.name || r.component_id)}">${value(r.name || r.component_id, 'software', '软件名', r)}</td><td title="${value(r.current_version)}">${r.installed === false ? '没装' : value(r.current_version, 'software', '装的版本', r)}</td><td title="${value(r.target_version)}">${value(r.target_version, 'software', '最新版本', r)}</td><td>${way === '还没读到' ? '<span class="env-missing">还没读到</span>' : wayText}</td><td title="${esc(now.text)}">${visibleState.split('，').map((s, i, all) => `<span class="env-nw">${i || !now.level ? '' : indicator({}, now.level)}${esc(s)}${i < all.length - 1 ? '，' : ''}</span>`).join('')}</td></tr>`;
  }
  function versionTable(rows) {
    const body = versionGroups(rows).map(g => {
      const list = g.key === 'latest' && g.rows.length > LATEST_FIRST + 1 ? g.rows.slice(0, latestShown) : g.rows, left = g.rows.length - list.length;
      const more = left > 0 ? `<tr class="env-more-row"><td colspan="5"><button type="button" class="more" data-latest-more>${left > LATEST_STEP ? `再看 ${LATEST_STEP} 个（还有 ${left} 个）` : `再看剩下 ${left} 个`} ›</button></td></tr>` : '';
      return `<tbody class="env-group" data-group="${g.key}"><tr class="env-group__head"><th colspan="5" scope="rowgroup"><span>${esc(g.name)}</span>${g.key === 'behind' ? '' : ` · ${count(g.rows.length, '个', data.software)}`}</th></tr>${list.map(r => versionRow(r, g.key)).join('')}${more}</tbody>`;
    }).join('');
    return `<table class="env-table env-table--versions"><thead><tr><th>软件</th><th>装的版本</th><th>最新版本</th><th>怎么更新</th><th>现在</th></tr></thead>${body}</table>`;
  }
  function limitedRows(rows, render, key) {
    return render(rows.slice(0, 5)) + (rows.length > 5 ? `<details class="env-details" data-fold-count="${rows.length - 5}"${foldAttrs(key)}><summary>展开（还有 ${rows.length - 5} 条）</summary>${render(rows.slice(5))}</details>` : '');
  }
  function software(el) {
    el.innerHTML = '<p class="env-note"></p><div class="env-versions"></div><div data-software-more></div>';
    el.addEventListener('click', e => {
      if (e.target.closest('[data-latest-more]')) { latestShown += LATEST_STEP; if (e.isTrusted) window.Live.markOpened(softwareCard); repaint(); }
    });
    return { set() {
      const d = data.software, rows = list(d);
      const note = el.querySelector('.env-note'), versions = el.querySelector('.env-versions');
      note.hidden = !!rows;
      if (!rows) note.textContent = missing('软件版本', d);
      U.html(versions, !rows ? '' : rows.length ? versionTable(rows) : '<p class="env-note">这一轮没有软件条目</p>');
    } };
  }

  function command(el) {
    return { set() {
      const r = runtime(data.runtime);
      if (!r) { U.html(el, `<p class="env-note">${missing('命令环境', data.runtime)}</p>`); return; }
      const w = r.windows;
      U.html(el, `<p class="env-note">${window.ComputerStat.gap(data.runtime, 'risk') || window.ComputerStat.gap(data.runtime, 'shells') ? ` · ${esc(window.ComputerStat.gap(data.runtime, 'risk') || window.ComputerStat.gap(data.runtime, 'shells'))}` : ''}</p><ul class="env-differences">${commandRows(r).map(x => `<li>${x.lamp}<span>${esc(x.text)}</span></li>`).join('')}</ul><details class="env-details"${foldAttrs('runtime-details')}><summary>版本、来源和编码明细</summary><p class="env-note">Windows 语言 ${cultures[w?.culture] ? esc(cultures[w.culture]) : value(w?.culture, 'runtime')} · ANSI 代码页 ${value(w?.ansi_code_page, 'runtime')} · OEM 代码页 ${value(w?.oem_code_page, 'runtime')}</p><div class="env-runtime">${[['powershell_core', 'PowerShell 7'], ['windows_powershell', 'Windows PowerShell']].map(([key, name]) => {
        const p = r[key];
        return `<section><p>${name} ${value(p?.version, 'runtime')}</p><dl>${[['来源', sources[p?.install_source] || p?.install_source || (p && key === 'windows_powershell' ? 'Windows 自带' : null)], ['输入编码', encoding(p?.console_input_code_page)], ['输出编码', encoding(p?.console_output_code_page)], ['管道编码', encoding(p?.pipeline_output_code_page)], ['.NET 默认编码', encoding(p?.dotnet_default_code_page)]].map(([label, v]) => `<dt>${label}</dt><dd>${value(v, 'runtime')}</dd>`).join('')}</dl></section>`;
      }).join('')}</div></details>`);
    } };
  }
  function source(r) {
    if (sources[r.source_location]) return sources[r.source_location];
    if (r.source === 'registry_run') return String(r.source_location || '').startsWith('HKCU') ? '当前用户的注册表启动项' : String(r.source_location || '').startsWith('HKLM') ? '整台电脑的注册表启动项' : '注册表启动项';
    if (r.source === 'startup_folder') return String(r.source_location || '').includes('Users') ? '当前用户启动文件夹' : '启动文件夹';
    return sources[r.source] || r.source;
  }
  function startupRows(rows) {
    return `<ul class="env-startup">${rows.map(r => `<li><span class="env-program">${value(r.name, 'startup')}</span><span title="${value(r.source_location, 'startup')}">${value(source(r), 'startup')}</span><span>${esc(r.state_text || ({ enabled: '启用', disabled: '停用', true: '启用', false: '停用' })[r.enabled] || U.collectionText('启停状态', r))}</span><details class="env-path"${foldAttrs('startup-path-' + JSON.stringify([r.id ?? r.name, r.source, r.source_location]))}><summary>来源位置</summary><span class="env-path-text">${value(sources[r.source_location] || r.source_location, 'startup')}</span></details></li>`).join('')}</ul>`;
  }
  function startupGroups(rows) {
    const groups = new Map(), labels = { enabled: '启用', disabled: '停用', unknown: '启停状态未知' };
    for (const r of rows) { const state = r.enabled ?? r.state, key = state === true || state === 'enabled' ? 'enabled' : state === false || state === 'disabled' ? 'disabled' : state || 'unknown'; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(r); }
    return [...groups].map(([key, items]) => `<p class="env-note">${esc(labels[key] || items[0].state_label || items[0].state_name || key)} · ${items.length} 项</p>${limitedRows(items, startupRows, `startup-${key}`)}`).join('');
  }
  function startup(el) {
    return { set() {
      const d = data.startup;
      if (!d?.items) { U.html(el, `<p class="env-note">${missing('开机启动', d)}</p>`); return; }
      const gap = window.ComputerStat.gap(d, 'total');
      U.html(el, `<p class="env-note">${gap ? `${esc(gap)} · ` : ''}这里列出注册表和启动文件夹里的启动项。<a href="/live/tasks/">查看计划任务 ›</a></p><details class="env-details"${foldAttrs('startup-details')}><summary>查看开机启动明细</summary>${startupGroups(d.items)}</details>`);
    } };
  }
  const chapters = { software, runtime: command, startup };
  const loading = new Set();
  const softwareCard = 'card/environment/software';
  $('board').addEventListener('toggle', e => {
    if (e.target.matches('details[data-env-fold]')) rememberFold(e.target);
  }, true);
  function moreRecords(el, key) {
    el.querySelector('[data-more-records]')?.remove();
    if (!data[key]?.next) return;
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'more'; btn.dataset.moreRecords = key; btn.dataset.needsPc = '';
    const left = data[key].total == null ? null : data[key].total - data[key].items.length;
    btn.textContent = left > 0 ? `还有 ${count(left, '个', data[key])} ›` : `继续看${names[key]} ›`; (el.querySelector('[data-software-more]') || el).append(btn);
    btn.addEventListener('click', async event => {
      if (offline() || loading.has(key)) return;
      const current = data[key], label = btn.textContent;
      loading.add(key); btn.disabled = true; btn.textContent = '正在读…';
      try { const s = await window.Live.get(recordResource(key, current.next), { section: resources[key], cursor: current.next }, key === 'software' && event.isTrusted ? softwareCard : undefined);
        if (data[key] !== current) return;
        if (s.data) { data[key] = { ...current, ...s.data, items: [...current.items, ...(s.data.items || [])] }; repaint(); }
        else btn.textContent = "下一页暂时读不到，再试一次 ›";
      } finally { loading.delete(key); btn.disabled = false; if (btn.textContent === '正在读…') btn.textContent = label; }
      if (key !== 'software' && data[key]?.next && el.querySelector('.env-details')?.open && !btn.isConnected) el.querySelector('[data-more-records]')?.click();
    });
  }
  function group(key) {
    const d = data[key], waiting = !d && !['none', 'gone'].includes(phases[key]), rows = list(d), r = runtime(d);
    let line = missing(names[key], d);
    let figures = key === 'software' ? [{ key: 'total', label: '软件', unit: '个' }, { key: 'behind', label: '版本落后', unit: '个' }] : key === 'runtime' ? [{ key: 'risk', label: '可能乱码', unit: '处' }, { key: 'shells', label: '命令环境', unit: '套' }] : [{ key: 'enabled', label: '启用', unit: '项' }, { key: 'disabled', label: '停用', unit: '项' }];
    // 标题下写多久查一次（照图 ENV-1／ENV-3）：装的版本每天夜里本机实测（current_refresh_seconds=86400），最新版跟每周的周检，星期几和下次几号照周检任务的下次运行；
    // 后台还没给这几项时照旧写“几号查的 · 每周日 23:30 查一次”
    if (key === 'software' && rows) {
      const next = rows.find(x => validAt(x.target_next_run_at))?.target_next_run_at, w = weekday(next);
      const dailyRows = rows.filter(x => Number(x.current_refresh_seconds) === 86400);
      const installed = latestAt(dailyRows, 'current_observed_at'), latest = latestAt(rows, 'target_observed_at');
      const when = at => `${U.date(at)} ${U.time(at)}`;
      if (installed && latest && w === '日' && U.time(next) === '23:30') {
        line = `装的版本每天看一次（${when(installed)}）；官网最新版每周日 23:30 查一次，没开机就开机后补查（上次 ${when(latest)}）`;
      } else if (w && dailyRows.length) {
        line = `装的版本每天夜里查 · 最新版每周${w} ${U.time(next)} 查（错过了开机补查），${latest ? `上次 ${when(latest)}，` : ''}下次 ${U.date(next)}`;
      } else line = [snapshot(checkedAt('software'), 'software'), softwareEvery(rows)].filter(Boolean).join(' · ');
      figures = [];
    }
    if (key === 'runtime' && r) { line = snapshot(checkedAt('runtime'), 'runtime'); figures = []; }
    if (key === 'startup' && d?.items) { const enabled = d.items.filter(r => r.enabled === 'enabled' || r.enabled === true).length, disabled = d.items.filter(r => r.enabled === 'disabled' || r.enabled === false).length; line = [snapshot(checkedAt('startup'), 'startup'), count(d.total, '项', d), ['yellow', 'red'].includes(d.level) ? sp(d.why || d.reason) : ''].filter(Boolean).join(' · '); figures = [{ ...figures[0], text: count(enabled, '项', d, 'enabled') }, { ...figures[1], text: count(disabled, '项', d, 'disabled') }]; }
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
    hero.classList.toggle('is-unread', !offline() && !rows && Object.keys(phases).length === 3 && Object.values(phases).every(p => ['none', 'gone', 'ready'].includes(p)));
    // 页顶大字先说有几个要你点头才更新，小字说其余的（照图 ENV-1）；后台还没给 update_mode 时照旧写“几个软件 · 几个版本落后”
    if (rows && hasMode(rows)) {
      const n = Object.fromEntries(versionGroups(rows).map(g => [g.key, count(g.rows.length, '个', data.software)]));
      $('note').textContent = [n.auto && `${n.approval ? '另有 ' : ''}${n.auto}会自动更新，还没更新上`, n.behind && `${n.behind}版本落后`, n.latest && `${n.latest}已是最新`, n.other && `${n.other}没法比新旧`].filter(Boolean).join(' · ');
      $('note').hidden = !$('note').textContent;
      U.html($('head'), status.lamp + U.head(n.approval ? `${n.approval}要${you()}点头才更新` : `没有要${you()}点头才更新的软件`, { lamp: false })); heroRead.done();
    } else if (rows) { $('note').textContent = comparisonNote(rows); $('note').hidden = !$('note').textContent; }
    else { $('note').textContent = ''; $('note').hidden = true; }
    if (rows && !hasMode(rows)) { const behind = rows.filter(r => compared(r) && r.relation === 'behind').length, none = rows.length && !rows.some(compared); U.html($('head'), status.lamp + U.head(`${window.ComputerStat.text(data.software.total ?? rows.length, '个', data.software, 'total')}软件 · ${none ? '还没读到版本，没法比新旧' : `${count(behind, '个', data.software, 'behind')}版本落后`}`, { lamp: false })); heroRead.done(); }
    else if (!rows && Object.keys(phases).length === 3 && Object.values(phases).every(p => ['none', 'gone', 'ready'].includes(p))) { U.html($('head'), status.lamp + U.head(offline() ? '软件与环境' : '软件与环境暂时读不到', { lamp: false })); heroRead.done(); }
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
    data(d, meta) { if (key === 'software') softwareViewer = meta?.viewer?.kind || 'public'; data[key] = d; clocks[key] = d && validAt(meta?.at); if (d) boards[key].data({ series: [] }); repaint(); },
    link(s) { links[key] = s; if (key === 'software') { bar?.set(s); L.offline(s.offline); repaint(); U.list($('notices'), s.offline ? [{ key: 'offline', cls: 'notice glass', html: `<span class="lamp" aria-hidden="true"></span><span>${esc(sp(s.text))}</span>` }] : []); } else if (s.offline) repaint(); else updateNotes(); },
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
