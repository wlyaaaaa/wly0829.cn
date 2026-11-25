// 每块盘：一盘一行，条上显示单列文件夹、其他已用和空闲，太窄的值写在条下。
// 右边写还剩多少、多久满；点开看全部文件夹、本盘用途、多久满怎么算和口径小字。替代原来的“剩余与增长”“空间走势”“文件夹和用途”三张卡。
(() => {
  'use strict';
  const U = window.LiveUI, K = window.StorageKit, { esc } = U;
  const SEG = ['#f6b8cf', '#b5cdf6', '#d3c5f5', '#f8d4a6', '#bfe3f0'];
  const OTHER = '#bfe6dc', USED = '#c9d3e6';
  const when = s => s ? `${U.date(s)} ${U.time(s)}` : '';
  const at = s => { const t = Date.parse(s); return Number.isFinite(t) ? t : null; };
  const folder = (r, viewer) => { const name = K.field(r.label, '文件夹名称', viewer); return /^\$RECYCLE\.BIN$/i.test(name) ? '回收站' : name; };
  const usable = r => r && r.label && Number.isFinite(r.bytes) && r.bytes > 0;
  // 条上的字按 12px 估宽：汉字约 12px，其余约 6.8px，两边各留 6px。
  const textW = t => [...String(t)].reduce((n, c) => n + (/[　-鿿＀-￯]/.test(c) ? 12 : 6.8), 0) + 14;
  const MISSING = { not_recorded: '后台这次没记录文件夹大小', offline: '这块盘不在线', not_measured: '还没量过' };

  // 文件夹早于最新一次腾出空间的自动清理时，标为清理前的大小。
  function beforeCleanup(v, last) {
    const run = last?.volumes?.find(x => K.letter(x) === K.letter(v));
    const measured = at(v.directories_at), finished = at(last?.finished_at);
    if (!(run?.freed_bytes > 0) || !measured || !finished || measured >= finished) return null;
    return { measured: v.directories_at, finished: last.finished_at, freed: run.freed_bytes };
  }

  // “其他”＝已用减去画出来的各段，不能比没单列出来的最大文件夹还小；放不下名字只写大小，再窄就并进“其他”，名字放进悬停提示。
  function segments(v, barW = 760, stale = null, viewer) {
    const total = v.total, used = Number.isFinite(v.used) ? v.used : total - v.free;
    const dirs = K.splitRows(v.directories, viewer).visible.filter(r => usable(r) && r.complete !== false).sort((a, b) => b.bytes - a.bytes);
    let k = Math.min(5, dirs.length);
    const sumOf = n => dirs.slice(0, n).reduce((s, r) => s + r.bytes, 0);
    while (k > 0 && (sumOf(k) > used || used - sumOf(k) < (dirs[k]?.bytes || 0))) k--;
    const fits = (bytes, text) => bytes / total * (barW - 12) >= textW(text);
    const label = (name, bytes) => {
      const amount = K.size(bytes), full = `${name} ${amount}`;
      return fits(bytes, full) ? full : fits(bytes, amount) ? amount : '';
    };
    while (k > 0 && (!fits(dirs[k - 1].bytes, K.size(dirs[k - 1].bytes)) ||
        k > 1 && used > sumOf(k) && !fits(used - sumOf(k), K.size(used - sumOf(k))))) k--;
    const parts = dirs.slice(0, k).map((r, i) => {
      const name = folder(r, viewer);
      return { name, bytes: r.bytes, color: SEG[i], label: label(name, r.bytes), stale: !!stale };
    });
    const other = used - sumOf(k);
    if (other > 0) {
      const name = k ? '其他' : '已用', hidden = dirs.slice(k);
      const tip = hidden.length ? `${stale ? '清理前量的，含' : '含'} ${hidden.map(r => `${folder(r, viewer)} ${K.size(r.bytes)}`).join('、')}` : '';
      parts.push({ name, bytes: other, color: k ? OTHER : USED, label: label(name, other), tip, unsplit: !k });
    }
    if (v.free > 0) parts.push({ name: '空闲', bytes: v.free, free: true, label: label('空闲', v.free) });
    return { parts, over: sumOf(dirs.length) > used };
  }

  function bar(v, barW, last, viewer) {
    if (!(v.total > 0) || !Number.isFinite(v.free)) return { html: `<span class="dk-bar is-gray">${esc(v.state === 'offline' ? '离线，这次没读到容量' : '容量还没读到')}</span>` };
    if (v.state === 'offline') return { html: `<span class="dk-bar is-gray">${esc(K.offlineRead(v, viewer))}</span>` };
    const stale = beforeCleanup(v, last), seg = segments(v, barW, stale, viewer);
    const nameAndSize = p => `${p.name} ${K.size(p.bytes)}`;
    const html = `<span class="dk-bar" role="img" aria-label="${esc(`${K.volName(v, viewer)}：${seg.parts.map(nameAndSize).join('，')}`)}">${seg.parts.filter(p => p.label).map(p => {
      const title = [nameAndSize(p), p.tip, p.stale && `${U.time(stale.measured)} 量的，早于 ${U.time(stale.finished)} 那轮自动清理`].filter(Boolean).join(' · ');
      return `<i class="${[p.free && 'is-free', p.stale && 'is-before', p.unsplit && 'is-unsplit'].filter(Boolean).join(' ')}" style="flex:${p.bytes / v.total * 100} 1 0;${p.free ? '' : `background:${p.color}`}" title="${esc(title)}"><span>${esc(p.label)}</span></i>`;
    }).join('')}</span>`;
    const small = seg.parts.filter(p => !p.label).map(p => `<span title="${esc(p.tip || nameAndSize(p))}">${esc(nameAndSize(p))}</span>`).join(' · ');
    const dirs = K.splitRows(v.directories, viewer);
    const measured = dirs.visible.some(r => usable(r) && r.complete !== false);
    const code = v.missing?.directories?.reason_code ?? v.missing?.directories?.reason ?? v.missing?.directories;
    const gap = K.field(v.directory_gap, '文件夹测量说明', viewer).replace(/[。.，,\s]+$/, ''), why = !measured && (MISSING[code] || '后台没给原因');
    // 回包里这块盘一条文件夹读数都没有（如系统恢复 U 盘、只读整盘的盘）：条下只写后台那句原因，点开也不再留文件夹区、不重复这句（M683）
    const none = !dirs.visible.length && !dirs.hidden;
    const cap = !measured && dirs.hidden ? '文件夹名称和大小仅本人可见' : stale ? `文件夹是 ${U.time(stale.measured)} 量的，早于 ${U.time(stale.finished)} 那轮自动清理（这盘腾出 ${K.size(stale.freed)}），带斜线的是清理前的大小`
      : none && gap ? gap : !measured && gap ? `文件夹没量到：${gap}` : why ? `文件夹没量到：${why}，只分已用和空闲` : '';
    const caption = [small, cap && esc(cap)].filter(Boolean).join(' · ');
    return { html, cap, caption, stale, none, over: seg.over, unsplit: seg.parts.some(p => p.unsplit && p.label), folders: seg.parts.some(p => !p.free && !p.unsplit && p.label) };
  }

  function list(rows, empty, key, viewer, withheld) {
    const note = withheld ? `<p class="dk-empty">${esc(withheld)}</p>` : '';
    if (!rows.length) return note || `<p class="dk-empty">${esc(empty)}</p>`;
    const max = Math.max(1, ...rows.map(r => Number.isFinite(r.bytes) ? r.bytes : 0));
    const li = r => `<li><span>${esc(r.name)}</span><b>${esc(r.size || '—')}</b>${Number.isFinite(r.bytes) ? `<i style="width:${(r.bytes / max * 100).toFixed(1)}%"></i>` : ''}</li>`;
    const limit = rows.length;   // 两版同一套（本人禁令 11-24 14:16）：两版都列全
    const head = rows.slice(0, limit), rest = rows.slice(limit);
    return `<ul class="dk-list">${head.map(li).join('')}</ul>${note}${rest.length ? `<details class="dk-rest" data-key="${esc(key)}"><summary class="dk-rest__sum">还有 ${rest.length} 条</summary><ul class="dk-list">${rest.map(li).join('')}</ul></details>` : ''}`;
  }

  function forecastNote(f) {
    if (!Number.isFinite(f.rate)) return `多久满：${f.text}（按近 ${K.WINDOW} 天空闲的实际变化算）`;
    const change = f.end[1] - f.start[1];
    return `多久满按走势图那条线算：${K.dayKey(f.start[0])} 空闲 ${K.size(f.start[1])} → ${K.dayKey(f.end[0])} ${K.size(f.end[1])}，${Math.round(f.span)} 天${change < 0 ? '少了' : '多了'} ${K.size(Math.abs(change))}${Number.isFinite(f.rate) ? `（日均${f.rate < 0 ? '少' : '多'} ${K.size(Math.abs(f.rate))}，含自动清理腾出的）` : ''}；照这个速度 ${K.HORIZON} 天内会用完才写天数`;
  }

  function detail(v, b, forecast, viewer) {
    // 插着的 U 盘（回包 removable）一条文件夹读数都没有：点开只写整盘用了多少、还剩多少，那句短说明就是盘条下后台给的原因，不再列用途和别的口径（本人 11-24 08:50，M683）
    if (v.removable === true && b?.none && Number.isFinite(v.used) && Number.isFinite(v.free)) {
      return `<div class="dk-more dk-more--one"><section class="dk-notes"><h4>口径</h4><p>${esc(`已用 ${K.size(v.used)}${Number.isFinite(v.total) ? ` / 共 ${K.size(v.total)}` : ''}，还剩 ${K.size(v.free)}`)}</p></section></div>`;
    }
    const dirs = K.splitRows(v.directories, viewer), cats = K.splitRows([...(v.categories || []), ...(v.unclassified_usage || [])], viewer);
    const entries = (rows, label, name) => rows.visible.map(r => {
      const value = K.field(r.bytes, `${label}大小`, viewer);
      const bytes = !K.isPlaceholder(value) && value ? K.raw(r.bytes) : null;
      return { name: name(r) || label, bytes, size: Number.isFinite(bytes) ? `${r.complete === false && bytes > 0 ? '至少 ' : ''}${K.size(bytes)}` : value };
    }).sort((a, b) => (b.bytes ?? -1) - (a.bytes ?? -1));
    const notes = [
      Number.isFinite(v.used) && Number.isFinite(v.total) && `已用 ${K.size(v.used)} / 共 ${K.size(v.total)}`,
      (Number.isFinite(v.free) || v.space_history) && forecastNote(forecast),
      v.directories_at && `文件夹 ${when(v.directories_at)} 量的${v.directories_complete === false ? '（没量全）' : ''}${v.folder_interval_minutes ? ` · 每 ${v.folder_interval_minutes} 分钟量一次` : ''}`,
      b?.stale && `这块盘 ${U.time(b.stale.finished)} 那轮自动清理腾出 ${K.size(b.stale.freed)}，条上带斜线的文件夹是清理前量的，下次量完才更新`,
      b?.over && '文件夹和已用不是同一时刻量的，加起来超过现在的已用；条上只画放得下的几个，“其他”按已用减去画出来的算',
      !b?.none && v.directory_gap && K.field(v.directory_gap, '文件夹测量说明', viewer),
      v.unclassified_usage?.length && '“其余占用”是没按用途分开的空间，可能包含左边已量到的文件夹和系统开销。两边有重叠，不能相加。',
      v.category_bytes_basis === 'allocated' ? '用途按文件在磁盘上实际占的空间统计' : v.category_bytes_basis === 'logical' ? '用途按文件本身的大小统计' : '',
    ].filter(Boolean);
    const key = K.letter(v) || v.id;
    const folders = b?.none ? '' : `<section><h4>全部最大的文件夹${b?.stale ? ' · 清理前量的' : ''}</h4>${list(entries(dirs, '文件夹', r => folder(r, viewer)), b?.cap || '这块盘没有文件夹读数', `${key}-dirs`, viewer, K.hiddenRows(dirs.hidden, '文件夹记录', '文件夹名称和大小'))}</section>`;
    // 回包里这块盘一条用途都没登记（也不是访客版藏起来的）：不留“本盘用途”那一栏（M683）
    const uses = !cats.visible.length && !cats.hidden ? '' : `<section><h4>本盘用途</h4>${list(entries(cats, '用途', r => K.field(r.label, '用途名称', viewer)), '没有登记的用途', `${key}-cats`, viewer, K.hiddenRows(cats.hidden, '用途记录', '用途名称和大小'))}</section>`;
    const columns = 1 + !!folders + !!uses;
    return `<div class="dk-more${columns === 2 ? ' dk-more--two' : columns === 1 ? ' dk-more--one' : ''}">${folders}${uses}<section class="dk-notes"><h4>口径</h4>${notes.map(n => `<p>${esc(n)}</p>`).join('') || '<p>没有更多说明</p>'}</section></div>`;
  }

  function row(v, barW, last, d, viewer) {
    const unread = !(v.total > 0) || !Number.isFinite(v.free);
    const free = unread ? '没读到' : `${v.state === 'offline' ? '当时还剩' : '还剩'} ${K.size(v.free)}`;
    const about = [K.purpose(v, viewer), Number.isFinite(v.total) ? K.size(v.total) : ''].filter(Boolean).join(' ');
    const b = bar(v, barW, last, viewer);
    const forecast = K.forecast(v, d), key = K.letter(v) || v.id;
    const sub = unread ? (v.state === 'offline' ? '离线' : '容量还没读到') : forecast.text;
    const capacityAt = U.fieldText(v.read_at ?? v.source_at, viewer);
    const capacityNote = !unread && v.state !== 'offline' && at(capacityAt) != null
      ? `<small class="dk-cap">容量读于 <time datetime="${esc(capacityAt)}">${esc(when(capacityAt))}</time></small>` : '';
    return { b, html: `<li><details class="dk-row" id="storage-disk-${esc(key)}" data-key="${esc(key)}"><summary class="dk-sum">${K.lamp(unread ? 'gray' : K.tone(v, forecast))}<b class="dk-name">${esc(K.volName(v, viewer))}</b><span class="dk-about">${esc(about)}</span><span class="dk-cell">${b.html}${capacityNote}${b.caption ? `<small class="dk-cap">${b.caption}</small>` : ''}</span><span class="dk-left"><b>${esc(free)}</b><span>${esc(sub)}</span></span><span class="dk-go" aria-hidden="true">›</span></summary>${detail(v, b, forecast, viewer)}</details></li>` };
  }

  function legend(rows, gray) {
    const items = [
      rows.some(r => r.b.folders) && '<i class="k-folder"></i>彩色＝单列的文件夹',
      rows.some(r => r.b.unsplit) && '<i class="k-used"></i>灰蓝＝已用，没拆到文件夹',
      rows.some(r => r.b.stale) && '<i class="k-before"></i>带斜线＝清理前量的',
      '<i class="k-free"></i>白＝空闲',
      gray && '<i class="k-none"></i>灰斜线＝离线或没读到',
    ].filter(Boolean);
    return `条的长度是整块盘 · ${items.join(' · ')}`;
  }

  function render(d, viewer, visible = d) {
    const host = document.getElementById('disks');
    if (!host) return;
    const volumes = K.splitRows(d?.volumes, viewer);
    const vols = [...(visible === d ? volumes.visible : visible?.volumes || volumes.visible)].sort(K.order);
    // 第一次画时整排卡可能还藏着（宽 0），按页面栏宽估：栏宽 min(1760, 视口 − 80)，减卡内边距 48，再减条以外几格 464。
    const barW = Math.max(240, (host.clientWidth || Math.min(1760, (window.innerWidth || 1600) - 80) - 48) - 464);
    const last = window.StorageCleanup?.digest(visible)?.last || null;
    const rows = vols.map(v => row(v, barW, last, visible, viewer));
    // V 盘（开发盘）还没进 volumes 时留一行灰的，和别的没读到的盘一样能点开看原因。
    const missingV = vols.length && !d.volumes.some(v => K.letter(v) === 'V') ? `<li><details class="dk-row is-missing" data-key="V"><summary class="dk-sum">${K.lamp('gray')}<b class="dk-name">V 盘</b><span class="dk-about">开发盘</span><span class="dk-cell"><span class="dk-bar is-gray">还没接进存储读数</span></span><span class="dk-left"><b>没读到</b><span>还没接进存储读数</span></span><span class="dk-go" aria-hidden="true">›</span></summary><div class="dk-more dk-more--one"><p class="dk-empty">这次存储读数没有包含 V 盘的容量。</p></div></details></li>` : '';
    const hidden = K.hiddenRows(volumes.hidden, '磁盘记录', '磁盘名称、用途、容量、走势和文件夹明细');
    K.put(host, vols.length || hidden ? rows.map(r => r.html).join('') + missingV + (hidden ? `<li class="dk-empty">${esc(hidden)}</li>` : '') : `<li class="dk-empty">${esc(U.offline?.() ? '这块没存下来，连上后补上。' : '每块盘的读数暂时读不到')}</li>`);
    const measured = vols.map(v => v.directories_at).filter(Boolean).sort().at(-1);
    const gray = !!missingV || rows.some(r => /is-gray/.test(r.b.html));
    K.put(document.getElementById('disks-note'), `${legend(rows, gray)}${measured ? ` · 文件夹 ${esc(when(measured))} 量的` : ''}`);
    const n = d?.categories?.length;
    K.put(document.getElementById('disks-foot'), n ? `<a class="more more--link" href="#categories-card">按用途看全部 ${n} 类 · 谁来清、怎么清 ›</a>` : '');
  }
  window.StorageDisks = { render, segments, folder };
})();
