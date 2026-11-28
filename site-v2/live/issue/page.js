// 实况 · 账本一件（/live/issue/?id=…）：照“一件事的页-v1”（本人 11-26 01:04 批照图施工，AUTOPAGES 第三批）。
// 读 ledger/<id>。页头大卡：一句人话、一行状态（欠着／放着 · 在等什么 · 下次几点看 · 第几次看）、一行谁几点记下；
// 三格（发生了什么、有什么影响、接下来，后台没给的那格不画）；左边“每看一次”：每一次一行，写做了什么、哪个型号档位，
// 能点进那一轮或那场对话，最后一个空心圈是下一次；右边反复出现、来源、这件事。
// 自己一份脚本，不再和等你的事共用 item/page.js（改等你的事的那条线不会撞到这里）。
(() => {
  'use strict';
  const U = window.LiveUI, L = window.LiveLight, R = window.LiveRuns, { esc } = U, $ = id => document.getElementById(id);
  const p = new URLSearchParams(location.search), id = p.get('id');
  const hero = $('hero'), part = name => hero.querySelector(`[data-part="${name}"]`);
  const SETTLED = { fixed: '修好了', recovered: '已恢复', wont_fix: '定了不修', to_owner: '转给你' };
  const STEP = { not_fixed: '没修好', deferred: '先放着', superseded: '并进了别的一件', not_done: '没办成' };
  const KIND = { repair: '修理', verify: '验收' };
  const HOST = { claude: 'Claude', codex: 'Codex', antigravity: 'Antigravity' };
  let viewer = 'public', item = null, history = [], misjudged = [], at = null, policy, repeat, repeatAsked = false, first = true;
  const route = href => { const u = new URL(href, location.origin); if (u.origin !== location.origin) return href; if (p.has('fixture')) u.searchParams.set('fixture', p.get('fixture')); return u.pathname + u.search + u.hash; };
  const site = h => typeof h === 'string' && h.startsWith('/live/') ? R.runPage(h) : '';
  const F = (v, name = '') => U.fieldHtml(v, { name, kind: viewer });
  const T = v => U.fieldText(v ?? '', viewer).trim();
  const you = () => viewer === 'owner' ? '你' : '本人';
  const keepTitleWords = html => html.replace(/<[^>]+>|已?了结|有没有|以后|超时/g, word =>
    word.startsWith('<') ? word : `<span class="iss-nowrap">${word}</span>`);
  const publicText = text => text.replace(/“[^”]*”|你(?!们)/g, word => word === '你' ? '本人' : word);
  // 保留双引号内的显示字；标签本身只处理 title，链接地址照原值。
  function publicHtml(html, viewer) {
    if (viewer === 'owner' || !html.includes('你')) return html;
    return html.replace(/<[^>]+>|“(?:[^<”]|<\/?(?:span|a|b|strong|em|i|wbr|time)\b[^>]*>)*”|你(?!(?:<[^>]+>)*们)/g, part =>
      part === '你' ? '本人' : part.replace(/<[^>]+>/g, tag => tag.replace(/(\s[\w:.-]+=)(["'])([\s\S]*?)\2/g,
        (attribute, name, quote, value) => name.trim() === 'title=' ? name + quote + publicText(value) + quote : attribute)));
  }
  const put = (el, html) => U.html(el, publicHtml(html, viewer));
  const timed = R.timed, ms = x => Date.parse(x);
  const when = x => R.when(x, at || new Date().toISOString(), { relative: true });
  const clock = x => `<time datetime="${esc(x)}">${esc(when(x))}</time>`;
  const nodot = v => typeof v === 'string' ? v.trim().replace(/[。.]$/u, '') : v;
  const go = (href, text) => site(href) ? `<a class="iss-go" href="${esc(route(site(href)))}">${text}&nbsp;›</a>` : text;
  const fact = (k, v) => v ? `<div class="rec-fact"><dt>${k}</dt><dd>${v}</dd></div>` : '';
  // 那一轮还是那场对话：看地址是自动任务的一轮还是对话页
  const goName = href => /^\/live\/chat\//.test(href) ? `${HOST[(new URL(href, location.origin).searchParams.get('id') || '').split(':')[0]] || ''} 那场对话`.trim() : '那一轮';
  const titleOf = d => T(d.plain_title) ? d.plain_title : T(d.title) ? d.title : d.text;
  const positive = n => Number.isInteger(n) && n > 0;
  const faultOf = d => T(d.registered_by) === '自动修理' || T(d.registered_by_text) === '自动修理' || /^auto-/.test(String(d.id || ''));

  // 左上照定稿图是面包屑“实况 › AI 自动任务账本 › 这件”（主控 04:5x 定）；点“AI 自动任务账本”回账本页原来的位置
  for (const a of document.querySelectorAll('.iss-crumb a')) a.href = route(a.getAttribute('href'));
  document.querySelector('[data-back]').addEventListener('click', U.restoreBack);

  const bar = U.topbar({ ask: () => item ? `请看实况 AI 自动任务账本里的这一件 ${item.id}（${T(titleOf(item))}），用大白话说明它现在到哪一步、在等什么。` : '' });
  L.add(hero);
  const heroRead = U.reading(hero.querySelector('.card__body'), { ghost: U.ghost.card(2), name: '这件事' });
  const restRead = U.reading($('rest'), { ghost: U.ghost.rows(4), slow: false });

  // 现在是哪一种：了结了（修好、已恢复、定了不修、转给你）、欠着（AI 在修的或到点还没了结的）、放着（等约好的日子或某个结果）
  function stateOf(d) {
    const out = d.resolution === 'recovered' ? 'recovered' : d.outcome;
    if (!d.state && SETTLED[out]) return { closed: true, out, label: out === 'to_owner' ? `转给${you()}` : SETTLED[out], level: out === 'fixed' || out === 'recovered' ? 'green' : 'gray' };
    const late = !d.running && (d.overdue === true || timed(d.next_at) && ms(d.next_at) <= Date.now());
    const owed = d.group === 'owed' || d.group !== 'parked' && (d.running || d.state === 'working' || late);
    return { group: owed ? 'owed' : 'parked', late, label: owed ? '欠着' : '放着', level: late ? 'blue' : owed ? 'green' : 'gray' };
  }

  // 每看一次（待本人定的 A：每一轮都列一行）：自动修理那几件按每一轮列（修理、验收各一行，写型号档位，点进那一轮）；AI 约好的事每一轮就是到点去看一次。
  // 并入同一轮的核对记录时，直接用这一轮的详情地址。
  // 后台“经过”里另有的一步（没修好、先放着、了结）同一时刻有那一轮的，挂在那一轮的“修理”“验收”后面；没有的才另补一行。每次写的话常把前几次的也带着，只摆这一次新写的那一行，其余收着。
  // 对话被藏的那一轮（visitor_labels.conversation 是 hidden）：本人版挂“访客看不到”；访客版时刻、型号档位照给，那一轮的页后台给了链接就照给，原位写后台给的原因。
  function steps(d, repair) {
    const rows = [];
    const rounds = (Array.isArray(d.rounds) ? d.rounds : []).filter(r => r && (timed(r.end_at) || timed(r.at)));
    // 修理、验收的小签只给自动修理那几件；AI 约好的事每一轮都是到点去看一次，不写“修理”。访客版那一轮的字被藏（只剩“仅本人可见”）就不写字，原因写在下面
    for (const r of rounds) rows.push({ at: r.end_at || r.at, start: r.at || r.end_at, round: true, kind: repair ? KIND[r.kind] || '' : '', live: !r.end_at, outcome: r.verdict,
      text: (t => /^仅本人可见[。.]?$/.test(T(t)) ? null : t)(r.deliverable ?? r.summary),
      who: [r.actual_model || r.executor, r.actual_effort || r.requested_effort].filter(Boolean).join(' · '), href: site(r.source_href), why: r.source_unavailable_reason, tag: hiddenTag(r) });
    const roundOf = t => rows.filter(r => r.round && ms(t) >= ms(r.start) - 2000 && ms(t) <= ms(r.at) + 600000)
      .sort((a, b) => Math.abs(ms(a.at) - ms(t)) - Math.abs(ms(b.at) - ms(t)))[0];
    for (const c of Array.isArray(d.checks) ? d.checks : []) if (c && timed(c.at)) {
      const chat = site(c.source_href), own = site(c.run_href), who = [c.model, c.effort].filter(Boolean).join(' · '), hit = roundOf(c.at);
      if (hit) {
        hit.who ||= who;
        if (!hit.href && (own || chat) || own && /^\/live\/chat\//.test(hit.href)) Object.assign(hit, { href: own || chat, why: c.source_unavailable_reason });
        hit.checkAt = c.at;
        continue;
      }
      rows.push({ at: c.at, text: c.text, kind: '', who, href: own || chat, why: c.source_unavailable_reason });
    }
    const hits = t => x => x && Math.abs(ms(x) - ms(t)) < 2000, near = t => rows.some(r => [r.at, r.checkAt].some(hits(t)));
    const start = timed(d.accepted) && history.find(e => e && hits(d.accepted)(e.at)
      && (e.event === 'Add' || /^(开始|登记)/.test(e.label || '')));
    for (const e of history) if (e && timed(e.at)) {
      if (e === start) continue;
      const out = e.resolution === 'recovered' ? 'recovered' : e.outcome, kind = SETTLED[out] ? (out === 'to_owner' ? `转给${you()}` : SETTLED[out]) : STEP[out] || '';
      // 同一时刻那一轮已经有一行：不另起一行，这一步的结果（先放着、修好了……）挂在那一轮“修理”“验收”后面
      const own = rows.find(r => r.round && [r.at, r.checkAt].some(hits(e.at)));
      if (own) {
        if (kind && kind !== own.kind && !own.step) Object.assign(own, { step: kind, outcome: out });
        continue;
      }
      if (near(e.at)) continue;
      rows.push({ at: e.at, text: e.outcome_text ?? e.text, kind, outcome: out,
        who: '', href: site(R.runHref(e.automation_run)) || site(e.source_href), why: e.source_unavailable_reason, tag: hiddenTag(Array.isArray(e.rounds) ? e.rounds[0] : null) });
    }
    if (timed(d.accepted)) {
      const href = site(d.registered_by_href) || site(start?.source_href);
      rows.push({ at: d.accepted, kind: '开始', href, linkLabel: repair && href?.startsWith('/live/automation/run/') ? '自动修理那一轮' : '',
        why: d.registered_by_unavailable_reason ?? start?.source_unavailable_reason });
    }
    return rows.sort((a, b) => ms(a.at) - ms(b.at));
  }
  // 本人版：那一轮的对话访客看不到，原位挂“访客看不到”（访客版不挂）
  const hiddenTag = r => r && viewer === 'owner' ? U.visitorLabel(r, 'conversation', '这一轮的对话', viewer) : '';
  function stepText(v) {
    if (v == null) return '';
    if (typeof v !== 'string') return F(v, '这一次做了什么');
    const lines = v.split('\n').map(s => s.trim()).filter(Boolean);
    const tail = esc(lines.at(-1)).replace(/\p{Script=Han}{5,8}[。！？]$/u, '<span class="live-unit">$&</span>');
    if (lines.length < 2) return tail;
    return `${tail}<details class="iss-more" data-fold-anchor><summary>前面写的 ${esc(lines.length - 1)} 段</summary>${lines.slice(0, -1).map(s => `<p>${esc(s)}</p>`).join('')}</details>`;
  }

  function render() {
    const d = item, s = stateOf(d), st = U.status({ level: s.level });
    hero.classList.remove('is-unavailable');
    const title = titleOf(d);
    const head = part('head');
    // 这件事对外换了说法的标题后面挂“对外换了说法”（两版都挂，M930）；本人版访客看不到的挂“访客看不到”
    const shownTitle = publicHtml(F(title, '这件事'), viewer);
    const titleText = document.createElement('template');
    titleText.innerHTML = shownTitle;
    document.title = `${titleText.content.textContent.trim() || '账本一件'} · 实况`;
    U.html(head, `<span class="head__lead">${keepTitleWords(shownTitle)}</span>${(t => t ? ` ${t}` : '')(U.visitorLabel(d, ['$', 'title', 'plain_title', 'text'], '这件事的说法', viewer))}`);
    head.classList.toggle('is-long', [...T(title)].length > 40);

    // 状态一行：灯和欠着／放着 · 在等什么（和“接下来”那句一样时不重复）· 下次几点看 · 第几次看
    const limit = positive(d.check_limit) ? d.check_limit : null, looked = Number.isInteger(d.check_count) ? d.check_count : null;
    const full = looked != null && limit != null && looked >= limit;
    const waitOf = s.group === 'parked' ? d.park?.text != null ? d.park : d.wait : s.group === 'owed' && !s.late ? d.fixer?.text != null ? d.fixer : d.wait : null;
    const wait = waitOf?.text ?? null;
    // 在等什么这句对外换了说法的，原位挂“对外换了说法”（两版都挂，M930；“接下来”那格是同一句时也挂）
    const waitTag = (t => t ? ` ${t}` : '')(waitOf ? U.visitorLabel(waitOf, 'text', '在等什么这句', viewer) : '');
    const next = s.closed ? null : d.story?.next ?? wait;
    const nextAt = !s.closed && !full && timed(d.next_at) ? d.next_at : null;
    const look = s.closed ? '' : full ? `${esc(limit)} 次看满了，AI 停手`
      : nextAt ? `<span>${s.late ? `到点没看，原定 ${clock(nextAt)}` : `下次 ${clock(nextAt)} 看`}</span>` : '';
    const maxChecks = limit == null ? '最多看几次没读到' : `最多 ${esc(limit)} 次`;
    const nth = s.closed || full || looked == null ? '' : `${nextAt ? `第 ${esc(looked + 1)} 次看` : `看过 ${esc(looked)} 次`}，${maxChecks}`;
    // “等约好的时间再看”和后面“下次几点看”是一回事，有钟点时不写这半句
    const dateOnly = (d.park?.kind || d.wait?.kind) === 'wait_date' && nextAt;
    const bits = [`${st.lamp}<b>${esc(s.label)}</b>`, !dateOnly && T(wait) && nodot(T(wait)) !== nodot(T(next)) && F(nodot(wait), '在等什么') + waitTag, look, nth,
      d.running?.href && go(d.running.href, '正在办')].filter(Boolean);
    put(part('state'), bits.map(b => `<span>${b}</span>`).join('')); part('state').hidden = false;
    L.tone(hero, st.tone);

    // 谁几点记下：自动修理查出来的写第一次发现的时刻，AI 约好的写记下的时刻
    const repair = T(d.registered_by) === '自动修理' || T(d.registered_by_text) === '自动修理';
    const who = T(d.registered_by_text) && T(d.registered_by_text) !== '登记人未记下' ? d.registered_by_text : T(d.registered_by) ? d.registered_by : '';
    const born = repair && timed(d.first_at) ? d.first_at : timed(d.accepted) ? d.accepted : d.first_at;
    const src = [timed(born) && `${who ? `${F(who, '谁记的')} ` : ''}${clock(born)} ${repair ? '查出来记下' : '记下'}`,
      s.closed && timed(d.at) && `${clock(d.at)} 了结`].filter(Boolean);
    put(part('src'), src.join(' · ')); part('src').hidden = !src.length;

    // 三格
    const what = d.story?.what ?? d.progress_summary ?? d.outcome_text ?? d.text;
    const cells = [['发生了什么', what], ['有什么影响', d.story?.impact], ['接下来', next]]
      .filter(([, v]) => T(v));
    $('three').style.setProperty('--cells', String(Math.max(1, cells.length)));
    put($('three'), cells.map(([h, v]) => `<section class="dossier-card glass iss-cell"><h2>${h}</h2><p>${F(v, h)}${h === '接下来' && waitTag && nodot(T(v)) === nodot(T(wait)) ? waitTag : ''}</p></section>`).join(''));

    // 每看一次
    const rows = steps(d, repair), isChat = h => /^\/live\/chat\//.test(h || ''), anyChat = rows.some(r => isChat(r.href)), anyRun = rows.some(r => r.href && !isChat(r.href));
    const row = r => {
      const dotKind = r.outcome === 'not_fixed' || r.outcome === 'not_done' ? 'bad' : 'done';
      const repeated = r === rows.at(-1) && cells.some(([, v]) => nodot(T(r.text)) === nodot(T(v)));
      const meta = [r.who && esc(r.who), r.href && go(r.href, r.linkLabel || goName(r.href)), r.tag, T(r.why) && `<span class="iss-why">${F(r.why, '为什么打不开')}</span>`].filter(Boolean).join(' · ');
      return `<li class="run iss-step" data-dot="${dotKind}"><div class="run__main"><p><b class="iss-when">${esc(when(r.at))}</b>${r.kind ? `<span class="iss-kind">${esc(r.kind)}</span>` : ''}${r.step ? `<span class="iss-kind">${esc(r.step)}</span>` : ''}${r.live ? '<span class="iss-kind" data-live>正在办</span>' : ''}${repeated ? '' : stepText(r.text)}</p>${meta ? `<p class="iss-meta">${meta}</p>` : ''}</div></li>`;
    };
    const nextRow = s.closed ? '' : full ? `<li class="run iss-step" data-dot="next"><div class="run__main"><p>${esc(limit)} 次看满了，AI 停手</p></div></li>`
      : nextAt ? `<li class="run iss-step" data-dot="${s.late ? 'late' : 'next'}"><div class="run__main"><p><b class="iss-when">${esc(when(nextAt))}</b>${looked != null ? `第 ${esc(looked + 1)} 次看 · ` : ''}${s.late ? '到点了还没看' : '还没到'}</p></div></li>`
      : T(wait) ? `<li class="run iss-step" data-dot="next"><div class="run__main"><p>下一次：${F(wait, '在等什么')}</p></div></li>` : '';
    const html = rows.map(row).join('') + nextRow;
    put($('steps'), html || `<li class="run run--empty"><p class="run__none">还没看过。</p></li>`);
    $('looks').hidden = false;
    const foot = $('steps-foot');
    foot.textContent = rows.some(r => r.href) ? `每一轮就是那一轮 AI 的对话，点“${anyChat && anyRun ? '那一轮 ›”“那场对话' : anyChat ? '那场对话' : '那一轮'} ›”看它说了什么、做了什么。` : '';
    foot.hidden = !foot.textContent;

    // 右边三张小卡
    const side = [repeatCard(d), sourceCard(d), factsCard(d, s, repair, who, born), rawCard(d)].filter(Boolean);
    put($('side'), side.join(''));
    $('grid').dataset.shape = side.length ? 'two' : 'main';
    heroRead.done(); restRead.done();
    if (first) { first = false; requestAnimationFrame(() => L.lightUp([hero])); }
  }

  // 先取单件的当前故障次数。老读口缺这项时，可用账本里同一件的数补齐。
  const hasWindowCount = d => Number.isInteger(d.faults_in_window) || Number.isInteger(d.broken_30d);
  const faults = d => hasWindowCount(d) ? d : repeat ?? d;
  function repeatCard(d) {
    if (!faultOf(d)) return '';
    const card = body => `<section class="dossier-card glass iss-side iss-repeat"><h2>反复出现</h2><p>${body}</p>${basisOf(d)}</section>`;
    const f = faults(d), windowDays = policy?.repeat_window_days;
    const newCount = Number.isInteger(d.faults_in_window) ? d.faults_in_window : null;
    const range = positive(windowDays) ? `近 ${esc(windowDays)} 天` : newCount != null ? '当前统计期内' : '近 30 天';
    // 反复坏不再按次数转本人（后台 14:00 起改了，跟本人 11-22 定的“转本人只限花钱、登录、拍板这类”一致）
    const rule = esc(`反复坏也照常交 AI 修，修的时候查为什么修不住；要${you()}定、亲手做或补只有${you()}知道的，才转给${you()}。`);
    const reopen = Number.isInteger(d.reopen_count) ? d.reopen_count : f.reopen_count;
    const once = repeat === null && positive(windowDays) && !Number.isInteger(reopen);
    const n = newCount ?? (Number.isInteger(f.broken_30d) ? f.broken_30d : once ? 1 : null);
    const dates = (f.broken_at || []).filter(timed);
    const lastAt = dates.at(-1) || f?.last_at;
    const said = n != null ? `${range}坏了 ${esc(n)} 次${n > 0 && timed(lastAt) ? `，<span class="live-unit">最近一次</span> ${clock(lastAt)}` : ''}。`
      : Number.isInteger(reopen) ? reopen > 0 ? `修好以后又出现过 ${esc(reopen)} 次。` : '修好以后没再出现过。' : '这件坏了几次，这次没读到。';
    const handed = f?.handed_to_owner ? `已转给${you()}${site(f.owner_href) ? ` ${go(f.owner_href, '看那张卡')}` : ''}。` : rule;
    return card(said + handed);
  }
  // 坏了几次的依据（后台 broken_basis，一句话）和误判：近 30 天当时判了坏、现在不算的次数（misjudged_30d），
  // 单件回包给原记录（misjudged_records：时刻、当时记的、为什么不算、那一轮），收在“另有 N 次是误判”里，点开看。后台没给就什么都不写
  function basisOf(d) {
    const f = faults(d);
    const pick = key => f?.[key] ?? d[key];
    const basis = T(pick('broken_basis')), n = Number.isInteger(pick('misjudged_30d')) ? pick('misjudged_30d') : misjudged.length || 0;
    const rows = misjudged.filter(r => r && (timed(r.at) || T(r.summary)));
    const line = basis ? `<p class="iss-basis">怎么算坏：${F(nodot(pick('broken_basis')), '怎么算坏')}。</p>` : '';
    if (!n) return line;
    const head = `另有 ${esc(n)} 次是误判，没算进去`;
    if (!rows.length) return `${line}<p class="iss-basis">${head}。</p>`;
    const row = r => `<li><p><b class="iss-when">${esc(when(r.at))}</b>${T(r.summary) ? F(r.summary, '当时记的') : ''}</p>${T(r.why) || site(r.href) ? `<p class="iss-meta">${[T(r.why) && `不算：${F(r.why, '为什么不算')}`, site(r.href) && go(r.href, goName(r.href))].filter(Boolean).join(' · ')}</p>` : ''}</li>`;
    const records = `<ol>${rows.map(row).join('')}</ol>`;
    if (!U.shouldFold(rows.length)) return `${line}<p class="iss-basis">${head}。</p><div class="iss-more iss-misjudged">${records}</div>`;
    return `${line}<details class="iss-more iss-misjudged" data-fold-anchor><summary class="iss-go live-disclosure">${head}<span aria-hidden="true">›</span></summary>${records}</details>`;
  }
  // 来源：记下这件事的那场对话；没有对话的写后台给的原因（自动修理自己查出来的那句）
  function sourceCard(d) {
    const sc = d.source_conversation && typeof d.source_conversation === 'object' ? d.source_conversation : null;
    if (!sc) return '';
    const host = HOST[String(sc.host || '').toLowerCase()] || '';
    const body = sc.available && site(sc.href) ? go(sc.href, `${host ? `${esc(host)} · ` : ''}${T(sc.title) ? F(sc.title, '对话标题') : '那场对话'}`) : T(sc.unavailable_reason) ? F(sc.unavailable_reason, '来源') : '';
    return body ? `<section class="dossier-card glass iss-side"><h2>来源</h2><p>${body}</p></section>` : '';
  }
  // 这件事：谁记的（点进记下它的那场对话或那一轮）、记下、谁在修、怎么算办完、属于哪一类、关联的项目和卡
  function factsCard(d, s, repair, who, born) {
    // 谁记的：后台给了那一轮的地址就点得进去（对话被藏的那一轮访客也打得开）；后台给了原因（如“这一轮的对话仅本人可见。”）照字写在下面；
    // 本人版：记下它的那一轮对话访客看不到，挂“访客看不到”
    const reg = site(d.registered_by_href);
    const regRound = reg ? [...(Array.isArray(d.rounds) ? d.rounds : []), ...history.flatMap(e => Array.isArray(e?.rounds) ? e.rounds : [])].find(r => r && site(r.source_href) === reg) : null;
    const whoHtml = who ? `${reg ? go(reg, F(who, '谁记的')) : F(who, '谁记的')}${hiddenTag(regRound) && ` ${hiddenTag(regRound)}`}${T(d.registered_by_unavailable_reason) ? `<small>${F(d.registered_by_unavailable_reason, '为什么打不开')}</small>` : ''}` : '';
    const fixer = d.running?.href ? go(d.running.href, '正在办') : s.group === 'owed' && !s.late && T(d.fixer?.text) ? F(d.fixer.text, '谁在修') : '';
    const kind = repair ? ['auto-repair', '自动修理'] : ['ai-commitments', 'AI 约好的事'];
    const belong = `${go('/live/automation/', '自动任务')} <span class="live-unit">${go(R.listHref({ category: kind[0] }), R.categoryName(kind[0], viewer) || kind[1])}</span>`;
    const project = typeof d.project_name === 'string' && d.project_name && d.project ? go(`/live/project/?id=${encodeURIComponent(d.project)}`, esc(d.project_name)) : '';
    const rows = [
      fact('谁记的', whoHtml),
      fact('记下', timed(born) ? esc(when(born)) : ''),
      fact('AI 接手', repair && timed(d.accepted) && d.accepted !== born ? esc(when(d.accepted)) : ''),
      fact('重开次数', Number.isInteger(d.reopen_count) ? esc(d.reopen_count) : ''),
      fact('谁在修', fixer),
      fact('怎么算办完', T(d.done_when) ? F(d.done_when, '怎么算办完') : ''),
      fact('结局', s.closed ? esc(s.label) + (site(d.owner_href) ? ` ${go(d.owner_href, `已放进等${you()}的事`)}` : '') : ''),
      fact('属于', belong),
      fact('项目', project),
      fact('关联任务', T(d.task_name) ? F(d.task_name, '关联任务') : ''),
    ].join('');
    return `<section class="dossier-card glass iss-side"><h2>这件事</h2><dl class="rec-facts iss-facts">${rows}</dl></section>`;
  }

  function rawCard(d) {
    const raw = F(d.text ?? (d.rewrite === 'pending' ? d : null), '事项')
      .replace(/<[^>]+>|数据/g, word => word === '数据' ? '<span class="live-unit">数据</span>' : word);
    const rows = fact('原文', raw) + fact('最近更新', timed(d.changed) ? esc(when(d.changed)) : '');
    if (!rows) return '';
    return `<details class="dossier-card dossier-card--raw glass" id="raw" data-fold-anchor${$('raw')?.open ? ' open' : ''}>
      <summary class="dossier-card__title dossier-fold live-disclosure"><span class="dossier-icon" data-icon="raw" aria-hidden="true"></span><span class="iss-nowrap">原始记录</span>
        <span class="live-unit" style="margin-inline-start:auto"><span class="disclosure-closed">展开看原始记录全文</span><span class="disclosure-open">收起</span> <span class="dossier-fold__chev" style="display:inline-block" aria-hidden="true">›</span></span></summary>
      <dl class="rec-facts">${rows}</dl>
      <button type="button" class="more" data-close-raw>收起 <span class="more__chev" aria-hidden="true">‹</span></button></details>`;
  }
  $('side').addEventListener('click', e => {
    const summary = e.target.closest('[data-close-raw]')?.parentElement.querySelector('summary');
    if (!summary) return;
    summary.click();
    summary.focus({ preventScroll: true });
    summary.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  });

  // 单件的现行读口已带齐时，省掉对账本列表的补读。
  async function loadRepeat() {
    if (repeatAsked || !item || !faultOf(item) || hasWindowCount(item) && policy) return;
    repeatAsked = true;
    const want = item, kind = viewer;
    const r = await window.Live.get('ledger', null).catch(() => null);
    if (item !== want && item?.id !== want.id || kind !== viewer) { repeatAsked = false; return; }
    policy ??= r?.data?.policy;
    const repeats = r?.data?.repeat_fixes, rows = repeats?.items;
    repeat = Array.isArray(rows) && !repeats.missing
      ? rows.find(x => x && (x.id === item.id || x.issue && x.issue === item.issue)) ?? null : undefined;
    if (item) render();
  }

  // 定了说法（不在账上、读不到、没权限）以后，读数状态再报一遍也不把这句盖回“这件事暂时读不到”；真读到这一件再照常画
  let ended = false;
  function empty(message, detail = '') {
    ended = true; delete hero.dataset.updating;
    const head = part('head'), src = part('src');
    U.html(head, `<span class="head__lead">${keepTitleWords(esc(message).replace(/\b\d{1,2}-\d{2} \d{2}:\d{2}\b/g, '<span class="iss-nowrap">$&</span>'))}</span>`);
    head.classList.toggle('is-long', Boolean(detail) && [...message].length > 40);
    U.html(src, detail); src.hidden = !detail; part('state').hidden = true;
    $('rest').hidden = true; L.tone(hero, 'gray'); heroRead.done(); restRead.done(); L.lightUp([hero]);
  }
  // 访客版读口撤回（503 live_publication_revoked，访客版正在重新生成）：这一件旧的标题、状态、三格、经过、右栏全清，
  // 页头大卡铺满第一屏当这一页的封面：只写这一句，配这件放大的画（账本 48，两版同一个样子；摆法在 issue.css）。
  // 先前两版只剩一条字、上下大片空，像没加载完。读口恢复后 data() 照常画回
  const UPDATING = '这一件正在更新访客版，稍后自动补上。';
  function updating() {
    if (ended === UPDATING) return;
    ended = UPDATING; item = at = null; history = []; misjudged = []; policy = repeat = undefined; repeatAsked = false;
    document.title = '账本一件 · 实况';
    U.html(part('head'), `<span class="head__lead"><span>这一件正在更新<span class="iss-nowrap">访客版</span>，</span><span>稍后自动补上。</span></span>`);
    part('head').classList.remove('is-long');
    for (const name of ['state', 'src']) { U.html(part(name), ''); part(name).hidden = true; }
    for (const key of ['three', 'steps', 'side']) U.html($(key), '');
    $('steps-foot').textContent = ''; $('steps-foot').hidden = $('looks').hidden = $('rest').hidden = true;
    hero.dataset.updating = '';
    L.tone(hero, 'gray'); heroRead.done(); restRead.done(); L.lightUp([hero]);
  }

  let checkedViewer = false;
  const readBody = s => {
    const waiting = !s.offline && (s.data?.q === 'warming' || s.phase === 'none' && s.conn?.stage === 'retrying');
    const reading = waiting ? { ...s, phase: 'wait' } : s;
    heroRead.set(reading); restRead.set(reading);
    return reading.phase;
  };
  if (!id) empty('没有说是哪一件');
  else window.Live.watch(`ledger/${encodeURIComponent(id)}`, null, {
    phase(s) { if (!item && !ended) readBody(s); },
    data(d, meta) {
      const kind = meta.viewer?.kind || 'public';
      if (kind !== viewer && d?.q === 'warming' && item) { item = null; empty('正在准备'); }
      if (kind !== viewer) { viewer = kind; policy = undefined; repeat = undefined; repeatAsked = false; }
      if (!d?.item?.id || d.q === 'warming') return;
      $('rest').hidden = false; ended = false; delete hero.dataset.updating;
      at = meta.at || d.at || null; item = d.item; policy = d.policy ?? policy; history = Array.isArray(d.history) ? d.history : [];
      misjudged = Array.isArray(d.misjudged_records) ? d.misjudged_records : Array.isArray(d.item.misjudged_records) ? d.item.misjudged_records : [];
      render(); loadRepeat();
    },
    link(s) {
      try {
        const missing = s.meta?.status === 404 ? s.link?.ledger_missing : null;
        const holding = item && at && s.data?.q === 'warming';
        bar?.set(missing?.text || missing?.prefix ? { ...s, shownAt: s.link.seen }
          : holding ? { ...s, shownAt: at, meta: { ...s.meta, at } } : s);
        L.offline(s.offline);
        U.list($('notices'), s.offline ? [{ key: 'offline', cls: 'notice glass', html: `<span class="lamp" aria-hidden="true"></span><span>${U.fieldHtml(s.text)}</span>` }] : []);
        if (s.meta?.publicationRevoked) { updating(); return; }
        if (s.meta?.status === 403) { item = null; empty(s.text || '没有权限读这一件'); return; }
        if (item) { if (s.offline) render(); return; }
        if (s.meta?.status === 404) {
          // 缺件回包没有 viewer；沿用授权读口核对设备，由 Live 更新版本切换。
          if (!checkedViewer && !window.LiveView?.isPublic()) {
            checkedViewer = true;
            void window.Live.get('access');
          }
          const { text, prefix, target, headline, original_title: originalTitle } = missing ?? {};
          const titleLine = headline && typeof originalTitle === 'string' && [...originalTitle].length > 24;
          const related = target ? (text ? `${esc(prefix)}<br>` : '') +
            go(`/live/issue/?id=${encodeURIComponent(target.id)}`, keepTitleWords(esc(target.title))) +
            U.visitorLabel(target, '$', '换号后的那件', 'owner') : '';
          return empty((titleLine && headline) || text || prefix || '这一件暂时读不到',
            [titleLine && `原题：${esc(originalTitle)}`, related].filter(Boolean).join('<br>'));
        }
        if (ended) return;
        const phase = readBody(s);
        if (phase === 'gone') empty(s.viewer?.kind === 'owner' ? '离线时没存这件的详情' : '这一件暂时读不到');
        else if (phase === 'none') empty('这一件暂时读不到');
      } finally {
        const old = !ended && item && at && !s.offline && (s.warming || s.meta?.status >= 500) && !s.meta?.publicationRevoked;
        U.blockNote(hero.querySelector('.card__body'), old && !s.fallbackNote ? { fallbackNote: `截至 ${when(at)}` } : s);
        U.blockNote($('rest'), s);
      }
    },
  });
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();
