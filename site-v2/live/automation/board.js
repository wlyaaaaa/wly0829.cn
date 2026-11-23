// 实况 · 自动任务：后台 AI 替本人干的八类活。页头写这周替你做成了什么（不写钱），下面是“现在在跑”、八行总表；
// 点一行在原地展开这一类的机制（怎么触发、一步步怎么走、为什么、提示词原文、坏了怎么办）。本人 11-23 01:19 AUTO1123 定。
// 读 /computer-access/live/v1/automation 的候选字段（categories、results_7d、active_categories、provider_pauses）。
// 单件活（?work=）、修理的小类（?type=backup 这类）、按项目看（?project=）仍走原来的页 /live/automation/work/。
(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const IDS = ['auto-repair', 'message-review', 'translator', 'weekly-rules', 'weekly-laptop', 'weekly-live', 'excerpt', 'ai-commitments'];
  const typeParam = params.get('type');
  if (params.has('work') || params.has('project') || (typeParam && !IDS.includes(typeParam))) {
    location.replace('/live/automation/work/' + location.search + location.hash);
    return;
  }
  const T = window.LiveTape, U = window.LiveUI, Live = window.Live, G = window.LiveAutomationGuide || {}, { esc } = U;
  const { list, known, int, dec, link, when, big, clock } = T;
  let state, viewer = 'public', open = typeParam, busy = false, feedback = null, landed = false, pausing = null;
  const F = (v, name) => T.field(v, viewer, name);
  // 类名是后台给的，“替你看新消息”在公开版改成“替本人”
  const cn = v => viewer === 'owner' || typeof v !== 'string' ? v : v.replace(/^替你/, '替本人');
  const you = () => T.you(viewer);
  const mode = c => c?.setting?.mode;
  const pauseOf = (d, id) => list(d.provider_pauses).find(p => list(p.categories).includes(id));
  const minutes = s => known(s) ? (s < 3600 ? `${Math.max(1, Math.round(s / 60))} 分钟` : `${Math.floor(s / 3600)} 小时 ${Math.round(s % 3600 / 60)} 分`) : '';

  // —— 页头：这周替你做成了 ——
  function results(d) {
    const r = d.results_7d || {};
    // 没有数时后台说了为什么空（如翻译官没登记项目），就照写那句，不写“还没采上”
    const cell = (label, value, unit, tail, key, why) => `<div class="au-win"><p class="au-win__label">${label}</p>
      ${known(value) ? `<p class="tp-big">${big(value, 'win-' + key)}<small>${unit}</small></p>${tail ? `<p class="au-win__tail">${tail}</p>` : ''}`
        : why ? `<p class="tp-big tp-fog">空着</p><p class="au-win__tail">${why}</p>` : '<p class="tp-big tp-fog">还没采上</p>'}</div>`;
    const translatorWhy = F(r.translator_versions_missing ?? list(d.categories).find(c => c.id === 'translator')?.result_7d?.missing_reason, '为什么空着');
    return `<section class="tp-panel au-wins" id="results"><div class="tp-panel__head"><h2>这周替${you()}做成了<small>近 7 天</small></h2><span class="tp-asof">截至 ${esc(when(r.at || d.at))}</span></div>
      <div class="tp-grid au-wins__grid tp-divide">${cell('修好', r.repaired, '件', basis(r.repaired_basis), 'repaired')}${cell('记下', r.messages_logged, '件', `消息给${you()}`, 'messages')}
      ${cell('规矩改好', r.rules_fixed, '处', '', 'rules')}${cell('翻译官出了', r.translator_versions, '版', '', 'translator', translatorWhy)}</div>${missingWeek(d)}</section>`;
  }
  // 后台给的口径说明 {text, from}：数下面照写一行小字（自动修理的“修好”、成和坏、账本的修好各数各的）；
  // 页上已经写了起算日（shown）或 text 里自己写了日子的，不再补“几号起”
  const dated = text => /\d{1,2} *[-月.\/] *\d{1,2}/.test(text);
  function basis(b, shown) {
    const text = b ? U.fieldText(b.text, viewer).trim() : '';
    if (!text) return '';
    return F(b.text, '口径说明') + (!shown && T.stamp(b.from) && !dated(text) ? ` ·&nbsp;${esc(T.day(b.from))}&nbsp;起` : '');
  }
  // 这周的合计后台没给时写为什么：派活记录从哪天才有
  function missingWeek(d) {
    const r = d.results_7d || {};
    if (['repaired', 'messages_logged', 'rules_fixed', 'translator_versions'].some(k => known(r[k]))) return '';
    const since = list(d.categories).map(c => T.stamp(c.result_7d?.recorded_since)).filter(Boolean).sort((a, b) => a - b)[0];
    const from = T.stamp(r.from);
    return `<p class="tp-small au-why-missing">${since && (!from || since > from) ? `派活记录从 ${esc(when(new Date(since).toISOString()))} 才有，不满一整周，后台先不给这周的合计。` : '这周的合计后台还没给。'}</p>`;
  }
  // 几秒、几分钟、几小时几分
  const spent = s => s < 60 ? [Math.round(s), '秒'] : s < 3600 ? [Math.round(s / 60), '分钟'] : null;
  function usage(d) {
    const seconds = d.results_7d?.ai_seconds ?? d.ai_usage?.total?.seven_day_seconds;
    const days = list(d.ai_usage?.total?.days_7);
    const u = d.ai_usage || {}, since = T.stamp(u.covered_since), weekStart = T.stamp(d.results_7d?.from) || Date.now() - 7 * 86400000;
    const short = known(seconds) && spent(seconds);
    const label = !known(seconds) ? '<span class="tp-fog">还没采上</span>'
      : short ? `<span class="tp-mid">${big(short[0], 'use-m')}<small>${short[1]}</small></span>`
      : `<span class="tp-mid">${big(Math.floor(seconds / 3600), 'use-h')}<small>小时</small> ${big(Math.round(seconds % 3600 / 60), 'use-m')}<small>分</small></span>`;
    const covered = known(seconds) && since && since > weekStart ? `<small class="au-use__since">从 ${esc(when(u.covered_since))} 起记，更早的没有记录</small>` : '';
    const names = ['日', '一', '二', '三', '四', '五', '六'];
    const chart = days.some(x => known(x.seconds)) ? T.columns({ rows: days.map((x, i) => ({ label: i === days.length - 1 ? '今天' : names[new Date(x.date + 'T12:00:00+08:00').getDay()],
      parts: [{ value: (x.seconds || 0) / 3600, color: i === days.length - 1 ? '#00a650' : '#9fdcb9' }], text: known(x.seconds) ? `${dec(x.seconds / 3600)}h` : '没记' })),
      width: 380, height: 150, fmt: v => `${dec(v)}h`, grow: !drawn }) : `<p class="tp-small">每天各用多久后台还没分开给${known(seconds) ? '，先只有合计' : ''}。</p>`;
    return `<section class="tp-panel au-use" id="usage"><div class="tp-panel__head"><h2>这周后台 AI 共用了</h2></div><p class="au-use__num">${label}${covered}</p>${chart}</section>`;
  }

  // —— 现在在跑 ——
  // 进度条在跑的时候不会满：有步数按步数算（做完的步实心，正在做的那一步闪），没有步数按预计时间算、最多到 95%
  const lateText = end => Date.now() <= end ? `预计 ${esc(clock(new Date(end).toISOString()))} 完` : `比预计 ${esc(clock(new Date(end).toISOString()))} 晚了 ${minutes((Date.now() - end) / 1000)}`;
  const timeShare = (from, to) => Math.max(0, Math.min(.95, (Date.now() - from) / (to - from)));
  const timeText = (from, to) => Date.now() > to ? '按预计时间算：已过预计' : `按预计时间算：${Math.round(timeShare(from, to) * 100)}%`;
  function progress(r, started, end) {
    if (known(r.step) && known(r.steps) && r.steps > 0) {
      const done = Math.max(0, Math.min(r.steps - 1, r.step - 1));
      return `<div class="au-steps-bar" style="--n:${int(r.steps)}">${Array.from({ length: r.steps }, (_, i) => `<i${i < done ? ' class="is-done"' : i === done ? ' class="is-now"' : ''}></i>`).join('')}
        <b>按步数：做完 ${int(done)} 步，共 ${int(r.steps)} 步</b></div>`;
    }
    if (started && end && end > started) return `<div class="au-progress"><i data-from="${started}" data-to="${end}" style="width:${timeShare(started, end) * 100}%"></i><b data-pct data-from="${started}" data-to="${end}">${timeText(started, end)}</b></div>`;
    return '<div class="au-progress is-unknown"><i></i><b>进度没采上，只知道在跑</b></div>';
  }
  function running(d) {
    const rows = list(d.active_categories), cats = list(d.categories);
    if (!rows.length) {
      const next = cats.filter(c => c.next_at).sort((a, b) => T.stamp(a.next_at) - T.stamp(b.next_at))[0];
      return `<section class="tp-panel au-run" id="running"><p class="au-run__line"><span class="tp-dot"></span><b>这会儿没在跑</b>${next ? `<span>下一个：${esc(when(next.next_at))} ${F(next.title)}</span>` : ''}</p></section>`;
    }
    return `<section class="tp-panel au-run" id="running">${rows.map(r => {
      const cat = cats.find(c => c.id === r.category), started = T.stamp(r.started_at), end = T.stamp(r.estimated_end_at);
      const steps = known(r.step) && known(r.steps) && r.steps > 0 ? `第 ${int(r.step)} 步 / 共 ${int(r.steps)} 步${r.step_text ? `：${F(r.step_text)}` : ''}` : '';
      return `<div class="au-run__row"><p class="au-run__line"><span class="tp-dot is-live" data-tone="ok"></span><b>现在在跑</b>
        <span>${cat ? link(`?type=${cat.id}#cat-${cat.id}`, F(cn(cat.title))) : ''}${r.title ? ` · ${link(r.href, F(r.title, '这件活'))}` : ''}</span>
        ${steps ? `<span>${steps}</span>` : ''}${started ? `<span data-since="${started}">已跑 ${minutes((Date.now() - started) / 1000)}</span>` : ''}
        ${end ? `<span data-late="${end}">${lateText(end)}</span>` : ''}</p>${progress(r, started, end)}</div>`;
    }).join('')}</section>`;
  }
  // 跑着的那条：已跑几分钟、进度条每秒往前走
  setInterval(() => {
    for (const el of document.querySelectorAll('[data-since]')) el.textContent = `已跑 ${minutes((Date.now() - Number(el.dataset.since)) / 1000)}`;
    for (const el of document.querySelectorAll('[data-from][data-to]')) {
      const from = Number(el.dataset.from), to = Number(el.dataset.to);
      if (el.tagName === 'I') el.style.width = `${timeShare(from, to) * 100}%`; else el.textContent = timeText(from, to);
    }
    for (const el of document.querySelectorAll('[data-late]')) el.innerHTML = lateText(Number(el.dataset.late));
  }, 1000);

  function pauses(d) {
    return list(d.provider_pauses).filter(p => list(p.categories).length).map(p => {
      const names = list(d.categories).filter(c => list(p.categories).includes(c.id)).map(c => U.fieldText(cn(c.title), viewer)).join('、');
      return `<p class="tp-note">${esc(names)}停着：${pauseText(p)}</p>`;
    }).join('');
  }
  function pauseText(p) {
    const why = p.reason === 'login' ? '登录过期' : '额度用完';
    // 本人版：登录过期一律写这句并链到那张卡；后台还没给卡的地址时先链到等你的事清单
    const card = viewer === 'owner' && p.reason === 'login';
    return (card ? link(p.href || '/live/items/', `登录过期，登录命令在等${you()}的事里 ›`, 'tp-link au-warn') : esc(U.fieldText(p.text, viewer) || why)) + (p.started_at ? ` · ${esc(when(p.started_at))} 起` : '');
  }

  // —— 八行总表 ——
  function switchCell(c, offline) {
    const m = mode(c), until = c.setting?.until_at;
    const text = m === 'on' ? '开着' : m === 'off' ? '关着' : m === 'paused' ? `暂停到 ${esc(when(until))}` : '没读到';
    if (viewer !== 'owner' || offline || !m) return `<span class="au-state" data-mode="${esc(m || '')}">${text}</span>`;
    const fb = feedback?.id === c.id ? `<small role="status">${esc(feedback.text)}</small>` : '';
    return `<button type="button" class="au-switch" role="switch" aria-checked="${m === 'on'}" data-toggle="${esc(c.id)}" data-mode="${esc(m)}" aria-label="${esc(U.fieldText(cn(c.title), viewer))} · ${text}"><i></i><span>${m === 'on' ? '开' : '关'}</span></button>
      <button type="button" class="au-pausebtn" data-pause="${esc(c.id)}">${m === 'paused' ? `暂停到 ${esc(when(until))}` : '暂停到…'}</button>${fb}`;
  }
  function whenCell(d, c) {
    const g = G[c.id] || {}, p = pauseOf(d, c.id);
    const now = p ? `<span class="au-warn">${pauseText(p)}</span>` : c.running ? '<span class="au-ok">正在跑</span>'
      : c.next_at ? `下次 ${esc(when(c.next_at))}` : c.waiting_for ? F(c.waiting_for) : '';
    return `${esc(g.when || '')}${now ? `<small>${now}</small>` : ''}`;
  }
  function lastCell(c) {
    const r = c.last_result;
    const since = c.recent_stats?.recorded_since;
    if (!r) return mode(c) === 'off' ? `<span class="tp-muted">关着${c.id === 'weekly-live' ? '，网站上线收尾做完再开' : ''}</span>`
      : `<span class="tp-muted">${since ? `${esc(when(since))} 起还没跑过` : '还没有运行记录'}</span>`;
    return `${F(r.text, '上次结果')}<small>${esc(when(r.at))}</small>`;
  }
  function trendCell(c) {
    const days = list(c.daily_30d), s = c.recent_stats || {};
    if (!days.length) return '<span class="tp-fog">还没采上</span>';
    const since = T.stamp(s.recorded_since), late = since && since > (T.stamp(s.from) || 0) + 86400000;
    const nums = known(s.success) ? `成 ${int(s.success)} · 坏 ${int(s.failed)}` : '还没采上';
    const why = basis(s.basis, late);
    return `<div class="au-trend">${T.posneg(days, { width: 150, height: 34 })}<span${s.failed ? ' data-bad' : ''}>${nums}${late ? `<small> · ${esc(when(s.recorded_since))} 起记</small>` : ''}</span></div>${why ? `<small class="au-basis">${why}</small>` : ''}`;
  }
  function table(d) {
    const cats = IDS.map(id => list(d.categories).find(c => c.id === id)).filter(Boolean);
    if (!cats.length) return `<section class="tp-panel" id="types"><div class="tp-panel__head"><h2>八类自动任务</h2></div><p class="tp-empty">${d.types ? '这一版后台还没给八类的读数。' : '八类自动任务没读到。'}</p></section>`;
    const offline = state?.offline;
    return `<section class="tp-panel" id="types"><div class="tp-panel__head"><h2>八类自动任务<small>点一行看这一类怎么干</small></h2><span class="tp-asof">截至 ${esc(when(d.at))}</span></div>
      <table class="tp-table au-table"><thead><tr><th scope="col">任务</th><th scope="col">什么时候跑</th><th scope="col">用谁</th><th scope="col">上次结果</th><th scope="col">近 30 天</th><th scope="col">开关</th></tr></thead>
      <tbody>${cats.map(c => {
        const g = G[c.id] || {}, expanded = open === c.id, p = pauseOf(d, c.id);
        return `<tr id="cat-${c.id}" data-row="${c.id}" class="au-row${expanded ? ' is-open' : ''}${p ? ' is-paused' : ''}" data-mode="${esc(mode(c) || '')}">
          <th scope="row"><button type="button" class="au-name" data-open="${c.id}" aria-expanded="${expanded}" aria-controls="mech-${c.id}"><b>${F(cn(c.title))}</b><span>${esc(g.short || '')}</span><i class="tp-chev" aria-hidden="true">${expanded ? '收起' : '怎么干'}</i></button></th>
          <td>${whenCell(d, c)}</td><td class="au-model">${[c.model, c.model_effort].filter(Boolean).map(esc).join(' · ') || '没读到'}</td>
          <td>${lastCell(c)}</td><td>${trendCell(c)}</td><td class="au-switchcell">${switchCell(c, offline)}</td></tr>
          ${expanded ? `<tr id="mech-${c.id}" class="au-mechrow"><td colspan="6">${mechanism(d, c)}</td></tr>` : ''}`;
      }).join('')}</tbody></table>${scheduled(d)}
      <p class="tp-small au-foot">不叫 AI 的备份、同步、守护在 ${link('/live/tasks/', '计划任务 ›')}；一件件修了什么、约了什么在 ${link('/live/ledger/', 'AI 账本 ›')}。</p></section>`;
  }

  // —— 各家自带的定时（M183）：定稿只许拿来叫醒当前对话接着干，反复跑的活在上面八类里。三家都列，没有就写没有 ——
  function scheduled(d) {
    if (!Array.isArray(d.scheduled_activities)) return '';
    const rows = list(d.scheduled_activities), gaps = list(d.scheduled_gaps).map(g => U.fieldText(g, viewer)).filter(Boolean);
    const hosts = ['Claude', 'Codex', 'Antigravity'];
    for (const r of rows) if (r.producer && !hosts.includes(r.producer)) hosts.push(r.producer);
    const item = r => `<li><b>${esc(when(r.next_at || r.at))}</b>${link(r.href, F(r.label, '这个定时'))}<small>${[F(r.period), F(r.state_text)].filter(Boolean).join(' · ')}${r.next_at ? ` · 下次 ${esc(when(r.next_at))}` : ''}</small></li>`;
    const body = hosts.map(h => {
      const mine = rows.filter(r => r.producer === h).sort((a, b) => T.stamp(b.next_at || b.at) - T.stamp(a.next_at || a.at));
      const notes = gaps.filter(g => g.includes(h)).map(g => `<small>${esc(g)}</small>`).join('');
      return `<tr><th scope="row">${esc(h)}${mine.length ? `<small>${int(mine.length)} 个</small>` : ''}</th><td>${mine.length ? `<ul class="au-recent">${mine.map(item).join('')}</ul>` : '没有'}${notes}</td></tr>`;
    }).join('');
    const rest = gaps.filter(g => !hosts.some(h => g.includes(h))).map(g => `<p class="tp-small">${esc(g)}</p>`).join('');
    return `<div class="au-extra au-sched" id="scheduled"><p class="tp-sub">各家自带的定时<small>只用来叫醒当前对话接着干，反复跑的活都在上面八类里</small></p>
      <table class="tp-table au-mini-table"><tbody>${body}</tbody></table>${rest}</div>`;
  }

  // —— 一类的机制：原地展开 ——
  function mechanism(d, c) {
    const g = G[c.id] || {}, s = c.recent_stats || {};
    const steps = list(g.steps);
    const flow = `<ol class="au-flow">${steps.map(([title], i) => `<li><span>${i + 1}</span>${esc(title)}</li>`).join('')}</ol>`;
    const stepText = `<div class="au-steps">${steps.map(([title, text], i) => `<p><b>${i + 1}. ${esc(title)}</b>${esc(text)}</p>`).join('')}</div>`;
    const stat = (label, value, unit, tone) => `<div class="au-stat" data-tone="${tone}"><p>${label}</p><p class="tp-big">${known(value) ? `${big(value, `st-${c.id}-${label}`)}<small>${unit}</small>` : '<span class="tp-fog">还没采上</span>'}</p></div>`;
    const why = list(g.why).map(([q, a]) => `<p><b>${esc(q)}</b>${esc(a)}</p>`).join('');
    const extra = [];
    if (c.id === 'auto-repair' && list(c.subcategories).length) extra.push(`<div class="au-extra"><p class="tp-sub">各小类 <small>${viewer === 'owner' ? '能单独关' : '本人能单独关'}</small></p><p class="au-subs">${list(c.subcategories).map(sub =>
      `<span class="tp-pill" data-mode="${esc(mode(sub) || '')}">${F(sub.title)} · ${mode(sub) === 'on' ? '开' : mode(sub) === 'off' ? '关' : mode(sub) === 'paused' ? '暂停' : '没读到'}${viewer === 'owner' && !state?.offline && mode(sub) ? ` <button type="button" class="au-mini" data-toggle="${esc(sub.id)}" data-mode="${esc(mode(sub))}">${mode(sub) === 'on' ? '关掉' : '打开'}</button>` : ''}</span>`).join('')}</p></div>`);
    if (c.id === 'translator' && list(c.projects).length) extra.push(`<div class="au-extra"><p class="tp-sub">各工程的《他要什么》</p><table class="tp-table au-mini-table"><tbody>${list(c.projects).map(p =>
      `<tr><th scope="row">${F(p.name)}</th><td>第 ${int(p.version)} 版 · ${esc(when(p.published_at))}</td><td>${p.uncertain_count ? `${int(p.uncertain_count)} 条拿不准` : '没有拿不准的'}</td></tr>`).join('')}</tbody></table></div>`);
    if (list(c.weekly_runs).length) extra.push(`<div class="au-extra"><p class="tp-sub">每周一行</p><table class="tp-table au-mini-table"><tbody>${list(c.weekly_runs).map(w =>
      `<tr><th scope="row">${esc(T.day(w.scheduled_at))}</th><td>${F(w.summary)}</td><td>${known(w.elapsed_seconds) ? esc(minutes(w.elapsed_seconds)) : ''}</td></tr>`).join('')}</tbody></table></div>`);
    if (list(c.recent_runs).length) extra.push(`<div class="au-extra"><p class="tp-sub">最近几次</p><ul class="au-recent">${list(c.recent_runs).map(r =>
      `<li><b>${esc(when(r.at))}</b>${r.ledger_href ? link(r.ledger_href, F(r.summary)) : F(r.summary)}</li>`).join('')}</ul></div>`);
    if (list(c.setting_log).length) extra.push(`<div class="au-extra"><p class="tp-sub">开关改动</p><ul class="au-recent">${list(c.setting_log).map(r => `<li><b>${esc(when(r.at))}</b>${F(r.text)}</li>`).join('')}</ul></div>`);
    return `<div class="au-mech"><p class="tp-sub au-mech__title">${F(cn(c.title))}怎么干</p>${flow}
      <p class="au-trigger"><b>怎么触发</b>${esc(g.trigger || '')}</p>${stepText}
      <div class="tp-grid au-stats">${stat('近 30 天成', s.success, '次', 'ok')}${stat('坏', s.failed, '次', s.failed ? 'bad' : 'off')}${stat('平均', known(s.average_seconds) ? Math.max(1, Math.round(s.average_seconds / 60)) : null, '分钟', 'blue')}</div>
      ${basis(s.basis) ? `<p class="tp-small au-basis">成和坏：${basis(s.basis)}</p>` : ''}
      ${extra.join('')}
      <div class="au-more">
        <details class="tp-details" id="prompt-${c.id}"><summary>提示词原文</summary><pre>${c.prompt_template ? F(c.prompt_template, '提示词') : '这一类没有固定的提示词：' + esc(c.id === 'weekly-laptop' ? '按巡检清单跑程序，坏了才叫 AI。' : '后台这版没给原文。')}</pre></details>
        <details class="tp-details" id="why-${c.id}"><summary>为什么这样做、为什么这个钟点和型号</summary><div class="au-why"><p><b>用谁</b>${esc(g.who || '')}现在是 ${[c.model, c.model_effort].filter(Boolean).map(esc).join(' · ')}，换代跟着模型清单走。</p>${why}</div></details>
        <details class="tp-details" id="fail-${c.id}"><summary>坏了怎么办、怎么关、结果去哪</summary><div class="au-why"><p><b>坏了怎么办</b>${esc(g.failure || '')}</p><p><b>关了会怎样</b>${esc(g.off || '')}</p><p><b>花多少时间</b>${esc(g.cost || '')}</p><p><b>结果去哪</b>${esc(g.result || '')}</p></div></details>
      </div></div>`;
  }

  // —— 快讯：后台出 feed 就用；没出先拿在跑、最近几次、暂停拼 ——
  function feed(d) {
    if (Array.isArray(d.feed)) return d.feed.map(r => ({ at: r.at, actor: U.fieldText(r.actor, viewer), text: U.fieldText(r.text, viewer), href: r.href, tone: r.tone }));
    const rows = [], cats = list(d.categories), title = id => U.fieldText(cn(cats.find(c => c.id === id)?.title), viewer);
    for (const r of list(d.active_categories)) rows.push({ at: r.started_at, actor: title(r.category), html: `<em>正在跑</em> ${esc(U.fieldText(r.title, viewer))}${known(r.step) ? ` · 第 ${r.step} 步` : ''}`, href: `?type=${r.category}#cat-${r.category}`, tone: 'ok' });
    for (const p of list(d.provider_pauses)) rows.push({ at: p.started_at, actor: list(p.categories).map(title).join('、'), html: `<em>${p.reason === 'login' ? '登录过期' : '额度用完'}</em>，停着`, tone: 'owner' });
    for (const c of cats) for (const r of list(c.recent_runs).slice(0, 3)) rows.push({ at: r.at, actor: U.fieldText(cn(c.title), viewer), text: U.fieldText(r.summary, viewer), href: `?type=${c.id}#cat-${c.id}`, tone: 'ok' });
    return rows.filter(r => T.stamp(r.at) && Date.now() - T.stamp(r.at) < 3 * 86400000).sort((a, b) => T.stamp(b.at) - T.stamp(a.at)).slice(0, 30);
  }

  let drawn = false;
  function draw() {
    const d = state?.data;
    viewer = T.viewerOf(state);
    if (!d) { T.paint(page.root, T.placeholder(state, '自动任务')); page.tick.set([], { off: true }); return; }
    T.paint(page.root, `<div class="tp-head"><div><h1>自动任务</h1><p>后台 AI 替${you()}干的八类活：在跑什么、几点跑、用谁、上次怎样、开没开。</p></div><p class="tp-head__side"><span>截至 ${esc(when(d.at))}</span></p></div>
      ${T.stateNote(state)}<div class="tp-grid au-top">${results(d)}${usage(d)}</div>${running(d)}${pauses(d)}${table(d)}`);
    drawn = true;
    page.tick.set(feed(d), { off: state.offline });
    // 只在进页那一次按地址里的 #… 或 ?type= 滚过去；之后点开一行不再跳，“收起”留在原处
    if (!landed) { landed = true; if (location.hash || typeParam) T.reveal(location.hash.slice(1) || `cat-${typeParam}`); }
  }

  async function save(id, value) {
    if (busy) return null;
    busy = true;
    try { return await Live.automationSetting({ operation: 'type-mode', id, value }); } finally { busy = false; }
  }
  function saved(id, reply) {
    feedback = reply.status === 'saved' ? { id, text: '已保存' } : reply.status === 'retired' ? { id, text: reply.message || '已撤' }
      : reply.error === 'cockpit_owner_required' ? null : { id, text: reply.status === 'unknown' ? '没确认存上没有，刷新看看' : '没存上，再点一次' };
    if (reply.status === 'saved' && reply.current) {
      for (const c of list(state?.data?.categories)) for (const row of [c, ...list(c.subcategories)]) if (row.id === id) row.setting = { ...row.setting, ...reply.current };
    }
    draw();
    void Live.refresh();
  }
  const dialog = document.getElementById('au-pause'), form = dialog.querySelector('form');
  dialog.querySelector('[data-cancel]').addEventListener('click', () => dialog.close());
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!pausing) return;
    const reply = await save(pausing, { mode: 'paused', until_at: `${form.elements.value.value}:00+08:00` });
    if (!reply) return;
    if (reply.status === 'saved' || reply.error === 'cockpit_owner_required') dialog.close();
    else form.querySelector('[data-result]').textContent = '没存上，再试一次';
    saved(pausing, reply);
  });

  let page;
  page = T.boot({ resource: 'automation', back: '/live/#automation',
    ask: () => '请看实况自动任务页：八类后台 AI 活现在在跑什么、哪类坏了或停着、要不要我出面。先用大白话说，别动手。',
    onState(next) { state = next; draw(); } });
  page.root.addEventListener('click', async e => {
    const toggle = e.target.closest('[data-toggle]'), pause = e.target.closest('[data-pause]');
    // 整行都能点开：点在开关、暂停、链接以外的地方，等于点了这一行的名字
    const row = !e.target.closest('a, button, input') && e.target.closest('tr[data-row]');
    const opener = e.target.closest('[data-open]') || (row && page.root.querySelector(`[data-open="${row.dataset.row}"]`));
    if (opener) {
      open = open === opener.dataset.open ? null : opener.dataset.open;
      const url = new URL(location.href);
      if (open) url.searchParams.set('type', open); else url.searchParams.delete('type');
      history.replaceState(history.state, '', url.pathname + url.search);
      T.keep(page.root, `[data-open="${opener.dataset.open}"]`, draw);
      return;
    }
    if (toggle) {
      const id = toggle.dataset.toggle, reply = await save(id, { mode: toggle.dataset.mode === 'on' ? 'off' : 'on' });
      if (reply) saved(id, reply);
      return;
    }
    if (pause) {
      const access = await Live.automationSetting({ operation: 'access' });
      if (access.status !== 'pass') { saved(pause.dataset.pause, access); return; }
      pausing = pause.dataset.pause;
      form.querySelector('[data-result]').textContent = '';
      dialog.showModal();
    }
  });
})();
