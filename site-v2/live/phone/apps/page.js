// 手机全部应用：完整清单在本页按名称和类别搜索；可见性由后端给。
(() => {
  'use strict';
  const U = window.LiveUI, L = window.LiveLight, { esc } = U, $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search), hero = $('hero'), search = $('search');
  if (params.has('fixture') && !new URL($('back').href).searchParams.has('fixture')) $('back').href += `?fixture=${encodeURIComponent(params.get('fixture'))}`;
  let data = null, viewer = 'public', lit = false, linkOff = false, shown = 30;
  const clock = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const pcOffline = () => linkOff || !!U.offline?.(), blank = () => pcOffline() ? '—' : U.collectionText();
  const column = key => !pcOffline() || data?.items?.some(a => a[key] != null);
  const stamp = at => at ? clock.format(new Date(at)).replaceAll('/', '-').replace(new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric' }).format(new Date()).replace('年', '') + '-', '') : blank();
  const isPartial = (d, key) => d?.lower_bound === true || d?.at_least === true || d?.q === 'partial' && (d.partial == null || d.partial.includes(key));
  const hasReading = a => ['category', 'usage_seconds', 'installed_at', 'updated_at'].some(k => a[k] != null && a[k] !== '—');
  const byUsage = items => [...items].sort(items.some(a => a.usage_seconds != null)
    ? (a, b) => Number(hasReading(b)) - Number(hasReading(a)) || (b.usage_seconds ?? -1) - (a.usage_seconds ?? -1)
    : (a, b) => Number(hasReading(b)) - Number(hasReading(a)) || (Date.parse(b.updated_at) || 0) - (Date.parse(a.updated_at) || 0));
  const orderText = d => d?.items?.some(a => a.usage_seconds != null) ? d.usage_from && d.usage_to ? `按近 ${Math.max(1, Math.ceil((Date.parse(d.usage_to) - Date.parse(d.usage_from)) / 86400000))} 天用得多少排` : '按用得多少排' : '按最近更新排';
  const used = a => a.usage_seconds == null ? '—' : `${isPartial(a, 'usage_seconds') ? '至少 ' : ''}${U.minutes(a.usage_seconds / 60)}`;
  const categoryName = (a, fallback = blank()) => {
    const category = a.category, id = category && typeof category === 'object' ? category.id || category.key : category;
    if (isPrivate(category) || category?.visibility === 'pending' || category?.value != null) return category;
    return a.category_label || a.category_name || (category && typeof category === 'object' ? category.label || category.name || category.title || category.text || id || category : category) || fallback;
  };
  const isPrivate = field => field?.visibility === 'owner' || field?.public === 'owner' || field?.hidden || field?.hidden_block;
  const hiddenName = a => isPrivate(a) || isPrivate(a.name);
  // 应用名藏起来的行：用后台给的具名占位（“应用类别仅本人可见”）；后台没给占位的也照这样写清藏的是类别。
  const publicCategory = (a, kind, fallback) => {
    if (kind !== 'public' || !hiddenName(a)) return categoryName(a, fallback);
    const given = categoryName(a, '');
    return isPrivate(given) || typeof given === 'string' && /仅本人可见$/.test(given.trim()) ? given : '应用类别仅本人可见';
  };
  function readable(value, kind) {
    if (typeof value === 'string') return value;
    if (!value || kind !== 'owner' && isPrivate(value) || value.visibility === 'pending') return '';
    return readable(value.value ?? value.text ?? value.label, kind);
  }
  function filtered(items, query, kind) {
    const normalize = text => text.toLocaleLowerCase('zh-CN').replace(/\s+/g, '');
    const q = normalize(query);
    if (!q) return items;
    return items.filter(a => {
      const name = kind !== 'owner' && hiddenName(a) ? '' : readable(a.name, kind);
      const category = readable(publicCategory(a, kind, ''), kind);
      const known = /^(?:不公开的类别|—|(?:分类|类别)：可信设备可见)$|仅本人可见$/.test(category.trim()) ? '' : category;
      return [name, known].some(text => normalize(text).includes(q));
    });
  }
  const privateApps = () => (data?.items || []).filter(hiddenName);
  function hiddenApps(searching) {
    if (viewer === 'owner') return '';
    const count = data?.hidden_names ?? data?.hidden ?? data?.hidden_groups?.find(g => g.what === '应用名')?.count ?? privateApps().length;
    return count > 0 ? `其中 ${count} 个应用的名称仅本人可见${searching ? '（全表统计）' : ''}` : '';
  }
  function appRow(a) {
    const name = a.name, field = name != null && typeof name === 'object', hidden = hiddenName(a) && (viewer !== 'owner' || name == null);
    const rowMark = isPrivate(a) && !isPrivate(name) && name?.visibility !== 'pending' && name?.rewrite !== 'pending';
    const mark = field && !rowMark ? '' : U.visibilityNote(a, viewer, a.hidden_what || '应用名');
    const label = hidden && rowMark ? '' : field ? U.fieldHtml(name, { name: '应用名', kind: viewer }) : U.trustText(U.sp(name ?? blank()), viewer);
    const category = publicCategory(a, viewer, hidden ? '—' : blank());
    // 不在装机清单、只在用量记录里出现的（后台标 in_inventory: false）：两样时间本来就没有，写“—”并在名字旁标出来，和表下说明对上（M380）。
    const outside = a.in_inventory === false;
    return `<tr><td>${label ? `<b>${label}</b>` : ''}${mark ? ` <span class="phone-mark">${mark}</span>` : ''}${outside ? ' <span class="phone-mark">不在装机清单</span>' : ''}</td>
      ${column('category') ? `<td>${U.fieldHtml(typeof category === 'string' ? U.sp(category) : category, { name: '类别', kind: viewer })}</td>` : ''}${data?.items?.some(a => a.usage_seconds != null) ? `<td>${esc(used(a))}</td>` : ''}${column('installed_at') ? `<td>${esc(outside || a.installed_at_missing && !a.installed_at ? '—' : stamp(a.installed_at))}</td>` : ''}${column('updated_at') ? `<td>${esc(outside && !a.updated_at ? '—' : stamp(a.updated_at))}</td>` : ''}</tr>`;
  }
  // 表里“—”是什么意思：安装时间是手机报了统一的默认时间；使用时长是这几天的用量记录里没有它。
  function blanks(items, hasUsage) {
    // 装机清单里有、但安装时间被认成默认值的（有“最近更新”）；装机清单里没有、只在用量记录里出现的（两样时间都没有）。
    const preset = column('installed_at') ? items.filter(a => a.installed_at_missing && !a.installed_at && a.updated_at && a.in_inventory !== false).length : 0;
    const marked = items.some(a => a.in_inventory != null) ? items.filter(a => a.in_inventory === false).length : null;
    const outside = marked ?? (data?.total != null && (data?.loaded ?? items.length) > data.total ? (data.loaded ?? items.length) - data.total : 0);
    const noUsage = hasUsage ? items.filter(a => a.usage_seconds == null).length : 0;
    const since = data?.usage_from ? stamp(data.usage_from) : '';
    const lines = [preset && `装机清单里安装时间是“—”的 ${preset} 个：手机给它们报的是出厂或系统统一写入的默认时间，看不出真正哪天装的。`,
      outside && `标“不在装机清单”的 ${outside} 个（系统应用或应用分身）只在用量记录里出现，手机的装机清单不列它们，所以没有安装和更新时间。`,
      noUsage && `使用时长是“—”的 ${noUsage} 个：${since ? `${since} 起` : '这几天'}手机的用量记录里没有它（没打开过，或手机没记下）。`].filter(Boolean);
    return lines.map(line => `<p class="use-note">${esc(line)}</p>`).join('');
  }
  function render() {
    const partial = data?.q === 'partial';
    U.html($('head'), U.status(data).lamp + U.head(data?.total == null ? '全部应用' : `装了 ${isPartial(data, 'total') ? '至少 ' : ''}${data.total} 个应用`, { lamp: false }));
    const gap = partial && data.gap || data?.usage_gap || '', stateNote = U.fieldHtml(data?.stale_text || U.staleText(data), {name:'清单截止时间', kind:viewer});
    $('partial').hidden = !(gap || stateNote); U.html($('partial'), (stateNote && gap ? stateNote+' · ' : stateNote) + (gap ? U.trustText(pcOffline() && !(partial && data.gap) && data?.usage_gap ? '部分应用的使用时长没存下来，连上后补上。' : gap, viewer) : ''));
    const items = data?.items, hasUsage = items?.some(a => a.usage_seconds != null), searching = Boolean(search.value.trim());
    const rows = items == null ? null : filtered(byUsage(items), search.value, viewer);
    const displayed = rows?.slice(0, shown), remaining = (rows?.length ?? 0) - (displayed?.length ?? 0);
    $('ordering').textContent = items == null && pcOffline() ? '' : `${orderText(data)}${hasUsage && data.usage_from && data.usage_to ? ` · ${stamp(data.usage_from)}—${stamp(data.usage_to)}` : ''}`;
    // 装了几个读 total（装机清单）；表里的行数读 loaded，多出来的是装机清单不列、只在用量记录里出现的应用。
    const loaded = data?.loaded ?? items?.length, extra = data?.total != null && loaded > data.total ? loaded - data.total : 0;
    const total = data?.total == null ? `已读到 ${loaded} 个` : extra ? `表里 ${loaded} 个（装机清单 ${data.total} 个，另 ${extra} 个只在用量记录里）` : `${isPartial(data, 'total') ? '至少' : '共'} ${data.total} 个`;
    $('count').textContent = rows == null ? '' : `${searching ? `找到 ${rows.length} 个` : total}，当前显示 ${displayed.length} 个`;
    const sheet = list => `<div class="phone-apps__sheet"><table class="phone-apps__table"><thead><tr><th scope="col">应用</th>${column('category') ? '<th scope="col">类别</th>' : ''}${hasUsage ? '<th scope="col">使用时长</th>' : ''}${column('installed_at') ? '<th scope="col">安装时间</th>' : ''}${column('updated_at') ? '<th scope="col">最近更新</th>' : ''}</tr></thead><tbody>${list.map(appRow).join('')}</tbody></table></div>`;
    const content = rows == null ? `<p class="use-note">${pcOffline() ? '这块没存下来，连上后补上。' : U.collectionText()}</p>` : !rows.length
      ? `<p class="use-note">${searching ? `${partial ? '已读到的应用中' : ''}没有匹配的应用` : partial ? U.collectionText('应用') : '没有应用'}</p>`
      : sheet(displayed) + (remaining ? `<button type="button" class="more" data-app-more>再看 ${Math.min(30, remaining)} 个（还有 ${remaining} 个应用） ›</button>` : '') + blanks(items, hasUsage);
    U.html($('apps-list'), content, false);
    for (const cell of $('apps-list').querySelectorAll('td')) cell.title = cell.textContent.trim();
    if (items == null && !pcOffline()) { $('ordering').textContent = ''; $('count').textContent = ''; U.html($('apps-list'), '<p class="use-note">全部应用暂时读不到</p>'); }
    const hidden = hiddenApps(searching); $('hidden').hidden = !hidden; $('hidden').textContent = hidden;
  }
  search.addEventListener('input', () => { shown = 30; render(); });
  $('apps-list').addEventListener('click', e => { if (e.target.closest('[data-app-more]')) { shown += 30; render(); } });
  L.add(hero);
  const headRead = U.reading(hero.querySelector('.card__body'), { ghost: U.ghost.card(1), name: '全部应用' });
  const listRead = U.reading($('apps-list'), { ghost: U.ghost.rows(4), slow: false });
  const bar = U.topbar({ ask: () => `请看手机全部应用${data?.total == null ? '' : `，${isPartial(data, 'total') ? '至少' : '共'} ${data.total} 个`}${search.value.trim() ? `，搜索“${search.value.trim()}”` : ''}，说明现在的情况。` });
  function lightUp() { if (!lit) { lit = true; L.lightUp([hero]); } }
  window.Live.watch('phone/apps', null, {
    phase(s) { if (s.data == null) { headRead.set(s); listRead.set(s); } },
    data(d, meta) {
      data = d; viewer = meta.viewer?.kind || 'public'; render(); headRead.done(); listRead.done();
      L.tone(hero, d); lightUp();
    },
    link(s) {
      bar?.set(s); L.offline(s.offline);
      U.list($('notices'), s.offline ? [{ key: 'link', cls: 'notice glass', html: esc(s.text) }] : []);
      if (linkOff !== !!s.offline) { linkOff = !!s.offline; if (data) render(); }
      if (s.data == null && ['none', 'gone'].includes(s.phase)) {
        render(); headRead.done(); listRead.done(); L.tone(hero, data); lightUp();
      }
      [hero.querySelector('.card__body'), $('apps-list').parentElement].forEach(el => U.blockNote(el, s));
    },
  });
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
})();
