// 驾驶舱数据层：把 PCConfig 精简视图（pcconfig.cockpit-view.v1）整理成页面要的样子。
// 纯函数，构建时（Astro）和浏览器里（client.js）用同一份，保证首帧和之后原地更新长得一样。
export const SCHEMA = 'pcconfig.cockpit-view.v1';

const TZ = 'Asia/Shanghai';
const day = (d) => new Intl.DateTimeFormat('zh-CN', { timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric' }).format(d);
const parse = (v) => { const t = typeof v === 'number' ? v * 1000 : Date.parse(v || ''); return Number.isFinite(t) && t > 0 ? new Date(t) : null; };

// 北京时间 时:分
export function hm(v) {
  const d = parse(v);
  return d ? new Intl.DateTimeFormat('zh-CN', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d) : '';
}

// 今天只写时:分；不是今天的一律写“10月9日 时:分”（不用“昨天”：截图、缓存过了零点就会说错）
export function when(v, now = new Date()) {
  const d = parse(v);
  if (!d) return '';
  return day(d) === day(now) ? hm(d) : dateHm(v);
}

// 离现在多久：“15 分钟前”“28 小时前”“3 天前”（48 小时以内按小时）
export function ago(v, now = new Date()) {
  const d = parse(v);
  if (!d) return '';
  const min = Math.max(0, (now.getTime() - d.getTime()) / 6e4);
  return min < 1 ? '刚刚' : min < 60 ? `${Math.round(min)} 分钟前` : min < 2880 ? `${Math.round(min / 60)} 小时前` : `${Math.floor(min / 1440)} 天前`;
}

// 截止时间一律带日期：“10月12日 13:37”（安全和授权一栏用，北京时间）
export function dateHm(v) {
  const d = parse(v);
  if (!d) return '';
  const [m, dd] = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, month: 'numeric', day: 'numeric' }).formatToParts(d).filter((x) => x.type !== 'literal').map((x) => x.value);
  return `${Number(m)}月${Number(dd)}日 ${hm(d)}`;
}

export const isToday = (v, now = new Date()) => { const d = parse(v); return !!d && day(d) === day(now); };

// 灯色：ok 绿、attention 黄、red 红；neutral 是“有状况但 AI 在管、不用你动手”的中性色；没读到、正在读、正常关着、数据源停了都是灰
export function light(state) {
  return state === 'ok' ? 'green' : state === 'attention' ? 'yellow' : state === 'red' ? 'red' : state === 'neutral' ? 'neutral' : 'gray';
}

// 待办标题末尾的“最后核对：2026-10-10 20:11（北京时间）。”拆出来单独小字显示
export function splitChecked(title) {
  const t = String(title || '').trim();
  const m = t.match(/\s*(最后核对：\s*([0-9-]+\s+[0-9:]+)（北京时间）。?|尚未核对。?)\s*$/);
  if (!m) return { title: t, checked: '' };
  return { title: t.slice(0, m.index).replace(/[。，；\s]+$/, ''), checked: m[2] ? '最后核对 ' + m[2].replace(/^\d{4}-0?(\d+)-0?(\d+)/, '$1月$2日') : '尚未核对' };
}

const list = (v) => (Array.isArray(v) ? v.filter((x) => x && typeof x === 'object') : []);
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
const STATES = new Set(['ok', 'attention', 'red', 'unavailable', 'reading']);
const st = (v) => (STATES.has(v) ? v : 'unavailable');

