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
  const svgTag = tag => document.createElementNS('http://www.w3.org/2000/svg', tag);
  const seconds = at => typeof at === 'number' ? at : Date.parse(at) / 1000;
  const iso = at => new Date(at * 1000).toISOString();
  const cutoff = at => {
    if (!finite(seconds(at))) return '';
    const stamp = iso(seconds(at));
    return `${U.date(stamp) === U.date(Date.now()) ? '' : `${U.date(stamp)} `}${U.time(stamp)}`;
  };
  const join = (...parts) => parts.filter(Boolean).join(' · ');
  const keepTerms = html => html.replace(/“在打游戏”|“在玩”|在不在玩|不在玩|卡没卡|在打游戏|打游戏|不知道|最慢一帧|没响应|微信|关机|\d+(?:\.\d+)?[ \t]*毫秒/g, '<span class="smooth-term">$&</span>');
  const missingProgram = '没记下是哪个程序';
  const hours = total => total < 60 ? `${Math.floor(total)} 秒` :
    [total >= 3600 && `${Math.floor(total / 3600)} 小时`, `${Math.floor(total / 60) % 60} 分`].filter(Boolean).join(' ');
  const wallpaper = /^(?:wallpaper(?:32|64|ui|engine)?|webwallpaper32|ui32)(?:\.exe)?$/i;
  const frameSource = name => wallpaper.test(name || '') ? '动态壁纸' : U.programName(name);
  const program = name => wallpaper.test(name || '') ? '动态壁纸（Wallpaper Engine）' : U.programName(name);
  const modeName = label => U.sp(label).replace(/全屏\s*[/／]\s*无边框全屏|无边框全屏|全屏/g, '最大化窗口').replace(/普通窗口形态/g, '普通窗口');
  const block = name => data?.blocks?.[name] || data?.[name];
  const CLOSE_AFTER = 30 * 60, GAME_FRESH_FOR = 15;
  const FRAME_MINUTE_SECONDS = 60;
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
    U.html(part('note'), warnings.map(text => `<span>${keepTerms(U.esc(text))}</span>`).join(''));
  }

  function eventCounts(summary) {
    return { game: summary?.game_events, hang: summary?.program_hangs };
  }
  function stutterLevel(d) {
    const counts = Object.values(eventCounts(d?.summary)).filter(finite);
    if (U.offline?.() || !counts.length) return 'gray';
    return counts.reduce((sum, value) => sum + value, 0) >= 24 ? 'yellow' : 'ok';
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
      more: () => toggle.getAttribute('aria-expanded') === 'true' ? '收起明细' : `展开明细 · 共 ${list.length} 条`,
      onPick(key) { picked = key; mark(); } });
    const toggle = listHost.querySelector('.more'), more = document.createElement('button');
    more.className = 'more smooth-more-moments'; more.type = 'button';
    listHost.querySelector('.fold > div').append(more);
    function paintMoments() {
      moments.set(list.slice(0, limit).map(e => ({ key: e.key, day: U.date(iso(e.start)),
        time: U.time(iso(e.start)), title: eventTitle(e), hue: eventKinds.find(k => k.id === e.kind).hue })));
      listHost.querySelectorAll('.vz-moment__text b').forEach(b => {
        if (b.firstElementChild) return;
        const [title, frame] = b.textContent.split(' · ');
        const sub = frame ? `<span class="smooth-moment-frame">${U.nowrap(frame)}</span>` : '';
        const heading = keepTerms(U.nowrap(title)).replace(/([A-Za-z0-9])\.(?=[A-Za-z])/g, '$1.<wbr>');
        U.html(b, heading + sub, false);
      });
      more.hidden = limit >= list.length;
      if (!more.hidden) more.textContent = `再展开 ${Math.min(batch, list.length - limit)} 条`;
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
    const rail = document.createElement('div'); rail.className = 'smooth-frame-sources'; plot.append(rail);
    rail.innerHTML = '<div></div><span class="smooth-frame-point" hidden></span>';
    const stack = rail.firstElementChild, point = rail.lastElementChild;
    let sources = [];
    const label = ({ name, fps }, pointing = false) => join(name || (pointing ?
      '这段时间还没记下是哪个程序画的' : missingProgram), finite(fps) && `${Math.round(fps)} 帧`);
    sync.add({ mark() {}, point(at) {
      const source = at == null ? null : sources.find(s => s.start <= at && at < s.end);
      point.hidden = !source;
      point.toggleAttribute('data-game', Boolean(source?.game));
      if (source) U.html(point, U.nowrap(label(source, true)), false);
    } });
    function draw() {
      const width = rail.clientWidth, from = seconds(framePack.from), span = seconds(framePack.to) - from;
      if (!(width > 0 && span > 0)) return;
      const labels = [];
      for (const source of sources) {
        const previous = labels.at(-1);
        if (previous?.name === source.name && previous.game === source.game && (source.start - previous.end) * width / span < 3) {
          previous.end = Math.max(previous.end, source.end);
          if (Math.round(previous.fps) !== Math.round(source.fps)) previous.fps = null;
        } else labels.push({ ...source });
      }
      const visible = labels.filter(s => s.game || (s.end - s.start) * width / span > 20);
      U.html(stack, visible.map(s => `<span${s.game ? ' data-game' : ''}>${U.nowrap(label(s))}</span>`).join(''), false);
      const occupied = [];
      const inset = 3, toX = time => (time - from) * width / span;
      const items = [...stack.children].map((item, i) => {
        item.hidden = false;
        const source = visible[i];
        const start = Math.max(inset, toX(source.start)), end = Math.min(width - inset, toX(source.end));
        return { item, game: source.game, start, end, atRight: end >= width - 16 };
      });
      items.sort((a, b) => Number(b.atRight) - Number(a.atRight) || Number(b.game) - Number(a.game) ||
        (b.end - b.start) - (a.end - a.start));
      for (const { item, game, start, end, atRight } of items) {
        const size = item.getBoundingClientRect().width;
        const target = atRight ? end - size : (start + end - size) / 2;
        const min = atRight ? target : game ? Math.max(inset, start - size / 2 - 16) : start;
        const max = atRight ? target : game ? Math.min(width - inset - size, end - size / 2 + 16) : end - size;
        const left = min > max || atRight && size > end - start ? undefined :
          [target, ...occupied.flatMap(([a, b]) => [a - size, b])].map(x => Math.max(min, Math.min(max, x)))
            .filter(x => occupied.every(([a, b]) => x + size <= a + .01 || x >= b - .01))
            .sort((a, b) => Math.abs(a - target) - Math.abs(b - target))[0];
        item.hidden = left === undefined;
        if (left !== undefined) { item.style.left = `${left}px`; occupied.push([left, left + size]); }
      }
    }
    new ResizeObserver(draw).observe(plot);
    const svg = plot.querySelector('.chart__svg');
    function labelGaps() {
      const from = seconds(framePack.from), span = seconds(framePack.to) - from;
      for (const gap of svg.querySelectorAll('.chart__gap:not(:has(text))')) {
        const rect = gap.firstElementChild;
        const width = Number(rect.getAttribute('width'));
        if (width < 28) continue;
        const x = Number(rect.getAttribute('x')) + width / 2;
        const y = Number(rect.getAttribute('y')) + Number(rect.getAttribute('height')) / 2 + 3;
        const at = from + (x - 58) * span / rail.clientWidth;
        const isOff = framePack.off_spans?.some(([start, end]) => start <= at && at < end);
        const caption = svgTag('text');
        const font = width >= 32 ? 9 : 8;
        for (const [key, val] of Object.entries({ x, y, 'text-anchor': 'middle', 'font-size': font, fill: '#6b6a64' })) caption.setAttribute(key, val);
        caption.textContent = isOff ? '关机' : '没记录';
        gap.append(caption);
      }
      const area = svg.querySelector('.chart__area[fill$="-current)"]');
      if (!area || area.hasAttribute('data-joined')) return;
      const gradient = svg.querySelector('linearGradient[id$="-current"]');
      const bounds = svg.querySelector('clipPath rect');
      if (gradient && bounds) {
        const top = Number(bounds.getAttribute('y'));
        gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
        gradient.setAttribute('y1', top);
        gradient.setAttribute('y2', top + Number(bounds.getAttribute('height')));
      }
      // 补齐主曲线底色里狭窄的空缝，曲线本身仍按记录断开。
      const outline = area.getAttribute('d');
      const runs = [...outline.matchAll(/M([\d.]+),([\d.]+).*? ([\d.]+),([\d.]+)L[\d.]+,([\d.]+)L[\d.]+,[\d.]+Z/g)];
      const bridges = runs.map(([, start, top], i) => {
        const previous = runs[i - 1];
        if (!previous || start - previous[3] >= 28) return '';
        const [, , , end, last, bottom] = previous;
        return `M${end},${last}L${start},${top}V${bottom}H${end}Z`;
      }).join('');
      if (bridges) area.setAttribute('d', outline + bridges);
      area.setAttribute('data-joined', '');
    }
    labelGaps();
    new MutationObserver(labelGaps).observe(svg, { childList: true });
    document.fonts.ready.then(draw);
    return active => {
      const fps = data?.fps, from = seconds(framePack.from), to = seconds(framePack.to);
      const raw = fps?.sources?.length ? fps.sources : active ? [{ start: from, end: to }] : [];
      const after = seconds(fps?.sources_window?.from), until = seconds(fps?.sources_window?.to);
      const { foreground: fg, history: h } = gameStatus();
      const currentGame = fg?.classification === 'game' && fg.game_name && fg.process_name;
      const games = [h?.latest_session, h?.previous_session].filter(g => g?.game_name);
      sources = raw.flatMap(s => {
        const start = Math.max(from, finite(after) ? after : from, seconds(s.start));
        const end = Math.min(to, finite(until) ? until : to, seconds(s.end));
        if (!(end > start)) return [];
        const process = U.sp(frameSource(s.process_name));
        const gameName = currentGame && s.process_name?.toLowerCase() === fg.process_name.toLowerCase() ?
          fg.game_name : games.find(g => U.sp(g.game_name) === process || g.process_name &&
            g.process_name.toLowerCase() === s.process_name?.toLowerCase())?.game_name;
        const name = playedTitle({ game_name: gameName }) || process;
        return [{ start, end, name, game: Boolean(gameName), fps: s.fps }];
      }).sort((a, b) => a.start - b.start);
      point.hidden = true;
      draw();
    };
  }
  function foregroundPaint(plot) {
    const layer = document.createElement('div');
    layer.className = 'smooth-foreground-spans'; layer.setAttribute('aria-hidden', 'true'); plot.prepend(layer);
    let day, colors;
    function draw() {
      const from = seconds(day?.from), to = seconds(day?.to), range = to - from;
      if (!(range > 0 && plot.clientWidth)) { U.html(layer, '', false); return; }
      const pieces = [], pixel = range / plot.clientWidth;
      for (const [i, [at, state]] of day.spans.entries()) {
        const a = Math.max(from, at), b = Math.min(to, day.spans[i + 1]?.[0] ?? to);
        if (!(b > a)) continue;
        const fill = colors[state] ? (b - a < 2 * pixel ? '#eae7ec' : colors[state]) : '';
        const prev = pieces.at(-1);
        if (prev?.fill === fill && prev.b === a) prev.b = b;
        else pieces.push({ a, b, fill });
      }
      U.html(layer, pieces.map(({ a, b, fill }) => {
        const width = (b - a) / range * 100;
        return `<i${fill ? '' : ' data-unknown'} style="left:${(a - from) / range * 100}%;width:${width}%;--fill:${fill}"></i>`;
      }).join(''), false);
    }
    new ResizeObserver(draw).observe(plot);
    return (row, paints) => { day = row; colors = paints; draw(); };
  }
  function sparkCurve(coords) {
    const slopes = coords.slice(1).map(([x, y], i) => (y - coords[i][1]) / (x - coords[i][0]));
    const tangent = i => {
      const before = slopes[i - 1], after = slopes[i];
      return before * after > 0 ? Math.sign(before) * Math.min(Math.abs(before), Math.abs(after)) : 0;
    };
    return coords.map(([x, y], i) => {
      if (!i) return `M${x},${y}${coords.length === 1 ? 'h.01' : ''}`;
      const [px, py] = coords[i - 1], dx = (x - px) / 3;
      return `C${px + dx},${py + dx * tangent(i - 1)} ${x - dx},${y - dx * tangent(i)} ${x},${y}`;
    }).join('');
  }
  function shapeSparks(card) {
    for (const key of ['frametime', 'jitter']) {
      const svg = card.querySelector(`.vz-chip-cell[data-key="${key}"] .chart__svg`);
      if (!svg) continue;
      const draw = () => {
        const line = svg.querySelector('.chart__line'), width = Number(svg.getAttribute('width'));
        if (!line || line.querySelector('.smooth-spark') || !(width > 0)) return;
        const current = framePack.series.find(s => s.id === key);
        const points = current?.points || [], values = points.map(([, v]) => v).filter(finite).sort((a, b) => a - b);
        const from = seconds(current?.from), span = seconds(current?.to) - from;
        const cap = values[Math.ceil(values.length * .95) - 1], floor = values[0];
        if (!(span > 0 && finite(cap))) return;
        const top = 4, bottom = Number(svg.getAttribute('height')) - 4;
        const toX = t => Math.min(width - 3, Math.max(3, (t - from) / span * width));
        const toY = v => bottom - (v - floor) / (cap - floor || 1) * (bottom - top) * .8;
        const peakSpacing = Math.max(16, width / 10);
        const runs = [], peaks = [], path = svgTag('path'), spark = svgTag('g');
        let run, peak;
        for (const [t, value] of points) {
          if (!finite(value) || t < from || t > from + span) { run = null; continue; }
          if (!run || t - run.at(-1)[0] > FRAME_MINUTE_SECONDS * 1.5) { run = []; runs.push(run); }
          run.push([t, value]);
          if (value <= cap) continue;
          const x = toX(t);
          if (!peak || x - peak.last >= peakSpacing) { peak = { x, value, last: x }; peaks.push(peak); }
          if (value > peak.value) { peak.x = x; peak.value = value; }
          peak.last = x;
        }
        const d = runs.map(run => sparkCurve(C.buckets(run.filter(([, value]) => value <= cap), toX, 6)
          .map(([time, value]) => [toX(time), toY(value)]))).join('');
        spark.setAttribute('class', 'smooth-spark');
        path.setAttribute('class', 'chart__stroke'); path.setAttribute('d', d); spark.append(path);
        for (const { x } of peaks) {
          const dot = svgTag('circle');
          dot.setAttribute('cx', x); dot.setAttribute('cy', top + 2.8); dot.setAttribute('r', 2.2);
          spark.append(dot);
        }
        line.append(spark);
      };
      if (!svg.hasAttribute('data-smooth-spark')) {
        svg.setAttribute('data-smooth-spark', '');
        // 小图压缩尖峰，读数、同步指读和切换到大图都继续使用原值。
        new MutationObserver(draw).observe(svg, { childList: true });
      }
      draw();
    }
  }
  function foregroundChapter(el) {
    el.innerHTML = '<div class="frame-sync"><p class="grp-split__k">前台程序同步带 · 这会儿在看哪个窗口</p><div></div></div><p class="smooth-frame-notes">帧率按每两张画面的间隔算，每分钟取平均；平均帧率是实际画了几张除以秒数，两条差得多说明忽快忽慢<br>最低 1% 是最慢那 1% 画面的帧率；单帧耗时是每分钟最慢的一张画了多久；抖动是相邻两张差了多久</p>';
    const wrap = el.querySelector('.frame-sync'), host = wrap.lastElementChild, card = el.closest('.grp');
    const tl = V.timeline(host, { rows: [{ key: 'day', label: '前台程序' }] });
    const plot = host.querySelector('.vz-tl__plot'), cursor = document.createElement('i');
    const paintForeground = foregroundPaint(plot);
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
      const { foreground: fg, history: h } = gameStatus();
      const gameNames = [fg?.classification === 'game' && fg.game_name, h?.latest_session?.game_name, h?.previous_session?.game_name].filter(Boolean);
      const palette = ['#a8d5f1', '#efb9dd', '#d4baf0', '#f7d0aa'];
      const hues = new Set(pack?.states?.map(s => s.hue));
      const states = pack?.states?.map((s, i) => ({ ...s,
        label: program(U.fieldText(s.display_label ?? s.label)) || s.label,
        hue: hues.size > 1 && s.hue || ['blue', 'pink', 'violet', 'apricot', 'teal'][i % 5],
      }));
      wrap.hidden = !pack?.rows?.day?.spans?.length;
      const aligned = alignForeground({ ...pack, states }, framePack);
      from = seconds(aligned.rows?.day?.from); to = seconds(aligned.rows?.day?.to);
      if (!wrap.hidden) tl.set(aligned);
      paintForeground(aligned.rows?.day, (states || []).map(({ label }, i) => {
        const name = U.sp(label);
        if (/未知|未分类|没记下|未记录/.test(name)) return '';
        return gameNames.some(game => name.endsWith(U.sp(game))) ? '#00A650' : palette[i % palette.length];
      }));
      card.classList.toggle('fps-empty', Boolean(data) && !measuredSeries.length);
      card.classList.toggle('fps-single', g.chips.length <= 1);
      el.hidden = wrap.hidden && !measuredSeries.length;
      const chart = card.querySelector('.grp__hero');
      const active = measuredSeries.find(s => s.id === chart.querySelector('[data-line]')?.dataset.line) || measuredSeries[0];
      const mainPlot = chart.querySelector('.chart__plot');
      if (mainPlot) { drawLabels ??= frameLabelRail(mainPlot); drawLabels(active); }
      shapeSparks(card);
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
    el.innerHTML = '<div class="grp-split"><section><p class="grp-split__k" data-mode-title></p><div data-x="modes"></div></section><section><p class="grp-split__k">各程序的流畅度 · 帧算在真正画它的程序头上</p><div data-x="apps"></div><p class="grp-split__k smooth-rank-note"></p></section></div>';
    const modesHost = el.querySelector('[data-x="modes"]'), appsHost = el.querySelector('[data-x="apps"]');
    const rank = host => V.rank(host, { show: Infinity, trailing: r =>
      `<span class="smooth-rank-icon${r.icon ? '' : ' is-window'}" aria-hidden="true">${U.esc(r.icon || '')}</span>` });
    const modes = rank(modesHost), apps = rank(appsHost);
    const fields = [['fps', '平均帧率', 'FPS'], ['low', '低谷帧率', 'FPS'], ['stutter_pct', '卡顿帧占比', '%']];
    function appLabel(label) {
      const named = U.sp(label), icon = /^([\p{Extended_Pictographic}\p{Regional_Indicator}]\uFE0F?)\s+/u.exec(named);
      return { name: icon ? named.slice(icon[0].length) : named, icon: icon?.[1] === '⚙️' ? '' : icon?.[1] };
    }
    function row(r, key, label, hue, readings, icon) {
      return S.row({ key, name: label, icon, sub: readings, value: r.seconds, text: finite(r.seconds) ? V.fmt(r.seconds, '秒') : '', hue }, r, 'seconds');
    }
    return { set() {
      const shapes = data?.modes, sources = data?.fps?.apps || [];
      modesHost.parentElement.hidden = !shapes?.length;
      modes.set(shapes?.map((r, i) => {
        const { name, icon } = appLabel(modeName(r.mode));
        return row(r, `mode:${i}`, name, 'violet', metrics(r, [...fields, ['severe_pct', '严重卡顿帧占比', '%']]), icon);
      }) ?? null);
      el.querySelector('[data-mode-title]').textContent = '最大化窗口和普通窗口的差别';
      const hasFrames = framePack.series?.some(measured);
      const icons = new Map((data?.apps || []).flatMap(app => {
        const { name, icon } = appLabel(app.app);
        const matched = U.sp(program(app.display_label || name)).toLowerCase();
        return icon && matched ? [[matched, icon]] : [];
      }));
      const ranked = sources.map((r, i) => {
        const name = r.process_name ? program(r.process_name) : missingProgram;
        const shown = appLabel(r.display_label || name);
        const icon = shown.icon || icons.get(U.sp(name).toLowerCase()) || (wallpaper.test(r.process_name || '') ? '🖼️' : '');
        return row(r, `source:${i}`, shown.name, 'stone', metrics(r, [...fields, ['stutter_events', '卡顿', '次']]), icon);
      });
      if (sources.every(r => r.process_name)) {
        const unknown = (data?.fps?.sources || []).reduce((total, s) => {
          const duration = seconds(s.end) - seconds(s.start);
          return total + (!s.process_name && finite(duration) && duration > 0 ? duration : 0);
        }, 0);
        if (unknown > 0) ranked.push(row({ seconds: unknown }, 'source:unknown', missingProgram, 'stone', ''));
      }
      appsHost.parentElement.hidden = !ranked.length && !hasFrames;
      if (ranked.length) apps.set(ranked.sort((a, b) => (b.value ?? -1) - (a.value ?? -1)));
      else if (hasFrames) apps.wait(missingProgram);
      appsHost.nextElementSibling.textContent = sources.length ? join(block('apps')?.basis,
        data?.labels?.fps_table_low && '低谷帧率：每 30 秒算一次平均帧率，取最差的那一成') : '';
      for (const small of el.querySelectorAll('.vz-rank__name small')) {
        if (!small.querySelector('.smooth-metric')) U.html(small, small.textContent.split(' · ').map(text =>
          `<span class="smooth-metric">${U.esc(text)}</span>`).join(' '), false);
      }
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
      <div><dt>怎么算“在打游戏”</dt><dd data-method="playing"></dd></div>
      <div><dt>多久更新</dt><dd data-method="period"></dd></div>
      <div><dt>什么时候不记</dt><dd><ul><li>关机、睡眠时不记，时间轴上写“关机”“睡眠”；死机到重启那段也算关机。</li><li>锁屏、关屏、离开电脑的时段不算卡顿。</li></ul></dd></div></dl>`);
    return { set() {
      const { game_min_ms: micro, severe_min_ms: severe, hang_threshold_seconds: hang,
        game_window_seconds: gameSample, hang_sample_seconds: hangSample, hardware_sample_seconds: hardwareSample } = method();
      const pronoun = U.you(window.Live.viewerKind());
      const change = (name, text) => U.html(el.querySelector(`[data-method="${name}"]`), keepTerms(U.nowrap(text)), false);
      const levels = [finite(micro) && `一张画面超过 ${micro} 毫秒算卡（60 帧时一张约 17 毫秒）`,
        finite(severe) && `超过 ${severe} 毫秒算严重卡`].filter(Boolean).join('，');
      change('game', `游戏画面卡：只在打游戏时量。${levels ? levels + '。' : ''}${finite(gameSample) ? `每 ${gameSample} 秒看一次，` : ''}挨着的几次合成一次。没打游戏时，曲线多半是动态壁纸画的，壁纸顿一下不影响${pronoun}在用的程序，所以不算。`);
      change('hang', `程序卡住：Windows 发现某个程序的窗口${finite(hang) ? `约 ${hang} 秒` : ''}不响应，就标“没响应”。${finite(hangSample) ? `电脑记录工具约每 ${hangSample} 秒看一次，` : ''}连着标的算一次，时长就是标了多久。平时用电脑卡不卡，看这一项。`);
      change('playing', `游戏在前台、${pronoun}在用，才算在玩；游戏挂在后台不算，动态壁纸、微信、浏览器、游戏启动器也都不算。来回切换窗口时，“在玩”会跟着断断续续，这是正常的。`);
      const sampling = [finite(hardwareSample) && `后台每 ${hardwareSample} 秒记一次硬件读数`,
        finite(hangSample) && `约每 ${hangSample} 秒看一次有没有程序卡住`].filter(Boolean).join('，');
      change('period', `${sampling ? sampling + '。' : ''}这页每 ${PAGE_REFRESH_MINUTES} 分钟自动取一次新数。哪一块超过 ${CLOSE_AFTER / 60} 分钟没取到新数，那一块会写“最后记录于几点”。`);
    } };
  }

  function fpsContext() {
    const status = gameStatus(), h = status.history;
    const latest = h?.latest_session, start = seconds(latest?.start), end = seconds(latest?.end);
    if (h?.played == null) {
      const uncovered = data?.summary?.game_uncovered_seconds;
      const gap = finite(uncovered) && uncovered > 0 ? `缺了 ${hours(uncovered).replace(/ 分$/, ' 分钟')}` : '不全';
      const startDate = finite(start) && U.date(iso(start)), endDate = finite(end) && U.date(iso(end));
      const when = finite(end) && (finite(start)
        ? `${startDate} ${U.time(iso(start))}–${startDate === endDate ? '' : endDate + ' '}${U.time(iso(end))}`
        : `截至 ${endDate} ${U.time(iso(end))}`);
      const lastPlayed = latest && [`上次玩${playedTitle(latest)}`, when].filter(Boolean).join(' ');
      const duration = finite(start) && end > start && `${Math.floor((end - start) / 60)} 分`;
      return join(`近 24 小时的游戏记录${gap}，玩没玩游戏现在说不准`, lastPlayed, duration);
    }
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
      level: key === 'stutters' ? stutterLevel(data) : 'none' });
    const end = cutoff(classifiedWindow()?.to), sourceAt = seconds(data?.fps?.sources_at);
    const stutterLine = end && (data.stutters.classified_read_error ? `这块最后统计到 ${end}` : `近 24 小时 · 截至 ${end}`);
    const frameSeries = framePack.series.filter(s => s.unit === 'FPS');
    const latest = Math.max(...frameSeries.map(s => s.points.at(-1)?.[0] ?? -Infinity));
    const exactFrame = sourceAt >= latest && sourceAt < latest + FRAME_MINUTE_SECONDS;
    const lastTime = cutoff(exactFrame ? sourceAt : latest);
    const fpsCutoff = readingLine('fps', framePack.series.length > 0);
    const fpsLine = join(fpsCutoff, lastTime && !fpsCutoff.endsWith(` ${lastTime}`) && `${exactFrame ? '最后一帧于' : '帧率读到'} ${lastTime}`);
    const first = data?.apps?.[0], front = first && U.sp(program(first.display_label ?? first.app));
    const peak = Math.max(...frameSeries.map(s => C.sum(s)?.max ?? 0));
    const options = chips.filter(c => !data || c.lines.some(l => framePack.series.some(s => s.id === l.id && measured(s))))
      .map(c => c.key === 'fps' && peak > 0 ? { ...c, ceil: Math.ceil(peak / 20) * 20 } : c);
    return [
      { ...use('stutters'), key: 'stutters', name: '卡顿明细', pic: picture, palette: ['pink', 'violet'], build: stutterChapter,
        line: stutterLine },
      { ...use('fps'), key: 'fps', name: '帧率与手感', pic: picture, palette: ['teal', 'pink'], chips: options, hero: 'fps', build: foregroundChapter,
        line: fpsLine, say: () => ' ' },
      { ...use('apps'), key: 'apps', name: '各程序与窗口形态', palette: ['violet', 'pink'], build: appsChapter,
        line: join(front && `前台最久的是 ${front}`, readingLine('apps', Boolean(first)).replace('截至 ', '前台统计截至 ')) },
      { ...use(), key: 'method', name: '这页怎么量的', palette: ['violet', 'pink'], build: methodChapter, wait: false },
    ].map(g => ({ ...g, line: data ? g.line : '' }));
  }
  const detailBoard = { ...board, blocks(d, _map, offline) {
    board.blocks(d, { stutters: [], fps: [], apps: [], method: [] }, offline);
  } };
  function sparseFrameMinutes(spans) {
    const result = new Set(), half = FRAME_MINUTE_SECONDS / 2;
    for (const [i, span] of spans.entries()) {
      const start = seconds(span.start), finish = seconds(span.end);
      const minute = Math.floor(start / FRAME_MINUTE_SECONDS) * FRAME_MINUTE_SECONDS;
      const end = minute + FRAME_MINUTE_SECONDS;
      if (start - seconds(spans[i - 1]?.end) >= half && finish > start && finish - start < half &&
          finish <= end && !(seconds(spans[i + 1]?.start) < end)) result.add(minute);
    }
    return result;
  }
  function plotFrameSeries(series, sparse) {
    if (series.unit !== 'FPS') return series;
    // 晚到的零星出帧留给指读。后面整分钟无样本时，不把它接到前一段的每分钟曲线上。
    const points = series.points.map((point, i, all) => {
      const [t, value] = point, previous = all[i - 1], next = all[i + 1];
      const gap = !finite(next?.[1]) || next[0] - t > FRAME_MINUTE_SECONDS;
      return sparse.has(t) && finite(value) && finite(previous?.[1]) && t - previous[0] <= FRAME_MINUTE_SECONDS && gap ? [t, null] : point;
    });
    return { ...series, points: points.slice(0, points.findLastIndex(([, value]) => finite(value)) + 1),
      read_points: series.read_points ?? { points: series.points } };
  }
  LiveDetail.mount({ resource: 'computer/smooth', board: detailBoard, merge: () => framePack,
    statusData: d => ({ level: stutterLevel(d) }),
    statusNotes: false,
    extraLinks: '<a class="more more--link" href="#how-measured">怎么量的 <span class="more__chev">↓</span></a>',
    render(d) {
      data = d;
      framePack = LiveDetail.merge(d, ['fps', 'frametime', 'jitter']);
      const bounds = [d?.fps, d?.frametime, d?.jitter].find(p => p?.series?.some(measured));
      if (bounds) { framePack.from = bounds.from; framePack.to = bounds.to; }
      const sparse = sparseFrameMinutes(data?.fps?.sources || []);
      framePack.series = framePack.series.filter(s => frameIds.has(s.id) && measured(s))
        .map(s => ({ ...plotFrameSeries(s, sparse), from: framePack.from, to: framePack.to }));
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
