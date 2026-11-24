// 实况 · 自动任务 · 一轮的详情（本人 11-24 01:36 看过样子图 02-一轮的详情）。
// 网址 /live/automation/run/?type=<类>&run=<轮号>。读 automation/runs/<类>/<轮号>（这一轮），
// 另读这一类的列表找上一轮、下一轮和接着做的那一轮，读 automation 拿快讯条和类名。取数转换在 ../runs.js。
(() => {
  'use strict';
  const T = window.LiveTape, U = window.LiveUI, Live = window.Live, G = window.LiveAutomationGuide || {}, R = window.AutomationRuns, { esc } = U;
  const { list, known, int, link, when } = T;
  const params = new URLSearchParams(location.search);
  const category = R.CATS.includes(params.get('type')) ? params.get('type') : '', id = params.get('run') || '';
  // 从自动任务页点进来的，返回回进来时那个网址，三家、状态这些筛选原样留着（验收 11-24 06:40）；
  // 那一页没筛这一类时，返回链接写“自动任务”，不写这一类的名字
  const fromList = (() => {
    try { const u = new URL(document.referrer); return u.origin === location.origin && u.pathname === '/live/automation/' ? u : null; } catch { return null; }
  })();
  const back = fromList ? fromList.pathname + fromList.search + fromList.hash : T.path('/live/automation/', { category });
  const listLabel = fromList && fromList.searchParams.get('category') !== category ? '自动任务' : '';
  let state, viewer = 'public', board = null, siblings = null, others = null, fromReferrer = false;
  const F = (v, name) => T.field(v, viewer, name);
  const you = () => T.you(viewer);
  const name = () => R.catName(category, viewer, list(board?.data?.categories).find(c => c.id === category)?.title);

  // —— 页头：大标题写这轮的结果，下面一排标签 ——
  const clockRange = r => {
    const a = r.startedAt || r.queuedAt, b = r.finishedAt;
    if (!T.stamp(a)) return '';
    return T.stamp(b) ? `${when(a)}–${T.dayKey(a) === T.dayKey(b) ? T.clock(b) : when(b)}` : `${when(a)} 起`;
  };
  const span = m => !known(m) ? '' : m < 1 ? `${Math.max(1, Math.round(m * 60))} 秒` : m < 60 ? `${Math.round(m)} 分钟` : `${Math.floor(m / 60)} 小时 ${Math.round(m % 60)} 分`;
  const nth = r => known(r.subject?.round) && r.subject.round > 0 ? r.subject.round : null;
  function title(r) {
    // 第几轮只用后台给的 subject.round；没给就不写（和列表对得上，验收 11-24 07:15）
    const lead = r.subject ? `${F(r.subject.title, '这件活')}${nth(r) ? ` · 第 ${int(nth(r))} 轮` : ''}` : '';
    const tail = r.deferred ? R.deferredTitle(r, F, !!lead) : r.status === 'incomplete' ? `没做成：${F(r.reason, '原因') || '原因没记下'}` : r.status === 'running' ? (r.subject ? '' : F(r.summary, '这一轮') || '正在跑')
      : F(r.summary, '这一轮做了什么') || '跑完了';
    return lead && tail ? `${lead}：${tail}` : lead || tail;
  }
  function tags(r) {
    const minutes = r.status === 'running' && T.stamp(r.startedAt) ? (Date.now() - T.stamp(r.startedAt)) / 60000 : r.minutes;
    const time = [clockRange(r), minutes != null && (r.status === 'running' ? `已跑 <span data-ran="${T.stamp(r.startedAt)}">${span(minutes)}</span>` : `用了 ${span(minutes)}`)].filter(Boolean).join(' · ');
    return [esc(name()), F(r.trigger, '为什么开这一轮'), r.who?.text ? esc(r.who.text) : '', r.status === 'running' ? '<b class="ar-live">正在跑</b>' : '', time].filter(Boolean)
      .map(t => `<span class="ar-tag">${t}</span>`).join('');
  }

  // 另一轮（接着做的、被接着做的、上一轮、下一轮）：先看这一类的列表里有没有
  const other = rid => siblings?.rows.find(x => x.id === rid);
  const ordered = () => (siblings?.rows || []).slice().sort((a, b) => (T.stamp(a.startedAt || a.queuedAt) || 0) - (T.stamp(b.startedAt || b.queuedAt) || 0));

  // —— 为什么开这一轮：后台写了就照写；没写用这一轮的触发和前后两轮拼一句 ——
  function why(r) {
    if (r.why) return `<p>${F(r.why, '为什么开这一轮')}</p>`;
    const parts = [];
    if (r.trigger) parts.push(`按“${F(r.trigger, '为什么开这一轮')}”开的这一轮。`);
    if (r.subject) parts.push(`修的是“${F(r.subject.title, '这件活')}”${nth(r) ? `，这是第 ${int(nth(r))} 轮` : ''}。`);
    if (r.resumes) {
      const o = other(r.resumes);
      parts.push(o ? `${esc(when(o.startedAt))} 那一轮${o.reason ? `因为${F(o.reason, '原因')}` : ''}没做成，这一轮接着做。` : '前一轮没做成，这一轮接着做。');
    }
    const how = G[category]?.trigger;
    return `<p>${parts.join('') || '后台没写为什么开这一轮。'}</p>${how ? `<p class="tp-small">这一类什么时候开：${esc(how)}</p>` : ''}`;
  }

  // —— 这一轮做成了什么：每件右边“去那张卡 ›”“去账本那件 ›” ——
  // 提交在 GitHub 上：本人版给链接并标“访客看不到”，访客版写已提交、为什么不放链接（后台没标仓库公开还是私有）
  const GITHUB_WHY = '本人的 GitHub 仓库有一部分是私有的，访客点开会打不开';
  function outputs(r) {
    const rows = r.outputs.map((o, i) => `<li><span class="ar-num">${i + 1}</span><p><b>${F(o.title, '做成的东西') || esc(o.where)}</b>${o.action || o.where ? ` <span class="ar-arrow">→</span> ${esc(o.action)}${o.where && o.title ? esc(o.where) : ''}${o.version ? ` 第 ${esc(o.version)} 版` : ''}` : ''}</p>
      ${o.href ? `<span class="ar-out-go"><a class="tp-link" href="${esc(o.href)}">${esc(o.go)} ›</a>${o.github ? U.visitorHiddenTag('这次提交的链接', GITHUB_WHY, viewer) : ''}</span>`
        : `<span class="tp-small">${o.github ? `已提交 · 访客版不放提交链接（${GITHUB_WHY}）` : o.kind === 'commit' ? '还没发布，没有能打开的地址' : '没有能打开的地址'}</span>`}</li>`).join('');
    const receipt = r.receipt || {};
    const recorded = list(receipt.recorded).map(x => `<li>${F(x.title ?? x.text ?? x, '记下的事')}</li>`).join('');
    const extra = [recorded && `<p class="ar-sub">回执里记下的：</p><ul class="ar-recorded">${recorded}</ul>`,
      receipt.told && `<p class="ar-sub">告诉${you()}的：${F(receipt.told, '回执')}</p>`,
      receipt.href && `<p>${link(receipt.href, '打开业务回执 ›')}</p>`].filter(Boolean).join('');
    const empty = r.status === 'running' ? '还在跑，做完再写。' : r.deferred ? '暂时不修，等下一次检查再看；这一轮没做出要记下的东西。' : r.status === 'incomplete' ? `没做成，这一轮没做出东西${r.reason ? `：${F(r.reason, '原因')}` : ''}。`
      : r.outputCount > 0 ? `做出 ${int(r.outputCount)} 样，后台这一版没列出是哪几样。` : '这一轮没做出要记下的东西。';
    return `${rows ? `<ol class="ar-outs">${rows}</ol>` : `<p class="ar-none">${empty}</p>`}${extra}`;
  }

  // —— 经过：后台给了时间线就照画；没给就用排上、开始、交回和前后两轮拼。没做成的那一段红点 ——
  function timeline(r) {
    let steps = r.timeline;
    if (!steps.length) {
      steps = [];
      const o = r.resumes && other(r.resumes);
      if (o) steps.push({ at: o.startedAt, text: `${T.clock(o.startedAt)} 开始 → 没做成${o.reason ? `：${U.fieldText(o.reason, viewer)}` : ''}`, tone: 'bad', href: o.href });
      if (T.stamp(r.queuedAt) && T.stamp(r.startedAt) && T.stamp(r.startedAt) - T.stamp(r.queuedAt) > 60000) steps.push({ at: r.queuedAt, text: `${T.clock(r.queuedAt)} 排上`, tone: 'info' });
      if (T.stamp(r.startedAt)) steps.push({ at: r.startedAt, text: `${T.clock(r.startedAt)} ${r.resumes ? '接着做' : '开始'}`, tone: 'ok' });
      if (r.status === 'running') steps.push({ at: r.lastAt, text: `正在${U.fieldText(r.activity, viewer).replace(/^正在/, '') || '跑'}`, tone: 'live' });
      if (r.status === 'completed' && T.stamp(r.finishedAt)) steps.push({ at: r.finishedAt, text: `${T.clock(r.finishedAt)} 交回：${U.fieldText(r.summary, viewer) || '跑完了'}`, tone: 'ok' });
      if (r.deferred) steps.push({ at: r.finishedAt || r.lastAt, text: `${T.clock(r.finishedAt || r.lastAt)} 交回：${U.fieldText(r.summary, viewer) || '暂时不修'}`, tone: 'info' });
      else if (r.status === 'incomplete') steps.push({ at: r.finishedAt || r.lastAt, text: `${T.clock(r.finishedAt || r.lastAt)} 没做成${r.reason ? `：${U.fieldText(r.reason, viewer)}` : ''}`, tone: 'bad' });
      const n = r.resumedBy && other(r.resumedBy);
      if (r.resumedBy) steps.push({ at: n?.startedAt, text: `${n ? `${T.clock(n.startedAt)} ` : '后来'}接着做了`, tone: 'ok', href: R.runPath(category, r.resumedBy) });
    }
    if (!steps.length) return '<p class="ar-none">这一轮的经过没记下。</p>';
    return `<ol class="ar-line">${steps.map(s => `<li data-tone="${esc(s.tone)}"><i aria-hidden="true"></i><p>${s.href && s.href !== location.pathname + location.search ? `<a href="${esc(s.href)}">${esc(s.text)} ›</a>` : esc(s.text)}</p></li>`).join('')}</ol>`;
  }

  // —— AI 的思考摘要和最后的回复（点开再展开）、看完整对话：拿这一轮的对话号去读 chats/{id}，和 AI 对话详情页读同一份 ——
  let chat = null, chatWatch = null;
  function watchChat(c) {
    const key = c.available ? c.resource : '';
    if (chatWatch?.key === key) return;
    chatWatch?.sub.stop(); chat = null; chatWatch = null;
    if (key) chatWatch = { key, sub: Live.watch(key, null, { phase(st) { chat = st; if (state) draw(); } }) };
  }
  function conversation(r) {
    const c = r.conversation, d = chat?.data;
    // 访客版对话看不到时分两种：后台写 private 是藏了，照新私事规则写清这里是什么、所以不予展示；not_saved 或没写原因的照旧写没存下来
    const hiddenFromVisitor = !c.available && c.reason === 'private';
    // 被藏的对话照新私事规则写“…仅本人可见”（定稿卡-私事；“这里是……，所以不予展示”是给一大块私事材料用的，不用在对话上）
    const hiddenText = c.why || '这一轮对话的计划、思考摘要和回复仅本人可见';
    const reply = d && (d.latest_reply ?? d.reply);
    const thinking = d && F(d.thinking, '思考摘要'), answer = reply && F(U.chatJoinedReply(reply, viewer), '最后的回复');
    // 计划：和 AI 对话详情页同一份 plan，做完的打勾、正在做的那一步标出来
    const plan = list(d?.plan).map(p => { const s = String(p.status || p.state || ''); return `<li data-step="${/^(completed|done)$/.test(s) ? 'done' : /^(in_progress|running)$/.test(s) ? 'now' : ''}">${F(p.text ?? p.title, '计划')}</li>`; }).join('');
    // 最新活动：对话还在跑时它正在干什么（和 AI 对话详情页读同一个 doing / progress）
    const latest = d && F(d.doing ?? d.progress, '最新活动');
    const body = thinking || answer || plan || latest ? `${plan ? `<p class="ar-sub">计划</p><ol class="ar-plan">${plan}</ol>` : ''}${latest ? `<p class="ar-sub">最新活动</p><p class="ar-pre">${latest}</p>` : ''}${thinking ? `<p class="ar-sub">思考摘要</p><p class="ar-pre">${thinking}</p>` : ''}${answer ? `<p class="ar-sub">最后的回复</p><p class="ar-pre">${answer}</p>` : ''}`
      : `<p class="ar-none">${!c.available ? (hiddenFromVisitor ? esc(hiddenText) : '这一轮的对话没存下来，看上面的回执。') : d ? '这份对话里没有计划、思考摘要和回复。' : chat?.phase === 'none' || chat?.meta?.status >= 400 ? '这一轮的对话没读到。' : '正在读这一轮的对话…'}</p>`;
    // 对话自己的状态和这一轮的结局分开写（约定：对话 state 和业务 status 各自显示）
    const talkState = { running: '对话还在跑', done: '对话已结束', failed: '对话出错停了', unknown: '对话状态不明' }[c.state || d?.state] || '';
    // 本人版：后台标了这份对话对访客藏着（unavailable_reason=private 或给了 hidden_why），在原位挂“访客看不到”；对话照常给
    // 原因照全站“访客看不到”小签带上；后台的原因句可能以“访客看不到：”打头，去掉免得重复
    // M684：后台在 visitor_labels.conversation 标了 hidden 也挂这个签；标 rewritten 的挂第二种签“对外换了说法”
    const labeled = U.visitorFieldKind({ visitor_labels: r.labels }, 'conversation');
    const tag = viewer !== 'owner' ? '' : c.reason === 'private' || c.why || labeled === 'hidden' ? U.visitorHiddenTag('这一轮的对话', c.why.replace(/^访客看不到[：:]\s*/, ''), viewer)
      : labeled === 'rewritten' ? U.visitorRewrittenTag('这一轮的对话', '', viewer) : '';
    const full = c.available ? `<a class="ar-go" href="${esc(c.href)}">看完整对话 <span aria-hidden="true">›</span></a>${tag}`
      : hiddenFromVisitor ? tag : `<p class="ar-none ar-nofull">这一轮没有能打开的完整对话。</p>${tag}`;
    return `<section class="tp-panel ar-card ar-talk"><details class="ar-fold" id="ar-talk"><summary class="live-disclosure"><h2>AI 的思考摘要和最后的回复</h2>${talkState ? `<small class="ar-talkstate">${talkState}</small>` : ''}<span class="ar-open">展开 ›</span><span class="ar-shut">收起 ‹</span></summary>${body}</details>${full}</section>`;
  }

  // —— 右栏：这一类怎么干、这一轮用的提示词、同一类的上一轮 ‹ 下一轮 › ——
  function side(r) {
    const rows = ordered(), at = rows.findIndex(x => x.id === r.id);
    const prevId = r.prev || (at > 0 ? rows[at - 1].id : ''), nextId = r.next || (at >= 0 && at < rows.length - 1 ? rows[at + 1].id : '');
    const step = (rid, text) => rid ? `<a href="${esc(R.runPath(category, rid))}">${text}</a>` : `<span class="ar-off">${text}</span>`;
    const prompt = r.prompt ? `<a href="#ar-prompt" data-prompt>这一轮用的提示词 <i>›</i></a>`
      : `<a href="${esc(T.path('/live/automation/', { type: category }) + `#prompt-${category}`)}">这一类的提示词 <i>›</i></a>`;
    return `<aside class="tp-panel ar-side"><a href="${esc(T.path('/live/automation/', { type: category }) + `#cat-${category}`)}">这一类怎么干 <i>›</i></a>${prompt}
      ${r.subject?.href ? `<a href="${esc(r.subject.href)}">这件修理的全部几轮 <i>›</i></a>` : ''}
      <p class="ar-steps">${step(prevId, '同一类的上一轮 <i>‹</i>')}${step(nextId, '下一轮 <i>›</i>')}</p></aside>`;
  }

  function draw() {
    const backLink = document.querySelector('[data-back]');
    viewer = T.viewerOf(state);
    if (backLink && category && !fromReferrer) { backLink.textContent = listLabel || U.fieldText(name(), viewer); backLink.href = back; }
    // 快讯条照自动任务页：用每一轮的列表排开始、跑完、停了（摘一句不放）。后台的 feed 只留最近 30 条，常常全是摘一句，滤完就空了（M672）
    page.tick.set(R.ticker(board?.data, others?.rows?.length ? others.rows : siblings?.rows || null, viewer), { off: !!board?.offline });
    const d = state?.data;
    if (!category || !id) { T.paint(page.root, '<p class="tp-placeholder" role="status">网址里没写是哪一轮。</p>'); return; }
    if (!d) { T.paint(page.root, T.placeholder(state, '这一轮')); return; }
    const r = R.detail(d, viewer);
    const program = r.who?.program;
    watchChat(program ? {} : r.conversation);
    T.paint(page.root, `<div class="ar-head"><h1>${title(r)}</h1><p class="ar-tags">${tags(r)}</p></div>${T.stateNote(state)}
      <div class="ar-grid"><div class="ar-main">
        <section class="tp-panel ar-card"><h2>为什么开这一轮</h2>${why(r)}</section>
        <section class="tp-panel ar-card"><h2>这一轮做成了什么</h2>${outputs(r)}</section>
        <section class="tp-panel ar-card"><h2>经过</h2>${timeline(r)}</section>
        ${program ? '' : conversation(r)}
        ${r.prompt ? `<section class="tp-panel ar-card"><details class="ar-fold" id="ar-prompt"><summary class="live-disclosure"><h2>这一轮用的提示词</h2><span class="ar-open">展开 ›</span><span class="ar-shut">收起 ‹</span></summary><pre class="ar-prompt">${F(r.prompt, '提示词')}</pre></details></section>` : ''}
      </div>${side(r)}</div>`);
  }

  setInterval(() => {
    for (const el of document.querySelectorAll('[data-ran]')) el.textContent = span((Date.now() - Number(el.dataset.ran)) / 60000);
  }, 1000);

  let page;
  page = T.boot({ resource: `automation/runs/${encodeURIComponent(category || '_')}/${encodeURIComponent(id || '_')}`, back,
    ask: () => `请看实况自动任务里这一轮（${name()}）：为什么开、做成了什么、哪里没做成、要不要我出面。先用大白话说，别动手。`,
    onState(next) { state = next; draw(); } });
  // 从实况首页、等你的事、账本、AI 对话、智能体点进来的，返回回那一页（首页落回那张卡）；别的照旧回这一类（live-runs.js 的来回的路）
  fromReferrer = !!window.LiveRuns?.backToReferrer(document.querySelector('[data-back]'));
  if (category) Live.watch('automation/runs', { category }, { phase(st) { siblings = R.page(st.data, viewer); if (state) draw(); } });
  // 全部几类（不含摘一句）一次读：数据约定写了列表可带 exclude=excerpt。后台还不认这个参数（回 4xx）时停掉这一份，快讯条退回只排这一类
  let allRuns = null;
  allRuns = Live.watch('automation/runs', { exclude: 'excerpt' }, { phase(st) {
    const status = st.meta?.status;
    if (status >= 400 && status < 500) { setTimeout(() => allRuns?.stop()); others = null; }
    else others = R.page(st.data, viewer);
    if (state) draw();
  } });
  Live.watch('automation', {}, { phase(st) { board = st; if (state) draw(); } });
  page.root.addEventListener('click', e => {
    const prompt = e.target.closest('[data-prompt]');
    if (prompt) { e.preventDefault(); T.reveal('ar-prompt'); }
  });
})();
