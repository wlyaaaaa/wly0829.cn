// 四个电脑详情页共用取数、页头和失联提示；画图仍由 LiveViz / LiveChart 完成。
(() => {
  'use strict';
  const U = window.LiveUI, Light = window.LiveLight;
  const { esc, sp } = U;
  let ready = false;
  const BLOCKS = {
    smooth: { stutters: ['summary', 'stutters'], fps: ['fps', 'frametime', 'jitter', 'foreground'], apps: ['apps', 'modes'], resource: ['resource', 'memory', 'bottleneck'], usage: ['usage', 'summary'] },
    power: { power: ['summary', 'power', 'days'], scenes: ['scenes', 'periods'], supply: ['ac', 'rails', 'five_volt'] },
    apps: { resources: ['contention', 'cpu', 'memory'] },
    security: { impersonation: ['summary', 'audits.impersonation'], audit: ['summary', ...['elevated', 'crashes', 'short_lived', 'lolbins', 'silent', 'destinations', 'services', 'lineage', 'sensitive'].map((k) => `audits.${k}`)] },
  };
  function merge(d, keys) {
    const extra = (d?.groups || []).map(g => g.key ?? g.id);
    const packs = [...new Set([...keys, ...extra])].map(key => d?.[key] || d?.groups?.find(g => (g.key ?? g.id) === key)).filter(p => p?.series?.length);
    return { from: d?.window?.from || packs[0]?.from, to: d?.window?.to || packs[0]?.to, off_spans: d?.off_spans,
      series: packs.flatMap((p) => p.series.map((s) => ({ state: p.state, reason: p.reason, ...s, from: s.from || p.from, to: s.to || p.to }))) };
  }
  function noteHtml(notes) {
    return U.mergePrivateRows(notes.map((value, key) => ({ key, value })), { value: row => row.value }).map(row => `<span>${row.private_count ? U.privateSummary(row.private_count) : U.fieldHtml(row.value, { name: '补充说明' })}</span>`).join('');
  }
  function count(c) {
    const hero = document.getElementById('hero'), el = hero.querySelector('[data-part="count"]');
    if (el) el.hidden = true;
    if (!ready) return;
    let notes = hero.querySelector('[data-part="warns"]');
    if (!notes) { notes = document.createElement('ul'); notes.className = 'hero__warns'; notes.dataset.part = 'warns'; el?.after(notes); }
    notes.hidden = !c.warn.length;
    U.html(notes, c.warn.map((g) => `<li><a href="#grp-${esc(g.key)}" data-goto="${esc(g.key)}"><b>${U.fieldHtml(g.name, { name: '分组', place: 'title' })}${g.reason ? '：' : ''}</b></a>${g.reason ? `<span>${U.fieldHtml(g.reason, { name: sp(g.name) })}</span>` : ''}</li>`).join(''));
  }
  function mount({ resource, render, board, merge: combine, statusData = d => d, statusNotes = true, extraLinks = '' }) {
    const hero = document.getElementById('hero'), notices = document.getElementById('notices');
    const part = (name) => hero.querySelector(`[data-part="${name}"]`);
    const heroRead = U.reading(hero.querySelector('.card__body'), { ghost: U.ghost.card(1), name: document.title.split(' · ')[0] });
    const params = new URLSearchParams(location.search);
    const route = (p) => p + (params.has('fixture') ? `${p.includes('?') ? '&' : '?'}fixture=${encodeURIComponent(params.get('fixture'))}` : '');
    let data = null, at = null, link = null, lit = false, offline = false;
    const needsPc = () => document.querySelectorAll('[data-gf]').forEach((a) => a.setAttribute('data-needs-pc', ''));
    const draw = () => {
      board?.blocks(data, BLOCKS[resource.split('/')[1]], offline);
      const d = window.LiveViz.blockData(data, offline); render(d, { at });
      if (board) board.data(combine ? combine(d) : merge(d, [])); needsPc();
      part('note').querySelectorAll('[data-why]').forEach(note => note.remove());
      const state = U.status(statusData(d));
      Light.tone(hero, d);
      const head = part('head');
      head.querySelectorAll('.lamp').forEach(lamp => lamp.remove());
      if (state.lamp) head.insertAdjacentHTML('afterbegin', state.lamp);
      if (statusNotes && state.note) { const note = document.createElement('span'); note.dataset.why = ''; note.className = 'stat-gap'; U.html(note, state.note); part('note').append(note); part('note').hidden = false; }
    };
    Light.add(hero);
    for (const a of document.querySelectorAll('.stage a[href^="/live/"]')) a.href = route(a.getAttribute('href'));
    document.querySelector('[data-back]')?.addEventListener('click', U.restoreBack);
    function links() {
      const href = data?.grafana?.href;
      U.html(part('links'), `<a class="more more--link" href="${esc(route('/live/computer/'))}">电脑 <span class="more__chev">›</span></a>` + (!href ? '' : `<a class="more more--link" data-needs-pc href="${esc(href)}" target="_blank" rel="noopener">Grafana <span class="more__chev">↗</span></a>`) + extraLinks);
    }
    const bar = U.topbar({ ask: () => data ? `请看${document.title.split(' · ')[0]}${at ? `（${U.time(at)} 的数）` : ''}：${U.sp(data.text) || U.collectionText('', data)}。请说明现在的情况。` : '' });
    hero.addEventListener('click', (e) => {
      const a = e.target.closest('[data-goto]');
      if (!a) return;
      e.preventDefault(); board.open(a.dataset.goto, true);
      document.querySelector(`#board .grp[data-key="${CSS.escape(a.dataset.goto)}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    links(); render(null, {});
    window.Live.watch(resource, null, {
      phase(s) { if (s.data == null) { heroRead.set(s); board?.phase(s); } },
      data(d, meta) {
        data = d; at = meta.at; ready = d != null;
        U.html(part('head'), U.head(d?.text || (U.offline?.() ? document.title.split(' · ')[0] : U.collectionText('', d)), { lamp: false }));
        const notes = [].concat(d?.note || []).filter(Boolean);
        part('note').hidden = !notes.length;
        U.html(part('note'), noteHtml(notes));
        links(); draw();
        heroRead.done();
        if (!lit) { lit = true; requestAnimationFrame(() => Light.lightUp([hero, notices, ...(board?.cards() || [])])); }
      },
      link(state) {
        link = state.link; bar?.set(state); Light.offline(state.offline); links();
        const off = link?.heartbeat === 'stopped';
        if (offline !== (off || state.offline)) { offline = off || state.offline; if (data) draw(); }
        needsPc();
        // 连不上的原因和截止时刻只写在页顶那张连不上卡片里（live-ui.js 的 connection），这里不再重复一枚“连接情况”。
        if (!data && !state.offline && state.text && (state.phase === 'none' || state.phase === 'gone')) U.html(part('head'), U.head(state.text, { lamp: false }));
        [hero.querySelector('.card__body'), ...(board?.cards() || [])].forEach(el => U.blockNote(el, state));
      },
    });
    requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));
  }
  window.LiveDetail = { mount, merge, count, noteHtml };
})();
