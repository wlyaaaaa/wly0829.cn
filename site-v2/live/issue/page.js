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
  let viewer = 'public', item = null, history = [], misjudged = [], at = null, repeat, repeatAsked = false, first = true;
  const route = href => { const u = new URL(href, location.origin); if (u.origin !== location.origin) return href; if (p.has('fixture')) u.searchParams.set('fixture', p.get('fixture')); return u.pathname + u.search + u.hash; };
  const site = h => typeof h === 'string' && h.startsWith('/live/') ? R.runPage(h) : '';
  const F = (v, name = '') => U.fieldHtml(v, { name, kind: viewer });
  const T = v => U.fieldText(v ?? '', viewer).trim();
  const you = () => viewer === 'owner' ? '你' : '本人';
  // 访客版称呼：本页上“你”都写“本人”，后台写进句子里的也算（“你们”不动）；本人版原样
  const say = html => viewer === 'owner' ? html : String(html).replace(/你(?!们)/g, '本人');
  const put = (el, html) => U.html(el, say(html));
  const timed = R.timed, ms = x => Date.parse(x);
  const when = x => R.when(x, at || new Date().toISOString(), { relative: true });
  const clock = x => `<time datetime="${esc(x)}">${esc(when(x))}</time>`;
  const nodot = v => typeof v === 'string' ? v.trim().replace(/[。.]$/u, '') : v;
  const go = (href, text) => site(href) ? `<a class="iss-go" href="${esc(route(site(href)))}">${text}&nbsp;›</a>` : text;
  const fact = (k, v) => v ? `<div class="rec-fact"><dt>${k}</dt><dd>${v}</dd></div>` : '';
  // 那一轮还是那场对话：看地址是自动任务的一轮还是对话页
  const goName = href => /^\/live\/chat\//.test(href) ? `${HOST[(new URL(href, location.origin).searchParams.get('id') || '').split(':')[0]] || ''} 那场对话`.trim() : '那一轮';
  const titleOf = d => T(d.plain_title) ? d.plain_title : T(d.title) ? d.title : d.text;

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
  // 这次看记在哪一轮里（那一轮开始以后、结束后 10 分钟内记下的，取结束得最近的）就并进那一轮那一行，不另起一行；那一轮缺的型号档位、地址拿这次看的补上，那场对话另挂一个链接。
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
        if (!hit.href && (own || chat)) Object.assign(hit, { href: own || chat, chat: own && chat !== own ? chat : '', why: c.source_unavailable_reason });
        else if (chat && chat !== hit.href) hit.chat = chat;
        hit.checkAt = c.at;
        continue;
      }
      rows.push({ at: c.at, text: c.text, kind: '', who, href: own || chat, chat: own && chat !== own ? chat : '', why: c.source_unavailable_reason });
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
        who: '', href: site(e.source_href) || site(e.automation_run?.href), why: e.source_unavailable_reason, tag: hiddenTag(Array.isArray(e.rounds) ? e.rounds[0] : null) });
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
    return `${tail}<details class="iss-more"><summary>前面写的 ${esc(lines.length - 1)} 段</summary>${lines.slice(0, -1).map(s => `<p>${esc(s)}</p>`).join('')}</details>`;
  }

  function render() {
    const d = item, s = stateOf(d), st = U.status({ level: s.level });
    hero.classList.remove('is-unavailable');
    const title = titleOf(d);
    document.title = `${T(title) || '账本一件'} · 实况`;
    const head = part('head');
    // 这件事对外换了说法的标题后面挂“对外换了说法”（两版都挂，M930）；本人版访客看不到的挂“访客看不到”
    put(head, `<span class="head__lead">${F(title, '这件事')}</span>${(t => t ? ` ${t}` : '')(U.visitorLabel(d, ['$', 'title', 'plain_title', 'text'], '这件事的说法', viewer))}`);
    head.classList.toggle('is-long', [...T(title)].length > 40);

    // 状态一行：灯和欠着／放着 · 在等什么（和“接下来”那句一样时不重复）· 下次几点看 · 第几次看
    const limit = d.check_limit || 3, looked = Number.isInteger(d.check_count) ? d.check_count : null, full = looked != null && looked >= limit;
    const waitOf = s.group === 'parked' ? d.park?.text != null ? d.park : d.wait : s.group === 'owed' && !s.late ? d.fixer?.text != null ? d.fixer : d.wait : null;
    const wait = waitOf?.text ?? null;
    // 在等什么这句对外换了说法的，原位挂“对外换了说法”（两版都挂，M930；“接下来”那格是同一句时也挂）
    const waitTag = (t => t ? ` ${t}` : '')(waitOf ? U.visitorLabel(waitOf, 'text', '在等什么这句', viewer) : '');
    const next = s.closed ? null : d.story?.next ?? wait;
    const nextAt = !s.closed && !full && timed(d.next_at) ? d.next_at : null;
    const look = s.closed ? '' : full ? `${esc(limit)} 次看满了，AI 停手`
      : nextAt ? `<span>${s.late ? `到点没看，原定 ${clock(nextAt)}` : `下次 ${clock(nextAt)} 看`}</span>` : '';
    const nth = s.closed || full || looked == null ? '' : nextAt ? `第 ${esc(looked + 1)} 次看，最多 ${esc(limit)} 次` : `看过 ${esc(looked)} 次，最多 ${esc(limit)} 次`;
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
    const cells = [['发生了什么', what], ['有什么影响', d.story?.impact], ['接下来', s.closed ? `已经了结：${s.label}，不再看了。` : next]]
      .filter(([, v]) => T(v));
    $('three').style.setProperty('--cells', String(Math.max(1, cells.length)));
    put($('three'), cells.map(([h, v]) => `<section class="dossier-card glass iss-cell"><h2>${h}</h2><p>${F(v, h)}${h === '接下来' && waitTag && nodot(T(v)) === nodot(T(wait)) ? waitTag : ''}</p></section>`).join(''));

    // 每看一次
    const rows = steps(d, repair), isChat = h => /^\/live\/chat\//.test(h || ''), anyChat = rows.some(r => isChat(r.href) || isChat(r.chat)), anyRun = rows.some(r => r.href && !isChat(r.href));
    const row = r => {
      const dotKind = r.outcome === 'not_fixed' || r.outcome === 'not_done' ? 'bad' : 'done';
      const meta = [r.who && esc(r.who), r.href && go(r.href, r.linkLabel || goName(r.href)), r.chat && go(r.chat, goName(r.chat)), r.tag, T(r.why) && `<span class="iss-why">${F(r.why, '为什么打不开')}</span>`].filter(Boolean).join(' · ');
      return `<li class="run iss-step" data-dot="${dotKind}"><div class="run__main"><p><b class="iss-when">${esc(when(r.at))}</b>${r.kind ? `<span class="iss-kind">${esc(r.kind)}</span>` : ''}${r.step ? `<span class="iss-kind">${esc(r.step)}</span>` : ''}${r.live ? '<span class="iss-kind" data-live>正在办</span>' : ''}${stepText(r.text)}</p>${meta ? `<p class="iss-meta">${meta}</p>` : ''}</div></li>`;
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

  // 反复出现：只对自动修理查出来的故障。近 30 天坏了几次从账本的“反复出现”里取（单件读口没给）；不在那里面就是这 30 天只坏了这一次
  function repeatCard(d) {
    // AI 约好的事也带 object（就是那句话），不能拿它判；自动修理查出来的件编号以 auto- 开头
    const fault = T(d.registered_by) === '自动修理' || T(d.registered_by_text) === '自动修理' || /^auto-/.test(String(d.id || ''));
    if (!fault || repeat === undefined) return '';
    const card = body => `<section class="dossier-card glass iss-side"><h2>反复出现</h2><p>${body}</p>${basisOf(d)}</section>`;
    const rule = `30 天内第 3 次坏，自动修理停手、转给${you()}。`;
    if (!repeat) return card(`近 30 天只坏了这一次。${rule}`);
    const n = Number.isInteger(repeat.broken_30d) ? repeat.broken_30d : null, dates = (repeat.broken_at || []).filter(timed);
    const lastAt = dates.length ? dates.at(-1) : repeat.last_at;
    const said = n != null ? `近 30 天坏了 ${esc(n)} 次${timed(lastAt) ? `，最近一次 ${clock(lastAt)}` : ''}。` : Number.isInteger(repeat.reopen_count) ? `修好以后又出现过 ${esc(repeat.reopen_count)} 次。` : '';
    const handed = repeat.handed_to_owner ? `已转给${you()}${site(repeat.owner_href) ? ` ${go(repeat.owner_href, '看那张卡')}` : ''}。` : n != null && n < 3 ? rule : '';
    return said || handed ? card(said + handed) : '';
  }
  // 坏了几次的依据（后台 broken_basis，一句话）和误判：近 30 天当时判了坏、现在不算的次数（misjudged_30d），
  // 单件回包给原记录（misjudged_records：时刻、当时记的、为什么不算、那一轮），收在“另有 N 次是误判”里，点开看。后台没给就什么都不写
  function basisOf(d) {
    const pick = key => repeat && repeat[key] != null ? repeat[key] : d[key];
    const basis = T(pick('broken_basis')), n = Number.isInteger(pick('misjudged_30d')) ? pick('misjudged_30d') : misjudged.length || 0;
    const rows = misjudged.filter(r => r && (timed(r.at) || T(r.summary)));
    const line = basis ? `<p class="iss-basis">怎么算坏：${F(nodot(pick('broken_basis')), '怎么算坏')}。</p>` : '';
    if (!n) return line;
    const head = `另有 ${esc(n)} 次是误判，没算进去`;
    if (!rows.length) return `${line}<p class="iss-basis">${head}。</p>`;
    const row = r => `<li><p><b class="iss-when">${esc(when(r.at))}</b>${T(r.summary) ? F(r.summary, '当时记的') : ''}</p>${T(r.why) || site(r.href) ? `<p class="iss-meta">${[T(r.why) && `不算：${F(r.why, '为什么不算')}`, site(r.href) && go(r.href, goName(r.href))].filter(Boolean).join(' · ')}</p>` : ''}</li>`;
    return `${line}<details class="iss-more iss-misjudged"><summary class="iss-go live-disclosure">${head}<span aria-hidden="true">›</span></summary><ol>${rows.map(row).join('')}</ol></details>`;
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
    const belong = `${go('/live/automation/', '自动任务')} ${go(R.listHref({ category: kind[0] }), R.categoryName(kind[0], viewer) || kind[1])}`;
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
    const rows = fact('原文', F(d.text ?? (d.rewrite === 'pending' ? d : null), '事项'))
      + fact('最近更新', timed(d.changed) ? esc(when(d.changed)) : '');
    if (!rows) return '';
    return `<details class="dossier-card dossier-card--raw glass" id="raw"${$('raw')?.open ? ' open' : ''}>
      <summary class="dossier-card__title dossier-fold live-disclosure"><span class="dossier-icon" data-icon="raw" aria-hidden="true"></span>原始记录<span class="dossier-fold__chev" aria-hidden="true">›</span></summary>
      <dl class="rec-facts">${rows}</dl></details>`;
  }

  // 反复出现那张卡要的数在账本列表里：读一次，不跟着每轮刷新
  async function loadRepeat() {
    if (repeatAsked || !item) return;
    repeatAsked = true;
    if (Number.isInteger(item.broken_30d)) { repeat = item; render(); return; }
    const want = item, kind = viewer;
    const r = await window.Live.get('ledger', null).catch(() => null);
    if (item !== want && item?.id !== want.id || kind !== viewer) { repeatAsked = false; return; }
    const rows = r?.data?.repeat_fixes?.items;
    repeat = Array.isArray(rows) ? rows.find(x => x && (x.id === item.id || x.issue && x.issue === item.issue)) || null : undefined;
    if (item) render();
  }

  // 定了说法（不在账上、读不到、没权限）以后，读数状态再报一遍也不把这句盖回“这件事暂时读不到”；真读到这一件再照常画
  let ended = false;
  function empty(message) {
    ended = true;
    U.html(part('head'), `<span class="head__lead">${esc(message)}</span>`);
    part('state').hidden = part('src').hidden = true;
    $('rest').hidden = true; L.tone(hero, 'gray'); heroRead.done(); restRead.done(); L.lightUp([hero]);
  }

  if (!id) empty('没有说是哪一件');
  else window.Live.watch(`ledger/${encodeURIComponent(id)}`, null, {
    phase(s) { if (!item && !ended) { heroRead.set(s); restRead.set(s); } },
    data(d, meta) {
      const kind = meta.viewer?.kind || 'public';
      if (kind !== viewer) { viewer = kind; repeat = undefined; repeatAsked = false; }
      if (!d?.item?.id) { if (d?.q === 'warming' && !item) empty('正在准备'); return; }
      $('rest').hidden = false; ended = false;
      at = meta.at || d.at || null; item = d.item; history = Array.isArray(d.history) ? d.history : [];
      misjudged = Array.isArray(d.misjudged_records) ? d.misjudged_records : Array.isArray(d.item.misjudged_records) ? d.item.misjudged_records : [];
      render(); loadRepeat();
    },
    link(s) {
      try {
        bar?.set(s); L.offline(s.offline);
        U.list($('notices'), s.offline ? [{ key: 'offline', cls: 'notice glass', html: `<span class="lamp" aria-hidden="true"></span><span>${U.fieldHtml(s.text)}</span>` }] : []);
        if (s.meta?.status === 403) { item = null; empty(s.text || '没有权限读这一件'); return; }
        if (item) { if (s.offline) render(); return; }
        if (s.meta?.status === 404) { empty('这件不在账上了，可能已经并进别的一件'); return; }
        if (ended) return;
        heroRead.set(s); restRead.set(s);
        if (s.phase === 'gone') empty('这块没存下来，连上后补上。');
        else if (s.phase === 'none') empty('这一件暂时读不到');
      } finally { [hero.querySelector('.card__body'), $('rest')].forEach(el => U.blockNote(el, s)); }
    },
  });
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();
