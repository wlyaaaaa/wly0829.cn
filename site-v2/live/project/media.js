(() => {
  'use strict';
  const ID = 'personal-media';
  if (new URLSearchParams(location.search).get('id') !== ID) return;
  const look = window.LiveProjectLook, loadLook = look.load, lookKey = look.key(ID);
  // Only this page uses the watercolor; the shared artwork registry still supplies the other views.
  look.load = () => loadLook().then(looks => ({
    ...looks, [lookKey]: { ...look.of(ID, looks), img: '/live/project/media-hero.webp' },
  }));
  const U = window.LiveUI, { esc } = U;
  const types = { image: '照片', video: '视频', audio: '录音和音乐' };
  const kinds = Object.keys(types);
  const narrow = matchMedia('(max-width: 620px)');
  const twoColumns = matchMedia('(min-width: 1101px)');
  const num = n => Number.isFinite(n) ? n.toLocaleString('zh-CN') : '—';
  const gb = (n, digits = 2) => Number.isFinite(n) ? `${n.toFixed(digits)} GB` : '—';
  const day = (at, year = false) => {
    if (!at || !Number.isFinite(Date.parse(at))) return '';
    const date = at.length === 10 ? at : new Date(Date.parse(at) + 8 * 3600000).toISOString().slice(0, 10);
    const [y, m, d] = date.split('-').map(Number);
    return `${year ? `${y}年` : ''}${m}月${d}日`;
  };
  const missing = '<p class="pj-note media-missing">暂时读不到</p>';
  const cutoff = m => {
    const at = m?.source_at || m?.at;
    if (!day(at)) return '';
    const old = U.isStale(m);
    return `<small class="media-cut">${m.value == null ? '上次' : ''}截止 ${day(at)} ${U.time(at)}${old ? ' · 旧了' : ''}</small>`;
  };
  const icon = name => `<svg class="media-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${{
    book: 'M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1v15',
    tag: 'M3 12 12 3h8v8l-9 10z M16 7h.01', phone: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m3 17h2',
    cloud: 'M6 18a4 4 0 1 1 0-8 6 6 0 0 1 11-2 5 5 0 0 1 1 10z', clock: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z M12 6v6l4 2',
    inbox: 'M3 12v7h18v-7M12 3v12m-4-4 4 4 4-4', grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    layers: 'm2 8 10-6 10 6-10 6z m0 5 10 6 10-6m-20 5 10 5 10-5',
    image: 'M3 4h18v16H3z m0 12 5-5 4 4 3-3 6 6 M16 8h.01', video: 'M2 5h14v14H2z m14 5 6-4v12l-6-4',
    audio: 'M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0z M6 11a6 6 0 0 0 12 0m-6 6v4m-3 0h6',
  }[name]}"/></svg>`;
  const inks = ['#008c43', '#00a650', '#80d58c', '#9ce6cc', '#dddf73', '#f7cf52', '#d4eac9'];
  const links = [['layers', '备份', '本机、G 盘、H 盘各存了多少，照片云和 Drive 传到哪。', '/live/backup/'],
    ['phone', '手机', '手机还剩多少空间、照片备份到哪天。', '/live/phone/']];
  let yearPage = 0, recentPage = 0, selectedDay, refresh;

  function adapt(d) {
    const metrics = Object.fromEntries((d.sections || []).flatMap(s => (s.metrics || []).map(m => [m.id, m])));
    const total = metrics.total && { ...metrics.total, note: null, cadence: null };
    return { ...d, media: { ...metrics, ...d.media }, sections: [{ id: 'keepers', metrics: [total].filter(Boolean) }] };
  }
  const nav = (key, ago, back) => `<nav class="media-nav" aria-label="${key === 'year' ? '年份' : '收录日期'}翻页">${ago ? `<button class="more" type="button" data-media-page="${key}:1">‹ 更早</button>` : ''}${back ? `<button class="more" type="button" data-media-page="${key}:-1">较新 ›</button>` : ''}</nav>`;

  function archive(m) {
    const y = m.yearly?.value, typesRead = m.types?.value, capacity = m.capacity?.value;
    const width = narrow.matches ? 5 : 10;
    const knownYears = Object.keys(y?.years || {}).map(Number);
    const newest = Math.max(new Date(Date.now() + 8 * 3600000).getUTCFullYear(), ...knownYears), oldest = Math.min(newest, ...knownYears);
    yearPage = Math.min(yearPage, Math.floor((newest - oldest) / width));
    const end = newest - yearPage * width, start = end - width + 1;
    const years = Array.from({ length: width }, (_, i) => start + i);
    const cells = [...years.map(year => y?.years?.[year] || {}), y?.undated || {}];
    const all = cell => kinds.reduce((sum, type) => sum + (cell[type] || 0), 0);
    const peak = Math.max(1, ...Object.values(y?.years || {}).map(all));
    const counts = [typesRead?.image, typesRead?.video, m.audio_total?.value, m.total?.value];
    const sizes = [gb(m.image_gb?.value, 1), gb(capacity?.video_gb, 1), gb(m.audio_gb?.value, 1), gb(capacity?.gb)];
    const audio = typesRead ? [`录音 ${num(typesRead.recordings)}`, `音乐铃声 ${num(typesRead.music)}`] : [];
    const subtitles = [[], [], audio, m.days?.value == null ? [] : [`有东西的日子 ${num(m.days.value)} 天`]];
    const segments = parts => parts.filter(Boolean).map((text, i) => `<span class="media-compact">${i ? '· ' : ''}${text}</span>`).join(' ');
    const rows = [...kinds, 'layers'].map((kind, row) => {
      const label = types[kind] || '合计';
      const cellsHtml = cells.map((cell, i) => {
        const n = row === 3 ? all(cell) : cell[kind] || 0;
        const heat = n ? 7 + 69 * Math.sqrt(n / peak) : 0;
        return `<td${i === width ? ' class="media-undated"' : ` style="--heat:${heat}%"`}${n >= 1000 ? ' data-wide-count' : ''}>${y ? num(n) : '—'}</td>`;
      }).join('');
      return `<tr><th scope="row"><div class="media-type">${icon(kind)}<span>${label}</span> <strong>${num(counts[row])} <small>${['张', '个', '段', '件'][row]}</small></strong></div><div class="media-type-sub">${segments([sizes[row], ...subtitles[row]])}</div></th>${cellsHtml}</tr>`;
    }).join('');
    const gaps = [m.undated?.value != null && `没日期 ${num(m.undated.value)} 件`, m.undescribed?.value != null && `没写说明 ${num(m.undescribed.value)} 件`].filter(Boolean);
    const range = segments([day(m.earliest?.value, true) && `最早一件 ${day(m.earliest.value, true)}`, day(m.latest?.value, true) && `最新一件 ${day(m.latest.value, true)}`]);
    const extra = ['audio_locatable', 'phone_actual', 'cloud_actual'].map(key => m[key]).filter(Boolean).map(item => `${esc(item.label)} · ${esc(item.value == null ? item.unknown_text || item.scope || '暂时读不到' : num(item.value))}`).join('<br>');
    return `<table class="media-years"><colgroup><col class="media-type-col"><col span="${width + 1}"></colgroup><thead><tr><td></td>${years.map(year => `<th scope="col">${year}</th>`).join('')}<th scope="col" class="media-undated">没日期</th></tr></thead><tbody>${rows}</tbody></table>
      ${!y || !typesRead || !capacity ? missing : ''}${gaps.length ? `<p class="media-gaps">还缺：${gaps.join(' · ')}</p>` : ''}
      <div class="media-foot media-archive-foot"><div>${extra ? `<details class="media-pop"><summary class="more">说明 <span class="more__chev">›</span></summary><div>${extra}</div></details>` : ''}<span>${range}</span></div>${nav('year', y && start > oldest, yearPage > 0)}${cutoff(m.yearly?.at ? m.yearly : m.total)}</div>`;
  }

  const bar = (items, total) => `<div class="media-bar" aria-hidden="true">${items.map(([value, ink]) => `<i style="width:${total ? value / total * 100 : 0}%;--segment:${ink}"></i>`).join('')}</div>`;
  function categories(m, viewer) {
    const values = m.categories?.value, legacy = m.legacy_counts?.value;
    if (!values) return missing + cutoff(m.categories);
    const old = legacy ? `音频 ${num(legacy.audio)} · 录音 ${num(legacy.recordings)} · 视频 ${num(legacy.video)}` : '';
    const privateCount = m.private_category;
    const ranked = [...Object.entries(values).filter(([, n]) => Number.isFinite(n)), ['精选', m.featured?.value], ['旧标签', m.other?.value], ['private_category', privateCount?.value]]
      .filter(([, n]) => Number.isFinite(n)).sort((a, b) => b[1] - a[1]);
    const total = ranked.reduce((sum, [, n]) => sum + n, 0);
    const row = ([name, n], i) => {
      const privateRow = name === 'private_category', unit = privateRow && privateCount.unit;
      const label = esc(privateRow ? privateCount.display_label : name);
      const tag = privateRow && privateCount.rewrite === 'rewritten' ? U.visitorRewrittenTag('这一类的名称', '', viewer).replace('对外换了说法</', '换了说法</') : '';
      return `<li><span><i style="--segment:${inks[i % inks.length]}"></i>${label}</span><b>${num(n)}${unit ? ` ${esc(unit)}` : ''}</b>${tag}${name === '旧标签' && old ? `<small>（${old}）</small>` : ''}</li>`;
    };
    const counts = ranked.slice(0, 7).map(([, n], i) => [n, inks[i]]);
    if (ranked.length > 7) counts.push([total - counts.reduce((sum, [n]) => sum + n, 0), inks.at(-1)]);
    const shown = ranked.slice(0, 7).map(row);
    return `<div class="media-bar-line">${bar(counts, total)}<b>${total ? 100 : 0}%</b></div>
      <div class="media-categories"><ul class="media-cat-list">${shown.slice(0, 3).join('')}</ul><ul class="media-cat-list">${shown.slice(3).join('')}</ul></div>
      <div class="media-foot"><details class="media-pop"><summary class="more">全部 ${num(ranked.length)} 类 <span class="more__chev">›</span></summary><div><ul class="media-cat-list">${ranked.map(row).join('')}</ul></div></details>${cutoff(m.categories)}</div>`;
  }

  function copies(m) {
    const phone = m.phone?.value, p = m.phone_types?.value, cloud = m.google_photos?.value;
    const amount = (n, size) => `<strong>${num(n)} 件 · ${gb(size)}</strong>`;
    const percent = value => phone ? (100 * value / phone).toFixed(1) : '0.0';
    const phoneTypes = p && kinds.slice(0, 2).map(type => `${types[type]} ${num(p[type])}`).join(' · ');
    return `<div class="media-copy"><b>带在手机上</b>${phone == null ? missing : amount(phone, m.phone_gb?.value)}
      ${p ? `<span>电脑选好放手机的：${phoneTypes}</span>${bar([[p.image, inks[1]], [p.video, inks[3]]], phone)}<div class="media-copy-key">${kinds.slice(0, 2).map((type, i) => `<span><i style="--segment:${inks[i ? 3 : 1]}"></i>${types[type]} ${num(p[type])} 件（${percent(p[type])}%）</span>`).join('')}</div>` : ''}${cutoff(m.phone)}</div>
      <div class="media-copy"><b>${icon('cloud')} Google 相册</b>${cloud ? `${amount(cloud.count, cloud.bytes / 2 ** 30)}<span>传到 Google 相册的照片和视频</span>` : missing}${cutoff(m.google_photos)}</div>`;
  }

  function recent(m, d) {
    const rows = m.recent_days?.value;
    const days = Array.isArray(rows) ? rows : [];
    const perPage = twoColumns.matches ? 7 : 5;
    recentPage = Math.min(recentPage, Math.max(0, Math.ceil(days.length / perPage) - 1));
    const start = recentPage * perPage, list = days.slice(start, start + perPage);
    if (selectedDay !== '' && !list.some(x => x.date === selectedDay)) selectedDay = list[0]?.date;
    const html = list.map(x => {
      const groups = kinds.filter(type => Number.isFinite(x.types?.[type]?.count) && x.types[type].count > 0);
      const summary = groups.map(type => `<span class="media-compact">${types[type]} ${num(x.types[type].count)}</span>`).join(' · ');
      return `<details name="media-day" data-day="${esc(x.date)}"${x.date === selectedDay ? ' open' : ''}><summary class="live-disclosure"><b>${day(x.date)}</b>${summary ? `<span>${summary}</span>` : ''}</summary><ul class="media-day-types">${groups.map(type => {
        const row = x.types[type], id = `media-${x.date}-${type}`;
        const action = row.open ? U.actions({ id }, [{ kind: 'open', label: row.open.label, href: row.open }]) : '';
        return `<li><span>${types[type]} ${num(row.count)} 件${row.at ? ` · 最后一件 ${U.time(row.at)}` : ''}</span>${action}</li>`;
      }).join('')}</ul></details>`;
    }).join('');
    const count = d.artifacts?.count;
    return `<div class="media-recent-list">${html || missing}</div><div class="media-foot">${nav('recent', days.length > start + perPage, recentPage > 0)}${count != null ? `<a class="more" href="#artifacts">全部 ${num(count)} 份 ›</a>` : ''}${cutoff(m.recent_days)}</div>`;
  }

  function board(d, viewer, graphBlock, element) {
    element.classList.add('pj-board--media');
    const m = d.media;
    const fixture = new URLSearchParams(location.search).get('fixture');
    const route = href => fixture == null ? href : `${href}?fixture=${encodeURIComponent(fixture)}`;
    const cards = [
      ['media-archive', '档案馆：每年留下了什么', 'book', () => archive(m)],
      ['media-content', '按内容分', 'tag', () => categories(m, viewer)],
      ['media-copies', '手机和 Google 相册', 'phone', () => copies(m)],
      ['media-recent', '最近收进来的', 'inbox', () => recent(m, d)],
      ['media-live', '去实况里看', 'grid', () => links.map(([symbol, title, text, href]) => `<a class="media-link" href="${route(href)}">${icon(symbol)}<b>${title}</b><span>${text}</span><span class="more__chev">›</span></a>`).join('')],
      ['media-changes-empty', '最近改动', 'clock', () => missing],
    ];
    const blocks = cards.map(([id, title, symbol, render]) => {
      const b = graphBlock(id, title); b.group = id;
      if (!b.head.querySelector('.media-icon')) b.head.querySelector('b').insertAdjacentHTML('afterbegin', icon(symbol));
      U.html(b.viz, render(), false);
      return b;
    });
    refresh = key => {
      const index = key === 'year' ? 0 : 3;
      U.html(blocks[index].viz, cards[index][3](), false);
    };
    return blocks;
  }
  narrow.addEventListener('change', () => { yearPage = 0; refresh?.('year'); });
  twoColumns.addEventListener('change', () => { recentPage = 0; selectedDay = undefined; refresh?.('recent'); });
  document.addEventListener('click', e => {
    const button = e.target.closest('[data-media-page]');
    const open = e.target.closest('.media-recent-list summary')?.parentElement;
    if (open) selectedDay = open.open ? '' : open.dataset.day;
    if (!button) return;
    const navigation = button.parentElement, [key, delta] = button.dataset.mediaPage.split(':');
    if (key === 'year') yearPage += Number(delta); else { recentPage += Number(delta); selectedDay = undefined; }
    refresh?.(key);
    navigation.querySelector('button')?.focus();
  });
  window.ProjectPages = Object.assign(window.ProjectPages || {}, { [ID]: { adapt, board } });
})();
