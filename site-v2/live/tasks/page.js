// 计划任务按 Windows 登记用途分组；旧维护链接继续显示当天维护记录。
(() => {
  'use strict';
  const U = window.LiveUI, L = window.LiveLight, $ = id => document.getElementById(id), { esc, sp } = U;
  const p = new URLSearchParams(location.search), maintenance = p.get('scope') === 'ai-today', scope = maintenance ? 'ai-today' : 'scheduled';
  const project = p.get('project'), fixture = p.has('fixture'), pageName = maintenance ? '今天 AI 后台自动维护' : '计划任务';
  const route = href => { const u = new URL(href, location.href); if (fixture) u.searchParams.set('fixture', p.get('fixture')); return u.pathname + u.search + u.hash; };
  if (maintenance) {
    document.title = `${pageName} · 实况`; document.querySelector('h1').innerHTML = esc(pageName).replace('后台', '后台<wbr>'); document.body.classList.add('tasks--ai-today');
    $('task-intro').textContent = '按北京时间统计当天已观察到的维护运行。';
    $('other-tasks').insertAdjacentHTML('beforebegin', '<a class="more" href="/live/tasks/">计划任务 ›</a>');
  }
  const scheduledPacket = d => d && Object.hasOwn(d, 'readable_total') && Object.hasOwn(d, 'unreadable_total');
  const maintenanceRounds = d => Object.hasOwn(d || {}, 'maintenance_rounds') ? d.maintenance_rounds : d?.total;
  const linkedProject = id => typeof id === 'string' && id && id !== 'project-b9c775111c7c33539ba1941c'; // 电脑上别的软件是任务分类。
  if (project) { const all = new URL(location.href); all.searchParams.delete('project'); $('project-clear').href = all.pathname + all.search; $('project-filter').hidden = false; }
  if (project) $('other-tasks').href = route(`/live/automation/?project=${encodeURIComponent(project)}`);
  const hero = $('hero'), sections = new Map(), stamp = at => at ? `${U.date(at)} ${U.time(at)}` : U.collectionText();
  let viewer = 'public', page = null, rows = [], watch = null, cursor = null, query = p.get('q') || '', headline = '', now = null, coverageNote = '';
  let board = null, dataAt = null, batchAt = null, pick = p.get('group') || '', projectList = null, projectKey = '', generation = 0;
  let runningReading = null;
  const taskLiveWords = new WeakMap();
  const { keepRowWords: keepTaskWords } = window.AutomationPresentation;
  function taskWords() {
    for (const el of document.querySelectorAll('[data-task-state]')) {
      const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), off = U.offline?.();
      for (let node; (node = walk.nextNode());) {
        const previous = taskLiveWords.get(node), live = previous?.shown === node.textContent ? previous.live : node.textContent;
        const shown = off ? live.replace(/正在跑|本轮|这一轮|下次|已跑|刚开始|还在跑/g, word => ({ '正在跑': '断开前在跑', '本轮': '断开前这一轮', '这一轮': '断开前这一轮', '下次': '原定下次', '已跑': '断开前已跑', '刚开始': '断开前刚开始', '还在跑': '断开前还在跑' })[word]) : live;
        taskLiveWords.set(node, { live, shown }); if (node.textContent !== shown) node.textContent = shown;
      }
    }
  }
  const nextAt = at => `${U.date(at) === U.date(now || Date.now()) ? '今天' : U.date(at)} ${U.time(at)}`;
  const MODE = { event: '有事才跑', on_demand: '叫了才跑', resident: '一直开着', service_loop: '一直开着' };
  const empty = text => [{ key: 'empty', cls: 'row row--flat row--empty lb-row--empty', html: `<span></span><p class="row__sub">${U.fieldHtml(U.offline?.() && /还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|维护明细这次没读全|正在读|正在准备/.test(sp(text)) ? '这块没存下来，连上后补上。' : text, { name: '自动任务', place: 'body', kind: viewer })}</p>` }];
  // 上次出错、这次没读到运行状态的任务，后台标 scheduled_issue 并算进“项要处理”，表里也按要处理排前面
  const confirmedFailure = t => t.confirmed_failure === true && t.level === 'yellow' && t.last?.result === 'failed';
  const attention = t => maintenance ? ['red', 'amber'].includes(U.status(t).tone) : confirmedFailure(t) || ['failed', 'warn'].includes(taskState(t)) || t.scheduled_issue === true;
  // 没有下次时间的任务：按 Windows 登记的触发方式写“登录时”“开机时”这类，不写“没读到”
  function triggerWhen(t) {
    if (!Array.isArray(t.trigger_types)) return '';
    const kinds = t.trigger_types.filter(k => typeof k === 'string' && k && k !== '按计划');
    if (!t.trigger_types.length) return '叫了才跑';
    if (!kinds.length) return '没有下一次';
    return kinds.length > 2 ? `${kinds.slice(0, 2).join('、')}等` : kinds.join('、');
  }
  // 上次结果没读到时，用后台给的原因写短一点
  function unknownWhy(t) {
    const s = typeof t.status_text === 'string' ? t.status_text : '';
    return /暂未读到/.test(s) ? '这次没读到' : /被终止/.test(s) ? '被终止' : /结果(?:的含义)?未确认/.test(s) ? '结果未确认' : '';
  }
  // 要留意的任务：写后台给的原因；后台只标了要留意、没给具体原因的，照实说
  function warnWhy(t) {
    const pick = v => typeof v === 'string' ? v.trim() : typeof v?.text === 'string' ? v.text.trim() : '';
    if (t.last?.result === 'warn' && t.last.reason_code === 'time_limit' && pick(t.last.reason)) return pick(t.last.reason);
    const said = [pick(t.problem?.reason), t.last?.result === 'warn' && pick(t.last.output), pick(t.output), pick(t.status_note), pick(t.why)].find(v => v && !/^(?:任务有当前问题|运行有异常|有 \d+ 件事要留意)$/.test(v));
    return said || '后台只标了要留意，没给具体原因，点进去看最近几次';
  }
  const notRunningReason = t => ({ disabled: '停用', on_demand: '按需', never: '从没跑过' })[t.not_running_reason];
  // 看板：列名和列宽；每组的徽章、插画；不认识的组用通用齿轮和现成插画，按 id 固定分色
  const COLUMNS = [
    { label: '任务名', width: 'minmax(0, 1fr)' },
    ...(maintenance ? [{ label: '说明', width: 'minmax(0, 1fr)' }] : []),
    { label: '上次运行', width: 'minmax(77px, .42fr)' }, { label: '<span data-task-state>下次</span>运行', width: 'minmax(77px, .42fr)' },
  ];
  const LOOK = {
    'ai-today': { name: '今天 AI 后台自动维护', icon: 'sparkle', tint: 'gold', art: 'ai' },
    online: { name: '云端和 GitHub', icon: 'loop', tint: 'green', art: 'online' },
    // “AI 工作”“电脑维护”两张卡头用强调绿（本人 11-24：“变成绿色强调色”，M778）
    ai: { name: 'AI 工作', icon: 'sparkle', tint: 'green', art: 'ai' }, upkeep: { name: '电脑维护', icon: 'wrench', tint: 'green', art: 'upkeep' }, hardware: { name: '硬件和灯效', icon: 'chip', tint: 'lilac', art: 'hardware' },
    backup: { name: '备份', icon: 'stack', tint: 'blue', art: 'backup' }, daily: { name: '听写和日常记录', icon: 'mic', tint: 'peach', art: 'daily' }, remote: { name: '远程和网络', icon: 'wifi', tint: 'cyan', art: 'remote' },
    vendor: { name: '第三方软件自带', icon: 'box', tint: 'pink', art: 'vendor' }, 'ai-schedule': { name: 'AI 定时任务', icon: 'chat', tint: 'lilac', art: 'ai-schedule' }, disabled: { name: '已停用', icon: 'moon', tint: 'blue', art: 'idle', last: true },
  };
  const look = id => {
    if (Object.hasOwn(LOOK, id)) return LOOK[id];
    const colors = ['green', 'gold', 'aqua', 'lilac', 'blue', 'peach', 'cyan', 'pink'];
    let hash = 0x811c9dc5;
    for (const ch of String(id)) hash = Math.imul(hash ^ ch.codePointAt(0), 0x01000193);
    return { icon: 'gear', tint: colors[(hash >>> 0) % colors.length], art: 'generic' };
  };
  const bar = U.topbar({ ask: () => `请看实况${pageName}：${headline || U.collectionText()}。请说明现在的情况。` });
  L.add(hero); document.querySelectorAll('.stage a[href^="/live/"]').forEach(a => a.href = route(a.getAttribute('href')));
  const changesBox = $('changes').closest('.l2-col');
  // 右栏是固定高度、栏内滚动的：点开“变化”时把栏滚到展开内容的开头，点了马上看得到
  $('changes-box').addEventListener('toggle', e => {
    if (!e.target.open) return;
    const side = $('task-side'), head = $('changes-title');
    // 展开的内容是一点点长出来的，跟着长几帧，直到“变化”标题停在栏顶
    const start = performance.now(), follow = () => {
      const { top, bottom } = side.getBoundingClientRect();
      side.scrollTop += head.getBoundingClientRect().top - top - 8;
      if (performance.now() - start < 700) return void requestAnimationFrame(follow);
      const cut = [...$('changes').children].map(row => row.getBoundingClientRect()).find(row => row.top < bottom && row.bottom > bottom);
      if (cut) side.scrollTop += side.scrollTop >= bottom - cut.top ? cut.top - bottom : cut.bottom - bottom;
    };
    requestAnimationFrame(follow);
  });
  const changesTitle = $('changes-title') || changesBox.querySelector('.part');
  document.querySelectorAll('#groups > .part, #changes + .part').forEach(el => el.setAttribute('data-keep', ''));
  changesBox.querySelectorAll(':scope > .part').forEach(el => el.setAttribute('data-keep', ''));
  const heroRead = U.reading(hero.querySelector('.card__body'), { ghost: U.ghost.card(1), name: '自动任务' });
  const groupsRead = U.reading($('groups'), { ghost: U.ghost.rows(4) }), changesRead = U.reading(changesBox, { ghost: U.ghost.rows(3), slow: false });
  document.querySelector('[data-back]').addEventListener('click', U.restoreBack);
  // 后台按当天成功、出错的次数分了档（days7[].outcome.state，M779）：全成功绿、有出错但大部分成功黄、部分成功橙、全出错红；
  // 旧包的 failed 只表示当天有一轮出错，没有足够记录时用黄格提醒。
  const TIER = { success: 'ok', mostly_successful: 'mostly', partial_success: 'partial', failed: 'failed', warn: 'warn', none: 'none' };
  const dayTier = day => TIER[day?.outcome?.state] || (day?.state === 'failed' ? 'observed-failed'
    : day?.state === 'ok' && day.partial ? 'observed-ok' : day?.state);
  const observedFailure = '有出错记录，全天结果未确认';
  const dayTrouble = day => ['mostly', 'partial', 'failed', 'observed-failed'].includes(dayTier(day));
  const dayReason = window.LiveBoard.taskDayReason, dayMissing = '那天结果没读到';
  const tierCounts = o => Number.isInteger(o?.ok) && Number.isInteger(o?.failed) && o.ok + o.failed > 0 && o.state !== 'none'
    ? `（${o.exact ? '' : '已读到'}成功 ${o.ok} 次、出错 ${o.failed} 次）` : '';
  function week(d) {
    if (U.offline?.() && !Array.isArray(d.days7)) return '';
    const labels = { ok: '跑成了', 'observed-ok': '至少一轮成功', mostly: '有出错，大部分成功', partial: '有出错，部分成功', failed: '全部出错', 'observed-failed': observedFailure, warn: '部分完成' }, days = d.days7;
    if (!Array.isArray(days) || days.every(day => dayTier(day) == null || dayTier(day) === 'unknown')) return '';
    const marks = [...days].sort((a, b) => a.date.localeCompare(b.date)).map(day => {
      const state = dayTier(day);
      const label = `${U.date(day.date)} ${labels[state] || (day.started ? '跑过，结果未确认' : dayReason(day) || (state === 'none' && day.coverage_complete === true ? '这天没跑' : dayMissing))}${['mostly', 'partial'].includes(state) ? tierCounts(day.outcome) : ''}`;
      return state == null || state === 'unknown' ? `<span class="rec-none" data-state="unknown" aria-label="${esc(label)}" title="${esc(label)}">—</span>` : `<button class="task-day" type="button" data-state="${esc(state)}" aria-label="${esc(label)}"><span class="task-day-tip">${esc(label)}</span></button>`;
    });
    return `<div class="task-week"><div class="task-days" role="group" aria-label="近 7 天${d.days7_from ? `，记录从 ${U.date(d.days7_from)} ${U.time(d.days7_from)} 起` : ''}" data-from="${esc(d.days7_from || '')}">${marks.join('')}</div></div>`;
  }
  function taskName(t) {
    if (viewer === 'public' && (t.visibility === 'owner' || t.public === 'owner' || t.hidden || t.hidden_block || t.content_locked)) return { visibility: 'owner' };
    if (Object.hasOwn(t, 'display_name')) return t.display_name;
    const raw = t.name;
    if (typeof raw !== 'string' || /(?:仅本人可见|可信设备可见|正在换说法)$/.test(raw.trim())) return raw;
    if (raw === 'PlatformExperiencesHelper_DeleteShortcut') return '系统快捷方式清理';
    if (!/[\u3400-\u9fff]/.test(raw) && (/[\\_]|^[a-z]{2,}(?:[A-Z][a-z]+){2,}$/.test(raw) || /^[\da-f]{8}-[\da-f-]{27}$/i.test(raw))) {
      return typeof t.project_name === 'string' && t.project_name.trim() || '用途未登记的任务';
    }
    return raw;
  }
  const changeName = c => {
    const name = taskName(c), raw = typeof c.name === 'string' ? c.name.replace(/\s+[\da-f]{8}$/i, '') : '';
    if (name === '用途未登记的任务' && raw) return `用途未登记的任务（${raw}）`;
    return typeof name === 'string' && !/[\u3400-\u9fff]/.test(name) ? name.replace(/\s+[\da-f]{8}$/i, '') : name;
  };
  const stateDot = (value, label = '') => `<i class="task-state-dot" data-state="${value}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}></i>`;
  const shortStatus = { ok: '成功', failed: '出错', warn: '要留意', running: '正在跑', disabled: '停用', never: '没跑过', unknown: '没读到' };
  const ended = last => Number.isFinite(Date.parse(last?.end));
  const retainedResult = t => Number.isFinite(Date.parse(t.last_read_at)) && (ended(t.last) || ['ok', 'failed', 'warn'].includes(t.last?.result));
  function taskState(t) {
    if (t.enabled === false || t.state === 'disabled' || t.not_running_reason === 'disabled') return 'disabled';
    if (t.source_readable === false) return 'unknown';
    if (t.not_running_reason === 'never') return 'never';
    if (t.state === 'failed') return 'failed';
    if (t.state === 'warn') return 'warn';
    return { running: 'running', success: 'ok', never: 'never' }[t.state]
      || (['ok', 'failed'].includes(t.last?.result) ? t.last.result : 'unknown');
  }
  function task(t, coverage) {
    const detail = route(`/live/task/?id=${encodeURIComponent(t.id)}`), last = t.last, lastAt = last?.start || last?.end;
    const resultKey = last?.result || t.result || ({ failed: 'failed', running: 'running' })[t.state] || '';
    const result = { ok: '跑成', failed: '没跑成', running: '正在跑', unknown: '结果不明' }[last?.result || t.result] || { failed: '没跑成', warn: '要留意', late: '晚了', running: '正在跑' }[t.state] || (U.offline?.() ? '' : U.collectionText());
    const hidden = viewer === 'public' && (t.visibility === 'owner' || t.public === 'owner' || t.hidden);
    const text = typeof t.text === 'string' ? t.text.replace(/^(?:\d{2}:\d{2}\s*)?(?:没跑成|跑成)\s*[·，:：]\s*/, '') : t.text;
    const privateField = v => v && typeof v === 'object' && (v.hidden || v.visibility === 'owner' || v.public === 'owner') && v.text == null && v.value == null;
    // 说明只露一句：取第一句，全文放在悬停提示里，点进详情看
    const sentence = typeof text === 'string' ? (text.match(/^[\s\S]*?[。！!？?\n](?=\s*\S)/)?.[0].trim() || text) : text;
    const description = [text && !privateField(t.text) && U.fieldHtml(sentence, { name: '说明', place: 'body', kind: viewer }), (privateField(t.project_name) || privateField(t.text)) && U.fieldHtml({ ...(privateField(t.text) ? t.text : t.project_name), hidden_what: '说明' }, { name: '说明', place: 'body', kind: viewer })].filter(Boolean);
    const projectName = !hidden && t.project_name && !privateField(t.project_name) ? U.fieldHtml(t.project_name, { name: '项目', place: 'body', kind: viewer }) : '';
    const projectCell = projectName && linkedProject(t.project) ? `<a class="lb-link" href="${esc(route(`/live/project/?id=${encodeURIComponent(t.project)}`))}">${projectName}</a>` : projectName;
    const reason = notRunningReason(t) || (t.state === 'disabled' ? '停用' : '');
    const plan = t.schedule ? U.fieldHtml(t.schedule, { name: '运行周期', place: 'body', kind: viewer }) : '';
    // 近 7 天每天的小方块只给出过事的任务画；正常的只写时间和结果
    const trouble = Array.isArray(t.days7) && t.days7.some(dayTrouble);
    const field = (value, name) => U.fieldHtml(value, { name, kind: viewer });
    const outcome = field(Object.hasOwn(t, 'status_text') ? t.status_text : result, '运行结果');
    const lastCell = [lastAt && `<span aria-label="上次${last.start ? '运行' : '结束'} ${esc(stamp(lastAt))}">${stamp(lastAt)}</span>`, (outcome || trouble) && `<span class="lb-run"><span data-task-state data-result="${esc(resultKey)}">${outcome}</span>${trouble ? week(t) : ''}</span>`];
    const next = taskNext(t), nextField = Object.hasOwn(t, 'next_at') ? t.next_at : t.next;
    const nextText = next ? nextAt(next) : nextField ? field(nextField, '下次运行') : reason || MODE[t.mode] || '';
    const name = taskName(t), title = U.fieldHtml(name || '自动任务', { name: '自动任务', place: 'title', kind: viewer });
    if (!maintenance) {
      const state = taskState(t), lastState = lastAt ? last?.result || 'unknown' : state === 'never' ? 'never' : '';
      const failed = confirmedFailure(t), shownAt = failed ? last.end || lastAt : lastAt;
      const oldAt = Number.isFinite(Date.parse(t.last_read_at)) ? stamp(t.last_read_at) : '';
      const oldNext = oldAt && Number.isFinite(Date.parse(t.last_read_next_at)) ? `原定 ${nextAt(t.last_read_next_at)} · ${oldAt} 的安排` : '';
      const scheduled = state === 'disabled' ? '停用' : next ? nextAt(next) : oldNext
        || (MODE[t.mode] || (t.not_running_reason === 'on_demand' ? '按需' : triggerWhen(t) || '没读到'));
      const triggerTitle = !next && Array.isArray(t.trigger_types) && t.trigger_types.length ? ` title="${esc(`触发方式：${t.trigger_types.join('、')}`)}"` : '';
      // 这轮未更新时，仍显示后端保留的上次结果及读数时刻。
      const shown = t.source_readable === false && !retainedResult(t) ? 'unread' : state === 'warn' ? 'warn' : lastState;
      // 上次那一轮只做完一部分（last.result=warn，M381）写“部分完成”，黄点照旧
      const lastWord = shown === 'unread' ? '这次没读到' : shown === 'warn' ? lastState === 'warn' ? '部分完成' : shortStatus.warn
        : lastState === 'unknown' ? ended(last) ? '已结束，结果未确认' : state === 'disabled' ? '停用前结果不明' : unknownWhy(t) || shortStatus.unknown : shortStatus[lastState] || shortStatus.unknown;
      const lastTitle = shown === 'warn' ? ` title="${esc(warnWhy(t))}"` : (shown === 'unread' || lastState === 'unknown') && typeof t.status_text === 'string' ? ` title="${esc(t.status_text)}"` : '';
      const why = (failed || shown === 'warn') && !hidden ? `<p class="lb-sub task-why">${U.fieldHtml(failed ? t.problem_reason ?? last.reason ?? t.why : warnWhy(t), { name: '原因', place: 'body', kind: viewer })}</p>` : '';
      const registeredPurpose = t.purpose ?? sentence;
      const purposeText = typeof registeredPurpose === 'string' ? registeredPurpose.split(/[。；，]/u, 1)[0].trim() : registeredPurpose;
      const purpose = !hidden && purposeText && (typeof purposeText !== 'string' || !/^(?:在跑|正在跑|到点没跑|已停用|停用|所需状态未读到)$/u.test(purposeText))
        ? field(purposeText, '用途') : description[1] || projectName;
      const fullPurpose = !hidden ? U.fieldText(registeredPurpose ?? t.project_name, viewer) : '';
      // 备份任务：后台给了最近一次核验过的备份（如“最近已核验备份 11-23 01:40，大部分成功，有文件跳过”）就单列一行，上次运行那格照旧（M607）
      const verified = t.last_verified_backup?.text != null ? `<p class="lb-sub task-verified">${field(t.last_verified_backup.text, '最近已核验备份')}</p>` : '';
      // 后台标了这一项 AI 已接手在修（ai_fixing，灯是蓝的）：行灯换成蓝的，名字下写“AI 在修”，和页头“AI 在修 N 件”、工作详情一个说法；上次运行那格照旧写上次的结果（M159）
      const fixing = t.ai_fixing === true || t.level === 'blue';
      const fixAt = fixing && taskNext({ next_at: t.ai_next_at });
      const fixNote = fixing ? `<p class="lb-sub task-fixing">AI 在修${fixAt ? ` · ${esc(nextAt(fixAt))} 接着修` : ''}</p>` : '';
      // 两版同一套按钮（本人禁令 11-24 14:16）：访客也摆“问情况”，点了由共用拦截弹可信设备说明框
      const actions = U.actions(t, t.actions || [{ kind: 'copy', label: '问情况', intent: 'ask' }]);
      const outcomeDot = failed ? stateDot('warn') : stateDot(shown === 'unread' ? 'unknown' : shown);
      const running = failed && state === 'running' ? `<span data-task-state>${stateDot('running')}${shortStatus.running}</span>` : '';
      return { key: t.id, cls: `row row--flat lb-row task-compact${attention(t) ? ' is-attention' : ''}${fixing ? ' is-fixing' : ''}`, html:
        `<span class="lb-row__lamp">${failed ? stateDot('warn', '上次运行失败') : fixing ? stateDot('fixing', 'AI 在修') : stateDot(state, shortStatus[state])}</span><div class="lb-cell lb-cell--name"><p><a class="row__title" href="${esc(detail)}">${keepTaskWords(title)}</a></p>${purpose ? `<p class="lb-sub task-purpose" title="${esc(fullPurpose)}">${keepTaskWords(purpose)}</p>` : ''}${verified}${fixNote}${keepTaskWords(why)}</div>
        <div class="lb-cell lb-cell--time task-last">${shownAt ? `<time>${stamp(shownAt)}</time>` : ''}${lastState ? `<span data-task-state${lastTitle}>${outcomeDot}${esc(failed ? shortStatus.failed : lastWord)}</span>` : '—'}${oldAt && shown !== 'unread' && lastState ? `<small>截至 ${esc(oldAt)}</small>` : ''}${running}${trouble ? week(t) : ''}</div>
        <div class="lb-cell lb-cell--time"><span data-task-state${triggerTitle}>${esc(scheduled)}</span></div><div class="row__acts">${actions}</div>` };
    }
    const nameBody = U.fieldHtml(name, { name: '自动任务', kind: viewer, marker: true });
    const nameNote = (/live-mark|trust-note/.test(nameBody) ? nameBody.slice(nameBody.startsWith(`${title} `) ? title.length + 1 : 0) : '') || U.visitorLabel(t, ['$', 'name', 'display_name'], '这个任务的名字', viewer);
    const status = U.status(t, { small: true });
    const unreliable = Array.isArray(coverage) && coverage.some(c => c?.id === t.id && c.reliable === false);
    const note = (!description.length || ['red', 'amber', 'blue'].includes(status.tone)) && status.note !== outcome && !/^(?:数据截止|这次没读到|没有记录)/.test(status.note) && status.note;
    const extra = [nameNote && `<span class="row__meta">${nameNote}</span>`, maintenance && Number.isInteger(t.rounds) && `已观察到 ${t.rounds} 次`, t.source_readable === false && '已登记，这次没读到运行状态', note, unreliable && '这段运行记录不可靠', t.ledger_id && `<a class="lb-link" href="${esc(route(`/live/issue/?id=${encodeURIComponent(t.ledger_id)}`))}">关联账本 ›</a>`].filter(Boolean).join(' · ');
    const rawName = t.name && !hidden && t.name !== name && (viewer === 'owner' || typeof name === 'string' && name.trim() && !/(?:仅本人可见|可信设备可见|正在换说法)$/.test(name.trim()));
    const facts = [rawName && `原名称：${field(t.name, '原名称')}`, plan && `原调度：${plan}`, t.at && `明细采集：${stamp(t.at)}`, t.duration && taskDuration(t.duration)].filter(Boolean);
    return { key: t.id, cls: `row row--flat lb-row${attention(t) ? ' is-attention' : ''}`, html: `<span class="lb-row__lamp">${status.lamp}</span><div class="lb-cell lb-cell--name"><p class="lb-clip"><a class="row__title" href="${esc(detail)}">${title}</a></p>${projectCell ? `<p class="lb-sub lb-clip1">${projectCell}</p>` : ''}</div><p class="lb-cell lb-clip"${typeof text === 'string' && !privateField(t.text) ? ` title="${esc(text)}"` : ''}>${description.join(' ')}</p><div class="lb-cell lb-cell--time">${lastCell.filter(Boolean).join('')}</div><div class="lb-cell lb-cell--time">${nextText ? `<span>${nextText}</span>` : ''}</div><div class="row__acts">${U.actions(t, t.actions || [{ kind: 'copy', label: '问情况', intent: 'ask' }])}</div>${extra ? `<p class="lb-row__extra row__sub">${extra}</p>` : ''}${facts.length ? `<details class="lb-row__extra"><summary class="lb-link">运行详情</summary><p>${facts.join(' · ')}</p></details>` : ''}` };
  }
  function taskDuration(d) {
    if (!d) return '';
    const seconds = n => `${Number(n.toFixed(1))} 秒`;
    return [d.median_seconds != null && `典型耗时 ${seconds(d.median_seconds)}`, d.samples != null && `有效样本 ${d.samples} 轮`, d.elapsed_seconds != null && `<span data-task-state>本轮已跑 ${seconds(d.elapsed_seconds)}</span>`, d.gap && U.fieldHtml(d.gap, { kind: viewer })].filter(Boolean).join(' · ');
  }
  function groupCount(group, loaded, incomplete = false) {
    if (maintenance) return `${incomplete ? '已读到' : '共'} ${loaded} 种动作`;
    if (group?.total != null) return `共 ${group.total} 项`;
    return `已读到 ${group?.known_total ?? loaded} 项`;
  }
  function registeredGroup(group) { return group?.count != null && !Object.hasOwn(group, 'total') && !Object.hasOwn(group, 'known_total') ? { ...group, total: group.count } : group; }
  function purposeCount(d, cell) {
    return d?.purpose_unregistered_count == null ? '' : cell('unregistered', 'gear', esc(d.purpose_unregistered_count), '<span title="任务清单里还没写明这项是做什么用的（按已读到的 Windows 任务计）">项没写用途</span>');
  }

  function waiting(text, revoked = false) {
    for (const s of sections.values()) {
      s.el.hidden = s.more.hidden = true;
      if (revoked) clearGroupRows(s);
      else { U.list(s.main, empty(text)); U.list(s.rest, []); }
    }
    board?.layout();
    let ul = $('task-empty') || (!sections.size ? $('groups').querySelector('ul') : null);
    if (!ul) { ul = document.createElement('ul'); ul.className = 'rows list'; ul.id = 'task-empty'; $('groups').append(ul); }
    ul.hidden = revoked; U.list(ul, revoked ? [] : empty(text));
    U.html($('coverage'), revoked ? '' : U.fieldHtml(text, { name: '读取情况', place: 'body', kind: viewer }));
    U.html(changesTitle, '任务变化');
    if (revoked) $('changes').replaceChildren(); else U.list($('changes'), empty(text));
    showChangeEmpty(revoked ? '' : text);
    $('next').hidden = true;
    const upcoming = $('upcoming'); if (upcoming) upcoming.hidden = true;
  }
  function clearGroupRows(s) {
    for (const el of [s.main, s.rest, s.sub]) el.replaceChildren();
  }
  const updating = '计划任务正在更新访客版，稍后自动补上。';
  const nextPage = $('next'), nextLabel = nextPage.textContent;
  const GROUP_STEP = 10;
  const keepGroupWords = html => html.replace(/<[^>]+>|计划任务|计划|任务/g, word =>
    word.startsWith('<') ? word : `<span class="task-phrase">${word}</span>`);
  function showChangeEmpty(text) {
    const show = maintenance && !!text, panel = $('changes-empty');
    panel.hidden = !show;
    $('changes-box').hidden = show;
    if (show) {
      panel.querySelector('.part').textContent = changesTitle.textContent;
      U.list(panel.querySelector('ul'), empty(text));
    }
  }
  function drawGroup(s) {
    if (!s.groupRows) return;
    const all = [...new Map([...s.groupRows, ...(s.loadedRows || [])].map(t => [t.id, t])).values()].filter(t => !s.preview.has(t.id));
    const remaining = Math.max(all.length, s.size - s.preview.size);
    const remote = s.remote && (s.loadedRows == null || s.cursor != null);
    const flat = !remote && all.length === 1 && !U.shouldFold(remaining);
    const left = remaining - all.length;
    const main = s.groupRows.slice(0, s.preview.size);
    U.list(s.main, (flat ? main.concat(all) : main).map(s.rowOf));
    U.list(s.rest, flat ? [] : all.map(s.rowOf));
    s.more.hidden = !remaining || flat;
    s.next.hidden = !remote;
    if (!s.next.disabled) s.next.textContent = s.failed ? s.failed === updating ? updating : '这批没读到，再试一次 ›'
      : left > 0 ? `再看 ${Math.min(GROUP_STEP, left)} 条（还有 ${left} 条） ›` : '继续看 ›';
  }
  async function loadGroup(id, append = false) {
    const s = sections.get(id), ticket = generation;
    if (!s.remote) return true;
    if (s.next.disabled) return false;
    const text = s.loadedRows != null || s.failed ? s.next : s.more.querySelector('.lb-more__shut'), label = text.textContent;
    s.next.disabled = true;
    text.textContent = '正在读…';
    let loaded = false, revoked = false;
    try {
      const r = await window.Live.get('tasks', { scope, project, q: query || null, group: id, cursor: append ? s.cursor : null });
      if (ticket === generation && r.meta?.publicationRevoked) {
        revoked = true;
        if (!append) { s.loadedRows = null; s.cursor = null; }
        return false;
      }
      if (ticket !== generation || r.meta?.viewer?.kind !== viewer || r.meta?.at !== batchAt || !maintenance && !scheduledPacket(r.data)) return false;
      U.blockNote(s.el, { fallbackNote: readingNote(r) });
      if (!Array.isArray(r.data?.items)) return false;
      s.loadedRows = [...new Map([...(append ? s.loadedRows : []), ...(taskGroups({ task_purpose_catalog: page?.task_purpose_catalog }, r.data.items).get(id) || [])].map(t => [t.id, t])).values()];
      s.cursor = r.data.next !== s.cursor ? r.data.next : null;
      loaded = s.box._loaded = true;
      return true;
    } finally {
      s.next.disabled = false; text.textContent = label;
      if (ticket === generation) {
        s.failed = revoked ? updating : !loaded;
        drawGroup(s); L.lightUp([s.el]); taskWords();
      }
    }
  }
  function render(d, append = false) {
    function changeDetail(c) {
      if (typeof c.owner_detail !== 'string' || !c.owner_detail.trim()) return '';
      return `<details data-fold-anchor><summary>变更详情</summary><p class="row__sub">${keepTaskWords(U.nowrap(c.owner_detail))}</p></details>`;
    }
    if (d?.q === 'warming') { page = d; waiting('正在准备'); taskHead(); groupsRead.done(); changesRead.done(); return; }
    if (d && !maintenance && !scheduledPacket(d)) {
      page = null; rows = []; dataAt = null;
      waiting('当前数据还不能单独核对 Windows 登记，等任务名册更新。');
      U.html($('head'), U.head('Windows 计划任务名册这次没读到')); groupsRead.done(false); changesRead.done(false); heroRead.done(false); return;
    }
    page = append ? { ...page, next: d.next } : d; const received = fixture && scope === 'ai-today' && d?.ai_today ? d.ai_today : d?.items ?? (d?.groups?.some(g => Array.isArray(g.items)) ? d.groups.flatMap(g => g.items || []) : null);
    $('groups').dataset.audience = viewer;
    if (received == null) { waiting(U.collectionText('任务', d)); taskHead(); if (d != null) { groupsRead.done(false); changesRead.done(false); } return; }
    d = page;
    const incoming = received || []; rows = append ? [...new Map([...rows, ...incoming].map(t => [t.id, t])).values()] : incoming;
    const shown = U.order(fixture ? rows.filter(t => (!project || t.project === project) && sp(t.name).toLowerCase().includes(query.toLowerCase())) : rows, attention, `tasks:${scope || ''}:${project || ''}:${query}`);
    const groups = taskGroups(page, shown);
    const labels = new Map((page?.groups || d?.groups || []).map(g => [g.id, g.name || g.label || g.id]));
    if (!board) { $('groups').replaceChildren(); board = window.LiveBoard.create($('groups'), { columns: COLUMNS }); }
    let cards = 0;
    for (const [id, list] of groups) {
      const visible = Math.min(5, list.length);
      if (!sections.has(id)) {
        const c = board.card(id, look(id)); sections.set(id, c);
        U.fold(c.more, c.box, () => loadGroup(id), true);
        c.next.addEventListener('click', () => loadGroup(id, c.cursor != null));
      }
      const group = registeredGroup((page.groups || []).find(g => g.id === id));
      const groupName = group?.name || group?.label || group?.title || group?.text;
      const incomplete = page.next != null && page.next !== '' || page.task_list_complete === false || group?.q === 'partial' || maintenance && page.q !== 'ok';
      const count = groupCount(group, list.length, incomplete), size = maintenance ? list.length : group?.total ?? group?.known_total ?? list.length;
      const gap = group?.gap || (group?.q === 'partial' && group?.total == null ? U.collectionText('这一组的件数', group) : '');
      const groupHidden = viewer === 'public' && groupName && typeof groupName === 'object' && (groupName.hidden || groupName.visibility === 'owner' || groupName.public === 'owner' || groupName.rewrite === 'pending') && groupName.text == null && groupName.value == null;
      const s = sections.get(id); s.remote = Array.isArray(group?.items) && list.length < size; s.preview = new Set(list.slice(0, visible).map(t => t.id));
      const bare = (maintenance || group?.total === 0) && !list.length; s.el.hidden = bare; if (!bare) cards++;
      const name = (typeof LOOK === 'undefined' || !Object.hasOwn(LOOK, id) ? null : LOOK[id].name) || groupName || groups.labels?.get(id) || labels.get(id) || (id === 'ai-today' ? '今天 AI 后台自动维护' : id === 'other' ? '其他' : id), status = U.status(group);
      s.label = `${sp(name)}（${count}）`;
      U.html(s.title, `<b>${keepGroupWords(U.fieldHtml(name, { name: '任务分组', place: 'label', kind: viewer }))}</b><span class="lb-card__count">${U.fieldHtml(count, { kind: viewer })}</span>${status.lamp}`);
      // 卡头第二行：有缺口、有灯的原因先写；都没有就写这一组排在前面的几件
      const names = list.slice(0, 3).filter(t => viewer === 'owner' || !(t.hidden || t.hidden_block || t.content_locked)).map(t => U.fieldText(taskName(t), viewer)).filter(name => name && !/(?:仅本人可见|可信设备可见|正在换说法)$/.test(name.trim()));
      const about = [gap && U.fieldHtml(gap, { kind: viewer }), status.note, groupHidden && U.fieldHtml(groupName, { name: '任务分组', place: 'body', kind: viewer }), scope === 'ai-today' && group?.project_name && U.fieldHtml(group.project_name, { name: '项目', place: 'body', kind: viewer })].filter(Boolean);
      U.html(s.sub, keepGroupWords(about.length ? about.join(' · ') : names.length ? `${U.fieldHtml(names.join('、'), { kind: viewer })}${size > names.length ? ' 等' : ''}` : ''));
      const row = t => task(t, page.coverage);
      const remaining = Math.max(0, Math.max(size, list.length) - visible);
      s.groupRows = list; s.size = size; s.rowOf = row;
      drawGroup(s);
      U.html(s.more, `<span class="lb-more__open">${incomplete && group?.total == null ? '展开' : `展开（还有 ${remaining} 条）`}</span><span class="lb-more__shut">收起</span> <span class="more__chev">›</span>`);
    }
    for (const [id, s] of sections) if (!groups.has(id)) s.el.hidden = true;
    const vendor = sections.get('vendor'), disabled = sections.get('disabled');
    const besideVendor = vendor && disabled && !vendor.el.hidden && !disabled.el.hidden;
    board.el.classList.toggle('task-pair', !!besideVendor);
    if (besideVendor && vendor.el.nextElementSibling !== disabled.el) vendor.el.after(disabled.el);
    const tail = [...board.el.children].filter(el => !el.hidden).at(-1);
    for (const s of sections.values()) {
      const full = s === disabled ? !besideVendor : cards > 1 && cards % 3 === 1 && s.el === tail;
      s.el.classList.toggle('task-full', !maintenance && full);
    }
    board.layout(); pickGroup(); pickProjects();
    const rounds = maintenanceRounds(d);
    const noTasks = maintenance && (d.q !== 'ok' || rounds !== 0)
      ? (Number.isInteger(rounds) && rounds > 0 ? '维护明细这次没读全' : '还没读到维护明细')
      : query ? '没有这个名字的任务' : maintenance ? `${project ? '这个项目' : ''}今天没有 AI 后台自动维护` : '没有任务';
    let none = $('task-empty'); if (!none) { none = document.createElement('ul'); none.className = 'rows list'; none.id = 'task-empty'; $('groups').append(none); } none.hidden = cards > 0; U.list(none, empty(noTasks));
    const ranges = Array.isArray(d.coverage) ? d.coverage : [];
    const plainSources = { '部分宿主运行尚无模型执行证据': '有些任务跑了，但还没对上 AI 实际干活的记录' };
    const missing = (d.missing_sources || []).map(s => typeof s === 'string' ? plainSources[s] || s : s.text || s.name || s);
    const partial = d.q === 'partial' || d.coverage?.q === 'partial' || ranges.some(c => c.complete === false) || missing.length;
    const wording = ranges.length ? ranges.map(c => c.text).filter(Boolean) : [d.coverage?.text].filter(Boolean);
    const text = wording.flatMap(value => typeof value === 'object' ? [value] : value.split(/[，；,;]/).filter(s => /还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|有缺口|不完整/.test(s)));
    const runtimeMissing = rows.filter(t => t.source_readable === false && !retainedResult(t)).length;
    coverageNote = !maintenance && runtimeMissing ? `${runtimeMissing} 项这次没读到运行状态`
      : !maintenance && d.unreadable_total > 0 ? '部分已登记任务的运行状态没读到'
      : partial && !U.offline?.() ? text.length ? text : missing.length ? missing : [received.length ? '运行记录覆盖不完整' : '任务运行记录没读到'] : [];
    $('coverage-label').hidden = $('coverage').hidden = true;
    // 新私事规则（本人 11-24 02:56）：访客侧不再写“另有 N 个……仅本人可见”。
    const sideHidden = false;
    $('sources').hidden = !sideHidden;
    U.list($('sources'), sideHidden ? [{ key: 'hidden', cls: 'row row--flat', html: `<p class="row__sub">另有 ${d.hidden} 个${U.fieldHtml(d.hidden_what || '任务', { name: '任务', place: 'label', kind: viewer })}，${U.fieldHtml({ hidden: 1 }, { place: 'body', kind: viewer })}</p>` }] : []);
    const moved = changeCounts(page);
    U.html(changesTitle, moved?.title || '任务变化');
    const detailLock = viewer === 'public' && Array.isArray(d.changes7) && d.changes7.length && !d.changes7.some(c => typeof c.owner_detail === 'string')
      ? [{ key: 'detail-lock', cls: 'row row--flat', html: `<span></span><p class="row__sub">${U.fieldHtml({ value: null, visibility: 'owner', hidden_what: '每条变化的详情（任务在电脑上的原名和最近运行时间）' }, { place: 'body', kind: viewer })}</p>` }] : [];
    const changeEmpty = maintenance && !Object.hasOwn(d, 'changes7') ? '任务变化在计划任务页查看。'
      : !Array.isArray(d.changes7) ? '任务变更记录这次没读到' : !d.changes7.length ? moved.empty : '';
    showChangeEmpty(changeEmpty);
    U.list($('changes'), changeEmpty ? empty(changeEmpty) : [...detailLock, ...d.changes7.map(c => ({
      key: c.id, cls: 'row row--flat',
      html: `<span></span><div class="row__text"><p class="row__main"><a class="row__title" href="${esc(route(`/live/task/?id=${encodeURIComponent(c.id)}`))}">${keepTaskWords(U.fieldHtml(changeName(c) || '自动任务', { name: '自动任务', place: 'title', kind: viewer }))}</a><span class="row__meta">${keepTaskWords(U.nowrap({ added: '新增', disabled: '停用了', missing: '现在找不到', enabled: typeof c.label === 'string' && c.label || '又开启' }[c.kind] || '有变化'))} · ${U.nowrap(stamp(c.at))}</span></p>${changeDetail(c)}</div>`,
    }))]);
    taskHead(moved);
    cursor = d.next; nextPage.hidden = !cursor; nextPage.textContent = nextLabel; groupsRead.done(); changesRead.done(); L.lightUp([hero, $('groups'), $('changes')]);
    if (!maintenance) drawUpcoming(listedTasks(groups)); U.land(); taskWords();
  }
  async function readAllTasks(first, fetchPage, limit = 10) {
    let full = first;
    for (let n = 1; full?.next != null && full.next !== '' && n < limit; n++) {
      let r; try { r = await fetchPage(full.next); } catch { break; }
      if (!Array.isArray(r?.data?.items) || !maintenance && !scheduledPacket(r.data)) break;
      full = { ...full, items: [...new Map([...(full.items || []), ...r.data.items].map(t => [t.id, t])).values()], next: r.data.next };
    }
    return full;
  }
  function taskNext(t) {
    const value = Object.hasOwn(t, 'next_at') ? t.next_at : t.next;
    const at = value && typeof value === 'object' ? U.fieldText(value, viewer) : value;
    return Number.isFinite(Date.parse(at)) ? at : null;
  }
  function upcomingTasks(items, at) {
    const start = Date.parse(at), runAt = t => Date.parse(taskNext(t));
    return items.filter(t => taskState(t) !== 'disabled' && runAt(t) > start && runAt(t) <= start + 86400000)
      .sort((a, b) => runAt(a) - runAt(b));
  }
  function drawUpcoming(items) {
    const list = dataAt ? upcomingTasks(page?.upcoming ?? items, dataAt) : [], box = $('upcoming');
    const complete = dataAt && page?.unreadable_total === 0 && (Array.isArray(page?.upcoming) || !page?.next && page?.total != null);
    box.hidden = false;
    box.querySelector('.part').textContent = dataAt ? `${complete ? '24 小时排程' : '已读到的排程'} · ${nextAt(dataAt)} 起${complete ? '' : ' 24 小时'}` : '24 小时排程';
    const entry = t => ({ key: t.id, cls: 'row row--flat', html: `<time class="row__meta" datetime="${esc(taskNext(t))}">${nextAt(taskNext(t))}</time><a class="row__title" href="${esc(route(`/live/task/?id=${encodeURIComponent(t.id)}`))}">${keepTaskWords(U.fieldHtml(taskName(t), { name: '自动任务', place: 'title', kind: viewer }))}</a>` });
    const split = U.shouldFold(list.length - 6) ? 6 : list.length;
    const firstRows = list.length ? list.slice(0, split).map(entry) : empty(complete ? '没有排定运行的任务' : '下次运行时间这次没读全');
    if (!list.length && !complete) firstRows[0].html = firstRows[0].html.replace(/下次运行时间|这次没读全/g, '<span class="task-phrase">$&</span>');
    U.list(box.querySelector('ul'), firstRows, { animate: false });
    U.list(box.querySelector('details ul'), list.slice(split).map(entry), { animate: false });
    box.querySelector('details').hidden = list.length === split;
    const moreLabel = `<span class="disclosure-closed">再看 ${list.length - 6} 个</span><span class="disclosure-open">收起</span><span class="disclosure-chev" aria-hidden="true">›</span>`;
    const summary = box.querySelector('summary'); if (summary.innerHTML !== moreLabel) summary.innerHTML = moreLabel;
  }
  const listedTasks = groups => [...new Map([...groups.values()].flat().map(t => [t.id, t])).values()];
  function taskGroups(d, shown) {
    const groups = new Map();
    groups.labels = new Map();
    const catalog = d.task_purpose_catalog || {};
    const purposes = catalog.purposes || catalog;
    const entries = Array.isArray(purposes) ? purposes : Object.entries(purposes).map(([id, value]) => ({ id, ...(typeof value === 'object' ? value : { group: value }) }));
    const catalogGroups = catalog.groups || [];
    for (const group of Array.isArray(catalogGroups) ? catalogGroups : Object.entries(catalogGroups).map(([id, value]) => ({ id, ...(typeof value === 'object' ? value : { name: value }) }))) groups.labels.set(group.id, group.name || group.label || group.title || group.text || group.id);
    const members = new Map(shown.map(t => [t.id, t]));
    for (const g of maintenance ? [] : d.groups || []) {
      if (g.id === 'not_running') continue;
      for (const t of g.items || []) if (!members.has(t.id)) members.set(t.id, { group: g.id, ...t });
    }
    for (const t of members.values()) {
      const purpose = typeof t.purpose === 'object' ? t.purpose : entries.find(p => p.id === t.purpose);
      const group = Object.hasOwn(t, 'group') ? t.group : purpose?.group || t.purpose;
      const id = typeof group === 'object' ? group?.id : group;
      const key = !maintenance && taskState(t) === 'disabled' ? 'disabled'
        : id && id !== 'not_running' ? id : maintenance ? 'ai-today' : 'other';
      const label = (typeof group === 'object' ? group?.name || group?.label || group?.title || group?.text : null) || t.group_name || t.group_label || purpose?.group_name;
      if (label) groups.labels.set(key, label);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(t);
    }
    for (const g of d.groups || []) if (g.id !== 'not_running' && !groups.has(g.id) && (Array.isArray(g.items) || g.total != null || g.known_total != null)) groups.set(g.id, []);
    if (groups.has('disabled')) {
      const stopped = groups.get('disabled'); groups.delete('disabled'); groups.set('disabled', stopped);
    }
    return groups;
  }
  // “全部分组”：只看一组时这一组整宽摆开、自动展开；记在网址的 group= 里，刷新、分享都还在
  function pickGroup() {
    const sel = $('group-pick'), list = [...sections].filter(([, s]) => !s.el.hidden)
      .sort(([a], [b]) => Number(a === 'disabled') - Number(b === 'disabled'));
    const key = list.map(([id, s]) => `${id}\u0001${s.label}`).join('\u0002');
    if (sel.dataset.key !== key) { sel.dataset.key = key; sel.replaceChildren(new Option('全部分组', ''), ...list.map(([id, s]) => new Option(s.label, id))); }
    const want = pick && list.some(([id]) => id === pick) ? pick : '';
    sel.value = want;
    if (board.single !== (want || null)) {
      const c = board.only(want || null), s = want && sections.get(want);
      if (s && !s.more.hidden && s.more.getAttribute('aria-expanded') !== 'true') s.more.click();
      if (c && document.readyState === 'complete') c.el.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }
  $('group-pick').addEventListener('change', e => {
    pick = e.target.value; const u = new URL(location.href); pick ? u.searchParams.set('group', pick) : u.searchParams.delete('group'); history.replaceState(history.state, '', u);
    if (board) pickGroup();
  });
  // “全部项目”：读到的任务里出现过的项目，加上项目清单里在用的项目；选了就带 project= 重开这一页
  function pickProjects() {
    if (projectList === null) { projectList = []; Promise.resolve(window.Live.get?.('projects', { state: 'active' })).then(r => { projectList = Array.isArray(r?.data?.items) ? r.data.items : []; pickProjects(); }).catch(() => {}); }
    const open = v => v != null && v !== '' && !(typeof v === 'object' && (v.hidden || v.visibility === 'owner' || v.public === 'owner' || v.rewrite === 'pending') && v.text == null && v.value == null);
    const seen = new Map();
    for (const t of [...rows, ...[...sections.values()].flatMap(s => s.loadedRows || [])]) if (typeof t.project === 'string' && t.project && open(t.project_name) && !(viewer === 'public' && t.visibility === 'owner')) seen.set(t.project, sp(t.project_name));
    for (const it of projectList) if (typeof it.id === 'string' && open(it.name) && !seen.has(it.id)) seen.set(it.id, sp(it.name));
    if (project && !seen.has(project)) seen.set(project, open(page?.project_name) ? sp(page.project_name) : '当前项目');
    const list = [...seen].sort((a, b) => a[1].localeCompare(b[1], 'zh-CN')), key = list.map(x => x.join('\u0001')).join('\u0002'), sel = $('project-pick');
    if (key !== projectKey) { projectKey = key; sel.replaceChildren(new Option('全部项目', ''), ...list.map(([id, name]) => new Option(name, id))); }
    sel.value = project || '';
  }
  $('project-pick').addEventListener('change', e => { const u = new URL(location.href); e.target.value ? u.searchParams.set('project', e.target.value) : u.searchParams.delete('project'); u.searchParams.delete('group'); location.assign(u.pathname + u.search + u.hash); });
  function readingNote(s, alreadyAt) {
    const note = s.fallbackNote || s.meta?.fallbackNote || '';
    const source = s.data?.source_at ?? s.data?.at ?? s.shownAt ?? s.meta?.at;
    if (note && s.data && s.meta?.source !== 'fallback' && Number.isFinite(Date.parse(source))) {
      return Date.parse(source) === Date.parse(alreadyAt) ? '' : `清单来源截至 ${stamp(source)}`;
    }
    return note.replace(/^数据截止 /, '清单来源截至 ');
  }
  function link(s) {
    const dayChanged = s.now && U.date(s.now) !== U.date(now);
    now = s.now || now; if (dayChanged && page) render(page);
    bar?.set(s); L.offline(s.offline);
    U.list($('notices'), s.offline ? [{ key: 'offline', cls: 'notice glass', html: `<span class="lamp" aria-hidden="true"></span><span>${U.fieldHtml(s.text, { name: '连接情况', place: 'body', kind: viewer })}</span>` }] : []);
    if (s.meta?.publicationRevoked) {
      waiting(updating, true);
      $('coverage').hidden = true;
      taskHead(null, true);
      groupsRead.done(false); changesRead.done(false); heroRead.done(false);
      if (board) pickGroup();
      if (projectList !== null) pickProjects();
    } else if (!page && !s.data) {
      $('coverage').hidden = true;
      const pending = s.warming || ['idle', 'wait', 'slow'].includes(s.phase);
      waiting(pending ? '正在读' : s.text || U.collectionText());
      if (!pending) { taskHead(); heroRead.done(false); }
    }
    U.blockNote($('groups'), { fallbackNote: readingNote(s, dataAt) });
    if (page && !maintenance) drawUpcoming(listedTasks(taskGroups(page, rows)));
    taskWords();
  }
  function load() {
    generation++; watch?.stop();
    for (const s of sections.values()) { s.loadedRows = null; s.cursor = null; s.failed = false; s.box._loaded = false; s.next.hidden = true; }
    page = null; rows = []; dataAt = null; runningReading = null; coverageNote = ''; waiting('正在读'); taskHead(null, false, true);
    watch = window.Live.watch('tasks', { scope, project, q: query || null }, {
      phase(s) { if (!page && !s.meta?.publicationRevoked) { if (['idle', 'wait', 'slow'].includes(s.phase)) heroRead.set(s); groupsRead.set(s); changesRead.set(s); } },
      data(d, meta) {
        const kind = meta.viewer?.kind || 'public';
        if (kind === viewer && page && page.q !== 'warming' && d?.q === 'warming' && !meta.publicationRevoked) return;
        const ticket = ++generation;
        if (meta.publicationRevoked) { rows = []; runningReading = null; coverageNote = ''; $('sources').replaceChildren(); }
        if (kind !== viewer) for (const s of sections.values()) { s.loadedRows = null; s.cursor = null; s.failed = false; s.box._loaded = false; s.next.hidden = true; }
        const paint = packet => {
          if (viewer !== kind) runningReading = null;
          viewer = kind; batchAt = meta.at; now = meta.now || meta.at;
          dataAt = maintenance ? packet?.at : Object.hasOwn(packet || {}, 'roster_at') ? packet.roster_at : packet?.at ?? meta.at;
          const reading = scheduledRunning(packet);
          if (reading && (!runningReading || Date.parse(reading.at) >= Date.parse(runningReading.at))) runningReading = reading;
          if (page) U.anchor(() => render(packet)); else render(packet);
        };
        // 首批已到就先画，重读则留着原来的完整列表，等同一批分页到齐后再换。
        if (!page || page.q === 'warming' || kind !== viewer || !d) paint(d);
        let revoked = false;
        readAllTasks(d, async cursor => {
          if (ticket !== generation) return null;
          const result = await window.Live.get('tasks', { scope, project, q: query || null, cursor });
          if (result.meta?.publicationRevoked) { revoked = true; return null; }
          if (result.meta?.viewer?.kind !== kind) return null;
          if (result.meta?.at === meta.at) return result;
          if (Date.parse(result.meta?.at) > Date.parse(meta.at)) void window.Live.get('tasks', { scope, project, q: query || null });
          return null;
        }).then(all => {
          if (ticket !== generation) return;
          if (revoked) for (const s of sections.values()) clearGroupRows(s);
          if (revoked || all !== page && (!all?.next || !page || page.next)) paint(all);
          if (revoked) showRevokedPage();
        });
      }, link,
    });
  }
  $('q').value = query; let timer; $('search').addEventListener('submit', e => { e.preventDefault(); clearTimeout(timer); query = $('q').value.trim(); const u = new URL(location.href); query ? u.searchParams.set('q', query) : u.searchParams.delete('q'); history.replaceState(null, '', u); load(); }); $('q').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => $('search').requestSubmit(), 300); });
  nextPage.addEventListener('click', async (event) => {
    const button = event.currentTarget, ticket = generation, label = button.textContent;
    button.disabled = true; button.textContent = '正在读…';
    try {
      const r = await window.Live.get('tasks', { scope, project, q: query || null, cursor });
      if (ticket !== generation) return;
      if (r.data && r.meta?.at === batchAt && r.meta?.viewer?.kind === viewer) U.anchor(() => render(r.data, true));
      else if (r.meta?.publicationRevoked) showRevokedPage();
      else U.html($('coverage'), U.fieldHtml(r.warming ? '正在读' : r.text || U.collectionText(), { name: '读取情况', place: 'body', kind: viewer }));
    } finally {
      button.disabled = false;
      if (button.textContent === '正在读…') button.textContent = label;
    }
  });
  function showRevokedPage() {
    nextPage.textContent = updating;
  }
  function scheduledRunning(packet) {
    if (maintenance || !packet || !dataAt) return null;
    if (Object.hasOwn(packet, 'running_reading')) return packet.running_reading;
    const items = packet.items || [];
    const pageOnly = !packet.state_counts && (packet.next != null || packet.total != null && items.length < packet.total);
    const partial = pageOnly || packet.total == null || packet.unreadable_total > 0;
    const count = packet.state_counts ? packet.state_counts.running || 0
      : items.filter(t => (!pageOnly || t.source_readable === true) && taskState(t) === 'running').length;
    return count || !partial ? { count, at: dataAt, partial, pageOnly } : null;
  }
  function taskHead(moved, revoked = false, pending = false) {
    hero.toggleAttribute('data-publication-revoked', revoked);
    if (pending || page?.q === 'warming') { headline = pending ? '正在读' : '正在准备'; U.html($('head'), U.head(headline)); $('note').hidden = true; $('asof').hidden = true; U.html($('stats'), ''); L.tone(hero, 'off'); if (!pending) heroRead.done(); return; }
    const total = page?.total, rounds = maintenanceRounds(page);
    const observed = Number.isInteger(rounds) && (rounds > 0 || rounds === 0 && page?.q === 'ok');
    // 新私事规则（本人 11-24 02:56）：访客版不再按项藏，总数旁边不再写“另有 N 项仅本人可见”。
    const ownerOnly = 0;
    headline = revoked ? updating : maintenance ? observed ? `已观察到 ${rounds} 次` : '维护记录未读到'
      : total != null ? `登记 ${total} 项${ownerOnly ? ` · 另有 ${ownerOnly} 项仅本人可见` : ''}` : 'Windows 计划任务名册这次没读到';
    const cutoff = /^数据截止 /;
    const status = U.status(page && { ...page, why: cutoff.test(page.why) ? '任务名册暂时没更新' : page.why, stale_text: cutoff.test(page.stale_text) ? null : page.stale_text }, { showZeroFixing: false });
    const title = U.head(headline, { lamp: false });
    U.html($('head'), status.lamp + (revoked ? title.replace(/(计划任务正在更新|访客版，|稍后自动补上。)/g, '<span class="task-phrase">$&</span>') : title));
    if (project) U.html($('project-label'), [linkedProject(project) && typeof page?.project_name === 'string' ? `<a href="${esc(route(`/live/project/?id=${encodeURIComponent(project)}`))}">${U.fieldHtml(page.project_name, { name: '项目筛选', kind: viewer })} ›</a>` : U.fieldHtml(page?.project_name || page?.project_name_gap || U.collectionText('项目名称', page), { name: '项目筛选', kind: viewer }), !maintenance && U.fieldHtml(total != null ? `${String(total).startsWith('至少') ? '' : '共 '}${total} 件` : U.collectionText('任务总数', page), { name: '项目筛选', kind: viewer })].filter(Boolean).join(' · '));
    // 小方块黄橙怎么分。按需更新快核（M928）核法：E:/PCConfig/tools/remote-computer-mcp/run_outcomes.py 的 run_outcome，现出错次数不超过成功次数算大部分成功；变了改这句
    const markedDays = rows.filter(t => Array.isArray(t.days7) && t.days7.some(dayTrouble)).flatMap(t => t.days7);
    const emptyDays = markedDays.filter(day => dayTier(day) == null || ['none', 'unknown'].includes(dayTier(day)));
    const reasons = [...new Set(emptyDays.map(dayReason).filter(Boolean))].map(label => label === '这天不用跑' ? '不用跑' : label);
    const legend = markedDays.length && ['近 7 天出过事的任务画小方块',
      emptyDays.some(day => !day.started && !dayReason(day)) && `灰格：${dayMissing}`,
      ...reasons, `黄格“大部分成功”是出错次数不超过成功次数，旧记录的黄格也可能是“${observedFailure}”。橙格“部分成功”是出错多于成功`,
    ].filter(Boolean).join(' · ');
    const noteField = value => U.fieldHtml(value, { name: '任务说明', place: 'body', kind: viewer });
    const note = [
      ...[coverageNote, scope === 'ai-today' && '今天 AI 后台自动维护'].flat().filter(Boolean).map(noteField),
      legend && esc(legend).replace(/灰格：那天结果没读到|不用跑|停用中|这天没跑|等下一轮跑/g, '<span class="task-phrase">$&</span>'),
      ...[...new Set(rows.map(t => t.days7_gap).filter(Boolean))].map(noteField),
    ].filter(Boolean).join(' · ');
    const statusNote = !maintenance && dataAt && page?.gray_reason === 'stale' ? ''
      : status.note.replace(/(?:^| · )(?:有 \d+ 件事要留意|\d+ 项要处理)(?: · |$)/gu, ' · ').replace(/^(?: · )|(?: · )$/g, '');
    U.html($('note'), keepTaskWords([note, statusNote].filter(Boolean).join(' · '))); $('note').hidden = !note && !statusNote;
    drawStats(moved);
    L.tone(hero, page);
    if (page) heroRead.done(); taskWords();
  }
  function changeCounts(d) {
    const list = d?.changes7, kinds = { added: 'added', disabled: 'changed', missing: 'changed', enabled: 'changed' };
    if (!Array.isArray(list)) return null;
    // 旧包的 to 是组装时刻，只能证明记录起点。
    const modern = Object.hasOwn(d, 'changes_window');
    const window = modern ? d.changes_window : Array.isArray(d.coverage) && d.coverage.find(c => c?.id === 'identity-changes');
    const start = Date.parse(window?.from), end = Date.parse(window?.to);
    const from = Number.isFinite(start) ? U.date(window.from).replace(/(\d+)-(\d+)/, (_, month, day) => `${Number(month)} 月 ${Number(day)} 日`) : '';
    const since = modern && end - start >= 7 * 864e5 ? '近 7 天' : from ? `${from}起` : modern && Number.isFinite(end) ? `截至 ${U.date(window.to)}` : '已读';
    const title = since === '已读' ? '已读变化' : `${since}的变化${modern && Number.isFinite(start) && Number.isFinite(end) ? `（截至 ${U.date(window.to)} ${U.time(window.to)}）` : ''}`;
    const empty = `${since === '已读' ? '已读范围内' : since}没有任务变化`;
    const countable = list.every(c => Object.hasOwn(kinds, c?.kind));
    return { since, title, empty, countable, added: list.filter(c => kinds[c?.kind] === 'added').length, changed: list.filter(c => kinds[c?.kind] === 'changed').length };
  }
  function drawStats(moved = changeCounts(page)) {
    const off = U.offline?.(), icon = window.LiveBoard.icon, at = page && dataAt;
    const cell = (key, glyph, value, label) => value == null || value === '' ? '' : `<div class="lbp-stat" data-stat="${key}">${icon(glyph)}<b${/\d/.test(sp(value)) ? '' : ' class="is-word"'}>${value}</b><small>${label}</small></div>`;
    const missingText = meta => off ? null : U.collectionText('', meta);
    U.html($('stats'), !maintenance && page ? [
      page?.purpose_unregistered_count != null ? purposeCount(page, cell) : '',
      // 这两格加起来是登记总数，说的是 Windows 计划任务里的设置读没读到，和“用途写没写”是两回事（M452）
      cell('readable', 'check', page.readable_total, '<span title="什么时候跑、跑哪个程序、开没开，都从 Windows 计划任务里读到了">项读到了 Windows 设置</span>'),
      cell('unreadable', 'alert', page.unreadable_total, '<span title="Windows 计划任务里这几项的设置这轮没读到，只知道叫什么">项只读到名字</span>'),
      runningReading ? cell('running', 'play', esc(`${runningReading.partial ? '至少 ' : ''}${runningReading.count}`), `${runningReading.stale ? '上次' : '截至'}${esc(nextAt(runningReading.at))} 已确认在跑${runningReading.pageOnly ? ' · 已读部分' : ''}`)
        : cell('running', 'play', '没读到', '当前运行状态'),
      moved?.countable ? cell('added', 'plus', esc(moved.added), `${moved.since}新增`) : '',
      moved?.countable ? cell('changed', 'refresh', esc(moved.changed), `${moved.since}状态变化`) : '',
      page && Object.hasOwn(page, 'attention_count') ? cell('attention', 'alert', page.attention_count != null ? esc(page.attention_count) : missingText(page), '项要处理') : '',
    ].join('') : '');
    U.html($('asof'), at ? esc(`${maintenance ? '维护记录' : '任务名册'}截至 ${U.date(at) === U.date(now || Date.now()) ? '' : `${U.date(at)} `}${U.time(at)}`) : ''); $('asof').hidden = !at;
  }
  load(); requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();