// 缺什么都补成空，版式只看结构，不看数据到没到
export function normalize(raw) {
  const v = obj(raw);
  const sections = obj(v.sections);
  const auto = obj(v.automation), projects = obj(v.projects), today = obj(v.today), grafana = obj(v.grafana), sec = obj(v.security);
  return {
    ok: v.schema === SCHEMA,
    served_at: v.served_at || null,
    collected_at: v.collected_at || null,
    collectors: obj(v.collectors),
    verdict: { severity: obj(v.verdict).severity || 'gray', state: st(obj(v.verdict).state), observed_at: obj(v.verdict).observed_at || null },
    counts: { need_you: 0, ai_following: 0, deferred: 0, history: 0, tasks_failed_today: 0, backup_problems: 0, ...obj(v.counts) },
    need_you: list(v.need_you), ai_following: list(v.ai_following), deferred: list(v.deferred),
    history_counts: obj(v.history_counts),
    security: {
      personal_data: obj(sec.personal_data), unrestricted: obj(sec.unrestricted), windows: obj(sec.windows), computer: obj(sec.computer),
      observed_at: sec.observed_at || null, state: st(sec.state),
    },
    automation: { state: st(auto.state), observed_at: auto.observed_at || null, groups: list(auto.groups), items: list(auto.items) },
    sections: { computer: list(sections.computer), remote: list(sections.remote), backup_cloud: list(sections.backup_cloud), today: list(sections.today) },
    today: { state: st(today.state), observed_at: today.observed_at || null, items: list(today.items) },
    grafana: { state: st(grafana.state), checked_at: grafana.checked_at || null, links: list(grafana.links).filter((x) => /^https:\/\//.test(x.url || '')),
      // 后台根地址：接口的 grafana.url；精简视图没带时取公开图表链接的同一个站点
      url: /^https:\/\//.test(grafana.url || '') ? grafana.url : (() => { try { return new URL(list(grafana.links).find((x) => /^https:\/\//.test(x.url || ''))?.url).origin + '/'; } catch { return null; } })() },
    projects: { state: st(projects.state), observed_at: projects.observed_at || null, items: list(projects.items) },
    source_gaps: list(v.source_gaps),
    owner_corrections: obj(v.owner_corrections),
    // AI 现在在替你做什么（每个项目在跑的自动任务、留下没合并的分支）和每周体检的下次时间；没给就是空
    ai_work: { state: st(obj(v.ai_work).state), observed_at: obj(v.ai_work).observed_at || null, items: list(obj(v.ai_work).items) }, governance: obj(v.governance),
    // 电脑后台今天做的事、今天的用电和开机（PCConfig 给；读不到时块照样在）
    today_activity: (() => { const a = obj(v.today_activity); return { state: st(a.state), observed_at: a.observed_at || null, summary: obj(a.summary), timeline: list(a.timeline), errors: list(a.errors), yesterday: a.yesterday && typeof a.yesterday === 'object' ? a.yesterday : null }; })(),
    // 电脑健康的原因（hardware.health.pc_health）和副机在不在线（remote_network）：精简视图暂时没带，没有就不显示这两句
    pc_health: obj(v.pc_health), laptop: obj(v.laptop),
    power_today: (() => { const p = obj(v.power_today); return { state: st(p.state), observed_at: p.observed_at || null, uptime_hours: Number.isFinite(p.uptime_hours) ? p.uptime_hours : null, energy_kwh: Number.isFinite(p.energy_kwh) ? p.energy_kwh : null, peak_watts: Number.isFinite(p.peak_watts) ? p.peak_watts : null, source: typeof p.source === 'string' ? p.source : '', source_note: typeof p.source_note === 'string' ? p.source_note : '', yesterday: p.yesterday && typeof p.yesterday === 'object' ? p.yesterday : null }; })(),
    // 今天代码变化（大数字 + 近 7 天）；字段由 PCConfig 精简视图 changes 给
    changes: (() => { const c = obj(v.changes), t = obj(c.today); return { state: st(c.state), observed_at: c.observed_at || null,
      today: { commits: Number.isFinite(t.commits) ? t.commits : null, repos_changed: Number.isFinite(t.repos_changed) ? t.repos_changed : null, latest_at: t.latest_at || null },
      window_days: c.window_days || 7, commits_7d: Number.isFinite(c.commits_7d) ? c.commits_7d : null,
      daily: list(c.daily), projects_7d: list(c.projects_7d) }; })(),
    // 健康分、扣分原因、6 个信号、各分区的灯都由后端 overview 给（O6 裁定），前端不算
    overview: v.overview && typeof v.overview === 'object' ? v.overview : null,
    // 下面两块是后端 10 月 12 日加的；字段不在就是 null，页面不出这一块，照旧数据显示
    // “你得知道”（must_know）：{state: ok|empty|unavailable, text, items[{id, kind: repairing|recovered|report, text, at, exit_when}], archived_items}
    must_know: (() => { const m = v.must_know; if (!m || typeof m !== 'object') return null; return { state: ['ok', 'empty', 'unavailable'].includes(m.state) ? m.state : 'unavailable', text: typeof m.text === 'string' ? m.text : '', observed_at: m.observed_at || null, items: list(m.items), archived: list(m.archived_items) }; })(),
    // 网站上次成功发布的回执（website_release）：{state: success|unavailable, published_at, version, verified, text}；只证明上次成功那次
    website_release: v.website_release && typeof v.website_release === 'object' ? v.website_release : null,
  };
}

// 同一事实只出一次（例如备份卡和来源缺口卡写的是同一句）
export function dedupeCards(cards) {
  const seen = new Set();
  return cards.filter((c) => { const k = (c.text || '').trim() || c.id; if (seen.has(k)) return false; seen.add(k); return true; });
}

// 每周体检这一轮到哪一步了，用人话说：跑完了（有结果数）/ 几点开始、正在跑 / 这周还没开始。
// 后端 governance.last_run（有 counts 才算跑完）和 run_state / started_at / ended_at 有就用；没有就看自动任务清单里体检那一行的状态和上次运行时间。
// 只说查得到的：“这周已跑过”只能证明开始过，不当成跑完。
export function govState(v, now = new Date()) {
  const g = obj(v.governance), r = obj(g.last_run), c = obj(r.counts);
  const task = v.automation.items.find((t) => t.id && t.id === g.id) || null;
  const next = g.next_run_at || r.next_run_at || null;
  // 后端给了 phase（not_started / running / completed / unavailable）就按它；跑完的结果句用后端 status_note（“跑完：修好N、关掉N……”）
  if (['not_started', 'running', 'completed', 'unavailable'].includes(g.phase)) {
    const need = Number.isInteger(c.need_you) ? c.need_you : 0;
    if (g.phase === 'completed') return { state: 'done', text: (typeof g.status_note === 'string' && g.status_note ? g.status_note : '跑完了，数量没记录') + (r.ended_at ? `（${dateHm(r.ended_at)}）` : ''), next, need };
    if (g.phase === 'running') return { state: 'running', text: `${r.started_at || (task && task.last_run_at) ? dateHm(r.started_at || task.last_run_at) + ' 开始，' : ''}正在跑（还没收到跑完的回执）`, next, need: 0 };
    if (g.phase === 'not_started') return { state: 'idle', text: '这周还没开始', next, need: 0 };
    return { state: 'failed', text: '这周的体检情况读不到', next, need: 0 };
  }
  const n = (x) => (Number.isInteger(x) && x >= 0 ? x : null);
  const nums = [['修好', c.fixed], ['关掉', c.closed], ['还在跟', c.following], ['要你', c.need_you]].filter(([, x]) => n(x) != null);
  const ended = r.ended_at || g.ended_at || null, started = r.started_at || g.started_at || (task && task.last_run_at) || null;
  const weekAgo = now.getTime() - 7 * 864e5, recent = (x) => { const d = parse(x); return !!d && d.getTime() > weekAgo; };
  if (nums.length && (recent(ended) || recent(started))) return { state: 'done', text: `跑完了${ended ? `（${dateHm(ended)}）` : ''}：${nums.map(([k, x]) => `${k} ${x}`).join('、')} 件`, next, need: n(c.need_you) || 0 };
  const failed = g.run_state === 'failed' || (task && task.state === 'failed' && recent(started));
  if (failed) return { state: 'failed', text: `${started ? dateHm(started) + ' 开始的那一轮' : '这一轮'}没跑成${g.run_reason ? '：' + g.run_reason : ''}`, next, need: 0 };
  const running = g.run_state === 'running' || (task && task.state === 'running') || (recent(started) && g.last_run_ok == null && !nums.length);
  if (running && started) return { state: 'running', text: `${dateHm(started)} 开始，正在跑（还没收到跑完的回执）`, next, need: 0 };
  if (!task && !g.id) return null;
  return { state: 'idle', text: '这周还没开始', next, need: 0 };
}

// 给“今天的河”（scripts/today-river.js，代码不动）还原它原来读的任务形状
export function riverSnapshot(v, now = new Date()) {
  const a = v.automation;
  const gov = govState(v, now), govId = obj(v.governance).id;
  const items = a.items.map((t) => {
    const p = obj(t.panel);
    // 体检那一行不再写“这周已跑过”：换成查得到的那一步
    if (gov && govId && t.id === govId && /这周已跑过/.test(t.note || '')) t = { ...t, note: gov.text };
    const raw = {
      id: t.id, group: t.group, state: t.state, enabled: t.enabled, last_run_at: t.last_run_at, next_run_at: t.next_run_at,
      runs_today: t.runs_today, schedule_zh: t.schedule || '', heartbeat_at: t.heartbeat_at || null, failures_7d: Number.isFinite(t.failures_7d) ? t.failures_7d : undefined,
      public_message: t.public_message || undefined, notice_kind: t.notice_kind || undefined,
      // 后端的显示颜色（neutral = 有状况但 AI 在管）和 AI 在管什么；河据此升中性旗，不升红黄旗
      color: t.color || undefined, ai_handling: t.ai_handling || undefined,
      plain: { name: t.name, what: t.what || '', stop: t.stop || '', impact: t.impact || '', status_note: t.note || '', mine: t.mine === true },
    };
    if (p.is_panel) raw.outcomes = { kind: 'panel_heartbeat', execution_failed: p.execution_failed === true, state: p.related_state || null, heartbeat_at: t.heartbeat_at || null };
    return raw;
  });
  const state = a.state === 'reading' ? 'unknown' : a.state === 'unavailable' && !items.length ? 'unavailable' : 'ok';
  // today_errors：今天出过错的任务，和总览“今天的任务 N 个出错”同一份清单（today_activity.errors）
  return { captured_at: v.served_at, automation: { state, observed_at: a.observed_at, groups: a.groups, items }, today_errors: v.today_activity.errors };
}

// 精简视图里看“点刷新之后新数据到了没有”：三个采集器都在点击之后完成过一次
export function freshAfter(v, clickedAt) {
  const c = v.collectors;
  return ['authorization', 'hardware', 'dashboard'].every((k) => { const d = parse(obj(c[k]).refresh_completed_at); return !!d && d.getTime() >= clickedAt; });
}
