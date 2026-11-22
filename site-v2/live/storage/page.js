// 存储：页首一句话（存储页自己判断最要紧的事），自动清理大卡（cleanup.js）、每块盘合并卡（disks.js），下面一排小卡。
(() => {
  'use strict';
  const U = window.LiveUI, Light = window.LiveLight, K = window.StorageKit, $ = id => document.getElementById(id), { esc } = U;
  U.date = window.LiveChart.date;
  const params = new URLSearchParams(location.search), hero = $('hero');
  const route = href => { const url = new URL(href, location.href); if (params.has('fixture')) url.searchParams.set('fixture', params.get('fixture')); return url.pathname + url.search + url.hash; };
  document.querySelectorAll('.stage a[href^="/live/"]').forEach(a => { a.href = route(a.getAttribute('href')); });
  document.querySelector('[data-back]').addEventListener('click', U.restoreBack);
  Light.add(hero); document.querySelectorAll('.l2-board .card').forEach(card => Light.add(card));
  let storage = null, viewer = 'public', lit = false, snapshotId, readAt;
  const field = (value, label) => K.field(value, label, viewer);
  const htmlField = (value, label) => esc(field(value, label));
  const hiddenCount = (id, text) => { $(id).textContent = text; $(id).hidden = !text; };
  function fieldValue(value, label, format) {
    const text = field(value, label), raw = K.raw(value);
    return text && !K.isPlaceholder(text) && Number.isFinite(raw) ? format(raw) : text;
  }
  const missed = '这块没存下来，连上后补上。';
  const homeRead = U.reading(hero.querySelector('.card__body'), { ghost: U.ghost.card(1), name: '存储' });
  const storageReads = [homeRead, U.reading($('cleanup-body'), { ghost: U.ghost.rows(4), name: '自动清理', slow: false }), U.reading($('disks-box'), { ghost: U.ghost.rows(5), name: '每块盘', slow: false }), U.reading($('categories'), { ghost: U.ghost.rows(4), name: '按用途', slow: false })];
  const rank = document.createElement('ul');
  rank.className = 'vz-rank__list';
  $('ssd-rank').classList.add('vz-rank', 'vz-rank--pill');
  const rankMore = document.createElement('details');
  rankMore.hidden = true;
  rankMore.innerHTML = '<summary class="live-disclosure"><span class="disclosure-closed"></span><span class="disclosure-open">收起</span><span class="disclosure-chev" aria-hidden="true">›</span></summary><ul class="vz-rank__list"></ul>';
  $('ssd-rank').append(rank, rankMore);
  const ssdRead = U.reading($('ssd-panel'), { ghost: U.ghost.rows(3), name: '谁在大量写 SSD', slow: false });
  U.fold($('ssd-more'), $('ssd-box'));
  const ssdMoreLabel = () => U.html($('ssd-more'), $('ssd-more').getAttribute('aria-expanded') === 'true' ? '收起原表 ‹' : '展开原表 ›');
  $('ssd-more').addEventListener('click', ssdMoreLabel);
  const storageColumns = (table, rows) => table?.columns?.length && table.columns.every(key => typeof key === 'string')
    ? [...table.columns] : Object.keys(rows[0] || {}).filter(key => !['rewrite', 'content_locked', 'visibility', 'public', 'hidden'].includes(key));
  const columnLabel = key => key === '进程' ? '进程名称' : key.replace(/\s*\([^)]+\)$/, '').replace(/\s*IOPS/, '每秒读写次数');
  const ssdTotals = { '平均写速 (MB/s)': '累计写入 (GB)', '平均读速 (MB/s)': '累计读取 (GB)' };
  function renderssd(table) {
    const tableLocked = viewer !== 'owner' && K.locked(table);
    const { visible: rows, hidden } = K.splitRows(tableLocked ? [] : table?.rows, viewer);
    hiddenCount('ssd-private', tableLocked ? 'SSD 读写排行内容仅本人可见' : K.hiddenRows(hidden, 'SSD 读写记录', '进程名称、读写数据和程序路径'));
    const { sampleNote, sampleCount, sampleSeconds } = window.StorageDraw10;
    const seconds = sampleSeconds(table);
    const original = storageColumns(table, rows);
    const totals = Object.entries(ssdTotals).flatMap(([rate, total]) => original.includes(total) ? [total, rate] : []);
    const first = [...original.filter(key => key === '进程'), ...totals];
    const columns = [...first, ...original.filter(key => !first.includes(key))];
    const rateValue = (row, key) => {
      const label = columnLabel(key), source = row[ssdTotals[key]];
      const placeholder = [field(source, label), field(row[key], label)].find(K.isPlaceholder);
      const total = K.raw(source);
      return placeholder || (seconds && Number.isFinite(total) ? `${K.size(total * K.GiB / seconds, 2)}/s` : '—');
    };
    const value = (row, key) => key in ssdTotals ? rateValue(row, key) :
      fieldValue(row[key], columnLabel(key), n => key.endsWith('(MB/s)') ? `${K.size(n * K.MiB, 2)}/s`
        : key.endsWith('(GB)') ? bytes(n * K.GiB, row, key) : String(Number(n.toFixed(Math.abs(n) < 10 ? 2 : 1)))) || '—';
    const noPath = rows.filter(row => !field(row['程序路径'], '程序路径')).length;
    if (noPath && !columns.includes('程序路径')) columns.push('程序路径');
    const written = '累计写入 (GB)';
    const amounts = rows.map(row => fieldValue(row[written], columnLabel(written), n => n)).map(n => Number.isFinite(n) ? n : 0);
    const max = Math.max(1, ...amounts);
    const ranked = (viewer === 'owner' ? rows : rows.slice(0, 5)).map((row, i) => {
      const name = field(row['进程'], '进程名称') || (U.offline?.() ? '程序' : U.collectionText()), shown = value(row, written);
      const color = window.LiveViz.hues[['teal', 'violet', 'pink', 'blue'][i % 4]];
      return { key: `${name}:${i}`, cls: 'vz-rank__row', html: `<span class="vz-rank__bar" aria-hidden="true"><i style="--c:${color};--v:${Math.max(amounts[i] / max, 0)}"></i></span><span class="vz-rank__name"><span class="vz-rank__label">${esc(name)}</span></span><span class="vz-rank__v">${esc(shown)}</span>` };
    });
    const limit = viewer === 'owner' ? 4 : 5;
    const rest = ranked.slice(limit);
    rankMore.hidden = !rest.length;
    if (rankMore.hidden) rankMore.open = false;
    rankMore.querySelector('.disclosure-closed').textContent = `再看 ${rest.length} 个`;
    U.list(rankMore.querySelector('ul'), rest, { animate: false });
    U.list(rank, rows.length ? ranked.slice(0, limit) : tableLocked || hidden ? [] : [{ key: 'empty', cls: 'vz-rank__row vz-rank__row--empty', html: `<span class="vz-rank__none">${esc(U.offline?.() ? missed : 'SSD 写入没有记录')}</span>` }]);
    U.html($('ssd-period'), tableLocked ? '' : esc(field(table?.window?.label, '统计期间').split(/[，,]/)[0]));
    U.html($('ssd-count'), tableLocked ? '' : sampleCount(table, rows.length + hidden, ranked.length));
    const notes = [sampleNote(table),
      seconds ? '读写均速按表内估算累计量除以同一统计区间的秒数。'
        : '这次没读到完整统计区间，读写均速显示为 —。',
      noPath && `${noPath} 行没有程序路径。后台合并同名程序时会省略不一致的路径，这次未给各行缺失的原因。`].filter(Boolean);
    K.put($('ssd-table'), rows.length ? `${notes.map(note => `<p class="pj-note">${esc(note)}</p>`).join('')}<table><thead><tr>${columns.map(key => `<th scope="col">${esc(key in ssdTotals ? `全时段${columnLabel(key)}` : table.column_labels?.[key] ?? columnLabel(key))}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${columns.map(key => `<td${key === '程序路径' ? ' class="ssd-path-cell"' : ''}>${esc(value(row, key))}</td>`).join('')}</tr>`).join('')}</tbody></table>` : '');
    $('ssd-more').hidden = !rows.length;
    ssdMoreLabel();
  }
  const bar = U.topbar({ ask: () => storage && (viewer === 'owner' || !K.locked(storage)) ? `请看实况存储：${K.splitRows(storage.volumes, viewer).visible.map(v => `${volumeName(v, viewer)}还剩${bytes(v.free, v, 'free')}`).join('；')}。请说明现在的情况。` : '' });
  $('hero-note').addEventListener('click', e => {
    const link = e.target.closest('a[href^="#storage-disk-"]');
    const row = link && $(link.hash.slice(1));
    if (row) row.open = true;
  });
  const when = at => at ? `${U.date(at)} ${U.time(at)}` : U.offline?.() ? '' : U.collectionText();
  const isPartial = (item, key) => item?.lower_bound === true || item?.at_least === true || item?.q === 'partial' && (item.partial === undefined || item.partial.includes(key));
  const bytes = (n, item, key) => { const text = n == null ? U.offline?.() ? '' : U.collectionText(item?.label || '', item) : K.size(n); return `${n != null && (item?.at_least || isPartial(item, key) || item?.complete === false && key === 'bytes') ? '至少 ' : ''}${text}`; };
  const volumeName = K.volName;
  const growth = c => fieldValue(c.growth, '分类增长', n => `${n < 0 ? '这周减少' : '这周增长'} ${bytes(Math.abs(n), c, 'growth')}`);
  const categoryNote = c => c.gap || (c.bytes != null && isPartial(c, 'bytes') ? '只测到一部分' : '');
  const byteBasis = basis => ({ logical: '按文件大小', allocated: '按磁盘实际占用' })[basis] || '';
  const categoryScope = scope => scope === 'whole_volume' ? '整块盘' : '按登记的目录统计';
  const hasDiskVolumes = disk => Array.isArray(disk.volume) && disk.volume.length > 0 && disk.volume.every(id => typeof id === 'string' && /^[a-z]:?$/i.test(id));
  const hasDiskReading = disk => disk.life_remaining_pct != null || disk.written_tb != null;
  const diskHealthMissing = 'SSD 剩余寿命与累计写入暂时读不到';
  function renderHealth(disks) {
    const { visible, hidden } = K.splitRows(disks, viewer);
    const rows = visible.filter(hasDiskReading).map(disk => {
      const drives = hasDiskVolumes(disk) ? disk.volume.map(K.letter).join(' + ') + ' 盘' : '';
      const model = field(disk.model, '磁盘型号');
      const name = [drives, model].filter(Boolean).join(' · ') || field(disk.name, '磁盘名称') || 'SSD';
      const life = fieldValue(disk.life_remaining_pct, '剩余寿命', n => `${n}%`);
      // 后台字段是硬件记录的十进制 TB。
      const written = fieldValue(disk.written_tb, '累计写入', n => K.size(n * 1e12));
      const detail = [['剩余寿命', disk.life_remaining_pct_read_at], ['累计写入', disk.written_tb_read_at]]
        .filter(([, at]) => Number.isFinite(Date.parse(at)))
        .map(([label, at]) => `${label} ${when(at)} 读到`).join(' · ');
      return `<tr><th scope="row" title="${esc(detail)}">${esc(name)}</th><td>${esc(life || '—')}</td><td>${esc(written || '—')}</td></tr>`;
    });
    const gap = visible.find(disk => !hasDiskReading(disk) && hasDiskVolumes(disk) && disk.volume.some(id => K.letter(id) === 'D'))?.health_gap;
    const explain = field(gap, 'D 盘健康读数说明');
    const withheld = K.hiddenRows(hidden, '磁盘健康记录', '磁盘名称、型号、寿命和累计写入');
    K.put($('disk-health'), [
      rows.length && `<table class="st-health"><thead><tr><th scope="col">磁盘</th><th scope="col">剩余寿命</th><th scope="col">累计写入</th></tr></thead><tbody>${rows.join('')}</tbody></table>`,
      explain && `<p class="pj-note">${esc(K.isPlaceholder(explain) ? explain : `D 盘 · ${explain}`)}</p>`,
      withheld && `<p class="pj-note">${esc(withheld)}</p>`,
      !rows.length && !withheld && `<p class="pj-note">${U.offline?.() ? missed : diskHealthMissing}</p>`,
    ].filter(Boolean).join(''));
  }
  // 页首一句话由存储页自己的数据定，轻重顺序：保护名单被删（红）> 自动清理出错或没按时跑（橙）> 有盘 14 天内会满（橙）> 都够用（绿）。
  // 多久满用 StorageKit.forecast（近 14 天空闲的实际变化，和走势图同一条线），不用后台的 days_to_full。
  function headline(d) {
    const alarm = window.StorageCleanup?.alarm(d);
    if (alarm) return alarm;
    const readings = (d?.volumes || []).filter(v => v.state !== 'offline' && K.letter(v) !== 'F')
      .map(v => ({ v, f: K.forecast(v, d) }));
    if (!readings.length) return null;
    const predicted = readings.filter(x => x.f.days != null).sort((a, b) => a.f.days - b.f.days);
    const t = predicted[0];
    if (t?.f.days < 14) return { tone: K.tone(t.v, t.f), text: `${volumeName(t.v)}${t.f.text} · 还剩 ${K.size(t.v.free)}` };
    const unknown = readings.filter(x => x.f.days == null).map(x => K.letter(x.v)).filter(Boolean);
    const forecast = t?.f.days <= K.HORIZON ? `最紧的 ${volumeName(t.v)}${t.f.text}`
      : t && `${unknown.length ? '有足够走势的盘' : '所有在线盘'} ${K.HORIZON} 天内不会满`;
    return { tone: 'green', text: ['磁盘都够用', forecast, unknown.length && `${unknown.join('、')} 盘走势还不够预测`].filter(Boolean).join(' · ') };
  }
  // 读数过期或不全时，页首先说读数的问题，点出哪几块盘没读到、哪几项读不准，不下“都够用”的结论。
  function readingProblem(d, status) {
    const vols = (d?.volumes || []).filter(v => K.letter(v) !== 'F');
    const stale = staleStorage(d);
    const unread = vols.filter(v => !Number.isFinite(v.free) || !(v.total > 0));
    const offline = unread.filter(v => v.state === 'offline'), lost = unread.filter(v => v.state !== 'offline');
    const missingV = vols.length && !vols.some(v => K.letter(v) === 'V');
    const marked = (d?.volumes || []).filter(v => v.level === 'gray');
    if (!stale && status.tone !== 'gray' && !marked.length && !d?.gray_count && !unread.length && !missingV) return null;
    const names = list => list.map(v => K.letter(v) || K.volName(v)).join('、') + ' 盘';
    const at = d?.at || d?.measured;
    const tail = [offline.length && `${names(offline)}离线没读到`, lost.length && `${names(lost)}没读到`, missingV && 'V 盘还没接进读数'].filter(Boolean);
    const lead = stale ? (at ? `磁盘读数停在 ${when(at)}` : '磁盘读数已过期') : '磁盘读数不全';
    const count = Number(d?.gray_count) || 0;
    const grayNote = marked.length ? `${count || marked.length} 项读数还不能确认 · 灰灯已标出 ${names(marked)}`
      : count ? `${count} 项读数还不能确认，读数里没标明具体是哪几项` : '';
    return { text: [lead, ...tail].join(' · '), note: [grayNote, fixing(d)].filter(Boolean).join(' · ') };
  }
  const staleStorage = d => d?.stale || d?.q === 'stale' || d?.gray_reason === 'stale';
  const storageStatus = d => U.status(d && { ...d, attention_count: 0, ai_fixing_count: undefined, why: field(d.why, '状态说明'), stale_text: field(d.stale_text, '读数说明') });
  // 谁在管：有 AI 在修写几件；一件都没有就直说“还没有 AI 接手”，不写“AI 在修 0 件”
  const fixing = d => d?.ai_fixing_count > 0 ? `AI 在修 ${d.ai_fixing_count} 件` : d?.ai_fixing_count === 0 ? '还没有 AI 接手' : '';
  // 页首说了自动清理出事，旁边直接写出了什么事、点了跳到下面“自动清理”那张卡
  function cleanupWhy(d) {
    const alarm = window.StorageCleanup?.alarm(d), g = alarm && window.StorageCleanup.digest(d);
    if (!g) return '';
    const reason = g.deleted > 0 ? '看被删的是哪几件' : g.last?.result === 'error' ? `出错原因：${K.field(g.last.error, '清理出错原因', viewer) || '这一轮没写原因'}` : `每 ${g.hours} 小时该跑一轮，上次是 ${when(g.last.finished_at)}`;
    return `<a href="#cleanup-card">${esc(reason)}，看下面“自动清理” ›</a>`;
  }
  function attention(d) {
    const volumes = d?.volumes || [];
    const disks = staleStorage(d) ? [] : volumes.filter(v => v.level !== 'gray' && K.letter(v) !== 'F')
      .map(v => ({ v, key: K.letter(v), f: K.forecast(v, d) })).filter(x => x.key && x.f.days < 14);
    const { visible: items, hidden } = K.splitRows(d?.attention_items, viewer);
    const rows = new Map(items.filter(item => K.letter(item)).map(item => [K.letter(item), field(item.reason, '磁盘预警原因')]));
    for (const { key, f } of disks) if (!rows.get(key)) rows.set(key, f.text);
    const links = [...rows].map(([key, reason]) => {
      const label = `${key} 盘${reason ? ` · ${reason}` : '需要留意'}`;
      return volumes.some(v => K.letter(v) === key)
        ? `<a href="#storage-disk-${key}">${esc(label)}，查看余量和估算 ›</a>` : esc(label);
    });
    const withheld = K.hiddenRows(hidden, '磁盘预警', '磁盘名称和预警原因');
    if (withheld) links.push(esc(withheld));
    const unexplained = Math.max(0, (Number(d?.attention_count) || 0) - rows.size - hidden);
    if (unexplained) links.push(`后台标了 ${unexplained} 项要留意，这次没给出项目和原因`);
    const total = Math.max(Number(d?.attention_count) || 0, rows.size + hidden);
    return links.length ? `<b>要留意 ${total || links.length} 项</b>：${links.join(' · ')}` : '';
  }
  function storageSummary(d) {
    if (!d || !d.volumes?.length && !d.categories?.length && !d.disks?.length && !d.ssd_writers?.rows?.length && !d.database?.rows?.length && !d.totals?.metrics?.length && !Object.values(d.periods || {}).some(p => p.metrics?.length)) return { text: U.offline?.() ? '存储' : '存储暂时读不到', ...storageStatus(d) };
    const healthMissing = !d.disks?.some(hasDiskReading), mappingMissing = !d.disks?.length || d.disks.some(disk => !hasDiskVolumes(disk));
    const status = storageStatus(d), own = headline(d), problem = !U.offline?.() && readingProblem(d, status);
    // 读数问题放在标题，另有自动清理警报时把它一并显示。
    if (problem) {
      const alarm = window.StorageCleanup?.alarm(d), tone = alarm?.tone || 'gray';
      return { ...status, tone, lamp: K.lamp(tone, false), text: [problem.text, alarm?.text].filter(Boolean).join(' · '), note: problem.note || status.note };
    }
    const tone = own && !(own.tone === 'green' && status.tone === 'gray') ? own.tone : status.tone;
    const lamp = own ? `<span class="lamp" data-tone="${tone}" aria-hidden="true"></span>` : status.lamp;
    return { ...status, tone, lamp, text: own?.text || '存储', note: status.note || (U.offline?.() ? '' : [healthMissing && diskHealthMissing, mappingMissing && '盘符映射暂时读不到'].filter(Boolean).join(' · ')) };
  }
  const countFormat = new Intl.NumberFormat('zh-CN');
  let storagePeriod = '24h';
  const figure = (label, html, title = '') => `<div class="pj-fig"><span class="pj-fig__k">${esc(label)}</span><span class="pj-fig__v" title="${esc(title)}">${html}</span></div>`;
  function databaseCell(row, key, label = key) {
    const text = key === '记录行数 (估算)' ? fieldValue(row[key], label, n => countFormat.format(n)) : field(row[key], label);
    if (key !== '占用物理空间') return esc(text);
    // 旧接口给数据库体积的是已经按 1024 换算过的字符串。
    const match = /^(\d+(?:\.\d+)?)\s*(bytes?|[KMGT]?B)$/i.exec(text.trim());
    const divisor = match && ({ KB: K.KiB, MB: K.MiB, GB: K.GiB, TB: K.TiB }[match[2].toUpperCase()] || 1);
    return esc(match ? K.size(Number(match[1]) * divisor) : text);
  }
  function renderDatabase(table) {
    const tableLocked = viewer !== 'owner' && K.locked(table);
    const { visible: rows, hidden } = K.splitRows(tableLocked ? [] : table?.rows, viewer);
    const columns = table?.columns || [], total = rows[0] === table?.rows?.[0] ? rows[0] : null;
    const withheld = tableLocked ? '数据库规模和分区明细仅本人可见' : K.hiddenRows(hidden, '数据库记录', '表与分区名称、占用和行数');
    const countKey = '记录行数 (估算)';
    const count = K.raw(total?.[countKey]);
    const estimate = fieldValue(total?.[countKey], countKey, n => n >= 1e8 ? `约 ${Number((n / 1e8).toFixed(2))} 亿行` : `约 ${countFormat.format(n)} 行`);
    const at = table?.at ? `${when(table.at)} 读到` : '';
    K.put($('database-summary'), total
      ? figure('占用', databaseCell(total, '占用物理空间') || '—', at)
        + figure('记录行数', esc(estimate || '—'), estimate && !K.isPlaceholder(estimate) ? `估算 ${countFormat.format(count)} 行` : '')
      : `<p class="pj-note">${esc(withheld || (U.offline?.() ? missed : U.collectionText('数据库规模')))}</p>`);
    K.put($('database-table'), rows.length ? `${at ? `<p class="pj-note">${esc(at)}</p>` : ''}${withheld && total ? `<p class="pj-note">${esc(withheld)}</p>` : ''}<table><thead><tr>${columns.map(c => `<th scope="col">${htmlField(c.label, '列名')}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${columns.map(c => `<td>${databaseCell(row, c.key, field(c.label, '记录内容'))}</td>`).join('')}</tr>`).join('')}</tbody></table>` : '');
    $('database-details').hidden = !rows.length;
  }
  function renderTotals(d) {
    const period = d?.periods?.[storagePeriod] || (storagePeriod === '24h' ? d?.totals : null);
    U.html($('storage-totals'), ['估算累计磁盘写入', '估算累计磁盘读取'].map(label => {
      const metric = period?.metrics?.find(m => K.raw(m.label) === label);
      const value = viewer !== 'owner' && K.locked(metric) ? `${label}仅本人可见` : fieldValue(metric?.value, label, n => bytes(n, metric, 'value'));
      return figure(label.slice(-2), esc(value || '—'));
    }).join(''));
    U.html($('storage-totals-period'), period?.from && period?.to ? `${when(period.from)} — ${when(period.to)}` : U.offline?.() ? missed : U.collectionText('统计期间'));
    document.querySelectorAll('[data-storage-period]').forEach(b => { b.setAttribute('aria-pressed', String(b.dataset.storagePeriod === storagePeriod)); b.disabled = !!U.offline?.() || !(d?.periods?.[b.dataset.storagePeriod] || b.dataset.storagePeriod === '24h' && d?.totals); });
  }
  document.querySelectorAll('[data-storage-period]').forEach(b => b.addEventListener('click', () => { storagePeriod = b.dataset.storagePeriod; renderTotals(storage); }));
  function measurement(d) {
    const next = d?.next_measure, at = Date.parse(next);
    const schedule = Number.isFinite(at) && (at >= Date.now() ? `下次 ${U.date(next) === U.date(d.measured) ? U.time(next) : when(next)}`
      : (!d.measured || at > Date.parse(d.measured)) && `原定 ${when(next)} 补测，新结果还没读到`);
    return [d?.measured && `仍用 ${when(d.measured)} 测到的数据`, schedule].filter(Boolean).join(' · ');
  }
  function link(state) {
    bar?.set({ ...state, shownAt: readAt, cutoffAt: null }); Light.offline(state.offline);
    const copy = state.meta?.source === 'fallback' ? '已切到静态副本 · ' : '';
    U.list($('notices'), state.offline ? [{ key: 'storage', cls: 'notice glass', html: `<span class="lamp" aria-hidden="true"></span><span>${copy}${esc(sp(state.text))}</span>` }] : []);
  }
  function categoryRows(list, row, hidden) {
    const limit = viewer === 'owner' ? list.length : 5;
    K.put($('categories'), list.length ? list.slice(0, limit).map(row).join('') : hidden ? '' :
      `<li class="pj-note">${U.offline?.() ? missed : '暂时读不到各用途的占用'}。</li>`);
    K.put($('categories-rest'), list.slice(limit).map(row).join(''));
    $('categories-more').hidden = list.length <= limit;
    moreCategories();
  }
  const moreCategories = () => U.html($('categories-more'), $('categories-more').getAttribute('aria-expanded') === 'true' ?
    '收起 ‹' : `还有 ${$('categories-rest').children.length} 类 ›`);
  U.fold($('categories-more'), $('categories-box'));
  $('categories-more').addEventListener('click', moreCategories);
  function render(d) {
    const locked = viewer !== 'owner' && K.locked(d);
    if (locked) d = null;
    const cleanupLocked = viewer !== 'owner' && K.locked(d?.cleanup);
    const runs = K.splitRows(d?.cleanup?.runs, viewer);
    const gray = new Set(d?.gray_items?.map(K.letter));
    const visible = d && { ...d, volumes: K.splitRows(d.volumes, viewer).visible
      .map(v => gray.has(K.letter(v)) ? { ...v, level: 'gray' } : v),
      cleanup: !cleanupLocked && d.cleanup && { ...d.cleanup, runs: runs.visible } };
    const cleanupPrivate = cleanupLocked ? '自动清理结果仅本人可见' : K.hiddenRows(runs.hidden, '自动清理记录', '清理结果、腾出量和规则明细');
    renderDatabase(d?.database); renderTotals(d); window.StorageDraw10?.render(d, viewer);
    window.StorageCleanup?.render(visible, viewer, cleanupPrivate); window.StorageDisks?.render(d, viewer, visible);
    renderssd(d?.ssd_writers);
    renderHealth(d?.disks);
    const available = !!(d?.cleanup || d?.volumes?.length || d?.disks?.length || d?.categories?.length || d?.ssd_writers || d?.database || d?.totals?.metrics?.length || Object.values(d?.periods || {}).some(p => p.metrics?.length)), summary = storageSummary(visible);
    document.querySelector('.l2-board').hidden = $('ssd-box').hidden = !available; hero.classList.toggle('is-unavailable', !available && !U.offline?.());
    const title = field(d?.text, '存储标题');
    U.html($('head'), summary.lamp + U.head(locked ? '存储 · 存储读数内容仅本人可见' : K.isPlaceholder(title) ? `存储 · ${title}` : summary.text, { lamp: false })); const warned = attention(visible), cleanup = cleanupWhy(visible), who = (warned || cleanup) && !String(summary.note || '').includes(fixing(visible)) ? fixing(visible) : '';
    const heroNote = [warned, cleanup, summary.note, who].filter(Boolean).join(' · ');
    U.html($('hero-note'), heroNote); $('hero-note').hidden = !heroNote;
    Light.tone(hero, summary.tone);
    const { visible: listed, hidden } = K.splitRows(d?.categories, viewer);
    const usageBytes = c => {
      const value = K.raw(c.bytes);
      return Number.isFinite(value) && !K.isPlaceholder(field(c.bytes, '分类占用')) ? value : -1;
    };
    const all = listed.map(c => window.StorageGrowth.supplementUsage(c, visible.volumes, viewer))
      .sort((a, b) => usageBytes(b) - usageBytes(a));
    window.StorageGrowth.render(all, viewer, d?.growth7, d?.category_growth_note, visible);
    const categories = U.offline?.() ? all.filter(c => c.bytes != null || c.growth != null) : all;
    $('categories-note').hidden = !categories.length;
    hiddenCount('categories-private', K.hiddenRows(hidden, '存储分类', '分类名称、占用、增长和清理与测量说明'));
    const maxUsage = Math.max(1, ...categories.map(usageBytes));
    categoryRows(categories, c => {
      const usage = c.usage_note || [c.q === 'stale' && c.bytes != null && '沿用上次量全的数据', categoryScope(c.bytes_scope), byteBasis(c.bytes_basis), c.bytes != null && c.at && `${when(c.at)} 量到`].filter(Boolean).join(' · ');
      const change = c.growth == null ? '' : [growth(c), byteBasis(c.growth_basis), c.growth_from && `基准 ${when(c.growth_from)}`, c.growth_to && `截至 ${when(c.growth_to)}`].filter(Boolean).join(' · ');
      const local = [...new Set([c.cleaner, c.cleanup, categoryNote(c)].map(v => htmlField(v, '清理与测量说明')).filter(Boolean))];
      const tag = c.auto_clean === true ? '自动清' : c.auto_clean === false ? '不自动删' : field(c.auto_clean, '自动清理状态');
      const bar = Math.max(0, usageBytes(c)) / maxUsage * 100;
      const amount = fieldValue(c.bytes, '分类占用', n => bytes(n, c, 'bytes')) ||
        (c.id === 'recovery_versions' ? '还没读到各盘的恢复包大小' : '还没读到占用');
      return `<li id="cleanup-${esc(c.id)}"><details data-key="${esc(c.id)}"><summary class="st-use"><span>${htmlField(c.name || c.label, '分类名称')}</span><span class="st-use__bar" aria-hidden="true"><i style="width:${bar}%"></i></span><strong>${esc(amount)}</strong>${tag ? `<span class="st-tag">${esc(tag)}</span>` : '<span></span>'}<span class="st-use__arrow" aria-hidden="true">›</span></summary>
        <div class="st-use__detail">${[esc(usage), esc(change), ...local].filter(Boolean).map(note => `<p class="row__sub">${note}</p>`).join('')}</div></details></li>`;
    }, hidden);
    U.html($('measured'), measurement(d));
    if (!lit) { lit = true; Light.lightUp([hero, $('cleanup-card'), $('disks'), $('categories'), $('notices')]); }
  }
  const resource = 'computer/storage';
  let realtimeTimer, realtimeSeconds;
  function refreshCapacity(state) {
    const data = state.data;
    const current = state.meta.source === 'net' && [200, 304].includes(state.meta.status);
    const seconds = state.publicPaused ? 0 : current
      ? (data?.refresh_mode === 'realtime' ? data.refresh_seconds : 0) : realtimeSeconds;
    if (seconds === realtimeSeconds) return;
    clearInterval(realtimeTimer);
    realtimeSeconds = seconds;
    if (Number.isFinite(seconds) && seconds > 0) {
      realtimeTimer = setInterval(() => window.Live.get(resource), seconds * 1000);
    }
  }
  window.Live.watch(resource, null, {
    phase(s) { if (s.data == null) { ssdRead.set(s); storageReads.forEach(r => r.set(s)); } },
    data(d, meta) {
      viewer = meta.viewer.kind;
      const id = d ? `${viewer}:${meta.seq}:${meta.rev}:${meta.at}` : '';
      if (id !== snapshotId) readAt = d && meta.source === 'net' && meta.status === 200 ? new Date().toISOString() : null;
      snapshotId = id;
      const shown = storage != null; storage = d; if (shown) U.anchor(() => render(d)); else render(d);
      if (d) { ssdRead.done(); storageReads.forEach(r => r.done()); }
    },
    link(s) {
      link(s);
      refreshCapacity(s);
      if (s.phase === 'none') render(null); else if (storage && s.offline) render(storage);
      const at = s.meta?.at;
      const copy = s.meta?.source === 'fallback' && (s.fallbackNote || s.meta.fallbackNote);
      U.blockNote(hero.querySelector('.card__body'), { fallbackNote: s.offline ? '' : copy || (at ? `页面数据快照 ${when(at)}` : '') });
    },
  });
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();
