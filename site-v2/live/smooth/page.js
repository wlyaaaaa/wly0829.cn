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
  const cutoff = at => finite(Date.parse(at)) ? `${U.date(at) === U.date(Date.now()) ? '' : `${U.date(at)} `}${U.time(at)}` : '';
  const windowText = w => cutoff(w?.from) && cutoff(w?.to) ? `北京时间 ${U.date(w.from)} ${U.time(w.from)} 至 ${U.date(w.to)} ${U.time(w.to)}` : '';
  const join = (...parts) => parts.filter(Boolean).join(' · ');
  const keepGame = html => html.replaceAll('打游戏', '<span class="smooth-term">打游戏</span>');
  const hours = total => [total >= 3600 && `${Math.floor(total / 3600)} 小时`, `${Math.floor(total / 60) % 60} 分`].filter(Boolean).join(' ');
  const wallpaper = /^(?:wallpaper(?:32|64|ui|engine)?|webwallpaper32|ui32)(?:\.exe)?$/i;
  const frameSource = name => wallpaper.test(name || '') ? '动态壁纸' : U.programName(name);
  const program = name => wallpaper.test(name || '') ? '动态壁纸（Wallpaper Engine）' : U.programName(name);
  const modeName = label => U.sp(label).replace(/全屏\s*[/／]\s*无边框全屏|无边框全屏|全屏/g, '最大化窗口').replace(/普通窗口形态/g, '普通窗口');
  const block = name => data?.blocks?.[name] || data?.[name];
  const CLOSE_AFTER = 30 * 60, GAME_FRESH_FOR = 15;
  const PAGE_REFRESH_MINUTES = 5; // computer/smooth 外层调度为 300 秒，data.refresh_seconds 是数据源的采样批次。
  let data = null, framePack = {}, hardwareStatus = null;

  function thresholds() {
    const states = data?.stutters?.states || [];
    // 按需更新快核：50／100 毫秒来自分级带；旧回包省略门槛时核默认值。5 秒及 3 秒待后台给数，按需核一次。
    return { micro: states.find(s => s.id === 'micro_stutter')?.min_ms ?? 50,
      severe: states.find(s => s.id === 'severe_stutter')?.min_ms ?? 100,
      hang: 5, gameSample: 3, hangSample: 3 };
  }
  function readingLine(key, available, prefix = '', empty = '') {
    const b = block(key), end = b?.window?.to || b?.to || b?.at;
    const flag = b?.read_error || ['stale', 'unavailable'].includes(b?.state) || b?.q === 'stale';
    const last = cutoff(b?.recorded_at || b?.source_at || (available ? end : null));
    if (last && (flag || !available || seconds(window.Live.clock()) - seconds(end) >= CLOSE_AFTER)) return `这块最后记录于 ${last}`;
    return available ? join(prefix, cutoff(end) && `截至 ${cutoff(end)}`) : empty;
  }

  function gameStatus() {
    if (U.offline?.()) return {};
    const pack = hardwareStatus || data?.game_status || {};
    const now = seconds(window.Live.clock());
    const fresh = row => row && Math.abs(now - seconds(row.at)) < GAME_FRESH_FOR;
    return { ...pack, foreground: fresh(pack.foreground) ? pack.foreground : null,
      frame: fresh(pack.frame) ? pack.frame : null };
  }
  const history = () => gameStatus().history;
  const playedTitle = h => h?.game_name ? `《${U.sp(h.game_name)}》` : '';
  const gameHistory = h => h?.played === true ? `近 24 小时玩${finite(h.seconds) ? `了 ${hours(h.seconds)}` : '过游戏'}${playedTitle(h)}` : '';
  function renderHero() {
    if (!data) return;
    const status = gameStatus(), fg = status.foreground, h = status.history;
    const counts = eventCounts(data.summary), total = data.summary?.events;
    const playing = fg?.classification === 'game' && fg.active === true;
    const unknown = fg?.classification === 'unknown', name = U.sp(playedTitle(fg) || program(fg?.process_name));
    const stopped = finite(counts.hang) ? `程序卡住 ${counts.hang} 次` : '';
    const game = finite(counts.game) ? `游戏画面卡 ${counts.game} 次` : '';
    const played = gameHistory(h), complete = h?.complete === true, noGame = complete && h?.played === false;
    const currentFPS = playing && status.frame && finite(status.game_fps) && status.game_fps > 0;
    const scope = U.offline?.() || !data.game_status && !hardwareStatus ? '' : !fg ? '现在在不在打游戏没读到' : playing
      ? `正在玩${name || '游戏'} · ${currentFPS ? `现在 ${Math.round(status.game_fps)} 帧` : '帧率这会儿没读到'}`
      : unknown ? `${name ? `现在前台是 ${name}，` : ''}认不出是不是游戏` : played ? '现在没在打游戏' : noGame ? '近 24 小时没打游戏' : '近 24 小时打没打游戏没记全';
    let detail = [played, game, stopped].filter(Boolean).join('，');
    if (!playing && unknown) detail = join(stopped, '认不出是游戏的程序，不量游戏画面卡');
    else if (!playing && noGame) detail = join(stopped, `${fg ? '没打游戏' : '近 24 小时没打游戏'}，不量游戏画面卡`);
    else if (h && !complete) detail = join(played && fg ? detail : stopped, '游戏画面卡可能少算');
    const pronoun = U.you(window.Live.viewerKind());
    const warnings = [];
    if (!fg && (data.game_status || hardwareStatus) && !U.offline?.()) warnings.push(`电脑记录工具这会儿没报上前台是哪个程序，所以不知道${pronoun}现在在不在玩`);
    if (playing && !currentFPS) warnings.push('没读到帧率的这段时间量不了游戏画面卡，卡了几次可能少算');
    if (h && !complete && !U.offline?.()) warnings.push('前台程序的记录中间断了一段，那段时间玩没玩游戏、画面卡没卡不知道');
    const end = cutoff(data.summary?.window?.to);
    const footer = join(end && `数据截至 ${end}`, `每 ${PAGE_REFRESH_MINUTES} 分钟自动更新`);
    const head = finite(total) ? `近 24 小时卡了 ${total} 次` : '卡顿和帧率';
    const lamp = part('head').querySelector('.lamp')?.outerHTML || '';
    const heading = keepGame(U.head(join(head, scope), { lamp: false }));
    U.html(part('head'), `${lamp}<span class="smooth-headline">${heading}</span><span class="head__cutoff">${U.esc(footer)}</span>`);
    part('count').hidden = !detail;
    U.html(part('count'), detail && `<b>${keepGame(U.nowrap(detail))}</b>`);
    part('note').hidden = !warnings.length;
    U.html(part('note'), warnings.map(text => `<span>${U.esc(text)}</span>`).join(''));
  }

  // 分项是单独的读数，旧回包的 events 不能充作其中任何一项。
  function eventCounts(summary) {
    return { game: summary?.game_events, hang: summary?.program_hangs };
  }
  const eventKinds = [
    { id: 'game', label: '游戏画面卡', hue: 'pink', color: '#e2639f' },
    { id: 'hang', label: '程序卡住', hue: '#f49839', color: '#f49839' },
  ];
  function eventTitle(e) {
    if (e.kind === 'hang') return `${program(e.process_name) || '程序'} 卡住 ${+(e.end - e.start).toFixed(1)} 秒`;
    const grade = e.max_frame_ms >= thresholds().severe ? '画面严重卡' : '画面卡';
    return join(grade, finite(e.max_frame_ms) && `最慢一帧 ${Math.round(e.max_frame_ms)} 毫秒`);
  }
  function stutterChapter(el) {
    el.innerHTML = keepGame('<div class="stutter-layout"><div data-x="moments"></div><div data-x="graphs"><p class="grp-split__k">卡顿发生在哪一段</p><div data-x="timeline"></div><ul class="smooth-legend"></ul><div data-x="daily"></div></div><footer class="stat-gap">接着的几次卡算一次 · 没打游戏时不量画面卡</footer></div>');
    const host = which => el.querySelector(`[data-x="${which}"]`);
    const listHost = host('moments'), timelineHost = host('timeline'), dailyHost = host('daily'), legends = el.querySelector('.smooth-legend');
    const tl = V.timeline(timelineHost, { rows: [{ key: 'day', label: '卡顿' }], interactiveObservedOnly: true });
    const plot = timelineHost.querySelector('.vz-tl__plot');
    let list = [], picked = null;
    function mark() {
      plot.querySelectorAll('[data-event]').forEach(marker => { marker.style.opacity = picked == null || marker.dataset.event === picked ? '1' : '.45'; });
      const hit = list.find(e => `${e.kind}:${e.start}` === picked);
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
      moments.set(list.slice(0, limit).map(e => ({ key: `${e.kind}:${e.start}`, day: U.date(iso(e.start)),
        time: U.time(iso(e.start)), title: eventTitle(e), hue: eventKinds.find(k => k.id === e.kind).hue })));
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
      const st = data?.stutters, bounds = st?.window || data?.summary?.window;
      const counts = eventCounts(data?.summary), days = (data?.daily_stutters || []).slice(-7);
      const hasDays = days.some(d => Object.values(eventCounts(d)).some(finite));
      const seen = Array.isArray(st?.events) && (st.events.some(e => e.kind) || Object.values(counts).some(finite));
      list = seen ? st.events.filter(e => eventKinds.some(k => k.id === e.kind) && finite(e.start) && finite(e.end) && e.end > e.start)
        .sort((a, b) => b.start - a.start) : [];
      if (picked && !list.some(e => `${e.kind}:${e.start}` === picked)) picked = null;
      paintMoments();
      listHost.hidden = !seen;
      host('graphs').hidden = !seen && !hasDays;
      el.querySelector('footer').hidden = !seen;
      const from = seconds(bounds?.from), to = seconds(bounds?.to);
      const band = seen && to > from;
      timelineHost.hidden = !band;
      tl.set(band ? { states: [{ id: 'clear', label: '卡顿', hue: 'stone' }], rows: { day: { ...bounds, spans: [[from, null]] } } } : null);
      plot.querySelectorAll('[data-event]').forEach(marker => marker.remove());
      if (band) for (const e of list.filter(e => e.start >= from && e.start < to)) {
        const marker = document.createElement('i'); marker.dataset.event = `${e.kind}:${e.start}`;
        marker.style.cssText = `position:absolute;inset:0 auto 0 ${(e.start - from) / (to - from) * 100}%;width:3px;background:${eventKinds.find(k => k.id === e.kind).color};border-radius:3px;pointer-events:none`;
        plot.append(marker);
      }
      const h = history(), noGame = h?.complete === true && h.played === false;
      U.html(legends, eventKinds.map(({ id, label, color }) => {
        const value = counts[id], absent = id === 'game' && noGame;
        return !absent && !finite(value) ? '' : `<li style="--swatch:${absent ? '#aaa9a5' : color}">${label}${absent ? '：没打游戏' : ` ${value} 次`}</li>`;
      }).join(''));
      dailyHost.hidden = !hasDays;
      if (hasDays) daily.set({ labels: days.map(d => ({ text: d.day.slice(5), title: d.day })),
        values: Object.fromEntries(eventKinds.map(({ id }) => [id, days.map(d => eventCounts(d)[id])])) });
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
    let labels = [];
    function draw() {
      const width = rail.clientWidth;
      const rows = [];
      for (const { start, end, name, game } of labels) {
        if (!width) break;
        const a = Math.round(start * width), b = Math.round(end * width);
        const size = Math.min(width, Math.max(game ? 135 : 100, Math.min(b - a, 150)));
        const left = Math.max(0, Math.min(width - size, Math.round((a + b - size) / 2)));
        let row = rows.find(row => row.right <= left);
        if (!row) { row = { right: 0, items: [] }; rows.push(row); }
        row.items.push(`<span${game ? ' data-game' : ''} style="margin-left:${left - row.right}px;width:${size}px">${U.nowrap(name)}</span>`);
        row.right = left + size;
      }
      U.html(rail, rows.map(row => `<div>${row.items.join('')}</div>`).join(''), false);
    }
    new ResizeObserver(draw).observe(plot);
    return active => {
      const from = seconds(framePack.from), to = seconds(framePack.to), span = to - from;
      const names = data?.fps?.sources?.length ? data.fps.sources : active ? [{ start: from, end: to }] : [];
      labels = span > 0 ? names.flatMap(s => {
        const start = Math.max(from, s.start), end = Math.min(to, s.end);
        if (!(end > start)) return [];
        const name = join(playedTitle(s) || U.sp(frameSource(s.process_name)) || '帧源未记录', finite(s.fps) && `${Math.round(s.fps)} 帧`);
        return [{ start: (start - from) / span, end: (end - from) / span, name, game: Boolean(s.game_name) }];
      }).sort((a, b) => a.start - b.start) : [];
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
    el.innerHTML = keepGame(`<dl class="smooth-method">
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
      const { micro, severe, hang, gameSample, hangSample } = thresholds();
      const change = (name, text) => U.html(el.querySelector(`[data-method="${name}"]`), keepGame(U.nowrap(text)), false);
      change('game', `游戏画面卡：只在打游戏时量。一张画面超过 ${micro} 毫秒算卡（60 帧时一张约 17 毫秒），超过 ${severe} 毫秒算严重卡。每 ${gameSample} 秒看一次，挨着的几次合成一次。没打游戏时，曲线多半是动态壁纸画的，壁纸顿一下不影响你在用的程序，所以不算。`);
      change('hang', `程序卡住：Windows 发现某个程序的窗口约 ${hang} 秒不响应，就标“没响应”；电脑记录工具约每 ${hangSample} 秒看一次，连着标的算一次，时长就是标了多久。平时用电脑卡不卡，看这一项。`);
      change('period', `后台每秒记一次硬件读数，约每 ${hangSample} 秒看一次有没有程序卡住；这页每 ${PAGE_REFRESH_MINUTES} 分钟自动取一次新数。哪一块超过 ${CLOSE_AFTER / 60} 分钟没取到新数，那一块会写“最后记录于几点”。`);
    } };
  }

  function fpsContext() {
    const status = gameStatus(), h = status.history, session = data?.fps?.session;
    if (session?.game_name && seconds(session.to) > seconds(session.from) &&
        [session.avg_fps, session.low_fps, session.game_events].every(finite)) {
      const score = `这局${playedTitle(session)} ${U.time(iso(seconds(session.from)))}–${U.time(iso(seconds(session.to)))}：平均 ${Math.round(session.avg_fps)} FPS，最低 1% ${Math.round(session.low_fps)} FPS，卡了 ${session.game_events} 次`;
      return join(score, session.other_source && `其余时段的曲线是${frameSource(session.other_source)}画的，不算打游戏`);
    }
    if (h?.played === true) return '';
    const source = status.frame?.process_name;
    const noGame = h?.complete === true && h.played === false;
    return join(noGame && '近 24 小时没打游戏', source && `现在出帧的是 ${frameSource(source)}`);
  }
  function renderFpsContext(el) {
    if (el) U.html(el, keepGame(U.nowrap(fpsContext())), false);
  }
  function groups() {
    const grafana = data?.grafana?.href;
    const use = key => ({ sourceNotes: false, grafana, wait: data ? false : undefined,
      level: key === 'stutters' ? 'gray' : 'none' });
    const counts = eventCounts(data?.summary), complete = Object.values(counts).every(finite);
    const stutterLine = readingLine('stutters', finite(data?.summary?.events), '近 24 小时');
    const fpsLine = readingLine('fps', framePack.series.length > 0, '', '这段时间没读到帧率');
    const first = data?.apps?.[0], front = first && U.sp(program(first.display_label ?? first.app));
    const options = data ? chips.filter(c => c.lines.some(l => framePack.series?.some(s => s.id === l.id && measured(s)))) : chips;
    return [
      { ...use('stutters'), key: 'stutters', name: '卡顿明细', pic: picture, palette: ['pink', 'violet'], build: stutterChapter,
        line: join(stutterLine, data && !complete && '游戏画面卡和程序卡住还没有分开记录') },
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
      const { micro, severe, hang } = thresholds();
      document.getElementById('smooth-thresholds').textContent = `近 24 小时 · 游戏里一帧 ${micro} 毫秒以上算卡，${severe} 毫秒以上算严重 · 程序窗口 ${hang} 秒没反应算卡住`;
      renderHero();
      board.set(groups());
    } });
  window.Live.watch('computer/hardware', null, { data(d) {
    hardwareStatus = d?.game_status || null;
    renderHero();
    renderFpsContext(document.querySelector('[data-key="fps"] .grp__say'));
  } });
})();
