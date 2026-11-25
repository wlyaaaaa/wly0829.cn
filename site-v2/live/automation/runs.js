// 实况 · 自动任务：每一轮的读数 → 页面要的样子。自动任务页（board.js）和一轮的详情页（run/run.js）共用。
// 读口照《数据约定-前端升级》：列表 automation/runs（?category= &status= &date=），详情 automation/runs/{类}/{轮号}。
// 后台给什么都只在这里转；页面只认这里交出来的字段。约定以外、页面先认着的几个字段（后台还没给就照下面的退路写）：
//   列表行 subject {id,title,href,round}（自动修理把几轮收进同一件）、activity（在跑的这会儿在干什么）、outputs（列表里就带上做出来的东西）；
//   详情 why_text、timeline[]、prompt_text、prev_run_id / next_run_id。思考摘要和最后的回复照约定去读 conversation.href 那份对话（chats/{id}）。
(() => {
  'use strict';
  const T = window.LiveTape, U = window.LiveUI;
  const CATS = ['auto-repair', 'message-review', 'translator', 'weekly-rules', 'weekly-live', 'excerpt', 'ai-commitments'];
  // 各类的名字（笔记本每周巡检已取消，名字留着给旧记录用）：后台的 categories[].title 优先，没读到时用这份（和后台写法一致）
  const NAMES = { 'auto-repair': '自动修理', 'message-review': '替你看新消息', translator: '翻译官', 'weekly-rules': '每周规矩复核',
    'weekly-laptop': '笔记本每周巡检', 'weekly-live': '实况每周对一遍', excerpt: '摘一句', 'ai-commitments': 'AI 约好的事' };
  const FAMILIES = { claude: 'Claude', codex: 'Codex', antigravity: 'Antigravity' };
  const list = v => Array.isArray(v) ? v : [];
  const str = v => typeof v === 'string' ? v.trim() : '';
  const num = v => typeof v === 'number' && Number.isFinite(v) ? v : null;

  // 类名：访客版把“替你”写成“替本人”
  function catName(id, viewer, title) {
    const name = typeof title === 'string' && title ? title : NAMES[id] || id || '';
    return viewer === 'owner' ? name.replace(/^替本人/, '替你') : name.replace(/^替你/, '替本人');
  }
  // 哪一家：worker.host 优先；没给就按型号猜（GPT 走 Codex，Gemini 走 Antigravity）
  function familyOf(worker) {
    const host = str(worker?.host).toLowerCase();
    if (FAMILIES[host]) return host;
    const model = str(worker?.model).toLowerCase();
    return /^(claude|opus|sonnet|haiku|fable)/.test(model) ? 'claude' : /^(gpt|codex)/.test(model) ? 'codex' : /^gemini/.test(model) ? 'antigravity' : '';
  }
  // “GPT-6.2 Sol · xhigh”“Claude Opus 5.5 · medium”；程序自己办的写“程序”
  function whoOf(worker) {
    if (worker?.kind === 'program') return { program: true, text: '程序直接办，没叫 AI', short: '程序直接办，没叫 AI' };
    const family = familyOf(worker), model = str(worker?.model);
    const name = model && family === 'claude' && !/^claude/i.test(model) ? `Claude ${model}` : model;
    const text = [name, str(worker?.effort)].filter(Boolean).join(' · ');
    return { program: false, text: text || (worker?.kind === 'ai' ? 'AI（型号没记下）' : ''), short: text };
  }
  const runPath = (category, id) => category && id ? T.path('/live/automation/run/', { type: category, run: id }) : '';
  // “用谁”点进智能体页看这一家干了多少：落在“三家各干了多少活”那块、亮出这一家（和首页智能体卡同一个落点，只看一家一律 ?family=）
  const agentsPath = family => FAMILIES[family] ? `/live/agents/?family=${family}#work` : '';
  const minutesBetween = (a, b) => { const x = T.stamp(a), y = T.stamp(b); return x != null && y != null && y >= x ? (y - x) / 60000 : null; };
  const OUTPUT = {
    owner_item: { where: '等你的事那张卡', go: '去那张卡' },
    ledger_item: { where: '账本那件', go: '去账本那件' },
    commit: { where: '提交', go: '看提交' },
    document: { where: '文档', go: '打开' },
  };
  function output(o, viewer) {
    const kind = OUTPUT[o?.kind] ? o.kind : 'document', meta = OUTPUT[kind];
    const action = str(o?.action_text) || (o?.action === 'created' ? '新建了' : o?.action === 'updated' ? '更新了' : '');
    const where = viewer === 'owner' ? meta.where : meta.where.replace('等你的事', '等本人的事');
    // 提交：后台给的是 GitHub 地址（站外）。本人版照给链接；访客版不给：本人的仓库有公开有私有，后台没标是哪种，访客点到私有的会 404（验收 11-24 07:15）
    const github = kind === 'commit' && typeof o?.href === 'string' && o.href.startsWith('https://github.com/');
    return { kind, id: o?.id, title: o?.title, action, where: str(o?.card_text) || where, version: o?.version,
      href: T.path(o?.href) || (github && viewer === 'owner' ? o.href : ''), github, go: meta.go };
  }

  // 列表一行
  function run(raw, viewer) {
    const r = raw || {}, category = str(r.category), status = ['running', 'completed', 'incomplete'].includes(r.status) ? r.status : 'unknown';
    const who = whoOf(r.worker), started = r.started_at || r.queued_at;
    const minutes = num(r.duration_minutes) ?? (status !== 'running' ? minutesBetween(started, r.finished_at || r.last_activity_at) : null);
    // 暂缓：后台把“暂时不修”（自动修理修了还没好、由做事的 AI 判断先等下一次检查点）记成 outcome deferred，status 有时是 incomplete、有时是 completed。
    // 这不是失败：页面上灰点、写“暂时不修”，不写“没做成”、不标红（M674）。不管记的是跑完还是没做成，标了 deferred 的都照暂缓显示（主控 11-25 定）。
    // status 照后台原样；自动任务页“只看跑完的”“只看没做成的”两个筛选都不含暂缓的轮次（board.js）。
    const deferred = status !== 'running' && str(r.outcome) === 'deferred';
    const subject = r.subject && (r.subject.id || r.subject.title) ? { id: r.subject.id || r.subject.title, title: r.subject.title, href: T.path(r.subject.href), round: num(r.subject.round) } : null;
    return {
      key: `${category}:${r.run_id}`, category, id: str(r.run_id), status, deferred, trigger: r.trigger, who, family: familyOf(r.worker),
      queuedAt: r.queued_at, startedAt: started, finishedAt: r.finished_at, lastAt: r.last_activity_at || r.finished_at || started,
      minutes, summary: r.summary, reason: r.reason, activity: r.activity, subject,
      outputs: list(r.outputs).map(o => output(o, viewer)), outputCount: num(r.output_count),
      resumes: str(r.resumes_run_id), resumedBy: str(r.resumed_by_run_id),
      conversation: r.conversation_available === true, receipt: r.receipt_available === true,
      // M684：本人读口给的访客差异标记（conversation 标的是这轮所挂的对话），原样带着给页面挂签
      labels: r.visitor_labels && typeof r.visitor_labels === 'object' ? r.visitor_labels : null,
      href: runPath(category, r.run_id),
    };
  }

  // 暂缓的轮次标题一律短：只写“暂时不修”，说明不进标题（主控 11-25：同一种暂缓轮次只留一种排法）。
  // 说明：summary 去掉这件活的名字（标题前半已写过）和打头的“暂时不修”后剩下的；后台的 reason 写了“暂时不修”以外的原因、summary 又是空的，就用 reason。
  // 一轮页“这一轮做成了什么”写全文，列表卡那行小字也照它写（见下）。F 是页面的转义写法
  function deferredNote(r, F) {
    const summary = F(r.summary, '结果'), thing = r.subject ? F(r.subject.title, '这件活') : '', reason = F(r.reason, '原因');
    let note = thing ? withoutSubject(summary, thing) : summary;
    for (const lead of [reason, '暂时不修']) if (lead && note.startsWith(lead)) note = note.slice(lead.length).replace(/^\s*[·:：。]\s*/, '');
    return note || (reason && reason !== '暂时不修' ? reason : '');
  }
  // 列表卡那行小字：为什么放着、现在在等什么（本人要知道为什么放着、在等什么，R53）。
  // 后台 reason 写了真原因就用它；否则用说明全文，整段照给、能换行，不截断。卡顶那行已经说过的句子不再写
  function deferredWhy(r, F) {
    // 卡片上面那行已经写了这件活的名字：原因或其中一句的意思已经包含在那行里（去掉标点、空格再比），就不再写一遍
    const thing = r.subject ? F(r.subject.title, '这件活') : '', bare = x => String(x || '').replace(/[\s\p{P}\p{S}]/gu, '');
    const same = x => !bare(x) || x === '暂时不修' || !!thing && bare(thing).includes(bare(x));
    const reason = F(r.reason, '原因');
    if (!same(reason)) return reason;
    // 按句分开（句号、问号、叹号，分号不拆），去掉卡顶那行已经说过的句子，剩下的连成一段，末尾的句号去掉（后面还接着“ · 几点”）
    const parts = deferredNote(r, F).split(/(?<=[。！？])/).map(x => x.trim()).filter(x => x && !same(x));
    return parts.join('').replace(/[。！？\s]+$/, '');
  }

  // 后台的 summary 常把这件活的名字再写一遍（“转给你 · 收拾仓库……”“暂时不修 · 内存守护……。独立复核通过……”）。
  // 那件已经写在前面（标题前半、卡片上面那行）时，summary 里那件的名字去掉，留下前面的结论和后面的交代；
  // 只在那件的名字单独成段（前后是开头结尾、“ · ”、冒号、句号）时去，夹在句子中间的不动。都是 F 转义过的字
  function withoutSubject(summary, thing) {
    const at = summary && thing ? summary.indexOf(thing) : -1;
    if (at < 0) return summary;
    const before = summary.slice(0, at), after = summary.slice(at + thing.length);
    if (before && !/(\s*[·:：]\s*|[。！？；])$/.test(before) || after && !/^(\s*[·:：]|[。！？；])/.test(after)) return summary;
    const head = before.replace(/\s*[·:：]\s*$/, ''), tail = after.replace(/^(\s*[·:：]\s*|[。！？；]\s*)/, '');
    return head && tail ? `${head}${/[。！？；]$/.test(head) ? '' : ' · '}${tail}` : head || tail;
  }

  // 对话：后台给的是聊天读口地址 /computer-access/live/v1/chats/{id}（已按受众处理），页面拿号去读 chats/{id}、链到 /live/chat/?id={id}
  function chatOf(conv) {
    const href = str(conv?.href);
    const id = /\/chats\/([^/?#]+)/.exec(href)?.[1] || (/^\/live\/chat\/\?(?:.*&)?id=([^&#]+)/.exec(href)?.[1]);
    const chat = id ? decodeURIComponent(id) : '';
    return { available: conv?.available === true && !!chat, id: chat, resource: chat ? `chats/${encodeURIComponent(chat)}` : '',
      href: chat ? T.path('/live/chat/', { id: chat }) : '', state: str(conv?.state),
      // 看不到的原因：private 是对访客藏了（hidden_why 写为什么），not_saved 是真没存下来；后台第 17 轮起给（主持 11-24 07:24）
      reason: ['private', 'not_saved'].includes(conv?.unavailable_reason) ? conv.unavailable_reason : '', why: str(conv?.hidden_why) };
  }
  // 一轮的详情
  function detail(raw, viewer) {
    const d = raw || {}, base = run(d, viewer), receipt = d.receipt || {};
    const site = h => typeof h === 'string' && h.startsWith('/live/') ? T.path(h) : '';
    return { ...base,
      why: d.why_text,
      // 暂缓那一轮的“暂时不修”一步是灰点：后台对记成没做成的给 warn（这里落成灰），记成跑完的却给 ok（绿），这里一律落成灰（主控 11-25）
      timeline: list(d.timeline).map(t => ({ at: t.at, text: t.text, tone: base.deferred && typeof t.text === 'string' && t.text.includes('暂时不修') ? 'info' : ['ok', 'bad', 'info'].includes(t.tone) ? t.tone : 'info', href: t.run_id ? runPath(base.category, t.run_id) : T.path(t.href) })),
      conversation: chatOf(d.conversation),
      receipt: { available: receipt.available === true, href: site(receipt.href), recorded: list(receipt.recorded), told: receipt.told, scan: receipt.scan },
      prompt: d.prompt_text, prev: str(d.prev_run_id), next: str(d.next_run_id),
      // 一轮的页照“一轮的页-v1”：三格（发生了什么、有什么影响、接下来）、没做成的真原因（stop）、属于账本哪件（ledger_item，group 是欠着 owed／放着 parked）、
      // AI 约好的事是谁约的（promised_by）。后台没给的是 null，页面照现在的样子退回
      headline: d.headline, three: d.three && typeof d.three === 'object' ? d.three : null,
      stop: d.stop && typeof d.stop === 'object' ? { kind: str(d.stop.kind), text: d.stop.text, step: d.stop.step, until: d.stop.until_at } : null,
      ledger: d.ledger_item && typeof d.ledger_item === 'object' ? { title: d.ledger_item.title, href: T.path(d.ledger_item.href), look: num(d.ledger_item.look), lookMax: num(d.ledger_item.look_max), group: str(d.ledger_item.group) } : null,
      promisedBy: d.promised_by && typeof d.promised_by === 'object' ? { title: d.promised_by.title, href: T.path(d.promised_by.href), host: str(d.promised_by.host) } : null,
    };
  }

  // 列表读口的一页 → 行；读不到（读口还没装上是 404）时 rows 为 null
  function page(data, viewer) {
    if (!data || !Array.isArray(data.items)) return null;
    return { rows: data.items.map(r => run(r, viewer)).filter(r => r.category && r.id), total: num(data.total), more: !!data.next, window: data.window };
  }

  // 老读数的退路：每一轮的读口还没装上时，拿 automation 里已有的在跑、最近几次拼出卡片（点不开经过）
  function fallback(d, viewer) {
    const rows = [];
    for (const a of list(d?.active_categories)) rows.push({ key: `active:${a.category}:${a.started_at}`, category: a.category, id: '', status: 'running', trigger: '',
      who: whoOf(null), family: '', startedAt: a.started_at, lastAt: a.started_at, summary: a.title, activity: a.step_text, outputs: [], href: '', legacy: true });
    for (const c of list(d?.categories)) for (const r of list(c.recent_runs)) rows.push({ key: `recent:${c.id}:${r.at}`, category: c.id, id: '', status: 'completed', trigger: '',
      who: whoOf({ kind: 'ai', model: c.model, effort: c.model_effort }), family: familyOf({ model: c.model }), finishedAt: r.at, lastAt: r.at, summary: r.summary,
      outputs: r.ledger_href ? [output({ kind: 'ledger_item', href: r.ledger_href }, viewer)] : [], href: '', legacy: true });
    return rows;
  }

  // 快讯条：只放开始、跑完、停了，不放摘一句（本人 11-24 01:36 FEDQ1）。有每一轮的行就照它排，没有就拿后台的 feed 筛
  function ticker(d, rows, viewer) {
    const cut = Date.now() - 3 * 86400000, out = [], cats = list(d?.categories);
    const title = id => U.fieldText(catName(id, viewer, cats.find(c => c.id === id)?.title), viewer);
    const text = v => U.fieldText(v, viewer) || '';
    if (rows?.length) {
      for (const r of rows) {
        if (r.category === 'excerpt' || r.legacy) continue;
        const actor = title(r.category), what = r.subject ? `${text(r.subject.title)}${r.subject.round ? ` 第 ${r.subject.round} 轮` : ''}` : text(r.summary);
        if (T.stamp(r.startedAt)) out.push({ at: r.startedAt, actor, html: `<span><em>开始</em>：${U.esc(what || '这一轮')}</span>`, href: r.href, tone: 'ok' });
        if (r.status === 'completed' && !r.deferred && T.stamp(r.finishedAt)) out.push({ at: r.finishedAt, actor, html: `<span><em>跑完</em>：${U.esc(text(r.summary) || '跑完了')}</span>`, href: r.href, tone: 'ok' });
        if (r.deferred && T.stamp(r.finishedAt || r.lastAt)) out.push({ at: r.finishedAt || r.lastAt, actor, html: `<span><em>暂时不修</em>：${U.esc(text(r.summary).replace(/^暂时不修\s*[·:：]\s*/, '') || '等下一次检查')}</span>`, href: r.href, tone: 'info' });
        else if (r.status === 'incomplete' && T.stamp(r.finishedAt || r.lastAt)) out.push({ at: r.finishedAt || r.lastAt, actor, html: `<span><em>停了</em>：${U.esc(text(r.reason) || '没做成')}</span>`, href: r.href, tone: 'bad' });
      }
    } else {
      const excerpt = title('excerpt');
      for (const r of list(d?.feed)) {
        const actor = text(r.actor);
        if (actor === excerpt || /[?&]type=excerpt\b/.test(r.href || '') || !/start|done|finish|fail|stop|pause|incomplete/.test(r.kind || '')) continue;
        const word = /start/.test(r.kind) ? '开始' : /done|finish/.test(r.kind) ? '跑完' : '停了';
        out.push({ at: r.at, actor, html: `<span><em>${word}</em>：${U.esc(text(r.text).replace(/^(正在跑|已经?跑完|停了)[：:]\s*/, ''))}</span>`, href: r.href, tone: word === '停了' ? 'bad' : 'ok' });
      }
    }
    for (const p of list(d?.provider_pauses)) out.push({ at: p.started_at, actor: list(p.categories).map(title).join('、'), html: `<span><em>停了</em>：${p.reason === 'login' ? '登录过期' : '额度用完'}</span>`, tone: 'bad' });
    return out.filter(r => T.stamp(r.at) > cut).sort((a, b) => T.stamp(b.at) - T.stamp(a.at)).slice(0, 30);
  }

  window.AutomationRuns = { CATS, NAMES, FAMILIES, catName, familyOf, whoOf, run, detail, page, fallback, runPath, agentsPath, minutesBetween, ticker, deferredNote, deferredWhy, withoutSubject };
})();
