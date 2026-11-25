// 一件事与问题共用档案卡；旧版服务没有单条问题接口时翻账本。
// 两页都换成了档案卡（_lib/live-dossier.*）：页上有 data-part="lead" 这个槽就按档案卡摆——长句拆出短标题、长说明进正文、
// 状态和按钮进右边的状态卡、相关链接一行一块、多一张收着的原始记录。没有这个槽的旧页面照旧走原来的写法。
(() => {
  'use strict';
  const marker = (v, kind, name = '内容') => v && (v.hidden || v.visibility || v.public || v.rewrite) ? window.LiveUI.fieldHtml({ text: kind === 'owner' ? '' : undefined, hidden: kind !== 'owner' && (v.hidden || v.visibility === 'owner' || v.public === 'owner'), visibility: v.visibility, public: v.public, rewrite: v.rewrite, hidden_what: v.hidden_what }, { name, kind }) : '';
  const U = window.LiveUI, L = window.LiveLight, { esc, sp } = U, $ = id => document.getElementById(id);
  const p = new URLSearchParams(location.search), id = p.get('id'), issue = document.body.dataset.record === 'issue';
  const hero = $('hero'), part = name => document.querySelector(`[data-part="${name}"]`);
  const D = window.LiveDossier, dossier = !!(D && part('lead'));
  const issueReadings = issue ? window.LiveIssueReadings : null;
  const route = href => { const u = new URL(href, location.origin); if (u.origin !== location.origin) return href; if (p.has('fixture')) u.searchParams.set('fixture', p.get('fixture')); return u.pathname + u.search + u.hash; };
  const when = at => at ? `${U.date(at)} ${U.time(at)}` : U.offline?.() ? '' : U.collectionText();
  const pending = d => d?.rewrite === 'pending' && !d.text && !d.value;
  const text = d => sp(d?.text && typeof d.text === 'object' ? { ...d, ...d.text } : d) || (U.offline?.() ? '' : U.collectionText());
  // 只照接口明确的本人标记隐藏；改写状态和操作权限不改变已提供的正文。
  const say = (value, what = '事项内容') => U.fieldHtml(value == null ? U.offline?.() ? '' : U.collectionText() : value, { name: what, kind: viewer });
  const fact = (name, value, extraClass = '') => `<div class="rec-fact${extraClass}"><dt>${name}</dt><dd class="rec-prose">${value}</dd></div>`;
  const optionActions = (d, q) => U.actions({ id: `${d.id}:question:${q.id}`, text: text(d) }, q.options.map(o => { const label = sp(o); return { kind: 'copy', label, text: U.choiceText(d, text(d), q, o) }; }));
  const OUT = { fixed: '修好', not_fixed: '没修好', wont_fix: '定了不修', deferred: '暂时不修', to_owner: '转给你' };
  const STATE = { working: '在做', waiting: '在等', deferred: '放一放', wont_fix: '不改' };
  const EVENT = { Add: '登记', Reopen: '重新打开', Review: '核对', Close: '关闭' };
  const CLOSED = { done: '你办完了', declined: '你说不办了', expired: '展示期已到', ai_closed: 'AI 关的', acknowledged: '本人已知', merged: '并进了别的条', unknown: '当时只记了关闭' };
  const KIND = { choose: '要你选', do: '要你做', later: '你放着', know: '要你知道' };
  let viewer = 'public', record = null, at = null, historyRows = [], next = null, coverage = null, first = true, searching = false, revision = 0;
  const pages = new Map();
  const bar = U.topbar({ ask: () => record ? `请看实况 ${issue ? '账本' : '事项'} ${record.id}（${at ? `${U.time(at)} 的数，` : ''}${text(record)}），请说明现在的情况。` : '' });
  L.add(hero);
  const back = document.querySelector('[data-back]');
  let from = null;
  // 从哪进来就回哪：自动任务页、一轮的详情（“去那张卡 ›”“去账本那件 ›”点进来的）也认，返回回到那一轮
  const runPage = url => url.pathname.startsWith('/live/automation/') && (url.searchParams.has('run') || /\/run\/$/.test(url.pathname));
  try { const url = new URL(document.referrer); if (url.origin === location.origin && (['/live/', '/live/items/', '/live/ledger/', '/live/project/', '/live/automation/'].includes(url.pathname) || runPage(url))) from = url; } catch {}
  back.href = from ? from.pathname + from.search + from.hash : route(issue ? '/live/ledger/' : '/live/items/');
  back.textContent = from ? runPage(from) ? '这一轮' : ({ '/live/': '实况', '/live/items/': '等你的事', '/live/ledger/': 'AI 自动任务账本', '/live/project/': '项目', '/live/automation/': '自动任务' })[from.pathname] : issue ? 'AI 自动任务账本' : '等你的事';
  back.addEventListener('click', U.restoreBack);
  const heroRead = U.reading(hero.querySelector('.card__body'), { ghost: U.ghost.card(2), name: '这件事' });
  const detailsRead = U.reading($('rec'), { ghost: U.ghost.rows(4), slow: false });
  const more = $('events-more');
  $('earlier').setAttribute('data-needs-pc', '');
  U.fold(more, $('events-box-rest'));
  if ($('raw-more')) U.fold($('raw-more'), $('raw-box'));
  // 经过先摆几条、待答的问题先摆几条，其余收进“更早的 N 条”“还有 N 个问题”；档案卡各 5 条，账本一条照旧 6 条。
  const FIRST = dossier ? 5 : 6, FIRST_QUESTIONS = 5;
  let foldedRuns = null;
  function moreLabel() { U.html(more, more.getAttribute('aria-expanded') === 'true' ? '收起 <span class="more__chev">›</span>' : `更早的 ${Math.max(0, foldedRuns ?? historyRows.length - 6)} 条 <span class="more__chev">›</span>`); }
  more.addEventListener('click', moreLabel);
  const askMore = $('questions-more');
  function askLabel() { if (askMore) U.html(askMore, askMore.getAttribute('aria-expanded') === 'true' ? '收起 <span class="more__chev">›</span>' : `还有 ${Math.max(0, (record?.questions?.length || 0) - FIRST_QUESTIONS)} 个问题 <span class="more__chev">›</span>`); }
  if (askMore) { U.fold(askMore, $('questions-box-rest')); askMore.addEventListener('click', askLabel); }

  const sentences = s => s.match(/[^\n。！？]+(?:[。！？]+[”’」』"]*)?/gu) || [];
  const contentKey = s => s.replace(/[\s。！？]+$/gu, '').trim();
  const newBody = (values, shown) => {
    const seen = new Set(shown.filter(s => typeof s === 'string').flatMap(s => sentences(s).map(contentKey)));
    // 带可见性标记的那段（不是纯文字）也记进写过的句子，后面同一句不再重复写一遍
    values.filter(s => s && typeof s === 'object').forEach(s => sentences(U.fieldText(s, viewer) || '').forEach(line => { const key = contentKey(line); if (key) seen.add(key); }));
    return values.filter(Boolean).map(s => typeof s !== 'string' ? s : sentences(s).filter(line => {
      const key = contentKey(line);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map(line => line.trim()).join('\n')).filter(Boolean);
  };

  function render() {
    hero.classList.remove('is-unavailable');
    const d = record, privateItem = viewer === 'public' && (d.visibility === 'owner' || d.public === 'owner');
    const latest = issue && historyRows.find(e => e.id === d.id);
    const attempted = !privateItem && d.kind === 'ledger' && d.event === 'attempt' && latest?.event === 'attempt' && d.at && latest.at === d.at
      && d.outcome == null && d.state == null && !d.closed_at && !d.outcome_text;
    const label = issue ? OUT[d.outcome] || STATE[d.state] || (attempted ? '已尝试处理，结果未记录' : '')
      : d.closed ? CLOSED[d.closed.kind] || '已了结'
      : d.verifying ? '待 AI 核实' : Date.parse(d.snoozed_until) > Date.now() ? '晚点再提醒' : KIND[d.kind];
    const kindLabel = !issue && viewer === 'public' ? label?.replaceAll('你', '本人') : label;
    $('questions').querySelector('.rec-part').textContent = viewer === 'public' ? '要本人选的' : '要你选的';
    const status = U.status({ ...d, level: issue ? d.header_level ?? d.level : d.header_level });
    const original = U.fieldText(d.text || d, viewer);
    const shortTitle = issue && !privateItem && U.fieldText(d.plain_title, viewer).trim();
    const completeTitle = shortTitle && U.fieldText(d.title, viewer).trim();
    const title = privateItem ? '事项' : completeTitle && (!original || original === shortTitle) ? completeTitle : original;
    const hasDistinctShort = shortTitle && shortTitle !== title && shortTitle !== completeTitle;
    const cut = dossier && !privateItem && !hasDistinctShort ? D.split(title) : { title, rest: '' };
    if (dossier && !cut.rest && (!issue ? [...title].length > 30 : !hasDistinctShort && !d.outcome_text && !d.progress_summary)) {
      const [, head, rest] = title.match(/^(.{6,30}?)[，、：]\s*(.+)$/u) || [];
      if (rest) Object.assign(cut, { title: head, rest });
    }
    const progress = d.progress_summary || d.detail_text || d.owner_detail || d.reason;
    const description = issue && !d.outcome_text && !progress && !d.state ? cut.rest : '';
    const lead = !issue && cut.rest ? D.sentence(cut.rest) : { head: description ? '' : cut.rest, rest: '' };
    document.title = `${cut.rest ? sp(cut.title) : hasDistinctShort ? title : text(d)} · 实况`;
    const head = part('head');
    // M688：本人版标题旁挂签，按后台给在这件事上的 visitor_labels（标题键 text，'$' 是整件）；没有差异键的普通原文不挂
    const visitorMark = !issue ? U.visitorLabel(d, ['$', 'text'], '这件事的说法', viewer) : '';
    U.html(head, (dossier ? '' : status.lamp) + U.head(cut.title, { name: issue ? '账本事项' : '事项', lamp: false }) + (visitorMark ? `<span class="head__rewrite">${visitorMark}</span>` : ''));
    issueReadings?.breakHeading(head.querySelector('.head__lead'));
    if (dossier) {
      part('head').classList.toggle('is-long', [...cut.title].length > 40);
      part('lamp').hidden = !status.lamp; U.html(part('lamp'), status.lamp);
      part('lead').hidden = privateItem || !lead.head; U.html(part('lead'), lead.head ? `<p>${say(lead.head)}</p>` : '');
      part('state').hidden = !kindLabel; U.html(part('state'), U.fieldHtml(kindLabel || ''));
      // 状态卡的小图：了结了画勾；只有“办完了”“修好”是绿勾，其余了结是灰勾，不另判别的。
      const card = part('state').closest('.dossier-card');
      card.dataset.state = d.closed || issue && OUT[d.outcome] ? 'closed' : 'open';
      card.toggleAttribute('data-good', d.closed?.kind === 'done' || issue && d.outcome === 'fixed');
    }
    const born = d.episode_at || d.born || (issue && d.accepted);
    const elapsed = born && d.closed?.at ? Date.parse(d.closed.at) - Date.parse(born) : NaN;
    const timeSpent = d.closed ? (elapsed >= 0 ? `用了 ${elapsed < 60000 ? '不到 1 分钟' : U.minutes(Math.round(elapsed / 60000))}` : '') : d.kind !== 'know' && d.minutes != null ? `约 ${U.minutes(d.minutes)}` : '';
    const bits = [!dossier && kindLabel, typeof d.project_name === 'string' && d.project_name, issue && d.round != null && `第 ${d.round} 轮`, dossier && issue && d.age_days != null && `跟了 ${d.age_days} 天`, (issue || !dossier) && born && `${when(born)} 开始`, !dossier && d.due && `${when(d.due)} 前`, !issue && timeSpent].filter(Boolean);
    part('meta').hidden = !bits.length; U.html(part('meta'), bits.map(x => `<span>${U.fieldHtml(x)}</span>`).join(''));
    // 等你的事：多一行“来源：替你看新消息 · 11-23 22:30 那一轮 ›”，点了到那一轮；后台没写明哪一轮的老卡不写（本人 11-24 定的来回的路）
    const runs = !issue && !privateItem && window.LiveRuns ? window.LiveRuns.sources(d, viewer) : [];
    if (part('source')) { part('source').hidden = !runs.length; U.html(part('source'), runs.length ? `来源：${runs.map(r => (r.href ? `<a href="${esc(route(r.href))}">${esc(r.label)} ›</a>` : esc(r.label)) + (runs.length > 1 && r.action ? `<small>${esc(r.action)}</small>` : '')).join('、')}` : ''); }
    const check = d.origin?.last_check;
    const oldStamp = [d.stale_text, d.why].map(v => U.fieldText(v, viewer)).join(' ').match(/最近一次记录于\s*((?:\d\d-\d\d\s+)?\d\d:\d\d)/u)?.[1];
    let readout = d.status_subject ? d.why || d.stale_text : oldStamp && `事项状态上次记录于 ${oldStamp}`;
    if (typeof readout === 'string') readout = readout.replace(/，此后没有新读数[。]?$/u, '');
    const missing = [...new Set(d.partial || [])].map(key => d.missing_names?.[key] || (/[一-鿿]/u.test(key) ? key : d.missing?.[key])).filter(Boolean);
    const checkResult = check?.text || { authenticated: '已登录', expired: '登录已过期', timeout: '检查超时', unknown: '未核实' }[check?.status];
    const checkText = [check?.checked_at && esc(when(check.checked_at)), checkResult && say(checkResult, '核验结果')].filter(Boolean).join(' · ');
    const notes = (issue ? [status.note] : [
      missing.length && `缺：${missing.map(name => say(name, '缺少读数')).join('、')}`,
      checkText && `最后确认（来源核验）：${checkText}`,
      readout ? say(readout, '事项状态') : d.gap && say(d.gap, '缺少读数'),
    ]).filter(Boolean).map(line => `<small>${line}</small>`).join('');
    const note = dossier && part('note'), body = part('say');
    const summary = issue && (d.outcome_text || progress || description);
    const reason = issue && dossier && typeof summary === 'string' ? D.sentence(summary) : { head: summary, rest: '' };
    const now = /^(?:这次没读到|最近一次记录于|最近一次事项状态记录于)/u.test(U.fieldText(d.now, viewer)) ? null : d.now;
    const explanation = d.explanation?.why || (d.explanation?.visibility ? d.explanation : now);
    const bodyValues = [explanation?.visibility || explanation?.rewrite ? explanation : explanation?.text ?? explanation, lead.rest, d.detail_text], bodyShown = [cut.title, lead.head, ...historyRows.map(e => e.text)];
    const bodyFields = !issue && newBody(bodyValues, bodyShown);
    // M688：展开说明里真写出了 detail_text（排在最后一段）的，后台标了 detail_text 就在说明后挂签；和标题的签各在各处，一处只挂一个
    const detailTag = !issue && d.detail_text && bodyFields.length > newBody(bodyValues.slice(0, 2), bodyShown).length ? U.visitorLabel(d, 'detail_text', '这件事的说明', viewer) : '';
    const issueSay = value => issueReadings ? issueReadings.conclusion(say(value)) : say(value);
    const sayHead = issue ? (summary ? (reason.rest ? `<details class="dossier-text"><summary>${issueSay(reason.head)}</summary><p>${issueSay(reason.rest)}</p></details>` : issueSay(summary)) : '')
      : bodyFields.map(value => say(value).replace(/\n/g, '<br>')).join('<br>') + (detailTag ? ` ${detailTag}` : '');
    if (body) {
      body.hidden = !sayHead && !(notes && !note);
      U.html(body, (issue && summary && !d.outcome_text ? `<small>${description ? '问题说明' : '当前进展'}</small>` : '') + sayHead + (note ? '' : notes));
    }
    if (note) { note.hidden = !notes || privateItem; U.html(note, notes); }
    // 不单独放“复制给 AI”，问情况就是复制给 AI（M458）；登记带的去处排第一（M491）
    let acts = (d.actions || []).filter(a => a.intent !== 'done' && (!d.closed || !['later', 'ack', 'decline', 'close_report'].includes(a.intent))).map(a => a.intent === 'ask' ? { ...a, label: '问情况' } : a);
    if (d.open && !acts.some(a => a.kind === 'open')) acts.push({ ...(typeof d.open === 'string' ? (/^(https?:|\/)/.test(d.open) ? { href: d.open } : { target: d.open }) : d.open), kind: 'open', label: d.open.label || '打开对话' });
    acts = [...acts.filter(a => a.kind === 'open' && /^https:\/\//i.test(a.href || '')), ...acts.filter(a => !(a.kind === 'open' && /^https:\/\//i.test(a.href || '')))];
    part('acts').hidden = !acts.length; U.html(part('acts'), U.goActions(d, acts));
    acts.forEach((a, i) => { if (a.kind === 'open' || ['done', 'decline', 'later'].includes(a.intent)) part('acts').querySelector(`[data-open="${i}"],[data-act="${i}"]`)?.setAttribute('data-needs-pc', ''); });
    L.tone(hero, status.tone);
    const field = value => say(value);
    const closedSay = d.closed && (d.closed.kind === 'unknown' || d.closed.text === '本人关掉了这份汇报' ? d.closed.text || CLOSED.unknown : CLOSED[d.closed.kind] || CLOSED.unknown);
    const monthly = !issue && Number.isInteger(d.monthly_day) && d.monthly_day >= 1 && d.monthly_day <= 31 ? `每月 ${d.monthly_day} 日` : '';
    const facts = issue ? [
      // 档案卡里结局就是状态卡的大字，了结说明在“结论”卡（能展开），这里不再重复。
      !dossier && d.outcome && fact('结局', say(OUT[d.outcome])),
      !dossier && d.outcome_text && fact('了结说明', say(d.outcome_text)),
      d.closed_at && fact('了结时刻', when(d.closed_at)),
      d.at && d.at !== d.closed_at && fact(d.event ? '记录时间' : '检查时间', when(d.at)),
      d.reopen_count != null && fact('重开次数', say(d.reopen_count)),
      d.first_at && d.last_at && fact('记录范围', `${esc(when(d.first_at))} 至 ${esc(when(d.last_at))}`),
      d.previous && fact('上回', `${say(d.previous.text || OUT[d.previous.outcome])}<small>${when(d.previous.at)}</small>`),
      ...(!privateItem && issueReadings?.detail(!d.outcome_text && progress ? { ...d, progress_summary: null, owner_detail: null } : d, viewer, (name, value) => fact(name, value, ' issue-reading')) || []),
    ] : [
      d.due && fact('什么时候要', when(d.due)),
      // M947：每月循环的提醒（后台给整数 monthly_day）这一行写“每月 6 日”，不另加行
      (monthly || d.act_from) && fact('从什么时候办', monthly || when(d.act_from)),
      d.mobile && d.mobile !== 'unknown' && fact('在哪办', field(d.mobile && typeof d.mobile === 'object' ? d.mobile : ({ phone: '手机上', computer: '电脑上', in_person: '当面办' })[d.mobile])),
      d.closed && !(dossier && closedSay === label) && fact('结局', say(closedSay)),
      d.closed && fact('了结说明', say(d.closed.text)), d.closed?.at && fact('了结时刻', when(d.closed.at)),
    ];
    $('about').hidden = !facts.some(Boolean) || privateItem; U.html($('facts'), facts.filter(Boolean).join(''));
    const qs = Array.isArray(d.questions) ? d.questions : [];
    $('questions').hidden = !qs.length;
    // 档案卡：一题一行，题目在左、选项按钮靠右
    const askHtml = q => { const html = `<p>${say(q.text && typeof q.text === 'object' ? q.text : q, '问题内容')}</p>${Array.isArray(q.options) ? `<div class="rec-acts">${optionActions(d, q)}</div>` : ''}`; return dossier ? `<div class="dossier-ask">${html}</div>` : html; };
    // 本人版给全：问题、经过都不收。
    const firstAsk = Infinity, firstRun = Infinity;   // 两版同一套（本人禁令 11-24 14:16）：两版问题、经过都不收
    const askShown = askMore ? qs.slice(0, firstAsk) : qs, askRest = askMore ? qs.slice(firstAsk) : [];
    U.html($('question-text'), askShown.map(askHtml).join(''));
    if (askMore) { U.html($('question-rest'), askRest.map(askHtml).join('')); askMore.hidden = !askRest.length; askLabel(); }
    const refs = [];
    // 一条关联：档案卡画成一行一块（能点的整行能点），旧页面照旧是“名字 | 内容 ›”。
    const ref = (name, html, href = '', note = '') => refs.push(dossier ? D.link({ label: name, html, href: href && route(href), note }) : fact(name, (href ? `<a href="${esc(route(href))}">${html} ›</a>` : html) + (note ? `<small>${note}</small>` : '')));
    const add = (name, href, label) => { if (href) ref(name, U.fieldHtml(label || name), href); };
    if (d.origin) {
      const o = d.origin, mark = marker(o, viewer), name = U.originName(o, d);
      if (viewer === 'public' && (o.visibility === 'owner' || o.public === 'owner' || o.hidden)) ref('来源', mark);
      else if (name || o.href || o.query) ref('来源', say(name || o.query || '打开来源'), o.href, [name && o.query && say(o.query), mark].filter(Boolean).join(' · '));
    }
    if (d.project && typeof d.project === 'object') ref('所属项目', say(d.project));
    else if (d.project && d.origin?.href !== `/live/project/?id=${encodeURIComponent(d.project)}`) { if (typeof d.project_name === 'string' && d.project_name) add('所属项目', `/live/project/?id=${encodeURIComponent(d.project)}`, d.project_name); else if (d.project_name && typeof d.project_name === 'object') ref('所属项目', say(d.project_name)); }
    if (d.owner_item) add('关联的事', `/live/item/?id=${encodeURIComponent(d.owner_item)}`, '看这件事');
    if (d.task && d.task_name) refs.push(dossier ? D.link({ label: '关联任务', html: U.fieldHtml(d.task_name), href: route(`/live/task/?id=${encodeURIComponent(d.task)}`) }) : fact('关联任务', `<a href="${esc(route(`/live/task/?id=${encodeURIComponent(d.task)}`))}">›${d.task_name ? ` ${U.fieldHtml(d.task_name)}` : ''}</a>`));
    else if (d.task_name) ref('关联任务', say(d.task_name));
    if (d.closed?.to) add('并入的事', `/live/item/?id=${encodeURIComponent(d.closed.to)}`, '看并入的事');
    if (d.reopened) add('后来又打开了', `/live/item/?id=${encodeURIComponent(d.id)}`, '看现在这件');
    $('related').hidden = !refs.length; U.html($('links'), refs.join(''));
    // 原始记录保留拆标题前的原文。
    if (dossier) {
      const raw = [fact('原文', say(d.text ?? (d.rewrite === 'pending' ? d : null), '事项')), d.changed && fact('最近更新', when(d.changed))].filter(Boolean);
      $('raw').hidden = !raw.length; U.html($('raw-facts'), raw.join(''));
    }
    const eventBody = e => !e.text || [e.label, d.text, issue ? summary : d.closed?.text].includes(e.text) ? '' : e.text;
    const runLink = s => { const text = `${esc(s.name)}${s.who ? `（${esc(s.who)}）` : ''}`; return s.href ? `<a class="run-link" href="${esc(route(s.href))}">${text} ›</a>` : text; };
    // 账本一件：经过里每一步，后台给了做这一步的那场对话或那一轮（source_href）就挂“Codex 那场对话 ›”“自动修理那一轮 ›”；
    // 没有地址（对话已删、那一轮没留记录、访客看不到）照原样写字，后台写的原因（source_unavailable_reason）放在这一步的悬停说明里
    const source = e => {
      if (!issue || typeof e.source_href !== 'string' || !e.source_href.startsWith('/live/')) return null;
      const href = window.LiveRuns?.runPage(e.source_href) || e.source_href, url = new URL(href, location.origin);
      const host = { claude: 'Claude', codex: 'Codex', antigravity: 'Antigravity' }[(url.searchParams.get('id') || '').split(':')[0].toLowerCase()];
      const name = url.pathname === '/live/chat/' ? `${host ? `${host} ` : ''}那场对话` : url.pathname.startsWith('/live/automation/') ? `${window.LiveRuns?.categoryName(url.searchParams.get('type'), viewer) || ''}那一轮` : '来源';
      return `<small class="issue-event-actor"><a class="run-link" href="${esc(route(href))}">${esc(name)} ›</a></small>`;
    };
    const sourceWhy = e => issue ? U.fieldText(e.source_unavailable_reason ?? '', viewer).trim() : '';
    // 有了“Codex 那场对话 ›”，原来那行“由谁处理：codex:一串编号”就是同一件事，不再写；写的是人名、型号这类的照旧写
    const rawActor = e => /^(claude|codex|antigravity):[\w-]{8,}$/i.test(U.fieldText(e.actor ?? '', viewer).trim());
    const eventReadings = new Map();
    const sameEvent = new Set();
    const usefulHistory = historyRows.filter(e => {
      // 同一分钟、同一件事、同一句话的经过只留一条（本人 11-23 截图里“16:51 登记事项”写了两遍）
      const twin = [e.at && when(e.at), e.label || e.event, eventBody(e), e.outcome].join('|');
      if (sameEvent.has(twin)) return false;
      sameEvent.add(twin);
      const fields = issueReadings?.event(e, viewer, when, eventBody(e));
      if (fields?.actor || fields?.extra) { eventReadings.set(e, fields); return true; }
      return e.label || e.event || eventBody(e) || e.outcome || e.at && e.text;
    });
    $('history-box').hidden = !usefulHistory.length && !next;
    // 一条经过的正文：档案卡先摆第一句，其余的点这一句展开看。
    const runOut = t => `<p class="run__out rec-prose">${say(t, '这条经过')}</p>`;   // 两版同一套（本人禁令 11-24 14:16）：两版经过都给全文
    const events = U.mergePrivateRows(usefulHistory, { value: e => e.text || e, kind: viewer }).map((e, i) => {
      if (e.private_count) return { key: e.key, cls: 'run', html: U.privateSummary(e.private_count) };
      const { actor = '', extra = '' } = eventReadings.get(e) || {};
      const body = eventBody(e);
      // 这一步是哪个 AI、哪一轮：“自动修理第 2 轮（GPT-6.2 Sol xhigh）›”，点了到那一轮（后台在这一步或 automation_runs 里写明了才有）
      const own = e.automation_run && window.LiveRuns?.sources({ automation_runs: [e.automation_run] }, viewer)[0];
      const runAt = own ? `<small class="issue-event-actor">${runLink(own)}</small>` : '';
      // 这一步已经挂了“哪一轮 ›”或本身就是那一轮的，不再挂来源
      const src = own || e.run ? '' : source(e) || '', why = src ? '' : sourceWhy(e);
      const who = src && rawActor(e) ? '' : actor;
      return { key: e.event_id || `${e.id || ''}:${e.at || ''}:${i}`, cls: `run${i === 0 ? ' is-now' : ''}`, html: `${U.status(e, { small: true }).lamp}<p class="run__main"><span class="run__when">${e.at ? esc(when(e.at)) : U.offline?.() ? '' : U.collectionText("时刻")}</span><span class="run__what"${why ? ` title="${esc(why)}"` : ''}><b>${e.run ? runLink(e.run) : say(e.label || OUT[e.outcome] || EVENT[e.event] || '进展')}</b>${who}${src}${runAt}</span></p>${body ? runOut(body) : ''}${extra}` };
    });
    U.list($('events'), events.length ? events.slice(0, firstRun) : [{ key: 'empty', cls: 'run run--empty', html: `<p class="run__none">${U.offline?.() ? '这块没存下来，连上后补上。' : U.collectionText("经过")}</p>` }], { animate: !first });
    U.list($('events-rest'), events.slice(firstRun), { animate: !first });
    if (dossier) foldedRuns = Math.max(0, events.length - firstRun);
    more.hidden = events.length <= firstRun; $('history-box').classList.toggle('has-more', events.length > firstRun); moreLabel();
    $('earlier').hidden = !issue || !next; U.html($('earlier'), '继续读更早的经过 ›');
    $('coverage').textContent = coverage?.from && Date.parse(coverage.from) !== Date.parse(d.accepted) ? `记录从 ${when(coverage.from)} 起` : '';
    $('rec').hidden = privateItem; if (body) body.hidden ||= privateItem; heroRead.done(); detailsRead.done(); first = false;
    requestAnimationFrame(() => L.lightUp([hero, ...$('events').children, $('rec'), $('notices')]));
  }
  function clearRecord() {
    revision++; closedRound = undefined; closedAsk++;
    record = at = next = coverage = foldedRuns = null;
    searching = $('earlier').disabled = false;
    historyRows = []; pages.clear();
    document.title = `${issue ? '账本详情' : '事项详情'} · 实况`;
    for (const k of ['head', 'meta', 'say', 'acts', 'lead', 'state', 'note', 'lamp']) {
      const el = part(k);
      if (el) U.html(el, '');
    }
    for (const k of ['facts', 'question-text', 'question-rest', 'links', 'raw-facts', 'coverage']) {
      const el = $(k);
      if (el) U.html(el, '');
    }
    U.list($('events'), [], { animate: false }); U.list($('events-rest'), [], { animate: false });
  }
  function empty(message, denied = false) {
    hero.classList.toggle('is-unavailable', !U.offline?.() && /暂时读不到$/.test(message));
    // 档案卡的“现在怎样”在下面那栏里，整栏收起时这句话改写在页头正文的位置（part lead）。
    if (U.offline?.() && !denied && !/没有说|未找到|暂时读不到$/.test(message)) { const box = part('lead') || part('say'); for (const k of ['say', 'state', 'note']) { const el = part(k); if (el) el.hidden = true; } U.html(part('head'), U.head(issue ? '这条账本' : '这件事', { lamp: false })); U.html(box, `<span class="rec-none">${esc(issue ? '这块没存下来，连上后补上。' : message)}</span>`); box.hidden = false; part('meta').hidden = part('acts').hidden = $('rec').hidden = true; L.tone(hero, 'off'); heroRead.done(); detailsRead.done(); return; }
    U.html(part('head'), denied ? marker({ visibility: 'owner' }, viewer, issue ? '这条账本的内容' : '这件事的内容') : U.head(message, { lamp: !issue }));
    for (const k of ['meta', 'say', 'acts', 'lead', 'state', 'note']) { const el = part(k); if (el) el.hidden = true; }
    $('rec').hidden = true; L.tone(hero, 'off'); heroRead.done(); detailsRead.done(); L.lightUp([hero]);
  }
  function collect(detail, exhausted = false) {
    const all = [...pages.values()];
    const matches = d => d.id === id || (id.startsWith('issue-') && d.issue === id);
    const current = detail?.item || all.flatMap(d => d.items || []).find(matches);
    const past = (detail?.history || all.flatMap(d => d.history || []).filter(matches)).slice()
      .sort((a, b) => Date.parse(b.at || 0) - Date.parse(a.at || 0));
    const brief = exhausted && all.flatMap(d => d.repeat_fixes?.items || []).find(matches);
    record = current || past[0] || (brief ? { ...brief, state: null, outcome: null, actions: [] } : null);
    const rows = past.map(e => ({ ...e, text: e.outcome_text || e.text }));
    if (record?.previous && !rows.some(e => e.at === record.previous.at && e.outcome === record.previous.outcome)) rows.push(record.previous);
    if (record?.wait) rows.push({ ...record.wait, id: record.id, state: 'waiting', label: '在等' });
    // “开始”这一步是记下这件事的那场对话或那一轮做的：后台给了记下的人的地址（registered_by_href）就照样挂上
    if (record?.accepted && !rows.some(e => e.at === record.accepted && (e.event === 'Add' || /^(开始|登记)/u.test(e.label)))) rows.push({ at: record.accepted, label: '开始', source_href: record.registered_by_href, source_unavailable_reason: record.registered_by_unavailable_reason });
    // 账本一件事的经过：哪几轮自动任务动过它（后台 automation_runs 写明的），各占一步，写清哪个 AI、哪一轮，点了到那一轮
    if (issue && window.LiveRuns) for (const run of Array.isArray(record?.automation_runs) ? record.automation_runs : []) {
      const s = window.LiveRuns.sources({ automation_runs: [run] }, viewer)[0];
      if (s && run.at && !rows.some(e => e.automation_run?.run_id && e.automation_run.run_id === run.run_id)) rows.push({ at: run.at, event_id: `run:${run.category}:${run.run_id}`, run: s, label: s.name, text: s.action ? `${s.action}这件事` : '' });
    }
    historyRows = [...new Map(rows.map(e => [e.event_id || `${e.id}:${e.at}:${e.event || e.label || ''}:${e.text}:${e.outcome || ''}`, e])).values()].sort((a, b) => Date.parse(b.at || 0) - Date.parse(a.at || 0));
    const latest = historyRows.find(e => e.id === current?.id && (e.state || e.outcome));
    if (!detail && current && latest?.at && Date.parse(latest.at) >= Date.parse(current.accepted)) record = { ...record, state: latest.state || record.state, ...(latest.outcome ? { outcome: latest.outcome, outcome_text: latest.text } : {}) };
    if (record) render();
  }
  // M567：从关闭清单点进来时网址带 closed=那次了结的时刻。这件事后来又重新打开（或又了结了一次）时，编号不变，
  // 接口给的是现在这一轮；这时到关闭清单里找回那一轮，照它摆结局、了结说明和了结时刻，经过只留那一轮的，
  // 按钮不给（按了会落到现在这一轮上），另给一条“看现在这件”。清单里找不到就照现在这一轮摆。
  const closedAt = Date.parse(p.get('closed') || '');
  let closedRound, closedAsk = 0, latestDetail = null;
  const pastRound = (row, d) => {
    const from = Date.parse(row.episode_at || row.born || '');
    const history = (Array.isArray(d.history) ? d.history : []).filter(e => { const t = Date.parse(e.occurred_at || e.at || ''); return Number.isFinite(t) && t <= closedAt + 1000 && !(t < from - 1000); });
    return { ...row, now: null, actions: [], detail_text: d.detail_text, history, reopened: true };
  };
  function showItem(d) {
    latestDetail = d;
    const show = r => { record = r; historyRows = itemHistory(r); render(); };
    if (issue || !Number.isFinite(closedAt) || Date.parse(d.closed?.at) === closedAt) { show(d); return; }
    if (closedRound !== undefined) { show(closedRound ? pastRound(closedRound, d) : d); return; }
    const ask = ++closedAsk, kind = viewer;
    window.Live.get('items/closed', null).catch(() => null).then(r => {
      if (ask !== closedAsk || kind !== viewer) return;
      const d = latestDetail, ok = Array.isArray(r?.data?.items) && (!r.meta?.viewer?.kind || r.meta.viewer.kind === viewer);
      if (ok) closedRound = r.data.items.find(row => row.id === d.id && Date.parse(row.closed?.at) === closedAt) || null;
      show(closedRound ? pastRound(closedRound, d) : d);
    });
  }
  // 后台“登记事项”“核对事项”（Add / Review）这类纯流水对这件事没有信息，经过里不列；这件事从哪天开始照留，起点写“开始”（同问题账本的起点），不写“登记事项”；
  // 没有别的经过时也照列这一条。重新打开、关闭和真有内容的经过照列，换了一轮的“本轮开始”照补（M691）
  const LEDGER_ONLY = /^(?:登记事项|核对事项|事项已加入等你的清单)$/u;
  const ledgerOnly = e => { const t = String((e.text && typeof e.text === 'object' ? e.text.text : e.text) ?? '').trim(); return !e.outcome && (LEDGER_ONLY.test(t) || !t && ['Add', 'Review'].includes(e.event)); };
  function itemHistory(d) {
    const born = d.episode_at || d.born, closed = d.closed;
    const sameAt = (a, b) => a === b || Date.parse(a) === Date.parse(b);
    const rows = (Array.isArray(d.history) ? d.history : []).map(e => ({ ...e, at: e.occurred_at || e.at,
      label: e.label || EVENT[e.event] || (/^(登记事项|重新打开事项|核对事项|关闭事项)$/u.test(e.text) ? e.text : '') }))
      .filter(e => !ledgerOnly(e));
    const start = e => [e.label, e.text].some(t => /^(开始|本轮开始|登记|生成待办|重新打开|事项已加入等你的清单)/u.test(t));
    if (born && !rows.some(e => start(e) && Math.abs(Date.parse(e.at) - Date.parse(born)) < 1000)) rows.push({ at: born, label: d.episode_at && (rows.length || closed) ? '本轮开始' : '开始' });
    if (closed && !rows.some(e => sameAt(e.at, closed.at) && (e.kind && e.kind === closed.kind || e.event === 'Close' || /关闭|办完|了结|不办/u.test(e.label) || e.text && e.text === closed.text))) {
      rows.push({ at: closed.at, text: closed.text, label: CLOSED[closed.kind] || '已了结' });
    }
    return rows.sort((a, b) => Date.parse(b.at || 0) - Date.parse(a.at || 0));
  }
  async function earlier() {
    if (searching || !next) return;
    searching = true; $('earlier').disabled = true;
    const current = revision;
    try {
      do {
        const cursor = next;
        const s = await window.Live.get(ledgerResource, { ...ledgerQuery, cursor }).catch(() => null);
        if (revision !== current) return;
        if (s?.meta?.status >= 400 || !Array.isArray(s?.data?.history) || pages.has(cursor) || (s.viewer?.kind && s.viewer.kind !== viewer)) {
          if (!record) empty('这条账本暂时读不到');
          else U.html($('earlier'), '更早的经过暂时读不到，点此重读 ›');
          return;
        }
        pages.set(cursor, s.data); next = s.data.next; collect(null, !next);
      } while (!record && next);
      if (!record) empty('未找到这条账本');
    } finally { if (revision === current) searching = $('earlier').disabled = false; }
  }
  $('earlier').addEventListener('click', earlier);
  const ledgerQuery = { project: p.get('project') || from?.searchParams.get('project'), before: p.get('before') || from?.searchParams.get('before') };
  const ledgerResource = p.has('fixture') && ledgerQuery.before ? 'ledger-earlier' : 'ledger';
  const detailResource = `${issue ? 'ledger' : 'items'}/${encodeURIComponent(id)}`;
  let detailWatch, legacy = issue && p.has('fixture');
  const watch = ledger => window.Live.watch(ledger ? ledgerResource : detailResource, ledger ? ledgerQuery : null, {
    phase(s) { if (!record) { heroRead.set(s); detailsRead.set(s); } },
    data(d, meta) {
      const kind = meta.viewer?.kind || 'public';
      if (kind !== viewer) clearRecord();
      viewer = kind;
      if (!d) { clearRecord(); return; }
      if (d?.q === 'warming') { record = d; empty('正在准备'); return; }
      at = meta.at;
      if (!issue) { showItem(d); return; }
      if (!ledger && !d.item?.id) return;
      coverage = d.coverage;
      if (ledger) { if (!Array.isArray(d.history)) { empty('这条账本暂时读不到'); return; } pages.set('', d); if (pages.size === 1) next = d.next; }
      collect(ledger ? null : d, ledger && !next);
      if (!record) { if (ledger && next) void earlier(); else empty('未找到这条账本'); }
    },
    link(s) {
      try {
      const status = s.meta?.status;
      if (issue && !ledger && !legacy && !s.publicPaused && !record && ([404, 503].includes(status) || status === 200 && !s.warming && !s.data?.item?.id)) {
        legacy = true;
        queueMicrotask(() => { detailWatch?.stop?.(); watch(true); });
        return;
      }
      bar?.set(s); L.offline(s.offline);
      U.list($('notices'), s.offline ? [{ key: 'offline', cls: 'notice glass', html: `<span class="lamp" aria-hidden="true"></span><span>${U.fieldHtml(s.text)}</span>` }] : []);
      if (s.meta?.status === 403) {
        viewer = s.viewer?.kind || 'public';
        if (record) clearRecord();
        empty(s.text || '没有权限读取这件事', true);
        return;
      }
      if (record || searching && s.phase !== 'gone') { if (record && s.offline) render(); return; }
      heroRead.set(s); detailsRead.set(s);
      if (s.phase === 'gone') empty(s.say || '这块没存下来，连上后补上。');
      else if (s.phase === 'none') empty(`${issue ? '这条账本' : '这件事'}暂时读不到`);
      } finally { [hero.querySelector('.card__body'), $('rec')].forEach(el => U.blockNote(el, s)); }
    },
  });
  if (!id) empty(issue ? '没有说是哪条账本' : '没有说是哪件事');
  else detailWatch = watch(legacy);
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();
