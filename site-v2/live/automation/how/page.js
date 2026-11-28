// 实况 · 自动任务 · 这一类怎么干：照成品图 05-怎么干-每周规矩复核（主控 01:29 定单做一页；本人 11-24 13:00：“怎么干”是看机制，不介绍最近几次）。
// 什么时候开始、一轮怎么走、交给 AI 的话（原文收着，点开正常字号）、为什么这样设计、坏了会怎样、关了会怎样、花多少时间、结果去哪；右栏去这一类的页、自动任务、账本。
// 办法的解释、排期、时限、型号、开关和提示词都从 automation 读。
(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  const R = window.AutomationRuns, IDS = R.CATS;
  const id = IDS.includes(params.get('type')) ? params.get('type') : null;
  if (!id) { location.replace('/live/automation/'); return; }
  const T = window.LiveTape, U = window.LiveUI, { esc } = U;
  const { list } = T;
  const repair = id === 'auto-repair';
  const category = d => list(d?.categories).find(x => x.id === id);
  const promptNames = { website: '网站交接', projects: '仓库清理' };
  let state, viewer = 'public', landed = false;
  // 访客版称呼：画之前把指本人的“你”换成“本人”（runs.js 的 asOwner；私事线 11-26）
  const paint = (root, html) => T.paint(root, R.asOwner(html, viewer));
  const F = (v, name) => T.field(v, viewer, name);
  const cn = v => id === 'message-review' ? R.catName(id, viewer)
    : viewer === 'owner' || typeof v !== 'string' ? v : v.replace(/^替你/, '替本人');
  const pausedText = v => {
    const t = typeof v === 'number' ? v * 1000 : T.stamp(v);
    if (!Number.isFinite(t)) return '暂停中';
    const at = new Date(t).toISOString(), d = new Date(t + 8 * 3600000);
    return T.dayKey(at) === T.dayKey(new Date().toISOString()) ? `暂停到今天 ${T.clock(at)}` : `暂停到 ${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日 ${T.clock(at)}`;
  };
  const card = (title, body, extra = '') => `<section class="tp-panel ah-card"${extra}><h2>${title}</h2>${body}</section>`;
  function timing(policy) {
    const p = policy || {}, duration = T.duration;
    if (id === 'auto-repair' && [p.ai_timeout_seconds, p.idle_seconds, p.daily_ai_seconds, p.workspace_lookback_seconds].every(T.known)) {
      // construction_window_seconds 是“有没有人在修”看多久内的施工动静，后台给了才写
      const busy = T.known(p.construction_window_seconds) ? `看有没有人在修时，查最近 ${duration(p.construction_window_seconds)}有没有施工动静；` : '';
      return `一轮最多 ${duration(p.ai_timeout_seconds)}，${duration(p.idle_seconds)}没动静就停。${busy}开工后把最近 ${duration(p.workspace_lookback_seconds)}的对话和提交交给 AI 参考。每天和“AI 约好的事”合用 ${duration(p.daily_ai_seconds)} AI 时间。`;
    }
    if (id === 'ai-commitments' && T.known(p.daily_ai_seconds)) {
      return `每天和自动修理合用 ${duration(p.daily_ai_seconds)} AI 时间。`;
    }
    // reply_wait_seconds 是 AI 回复的手机通知最多等摘要多久（从回复结束算），后台给了才写
    if (id === 'excerpt' && T.known(p.ai_timeout_seconds)) {
      const reply = T.known(p.reply_wait_seconds) ? `AI 回复的手机通知，最多等摘要到回复结束后 ${duration(p.reply_wait_seconds)}；` : '';
      return `${reply}每次叫 AI 摘最多等 ${duration(p.ai_timeout_seconds)}。`;
    }
    if (T.known(p.ai_timeout_seconds)) return `一次最多等 AI ${duration(p.ai_timeout_seconds)}。`;
    return '这一类最多跑多久，这次没读到。';
  }
  function failurePolicy(p = {}) {
    if (id === 'auto-repair') {
      const {repair_limit, urgent_wait_seconds, normal_wait_seconds} = p;
      if (![repair_limit, urgent_wait_seconds, normal_wait_seconds].every(T.known)) {
        return '同一件最多修几轮、排队多久算没人接手，这次没读到。';
      }
      return `同一件最多派 AI 修 ${repair_limit} 轮。只有要本人花钱、删只有一份的数据、亲手做或登录、补只有他知道的、做取舍的，才转给本人。同一处修好后又坏，照常交 AI 修，修的时候写明这是第几次坏、之前怎么修的，查为什么修不住。急件 ${T.duration(urgent_wait_seconds)}、普通件 ${T.duration(normal_wait_seconds)}还没人接手，会登记一件“有故障排队超过接手时限”。`;
    }
    if (id === 'ai-commitments') return T.known(p.check_limit)
      ? `同一件约定最多复看 ${p.check_limit} 次。` : '同一件最多复看几次，这次没读到。';
    return '';
  }
  function draw() {
    const d = state?.data;
    viewer = T.viewerOf(state);
    const c = category(d), g = c?.how_to;
    if (!d || !g) { T.paint(page.root, !d ? T.placeholder(state, '这一类怎么干') : '<p class="tp-placeholder">这一类没读到。</p>'); return; }
    const name = F(cn(c.title || g.title), '类别'), m = c.setting?.mode;
    document.title = `${U.fieldText(cn(c.title || g.title), viewer)}怎么干 · 自动任务 · 实况`;
    const model = [c.model, c.model_effort].filter(Boolean).map(esc).join(' · ');
    const pill = m === 'on' ? ['on', '开着'] : m === 'off' ? ['off', '关着，不用排时间'] : m === 'paused' ? ['paused', pausedText(c.setting?.until_at)] : ['', '开没开这次没读到'];
    // 关着的类没有开工时间，不写“这次没读到”
    const schedule = c.schedule_text ? F(c.schedule_text, '开工条件') : m === 'off' ? '' : '几点跑、什么情况下跑，这次没读到。';
    const interval = T.duration(d.dispatch?.interval_seconds);
    const dispatchNote = id === 'auto-repair' || id === 'message-review'
      ? (interval ? `派活程序每 ${interval}查一次。` : '派活程序多久查一次，这次没读到。') : '';
    // 关着的类：“关着”只在页头那个标签说一次；下面几格说各自的事，平时怎么开工写成“打开后……”，不再每格重复关着（看图 11-27：页头说关着，下面却像在跑；复看：一页说了三次关着）
    const off = m === 'off', base = [dispatchNote, g.trigger].filter(Boolean).join(' ');
    const start = off ? g.offStart || (base ? `打开后，${base}` : '') : base || g.offStart || '';
    const steps = list(g.steps);
    // “15–20 句”这种区间整块不折行（看图 14：第一步标题在横线后断开）；标题包成一个块，绿底是弹性排布，不包会拆成几块、伸出卡外
    const keepRange = html => html.replace(/\d+[–-]\d+\s*[句次轮天件]?/g, m => `<span class="ah-keep">${m}</span>`);
    const stepWords = /认清|哪一处|检查|有没有|人在修|急缓|开工|交给 AI|副本|验过|再合|原件|结果|修理|上限|还没好|反复/g;
    const flow = `<ol class="ah-flow${repair ? ' ah-flow--words' : ''}" style="--n:${Math.min(steps.length, 4)}">${steps.map(([title, text], i) => {
      const caption = keepRange(esc(title)).replace(repair ? stepWords : /急缓/g, '<span class="ah-keep">$&</span>');
      const body = repair && i === 1 ? esc(text).replace(/下一轮/g, '<span class="ah-keep">$&</span>') : esc(text);
      return `<li><p class="ah-flow__box"><span>${i + 1}</span><span class="ah-flow__title">${caption}</span></p><p class="ah-flow__text">${body}</p></li>`;
    }).join('')}</ol>`;
    const promptIntro = `${off ? '打开后，派活程序每一轮会把' : '派活程序每一轮把'}下面这段固定的话交给 AI，再附上这一轮要办的那件事和材料。`;
    const words = (id, title, text) => `<details class="ah-prompt" id="${id}" data-fold-anchor><summary>${title}</summary><pre>${R.original(esc(text))}</pre></details>`;
    const prompt = c.prompt_template ? `<p>${promptIntro}</p>
        ${words('prompt', '看交给 AI 的原话', c.prompt_template)}`
      : '<p>交给 AI 的那段固定的话这次没读到，下一轮会自动再读。</p>';
    const specifics = list(c.prompt_sections).filter(s => promptNames[s.id] && s.text)
      .map(s => words(`prompt-${s.id}`, promptNames[s.id], s.text)).join('');
    const why = list(g.why).map(([q, a]) => `<p><b>${esc(q)}</b>${esc(a)}</p>`).join('');
    const failure = esc([failurePolicy(c.execution_policy || {}), g.failure].filter(Boolean).join(' '));
    const duration = timing(c.execution_policy);
    const cost = id === 'weekly-laptop' ? `<p>${esc(duration)}</p><p>${esc(g.cost)}</p>`
      : `<p>${esc(g.costFull ? g.cost : `${duration} ${g.cost}`)}</p>`;
    paint(page.root, `<nav class="ak-crumb" aria-label="当前位置"><a href="/live/">实况</a><a href="/live/automation/">自动任务</a><a href="${esc(T.path('/live/automation/category/', { type: id }))}">${name}</a><strong aria-current="page">怎么干</strong></nav>
      <div class="ah-head"><div><h1>${name}怎么干</h1><p>${esc(g.short || '')}${g.short ? '。' : ''}${schedule}</p></div>
        <p class="ah-pills">${model ? `<span class="ah-pill">${model}</span>` : ''}<span class="ah-pill" data-mode="${pill[0]}">${esc(pill[1])}</span></p></div>
      <div class="ah-grid"><div class="ah-main">
        ${card('什么时候开始', `<p>${esc(start)}</p>`)}
        ${steps.length ? card(off ? '打开后一轮这样走' : '一轮怎么走', flow) : ''}
        ${card('交给 AI 的话', prompt + specifics, ' id="words"')}
        ${why ? card('为什么这样设计', `<div class="ah-why">${why}</div>`) : ''}
        ${g.failure ? card('坏了会怎样', `<p>${failure}</p>`) : ''}
        ${g.off ? card('关了会怎样', `<p>${esc(g.off)}${/[。！？]$/.test(g.off) ? '' : '。'}</p>`) : ''}
        ${g.cost ? card('花多少时间', cost) : ''}
        ${g.result ? card('结果去哪', `<p>${esc(g.result)}</p>`) : ''}
      </div><aside class="tp-panel ah-side"><a href="${esc(T.path('/live/automation/category/', { type: id }))}">这一类的页 <i>›</i></a><a href="/live/automation/">自动任务 <i>›</i></a><a href="/live/ledger/">AI 自动任务账本 <i>›</i></a></aside></div>
      <p class="ah-foot">用谁：${esc(g.who || '')}${model ? `${off ? '打开后用' : '现在是'} ${model}，换代跟着模型清单走。` : ''}</p>`);
    if (!landed) { landed = true; if (location.hash) T.reveal(location.hash.slice(1)); }
  }
  let queued = 0;
  const page = T.boot({ resource: 'automation', back: '/live/automation/',
    ask: () => `请看实况自动任务里“${category(state?.data)?.how_to?.title || id}”这一类怎么干：什么时候开始、一轮怎么走、坏了或关了会怎样。先用大白话说，别动手。`,
    onState(next) { state = next; if (!queued) queued = requestAnimationFrame(() => { queued = 0; draw(); page.tick.set(R.ticker(state?.data, null, viewer), { off: state?.offline }); }); } });
})();
