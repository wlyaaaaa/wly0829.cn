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

// “AI 正在跑”（后端 cockpit.ai_running）：每件此刻在跑的 AI 活一行。认不得的状态一律当“判断不了”；
// queued 在排队、waiting_confirm 等你确认、waiting_data 等你解锁个人资料都算还在办；failed 中途断了和 stopped 一样不算在干活
export const RUN_STATUSES = ['running', 'network_retry', 'quota_exhausted', 'login_failed', 'waiting_owner', 'queued', 'waiting_confirm', 'waiting_data', 'stopped', 'failed', 'unknown'];
// 卡住（合同 C:23，和后端 public_dashboard_ai_running 同一口径）：额度用完、登录失效、网络在重连；
// 调度来源（source_kind=cockpit_dispatch）的自动网络重连不算卡住，等登录（blocked_on_login）、叫停没停下（stop_pending）算。
// 行上有后端算好的 stuck 就用它；件数以后端 stuck_count 为准，render.js 也只读这里的 r.stuck
export const RUN_STUCK = ['network_retry', 'quota_exhausted', 'login_failed'];
export const rowStuck = (r) => (typeof r.stuck === 'boolean' ? r.stuck
  : (RUN_STUCK.includes(r.status) && !(r.source_kind === 'cockpit_dispatch' && r.status === 'network_retry')) || r.blocked_on_login === true || r.stop_pending === true);
