// 事件点保留真实时刻；键盘聚焦和指针悬停显示同一份北京时间。
(() => {
  const kinds = { bugcheck: ['蓝屏', '#c57691'], whea_corrected: ['硬件纠错', '#bf9354'], whea_fatal: ['致命硬件错误', '#c57691'], unexpected_power_loss: ['非正常关机', '#8c80bb'], disk_error: ['磁盘错误', '#629db8'] };
  window.LiveEvents = {
    render(d) {
      const U = window.LiveUI, esc = U.esc;
      const complete = Array.isArray(d?.events) && !!d.events_from && !!d.events_to;
      const rows = Array.isArray(d?.events) ? d.events : d?.recent;
      const end = Date.parse(d?.events_to || d?.at), start = Date.parse(d?.events_from) || end - 30 * 86400000;
      if (!Array.isArray(rows) || !Number.isFinite(end) || !(end > start) || U.offline?.() && !complete && !rows.length) return `<p class="row__sub">${U.offline?.() ? '这块没存下来，连上后补上。' : window.LiveUI.collectionText("事件时间带")}</p>`;
      const stamp = at => `${U.date(at)} ${U.time(at)}`;
      const weeks = [];
      for (let t = start + 7 * 86400000; t < end; t += 7 * 86400000) weeks.push({ x: 100 * (t - start) / (end - start), date: U.date(new Date(t).toISOString()) });
      const grid = weeks.map(w => `<i class="computer-events__week" style="left:${w.x}%" aria-hidden="true"></i>`).join('');
      let grouped = false;
      const tracks = Object.entries(kinds).map(([kind, [label, hue]]) => {
        const points = rows.filter(r => r.kind === kind && Date.parse(r.at) >= start && Date.parse(r.at) <= end)
          .sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
        const groups = [];
        for (const row of points) {
          const at = Date.parse(row.at);
          let group = groups.at(-1);
          if (!group || at - group.at > (end - start) * 0.013) {
            group = { from: row.at, to: row.at, at, names: new Set(), count: 0 };
            groups.push(group);
          }
          group.to = row.at;
          group.names.add(U.fieldText(row.text) || label);
          group.count++;
        }
        return `<div class="computer-events__row"><b>${label}</b><div class="computer-events__track">${grid}${groups.map(group => {
          grouped ||= group.count > 1;
          const first = stamp(group.from), last = stamp(group.to), when = first === last ? first : `${first} 至 ${last}`;
          const count = group.count > 1 ? ` · ${first === last ? '同一分钟' : '该时段'} ${group.count} 条` : '';
          const text = `${when}（北京时间） · ${[...group.names].join('、')}${count}`;
          const position = 100 * (group.at - start) / (end - start);
          return `<button type="button" class="computer-events__dot${position <= 50 ? ' computer-events__dot--left' : ''}"${group.count > 1 ? ` data-count="×${group.count}"` : ''} style="left:${position}%;--event-color:${hue}" aria-label="${esc(text)}"><span>${esc(text)}</span></button>`;
        }).join('')}</div><small>${window.ComputerStat?.partial(d, 'events_count') ? '至少 ' : complete ? '' : '已读 '}${points.length} 次</small></div>`;
      }).join('');
      const title = complete ? '事件时间带' : U.offline?.() ? '最近记录' : U.collectionText("最近记录 · 30 天完整事件");
      return `<section class="computer-events" aria-label="台式机事件时间带"><p class="row__sub">${title}${grouped ? ' · 时间相近的同类记录合在一个点' : ''}</p>${tracks}<div class="computer-events__weeks">${weeks.map(w => `<span style="left:${w.x}%">${w.date}</span>`).join('')}</div><div class="computer-events__axis"><span>${stamp(new Date(start).toISOString())}</span><span>${stamp(new Date(end).toISOString())} 北京时间</span></div></section>`;
    },
  };
})();
