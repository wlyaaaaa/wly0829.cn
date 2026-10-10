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
  return { id: text(r.id), title: text(r.title), text: text(d.text), state: stateOf(d.state), observed_at: d.observed_at, unavailable_since: d.unavailable_since, criteria_text: n.configured === true ? text(n.value) : '', copy_ai_id: text(r.id) };
};
const notice = (r) => {
  const a = obj(r.action);
  return { id: text(r.id), title: text(r.title), project: text(r.project), next_step: text(r.user_action || a.label), done_when: text(a.due_text || r.when), severity: text(r.severity) || 'grey', state: text(r.state), message: text(r.public_message || r.what_happened), at: r.at_beijing, copy_ai_id: text(r.id) };
};
const LABELS = { 'cpu-gpu': 'CPU 和显卡', 'memory-network': '内存和网络' };

export function fromFull(full) {
  const f = obj(full), cp = obj(f.cockpit), groups = obj(cp.detail_groups), counts = obj(cp.detail_counts), overall = obj(cp.overall);
  const collectors = obj(obj(f.display_cache).collectors), host = obj(f.host);
  const tasks = rows(f.automation).map((r) => {
    const p = obj(r.plain), o = obj(r.outcomes), rel = obj(r.related_status);
    return { id: text(r.id), name: text(p.name || r.project), group: text(r.group), state: text(r.state) || 'unknown', enabled: typeof r.enabled === 'boolean' ? r.enabled : null,
      mine: p.mine === true, last_run_at: r.last_run_at, next_run_at: r.next_run_at, runs_today: r.runs_today === true, schedule: text(r.schedule_zh || p.schedule_zh),
      note: text(p.status_note), what: text(p.what), stop: text(p.stop), impact: text(p.impact), heartbeat_at: o.heartbeat_at || r.heartbeat_at || null,
      panel: { is_panel: 'panel' in rel || o.kind === 'panel_heartbeat', execution_failed: o.execution_failed === true, related_state: rel.panel || o.state || null },
      public_message: text(r.public_message), notice_kind: text(r.notice_kind) };
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
    overview: f.overview && typeof f.overview === 'object' ? f.overview : (cp.overview && typeof cp.overview === 'object' ? cp.overview : null),
  };
}

// 认精简视图；拿到全量就先投影
export const asView = (body) => (obj(body).schema === SCHEMA ? body : obj(body).cockpit ? fromFull(body) : body);
