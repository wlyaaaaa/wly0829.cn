// 过渡用：边缘函数还没转发 ?view=cockpit 时，接口回的是全量（约 711 KB）。
// 这里照 PCConfig 的 public_cockpit_view.py（分支 task/o2-cockpit-backend-20261011，ad162ef0）在浏览器里投影成同一份精简视图，
// 页面照样显示、不变样。边缘函数上线、线上都回精简视图后，这个文件和 client.js 里的一行调用一起删掉。
import { SCHEMA } from './model.js';

const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
const rows = (b) => (Array.isArray(obj(b).items) ? b.items.filter((r) => r && typeof r === 'object') : []);
const text = (v) => (typeof v === 'string' ? v : '');
const iso = (u) => (typeof u === 'number' && u > 0 ? new Date(u * 1000).toISOString() : null);
function stateOf(v) {
  v = String(v || '').toLowerCase();
  if (['ok', 'success', 'green', 'reachable', 'in_sync', 'empty', 'ready'].includes(v)) return 'ok';
  if (['attention', 'warn', 'yellow', 'partial', 'overdue'].includes(v)) return 'attention';
  if (['red', 'failed', 'error', 'run_failed', 'acceptance_failed'].includes(v)) return 'red';
  if (['reading', 'refreshing'].includes(v)) return 'reading';
  return 'unavailable';
}
const blockState = (b) => (!b || typeof b !== 'object' ? 'unavailable' : b.collection_state === 'reading' && !b.observed_at ? 'reading' : stateOf(b.state));
const grant = (v) => ({ state: text(obj(v).state) || 'unknown', expires_at: ['unlocked', 'active'].includes(obj(v).state) ? iso(obj(v).expires_at_unix) : null });
const card = (r) => {
  const d = obj(r.display), n = obj(r.normal);
  return { id: text(r.id), title: text(r.title), text: text(d.text), state: stateOf(d.state), observed_at: d.observed_at, unavailable_since: d.unavailable_since, criteria_text: n.configured === true ? text(n.value) : '', copy_ai_id: text(r.id),
    ...Object.fromEntries(COLOR_KEYS.filter((k) => d[k] != null).map((k) => [k, d[k]])), ...(r.must_know_id || d.must_know_id ? { must_know_id: text(r.must_know_id || d.must_know_id) } : {}) };
};
const notice = (r) => {
  const a = obj(r.action);
  return { id: text(r.id), title: text(r.title), project: text(r.project), next_step: text(r.user_action || a.label), done_when: text(r.done_when) || text(a.due_text || r.when), severity: text(r.severity) || 'grey', state: text(r.state), message: text(r.public_message || r.what_happened), at: r.at_beijing, copy_ai_id: text(r.id),
    // 首屏和“需要你”卡片要的字段：后端有就带上（P2 的按需问字段还没上线时都是空，页面按旧字段显示）
    action_owner: text(r.action_owner), last_checked_at: r.last_checked_at || obj(r.ai_hint).last_checked_at || null, due_at: a.due_at || null,
    where: r.where || a.where || null, minutes: r.minutes ?? a.estimated_minutes ?? null, consequence: r.consequence || a.consequence || null,
    ...Object.fromEntries(PASS.filter((k) => r[k] != null).map((k) => [k, r[k]])) };
};
// 后端 10 月 12 日加的显示颜色和责任字段（color 只取 ok/neutral/unavailable/yellow/red），有就原样带上
const COLOR_KEYS = ['color', 'owner_action', 'owner_action_needed', 'ai_handling', 'trigger_items', 'source_over_limit'];
const PASS = ['report_title', 'color', 'owner_action', 'owner_action_needed', 'ai_handling', 'ask_kind', 'why_you', 'steps', 'options', 'questions', 'handler', 'asked_count', 'urgent', 'headline', 'stuck', 'stuck_reason', 'done_when_text', 'reason', 'deferred_reason'];
const LABELS = { 'cpu-gpu': 'CPU 和显卡', 'memory-network': '内存和网络' };

