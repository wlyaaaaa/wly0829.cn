window.LegacyAutomation = function (bar) {
  'use strict';
  const U = window.LiveUI, L = window.LiveLight, { esc } = U;
  const $ = id => document.getElementById(id), params = new URLSearchParams(location.search);
  const project = params.get('project'), query = params.get('q');
  const groups = [
    ['ai-pickup', 'AI 自动接活', '事情发生时，AI 自己接手处理', 'sparkle', 'upkeep', ['动作', '什么时候触发', '今天', '最近一次']],
    ['ai-schedule', 'AI 定时任务', 'AI 平台上约好时间的任务', 'clock', 'ai-schedule', ['任务', '谁来做', '时间安排', '下一次']],
  ].map(([id, name, intro, icon, art, columns]) => {
    const widths = id === 'ai-pickup' ? [1.25, 1.2, .68, 1.2] : [1.35, .72, 1.08, 1];
    const board = window.LiveBoard.create($('groups'), {
      cols: 1, columns: columns.map((label, i) => ({ label, width: `minmax(0, ${widths[i]}fr)` })),
    });
    const card = board.card(id, { icon, tint: 'lilac', art });
    U.fold(card.more, card.box);
    return { id, name, intro, board, card };
  });
  const route = (path, query) => {
    const url = new URL(path, location.origin);
    for (const [key, value] of Object.entries(query || {})) if (value) url.searchParams.set(key, value);
    if (params.has('fixture')) url.searchParams.set('fixture', params.get('fixture'));
    return url.pathname + url.search;
  };
  $('scheduled-link').href = route('/live/tasks/', { project });
  U.html($('recent-icon'), window.LiveBoard.icon('play'));
  let packet, shownAt, viewer = 'public', connection;
  const field = (value, name, place) => U.fieldHtml(value, { name, place, kind: viewer });
  const hidden = t => viewer !== 'owner' && (t.hidden || t.visibility === 'owner' || t.public === 'owner');
  const count = n => Number.isInteger(n) && n >= 0;
  const clock = () => !connection?.offline && connection?.now || new Date().toISOString();
  const bjDay = at => Math.floor((Date.parse(at) + 8 * 3600000) / 86400000);
  const raw = value => typeof value === 'string' ? value : U.fieldText(value, viewer);
  const time = (value, prefix = false) => {
    const at = raw(value), diff = bjDay(at) - bjDay(clock());
    if (!Number.isFinite(diff)) return '';
    const day = diff === 0 ? prefix && '今天' : diff === 1 && prefix ? '明天' : U.date(at);
    return esc([day, U.time(at)].filter(Boolean).join(' '));
  };
  function today(t) {
    if (bjDay(t.runs_at) !== bjDay(clock()) || !count(t.today_runs) || !['ok', 'partial'].includes(t.today_runs_q)) return null;
    return t.today_runs || t.today_runs_q === 'ok' ? t.today_runs : null;
  }
  const resultText = { ok: '跑完', failed: '没跑成', running: '正在跑', done: '已完成', unknown: '结果未读到' };
  const dot = (state, describe = false) => {
    const label = { warn: '要留意', disabled: '已停用', ...resultText }[state];
    return `<i class="automation-dot" data-result="${label ? esc(state) : 'unknown'}" ${describe ? `role="img" title="${label || resultText.unknown}" aria-label="${label || resultText.unknown}"` : 'aria-hidden="true"'}></i>`;
  };
  const result = run => resultText[run?.result] || resultText.unknown;
  const nextAt = t => t.next_at ?? t.next;
  const nextTime = t => Date.parse(raw(nextAt(t)));
  const future = t => !hidden(t) && nextTime(t) > Date.parse(clock());
  const scheduledAgain = t => t.enabled !== false && !['paused', 'disabled'].includes(t.state)
    && t.scheduled_again !== false && (future(t) || t.scheduled_again === true && raw(t.schedule) !== '单次运行');
  const next = t => future(t) ? time(nextAt(t), true) : '下次时间未读到';
  // 平台名：三家都认（Antigravity 的定时 11-25 起也进这一组，M921）
  const PROVIDERS = { codex: 'Codex', claude: 'Claude', antigravity: 'Antigravity' };
  const provider = t => {
    const id = raw(t.scheduler);
    return Object.hasOwn(PROVIDERS, id)
      ? `<span class="automation-provider" data-provider="${id}">${PROVIDERS[id]}</span>` : '平台未读到';
  };
  function row(t, pickup) {
    const title = field(t.display_name ?? t.name, '任务名', 'title') || '任务名未读到';
    if (hidden(t)) return { key: t.id, cls: 'row lb-row--empty automation-note', html: field({ visibility: 'owner' }, '这项任务的详情') };
    const last = Object.hasOwn(t, 'runs_at') ? t.last : null, when = time(last?.start || last?.end);
    const frequency = today(t);
    const todayText = frequency == null ? '次数未读到' : `${t.today_runs_q === 'partial' ? '至少 ' : ''}${frequency} 次`;
    const recent = when ? `${when}${!last.start ? ' 结束' : ''}<span class="automation-result">${dot(last.result)}${result(last)}</span>` : '运行时间未读到';
    const trigger = typeof t.trigger_text === 'string' ? t.trigger_text
      .replace(/^根会话完成新的上下文压缩时触发/u, '对话压缩完成后')
      .replace(/^有故障或待复查事项进入收件箱/u, '收到故障或复查事项')
      .replace(/^有待跑项时，Claude 下次收到消息就启动/u, '有待验收时收到消息')
      .split(/[，；。]/u, 1)[0] : t.trigger_text;
    const cells = pickup ? [field(trigger, '触发条件') || '触发条件未读到', todayText, recent]
      : [provider(t), field(t.schedule, '调度') || '调度未读到', next(t)];
    const href = route('/live/task/', { id: t.id });
    const actions = viewer === 'owner' ? U.actions(t, [{ kind: 'copy', label: '问情况', intent: 'ask' }]) : '';
    const state = pickup ? last?.result : { running: 'running', failed: 'failed', warn: 'warn' }[t.state] || t.last?.result;
    return { key: t.id, cls: 'row row--flat lb-row', html: `<span class="lb-row__lamp">${dot(state, true)}</span><div class="lb-cell lb-cell--name"><a class="row__title" href="${esc(href)}">${title}</a></div>${cells.map(value => `<p class="lb-cell">${value}</p>`).join('')}<div class="row__acts">${actions}</div>` };
  }
  function renderSummary(all, planned, known, waiting) {
    const activity = packet?.automation_activity, historical = activity?.recent;
    const runs = Array.isArray(historical)
      ? historical.filter(r => !hidden(r) && time(r.start || r.end)).map(run => ({ t: run, run }))
      : all.flatMap(t => hidden(t) ? [] : (t.recent || []).filter(r => time(r?.start || r?.end)).map(run => ({ t, run })));
    const display = runs.sort((a, b) => Date.parse(b.run.start || b.run.end) - Date.parse(a.run.start || a.run.end)).slice(0, 5);
    U.list($('recent'), display.map(({ t, run }) => {
      const at = run.start || run.end, name = t.display_name ?? t.name;
      const title = typeof name === 'string' && bjDay(at) !== bjDay(clock())
        ? name.replace(/\s*[（(](\d{2}-\d{2})(?:\s+([^（）()]*))?[）)]$/u, (full, date, remark) => {
          if (date !== U.date(at)) return full;
          return remark?.trim() ? `（${remark.trim()}）` : '';
        }) : name;
      return {
        key: `${t.id}:${at}`, cls: 'row row--flat automation-run',
        html: `<time datetime="${esc(at)}">${time(at)}</time><a href="${esc(route('/live/task/', { id: t.id }))}">${field(title, '任务名', 'title')}</a><span class="automation-result">${result(run)}</span>${dot(run.result)}`,
      };
    }), { animate: false });
    const reads = all.map(today), partial = known.some(g => !count(g?.total)) || !!packet?.next
      || known.reduce((total, g) => total + (g?.total ?? 0), 0) > all.length
      || reads.some((n, i) => n == null || all[i].today_runs_q === 'partial');
    const confirmed = reads.reduce((total, n) => total + (n ?? 0), 0);
    const started = activity
      ? today({ ...activity, runs_at: activity.at }) != null
        ? `${activity.today_runs_q === 'partial' ? '至少 ' : ''}${activity.today_runs}` : null
      : reads.some(count) && (!partial || confirmed > 0) ? `${partial ? '至少 ' : ''}${confirmed}` : null;
    const upcoming = planned.find(future);
    const quantity = g => count(g?.total) ? g.total : count(g?.known_total) && g.known_total > 0 ? `至少 ${g.known_total}` : null;
    const values = [quantity(known[0]), started, quantity(known[1]), upcoming ? next(upcoming) : null];
    const labels = ['种 AI 自动接活', '今天开工次数', '项 AI 定时任务', '下一次开工'];
    U.html($('stats'), labels.map((label, i) => `<div><dt>${label}</dt><dd class="${values[i] == null ? 'is-word' : i === 3 && values[i].includes(' ') ? 'is-dated' : ''}">${values[i] ?? (waiting ? '正在读' : '未读到')}</dd></div>`).join(''));
    const note = !display.length ? waiting ? '正在读' : '最近开工的时间和结果还没读到。' : (activity ? activity.today_runs_q === 'partial' : partial) ? '按已读到的开工时间排列。' : '';
    const readFrom = activity?.first_read_at, readTo = activity?.at;
    const readNote = time(readTo) && `开工回执读于 ${time(readFrom) && readFrom !== readTo ? `${time(readFrom)} 至 ` : ''}${time(readTo)}`;
    const summary = [note, readNote].filter(Boolean).join(' · ');
    U.html($('recent-note'), summary); $('recent-note').hidden = !summary;
  }
  function render() {
    const waiting = packet?.q === 'warming' || !packet && ['idle', 'wait', 'slow'].includes(connection?.phase);
    const known = groups.map(({ id }) => packet?.groups?.find(g => g.id === id));
    const valid = known.every(Boolean);
    $('groups').dataset.audience = viewer;
    const items = valid ? [...new Map([...(packet.items || []), ...known.flatMap(g => g.items || [])].map(t => [t.id, t])).values()] : [];
    const scope = items.filter(t => groups.some(g => g.id === t.automation_group) && (!project || t.project === project)
      && (!query || !hidden(t) && U.fieldText(t.display_name ?? t.name, viewer).toLowerCase().includes(query.toLowerCase())));
    const issue = valid && (packet?.q === 'stale' || packet?.gray_reason === 'stale') ? '清单暂未更新' : '';
    const message = connection?.publicPaused || connection?.offline ? esc(connection.text)
      : valid ? [issue, shownAt && `清单截至 ${time(shownAt)}`].filter(Boolean).join(' · ')
        : waiting ? '正在读' : 'AI 自动任务分组还没读到，等数据更新。';
    U.html($('notice'), message); $('notice').hidden = !message;
    const schedules = scope.filter(t => t.automation_group === 'ai-schedule');
    const planned = schedules.filter(scheduledAgain)
      .sort((a, b) => (future(a) ? nextTime(a) : Infinity) - (future(b) ? nextTime(b) : Infinity));
    const visibleGroups = known.map((g, i) => i !== 1 || !g ? g : { ...g,
      total: !packet.next && g.total === schedules.length ? planned.length : null,
      known_total: planned.length });
    renderSummary(scope, planned, visibleGroups, waiting);
    groups.forEach(({ id, name, intro, board, card }, i) => {
      const group = visibleGroups[i], pickup = id === 'ai-pickup', unit = pickup ? '种' : '项';
      const n = group?.total, uncertain = group?.known_total, shown = pickup
        ? scope.filter(t => t.automation_group === id).sort((a, b) => (Date.parse(b.last?.start || b.last?.end) || 0) - (Date.parse(a.last?.start || a.last?.end) || 0))
        : planned;
      const qty = count(n) ? `${n} ${unit}` : count(uncertain) ? `已读到 ${uncertain} ${unit}` : '';
      U.html(card.title, `<b>${name}</b>${qty ? `<span class="lb-card__count">${qty}</span>` : ''}`);
      const gap = field(group?.gap, '采集缺口') || (!count(n) && !waiting ? '这组的完整名册还没读到。' : '');
      U.html(card.sub, [intro, gap].filter(Boolean).join(' · '));
      const limit = pickup ? shown.length : 4, remaining = Math.max(0, shown.length - limit);
      U.list(card.main, shown.length ? shown.slice(0, limit).map(t => row(t, pickup)) : [{ key: 'empty', cls: 'row lb-row--empty automation-note',
        html: waiting ? '正在读' : n === 0 ? '这组没有任务' : query ? '没有符合筛选的已读任务' : '这组任务明细还没读到' }]);
      U.list(card.rest, shown.slice(limit).map(t => row(t, pickup)));
      U.html(card.more, `<span class="lb-more__open">展开（还有 ${remaining} 项）</span><span class="lb-more__shut">收起</span> <span class="more__chev">›</span>`);
      card.more.hidden = !remaining;
      board.layout();
    });
    L.lightUp([$('groups')]);
  }
  const subscription = window.Live.watch('tasks', { scope: 'automation', project, q: query }, {
    data(data, meta) { packet = data; shownAt = data?.source_at ?? data?.at ?? meta.at; viewer = meta.viewer?.kind || 'public'; render(); },
    link(state) { connection = state; bar?.set(state); L.offline(state.offline); render(); },
  });
  return () => { subscription.stop(); $('groups').replaceChildren(); };
};
