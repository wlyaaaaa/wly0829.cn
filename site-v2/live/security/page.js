// 组件清单和审计分开看；普通路径异常不推断为仿冒。
(() => {
  'use strict';
  const V = window.LiveViz, C = window.LiveChart, D = window.LiveDetail, U = window.LiveUI, S = window.LiveStat, sync = C.sync();
  const missing = () => U.offline?.() ? '这块没存下来，连上后补上。' : U.collectionText();
  const fmt = (v, unit) => C.value(v, unit) ?? missing();
  const audits = [['elevated', '提权启动'], ['crashes', '非零退出'], ['short_lived', '不到 5 秒即退出'], ['lolbins', '脚本和系统工具调用'], ['silent', '后台外联'], ['destinations', '外联目的地类别'], ['services', 'svchost 服务对应'], ['lineage', '命令解释器启动关系'], ['sensitive', '凭据窗口期后台活动']];
  const statusNames = new Map([['protection', '防护状态'], ['impersonation', '程序身份筛查']]);
  let data = null, initial = true;
  const stamp = at => at ? [U.date(at), U.time(at)].filter(Boolean).join(' ') : '';
  const windowText = (w, registry = false) => registry ? ['现存进程登记（含历史）', w?.to && `截至 ${stamp(w.to)}`].filter(Boolean).join(' · ')
    : w?.from && w.to ? `${stamp(w.from)} 至 ${stamp(w.to)}` : w?.to ? `截至 ${stamp(w.to)}` : '';
  function countBasis(basis, detail = false) {
    if (!basis) return '';
    const count = detail ? basis.count : basis;
    const kinds = { elevated_start_events: '按匹配启动行数算', nonzero_exit_events_joined_registry: detail ? '按已列程序的非零退出事件计数' : '按匹配的非零退出事件计数', nonzero_exit_events: '按统计面板记录的非零退出事件计数',
      svchost_registry_rows_with_service_name: '按已列服务的登记条数算', nonpositive_signature_or_core_name_outside_windows: '按已列组件的登记条数算',
      activity_samples_with_flagged_remote_ports: '按活动测量次数算', unsigned_activity_during_sensitive_focus_above_resource_threshold: '按活动测量次数算' };
    return U.sp(count?.label) || kinds[basis.kind] || ({ distinct_process_keys: '按去重后的进程身份算', registry_rows: '按现存登记条数算（含历史）', events: basis.source === 'stat_panel' ? '按统计面板记录的事件计数' : '按事件条数算', matching_rows_per_program_in_returned_groups: '按已列程序的匹配行数算' })[count?.aggregation] || '';
  }
  const countUnit = (basis, unit) => ({ distinct_process_keys: '个进程身份', registry_rows: '条' })[basis?.aggregation] || unit;
  const figure = (key, label, unit = '次') => S.figure({ key, label, value: data?.summary?.[key], unit: countUnit(data?.summary?.count_basis?.[key], unit) }, data?.summary, key);
  function headline(d, legacy, basisNode) {
    const s = { ...legacy, ...d?.summary }, fields = [['crashes', '非零退出', '次'], ['elevated', '提权', '次'], ['impersonation', '系统进程名路径异常登记', '条'], ['unsigned', '未签名进程', '个']];
    const known = fields.filter(([key]) => s[key] != null).slice(0, 2).map(([key, label, unit]) => {
      const basis = s.count_basis?.[key], w = basis?.window ?? s.windows?.[key];
      return { label, text: `${label} ${S.text(s, key)} ${countUnit(basis, unit)}`, basis, w, period: windowText(w, w?.from === null && ['impersonation', 'unsigned'].includes(key)) };
    });
    const common = known[0]?.w, shared = common?.from && common.to && known.every(({ w }) => w?.from === common.from && w.to === common.to);
    if (basisNode) {
      const lines = known.map(({ label, basis, period }) => {
        const line = [countBasis(basis), !shared && period].filter(Boolean).join(' · ');
        return line && `${label}：${line}`;
      });
      if (known.some(({ basis }) => basis?.mode === 'matching_activity_not_confirmed_incidents')) lines.push('命中活动不等于已确认入侵');
      basisNode.textContent = lines.filter(Boolean).join('；'); basisNode.hidden = !basisNode.textContent;
    }
    const period = shared ? U.sp(common.label) || windowText(common) : '';
    return known.length ? [period, ...known.map(({ text }) => text)].filter(Boolean).join('，') : d?.text || missing();
  }
  // 页头结论：只有“已确认异常 0 组”才说没发现；要核实的、这次没读到的组跟在后面。
  function conclusion(g) {
    const confirmed = g.confirmed?.length ?? 0, review = g.review || [], unread = g.unread || [];
    const programs = review.filter(x => /impersonation/.test(x.key || '') && Number.isInteger(x.programs)).reduce((n, x) => n + x.programs, 0);
    return [confirmed ? `已确认异常 ${confirmed} 组` : '没发现确认的异常',
      review.length && `${review.length} 组要核实${programs ? `（${programs} 个程序待筛查）` : ''}`,
      unread.length && `${unread.length} 组读数暂缺`].filter(Boolean).join('，');
  }
  function serviceRows(rows) {
    const merged = new Map();
    for (const r of rows) {
      const name = [r.name, U.sp(r.category).replace(/\s*·\s*已签名$/, '')].filter(Boolean).map(U.sp).join(' · '), old = merged.get(name);
      if (!old) { merged.set(name, { ...r, name }); continue; }
      const partial = old.count == null || r.count == null || S.partial(old, 'count') || S.partial(r, 'count');
      merged.set(name, { ...old, count: old.count == null && r.count == null ? null : (old.count ?? 0) + (r.count ?? 0), ...(partial ? { q: 'partial', partial: ['count'], gap: old.gap || r.gap || (U.offline?.() ? '部分服务计数未存全' : U.collectionText("有服务次数")) } : {}) });
    }
    return [...merged.values()];
  }
  // 后台把一个程序的各条线索拼成一长串（“无签名；ℹ 可疑运行特征；父程序 未知；签名校验异常；…”）。
  // 拆开去重：原因合成一句，启动它的程序另列。
  function categoryNote(category) {
    const parts = category.split('；').map(t => t.replace(/^ℹ\s*/, '').trim()).filter(Boolean);
    const parents = [...new Set(parts.filter(t => t.startsWith('父程序')).map(t => t.replace(/^父程序\s*/, '')))];
    const traits = [...new Set(parts.filter(t => !t.startsWith('父程序')))];
    const shown = parents.slice(0, 6);
    return [traits.join('、'), shown.length && `启动它的程序：${shown.join('、')}${parents.length > shown.length ? ` 等 ${parents.length} 个` : ''}`].filter(Boolean).join(' · ');
  }
  // 签名与路径待核线索：一行一个程序，程序名在上，它的原因在下一行小字。
  function clueRows(c) {
    const rows = c.rows.map((r, i) => {
      const source = c.source[i], raw = U.sp(source.category).replace(/\s*[（(]\s*[)）]/g, '');
      const why = raw.includes('；') ? categoryNote(raw) : raw;
      const when = source.window && windowText(source.window, true);
      return `<li><span class="vz-audit__t">${U.esc(r.time)}</span><span>${U.esc(U.sp(source.name))}${when && when !== c.period ? `<small class="stat-gap">${U.esc(when)}</small>` : ''}${why ? `<small class="stat-gap security-clue-why">${U.esc(why)}</small>` : ''}</span><span class="vz-audit__c">${r.count == null ? '' : `${U.esc(S.text(source, 'count'))} ${c.unit}`}</span></li>`;
    });
    return rows.slice(0, 10).join('') + (rows.length > 10 ? `<li class="security-audit-group"><details><summary class="more">展开（还有 ${rows.length - 10} 条）</summary><ul class="vz-audit__rows">${rows.slice(10).join('')}</ul></details></li>` : '');
  }
  function auditRows(c) {
    if (c.key === 'impersonation') return clueRows(c);
    const groups = new Map();
    c.rows.forEach((r, i) => {
      const source = c.source[i], raw = U.sp(source.category).replace(/\s*[（(]\s*[)）]/g, '');
      const category = raw.includes('；') ? categoryNote(raw) : raw;
      if (!groups.has(category)) groups.set(category, []);
      const when = source.window && windowText(source.window, c.unit === '条');
      groups.get(category).push(`<li><span class="vz-audit__t">${U.esc(r.time)}</span><span>${U.esc(U.sp(source.name))}${when && when !== c.period ? `<small class="stat-gap">${U.esc(when)}</small>` : ''}</span><span class="vz-audit__c">${r.count == null ? '' : `${U.esc(S.text(source, 'count'))} ${c.unit}`}</span></li>`);
    });
    return [...groups].map(([category, rows]) => `<li class="security-audit-group">${category ? `<p class="vz-note">${U.esc(category)}</p>` : ''}<ul class="vz-audit__rows">${rows.slice(0, 5).join('')}</ul>${rows.length > 5 ? `<details><summary class="more">展开（还有 ${rows.length - 5} 条）</summary><ul class="vz-audit__rows">${rows.slice(5).join('')}</ul></details>` : ''}</li>`).join('');
  }
  function auditPeriod(key, rows, registry) {
    const total = data?.audit_totals?.[key], block = data?.blocks?.[`audits.${key}`];
    const stale = block?.state === 'stale' || block?.q === 'stale' || block?.stale === true;
    const stats = stale ? block : total ?? block, basis = stats?.count_basis ?? block?.count_basis;
    const rowWindow = rows.find(r => r.window)?.window;
    const supplied = stale ? rowWindow ?? block.window ?? basis?.window
      : total?.window ?? total?.count_basis?.window ?? block?.window ?? block?.count_basis?.window ?? rowWindow;
    const period = stale || registry ? { ...supplied, to: supplied?.to ?? block?.source_at ?? block?.at } : supplied ?? data?.window;
    return { stats, basis, when: windowText(period, registry) };
  }
  function commonAuditPeriod() {
    const counts = new Map();
    for (const [key] of audits) {
      const rows = data?.audits?.[key];
      if (key === 'services' || !Array.isArray(rows)) continue;
      const { stats, when } = auditPeriod(key, rows, false);
      if ((rows.length ? rows.some(r => r.count != null) : stats?.totals_q !== 'unknown') && when.includes(' 至 ')) {
        counts.set(when, (counts.get(when) || 0) + 1);
      }
    }
    return [...counts].filter(([, count]) => count > 1).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  }
  function auditChapter(list) {
    return (el) => {
      el.innerHTML = '<p class="vz-note" data-common-period hidden></p><div data-audit></div><p class="vz-note" data-missing></p>';
      const view = V.audit(el.querySelector('[data-audit]'), { rows: auditRows });
      const heading = el.firstElementChild;
      return { set: () => {
        const missing = [], ready = [], common = list === audits ? commonAuditPeriod() : '';
        for (const [key, title] of list) {
          const name = key === 'impersonation' && data?.summary?.impersonation === 0 ? '其他组件或路径异常（不计入高危仿冒）' : title;
          let rows = data?.audits?.[key];
          if (!Array.isArray(rows) || rows.length && rows.every((r) => r.count == null)) { missing.push(name); continue; }
          if (key === 'services') rows = serviceRows(rows);
          const status = data?.groups?.find((g) => g.key === `audits.${key}`);
          const registry = key === 'services' || key === 'impersonation', unit = registry ? '条' : '次';
          const { stats, basis, when } = auditPeriod(key, rows, registry);
          if (!rows.length && stats?.totals_q === 'unknown') { missing.push(name); continue; }
          const count = stats?.returned_count ?? rows.reduce((n, r) => n + (r.count ?? 0), 0);
          const scope = key === 'crashes' ? '已列程序合计' : registry ? '已列' : '';
          // 签名线索的条数写明是在哪段统计范围里数的（照后台给的范围）。
          const detail = [countBasis(basis, true), key === 'impersonation' && when && `统计范围：${when}`, key === 'crashes' && stats?.events != null && `整个时段 ${stats.events} 次事件`,
            stats?.truncated && `仅显示已返回的${registry ? '登记' : '程序'}`].filter(Boolean).join('；');
          const top = [...rows].sort((a, b) => b.count - a.count);
          const gap = [...new Set(rows.filter(r => r.count == null || S.has(r)).map(r => r.gap || (r.count == null && !U.offline?.() ? U.collectionText('有程序计数') : '')).filter(Boolean))].join('；');
          const badges = top.slice(0, 3);
          ready.push({ ...status, key, name, when: when === common ? '' : when, period: when, unit, scope, detail, count, gap, lower: stats?.at_least === true || rows.some(r => r.count == null || S.partial(r, 'count')), source: rows,
            top: badges.filter(r => r.count != null || !U.offline?.()).map(r => ({ ...r, text: S.text(r, 'count') })),
            rows: rows.map(r => ({ name: U.sp(r.name), count: badges.includes(r) && key !== 'impersonation' ? null : r.count, time: stamp(r.time) })) });
        }
        heading.hidden = !common;
        heading.textContent = common ? `统计时段 ${common}` : '';
        view.set(ready.length ? ready : null);
        el.lastElementChild.textContent = ready.length && missing.length && !U.offline?.() ? `${U.collectionText()}：${missing.join('、')}` : '';
      } };
    };
  }
  function protection(el, compact = false) {
    const state = (v) => v == null ? missing() : v ? '开着' : '没开';
    const when = (v) => v ? `${U.date(v) === U.date(new Date().toISOString()) ? '' : U.date(v) + ' '}${U.time(v)}` : missing();
    // 共用取数回调先给数据、再更新本人/访客身份；等身份更新后画明细。
    return { set() { queueMicrotask(() => {
      const p = data?.protection;
      if (!p) { U.html(el, `<p class="${U.offline?.() ? 'vz-note' : 'vz-wait'}">${missing()}</p>`); return; }
      const owner = document.documentElement.dataset.liveViewer === 'owner';
      const cell = (v, format, quality, key) => {
        const obj = v && typeof v === 'object' ? v : null, marker = obj ? U.visibilityNote(obj, owner ? 'owner' : 'public') : '';
        if (obj?.visibility === 'owner' && !owner) return marker;
        const value = obj ? obj.value : v;
        if (value == null && U.offline?.()) return '';
        const text = obj?.visibility === 'rewritten' ? value ?? missing() : format(value);
        return (value == null ? `<span class="security-missing">${U.esc(text)}</span>` : U.esc(text)) + (marker ? ` · ${marker}` : '') + (value != null && S.partial(quality, key) && quality.gap ? `<small class="stat-gap">${U.esc(quality.gap)}</small>` : '');
      };
      const rows = [
        ['杀毒实时保护', cell(p.antivirus?.realtime, state)], ['病毒库更新', cell(p.antivirus?.signatures_at, when)], ['上次扫描', cell(p.antivirus?.last_scan_at, when)],
        ['防火墙', cell(p.firewall?.enabled, state)], ['系统更新装到', cell(p.updates?.installed_at, when)], ['待装更新', cell(p.updates?.pending, (v) => S.text({ ...p.updates, pending: v }, 'pending', (x) => fmt(x, '个')), p.updates, 'pending')],
        ['系统盘加密', cell(p.system_disk?.encrypted, (v) => v == null ? missing() : v ? '已加密' : '没加密')],
      ];
      const marker = p.visibility === 'owner' ? '' : U.visibilityNote(p, owner ? 'owner' : 'public');
      const shown = (compact ? [rows[0], rows[1], rows[3], rows[5], rows[6]] : rows).filter(([, v]) => v || !U.offline?.()), older = !data?.blocks?.protection && U.olderNote?.(p.at, p);
      const signature = p.antivirus?.signatures_at, knownSignature = signature && (typeof signature !== 'object' || signature.value && (signature.visibility !== 'owner' || owner));
      U.html(el, `${marker ? `<p class="vz-note">${marker}</p>` : ''}${shown.length ? `<dl class="security-protection${compact ? ' security-protection--summary' : ''}">${shown.map(([k, v]) => `<div><dt>${U.esc(k)}</dt><dd>${compact && k === '病毒库更新' && knownSignature ? `已更新<small>${v}</small>` : v}</dd></div>`).join('')}</dl>` : `<p class="vz-note">${missing()}</p>`}${older ? `<p class="vz-note">${U.esc(older)}</p>` : ''}`);
    }); } };
  }
  function group(key, name, line, figures, present, rest) {
    const keys = key === 'impersonation' ? [key, 'audits.impersonation'] : key === 'audit' ? [key, 'audits'] : [key];
    const given = keys.map(key => data?.groups?.find(g => (g.key ?? g.id) === key)).find(Boolean);
    const pictures = { protection: '/live/img/card-security-protect.webp', impersonation: '/live/img/grp-cpu.webp', lifecycle: '/live/img/grp-network.webp', audit: '/live/img/card-security-audit.webp' };   // 图址写全，构建才认得出、换成云端地址
    return { ...given, key, name, pic: pictures[key], line: present ? line : '', figures: figures.some((f) => f.value != null || f.line) ? figures : [], palette: ['teal', 'violet'], reason: U.sp(given?.reason || given?.why), grafana: data?.grafana?.href, ...rest };
  }
  // 卡里还画着上一轮的读数时，卡头不写“没有记录”：写上次读到是几点、多久读一次，和图上的“最近实测”说同一个时刻（M451）
  const drawn = { lifecycle: d => d?.lifecycle?.series?.length > 0, audits: d => d?.audits != null, 'audits.impersonation': d => d?.audits?.impersonation != null };
  function lastRead(g, d) {
    const reason = U.sp(g.reason || g.why);
    if (!drawn[g.key]?.(d) || !/^(?:没有记录|还没读到|暂时读不到)$/.test(reason)) return g;
    const block = d?.blocks?.[g.key] || g, at = block.window?.to ?? block.to ?? block.at ?? g.at, every = block.refresh_seconds ?? g.refresh_seconds;
    const cadence = every >= 3600 && every % 3600 === 0 ? `每${every === 3600 ? '' : ` ${every / 3600} 个`}小时读一次` : every > 0 ? `每 ${fmt(every, '秒')}读一次` : '';
    return at ? { ...g, reason: [`上次读到 ${stamp(at)}`, cadence].filter(Boolean).join(' · ') } : g;
  }
  const summaryGroup = d => d?.groups?.find(g => (g.key ?? g.id) === 'summary');
  const sentences = items => items.flatMap(item => U.sp(item).split('；').map(s => s.trim()).filter(Boolean));
  function headerStatusData(d) {
    if (d?.attention_summary) d = { ...d, attention_count: undefined, gray_count: undefined, ai_fixing_count: undefined };
    if (typeof d?.why !== 'string') return d;
    const visibleWarnings = (d.groups || []).filter(g => (g.key ?? g.id) !== 'summary' && ['red', 'yellow'].includes(g.level));
    const reasons = sentences(visibleWarnings.map(g => g.reason || g.why));
    const why = U.sp(d.why);
    const at = d.level === 'red' && Number.isFinite(Date.parse(d.alert_at)) && d.alert_at;
    const lead = at && [U.time(at), stamp(at)].map(label => `最后读到 ${label} 时`).find(prefix => why.startsWith(prefix));
    return reasons.includes(why) || lead && reasons.includes(why.slice(lead.length).trim())
      ? { ...d, why: undefined } : d;
  }
  // 程序身份筛查按小时读：小字只说一次几点读到、下次约几点读；这一轮真没读到才写没读到，并写清显示的是几点的数（M572）
  function impersonationReading(d) {
    const g = d?.groups?.find(x => (x.key ?? x.id) === 'audits.impersonation'), at = g?.at;
    if (!g || ['red', 'yellow'].includes(g.level) || !Number.isFinite(Date.parse(at))) return '';
    const short = t => U.date(t) === U.date(Date.now()) ? U.time(t) : stamp(t), every = g.refresh_seconds ?? d?.audits?.refresh_seconds;
    const failed = g.read_error === true || Object.values(g.missing || {}).some(r => (r?.reason_code ?? r?.reason ?? r) === 'read_failed');
    const round = d?.audits?.at, tried = failed && Date.parse(round) > Date.parse(at) ? round : at;
    const next = every > 0 ? Date.parse(tried) + every * 1000 : NaN;
    const later = !Number.isFinite(next) ? '' : next > Date.now() ? `下次约 ${short(next)} 读` : `本该 ${short(next)} 再读，还没读到新数`;
    const said = failed ? `${tried !== at ? short(tried) + ' 这一轮' : '这次'}没读到，下面是 ${short(at)} 读到的数` : `${short(at)} 读到`;
    return [said, later].filter(Boolean).join(' · ');
  }
  function formatImpersonation(card) {
    const status = card.querySelector('.grp__status');
    const reading = impersonationReading(data);
    if (status && reading) {
      const keep = status.textContent.split(' · ').map(s => s.trim()).filter(s => /项要处理$|^AI 在修|AI 已接手/.test(s));
      U.html(status, [reading, ...keep].map(U.esc).join(' · '));
      queueMicrotask(() => V.cardLineTitle(status.parentElement));
      return;
    }
    const block = status.querySelector('[data-block="audits.impersonation"]:not([data-state="unavailable"])');
    if (!block) return;
    const warning = status.firstChild;
    const lead = warning?.nodeType === Node.TEXT_NODE && /^(最后读到 [\d:-]+(?: \d\d:\d\d)?) 时\s*/u.exec(warning.data);
    const [label, ...details] = block.textContent.split(' · ');
    if (lead && details.some(text => U.sameCutoffNote(lead[1], text))) {
      warning.data = warning.data.slice(lead[0].length);
      if (label === '仿冒与路径异常' && details.length === 1) block.textContent = details[0];
    }
    const first = status.querySelector('[data-block]');
    const previous = block.previousSibling;
    if (first === block && previous && !previous.textContent.trimEnd().endsWith('·')) block.before(' · ');
    // 悬停提示只写行里看得见的几句，句句用“ · ”隔开（样式补的分隔也补上；藏起来的不算）。
    // 后面统计说明（data-stat-note）是下一轮微任务才加进来的，等它加完再写。
    queueMicrotask(() => V.cardLineTitle(status.parentElement));
  }
  const board = V.board(document.getElementById('board'), { key: 'security', sync, reading(id, point, t) {
    if (id === 'start' || id === 'exit') return point?.value != null ? { ...point, caption: t == null ? '最近实测' : '' } : t != null ? { text: '没记录' } : null;
  }, onCount(c) {
    const seen = new Set();
    c = { ...c, warn: c.warn.flatMap(g => { const reason = U.sp(g.reason).split('；').filter(s => s && !seen.has(s) && seen.add(s)).join('；'); return reason || !g.reason ? [{ ...g, reason }] : []; }) };
    D.count(c);
    const hero = document.getElementById('hero');
    const count = hero.querySelector('[data-part="count"]'), groups = data?.attention_summary;
    const report = (title, items, detail, always = false) => items.length || always
      ? `<b>${title} ${items.length} 组</b>${items.length ? ' · ' + items.map(detail).join('；') : ''}` : '';
    const who = g => g.ai_fixing === true ? 'AI 已接手' : '还没有 AI 接手';
    if (groups) {
      const name = g => U.fieldHtml(g.name, { name: '检测分组' });
      const lines = [
        report('已确认异常', groups.confirmed, g => `${name(g)}（${[g.at && U.esc(stamp(g.at)) + ' 读到', who(g)].filter(Boolean).join('，')}）`, true),
        report('读数暂缺', groups.unread, g => `${name(g)}（${g.at ? '最后读到 ' + U.esc(stamp(g.at)) : '没读到上次记录'}）`),
        report('需核实', groups.review, g => {
          const screening = /impersonation/.test(g.key || '');
          const fields = [Number.isInteger(g.programs) && (screening ? `${g.programs} 个程序没签名或路径不常见，要确认不是冒充的` : `${g.programs} 个程序名`),
            g.strong > 0 && `其中 ${g.strong} 个要尽快确认`, g.at && `${stamp(g.at)} 读到`, g.ai_fixing === true ? 'AI 在逐个核对' : '下一步：交给 AI 逐个核对签名和安装位置，你不用自己查；现在还没有 AI 接手'].filter(Boolean);
          return `<a href="#grp-impersonation" data-goto="impersonation">${name(g)}${screening ? ' · 看是哪几个 ›' : ''}</a>（${U.esc(fields.join('；'))}）`;
        })
      ].filter(Boolean);
      count.hidden = false;
      U.html(count, lines.map(line => `<span style="flex-basis:100%">${line}</span>`).join(''));
    } else count.hidden = true;
    window.LiveLight.tone(hero, data);
    queueMicrotask(() => {
      const title = headline(data, summaryGroup(data), hero.querySelector('[data-part="basis"]'));
      const counted = html => html.replace(/(<span class="live-unit">[^<]+ 个<\/span>进程身份)/g, '<span class="security-count">$1</span>');
      // 大标题先说结论（有没有确认的异常、几组要核实），退出和提权次数挪到下一行。
      const verdict = groups && conclusion(groups), head = hero.querySelector('[data-part="head"]');
      let figures = hero.querySelector('[data-part="figures"]');
      if (verdict && !figures) { figures = document.createElement('p'); figures.className = 'hero__count'; figures.dataset.part = 'figures'; head.after(figures); }
      if (figures) { figures.hidden = !verdict; U.html(figures, verdict ? `<span>${counted(U.nowrap(title))}</span>` : ''); }
      const words = verdict ? U.head(verdict, { lamp: false }).replaceAll('，', '，<br>')
        : counted(U.head(title, { lamp: false })).replace(/(，)(?=提权)/, '$1<br>');
      U.html(head, U.status(data).lamp + words);
    });
  } });
  // 紧挨着断开处的一个桶（断开前的最后一桶、接上后的第一桶、还没走完的最新一桶）多半没满一分钟，
  // 比另一侧连着的 10 个桶的中位数的一半还低，就按没记录画，免得画成“掉到底再接上”。
  function partialEdges(points) {
    if (!Array.isArray(points)) return points;
    const out = points.map(p => [...p]), last = points.length - 1;
    const side = (i, step) => {
      const values = [];
      for (let j = i + step; j >= 0 && j <= last && values.length < 10 && Number.isFinite(points[j][1]); j += step) values.push(points[j][1]);
      return values.sort((a, b) => a - b);
    };
    for (let i = 0; i <= last; i++) {
      const v = points[i][1];
      if (!Number.isFinite(v)) continue;
      const cutAfter = i === last || points[i + 1][1] == null, cutBefore = i > 0 && points[i - 1][1] == null;
      if (cutAfter === cutBefore) continue;
      const ref = side(i, cutAfter ? -1 : 1), median = ref[Math.floor(ref.length / 2)];
      if (ref.length >= 5 && v < median / 2) out[i][1] = null;
    }
    return out;
  }
  function lifecycleData(d) {
    const merged = D.merge(d, ['lifecycle']), life = d?.lifecycle;
    if (!life) return merged;
    const gaps = life.missing_intervals;
    // 小时桶含该小时的实测分钟，小时开头没记录时仍保留桶内实测。
    const bucket = life.step > 60 ? life.step : 0;
    const covered = t => gaps.some(([a, b]) => a <= t && t < b && t + bucket <= b);
    const series = merged.series.map(s => !['start', 'exit'].includes(s.id) ? s : {
      ...s, from: s.from ?? life.from ?? merged.from, to: s.to ?? life.to ?? merged.to,
      points: partialEdges(gaps?.length ? s.points.map(p => p[1] != null && covered(p[0]) ? [p[0], null] : p) : s.points),
    });
    return { ...merged, series, missing_intervals: gaps, bucket_seconds: life.step };
  }
  function lifecycle(el) {
    el.classList.add('security-life');
    const chart = C.create(el, { size: 'mid', sync, floor: 0, title: '进程启动与退出', unit: '次', lines: [{ id: 'start', label: '启动', hue: 'teal' }, { id: 'exit', label: '退出', hue: 'apricot' }], onRead(values, t) {
      for (const v of values) {
        const cell = el.querySelector(`.chart__val[data-line="${v.id}"] b`);
        if (t == null && v.at != null) cell.innerHTML = `${U.esc(v.text)}<small class="stat-gap">最近实测 ${U.esc(stamp(new Date(v.at * 1000).toISOString()))}</small>`;
        if (t != null && v.value == null) cell.textContent = '没记录';
      }
    } });
    return { set() { chart.set(lifecycleData(data)); } };
  }
  let hashDone = false;
  function goTo(key) {
    const card = document.getElementById(`grp-${key}`);
    if (!card) return false;
    board.open(key, true);
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }
  document.getElementById('hero')?.addEventListener?.('click', e => {
    const link = e.target.closest('[data-goto]');
    if (link && goTo(link.dataset.goto)) e.preventDefault();
  });
  document.getElementById('board')?.addEventListener?.('click', e => {
    const link = e.target.closest('[data-security-goto]');
    if (link) { e.preventDefault(); e.stopPropagation(); board.open('impersonation', true); document.getElementById('grp-impersonation')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' }); }
  });
  D.mount({ resource: 'computer/security', statusData: headerStatusData, board: { ...board, blocks(d, map, offline) {
    const legacy = summaryGroup(d);
    board.blocks(d?.groups ? { ...d, groups: d.groups.filter(g => g !== legacy).map(g => lastRead(g, d)) } : d, map, offline);
  } }, merge: lifecycleData, render(d) {
    data = d;
    const life = d?.lifecycle, points = life?.series?.[0]?.points, step = life?.step ?? (points?.length > 1 ? points[1][0] - points[0][0] : null);
    const interval = step > 0 ? fmt(step, '秒') : null;
    const known = [
      group('protection', statusNames.get('protection'), '', [], d?.protection != null, { build: (el) => protection(el) }),
      group('impersonation', statusNames.get('impersonation'), '按进程登记筛查签名和路径，命中后仍需核实', [figure('impersonation', '系统进程名路径异常登记', '条'), figure('unsigned', '未签名进程登记', '条')], d?.summary != null || d?.audits?.impersonation != null, { build: auditChapter([['impersonation', '签名与路径待核线索']]) }),
      group('lifecycle', '进程什么时候集中启动、退出', interval ? `每 ${interval}` : '', [{ key: 'start', label: '启动', line: 'start', hue: 'teal' }, { key: 'exit', label: '退出', line: 'exit', hue: 'apricot' }], d?.lifecycle?.series?.length, { build: lifecycle }),
      group('audit', '行为审计', '按程序和行为类别合在一起，点一类看明细', [figure('elevated', '提权启动'), figure('crashes', '非零退出'), figure('short_lived', '短命进程退出')], d?.audits != null, { build: auditChapter(audits) }),
    ];
    const oldSummary = summaryGroup(d);
    const list = window.LiveAdaptive?.groups(d, known, ['audits', 'audits.impersonation', ...audits.map(([key]) => `audits.${key}`), ...(oldSummary ? ['summary'] : [])]) || known;
    board.set(list); window.LiveAdaptive?.tail(document.getElementById('board'), list);
    for (const card of document.getElementById('board').children) if (card.dataset.key) card.id = `grp-${card.dataset.key}`;
    const wanted = /^#grp-([\w-]+)$/.exec(location.hash)?.[1];
    if (d && wanted && !hashDone) hashDone = goTo(wanted);
    queueMicrotask(() => {
      const root = document.getElementById('board'), impersonation = root?.querySelector('[data-key="impersonation"]'), audit = root?.querySelector('[data-key="audit"] .grp__said');
      if (impersonation && d?.groups?.some(g => ['impersonation', 'audits.impersonation'].includes(g.key) && ['red', 'yellow'].includes(g.level))) U.html(impersonation.querySelector('.grp__said'), '');
      if (impersonation) formatImpersonation(impersonation);
      if (audit && d?.groups?.some(g => ['audits', 'audit'].includes(g.key) && ['red', 'yellow'].includes(g.level))) U.html(audit, '<a class="security-audit-link" href="#grp-impersonation" data-security-goto>见“程序身份筛查” ›</a>');
    });
    const summary = document.getElementById('board').querySelector('[data-key="protection"] .grp__figs');
    if (d && summary) protection(summary, true).set();
    const otherGroups = (d?.groups || []).filter(g => g !== oldSummary), pageNotes = [].concat(d?.note || []);
    const seen = new Set(sentences([...pageNotes, d?.why, ...otherGroups.map(g => g.reason || g.why)]));
    const legacyNotes = sentences([oldSummary?.reason || oldSummary?.why, ...[].concat(oldSummary?.note || [])]).filter(s => !seen.has(s));
    const faults = d?.app_crashes;
    const confirmedCrashes = d ? (Number.isFinite(faults?.count)
      ? `${U.isStale(d) ? '上次记录：' : ''}应用崩溃 ${faults.q === 'partial' ? '至少 ' : ''}${faults.count} 次 · Windows 记录 ${windowText(faults.window)}`
      : faults?.gap || '没有读到 Windows 确认的应用崩溃次数') : '';
    const notes = [...new Set([...pageNotes, ...legacyNotes, confirmedCrashes].filter(Boolean))].filter(s => !otherGroups.some(g => ['red', 'yellow'].includes(g.level) && g.reason === s));
    const note = document.getElementById('hero').querySelector('[data-part="note"]'); note.hidden = !notes.length;
    U.html(note, notes.map((s) => `<span>${U.esc(s)}</span>`).join(''));
    const s = d?.summary; S.finish({ ...d, impersonation: { q: s?.q, partial: s?.partial, gap: s?.gap, impersonation: s?.impersonation, unsigned: s?.unsigned, records: d?.audits?.impersonation }, audit: { counts: { q: s?.q, partial: s?.partial, gap: s?.gap, elevated: s?.elevated, crashes: s?.crashes, short_lived: s?.short_lived }, rows: d?.audits } });
    if (d && initial) {
      initial = false;
      if (!wanted) {
        try { if (!localStorage.getItem('wly-live-board:security')) board.open('lifecycle', true); }
        catch { board.open('lifecycle', true); }
      }
    }
  } });
})();
