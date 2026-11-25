// 一类备份：内容时间、核对时间和恢复记录分开；校验通过不代表恢复过。
(() => {
  'use strict';
  const U = window.LiveUI, Light = window.LiveLight, D = window.LiveDataViz, { esc, sp } = U;
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search), id = params.get('id');
  let point = params.get('point'), pointShown = '';
  const route = path => path + (params.has('fixture') ? `${path.includes('?') ? '&' : '?'}fixture=${encodeURIComponent(params.get('fixture'))}` : '');
  let disconnected = false;
  const offline = () => U.offline?.() ?? disconnected, missing = (name = '一类备份') => offline() ? '这块没存下来，连上后补上。' : `${name}暂时读不到`;
  const stamp = (at, meta, label = '时刻') => at ? `${U.date(at)} ${U.time(at)}` : offline() ? '—' : U.collectionText(label, meta);
  const said = (value, what = '备份内容') => U.fieldHtml(value == null ? offline() ? '—' : U.collectionText(what) : value, { name: what, kind: viewer });
  const count = (item, key, format) => item?.[key] == null ? offline() ? '—' : U.collectionText(({ count: '份数', total: '总份数', bytes: '大小', failed: '失败份数' })[key] || '', item) : D.count(item, key, format);
  const gap = item => offline() && /还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|未读/.test(item?.gap || '') ? '' : D.gap(item);
  let pointLimit = 5, assetLimit = 5, fileLimit = 5;
  const pathHtml = (value, what = '备份位置') => {
    const shown = said(value, what), plain = U.fieldText(value, viewer);
    if (U.sp(value).length > 28) return `<details class="backup-path"><summary>${shown}</summary><div>${shown}</div></details>`;
    return shown === esc(plain) && /^[a-z]:[\\/]/i.test(plain)
      ? `<span class="backup-locator">${shown.replace(/([\\/])(?=[^\\/])/g, '$1<wbr>')}</span>` : shown;
  };
  function nextBatch(target, total, shown, advance, nextPage = false) {
    target.querySelector?.('[data-batch-more]')?.remove();
    if (shown >= total && !nextPage) return;
    const button = document.createElement('button'); button.type = 'button'; button.className = 'more fe-l3b-more'; button.setAttribute('data-batch-more', '');
    button.textContent = nextPage ? '读下一批 ›' : `再看 ${Math.min(5, total - shown)} 条（还有 ${total - shown} 条）`;
    if (nextPage) button.setAttribute('data-needs-pc', '');
    button.addEventListener('click', advance); target.append(button);
  }
  // 档案卡页头：灯放进左上那枚小签里；没有小签（旧样子）就照旧摆在标题前。
  function lampTo(html) { const slot = $('lamp'); if (!slot) return html; U.html(slot, html); slot.hidden = !html; return ''; }
  function evidenceTime(value) {
    const [, time, label] = /^(\S+ \d{2}:\d{2}) (.+)$/u.exec(value) || [];
    return time ? `<span class="backup-time">${esc(time)}</span><small>${esc(label)}</small>` : esc(value) || '—';
  }
  const table = (heads, rows, name = '副本各在哪里', caption = '') => {
    const absent = value => value == null || value === '' || /(?:还在采集|没有记录)$|^从 .* 开始记$|^(还没读到|—)(?:\s*份)?$/.test(value);
    if (!rows.length || rows.every(row => row.slice(1).every(absent))) return `<p class="fe-l3b-note">${esc(offline() ? missing(name) : [...new Set(rows.flat().filter(v => /^从 .* 开始记/.test(v)))].join(' · ') || U.collectionText(name))}</p>`;
    const unread = heads.map((name, i) => i && !['本地文件夹', '核对时间'].includes(heads[i]) && rows.length && rows.every(row => absent(row[i])) ? i : -1).filter(i => i >= 0), indices = heads.map((_, i) => i).filter(i => !unread.includes(i));
    const note = [caption, unread.length ? offline() ? `${unread.map(i => heads[i]).join('、')}没存下来，连上后补上。` : U.collectionText(unread.map(i => heads[i]).join('、')) : ''].filter(Boolean).join(' · ');
    return `<table class="fe-l3b-table">${note ? `<caption>${esc(note)}</caption>` : ''}<thead><tr>${indices.map(i => `<th>${heads[i]}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${indices.map(i => `<td>${absent(row[i]) ? `<span class="row__sub">${row[i]}</span>` : row[i]}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  };

  const PROTECTION = { failed: '备份失败', missing: '没有副本', stale: '副本已过期', partial: '副本不齐' };
  const PLACES = [['local', '本机'], ['g', 'G 盘'], ['h', 'H 盘']], CLOUDS = { drive: 'Drive', photos: '照片云' };
  const notApplicable = copy => copy?.state === 'not_applicable' || (Object.hasOwn(copy || {}, 'applicable') ? copy.applicable === false : copy?.required === false);
  const absentReason = (data, key) => {
    const value = data?.missing?.[key], code = value?.reason_code || value;
    return ({ not_applicable: '不适用', read_failed: '这次没读到', not_recorded: '没有记录' })[code] || (value?.text || value?.value ? value : value?.reason || (typeof value === 'string' ? value : ''));
  };
  const actionHtml = s => { const list = s.actions?.length ? s.actions : [{ kind: 'copy', label: '问情况', intent: 'ask' }]; return U.actions(s, list).replace(/<(button|a)\b([^>]*data-(?:act|open)="(\d+)"[^>]*)>/g, (tag, kind, attrs, i) => list[i].kind === 'open' || /^(我办完了|不办了|晚点提醒|在电脑上打开|打开对话|打开汇报|Grafana)/.test(list[i].label || '') ? `<${kind}${attrs} data-needs-pc>` : tag); };
  function copyEvidence(copy, key, name, summary) {
    const original = key === 'local', retired = key === 'g' && copy?.retired === true;
    if (!retired && (notApplicable(copy) || original && copy?.original_state === 'not_applicable')) return { skip: true };
    const current = original ? copy?.original_state ?? copy?.state : copy?.state;
    const published = copy?.at_precision === 'h_recovery_set_published';
    const hasConfirmation = copy && (Object.hasOwn(copy, 'confirmed_state') || Object.hasOwn(copy, 'confirmed_at'));
    const confirmed = original ? current === 'confirmed' || current === 'ready' && copy.original_state == null
      : hasConfirmation ? copy.confirmed_state === 'complete' && !!copy.confirmed_at
      : !published && ['ready', 'complete', 'completed'].includes(current) && !!copy?.content_at;
    const problems = original ? { failed: '原件读取失败', missing: '原件缺失', stale: '原件记录已过期', partial: '只核实部分原件' } : PROTECTION;
    const anomaly = copy?.failed > 0 ? (original ? problems.failed : `失败 ${D.transferCount(copy, 'failed', key)}`)
      : problems[copy?.state] || problems[current] || (copy?.stale === true ? problems.stale : copy?.refresh_state === 'failed' ? '本次未刷新' : '');
    const status = retired ? '已停用，保留旧副本' : copy?.status_text ? (U.fieldText?.(copy.status_text, viewer) ?? sp(copy.status_text))
      : confirmed ? original ? '已确认有原件' : '上次确认有副本' : '';
    const quantity = copy?.count == null ? '' : `${count(copy, 'count', n => n.toLocaleString('en-US'))} 份${copy.count_basis === 'verified_managed_logical_files' ? '受管逻辑文件' : ''}`;
    const content = copy?.content_at ? `${stamp(copy.content_at)} ${published ? '恢复集发布' : original ? '原件记录日期' : '内容日期'}` : '';
    const listedAt = (summary?.target === key ? summary.checked_at : null) ?? copy?.checked_at;
    const checked = confirmed && copy?.confirmed_at ? `${stamp(copy.confirmed_at)} 核对` : listedAt ? `${stamp(listedAt)} 清单核对` : '';
    const lead = [anomaly, status, quantity && `已读 ${quantity}`].filter(Boolean).join(' · ');
    const unverified = [['count', '份数'], ['bytes', '大小'], ['content_at', '内容日期'], ['checked_at', '核对时间']]
      .filter(([k]) => copy?.[k] == null && (k !== 'checked_at' || !checked)).map(([k, label]) => [label, absentReason(copy, k)]);
    const unknown = unverified.filter(([, reason]) => !reason).map(([label]) => label);
    if (!confirmed && !anomaly && !retired) unknown.push(original ? '原件' : '完整性');
    const reasons = unverified.filter(([, reason]) => reason).map(([label, reason]) =>
      `<span class="backup-evidence-label">${label}：</span>${said(reason, label)}`);
    if (unknown.length) reasons.unshift(`${unknown.join('、').replace(/、([^、]+)$/, '和$1')}尚未核实`);
    // 这次没备份成：回包里给了几点试的、为什么、下一步，放在说明最前面（M376）。
    const failedAt = anomaly && copy?.last_attempt_at ? `${stamp(copy.last_attempt_at)} 这次没备份成` : '';
    const cause = anomaly && copy?.failure_reason != null ? copy.failure_reason : null;
    const failure = [failedAt && esc(failedAt) + (cause != null ? '：' + said(cause, '失败原因') : ''),
      !failedAt && cause != null && `<span class="backup-evidence-label">失败原因：</span>${said(cause, '失败原因')}`,
      anomaly && copy?.next_step != null && `<span class="backup-evidence-label">下一步：</span>${said(copy.next_step, '下一步')}`].filter(Boolean).join(' · ');
    if (failure) reasons.unshift(failure);
    const failureText = failedAt ? failedAt + (cause != null ? '：' + U.fieldText(cause, viewer) : '') : cause != null ? `失败原因：${U.fieldText(cause, viewer)}` : '';
    const first = anomaly || status ? `${name} ${lead}` : quantity ? `已读 ${name} ${quantity}` : checked || content ? name : '';
    return { name, text: [first, failureText, checked, content].filter(Boolean).join(' · '), lead, checked, content, quantity, why: reasons.join(' · '), anomaly, confirmed, retired };
  }
  function copySummary(d) {
    const copies = PLACES.map(([key, name]) => copyEvidence(d[key], key, name, d.copy_summary));
    const state = U.status(d);
    const available = [...copies].reverse().filter(c => !c.retired && c.text);
    const selected = available.find(c => c.anomaly) || available.find(c => c.confirmed) || available[0];
    const cloudProblems = Object.entries(CLOUDS).map(([key, name]) => copyEvidence(d[key], key, name)).filter(c => c.anomaly).map(c => c.text);
    const modern = !!d.copy_summary?.text, [headline, ...notes] = sp(d.copy_summary?.text).split('。'), checked = d.copy_summary?.checked_at && stamp(d.copy_summary.checked_at);
    const primary = modern ? copies[PLACES.findIndex(([key]) => key === d.copy_summary.target)] : selected;
    const extra = (!primary?.quantity || !primary?.checked) && available.find(c => c !== primary && !c.anomaly && c.quantity && c.checked);
    const reason = modern ? esc(notes.join('。').replace(/。$/, '')) : selected?.why;
    return { ...state, copies,
      text: [modern ? headline : selected?.text, modern && checked && !headline.includes(checked) && `${checked} 清单核对`,
        extra?.text && !headline.includes(extra.text) && extra.text, ...available.filter(c => c !== primary && c.anomaly).map(c => c.text), ...cloudProblems].filter(Boolean).join(' · '),
      why: [reason ? `${primary?.name ? esc(primary.name) + '：' : ''}${reason}` : (!(modern ? headline : selected) && esc(missing('副本情况'))), state.note].filter(Boolean).join('。') };
  }
  const STATE = { ready: '齐了', complete: '齐了', completed: '齐了', partial: '只核实了一部分', missing: '已确认没有副本', unknown: '尚未证实', queued: '在等', waiting: '在等', stable: '在等', stale: '旧了', failed: '没传成' };
  const VERIFIED = { sha256_verified: '完好（校验码对得上）', current_closure_and_sources_verified: '完好，用到的来源也都在', sha256_full_g_scope: 'G 盘上的全都核过', ok: '完好', failed: '没通过：文件坏了或对不上', reused: '上次核过、没动过，沿用' };
  // 恢复材料的技术原名（后台给的英文或内部名）换成看得懂的说法；没列到的照原名，只把内部代号换掉
  const KIT_NAMES = {
    'Veeam 系统镜像恢复 ISO': '系统整机恢复启动盘（Veeam）',
    '随 CoreRecovery 当前版本发布的 Veeam 整包校验工具': '检查恢复启动盘是否完好的工具',
    'Gigabyte X870E AORUS PRO ICE BIOS F4b fan profile backup': '主板风扇设置的备份',
    'Gigabyte X870E AORUS PRO ICE Rev 1.0 BIOS and local fan profile bundle': '主板 BIOS 和风扇设置整包',
    'Gigabyte X870E AORUS PRO ICE photo-derived core BIOS/UEFI settings record': '主板 BIOS 关键设置记录（照屏幕照片整理）',
    'Top-level recovery asset SHA256 manifest': '全部恢复材料的校验码清单',
    '备份区换新电脑的一条命令取回入口': '换新电脑时一条命令取回恢复材料',
  };
  const hero = $('hero'), heroRead = U.reading(hero.querySelector('.card__body'), { ghost: U.ghost.card(2), name: '一类备份' });
  const copiesRead = U.reading($('copies'), { ghost: U.ghost.rows(3), slow: false });
  const MATERIAL = { current: '当前材料', retained_historical: '保留的历史材料', technical_snapshot: '技术快照', registered_manifest_snapshot: '清单快照' };
  const ASSET_CATEGORY = { boot_media: '启动介质', recovery_tools: '恢复工具', bios_settings: 'BIOS 设置', documentation: '使用说明', windows_iso: 'Windows 安装镜像', winpe_build_material: 'WinPE 制作材料', drivers: '驱动程序', bios_drivers: 'BIOS 与驱动', hash_manifest: '校验清单', core_recovery: '恢复包核心材料' };
  let set = null, bundle = null, bundleSource, verification = null, verificationAt = null, viewer = 'public';
  Light.add(hero);
  // 从备份总表带着筛选（如“有问题”attention=gap）点进来的：“‹ 备份”回到原来那张带筛选的总表，能后退就直接后退（M115）
  const backLink = document.querySelector('[data-back]'), cameFrom = (() => { try { const u = new URL(document.referrer); return u.origin === location.origin && u.pathname === '/live/backups/' && u.search ? u : null; } catch { return null; } })();
  backLink.href = cameFrom ? cameFrom.pathname + cameFrom.search : route('/live/backups/');
  backLink.addEventListener('click', U.restoreBack);
  const bar = U.topbar({ ask: () => set ? `请看实况备份 ${sp(set.name || '一类备份')}：${copySummary(set).text}。请说明这类资料的副本和校验情况。` : '' });
  function showUnavailable(text = missing()) {
    heroRead.done(false); copiesRead.done(false); U.html($('head'), lampTo('') + U.head(text, { lamp: false })); $('rec').hidden = true; Light.tone(hero, null);
    if (id && !offline()) heroRead.set({ phase: 'none', data: null });
  }

  function waiting(cloud) {
    // 后端已确认两批互不重叠，合计后只展示一个“在等”数。
    const key = Object.hasOwn(set, 'transfer_summary') || Object.hasOwn(cloud || {}, 'queued') ? 'queued' : 'waiting';
    const values = [cloud?.[key], cloud?.stable].filter(Number.isFinite), count = values.length ? values.reduce((sum, n) => sum + n, 0) : null;
    return { count, key, lower_bound: cloud?.lower_bound === true || cloud?.q === 'unknown' || values.length < 2 || D.partial(cloud, key) || D.partial(cloud, 'stable') };
  }
  function showCoverage() {
    const coverage = $('coverage'), cloud = set[filesTarget], pending = waiting(cloud), transfer = set.transfer_summary;
    if (!coverage) return;
    const stale = transfer?.q === 'stale' || cloud?.refresh_state === 'failed';
    const quantity = (source, key) => source?.[key] === 0 && (source.lower_bound || D.partial(source, key)) ? '已读范围内 0' : count(source, key);
    const wait = pending.count == null ? '待传份数尚未核实' : pending.count === 0 && !pending.lower_bound && !stale ? '没有在等的' : `待传 ${quantity(pending, 'count')} ${D.transferUnit(filesTarget)}`;
    const failure = cloud?.failed == null ? '失败份数尚未核实' : `失败 ${quantity(cloud, 'failed')} ${D.transferUnit(filesTarget)}`;
    const since = pending.count > 0 && cloud?.pending_oldest_at ? ` · 最早一份从 <span class="backup-time">${esc(U.date(cloud.pending_oldest_at))}</span> 起在等` : '';
    const reason = (pending.lower_bound || cloud?.failed == null || stale) && (absentReason(cloud, pending.key) || absentReason(cloud, 'stable') || absentReason(cloud, 'failed') || cloud?.gap || transfer?.reason);
    U.html(coverage, notApplicable(transfer) || notApplicable(cloud) ? '云端传输不适用' : `${CLOUDS[filesTarget]} · ${stale ? '上次记录 · ' : ''}${wait} · ${failure}${since}${reason ? ` · ${said(reason, '云端传输说明')}` : ''}`);
    coverage.hidden = false;
  }

  function locationHtml(copy, paths, note) {
    const loc = copy?.location, entries = loc?.paths || paths || (loc?.path != null ? [{ path: loc.path }] : null);
    if (entries?.length) return `${pathHtml(entries[0].path)}${entries.length > 1 ? `<details><summary>共 ${entries.length} 个位置，另有 ${entries.length - 1} 个</summary><ul class="backup-locations">${entries.slice(1).map(p => `<li>${pathHtml(p.path)}</li>`).join('')}</ul></details>` : ''}`;
    if (note) return said(note, '本机原件说明');
    const reason = copy?.missing?.location?.reason_code;
    return said(({ generated_from_system_inventory: '由系统信息生成，没有原件目录', task_profile_binding_unavailable: '这次备份使用的用户目录还没记录', backup_manifest_unavailable: '备份清单暂时读不到', source_config_unavailable: '来源配置暂时读不到', not_recorded: '还没记录位置', read_failed: '位置读取失败', not_applicable: '不适用' })[reason] || (offline() ? '—' : U.collectionText('备份位置')), '备份位置');
  }
  function verificationTime(row) {
    return row.at && row.at_precision && !['run_completed', 'not_recorded'].includes(row.at_precision) ? stamp(row.at) : '';
  }
  function renderSet() {
    for (const key of ['copies-section', 'points-section', 'files-section']) $(key).hidden = false;
    document.title = `${sp(set.name || '一类备份')} · 实况`;
    const { copies, ...summary } = copySummary(set);
    U.html($('head'), lampTo(summary.lamp) + U.head(set.name || '一类备份', { lamp: false }));
    const size = set.bytes == null ? '' : [count(set, 'bytes', U.gb), D.sizeEvidence(set, stamp)].filter(Boolean).join(' · ');
    U.html($('meta'), `${size ? `<span>${esc(size)}</span>` : ''}${gap(set)}`); $('meta').hidden = !$('meta').textContent;
    const overview = $('copy-overview');
    U.html(overview.querySelector('div'), [summary.text && `<p>${said(summary.text, '副本情况摘要')}</p>`, summary.why && `<p>${summary.why}</p>`].filter(Boolean).join(''));
    overview.hidden = !summary.text && !summary.why;
    U.html($('actions'), actionHtml(set));
    Light.tone(hero, set);
    $('media-section').hidden = id !== 'personal_media';
    if (id === 'personal_media') U.html($('media-counts'), table(['类别', '个数', '大小'], [['photos', '照片'], ['videos', '视频'], ['music', '音乐'], ['audio', '录音']].map(([key, name]) => { const m = set.media?.find(m => m.id === key); return [name, count(m, 'count') + gap(m), esc(count(m, 'bytes', U.gb.scaled))]; }), '照片、视频、音乐、录音'));
    U.html($('copies'), table(['去处', '本地文件夹', '情况', '内容时间', '核对时间'], PLACES.map(([key, name], i) => {
      const copy = set[key], c = copies[i], localNote = key === 'local' && set.local_location_note;
      if (c.skip) return [name, localNote ? said(localNote, '本机原件说明') : '—', '不适用', '—', '—'];
      const detail = [copy?.bytes != null && esc(count(copy, 'bytes', U.gb)), copy && c.why, key === 'local' && esc(D.sourceSubset(copy, stamp)), c.retired && copy.reason && said(copy.reason, '停用说明')].filter(Boolean).join(' · ');
      return [`${name}${copy?.scope ? `<small>${said(copy.scope === set.id ? set.name : copy.scope, '备份范围')}</small>` : ''}`, locationHtml(copy, key === 'local' ? set.local_paths : null, localNote), `${esc(c.lead)}${detail ? `<small>${detail}</small>` : ''}${gap(copy)}` || '—', evidenceTime(c.content), evidenceTime(c.checked)];
    })));
    const targets = notApplicable(set.transfer_summary) ? [] : Object.keys(CLOUDS).filter(key => !notApplicable(set[key])), clouds = targets.filter(key => set[key]);
    $('cloud-section').hidden = !targets.length;
    U.html($('cloud'), table(['去处', '位置', '已传 / 共', '在等', '没传成'], clouds.map(key => {
      const cloud = set[key], pending = waiting(cloud);
      return [`${key === 'drive' ? 'Drive' : '照片云'}${cloud.scope ? `<small>${said(cloud.scope, '备份范围')}</small>` : ''}`, locationHtml(cloud), `${offline() && cloud.sent == null && cloud.total == null ? '—' : D.pair(cloud, key)}${cloud.q === 'partial' ? '' : D.progress(cloud.sent, cloud.total)}${gap(cloud)}`, `${D.transferCount(pending, 'count', key)}${cloud.eligible_at && pending.count > 0 ? `<small>${stamp(cloud.eligible_at)} 后再传</small>` : ''}`, D.transferCount(cloud, 'failed', key)];
    }), '云端这一轮'));
    if (!targets.includes(filesTarget) && targets.length) resetFiles(clouds[0] || targets[0]);
    const groups = bundle.restore?.filter(group => group.set === id);
    const points = groups?.flatMap(group => (group.points || []).map(p => ({ ...p, kind: group.kind }))).sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
    const latest = points?.find(p => p.at), restore = set.restore_summary;
    const dates = [...new Set([restore?.earliest_date, restore?.latest_date].filter(Boolean))].join(' 至 ');
    const restoreResult = Object.hasOwn(set, 'restore_summary')
      ? restore?.count == null || restore.q === 'unknown' ? said(restore?.reason || missing('恢复点清单'), '恢复点清单')
        : [restore.q === 'stale' && '上次记录', `恢复点 ${D.count(restore, 'count')} 个`, dates && `可退回 ${dates}`, restore.reason].filter(Boolean).map(value => said(value)).join(' · ')
      : esc(latest ? `最近可退回 ${stamp(latest.at)}` : groups?.length && groups.every(g => g.q === 'ok' && g.points?.length === 0 && !g.gap)
        ? '已核实没有恢复点' : Array.isArray(groups) ? '已读清单未列出这类恢复点' : missing('恢复点清单'));
    const oldMirror = point && id === 'system_images' && bundleSource === 'copy';
    const selectedPoint = !oldMirror && points?.find(p => p.id === point);
    const pointMissing = oldMirror ? '浏览器旧缓存不能确认书签指定的恢复点，下面只列缓存中的恢复点。'
      : point && id !== 'recovery-kit' && !selectedPoint
        ? groups?.some(group => group.q === 'ok') ? '这条链接无法定位原恢复点，下面是当前清单。' : '这次没有读到可供定位的恢复点清单。' : '';
    if (pointsResult) { U.html(pointsResult, [pointMissing, restoreResult].filter(Boolean).join(' · ')); pointsResult.hidden = false; }
    const seen = new Set(), notes = (...parts) => parts.filter(text => text && !seen.has(text) && seen.add(text)).map(sp).join(' · ');
    const fullDate = at => at ? `${new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(at))} ${U.time(at)}` : '';
    const restored = U.mergePrivateRows(points || [], { value: p => p.scope || p, kind: viewer }).map(p => {
      if (p.private_count) return { key: p.key, cls: 'run', html: U.privateSummary(p.private_count) };
      const history = p.restored_at ? `恢复过 · ${stamp(p.restored_at)}` : p.history_from ? `从 ${U.date(p.history_from)} 起没有整机恢复过` : '', group = groups.find(group => group.points?.some(pt => pt.id === p.id));
      const extra = p.id === group?.points?.[0]?.id ? notes(group.restore_sessions?.text, group.gap) : '', note = [history, notes(p.gap), extra].filter(Boolean).join(' · ');
      const picked = p === selectedPoint, kind = p.kind === 'system' ? '整机恢复' : '文件恢复';
      // 恢复点自己的范围和这类资料名不同才写，写成“范围：…”，不和页头的资料名抢名字。
      const scope = p.scope && sp(U.fieldText(p.scope, viewer)) !== sp(U.fieldText(set.name, viewer)) ? ` · 范围：${said(p.scope, '备份范围')}` : '';
      // 点了“这份 ›”或从别处带着这一份进来：这一份多写一行它在哪、哪一天，前面同一句没写过的说明也补上。
      const where = PLACES.find(([key]) => key === p.target)?.[1] || CLOUDS[p.target], gapText = p.gap ? sp(U.fieldText(p.gap, viewer)) : '';
      const pickedFacts = picked ? [p.at && `这一份：${fullDate(p.at)} 的${kind}点`, where && `存在 ${where}`, gapText && !note.includes(gapText) && gapText].filter(Boolean).join(' · ') : '';
      // 这一份多大（1024 进制）、核对到哪一步、要恢复怎么做：后台给的 bytes、bytes_note、verification、restore_how；大小每份都写，其余点开这一份再写
      const size = Number.isFinite(p.bytes) ? U.gb.scaled(p.bytes) : '';
      const pickedMore = picked ? [['大小', [size, p.bytes_note].filter(Boolean).join('。')], ['核对', p.verification], ['怎么恢复', p.restore_how]].filter(([, v]) => v).map(([k, v]) => `${k}：${U.fieldHtml(v, { name: '恢复点说明', kind: viewer })}`).join('<br>') : '';
      return { key: p.id, cls: `run${picked || (!point && p === points[0]) ? ' is-now' : ''}${picked ? ' is-picked' : ''}`, html: `${U.status(p, { small: true }).lamp}<p class="run__main"><a class="fe-l3b-point" ${picked ? 'aria-current="true"' : ''} href="${esc(route(`/live/backup/?id=${encodeURIComponent(id)}&point=${encodeURIComponent(p.id)}`))}">${stamp(p.at)} <span>${picked ? '就是这份' : '这份 ›'}</span></a></p><p class="fe-l3b-point-note">${kind}${size ? ` · ${esc(size)}` : ''}${scope}${note ? `<br>${U.fieldHtml(note, { name: '备份内容', kind: viewer })}` : ''}</p>${pickedFacts ? `<p class="fe-l3b-point-pick">${U.fieldHtml(pickedFacts, { name: '备份内容', kind: viewer })}</p>` : ''}${pickedMore ? `<p class="fe-l3b-point-pick">${pickedMore}</p>` : ''}` };
    });
    for (const group of groups || []) { const text = group.points?.length ? '' : notes(group.restore_sessions?.text, group.gap); if (text) restored.push({ key: `restore-history:${group.kind}`, cls: 'run', html: `<p class="fe-l3b-point-note">${U.fieldHtml(text, { name: '备份内容', kind: viewer })}</p>` }); }
    const failedRows = (groups || []).flatMap(group => (group.failed_points || []).map(p => {
      const status = p.state === 'unknown' ? '未核实' : '备份失败';
      const reason = p.reason ? `<p class="fe-l3b-point-note">${said(p.reason, '失败原因')}</p>` : '';
      return { key: `restore-failed:${group.kind}:${p.id ?? p.at}`, cls: 'run',
        html: `<p class="run__main">${stamp(p.at)} · ${status}</p>${reason}` };
    }));
    restored.splice(points?.length ? 1 : 0, 0, ...failedRows);
    if (point) pointLimit = Math.max(pointLimit, restored.findIndex(row => row.key === point) + 1);
    U.list($('points'), restored.length || pointsResult ? restored.slice(0, pointLimit) : [{ key: 'none', cls: 'run run--empty', html: `<p class="run__none">${restoreResult}</p>` }]);
    nextBatch($('points-section'), restored.length, pointLimit, () => { pointLimit += 5; renderSet(); });
    // 带着某一份进来（总表、首页、列表里的链接）：页面停稳后滚到这一份，它一直亮着。
    if (selectedPoint && pointShown !== point) {
      pointShown = point;
      const row = [...$('points').children].find(li => li.dataset.key === point), start = performance.now();
      const go = () => {
        if (document.documentElement.classList.contains('mo-hide') && performance.now() - start < 2000) { requestAnimationFrame(go); return; }
        row?.scrollIntoView({ block: 'center', behavior: 'instant' });
      };
      requestAnimationFrame(go);
    }
    showCoverage();
    for (const control of [filesButton, filesFold]) if (control) control.hidden = !targets.length;
    $('files-target-label').hidden = id !== 'personal_media' || targets.length < 2;
    if (targets.length && filesOpen()) watchFiles();
    $('rec').hidden = false;
    if (verification) renderVerification();
    heroRead.done(); copiesRead.done();
    Light.lightUp([hero, ...$('points').children]);
  }

  function renderVerification() {
    const d = verification;
    if (!d) return;
    if (point && d.point && d.point !== point) {
      U.html($('verified'), `<p class="fe-l3b-note">${esc(missing('这份备份核对的结果'))}</p>`);
      return;
    }
    if (!set) {
      $('rec').hidden = false;
      for (const key of ['copies-section', 'cloud-section', 'points-section', 'files-section']) $(key).hidden = true;
      U.html($('head'), lampTo(U.status(d).lamp) + U.head('恢复材料 · 校验结果', { lamp: false }));
      document.title = '恢复材料校验 · 实况'; Light.tone(hero, d);
    }
    const results = d.rows?.flatMap(row => row.conclusions || []).map(c => c.status) || [], verified = ['sha256_verified', 'current_closure_and_sources_verified', 'reused', 'ok'];
    if (d.file_count == null && !results.length && !d.status) { U.html($('verified'), `<p class="fe-l3b-note">${esc(missing('这份备份核对的结果'))}</p>`); return; }
    const result = results.some(status => status === 'failed') ? '有文件没有通过核对' : results.length && results.every(status => verified.includes(status)) || verified.includes(d.status) ? '核对通过' : offline() ? '' : U.collectionText('核对结果', d);
    const fullDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' });
    const completed = d.at ? `${fullDate.format(new Date(d.at))} ${U.time(d.at)} 核完` : '';
    const gScope = d.scope === 'registered_g_assets_and_retained_technical_snapshot_integrity';
    const scope = gScope ? '范围：G 盘登记的恢复材料及保留的技术快照' : '';
    const excluded = gScope && d.excluded_non_g_count > 0 ? `另有 ${count(d, 'excluded_non_g_count')} 项未纳入本轮` : '';
    const text = [[result, completed].filter(Boolean).join(' · '), [scope, excluded].filter(Boolean).join(' · '),
      gScope && '只核对材料完整性，未做实际启动或恢复验证。',
      d.file_count == null ? offline() ? '' : U.collectionText('核对的文件数', d) : `这次核对了 ${count(d, 'file_count')} 份文件`,
      viewer === 'public' && Object.hasOwn(d, 'file_name_count') && nameSentence(d.file_name_count, '这次核对的'),
      d.freshly_hashed_file_count != null && d.reused_member_count != null ? (d.reused_member_count > 0 ? `其中 ${count(d, 'freshly_hashed_file_count')} 份这次重新算了一遍校验码；另外 ${count(d, 'reused_member_count')} 份上次核过以后没动过，沿用上次的结果` : `${count(d, 'freshly_hashed_file_count')} 份都重新算了一遍校验码`) : '', U.olderNote?.(d.at, d)].filter(Boolean);
    const summary = text.length ? `${point && !d.point ? `<p class="fe-l3b-note">${offline() ? '下面是最近一次核对，未对应到这份备份。' : `${U.collectionText('这一份的对应结果', d)}，下面是最近一次核对。`}</p>` : ''}${text.map(line => `<p class="fe-l3b-note">${said(line)}</p>`).join('')}` : `<p class="fe-l3b-note">${esc(missing('这份备份核对的结果'))}</p>`;
    const timed = d.rows?.some(row => verificationTime(row));
    // 每样恢复材料一行：先写看得懂的名字和核对结果；后台的技术原名、文件位置收在“原名和位置”里，要查再点开
    const kitName = row => { const raw = U.fieldText(row.name, viewer).trim(); return Object.hasOwn(KIT_NAMES, raw) ? KIT_NAMES[raw] : raw.replace(/CoreRecovery/g, '电脑恢复包'); };
    const kitOrigin = row => { const raw = U.fieldText(row.name, viewer).trim(), paths = (row.conclusions || []).filter(c => c.path), renamed = raw && kitName(row) !== raw;
      // 本人版：恢复材料的位置不给访客的，后台在这条结论的 visitor_labels.path 上标 hidden，位置旁挂签
      const pathTag = c => { const tag = U.visitorLabel(c, 'path', '这个位置', viewer); return tag ? ` ${tag}` : ''; };
      return renamed || paths.length ? `<details class="backup-path"><summary>原名和位置</summary><div>${[renamed && said(row.name, '资产名称'), ...paths.map(c => pathHtml(c.path, '恢复材料路径') + pathTag(c))].filter(Boolean).join('<br>')}</div></details>` : ''; };
    const assets = d.rows?.length ? table(['哪一类', '是什么', '核对结果', '几份文件', ...(timed ? ['核对时间'] : [])], d.rows.slice(0, assetLimit).map(row => [said(ASSET_CATEGORY[row.category] || row.category, '资产类别'), `${esc(kitName(row))}${(row.groups || []).length ? `<small>${(row.groups || []).map(group => said(MATERIAL[group] || group, '材料分组')).join('、')}</small>` : ''}${kitOrigin(row)}`, (row.conclusions || []).map(c => said(VERIFIED[c.status] || c.status, '校验结论')).join('<br>'), count(row, 'count'), ...(timed ? [verificationTime(row)] : [])]), '每样恢复材料核对得怎样', completed) : '';
    U.html($('verified'), summary + assets);
    nextBatch($('verified'), d.rows?.length || 0, assetLimit, () => { assetLimit += 5; renderVerification(); });
  }

  let filesWatch = null, filesHead = null, filesRequest = null, filesState = null, filesTarget = 'drive';
  const pointsResult = $('points-result'), filesButton = $('files-more'), filesFold = $('files-fold'), filesOpen = () => filesButton?.getAttribute('aria-expanded') === 'true';
  const files = $('files'), filesStatus = $('files-status');
  const ownerFile = value => value?.hidden_block || value?.hidden || value?.visibility === 'owner' || value?.public === 'owner';
  const fileName = value => viewer === 'public' && ownerFile(value) ? '—' : pathHtml(value, '文件名');
  // 本人版：后台在这一条文件的 visitor_labels 里标了文件名（name；旧条目用 file_name、filename、relative_path 同名键）的，文件名旁挂签，一条只挂一个；没标的不挂
  const fileTag = item => { const tag = U.visitorLabel(item, ['$', 'name', 'file_name', 'filename', 'relative_path'], '这个文件名', viewer); return tag ? ` ${tag}` : ''; };
  const privateNames = d => /^文件名(?:仅本人|可信设备)可见[。.]?$/u.test(typeof d?.text === 'string' ? d.text : '');
  // 新私事规则（本人 11-24 02:56）：备份文件名访客版不给，原位按后台给的 file_name_count 拼一句普通字，说清有多少个、本人版能看到全部；
  // 0 是已读且空（不写），null 是没读到或来源本来没有清单（不编数）。
  // 本人版不再在清单上方挂一个“访客看不到”：现在访客回包里照列文件名，访客看不到或换了说法的由后台逐条标在 visitor_labels 上，逐条挂签（fileTag）。
  const countWords = n => n >= 10000 ? `${(Math.round(n / 1000) / 10).toLocaleString('zh-CN')} 万个` : `${n.toLocaleString('zh-CN')} 个`;
  // 个人影音的清单是待传、失败和未核对的名册（scope: pending_or_failed），句子写明是这类名册（后台 03:53 定稿）。
  const nameSentence = (n, what, pending = false) => Number.isSafeInteger(n) ? n > 0 ? (pending ? `这里是 ${countWords(n)}待传、失败或未核对的文件名，本人版能看到全部，所以不予展示` : `这里是${what} ${countWords(n)}文件名，本人版能看到全部，所以不予展示`) : ''
    : pending ? '这里是待传、失败或未核对的文件名，本人版能看到全部，所以不予展示' : `这里是${what}文件名，本人版能看到全部，所以不予展示`;
  function filePrivacy(d) {
    const slot = $('files-privacy'), counted = Number.isSafeInteger(d?.file_name_count);
    // 访客回包里列了文件就照列（名字给了就是能看），只有名字真被收起的才写那句；没列清单的照旧按 file_name_count 写。
    const listed = viewer === 'public' && Array.isArray(d?.items) && d.items.length > 0;
    const withheld = !notApplicable(d) && (listed ? d.items.some(item => ownerFile(item.name)) : counted ? d.file_name_count > 0 : privateNames(d) || (d?.hidden_count ?? d?.hidden) > 0);
    const html = !withheld || viewer === 'owner' ? '' : esc(nameSentence(counted ? d.file_name_count : null, '这次备份的', d?.scope === 'pending_or_failed'));
    if (slot) { U.html(slot, html); slot.hidden = !html; }
  }
  function stopFiles() {
    filesWatch?.stop();
    filesWatch = null;
    filesStatus.textContent = '';
  }
  function resetFiles(target = filesTarget, keepDisplayed = false) {
    stopFiles();
    filesTarget = target; $('files-target').value = target;
    filesHead = filesRequest = filesState = null; fileLimit = 5;
    if (filesFold) filesFold._loaded = false;
    files.inert = keepDisplayed;
    if (!keepDisplayed) { U.html(files, ''); filePrivacy(null); }
  }
  const filesResource = () => `backups/${encodeURIComponent(id)}/files${params.has('fixture') && filesTarget === 'photos' ? '-photos' : ''}`;
  const filesQuery = cursor => ({ target: filesTarget === 'photos' ? 'photos' : null, cursor });
  const filesUnavailable = state => state.data == null || !offline() && [404, 503].includes(state.meta?.status)
    || state.viewer?.kind === 'owner' && viewer !== 'owner';
  function watchFiles() {
    if (!set || !filesOpen() || notApplicable(set.transfer_summary) || notApplicable(set[filesTarget])) return false;
    if (filesWatch) return true;
    if (!filesState) filesStatus.textContent = id === 'personal_media' ? `正在读「${CLOUDS[filesTarget]}」的明细…` : '正在读逐项明细…';
    filesWatch = window.Live.watch(filesResource(), filesQuery(null), {
      link(state) {
        if (state.data == null && ['idle', 'wait', 'slow'].includes(state.phase)) return;
        filesStatus.textContent = '';
        files.inert = false;
        if (filesUnavailable(state)) {
          if (!filesState) { filePrivacy(null); U.html(files, `<p class="fe-l3b-note">${esc(missing('在等、没传成的资料'))}</p>`); }
          return;
        }
        const head = JSON.stringify(state.data);
        if (head === filesHead) return;
        filesHead = head; filesRequest = null; filesState = state;
        filePrivacy(state.data); renderFiles(state);
      }
    });
    return true;
  }
  function loadFiles(cursor) {
    if (!cursor || !filesState || offline()) return false;
    if (filesRequest) return filesRequest;
    const request = window.Live.get(filesResource(), filesQuery(cursor)).then(state => {
      if (filesRequest !== request) return false;
      filesRequest = null;
      if (filesUnavailable(state) || state.viewer?.kind !== filesState?.viewer?.kind) return false;
      const prior = filesState.data.items || [], seen = new Set(prior.map(item => item.id));
      state = { ...state, data: { ...state.data, items: [...prior, ...(state.data.items || []).filter(item => !seen.has(item.id))] } };
      fileLimit += 5;
      filesState = state; filePrivacy(state.data); renderFiles(state); return true;
    });
    return filesRequest = request;
  }
  function renderFiles(state) {
    const d = state.data, files = d.items || [], named = files.filter(item => item.name != null);
    if (notApplicable(d)) { U.html($('files'), '<p class="fe-l3b-note">云端传输不适用</p>'); return; }
    const dated = files.filter(item => ['waiting', 'queued', 'stable'].includes(item.state)).map(item => Date.parse(item.at)).filter(Number.isFinite), clock = offline() ? state.at : state.now, oldest = d.oldest_wait_days ?? (dated.length && clock ? Math.max(0, Math.floor((Date.parse(clock) - Math.min(...dated)) / 86400000)) : null);
    const visible = named.filter(item => viewer !== 'public' || !ownerFile(item.name)).length;
    const concealed = viewer === 'public' && privateNames(d) && !visible;
    const totalKnown = !concealed && (d.hidden != null || d.total === 0 || visible > 0 && visible === files.length);
    const modern = Object.hasOwn(d, 'listable_count') || Object.hasOwn(d, 'hidden_count');
    const total = modern ? (d.listable_count == null ? null : count(d, 'listable_count'))
      : totalKnown && d.total != null ? count(d, 'total') : concealed ? '0' : Array.isArray(d.items) ? `${d.next || d.total > files.length ? '至少 ' : ''}${visible}` : null;
    const hidden = modern ? (d.hidden_count == null ? null : count(d, 'hidden_count'))
      : d.hidden != null ? count(d, 'hidden') : concealed && d.total > 0 ? count(d, 'total') : named.length > visible ? `至少 ${named.length - visible}` : null;
    const size = total == null ? '可列文件数尚未核实' : `可列文件 ${total} 条`, hiddenText = Object.hasOwn(d, 'file_name_count') ? '' : hidden != null ? `文件名未公开 ${hidden} 条` : modern || concealed ? '未公开文件名的条数尚未核实' : '';
    const showTime = id !== 'recovery-kit' || files.some(item => verificationTime(item));
    U.html($('files'), `<p class="fe-l3b-note">${[id === 'personal_media' ? CLOUDS[filesTarget] : '', size, hiddenText, oldest != null && `最早一份至少等了 ${said(oldest)} 天`].filter(Boolean).join(' · ')}${gap(d)}${d.text && !privateNames(d) ? `<br>${said(d.text)}` : ''}</p>`
      + (d.types?.length ? table(['资料类别', '份数'], d.types.filter(t => t.type).map(t => [said(t.type), count(t, 'count') + gap(t)]), '资料类别') : !Array.isArray(d.types) && !offline() ? `<p class="fe-l3b-note">${esc(U.collectionText('资料分类', d))}</p>` : '')
      + (named.length ? table(['资料', '去处', '情况 / 原因', ...(showTime ? ['时刻'] : [])], named.slice(0, fileLimit).map(item => [fileName(item.name) + fileTag(item), said(CLOUDS[item.target]), `${STATE[item.state] ? said(STATE[item.state]) : ''}${item.reason ? `<small>${said(item.reason, '没传成的原因')}</small>` : ''}`, ...(showTime ? [id === 'recovery-kit' ? verificationTime(item) : stamp(item.at)] : [])]), '在等、没传成的资料') : '') + (U.olderNote?.(state.at, state) ? `<p class="fe-l3b-note">${esc(U.olderNote(state.at, state))}</p>` : ''));
    const nextPage = fileLimit >= named.length && Boolean(d.next);
    nextBatch($('files'), named.length, fileLimit, async event => {
      if (!nextPage) { fileLimit += 5; renderFiles(state); return; }
      const button = event.currentTarget;
      button.disabled = true;
      button.textContent = '正在读…';
      if (!await loadFiles(d.next) && button.isConnected && !$('files').inert) {
        button.disabled = false;
        button.textContent = '这一批暂时读不到，重试 ›';
      }
    }, nextPage);
  }
  // 在本页点某一份的“这份 ›”：不重开整页，就地换成这一份亮着、多写它的那一行；地址照样带上这一份，复制出去还是它。
  $('points').addEventListener('click', e => {
    const link = e.target.closest('a.fe-l3b-point');
    if (!link || !set || id === 'recovery-kit' || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const next = new URL(link.href, location.href).searchParams.get('point');
    if (!next) return;
    e.preventDefault();
    point = pointShown = next; params.set('point', next);
    history.replaceState(history.state, '', `${location.pathname}?${params}${location.hash}`);
    renderSet();
    [...$('points').children].find(li => li.dataset.key === next)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
  if (filesButton && filesFold) {
    U.fold(filesButton, filesFold, watchFiles);
    filesButton.addEventListener('click', () => { if (filesOpen()) watchFiles(); else stopFiles(); });
  }
  $('files-target').addEventListener('change', e => {
    if (offline()) { e.target.value = filesTarget; return; }
    resetFiles(e.target.value, filesOpen()); showCoverage();
    if (filesOpen()) watchFiles();
  });
  if (!id) showUnavailable('没有说是哪类备份');
  else {
    window.Live.watch('backups', null, {
      phase(state) { if (!set) { heroRead.set(state); copiesRead.set(state); } },
      data(data, meta) {
        const next = data?.sets?.find(item => item.id === id) || null;
        if (viewer !== meta.viewer.kind || !next || !set ||
            notApplicable(next[filesTarget]) !== notApplicable(set[filesTarget])) resetFiles();
        viewer = meta.viewer.kind; bundle = data; set = next;
      },
      link(state) {
        bundleSource = state.meta?.source; disconnected = state.offline; bar?.set(state); Light.offline(state.offline);
        U.list($('notices'), state.offline ? [{ key: 'link', cls: 'notice glass', html: esc(state.text) }] : []);
        if (!state.offline && [404, 503].includes(state.meta?.status)) showUnavailable();
        else if (set) renderSet();
        else if (bundle || state.phase === 'none') {
          showUnavailable();
          if (verification) renderVerification();
        } else { heroRead.set(state); copiesRead.set(state); if (state.phase === 'gone') $('rec').hidden = true; }
        [hero.querySelector('.card__body'), $('copies-section')].forEach(el => U.blockNote(el, state));
      }
    });
    if (id === 'recovery-kit') {
      $('verification').hidden = false;
      const read = U.reading($('verified'), { ghost: U.ghost.rows(3), name: '这份备份核对的结果' });
      window.Live.watch('backups/recovery-kit/verification', point ? { point } : null, {
        phase(state) { if (!verification) read.set(state); },
        data(data, meta) { viewer = meta.viewer.kind; verification = data; verificationAt = meta.at; },
        link(state) {
          if (!state.offline && [404, 503].includes(state.meta?.status)) read.set({ ...state, data: null, phase: 'none' });
          else if (verification) { renderVerification(); read.done(); }
          else { read.set(state); if (state.phase === 'none') U.html($('verified'), `<p class="fe-l3b-note">${esc(missing('这份备份核对的结果'))}</p>`); }
          U.blockNote($('verification'), state);
        }
      });
    }
  }
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();

