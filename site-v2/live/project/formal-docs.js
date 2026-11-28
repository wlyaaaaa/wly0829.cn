(() => {
  'use strict';
  const ID = 'personal-formal-documents', resource = `projects/${ID}/artifacts`, step = 5;
  if (new URLSearchParams(location.search).get('id') !== ID) return;

  const U = window.LiveUI, { esc } = U;
  const stats = ['submission_pdf_versions', 'formal_files', 'signed_records', 'case_dirs',
    'matter_dirs', 'docs_files', 'code_files', 'tracked_files'];
  const moreLabels = {
    signed_records: '定稿留存记录（含重复）',
    docs_files: '仓库里的 Markdown 文档',
  };
  const files = stats.slice(5);
  const consumed = new Set(['made', 'recent', 'more-data']);
  const count = n => Number.isFinite(n) ? n.toLocaleString('zh-CN') : '—';
  const qty = (n, unit) => Number.isFinite(n) ? `${count(n)} <small>${unit}</small>` : '—';
  const missing = '<p class="docs-unavailable">暂时读不到</p>';

  function adapt(raw) {
    const sections = raw.sections || [];
    const selected = sections.filter(s => consumed.has(s.id));
    const metrics = Object.fromEntries(selected.flatMap(s => (s.metrics || []).map(m => [m.id, m])));
    const total = raw.artifacts?.count;
    return { ...raw, headline: null, artifacts: total === metrics.signed_versions?.value ? null : raw.artifacts,
      sections: sections.filter(s => !consumed.has(s.id)), docs: {
        metrics, summary: selected.find(s => s.id === 'made'), more: selected.find(s => s.id === 'more-data'),
      } };
  }

  function date(at, short = false) {
    if (!at || !Number.isFinite(Date.parse(at))) return '';
    const [m, d] = U.date(at).split('-');
    return [short ? `${m}-${d}` : `${Number(m)}月${Number(d)}日`, U.time(at)].filter(Boolean).join(' ');
  }

  function cutoff(at, stale, label = '截止') {
    const when = date(at);
    return when ? `<span>${label} <time datetime="${esc(at)}">${when}</time>${stale ? ' <b class="docs-old">旧了</b>' : ''}</span>` : '';
  }

  const foot = (body, times) => `<div class="docs-foot">${body}<div class="docs-times">${times}</div></div>`;
  const note = (section, viewer) => section?.note ?
    `<details><summary class="live-disclosure">说明 <span class="more__chev">›</span></summary><p>${esc(section.note)} ${U.visitorLabel(section, 'note', '说明', viewer)}</p></details>` : '';

  function made(metrics, section, viewer) {
    const m = key => metrics[key]?.value;
    const rows = [['submission', '已封存材料包', m('submission_pdf_pages'), 'PDF'],
      ['evidence', '整理好的材料包', m('evidence')?.pages, '正文'], ['formal', '通用文书']];
    const stale = ['signed_30d', ...rows.map(([key]) => key + '_30d')].some(key => U.isStale(metrics[key]));
    const at = metrics.signed_versions?.at;
    const noFreshRead = metrics.signed_versions?.read_error;
    const table = `<table class="docs-table"><thead><tr><td></td><th scope="col">累计</th><th scope="col">页数</th><th scope="col">近 30 天</th><th scope="col">最近一次</th></tr></thead>
      <tbody>${rows.map(([key, name, pages, qualifier]) => `<tr><th scope="row">${name}</th><td>${qty(m(key)?.versions, '版')}</td>
        <td>${Number.isFinite(pages) ? `<small>${qualifier}</small> ${qty(pages, '页')}` : '—'}</td>
        <td>${qty(m(key + '_30d'), '版')}</td><td>${date(m(key)?.latest) || '—'}</td></tr>`).join('')}</tbody></table>`;
    const totals = `<dl class="docs-totals"><div class="docs-primary"><dt>定稿</dt><dd>${qty(m('signed_versions'), '版')}</dd></div>
      <div><dt>合计</dt><dd>${qty(m('signed_pages'), '页')}</dd></div>
      <div><dt>近 30 天</dt><dd>${qty(m('signed_30d'), '版')}</dd></div>
      <div><dt>最近一次</dt><dd class="docs-date">${date(m('signed_latest')) || '—'}</dd></div></dl>`;
    const body = Number.isFinite(m('signed_versions')) ? totals + table + '<p class="docs-unavailable">上方定稿与表内三类统计有重叠，不能相加</p>' : missing;
    return body + (noFreshRead && body !== missing ? missing : '') + foot(note(section, viewer), cutoff(at, stale || !!noFreshRead));
  }

  function moreData(metrics, section, size, viewer) {
    const versions = metrics.signed_versions?.value;
    const signedNote = Number.isFinite(versions)
      ? `同一份定稿存过几次都算；上面的 ${count(versions)} 版是去掉重复后的数。`
      : '同一份定稿存过几次都算。';
    const render = key => {
      const m = metrics[key];
      if (!m) return '';
      const label = moreLabels[key] || m.label;
      const detail = key === 'signed_records' ? `<small class="docs-metric-detail">${esc(signedNote)}</small>` : '';
      return `<div><dt>${esc(label)} ${U.visitorLabel(m, 'label', label, viewer)}${detail}</dt><dd>${qty(m.value, esc(m.unit))}</dd></div>`;
    };
    const through = metrics.signed_records?.at || metrics.case_dirs?.at;
    const fileAt = files.map(key => metrics[key]?.at).find(Boolean);
    const liveStale = U.isStale(metrics.signed_30d) || stats.slice(0, 5).some(key => U.isStale(metrics[key]) || metrics[key]?.read_error);
    const checked = Date.parse(size?.source_at || fileAt);
    const filesStale = U.isStale(size) || files.some(key => U.isStale(metrics[key]) || metrics[key]?.read_error) ||
      size?.stale_after > 0 && Date.now() - checked > size.stale_after * 1000;
    const times = [cutoff(through, liveStale), cutoff(fileAt, filesStale, '文件数')].filter(Boolean).join(' · ');
    const readable = stats.some(key => Number.isFinite(metrics[key]?.value));
    const unread = stats.some(key => !Number.isFinite(metrics[key]?.value));
    return (readable ? `<dl class="docs-metrics">${stats.map(render).join('')}</dl>` : '') +
      (unread ? missing : '') + foot(note(section, viewer), times);
  }

  let list, view, snapshot, packet, first, offset = 0, pending = false, failed = false, watched = false;
  function finalRow(row) {
    const action = U.artifactAction(row, view, href => href);
    const detail = row.solves || '';
    const compact = /^共\s+\d+\s+页$/.test(detail) ? ' docs-final-detail--compact' : '';
    const openNote = U.fieldText(row.open_note, view).trim();
    const bodyTag = view === 'owner' ? (openNote
      ? U.visitorHiddenTag('这份文书的正文', openNote, view)
      : U.visitorLabel(row, 'open', '这份文书的正文', view)) : '';
    return `<li><div class="docs-final-head"><strong>${esc(row.title)}</strong><time datetime="${esc(row.at)}">${date(row.at, true)}</time></div>
      <div class="docs-final-detail${compact}">
        <div class="docs-final-note">${esc(detail)}</div>
        <div class="docs-actions">${action ? U.actions({ id: `formal-doc-${row.at}-${row.title}` }, [action]) :
          '<button class="btn btn--sm" type="button" disabled>在电脑上打开</button>'}
          ${bodyTag}${U.visitorLabel(row, 'title', '定稿名称', view)}</div>
      </div></li>`;
  }
  function drawList() {
    if (!list?.isConnected) return;
    list.setAttribute('aria-busy', String(pending));
    const rows = Array.isArray(packet?.items) ? packet.items : null;
    const time = cutoff(packet?.at || snapshot?.at, U.isStale(packet) || U.isStale(snapshot));
    const total = Number.isFinite(packet?.total) ? `<small>共 ${count(packet.total)} 份</small>` : '';
    const pager = `<div class="docs-pager">${total}<button type="button" class="more" data-docs-page="prev" ${!offset ? 'disabled' : ''}>‹ 上一页</button>
      <span>第 ${offset / step + 1} 页</span>
      <button type="button" class="more" data-docs-page="next" ${!packet?.next ? 'disabled' : ''}>下一页 ›</button></div>`;
    const body = rows?.length ? rows.map(finalRow).join('') : `<li>${rows ? '没有定稿' : missing}</li>`;
    const html = `<ol class="docs-finals">${body}</ol>` + (failed || packet?.q === 'partial' ? missing : '') + foot(pager, time);
    if (list._docsHtml !== html) {
      const focused = list.querySelector(':focus')?.dataset.docsPage;
      U.html(list, html, false);
      list._docsHtml = html;
      if (focused) (list.querySelector(`[data-docs-page="${focused}"]:enabled`) ||
        list.querySelector('[data-docs-page]:enabled'))?.focus({ preventScroll: true });
    }
  }
  async function turn(cursor) {
    const viewer = view, original = list;
    pending = true; failed = false; drawList();
    try {
      const result = cursor ? await window.Live.get(resource, { cursor: String(cursor) }) : null;
      if (viewer !== view || original !== list) return;
      const next = cursor ? result?.meta?.viewer?.kind === view && result.data : first;
      if (Array.isArray(next?.items)) { packet = next; offset = cursor; }
      else failed = true;
    } catch {
      if (viewer === view && original === list) failed = true;
    } finally {
      if (viewer === view && original === list) { pending = false; drawList(); }
    }
  }

  function board(data, viewer, graphBlock, boardEl) {
    boardEl.classList.add('pj-board--formal-docs');
    const card = (key, title, html) => {
      const b = graphBlock(key, title);
      b.el.classList.add('docs-card');
      if (html !== undefined && b.viz._docsHtml !== html) {
        U.html(b.viz, html, false);
        b.viz._docsHtml = html;
      }
      return b;
    };
    const { metrics, summary, more } = data.docs;
    const recent = card('artifacts', '最近做出的定稿');
    if (view !== viewer) { view = viewer; first = packet = null; offset = 0; pending = failed = false; }
    snapshot = metrics.signed_30d || metrics.signed_versions;
    list = recent.viz;
    list.onclick = event => {
      const direction = event.target.closest('[data-docs-page]')?.dataset.docsPage;
      if (direction && !pending) void turn(direction === 'next' ? Number(packet.next) : Math.max(0, offset - step));
    };
    if (!watched) {
      watched = true;
      window.Live.watch(resource, null, { data(value, meta) {
        if (meta?.viewer?.kind !== view) return;
        first = value;
        if (!offset || packet?.at !== value?.at && !pending) { packet = first; offset = 0; }
        drawList();
      } });
    }
    queueMicrotask(drawList);

    const related = data.related_items;
    const link = related?.href && related.label ?
      `<div class="docs-items"><b>${esc(related.label)}</b> ${U.visitorLabel(related, 'label', '事项入口', viewer)}
        <span>进展、期限和下一步在原事项里</span><a class="more" href="${esc(related.href)}">去看 ›</a></div>` : missing;
    return [card('docs-made', '做成了多少', made(metrics, summary, viewer)), recent,
      card('docs-more', '更多数据', moreData(metrics, more, data.size, viewer)),
      card('docs-changes-unavailable', '最近改动', missing), card('docs-items', '', link)];
  }

  const columns = keys => {
    const narrow = matchMedia('(max-width: 1100px)').matches;
    return keys.map(key => narrow || ['docs-made', 'docs-more'].includes(key) ? 0 : 1);
  };
  window.ProjectPages = Object.assign(window.ProjectPages || {}, { [ID]: { adapt, board, columns, noArtifacts: true } });
})();
