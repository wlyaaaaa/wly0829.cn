(() => {
  const U = window.LiveUI, DAY = 86400000;
  // 软件变化先摆最近 10 条，底下“再看 N 条（还有 M 条） ›”每点一次多摆 20 条；手里这一页露完、后台还有下一页（next）就接着取（本人 11-25：默认显示一部分，可以慢慢展开，M932）。
  // 标题天数照回包的 window 写（现在给 7 天就写 7 天，后台改成近 90 天就跟着变）；记录起点晚于窗口起点一天以上才写“从几号起才有”，写法同手机页（M911）。
  // 本人 11-26 选 ENV2 的 A，照图 ENV-4 改样子：每天的 Windows 自带组件和驱动零件合成一行灰字（点开看全），同一软件“卸载旧版＋新装新版”合成一条升级，
  // 名字用人话，升级／卸载带小彩色标签。分组读后台每条的 category（system＝Windows 自带组件，driver_part＝驱动零件），人话名读 label；
  // 后台还没给这两项时每条照原样单列、名字照原名。“卸载＋新装”并成升级由这里按同一天、同一来源、去掉末尾版本号后同名来并。
  const FIRST = 10, STEP = 20, RESOURCE = 'projects/pcconfig/records', QUERY = { section: 'software_changes' };
  const QUIET = { system: 'Windows 自带组件', driver_part: '驱动零件' };
  let shown = FIRST, days = 7, last = null, paging = false, pageFailed = false;
  const opened = new Set();
  const span = d => { const a = Date.parse(d?.window?.from), b = Date.parse(d?.window?.to); return Number.isFinite(a) && Number.isFinite(b) && b > a ? Math.floor((b - a) / DAY) + 1 : 7; };
  const dayKey = at => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date(at));
  const dateText = text => {
    const year = new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Asia/Shanghai' }).format(new Date(window.Live.now?.() || Date.now()));
    return String(text ?? '').replace(/\b\d{4}-\d{2}-\d{2}\b/g, day => day.startsWith(year + '-') ? day.slice(5) : day)
      .replace(/从\s*((?:\d{4}-)?\d{2}-\d{2})\s*开始记/g, '从 $1 开始记');
  };
  // 连着缺的日子并成“A 到 B”
  const ranges = list => [...new Set(list)].sort().reduce((out, day) => {
    const tail = out.at(-1);
    if (tail && Date.parse(day) - Date.parse(tail[1]) === DAY) tail[1] = day; else out.push([day, day]);
    return out;
  }, []).map(([a, b]) => a === b ? a : `${a} 到 ${b}`);
  // 记录从哪天起才有；窗口里起点之后零星缺的日子另写一句（起点之前那一大段由第一句说清，不逐日列）
  function coverage(d) {
    const start = Date.parse(d?.window?.from), first = Date.parse(d?.coverage?.from);
    const late = Number.isFinite(start) && Number.isFinite(first) && first - start >= DAY;
    const firstDay = late ? dayKey(first) : '';
    const inner = (Array.isArray(d?.missing_dates) ? d.missing_dates : []).filter(x => typeof x === 'string' && (!late || x > firstDay));
    return { late, note: late ? `软件变化记录从 ${U.date(d.coverage.from)} 起才有，近 ${span(d)} 天里 ${U.date(d.window.from)} 到 ${U.date(d.coverage.from)} 没有记录` : '',
      inner: inner.length ? `${ranges(inner).join('、')} 没有记录` : '' };
  }
  const visible = (d, viewer) => d.items.filter(r => r.visibility !== 'owner' || viewer === 'owner');
  // 名字末尾带的版本号去掉（“NVIDIA 图形驱动程序 621.40”→“NVIDIA 图形驱动程序”），版本号另列
  const stem = r => { const v = [r.previous_version, r.version].filter(Boolean).map(x => ` ${x}`).find(x => typeof r.name === 'string' && r.name.endsWith(x)); return v ? r.name.slice(0, -v.length) : r.name; };
  const parts = v => String(v ?? '').split(/[^0-9]+/).filter(Boolean).map(Number);
  const lower = (a, b) => { const x = parts(a), y = parts(b); for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) < (y[i] || 0); return false; };
  function merged(items) {
    const out = [];
    for (const raw of items) {
      const r = { ...raw, base: stem(raw) };
      const pair = ['installed', 'uninstalled'].includes(r.kind) && out.findIndex(x => !x.paired && ['installed', 'uninstalled'].includes(x.kind) && x.kind !== r.kind
        && x.date === r.date && x.source === r.source && x.base === r.base);
      if (pair >= 0 && pair !== false) {
        const add = r.kind === 'installed' ? r : out[pair], gone = r.kind === 'installed' ? out[pair] : r;
        out[pair] = { ...add, label: add.label || gone.label, category: add.category || gone.category, kind: 'updated', previous_version: gone.previous_version, version: add.version, paired: true };
      } else out.push(r);
    }
    return out;
  }
  // 哪天变的：后台的 date 是记下来的那天（每天零点后记一次），变化发生在上一次记录之后；上一次记录就在前一天时算前一天变的，
  // 和日用软件卡上“几号起用这版”对得上。隔了几天才记到的（电脑关着、每周才测的受管工具）照记下来那天写。
  const changeDay = r => { const prev = Date.parse(r.previous_observed_at), day = Date.parse(`${r.date}T00:00:00+08:00`);
    return Number.isFinite(prev) && Number.isFinite(day) && dayKey(prev) === dayKey(day - DAY) ? dayKey(day - DAY) : r.date; };
  // 按天排：先列这天你装的软件，系统组件和驱动零件合成这天最后一行灰字
  function entries(d, viewer) {
    const days = new Map();
    for (const raw of merged(visible(d, viewer))) {
      const r = { ...raw, day: changeDay(raw) };
      if (!days.has(r.day)) days.set(r.day, { apps: [], quiet: [] });
      days.get(r.day)[QUIET[r.category] ? 'quiet' : 'apps'].push(r);
    }
    return [...days].sort(([a], [b]) => a < b ? 1 : a > b ? -1 : 0).flatMap(([day, g]) => [...g.apps, ...(g.quiet.length ? [{ quiet: true, day, rows: g.quiet }] : [])]);
  }
  const KIND = { installed: ['新装', 'new'], uninstalled: ['卸载', 'gone'], updated: ['升级', 'up'] };
  function row(r, viewer, sub) {
    const [tag, cls] = r.kind === 'updated' && r.previous_version && r.version && lower(r.version, r.previous_version) ? ['降级', 'down'] : KIND[r.kind] || [r.kind, 'other'];
    const versions = [...new Set([r.previous_version, r.version].filter(Boolean))].map(U.esc).join(' → ');
    return `<li class="env-ch${sub ? ' env-ch--sub' : ''}"${r.drive ? ` title="${U.esc(`${r.drive} 盘`)}"` : ''}><span class="env-ch__date">${sub ? '' : U.esc(dateText(r.day))}</span><span class="env-ch__tag" data-kind="${cls}">${U.esc(tag)}</span><span class="env-ch__name">${U.fieldHtml(r.label && r.label !== r.name ? r.label : r.base, { name: '软件', kind: viewer })}</span><span class="env-ch__ver">${versions}</span></li>`;
  }
  function quiet(g, viewer) {
    const kinds = [...new Set(g.rows.map(r => r.category))];
    const name = kinds.length > 1 ? 'Windows 自带组件和驱动零件' : QUIET[kinds[0]];
    return `<li class="env-ch env-ch--quiet"><span class="env-ch__date">${U.esc(dateText(g.day))}</span><details class="env-ch__fold" data-day="${U.esc(g.day)}"${opened.has(g.day) ? ' open' : ''}><summary>${U.esc(name)} · ${g.rows.length} 项</summary><ul>${g.rows.map(r => row(r, viewer, true)).join('')}</ul></details></li>`;
  }
  function changes(d, viewer, limit = Infinity) {
    if (!Array.isArray(d?.items) || d.visibility === 'owner' && viewer !== 'owner') return '';
    // 从哪天开始有：后台窗口是近 90 天，实际只留到 coverage.from 那份（11-19，最早一次 11-18 那份已滚出），照它写，不补造更早的日子
    const cover = coverage(d);
    const sub = [Number(d.refresh_seconds) === 86400 ? '每天零点后记一次' : '', cover.late ? `从 ${U.date(d.coverage.from)} 开始有记录` : d.text ? dateText(d.text) : ''].filter(Boolean).join(' · ');
    const title = `<p class="env-ch-title"><b>近 ${span(d)} 天变化</b>${sub ? `<span>${U.esc(sub)}</span>` : ''}</p>`;
    if (!d.items.length) return d.gap ? `${title}<p class="env-note">${U.fieldHtml(typeof d.gap === 'string' ? dateText(d.gap) : d.gap, { name: '软件变化记录', kind: viewer })}</p>` : '';
    const list = entries(d, viewer);
    const head = list.slice(0, limit);
    // 还没取的下一页：有总数就算进“还有几条”，没有总数也照样给“继续看”
    const unloaded = d.next ? Number.isFinite(d.total) ? Math.max(0, d.total - d.items.length) : null : 0;
    const left = list.length - head.length + (unloaded || 0), fetch = head.length >= list.length && unloaded !== 0;
    const label = paging ? '正在读…' : pageFailed ? '下一页暂时读不到，再试一次 ›' : left > STEP ? `再看 ${STEP} 条（还有 ${left} 条） ›` : left > 0 ? `再看剩下 ${left} 条 ›` : '继续看 ›';
    const more = left > 0 || fetch ? `<p class="env-ch-more"><button type="button" class="more" data-change-more${fetch ? ' data-needs-pc' : ''}${paging ? ' disabled' : ''}>${label}</button></p>` : '';
    // 起点之前没记录造成的“快照缺口”已由上一句说清；起点之后真缺了日子才照后台原话说
    const gap = d.gap && !(d.q === 'partial' && cover.late && !cover.inner) ? d.gap : '';
    const foot = [d.q === 'stale' && '旧读数', cover.inner, gap].filter(Boolean).join(' · ');
    return `${title}<ul class="env-chs">${head.map(x => x.quiet ? quiet(x, viewer) : row(x, viewer)).join('')}</ul>${more}${foot ? `<p class="env-note">${U.esc(dateText(foot))}</p>` : ''}`;
  }
  // 放在软件版本和命令环境两张卡后面（本人选的 ENV1：版本表挪到变化列表上面）
  const host = document.createElement('section'); host.className = 'card grp grp--quiet env-changes'; host.hidden = true; document.getElementById('board').after(host);
  const shell = html => `<div class="card__glass glass"><div class="card__body"><div class="grp__chapter">${html}</div></div></div>`;
  let read;
  function unavailable(state) {
    if (Array.isArray(state.data?.items) || !(['none', 'gone'].includes(state.phase) || state.meta?.status >= 400)) return;
    if (!read) {
      U.html(host, shell(''));
      read = U.reading(host.querySelector('.grp__chapter'), { name: `近 ${days} 天变化`, ghost: '' });
    }
    host.hidden = false;
    read.set({ ...state, phase: 'none' });
  }
  function draw() {
    const html = last ? changes(last.d, last.viewer, shown) : ''; host.hidden = !html; U.html(host, html ? shell(html) : '');
  }
  // 要摆的条数超过手里已有的、后台还有下一页：照 next 游标接着取，接在后面（刷新回来第一页时也照这样补回已展开的）
  async function fill() {
    while (last && !paging) {
      const d = last.d;
      if (!Array.isArray(d?.items) || !d.next || shown <= entries(d, last.viewer).length || U.offline?.()) return;
      paging = true; pageFailed = false; draw();
      let s = null;
      try { s = await window.Live.get(RESOURCE, { ...QUERY, cursor: d.next }); } catch { s = null; }
      paging = false;
      if (last?.d !== d) continue;
      if (!Array.isArray(s?.data?.items)) { pageFailed = true; draw(); return; }
      last.d = { ...d, ...s.data, items: [...d.items, ...s.data.items], next: s.data.items.length && s.data.next !== d.next ? s.data.next : null };
      draw();
    }
  }
  host.addEventListener('click', e => {
    const btn = e.target.closest('[data-change-more]');
    if (!btn || btn.disabled || paging) return;
    if (!pageFailed) shown += STEP;
    pageFailed = false; draw(); fill();
    host.querySelector('[data-change-more]')?.focus({ preventScroll: true });
  });
  host.addEventListener('toggle', e => { const day = e.target.dataset?.day; if (day) e.target.open ? opened.add(day) : opened.delete(day); }, true);
  window.Live.watch(RESOURCE, QUERY, {
    data(d, meta) {
      read?.done(false); read = null;
      last = { d, viewer: meta.viewer?.kind }; pageFailed = false; if (Array.isArray(d?.items)) days = span(d); draw(); fill();
    }, link: unavailable,
  });
  window.EnvironmentDraw10 = { changes };
})();
