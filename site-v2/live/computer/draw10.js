(() => {
  const U = window.LiveUI, E = U.esc;
  const stamp = at => at && Number.isFinite(Date.parse(at)) ? [U.date(at), U.time(at)].filter(Boolean).join(' ') : '';
  const allowed = (x, viewer) => x && x.visibility !== 'pending'
    && (viewer === 'owner' || !(x.visibility === 'owner' || x.public === 'owner' || x.hidden || x.hidden_block || x.rewrite === 'pending'));
  const field = (value, name, kind) => U.fieldHtml(value, { name, kind });
  const fieldValue = value => value && typeof value === 'object' ? value.value ?? value.text ?? value.label : value;
  const chinese = value => typeof value === 'string' && /[\u3400-\u9fff]/.test(value);
  function official(d, viewer = 'public') {
    const ext = d?.external;
    if (!allowed(ext, viewer)) return '';
    if (!ext.official_status?.length) return ext.official_notice_zh ? `<p class="row__sub">${field(ext.official_notice_zh, '官方通告', viewer)}</p>` : '';
    return ext.official_status.filter(x => allowed(x, viewer)).map(x => {
      const name = x.name ?? (x.id === 'claude' ? 'Claude' : x.id === 'openai' ? 'OpenAI' : x.id);
      const issue = ({ minor: '部分服务异常', major: '服务严重异常', critical: '重大故障' })[x.state];
      const state = issue || (x.state === 'none' ? '运行正常' : '没有记录');
      const fallback = issue ? `${issue}，官方已发通告` : '官方已发通告';
      const notices = (x.incidents || []).filter(i => allowed(i, viewer)).map(i => {
        const summary = [i.summary_zh, i.title].find(v => v && (!allowed(v, viewer) || chinese(fieldValue(v))));
        const original = allowed(i.title, viewer) && fieldValue(i.title);
        const details = typeof original === 'string' && original.trim() && original !== fieldValue(summary)
          ? `<details class="vz-more"><summary class="more">官方原文</summary>${E(original)}</details>` : '';
        return `<div class="row__sub">${summary ? field(summary, '通告摘要', viewer) : fallback} · 通告 ${E(stamp(i.started_at))}${details}</div>`;
      });
      return `<p class="row__sub"><b>${field(name, '服务名称', viewer)} 官方</b> · ${E(state)}${x.q === 'stale' ? '（旧读数）' : ''} · ${E(stamp(x.at))}</p>${notices.join('')}`;
    }).join('');
  }
  function logins(d, viewer = 'public') {
    const items = allowed(d?.site_logins, viewer) ? (d.site_logins.items || []).filter(x => allowed(x, viewer)) : [];
    if (!items.length) return '';
    const rows = items.map(x => {
      const status = (typeof x.text === 'string' && x.text.trim()) || ({ authenticated: '已登录', expired: '登录过期', timeout: '检查超时', unknown: '状态未知' })[x.status] || '没有记录';
      return `<li class="row__sub"><b>${field(x.name, '网站名称', viewer)}</b> · <span>${E(status)}</span> · <span>${E(stamp(x.checked_at))}</span></li>`;
    });
    return `<p class="grp-split__k">电脑登录</p><ul class="rows computer-logins">${rows.join('')}</ul>`;
  }
  function screenReading(s, render, withHz = false) {
    const numbers = [s?.width, s?.height], dimensions = numbers.every(Number.isFinite) ? render(numbers.join('×'), '分辨率')
      : numbers.some(n => n && typeof n === 'object')
        ? numbers.map((n, i) => n == null ? '' : render(n, i ? '高度' : '宽度')).filter(Boolean).join(' · ')
        : render(U.collectionText('分辨率', s, null, 'resolution'), '分辨率');
    const hz = withHz && (Number.isFinite(s?.hz) ? render(`${s.hz} Hz`, '刷新率')
      : render(s?.hz ?? U.collectionText('刷新率', s, null, 'hz'), '刷新率'));
    return [dimensions, hz].filter(Boolean).join(' · ');
  }
  function streaming(s, viewer, project) {
    if (!allowed(s, viewer)) return '';
    const metrics = allowed(project, viewer) && (viewer === 'owner' || project.guard !== 'owner')
      ? project.sections?.flatMap(g => g.metrics || []) || [] : [];
    const find = id => metrics.find(m => m.id === id && allowed(m, viewer) && allowed(m.value, viewer));
    const picture = find('picture'), last = find('last_connection');
    const lastAt = typeof last?.value === 'string' && /^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d$/.test(last.value)
      ? last.value.replace(' ', 'T') + '+08:00' : '';
    const sourcedAt = metric => stamp(metric?.source_at ?? metric?.at);
    const from = metric => sourcedAt(metric) ? ` · ${U.isStale(metric) ? '最后读到' : '读数时间'} ${E(sourcedAt(metric))}` : '';
    const render = (value, label) => typeof value === 'object' ? field(value, label, viewer) : U.nowrap(value);
    const n = (key, unit) => Number.isFinite(s[key]) ? render(`${s[key]} ${unit}`)
      : s[key] && typeof s[key] === 'object' ? render(s[key], key)
        : s.missing?.[key] && s.missing[key] !== '没有记录' ? render(U.collectionText('', s, null, key)) : '';
    const hasScreenData = d => d && [d.width, d.height, d.hz, d.missing].some(v => v != null);
    const projectPicture = !hasScreenData(s.capture) && sourcedAt(picture) &&
      ['width', 'height', 'hz'].some(k => Number.isFinite(picture.value?.[k]) && picture.value[k] > 0);
    const projectStart = !stamp(s.started_at) && stamp(lastAt);
    const rows = [['最近接入', render(stamp(s.started_at) || projectStart) +
      (projectStart && (!projectPicture || sourcedAt(last) !== sourcedAt(picture)) ? from(last) : '')],
      ['时长', n('duration_seconds', '秒')], ['客户端分辨率', hasScreenData(s.resolution) && screenReading(s.resolution, render)],
      ['客户端帧率', n('fps', '帧/秒')], ['丢帧', n('dropped_frames', '帧')], ['延迟', n('latency_ms', 'ms')]];
    const hasClientReadings = rows.slice(1).some(([, value]) => value);
    if (projectPicture || hasScreenData(s.capture)) {
      rows.push(['台式机捕获设置', screenReading(projectPicture ? picture.value : s.capture, render, true) + (projectPicture ? from(picture) : '')]);
    }
    const known = rows.filter(([, v]) => v), note = [
      hasClientReadings && !projectPicture && !projectStart && s.gap && field(s.gap, '串流记录的缺口', viewer),
      stamp(s.source_at ?? s.at) && `${U.isStale(s) ? '最后读到' : '读数时间'} ${render(stamp(s.source_at ?? s.at))}`,
    ].filter(Boolean).join(' · ');
    if (!known.length) return '';
    return `<details class="vz-more"><summary class="more">最近一次串流</summary>${known.map(([k, v]) => `<p class="row__sub">${E(k)} · ${v}</p>`).join('')}${note ? `<p class="row__sub">${note}</p>` : ''}</details>`;
  }
  window.ComputerDraw10 = { network: (d, viewer) => official(d, viewer) + logins(d, viewer), official, logins, streaming, screenReading };
})();
