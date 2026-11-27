(() => {
  'use strict';
  const V = window.LiveViz, C = window.LiveChart, U = window.LiveUI, S = window.LiveStat;
  const sync = C.sync(), board = V.board(document.getElementById('board'), { key: 'smooth', sync, quiet: true });
  const hero = document.getElementById('hero'), part = name => hero.querySelector(`[data-part="${name}"]`);
  const line = (id, label, hue) => ({ id, label, hue });
  const chips = [
    { key: 'fps', label: '帧率', unit: 'FPS', lines: [line('current', '帧率', '#02b8d4'), line('average', '平均帧率', '#00A650'), line('low', '最低 1%', '#ee941e')] },
    { key: 'frametime', label: '单帧耗时', unit: 'ms', lines: [line('frametime', '单帧耗时', '#258ff4')] },
    { key: 'jitter', label: '帧时抖动', unit: 'ms', lines: [line('jitter', '帧时抖动', '#8a37ef')] },
  ];
  const frameIds = new Set(chips.flatMap(chip => chip.lines.map(l => l.id)));
  const picture = '/live/img/head-smooth.webp', appPicture = '/live/img/head-apps.webp';
  const finite = Number.isFinite, measured = s => s?.points?.some(([, v]) => finite(v));
  const seconds = at => typeof at === 'number' ? at : Date.parse(at) / 1000;
  const iso = at => new Date(at * 1000).toISOString();
  const cutoff = at => {
    if (!finite(seconds(at))) return '';
    const stamp = iso(seconds(at));
    return `${U.date(stamp) === U.date(Date.now()) ? '' : `${U.date(stamp)} `}${U.time(stamp)}`;
  };
  const windowText = w => cutoff(w?.from) && cutoff(w?.to) ? `北京时间 ${U.date(w.from)} ${U.time(w.from)} 至 ${U.date(w.to)} ${U.time(w.to)}` : '';
  const join = (...parts) => parts.filter(Boolean).join(' · ');
  const keepTerms = html => html.replace(/打游戏|最慢一帧|没响应|\d+(?:\.\d+)?[ \t]*毫秒/g, '<span class="smooth-term">$&</span>');
  const hours = total => total < 60 ? `${Math.floor(total)} 秒` :
    [total >= 3600 && `${Math.floor(total / 3600)} 小时`, `${Math.floor(total / 60) % 60} 分`].filter(Boolean).join(' ');
  const wallpaper = /^(?:wallpaper(?:32|64|ui|engine)?|webwallpaper32|ui32)(?:\.exe)?$/i;
  const frameSource = name => wallpaper.test(name || '') ? '动态壁纸' : U.programName(name);
  const program = name => wallpaper.test(name || '') ? '动态壁纸（Wallpaper Engine）' : U.programName(name);
  const modeName = label => U.sp(label).replace(/全屏\s*[/／]\s*无边框全屏|无边框全屏|全屏/g, '最大化窗口').replace(/普通窗口形态/g, '普通窗口');
  const block = name => data?.blocks?.[name] || data?.[name];
  const CLOSE_AFTER = 30 * 60, GAME_FRESH_FOR = 15;
  const PAGE_REFRESH_MINUTES = 5; // computer/smooth 外层调度为 300 秒，data.refresh_seconds 是数据源的采样批次。
  let data = null, framePack = {}, hardwareStatus = null;

  const method = () => data?.stutters?.method || {};
  const classifiedWindow = () => data?.stutters?.classified_window;
  function readingLine(key, available, prefix = '', empty = '') {
    const b = block(key), end = b?.window?.to || b?.to || b?.at;
    const flag = b?.read_error || ['stale', 'unavailable'].includes(b?.state) || b?.q === 'stale';
    const last = cutoff(b?.recorded_at || b?.source_at || (available ? end : null));
    if (last && (flag || !available || seconds(window.Live.clock()) - seconds(end) >= CLOSE_AFTER)) return `这块最后记录于 ${last}`;
    return available ? join(prefix, cutoff(end) && `截至 ${cutoff(end)}`) : empty;
  }

  function gameStatus() {
    if (U.offline?.()) return {};
    const smooth = data?.game_status, pack = hardwareStatus || smooth || {};
    const histories = [smooth?.history, pack.history].filter(h => finite(seconds(h?.at)));
    const history = histories.sort((a, b) => seconds(b.at) - seconds(a.at))[0] || smooth?.history || pack.history;
    const now = seconds(window.Live.clock());
    const fresh = row => row && Math.abs(now - seconds(row.at)) < GAME_FRESH_FOR;
    return { ...pack, history, foreground: fresh(pack.foreground) ? pack.foreground : null,
      frame: fresh(pack.frame) ? pack.frame : null };
  }
  const history = () => gameStatus().history;
  const playedTitle = h => h?.game_name ? `《${U.sp(h.game_name)}》` : '';
  const sessionLength = row => {
    const duration = seconds(row?.end) - seconds(row?.start);
    return finite(duration) && duration >= 0 ? hours(duration) : '';
  };
  function gameHistory(h) {
    if (h?.played !== true) return '';
    const latest = h.latest_session, title = playedTitle(latest);
    const since = seconds(classifiedWindow()?.from);
    const duration = (!finite(since) || seconds(latest?.start) >= since) && sessionLength(latest);
    return duration ? `近 24 小时玩了 ${duration}${title}` : `近 24 小时玩过${title || '游戏'}`;
  }
  function renderHero() {
    if (!data) return;
    const status = gameStatus(), fg = status.foreground, h = status.history;
    const summary = data.summary, counts = eventCounts(summary);
    const observed = Object.values(counts).filter(finite).reduce((sum, value) => sum + value, 0);
    const exact = summary?.game_complete === true && summary?.hang_complete === true && Object.values(counts).every(finite);
    const playing = fg?.classification === 'game' && fg.active === true;
    const unknown = fg?.classification === 'unknown', name = U.sp(playedTitle(fg) || program(fg?.process_name));
    const stopped = finite(counts.hang) ? `程序卡住 ${counts.hang} 次` : '';
    const played = gameHistory(h), complete = h?.complete === true, noGame = h?.played === false;
    const game = finite(counts.game) && (counts.game > 0 || summary?.game_complete === true && !noGame && !unknown) ?
      `游戏画面卡 ${counts.game} 次` : '';
    const currentFPS = playing && status.frame && finite(status.game_fps) && status.game_fps > 0;
    const scope = U.offline?.() || !data.game_status && !hardwareStatus ? '' : !fg ? '现在在不在打游戏没读到' : playing
      ? `正在玩${name || '游戏'} · ${currentFPS ? `现在 ${Math.round(status.game_fps)} 帧` : '帧率这会儿没读到'}`
      : unknown ? `${name ? `现在前台是 ${name}，` : ''}认不出是不是游戏` : played ? '现在没在打游戏' : noGame ? '近 24 小时没打游戏' : '近 24 小时打没打游戏没记全';
    let detail = [played, game, stopped].filter(Boolean).join('，');
    if (!playing && unknown) detail = join(detail, '认不出是游戏的程序，不量游戏画面卡');
    else if (!playing && noGame) detail = join(detail, `${fg ? '没打游戏' : '近 24 小时没打游戏'}，不量游戏画面卡`);
    detail = join(detail, summary?.game_complete === false && '游戏画面卡可能少算',
      summary?.hang_complete === false && '程序卡住可能少算');
    const pronoun = U.you(window.Live.viewerKind());
    const warnings = [];
    if (!fg && (data.game_status || hardwareStatus) && !U.offline?.()) warnings.push(`电脑记录工具这会儿没报上前台是哪个程序，所以不知道${pronoun}现在在不在玩`);
    if (playing && !currentFPS) warnings.push('没读到帧率的这段时间量不了游戏画面卡，卡了几次可能少算');
    if (h?.at && !complete && !U.offline?.()) warnings.push('前台程序的记录中间断了一段，那段时间玩没玩游戏、画面卡没卡不知道');
    const end = cutoff(classifiedWindow()?.to);
    const footer = join(end && `数据截至 ${end}`, `每 ${PAGE_REFRESH_MINUTES} 分钟自动更新`);
    const head = exact || observed > 0 ? `近 24 小时${exact ? '' : '至少'}卡了 ${observed} 次` : '卡顿和帧率';
    const lamp = part('head').querySelector('.lamp')?.outerHTML || '';
    const heading = keepTerms(U.head(join(head, scope), { lamp: false }));
    U.html(part('head'), `${lamp}<span class="smooth-headline">${heading}</span><span class="head__cutoff">${U.esc(footer)}</span>`);
    part('count').hidden = !detail;
    U.html(part('count'), detail && `<b>${keepTerms(U.nowrap(detail))}</b>`);
    part('note').hidden = !warnings.length;
    U.html(part('note'), warnings.map(text => `<span>${U.esc(text)}</span>`).join(''));
  }

  function eventCounts(summary) {
    return { game: summary?.game_events, hang: summary?.program_hangs };
  }
  const eventKinds = [
    { id: 'game', label: '游戏画面卡', hue: 'pink', color: '#e2639f' },
    { id: 'hang', label: '程序卡住', hue: '#f49839', color: '#f49839' },
  ];
  function eventTitle(e) {
    if (e.kind === 'hang') {
      const duration = seconds(e.last_observed) - e.start;
      return `${program(e.process_name) || '程序'} 卡住${finite(duration) && duration > 0 ? ` ${+duration.toFixed(1)} 秒` : ''}`;
    }
    const severe = method().severe_min_ms;
    const grade = finite(severe) && e.max_frame_ms >= severe ? '画面严重卡' : '画面卡';
    return join(grade, finite(e.max_frame_ms) && `最慢一帧 ${Math.round(e.max_frame_ms)} 毫秒`);
  }
  function stutterChapter(el) {
    el.innerHTML = keepTerms('<div class="stutter-layout"><div data-x="moments"></div><div data-x="graphs"><div data-x="band"><p class="grp-split__k">卡顿发生在哪一段</p><div data-x="timeline"></div><ul class="smooth-legend"></ul></div><div data-x="daily"></div></div><footer class="stat-gap">接着的几次卡算一次 · 没打游戏时不量画面卡</footer></div>');
    const layout = el.firstElementChild;
    const host = which => el.querySelector(`[data-x="${which}"]`);
    const listHost = host('moments'), timelineHost = host('timeline'), dailyHost = host('daily'), legends = el.querySelector('.smooth-legend');
    const tl = V.timeline(timelineHost, { rows: [{ key: 'day', label: '卡顿' }], interactiveObservedOnly: true });
    const plot = timelineHost.querySelector('.vz-tl__plot');
    let list = [], picked = null;
    function mark() {
      plot.querySelectorAll('[data-event]').forEach(marker => { marker.style.opacity = picked == null || marker.dataset.event === picked ? '1' : '.45'; });
      const hit = list.find(e => e.key === picked);
      sync.mark(hit?.start ?? null, hit ? eventTitle(hit) : '');
    }
    const batch = 5;
    let limit = 2 * batch;
    const moments = V.moments(listHost, { show: batch, empty: '近 24 小时没有卡顿',
      more: () => `更早的 ${list.length - batch} 条`, onPick(key) { picked = key; mark(); } });
    const toggle = listHost.querySelector('.more'), more = document.createElement('button');
    more.className = 'more smooth-more-moments'; more.type = 'button';
    listHost.querySelector('.fold > div').append(more);
    function paintMoments() {
      moments.set(list.slice(0, limit).map(e => ({ key: e.key, day: U.date(iso(e.start)),
        time: U.time(iso(e.start)), title: eventTitle(e), hue: eventKinds.find(k => k.id === e.kind).hue })));
      listHost.querySelectorAll('.vz-moment__text b').forEach(b => {
        if (b.textContent.includes('最慢一帧') && !b.firstElementChild) U.html(b, keepTerms(U.esc(b.textContent)), false);
      });
      more.hidden = limit >= list.length;
      if (!more.hidden) more.textContent = `再展开 ${Math.min(batch, list.length - limit)} 条`;
      if (toggle.getAttribute('aria-expanded') === 'true' && !toggle.hidden) toggle.textContent = '收起明细';
    }
    toggle.addEventListener('click', () => {
      if (toggle.getAttribute('aria-expanded') === 'false') limit = 2 * batch;
      paintMoments();
    });
    more.addEventListener('click', () => { limit += batch; paintMoments(); });
    const daily = V.bars(dailyHost, { title: '近 7 天每天卡了几次', unit: '次', stack: true, series: eventKinds });
    return { set() {
      const st = data?.stutters, bounds = classifiedWindow();
      const counts = eventCounts(data?.summary), days = (st?.classified_daily || []).slice(-7);
      const hasDays = days.some(d => Object.values(eventCounts(d)).some(finite));
      const from = seconds(bounds?.from), to = seconds(bounds?.to);
      list = (st?.classified_events || []).map((e, i) => ({ ...e, start: seconds(e.start),
        key: e.id == null ? JSON.stringify([e.kind, e.start, e.process_name, i]) : String(e.id) }))
        .filter(e => eventKinds.some(k => k.id === e.kind) && finite(e.start))
        .sort((a, b) => b.start - a.start);
      const seen = list.length > 0 || Array.isArray(st?.classified_events) &&
        data?.summary?.game_complete === true && data.summary.hang_complete === true;
      const band = seen && to > from;
      if (picked && !list.some(e => e.key === picked)) picked = null;
      paintMoments();
      listHost.hidden = !seen;
      layout.toggleAttribute('data-short', list.length > 0 && list.length <= 2 && (band || hasDays));
      host('graphs').hidden = !band && !hasDays;
      host('band').hidden = !band;
      el.querySelector('footer').hidden = !seen;
      tl.set(band ? { states: [{ id: 'clear', label: '卡顿', hue: 'stone' }], rows: { day: { ...bounds, spans: [[from, null]] } } } : null);
      plot.querySelectorAll('[data-event]').forEach(marker => marker.remove());
      if (band) for (const e of list.filter(e => e.start >= from && e.start < to)) {
        const marker = document.createElement('i'); marker.dataset.event = e.key;
        marker.style.cssText = `position:absolute;inset:0 auto 0 ${(e.start - from) / (to - from) * 100}%;width:3px;background:${eventKinds.find(k => k.id === e.kind).color};border-radius:3px;pointer-events:none`;
        plot.append(marker);
      }
      const noGame = history()?.played === false;
      U.html(legends, eventKinds.map(({ id, label, color }) => {
        const value = counts[id], absent = id === 'game' && noGame;
        return !absent && !finite(value) ? '' : `<li style="--swatch:${absent ? '#aaa9a5' : color}">${label}${absent ? '：没打游戏' : ` ${value} 次`}</li>`;
      }).join(''));
      dailyHost.hidden = !hasDays;
      if (hasDays) daily.set({ labels: days.map(d => ({ text: d.day.slice(5), title: d.day })),
        values: Object.fromEntries(eventKinds.map(({ id }) => [id, days.map(d => eventCounts(d)[id])])),
        quality: Object.fromEntries(eventKinds.map(({ id }) => [id, days.map(d => d[`${id}_complete`] === false ? 'partial' : '')])) });
      mark();
    } };
  }

  function alignForeground(pack, frame) {
    const day = pack?.rows?.day, from = seconds(frame.from), to = seconds(frame.to);
    if (!day?.spans?.length || !(to > from)) return pack;
    const dayEnd = seconds(day.to);
    const spans = dayEnd < to ? [...day.spans.filter(([t]) => t < dayEnd), [dayEnd, null]] : day.spans;
    return { ...pack, rows: { day: { ...day, label: '前台程序', from: frame.from, to: frame.to, spans } } };
  }
  function frameLabelRail(plot) {
    const rail = document.createElement('div'); rail.className = 'smooth-frame-sources'; plot.before(rail);
    rail.innerHTML = '<div></div><span class="smooth-frame-point" hidden></span>';
    const stack = rail.firstElementChild, point = rail.lastElementChild;
    let sources = [], labels = [];
    const label = ({ name, fps }) => join(name, finite(fps) && `${Math.round(fps)} 帧`);
    sync.add({ mark() {}, point(at) {
      const source = at == null ? null : sources.find(s => s.start <= at && at < s.end);
      point.hidden = !source;
      if (source) U.html(point, U.nowrap(label(source)), false);
    } });
    function draw() {
      const width = rail.clientWidth, from = seconds(framePack.from), span = seconds(framePack.to) - from;
      const rows = [[], []];
      if (width && span > 0) for (const source of labels) {
        const a = Math.round((source.start - from) / span * width), b = Math.round((source.end - from) / span * width);
        const size = Math.min(width, Math.max(source.game ? 135 : 100, Math.min(b - a, 150)));
        const left = Math.max(0, Math.min(width - size, Math.round((a + b - size) / 2)));
        const row = rows.find(items => items.every(item => left >= item.left + item.size || left + size <= item.left));
        row?.push({ left, size, source });
      }
      U.html(stack, rows.filter(row => row.length).map(row => {
        let right = 0;
        return `<div>${row.sort((a, b) => a.left - b.left).map(({ left, size, source }) => {
          const margin = left - right;
          right = left + size;
          return `<span${source.game ? ' data-game' : ''} style="margin-left:${margin}px;width:${size}px">${U.nowrap(label(source))}</span>`;
        }).join('')}</div>`;
      }).join(''), false);
    }
    new ResizeObserver(draw).observe(plot);
    return active => {
      const fps = data?.fps, from = seconds(framePack.from), to = seconds(framePack.to);
      const raw = fps?.sources?.length ? fps.sources : active ? [{ start: from, end: to }] : [];
      const after = seconds(fps?.sources_window?.from), until = seconds(fps?.sources_window?.to);
      const { foreground: fg, history: h } = gameStatus();
      const currentGame = fg?.classification === 'game' && fg.game_name && fg.process_name;
      const gameNames = [h?.latest_session?.game_name, h?.previous_session?.game_name].filter(Boolean);
      sources = raw.flatMap(s => {
        const start = Math.max(from, finite(after) ? after : from, seconds(s.start));
        const end = Math.min(to, finite(until) ? until : to, seconds(s.end));
        if (!(end > start)) return [];
        const process = U.sp(frameSource(s.process_name));
        const gameName = currentGame && s.process_name?.toLowerCase() === fg.process_name.toLowerCase() ?
          fg.game_name : gameNames.find(name => U.sp(name) === process);
        const name = playedTitle({ game_name: gameName }) || process || '帧源未记录';
        return [{ start, end, name, game: Boolean(gameName), fps: s.fps }];
      }).sort((a, b) => a.start - b.start);
      labels = [];
      for (const source of sources) {
        const prev = labels.at(-1);
        if (prev?.name === source.name && source.start - prev.end <= 60) {
          prev.end = Math.max(prev.end, source.end);
          if (Math.round(prev.fps) !== Math.round(source.fps)) prev.fps = null;
        } else labels.push({ ...source });
      }
      labels.sort((a, b) => Number(Boolean(b.game)) - Number(Boolean(a.game)) || (b.end - b.start) - (a.end - a.start));
      point.hidden = true;
      draw();
    };
  }
  function foregroundChapter(el) {
    el.innerHTML = '<div class="frame-sync"><p class="grp-split__k">前台程序同步带 · 这会儿在看哪个窗口</p><div></div></div><p class="smooth-frame-notes">帧率按每两张画面的间隔算，每分钟取平均；平均帧率是实际画了几张除以秒数，两条差得多说明忽快忽慢<br>最低 1% 是最慢那 1% 画面的帧率；单帧耗时是每分钟最慢的一张画了多久；抖动是相邻两张差了多久</p>';
    const wrap = el.querySelector('.frame-sync'), host = wrap.lastElementChild, card = el.closest('.grp');
    const tl = V.timeline(host, { rows: [{ key: 'day', label: '前台程序' }] });
    const plot = host.querySelector('.vz-tl__plot'), cursor = document.createElement('i');
    cursor.className = 'smooth-sync-cursor'; cursor.hidden = true; plot.append(cursor);
    let from, to, drawLabels;
    sync.add({ mark() {}, point(at) {
      cursor.hidden = at == null || !(to > from && at >= from && at <= to);
      if (!cursor.hidden) cursor.style.left = `${(at - from) / (to - from) * 100}%`;
    } });
    U.pointing(plot, event => {
      const box = plot.getBoundingClientRect();
      if (box.width && to > from) sync.at(from + (event.clientX - box.left) / box.width * (to - from));
    }, () => sync.at(null));
    return { set(g) {
      const measuredSeries = framePack.series?.filter(measured) || [];
      const pack = data?.foreground;
      const hues = new Set(pack?.states?.map(s => s.hue));
      const states = pack?.states?.map((s, i) => ({ ...s,
        label: program(U.fieldText(s.display_label ?? s.label)) || s.label,
        hue: hues.size > 1 && s.hue || ['blue', 'pink', 'violet', 'apricot', 'teal'][i % 5],
      }));
      wrap.hidden = !pack?.rows?.day?.spans?.length;
      const aligned = alignForeground({ ...pack, states }, framePack);
      from = seconds(aligned.rows?.day?.from); to = seconds(aligned.rows?.day?.to);
      if (!wrap.hidden) tl.set(aligned);
      card.classList.toggle('fps-empty', Boolean(data) && !measuredSeries.length);
      card.classList.toggle('fps-single', g.chips.length <= 1);
      el.hidden = wrap.hidden && !measuredSeries.length;
      const chart = card.querySelector('.grp__hero');
      const active = measuredSeries.find(s => s.id === chart.querySelector('[data-line]')?.dataset.line) || measuredSeries[0];
      const mainPlot = chart.querySelector('.chart__plot');
      if (mainPlot) { drawLabels ??= frameLabelRail(mainPlot); drawLabels(active); }
      renderFpsContext(card.querySelector('.grp__say'));
    } };
  }

  const metrics = (row, fields) => fields.filter(([k]) => finite(row[k])).map(([k, label, unit]) => `${label} ${V.fmt(row[k], unit)}`).join(' · ');
  function addAppPicture(el) {
    const card = el.closest('.grp'), glass = card.querySelector('.card__glass');
    card.dataset.pic = 'right';
    // 插画在靠近视口时和原来的画卡一起载入，首屏无需为下面两块先取图。
    glass.insertAdjacentHTML('beforebegin', `<img class="card__tint" src="${appPicture}" alt="" loading="lazy" aria-hidden="true">`);
    glass.insertAdjacentHTML('afterbegin', `<span class="card__pic" aria-hidden="true"><img src="${appPicture}" alt="" loading="lazy"></span>`);
  }
  function appsChapter(el) {
    addAppPicture(el);
    el.innerHTML = '<div class="grp-split"><section><p class="grp-split__k">最大化窗口和普通窗口的差别</p><div data-x="modes"></div><p class="stat-gap"></p></section><section><p class="grp-split__k">各程序的流畅度 · 帧算在真正画它的程序头上</p><div data-x="apps"></div><p class="stat-gap"></p></section></div>';
    const modesHost = el.querySelector('[data-x="modes"]'), appsHost = el.querySelector('[data-x="apps"]');
    const modes = V.rank(modesHost, { show: Infinity, mark: true }), apps = V.rank(appsHost, { show: Infinity, mark: true });
    const fields = [['fps', '平均帧率', 'FPS'], ['low', '低谷帧率', 'FPS'], ['stutter_pct', '卡顿帧占比', '%']];
    function row(r, key, label, hue, readings) {
      const named = U.sp(label), icon = /^([\p{Extended_Pictographic}\p{Regional_Indicator}]\uFE0F?)\s+/u.exec(named);
      return S.row({ key, name: icon ? named.slice(icon[0].length) : named, mark: icon?.[1], sub: readings, value: r.seconds, text: finite(r.seconds) ? V.fmt(r.seconds, '秒') : '', hue }, r, 'seconds');
    }
    return { set() {
      const shapes = data?.modes, sources = data?.fps?.apps;
      modesHost.parentElement.hidden = !shapes?.length;
      modes.set(shapes?.map((r, i) => row(r, `mode:${i}`, modeName(r.mode), 'violet', metrics(r, [...fields, ['severe_pct', '严重卡顿帧占比', '%']]))) ?? null);
      modesHost.nextElementSibling.textContent = shapes?.length ? readingLine('modes', true) : '';
      const hasFrames = framePack.series?.some(measured);
      appsHost.parentElement.hidden = !sources?.length && !hasFrames;
      if (sources?.length) apps.set(sources.map((r, i) => row(r, `source:${i}`, r.display_label || program(r.process_name) || '帧源未记录', 'stone', metrics(r, [...fields, ['stutter_events', '卡顿', '次']]))));
      else if (hasFrames) apps.wait('帧源未记录');
      appsHost.nextElementSibling.textContent = sources?.length ? join(windowText(block('apps')?.window), block('apps')?.basis,
        data?.labels?.fps_table_low && '低谷帧率：每 30 秒算一次平均帧率，取最差的那一成') : '';
    } };
  }

  function methodChapter(el) {
    addAppPicture(el);
    el.closest('.grp').id = 'how-measured';
    el.innerHTML = keepTerms(`<dl class="smooth-method">
      <div><dt>帧率怎么量</dt><dd><p>显卡统计工具 RTSS 读每一张画面隔了多久；RTSS 读不到时，换 PresentMon 从 Windows 的显示记录里读。有画面在出帧就记，不管是游戏还是动态壁纸画的，大图里标着每一段是哪个程序画的。有曲线不等于在打游戏。</p><ul>
      <li>帧率：按每两张画面隔多久算出的速度，每分钟取平均。</li>
      <li>平均帧率：一段时间里实际画了几张，除以秒数。画面忽快忽慢时它会比帧率低，两条差得越多越不稳。</li>
      <li>最低 1%：最慢那 1% 画面的帧率，每分钟取最低的。</li>
      <li>单帧耗时：每分钟最慢的那一张画了多久。</li>
      <li>帧时抖动：相邻两张画面用时差了多少，每分钟取最大的。</li>
      <li>帧率是每分钟的平均，单帧耗时是每分钟最慢的那一张，所以 120 帧的那一分钟里也可能有一张 40 毫秒的画面，两个数不矛盾。</li></ul></dd></div>
      <div><dt>卡顿怎么量</dt><dd><ul><li data-method="game"></li><li data-method="hang"></li><li>平时（不在游戏里）很短的顿一下记不到，现在没有能直接拿来数的读数。</li></ul></dd></div>
      <div><dt>怎么算“在打游戏”</dt><dd>游戏在前台、你在用，才算在玩；游戏挂在后台不算，动态壁纸、微信、浏览器、游戏启动器也都不算。来回切换窗口时，“在玩”会跟着断断续续，这是正常的。</dd></div>
      <div><dt>多久更新</dt><dd data-method="period"></dd></div>
      <div><dt>什么时候不记</dt><dd><ul><li>关机、睡眠时不记，时间轴上写“关机”“睡眠”；死机到重启那段也算关机。</li><li>锁屏、关屏、离开电脑的时段不算卡顿。</li></ul></dd></div></dl>`);
    return { set() {
      const { game_min_ms: micro, severe_min_ms: severe, hang_threshold_seconds: hang,
        game_window_seconds: gameSample, hang_sample_seconds: hangSample, hardware_sample_seconds: hardwareSample } = method();
      const change = (name, text) => U.html(el.querySelector(`[data-method="${name}"]`), keepTerms(U.nowrap(text)), false);
      const levels = [finite(micro) && `一张画面超过 ${micro} 毫秒算卡（60 帧时一张约 17 毫秒）`,
        finite(severe) && `超过 ${severe} 毫秒算严重卡`].filter(Boolean).join('，');
      change('game', `游戏画面卡：只在打游戏时量。${levels ? levels + '。' : ''}${finite(gameSample) ? `每 ${gameSample} 秒看一次，` : ''}挨着的几次合成一次。没打游戏时，曲线多半是动态壁纸画的，壁纸顿一下不影响你在用的程序，所以不算。`);
      change('hang', `程序卡住：Windows 发现某个程序的窗口${finite(hang) ? `约 ${hang} 秒` : ''}不响应，就标“没响应”。${finite(hangSample) ? `电脑记录工具约每 ${hangSample} 秒看一次，` : ''}连着标的算一次，时长就是标了多久。平时用电脑卡不卡，看这一项。`);
      const sampling = [finite(hardwareSample) && `后台每 ${hardwareSample} 秒记一次硬件读数`,
        finite(hangSample) && `约每 ${hangSample} 秒看一次有没有程序卡住`].filter(Boolean).join('，');
      change('period', `${sampling ? sampling + '。' : ''}这页每 ${PAGE_REFRESH_MINUTES} 分钟自动取一次新数。哪一块超过 ${CLOSE_AFTER / 60} 分钟没取到新数，那一块会写“最后记录于几点”。`);
    } };
  }

  function fpsContext() {
    const status = gameStatus(), h = status.history;
    const latest = h?.latest_session, start = seconds(latest?.start), end = seconds(latest?.end);
    const noGame = h?.played === false;
    const recent = h?.played === true && finite(end);
    const sources = data?.fps?.sources || [];
    const others = recent ? sources.filter(s => seconds(s.start) < start || seconds(s.end) > end) : sources;
    const isWallpaper = s => wallpaper.test(s.process_name || '');
    const onlyWallpaper = others.length > 0 && others.every(isWallpaper) &&
      (!recent || finite(start));
    if (recent) {
      const began = finite(start) && U.time(iso(start)), ended = U.time(iso(end));
      const when = began ? `${U.date(iso(start)) === U.date(iso(end)) ? began : cutoff(start)}-${ended}` : `截至 ${cutoff(end)}`;
      const scores = [finite(latest.avg_fps) && `平均 ${Math.round(latest.avg_fps)} FPS`,
        finite(latest.low_fps) && `最低 1% ${Math.round(latest.low_fps)} FPS`,
        finite(latest.game_events) && `卡了 ${latest.game_events} 次`].filter(Boolean).join('，');
      return join(`这局${playedTitle(latest)} ${when}${scores ? '：' + scores : ''}`,
        onlyWallpaper && '其余时段的曲线是动态壁纸画的，不算打游戏');
    }
    const previous = noGame ? latest || h.previous_session : null;
    const previousEnd = seconds(previous?.end);
    const lastPlayed = finite(previousEnd) && `上次玩：${U.date(iso(previousEnd))}${playedTitle(previous)}${sessionLength(previous) ? ' ' + sessionLength(previous) : ''}`;
    const frame = status.frame?.process_name;
    return join(noGame && '近 24 小时没打游戏', noGame && onlyWallpaper ? '曲线是动态壁纸画的，不算打游戏' :
      frame && `现在出帧的是 ${frameSource(frame)}`, lastPlayed);
  }
  function renderFpsContext(el) {
    if (el) U.html(el, keepTerms(U.nowrap(fpsContext())), false);
  }
  function groups() {
    const grafana = data?.grafana?.href;
    const use = key => ({ sourceNotes: false, grafana, wait: data ? false : undefined,
      level: key === 'stutters' ? 'gray' : 'none' });
    const end = cutoff(classifiedWindow()?.to), sourceAt = cutoff(data?.fps?.sources_at);
    const stutterLine = end && (data.stutters.classified_read_error ? `这块最后统计到 ${end}` : `近 24 小时 · 截至 ${end}`);
    const fpsLine = join(readingLine('fps', framePack.series.length > 0), sourceAt && `最后一帧于 ${sourceAt}`);
    const first = data?.apps?.[0], front = first && U.sp(program(first.display_label ?? first.app));
    const options = data ? chips.filter(c => c.lines.some(l => framePack.series?.some(s => s.id === l.id && measured(s)))) : chips;
    return [
      { ...use('stutters'), key: 'stutters', name: '卡顿明细', pic: picture, palette: ['pink', 'violet'], build: stutterChapter,
        line: stutterLine },
      { ...use('fps'), key: 'fps', name: '帧率与手感', pic: picture, palette: ['teal', 'pink'], chips: options, hero: 'fps', build: foregroundChapter,
        line: fpsLine, say: () => ' ' },
      { ...use('apps'), key: 'apps', name: '各程序与窗口形态', palette: ['violet', 'pink'], build: appsChapter,
        line: join(front && `前台最久的是 ${front}`, readingLine('apps', Boolean(first))) },
      { ...use(), key: 'method', name: '这页怎么量的', palette: ['violet', 'pink'], build: methodChapter, wait: false },
    ].map(g => ({ ...g, line: data ? g.line : '' }));
  }
  const detailBoard = { ...board, blocks(d, _map, offline) {
    board.blocks(d, { stutters: [], fps: [], apps: [], method: [] }, offline);
  } };
  LiveDetail.mount({ resource: 'computer/smooth', board: detailBoard, merge: () => framePack,
    statusData: d => ({ level: d?.summary?.lamp_q === 'ok' ? 'ok' : 'gray' }), statusNotes: false,
    extraLinks: '<a class="more more--link" href="#how-measured">怎么量的 <span class="more__chev">↓</span></a>',
    render(d) {
      data = d;
      framePack = LiveDetail.merge(d, ['fps', 'frametime', 'jitter']);
      const bounds = [d?.fps, d?.frametime, d?.jitter].find(p => p?.series?.some(measured));
      if (bounds) { framePack.from = bounds.from; framePack.to = bounds.to; }
      framePack.series = framePack.series.filter(s => frameIds.has(s.id) && measured(s))
        .map(s => ({ ...s, from: framePack.from, to: framePack.to }));
      const { game_min_ms: micro, severe_min_ms: severe, hang_threshold_seconds: hang } = method();
      const game = [finite(micro) && `游戏里一帧 ${micro} 毫秒以上算卡`, finite(severe) && `${severe} 毫秒以上算严重`].filter(Boolean).join('，');
      const thresholds = join(game, finite(hang) && `程序窗口 ${hang} 秒没反应算卡住`);
      document.getElementById('smooth-thresholds').textContent = thresholds ? join('近 24 小时', thresholds) : '';
      renderHero();
      board.set(groups());
    } });
  window.Live.watch('computer/hardware', null, { data(d) {
    hardwareStatus = d?.game_status || null;
    renderHero();
    renderFpsContext(document.querySelector('[data-key="fps"] .grp__say'));
  } });
})();
