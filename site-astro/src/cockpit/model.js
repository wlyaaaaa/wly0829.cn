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

// 今天只写时:分；昨天写“昨天 时:分”；更早写“10月9日 时:分”
export function when(v, now = new Date()) {
  const d = parse(v);
  if (!d) return '';
  if (day(d) === day(now)) return hm(d);
  if (day(d) === day(new Date(now.getTime() - 864e5))) return '昨天 ' + hm(d);
  const [m, dd] = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, month: 'numeric', day: 'numeric' }).formatToParts(d).filter((x) => x.type !== 'literal').map((x) => x.value);
  return `${Number(m)}月${Number(dd)}日 ${hm(d)}`;
}

// 截止时间一律带日期：“10月12日 13:37”（安全和授权一栏用，北京时间）
export function dateHm(v) {
  const d = parse(v);
  if (!d) return '';
  const [m, dd] = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, month: 'numeric', day: 'numeric' }).formatToParts(d).filter((x) => x.type !== 'literal').map((x) => x.value);
  return `${Number(m)}月${Number(dd)}日 ${hm(d)}`;
}

export const isToday = (v, now = new Date()) => { const d = parse(v); return !!d && day(d) === day(now); };

// 灯色：ok 绿、attention 黄、red 红；没读到、正在读、正常关着都是灰
export function light(state) {
  return state === 'ok' ? 'green' : state === 'attention' ? 'yellow' : state === 'red' ? 'red' : 'gray';
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
    today_activity: (() => { const a = obj(v.today_activity); return { state: st(a.state), observed_at: a.observed_at || null, summary: obj(a.summary), timeline: list(a.timeline), yesterday: a.yesterday && typeof a.yesterday === 'object' ? a.yesterday : null }; })(),
    power_today: (() => { const p = obj(v.power_today); return { state: st(p.state), observed_at: p.observed_at || null, uptime_hours: Number.isFinite(p.uptime_hours) ? p.uptime_hours : null, energy_kwh: Number.isFinite(p.energy_kwh) ? p.energy_kwh : null, peak_watts: Number.isFinite(p.peak_watts) ? p.peak_watts : null, source: typeof p.source === 'string' ? p.source : '', source_note: typeof p.source_note === 'string' ? p.source_note : '', yesterday: p.yesterday && typeof p.yesterday === 'object' ? p.yesterday : null }; })(),
    // 今天代码变化（大数字 + 近 7 天）；字段由 PCConfig 精简视图 changes 给
    changes: (() => { const c = obj(v.changes), t = obj(c.today); return { state: st(c.state), observed_at: c.observed_at || null,
      today: { commits: Number.isFinite(t.commits) ? t.commits : null, repos_changed: Number.isFinite(t.repos_changed) ? t.repos_changed : null, latest_at: t.latest_at || null },
      window_days: c.window_days || 7, commits_7d: Number.isFinite(c.commits_7d) ? c.commits_7d : null,
      daily: list(c.daily), projects_7d: list(c.projects_7d) }; })(),
    // 健康分、扣分原因、6 个信号、各分区的灯都由后端 overview 给（O6 裁定），前端不算
    overview: v.overview && typeof v.overview === 'object' ? v.overview : null,
  };
}

// 同一事实只出一次（例如备份卡和来源缺口卡写的是同一句）
export function dedupeCards(cards) {
  const seen = new Set();
  return cards.filter((c) => { const k = (c.text || '').trim() || c.id; if (seen.has(k)) return false; seen.add(k); return true; });
}

// 给“今天的河”（scripts/today-river.js，代码不动）还原它原来读的任务形状
export function riverSnapshot(v) {
  const a = v.automation;
  const items = a.items.map((t) => {
    const p = obj(t.panel);
    const raw = {
      id: t.id, group: t.group, state: t.state, enabled: t.enabled, last_run_at: t.last_run_at, next_run_at: t.next_run_at,
      runs_today: t.runs_today, schedule_zh: t.schedule || '', heartbeat_at: t.heartbeat_at || null,
      public_message: t.public_message || undefined, notice_kind: t.notice_kind || undefined,
      plain: { name: t.name, what: t.what || '', stop: t.stop || '', impact: t.impact || '', status_note: t.note || '', mine: t.mine === true },
    };
    if (p.is_panel) raw.outcomes = { kind: 'panel_heartbeat', execution_failed: p.execution_failed === true, state: p.related_state || null, heartbeat_at: t.heartbeat_at || null };
    return raw;
  });
  const state = a.state === 'reading' ? 'unknown' : a.state === 'unavailable' && !items.length ? 'unavailable' : 'ok';
  return { captured_at: v.served_at, automation: { state, observed_at: a.observed_at, groups: a.groups, items } };
}

// 精简视图里看“点刷新之后新数据到了没有”：三个采集器都在点击之后完成过一次
export function freshAfter(v, clickedAt) {
  const c = v.collectors;
  return ['authorization', 'hardware', 'dashboard'].every((k) => { const d = parse(obj(c[k]).refresh_completed_at); return !!d && d.getTime() >= clickedAt; });
}
