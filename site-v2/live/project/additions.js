// 第十批项目卡：各块独立，删除对应函数与 cards 中的一处调用即可撤掉。
(() => {
  'use strict';
  const U = window.LiveUI, e = U.esc, finite = Number.isFinite;
  const number = n => n.toLocaleString('zh-CN', { maximumFractionDigits: 2 });
  const paragraph = text => text ? `<p class="pj-note">${e(text)}</p>` : '';
  const link = (href, label) => href && /^(https?:\/\/|\/(?!\/))/.test(href) ? `<a href="${e(href)}">${e(label)}</a>` : e(label);
  function timestampObject(m, stamp) {
    const entries = m.value && typeof m.value === 'object' && !Array.isArray(m.value) ? Object.entries(m.value) : [];
    return entries.length && entries.every(([, v]) => typeof v === 'string' && /^\d{4}-\d\d-\d\dT/.test(v) && finite(Date.parse(v))) ? entries.map(([k, v]) => `${k} ${stamp(v)}`).join(' · ') : '';
  }
  function lowerBoundValue(m) { const n = typeof m.value === 'number' ? m.value : m.value?.value; return (m.lower_bound || m.at_least || m.isPartial || m.value?.lower_bound || m.value?.at_least || m.value?.isPartial) && finite(n) ? `至少 ${number(n)}` : ''; }
  function describe(v, spec, stamp) {
    const state = { uploaded_only: '素材已传，公网还没切', healthy: '正常', complete: '完整', completed: '完成', success: '成功', ok: '正常', ready: '就绪', unavailable: '不可用', failed: '没成', rclone_checksum_check: '校验和核对', selected_files_excluding_file_warnings: '选定文件（不含告警文件）', per_file_verified_not_point_in_time: '逐文件核验，不是同一时刻快照', not_tested: '未试' };
    return Object.entries(spec).filter(([k]) => v[k] != null).map(([k, label]) => `${Array.isArray(label) ? label[0] : label}：${typeof v[k] === 'boolean' ? v[k] ? label[1] : label[2] : state[v[k]] || (typeof v[k] === 'number' ? number(v[k]) : /^\d{4}-\d\d-\d\dT/.test(v[k]) ? stamp(v[k]) : v[k])}`).join(' · ');
  }
  function recoverySet(v, stamp) { return describe(v, { complete: ['恢复组合', '完整', '不完整'], asset_count: '资产数', G_readback_verified: ['G 盘回读', '已核', '没核'], private_git_readback_verified: ['私有 Git 回读', '已核', '没核'], H_set_readback_verified: ['H 盘组合回读', '已核', '没核'], H_pointer_readback_verified: ['H 盘指针回读', '已核', '没核'] }, stamp); }
  function archiveCopies(v, stamp) { return describe(v, { hot_status: '热副本', cold_status: '冷副本', same_generation: ['两份代数', '一致', '不一致'], hot_readback_verified: ['热副本回读', '已核', '没核'], cold_readback_verified: ['冷副本回读', '已核', '没核'], coverage_complete: ['覆盖', '完整', '不完整'], omitted_file_count: '漏掉文件', hot_file_count: '热副本文件', cold_file_count: '冷副本文件', hot_completed_at: '热副本完成', cold_completed_at: '冷副本完成' }, stamp); }
  function cloudCopy(v, stamp) { return describe(v, { status: '副本', collection_status: '收取', verification_status: '核对', file_count: '文件数', verification_scope: '核对范围' }, stamp); }
  function fileService(v, stamp) { return describe(v, { status: '文件服务', persistence_ready: ['任务落盘', '已就绪', '未就绪'], busy: ['正在处理', '是', '否'], active_job_status: '当前任务', queue_length: '排队任务', gpu_conflict_count: '显卡冲突' }, stamp); }
  function serviceReadiness(v, stamp) { return describe(v, { ok: ['文字识别服务', '正常', '异常'], readiness: '服务就绪', gpu_status: '显卡', active_jobs_count: '正在处理任务' }, stamp); }
  function readingGaps(v, stamp) { return describe(v, { affected_categories: '缺口影响类别' }, stamp); }
  function freezeRetention(v, stamp) { return describe(v, { retained: '现场保留份数', week: '本周份数', partial: '不完整份数' }, stamp); }
  function nextFirstStep(v, stamp) { return describe(v, { text: '第一步', material: '使用材料', minutes: '约几分钟', updated_at: '更新于' }, stamp); }
  function credentialUpdates(v, stamp) { return describe(v, { expired: '已过期', expiring_within_14_days: '14 天内到期', reported_update_required: '已报告需更新', requires_credential_update: ['凭据需更新', '是', '否'] }, stamp); }
  function captureBoundary(v, stamp) { return describe(v, { skipped_file_count: '跳过文件', changed_after_capture_count: '采集后变化文件', capture_consistency: '快照口径', application_recovery: '应用恢复' }, stamp); }
  const extraMetrics = { recovery_set: recoverySet, archive_copies: archiveCopies, config_cloud: cloudCopy, wechat_cloud: cloudCopy, file_service: fileService, service_readiness: serviceReadiness, reading_gaps: readingGaps, freeze_retention: freezeRetention, next_first_step: nextFirstStep, credential_updates: credentialUpdates, capture_boundary: captureBoundary };
  function pipeline(v, stamp) { return describe(v, { capture_state: '采集', capture_until: '采集到', pending_events: '待写事件', write_failures: '写入失败', ingest_state: '入库', ingest_at: '入库时间', pending_files: '待入库文件', pending_bytes: '待入库字节', error_kind: '错误类别', export_at: '出数时间' }, stamp); }
  function replica(v, stamp) { return describe(v, { status: '副本状态', completed_at: '完成于', verified_files: '核对文件', retained_generations: '保留代数' }, stamp); }
  function publishAttempt(v, stamp) { return describe(v, { status: '发布状态', completed_at: '完成于', total_seconds: '耗时（秒）' }, stamp); }
  function catalogCoverage(v, stamp) { return describe(v, { listed_projects: '清单项目', listed_entries: '清单条数', measured_projects: '实测项目' }, stamp); }
  function workerHealth(v, stamp) { return describe(v, { last_successful_cycle_at: '最近成功一轮', blocked_reason: '阻塞原因', recovery: '恢复记录', failed_window_actions: '窗口操作失败' }, stamp); }
  function inventoryProgress(v, stamp) { return describe(v, { completed_sources: '已完成来源', attempted_sources: '尝试来源', capped_sources: '触顶来源', root_errors: '根目录错误' }, stamp) + (v.capped_sources > 0 ? ' · 文件总量为至少值' : ''); }
  const baseMetrics = { pipeline: pipeline, replica: replica, publish_attempt: publishAttempt, catalog_coverage: catalogCoverage, worker_health: workerHealth, inventory_progress: inventoryProgress };
  function structuredMetric(m, stamp, viewer) {
    const draw = baseMetrics[m.id] || extraMetrics[m.id], v = m.value;
    // 最近一次发布：后台给了人话（publish_attempt.text，如“已上传素材，网站还没上线这版；…；用时 16 分 57.35 秒”）就照后台写，原始秒数只留作计算
    if (m.id === 'publish_attempt' && typeof m.text === 'string' && m.text.trim()) return m.text.trim();
    return draw && v && typeof v === 'object' ? draw(v, stamp) : '';
  }
  function desktopNote(m, viewer, lower) {
    const v = m.value;
    if (!finite(v?.desktop) || m.private || [m, v].some(source => source.hidden || viewer !== 'owner' && (source.visibility === 'owner' || source.public === 'owner'))) return '';
    return `其中桌面操作 ${lower(m, 'desktop') || lower(v, 'desktop') ? '至少 ' : ''}${number(v.desktop)} 次`;
  }
  const personalDetailIds = new Set([
    'daily-preferences', 'career-development', 'personal-finance', 'personal-health',
    'personal-media', 'personal-materials', 'personal-romance', 'personal-formal-documents',
    'timeaudit', 'phone-collector', 'wechatdirect', 'steam-millennium-config-backup',
    'work-delivery-copilot', 'emerald-veil', 'typora-theme-pack', 'wlyaaaaa',
  ]);
  const personalDetail = id => personalDetailIds.has(id);
  function metricCadence(m, id, arrow = '') {
    const cadence = m?.cadence, seconds = m?.refresh_seconds;
    if (!personalDetail(id)) {
      const hasInterval = Number.isFinite(seconds) && seconds > 0;
      const minutes = hasInterval && Number((seconds / 60).toFixed(2));
      if (cadence === 'completion') {
        return `${arrow}<small class="pj-cadence">每次做完才更新</small>`;
      }
      if (hasInterval && cadence === 'sample') {
        const measured = seconds === 60 ? '每分钟量一次' : seconds < 60 ? `每 ${seconds} 秒量一次` : `每 ${minutes} 分钟量一次`;
        return `${arrow}<small class="pj-cadence">${e(measured)}</small>`;
      }
      if (hasInterval && !cadence) {
        return `${arrow}<small class="pj-cadence" title="网页每 ${minutes} 分钟刷新一次，内容不一定变">每 ${minutes} 分钟刷新</small>`;
      }
    }
    const names = { live: '实时更新', sample: '定时测量', hourly: '每小时更新', daily: '每天更新', nightly: '每晚更新', weekly: '每周更新', monthly: '每月更新', manual: '手动更新', on_change: '变更时更新' };
    const text = Object.hasOwn(names, cadence) ? names[cadence] : typeof cadence === 'string' && /\p{Script=Han}/u.test(cadence) ? cadence : '';
    return arrow + (text ? `<small class="pj-cadence">${e(text)}</small>` : '');
  }
  function weekly(data) {
    if (!data?.items?.length) return null;
    return { key: 'weekly-new', title: `这周新能办的事 · ${data.week.from} — ${data.week.to}`, html: data.items.map(it => `<p class="knowledge-prose">${link(it.href, it.change)}<small>可以这样说：${e(it.say)}</small></p>`).join('') };
  }
  // 电脑心电图“11-15 那批采集修复前后”那张卡拿掉了（前端手写、一次性，本人 11-25 选 A）。
  // 私塾“可以拿来讲的作品”只留作品和链接：后台手写的说明里全是写死、不会更新的数，连同“数据截至”那行都不摆（本人 11-25 选 A）。
  function showcase(data) {
    if (!data?.items?.length) return null;
    return { key: 'showcase', title: '可以拿来讲的作品', html: data.items.map(it => `<p class="knowledge-prose">${link(it.open, it.title)}${it.kind ? ` · ${e(it.kind)}` : ''}</p>`).join('') };
  }
  function rulesLengthDelta(delta) {
    if (!delta || ![delta.charter, delta.topics, delta.total].every(finite)) return '';
    if (delta.total === 0) return '和上一版一样';
    const signed = n => n > 0 ? `+${number(n)}` : number(n);
    const change = delta.total > 0 ? '多' : '少';
    return `比上一版${change} ${number(Math.abs(delta.total))} 字（约法 ${signed(delta.charter)}，专题 ${signed(delta.topics)}）`;
  }
  function rulesLength(rules) {
    return rules && [rules.charter, rules.topics, rules.total].every(finite) ? `开工要读的约法 ${number(rules.charter)} 字，专题 ${number(rules.topics)} 字，合计 ${number(rules.total)} 字` : '';
  }
  function rulesLengthReading(metric) {
    if (metric.id !== 'rules_length') return '';
    const length = rulesLength(metric.value), comparison = length && rulesLengthDelta(metric.value.delta);
    return comparison ? `${metric.text || metric.value.text || length} · ${comparison}` : '';
  }
  // 规则仓项目页原来的“技能使用”“今天你跟 AI 说了几句”两块搬到智能体页（本人 11-24 02:45 选 B），这里只留一行链过去，带今天的两个数。
  // 被拦不提：本人 03:00 取消了“AI 被拦”那块（拦下次数里多少是真违规、多少是检查太宽没人核过）。
  function agentsMoved(talk, metrics, viewer) {
    const subject = viewer === 'owner' ? '你' : '本人';
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date());
    // 还没读到时写“正在读”，读到的不是今天的写“还没量到”，不写成一句没有数的“今天你说了几句”
    const said = talk?.date === today && finite(talk.total) ? `今天${subject}说了 <b>${talk.status === 'partial' ? '至少 ' : ''}${number(talk.total)}</b> 句` : talk ? `今天${subject}说了几句还没量到` : `正在读今天${subject}说了几句`;
    const week = ['claude', 'codex', 'antigravity'].map(host => metrics.find(m => m.id === `${host}_d7`));
    const known = week.filter(m => finite(m?.value));
    // Antigravity 只记得到能核实的技能原文件读取，三家合起来一律写“至少”
    const used = known.length ? `近 7 天三家用技能 <b>${known.length < 3 || week[2] ? '至少 ' : ''}${number(known.reduce((n, m) => n + m.value, 0))}</b> 次` : '近 7 天三家用了多少技能';
    return {
      key: 'agents-moved', title: '',
      head: `<a class="pj-moved-head" href="/live/agents/">三家用技能、跟${subject}说了几句，都在智能体页&nbsp;<span class="more__chev">›</span></a>`,
      html: `<p class="pj-moved-line"><a href="/live/agents/#talk">${said}&nbsp;<span class="more__chev">›</span></a><span aria-hidden="true">·</span><a href="/live/agents/#skills-used">${used}&nbsp;<span class="more__chev">›</span></a></p>`,
    };
  }
  function external(data, stamp) {
    if (!data?.reachability?.length && !data?.expirations?.length) return null;
    const names = { home: '首页', live: '实况首页', cv: '专用链接' };
    const rows = (data.reachability || []).filter(r => names[r.id]).map(r => `${names[r.id]}：${r.success === true ? '打开成功' : r.success === false ? '没打开' : '没有记录'}${r.seconds == null ? '' : ` · ${number(r.seconds)} 秒`}${r.at ? ` · ${stamp(r.at)}` : ''}${r.q === 'partial' ? ' · 近 24 小时样本还没攒满' : ''}`);
    rows.push(...(data.expirations || []).map(r => `${r.host} ${r.kind === 'domain' ? '域名' : '证书'}：${r.expires_at ? stamp(r.expires_at, 'date') : '没有记录'}${r.remaining_days == null ? '' : ` · 还剩 ${number(r.remaining_days)} 天`}`));
    return { key: 'external', title: '外网打不打得开', html: rows.map(paragraph).join('') + paragraph('本机经公网路径最近一次检查。') };
  }
  const noRecord = '没有记录';
  const recorded = (value, unit = '') => value == null ? noRecord : `${number(value)}${unit}`;
  const deviceColumns = [{ id: 'secondary_laptop', label: '笔记本' }, { id: 'phone', label: '手机' }];
  const hasDevices = rows => rows.some(r => r.devices != null);
  function deviceCell(row, key, stamp) {
    const device = row.devices?.[key];
    const last = device?.last_success_at ? `<small>上次读到 ${e(stamp(device.last_success_at).slice(-11))}</small>` : '';
    const app = key === 'phone' && row.name === 'Claude 桌面版' ? '<small>（Claude 手机应用）</small>' : '';
    return e(device?.version ?? noRecord) + last + app;
  }
  function softwareTable(rows, stamp) {
    const headers = ['软件', '台式机', ...deviceColumns.map(c => c.label)];
    return `<table class="pj-device-table"><thead><tr>${headers.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => {
      const installed = r.installed_or_updated_on ? stamp(r.installed_or_updated_on, 'date') : noRecord;
      const cells = [e(r.version ?? noRecord) + `<small>安装或更新：${e(installed)}</small>`, ...deviceColumns.map(c => deviceCell(r, c.id, stamp))];
      return `<tr><th scope="row">${e(r.name)}</th>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
    }).join('')}</tbody></table>`;
  }
  function software(data, stamp) {
    if (!data?.items?.length) return null;
    if (hasDevices(data.items)) return { key: 'software-versions', title: '日用工具现在在用哪一版', html: softwareTable(data.items, stamp) + paragraph(data.at && `数据截至 ${stamp(data.at)}`) + paragraph(data.gap) };
    return { key: 'software-versions', title: '日用工具现在在用哪一版 · 台式机', html: data.items.map(r => `<p class="knowledge-prose">${e(r.name)} · ${e(r.version ?? '没有记录')}<small>安装或更新：${e(r.installed_or_updated_on ? stamp(r.installed_or_updated_on, 'date') : '没有记录')}</small></p>`).join('') + paragraph(data.at && `数据截至 ${stamp(data.at)}`) + paragraph(data.gap) + paragraph('只采到了台式机，笔记本和手机还没采到') };
  }
  const hasSkillUsage = data => !!data && (['top7', 'top30', 'unrecorded30'].some(key => Object.hasOwn(data, key)) || data.items?.some(row => 'antigravity_d30' in row));
  function batchProgress(data, id, stamp) {
    const items = data?.items?.filter(it => it.project === id) || [], n = value => value == null ? '没有记录' : number(value);
    return items.length ? { key: 'batch-progress', title: '这一批处理到哪了', html: items.map(it => paragraph(`${it.name}：已完成 ${n(it.done)}／共 ${n(it.total)} · 还剩 ${n(it.remaining)} · 每分钟 ${n(it.rate_per_min)} · 预计完成 ${it.eta_at ? stamp(it.eta_at) : '没有记录'} · 正在干 ${it.current ?? '没有记录'}`) + paragraph([it.updated_at && `数据截至 ${stamp(it.updated_at)}`, it.gap].filter(Boolean).join(' · '))).join('') } : null;
  }
  function measurementColumns(data) {
    return Array.isArray(data?.columns) ? data.columns.filter(c => ['text', 'state_text', 'at', 'material_seconds', 'ai_confirmation_upper_seconds'].includes(c.key)) : [];
  }
  function measurementCell(row, key, stamp) {
    return key === 'at' ? row[key] ? stamp(row[key]) : '没有记录' : row[key] == null ? '没有记录' : typeof row[key] === 'number' ? number(row[key]) : row[key];
  }
  function measurementRows(data, stamp) {
    const columns = measurementColumns(data);
    if (!columns.length) return null;
    return (data.items || []).map((r, i) => ({ key: r.id || `measurement-${i}`, cls: 'row row--flat', html: `<span></span><div class="row__text">${columns.map(c => `<p class="row__sub">${e(c.label)}：${e(measurementCell(r, c.key, stamp))}</p>`).join('')}</div>` }));
  }
  function render(card, block, html, bars) {
    const options = { unit: card.unit, axisUnit: card.axisUnit, series: card.series, missingText: '—' };
    if (card.head) html(block.head, card.head);
    html(block.viz, card.html + (card.chart ? '<div style="overflow-x:auto"><div data-addition-chart style="min-width:0px"></div></div>' : '') + (card.after || ''));
    if (card.chart) bars(block.viz.querySelector('[data-addition-chart]'), options).set(card.chart);
  }
  window.ProjectAdditions = { timestampObject, lowerBoundValue, structuredMetric, desktopNote, personalDetail, metricCadence, measurementColumns, measurementCell, measurementRows, rulesLengthReading, render, deviceColumns, hasDevices, deviceCell, recorded, hasSkillUsage,
    cards: (id, proj, viewer, source, stamp) => [batchProgress(source.batches, id, stamp), id === 'agents' && weekly(source.weekly), id === 'career-development' && showcase(proj.showcase), id === 'agents' && agentsMoved(source.corrections, (proj.sections || []).flatMap(s => s.metrics || []), viewer), id === 'wly0829.cn' && external(source.external, stamp), id === 'pcconfig' && software(source.software, stamp)].filter(Boolean),
  };
})();
