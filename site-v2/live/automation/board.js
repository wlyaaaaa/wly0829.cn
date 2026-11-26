// 实况 · 自动任务：后台 AI 替本人干的各类活（现在七类，页上的类数照后台给的列表数）。照本人 01:04 批的“自动任务页第一屏-v1”（本人 11-24 13:00：图 8 融进图 9）：
// 页头、停等条、四个按钮（全部、进行中、出毛病的、近 72 小时跑完的，带件数）；“全部”是七类表（任务和怎么干、现在、上次结果、近 30 天、用谁、开关），
// 表下各家自带的定时、这周替你做成了、近 7 天用时；“进行中”“近 72 小时跑完的”是一轮一张卡（自动修理一件一张卡），“出毛病的”按天排一长列。
// 一类点进去是这一类的页 /live/automation/category/?type=<类>，“怎么干 ›”是 /live/automation/how/?type=<类>（主控 01:29 定单做一页）。
// 读 /computer-access/live/v1/automation 和每一轮的列表 automation/runs（取数和转换在 runs.js）。
// 网址：?view=running|problems|done 按下哪个按钮；?family=claude|codex|antigravity 只看一家（旧链接的 ?host= 也认）；?date=today|YYYY-MM-DD 只看那天；?status=running|completed|incomplete 只看一种结局。
// 旧链接：?category=<类>、?type=<类> 转到这一类的页，?type=<类>#prompt-… #cat-… 转到怎么干页；一轮的详情在 /live/automation/run/?type=<类>&run=<轮号>（后台给的 ?type=…&run=… 转过去）。
// 单件活（?work=）、修理的小类（?type=backup 这类）、按项目看（?project=）仍走原来的页 /live/automation/work/。
(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const IDS = ['auto-repair', 'message-review', 'translator', 'weekly-rules', 'weekly-live', 'excerpt', 'ai-commitments'];
  // 已取消的类：总表和分类按钮里不再有它，但以前跑过的那几轮照旧列在近 72 小时、按天看里（本人要自动任务保留每轮，R44）
  const PAST = ['weekly-laptop'];
  const RUN_IDS = [...IDS.filter(x => x !== 'excerpt'), ...PAST];
  const typeParam = params.get('type');
  if (params.has('run')) {
    location.replace('/live/automation/run/' + location.search + location.hash);
    return;
  }
  if (params.has('work') || params.has('project') || (typeParam && !IDS.includes(typeParam))) {
    location.replace('/live/automation/work/' + location.search + location.hash);
    return;
  }
  // 一类：以前在这页原地展开（?type=）或只看这一类（?category=），现在各有一页；链到“怎么干”“提示词”的锚点转到怎么干页
  const catParam = IDS.includes(typeParam) ? typeParam : IDS.includes(params.get('category')) ? params.get('category') : null;
  if (catParam) {
    const how = typeParam === catParam && /^#(prompt|cat|why|fail)-/.test(location.hash);
    location.replace(how ? `/live/automation/how/?type=${catParam}${location.hash.startsWith('#prompt-') ? '#prompt' : ''}` : `/live/automation/category/?type=${catParam}`);
    return;
  }
  const T = window.LiveTape, U = window.LiveUI, Live = window.Live, G = window.LiveAutomationGuide || {}, R = window.AutomationRuns, { esc } = U;
  const { list, known, int, dec, link, when, big, clock } = T;
  let state, viewer = 'public', busy = false, feedback = null, landed = false, pausing = null, olderOpen = false;
  // 长列表全站一个规则（本人 11-26 02:12）：先摆一部分，点一次再多摆一批，一直能摆到底
  const STEP = 20;
  let doneShown = STEP;
  const catPath = id => T.path('/live/automation/category/', { type: id }), howPath = id => T.path('/live/automation/how/', { type: id });
  const F = (v, name) => T.field(v, viewer, name);
  // 类名是后台给的，“替你看新消息”在公开版改成“替本人”
  const cn = v => viewer === 'owner' || typeof v !== 'string' ? v : v.replace(/^替你/, '替本人');
  const you = () => T.you(viewer);
  const mode = c => c?.setting?.mode;
  // 总表里的类：后台列表里有、页面也认的那几类（笔记本每周巡检已取消，后台删掉之前列表里还有它也不显示）
  const shownCats = d => IDS.map(id => list(d?.categories).find(c => c.id === id)).filter(Boolean);
  // 写在字里的类数照总表实际几行：七类；一行也没有时不写数
  const kinds = d => { const n = shownCats(d).length; return n ? `${n <= 10 ? '一二三四五六七八九十'[n - 1] : n}类` : '各类'; };
  const pauseOf = (d, id) => list(d.provider_pauses).find(p => list(p.categories).includes(id));
  const minutes = s => known(s) ? (s < 3600 ? `${Math.max(1, Math.round(s / 60))} 分钟` : `${Math.floor(s / 3600)} 小时 ${Math.round(s % 3600 / 60)} 分`) : '';

  // —— 筛选：网址里带的，和点分类按钮改的 ——
  const DAY = /^\d{4}-\d{2}-\d{2}$/;
  // 按下哪个按钮：没写是“全部”（七类表）；旧链接只看在跑的（?status=running）算“进行中”，只看某天、某种结局的算“近 72 小时跑完的”
  const VIEWS = ['running', 'problems', 'done'];
  const filter = {
    view: VIEWS.includes(params.get('view')) ? params.get('view') : params.get('status') === 'running' ? 'running'
      : params.get('status') || params.get('date') ? 'done' : null,
    // 只看一家一律写 ?family=；后台旧链接带 ?host= 的也认
    family: [params.get('family'), params.get('host')].map(v => String(v || '').toLowerCase()).find(v => Object.hasOwn(R.FAMILIES, v)) || null,
    date: params.get('date') === 'today' || DAY.test(params.get('date') || '') ? params.get('date') : null,
    status: ['completed', 'incomplete'].includes(params.get('status')) ? params.get('status') : null,
  };
  // 今天的北京日期（YYYY-MM-DD）
  const today = () => T.dayKey(new Date().toISOString());
  const dayOf = date => date === 'today' ? today() : date;
  // 暂停到几点：后台的 until_at 是 Unix 秒数（ISO 字符串也认），先换成 ISO 再交给 T.clock 这些（M801）
  const untilIso = v => { const t = typeof v === 'number' ? v * 1000 : T.stamp(v); return Number.isFinite(t) ? new Date(t).toISOString() : ''; };
  // 北京时间、看得懂的中文日期：今天的写“暂停到今天 22:00”，别的日子写“暂停到 11 月 25 日 周三 08:00”；读不出时刻给空。
  // 按钮上（brk）在日期后折一行，免得开关这一列撑宽、把“上次结果”挤成一条
  const pausedText = (v, brk = ' ') => {
    const at = untilIso(v);
    if (!at) return '';
    const d = new Date(T.stamp(at) + 8 * 3600000);
    return T.dayKey(at) === today() ? `暂停到今天 ${T.clock(at)}` : `暂停到 ${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日${brk}周${'日一二三四五六'[d.getUTCDay()]} ${T.clock(at)}`;
  };
  function setFilter(next) {
    const before = filter.date;
    Object.assign(filter, next);
    doneShown = STEP;
    const url = new URL(location.href);
    url.searchParams.delete('host');
    // 只看某天、某种结局是“近 72 小时跑完的”下面的筛选，换到别的按钮就不带了
    if (filter.view !== 'done') Object.assign(filter, { date: null, status: null });
    for (const key of ['view', 'family', 'date', 'status']) if (filter[key]) url.searchParams.set(key, filter[key]); else url.searchParams.delete(key);
    url.searchParams.delete('category');
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    if (filter.date !== before) watchRuns();
    draw();
  }

  // —— 每一轮：后台第四段给了“进行中”“近 72 小时跑完的”两张列表（scope=board，按钮上的件数就是各自回包的 total，程序空查和摘一句不在里面）。
  // 老后台不认这个读口（回 4xx）、或者只看某一天时，照原来七类各读一份；都读不到时退回 automation 里已有的在跑和最近几次。摘一句只读今天的条数 ——
  const pages = new Map(), BOARD = ['running', 'finished'];
  let excerptToday, ledger, subs = [], board = null, boardOff = false;
  function watchRuns() {
    for (const s of subs) s.stop();
    subs = []; pages.clear(); backPages.clear(); excerptToday = undefined; board = null;
    const date = filter.date ? dayOf(filter.date) : null;
    if (!date && !boardOff) {
      board = {};
      const mine = board;
      for (const status of BOARD) subs.push(Live.watch('automation/runs', { scope: 'board', status }, { phase(st) {
        if (board !== mine) return;
        if (!st.data && st.meta?.status >= 400 && st.meta.status < 500) { boardOff = true; queueMicrotask(() => { watchRuns(); schedule(); }); return; }
        board[status] = st; readBack(status, st, { scope: 'board', status }); schedule();
      } }));
    } else for (const id of RUN_IDS) {
      subs.push(Live.watch('automation/runs', { category: id, date }, { phase(st) { pages.set(id, st); readBack(id, st, { category: id }); schedule(); } }));
    }
    subs.push(Live.watch('automation/runs', { category: 'excerpt', date: today() }, { phase(st) { excerptToday = st; schedule(); } }));
  }
  let queued = 0;
  const schedule = () => { if (!queued) queued = requestAnimationFrame(() => { queued = 0; draw(); }); };

  // 近 72 小时：一类跑得多、第一页 50 轮没铺到 72 小时的边时，用读口现成的翻页（cursor）接着往后读，读到 72 小时以前那一轮为止（主控 11-25）。
  // 两张总列表（scope=board）后台已经截在 72 小时，一直读到最后一页。
  // 第一页一换（来了新的一轮、换了本人版／公开版）就从头再翻一遍；某一批没读到就先照已读到的画，等第一页下次刷新再接着读
  const backPages = new Map();
  const lastAtOf = x => T.stamp(x?.last_activity_at || x?.finished_at || x?.started_at || x?.queued_at);
  function readBack(id, st, query) {
    const d = st?.data;
    if (filter.date || !Array.isArray(d?.items)) { backPages.delete(id); return; }
    const edge = query.scope ? -Infinity : Date.now() - 72 * 3600000, past = items => items.length > 0 && (lastAtOf(items.at(-1)) ?? Infinity) < edge;
    const sign = `${st.viewer?.kind || ''}|${d.items[0]?.run_id}|${d.items.length}|${d.next ?? ''}`;
    // 第一页没变：读完了或正在读就不动；上次读到一半断了（某一批没读到），从断的那一批接着读，已读到的留着
    const old = backPages.get(id);
    if (old?.sign === sign && (old.done || old.busy)) return;
    const job = old?.sign === sign ? old : { sign, rows: [], next: d.next, done: d.next == null || past(d.items) };
    backPages.set(id, job);
    if (job.done) return;
    job.busy = true;
    (async () => {
      const seen = new Set();
      try {
        while (job.next != null && !seen.has(String(job.next))) {
          seen.add(String(job.next));
          const s = await Live.get('automation/runs', { ...query, cursor: job.next }).catch(() => null);
          if (backPages.get(id) !== job || !Array.isArray(s?.data?.items)) break;
          job.rows.push(...s.data.items);
          job.next = s.data.next;
          if (job.next == null || past(s.data.items)) { job.done = true; break; }
        }
      } finally { job.busy = false; }
      if (backPages.get(id) === job) schedule();
    })();
  }

  // 七类的读数拼成一份：rows 是有的行；legacy=true 表示读口没装上、用的是老读数拼的。
  // 两张总列表时每行记下它在哪张（from），各自的 total 放 totals；有一张还没回就是 waiting
  function collect(d) {
    if (board) {
      const got = BOARD.map(status => ({ status, st: board[status], p: R.page(board[status]?.data, viewer) }));
      const answered = got.filter(({ st }) => st && (st.data || st.meta?.status >= 400 || st.phase === 'none' || st.phase === 'gone'));
      if (got.some(x => x.p)) {
        const rows = [], keys = new Set(), totals = {};
        for (const { status, p } of got) {
          if (!p) continue;
          totals[status] = p.total;
          for (const r of [...p.rows, ...list(backPages.get(status)?.rows).map(x => R.run(x, viewer))]) {
            if (r.category && r.id && !keys.has(r.key)) { keys.add(r.key); rows.push({ ...r, from: status }); }
          }
        }
        return { rows, legacy: false, board: true, totals, waiting: answered.length < BOARD.length, capped: false };
      }
      if (answered.length < BOARD.length) return { rows: [], legacy: false, board: true, totals: {}, waiting: true };
      return { rows: R.fallback(d, viewer), legacy: true, waiting: false };
    }
    const ids = RUN_IDS, states = ids.map(id => pages.get(id));
    const answered = states.filter(s => s && (s.data || s.meta?.status >= 400 || s.phase === 'none' || s.phase === 'gone'));
    const got = ids.map((id, i) => ({ id, p: R.page(states[i]?.data, viewer) })).filter(x => x.p);
    if (got.length) {
      // 第一页的行，接上往后翻到的行（同一轮只留一份）
      const rows = [], keys = new Set();
      for (const { id, p } of got) for (const r of [...p.rows, ...(filter.date ? [] : list(backPages.get(id)?.rows).map(x => R.run(x, viewer)))]) {
        if (r.category && r.id && !keys.has(r.key)) { keys.add(r.key); rows.push(r); }
      }
      return { rows, legacy: false, waiting: answered.length < states.length, capped: got.some(({ id, p }) => p.more && (filter.date || !backPages.get(id)?.done)) };
    }
    if (answered.length < states.length) return { rows: [], legacy: false, waiting: true };
    return { rows: R.fallback(d, viewer), legacy: true, waiting: false };
  }
  const inWindow = r => {
    if (filter.date) { const key = dayOf(filter.date); return [r.queuedAt, r.startedAt, r.lastAt].some(at => T.dayKey(at) === key); }
    return r.status === 'running' || Date.now() - (T.stamp(r.lastAt) || 0) < 72 * 3600000;
  };
  // 自动修理一件一张卡，几轮收在卡里；别的一轮一张卡
  function cards(rows) {
    const out = [], repairs = new Map();
    for (const r of rows) {
      if (r.category === 'auto-repair' && r.subject) {
        const key = `repair:${r.subject.id}`;
        if (!repairs.has(key)) { const card = { kind: 'repair', key, category: r.category, subject: r.subject, rounds: [] }; repairs.set(key, card); out.push(card); }
        repairs.get(key).rounds.push(r);
      } else out.push({ kind: 'run', key: r.key, category: r.category, run: r });
    }
    for (const c of repairs.values()) {
      c.rounds.sort((a, b) => (T.stamp(a.startedAt) || 0) - (T.stamp(b.startedAt) || 0));
      c.run = c.rounds.find(r => r.status === 'running') || c.rounds.at(-1);
    }
    // 后台给了 sort_at（进入现在这一类的时刻）就照它从新到旧排；没给照最后动静
    for (const c of out) { c.status = c.run.status; c.at = T.stamp(c.run.sortAt) || T.stamp(c.run.lastAt) || T.stamp(c.run.startedAt) || 0; }
    return out.sort((a, b) => b.at - a.at);
  }
  function view(d) {
    const got = collect(d);
    // 两张总列表后台已经截好 72 小时（照它发布的时刻），不再按这台的钟另截一次，免得和按钮上的数对不上
    const rows = got.rows.filter(r => r.category !== 'excerpt' && RUN_IDS.includes(r.category) && (got.board || inWindow(r))
      // 暂缓的轮次照暂缓显示，不算“跑完的”也不算“没做成的”（没有单独的“暂时不修”筛选，主控 11-25）
      && (!filter.family || r.family === filter.family) && (!filter.status || r.status === filter.status && !r.deferred));
    let live, done, counts, doneRounds = null;
    if (got.board) {
      // 两张列表各排各的：自动修理一件在修、之前几轮已跑完的，在修那轮在“进行中”，跑完的几轮在“近 72 小时跑完的”，件数和后台一致（按轮数）
      const lr = rows.filter(r => r.from === 'running'), dr = rows.filter(r => r.from === 'finished');
      [live, done] = [cards(lr), cards(dr)];
      doneRounds = dr.length;
      const plain = !filter.family && !filter.status;
      counts = { running: plain && known(got.totals.running) ? got.totals.running : got.waiting && !lr.length ? null : lr.length,
        finished: plain && known(got.totals.finished) ? got.totals.finished : got.waiting && !dr.length ? null : dr.length };
    } else {
      const all = cards(rows);
      live = all.filter(c => c.status === 'running'); done = all.filter(c => c.status !== 'running');
      counts = { running: got.waiting && !live.length ? null : live.length, finished: got.waiting && !done.length ? null : done.length };
    }
    const problems = problemsOf(d);
    return { ...got, live, done, counts, doneRounds, problems, total: live.length + done.length + problems.length, byId: new Map(got.rows.map(r => [r.key, r])) };
  }
  // 出毛病的：现在还挂着的那一处；正在修的照样列，写“AI 在修”（按钮分开以后不会和“进行中”摆在同一处）。
  // 后台第四段给了 board_problems（登录、额度停等的类不在里面，在页头停等条）就照它；没给照各类下的 problem
  function problemsOf(d) {
    if (Array.isArray(d.board_problems)) return d.board_problems.filter(p => p && IDS.includes(p.category));
    return shownCats(d).filter(c => c.problem && (c.problem.text || c.problem.title || c.problem.headline)).map(c => ({ category: c.id, ...c.problem }));
  }

  // —— 卡片 ——
  const catLabel = (d, id) => F(cn(list(d.categories).find(c => c.id === id)?.title || R.catName(id, viewer)), '类别');
  const range = r => {
    const a = r.startedAt || r.queuedAt, b = r.finishedAt;
    if (!T.stamp(a)) return b ? esc(when(b)) : '';
    if (!T.stamp(b) || T.clock(a) === T.clock(b) && T.dayKey(a) === T.dayKey(b)) return esc(when(a));
    return `${esc(when(a))}–${esc(T.dayKey(a) === T.dayKey(b) ? T.clock(b) : when(b))}`;
  };
  const who = r => r.who?.text ? esc(r.who.text) : '';
  const go = (href, text = '看经过') => href ? `<a class="au-card__go" href="${esc(href)}">${text} <span aria-hidden="true">›</span></a>` : '';
  // 私事线 11-26：“仅本人可见”只许出现在整轮被藏那一轮的标题处；卡片下面那行、做成的东西里后台还标着藏的，访客版不写这几个字，空着
  const Fm = (v, name) => { const h = F(v, name); return viewer !== 'owner' && /仅本人可见/.test(h) ? '' : h; };
  const outLink = o => {
    const label = o.kind === 'owner_item' ? `${Fm(o.title, '那张卡') || ''}那张卡` : o.kind === 'ledger_item' ? `账本${o.title && Fm(o.title, '账本那件') ? `：${Fm(o.title, '账本那件')}` : '那件'}`
      : o.kind === 'commit' ? `提交${o.title && Fm(o.title, '提交') ? `：${Fm(o.title, '提交')}` : ''}` : `${Fm(o.title, '文档') || '文档'}${o.version ? ` 第 ${esc(o.version)} 版` : ''}`;
    return o.href ? `<a class="tp-link" href="${esc(o.href)}">${label} ›</a>` : `<span>${label}</span>`;
  };
  function outputs(r) {
    if (r.outputs.length) return `<p class="au-card__outs">${r.outputs.map(outLink).join('')}</p>`;
    if (r.outputCount > 0 && r.href) return `<p class="au-card__outs"><a class="tp-link" href="${esc(r.href)}">做出 ${int(r.outputCount)} 样，看经过 ›</a></p>`;
    return '';
  }
  // 两轮互相指着：没做成的写“几点接着做了 ›”，接着做的写“接着 几点 那一轮 ›”
  function chain(r, v) {
    const other = id => v.byId.get(`${r.category}:${id}`);
    if (r.resumedBy) { const o = other(r.resumedBy); return link(R.runPath(r.category, r.resumedBy), `${o ? esc(when(o.startedAt)) + ' ' : '后来'}接着做了 ›`); }
    if (r.resumes) { const o = other(r.resumes); return link(R.runPath(r.category, r.resumes), `接着 ${o ? esc(when(o.startedAt)) + ' ' : '上次'}那一轮 ›`); }
    return '';
  }
  // 暂缓（暂时不修）是灰点，和没做成的红点分开（M674）
  const tone = r => r.status === 'running' ? 'run' : r.deferred ? 'off' : r.status === 'incomplete' ? 'bad' : r.status === 'completed' ? 'ok' : 'off';
  // 暂缓的轮次大字只写“暂时不修”，为什么写在卡片最下面那行小字里（主控 11-25）
  const endText = r => r.deferred ? '暂时不修' : `没做成：${F(r.reason, '原因') || '原因没记下'}`;
  function card(d, v, c) {
    const r = c.run, since = T.stamp(r.startedAt);
    let head = `<p class="au-card__cat">${catLabel(d, c.category)}</p>`;
    // rounds：自动修理一件之前几轮的小条，放在原因那行下面（原因紧跟大字，主控 11-26 复查）
    let title, body = '', meta, rounds = '';
    if (c.kind === 'repair') {
      // 第几轮只用后台给的 subject.round；没给就不写，不按列表里排第几自己编（列表和详情要对得上，验收 11-24 07:15）
      const nth = x => known(x.subject?.round) && x.subject.round > 0 ? x.subject.round : null;
      // 这件活的名字已经写在卡片上面那行，后台 summary 里又带着它的就去掉（前端 QA 11-25）
      const thing = F(c.subject.title, '这件活'), result = x => R.withoutSubject(F(x.summary, '结果'), thing) || '跑完了';
      const what = `${thing || '一件活'}${nth(r) ? ` · 第 ${int(nth(r))} 轮` : ''}`;
      if (r.status === 'running') title = what;
      else {
        head = `<p class="au-card__cat">${catLabel(d, c.category)} · ${what}</p>`;
        title = r.status === 'incomplete' || r.deferred ? endText(r) : result(r);
      }
      const earlier = c.rounds.filter(x => x !== r);
      // 之前几轮一律写成“第 N 轮 · 几点 · 结果 ›”：结果只写一个词（跑完／没做成／暂时不修），这一轮的说明点进去看，不塞进条里截成“…”。
      // 后台没给轮号的（比如派出去没人接的那一轮）写“未编号”，不按排第几自己编。同一件下后台有时分两串编号（同一张卡里出现两个“第 1 轮”），靠后面的时刻分开
      const word = x => x.deferred ? '暂时不修' : x.status === 'incomplete' ? '没做成' : x.status === 'running' ? '正在跑' : '跑完';
      if (earlier.length) rounds = `<p class="au-card__rounds">${earlier.map(x => `<a href="${esc(x.href)}" data-tone="${tone(x)}">${nth(x) ? `第 ${int(nth(x))} 轮` : '未编号'} · ${range(x)} · ${word(x)} ›</a>`).join('')}</p>`;
    } else if (r.status === 'incomplete' || r.deferred) title = endText(r);
    else title = F(r.summary, '这一轮做了什么') || (r.status === 'running' ? '正在跑' : '跑完了');
    if (r.status === 'running') {
      const doing = Fm(r.activity, '正在干什么');
      meta = [who(r), since ? `${esc(T.clock(r.startedAt))} 起，<span data-ran="${since}">跑了 ${minutes((Date.now() - since) / 1000)}</span>` : '', doing && `正在${doing.replace(/^正在/, '')}`].filter(Boolean).join(' · ');
    } else {
      body += r.status === 'incomplete' && !r.deferred ? '' : outputs(r);
      meta = [r.deferred && R.deferredWhy(r, Fm), range(r), who(r), Fm(r.trigger, '为什么开这一轮'), chain(r, v)].filter(Boolean).join(' · ');
    }
    if (c.kind === 'repair' && c.subject.href) meta += ` · ${link(c.subject.href, '这件的全部经过 ›')}`;
    // M684：本人版这一轮所挂的对话访客那边不一样的（visitor_labels.conversation），在这行末挂签
    // 私事线 11-26：整轮藏的挂“访客看不到”（点开写是哪一种情况），换了说法的挂“对外换了说法”
    meta += R.roundTag(r, viewer);
    return `<article class="au-card" data-tone="${tone(r)}" data-key="${esc(c.key)}"><span class="au-card__dot${r.status === 'running' ? ' is-live' : ''}" aria-hidden="true"></span>
      <div class="au-card__body">${head}<h3 class="au-card__title">${r.href ? `<a href="${esc(r.href)}">${title}</a>` : title}</h3>${body}<p class="au-card__meta">${meta}</p>${rounds}</div>${go(r.href)}</article>`;
  }
  // —— 页头右边：派活程序几点转过一圈 ——
  function dispatchText(d) {
    const x = d.dispatch;
    if (!x) return '';
    const every = known(x.interval_seconds) && x.interval_seconds > 0 ? Math.round(x.interval_seconds / 60) : null;
    const tick = x.last_tick_at || x.heartbeat_at;
    if (!T.stamp(tick)) return '<span class="au-warn">派活程序几点转的没读到</span>';
    const late = every && Date.now() - T.stamp(tick) > 2.5 * x.interval_seconds * 1000;
    return late ? `<span class="au-warn">派活程序 ${esc(when(tick))} 以后没再转${every ? `（该每 ${every} 分钟一次）` : ''}</span>`
      : `派活程序 ${esc(when(tick))} 转过一圈${every ? `，每 ${every} 分钟一次` : ''}`;
  }

  // —— 上半部 ——
  function chips(d) {
    const out = [];
    if (filter.family) out.push(['family', `只看 ${R.FAMILIES[filter.family]} 做的`]);
    if (filter.date) out.push(['date', filter.date === 'today' || filter.date === today() ? '只看今天' : `只看 ${esc(filter.date.slice(5))}`]);
    if (filter.status) out.push(['status', { running: '只看在跑的', completed: '只看跑完的', incomplete: '只看没做成的' }[filter.status]]);
    return out.map(([key, text]) => `<span class="au-chip">${text}<button type="button" data-clear="${key}" aria-label="不${text}">×</button></span>`).join('');
  }
  // 四个按钮（照第一屏图）：全部＝七类表，进行中、出毛病的、近 72 小时跑完的换成下面的列表。
  // 件数：两张总列表读到了，进行中、跑完的就是各自回包的 total（按轮数）；还没读到先用 automation 里的 board_counts；
  // 只看一家、一种结局、某一天时照下面实际列出的数。全部＝board_counts.all（几类）；老后台没给时照下面列表有几张（三样加起来）。列表还在读时不写数
  function buttons(d, v) {
    const bc = d.board_counts || {}, plain = !filter.family && !filter.status && !filter.date;
    const count = key => v.counts[key] ?? (plain && known(bc[key]) ? bc[key] : null);
    const btn = (key, label, n) => `<button type="button" class="au-view" data-view="${key}" aria-pressed="${(filter.view || 'all') === key}">${label}${n != null ? ` <b>${int(n)}</b>` : ''}</button>`;
    const all = known(bc.all) ? bc.all : v.waiting && !v.total ? null : v.total;
    return `<nav class="au-views" aria-label="看哪些">${btn('all', '全部', all)}${btn('running', '进行中', count('running'))}${btn('problems', '出毛病的', v.problems.length)}${btn('done', '近 72 小时跑完的', count('finished'))}${chips(d)}</nav>`;
  }
  const sec = (id, name, n, html, extra = '') => `<section class="au-sec" id="${id}"><h2 class="au-sec__head">${name}${n != null ? `<b> · ${int(n)}</b>` : ''}${extra}</h2>${html}</section>`;
  // 北京日期写成“11 月 24 日 周二”，今天的前面加“今天 · ”
  const zhDay = key => { const x = new Date(key + 'T12:00:00Z'); return `${key === today() ? '今天 · ' : ''}${x.getUTCMonth() + 1} 月 ${x.getUTCDate()} 日 周${'日一二三四五六'[x.getUTCDay()]}`; };
  // 出毛病的：按天排一长列（本人 11-24 选的 03 那种）：几点、哪一类、坏了什么、谁在处理、看这一轮
  function problemList(d, v) {
    if (!v.problems.length) return '<p class="au-empty">现在没有挂着的毛病。</p>';
    const days = new Map();
    for (const p of [...v.problems].sort((a, b) => (T.stamp(b.at) || 0) - (T.stamp(a.at) || 0))) {
      const key = T.dayKey(p.at) || '';
      if (!days.has(key)) days.set(key, []);
      days.get(key).push(p);
    }
    const row = p => {
      const run = p.run_id ? R.runPath(p.category, p.run_id) : T.path(p.href);
      const who = [p.repairing === true ? '<b class="au-ok">AI 在修</b>' : '', F(p.handler_text, '谁在处理') || (p.handler ? `已交${catLabel(d, p.handler)}` : '还没人接手')].filter(Boolean).join(' · ');
      const go = run ? `<a class="au-prob__go" href="${esc(run)}">${known(p.round) && p.round > 0 ? `看第 ${int(p.round)} 轮` : '看这一轮'} <span aria-hidden="true">›</span></a>` : '';
      return `<li class="au-prob"><span class="au-prob__dot" aria-hidden="true"></span><time>${esc(T.clock(p.at) || '')}</time><span class="au-prob__cat">${link(catPath(p.category), catLabel(d, p.category))}</span>
        <b class="au-prob__what">${F(p.headline || p.title || p.text, '哪里坏了')}</b><span class="au-prob__who">${who}</span>${go}</li>`;
    };
    return `${[...days.entries()].map(([key, ps]) => `<div class="au-probday"><h3>${key ? zhDay(key) : '时间没记下'}</h3><ul>${ps.map(row).join('')}</ul></div>`).join('')}
      <p class="tp-small au-probnote">只列现在还挂着的；修好了的在“近 72 小时跑完的”里，按“全部”回到${kinds(d)}表。</p>`;
  }
  // 按下“全部”以外的按钮时，下面换成的那块
  function lists(d, v) {
    const waiting = '<p class="au-empty">正在读…</p>';
    // 七份列表都读完了、一份也没读到（连不上、服务出错这类）才退回老读数：照实说这会儿读不到（M980）。
    // 列表没读到时页面上没有“从几点起读不到”的时刻（摘要的“截至”是别的读数的时刻），所以不写几点起
    const legacy = v.legacy && filter.view !== 'problems' ? `<p class="tp-note" data-tone="off">这会儿读不到每一轮的记录：下面先用${kinds(d)}各自最近几次拼出来，点不开经过。</p>` : '';
    if (filter.view === 'problems') return sec('trouble', '出毛病的', v.problems.length, problemList(d, v));
    if (filter.view === 'running') {
      const next = shownCats(d).filter(c => c.next_at).sort((a, b) => T.stamp(a.next_at) - T.stamp(b.next_at))[0];
      const idle = `<p class="au-empty">这会儿没在跑${next ? ` · 下一个：${esc(when(next.next_at))} ${catLabel(d, next.id)}` : ''}</p>`;
      return legacy + sec('running', '进行中', v.counts.running ?? v.live.length, v.live.length ? v.live.map(c => card(d, v, c)).join('') : v.waiting ? waiting : idle);
    }
    const day = filter.date ? (dayOf(filter.date) === today() ? '今天' : `${esc(dayOf(filter.date).slice(5))} 那天`) : '';
    // 这一节的名字和按钮同一个叫法“近 72 小时跑完的”（第一屏图上的叫法；复查 11-26：按钮和标题叫法要统一）。“跑完”指这一轮结束了，
    // 下面卡片的点分颜色：绿点跑完、红点没做成、灰点暂时不修。只看没做成的时写“没做成的”
    const doneWhat = `${filter.status === 'incomplete' ? '没做成' : '跑完'}的`;
    const capped = v.capped && !filter.date ? '<p class="tp-small au-capped">有的类这 72 小时跑得多，每类只列最近 50 轮；更早的按天看。</p>' : '';
    // 按钮和标题上的数是轮数（后台两张列表的 total），自动修理同一件的几轮收在一张卡里，卡片张数会少：都读完了、张数确实少时，标题下面说一句（复查挑过对不上）
    const rounds = v.doneRounds != null && v.doneRounds === (v.counts.finished ?? -1) && v.done.length < v.doneRounds
      ? `<p class="tp-small au-roundsnote">${int(v.doneRounds)} 是轮数：自动修理同一件修了几轮的，收在同一张卡里，所以下面是 ${int(v.done.length)} 张卡。</p>` : '';
    const excerpt = excerptToday?.data && known(excerptToday.data.total) ? `摘一句不在这里列，今天摘了 ${int(excerptToday.data.total)} 句。` : '';
    const left = v.done.length - doneShown;
    const more = left > 0 ? `<button type="button" class="au-more-btn" data-more-done>再看 ${int(Math.min(STEP, left))} 张 <span aria-hidden="true">›</span><small>还有 ${int(left)} 张</small></button>` : '';
    return legacy + sec('done', `${filter.date ? day : '近 72 小时'}${doneWhat}`, v.counts.finished ?? v.done.length, v.done.length ? rounds + v.done.slice(0, doneShown).map(c => card(d, v, c)).join('') + more : `<p class="au-empty">${v.waiting ? '正在读…' : `${filter.date ? '这天' : '这 72 小时'}没有${doneWhat}`}</p>`,
      filter.date ? `<button type="button" class="au-sec__back" data-clear="date">回到近 72 小时 ›</button>` : '') + capped + (excerpt ? `<p class="tp-small au-capped">${excerpt}</p>` : '') + older(d);
  }
  // 更早的：近 30 天每天跑了几轮（总表里各类的 30 天成坏加起来，摘一句不算），点一天只看那天
  function older(d) {
    const days = new Map();
    for (const c of shownCats(d)) if (c.id !== 'excerpt') for (const x of list(c.daily_30d)) {
      if (!DAY.test(x.date || '')) continue;
      const n = (x.success || 0) + (x.failed || 0), had = x.success != null || x.failed != null;
      const prev = days.get(x.date) || { n: 0, bad: 0, had: false };
      days.set(x.date, { n: prev.n + n, bad: prev.bad + (x.failed || 0), had: prev.had || had });
    }
    const rows = [...days.entries()].sort((a, b) => b[0].localeCompare(a[0]));
    // date 是北京日期 YYYY-MM-DD：按 UTC 解析再取 UTC 星期，不随浏览器本机时区变
    const week = ['日', '一', '二', '三', '四', '五', '六'];
    const grid = rows.length ? `<div class="au-days">${rows.map(([date, x]) => `<button type="button" class="au-day" data-day="${date}"${x.had ? '' : ' disabled'} aria-pressed="${dayOf(filter.date || '') === date}">
      <b>${esc(date.slice(5))}</b><small>周${week[new Date(date + 'T12:00:00Z').getUTCDay()]}</small><span>${x.had ? `${int(x.n)} 轮${x.bad ? `<em> · 坏 ${int(x.bad)}</em>` : ''}` : '没记'}</span></button>`).join('')}</div>`
      : '<p class="au-empty">近 30 天每天的轮数后台还没给。</p>';
    return `<div class="au-older"><button type="button" class="au-older__toggle" data-older aria-expanded="${olderOpen}">更早的 · 近 30 天按天看 <span aria-hidden="true">${olderOpen ? '‹' : '›'}</span></button>${olderOpen ? grid : ''}</div>`;
  }

  // —— 下半部：这周替你做成了 ——
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
  const WEEK_HOURS = '/live/agents/?hours=d7#hours';
  const spent = s => s < 60 ? [Math.round(s), '秒'] : s < 3600 ? [Math.round(s / 60), '分钟'] : null;
  function usage(d) {
    const seconds = d.results_7d?.ai_seconds ?? d.ai_usage?.total?.seven_day_seconds;
    const days = list(d.ai_usage?.total?.days_7);
    const u = d.ai_usage || {}, since = T.stamp(u.covered_since), weekStart = T.stamp(d.results_7d?.from) || Date.now() - 7 * 86400000;
    const short = known(seconds) && spent(seconds);
    const number = !known(seconds) ? '<span class="tp-fog">还没采上</span>'
      : short ? `<span class="tp-mid">${big(short[0], 'use-m')}<small>${short[1]}</small></span>`
      : `<span class="tp-mid">${big(Math.floor(seconds / 3600), 'use-h')}<small>小时</small> ${big(Math.round(seconds % 3600 / 60), 'use-m')}<small>分</small></span>`;
    // 合计和“三家各干了多少”点了都到智能体页“三家干了多少”那块，先选好“近 7 天”（这个数本来就是从 6 天前 0 点算到现在，和那边“近 7 天”同一段时间；
    // 两边算法不同：这里只算自动任务各类登记的每次调用，那边按三家日志里实际干活的时间算，所以数会不一样，数旁边写明这里的口径）
    const label = known(seconds) ? `<a class="au-use__go" href="${esc(T.path(WEEK_HOURS))}">${number}<span class="au-use__chev" aria-hidden="true">›</span></a>` : number;
    const covered = `<small class="au-use__since">${known(seconds) && since && since > weekStart ? `<span>从 ${esc(when(u.covered_since))} 起记，更早的没有记录</span>` : ''}${link(WEEK_HOURS, '三家各干了多少 ›', 'tp-link au-use__more')}</small>`;
    // 星期照上面日期格子的取法，按北京日期本身算，不用浏览器本机时区
    const names = ['日', '一', '二', '三', '四', '五', '六'];
    const chart = days.some(x => known(x.seconds)) ? T.columns({ rows: days.map((x, i) => ({ label: i === days.length - 1 ? '今天' : names[new Date(x.date + 'T12:00:00Z').getUTCDay()],
      // seconds 是 null：那天没记录到用时，写“没记”；0：记录覆盖内确实没调用，画 0；带 missing_reason：只补回了一部分，写“至少”，原因写在图下
      parts: [{ value: (x.seconds || 0) / 3600, color: i === days.length - 1 ? '#00a650' : '#9fdcb9' }], text: !known(x.seconds) ? '没记' : `${x.missing_reason ? '至少' : ''}${dec(x.seconds / 3600)}h` })),
      width: 380, height: 150, fmt: v => `${dec(v)}h`, grow: !drawn }) : `<p class="tp-small">每天各用多久后台还没分开给${known(seconds) ? '，先只有合计' : ''}。</p>`;
    const gaps = days.filter(x => x.missing_reason).map(x => `${esc(x.date.slice(5))}：${F(x.missing_reason, '为什么不全')}${known(x.seconds) ? `，至少 ${esc(T.duration(x.seconds).replace(/ 分$/, ' 分钟'))}` : ''}`);
    return `<section class="tp-panel au-use" id="usage"><div class="tp-panel__head"><h2>近 7 天后台 AI 共用了</h2></div><p class="au-use__num">${label}${known(seconds) ? '<small class="au-use__basis">只算自动任务各类登记的每次调用</small>' : ''}${covered}</p>${chart}${gaps.length ? `<p class="tp-small au-use__gaps">${gaps.join('；')}</p>` : ''}</section>`;
  }

  // 跑着的卡：跑了几分钟，每秒往前走；七类表“现在”那格写“已 N 分钟”
  setInterval(() => {
    for (const el of document.querySelectorAll('[data-ran]')) el.textContent = `跑了 ${minutes((Date.now() - Number(el.dataset.ran)) / 1000)}`;
    for (const el of document.querySelectorAll('[data-since]')) el.textContent = `已 ${minutes((Date.now() - Number(el.dataset.since)) / 1000)}`;
  }, 1000);

  // 停等条：哪几类因为登录过期、额度用完停着，几点起，期间看了几次（后台 check_count）；
  // 接上以后读 feed 里 kind=resumed 的那行（provider＋started_at 对上同一段等待），写“几点接上”，24 小时后不再出
  const checks = n => known(n) ? ` · 期间看了 ${int(n)} 次` : '';
  function pauses(d) {
    const names = ids => list(d.categories).filter(c => list(ids).includes(c.id)).map(c => U.fieldText(cn(c.title), viewer)).join('、');
    const now = list(d.provider_pauses).filter(p => list(p.categories).length).map(p =>
      `<p class="tp-note au-pause" data-tone="warn">${esc(names(p.categories))}停着：${pauseText(p)}${checks(p.check_count)}</p>`);
    const waiting = new Set(list(d.provider_pauses).map(p => `${p.provider}|${p.started_at}`));
    const back = list(d.feed).filter(f => f.kind === 'resumed' && f.provider && T.stamp(f.started_at) && T.stamp(f.resumed_at || f.at) > Date.now() - 86400000
      && !waiting.has(`${f.provider}|${f.started_at}`)).map(f => {
      const why = !f.reason ? '' : f.reason === 'login' ? '登录过期' : '额度用完';
      const who = names(f.categories) || U.fieldText(f.actor, viewer);
      return `<p class="tp-note au-pause" data-tone="ok">${esc(who)}：${esc(when(f.started_at))} 起${why ? `${why}停等` : '停等'}，${esc(when(f.resumed_at || f.at))} 接上${checks(f.check_count)}</p>`;
    });
    return now.join('') + back.join('');
  }
  function pauseText(p) {
    const why = p.reason === 'login' ? '登录过期' : '额度用完';
    // 本人版：登录过期一律写这句并链到那张卡；后台还没给卡的地址时先链到等你的事清单
    // 两版同一套（本人禁令 11-24 14:16）：登录过期两版都链到那张卡，访客点进等你的事页照常看
    const card = p.reason === 'login';
    // 后台的 text 自己带了“停着：”开头、也写了几点起：外面已经写了“停着”，开头去掉；text 里有那个钟点就不再补“· 几点起”。没带的照旧
    const text = card ? '' : U.fieldText(p.text, viewer).replace(/^停着[：:，,]\s*/, '');
    const since = p.started_at && !(text && text.includes(T.clock(p.started_at))) ? ` · ${esc(when(p.started_at))} 起` : '';
    return (card ? link(p.href || '/live/items/', `登录过期，登录命令在等${you()}的事里 ›`, 'tp-link au-warn') : esc(text || why)) + since;
  }

  // —— 八行总表 ——
  // 只有本人能点的按钮：访客版加 data-need-trusted，现成的可信设备弹框（trust-modal.js）在捕获阶段拦下、弹“这一步只有可信设备能做”；本人版不加，照常
  const ownerOnly = action => viewer === 'owner' ? '' : ` data-need-trusted="${esc(action)}"`;
  // 开关旁边那行小字：正在保存…／已保存／没存上：原因／还没确认存上（feedback 按开关的 id 记）
  const noteFor = id => {
    if (feedback?.id !== id) return '';
    let { text, tone = '' } = feedback;
    // 超时、断线以后又读到了新读数：照读数说，不再写“还没确认存上”（开关本身已经照读数显示）
    // 暂停框连暂停到的时刻一起比：读数里的时刻和点的那个一样才算存上
    if (feedback.want && feedback.reread) {
      const s = rowOf(id)?.setting || {}, m = s.mode, want = feedback.want, until = isoOf(s.until_at);
      const same = m === want.mode && (!want.until || T.stamp(until) === T.stamp(want.until));
      [text, tone] = same ? ['已保存', 'ok'] : [`最新读数还是${m === 'paused' ? `暂停到 ${when(until)}` : { on: '开着', off: '关着' }[m] || '没读到'}`, ''];
    }
    return `<small role="status" data-tone="${tone}">${esc(text)}</small>`;
  };
  const waitingOn = id => feedback?.id === id && feedback.pending ? ' aria-busy="true"' : '';
  function switchCell(c, offline) {
    // 开关只照读数和后台回包里的 current 显示：后台回之前留在原档，旁边写“正在保存…”
    const m = mode(c), until = c.setting?.until_at, paused = esc(pausedText(until) || '暂停中');
    const text = m === 'on' ? '开着' : m === 'off' ? '关着' : m === 'paused' ? paused : '没读到';
    if (offline || !m) return `<span class="au-state" data-mode="${esc(m || '')}">${text}</span>`;
    const fb = noteFor(c.id) || '<small role="status"></small>';
    // 访客版照样摆同一套开关和“暂停到…”（M716，定稿：公开版保留已定按钮）；点了由现成的可信设备弹框拦下，只提示本人才能操作，什么都不改
    return `<button type="button" class="au-switch" role="switch" aria-checked="${m === 'on'}" data-toggle="${esc(c.id)}" data-mode="${esc(m)}"${waitingOn(c.id)}${ownerOnly('开关自动任务')} aria-label="${esc(U.fieldText(cn(c.title), viewer))} · ${text}"><i></i><span>${m === 'on' ? '开' : '关'}</span></button>
      <button type="button" class="au-pausebtn" data-pause="${esc(c.id)}"${ownerOnly('暂停自动任务')}>${m === 'paused' ? esc(pausedText(until, '\n')).replace('\n', '<br>') || '暂停中' : '暂停到…'}</button>${fb}`;
  }
  // AI 约好的事在等几件、下一件几点：从账本数。后台把自动修理的活记成“自动修理”记的，其余还没了结的就是约好的；在办的不算在等
  function promised() {
    const items = ledger?.data?.items;
    if (!Array.isArray(items)) return null;
    const mine = items.filter(it => it.state && it.state !== 'working' && it.registered_by !== '自动修理');
    const full = it => known(it.check_count) && it.check_count >= (it.check_limit || 3);
    const next = mine.filter(it => !full(it) && T.stamp(it.next_at) > Date.now()).map(it => it.next_at).sort((a, b) => T.stamp(a) - T.stamp(b))[0];
    return { count: mine.length, next };
  }
  // “现在”那格（照第一屏图）：灯＋一句话，下面一行小字。先后：停等（登录过期、额度用完）＞出毛病＞正在跑＞关着＞暂停到＞空着等下次
  function nowCell(d, c, v) {
    const g = G[c.id] || {}, p = pauseOf(d, c.id), pr = c.problem, st = c.state || {}, m = mode(c);
    const live = v.live.find(x => x.category === c.id)?.run, since = T.stamp(live?.startedAt);
    let tone = 'idle', main, sub = esc(g.when || '');
    if (p) { tone = 'warn'; main = `停着：${pauseText(p)}${checks(p.check_count)}`; }
    else if (pr && (pr.headline || pr.title || pr.text)) {
      tone = 'warn'; main = `出毛病：${F(pr.headline || pr.title || pr.text, '哪里坏了')}`;
      sub = [pr.repairing === true ? 'AI 在修' : F(pr.handler_text, '谁在处理'), known(pr.round) && pr.round > 0 ? `第 ${int(pr.round)} 轮` : ''].filter(Boolean).join('，') || sub;
    } else if (c.running || st.kind === 'running' || live) {
      tone = 'run';
      const ran = since ? `<span data-since="${since}">已 ${minutes((Date.now() - since) / 1000)}</span>` : known(st.elapsed_seconds) ? `已 ${minutes(st.elapsed_seconds)}` : '';
      const doing = live && (F(live.activity, '正在干什么') || (live.subject ? F(live.subject.title, '这件活') : ''));
      main = `正在跑${ran ? ` · ${ran}` : ''}`; sub = doing ? `${doing.replace(/^正在/, '')}` : sub;
    } else if (m === 'off') { tone = 'off'; main = '关着'; sub = c.id === 'weekly-live' ? '网站上线收尾做完再开' : sub; }
    else if (m === 'paused') { tone = 'off'; main = esc(pausedText(c.setting?.until_at) || '暂停中'); }
    else if (c.id === 'excerpt') main = excerptToday?.data && known(excerptToday.data.total) ? `今天摘了 ${int(excerptToday.data.total)} 句` : '空着';
    else if (c.id === 'ai-commitments') {
      const owed = promised();
      main = owed?.next ? `空着 · 下一件 ${esc(when(owed.next))}` : '空着';
      // 点了落到账本页“欠着 · AI 在修的”那块开头，并选好“约好再查的”筛选，进去列的就是这几件（主控 11-26 02:20 定）
      if (owed) sub = link('/live/ledger/?kind=promised#kinds', owed.count ? `${int(owed.count)} 件在等 ›` : '没有在等的 ›');
    } else {
      const next = st.next_at || c.next_at;
      main = next ? `空着 · 下次 ${esc(when(next))}` : `空着${c.waiting_for ? ` · ${F(c.waiting_for, '在等什么')}` : ''}`;
    }
    return `<div class="au-now" data-tone="${tone}"><span class="au-now__dot" aria-hidden="true"></span><p><b>${main}</b>${sub ? `<small>${sub}</small>` : ''}</p></div>`;
  }
  // AI 约好的事今天做完几件、用了几分钟，跟在上次结果的钟点后面
  function todayText(c) {
    if (c.id !== 'ai-commitments') return '';
    const n = c.result_today?.count, s = c.ai_usage?.today_seconds;
    // 几分钟整个不拆行（复查 11-26：“分钟”的“钟”单独掉到下一行）
    return [known(n) ? `今天做完 ${int(n)} 件` : '', known(s) ? `<span class="au-nw">用了 ${s > 0 ? minutes(s) : '0 分钟'}</span>` : ''].filter(Boolean).join('，');
  }
  function lastCell(c) {
    const r = c.last_result;
    const since = c.recent_stats?.recorded_since;
    if (!r) return mode(c) === 'off' ? `<span class="tp-muted">关着${c.id === 'weekly-live' ? '，网站上线收尾做完再开' : ''}</span>`
      : `<span class="tp-muted">${since ? `${esc(when(since))} 起还没跑过` : '还没有运行记录'}</span>`;
    return `${F(r.text, '上次结果')}<small>${[esc(when(r.at)), todayText(c)].filter(Boolean).join(' · ')}</small>`;
  }
  // 近 30 天：小柱图和“成 N · 坏 N”，从几号起记；成坏怎么数的口径放在这一类的页上（表里只留数，照第一屏图）
  function trendCell(c) {
    const days = list(c.daily_30d), s = c.recent_stats || {};
    if (!days.length) return '<span class="tp-fog">还没采上</span>';
    const since = T.stamp(s.recorded_since), late = since && since > (T.stamp(s.from) || 0) + 86400000;
    const nums = known(s.success) ? `成 ${int(s.success)} · 坏 ${int(s.failed)}` : '还没采上';
    return `<div class="au-trend">${T.posneg(days, { width: 140, height: 30 })}<span${s.failed ? ' data-bad' : ''}>${nums}${late ? `<small><i> · </i>${esc(T.day(s.recorded_since))} 起记</small>` : ''}</span></div>`;
  }
  // 用谁：点了到智能体页看这一家干了多少；认不出哪一家的照原样写字
  function modelCell(c) {
    const text = [c.model, c.model_effort].filter(Boolean).map(esc).join(' · ');
    const family = text && R.agentsPath(R.familyOf({ host: c.host, model: c.model }));
    return !text ? '没读到' : family ? link(family, `${text} ›`) : text;
  }
  // 七类表（照第一屏图）：任务和怎么干、现在、上次结果、近 30 天、用谁、开关、›。点一行到这一类的页，“怎么干 ›”到怎么干页（本人 11-24：八类卡点进去是另一页，怎么干看机制）
  function table(d, v) {
    const cats = shownCats(d);
    if (!cats.length) return `<section class="tp-panel" id="types"><p class="tp-empty">${d.types ? '这一版后台还没给各类的读数。' : '各类自动任务没读到。'}</p></section>`;
    const offline = state?.offline;
    return `<section class="tp-panel au-board" id="types">
      <table class="tp-table au-table"><thead><tr><th scope="col">任务</th><th scope="col">现在</th><th scope="col">上次结果</th><th scope="col">近 30 天</th><th scope="col">用谁</th><th scope="col">开关</th><th scope="col" aria-label="进这一类"></th></tr></thead>
      <tbody>${cats.map(c => {
        const g = G[c.id] || {}, p = pauseOf(d, c.id);
        return `<tr id="cat-${c.id}" data-row="${c.id}" class="au-row${p ? ' is-paused' : ''}" data-mode="${esc(mode(c) || '')}">
          <th scope="row"><a class="au-name" href="${esc(catPath(c.id))}"><b>${F(cn(c.title))}</b><span>${esc(g.short || '')}</span></a><a class="au-how" href="${esc(howPath(c.id))}">怎么干 ›</a></th>
          <td class="au-nowcell">${nowCell(d, c, v)}</td><td class="au-last">${lastCell(c)}</td><td>${trendCell(c)}</td><td class="au-model">${modelCell(c)}</td>
          <td class="au-switchcell">${switchCell(c, offline)}</td><td class="au-go"><a href="${esc(catPath(c.id))}" aria-label="进${esc(U.fieldText(cn(c.title), viewer))}这一类">›</a></td></tr>`;
      }).join('')}</tbody></table>
      <p class="tp-small au-foot">点一行看这一类；不叫 AI 的备份、同步、守护在 ${link('/live/tasks/', '计划任务 ›')}；一件件修了什么、约了什么在 ${link('/live/ledger/', 'AI 自动任务账本 ›')}。摘一句每答完一次就跑一下、单独记数，不算在上面“进行中”“近 72 小时跑完的”里。</p>${scheduled(d)}</section>`;
  }

  // —— 各家自带的定时（M183、M921）：三家都列，没有就写没有。各家原生定时也可能开一场新对话，所以不再说“只用来叫醒当前对话” ——
  // 时间只写一次（M928 第 5 处）：重复周期配上下一次的北京星期和时刻，写成“每周二 00:00（北京）”，不写外国时区名；
  // 一次性的写日期和时分。调度器另报的预计时刻和原定不在同一分钟才补“预计 …（北京）”。
  // 后台没给 next_beijing_* 这几个字段、或周期认不出（cron 原文、“每小时”这类）时照原来的写法。
  const zhDate = at => { const t = T.stamp(at); if (t == null) return ''; const d = new Date(t + 8 * 3600000); return `${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日`; };
  const zhAt = at => `${zhDate(at)} ${clock(at)}（北京）`;
  function plan(r) {
    const p = typeof r.period === 'string' ? r.period.trim() : '', due = r.next_nominal_at || r.next_at;
    if (p === '一次性' || p === '单次运行') return due && T.stamp(due) != null ? zhAt(due) : '';
    const wd = typeof r.next_beijing_weekday === 'string' ? r.next_beijing_weekday.replace(/^星期/, '周') : '';
    const at = typeof r.next_beijing_time === 'string' && /^\d{2}:\d{2}$/.test(r.next_beijing_time) ? r.next_beijing_time : '';
    const m = p.match(/^每\s*(\d*)\s*(周|天|月|年)/);
    if (!wd || !at || !m) return '';
    const n = m[1] && m[1] !== '1' ? ` ${m[1]} ` : '', about = p.includes('左右') ? ' 左右' : '';
    const date = zhDate(r.next_nominal_at);
    const cycle = m[2] === '周' ? (n ? `每${n}周的${wd}` : `每${wd}`) : m[2] === '天' ? `每${n || ''}天`
      : !date ? '' : m[2] === '月' ? `每${n ? `${n}个月的 ` : '月 '}${date.replace(/^\d+ 月 /, '')}` : `每年 ${date}`;
    return cycle ? `${cycle} ${at}${about}（北京）` : '';
  }
  function scheduled(d) {
    if (!Array.isArray(d.scheduled_activities)) return '';
    const rows = list(d.scheduled_activities), gaps = list(d.scheduled_gaps).map(g => U.fieldText(g, viewer)).filter(Boolean);
    const hosts = ['Claude', 'Codex', 'Antigravity'];
    for (const r of rows) if (r.producer && !hosts.includes(r.producer)) hosts.push(r.producer);
    // 上次跑：定时唤醒的那一场对话（后台 last_wake：时刻、对话标题、对话链接），点回原对话（M921“跑完能找回原对话”）；
    // 访客看不到的那场后台给标题“仅本人可见”、链接为空，照写
    const wake = r => {
      const w = r.last_wake;
      if (!w || !T.stamp(w.at)) return '';
      const title = F(w.chat_title, '那一场对话');
      return `<small class="au-wake">上次跑：${esc(when(w.at))}${title ? ` · ${T.path(w.chat_href) ? link(w.chat_href, `${title} ›`) : title}` : ''}</small>`;
    };
    const item = r => {
      const when1 = plan(r);
      if (!when1) return `<li><b>${esc(when(r.next_at || r.at))}</b>${link(r.href, F(r.label, '这个定时'))}<small>${[F(r.period), F(r.state_text)].filter(Boolean).join(' · ')}${r.next_at ? ` · 下次 ${esc(when(r.next_at))}` : ''}</small>${wake(r)}</li>`;
      // 后台给了估计的实际启动时刻（next_estimated_at）和排的钟点（next_nominal_at）不在同一分钟：说清这次早几分钟或晚几分钟，
      // 不然“每周二 00:00”后面跟一句“预计 11 月 30 日 23:55”（早 5 分钟跨过半夜成了周一）读着像矛盾（复查 11-26）
      const est = T.stamp(r.next_estimated_at), nominal = T.stamp(r.next_nominal_at);
      const off = est != null && nominal != null ? Math.round((est - nominal) / 60000) : 0;
      const late = !off ? '' : Math.abs(off) < 180 ? `这次预计${off < 0 ? '早' : '晚'} ${Math.abs(off)} 分钟，${zhAt(r.next_estimated_at)}` : `这次预计 ${zhAt(r.next_estimated_at)}`;
      return `<li><b>${esc(when1)}</b>${link(r.href, F(r.label, '这个定时'))}<small>${[F(r.state_text), esc(late)].filter(Boolean).join(' · ')}</small>${wake(r)}</li>`;
    };
    // 只接本机执行的定时（本人 11-25 22:13 定 Claude 那家，R129），claude.ai 上建的这类云端定时不接：整组标题旁写一句，不在 Claude 那行再写一遍
    const scope = {};
    const body = hosts.map(h => {
      const mine = rows.filter(r => r.producer === h).sort((a, b) => T.stamp(b.next_at || b.at) - T.stamp(a.next_at || a.at));
      const notes = [scope[h], ...gaps.filter(g => g.includes(h))].filter(Boolean).map(g => `<small>${esc(g)}</small>`).join('');
      return `<tr><th scope="row">${esc(h)}${mine.length ? `<small>${int(mine.length)} 个</small>` : ''}</th><td>${mine.length ? `<ul class="au-recent">${mine.map(item).join('')}</ul>` : '没有'}${notes}</td></tr>`;
    }).join('');
    const rest = gaps.filter(g => !hosts.some(h => g.includes(h))).map(g => `<p class="tp-small">${esc(g)}</p>`).join('');
    return `<div class="au-extra au-sched" id="scheduled"><p class="tp-sub">各家自带的定时<small>只列在这台电脑上执行的，云端的（比如 claude.ai 上建的）不在这里；反复跑的活都在上面${kinds(d)}里</small></p>
      <table class="tp-table au-mini-table"><tbody>${body}</tbody></table>${rest}</div>`;
  }

  // —— 快讯：只放开始、跑完、停了，不放摘一句（runs.js 里拼）——
  const feed = d => { const got = collect(d); return R.ticker(d, got.legacy ? null : got.rows, viewer); };

  let drawn = false;
  function draw() {
    const d = state?.data;
    viewer = T.viewerOf(state);
    if (!d) { T.paint(page.root, T.placeholder(state, '自动任务')); page.tick.set([], { off: true }); return; }
    const side = [`截至 ${esc(when(d.at))}`, dispatchText(d)].filter(Boolean).join(' · ');
    const v = view(d), all = !filter.view;
    T.paint(page.root, R.asOwner(`<div class="tp-head"><div><h1>自动任务</h1><p>后台 AI 替${you()}干的${kinds(d)}活。在干什么、刚干完什么、几点跑、用谁、开没开。</p></div><p class="tp-head__side"><span>${side}</span></p></div>
      ${T.stateNote(state)}${pauses(d)}${buttons(d, v)}
      ${all ? `${table(d, v)}<div class="tp-grid au-top">${results(d)}${usage(d)}</div>` : `<div class="au-list">${lists(d, v)}</div>`}`, viewer));
    drawn = true;
    page.tick.set(feed(d), { off: state.offline });
    // 只在进页那一次按地址里的 #… 滚过去
    if (!landed) { landed = true; if (location.hash) T.reveal(location.hash.slice(1)); }
  }

  async function save(id, value) {
    if (busy) return null;
    busy = true;
    try { return await Live.automationSetting({ operation: 'type-mode', id, value }); } finally { busy = false; }
  }
  // 没存上时写原因：后台给了中文就照写；超时、断线、电脑回不了话（status unknown）只说还没确认，不说没存上
  function failText(reply) {
    if (reply?.error === 'cockpit_owner_required') return '没存上：这台设备还没配对成本人设备';
    if (!reply || reply.status === 'unknown') return '还没确认存上';
    if (typeof reply?.message === 'string' && /[一-鿿]/.test(reply.message)) return `没存上：${reply.message}`;
    return '没存上：电脑没写进去，再点一次';
  }
  // 时刻可能是秒数（后台回包）或时刻字符串（读数）：一律换成时刻字符串再比、再写
  const isoOf = v => typeof v === 'number' ? new Date(v * 1000).toISOString() : v;
  const rowOf = id => list(state?.data?.categories).flatMap(c => [c, ...list(c.subcategories)]).find(row => row.id === id);
  // 后台回包里的 until_at 是秒数，读数里是时刻字符串：并进来时换成时刻字符串，页面照常写“暂停到 几点”
  const asSetting = cur => ({ ...cur, ...(typeof cur.until_at === 'number' ? { until_at: isoOf(cur.until_at) } : {}) });
  // 回包到了才动开关：存上了照回包里的 current 滑过去；没存上但后台带回了电脑上读到的 current（读回和请求不一致），照它显示；
  // 别的没存上、还没确认的，开关留在原档，之后照新读数显示
  async function saved(id, reply, want) {
    feedback = reply.status === 'saved' ? { id, text: '已保存', tone: 'ok' } : reply.status === 'retired' ? { id, text: reply.message || '已撤' }
      : { id, text: failText(reply), tone: reply.status === 'unknown' ? '' : 'bad', want: reply.status === 'unknown' ? want : undefined };
    const row = rowOf(id);
    if (row && reply.current && typeof reply.current === 'object') row.setting = { ...row.setting, ...asSetting(reply.current) };
    // 主开关在原地滑到新档（圆钮滑、底色跟着变），滑完再整块重画
    const el = page.root.querySelector(`.au-switch[data-toggle="${CSS.escape(id)}"]`), m = row && mode(row);
    if (el && m && el.dataset.mode !== m) {
      el.dataset.mode = m; el.setAttribute('aria-checked', String(m === 'on')); el.removeAttribute('aria-busy');
      el.querySelector('span').textContent = m === 'on' ? '开' : '关';
      const note = el.parentElement.querySelector('small[role="status"]');
      if (note) { note.textContent = feedback.text; note.dataset.tone = feedback.tone || ''; }
      await new Promise(r => setTimeout(r, 320));
    }
    draw();
    // 还没确认的：等这次重读回来，开关旁那行改照新读数说（noteFor）
    const fb = feedback;
    Live.refresh().then(() => { if (feedback === fb && fb.want) { fb.reread = true; draw(); } });
  }
  const dialog = document.getElementById('au-pause'), form = dialog.querySelector('form');
  dialog.querySelector('[data-cancel]').addEventListener('click', () => dialog.close());
  const WEEK = ['日', '一', '二', '三', '四', '五', '六'], pad = n => String(n).padStart(2, '0');
  const bjNow = () => new Date(Date.now() + 8 * 3600000);
  // 打开时填好下拉：今天起 14 天，00–23 时，每 5 分钟；先选好原来暂停到的那个钟点，没有就选下一个整点
  function fillWhen(untilAt) {
    const until = T.stamp(untilIso(untilAt)), now = bjNow(), from = until > Date.now() ? new Date(until + 8 * 3600000) : new Date(now.getTime() + 3600000);
    if (!(until > Date.now())) from.setUTCMinutes(0, 0, 0);
    const days = Array.from({ length: 14 }, (_, i) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + i)));
    const key = x => `${x.getUTCFullYear()}-${pad(x.getUTCMonth() + 1)}-${pad(x.getUTCDate())}`;
    form.elements.day.innerHTML = days.map((x, i) => `<option value="${key(x)}">${x.getUTCMonth() + 1}月${x.getUTCDate()}日 周${WEEK[x.getUTCDay()]}${['（今天）', '（明天）', '（后天）'][i] || ''}</option>`).join('');
    form.elements.hour.innerHTML = Array.from({ length: 24 }, (_, h) => `<option value="${pad(h)}">${pad(h)} 点</option>`).join('');
    form.elements.minute.innerHTML = Array.from({ length: 12 }, (_, m) => `<option value="${pad(m * 5)}">${pad(m * 5)} 分</option>`).join('');
    form.elements.day.value = key(from); form.elements.hour.value = pad(from.getUTCHours()); form.elements.minute.value = pad(Math.floor(from.getUTCMinutes() / 5) * 5);
  }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!pausing || busy) return;
    const id = pausing, result = form.querySelector('[data-result]');
    const until = `${form.elements.day.value}T${form.elements.hour.value}:${form.elements.minute.value}:00+08:00`;
    if (!(Date.parse(until) > Date.now())) { result.textContent = '要选比现在晚的时间'; return; }
    // 等后台回话：框里和开关旁边都写“正在保存…”，开关和原来的暂停时间留着
    result.textContent = '正在保存…';
    feedback = { id, text: '正在保存…', pending: true };
    draw();
    const reply = await save(id, { mode: 'paused', until_at: until });
    if (!reply) return;
    // 存上了收框；明确没存上、还没确认的留着框写原因，开关旁边也写同一句
    if (reply.status === 'saved' || reply.error === 'cockpit_owner_required') dialog.close();
    else result.textContent = failText(reply);
    saved(id, reply, { mode: 'paused', until });
  });

  let page;
  page = T.boot({ resource: 'automation', back: '/live/#automation',
    ask: () => '请看实况自动任务页：后台 AI 现在在干什么、刚跑完什么、哪类坏了或停着、要不要我出面。先用大白话说，别动手。',
    onState(next) { state = next; schedule(); } });
  // 等 T.boot 先订上 automation 本身再订各类运行列表：页顶那条“下面是几点的数据”说的是本页主数据（第一个订的那份），
  // 原来各类运行列表先订、成了主数据，断线时页顶写列表的时刻、标题下灰条写总览的时刻，一页两个时间（M960）
  queueMicrotask(() => {
    watchRuns();
    // 总表里“AI 约好的事”那一行的在等几件、下一件几点从账本数
    Live.watch('ledger', {}, { phase(st) { ledger = st; schedule(); } });
  });
  page.root.addEventListener('click', async e => {
    const toggle = e.target.closest('[data-toggle]'), pause = e.target.closest('[data-pause]');
    const pick = e.target.closest('[data-view]'), clear = e.target.closest('[data-clear]'), day = e.target.closest('[data-day]');
    // 四个按钮：换下面那块，按钮停在原处
    if (pick) { T.keep(page.root, '.au-views', () => setFilter({ view: pick.dataset.view === 'all' ? null : pick.dataset.view })); return; }
    if (clear) { setFilter({ [clear.dataset.clear]: null }); return; }
    if (day) { setFilter({ view: 'done', date: day.dataset.day === today() ? 'today' : day.dataset.day }); T.reveal('done'); return; }
    if (e.target.closest('[data-more-done]')) { T.keep(page.root, '[data-more-done]', () => { doneShown += STEP; draw(); }); return; }
    if (e.target.closest('[data-older]')) { T.keep(page.root, '[data-older]', () => { olderOpen = !olderOpen; draw(); }); return; }
    // 整行都能点：点在开关、暂停、链接以外的地方，等于点了这一行，到这一类的页
    const row = !e.target.closest('a, button, input, select') && e.target.closest('tr[data-row]');
    if (row) { location.href = catPath(row.dataset.row); return; }
    if (toggle) {
      const id = toggle.dataset.toggle, next = toggle.dataset.mode === 'on' ? 'off' : 'on';
      if (busy) return;
      // 后台回之前开关留在原档，旁边只写“正在保存…”；回包到了才照它滑过去或写原因（saved）。主开关、“怎么干”里的小类开关一个样
      feedback = { id, text: '正在保存…', pending: true };
      T.keep(page.root, `[data-toggle="${CSS.escape(id)}"]`, draw);
      saved(id, await save(id, { mode: next }) || { status: 'unknown' }, { mode: next });
      return;
    }
    if (pause) {
      const access = await Live.automationSetting({ operation: 'access' });
      // 只是先问一声能不能操作，还没保存什么：电脑没回话就照实说，不写“还没确认存上”
      if (access.status === 'unknown') { feedback = { id: pause.dataset.pause, text: '电脑没回话，再点一次' }; draw(); return; }
      if (access.status !== 'pass') { saved(pause.dataset.pause, access); return; }
      pausing = pause.dataset.pause;
      fillWhen(list(state?.data?.categories).flatMap(c => [c, ...list(c.subcategories)]).find(c => c.id === pausing)?.setting?.until_at);
      form.querySelector('[data-result]').textContent = '';
      dialog.showModal();
    }
  });
})();
