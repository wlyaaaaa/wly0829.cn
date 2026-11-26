// 对话列表和详情共用的字段渲染，以及对话读数。
(() => {
  'use strict';
  const U = window.LiveUI, { esc } = U;
  function field(value, item, parent) {
    const v = value !== null && typeof value === 'object' ? value : { text: value };
    const mark = v.visibility || v.public ? v : item?.visibility || item?.public ? item : parent?.visibility === 'owner' || parent?.public === 'owner' ? parent : {};
    return { ...v, text: v.text != null && v.text !== '' ? v.text : v.value ?? v.text,
      visibility: mark.visibility === 'owner' || mark.public === 'owner' ? 'owner' : mark.visibility || (mark.public === 'rewrite' ? 'rewritten' : undefined),
      public: mark.public, rewrite: v.rewrite ?? item?.rewrite, hidden_what: v.hidden_what ?? item?.hidden_what };
  }
  // 保留内层字段的标记，按实际显示的字数截断。
  function cell(value, label, parent, viewer, limit, card, rawText = false) {
    if (value == null || value === '') return '';
    const v = field(value, value, parent);
    let raw = v.text ?? v.value ?? v.label;
    while (raw && typeof raw === 'object') {
      const inner = field(raw, raw);
      v.hidden ||= inner.hidden;
      v.hidden_block ||= inner.hidden_block;
      if (inner.visibility === 'owner' || !['owner', 'pending'].includes(v.visibility)) v.visibility = inner.visibility ?? v.visibility;
      v.rewrite = inner.rewrite ?? v.rewrite;
      v.hidden_what = inner.hidden_what ?? v.hidden_what;
      raw = inner.text ?? inner.value ?? inner.label;
    }
    const options = { name: label, kind: viewer, plain: rawText };
    const hidden = v.hidden || v.hidden_block || v.visibility === 'owner' || v.public === 'owner' || /(?:仅本人可见|可信设备可见)$/.test(raw ?? '');
    if (card && viewer === 'public' && hidden) return '';
    if (viewer === 'public' && hidden) return U.fieldHtml({ ...v, text: null, value: null, hidden: true, hidden_what: label }, options);
    if (v.visibility === 'pending' || v.rewrite === 'pending' && !raw) return U.fieldHtml({ ...v, text: null, value: null, hidden_what: label }, options);
    if (raw == null || raw === '') return '';
    const resolved = plain(U.fieldText(raw, viewer)), words = Array.from(resolved);
    const clipped = limit && words.length > limit ? words.slice(0, limit).join('') + '…' : resolved;
    const inherited = viewer === 'owner' && v.visibility === 'owner' && !v.hidden && !v.hidden_block &&
      (parent?.visibility === 'owner' || parent?.public === 'owner');
    return (card ? '' : label + '：') + U.fieldHtml({ ...v, ...(inherited && {visibility: undefined, public: undefined}), text: clipped, value: clipped }, options);
  }
  const apps = new Map([['claude', 'Claude'], ['codex', 'Codex'], ['antigravity', 'Antigravity']]);
  function appName(row) {
    const legacy = /^(claude|codex|antigravity):/i.exec(row.id)?.[1].toLowerCase() || row.source;
    return apps.get(Object.hasOwn(row, 'software') ? row.software : legacy) || '';
  }
  const appTag = row => {
    const name = appName(row);
    return name ? '<span class="chat-tag chat-app">' + name + '</span>' : '';
  };
  const contentLocked = (row, viewer) => viewer === 'public' && row?.content_locked === true;
  const contentLock = () => '计划、思考摘要和回复仅本人可见';
  function detailReply(row) {
    if (!Object.hasOwn(row, 'latest_reply')) return row.reply;
    return row.reply?.at && row.reply.at === row.latest_reply?.at ? row.reply : row.latest_reply;
  }
  const stageLabel = d => ({ discussing: '讨论', preparing: '准备', working: '在做', 讨论: '讨论', 准备: '准备', 在做: '在做' })[d.stage || d.phase] || '';
  function originLabel({ id, source, dispatched_by }, showApp = true) {
    const dispatch = typeof dispatched_by === 'string' ? dispatched_by : dispatched_by?.kind;
    const app = showApp && appName({ id, source });
    if (dispatch === 'helper' || dispatch === 'session') return [app === 'Antigravity' && app, dispatch === 'helper' ? '帮手' : '别的对话开的'].filter(Boolean).join(' · ');
    if (dispatch === 'schedule' || source === 'scheduled') return '定时任务';
    if (source === 'automation') return '自动任务';
    if (app === 'Antigravity') return app;
    if (source === 'manual') return showApp && (app || id?.startsWith('dispatch:')) ? '本人 · ' + (app || 'Claude') : '本人';
    return apps.has(source) ? '' : '来源没认出';
  }
  function plain(words) {
    return words.replace(/^ {0,3}(?:`{3,}|~{3,}).*$/gm, '')
      .replace(/^ {0,3}(?:#{1,6} +|> +)/gm, '').replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, '$1（$2）')
      .replace(/(\*\*|__|`+)([^\n]+?)\1/g, '$2').trim();
  }
  const states = { running: '在干', waiting: '等本人', queued: '在排队', reconnecting: '在重连', done: '做完了', stopped: '已停止', failed: '出错了', unknown: '状态不明', ended_unknown: '结局没读到' };
  const stepCodes = { completed: 'done', in_progress: 'running', inProgress: 'running' };
  const stepState = p => { const s = p?.status ?? p?.state; return Object.hasOwn(stepCodes, s) ? stepCodes[s] : s; };
  const stepWord = s => s === 'pending' ? '没开始' : Object.hasOwn(states, s) ? states[s] : '状态不明';
  // M915：后台给了 status_kind（设计第 3 节那 14 类加“做完了”）时，一场对话、一个帮手只认这一套标签。
  // col 是放哪一栏，tone 是标签颜色（薄荷绿 AI 在动、黄要你做、橙停等外部、粉出错、灰紫被叫停或中断、蓝灰停着待定、淡紫做完、灰读不到），
  // verb 是行首时刻后面那两个字（设计第 4 节排序表），label 是后台没给 status_label 时的默认说法。
  const KINDS = {
    running: { col: 'working', tone: 'mint', label: '在干', verb: '起在干' },   // 和卡头“在干”同一个说法（R20，r83 返修第二轮）
    reconnecting: { col: 'working', tone: 'cyan', label: '在重连', verb: '起在重连' },
    queued: { col: 'working', tone: 'slate', label: '排队', verb: '起排队' },
    quota_exhausted: { col: 'working', tone: 'orange', label: '额度用完', verb: '起额度用完' },
    login_failed: { col: 'working', tone: 'yellow', label: '登录失效 · 等你重登', verb: '起登录失效' },
    waiting_owner: { col: 'waiting', tone: 'yellow', label: '等你回答', verb: '问你' },
    quota_overdue: { col: 'waiting', tone: 'yellow', label: '过了预计恢复点 · 说一句“继续”', verb: '过了恢复点' },
    failed: { col: 'stopped', tone: 'pink', label: '出错停下', verb: '停下' },
    user_stopped: { col: 'stopped', tone: 'violet', label: '你叫停的', verb: '停下' },
    ai_stopped: { col: 'stopped', tone: 'violet', label: 'AI 叫停的', verb: '停下' },
    program_stopped: { col: 'stopped', tone: 'violet', label: '程序停下的', verb: '停下' },
    interrupted: { col: 'stopped', tone: 'violet', label: '被中断 · 没记下是谁', verb: '停下' },
    replied: { col: 'stopped', tone: 'slate', label: '回完了 · 没归档', verb: '停下' },
    unknown: { col: 'stopped', tone: 'gray', label: '状态不明', verb: '最后记录' },
    archived: { col: 'archived', tone: 'lilac', label: '做完了', verb: '归档' },
  };
  // 额度窗口：后台给 five_hour | weekly | null（M915 后台 00:04 定）
  const QUOTA_WINDOWS = { five_hour: '5 小时额度', weekly: '本周额度' };
  const quotaWindow = w => Object.hasOwn(QUOTA_WINDOWS, w) ? QUOTA_WINDOWS[w] : '';
  // 带日期的钟点：今天的只写钟点，别的天前面加“11-24”
  const dayClock = at => Number.isFinite(Date.parse(at)) ? [U.date(at) !== U.date(Date.now()) && U.date(at), U.time(at)].filter(Boolean).join(' ') : '';
  // 访客版把“你”换成“本人”（同全站“等本人回答”的说法）
  const ownerWords = (text, kind) => kind === 'public' && typeof text === 'string' ? text.replace(/等你/g, '等本人').replace(/问你/g, '问本人').replace(/^你叫停/, '本人叫停') : text;
  const statusKind = d => typeof d?.status_kind === 'string' && Object.hasOwn(KINDS, d.status_kind) ? d.status_kind : '';
  const sortVerb = d => statusKind(d) === 'archived' && d.sort_at_source === 'last_activity' ? '最后动静' : (KINDS[statusKind(d)] || KINDS.unknown).verb;
  // 帮手名单：新回包在 helpers.items，旧回包是数组或 helpers.active
  const helperList = d => Array.isArray(d?.helpers) ? d.helpers : Array.isArray(d?.helpers?.items) ? d.helpers.items : d?.helpers?.active || [];
  function statusLabel(d, kind) {
    const given = d?.status_label != null ? U.fieldText(d.status_label, kind).trim() : '', k = statusKind(d);
    if (given) return ownerWords(given, kind);
    if (!k) return '';
    if (k === 'quota_exhausted') return ['额度用完', quotaWindow(d.quota_window), d.quota_reset_at ? `预计 ${dayClock(d.quota_reset_at)} 恢复` : '宿主没给恢复时间'].filter(Boolean).join(' · ');
    return ownerWords(KINDS[k].label, kind);
  }
  function rowState(d, kind) {
    const label = statusLabel(d, kind);
    if (label) return label;
    if (d.state === 'waiting' && d.wait_kind === 'final') return '等本人回答';
    return U.chatWaitLabel(d, kind) || stepWord(d.state);
  }
  const quota = (d, kind) => d.state === 'failed' && /^(?:(?:5 小时|周)额度|额度)用完(?:$| · )/.test(U.fieldText(d.text, kind));
  function repeatsState(value, row, kind) {
    const text = U.fieldText(value, kind);
    return text === rowState(row, kind) || (row.state === 'stopped' && text === '叫停') ||
      (row.state === 'failed' && text === '坏了') || (row.state === 'waiting' && row.wait_kind === 'final' && text === '等你回答');
  }
  function planInfo(d) {
    const plan = Array.isArray(d.plan) ? d.plan : [], summary = d.plan_summary;
    const total = summary?.total ?? (d.step_total > 0 ? d.step_total : plan.length);
    const completed = summary?.completed ?? plan.filter(p => stepState(p) === 'done').length;
    const running = plan.map(stepState).reduce((out, s, i) => s === 'running' ? [...out, i + 1] : out, []);
    const ordinal = summary ? summary.current : d.step_index ?? (running.length === 1 ? running[0] : null);
    const current = total > completed && Number.isInteger(ordinal) && ordinal >= 1 && ordinal <= total ? ordinal - 1 : -1;
    const label = current >= 0 ? `第 ${current + 1}／${total} 步` : '';
    return { plan, total, current, label, count: total > 0 ? completed === total ? `已完成 ${total} 步` : `共 ${total} 步` : '' };
  }
  const helperTotal = d => d.helper_counts?.total ?? (Array.isArray(d.helpers) || Array.isArray(d.helpers?.items) ? helperList(d).reduce((n, h) => n + (h.private_count || 1), 0) : d.helpers?.total);
  const workingHelpers = d => d.helper_counts?.by_state?.running ?? (Array.isArray(d.helpers) || Array.isArray(d.helpers?.items) ? helperList(d).filter(h => h.state === 'running' || h.status_kind === 'running').length : d.helpers?.running);
  function helperActivity(h, now) {
    // M915：帮手带了 status_kind（不在做）时，写“这一类从几点起”，不再按旧 state 写“出错于”（额度用完的帮手不是出错）
    const k = KINDS[statusKind(h)];
    if (statusKind(h) === 'archived' && Number.isFinite(Date.parse(h.delivered_at))) return `${dayClock(h.delivered_at)} 交回`;
    if (k && statusKind(h) !== 'running' && Number.isFinite(Date.parse(h.sort_at ?? h.at))) return `${dayClock(h.sort_at ?? h.at)} ${sortVerb(h)}`;
    if (!Number.isFinite(Date.parse(h.at))) return '';
    const at = [U.date(h.at), U.time(h.at)].filter(Boolean).join(' ');
    if (h.state === 'running') return U.offline?.() ? `断开前最后有动静 ${at}` : now ? `${U.ago(h.at, now)}有动静` : `最后有动静 ${at}`;
    const verb = h.state === 'done' ? '完成于' : h.state === 'stopped' ? '停止于' : h.state === 'failed' ? '出错于' : '最后记录于';
    return `${verb} ${at}`;
  }
  const peopleIn = (rows = []) => (rows || []).reduce((n, c) => n + (c.private_count || 1), 0);
  const totalOf = col => Number.isInteger(col?.total) ? col.total : null;
  const listedOf = col => Array.isArray(col?.items) ? peopleIn(col.items) : null;
  const earlierCount = (rows, state, total) => Number.isInteger(total) ? Math.max(0, peopleIn(rows?.filter(c => c.state === state)) - total) : 0;
  const bySortAt = rows => {
    const stamp = row => { const t = Date.parse(row.sort_at); return Number.isFinite(t) ? t : -Infinity; };
    return [...rows].sort((a, b) => stamp(b) - stamp(a));
  };
  const isRunning = row => (statusKind(row) || row.state) === 'running';
  U.chatFields = { peopleIn, totalOf, listedOf, earlierCount, bySortAt, isRunning, field, cell, appTag, contentLocked, contentLock, detailReply, stageLabel, originLabel, plain, states, rowState, quota, repeatsState, stepState, stepWord, planInfo, helperTotal, workingHelpers, helperActivity,
    KINDS, statusKind, statusLabel, quotaWindow, dayClock, ownerWords, sortVerb, helperList };
  const badge = c => c?.compaction?.count >= 1 ? `<span class="chat-pill">压缩过 ${esc(c.compaction.count)} 次</span>` : '';
  function compactionFacts(event) {
    const { trigger, pre_tokens: tokens, pre_context_ratio: ratio } = event || {};
    const size = Number.isFinite(tokens) ? (tokens >= 10000 ? `${Number((tokens / 10000).toFixed(1))} 万` : tokens) : null;
    return [
      trigger === 'auto' ? '自动' : trigger === 'manual' ? '手动' : '',
      size !== null ? `压缩前 ${size} token` : '',
      Number.isFinite(ratio) ? `占上下文 ${Number((ratio * 100).toFixed(1))}%` : '',
    ].filter(Boolean).join(' · ');
  }
  function compactionTimes(compact, events) {
    const today = U.date(new Date().toISOString()), times = compact?.times || [];
    return Array.from({ length: Math.max(times.length, events?.length || 0) }, (_, i) => {
      const event = events?.[i], at = times[i] ?? event?.at;
      const time = at ? `${U.date(at) === today ? '' : U.date(at) + ' '}${U.time(at)}` : '时刻没有记录';
      return [time, compactionFacts(event)].filter(Boolean).join(' · ');
    }).join('、');
  }
  function compactionDisclosure(c) {
    const compact = c?.compaction, events = compact?.events;
    if (!(compact?.count >= 1) || !events?.some(compactionFacts)) return '';
    return `<details class="chat-think row__sub"><summary>压缩记录</summary><p>${esc(compactionTimes(compact, events))}</p></details>`;
  }
  function detail(host, c) {
    let line = host.parentElement.querySelector('[data-compaction]');
    if (!line) { line = document.createElement('div'); line.className = 'row__sub'; line.dataset.compaction = ''; host.after(line); }
    const compact = c?.compaction, events = compact?.events;
    line.hidden = !(compact?.count >= 1);
    const label = line.hidden ? '' : esc(`压缩过 ${compact.count} 次`);
    const timed = compact?.times?.some(Boolean) || events?.some(e => e?.at);
    const open = line.querySelector?.('details')?.open ? ' open' : '';
    U.html(line, !line.hidden && timed
      ? `<details${open}><summary>${label}</summary><p>${esc(compactionTimes(compact, events))}</p></details>`
      : label);
  }
  const stamp = at => [U.date(at), U.time(at)].filter(Boolean).join(' ');
  const vendorNames = new Map([['claude', 'Claude'], ['openai', 'OpenAI']]);
  const incidentTitles = new Map([
    ['Claude unable to join meetings', '暂时无法加入会议'],
    ['Costs API data is delayed', '费用接口的数据有延迟'],
  ]);
  function official(d) {
    return (d?.official_status || []).filter(s => s.q === 'ok' && s.incidents?.length).flatMap(s => s.incidents.map(i => {
      const title = U.sp(i.title).trim();
      const chinese = [i.summary_zh, i.title_zh, title].map(value => U.sp(value).trim()).find(text => text !== '官方报告服务异常，受影响功能见原文' && /[\u4e00-\u9fff]/.test(text));
      const summary = chinese || incidentTitles.get(title) || '官方有服务通告';
      const times = [['通告发布', i.announced_at], ['事件开始', i.started_at], ['官网读取', s.at]];
      return [`${vendorNames.get(s.id) || s.id}：${summary}`, ...times.filter(([, at]) => at).map(([label, at]) => `${label} ${stamp(at)}`)].join(' · ');
    })).join('\n');
  }
  // 没记下型号的：Antigravity 的写 Gemini Carbon（本人 11-23 07:53：“这个应该是gemini carbon 暂时这样改就行了”），别家照旧写“型号没记下”（M541）
  const modelName = row => {
    const name = Object.hasOwn(row, 'model_text') ? row.model_text : row.model;
    if ((name == null || name === '' || name === '型号没记下') && (row.vendor === 'antigravity' || appName(row) === 'Antigravity')) return 'Gemini Carbon';
    return name ?? (appName(row) ? '型号没记下' : undefined);
  };
  // 前面已有软件标签时，型号不再重复软件名：标签 Claude 后接 Opus 5.5，而不是 Claude Claude Opus 5.5
  const bareModel = row => { const name = modelName(row), app = appName(row); return typeof name === 'string' && app && name.startsWith(app + ' ') ? name.slice(app.length + 1) : name; };
  // 复用对话页图表色。旧包的点仍是青色，只有带家族字段的新包启用分色。
  const familyHues = { sol: 'teal', astra: 'violet', terra: 'blue', luna: 'pink' };
  const chartHues = window.LiveChart?.hues || {};
  function modelHue(row) {
    if (!Object.hasOwn(row, 'model_family')) return 'teal';
    if (Object.hasOwn(familyHues, row.model_family)) return familyHues[row.model_family];
    const palette = ['teal', 'violet', 'blue', 'pink', 'apricot'];
    const name = U.sp(modelName(row));
    const index = Array.from(name).reduce((n, c) => (n + c.codePointAt(0)) % palette.length, 0);
    return palette[index];
  }
  function modelRows(rows) {
    if (!rows.some(row => Object.hasOwn(row, 'model_family'))) return rows;
    const groups = new Map();
    for (const row of rows) {
      const key = row.model_family ? 'family:' + row.model_family : 'name:' + U.sp(modelName(row));
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
    }
    return [...groups.values()].flat();
  }
  function modelHtml(row, { bare, ...options } = {}) {
    const name = bare ? bareModel(row) : modelName(row);
    if (!name) return '';
    const color = Object.hasOwn(row, 'model_family') && chartHues[modelHue(row)];
    return (color ? '<span aria-hidden="true" style="display:inline-block;width:.46em;height:.46em;border-radius:50%;margin-inline-end:.35em;background:' + color + '"></span>' : '') + U.fieldHtml(name, options);
  }
  function sourceHtml(data, viewer) {
    const count = data?.unconnected_source_count;
    if (count === null) return '<p class="row__sub">没有记录</p>';
    if (!Number.isInteger(count) || count <= 0) return '';
    const text = '还有 ' + count + ' 个没接上';
    const list = Array.isArray(data.unconnected_sources) && data.unconnected_sources;
    if (!list?.length) return '<p class="row__sub">' + text + '</p>';
    const rows = list.map(item => '<li>' + [item.tool, item.path, item.reason].filter(Boolean).map(esc).join(' · ') + '</li>').join('');
    return '<details class="row__sub"><summary class="more">' + text + '</summary><ul>' + rows + '</ul></details>';
  }
  // 帮手交回的是一段程序原文（JSON：status、reason、outputs、images）时，换成人看的几行；只剩一个“{”的摘要不摆
  const READY = { ready: '已备齐', blocked: '卡住了', done: '做完了', failed: '出错了', ok: '正常', error: '出错了' };
  function readable(value) {
    const raw = typeof value === 'object' && value !== null ? value.text ?? value.value : value;
    if (typeof raw !== 'string') return value;
    const words = raw.trim();
    if (/^[{[]$/.test(words)) return null;
    if (!/^[{[]/.test(words)) return value;
    let data;
    try { data = JSON.parse(words); } catch { return value; }
    if (!data || typeof data !== 'object') return value;
    const rows = [];
    if (typeof data.status === 'string') rows.push(`状态：${READY[data.status] || data.status}`);
    for (const key of ['reason', 'summary', 'message', 'text']) if (typeof data[key] === 'string' && data[key].trim()) rows.push(data[key].trim());
    for (const out of Array.isArray(data.outputs) ? data.outputs : []) {
      if (typeof out?.path === 'string') rows.push(`交回的文件：${out.path}`);
      if (typeof out?.content === 'string' && out.content.trim()) rows.push(out.content.trim());
    }
    if (Array.isArray(data.images) && data.images.length) rows.push(`附图 ${data.images.length} 张`);
    if (!rows.length) return value;
    const text = rows.join('\n');
    return typeof value === 'object' && value !== null ? { ...value, text, value: text } : text;
  }
  function helperDetailHtml(helper, viewer, parent) {
    if (contentLocked(helper, viewer) || contentLocked(parent, viewer)) return '';
    // 出错了的帮手先写出错原因（后台从执行记录取的 failure_reason）；本人版的 owner_detail 已是“出错原因：…”加原文，就只摆它，不重复
    const detail = helper.owner_detail ?? null, cause = typeof detail === 'string' && /^出错原因[：:]/.test(detail);
    const failure = cause ? detail.replace(/^出错原因[：:]\s*/, '') : helper.state === 'failed' ? helper.failure_reason ?? null : null;
    // 摘要：Claude 帮手的英文半句或“第 N/M 步”换成后台给的中文进展（localized.summary）；没有中文的照原文，并写清缺因
    const local = helper.localized?.summary, gaps = helper.field_gaps || {};
    const missing = [!local?.text && gaps.summary, !helper.localized?.title && gaps.title].filter(v => typeof v === 'string' && v);
    const content = [['出错原因', failure], ['摘要', local?.text ? local : readable(helper.summary)], ['最新回复', readable(helper.reply ?? helper.latest_reply)], ['详情', cause ? null : detail]]
      .map(([label, value]) => value != null && cell(field(value, helper, parent), label, parent, viewer)).filter(Boolean);
    if (missing.length) content.push(`<span style="color:var(--route-muted, #848b87)">${missing.map(esc).join('；')}</span>`);
    return content.length ? `<details class="row__sub"><summary class="more">帮手详情</summary>${content.map(html => `<p style="white-space:pre-wrap;overflow-wrap:anywhere">${html}</p>`).join('')}</details>` : '';
  }
  function mount({ row, readViewer }) {
    const hero = document.querySelector('#hero .card__body'), notice = document.createElement('p'); notice.className = 'row__sub'; notice.dataset.official = ''; notice.hidden = true; hero.append(notice);
    const doneTitle = '近 30 天 · 做完的对话';
    const done = Object.assign(document.createElement('section'), { id: 'chat-done30', className: 'card chat-stats', hidden: true });
    done.innerHTML = `<div class="card__glass glass"><div class="card__body"><details><summary class="part">${doneTitle}</summary><p class="row__sub" data-since></p><ul class="rows list"></ul></details><div data-error role="status"></div></div></div>`;
    document.querySelector('.chat-lower').after(done);
    const disclosure = done.querySelector('details'), summary = disclosure.querySelector('summary');
    const range = disclosure.querySelector('[data-since]'), list = disclosure.querySelector('ul');
    // 读不到时只写“这块暂时读不到”“这块没存下来”，不在小标题底下把“近 30 天 · 做完的对话”再写一遍（主控 11-26 06:15 看 r83 时记）
    const doneRead = U.reading(done.querySelector('[data-error]'), { ghost: '' });
    function doneUnavailable(state) {
      if (['none', 'gone'].includes(state.phase) || state.meta?.status >= 400) {
        done.hidden = false;
        // 没存下来时卡里只留雾里那行标题和一句话，可展开的小标题先收起，不把“近 30 天 · 做完的对话”写两遍（r83 返修）
        disclosure.hidden = state.phase === 'gone';
        doneRead.set({ ...state, phase: state.phase === 'gone' ? 'gone' : 'none' });
      } else if (Array.isArray(state.data?.items)) { disclosure.hidden = false; doneRead.done(false); }
    }
    let baseStatus, recentStatus;
    const drawNotice = () => {
      const message = official({ official_status: baseStatus ?? recentStatus });
      notice.hidden = !message;
      U.html(notice, esc(message).replaceAll('\n', '<br>'));
    };
    window.Live.watch('chats', null, { data(d) { baseStatus = d?.official_status; drawNotice(); } });
    window.Live.watch('chats', { window: '72h' }, { data(d) { recentStatus = d?.official_status; drawNotice(); } });
    window.Live.watch('chats',{window:'30d'},{data(d,meta) {
      const items = d?.items;
      done.hidden = !Array.isArray(items);
      summary.textContent = `${doneTitle}${done.hidden || d.total == null ? '' : ` · ${d.total} 个`}`;
      if (done.hidden) {
        U.html(range, '');
        U.list(list, [], { animate: false });
        return;
      }
      readViewer(meta);
      const { from, to } = d.coverage || {};
      const since = d.collection_started_at || d.since;
      const dates = [from && to && `记录覆盖 ${stamp(from)} 至 ${stamp(to)}`, since && `采集开始 ${stamp(since)}`, d.at && `历史更新 ${stamp(d.at)}`];
      const gap = d.gap ? U.fieldHtml(d.gap, { name: '对话记录范围', kind: meta.viewer.kind }) : '';
      U.html(range, [...dates.filter(Boolean).map(esc), gap].filter(Boolean).join(' · '));
      const rows = items.length ? items.map(c => row(c, d.at || meta.at, true)) : [{ key: 'empty', cls: 'row__sub', html: '这段时间没有完成的对话' }];
      U.list(list, rows, { animate: disclosure.open });
    }, link: doneUnavailable });
  }
  U.draw10 = { badge, detail, compactionDisclosure, official, mount, modelName, bareModel, modelHue, modelRows, modelHtml, sourceHtml, helperDetailHtml };
})();
