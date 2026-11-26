// 实况 · 智能体：三家 AI（Claude、Codex、Antigravity）被管得对不对、估工期准不准、干了多少活，再是三家怎么被管（设置和钩子）。
// 本人 11-23 01:19 定的内容（工期“准”按估算程序给的允许范围算、按时另列；干活量和工期放一起；钩子每格写几条、跑几次、多慢、拦几次、错几次）。
// 访客看到的和本人一样，只过全站禁词过滤；数据读 /computer-access/live/v1/agents（候选后台 pcconfig.live-agents.v1）。
(() => {
  'use strict';
  const T = window.LiveTape, U = window.LiveUI, { esc } = U;
  const { HOSTS, list, known, int, pct, dec, hours, ms, link, fog, field, when, big } = T;
  const STATIONS = [
    ['start', '开场与接续'], ['message', '收到消息'], ['pre-tool', '动工具前'], ['post-tool', '动工具后'], ['compact', '压缩前'],
    ['helper', '派帮手时'], ['stop', '收工'], ['idle', '空等'], ['error', '出错停下'], ['other', '其他'],
  ];
  const STATION_OF = { SessionStart: 'start', Rules: 'start', PostCompactRewake: 'start', UserPromptSubmit: 'message', PreInvocation: 'message',
    PreToolUse: 'pre-tool', PermissionRequest: 'pre-tool', AutoReview: 'pre-tool', PostToolUse: 'post-tool', PreCompact: 'compact',
    SubagentStart: 'helper', SubagentStop: 'helper', Stop: 'stop', Notify: 'stop', Keepalive: 'idle', StopFailure: 'error' };
  const NAMES = { Rules: '核对规则版本', SessionStart: '开场给项目指路', PostCompactRewake: '压缩后接着办', PostCompact: '压缩完成后',
    PreInvocation: '叫模型前补状态', PostInvocation: '模型回完后', UserPromptSubmit: '收到消息时补状态', PreToolUse: '动工具前检查',
    PermissionRequest: '要批准时推手机', AutoReview: '宿主自带审批', PostToolUse: '工具用完补提醒', PreCompact: '压缩前留接续线索',
    SubagentStart: '帮手开场', SubagentStop: '帮手收尾', Stop: '收工检查', Notify: '收工推手机', Keepalive: '空等时叫醒',
    StopFailure: '出错停下', Interrupt: '按停后清审批提醒', PluginStop: '插件的收工回调', PluginInterrupt: '插件的中断回调',
    PluginSubagentStop: '插件的帮手回调', SessionCostStart: '花费面板 · 开场', SessionCostAttach: '花费面板 · 挂到对话',
    SessionCostTurn: '花费面板 · 每轮开始', SessionCostChange: '花费面板 · 更新', SessionCostRender: '花费面板 · 画出来' };
  // 某家宿主没有这个当口时写原因和用什么兜（定稿卡-钩子清单 三家差异表）
  const ABSENT = {
    codex: {
      idle: '宿主没有空等当口。派出去的单做完，后台等候能拿到结果，也可以回来看任务记录。你在汇报页交了答复，由汇报页的收件程序叫醒原对话，再由“收到消息时补状态”递上正文。',
      error: '宿主没有出错当口。出错停下由实况程序看对话记录发现，再推手机。',
    },
    antigravity: {
      message: '宿主没有“收到消息”当口。“叫模型前补状态”每次叫模型前核一遍，有变化才递时间、资料状态、你的新消息和没答的题。',
      compact: '宿主没有压缩当口。“叫模型前补状态”发现新的压缩摘要时，查摘要里还有没有《他要什么》的位置，缺了才补；它自己会自动压缩，什么时候压查不到准数；见过一次，是在上下文约 51 万词元（510K）时压的。',
      helper: '宿主没有派帮手当口。派非图片的帮手时，“动工具前检查”自动在任务说明末尾补上北京时间、资料状态、派单人型号和工程位置。',
      idle: '宿主没有空等当口。派出去的单：挂了后台等候，做完就会叫醒原对话；没挂时，结果留在任务里。你在汇报页交了答复，由后台的汇报页收件程序叫醒原对话，再由“叫模型前补状态”递上正文。',
      error: '宿主没有出错当口。实况会看对话是不是出错停下，确认停住、过一会儿还没恢复，就会尝试推手机。',
    },
  };
  const RULES = new Map([
    ['agents.claude-adapter.md', ['Claude 适配', 'claude-adapter']], ['agents.codex-adapter.md', ['Codex 适配', 'codex-adapter']],
    ['agents.antigravity-adapter.md', ['Antigravity 适配', 'antigravity-adapter']], ['agents.capabilities-runtime.md', ['能力与运行方式', 'capabilities-runtime']],
    ['agents.authorization.md', ['用户授权', 'authorization']], ['agents.protected-actions.md', ['重大动作与本人验证', 'protected-actions']],
    ['agents.privacy-data.md', ['个人资料与数据处理', 'privacy-data']], ['agents.context-sources.md', ['事实来源与任务上下文', 'context-sources']],
    ['agents.engineering-delivery.md', ['工程与交付', 'engineering-delivery']], ['agents.execution-coordination.md', ['分工与并行施工', 'execution-coordination']],
  ]);
  // 每条钩子“为什么要它”：用人话说这条防的是什么。照钩子说明表（E:\.agents\config\hook-catalog.json）和三家适配专题写，后台给了 hook.why 就用后台的。
  const SAME = {
    prompt: 'AI 自己不知道现在几点、个人资料锁没锁、你上回还有几道题没答；这条在你每发一条消息时补上，免得它把时间算错、在资料锁着时去用私人资料，或把还没结的题忘了。',
    helper: '派出去的帮手是从零开始的，不知道现在几点、自己是什么型号和档位、个人资料能不能用；这条在它开场时告诉它，免得它把时间写错或越过资料锁。',
    compact: '压缩不删对话，可压缩以后 AI 只看得到摘要；这条在压缩前把这次任务放在哪、做到哪写进摘要，让它接得上。翻译官管“你要什么”，这条管“这次做到哪”。',
    stop: 'AI 收工时容易留尾巴：资料锁拦过的事没办、后台的活没人盯、回复写成了英文；这条收工前查一遍，有就让它再补一轮。正常收工就记进实况、按条件推手机。',
  };
  // 设置表“对话装多满会压缩”写成 K 词元（本人 11-25 17:39 要知道“这个钩子是多少 K 生效”）。Codex 回包直接给词元数；Claude 回包只给百分比，
  // 宿主先留 20K 给回复、再按这个比例取 1000K 的窗口：(1000K−20K)×50%≈490K。钩子卡里的数由规则仓给，见下面 hookDetail 里的快核。
  // Claude 上下文窗口 1,000K 和先留给回复的 20K（设置表小字直接显示，也用来算约 490K）。按需更新快核（M928）核法：Claude 对话记录
  // E:/Data/AppData/Claude/profiles/pro/projects/**/*.jsonl 里每次自动压缩的 compactMetadata.preTokens，近 7 天中位数应≈(窗口−留量)×回包百分比，
  // 现 1,000K 窗口、先留 20K（11-26 核：220 次，中位 491K，十分位 490,000；窗口也可对钩子程序 claude_root_runtime_module.py 里登记的型号窗口）；变了改这句
  const CLAUDE_WINDOW = 1000000, CLAUDE_REPLY = 20000;
  const pctOf = (d, h) => { const p = Number(hostData(d, h).compact_percent); return p > 0 && p <= 100 ? p : null; };
  const compactAt = (d, h) => h.id === 'claude' ? (pctOf(d, h) ? (CLAUDE_WINDOW - CLAUDE_REPLY) * pctOf(d, h) / 100 : null)
    : h.id === 'codex' && known(hostData(d, h).compact_tokens) ? hostData(d, h).compact_tokens : null;
  const kTok = n => `${int(Math.round(n / 1000))}K 词元`;
  const WHY = {
    C01: 'AI 每次开对话都是一张白纸，不知道这是哪个项目、《他要什么》放在哪；这条在打开、恢复和压缩后递上路径，免得它凭印象找、找错项目动手。',
    C02: '规矩会改版，开着的对话读到的可能还是旧版；这条开场时核一下入口是不是当前版，不是就指出新版在哪，免得照旧规矩办事。',
    C03: SAME.prompt,
    C04: '有些动作照规矩不该这样做（用错浏览器、派活走错路、反复读同一张图这类）；这条在动手前拦下，当场改对，不用事后返工。',
    C05: 'AI 埋头干活时容易忘了登记工程、报估时、该查网时查网、长等时盯着；这条在工具用完时顺手提一句，不拦它。',
    C06: SAME.compact,
    C09: SAME.stop,
    C10: 'AI 收工后后台还有活在跑、却没人等结果，结果就没人收；这条等主对话空着够久还没人管，就叫醒原对话一次去收，每件只叫一次。',
    C11: SAME.helper,
    C12: '记下帮手干完没有，“空等时叫醒”靠它判断后台还有没有活，免得白叫醒或该叫的没叫。',
    C13: '让 Claude 桌面版里的花费面板跟着对话一起出来，不用自己去找就看得到这次花了多少。',
    C14: '窗口晚一步才挂到对话上时补挂花费面板，免得这次对话看不到花费。',
    C15: '前面没挂上的，每轮开始再补挂一次，保证花费面板在。',
    C16: '花费有变化时让面板下次画的时候刷新，免得一直显示旧数。',
    C17: '真正把花费画到面板上；没有它面板是空的。',
    C18: '对话出错停下了，你不在跟前就不知道它停了；这条把停下的原因交给实况推手机。',
    X01: 'Codex 开对话时不知道规矩是不是当前版、这是哪个项目；这条开场时核一下规矩入口，再递上工程和《他要什么》的位置，免得照旧规矩办事或在别的项目里动手。',
    X02: SAME.prompt,
    X03: SAME.helper,
    X04: '有些调用照规矩不该这样做（走错浏览器入口、派帮手走错路、查订阅、用过时的型号）；这条在动手前拦下，当场改对。',
    X05: '工具用完时顺手提醒该查网、该报估时、该压缩了，并认出你已经答过的弹题和处理过的审批，免得同一件事反复问你。',
    X06: SAME.compact,
    X08: 'Codex 停下来等批准时，你不在电脑前它就一直卡着；这条把要你批准的事推到手机。',
    X09: SAME.stop,
    X11: 'Codex 碰到要批准的动作，由它自带的审核模型代批，不用每次停下来等你；它看着不妥的照样拦下。',
    X12: '给 Codex 的浏览器和电脑操作插件报一声“这一轮结束了”，让它把手上的操作收尾。',
    X13: '你按停时通知浏览器和电脑操作插件也停手，免得对话停了它还在点。',
    X14: '帮手干完时，让浏览器和电脑操作插件把那个帮手的操作收尾。',
    X15: '你按停以后，还在等的审批提醒就过时了；这条把它撤掉，免得停了还收到要你批准的推送。',
    A01: 'Antigravity 开对话时核一下规矩入口是不是当前版；桌面上的主对话再提醒它标一下这次能不能给外人看，免得照旧规矩办事，或把私事写在外人看得到的地方。',
    A02: 'Antigravity 没有“收到消息”和“压缩前”这两个当口；这条在每次叫模型前补上时间、资料状态、没答的题和刚才的工具错误，顶上那两个当口的活。',
    A04: '有些工具照规矩不该这样用（比如用它自带的生图、查订阅）；这条在动手前拦下。派帮手时还顺手告诉帮手时间、资料状态和型号。',
    A05: '工具报错了模型自己未必注意到；这条把错误递给下一次叫模型，并登记你已经答过的弹题。',
    A06: SAME.stop,
  };
  const whyOf = hook => F(hook.why, '为什么要它') || esc(WHY[hook.id] || '');
  const REASONS = [['larger_orders', '单子比想的大'], ['rework', '返工'], ['missed_follow_up', '漏想的后续活'], ['long_tests', '长测试'], ['scope_added', '中途加需求']];
  const SIZES = [['small', '小单'], ['medium', '中单'], ['large', '大单']];

  // 工期、工作量、钩子各有一排“全部｜近 7 天｜近 30 天”，各切各的，打开默认全部（本人 16:35 照图点头；R77“各卡片的时间范围要能改”）
  // hookPeriod 是 null 时：后台给了分段就看“全部”；旧后台只有近 7 天，先看近 7 天，别的两档写“后台还没送来”
  let state, viewer = 'public', expanded = null, period = 'all', estPeriod = 'all', hookPeriod = null;
  // 看哪一家：null 是“全部”（三家都看）。本人 11-24 13:00：“三个可点默认全部”“智能体页永远是打开默认全部，只要不点”——
  // 只放在内存里，不写网址、不写本地存储，刷新、重开都回到全部。页顶、各块图例、三家那几行点哪一处都改这同一个，整页一起跟着变。
  let only = null;
  const modelsOpen = new Set();  // 哪几家的型号清单展开了全部
  const drawn = new Set();       // 图只在第一次出现时描线、长柱
  const cellsBefore = new Map(); // 钩子格上一轮的次数：变了闪一下
  const F = (v, name) => field(v, viewer, name);
  const shown = () => only ? HOSTS.filter(h => h.id === only) : HOSTS;
  const dim = id => only && id !== only ? ' ag-dim' : '';   // 只看一家时，别家的卡、行、列变淡
  const dimAttr = id => only && id !== only ? ' class="ag-dim"' : '';
  // 同一时刻只说一次（M746）：顶栏固定在屏幕顶上，已写“HH:MM 读到”；卡里的“截至”跟它（或这张卡已写的）同一分钟就不写，不一样才写这张卡自己的时刻
  let barAt = null;
  const minuteOf = at => { const t = T.stamp(at); return t == null ? null : Math.floor(t / 60000); };
  const asof = (at, ...also) => { const m = minuteOf(at); return m == null || [barAt, ...also].some(s => minuteOf(s) === m) ? '' : `截至 ${when(at)}`; };
  const ruleVer = (v, label = esc(v), cls) => v ? link('/rules/', label, cls) : '';   // 规矩版本号点了去规则页（本人 11-24：“规则E多少多少可以跳转到规则页”）
  // 页顶那一排：全部｜Claude｜Codex｜Antigravity，和本页切时段的按钮同一种样子，一眼看得出能点
  const picker = () => `<div class="tp-seg ag-pick" role="group" aria-label="看哪一家"><button type="button" data-only="all" aria-pressed="${!only}">全部</button>${HOSTS.map(h =>
    `<button type="button" data-only="${h.id}" style="--host:${h.color}" aria-pressed="${only === h.id}"><i class="tp-swatch"></i>${h.name}</button>`).join('')}</div>`;
  // 各块的图例：全部 + 三家，点一家整页只看它，再点一次或点“全部”回到三家
  const chips = (hint = true) => `<p class="ag-mlegend"><button type="button" class="ag-chip ag-chip--all${only ? '' : ' is-on'}" data-only="all" aria-pressed="${!only}">全部</button>${HOSTS.map(h =>
    `<button type="button" class="ag-chip${only === h.id ? ' is-on' : only ? ' is-off' : ''}" data-pick="${h.id}" aria-pressed="${only === h.id}" style="--host:${h.color}"><i class="tp-swatch"></i>${h.name}</button>`).join('')}
    ${hint ? `<span class="ag-mhint">${only ? `整页只看 ${HOSTS.find(h => h.id === only).name}，按它自己的数画 · 再点一次或点“全部”回到三家` : '点一家，整页只看它'}</span>` : ''}</p>`;
  const hostData = (d, h) => d.hosts?.[h.name] || {};
  const keyOf = hook => String(hook.key || '').replace(/:external$/, '');
  const nameOf = hook => F(hook.title, '钩子名称') || esc(NAMES[keyOf(hook)] || keyOf(hook) || '额外配置的回调');
  const stationOf = hook => STATION_OF[keyOf(hook)] || 'other';
  const firstTime = id => { const fresh = !drawn.has(id); drawn.add(id); return fresh; };

  // —— 一、三家现在管得对不对 ——
  function checks(d, h) {
    const x = hostData(d, h), rows = [];
    const add = (ok, good, bad, extra = {}) => rows.push({ ok, text: ok === false ? bad : good, ...extra });
    const entry = x.entry || {};
    add(entry.current ?? null, `开场读到的规矩是当前版 ${entry.version || ''}`, `开场读到的规矩不是当前版 ${entry.version || ''}`, entry.version ? { href: '/rules/' } : {});
    if (h.id !== 'antigravity') {
      const off = x.memory === false && Object.values(x.memory_options || {}).every(v => v !== true);
      add(x.memory === true ? false : x.memory === false ? off : null, '自带记忆关着', '自带记忆开着，和规矩不一样');
    }
    const eager = typeof x.approval === 'string' && /EAGER/.test(x.approval);
    add(x.waits_for_owner === false || eager ? true : x.waits_for_owner === true ? false : null, '动手前不停下等批准', '动手前会停下等批准，和规矩不一样');
    for (const hook of list(d.hooks).filter(row => row.host === h.name)) {
      const name = NAMES[keyOf(hook)] || keyOf(hook);
      if (hook.id) add(Boolean(hook.installed), `钩子「${name}」装着`, `钩子「${name}」定稿要装，还没装上`, { href: `#hooks-${stationOf(hook)}` });
      else if (hook.installed) add(false, '', `钩子「${name}」装着，说明表里没写`, { href: `#hooks-${stationOf(hook)}` });
      // 近 7 天出过的错是历史，不算“现在差几处”（数据约定第 10 节：当前差几处从 health 的清单取，旧错在历史）；钩子表里照样标“错 N”
    }
    const pass = rows.filter(r => r.ok === true).length, fail = rows.filter(r => r.ok === false), unknown = rows.filter(r => r.ok == null).length;
    return { rows, pass, fail, unknown, total: rows.length };
  }
  function scoreCard(d, h) {
    const c = checks(d, h), x = hostData(d, h), health = list(d.health?.providers).find(p => p.id === h.id) || {};
    const issues = list(health.issues);
    const owner = health.status === 'owner', ignored = health.status === 'ignored';
    const tone = c.fail.length || issues.length ? (owner ? 'owner' : 'repair') : c.unknown ? 'off' : 'ok';
    const word = owner ? `要${T.you(viewer)}看` : c.fail.length ? `差 ${c.fail.length} 处` : c.unknown ? `${c.unknown} 项没读到` : '全对上';
    const ringColor = tone === 'ok' ? T.TONE.ok : tone === 'off' ? T.TONE.off : T.TONE.repair;
    // 每处毛病写谁在修、第几轮，能点的点到那一轮或那件事；只有一处时写在“差 1 处”下面，不在清单里再写一遍
    const fixer = i => i.handler_text ? F(i.handler_text, '谁在修') : i.handler ? `${F(i.handler, '谁在修')}${i.repairing === false ? '' : '在修'}` : '';
    const fixText = i => [fixer(i) || (owner ? '' : '还没人接手'), known(i.round) && `第 ${int(i.round)} 轮`].filter(Boolean).join(' · ');
    const fixLink = (i, html) => html && T.path(i.href) ? `<a href="${esc(T.path(i.href))}">${html} ›</a>` : html;
    const list1 = issues.length ? issues.map(i => `<li><span class="tp-dot" data-tone="${owner ? 'owner' : 'repair'}"></span><span>${F(i.text)}${issues.length > 1 && fixText(i)
        ? `<small>${fixLink(i, fixText(i))}</small>` : ''}</span></li>`).join('')
      : c.fail.map(r => `<li><span class="tp-dot" data-tone="repair"></span><span>${r.href ? `<a href="${esc(r.href)}">${esc(r.text)}</a>` : esc(r.text)}</span></li>`).join('');
    const lead = issues.find(i => fixer(i)) || issues.find(i => T.path(i.href)) || issues[0];
    const fix = owner || !(c.fail.length || issues.length) ? ''
      : `<p class="ag-fix">${lead ? fixLink(lead, fixText(lead)) : '还没人接手'}</p>`;
    const stats = d.hook_stats?.totals?.[h.id] || {};
    return `<article class="ag-score tp-flashable${dim(h.id)}" data-host="${h.id}">
      <header><span>${h.name}</span><small>${[x.entry?.version && ruleVer(x.entry.version, `规矩 ${esc(x.entry.version)}`, 'ag-rulever'), known(stats.installed) && `钩子装着 ${stats.installed} 条 · 定稿 ${stats.expected} 条`].filter(Boolean).join(' · ')}</small></header>
      <div class="ag-score__main"><div><p class="ag-score__word" data-tone="${tone}">${word}</p>${fix}
        <p class="tp-small">${c.fail.length ? `${c.total} 项里 ${c.pass} 项照规矩` : `${c.total} 项都照规矩`}${ignored ? ` · ${T.you(viewer)}定了不管` : ''}${owner && health.href ? ` · ${link(health.href, '在等你的事里 ›')}` : ''}</p></div>
        ${T.ring(c.pass, c.total, { color: ringColor })}</div>
      ${list1 ? `<ul class="ag-diff">${list1}</ul>` : '<p class="ag-ok">规矩、记忆、审批和钩子都和定稿一样。</p>'}</article>`;
  }
  // 首卡不另写“截至”：它就是这一轮的 d.at，顶栏“读到”或大标题区已经写过（页头同一时刻只说一次，本人 11-24 16:13 看图点头，M746）
  function statusSection(d) {
    return `<section class="tp-panel" id="status"><div class="tp-panel__head"><h2>三家现在管得对不对</h2></div>
      <div class="tp-grid ag-scores">${HOSTS.map(h => scoreCard(d, h)).join('')}</div></section>`;
  }

  // —— 二、工期准不准 ——
  const stats = (d, h) => d.work_stats?.hosts?.[h.id] || {};
  const TIMES = [['all', '全部'], ['7d', '近 7 天'], ['30d', '近 30 天']];
  const timeLabel = p => TIMES.find(t => t[0] === p)?.[1] || '';
  const timeSeg = (key, cur) => `<div class="tp-seg ag-tseg" role="group" aria-label="看哪一段">${TIMES.map(([id, label]) =>
    `<button type="button" data-tseg="${key}:${id}" aria-pressed="${cur === id}">${label}</button>`).join('')}</div>`;
  // 某一段的某一家：全部读 hosts.<家>（后台说和 work_stats.periods.all 是同一份），近 7／30 天读 periods.<段>.hosts.<家>；
  // 后台还没给这一段的 work、estimate（旧后台每家只有五个数）时是 null，页面写“后台还没送来”，不拿别的数凑
  const inPeriod = (d, p, h) => {
    if (p === 'all') return stats(d, h);
    const x = d.work_stats?.periods?.[p]?.hosts?.[h.id];
    return x && typeof x.work === 'object' && typeof x.estimate === 'object' ? x : null;
  };
  const est = (d, h) => inPeriod(d, estPeriod, h)?.estimate || {};
  // 有派单却一件开工都没记下，是采集没采上，不是没干活（本人 11-23 08:11：“我最近肯定是和 antigravity 有对话的”）。按全部记录判断，近 7 天没开工不算没采上
  const missing = (d, h) => { const w = stats(d, h).work || {}; return !d.work_stats || w.starts === 0 || w.starts == null; };
  // 最上面一行“全部”：三家合起来准不准，和三家同一种写法、字更大（本人 16:35 照图点头）。件数按各家的件数加起来，比例按件数重算，不是三个百分比取平均
  function accuracyAll(d) {
    const rows = HOSTS.filter(h => !missing(d, h)).map(h => est(d, h)).filter(e => e.samples && known(e.accuracy));
    const n = rows.reduce((s, e) => s + e.samples, 0);
    if (!n) return '';
    const hits = rows.reduce((s, e) => s + Math.round(e.accuracy * e.samples), 0);
    const timed = rows.every(e => known(e.on_time)) ? rows.reduce((s, e) => s + Math.round(e.on_time * e.samples), 0) / n : null;
    return `<div class="ag-acc__row ag-acc__row--all${only ? ' ag-dim' : ''}"><span class="tp-hostname">全部</span><div><p class="tp-big">${big(hits / n * 100, 'acc-all')}<small>%</small></p>
      <p class="tp-small">${known(timed) ? `<span>按时 <b>${pct(timed)}</b></span>` : ''}<span>${int(n)} 件</span></p></div></div>`;
  }
  function accuracyColumn(d) {
    return `<div class="ag-acc">${accuracyAll(d)}${HOSTS.map(h => {
      const e = est(d, h);
      const body = missing(d, h) || !e.samples ? `<p class="tp-mid" data-tone="off">${esc(missing(d, h) ? '还没采上' : estPeriod === 'all' ? '没有完工记录' : '这段时间没有完工')}</p>`
        : `<p class="tp-big">${big(e.accuracy * 100, 'acc-' + h.id)}<small>%</small></p><p class="tp-small"><span>按时 <b>${pct(e.on_time)}</b></span><span>${int(e.samples)} 件</span></p>`;
      return `<div class="ag-acc__row${dim(h.id)}" data-host="${h.id}"><span class="tp-hostname">${h.name}</span><div>${body}</div></div>`;
    }).join('')}</div>`;
  }
  function ratioPlot(d) {
    const W = 470, H = 214, pad = { l: 46, r: 16, t: 26, b: 28 }, w = W - pad.l - pad.r, h = H - pad.t - pad.b;
    const values = HOSTS.flatMap(hh => SIZES.map(([s]) => est(d, hh).size_ratios?.[s]).filter(r => r?.samples))
      .flatMap(r => [r.actual_over_estimate, r.p75]).filter(known);
    const lo = .4, hi = Math.max(2, Math.ceil((Math.max(...values, 1) + .2) * 2) / 2);
    const x = v => pad.l + (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo) * w;
    const rowY = i => pad.t + (i + .5) * h / 3;
    let out = `<rect class="tp-band" x="${x(.7)}" y="${pad.t - 6}" width="${x(1.1) - x(.7)}" height="${h + 6}" rx="3"/>
      <line class="tp-bandline" x1="${x(1)}" x2="${x(1)}" y1="${pad.t - 6}" y2="${pad.t + h}"/>
      <text x="${(x(.7) + x(1.1)) / 2}" y="${pad.t - 11}" text-anchor="middle" style="fill:#00813f;font-weight:700">允许范围</text>`;
    for (let v = .5; v <= hi + 1e-9; v += .5) out += `<text x="${x(v)}" y="${H - 8}" text-anchor="middle">${dec(v)}×</text><line class="tp-gridline" x1="${x(v)}" x2="${x(v)}" y1="${pad.t}" y2="${pad.t + h}"/>`;
    SIZES.forEach(([size, label], i) => {
      const y0 = rowY(i);
      out += `<text x="${pad.l - 10}" y="${y0 + 4}" text-anchor="end" style="font-size:12.5px;fill:#3d3d3a;font-weight:700">${label}</text><line class="tp-gridline" x1="${pad.l}" x2="${pad.l + w}" y1="${y0}" y2="${y0}"/>`;
      const hosts = shown();
      hosts.forEach((hh, j) => {
        const r = est(d, hh).size_ratios?.[size];
        if (!r?.samples || !known(r.actual_over_estimate) || missing(d, hh)) return;
        const y = y0 + (hosts.length === 1 ? 0 : (j - 1) * 13), v = r.actual_over_estimate;
        if (known(r.p25) && known(r.p75)) out += `<line x1="${x(r.p25)}" x2="${x(r.p75)}" y1="${y}" y2="${y}" stroke="${hh.color}" stroke-width="3" stroke-linecap="round" opacity=".45"/>`;
        out += `<circle cx="${x(v)}" cy="${y}" r="5.5" fill="${hh.color}" stroke="#fff" stroke-width="1.5"/><text x="${x(v) + 9}" y="${y + 4}" style="font-weight:700;fill:#3d3d3a">${dec(v, 2)}×</text>`;
      });
    });
    return `<svg class="tp-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="实际是估的几倍">${out}</svg>`;
  }
  function weekLabels(d) {
    const weeks = list(stats(d, HOSTS[0]).weeks);
    return weeks.map((w, i) => i === weeks.length - 1 ? '这周' : `${T.day(w.week_start + 'T00:00:00+08:00')} 周`);
  }
  function trend(d) {
    const labels = weekLabels(d);
    const series = shown().filter(h => !missing(d, h)).map(h => ({ color: h.color, values: list(stats(d, h).weeks).map(w => w.estimate?.samples >= 3 ? w.estimate.accuracy : null) }));
    const thin = shown().filter(h => !missing(d, h)).map(h => ({ h, w: list(stats(d, h).weeks).at(-1) })).filter(({ w }) => w && w.estimate?.samples > 0 && w.estimate.samples < 3);
    return labels.length ? T.line({ series, labels, width: 470, height: 214, max: 1, draw: firstTime('trend') })
      + `<p class="tp-small">一周完工不到 3 件的不画点${thin.length ? `：这周 ${thin.map(({ h, w }) => `${h.name} ${w.estimate.samples} 件`).join('、')}` : ''}。</p>` : '<p class="tp-empty">还没有按周的记录。</p>';
  }
  function reasons(d) {
    const hosts = shown().filter(h => !missing(d, h));
    const rows = REASONS.map(([key, label]) => ({ label, parts: hosts.map(h => ({ h, n: est(d, h).overtime_reasons?.[key] || 0 })) }));
    const other = hosts.reduce((s, h) => { const r = est(d, h).overtime_reasons || {}; return s + (r.other || 0) + (r.unknown || 0); }, 0);
    const total = hosts.reduce((s, h) => s + (est(d, h).overtime_reasons?.overdue || 0), 0);
    const max = Math.max(1, ...rows.map(r => r.parts.reduce((s, p) => s + p.n, 0)));
    // 图例挪到标题下面（照 16:35 点头的图），看得出它管这一整块；柱子行距放宽一点，和右边“三种估法”分量匀一些（本人：“右多左少”）
    return `<p class="tp-sub">超时原因 <small>${only ? `${hosts[0]?.name || ''} ` : ''}超时共 ${int(total)} 件；“中途加需求”可能和别的原因同时算${other ? `，另有 ${int(other)} 件没写或写了别的原因` : ''}</small></p>
      ${chips()}
      <div class="tp-bars ag-reasons">${rows.map(r => { const sum = r.parts.reduce((s, p) => s + p.n, 0); return `<div class="tp-bar"><span>${r.label}</span>
        <span class="tp-bar__track"><span class="ag-stack" style="width:${sum / max * 100}%">${r.parts.filter(p => p.n).map(p => `<span class="tp-bar__fill" style="--fill:${p.h.color};flex:${p.n}">${p.n}</span>`).join('')}</span></span>
        <span class="tp-bar__num">${int(sum)}</span></div>`; }).join('')}</div>`;
  }
  // 三种估法各对上几件。本人 11-23：先别写“谁更准”；原来的“程序 29%”其实是“全按中等大小算”的对照，不是开工时程序真推荐的。
  // 读后台 work_stats.estimate_baselines：{ scope, samples, rows:[{id, hits, samples, basis}], hosts:{<家>:{rows}} }，
  // id 是 all_medium（全按中等大小算的对照）、program_at_start（开工时程序推荐的）、ai_reported（实际报给本人的）。没出数时写“在核”，不下结论。
  const BASES = [['program_at_start', '开工时程序推荐的'], ['ai_reported', `实际报给${'{you}'}的`], ['all_medium', '全按中等大小算（对照）']];
  function compare(d) {
    const b = estPeriod === 'all' ? d.work_stats?.estimate_baselines : d.work_stats?.periods?.[estPeriod]?.estimate_baselines;
    const name = label => label.replace('{you}', T.you(viewer));
    const find = (list_, id) => list(list_).find(r => r.id === id);
    const ok = rs => BASES.every(([id]) => { const r = find(rs, id); return r && known(r.hits) && known(r.samples) && r.samples > 0; });
    // 只看一家时换成这一家自己的三个数（后台 hosts.<家>.rows）；这一家没出数就照旧写三家合起来的
    const mine = only && ok(b?.hosts?.[only]?.rows) ? b.hosts[only].rows : null, rows = mine || list(b?.rows);
    const ready = ok(rows);
    if (!ready) {
      return `<p class="tp-sub">三种估法各对上几件 <small>对照口径在核</small></p>
        <div class="ag-bases">${BASES.map(([, label]) => `<p><span>${esc(name(label))}</span><b class="tp-fog">在核</b></p>`).join('')}</div>
        <p class="tp-small">后台正在把这三个数分开算，每个带口径和件数；出数以前不比哪种更准。</p>`;
    }
    const share = r => r.hits / r.samples;
    // 三条口径后半句往往一字不差（“与另两种估法同看 N 件，……不计。”）：每条下面只留各自不同的前半句，相同的后半句在底下写一次，
    // 这一栏短下来，和左边“超时原因”分量匀一些（本人 16:35：“右多左少，看看能不能优化一下”）。不是普通文字或找不到相同的后半句，照原样每条写全
    const split = (() => {
      const texts = BASES.map(([id]) => find(rows, id)?.basis);
      if (!texts.every(t => typeof t === 'string' && t)) return null;
      let k = 0; const min = Math.min(...texts.map(t => t.length));
      while (k < min && texts.every(t => t[t.length - 1 - k] === texts[0][texts[0].length - 1 - k])) k++;
      const tail = texts[0].slice(texts[0].length - k), cut = tail.indexOf('，');
      if (cut < 0 || tail.length - cut < 8) return null;
      const heads = texts.map(t => t.slice(0, t.length - k + cut));
      return heads.every(Boolean) ? { heads, tail: tail.slice(cut + 1) } : null;
    })();
    const bar = ([id, label], i) => { const r = find(rows, id);
      const note = split ? F(split.heads[i], '口径') : r.basis ? F(r.basis, '口径') : '';
      return `<div class="ag-base${id === 'all_medium' ? ' is-ref' : ''}"><div class="tp-bar"><span>${esc(name(label))}</span><span class="tp-bar__track"><span class="tp-bar__fill" style="--fill:${id === 'all_medium' ? '#cfcdc5' : '#8f8d85'};width:${share(r) * 100}%"></span></span><span class="tp-bar__num">${int(r.hits)}/${int(r.samples)}</span></div>
        ${note ? `<p class="tp-small">${note}</p>` : ''}</div>`; };
    const p = find(rows, 'program_at_start'), a = find(rows, 'ai_reported'), gap = a.hits - p.hits;
    const same = p.samples === a.samples, close = same && Math.abs(gap) <= Math.max(2, Math.round(p.samples * .03));
    const say = !same ? `两个数算的件数不一样（${int(p.samples)} 件对 ${int(a.samples)} 件），先不放在一起比。`
      : close ? `开工时程序推荐的和实际报的差不多：${int(p.hits)} 件对 ${int(a.hits)} 件。`
      : `同一批 ${int(p.samples)} 件里，实际报的比程序推荐的${gap > 0 ? '多' : '少'}对上 ${int(Math.abs(gap))} 件（${int(a.hits)} 对 ${int(p.hits)}）。`;
    const per = HOSTS.map(h => ({ h, r: b.hosts?.[h.id]?.rows })).filter(x => BASES.every(([id]) => known(find(x.r, id)?.hits)));
    const scope = mine ? `${HOSTS.find(h => h.id === only).name} 的 ${int(p.samples)} 件` : only ? `${HOSTS.find(h => h.id === only).name} 单独的数还没出，这里是三家合起来的` : b.scope ? F(b.scope, '口径') : `同一批 ${int(p.samples)} 件`;
    return `<p class="tp-sub">三种估法各对上几件 <small>${scope}，落在允许范围内算对上${asof(b.at, d.work_stats?.as_of) ? ` · ${esc(asof(b.at, d.work_stats?.as_of))}` : ''}</small></p>
      <div class="tp-bars">${BASES.map(bar).join('')}</div>
      <p class="ag-say">${say}</p>
      ${per.length ? `<p class="tp-small">${per.map(({ h, r }) => `<span class="ag-perhost${dim(h.id)}"><span data-host="${h.id}" class="tp-hostname">${h.name}</span> ${BASES.map(([id, label]) => `${esc(name(label).replace('（对照）', ''))} ${int(find(r, id).hits)}/${int(find(r, id).samples)}`).join(' · ')}</span>`).join('<br>')}</p>` : ''}
      <p class="tp-small">${split ? `三种的口径一样：${F(split.tail, '口径')}<br>` : ''}“全按中等大小算”只是对照：假设每件都按中等估，不是程序开工时真给的数。</p>`;
  }
  function estimateSection(d) {
    const ws = d.work_stats;
    if (!ws) return `<section class="tp-panel" id="estimate"><div class="tp-panel__head"><h2>工期准不准</h2></div><p class="tp-empty">工期账这一轮没读到。</p></section>`;
    if (ws.unavailable_reason) return `<section class="tp-panel" id="estimate"><div class="tp-panel__head"><h2>工期准不准</h2></div><p class="tp-empty">${esc(ws.unavailable_reason)}</p></section>`;
    // 时间那排在标题行右边（照 16:35 点头的图），准的比例、实际是估的几倍、超时原因、三种估法跟着换；按周走势本来就按周画，不跟着换
    const head = `<div class="tp-panel__head"><h2>工期准不准<small>落在估算程序给的允许范围内才算准，估多估少都算偏</small></h2><div class="ag-mhead">${timeSeg('est', estPeriod)}${asof(ws.as_of) ? `<span class="tp-asof">${esc(asof(ws.as_of))}</span>` : ''}</div></div>`;
    if (!HOSTS.every(h => inPeriod(d, estPeriod, h))) return `<section class="tp-panel" id="estimate">${head}<p class="tp-empty">${timeLabel(estPeriod)}的工期数后台还没送来，先看“全部”。</p></section>`;
    const weeks = weekLabels(d).length;
    return `<section class="tp-panel" id="estimate">${head}
      <div class="tp-grid ag-est">
        <div><p class="tp-sub">准的比例</p>${accuracyColumn(d)}</div>
        <div><p class="tp-sub">实际是估的几倍 <small>点在绿带里算准</small></p>${ratioPlot(d)}<p class="tp-small">绿带按估 1 小时以上的画：早 30% 到晚 10% 都算准；1 小时以内的单子是早 15 分钟到晚 5 分钟。</p></div>
        <div><p class="tp-sub">按周走势${weeks ? ` <small>近 ${weeks} 周，一直按周画</small>` : ''}</p>${trend(d)}</div>
      </div>
      <div class="tp-grid ag-est2"><div>${reasons(d)}</div><div>${compare(d)}</div></div></section>`;
  }

  // —— 三、报了估时的活（原名“三家各干了多少活”，本人 11-26 04:27 选 A 改名；和工期放一起） ——
  const MODEL = id => {
    const m = /^(claude|gpt|gemini)-(.+)$/.exec(String(id || ''));
    if (!m) return String(id || '');
    if (m[1] === 'claude') { const [name, ...v] = m[2].split('-'); return `${name[0].toUpperCase()}${name.slice(1)} ${v.join('.')}`; }
    if (m[1] === 'gpt') { const [ver, ...name] = m[2].split('-'); return `GPT-${ver} ${name.map(s => s[0].toUpperCase() + s.slice(1)).join(' ')}`; }
    return 'Gemini ' + m[2].split('-').map(s => /^\d/.test(s) ? s : s[0].toUpperCase() + s.slice(1)).join(' ');
  };
  const summaryModel = row => /^gpt-6-luna$/.test(row.model) && row.effort === 'low';
  // 时间那排“全部｜近 7 天｜近 30 天”（本人 16:35 选 B：只改时间那排、不加“全部”卡）。开工、总工时、派出去、型号都读 periods.<段>.hosts.<家>.work；
  // 总工时照旧是登记的完工用时（R56 对这张卡只说改时间选项），和右边按周的柱子同一种算法；按实际干活时间算的是上面“三家干了多少”和首页智能体卡。
  // 后台还没给这一段（旧后台每家只有五个数）就是 null，每格写“后台还没送来”
  const workFor = (d, h) => inPeriod(d, period, h)?.work || null;
  function workCard(d, h) {
    const w = workFor(d, h), lost = missing(d, h);
    const models = list(w?.models).filter(m => !summaryModel(m)).sort((a, b) => b.count - a.count);
    const orders = !w ? null : known(w.work_orders) ? w.work_orders : known(w.orders) ? w.orders - list(w.models).filter(summaryModel).reduce((s, m) => s + m.count, 0) : null;
    // 一件没开工、也没有完工用时，就是 0 小时，不写“没读到”（沿 r79）
    const minutes = !w ? null : known(w.actual_minutes) ? w.actual_minutes : w.starts === 0 ? 0 : null;
    const cell = (label, value, unit, key, fmt) => `<div class="ag-work__row"><span>${label}</span>${!w ? '<b class="tp-fog">后台还没送来</b>' : lost && key !== 'orders' ? `<b class="tp-fog">还没采上</b>`
      : known(value) ? `<b class="tp-mid">${big(value, `work-${h.id}-${key}-${period}`, fmt)}<small>${unit}</small></b>` : `<b class="tp-fog">没读到</b>`}</div>`;
    // 型号是普通清单，不做成像按钮的圆角小签；超过 4 种的“另 N 种”是真按钮，就地展开全部、再点收起（本人 11-23 23:53：“这种怎么都按不了？”）
    const open = modelsOpen.has(h.id), shown = open ? models : models.slice(0, 4);
    const more = models.length > 4 ? `<button type="button" class="ag-more" data-models="${h.id}" aria-expanded="${open}">${open ? '收起' : `另 ${models.length - 4} 种`}<span class="tp-chev" aria-hidden="true"></span></button>` : '';
    return `<article class="ag-work${dim(h.id)}" data-host="${h.id}"><header>${h.name}</header>
      ${cell('开工', w?.starts, '件', 'starts')}${cell('登记工时', known(minutes) ? minutes / 60 : null, '小时', 'hours', 'dec')}${cell('派出去', orders, '单', 'orders')}
      <div class="ag-modelbox"><p class="ag-models__head">派出去的单按型号 · 档位分</p>${!w ? '<p class="tp-muted ag-models__none">后台还没送来</p>' : shown.length ? `<ul class="ag-models">${shown.map(m => `<li><span>${esc(MODEL(m.model))} · ${esc(m.effort)}</span><b>${int(m.count)}</b></li>`).join('')}</ul>` : '<p class="tp-muted ag-models__none">没有派单</p>'}${more}</div>
      ${lost ? '<p class="tp-small">开工和登记工时这一家还没采上，派单数是派活工具记的。</p>' : ''}</article>`;
  }
  function workSection(d) {
    const ws = d.work_stats;
    if (!ws || ws.unavailable_reason) return '';
    const weeks = list(stats(d, HOSTS[0]).weeks), labels = weekLabels(d);
    // “几号起才有记录”只在选的这一段（近 7／30 天）起点早于最早一条记录时写；“全部”和记录全了的不写，后台没给起点判断不了也不写（M911）
    const earliest = ws.periods?.all?.from, start = ws.periods?.[period]?.from;
    const first = period !== 'all' && Date.parse(start) < Date.parse(earliest) ? earliest : null;
    // 只看一家时柱子只画这一家、按它自己的数定高（Antigravity 叠在三家里几乎看不见），图例点哪家整页跟着变（本人 11-24：“三家各干了多少活右下角不能点”）
    const rows = weeks.map((w, i) => ({ label: labels[i], parts: shown().filter(h => !missing(d, h)).map(h => ({ color: h.color, value: (list(stats(d, h).weeks)[i]?.work?.actual_minutes || 0) / 60 })) }));
    return `<section class="tp-panel" id="work"><div class="tp-panel__head"><h2>报了估时的活<small>派活时报过估时的活；登记工时是完工时记下的用时，和上面实际在干的总时间不是一回事</small></h2><div class="ag-mhead">${timeSeg('work', period)}${first ? `<span class="tp-asof">${esc(T.day(first))} 起才有记录</span>` : ''}</div></div>
      <div class="tp-grid ag-workgrid"><div class="tp-grid ag-works">${HOSTS.map(h => workCard(d, h)).join('')}</div>
      <div><p class="tp-sub">按周比 · 登记工时（小时）</p>${columns(rows, -1)}${chips()}</div></div></section>`;
  }
  const columns = (rows, highlight) => T.columns({ rows, width: 440, height: 236, fmt: v => v >= 10 ? int(v) : dec(v), grow: firstTime('cols'), highlight });

  // —— 四、开场和接续 · 动手和权限 ——
  function row(label, cells, { diff = [], note = '' } = {}) {
    // 相邻几家一样的合成一格只写一次；合成的格子和别的格子一样靠左，开头小字写是哪几家一样（本人 11-23 23:53：“怎么排版还奇形怪状的？”）
    const out = [];
    cells.forEach((c, i) => { const last = out.at(-1); if (last && last.html === c && !diff[i] && !last.diff) last.span++; else out.push({ html: c, span: 1, diff: diff[i], from: i }); });
    const same = c => c.span === HOSTS.length ? '三家一样' : `${HOSTS.slice(c.from, c.from + c.span).map(h => h.name).join('、')} 一样`;
    const off = c => only && !HOSTS.slice(c.from, c.from + c.span).some(h => h.id === only) ? ' ag-dim' : '';
    return `<tr><th scope="row">${label}${note ? `<small>${note}</small>` : ''}</th>${out.map(c => c.span > 1
      ? `<td colspan="${c.span}" class="ag-same${off(c)}"><span class="ag-same__who">${same(c)}</span>${c.html}</td>`
      : `<td${c.diff || off(c) ? ` class="${[c.diff && 'is-diff', off(c).trim()].filter(Boolean).join(' ')}"` : ''}>${c.html}</td>`).join('')}</tr>`;
  }
  function configSection(d) {
    const x = h => hostData(d, h);
    const entries = HOSTS.map(h => x(h).entry || {});
    const tools = h => Array.isArray(x(h).tools) ? (x(h).tools.length ? x(h).tools.map(t => F(t.name)).join('、') : '没有') : '没读到';
    const unlock = h => { const t = U.fieldText(d.unlock?.[h.name], viewer); return t ? esc(t.replace(/^已登记的 ?(Claude|Codex|Antigravity) ?桌面版/, '已登记的桌面版').replace(/^(Claude|Codex|Antigravity) ?/, '')) : '没读到'; };
    const memory = h => h.id === 'antigravity' ? `无法设置${known(x(h).knowledge?.count) ? `<small>知识目录 ${int(x(h).knowledge.count)} 条${x(h).knowledge.latest_write_day ? '，最近 ' + esc(x(h).knowledge.latest_write_day) + ' 写' : ''}</small>` : ''}`
      : x(h).memory === false ? '关着' : x(h).memory === true ? '开着，和规矩不一样' : '没读到';
    // 压缩线一律写成 K 词元；Claude 的数怎么从百分比算出来见上面 compactAt
    const compact = h => h.id === 'claude' ? (compactAt(d, h) ? `约 ${kTok(compactAt(d, h))}就压缩<small>上下文 ${kTok(CLAUDE_WINDOW)}，设成用到${pctOf(d, h) === 50 ? '一半' : ` ${pctOf(d, h)}%`}，<span class="ag-keep">先留 ${kTok(CLAUDE_REPLY)}给回复</span></small>` : '没读到')
      : h.id === 'codex' ? (compactAt(d, h) ? `${kTok(compactAt(d, h))}就压缩${known(x(h).context_window) ? `<small>配的窗口是 ${kTok(x(h).context_window)}</small>` : ''}` : '没读到')
      : '无法设置<small>宿主不公开压缩线，也没有压缩当口</small>';
    const waits = HOSTS.map(h => x(h).waits_for_owner === false || /EAGER/.test(String(x(h).approval || '')));
    const version = entries.map(e => e.current === true ? `${ruleVer(e.version)} 当前版` : e.current === false ? `不是当前版 ${ruleVer(e.version)}` : '没读到');
    const rows = [
      row('开场先读的规矩', version, { diff: entries.map(e => e.current === false) }),
      // 开场页那一格点进开场页，直接落在这一家（本人 11-24 01:36 定 FEDQ2 选 A）
      row('入口规则多少字', HOSTS.map((h, i) => `${known(entries[i].characters) ? `${int(entries[i].characters)} 字` : '没读到'}${link(`/live/agents/opening/?family=${h.id}`, '看开场页 ›')}`)),
      row('自带记忆', HOSTS.map(memory), { diff: HOSTS.map(h => x(h).memory === true) }),
      row('对话装多满会压缩', HOSTS.map(compact)),
      row('动手前停不停下等批准', HOSTS.map((h, i) => waits[i] ? `不停，直接动手<a class="tp-link" href="#hooks-pre-tool">要拦的几样在钩子“动工具前” ›</a>` : '会停下等批准'),
        { diff: waits.map(w => !w) }),
      row('谁能自己解开资料锁', HOSTS.map(unlock), { note: link('/rules/topic-authorization.html', '规则 ›') }),
      row('多接的工具', HOSTS.map(tools), { note: '电脑接口、Google 以外，能点名用的' }),
    ];
    const codexReview = x(HOSTS[1]).reviewer === 'auto_review';
    return `<section class="tp-panel" id="settings"><div class="tp-panel__head"><h2>开场和接续 · 动手和权限<small>三家一样的合成一格，不一样的标黄</small></h2>${asof(d.at) ? `<span class="tp-asof">${esc(asof(d.at))}</span>` : ''}</div>
      <table class="tp-table ag-config"><thead><tr><th scope="col">项目</th>${HOSTS.map(h => `<th scope="col" data-host="${h.id}"${dimAttr(h.id)}><i class="tp-swatch"></i>${h.name}</th>`).join('')}</tr></thead>
      <tbody>${rows.join('')}</tbody></table>
      <p class="tp-small ag-foot">${codexReview ? 'Codex 遇到要批准的，由它自带的审核模型代批，不找人。' : ''}规矩原文在${link('/rules/', '规则页 ›')}</p></section>`;
  }

  // —— 五、钩子 ——
  // 钩子这一段的数：后台给了 hook_stats.periods.<all|30d|7d>（每段 from_at、cells、totals）就读那一段；旧后台只有近 7 天（就是 hook_stats 本身）
  const hookNow = d => hookPeriod || (d.hook_stats?.periods ? 'all' : '7d');
  const hookView = d => { const hs = d.hook_stats || {}, p = hookNow(d); return hs.periods ? hs.periods[p] || null : p === '7d' ? hs : null; };
  // 拦、错只有新格式的记录里有；旧日志只记了次数和耗时。后台给 blocked_samples（记了拦没拦的有几次），比次数少就照实写只算了其中几次，不当全部
  const outcomeShort = t => known(t?.blocked_samples) && known(t?.runs) && t.blocked_samples < t.runs;
  function hookCell(d, station, h, hv, p) {
    const cell = hv.cells?.[station]?.[h.id] || {}, hooks = list(d.hooks).filter(r => r.host === h.name && stationOf(r) === station);
    const max = Math.max(1, ...HOSTS.flatMap(hh => STATIONS.map(([s]) => hv.cells?.[s]?.[hh.id]?.runs).filter(known)));
    if (!hooks.length) {
      const why = ABSENT[h.id]?.[station] || (station === 'compact' && h.id === 'antigravity' && U.fieldText(hostData(d, h).unavailable_hooks?.pre_compact, viewer)) || '这个当口没装钩子';
      const status = station === 'error' && ABSENT[h.id]?.error
        ? `<small class="ag-errorstatus">${F(hostData(d, h).error_stop?.status) || '没读到'}</small>` : '';
      return `<td class="ag-heat ag-heat--none${dim(h.id)}">${esc(why)}${status}</td>`;
    }
    const heat = known(cell.runs) && cell.runs > 0 ? Math.log10(cell.runs + 1) / Math.log10(max + 1) : 0;
    const key = `${station}/${h.id}`, flashKey = `${p}/${key}`, before = cellsBefore.get(flashKey);   // 切时间段不闪，同一段次数变了才闪
    const flash = before != null && before !== cell.runs ? ' tp-flash' : '';
    cellsBefore.set(flashKey, cell.runs);
    const runs = known(cell.runs) ? `${int(cell.runs)} 次` : '次数还没采上';
    const badges = [known(cell.blocked) && cell.blocked > 0 && `<span class="ag-badge" data-tone="repair">拦 ${int(cell.blocked)}</span>`,
      known(cell.errors) && cell.errors > 0 && `<span class="ag-badge" data-tone="bad">错 ${int(cell.errors)}</span>`].filter(Boolean).join('');
    return `<td class="ag-heat${flash}${dim(h.id)}" style="--heat:${(.05 + heat * .38).toFixed(3)}" data-host="${h.id}"><button type="button" data-cell="${key}" aria-expanded="${expanded === key}" aria-controls="hook-detail-${station}">
      <span>${hooks.length} 条 · ${runs}${known(cell.median_ms) ? ` · ${ms(cell.median_ms)}` : ''}</span>${badges}<span class="tp-chev" aria-hidden="true">${expanded === key ? '收起' : ''}</span></button></td>`;
  }
  function ruleLink(rule) {
    const base = typeof rule === 'string' ? rule.split('/').at(-1) : '';
    const [label, slug] = RULES.get(base) || [];
    return slug ? link(`/rules/topic-${slug}.html`, esc(label) + ' ›') : rule ? F(rule) : '';
  }
  function hookDetail(d, hook, p) {
    // 每条钩子的数也跟着时间段：后台给了 metrics_by_period.<段> 就读那一段（null 是这段没跑过）；旧后台只有近 7 天的 metrics
    const byPeriod = hook.metrics_by_period && typeof hook.metrics_by_period === 'object';
    const got = byPeriod ? hook.metrics_by_period[p] : hook.metrics, m = got || {};
    const sample = list(d.latest_context).find(r => r.host === hook.host && r.hook === hook.key);
    // 按需更新快核（M928）钩子卡“什么时候跑／干什么”两格是规则仓 E:/.agents/config/hook-catalog.json 的 when/what 原样转出（JSON 写不了注释，记在这里），
    // 页面不另算。下面几个数写死在目录句子里，核法照后台第 11 轮；变了改 hook-catalog.json 那句，再改这里的“现”：
    // · C06/X06 压缩前最多等 45 秒：Claude E:/Data/AppData/Claude/profiles/pro/settings.json 和 Codex E:/Data/AppData/Codex/hooks.json 里 PreCompact 的 timeout，现 45；
    // · C05/X05 对话用到 470K 词元提醒一次快压缩：E:/.agents/tools/claude_root_runtime.py 的提醒判断 used >= limit * .94（0.94 × 已登记压缩线，Codex 调同一入口），现 470K；
    // · C10 空等 55 分钟叫醒：同文件 cache_keepalive_minutes() 默认值，和在用环境 EAGENT_CLAUDE_CACHE_KEEPALIVE_MINUTES（只能在 55 内缩短），现 55；
    // · C18 限流等 10 分钟重试：同文件 retry_transient_stop_failure 的 delay_seconds，现 600 秒；
    // · C06 约 490K、X06 500K：后台装上第 11 轮后分别从 Claude 设置 env.CLAUDE_AUTOCOMPACT_PCT_OVERRIDE（现 50，按约 980K 算）和 Codex config.toml 的
    //   model_auto_compact_token_limit（现 500000）读，读不到才用目录里的回退句（约 490K、500K）；装上前是目录写死的句子，就照这两处核。
    const what = F(hook.what, '干什么').split(/\r?\n/).filter(line => line.trim());
    const whatList = what.length ? `<ul class="ag-hook__what">${what.map(line => `<li>${line}</li>`).join('')}</ul>` : '';
    const facts = [['什么时候跑', F(hook.when)], ['干什么', whatList], ['往 AI 眼前塞多少字', F(hook.char_count)], ['会不会拦、让 AI 多跑一轮', F(hook.blocking)],
      ['坏了会怎样', F(hook.failure)], ['归哪条规矩、怎么关', [ruleLink(hook.rule), F(hook.disable)].filter(Boolean).join(' · ')]];
    const numbers = got ? [known(m.runs) && `跑 ${int(m.runs)} 次`, known(m.median_ms) && `中位 ${ms(m.median_ms)}`, known(m.max_ms) && `最慢 ${ms(m.max_ms)}`,
      known(m.blocked) ? `拦 ${int(m.blocked)} 次` : !known(m.errors) && '拦和错还没采上', known(m.errors) && `出错 ${int(m.errors)} 次`,
      outcomeShort(m) && `拦、错只算记了的 ${int(m.blocked_samples)} 次`,
      known(m.continued) && `让 AI 多跑 ${int(m.continued)} 轮`].filter(Boolean).join(' · ')
      : (state => state && (p === '7d' || !state.includes('近 7 天')) ? state : `${p === 'all' ? '一直' : timeLabel(p)}没有运行记录`)(F(hook.metrics_state));
    const tag = hook.id ? (hook.installed ? (hook.enabled === false ? '<span class="tp-tag" data-tone="soft">装着，平时不跑</span>' : '<span class="tp-tag" data-tone="ok">装着</span>')
      : '<span class="tp-tag" data-tone="repair">定稿要装，还没装上</span>') : '<span class="tp-tag" data-tone="repair">装着，说明表里没写</span>';
    const why = whyOf(hook);
    return `<article class="ag-hook" data-host="${String(hook.host || '').toLowerCase()}"><h3>${nameOf(hook)} ${tag}</h3>
      ${why ? `<p class="ag-why"><b>为什么要它</b>${why}</p>` : ''}
      <dl>${facts.filter(([, v]) => v).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
      <p class="ag-hook__num">${timeLabel(p)} · ${numbers}</p>
      ${sample?.text != null ? `<details class="tp-details" id="sample-${esc(hook.host + '-' + hook.key)}"><summary class="live-disclosure">最近一次塞给 AI 的原样 · ${esc(when(sample.at))}</summary><pre>${F(sample.text, '这次塞的内容')}</pre></details>` : ''}</article>`;
  }
  function hooksSection(d) {
    const hs = d.hook_stats || {}, p = hookNow(d), hv = hookView(d), totals = hv?.totals || {};
    // 标题“钩子”后面紧跟时间那排，再是说明，截至靠右（照 16:35 点头的图）
    const top = `<div class="tp-panel__head ag-hookhead"><h2>钩子</h2>${timeSeg('hook', p)}<p class="ag-hooklead">钩子是三家在固定当口自动跑的小程序，次数和耗时由程序自动量。电脑健康、磁盘空间、汇报页答复这类提醒不是单独的钩子，是“收到消息时补状态”等几条里的一项，点开格子能看到每项什么时候出现、看哪些数。</p>${asof(hv?.at || hs.at || d.at) ? `<span class="tp-asof">${esc(asof(hv?.at || hs.at || d.at))}</span>` : ''}</div>`;
    if (!hv) return `<section class="tp-panel" id="hooks">${top}<p class="tp-empty">${timeLabel(p)}的钩子数后台还没送来${hs.periods ? '' : '，先看“近 7 天”'}。</p></section>`;
    const noOutcome = HOSTS.some(h => totals[h.id]?.runs && totals[h.id].blocked == null && totals[h.id].errors == null);
    const short = HOSTS.some(h => outcomeShort(totals[h.id]));
    const head = HOSTS.map(h => {
      const t = totals[h.id] || {};
      const parts = [`${int(t.hooks)} 条`, known(t.runs) ? `跑 ${big(t.runs, 'hooks-' + h.id)} 次` : '次数还没采上', known(t.median_ms) && `中位 ${ms(t.median_ms)}`,
        known(t.blocked) ? `拦 ${int(t.blocked)} 次` : '', known(t.errors) ? `出错 ${int(t.errors)} 次` : '',
        outcomeShort(t) && `<small>拦、错只算记了的 ${int(t.blocked_samples)} 次</small>`].filter(Boolean);
      return `<p class="ag-hooktotal${dim(h.id)}" data-host="${h.id}"><span class="tp-hostname">${h.name}</span>${parts.join(' · ')}</p>`;
    }).join('');
    const body = STATIONS.map(([id, label]) => {
      const open = expanded?.startsWith(id + '/') ? expanded.split('/')[1] : '';
      const host = HOSTS.find(h => h.id === open);
      const detail = host ? list(d.hooks).filter(r => r.host === host.name && stationOf(r) === id).map(hook => hookDetail(d, hook, p)).join('') : '';
      return `<tr id="hooks-${id}"><th scope="row">${label}</th>${HOSTS.map(h => hookCell(d, id, h, hv, p)).join('')}</tr>
        <tr id="hook-detail-${id}" class="ag-detailrow"${host ? '' : ' hidden'}><td colspan="4">${host ? `<p class="tp-sub">${label} · <span class="tp-hostname" data-host="${host.id}">${host.name}</span> <small>每条答六问；数是${p === 'all' ? '全部记录' : timeLabel(p)}</small></p><div class="ag-hooks">${detail}</div>` : ''}</td></tr>`;
    }).join('');
    return `<section class="tp-panel" id="hooks">${top}
      <div class="ag-hooktotals">${head}</div>${noOutcome ? '<p class="tp-small">拦了几次、出错几次这两样还没采上，先只有次数和耗时。</p>' : ''}${short
        ? '<p class="tp-small">旧日志只记了次数和耗时，没记拦没拦、错没错；拦和错只按记了的那部分算，更早的那部分没采上，不算 0。</p>' : ''}
      <table class="tp-table ag-hooktable"><thead><tr><th scope="col">当口</th>${HOSTS.map(h => `<th scope="col" data-host="${h.id}"${dimAttr(h.id)}><i class="tp-swatch"></i>${h.name}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table>
      <p class="tp-small ag-foot">格子越深跑得越多；点开一格看这家在这个当口的每条钩子、六问和最近一次塞给 AI 的原样。</p></section>`;
  }

  // —— 快讯：只滚三家开工、完工（本人 16:35 照图点头）。“××检查拦下 1 次”这类不上快讯：拦下次数里多少是真违规拿不准，本人 03:00 定了不放；
  // 钩子表每格的“拦 N 次”照旧。后台出 feed 就从里面挑开工、完工；没出先拿这页已有的“这周开工几件”拼 ——
  const WORK_KINDS = new Set(['work_start', 'work_finish']);
  const WORK_UNAVAILABLE = new Map([
    ['本次读不到工期账本。', '三家开工、完工的记录这次没读到，下一轮会自动再读'],
    ['工期账本还未生成。', '三家开工、完工的记录还没生成，有了会出现在这里'],
  ]);
  function feed(d) {
    if (Array.isArray(d.feed)) return d.feed.filter(r => WORK_KINDS.has(r.kind))
      .map(r => ({ at: r.at, actor: U.fieldText(r.actor, viewer), text: U.fieldText(r.text, viewer), href: r.href, tone: r.tone }));
    const thisWeek = HOSTS.map(h => ({ h, w: list(stats(d, h).weeks).at(-1)?.work })).filter(r => r.w?.starts);
    return thisWeek.map(({ h, w }) => ({ actor: h.name, text: `这周开工 ${int(w.starts)} 件，干了 ${hours(w.actual_minutes)} 小时`, href: '#work', tone: 'info' }));
  }

  function draw() {
    const d = state?.data;
    viewer = T.viewerOf(state);
    if (!d) {
      // 后台一直回“正在准备”（202）时读数层会一直重问、阶段停在“读得慢”：过了 10 秒照全站读不到的说法写，不一直写“正在读”（M909）。
      // 还在读的头 10 秒，快讯和正文一样说“正在读”，不先说没读到；读不到了两处一起说没读到
      // 后台这一块算失败回 503（服务通着，下一轮重算）也照这句写，不写成“电脑连不上”（M909，live-client 把它算作服务答了话）
      const stuck = state?.warming && state.phase === 'slow' || !state?.offline && state?.meta?.status === 503;
      const reading = !stuck && !state?.offline && ['idle', 'wait', 'slow'].includes(state?.phase) && !(state?.meta?.status >= 400);
      T.paint(page.root, stuck ? '<p class="tp-placeholder" role="status">智能体暂时没读到：后台还在准备这一页的数，准备好了这里会自己换上。</p>' : T.placeholder(state, '智能体'));
      page.tick.set(reading ? [{ text: '正在读这一页的读数…' }] : [], { off: true });
      return;
    }
    // 顶栏已写同一分钟的“读到／最后一份”，大标题区和各卡就不再写同一分钟的“截至”；分钟不一样才写（M746）
    barAt = state.offline ? state.cutoffAt : state.shownAt;
    const headAt = asof(d.at);
    const html = `<div class="tp-head"><div><h1>智能体</h1><p>三家 AI 被管得对不对、估工期准不准、干了多少活，再往下是三家怎么被管：设置和钩子。</p></div>
        <div class="tp-head__side ag-headside">${headAt ? `<span>${esc(headAt)}</span>` : ''}${picker()}</div></div>
      ${T.stateNote(state)}${statusSection(d)}${window.AgentsHours?.html(d, viewer, { only, asof }) || ''}${estimateSection(d)}${workSection(d)}${window.AgentsMoved?.html(d, viewer, { only, chips, asof }) || ''}${configSection(d)}${hooksSection(d)}`;
    T.paint(page.root, html);
    const rows = feed(d), reason = d.work_stats?.unavailable_reason;
    if (reason && !rows.some(row => row.text)) rows.push({ text: WORK_UNAVAILABLE.get(reason) ?? reason });
    page.tick.set(rows, { off: state.offline });
    if (!landed && location.hash === '#hours') {
      const section = document.getElementById('hours');
      // 跨页过渡期间下一帧可能晚于锚点定位。工时区画出来就滚到同一个锚点。
      if (section) {
        section.scrollIntoView({ block: 'start' });
        landed = true;
      }
    } else if (!landed && location.hash) landed = T.reveal(location.hash.slice(1));
  }
  let landed = false;
  const page = T.boot({ resource: 'agents', ask: () => '请看实况智能体页：三家规则、钩子和设置有没有对上，工期估得准不准。先用大白话说，别动手。',
    onState(next) { state = next; draw(); } });
  page.root.addEventListener('click', e => {
    // 看哪一家：data-only 直接选（页顶和“全部”），data-pick 是图例、三家那几行、柱段——点一家只看它，再点一次回到全部
    const set = e.target.closest('[data-only]'), pick = e.target.closest('[data-pick]');
    if (set || pick) {
      const next = set ? (set.dataset.only === 'all' ? null : set.dataset.only) : only === pick.dataset.pick ? null : pick.dataset.pick;
      if (next === only) return;
      const el = set || pick, sec = el.closest('section[id]');
      // 点了哪个按钮，重画后这个按钮停在原处；柱段这类不是按钮的，停住这一块的标题
      const anchor = !sec ? `.tp-head [data-only="${next || 'all'}"]` : el.closest('.ag-mlegend') ? `#${sec.id} .ag-mlegend [data-${set ? 'only' : 'pick'}="${set ? set.dataset.only : pick.dataset.pick}"]` : `#${sec.id} .tp-panel__head`;
      only = next;
      if (only && expanded && expanded.split('/')[1] !== only) expanded = null;   // 别家展开着的钩子格收起来
      T.keep(page.root, anchor, draw);
      return;
    }
    // 搬来的两块（你跟三家说了多少、三家常用的技能）：切换时段、技能展开收起
    const moved = window.AgentsMoved?.click(e.target);
    if (moved) { T.keep(page.root, moved, draw); return; }
    const cell = e.target.closest('[data-cell]'), seg = e.target.closest('[data-tseg]'), more = e.target.closest('[data-models]');
    if (cell) { expanded = expanded === cell.dataset.cell ? null : cell.dataset.cell; T.keep(page.root, `[data-cell="${cell.dataset.cell}"]`, draw); }
    if (more) { const id = more.dataset.models; modelsOpen.has(id) ? modelsOpen.delete(id) : modelsOpen.add(id); T.keep(page.root, `[data-models="${id}"]`, draw); }
    // 工期、工作量、钩子三排时间各切各的，只换这一块的数；点的那个按钮重画后停在原处
    if (seg) {
      const [key, id] = seg.dataset.tseg.split(':');
      if (key === 'est') estPeriod = id; else if (key === 'work') period = id; else hookPeriod = id;
      T.keep(page.root, `[data-tseg="${seg.dataset.tseg}"]`, draw);
    }
  });
})();