export function fromFull(full) {
  const f = obj(full), cp = obj(f.cockpit), groups = obj(cp.detail_groups), counts = obj(cp.detail_counts), overall = obj(cp.overall);
  const collectors = obj(obj(f.display_cache).collectors), host = obj(f.host);
  const tasks = rows(f.automation).map((r) => {
    const p = obj(r.plain), o = obj(r.outcomes), rel = obj(r.related_status);
    return { id: text(r.id), name: text(p.name || r.project), group: text(r.group), state: text(r.state) || 'unknown', enabled: typeof r.enabled === 'boolean' ? r.enabled : null,
      mine: p.mine === true, last_run_at: r.last_run_at, next_run_at: r.next_run_at, runs_today: r.runs_today === true, schedule: text(r.schedule_zh || p.schedule_zh),
      note: text(p.status_note), what: text(p.what), stop: text(p.stop), impact: text(p.impact), heartbeat_at: o.heartbeat_at || r.heartbeat_at || null, failures_7d: Number.isFinite(r.failures_7d) ? r.failures_7d : null,
      panel: { is_panel: 'panel' in rel || o.kind === 'panel_heartbeat', execution_failed: o.execution_failed === true, related_state: rel.panel || o.state || null },
      public_message: text(r.public_message), notice_kind: text(r.notice_kind), ...(r.color ? { color: text(r.color), ai_handling: text(r.ai_handling) } : {}) };
  });
  const sections = { computer: [], remote: [], backup_cloud: [], today: [] };
  for (const r of Array.isArray(cp.cards) ? cp.cards : []) if (r && typeof r === 'object') (sections[text(r.section) || 'other'] ||= []).push(card(r));
  const g = obj(f.grafana);
  const links = Object.entries(obj(g.groups)).filter(([k, v]) => LABELS[k] && obj(v).state === 'reachable' && v.url).map(([k, v]) => ({ id: k, label: LABELS[k], url: v.url }));
  const backups = rows(f.backups);
  const screen = typeof host.screen_state === 'object' ? obj(host.screen_state).value : host.screen_state;
  return {
    schema: SCHEMA, display_only: true, status: text(f.status) || 'partial', served_at: iso(f.served_at_unix), collected_at: iso(f.collected_at_unix),
    collectors: Object.fromEntries(Object.entries(collectors).map(([k, v]) => [k, { state: text(obj(v).state), observed_at: iso(obj(v).observed_at_unix), refresh_completed_at: iso(obj(v).refresh_completed_at_unix) }])),
    verdict: { severity: text(overall.severity) || 'gray', state: stateOf(overall.state), text: text(obj(cp.summary).text), observed_at: cp.observed_at },
    counts: { need_you: counts.need_you || 0, ai_following: counts.ai_following || 0, deferred: counts.deferred || 0, history: counts.history || 0,
      backup_problems: backups.filter((r) => r.enabled !== false && ['failed', 'stale', 'warn'].includes(r.state)).length },
    need_you: (groups.need_you || []).map(notice), ai_following: (groups.ai_following || []).map(notice), deferred: (groups.deferred || []).map(notice),
    history_counts: obj(cp.history_counts),
    security: { personal_data: grant(f.personal_data), unrestricted: grant(f.unrestricted), windows: { state: text(screen) || 'unknown' },
      computer: { online: true, uptime_hours: typeof host.uptime_seconds === 'number' ? Math.round(host.uptime_seconds / 360) / 10 : null },
      observed_at: iso(f.observed_at_unix), state: stateOf(obj(collectors.authorization).state) },
    automation: { state: blockState(f.automation), observed_at: obj(f.automation).observed_at, groups: (obj(f.automation).groups || []).filter((x) => x && typeof x === 'object'), items: tasks },
    sections,
    today: { state: blockState(f.today), observed_at: obj(f.today).observed_at, items: rows(f.today).map(({ id, type, at, task_id, count, passed }) => ({ id, type, at, task_id, count, passed })) },
    grafana: { state: links.length ? 'ok' : 'unavailable', checked_at: g.checked_at, url: typeof g.url === 'string' ? g.url : null, links },
    projects: { state: blockState(f.projects), observed_at: obj(f.projects).observed_at, items: rows(f.projects).map((r) => ({ id: text(r.id), name: text(r.project), mode: text(r.mode), phase: r.phase, run_health: r.run_health, overview: r.overview, waiting_user: r.waiting_user_count, waiting_ai: r.waiting_ai_count, on_hold: r.on_hold_count, health_reason: text(r.health_reason), last_commit_at: r.last_commit_at, commits_7d: r.commits_7d })) },
    source_gaps: (Array.isArray(cp.source_gaps) ? cp.source_gaps : []).map((r) => ({ source_id: text(r.source_id), title: text(r.title), since: r.since, observed_at: r.observed_at })),
    owner_corrections: obj(cp.owner_corrections),
    ...(f.must_know ? { must_know: f.must_know } : {}), ...(f.website_release ? { website_release: f.website_release } : {}),
    ai_work: obj(f.ai_work), governance: obj(cp.governance),
    today_activity: obj(f.today_activity), power_today: obj(f.power_today),
    pc_health: (({ state, reason_code, metrics, changes_24h, observed_at_unix }) => ({ state, reason_code, metrics, changes_24h, observed_at: iso(observed_at_unix) }))(obj(obj(obj(f.hardware).health).pc_health)),
    laptop: obj(rows(f.remote_network).find((r) => r.id === 'secondary_laptop')),
    changes: (() => { const c = obj(f.changes), t = obj(c.today), w = rows(f.weekly);
      return { state: stateOf(c.state), observed_at: c.observed_at, today: { commits: t.commits, repos_changed: t.repos_changed, latest_at: t.latest_at },
        window_days: c.window_days || 7, commits_7d: c.commits, repos_changed_7d: c.repos_changed, daily: Array.isArray(c.daily) ? c.daily : [],
        projects_7d: w.filter((x) => Number.isFinite(x.commits_7d)).sort((a, b) => b.commits_7d - a.commits_7d).slice(0, 5).map((x) => ({ project: x.project, commits_7d: x.commits_7d, last_commit_at: x.last_commit_at })) }; })(),
    overview: f.overview && typeof f.overview === 'object' ? f.overview : (cp.overview && typeof cp.overview === 'object' ? cp.overview : null),
  };
}

// 认精简视图；拿到全量就先投影
export const asView = (body) => (obj(body).schema === SCHEMA ? body : obj(body).cockpit ? fromFull(body) : body);
