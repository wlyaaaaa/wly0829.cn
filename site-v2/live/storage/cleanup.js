// 自动清理卡：近 7 天腾出多少、各盘这轮腾出和还剩、出错 / 保护名单 / 下次几点、按规则分、各盘空闲走势。
// 数据：computer/storage 的 cleanup（自动清理自动任务每轮写回执，后台转给页面），字段见交回里的数据约定；
// 缺 cleanup 时这张卡照样画“现在还剩”和走势，其余灰掉写原因。
(() => {
  'use strict';
  const U = window.LiveUI, K = window.StorageKit, { esc } = U, DAY = 86400000;
  const RULE_HUES = ['#f3a6c4', '#9fbdf4', '#c4b2f2', '#9fdcd6', '#f6c88f', '#cfd5df'];
  const at = s => { const t = Date.parse(s); return Number.isFinite(t) ? t : null; };
  const num = n => Number.isFinite(n) ? n : null;
  const hm = s => U.time(s) || '';
  const when = s => s ? `${U.date(s)} ${U.time(s)}` : '';
  const removalBytes = row => num(row?.removed_logical_bytes);
  const diskRemoval = (run, volume) => run?.removed_by_volume?.[K.letter(volume)];
  const removalComplete = run => run?.removal_totals_complete === true;
  const emptyRemoval = (run, row = run) => removalComplete(run) && run.result === 'ok' && row?.removed_entries === 0;
  function removalText(run, row = run) {
    const bytes = removalBytes(row);
    if (bytes == null) return '';
    return emptyRemoval(run, row) ? '没有到期的' : `${removalComplete(run) ? '' : '至少'}腾出 ${K.size(bytes)}`;
  }
  function receiptVolumes(run) {
    const known = Array.isArray(run?.volumes) ? run.volumes : [];
    const letters = new Set(known.map(K.letter));
    const extra = Object.entries(run?.removed_by_volume || {})
      .filter(([id, row]) => /^[A-Z]$/.test(id) && !letters.has(id) && (row?.removed_entries > 0 || removalBytes(row) > 0))
      .map(([id]) => ({ id: `${id}:` }));
    return extra.length ? known.concat(extra) : run?.volumes;
  }
  const readAmount = (value, label, viewer) => {
    const text = K.field(value, label, viewer);
    return K.isPlaceholder(text) ? text : K.size(K.raw(value));
  };
  const RULE_NAMES = {
    'website-cache': '网站施工缓存', 'website-work': '网站施工目录', 'codex-temp': 'Codex 临时目录',
    'claude-temp': 'Claude 临时目录', 'antigravity-temp': 'Antigravity 临时目录', 'shared-temp': '共享临时目录',
    'claude-session-temp': 'Claude 会话临时目录', 'codex-work': 'Codex 施工目录', 'windows-dumps': 'Windows 转储',
    'driver-diagnostics': '驱动诊断', diagnostics: '诊断记录', 'owner-temp': '个人临时目录', 'windows-temp': 'Windows 临时目录',
    'nvidia-downloads': '显卡驱动下载缓存', 'cloudmusic-cache': '网易云音乐缓存',
    'retired-restore-contents': '已退役的恢复产物', 'retired-claude-migration': '已退役的 Claude 迁移产物',
    // 下面这些和后台 public_dashboard_storage.py 的 CLEANUP_LABELS 同名同义（M538）
    'registered-worktrees': '登记的施工目录', 'idle-ai-git': '闲置 AI 分支', 'ai-build-cache': 'AI 构建缓存',
    'approved-old-website-docs': '已批准清理的网站旧文档', 'cinebench-textures': 'Cinebench 纹理资源', 'discovered-git': '发现的 Git 目录',
    'discovered-wrapper_temp': '发现的启动器临时目录', 'jetbrains-old-rebuildable-cache': 'JetBrains 可重建的旧缓存',
    'mcp-compile-cache': 'MCP 编译缓存', 'mcp-installer-files': 'MCP 安装文件', 'nvidia-dxcache': 'NVIDIA DirectX 着色器缓存',
    'report-pages': 'AI 汇报网页', 'retired-claude-vm-bundle-cache': '已退役的 Claude 虚拟机缓存', 'user-temp-installers': '用户临时安装包',
    'user-temp-test-fixtures': '用户临时测试材料', 'v-codex-cache': 'V 盘 Codex 缓存', 'v-codex-temp': 'V 盘 Codex 临时目录',
    'v-personal-scratch': 'V 盘个人暂存目录', 'v-work-scratch': 'V 盘工作暂存目录', 'website-direct-copy-cache': '网站直接复制缓存',
    'website-release-assets': '网站发布素材', 'website-source-generated': '网站源码生成产物', 'windows-delivery-optimization': 'Windows 传递优化缓存',
    // 下面这些是 automatic_cleanup.py 代码里写死、后台 CLEANUP_LABELS 还没收的规则（M538）
    'codex-derived': 'Codex 衍生文件', 'claude-artifact': 'Claude 过程产物', 'discovered-ai': '发现的 AI 临时目录',
    'discovered-cache': '发现的缓存目录', 'discovered-owner_rule': '本人定过要清的目录', 'discovered-child-worktree': '发现的子任务工作树',
    'downloads-redownload': '能重新下载的下载文件', 'retired-archive': '已退役的归档', 'weekly-judgment': '每周判定可删的项目',
    'empty-directories': '空文件夹',
  };
  const ICON = {
    ok: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.2"/><path d="m7.8 12.3 2.9 2.9 5.6-6"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 4.6 5.6v5.8c0 4.6 3.1 8.4 7.4 9.8 4.3-1.4 7.4-5.2 7.4-9.8V5.6z"/><path d="m8.6 12.1 2.4 2.4 4.4-4.7"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.2"/><path d="M12 7v5.3l3.4 2"/></svg>',
    warn: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.2"/><path d="M12 7.2v6.2M12 16.6v.2"/></svg>',
  };

  // 回执整理成页面要用的几样：最近一轮、近 7 天每天、出错 / 保护名单合计、下次几点。
  function digest(d, now = Date.now()) {
    const c = d?.cleanup;
    if (!c || typeof c !== 'object') return null;
    const runs = (Array.isArray(c.runs) ? c.runs : []).filter(r => at(r.started_at) || at(r.finished_at)).sort((a, b) => (at(b.finished_at) ?? at(b.started_at)) - (at(a.finished_at) ?? at(a.started_at)));
    const done = runs.filter(r => r.result !== 'running' && at(r.finished_at));
    const last = done[0] || null, week = done.filter(r => now - at(r.finished_at) < 7 * DAY);
    const days = Array.from({ length: 7 }, (_, i) => { const t = now - (6 - i) * DAY; return { key: K.dayKey(t), bytes: null, runs: 0, partial: false }; });
    let total = null, partial = false;
    for (const r of week) {
      const bytes = removalBytes(r), incomplete = bytes == null || !removalComplete(r);
      if (bytes != null) total = (total ?? 0) + bytes;
      partial ||= incomplete;
      const day = days.find(x => x.key === K.dayKey(at(r.finished_at)));
      if (!day) continue;
      if (bytes != null) day.bytes = (day.bytes ?? 0) + bytes;
      day.partial ||= incomplete;
      day.runs++;
    }
    const errors = week.filter(r => r.result === 'error'), deleted = week.reduce((n, r) => n + (num(r.protected_deleted) || 0), 0);
    // 按需更新快核（M928）：对照任务触发器的 Repetition.Interval 和接口 cleanup.interval_hours。
    const hours = c.interval_hours > 0 ? num(c.interval_hours) : null;
    const running = runs[0]?.result === 'running' ? runs[0] : null;
    let next = at(c.next_run_at), estimated = false;
    if (!next && last && hours && !running) { next = at(last.finished_at) + hours * 3600000; estimated = true; }
    const overdue = !!(!running && hours && last && now - at(last.finished_at) > lateHours(hours) * 3600000);
    return { c, runs, last, week, days, total, partial, errors, deleted, hours, next, estimated, overdue, running };
  }

  // 按需更新快核（M928）核法：“没按时跑”由下面 lateHours 计算，现两轮间隔再加 1 小时（间隔取 cleanup.interval_hours，现 6 小时，合计 13 小时）；变了核对“下次”那格
  function lateHours(hours) { return hours * 2 + 1; }

  // 给页首用：保护名单被删 > 出错或没按时跑；都没有返回 null（再看盘会不会满）。
  function alarm(d) {
    const g = digest(d);
    if (!g) return null;
    if (g.deleted > 0) return { tone: 'red', text: `保护名单里有 ${g.deleted} 件被删了 · 自动清理近 7 天` };
    if (g.last?.result === 'error') return { tone: 'amber', text: `自动清理上一轮出错 · ${when(g.last.finished_at)}` };
    if (g.last?.result === 'warn') return { tone: 'amber', text: '部分完成' };
    if (g.overdue) return { tone: 'amber', text: `自动清理没按时跑 · 上次 ${when(g.last.finished_at)}` };
    return null;
  }

  function pill(g) {
    if (!g?.last && !g?.running) return '<span class="cl-pill" data-tone="gray"><i></i>这页还没读到自动清理结果</span>';
    if (g.deleted > 0) return '<span class="cl-pill" data-tone="red"><i></i>保护名单被删</span>';
    if (g.last?.result === 'error') return '<span class="cl-pill" data-tone="amber"><i></i>上一轮出错</span>';
    if (g.last?.result === 'warn') return '<span class="cl-pill" data-tone="amber"><i></i>部分完成</span>';
    if (g.overdue) return '<span class="cl-pill" data-tone="amber"><i></i>没按时跑</span>';
    if (g.running) return '<span class="cl-pill" data-tone="green"><i></i>正在跑</span>';
    if (!g.hours) return `<span class="cl-pill" data-tone="gray"><i></i>上次 ${esc(hm(g.last.finished_at))} 跑完</span>`;
    return '<span class="cl-pill" data-tone="green"><i></i>运行正常</span>';
  }

  function receiptRows(source, viewer, kind, fields, render) {
    const { visible, hidden } = K.splitRows(source, viewer);
    const withheld = K.hiddenRows(hidden, kind, fields);
    return visible.map(render).concat(withheld || []).join('<br>') ||
      (Array.isArray(source) ? '没有记录项' : '这轮没读到明细');
  }

  function receipts(g, viewer) {
    if (!g.week.length) return '';
    const amount = (value, label) => readAmount(value, label, viewer);
    const items = g.week.map(run => {
      const result = run.result === 'warn' ? '部分完成' : run.result === 'error' ? '出错' : '跑完';
      const summary = [when(run.finished_at), result, removalText(run)].filter(Boolean).join(' · ');
      const disks = receiptRows(receiptVolumes(run), viewer, '清理磁盘记录', '磁盘名称及前后余量', v => {
        const free = v.free_before != null && v.free_after != null ? `空闲 ${amount(v.free_before, '清理前余量')} → ${amount(v.free_after, '清理后余量')}`
          : v.free_after != null ? `清理后还剩 ${amount(v.free_after, '清理后余量')}` : v.free_before != null ? `清理前还剩 ${amount(v.free_before, '清理前余量')}` : '';
        return esc([K.volName(v, viewer), free, removalText(run, diskRemoval(run, v) || {})].filter(Boolean).join(' · '));
      });
      const rules = receiptRows(run.rules, viewer, '清理规则记录', '规则名称和清理量', r => {
        const size = r.bytes_basis === 'removed_logical_bytes' && removalBytes(run) != null && r.freed_bytes != null
          ? `移除文件大小 ${amount(r.freed_bytes, '规则清理量')}` : '';
        return esc([ruleLabel(r, viewer), size].filter(Boolean).join(' · '));
      });
      return `<details class="st-detail" data-key="${esc('cleanup-' + (run.id || run.finished_at))}"><summary class="live-disclosure">${esc(summary)}</summary><p class="cl-sub">各盘<br>${disks}</p><p class="cl-sub">各规则<br>${rules}</p></details>`;
    });
    return `<details class="st-detail" data-key="cleanup-receipts"><summary class="live-disclosure">近 7 天逐轮明细</summary>${items.join('')}</details>`;
  }

  function total(g, viewer) {
    if (!g?.last) return '<p class="cl-k">近 7 天</p><p class="cl-big is-gray">—</p>';
    const max = Math.max(...g.days.map(x => x.bytes), 1);
    const daily = x => `${x.partial ? '至少' : ''}腾出 ${K.size(x.bytes)}`;
    const bars = g.days.map((x, i) => x.bytes == null
      ? `<li data-missing title="${esc(x.key)} 没记录"><span>${esc(x.key)}</span>${x.runs || i === 6 ? '<em>没记录</em>' : ''}</li>`
      : `<li${i === 6 ? ' class="is-today"' : ''}><b style="--h:${x.bytes ? Math.max(4, Math.round(x.bytes / max * 66)) : 2}px" title="${esc(`${x.key} ${daily(x)} · ${x.runs} 轮`)}"></b><span>${esc(x.key)}</span>${i === 6 || x.bytes === max && x.bytes ? `<em>${esc(`${x.partial ? '至少 ' : ''}${K.size(x.bytes)}`)}</em>` : ''}</li>`).join('');
    const last = [`最近一轮 ${when(g.last.finished_at)}`, removalText(g.last)].filter(Boolean).join(' · ');
    const measured = g.total != null;
    const heading = measured ? `近 7 天${g.partial ? '至少' : '共'}腾出 · ${g.week.length} 轮` : '近 7 天';
    return `<p class="cl-k">${heading}</p><p class="cl-big">${esc(measured ? K.size(g.total) : `${g.week.length} 轮`)}</p><p class="cl-sub">${esc(last)}</p>${measured ? `<ol class="cl-days" aria-label="近 7 天每天腾出">${bars}</ol>` : ''}${receipts(g, viewer)}`;
  }

  // 绿段来自删除回执，盘面前后的空闲变化不能当成删掉的字节。
  function volumes(d, g, viewer) {
    const run = g?.last;
    const all = (d?.volumes || []).filter(v => K.letter(v) !== 'F');
    const live = new Map(all.map(v => [K.letter(v), v]));
    const fromRun = K.splitRows(receiptVolumes(run), viewer).visible.filter(r => K.letter(r) !== 'F')
      .map(r => ({ r, v: live.get(K.letter(r)) || { id: r.id } }));
    const seen = new Set(fromRun.map(x => K.letter(x.v) || K.letter(x.r)));
    const rest = all.filter(v => !seen.has(K.letter(v))).sort(K.order).map(v => ({ r: null, v }));
    const deleted = v => removalBytes(diskRemoval(run, v)) ?? 0;
    const rows = [...fromRun.sort((a, b) => deleted(b.v) - deleted(a.v) || K.order(a.v, b.v)), ...rest];
    if (all.length && !live.has('V') && !seen.has('V')) rows.push({ r: null, v: { id: 'V:' }, missing: true });
    if (!rows.length) return '<p class="cl-sub">盘的容量还没读到。</p>';
    let anyRemoved = false;
    return `<ul class="cl-vols">${rows.map(({ r, v, missing }) => {
      const liveFree = num(v.free), free = liveFree ?? num(r?.free_after), totalBytes = num(v.total);
      const removal = diskRemoval(run, v) || {}, bytes = removalBytes(removal), removed = removalText(run, removal);
      if (v.state === 'offline') {
        const left = free == null ? '' : `${liveFree == null ? `${when(run.finished_at)} ` : '当时'}还剩 ${K.size(free)}`;
        const text = [removed, K.offlineRead(v, viewer), left].filter(Boolean).join(' · ');
        return `<li class="is-gray"><span class="cl-vol">${esc(K.volName(v))}</span><span class="cl-bar is-gray"></span><span class="cl-vol__t">${esc(text)}</span></li>`;
      }
      const why = missing ? '还没接进存储读数' : '容量没读到';
      const left = free == null ? why : `${liveFree == null ? `${when(run.finished_at)} ` : ''}还剩 ${K.size(free)}`;
      const text = [removed, left].filter(Boolean).join(' · ');
      const segment = bytes > 0 && free > 0 && totalBytes > 0 ? Math.min(bytes, free) / totalBytes * 100 : 0;
      anyRemoved ||= segment > 0;
      const bar = totalBytes > 0 && free != null
        ? `<span class="cl-bar" role="img" aria-label="${esc(`${K.volName(v)} ${text}`)}"><i style="width:${((totalBytes - free) / totalBytes * 100).toFixed(2)}%"></i>${segment ? `<b style="width:${segment.toFixed(2)}%"></b>` : ''}</span>`
        : `<span class="cl-bar is-gray" title="${esc(`${K.volName(v)}${why}`)}"></span>`;
      return `<li${free == null ? ' class="is-gray"' : ''}><span class="cl-vol">${esc(K.volName(v))}</span>${bar}<span class="cl-vol__t">${esc(text)}</span></li>`;
    }).join('')}</ul><p class="cl-key"><i class="is-used"></i>蓝＝占用${anyRemoved ? '<i class="is-freed"></i>绿＝这轮腾出的<i class="is-free"></i>白＝其余空闲' : '<i class="is-free"></i>白＝空闲'}${rows.some(x => x.v.state === 'offline' || num(x.v.free) == null && num(x.r?.free_after) == null) ? '<i class="is-none"></i>斜线＝离线或没读到' : ''}</p>`;
  }

  // 规则中文名：先用回执里 rules[] 的 label、failures[] 的 rule_name，再用上面的对照表；
  // 都没有就返回空，由 progress() 写一句“这条规则还没有中文名”，不露英文 id（M538）
  function ruleName(id, g, viewer) {
    if (!id || K.isPlaceholder(id)) return id || '';
    for (const r of g?.runs || []) {
      const hit = (Array.isArray(r.rules) && r.rules.find(x => x?.id === id)?.label) || (Array.isArray(r.failures) && r.failures.find(x => x?.rule_id === id)?.rule_name);
      const name = hit && K.field(hit, '清理规则名称', viewer);
      if (name && name !== id) return name;
    }
    return RULE_NAMES[id] || (/^[\w.-]+$/.test(id) ? '' : id);
  }

  // 回执 rules[] 的 label：后台对照表没收的规则会把英文 id 原样当 label 发来，这时按上面的表换成中文（M538）
  function ruleLabel(r, viewer) {
    const text = K.field(r?.label, '清理规则名称', viewer);
    if (!text || !/^[\w.-]+$/.test(text)) return text || '规则';
    return RULE_NAMES[text] || RULE_NAMES[r.id] || '还没有中文名的规则';
  }

  function progress(run, viewer, g) {
    const p = run.progress;
    if (viewer !== 'owner' && K.locked(p)) return '清理进度仅本人可见';
    const gap = K.field(run.progress_gap, '清理进度缺因', viewer);
    const event = K.field(p?.event, '清理步骤', viewer), rule = K.field(p?.rule, '清理规则', viewer);
    const step = ({ checking: '正在检查', candidate: '检查到待清项目', deleting: '正在删除', removed: '已移除', skipped: '已跳过' })[event] ||
      (K.isPlaceholder(event) ? event : rule && '正在处理');
    const entries = K.field(p?.removed_entries, '移除项数', viewer);
    const counts = [entries && (K.isPlaceholder(entries) ? entries : `移除 ${entries} 项`),
      p?.removed_logical_bytes != null && `文件大小 ${readAmount(p.removed_logical_bytes, '移除文件大小', viewer)}`].filter(Boolean).join(' · ');
    const name = ruleName(rule, g, viewer);
    const title = rule && !name ? `${step}（这条规则还没有中文名）` : [step, name].filter(Boolean).join(' ');
    return [title, counts, at(run.progress_at) && `${hm(run.progress_at)} 读到`, gap].filter(Boolean).join(' · ');
  }

  // 一轮里出错的项按件数从多到少：“规则中文名 · 原因 · N 项”；没有 failures 的旧回执返回 null，照旧只写件数（M328）
  function failures(run, viewer) {
    const list = Array.isArray(run?.failures) ? run.failures.filter(f => f && typeof f === 'object') : [];
    if (!list.length) return null;
    return list.map(f => ({ n: num(f.count) || 1, place: K.field(f.rule_name, '清理规则名称', viewer) || K.field(f.path_category, '清理位置', viewer) || '有一条规则', why: K.field(f.reason, '清理出错原因', viewer) || '没写原因' }))
      .sort((a, b) => b.n - a.n).map(f => ({ n: f.n, text: `${f.place} · ${f.why} · ${f.n} 项` }));
  }

  function tiles(g, viewer) {
    if (!g) return `<ul class="cl-tiles is-gray">${[['ok', '出错'], ['shield', '保护名单被删'], ['clock', '下次']].map(([i, k]) => `<li>${ICON[i]}<div><b>${k}</b><span class="cl-dash">—</span></div></li>`).join('')}</ul>`;
    const n = g.week.length, err = g.errors.length;
    // 最近出错那一轮写出原因：先露 3 条，其余收进“还有 N 项”（M328）
    const fails = err ? failures(g.errors[0], viewer) || [] : [], restFails = fails.slice(3);
    const failHtml = fails.slice(0, 3).map(f => `<span>${esc(f.text)}</span>`).join('') + (restFails.length ? `<details class="cl-fail-more" data-fold-count="${restFails.length}"><summary class="more live-disclosure"><span class="disclosure-closed">还有 ${restFails.reduce((n, f) => n + f.n, 0)} 项</span><span class="disclosure-open">收起</span> <span class="more__chev" aria-hidden="true">›</span></summary>${restFails.map(f => `<span>${esc(f.text)}</span>`).join('')}</details>` : '');
    const first = g.last?.result === 'warn' ? `<li data-tone="amber">${ICON.warn}<div><b>部分完成</b><span>${esc(K.field(g.last.error, '运行说明', viewer))}</span></div></li>`
      : err ? `<li data-tone="amber">${ICON.warn}<div><b>出错 ${err} 次</b><span>${esc(K.field(g.errors[0].error, '清理出错原因', viewer) || '最近一次出错没有写原因')}</span>${failHtml}</div></li>`
      : `<li>${ICON.ok}<div><b>出错 0 次</b>${g.week.some(r => r.result === 'warn') ? '' : `<span>近 7 天 ${n} 轮都跑完</span>`}</div></li>`;
    const hits = g.week.reduce((s, r) => s + (num(r.protected_hits) || 0), 0);
    const second = g.deleted ? `<li data-tone="red">${ICON.shield}<div><b>保护名单被删 ${g.deleted} 件</b><span>近 7 天 · 要马上看</span></div></li>`
      : `<li>${ICON.shield}<div><b>保护名单被删 0 件</b><span>近 7 天一直是 0${hits ? ` · 碰到保护名单 ${hits} 次，都跳过了` : ''}</span></div></li>`;
    const minutes = num(g.last?.duration_seconds) ?? (g.last && at(g.last.started_at) ? (at(g.last.finished_at) - at(g.last.started_at)) / 1000 : null);
    const lastNote = g.last ? `上次 ${hm(g.last.finished_at)} ${g.last.result === 'ok' ? '跑完' : '结束'}${minutes != null ? ` · 用时 ${Math.max(1, Math.round(minutes / 60))} 分钟` : ''}` : '';
    const nextAt = g.next ? new Date(g.next).toISOString() : '';
    const nextText = g.next ? `下次${g.estimated ? '约 ' : ' '}${U.date(nextAt) === U.date(new Date().toISOString()) || g.next - Date.now() < 18 * 3600000 ? hm(nextAt) : when(nextAt)}` : '下次';
    const runNote = g.running ? `<span class="task-result" data-state="running" data-result="running"><i class="task-dot" data-state="running" aria-hidden="true"></i>正在跑</span> · ${U.nowrap(hm(g.running.started_at))} 开始` : U.nowrap(lastNote);
    const nextNote = [runNote, ...[
      g.running && [progress(g.running, viewer, g), g.c.q === 'stale' && '旧读数'].filter(Boolean).join(' · '),
      g.estimated && `按上次结束加 ${g.hours} 小时估`,
      !g.running && g.last && g.hours && `超过 ${lateHours(g.hours)} 小时没跑完一轮就标“没按时跑”`].filter(Boolean).map(esc)].filter(Boolean).join('<br>');
    const third = `<li${g.estimated || !g.next ? ' data-tone="gray"' : ''}>${ICON.clock}<div><b>${esc(nextText)}</b>${g.next ? '' : '<span class="cl-dash">—</span>'}${nextNote ? `<span>${nextNote}</span>` : ''}</div></li>`;
    // 按需更新快核（M928）核法：E:/PCConfig/tools/auto_cleanup_conversations.py 的 preserve_quotes，现 Codex、Claude 清前确认原话已存，缺时补存并回读，通过才继续；变了改下方提示
    const kept = num(g.last?.skipped_unsaved_conversations);
    const firstTile = g.last ? first : `<li data-tone="gray">${ICON.ok}<div><b>出错</b><span class="cl-dash">—</span></div></li>`;
    const secondTile = g.last ? second : `<li data-tone="gray">${ICON.shield}<div><b>保护名单被删</b><span class="cl-dash">—</span></div></li>`;
    return `<ul class="cl-tiles">${firstTile}${secondTile}${third}</ul>${kept ? `<p class="cl-foot"><b>${kept} 个</b>原话没存完的对话先留着，存完再清</p>` : ''}`;
  }

  function rules(g, viewer) {
    const { visible, hidden } = K.splitRows(g?.last?.rules, viewer);
    const withheld = K.hiddenRows(hidden, '清理规则记录', '规则名称和删除量');
    const list = visible.filter(r => r.bytes_basis === 'removed_logical_bytes' && num(r.freed_bytes) > 0).sort((a, b) => b.freed_bytes - a.freed_bytes);
    if (!g?.last) return '<p class="cl-big cl-big--sm is-gray">—</p>';
    if (!list.length) return `<p class="cl-sub">${esc(withheld || (emptyRemoval(g.last) ? '最近一轮没有到期要删的。' : '最近一轮没有按规则确认的删除量。'))}</p>`;
    const sum = list.reduce((n, r) => n + r.freed_bytes, 0), name = r => ruleLabel(r, viewer);
    const row = (r, i) => `<li><i style="background:${RULE_HUES[Math.min(i, RULE_HUES.length - 1)]}"></i><span>${esc(name(r))}</span><b>${esc(K.size(r.freed_bytes))}</b></li>`;
    // 规则多时先列腾出最多的 5 条，其余收进“展开”，免得这一栏比右边的走势图长出一大截、右边空着（M503）
    const shown = list.length > 6 ? 5 : list.length, rest = list.slice(shown);
    const more = rest.length ? `<details class="cl-rules-more" data-fold-count="${rest.length}" data-key="rules-more"><summary class="more live-disclosure"><span class="disclosure-closed">展开（还有 ${rest.length} 条）</span><span class="disclosure-open">收起</span> <span class="more__chev" aria-hidden="true">›</span></summary><ul class="cl-rules">${rest.map((r, i) => row(r, i + shown)).join('')}</ul></details>` : '';
    return `<span class="cl-rulebar" role="img" aria-label="${esc(list.map(r => `${name(r)} ${K.size(r.freed_bytes)}`).join('，'))}">${list.map((r, i) => `<i style="width:${(r.freed_bytes / sum * 100).toFixed(2)}%;background:${RULE_HUES[Math.min(i, RULE_HUES.length - 1)]}"></i>`).join('')}</span><ul class="cl-rules">${list.slice(0, shown).map(row).join('')}</ul>${more}${withheld ? `<p class="cl-sub">${esc(withheld)}</p>` : ''}`;
  }

  // —— 各盘空闲走势：同一坐标，自己画一张 SVG（几条线、还没开始记、缺测斜线、清理那一下的绿点） ——
  // 横轴固定画到今天：近 30 天（历史满 45 天时近 60 天）。数据开始前那段写“还没开始记”，中间和末尾缺的画斜线写“没记录”。
  function trendData(d, g, now = Date.now()) {
    const vols = (d?.volumes || []).filter(v => K.letter(v) !== 'F');
    const runs = (g?.week || []).filter(r => at(r.started_at) && at(r.finished_at));
    const longest = Math.max(0, ...vols.map(v => { const p = (v.space_history?.points || []).filter(x => Number.isFinite(x?.[1])); return p.length ? (p.at(-1)[0] - p[0][0]) / 86400 : 0; }));
    const win = longest >= 45 ? 60 : 30, from = now - win * DAY, to = now;
    const series = [], stamps = new Set();
    for (const v of vols.sort(K.order)) {
      const id = K.letter(v);
      for (const p of v.space_history?.points || []) if (Number.isFinite(p?.[0])) stamps.add(p[0] * 1000);
      const pts = K.trail(v, d).filter(([t]) => t >= from && t <= to);
      const real = pts.filter(p => p[1] != null);
      if (real.length) series.push({ id, v, pts, color: K.hue(v), short: real.at(-1)[0] - real[0][0] < 3 * DAY });
    }
    if (!series.length) return null;
    const real = series.flatMap(s => s.pts.filter(p => p[1] != null).map(p => p[0]));
    const first = Math.min(...real), last = Math.max(...real);
    const gaps = [];
    for (const t of [...stamps].filter(t => t > first && t < last).sort((a, b) => a - b)) {
      if (series.every(s => s.pts.find(p => p[0] === t)?.[1] == null)) {
        const prev = gaps.at(-1);
        if (prev && Math.abs(prev[1] - t) < 1000) prev[1] = t + DAY; else gaps.push([t, t + DAY]);
      }
    }
    const tail = to - last > 1.5 * DAY ? [last, to] : null;
    if (tail) gaps.push(tail);
    const marks = [];
    for (const r of runs) for (const x of r.volumes || []) {
      const bytes = removalBytes(diskRemoval(r, x));
      if (!(bytes >= 50 * K.GiB) || !Number.isFinite(x.free_after) || !series.some(s => s.id === K.letter(x))) continue;
      marks.push({ id: K.letter(x), t: at(r.finished_at), v: x.free_after, bytes, partial: !removalComplete(r) });
    }
    return { series, from, to, win, last: tail ? last : null, before: first - from > DAY / 2 ? [from, first] : null,
      gaps: gaps.map(([a, b]) => [Math.max(a, from), Math.min(b, to)]).filter(([a, b]) => b > a), marks };
  }

  function ticks(max) {
    const unit = [1, K.KiB, K.MiB, K.GiB].findLast(n => n <= max) || 1;
    const steps = max >= K.TiB ? [256, 512, 1024, 2048, 4096, 8192] : [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 400, 512];
    const step = steps.map(n => n * unit).find(n => n * 4 >= max) || Math.ceil(max / (4 * unit)) * unit;
    const top = Math.max(step, Math.ceil(max / step) * step);
    return { top, list: Array.from({ length: top / step + 1 }, (_, i) => ({ n: i * step, text: i ? K.size(i * step) : '0' })) };
  }

  function trendReading(data, time) {
    const day = K.dayId(time);
    return data.series.flatMap(series => {
      const point = series.pts.filter(([t, n]) => n != null && K.dayId(t) === day)
        .reduce((best, p) => !best || Math.abs(p[0] - time) < Math.abs(best[0] - time) ? p : best, null);
      return point ? [{ series, point }] : [];
    });
  }

  function drawTrend(host, data) {
    if (!host) return;
    if (!data) { host.innerHTML = '<p class="cl-sub">各盘的空闲走势还没有记录。</p>'; return; }
    const W = Math.max(320, host.clientWidth || 720), H = 236, L = 64, R = 34, T = 30, B = 26;
    const x = t => L + (t - data.from) / (data.to - data.from) * (W - L - R);
    const max = Math.max(...data.series.flatMap(s => s.pts.map(p => p[1] ?? 0)));
    const ax = ticks(max * 1.04), y = n => T + (1 - n / ax.top) * (H - T - B);
    const svg = [`<svg class="cl-trend__svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="各盘空闲走势">`,
      '<defs><pattern id="cl-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="rgb(140 140 150 / .06)"/><line x1="0" y1="0" x2="0" y2="7" stroke="rgb(140 140 150 / .28)" stroke-width="2"/></pattern></defs>'];
    for (const tk of ax.list) svg.push(`<line class="cl-grid" x1="${L}" x2="${W - R}" y1="${y(tk.n).toFixed(1)}" y2="${y(tk.n).toFixed(1)}"/><text class="cl-ytxt" x="${L - 10}" y="${(y(tk.n) + 4).toFixed(1)}" text-anchor="end">${esc(tk.text)}</text>`);
    if (data.before) {
      const x0 = x(data.before[0]), x1 = x(data.before[1]);
      svg.push(`<rect class="cl-before" x="${x0.toFixed(1)}" y="${T}" width="${(x1 - x0).toFixed(1)}" height="${H - T - B}"/><line class="cl-start" x1="${x1.toFixed(1)}" x2="${x1.toFixed(1)}" y1="${T}" y2="${H - B}"/>`);
      const wide = x1 - x0 > 90;
      svg.push(`<text class="cl-gaptxt" x="${(wide ? (x0 + x1) / 2 : x0).toFixed(1)}" y="${wide ? (T + H - B) / 2 + 4 : T - 8}" text-anchor="${wide ? 'middle' : 'start'}">还没开始记</text>`);
    }
    for (const [a, b] of data.gaps) {
      const x0 = x(a), x1 = x(b);
      svg.push(`<rect x="${x0.toFixed(1)}" y="${T}" width="${(x1 - x0).toFixed(1)}" height="${H - T - B}" fill="url(#cl-hatch)"/>`);
      if (x1 - x0 > 46) svg.push(`<text class="cl-gaptxt" x="${((x0 + x1) / 2).toFixed(1)}" y="${T - 8}" text-anchor="middle">没记录</text>`);
    }
    const n = Math.max(2, Math.min(5, Math.floor((W - L - R) / 130)));
    for (let i = 0; i < n; i++) { const t = data.from + (data.to - data.from) * i / (n - 1); svg.push(`<text class="cl-xtxt" x="${x(t).toFixed(1)}" y="${H - 6}" text-anchor="${i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}">${esc(i === n - 1 ? '今天' : K.dayKey(t))}</text>`); }
    const ends = [], fresh = [];
    for (const s of data.series) {
      const real = s.pts.filter(p => p[1] != null), [lastAt, lastFree] = real.at(-1);
      if (s.short) {
        const byDay = new Map(real.map(p => [K.dayKey(p[0]), p]));
        byDay.forEach(([t, v]) => svg.push(`<circle class="cl-dot" cx="${x(t).toFixed(1)}" cy="${y(v).toFixed(1)}" r="3.6" fill="${s.color}"><title>${esc(`${K.volName(s.v)} ${K.dayKey(t)} 空闲 ${K.size(v)}`)}</title></circle>`));
        const [t0, v0] = real[0];
        fresh.push({ s, x: x(t0) - 8, y: y(v0) });
      } else {
        let path = '', pen = false;
        for (const [t, v] of s.pts) { if (v == null) { pen = false; continue; } path += `${pen ? 'L' : 'M'}${x(t).toFixed(1)} ${y(v).toFixed(1)}`; pen = true; }
        svg.push(`<path class="cl-line" d="${path}" stroke="${s.color}"><title>${esc(`${K.volName(s.v)} ${K.dayKey(lastAt)} 空闲 ${K.size(lastFree)}`)}</title></path>`);
      }
      if (!s.short) ends.push({ s, y: y(lastFree), x: x(lastAt) });
    }
    // 几个盘同一时候刚开始记、空闲又差不多时，“X 盘刚开始记”会叠在一起：横向挨着的往下错开一行，到底了整体往上收（M937）。
    fresh.sort((a, b) => a.y - b.y);
    fresh.forEach((f, i) => { for (const g of fresh.slice(0, i)) if (Math.abs(g.x - f.x) < 110) f.y = Math.max(f.y, g.y + 17); });
    const lift = fresh.length ? Math.max(0, Math.max(...fresh.map(f => f.y)) - (H - B - 4)) : 0;
    for (const f of fresh) svg.push(`<text class="cl-newtxt" x="${f.x.toFixed(1)}" y="${(f.y - lift + 4).toFixed(1)}" text-anchor="end" fill="${f.s.color}">${esc(`${K.letter(f.s.v)} 盘刚开始记`)}</text>`);
    ends.sort((a, b) => a.y - b.y);
    // 盘符贴着各自的线尾、互相不压。两条线的线尾几乎一样高（差不到 8px）时，两个字母左右并排、放在两条线尾中间那个高度；
    // 别的挨得近的合成一串。现在 13px 粗体的文字框实量 18px，按 21px 排开；
    // 整串不出图顶，最下面那个字母的底边留在底线上方 4px，不贴横轴日期（M1009）
    const gap = 21, floor = H - B - 13, slots = [];
    for (const e of ends) { const s = slots.at(-1); if (s && s.items.length === 1 && e.y - s.y < 8 && Math.abs(e.x - s.items[0].x) < 7 && K.letter(e.s.v) && K.letter(s.items[0].s.v)) { s.items.push(e); s.y = (s.y + e.y) / 2; } else slots.push({ items: [e], y: e.y }); }
    const runs = slots.map(s => ({ items: [s], at: s.y }));
    const place = r => { const n = r.items.length; r.at = Math.max(T, Math.min(floor - (n - 1) * gap, r.items.reduce((sum, s, i) => sum + s.y - i * gap, 0) / n)); };
    for (let merged = true; merged;) {
      merged = false; runs.forEach(place);
      for (let i = 1; i < runs.length && !merged; i++) if (runs[i].at < runs[i - 1].at + runs[i - 1].items.length * gap) { runs[i - 1].items.push(...runs.splice(i, 1)[0].items); merged = true; }
    }
    runs.forEach(r => r.items.forEach((s, i) => s.items.forEach((e, j) => { e.ly = r.at + i * gap; e.lx = Math.max(...s.items.map(item => item.x)) + j * 14; })));
    for (const e of ends) svg.push(`<text class="cl-end" x="${(e.lx + 8).toFixed(1)}" y="${(e.ly + 4).toFixed(1)}" fill="${e.s.color}">${esc(K.letter(e.s.v) || K.volName(e.s.v))}</text>`);
    const big = [...data.marks].sort((a, b) => b.bytes - a.bytes);
    big.forEach((m, i) => {
      const mx = x(m.t), my = y(m.v);
      svg.push(`<circle class="cl-mark" cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="4.5"/>`);
      if (i) return;
      const label = `自动清理${m.partial ? '至少' : ''}删除 ${K.size(m.bytes)}`, w = label.length * 12.5 + 8, px = Math.min(Math.max(L, mx - w + 14), W - R - w), py = Math.max(2, my - 32);
      svg.push(`<line class="cl-mark__stem" x1="${mx.toFixed(1)}" x2="${mx.toFixed(1)}" y1="${(py + 20).toFixed(1)}" y2="${(my - 5).toFixed(1)}"/><rect class="cl-mark__pill" x="${px.toFixed(1)}" y="${py.toFixed(1)}" width="${w.toFixed(1)}" height="20" rx="10"/><text class="cl-mark__txt" x="${(px + w / 2).toFixed(1)}" y="${(py + 14).toFixed(1)}" text-anchor="middle">${esc(label)}</text>`);
    });
    svg.push('<g class="cl-guide" aria-hidden="true"></g></svg>', '<div class="cl-hover" role="tooltip" hidden></div>');
    host.innerHTML = svg.join('');
    const plot = host.querySelector('svg'), tip = host.querySelector('.cl-hover'), guide = plot.querySelector('.cl-guide');
    function show(clientX) {
      const rect = plot.getBoundingClientRect();
      const pos = Math.max(L, Math.min(W - R, (clientX - rect.left) * W / rect.width));
      const t = data.from + (pos - L) / (W - L - R) * (data.to - data.from);
      const readings = trendReading(data, t);
      guide.innerHTML = `<line x1="${pos}" x2="${pos}" y1="${T}" y2="${H - B}"/>` +
        readings.map(({ series, point: [ts, value] }) => `<circle cx="${x(ts)}" cy="${y(value)}" r="4" fill="${series.color}"/>`).join('');
      tip.innerHTML = `<b>${esc(K.dayKey(t))}</b>` + (readings.length ? readings.map(({ series, point: [ts, value] }) =>
        `<span>${esc(K.volName(series.v))} 还剩 ${esc(K.size(value))} · ${esc(U.time(new Date(ts).toISOString()))}</span>`).join('') : '<span>这天没有读到空闲空间</span>');
      tip.hidden = false;
      tip.style.left = `${Math.max(0, Math.min(host.clientWidth - tip.offsetWidth, pos + 12))}px`;
    }
    U.pointing(plot, e => { host._hoverX = e.clientX; show(e.clientX); }, () => {
      host._hoverX = null; tip.hidden = true; guide.innerHTML = '';
    });
    if (host._hoverX != null) show(host._hoverX);
  }

  let lastTrend = null, observer = null;
  function render(d, viewer = 'public', withheld = '') {
    const card = document.getElementById('cleanup-card');
    if (!card) return;
    const g = digest(d);
    K.put(document.getElementById('cleanup-pill'), pill(g));
    // 按需更新快核（M928）核法：E:/PCConfig/registries/automatic_cleanup.json 的 rules[].days、protection、conversation_cleanup.main_body_days，现常见网站和 AI 临时目录 1 天、主对话正文 45 天。
    // 直删和回收站分别对照 automatic_cleanup.py 与 Invoke-RecycleBinCleanup.ps1。
    const note = [
      '每 6 小时和开机时各清一轮：登记过的缓存、临时目录、施工产物和旧 AI 对话到期直接删，不进回收站，删了找不回。',
      '回收站另算：每小时看一次，一般的东西留 7 天（G、H 盘也是 7 天），登记过的 AI 产物可以马上清，D 盘不动。',
    ].map(esc).join('<br>').replaceAll('登记过', '<span class="live-unit">登记过</span>');
    K.put(document.getElementById('cleanup-note'), note + (withheld ? ` · ${esc(withheld)}` : ''));
    K.put(document.getElementById('cleanup-total'), total(g, viewer));
    const hasDiskRemoval = Object.values(g?.last?.removed_by_volume || {}).some(row => removalBytes(row) != null);
    K.put(document.getElementById('cleanup-vols-k'), hasDiskRemoval ? '各盘 · 最近一轮腾出 / 现在还剩' : '各盘 · 现在还剩');
    K.put(document.getElementById('cleanup-vols'), volumes(d, g, viewer));
    K.put(document.getElementById('cleanup-tiles'), tiles(g, viewer));
    K.put(document.getElementById('cleanup-rules'), rules(g, viewer));
    const data = trendData(d, g);
    K.put(document.getElementById('cleanup-trend-k'), data ? `各盘空闲 · 近 ${data.win} 天${data.last ? ` · 读数截至 ${esc(K.dayKey(data.last))}` : ''}` : '各盘空闲');
    const host = document.getElementById('cleanup-trend');
    const key = JSON.stringify(data);
    if (key !== lastTrend?.key || host.clientWidth !== lastTrend?.w) { lastTrend = { key, w: host.clientWidth, data }; drawTrend(host, data); }
    if (!observer && typeof ResizeObserver === 'function') {
      observer = new ResizeObserver(() => { if (lastTrend && host.clientWidth !== lastTrend.w) { lastTrend.w = host.clientWidth; drawTrend(host, lastTrend.data); } });
      observer.observe(host);
    }
  }
  window.StorageCleanup = { render, digest, alarm, failures, trendData, ticks, trendReading };
})();
