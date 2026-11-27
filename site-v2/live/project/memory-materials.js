(() => {
  'use strict';
  const U = window.LiveUI;
  const { esc } = U;
  const dateFormat = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: 'numeric', day: 'numeric'
  });
  const today = () => new Date(Date.now() + 8 * 3600000).toISOString().slice(0, 10);
  const missing = '暂时读不到';
  const icons = {
    memory: '<path d="M3 8 12 3l9 5-9 5-9-5Zm0 4 9 5 9-5M3 16l9 5 9-5"/>',
    materials: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6m-6 4h6m-6 4h3"/>'
  };
  const number = (n, unit = '') => Number.isFinite(n)
    ? `<span class="mm-unit">${esc(n.toLocaleString('zh-CN'))}${unit ? ` ${unit}` : ''}</span>`
    : '';

  function dateText(value) {
    if (typeof value !== 'string' || !value) return '';
    const dateOnly = /^\d{4}-\d\d-\d\d$/.test(value);
    const parsed = new Date(value);
    if (!Number.isFinite(+parsed)) return '';
    const { year, month, day } = Object.fromEntries(dateFormat.formatToParts(parsed).map(part => [part.type, part.value]));
    return `${year === today().slice(0, 4) ? '' : year + '年'}${month}月${day}日${dateOnly ? '' : ' ' + U.time(value)}`;
  }

  function elapsed(date) {
    const days = (Date.parse(today()) - Date.parse(date)) / 86400000;
    return days >= 0 ? `距今 ${days} 天` : '';
  }

  function adapt(project) {
    if (project.headline !== 'latest_memory') return project;
    const hero = document.getElementById('pj-hero');
    if (!hero.classList.contains('mm-hero')) {
      hero.classList.add('mm-hero');
      hero.querySelector('.card__pic img').src = '/live/project/memory-materials-hero.webp';
    }
    const ownSections = new Set(['materials', 'more-data']);
    const ownMetrics = new Set(['latest_memory', 'memory_rows', 'speech_samples', 'courses', 'course_lessons', 'card_files']);
    const metrics = {};
    const sections = (project.sections || []).flatMap(section => {
      if (!ownSections.has(section.id)) return [section];
      const remaining = (section.metrics || []).filter(metric => {
        if (!ownMetrics.has(metric.id)) return true;
        metrics[metric.id] = metric.read_error ? { ...metric, value: null } : metric;
        return false;
      });
      return remaining.length || section.hidden ? [{ ...section, metrics: remaining }] : [];
    });
    return { ...project, sections, headline: null, memoryMaterials: metrics };
  }

  function makeCard(graphBlock, key, title, icon) {
    const card = graphBlock(key, title);
    card.group = key;
    U.html(card.head, `<b><svg aria-hidden="true" viewBox="0 0 24 24">${icons[icon]}</svg>${esc(title)}</b>`);
    return card;
  }

  function tail(card, cutoff, notes) {
    card.cut.hidden = !cutoff;
    card.cut.textContent = cutoff;
    const distinct = [...new Set(notes.filter(note => typeof note === 'string' && note.trim()))];
    card.explain.hidden = !distinct.length;
    U.html(card.explain, distinct.map(esc).join('<br>'));
  }

  function memoryCard(card, project, metric = {}) {
    const date = typeof metric.value === 'string' && /^\d{4}-\d\d-\d\d$/.test(metric.value) ? metric.value : '';
    const latest = dateText(date), sampled = dateText(metric.at || project.size?.at), checked = dateText(metric.checked_at);
    let timeline = '';
    if (latest) {
      const points = [
        [latest, '最新一条记录', 'start'], [sampled, '统计', ''],
        [checked, '最近核对', ''], ['今天', '', 'end']
      ].filter(([time]) => time);
      timeline = `<div class="mm-gap">这之后没有记录</div><ol class="mm-timeline">
        ${points.map(([time, label, position]) => {
          const stamp = time.replace('年', '年 ').split(' ').map(part => {
            const extra = part.endsWith('年') || part.includes(':');
            return `<span${extra ? ' class="mm-stamp-extra"' : ''}>${esc(part)}</span>`;
          }).join(' ');
          return `<li class="${position}"><b title="${esc(time)}">${stamp}</b>${label ? `<span>${label}</span>` : ''}</li>`;
        }).join('')}
      </ol>`;
    }
    U.html(card.viz, latest
      ? `<p class="mm-reading"><strong>${esc(latest)}</strong><span>最新一条记录</span></p>
         <p class="mm-elapsed" data-record-date="${esc(date)}">${esc(elapsed(date))}</p>${timeline}`
      : `<p class="pj-note">${missing}</p>`, false);
    const stale = U.isStale(metric) ? ' · 旧了' : '';
    const cutoff = latest && checked ? `每晚核对 · 最近成功 ${checked}` : sampled ? `截止 ${sampled}` : '';
    tail(card, cutoff && cutoff + stale, [metric.note]);
  }

  function materialsCard(card, project, metrics) {
    const memory = metrics.memory_rows || {}, speech = metrics.speech_samples || {};
    const courses = metrics.courses || {}, lessons = metrics.course_lessons || {}, files = metrics.card_files || {};
    const count = number(memory.value);
    const join = parts => parts.some(Boolean) ? parts.map(part => part || missing).join(' · ') : missing;
    const reading = (label, value, unit) => Number.isFinite(value) ? `<span class="mm-unit">${label} ${number(value, unit)}</span>` : '';
    const v = speech.value, c = courses.value;
    const rows = [
      ['本人的说话样本', join([reading('文字', v?.message_groups, '组'), reading('语音转文字', v?.voice_text_rows, '条')])],
      ['课程资料', join([number(c?.directories, '套'), reading('原文', c?.original_text_files, '份'), reading('做法说明', c?.method_documents, '份')])],
      ['课程实际讲数（去重后）', number(lessons.value, '讲') || missing],
      ['已保存的卡片文件', number(files.value, '份') ? `${number(files.value, '份')} <small>只数文件，不是人数</small>` : missing]
    ];
    const inputs = [memory, speech, courses, lessons, files];
    const haveRows = rows.some(([, value]) => value !== missing);
    U.html(card.viz, count || haveRows
      ? `<p class="mm-reading">${count ? `<strong>${count} <small>条</small></strong><span>AI 记着的事</span>` : missing}</p>
         <dl class="mm-rows">${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl>`
      : `<p class="pj-note">${missing}</p>`, false);
    const sampled = dateText(inputs.find(metric => metric.at)?.at || project.size?.at);
    tail(card, sampled && `截止 ${sampled}${inputs.some(U.isStale) ? ' · 旧了' : ''}`, inputs.map(metric => metric.note));
  }

  function board(project, _viewer, graphBlock, boardEl) {
    if (!project.memoryMaterials) return [];
    if (!boardEl.classList.contains('pj-board--memory-materials')) {
      boardEl.classList.add('pj-board--memory-materials');
      U.onBeijingDayChange(() => {
        const age = boardEl.querySelector('.mm-elapsed');
        if (age) age.textContent = elapsed(age.dataset.recordDate);
      });
    }
    const memory = makeCard(graphBlock, 'memory-date', 'AI 记到哪了', 'memory');
    const materials = makeCard(graphBlock, 'memory-materials', '攒了多少材料', 'materials');
    memoryCard(memory, project, project.memoryMaterials.latest_memory);
    materialsCard(materials, project, project.memoryMaterials);
    return [memory, materials];
  }

  const columns = keys => keys.includes('memory-date') ? keys.map(key => key === 'changes' ? 1 : 0) : null;
  const id = new URLSearchParams(location.search).get('id');
  const pages = window.ProjectPages ||= {};
  if (id && !Object.hasOwn(pages, id)) {
    Object.defineProperty(pages, id, { value: { adapt, board, columns }, writable: true, enumerable: true });
  }
})();
