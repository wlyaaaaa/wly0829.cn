(() => {
  'use strict';
  const U = window.LiveUI, L = window.LiveLight, V = window.LiveViz, $ = id => document.getElementById(id), { esc, sp } = U;
  const params = new URLSearchParams(location.search), data = {}, phases = {}, clocks = {}, links = {};
  let header = null;
  const offline = () => !!U.offline?.();
  const missing = (label = '', meta) => offline() ? '这块没存下来，连上后补上。' : U.collectionText(label, meta);
  const resources = { software: 'software', runtime: 'runtimes', startup: 'startup' }, observed = {};
  const recordResource = (key, cursor) => params.has('fixture') ? `projects/pcconfig/records-${resources[key]}${cursor ? '-2' : ''}` : 'projects/pcconfig/records';
  const names = { software: '软件版本', runtime: '命令环境', startup: '开机启动' };
  const pictures = { software: '/live/img/grp-long.webp', runtime: '/live/img/grp-machine.webp', startup: '/live/img/tasks.webp' };
  const relations = { equal: '版本相同', behind: '装的版本落后', ahead: '装的版本更新', channel_mismatch: '渠道不同，不能直接比较', unknown: '比不出新旧' };
  const channels = { latest: '最新版', stable: '稳定版', current: '测试版', portable: '便携版', 'beta / stable': '测试版 / 稳定版' };
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
  const warn = r => !['equal', 'ahead'].includes(r);
  const count = (n, unit, meta, key = 'total') => window.ComputerStat.text(n, unit, meta, key);
  const indicator = (row, level) => U.status({
    ...row, level: level && (!row.level || ['green', 'ok'].includes(row.level)) ? level : row.level,
  }, { small: true }).lamp;
  function snapshot(at, key) {
    if (!at) return offline() ? '' : U.collectionText('快照日期', data[key]);
    const days = Math.max(0, Math.floor((Date.parse(offline() ? referenceTime(key) || at : new Date().toISOString()) - Date.parse(at)) / 86400000));
    return `${U.isStale(data[key]) ? '上次 ' : ''}${U.date(at)} ${U.time(at)} 查的${days > 7 ? `（${days} 天前）` : ''}`;
  }
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
  function softwareTable(rows, cardLamp) {
    const body = rows.map(r => {
      const result = relations[r.relation] || r.state_text || relations.unknown;
      const lamp = cardLamp ? '' : indicator(r, r.relation === 'behind' ? 'yellow' : null);
      return `<tr><td title="${value(r.name || r.component_id)}">${value(r.name || r.component_id, 'software', '软件名', r)}</td><td title="${value(r.current_version)}">${r.installed === false ? '没装' : value(r.current_version, 'software', '装的版本', r)}</td><td title="${value(r.target_version)}">${value(r.target_version, 'software', '上次查到的版本', r)}</td><td title="${value(channels[r.channel] || r.channel)}">${value(channels[r.channel] || r.channel, 'software', '渠道', r)}</td><td title="${esc(result + (r.unknown_text ? ` · ${sp(r.unknown_text)}` : ''))}">${lamp}${esc(result)}${r.unknown_text ? `<small style="font-size:12px"> · ${value(r.unknown_text)}</small>` : ''}</td></tr>`;
    }).join('');
    return `<table class="env-table"><thead><tr><th>软件</th><th>装的版本</th><th>上次查到的版本</th><th>渠道</th><th>比较结果</th></tr></thead><tbody>${body}</tbody></table>`;
  }
  const envFolds = new Map();
  const foldAttrs = key => ` data-env-fold="${esc(key)}"${envFolds.get(key) ? ' open' : ''}`;
  const rememberFold = detail => envFolds.set(detail.dataset.envFold, detail.open);
  const details = () => [...$('board').querySelectorAll('details[data-env-fold]')].filter(d => !d.closest('.grp--private,.is-unread'));
  function limitedRows(rows, render, key) {
    return render(rows.slice(0, 5)) + (rows.length > 5 ? `<details class="env-details"${foldAttrs(key)}><summary>展开（还有 ${rows.length - 5} 条）</summary>${render(rows.slice(5))}</details>` : '');
  }
  function softwareGroups(rows, cardLamp) {
    const groups = new Map();
    for (const r of rows) { const key = r.relation || 'unknown'; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(r); }
    const render = items => softwareTable(items, cardLamp);
    return [...groups].map(([key, items]) => `<p class="env-note">${esc(relations[key] || items[0].relation_label || items[0].relation_name || key)} · ${items.length} 个</p>${key === 'behind' ? render(items) : limitedRows(items, render, `software-${key}`)}`).join('');
  }
  function software(el) {
    el.innerHTML = '<p class="env-note"></p><div class="env-warnings"></div><div class="env-normal"></div>';
    return { set() {
      const d = data.software, rows = list(d);
      const note = el.querySelector('.env-note'), warnings = el.querySelector('.env-warnings'), normal = el.querySelector('.env-normal');
      note.hidden = !!rows;
      if (!rows) { note.textContent = missing('软件版本', d); warnings.hidden = true; U.html(warnings, ''); U.html(normal, ''); return; }
      const bad = rows.filter(r => warn(r.relation)).sort((a, b) => (a.relation === 'behind' ? -1 : 0) - (b.relation === 'behind' ? -1 : 0)), good = rows.filter(r => !warn(r.relation));
      const cardLamp = U.status(d, { small: true }).lamp;
      warnings.hidden = !bad.length;
      U.html(warnings, softwareGroups(bad, cardLamp));
      const remaining = (d.total ?? rows.length) - bad.length;
      U.html(normal, remaining ? `<details class="env-details"${foldAttrs('software-more')}><summary>另外 ${count(remaining, '个', d)}软件</summary>${softwareGroups(good, cardLamp)}<div data-software-more></div></details>` : !rows.length ? '<p class="env-note">这一轮没有软件条目</p>' : '');
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
  const softwareCard = 'card/environment/software', softwareClicks = new WeakMap(), softwareReads = new WeakSet();
  $('board').addEventListener('click', e => {
    const detail = e.target.closest('.env-normal > details > summary')?.parentElement;
    if (e.isTrusted && detail && !detail.open) softwareClicks.set(detail, e);
  }, true);
  $('board').addEventListener('toggle', e => {
    const detail = e.target;
    if (!detail.matches('details[data-env-fold]')) return;
    rememberFold(detail);
    if (!detail.matches('.env-normal > details')) return;
    const click = softwareClicks.get(detail);
    softwareClicks.delete(detail);
    if (!detail.open) return;
    const btn = detail.querySelector('[data-more-records]');
    const opened = click && !click.defaultPrevented;
    if (opened) {
      if (!btn || btn.disabled || offline() || loading.has('software')) window.Live.markOpened(softwareCard);
      else softwareReads.add(btn);
    }
    btn?.click();
    if (btn) softwareReads.delete(btn);
  }, true);
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
      try { const s = await window.Live.get(recordResource(key, current.next), { section: resources[key], cursor: current.next }, softwareReads.has(btn) ? softwareCard : undefined);
        if (data[key] !== current) return;
        if (s.data) { data[key] = { ...current, ...s.data, items: [...current.items, ...(s.data.items || [])] }; repaint(); }
        else btn.textContent = "下一页暂时读不到，再试一次 ›";
      } finally { loading.delete(key); btn.disabled = false; if (btn.textContent === '正在读…') btn.textContent = label; }
      const fold = key === 'software' ? '.env-normal > details' : '.env-details';
      if (data[key]?.next && el.querySelector(fold)?.open && !btn.isConnected) el.querySelector('[data-more-records]')?.click();
    });
  }
  function group(key) {
    const d = data[key], waiting = !d && !['none', 'gone'].includes(phases[key]), rows = list(d), r = runtime(d);
    let line = missing(names[key], d);
    let figures = key === 'software' ? [{ key: 'total', label: '软件', unit: '个' }, { key: 'behind', label: '版本落后', unit: '个' }] : key === 'runtime' ? [{ key: 'risk', label: '可能乱码', unit: '处' }, { key: 'shells', label: '命令环境', unit: '套' }] : [{ key: 'enabled', label: '启用', unit: '项' }, { key: 'disabled', label: '停用', unit: '项' }];
    if (key === 'software' && rows) {
      line = snapshot(checkedAt('software'), 'software');
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
    $('note').textContent = rows ? comparisonNote(rows) : ''; $('note').hidden = !$('note').textContent;
    if (rows) { const behind = rows.filter(r => compared(r) && r.relation === 'behind').length, none = rows.length && !rows.some(compared); U.html($('head'), status.lamp + U.head(`${window.ComputerStat.text(data.software.total ?? rows.length, '个', data.software, 'total')}软件 · ${none ? '还没读到版本，没法比新旧' : `${count(behind, '个', data.software, 'behind')}版本落后`}`, { lamp: false })); heroRead.done(); }
    else if (Object.keys(phases).length === 3 && Object.values(phases).every(p => ['none', 'gone', 'ready'].includes(p))) { U.html($('head'), status.lamp + U.head(offline() ? '软件与环境' : '软件与环境暂时读不到', { lamp: false })); heroRead.done(); }
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
  window.Live.watch('projects/pcconfig', null, { data(d) {
    // 后端 03:45：正式接入时这三组还在 registry 分组下、没有单独的 environment 分组，两种形状都给 data.environment，先读它
    header = d?.environment || d?.sections?.find(s => s.id === 'environment') || null;
    const metrics = d?.sections?.flatMap(s => s.metrics || []) || [];
    for (const [key, section] of Object.entries(resources)) observed[key] = metrics.find(m => m.id === section || m.section === section)?.at;
    repaint();
  } });
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();
