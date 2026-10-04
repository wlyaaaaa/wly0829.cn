/* Pure presentation of the status reader's public snapshot. No reads or timers. */
(function (scope) {
  'use strict';
  const hardwareIconFiles = {cpu:'/assets/live-hardware/cpu.webp',gpu:'/assets/live-hardware/gpu.webp',storage:'/assets/live-hardware/storage.webp',network:'/assets/live-hardware/network.webp',display:'/assets/live-hardware/display.webp'};
  const unavailable = new Set(['unknown', 'unavailable', 'error', 'failed']);
  const staticFields = new Set(['model', 'cores', 'threads', 'type', 'manufacturer', 'data_rate_mt_s', 'module_count', 'module_capacity_bytes', 'installed_bytes', 'total_bytes', 'vram_total_bytes', 'letter', 'filesystem', 'physical_disks', 'connection_type']);
  const aliases = { temperature_celsius: 'temperature_c', power_watts: 'power_w', vram_used_bytes: 'memory_used_bytes', vram_total_bytes: 'memory_total_bytes', letter: 'drive', total_bytes: 'usable_total_bytes', installed_bytes: 'installed_total_bytes' };
  const unwrap = value => value && typeof value === 'object' && Object.hasOwn(value, 'value') ? value.value : value;
  const stamp = value => typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : typeof value === 'string' && Number.isFinite(Date.parse(value)) ? Date.parse(value) / 1000 : null;
  const number = value => typeof value === 'number' && Number.isFinite(value) ? value : null;
  const format = (value, digits = 1) => value.toLocaleString('zh-CN', { maximumFractionDigits: digits });
  const beijing = value => value ? new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(new Date(value * 1000)) + ' 北京时间' : '读取时间未知';

  function groupTimes(row = {}) {
    row = row || {};
    const fields = new Map(Object.entries(row.sources || {}).map(([field, source]) => [field, source]));
    for (const [field, item] of Object.entries(row)) if (item && typeof item === 'object' && Object.hasOwn(item, 'value')) fields.set(field, item);
    const times = [...fields].filter(([field]) => !staticFields.has(field)).map(([, item]) => stamp(item.observed_at_unix)).filter(Boolean);
    const own = stamp(row.observed_at_unix);
    return times.length ? times : own ? [own] : [];
  }
  function observedAt(status, fallback) {
    const hardware = status?.hardware || {}, collector = status?.display_cache?.collectors?.hardware;
    const declared = stamp(status?.hardware_observed_at_unix) || stamp(hardware.observed_at_unix) || stamp(collector?.observed_at_unix);
    const times = [hardware.cpu, ...(Array.isArray(hardware.gpus) ? hardware.gpus : []), hardware.memory, hardware.network, hardware.display, ...(Array.isArray(hardware.volumes) ? hardware.volumes : [])].flatMap(group => groupTimes(group));
    return declared || (times.length ? Math.max(...times) : null) || stamp(fallback);
  }

  function metric(row, field, context) {
    row = row || {};
    const key = Object.hasOwn(row, field) ? field : aliases[field];
    const item = key ? row[key] : undefined;
    const source = row.sources?.[field] || row.sources?.[key] || {};
    const wrapped = item && typeof item === 'object' && Object.hasOwn(item, 'value') ? item : {};
    const value = unwrap(item), states = [wrapped.state, wrapped.status, source.status, source.state];
    const at = stamp(wrapped.observed_at_unix ?? source.observed_at_unix ?? row.observed_at_unix);
    const maxAge = number(row.max_age_seconds) || context.maxAge;
    const dynamicOld = !staticFields.has(field) && at && (at > context.now + 60 || context.now - at > maxAge);
    const missing = value === null || value === undefined || value === '' || typeof value === 'number' && !Number.isFinite(value);
    const hasOwnEvidence = wrapped.state || wrapped.status || source.status || source.state;
    const state = missing || context.unavailable || unavailable.has(row.state) || states.some(state => unavailable.has(state)) ? 'unknown'
      : context.cached || context.old || states.includes('stale') || !hasOwnEvidence && row.state === 'stale' || dynamicOld ? 'stale' : 'ok';
    return { value: state === 'unknown' ? null : value, state, at, source: wrapped.source || source.source };
  }
  const numeric = item => item.value !== null ? number(item.value) : null;
  const label = (item, unit = '', digits = 1) => item.value === null ? '读不到' : typeof item.value === 'number' ? format(item.value, digits) + unit : String(item.value) + unit;
  const capacity = item => { const value = numeric(item); return value === null ? '读不到' : value >= 1024 ** 4 ? format(value / 1024 ** 4, 2) + ' TiB' : format(value / 1024 ** 3, 1) + ' GiB'; };
  const rate = item => { const value = numeric(item); return value === null ? '读不到' : value >= 1024 ** 2 ? format(value / 1024 ** 2, 2) + ' MiB/s' : format(value / 1024, 1) + ' KiB/s'; };
  function ratio(used, total) {
    const a = numeric(used), b = numeric(total);
    return { value: a !== null && a >= 0 && b > 0 ? Math.min(100, Math.max(0, a / b * 100)) : null,
      state: used.state === 'unknown' || total.state === 'unknown' ? 'unknown' : used.state === 'stale' || total.state === 'stale' ? 'stale' : 'ok', at: used.at || total.at };
  }
  function model(status, options = {}) {
    const now = number(options.now) || Date.now() / 1000;
    const at = observedAt(status, options.at);
    const maxAge = number(status?.max_age_seconds) || 120;
    const old = !!at && (at > now + 60 || now - at > maxAge);
    const hardware = status?.hardware || {};
    const collectionState = hardware.collection_state || status?.display_cache?.collectors?.hardware?.state;
    const context = { now, at, maxAge, cached: !!options.cached || !!options.hardwareCached || collectionState === 'error', old, collectionState, unavailable: unavailable.has(hardware.state) };
    const get = (row, field) => metric(row, field, context);
    const cpu = hardware.cpu || {}, memory = hardware.memory || {}, network = hardware.network || {}, display = hardware.display || {};
    const cpuUsage = get(cpu, 'usage_percent');
    const memUsed = get(memory, 'used_bytes'), memTotal = get(memory, 'total_bytes');
    const gpus = (Array.isArray(hardware.gpus) && hardware.gpus.length ? hardware.gpus : [{}]).map((row, index) => ({ key: 'gpu-' + index, row, usage: get(row, 'usage_percent'), used: get(row, 'vram_used_bytes'), total: get(row, 'vram_total_bytes') }));
    const disks = (Array.isArray(hardware.volumes) ? hardware.volumes : []).map((row, index) => {
      const free = get(row, 'free_bytes'), total = get(row, 'total_bytes'), remaining = ratio(free, total);
      const connected = unwrap(row.connected) !== false && row.state !== 'disconnected';
      return { row, key: 'disk-' + (unwrap(row.letter) || unwrap(row.drive) || index), name: label(get(row, 'letter')), free, total, remaining, connected,
        risk: connected && remaining.value !== null ? remaining.value < 5 ? 'error' : remaining.value < 10 ? 'warn' : 'ok' : 'unknown' };
    });
    const tightest = disks.filter(disk => disk.connected && disk.remaining.value !== null).sort((a, b) => a.remaining.value - b.remaining.value)[0];
    const screen = metric(status?.host, 'screen_state', { ...context, cached: !!options.cached, old: false, unavailable: false });
    const served = stamp(status?.served_at_unix);
    const online = !!status && !options.cached && (served ? served <= now + 60 && now - served <= maxAge : options.online === true || !!at && !old);
    return { context, hardware, get, cpu, cpuUsage, memory, memUsed, memTotal, memUsage: ratio(memUsed, memTotal), gpus, disks, tightest, network, display, screen, online };
  }

  function render(doc, status, options = {}) {
    if (!doc?.createElement) throw new TypeError('LiveHardwareUI.render requires a document');
    const compact = options.mode === 'compact', m = model(status, options), { context: c, get } = m;
    function el(tag, className, text, key) {
      const node = doc.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined && text !== null) node.textContent = text;
      if (key) node.dataset.rowKey = key;
      return node;
    }
    function reading(tag, className, item, text, field) {
      const node = el(tag, className, text, field);
      node.dataset.field = field; node.dataset.state = item.state;
      if (item.state === 'stale') {
        node.title = '上次读到：' + beijing(item.at || c.at);
        if (!c.cached && !c.old) node.append(el('small', 'live-hardware-field-age', '（上次 ' + beijing(item.at) + '）', field + '-age'));
      }
      else if (item.source) node.title = item.source + (item.at ? ' · ' + beijing(item.at) : '');
      if (numeric(item) !== null) { node.dataset.role = 'num'; node.dataset.motionText = 'number'; }
      return node;
    }
    function meter(item, name, key, risk) {
      const track = el('div', 'live-hardware-meter', null, key);
      track.dataset.state = item.state; if (risk) track.dataset.risk = risk;
      const value = numeric(item);
      track.setAttribute('aria-label', name + '：' + (value === null ? '读不到' : format(value) + '%') + (item.state === 'stale' ? '，上次读到的数据' : ''));
      if (value !== null) { track.setAttribute('role', 'meter'); track.setAttribute('aria-valuemin', '0'); track.setAttribute('aria-valuemax', '100'); track.setAttribute('aria-valuenow', String(value)); }
      else track.setAttribute('role', 'img');
      const fill = el('span', 'live-hardware-meter-fill', null, key + '-fill');
      fill.style.width = value === null ? '0%' : Math.max(0, Math.min(100, value)) + '%'; track.append(fill);
      return track;
    }
    function pair(labelText, item, text, key) {
      const row = el('div', 'live-hardware-pair', null, key);
      row.append(el('dt', '', labelText, key + '-label'), reading('dd', '', item, text, key + '-value'));
      return row;
    }
    function details(rows, key) {
      const node = el('details', 'live-hardware-details', null, key);
      node.append(el('summary', '', '读数与来源', key + '-summary'));
      const list = el('dl', '', null, key + '-list');
      for (const [text, item, value, field] of rows) list.append(pair(text, item, value, key + '-' + field));
      const sources = [...new Set(rows.map(([, item]) => item.source).filter(Boolean))];
      const source = el('p', 'live-hardware-source-note', sources.length ? '来源：' + sources.join('；') : '读取来源读不到', key + '-source');
      node.append(list, source); return node;
    }
    function card(title, key, icon) {
      const node = el('section', 'live-hardware-card', null, key);
      const heading = el('div', 'live-hardware-card-heading', null, key + '-heading');
      if (icon) { const img = el('img', 'live-hardware-icon', null, key + '-icon'); img.src = options.assetBase ? options.assetBase + icon + '.webp' : hardwareIconFiles[icon]; img.alt = ''; img.width = 44; img.height = 44; heading.append(img); }
      heading.append(el('h3', '', title, key + '-title')); node.append(heading); return node;
    }
    function cardTime(node, row, key) {
      const times = groupTimes(row), at = times.length ? Math.max(...times) : null;
      const stale = c.cached || c.old || at && (at > c.now + 60 || c.now - at > c.maxAge);
      node.append(el('p', 'live-hardware-card-time', at ? (stale ? '上次读到 ' : '读取于 ') + beijing(at) : '本项读取时间未知', key + '-read-time'));
    }
    function top(root) {
      const header = el('div', 'live-hardware-header', null, 'hardware-header');
      const current = el('div', 'live-hardware-current', null, 'hardware-current');
      const dot = el('span', 'live-hardware-dot', null, 'hardware-dot'); dot.dataset.state = m.online ? 'ok' : 'unknown'; dot.setAttribute('aria-hidden', 'true');
      current.append(dot, el('strong', '', m.online ? '电脑在线' : '电脑当前读不到', 'hardware-online'));
      const screenText = { locked: 'Windows 已锁屏', unlocked: 'Windows 未锁屏', no_session: 'Windows 无交互桌面' }[m.screen.value] || 'Windows 锁屏状态读不到';
      current.append(reading('span', 'live-hardware-screen-state', m.screen, screenText, 'hardware-screen-state'));
      const stale = c.cached || c.old || m.hardware.state === 'stale';
      header.append(current, el('p', 'live-hardware-read-time', c.at ? (stale ? '上次读到 ' : '读取于 ') + beijing(c.at) : '读取时间未知', 'hardware-read-time'));
      root.append(header);
      if (stale) root.append(el('p', 'live-hardware-cache-notice', '保留上次读数，当前状态尚未确认。', 'hardware-cache-notice'));
      else if (c.collectionState === 'reading' || c.collectionState === 'refreshing') root.append(el('p', 'live-hardware-collection-notice', c.at ? '硬件正在更新，保留已读到的数值。' : '正在读取硬件。', 'hardware-collection-notice'));
      else if (unavailable.has(m.hardware.state) || !status?.hardware) root.append(el('p', 'live-hardware-cache-notice', '暂时无法读取这台电脑的硬件状态。', 'hardware-missing-notice'));
    }
    const root = el(compact ? 'a' : 'div', 'live-hardware-' + (compact ? 'compact' : 'full'), null, 'live-hardware-' + (compact ? 'compact' : 'full'));
    root.dataset.liveHardware = compact ? 'compact' : 'full'; root.dataset.cached = String(c.cached || c.old); top(root);
    if (compact) {
      root.href = '/cockpit/#pc'; root.setAttribute('aria-label', '电脑现在，查看完整硬件状态');
      const grid = el('div', 'live-hardware-compact-grid', null, 'compact-grid');
      function tile(name, item, value, key, risk) {
        const cell = el('div', 'live-hardware-compact-tile', null, key); if (risk) cell.dataset.risk = risk;
        cell.append(el('span', 'live-hardware-compact-label', name, key + '-label'), reading('strong', '', item, value, key + '-value')); grid.append(cell);
      }
      tile('CPU', m.cpuUsage, label(m.cpuUsage, '%'), 'compact-cpu');
      for (const gpu of m.gpus) tile(m.gpus.length > 1 ? 'GPU ' + (m.gpus.indexOf(gpu) + 1) : 'GPU', gpu.usage, label(gpu.usage, '%'), 'compact-' + gpu.key);
      tile('内存', m.memUsage, label(m.memUsage, '%'), 'compact-memory');
      const disk = m.tightest;
      tile(disk ? disk.name + ' 剩余' : '磁盘剩余', disk?.remaining || { value: null, state: 'unknown' }, disk ? label(disk.remaining, '%') : '读不到', 'compact-disk', disk?.risk);
      root.append(grid, el('span', 'live-hardware-compact-link', '查看完整电脑状态 →', 'compact-link')); return root;
    }

    const grid = el('div', 'live-hardware-grid', null, 'hardware-grid');
    function computeCard(title, key, icon, row, usage, extra) {
      const node = card(title, key, icon);
      node.append(reading('p', 'live-hardware-model', get(row, 'model'), label(get(row, 'model')), key + '-model'));
      const main = el('div', 'live-hardware-main', null, key + '-main');
      main.append(reading('strong', 'live-hardware-number num', usage, label(usage, '%'), key + '-usage'), el('span', 'live-hardware-main-label', '占用', key + '-usage-label'));
      node.append(main, meter(usage, title + '占用', key + '-meter'));
      const metrics = el('dl', 'live-hardware-metrics', null, key + '-metrics');
      const temperature = get(row, 'temperature_celsius'), power = get(row, 'power_watts');
      metrics.append(pair('温度', temperature, label(temperature, ' ℃'), key + '-temperature'), pair('功耗', power, label(power, ' W'), key + '-power'));
      if (extra) metrics.append(extra); node.append(metrics);
      const frequency = get(row, 'frequency_mhz'), voltage = get(row, 'voltage_v');
      node.append(details([['频率', frequency, label(frequency, ' MHz', 0), 'frequency'], ['电压', voltage, label(voltage, ' V', 3), 'voltage'], ['读取时刻', usage, beijing(usage.at || c.at), 'time']], key + '-details'));
      cardTime(node, row, key);
      return node;
    }
    grid.append(computeCard('处理器', 'cpu', 'cpu', m.cpu, m.cpuUsage, pair('核心 / 线程', get(m.cpu, 'cores'), label(get(m.cpu, 'cores'), '', 0) + ' / ' + label(get(m.cpu, 'threads'), '', 0), 'cpu-cores')));
    for (const gpu of m.gpus) {
      const vram = pair('显存', gpu.used, capacity(gpu.used) + ' / ' + capacity(gpu.total), gpu.key + '-vram');
      vram.append(meter(ratio(gpu.used, gpu.total), '显存占用', gpu.key + '-vram-meter'));
      grid.append(computeCard(m.gpus.length > 1 ? '显卡 ' + (m.gpus.indexOf(gpu) + 1) : '显卡', gpu.key, 'gpu', gpu.row, gpu.usage, vram));
    }
    const mem = card('内存', 'memory', null), type = get(m.memory, 'type'), speed = get(m.memory, 'data_rate_mt_s');
    mem.append(reading('p', 'live-hardware-model', type, label(type) + (numeric(speed) !== null ? ' · ' + label(speed, ' MT/s', 0) : ''), 'memory-model'));
    const memMain = el('div', 'live-hardware-main', null, 'memory-main'); memMain.append(reading('strong', 'live-hardware-number num', m.memUsage, label(m.memUsage, '%'), 'memory-usage'), el('span', 'live-hardware-main-label', '占用', 'memory-usage-label'));
    mem.append(memMain, meter(m.memUsage, '内存占用', 'memory-meter'));
    const memMetrics = el('dl', 'live-hardware-metrics', null, 'memory-metrics');
    memMetrics.append(pair('已用', m.memUsed, capacity(m.memUsed), 'memory-used'), pair('可用总量', m.memTotal, capacity(m.memTotal), 'memory-total'));
    mem.append(memMetrics);
    mem.append(details([['已安装', get(m.memory, 'installed_bytes'), capacity(get(m.memory, 'installed_bytes')), 'installed'], ['剩余', get(m.memory, 'available_bytes'), capacity(get(m.memory, 'available_bytes')), 'available'], ['已提交 / 上限', get(m.memory, 'committed_bytes'), capacity(get(m.memory, 'committed_bytes')) + ' / ' + capacity(get(m.memory, 'commit_limit_bytes')), 'committed'], ['读取时刻', m.memUsed, beijing(m.memUsed.at || c.at), 'time']], 'memory-details'));
    cardTime(mem, m.memory, 'memory');
    grid.append(mem); root.append(grid);

    const storage = card('存储空间', 'storage', 'storage'), disks = el('div', 'live-hardware-disks', null, 'disk-list');
    if (!m.disks.length) disks.append(el('p', 'live-hardware-empty', '磁盘列表读不到', 'disk-empty'));
    for (const disk of m.disks) {
      const row = el('div', 'live-hardware-disk', null, disk.key); row.dataset.risk = disk.risk;
      const heading = el('div', 'live-hardware-disk-heading', null, disk.key + '-heading');
      const type = unwrap(disk.row.type ?? disk.row.kind);
      heading.append(el('strong', '', disk.name, disk.key + '-name'), el('span', 'live-hardware-disk-type', { ramdisk: '内存盘', virtual: '虚拟盘', ssd: '固态盘', hdd: '机械盘' }[type] || '磁盘', disk.key + '-type'));
      heading.append(reading('strong', 'live-hardware-disk-percent', disk.remaining, disk.connected ? label(disk.remaining, '%') + ' 剩余' : '没接上', disk.key + '-remaining'));
      row.append(heading);
      if (disk.connected) {
        row.append(reading('p', 'live-hardware-disk-capacity', disk.free, '剩余 ' + capacity(disk.free) + ' / 共 ' + capacity(disk.total), disk.key + '-capacity'), meter(disk.remaining, disk.name + '剩余空间', disk.key + '-meter', disk.risk));
        if (disk.risk !== 'ok' && disk.risk !== 'unknown') row.append(el('p', 'live-hardware-disk-warning', disk.risk === 'error' ? '剩余不足 5%，请尽快腾空间' : '剩余不足 10%，需要留意', disk.key + '-warning'));
      }
      disks.append(row);
      cardTime(row, disk.row, disk.key);
    }
    storage.append(disks); root.append(storage);

    const secondary = el('div', 'live-hardware-secondary-grid', null, 'hardware-secondary');
    const network = card('网络', 'network', 'network'), connection = get(m.network, 'connection_type'), linkSpeed = get(m.network, 'link_speed_bps');
    const link = numeric(linkSpeed), connectionText = { ethernet: '有线以太网', wifi: '无线 Wi-Fi', physical: '物理网络' }[connection.value] || '连接类型读不到';
    network.append(reading('p', 'live-hardware-model', get(m.network, 'model'), label(get(m.network, 'model')), 'network-model'), reading('p', 'live-hardware-network-link', linkSpeed, connectionText + ' · ' + (link !== null ? format(link / (link >= 1e9 ? 1e9 : 1e6), 2) + (link >= 1e9 ? ' Gbps' : ' Mbps') : '速率读不到'), 'network-link'));
    const networkMetrics = el('dl', 'live-hardware-metrics', null, 'network-metrics');
    networkMetrics.append(pair('↓ 下载', get(m.network, 'download_bytes_per_second'), rate(get(m.network, 'download_bytes_per_second')), 'network-download'), pair('↑ 上传', get(m.network, 'upload_bytes_per_second'), rate(get(m.network, 'upload_bytes_per_second')), 'network-upload')); network.append(networkMetrics);
    network.append(details([['延迟', get(m.network, 'latency_ms'), label(get(m.network, 'latency_ms'), ' ms'), 'latency'], ['抖动', get(m.network, 'jitter_ms'), label(get(m.network, 'jitter_ms'), ' ms'), 'jitter'], ['丢包', get(m.network, 'packet_loss_percent'), label(get(m.network, 'packet_loss_percent'), '%'), 'loss'], ['读取时刻', get(m.network, 'download_bytes_per_second'), beijing(get(m.network, 'download_bytes_per_second').at || c.at), 'time']], 'network-details'));
    cardTime(network, m.network, 'network');
    const screen = card('屏幕', 'display', 'display'), width = get(m.display, 'width_px'), height = get(m.display, 'height_px'), refresh = get(m.display, 'refresh_hz');
    const resolution = (numeric(width) === null ? '读不到' : String(numeric(width))) + ' × ' + (numeric(height) === null ? '读不到' : String(numeric(height)));
    screen.append(reading('p', 'live-hardware-model', get(m.display, 'model'), label(get(m.display, 'model')), 'display-model'), reading('strong', 'live-hardware-resolution num', width, resolution, 'display-resolution'));
    const screenMetrics = el('dl', 'live-hardware-metrics', null, 'display-metrics'); screenMetrics.append(pair('刷新率', refresh, label(refresh, ' Hz'), 'display-refresh')); screen.append(screenMetrics);
    cardTime(screen, m.display, 'display');
    secondary.append(network, screen); root.append(secondary);
    if(status?.host){
      const system=el('details','live-hardware-details',null,'system-info');system.append(el('summary','','系统信息','system-info-title'));
      const host=status.host,items=[host.windows_version||'Windows版本读不到',Number.isFinite(host.boot_time_unix)?'本次开机：'+beijing(host.boot_time_unix):'开机时间读不到',Number.isFinite(host.uptime_seconds)?'已开机 '+format(host.uptime_seconds/3600,1)+' 小时':'开机时长读不到'];
      for(let i=0;i<items.length;i++)system.append(el('p','live-hardware-source-note',items[i],'system-info-'+i));root.append(system);
    }
    return root;
  }
  scope.LiveHardwareUI = Object.freeze({ render, observedAt });
})(typeof window !== 'undefined' ? window : globalThis);
