// 项目页专用：只画接口给的数，示意数由 fixture 提供。
(() => {
  'use strict';
  const U = window.LiveUI, { esc } = U;
  const skillHosts = [['claude', 'Claude', 'teal'], ['codex', 'Codex', 'violet'], ['antigravity', 'Antigravity', 'ochre']];
  const skills = skillHosts.flatMap(([key]) => ['total', 'd7', 'd30'].map(period => `${key}_${period}`));
  const finite = n => typeof n === 'number' && Number.isFinite(n);
  const emptyText = text => U.offline?.() ? '这块没存下来，连上后补上。' : text;
  function ago(at, now = Date.now()) {
    if (!at) return U.offline?.() ? '' : U.collectionText('改动时间');
    const t = Date.parse(/(?:Z|[+-]\d\d:\d\d)$/.test(at) ? at : `${at}${at.length === 10 ? 'T00:00:00' : ''}+08:00`);
    if (!Number.isFinite(t)) return U.offline?.() ? '' : U.collectionText('改动时间');
    if (U.offline?.()) return `${U.time(new Date(t).toISOString())} 改动`;
    const m = Math.max(0, Math.floor((now - t) / 60000));
    return `${m < 1 ? '刚刚' : m < 60 ? `${m} 分钟前` : m < 1440 ? `${Math.floor(m / 60)} 小时前` : `${Math.floor(m / 1440)} 天前`}改动`;
  }
  const lower = (m, key) => m?.q === 'partial' && (!Array.isArray(m.partial) || m.partial.includes(key));
  const gap = m => m?.gap || '';
  function summary(host, data, viewer) {
    const missing = [], parts = [['changed_7d', '近 7 天', '个项目动过', 1], ['docs_chars', '文档', '万字', 1e4], ['code_lines', '代码', '万行', 1e4]].map(([key, name, unit, scale]) => {
      if (data?.[`${key}_visibility`] === 'owner' && viewer === 'public') return `<span><small>${name}</small>${U.visibilityNote({ visibility: 'owner', hidden_what: data.hidden_what }, viewer, `${name}统计`)}</span>`;
      if (!finite(data?.[key])) { missing.push(name); return ''; }
      return `<span><small>${name}</small><b>${lower(data, key) ? '至少 ' : ''}${esc((data[key] / scale).toLocaleString('zh-CN', { maximumFractionDigits: 1 }))}</b><small>${unit}</small></span>`;
    });
    host.innerHTML = parts.join('') + (data?.q === 'partial' && gap(data) ? `<small>${esc(gap(data))}</small>` : '') + (missing.length ? `<span class="pj-summary-none">${U.offline?.() ? parts.some(Boolean) ? '' : emptyText('') : esc(U.collectionText(missing.join('、'), data))}</span>` : '');
  }
  const heat = n => n == null || n === 0 ? 0 : n <= 2 ? .35 : n <= 5 ? .65 : 1;
  function heatmap(host, data, viewer, route, { aligned = false } = {}) {
    if (!data || !aligned && U.offline?.() && (!data.days?.length || !data.items?.some(r => r.commits?.some(finite)))) { host.innerHTML = `<p class="pj-note">${emptyText(U.collectionText('提交数', data))}</p>`; return; }
    let days = data.days || [], rows = data.items || [];
    while (!aligned && days.length && rows.length && rows.every(r => !finite(r.commits?.[0]))) { days = days.slice(1); rows = rows.map(r => ({ ...r, commits: r.commits?.slice(1) })); }
    const name = r => { const label = U.fieldHtml?.(r.name, { name: '项目', place: 'label', kind: viewer }) ?? esc(r.name), moved = label !== esc(r.name), note = moved ? U.fieldHtml(r.name, { name: '项目', kind: viewer, marker: true }) : U.visibilityNote(r, viewer, '项目名'); return `<span class="pj-heat-name" title="${esc(r.name)}"><span class="pj-heat-label">${r.href ? `<a href="${esc(route(r.href))}">${label}</a>` : label}</span>${note && (moved || viewer === 'public') ? `<small class="pj-heat-private${viewer === 'public' ? ' has-note' : ''}">${note}</small>` : ''}</span>`; };
    host.innerHTML = `<div class="pj-heat-scroll"><div class="pj-heat" style="--days:${days.length}"><span></span>${days.map((d, i) => `<small class="${i === days.length - 1 ? 'is-last' : ''}">${(i % 7 === 0 && i < days.length - 4) || i === days.length - 1 ? esc(d.slice(5)) : ''}</small>`).join('')}${rows.map(r => `${name(r)}${days.map((d, i) => {
      const n = r.commits?.[i], label = `${U.fieldText?.(r.name) ?? r.name} · ${d.slice(5)} · ${finite(n) ? `${lower(r, 'commits') ? '至少 ' : ''}${n} 次提交` : U.collectionText('提交数', r)}`;
      return `<button type="button" class="pj-heat-cell${!finite(n) ? ' is-unknown' : ''}" style="--heat:${heat(n)}" aria-label="${esc(label)}" title="${esc(label)}"></button>`;
    }).join('')}`).join('')}</div></div>
    <div class="pj-heat-legend"><span>每天提交次数</span>${[[0, '0'], [1, '1–2'], [3, '3–5'], [6, '6+'], [null, U.collectionText()]].map(([n, label]) => `<span><i class="pj-heat-cell${n == null ? ' is-unknown' : ''}" style="--heat:${heat(n)}"></i>${label}</span>`).join('')}</div>
    <p class="pj-note">${days.length ? `${esc(days[0].slice(5))} — ${esc(days.at(-1).slice(5))}` : ''}${viewer === 'owner' && data.hidden ? ` · ${U.hiddenMore(data.hidden, '个', data.hidden_what || '项目')}` : ''}</p><p class="pj-heat-read pj-note" aria-live="polite">指向或点一格查看提交数</p>`;
    bindHeat(host);
  }
  // 点一格：这一格加粗框、放大，同一行的项目名一起亮，读数写“已选”；指着别的格子时临时显示那一格，移开回到已选的那格
  function bindHeat(host) {
    const read = host.querySelector('.pj-heat-read');
    if (!read) return;
    const idle = read.textContent;
    let picked = null;
    const rowName = el => { let n = el.previousElementSibling; while (n && !n.classList.contains('pj-heat-name')) n = n.previousElementSibling; return n; };
    const show = el => { read.textContent = el.getAttribute('aria-label'); read.classList.toggle('is-picked', el === picked); };
    const rest = () => { if (picked) show(picked); else { read.textContent = idle; read.classList.remove('is-picked'); } };
    for (const el of host.querySelectorAll('button.pj-heat-cell')) {
      el.addEventListener('pointerenter', () => show(el));
      el.addEventListener('focus', () => show(el));
      el.addEventListener('pointerleave', rest);
      el.addEventListener('click', () => {
        for (const on of host.querySelectorAll('.is-picked:not(.pj-heat-read)')) { on.classList.remove('is-picked'); on.removeAttribute('aria-pressed'); }
        picked = picked === el ? null : el;
        if (picked) { el.classList.add('is-picked'); el.setAttribute('aria-pressed', 'true'); rowName(el)?.classList.add('is-picked'); }
        rest();
      });
    }
  }
  function dailyData(rows) {
    return rows == null ? null : { labels: rows.map(r => ({ text: r.date?.slice(5), title: r.date?.slice(5) })), values: { visitors: rows.map(r => r.visitors ?? null), opens: rows.map(r => r.pageviews ?? null) }, quality: { visitors: rows.map(r => lower(r, 'visitors') ? 'partial' : 'ok'), opens: rows.map(r => lower(r, 'pageviews') ? 'partial' : 'ok') }, notes: { visitors: rows.map(r => r.visitors == null ? gap(r) || '没有日志' : lower(r, 'visitors') ? gap(r) : ''), opens: rows.map(r => r.pageviews == null ? gap(r) || '没有日志' : lower(r, 'pageviews') ? gap(r) : '') } };
  }
  const versionRange = w => w.versions?.length ? w.versions.length === 1 ? w.versions[0] : `${w.versions[0]}–${w.versions.at(-1)}` : '';
  function ruleData(history) {
    const weeks = history.weeks || [];
    return { labels: weeks.map(w => ({ text: w.week.slice(5), title: `${w.week.slice(5)}${versionRange(w) ? ` · ${versionRange(w)}` : ''}` })), values: { published: weeks.map(w => w.published ?? null), rollback: weeks.map(w => w.rolled_back ?? null) }, quality: { published: weeks.map(w => lower(w, 'published') ? 'partial' : 'ok'), rollback: weeks.map(w => lower(w, 'rolled_back') ? 'partial' : 'ok') }, notes: { published: weeks.map(gap), rollback: weeks.map(gap) } };
  }
  function chart(host, type, data) {
    const signature = JSON.stringify([type, data, !!U.offline?.()]); if (host.dataset.chart === signature) return; host.dataset.chart = signature;
    host.replaceChildren(); host.classList.toggle('pj-rule-single', type === 'rules' && data?.weeks?.length === 1);
    if (U.offline?.() && (!data || Array.isArray(data) && !data.length)) { host.innerHTML = `<p class="pj-note">${emptyText('')}</p>`; return; }
    if (type === 'daily') {
      window.LiveViz.bars(host, { title: '', unit: '次', axisUnit: '', missingText: '', series: [{ id: 'visitors', label: '来访', unit: '人', hue: 'teal' }, { id: 'opens', label: '打开', unit: '次', hue: 'violet' }] }).set(dailyData(data));
    } else if (type === 'top_pages') {
      const pages = { '/': '首页', '/live/': '实况', '/skills/': '技能', '/projects/': '项目', '/rules/': '规则' };
      window.LiveViz.rank(host, { show: Infinity, unit: '次', empty: '这段时间没有打开记录' }).set(data?.map(r => ({ key: r.page, name: r.title || r.name || pages[r.page] || r.page, value: r.opens, text: r.opens == null ? U.collectionText('打开次数', r) : lower(r, 'opens') ? `至少 ${r.opens} 次` : undefined, sub: lower(r, 'opens') ? gap(r) : r.note, hue: 'blue' })));
    } else if (type === 'rules') {
      if (!data) { host.innerHTML = `<p class="pj-note">${emptyText(U.collectionText('发布、退回', data))}</p>`; return; }
      const all = data.weeks || [], first = all.findIndex(w => finite(w.published) || finite(w.rolled_back));
      if (first < 0) { host.innerHTML = `<p class="pj-note">${emptyText(esc(U.collectionText('发布、退回', data)))}</p>`; return; }
      const weeks = all.slice(first), caption = `${data.first_version} → ${data.current_version}${data.observed_from ? ` · ${data.observed_from.slice(5, 10)} 起有记录` : ''}`;
      host.classList.toggle('pj-rule-single', weeks.length === 1);
      host.innerHTML = `<p class="pj-week-range pj-note">${esc(caption)}</p><div class="pj-week-scroll" tabindex="0" aria-label="规则每周发布，左右滑动查看"><div class="pj-week-bars"></div></div>`;
      if (weeks.length === 1) {
        const w = weeks[0], max = Math.max(w.published || 0, w.rolled_back || 0, 1);
        host.querySelector('.pj-week-range').textContent = caption;
        host.querySelector('.pj-week-scroll').outerHTML = `<div class="pj-single-bars">${[['published', '发布', '#2daec1'], ['rolled_back', '退回', '#cf5368']].map(([key, label, color]) => `<div><b>${finite(w[key]) ? `${lower(w, key) ? '至少 ' : ''}${w[key]}<small>次</small>` : `<span style="font-size:13px;font-weight:400;color:var(--muted)">${esc(U.collectionText(label, w))}</span>`}</b><span class="pj-single-track${!finite(w[key]) ? ' is-unknown' : ''}"><i style="height:${finite(w[key]) ? w[key] / max * 100 : 0}%;--bar-color:${color}"></i></span><span>${label}</span>${lower(w, key) && gap(w) ? `<small>${esc(gap(w))}</small>` : ''}</div>`).join('')}</div>`;
        return;
      }
      const inner = host.querySelector('.pj-week-bars'), scroll = host.querySelector('.pj-week-scroll'); inner.style.minWidth = `${Math.max(450, weeks.length * 48)}px`;
      window.LiveViz.bars(inner, { unit: '次', missingText: U.collectionText(), stack: false, series: [{ id: 'published', label: '发布', hue: 'teal' }, { id: 'rollback', label: '退回', hue: '#cf5368' }] }).set(ruleData({ ...data, weeks }));
      host.insertBefore(inner.querySelector('.chart__head'), scroll);
      const gaps = document.createElement('div'); gaps.className = 'pj-week-gaps'; gaps.setAttribute('aria-hidden', 'true');
      gaps.innerHTML = weeks.map((w, i) => !finite(w.published) || !finite(w.rolled_back) ? `<i style="left:${i / weeks.length * 100}%;width:${100 / weeks.length}%"></i>` : '').join(''); inner.querySelector('.vz-bars__plot').append(gaps);
      const range = () => {
        if (!weeks.length) return;
        const band = (inner.clientWidth - 46) / weeks.length, first = Math.max(0, Math.ceil(scroll.scrollLeft / band - .5)), last = Math.min(weeks.length - 1, Math.floor((scroll.scrollLeft + scroll.clientWidth - 46) / band - .5));
        inner.querySelector('.chart__axis').style.transform = `translateX(${scroll.scrollLeft}px)`;
        host.querySelector('.pj-week-range').textContent = caption + (scroll.scrollWidth > scroll.clientWidth ? ` · 当前 ${weeks[first].week.slice(5)} — ${weeks[last].week.slice(5)} · 左右滑动` : '');
      };
      scroll.addEventListener('scroll', range, { passive: true });
      requestAnimationFrame(() => { scroll.scrollLeft = 0; range(); });
    } else if (type === 'skills') {
      if (U.offline?.() && !data?.some(r => skillHosts.some(([key]) => finite(r[key])))) { host.innerHTML = `<p class="pj-note">${emptyText('')}</p>`; return; }
      for (const [period, label] of [['all', '累计'], ['7d', '近 7 天'], ['30d', '近 30 天']]) {
        const row = data?.find(r => r.period === period), el = document.createElement('div');
        el.innerHTML = `<p class="pj-skill-period">${label}</p><div></div>`; host.append(el);
        window.LiveViz.rank(el.lastElementChild, { show: 3, unit: '次', top: false }).set(skillHosts.map(([key, name, hue]) => ({ key, name, value: row?.[key] ?? null, text: row?.[key] == null ? U.collectionText('使用次数', row) : `${key === 'antigravity' || row?.[`${key}_q`] === 'partial' ? '至少 ' : ''}${row[key].toLocaleString('zh-CN', { maximumFractionDigits: Math.abs(row[key]) < 10 ? 2 : 1 })} 次`, sub: row?.[`${key}_note`], hue })));
      }
    }
  }
  function skillData(metrics) {
    if (!metrics.some(m => skills.includes(m.id))) return null;
    return ['total', 'd7', 'd30'].map((suffix, i) => ({ period: ['all', '7d', '30d'][i], ...Object.fromEntries(skillHosts.flatMap(([k]) => { const m = metrics.find(m => m.id === `${k}_${suffix}`); return [[k, m?.value ?? null], [`${k}_q`, lower(m, 'value') ? 'partial' : 'ok'], [`${k}_note`, lower(m, 'value') ? gap(m) : m?.note]]; })) }));
  }
  window.LiveProjectViz = { ago, summary, heatmap, bindHeat, chart, dailyData, skillData, skills, gap, lower, ruleData };
})();
