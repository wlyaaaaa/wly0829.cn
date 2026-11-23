// 实况 · 开场页：三家 AI（Claude、Codex、Antigravity）开对话时最先读到的那一整页，原样照登。
// 本人 11-24 01:36 定的（FEDQ2 选 A）：智能体下面另开一页，三家用页签切换；和规则页一样的段收成一行、点开看原文，
// 只这一家有的展开、标“只有 X 有”；附开场时程序另外补的几行；右栏三家比一比。
// 数据读 /computer-access/live/v1/agents/startup（后台第 7 件）：进这一页才读，智能体页不预读。
// 网址 ?family=claude|codex|antigravity 直接落在这一家，不带时落在 Claude；#startup 落在“开场时程序另外补的几行”。
// 访客版和本人版一样，只过全站禁词过滤（后台做）；这页不另藏东西。
(() => {
  'use strict';
  const T = window.LiveTape, U = window.LiveUI, { esc } = U;
  const { HOSTS, list, known, int, when, link } = T;
  const HOOK_NAMES = { SessionStart: '开场给项目指路', Rules: '核对规则版本', PostCompactRewake: '压缩后接着办', PreInvocation: '叫模型前补状态' };
  const pick = id => HOSTS.some(h => h.id === id) ? id : 'claude';
  let family = pick(new URLSearchParams(location.search).get('family'));
  let state, viewer = 'public', landed = false;

  // —— 取数：后台给什么，都在这一段转成页面要的样子；约定改了只改这一段 ——
  // 后台形状（数据约定第 7 节）：data = { active_version, charter_href, hosts:{Claude|Codex|Antigravity:{version,current,characters,
  //   files:[{name,text,characters,version,paragraphs:[{first_line,last_line,kind,shared_with}]}]}}, startup_context:[{at,host,hook,event,text}] }
  // kind：charter 和约法（规则页）一样 · shared 和别家入口共用 · host_only 只这一家有 · unverified 材料不全没比对
  const plain = v => T.plain(v, viewer);
  const num = v => known(v) ? v : null;
  const serial = v => { const m = /(\d+)\s*$/.exec(String(v || '')); return m ? Number(m[1]) : null; };
  const hostOf = v => HOSTS.find(h => h.name === v || h.id === String(v || '').toLowerCase());
  function model(d) {
    const raw = d.hosts && typeof d.hosts === 'object' ? d.hosts : null;
    const active = plain(d.active_version) || null;
    const hosts = HOSTS.map(h => {
      const r = raw ? raw[h.name] ?? raw[h.id] ?? null : null;
      const files = list(r?.files).map(f => file(f, h));
      const version = plain(r?.version) || null;
      const behind = r?.current === false && serial(active) != null && serial(version) != null ? serial(active) - serial(version) : null;
      const only = files.flatMap(f => f.blocks.filter(b => b.kind === 'host_only').map(b => b.label)).filter(Boolean);
      return { ...h, present: Boolean(r), version, current: typeof r?.current === 'boolean' ? r.current : null, behind,
        characters: num(r?.characters), files, only, context: opening(list(d.startup_context), h) };
    });
    const c = d.charter && typeof d.charter === 'object' ? d.charter : null, ref = d.charter_href || c?.href || '';
    return { active, hosts, hasHosts: Boolean(raw), charter: c && { version: plain(c.version) || null },
      rulesHref: T.path(ref) ? ref : '/rules/' };
  }
  function file(f, h) {
    const text = f?.text == null ? null : plain(f.text);
    const lines = text == null ? [] : text.split(/\r?\n/), marks = [];
    for (const p of list(f?.paragraphs)) {
      const a = Math.max(1, Math.round(p.first_line)), b = Math.min(lines.length, Math.round(p.last_line));
      for (let i = a; i <= b; i++) marks[i] = { kind: String(p.kind || ''), shared: list(p.shared_with) };
    }
    return { name: plain(f?.name), characters: num(f?.characters), readable: text != null, blocks: blocks(lines, marks, h) };
  }
  // 开场时补的几行：这一家最近一次开场（同一次开场的几条钩子前后差不到 2 分钟），按先后接起来原样给
  function opening(rows, h) {
    const mine = rows.filter(r => hostOf(r.host) === h && T.stamp(r.at)).sort((a, b) => T.stamp(b.at) - T.stamp(a.at));
    if (!mine.length) return null;
    const last = T.stamp(mine[0].at), group = mine.filter(r => last - T.stamp(r.at) <= 120000).reverse();
    const text = group.map(r => plain(r.text)).filter(s => s.trim()).join('\n');
    return text ? { at: mine[0].at, text, hooks: group.map(r => r.hook || r.event).filter(Boolean) } : null;
  }

  // —— 把一份入口原文切成段：按一、二级标题切，同一段里再按“和规则页一样／只这家有／共用”分开 ——
  const HEAD = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
  const clean = s => String(s || '').replace(/\x60([^\x60]*)\x60/g, '$1').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/, '').replace(/^#+\s*/, '').trim();
  const cut = (s, n = 30) => s.length > n ? s.slice(0, n - 1) + '…' : s;
  function blocks(lines, marks) {
    // 文件头（--- trigger: always_on --- 这类给宿主看的设置）和 <!-- E494 --> 版本注释不是正文，不登
    let from = 0;
    if (/^---\s*$/.test(lines[0] || '')) { const end = lines.findIndex((l, i) => i > 0 && /^---\s*$/.test(l)); if (end > 0) from = end + 1; }
    const rows = [];
    for (let i = from; i < lines.length; i++) {
      if (/^\s*<!--.*-->\s*$/.test(lines[i])) continue;
      rows.push({ text: lines[i], kind: marks[i + 1]?.kind || '', shared: marks[i + 1]?.shared || [] });
    }
    const sections = [];
    for (const row of rows) {
      const m = HEAD.exec(row.text);
      if (!sections.length || m && m[1].length <= 2) sections.push({ titles: m && m[1].length <= 2 ? [clean(m[2])] : [], rows: [] });
      sections.at(-1).rows.push(row);
    }
    // 只有标题、没有正文的段（如“# 我的 AI 约法”）并进下一段，标题写成“我的 AI 约法 · 最要紧的……”
    for (let i = sections.length - 2; i >= 0; i--) {
      const s = sections[i], next = sections[i + 1];
      if (s.titles.length && s.rows.every(r => !r.text.trim() || HEAD.test(r.text))) {
        next.titles = [...s.titles, ...next.titles]; next.rows = [...s.rows, ...next.rows]; sections.splice(i, 1);
      }
    }
    const out = [];
    for (const s of sections) {
      let run = null, first = true;
      for (const row of s.rows) {
        const blank = !row.text.trim();
        // 光有标题的一截跟着下面的正文算（标题“三家都有”、正文“只这家有”时，整段按正文标）
        const headOnly = run && run.rows.some(r => r.text.trim()) && run.rows.every(r => !r.text.trim() || HEAD.test(r.text));
        if (!blank && run && row.kind !== run.kind && headOnly && !HEAD.test(row.text)) { run.kind = row.kind; run.shared = row.shared; }
        if (!run || !blank && row.kind !== run.kind) {
          if (run && !run.rows.some(r => r.text.trim())) out.pop();
          run = { kind: blank ? '' : row.kind, shared: row.shared, rows: [], label: '' };
          out.push(run);
        }
        if (!blank && !run.rows.some(r => r.text.trim())) {
          run.kind = row.kind; run.shared = row.shared;
          run.label = first && s.titles.length ? s.titles.join(' · ') : cut(clean(row.text));
          first = false;
        }
        // “哪几家也有”按正文算：几段正文都有的那几家（标题人人都有，不算）
        if (!blank && !HEAD.test(row.text)) { run.shared = run.body ? run.shared.filter(x => row.shared.includes(x)) : row.shared; run.body = true; }
        run.rows.push(row);
      }
      if (run && !run.rows.some(r => r.text.trim())) out.pop();
    }
    for (const b of out) {
      while (b.rows.length && !b.rows[0].text.trim()) b.rows.shift();
      while (b.rows.length && !b.rows.at(-1).text.trim()) b.rows.pop();
    }
    return out.filter(b => b.rows.length);
  }

  // —— 原文排版：标题、段落、列表、加粗、代码；本机路径的链接网页上打不开，只留字 ——
  function inline(s) {
    const codes = [];
    let t = esc(s).replace(/\x60([^\x60]+)\x60/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
    t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => /^https?:\/\//.test(href)
        ? `<a class="op-ext" href="${href}" target="_blank" rel="noopener">${label}</a>` : `<span class="op-ref">${label}</span>`);
    return t.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`);
  }
  function md(lines) {
    let html = '', para = [], fence = null;
    const stack = [];
    const flush = () => { if (para.length) html += `<p>${para.map(inline).join('<br>')}</p>`; para = []; };
    const close = (indent = -1) => { while (stack.length && stack.at(-1).indent > indent) html += `</li></${stack.pop().type}>`; };
    for (const line of lines) {
      if (fence) { if (/^\s*(\x60{3}|~{3})/.test(line)) { html += `<pre>${esc(fence.join('\n'))}</pre>`; fence = null; } else fence.push(line); continue; }
      if (/^\s*(\x60{3}|~{3})/.test(line)) { flush(); close(); fence = []; continue; }
      if (!line.trim()) { flush(); continue; }
      const head = HEAD.exec(line), item = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(line);
      if (head) { flush(); close(); const lvl = head[1].length; html += `<h3 class="op-h${Math.min(lvl, 3)}">${inline(head[2])}</h3>`; continue; }
      if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { flush(); close(); html += '<hr>'; continue; }
      if (item) {
        flush();
        const indent = item[1].replace(/\t/g, '    ').length, type = /\d/.test(item[2]) ? 'ol' : 'ul';
        close(indent);
        const top = stack.at(-1);
        if (top && top.indent === indent) {
          if (top.type === type) html += '</li><li>';
          else { html += `</li></${stack.pop().type}><${type} class="op-list"><li>`; stack.push({ type, indent }); }
        } else { html += `<${type} class="op-list"><li>`; stack.push({ type, indent }); }
        html += inline(item[3]);
        continue;
      }
      if (stack.length && /^\s{2,}\S/.test(line)) { html += '<br>' + inline(line.trim()); continue; }
      close();
      if (/^\s*>/.test(line)) { flush(); html += `<blockquote>${inline(line.replace(/^\s*>\s?/, ''))}</blockquote>`; continue; }
      para.push(line.trim());
    }
    if (fence) html += `<pre>${esc(fence.join('\n'))}</pre>`;
    flush(); close();
    return html;
  }

  // —— 画 ——
  const words = n => known(n) ? `${int(n)} 字` : '字数没读到';
  function versionText(m, h) {
    if (!h.version) return '<span class="op-warn">版本没读到</span>';
    if (h.current === true) return `${esc(h.version)} 当前版`;
    if (h.current === false) return `<span class="op-warn">${esc(h.version)}，${h.behind > 0 ? `比当前版 ${esc(m.active)} 落后 ${h.behind} 版` : `不是当前版${m.active ? ' ' + esc(m.active) : ''}`}</span>`;
    return `${esc(h.version)}<small>是不是当前版没比对上</small>`;
  }
  function head() {
    return `<div class="tp-head op-head"><div><h1>开场页</h1><p>每家 AI 开对话时最先读到的那一整页，原样照登。和规则页一样的段落收起来，只这一家有的展开标出来。</p></div></div>`;
  }
  function tabs(m) {
    return `<div class="op-tabs" role="tablist" aria-label="看哪一家">${m.hosts.map(h => `<button type="button" role="tab" data-family="${h.id}" data-host="${h.id}" aria-selected="${h.id === family}"><i class="tp-swatch"></i>${h.name}</button>`).join('')}</div>`;
  }
  function metaRow(m, h) {
    const read = state?.meta?.at && when(state.meta.at);
    return `<div class="op-meta"><p>${[versionText(m, h), words(h.characters), read && `${esc(read)} 读到`].filter(Boolean).join('<span class="op-dot">·</span>')}</p>${link(m.rulesHref, '看规则页 ›')}</div>`;
  }
  function sharedTag(shared, h) {
    const names = list(shared).map(n => hostOf(n)).filter(x => x && x !== h).map(x => x.name);
    if (!names.length) return '';
    return `<span class="op-tag">${names.length === HOSTS.length - 1 ? '三家都有' : `${names.join('、')} 也有`}</span>`;
  }
  function blockHtml(b, h, key) {
    const body = md(b.rows.map(r => r.text));
    if (b.kind === 'charter') {
      return `<details class="op-same" id="${esc(key)}"><summary class="live-disclosure"><span class="op-same__title"><b>${esc(b.label || '这一段')}</b><span> —— 和规则页一样</span></span><span class="op-same__open" aria-hidden="true"></span></summary><div class="op-md op-same__body">${body}</div></details>`;
    }
    if (b.kind === 'host_only') return `<section class="op-only" data-host="${h.id}"><span class="op-only__tag">只有 ${h.name} 有</span><div class="op-md">${body}</div></section>`;
    const tag = b.kind === 'shared' ? sharedTag(b.shared, h) : b.kind === 'unverified' ? '<span class="op-tag" data-tone="off">材料不全，没比对</span>' : '';
    return `<section class="op-plain">${tag}<div class="op-md">${body}</div></section>`;
  }
  function body(h) {
    if (!h.present) return `<p class="tp-empty">${h.name} 的开场页这一轮没读到。</p>`;
    if (!h.files.length) return `<p class="tp-empty">${h.name} 的入口目录不在，开对话时没有开场页可读。</p>`;
    const many = h.files.length > 1;
    return h.files.map((f, i) => {
      const top = many ? `<p class="op-file"><b>第 ${i + 1} 份 · ${esc(f.name || '没写文件名')}</b><span>${words(f.characters)}</span></p>` : '';
      if (!f.readable) return `${top}<p class="tp-empty">这一份读不到原文。</p>`;
      return top + (f.blocks.length ? f.blocks.map((b, j) => blockHtml(b, h, `same-${h.id}-${i}-${j}`)).join('') : '<p class="tp-empty">这一份是空的。</p>');
    }).join('');
  }
  function contextHtml(h) {
    const c = h.context;
    return `<section class="op-ctx" id="startup"><h2>开场时程序另外补的几行</h2>${c
      ? `<p class="op-ctx__when">最近一次 ${esc(T.day(c.at))} ${esc(T.clock(c.at))}，原样</p><pre>${esc(c.text)}</pre>`
      : `<p class="tp-empty">${h.name} 最近没采到开场时补的几行。</p>`}</section>`;
  }
  function compare(m) {
    return `<aside class="tp-panel op-side"><h2>三家比一比</h2>${m.hosts.map(h => `<button type="button" class="op-cmp" data-family="${h.id}" data-host="${h.id}" aria-pressed="${h.id === family}">
      <span class="op-cmp__name"><i class="tp-swatch"></i>${h.name}</span>
      <span class="op-cmp__num">${h.present ? `${words(h.characters)} · 只它有的 ${h.only.length} 段` : '这一轮没读到'}</span>
      ${h.only.length ? `<span class="op-cmp__only">${h.only.map(s => esc(cut(s, 22))).join('<br>')}</span>` : ''}
      ${h.current === false ? `<span class="op-cmp__only op-warn">${esc(h.version || '')} 不是当前版</span>` : ''}</button>`).join('')}</aside>`;
  }
  function charterOnly(m) {
    return `<div class="tp-panel op-main"><p class="tp-note" data-tone="off">这一轮只读到规则页的正文${m.charter?.version ? `（${esc(m.charter.version)}）` : ''}，三家开场页的原文没读到。</p>
      <p class="tp-small">和规则页一样的部分在${link(m.rulesHref, '规则页 ›')}</p></div>`;
  }
  function feed(m) {
    const rows = [];
    for (const h of m.hosts) if (h.context) rows.push({ at: h.context.at, actor: h.name,
      text: `开场时补了 ${int(h.context.text.length)} 字${h.context.hooks.length ? `（${[...new Set(h.context.hooks.map(k => HOOK_NAMES[k] || k))].join('、')}）` : ''}`,
      href: T.path('/live/agents/opening/', { family: h.id }) + '#startup', tone: 'info' });
    for (const h of m.hosts) if (h.present) rows.push({ actor: h.name, html: h.current === false ? `<em>不是当前版</em> · ${esc(h.version || '')}` : `<em>${esc(h.version || '')}</em> · ${words(h.characters)} · 只它有的 ${h.only.length} 段`,
      href: T.path('/live/agents/opening/', { family: h.id }), tone: h.current === false ? 'repair' : 'ok' });
    return rows.sort((a, b) => (T.stamp(b.at) || 0) - (T.stamp(a.at) || 0));
  }

  function draw() {
    viewer = T.viewerOf(state);
    const d = state?.data;
    if (!d) {
      T.paint(page.root, `${head()}${T.placeholder(state, '开场页')}<p class="tp-small op-fallback">规矩原文在${link('/rules/', '规则页 ›')}</p>`);
      page.tick.set([], { off: true });
      return;
    }
    const m = model(d), h = m.hosts.find(x => x.id === family);
    T.paint(page.root, `${head()}${T.stateNote(state)}${m.hasHosts
      ? `${tabs(m)}${metaRow(m, h)}<div class="op-grid"><div class="tp-panel op-main" data-host="${h.id}">${body(h)}${contextHtml(h)}</div>${compare(m)}</div>`
      : charterOnly(m)}`);
    page.tick.set(feed(m), { off: state.offline });
    if (!landed && location.hash) landed = T.reveal(location.hash.slice(1));
  }
  const page = T.boot({ resource: 'agents/startup', back: '/live/agents/',
    ask: () => '请看实况开场页：三家 AI 开对话时先读到的那一整页，和规则页有哪里不一样。先用大白话说，别动手。',
    onState(next) { state = next; draw(); } });
  page.root.addEventListener('click', e => {
    const pickBtn = e.target.closest('[data-family]');
    if (!pickBtn || pickBtn.dataset.family === family) return;
    family = pick(pickBtn.dataset.family);
    const url = new URL(location.href);
    url.searchParams.set('family', family);
    url.hash = '';
    history.replaceState(history.state, '', url.pathname + url.search);
    T.keep(page.root, `${pickBtn.closest('.op-side') ? '.op-side' : '.op-tabs'} [data-family="${family}"]`, draw);
  });
})();
