// 微信收发室（/live/project/?id=wechatdirect）自己的几块；page.js 在三处接进来：adapt 改这一页的数据、board 加卡、columns 定卡放哪一栏，
// 另有 artifactsHref：关键数字“最近产物 ›”落到这页自己的档案表，不再画通用的“最近产物”卡。
// 本人 11-27 选的乙第 3 版（不要“最近一次成功读、发”两格）：最上面“现在怎么样”四格；三张小卡（存档最新到、存档文件还打得开吗、图片语音留住多少）；
// 通栏“AI 存过档的聊天”（本机微信一共多少条和存档的几份并排、一根细条写占比、档案表露 5 行）；测速卡和更多数据并排；最下面最近改动（page.js 画）和去哪看细节。
// 访客版同一套页面、同一份接口、同一套按钮：后台给访客的档案名是“档案 1…5”；两版档案名旁都挂紫色“访客看不到”；访客点“在电脑上打开”由共用拦截弹可信设备说明框。
// 每个数、每个日期都照接口字段写，字段没给的那块不画（本人 11-27 14:41 禁令：不显示没人维护的标识）。
(() => {
  'use strict';
  const U = window.LiveUI, esc = U.esc;
  const ID = 'wechatdirect';
  // 这页自己画的读数；整节都在这里面的那几节不再按通用卡画
  const OWN = new Set(['archives', 'messages', 'latest', 'integrity', 'media', 'saved', 'text', 'image', 'quote', 'voice', 'missing', 'receipt_date',
    'wav', 'archive_bytes', 'ai_bytes', 'unrechecked', 'checked_media', 'check_errors', 'gap_reasons', 'identity_versions', 'archive_records',
    'identity_coverage', 'measurements', 'environment', 'code_chars', 'docs_units', 'docs_files', 'code_files', 'owner_archives', 'unknown_senders',
    'local_messages', 'night_read', 'night_check']);
  const ELSEWHERE = new Set(['missing', 'checked_media', 'check_errors', 'measurements', 'local_messages', 'night_read', 'night_check', 'environment']);
  const MORE_FIRST = ['wav', 'archive_bytes', 'ai_bytes', 'unknown_senders', 'identity_coverage', 'code_files'];
  const DETAIL_FIRST = ['owner_archives', 'archive_records', 'gap_reasons', 'identity_versions', 'environment'];
  const SPEED = [['text', '文字'], ['image', '图片'], ['quote', '引用'], ['voice', '语音']];
  const ROWS = 5;   // 档案表固定露 5 行，其余去“全部 N 份 ›”

  // —— 数怎么写 ——
  const finite = n => typeof n === 'number' && Number.isFinite(n);
  const int = n => Math.round(n).toLocaleString('zh-CN');
  const zoned = at => {
    if (typeof at !== 'string' || !/^\d{4}-\d\d-\d\d/.test(at)) return null;
    if (/^\d{4}-\d\d-\d\d$/.test(at)) return { y: at.slice(0, 4), m: +at.slice(5, 7), d: +at.slice(8, 10), time: '' };
    const t = Date.parse(/(?:Z|[+-]\d\d:\d\d)$/.test(at) ? at : `${at}+08:00`);
    if (!Number.isFinite(t)) return null;
    const f = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(t)).map(p => [p.type, p.value]));
    return { y: f.year, m: +f.month, d: +f.day, time: `${f.hour}:${f.minute}` };
  };
  const md = at => { const z = zoned(at); return z ? `${z.y === '2026' ? '' : `${z.y}年`}${z.m}月${z.d}日` : ''; };
  const mdTime = at => { const z = zoned(at); return z ? `${md(at)}${z.time ? ` ${z.time}` : ''}` : ''; };
  const dash = at => { const z = zoned(at); return z ? `${z.y === '2026' ? '' : `${z.y}-`}${String(z.m).padStart(2, '0')}-${String(z.d).padStart(2, '0')}${z.time ? ` ${z.time}` : ''}` : ''; };
  const n2 = n => n.toLocaleString('zh-CN', { maximumFractionDigits: Math.abs(n) < 10 ? 2 : 1 });
  function amount(m) {
    const v = m?.value && typeof m.value === 'object' ? m.value.value ?? m.value.count : m?.value;
    if (finite(v) && ['字节', 'bytes', 'B'].includes(m.unit)) {
      const units = ['B', 'KB', 'MB', 'GB', 'TB'], p = v ? Math.min(4, Math.max(0, Math.floor(Math.log2(Math.abs(v)) / 10))) : 0;
      return `<b>${esc(n2(v / 1024 ** p))}</b> <small>${units[p]}</small>`;
    }
    if (finite(v)) return `<b>${esc(int(v))}</b>${m.unit ? ` <small>${esc(m.unit)}</small>` : ''}`;
    const text = m?.text ?? (typeof v === 'string' ? v : m?.value?.text);
    return typeof text === 'string' && text ? `<span class="wc-kv__t">${esc(text.replace(/。$/, ''))}</span>` : '';
  }
  const records = section => `/live/records/?project=${ID}&section=${encodeURIComponent(section)}`;
  const chev = '<span class="more__chev">›</span>';
  // 档案名只在右括号后换行（“【6期】”和后面那段各自不断开）；特别长、没有标点的一段才按字换行
  const nameHtml = text => String(text).split(/(?<=[】）)\]])/).map(c => [...c].length <= 12 ? `<span class="wc-nw">${esc(c)}</span>` : esc(c)).join('<wbr>');
  const tagName = () => U.visitorHiddenTag('这份档案的名称', '名称是真实的聊天对象；条数、日期、留住多少和检查结果访客照样看得到', 'owner');

  // —— 数据：读数照原来的 ID 在 sections 里找；后台新给的三项（local_messages、night_read、night_check）同样按 ID 找 ——
  function read(raw) {
    const sections = Array.isArray(raw.sections) ? raw.sections : [];
    const top = raw.metrics && typeof raw.metrics === 'object' ? raw.metrics : {};
    const all = sections.flatMap(s => Array.isArray(s?.metrics) ? s.metrics : []);
    const metric = id => all.find(m => m?.id === id) || (Array.isArray(top) ? top.find(m => m?.id === id) : top[id]) || null;
    const sec = id => sections.find(s => s?.id === id) || null;
    const more = sec('more-data')?.metrics || [];
    const moreRows = more.filter(m => m?.id && m.label && m.shape !== 'table' && !ELSEWHERE.has(m.id));
    moreRows.sort((a, b) => (MORE_FIRST.includes(a.id) ? MORE_FIRST.indexOf(a.id) : 99) - (MORE_FIRST.includes(b.id) ? MORE_FIRST.indexOf(b.id) : 99));
    const details = all.filter(m => m?.shape === 'table' && m.section && m.id !== 'measurements');
    details.sort((a, b) => (DETAIL_FIRST.includes(a.id) ? DETAIL_FIRST.indexOf(a.id) : 99) - (DETAIL_FIRST.includes(b.id) ? DETAIL_FIRST.indexOf(b.id) : 99));
    return { metric, sec, moreRows, details, counts: raw.counts || {}, countsAt: raw.counts_at, needHref: raw.need_href, aiHref: raw.ai_href };
  }
  function adapt(raw) {
    const sections = Array.isArray(raw.sections) ? raw.sections : [];
    const mine = s => Array.isArray(s?.metrics) && s.metrics.length && s.metrics.every(m => OWN.has(m?.id)) && !s.items;
    const dropped = sections.filter(mine);
    return {
      ...raw, headline: null, wechatView: read(raw),   // 页头那一格“已存档聊天”挪进“AI 存过档的聊天”
      sections: sections.filter(s => !mine(s)),
      hidden: finite(raw.hidden) ? Math.max(0, raw.hidden - dropped.reduce((n, s) => n + (finite(s.hidden) ? s.hidden : 0), 0)) : raw.hidden,
    };
  }

  // —— 卡里的“说明 ›”：点开写口径，再点收起 ——
  const notesOf = list => [...new Set(list.filter(x => typeof x === 'string' && x.trim()).map(x => x.trim()))];
  const explainBtn = notes => notes.length ? `<button type="button" class="wc-explain" aria-expanded="false">说明 ${chev}</button>` : '';
  const noteBox = (notes, tags = {}) => notes.length ? `<div class="wc-note" hidden>${notes.map(n => esc(n) + (tags[n] || '')).join('<br>')}</div>` : '';
  document.addEventListener('click', e => {
    const btn = e.target.closest?.('.wc-explain');
    const note = btn?.closest('.pj-card')?.querySelector('.wc-note');
    if (!note) return;
    note.hidden = !note.hidden;
    btn.setAttribute('aria-expanded', String(!note.hidden));
  });

  // —— 现在怎么样：四格 ——
  const dot = state => `<i class="wc-dot is-${state}"></i>`;
  function nowCells(v, viewer) {
    const cells = [], m = v.metric;
    const read = m('night_read'), rv = read?.value || {}, local = m('local_messages')?.value || {};
    if (read && rv.status) {
      const both = finite(local.primary) && finite(local.secondary);
      const main = rv.status === 'passed' ? `读得通${both ? ' · 两个号都数通了' : ''}` : rv.status === 'failed' ? (mdTime(rv.failed_since) ? `从 ${mdTime(rv.failed_since)} 起读不通` : '读不通') : '还没数过';
      const when = rv.status === 'failed' && mdTime(read.at) && mdTime(read.at) !== mdTime(rv.failed_since) ? `最近一次 ${mdTime(read.at)}` : rv.status !== 'failed' ? mdTime(read.at) : '';
      cells.push(['夜里读得通吗', rv.status, main, [when, rv.cadence_text].filter(Boolean).join(' · ')]);
    }
    const check = m('night_check'), cv = check?.value || {};
    if (check && cv.status) {
      const main = cv.status === 'passed' ? '通过' : cv.status === 'failed' ? '没通过' : '还没查过';
      cells.push(['夜里自检', cv.status, main, ['查本机环境', mdTime(check.at), cv.cadence_text].filter(Boolean).join(' · ')]);
    }
    const env = m('environment'), ev = env?.value && typeof env.value === 'object' ? env.value : null;
    if (ev && (ev.status || ev.text)) {
      const ok = ev.status === 'success';
      const main = ok ? `通过${finite(ev.errors) ? ` · ${int(ev.errors)} 处错误` : ''}` : String(ev.text || ev.status);
      const sub = [ok && finite(ev.warnings) ? `${int(ev.warnings)} 条提醒` : '', mdTime(env.at)].filter(Boolean).join(' · ');
      cells.push(['本机依赖检查', ok ? 'passed' : 'failed', main, sub]);
    }
    const c = v.counts;
    if (finite(c.need) || finite(c.ai)) {
      const need = finite(c.need) ? `<a href="${esc(v.needHref || `/live/?project=${ID}#needs`)}">等${viewer === 'owner' ? '你' : '本人'}的事 ${esc(int(c.need))} 件</a>` : '';
      const ai = finite(c.ai) ? `<a href="${esc(v.aiHref || `/live/ledger/?project=${ID}`)}">AI 在办 ${esc(int(c.ai))} 件</a>` : '';
      const busy = (c.need || 0) + (c.ai || 0) > 0;
      cells.push(['有没有要处理的', busy ? 'busy' : 'passed', `${[need, ai].filter(Boolean).join(' · ')}${chev}`, mdTime(v.countsAt), true]);
    }
    return cells;
  }
  function nowHtml(v, viewer) {
    const cells = nowCells(v, viewer);
    if (!cells.length) return '';
    const env = v.metric('environment');
    const notes = notesOf([v.sec('night-status')?.about, v.sec('night-status')?.note, v.metric('night_read')?.note, v.metric('night_check')?.note, env && `本机依赖检查：${[env.note, env.scope].filter(Boolean).join('；')}`]);
    return `<section class="pj-card glass wc-card wc-now"><div class="wc-head"><b>${esc(v.sec('night-status')?.label || '现在怎么样')}</b>${explainBtn(notes)}</div>${noteBox(notes)}
      <div class="wc-now__grid" style="--n:${cells.length}">${cells.map(([k, state, main, sub, html]) => `<div class="wc-now__cell"><p class="wc-now__k">${esc(k)}</p>
        <p class="wc-now__v is-${state}">${dot(state)}<span>${html ? main : esc(main)}</span></p>${sub ? `<p class="wc-now__sub">${esc(sub)}</p>` : ''}</div>`).join('')}</div></section>`;
  }

  // —— 三张小卡 ——
  const foot = (notes, right) => `<div class="wc-foot">${explainBtn(notes)}<span class="wc-cut">${esc(right || '')}</span></div>`;
  function smallCards(v) {
    const m = v.metric, out = [];
    const latest = m('latest'), archives = m('archives'), arch = v.sec('archives');
    const day = typeof latest?.value === 'string' ? latest.value : '';
    if (md(day)) {
      const n = finite(archives?.value) ? archives.value : null;
      const notes = notesOf([arch?.note, latest.note && `档案里最新一条消息：${latest.note}`]);
      out.push(`<section class="pj-card glass wc-card wc-mini"><div class="wc-head"><b>存档最新到</b></div><p class="wc-big">${esc(md(day))}</p>
        <p class="wc-sub">这${n != null ? ` ${esc(int(n))} 份` : ''}存档里最新一条消息</p>${noteBox(notes)}${foot(notes, mdTime(latest.at) && `截止 ${mdTime(latest.at)}`)}</section>`);
    }
    const integ = m('integrity'), files = m('checked_media'), errs = m('check_errors');
    const ratio = typeof integ?.value === 'string' ? integ.value : integ?.text;
    if (ratio) {
      const whole = /^(\d+)\s*\/\s*(\d+)/.exec(ratio), pass = whole && whole[1] === whole[2] && (!errs || errs.value === 0);
      const sub = [finite(files?.value) && `核过 ${int(files.value)} 个文件`, finite(errs?.value) && `${int(errs.value)} 处错误`].filter(Boolean).join(' · ');
      const notes = notesOf([integ.note, integ.scope, files?.note && `核过的文件：${files.note}`]);
      out.push(`<section class="pj-card glass wc-card wc-mini"><div class="wc-head"><b>存档文件还打得开吗</b>${pass ? '<span class="wc-pass">通过</span>' : ''}</div>
        <p class="wc-big">${esc(ratio.replace(/\s*份$/, ''))}<small> 份${pass ? '完好' : ''}</small></p>${sub ? `<p class="wc-sub">${esc(sub)}</p>` : ''}${noteBox(notes)}${foot(notes, mdTime(integ.at) && `核于 ${mdTime(integ.at)}`)}</section>`);
    }
    const media = m('media'), saved = m('saved'), miss = m('missing');
    const total = finite(saved?.value?.total) ? saved.value.total : finite(media?.value) ? media.value : null;
    const kept = finite(saved?.value?.saved) ? saved.value.saved : null;
    if (total && kept != null) {
      const p = kept / total, pct = `${(p * 100).toFixed(1)}%`, R = 40, C = 2 * Math.PI * R;
      const ring = `<svg class="wc-ring" viewBox="0 0 100 100" role="img" aria-label="真存下来 ${pct}"><circle cx="50" cy="50" r="${R}" class="wc-ring__bg"/><circle cx="50" cy="50" r="${R}" class="wc-ring__fg" stroke-dasharray="${(C * p).toFixed(2)} ${C.toFixed(2)}"/><text x="50" y="50">${pct}</text></svg>`;
      const gap = [finite(media?.value) && `出现过 ${int(media.value)} 项`, finite(miss?.value) && `仍缺 ${int(miss.value)} 项`].filter(Boolean).join('，');
      const sec = v.sec('media');
      const notes = notesOf([sec?.about, sec?.note, media?.note && `出现过的：${media.note}`, media?.scope, saved?.note && `真存下来的：${saved.note}`, miss?.note && `没能留住的：${miss.note}`]);
      out.push(`<section class="pj-card glass wc-card wc-mini wc-media"><div class="wc-head"><b>存档里的图片语音留住多少</b></div>
        <div class="wc-media__body">${ring}<div><p class="wc-media__k">真存下来 <b>${esc(int(kept))}</b> 项</p>${gap ? `<p class="wc-sub">${esc(gap)} · 含已存的缩略图</p>` : ''}</div></div>${noteBox(notes)}${foot(notes, mdTime(saved.at || media?.at) && `截止 ${mdTime(saved.at || media?.at)}`)}</section>`);
    }
    return out.length ? `<div class="wc-row wc-row--3" style="--n:${out.length}">${out.join('')}</div>` : '';
  }

  // —— AI 存过档的聊天：本机一共多少条和存档的几份并排、占比细条、档案表 ——
  const lists = {};   // 档案表和打开动作：按看的人各读一次
  function load(viewer, redraw) {
    if (lists.viewer === viewer) return;
    Object.assign(lists, { viewer, rows: null, total: null, at: null, section: null, arts: null });
    // 这一次没读到的，等实况客户端说主数据接通了（again）再取一次
    const once = (resource, query) => window.Live.get(resource, query).then(r => r?.meta?.viewer?.kind && r.meta.viewer.kind !== viewer ? null : r).catch(() => null);
    const get = (resource, query) => once(resource, query).then(r => r?.data || !r?.again ? r : r.again.then(() => once(resource, query)));
    get(`projects/${ID}/records`, { section: 'owner_archives' }).then(r => r?.data && Array.isArray(r.data.items) ? r : get(`projects/${ID}/records`, { section: 'archive_records' }).then(x => x && Object.assign(x, { section: 'archive_records' })))
      .then(r => { if (lists.viewer !== viewer || !r?.data) return; Object.assign(lists, { rows: r.data.items, total: r.data.total, at: r.data.at, section: r.section || 'owner_archives' }); redraw(); });
    get(`projects/${ID}/artifacts`).then(r => { if (lists.viewer !== viewer || !Array.isArray(r?.data?.items)) return; lists.arts = r.data.items; redraw(); });
  }
  function openButton(row, i, viewer) {
    const arts = (lists.arts || []).filter(a => a?.kind === 'archive');
    const art = arts.find(a => a.at && a.at === row.at) || arts[i];
    const action = art && U.artifactAction(art, viewer, href => href);
    if (!action) return '';
    const item = { ...art, id: `${ID}-archive-${i}-${art.at || ''}` };
    return U.actions(item, [action]).replace(/<(button|a) /, '<$1 data-needs-pc ');
  }
  function archivesHtml(v, viewer) {
    const m = v.metric, msgs = m('messages'), archives = m('archives'), receipt = m('receipt_date'), local = m('local_messages');
    const count = finite(msgs?.value?.messages) ? msgs.value.messages : null, files = finite(archives?.value) ? archives.value : finite(msgs?.value?.archives) ? msgs.value.archives : null;
    const lv = local?.value || {}, all = finite(lv.total) ? lv.total : null;
    const left = all != null ? `<div class="wc-sum__side"><p class="wc-sum__k">本机微信一共留着</p><p class="wc-sum__v"><b>${esc(int(all))}</b> 条</p>
      <p class="wc-sum__sub">${esc([finite(lv.primary) && `主号 ${int(lv.primary)}`, finite(lv.secondary) && `副号 ${int(lv.secondary)}`, mdTime(local.at) && `截止 ${mdTime(local.at)}`, lv.cadence_text && `${lv.cadence_text} 数一次`].filter(Boolean).join(' · '))}</p></div>` : '';
    // 最近一次存档：用两版都带钟点的存档完成时刻（访客那份回执时刻只到日，回执时刻放在“更多数据”里、两版挂“换了说法”）
    const last = archives?.at || msgs?.at || receipt?.value || receipt?.at;
    const right = count != null || files != null ? `<div class="wc-sum__side"><p class="wc-sum__k">${all != null ? '其中' : ''}本人点名、AI 存成档案的</p>
      <p class="wc-sum__v">${[files != null && `<b>${esc(int(files))}</b> 份`, count != null && `<b>${esc(int(count))}</b> 条`].filter(Boolean).join('<i> · </i>')}</p>${mdTime(last) ? `<p class="wc-sum__sub">最近一次存档 ${esc(mdTime(last))}</p>` : ''}</div>` : '';
    let bar = '';
    if (all && count != null) {
      const p = count / all * 100, said = p < 1 ? `不到 ${(Math.floor(p * 10) / 10 + 0.1).toFixed(1)}%` : `约 ${p.toFixed(1)}%`;
      bar = `<div class="wc-share" role="img" aria-label="存档的 ${esc(int(count))} 条占本机 ${esc(int(all))} 条的${esc(said)}"><div class="wc-share__bar"><i style="width:${Math.max(p, 1.2).toFixed(2)}%"></i></div><span>${esc(said)}</span></div>`;
    }
    const rows = (lists.rows || []).slice(0, ROWS).map((r, i) => {
      const media = finite(r.media) ? r.media : null, saved = finite(r.saved) ? r.saved : null, p = media ? Math.min(1, (saved || 0) / media) : 0;
      const state = typeof r.state_text === 'string' ? r.state_text : '';
      const ok = /通过/.test(state) && !/未通过|没通过/.test(state);
      return `<div class="wc-tr"><span class="wc-td wc-td--name"><b>${nameHtml(U.fieldText(r.text ?? r.name ?? `档案 ${i + 1}`, viewer))}</b>${tagName()}</span>
        <span class="wc-td wc-td--num">${finite(r.messages) ? `${esc(int(r.messages))} 条` : ''}</span><span class="wc-td">${esc(r.latest || '')}</span>
        <span class="wc-td wc-td--media">${media ? `<span class="wc-mbar"><i style="width:${(p * 100).toFixed(1)}%"></i></span><span class="wc-mnum">${esc(saved != null ? int(saved) : '')}/${esc(int(media))}</span>` : ''}</span>
        <span class="wc-td">${state ? `<span class="wc-check${ok ? ' is-ok' : ''}">${ok ? dot('passed') : ''}${esc(ok ? '通过' : state)}</span>` : ''}</span>
        <span class="wc-td wc-td--num">${esc(dash(r.at))}</span><span class="wc-td wc-td--open">${openButton(r, i, viewer)}</span></div>`;
    }).join('');
    const table = rows ? `<div class="wc-table"><div class="wc-tr wc-tr--head"><span>档案</span><span>存下的消息</span><span>最新到</span><span>图片语音留住</span><span>检查</span><span>完成于</span><span>打开</span></div>${rows}</div>` : '';
    if (!left && !right && !table) return '';
    const total = finite(lists.total) ? lists.total : lists.rows?.length;
    const notes = notesOf([v.sec('archives')?.note, archives?.scope, msgs?.note && `存档条数：${msgs.note}`, local?.note && `本机一共：${local.note}`, m(lists.section || 'owner_archives')?.note]);
    const sectionMetric = m(lists.section || 'owner_archives'), tags = sectionMetric?.note ? { [sectionMetric.note]: U.visitorLabel(sectionMetric, 'note', '这一句说明', viewer) } : {};
    const all5 = total ? `<a class="more wc-all" href="${esc(records(lists.section || 'owner_archives'))}">全部 ${esc(int(total))} 份 ${chev}</a>` : '';
    return `<section class="pj-card glass wc-card wc-arch" id="wc-archives"><div class="wc-head"><b>AI 存过档的聊天</b></div>
      <p class="wc-lead">只算本人点名、AI 存成档案的这几份，不是本机微信的全部聊天。</p>
      ${left || right ? `<div class="wc-sum${left && right ? '' : ' is-one'}">${left}${right}${bar}</div>` : ''}${table}${noteBox(notes, tags)}
      <div class="wc-foot">${all5}${explainBtn(notes)}<span class="wc-cut">${esc(mdTime(lists.at) ? `截止 ${mdTime(lists.at)}` : '')}</span></div></section>`;
  }

  // —— 收到新消息，程序多快备好材料 ——
  function speedHtml(v) {
    const sec = v.sec('realtime'), m = v.metric;
    const rows = SPEED.map(([id, name]) => [m(id), name]).filter(([x]) => x && (x.value?.text || x.text));
    if (!rows.length) return '';
    const secs = x => Array.isArray(x.value?.seconds) ? Math.max(...x.value.seconds.filter(finite)) : 0;
    const max = Math.max(0.001, ...rows.map(([x]) => secs(x)));
    const latest = rows.map(([x]) => x.at || x.value?.at).filter(zoned).sort().at(-1);
    const passed = typeof sec?.about === 'string' && /：(.+)$/.exec(sec.about)?.[1];
    const lead = [md(latest) && `${md(latest)} 真机实测`, passed].filter(Boolean).join(' · ');
    const meas = m('measurements'), val = (v.lists?.arts || lists.arts || []).find(a => a?.kind === 'validation');
    const go = val && U.artifactAction(val, 'public', h => h);
    const notes = notesOf([sec?.note, meas?.scope, meas?.note && `真机验收逐次记录：${meas.note}`, m('text')?.note]);
    const bars = rows.map(([x, name]) => `<li class="wc-speed__row${x.id === 'voice' ? ' is-voice' : ''}"><span class="wc-speed__k">${esc(name)}</span>
      <span class="wc-speed__bar"><i style="width:${(Math.max(0.03, secs(x) / max) * 100).toFixed(1)}%"></i><em>${esc(x.value?.text || x.text)}</em></span></li>`).join('');
    const links = [meas?.section && `<a class="more" href="${esc(records(meas.section))}">${esc(meas.label || '真机验收逐次记录')}${finite(meas.count) ? ` ${esc(int(meas.count))} 条` : ''} ${chev}</a>`,
      go && typeof go.href === 'string' && `<a class="more" href="${esc(go.href)}" target="_blank" rel="noopener">打开验收成品 ${chev}</a>`].filter(Boolean).join('');
    return `<section class="pj-card glass wc-card wc-speed"><div class="wc-head"><b>${esc(sec?.label || '收到新消息，程序多快把材料备好')}</b></div>${lead ? `<p class="wc-lead">${esc(lead)}</p>` : ''}
      <ul class="wc-speed__list">${bars}</ul>${noteBox(notes)}<div class="wc-foot">${explainBtn(notes)}${links}<span class="wc-cut">${esc(md(latest) ? `实测于 ${md(latest)}` : '')}</span></div></section>`;
  }

  // —— 更多数据：先露 6 项，其余点“展开” ——
  let moreOpen = false;
  function moreHtml(v, viewer) {
    const rows = v.moreRows.map(x => [x, amount(x)]).filter(([, h]) => h);
    if (!rows.length) return '';
    const shown = moreOpen ? rows : rows.slice(0, 6), rest = rows.length - 6;
    const notes = notesOf([v.sec('more-data')?.note, ...rows.map(([x]) => x.note && `${x.label}：${x.note}`)]);
    return `<section class="pj-card glass wc-card wc-more"><div class="wc-head"><b>更多数据</b></div>
      <dl class="wc-kv">${shown.map(([x, h]) => `<div><dt>${esc(x.label)}</dt><dd>${h}${U.visitorLabel(x, ['$', 'text', 'value'], '这个读数', viewer)}</dd></div>`).join('')}</dl>${noteBox(notes)}
      <div class="wc-foot">${explainBtn(notes)}${rest > 0 ? `<button type="button" class="more wc-more__btn" aria-expanded="${moreOpen}">${moreOpen ? '收起' : `展开（还有 ${rest} 项）`} ${chev}</button>` : ''}</div></section>`;
  }

  // —— 通栏几块放在两栏卡片上面；数到了、档案表读到了都重画 ——
  let wide = null, last = null;
  function draw() {
    if (!last) return;
    const { d, viewer, boardEl } = last, v = d.wechatView;
    if (!wide) {
      wide = document.createElement('div'); wide.className = 'wc-wide';
      wide.addEventListener('click', e => { if (e.target.closest?.('.wc-more__btn')) { moreOpen = !moreOpen; draw(); } });
    }
    if (wide.nextElementSibling !== boardEl || wide.parentNode !== boardEl.parentNode) boardEl.before(wide);
    const open = [...wide.querySelectorAll('.wc-note:not([hidden])')].map(n => n.closest('.wc-card')?.className);
    const pair = [speedHtml(v), moreHtml(v, viewer)].filter(Boolean);
    wide.innerHTML = [nowHtml(v, viewer), smallCards(v), archivesHtml(v, viewer), pair.length ? `<div class="wc-row wc-row--2${pair.length < 2 ? ' is-one' : ''}">${pair.join('')}</div>` : ''].join('');
    // 重画后，原来点开的说明照旧开着
    for (const card of wide.querySelectorAll('.wc-card')) if (open.includes(card.className)) { const n = card.querySelector('.wc-note'), b = card.querySelector('.wc-explain'); if (n && b) { n.hidden = false; b.setAttribute('aria-expanded', 'true'); } }
  }

  // —— 两栏里右边一张“去哪看细节”；最近改动（page.js 画）放左边 ——
  // —— 最近改动（page.js 画的共用卡）照批准图在卡底加“说明 ›”：两版同一句；卡摆好后补上，重画后再补 ——
  const CHANGES_NOTE = '这个项目最近几次改动，取自项目的提交记录；自动任务约 10 分钟读一次。';
  function changesNote(boardEl) {
    const card = boardEl?.querySelector('.pj-card[data-card="changes"]');
    if (!card || card.querySelector(':scope > .wc-changes-foot')) return;
    card.insertAdjacentHTML('beforeend', `${noteBox([CHANGES_NOTE])}<div class="wc-foot wc-changes-foot">${explainBtn([CHANGES_NOTE])}</div>`);
  }
  function board(d, viewer, graphBlock, boardEl) {
    boardEl?.classList.add('pj-board--wechat');
    requestAnimationFrame(() => changesNote(boardEl));
    if (!d.wechatView) return [];
    last = { d, viewer, boardEl };
    load(viewer, draw);
    draw();
    const links = d.wechatView.details;
    if (!links.length) return [];
    const b = graphBlock('wc-details', '去哪看细节');
    b.group = 'wc-details';
    U.html(b.viz, `<ul class="wc-links">${links.map(x => `<li><a href="${esc(records(x.section))}"><span>${esc(x.label)}</span>${chev}</a></li>`).join('')}</ul>`, false);
    return [b];
  }
  const COLUMNS = { changes: 0, 'wc-details': 1 };
  const columns = keys => !keys.every(k => k in COLUMNS) ? null : window.matchMedia?.('(max-width: 899px)').matches ? keys.map(() => 0) : keys.map(k => COLUMNS[k]);

  window.ProjectPages = Object.assign(window.ProjectPages || {}, { [ID]: { adapt, board, columns, artifactsHref: '#wc-archives' } });
})();
