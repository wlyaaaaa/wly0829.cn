(() => {
  'use strict';
  const ids = {
    'steam-millennium-config-backup': 'steam', 'emerald-veil': 'emerald',
    wlyaaaaa: 'github', 'typora-theme-pack': 'typora',
  };
  const id = new URLSearchParams(location.search).get('id'), page = Object.hasOwn(ids, id) ? ids[id] : '';
  if (!page) return;

  const U = window.LiveUI, { esc } = U, unavailable = '暂时读不到', limit = 5;
  const owned = {
    steam: ['comparison', 'wardrobe', 'history', 'more-data'],
    emerald: ['bubbles', 'background', 'more-data'],
    github: ['profile', 'contribution-snake', 'more-data'],
    typora: ['theme', 'pdf', 'more-data'],
  };
  const order = {
    steam: ['comparison', 'wardrobe', 'artifacts', 'history', 'changes', 'pp-more'],
    emerald: ['bubbles', 'background', 'artifacts', 'pp-more', 'changes'],
    github: ['contribution-snake', 'profile', 'artifacts', 'changes'],
    typora: ['samples', 'theme', 'artifacts', 'changes', 'pp-more'],
  }[page];
  const icons = {
    comparison: '<path d="M12 22s7-3 7-10V5l-7-3-7 3v7c0 7 7 10 7 10Z"/><path d="m9 12 2 2 4-4"/>',
    wardrobe: '<path d="M10 6a2 2 0 1 1 3 1.7L12 9v2l9 5.5c1 .6.6 2.5-.7 2.5H3.7c-1.3 0-1.7-1.9-.7-2.5l9-5.5"/>',
    history: '<path d="M20 7a9 9 0 0 0-15 2m15-6v4h-4M4 17a9 9 0 0 0 15-2M4 21v-4h4"/>',
    bubbles: '<circle cx="8" cy="15" r="5"/><circle cx="17" cy="6" r="3"/><circle cx="19" cy="15" r="1.5"/>',
    background: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 6-5 4 3 4-5 4 4"/>',
    'contribution-snake': '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    profile: '<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M12 16v5m-4 0h8"/>',
    samples: '<path d="M12 5c-2-2-5-3-9-2v16c4-1 7 0 9 2 2-2 5-3 9-2V3c-4-1-7 0-9 2Zm0 0v16"/>',
    theme: '<path d="M21 11.4a9 9 0 1 0-9.3 9.1c2 0 3-1.5 2-2.9-.7-1 .2-2 1.3-2H17a4 4 0 0 0 4-4.2Z"/><path d="M7 11h.01m2-4h.01m4-1h.01m4 3h.01"/>',
    'more-data': '<path d="M3 21h18M6 17v-4m6 4V4m6 13V8"/>',
    artifacts: '<path d="M12 3 2 8l10 5 10-5-10-5ZM2 12l10 5 10-5M2 16l10 5 10-5"/>',
    changes: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>',
  };
  const heading = (key, label) => `<b class="pp-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">${icons[key]}</svg>${label}</b>`;
  const beijing = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai', year: 'numeric', month: 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  });
  const date = (value, precision = 'time') => {
    const parsed = Date.parse(value);
    if (!Number.isFinite(parsed)) return unavailable;
    const parts = Object.fromEntries(beijing.formatToParts(parsed).map(part => [part.type, part.value]));
    const day = `${parts.month}月${parts.day}日`;
    if (precision === 'year') return `${parts.year}年${day}`;
    return precision === 'day' || value.length === 10 ? day : `${day} ${parts.hour}:${parts.minute}`;
  };
  const nearbyImages = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) if (isIntersecting) {
      target.src = target.dataset.previewSrc;
      nearbyImages.unobserve(target);
    }
  }, { rootMargin: '0px 0px 160px' });
  const observeImages = host => host.querySelectorAll('img[data-preview-src]:not([src])').forEach(img => nearbyImages.observe(img));
  const n = value => Number.isFinite(value) ? value.toLocaleString('zh-CN') : unavailable;
  const bytes = value => Number.isFinite(value) ? U.trafficBytes(value) : unavailable;
  const old = metric => U.isStale(metric) ? '<span class="pj-old">旧了</span>' : '';
  const link = (href, label, external = false) => `<a class="more more--link pp-link" href="${esc(href)}"${external ? ' target="_blank" rel="noopener"' : ''}>${label} <span aria-hidden="true">›</span></a>`;
  const records = section => `/live/records/?project=${encodeURIComponent(id)}&section=${encodeURIComponent(section)}`;
  const detail = (metric, label = '明细') => metric?.section ? link(records(metric.section), label) : '';
  const field = (m, viewer) => {
    const metric = m?.value == null && m?.count != null ? { ...m, value: m.count } : m;
    return metric?.value == null && !metric?.hidden && !metric?.hidden_block ? unavailable : U.fieldHtml(metric, { kind: viewer }) || unavailable;
  };
  const row = (label, value, extra = '') => `<div class="pp-row"><span>${label}</span><strong>${value}</strong>${extra}</div>`;
  const stat = (label, value, unit = '') => `<div><span>${label}</span><strong>${esc(value)}${value !== unavailable && unit ? ` <small>${unit}</small>` : ''}</strong></div>`;
  const notes = (kind, m) => m?.at ? `${kind} ${date(m.at)}` : unavailable;

  function adapt(raw) {
    if (page === 'emerald') document.querySelector('#pj-hero').dataset.pic = 'right';
    const picked = (raw.sections || []).filter(s => owned[page].includes(s.id));
    const data = Object.fromEntries(picked.flatMap(s => (s.metrics || []).map(m => [m.id, m])));
    const links = page === 'github' ? (raw.links || []).map(l => l.id === 'intro' || /^https:\/\/github\.com\/wlyaaaaa\/wlyaaaaa(?:[/?#]|$)/.test(l.href)
      ? { ...l, label: '去主页', href: 'https://github.com/wlyaaaaa' } : l) : raw.links;
    const about = page === 'github' && typeof raw.about === 'string' ? raw.about.replace(/六个项目/g, '置顶的项目') : raw.about;
    return { ...raw, about, links, headline: null, cover: page === 'typora' ? null : raw.cover, readings: data,
      sections: (raw.sections || []).filter(s => !owned[page].includes(s.id)) };
  }

  function strip(d, viewer) {
    const m = d.readings;
    const [label, text, cutoff, href] = {
      steam: [m.saved_at?.value ? `和 ${date(m.saved_at.value, 'day')} 衣橱比` : '与旧衣橱比较', m.changes?.value?.total == null ? unavailable : `${n(m.changes.value.total)} 处不同`, notes('截止', m.changes), '#comparison'],
      emerald: ['现在在干什么', m.status?.value === '待命：没有能放的显示器' ? '待命 · 没有可用实体屏' : m.status?.value == null ? unavailable : U.fieldText(m.status, viewer), notes('截止', m.status), '#bubbles'],
      github: ['有贡献的天数', m.contribution_days?.value == null ? unavailable : `${n(m.contribution_days.value)} 天`, notes('数据到', { at: m.data_through?.value }), '#contribution-snake'],
      typora: ['上次核对接好的导出菜单', m.menus?.value == null ? unavailable : U.fieldText(m.menus, viewer), notes('核对于', m.menus), m.menus?.section ? records(m.menus.section) : '#theme'],
    }[page];
    return `<a class="pj-cell${page === 'emerald' ? ' pj-cell--wide' : ''}" data-pp-reading href="${href}"><span class="pj-cell__k">${label} <span class="more__chev">›</span></span><span class="pj-cell__v"><b>${esc(text)}</b></span><small class="pj-cell__sub">${esc(cutoff)}</small></a>`;
  }

  function card(graph, key, title, subtitle, body, metric, explanation = '', dateLabel = '截止') {
    const b = graph(key, title);
    if (key === 'more-data') b.group = 'pp-more';
    U.html(b.head, `${heading(key, title)}${subtitle ? `<span>${subtitle}</span>` : ''}`, false);
    U.html(b.viz, body || `<p>${unavailable}</p>`, false);
    observeImages(b.viz);
    b.cut.hidden = !dateLabel;
    b.cut.textContent = notes(dateLabel, metric);
    b.explain.hidden = !explanation;
    U.html(b.explain, explanation, false);
    return b;
  }

  function steam(d, viewer, add) {
    const m = d.readings, delta = m.changes?.value, saved = date(m.saved_at?.value), restore = m.restore?.value;
    const replica = (m.replica_history || m.replica)?.value, plugins = m.plugins?.value, themes = m.themes?.value;
    const active = themes?.current_active ?? (delta ? themes?.active : null);
    add('comparison', '跟现在的 Steam 对得上吗', '', `<div class="pp-split">
      <div><h3>现在谁在备份</h3><p>Steam 设置跟着系统盘整盘镜像一起备份</p><p class="pp-muted">每周单独备份 11月23日 起停用</p>${link('/live/backup/?id=system_images', '去备份页看系统盘镜像')}</div>
      <div><p>对比 ${saved} <span class="pp-no-split">的旧衣橱</span> ${old(m.changes)}</p>
      <div class="pp-stats">${stat('多出', n(delta?.added))}${stat('改了', n(delta?.modified))}${stat('少了', n(delta?.deleted))}</div>
      ${detail(m.changes, '看改了哪些')}</div></div>`, m.changes, '这里比较已保存的 Steam 设置和现在的文件。游戏本体不在衣橱里。');
    const replicaText = replica?.completed_at && `${date(replica.completed_at)} · ${({ complete: '完整', partial: '部分完成', failed: '失败' })[replica.status] || unavailable} · 核对 ${n(replica.verified_files)} 个文件 · 保留 ${n(replica.retained_generations)} 代`;
    add('wardrobe', '衣橱里有什么', `${saved} 那份旧衣橱`,
      `<div class="pp-big"><strong>${n(restore?.files)} 个文件 · 约 ${bytes(restore?.bytes)}</strong>${detail(m.files)}</div>
      <p>${restore ? `能直接带回 ${n(restore.restorable)} 样，其余 ${n(restore.inventory)} 个是清单` : unavailable}</p>
      ${row('记着的插件', plugins ? `${n(plugins.count)} 个（启用 ${n(plugins.enabled)}）` : unavailable, detail(m.plugins))}
      ${row('记着的皮肤', themes ? `${n(themes.count)} 套（正在穿：${esc(active == null ? unavailable : active || '默认皮肤')}）` : unavailable, detail(m.themes))}
      <p class="pp-muted">旧衣橱最后一份异盘副本：${replicaText || unavailable}</p>`, m.plugins, '可直接带回的文件和清单分开。插件和皮肤取最近一次比对。', '插件、皮肤 截止');
    add('history', '换装记录', '每一份比上一份多了、少了哪个插件，换了哪套皮肤',
      `${row('每份衣橱的换装记录', `${field(m.history, viewer)} 条`, detail(m.history))}<p class="pp-muted">每周备份停用后不再新增，历史照留。</p>`,
      m.history, '按留存的衣橱逐份比较。');
    add('more-data', '更多数据', '', `${table(m, viewer, ['plugin_files', 'theme_files'])}<p class="pp-muted">${notes('截止', m.plugin_files)}</p>
      ${table(m, viewer, ['docs_files', 'code_files', 'config_files', 'tracked_files', 'code_chars'])}`,
      { at: d.size?.at }, '插件和皮肤文件来自 Steam 比对。项目规模取最近一次清点。');
  }

  function table(metrics, viewer, keys) {
    return keys.map(key => {
      const m = metrics[key], label = U.fieldText(m?.label, viewer);
      const value = Number.isFinite(m?.value) && !m.visibility ? esc(n(m.value)) : field(m, viewer);
      return label ? row(esc(label), `${value} ${m.value == null ? '' : esc(m.unit || '')}`, detail(m)) : '';
    }).join('');
  }

  function emerald(d, viewer, add) {
    const m = d.readings, v = key => field(m[key], viewer), session = m.session?.value;
    const status = key => m[key]?.value == null ? unavailable : U.fieldText(m[key], viewer);
    const seconds = m.idle_seconds?.value, idle = Number.isFinite(seconds) ? `闲置 ${Math.floor(seconds / 60)} 分钟${seconds % 60 ? ` ${seconds % 60} 秒` : ''}启动` : `闲置启动时间${unavailable}`;
    add('bubbles', '泡泡屏保', '开关、目标与这次常驻的实测状态。', `<p class="pp-idle">${idle} ${old(m.status)}</p>
      <div class="pp-stats">${stat('开关', status('enabled'))}${stat('快捷键', ({ 能: '已注册', 不能: '未注册' })[m.hotkey?.value] || status('hotkey'))}
      ${stat('出错后自己再试', status('retry'))}${stat('连续画面故障', n(m.consecutive_failures?.value), '次')}</div>
      <p>这次启动 ${session?.since ? `${date(session.since)} 起：试着放 ${n(session.attempts)} 次，出错 ${n(session.failures)} 次` : unavailable}</p>
      ${m.last_failure?.value ? `<p>上次出错：${v('last_failure')}</p>` : ''}`, m.status,
      `可用实体屏：${v('target')}。等待时间取自正在运行的翠幕屏保，${notes('读于', m.idle_seconds)}。快捷键只表示已注册。试放、出错从本次启动起算。`);
    const monitor = m.wallpaper_monitors?.value, yes = m.background?.value;
    add('background', '壁纸和锁屏', '', `<div class="pp-big"><strong>${v('background')}</strong><span>${yes === '是' ? '还是选好的那张' : ''} ${old(m.background)}</span></div>
      ${row('核验时壁纸匹配的屏幕', monitor?.total != null ? `${n(monitor.matched)}/${n(monitor.total)} 块` : unavailable)}
      <p class="pp-muted">含 Windows 记住的离线屏，和上一项是同一次核验。</p>`, m.background, '这是 Windows 壁纸与锁屏设置核验。');
    add('more-data', '更多数据', '', table(m, viewer, ['tracked_files', 'docs_files', 'code_files', 'config_files']), { at: d.size?.at }, '从 Git 跟踪的文件统计自有文档、代码和配置。');
  }

  function github(d, viewer, add) {
    const m = d.readings, source = m.contribution_days, mirror = m.mirror_observed;
    const coverage = `图上覆盖 ${date(m.coverage_start?.value, 'year')} 至 ${date(m.data_through?.value, 'year')}，共 ${n(m.calendar_days?.value)} 格`;
    add('contribution-snake', '贡献小蛇', coverage, `<div class="pp-stats">
      ${stat('最长一段连续', n(m.longest_streak?.value), '天')}${stat('最近一天有贡献', date(m.last_active?.value))}</div>
      <div class="pp-mirror">${stat('GitHub 生成', date(source?.at))}<b aria-hidden="true">→</b>${stat('本机取到', date(mirror?.value))}${old(mirror || source)}</div>`,
      mirror, '贡献天数、覆盖日期及图取同一次 GitHub 输出。本机每次取到后记成功时间。');
    const profile = m.image_kinds != null;
    const mark = value => value === unavailable ? value : `<b class="pp-no-split">${esc(value)}</b>`;
    add('profile', '主页摆了什么', 'GitHub 上现在的样子', `${row('置顶项目', profile ? `${mark(n(m.cards?.value))} 个` : unavailable, profile ? detail(m.cards) : '')}
      ${row('正文里的项目源码入口', profile ? `${mark(n(m.source_links?.value))} 个 · 置顶另计` : unavailable)}
      ${row('配图', profile ? `${mark(n(m.image_kinds.value))} 种 · 亮暗各一套，共 ${mark(n(m.image_files?.value))} 个文件` : unavailable)}
      ${row('配图共', profile ? `${mark(bytes(m.image_bytes?.value))} · 其中贡献小蛇两套 ${mark(bytes(m.snake_bytes?.value))}` : unavailable)}
      ${row('主页内容最后更新', mark(date(m.profile_observed?.value)))}`,
      profile ? m.cards : null, '置顶从 GitHub 读取。配图按 README（主页正文）实际引用的亮暗文件统计。');
  }

  function typora(d, viewer, add) {
    const m = d.readings;
    const editor = 'https://raw.githubusercontent.com/wlyaaaaa/typora-theme-pack/main/previews/typora-live-mint.png';
    const samples = [
      ['/live/project/interfaces/typora-theme-pack/original.png', '原版', 'MARKDOWN STANDARD', '中性、朴素、忠实原文'],
      ['/live/project/interfaces/typora-theme-pack/company.png', '公司', 'TEAM DOCUMENT', '公司内部、专业审阅'],
      ['/live/project/interfaces/typora-theme-pack/personal.png', '个人', 'PERSONAL READING', '更大字号、舒展长读'],
    ];
    add('samples', 'Markdown / PDF 页面预览', '三种语义 · 原版 / 公司 / 个人',
      `<div class="pp-preview-tools"><span>样张最后改于 ${date(m.samples_changed?.value)}</span>${link(editor, '看实际编辑器', true)}</div>
      <div class="pp-samples">${samples.map(([src, label, english, description]) => `<figure>
        <img class="pp-preview" data-preview-src="${src}" width="1240" height="1680" alt="${label}样张预览" decoding="async">
        <figcaption><strong>${label} <span lang="en">${english}</span></strong><span>${description}</span></figcaption></figure>`).join('')}</div>`, null, '', '');
    add('theme', '主题', '现在用的是哪套主题，安装的文件对不对？',
      `${row('上次核对使用的主题', field(m.theme, viewer))}
      ${row('上次核对主题文件与本仓一致吗', field(m.theme_files, viewer))}
      <p class="pp-muted">上次只核对了配置和目标文件，没试导出。</p>`,
      m.theme, '安装、菜单或样张改动时核对。三种导出菜单的明细从页首 3/3 那格打开。', '核对于');
    add('more-data', '更多数据', '', table(m, viewer, ['pdfs', 'previews']), m.pdfs, '按项目里公开的样张与预览文件核对。');
  }

  function board(d, viewer, graph, el) {
    if (!el.dataset.personalProject) el.addEventListener('error', event => {
      const img = event.target;
      if (!img.matches?.('.pp-preview, .pp-wallpaper') || img.dataset.retried) return;
      img.dataset.retried = 'true';
      const url = new URL(img.src);
      url.searchParams.set('retry', '1');
      img.src = url.href;
    }, true);
    el.dataset.personalProject = page;
    const cards = [];
    const add = (...args) => cards.push(card(graph, ...args));
    ({ steam, emerald, github, typora })[page](d, viewer, add);
    return cards;
  }

  const desktopThumb = '/live/project/interfaces/emerald-veil/desktop-thumb.webp';
  const mobileThumb = '/live/project/interfaces/emerald-veil/mobile-thumb.webp';
  const bubbleImage = '/live/project/interfaces/emerald-veil/bubbles.webp';
  function wallpaperRows(b, rows, items, offset) {
    const shown = rows.map((row, i) => {
      const it = items[offset + i], href = it?.web_open?.href || '';
      if (typeof href !== 'string') return row;
      const name = href.split('/').at(-1).split('.')[0];
      const thumb = name === 'emerald-elf-1440x3200' ? mobileThumb : name === 'verdant-rain-4k' ? desktopThumb : '';
      return thumb && !it.content_locked ? { ...row, cls: `${row.cls} pp-wallpaper-card${thumb === mobileThumb ? ' pp-mobile-wallpaper' : ''}`,
        html: `<img class="pp-wallpaper" data-preview-src="${thumb}" alt="" decoding="async">${row.html}` } : row;
    });
    if (offset === 0) shown.unshift({ key: 'bubbles-preview', cls: 'row row--flat pj-item pp-wallpaper-card pp-bubbles', html:
      `<img class="pp-wallpaper" data-preview-src="${bubbleImage}" alt="" decoding="async">
      <div class="row__text"><p class="row__main"><span class="row__title">泡泡屏保 · 画面</span></p>
      <p class="row__sub">雨林壁纸上的彩色泡泡。</p>
      <div class="acts"><a class="btn btn--sm" href="${bubbleImage}" target="_blank" rel="noopener" data-mo-press>打开画面</a></div></div>
      <time class="pj-at" datetime="2026-11-28T04:54:53+08:00">制作于 11-28 04:54</time>` });
    b.main.classList.add('pp-wallpapers');
    return shown;
  }

  function compactArtifactDates(list) {
    for (const title of list.querySelectorAll('.row__title')) {
      for (const text of title.childNodes) {
        if (text.nodeType !== Node.TEXT_NODE) continue;
        const compact = text.data.replace(/(\d+)\s*月\s*(\d+)\s*日/g, '$1月$2日');
        if (compact !== text.data) text.data = compact;
      }
    }
  }

  function lists({ blocks, left, right, block, arts, changeLog, changeIssue, viewer, artifactRow, loadArtifacts, loadChanges, keepWords }) {
    for (const [key, packet, load] of [['artifacts', arts, loadArtifacts], ['changes', changeLog, loadChanges]]) {
      let b = blocks.get(key);
      if (!right.includes(b)) {
        b = block(key, 'rows');
        right.push(b);
      }
      U.html(b.head, heading(key, key === 'artifacts' ? '最近产物' : '最近改动'), false);
      b.head.hidden = b.main.hidden = false;
      b.el.classList.add('pp-paged');
      if (!b.pager || b.pager.viewer !== viewer) b.pager = { viewer, index: 0, pending: false };
      const state = b.pager, rows = packet && b.groupSrc || [], count = packet?.total ?? rows.length;
      const nav = b.el.querySelector('.pp-pagination') || b.el.appendChild(document.createElement('div'));
      nav.className = 'pp-pagination';
      state.draw = () => {
        const offset = state.index * limit;
        let entries = rows.slice(offset, offset + limit);
        const wallpaperPage = page === 'emerald' && key === 'artifacts';
        if (key === 'artifacts' && entries.length) entries = packet.items.slice(offset, offset + limit).map((it, i) =>
          artifactRow(page === 'steam' ? { ...it, recent_detail: '' } : it, offset + i));
        if (wallpaperPage) entries = wallpaperRows(b, entries, packet?.items || [], offset);
        b.el.classList.toggle('pp-multiple', packet?.total > limit || !!packet?.next);
        U.list(b.main, entries.length ? entries : [{ key: 'pp-none', cls: 'pp-empty', html: packet && !packet.next && !changeIssue ? '暂无记录' : unavailable }], { animate: false });
        if (key === 'artifacts' && page === 'steam') compactArtifactDates(b.main);
        if (key === 'changes' || wallpaperPage) keepWords?.(b.main);
        if (wallpaperPage) observeImages(b.main);
        const issue = (key === 'changes' && changeIssue) || state.issue;
        b.note.hidden = !issue;
        if (issue) U.html(b.note, esc(issue), false);
        const unit = key === 'artifacts' ? '份' : '条', more = rows.length > offset + limit || !!packet?.next;
        const last = packet?.total != null || !packet?.next ? Math.max(1, Math.ceil(count / limit)) : '';
        const tally = packet && (packet.total != null || !packet.next)
          ? wallpaperPage ? `共 ${n(count)} 份成品，另有 1 张屏保画面` : `共 ${n(count)} ${unit}`
          : packet ? `已读 ${n(rows.length)} ${unit}` : unavailable;
        U.html(nav, `<span>${tally}</span><span>
          <button class="more" type="button" data-step="-1" ${state.index && !state.pending ? '' : 'disabled'}>‹ 上一页</button>
          <span aria-live="polite">${state.index + 1}${last ? ` / ${last}` : ''}</span>
          <button class="more" type="button" data-step="1" ${more && !state.pending ? '' : 'disabled'}>下一页 ›</button></span>`, false);
        state.loaded = rows.length;
      };
      nav.onclick = async event => {
        const step = Number(event.target.closest('button')?.dataset.step), next = state.index + step;
        if (!step || state.pending) return;
        if (next * limit >= state.loaded && packet?.next) {
          state.issue = '';
          state.pending = true; state.draw();
          try { await load(b); } finally { state.pending = false; }
          if (next * limit >= state.loaded) state.issue = '下一页暂时读不到。';
        }
        if (b.pager === state && next >= 0 && next * limit < state.loaded) state.index = next;
        if (b.pager === state) state.draw();
      };
      state.draw();
    }
    left.push(...right.splice(0));
    const rank = b => (order.indexOf(b.group || b.key) + 1) || order.length + 1;
    left.sort((a, b) => rank(a) - rank(b));
    if (keepWords) left.forEach(b => { if (b.viz) keepWords(b.viz); });
  }

  const columns = keys => keys.map(() => 0);
  window.ProjectPages = Object.assign(window.ProjectPages || {}, { [id]: { adapt, strip, board, lists, columns } });
  if (page === 'steam') import('/live/project/interface.js')
    .then(m => m.mountInterface(id, document.querySelector('#pj-board')))
    .catch(error => console.warn(error.message));
})();
