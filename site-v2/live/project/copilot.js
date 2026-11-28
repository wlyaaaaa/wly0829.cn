(() => {
  'use strict';
  const U = window.LiveUI, { esc } = U;
  const ID = 'work-delivery-copilot', MISSING = '暂时读不到', STEP = 5;
  const CAPABILITY = '同一套资料一次做出 Word、PPT、Excel 三种文件，三份内容是同一版';
  const formats = { docx: '需求文档 · Word', pptx: '评审演示稿 · PPT', xlsx: '执行跟踪表 · Excel' };
  const paths = {
    file: 'M6 2h8l5 5v15H6z M14 2v6h5 M9 12h7m-7 4h7',
    stack: 'm2 7 10-5 10 5-10 5z M2 12l10 5 10-5 M2 17l10 5 10-5',
    bars: 'M2 2v20h20 M7 18v-6m5 6V5m5 13v-9',
    clock: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z M12 5v7h6',
  };
  const dates = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  });
  function date(at, chinese = true, clock = true) {
    if (!Number.isFinite(Date.parse(at))) return '';
    const parts = Object.fromEntries(dates.formatToParts(new Date(at)).map(({ type, value }) => [type, value]));
    return (chinese ? +parts.month + '月' + +parts.day + '日' : parts.month + '-' + parts.day)
      + (clock ? ' ' + parts.hour + ':' + parts.minute : '');
  }
  function adapt(d) {
    document.body.classList.add('pj-copilot');
    const size = d.size;
    const aged = size?.q === 'stale' && size.gap === size.stale_text
      && /^最近一次记录于 /.test(size.gap) && Date.now() - Date.parse(size.source_at) > size.stale_after * 1000;
    return { ...d, headline: null, size: aged ? { ...size, q: 'ok', stale: false, stale_after: null, gap: undefined, stale_text: undefined } : size };
  }
  function strip() {
    return '<div class="pj-cell copilot-capability" title="' + CAPABILITY + '"><span class="pj-cell__k">一套资料出</span><span class="pj-cell__v"><b>3 种文件</b></span><small class="pj-cell__sub">Word · PPT · Excel 同一版</small></div>';
  }
  function fig(m, label, reading, tail = '') {
    const raw = m?.value, unit = esc(m?.unit || '');
    const body = reading ?? (Number.isFinite(raw) ? '<b>' + esc(unit === '秒' ? raw.toFixed(2) : raw.toLocaleString('zh-CN')) + '</b> ' + unit : null);
    return '<div><span class="cp-label">' + label + '</span><div class="cp-value">' + (body ?? '<small>' + MISSING + '</small>')
      + '</div>' + (tail ? '<small class="cp-sub">' + esc(tail) + '</small>' : '') + '</div>';
  }
  const grid = (size, items) => '<div class="cp-grid cp-grid--' + size + '">' + items.join('') + '</div>';

  function card(graphBlock, key, title, icon, intro = '', note = [], cutoff = '') {
    const b = graphBlock(key, title);
    const svg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + paths[icon] + '"/></svg>';
    U.html(b.head, '<b>' + svg + esc(title) + '</b>' + (intro ? '<span>' + esc(intro) + '</span>' : ''), false);
    U.html(b.explain, [...new Set(note.filter(Boolean))].map(esc).join('<br>'), false);
    U.html(b.cut, esc(cutoff), false);
    b.explain.hidden = !note.some(Boolean);
    b.cut.hidden = !cutoff;
    return b;
  }

  const paging = new WeakMap();
  function list(b, queryKey, viewer, packet, query, project, rows, label, cutoff) {
    const key = JSON.stringify([viewer, packet?.source_at || packet?.at, packet?.items, packet?.next]);
    let state = paging.get(b.el);
    if (state?.key !== key) {
      state = { key, items: [...(packet?.items || [])], next: packet?.next, page: 0, total: packet?.total };
      paging.set(b.el, state);
    }
    const draw = () => {
      const items = project(state.items), start = state.page * STEP, last = Math.max(1, Math.ceil(items.length / STEP));
      const pages = state.next ? Math.max(last + 1, project === groups ? 0 : Math.ceil((state.total || 0) / STEP)) : last;
      const next = start + STEP < items.length || state.next;
      const body = items.slice(start, start + STEP).map(rows).join('');
      const pager = pages > 1 ? '<nav aria-label="分页"><button type="button" data-step="-1"' + (state.page ? '' : ' disabled') + '>‹ 上一页</button><span>' + (state.page + 1) + ' / ' + pages
        + '</span><button type="button" data-step="1"' + (next ? '' : ' disabled') + '>下一页 ›</button></nav>' : '';
      U.html(b.viz, '<div class="cp-list">' + (body || '<p class="cp-empty">' + (packet?.items && !cutoff ? '没有记录' : MISSING) + '</p>')
        + '</div><div class="cp-foot"><span>' + esc([packet?.items && label(items, state), cutoff, state.failed && MISSING].filter(Boolean).join(' · '))
        + '</span>' + pager + '</div>', false);
    };
    b.viz.onclick = async event => {
      const button = event.target.closest('[data-step]');
      if (!button || state.loading) return;
      const target = state.page + Number(button.dataset.step);
      if (target * STEP >= project(state.items).length && state.next) {
        state.loading = true;
        const result = await window.Live.get(queryKey, { ...query, cursor: state.next }).catch(() => null);
        state.loading = false;
        if (paging.get(b.el) !== state) return;
        const page = result?.data, at = packet?.source_at || packet?.at;
        if (result?.meta?.viewer?.kind !== viewer || !page?.items?.length || page.next === state.next
            || (at && at !== (page.source_at || page.at || result.meta.at))) { state.failed = true; draw(); return; }
        state.failed = false;
        state.items.push(...page.items);
        state.next = page.next;
      }
      if (target * STEP < project(state.items).length) state.page = target;
      draw();
      b.viz.querySelector('[data-step="' + button.dataset.step + '"]:not([disabled])')?.focus();
    };
    draw();
  }

  function groups(items) {
    const byRun = new Map();
    for (const it of items) {
      const title = U.fieldText(it.title), parts = title.split(' · ');
      const group = parts.find(s => ['指标评审', '立项评审'].includes(s)) || parts[0];
      const key = JSON.stringify([it.at, group]);
      if (!byRun.has(key)) byRun.set(key, { group, at: it.at, items: [] });
      byRun.get(key).items.push(it);
    }
    return [...byRun.values()];
  }
  function files(run, viewer, pcActions, route) {
    const ordered = [...run.items].sort((a, b) => Object.keys(formats).indexOf(a.kind) - Object.keys(formats).indexOf(b.kind));
    const tiles = ordered.map((it, i) => {
      const target = U.artifactAction(it, viewer, route);
      const action = target ? pcActions({ id: ID + '-' + it.title + '-' + it.at + '-' + i }, [target]) : '<small>' + MISSING + '</small>';
      const mark = target && viewer === 'owner' ? U.visitorLabel(it, 'open', '这份成品的正文', viewer) : '';
      return '<div class="cp-file"><span>' + esc(formats[it.kind] || U.fieldText(it.title, viewer)) + '</span>' + action + mark + '</div>';
    }).join('');
    return '<section class="cp-run"><header><b>' + esc(run.group) + '</b><time>' + esc(date(run.at, false)) + '</time></header><div class="cp-files">' + tiles + '</div></section>';
  }

  function board(d, viewer, graphBlock, host, { arts, artsState, changeLog, changeIssue, pcActions, route }) {
    document.body.classList.add('pj-copilot');
    host.classList.add('pj-board--copilot');
    const sections = d?.sections || [], delivery = sections.find(s => s.id === 'demo');
    const data = new Map(sections.flatMap(s => s.metrics || []).map(m => [m.id, m]));
    const get = id => data.get(id);
    const note = ids => delivery?.label?.startsWith('交付包') ? ids.map(id => get(id)?.note).filter(Boolean) : [];
    const latest = get('latest_demo'), day = date(latest?.value || latest?.at, true, false), when = date(latest?.value);
    const packages = get('packages'), office = get('office'), impact = get('impact')?.value;
    const built = day ? '做于 ' + (when || date(latest?.at)) : '';
    const officeText = office?.value?.text?.match(/^(\d+)(.*)$/);
    const impactText = Number.isFinite(impact?.total) && Number.isFinite(impact?.affected)
      ? '<b>' + impact.total + '</b> 条里找出 <b>' + impact.affected + '</b> 条' : null;
    const deliveryNote = day === '9月1日' && packages?.value === 2 && office?.value?.total === 6
      ? '两套交付包和 6 个文件是 9月1日 当时的程序版本用仓库自带的资料做的。文件只在本人的设备上能打开。'
      : '交付包和成品文件由出件当天的程序版本用仓库自带的资料生成。文件只在本人的设备上能打开。';
    const pack = card(graphBlock, 'demo', '交付包' + (day ? ' · ' + day : ''), 'file',
      '做出了哪些文件，资料一改能不能找出过时的内容？',
      [deliveryNote, CAPABILITY + '。', ...note(['packages', 'office', 'impact', 'stale', 'latest_demo'])], built);
    pack.group = 'copilot-delivery';
    U.html(pack.viz, '<div class="cp-inset">' + grid(2, [fig(packages, '交付包'), fig(office, '成品文件',
      officeText ? '<b>' + esc(officeText[1]) + '</b>' + esc(officeText[2]) : null,
      office?.at ? date(office.at, true, false) + ' 清点' : '')]) + grid(3, [
      fig(get('impact'), '受影响内容', impactText), fig(get('stale'), '旧交付'),
      fig(latest, '整套出件', when ? '<b class="cp-date">' + esc(when) + '</b>' : null,
        day ? '出自 ' + day + ' 当时的程序版本' : ''),
    ]) + '</div>', false);

    const artifact = card(graphBlock, 'artifacts', '最近产物', 'stack', '两套评审材料，每套三件。用仓库自带的资料生成。');
    list(artifact, 'projects/' + ID + '/artifacts', viewer, arts, {}, groups,
      row => files(row, viewer, pcActions, route),
      (items, state) => '共 ' + items.length + ' 套 ' + (state.total ?? state.items.length) + ' 份',
      (!arts || artsState?.phase === 'error' || arts?.q === 'stale') && arts?.at ? MISSING + ' · 上次截止 ' + date(arts.at) : '');

    const size = date(d?.size?.at || get('docs_files')?.at), sample = ['selected', 'versions', 'reporting_seconds', 'launch_seconds'];
    const moreCard = card(graphBlock, 'more-data', '更多数据', 'bars', '只计生成文件所用的时间',
      ['这一轮的资料数、生成耗时和项目规模', day && day + ' 那次整套出件的回执；耗时只算生成文件，不含 AI 读资料', ...note(sample)],
      [day && '前四项取自 ' + day + ' 回执', size && '规模 截止 ' + size].filter(Boolean).join(' · '));
    moreCard.group = 'copilot-more';
    const pair = (id, label) => fig(get(id), label);
    U.html(moreCard.viz, '<div class="cp-inset">' + grid(2, [pair('selected', '这一轮选定的资料'), pair('versions', '这一轮保存的资料版本')])
      + grid(2, [pair('reporting_seconds', '指标评审的 Office<wbr> 生成阶段耗时'), pair('launch_seconds', '立项评审的 Office<wbr> 生成阶段耗时')])
      + '</div><div class="cp-inset">' + grid(3, [pair('docs_files', '文档文件'), pair('code_files', '代码文件'), pair('tracked_files', 'Git 跟踪的文件')]) + '</div>', false);
    const changes = card(graphBlock, 'changes', '最近改动', 'clock');
    const last = changeLog?.source_at || changeLog?.at;
    list(changes, 'projects/changes', viewer, changeLog, { project: ID }, rows => rows,
      it => '<p class="cp-change"><time>' + esc(date(it.at, false)) + '</time><span>' + U.fieldHtml(it.text, { kind: viewer }) + '</span></p>',
      (items, state) => '共 ' + (state.total ?? items.length) + ' 条', changeIssue && (last ? MISSING + ' · 上次截止 ' + date(last) : MISSING));
    return [pack, artifact, moreCard, changes];
  }

  window.ProjectPages = Object.assign(window.ProjectPages || {}, {
    [ID]: { adapt, strip, board, ownsBoard: true, columns: keys => keys.map(() => 0) },
  });
})();
