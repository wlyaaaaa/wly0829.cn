(() => {
  'use strict';
  const U = window.LiveUI, $ = id => document.getElementById(id);
  const page = $('laptop');
  let audience = 'public', headline = '正在读笔记本';
  const bar = U.topbar({ ask: () => `请看实况笔记本页：${headline}。请说明目前的情况。` });
  const unavailable = '这次没读到';
  const finite = value => typeof value === 'number' && Number.isFinite(value);
  const field = (value, name) => U.fieldHtml(value ?? `${name}${unavailable}`, { name, kind: audience });
  const measure = (value, name, format) => field(finite(value) ? format(value) : typeof value === 'object' ? value : null, name);
  const amount = (value, unit, digits = 1) => `${Number(value.toFixed(digits))} ${unit}`;
  const gb = (bytes, digits = 1) => amount(bytes / 2 ** 30, 'GB', digits);  // 按 1024 进位
  const processMemory = bytes => bytes > 0 && bytes < .01 * 2 ** 30 ? '小于 0.01 GB' : gb(bytes, 2);
  const pct = value => `${Number(value.toFixed(2))}%`;
  const cpuName = value => typeof value === 'string' ? value.replace(/\s+(?:w\/|with|@)\s+.*$/i, '').trim() : value;
  const osName = value => typeof value === 'string' ? value.replace(/^Microsoft\s+/, '').replace(/\s+\d+\.\d+(?:\.\d+)+$/, '') : value;
  const elapsed = mins => {
    const days = Math.floor(mins / 1440), rest = mins % 1440;
    return days ? `${days} 天${rest ? ' ' + U.minutes(rest) : ''}` : U.minutes(rest);
  };
  const at = value => Number.isFinite(Date.parse(value)) ? value : null;
  const time = (value, now = Date.now()) => at(value)
    ? [U.date(value) !== U.date(now) && U.date(value), U.time(value)].filter(Boolean).join(' ') : '';
  const status = (value, good) => `<span${good ? ' class="laptop-good"' : ''}>${U.esc(value)}</span>`;
  const truth = (value, yes, no, name, green = false) => typeof value === 'boolean'
    ? status(value ? yes : no, green && value) : field(value, name);
  const read = (name, value, detail = '') => U.html(page.querySelector(`[data-metric="${name}"] dd`),
    `<strong>${value}</strong>${detail ? `<small>${detail}</small>` : ''}`);
  const drive = value => String(value ?? '').replace(/[\\/]+$/, '').toUpperCase();
  const version = value => /^E(\d+)$/i.exec(typeof value === 'string' ? value : '')?.[1];
  const hidden = value => value?.hidden || value?.visibility === 'owner' || value?.public === 'owner';
  const programs = new Map([
    ['pwsh', ['PowerShell 7', 'terminal']], ['powershell', ['Windows PowerShell', 'terminal']],
    ['wmiprvse', ['Windows 管理服务（WMI）', 'cpu']], ['memory compression', ['Windows 内存压缩', 'memory']],
    ['todesk', ['ToDesk', 'remote']], ['tailscale', ['Tailscale', 'network']], ['tailscaled', ['Tailscale', 'network']],
    ['chrome', ['Chrome', 'browser']], ['msedge', ['Microsoft Edge', 'browser']], ['firefox', ['Firefox', 'browser']],
    ['msedgewebview2', ['Edge 网页组件', 'browser']], ['audiodg', ['Windows 音频服务', 'apps']],
    ['codex', ['Codex', 'terminal']], ['claude', ['Claude', 'apps']], ['msmpeng', ['Windows 安全中心', 'shield']],
    ['dwm', ['Windows 桌面窗口管理器', 'remote']], ['svchost', ['Windows 服务主机', 'cpu']],
    ['explorer', ['Windows 文件资源管理器', 'apps']], ['system', ['Windows 系统', 'cpu']],
    ['csrss', ['Windows 客户端/服务器运行时', 'cpu']], ['tailscale-ipn', ['Tailscale 托盘程序', 'network']],
  ]);

  function processes(rows, sampled) {
    if (!Array.isArray(rows)) return `<tr><td colspan="3">${field(rows, '进程占用')}</td></tr>`;
    if (!rows.length) return '<tr><td colspan="3">没有读到正在跑的程序</td></tr>';
    return [...rows].sort((a, b) => (b.cpu_pct ?? -1) - (a.cpu_pct ?? -1)).slice(0, 5).map(row => {
      const name = row.process_name;
      if (audience === 'public' && (hidden(row) || hidden(name))) {
        return `<tr><td colspan="3">${field({ visibility: 'owner', hidden_what: '进程名称与占用' }, '进程')}</td></tr>`;
      }
      const [label, icon] = programs.get(typeof name === 'string' ? name.toLowerCase().replace(/\.exe$/, '') : '') || [name, 'apps'];
      const original = label !== name ? ` title="${U.esc(name)}"` : '';
      return `<tr><td><span class="laptop-program"${original}><svg class="laptop-icon" aria-hidden="true"><use href="#li-${icon}"/></svg><span>${field(label, '程序名')}</span></span></td><td>${measure(sampled ? row.cpu_pct : null, 'CPU', pct)}</td><td>${measure(row.memory_bytes, '内存', processMemory)}</td></tr>`;
    }).join('');
  }

  function render(x, state = {}) {
    const pending = !x && !state.offline && (!state.phase || ['idle', 'wait', 'slow'].includes(state.phase));
    const now = Date.parse(state.now) || Date.now(), last = time(x?.at, now);
    // 在不在线只看连接那组（state、availability、observed_at），过没过期由后台按 observed_at 判好，和电脑页同一判断；
    // 库存那组（at、read_error）只说下面读数是几点的，电量和 MCP 各看自己的时间（M253、M319）
    const fresh = (stamp, limit) => !!at(stamp) && !(finite(limit) && (now - Date.parse(stamp)) / 1000 > limit);
    const seen = at(x?.observed_at);
    const checked = x?.state === 'online' && x.availability !== 'unavailable' && !!seen && !state.offline;
    const disconnected = state.offline || x?.state === 'offline';
    const readingsOld = !!last && (!!x.read_error || !fresh(x.at, x.stale_after));
    const note = x?.read_error_reason ?? x?.missing_reason ?? (typeof x?.read_error === 'string' ? x.read_error : null);
    page.dataset.deviceState = checked ? 'online' : pending ? 'loading' : 'offline';
    headline = checked ? '在线' : pending ? '正在读笔记本' : disconnected ? '笔记本连不上'
      : seen || at(x?.last_online) ? '笔记本在线状态未重新确认' : x ? '笔记本在线状态这次没读到' : '电脑状态这次没带回笔记本读数';
    const confirmed = time(seen || x?.last_online, now);
    const stamp = confirmed ? ` · ${checked ? '最近确认' : '最后确认在线'} ${confirmed}` : disconnected && !last ? ' · 没有留存读数' : '';
    const readings = readingsOld && last !== confirmed ? ` · 下面的读数是 ${last} 的` : '';
    U.html($('laptop-state'), `${status(checked ? '● 在线' : headline, checked)}${U.esc(stamp + readings)}${note ? ` · ${field(note, '读取原因')}` : ''}`);
    const missing = pending ? '正在读' : unavailable;
    const display = (value, name) => value == null && pending ? missing : field(value, name);
    const capacity = (value, name, format) => finite(value) ? field(`${name} ${format(value)}`, name) : display(value, name);
    const missingMetric = name => `<span class="laptop-missing">${display(null, name)}</span>`;
    const metric = (value, name, format) => value == null
      ? missingMetric(name) : measure(value, name, format);
    const { battery, memory } = x || {};
    const disk = x?.system_drive && Array.isArray(x.disks) && x.disks.find(d => drive(d.name) === drive(x.system_drive));
    const diskFree = finite(disk?.total) && finite(disk?.used) && disk.total >= disk.used ? disk.total - disk.used : null;
    const memoryRatio = finite(memory?.used) && finite(memory?.total) && memory.total > 0 ? 100 * memory.used / memory.total : null;
    const uptime = checked || last ? (Date.parse(x?.at) - Date.parse(x?.boot_at)) / 60000 : NaN;
    const sampled = !!at(x?.cpu_sample_at);
    U.html($('laptop-hardware'), [display(cpuName(x?.cpu_model), 'CPU 型号'), capacity(memory?.total, '系统识别内存', gb),
      capacity(x?.disk_capacity_bytes, '硬盘', gb)].join(' · '));
    U.html($('laptop-system'), `${display(osName(x?.os), '系统版本')} · ${Number.isFinite(uptime) && uptime >= 0 ? `已开机 ${U.esc(elapsed(Math.floor(uptime)))}` : display(null, '开机时长')}`);
    const batteryAt = time(battery?.at, now), batteryOld = !checked || battery?.q === 'stale' || battery?.stale === true || !fresh(battery?.at, battery?.stale_after);
    read('battery', metric(battery?.percent, '电量', pct), pending ? '' : [truth(battery?.charging, '已接电源', '未接电源', '供电状态'),
      batteryAt && U.esc(`${batteryOld ? '上次读到 ' : ''}${batteryAt}`)].filter(Boolean).join(' · '));
    read('cpu', metric(sampled ? x.cpu_pct : null, 'CPU 占用', pct));
    read('memory', metric(memoryRatio, '内存占用', pct), memory ? `已用 ${metric(memory.used, '内存用量', gb)} / ${metric(memory.total, '总内存', gb)}` : '');
    read('disk', metric(diskFree, '系统盘余量', gb), x?.system_drive ? `系统盘 ${field(x.system_drive, '系统盘')}` : '');
    read('network', x?.network_type == null ? missingMetric('联网方式')
      : display({ wifi: 'Wi-Fi', ethernet: '有线' }[x.network_type] ?? x.network_type, '联网方式'),
      pending ? '' : `Tailscale ${truth(x?.tailscale_online, '在线', '离线', '状态', true)}`);
    // 远程连接看 data.remote 里副机 MCP 自己那一行（state、at、authenticated_at），写法和电脑页一样
    const mcp = state.data?.remote?.find?.(row => row.id === 'secondary-mcp');
    const mcpOld = mcp?.q === 'stale' || mcp?.stale === true, mcpAt = time(mcp?.state === 'online' && mcp.authenticated_at || mcp?.at, now);
    read('remote', pending ? missing : !mcp ? 'MCP 这次没读到' : mcp.state === 'online' ? `MCP ${status(mcp.authenticated_at ? '通' : '入口通', !mcpOld)}`
      : mcp.state === 'offline' ? 'MCP 连不上' : 'MCP 这次没探出通不通',
      mcpAt ? U.esc(`${mcpAt} ${mcp.state === 'unknown' ? '探测' : mcpOld ? '最后测得' : '测得'}`) : '');
    U.html($('laptop-apps'), pending ? '<tr><td colspan="3">正在读</td></tr>' : processes(x?.processes, sampled));

    const notes = [], add = (text, cls = '') => notes.push(`<li class="${cls}">${text}</li>`);
    const laptopRule = version(x?.rule_version), desktopRule = version(x?.desktop_rule_version);
    if (laptopRule && desktopRule && Number(laptopRule) < Number(desktopRule)) {
      // 写着规则版本号的这一句点了去规则页（本人 11-24 13:00），整句一个链接、带箭头
      add(`<a class="row__title" href="/rules/">规则版本 ${field(x.rule_version, '笔记本规则版本')}，台式机是 ${field(x.desktop_rule_version, '台式机规则版本')}，落后了 <span class="more__chev">›</span></a>`, 'laptop-alert');
    }
    if (x?.reboot_pending === true) add('Windows 更新等重启', 'laptop-alert');
    if (!pending && (!laptopRule || !desktopRule)) add('规则版本对比这次没读全');
    if (!pending && x?.reboot_pending == null) add('是否等重启这次没读到');
    if (!notes.length) add(pending ? '正在读' : '没有要注意的');
    const boot = time(x?.boot_at, state.now || Date.now());
    if (!pending) add(boot ? `最近一次开机 ${U.esc(boot)}` : '最近一次开机时刻这次没读到', boot ? 'laptop-ok' : '');
    U.html($('laptop-notes'), notes.join(''));
  }

  render(null);
  window.Live.watch('computer', null, {
    link(state) {
      audience = state.viewer?.kind || 'public';
      const laptop = state.data?.devices?.find(device => device.id === 'secondary_laptop');
      render(laptop, state);
      bar?.set(state);
    },
    phase(state) { if (!state.data && state.phase === 'slow') render(null, state); },
  });
})();
