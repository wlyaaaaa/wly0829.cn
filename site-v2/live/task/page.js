(() => {
  'use strict';
  const U = window.LiveUI, { esc } = U, $ = id => document.getElementById(id);
  const p = new URLSearchParams(location.search), id = p.get('id'), legacyRun = p.get('run');
  const route = (path, query = {}) => {
    const u = new URL(path, location.origin);
    for (const [key, value] of Object.entries(query)) if (value) u.searchParams.set(key, value);
    if (p.has('fixture')) u.searchParams.set('fixture', p.get('fixture'));
    return u.pathname + u.search + u.hash;
  };
  const GROUP = { disabled: '已停用', backup: '备份', hardware: '硬件和灯效', daily: '听写和日常记录', ai: 'AI 工作', upkeep: '电脑维护', remote: '远程和网络', online: '云端和 GitHub', vendor: '第三方软件自带', unregistered: '用途未登记' };
  const ART = { 'task-cfd8d90a29206c0ed1e7c06c': 'pickup-review', 'task-32678228b24ebef4021d08fa': 'pickup-accept' };
  const MODE = { batch: '按时运行', event: '有事才跑', on_demand: '按需', resident: '一直开着', service_loop: '一直开着' };
  const TRIGGER = { scheduled: '按时', manual: '手动', event: '事件触发', automation: '自动触发' };
  const DAY = 864e5, BJ = 8 * 36e5, dayStart = t => Math.floor((t + BJ) / DAY) * DAY - BJ;
  const back = document.querySelector('[data-back]');
  const from = document.referrer ? new URL(document.referrer) : null;
  const hero = $('hero'), stage = $('stage');
  if (from?.origin === location.origin && from.pathname === '/live/automation/') {
    back.href = from.pathname + from.search; back.textContent = '自动任务';
  }
  let viewer = 'public', task, now = Date.now(), offline = false, packetAt = null, selected = false;
  const RUN_BATCH = 50;
  let restShown = RUN_BATCH;
  // 后台按页给运行记录（runs_page）时：更早的批次照游标取来放在这里，按开始的那一秒去重；首包刷新时已经摆出来的也留着，不出空档（M643）
  let olderRuns = new Map(), olderViewer = null, deepCursor, pageLoading = false, pageFailed = false, pickedRun = null, pickAsked = false;
  const pageOf = d => d?.runs_page && typeof d.runs_page === 'object' && Array.isArray(d.runs) ? d.runs_page : null;
  let detailWatches = [];
  const field = (v, name) => U.fieldHtml(v, { name, kind: viewer });
  const text = v => U.fieldText(v, viewer);
  const time = v => typeof v === 'number' ? v : Date.parse(text(v));
  const stamp = (t, relative = false) => !Number.isFinite(t) ? '' : [
    relative && dayStart(t) === dayStart(now) ? '今天' :
      relative && dayStart(t) === dayStart(now) + DAY ? '明天' : U.date(t), U.time(t),
  ].filter(Boolean).join(' ');
  const duration = seconds => {
    const s = Math.round(seconds);
    if (!Number.isFinite(s) || s < 0) return '';
    if (s < 60) return `${s} 秒`;
    const wholeMinutes = U.minutes(Math.floor(s / 60));
    return s % 60 ? `${wholeMinutes} ${s % 60} 秒` : wholeMinutes;
  };
  const write = (el, html) => { U.html(el, html, false); el.hidden = !html; };
  // M783：本人版按后台给在这条任务（或这一轮）上的 visitor_labels 在原位挂“对外换了说法／访客看不到”，keys 是这个位置显示的字段；没标的不挂；访客版只挂“对外换了说法”（M930）
  const mark = (row, keys, what) => { const tag = U.visitorLabel(row, keys, what, viewer); return tag ? ` ${tag}` : ''; };
  const marked = (html, row, keys, what) => html ? html + mark(row, keys, what) : html;
  const protectedField = d => viewer === 'public' && (d?.visibility === 'owner' || d?.public === 'owner' || d?.hidden === true);
  const variantOf = d => d.automation_group === 'ai-pickup' ? 'pickup' : d.automation_group === 'ai-schedule' ? 'schedule' : 'plan';
  const purpose = (d, kind) => {
    const value = d.purpose ?? d.text;
    return kind === 'schedule' && text(value).trim() === '按设定周期运行 AI 任务' ? '' : marked(field(value, '用途'), d, ['purpose', 'text'], '用途');
  };
  const failureResult = value => value === 'failed' || value === 'stopped';
  // 平台名：三家都认（Antigravity 的定时详情 11-25 起也走这一页，M921）
  const PROVIDERS = { codex: 'Codex', claude: 'Claude', antigravity: 'Antigravity' };
  // 各家自带的定时：后台给了下一次的北京星期和时刻，重复周期就照它写成“每周二 00:00（北京）”，不写外国时区名（M921；自动任务页“各家自带的定时”同一个写法）
  const bjSchedule = d => {
    const p = typeof d.schedule === 'string' ? d.schedule.trim() : '', m = p.match(/^每\s*(\d*)\s*(周|天)/);
    const wd = typeof d.next_beijing_weekday === 'string' ? d.next_beijing_weekday.replace(/^星期/, '周') : '';
    const at = typeof d.next_beijing_time === 'string' && /^\d{2}:\d{2}$/.test(d.next_beijing_time) ? d.next_beijing_time : '';
    if (!m || !wd || !at) return null;
    const n = m[1] && m[1] !== '1' ? ` ${m[1]} ` : '';
    return m[2] === '周' ? `${n ? `每${n}周的${wd}` : `每${wd}`} ${at}（北京）` : `每${n}天 ${at}（北京）`;
  };
  // 定时任务后台读到了、但一次都还没跑（运行记录读到的是空的，上次开始结束都没有）：写“还没跑过”，不写“未读到”
  const neverRan = (d, kind) => kind === 'schedule' && Array.isArray(d.runs) && !d.runs.length && !(d.runs_summary?.total > 0) && d.last && d.last.start == null && d.last.end == null;
  const provider = v => {
    const name = text(v), id = typeof name === 'string' ? name.toLowerCase() : '';
    return Object.hasOwn(PROVIDERS, id)
      ? `<span class="task-provider" data-provider="${id}">${PROVIDERS[id]}</span>`
      : field(v, '执行者');
  };
  const label = (state, variant) => ({
    ok: variant === 'pickup' ? '处理完' : variant === 'schedule' ? '完成' : '成功',
    done: variant === 'pickup' ? '处理完' : '已完成', failed: variant === 'pickup' ? '没处理成' : variant === 'schedule' ? '没跑成' : '出错',
    running: offline ? '断开前在跑' : '正在跑', stopped: '中途停了', disabled: '停用', paused: '已暂停', never: '未运行', accepted: '已接手',
    warn: '部分完成',   // 只做完一部分的那一轮（后台 result=warn，如原话补漏“这次只补完一部分消息”），用列表“要留意”的黄色（M381）
  })[state] || '结果未读到';
  // 计划任务某一轮结果没读到时写清缘故：没记到结束、结束了但结果未确认（和列表同一个说法），或结果码的含义没登记
  const unknownRun = r => !r ? '' : r.end == null && r.start != null ? '没记到结束' : r.exit_code != null ? '结果码没登记' : r.end != null ? '结果未确认' : '';
  const result = (state, variant, run) => {
    const result = ['ok', 'done', 'failed', 'warn', 'running', 'stopped', 'disabled', 'paused', 'never', 'accepted'].includes(state) ? state : 'unknown';
    const tone = result === 'stopped' ? 'failed' : result;
    return `<span class="task-result" data-state="${tone}"><i class="task-dot" data-state="${tone}" aria-hidden="true"></i>${result === 'unknown' && variant === 'plan' && esc(unknownRun(run)) || label(result, variant)}</span>`;
  };
  const runTime = r => r.start ?? r.end;
  const keepRuns = rows => { for (const r of rows || []) { const t = time(r?.started ?? r?.start ?? r?.finished ?? r?.end); if (Number.isFinite(t)) olderRuns.set(Math.floor(t / 1000), r); } };
  const valid = Number.isFinite;
  function asRun(r) {
    const started = time(r.started ?? r.start), finished = time(r.finished ?? r.end);
    const start = valid(started) ? started : null, end = valid(finished) && finished <= now && (start == null || finished >= start) ? finished : null;
    return { ...r, start, end, length: start != null && end != null && end >= start ? (end - start) / 1000 : null };
  }
  function runsOf(d) {
    const list = Array.isArray(d.runs) && d.runs.length ? d.runs : d.recent || [], runs = new Map(), plan = variantOf(d) === 'plan';
    const strength = { ok: 3, failed: 3, stopped: 3, warn: 3, done: 2, running: 1 };
    for (const source of [...list, ...(d.last ? [d.last] : [])]) {
      if (!source || protectedField(source)) continue;
      const run = asRun(source), at = runTime(run);
      if (at == null || at > now) continue;
      // 同一轮：Windows 日志的开始时刻带毫秒，上次运行只记到秒，按秒合并，免得一轮显示成两行
      const key = plan ? Math.floor(at / 1000) : at, prior = runs.get(key);
      if (!prior) runs.set(key, run);
      else {
        for (const [key, value] of Object.entries(run)) {
          if (prior[key] == null && value != null) prior[key] = value;
        }
        if ((strength[run.result] || 0) > (strength[prior.result] || 0)) prior.result = run.result;
      }
    }
    return [...runs.values()].sort((a, b) => runTime(b) - runTime(a));
  }
  function crumbs(d, kind) {
    const plan = kind === 'plan', list = plan ? '/live/tasks/' : '/live/automation/';
    const groupId = d.state === 'disabled' ? 'disabled' : d.group, group = plan && GROUP[groupId];
    back.href = from?.origin === location.origin && from.pathname === list ? from.pathname + from.search : route(list);
    back.textContent = plan ? '计划任务' : '自动任务';
    const groupLink = $('crumb-group');
    groupLink.hidden = !group;
    if (group) { groupLink.textContent = group; groupLink.href = route(list, { group: groupId }); }
    write($('crumb-name'), kind === 'schedule' ? '' : marked(field(d.display_name ?? d.name, '任务名'), d, ['display_name', 'name'], '任务名'));
  }
  back.addEventListener('click', U.restoreBack);
  $('runs-rest').addEventListener('click', e => {
    if (!task || !e.target.closest('[data-runs-more]')) return;
    if (pageOf(task)) loadOlder(); else { restShown += RUN_BATCH; render(task); }
  });
  const detailPath = () => `tasks/${encodeURIComponent(id)}`;
  const updating = name => `${name}正在更新访客版，稍后自动补上。`, retryPage = '这一批没读到，点这里再读 ›';
  // 照游标向后台取下一批（每批 50 次）；没读到就在按钮上说一句，再点重读
  function loadOlder() {
    const cursor = deepCursor !== undefined ? deepCursor : task.runs_page.next_cursor, who = viewer, loaded = olderRuns;
    if (pageLoading || !cursor) return;
    pageLoading = true; pageFailed = false; render(task);
    window.Live.get(detailPath(), { runs_cursor: cursor }).then(state => {
      if (!task || who !== viewer || olderRuns !== loaded) return;
      const rows = state?.data?.runs, page = state?.data?.runs_page;
      if (!Array.isArray(rows) || !page || state.viewer?.kind !== viewer) { pageFailed = state.meta?.publicationRevoked ? updating('最近几次') : retryPage; return; }
      keepRuns(rows); deepCursor = page.next_cursor ?? null;
    }, () => { if (task && olderRuns === loaded) pageFailed = retryPage; }).finally(() => { pageLoading = false; if (task) render(task); });
  }
  // 旧链接要看的那一次不在已取的几批里：带 ?run= 让后台单独给出这一行（selected_run）
  function askPicked() {
    pickAsked = true;
    const who = viewer, loaded = olderRuns;
    window.Live.get(detailPath(), { run: legacyRun }).then(state => {
      const row = state?.data?.selected_run;
      if (!task || olderRuns !== loaded || who !== viewer || state.viewer?.kind !== viewer || !row || protectedField(row)) return;
      pickedRun = asRun(row);
      if (task) render(task);
    }, () => {});
  }
  $('root-link').href = route('/live/#tasks');
  for (const el of document.querySelectorAll('[data-icon-name]')) U.html(el, window.LiveBoard.icon(el.dataset.iconName), false);
  const weekLabel = { ok: '有成功记录', failed: '全部出错', 'observed-failed': '有出错记录，全天结果未确认', warn: '有部分完成', none: '没有新启动', 'observed-ok': '至少一轮成功', started: '跑过，结果未确认', unknown: '全天记录未读全' };
  // 后台按当天成功、出错的次数分了档（days7[].outcome.state，M779）：全成功绿、有出错但大部分成功黄、部分成功橙、全出错红；
  // 旧包只有一次出错的证据时用黄格提醒，全天明确全出错才用红格。
  const TIER = { success: ['ok', '全部成功'], mostly_successful: ['mostly', '有出错，大部分成功'], partial_success: ['partial', '有出错，部分成功'],
    failed: ['failed', '全部出错'], warn: ['warn', '有部分完成'] };
  const tierCounts = o => Number.isInteger(o?.ok) && Number.isInteger(o?.failed) && o.ok + o.failed > 0
    ? `（${o.exact ? '' : '已读到'}成功 ${o.ok} 次、出错 ${o.failed} 次）` : '';
  const dayMark = (state, key = false) => `<span class="task-mark${key ? '' : ' task-day'}" data-state="${state}" aria-hidden="true"></span>`;
  function week(days, runs) {
    const dateKey = t => new Date(t + BJ).toISOString().slice(0, 10), evidence = new Map();
    for (const run of runs) {
      if (run.start == null) continue;
      const date = dateKey(run.start);
      if (!evidence.has(date) || run.result === 'failed' || run.result === 'ok' && evidence.get(date) !== 'failed'
        || run.result === 'warn' && !['failed', 'ok'].includes(evidence.get(date))) evidence.set(date, run.result);
    }
    const dates = Array.isArray(days) && days.length ? days : Array.from({ length: 7 }, (_, i) => ({ date: dateKey(dayStart(now) - (6 - i) * DAY), state: null }));
    const cells = dates.map(day => {
      const tier = TIER[day.outcome?.state];
      if (tier) return { ...day, state: tier[0], name: tier[1], key: tier[1], counts: tierCounts(day.outcome), started: true };
      const sawRun = evidence.has(day.date), outcome = evidence.get(day.date);
      const failed = day.state === 'failed' || outcome === 'failed';
      // 当天有部分完成（后台 days7 的 state=warn；旧包从已读到的轮次看出）：同一天先算出错，其次成功，再次部分完成（M676）
      const state = failed ? 'observed-failed' : day.state === 'ok' || outcome === 'ok'
        ? day.partial || day.state !== 'ok' ? 'observed-ok' : 'ok' : day.state === 'warn' || outcome === 'warn' ? 'warn' : day.state === 'none' && !sawRun ? 'none' : 'unknown';
      const started = day.started || sawRun;
      const name = weekLabel[state === 'unknown' && started ? 'started' : state];
      // 那天表里列着运行、只是没确认结果的，格子说“跑过，结果未确认”，不说“全天记录未读全”
      return { ...day, state: state === 'unknown' && started ? 'started' : state, name, started };
    });
    if (!cells.some(day => day.state !== 'unknown' || day.started)) return '<div class="task-week"><strong>近 7 天</strong><span>每日结果还没读到</span></div>';
    const marks = cells.map(({ date, state, name, counts = '' }) => `<li title="${esc(date)} ${name}${counts}">${dayMark(state)}<time datetime="${esc(date)}" aria-label="${esc(date)} ${name}${counts}">${esc(date.slice(5))}</time></li>`).join('');
    const legend = [...new Map(cells.map(day => [`${day.state}|${day.key || weekLabel[day.state]}`, day])).values()].map(day => `<span>${dayMark(day.state, true)}${day.key || weekLabel[day.state]}</span>`).join('');
    return `<div class="task-week"><strong>近 7 天</strong><ol aria-label="最近七天每天的结果">${marks}</ol><div class="task-week__key">${legend}</div></div>`;
  }
  function count(n, exact) {
    return Number.isInteger(n) && n >= 0 && (exact || n > 0) ? `${exact ? '' : '<small>至少 </small>'}${n}<small> 次</small>` : '';
  }
  // 后台按全部运行记录算好的统计（runs_summary）：分页以后只拿到最新 50 次，统计照它，不拿已载入的几条重算（M643）
  // 部分完成的轮次（result=warn，M381、M676）：新包单给 warn，unknown 只算真没结果，两个数都直接用；
  // 旧包没有 warn、部分完成还算在 unknown 里：全部轮次都已载入才按已载入的数出来再从 unknown 里减，没载入完又见到部分完成的，只说“没记到结果或部分完成”，不硬拆
  function partialRuns(d, s, runs, unknown) {
    if (Number.isInteger(s.warn) && s.warn >= 0) return { warn: s.warn, unread: unknown, mixed: false };
    const page = pageOf(d), all = !page || (deepCursor === undefined ? page.next_cursor == null : deepCursor == null);
    const from = time(s.from), to = valid(time(s.to)) ? time(s.to) : now;
    const seen = (runs || []).filter(r => r.result === 'warn' && r.start != null && (!valid(from) || r.start >= from) && r.start <= to).length;
    const warn = all ? Math.min(seen, unknown) : 0;
    return { warn, unread: unknown - warn, mixed: !all && seen > 0 };
  }
  function summaryMetrics(d, s, kind, runs) {
    const plan = kind === 'plan', exact = s.exact === true, span = exact && s.covered !== true, from = time(s.from);
    const n = v => Number.isInteger(v) && v >= 0 ? v : 0, total = n(s.total), ok = n(s.ok), failed = n(s.failed), running = n(s.running);
    const { warn, unread, mixed } = partialRuns(d, s, runs, n(s.unknown));
    const why = v => v || !plan ? '' : running ? '还在跑' : total ? '已读部分没有' : '';
    const besides = plan && exact ? [warn && `${warn} 次部分完成`, unread && `${unread} 次没记到结果${mixed ? '或部分完成' : ''}`, running && `${running} 次还在跑`].filter(Boolean).join('，') : '';
    const totalRow = ['total', `${span && valid(from) ? `${stamp(from)} 起` : '近 7 天'}${besides ? `<small class="task-stat__note">${besides}</small>` : ''}`, count(s.total, exact)];
    const success = ['success', kind === 'pickup' ? '处理完' : kind === 'schedule' ? '完成' : '成功', count(s.ok, s.success_exact === true), '', why(ok)];
    const failure = ['failure', kind === 'schedule' ? '没跑成' : '出错', count(s.failed, s.success_exact === true), '', why(failed)];
    const timed = n(s.duration_count), avg = timed && Number.isFinite(s.avg_duration_ms) ? duration(s.avg_duration_ms / 1000) : '';
    const average = ['average', '平均用时', avg, timed ? `按 ${timed} 次有起止时刻的记录计算` : '没有读到完整起止时刻',
      timed || !plan ? '' : running ? '还在跑' : total ? '没记到结束' : ''];
    return { covered: s.covered === true, coverage: d.coverage, outcome: outcomeTone(s.outcome, ok, failed, s.success_exact === true && ok + failed === total),
      rows: kind === 'pickup' ? [['today', '今天', count(s.today, s.today_exact === true)], totalRow, success, average] : [totalRow, success, failure, average] };
  }
  function outcomeTone(outcome, ok, failed, exact) {
    return TIER[outcome?.state]?.[0] || (ok > 0 && failed > 0 ? ok >= failed ? 'mostly' : 'partial'
      : failed > 0 ? exact ? 'failed' : 'warn' : '');
  }
  function metrics(d, runs, kind) {
    if (d.runs_summary && typeof d.runs_summary === 'object') return summaryMetrics(d, d.runs_summary, kind, runs);
    const start = dayStart(now) - 6 * DAY, today = dayStart(now), coverage = d.coverage;
    const coveredTo = time(coverage?.to);
    const recent = runs.filter(r => r.start != null && r.start >= start);
    const covered = coverage?.complete === true && coverage.reliable !== false && time(coverage.from) <= start
      && coveredTo >= today && coveredTo <= now && recent.every(r => r.start <= coveredTo)
      && Array.isArray(d.runs) && !d.runs.some(protectedField);
    const completeResults = kind === 'plan' ? ['ok'] : ['ok', 'done'];
    // 计划任务：Windows 日志可靠、只是最早一条晚于 7 天前（日志轮转）时，从最早一条算起的次数是全的，写“几号几点起”，不写“至少”
    const from = time(coverage?.from);
    const span = kind === 'plan' && !covered && coverage?.reliable === true && valid(from) && from > start && from <= coveredTo
      && coveredTo <= now && Array.isArray(d.runs) && !d.runs.some(protectedField);
    const counted = span ? runs.filter(r => r.start != null && r.start >= from && r.start <= coveredTo) : recent;
    const exact = covered || span;
    const good = counted.filter(r => completeResults.includes(r.result)), bad = counted.filter(r => failureResult(r.result));
    const running = counted.filter(r => r.result === 'running').length;
    const warn = counted.filter(r => r.result === 'warn').length;
    const unread = counted.filter(r => !completeResults.includes(r.result) && !failureResult(r.result) && !['running', 'warn'].includes(r.result)).length;
    const knownOutcomes = counted.every(r => completeResults.includes(r.result) || failureResult(r.result));
    const durations = counted.map(r => r.length).filter(valid);
    const lastSample = time(d.runs_at ?? d.at ?? packetAt);
    const readsToday = lastSample <= now && dayStart(lastSample) === today && ['ok', 'partial'].includes(d.today_runs_q);
    const todayCount = readsToday ? count(d.today_runs, d.today_runs_q === 'ok')
      : count(recent.filter(r => r.start >= today).length, covered);
    const plan = kind === 'plan', why = n => n || !plan ? '' : running ? '还在跑' : counted.length ? '已读部分没有' : '';
    const besides = plan && exact ? [warn && `${warn} 次部分完成`, unread && `${unread} 次没记到结果`, running && `${running} 次还在跑`].filter(Boolean).join('，') : '';
    const total = ['total', `${span ? `${stamp(from)} 起` : '近 7 天'}${besides ? `<small class="task-stat__note">${besides}</small>` : ''}`, count(counted.length, exact)];
    const success = ['success', kind === 'pickup' ? '处理完' : kind === 'schedule' ? '完成' : '成功', count(good.length, exact && (span || knownOutcomes)), '', why(good.length)];
    const failure = ['failure', kind === 'schedule' ? '没跑成' : '出错', count(bad.length, exact && (span || knownOutcomes)), '', why(bad.length)];
    const avg = duration(durations.length ? durations.reduce((sum, n) => sum + n, 0) / durations.length : NaN);
    const average = ['average', '平均用时', avg, durations.length ? `按 ${durations.length} 次有起止时刻的记录计算` : '没有读到完整起止时刻',
      durations.length || !plan ? '' : running ? '还在跑' : counted.length ? '没记到结束' : ''];
    return { covered, outcome: outcomeTone(null, good.length, bad.length, exact && knownOutcomes), rows: kind === 'pickup' ? [['today', '今天', todayCount], total, success, average] : [total, success, failure, average], coverage };
  }
  function readNotice(d, coverage, runs, covered) {
    const from = time(coverage?.from), to = time(coverage?.to);
    const range = valid(from) && valid(to) && from <= to && to <= now ? `记录覆盖 ${stamp(from)} 至 ${stamp(to)}` : '';
    const gap = covered ? '' : runs.length ? '只显示已读到的轮次' : '运行记录未读到';
    const reason = text(d.gap).startsWith('最近一次记录于') && range ? '' : field(d.gap, '缺数原因');
    return [...new Set([esc(range), reason, esc(gap)].filter(Boolean))].join(' · ');
  }
  function disabledStatus(d) {
    const cutoff = time(d.disabled_since), checked = Math.min(now, time(d.at ?? packetAt));
    return valid(cutoff) && cutoff <= checked
      ? `已停用至少 ${duration(Math.floor((checked - cutoff) / 1000))}（${stamp(cutoff, true)} 记到停用）`
      : '已停用';
  }
  function quietWeek(d, runs, kind, covered) {
    const start = dayStart(now) - 6 * DAY;
    if (kind !== 'plan' || !d.scheduler || runs.some(r => runTime(r) >= start || r.end >= start)
      || d.days7?.some(day => day.started || ['ok', 'failed'].includes(day.state))) return '';
    const last = time(d.windows_last_start), checked = time(d.at ?? packetAt);
    if (covered || d.source_readable === true && valid(checked) && checked >= dayStart(now)
      && (valid(last) && last < start || d.state === 'never')) return '近 7 天没有运行';
    return '近 7 天没有读到运行记录';
  }
  // Windows 登记的触发方式：没有下次时间的任务写“登录时运行”“开机时运行”，没有触发条件的写“叫了才跑”
  function triggerLine(d) {
    if (!Array.isArray(d.trigger_types)) return '';
    const kinds = d.trigger_types.filter(k => typeof k === 'string' && k && k !== '按计划');
    return !d.trigger_types.length ? '没设触发条件，叫了才跑' : kinds.length ? `${kinds.join('、')}运行` : '';
  }
  // 后台给的下次时间已经过了：Windows 核实过重复周期的往后推到下一轮；没有周期的写“原定”
  function pastNext(d) {
    const scheduled = Object.hasOwn(d, 'next_at') ? d.next_at : d.next;
    const at = time(Object.hasOwn(d.next_plan ?? {}, 'at') ? d.next_plan.at : scheduled);
    return valid(at) && at < now && !(Number(d.next_plan?.period_seconds) > 0) ? at : NaN;
  }
  function renderHero(d, kind, upcoming, todayCount, runs, quiet) {
    const name = d.display_name ?? d.name, last = runs[0];
    U.html($('name'), (marked(field(name, '任务名'), d, ['display_name', 'name'], '任务名') || '任务名称未读到') + (kind === 'schedule' ? provider(d.scheduler) : ''), false);
    document.title = `${text(name) || '任务详情'} · 实况`;
    const showLast = last && runTime(last) != null && runTime(last) <= now;
    const state = showLast ? last.result : ['disabled', 'paused', 'never'].includes(d.state) ? d.state : null;
    const partial = showLast && last.result === 'warn' && last.reason_code === 'time_limit' && field(last.reason, '运行说明');
    const stateHtml = result(state, kind, showLast ? last : null) + (partial ? ` · ${partial}` : ''), textLast = showLast ? `${kind === 'pickup' ? '最近' : '上次'} ${esc(stamp(runTime(last), true))}${last.start == null ? ' 结束' : ''} ` : '';
    const due = upcoming[0], original = valid(time(d.next_plan?.original_at)) ? time(d.next_plan.original_at) : kind === 'plan' ? pastNext(d) : NaN;
    const pending = kind === 'plan' && text(d.next_plan?.pending_text);
    const stopped = ['disabled', 'paused'].includes(d.state);
    const completed = kind === 'plan' ? ['ok', 'failed', 'warn'] : ['ok', 'done', 'failed', 'stopped', 'warn'];
    const originalFinished = valid(original) && last?.start >= original && completed.includes(last.result);
    const resident = kind === 'plan' && ['resident', 'service_loop', 'on_demand', 'event'].includes(d.mode);
    const planStatus = stopped ? kind === 'plan' && d.state === 'disabled' ? disabledStatus(d) : showLast && label(d.state, kind)
      : valid(due) ? `${offline ? '原定' : '下次'} ${stamp(due, true)}`
      : valid(original) && !originalFinished ? `原定 ${stamp(original, true)}，${pending || '结果待更新'}`
      : resident ? d.schedule ? '' : MODE[d.mode] : kind === 'plan' && triggerLine(d) ? triggerLine(d)
      : kind === 'plan' && Array.isArray(d.trigger_types) ? '没有排下一次' : kind !== 'pickup' ? '下次时间未读到' : '';
    write($('task-status'), [showLast || !planStatus ? textLast + stateHtml : '', esc(planStatus), todayCount && `今天 ${todayCount}`].filter(Boolean).join(' · '));
    // Windows 名册记“还没运行过”、日志里却有运行的（任务后来重新登记过），说一句，免得和列表的“没跑过”对不上
    if (kind === 'plan' && d.state === 'never' && showLast) U.html($('task-status'), `${$('task-status').innerHTML}<small class="task-status__note">Windows 名册记的是“还没运行过”（列表照这个写“没跑过”），上面是 Windows 日志里读到的运行</small>`, false);
    const group = GROUP[d.group], mode = stopped ? '' : d.schedule ?? (kind === 'plan' && !resident && triggerLine(d) || MODE[d.mode]);
    const info = kind === 'plan' ? [mode, d.scheduler === 'windows' && 'Windows 计划任务', group && `分组为${group}`]
      : kind === 'pickup' ? ['AI 自动接活', d.trigger_text, d.executor] : ['AI 定时任务', bjSchedule(d) ?? d.schedule];
    write($('task-meta'), info.filter(Boolean).map(v => field(v, '任务说明')).join(' · '));
    write($('task-purpose'), purpose(d, kind));
    write($('task-week'), quiet ? `<div class="task-week"><strong>${quiet}</strong></div>` : kind === 'plan' ? week(d.days7, runs) : '');
    // 后台给了这条任务能做的事（actions）就照它画，空的就不画；老包没有这个字段时照原来两个按钮，停用的不画“问停法”
    const off = d.state === 'disabled' || d.enabled === false;
    const acts = U.actions(d, Array.isArray(d.actions) ? d.actions
      : [{ kind: 'copy', label: '问情况', intent: 'ask' }, ...(off ? [] : [{ kind: 'copy', label: '问停法', intent: 'stop' }])]);
    U.html($('task-acts'), acts, false);
    $('task-acts').hidden = !acts;
  }
  function nextRuns(d) {
    const known = Array.isArray(d.upcoming_runs) ? d.upcoming_runs : [];
    if (['disabled', 'paused'].includes(d.state)) return [];
    const scheduled = Object.hasOwn(d, 'next_at') ? d.next_at : d.next;
    const next = Object.hasOwn(d.next_plan ?? {}, 'at') ? d.next_plan.at : scheduled;
    const period = Number(d.next_plan?.period_seconds) * 1000;
    const roll = t => valid(t) && t < now && !offline && period > 0 ? t + Math.ceil((now - t) / period) * period : t;
    return [...new Set([next, ...known].map(time).map(roll).filter(t => valid(t) && (offline || t >= now)))].sort((a, b) => a - b).slice(0, 3);
  }
  function schedulePrompt(d, kind) {
    $('scheduled-prompt').hidden = kind !== 'schedule';
    const facts = $('task-prompt-facts');
    if (kind !== 'schedule') { U.html(facts, '', false); return; }
    const { text: raw, delivery, model } = d.scheduled_prompt || {};
    const source = PROVIDERS[text(d.scheduler).toLowerCase()];
    const displayModel = model === 'gemini-4-hydrogen-low' ? 'Gemini 4 Hydrogen（low）' : esc(model);
    const send = { wake: '叫醒原来那场对话，不新开', new: '新开一场对话' };
    const rows = [
      ['发给 AI 的原话', '<div class="task-prompt__text"></div>'],
      Object.hasOwn(send, delivery) && ['怎么发', send[delivery]],
      delivery === 'wake' && ['型号', '用原来那场对话的型号，这条定时自己不指定'],
      delivery === 'new' && ['型号', displayModel || '型号没读到'],
      raw && typeof source === 'string' && ['改了会怎样', `<span class="task-prompt__source">原话从 ${source} 的定时定义里直接读，改了定时，这里下一次刷新就跟着变</span>`],
    ];
    U.html(facts, rows.filter(Boolean).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join(''), false);
    const prompt = facts.querySelector('.task-prompt__text'), value = raw || '这类读不到原话';
    if (prompt.textContent !== value) prompt.textContent = value;
  }
  function facts(d, kind) {
    const link = (url, value) => value ? `<a href="${esc(url)}">${value} ›</a>` : '';
    const project = typeof d.project === 'string' && d.project !== 'project-b9c775111c7c33539ba1941c'
      ? link(route('/live/project/', { id: d.project }), field(d.project_name, '项目名')) : field(d.project_name, '项目名');
    // M767：所属项目在访客版看不到的（后台标 visitor_labels.project_name），本人版在项目名后挂签
    const projectCell = marked(project, d, 'project_name', '所属项目');
    const rows = [
      ['做什么', purpose(d, kind)],
      kind === 'plan' && Object.hasOwn(d, 'expected_result') && ['怎么算做完', marked(field(d.expected_result, '怎么算做完'), d, 'expected_result', '怎么算做完')
        || '<span class="task-fact-missing">登记时没写怎么算做完</span>'],
      ['成果', marked(field(d.output, '成果'), d, 'output', '成果')],
      kind === 'pickup' ? ['什么时候触发', field(d.trigger_text, '触发条件')]
        : ['时间安排', kind === 'plan' && d.state === 'disabled' ? esc(disabledStatus(d)) : field((kind === 'schedule' ? bjSchedule(d) : null) ?? d.schedule ?? (kind === 'plan' ? triggerLine(d) || null : null), '时间安排')],
      kind === 'schedule' && typeof d.enabled === 'boolean' && ['开没开', d.enabled ? '开着' : '关着（不会按时间安排启动）'],
      kind !== 'plan' && ['谁来做', provider(d.executor ?? d.scheduler)],
      ['怎么停', marked(field(d.stop, '停止办法'), d, 'stop', '停止办法')],
      ['停了会怎样', marked(field(d.stop_effect, '停止影响'), d, 'stop_effect', '停止影响')],
      ['谁配的', field(d.configured_by, '配置者')],
      ['所属项目', projectCell],
      typeof d.ledger_id === 'string' && ['关联账本', link(route('/live/issue/', { id: d.ledger_id }), '看这件事')],
    ].filter(row => row?.[1]);
    $('about-title').textContent = kind === 'pickup' ? '这个动作' : '这个任务';
    U.html($('facts'), rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('') || '<p>说明未读到</p>', false);
  }
  const timeCell = r => `<time datetime="${new Date(runTime(r)).toISOString()}">${stamp(runTime(r))}${r.start == null ? ' 结束' : ''}</time>`;
  const endStamp = r => r.start != null && dayStart(r.start) === dayStart(r.end) ? U.time(r.end) : stamp(r.end);
  const timeRange = r => r.start == null || r.end == null ? timeCell(r)
    : `<span>${timeCell(r)}–<wbr><time datetime="${new Date(r.end).toISOString()}">${endStamp(r)}</time></span>`;
  const times = r => [
    r.start != null && `${stamp(r.start)} 开始`,
    r.end != null && `${endStamp(r)} 结束`,
    r.exit_code != null && `退出码 ${text(r.exit_code)}`,
  ].filter(Boolean).map(esc).join(' · ');
  const runOutput = (d, r) => r.output ?? (r.end != null && r.end === time(d.last?.end)
    && r.end === time(d.output?.at) ? d.output : null);
  const chatLink = r => typeof r.chat_id === 'string' && r.chat_id.length
    ? `<a class="task-link" href="${esc(route('/live/chat/', { id: r.chat_id }))}">看对话 ›</a>` : '';
  const linkedKey = d => d.results?.href?.match(/\/runs\/([^/]+)\/results$/)?.[1];
  function runPath(d, r) {
    if (r.run_key && r.run_key === linkedKey(d)) return d.results.href;
    return d.result_kind === 'display_recovery' && runTime(r) === runTime(asRun(d.last || {})) ? 'computer/displays/recovery' : '';
  }
  function extra(d, r, output = false, open = false) {
    const path = runPath(d, r), info = [times(r), marked(field(r.reason, '运行说明'), r, 'reason', '运行说明'), !output && marked(field(r.output, '运行成果'), r, 'output', '运行成果')].filter(Boolean);
    if (!open && !path && r.end == null && r.exit_code == null && !r.reason && !(!output && r.output)) return '';
    return `<details class="task-run-extra"${open ? ' open' : ''}${path ? ` data-results="${esc(path)}"` : ''}><summary>这次的记录</summary>${info.map(v => `<p>${v}</p>`).join('')}${path ? '<div data-result-content>正在读逐项结果</div>' : ''}</details>`;
  }
  function history(d, rows, kind, open, heads = true) {
    if (!rows.length) return neverRan(d, kind) ? '<p>跑过以后每一次都列在这里</p>' : d.coverage?.complete && Array.isArray(d.runs) && !d.runs.length
      ? '<p>已读区间内没有运行记录</p>' : '<p>这段时间的运行记录未读到</p>';
    const value = (v, name) => field(v, name) || '未读到';
    if (kind === 'pickup') return `<table><thead><tr><th>时刻</th><th>起因</th><th>谁接的</th><th>结果</th><th></th></tr></thead><tbody>${rows.map(r =>
      `<tr data-time="${runTime(r)}"><td>${timeCell(r)}${r.length == null ? "" : `<small class="task-run-duration">用了 ${duration(r.length)}</small>`}</td><td>${value(r.cause ?? r.trigger_text, '起因')}${extra(d, r, false, open.includes(runTime(r)))}</td><td>${provider(r.executor) || '未读到'}</td><td>${result(r.result, kind, r)}</td><td>${chatLink(r)}</td></tr>`).join('')}</tbody></table>`;
    const last = kind === 'plan' && d.state === 'running' && d.last?.result === 'running' && !protectedField(d.last) ? asRun(d.last) : null;
    const checkedAt = time(d.runs_at ?? d.source_at ?? d.at ?? packetAt);
    const logFrom = time(d.coverage?.from), logTo = time(d.coverage?.to);
    const outsideLog = r => valid(logFrom) && valid(logTo) && r.start != null && (r.start < logFrom - 1000 || r.start > logTo + 1000);
    const labels = kind === 'plan' && heads ? '<div class="task-row task-row--labels"><span>时刻</span><span>结果</span><span>用时</span><span>触发方式</span></div>' : '';
    return labels + `<ol class="task-timeline">${rows.map(r => {
      const output = kind === 'schedule' && marked(field(runOutput(d, r), '本次成果'), r.output != null ? r : d, 'output', '本次成果');
      // 一小时以上只写到分钟，用时一栏放得下，不挤进触发方式
      const span = kind === 'plan' ? seconds => seconds >= 3600 ? `${Math.floor(seconds / 3600)} 小时 ${Math.floor(seconds % 3600 / 60)} 分` : duration(seconds) : duration;
      const trigger = r.trigger_text ?? TRIGGER[r.trigger], took = span(r.length ?? NaN);
      const running = r.result === 'running' && r.start != null && last && Math.floor(r.start / 1000) === Math.floor(last.start / 1000) && last.end == null
        && checkedAt >= r.start && checkedAt <= now ? span((checkedAt - r.start) / 1000) : '';
      const cutoff = running && (offline || d.q === 'stale') ? `<small class="task-run-duration">截至 ${stamp(checkedAt, true)}</small>` : '';
      const elapsed = took ? `用了 ${took}` : running ? `已跑 ${running}${cutoff}` : '—';
      const partial = r.result === 'warn' && r.reason_code === 'time_limit' && field(r.reason, '运行说明');
      return `<li data-time="${runTime(r)}"><div class="task-row">${kind === 'schedule' ? timeRange(r) : timeCell(r)}${result(r.result, kind, r)}<span class="task-row__duration">${elapsed}</span><span>${kind === 'schedule' ? output || '成果未读到' : field(trigger, '触发方式') || (kind === 'plan' && d.scheduler === 'windows' ? outsideLog(r) ? '这一轮不在已读的日志里' : 'Windows 日志没记触发方式' : '触发方式未读到')}${partial ? `<small class="task-run-duration">${partial}</small>` : ''}</span>${chatLink(r)}</div>${extra(d, r, !!output, open.includes(runTime(r)))}</li>`;
    }).join('')}</ol>`;
  }
  function checks(body) {
    if (body.q === 'warming') return '正在准备逐项结果';
    if (Array.isArray(body.columns) && !body.columns.some(c => c.id === 'before')) {
      const states = { passed: '通过', failed: '没通过', skipped: '跳过', unconfigured: '没设自检' };
      const rows = U.mergePrivateRows(body.rows, { kind: viewer }) || [];
      return rows.length ? `<ul class="task-checks">${rows.map(r => `<li>${r.private_count ? U.privateSummary(r.private_count)
        : [field(r.project_name ?? r.project ?? r.name, '检查项'), field(r.state_text ?? states[r.state], '结果'), field(r.reason_text, '原因')].filter(Boolean).join(' · ')}</li>`).join('')}</ul>` : field(body.note, '检查记录');
    }
    if (Array.isArray(body.rows)) {
      const words = { 'healthy-noop': '屏幕正常，没有恢复动作', repaired: '已经恢复', 'not-eligible': '这次不需要恢复', 'restart-did-not-recover-three-screens': '重启后仍未恢复三屏' };
      return body.rows.map(r => {
        const title = [stamp(time(r.at)), words[r.status], r.before?.count != null && `恢复前 ${r.before.count} 屏`,
          r.after?.count != null && `恢复后 ${r.after.count} 屏`].filter(Boolean).map(esc).join(' · ');
        const decisions = [
          ['显卡重启', r.gpu_restart], ['显卡退出码', r.gpu_exit_code], ['叠加层保留', r.rtss_preserved], ['壁纸指令已发出', r.wallpaper?.dispatched],
        ].filter(([, v]) => v != null).map(([k, v]) => `<li>${k} ${field(typeof v === 'boolean' ? v ? '是' : '否' : v, k)}</li>`);
        const screens = [['恢复前', r.before], ['恢复后', r.after]].flatMap(([label, shot]) => (shot?.screens || []).map(v =>
          `<li>${label} · ${field(v.name ?? v.DeviceName, '显示器')} ${v.Width != null && v.Height != null ? esc(`${v.Width} × ${v.Height}`) : ''}${v.Primary ? ' · 主屏' : ''}</li>`));
        return `<p>${title}</p>${decisions.length || screens.length ? `<ul>${decisions.join('')}${screens.join('')}</ul>` : ''}`;
      }).join('');
    }
    return field(body.text ?? body.note, '检查记录');
  }
  function readChecks(resource, target) {
    if (!resource) return;
    const expected = viewer;
    detailWatches.push(window.Live.watch(resource, null, {
      data(d, meta) {
        if (!target.isConnected) return;
        U.html(target, d && meta.viewer?.kind === expected && viewer === expected ? checks(d) || '逐项结果未读到' : '', false);
      },
      link(state) {
        if (!target.isConnected) return;
        if (!state.data && ['none', 'gone'].includes(state.phase)) U.html(target, state.offline ? '这块没存下来，连上后补上。' : '逐项结果未读到', false);
        U.blockNote(target, state);
      },
    }));
  }
  function failure(d, runs, kind) {
    const dLast = d.last && !protectedField(d.last) && asRun(d.last);
    const r = dLast && (runs.find(r => Math.floor(runTime(r) / 1000) === Math.floor(runTime(dLast) / 1000)) || dLast);
    const known = r?.result === 'failed';
    $('failure').hidden = kind !== 'plan' || !known;
    if ($('failure').hidden) return;
    const why = marked(field(r.reason ?? dLast.reason, '出错原因'), r.reason != null ? r : dLast, 'reason', '出错原因');
    const output = marked(field(runOutput(d, r), '本次运行结果'), r.output != null ? r : d, 'output', '本次运行结果');
    U.html($('failure-text'), [times(r), why || (r.exit_code != null ? '只读到退出码，没有出错原因的记录' : '没有出错原因的记录'), output].filter(Boolean).map(v => `<p>${v}</p>`).join(''), false);
    const target = $('failure-checks');
    U.html(target, '', false); readChecks(runPath(d, r), target);
  }
  const bar = U.topbar({ ask: () => task ? `请看实况的任务「${text(task.name)}」，说明怎么跑、最近结果及该关注什么。` : '' });
  const stopChecks = () => { detailWatches.forEach(w => w.stop()); detailWatches = []; };
  function render(d) {
    const page = pageOf(d), kind = variantOf(d), runs = runsOf(page ? { ...d, runs: [...d.runs, ...olderRuns.values()] } : d), upcoming = nextRuns(d);
    document.body.dataset.variant = kind;
    document.body.dataset.scheme = kind === 'plan' ? d.group || 'other' : kind === 'pickup' ? d.illustration_key || ART[d.id] || 'pickup-repair' : 'moon-calendar';
    $('task-body').hidden = false;
    const { rows, coverage, covered, outcome } = metrics(d, runs, kind);
    const quiet = quietWeek(d, runs, kind, covered) || (neverRan(d, kind) ? '还没跑过' : '');
    crumbs(d, kind); renderHero(d, kind, upcoming, kind === 'pickup' && rows[0][2], runs, quiet);
    schedulePrompt(d, kind);
    // 统计格用同一批次的结果；旧包按格里使用的次数分档。
    $('task-stats').dataset.outcome = kind === 'plan' ? outcome : '';
    // “已读部分没有”要和格名连着读：合成一整句（“已读部分没有出错”）写在一行，格名不再另起一行（主控 11-26 看 07a、07b：原来拆成“已读部分没有／出错”两行）。
    // 出错那格读到的是 0 次（含“已读部分没有出错”）时不上粉色：粉色是有出错时的底色，0 次和“全成功不上色”同一个意思（M779）
    write($('task-stats'), quiet ? '' : rows.map(([key, label, number, note, reason]) => {
      const whole = !number && reason === '已读部分没有', none = key === 'failure' && (whole || number === count(0, true));
      return `<div class="glass task-stat" data-stat="${key}"${whole ? ' data-whole' : ''}${none ? ' data-none' : ''}><dt>${label}</dt><dd${number ? '' : reason ? ' data-unknown data-why' : ' data-unknown'}${note ? ` title="${esc(note)}"` : ''}>${number || esc(whole ? reason + label : reason || '未读到')}</dd></div>`;
    }).join(''), false);
    const total = page ? Math.max(runs.length, Number(page.total) || 0) : runs.length;
    const cursor = page ? deepCursor !== undefined ? deepCursor : page.next_cursor ?? null : null;
    const second = r => Math.floor(runTime(r) / 1000);
    const old = legacyRun && (runs.find(r => r.run_key === legacyRun) || pickedRun && runs.find(r => second(r) === second(pickedRun))) || null;
    // 要看的那一次比已取的都早：先摆已取的，“再看”按钮在中间，那一次单独摆在最后并展开
    const detached = !old && pickedRun;
    if (legacyRun && !old && page && cursor && !pickAsked) askPicked();
    const open = [...$('rec').querySelectorAll('[data-time]:has(details[open])')].map(el => Number(el.dataset.time));
    if (old || detached) open.push(runTime(old || detached));
    U.html($('runs'), history(d, runs.slice(0, 6), kind, open), false);
    $('more-runs').hidden = total <= 6;
    const earlier = Math.max(0, total - 6), moreLabel = `<span class="disclosure-closed">展开（更早的 ${earlier} 次）</span><span class="disclosure-open">收起（更早的 ${earlier} 次）</span><span class="disclosure-chev" aria-hidden="true">›</span>`;
    if ($('more-runs').querySelector('summary').innerHTML !== moreLabel) $('more-runs').querySelector('summary').innerHTML = moreLabel;
    // 更早的一次只摆一批，底下“再看 50 次”接着摆；几千次一次全写进来会把页面卡死（M632）。要看的那一次在后面时摆到它为止。
    // 后台分页时已取的都摆出来，“再看”向后台取下一批；老回包一次带全的照旧本地分批摆
    const rest = runs.slice(6), target = old ? rest.indexOf(old) : -1;
    if (!page && target >= restShown) restShown = Math.ceil((target + 1) / RUN_BATCH) * RUN_BATCH;
    const shown = page ? rest : rest.slice(0, restShown), left = Math.max(0, total - 6 - shown.length - (detached ? 1 : 0));
    const more = left && (!page || cursor) ? `<button type="button" class="more" data-runs-more${pageLoading ? ' disabled' : ''}>${pageFailed || `再看 ${Math.min(RUN_BATCH, left)} 次（还有 ${left} 次） ›`}</button>` : '';
    U.html($('runs-rest'), (shown.length ? history(d, shown, kind, open) : '') + more + (detached ? history(d, [detached], kind, open, !shown.length) : ''), false);
    if (target >= 0 || detached) $('more-runs').open = true;
    write($('run-coverage'), quiet ? '' : readNotice(d, coverage, runs, covered));
    $('future').hidden = kind !== 'schedule';
    if (kind === 'schedule') {
      U.html($('future-runs'), upcoming.map(t => `<li><time datetime="${new Date(t).toISOString()}">${esc(stamp(t, true))}</time></li>`).join(''), false);
      const state = ['paused', 'disabled'].includes(d.state) ? label(d.state, kind) : '';
      const gap = upcoming.length < 3 ? upcoming.length ? `只读到 ${upcoming.length} 次的安排` : '未来运行时间未读到' : '';
      write($('future-note'), state || [offline && upcoming.length && '断开前的安排', gap].filter(Boolean).join(' · '));
    }
    facts(d, kind);
    stopChecks();
    failure(d, runs, kind);
    for (const el of document.querySelectorAll('details[data-results]')) {
      delete el.dataset.loaded;
      el.ontoggle = () => {
        if (!el.open || el.dataset.loaded) return;
        el.dataset.loaded = 'true'; readChecks(el.dataset.results, el.querySelector('[data-result-content]'));
      };
      el.ontoggle();
    }
    // 滚到要看的那一次（展开着）；更早的那几次是往下长开的，等长开的动效走完、页面够高了再滚，不然只滚得动一点点
    if ((old || detached) && !selected) {
      selected = true;
      const at = runTime(old || detached);
      requestAnimationFrame(() => Promise.allSettled($('more-runs').getAnimations({ subtree: true }).map(a => a.finished)).then(() => {
        const row = $('rec').querySelector(`li[data-time="${at}"], tr[data-time="${at}"]`);
        if (row?.getClientRects().length) row.scrollIntoView({ block: 'center' }); else $('run-results').scrollIntoView({ block: 'start' });
      }));
    }
  }
  function empty(message, denied = false, revoked = false) {
    stopChecks(); task = null; document.title = '任务详情 · 实况';
    U.html($('task-prompt-facts'), '', false);
    for (const key of ['task-body', 'task-status', 'task-meta', 'task-purpose', 'task-week', 'task-acts', 'crumb-name', 'crumb-group']) $(key).hidden = true;
    const text = esc(message);
    U.html($('name'), denied ? field({ visibility: 'owner' }, '这个任务的内容')
      : revoked ? text.replace('访客版', '<span class="task-phrase">访客版</span>') : text, false);
  }
  if (!id) empty('没有说是哪个任务');
  else {
    let changed = false;
    const reading = U.reading(hero.querySelector('.task-hero__copy'), { name: '任务' });
    window.Live.watch(`tasks/${encodeURIComponent(id)}`, null, {
      phase(state) { if (!task && !state.meta?.publicationRevoked) reading.set(state); },
      data(d, meta) {
        viewer = meta.viewer?.kind || 'public'; packetAt = meta.at; changed = true;
        if (olderViewer !== viewer || meta.publicationRevoked) { olderRuns = new Map(); deepCursor = undefined; pickedRun = null; pickAsked = pageFailed = false; olderViewer = viewer; }
        else if (pageOf(task)) keepRuns(task.runs);
        task = d;
      },
      link(state) {
        bar?.set(state);
        const before = offline;
        offline = !!state.offline;
        document.body.classList.toggle('task-offline', offline);
        if (valid(time(state.now))) now = time(state.now);
        U.list($('notices'), offline ? [{ key: 'offline', cls: 'notice glass', html: field(state.text, '连接情况') }] : [], { animate: false });
        if (state.meta?.status === 403 || protectedField(task)) empty('这项任务仅本人可见', true);
        else if (task?.q === 'warming') empty('正在准备任务记录');
        else if (task && (changed || before !== offline)) { render(task); reading.done(); }
        else if (!task && !['idle', 'wait', 'slow'].includes(state.phase)) {
          const revoked = state.meta?.publicationRevoked;
          if (revoked) {
            for (const key of ['task-status', 'task-meta', 'task-purpose', 'task-week', 'task-acts', 'crumb-name', 'crumb-group',
              'task-stats', 'failure-text', 'failure-checks', 'runs', 'runs-rest', 'run-coverage', 'future-runs', 'future-note', 'facts']) $(key).replaceChildren();
          }
          empty(revoked ? updating('任务详情') : state.meta?.status === 404 ? '没有这个任务' : state.say || '任务详情暂时读不到', false, revoked);
          reading.done();
        }
        changed = false;
        U.blockNote(stage, state);
      },
    });
  }
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();
