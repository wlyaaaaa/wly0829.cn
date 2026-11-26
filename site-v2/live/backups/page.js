// 备份：各类副本安静排一行，内容时间和核对时间分开，恢复不推断起算日前的历史。
(() => {
  'use strict';
  const U = window.LiveUI, L = window.LiveLight, D = window.LiveDataViz, $ = id => document.getElementById(id), { esc, sp } = U;
  let disconnected = false;
  const offline = () => U.offline?.() ?? disconnected, missing = (name = '备份') => offline() ? '这块没存下来，连上后补上。' : `${name}暂时读不到`;
  const inventoryUnknown = d => !d?.sets?.length && d?.summary?.sets == null && (!d?.summary || d.summary.q === 'unknown');
  const p = new URLSearchParams(location.search), hero = $('hero'), stamp = at => at ? `${U.date(at)} ${U.time(at)}` : offline() ? '' : U.collectionText();
  const route = href => { const u = new URL(href, location.href); if (p.has('fixture')) u.searchParams.set('fixture', p.get('fixture')); return u.pathname + u.search + u.hash; };
  const empty = text => [{ key: 'empty', cls: 'row row--flat row--empty', html: `<span></span><p class="row__sub">${U.fieldHtml(text, { name: '备份', place: 'body', kind: viewer })}</p>` }];
  const names = { local: '本机', g: 'G 盘', h: 'H 盘', drive: 'Drive', photos: '照片云' };
  const protection = s => s.protection ?? D.protection(s.g?.retired === true ? { ...s, g: null } : s);
  const hasBackupProblem = state => ['gap', 'local_copy_no_cloud', 'stale'].includes(state);
  const TIER = { success: ['complete', '齐了'], mostly_successful: ['mostly', '大部分成功'], partial_success: ['partial', '部分成功'], failed: ['failed', '备份失败'] };
  // 20 类资料按重要性固定排（本人 11-25 选的 A），总表、左栏、右栏都照这个顺序，不再按状态或副本日期挪：
  // 丢了找不回的 → 自己做的和记下的 → 重装电脑和 AI 时用的 → 旧存档和能重新下载的。后台新加的类排最后，更新网站时照重要性排进来（docs/update.md 第九节）
  const IMPORTANCE = [
    'password_center_recovery_sets', 'personal_data', 'personal_media', 'wechat', 'documents_and_local_saves',
    'g_projects', 'timeaudit', 'ai_usage_ledger', 'codex_conversations', 'clipboard_history',
    'core_recovery_context', 'recovery-kit', 'devconfig', 'system_images', 'local_toolbox', 'software_environment',
    'other_ai_memory', 'codex_memory', 'g_software', 'downloads_personal_data',
  ];
  const byImportance = (list, key = x => x.id) => list.map((x, i) => [x, IMPORTANCE.indexOf(key(x)), i])
    .sort((a, b) => (a[1] < 0 ? IMPORTANCE.length : a[1]) - (b[1] < 0 ? IMPORTANCE.length : b[1]) || a[2] - b[2]).map(([x]) => x);
  // 总表每格最后画成什么（状态、字），左栏“为什么”和右栏“副本旧了”照它说，和总表同一个说法
  const cells = new Map(), cellOf = (id, key) => cells.get(`${id}:${key}`);
  const BAD = ['stale', 'gap', 'mostly', 'partial', 'failed'];
  // 后台恢复说明换成人话；没对上的原样显示
  const PLAIN = [[/软件没有列出取回了哪些文件/, '没记取回了哪些文件'], [/恢复结果存在选定的还原目录旁，没有集中记录/, '从这里恢复的文件放在你选的目录旁，没有统一记录'],
    [/现有记录只覆盖文件恢复操作，离线整机还原没有可查的记录/, '离线整机还原不留记录，这里查不到']];
  // 访客版不对访客称“你”：“放在你选的目录旁”写成“放在本人选的目录旁”（r83 返修第三轮）
  const plain = text => { const hit = typeof text === 'string' ? PLAIN.find(([re]) => re.test(text))?.[1] : undefined; return hit && viewer === 'public' ? hit.replaceAll('你', '本人') : hit; };
  let data = null, headline = '', lit = false, viewer = 'public';
  const homeRead = U.reading(hero.querySelector('.card__body'), { ghost: U.ghost.card(1), name: '备份' });
  const detailReads = [U.reading($('sets').closest('.l2-col'), { ghost: U.ghost.rows(4) }), U.reading($('restore'), { ghost: U.ghost.rows(3), slow: false })];
  const bar = U.topbar({ ask: () => `请看实况备份：${headline || U.collectionText()}。请说明现在的情况。` });
  L.add(hero); U.fold($('more'), $('rest-box')); document.querySelector('[data-back]').href = route('/live/#backups');
  // 右栏每类小标题右边的“展开／收起”：状态记在按钮的 aria-expanded 上，刷新重画时保留
  $('points').addEventListener('click', e => { const btn = e.target.closest('.backup-toggle'); if (btn) btn.setAttribute('aria-expanded', String(btn.getAttribute('aria-expanded') !== 'true')); });
  document.querySelector('[data-back]').addEventListener('click', U.restoreBack);
  // 表格里的时刻、计数各自不断开；格子窄时，开头的说明（如“副本内容日期”“G 盘副本 ·”）也整体不断开，只在说明和时刻之间折行，“份 · 按”“没核实”连在一起（M781）；
  // 时刻里的日期和钟点各包一层，窄窗口的大小列放不下整个时刻时只在两者之间折行（见页内样式）；时刻后面紧跟的句号、逗号等一起包进去，折行时不剩一个“。”在下一行开头
  const tableText = value => esc(value).replace(/(?:\d{4}-)?\d{2}-\d{2} \d{2}:\d{2}[。，、；）]?|\d+ 类(?:读到记录|本次没读到|未登记|不适用)|不适用|\d+ 项读数不完整/g, m => /^(?:\d{4}-)?\d{2}-\d{2} \d{2}:\d{2}[。，、；）]?$/.test(m) ? `<span class="backup-unit backup-at"><span>${m.replace(' ', '</span> <span>')}</span></span>` : `<span class="backup-unit">${m}</span>`)
    .replace(/^([^\s<\d][^<]{0,8}?) (?=<span class="backup-unit[^"]*">(?:<span>)?\d)/, '<span class="backup-unit">$1</span> ').replace(/ (份 · 按) /, ' <span class="backup-unit">$1</span> ').replace(/没核实/g, '<span class="backup-unit">$&</span>').replace(/ 清单$/, ' <span class="backup-unit">清单</span>');
  const wrapSummary = html => html.replace(/ · (?![^<]*>)/g, '&nbsp;· ');
  const points = (d, id) => (d.restore || []).filter(r => r.set === id).flatMap(r => (r.points || []).map(pt => ({ ...pt, kind: r.kind })));
  const restoreText = (d, s) => {
    const coverage = s?.restore_summary;
    if (coverage?.count != null && coverage.q !== 'unknown') return coverage.count === 0 && !coverage.lower_bound && !D.partial(coverage, 'count')
      ? '没有恢复点' : `恢复点 ${D.count(coverage, 'count')} 个`;
    if (coverage?.reason) return ({
      '这次没有读到恢复点清单': '没读到恢复点清单',
      '这类备份没有登记恢复点清单': '未登记恢复点清单',
    })[coverage.reason] || coverage.reason;
    if (s?.missing?.restore || s?.restore?.applicable === false) return U.collectionText('', s.restore?.applicable === false ? s.restore : s, null, 'restore');
    if (!Array.isArray(d.restore)) return U.collectionText('恢复点清单', d, null, 'restore').replace(/^这次没有读到恢复点清单$/, '没读到恢复点清单');
    const group = d.restore.find(r => r.set === s?.id);
    if (s ? Array.isArray(group?.points) && !D.partial(group, 'points') : !D.partial(d, 'restore')) return '没有恢复点';
    return '已读清单未列出恢复点';
  };
  // 后端已确认等待与暂缓互不重叠；相加后只展示一个“在等”数。
  const waiting = cloud => { const values = ['waiting', 'stable'].map(k => cloud?.[k]).filter(n => n != null); return { count: values.length ? values.reduce((sum, n) => sum + n, 0) : null, q: values.length < 2 || D.partial(cloud, 'waiting') || D.partial(cloud, 'stable') ? 'partial' : 'ok' }; };
  const gap = item => offline() && /还在采集|从 \d{2,4}-\d{2}(?:-\d{2})? 开始记|还没读到|未读/.test(item?.gap || '') ? '' : item?.q === 'partial' && item.gap ? `<small>${U.fieldHtml(item.gap, { name: '备份说明', place: 'body', kind: viewer })}</small>` : '';
  const actionHtml = s => { const list = s.actions?.length ? s.actions : [{ kind: 'copy', label: '问情况', intent: 'ask' }]; return U.actions(s, list).replace(/<(button|a)\b([^>]*data-(?:act|open)="(\d+)"[^>]*)>/g, (tag, kind, attrs, i) => list[i].kind === 'open' || /^(我办完了|不办了|晚点提醒|在电脑上打开|打开对话|打开汇报|Grafana)/.test(list[i].label || '') ? `<${kind}${attrs} data-needs-pc>` : tag); };
  const emptyWord = value => /^(?:没有记录|未记录|不适用|—)$/.test(sp(U.fieldText?.(value, viewer) ?? value).trim());
  // 左栏只列要留意的几类：总表里有一格标了颜色（副本旧了、这轮没备全或失败），或后台判了有备份问题
  const noticed = s => !s.private_count && (hasBackupProblem(protection(s)) || ['g', 'h', 'drive', 'photos'].some(k => BAD.includes(cellOf(s.id, k)?.state)));
  // 一句为什么：先说出问题的去处，再说哪里已备好、哪里没核实；字和总表那一格同一个说法
  function whyLine(s) {
    const problems = [], fine = [], unchecked = [];
    for (const key of ['g', 'h', 'drive', 'photos']) {
      const c = cellOf(s.id, key); if (!c) continue;
      const copy = s[key] || {}, o = copy.outcome || {}, where = names[key], n = v => Number.isInteger(v);
      if (c.state === 'stale') problems.push(`${where}副本旧了${copy.content_at ? `，停在 ${stamp(copy.content_at).trim()}` : ''}`);
      else if (c.state === 'mostly') problems.push(`${where}这轮大部分成功${n(o.failed) ? `，${o.failed} 份没备上` : ''}`);
      else if (c.state === 'partial') problems.push(`${where}这轮部分成功${n(o.ok) && n(o.failed) ? `，备上 ${o.ok} 份、没备上 ${o.failed} 份` : ''}`);
      else if (c.state === 'failed') problems.push(`${where}这轮备份失败`);
      else if (c.state === 'gap') problems.push(`${where}${c.label}`);
      else if (c.state === 'complete') fine.push(where);
      else if (c.state === 'unknown' && (key === 'g' || key === 'h')) unchecked.push(where);
    }
    const tail = [fine.length && `${fine.join('、')}已备好`, unchecked.length && `${unchecked.join('、')}没核实`].filter(Boolean);
    return problems.length ? esc(problems.join('；') + (tail.length ? `，${tail.join('；')}` : '')) : '';
  }
  function setRow(s, d) {
    if (s.private_count) return { key: s.key || s.id, cls: 'row row--flat row--empty', html: `<span></span><p class="row__sub">${U.privateSummary(s.private_count, { unit: '类资料' })}</p>` };
    const state = U.status(s, { small: true, cover: d }), name = U.fieldHtml(s.name, { name: '备份资料', place: 'title', kind: viewer }), nameNote = U.fieldHtml(s.name, { name: '名称', place: 'body', kind: viewer });
    const sub = [whyLine(s) || state.note, nameNote !== name ? nameNote : ''].filter(Boolean).join(' · ');
    const category = protection(s), marks = new Set(['is-attention', `attention-${category}`]);
    if (hasBackupProblem(category)) marks.add('attention-gap');
    return { key: s.id, cls: ['row row--flat', ...marks].join(' '), html: `${state.tone === 'green' ? '' : state.lamp}<div class="row__text"><p class="row__main"><a class="row__title" href="${esc(route(`/live/backup/?id=${encodeURIComponent(s.id)}`))}">${name} <span class="more__chev">›</span></a></p>${sub ? `<p class="row__sub">${sub}</p>` : ''}</div><div class="row__acts">${actionHtml(s)}</div>` };
  }
  function mergedTable(d, confirmedH, emptySets) {
    const field = (value, name) => U.fieldHtml(value, { name, place: 'body', kind: viewer });
    // 说明整句摆出来：不截成“…”，也不做成点开只是同一句话的展开。
    const explain = (value, name) => `<small>${field(value, name)}</small>`;
    const batchFailed = d.read_error === true;
    const local = d.columns?.local;
    const localNote = local?.note ?? (local?.has_inventory_gaps ? '现有备份记录没有完整的本机原件库存' : !local ? d.coverage?.local_note : '');
    const retainedAt = d.at ? stamp(d.at).trim() : sp(d.gap ?? d.summary?.gap).match(/(?:保留|沿用) (.+?) 的记录/)?.[1];
    // 这次整批没读到：只在表头说一次沿用几点的记录，格子里“上次确认”是旧数、“本次没读到”是还等更新的（M260）。
    const retainedShort = d.at && U.date(d.at) === U.date(Date.now()) ? U.time(d.at) : retainedAt;
    const batchNote = batchFailed ? `<span>${retainedAt ? `下表沿用 ${esc(retainedShort)} 的记录` : '这次没读到，下表是上一次的记录'}。带“上次确认”的是旧数，带“本次没读到”的还等更新。</span>` : '';
    const localCaption = localNote ? `<span>${field(localNote, '本机说明')}</span>` : '';
    // G、H 盘的“大部分成功／部分成功”怎么分：表里出现这两档时在表头说一次。
    // 按需更新快核（M928）核法：E:/PCConfig/tools/remote-computer-mcp/run_outcomes.py 的 run_outcome，现备上数大于等于没备上数算大部分成功；变了改这句
    let tierSeen = false;
    const caption = () => {
      const tierNote = tierSeen ? '<span>G、H 盘按这一轮备上多少分档：没备上的不超过一半写“大部分成功”（黄），超过一半写“部分成功”（橙），一份也没备上才写“备份失败”（红）。</span>' : '';
      return batchNote || localCaption || tierNote ? `<caption class="pj-note">${batchNote}${localCaption}${tierNote}</caption>` : '';
    };
    const refreshLabels = { read: '本次读到清单', failed: '本次没读到', not_recorded: '本次读取未登记', not_applicable: '本次无需读清单' };
    const columnHead = (key, name) => {
      const { observed_at, refresh_counts } = d.columns?.[key] || {};
      const reads = Object.entries({ read: '读到记录', failed: '本次没读到', not_recorded: '未登记', not_applicable: '不适用' })
        .filter(([state]) => refresh_counts?.[state] > 0).map(([state, label]) => `${refresh_counts[state]} 类${label}`);
      const time = reads.length && !batchFailed && observed_at ? `<small>本次读于<br>${tableText(stamp(observed_at).trim())}</small>` : '';
      return `<th scope="col">${esc(name)}${time}${reads.map(read => `<small>${tableText(read)}</small>`).join('')}</th>`;
    };
    const reasons = { generated_from_system_inventory: '由系统信息生成，没有原件目录', task_profile_binding_unavailable: '没登记来源目录', backup_manifest_unavailable: '备份清单暂时读不到', source_config_unavailable: '来源配置暂时读不到', read_failed: '本次没读到' };
    const reason = value => {
      if (value?.visibility || value?.public || value?.hidden || value?.hidden_block) return value;
      const text = typeof value === 'string' ? value : value?.text || value?.reason;
      const code = value?.reason_code || text;
      return Object.hasOwn(reasons, code) ? reasons[code] : /[\u3400-\u9fff]/.test(text || '') ? text
        : U.collectionText('', { missing_reason: code, source_at: value?.source_at, last_success_at: value?.last_success_at });
    };
    const localPaths = s => {
      const paths = s.local_paths?.length ? s.local_paths : s.local?.location?.paths;
      if (!paths?.length) return field(s.local_location_note || reason(s.missing?.local_paths || s.local?.missing?.location), '本地位置');
      const path = value => {
        const html = field(value, '本地位置'), plain = U.fieldText(value, viewer);
        return html === esc(plain) && /^[a-z]:[\\/]/i.test(plain) ? html.replace(/([\\/])(?=[^\\/])/g, '$1<wbr>') : html;
      };
      return `${path(paths[0].path)}${paths.length > 1 ? `<details><summary>另有 ${paths.length - 1} 个</summary>${paths.slice(1).map(p => path(p.path)).join('<br>')}</details>` : ''}`;
    };
    const copyCell = (s, key) => {
      const copy = s[key], retired = key === 'g' && copy?.retired === true;
      const cloud = key === 'drive' || key === 'photos', original = key === 'local', cold = key === 'h';
      const cell = (state, label, lines = [], details = '') => `<td data-copy="${key}" data-state="${state}"><b>${tableText(label)}</b>${lines.filter(Boolean).map(text => `<small>${tableText(text)}</small>`).join('')}${details}</td>`;
      if (!retired && (copy?.required === false || original && copy?.original_state === 'not_applicable')) return cell('none', '不适用');
      const current = copy?.state, complete = ['ready', 'complete', 'completed'], queued = ['waiting', 'queued', 'stable'];
      const problem = state => ({
        failed: cloud ? '上传失败' : original ? '原件读取失败' : '备份失败',
        missing: original ? '已确认原件缺失' : '已确认没有副本',
        stale: original ? '原件记录已过期' : '副本旧了', partial: original ? '只核实部分原件' : '只核实部分副本',
      })[state];
      const anomaly = problem(copy?.failed > 0 && !['missing', 'stale'].includes(current) ? 'failed' : current);
      const refresh = batchFailed ? 'failed' : copy?.refresh_state ?? (s.read_error === true ? 'failed' : '');
      const prior = refresh === 'failed' || refresh === 'not_recorded' || refresh === 'not_applicable';
      const originalConfirmed = original && (copy?.original_state ?? (current === 'ready' ? 'confirmed' : 'unverified')) === 'confirmed';
      const legacyCloud = cloud && copy && !Object.hasOwn(copy, 'confirmed_state') && !Object.hasOwn(copy, 'confirmed_at');
      const confirmedAt = legacyCloud ? copy.checked_at : copy?.confirmed_at;
      const historical = cloud && (copy?.confirmed_state ?? (legacyCloud && (confirmedAt || copy.content_at || batchFailed && retainedAt) ? current : null));
      const confirmed = cold ? confirmedH.has(s.id) : complete.includes(historical);
      const historicalProblem = prior && problem(historical), currentState = current === 'stale' ? 'stale' : anomaly ? 'gap' : '';
      const pending = cloud ? waiting(copy) : null, inQueue = cloud && (pending.count > 0 || queued.includes(current) || prior && queued.includes(historical));
      const knownCloud = cloud && (confirmed || !prior && complete.includes(current));
      const knownState = originalConfirmed || cold && confirmed || knownCloud ? 'complete' : '';
      const state = retired ? 'retired' : currentState || (historicalProblem ? (historical === 'stale' ? 'stale' : 'gap') : '')
        || (inQueue ? 'waiting' : knownState) || (original || cold ? 'unknown' : D.copyState(copy));
      const uploads = cloud && copy?.sent != null ? `已传 ${copy.total != null ? D.pair(copy, key) : D.transferCount(copy, 'sent', key)}` : '';
      const uploadNote = cloud && confirmed && (prior || anomaly) ? `上次确认${uploads || '已传齐'}` : uploads;
      const waitNote = inQueue && pending.count > 0 ? `${prior ? '上次仍有' : '还有'} ${D.transferCount(pending, 'count', key)}待传` : '';
      const unconfirmed = cloud && copy?.sent != null && copy.total > copy.sent && !copy.failed && current !== 'failed' && !waitNote
        && !D.partial(copy, 'sent') && !D.partial(copy, 'total') ? `尚未确认上传 ${copy.total - copy.sent} ${D.transferUnit(key)}` : '';
      // 没核实的统一写“没核实”，下面一行写缺的是什么（M781）
      const hLabel = confirmed ? '上次确认有副本' : '没核实';
      const label = retired ? '已停用，保留旧副本' : anomaly || (original ? (originalConfirmed ? '已确认有原件' : '没核实原件')
        : cold ? hLabel : (historicalProblem && `上次记录：${historicalProblem}`) || waitNote || uploadNote
          || ({ complete: '齐了', gap: '有缺', stale: '副本旧了', waiting: '在等', unknown: '没核实' })[state]);
      const content = original ? '原件记录日期' : copy?.at_precision === 'h_recovery_set_published' ? '恢复集发布' : cloud ? '副本内容' : '副本内容日期';
      const detailNames = { eligible_at: '可传时间', sent: '已传数', total: '总数' };
      const details = Object.entries(detailNames).flatMap(([k, name]) => {
        const why = copy?.missing?.[k];
        return why && copy[k] == null && (k === 'eligible_at' ? uploads || inQueue : copy.sent != null || copy.total != null) ? [`${name}：${field(reason(why), name)}`] : [];
      });
      // 点开“副本说明”要多给一句原因：取第一句真有内容的（停用的副本 gap 写“没有记录”时用停用原因），只剩“没有记录”“不适用”这种空话的不做成可展开的字。
      const causes = [[copy?.why, copy?.gap, retired && copy.reason].find(value => value && !emptyWord(value))].filter(Boolean).map(value => field(value, '副本说明'))
        .concat(details.filter(line => !emptyWord(line.replace(/<[^>]*>/g, '').replace(/^[^：]*：/, ''))));
      const lines = [cold && confirmed && anomaly && hLabel, uploadNote !== label && uploadNote, waitNote !== label && waitNote, unconfirmed,
        cloud && copy?.sent == null && copy?.total != null && `共 ${D.transferCount(copy, 'total', key)}`,
        // 份数是哪一份清单上的：带上清单时刻，和表头“本次读于”分开（M580）。
        !cloud && copy?.count != null && `${D.count(copy, 'count')} 份${copy.checked_at ? ` · 按 ${stamp(copy.checked_at).trim()} 清单` : ''}`,
        copy?.failed > 0 && `失败 ${D.transferCount(copy, 'failed', key)}`,
        (cold ? confirmed : historical && historical !== 'unknown') && confirmedAt && `上次核对 ${stamp(confirmedAt).trim()}`,
        original && D.sourceSubset(copy, stamp),
        copy?.content_at && `${content} ${stamp(copy.content_at).trim()}`,
        // G、H 盘没核实又没有副本日期的，写明副本日期没登记（后台补上日期才判得了齐没齐）
        !cloud && !original && state === 'unknown' && copy?.content_at == null && ({ not_recorded: '副本日期未登记', read_failed: '副本日期这次没读到' })[copy?.missing?.content_at?.reason_code ?? copy?.missing?.content_at],
        cloud && !(batchFailed && refresh === 'failed') && refreshLabels[refresh]];
      // 后台给了这份副本这一轮的状态（如“本轮大部分成功，有文件跳过”）就照它写、不再绿色“齐了”；没给照旧（M607）
      const told = state === 'complete' && copy?.status_text != null && sp(U.fieldText?.(copy.status_text, viewer) ?? copy.status_text).trim();
      // G、H 盘这一轮按备上、没备上的份数分了档（outcome.state，M780）：少数没备上写“大部分成功”（黄）、较多没备上写“部分成功”（橙）、全没备上才是“备份失败”（红），
      // 和计划任务同一套颜色；后台没给分档或分不出的照旧
      const tier = (key === 'g' || cold) && (told || anomaly === problem('failed')) && TIER[copy?.outcome?.state];
      if (tier) {
        if (['mostly', 'partial'].includes(tier[0])) tierSeen = true;
        const o = copy.outcome, counts = ['mostly', 'partial'].includes(tier[0]) && Number.isInteger(o.ok) && Number.isInteger(o.failed) ? `这轮备上 ${o.ok} 份、没备上 ${o.failed} 份` : '';
        // 没备全、失败的那一档，后台给的这一轮说明（如“这轮未备份……”）也写上
        const said = !told && copy.status_text != null && sp(U.fieldText?.(copy.status_text, viewer) ?? copy.status_text).trim();
        cells.set(`${s.id}:${key}`, { state: tier[0], label: tier[1] });
        return cell(tier[0], tier[1], [told !== tier[1] && told, said, counts, ...lines], causes.length ? `<details class="backup-note"><summary>副本说明</summary><div>${causes.join('<br>')}</div></details>` : '');
      }
      cells.set(`${s.id}:${key}`, { state: told ? 'gap' : state, label: told || label });
      return cell(told ? 'gap' : state, told || label, lines, causes.length ? `<details class="backup-note"><summary>副本说明</summary><div>${causes.join('<br>')}</div></details>` : '');
    };
    cells.clear();
    const sets = U.mergePrivateRows(byImportance((d.sets || []).filter(s => s.name)), { value: s => s.name, kind: viewer });
    const rows = sets.map(s => {
      if (s.private_count) return `<tr><td colspan="10">${U.privateSummary(s.private_count, { unit: '类资料' })}</td></tr>`;
      const state = U.status(s, { small: true, cover: d }), ps = points(d, s.id).sort((a, b) => (Date.parse(b.at) || 0) - (Date.parse(a.at) || 0));
      const links = ps.map(pt => `<a href="${esc(route(`/live/backup/?id=${encodeURIComponent(s.id)}&point=${encodeURIComponent(pt.id)}`))}">${esc(pt.at ? stamp(pt.at) : '恢复点时间未登记')}</a>`);
      const restore = links.length ? links[0] + (links.length > 1 ? `<details><summary>共 ${links.length} 个，<span class="backup-unit">查看其余</span></summary>${links.slice(1).join('')}</details>` : '<small>共 1 个</small>') : field(restoreText(d, s), '恢复点').replace(/清单(?![^<]*>)/g, '<span class="backup-unit">清单</span>');
      const notes = [...new Set((d.restore || []).filter(g => g.set === s.id).flatMap(g => [g.restore_sessions?.text, g.gap]).filter(note => note && !emptyWord(note)))];
      const why = state.note && (s.why && state.note === field(s.why, '状态说明')
        ? explain(s.why, '备份说明') : `<small>${state.note}</small>`);
      const sizeAt = s.bytes == null ? '' : D.sizeEvidence(s, stamp);
      return `<tr data-set="${esc(s.id)}"><th scope="row"><span class="backup-name">${state.tone === 'green' ? '' : state.lamp}<a href="${esc(route(`/live/backup/?id=${encodeURIComponent(s.id)}`))}">${field(s.name, '备份资料')} ›</a></span>${why}</th><td class="backup-location">${localPaths(s)}</td><td>${s.bytes == null ? field(reason(s.missing?.bytes), '大小') : U.nowrap(D.count(s, 'bytes', U.gb))}${sizeAt ? `<small>${tableText(sizeAt)}</small>` : ''}</td>${Object.keys(names).map(key => copyCell(s, key)).join('')}<td class="backup-restore">${restore}${notes.map(note => `<small>${field(note, '恢复说明')}</small>`).join('')}</td><td>${actionHtml(s)}</td></tr>`;
    });
    if (!rows.length) return U.html($('backup-matrix'), `<p class="pj-note">${esc(emptySets ? '没有备份资料' : missing('各类资料在各去处的副本'))}</p>`);
    U.html($('backup-matrix'), `<table class="backup-grid">${caption()}<colgroup>${[18,18,6,7,7,7,9,9,12,7].map(width => `<col style="width:${width}%">`).join('')}</colgroup><thead><tr><th scope="col">资料名</th><th scope="col">本地位置</th><th scope="col">大小</th>${Object.entries(names).map(([key, name]) => columnHead(key, name)).join('')}<th scope="col">恢复点</th><th scope="col">操作</th></tr></thead><tbody>${rows.join('')}</tbody></table>`);
  }
  function summary(d) {
    const sets = d.sets || [], supplied = d.summary || {};
    const fullList = Array.isArray(d.sets) && (supplied.sets == null || supplied.sets === sets.length);
    const buckets = fullList ? sets.map(protection) : null;
    const fromRows = (...states) => buckets?.filter(state => states.includes(state)).length;
    const value = (key, fallback) => Object.hasOwn(supplied, key) ? supplied[key] : fallback;
    const total = value('sets', fullList ? sets.length : null), unknown = value('unknown', fromRows('unknown'));
    const number = (key, n) => D.partial(supplied, key) ? (n === 0 ? '已读范围内 0' : `至少 ${n}`) : String(n);
    const state = U.status(d);
    headline = total == null ? U.collectionText('资料总数', supplied, null, 'sets') : `${number('sets', total)} 类资料`;
    U.html($('head'), state.lamp + U.head(headline, { lamp: false }));
    const legacyCategories = !d.columns && fullList && ['ready', 'waiting', 'gaps', 'unknown', 'local_only', 'single'].reduce((n, key) => Number.isFinite(supplied[key]) ? n + supplied[key] : NaN, 0) === total;
    // “在等”按类数；同一屏云端格按文件写“在等 N 个文件”。有文件在等时不再写“0 类在等”，免得一处说 0、一处说 36。
    const filesWaiting = [supplied.drive, supplied.photos, ...sets.flatMap(s => [s.drive, s.photos])].some(cloud => waiting(cloud).count > 0);
    const counts = [
      ['ready', value('ready', fromRows('complete')), '齐了'],
      ['waiting', value('waiting', fromRows('waiting')), '在等'],
      ['gaps', value('gaps', fromRows('gap', 'local_copy_no_cloud', 'stale')), '有备份问题'],
      ['unknown', unknown, '尚未证实'],
      ['local_only', legacyCategories && supplied.local_only || null, '未传云端'],
      ['single', legacyCategories && supplied.single || null, '只有一份'],
    ].filter(([key, n]) => n != null && !(key === 'waiting' && n === 0 && filesWaiting)).map(([key, n, label]) => key === 'unknown' && n > 0 && !D.partial(supplied, key)
      ? `${n} 类尚未证实` : `${number(key, n)} 类${label}`).join(' · ');
    const totals = D.backupTotals(sets.map(s => ({ ...s, name: U.fieldText?.(s.name, viewer) ?? sp(s.name) })), supplied), drive = totals.drive;
    const local = Object.hasOwn(supplied, 'local_only') ? supplied : { local_only: fromRows('local_copy_no_cloud'), q: unknown > 0 ? 'partial' : 'ok' };
    const stateNote = d.read_error === true ? state.note.split(' · ').filter(text => !U.isReadingCutoff(text)).join(' · ') : state.note;
    U.html($('note'), wrapSummary([tableText(counts), stateNote.replace(/\d+ 项读数不完整/g, '<span class="backup-unit">$&</span>')].filter(Boolean).join(' · '))); $('note').hidden = !counts && !stateNote;
    L.tone(hero, d); homeRead.done();
    const hConfirmed = copy => copy && copy.required !== false && copy.retired !== true && (
      Object.hasOwn(copy, 'confirmed_state') || Object.hasOwn(copy, 'confirmed_at')
        ? copy.confirmed_state === 'complete' && !!copy.confirmed_at
        : !!copy.content_at && ['ready', 'complete', 'completed'].includes(copy.state));
    const hGroup = (label, rows) => {
      const names = rows.map(s => s.name).filter(Boolean).map(name => U.fieldHtml(name, { name: '备份资料', place: 'body', kind: viewer }));
      const publicNames = names.filter(name => !name.includes('live-mark--owner') || viewer === 'owner');
      if (names.length > publicNames.length) publicNames.push(`${names.length - publicNames.length} 类${U.fieldHtml({ visibility: 'owner' }, { name: '名称', place: 'body', kind: viewer })}`);
      const title = `${rows.length} 类${label}`;
      return publicNames.length ? `<details><summary>${title}</summary><small>${publicNames.join('、')}</small></details>` : `<small>${title}</small>`;
    };
    const big = (text, known) => known ? `<b>${esc(text)}</b>` : `<small>${esc(text)}</small>`;
    const card = (label, value, extra = '', cls = '') => `<div class="${cls}"><span>${esc(label)}</span>${value}${extra}</div>`;
    function requiredUnread() {
      const n = d.summary?.targets?.g?.required_unread;
      return Number.isInteger(n) && n > 0 ? `<small>应备资料里还有 ${n} 类没读到副本状态</small>` : '';
    }
    const cards = [], gUnread = requiredUnread(), hRequired = sets.filter(s => s.h?.required === true), hCopies = sets.filter(s => hConfirmed(s.h));
    if (!offline() || totals.g || gUnread) cards.push(card(`G 盘${totals.g_partial ? '已读最新' : '最新副本'}`, big(stamp(totals.g), totals.g != null), gUnread));
    if (!offline() || totals.h || hRequired.length || hCopies.length) {
      const groups = fullList || sets.length ? hGroup('应备', hRequired) + hGroup('上次确认有副本', hCopies) : '';
      cards.push(card('H 盘', totals.h ? big(`已读副本内容日期 ${stamp(totals.h).trim()}`, true) : '', groups));
    }
    const pending = waiting(drive), readError = d.read_error === true;
    if (!offline() || drive.sent != null || drive.total != null) {
      const pair = D.pair(drive, 'drive'), known = drive.sent != null && drive.total != null;
      const counts = [pending.count == null && offline() ? '' : `在等 ${D.transferCount(pending, 'count', 'drive')}`,
        drive.failed == null && offline() ? '' : `失败 ${drive.failed === 0 ? '0 个文件' : D.transferCount(drive, 'failed', 'drive')}`];
      cards.push(card('Drive 已传 / 共', known ? `<b class="drive-numbers">${esc(pair)}</b>` : big(pair, false),
        `${drive.q === 'partial' ? '' : D.progress(drive.sent, drive.total)}<small>${counts.filter(Boolean).map(text => `<span class="drive-count">${esc(text)}</span>`).join(' · ')}</small>${readError ? '' : gap(drive)}`, 'backup-drive'));
    }
    if (!offline() || local.local_only != null) cards.push(card('有本地副本，未传云端', big(local.local_only == null ? U.collectionText() : (local.local_only === 0 && D.partial(local, 'local_only') ? '已读范围内 0' : D.count(local, 'local_only')) + ' 类', local.local_only != null), unknown ? '' : gap(local)));
    U.html($('backup-summary'), cards.join('') || `<p class="pj-note">${missing()}</p>`);
    return new Set(hCopies.map(s => s.id));
  }
  function render(d) {
    data = d; const unavailable = !d || inventoryUnknown(d) && !d.restore?.length; document.querySelector('.l2-board').hidden = $('backup-summary').hidden = $('backup-matrix').hidden = unavailable;
    if (unavailable) { headline = missing(); U.html($('head'), U.status(d).lamp + U.head(headline, { lamp: false })); U.html($('note'), wrapSummary(U.status(d).note)); $('note').hidden = !U.status(d).note; L.tone(hero, d); if (offline()) homeRead.done(); else homeRead.set({ phase: 'none', data: null }); $('coverage').textContent = ''; return; }
    const emptySets = d.summary?.sets === 0 || d.q === 'ok' && d.sets?.length === 0 && !Object.hasOwn(d.summary || {}, 'sets');
    mergedTable(d, summary(d), emptySets);
    // 左栏：只列要留意的几类和一句为什么，其余几类一句话带过（本人 11-25 选 A，样子见 B1）
    const all = byImportance((d.sets || []).filter(s => s.name)), picked = all.filter(noticed);
    const sets = U.mergePrivateRows(picked, { value: s => s.name, kind: viewer });
    const others = all.length - picked.length, unchecked = all.filter(s => !noticed(s) && protection(s) === 'unknown').length;
    const restLine = !all.length ? '' : (picked.length ? `其余 ${others} 类见上面大表` : `现在没有要留意的；${others} 类见上面大表`) + (unchecked ? `；其中 ${unchecked} 类的副本还没核实过` : '');
    const tail = restLine ? [{ key: 'backup-rest', cls: 'row row--flat row--empty backup-rest', html: `<span></span><p class="row__sub">${esc(restLine)}</p>` }] : [];
    const rows = all.length ? sets.slice(0, 5).map(s => setRow(s, d)) : empty(emptySets ? '没有备份资料' : missing('要留意的几类'));
    if (d.verification && !all.some(s => s.id === 'recovery-kit')) rows.push({ key: 'verification', cls: 'row row--flat', html: `<span></span><a class="row__title" href="${esc(route('/live/backup/?id=recovery-kit'))}">恢复材料校验 ›</a>` });
    U.list($('sets'), sets.length > 5 ? rows : [...rows, ...tail]); U.list($('rest'), sets.length > 5 ? [...sets.slice(5).map(s => setRow(s, d)), ...tail] : []); $('more').hidden = sets.length <= 5; U.html($('more'), `<span class="more__shut">还有 ${Math.max(sets.length - 5, 0)} 条</span><span class="more__open">收起</span> <span class="more__chev">›</span>`);
    // 右栏：最上面写最近一次恢复；每类一个小标题（右边“展开／收起”），下面只列能退回的日期；末尾说其余几类没有恢复点和恢复记录的去向（样子见 B2）
    const kindText = kind => kind === 'system' ? '整机恢复' : '文件恢复';
    const groups = byImportance((d.restore || []).filter(g => g.points?.length || g.restore_sessions?.last_at), g => g.set);
    const lastRestore = g => [[g.restore_sessions?.last_at, g.restore_sessions?.kind || g.kind, g.restore_sessions?.text], ...(g.points || []).map(pt => [pt.restored_at, g.kind])]
      .filter(([at]) => Number.isFinite(Date.parse(at))).sort((a, b) => Date.parse(b[0]) - Date.parse(a[0]))[0];
    const latest = groups.map(g => [g, lastRestore(g)]).filter(([, r]) => r).sort((a, b) => Date.parse(b[1][0]) - Date.parse(a[1][0]))[0];
    const setName = g => (d.sets || []).find(s => s.id === g.set)?.name ?? g.name;
    const nameHtml = (g, place) => U.fieldHtml(setName(g) || kindText(g.kind) + '点', { name: '备份资料', place, kind: viewer });
    const restored = [];
    if (groups.length) {
      const [g, r] = latest || [], said = r?.[2] && plain(r[2]);
      const what = r ? `${esc(stamp(r[0]).trim())} · ${nameHtml(g, 'body')} · ${kindText(r[1])}${said ? `（${esc(said)}）` : ''}` : '没有恢复过的记录';
      const raw = r?.[2] && !said ? `<p class="row__sub">${U.fieldHtml(r[2], { name: '恢复说明', kind: viewer })}</p>` : '';
      restored.push({ key: 'restore-latest', cls: 'row row--flat backup-latest', html: `<span></span><div class="row__text"><p class="row__main">最近一次恢复：<span class="row__meta">${what}</span></p>${raw}</div>` });
    }
    for (const g of groups) {
      // 和详情页一样新的在前（M419）
      const newest = U.mergePrivateRows([...(g.points || [])].sort((a, b) => (Date.parse(b.at) || 0) - (Date.parse(a.at) || 0)), { value: pt => pt.scope || pt, kind: viewer });
      // 说明只剩“最近一次记录于 …”的（后台标了这条记录旧了），写在它自己那一行下面：“旧了 · 最近一次记录于 …”，不并到栏底；这样的一条不收进“展开”，一眼看得到是哪条旧了
      const oldNote = item => U.isCutoffNote(item?.gap) ? `<small class="backup-old">旧了 · ${esc(sp(item.gap).replace(/[。.]$/, ''))}</small>` : '';
      let folded = 0;
      const dates = newest.map((pt, i) => { const old = !pt.private_count && oldNote(pt), more = i && !old; if (more) folded++; return `<li${more ? ' data-more' : ''}>${pt.private_count ? U.privateSummary(pt.private_count)
        : `<span class="backup-can">能退回</span> <a href="${esc(route(`/live/backup/?id=${encodeURIComponent(g.set)}&point=${encodeURIComponent(pt.id)}`))}">${esc(pt.at ? stamp(pt.at).trim() : '恢复点时间未登记')}</a>${old}`}</li>`; }).join('');
      // 恢复点覆盖的范围和类名不一样时（如系统盘整盘镜像：Windows 系统和选定电脑配置）照旧写一句“范围：…”，同一类只写一次
      const scopes = [...new Set((g.points || []).map(pt => pt.scope).filter(scope => scope && sp(U.fieldText(scope, viewer)) !== sp(U.fieldText(setName(g), viewer))).map(scope => U.fieldHtml(scope, { name: '备份范围', place: 'body', kind: viewer })))];
      const own = lastRestore(g), from = g.points?.map(pt => pt.history_from).filter(Boolean).sort()[0];
      // 一条恢复记录都没有时，最上面“最近一次恢复：没有恢复过的记录”已经说了，各类下面不再各写一遍
      const line = own ? (latest?.[0] === g ? '' : `最近一次恢复 ${esc(stamp(own[0]).trim())}`) : from ? `从 ${esc(U.date(from))} 起没有恢复过` : latest ? '没有恢复过的记录' : '';
      const stale = ['g', 'h'].some(k => cellOf(g.set, k)?.state === 'stale') ? '<span class="tag backup-tag-stale">副本旧了</span>' : '';
      const toggle = folded ? `<button class="more backup-toggle" type="button" aria-expanded="false"><span class="more__shut">展开（还有 ${folded} 条）</span><span class="more__open">收起</span> <span class="more__chev" aria-hidden="true">›</span></button>` : '';
      const subs = [scopes.length && `范围：${scopes.join('、')}`, line, oldNote(g)].filter(Boolean).map(text => `<p class="row__sub">${text}</p>`).join('');
      restored.push({ key: `restore:${g.set}:${g.kind}`, cls: 'row row--flat backup-group', html: `<span></span><div class="row__text"><p class="row__main backup-group__head"><a class="row__title" href="${esc(route(`/live/backup/?id=${encodeURIComponent(g.set)}`))}">${nameHtml(g, 'title')}</a><span class="row__meta">${kindText(g.kind)}</span>${stale}${toggle}</p>${dates ? `<ul class="backup-dates">${dates}</ul>` : ''}${subs}</div>` });
    }
    if (groups.length) {
      const without = (d.sets || []).filter(s => s.name && !groups.some(g => g.set === s.id && g.points?.length)).length;
      // 栏底只并写别的恢复说明：“最近一次记录于 …”已写在各自那一行；“没有恢复记录”最上面已经说了
      const seen = new Set(), notes = groups.flatMap(g => [g.gap, ...(g.points || []).map(pt => pt.gap)]).filter(text => text && !emptyWord(text) && !U.isCutoffNote(text) && !/^没有恢复(?:过的)?记录[。.]?$/.test(sp(U.fieldText(text, viewer))))
        .map(text => plain(text) ? esc(plain(text)) : U.fieldHtml(text, { name: '恢复说明', kind: viewer })).filter(html => !seen.has(html) && seen.add(html));
      restored.push({ key: 'restore-rest', cls: 'row row--flat row--empty backup-rest', html: `<span></span><div class="row__text">${without ? `<p class="row__sub">其余 ${without} 类没有登记恢复点。</p>` : ''}${notes.length ? `<p class="row__sub">${notes.join('；')}。</p>` : ''}</div>` });
    }
    U.list($('points'), restored.length ? restored : empty(restoreText(d)));
    const coverage = [d.coverage?.local_note, d.columns?.local?.note].some(note => note && sp(note) === sp(d.coverage)) ? '' : U.fieldHtml(d.coverage, { name: '备份范围', place: 'body', kind: viewer });
    U.html($('coverage'), coverage); $('coverage').hidden = !coverage;
    if (!lit) { lit = true; L.lightUp([hero, $('backup-matrix'), $('sets'), $('points')]); }
    U.land({ keepOnBack: true });
  }
  window.Live.watch('backups', null, { phase(s) { if (s.data == null) { homeRead.set(s); detailReads.forEach(r => r.set(s)); } },
    data(d, meta) {
      const publicNow = viewer !== 'public' && meta.viewer.kind === 'public';
      viewer = meta.viewer.kind;
      if (publicNow) for (const id of ['sets', 'rest', 'points']) $(id).replaceChildren();
      if (data && !publicNow) U.anchor(() => render(d)); else render(d);
      if (d) detailReads.forEach(r => r.done());
    }, link(s) { const changed = disconnected !== s.offline; disconnected = s.offline; bar?.set(s); L.offline(s.offline); U.list($('notices'), s.offline ? [{ key: 'offline', cls: 'notice glass', html: U.fieldHtml(s.text, { name: '连接情况', place: 'body', kind: viewer }) }] : []); if (s.data == null && (!s.offline && [404, 503].includes(s.meta?.status) || s.phase === 'none')) { detailReads.forEach(r => r.set(s)); render(null); } else if (s.data && (changed || data == null)) render(s.data); } });
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();
