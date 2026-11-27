// 实况 · 开场页：三家 AI（Claude、Codex、Antigravity）开对话时最先读到的那一整页，原样照登。
// 本人 11-24 01:36 定的（FEDQ2 选 A）：智能体下面另开一页，三家用页签切换；和规则页一样的段收成一行、点开看原文，
// 只这一家有的展开、标“只有 X 有”；附开场时程序另外补的几行；右栏三家比一比。
// 数据读 /computer-access/live/v1/agents/startup（后台第 7 件）：进这一页才读，智能体页不预读。
// 网址 ?family=claude|codex|antigravity 直接落在这一家（旧链接的 ?host= 也认），不带时落在 Claude；#startup 落在“开场时程序另外补的几行”。
// 本人 11-26 00:00 定的（OPENING1125 选 A）：照两张样图，每家上面一排“开法”（无项目／网站项目／agents 项目，默认无项目），
// 下面一份文件一行，写实际路径、大小、计数，标清“看到的”还是“按加载规则推算”；Antigravity 写离 2 万还剩多少。?mode= 直接落在那种开法。
// 后台还没给 opening_modes 时，这一页照改之前的样子画。
// 访客版和本人版一样，只过全站禁词过滤（后台做）；这页不另藏东西。
(() => {
  'use strict';
  const T = window.LiveTape, U = window.LiveUI, { esc } = U;
  const { HOSTS, list, known, int, when, link } = T;
  const HOOK_NAMES = { SessionStart: '开场给项目指路', Rules: '核对规则版本', PostCompactRewake: '压缩后接着办', PreInvocation: '叫模型前补状态' };
  const pick = id => HOSTS.some(h => h.id === id) ? id : 'claude';
  const query = new URLSearchParams(location.search);
  let family = pick(String(query.get('family') || query.get('host') || '').toLowerCase());   // 后台旧链接带 ?host= 的也认
  let mode = String(query.get('mode') || 'no_project'), fresh = false;
  let state, viewer = 'public', landed = false;

  // —— 取数：后台给什么，都在这一段转成页面要的样子；约定改了只改这一段 ——
  // 后台形状（数据约定第 7 节）：data = { active_version, charter_href, hosts:{Claude|Codex|Antigravity:{version,current,characters,
  //   files:[{name,text,characters,version,paragraphs:[{first_line,last_line,kind,shared_with}]}]}}, startup_context:[{at,host,hook,event,text,trigger}] }
  // trigger：startup 开对话 · resume 恢复 · compact 压缩后（旧记录没有）。另有 compact_context（每家最近一次压缩后补的那组）、
  // message_context（每家最近一次收到消息时补的，Antigravity 是叫模型前那条，带 characters）：这两样现在只取时刻和字数写进一句话，原文不另摆
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
        characters: num(r?.characters), files, only, context: opening(list(d.startup_context), h),
        compact: latest(d.compact_context, h), message: latest(d.message_context, h),
        triggers: list(d.context_triggers).filter(r => hostOf(r.host) === h && r.enabled === true) };
    });
    const c = d.charter && typeof d.charter === 'object' ? d.charter : null, ref = d.charter_href || c?.href || '';
    return { active, hosts, hasHosts: Boolean(raw), charter: c && { version: plain(c.version) || null },
      rulesHref: T.path(ref) ? ref : '/rules/', modes: modesOf(d) };
  }
  function file(f, h) {
    const text = f?.text == null ? null : plain(f.text);
    const lines = text == null ? [] : text.split(/\r?\n/), marks = [];
    for (const p of list(f?.paragraphs)) {
      const a = Math.max(1, Math.round(p.first_line)), b = Math.min(lines.length, Math.round(p.last_line));
      for (let i = a; i <= b; i++) marks[i] = { kind: String(p.kind || ''), shared: list(p.shared_with) };
    }
    return { name: plain(f?.name), path: plain(f?.path) || null, characters: num(f?.characters), tokens: num(f?.tokens),
      readable: text != null, blocks: blocks(lines, marks, h), rewritten: f?.visitor_text_rewritten === true };
  }
  // 三种开法：data.opening_modes.{no_project|website|agents} = { project_path, hosts:{Claude|Codex|Antigravity:{available, files:[{name,path,
  //   resolved_path,bytes,characters,tokens,scope,file_evidence,load_evidence,imported_by,counted_bytes,excluded_header_bytes}],
  //   file_count,bytes,characters,tokens,count_method, token_limit,tokens_remaining（只 Antigravity）}} }
  // 项目那几份（scope: project）另带 text、version、paragraphs、visitor_text_rewritten，和全局那几份一样登原文；
  // 没读到时 text 为 null；全局文件可按路径取 hosts 中另给的那份原文。
  const MODE_NAMES = { no_project: '无项目', website: '网站项目', agents: 'agents 项目' };
  const baseName = p => String(p || '').split(/[\\/]/).filter(Boolean).at(-1) || '';
  const pathKey = p => (p || '').replaceAll('\\', '/').toLowerCase();
  function modesOf(d) {
    const raw = d.opening_modes && typeof d.opening_modes === 'object' ? d.opening_modes : null;
    if (!raw) return null;
    const order = Object.keys(MODE_NAMES), ids = [...order.filter(k => raw[k]), ...Object.keys(raw).filter(k => !order.includes(k) && raw[k])];
    const out = ids.map(id => {
      const r = raw[id], project = plain(r.project_path) || null;
      const hosts = {};
      for (const h of HOSTS) hosts[h.id] = opened(r.hosts?.[h.name] ?? r.hosts?.[h.id]);
      return { id, name: MODE_NAMES[id] || baseName(project) || id, project, hosts };
    });
    return out.length ? out : null;
  }
  // 后台这次算不出 token、拿上次存下的估算顶上时给 tokens_stale: true 和那次估算的时刻 tokens_at（这一家合计和单份文件都可能有）；
  // 数字照旧，后面补一句“上次估算于 HH:mm”：每张“读哪几份”卡只在卡头合计标一次，文件行、底部合计、下面原文的标题行不再重复标；
  // “三家比一比”每家一格各标一次（各家时刻可能不同）。没标 tokens_stale 的照旧不加字（tokens_at 平常也给，不看它）
  const staleAt = x => x?.tokens_stale === true && T.stamp(x.tokens_at) ? x.tokens_at : null;
  function opened(r) {
    if (!r || typeof r !== 'object' || r.available === false) return null;
    const files = list(r.files).map(f => {
      const row = { path: plain(f.path) || plain(f.name), resolved: plain(f.resolved_path) || null,
        bytes: num(f.bytes), characters: num(f.characters), tokens: num(f.tokens), project: f.scope === 'project', read: f.file_evidence !== 'unavailable',
        load: String(f.load_evidence || ''), importedBy: plain(f.imported_by) || null,
        counted: num(f.counted_bytes), header: num(f.excluded_header_bytes) };
      return { ...row, doc: Object.hasOwn(f, 'text') ? file(f) : null };
    });
    return { files, count: num(r.file_count) ?? files.length, bytes: num(r.bytes), tokens: num(r.tokens), characters: num(r.characters),
      method: String(r.count_method || ''), limit: num(r.token_limit), left: num(r.tokens_remaining), staleAt: staleAt(r) };
  }
  // 开场时补的几行：这一家最近一次开场（同一次开场的几条钩子前后差不到 2 分钟），按先后接起来原样给
  function opening(rows, h) {
    const mine = rows.filter(r => hostOf(r.host) === h && T.stamp(r.at)).sort((a, b) => T.stamp(b.at) - T.stamp(a.at));
    if (!mine.length) return null;
    const last = T.stamp(mine[0].at), group = mine.filter(r => last - T.stamp(r.at) <= 120000).reverse();
    const text = group.map(r => plain(r.text)).filter(s => s.trim()).join('\n');
    // 补了多少字：后台给了 characters 就用它，没给就数这一组原文的字（本人版就是原样补进去的那几行；访客版数的是换过说法的那份）
    const chars = group.reduce((s, r) => s + (num(r.characters) ?? plain(r.text).length), 0);
    return text ? { at: mine[0].at, text, chars, hooks: group.map(r => r.hook || r.event).filter(Boolean),
      triggers: [...new Set(group.map(r => TRIGGERS[r.trigger]).filter(Boolean))] } : null;
  }
  const TRIGGERS = { startup: '开对话时', resume: '恢复时', compact: '压缩后' };
  // 压缩后、收到消息时补的那几行：只要这一家最近一次的时刻和字数（字段不在就是 null，那句话照不带数的写）
  function latest(rows, h) {
    const mine = list(rows).filter(r => hostOf(r.host) === h && T.stamp(r.at)).sort((a, b) => T.stamp(b.at) - T.stamp(a.at));
    if (!mine.length) return null;
    const at = mine[0].at, group = mine.filter(r => T.stamp(at) - T.stamp(r.at) <= 120000);
    const chars = group.reduce((s, r) => s + (num(r.characters) ?? plain(r.text).length), 0);
    return { at, chars };
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

  const pathParts = text => text.split(/(?<=[\\/])/u).map(part => `<span class="op-path-segment">${part}</span>`).join('<wbr>');

  // —— 原文排版：标题、段落、列表、加粗、代码；本机路径的链接网页上打不开，只留字 ——
  function inline(s) {
    const codes = [];
    let t = esc(s).replace(/\x60([^\x60]+)\x60/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
    t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => /^https?:\/\//.test(href)
        ? `<a class="op-ext" href="${href}" target="_blank" rel="noopener">${label}</a>` : `<span class="op-ref">${label}</span>`);
    return t.replace(/\u0000(\d+)\u0000/g, (_, i) => {
      const code = codes[i];
      return `<code>${/^(?:[A-Za-z]:[\\/]|\\\\)/u.test(code) ? pathParts(code) : code}</code>`;
    });
  }
  // 段末、行末最后 4 个字（后面只剩标点、前面紧挨着一小段链接或代码时连它一起）粘成一块不折行，
  // 不留一两个字加标点单独占一行（看图 06：工程卡首段末尾“的”。”单独折下去）
  const TAIL = /(?:<(a|span|strong|code)\b[^>]*>[^<]{1,8}<\/\1>)?(?:&[#\w]+;|[^<>&\s]){1,4}$/;
  const QUOTED_TAIL = /[“「][^<“”「」]{1,8}[”」][。！？]$/u;
  const INTRO_WORDS = /(本人定|等(?:你|本人)的事|句末)/u;
  function tail(html, intro = false, phrases) {
    const suffix = html.match(intro && QUOTED_TAIL.test(html) ? QUOTED_TAIL : TAIL);
    if (!suffix) return html;
    let cut = suffix.index;
    if (!suffix[0].includes('<')) {
      let start = html.lastIndexOf('>', cut - 1) + 1;
      for (const part of U.wordParts(html.slice(start), phrases)) {
        const end = start + part.length;
        if (end > cut) { cut = start; break; }
        start = end;
      }
    }
    return `${html.slice(0, cut)}<span class="op-tail">${html.slice(cut)}</span>`;
  }
  function md(lines, intro = false) {
    let html = '', para = [], fence = null;
    const stack = [];
    const flush = () => {
      if (!para.length) return;
      const phrases = intro ? INTRO_WORDS : undefined;
      const lines = para.map((line, i) => tail(inline(line), intro && i === para.length - 1, phrases)).join('<br>');
      html += `<p${intro ? ' class="op-project-intro"' : ''}>${intro ? U.keepWords(lines, phrases) : lines}</p>`;
      intro = false; para = [];
    };
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
        html += tail(inline(item[3])).replace(/<[^>]+>|网站上线收尾/g,
          part => part.startsWith('<') ? part : `<span class="live-unit">${part}</span>`);
        continue;
      }
      if (stack.length && /^\s{2,}\S/.test(line)) { html += '<br>' + tail(inline(line.trim())); continue; }
      close();
      if (/^\s*>/.test(line)) { flush(); html += `<blockquote>${tail(inline(line.replace(/^\s*>\s?/, '')))}</blockquote>`; continue; }
      para.push(line.trim());
    }
    if (fence) html += `<pre>${esc(fence.join('\n'))}</pre>`;
    flush(); close();
    return html;
  }

  // —— 画 ——
  const words = n => known(n) ? `${int(n)} 字` : '字数没读到';
  // 规矩版本号点了去规则页（本人 11-24：“规则E多少多少可以跳转到规则页”），别的字不动
  function versionText(m, h) {
    if (!h.version) return '<span class="op-warn">版本没读到</span>';
    const ver = link(m.rulesHref, esc(h.version));
    if (h.current === true) return `${ver} 当前版`;
    if (h.current === false) return `<span class="op-warn">${ver}，${h.behind > 0 ? `比当前版 ${esc(m.active)} 落后 ${h.behind} 版` : `不是当前版${m.active ? ' ' + esc(m.active) : ''}`}</span>`;
    return `${ver}<small>是不是当前版没比对上</small>`;
  }
  function head(m) {
    const say = m?.modes ? '每家 AI 开对话时读进去的规矩文件，一份一份列出实际路径，原样照登。' : '每家 AI 开对话时最先读到的那一整页，原样照登。';
    return `<div class="tp-head op-head"><div><h1>开场页</h1><p>${say}和规则页一样的段落收起来，只这一家有的展开标出来。</p></div></div>`;
  }

  // —— 开法：一排胶囊切换；下面“读哪几份”一份一行 ——
  const modeOf = m => m.modes.find(x => x.id === mode) || m.modes[0];
  const whenOpen = o => o.id === 'no_project' ? `${o.name}时` : `选${/^[A-Za-z0-9]/.test(o.name) ? ' ' : ''}${o.name}时`;
  const approx = r => r?.method === 'o200k_base_estimate';
  const tokens = (n, r) => known(n) ? `${approx(r) ? '约 ' : ''}<b>${int(n)}</b> token` : 'token 没算出';
  const staleNote = x => x?.staleAt ? `<small class="op-stale">上次估算于 ${esc(when(x.staleAt))}</small>` : '';
  const EV = { observed: '看到的', inferred: '按加载规则推算', unavailable: '读不到' };
  const ev = kind => `<span class="op-ev" data-ev="${EV[kind] ? kind : 'unavailable'}">${EV[kind] || '没标'}</span>`;
  function modeRow(m, h) {
    const o = modeOf(m);
    const pills = m.modes.map(x => { const r = x.hosts[h.id];
      return `<button type="button" data-mode="${esc(x.id)}" aria-pressed="${x === o}">${esc(x.name)} · ${r ? `${int(r.count)} 份` : '没读到'}</button>`; }).join('');
    const hint = o.project ? `从 <code>${esc(o.project)}</code> 开对话时` : '选了项目，会多读那个项目自己的规矩';
    return `<div class="op-modes" data-host="${h.id}" role="group" aria-label="开法"><span class="op-modes__label">开法</span>${pills}<span class="op-modes__hint">${hint}</span></div>`;
  }
  // 每份下面那行小字：大小，链到哪、谁引进来，截没截
  function fileNote(f, r) {
    const at = p => { const i = r.files.findIndex(x => x.path === p); return i >= 0 ? `第 ${i + 1} 份` : `<code>${esc(p)}</code>`; };
    const pulls = r.files.filter(x => x.importedBy && x.importedBy === f.path);
    return [!f.read ? '<span class="op-warn">这份读不到</span>' : known(f.bytes) ? `${int(f.bytes)} 字节` : '大小没读到',
      f.resolved && f.resolved !== f.path && `链到 <code>${esc(f.resolved)}</code>`,
      ...pulls.map(x => `用 @${esc(baseName(x.path))} 把${at(x.path)}引进来`),
      f.importedBy && `由${at(f.importedBy)}引进来`,
      /\.local\.md$/i.test(f.path) && '这台电脑自己的，不进仓库',
      known(f.counted) && known(f.bytes) && f.counted < f.bytes - (f.header || 0) && '太长，后面按行截掉了，按截后的算'].filter(Boolean).join(' · ');
  }
  function fileRow(f, i, r) {
    return `<div class="op-fr"${f.project ? ' data-scope="project"' : ''}><span class="op-fr__no">第 ${i + 1} 份</span>
      <div class="op-fr__path"><code>${esc(f.path || '没写路径')}</code><small>${fileNote(f, r)}</small></div>
      <span class="op-fr__num">${tokens(f.tokens, r)}</span>${ev(f.load)}</div>`;
  }
  function howCounted(r, h) {
    if (r.method === 'antigravity_settings') {
      const cut = new Map();
      r.files.forEach((f, i) => { if (f.header > 0) cut.set(f.header, [...(cut.get(f.header) || []), i + 1]); });
      const heads = [...cut].map(([n, at]) => `第 ${at.join('、')} 份开头 ${int(n)} 字节`).join('，');
      const cap = known(r.limit) ? (r.limit % 10000 === 0 ? `${r.limit / 10000} 万` : int(r.limit)) : '';
      return `按 Antigravity 设置页自己的算法：每份按 UTF-8 字节数 ÷ 3 向上取整${heads ? `，${heads}的触发设置不算` : ''}。${cap ? `${cap}是全局和项目规则合用的上限，超了大的几份改成用到时再读。` : ''}`;
    }
    if (r.method === 'o200k_base_estimate') return `token 是用 GPT 的分词表估的，${h.name} 自己的计数没拿到，所以都写“约”。`;
    return 'token 是怎么算出来的这一轮没读到，下一轮会自动再读。';
  }
  function filesCard(m, h) {
    const o = modeOf(m), r = o.hosts[h.id];
    const attrs = `class="tp-panel op-files" data-host="${h.id}"${fresh ? ' data-fresh' : ''}`;
    if (!r) return `<section ${attrs}><div class="op-files__head"><h2>${esc(whenOpen(o))}读哪几份</h2></div><p class="tp-empty">${h.name} ${esc(whenOpen(o))}读哪几份，这一轮没读到。</p></section>`;
    let sum;
    if (known(r.limit)) {
      const over = known(r.tokens) && r.tokens > r.limit, load = r.files.length && r.files.every(f => f.load === 'observed') ? 'observed' : 'inferred';
      const left = over ? `<em data-tone="over">超了 ${int(r.tokens - r.limit)}</em>` : known(r.left) ? `<em>还剩 ${T.big(r.left, `op-left-${h.id}`)}</em>` : '';
      sum = `<p class="op-files__sum">规则 <b>${known(r.tokens) ? T.big(r.tokens, `op-tok-${h.id}`) : '没算出'}</b> / ${int(r.limit)} token${left}${ev(load)}</p>
        ${known(r.tokens) ? `<div class="op-gauge"${over ? ' data-tone="over"' : ''}><i style="width:${Math.min(100, r.tokens / r.limit * 100).toFixed(1)}%"></i></div>` : ''}`;
    } else {
      const base = m.modes.find(x => x.id === 'no_project')?.hosts[h.id], more = o.id !== 'no_project' && base ? r.count - base.count : null;
      sum = `<p class="op-files__sum">合计${known(r.tokens) ? `${approx(r) ? '约' : ''} <b>${T.big(r.tokens, `op-tok-${h.id}`)}</b> token${staleNote(r)}` : ' token 没算出'}${known(more) ? `<em>${more > 0 ? `比无项目多读 ${int(more)} 份` : '和无项目读的一样'}</em>` : ''}</p>`;
    }
    const own = r.files.filter(f => !f.project).length, extra = r.files.length - own;
    const rows = r.files.map((f, i) => (extra && i === 0 ? '<h3 class="op-files__group">全局入口</h3>' : '')
      + (extra && i === own ? `<h3 class="op-files__group">${esc(o.name)}多读的 ${int(extra)} 份</h3>` : '') + fileRow(f, i, r)).join('');
    const total = [`合计 ${int(r.count)} 份`, known(r.bytes) ? `${int(r.bytes)} 字节` : '字节数没读全', known(r.tokens) ? `${approx(r) ? '约 ' : ''}${int(r.tokens)} token` : 'token 没算全'];
    // 签的说明只写这一家这种开法里真出现的那几种（Claude 全是“按加载规则推算”时，不再列一条用不上的“看到的”）
    const SAYS = { observed: `${h.id === 'antigravity' ? 'Antigravity 设置页' : `${h.name} 自己的界面`}上列着这一份，数也对得上。`,
      inferred: '文件和大小是磁盘上的实数，开对话读不读，是照厂商写的加载规则推的。' };
    const used = Object.keys(SAYS).filter(k => r.files.some(f => f.load === k));
    return `<section ${attrs}><div class="op-files__head"><h2>${esc(whenOpen(o))}读这 ${int(r.count)} 份</h2>${sum}</div>
      <p class="op-files__how">${howCounted(r, h)}</p>
      ${r.files.length ? rows : `<p class="tp-empty">${esc(whenOpen(o))}，${h.name} 没有要读的规矩文件。</p>`}
      <p class="op-files__total">${total.join(' · ')}</p>
      ${used.length ? `<ul class="op-files__legend">${used.map(k => `<li>${ev(k)}<span>${SAYS[k]}</span></li>`).join('')}</ul>` : ''}</section>`;
  }
  function tabs(m) {
    return `<div class="op-tabs" role="tablist" aria-label="看哪一家">${m.hosts.map(h => `<button type="button" role="tab" data-family="${h.id}" data-host="${h.id}" aria-selected="${h.id === family}"><i class="tp-swatch"></i>${h.name}</button>`).join('')}</div>`;
  }
  function metaRow(m, h) {
    const read = state?.meta?.at && when(state.meta.at);
    const base = m.modes?.find(x => x.id === 'no_project')?.hosts[h.id];
    return `<div class="op-meta"><p>${[versionText(m, h), words(base?.characters ?? h.characters), read && `${esc(read)} 读到`].filter(Boolean).join('<span class="op-dot">·</span>')}</p>${link(m.rulesHref, '看规则页 ›')}</div>`;
  }
  function sharedTag(shared, h) {
    const names = list(shared).map(n => hostOf(n)).filter(x => x && x !== h).map(x => x.name);
    if (!names.length) return '';
    return `<span class="op-tag">${names.length === HOSTS.length - 1 ? '三家都有' : `${names.join('、')} 也有`}</span>`;
  }
  function blockHtml(b, h, key, intro) {
    const body = md(b.rows.map(r => r.text), intro);
    if (b.kind === 'charter') {
      return `<details class="op-same" id="${esc(key)}"><summary class="live-disclosure"><span class="op-same__title"><b>${esc(b.label || '这一段')}</b><span> —— 和规则页一样</span></span><span class="op-same__open" aria-hidden="true"></span></summary><div class="op-md op-same__body">${body}</div></details>`;
    }
    if (b.kind === 'host_only') return `<section class="op-only" data-host="${h.id}"><span class="op-only__tag">只有 ${h.name} 有</span><div class="op-md">${body}</div></section>`;
    const tag = b.kind === 'shared' ? sharedTag(b.shared, h) : b.kind === 'unverified' ? '<span class="op-tag" data-tone="off">材料不全，没比对</span>' : '';
    return `<section class="op-plain">${tag}<div class="op-md">${body}</div></section>`;
  }
  function body(m, h) {
    const on = Boolean(m.modes), r = on && modeOf(m).hosts[h.id];
    if (on ? !r : !h.present) return `<p class="tp-empty">${h.name} 这种开法要读的规矩原文这一轮没读到，下一轮会自动再读。</p>`;
    const globals = new Map(h.files.filter(f => f.path).map(f => [pathKey(f.path), f]));
    const files = on ? r.files.map(f => {
      const doc = f.doc || globals.get(pathKey(f.path)) || globals.get(pathKey(f.resolved));
      return { ...doc, path: f.path, project: f.project, characters: f.characters ?? doc?.characters, tokens: f.tokens ?? doc?.tokens,
        readable: f.read && doc?.readable };
    }) : h.files;
    if (!files.length) return `<p class="tp-empty">${h.name} 这种开法没有要读的规矩文件。</p>`;
    const many = files.length > 1;
    const near = r ? approx(r) : h.id !== 'antigravity';
    const one = (f, i, key) => {
      // 有开法时每份都写路径和 token（和上面“读哪几份”的第几份对得上）；后台还没给开法时照改之前的样子。
      // 访客版这一份换了说法的，本人版在抬头挂全站同一个“对外换了说法”小签
      const file = (on && f.path) || f.name || '没写文件名';
      const path = pathParts(esc(file));
      const top = many || on ? `<p class="op-file"><b>第 ${i + 1} 份 · ${path}</b><span>${f.rewritten ? U.visitorRewrittenTag('这一份', '', viewer) : ''}${[words(f.characters),
        on && known(f.tokens) && `${near ? '约 ' : ''}${int(f.tokens)} token`].filter(Boolean).join(' · ')}</span></p>` : '';
      if (!f.readable) return `${top}<p class="tp-empty">这一份读不到原文。</p>`;
      if (!f.blocks.length) return `${top}<p class="tp-empty">这一份是空的。</p>`;
      const projectCard = f.project && mode === 'website' && baseName(f.path).toLowerCase() === 'claude.local.md';
      return top + f.blocks.map((b, j) => blockHtml(b, h, `same-${key}-${j}`, projectCard && j === 0)).join('');
    };
    return files.map((f, i) => one(f, i, f.project ? `${h.id}-${mode}-${i}` : `${h.id}-${i}`)).join('');
  }
  const stampText = x => `${esc(T.day(x.at))} ${esc(T.clock(x.at))}`;
  function refillText(h) {
    const when = station => [...new Set(h.triggers.filter(r => r.station === station)
      .map(r => plain(r.when).trim().replace(/。$/, '')).filter(Boolean))].map(esc).join('，');
    const start = when('start'), message = when('message');
    const configured = [start && `${start}时补这几行`, message && `${message}时另补几行状态`].filter(Boolean);
    const sample = [
      h.compact && `压缩后最近一次在 ${stampText(h.compact)}，补了 ${int(h.compact.chars)} 字`,
      h.message && `另补状态最近一次在 ${stampText(h.message)}，补了 ${int(h.message.chars)} 字`,
    ].filter(Boolean);
    return [...configured, ...sample, link('/live/agents/#hooks-message', '原样在智能体页 ›')].join(' · ');
  }
  function contextHtml(h) {
    const c = h.context, refill = refillText(h);
    const what = c?.triggers?.length ? `（${c.triggers.join('、')}）` : '';
    return `<section class="op-ctx" id="startup"><h2>开场时程序另外补的几行</h2>${c
      ? `<p class="op-ctx__when">${U.keepWords(`最近一次 ${stampText(c)}${what}，补了 ${int(c.chars)} 字，下面是原样${refill ? ` · ${refill}` : ''}`)}</p><pre>${esc(c.text)}</pre>`
      : `<p class="tp-empty">${h.name} 最近没采到开场时补的几行${refill ? `；${refill}` : ''}。</p>`}</section>`;
  }
  // 有开法时：几份、多少 token 跟着选的开法变；“只它有的几段”是全局入口原文里的，不跟开法变
  function cmpNum(m, h) {
    if (!m.modes) return `<span class="op-cmp__num">${h.present ? `${words(h.characters)} · 只它有的 ${h.only.length} 段` : '这一轮没读到'}</span>`;
    const r = modeOf(m).hosts[h.id];
    const size = !r ? '这种开法没读到' : `${int(r.count)} 份 · ${!known(r.tokens) ? 'token 没算出' : known(r.limit) ? `${int(r.tokens)} / ${int(r.limit)} token` : `${approx(r) ? '约 ' : ''}${int(r.tokens)} token${staleNote(r)}`}`;
    return `<span class="op-cmp__num">${size}</span>${h.present ? `<span class="op-cmp__num">只它有的 ${h.only.length} 段</span>` : ''}`;
  }
  function compare(m) {
    const title = m.modes ? `<div class="op-side__head"><h2>三家比一比</h2><span>${esc(whenOpen(modeOf(m)))}</span></div>` : '<h2>三家比一比</h2>';
    return `<aside class="tp-panel op-side">${title}${m.hosts.map(h => `<button type="button" class="op-cmp" data-family="${h.id}" data-host="${h.id}" aria-pressed="${h.id === family}">
      <span class="op-cmp__name"><i class="tp-swatch"></i>${h.name}</span>
      ${cmpNum(m, h)}
      ${h.only.length ? `<span class="op-cmp__only">${h.only.map(s => esc(cut(s, 22))).join('<br>')}</span>` : ''}</button>
      ${h.current === false ? `<p class="op-cmp__ver op-warn" data-host="${h.id}">${h.version ? `${link(m.rulesHref, esc(h.version))} ` : ''}不是当前版</p>` : ''}`).join('')}</aside>`;
  }
  function charterOnly(m) {
    return `<div class="tp-panel op-main"><p class="tp-note" data-tone="off">这一轮只读到规则页的正文${m.charter?.version ? `（${link(m.rulesHref, esc(m.charter.version))}）` : ''}，三家开场页的原文没读到。</p>
      <p class="tp-small">和规则页一样的部分在${link(m.rulesHref, '规则页 ›')}</p></div>`;
  }
  function feed(m) {
    const rows = [];
    for (const h of m.hosts) if (h.context) rows.push({ at: h.context.at, actor: h.name,
      text: `开场时补了 ${int(h.context.chars)} 字${h.context.hooks.length ? `（${[...new Set(h.context.hooks.map(k => HOOK_NAMES[k] || k))].join('、')}）` : ''}`,
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
    if (m.modes && !m.modes.some(x => x.id === mode)) mode = m.modes[0].id;
    const main = `<div class="tp-panel op-main" data-host="${h.id}">${body(m, h)}${contextHtml(h)}</div>`;
    T.paint(page.root, `${head(m)}${T.stateNote(state)}${m.hasHosts || m.modes
      ? `${tabs(m)}${metaRow(m, h)}${m.modes ? modeRow(m, h) : ''}<div class="op-grid">${m.modes ? `<div class="op-col">${filesCard(m, h)}${main}</div>` : main}${compare(m)}</div>`
      : charterOnly(m)}`);
    fresh = false;
    page.tick.set(feed(m), { off: state.offline });
    if (!landed && location.hash) landed = T.reveal(location.hash.slice(1));
  }
  const page = T.boot({ resource: 'agents/startup', back: '/live/agents/',
    ask: () => '请看实况开场页：三家 AI 开对话时先读到的那一整页，和规则页有哪里不一样。先用大白话说，别动手。',
    onState(next) { state = next; draw(); } });
  page.root.addEventListener('click', e => {
    const modeBtn = e.target.closest('[data-mode]');
    if (modeBtn) {
      if (modeBtn.dataset.mode === mode) return;
      mode = modeBtn.dataset.mode; fresh = true;
      const url = new URL(location.href);
      if (mode === 'no_project') url.searchParams.delete('mode'); else url.searchParams.set('mode', mode);
      history.replaceState(history.state, '', url.pathname + url.search + url.hash);
      T.keep(page.root, `.op-modes [data-mode="${CSS.escape(mode)}"]`, draw);
      return;
    }
    const pickBtn = e.target.closest('[data-family]');
    if (!pickBtn || pickBtn.dataset.family === family) return;
    family = pick(pickBtn.dataset.family);
    const url = new URL(location.href);
    url.searchParams.delete('host'); url.searchParams.set('family', family);
    url.hash = '';
    history.replaceState(history.state, '', url.pathname + url.search);
    T.keep(page.root, `${pickBtn.closest('.op-side') ? '.op-side' : '.op-tabs'} [data-family="${family}"]`, draw);
  });
})();
