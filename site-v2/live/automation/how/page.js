// 实况 · 自动任务 · 这一类怎么干：照成品图 05-怎么干-每周规矩复核（主控 01:29 定单做一页；本人 11-24 13:00：“怎么干”是看机制，不介绍最近几次）。
// 什么时候开始、一轮怎么走、交给 AI 的话（原文收着，点开正常字号）、为什么这样设计、坏了会怎样、关了会怎样、花多少时间、结果去哪；右栏去这一类的页、自动任务、账本。
// 机制的字在 ../mechanisms.js（各类一份），型号档位、开没开、交给 AI 的原文从 automation 读。网址 /live/automation/how/?type=<类>（#prompt 落在交给 AI 的话）。
(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const IDS = ['auto-repair', 'message-review', 'translator', 'weekly-rules', 'weekly-live', 'excerpt', 'ai-commitments'];
  const id = IDS.includes(params.get('type')) ? params.get('type') : null;
  if (!id) { location.replace('/live/automation/'); return; }
  const T = window.LiveTape, U = window.LiveUI, G = window.LiveAutomationGuide || {}, R = window.AutomationRuns, { esc } = U;
  const { list } = T;
  const g = G[id] || {};
  let state, viewer = 'public', landed = false;
  // 访客版称呼：画之前把指本人的“你”换成“本人”（runs.js 的 asOwner；私事线 11-26）
  const paint = (root, html) => T.paint(root, R.asOwner(html, viewer));
  const F = (v, name) => T.field(v, viewer, name);
  const cn = v => viewer === 'owner' || typeof v !== 'string' ? v : v.replace(/^替你/, '替本人');
  const pausedText = v => {
    const t = typeof v === 'number' ? v * 1000 : T.stamp(v);
    if (!Number.isFinite(t)) return '暂停中';
    const at = new Date(t).toISOString(), d = new Date(t + 8 * 3600000);
    return T.dayKey(at) === T.dayKey(new Date().toISOString()) ? `暂停到今天 ${T.clock(at)}` : `暂停到 ${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日 ${T.clock(at)}`;
  };
  const card = (title, body, extra = '') => `<section class="tp-panel ah-card"${extra}><h2>${title}</h2>${body}</section>`;
  function draw() {
    const d = state?.data;
    viewer = T.viewerOf(state);
    const c = list(d?.categories).find(x => x.id === id);
    if (!d || !c) { T.paint(page.root, !d ? T.placeholder(state, '这一类怎么干') : '<p class="tp-placeholder">这一类没读到。</p>'); return; }
    const name = F(cn(c.title || g.title), '类别'), m = c.setting?.mode;
    document.title = `${U.fieldText(cn(c.title || g.title), viewer)}怎么干 · 自动任务 · 实况`;
    const model = [c.model, c.model_effort].filter(Boolean).map(esc).join(' · ');
    const pill = m === 'on' ? ['on', '开着'] : m === 'off' ? ['off', '关着'] : m === 'paused' ? ['paused', pausedText(c.setting?.until_at)] : ['', '没读到开没开'];
    const steps = list(g.steps);
    const flow = `<ol class="ah-flow" style="--n:${Math.min(steps.length, 4)}">${steps.map(([title, text], i) => `<li><p class="ah-flow__box"><span>${i + 1}</span>${esc(title)}</p><p class="ah-flow__text">${i + 1}. ${esc(text)}</p></li>`).join('')}</ol>`;
    const prompt = c.prompt_template ? `<p>派活程序每一轮把下面这段固定的话交给 AI，再附上这一轮要办的那件事和材料。</p>
        <details class="ah-prompt" id="prompt"><summary>看交给 AI 的原话</summary><pre>${F(c.prompt_template, '交给 AI 的话')}</pre></details>`
      : '<p>这一类没有固定的一段话：每轮按收到的那件事现写。</p>';
    const why = list(g.why).map(([q, a]) => `<p><b>${esc(q)}</b>${esc(a)}</p>`).join('');
    paint(page.root, `<nav class="ak-crumb" aria-label="当前位置"><a href="/live/">实况</a><a href="/live/automation/">自动任务</a><a href="${esc(T.path('/live/automation/category/', { type: id }))}">${name}</a><strong aria-current="page">怎么干</strong></nav>
      <div class="ah-head"><div><h1>${name}怎么干</h1><p>${esc(g.short || '')}${g.short ? '。' : ''}${esc(g.when || '')}</p></div>
        <p class="ah-pills">${model ? `<span class="ah-pill">${model}</span>` : ''}<span class="ah-pill" data-mode="${pill[0]}">${esc(pill[1])}</span></p></div>
      <div class="ah-grid"><div class="ah-main">
        ${card('什么时候开始', `<p>${esc(g.trigger || '')}</p>`)}
        ${steps.length ? card('一轮怎么走', flow) : ''}
        ${card('交给 AI 的话', prompt, ' id="words"')}
        ${why ? card('为什么这样设计', `<div class="ah-why">${why}</div>`) : ''}
        ${g.failure ? card('坏了会怎样', `<p>${esc(g.failure)}</p>`) : ''}
        ${g.off ? card('关了会怎样', `<p>${esc(g.off)}${/[。！？]$/.test(g.off) ? '' : '。'}</p>`) : ''}
        ${g.cost ? card('花多少时间', `<p>${esc(g.cost)}</p>`) : ''}
        ${g.result ? card('结果去哪', `<p>${esc(g.result)}</p>`) : ''}
      </div><aside class="tp-panel ah-side"><a href="${esc(T.path('/live/automation/category/', { type: id }))}">这一类的页 <i>›</i></a><a href="/live/automation/">自动任务 <i>›</i></a><a href="/live/ledger/">AI 自动任务账本 <i>›</i></a></aside></div>
      <p class="ah-foot">用谁：${esc(g.who || '')}${model ? `现在是 ${model}，换代跟着模型清单走。` : ''}</p>`);
    if (!landed) { landed = true; if (location.hash) T.reveal(location.hash.slice(1)); }
  }
  let queued = 0;
  const page = T.boot({ resource: 'automation', back: '/live/automation/',
    ask: () => `请看实况自动任务里“${g.title || id}”这一类怎么干：什么时候开始、一轮怎么走、坏了或关了会怎样。先用大白话说，别动手。`,
    onState(next) { state = next; if (!queued) queued = requestAnimationFrame(() => { queued = 0; draw(); page.tick.set(R.ticker(state?.data, null, viewer), { off: state?.offline }); }); } });
})();
