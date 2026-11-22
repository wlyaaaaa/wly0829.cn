(() => {
  const U = window.LiveUI;
  function diagnosis(d, viewer, now = Date.now()) {
    if (!d || d.visibility === 'owner' && viewer !== 'owner') return '';
    const old = d.q === 'stale' || d.at && d.stale_after != null && now - Date.parse(d.at) > d.stale_after * 1000;
    const rows = (d.reasons || []).filter(r => r.visibility !== 'owner' || viewer === 'owner');
    return `<h3 class="use-two__k">采集停下的原因</h3><p class="use-note">${U.esc(old ? '旧诊断；当前原因没有记录' : d.text || '没有记录')}${d.at ? ` · ${U.esc(U.date(d.at))} ${U.esc(U.time(d.at))}` : ''}</p>${rows.map(r => `<p class="use-note">${r.evidence === 'possible' ? '可能：' : old ? '当时记录：' : '记录条件：'}${U.esc(r.text)}${r.action ? `<br>${U.esc(r.action)}` : ''}</p>`).join('')}`;
  }
  function traffic(d, viewer, now = Date.now()) {
    const metrics = (d?.sections || []).flatMap(s => s.metrics || []).filter(m => ['traffic_today_mobile', 'traffic_month_mobile', 'traffic_month_wifi'].includes(m.id) && m.value != null && (m.visibility !== 'owner' || viewer === 'owner'));
    const labels = metrics.map(m => U.fieldHtml(m.label, { name: '流量', kind: viewer }));
    const gaps = metrics.map(({ gap }) => gap ? U.fieldHtml(
      gap === '系统仅保留部分时段流量桶，数值只含已读时段' ? '只统计手机保留下来的时段' : gap,
      { name: '统计范围', kind: viewer }) : '');
    return metrics.map((m, i) => {
      const old = m.q === 'stale' || m.at && m.stale_after != null && now - Date.parse(m.at) > m.stale_after * 1000;
      const lower = m.lower_bound === true || m.at_least === true || m.partial?.includes('value') || m.q === 'partial' && m.partial == null;
      const gap = gaps[i], related = gap ? labels.filter((_, j) => gaps[j] === gap) : [];
      const shared = related.length > 1;
      const scope = related.length < metrics.length ? `${related.join('、')}：` : '';
      const note = shared && gaps.lastIndexOf(gap) === i ? `<p class="use-note">${scope}${gap}</p>` : '';
      return `<p class="use-note">${labels[i]} · ${lower ? '至少 ' : ''}${U.esc(window.LiveChart.value(m.value, 'B'))}${old ? ' · 旧读数' : ''}${m.at ? ` · ${U.esc(U.date(m.at))} ${U.esc(U.time(m.at))}` : ''}${gap && !shared ? ` · ${gap}` : ''}</p>${note}`;
    }).join('');
  }
  function days(d, viewer) {
    if (!d?.items?.length || d.visibility === 'owner' && viewer !== 'owner') return '';
    return `<details><summary class="more">近 30 天手机流量 <span class="more__chev" aria-hidden="true"><span class="disclosure-closed">▾</span><span class="disclosure-open">▴</span></span></summary>${d.items.filter(r => r.visibility !== 'owner' || viewer === 'owner').map(r => `<p class="use-note">${U.esc(r.date)}${[['mobile_bytes', '移动', r.q], ['wifi_bytes', 'Wi-Fi', r.wifi_q]].filter(([k]) => r[k] != null).map(([k, label, q]) => ` · ${label} ${r.lower_bound === true || r.at_least === true || q === 'partial' ? '至少 ' : ''}${U.esc(window.LiveChart.value(r[k], 'B'))}${q === 'stale' ? '（旧读数）' : ''}`).join('')}${r.text && r.text !== r.date ? ` · ${U.esc(r.text)}` : ''}</p>`).join('')}</details>`;
  }
  window.PhoneDraw10 = { diagnosis, traffic, days };
})();
