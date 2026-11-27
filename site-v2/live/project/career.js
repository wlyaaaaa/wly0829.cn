(() => {
  'use strict';
  const U = window.LiveUI, { esc } = U, ID = 'career-development', MISSING = '暂时读不到', PAGE = 5;
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const iso = at => at?.length === 10 || /(?:Z|[+-]\d\d:\d\d)$/.test(at || '') ? at : at && `${at}+08:00`;
  const parts = at => Number.isFinite(Date.parse(iso(at))) && Object.fromEntries(fmt.formatToParts(new Date(iso(at))).map(p => [p.type, p.value]));
  const date = (at, time = false) => { const p = parts(at); return p ? `${+p.month}月${+p.day}日${time && at.length > 10 ? ` ${p.hour}:${p.minute}` : ''}` : ''; };
  const day = at => { const p = parts(at); return p ? Date.UTC(p.year, p.month - 1, p.day) : NaN; };
  const age = at => { const n = (day(new Date().toISOString()) - day(at)) / 86400000; return n > 0 ? `${n} 天前` : Number.isFinite(n) ? '今天' : ''; };
  const count = (value, unit) => Number.isFinite(value) ? `<span class="career-number">${value.toLocaleString('zh-CN')}${unit ? ` <small>${esc(unit)}</small>` : ''}</span>` : MISSING;
  const cutoff = (at, label = '截止', freshness) => [date(at, true) && `${label} ${date(at, true)}`, U.isStale(freshness) && '旧了'].filter(Boolean).join(' · ');
  const get = metrics => id => metrics?.find(m => m.id === id);
  const note = metrics => (metrics || []).flatMap(m => [m.note, m.scope]).filter(Boolean);
  const value = m => m?.value ?? null;
  const text = (m, otherwise = MISSING) => m?.text || m?.value?.text || m?.unknown_text || otherwise;
  const select = (line, id) => line?.sections?.find(s => s.id === id);
  const fixture = new URLSearchParams(location.search).get('fixture'), related = path => fixture === null ? path : `${path}&fixture=${encodeURIComponent(fixture)}`;
  const detail = m => m?.section ? `<a class="career-detail" href="${esc(related(`/live/records/?project=${ID}&section=${encodeURIComponent(m.section)}`))}">明细 ›</a>` : '';
  const row = (label, reading, tail = '') => `<div class="career-row"><b>${esc(label)}</b><span>${reading}</span>${tail}</div>`;
  const tile = (label, reading, small = '') => `<div><span>${esc(label)}</span><strong>${reading}</strong>${small}</div>`;
  const pager = (kind, i, pages, busy = false) => [-1, 1].map(step => `<button type="button" data-career-${kind}="${step}" aria-label="${kind === 'line' ? (step < 0 ? '上一条学习线' : '下一条学习线') : (step < 0 ? '上一页产物' : '下一页产物')}"${busy || i + step < 0 || i + step >= pages ? ' disabled' : ''}>${step < 0 ? '‹' : '›'}</button>`).join('');
  const foot = (when, notes = []) => when || notes.length ? `<footer class="career-foot">${notes.length ? `<details><summary class="live-disclosure">说明 <span class="disclosure-chev">›</span></summary><p>${[...new Set(notes)].map(esc).join('<br>')}</p></details>` : '<span></span>'}<span>${esc(when)}</span></footer>` : '';
  const paths = {
    layers: 'M2 7l10-5 10 5-10 5z M2 12l10 5 10-5 M2 17l10 5 10-5',
    book: 'M12 6C8 3 5 3 2 4v15c4-1 7 0 10 2 3-2 6-3 10-2V4c-3-1-6-1-10 2v15',
    school: 'M2 8l10-5 10 5-10 5z M6 10v7c4 4 8 4 12 0v-7 M22 8v7',
    goal: 'M20 8a9 9 0 1 1-4-4 M16 11a5 5 0 1 1-3-3 M12 12l8-8 M18 4h2v2',
    size: 'M3 20v-7h4v7z M10 20V4h4v16z M17 20V9h4v11z', clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M12 6v6l4 3',
  };
  function card(make, key, title, icon, html, extra = '') {
    const b = make(key, title);
    U.html(b.head, `<svg class="career-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[icon]}"/></svg><b>${esc(title)}</b>${extra}`, false);
    U.html(b.viz, html, false);
    return b;
  }

  function progress(make, line, viewer) {
    const metrics = select(line, 'learning')?.metrics, m = get(metrics);
    const completed = value(m('completed')), started = value(m('started'));
    const total = completed?.total ?? completed?.prepared, done = completed?.done ?? completed?.count;
    const exercises = value(m('exercises')), groups = exercises?.groups?.map(it => `${it.label} ${it.count} ${it.unit}`).join(' · ');
    const next = viewer === 'owner' && line?.next_first_step;
    const read = (key, label, tail) => tile(label, count(value(m(key)), m(key)?.unit), tail);
    const missing = line?.missing_minutes_dates?.map(at => date(at)).filter(Boolean).join('、');
    const meter = Number.isInteger(total) && total > 0 && Number.isFinite(done) ? `<div class="career-hero-num">${count(done)} / ${count(total, '课')} <small>课程上完</small></div>
      <div class="career-meter" role="progressbar" aria-label="课程上完" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${Math.min(done, total)}" style="--lessons:${total}">${Array.from({ length: total }, (_, i) => `<i class="${i < done ? 'is-done' : i === done && started ? 'is-started' : ''}"></i>`).join('')}</div>` : `<b>课程上完</b> · ${MISSING}`;
    const lesson = started?.lessons?.map(it => `第 ${it.number} 课 · ${it.title}`).join('、');
    const body = `${meter}<p class="career-started"><b>开了头没上完</b> · ${esc(lesson || text(m('started')))}</p>
      <div class="career-tiles">${read('class_days', '有上课记录', detail(m('class_days')))}${read('days30', '近 30 天')}${read('days7', '近 7 天')}${read('known_minutes', '已记时长', missing ? `<small>${esc(missing)}那次没记</small>` : '')}</div>
      <div class="career-tiles career-tiles--practice">${read('quiz', '复习抽问答过')}${tile('自己动手练习', esc(groups || text(m('exercises'))))}</div>
      ${next?.text ? `<aside class="career-next"><b>⊙ 下一步${next.minutes ? ` · 约 ${esc(next.minutes)} 分钟` : ''}</b>${U.visitorHiddenTag('下一步', '', viewer)}<p>${esc(next.text)}</p></aside>` : ''}`;
    const stale = line?.stale_after && Date.now() - Date.parse(iso(line.checked_at)) > line.stale_after * 1000;
    const through = [cutoff(line?.progress_at, '学习记录整理于'), cutoff(line?.checked_at, '最近核对', { stale: !!stale })].filter(Boolean).join(' · ');
    return card(make, 'career-progress', '学到哪了', 'book', (metrics?.some(m => m.value != null || m.text) ? body : MISSING) + foot(through, note(metrics)));
  }

  function prepared(make, line) {
    const metrics = select(line, 'prepared')?.metrics, m = get(metrics), lectures = value(m('lectures')), queue = value(m('question_queue')), history = value(m('question_history'));
    const labels = lectures?.sections?.map(it => `${it.label} ${it.count}`).join(' · ');
    const q = queue?.total == null ? esc(text(m('question_queue'))) : `<b>${count(queue.total, '题')}</b>${queue.taught != null ? ` · 已教 ${esc(queue.taught)} · 待教 ${esc(queue.pending_teach)} · 待问 ${esc(queue.pending_ask)}` : ''}`;
    const read = (key, label, extra = '') => row(label, count(value(m(key)), m(key)?.unit) + extra, detail(m(key)));
    const body = `<div class="career-hero-num">${count(lectures?.total ?? lectures?.count, '篇讲义')} <small>${esc(labels || '')}</small></div>
      ${read('exercise_groups', '配套练习')}${row('题单', q + (line?.queue_at ? `<small>${esc(cutoff(line.queue_at))}</small>` : ''), detail(m('question_queue')))}
      ${row('题单问答记录', history?.questions != null ? `${count(history.questions, '题')} · ${count(history.records, '条')}（含初次授课）` : esc(text(m('question_history'))), detail(m('question_history')))}
      ${read('lecture_files', '讲义文件', '（含多种格式）')}${read('practice_files', '练习目录文件')}`;
    return card(make, 'career-prepared', '老师备了什么', 'school', (metrics?.some(m => m.value != null || m.text) ? body : MISSING) + foot(cutoff(line?.at, '截止', m('lectures')), note(metrics)));
  }

  function goal(make, line, viewer) {
    if (!line?.goal?.name) {
      const empty = card(make, 'career-goal', '', 'goal', '');
      empty.el.hidden = true;
      return empty;
    }
    const { name, metrics, showcase } = line.goal, m = get(metrics), a = m('interviews'), b = m('interview_files');
    const rows = metrics?.filter(it => it !== a && it !== b).map(it => row(it.label, it.value == null ? esc(text(it)) : count(it.value, it.unit))).join('');
    const items = showcase?.items?.map(it => {
      const href = /^https:\/\/wly0829\.cn\/live\/project\/\?id=[\w.-]+$/.test(it.open || '') ? related(new URL(it.open).pathname + new URL(it.open).search) : '';
      return href ? `<a href="${esc(href)}"><span>${esc([it.title, it.kind].filter(Boolean).join(' · '))}</span><b>›</b></a>` : esc(it.title);
    }).join('');
    const html = `<div class="career-goal"><section><h4>进展</h4>${rows || MISSING}</section><section><h4>${esc(a?.label || '资料')}</h4><div class="career-hero-num">${count(value(a), a?.unit)}</div>${row('目录文件', count(value(b), b?.unit))}</section><section><h4>可以拿来讲的作品</h4><div class="career-works">${items || MISSING}</div></section></div>`;
    const when = [cutoff(line.progress_at, '进展截止'), cutoff(a?.at, '资料截止', a), cutoff(showcase?.at, '作品截止')].filter(Boolean).join(' · ');
    const block = card(make, 'career-goal', `这条线的目标：${name}`, 'goal', html + foot(when, note(metrics)), U.visitorHiddenTag('这条线的目标', '', viewer));
    block.el.hidden = false;
    return block;
  }

  let selected, current, draw = () => {}, artifactHost, art, first, artPage = 0, loading = false, failed = false, viewer, subscription;
  function showArtifacts() {
    const items = art?.items || [], total = art?.total ?? current?.artifacts?.count, pages = Math.ceil((total ?? items.length) / PAGE);
    const rows = items.slice(artPage * PAGE, artPage * PAGE + PAGE).map((it, i) => {
      const title = U.fieldText(it.title || it.recent_title, viewer), target = U.artifactAction(it, viewer, x => x);
      const tag = U.visitorHiddenMark(it, '这份成品', viewer, { keys: ['$'] });
      return `<li><span>${esc(title)} ${tag}</span><time>${esc(date(it.at_precision === 'date' ? it.at?.slice(0, 10) : it.at, true))}</time>${target ? U.actions({ id: `${ID}-${artPage}-${i}`, title }, [target]) : ''}</li>`;
    });
    if (artifactHost) U.html(artifactHost, `<ul class="career-artifacts">${rows.join('')}</ul>${rows.length ? '' : art && !items.length ? '还没有产物' : MISSING}
      <div class="career-foot"><span>${total != null ? `共 ${esc(total)} 份` : ''}${pages ? ` · ${artPage + 1}/${pages} 页 ${pager('art', artPage, pages, loading)}` : ''}</span><span>${esc([failed && MISSING, cutoff(current?.artifacts?.at || art?.source_at || art?.at, '截止', art)].filter(Boolean).join(' · '))}</span></div>`, false);
  }
  async function turnArtifacts(step) {
    const destination = artPage + step, original = art, cursor = art?.next;
    if (destination < 0 || loading) return;
    failed = false;
    if (cursor && art.items.length < (destination + 1) * PAGE) {
      loading = true;
      showArtifacts();
      const { data, meta } = await window.Live.get(`projects/${ID}/artifacts${fixture === null ? '' : `-${encodeURIComponent(cursor)}`}`, { cursor }).catch(() => ({}));
      loading = false;
      if (art !== original) return showArtifacts();
      failed = !data?.items?.length || meta?.viewer?.kind !== viewer;
      if (!failed) art = { ...data, items: [...art.items, ...data.items] };
    }
    if (!failed && destination * PAGE < (art?.items?.length || 0)) artPage = destination;
    showArtifacts();
  }
  function board(d, mode, make, host) {
    if (viewer !== mode) { subscription?.stop(); subscription = null; artifactHost = art = first = null; artPage = 0; failed = false; }
    current = d; viewer = mode; host.classList.add('pj-board--career');
    draw = () => {
      const lines = current.lines || [], i = Math.max(0, lines.findIndex(l => l.id === selected)), line = lines[i];
      const label = line && [line.name, line.status === 'current' ? '当前' : '收起', date(line.started_at) && `${date(line.started_at)}起`].filter(Boolean).join(' · ');
      const lineBody = `<div class="career-line"><span>${label ? `<b>${esc(label)}</b>` : MISSING}</span>${line?.status === 'archived' ? `<span>${esc([cutoff(line.ended_at, '收起于'), line.result].filter(Boolean).join(' · '))}</span>` : ''}<span>共 ${lines.length} 条 ${pager('line', i, lines.length)}</span></div>`;
      return [card(make, 'career-line', '学习线', 'layers', lineBody), progress(make, line, viewer), prepared(make, line), ...(viewer === 'owner' ? [goal(make, line, viewer)] : [])];
    };
    if (!subscription) {
      subscription = window.Live.watch(`projects/${ID}/artifacts`, null, { data(data, meta) {
        if ((meta?.viewer?.kind || 'public') !== viewer || !data) return;
        const signature = JSON.stringify([data.items, data.next]);
        if (signature !== first) { first = signature; art = data; artPage = 0; failed = false; }
        showArtifacts();
      } });
    }
    const artifacts = card(make, 'artifacts', '最近产物', 'layers', '');
    artifactHost = artifacts.viz;
    showArtifacts();
    const more = current.careerMore || [];
    const missingChanges = card(make, 'career-changes', '最近改动', 'clock', MISSING + foot(cutoff(d.changed?.at)));
    return [...draw(), artifacts, missingChanges, card(make, 'career-more', '更多数据', 'size', `<div class="career-more">${more.length ? more.map(m => row(m.label, Number.isFinite(m.value) && m.value >= 10000 ? count(Math.round(m.value / 1000) / 10, `万${m.unit}`) : count(m.value, m.unit))).join('') : MISSING}</div>` + foot(cutoff(d.size?.at, '截止', d.size), note(more)))];
  }
  document.addEventListener('click', e => {
    const lineButton = e.target.closest?.('[data-career-line]'), artButton = e.target.closest?.('[data-career-art]');
    if (lineButton) {
      const lines = current.lines, i = Math.max(0, lines.findIndex(l => l.id === selected));
      selected = lines[i + Number(lineButton.dataset.careerLine)]?.id;
      draw();
    }
    if (artButton) turnArtifacts(Number(artButton.dataset.careerArt));
  });
  function adapt(d) {
    const source = d.lines?.find(l => l.status === 'current') || d.lines?.[0], top = d.sections || [];
    selected = d.lines?.some(l => l.id === selected) ? selected : source?.id;
    const metric = get(select(source, 'learning')?.metrics)('last_class') || get(top.flatMap(s => s.metrics || []))('last_class');
    const last = typeof metric?.value === 'string' ? metric.value.match(/^\d{4}-\d\d-\d\d/)?.[0] : metric?.value?.date;
    return { ...d, headline: 'last_class', showcase: null, careerMore: top.find(s => s.id === 'more-data')?.metrics, careerLast: last,
      sections: [{ id: 'career-headline', metrics: [{ id: 'last_class', label: '上次上课', text: date(last) || MISSING, note: age(last) }] }] };
  }
  U.onBeijingDayChange(() => {
    const sub = document.querySelector('.pj-strip .pj-cell:first-child .pj-cell__sub');
    if (sub && current?.careerLast) sub.title = sub.textContent = age(current.careerLast);
  });
  window.ProjectPages = Object.assign(window.ProjectPages || {}, { [ID]: { adapt, board, noArtifacts: true, columns: keys => keys.map(k => ['changes', 'career-changes', 'career-more'].includes(k) ? 1 : 0) } });
})();
