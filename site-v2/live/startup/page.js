(() => {
  'use strict';
  // 自启动页（本人 11-26 02:12 选的图 BOOT2）：页顶总数和这次开机、最要紧的几项、其余三组点开分批看、变化记录。
  // 数都读 projects/pcconfig/records 的 startup_* 几段；本人版和访客版同一个页面、同一套读口。
  const U = window.LiveUI, L = window.LiveLight, $ = id => document.getElementById(id), { esc, sp } = U;
  const params = new URLSearchParams(location.search), RESOURCE = 'projects/pcconfig/records';
  const sections = { summary: 'startup_summary', own: 'startup_own', windows: 'startup_windows', other: 'startup_other', changes: 'startup_changes' };
  const recordResource = (key, cursor) => params.has('fixture') ? `${RESOURCE}-${sections[key]}${cursor ? '-2' : ''}` : RESOURCE;
  const data = {}, phases = {}, links = {}, loading = new Set();
  const offline = () => !!U.offline?.();
  const GROUPS = [['own', '我们管的'], ['windows', 'Windows 自带'], ['other', '其他软件']];
  const SOURCES = { scheduled_task: '计划任务', registry_run: '注册表', registry_run_once: '注册表（只跑一次）', startup_folder: '启动文件夹',
    packaged_app: '应用自己的开机设置', service: '服务', driver: '驱动' };
  const TRIGGERS = { boot: '开机时', logon: '登录时', boot_logon: '开机和登录时' };
  const SETTINGS = { enabled: '启用', disabled: '停用', mixed: '部分启用', unknown: '不清楚' };
  // 后台按哪种证据认的“这次起来了”：任务被开机或登录触发、服务在跑、驱动已载入、开机后见到进程（只说明开机后跑过）
  const EVIDENCE = [[/启动失败/, '启动失败'], [/触发/, '起来了'], [/服务/, '服务在跑'], [/驱动/, '驱动已载入'], [/进程/, '见到在跑']];
  const CHANGES = { added: '新加', removed: '删掉', enabled: '启用', disabled: '停用' };
  const FIRST_CHANGES = 10;
  const num = v => typeof v === 'number' && Number.isFinite(v);
  const valid = at => typeof at === 'string' && Number.isFinite(Date.parse(at));
  const stamp = at => valid(at) ? `${U.date(at)} ${U.time(at)}` : '';
  const summary = () => Array.isArray(data.summary?.items) ? data.summary.items[0] || null : null;
  const sourcesOf = r => Array.isArray(r?.sources) && r.sources.length ? r.sources : [{ source: r?.source, trigger: r?.trigger, enabled: r?.enabled, launch_text: r?.launch_text, launch_at: r?.launch_at }];
  const enabledAny = r => r.enabled === 'enabled' || sourcesOf(r).some(s => s.enabled === 'enabled');
  const failed = r => r.launch_state === 'failed' || r.attention === true;
  const unconfirmed = r => !failed(r) && r.launch_state !== 'observed' && enabledAny(r);
  const rank = r => failed(r) ? 0 : unconfirmed(r) ? 1 : 2;
  // 名字照后台分组列表的排法（不分大小写、按字符），和下面三组的顺序一致
  const nameKey = r => sp(r.name || r.raw_name || '').toLowerCase();
  const byName = (a, b) => rank(a) - rank(b) || (nameKey(a) < nameKey(b) ? -1 : nameKey(a) > nameKey(b) ? 1 : 0);

  // —— 一行：软件、从哪自启、设了自启、这次开机 ——
  function from(r) {
    const list = sourcesOf(r), mixed = new Set(list.map(s => s.enabled)).size > 1;
    const parts = list.map(s => [SOURCES[s.source] || sp(s.source || ''), TRIGGERS[s.trigger]].filter(Boolean).join(' · ') + (mixed && SETTINGS[s.enabled] ? `（${SETTINGS[s.enabled]}）` : ''));
    return [...new Set(parts.filter(Boolean))].join('、') || '没读到从哪自启';
  }
  function now(r, bootAt) {
    const list = sourcesOf(r);
    const clock = at => valid(at) ? (valid(bootAt) && U.date(at) !== U.date(bootAt) ? stamp(at) : U.time(at)) : '';
    const said = list.map(s => s.launch_text).filter(Boolean);
    if (failed(r)) {
      const bad = list.find(s => /失败/.test(s.launch_text || '')) || r;
      return { tone: 'red', cls: 'bad', text: [clock(bad.launch_at || r.launch_at), '启动失败'].filter(Boolean).join(' '), title: said.join('；') };
    }
    if (r.launch_state === 'observed') {
      const proof = list.find(s => valid(s.launch_at) && s.launch_at === r.launch_at) || list.find(s => s.launch_text && !/未取得/.test(s.launch_text));
      const word = EVIDENCE.find(([re]) => re.test(proof?.launch_text || r.launch_text || ''))?.[1] || '起来了';
      return { tone: 'green', cls: 'ok', text: [clock(r.launch_at), word].filter(Boolean).join(' '), title: said.join('；') };
    }
    if (enabledAny(r)) return { tone: 'amber', cls: 'wait', text: '这次没确认', title: said.join('；') || '这次开机没找到它启动过的证据' };
    return { tone: '', cls: 'none', text: '—', title: '设成停用，这次不该自己启动' };
  }
  function row(r, bootAt) {
    const n = now(r, bootAt), raw = [...new Set(sourcesOf(r).map(s => s.raw_name).filter(Boolean))].join('\n');
    const set = SETTINGS[r.enabled] || sp(r.state_text || '') || '不清楚';
    return `<div class="su-row"><span class="su-name"${raw ? ` title="${esc(raw)}"` : ''}>${esc(sp(r.name || r.raw_name || '没有名字'))}</span>` +
      `<span class="su-from">${esc(from(r))}</span><span class="su-set${r.enabled === 'disabled' ? ' su-set--off' : ''}">${esc(set)}</span>` +
      `<span class="su-now su-now--${n.cls}"${n.title ? ` title="${esc(n.title)}"` : ''}>${n.tone ? `<span class="lamp lamp--sm" data-tone="${n.tone}" aria-hidden="true"></span>` : ''}<span>${esc(n.text)}</span></span></div>`;
  }
  // “这次开机”那一列几种说法是什么意思（本人要页面上讲清机制，M928）：后台按哪种证据认的照实写
  const LEGEND = '<p class="su-say su-legend">“这次开机”那一列：“起来了”是开机或登录时真把它拉起来了；“见到在跑”“服务在跑”“驱动已载入”只说明这次开机后它在跑；“这次没确认”是设了启用、这次没找到它启动过的证据。</p>';
  const cols = '<div class="su-cols" aria-hidden="true"><span>软件</span><span>从哪自启</span><span>设了自启</span><span>这次开机</span></div>';
  const say = text => `<p class="su-say">${esc(text)}</p>`;

  // —— 读数没到：照全站的写法（在读起雾、连不上写没存下来）；后台还没给这几段时写“还没读到” ——
  const reads = {
    hero: U.reading($('hero').querySelector('.card__body'), { ghost: U.ghost.card(2), name: '自启动' }),
    // 三张卡的标题一直露着（data-keep），连不上时雾里不再重复写名字
    important: U.reading($('important-body'), { ghost: U.ghost.rows(3) }),
    groups: U.reading($('groups-body'), { ghost: U.ghost.rows(2) }),
    changes: U.reading($('changes-body'), { ghost: U.ghost.rows(2) }),
  };
  const readsOf = key => key === 'summary' ? [reads.hero, reads.important, reads.groups] : key === 'changes' ? [reads.changes] : [];

  // —— 页顶大卡 ——
  function paintHero(s) {
    if (!s) {
      const gone = offline() && phases.summary === 'gone';
      if (phases.summary === 'none' || gone) {
        U.html($('head'), '<span class="head__lead">开机自启动</span>');
        $('checked').textContent = gone ? '这块没存下来，连上后补上。' : '还没读到。每天零点后查一次，读到后自动显示。'; $('checked').hidden = false; $('figs').hidden = true;
      }
      return;
    }
    U.html($('head'), `<span class="head__lead">${num(s.total) ? `${s.total} 项开机自启动` : '开机自启动'}</span>${valid(s.boot_at) ? `<span class="head__tail">这次开机 ${esc(stamp(s.boot_at))}</span>` : ''}`);
    const age = valid(s.checked_at) ? (Date.now() - Date.parse(s.checked_at)) / 86400000 : 0;
    U.html($('checked'), ['每天零点后查一次', valid(s.checked_at) ? `上次 ${esc(stamp(s.checked_at))} 查完${age > 1.5 ? `<span class="su-old">（${Math.floor(age)} 天没查了）</span>` : ''}` : '还没查过', '当天开机会当场补查'].join(' · '));
    $('checked').hidden = false;
    const fig = (key, label, v) => `<div data-fig="${key}"><dt>${label}</dt><dd>${num(v) ? `<b>${v}</b><small>项</small>` : '<small>还没读到</small>'}</dd></div>`;
    // 启动失败单列一格、红字，只在后台给的 failed 大于 0 时出；这时“这次没确认”已不含失败的，四格加起来等于总数
    U.html($('figs'), fig('observed', '这次起来了', s.observed) + fig('disabled', '停用', s.disabled) + fig('unconfirmed', '这次没确认', num(s.unconfirmed) ? s.unconfirmed : s.enabled_unconfirmed)
      + (num(s.failed) && s.failed > 0 ? fig('failed', '启动失败', s.failed) : ''));
    $('figs').hidden = false;
  }

  // —— 最要紧的：我们管的 + 你常用的；默认只露几条（后台建议几条就几条，没给就 5 条），有毛病的一定露出来 ——
  let importantOpen = false;
  function paintImportant(s) {
    const box = $('important-box');
    if (!s) {
      $('important-title').textContent = '最要紧的';
      if (phases.summary === 'none') U.html(box, say('最要紧的那几项还没读到。'));
      else if (offline() && phases.summary === 'gone') U.html(box, '');
      return;
    }
    const imp = s.important && typeof s.important === 'object' ? s.important : null;
    if (!imp) { $('important-title').textContent = '最要紧的'; U.html(box, say('最要紧的那几项还没读到。')); return; }
    const bands = [['own', '我们管的'], ['common', '你常用的']].map(([key, label]) => ({ key, label, rows: (Array.isArray(imp[key]) ? imp[key] : []).slice().sort(byName) })).filter(b => b.rows.length);
    const total = bands.reduce((n, b) => n + b.rows.length, 0);
    $('important-title').textContent = `最要紧的 ${total} 项`;
    if (!total) { U.html(box, say('还没有标成要紧的自启动。')); return; }
    const budget = Number.isInteger(s.important_default_count) && s.important_default_count > 0 ? s.important_default_count : 5;
    const shown = bands.map(b => b.rows.filter(r => rank(r) < 2).length);
    let left = budget - shown.reduce((a, b) => a + b, 0);
    while (left > 0 && bands.some((b, i) => shown[i] < b.rows.length)) bands.forEach((b, i) => { if (left > 0 && shown[i] < b.rows.length) { shown[i]++; left--; } });
    const hidden = total - shown.reduce((a, b) => a + b, 0);
    const counts = [imp.own?.length ? `我们管的 ${imp.own.length} 件` : '', imp.common?.length ? `你近 7 天常用的 ${imp.common.length} 个` : ''].filter(Boolean).join(' + ');
    const open = importantOpen && hidden > 0;
    const fold = rows => rows.length ? `<div class="fold${open ? ' is-open' : ''}" data-more aria-hidden="${!open}"${open ? '' : ' inert'}><div>${rows.map(r => row(r, s.boot_at)).join('')}</div></div>` : '';
    U.html(box, `<p class="su-sub">${esc(counts)} · 没起来或有毛病的排前面，其余按名字。</p>${cols}` +
      bands.map((b, i) => `<div class="su-band"><b>${b.label}</b> · ${b.rows.length}</div>${b.rows.slice(0, shown[i]).map(r => row(r, s.boot_at)).join('')}${fold(b.rows.slice(shown[i]))}`).join('') +
      (hidden ? `<div class="su-foot"><button class="more su-pill" type="button" data-toggle aria-expanded="${open}">${open ? '收起 ›' : `再看 ${hidden} 项 ›`}</button></div>` : '') + LEGEND);
  }
  $('important-box').addEventListener('click', e => {
    const btn = e.target.closest('[data-toggle]');
    if (!btn) return;
    importantOpen = btn.getAttribute('aria-expanded') !== 'true';
    for (const f of $('important-box').querySelectorAll('[data-more]')) { f.classList.toggle('is-open', importantOpen); f.inert = !importantOpen; f.setAttribute('aria-hidden', String(!importantOpen)); }
    btn.setAttribute('aria-expanded', String(importantOpen));
    btn.textContent = importantOpen ? '收起 ›' : `再看 ${$('important-box').querySelectorAll('[data-more] .su-row').length} 项 ›`;
  });

  // —— 其余三组：一组一条；点开先看一页（后台每页 25 条），每点一次多看一页，用回包的 next 往下取，一直能看到底 ——
  const groupEls = {};
  function groupEl(key, label) {
    if (groupEls[key]) return groupEls[key];
    const el = document.createElement('div');
    el.className = 'su-group'; el.dataset.group = key;
    el.innerHTML = `<button class="su-bar" type="button" aria-expanded="false" aria-controls="group-${key}"><b>${esc(label)}</b><span class="su-bar__n"></span><span class="su-bar__state"></span><span class="su-bar__chev" aria-hidden="true">›</span></button><div class="fold" id="group-${key}"><div class="su-list"></div></div>`;
    const bar = el.querySelector('.su-bar'), box = el.querySelector('.fold');
    U.fold(bar, box);
    bar.addEventListener('click', () => { el.classList.toggle('is-open', bar.getAttribute('aria-expanded') === 'true'); paintList(key); });
    el.classList.toggle('is-open', bar.getAttribute('aria-expanded') === 'true');
    return groupEls[key] = el;
  }
  function paintGroups(s) {
    const box = $('groups-box');
    if (!s) {
      $('groups-title').textContent = '其余 · 按来源分组';
      if (phases.summary === 'none') U.html(box, say('分组还没读到。'));
      else if (offline() && phases.summary === 'gone') U.html(box, '');
      return;
    }
    const groups = Array.isArray(s.groups) ? s.groups : null;
    if (!groups) { $('groups-title').textContent = '其余 · 按来源分组'; U.html(box, say('分组还没读到。')); return; }
    const rest = groups.reduce((n, g) => n + (num(g.total) ? g.total : 0), 0), page = pageSize();
    $('groups-title').textContent = `其余 ${rest} 项 · 按来源分组`;
    let wrap = box.querySelector(':scope > .su-groups');
    if (!wrap) { box.innerHTML = `<p class="su-sub"></p><div class="su-groups"></div>`; box._html = undefined; wrap = box.querySelector('.su-groups'); }
    box.querySelector('.su-sub').textContent = `点开一组先看 ${page} 项，每点一次多看 ${page} 项。`;
    for (const [key, label] of GROUPS) {
      const g = groups.find(x => x.id === key);
      if (!g) { groupEls[key]?.remove(); continue; }
      const el = groupEl(key, label);
      if (el.parentElement !== wrap) wrap.append(el);
      el.querySelector('.su-bar__n').textContent = num(g.total) ? ` · ${key === 'own' ? '还有 ' : ''}${g.total} 项` : '';
      const notes = [num(g.attention) && g.attention > 0 ? `<span class="su-bad">${g.attention} 项启动失败</span>` : '',
        num(g.enabled_unconfirmed) && g.enabled_unconfirmed > 0 ? `<span class="su-warn">${g.enabled_unconfirmed} 项这次没确认</span>` : ''].filter(Boolean);
      U.html(el.querySelector('.su-bar__state'), notes.length ? notes.join(' · ') : num(g.enabled_unconfirmed) ? '都正常' : '', false);
      paintList(key);
    }
  }
  const firstPage = {}, pageSize = () => Math.max(0, ...Object.values(firstPage)) || 25;
  function paintList(key) {
    const el = groupEls[key];
    if (!el || el.querySelector('.su-bar').getAttribute('aria-expanded') !== 'true') return;
    const list = el.querySelector('.su-list'), d = data[key], s = summary();
    if (!Array.isArray(d?.items)) {
      U.html(list, say(phases[key] === 'none' ? '这一组还没读到。' : offline() ? '这一组没存下来，连上后补上。' : '正在读…'));
      return;
    }
    const total = num(d.total) ? d.total : d.items.length, left = Math.max(0, total - d.items.length), page = pageSize();
    const more = d.next ? `<div class="su-foot"><button class="more su-pill" type="button" data-next="${key}" data-needs-pc${loading.has(key) ? ' disabled' : ''}>${loading.has(key) ? '正在读…' : list.dataset.failed ? '下一页暂时读不到，再试一次 ›' : left > page ? `再看 ${page} 项 · 还剩 ${left} 项` : `再看剩下的 ${left || page} 项`}</button></div>` : '';
    U.html(list, d.items.length ? cols + d.items.map(r => row(r, s?.boot_at)).join('') + more : say('这一组没有自启动。') + more);
    U.blockNote(list, links[key]);
  }
  $('groups-box').addEventListener('click', async e => {
    const btn = e.target.closest('[data-next]');
    if (!btn) return;
    const key = btn.dataset.next, current = data[key], list = groupEls[key]?.querySelector('.su-list');
    if (!current?.next || loading.has(key) || offline()) return;
    loading.add(key); delete list.dataset.failed; paintList(key);
    try {
      const s = await window.Live.get(recordResource(key, current.next), { section: sections[key], cursor: current.next });
      if (data[key] !== current) return;
      if (Array.isArray(s.data?.items)) data[key] = { ...current, ...s.data, items: [...current.items, ...s.data.items] };
      else list.dataset.failed = '1';
    } finally { loading.delete(key); paintList(key); }
  });

  // —— 变化记录：先摆最近 10 条，每点一次多看 25 条，手里的看完了用 next 接着取；第一次比较没有变化时照实写 ——
  let changesShown = FIRST_CHANGES, changesFailed = false;
  function paintChanges() {
    const box = $('changes-box'), d = data.changes, s = summary();
    const started = s?.history_started_at, items = Array.isArray(d?.items) ? d.items : null;
    if (!items) {
      if (phases.changes === 'none') U.html(box, say('变化记录还没读到。'));
      else if (offline() && phases.changes === 'gone') U.html(box, '');
      return;
    }
    const start = valid(started) ? `<div class="su-change"><time>${esc(stamp(started))}</time><span class="su-tag" data-kind="start">开始记</span><span>${num(s.history_initial_count) ? `当时共 ${s.history_initial_count} 项` : '第一次查，记下当时的样子'}</span></div>` : '';
    const shown = items.slice(0, changesShown), total = num(d.total) ? d.total : items.length, left = Math.max(0, total - shown.length);
    const rows = shown.map(c => `<div class="su-change"><time>${esc(stamp(c.at))}</time><span class="su-tag" data-kind="${esc(c.kind)}">${esc(CHANGES[c.kind] || sp(c.state_text || '变了'))}</span><span>${esc(sp(c.name || '没有名字'))}${SOURCES[c.source] ? `<small>${esc(SOURCES[c.source])}</small>` : ''}</span></div>`).join('');
    const more = left ? `<div class="su-foot"><button class="more su-pill" type="button" data-more-changes${loading.has('changes') ? ' disabled' : ''}>${loading.has('changes') ? '正在读…' : changesFailed ? '下一页暂时读不到，再试一次 ›' : `再看 ${Math.min(25, left)} 条 · 还剩 ${left} 条`}</button></div>` : '';
    const sub = `<p class="su-sub">${valid(started) ? `从 ${esc(stamp(started))} 起记 · ` : ''}只记新加、删掉、启用、停用，时刻是发现的时候。</p>`;
    U.html(box, sub + (items.length ? `<div class="su-changes">${rows}${left ? '' : start}</div>${more}`
      : `<div class="su-changes">${start}</div>${say(valid(started) ? '开始记以后还没发现变化。' : '还没开始记。')}`));
  }
  $('changes-box').addEventListener('click', async e => {
    if (!e.target.closest('[data-more-changes]')) return;
    const current = data.changes;
    changesShown += 25; changesFailed = false;
    if (current?.next && current.items.length < changesShown && !loading.has('changes') && !offline()) {
      loading.add('changes'); paintChanges();
      try {
        const s = await window.Live.get(recordResource('changes', current.next), { section: sections.changes, cursor: current.next });
        if (data.changes === current) {
          if (Array.isArray(s.data?.items)) data.changes = { ...current, ...s.data, items: [...current.items, ...s.data.items] };
          else { changesFailed = true; changesShown -= 25; }
        }
      } finally { loading.delete('changes'); }
    }
    paintChanges();
  });

  // —— 整页 ——
  const hero = $('hero'), cards = [...document.querySelectorAll('.su-card')];
  const bar = U.topbar({ ask: () => '帮我看看电脑的开机自启动：哪些这次没起来、哪些这次没确认、最近有什么变化。' });
  L.add(hero); cards.forEach(c => L.add(c, { defer: true }));
  let lit = false;
  function paint() {
    const s = summary();
    paintHero(s); paintImportant(s); paintGroups(s); paintChanges();
    if (s) [reads.hero, reads.important, reads.groups].forEach(r => r.done());
    if (Array.isArray(data.changes?.items)) reads.changes.done();
    for (const [el, key] of [[hero.querySelector('.card__body'), 'summary'], [$('important-body'), 'summary'], [$('groups-body'), 'summary'], [$('changes-body'), 'changes']]) U.blockNote(el, links[key]);
    if (!lit && Object.keys(data).length) { lit = true; L.lightUp([hero, ...cards]); }
  }
  paint();
  for (const key of Object.keys(sections)) window.Live.watch(recordResource(key), { section: sections[key] }, {
    phase(s) {
      phases[key] = s.phase;
      if (s.data) return;
      for (const r of readsOf(key)) { if (s.phase === 'none') r.done(false); else r.set(s); }
      if (['none', 'gone'].includes(s.phase)) paint();
    },
    data(d) {
      data[key] = d && typeof d === 'object' ? d : undefined;
      if (key === 'changes') { changesShown = FIRST_CHANGES; changesFailed = false; }
      else if (key !== 'summary' && data[key]?.next && Array.isArray(data[key].items) && data[key].items.length) firstPage[key] = data[key].items.length;
      paint();
    },
    link(s) {
      links[key] = s;
      if (key === 'summary') {
        // 后台还没给这几段（回“没有记录”）：页眉也写“还没读到”，不写成读错了
        bar?.set(s.phase === 'none' && !s.data && !s.offline ? { ...s, text: '还没读到' } : s); L.offline(s.offline);
        U.list($('notices'), s.offline ? [{ key: 'offline', cls: 'notice glass', html: `<span class="lamp" aria-hidden="true"></span><span>${esc(sp(s.text))}</span>` }] : []);
        paint();
      } else if (s.offline) paint();
      else if (key === 'changes') U.blockNote($('changes-body'), s);
      else paintList(key);
    },
  });
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();
