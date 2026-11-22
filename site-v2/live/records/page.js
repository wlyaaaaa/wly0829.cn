// 第三层：项目逐项明细。结果的几组口径分开摆，逐项清单按原接口翻页。
(() => {
  'use strict';
  const titleText = (value, fallback) => {
    const reading = U.fieldText(value, recordViewer);
    return /可信设备可见|正在换说法/.test(reading) ? fallback : reading;
  };
  const marker = (v, kind, name = '内容') => v && (v.hidden || v.visibility || v.public || v.rewrite) ? window.LiveUI.fieldHtml({ text: kind === 'owner' ? '' : undefined, hidden: kind !== 'owner' && (v.hidden || v.visibility === 'owner' || v.public === 'owner'), visibility: v.visibility, public: v.public, rewrite: v.rewrite, hidden_what: v.hidden_what }, { name, kind }) : '';
  const isStale = data => data?.stale === true || data?.q === 'stale' || data?.state === 'stale';
  function staleText(data, at, now = Date.now()) {
    return window.LiveUI.staleText(data, at || data?.at, now);
  }
  const U = window.LiveUI, L = window.LiveLight, { esc, sp } = U;
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const id = params.get('project') || params.get('id'), section = params.get('section') || 'results';
  const artifactRecordFields = { freeze_records: 'at', phone_batch: 'last_received_at', inventory_report: 'at', governance: null };
  const recordAt = id === 'pcconfig' && Object.hasOwn(artifactRecordFields, section) && params.get('record');
  const archives = section === 'archives', knowledge = id === 'daily-preferences' && /^group-[0-5]$/.test(section);
  const enc = encodeURIComponent;
  // 只有 403 表示不给公开；404/503 表示这块暂时取不到，不推断为私人内容。
  const locked = s => s.meta?.status === 403 && s.meta?.viewer?.kind === 'public';
  const missingText = (s, what = '这些记录') => s.offline || U.offline?.() ? '这块没存下来，连上后补上。' : [404, 503].includes(s.meta?.status) ? `${titleText(what, '这些记录')}暂时读不到` : U.collectionText();
  const missingHtml = (s, what) => locked(s) ? marker({ visibility: 'owner' }, 'public', titleText(what, '这些记录')) : U.fieldHtml(missingText(s, what), { name: '记录内容', kind: recordViewer });
  const skillUsageSection = id === 'agents' && ['skill_usage', 'skill_rows'].includes(section);
  const label = { results: '处理结果', archives: '档案检查', site_todo_missing_intros: '还没介绍页', ...(skillUsageSection ? { [section]: '技能使用' } : {}) };
  const meaning = {
    completed: '流程已执行完', unsupported: '这类输入暂不能处理', failed: '这次没有执行成功',
    complete: '整段都有内容', partial: '只转到其中一部分', unknown: '暂时无法判断',
    sufficient: '已有可靠结论', low_confidence: '结果仍需复核',
    empty_observation: '这一轮没有读到文字', confidence_unavailable: '模型没说有多大把握',
    escalation_skipped_gpu_unavailable: '显卡这次用不了，没能继续检查',
    only_thumbnail_local: '本地保留的是缩略图', remote_not_requested: '还没有取回远端媒体',
    local_wxgf_conversion_unavailable: '缓存格式暂时解不开', image_not_stored_locally: '本地没有原图',
    current: '说话人信息齐了', legacy: '旧档案缺少说话人信息',
  };
  const iso = /\b\d{4}-\d\d-\d\d(?:T\d\d:\d\d(?::\d\d(?:\.\d+)?)?(?:Z|[+-]\d\d:\d\d)?)?\b/g;
  function humanTime(at) {
    if (at.length === 10) return at.startsWith('2026-') ? at.slice(5) : at;
    const d = new Date(/(?:Z|[+-]\d\d:\d\d)$/.test(at) ? at : `${at}+08:00`);
    if (!Number.isFinite(d.getTime())) return at;
    const out = new Date(d.getTime() + 8 * 3600000).toISOString().slice(0, 16).replace('T', ' ');
    return out.startsWith('2026-') ? out.slice(5) : out;
  }
  const bytes = n => { const power = Math.abs(n) >= 2 ** 30 ? 30 : Math.abs(n) >= 2 ** 20 ? 20 : Math.abs(n) >= 1024 ? 10 : 0, value = n / 2 ** power; return `${Number(value.toFixed(Math.abs(value) < 10 ? 2 : 1))} ${{ 30: 'GB', 20: 'MB', 10: 'KB', 0: 'B' }[power]}`; };
  const format = s => String(s ?? '').replace(iso, humanTime).replaceAll('登记', '记录');
  const stamp = at => format(at || (U.offline?.() ? '' : U.collectionText()));
  const text = s => s && typeof s === 'object' ? U.fieldHtml(s, { name: '记录内容', kind: recordViewer }) : U.fieldHtml(sp(format(s == null || U.offline?.() && s === '还没读到' ? U.offline?.() ? '这块没存下来，连上后补上。' : U.collectionText() : s)), { name: '记录内容', kind: recordViewer });
  const count = (n, source, key, unit = '') => { const partial = source?.lower_bound === true || source?.at_least === true || source?.isPartial === true || source?.q === 'partial' && (!source.partial || source.partial.includes(key));
    return n == null ? U.collectionText('', source) : `${partial ? '至少 ' : ''}${Number(n).toLocaleString('zh-CN')}${unit}${partial && source.gap ? ` · ${source.gap}` : ''}`; };
  const rowName = (r) => r.label === '' ? '' : r.label && r.label !== r.id ? r.label : meaning[r.id] || '这一类结果';
  const attention = r => ['waiting', 'pending'].includes(r.state) || ['waiting', 'pending', '在等'].includes(r.state_text);
  const recordKey = r => r.id || r.component_id || r.name || r.label || r.text;
  const route = (path) => path + (params.has('fixture') ? `&fixture=${enc(params.get('fixture'))}` : '');
  const hero = $('hero'), body = hero.querySelector('.card__body');
  let project = null, next = null, items = [], recordWatch = null, archiveOpen = false, recordViewer = 'public';
  let sectionName = label[section] || '逐项明细', recordTotal = null, recordSource = null, groupPrivate = false;
  L.add(hero); L.tone(hero, 'none');
  // 这个项目自己的颜色和画（_lib/live-project-look.js，和项目页同一个）：页面底色、页头的画和光、账簿封皮随项目走；强调色不换
  const PL = window.LiveProjectLook;
  PL?.load().then(looks => {
    const look = PL.of(id, looks, id);
    PL.paint(document.body, look);
    // 两色里更有颜色的那一色当这页的主色（多数项目第一色是相近的暖米色，认不出是哪个项目）
    const chroma = hex => { const c = [1, 3, 5].map(i => parseInt(String(hex).slice(i, i + 2), 16)); return c.some(Number.isNaN) ? -1 : Math.max(...c) - Math.min(...c); };
    document.body.style.setProperty('--book-own', chroma(look.glow[1]) >= chroma(look.glow[0]) ? look.glow[1] : look.glow[0]);
    document.body.classList.add('book-look');
    hero.dataset.pic = look.layout === 'left' ? 'left' : 'right';
    hero.toggleAttribute('data-wide', look.layout === 'wide');
    for (const img of hero.querySelectorAll('.card__pic img, .card__tint')) { img.addEventListener('load', () => { img.hidden = false; }, { once: true }); img.src = look.img; }
  });
  // 明细摆成一本账簿（_lib/live-book.js）：技能用量那种带次数条和两张摘要卡；长文字的“认识”用一整页
  const skills = ['skill_rows', 'skill_rows_owner'].includes(section);
  const book = window.LiveBook.create($('record-body'), bookSetup());
  const headRead = U.reading(body, { ghost: U.ghost.card(2), name: '项目逐项明细' });
  const summaryRead = U.reading($('summary'), { ghost: U.ghost.rows(4), slow: false });
  const recordRead = U.reading(book.pages, { ghost: U.ghost.rows(6), slow: false });
  const bar = U.topbar({ ask: () => project ? `请看实况项目 ${project.id}（${sp(project.name)}）的${sectionName}，说明这些结果和仍有的缺口。` : '' });

  let projectStaleAt = null, recordsStaleAt = null;
  function updateCutoff() {
    const at = [projectStaleAt, recordsStaleAt].filter(Boolean).sort((a, b) => Date.parse(a) - Date.parse(b))[0];
    // 项目的一句话介绍在项目页写过；明细页每页都重复它（“电脑的户口本和总接线…”）只会让人以为和这份明细有关，这里不再写。
    const description = at ? esc(staleText({ stale: true }, at)) : '';
    $('say').hidden = !description; U.html($('say'), description);
  }
  function knowledgeCells(r) {
    const kind = recordViewer === 'owner' ? 'owner' : 'public', parts = U.knowledgeCells(r, kind === 'owner', true);
    // 共用件把正文原样转义成一段字；这里认出那一段，换成排好版的 Markdown，其余（原话、证据时段、标签、按钮）不动。
    const typeset = (value, name, wrap, html) => {
      if (typeof value !== 'string' || typeof html !== 'string') return html;
      const plain = U.fieldHtml(value, { name, kind }), head = wrap(plain);
      return html.startsWith(head) ? `<div class="knowledge-md">${markdown(plain)}</div>${html.slice(head.length)}` : html;
    };
    if (MARKDOWN.test(r.text || '')) parts[1] = typeset(r.text, '正文', s => `<p>${s}</p>`, parts[1]);
    if (r.detail) parts[3] = typeset(r.detail, undefined, s => `<p class="knowledge-prose">${s}</p>`, parts[3]);
    // 正文里有“〔…省略〕”的：源头导出时就省掉了，后台给缺因（body_gap），紧跟正文写一句为什么
    if (typeof r.body_gap === 'string' && r.body_gap) parts[1] += `<p class="knowledge-prose" style="color:var(--muted, #8f8d86)">${esc(r.body_gap)}</p>`;
    return parts;
  }
  // 说明书正文是后台给的 Markdown（标题、空行分段、列表、表格、**加粗**、`代码`、[字](地址)）：照样子排出来，不露井号、星号、反引号。
  // 进来的已是转义过的字，这里只认这几种记号、只生成这几种标签。
  const MARKDOWN = /(?:^|\n)\s*(?:#{1,6}\s|[-*+]\s|\d+[.)]\s|\|)|\*\*|\x60|\[[^\]\n]+\]\(/;
  function markdown(html) {
    const inline = s => s.replace(/\x60([^\x60\n]+)\x60/g, '<code>$1</code>').replace(/\*\*([^*\n]+?)\*\*/g, '<b>$1</b>').replace(/\[([^\]\n]+)\]\([^)\n]+\)/g, '$1');
    const out = [];
    let para = [], list = null, rows = null;
    const flush = () => {
      if (para.length) out.push(`<p>${para.map(inline).join('<br>')}</p>`);
      if (list) out.push(`<${list.tag}${list.start > 1 ? ` start="${list.start}"` : ''}>${list.items.map(item => `<li>${inline(item)}</li>`).join('')}</${list.tag}>`);
      if (rows?.length) out.push(`<table class="knowledge-table">${rows.map((cells, i) => `<tr>${cells.map(c => i === 0 && rows.head ? `<th>${inline(c)}</th>` : `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</table>`);
      para = []; list = null; rows = null;
    };
    for (const raw of String(html).split('\n')) {
      const line = raw.trim();
      let m;
      if (!line || /^(?:-{3,}|\*{3,}|_{3,})$/.test(line)) { flush(); continue; }
      if ((m = /^#{1,6}\s+(.+)$/.exec(line))) { flush(); out.push(`<p class="knowledge-h">${inline(m[1].replace(/\s+#+$/, ''))}</p>`); continue; }
      if (/^\|.*\|$/.test(line)) {
        if (!rows) { flush(); rows = []; }
        if (/^\|[\s:|-]+\|$/.test(line)) rows.head = rows.length === 1;
        else rows.push(line.slice(1, -1).split('|').map(cell => cell.trim()));
        continue;
      }
      if ((m = /^(?:[-*+]|(\d+)[.)])\s+(.+)$/.exec(line))) {
        const tag = m[1] ? 'ol' : 'ul';
        if (!list || list.tag !== tag) { flush(); list = { tag, start: Number(m[1]) || 1, items: [] }; }
        list.items.push(m[2]); continue;
      }
      if (list && /^\s{2,}/.test(raw)) { list.items[list.items.length - 1] += ` ${line}`; continue; }
      if (list || rows) flush();
      para.push(line.replace(/^&gt;\s?/, ''));
    }
    flush();
    return out.join('');
  }
  function table(headers, rows, records) {
    let caption = '';
    if (rows.length > 1 && /时刻|时间/.test(headers.at(-1)) && rows.every(row => row.at(-1) === rows[0].at(-1))) {
      caption = `<caption>${text(headers.at(-1))} ${text(rows[0].at(-1))}</caption>`; headers = headers.slice(0, -1); rows = rows.map(row => row.slice(0, -1));
    }
    if (records) rows = rows.map((cells, i) => {
      const r = records[i];
      if (recordViewer === 'public' && (r.hidden || r.visibility === 'owner' || r.public === 'owner')) return [U.fieldHtml({ hidden: 1 }, { name: '记录内容' }), ...cells.slice(1).map(() => '')];
      return cells;
    });
    return `<table class="fe-l3b-table${headers.at(-1) === '数量' ? ' fe-l3b-count-table' : ''}${knowledge ? ' fe-l3b-knowledge-table' : ''}">${caption}<thead><tr>${headers.map((h) => `<th scope="col">${U.fieldHtml(h, { name: '记录', place: 'label' })}</th>`).join('')}</tr></thead><tbody>${rows.map((r, i) => records?.[i]?.private_count ? `<tr><td colspan="${headers.length}">${U.privateSummary(records[i].private_count)}</td></tr>` : `<tr${records ? ` data-key="${esc(recordKey(records[i]) || `record-${i}`)}"${attention(records[i]) ? ' class="is-attention"' : ''}` : ''}>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  function group(title, data, note) {
    const rows = data?.items;
    if (U.offline?.() && rows == null) return `<p class="rec-part">${text(title)}</p><p class="fe-l3b-note">这块没存下来，连上后补上。</p>`;
    return `<p class="rec-part">${text(title)}</p>${Array.isArray(rows) ? rows.length ? table(['原因或状态', '数量'], rows.map((r) => [
      `${text(rowName(r))}${marker(r, recordViewer, '这项记录的内容') ? `<small>${marker(r, recordViewer, '这项记录的内容')}</small>` : ''}`, text(count(r.count, r.q ? r : data, 'count')),
    ])) : '<p class="fe-l3b-note">这份范围内没有这一类记录</p>' : `<p class="fe-l3b-note">${U.collectionText()}</p>`}
      <p class="fe-l3b-note">${text([data?.note || note, U.olderNote?.(data?.at, { ...data, stale: true })].filter(Boolean).join(' · '))}${typeof data?.scope === 'string' && data.scope ? `<br>${text(data.scope)}` : ''}</p>`;
  }
  function summaries(d) {
    const resultsSummary = section === 'results' && ('quality_flags' in d || 'receipt_states' in d);
    $('summary').hidden = !archives && !resultsSummary;
    if ($('summary').hidden) {
      if (section === 'results') watchRecords();
      return;
    }
    let html = '';
    if (archives) {
      html = group('媒体缺口的原因', d.media_gap_reasons, '缩略图不足和不可用媒体口径不同，各项不相加。') +
        group('说话人信息齐不齐', d.sender_identity_versions, '缺少的信息以后核对时补上。');
      html += `<p class="rec-part">逐份档案</p><button class="more" id="archive-records" type="button" aria-expanded="${archiveOpen}">${archiveOpen ? '收起' : '展开'}逐份档案 ›</button>`;
    } else {
      if ('quality_flags' in d) html += group('为什么没有可靠结论', d.quality_flags, '同一份资料可能有多个原因，各项不能直接相加。');
      if ('receipt_states' in d) {
        const r = d.receipt_states;
        html += `<p class="rec-part">三组留存结果</p><p class="fe-l3b-note">${r?.total == null ? U.offline?.() ? '这块没存下来，连上后补上。' : U.collectionText("回执总数") : `统计 ${text(count(r.total, r, 'total', ' 份回执'))}`} · 回执数，不是去重录音数，不是准确率。${U.olderNote?.(r?.at, { ...r, stale: true }) ? `<br>${text(U.olderNote(r.at, { ...r, stale: true }))}` : ''}${typeof r?.scope === 'string' && r.scope ? `<br>${text(r.scope)}` : ''}</p>`;
        for (const [key, name, note] of [['execution', '执行怎样', '跑结束了，不等于整段都转到了。'], ['coverage', '整段有没有覆盖', '覆盖完整，不等于内容有把握。'], ['quality', '质量有没有把握', '这是模型的质量结论。']]) {
          html += group(name, { items: r?.[key], q: r?.q, partial: r?.partial, gap: r?.gap }, note);
        }
      }
    }
    U.html($('summary'), html);
  }
  function drawHeader() {
    if (!project) return;
    const group = project.sections?.find(s => s.id === section || s.metrics?.some(m => m.section === section || m.id === section));
    const source = recordSource || group?.metrics?.find(m => m.section === section || m.id === section) || group || project;
    const status = U.status({ ...source, level: source?.header_level ?? source?.level });
    U.html($('head'), status.lamp + U.head([titleText(project.name, '项目') || '项目', '项目逐项明细'].map(sp).join(' · '), { lamp: false }));
    L.tone(hero, status.tone);
    const meta = [project.changed?.at && `最近变化 ${stamp(project.changed.at)}`].filter(Boolean);
    U.html($('meta'), meta.map(s => `<span>${text(s)}${project.changed?.text ? `：${U.fieldHtml(project.changed.text, { name: '最近变化', kind: recordViewer })}` : ''}</span>`).join('') + status.note); $('meta').hidden = !meta.length && !status.note;
  }
  function drawRecordTitle() {
    const total = count(recordTotal, recordSource, 'total', ' 项');
    const title = $('record-title');
    const showName = archives ? '逐份档案' : section === 'results' ? sectionName : '';
    const countLabel = uncertainEmpty(recordSource) ? '总数暂未核实'
      : recordTotal == null ? '' : `${total.startsWith('至少 ') ? '' : '共 '}${total}`;
    // 从别处点进某一次（诊断现场、手机传回这类 &record=）：写明只看这一条，并给回到全部的入口，不写“共 1 项”冒充全部。
    const allTotal = recordAt && recordSource ? recordSource.total : null;
    if (recordAt && recordSource && (allTotal > items.length || recordSource.next)) {
      const all = new URL(location.href); all.searchParams.delete('record'); all.searchParams.delete('cursor');
      const allLabel = allTotal > items.length ? `看全部 ${count(allTotal, recordSource, 'total', ' 项')} ›` : '看全部 ›';
      U.html(title, `${[showName && esc(showName), '只看这一条'].filter(Boolean).join(' · ')}<a class="book-hero__all" href="${esc(all.pathname + all.search)}">${esc(allLabel)}</a>`);
    } else title.textContent = [showName, countLabel].filter(Boolean).join(' · ');
    title.hidden = !title.textContent;
    const metric = project?.sections?.flatMap(s => s.metrics || []).find(m => m.section === section);
    const at = recordSource?.source_at || recordSource?.observed_at || metric?.at || recordSource?.at;
    const cutoff = $('record-at');
    cutoff.hidden = !at;
    cutoff.textContent = at ? `截至 ${stamp(at)}` : '';
    if (at) cutoff.dateTime = at;
  }
  function drawProject(d) {
    project = d;
    if (!d) return;
    $('rec').hidden = false;
    sectionName = d.sections?.flatMap((s) => s.metrics || []).find((m) => m.section === section)?.label ?? d.sections?.find((s) => s.id === section)?.label ?? label[section] ?? '逐项明细';
    // 页头第二行：这份明细记的是什么（接口给的分节名），后面跟“共 N 项”
    const sub = $('sub-name'), subText = ['results', 'archives'].includes(section) ? '' : sp(titleText(sectionName, ''));
    if (sub) { U.html(sub, U.fieldHtml(subText, { name: '分节名', place: 'title' })); sub.hidden = !subText; }
    drawRecordTitle();
    if (knowledge && recordSource) drawRecordNote(recordSource);
    document.title = [titleText(d.name, '项目') || '项目', titleText(sectionName, ''), '实况'].filter(Boolean).map(sp).join(' · ');
    drawHeader();
    updateCutoff();
    $('acts').hidden = !d.actions?.length;
    U.html($('acts'), U.actions(d, d.actions));
    $('back').textContent = titleText(d.name, '项目') || '项目';
    $('back').href = route(`/live/project/?id=${enc(id)}`);
    summaries(d);
    headRead.done(); summaryRead.done();
    L.lightUp([hero]);
  }
  function uncertainEmpty(d) {
    return d?.total === 0 && !d.items?.length && d.coverage?.complete !== true &&
      (d.coverage?.complete === false || isStale(d) || d.q === 'partial' || d.q === 'unknown');
  }
  function drawRecords(d, append = false) {
    if (!d) {
      items = []; next = null; recordTotal = recordSource = null; groupPrivate = false;
      $('record-body').hidden = true;
      drawRecordTitle(); book.set([]); drawHeader();
      return;
    }
    const field = recordAt && artifactRecordFields[section];
    const received = (d.items || []).filter(r => !recordAt || (field ? r[field] : d.at) === recordAt);
    items = append ? [...items, ...received] : received;
    next = recordAt && (field || d.at !== recordAt) ? null : d.next;
    recordTotal = recordAt && (field || d.at !== recordAt) ? items.length : d.total; recordSource = d; drawRecordTitle(); drawHeader();
    const privateRow = r => r?.visibility === 'owner' || r?.public === 'owner' || r?.hidden_block || r?.hidden;
    const publicSkills = skillUsageSection && recordViewer === 'public';
    const visibleItems = publicSkills ? items.filter(row => !privateRow(row) && !row?.private_count) : items;
    // 每条都是私事时也留各行（时间、状态照常，只藏字），不收整张表。
    groupPrivate = recordViewer === 'public' && (knowledge || privateRow(d));
    $('record-body').hidden = groupPrivate;
    if (groupPrivate) {
      book.set([]);
      drawRecordNote(d);
      recordRead.done();
      return;
    }
    const siteTodo = section.startsWith('site_todo_');
    const sorted = U.order(visibleItems, attention, `records:${section}`, siteTodo ? siteTodoKey : recordKey);
    const ordered = knowledge ? sorted : U.mergePrivateRows(sorted, { value: r => r.name || r.label || r.text || r, kind: recordViewer });
    const hiddenOnly = !publicSkills && !ordered.length && d.hidden > 0;
    // 后端本来就不给的字段，那一列不摆；给了但没数的格子照旧写原因或“还在采集”
    const has = (...keys) => items.some(r => r && typeof r === 'object' && keys.some(k => k in r && r[k] !== ''));
    const keep = knowledge ? [true, true, true] : skills ? [true, has('count'), has('last')] : [true, has(...STATE_KEYS, 'text', 'detail'), has(...TIME_KEYS)];
    const extra = ['skill_usage', 'skill_rows', 'software_versions'].includes(section) ? projectRecordTable(d, ordered) : null;
    let { columns, rows } = extra || (siteTodo ? siteTodoTable(d, ordered) : measurementTable(d, ordered) || businessTable(d, ordered)) || {
      columns: book.columns.filter((_, i) => keep[i]),
      rows: ordered.map((r, i) => bookRow(r, d, i)).map(r => r.wide ? r : { ...r, cells: r.cells.filter((_, i) => keep[i]) }),
    };
    let caption = '';
    // 每一行同一个时刻：时刻只在账簿底下写一次，不占一列
    const last = columns.length - 1;
    if (!skills && last > 0 && columns[last].id === 'at' && rows.filter(r => !r.wide && !r.locked).length > 1 && rows.filter(r => !r.wide && !r.locked).every((r, _, all) => r.cells[last] === all[0].cells[last])) {
      caption = `${text(columns[last].label)} ${rows.find(r => !r.wide && !r.locked).cells[last]}`;
      columns = columns.slice(0, last);
      rows = rows.map(r => r.wide ? r : { ...r, cells: r.cells.slice(0, last) });
    }
    const hidden = siteTodo && d.hidden > 0 ? `另有 ${text(count(d.hidden, d, 'hidden', ' 项不公开'))}` : '';
    const uncertain = uncertainEmpty(d);
    const emptyNote = recordAt ? '暂时没有读到这一次的记录' : uncertain ? d.gap || '这组记录的范围暂未核实'
      : d.text || d.gap || (siteTodo ? '没有记录' : d.items ? '这一份范围内没有记录' : U.offline?.() ? '这块没存下来，连上后补上。' : U.collectionText());
    book.set(rows, {
      columns, caption, hasNext: next != null,
      empty: uncertain ? text(emptyNote) : extra?.empty || (hiddenOnly ? hidden || U.hiddenMore?.(d.hidden, '项', d.hidden_what || '记录') || marker({ visibility: 'owner' }, recordViewer, '这些记录') : text(emptyNote)),
    });
    drawRecordNote(d, [extra?.note, !publicSkills && !hiddenOnly && d.hidden && (hidden || U.hiddenMore?.(d.hidden, '项', d.hidden_what || '记录'))]);
    recordRead.done();
    U.land();
  }
  function drawRecordNote(d, extra = []) {
    if (groupPrivate && recordViewer === 'public') {
      const name = U.fieldText(sectionName) || '这一组';
      U.html($('record-note'), esc(`${name}的${knowledge ? '认识' : ''}原文仅本人可见。`));
      return;
    }
    U.html($('record-note'), [d.note && text(d.note), ...extra].filter(Boolean).join(' · '));
  }
  function projectRecordTable(data, ordered) {
    const A = window.ProjectAdditions;
    if (skillUsageSection && A?.hasSkillUsage(data)) return skillUsageTable(data, ordered, A);
    if (id !== 'pcconfig' || section !== 'software_versions' || !A?.hasDevices(ordered)) return null;
    const columns = [{ id: 'name', label: '软件' }, { id: 'host_version', label: '台式机' }, ...A.deviceColumns];
    const timed = ordered.some(r => TIME_KEYS.some(key => r[key]));
    if (timed) columns.push({ id: 'at', label: '时刻' });
    const rows = ordered.map((r, i) => {
      const row = bookRow(r, data, i);
      if (row.wide || row.locked) return row;
      const cells = [row.cells[0], text(r.version ?? '没有记录'), ...A.deviceColumns.map(c => A.deviceCell(r, c.id, humanTime))];
      if (timed) cells.push(row.cells[2]);
      return { ...row, cells };
    });
    return { columns, rows };
  }
  function skillUsageTable(data, ordered, A) {
    const columns = [
      { id: 'name', label: '技能名' }, { id: 'd7', label: '近 7 天' }, { id: 'd30', label: '近 30 天' },
      { id: 'claude', label: 'Claude 7 天/30 天' }, { id: 'codex', label: 'Codex 7 天/30 天' },
      { id: 'antigravity', label: 'Antigravity 7 天/30 天' }, { id: 'last', label: '最近一次' },
    ];
    const rows = ordered.map((r, i) => {
      const row = bookRow(r, data, i), n = A.recorded;
      if (row.wide || row.locked) return row;
      const cells = [row.cells[0], n(r.d7), n(r.d30 ?? r.count), `${n(r.claude_d7)} / ${n(r.claude_d30 ?? r.claude)}`, `${n(r.codex_d7)} / ${n(r.codex_d30 ?? r.codex)}`,
        [r.antigravity_d7, r.antigravity_d30].map(value => value == null ? n(value) : `至少 ${n(value)}`).join(' / '), text(r.last_at ? humanTime(r.last_at) : '没有记录')];
      return { ...row, cells, sort: { ...row.sort, at: Date.parse(r.last_at) } };
    });
    const note = data.unrecorded30?.length ? `近 30 天账本里没有记录：${data.unrecorded30.join('、')}` : '';
    return { columns, rows, note: text([note, 'Antigravity 列为可确认的技能原文件读取次数。'].filter(Boolean).join(' · ')), empty: data.items == null ? '没有记录' : '0 项' };
  }
  const siteTodoKey = r => r.id || JSON.stringify([r.kind, recordKey(r)]);
  function siteTodoTable(d, ordered) {
    const fields = [
      ['kind', '类别', r => text(r.kind)],
      ['at', '时刻', r => text(stamp(r.at))],
      ['age_days', '更新间隔', r => text(count(r.age_days, r, 'age_days', ' 天没更新'))],
    ].filter(([key]) => ordered.some(r => r[key] != null));
    const columns = [{ id: 'name', label: '名称' }, ...fields.map(([id, label]) => ({ id, label }))];
    const rows = ordered.map((r, i) => {
      const row = bookRow(r, d, i);
      return row.wide ? row : {
        ...row, key: siteTodoKey(r),
        cells: [row.cells[0], ...fields.map(([key, , draw]) => row.locked || r[key] == null ? '' : draw(r))],
      };
    });
    return { columns, rows };
  }
  function measurementTable(d, ordered) {
    if (!d.columns?.length || id !== 'wechatdirect' || section !== 'measurements') return null;
    const A = window.ProjectAdditions, columns = A?.measurementColumns(d);
    return columns?.length ? { columns: columns.map(c => ({ id: c.key, label: c.label })), rows: ordered.map((r, i) => ({ key: r.id || `measurement-${i}`, cells: columns.map(c => text(A.measurementCell(r, c.key, stamp))), sort: {}, title: U.fieldText(r.text || ''), text: U.fieldText(r.text || '') })) } : null;
  }
  const dailyCounts = [
    ['date', '日期'], ['events', '使用事件数'], ['locations', '定位条数'],
    ['step_buckets', '计步时段数'], ['package_snapshots', '应用清单数'], ['through', '数据截至'],
  ];
  const businessFields = {
    'pcconfig/remote_tools': [['tool', '工具'], ['requests', '请求数'], ['state_text', '状态']],
    'pcconfig/transport': [['http_status', 'HTTP 状态码'], ['requests', '响应数'], ['state_text', '状态']],
    'pcconfig/nightly_progress': [['project', '项目'], ['phase', '检查阶段'], ['completed_count', '完成项数'], ['state_text', '结果']],
    'pcconfig/inventory_report': [['at', '盘点时刻'], ['categories', '分类数'], ['state_text', '结果']],
    'agents/skill_coverage': [['host', 'AI'], ['last_skill', '最近使用的技能'], ['completed', '完成记录'], ['state_text', '状态']],
    'phone-collector/daily': dailyCounts,
    'wly0829.cn/dwell': [
      ['page', '页面'], ['observed_seconds', '累计可见秒数'], ['samples', '有时长的次数'],
      ['unknown_opens', '时长未知的次数'], ['median_seconds', '时长中位数（秒）'], ['last_report_at', '最后回传时刻'],
    ],
  };
  const ownerBusinessFields = {
    'personal-materials/refresh_partial': [
      ['label', '位置'], ['directory', '目录'], ['reason', '未走完的原因'], ['complete_at', '上次完整刷新'], ['attempted_at', '最后一次尝试'],
    ],
    'phone-collector/daily': [...dailyCounts, ['steps_recorded', '计步读数'], ['packages_changed', '应用清单变化']],
  };
  ownerBusinessFields['phone-collector/daily_exact'] = ownerBusinessFields['phone-collector/daily'];

  function businessTable(d, ordered) {
    const key = `${id}/${section}`;
    const spec = (recordViewer === 'owner' ? ownerBusinessFields[key] : null) || businessFields[key];
    if (!spec || !ordered.length) return null;
    const [name, ...rest] = spec;
    const fields = rest.filter(([key]) => ordered.some(r => r[key] != null || r[`${key}_gap`]));
    const columns = [name, ...fields].map(([id, label]) => ({ id, label }));
    const rows = ordered.map((r, i) => {
      const row = bookRow(r, d, i, r[name[0]]);
      if (row.wide) return row;
      const cells = fields.map(([key, label]) => {
        if (row.locked) return '';
        let value = r[key] ?? r[`${key}_gap`];
        if (key === 'through' && recordViewer === 'public') {
          const day = /^\d{4}-\d\d-\d\d/.exec(U.fieldText(value, 'public'));
          if (day) value = day[0];
        }
        if (typeof value === 'string' && (key.endsWith('_at') || key === 'through')) value = format(value);
        return U.fieldHtml(value, { name: label, kind: recordViewer });
      });
      return { ...row, cells: [row.cells[0], ...cells] };
    });
    return { columns, rows };
  }

  const STATE_KEYS = ['state', 'state_text', 'current_version', 'target_version', 'version', 'bytes'], TIME_KEYS = ['file_at', 'at', 'observed_utc'];
  // 一条记录 → 账簿里的一行：各格的字照旧（访客那份、隐私占位都走 fieldHtml），另给排序、搜索、画条用的值和展开后的说明
  function bookRow(r, d, i, businessName) {
    const key = String(recordKey(r) || `record-${i}`);
    if (r.private_count) return { key, wide: U.privateSummary(r.private_count) };
    const hidden = recordViewer === 'public' && (r.hidden || r.hidden_block || r.visibility === 'owner' || r.public === 'owner');
    const states = { ready: '好了', done: '好了', ok: '已核对', waiting: '在等', pending: '在等', partial: '只读到一部分', failed: '没成', unknown: U.collectionText() };
    const plain = value => U.fieldText(value, recordViewer).trim();
    const candidate = [r.title, r.name, r.label, businessName, r.component_id, r.id].find(value => plain(value) && !/^(?:没有记录|未记录|未知)$/.test(plain(value)));
    const captured = section === 'freeze_records' && r.at ? `诊断现场 · ${U.date(r.at)} ${U.time(r.at)}` : '';
    const name = candidate || plain(r.text).split(/[。！？\n]/, 1)[0].slice(0, 48) || captured || `第 ${i + 1} 条 · 名称还没读到`;
    const mark = marker(r, recordViewer, '这项记录的内容'), small = mark ? `<small>${mark}</small>` : '';
    const label = `<span>${text(name)}</span>`;
    const gap = (k, fallback) => r[k] == null && r[`${k}_gap`] ? text(r[`${k}_gap`]) : fallback();
    const owns = keys => keys.some(k => k in r);
    const prose = [r.text, r.detail].filter((value, index, all) => plain(value) && plain(value) !== plain(name) && all.findIndex(v => plain(v) === plain(value)) === index);
    const knowledgeParts = knowledge ? knowledgeCells(r) : null;
    const proseLength = (knowledge ? [r.text, r.detail, ...(r.statements || []).map(s => s.text)] : prose).reduce((length, value) => length + plain(value).length, 0);
    const long = recordViewer !== 'owner' && proseLength > 128;   // 本人版给全文，不截成“…”
    const summary = prose.length ? long ? `<p>${esc(plain(prose[0]).slice(0, 90))}…</p>` : prose.map(value => `<p>${text(value)}</p>`).join('') : '';
    const detail = long ? (knowledge ? knowledgeParts[3] : prose.map(value => `<p>${text(value)}</p>`).join('')) : '';
    const cells = knowledge ? [knowledgeParts[0], [knowledgeParts[1], !long && knowledgeParts[3], knowledgeParts[4]].filter(Boolean).join(''), knowledgeParts[2]] : skills ? [
      `${label}${small}${U.actions(r, r.actions)}`,
      'count' in r ? gap('count', () => text(count(r.count, r.q ? r : d, 'count', ' 次'))) : '',
      'last' in r ? gap('last', () => text(stamp(r.last))) : '',
    ] : [
      `${label}${small}${U.actions(r, r.actions)}`,
      (owns(STATE_KEYS) ? `<span>${text(states[r.state_text] || r.state_text || states[r.state] || r.state || r.version || (r.bytes == null ? '未记录状态' : ''))}</span>${r.current_version != null || r.target_version != null ? `<small>${[r.current_version, r.target_version].filter(v => v != null).map(text).join(' → ')}</small>` : ''}${r.version != null && (r.state_text || r.state) ? `<small>版本 ${text(r.version)}</small>` : ''}${r.bytes != null ? `<small>${esc(bytes(r.bytes))}</small>` : ''}` : '') + (hidden ? '' : summary),
      owns(TIME_KEYS) ? gap(TIME_KEYS.find(k => k in r), () => stamp(r.file_at || r.at || r.observed_utc)) : '',
    ];
    // 私事行只藏字：名称换成锁，状态、时刻这些后台给了的照常显示。
    if (hidden) return { key, locked: true, cells: knowledge ? cells : [U.fieldHtml({ hidden: 1 }, { name: '记录内容' }), ...cells.slice(1)], sort: {}, text: '', attention: attention(r) };
    const labelText = plain(name);
    const num = v => v == null || v === '' || !Number.isFinite(Number(v)) ? null : Number(v), when = v => { const t = Date.parse(v); return Number.isFinite(t) ? t : null; };
    const status = U.status?.(r, { small: true }) || {}, lamp = ['amber', 'red', 'blue', 'gray'].includes(status.tone);
    if (lamp && status.note) cells[0] += `<small>${status.note}</small>`;
    if (skills) cells[0] += detailOf(r);
    return {
      key, cells, title: esc(labelText), text: labelText, attention: attention(r), detail, lamp: lamp ? status.lamp : '',
      expand: knowledge && long,
      sort: { name: labelText.toLowerCase(), count: num(r.count), last: when(r.last), at: when(r.file_at || r.at || r.observed_utc) },
      bar: skills ? num(r.count) : null,
    };
  }
  // 点开一行看到的：接口给的那句说明；技能还把 Claude、Codex 各自的次数和最近一次摆出来（只摆接口给了的字段）
  function detailOf(r) {
    const duplicate = skills && typeof r.text === 'string' && typeof (r.name || r.label) === 'string' && r.count != null &&
      ['：', ': '].some(sep => [String(r.count), Number(r.count).toLocaleString('zh-CN')]
        .some(value => U.sp(r.text).trim() === U.sp(`${r.name || r.label}${sep}近 30 天 ${value} 次`)));
    const say = !duplicate && r.text && (r.name || r.label) && text(r.text) !== marker(r, recordViewer) ? `<p>${text(r.text)}</p>` : '';
    if (!skills) return say;
    const n = v => `${Number(v).toLocaleString('zh-CN')} 次`;
    const hosts = [['claude', 'Claude'], ['codex', 'Codex']].map(([k, label]) => {
      const parts = [k in r && `近 30 天 ${r[k] == null ? U.collectionText() : n(r[k])}`, `${k}_d7` in r && `近 7 天 ${r[`${k}_d7`] == null ? U.collectionText() : n(r[`${k}_d7`])}`,
        `${k}_total` in r && `累计 ${r[`${k}_total`] == null ? U.collectionText() : n(r[`${k}_total`])}`, `${k}_last` in r && `最近 ${r[`${k}_last`] == null ? U.collectionText() : stamp(r[`${k}_last`])}`].filter(Boolean);
      return parts.length ? `<span class="book-detail__host"><b>${label}</b><span class="book-detail__metrics">${parts.map(s => `<span class="book-detail__metric">${text(s)}</span>`).join('')}</span></span>` : '';
    }).join('');
    const basis = r.state_text ? `<span class="book-detail__basis">${text(`按${sp(U.fieldText ? U.fieldText(r.state_text, recordViewer) : r.state_text)}算`)}</span>` : '';
    return say + (hosts || basis ? `<p class="book-detail__kv">${hosts}${basis}</p>` : '');
  }
  function watchRecords() {
    if (recordWatch) return;
    $('record-section').hidden = $('record-title').hidden = false;
    const cursor = recordAt && params.get('cursor');
    recordWatch = window.Live.watch(`projects/${enc(id)}/records`, cursor ? { section, cursor } : { section }, {
      data: (d, meta) => { recordViewer = meta.viewer?.kind || 'public'; drawRecords(d); recordsStaleAt = isStale(d) ? d.at || meta.at : null; updateCutoff(); },
      phase: (s) => { if (s.data == null) ['none', 'gone'].includes(s.phase) ? recordRead.done(false) : recordRead.set(s); },
      link(s) {
        if (s.data == null && ['none', 'gone'].includes(s.phase)) {
          U.html($('record-note'), missingHtml(s, sectionName));
          if ([404, 503].includes(s.meta?.status)) { if (!$('head').querySelector('.lamp')) $('head').insertAdjacentHTML('afterbegin', '<span class="lamp" data-tone="off" aria-hidden="true"></span>'); $('head').querySelector('.lamp').setAttribute('data-tone', 'off'); L.tone(hero, 'gray'); }
        }
        U.blockNote($('record-section'), s);
      },
    });
  }
  $('summary').addEventListener('click', (e) => {
    const btn = e.target.closest('#archive-records');
    if (!btn) return;
    archiveOpen = !archiveOpen;
    if (archiveOpen) watchRecords();
    $('record-section').hidden = $('record-title').hidden = !archiveOpen;
    btn.setAttribute('aria-expanded', String(archiveOpen));
    btn.textContent = archiveOpen ? '收起逐份档案 ›' : '展开逐份档案 ›';
  });
  // 账簿的样子：技能用量带次数条和“用得最多”“很久没用”两张摘要卡；“认识”一行好几句话，用一整页；别的明细左右两页
  function bookSetup() {
    const by = (id, label, key, dir) => ({ id, label, by: key, dir });
    if (skills) return {
      name: '技能名称', more: loadNext, singleUntil: 8,
      columns: [{ id: 'name', label: '技能名称' }, { id: 'count', label: '近 30 天用了几次', bar: true }, { id: 'last', label: '最近使用日期' }],
      sorts: [by('count-desc', '按近 30 天用了几次（降序）', 'count', -1), by('count-asc', '按近 30 天用了几次（升序）', 'count', 1), by('last-desc', '按最近使用日期（近的在前）', 'last', -1), by('last-asc', '按最近使用日期（久的在前）', 'last', 1), by('name', '按技能名称（A→Z）', 'name', 1)],
      picks: [
        { id: 'top', title: '用得最多', sub: n => `前 ${n} 项`, by: 'count', dir: -1, n: 3, keep: r => r.sort.count > 0, icon: 'bars', tone: 'green', mark: 'crown', cell: 1, sort: 'count-desc' },
        { id: 'old', title: '很久没用', sub: n => `最久的 ${n} 项`, by: 'last', dir: 1, n: 3, icon: 'time', tone: 'warm', mark: 'clock', cell: 2, sort: 'last-asc' },
      ],
    };
    if (knowledge) return {
      name: '名称', spread: false, more: loadNext,
      columns: [{ id: 'name', label: '这一项' }, { id: 'say', label: '认识' }, { id: 'at', label: '整理时间' }],
      sorts: [{ id: 'given', label: '原来的顺序' }, by('at-desc', '按整理时间（新的在前）', 'at', -1), by('name', '按名称', 'name', 1)],
    };
    return {
      name: '名称', more: loadNext, spread: !skillUsageSection, singleUntil: 8,
      columns: [{ id: 'name', label: '这一项' }, { id: 'state', label: '情况' }, { id: 'at', label: '时刻' }],
      sorts: [{ id: 'given', label: '原来的顺序' }, by('at-desc', '按时刻（新的在前）', 'at', -1), by('at-asc', '按时刻（早的在前）', 'at', 1), by('name', '按名称', 'name', 1)],
    };
  }
  // 已读到的都摆出来了，后端还有下一批：照原接口按 cursor 取，接在后面
  async function loadNext() {
    const cursor = next, source = recordSource;
    if (!cursor) return;
    const s = await window.Live.get(`projects/${enc(id)}/records`, { section, cursor });
    if (source !== recordSource || cursor !== next) return;
    const at = d => d?.source_at || d?.observed_at || d?.at;
    if (s.data && (s.meta.viewer?.kind || 'public') === recordViewer && at(source) === at(s.data) && s.data.next !== cursor) {
      drawRecords(s.data, true); recordsStaleAt ||= isStale(s.data) ? s.data.at || s.meta.at : null; updateCutoff();
    } else {
      U.html($('record-note'), locked(s) || s.offline ? missingHtml(s, sectionName) : '下一页暂时读不到，已读到的留在这里。');
    }
  }
  if (!id) {
    headRead.done(false); summaryRead.done(false);
    U.html($('head'), U.head('没有说是哪个项目', { lamp: false }));
    $('rec').hidden = true;
  } else {
    $('back').href = route(`/live/project/?id=${enc(id)}`);
    if (section !== 'results' && !archives) watchRecords();
    window.Live.watch(`projects/${enc(id)}`, null, {
      data(d, meta) { recordViewer = meta.viewer?.kind || 'public'; drawProject(d); projectStaleAt = isStale(d) ? d.at || meta.at : null; updateCutoff(); },
      phase(s) { if (s.data == null) { if (['none', 'gone'].includes(s.phase)) { headRead.done(false); summaryRead.done(false); } else { headRead.set(s); summaryRead.set(s); } } },
      link(s) {
        bar?.set(s); L.offline(s.offline);
        U.list($('notices'), s.offline ? [{ key: 'link', cls: 'notice glass', html: `<span class="lamp" aria-hidden="true"></span><span>${text(s.text)}</span>` }] : []);
        if (s.data == null && ['none', 'gone'].includes(s.phase)) {
          $('rec').hidden = true;
          U.html($('head'), locked(s) ? missingHtml(s, '项目') : U.head(missingText(s, '项目')));
          $('head').querySelector('.lamp')?.setAttribute('data-tone', 'off');
          $('meta').hidden = $('say').hidden = $('acts').hidden = true;
          L.tone(hero, 'gray');
        }
        [hero.querySelector('.card__body'), $('summary')].forEach(el => U.blockNote(el, s));
      },
    });
  }
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();
