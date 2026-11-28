// 自动任务的“一轮”在别的页怎么写、链到哪：类别的中文名、谁做的、几点那一轮、去自动任务页的网址。
// 首页三张卡、等你的事、账本一件事、AI 对话页都从这里拿；自动任务页的筛选参数和一轮详情的网址定稿后只改这里。
(() => {
  'use strict';
  const CATEGORY = {
    'auto-repair': '自动修理', 'message-review': '替你看新消息', translator: '翻译官', 'weekly-rules': '每周规矩复核',
    'weekly-laptop': '笔记本每周巡检', 'weekly-live': '实况每周对一遍', excerpt: '摘一句', 'ai-commitments': 'AI 约好的事',
  };
  const HOST = { claude: 'Claude', codex: 'Codex', antigravity: 'Antigravity' };
  const PAGE = '/live/automation/';
  const bj = (at, options) => new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', ...options }).format(new Date(at));
  const timed = at => typeof at === 'string' && Number.isFinite(Date.parse(at));
  const dayKey = at => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date(at));
  const clock = at => bj(at, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const monthDay = at => bj(at, { month: '2-digit', day: '2-digit' }).replace('/', '-');
  const messageReviewName = viewer => viewer === 'public' ? '替本人看新消息' : CATEGORY['message-review'];

  // 类别名：访客版把“你”换成“本人”，和别处一样。
  function categoryName(key, viewer) {
    if (key === 'message-review') return messageReviewName(viewer);
    const name = CATEGORY[key] || '';
    return viewer === 'public' ? name.replace('替你', '替本人') : name;
  }
  // 谁做的：“Claude Opus 5.5 medium”“GPT-6.2 Sol xhigh”；程序自己办的只写“程序”，不补型号。
  function worker(w) {
    if (!w || typeof w !== 'object') return '';
    if (w.kind === 'program') return '程序';
    const host = HOST[w.host] || '';
    let model = typeof w.model === 'string' ? w.model.trim() : '';
    if (model && host === 'Claude' && !/^claude\b/i.test(model)) model = `Claude ${model}`;
    return [model || host, typeof w.effort === 'string' && w.effort.trim()].filter(Boolean).join(' ');
  }
  // 一轮的地址一律写成一轮的详情页 /live/automation/run/?type=<类>&run=<轮号>。后台给的站内地址照用；
  // 它给的是旧写法 /live/automation/?type=…&run=…（自动任务页进来也会转过去）就改写成详情页，少转一次；没给照类别和轮号拼。
  const RUN_PAGE = `${PAGE}run/`;
  function runPage(href) {
    if (typeof href !== 'string' || !href.startsWith(`${PAGE}?`)) return href;
    const url = new URL(href, location.origin);
    return url.searchParams.has('run') ? RUN_PAGE + url.search + url.hash : href;
  }
  function runHref(run) {
    if (typeof run?.href === 'string' && run.href.startsWith('/live/')) return runPage(run.href);
    return run?.category && run?.run_id ? `${RUN_PAGE}?type=${encodeURIComponent(run.category)}&run=${encodeURIComponent(run.run_id)}` : '';
  }
  // 自动任务页只看某一类、某一天、某一家或在跑的：?category= &date=today|YYYY-MM-DD &family=claude|codex|antigravity &status=running|completed|incomplete（照自动任务页）。
  function listHref({ category, date, family, status } = {}) {
    const q = new URLSearchParams();
    for (const [key, value] of Object.entries({ category, date, family, status })) if (value) q.set(key, value);
    const s = q.toString();
    return PAGE + (s ? `?${s}` : '');
  }
  // “11-23 22:30”；和 now 同一天写“今天 22:30”，前一天写“昨天”，晚上 6 点以后写“昨晚”。
  function when(at, now, { relative = false } = {}) {
    if (!timed(at)) return '';
    if (!relative) return `${monthDay(at)} ${clock(at)}`;
    const ref = timed(now) ? now : new Date().toISOString();
    const today = dayKey(ref), yesterday = dayKey(new Date(Date.parse(ref) - 86400000).toISOString()), day = dayKey(at);
    const hour = Number(clock(at).slice(0, 2));
    const prefix = day === today ? '今天' : day === yesterday ? (hour >= 18 ? '昨晚' : '昨天') : monthDay(at);
    return `${prefix} ${clock(at)}`;
  }
  // “今天 11 月 24 日”：给北京时间的一个时刻（今天 0 点或现在）。
  function todayLabel(at) {
    const ref = timed(at) ? at : new Date().toISOString();
    const [m, d] = bj(ref, { month: 'numeric', day: 'numeric' }).match(/\d+/g) || [];
    return m && d ? `今天 ${m} 月 ${d} 日` : '今天';
  }
  // 一轮的名字：“自动修理第 2 轮”；没有轮次就是类别名。
  function runName(run, viewer) {
    const fallback = typeof run?.category_name === 'string' ? run.category_name : '';
    const name = categoryName(run?.category, viewer) || (fallback === CATEGORY['message-review'] ? messageReviewName(viewer) : fallback);
    return Number.isInteger(run?.round) && run.round > 0 ? `${name}第 ${run.round} 轮` : name;
  }
  // 事项（等你的事、账本一件）上的“来源”：后台 automation_runs[] 里写明的那几轮，原样照列，不按标题或时间去猜。
  // 每条给 { label: “替你看新消息 · 11-23 22:30 那一轮”, href, action: “新建了／更新了”, who: 谁做的 }。
  function sources(record, viewer) {
    const runs = Array.isArray(record?.automation_runs) ? record.automation_runs : [];
    return runs.filter(run => run && (run.category || run.category_name) && (run.run_id || run.href))
      .map(run => {
        const at = [run.started_at, run.queued_at, run.at].find(timed);
        const name = runName(run, viewer);
        return {
          at: run.at, name, href: runHref(run), who: worker(run.worker),
          label: [name, at && `${when(at)} 那一轮`].filter(Boolean).join(' · '),
          action: typeof run.action_text === 'string' ? run.action_text : { created: '新建了', updated: '更新了' }[run.action] || '',
        };
      })
      .sort((a, b) => Date.parse(a.at || 0) - Date.parse(b.at || 0));
  }
  // 给一轮的详情页、自动任务页用的“从哪进来就回哪”：上一页是认得的实况页，就把返回改成回那一页（回实况首页落回那张卡，
  // 上一条历史正好是那页时直接后退、回到离开时的位置）；认不得的不动，照页面原来写的返回。
  const FROM = { '/live/': '实况', '/live/items/': '等你的事', '/live/item/': '这件事', '/live/ledger/': 'AI 自动任务账本', '/live/issue/': '账本这件',
    '/live/chats/': 'AI 对话', '/live/chat/': '这场对话', '/live/agents/': '智能体' };
  // 单场对话（/live/chat/?id=…）点“来源：…那一轮 ›”进来的，返回回那场对话，网址原样带 id（验收 11-24 07:36）
  function backToReferrer(link, { card = '#automation' } = {}) {
    let url;
    try { url = new URL(document.referrer); } catch { return false; }
    if (!link || url.origin !== location.origin || !Object.hasOwn(FROM, url.pathname)) return false;
    link.href = url.pathname + url.search + (url.pathname === '/live/' ? card : url.hash);
    link.textContent = FROM[url.pathname];
    if (window.LiveUI?.restoreBack) link.addEventListener('click', window.LiveUI.restoreBack);
    return true;
  }
  window.LiveRuns = { CATEGORY, categoryName, worker, runHref, runPage, listHref, when, todayLabel, runName, sources, timed, backToReferrer };
})();
