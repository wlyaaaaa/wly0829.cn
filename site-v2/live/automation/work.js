(() => {
  'use strict';
  const U = window.LiveUI, Live = window.Live, P = window.AutomationPresentation, { esc } = U;
  const $ = id => document.getElementById(id), root = $('work-queue'), legacy = $('automation-legacy');
  const settings = $('automation-setting'), form = settings.querySelector('form'), back = document.querySelector('[data-back]');
  const params = new URLSearchParams(location.search), type = params.get('type'), work = params.get('work');
  const scope = params.get('project'), detail = work || type;
  const segment = encodeURIComponent;
  const resource = work ? `automation/work/${segment(work)}` : type ? `automation/types/${segment(type)}` : 'automation';
  const bar = U.topbar({ ask: () => '请看实况这页的自动任务，说明现在在后台跑什么、在修什么、什么时候再验、要不要我出面。' });
  let legacyStop, state, configuration, busy = false, feedback, didLand = false;
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
  const dash = '<span class="aw-dash" aria-label="没有">—</span>';
  const pill = (text, tone) => text ? `<span class="aw-pill" data-tone="${esc(tone)}">${esc(text)}</span>` : '';
  const locked = value => audience === 'public' && value?.visibility === 'owner';
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
  const signal = data => {
    const s = P.lamp(data, state?.offline);
    // 状态说明里已经说了几件要留意，就不再接一句“N 项要关注”。
    const said = new RegExp(`(^|[^0-9])${s.attention} ?[件项]|要(留意|关注)`).test(s.why ? U.fieldText(s.why, audience) : '');
    const reason = [s.why && field(s.why, '状态说明'), s.attention > 0 && !said && `${s.attention} 项要关注`].filter(Boolean).join(' · ');
    return `<p class="aw-signal">${lamp(s, false)}<span>${reason || (s.level === 'green' ? '都正常' : '')}</span></p>`;
  };
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
  const explanation = (name, text, cls = '') => text ? `<p class="aw-explanation ${cls}"><b>${name}</b><span>${esc(text)}</span></p>` : '';
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
    const attrs = config.checked == null ? '' : ` role="switch" aria-checked="${config.checked}"`;
    const value = config.value == null ? '' : ` data-value="${esc(config.value)}"`;
    return `<button type="button" class="more aw-control ${config.checked == null ? '' : 'aw-switch'}" data-setting="${action}" data-id="${esc(id)}"${attrs}${value}${config.name ? ` aria-label="${esc(config.name)}"` : ''}>${label}</button>`;
  }
  const configFor = t => t.setting || {};
  const typeEffort = t => Object.hasOwn(configFor(t), 'effort') ? t.setting.effort : t.default_effort ?? undefined;
  const rosterEffortLabel = t => t?.model_effort ? `跟随模型清单（现在 ${t.model_effort}）` : '跟随模型清单';
  const typeEffortLabel = (t, effort) => effort === null ? rosterEffortLabel(t) : effort || '—';
  function toggle(t, compact = false) {
    const config = configFor(t), on = config.mode === 'on';
    const text = on ? '已开' : config.mode === 'paused' ? '暂停中' : config.mode === 'off' ? '已关' : '状态读不到';
    return control('toggle', t.id, compact ? '<span class="aw-sr">' + text + '</span>' : text,
      { checked: on, value: config.mode, name: `${U.fieldText(t.title, audience)} · ${text}` });
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

  // —— 表：带表头，分列对齐；有更多内容的行点开看 ——
  function table(columns, rows, cls) {
    return `<div class="aw-table ${cls}" role="table"><div class="aw-tr aw-th" role="row"><span></span>${columns.map(name => `<span role="columnheader">${name}</span>`).join('')}<span></span></div>${rows.join('')}</div>`;
  }
  function tableRow({ id = '', light = '', cells, more = '' }) {
    const lead = `<span class="aw-td aw-td--lamp">${light || ''}</span>`;
    const body = lead + cells.map(cell => `<span class="aw-td" role="cell">${cell || dash}</span>`).join('');
    return more
      ? `<details class="aw-tr aw-tr--fold"${id ? ` id="${esc(id)}"` : ''} role="row"><summary>${body}<span class="aw-td aw-fold" aria-hidden="true"></span></summary><div class="aw-more">${more}</div></details>`
      : `<div class="aw-tr"${id ? ` id="${esc(id)}"` : ''} role="row">${body}<span class="aw-td"></span></div>`;
  }
  const engines = ['Claude', 'Codex', 'Antigravity'];
  const engine = row => engines.find(name => name.toLowerCase() === String(row.producer || row.scheduler || '').toLowerCase());
  const resultPill = { ok: ['正常', 'ok'], done: ['正常', 'ok'], success: ['正常', 'ok'], warn: ['需留意', 'warn'], failed: ['出错', 'bad'],
    error: ['出错', 'bad'], no_conclusion: ['没结论', 'off'], launched: ['已启动', 'run'], running: ['正在跑', 'run'] };
  const statePill = { '正在跑': 'run', '等下次': 'wait', '已暂停': 'off', '跑完了': 'done' };
  const result = status => pill(...(resultPill[status] || []));
  function history(row) {
    const runs = list(row.recent_runs).filter(run => at(run.at));
    const notes = words(row.purpose, row.notice || row.error, row.stop, row.stop_effect || row.impact);
    const now = words(...chatActivity(row));
    return [notes && `<p>${notes}</p>`, now && `<p>这一轮：${now}</p>`, runs.length && `<p class="aw-more__title">最近几次</p><ul>${runs.map(run =>
      `<li><time>${when(run.at)}</time>${run.chat_state === 'running' ? pill('正在跑', 'run') : result(run.status) || '<span class="aw-dim">结果未读到</span>'}${run.actual_model ? `<span class="aw-dim">${field(run.actual_model)}</span>` : ''}</li>`).join('')}</ul>`]
      .filter(Boolean).join('');
  }
  function scheduledRow(row, vendor) {
    const title = field(row.label || row.name || row.title, '任务名');
    const target = route(row.href);
    const state_text = typeof row.state_text === 'string' ? row.state_text : '';
    const failedAt = row.notice && (row.error_at || row.at);
    const last = failedAt ? `<time>${when(failedAt)}</time>${pill(row.notice, 'warn')}`
      : row.at ? `<time>${when(row.at)}</time>${result(row.status)}` : '';
    const next = row.next_at ? `<time>${when(row.next_at)}</time>` : ['已暂停', '跑完了'].includes(state_text) ? '<span class="aw-dim">无下次排期</span>' : '';
    const who = vendor ? `<span class="aw-vendor" data-vendor="${esc(vendor.toLowerCase())}">${esc(vendor)}</span>` : '';
    return tableRow({ id: row.id ? `routine-${row.id}` : '', light: row.level ? lamp(row) : '',
      cells: [`<b>${link(target, title)}</b>`, who || '<span></span>', row.period ? cadence(row.period) : '',
        state_text ? pill(state_text, statePill[state_text] || 'off') : '', last, next], more: history(row) });
  }
  // 全站都按北京时间，排期里的“(Asia/Shanghai)”不写。
  function cadence(value) {
    return field(typeof value === 'string' ? value.replace(/\s*[（(]Asia\/Shanghai[）)]/g, '') : value);
  }
  function scheduledPanel(data) {
    const rows = list(data.scheduled_activities);
    let body;
    if (!Array.isArray(data.scheduled_activities)) body = empty('这里还看不到');
    else {
      const lines = [], missing = [];
      for (const name of engines) {
        const items = rows.filter(row => engine(row) === name);
        if (!items.length) missing.push(name);
        items.forEach((row, i) => lines.push(scheduledRow(row, i ? '' : name)));
      }
      rows.filter(row => !engine(row)).forEach(row => lines.push(scheduledRow(row, row.producer || '')));
      const notes = [...list(data.scheduled_gaps).map(text => field(text)), missing.length && `${missing.join('、')}：这里没有定时任务`].filter(Boolean);
      body = (lines.length ? table(['名字', '哪家', '多久一次', '现在', '上一次', '下一次'], lines, 'aw-table--sched') : empty('还没有定时任务'))
        + notes.map(text => `<p class="aw-table-note">${text}</p>`).join('');
    }
    return panel('你设的定时任务', body, { id: 'ai-scheduled', symbol: 'clock', extra: '<span class="aw-head-note">Claude · Codex · Antigravity</span>' });
  }
  function intakePanel(data) {
    const v = data.owner_intake, mine = audience === 'owner';
    let body;
    if (!v || typeof v !== 'object' || !Array.isArray(v.runs)) body = empty('这里还看不到');
    else if (!v.runs.length) body = empty('还没跑过');
    else {
      const columns = ['什么时候', '为什么跑', '各来源读到几点', mine ? '记进了哪几件' : '记进', ...(mine ? ['告诉你什么'] : []), '收起几条'];
      const rows = v.runs.map(run => {
        const reason = run.reason === 'urgent' ? `${pill('急件', 'warn')}${run.reason_text ? field(run.reason_text) : ''}`
          : run.reason_text ? field(run.reason_text) : '每天定时那次';
        const sources = list(run.sources).filter(s => s?.name).map(s => `${field(s.name)} ${when(s.read_to) || '—'}`).join('、');
        const recorded = mine && Array.isArray(run.recorded)
          ? run.recorded.length ? run.recorded.map(item => link(route(item.href), field(item.title, '记进的事'))).join('、') : '<span class="aw-dim">没有</span>'
          : Number.isInteger(run.recorded_count) ? `${run.recorded_count} 件` : '';
        const told = mine ? [run.told ? field(run.told) : '<span class="aw-dim">没找你</span>'] : [];
        const light = run.level ? lamp(run) : '';
        const state = run.status === 'failed' ? '出错' : run.status === 'running' ? '正在跑' : '';
        const time = `<b>${when(run.at)}</b>${state ? ` <small>${state}</small>` : ''}`;
        return tableRow({ light, cells: [time, reason, sources ? `<span class="aw-small">${sources}</span>` : '', recorded, ...told,
          Number.isInteger(run.folded) ? `${run.folded} 条` : ''] });
      });
      body = table(columns, rows, `aw-table--intake${mine ? '' : ' aw-table--intake-public'}`)
        + (mine ? '' : `<p class="aw-table-note">案件、短信原文和告诉本人的话只在本人设备上显示，这里只给次数和条数。</p>`);
    }
    return panel(`${own()}的事`, body, { id: 'owner-intake', symbol: 'chat',
      extra: v?.next_at ? `<span class="aw-head-note">下次 ${when(v.next_at)}</span>` : '' });
  }
  function routineRow(row) {
    const title = field(row.label || row.name || row.title, '来源名称');
    const target = route(row.href);
    const name = typeof row.label === 'string' ? row.label : '';
    const who = row.producer && !name.includes(row.producer) ? `<small class="aw-who">${field(row.producer)}</small>` : '';
    const trigger = row.trigger_text || row.trigger || row.period;
    const today = Number.isInteger(row.today_count) ? `${row.today_count} 次` : '';
    const running = row.chat_state === 'running' || row.state_text === '正在跑';
    const last = running ? `${pill('正在跑', 'run')}${row.at ? `<span class="aw-dim">${when(row.at)} 起</span>` : ''}`
      : row.at ? `<time>${when(row.at)}</time>${Number.isInteger(row.plan_count) ? `<span>写回 ${row.plan_count} 份</span>` : result(row.status)}`
        : row.gap ? `<span class="aw-dim">${field(row.gap)}</span>` : '';
    return tableRow({ id: row.id ? `routine-${row.id}` : '', light: row.level ? lamp(row) : '',
      cells: [`<b>${link(target, title)}</b>${who}`, trigger ? field(trigger) : '', today, last], more: history(row) });
  }
  function routinePanel(data) {
    const jobs = list(data.routines), rows = [...(jobs.length ? jobs : list(data.sources)), ...list(data.other_automatic_chats)];
    const body = rows.length ? table(['名字', '什么时候跑', '今天', '最近一次'], rows.map(routineRow), 'aw-table--routine') : empty('这里还看不到');
    return panel('例行的 AI 活', body, { id: 'routines', symbol: 'refresh' });
  }
  function nowRow(row) {
    const target = locked(row.title) ? '' : route(row.href);
    const meta = words(row.model, when(row.started_at) && `${when(row.started_at)} 起`, row.detail);
    return `<li>${line(target, `${lamp({ level: 'green' })}<span class="aw-now__main"><b>${field(row.title, '名字')}</b>${P.tag(row.kind, row.who, esc)}</span>${meta ? `<small>${meta}</small>` : ''}`)}</li>`;
  }
  function runningNow(data) {
    const rows = data.running_now;
    // 最多摊开 5 个，多的收起，页头不至于被撑得太高。
    const body = !Array.isArray(rows) ? empty('这里还看不到') : !rows.length ? empty('这会儿没有在跑的后台 AI')
      : `<ul class="aw-now">${rows.slice(0, 5).map(nowRow).join('')}</ul>${rows.length > 5 ? `<details id="running-more" class="aw-now-more"><summary class="aw-more-link">再看 ${rows.length - 5} 个</summary><ul class="aw-now">${rows.slice(5).map(nowRow).join('')}</ul></details>` : ''}`;
    const n = Array.isArray(rows) ? `<span class="aw-head-note">${rows.length} 个</span>` : '';
    return panel('现在在跑', body, { id: 'running-now', symbol: 'play', cls: 'aw-now-panel', extra: n });
  }
  function pageHead(data) {
    const s = data.summary, idle = data.card?.state_code === 'idle';
    const tiles = s && typeof s === 'object' ? stats([['正在跑', s.running, 'run', 'running-now'], ['今天跑过', s.ran_today, 'done'],
      [`要${own()}`, s.owner, 'owner', s.owner > 0 ? 'owner-strip' : ''], ['近 7 天出错', s.errors_7d, 'bad']]) : empty('这里还看不到');
    const lead = `不用${own()}开口、在后台自己跑起来的 AI 活都在这：${own()}设的定时任务、AI 修毛病、例行的 AI 活。`;
    return `<div class="aw-top aw-top--page"><section class="glass aw-hero aw-page-hero"><img alt="" src="${esc(idle ? tea : hero)}" class="aw-art">
      <div class="aw-lead"><h1>自动任务</h1><p class="automation-lead">${lead}</p>${tiles}${signal(data)}</div></section>${runningNow(data)}</div>`;
  }
  function slots(data) {
    const rows = [...list(data.slots)].sort((a, b) => Number(a.id) - Number(b.id));
    return panel('4 个位置', rows.length ? `<ul class="aw-slots">${rows.map((slot, i) => {
      const problem = ['yellow', 'red'].includes(slot.work?.level);
      const dot = slot.occupied ? problem ? lamp(slot.work) : '<span class="aw-slot-dot is-on" aria-label="占着"></span>' : '<span class="aw-slot-dot" aria-label="空着"></span>';
      const target = slot.work && (route(slot.work.href) || workHref(slot.work.id));
      return `<li class="${slot.occupied ? 'is-on' : ''}">${dot}<b>${field(slot.label || (i === 3 ? '急事位' : `位置 ${i + 1}`))}</b>
       <span class="aw-slot-state">${field(slot.status_text || (slot.occupied ? '已占用' : '空着'))}</span>
       ${slot.work ? link(target, rowTitle(slot.work), 'aw-slot-work') : '<span></span>'}</li>`;
    }).join('')}</ul>` : empty('位置暂时读不到'), { id: 'positions', cls: 'aw-positions', symbol: 'chip' });
  }
  function ownerStrip(rows) {
    const row = rows[0];
    if (!row) return '';
    const target = route(row.owner_href) || route(row.href) || workHref(row.id);
    const actions = locked(row.title) ? '' : `<div class="aw-buttons" data-owner-id="${esc(row.owner_id || row.id)}">${[
      ['ask', '问情况'], ['done', '我办完了'], ['later', '晚点提醒'],
    ].map(([intent, label]) => `<button type="button" class="more" data-copy-intent="${intent}">${label}</button>`).join('')}</div>`;
    const more = rows.length > 1 ? `<p class="aw-dim">另外还有 ${rows.length - 1} 件，在下面“现在怎么样”里</p>` : '';
    return panel(`要${own()}出面`, `<div class="aw-owner__main"><h3>${lamp(row, false)}${link(target, rowTitle(row))}</h3><p>${field(row.state_text)}</p>${more}</div>${actions}`,
      { id: 'owner-strip', cls: 'aw-owner', symbol: 'alert', extra: `<span class="aw-head-note">${rows.length} 件</span>` });
  }
  function typeCard(t) {
    const [description] = descriptions[t.id] || [''];
    const readOnly = readonly(t.id);
    const c = t.counts || {}, config = configFor(t), ta = when(config.until_at);
    const effort = typeEffort(t);
    const items = [[c.running, '在修'], [c.queue, '准备派'], [c.followup, '等复查']].filter(([n]) => n > 0);
    const info = !readOnly && config.mode === 'paused' ? (ta ? `暂停到 ${ta}` : '暂停中')
      : !readOnly && config.mode === 'off' ? ['已关', c.running > 0 && `${c.running} 件正在收尾`].filter(Boolean).join(' · ')
        : items.length ? items.map(([n, label]) => `${n} 件${label}`).join(' · ')
          : c.occupied > 0 ? `${c.occupied} 件已占位`
            : list(t.sources).some(s => s.at) ? '正常 · 没有活' : '这里还看不到';
    const shown = effort === undefined ? '' : effort === null ? t.model_effort : effort;
    const model = readOnly ? readonlyNote : shown ? `<p class="aw-type__model">${t.model ? `${esc(t.model)} · ` : ''}默认 ${esc(shown)}</p>` : '';
    const art = ART[t.id] ? `<img class="aw-type__art" src="${esc(ART[t.id])}" alt="" width="76" height="76" loading="lazy">` : icon('gear');
    return `<article class="aw-type${config.mode === 'off' || config.mode === 'paused' ? ' is-off' : ''}" data-type-id="${esc(t.id)}">${art}<div class="aw-type__body">
      <h3>${link(route(t.href) || typeHref(t.id), field(t.title, '类型'), 'aw-type__link')}</h3>
      <p class="aw-type__covers">${esc(description)}</p><p class="aw-type__state${info === '这里还看不到' ? ' is-missing' : ''}">${['yellow', 'red'].includes(t.level) ? lamp(t) : ''}${esc(info)}</p>${model}${message(t.id)}</div>${readOnly ? '' : toggle(t, true)}</article>`;
  }
  function trend(data) {
    const weeks = list(data.weeks).filter(week => Number.isInteger(week.open) && week.open >= 0).slice(-4);
    const caption = weeks.length === 4 || !weeks.length ? '这四周' : `近 ${weeks.length} 周`;
    const max = Math.max(1, ...weeks.map(week => week.open));
    const bars = weeks.map(week => `<span title="${esc(at(week.end_at))} · ${week.open} 件" style="--aw-bar:${Math.max(3, 34 * week.open / max)}px"></span>`).join('');
    const reading = weeks.length
      ? `<b>每周末没结的 ${weeks.map(week => week.open).join(' → ')}</b><span class="aw-week-bars" aria-hidden="true">${bars}</span>`
      : '<b>刚开始记录，满一周后显示</b>';
    return `<div class="aw-state-row"><h3>${caption}</h3><div class="aw-week-reading">${reading}</div></div>`;
  }
  function repairBlock(data) {
    const rows = list(data.works), counts = data.counts || {}, health = data.health || {};
    const active = group(rows, 'running'), queue = group(rows, 'queue'), owners = group(rows, 'owner');
    const repaired = Array.isArray(data.benefits7) ? data.benefits7 : group(rows, 'done').filter(row => row.verified);
    const idle = data.card?.state_code === 'idle';
    const statusRows = [
      ['queue', '准备派', queue, counts.queue, counts.overdue > 0 ? `${counts.overdue} 件超时没人领` : counts.queue > 0 && '没有超时没人领'],
      ['running', '在修', active, counts.occupied ?? counts.running, false],
      ['owner', `要${own()}出面`, owners, counts.owner, false],
      ['recent', '最近变好', repaired, counts.repaired, false],
    ];
    const stateRow = (id, label, items, n, note) => `<div id="${id}" class="aw-state-row"><h3>${label}</h3>
      <div><p class="aw-state-count">${n === 0 ? '没有' : `${total(n)} 件`}${note ? ` · ${esc(note)}` : ''}</p>${items.length ? workRows(items.slice(0, 3)) : ''}
      ${items.length > 3 ? `<details><summary class="aw-more-link">再看 ${items.length - 3} 件</summary>${workRows(items.slice(3))}</details>` : ''}</div></div>`;
    const skipped = idle ? '<div class="aw-state-row"><h3>准备派、在修、等办理</h3><div><p class="aw-state-count">都没有</p></div></div><span id="queue"></span><span id="running"></span><span id="owner"></span>' : '';
    const lastStart = at(health.last_started_at), oldest = span(health.oldest_wait_seconds);
    const observed = words(
      lastStart && `最近开工 ${when(health.last_started_at)}`,
      oldest ? `最老待领 ${oldest}` : counts.queue === 0 && '没有待领的',
      Number.isInteger(health.starts_today) && `今天开了 ${health.starts_today} 轮`);
    const healthText = health.state_code !== 'ok' || !observed ? field(health.text || '还没读到派活程序状态') : '';
    const watch = `<div id="health" class="aw-state-row"><h3>有人在看吗</h3><div><p class="aw-state-count">${lamp(health)}${[healthText, observed].filter(Boolean).join(' · ')}</p></div></div>`;
    const waiting = group(rows, 'followup');
    const recent = panel('现在怎么样', skipped + statusRows.slice(idle ? 3 : 0).map(args => stateRow(...args)).join('')
      + watch + (waiting.length ? stateRow('followup', '等验收和复查', waiting, counts.followup) : '') + trend(data), { id: 'repair-state' });
    const tiles = stats([['在修', counts.occupied ?? counts.running, 'run', 'running'], ['准备派', counts.queue, 'queue', 'queue'],
      [`要${own()}`, counts.owner, 'owner', 'owner'], ['7 天修好', counts.repaired, 'done', 'recent']]);
    const example = route(data.example_href);
    const guide = explanation('怎么发现', "程序跑完本来就留回执，AI 碰到毛病也会递一条；派活程序每 5 分钟看一遍，收件箱一有新的也马上看，有要修、到期要验的才叫 AI。")
      + explanation('怎么算好', "修的 AI 说了不算，要另一个 AI 验过，或等下次真跑后再核；三次不好 Claude 出方案，第四次还不好才找你；真要你做或选的，当场就找你。")
      + (example ? `<p><a class="aw-example-link" href="${esc(example)}">看一件真的怎么修 <span aria-hidden="true">→</span></a></p>` : '');
    const intro = panel('AI 修毛病', guide + tiles, { id: 'repair', symbol: 'wrench', cls: 'aw-repair-intro' });
    const types = list(data.types);
    return `<div class="aw-top aw-top--repair">${intro}${slots(data)}</div>` + recent
      + panel(`各类自动任务 · ${types.length} 类`, `<div class="aw-types">${types.map(typeCard).join('')}</div>`,
        { id: 'types', symbol: 'stack', extra: `<span class="aw-head-note">${audience === 'owner' ? '配对设备可以开关、暂停和改默认档位' : '开关、暂停和档位只有本人配对的设备能改'}</span>` });
  }
  function overview(data) {
    const health = data.health || {};
    const warning = health.state_code === 'lost' ? `<p class="glass aw-warning">${lamp(health)}${field(health.text)}</p>` : '';
    return warning + pageHead(data) + ownerStrip(group(data.works, 'owner')) + scheduledPanel(data) + intakePanel(data)
      + repairBlock(data) + routinePanel(data)
      + `<p class="aw-foot-link"><a href="${esc(route('/live/tasks/'))}">Windows 计划任务<span class="aw-chev" aria-hidden="true">›</span></a></p>`;
  }
  function message(id) {
    const text = feedback?.id === id ? feedback.text : '';
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
    const c = data.counts || {}, config = configFor(data), rows = list(data.works);
    const effort = typeEffort(data);
    const [description, example, off, boundary] = descriptions[data.id] || [];
    const readOnly = readonly(data.id);
    const active = rows.filter(row => row.group !== 'done' && row.group !== 'decided');
    const past = rows.filter(row => !active.includes(row));
    const controls = readOnly ? readonlyNote
      : `<div class="aw-settingbar">${toggle(data)}${control('pause', data.id, when(config.until_at) ? `暂停到 ${esc(when(config.until_at))}` : '暂停到…')}${control('type-effort', data.id, `默认档位 ${esc(typeEffortLabel(data, effort))}<span class="aw-caret" aria-hidden="true"></span>`, { value: effort })}</div>`;
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
  const verdict = value => ({ fixed: '按原条件验过', not_fixed: '没修好', waiting_verify: '等自然事件验收', deferred: '暂时不修',
    wont_fix: '定了不修', to_owner: `转给${own()}` })[value] || value;
  const execution = value => ({ completed: '正常结束', failed: '失败', interrupted: '没跑完' })[value] || value;
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
  function workPage(data) {
    const row = data.work || {}, cfg = data.setting || {};
    const change = !['done', 'decided', 'owner'].includes(row.group)
      ? control('work-effort', row.id, `下次用哪档：${esc(cfg.effort || '跟类型默认')}<span class="aw-caret" aria-hidden="true"></span>`, { value: cfg.effort }) : '';
    const status = `<p class="aw-work-state">${lamp(row, false)}<span>${field(row.state_text, '状态')}</span></p>
       <p class="aw-work-meta">${words(...chatActivity(row), row.attempts > 0 && `已修 ${row.attempts} 次`, at(data.next_at) && `下次看 ${when(data.next_at)}`)}</p>
       ${data.next_step ? `<p class="aw-work-next"><b>接下来：</b>${field(data.next_step, '下一步')}</p>` : ''}${change}${message(row.id)}`;
    const related = [
      [route(data.task_href || data.source?.href), '来源', data.source?.label || '来源'],
      [route(data.owner_href), '要办的事', `要${own()}出面的事`],
      [route(data.ledger_href), '账本', 'AI 账本'],
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
      + (row.type_id === 'acceptance' ? '' : `<p class="aw-path-note">修理路线：AI 修 3 次 → 没好交 Claude 出方案 → 第 4 次 → 再不好交给${own()}</p>`);
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
    U.html(root, work ? workPage(data) : type ? typePage(data) : overview(data), false);
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
  const feedbackFor = (id, reply) => {
    if (reply.status === 'saved') feedback = { id, text: '已保存' };
    else if (reply.error !== 'cockpit_owner_required') feedback = { id, text: reply.status === 'unknown' ? '没确认是否保存，请刷新后查看' : '没存上，再试一次' };
  };
  function applySaved(id, reply) {
    const data = state?.data, t = type || work ? data : list(data?.types).find(t => t.id === id);
    if (t && reply.current) {
      t.setting = { ...t.setting, ...reply.current };
      if (!work && Object.hasOwn(reply.current, 'effort')) t.default_effort = reply.current.effort ?? t.model_effort ?? null;
    }
    paint();
    void Live.refresh();
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
      const reply = await save('type-mode', id, { mode: value === 'on' ? 'off' : 'on' });
      feedbackFor(id, reply);
      if (reply.status === 'saved') applySaved(id, reply); else paint();
      if (reply.error === 'cockpit_owner_required') return;
      const current = [...root.querySelectorAll('[data-setting=toggle]')].find(el => el.dataset.id === id);
      current?.focus({ preventScroll: true });
      return;
    }
    busy = true;
    const access = await Live.automationSetting({ operation: 'access' });
    busy = false;
    if (access.status !== 'pass') { feedbackFor(id, access); paint(); return; }
    configuration = { op, id };
    const pause = op === 'pause', opt = list(state?.data?.efforts);
    const inherited = op === 'type-effort' ? rosterEffortLabel(state?.data) : '跟类型默认';
    $('automation-setting-title').textContent = pause ? '暂停到几点' : op === 'type-effort' ? '这一类的默认档位' : '这件活下次用哪档';
    const field = settings.querySelector('[data-fields]');
    field.innerHTML = pause ? '<label>北京时间 <input required type="datetime-local" name="value"></label><p class="row__sub">已经在修的这一轮会先收尾。</p>'
      : `<label>档位 <select name="value"><option value="">${esc(inherited)}</option>${opt.map(effort =>
        `<option value="${esc(effort)}"${effort === value ? ' selected' : ''}>${esc(effort)}</option>`).join('')}</select></label>`;
    if (!pause && value && !opt.includes(value)) form.elements.value.selectedIndex = -1;
    form.querySelector('[data-dialog-result]').textContent = '';
    form.querySelector('[type="submit"]').disabled = op === 'work-effort' && opt.length === 0;
    settings.showModal();
  }
  settings.querySelector('[data-cancel]').addEventListener('click', () => settings.close());
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !configuration) return;
    const { op, id } = configuration, value = form.elements.value.value, pause = op === 'pause';
    if (!pause && form.elements.value.selectedIndex < 0) return;
    const reply = await save(pause ? 'type-mode' : op, id, pause ? { mode: 'paused', until_at: `${value}:00+08:00` } : value || null);
    feedbackFor(id, reply);
    if (reply.status === 'saved') {
      settings.close();
      applySaved(id, reply);
    } else if (reply.error === 'cockpit_owner_required') settings.close();
    else form.querySelector('[data-dialog-result]').textContent = feedback?.text || '';
  });
  root.addEventListener('click', async event => {
    const button = event.target.closest('button');
    if (button?.dataset.setting) { await applySetting(button); return; }
    if (!button?.dataset.copyIntent || U.guard(event)) return;
    const id = button.closest('[data-owner-id]').dataset.ownerId;
    const item = group(state?.data?.works, 'owner').find(row => (row.owner_id || row.id) === id);
    if (item && await U.copy(Live.copy({ id, title: U.fieldText(item.title, audience) }, button.dataset.copyIntent))) U.flash(button, '已复制');
  });
  Live.watch(resource, {}, { phase(next) { state = next; bar?.set(next); paint(); } });
  ready();
})();