const text = (x, max = 200) => (typeof x === 'string' ? x.trim().slice(0, max) : '');
const nat = (x) => (Number.isInteger(x) && x >= 0 ? x : null);
// 本人设备上条目带的按钮和状态（后端 owner_actions、item_version、handed_to_ai、verifying、seen_at）；其他列表的行原样透传，这里给重新拼过的行用
const OWNER_FIELDS = ['owner_actions', 'item_version', 'handed_to_ai', 'verifying', 'seen_at'];
const ownerFields = (r) => Object.fromEntries(OWNER_FIELDS.filter((k) => r[k] !== undefined && r[k] !== null).map((k) => [k, r[k]]));
const progressOf = (r) => {
  const p = r.progress;
  if (typeof p === 'string') return text(p) ? { text: text(p, 160), at: r.progress_at || null } : null;
  if (!p || typeof p !== 'object' || Array.isArray(p)) return null;
  const t = text(p.text ?? p.summary, 160);
  return t ? { text: t, at: p.at || p.observed_at || p.updated_at || null } : null;
};
// 它最近一条回复的第一句（后端 latest_reply = {text, at, time_source}；time_source 是 file_mtime 时那个时间是文件修改时间，只是大约；也收字符串 + latest_reply_at）
const replyOf = (r) => {
  const p = r.latest_reply;
  if (typeof p === 'string') return text(p) ? { text: text(p, 160), at: r.latest_reply_at || null, approx: false } : null;
  if (!p || typeof p !== 'object' || Array.isArray(p)) return null;
  const t = text(p.text ?? p.summary, 160);
  return t ? { text: t, at: p.at || p.replied_at || p.observed_at || null, approx: p.time_source === 'file_mtime' } : null;
};
function aiRunning(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const convert = (items) => list(items).map((r) => ({
    id: text(r.id, 120), status: RUN_STATUSES.includes(r.status) ? r.status : 'unknown', status_text: text(r.status_text, 20), stuck: rowStuck(r),
    vendor: ['claude', 'gpt'].includes(r.vendor) ? r.vendor : '', model: text(r.model, 60), model_text: text(r.model_text, 40), effort: text(r.effort, 20), kind: text(r.kind, 40),
    title: text(r.title, 120), started_at: r.started_at || null, last_activity_at: r.last_activity_at || null, detail: text(r.detail, 300), helpers: nat(r.helpers) || 0,
    // 本人版才有：它现在在做哪一步（doing，一句话；step_index / step_total 第几步、共几步）和最近一次进展（progress：一句话 + 时间）。
    // 对话标题是开头定的、后来会过时，GPT 任务名常是给 AI 看的：主行永远不用标题（本人：“驾驶舱肯定不能取标题”），
    // 依次用 doing → progress → latest_reply（它最近一条回复的第一句）→“还没写进展”，标题只做灰色小标签（render.js 的 runRow）
    doing: text(r.doing, 140), step_index: nat(r.step_index), step_total: nat(r.step_total), progress: progressOf(r), latest_reply: replyOf(r),
    // 公开版的行：后端把标题换成“一件 AI 活”、不给 detail，并标 placeholder
    placeholder: r.placeholder === true,
    // 电脑版“打开”组（后端 open：conversation / report / targets，见 render.js 的 openGroup）；没给就没有
    ...(r.open && typeof r.open === 'object' && !Array.isArray(r.open) ? { open: r.open } : {}),
    // 本人设备才有：能点的按钮（只认“知道了”“晚点提醒”）、条目版本、现在是哪家在做，以及交出去以后的状态
    ...ownerFields(r), ...(['claude', 'gpt'].includes(r.executor) ? { executor: r.executor } : {}), copy_source: r,
  }));
  const rows = convert(raw.rows);
  const stuck = rows.filter((r) => r.stuck).length;
  // unread：这次读不全，不能说成“没有 AI 在跑”，也不能写 0 个。后端刚重启、AI 会话还没读完时 count 等件数都是 null、observed_at 也是 null
  // （不一定带 gaps）；旧格式是 observed_at 为空且 gaps 非空。读完后才给整数，旧快照有整数时照旧显示原数和原时间
  const unread = !raw.observed_at && (nat(raw.count) === null || (!raw.count && !rows.length && Array.isArray(raw.gaps) && raw.gaps.length > 0));
  const count = nat(raw.count) ?? rows.length;
  // stale_count：早就停了、不算在跑的件数；读不全时是 null（不当 0 用），读全了后端没给才算 0
  // stopped_count：半路停下超过半小时、还没满 3 小时的（记为“停了，没做完”，满 3 小时并进 stale_count）；后端没给就数行，读不全时也是 null
  return { count, stuck_count: nat(raw.stuck_count) ?? (unread ? null : stuck), stale_count: nat(raw.stale_count) ?? (unread ? null : 0),
    stopped_count: nat(raw.stopped_count) ?? (unread ? null : rows.filter((r) => r.status === 'stopped').length),
    summary: text(raw.summary, 80), observed_at: raw.observed_at || null, rows, stale_rows: convert(raw.stale_rows), stopped_rows: convert(raw.stopped_rows), unread };
}

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
    verdict: { severity: obj(v.verdict).severity || 'gray', state: st(obj(v.verdict).state), observed_at: obj(v.verdict).observed_at || null, color: obj(v.verdict).color, text: text(obj(v.verdict).text, 200),
      // 要你做的总件数（公开版也含私人事项），顶上那句下面“另 N 件是私人事项”用它核对
      need_you: Number.isInteger(obj(v.verdict).need_you) ? obj(v.verdict).need_you : null },
    counts: { need_you: 0, ai_following: 0, deferred: 0, history: 0, tasks_failed_today: 0, backup_problems: 0, ...obj(v.counts) },
    // need_you 行原样透传，过了原定时间时带 overdue_since、overdue_days、overdue_text（标题旁小标签用 overdue_text）
    need_you: list(v.need_you), ai_following: list(v.ai_following), deferred: list(v.deferred),
    scheduled: list(v.scheduled), access_summary: obj(v.access_summary), summary: { ...obj(v.summary), text: obj(v.summary).text || obj(v.verdict).text || '' },
    ai_overdue: Array.isArray(v.ai_overdue) ? list(v.ai_overdue) : null,
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
    // 副机在不在线读 laptop.connection（online / offline / unknown）；laptop.state 是副机自动任务的健康，不是连接
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
    // “你得知道”（must_know）：items 保留 kind=ai_decision 的 14 天决定回执，其余沿用普通消息。
    must_know: (() => { const m = v.must_know; if (!m || typeof m !== 'object') return null; return { state: ['ok', 'empty', 'unavailable'].includes(m.state) ? m.state : 'unavailable', text: typeof m.text === 'string' ? m.text : '', observed_at: m.observed_at || null, items: list(m.items), archived: list(m.archived_items) }; })(),
    // “AI 正在跑”（后端 10 月 29 日起加的 ai_running）：字段不在就是 null，页面不出这一块；gaps 前端不显示
    ai_running: aiRunning(v.ai_running),
    // 网站上次成功发布的回执（website_release）：{state: success|unavailable, published_at, version, verified, text}；只证明上次成功那次
    website_release: v.website_release && typeof v.website_release === 'object' ? v.website_release : null,
    // 本人版 / 公开版：viewer 说这次拿到的是哪一版；private_count 是只在本人设备上显示的事项数。行上的 owner_only、placeholder、owner_detail 随行原样带着
    viewer: (() => { const w = v.viewer; if (!w || typeof w !== 'object') return null; return { kind: w.kind === 'owner' ? 'owner' : 'public', device_state: ['ok', 'none', 'invalid', 'unavailable'].includes(w.device_state) ? w.device_state : 'none', device_name: typeof w.device_name === 'string' ? w.device_name : null,
      // 电脑版：这台是电脑还是手机、是哪台电脑（主驾驶 / 副驾驶），以及打开、看汇报、一次交多件这几个接口能不能用
      device_kind: ['pc', 'phone'].includes(w.device_kind) ? w.device_kind : null, device_machine: text(w.device_machine, 20) || null,
      capabilities: (Array.isArray(w.capabilities) ? w.capabilities : []).filter((c) => ['open', 'report', 'batch'].includes(c)) }; })(),
    private_count: Number.isInteger(v.private_count) && v.private_count >= 0 ? v.private_count : null,
    // 本人设备才有（公开版不带）：近 30 天你点过的处理（精简视图是顶层 owner_recent，全量在 cockpit 下）、写回工作器状态；
    // 通知发没发出去（notification_status=failed 时写 notification_message）、调度排队提示（owner_dispatch_notice，后端下一单加）。没有就是空，不占位
    owner_recent: (() => { const r = v.owner_recent ?? obj(v.cockpit).owner_recent; return Array.isArray(r) ? list(r).filter((x) => typeof x.id === 'string') : null; })(),
    owner_actions_worker: (() => { const w = v.owner_actions_worker ?? obj(v.cockpit).owner_actions_worker; return w && typeof w === 'object' && !Array.isArray(w) ? w : null; })(),
    notification_status: text(v.notification_status ?? obj(v.cockpit).notification_status, 20),
    notification_message: text(v.notification_message ?? obj(v.cockpit).notification_message, 80),
    owner_dispatch_notice: text(v.owner_dispatch_notice ?? obj(v.cockpit).owner_dispatch_notice, 120),
    // 第三步（10 月 29 日）后端加的两句：AI 自己手上的活一句话（点进二级页“AI 的账本”）、停了 3 天以上的数据卡收成一句（ids 是收进去的卡）
    ai_ledger_summary: (() => { const l = obj(v.ai_ledger_summary); return text(l.text, 120) ? { text: text(l.text, 120), open: nat(l.open), late: nat(l.late) } : null; })(),
    stale_summary: (() => { const s = obj(v.stale_summary); return text(s.text, 120) ? { text: text(s.text, 120), ids: Array.isArray(s.ids) ? s.ids.filter((x) => typeof x === 'string') : [] } : null; })(),
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
      id: t.id, project: t.project || '', project_url: t.project_url || '', group: t.group, state: t.state, enabled: t.enabled, last_run_at: t.last_run_at, next_run_at: t.next_run_at,
      runs_today: t.runs_today, schedule_zh: t.schedule || '', heartbeat_at: t.heartbeat_at || null, failures_7d: Number.isFinite(t.failures_7d) ? t.failures_7d : undefined,
      public_message: t.public_message || undefined, notice_kind: t.notice_kind || undefined,
      // 后端的显示颜色（neutral = 有状况但 AI 在管）和 AI 在管什么；河据此升中性旗，不升红黄旗
      color: t.color || undefined, ai_handling: t.ai_handling || undefined,
      plain: { ...obj(t.plain), name: t.name || obj(t.plain).name, what: t.what || obj(t.plain).what || '', stop: t.stop || obj(t.plain).stop || '', impact: t.impact || obj(t.plain).impact || '', status_note: t.note || obj(t.plain).status_note || '', mine: t.mine === true || obj(t.plain).mine === true },
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
