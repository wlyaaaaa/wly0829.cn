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
    return draw && v && typeof v === 'object' && (m.id !== 'next_first_step' || viewer === 'owner') ? draw(v, stamp) : '';
  }
  function desktopNote(m, viewer, lower) {
    const v = m.value;
    if (!finite(v?.desktop) || m.private || [m, v].some(source => source.hidden || viewer !== 'owner' && (source.visibility === 'owner' || source.public === 'owner'))) return '';
    return `其中桌面操作 ${lower(m, 'desktop') || lower(v, 'desktop') ? '至少 ' : ''}${number(v.desktop)} 次`;
  }
  function codeCharacters(size, lower) {
    const n = size?.code_chars;
    if (!finite(n)) return '';
    const bounded = lower(size, 'code_chars'), tens = bounded ? Math.floor(n / 1000) / 10 : n / 10000;
    return `${bounded ? '至少' : '约'} ${tens.toFixed(1)} 万字符`;
  }
  function metricCadence(m) {
    const cadence = m?.cadence;
    const names = { live: '实时更新', sample: '定时测量', hourly: '每小时更新', daily: '每天更新', nightly: '每晚更新', weekly: '每周更新', monthly: '每月更新', manual: '手动更新', on_change: '变更时更新' };
    const text = Object.hasOwn(names, cadence) ? names[cadence] : typeof cadence === 'string' && /\p{Script=Han}/u.test(cadence) ? cadence : '';
    return text ? `<small class="pj-cadence">${e(text)}</small>` : '';
  }
  function weekly(data) {
    if (!data?.items?.length) return null;
    return { key: 'weekly-new', title: `这周新能办的事 · ${data.week.from} — ${data.week.to}`, html: data.items.map(it => `<p class="knowledge-prose">${link(it.href, it.change)}<small>可以这样说：${e(it.say)}</small></p>`).join('') };
  }
  function beforeAfter(data, stamp) {
    if (!data?.before?.length || !data.after?.length) return null;
    const rows = [...data.before, ...data.after], values = key => rows.map((r, i) => (key === 'before' ? i < data.before.length : i >= data.before.length) ? r.value == null ? null : r.value / 60 : null);
    return { key: 'before-after', title: data.title, html: paragraph(data.change), after: paragraph(data.skipped) + paragraph(data.note) + paragraph(`数据截至 ${stamp(data.as_of)}`), chart: { labels: rows.map(r => ({ text: r.date.slice(5), title: r.date })), values: { before: values('before'), after: values('after') } }, series: [{ id: 'before', label: '改前', hue: '#8b9690' }, { id: 'after', label: '改后', hue: '#00A650' }], unit: '分' };
  }
  function showcase(data, viewer, stamp) {
    if (viewer !== 'owner' || !data?.items?.length) return null;
    return { key: 'showcase', title: '可以拿来讲的作品', html: data.items.map(it => `<p class="knowledge-prose">${link(it.open, it.title)} · ${e(it.kind)}<small>${e(it.note)}</small></p>`).join('') + paragraph(data.gap) + paragraph(data.at && `数据截至 ${stamp(data.at)}`) };
  }
  function rulesLengthDelta(delta) {
    if (!delta || ![delta.charter, delta.topics, delta.total].every(finite)) return '';
    if (delta.total === 0) return '和上一版一样';
    const signed = n => n > 0 ? `+${number(n)}` : number(n);
    const change = delta.total > 0 ? '多' : '少';
    return `比上一版${change} ${number(Math.abs(delta.total))} 字（约法 ${signed(delta.charter)}，专题 ${signed(delta.topics)}）`;
  }
  const hasCorrectionHistory = data => data?.days?.length || data?.hook_days?.length;
  function rulesLength(rules) {
    return rules && [rules.charter, rules.topics, rules.total].every(finite) ? `开工要读的约法 ${number(rules.charter)} 字，专题 ${number(rules.topics)} 字，合计 ${number(rules.total)} 字` : '';
  }
  function rulesLengthReading(metric, history) {
    if (metric.id !== 'rules_length' || hasCorrectionHistory(history)) return '';
    const length = rulesLength(metric.value), comparison = length && rulesLengthDelta(metric.value.delta);
    return comparison ? `${metric.text || metric.value.text || length} · ${comparison}` : '';
  }
  function corrections(data, metrics, stamp, viewer) {
    if (!hasCorrectionHistory(data)) return null;
    const rules = metrics.find(m => m.id === 'rules_length')?.value, length = rulesLength(rules);
    const comparison = length && rulesLengthDelta(rules.delta);
    const messages = data.refresh === 'archive';
    const subject = viewer === 'owner' ? '你' : '本人';
    const beijingDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' });
    const todayCount = data.date === beijingDate.format(new Date()) && finite(data.total)
      ? `${data.status === 'partial' ? '至少 ' : ''}${number(data.total)} 句` : '今天的消息数还没读到';
    const html = (messages ? paragraph(todayCount) : '') + paragraph([length, comparison].filter(Boolean).join(' · '));
    const dates = [...new Set([...(data.days || []).map(r => r.date), ...(data.hook_days || []).map(r => r.date)])].sort();
    const daily = (rows, key) => dates.map(date => rows?.find(r => r.date === date)?.[key] ?? null);
    const releases = date => (data.rule_releases || []).filter(r => r.at && r.basis === 'pointer_activated_at' && beijingDate.format(new Date(r.at)) === date).map(r => r.version).join('、');
    const labels = dates.map((date, i) => {
      const version = releases(date);
      const tick = i === 0 || i === dates.length - 1 || (i % 7 === 0 && i < dates.length - 3);
      return { text: tick ? date.slice(5) : '', title: `日期 ${date}${version ? ` · 生效 ${version}` : ''}` };
    });
    const quality = rows => dates.map(date => rows?.find(r => r.date === date)?.complete === false ? 'partial' : 'ok');
    return {
      key: 'rule-effect', title: messages ? `今天${subject}跟 AI 说了几句` : '规矩管不管用', html,
      after: paragraph('拦截按记录项次计，同一动作可能记多项。') + paragraph(data.hook_bad_lines ? `有 ${data.hook_bad_lines} 行拦截记录损坏，次数不完整` : '') + paragraph(data.observed_at && `数据截至 ${stamp(data.observed_at)}`),
      chart: { labels, values: { corrections: daily(data.days, 'total'), hooks: daily(data.hook_days, 'total') }, quality: { corrections: quality(data.days), hooks: quality(data.hook_days) } },
      series: [
        { id: 'corrections', label: messages ? '每天说的话（句）' : '本人纠正', unit: messages ? '句' : '次', hue: '#00A650' },
        { id: 'hooks', label: messages ? '被拦记录（次）' : '被拦记录', hue: '#8b9690' },
      ], unit: '次', axisUnit: messages ? '' : undefined,
    };
  }
  function external(data, stamp) {
    if (!data?.reachability?.length && !data?.expirations?.length) return null;
    const names = { home: '首页', live: '实况首页', cv: '简历链接' };
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
  function skillUsageSummary(data, href, stamp) {
    const byName = new Map((data.items || []).map(row => [row.name || row.label, row]));
    return [7, 30].map(days => {
      const top = data[`top${days}`] ?? (Array.isArray(data.items) ? [...byName].map(([name, row]) => ({ name, count: row[`d${days}`] })).filter(row => row.count > 0).sort((a, b) => b.count - a.count) : null);
      const rows = top?.slice(0, 5).map(({ name, count }) => {
        const row = byName.get(name);
        const claude = recorded(row?.[`claude_d${days}`], ' 次'), codex = recorded(row?.[`codex_d${days}`], ' 次');
        const agy = row?.[`antigravity_d${days}`];
        return `<li class="pj-kv__row"><span class="pj-kv__k">${e(name)}</span><span class="pj-kv__v"><b>${recorded(count, ' 次')}</b><small>Claude ${claude} · Codex ${codex} · Antigravity ${agy == null ? noRecord : `至少 ${recorded(agy, ' 次')}`}</small></span></li>`;
      });
      return `<div><p class="pj-skill-period">近 ${days} 天</p>${rows?.length ? `<ul class="pj-kv">${rows.join('')}</ul>` : paragraph(top == null ? noRecord : '0 项')}</div>`;
    }).join('') + paragraph(`数据截至 ${data.at ? stamp(data.at) : noRecord}`) +
      `<a class="more more--link" href="${e(href)}">全部技能 <span class="more__chev">›</span></a>`;
  }
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
    if (card.key !== 'rule-effect') {
      html(block.viz, card.html + (card.chart ? '<div style="overflow-x:auto"><div data-addition-chart style="min-width:0px"></div></div>' : '') + (card.after || ''));
      if (card.chart) bars(block.viz.querySelector('[data-addition-chart]'), options).set(card.chart);
      return;
    }
    // LiveUI.html 会递归对照子节点，说明和图分开更新才能保住柱图实例。
    html(block.viz, '<div data-rule-effect-before></div><div data-addition-chart="rule-effect"></div><div data-rule-effect-after></div>');
    const host = block.viz.querySelector('[data-addition-chart="rule-effect"]');
    html(block.viz.querySelector('[data-rule-effect-before]'), card.html);
    html(block.viz.querySelector('[data-rule-effect-after]'), card.after);
    if (block.additionChart?.host !== host) block.additionChart = { host, viz: bars(host, options) };
    const chart = block.additionChart, data = JSON.stringify(card.chart);
    if (chart.data !== data) {
      chart.viz.set(card.chart);
      chart.data = data;
    }
  }
  window.ProjectAdditions = { timestampObject, lowerBoundValue, structuredMetric, desktopNote, codeCharacters, metricCadence, measurementColumns, measurementCell, measurementRows, rulesLengthReading, render, deviceColumns, hasDevices, deviceCell, recorded, hasSkillUsage, skillUsageSummary,
    cards: (id, proj, viewer, source, stamp) => [batchProgress(source.batches, id, stamp), id === 'agents' && weekly(source.weekly), id === 'timeaudit' && beforeAfter(source.beforeAfter, stamp), id === 'career-development' && showcase(proj.showcase, viewer, stamp), id === 'agents' && corrections(source.corrections, (proj.sections || []).flatMap(s => s.metrics || []), stamp, viewer), id === 'wly0829.cn' && external(source.external, stamp), id === 'pcconfig' && software(source.software, stamp)].filter(Boolean),
  };
})();
