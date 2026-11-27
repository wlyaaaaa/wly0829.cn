// 实况第二层：电脑（样板：数据多的页“一组一行，点开成章”）。
// 页头：一幅打开的玻璃机箱，读数标签直接标在画上；第一句下面“几组里几组要留意”、各自一句原因、设备三颗小药丸。
// 组的级别只认 /computer 的 groups；没给级别就只列读数。
// 数只从 Live 来；null 写“还没读到”，不当 0。
(() => {
  'use strict';
  const U = window.LiveUI;
  const Light = window.LiveLight;
  const Chart = window.LiveChart;
  const V = window.LiveViz;
  const Stat = window.ComputerStat;
  const { esc, sp } = U;
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const offline = () => !!U.offline?.();
  const missing = () => offline() ? '这块没存下来，连上后补上。' : U.collectionText();
  const publicationRevoked = meta => meta?.status === 503 && meta.withdrawn;
  const publicationNote = name => `${U.fieldText(name) || '这块'}正在更新访客版，稍后自动补上。`;
  const daysText = n => n < 1 ? '不到 1 天' : n < 365 ? `${Math.round(n)} 天` : `${Math.round(n / 365)} 年`;
  const fullText = n => n == null ? '' : `${n < 1 ? '' : '约 '}${daysText(n)}满`;
  // “约 N 天满”按后台给的日均增速算；写明按多快算的，免得和存储页的一周涨幅对不上还看不出为什么。
  const fullBasis = m => {
    const f = m?.forecast, rate = f?.daily_growth_bytes, days = (Date.parse(f?.to) - Date.parse(f?.from)) / 864e5;
    return Number.isFinite(rate) && rate > 0 ? `按${days > 1 ? `近 ${Math.round(days)} 天` : ''}平均每天多用 ${Chart.value(rate / 2 ** 30, 'GB')} 算` : '';
  };
  const route = (path) => path + (params.has('fixture') ? `${path.includes('?') ? '&' : '?'}fixture=${encodeURIComponent(params.get('fixture'))}` : '');

  const hero = $('hero');
  const part = (name) => hero.querySelector(`[data-part="${name}"]`) || document.querySelector(`[data-part="${name}"]`);
  const notices = $('notices');
  Light.add(hero);
  function showUnread(card, name, failed, message = `${name}暂时读不到`) {
    if (!card) return;
    card.classList.toggle('is-unread', failed);
    let say = card.querySelector('[data-unread]');
    if (failed && !say) { say = document.createElement('p'); say.dataset.unread = ''; say.className = 'computer-chart-end'; card.querySelector('.card__body').append(say); }
    if (say) { say.hidden = !failed; say.textContent = failed ? message : ''; }
  }
  function stabilityDetails(d) {
    const kinds = { bugcheck: '蓝屏', unexpected_power_loss: '非正常关机', whea_corrected: '硬件纠错', whea_fatal: '致命硬件错误', disk_error: '磁盘错误', clean_restart: '正常重启或关机' };
    const stamp = at => at && typeof at === 'object' ? U.fieldHtml(at, { name: '事件时间' }) : at ? `${U.date(at)} ${U.time(at)}` : '';
    const rows = ['clean_restart'].map(key => `<div><dt>${kinds[key]}</dt><dd>${d?.counts?.[key] == null ? `<span class="vz-none">${missing()}</span>` : U.fieldHtml(typeof d.counts[key] === 'object' ? d.counts[key] : Stat.text(d.counts[key], '', d.counts, key), { name: kinds[key] })}</dd></div>`).join('');
    const recent = (d?.events || d?.recent)?.filter(r => r.kind !== 'clean_restart').sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
    // 同一分钟里一模一样的记录合成一行写“× 次数”，和上面时间带的合点一致。
    const merged = list => list.reduce((out, r) => {
      const key = typeof r.text === 'object' || typeof r.at === 'object' ? null : `${r.kind}|${sp(r.text || '')}|${stamp(r.at)}`, last = out.at(-1);
      if (key && last?.key === key) last.times++; else out.push({ ...r, key, times: 1 });
      return out;
    }, []);
    const list = rows => `<ul class="rows stability-events">${U.mergePrivateRows(rows, { value: r => r.text, kind: netViewer }).map(r => r.private_count ? `<li class="row">${U.privateSummary(r.private_count, { unit: '条' })}</li>` : `<li class="row"><div class="row__text"><p class="row__main">${U.fieldHtml(typeof r.text === 'object' ? r.text : sp(r.text || kinds[r.kind] || '').replaceAll('磁盘错误记录', '磁盘错误'), { name: '异常事件' })}${r.times > 1 ? ` <span class="stability-times">× ${r.times}</span>` : ''}</p><p class="row__sub"><time>${stamp(r.at)}</time></p></div></li>`).join('')}</ul>`;
    const note = U.olderNote?.(d?.at, d);
    const shown = recent ? merged(recent) : [], rest = shown.slice(5).reduce((n, r) => n + (r.times || 1), 0);
    return `${window.LiveEvents.render(d)}${note ? `<p class="row__sub">${U.fieldHtml(note, { name: '读数时间' })}</p>` : ''}<dl class="stability-counts">${rows}</dl>${window.DisplayRecovery?.html() || ''}
      ${Stat.gap(d.counts, 'clean_restart') ? `<p class="row__sub">${U.fieldHtml(Stat.gap(d.counts, 'clean_restart'), { name: '正常重启或关机' })}</p>` : ''}<p class="l2-part">异常事件${recent ? ` · ${U.fieldHtml(Stat.text(recent.length, '条', d, 'events_count'), { name: '事件数量' })}` : ''}</p>${recent == null ? `<p class="row__sub">${missing()}</p>` : recent.length ? list(shown.slice(0, 5)) + (shown.length > 5 ? `<details class="vz-more"><summary class="more"><span class="stability-more">展开（还有 ${rest} 条）</span><span class="stability-less">收起</span> <span class="more__chev">›</span></summary>${list(shown.slice(5))}</details>` : '') : '<p class="row__sub">近 30 天没有异常记录</p>'}`;
  }
  let stabilityWatch = null, stabilityDetail = null, stabilityEl = null;
  const stabilityHost = $('stability-title').closest('section');
  stabilityHost.replaceChildren();
  stabilityHost.removeAttribute('aria-labelledby');
  const stabilityBoard = V.board(stabilityHost, { key: 'computer-stability' });
  function renderStability() {
    const s = computer?.stability;
    stabilityBoard.data({ series: [] });
    const counts = [...sp(s?.text).matchAll(/(蓝屏|非正常关机|硬件纠错|致命硬件错误|磁盘错误(?:记录)?)\s*(\d+)\s*次/g)].map(m => `${m[1].replace('磁盘错误记录', '磁盘错误')} ${m[2]} 次`);
    if (stabilityDetail?.counts?.disk_error != null && !counts.some(x => x.startsWith('磁盘错误'))) counts.push(`磁盘错误 ${Stat.text(stabilityDetail.counts.disk_error, '次', stabilityDetail.counts, 'disk_error')}`);
    const stabilityRange = stabilityDetail?.q === 'partial' || s?.q === 'partial' ? '近 30 天内已保留的日志' : '近 30 天';
    stabilityBoard.set([{ ...(stabilityDetail || s), level: undefined, key: 'stability', name: '台式机稳不稳', line: counts.length ? `${stabilityRange}：${counts.join('、')}` : s?.text || missing(), palette: ['teal', 'violet'],
      figures: [], build(el) {
        stabilityEl = el;
        return { set() {
        const href = computer?.stability?.href;
        if (stabilityWatch) return;
        // 电脑连不上又没存下来：卡顶那行已经写了“这块没存下来”，下面不再写第二遍（r83 返修）
        if (!href) { el.textContent = offline() && !computer?.stability ? '' : missing(); return; }
        const read = U.reading(el, { ghost: U.ghost.rows(3), name: '台式机稳不稳' });
        // 先占位再订阅：浏览器里存过这份数时 Live.watch 会当场回调 data，data 里又 renderStability → set()，不占位会重复订阅、无限递归
        stabilityWatch = true;
        stabilityWatch = window.Live.watch(href.replace(/^.*\/live\/v1\//, '').replace(/^\/__live\//, ''), null, {
          data(d) { stabilityDetail = d; U.html(el, stabilityDetails(d)); read.done(); renderStability(); }, phase(st) { if (st.data == null) { if (st.offline) { read.done(false); el.textContent = computer?.stability ? missing() : ''; } else read.set(st); } },
          link(st) { if (st.data == null && st.phase === 'none') { el.textContent = missing(); read.done(); } U.blockNote(el, st); },
        }); } };
      } }]);
    showUnread(stabilityBoard.cards()[0], '台式机稳不稳', !offline() && stateDone && !s && !stabilityDetail,
      mainRevoked ? publicationNote('台式机稳不稳') : undefined);
  }
  for (const a of document.querySelectorAll('.stage a[href^="/live/"]')) a.href = route(a.getAttribute('href'));

  const SUBPAGES = [['/live/storage/', '存储'], ['/live/traffic/', '海外流量'], ['/live/power/', '用电'], ['/live/smooth/', '卡顿与流畅'], ['/live/apps/', '谁在占'], ['/live/usage/', '使用时间'], ['/live/security/', '安全'], ['/live/environment/', '软件与环境']];
  part('grafana').insertAdjacentHTML('beforebegin', SUBPAGES.map(([path, label]) => `<a href="${esc(route(path))}">${esc(label)} ›</a>`).join(''));

  // “‹ 实况”：从第一层点进来的，退回去（第一层记着原来滚到哪）；别处来的直接去第一层
  document.querySelector('[data-back]').addEventListener('click', U.restoreBack);

  // ================= 各组：名字、画、颜色、收着时的大数字、展开后的大图和小格 =================
  // series 按 id 取（/computer/charts）；group 是接口 series.group 的名字（Grafana 地址也按它找）。
  const sync = Chart.sync();
  const SERIES_HUE = { 'disk-read': 'blue', 'disk-write': 'apricot', download: 'teal', upload: 'pink' };
  const L = (id, label) => ({ id, label, hue: SERIES_HUE[id] });
  const GROUPS = [
    { key: 'cpu', group: 'CPU 和显卡', name: 'CPU 和显卡', pic: '/live/img/grp-cpu.webp', palette: ['teal', 'violet'],
      figures: [{ key: 'cpu', label: 'CPU', line: 'cpu', ceil: 100 }, { key: 'gpu', label: '显卡', line: 'gpu', ceil: 100 }, { key: 'clock', label: 'CPU 频率', line: 'cpu-clock' }, { key: 'power', label: 'CPU 功率', line: 'cpu-power' }],
      chips: [
        { key: 'use', label: 'CPU 和显卡占用', lines: [L('cpu', 'CPU'), L('gpu', '显卡')], ceil: 100 },
        { key: 'ccd', label: '两组核心负载', lines: [L('ccd0', '核心组 1'), L('ccd1', '核心组 2')], ceil: 100 },
        { key: 'clock', label: 'CPU 频率', lines: [L('cpu-clock', 'CPU 频率')], floor: 'auto' },
        { key: 'gclock', label: '显卡时钟', lines: [L('gpu-core-clock', '核心'), L('gpu-mem-clock', '显存')], floor: 'auto' },
        { key: 'power', label: '功率', lines: [L('cpu-power', 'CPU'), L('gpu-power', '显卡')] },
        { key: 'bw', label: '显卡 PCIe 带宽占用', lines: [L('gpu-bandwidth', 'PCIe 带宽')], ceil: 100 },
        { key: 'volt', label: '核心电压', lines: [L('cpu-vcore', 'CPU'), L('gpu-vcore', '显卡')], floor: 'auto' },
      ],
      line: (s) => { const c = sumOf(s, 'cpu'), g = sumOf(s, 'gpu'); return c ? `${c.avg < 20 ? '一天都很闲' : c.avg < 50 ? '有忙有闲' : '一直挺忙'}，最忙是 ${clock(c.maxAt)}，CPU 到过 ${Chart.value(c.max, '%')}${g ? `、显卡 ${Chart.value(g.max, '%')}` : ''}` : ''; },
      build: throttle },
    { key: 'memory', group: '内存', name: '内存', pic: '/live/img/grp-memory.webp', palette: ['violet', 'blue'],
      figures: [{ key: 'used', label: '内存已用容量', line: 'memory' }, { key: 'press', label: '物理内存占用率', line: 'mem-pressure', ceil: 100 }, { key: 'vram', label: '整卡显存已用', line: 'gpu-memory' }],
      chips: [
        { key: 'used', label: '内存已用容量', lines: [L('memory', '内存已用容量')] },
        { key: 'commit', label: '提交内存', lines: [L('memory-commit', '提交内存')] },
        { key: 'press', label: '物理内存占用率', lines: [L('mem-pressure', '物理内存占用率')], ceil: 100 },
        { key: 'swap', label: '页面文件占用', lines: [L('memory-swap', '页面文件占用')], ceil: 100 },
        { key: 'paging', label: '换页', lines: [L('mem-paging', '换页')] },
        { key: 'vram', label: '显存总占用', lines: [L('gpu-memory', '显存')] },
      ] },
    { key: 'disk', group: '磁盘', name: '磁盘', pic: '/live/img/grp-disk.webp', palette: ['blue', 'apricot'], titleFirst: true, readHeight: 293,
      figures: [{ key: 'read', label: '读', line: 'disk-read' }, { key: 'write', label: '写', line: 'disk-write' }, { key: 'iops', label: '每秒读写次数', line: 'disk-iops' }, { key: 'free', label: '最紧的盘剩', line: 'disk-free' }],
      chips: [
        { key: 'rw', label: '读写', lines: [L('disk-read', '读'), L('disk-write', '写')] },
        { key: 'free', label: '最紧的盘剩余', lines: [L('disk-free', '最紧的盘剩余')], floor: 'auto' },
        { key: 'busy', label: '最忙磁盘的忙碌率', lines: [L('disk', '最忙磁盘的忙碌率')], ceil: 100 },
        { key: 'iops', label: '每秒读写次数', lines: [L('disk-iops', '每秒读写次数')] },
        { key: 'lat', label: '最高响应延迟', lines: [L('disk-latency', '最高响应延迟')] },
      ],
      hero: (lv) => (['yellow', 'red'].includes(lv) && series('disk-free')?.points?.some(p => p[1] != null) ? 'free' : 'rw'),
      line: (s) => { const r = sumOf(s, 'disk-read'), l = sumOf(s, 'disk-latency'); return r ? `${r.avg < 20 * 2 ** 20 ? '读写很少' : '读写不少'}，最忙是 ${clock(r.maxAt)}，读到 ${Chart.value(r.max, 'B/s')}${l ? `，响应最慢 ${Chart.value(l.max, 'ms')}` : ''}` : ''; } },
    { key: 'network', group: '网络', name: '网络', pic: '/live/img/grp-network.webp', palette: ['teal', 'pink'],
      hasOther: () => !!computer?.traffic?.program_table?.separate || exitRows(exits?.items || computer?.exits, exits?.state).some(r => !['还没读到', '没有记录'].includes(r.status)),
      figures: [{ key: 'down', label: '下载', line: 'download' }, { key: 'up', label: '上传', line: 'upload' }, { key: 'ping', label: '延迟', line: 'net-ping' }],
      chips: [
        { key: 'rate', label: '全网速率', lines: [L('download', '下载'), L('upload', '上传')] },
        { key: 'quality', label: '网络质量', lines: [L('net-ping', '延迟'), L('net-jitter', '抖动')] },
        { key: 'loss', label: '丢包', lines: [L('net-loss', '丢包')] },
        { key: 'tcp', label: 'TCP 连接数', lines: [L('tcp-conn', 'TCP 连接数')], floor: 'auto' },
      ],
      line: (s) => { const p = sumOf(s, 'net-ping'), l = sumOf(s, 'net-loss'), d = sumOf(s, 'download'); return p ? `${p.avg < 60 && !(l?.max > 1) ? '一直很稳' : '有时不太稳'}，延迟平均 ${Chart.value(p.avg, 'ms')}${d ? `，下载最快 ${Chart.value(d.max, 'B/s')}（${clock(d.maxAt)}）` : ''}` : ''; }, build: exitsChapter },
    { key: 'power', group: '电源和温度', name: '电源和温度', pic: '/live/img/grp-power.webp', palette: ['pink', 'apricot'],
      figures: [{ key: 'watt', label: '整机功率', line: 'power-total' }, { key: 'ct', label: 'CPU 温度', line: 'cpu-temp' }, { key: 'gt', label: '显卡核心温度', line: 'gpu-temp' }, { key: 'dt', label: '磁盘最高温度', line: 'disk-temp' }],
      chips: [
        { key: 'temp', label: '温度', lines: [{ ...L('cpu-temp', 'CPU'), hue: 'apricot' }, { ...L('gpu-temp', '显卡核心'), hue: 'pink' }], floor: 'auto' },
        { key: 'watt', label: '整机功率', lines: [L('power-total', '整机功率')] },
        { key: 'dtemp', label: '磁盘最高温度', lines: [L('disk-temp', '磁盘最高温度')], floor: 'auto' },
      ],
      line: (s) => { const t = sumOf(s, 'cpu-temp'), w = sumOf(s, 'power-total'); return t ? `CPU 最高 ${Chart.value(t.max, '℃')}${w ? `，整机平均 ${Chart.value(w.avg, 'W')}` : ''}` : ''; } },
    { key: 'machine', group: '机器自己', name: '机器自己', pic: '/live/img/grp-machine.webp', palette: ['violet', 'teal'],
      figures: [{ key: 'jit', label: '调度抖动', line: 'sched-jitter' }, { key: 'ctx', label: '上下文切换', line: 'ctx-switch' }, { key: 'procs', label: '进程', line: 'procs' }, { key: 'threads', label: '整机线程', line: 'threads' }],
      chips: [
        { key: 'jit', label: '调度抖动', lines: [L('sched-jitter', '调度抖动')] },
        { key: 'ctx', label: '上下文切换', lines: [L('ctx-switch', '上下文切换')] },
        { key: 'procs', label: '进程数', lines: [L('procs', '进程数')], floor: 'auto' },
        { key: 'threads', label: '线程数', lines: [L('threads', '线程数')], floor: 'auto' },
      ] },
    { key: 'long', group: '长期', name: '近 90 天的高负载', pic: '/live/img/grp-long.webp', palette: ['apricot', 'pink'],
      figures: [{ key: 'ch', label: 'CPU 高负载温度', line: 'cpu-heat-90d' }, { key: 'gh', label: '显卡高负载核心温度', line: 'gpu-heat-90d' }],
      chips: [
        { key: 'heat', label: '温度', lines: [L('cpu-heat-90d', 'CPU'), L('gpu-heat-90d', '显卡核心')], floor: 'auto' },
        { key: 'seconds', label: '高负载持续时间', lines: [L('cpu-seconds-90d', 'CPU'), L('gpu-seconds-90d', '显卡')] },
        { key: 'samples', label: '高负载采样次数', lines: [L('cpu-samples-90d', 'CPU'), L('gpu-samples-90d', '显卡')] },
        { key: 'eff', label: '长期能效', lines: [L('cpu-eff-90d', 'CPU'), L('gpu-eff-90d', '显卡')], floor: 'auto' },
      ] },
  ];
  const knownSeriesNames = Object.fromEntries([
    ...GROUPS.flatMap(g => g.chips.flatMap(c => c.lines.map(l => [l.id, l.label]))),
    ...GROUPS.flatMap(g => g.figures.map(f => [f.line, f.label])),
  ]);
  const cleanUnit = text => text && typeof text === 'object' ? text : sp(text).replace(/\s*[（(](?:MHz|GHz|µs|us|ms|W|GB|MB|%|每小时平均|每分钟平均)[)）]/g, '').replace(/GPU\s*板卡功率/g, '显卡功率').replace(/GPU\s*负载/g, '显卡占用').replace(/双\s*CCD\s*负载/g, '两组核心负载').replace(/CCD\s*([01])/gi, (_, n) => `核心组 ${Number(n) + 1}`).replace(/\s*\(大缓存\)/g, '（大缓存）');
  const seriesName = (s, fallback = '') => cleanUnit(s?.label && s.label !== s.id ? s.label : fallback || knownSeriesNames[s?.id] || (s?.panel !== s?.id ? s?.panel : '') || s?.name || s?.title || s?.text || s?.id || '');
  const NOW = { download: 'net-down', upload: 'net-up', 'memory-capacity': 'memory' };
  const OLD_HISTORY = { threads: '采到的活跃进程线程', 'gpu-memory': '采到的进程专用显存', 'net-jitter': '历史探针抖动', 'memory-commit': '系统提交内存' };
  const TEMP_LINES = { 'CPU 温度': 'cpu-temp', 'CPU 封装温度': 'cpu-temp', 'GPU 核心': 'gpu-temp', 'GPU 核心温度': 'gpu-temp', '显卡核心温度': 'gpu-temp' };
  const retiredGpuTemperature = s => /^gpu-hotspot(?:-90d)?$/.test(s.id) || /^(?:GPU\s*|显卡)热点(?:负载)?(?:温度)?$/.test(s.label);

  // ================= 组的级别和原因由后端给 =================
  // 不从读数自行推导告警。
  let computer = null, charts = null, at = null, lastState = null, stateDone = false, netViewer = 'public', hardware = null;
  let mainComputer = null, mainRevoked = false;
  let span = '24h', chartsWatch, chartsLayoutReady = false;
  const rangeButtons = document.querySelectorAll('#weave-card [data-range]');
  const rangeTitles = document.querySelectorAll('#weave-title [data-weave-title]');
  const chartReadingHeights = { cpu: 573, memory: 311, network: 552, power: 311, machine: 522, long: 293 };
  const chartGroups = new Map(), chartDone = new Set(), chartStates = new Map();
  // 读数 id：示意数约定的名字，和开发实例现在给的名字（cpu-usage_percent 这种）都认
  const METRIC_ALIAS = { cpu: 'cpu-usage_percent', 'cpu-temp': 'cpu-temperature_celsius', memory: 'memory-used_bytes', 'memory-total': 'memory-total_bytes', 'net-down': 'download_bytes_per_second' };
  const LIGHT_READINGS = { cpu: 'cpu-temp', disk: 'disk-free', network: 'net-loss' };
  const stale = m => m?.q === 'stale' || m?.state === 'stale' || m?.stale === true;
  const restricted = m => m?.hidden || m?.hidden_block || m?.visibility === 'owner' || m?.public === 'owner' || m?.visibility === 'pending' || m?.rewrite === 'pending';
  const sampledAt = m => iso(m?.sampled_at ?? m?.source_at ?? m?.at);
  const expired = m => Number.isFinite(m?.stale_after) && m.stale_after > 0 && Date.now() - Date.parse(sampledAt(m)) > m.stale_after * 1000;
  const fresh = m => Number.isFinite(m?.value) && !!sampledAt(m) && m.q === 'ok' && !stale(m) && !m.read_error && !expired(m);
  const metric = (id) => {
    const m = computer?.metrics?.find(m => m.id === id || m.id === METRIC_ALIAS[id]);
    const b = V.blockState(m, gfOff);
    const at = sampledAt(m), old = stale(m) || expired(m);
    const keep = Number.isFinite(m?.value) && !!at && (old || m.read_error || offline());
    return m && { ...m, at, stale: old, value: restricted(m) && (netViewer !== 'owner' || m.visibility === 'pending') ? m : (b?.empty || b?.wait) && !keep ? null : m.value };
  };
  function applyHardware(d) {
    if (!d?.metrics || hardware?.meta?.viewer?.kind !== netViewer || offline()) return d;
    const readings = hardware.data?.metrics?.filter(fresh) || [];
    const metrics = d.metrics.map(row => {
      const reading = readings.find(m => m.id === row.id);
      if (!reading) return row;
      const next = { ...row, source_at: sampledAt(row) }, at = sampledAt(reading);
      if (!window.Live.mergeHardware([next], [{ ...reading, at }])) return row;
      return { ...next, sampled_at: at, timestamp_basis: reading.timestamp_basis };
    });
    return metrics.some((m, i) => m !== d.metrics[i]) ? { ...d, metrics } : d;
  }
  function readingRecovered(key, group) {
    const m = LIGHT_READINGS[key] && metric(LIGHT_READINGS[key]);
    return !offline() && fresh(m) && Date.parse(m.at) >= (Date.parse(group?.at) || 0);
  }
  const series = (id) => charts?.series?.find((s) => s.id === id) || null;
  const sumOf = (s, id) => Chart.sum((s || charts)?.series?.find((x) => x.id === id));
  const clock = (t) => (t == null ? '' : U.time(new Date(t * 1000).toISOString()));
  const screenName = value => typeof value === 'string' ? ({
    'Generic PnP Monitor': '通用显示器', 'VDD by MTT': '虚拟显示器（VDD by MTT）',
  })[value] || value : value;
  function hostText(id, m) {
    if (m?.value == null) return missing();
    if (typeof m.value === 'object' && !Array.isArray(m.value)) return m.value;
    if (id === 'os-update') return ({ reboot_required: '装好了，等重启', updates_pending: m.pending == null ? '有没装的' : `有 ${m.pending} 个没装`, ok: '都装好了' })[m.value] || U.collectionText();
    if (id === 'displays') return m.value.length ? m.value.map(d => [
      sp(screenName(d.name)), window.ComputerDraw10.screenReading(d, v => U.fieldText(v, netViewer), true), d.primary === true && '主屏',
    ].filter(Boolean).join(' · ')).join('；') : m.q === 'ok' && !m.read_error ? '没有检测到屏幕' : U.collectionText('屏幕', m);
    if (id === 'net') return m.value === 'wired' ? '有线' : m.value === 'wireless' ? `无线${m.ssid ? ` · ${m.ssid}` : ''}` : U.collectionText();
    return m.value;
  }
  // 笔记本在不在线只看连接那组（state、availability）；电量带自己读到的时间（battery.at），电量本身旧了或笔记本这会儿读不到时写“上次读到的”。
  // 不再拿库存的 at 写“数据截止”，免得和“在线”打架（M253、M319）
  const laptopBattery = (x, now) => {
    const b = x.battery, t = Date.parse(b?.at);
    if (b?.percent == null) return U.collectionText('电量', b || x);
    const old = b.q === 'stale' || b.stale === true || Number.isFinite(b.stale_after) && Number.isFinite(t) && (now - t) / 1000 > b.stale_after;
    const when = Number.isFinite(t) ? [U.date(b.at) !== U.date(now) && U.date(b.at), U.time(b.at)].filter(Boolean).join(' ') : '';
    return `${old || laptopUnavailable(x) ? '上次读到的' : ''}电量 ${b.percent}%${b.charging ? ' · 接着电源' : ''}${when ? ` · ${when}` : ''}`;
  };
  function hostRows(key) {
    const items = key === 'machine' ? [['os', '系统'], ['displays', '屏幕'], ['os-update', '系统更新']] : [['net', '连接']];
    let rows = items.map(([id, label]) => [label, hostText(id, metric(id)), id === 'os-update' && ['reboot_required', 'updates_pending'].includes(metric(id)?.value)]);
    if (key === 'machine') rows.splice(rows.findIndex(r => r[0] === '系统更新'), 1);
    if (key === 'machine') rows.unshift(['CPU', hostText('cpu-model', metric('cpu-model'))], ['显卡', hostText('gpu-model', metric('gpu-model'))], ['显存总量', capacity('gpu-memory-total')]);
    // 屏幕和首屏台式机格读同一份配置；笔记本的系统写在首屏笔记本格，自动恢复写在“台式机稳不稳”卡。
    if (key === 'machine' && configuredScreens().length) rows = rows.map(row => row[0] === '屏幕' ? [row[0], configuredScreens().map(r => `${r.label} ${screenBrief(r)}`).join('；')] : row);
    if (offline()) rows = rows.filter(([, text]) => text && text !== '还没读到' && text !== '没有记录' && text !== missing());
    const updateLamp = U.status(metric('os-update'), { small: true }).lamp;
    return rows.length ? `<ul class="rows">${rows.map(([label, text, warn]) => `<li class="row row--flat"${warn ? ' style="--gut:25px"' : ''}>${warn ? updateLamp : ''}<div class="row__text"><p class="row__main"><span class="row__title">${U.fieldHtml(label, { name: '电脑信息', place: 'label' })}</span><span class="row__meta">${hostReadingHtml(label, text)}</span></p></div></li>`).join('')}</ul>` : offline() ? '' : `<p class="row__sub">${missing()}</p>`;
  }
  // 首屏台式机格的“主屏”来自台式机配置里写了简称的屏幕。
  const configuredScreens = () => ((computer?.devices?.length ? computer.devices : homeDevices || []).find(x => x.id === 'main')?.configuration || []).filter(r => r.group === 'screens' && r.brief);
  const screenBrief = r => r.brief === true ? r.spec : r.brief;
  function hostReadingHtml(label, text) {
    const configured = label === '屏幕' && configuredScreens();
    if (configured?.length) return configured.map(r => `<span class="computer-display">${U.esc(r.label)} · ${unitHtml(screenBrief(r), r.label)}</span>`).join('');
    const screens = label === '屏幕' && metric('displays')?.value, net = label === '连接' && metric('net');
    if (Array.isArray(screens) && screens.length) return screens.map(d => {
      const render = (value, name) => typeof value === 'object' ? U.fieldHtml(value, { name, kind: netViewer }) : U.nowrap(value);
      const name = d.name && U.fieldHtml(screenName(d.name), { name: '屏幕', place: 'title', kind: netViewer });
      const primary = d.primary === true ? '主屏' : d.primary && typeof d.primary === 'object' ? render(d.primary, '是否主屏') : '';
      return `<span class="computer-display">${[name, window.ComputerDraw10.screenReading(d, render, true), primary].filter(Boolean).join(' · ')}</span>`;
    }).join('');
    if (net?.value === 'wireless' && net.ssid) return `无线 · ${U.fieldHtml(typeof net.ssid === 'object' ? net.ssid : { ...net, value: net.ssid }, { name: '无线网络名称', kind: netViewer })}`;
    return unitHtml(text, label);
  }
  // 从机器上低频读到的规格（data.hardware）：有哪项摆哪项，带截至哪天；回包没有就不显示（M654）。
  function hardwareSpecHtml() {
    const h = computer?.hardware;
    if (!h || typeof h !== 'object') return '';
    const text = v => v == null || v === '' ? '' : U.fieldHtml(v, { name: '硬件规格', kind: netViewer });
    const size = n => !Number.isFinite(n) || n <= 0 ? '' : n >= 1e12 ? `${+(n / 1e12).toFixed(1)} TB` : `${Math.round(n / 1e9)} GB`;   // 硬盘按包装上的十进制写
    const disk = d => d && typeof d === 'object' && !d.visibility && !d.hidden ? U.esc([d.model, size(d.capacity_bytes), d.bus_type].filter(Boolean).map(U.sp).join(' · ')) : text(d);
    const rows = [['处理器', text(h.cpu)], ['主板', [text(h.board), h.bios != null && h.bios !== '' ? `BIOS ${text(h.bios)}` : ''].filter(Boolean).join(' · ')], ['显卡', (Array.isArray(h.gpu) ? h.gpu : [h.gpu]).map(text).filter(Boolean).join('<br>')],
      ['内存', U.memorySpec(h.memory ?? computer?.memory?.spec, h.source_at, true).split(' · ').filter(Boolean).map(part => `<span class="live-unit">${U.esc(part)}</span>`).join(' · ')], ['硬盘', (Array.isArray(h.disks) ? h.disks : []).map(disk).filter(Boolean).join('<br>')]].filter(([, html]) => html);
    if (!rows.length) return '';
    const at = Number.isFinite(Date.parse(h.source_at)) ? ` · 截至 ${U.esc(U.date(h.source_at))}` : '';
    return `<section class="desktop-config__group"><h3>从机器上读到的规格${at}</h3><dl>${rows.map(([label, html]) => `<div><dt>${label}</dt><dd>${html}</dd></div>`).join('')}</dl></section>`;
  }
  function hostChapter(el) { return { set() { U.html(el, hostRows('machine')); } }; }
  const iso = time => Number.isFinite(time) ? new Date(time * 1000).toISOString() : Number.isFinite(Date.parse(time)) ? time : null;
  const gb = v => v / 2 ** 30;
  const pressureLine = () => 'mem-pressure';
  const bucket = s => s?.id === 'disk-free' && s.chart_window?.bucket_seconds === DAY ? '日值'
    : ({ hour_mean: '小时均值', minute_mean: '分钟均值', five_minute_sample: '每 5 分钟一次', daily_sustained_load_mean: '高负载日均', daily_load_mean: '上次高负载日均', daily: '日值' })[s?.aggregation] || (s?.group === '长期' ? '高负载日均' : span === '7d' ? '小时均值' : '分钟均值');
  const weaveBucket = () => span === '7d' ? '小时均值' : '分钟均值';
  const historyName = s => typeof s?.basis === 'string' && s.basis.includes(' · ') ? s.basis.split(' · ')[0] : OLD_HISTORY[s?.id];
  function hottestReadDisk() {
    let hottest = null;
    for (const disk of computer?.metrics || []) {
      if (!/^disk-[a-z]-temp$/.test(disk.id)) continue;
      const m = metric(disk.id);
      if (m?.q === 'ok' && !stale(m) && !m.read_error && m.unit === '℃' && iso(m.at) &&
          Number.isFinite(m.value) && (!hottest || m.value > hottest.value)) hottest = m;
    }
    return hottest;
  }
  function snapshot(id, s) {
    const pressure = id === 'mem-pressure';
    const direct = (pressure && metric('mem-pressure')) || metric(NOW[id] || id) || (pressure && metric('memory'));
    const disk = id === 'disk-temp' && direct?.value == null && hottestReadDisk();
    const m = disk || direct;
    if (!m) return null;
    if (m.value && typeof m.value === 'object') return { value: null, text: m.value };
    if (!Number.isFinite(m.value) || typeof m.unit !== 'string') return null;
    if ((id === 'memory-capacity' || id === 'memory' && !pressure) && !['B', 'GB'].includes(m.unit)) return null;
    const ratio = pressure && m.unit !== '%';
    const t = ratio && metric('memory-total'), stamp = iso(m.at), unit = pressure ? '%' : ['B', 'GiB'].includes(m.unit) ? 'GB' : m.unit;
    if (ratio && (!['B', 'GB'].includes(m.unit) || !stamp || Date.parse(stamp) !== Date.parse(t?.at) || t.unit !== m.unit || !Number.isFinite(t.value) || t.value <= 0)) return null;
    const value = ratio ? m.value / t.value * 100 : m.unit === 'B' ? gb(m.value) : m.value;
    const text = id === 'threads' ? `${Math.round(value).toLocaleString('en-US')} ${unit || '个'}` : id === 'net-loss' && unit === '%' && !Stat.partial(m) ? lossText(value) : Stat.partial(m) ? Stat.text(value, unit, m) : undefined;
    const origin = m.timestamp_basis === 'provider_read' ? '传感器读回' : '实测';
    const caption = disk ? (offline() ? '上次已读盘最高温' : '已读盘最高温')
      : [id === 'net-jitter' ? '最近 15 次探测' : ratio ? '按已用／总容量' : '', (stale(m) || offline() || m.read_error === true ? '上次' : '') + origin].filter(Boolean).join(' · ');
    return { value, unit, at: stamp, caption, text, basis: m.basis, gap: Stat.gap(m) };
  }
  const sameBasis = (live, s) => !!live?.basis && s?.basis === live.basis;
  function reading(id, point, pointerTime, surface) {
    if (surface === 'figure' && (id.startsWith('app-') || ['n', 'long', 'last'].includes(id))) return null;
    const s = series(id), long = s?.group === '长期' || id.endsWith('-90d');
    const period = s?.chart_window?.bucket_seconds ?? (long ? 86400 : span === '7d' ? 3600 : 60);
    const minuteChart = surface && s?.group === 'CPU 和显卡' && period === 60;
    const tempChart = surface === 'hero' && ['cpu-temp', 'gpu-temp'].includes(id);
    const memoryCurve = surface === 'hero' && (id === 'mem-pressure' || id === 'memory-capacity' && hasSamples(s));
    const live = !long && !minuteChart && !tempChart && !memoryCurve && snapshot(id, s);
    const latest = (minuteChart || tempChart) && pointerTime == null && Number.isFinite(point?.value) ? point : Number.isFinite(s?.latest?.value) ? s.latest : null;
    const same = sameBasis(live, s);
    if (pointerTime == null && live && (surface !== 'weave' || same)) return live;
    const temperature = pointerTime == null && !minuteChart && !tempChart && surface !== 'weave' && computer?.temperatures?.find(t => TEMP_LINES[t.label] === id
      && Number.isFinite(t.value) && iso(t.at));
    const last = pointerTime == null && !latest && (s?.stats?.count > 0 && Number.isFinite(s.stats.last) ? s.stats : Chart.sum(s && { points: s.points }));
    const historyAt = iso(latest?.at ?? last?.lastAt);
    const source = pointerTime != null ? point : temperature && (!historyAt || Date.parse(temperature.at) >= Date.parse(historyAt)) ? temperature : latest;
    const value = source ? source.value : last?.last, unit = source?.unit ?? s?.unit;
    if (!Number.isFinite(value)) {
      if (pointerTime != null) {
        const reason = U.fieldText(point?.reason) || (!hasSamples(s) && (s?.gap || s?.reason));
        if (reason) return { value: null, text: reason };
        const when = iso(pointerTime);
        const label = period >= 86400 ? U.date(when) : U.time(when);
        const window = period >= 86400 ? '这一天' : period >= 3600 ? '这一小时' : period === 300 ? '这 5 分钟' : '这一分钟';
        return { value: null, text: `${label} ${window}没采到`.trim() };
      }
      return { value: null, text: s?.gap || metric(NOW[id] || id)?.gap || (!s && offline() ? missing() : s?.reason || (s || chartDone.size ? '没有记录' : '正在读…')) };
    }
    const stamp = iso(source?.at ?? (long ? s?.last_measured_at : null)) || iso(last?.lastAt);
    const basis = s?.latest_instant_at && iso(source?.at) === s.latest_instant_at ? '即时实测' : source && source === temperature ? '分钟均值' : bucket(s);
    const label = long && pointerTime == null ? (surface === 'hero' ? '最后实测' : '') : [surface !== 'weave' && !same && OLD_HISTORY[id] && historyName(s), surface !== 'weave' || basis !== weaveBucket() || id === 'net-loss' ? basis : ''].filter(Boolean).join(' · ');
    const day = long && chartGroups.get('长期')?.day_coverage?.find(d => d.day_start === beijingDay(Date.parse(stamp) / 1000));
    const device = id.startsWith('cpu-') ? 'cpu' : 'gpu';
    const duration = V.dur(day?.[device + '_seconds']);
    const count = surface === 'hero' && day && !/(?:samples|seconds)-90d$/.test(id) && duration
      ? `高负载 ${duration.replaceAll(' ', '\u00a0')}` : '';
    const old = day?.state === 'not_read' || pointerTime == null && (stale(s) ||
      !long && s?.stale_after > 0 && Date.now() - Date.parse(stamp) > (period + s.stale_after) * 1000);
    return { value: unit === 'B' ? gb(value) : value, unit: unit === 'B' || unit === 'GiB' ? 'GB' : unit, at: stamp, caption: [old ? '上次' : '', count, label].filter(Boolean).join(' · '), dateOnly: long };
  }
  const DAY = 86400, BEIJING_OFFSET = 8 * 3600;
  const beijingDay = t => Math.floor((t + BEIJING_OFFSET) / DAY) * DAY - BEIJING_OFFSET;
  const loadKey = id => id.startsWith('cpu-') ? 'cpu_load' : 'gpu_load';
  function longGaps(s, pack) {
    if (!pack.day_coverage?.length) return;
    const known = new Set(s.points.filter(([, v]) => Number.isFinite(v)).map(([t]) => beijingDay(t)));
    const key = loadKey(s.id), panel = key === 'cpu_load' ? 'h20' : 'h19';
    const failures = (pack.unavailable_panels || []).filter(e => e.panel === panel);
    const gaps = [];
    for (const day of pack.day_coverage) {
      const from = day.day_start, to = from + DAY;
      let reason = day.state === 'read' && day[key] === false ? '当天没有持续至少 1 分钟的高负载' : '';
      if (day.state === 'not_read' && !known.has(from)) {
        const issue = failures.find(e => Date.parse(e.from) / 1000 < to && from < Date.parse(e.to) / 1000);
        reason = { source_timeout: '读取超时', docker_unavailable: '采集服务不可用' }[issue?.reason] || '该日还没读到';
      }
      if (!reason) continue;
      const last = gaps.at(-1);
      if (last?.[1] === from && last[2] === reason) last[1] = to;
      else gaps.push([from, to, reason]);
    }
    return gaps;
  }
  const readingCaption = r => [r.caption, r.at && (r.dateOnly ? U.date(r.at) : U.time(r.at))].filter(Boolean).join(' ');
  const readingText = r => r.text && typeof r.text === 'object' ? r.text : [r.text ?? Stat.text(r.value, r.unit), readingCaption(r)].filter(Boolean).join(' · ');

  const hasSamples = s => s?.points?.some(p => Number.isFinite(p[1]));
  const hasChartSamples = pack => pack?.series?.some(s => !retiredGpuTemperature(s) && hasSamples(s));
  function groupHasReadings(key) {
    const g = activeGroups().find(g => g.key === key);
    return !!g && (g.chips.some(c => c.lines.some(l => snapshot(l.id, series(l.id))?.value != null)) || charts?.series?.some(s => s.group === g.group && (Number.isFinite(s.latest?.value) || hasSamples(s))));
  }
  function judge(key) {
    const given = computer?.groups?.find((g) => (g.key ?? g.id) === key);
    if (given?.level === 'gray' && readingRecovered(key, given)) return null;
    return key === 'network' ? networkLoss(given) : given || null;
  }
  // 丢包按后台给的一位小数写（13.3%），首屏读数签、网络卡和告警写同一个数。
  const lossText = v => `${Number(v.toFixed(1))}%`;
  // 网络组的判断和丢包读数是同一个“最近 15 次探测丢包”。读数比判断新时，首屏、告警、网络卡都写读数的值和时刻（M021）。
  function networkLoss(g) {
    const m = metric('net-loss'), at = iso(m?.at);
    if (!g || !Number.isFinite(m?.value) || m.unit !== '%' || !at || Date.parse(at) < (Date.parse(g.at) || 0)) return g || null;
    const text = `最近 15 次探测丢包 ${lossText(m.value)}`, swap = s => typeof s === 'string' && /最近\s*15\s*次探测丢包/.test(s) ? text : s;
    return { ...g, at, source_at: at, reason: swap(g.reason), why: swap(g.why) };
  }
  function scopeGroupStatus(card) {
    const { why, reason, stale_text: savedCutoff } = card;
    const reportedCutoff = [why, reason].find(text => typeof text === 'string' && U.isReadingCutoff(text));
    const cutoff = savedCutoff || (!card.read_error && U.staleText({ ...card, stale: true })) || reportedCutoff;
    const describe = text => {
      if (text === '没有记录') return '状态判断暂无记录';
      if (typeof text !== 'string' || !text) return text;
      if (!U.isReadingCutoff(text)) return `状态判断 · ${text}`;
      // “状态判断最近一次记录于 06:54”两句粘在一起读不通，改成一句人话。
      const when = /((?:\d{4}-)?\d\d-\d\d\s+\d\d:\d\d|\d\d:\d\d)/.exec(text)?.[1];
      return when ? `状态判断停在 ${when}，之后没更新` : `状态判断 · ${text}`;
    };
    card.why = describe(U.sameCutoffNote(why, cutoff) ? cutoff : why || (!cutoff && U.collectionText('', card)));
    card.stale_text = describe(cutoff);
    card.reason = describe(reason);
    if (card.reason === card.why || card.reason === card.stale_text) card.reason = '';
  }
  const latestStutter = () => [...(computer?.stutters || [])].sort((a, b) => Date.parse(b.at) - Date.parse(a.at))[0] || null;

  // ================= 两组不是曲线：卡顿（竖的小时间线）、谁在占（此刻各前三） =================
  function stutterGroup() {
    const list = computer?.stutters;
    const last = latestStutter();
    const longest = list?.length ? Math.max(...list.map((s) => s.seconds || 0)) : null;
    return {
      key: 'stutter', name: '卡顿', pic: '/live/img/head-smooth.webp', palette: ['pink', 'violet'],
      line: list == null ? '' : `近 24 小时卡过 ${Stat.text(list.length, '次', computer?.blocks?.stutters)}`,
      figures: list == null ? [] : [
        { key: 'n', label: `近 24 小时${Stat.gap(computer?.blocks?.stutters) ? ` · ${Stat.gap(computer.blocks.stutters)}` : ''}`, text: Stat.text(list.length, '次', computer?.blocks?.stutters) },
        { key: 'long', label: '最长', text: longest ? `${longest} 秒` : '—' },
        { key: 'last', label: '最近一次', text: last ? U.time(last.at) : '—' },
      ],
      grafana: range(grafana?.dashboards?.find((d) => /流畅/.test(d.title))?.url || grafana?.stutters),
      build: stutterChapter,
    };
  }
  const stutterId = s => String(s.id ?? s.at);
  let picked = null;
  function stutterCards(list) {
    const cards = list => [...list].map((s) => { const id = stutterId(s), note = U.fieldHtml(s.text, { name: '卡顿说明' }); return `<div><button class="stut__card${picked === id ? ' is-picked' : ''}" style="width:100%" type="button" data-stutter="${esc(id)}" aria-pressed="${picked === id}">
          <span class="stut__t"><small>${esc(U.date(s.at))}</small>${esc(U.time(s.at))}</span><span class="stut__s">${s.seconds != null ? `卡了 ${U.fieldHtml(s.seconds, { name: '持续时间', place: 'label' })} 秒` : '卡过'}</span><span class="stut__w">${U.fieldHtml(s.text, { name: '卡顿说明', place: 'button' })}</span></button>${note.includes('live-mark') ? `<span class="row__sub">${note}</span>` : ''}</div>`; }).join('');
    const types = s => s.micro === true ? '微卡顿' : s.micro === false ? '卡顿' : '未分类';
    return [...new Set(list.map(types))].map(kind => {
      const rows = list.filter(s => types(s) === kind).sort((a,b) => Date.parse(b.at) - Date.parse(a.at));
      return `<section class="stut-group"><h3 class="use-two__k">${kind}</h3><div class="stut">${cards(rows.slice(0,5))}</div>${rows.length > 5 ? `<details class="vz-more"><summary class="more">展开（还有 ${rows.length-5} 条）</summary><div class="stut">${cards(rows.slice(5))}</div></details>` : ''}</section>`;
    }).join('');
  }
  function stutterChapter(el) {
    el.innerHTML = `<div class="stut" data-x="cards"></div>
      <div class="stut-foot"><p class="use-note">逐帧看，去<a class="more more--link" href="${esc(route('/live/smooth/'))}">卡顿与流畅 <span class="more__chev">›</span></a></p></div>`;
    const box = el.querySelector('[data-x="cards"]');
    box.addEventListener('click', (e) => {
      const b = e.target.closest('[data-stutter]');
      if (!b) return;
      picked = picked === b.dataset.stutter ? null : b.dataset.stutter;
      const s = computer?.stutters?.find((x) => stutterId(x) === picked);
      sync.mark(s ? Date.parse(s.at) / 1000 : null, s ? `卡了 ${s.seconds} 秒` : '');
      box.querySelectorAll('[data-stutter]').forEach(node => { const on = picked === node.dataset.stutter; node.classList.toggle('is-picked', on); node.setAttribute('aria-pressed', String(on)); });
    });
    const draw = () => {
      const list = computer?.stutters;
      U.html(box, list == null ? (offline() ? '' : `<p class="vz-wait">${missing()}</p>`) : !list.length ? '<p class="vz-wait">近 24 小时没卡过</p>'
        : stutterCards(list));
    };
    draw();
    return { set: draw };
  }

  const APPS = [['cpu', 'CPU'], ['gpu', '显卡'], ['memory', '内存']];
  const appBlock = () => computer?.blocks?.apps_now;
  const appGap = key => appBlock()?.rankings?.[key]?.missing_reason === 'read_failed' ? '这类进程明细读取失败' : '这类没读到进程明细';
  const sampleNote = at => iso(at) ? `${stale(appBlock()) || offline() ? '上次实测' : '采样'} ${U.time(at)}` : '';
  // 三个榜各先露 3 个（/computer 回包的 apps_now）。后台给了同一次采样的整份榜（computer/processes?group=cpu|gpu|memory，L1）时，
  // 每个榜底下“再看 10 个”每点一次多摆 10 个，一直能看到底；下一批在点之前先取好，点下去马上接上。换了一次采样就从头重取，已展开的照样展开。
  // 后台没有这个读口（现役）或第一批就取不到时，照旧只列 3 个，不出按钮。续读的行只有程序名和读数（任务归属只跟着前 3 个）。
  const APP_FIRST = 3, APP_STEP = 10;
  const appMore = Object.fromEntries(APPS.map(([k]) => [k, { at: null, rows: null, prev: null, next: null, total: null, shown: APP_FIRST, busy: false, failed: null, gen: 0 }]));
  let appRedraw = null;
  function appSample(k, at) {
    const m = appMore[k];
    if (at === m.at) return;
    m.gen += 1; m.at = at; m.prev = m.rows || m.prev; m.rows = null; m.next = null; m.total = null; m.failed = null;
    if (at) appFill(k);
  }
  async function appFill(k) {
    const m = appMore[k];
    while (m.at && !m.busy && !m.failed && (m.rows == null || m.rows.length < m.shown + APP_STEP && m.next)) {
      const gen = m.gen, first = m.rows == null;
      m.busy = true;
      let s = null;
      try {
        s = await window.Live.get('computer/processes', first ? { group: k, limit: String(Math.min(200, m.shown + APP_STEP)) }
          : { group: k, limit: String(APP_STEP), cursor: m.next });
      } catch { s = null; }
      m.busy = false;
      if (gen !== m.gen) continue;
      const d = s?.data;
      if (!Array.isArray(d?.items)) { m.failed = first ? 'first' : 'page'; break; }
      m.rows = first ? d.items.map(a => ({ ...a, at: d.source_at })) : [...m.rows, ...d.items.map(a => ({ ...a, at: d.source_at }))];
      m.next = d.items.length && d.next !== m.next ? d.next : null;
      m.total = Number.isFinite(d.total) ? d.total : m.rows.length;
      if (first) m.prev = null;
    }
    appRedraw?.();
  }
  // 续读的行照前 3 个的写法：访客看不到的名字照样写“仅本人可见”，程序名换成易认的名字
  function sampleRows(k) {
    const m = appMore[k], rows = m.rows || m.prev;
    if (!(m.shown > APP_FIRST && rows)) return null;
    return rows.slice(0, m.shown).map((a, i) => {
      const hidden = restricted(a) && netViewer !== 'owner' || a.visibility === 'pending' || a.name && typeof a.name === 'object';
      const name = hidden ? (typeof a.name === 'object' && a.name ? a.name : { visibility: a.visibility ?? 'owner', hidden_what: a.hidden_what, hidden_block: a.hidden_block }) : (U.programName?.(a.name) ?? a.name);
      return { key: `${k}-s${i}`, name, value: hidden ? null : a.value, unit: hidden ? null : a.unit, at: hidden ? null : a.at, sub: '' };
    });
  }
  function appMoreButton(k) {
    const m = appMore[k], total = m.rows ? m.total : null, left = total == null ? 0 : total - m.shown;
    const waiting = m.rows && m.rows.length < Math.min(total, m.shown) && !m.failed;
    const hidden = !(m.failed === 'page' || left > 0 || waiting);
    const text = m.failed === 'page' ? '这一批没读到，点一下再取 <span class="more__chev">›</span>' : waiting ? '正在取…'
      : left > APP_STEP ? `再看 ${APP_STEP} 个（还有 ${left} 个） <span class="more__chev">›</span>` : `再看剩下 ${left} 个 <span class="more__chev">›</span>`;
    return { hidden, waiting, text };
  }
  function programRows(k) {
    const rows = new Map();
    for (const [i, a] of (computer?.apps_now?.[k] || []).entries()) {
      const hidden = restricted(a) && netViewer !== 'owner' || a.visibility === 'pending';
      const key = `${k}-${i}`, name = hidden ? { visibility: a.visibility ?? 'owner', hidden_what: a.hidden_what, hidden_block: a.hidden_block } : (U.programName?.(a.name) ?? a.name);
      const amount = hidden ? null : a.value;
      // 先认结构标记（content_locked、hidden 这类），再认占位字（“〈哪一样〉仅本人可见”，和旧的两种写法）。
      const marked = [a, a.name].some(v => v && typeof v === 'object' && (v.content_locked || v.hidden || v.hidden_block))
        || typeof a.name === 'string' && /(?:仅本人可见|可信设备可见|正在换说法)$/.test(a.name.trim());
      const identity = !hidden && !marked && typeof a.name === 'string' ? a.name : key;
      const old = rows.get(identity);
      if (old && Number.isFinite(old.value) && Number.isFinite(amount) && old.unit === a.unit && old.at === a.at) { old.value += amount; old.lower_bound ||= Stat.partial(a); old.gap ||= Stat.gap(a); }
      else rows.set(old ? key : identity, { key, name, value: amount, unit: hidden ? null : a.unit, at: hidden ? null : a.at, lower_bound: !hidden && Stat.partial(a), gap: hidden ? '' : Stat.gap(a), visibility: name?.visibility === 'owner' && hidden ? 'owner' : undefined });
    }
    return [...rows.values()].slice(0, 3).map(a => ({ ...a, text: a.lower_bound ? Stat.text(a.value, a.unit, a) : undefined, sub: [sampleNote(a.at), a.gap].filter(Boolean).join(' · ') }));
  }
  function appsGroup() {
    const busy = computer?.busy, tops = APPS.map(([k]) => programRows(k)[0]);
    return {
      key: 'apps', name: offline() ? '谁在占' : '此刻谁在占', pic: '/live/img/head-apps.webp', palette: ['blue', 'violet'],
      line: busy?.state === 'busy' ? [({ cpu: 'CPU', gpu: '显卡', memory: '内存' })[busy.trigger], '占用高', busy.since ? `${U.time(busy.since)} 起` : ''].filter(Boolean).join(' · ') : '',
      grafana: range(grafana?.dashboards?.find(d => /应用|程序/.test(d.title))?.url || grafana?.groups?.['应用'] || grafanaHref()),
      figures: tops.some(Boolean) ? APPS.map(([key, name], i) => { const a = tops[i]; return { key: `app-${key}`, label: a?.name && typeof a.name === 'object' ? a.name : [name, a?.name].filter(Boolean).join(' · '), value: a?.value, unit: a?.unit, text: a ? a.text : appGap(key), gap: a?.sub }; }) : [],
      build: appsChapter,
    };
  }
  function appsChapter(el) {
    el.innerHTML = `<div class="grp-trio">${APPS.map(([k, name]) => `<div><span class="grp-trio__k">${name} <small data-sample="${k}"></small></span><div data-x="${k}"></div><button class="more" type="button" data-app-more="${k}" style="margin-top:8px" hidden></button></div>`).join('')}</div>
      <p style="margin:14px 0 0"><a class="more more--link" href="${esc(route('/live/apps/'))}">谁在占 <span class="more__chev">›</span></a></p>`;
    const end = document.createElement('p'); end.className = 'computer-chart-end'; el.prepend(end);
    const ranks = Object.fromEntries(APPS.map(([k]) => [k, V.rank(el.querySelector(`[data-x="${k}"]`), { show: Infinity, mark: true, missing: () => appGap(k), keepNameOnlyRows: true })]));
    el.addEventListener('click', e => {
      const btn = e.target.closest('[data-app-more]');
      if (!btn || btn.disabled) return;
      const m = appMore[btn.dataset.appMore];
      // 第一次往下展开前记下卡片这时的高度：画照这个高度留在顶上，不跟着卡片拉长放大（L1）
      const card = el.closest('.grp');
      if (card && !card.classList.contains('grp--long')) { card.style.setProperty('--pic-h', `${card.offsetHeight}px`); card.classList.add('grp--long'); }
      if (m.failed === 'page') m.failed = null; else m.shown += APP_STEP;
      draw(); appFill(btn.dataset.appMore);
    });
    const draw = () => {
      const entries = APPS.map(([k]) => [k, programRows(k)]), empty = !entries.some(([, rows]) => rows.length);
      el.querySelector('.grp-trio').hidden = empty; end.hidden = !empty || !computer; end.textContent = offline() ? missing() : '这次没读到进程明细';
      if (!empty) for (const [k, preview] of entries) {
        if (!offline()) appSample(k, preview[0]?.at || null);
        const rows = sampleRows(k) || preview;
        const at = rows[0]?.at;
        const shared = rows.length > 1 && at && rows.every(row => Date.parse(row.at) === Date.parse(at)) ? sampleNote(at) : '';
        el.querySelector(`[data-sample="${k}"]`).textContent = shared ? ` · ${shared}` : '';
        ranks[k].set(rows.length ? shared ? rows.map(a => ({ ...a, sub: a.gap })) : rows : null);
        const btn = el.querySelector(`[data-app-more="${k}"]`), state = appMoreButton(k);
        btn.hidden = state.hidden || offline(); btn.disabled = state.waiting; U.html(btn, state.text);
      }
    };
    appRedraw = draw;
    draw();
    return { set: draw };
  }

  // 显卡降频：共用状态时间轴，放进“CPU 和显卡”那组（none/power/thermal/idle 配 teal/apricot/pink/violet）
  function throttle(el) {
    el.innerHTML = '<p class="grp-split__k">显卡降频原因</p><div data-x="tl"></div>';
    const view = V.timeline(el.lastElementChild, { rows: [{ key: 'day', label: '近 24 小时' }] });
    const read = U.reading(el.lastElementChild, { ghost: U.ghost.chart(), slow: false });
    const draw = () => {
      const s = series('gpu-throttle');
      if ((!chartGroups.has('机器自己') && !chartDone.has('机器自己')) || s?.state === 'computing') { read.set({ phase: 'wait' }); return; }
      read.done();
      if (s?.timeline) { view.set(s.timeline); return; }
      if (!s?.points?.length || !s.states) { view.set(null); return; }
      const hues = { none: 'teal', power: 'apricot', thermal: 'pink', idle: 'violet' };
      const states = Object.entries(s.states).map(([id, label]) => ({ id, label, hue: hues[id] || 'blue' }));
      const index = new Map(states.map((x, i) => [x.id, i]));
      const spans = s.points.filter((p, i, all) => !i || p[1] !== all[i - 1][1]).map(([t, state]) => [t, index.get(state) ?? null]);
      view.set({ states, rows: { day: { from: s.from || charts.from, to: s.to || charts.to, spans } } });
    };
    draw();
    return { set: draw };
  }

  let exits = null, drawExits = () => {}, exitJump = "";
  function exitRows(items, state) {
    const names = { bilibili: '哔哩哔哩', claude: 'Claude', openai: 'OpenAI' };
    return [...new Set([...Object.keys(names), ...(items || []).map(x => x.id)])].map((id) => {
      const x = items?.find((r) => r.id === id) || {}, probing = state === 'probing' && id !== 'claude';
      // 与后台 network_exits.rows 一样，分别看该测点的原时刻，旧主包可能仍保存 ok=true。
      const age = (Date.now() - Date.parse(x.at)) / 1000;
      const stale = U.isStale(x) || Number.isFinite(age) && (age < 0 || age > (id === 'claude' ? 75 : 180));
      const cutoff = stale && U.staleText({ at: x.at, stale: true });
      const status = stale ? x.gap || cutoff || U.collectionText()
        : x.ok === true ? (id === 'claude' ? `线路通${x.fixed_ip === false ? '，出口不是固定 IP' : ''}` : '通') : x.ok === false ? `不通${x.since ? ` · 从 ${U.time(x.since)} 起` : ''}` : U.collectionText();
      const note = stale ? [id === 'claude' && x.gap && cutoff, probing && '正在测…'].filter(Boolean).join(' · ')
        : x.ms && typeof x.ms === 'object' ? x.ms : id === 'claude' && x.ok == null ? '' : [x.ms != null && (x.ms >= 1000 ? `${Number((x.ms / 1000).toFixed(x.ms < 10000 ? 2 : 1))} 秒` : `${Math.round(x.ms)} ms`), x.at && `${U.time(x.at)} 核验`, probing && '正在测…', id === 'claude' && x.fixed_ip === true && '出口是固定 IP ✓'].filter(Boolean).join(' · ');
      return { id, name: names[id] || [x.label, x.name, x.title, x.text].find(v => sp(v) && !/^(?:没有记录|这一项)$/.test(sp(v))) || id, lamp: U.status(stale ? { level: 'gray' } : x, { small: true }).lamp, status, note };
    });
  }
  function exitsChapter(el) {
    el.innerHTML = '<div data-host-readings></div><section class="vz-exits" id="exits"><p class="grp-split__k">连得上吗</p><div data-exits></div><div data-draw10-network></div></section>';
    drawExits = () => { U.html(el.querySelector('[data-draw10-network]'), window.ComputerDraw10?.network(computer, netViewer) || ''); const rows = exitRows(exits?.items || computer?.exits, exits?.state).filter(r => !offline() || !['还没读到', '没有记录'].includes(r.status)); /* 块已经说没存下来，下面不再列一串“没有记录”（r83 返修第二轮） */ el.querySelector('.vz-exits').hidden = offline() && !rows.length; U.html(el.querySelector('[data-host-readings]'), hostRows('network')); U.html(el.querySelector('[data-exits]'), rows.map((r) => `<div class="exit-row" style="grid-template-columns:12px 100px 14em minmax(0,1fr)" data-exit="${esc(r.id)}">${r.lamp || '<span></span>'}<b>${U.fieldHtml(r.name, { name: '线路', place: 'label' })}</b><span>${U.fieldHtml(r.status, { name: '线路状态' })}</span><small>${U.fieldHtml(r.note, { name: '线路说明' })}</small></div>`).join('') || `<p class="row__sub">${missing()}</p>`); };
    finishExitAnchor(el.querySelector("#exits"));
    return { set: drawExits };
  }
  function renderSeparateTraffic(card) {
    const separate = computer?.traffic?.program_table?.separate;
    const row = separate && U.separateTraffic({
      ...separate, note: U.separateTrafficNote,
    });
    let reading = card.querySelector('[data-traffic-separate]');
    if (!row) { reading?.remove(); return; }
    if (!reading) {
      reading = document.createElement('p');
      reading.dataset.trafficSeparate = '';
      card.querySelector('.grp__head').after(reading);
    }
    U.html(reading, `<b>${esc(row.name)} 海外流量</b> · ${U.nowrap(row.summary)}`, false);
  }
  async function readExits(get, paint, active = () => true) {
    const until = Date.now() + 60000;
    let first = true, last = null;
    while (Date.now() < until && active()) {
      let timeout;
      const query = first ? { probe: 1 } : null; first = false;
      const result = await Promise.race([get(query), new Promise((resolve) => { timeout = setTimeout(() => resolve(null), until - Date.now()); })]);
      clearTimeout(timeout);
      if (result?.data && active()) { last = result.data; paint(last); }
      if (last?.state !== 'probing') break;
      await new Promise((resolve) => setTimeout(resolve, Math.min(2000, Math.max(0, until - Date.now()))));
    }
    if (last?.state === 'probing' && active()) paint({ ...last, state: 'ok' });
  }

  let grafana = null, gfOff = false;
  const grafanaHref = () => grafana?.dashboards?.find((d) => /整机硬件/.test(d.title))?.url || grafana?.groups?.['CPU 和显卡'] || grafana?.href || grafana?.dashboards?.[0]?.url || '';
  const range = (href) => {
    if (!href || !charts) return href || '';
    const url = new URL(href, location.href);
    if (url.searchParams.has('from')) return url.href;   // 后端已经带了时间段（长期那组是 90 天），不改
    url.searchParams.set('from', String(Date.parse(charts.from)));
    url.searchParams.set('to', String(Date.parse(charts.to)));
    return url.href;
  };
  function gfState() {
    const main = computer?.devices?.find((x) => x.id === 'main');
    gfOff = main?.state === 'offline';
    document.body.classList.toggle('gf-off', gfOff);
  }
  // Grafana 谁点都直接跳（本人 11-16 07:30：外人可以跳转登录但是打不开）；只在主机没开、连不上时拦住
  document.addEventListener('click', (e) => { if (gfOff && e.target.closest('[data-gf]')) e.preventDefault(); });
  function renderGrafana() {
    const href = grafanaHref();
    const issue = grafana?.service_state === 'unavailable' ? '图表服务暂不可用'
      : grafana?.reachable === false ? '这次没连上 Grafana 登录页' : '';
    const note = issue ? `<small class="row__sub">${issue}</small>` : '';
    U.html(part('grafana'), href ? `<a class="gf" href="${esc(range(href))}" target="_blank" rel="noopener" data-gf>Grafana <span class="more__chev">↗</span></a>${note}` : '');
  }

  // ================= 组：拼给 LiveViz.board =================
  const boardHost = $('board');
  const board = V.board(boardHost, {
    key: 'computer',
    sync, reading, keepChips: true, edgeDotLines: ['net-loss'],
    onCount: renderCount,
  });
  // 接口给的 series 和上面约定的 id 对不上时：按 series.group / panel 现搭这一组（一个 panel 一格，前四格做收着时的大数字）
  const AUTO_FLOOR = ['℃', 'MHz', 'V'];
  function generic(g) {
    const list = (charts?.series || []).filter((s) => s.group === g.group && s.kind !== 'states' && s.points?.some((p) => p[1] != null) && seriesName(s));
    if (!list.length) return null;
    const panels = new Map();
    for (const s of list) { const k = s.panel && s.panel !== s.id ? s.panel : seriesName(s); if (!panels.has(k)) panels.set(k, []); panels.get(k).push(s); }
    const chips = [...panels].map(([k, ss], i) => ({ key: `p${i}`, label: typeof k === 'object' ? k : cleanUnit(k).replaceAll('IOPS', '每秒读写次数'), lines: ss.map((s) => L(s.id, typeof seriesName(s) === 'object' ? seriesName(s) : seriesName(s).replaceAll('IOPS', '每秒读写次数'))), floor: AUTO_FLOOR.includes(ss[0].unit) || ss[0].from ? 'auto' : 0, ceil: ss[0].unit === '%' ? 100 : undefined }));
    const figures = chips.slice(0, 4).map((c) => ({ key: c.key, label: c.label, line: c.lines[0].id }));
    const first = Chart.sum(list[0]);
    const line = first ? typeof list[0].label === 'object' ? list[0].label : `${cleanUnit(list[0].label || list[0].panel || '')}平均 ${Chart.value(first.avg, list[0].unit)}，最高 ${Chart.value(first.max, list[0].unit)}` : '';
    return { chips, figures, line };
  }
  function activeGroups() {
    const given = computer?.groups;
    const known = GROUPS.filter(g => !given || given.some(x => (x.key ?? x.id) === g.key));
    const used = new Set([...GROUPS.map(g => g.key), 'apps', 'stutter']);
    const extra = (given || []).filter(g => !used.has(g.key ?? g.id)).map(g => {
      const key = g.key ?? g.id;
      return { ...g, adaptive: true, key, group: g.group || key, name: window.LiveAdaptive.name(g), pic: '/live/img/grp-machine.webp',
        palette: [window.LiveAdaptive.hue(key, ['teal', 'violet', 'blue', 'apricot', 'pink'])], figures: [], chips: [] };
    });
    return [...known, ...extra];
  }
  function groups() {
    const out = activeGroups().map((g0) => {
      const auto = g0.adaptive && generic(g0);
      const g = auto ? { ...g0, chips: auto.chips, figures: auto.figures, line: () => auto.line, say: null, hero: null } : { ...g0 };
      const j = judge(g.key), pack = chartGroups.get(g.group);
      const level = j?.level || 'none';
      if (g.key === 'long' && pack) g.chips = g.chips.filter(c => c.key === 'heat' || c.lines.some(l => hasSamples(series(l.id))));
      if (g.key === 'memory') {
        const capacityId = 'memory-capacity', history = hasSamples(series(capacityId));
        const hasCapacity = history || snapshot(capacityId, null)?.value != null;
        g.figures = g.figures.filter(f => f.key !== 'used' || hasCapacity)
          .map(f => f.key === 'used' ? { ...f, line: capacityId } : f);
        const hasPressureHistory = hasSamples(series(pressureLine()));
        g.chips = g.chips.map(c => c.key === 'used' ? { ...c, liveOnly: !history,
          label: history ? c.label : '内存已用容量（即时）', lines: [L(capacityId, c.label)] }
          : c.key === 'press' && history && !hasPressureHistory ? { ...c, liveOnly: true } : c);
        g.hero = history && !hasPressureHistory ? 'used' : 'press';
      }
      const represented = new Set(g.chips.flatMap(c => c.lines.map(l => l.id)));
      const extra = (charts?.series || []).filter(s => s.group === g.group && s.kind !== 'states' && !represented.has(s.id) && (hasSamples(s) || g.key !== 'long' && (s.gap || s.latest)));
      g.chips = [...g.chips, ...extra.map(s => ({ key: s.id, label: seriesName(s), lines: [{ ...L(s.id, seriesName(s)), hue: SERIES_HUE[s.id] || window.LiveAdaptive.hue(s.id, g.palette) }] }))];
      const card = {
        ...j, adaptive: g.adaptive, key: g.key, name: g.name, pic: g.pic, palette: g.palette, reason: j?.reason,
        line: '',
        figures: g.figures.map(f => {
          const s = series(f.line), r = g.key === 'cpu' ? reading(f.line, null, null, 'figure') : reading(f.line), m = f.line === 'disk-free' && metric('disk-free');
          const label = f.line === 'power-total' ? seriesName(s, f.label) : m?.note ? typeof m.note === 'object' ? m.note : `${sp(m.note)} 剩余${m.days_to_full == null ? '' : ` · ${fullText(m.days_to_full)}`}` : f.label;
          return { ...f, label, hue: SERIES_HUE[f.line], value: r.value, unit: r.unit, text: r.text, gap: r.gap, ...(g.key !== 'long' && (f.ceil === 100 || s?.unit === '%') ? { floor: 0, ceil: 100 } : {}) };
        }),
        chips: g.chips, hero: typeof g.hero === 'function' ? g.hero(level) : g.hero, say: chartSummary, build: g.key === 'machine' ? hostChapter : g.build, titleFirst: true, readHeight: g.readHeight,
        grafana: range(grafana?.groups?.[g.group]),
      };
      if (j?.why === '没有记录' && j.lamp_missing?.includes('cpu-temp')) card.why = 'CPU 温度还没读到';
      card.chips = card.chips.map(c => {
        if (g.key !== 'long' && (c.ceil === 100 || c.lines?.every(l => series(l.id)?.unit === '%'))) c = { ...c, floor: 0, ceil: 100 };
        const id = c.lines[0].id, label = id === 'power-total' ? seriesName(series(id), c.label) : c.key === 'vram' ? `整卡显存已用 · 共 ${capacity('gpu-memory-total')}` : c.label;
        const lines = c.lines.map(l => ({ ...l, label: c.key === 'ccd' ? seriesName(series(l.id), l.label) : l.label }));
        return { ...c, label, lines, text: pairReadings({ ...c, lines }) };
      });
      if (offline()) card.figures = card.figures.filter(f => f.value != null || typeof f.text === 'object' || series(f.line)?.points?.some(p => p[1] != null));
      const meta = pack?.state ? pack : pack?.blocks?.[g.group];
      const hasReadings = groupHasReadings(g.key);
      const hasHistory = hasChartSamples(pack);
      const b = V.blockState(meta, gfOff, hasHistory ? pack : null);
      const ended = offline() && !pack && chartDone.has(g.group);
      const waiting = b ? b.wait && !hasHistory : !pack && !chartDone.has(g.group);
      const wait = waiting || g.key === 'memory' && !computer && !stateDone;
      const ids = card.chips.flatMap(c => c.lines.map(l => l.id));
      let chartNote = b?.gap || b?.reason || (b?.empty ? b.text : '');
      if (chartNote === '没有记录') {
        if (hasHistory) chartNote = '';
        else if (hasReadings) chartNote = '曲线没有记录';
      }
      if (hasReadings && card.level === 'gray') scopeGroupStatus(card);
      const why = card.why !== card.text && card.why !== card.stale_text ? card.why : '';
      const empty = b?.empty && !hasReadings;
      const publication = !offline() && publicationRevoked(chartStates.get(g.group)?.meta) ? publicationNote(g.name) : '';
      return { ...card, cutoffIds: { '': ids, [g.name]: ids }, wait, readHeight: card.readHeight || (wait ? chartReadingHeights[g.key] || 210 : undefined), empty, line: publication || (empty && !ended ? b.text : ''),
        blocks: b && !ended ? [{ key: g.name, ...b, text: chartNote === why || chartNote === card.reason ? '' : chartNote }] : [] };
    });
    const st = stutterGroup(), j = judge('stutter');
    // 这两组只靠 /computer：它还在读时自己在雾里（不跟曲线那一读），读完了才说“还没读到”
    const wait = !computer && !stateDone;
    if (!computer?.groups || j || computer.stutters != null) out.splice(1, 0, { ...st, ...j, partial: j?.missing_readings?.length ? j.missing_readings : j?.partial, missingNames: j?.missing_names, reason: j?.reason, wait, readHeight: 108 });
    out.push({ ...appsGroup(), ...judge('apps'), wait });
    return [...out.filter(g => !g.adaptive), ...out.filter(g => g.adaptive)]
      .map(g => g.why && g.why === g.reason && g.why !== g.text && g.why !== g.stale_text ? { ...g, reason: '' } : g);
  }
  function chartSummary(c, sums, payload) {
    const s = sums[0];
    const one = payload?.series?.find(x => x.id === (s?.id ?? c.lines[0]?.id)), frame = one?.from ? one : payload;
    const days = one?.group === '长期' ? chartGroups.get('长期')?.day_coverage : null;
    const missed = days?.filter(d => d.state === 'not_read').length;
    const coverage = days?.length ? ['只看持续至少 1 分钟的高负载', missed && `${missed} 天没读到`].filter(Boolean).join(' · ') : '';
    if (s?.max == null) return coverage || null;
    const at = new Date(s.maxAt * 1000).toISOString(), hours = (Date.parse(frame.to) - Date.parse(frame.from)) / 3600000;
    const when = hours > 30 * 24 ? U.date(at) : `${hours > 36 || U.date(at) !== U.date(frame.to) ? U.date(at) + ' ' : ''}${U.time(at)}`;
    const average = ['GB', '℃', '%', 'ms', 'W', 'V'].includes(s.unit) ? `${s.avg.toFixed(1)}${['℃', '%'].includes(s.unit) ? '' : ' '}${s.unit}` : (Chart.value(s.avg, s.unit) || '').replace(/-?\d+(?:\.\d+)?/, n => Number(n).toFixed(1));
    if (one?.group === '内存' && (s.unit === '%' || one.id === 'memory-capacity') && Number.isFinite(s.lastAt)) {
      const last = new Date(s.lastAt * 1000).toISOString();
      const ending = one.latest_instant_at ? `末点 ${U.time(last)} 即时实测` : `曲线记录至 ${U.time(last)}`;
      if (one.id === 'memory-capacity' && one.basis) return `图上最高 ${Chart.value(s.max, s.unit)}（${when}），各点平均 ${average} · ${ending} · ${bucket(one)}，${one.basis}`;
      if (one.latest_instant_at) return `图上最高 ${Chart.value(s.max, s.unit)}（${when}），各点平均 ${average} · ${ending}，此前为${bucket(one)}${one.minute_mean_end ? `（${bucket(one)}送到 ${U.time(one.minute_mean_end)}，之后的还没送来）` : ''}`;
      return `${bucket(one)}最高 ${Chart.value(s.max, s.unit)}（${when}），平均 ${average} · 曲线记录至 ${U.time(last)}`;
    }
    const jitter = one?.id === 'net-ping' && sums.find(x => x.id === 'net-jitter' && x.max > s.max);
    return typeof s.label === 'object' ? s.label : [`${c.lines.length > 1 ? s.label || '' : ''}最高 ${Chart.value(s.max, s.unit)}（${when}），平均 ${average}`,
      jitter && `抖动最高 ${Chart.value(jitter.max, jitter.unit)}`, coverage].filter(Boolean).join(' · ');
  }
  const weaveCard = $('weave-card');
  // 上面的读数卡增减时，留住正在看的短期曲线。
  function keepWeavePosition(update) {
    const before = window.scrollY > 0 ? weaveCard.getBoundingClientRect() : null;
    update();
    if (!before || before.bottom <= 0 || before.top >= innerHeight) return;
    const delta = weaveCard.getBoundingClientRect().top - before.top;
    if (Math.abs(delta) >= 1) window.scrollBy({ top: delta, behavior: 'instant' });
  }
  let pendingOrder = null;
  function placeCards() {
    if (!pendingOrder || boardHost.querySelector('.grp:hover, .grp:focus-within')) return;
    const cards = new Map(board.cards().map(card => [card.dataset.key, card]));
    pendingOrder.map(g => cards.get(g.key)).filter(Boolean).forEach((card, i) => {
      if (boardHost.children[i] !== card) boardHost.insertBefore(card, boardHost.children[i] || null);
    });
    pendingOrder = null;
  }
  for (const event of ['pointerout', 'focusout']) boardHost.addEventListener(event, () => {
    if (pendingOrder) requestAnimationFrame(() => keepWeavePosition(placeCards));
  });
  const refresh = () => keepWeavePosition(() => {
    const list = groups(); board.set(list);
    // 沿用读完后的严重程度顺序，避免「在读」的组和读完的组交换位置。
    const priority = { red: 0, yellow: 1, ok: 2, none: 3 };
    pendingOrder = [...list].sort((a, b) => Number(!!a.adaptive) - Number(!!b.adaptive) || (priority[a.level] ?? 2) - (priority[b.level] ?? 2));
    placeCards();
    for (const g of list) {
      const def = activeGroups().find(x => x.key === g.key), alert = ['yellow', 'red'].includes(g.level) && g.reason;
      const hardware = g.key === 'machine' && ['cpu-model', 'gpu-model', 'os', 'displays'].some(id => metric(id)?.value != null);
      const has = alert || (def ? groupHasReadings(g.key) || hardware || (g.key === 'network' && exits?.items?.length)
        : g.key === 'stutter' ? computer?.stutters != null : computer != null);
      const ready = def ? chartDone.has(def.group) || stateDone && !computer && !mainRevoked : !!computer || stateDone;
      const revoked = def ? publicationRevoked(chartStates.get(def.group)?.meta) : mainRevoked;
      const card = $('board').querySelector(`.grp[data-key="${CSS.escape(g.key)}"]`);
      showUnread(card, g.name, !offline() && ready && !has, revoked ? publicationNote(g.name) : undefined);
      if (g.key === 'network' && card) renderSeparateTraffic(card);
    }
    hero.classList.toggle('is-unread', !offline() && stateDone && !computer);
    if (!computer && stateDone) renderStability();
    renderChartEnds();
    document.querySelectorAll('[data-gf][data-needs-pc]').forEach(a => a.removeAttribute('data-needs-pc'));
    document.querySelectorAll('.dev-pill[href^="/mcp/"]').forEach(a => a.setAttribute('data-needs-pc', ''));
    for (const text of $('board').querySelectorAll('.grp__said')) if (!text.querySelector('.live-mark')) U.html(text, U.nowrap(text.textContent), false);
    updateChartTargets();
  });
  function capacity(id) {
    const m = metric(id);
    return m?.value && typeof m.value === 'object' ? m.value : m?.value == null ? U.collectionText(m?.label || '', m) : Stat.text(m.unit === 'B' ? m.value / 2 ** 30 : m.value, m.unit === 'B' ? 'GB' : m.unit, m) + (Stat.gap(m) ? ` · ${Stat.gap(m)}` : '');
  }
  function pairReadings(c) {
    const reads = c.lines.map(l => readingText(reading(l.id)));
    return reads.length === 1 ? reads[0] : reads.map((text, i) => `${U.fieldText(c.lines[i].label)} ${U.fieldText(text)}`).join('\n');
  }
  // ================= 各组下面：同一条时间轴看全部（织锦），和上面各组共用一个 sync =================
  const WEAVE_LABEL = { 'disk-iops': '每秒读写次数', cpu: 'CPU 占用', gpu: '显卡占用', ccd0: '核心组 1 负载', ccd1: '核心组 2 负载', 'gpu-core-clock': '显卡核心频率', 'gpu-mem-clock': '显存频率',
    'cpu-vcore': 'CPU 电压', 'gpu-vcore': '显卡电压', 'disk-read': '磁盘读', 'disk-write': '磁盘写', download: '下载', upload: '上传', 'net-ping': '延迟', 'net-jitter': '抖动',
    'gpu-bandwidth': '显卡 PCIe 带宽占用', 'memory-commit': '提交内存', 'memory-swap': '页面文件占用', 'mem-paging': '换页', disk: '最忙磁盘的忙碌率', 'disk-latency': '最高响应延迟',
    'disk-temp': '磁盘最高温度', 'disk-free': 'E 盘剩余', 'net-loss': '丢包', 'tcp-conn': 'TCP 连接数', 'cpu-temp': 'CPU 温度', 'gpu-temp': '显卡核心温度',
    'gpu-power': '显卡功率', 'cpu-power': 'CPU 功率', 'cpu-clock': 'CPU 频率', 'sched-jitter': '调度抖动', 'ctx-switch': '上下文切换',
    'gpu-memory': '显存（各程序合计）', threads: '线程（各程序合计）', procs: '活跃进程（不含闲着的）' };
  const weaveHost = $('weave');
  const weave = V.weave(weaveHost, {
    sync, reading, hue: s => SERIES_HUE[s.id],
    order: GROUPS.map((g) => g.group),
    hues: Object.fromEntries(GROUPS.map((g) => [g.group, g.palette])),
    label: s => typeof s.label === 'object' ? s.label : [s.id === pressureLine() ? '物理内存占用率' : /^ccd[01]$/.test(s.id) ? seriesName(s, WEAVE_LABEL[s.id]) : WEAVE_LABEL[s.id] || !sameBasis(snapshot(s.id, s), s) && historyName(s) || seriesName(s), bucket(series(s.id) || s) !== weaveBucket() && bucket(series(s.id) || s)].filter(Boolean).join(' · '),
    floor: (s) => s.id === 'disk-free' ? 'auto' : undefined,
  });
  function fitWeaveAxis() {
    const axis = weaveHost.querySelector('.vz-weave__axis'), end = axis.querySelector('.is-now');
    if (!end) return;
    const limit = end.getBoundingClientRect().left - 8;
    for (const tick of axis.querySelectorAll('span:not(.is-now)')) {
      tick.hidden = false;
      tick.hidden = tick.getBoundingClientRect().right > limit;
    }
  }
  new ResizeObserver(fitWeaveAxis).observe(weaveHost);
  function weaveData(d) {
    const list = (d?.series || []).filter(s => s.group !== '长期' && (s.id !== 'mem-pressure' || pressureLine() !== 'memory') && (WEAVE_LABEL[s.id] || seriesName(s))).map(({ from, to, ...s }) => s);
    // 稀疏的分钟数据可能全在右端。像切换时间档一样淡入，让已有实测立即开始显现。
    return d ? { ...d, fadeNewCharts: true, series: list } : null;
  }
  function paintWeave(view) {
    const data = weaveData(view);
    const hasRows = data?.series.some(s => s.kind !== 'states' && s.points?.some(p => p[1] != null));
    if (!hasRows && !weaveReady()) {
      weaveRead ||= U.reading($('weave'), { ghost: U.ghost.chart(), slow: false });
      return;
    }
    weave.set(data);
    fitWeaveAxis();
    weaveRead?.done(!!hasRows); weaveRead = null;
    $('weave').querySelectorAll('.vz-weave__name').forEach(el => { el.title = el.textContent; });
  }

  Light.add($('weave-card'));
  // 读前织锦也在雾里（一条糊开的珍珠光带），数到了由糊变清；读完没数时 weave 自己写“还没读到”
  let weaveRead = U.reading($('weave'), { ghost: U.ghost.chart(), slow: false });
  const weaveReady = () => activeGroups().every(g => g.key === 'long' || chartDone.has(g.group));
  const weaveEnd = document.createElement('p'); weaveEnd.className = 'computer-chart-end'; weaveEnd.hidden = true; $('weave').after(weaveEnd);
  function renderChartEnds() {
    for (const g of activeGroups()) {
      const state = chartStates.get(g.group), pack = chartGroups.get(g.group), noPack = !pack?.series?.length || pack.state === 'computing' && !hasChartSamples(pack);
      const ended = noPack && (['gone', 'none'].includes(state?.phase) || pack?.state === 'unavailable' || !!pack && chartDone.has(g.group) && pack.state !== 'computing');
      const card = $('board').querySelector(`.grp[data-key="${CSS.escape(g.key)}"]`);
      if (!card) continue;
      const lines = noPack && new Map([...g.chips.flatMap(c => c.lines.map(l => [l.id, l.label])), ...g.figures.map(f => [f.line, f.label])]);
      const known = lines ? [...lines].flatMap(([id, label]) => {
        const r = snapshot(id, series(id));
        return r && (r.value != null || r.text) ? [`${U.fieldHtml(label, { name: '读数' })} ${U.fieldHtml(readingText(r), { name: label })}`] : [];
      }) : [];
      card.classList.toggle('has-no-charts', ended || !!known.length);
      const chapter = card.querySelector('.grp__chapter');
      let note = chapter.querySelector('.computer-chart-end');
      if (!note) { note = document.createElement('p'); note.className = 'computer-chart-end'; note.dataset.keep = ''; chapter.prepend(note); }
      const publication = !offline() && publicationRevoked(state?.meta) ? publicationNote(g.name) : '';
      const reason = publication ? (card.querySelector('.grp__said')?.textContent.includes(publication) ? '' : publication)
        : ended ? offline() ? (known.length || g.hasOther?.() ? '曲线没存下来，连上后补上。' : state?.say || missing()) : pack?.gap || `${g.name}曲线暂时读不到` : known.length ? '曲线还在读' : '';
      note.hidden = !known.length && (!reason || offline() && card.querySelector('.grp__said')?.textContent.includes('这块没存下来'));
      U.html(note, [...known, U.fieldHtml(reason, { name: g.name })].filter(Boolean).join('　'));
    }
    const ready = weaveReady();
    if (ready) weaveCard.style.minHeight = '';
    const ended = ready && ![...chartGroups.keys()].some(group => group !== '长期');
    const waiting = offline() ? [] : activeGroups().filter(g => g.key !== 'long' && !chartDone.has(g.group));
    $('weave-card').classList.toggle('has-no-charts', ended);
    weaveEnd.hidden = !ended && !waiting.length;
    if (ended) {
      weaveRead?.done(false);
      U.html(weaveEnd, U.fieldHtml(offline() ? [...chartStates.values()].find(s => s.phase === 'gone')?.say || missing() : `${$('weave-title').querySelector('[aria-hidden="false"]').textContent}曲线暂时读不到`, { name: '曲线状态' }));
    } else if (waiting.length) {
      U.html(weaveEnd, `${waiting.map(g => esc(g.group)).join('、')}曲线正在读…`);
    }
  }
  const weaveMarks = () => {
    const start = Date.parse(charts?.from) / 1000, end = Date.parse(charts?.to) / 1000;
    weave.marks((computer?.stutters || []).map(s => ({ t: Date.parse(s.at) / 1000, seconds: s.seconds })).filter(m => m.t >= start && m.t <= end));
  };

  // ================= 页头：一句总的话、几组要留意、原因、重启会打断什么、设备 =================
  function headText(d) {
    const up = d.metrics?.find((m) => m.id === 'uptime');
    return up?.value && typeof up.value === 'object' ? up.value : up?.value != null ? `${Stat.text(up.value, up.unit, up)} · 连续开机${Stat.gap(up) ? ` · ${Stat.gap(up)}` : ''}` : tagText('cpu') || (offline() ? '电脑' : U.collectionText());
  }
  function renderCount(c) {
    const extra = ['yellow', 'red'].includes(computer?.stability?.level) ? [{ key: 'stability', name: '台式机稳定性', level: computer.stability.level, reason: computer.stability.text }] : [];
    const remote = (computer?.remote || []).filter(x => x.state === 'offline' || ['yellow', 'red', 'blue'].includes(x.level)).map(x => ({ ...x, key: 'remote-' + x.id, reason: x.why || x.text || '连不上' }));
    const update = updateWarning(), warnings = [...c.warn, ...extra, ...(update ? [update] : []), ...remote];
    const names = { cpu: 'CPU 温度', stutter: '卡顿', disk: '磁盘余量', network: '网络丢包',
      protection: '防护状态', 'audits.impersonation': '程序身份筛查' };
    const groupLevels = computer?.attention_count_basis?.group_levels, keys = Object.keys(groupLevels || names);
    const groups = { confirmed: [], review: [], unread: [] };
    if (computer?.attention_summary) Object.assign(groups, computer.attention_summary);
    else for (const key of keys) {
      const known = judge(key), level = groupLevels?.[key] || known?.level;
      const bucket = ['gray', 'off'].includes(level) ? 'unread' : ['red', 'yellow', 'blue'].includes(level) ? key === 'audits.impersonation' ? 'review' : 'confirmed' : '';
      if (bucket) groups[bucket].push({ ...known, key, level, name: names[key] || known?.name || key });
    }
    const when = t => t && Number.isFinite(Date.parse(t)) ? [U.date(t) === U.date(Date.now()) ? '' : U.date(t), U.time(t)].filter(Boolean).join(' ') : '';
    const at = g => when(g.at);
    // 卡顿（M004、M616）：“最后读到”只写最后一笔合格帧（recorded_at），统计截止时刻另写“数据截止”（observed_at；
    // 旧包这一项的 at 就是截止时刻）；缺帧写缺了什么、为什么（部分记录），只有 read_error 才写读取失败。
    // 旧包这一项没有 recorded_at 时用电脑分组“卡顿”那一行的，再没有就不写“最后读到”。
    const stutterNote = g => {
      const row = (computer?.groups || []).find(x => x.key === 'stutter') || {};
      const pick = key => Object.hasOwn(g, key) ? g[key] : row[key];
      const known = Object.hasOwn(g, 'recorded_at') || Object.hasOwn(row, 'recorded_at');
      const last = known && pick('recorded_at'), until = Object.hasOwn(g, 'observed_at') ? g.observed_at : Object.hasOwn(g, 'recorded_at') ? null : g.at;
      const gaps = [g.missing, row.missing].find(m => m && typeof m === 'object' && Object.keys(m).some(k => /[\u3400-\u9fff]/.test(k)));
      const reasons = gaps ? (Object.hasOwn(gaps, '卡顿采样') ? [gaps['卡顿采样']] : Object.values(gaps)).filter(v => v != null && U.fieldText(v).trim()) : [];
      const why = pick('read_error') === true ? '这次读取失败' : reasons.length ? `${reasons.map(v => U.fieldHtml(v, { name: '缺数原因' })).join('、')}，只有部分记录` : '';
      const times = [known && (when(last) ? '最后读到 ' + esc(when(last)) : '没读到合格帧记录'), when(until) && '数据截止 ' + esc(when(until))].filter(Boolean).join('，');
      return [why, times].filter(Boolean).join('；') || '判断用的读数不全';
    };
    const unreadNote = g => { if (g.key === 'stutter') return stutterNote(g); const stamp = at(g); return stamp ? '最后读到 ' + esc(stamp) : '没读到上次记录'; };
    const who = g => g.ai_fixing === true ? 'AI 已接手' : '还没有 AI 接手';
    const label = g => U.fieldHtml(g.name, { name: '检测分组' });
    // 已确认的那组写出是什么（用回包里同一句说明，如“防护状态：有防火墙配置未启用”），读到时刻和谁在处理放括号里；和安全页页顶同一种写法（M1010）
    const said = g => { const why = g.reason ?? g.why, text = why == null ? '' : U.fieldText(why).trim(); return text && text !== U.fieldText(g.name).trim() ? '：' + U.fieldHtml(why, { name: '异常说明' }) : ''; };
    const confirmed = groups.confirmed.map(g => g.key === 'network' ? networkLoss(g) : g).map(g => `${label(g)}${said(g)}（${[at(g) && esc(at(g)) + ' 读到', who(g)].filter(Boolean).join('，')}）`);
    const unread = g => {
      if (readingRecovered(g.key, g)) return [];
      const m = LIGHT_READINGS[g.key] && metric(LIGHT_READINGS[g.key]);
      const reason = m?.read_error ? esc(U.collectionText('', { ...m, source_at: m.at })) : unreadNote(m?.at ? { ...g, at: m.at } : g);
      return [`${label(g)}（${reason}）`];
    };
    const you = U.you(netViewer);
    const review = groups.review.map(g => {
      const href = route('/live/security/') + '#grp-impersonation';
      // 说清是什么、要做什么：程序身份筛查找出的是没签名或路径不常见的程序，要确认不是冒充的。
      const screening = /impersonation/.test(g.key || '');
      const fields = [Number.isInteger(g.programs) && (screening ? `${g.programs} 个程序没签名或路径不常见，要确认不是冒充的` : `${g.programs} 个程序名`),
        g.strong > 0 && `其中 ${g.strong} 个要尽快确认`, at(g) && `${at(g)} 读到`,
        g.ai_fixing === true ? 'AI 在逐个核对'
          : screening && g.strong === 0 ? `这些线索待核对，眼下不用${you}处理。`
          : `下一步：交给 AI 逐个核对签名和安装位置，${you}不用自己查；现在还没有 AI 接手`].filter(Boolean);
      return `<a href="${esc(href)}">${label(g)}${screening ? ' · 看是哪几个 ›' : ''}</a>（${esc(fields.join('；'))}）`;
    });
    // M666：后台给了缺组 missing_readings 就照它写（两版都写出缺的组名），能对上分组的带上次读到的时刻。
    const givenMissing = Array.isArray(computer?.missing_readings) ? [...new Set(computer.missing_readings.map(g => sp(U.fieldText(g?.name ?? g)).trim()).filter(Boolean))] : null;
    // 卡顿只缺使用状态覆盖时灯是绿的、不进 unread，但仍列在 missing_readings 里：详情回落到同一个包的 groups.stutter，
    // 那一行的 at 是数据截止、recorded_at 是最后一笔合格帧（M004，第 15 轮真包）
    const stutterRow = (computer?.groups || []).find(x => x.key === 'stutter');
    const rowFallback = name => name === names.stutter && stutterRow ? { key: 'stutter', name, ...(Object.hasOwn(stutterRow, 'recorded_at') ? { recorded_at: stutterRow.recorded_at } : {}),
      observed_at: stutterRow.at, missing: stutterRow.missing, read_error: stutterRow.read_error } : null;
    const lacking = givenMissing?.length ? givenMissing.flatMap(name => {
      const key = Object.keys(names).find(key => names[key] === name);
      const row = groups.unread.find(x => sp(U.fieldText(x.name)).trim() === name) || rowFallback(name)
        || computer?.groups?.find(g => (g.key ?? g.id) === key);
      return row ? unread({ ...row, key: row.key ?? key, name }) : [esc(name)];
    }) : groups.unread.flatMap(unread);
    const known = computer?.attention_count != null || computer?.attention_groups != null || computer?.attention_summary || !!givenMissing?.length;
    const lines = [`<b>已确认异常 ${confirmed.length} 组</b>${confirmed.length ? ' · ' + confirmed.join('；') : ''}`,
      lacking.length && `有 ${lacking.length} 项这次没读到（${lacking.join('、')}），电脑好不好先按读到的判断`,
      review.length && `<b>需核实 ${review.length} 组</b> · ${review.join('、')}`].filter(Boolean);
    part('count').hidden = !known;
    U.html(part('count'), known ? lines.map(line => `<span style="flex-basis:100%">${line}</span>`).join('') : '');
    part('warns').hidden = !warnings.length;
    U.html(part('warns'), warnings.map((g) => g === update
      ? `<li><a href="${esc(route('/live/security/') + '#grp-protection')}" style="white-space:nowrap">系统更新已装好，重启电脑后生效 ›</a></li>`
      : `<li><a href="#grp-${esc(g.key)}" data-goto="${esc(g.key)}">${U.status(g, { small: true }).lamp}<b>${U.fieldHtml(g.name, { name: '要留意的事', place: 'label' })}</b></a> <span>${keys.includes(g.key) ? '' : '另列 · '}${typeof g.name === 'object' ? U.fieldHtml(g.name, { name: '要留意的事' }) + ' ' : ''}${U.fieldHtml(g.reason, { name: '原因' })}</span></li>`).join(''));
    if (litHero) Light.lightUp([part('warns')]);
  }
  hero.addEventListener('click', (e) => {
    const a = e.target.closest('[data-goto]');
    if (!a) return;
    e.preventDefault();
    const remote = a.dataset.goto.startsWith('remote-');
    const card = remote ? part('devs').querySelector(`[data-remote="${CSS.escape(a.dataset.goto.slice(7))}"]`) : a.dataset.goto === 'stability' ? stabilityBoard.cards()[0] : $('board').querySelector(`.grp[data-key="${CSS.escape(a.dataset.goto)}"]`);
    if (!card) return;
    if (!remote) (a.dataset.goto === 'stability' ? stabilityBoard : board).open(a.dataset.goto, true);
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // 画上的读数标签：[组, 部件那一点 x%, y%, 标签 x%, y%]；换画要重新标点
  const TAGS = [
    { key: 'cpu', pt: [57.5, 38], at: [47.5, 22] },
    { key: 'gpu', pt: [54, 56], at: [44.5, 66] },
    { key: 'memory', pt: [65.5, 33], at: [72, 13] },
    { key: 'disk', pt: [68.2, 54], at: [86, 55] },
    { key: 'power', pt: [59, 74], at: [50, 85] },
    { key: 'network', pt: [76.5, 43], at: [89, 32] },
  ];
  function tagText(key) {
    const disk = metric('disk-free');
    const fields = { cpu: [['cpu', 'CPU'], ['cpu-temp', '温度']], gpu: [['gpu', '显卡'], ['gpu-temp', '温度']], memory: [[pressureLine(), '内存占用']],
      disk: [['disk-free', disk?.note ? `${sp(disk.note)}剩余` : '最紧的盘剩余']], power: [['power-total', seriesName(series('power-total'), '整机功率')]],
      network: [networkTag()] };
    if (key === 'disk' && disk?.note && typeof disk.note === 'object') return disk.note;
    const reads = fields[key].map(([id, label]) => [label, reading(id)]);
    const marked = reads.find(([, r]) => r.text && typeof r.text === 'object');
    if (marked) return marked[1].text;
    const text = reads.filter(([, r]) => r.value != null).map(([label, r]) => `${U.fieldText(label)} ${readingText(r)}`).join(' · ');
    if (text && key === 'disk' && disk?.days_to_full != null && snapshot('disk-free', null)?.value != null) return [text, fullText(disk.days_to_full), fullBasis(disk)].filter(Boolean).join(' · ');
    const used = key === 'memory' && reading('memory-capacity');
    if (typeof used?.text === 'object') return used.text;
    return used?.value != null ? `内存 ${used.text ?? Chart.value(used.value, used.unit)}${Number.isFinite(metric('memory-total')?.value) ? ' / ' + capacity('memory-total') : ''} · ${readingCaption(used)}` : text;
  }

  function networkTag() {
    return ['yellow', 'red'].includes(judge('network')?.level) && reading('net-loss').value != null
      ? ['net-loss', '丢包'] : ['download', '下载'];
  }
  function renderTags() {
    const frame = hero.querySelector('.mach').getBoundingClientRect(), scale = Math.max(frame.width / 2000, frame.height / 667);
    const point = ([x, y]) => [(x / 100 * 2000 * scale - (2000 * scale - frame.width) / 2) / frame.width * 100, (y / 100 * 667 * scale - (667 * scale - frame.height) / 2) / frame.height * 100];
    const NAME = { cpu: 'CPU', gpu: '显卡', memory: '内存', disk: '磁盘', power: '整机', network: '网络' };
    const pendingTags = activeGroups().filter(g => ['memory', 'network'].includes(g.key) && !chartDone.has(g.group)).map(g => g.key);
    U.html(part('lines'), TAGS.map((t) => { const pt = point(t.pt), at = point(t.at); return `<line x1="${pt[0]}" y1="${pt[1]}" x2="${Math.min(94, Math.max(12, at[0]))}" y2="${at[1]}"/>`; }).join(''), false);
    U.html(part('tags'), TAGS.map((t) => {
      const pt = point(t.pt), at = point(t.at);
      const text = tagText(t.key), reading = metric(({ cpu: 'cpu', gpu: 'gpu', memory: 'memory', disk: 'disk-free', power: 'power-total', network: 'net-down' })[t.key]);
      const go = t.key === 'gpu' ? 'cpu' : t.key;
      const empty = offline() ? '' : `${NAME[t.key]} ${pendingTags.includes(t.key) ? '正在读…' : U.collectionText()}`;
      const body = U.fieldHtml(text || empty, { name: NAME[t.key] }), marker = body.includes('live-mark');
      const shown = ['gpu', 'power'].includes(t.key) && !marker && typeof text === 'string' && text.includes('上次实测')
        ? `<span>${body.replaceAll('上次实测', '<span class="mach__tag-note">上次实测</span>')}</span>` : body;
      return `<i class="mach__pt" style="left:${pt[0]}%;top:${pt[1]}%"></i><${marker ? 'span' : 'a'} class="mach__tag${text ? '' : ' is-none'}"${offline() && !text ? ' hidden' : ''}${marker ? '' : ` href="#grp-${go}" data-goto="${go}"`} style="left:${Math.min(94, Math.max(12, at[0]))}%;top:${at[1]}%">${U.status(reading, { small: true }).lamp}${shown}</${marker ? 'span' : 'a'}>`;
    }).join(''));
    // 窄窗把长浮签折在插画里。宽窗沿用浮签的单行排版和原来的避让边界。
    const narrow = matchMedia('(max-width: 1100px)').matches, body = hero.querySelector('.card__body');
    const left = narrow ? frame.left + 12 : body.getBoundingClientRect().right - parseFloat(getComputedStyle(body).paddingRight) + 16;
    const right = (narrow ? frame.right : hero.querySelector('.card__glass').getBoundingClientRect().right) - 12;
    for (const tag of part('tags').querySelectorAll('.mach__tag:not([hidden])')) {
      const r = tag.getBoundingClientRect();
      const shift = narrow ? Math.max(left - r.left, Math.min(0, right - r.right)) : Math.max(0, Math.min(left - r.left, right - r.right));
      if (r.width && shift) tag.style.left = `calc(${tag.style.left} + ${shift.toFixed(1)}px)`;
    }
  }

  const PC = { main: 'main', secondary: 'sub', secondary_laptop: 'sub' };   // 连接电脑页上的哪一台
  const DEV_NAME = { main: '台式机', secondary: '笔记本', secondary_laptop: '笔记本', phone: '手机' };
    const DEV_STATE = { online: '在线', offline: '连不上', unknown: U.collectionText() };
  const hardwarePane = $('desktop-config');
  const hardwareToggle = () => hero.querySelector('[data-desktop-config-toggle]');
  hero.addEventListener('click', (event) => {
    if (!event.target.closest('[data-desktop-config-toggle], [data-desktop-config-close]')) return;
    const toggle = hardwareToggle();
    const open = hardwarePane.hidden;
    hardwarePane.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    const target = open ? $('desktop-config-title') : toggle;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  function hardwareDetails(rows, title) {
    const group = (key, name, items = rows.filter(row => row.group === key)) =>
      `<section class="desktop-config__group"><h3>${name}</h3><dl>${items.map(row =>
        `<div><dt>${esc(row.label)}</dt><dd>${U.fieldHtml(row.spec, { name: row.label })}</dd></div>`).join('')}</dl></section>`;
    const screens = rows.filter(row => row.group === 'screens');
    const cooler = rows.find(row => row.screen);
    if (cooler) screens.splice(1, 0, { label: '水冷屏', spec: cooler.screen });
    return `<div class="desktop-config__head"><h2 id="desktop-config-title" tabindex="-1">${title}</h2>
      <button class="desktop-config__action" type="button" data-desktop-config-close>收起 <span aria-hidden="true">‹</span></button></div>
      <div class="desktop-config__columns"><div>${group('host', '主机')}${group('storage', '硬盘')}</div>
      <div>${group('screens', '屏幕', screens)}${group('former', '以前的主屏')}${hardwareSpecHtml()}</div></div>`;
  }

  let homeDevices = null, devicesWatch = null, streamProject = null, streamWatch = null, streamAudience = null;
  function watchStream(d) {
    const native = d?.remote?.find(x => x.connection_type === 'moonlight')?.streaming;
    const need = native && !params.has('fixture') &&
      (!native.started_at || ![native.capture?.width, native.capture?.height, native.capture?.hz].every(Number.isFinite));
    if (need && streamWatch && streamAudience === netViewer) return;
    streamWatch?.stop(); streamWatch = null; streamProject = null; streamAudience = netViewer;
    if (!need) return;
    const viewer = netViewer;
    streamWatch = window.Live.watch('projects/sunshine-remote-streaming', null, {
      data(project, meta) {
        if (netViewer !== viewer) return;
        streamProject = meta.viewer?.kind === viewer ? project : null;
        renderDevices(computer || {});
      },
      link(state) {
        if (netViewer === viewer && streamProject && state.data == null && ['none', 'gone'].includes(state.phase)) {
          streamProject = null;
          renderDevices(computer || {});
        }
      },
    });
  }
  function renderDevices(d) {
    const list = (d.devices?.length ? d.devices : homeDevices || []).map(U.laptopConnection);
    const hasHardware = x => x.configuration?.length || [].concat(x.hw || []).some(Boolean);
    let hardware = '';
    part('devs').classList.toggle('has-hardware', list.some(hasHardware));
    U.html(part('devs'), list.filter(x => !offline() || ['online', 'offline'].includes(x.state) || hasHardware(x) || laptopUnavailable(x)).map((x) => {
      // 页面连不上时台式机不写“在线”（那是断开前的旧状态，和顶上“连不上电脑”打架），用现成的“连不上”（M741）。
      const isLaptop = x.id === 'secondary_laptop';
      const reported = (isLaptop ? DEV_STATE[x.state] : x.text || DEV_STATE[x.state]) || '';
      const disconnected = !isLaptop && offline() && (/^(电脑不在线|不在线)$/.test(x.text || '') || x.id === 'main' && !x.text && x.state === 'online');
      const unavailable = laptopUnavailable(x);
      const state = unavailable || offSinceText(x) || (disconnected ? '连不上' : reported);
      const badge = `${U.status(x, { small: true }).lamp}<b>${U.fieldHtml(DEV_NAME[x.id] || x.label || x.name || x.title || x.text || x.id, { name: DEV_NAME[x.id] || '设备', place: 'label' })}</b>`;
      const reading = U.fieldHtml(state, { name: '设备状态', place: 'label' });
      const inner = badge + reading;
      const pc = x.pc || PC[x.id];
      const detail = { phone: '/live/phone/', secondary_laptop: '/live/laptop/' }[x.id];
      const connect = pc ? `<a class="dev-pill" href="/mcp/?pc=${esc(pc)}" data-needs-pc>${detail ? '远程连接 ›' : inner}</a>` : '';
      const readingLink = `${reading} ›`;
      const detailReading = unavailable ? `<span class="dev-laptop-unavailable">${readingLink.replace(/读不到|\d\d-\d\d \d\d:\d\d 起 ›/g, '<span>$&</span>')}</span>` : readingLink;
      const pill = detail ? `<a class="dev-pill" href="${esc(route(detail))}">${badge}${detailReading}</a>${connect}` : connect || `<span class="dev-pill">${inner}</span>`;
      const notes = [x.name, x.text].map(value => U.fieldHtml(value, { name: '设备信息' })).filter(html => html.includes('live-mark')).join(' ');
      if (x.id === 'main' && x.configuration?.length) {
        const rows = x.configuration;
        hardware = hardwareDetails(rows, inner);
        // 标题数和展开里列出的对上：主机、硬盘、屏幕（含水冷屏）算项数，以前的主屏另写（M264）。
        const shown = rows.filter(row => ['host', 'storage', 'screens'].includes(row.group)).length + (rows.some(row => row.screen) ? 1 : 0);
        const former = rows.filter(row => row.group === 'former').length;
        // 数和单位不拆行（“32 GB”不折成“32 / GB”）。
        const summary = rows.filter(row => row.brief).map(row => `<div><dt>${esc(row.label)}</dt><dd>${unitHtml(row.brief === true ? row.spec : row.brief, row.label)}</dd></div>`).join('');
        return `<div class="dev-spec">${pill}${notes ? `<p class="row__sub">${notes}</p>` : ''}
          <dl class="desktop-config__summary">${summary}</dl>
          <button class="desktop-config__action" type="button" aria-controls="desktop-config" aria-expanded="${!hardwarePane.hidden}" data-desktop-config-toggle>
            <span>全部配置（${shown} 项${former ? `，另有以前的主屏 ${former} 台` : ''}）</span><span>收起</span><span aria-hidden="true">›</span></button></div>`;
      }
      let hw = [].concat(x.hw || []).filter(Boolean).flatMap(s => typeof s === 'object' ? [s] : sp(s).split(' · '));
      if (x.id === 'main') for (const [id, label] of [['gpu-model', '显卡'], ['cpu-model', 'CPU']]) { const m = metric(id); if (m?.value && !hw.some(s => typeof s === 'object' && s.hidden_what && s.hidden_what === m.value.hidden_what || typeof s === 'string' && (s.startsWith(label + '：') || s.startsWith(label + ':') || sp(m.value).startsWith(s) || s.includes(sp(m.value))))) hw.unshift(typeof m.value === 'object' ? m.value : `${label}：${sp(m.value)}`); }
      // 笔记本这会儿读不到时，下面的电量是上次读到的，写明，不跟“读不到”打架。
      const battery = x.id === 'secondary_laptop' && (!offline() || x.battery?.percent != null) ? `<p class="row__sub">${U.fieldHtml(x.battery?.percent && typeof x.battery.percent === 'object' ? x.battery.percent : laptopBattery(x, Date.parse(lastState?.now || at) || Date.now()), { name: '电量' })}</p>` : '';
      // 笔记本的系统写在笔记本格里（原来夹在“机器自己”卡里）。
      const os = x.id === 'secondary_laptop' && x.os != null ? `<p class="row__sub">${U.fieldHtml(typeof x.os === 'object' ? x.os : `系统 ${sp(x.os)}`, { name: '笔记本系统' })}</p>` : '';
      hw = U.mergePrivateRows(hw, { kind: netViewer });
      // 后台给了 presence、两条路的证据都不够（unknown），调试连接也不是确实断了：格里大字照旧，这句放进小字（主持 11-26 01:56 定）
      const linkNote = x.id === 'phone' && x.presence?.state === 'unknown' && x.state !== 'offline' ? '<p class="row__sub">手机连接状态暂时读不到</p>' : '';
      return `<div class="dev-spec">${pill}${notes ? `<p class="row__sub">${notes}</p>` : ''}${linkNote}${hw.length ? `<p class="row__sub row__hw"${x.hw_at ? ` title="${esc(`${U.date(x.hw_at)} ${U.time(x.hw_at)} 的硬件信息`)}"` : ''}>${hw.map(s => s.private_count ? `<span class="computer-hw-item">${U.privateSummary(s.private_count, { unit: '项' })}</span>` : `<span class="computer-hw-item" title="${U.fieldHtml(s, { name: '硬件信息', place: 'label' })}">${unitHtml(s)}</span>`).join('')}</p>` : ''}${os}${battery}</div>`;
    }).join('') + remoteEntries(d.remote));
    U.html(hardwarePane, hardware, false);
    if (!hardware) hardwarePane.hidden = true;
  }
  const readingStamp = at => at && Number.isFinite(Date.parse(at)) ? [U.date(at), U.time(at)].filter(Boolean).join(' ') : '';
  function laptopUnavailable(x) {
    if (x.id !== 'secondary_laptop' || x.availability !== 'unavailable') return '';
    const since = readingStamp(x.unavailable_since);
    return '笔记本状态暂时读不到' + (since ? ` · 自 ${since} 起` : '');
  }
  // 几点起离线（本人 11-25 23:19 选 A：台式机、笔记本那一行写“HH:MM 起离线”）：
  // 台式机看页面确认离线时边缘给的关机时刻（X-Live-Offline-Since）；笔记本看后台 offline_since（这次持续离线的第一次观察，M918）
  // 手机那一行和实况首页、手机页同一套（主持 11-26 定）：调试连接和 Tailscale 都找不到才叫离线（presence 同级的 offline_since），
  // 只有电脑到手机的调试连接断写“电脑连不上 · HH:MM 起”（offline.since），手机这时可能还在线
  function offSinceText(x) {
    const link = lastState?.link;
    // 带不带日期拿现在的北京日期比（和页顶“电脑 HH:MM 起离线”一致）；不拿这份数的时刻当今天，电脑离线跨了零点时那份数还是昨天的
    const stamp = since => `${U.date(since) !== U.date(Date.now()) ? `${U.date(since)} ` : ''}${U.time(since)}`;
    // 只断调试连接：这格已印着“手机”，写“电脑连不上”，看得出是电脑这头连不上它、手机可能还在线（主持 11-26 定）；
    // 没有起点、后台也没给别的说法时同样写“电脑连不上”，不写成像手机自己毛病的“连不上”
    if (x.id === 'phone' && x.presence?.state !== 'offline' && x.state === 'offline') {
      const since = Number.isFinite(Date.parse(x.offline?.since)) ? ` · ${stamp(x.offline.since)} 起` : '';
      if (since || !x.text) return `电脑连不上${since}`;
    }
    const since = x.id === 'main' && offline() && link?.reason === 'host-off' ? link.offSince
      : x.id === 'secondary_laptop' && x.state === 'offline' ? x.offline_since
      : x.id === 'phone' && x.presence?.state === 'offline' ? x.offline_since : null;
    return Number.isFinite(Date.parse(since)) ? `${stamp(since)} 起离线` : '';
  }
  function unitHtml(text, name = '硬件信息') { const body = U.fieldHtml(text, { name }); return body.includes('live-mark') ? body : body.replace(/\d+(?:[.,]\d+)*\s*(?:[GMKT]B|ms|GHz|MHz|Hz|℃|次|个|%)/g, '<span class="computer-unit">$&</span>'); }
  function remoteEntries(items) {
    if (!items?.length) return U.offline?.() ? '' : `<span class="dev-spec row__sub">远程入口${U.collectionText()}</span>`;
    return items.filter(x => !U.offline?.() || x.state !== 'unknown').map(x => {
      const isMcp = x.id === 'main-mcp' || x.id === 'secondary-mcp';
      // 探过但没探出结果（超时、网络错）时 at 是那次探测的时间：写“这次没探出通不通”，时间写“探测”，不写“没有记录”配“实测”。
      const probed = x.state === 'unknown' && !!readingStamp(x.at);
      const state = x.state && typeof x.state === 'object' ? x.state : probed ? '这次没探出通不通' : ({ online: isMcp && !x.authenticated_at ? '入口通' : '通', offline: '不通', unknown: U.collectionText() })[x.state] || U.collectionText();
      const inner = `${U.status(x, { small: true }).lamp}${U.fieldHtml(x.name || '远程入口', { name: '远程入口', place: 'label' })} · ${U.fieldHtml(state, { name: '连接状态', place: 'label' })}`;
      const note = U.fieldHtml({ value: '', visibility: x.visibility }, { name: '连接地址', kind: netViewer });
      const href = typeof x.href === 'string' ? x.href : '', localLink = href.startsWith('/mcp/');
      const nameNote = [x.name, x.state].map(value => U.fieldHtml(value, { name: '远程入口' })).filter(html => html.includes('live-mark')).join(' · ');
      const stamp = readingStamp(x.state === 'online' && x.authenticated_at || x.at), stampText = stamp && `${esc(stamp)} ${probed ? '探测' : '实测'}`;
      // 串流和旁边两条 MCP 一样标上读到的时刻（M759）。
      if (x.connection_type === 'moonlight') return `<div class="dev-spec" data-remote="${esc(x.id || '')}"><span class="dev-pill">${inner}</span><p class="row__sub">${[nameNote, stampText, ...[x.host, x.connect_hint].filter(Boolean).map(value => U.fieldHtml(value, { name: '串流连接信息' }))].filter(Boolean).join(' · ')}</p>${x.streaming ? window.ComputerDraw10?.streaming(x.streaming, netViewer, streamProject) || '' : ''}</div>`;
      // MCP 接口本身只认 AI 客户端，浏览器打开是一页 405；“MCP 地址”改去连接电脑页，那里写着地址和怎么连。
      const mcpPage = isMcp && !localLink && route(`/mcp/?pc=${x.id === 'secondary-mcp' ? 'sub' : 'main'}`);
      const label = localLink ? '连接电脑 ›' : isMcp ? 'MCP 地址和连法 ›' : href;
      const link = href && (netViewer === 'owner' || x.visibility !== 'owner') ? `<a class="more" href="${esc(mcpPage || href)}" data-needs-pc>${esc(label)}</a>` : note || U.fieldHtml(x.href || U.collectionText(), { name: '连接地址' });
      return `<div class="dev-spec" data-remote="${esc(x.id || '')}"><span class="dev-pill">${inner}</span><p class="row__sub">${[nameNote, stampText, link].filter(Boolean).join(' · ')}</p></div>`;
    }).join('');
  }
  function updateWarning() {
    const m = metric('os-update');
    return m?.value === 'reboot_required' ? { key: 'machine', name: '系统更新', ...m, reason: updateReason(m) } : null;
  }

  function updateReason(m) {
    const since = m.value === 'reboot_required' ? readingStamp(m.reboot_since) : '';
    return since ? `装好了 · ${since} 起等重启` : hostText('os-update', m);
  }

  function interruptItem(item) {
    if (typeof item.href !== 'string' || !item.href) return '';
    return `<a class="hero__item" href="${esc(route(item.href))}">${U.fieldHtml(item.text || item.name, { name: '正在运行的任务', place: 'label' })} <span class="more__chev">›</span></a>`;
  }

  function renderHero(d) {
    U.html(part('head'), U.status(d).lamp + U.head(headText(d), { lamp: false }));
    const it = d.interrupt;
    const said = !it ? '' : it.text ? offline() && typeof it.text === 'string' ? it.text.replace(/^现在/, '') : it.text : it.q === 'ok' && !it.chats && !it.tasks ? '现在重启不打断什么' : '';
    const jobs = it?.items || [];
    const hasChats = jobs.some(x => x.open?.conversation || x.live === true);
    const chatLink = hasChats ? `<a class="hero__item" href="${esc(route('/live/chats/'))}">看正在进行的 AI 对话 <span class="more__chev">›</span></a>` : '';
    const taskLinks = jobs.filter(x => !x.open?.conversation && x.live !== true).map(interruptItem).join('');
    const links = chatLink + taskLinks;
    const gap = it?.gap ? `<small class="row__sub">${U.fieldHtml(it.gap, { name: '重启前可参考的信息' })}</small>` : '';
    const why = typeof d.why === 'string' && (d.missing_readings?.length || d.attention_summary?.unread?.length)
      ? d.why.replace(/^判断状态的读数不完整[，,。]?/, '') : d.why;
    const note = U.status({ ...d, why, attention_count: null, gray_count: null }, { showZeroFixing: false }).note;
    const hardwareNote = computer && !offline() && publicationRevoked(hardware?.meta) ? `<span>${esc(publicationNote('电脑读数'))}</span>` : '';
    part('note').hidden = !(said || note || links || hardwareNote);
    U.html(part('note'), note + (said ? `<span>${U.fieldHtml(said, { name: '重启影响' })}</span>` : '') + gap + links + hardwareNote);
    renderGrafana();
    renderDevices(d);
    renderTags();
  }
  const tone = (d) => U.status(d).tone;

  function renderNotices(state) {
    U.list(notices, state.offline
      ? [{ key: 'link', cls: 'notice glass', html: `${U.status(state).lamp}<span>${U.fieldHtml(state.text, { name: '连接状态' })}</span>` }] : []);
  }

  // ================= 页眉〔问情况〕：页头那句 + 要留意的 + 几样读数 =================
  function ask() {
    if (!computer) return '';
    const c = board.counts();
    const said = [headText(computer), ...c.warn.map((g) => `${U.fieldText(g.name)}：${U.fieldText(g.reason)}`), ...TAGS.map((t) => tagText(t.key)).filter(Boolean)];
    return `请看实况电脑${at ? `（${U.time(at)} 的数）` : ''}：${said.map(U.fieldText).join('；')}。请说明现在的情况。`;
  }
  const bar = U.topbar({ ask });

  // ================= 取数：/computer（读数、好坏、卡过、设备）和 /computer/charts（曲线） =================
  const heroRead = U.reading(hero.querySelector('.card__body'), { ghost: U.ghost.card(2), name: '电脑' });
  let litHero = false, first = true;
  function lightUp() {
    if (litHero) return;
    litHero = true;
    Light.lightUp([hero, part('warns'), ...stabilityBoard.cards(), ...board.cards(), $('weave-card'), notices]);
  }

  refresh();
  const responsiveness = window.ComputerResponsiveness?.mount($('responsiveness'));
  window.Live.watch('computer', null, {
    phase(state) {
      if (state.data != null || mainRevoked) return;
      heroRead.set(state);
      if (!stateDone && (state.phase === 'none' || state.phase === 'gone')) { stateDone = true; refresh(); }
    },
    data: (raw, meta) => keepWeavePosition(() => {
      netViewer = meta.viewer?.kind || 'public';
      const previousGroups = activeGroups().map(g => g.group).join('\n');
      mainComputer = raw;
      mainRevoked = !offline() && publicationRevoked(meta);
      computer = applyHardware(raw);
      watchStream(raw);
      responsiveness?.(raw?.responsiveness, netViewer);
      window.DisplayRecovery?.watch(raw?.display_recovery?.href, () => { if (stabilityEl && stabilityDetail) U.html(stabilityEl, stabilityDetails(stabilityDetail)); });
      renderStability();
      if (raw && !raw.devices?.length && !devicesWatch) devicesWatch = window.Live.watch('home', null, {
        data(d) { homeDevices = d?.computer?.devices || []; renderDevices(computer || {}); },
      });
      const d = computer || {};
      grafana = d.grafana || null;
      at = meta.at;
      renderHero(d);
      if (previousGroups !== activeGroups().map(g => g.group).join('\n')) watchCharts();
      else {
        if (charts) paintCharts(false);
        refresh();
      }
      weaveMarks();
      gfState();
      if (raw) {
        Light.tone(hero, tone(raw));
        heroRead.done();
        if (first) showAnchor();
        first = false;
      }
      requestAnimationFrame(lightUp);
    }),
    link: state => keepWeavePosition(() => {
      lastState = state;
      const wasRevoked = mainRevoked;
      mainRevoked = !state.offline && !state.publicPaused && publicationRevoked(state.meta);
      gfState();
      if (computer) { refresh(); renderHero(computer); renderStability(); drawExits(); }
      bar?.set(state);
      Light.offline(state.offline);
      renderNotices(state);
      if (state.data == null && state.phase === 'none') {
        if (mainRevoked) heroRead.done(false); else heroRead.set(state);
        U.html(part('head'), U.head(mainRevoked ? publicationNote('电脑读数') : state.text || U.collectionText()));
        requestAnimationFrame(lightUp);
      }
      if (state.data == null && (!stateDone || mainRevoked !== wasRevoked) && (state.phase === 'none' || state.phase === 'gone')) { stateDone = true; refresh(); }
      if (state.phase === 'gone') requestAnimationFrame(lightUp);
      U.blockNote(hero.querySelector('.card__body'), state);
    }),
  });
  // 硬件小包：页面看得见时约每 5 秒取一次，只换 CPU 占用、内存和 CPU 温度这几行，不重取整包（M519）
  // 小包不带 rev，data 只来第一次；每读完一次都会来的是 link。
  window.Live.watch('computer/hardware', null, {
    link: state => {
      const wasRevoked = publicationRevoked(hardware?.meta);
      hardware = state;
      const revoked = publicationRevoked(state.meta);
      const next = revoked ? mainComputer : applyHardware(computer);
      if (next !== computer || revoked !== wasRevoked) keepWeavePosition(() => {
        computer = next;
        if (revoked && charts) paintCharts(false);
        refresh();
        if (computer) renderHero(computer);
      });
    },
  });

  // —— 24 小时／近 7 天：换一档就换一份曲线（近 7 天是小时均值），组的样子不变 ——
  function updateChartTargets() {
    // 等首帧卡框排好再观察，已定位的默认分组可以先于摘要读取。
    if (!chartsWatch || !chartsLayoutReady) return;
    const groupsBySeries = new Map(charts?.series?.map(s => [s.id, s.group]));
    const rows = [...$('weave').querySelectorAll('[data-series]')];
    const cpuCard = board.cards().find(card => card.dataset.key === 'cpu');
    chartsWatch.targets(g => [
      ...board.cards().filter(card => card.dataset.key === g.key),
      // 机箱标签和大图共用读数；缺即时值时首屏也读取历史样本。
      ...(['cpu', 'power'].includes(g.key) || g.key === 'memory' && snapshot(pressureLine()) == null ||
        g.key === 'network' && snapshot(networkTag()[0]) == null ? [hero.querySelector('.mach')] : []),
      // CPU 卡片还显示电源组的小图和机器组的显卡降频时间轴。
      g.key === 'power' ? cpuCard?.querySelector('.grp__chips') : null,
      g.key === 'machine' ? cpuCard?.querySelector('[data-x="tl"]') : null,
      ...(g.key === 'long' ? [] : chartDone.has(g.group)
        ? rows.filter(row => groupsBySeries.get(row.dataset.series) === g.group)
        : [$('weave-card')]),
    ].filter(Boolean));
  }

  function timedSeries(s, pack) {
    const from = s.from ?? pack.from, to = s.to ?? pack.to;
    const daily = s.group === '长期' || s.id === 'disk-free' && Date.parse(to) - Date.parse(from) > 7 * DAY * 1000;
    const bucketSeconds = s.bucket_seconds ?? s.step_seconds ?? (daily ? DAY : pack.bucket_seconds ?? pack.step_seconds ?? 0);
    const gaps = s.group === '长期' && !s.id.endsWith('-eff-90d') ? longGaps(s, pack) : null;
    const chart_window = { from, to, bucket_seconds: bucketSeconds, bucket_offset_seconds: daily ? -BEIJING_OFFSET : 0,
      missing_intervals: gaps?.length ? gaps : s.missing_intervals ?? pack.missing_intervals ?? gaps, off_spans: daily || bucketSeconds >= DAY ? [] : pack.off_spans };
    return { state: pack.state, reason: pack.reason, aggregation: pack.aggregation, ...s, from, to, chart_window,
      ...(!hasSamples(s) && s.gap ? { reason: s.gap } : {}) };
  }
  function chartLines(group, pack) {
    const lines = (pack.series || []).filter(s => s.group === group && !retiredGpuTemperature(s));
    if (group === '内存') {
      const older = lines.find(s => s.id === 'memory');
      if (!older) return lines;
      const id = older.unit === '%' ? 'mem-pressure' : 'memory-capacity';
      return hasSamples(lines.find(s => s.id === id)) ? lines.filter(s => s !== older)
        : [...lines.filter(s => s !== older && s.id !== id), { ...older, id }];
    }
    if (group !== '长期') {
      const native = lines.find(s => s.id === 'gpu-temp'), legacy = lines.find(s => s.id === 'gpu-core-temp');
      const core = hasSamples(native) || Number.isFinite(native?.latest?.value) ? native : legacy || native;
      return lines.flatMap(s => s === core ? [{ ...s, id: 'gpu-temp', label: '显卡核心温度' }]
        : s.id === 'gpu-temp' || s.id === 'gpu-core-temp' ? [] : [s]);
    }
    const clean = lines.filter(s => !/^h\d+-高负载/.test(s.id));
    for (const device of ['cpu', 'gpu']) for (const [field, unit] of [['samples', '次'], ['seconds', '秒']]) {
      const id = `${device}-${field}-90d`, points = (pack.day_coverage || []).map(d => [d.day_start, d.state === 'read' ? d[`${device}_${field}`] ?? null : null]);
      if (!clean.some(s => s.id === id) && points.some(([, v]) => Number.isFinite(v))) clean.push({ id, group, unit, points });
    }
    return clean;
  }
  function appendMemorySample(s) {
    const pressure = s.id === pressureLine() && s.unit === '%';
    const capacity = s.id === 'memory-capacity' && s.unit === 'B';
    if ((!pressure && !capacity) || !hasSamples(s) || offline()) return s;
    const m = metric(NOW[s.id] || s.id), latest = Date.parse(m?.at) / 1000;
    const from = Date.parse(s.from) / 1000, end = Date.parse(s.to) / 1000;
    if (m?.unit !== s.unit || m.q !== 'ok' || m.read_error || m.timestamp_basis !== 'sample'
        || !Number.isFinite(m.value) || m.value < 0 || pressure && m.value > 100
        || !(latest > end && end > from && latest <= Date.now() / 1000)) return s;
    const start = latest - (end - from), lower = new Date(start * 1000).toISOString(), upper = new Date(latest * 1000).toISOString();
    const points = [...s.points.filter(([t]) => t >= start && t <= end), [latest, m.value]];
    const misses = s.chart_window.missing_intervals || [];
    const step = s.chart_window.bucket_seconds || (span === '7d' ? 3600 : 60);
    const late = latest - end > step;
    if (late) points.splice(-1, 0, [end + step / 2, null]);
    const gaps = misses;
    return { ...s, from: lower, to: upper, points, latest_instant_at: upper, minute_mean_end: late ? new Date(end * 1000).toISOString() : null,
      latest: { at: upper, value: m.value, unit: s.unit },
      stats: { ...Chart.sum({ points }), count: points.filter(([, v]) => Number.isFinite(v)).length },
      chart_window: { ...s.chart_window, from: lower, to: upper, missing_intervals: gaps } };
  }
  function paintCharts(rangeChange) {
    const frames = [...chartGroups].filter(([g, p]) => g !== '长期' && Date.parse(p.from) < Date.parse(p.to)).map(([, p]) => p);
    const frame = frames.length ? { from: frames.reduce((a, p) => Date.parse(a) < Date.parse(p.from) ? a : p.from, frames[0].from),
      to: frames.reduce((a, p) => Date.parse(a) > Date.parse(p.to) ? a : p.to, frames[0].to) } : chartGroups.get('长期');
    charts = frame ? { from: frame.from, to: frame.to, fadeNewCharts: rangeChange, series: [...chartGroups].flatMap(([group, p]) => chartLines(group, p).map(s => appendMemorySample(timedSeries(s, p)))) } : null;
    if (charts && !chartGroups.has('电源和温度') && !chartDone.has('电源和温度')) {
      for (const id of ['gpu-power', 'cpu-vcore', 'gpu-vcore']) charts.series.push({ id, group: '电源和温度', points: [], state: 'computing' });
    }
    board.data(charts);
    paintWeave(charts);
    weaveMarks();
  }

  function revokeChart(group, state) {
    if (publicationRevoked(chartStates.get(group)?.meta)) return;
    chartGroups.delete(group);
    chartDone.add(group);
    chartStates.set(group, state);
    paintCharts(false);
    refresh();
    renderTags();
  }
  function watchCharts(rangeChange = false) {
    if (rangeChange) {
      weaveCard.style.minHeight = `${weaveCard.offsetHeight}px`;
      Chart.finishReveals();
      weave.set(null);
    }
    chartsWatch?.stop();
    chartsWatch = null;
    const wanted = activeGroups(), names = new Set(wanted.map(g => g.group));
    for (const group of new Set([...chartGroups.keys(), ...chartDone, ...chartStates.keys()])) {
      if ((rangeChange && group !== '长期') || !names.has(group)) {
        chartGroups.delete(group); chartDone.delete(group); chartStates.delete(group);
      }
    }
    for (const title of rangeTitles) title.setAttribute('aria-hidden', String(title.dataset.weaveTitle !== span));
    $('weave-bucket').textContent = weaveBucket();
    for (const button of rangeButtons) button.setAttribute('aria-pressed', String(button.dataset.range === span));
    paintCharts(rangeChange);
    refresh();
    const width = g => {
      const card = $('board').querySelector(`.grp[data-key="${CSS.escape(g.key)}"]`);
      const chapter = card?.querySelector('.grp__chapter');
      // 在读时雾会藏起绘图区，先用已经排好的章节和织锦的实际横向布局。
      const chapterCss = chapter && getComputedStyle(chapter);
      const heroWidth = chapter && ((chapter.clientWidth || $('board').clientWidth) - parseFloat(chapterCss.paddingLeft) -
        parseFloat(chapterCss.paddingRight) - parseFloat(getComputedStyle(card.querySelector('.grp__main')).columnGap)) * 1.3 / 2.3;
      const ribbon = $('weave').querySelector('.vz-weave__over'), ribbonCss = getComputedStyle(ribbon);
      const ribbonWidth = ribbon.clientWidth || $('weave').clientWidth - parseFloat(ribbonCss.left) - parseFloat(ribbonCss.right);
      return Math.max(V.chartWidth(card?.querySelector('.grp__main')) || heroWidth || 0, g.key === 'long' ? 0 : ribbonWidth || 0);
    };
    const noteHost = g => board.cards().find(card => card.dataset.key === g.key)?.querySelector('.card__body');
    chartsWatch = window.watchComputerChartViewport(wanted, (g, read) => {
      const watch = V.watchChart('computer/charts', g.group, g.key === 'long' ? '24h' : span, () => width(g), {
      link(state) {
        read(state.data != null || state.phase === 'none' || state.phase === 'gone');
        U.blockNote(noteHost(g), state);
      },
      phase: state => keepWeavePosition(() => {
        if (state.data != null) return;
        if (!state.publicPaused && publicationRevoked(state.meta)) { revokeChart(g.group, state); return; }
        if (!['none', 'gone'].includes(chartStates.get(g.group)?.phase) || ['none', 'gone'].includes(state.phase)) chartStates.set(g.group, state);
        board.groupPhase(g.key, state);
        if (state.phase === 'none' || state.phase === 'gone') {
          chartDone.add(g.group); paintWeave(charts); refresh(); renderTags();
        } else if (!chartDone.has(g.group)) weaveRead?.set(state);
      }),
      data: (d, meta) => keepWeavePosition(() => {
        // 带点数的读口撤回后会改读原查询，收到空数据时先清这组再等下一次读数。
        if (!d) { if (publicationRevoked(meta)) revokeChart(g.group, { phase: 'none', meta }); return; }
        chartStates.delete(g.group);
        chartDone.add(g.group); chartGroups.set(g.group, d);
        paintCharts(rangeChange);
        refresh();
        renderTags();
        if (computer) renderGrafana();
      }),
      });
      // 收起订阅时已经连上了：这块上次挂的“旧数”说明一起收走，不留到连上以后（M741）。
      return { stop() { watch.stop(); if (!window.Live?.offline?.()) U.blockNote(noteHost(g), null); } };
    });
    updateChartTargets();
  }
  for (const b of rangeButtons) {
    b.addEventListener('click', () => {
      if (offline() || b.dataset.range === span) return;
      span = b.dataset.range;
      keepWeavePosition(() => watchCharts(true));
    });
  }
  watchCharts();
  let exitsGeneration = 0;
  const probeExits = () => { const generation = ++exitsGeneration; return readExits(async (query) => { let r = await window.Live.get('computer/exits', query); if (r?.meta?.source === 'copy') r = await window.Live.get('computer/exits', query); return r; }, (d) => { exits = d; if (!computer) refresh(); drawExits(); }, () => generation === exitsGeneration); };
  probeExits(); document.querySelector('.live-at')?.addEventListener('click', probeExits);
  function finishExitAnchor(target) {
    if (exitJump !== 'waiting' || !target) return;
    exitJump = 'queued';
    requestAnimationFrame(() => {
      if (exitJump !== 'queued' || location.hash !== '#exits') return;
      exitJump = 'done';
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
  }
  function cancelExitAnchor() {
    if (exitJump === 'waiting' || exitJump === 'queued') exitJump = 'done';
  }
  for (const event of ['wheel', 'touchmove']) window.addEventListener(event, cancelExitAnchor, { passive: true });
  window.addEventListener('keydown', e => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) cancelExitAnchor();
  });
  function showAnchor() {
    if (location.hash === '#exits') {
      const network = $('board').querySelector('[data-key="network"]');
      if (exitJump || !network) return;
      exitJump = 'waiting';
      board.open('network', true);
      const target = $('exits');
      if (target) finishExitAnchor(target);
      else network.scrollIntoView({ block: 'start', behavior: 'instant' });
      return;
    }
    exitJump = '';
    if (location.hash === '#stutters') {
      board.open('stutter', true);
      requestAnimationFrame(() => $('board').querySelector('[data-key="stutter"]')?.scrollIntoView({ block: 'start' }));
    }
    // 首页电脑卡 CPU、显卡、内存三行带 #grp-cpu／#grp-memory 跳来：落到“CPU 和显卡”“内存”那一组（M708，照手机页）
    const key = location.hash.startsWith('#grp-') ? location.hash.slice(5) : '';
    if (['cpu', 'memory'].includes(key) && $('board').querySelector(`.grp[data-key="${key}"]`)) { board.open(key, true); landOn(key); }
  }
  // 带 #grp-… 跳来（首页卡上的行）：落到那一组以后，上面几块还会分几拨读完长高（图、列表），把它顶下去；
  // 落地后 30 秒内上面每长高一次就把它拉回顶上，人自己滚、按键或点了就不再拉（M708）
  let landKey = '', landUntil = 0;
  const pinLanding = () => {
    if (landKey && Date.now() < landUntil) $(`grp-${landKey}`)?.scrollIntoView({ block: 'start', behavior: 'instant' });
    else landKey = '';
  };
  const landOn = key => { landKey = key; landUntil = Date.now() + 30000; requestAnimationFrame(pinLanding); };
  new ResizeObserver(pinLanding).observe($('stage'));
  for (const event of ['wheel', 'touchmove', 'pointerdown', 'keydown']) window.addEventListener(event, () => { landKey = ''; }, { passive: true });
  new ResizeObserver(() => { if (computer) renderTags(); }).observe(hero);
  window.addEventListener('hashchange', showAnchor); showAnchor();

  // 每组的卡带一个锚点（页头标签、要留意那几行点过来）
  new MutationObserver(() => { for (const c of $('board').children) if (c.dataset.key) c.id = `grp-${c.dataset.key}`; }).observe($('board'), { childList: true });

  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.body.classList.add('is-ready');
    chartsLayoutReady = true;
    updateChartTargets();
  }));
})();
