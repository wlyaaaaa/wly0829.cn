// 实况 · 自动任务 · 这一类：照本人 01:04 批的成品图 04-一类的页-自动修理-v2（本人 11-24 13:00：八类卡点进去是另一页，小开关去内页）。
// 页头大卡（类名、型号、上次结果、现在怎样、做什么、几点跑、开关、暂停到、怎么干 ›），四个数（近 7 天、做成、没做成、等下次检查），
// 最近几轮（点进一轮，再看 N 轮一直能看到底），接下来几次，这一类（做什么、谁来做、什么时候跑、各小类开关、开关改动）。
// 网址 /live/automation/category/?type=<类>。读 automation（各类的读数）、automation/runs?category=<类>（这一类每一轮，往后翻用 cursor）。
// 开关和暂停弹框照自动任务页那份就地写一份一样的（收敛办法：不为共用去改主页面的代码）。
(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const R = window.AutomationRuns, IDS = R.CATS;
  const id = IDS.includes(params.get('type')) ? params.get('type') : null;
  if (!id) { location.replace('/live/automation/' + location.hash); return; }
  const T = window.LiveTape, U = window.LiveUI, Live = window.Live, { esc } = U;
  const { list, known, int, link, when } = T;
  const heroArt = document.getElementById('ak-hero-art').innerHTML;
  let state, viewer = 'public', busy = false, feedback = null, pausing = null, runs = null, excerptToday;
  // 访客版称呼：画之前把指本人的“你”换成“本人”（runs.js 的 asOwner；私事线 11-26）
  const paint = (root, html) => T.paint(root, R.asOwner(html, viewer));
  // 最近几轮：先摆 5 轮，“再看 N 轮”每次多摆 20 轮，读到的不够就往后翻一页（长列表全站一个规则，本人 11-26 02:12）
  const FIRST = 5, STEP = 20;
  let shown = FIRST, more = [], cursor, paging = false, pageFailed = false;
  const F = (v, name) => T.field(v, viewer, name);
  const said = v => R.asOwner(v, viewer).trim().replace(/\s+/g, ' ').replace(/[。.]$/u, '')
    .replace(/^原因[：:]\s*/u, '');
  const resultWords = v => said(v).replace(/^这(?:一轮|次)\s*/u, '').replace(/[！？；!?]$/u, '');
  const cn = v => viewer === 'owner' || typeof v !== 'string' ? v : v.replace(/^替你/, '替本人');
  const you = () => T.you(viewer);
  const mode = c => c?.setting?.mode;
  const catOf = d => list(d?.categories).find(c => c.id === id);
  const minutes = s => known(s) ? (s < 3600 ? `${Math.max(1, Math.round(s / 60))} 分钟` : `${Math.floor(s / 3600)} 小时 ${Math.round(s % 3600 / 60)} 分`) : '';
  const today = () => T.dayKey(new Date().toISOString());
  const untilIso = v => { const t = typeof v === 'number' ? v * 1000 : T.stamp(v); return Number.isFinite(t) ? new Date(t).toISOString() : ''; };
  const pausedText = (v, brk = ' ') => {
    const at = untilIso(v);
    if (!at) return '';
    const d = new Date(T.stamp(at) + 8 * 3600000);
    return T.dayKey(at) === today() ? `暂停到今天 ${T.clock(at)}` : `暂停到 ${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日${brk}周${'日一二三四五六'[d.getUTCDay()]} ${T.clock(at)}`;
  };
  const pauseOf = d => list(d.provider_pauses).find(p => list(p.categories).includes(id));
  function pauseText(p) {
    const card = p.reason === 'login';
    const text = card ? '' : U.fieldText(p.text, viewer).replace(/^停着[：:，,]\s*/, '');
    const since = p.started_at && !(text && text.includes(T.clock(p.started_at))) ? ` · ${esc(when(p.started_at))} 起` : '';
    return (card ? link(p.href || '/live/items/', `登录过期，登录命令在等${you()}的事里 ›`, 'tp-link au-warn') : esc(text || '额度用完')) + since + (known(p.check_count) ? ` · 期间看了 ${int(p.check_count)} 次` : '');
  }

  // —— 一轮的样子：灯、几个字的结局 ——
  function tag(r) {
    if (r.excerptFallback) return { text: '没写成摘要', tone: 'bad' };
    const label = typeof r.statusLabel === 'string' && r.statusLabel.trim() ? F(r.statusLabel, '状态') : '';
    const [text, tone] = r.status === 'running' ? ['正在跑', 'run'] : r.deferred ? ['暂时不修', 'off'] : r.status === 'incomplete' ? ['没做成', 'bad']
      : r.status === 'completed' ? ['做成', 'ok'] : ['没记下结局', 'off'];
    return { text: label || text, tone };
  }
  const range = r => {
    const a = r.startedAt || r.queuedAt, b = r.finishedAt;
    const part = value => `<span class="au-nobr">${esc(value)}</span>`;
    if (!T.stamp(a)) return b ? part(when(b)) : '';
    if (!T.stamp(b) || T.clock(a) === T.clock(b) && T.dayKey(a) === T.dayKey(b)) return part(when(a));
    return `${part(when(a))}–<wbr>${part(T.dayKey(a) === T.dayKey(b) ? T.clock(b) : when(b))}`;
  };
  // 一行写两句：上面这一轮干的是哪件事（自动修理写那件活的名字，别的写结果），下面一句交代、谁做的、用了多久
  function runRow(r) {
    const t = tag(r), thing = r.subject ? F(r.subject.title, '这件活') : '';
    const summary = R.oneVersion(F(r.summary, '这一轮做了什么')), reason = F(r.statusReason || r.reason, '原因');
    // 没有那件活的名字时：结果的第一句当标题，其余放下面小字；第一句太长就截一段当标题，整句照放小字里，不丢字
    const plain = R.oneVersion(U.fieldText(r.summary, viewer).trim()), first = plain.split(/(?<=[。；！？])/)[0] || '';
    const short = !thing && first && first !== plain ? (first.length > 46 ? esc(first.slice(0, 44)) + '…' : esc(first)) : '';
    const title = r.excerptFallback ? '这次用了原来的回复。' : thing || (r.status === 'incomplete' && reason ? reason : short || summary) || (r.status === 'running' ? F(r.activity, '正在干什么') || '正在跑' : '跑完了');
    const subjectPrefix = thing.replace(/[。！？；]+$/u, '') || thing;
    const detail = r.excerptFallback ? '' : thing ? R.withoutSubject(summary, subjectPrefix) || R.withoutSubject(reason, subjectPrefix)
      : r.status === 'incomplete' && reason && reason !== title ? reason : short ? (first.length > 46 ? summary : esc(plain.slice(first.length).trim())) : '';
    const labelPrefix = `${t.text} · `, titlePrefix = `${title} · `;
    const originalNote = detail.startsWith(labelPrefix) ? detail.slice(labelPrefix.length) : detail;
    let note = originalNote.startsWith(titlePrefix) ? originalNote.slice(titlePrefix.length) : originalNote;
    // 只去掉末尾单独一段的重复结局，保留中间的任务说明。
    const ending = /(?:^|(?<=[。！？；])\s*|\s+·\s+)([^。！？；·]+[。！？；]?)$/u.exec(note);
    if (ending && resultWords(ending[1]) && resultWords(ending[1]) === resultWords(title)) {
      note = note.slice(0, ending.index);
    }
    const words = said(note);
    const repeated = words && [t.text, title].map(said).some(earlier => {
      const at = earlier.indexOf(words);
      return at === 0 || at > 0 && /[。！？；：:·]\s*$/u.test(earlier.slice(0, at));
    });
    const nth = r.subject && known(r.subject.round) && r.subject.round > 0 ? `第 ${int(r.subject.round)} 轮` : '';
    const ran = r.status === 'running' ? (T.stamp(r.startedAt) ? `<span class="au-nw">跑了 ${minutes((Date.now() - T.stamp(r.startedAt)) / 1000)}</span>` : '') : known(r.minutes) ? `<span class="au-nw">用了 ${minutes(r.minutes * 60)}</span>` : '';
    // 本人版：整轮对访客藏着的挂“访客看不到”、换了说法的挂“对外换了说法”（私事线 11-26）
    const why = (T.path(r.statusHref) ? ` ${link(r.statusHref, '去那张卡 ›')}` : '') + R.roundTag(r, viewer);
    // 下面那句几段（交代、第几轮、谁做的、用了多久）用“·”隔开，放不下时只在段与段之间折，短的几段整段走；
    // 点画在每段左边让开的那一截里（page.css 的 .ak-seg），折到行首那个点被裁掉，行尾不悬“·”；段与段之间零宽空格，能在这里折（和账本列表第二行同一个办法，主控 11-26）
    const who = r.who?.text ? esc(r.who.text) : '';
    const segs = [[repeated ? '' : note, false], [nth, true], [who, true], [ran, true]].filter(([s]) => s);
    // 说明末尾至少三个汉字一起折，避免句号前一两个字单独占一行。
    const noteHtml = R.asOwner(note, viewer).replace(/(?:\p{Script=Han}\p{P}*){3}(?=\s*$)/u, '<span class="au-nobr">$&</span>');
    const parts = segs.map(([s, keep], i) => `<span class="ak-seg${keep ? ' is-keep' : ''}${/[。！？；]$/u.test(segs[i - 1]?.[0]) ? ' is-after-stop' : ''}">${keep ? s : noteHtml}</span>`);
    // 说明删短后，执行方式和用时一起换行；整组比栏还宽时，内部仍可折开。
    if (note && !repeated && note !== originalNote && who && ran) {
      const footer = parts.splice(-2).join('&#8203;');
      parts.push(`<span style="display:inline-block;max-width:100%">${footer}</span>`);
    }
    const meta = parts.length ? `<span class="ak-line">${parts.join('&#8203;')}${why ? `<span class="ak-tail">${why}</span>` : ''}</span>` : '';
    return `<li class="ak-run" data-tone="${t.tone}"><span class="ak-run__node" aria-hidden="true"></span><time>${range(r)}</time>
      <span class="ak-run__tag"><i aria-hidden="true"></i>${t.text}</span>
      <div class="ak-run__body"><b>${r.href ? `<a href="${esc(r.href)}">${title}</a>` : title}</b>${meta ? `<small>${meta}</small>` : why ? `<small>${why}</small>` : ''}</div>
      ${r.href ? `<a class="ak-run__go" href="${esc(r.href)}">看这一轮 <span aria-hidden="true">›</span></a>` : ''}</li>`;
  }
  const allRuns = () => {
    const page = R.page(runs?.data, viewer), seen = new Set(), out = [];
    for (const r of [...(page?.rows || []), ...more.map(x => R.run(x, viewer))]) if (r.id && !seen.has(r.key)) { seen.add(r.key); out.push(r); }
    return { rows: out, total: page?.total, counts: runs?.data?.counts, more: cursor !== undefined ? cursor != null : !!runs?.data?.next };
  };

  // —— 页头大卡 ——
  // 现在怎样：停等＞出毛病＞正在跑＞关着＞暂停到＞空着等下次（和自动任务页“现在”那格同一个先后）
  // 派活程序超过两轮半没转：下次时间算不出来（和总表页头那句警告同一个判断）
  const stalled = d => {
    const x = d?.dispatch, tick = T.stamp(x?.last_tick_at || x?.heartbeat_at);
    return known(x?.interval_seconds) && x.interval_seconds > 0 && tick != null && Date.now() - tick > 2.5 * x.interval_seconds * 1000;
  };
  function nowText(d, c, rows) {
    const p = pauseOf(d), pr = c.problem, st = c.state || {}, m = mode(c), live = rows.find(r => r.status === 'running');
    if (p) return ['warn', `停着：${pauseText(p)}`];
    if (pr && (pr.headline || pr.title || pr.text)) {
      const handler = pr.repairing === true ? 'AI 在修' : F(pr.handler_text, '谁在处理');
      const problem = F(pr.headline || pr.title || pr.text, '哪里坏了');
      return ['warn', `出毛病 —— ${problem}${handler ? `<wbr><span class="au-nobr">（${handler}）</span>` : ''}`];
    }
    if (c.running || st.kind === 'running' || live) return ['run', `正在跑${live && T.stamp(live.startedAt) ? `，${esc(T.clock(live.startedAt))} 起` : ''}${live?.activity ? ` —— ${F(live.activity, '正在干什么')}` : ''}`];
    const waiting = F(st.waiting_for ?? c.waiting_for, '在等什么');
    if (m === 'off') return ['off', waiting ? `关着 · ${waiting}` : '关着'];
    if (m === 'paused') return ['off', esc(pausedText(c.setting?.until_at) || '暂停中')];
    if (id === 'excerpt') return ['idle', excerptToday?.data && known(excerptToday.data.total) ? `空着 · 今天摘了 ${int(excerptToday.data.total)} 句` : '空着'];
    const next = st.next_at || c.next_at;
    return ['idle', T.stamp(next) != null ? `空着 · 下次 ${esc(when(next))}` : stalled(d) ? '空着 · 派活程序没按时跑，下次几点暂时算不出' : waiting ? `空着 · ${waiting}` : '空着'];
  }
  function hero(d, c, rows) {
    const last = rows.find(r => r.status !== 'running'), lt = last && tag(last);
    const lastAt = last ? last.finishedAt || last.lastAt : c.last_result?.at;
    const lastText = lastAt ? `上次 ${esc(when(lastAt))}${lt ? ` <span class="ak-dot" data-tone="${lt.tone}"></span><b data-tone="${lt.tone}">${lt.text}</b>` : ''}`
      : '<span class="tp-muted">运行记录这次没读到</span>';
    const [tone, now] = nowText(d, c, rows);
    const model = [c.model, c.model_effort].filter(Boolean).map(esc).join(' · ');
    const family = model && R.agentsPath(R.familyOf({ host: c.host, model: c.model }), true);
    const description = [esc(c.how_to?.short || ''), F(c.schedule_text, '排期说明')].filter(Boolean).join('。');
    const result = F(c.last_result?.text, '上次结果');
    return `<section class="glass ak-hero"><div class="ak-hero__copy">
        <div class="ak-hero__title"><h1>${F(cn(c.title), '类别')}</h1>${model ? (family ? `<a class="ak-pill" href="${esc(T.path(family))}">${model}</a>` : `<span class="ak-pill">${model}</span>`) : ''}</div>
        <p class="ak-hero__state">${lastText}<span class="ak-sep">·</span>现在：<span class="ak-dot" data-tone="${tone}"></span><b data-tone="${tone}">${now}</b></p>
        ${c.last_result?.text ? `<p class="ak-hero__last">上次结果：${id === 'translator' ? R.oneVersion(result, true) : result}</p>` : ''}
        <p class="ak-hero__what">${description}</p>
        <div class="ak-hero__ctl au-switchcell">${switchCell(c)}<a class="ak-how" href="${esc(T.path('/live/automation/how/', { type: id }))}">怎么干 <span aria-hidden="true">›</span></a></div>
      </div>${heroArt}</section>`;
  }

  // —— 四个数：近 7 天几轮、做成、没做成、等下次检查（后台 week，三格加起来就是近 7 天） ——
  function stats(c) {
    const w = c.week, s = c.recent_stats || {};
    if (!w || !known(w.runs)) return `<section class="ak-stats"><p class="tp-empty">这一类近 7 天跑了几轮，这次没读到。</p></section>`;
    const from = T.stamp(w.from), late = from && from > Date.now() - 6.5 * 86400000;
    const repair = id === 'auto-repair';
    const cell = (label, value, unit, tail, tone) => `<div class="ak-stat" data-tone="${tone}"><p>${label}</p><p class="tp-big">${T.big(value, `ak-${label}`)}${unit ? `<small>${unit}</small>` : ''}</p>${tail ? `<p class="ak-stat__tail">${tail}</p>` : ''}</div>`;
    const basis = s.basis ? U.fieldText(s.basis.text, viewer) : '';
    return `<section class="ak-stats">${cell(late ? `${esc(T.day(w.from))} 起` : '近 7 天', w.runs, '轮', known(w.average_seconds) ? `平均每轮 ${minutes(w.average_seconds)}` : '每轮多久没记下', 'plain')}
      ${cell('做成', w.completed, '', repair ? '修好或核实已恢复' : '跑完、交出了结果', 'ok')}
      ${cell('没做成', w.incomplete, '', '报错、超时或没交回结论', 'bad')}
      ${cell('等下次检查', w.waiting, '', '', 'plain')}</section>
      <p class="tp-small ak-basis">三格加起来就是${late ? '这几天' : '近 7 天'}的轮数。等下次检查只算实际跑过、还要等下次检查的轮次；登录过期、额度用完或暂停期间，没叫 AI 的检查不算一轮。转给${you()}的那一轮，交接办完算做成。${known(w.checks) && w.checks > 0 ? `另外程序自己看了 ${int(w.checks)} 次，没叫 AI，不算一轮。` : ''}${known(s.success) ? `近 30 天成 ${int(s.success)} · 坏 ${int(s.failed)}${basis ? `：${esc(basis)}` : ''}` : ''}</p>`;
  }

  // —— 最近几轮 ——
  function recent(rows, info) {
    // 右上角的总数：列表里除了叫 AI 跑的轮次，还有程序自己空查的、程序直接办没叫 AI 的；后台给了 counts 就分开写，免得和上面四个数里的“几轮”对不上
    const n = info.counts || {}, ai = known(n.runs) ? n.runs : null, checks = known(n.checks) ? n.checks : 0;
    const other = known(info.total) && ai != null ? info.total - ai - checks : 0;
    const total = !known(info.total) ? '' : ai == null || ai === info.total ? `一共 ${int(info.total)} ${ai == null ? '条' : '轮'}`
      : `一共 ${int(info.total)} 条：AI 跑的 ${int(ai)} 轮${checks ? `，程序空查 ${int(checks)} 次` : ''}${other > 0 ? `，程序直接办、没叫 AI 的 ${int(other)} 次` : ''}`;
    const head = `<div class="ak-panel__head"><span class="ak-ico" aria-hidden="true">≡</span><h2>最近几轮</h2>${total ? `<small>${total}</small>` : ''}</div>`;
    if (!runs?.data && !['none', 'gone', 'paused'].includes(runs?.phase) && !(runs?.meta?.status >= 400)) return `<section class="tp-panel ak-panel ak-recent">${head}<p class="au-empty">正在读…</p></section>`;
    if (!rows.length) {
      const next = catNext();
      const nextText = next ? `${mode(state?.data && catOf(state.data)) === 'off' ? '打开后' : ''}下一次 ${esc(when(next))}` : '';
      const empty = `运行记录这次没读到${nextText ? `，${nextText}` : ''}。`;
      return `<section class="tp-panel ak-panel ak-recent">${head}<p class="au-empty">${runs?.data ? empty : '每一轮的记录这次没读到。'}</p></section>`;
    }
    const limit = !info.more && !U.shouldFold(rows.length - shown) ? rows.length : shown;
    const left = rows.length - limit, rest = left > 0 ? left : info.more ? null : 0;
    const btn = rest === 0 ? '' : `<button type="button" class="ak-more" data-more${paging ? ' aria-busy="true"' : ''}>${paging ? '正在读…' : `再看 ${int(info.more ? STEP : Math.min(STEP, rest))} 轮`} <span aria-hidden="true">›</span></button>`;
    return `<section class="tp-panel ak-panel ak-recent">${head}<ol class="ak-runs">${rows.slice(0, limit).map(runRow).join('')}</ol>${btn}
      ${pageFailed ? '<p class="tp-small" role="status">这一批没读到，可以再点一次。</p>' : ''}</section>`;
  }
  const catNext = () => { const c = catOf(state?.data); return c?.state?.next_at || c?.next_at || list(c?.upcoming)[0]?.at; };

  // —— 接下来几次 ——
  function upcoming(d, c) {
    const rows = list(c.upcoming).filter(u => T.stamp(u.at) > Date.now());
    const next = c.state?.next_at || c.next_at;
    const schedule = F(c.schedule_text, '排期说明');
    const queue = id === 'auto-repair' && known(d.counts?.queue) ? `<p class="ak-queue">现在排着等修的：<b>${int(d.counts.queue)} 件</b></p>` : '';
    const body = mode(c) === 'off' ? '<p class="ak-up__none">关着，不用排时间。</p>'
      : mode(c) === 'paused' ? `<p class="ak-up__none">${esc(pausedText(c.setting?.until_at) || '暂停中')}</p>`
      : rows.length ? `${schedule ? `<p class="ak-up__how">${schedule}</p>` : ''}<ul class="ak-up">${rows.map((u, i) => `<li${i === 0 ? ' class="is-next"' : ''}><time>${esc(when(u.at))}</time><span>${F(u.text, '要做什么')}</span></li>`).join('')}</ul>`
      : `<p class="ak-up__none">${T.stamp(next) > Date.now() ? `下次 <time>${esc(when(next))}</time>。`
        : stalled(d) ? '派活程序这会儿没按时跑，下次几点暂时算不出；它恢复后会重新排。'
        : F(c.state?.waiting_for ?? c.waiting_for, '在等什么') || schedule || '几点跑、什么情况下跑，这次没读到。'}</p>`;
    return `<section class="tp-panel ak-panel"><div class="ak-panel__head"><span class="ak-ico" aria-hidden="true">◷</span><h2>接下来几次</h2></div>${body}${queue}</section>`;
  }

  // —— 这一类：做什么、谁来做、什么时候跑、各小类开关、各工程的《他要什么》、开关改动 ——
  function about(d, c) {
    // 关着的类：页头已经说了关着，“什么时候跑”写打开后几点跑，不再抄一遍页头那句
    const g = c.how_to || {};
    const model = [c.model, c.model_effort].filter(Boolean).map(esc).join(' · ');
    const rows = [['做什么', esc(g.purpose || g.short || '')], ['谁来做', model ? model + '（跟着模型清单走）' : '这一类用哪个型号没读到'],
      ['什么时候跑', (mode(c) === 'off' && g.offWhen ? esc(g.offWhen) : F(c.schedule_text, '排期说明')) || '这次没读到，下一轮会自动再读。']];
    if (id === 'weekly-laptop' && g.off) rows.push(['关了会怎样', esc(g.off)]);
    const subs = list(c.subcategories);
    if (subs.length) rows.push(['各小类', `<div class="ak-subs">${subs.map(sub => {
      const m = mode(sub), off = state?.offline || !m;
      return `<span class="ak-sub" data-mode="${esc(m || '')}"><b>${F(sub.title, '小类')} · ${m === 'on' ? '开' : m === 'off' ? '关' : m === 'paused' ? '暂停' : '没读到'}</b>${off ? '' : `<button type="button" class="au-mini" data-toggle="${esc(sub.id)}" data-mode="${esc(m)}"${waitingOn(sub.id)}${ownerOnly('开关自动修理小类')}>${m === 'on' ? '关掉' : '打开'}</button>`}${noteFor(sub.id)}</span>`;
    }).join('')}</div>`]);
    if (id === 'translator' && list(c.projects).length) rows.push(['各工程', `<ul class="ak-list">${list(c.projects).map(p => `<li>${F(p.name, '工程')}：${[
      known(p.version) ? `第 ${int(p.version)} 版` : '版本没读到', when(p.published_at) ? esc(when(p.published_at)) : '发布时间没读到',
      known(p.uncertain_count) ? p.uncertain_count ? `${int(p.uncertain_count)} 条拿不准` : '没有拿不准的' : '拿不准的条数没读到',
    ].join(' · ')}</li>`).join('')}</ul>`]);
    if (list(c.weekly_runs).length) rows.push(['每周一行', `<ul class="ak-list">${list(c.weekly_runs).map(w => {
      const sep = /[。！？；]$/u.test(U.fieldText(w.summary, viewer).trim()) ? ' ' : ' · ';
      return `<li>${esc(T.day(w.scheduled_at))} · ${F(w.summary, '这周结论')}${known(w.elapsed_seconds) ? sep + esc(minutes(w.elapsed_seconds)) : ''}</li>`;
    }).join('')}</ul>`]);
    if (list(c.setting_log).length) rows.push(['开关改动', `<ul class="ak-list">${list(c.setting_log).map(r => `<li>${esc(when(r.at))} · ${F(r.text, '改了什么')}</li>`).join('')}</ul>`]);
    return `<section class="tp-panel ak-panel"><div class="ak-panel__head"><span class="ak-ico" aria-hidden="true">◈</span><h2>这一类</h2></div>
      <dl class="ak-about">${rows.map(([k, v]) => `<div${k === '各小类' ? ' class="is-wide"' : ''}><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></section>`;
  }

  // —— 开关和暂停：照自动任务页那份就地写一份一样的 ——
  const ownerOnly = action => viewer === 'owner' ? '' : ` data-need-trusted="${esc(action)}"`;
  const isoOf = v => typeof v === 'number' ? new Date(v * 1000).toISOString() : v;
  const rowOf = x => list(state?.data?.categories).flatMap(c => [c, ...list(c.subcategories)]).find(row => row.id === x);
  const noteFor = x => {
    if (feedback?.id !== x) return '';
    let { text, tone = '' } = feedback;
    if (feedback.want && feedback.reread) {
      const s = rowOf(x)?.setting || {}, m = s.mode, want = feedback.want, until = isoOf(s.until_at);
      const same = m === want.mode && (!want.until || T.stamp(until) === T.stamp(want.until));
      [text, tone] = same ? ['已保存', 'ok'] : [`最新读数还是${m === 'paused' ? `暂停到 ${when(until)}` : { on: '开着', off: '关着' }[m] || '没读到'}`, ''];
    }
    return `<small role="status" data-tone="${tone}">${esc(text)}</small>`;
  };
  const waitingOn = x => feedback?.id === x && feedback.pending ? ' aria-busy="true"' : '';
  function switchCell(c) {
    const m = mode(c), until = c.setting?.until_at, paused = esc(pausedText(until) || '暂停中');
    const text = m === 'on' ? '开着' : m === 'off' ? '关着' : m === 'paused' ? paused : '没读到';
    if (state?.offline || !m) return `<span class="au-state" data-mode="${esc(m || '')}">${text}</span>`;
    return `<button type="button" class="au-switch" role="switch" aria-checked="${m === 'on'}" data-toggle="${esc(c.id)}" data-mode="${esc(m)}"${waitingOn(c.id)}${ownerOnly('开关自动任务')} aria-label="${esc(U.fieldText(cn(c.title), viewer))} · ${text}"><i></i><span>${m === 'on' ? '开' : '关'}</span></button>
      <button type="button" class="au-pausebtn" data-pause="${esc(c.id)}"${ownerOnly('暂停自动任务')}>${m === 'paused' ? paused : '暂停到…'}</button>${noteFor(c.id) || '<small role="status"></small>'}`;
  }
  async function save(x, value) {
    if (busy) return null;
    busy = true;
    try { return await Live.automationSetting({ operation: 'type-mode', id: x, value }); } finally { busy = false; }
  }
  function failText(reply) {
    if (reply?.error === 'cockpit_owner_required') return '没存上：这台设备还没配对成本人设备';
    if (!reply || reply.status === 'unknown') return '还没确认存上';
    if (typeof reply?.message === 'string' && /[一-鿿]/.test(reply.message)) return `没存上：${reply.message}`;
    return '没存上：电脑没写进去，再点一次';
  }
  const asSetting = cur => ({ ...cur, ...(typeof cur.until_at === 'number' ? { until_at: isoOf(cur.until_at) } : {}) });
  // 回包到了才动开关：存上了照回包里的 current 滑过去，滑完再整块重画；没存上的留在原档写原因
  async function saved(x, reply, want) {
    feedback = reply.status === 'saved' ? { id: x, text: '已保存', tone: 'ok' } : reply.status === 'retired' ? { id: x, text: reply.message || '已撤' }
      : { id: x, text: failText(reply), tone: reply.status === 'unknown' ? '' : 'bad', want: reply.status === 'unknown' ? want : undefined };
    const row = rowOf(x);
    if (row && reply.current && typeof reply.current === 'object') row.setting = { ...row.setting, ...asSetting(reply.current) };
    const el = page.root.querySelector(`.au-switch[data-toggle="${CSS.escape(x)}"]`), m = row && mode(row);
    if (el && m && el.dataset.mode !== m) {
      el.dataset.mode = m; el.setAttribute('aria-checked', String(m === 'on')); el.removeAttribute('aria-busy');
      el.querySelector('span').textContent = m === 'on' ? '开' : '关';
      const note = el.parentElement.querySelector('small[role="status"]');
      if (note) { note.textContent = feedback.text; note.dataset.tone = feedback.tone || ''; }
      await new Promise(r => setTimeout(r, 320));
    }
    draw();
    const fb = feedback;
    Live.get('automation', {}).then(read => {
      if (feedback === fb && fb.want && read.data && read.meta.status >= 200 && read.meta.status < 400) { fb.reread = true; draw(); }
    });
  }
  const dialog = document.getElementById('au-pause'), form = dialog.querySelector('form');
  dialog.querySelector('[data-cancel]').addEventListener('click', () => dialog.close());
  const WEEK = ['日', '一', '二', '三', '四', '五', '六'], pad = n => String(n).padStart(2, '0');
  function fillWhen(untilAt) {
    const until = T.stamp(untilIso(untilAt)), now = new Date(Date.now() + 8 * 3600000), from = until > Date.now() ? new Date(until + 8 * 3600000) : new Date(now.getTime() + 3600000);
    if (!(until > Date.now())) from.setUTCMinutes(0, 0, 0);
    const days = Array.from({ length: 14 }, (_, i) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + i)));
    const key = x => `${x.getUTCFullYear()}-${pad(x.getUTCMonth() + 1)}-${pad(x.getUTCDate())}`;
    if (key(from) > key(days.at(-1))) days.push(from);
    form.elements.day.innerHTML = days.map((x, i) => `<option value="${key(x)}">${x.getUTCMonth() + 1}月${x.getUTCDate()}日 周${WEEK[x.getUTCDay()]}${['（今天）', '（明天）', '（后天）'][i] || ''}</option>`).join('');
    form.elements.hour.innerHTML = Array.from({ length: 24 }, (_, h) => `<option value="${pad(h)}">${pad(h)} 点</option>`).join('');
    const minute = from.getUTCMinutes();
    const choices = [...new Set([...Array.from({ length: 12 }, (_, m) => m * 5), minute])].sort((a, b) => a - b);
    form.elements.minute.innerHTML = choices.map(m => `<option value="${pad(m)}">${pad(m)} 分</option>`).join('');
    form.elements.day.value = key(from); form.elements.hour.value = pad(from.getUTCHours()); form.elements.minute.value = pad(minute);
    form.dataset.originalUntil = until > Date.now() ? untilIso(untilAt) : '';
  }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!pausing || busy) return;
    const x = pausing, result = form.querySelector('[data-result]');
    const selected = `${form.elements.day.value}T${form.elements.hour.value}:${form.elements.minute.value}:00+08:00`;
    const original = form.dataset.originalUntil;
    const until = Math.floor(Date.parse(original) / 60000) === Date.parse(selected) / 60000 ? original : selected;
    if (!(Date.parse(until) > Date.now())) { result.textContent = '要选比现在晚的时间'; return; }
    result.textContent = '正在保存…';
    feedback = { id: x, text: '正在保存…', pending: true };
    draw();
    const reply = await save(x, { mode: 'paused', until_at: until });
    if (!reply) return;
    if (reply.status === 'saved' || reply.error === 'cockpit_owner_required') dialog.close();
    else result.textContent = failText(reply);
    saved(x, reply, { mode: 'paused', until });
  });

  // —— 画 ——
  let queued = 0;
  const schedule = () => { if (!queued) queued = requestAnimationFrame(() => { queued = 0; draw(); }); };
  function draw() {
    const d = state?.data;
    viewer = T.viewerOf(state);
    const c = catOf(d);
    if (!c) {
      const phase = state?.phase;
      const note = phase === 'slow' ? (state.warming ? '后台还在准备这一类的任务，准备好了这里会自己换上。' : '这一类自动任务要多读一会儿，读到后会自动显示。')
        : phase === 'idle' || phase === 'wait' ? '正在读这一类自动任务…' : d ? '这一类自动任务没读到。' : '';
      T.paint(page.root, note ? `<p class="tp-placeholder" role="status">${note}</p>` : T.placeholder(state, '这一类自动任务'));
      page.tick.set([], { off: true });
      return;
    }
    document.title = `${U.fieldText(cn(c.title), viewer)} · 自动任务 · 实况`;
    const info = allRuns();
    paint(page.root, `<nav class="ak-crumb" aria-label="当前位置"><a href="/live/">实况</a><a href="/live/automation/">自动任务</a><strong aria-current="page">${F(cn(c.title), '类别')}</strong></nav>
      ${T.stateNote(state)}${hero(d, c, info.rows)}${stats(c)}
      <div class="ak-grid">${recent(info.rows, info)}<div class="ak-side">${upcoming(d, c)}${about(d, c)}</div></div>`);
    page.tick.set(R.ticker(d, info.rows, viewer), { off: state.offline });
  }

  // 再往后翻一页：第一页没摆完先摆，摆完了才去读下一页
  const runPageKey = st => `${T.viewerOf(st)}|${st?.data?.items?.[0]?.run_id || ''}`;
  async function loadMore() {
    const info = allRuns();
    if (shown + STEP <= info.rows.length || !info.more) { shown += STEP; draw(); return; }
    const next = cursor !== undefined ? cursor : runs?.data?.next;
    if (next == null || paging) return;
    const first = runPageKey(runs);
    paging = true; pageFailed = false; draw();
    const s = await Live.get('automation/runs', { category: id, cursor: next }).catch(() => null);
    paging = false;
    if (first !== runPageKey(runs)) { draw(); return; }
    if (Array.isArray(s?.data?.items) && s.data.next !== next) {
      more.push(...s.data.items); cursor = s.data.next ?? null; shown += STEP;
    } else pageFailed = true;
    draw();
  }

  const page = T.boot({ resource: 'automation', back: '/live/automation/',
    ask: () => `请看实况自动任务里“${catOf(state?.data)?.how_to?.title || id}”这一类：最近几轮做成了什么、现在怎样、要不要我出面。先用大白话说，别动手。`,
    onState(next) { state = next; schedule(); } });
  Live.watch('automation/runs', { category: id }, { phase(st) {
    if (runPageKey(st) !== runPageKey(runs)) { more = []; cursor = undefined; pageFailed = false; }
    runs = st; schedule();
  } });
  if (id === 'excerpt') Live.watch('automation/runs', { category: 'excerpt', date: today() }, { phase(st) { excerptToday = st; schedule(); } });
  page.root.addEventListener('click', async e => {
    const toggle = e.target.closest('[data-toggle]'), pause = e.target.closest('[data-pause]');
    if (e.target.closest('[data-more]')) { T.keep(page.root, '[data-more]', () => {}); loadMore(); return; }
    if (toggle) {
      const x = toggle.dataset.toggle, next = toggle.dataset.mode === 'on' ? 'off' : 'on';
      if (busy) return;
      feedback = { id: x, text: '正在保存…', pending: true };
      T.keep(page.root, `[data-toggle="${CSS.escape(x)}"]`, draw);
      saved(x, await save(x, { mode: next }) || { status: 'unknown' }, { mode: next });
      return;
    }
    if (pause) {
      const access = await Live.automationSetting({ operation: 'access' });
      if (access.status === 'unknown') { feedback = { id: pause.dataset.pause, text: '电脑没回话，再点一次' }; draw(); return; }
      if (access.status !== 'pass') { saved(pause.dataset.pause, access); return; }
      pausing = pause.dataset.pause;
      fillWhen(rowOf(pausing)?.setting?.until_at);
      form.querySelector('[data-result]').textContent = '';
      dialog.showModal();
    }
  });
})();
