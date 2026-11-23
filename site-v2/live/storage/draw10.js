(() => {
  const U = window.LiveUI, E = U.esc, K = window.StorageKit, { size } = K;
  const when = at => at ? `${U.date(at)} ${U.time(at)}` : '';
  const sampleEnd = t => t?.window?.to || t?.sampled_to || t?.at;
  const sampleSeconds = t => Math.max(0, (Date.parse(sampleEnd(t)) - Date.parse(t?.window?.from)) / 1000) || 0;
  function sampleCount(table, received, shown) {
    if (!received) return '';
    const total = table?.total;
    return [Number.isFinite(total) ? `共 ${table.at_least ? '至少 ' : ''}${total} 个` : '',
      (total !== received || shown !== received) && `本页收到 ${received} 个`].filter(Boolean).join(' · ');
  }
  function sampleNote(t) {
    if (!t) return '';
    const to = sampleEnd(t);
    const interval = t.window?.from && to ? `统计区间 ${when(t.window.from)} — ${when(to)}` : to && `统计截至 ${when(to)}`;
    return [t.measurement === 'sample_estimate' && '累计读写量按记录估算', interval,
      t.read_at && `排行读取完成 ${when(t.read_at)}`, t.q === 'stale' && '旧读数'].filter(Boolean).join(' · ');
  }
  const hidden = (x, viewer) => viewer !== 'owner' && K.locked(x);
  const capacity = (value, label, viewer, fieldLabel = label) => {
    const text = K.field(value, fieldLabel, viewer), bytes = K.raw(value);
    return K.isPlaceholder(text) ? text : Number.isFinite(bytes) ? `${label} ${size(bytes)}` : '';
  };
  function drive(g, viewer) {
    if (!g) return null;
    if (hidden(g, viewer)) return { facts: ['Google 云盘配额和余量仅本人可见'] };
    const total = capacity(g.total_bytes, '共', viewer, '云盘总空间');
    const free = capacity(g.free_bytes, total ? '还剩' : '剩余', viewer, '云盘剩余空间');
    const used = capacity(g.used_bytes, '已用', viewer);
    const sizes = total ? [[free, total].filter(Boolean).join(' / ')] : [free, used].filter(Boolean);
    if (!sizes.some(Boolean) && !g.text) return null;
    const days = K.field(g.days_until_full, '云盘剩余天数', viewer);
    if (K.isPlaceholder(days)) sizes.push(days);
    else if (Number.isFinite(K.raw(g.days_until_full))) sizes.push(`约 ${Math.round(K.raw(g.days_until_full))} 天满`);
    // 余量从上面的字节重算，旧摘要里的十进制余量不再显示。
    const text = typeof g.text === 'string' ? g.text.split(/[，；;]/).filter(part =>
      !/^\s*(?:Google 云盘还剩|约 \d+ 天满)/.test(part)).join('；').trim() : g.text;
    const note = [total && used, when(g.at || g.observed_at), text && K.field(text, '云盘说明', viewer)].filter(Boolean).join(' · ');
    return { facts: [...sizes, g.q === 'stale' && '旧读数'], note };
  }
  const billingDays = (b, viewer) => {
    const value = b?.days_remaining_rounded ?? b?.days_remaining, text = K.field(value, '阿里云余额可用天数', viewer);
    const days = K.raw(value);
    return K.isPlaceholder(text) ? text : Number.isFinite(days) ? Math.round(days) : null;
  };
  function billing(b, viewer) {
    if (!b || hidden(b, viewer)) return '';
    const days = billingDays(b, viewer);
    return [typeof days === 'number' && `按近 7 天的日均花费，阿里云账户可用余额估计还能用 ${days} 天`,
      b.recent_days_from && b.recent_days_to && `日均按 ${U.date(b.recent_days_from)} 至 ${U.date(b.recent_days_to)} 的账单算`,
      b.at && `花费 ${when(b.at)} 读到`, K.field(b.gap, '花费说明', viewer)].filter(Boolean).join(' · ');
  }
  function cloudLine(name, facts, label = name) {
    return `<section class="st-cloud" aria-label="${E(label)}"><b>${E(name)}</b><p>${facts.filter(Boolean).map(f => `<span>${E(f)}</span>`).join(' · ')}</p></section>`;
  }
  function aliyun(a, b, viewer) {
    const used = hidden(a, viewer) ? '阿里云已用空间仅本人可见' : capacity(a?.used_bytes, '已用', viewer);
    const days = hidden(b, viewer) ? null : billingDays(b, viewer);
    const month = hidden(b, viewer) ? '阿里云花费和余额估计仅本人可见' : K.field(b?.month_spend_yuan, '本月花费', viewer);
    const amount = K.raw(b?.month_spend_yuan);
    const spend = K.isPlaceholder(month) ? month : Number.isFinite(amount) ? `本月 ${Number(amount.toFixed(2))} 元` : '';
    const note = [!hidden(a, viewer) && a?.at && `空间 ${when(a.at)} 读到`, billing(b, viewer)].filter(Boolean).join(' · ');
    const gap = K.field(a?.gap, '阿里云用量缺因', viewer);
    // 这次没读到、后台留着上次容量并给了说明（如“这次没读到网站素材桶的容量”）：容量旁照写原句，统计时刻照旧（M434）
    const facts = [used || gap || '阿里云已用空间还没读到', !hidden(a, viewer) && used && gap, spend,
      typeof days === 'number' ? `余额约可用 ${days} 天` : days,
      (!hidden(a, viewer) && a?.q === 'stale' || !hidden(b, viewer) && b?.q === 'stale') && '旧读数'];
    return { facts, note };
  }
  function cloud(d, viewer) {
    if (!d) return '';
    const google = drive(d.google_drive, viewer), ali = aliyun(d.aliyun_oss, d.aliyun_billing, viewer);
    const notes = [google?.note && ['Google 云盘', google.note], ali.note && ['阿里云', ali.note]].filter(Boolean);
    return (google ? cloudLine('Google 云盘', google.facts) : '') + cloudLine('阿里云', ali.facts, '阿里云对象存储') +
      (notes.length ? `<details class="st-detail" data-key="cloud"><summary class="live-disclosure">读数说明</summary>${notes.map(([name, note]) => `<p class="pj-note">${E(name)} · ${E(note)}</p>`).join('')}</details>` : '');
  }
  function render(d, viewer) {
    const host = document.getElementById('cloud-draw10');
    const html = cloud(d, viewer); host.hidden = !html; K.put(host, html);
  }
  window.StorageDraw10 = { render, cloud, sampleNote, sampleSeconds, sampleCount, drive, billing };
})();
