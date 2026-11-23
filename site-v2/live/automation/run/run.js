// 实况 · 自动任务 · 一轮的详情（本人 11-24 01:36 看过样子图 02-一轮的详情）。
// 网址 /live/automation/run/?type=<类>&run=<轮号>。读 automation/runs/<类>/<轮号>（这一轮），
// 另读这一类的列表找上一轮、下一轮和接着做的那一轮，读 automation 拿快讯条和类名。取数转换在 ../runs.js。
(() => {
  'use strict';
  const T = window.LiveTape, U = window.LiveUI, Live = window.Live, G = window.LiveAutomationGuide || {}, R = window.AutomationRuns, { esc } = U;
  const { list, known, int, link, when } = T;
  const params = new URLSearchParams(location.search);
  const category = R.CATS.includes(params.get('type')) ? params.get('type') : '', id = params.get('run') || '';
  const back = T.path('/live/automation/', { category });
  let state, viewer = 'public', board = null, siblings = null, fromReferrer = false;
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
  function title(r) {
    const lead = r.subject ? `${F(r.subject.title, '这件活')} · 第 ${int(r.subject.round ?? 1)} 轮` : '';
    const tail = r.status === 'incomplete' ? `没做成：${F(r.reason, '原因') || '原因没记下'}` : r.status === 'running' ? (r.subject ? '' : F(r.summary, '这一轮') || '正在跑')
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
    if (r.subject) parts.push(`修的是“${F(r.subject.title, '这件活')}”，这是第 ${int(r.subject.round ?? 1)} 轮。`);
    if (r.resumes) {
      const o = other(r.resumes);
      parts.push(o ? `${esc(when(o.startedAt))} 那一轮${o.reason ? `因为${F(o.reason, '原因')}` : ''}没做成，这一轮接着做。` : '前一轮没做成，这一轮接着做。');
    }
    const how = G[category]?.trigger;
    return `<p>${parts.join('') || '后台没写为什么开这一轮。'}</p>${how ? `<p class="tp-small">这一类什么时候开：${esc(how)}</p>` : ''}`;
  }

  // —— 这一轮做成了什么：每件右边“去那张卡 ›”“去账本那件 ›” ——
  function outputs(r) {
    const rows = r.outputs.map((o, i) => `<li><span class="ar-num">${i + 1}</span><p><b>${F(o.title, '做成的东西') || esc(o.where)}</b>${o.action || o.where ? ` <span class="ar-arrow">→</span> ${esc(o.action)}${o.where && o.title ? esc(o.where) : ''}${o.version ? ` 第 ${esc(o.version)} 版` : ''}` : ''}</p>
      ${o.href ? `<a class="tp-link" href="${esc(o.href)}">${esc(o.go)} ›</a>` : `<span class="tp-small">${o.kind === 'commit' ? '还没发布，没有能打开的地址' : '没有能打开的地址'}</span>`}</li>`).join('');
    const receipt = r.receipt || {};
    const recorded = list(receipt.recorded).map(x => `<li>${F(x.title ?? x.text ?? x, '记下的事')}</li>`).join('');
    const extra = [recorded && `<p class="ar-sub">回执里记下的：</p><ul class="ar-recorded">${recorded}</ul>`,
      receipt.told && `<p class="ar-sub">告诉${you()}的：${F(receipt.told, '回执')}</p>`,
      receipt.href && `<p>${link(receipt.href, '打开业务回执 ›')}</p>`].filter(Boolean).join('');
    const empty = r.status === 'running' ? '还在跑，做完再写。' : r.status === 'incomplete' ? `没做成，这一轮没做出东西${r.reason ? `：${F(r.reason, '原因')}` : ''}。`
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
      if (r.status === 'incomplete') steps.push({ at: r.finishedAt || r.lastAt, text: `${T.clock(r.finishedAt || r.lastAt)} 没做成${r.reason ? `：${U.fieldText(r.reason, viewer)}` : ''}`, tone: 'bad' });
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
    const reply = d && (d.latest_reply ?? d.reply);
    const thinking = d && F(d.thinking, '思考摘要'), answer = reply && F(U.chatJoinedReply(reply, viewer), '最后的回复');
    // 计划：和 AI 对话详情页同一份 plan，做完的打勾、正在做的那一步标出来
    const plan = list(d?.plan).map(p => { const s = String(p.status || p.state || ''); return `<li data-step="${/^(completed|done)$/.test(s) ? 'done' : /^(in_progress|running)$/.test(s) ? 'now' : ''}">${F(p.text ?? p.title, '计划')}</li>`; }).join('');
    // 最新活动：对话还在跑时它正在干什么（和 AI 对话详情页读同一个 doing / progress）
    const latest = d && F(d.doing ?? d.progress, '最新活动');
    const body = thinking || answer || plan || latest ? `${plan ? `<p class="ar-sub">计划</p><ol class="ar-plan">${plan}</ol>` : ''}${latest ? `<p class="ar-sub">最新活动</p><p class="ar-pre">${latest}</p>` : ''}${thinking ? `<p class="ar-sub">思考摘要</p><p class="ar-pre">${thinking}</p>` : ''}${answer ? `<p class="ar-sub">最后的回复</p><p class="ar-pre">${answer}</p>` : ''}`
      : `<p class="ar-none">${!c.available ? '这一轮的对话没存下来，看上面的回执。' : d ? '这份对话里没有计划、思考摘要和回复。' : chat?.phase === 'none' || chat?.meta?.status >= 400 ? '这一轮的对话没读到。' : '正在读这一轮的对话…'}</p>`;
    // 对话自己的状态和这一轮的结局分开写（约定：对话 state 和业务 status 各自显示）
    const talkState = { running: '对话还在跑', done: '对话已结束', failed: '对话出错停了', unknown: '对话状态不明' }[c.state || d?.state] || '';
    const full = c.available ? `<a class="ar-go" href="${esc(c.href)}">看完整对话 <span aria-hidden="true">›</span></a>` : '<p class="ar-none ar-nofull">这一轮没有能打开的完整对话。</p>';
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
    if (backLink && category && !fromReferrer) { backLink.textContent = U.fieldText(name(), viewer); backLink.href = back; }
    page.tick.set(R.ticker(board?.data, null, viewer), { off: !!board?.offline });
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
  Live.watch('automation', {}, { phase(st) { board = st; if (state) draw(); } });
  page.root.addEventListener('click', e => {
    const prompt = e.target.closest('[data-prompt]');
    if (prompt) { e.preventDefault(); T.reveal('ar-prompt'); }
  });
})();
