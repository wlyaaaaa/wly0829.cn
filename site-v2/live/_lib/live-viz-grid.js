// 备份去处、容量与进度；缺值不补零，预测与实测分开。
(() => {
  'use strict';
  const U = window.LiveUI, { esc } = U;
  const emptyText = text => U.offline?.() ? '这块没存下来，连上后补上。' : text;
  const partial = (o, key) => o?.q === 'partial' && (!o.partial || o.partial.includes(key));
  const bytes = n => { const power = Math.abs(n) >= 2 ** 30 ? 30 : Math.abs(n) >= 2 ** 20 ? 20 : Math.abs(n) >= 1024 ? 10 : 0, value = n / 2 ** power; return `${Number(value.toFixed(Math.abs(value) < 10 ? 2 : 1))} ${{ 30: 'GB', 20: 'MB', 10: 'KB', 0: 'B' }[power]}`; };
  const count = (o, key, format = String) => { if (o?.[key] == null) return U.offline?.() ? '' : U.collectionText(o?.label || '', o, null, key); const text = key === 'bytes' ? bytes(o[key]) : format(o[key]); return `${(o.lower_bound === true || partial(o, key)) && !/^(至少\s*|不到)/.test(text) ? '至少 ' : ''}${text}`; };
  const gap = o => o?.q === 'partial' && o.gap ? `<small>${esc(o.gap)}</small>` : '';
  const places = { local: '本机', g: 'G 盘', h: 'H 盘', drive: 'Drive', photos: '照片云' };
  function sizeEvidence(o, stamp) {
    const place = places[o?.size_source];
    return !place ? '' : [o.size_source === 'local' ? `${place}原件` : `${place}副本`, o.size_at && stamp(o.size_at).trim()].filter(Boolean).join(' · ');
  }
  function sourceSubset(o, stamp) {
    if (!o?.source_subset_confirmed_at) return '';
    const files = Number.isFinite(o.source_subset_files) ? ` ${o.source_subset_files.toLocaleString('zh-CN')} 个文件` : '';
    return `上次核对受管源树${files} · ${stamp(o.source_subset_confirmed_at).trim()}`;
  }
  const BACKUP_FAILURES = {
    cold_group_failed: '这轮冷备份没备齐',
    required_backup_previous_file_unavailable: '上一份备份文件读不到，这次没出新包',
    backup_process_interrupted: '备份做到一半被打断',
    wechat_hot_resource_busy: '微信正占着文件',
  };
  function backupFailureReason(value) {
    if (typeof value === 'string') return Object.hasOwn(BACKUP_FAILURES, value) ? BACKUP_FAILURES[value] : value;
    if (value && typeof value === 'object') {
      const key = typeof value.text === 'string' ? 'text' : typeof value.value === 'string' ? 'value' : '';
      return key && Object.hasOwn(BACKUP_FAILURES, value[key]) ? { ...value, [key]: BACKUP_FAILURES[value[key]] } : value;
    }
    return value;
  }
  const backupRestoreNote = value => typeof value === 'string' ? value
    .replace(/恢复结果存在选定的还原目录旁，没有集中记录(?:，无法判断全部恢复经过)?/, '每次文件恢复的回执放在选定的恢复目录旁，这里查不全')
    .replace(/软件没有列出取回了哪些文件/, '没记取回了哪些文件')
    .replace(/现有记录只覆盖文件恢复操作，离线整机还原没有可查的记录/, '离线整机还原的记录在这里查不到') : value;
  const pending = c => { const values = [c.waiting, c.stable].filter(n => n != null); return { count: values.length ? values.reduce((a, n) => a + n, 0) : null, q: values.length < 2 || partial(c, 'waiting') || partial(c, 'stable') ? 'partial' : 'ok' }; };
  function copyState(copy) {
    if (copy?.required === false) return 'none';
    if (!copy || ['unknown', 'offline'].includes(copy.state)) return 'unknown';
    if (copy.failed > 0 || ['missing', 'failed'].includes(copy.state)) return 'gap';
    if (copy.state === 'stale') return 'stale';
    if (copy.waiting > 0 || copy.stable > 0 || ['waiting', 'stable', 'queued'].includes(copy.state)) return 'waiting';
    if (copy.q === 'partial' || !copy.content_at) return 'unknown';
    if (['ready', 'complete', 'completed'].includes(copy.state)) return 'complete';
    if (copy.state === 'partial') return 'gap';
    return copy.sent != null && copy.total != null ? (copy.sent === copy.total ? 'complete' : 'gap') : 'unknown';
  }
  function protection(s) {
    const states = ['g', 'h', 'drive', 'photos'].map(k => copyState(s[k])).filter(x => x !== 'none');
    if (['local_copy_no_cloud', 'single', 'unknown', 'waiting'].includes(s.protection)) return s.protection;
    if (states.includes('gap')) return 'gap';
    if (states.includes('stale')) return 'stale';
    if (states.includes('unknown') || s.q === 'unknown' || s.q === 'partial' && s.protection === 'complete') return 'unknown';
    return states.includes('waiting') ? 'waiting' : s.protection === 'complete' ? 'complete' : 'unknown';
  }
  const tone = s => U.status(s).tone;
  function backupText(s) {
    const labels = { complete: '齐了', gap: '有缺', waiting: '在等', stale: '旧了', local_copy_no_cloud: '云端还没有', single: '只有一份', unknown: emptyText(U.collectionText("副本情况")) };
    const details = Object.entries(places).filter(([k]) => k !== 'local').flatMap(([k, name]) => {
      const c = s[k], state = copyState(c);
      if (state === 'waiting') { const wait = pending(c); return [wait.count == null ? `${name}在等${U.offline?.() ? '' : U.collectionText("，份数")}` : `${name} ${transferCount(wait, 'count', k)}在等`]; }
      return state === 'gap' ? protection(s) === 'local_copy_no_cloud' && ['drive', 'photos'].includes(k) ? [] : [`${name}${c?.state === 'missing' ? '没有副本' : '有缺'}`] : state === 'stale' ? [`${name}副本旧了`] : [];
    });
    return [labels[protection(s)], ...details].join(' · ');
  }
  const transferUnit = target => ({ drive: '个文件', photos: '项照片或视频' })[target] || '份';
  const transferCount = (o, key, target) => count(o, key) + (o?.[key] == null ? '' : ` ${transferUnit(target)}`);
  function pair(o, target) {
    if (o?.sent != null && o?.total != null) return `${o.lower_bound === true || partial(o, 'sent') || partial(o, 'total') ? '至少 ' : ''}${o.sent} / ${o.total}${target ? ' ' + transferUnit(target) : ''}`;
    if (o?.sent == null && o?.total == null && !o?.missing?.sent && !o?.missing?.total) return U.offline?.() ? '' : U.collectionText('上传进度', o);
    return [['sent', '已传'], ['total', '总数']].map(([key, label]) => {
      if (o?.[key] == null) return U.offline?.() ? '' : U.collectionText(label, o, null, key);
      return `${label} ${target ? transferCount(o, key, target) : count(o, key)}`;
    }).filter(Boolean).join(' · ');
  }
  function backupCounts(sets) {
    return Object.fromEntries(['complete', 'gap', 'waiting', 'stale', 'local_copy_no_cloud', 'single', 'unknown'].map(k => [k, sets.filter(s => protection(s) === k).length]));
  }
  function backupTotals(sets, summary = {}) {
    const latest = key => sets.map(s => s[key]?.content_at).filter(Boolean).sort((a, b) => Date.parse(a) - Date.parse(b)).at(-1) || null;
    const clouds = sets.filter(s => s.drive && s.drive.required !== false).map(s => s.drive), keys = ['sent', 'total', 'waiting', 'failed', 'stable'];
    const sum = key => { const values = clouds.map(c => c[key]).filter(n => n != null); return values.length ? values.reduce((a, n) => a + n, 0) : null; };
    const drive = Object.fromEntries(keys.map(k => [k, summary.drive?.[k] ?? sum(k)]));
    drive.partial = keys.filter(k => partial(summary.drive, k) || clouds.some(c => c[k] == null || partial(c, k)));
    drive.q = drive.partial.length ? 'partial' : 'ok'; drive.gap = summary.drive?.gap || (drive.partial.length ? sets.filter(s => s.drive?.required !== false && keys.some(k => s.drive?.[k] == null)).map(s => s.name || s.id).join('、') + U.collectionText("的云端份数") : '');
    const unread = sets.filter(s => s.drive?.required !== false && keys.some(k => s.drive?.[k] == null)); if (unread.length && unread.every(s => s.drive?.state === 'missing')) drive.gap = unread.map(s => `${s.name || s.id}云端还没有`).join('；');
    drive.unaccounted = !drive.partial.length && drive.sent != null && drive.total != null ? Math.max(0, drive.total - drive.sent - ['waiting', 'failed', 'stable'].reduce((n, k) => n + (drive[k] ?? 0), 0)) : null;
    const out = { drive };
    for (const k of ['g', 'h']) { out[k] = summary[k + '_latest_at'] ?? latest(k); out[k + '_partial'] = partial(summary, k + '_latest_at') || summary[k + '_latest_at'] == null && (sets.some(s => s[k]?.required !== false && (!s[k]?.content_at || copyState(s[k]) === 'unknown'))); }
    return out;
  }
  const destination = (s, key) => s[key] ?? null;
  const stored = c => ['count', 'bytes', 'sent', 'total', 'content_at'].some(k => c?.[k] != null);
  function cell(s, key, unread = false) {
    const c = destination(s, key), state = copyState(c), labels = { complete: '齐了', gap: '有缺', stale: '旧了', waiting: '在等', none: '不需要', unknown: emptyText(U.collectionText()) };
    const cloud = ['drive', 'photos'].includes(key), detail = [], missing = [];
    if (state === 'unknown' && unread && !U.offline?.()) return '<td data-state="unknown">—</td>';
    if (c?.state === 'missing') return `<td data-state="gap"><b>${cloud ? '云端还没有' : '缺'}</b></td>`;
    if (U.offline?.()) {
      const values = [c?.content_at ? U.date(c.content_at) : '', c?.count != null ? `${count(c, 'count')} 份` : '', c?.bytes != null ? count(c, 'bytes') : '', c?.sent != null && c?.total != null ? pair(c, key) : [c?.sent != null ? `已传 ${transferCount(c, 'sent', key)}` : '', c?.total != null ? `共 ${transferCount(c, 'total', key)}` : ''].filter(Boolean).join(' · ') || (c?.waiting > 0 || c?.stable > 0 ? `在等 ${transferCount(pending(c), 'count', key)}` : '')].filter(Boolean);
      return `<td data-state="${state}">${state === 'unknown' ? '' : `<b>${labels[state]}</b>`}${(values.length ? values : state === 'unknown' ? [emptyText('')] : []).map(t => `<small>${esc(t)}</small>`).join('')}${gap(c)}</td>`;
    }
    if (state !== 'none') {
      if (c?.content_at) detail.push(U.date(c.content_at)); else if (c?.state !== 'missing') missing.push('日期');
      if (cloud) { if (c?.sent != null && c?.total != null) detail.push(pair(c, key)); else if (c?.waiting > 0 || c?.stable > 0) detail.push(`在等 ${transferCount(pending(c), 'count', key)}`); else missing.push('份数'); }
      if (state !== 'unknown' && missing.length && !U.offline?.()) detail.push(`${missing.join('、')}${U.collectionText()}`);
    }
    return `<td data-state="${state}">${state === 'unknown' ? `<small>${labels[state]}</small>` : `<b>${labels[state]}</b>`}${detail.map(t => `<small>${esc(t)}</small>`).join('')}${gap(c)}</td>`;
  }
  function grid(host, sets, names, route, viewer) {
    const unread = Object.keys(names).filter(key => sets?.length && sets.every(s => U.offline?.() ? !stored(destination(s, key)) : copyState(destination(s, key)) === 'unknown'));
    if (U.offline?.()) names = Object.fromEntries(Object.entries(names).filter(([key]) => !unread.includes(key)));
    if (U.offline?.() && (!sets?.length || !Object.keys(names).length)) { host.innerHTML = `<p class="pj-note">${emptyText('')}</p>`; return; }
    const name = s => U.fieldHtml?.(s.name || s.id, { name: '资料', place: 'label', kind: viewer }) ?? esc(s.name || s.id);
    const note = s => name(s) !== esc(s.name || s.id) ? U.fieldHtml(s.name || s.id, { name: '资料', kind: viewer, marker: true }) : U.visibilityNote(s, viewer, '这类资料的名称');
    host.innerHTML = sets == null ? `<p class="pj-note">${U.collectionText()}</p>` : `<table class="backup-grid"><thead><tr><th>资料</th>${Object.entries(names).map(([key,n]) => `<th scope="col">${esc(n)}${unread.includes(key) ? `<small>${U.collectionText()}</small>` : key === 'drive' ? '<small>已传 / 共</small>' : ''}</th>`).join('')}</tr></thead><tbody>${sets.map(s => `<tr><th scope="row"><a href="${esc(route(`/live/backup/?id=${encodeURIComponent(s.id)}`))}">${name(s)} ›</a>${note(s) ? `<small>${note(s)}</small>` : ''}</th>${Object.keys(names).map(k => cell(s, k, unread.includes(k))).join('')}</tr>`).join('')}</tbody></table>`;

  }
  function progress(sent, total) {
    return Number.isFinite(sent) && Number.isFinite(total) && total > 0 ? `<progress class="data-progress" value="${Math.max(0, Math.min(sent, total))}" max="${total}" aria-label="已传 ${sent} / 共 ${total}"></progress>` : '';
  }
  function spaceData(v) {
    const h = v.space_history;
    if (!h?.points?.length) return null;
    const points = h.points.map(([t, n]) => [t, n == null ? null : n / 2 ** 30]), last = points.at(-1);
    const ahead = Math.min(v.days_to_full, 60), end = v.days_to_full > 0 && v.free != null && last[1] != null ? last[0] + ahead * 86400 : null;
    return { from: h.from, to: end ? new Date(end * 1000).toISOString() : h.to, series: [{ id: 'free', unit: 'GB', points }, { id: 'forecast', unit: 'GB', points: end ? [[last[0], v.free / 2 ** 30], [end, v.free / 2 ** 30 * (1 - ahead / v.days_to_full)]] : [] }] };
  }
  window.LiveDataViz = { partial, bytes, count, gap, pair, transferUnit, transferCount, tone, backupText, copyState, protection, backupCounts, backupTotals, grid, cell, progress, spaceData, sizeEvidence, sourceSubset, backupFailureReason, backupRestoreNote };
})();
