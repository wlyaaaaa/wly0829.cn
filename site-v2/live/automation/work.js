(() => {
  'use strict';
  const U = window.LiveUI, Live = window.Live, P = window.AutomationPresentation, { esc } = U;
  const $ = id => document.getElementById(id), root = $('work-queue'), legacy = $('automation-legacy');
  const settings = $('automation-setting'), form = settings.querySelector('form'), back = document.querySelector('[data-back]');
  const params = new URLSearchParams(location.search), type = params.get('type'), work = params.get('work');
  const scope = params.get('project'), detail = work || type;
  // 不带单件、类别、项目直接开这个地址：旧总览已经下线（M611），回新的自动任务页
  if (!detail && !scope) {
    const next = new URL('/live/automation/', location.origin);
    if (params.has('fixture')) next.searchParams.set('fixture', params.get('fixture'));
    location.replace(next.pathname + next.search + location.hash);
    return;
  }
  const segment = encodeURIComponent;
  const resource = work ? `automation/work/${segment(work)}` : type ? `automation/types/${segment(type)}` : 'automation';
  const bar = U.topbar({ ask: () => '请看实况这页的自动任务，说明现在在后台跑什么、在修什么、什么时候再验、要不要我出面。' });
  let legacyStop, state, configuration, busy = false, feedback, didLand = false, category = false;
  const ready = () => requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
  const showLegacy = () => {
    root.hidden = true;
    legacy.hidden = false;
    legacyStop ||= window.LegacyAutomation(bar);
  };
  if (scope && !detail) { showLegacy(); ready(); return; }
  let audience = 'public';
  const list = v => Array.isArray(v) ? v : [];
  const own = () => audience === 'owner' ? '你' : '本人';
  const field = (value, name) => U.fieldHtml(value, { kind: audience, name });
  const words = (...values) => values.filter(Boolean).map(value => field(value)).join(' · ');
  const instant = value => {
    const date = typeof value === 'number' ? new Date(value * 1000) : new Date(value || NaN);
    return Number.isFinite(date.valueOf()) ? date.toISOString() : '';
  };
  const at = value => { const iso = instant(value); return iso ? `${U.date(iso)} ${U.time(iso)}` : ''; };
  const bjDay = iso => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date(iso));
  // 今天的只写几点，别的日子带日期。
  const when = value => {
    const iso = instant(value);
    if (!iso) return '';
    return bjDay(iso) === bjDay(instant(state?.now) || new Date().toISOString()) ? U.time(iso) : `${U.date(iso)} ${U.time(iso)}`;
  };
  const total = n => Number.isInteger(n) && n >= 0 ? n : '—';
  const span = seconds => Number.isFinite(seconds) && seconds >= 0 ? U.minutes(seconds / 60) : '';
  const lamp = (data, small = true) => U.status(data, { small }).lamp;
  const pill = (text, tone) => text ? `<span class="aw-pill" data-tone="${esc(tone)}">${esc(text)}</span>` : '';
  const route = (path, next = {}) => {
    if (typeof path !== 'string' || !path.startsWith('/live/')) return '';
    const url = new URL(path, location.origin);
    for (const [name, value] of Object.entries(next)) if (value != null) url.searchParams.set(name, value);
    if (params.has('fixture')) url.searchParams.set('fixture', params.get('fixture'));
    return url.pathname + url.search + url.hash;
  };
  const overviewHref = route('/live/automation/', { project: scope });
  const typeHref = id => id ? route('/live/automation/', { type: id, project: scope }) : overviewHref;
  const workHref = id => id ? route('/live/automation/', { work: id, project: scope }) : '';
  const link = (href, label, cls = '') => href ? `<a${cls ? ` class="${cls}"` : ''} href="${esc(href)}">${label}</a>` : label;
  // 整行可点、绿箭头靠右。
  const line = (href, body) => href
    ? `<a class="aw-line" href="${esc(href)}"><span class="aw-line__body">${body}</span><span class="aw-chev" aria-hidden="true">›</span></a>`
    : `<span class="aw-line"><span class="aw-line__body">${body}</span></span>`;
  const LOCAL_ICONS = {
    flow: '<circle cx="6" cy="6.5" r="2.3"/><circle cx="18" cy="6.5" r="2.3"/><circle cx="12" cy="17.5" r="2.3"/><path d="M7.4 8.4l3.4 7.2M16.6 8.4l-3.4 7.2M8.3 6.5h7.4"/>',
    link: '<path d="M10.2 13.8a3.9 3.9 0 0 0 5.6 0l2.9-2.9a3.9 3.9 0 0 0-5.6-5.6l-1.1 1.1"/><path d="M13.8 10.2a3.9 3.9 0 0 0-5.6 0l-2.9 2.9a3.9 3.9 0 0 0 5.6 5.6l1.1-1.1"/>',
    doc: '<path d="M7 3.6h6.8l4.2 4.2v12.6H7z"/><path d="M13.6 3.8v4.2h4.2M9.6 12.2h5.8M9.6 15.6h5.8"/>',
  };
  const icon = name => `<span class="lb-card__badge">${LOCAL_ICONS[name] ? `<svg class="lb-ico" viewBox="0 0 24 24" aria-hidden="true">${LOCAL_ICONS[name]}</svg>` : window.LiveBoard.icon(name)}</span>`;
  const panel = (name, body, { id = '', symbol = 'sparkle', extra = '', cls = '' } = {}) =>
    `<section${id ? ` id="${id}"` : ''} class="glass aw-panel${cls ? ` ${cls}` : ''}"><header>${icon(symbol)}<h2>${name}</h2>${extra}</header><div class="aw-body">${body}</div></section>`;
  const empty = text => `<p class="aw-empty">${text}</p>`;
  // 数字格按意思分底色，0 用灰字。
  const stats = values => `<dl class="automation-stats aw-stats">${values.map(([label, count, tone, id]) => {
    const n = total(count), zero = n === 0 || n === '—';
    return `<div data-tone="${zero ? 'zero' : tone}"><dt>${id ? `<a href="#${id}">${label}</a>` : label}</dt><dd>${n}</dd></div>`;
  }).join('')}</dl>`;
  const hero = '/live/img/automation-hero.webp', tea = '/live/automation/art-tea.webp';
  const dossier = '/live/automation/art-work.webp';
  const ART = {
    computer: '/live/automation/types/computer.webp', programs: '/live/automation/types/programs.webp',
    software: '/live/automation/types/software.webp', backup: '/live/automation/types/backup.webp',
    website: '/live/automation/types/website.webp', projects: '/live/automation/types/projects.webp',
    testing: '/live/automation/types/testing.webp', acceptance: '/live/automation/types/acceptance.webp',
    'ai-review': '/live/automation/types/ai-review.webp', 'ai-stalled': '/live/automation/types/ai-stalled.webp',
    rules: '/live/automation/types/rules.webp', materials: '/live/automation/types/materials.webp',
    improvements: '/live/automation/types/improvements.webp',
  };
  const readonly = id => id === 'ai-review' || id === 'ai-stalled';
  const readonlyNote = '<p class="aw-readonly">这一类只显示，不派人修</p>';
  // 每类四句：管、比如、关了、不管（本人审定的原句，备份、软件和工具、规则和技能按定稿第六轮⑤改成白话）。
  const descriptions = {
    'computer': ["硬盘空间突然往下掉，内存守护没压住内存上涨，系统记录里的蓝屏、非正常关机、致命硬件和磁盘错误", "内存守护碰到打不开的进程就整轮停摆 → AI 改成跳过它接着查 → 重载后真跑不再报错才算好", "守护照常报警，页面上看得到，只是没人去查谁在狂写盘、吃内存", "电脑卡顿不派人修，只用来让不急的重活错开"],
    'programs': ["Windows 定时任务跑失败，AI 定时任务跑失败或没按时跑，守护没按时报到", "开机后代理守护退出了 → AI 修好它一碰文件占用就退出的毛病 → 等下次自然开机它自己起来才算好", "失败、停了照样记着、看得到，只是没人去查去修", "备份没有按时跑，归“备份”"],
    'software': ["每周软件检查没过的项、现有网站登录检查发现的失效和工具启动报错", "周检保存时被文案检查挡住，提示里带了程序名 → AI 把程序名挪走 → 之后的周检这项过了才算好", "周检照跑，没过的项照样记着，没人修", "要你本人登录的，挂到“等你的事”等你登"],
    'backup': ["各份备份（个人资料和照片视频、开发配置、微信、电脑使用记录、文档等）报失败或好久没更新；系统镜像的恢复点、恢复包的完整性检查没过", "本地和传云的补跑撞在一起，云那份抢不到锁就退出 → AI 改成排队等 → 换着先后顺序重演都过才算好", "备份照常跑，坏了页面上看得到，但没人修，一直缺着一份", "从备份里真把文件或整台电脑还原回来，这里不做"],
    'website': ["实况打不开、读数出错或停更、访客版露出不该露的字、网站发布失败", "实况时不时把在跑的任务数清零 → 查出名单刚好过期被作废，放宽有效期 → 线上连读多次都齐才算好", "照样记着、看得到，只是没人修，你和访客看到的可能一直是旧数、错数"],
    'projects': ["各项目夜里自动跑的测试没过；冻结的、登记过的已知失败不算", "本地文字识别夜测报失败 → AI 拿样图实际识一遍字能用 → 之后夜测通过才关，原因没查到", "测试红着照样记着，没人查是程序坏了还是测试过时", "规则仓库的夜测归“规则和技能”"],
    'testing': ["规则仓库夜测里超时的分项，交 AI 分清是真坏、电脑忙还是测试过时；还有到期后夜测确认仍失败的已知失败", "夜测里回收临时目录那项超时了 → 递给 AI 分辨；真坏就转去修，测试过时就改测试", "夜测递来的超时分项过一天作废。到期后仍失败的测试留着，没人处理"],
    'acceptance': ["登记里约好日期再看的事到期了，多是以前修完、约好过几天再验的；你自己的事项到期也在这里先办，访客看不到内容", "副屏仪表盘修过几轮，约好隔天看日志 → 到点发现还会整套重启，接着修 → 再查只短暂断屏、自己恢复", "这一类的复查到期没人看，修好没修好一直悬着", "自动任务自己修完等验的，留在原来那一类"],
    'ai-review': ["对话压缩后的复核、Claude 自动验收、Claude 出方案，最近一次跑得怎样", "有一回压缩后复核自己报错、结果文件坏了 → 这里亮黄灯，点开看最近几轮的记录", "", "复核挑出的错交回原对话，验收结论留在原事项，不在这里修"],
    'ai-stalled': ["别的类里放太久没人领的活，和 AI 干着干着没动静、跑太久被收回重排的活，集中到这里给你看", "一件活排了很久没人领，或 AI 干到一半没动静被收回 → 都汇总到这里亮黄灯，一眼看到没人在管", "", "派活程序自己停了不归这里，首页卡直接亮黄灯"],
    'rules': ["规则和技能仓库的夜测没过的项、每周体检和规则复核的结论，还有 AI 递来的规则、技能毛病", "自检把历史汇报的日期目录当断链、把技能简介长短当错 → AI 改了这几项检查 → 隔夜自检这几项过了", "夜测红着没人修，AI 照旧按有毛病的规则和工具干活", "夜测超时的分项归“待测”；AI 定时任务没跑成归“计划任务和后台程序”；每周结论里只是“待关注”的不建活"],
    'materials': ["照片视频的云端维护、手机照片视频收进电脑，跑完报失败或没跑完", "手机照片视频收进电脑那步报失败 → AI 查出原因修好 → 下次自动收取正常结束才算好", "照常整理，坏了没人修，手机里的可能一直没收进电脑", "只是“待关注”的不建活"],
    'improvements': ["AI 和程序递来的毛病、可改进处，别的类不收的都落在这", "网站后台改写程序几次没生成公开说明 → 汇总成一条递来 → AI 核实后并成一件跟进", "递来的照样记下，只是没人判断、没人做", "只是记一笔的、已经恢复的、过期的，不进这里"],
  };
  function control(action, id, label, config = {}) {
    // 后台回话之前开关留在原档，标上 aria-busy；旁边那行写“正在保存…”（message）
    const attrs = (config.checked == null ? '' : ` role="switch" aria-checked="${config.checked}"`) + (feedback?.pending && feedback.id === id ? ' aria-busy="true"' : '');
    const value = config.value == null ? '' : ` data-value="${esc(config.value)}"`;
    return `<button type="button" class="more aw-control ${config.checked == null ? '' : 'aw-switch'}" data-setting="${action}" data-id="${esc(id)}"${attrs}${value}${config.name ? ` aria-label="${esc(config.name)}"` : ''}>${label}</button>`;
  }
  const configFor = t => t.setting || {};
  // 档位跟模型清单走，页面不再能改（本人早先定的）；只照后台给的型号和档位写一句
  const modelText = t => [t.model, t.model_effort || t.default_effort].filter(Boolean).map(esc).join(' · ');
  function toggle(t, compact = false) {
    const config = configFor(t), on = config.mode === 'on';
    const text = on ? '已开' : config.mode === 'paused' ? '暂停中' : config.mode === 'off' ? '已关' : '状态读不到';
    return control('toggle', t.id, compact ? '<span class="aw-sr">' + text + '</span>' : text,
      { checked: on, value: config.mode, name: `${U.fieldText(t.title, audience)} · ${text}` });
  }
  function settingBar(t) {
    const until = when(configFor(t).until_at), model = modelText(t);
    return `<div class="aw-settingbar">${toggle(t)}${control('pause', t.id, until ? `暂停到 ${esc(until)}` : '暂停到…')}${model ? `<span class="aw-type__model">${model}</span>` : ''}</div>`;
  }
  // 后台因为登录过期、额度用完把某几类停下来时（provider_pauses），把原因和开始时间贴到这几类上。
  // 本人这边登录命令只挂在等你的事里，这里链过去；访客只看到原因和时间。
  const pauseFor = (data, id) => list(data.provider_pauses).find(p => list(p.categories).includes(id));
  function pauseText(p) {
    // 后台的 text 自己带了“停着：”开头、也写了几点起：调用处已经写了“停着”，开头去掉；text 里有那个钟点就不再补“· 几点起”。没带的照旧
    const text = String(p.text || '').replace(/^停着[：:，,]\s*/, '');
    const why = esc(text || (p.reason === 'login' ? '登录过期' : '额度用完'));
    const item = audience === 'owner' && p.login_command && route(p.href);
    const clock = instant(p.started_at) && U.time(instant(p.started_at));
    const since = when(p.started_at) && !(!item && text && clock && text.includes(clock)) ? ` · ${when(p.started_at)} 起` : '';
    return (item ? link(item, '登录过期，登录命令在等你的事里') : why) + since;
  }
  const group = (rows, name) => list(rows).filter(row => row.group === name);
  const rowTitle = (row, name = '这件活') => field(row.title, name);
  const chatActivity = row => [row.actual_model, row.actual_effort, at(row.last_activity_at) && `上次动静 ${when(row.last_activity_at)}`, row.helper_activity];
  function workLine(row) {
    const target = route(row.href) || workHref(row.id), note = words(row.state_text, row.group === 'running' && row.attempts > 0 && `第 ${row.attempts} 次修理`,
      row.group === 'done' && row.verified && at(row.changed_at) && `已验 ${when(row.changed_at)}`, ...chatActivity(row));
    return `<li>${line(target, `${lamp(row) || '<i class="aw-nolamp"></i>'}<b>${rowTitle(row)}</b>${note ? `<small>${note}</small>` : ''}`)}</li>`;
  }
  const workRows = (rows, name = '这里没有活') => rows.length
    ? `<ul class="aw-lines">${rows.map(workLine).join('')}</ul>` : empty(name);

  const resultPill = { ok: ['正常', 'ok'], done: ['正常', 'ok'], success: ['正常', 'ok'], warn: ['需留意', 'warn'], failed: ['出错', 'bad'],
    error: ['出错', 'bad'], no_conclusion: ['没结论', 'off'], launched: ['已启动', 'run'], running: ['正在跑', 'run'] };
  const result = status => pill(...(resultPill[status] || []));
  function message(id) {
    let text = feedback?.id === id ? feedback.text : '';
    // 超时、断线以后又读到了新读数：照读数说，不再写“还没确认存上”（开关本身已经照读数显示）
    if (text && feedback.want && feedback.reread) {
      const m = configFor(targetOf(id) || {}).mode;
      text = m === feedback.want ? '已保存' : `最新读数还是${{ on: '开着', off: '关着', paused: '暂停中' }[m] || '没读到'}`;
    }
    return `<p class="row__sub aw-update" role="status"${text ? '' : ' hidden'}>${esc(text)}</p>`;
  }
  function sourceRow(row) {
    const anchor = row.id ? `routine-${row.id}` : '';
    const state_text = resultPill[row.status]?.[0];
    const info = words(row.period || row.trigger, row.at ? `上次 ${when(row.at)}` : row.gap || (!row.at && row.q !== 'ok' && '这里还看不到'),
      Number.isInteger(row.plan_count) ? `写回 ${row.plan_count} 份` : state_text, row.next_at && `下次 ${when(row.next_at)}`);
    return `<li${anchor ? ` id="${esc(anchor)}"` : ''}><b>${lamp(row)}${field(row.label || row.title, '来源名称')}</b><span>${info}</span>${row.purpose ? `<small>${field(row.purpose)}</small>` : ''}</li>`;
  }
  function results(data, rows) {
    const r = data.results7;
    if (!r || typeof r !== 'object') return empty('这里还看不到');
    const now = Date.parse(instant(state?.now)) || Date.now(), dayMs = 86400000;
    const days = Array.from({ length: 7 }, (_, i) => rows.filter(row => {
      const t = Date.parse(row.first_at);
      return t > now - (7 - i) * dayMs && t <= now - (6 - i) * dayMs;
    }).length);
    const fixed = rows.filter(row => row.outcome === 'fixed' && Date.parse(row.outcome_at) > now - 7 * dayMs && Date.parse(row.first_at) <= Date.parse(row.outcome_at));
    const average = fixed.length ? fixed.reduce((sum, row) => sum + (Date.parse(row.outcome_at) - Date.parse(row.first_at)) / 1000, 0) / fixed.length : null;
    const max = Math.max(1, ...days);
    const cols = [['新进', r.new], ['修好', r.fixed], ['没修好', r.not_fixed], ['定了不修', r.wont_fix], ['暂时不修', r.deferred], [`转给${own()}`, r.to_owner]];
    return `<div class="aw-results"><dl>${cols.map(([label, n]) => `<div${n ? '' : ' class="is-zero"'}><dt>${label}</dt><dd>${total(n)}</dd></div>`).join('')}</dl>
      <span class="aw-day-bars" title="近 7 天每天新进的件数" aria-hidden="true">${days.map(n => `<span style="--aw-bar:${Math.max(3, 46 * n / max)}px"></span>`).join('')}</span></div>
      <p class="aw-results__avg">${average != null ? `平均发现到修好 ${span(average)}（${fixed.length} 件）` : '近 7 天还没有修好的，算不出平均修好时长'}</p>`;
  }
  function settingLog(data) {
    const rows = data.setting_log;
    if (!Array.isArray(rows)) return empty('这里还看不到');
    if (!rows.length) return empty('还没改过设置');
    return `<ul class="aw-log">${rows.map(row => `<li><time>${when(row.at)}</time><span>${field(row.text)}</span><small>${words(row.device, row.result)}</small></li>`).join('')}</ul>`;
  }
  function typePage(data) {
    const c = data.counts || {}, rows = list(data.works);
    const [description, example, off, boundary] = descriptions[data.id] || [];
    const readOnly = readonly(data.id);
    const active = rows.filter(row => row.group !== 'done' && row.group !== 'decided');
    const past = rows.filter(row => !active.includes(row));
    const controls = readOnly ? readonlyNote
      : settingBar(data);
    const counters = stats([['在修', c.occupied ?? c.running, 'run'], ['等复查', c.followup, 'queue'], [`要${own()}`, c.owner, 'owner'], ['7 天修好', c.repaired, 'done']]);
    const art = ART[data.id] || hero;
    const head = `<section class="glass aw-hero aw-type-hero"><img alt="" src="${esc(art)}" class="aw-art">
      <div class="aw-lead"><div class="aw-type-top"><h1>${lamp(data, false)}${field(data.title, '类型名称')}</h1><div class="aw-type-settings">${controls}${message(data.id)}</div></div>
      <div class="aw-type-top aw-type-top--lines">${description ? `<p class="aw-covers"><b>管：</b>${esc(description)}</p>` : '<span></span>'}${!readOnly && off ? `<p class="aw-off"><b>关了：</b>${esc(off)}</p>` : ''}</div>
      ${counters}${example ? `<p class="aw-type-example"><span class="aw-example-tag">比如</span><span>${esc(example)}</span></p>` : ''}</div></section>`;
    const work = workRows(active, '这一类现在没有活') + (past.length
      ? `<details class="aw-past"${active.length ? '' : ' open'}><summary class="aw-more-link">看这一类全部 ${rows.length} 件</summary>${workRows(past)}</details>` : '');
    const sources = list(data.sources);
    const lower = `<div class="aw-pair aw-type-pair">${panel('这一类的活', work)}${panel('从哪里发现', sources.length ? `<ul class="aw-sources">${sources.map(sourceRow).join('')}</ul>` : empty('这里还看不到'), { symbol: 'search' })}
      ${panel('结果和趋势 · 近 7 天', results(data, rows), { symbol: 'check', cls: readOnly ? 'aw-wide' : '' })}${readOnly ? '' : panel('设置记录', settingLog(data), { symbol: 'gear' })}</div>`;
    return head + lower + (boundary ? `<p class="glass aw-type-boundary"><b>不管：</b>${esc(boundary)}</p>` : '');
  }
  // 新八类的一页：照类型页的样子摆开关、暂停、型号档位，现在怎样（暂停原因、下次、在等什么），最近几次和设置记录。
  function categoryPage(data, c) {
    const pause = pauseFor(data, c.id), running = c.running === true;
    const now = pause ? `停着，${pauseText(pause)}` : running ? '正在跑'
      : at(c.next_at) ? `下次 ${when(c.next_at)}` : c.waiting_for ? field(c.waiting_for, '在等什么') : '';
    const last = c.last_result && at(c.last_result.at) ? `${when(c.last_result.at)} · ${field(c.last_result.text, '结果')}` : '';
    const controls = c.setting ? settingBar(c) : modelText(c) ? `<p class="aw-type__model">${modelText(c)}</p>` : '';
    const head = `<section class="glass aw-hero aw-type-hero"><img alt="" src="${esc(ART[c.id] || hero)}" class="aw-art">
      <div class="aw-lead"><div class="aw-type-top"><h1>${field(c.title, '类别名称')}</h1><div class="aw-type-settings">${controls}${message(c.id)}</div></div>
      <div class="aw-type-top aw-type-top--lines">${now ? `<p class="aw-covers"><b>现在：</b>${now}</p>` : '<span></span>'}${last ? `<p class="aw-off"><b>上一次：</b>${last}</p>` : ''}</div></div></section>`;
    const runs = !Array.isArray(c.recent_runs) ? empty('这里还看不到') : !c.recent_runs.length ? empty('还没有记录')
      : `<ul class="aw-log">${c.recent_runs.map(run => `<li><time>${when(run.at)}</time><span>${link(route(run.ledger_href), field(run.summary, '这次做了什么'))}</span></li>`).join('')}</ul>`;
    const known = new Set(list(data.types).map(t => t.id));
    const subs = list(c.subcategories).map(t => `<li>${line(known.has(t.id) ? typeHref(t.id) : '', `<b>${field(t.title, '小类')}</b><small>${({ on: '已开', off: '已关', paused: '暂停中' })[t.setting?.mode] || ''}</small>`)}</li>`).join('');
    return head + `<div class="aw-pair aw-type-pair">${panel('最近几次', runs, { symbol: 'check' })}${panel('设置记录', settingLog(c), { symbol: 'gear' })}
      ${subs ? panel('各小类', `<ul class="aw-lines">${subs}</ul>`, { symbol: 'stack', cls: 'aw-wide' }) : ''}</div>`;
  }
  // 后台的英文代号（deferred 这类）一律换成中文；没见过的代号不照抄英文，留空
  const code = value => typeof value === 'string' && /^[a-z][a-z_]*$/.test(value) ? '' : value;
  const verdict = value => ({ fixed: '按原条件验过', not_fixed: '没修好', waiting_verify: '等自然事件验收', deferred: '暂时不修',
    wont_fix: '定了不修', to_owner: `转给${own()}` })[value] || code(value);
  const execution = value => ({ completed: '正常结束', failed: '失败', interrupted: '没跑完' })[value] || verdict(value);
  const facts = rows => list(rows).filter(row => row.text).map(row =>
    `<div><dt>${field(row.label)}</dt><dd>${field(row.text, row.label)}</dd></div>`).join('');
  function rounds(data, row) {
    const events = list(data.rounds), open = !['done', 'decided'].includes(row.group);
    const verification = row.type_id === 'acceptance';
    const step = last => last ? open ? 'is-current' : 'is-latest' : 'is-past';
    const arrival = row.first_at ? `<li class="${step(!events.length)}"><p class="aw-step"><time>${when(row.first_at)}</time><span>发现这件活</span></p></li>` : '';
    const lastLabel = String(events.at(-1)?.label || '');
    const coming = open && !verification ? [...(/验/.test(lastLabel) ? [] : ['独立验收']), '关单'] : [];
    return `<ol class="aw-timeline">${arrival}${events.map((run, i) => {
      const host = run.proof?.host || execution(run.execution);
      const business = run.proof?.business;
      const outcome = verification && run.verdict === 'not_fixed' && (!business || business === '没修好')
        ? '还不能确认' : business || verdict(run.verdict);
      const labels = facts([{ label: '运行结果', text: host }, { label: '这轮交出什么', text: run.deliverable || run.proof?.action },
        { label: verification ? '核实结论' : '原问题验收', text: outcome }, { label: '谁验的', text: run.verified_by }, { label: '结束时间', text: at(run.end_at) },
        ...list(run.facts).filter(fact => !['这轮交付', '验收人'].includes(fact.label))]);
      const latest = i + 1 === events.length;
      return `<li id="round-${esc(run.id)}" class="${step(latest)}">
        <details${latest ? ' open' : ''}><summary class="aw-step"><time>${when(run.at)}</time><span>${words(run.label, !run.end_at && (run.chat_state_text || '会话状态未读到'), ...chatActivity(run), outcome || host)}</span></summary>
        ${labels ? `<dl class="aw-facts">${labels}</dl>` : empty('还没有本轮结果')}</details></li>`;
    }).join('')}${coming.map(name => `<li class="is-future"><p class="aw-step"><span>${name}</span></p></li>`).join('')}</ol>`;
  }
  // 修理路线和这件的结果：照后台详情给的 repair_route、result_text 两段写；后台没给路线时写现行说法
  function repairRoute(data) {
    const route = field(data.repair_route, '修理路线') || `同一件修两轮还没好，由做事的 AI 判断值不值得让${own()}知道或请${own()}选，不用的只记在账本里。`;
    const result = field(data.result_text, '这件的结果');
    return `<p class="aw-path-note">修理路线：${route}</p>${result ? `<p class="aw-path-note">结果：${result}</p>` : ''}`;
  }
  function workPage(data) {
    const row = data.work || {};
    const status = `<p class="aw-work-state">${lamp(row, false)}<span>${field(row.state_text, '状态')}</span></p>
       <p class="aw-work-meta">${words(...chatActivity(row), row.attempts > 0 && `已修 ${row.attempts} 次`, at(data.next_at) && `下次看 ${when(data.next_at)}`)}</p>
       ${data.next_step ? `<p class="aw-work-next"><b>接下来：</b>${field(data.next_step, '下一步')}</p>` : ''}${message(row.id)}`;
    const related = [
      [route(data.task_href || data.source?.href), '来源', data.source?.label || '来源'],
      [route(data.owner_href), '要办的事', `要${own()}出面的事`],
      [route(data.ledger_href), '账本', 'AI 自动任务账本'],
    ].filter(([href]) => href);
    if (row.project && row.project_name) related.unshift([route(`/live/project/?id=${segment(row.project)}`), '所属项目', row.project_name]);
    const relations = related.map(([href, kind, label]) => `<li><a href="${esc(href)}">${icon('doc')}<span><small>${kind}</small><b>${field(label)}</b></span><span class="aw-chev" aria-hidden="true">›</span></a></li>`).join('');
    const overview = row.summary || list(data.facts).find(fact => fact.label === '问题')?.text;
    const chip = `<p class="aw-chip">${lamp(row) || '<span class="aw-slot-dot"></span>'}一件活</p>`;
    return `<section class="glass aw-hero aw-work-hero"><img alt="" src="${esc(dossier)}" class="aw-art"><div class="aw-lead">${chip}<h1>${rowTitle(row, '这件活的标题')}</h1>
      ${overview ? `<p class="automation-lead">${field(overview, '这件活的说明')}</p>` : ''}<p class="aw-work-where">${words(data.type_title, row.project_name, at(row.first_at) && `${when(row.first_at)} 发现`)}</p></div></section>`
      + `<div class="aw-pair aw-work-pair">${panel('为什么要办', `<dl class="aw-facts">${facts(data.facts) || '<dd>处理依据还没写下来</dd>'}</dl>`, { cls: 'aw-green' })}
      ${panel('状态', status, { symbol: 'check', cls: 'aw-green' })}${panel('经过', rounds(data, row), { symbol: 'flow' })}
      <div class="aw-side">${data.execution_seconds != null ? panel('这件花了多久', `<p class="aw-took">${words(`执行 ${span(data.execution_seconds)}`, Number.isFinite(data.elapsed_seconds) && `从发现起 ${span(data.elapsed_seconds)}`)}</p>`, { symbol: 'clock' }) : ''}
      ${relations ? panel('关联', `<ul class="aw-relations">${relations}</ul>`, { symbol: 'link' }) : ''}</div></div>`
      + (row.type_id === 'acceptance' ? '' : repairRoute(data));
  }
  function paint() {
    const data = state?.data;
    if (!detail && (data?.enabled === false || (data && !Object.hasOwn(data, 'enabled') && !data.q) || !data && state?.meta?.status === 404)) {
      showLegacy();
      return;
    }
    legacy.hidden = true;
    if (legacyStop) { legacyStop(); legacyStop = null; }
    root.hidden = false;
    if (!data?.enabled) {
      delete root._html;
      root.innerHTML = `<p class="glass aw-load">${state?.meta?.status === 404 ? '这件活或这一类没有读到' : field(state?.text || '正在读自动任务…')}</p>`;
      return;
    }
    audience = state.meta?.viewer?.kind || data.audience || 'public';
    window.LiveLight.lightUp([root], true);
    back.href = work ? typeHref(data.work?.type_id) : type ? overviewHref : route('/live/#automation');
    back.textContent = work ? U.fieldText(data.type_title, audience) || '返回这一类' : type ? '自动任务' : '实况';
    const folds = new Map([...root.querySelectorAll('details[id], .aw-timeline li[id] details')]
      .map(el => [el.id || el.parentElement.id, el.open]));
    const kind = category && list(data.categories).find(row => row.id === type);
    if (category && !kind) {
      delete root._html;
      root.innerHTML = '<p class="glass aw-load">这件活或这一类没有读到</p>';
      return;
    }
    U.html(root, work ? workPage(data) : kind ? categoryPage(data, kind) : typePage(data), false);
    for (const [id, open] of folds) {
      const item = $(id), fold = item?.matches('details') ? item : item?.querySelector('details');
      if (fold) fold.open = open;
    }
    if (!didLand) {
      const shown = params.get('show');
      const target = /^#(?:round-|routine-|positions|queue|owner|recent|types|running|repair|routines|ai-scheduled|owner-intake)/.test(location.hash)
        ? location.hash.slice(1) : ['health', 'types'].includes(shown) ? shown : '';
      const item = $(target);
      if (item) {
        didLand = true;
        const fold = item.matches('details') ? item : item.querySelector('details');
        if (fold) fold.open = true;
        requestAnimationFrame(() => item.scrollIntoView({ block: 'start' }));
      }
    }
  }
  // 结果写在开关旁边那行：已保存／没存上：后台给的原因／还没确认存上（超时、断线、电脑回不了话）
  const feedbackFor = (id, reply, want) => {
    if (reply.status === 'saved') feedback = { id, text: '已保存' };
    // 后台回“已撤”时照写它给的说明，不说“没存上”
    else if (reply.status === 'retired') feedback = { id, text: reply.message || '已撤' };
    // 不是本人设备：可信设备弹框已经弹了，旁边不另写
    else if (reply.error === 'cockpit_owner_required') feedback = null;
    else if (reply.status === 'unknown') feedback = { id, text: '还没确认存上', want };
    else feedback = { id, text: typeof reply.message === 'string' && /[一-鿿]/.test(reply.message) ? `没存上：${reply.message}` : '没存上，再试一次' };
  };
  // 回包到了才动开关：存上了照回包里的 current 显示；没存上但后台带回了电脑上读到的 current（读回和请求不一致），也照它显示；
  // 别的没存上、还没确认的留在原档，再读一次照新读数显示
  const targetOf = id => { const data = state?.data; return work || type && !category ? data : [...list(data?.types), ...list(data?.categories)].find(t => t.id === id); };
  function applySaved(id, reply) {
    const t = targetOf(id);
    if (t && reply.current && typeof reply.current === 'object') t.setting = { ...t.setting, ...reply.current };
    paint();
    if (reply.error === 'cockpit_owner_required') return;
    // 还没确认的：等这次重读回来，开关旁那行改照新读数说（message）
    const fb = feedback;
    Live.refresh().then(() => { if (feedback === fb && fb?.want) { fb.reread = true; paint(); } });
  }
  async function save(operation, id, value) {
    if (busy) return;
    busy = true;
    try { return await Live.automationSetting({ operation, id, value }); }
    finally { busy = false; }
  }
  async function applySetting(button) {
    const op = button.dataset.setting, id = button.dataset.id, value = button.dataset.value;
    if (busy) return;
    feedback = null;
    if (op === 'toggle') {
      // 后台回之前开关留在原档，旁边写“正在保存…”；访客点了由可信设备弹框说明，不写这句
      if (audience === 'owner') { feedback = { id, text: '正在保存…', pending: true }; paint(); }
      const want = value === 'on' ? 'off' : 'on';
      const reply = await save('type-mode', id, { mode: want }) || { status: 'unknown' };
      feedbackFor(id, reply, want);
      applySaved(id, reply);
      if (reply.error === 'cockpit_owner_required') return;
      const current = [...root.querySelectorAll('[data-setting=toggle]')].find(el => el.dataset.id === id);
      current?.focus({ preventScroll: true });
      return;
    }
    busy = true;
    const access = await Live.automationSetting({ operation: 'access' });
    busy = false;
    // 只是先问一声能不能操作，还没保存什么：电脑没回话就照实说，不写“还没确认存上”
    if (access.status === 'unknown') { feedback = { id, text: '电脑没回话，再点一次' }; paint(); return; }
    if (access.status !== 'pass') { feedbackFor(id, access); paint(); return; }
    configuration = { op, id };
    $('automation-setting-title').textContent = '暂停到几点';
    settings.querySelector('[data-fields]').innerHTML = '<label>北京时间 <input required type="datetime-local" name="value"></label><p class="row__sub">已经在修的这一轮会先收尾。</p>';
    form.querySelector('[data-dialog-result]').textContent = '';
    settings.showModal();
  }
  settings.querySelector('[data-cancel]').addEventListener('click', () => settings.close());
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !configuration) return;
    const { id } = configuration, value = form.elements.value.value, result = form.querySelector('[data-dialog-result]');
    // 等后台回话：框里和开关旁边都写“正在保存…”，原来的状态和暂停时刻留着
    result.textContent = '正在保存…';
    feedback = { id, text: '正在保存…', pending: true };
    paint();
    const reply = await save('type-mode', id, { mode: 'paused', until_at: `${value}:00+08:00` }) || { status: 'unknown' };
    feedbackFor(id, reply, 'paused');
    // 存上了收框；明确没存上、还没确认的留着框写原因，开关旁边也写同一句
    if (reply.status === 'saved' || reply.error === 'cockpit_owner_required') settings.close();
    else result.textContent = feedback?.text || '';
    applySaved(id, reply);
  });
  root.addEventListener('click', async event => {
    const button = event.target.closest('button');
    if (button?.dataset.setting) { await applySetting(button); return; }
    if (!button?.dataset.copyIntent || U.guard(event)) return;
    const id = button.closest('[data-owner-id]').dataset.ownerId;
    const item = group(state?.data?.works, 'owner').find(row => (row.owner_id || row.id) === id);
    if (item && await U.copy(Live.copy({ id, title: U.fieldText(item.title, audience) }, button.dataset.copyIntent))) U.flash(button, '已复制');
  });
  // 新八类（替你看新消息、每周规矩复核这些）没有自己的读口：原地址读不到，就改读自动任务总包，从 categories 里按 id 找这一类。
  // 原修理分项和单件仍走原地址；旧后台总包里没有 categories，照旧显示“没有读到”。
  let watching;
  const phase = next => {
    if (type && !work && !category && next.meta?.status === 404) {
      category = true;
      queueMicrotask(() => { watching.stop(); watching = Live.watch('automation', {}, { phase }); });
      return;
    }
    state = next; bar?.set(next); paint();
  };
  watching = Live.watch(resource, {}, { phase });
  ready();
})();
