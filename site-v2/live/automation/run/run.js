// 实况 · 自动任务 · 一轮的页，照“一轮的页-v1”（本人 11-26 AUTOPAGES1126 选 A）：标题一句结局、一排小标签、三格、
// “这一轮的对话”摆成聊天记录（派活程序、AI、帮手一条条说），右栏这一轮在办、这一类、上一轮和下一轮。
// 对话和顶层对话页读同一份 chats/{id}、用同一份显示逻辑（_lib/live-chat-view.js），内容一样全，只是摆法不同（本人 11-26：机制共通，不能砍）。
// 网址 /live/automation/run/?type=<类>&run=<轮号>。读 automation/runs/<类>/<轮号>（这一轮），
// 另读这一类的列表找上一轮、下一轮和接着做的那一轮，读 automation 拿快讯条和类名。取数转换在 ../runs.js。
(() => {
  'use strict';
  const T = window.LiveTape, U = window.LiveUI, Live = window.Live, G = window.LiveAutomationGuide || {}, R = window.AutomationRuns, { esc } = U;
  const { list, known, int, link, when } = T;
  const params = new URLSearchParams(location.search);
  // 已撤的类（笔记本每周巡检）近 72 小时的旧轮照样列在自动任务页上，点进来也要认：名字表里有的类都认，不只认现役几类
  const category = Object.hasOwn(R.NAMES, params.get('type') || '') ? params.get('type') : '', id = params.get('run') || '';
  // 已撤的类在自动任务页上没有“怎么干”那一节和它的提示词，指向那两处的链接不出
  const retired = !!category && !R.CATS.includes(category);
  // 从自动任务页点进来的，返回回进来时那个网址，三家、状态这些筛选原样留着（验收 11-24 06:40）；
  // 那一页没筛这一类时，返回链接写“自动任务”，不写这一类的名字
  const fromList = (() => {
    try { const u = new URL(document.referrer); return u.origin === location.origin && u.pathname === '/live/automation/' ? u : null; } catch { return null; }
  })();
  const back = fromList ? fromList.pathname + fromList.search + fromList.hash : T.path('/live/automation/', { category });
  const listLabel = fromList && fromList.searchParams.get('category') !== category ? '自动任务' : '';
  let state, viewer = 'public', board = null, siblings = null, others = null, fromReferrer = false;
  // 访客版称呼：画之前把指本人的“你”换成“本人”（runs.js 的 asOwner；私事线 11-26）
  const paint = (root, html) => T.paint(root, R.asOwner(html, viewer));
  const F = (v, name) => T.field(v, viewer, name);
  // 两处字一样不一样：去掉首尾空白、多余空格和句末句号再比（相邻或上下级的两处字一样只显示一次，主控 11-26 10:02）
  const said = v => U.fieldText(v ?? '', viewer).trim().replace(/\s+/g, ' ').replace(/[。.]$/, '');
  const sameText = (a, b) => !!said(a) && said(a) === said(b);
  const you = () => T.you(viewer);
  const name = () => R.catName(category, viewer, list(board?.data?.categories).find(c => c.id === category)?.title);

  // —— 页头：大标题写这轮的结果，下面一排标签 ——
  // 不是今天的写上星期几（按北京日期，图上“11-25 周三 06:42–07:01”）
  const week = at => { const t = T.stamp(at); return t == null ? '' : `周${'日一二三四五六'[new Date(t + 8 * 3600000).getUTCDay()]}`; };
  const whenDay = at => T.dayKey(at) === T.dayKey(new Date().toISOString()) ? T.clock(at) : `${T.day(at)} ${week(at)} ${T.clock(at)}`;
  const clockRange = r => {
    const a = r.queuedAt || r.startedAt, b = r.finishedAt;
    if (!T.stamp(a)) return '';
    if (T.stamp(b)) return `${whenDay(a)}–${T.dayKey(a) === T.dayKey(b) ? T.clock(b) : whenDay(b)}`;
    // 不是正在跑、又没有结束时刻和用时（没有收尾回执）：照实写没记到结束，不写用时
    return r.status !== 'running' && r.minutes == null ? `${whenDay(a)} 排上 · 没记到结束` : `${whenDay(a)} 排上`;
  };
  // 日期连着时刻一起换行，短括号也作为一组。只包文字，不改标签里的属性。
  const keepDates = html => html.split(/(<[^>]*>)/).map((p, i) => i % 2 ? p : p.replace(/（[^（）\n]{1,10}）|(?<![\d-])(?:\d{4}-)?\d{1,2}-\d{1,2}(?![\d-])(?:[ \t]+(?:周[一二三四五六日][ \t]+)?\d{1,2}:\d{2}(?::\d{2})?)?|\d{1,2}[ \t]*月[ \t]*\d{1,2}[ \t]*日[ \t]*(?:北京时间[ \t]*)?\d{1,2}:\d{2}(?::\d{2})?|(?<![\d:])\d{1,2}:\d{2}(?::\d{2})?(?![\d:])/g, '<span class="live-unit">$&</span>')).join('');
  // 标题后面的签不单独掉到下一行：和标题最后两个字（或最后那个日期时刻）连在一起换行
  const withTag = (html, tag) => !tag ? html : /<span class="live-unit">[^<]*<\/span>$/.test(html) ? html.replace(/(<span class="live-unit">[^<]*<\/span>)$/, `<span class="ar-tail">$1${tag}</span>`)
    : /(?:&[#\w]+;|[^<>&\s]){1,2}$/.test(html) ? html.replace(/((?:&[#\w]+;|[^<>&\s]){1,2})$/, `<span class="ar-tail">$1${tag}</span>`) : html + tag;
  const span = m => !known(m) ? '' : m < 1 ? `${Math.max(1, Math.round(m * 60))} 秒` : m < 60 ? `${Math.round(m)} 分钟` : `${Math.floor(m / 60)} 小时 ${Math.round(m % 60)} 分`;
  const nth = r => known(r.subject?.round) && r.subject.round > 0 ? r.subject.round : null;
  // 回执里“这次带入：……读到……”那串明细（receipt.scan）不进大标题和结论，挪到对话卡头（主控 11-26）
  const SCAN = /这次带入[:：][\s\S]*$/;
  const scanOf = r => plainOf(r.receipt?.scan) || (plainOf(r.summary).match(SCAN)?.[0] ?? '');
  const withoutScan = (html, r) => {
    const s = esc(scanOf(r)), cut = s && html.includes(s) ? html.replace(s, '') : html.replace(SCAN, '');
    return cut.replace(/[，,；;、\s]+$/, '').trim();
  };
  // 大标题只留第一句；后面的话照旧在派活程序“收到结论”里，不丢。引号、括号里的句号不算（“给「……通知。」补了进展”）；带访客标记（HTML）的整段不切
  const firstSentence = html => {
    if (/</.test(html)) return html;
    let depth = 0;
    for (let i = 0; i < html.length - 1; i++) {
      const ch = html[i];
      if ('「『“（('.includes(ch)) depth++;
      else if ('」』”）)'.includes(ch)) depth = Math.max(0, depth - 1);
      else if (!depth && '。！？'.includes(ch)) return html.slice(0, ch === '。' ? i : i + 1);
    }
    return html.replace(/。$/, '');
  };
  // 后台的 headline 是一句结局时拿来当大标题；现在后台给的还是“名字 · summary”，和长标题一样，就退回长标题（主控 11-26 02:30）
  function ownHeadline(r) {
    const h = plainOf(r.headline), s = plainOf(r.summary);
    if (!h) return '';
    const names = [r.subject ? plainOf(r.subject.title) : '', plainOf(name()), R.NAMES[category] || ''].filter(Boolean);
    if (names.some(n => h === n || h.startsWith(`${n} · `)) || (s && norm(h).endsWith(norm(s)))) return '';
    return F(r.headline, '这一轮的结局');
  }
  function title(r) {
    const own = ownHeadline(r);
    if (own) return own;
    // 第几轮只用后台给的 subject.round；没给就不写（和列表对得上，验收 11-24 07:15）
    // 这件活的名字写在前半，后台 summary 里又带着它的就去掉，同一句不写两遍（前端 QA 11-25）
    const thing = r.subject ? F(r.subject.title, '这件活') : '';
    const lead = r.subject ? `${thing}${nth(r) ? ` · 第 ${int(nth(r))} 轮` : ''}` : '';
    // 暂缓的轮次标题一律短（“这件活 · 第 N 轮 · 暂时不修”），说明写在“这一轮做成了什么”（主控 11-25）；没有这件活的名字时用这一类的名字打头
    const tail = r.deferred ? (lead ? '暂时不修' : `${esc(name())} · 暂时不修`) : r.status === 'incomplete' ? `没做成：${F(r.reason, '原因') || '原因没记下'}` : r.status === 'running' ? (r.subject ? '' : F(r.summary, '这一轮') || '正在跑')
      : firstSentence(withoutScan(R.withoutSubject(F(r.summary, '这一轮做了什么'), thing), r)) || '跑完了';
    // 暂缓、没做成的后半自己带着“暂时不修：”“没做成：”，前后用“ · ”接，免得一句里两个冒号（主控 11-25）
    return lead && tail ? `${lead}${r.deferred || r.status === 'incomplete' ? ' · ' : '：'}${tail}` : lead || tail;
  }
  // 标题后半写的是哪一个字段，访客那边换了说法（或看不到）就在标题后挂全站同一个签；暂缓、在跑又有这件活名字的后半不取后台字段，不挂。
  // 后台的 headline 自成一句、拿来当了大标题时，看 headline 那个键
  // summary 的签说的是整段换了说法；标题只留了第一句时，换掉的可能在后半句，签挂到写全这段的“收到结论”上（主控 11-26 11:02，331 轮）
  function titleTag(r) {
    const key = ownHeadline(r) ? 'headline' : r.deferred ? '' : r.status === 'incomplete' ? 'reason' : r.status === 'running' && r.subject ? '' : 'summary';
    if (key === 'summary') {
      const whole = withoutScan(R.withoutSubject(F(r.summary, '这一轮做了什么'), r.subject ? F(r.subject.title, '这件活') : ''), r);
      if (whole && firstSentence(whole) !== whole.replace(/。$/, '')) return '';
    }
    return key ? U.visitorLabel({ visitor_labels: r.labels }, key, '这一轮的说法', viewer) : '';
  }
  function tags(r) {
    const minutes = r.status === 'running' && T.stamp(r.startedAt) ? (Date.now() - T.stamp(r.startedAt)) / 60000 : r.minutes;
    const whole = R.minutesBetween(r.queuedAt || r.startedAt, r.finishedAt);
    const time = [clockRange(r), whole != null && `整轮 ${T.dec(whole)} 分钟`,
      r.status === 'running' && minutes != null && `已跑 <span data-ran="${T.stamp(r.startedAt)}">${span(minutes)}</span>`,
      r.status !== 'running' && !r.who?.program && r.workedMinutes != null && `AI 实际 ${T.dec(r.workedMinutes)} 分钟`].filter(Boolean).join(' · ');
    // 型号点了到智能体页看这一家干了多少（和自动任务页“用谁”那一列同一个去处）；程序自己办的、认不出哪一家的照原样写字
    const d = chat?.data || r.conversation.meta;
    const worker = { model: U.fieldText(d?.model, viewer), host: d?.software, effort: d?.effort };
    const model = !r.who?.program && !r.who?.short && worker.model ? R.whoOf(worker).short : r.who?.text;
    const family = !r.who?.program && R.agentsPath(r.family || R.familyOf(worker));
    const who = !model ? '' : family ? link(family, `${esc(model)} ›`) : esc(model);
    return [esc(name()), F(r.trigger, '为什么开这一轮'), who, r.status === 'running' ? '<b class="ar-live">正在跑</b>' : '', time].filter(Boolean)
      .map(t => `<span class="ar-tag"><span>${keepDates(t)}</span></span>`).join('');
  }


  // 另一轮（接着做的、被接着做的、上一轮、下一轮）：先看这一类的列表里有没有
  const other = rid => siblings?.rows.find(x => x.id === rid);
  const ordered = () => (siblings?.rows || []).slice().sort((a, b) => (T.stamp(a.startedAt || a.queuedAt) || 0) - (T.stamp(b.startedAt || b.queuedAt) || 0));
  const plainOf = v => U.fieldText(v, viewer).replace(/\s+/g, ' ').trim();
  const loose = s => String(s || '').replace(/[\s，,。．.；;、：:！!？?「」『』“”"（）()·]/g, '');

  // —— 标题前的状态色点：正在跑绿点一闪一闪，跑完绿，暂缓灰，没做成红 ——
  const toneOf = r => r.status === 'running' ? 'live' : r.deferred ? 'off' : r.status === 'incomplete' ? 'bad' : r.status === 'completed' ? 'ok' : 'off';

  // —— 三格：发生了什么、有什么影响、接下来。后台给的 three；“发生了什么”还等于后台标题那句（还没拆出单独一句）时先不画，
  // “没有记下……”这种空话不画，缺哪格就不画那格（单子第 4 条）——
  function three(r) {
    const t = r.three || {}, head = plainOf(r.headline), shown = loose(title(r).replace(/<[^>]+>/g, ''));
    const cells = [['发生了什么', t.happened, 'happened'], ['有什么影响', t.impact, 'impact'], ['接下来', t.next, 'next']].filter(([key, v]) => {
      if (v == null || v === '') return false;
      const words = plainOf(v);
      if (typeof v === 'string' && /^没有记下/.test(words)) return false;
      // 大标题退回长标题时，标题就是 summary 的第一句；后台的“发生了什么”是同一句（只差标点）就不再写一遍
      return !(key === '发生了什么' && ((head && loose(words) === loose(head)) || (shown && loose(words) === shown)));
      // 访客那边这一格换了说法的（visitor_labels 的 three.happened、three.impact、three.next），这一格末尾挂全站同一个签，规则同标题、成品
    }).map(([h, v, key]) => [h, F(v, h), U.visitorLabel({ visitor_labels: r.labels }, `three.${key}`, `“${h}”这一格`, viewer)]).filter(([, html]) => html.trim());   // 画出来是空的（本人版里没给原字的占位）不画
    return cells.length ? `<div class="ar-three" style="--cells:${cells.length}">${cells.map(([h, html, tag]) => `<section class="tp-panel ar-cell"><h2>${h}</h2><p>${withTag(html, tag)}</p></section>`).join('')}</div>` : '';
  }

  // —— 这一轮做成了什么：做出来的东西、回执里记下的、告诉本人的；有东西时才放（单子：原来那块的内容不能丢）——
  // 提交在 GitHub 上：两版同一颗“看提交 ›”，后面都挂“访客打不开”（全站“访客看不到”那个签的样子，点开写为什么）；访客点了由全站共用的可信设备说明框
  // （trust-modal.js，data-need-trusted）拦下、不跳走（本人 11-26 12:2x 改选 2；原来 04:24 选的是访客版不给链接）。
  // 两版说的理由一样：只有本人的可信设备能打开（有的提交在公开仓库里，GitHub 上本来打得开，所以不拿“仓库私有”当理由）
  const CANT_OPEN = { owner: '访客看得到“看提交”，点了打不开：只有本人的可信设备能打开。', public: '访客打不开这次提交：只有本人的可信设备能打开。' };
  const cantOpenTag = () => U.visitorHiddenTag('这次提交的链接', '', 'owner').replace('title="访客看不到 ·', 'title="访客打不开 ·')
    .replace(/data-trust-explanation="[^"]*"/, `data-trust-explanation="${esc(CANT_OPEN[viewer === 'owner' ? 'owner' : 'public'])}"`)
    .replace('<span class="live-mark__label">访客看不到</span>', '<span class="live-mark__label">访客打不开</span>');
  function made(r) {
    const receipt = r.receipt || {};
    // 本人版什么都给全：后台给本人的也只是“仅本人可见……”这类占位话（后台缺数）时，这一行照样在，写清后台没给原文，
    // 不悄悄少一行、不让本人看到的比访客少（私事线 11-26 04:43）。访客版照后台给的字
    const noOriginal = x => viewer === 'owner' && /^仅本人可见/.test(plainOf(x?.title ?? x?.text ?? x));
    // 回执里记下的这一条和上面做成的某一件是同一件的，不再列一遍；全都一样，“回执里记下的”整块不出。
    // 同一件看指向：后台标的成品号（receipt.recorded[].output_id = 同一回包里 outputs[].id，访客版是换过的那个号）、同一张卡（站内地址）、同一份文件（本机路径），
    // 有指向就只看指向（两版标题可能换了说法、对不上）；三样都没有时才退回比标题字。本人版访客版同一个判定（主控 11-26 11:02、11:2x，后台第 18 轮定的字段名）
    const pointsTo = x => [x?.output_id != null && x.output_id !== '' && `id:${x.output_id}`, T.path(x?.href) && `href:${T.path(x.href)}`, typeof x?.local_path === 'string' && x.local_path && `file:${x.local_path}`].filter(Boolean);
    const recorded = list(receipt.recorded);
    const sameThing = (o, x) => {
      const keys = pointsTo(x), output = pointsTo({ output_id: o.id, href: o.href, local_path: o.file });
      return keys.length ? keys.some(k => output.includes(k)) : sameText(o.title, x?.title ?? x?.text ?? x);
    };
    const mine = recorded.filter(x => !r.outputs.some(o => sameThing(o, x)));
    if (!r.outputs.length && !(r.outputCount > 0) && !mine.length && !receipt.told && !receipt.href) return '';
    // 名字访客那边换了说法的（outputs[].visitor_labels.title），名字后挂全站同一个签；链接访客那边没有的（outputs[].visitor_labels.href = hidden），本人版链接后挂“访客看不到”（主控 11-26 11:02，等后台给）；
    // 成品自己没有地址、这一轮又有业务回执的链接（下面“打开业务回执 ›”或右栏“这件修理的全部几轮 ›”）时，右边不写“没有能打开的地址”，空着
    const rows = r.outputs.map((o, i) => {
      const matching = recorded.filter(x => sameThing(o, x));
      const href = o.href || (o.labels?.href !== 'hidden' || viewer === 'owner' ? matching.map(x => T.path(x?.href)).find(Boolean) : '');
      const file = o.kind === 'document' && viewer === 'owner' && (o.file || matching.find(x => typeof x?.local_path === 'string')?.local_path);
      const fileName = file && file.split(/[\\/]/).filter(Boolean).at(-1);
      return `<li><span class="ar-num">${i + 1}</span><p><b>${F(o.title, '做成的东西') || esc(o.where)}</b>${o.title ? U.visitorLabel({ visitor_labels: o.labels }, 'title', '这件东西的名字', viewer) : ''}${o.action || o.where ? ` <span class="ar-arrow">→</span> ${esc(o.action)}${o.where && o.title ? esc(o.where) : ''}${R.versionTail(o, viewer)}` : ''}</p>
      ${href || o.github ? `<span class="ar-out-go"><a class="tp-link" href="${esc(href || o.githubHref)}"${o.github && viewer !== 'owner' ? ' data-need-trusted="看提交"' : ''}>${esc(o.go)} ›</a>${o.github ? cantOpenTag() : U.visitorLabel({ visitor_labels: o.labels }, 'href', '这件东西的链接', viewer)}</span>`
        : `<span class="tp-small">${fileName ? esc(fileName) : o.kind === 'commit' ? '还没发布，没有能打开的地址' : receipt.href ? '' : '没有能打开的地址'}</span>`}</li>`;
    }).join('');
    const extra = [mine.length && `<p class="ar-sub">回执里记下的：</p><ul class="ar-recorded">${mine.map(x => `<li>${noOriginal(x) ? '后台没给这件的原文' : F(x?.title ?? x?.text ?? x, '记下的事')}${U.visitorLabel(x, 'title', '这条记下的事', viewer)}</li>`).join('')}</ul>`,
      receipt.told && `<p class="ar-sub">告诉${you()}的：${F(receipt.told, '回执')}</p>`,
      receipt.href && `<p>${link(receipt.href, '打开业务回执 ›')}</p>`].filter(Boolean).join('');
    const count = !rows && r.outputCount > 0 ? `<p class="ar-none">做出 ${int(r.outputCount)} 样，后台这一版没列出是哪几样。</p>` : '';
    const empty = !rows && !count && !list(receipt.recorded).length && (r.status === 'running' ? '还在跑，做完再写。' : '这一轮没做出要记下的东西。');
    return `<section class="tp-panel ar-card ar-made"><h2>这一轮做成了什么</h2>${rows ? `<ol class="ar-outs">${rows}</ol>` : count}${empty ? `<p class="ar-none">${empty}</p>` : ''}${extra}</section>`;
  }

  // —— 这一轮的对话：拿这一轮的对话号去读 chats/{id}，和顶层对话页读同一份、用同一份显示逻辑 ——
  let chat = null, chatWatch = null;
  const CV = window.LiveChatView.create({ viewer: () => viewer, chat: () => chat?.data || null, at: () => chat?.meta?.at || null, route: p => T.path(p) || p });
  function watchChat(c) {
    const key = c.available ? c.resource : '';
    if (chatWatch?.key === key) return;
    chatWatch?.sub.stop(); chat = null; chatWatch = null;
    if (key) chatWatch = { key, sub: Live.watch(key, null, { phase(st) { chat = st; if (state) draw(); } }) };
  }
  // 钟点：和这一轮同一天只写几点，别的日子带上日子
  const clockOf = (r, at) => !T.stamp(at) ? '' : T.dayKey(at) === T.dayKey(r.startedAt || r.queuedAt || at) ? T.clock(at) : `${T.day(at)} ${T.clock(at)}`;
  const GEAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.6a.5.5 0 0 0 .1-.6l-1.9-3.3a.5.5 0 0 0-.6-.2l-2.4 1a7.4 7.4 0 0 0-1.7-1l-.4-2.6a.5.5 0 0 0-.5-.4h-3.8a.5.5 0 0 0-.5.4l-.4 2.6a7.4 7.4 0 0 0-1.7 1l-2.4-1a.5.5 0 0 0-.6.2L2.5 8.8a.5.5 0 0 0 .1.6l2 1.6a7.6 7.6 0 0 0 0 2l-2 1.6a.5.5 0 0 0-.1.6l1.9 3.3c.1.2.4.3.6.2l2.4-1c.5.4 1.1.7 1.7 1l.4 2.6c0 .2.2.4.5.4h3.8c.3 0 .5-.2.5-.4l.4-2.6c.6-.3 1.2-.6 1.7-1l2.4 1c.2.1.5 0 .6-.2l1.9-3.3a.5.5 0 0 0-.1-.6zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>';
  // 一条话：派活程序（齿轮）、AI（绿点）；name 是谁说的，at 是钟点，body 是正文，after 挂在正文下面（思考摘要、链接）
  const joined = html => html.split(/(<[^>]*>)/).map((s, i) => i % 2 ? s : s.replace(/([。！？])[ \t]*(?:[；;][ \t]*|·[ \t]*)/g, '$1 ')).join('');
  const say = ({ who, name: by, at, body = '', after = '', tone = '', cls = '' }) => `<li class="ar-msg${cls ? ` ${cls}` : ''}" data-who="${who}"${tone ? ` data-tone="${tone}"` : ''}><span class="ar-ava" data-who="${who}" aria-hidden="true">${who === 'dispatcher' ? GEAR : ''}</span><div class="ar-msg__body"><p class="ar-msg__head"><b>${by}</b>${at ? `<time>${esc(at)}</time>` : ''}</p>${body ? `<p class="ar-msg__text">${keepDates(joined(body))}</p>` : ''}${after}</div></li>`;

  // 思考摘要：引用样子挂在那条话下面。宿主只存了外文的，去掉“宿主存下的外文思考摘要：”那串字，前面标“外文原文”；
  // 一条话下面超过 3 句的，先露 3 句，其余点“再看 N 句”展开（内容都在，不删）；没有思考摘要的不画空框
  const FOREIGN = /^宿主(?:存下|只记录)了?的?外文思考(?:摘要)?[：:]\s*/;
  const bodyOf = (v, label) => CV.chatCell(v, label, chat?.data, 0, true) || CV.chatCell(v, label, chat?.data);
  // 旧 Codex 回包有时把多条短思考用空格拼起来。只从另一条思考的开头断开，保留普通的中英文空格。
  const splitThought = text => text.replace(/[ \t]+(?=(?:我(?:正在|已|先|将|会|在|继续|等待|核对|核查|检查)|正在(?:核对|核查|检查)|[A-Z][a-z]{2,}ing\b[ \t]))/g,
    (space, at) => /^[我正]/.test(text[at + space.length]) && !/[。！？.!?]$/.test(text.slice(0, at)) ? '。\n' : '\n');
  function quotes(lines, key) {
    let marked = false;
    const items = lines.map(v => {
      const raw = typeof v === 'string' ? v : '', foreign = FOREIGN.test(raw);
      const html = raw ? bodyOf(splitThought(raw.replace(FOREIGN, '')), '思考摘要') : bodyOf(v, '思考摘要');
      if (!html) return '';
      const tag = foreign && !marked ? '<small class="ar-quote__tag">外文原文</small>' : '';
      marked ||= foreign;
      return `<p>${tag}${html}</p>`;
    }).filter(Boolean);
    if (!items.length) return '';
    const rest = items.slice(3);
    return `<blockquote class="ar-quote">${items.slice(0, 3).join('')}${rest.length ? `<details class="ar-quote__more" id="ar-q-${esc(key)}"><summary class="live-disclosure"><span class="ar-open">再看 ${rest.length} 句思考摘要 ›</span><span class="ar-shut">收起 ‹</span></summary>${rest.join('')}</details>` : ''}</blockquote>`;
  }
  // 回复是一段程序原文（JSON）时不照摆：取里面的中文句子，一句一行（施工稿第三节第 9 条：不给看 JSON 和英文字段）
  function readable(words) {
    if (typeof words !== 'string' || !/^\s*[{[]/.test(words)) return words;
    if (/^\s*[{[]\s*$/.test(words)) return '';
    let data;
    try { data = JSON.parse(words); } catch { return words; }
    const out = [], walk = v => { if (typeof v === 'string') { if (/\p{Script=Han}/u.test(v)) out.push(v.trim()); } else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
    walk(data);
    return out.join('\n');
  }
  const norm = s => String(s || '').replace(/\s+/g, '').replace(/[。．.！!？?；;]+$/, '');
  const alreadySaid = (previous, words) => {
    const part = loose(words);
    return part.length >= 6 && loose(previous).includes(part);
  };

  // AI 一条条说的话：有逐步记录（automation_steps）就照它，一条话下面挂紧跟着的思考摘要；连着两条一样的只留一条
  function stepMessages(steps, prefix) {
    const out = [];
    let cur = null;
    for (const s of steps) {
      const words = CV.visibleText(s.text), body = s.text != null && s.text !== '' ? bodyOf(s.text, '这一步') : '';
      if (body) {
        if (cur && words && norm(words) === norm(cur.words)) { if (s.thinking) cur.quotes.push(s.thinking); continue; }
        cur = { at: s.at, words, body, quotes: [] }; out.push(cur);
      }
      if (s.thinking != null && s.thinking !== '') {
        if (!cur) { cur = { at: s.at, words: '', body: '', quotes: [] }; out.push(cur); }
        cur.quotes.push(s.thinking);
      }
    }
    return out.map((m, i) => ({ ...m, key: `${prefix}-${i}` }));
  }

  // 派活程序先说排上这一轮：为什么开（后台写了就照写；没写用触发和这件活拼），账本这件第几次看，交给 AI 的原话
  function opening(r, d) {
    const start = r.queuedAt || r.startedAt, program = r.who?.program;
    const reason = r.why ? F(r.why, '为什么开这一轮') : [r.trigger && `按“${F(r.trigger, '为什么开这一轮')}”开的这一轮。`, r.subject && `修的是“${F(r.subject.title, '这件活')}”${nth(r) ? `，这是第 ${int(nth(r))} 轮` : ''}。`, G[category]?.trigger && `这一类什么时候开：${esc(G[category].trigger)}`].filter(Boolean).join('') || '后台没写为什么开这一轮。';
    const look = r.ledger?.look ? `${/[。！？.!?]$/.test(U.fieldText(r.why || '', viewer)) || !r.why ? '' : '。'}第 ${int(r.ledger.look)} 次看。` : '';
    const before = r.resumes ? other(r.resumes) : null;
    const resumes = r.resumes ? `<p class="ar-msg__more"><a href="${esc(R.runPath(category, r.resumes))}">接着${before ? ` ${esc(clockOf(r, before.startedAt))} ` : '前'}那一轮做${before?.reason ? `（那一轮${F(before.reason, '原因')}）` : ''} ›</a></p>` : '';
    // 原话：这一轮的提示词（prompt_text）、对话的任务原文（task_prompt）；都没有时，Codex 自动任务对话的标题就是派给它的那段话（顶层页拿它当标题），照它给
    const asTitle = !r.prompt && !d?.task_prompt && d && CV.visibleText(d.title) ? `<div class="ar-prompt">${bodyOf(d.title, '交给 AI 的原话')}</div>` : '';
    const promptText = r.prompt ? `<pre class="ar-prompt">${F(r.prompt, '提示词')}</pre>` : d?.task_prompt ? `<div class="ar-prompt">${bodyOf(d.task_prompt, '任务原文')}</div>` : asTitle;
    const promptTag = asTitle && !U.visitorWholeHidden(d) ? U.visitorLabel(d, 'title', '交给 AI 的原话', viewer) : '';
    const prompt = program ? '' : !promptText && retired ? '' : promptText ? `<details class="ar-say-fold" id="ar-prompt"><summary class="live-disclosure"><span class="ar-open">交给 AI 的原话 ›</span><span class="ar-shut">收起交给 AI 的原话 ‹</span>${promptTag}</summary>${promptText}</details>`
      : `<p class="ar-msg__more"><a href="${esc(T.path('/live/automation/', { type: category }) + `#prompt-${category}`)}">这一类交给 AI 的原话 ›</a></p>`;
    return { at: start, html: say({ who: 'dispatcher', name: '派活程序', at: clockOf(r, start), body: `排上这一轮：${reason}${look}${program ? '这一轮由程序直接办，没叫 AI。' : ''}`, after: resumes + prompt }) };
  }

  // 最后派活程序说结论：做完的照这一轮的结局，暂缓的写为什么先放着，没做成的照真原因（stop：停在哪一步、几点再接着做）
  function closing(r, lastWords) {
    const end = r.finishedAt || r.lastAt, after = r.resumedBy ? other(r.resumedBy) : null;
    const later = r.resumedBy ? `<p class="ar-msg__more"><a href="${esc(R.runPath(category, r.resumedBy))}">${after ? `${esc(clockOf(r, after.startedAt))} ` : '后来'}那一轮接着做 ›</a></p>` : '';
    let body, tone;
    if (r.deferred) {
      // 为什么先放着：后台的 reason 写的就是这一轮暂缓的原因（两轮复查仍没达到原条件、交给谁接着查），原样写出来；
      // 这一轮做了什么（summary）另起一行，和原因是同一句的不再写（公网复核 11-26：暂缓原因没显示）
      const why = F(r.reason, '为什么先放着'), whyPlain = plainOf(r.reason), note = R.deferredNote(r, F);
      const hasWhy = whyPlain && whyPlain !== '暂时不修', dupNote = hasWhy && note && loose(whyPlain).includes(loose(note.replace(/<[^>]+>/g, '')));
      body = `收到结论：暂时不修，等下一次检查再看。${hasWhy ? `<br>为什么先放着：${why}` : ''}${note && !dupNote ? `<br>${hasWhy ? '这一轮做了：' : ''}${note}` : ''}`; tone = 'off';
    } else if (r.status === 'incomplete') {
      const why = F(r.stop?.text, '原因') || F(r.reason, '原因') || '原因没记下';
      // 后台的原因句里已经写了“停在「这一步」”的，不再另写一遍“停在：……”
      const stepWords = plainOf(r.stop?.step), step = stepWords && !plainOf(r.stop?.text || r.reason).includes(stepWords) ? `停在：${F(r.stop.step, '这一步')}。` : '', until = T.stamp(r.stop?.until) ? `${esc(T.when(r.stop.until))} 再接着做。` : '';
      body = `没收到结论：${why}${/[。！？]$/.test(why) ? '' : '。'}${step}${until}`; tone = 'bad';
    } else {
      // “这次带入：……”那串明细在对话卡头写了，结论里不再写一遍
      const plainSummary = typeof r.summary === 'string' && lastWords ? r.summary.replace(SCAN, '').match(/[^。！？\n]+[。！？]*|\n+/g) : null;
      const summary = plainSummary ? plainSummary.filter(sentence => !alreadySaid(lastWords, sentence)).join('').trim() : r.summary;
      const shown = F(summary, '这一轮做了什么');
      const result = withoutScan(R.withoutSubject(shown, r.subject ? F(r.subject.title, '这件活') : '') || shown, r);
      const tag = U.visitorLabel({ visitor_labels: r.labels }, 'summary', '这一轮的说法', viewer);
      body = result ? `收到结论：${withTag(result, tag)}` : `收到结论${lastWords ? '。' : '：跑完了'}${tag}`; tone = 'ok';
    }
    return { html: say({ who: 'dispatcher', name: '派活程序', at: clockOf(r, end), body, after: later, tone, cls: 'ar-end' }) };
  }

  // 中间：AI 一条条说、帮手一行行，按时刻排
  function middle(r, d, ai, locked) {
    const out = [];
    let gap = '', lastWords = '';
    if (!locked) {
      const steps = list(d.automation_steps);
      const msgs = steps.length ? stepMessages(steps, 'ai') : [];
      // 已经说过的话（逐步记录里的每一条）：摘要、回复里的一句被哪一条包含着，就不再说一遍
      const seen = msgs.map(m => norm(m.words)).filter(Boolean), said = n => seen.some(x => x.includes(n));
      const seenThought = new Set(steps.map(s => norm(typeof s.thinking === 'string' ? s.thinking.replace(FOREIGN, '') : CV.visibleText(s.thinking))).filter(Boolean));
      // 逐步记录里没有的摘要、回复照样补上（顶层页“正在执行”那块的正式摘要、最新回复）；一样的不重复，程序原文（JSON）取中文句子
      const add = (v, label, at) => {
        const raw = CV.visibleText(v), words = readable(raw);
        if (raw && !words) return;
        const lines = raw ? words.split('\n').map(x => x.trim()).filter(x => x && !said(norm(x))) : [];
        if (raw && !lines.length) return;
        const body = raw ? lines.map(x => esc(x)).join('<br>') : bodyOf(v, label);
        if (!body) return;
        lines.forEach(x => seen.push(norm(x)));
        msgs.push({ at, words: lines.join('\n'), body, quotes: [], key: `${label}-${msgs.length}`, label });
      };
      const reply = U.chatFields.detailReply(d);
      // 没有逐步记录（后台在 field_gaps.automation_steps 写原因）：退回顶层页同样的内容——最新进展、正式摘要、最新回复、思考摘要
      if (!steps.length) {
        gap = typeof d.field_gaps?.automation_steps === 'string' ? d.field_gaps.automation_steps : '';
        const lead = CV.workLine(d, reply).say;
        if (['running', 'waiting', 'reconnecting'].includes(d.state) && lead && lead !== d.summary && lead !== reply) add(lead, '最新进展', d.at);
      }
      add(CV.replyBody(U.chatProgressText(d.summary, d, viewer)), '正式摘要', d.summary?.at);
      add(CV.replyBody(reply), '最新回复', reply?.at);
      msgs.sort((a, b) => (T.stamp(a.at) ?? Infinity) - (T.stamp(b.at) ?? Infinity));
      lastWords = msgs.findLast(m => m.words)?.words || '';
      // 对话最后的思考摘要（顶层页“思考摘要”那块）：逐步记录里已经有的不再挂
      const t = CV.thought();
      if (t.thought && !seenThought.has(norm(CV.visibleText(d.thinking)))) {
        if (!msgs.length) msgs.push({ at: d.at, words: '', body: '', quotes: [], key: 'thought' });
        const words = CV.visibleText(d.thinking), split = splitThought(words);
        msgs[msgs.length - 1].thoughtHtml = t.head + (typeof d.thinking === 'string' && split !== words ? bodyOf(split, '思考摘要') : t.thought);
      }
      for (const m of msgs) out.push({ at: m.at, html: say({ who: 'ai', name: esc(ai), at: clockOf(r, m.at), body: m.body + (m.label ? `<small class="ar-msg__label">${m.label}</small>` : ''),
        after: quotes(m.quotes, m.key) + (m.thoughtHtml ? `<blockquote class="ar-quote">${m.thoughtHtml}</blockquote>` : '') }) });
    }
    // 帮手：默认收成一行，点“展开”看这个帮手的全部（逐步记录、帮手原名、帮手详情、打开对话）；内容和顶层页的帮手行用同一个函数出
    const helpers = Array.isArray(d.helpers) ? d.helpers : locked ? list(d.helpers?.active) : [];
    helpers.forEach((h, i) => {
      const messages = locked ? [] : stepMessages(list(h.automation_steps), `h${i}`);
      const last = messages.findLast(m => m.words)?.words;
      const row = CV.helperRow(h, i, words => alreadySaid(last, words));
      if (row.warming) return;
      const own = messages.map(m => say({ who: 'ai', name: esc(row.model || '帮手'), at: clockOf(r, m.at), body: m.body, after: quotes(m.quotes, m.key) })).join('');
      const line = [row.state && `<b class="ar-helper__state">${esc(row.state)}</b>`, row.name || (row.state ? '' : row.head)].filter(Boolean).join('：');
      const inside = `${own ? `<ol class="ar-chat ar-chat--sub">${own}</ol>` : ''}<p class="ar-helper__meta">${U.fieldHtml(row.meta, { name: '对话内容', kind: viewer })}</p>${row.detail}${row.more}${row.canOpen ? `<div class="ar-helper__acts">${CV.actions(h)}</div>` : ''}`;
      out.push({ at: h.at, html: `<li class="ar-msg ar-helper" data-who="helper"><details class="ar-helper__fold" id="ar-h-${esc(row.key)}"><summary class="live-disclosure"><span class="ar-helper__hook" aria-hidden="true"></span><span class="ar-ava" data-who="helper" aria-hidden="true"></span><b class="ar-helper__who">帮手${row.model ? ` · ${esc(row.model)}` : ''}</b>${T.stamp(h.at) ? `<time>${esc(clockOf(r, h.at))}</time>` : ''}<span class="ar-helper__line">${line}</span><span class="ar-open">展开 ›</span><span class="ar-shut">收起 ‹</span></summary><div class="ar-helper__body">${inside}</div></details></li>` });
    });
    out.sort((a, b) => (T.stamp(a.at) ?? Infinity) - (T.stamp(b.at) ?? Infinity));
    return { out, gap, lastWords };
  }

  // 计划：和顶层页同一份 plan，每一步的状态照数据（做完、在干、没开始），当前这一步标出。
  // 对话已经结束、计划还停在半路（这一步没标做完）时，不写“在干”：卡头写“停在第 N／M 步”，那一步写“停在这一步”（主控 11-26 06:0x，卡头写“对话已结束”、计划却写“在干”像页面毛病）
  function planFold(p, ended) {
    const d = chat?.data;
    if (!p.plan.length) return '';
    const steps = p.plan.map((x, i) => CV.station(x, i, p.current)).map(x => ended && x.word === CV.stepWord('running') ? { ...x, word: '停在这一步' } : x);
    const kinds = new Set(p.plan.map(x => CV.privatePlan(x) ? 'owner' : CV.markOf(x.text, x)).filter(Boolean)), marks = CV.marks(kinds, '计划');
    const now = p.plan[p.current];
    const head = [p.count, now && (ended ? `停在${p.label}` : p.label), now && !ended && CV.stepWord(U.chatFields.stepState(now))].filter(Boolean).join(' · ');
    const tag = !U.visitorWholeHidden(d) ? U.visitorLabel(d, 'plan', '执行计划', viewer) : '';
    return `<details class="ar-fold ar-planfold" id="ar-plan"><summary class="live-disclosure"><span class="ar-planfold__h">计划${tag}</span><small>${esc(head)}</small><span class="ar-open">展开 ›</span><span class="ar-shut">收起 ‹</span></summary><ol class="ar-plan">${steps.map(s => `<li data-step="${s.state}">${s.lamp}<span>${s.label || ''}</span>${s.word ? `<small>${s.word}</small>` : ''}</li>`).join('')}</ol>${marks ? `<p class="ar-none">${marks}</p>` : ''}</details>`;
  }

  function conversation(r) {
    const c = r.conversation, d = chat?.data, program = r.who?.program, items = [opening(r, d)];
    const hiddenFromVisitor = !c.available && c.reason === 'private';
    const waitingForConversation = r.status === 'running' && !d && !program && !hiddenFromVisitor;
    // 被藏的对话照新私事规则写“…仅本人可见”（定稿卡-私事）
    const hiddenText = c.why || '这一轮对话的计划、思考摘要和回复仅本人可见';
    const ai = d ? CV.who(d) || r.who?.text || 'AI' : r.who?.text || 'AI';
    const locked = !!d && U.chatFields.contentLocked(d, viewer);
    let note = '', lastWords = '';
    if (program || waitingForConversation) note = '';
    else if (!c.available) note = hiddenFromVisitor ? esc(hiddenText) : '这一轮的对话没存下来，看下面派活程序收到的结论。';
    else if (!d) note = chat?.phase === 'none' || chat?.meta?.status >= 400 ? '这一轮的对话没读到。' : '正在读这一轮的对话…';
    else {
      const { out, gap, lastWords: previous } = middle(r, d, ai, locked);
      lastWords = previous;
      // 整场对访客锁着：照顶层页写哪几样仅本人可见，帮手照列（型号、状态）
      if (locked) items.push({ html: `<li class="ar-gap">${CV.lockedFields}仅本人可见</li>` });
      else if (gap && out.length) items.push({ html: `<li class="ar-gap">${esc(gap)}，下面是这场对话的摘要和回复。</li>` });
      else if (!out.length) note = esc(gap || '这一轮说了什么没有存下来。');
      items.push(...out);
    }
    if (note) items.push({ html: `<li class="ar-gap">${note}</li>` });
    // 还在跑：最后一行写它这会儿在干什么；跑完了：派活程序说结论
    if (r.status === 'running') {
      const doing = d && !locked ? CV.visibleText(d.doing ?? d.progress) : '', now = doing || plainOf(r.activity);
      const activity = now ? `正在${esc(now.replace(/^正在/, '').replace(/[。！？]+$/, ''))}` : '';
      const text = waitingForConversation ? `${activity || '正在跑'}，对话还没传上来，读到就显示在这里。` : activity || '正在想……';
      items.push({ html: `<li class="ar-msg ar-typing" data-who="ai"><span class="ar-ava" data-who="ai" aria-hidden="true"></span><div class="ar-msg__body"><p class="ar-msg__head"><b>${esc(ai)}</b></p><p class="ar-msg__text"><span class="ar-dots" aria-hidden="true"><i></i><i></i><i></i></span>${text}</p></div></li>` });
    } else items.push(closing(r, lastWords));

    // 卡头：这场对话自己的状态（和这一轮的结局分开写）、条数；型号档位、各项时刻、帮手几个、所属项目、App 标签、压缩次数、问情况、打开对话；计划收在“计划”里
    // 访客版对话藏着时后台不给 state，看 metadata 里记的状态
    const talkState = { running: '对话还在跑', done: '对话已结束', failed: '对话出错停了', unknown: '对话状态不明' }[c.state || d?.state || c.meta?.state] || '';
    // 本人版：后台标了这份对话对访客藏着（unavailable_reason=private 或给了 hidden_why），在原位挂“访客看不到”；标 rewritten 的挂“对外换了说法”（M684）
    const labeled = U.visitorFieldKind({ visitor_labels: r.labels }, 'conversation');
    const tag = viewer !== 'owner' ? (c.reason === 'private' || c.why || labeled !== 'rewritten' ? '' : U.visitorRewrittenTag('这一轮的对话', '', viewer)) : c.reason === 'private' || c.why || labeled === 'hidden' ? U.visitorHiddenTag('这一轮的对话', c.why.replace(/^访客看不到[：:]\s*/, ''), viewer)
      : labeled === 'rewritten' ? U.visitorRewrittenTag('这一轮的对话', '', viewer) : '';
    const count = items.filter(x => x.html.startsWith('<li class="ar-msg')).length;
    let meta = '', plan = '';
    // 这一轮带入了哪些来源、各读到几点（回执的 scan）：从大标题挪到这里，单独一行（主控 11-26）
    const scan = scanOf(r), scanLine = scan ? `<p class="ar-talk__note ar-talk__scan">${esc(scan)}</p>` : '';
    if (d && !program && c.available) {
      const m = CV.pageMeta({ automation: true, showElapsed: r.workedMinutes == null }), latest = locked ? '' : CV.workLine(d, m.rawReply).latest, note = locked ? '' : CV.headerNote(d, latest);
      // 后台写了缺因的照写一句：这场只留下逐步回复、没留下思考摘要（Claude 定时任务常这样），不画空的引用框
      const thinkGap = !locked && typeof d.field_gaps?.automation_thinking === 'string' ? d.field_gaps.automation_thinking : '';
      meta = `<div class="ar-talk__meta"><p class="ar-talk__facts">${m.app}${m.meta.map(v => `<span>${keepDates(U.fieldHtml(v, { name: '对话内容', kind: viewer }))}</span>`).join('')}${m.project ? `<span>所属项目 ${m.project}</span>` : ''}${tag ? '' : U.visitorHiddenMark(d, '这场对话', viewer)}</p>${scanLine}${note ? `<p class="ar-talk__note">${note}</p>` : ''}${thinkGap ? `<p class="ar-talk__note">${esc(thinkGap)}</p>` : ''}${locked ? '' : `<div class="ar-talk__acts">${CV.actions(d)}</div>`}</div>`;
      plan = locked ? '' : planFold(m.plan, ['done', 'stopped', 'failed', 'ended_unknown'].includes(c.state || d.state));
    } else {
      // 对话没读到（访客版对话藏着、本人版还在读或读不到）：照后台给的 conversation.metadata 和 message_count 写卡头这一行，正文照旧
      const facts = program ? '' : talkFacts(c.meta, c.count);
      if (facts || scanLine) meta = `<div class="ar-talk__meta">${facts ? `<p class="ar-talk__facts">${facts}</p>` : ''}${scanLine}</div>`;
    }
    return `<section class="tp-panel ar-card ar-talk"><div class="ar-talk__head"><h2>这一轮的对话</h2>${tag}${talkState ? `<small class="ar-talkstate">${talkState}</small>` : ''}<span class="ar-count">共 ${count} 条</span></div>${meta}${plan}<ol class="ar-chat">${items.map(x => x.html).join('')}</ol></section>`;
  }
  // 卡头那一行在对话没读到时：哪家软件、型号档位、原有几条消息、第几步、开始和最后动静、几个帮手。
  // 写法照 AI 对话详情页（/live/chat/）页头，和读到对话时那一行同一个样子；后台没给这两个字段就不写（照原来的样子）。
  // 读到对话时卡头右边的“共 N 条”数的是下面摆出来的话，这里写“原有”，说的是那场对话本来有几条
  function talkFacts(m, count) {
    if (!m && !known(count)) return '';
    const CF = U.chatFields, row = m || {};
    const who = [U.fieldText(U.draw10?.bareModel ? U.draw10.bareModel(row) : row.model, viewer), U.fieldText(row.effort, viewer)].filter(Boolean).join(' · ');
    const plan = CF.planInfo(row), helpers = CF.helperTotal(row);
    const start = T.stamp(row.session_started_at) ? `对话开始 ${when(row.session_started_at)}` : T.stamp(row.born) ? `本次记录起于 ${when(row.born)}` : '';
    const parts = [who, known(count) && `原有 ${int(count)} 条消息`, plan.label || plan.count, start, T.stamp(row.at) && `主对话更新 ${when(row.at)}`,
      helpers === 0 ? '没有派帮手' : known(helpers) && `帮手 ${int(helpers)} 个`].filter(Boolean);
    return CF.appTag(row) + parts.map(v => `<span>${keepDates(esc(v))}</span>`).join('');
  }

  // —— 右栏：这一轮在办（属于账本哪件、第几次看、欠着还是放着；这件修理的全部几轮；谁约的→谁做的）、这一类和怎么干、上一轮和下一轮（带钟点） ——
  const GROUP = { owed: '欠着', parked: '放着' };
  function side(r) {
    const rows = ordered(), at = rows.findIndex(x => x.id === r.id);
    const prevId = r.prev || (at > 0 ? rows[at - 1].id : ''), nextId = r.next || (at >= 0 && at < rows.length - 1 ? rows[at + 1].id : '');
    const clock = rid => { const o = rid && other(rid), t = o && (o.startedAt || o.queuedAt); return T.stamp(t) ? ` ${esc(clockOf(r, t))}` : ''; };
    const step = (rid, text, back) => {
      const words = back ? `<i>‹</i> ${text}${clock(rid)}` : `${text}${clock(rid)} <i>›</i>`;
      return rid ? `<a href="${esc(R.runPath(category, rid))}">${words}</a>` : `<span class="ar-off">${back ? `<i>‹</i> ${text}` : `${text} <i>›</i>`}</span>`;
    };
    const li = r.ledger, group = li && GROUP[li.group];
    const look = li && [li.look ? `第 ${int(li.look)} 次看` : '', !li.look && li.lookMax ? `最多看 ${int(li.lookMax)} 次` : '', group].filter(Boolean).join('，');
    const doing = [li?.title && (li.href ? `<a href="${esc(li.href)}">属于账本：${F(li.title, '账本那件')} <i>›</i></a>` : `<p>属于账本：${F(li.title, '账本那件')}</p>`), look && `<p>${look}</p>`,
      r.subject?.href && `<a href="${esc(r.subject.href)}">这件修理的全部几轮 <i>›</i></a>`,
      r.promisedBy?.title && `<p>谁约的：${r.promisedBy.href ? `<a class="ar-inline" href="${esc(r.promisedBy.href)}">${F(r.promisedBy.title, '约的那场对话')} ›</a>` : F(r.promisedBy.title, '约的那场对话')}${r.who?.text ? ` → 谁做的：${esc(r.who.text)}` : ''}</p>`].filter(Boolean);
    return `<aside class="ar-side">${doing.length ? `<section class="tp-panel ar-sidecard"><h2>这一轮在办</h2>${doing.join('')}</section>` : ''}
      <section class="tp-panel ar-sidecard"><a href="${esc(T.path('/live/automation/', { category }))}">${esc(name())} <i>›</i></a>${retired ? '' : `<a href="${esc(T.path('/live/automation/', { type: category }) + `#cat-${category}`)}">这一类怎么干 <i>›</i></a>`}</section>
      <section class="tp-panel ar-sidecard"><p class="ar-steps">${step(prevId, '上一轮', true)}${step(nextId, '下一轮', false)}</p></section></aside>`;
  }

  function draw() {
    const backLink = document.querySelector('[data-back]');
    viewer = T.viewerOf(state);
    if (backLink && category && !fromReferrer) { backLink.textContent = listLabel || U.fieldText(name(), viewer); backLink.href = back; }
    // 快讯条照自动任务页：用每一轮的列表排开始、跑完、停了（摘一句不放）。后台的 feed 只留最近 30 条，常常全是摘一句，滤完就空了（M672）
    // 这一轮自己没读到时也照自动任务页算“读不到”，空着就写“这一页的读数没读到”，不写成“没有新消息”
    page.tick.set(R.ticker(board?.data, others?.rows?.length ? others.rows : siblings?.rows || null, viewer), { off: !!board?.offline || !state?.data });
    const d = state?.data;
    if (!category || !id) { T.paint(page.root, '<p class="tp-placeholder" role="status">网址里没写是哪一轮。</p>'); return; }
    if (!d) { T.paint(page.root, T.placeholder(state, '这一轮')); return; }
    const r = R.detail(d, viewer);
    watchChat(r.who?.program ? {} : r.conversation);
    // 压缩次数和顶层页同一个画法（draw10.detail 挂在卡头信息后面）；整块重画时留住展开没有
    const compactOpen = page.root.querySelector('[data-compaction] details')?.open;
    // 大标题：日期、时刻不从中间断开；访客那边换了说法的挂签，签和标题最后几个字连着换行（标题和签包在一个 span 里，不让 h1 的 flex 把它们拆成几块）
    // 访客版画之前把指本人的“你”换成“本人”（paint）
    paint(page.root, `<div class="ar-head"><h1><i class="ar-dot" data-tone="${toneOf(r)}" aria-hidden="true"></i><span class="ar-title">${withTag(keepDates(title(r)), titleTag(r))}</span></h1><p class="ar-tags">${tags(r)}</p></div>${T.stateNote(state)}
      ${three(r)}${made(r)}
      <div class="ar-grid"><div class="ar-main">${conversation(r)}</div>${side(r)}</div>`);
    const host = page.root.querySelector('.ar-talk__facts');
    if (host && chat?.data && U.draw10) {
      U.draw10.detail(host, chat.data, viewer);
      const fold = page.root.querySelector('[data-compaction] details');
      if (fold && compactOpen) fold.open = true;
    }
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
  // 等 T.boot 先订上这一轮本身再订同类列表、全部几类和总览：页顶那条“下面是……最后一份（几点）”说的是本页主数据（第一个订的那份）。
  // 原来同类列表先订、成了主数据，关机重开时页顶写列表的时刻、页眉写这一轮的时刻，一页两个“最后一份”（和自动任务页 M960 同一回事）
  let allRuns = null;
  queueMicrotask(() => {
    if (category) Live.watch('automation/runs', { category }, { phase(st) { siblings = R.page(st.data, viewer); if (state) draw(); } });
    // 全部几类（不含摘一句）一次读：数据约定写了列表可带 exclude=excerpt。后台还不认这个参数（回 4xx）时停掉这一份，快讯条退回只排这一类
    allRuns = Live.watch('automation/runs', { exclude: 'excerpt' }, { phase(st) {
      const status = st.meta?.status;
      if (status >= 400 && status < 500) { setTimeout(() => allRuns?.stop()); others = null; }
      else others = R.page(st.data, viewer);
      if (state) draw();
    } });
    Live.watch('automation', {}, { phase(st) { board = st; if (state) draw(); } });
  });
})();
